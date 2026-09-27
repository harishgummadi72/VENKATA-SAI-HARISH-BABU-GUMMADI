// Server-only Gemini provider configuration
// Never import this file into client components

if (typeof window !== "undefined") {
  throw new Error("gemini.server.ts can only be executed on the server.");
}

/**
 * Checks if the Gemini API key is configured in the server environment.
 * Strictly reads only process.env.GEMINI_API_KEY.
 * Never logs or exposes the key.
 */
export function isGeminiConfigured(): boolean {
  const key = process.env.GEMINI_API_KEY;
  return typeof key === "string" && key.trim().length > 0 && !key.includes("your_gemini_api_key_here");
}

/**
 * Retrieves the Gemini API key for server-side requests only.
 * Returns null if not configured.
 */
export function getGeminiApiKey(): string | null {
  if (!isGeminiConfigured()) {
    return null;
  }
  return process.env.GEMINI_API_KEY!.trim();
}

export interface GeminiMessagePart {
  text: string;
}

export interface GeminiContent {
  role: "user" | "model";
  parts: GeminiMessagePart[];
}

/**
 * Initiates a streaming request to Google Gemini API with fallback redundancy.
 * Defaults to gemini-3.6-flash with automated fallback to gemini-flash-latest.
 * The API key is sent strictly server-to-server and is never returned to the client.
 */
export async function streamGeminiContent(
  contents: GeminiContent[],
  systemInstruction?: string,
  signal?: AbortSignal
): Promise<Response> {
  const key = getGeminiApiKey();
  if (!key) {
    throw new Error("AI_NOT_CONFIGURED");
  }

  const primaryModel = process.env.GEMINI_MODEL?.trim() || "gemini-3.6-flash";
  const fallbackModel = "gemini-flash-latest";

  const payload: Record<string, unknown> = {
    contents,
    generationConfig: {
      maxOutputTokens: 900,
      temperature: 0.25
    }
  };

  if (systemInstruction) {
    payload.system_instruction = {
      parts: [{ text: systemInstruction }]
    };
  }

  const bodyString = JSON.stringify(payload);

  const fetchStream = async (model: string) => {
    const endpoint = `https://generativelanguage.googleapis.com/v1beta/models/${model}:streamGenerateContent?alt=sse`;
    return fetch(endpoint, {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
        "x-goog-api-key": key
      },
      body: bodyString,
      signal
    });
  };

  let res = await fetchStream(primaryModel);

  // If primary model fails with 404 (e.g. deprecated model name) or 503 (temporary spike), retry with fallback
  if (!res.ok && (res.status === 404 || res.status === 503) && primaryModel !== fallbackModel) {
    console.warn(`[Gemini Provider] Primary model ${primaryModel} returned ${res.status}. Falling back to ${fallbackModel}...`);
    try {
      res = await fetchStream(fallbackModel);
    } catch (fallbackErr) {
      console.error("[Gemini Provider] Fallback model request failed:", fallbackErr);
    }
  }

  return res;
}
