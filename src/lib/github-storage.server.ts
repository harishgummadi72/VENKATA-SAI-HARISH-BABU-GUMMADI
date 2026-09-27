import fs from "fs";
import path from "path";

const DEFAULT_REPO = "harishgummadi72/portfolio";
const DEFAULT_BRANCH = "main";
const DEFAULT_PATH = "data/portfolio-store.json";

const LOCAL_DATA_DIR = path.join(process.cwd(), "data");
const LOCAL_DATA_FILE = path.join(LOCAL_DATA_DIR, "portfolio-store.json");

export interface StoragePersistenceResult {
  success: boolean;
  destination: "github" | "local";
  message: string;
  error?: string;
  sha?: string;
}

export function isGitHubStorageConfigured(): boolean {
  const token = process.env.GITHUB_CONTENT_TOKEN?.trim();
  return Boolean(token && !token.includes("your_github_personal_access_token_here"));
}

export function getGitHubStorageConfig() {
  const token = process.env.GITHUB_CONTENT_TOKEN?.trim();
  const repo = process.env.GITHUB_REPO?.trim() || DEFAULT_REPO;
  const branch = process.env.GITHUB_BRANCH?.trim() || DEFAULT_BRANCH;
  const contentPath = process.env.GITHUB_CONTENT_PATH?.trim() || DEFAULT_PATH;
  return { token, repo, branch, contentPath };
}

/**
 * Reads the latest content from GitHub Contents API with cache: "no-store".
 */
export async function fetchContentFromGitHub<T = unknown>(): Promise<{ data: T; sha: string }> {
  const { token, repo, contentPath } = getGitHubStorageConfig();
  if (!token) {
    throw new Error("GITHUB_CONTENT_TOKEN is not configured.");
  }

  const url = `https://api.github.com/repos/${repo}/contents/${contentPath}`;
  const response = await fetch(url, {
    headers: {
      Authorization: `Bearer ${token}`,
      Accept: "application/vnd.github+json",
      "X-GitHub-Api-Version": "2022-11-28",
      "User-Agent": "HarishBabuPortfolio-Studio"
    },
    cache: "no-store"
  });

  if (!response.ok) {
    const errText = await response.text();
    throw new Error(`GitHub Contents API error (${response.status}): ${errText}`);
  }

  const result = await response.json();
  const contentBase64 = result.content?.replace(/\n/g, "") || "";
  const decodedString = Buffer.from(contentBase64, "base64").toString("utf-8");
  const data = JSON.parse(decodedString) as T;

  return { data, sha: result.sha };
}

/**
 * Commits updated content to GitHub repository via Contents API.
 * Reports success only when GitHub returns a valid commit SHA.
 */
export async function commitContentToGitHub<T = unknown>(
  data: T,
  commitMessage = "Update portfolio content via Royal Atelier Studio"
): Promise<{ sha: string }> {
  const { token, repo, branch, contentPath } = getGitHubStorageConfig();
  if (!token) {
    throw new Error("GITHUB_CONTENT_TOKEN is not configured.");
  }

  // 1. Get current SHA
  let currentSha = "";
  try {
    const existing = await fetchContentFromGitHub();
    currentSha = existing.sha;
  } catch (error) {
    console.warn("Could not fetch existing file SHA, creating new file if absent:", error);
  }

  // 2. Prepare payload
  const jsonString = JSON.stringify(data, null, 2);
  const contentBase64 = Buffer.from(jsonString, "utf-8").toString("base64");

  const url = `https://api.github.com/repos/${repo}/contents/${contentPath}`;
  const bodyPayload: Record<string, unknown> = {
    message: commitMessage,
    content: contentBase64,
    branch: branch
  };
  if (currentSha) {
    bodyPayload.sha = currentSha;
  }

  const putResponse = await fetch(url, {
    method: "PUT",
    headers: {
      Authorization: `Bearer ${token}`,
      Accept: "application/vnd.github+json",
      "Content-Type": "application/json",
      "X-GitHub-Api-Version": "2022-11-28",
      "User-Agent": "HarishBabuPortfolio-Studio"
    },
    body: JSON.stringify(bodyPayload)
  });

  if (!putResponse.ok) {
    const errorBody = await putResponse.text();
    throw new Error(`GitHub Commit failed (${putResponse.status}): ${errorBody}`);
  }

  const putResult = await putResponse.json();
  const commitSha = putResult.commit?.sha;
  if (!commitSha) {
    throw new Error("GitHub Contents API did not return a commit SHA.");
  }

  return { sha: commitSha };
}

/**
 * Reads portfolio storage:
 * Always fetches from GitHub with cache: "no-store" when configured.
 * No in-memory cache and no /tmp fallback.
 */
export async function readPortfolioStorage<T = unknown>(fallbackInitial: T): Promise<T> {
  // If GitHub token is present, always fetch latest from GitHub
  if (isGitHubStorageConfigured()) {
    try {
      const { data } = await fetchContentFromGitHub<T>();
      return data;
    } catch (err) {
      console.error("Error reading from GitHub Contents API:", err);
    }
  }

  // Fallback to local file for localhost development
  try {
    if (fs.existsSync(LOCAL_DATA_FILE)) {
      const content = fs.readFileSync(LOCAL_DATA_FILE, "utf-8");
      return JSON.parse(content) as T;
    }
  } catch (error) {
    console.warn("Could not read local data file:", error);
  }

  return fallbackInitial;
}

/**
 * Saves portfolio storage:
 * On Vercel production, GITHUB_CONTENT_TOKEN is strictly required.
 * Never writes to /tmp or caches in memoryStore.
 * Reports success only when GitHub returns a commit SHA.
 * Local JSON storage is strictly kept for localhost development.
 */
export async function writePortfolioStorage<T = unknown>(data: T): Promise<StoragePersistenceResult> {
  const isVercel = Boolean(process.env.VERCEL);
  const isProduction = process.env.NODE_ENV === "production" || isVercel;

  // 1. On Vercel production, GITHUB_CONTENT_TOKEN is strictly required
  if (isVercel || isProduction) {
    if (!isGitHubStorageConfigured()) {
      return {
        success: false,
        destination: "github",
        message: "Publish failed: GITHUB_CONTENT_TOKEN is required on Vercel production. Please configure GITHUB_CONTENT_TOKEN in Vercel environment variables.",
        error: "Missing GITHUB_CONTENT_TOKEN in production environment."
      };
    }
  }

  // 2. If GitHub storage is configured, push commit to repository
  if (isGitHubStorageConfigured()) {
    try {
      const commitRes = await commitContentToGitHub(data);
      if (!commitRes.sha) {
        return {
          success: false,
          destination: "github",
          message: "Publish failed: GitHub did not return a commit SHA.",
          error: "Missing commit SHA from GitHub response."
        };
      }

      // Also update local copy if filesystem is writable (localhost dev with token)
      try {
        if (!fs.existsSync(LOCAL_DATA_DIR)) fs.mkdirSync(LOCAL_DATA_DIR, { recursive: true });
        fs.writeFileSync(LOCAL_DATA_FILE, JSON.stringify(data, null, 2), "utf-8");
      } catch {
        // Expected in serverless
      }

      return {
        success: true,
        destination: "github",
        sha: commitRes.sha,
        message: `Successfully committed and published updates to GitHub repository (${commitRes.sha.slice(0, 7)}).`
      };
    } catch (error: unknown) {
      const message = error instanceof Error ? error.message : String(error);
      return {
        success: false,
        destination: "github",
        message: `Failed to commit changes to GitHub: ${message}`,
        error: message
      };
    }
  }

  // 3. Local JSON storage strictly for localhost development
  try {
    if (!fs.existsSync(LOCAL_DATA_DIR)) {
      fs.mkdirSync(LOCAL_DATA_DIR, { recursive: true });
    }
    fs.writeFileSync(LOCAL_DATA_FILE, JSON.stringify(data, null, 2), "utf-8");

    return {
      success: true,
      destination: "local",
      message: "Updates saved to local data/portfolio-store.json for localhost development."
    };
  } catch (error) {
    console.error("Failed to write to local storage file:", error);
    return {
      success: false,
      destination: "local",
      message: "Failed to write to local data file.",
      error: error instanceof Error ? error.message : "Filesystem write failure"
    };
  }
}
