"use client";

import React, { useState, useEffect, useMemo, useCallback } from "react";
import Link from "next/link";
import { 
  ShieldAlert, 
  Save, 
  Plus, 
  Trash2, 
  Eye, 
  CheckCircle, 
  Layers, 
  Trophy, 
  Wrench, 
  ArrowLeft,
  AlertTriangle,
  LogOut,
  ChevronUp,
  ChevronDown,
  ExternalLink,
  Briefcase,
  BookOpen,
  User,
  KeyRound,
  Lock,
  X
} from "lucide-react";
import Monogram from "@/components/ui/Monogram";
import type { 
  Project, 
  Skill, 
  Achievement, 
  Credential, 
  Experience, 
  CurrentlyLearningItem
} from "@/types/portfolio";
import type { StorageData } from "@/lib/content-store";

type TabKey = "projects" | "achievements" | "skills" | "experience" | "learning" | "profile";

export default function StudioPage() {
  // Auth state
  const [sessionChecking, setSessionChecking] = useState(true);
  const [isAuthenticated, setIsAuthenticated] = useState(false);
  const [authenticatedEmail, setAuthenticatedEmail] = useState("");
  const [loginPassword, setLoginPassword] = useState("");
  const [authError, setAuthError] = useState("");
  const [isSubmittingLogin, setIsSubmittingLogin] = useState(false);

  // Content state
  const [content, setContent] = useState<StorageData | null>(null);
  const [savedSnapshot, setSavedSnapshot] = useState<string>("");
  const [activeTab, setActiveTab] = useState<TabKey>("projects");
  const [saveStatus, setSaveStatus] = useState<"idle" | "saving" | "saved" | "error">("idle");
  const [statusMessage, setStatusMessage] = useState("");

  // Delete modal state
  const [deleteTarget, setDeleteTarget] = useState<{
    type: "project" | "achievement" | "credential" | "skill" | "experience" | "learning";
    id: string;
    name: string;
  } | null>(null);

  const fetchStudioData = useCallback(async () => {
    try {
      const res = await fetch("/api/studio");
      if (res.ok) {
        const data = (await res.json()) as StorageData;
        setContent(data);
        setSavedSnapshot(JSON.stringify(data));
      } else {
        const err = await res.json().catch(() => ({}));
        setStatusMessage(err.error || "Failed to fetch studio content.");
        setSaveStatus("error");
      }
    } catch {
      setStatusMessage("Network error while accessing studio content.");
      setSaveStatus("error");
    }
  }, []);

  // Check existing session on mount
  useEffect(() => {
    async function checkSession() {
      try {
        const res = await fetch("/api/studio/auth/session");
        if (res.ok) {
          const data = await res.json();
          if (data.authenticated && data.user?.email) {
            setIsAuthenticated(true);
            setAuthenticatedEmail(data.user.email);
            await fetchStudioData();
          }
        }
      } catch (err) {
        console.error("Session check failed:", err);
      } finally {
        setSessionChecking(false);
      }
    }
    checkSession();
  }, [fetchStudioData]);

  // Has unsaved changes check
  const hasUnsavedChanges = useMemo(() => {
    if (!content || !savedSnapshot) return false;
    return JSON.stringify(content) !== savedSnapshot;
  }, [content, savedSnapshot]);

  // Warn on tab close with unsaved changes
  useEffect(() => {
    const handleBeforeUnload = (e: BeforeUnloadEvent) => {
      if (hasUnsavedChanges) {
        e.preventDefault();
        e.returnValue = "";
      }
    };
    window.addEventListener("beforeunload", handleBeforeUnload);
    return () => window.removeEventListener("beforeunload", handleBeforeUnload);
  }, [hasUnsavedChanges]);

  // Login handler
  const handleLoginSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setAuthError("");
    setIsSubmittingLogin(true);

    try {
      const res = await fetch("/api/studio/auth/login", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          password: loginPassword
        })
      });

      const data = await res.json().catch(() => ({}));

      if (res.ok && data.success) {
        setIsAuthenticated(true);
        setAuthenticatedEmail(data.user?.email || "gummadivenkatasaiharishbabu@gmail.com");
        setLoginPassword("");
        await fetchStudioData();
      } else {
        setAuthError(data.error || "Authentication failed. Please check your credentials.");
      }
    } catch {
      setAuthError("Network error occurred during login. Please try again.");
    } finally {
      setIsSubmittingLogin(false);
    }
  };

  // Logout handler
  const handleLogout = async () => {
    if (hasUnsavedChanges) {
      const confirmLeave = window.confirm(
        "You have unsaved changes. Are you sure you want to log out without publishing?"
      );
      if (!confirmLeave) return;
    }

    try {
      await fetch("/api/studio/auth/logout", { method: "POST" });
    } catch {
      // Proceed with client logout
    }

    setIsAuthenticated(false);
    setAuthenticatedEmail("");
    setContent(null);
    setSavedSnapshot("");
    setLoginPassword("");
  };

  // Save / Publish handler
  const handleSave = async () => {
    if (!content) return;
    setSaveStatus("saving");
    setStatusMessage("");

    try {
      const res = await fetch("/api/studio", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(content)
      });

      const result = await res.json().catch(() => ({}));
      if (res.ok && result.success) {
        setSaveStatus("saved");
        setSavedSnapshot(JSON.stringify(content));
        setStatusMessage(
          result.destination === "github"
            ? "Published and committed to GitHub repository. Live site and AI updated!"
            : (result.message || "Changes published successfully.")
        );
        setTimeout(() => setSaveStatus("idle"), 5000);
      } else {
        setSaveStatus("error");
        setStatusMessage(result.error || "Failed to publish updates to storage.");
      }
    } catch (err: unknown) {
      setSaveStatus("error");
      setStatusMessage(err instanceof Error ? err.message : "Error communicating with publishing pipeline.");
    }
  };

  // Execution of confirmed deletion
  const executeDelete = useCallback(() => {
    if (!deleteTarget || !content) return;
    const { type, id } = deleteTarget;

    if (type === "project") {
      setContent(prev => prev ? { ...prev, projects: prev.projects.filter(p => p.id !== id) } : null);
    } else if (type === "achievement") {
      setContent(prev => prev ? { ...prev, achievements: prev.achievements.filter(a => a.id !== id) } : null);
    } else if (type === "credential") {
      setContent(prev => prev ? { ...prev, credentials: prev.credentials.filter(c => c.id !== id) } : null);
    } else if (type === "skill") {
      setContent(prev => prev ? { ...prev, skills: prev.skills.filter(s => s.id !== id) } : null);
    } else if (type === "experience") {
      setContent(prev => prev ? { ...prev, experience: prev.experience.filter(e => e.id !== id) } : null);
    } else if (type === "learning") {
      setContent(prev => prev ? { ...prev, currentlyLearning: prev.currentlyLearning.filter(l => l.id !== id) } : null);
    }

    setDeleteTarget(null);
  }, [deleteTarget, content]);

  // -------------------------------------------------------------
  // RENDER: Loading Session
  // -------------------------------------------------------------
  if (sessionChecking) {
    return (
      <div className="min-h-screen bg-[#080808] flex items-center justify-center p-6 text-sm text-[#B7B7B7]">
        <div className="flex items-center gap-3">
          <div className="w-4 h-4 border-2 border-[#FF7A00] border-t-transparent rounded-full animate-spin" />
          <span>Verifying studio credentials...</span>
        </div>
      </div>
    );
  }

  // -------------------------------------------------------------
  // RENDER: Unauthenticated Login Screen
  // -------------------------------------------------------------
  if (!isAuthenticated) {
    return (
      <div className="min-h-screen bg-[#080808] flex items-center justify-center p-6 selection:bg-[#FF7A00] selection:text-black">
        <div className="max-w-md w-full bg-[#151515] rounded-2xl border border-[#262626] p-8 shadow-[0_16px_40px_rgba(89,11,32,0.06)] font-sans">
          <div className="flex items-center gap-3 mb-6">
            <Monogram className="w-10 h-11" />
            <div>
              <h1 className="font-display text-xl text-[#F5F5F5]">Harish Babu Studio</h1>
              <span className="text-xs text-[#B7B7B7]">Secure Owner-Only CMS</span>
            </div>
          </div>

          <div className="p-4 bg-[#121212] rounded-xl border border-[#262626] mb-6 text-xs text-[#B7B7B7] leading-relaxed">
            <div className="flex items-center gap-1.5 text-[#FF7A00] font-semibold mb-1">
              <ShieldAlert className="w-4 h-4 text-[#FF9D33]" />
              <span>Owner Authentication Gate</span>
            </div>
            Sign in with your owner credentials to manage portfolio projects, achievements, credentials, skills, experience, and identity.
          </div>

          {authError && (
            <div className="p-3.5 bg-red-50 border border-red-200 rounded-xl text-xs text-red-800 mb-6 flex items-start gap-2">
              <AlertTriangle className="w-4 h-4 text-red-600 shrink-0 mt-0.5" />
              <span>{authError}</span>
            </div>
          )}

          <form onSubmit={handleLoginSubmit} className="space-y-4">
            <div>
              <label className="block text-xs font-medium text-[#F5F5F5] mb-1.5 flex items-center gap-1.5">
                <Lock className="w-3.5 h-3.5 text-[#FF9D33]" />
                <span>Studio Master Password</span>
              </label>
              <input
                type="password"
                required
                autoComplete="current-password"
                placeholder="Enter STUDIO_ADMIN_PASSWORD"
                value={loginPassword}
                onChange={(e) => setLoginPassword(e.target.value)}
                className="w-full px-3.5 py-2.5 rounded-xl border border-[#262626] bg-[#121212] text-sm text-[#F5F5F5] placeholder-[#B7B7B7]/50 focus:outline-none focus:ring-2 focus:ring-[#FF7A00]"
              />
            </div>

            <button
              type="submit"
              disabled={isSubmittingLogin}
              className="w-full py-3 px-4 rounded-xl bg-[#FF7A00] text-black font-semibold text-xs font-semibold hover:bg-[#FF8C1A] transition-all flex items-center justify-center gap-2 cursor-pointer shadow-sm disabled:opacity-50"
            >
              {isSubmittingLogin ? (
                <span>Authenticating...</span>
              ) : (
                <>
                  <KeyRound className="w-4 h-4 text-[#FF9D33]" />
                  <span>Sign In to Studio</span>
                </>
              )}
            </button>
          </form>

          <div className="mt-6 pt-4 border-t border-[#262626] text-center">
            <Link href="/" className="text-xs text-[#FF7A00] hover:underline inline-flex items-center gap-1">
              <ArrowLeft className="w-3.5 h-3.5" />
              <span>Return to Public Portfolio</span>
            </Link>
          </div>
        </div>
      </div>
    );
  }

  // -------------------------------------------------------------
  // RENDER: Loading Studio Content
  // -------------------------------------------------------------
  if (!content) {
    return (
      <div className="min-h-screen bg-[#080808] flex items-center justify-center p-6 text-sm text-[#B7B7B7]">
        <div className="flex items-center gap-3">
          <div className="w-4 h-4 border-2 border-[#FF7A00] border-t-transparent rounded-full animate-spin" />
          <span>Loading portfolio content store...</span>
        </div>
      </div>
    );
  }

  // -------------------------------------------------------------
  // RENDER: Authenticated Studio CMS
  // -------------------------------------------------------------
  return (
    <div className="min-h-screen bg-[#080808] flex flex-col font-sans selection:bg-[#FF7A00] selection:text-black">
      {/* Studio Header */}
      <header className="w-full border-b border-[#262626] bg-[#151515] sticky top-0 z-30 px-6 lg:px-12 py-3.5 flex flex-wrap items-center justify-between gap-4">
        <div className="flex items-center gap-4">
          <Link href="/">
            <Monogram className="w-8 h-9" />
          </Link>
          <div>
            <div className="flex items-center gap-2">
              <span className="font-display text-lg text-[#F5F5F5] font-medium">Harish Babu Studio</span>
              <span className="px-2 py-0.5 rounded text-[10px] bg-[#FF7A00]/10 text-[#FF7A00] font-semibold">
                Owner Mode
              </span>
              {hasUnsavedChanges && (
                <span className="px-2 py-0.5 rounded text-[10px] bg-amber-100 text-amber-900 font-semibold flex items-center gap-1">
                  <span className="w-1.5 h-1.5 rounded-full bg-amber-500 animate-pulse" />
                  Unsaved Changes
                </span>
              )}
            </div>
            <span className="text-[11px] text-[#B7B7B7]">{authenticatedEmail}</span>
          </div>
        </div>

        <div className="flex items-center gap-3">
          <Link
            href="/"
            target="_blank"
            className="inline-flex items-center gap-1.5 px-3 py-2 rounded-lg border border-[#262626] text-xs text-[#B7B7B7] hover:text-[#F5F5F5] hover:border-[#FF9D33] transition-colors"
          >
            <Eye className="w-3.5 h-3.5" />
            <span>Public Site</span>
          </Link>

          <button
            onClick={handleSave}
            disabled={saveStatus === "saving"}
            className={`inline-flex items-center gap-2 px-5 py-2 rounded-lg text-xs font-semibold transition-all cursor-pointer shadow-sm disabled:opacity-50 ${
              hasUnsavedChanges
                ? "bg-[#FF7A00] text-black font-semibold hover:bg-[#FF8C1A] ring-2 ring-[#FF9D33]"
                : "bg-[#F5F5F5] text-white hover:bg-[#FF7A00]"
            }`}
          >
            <Save className="w-3.5 h-3.5 text-[#FF9D33]" />
            <span>{saveStatus === "saving" ? "Publishing..." : hasUnsavedChanges ? "Publish Updates*" : "Publish Updates"}</span>
          </button>

          <button
            onClick={handleLogout}
            title="Log out of Studio"
            className="inline-flex items-center gap-1.5 px-3 py-2 rounded-lg border border-[#262626] text-xs text-red-700 hover:bg-red-50 hover:border-red-300 transition-colors cursor-pointer"
          >
            <LogOut className="w-3.5 h-3.5" />
            <span className="hidden sm:inline">Logout</span>
          </button>
        </div>
      </header>

      {/* Save Status Banner */}
      {saveStatus === "saved" && (
        <div className="bg-emerald-50 border-b border-emerald-200 px-6 py-2.5 text-xs text-emerald-800 flex items-center justify-center gap-2">
          <CheckCircle className="w-4 h-4 text-emerald-600" />
          <span>{statusMessage}</span>
        </div>
      )}

      {saveStatus === "error" && (
        <div className="bg-red-50 border-b border-red-200 px-6 py-2.5 text-xs text-red-800 flex items-center justify-center gap-2">
          <AlertTriangle className="w-4 h-4 text-red-600 shrink-0" />
          <span>{statusMessage}</span>
        </div>
      )}

      {hasUnsavedChanges && saveStatus !== "saved" && (
        <div className="bg-amber-50 border-b border-amber-200 px-6 py-2 text-xs text-amber-900 flex items-center justify-center gap-2">
          <span>You have unsaved changes in the studio. Click <strong>Publish Updates</strong> to commit your changes to production.</span>
        </div>
      )}

      {/* Navigation Tabs */}
      <div className="border-b border-[#262626] bg-[#121212] px-6 lg:px-12 flex gap-6 overflow-x-auto text-xs font-medium">
        {[
          { id: "projects", label: "Projects", icon: Layers },
          { id: "achievements", label: "Achievements & Credentials", icon: Trophy },
          { id: "skills", label: "Skills", icon: Wrench },
          { id: "experience", label: "Experience", icon: Briefcase },
          { id: "learning", label: "Currently Learning", icon: BookOpen },
          { id: "profile", label: "Profile & Identity", icon: User }
        ].map((tab) => {
          const Icon = tab.icon;
          const isActive = activeTab === tab.id;
          return (
            <button
              key={tab.id}
              onClick={() => setActiveTab(tab.id as TabKey)}
              className={`py-3.5 border-b-2 flex items-center gap-2 transition-all cursor-pointer whitespace-nowrap ${
                isActive
                  ? "border-[#FF7A00] text-[#FF7A00] font-semibold"
                  : "border-transparent text-[#B7B7B7] hover:text-[#F5F5F5]"
              }`}
            >
              <Icon className="w-3.5 h-3.5" />
              <span>{tab.label}</span>
            </button>
          );
        })}
      </div>

      {/* Main Studio Content Area */}
      <main className="flex-1 max-w-[1400px] mx-auto w-full p-6 lg:p-12">
        {/* ========================================================= */}
        {/* TAB 1: PROJECTS */}
        {/* ========================================================= */}
        {activeTab === "projects" && (
          <div className="space-y-6">
            <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
              <div>
                <h2 className="font-display text-2xl text-[#F5F5F5]">Manage Projects</h2>
                <p className="text-xs text-[#B7B7B7]">
                  Add, edit, reorder, and configure live & repository links for project case studies.
                </p>
              </div>
              <button
                onClick={() => {
                  const newProj: Project = {
                    id: `proj-${Date.now()}`,
                    slug: `new-project-${Date.now().toString().slice(-4)}`,
                    title: "New Project Title",
                    tagline: "Brief description of the digital product.",
                    category: "Frontend & UI/UX",
                    role: "Frontend Developer",
                    contribution: "Led design and frontend implementation.",
                    featured: true,
                    status: "In Development",
                    technologies: ["React", "TypeScript", "Tailwind CSS"],
                    overview: "Project overview and objectives.",
                    problem: "Specific problem addressed.",
                    intendedUsers: ["Enrolled students", "Faculty"],
                    teamContext: "Independent development.",
                    featuresBuilt: ["Initial responsive interface prototype"],
                    challenges: ["Balancing performance with visual polish"],
                    lessons: ["Direct user testing is essential"],
                    limitations: ["Prototype stage"],
                    liveUrl: "",
                    repoUrl: "",
                    published: false,
                    order: content.projects.length + 1,
                    previewType: "authentic"
                  };
                  setContent({ ...content, projects: [...content.projects, newProj] });
                }}
                className="inline-flex items-center gap-1.5 px-4 py-2 rounded-lg bg-[#FF7A00] text-black font-semibold text-xs font-medium hover:bg-[#FF8C1A] cursor-pointer self-start sm:self-auto shadow-xs"
              >
                <Plus className="w-3.5 h-3.5" />
                <span>Add New Project</span>
              </button>
            </div>

            <div className="space-y-6">
              {content.projects.map((proj, index) => (
                <div
                  key={proj.id}
                  className="p-6 bg-[#151515] rounded-xl border border-[#262626] shadow-xs space-y-4"
                >
                  {/* Card Header & Controls */}
                  <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 pb-4 border-b border-[#262626]">
                    <div className="flex items-center gap-3">
                      <span className="font-display text-lg text-[#F5F5F5] font-medium">
                        {proj.title || "Untitled Project"}
                      </span>
                      <span
                        className={`text-[10px] px-2.5 py-0.5 rounded-full font-medium ${
                          proj.published
                            ? "bg-emerald-100 text-emerald-800"
                            : "bg-amber-100 text-amber-800"
                        }`}
                      >
                        {proj.published ? "Published" : "Draft"}
                      </span>
                      {proj.featured && (
                        <span className="text-[10px] px-2 py-0.5 rounded-full bg-[#FF9D33]/20 text-[#F5F5F5] font-medium">
                          Featured
                        </span>
                      )}
                    </div>

                    <div className="flex items-center gap-2">
                      {/* Reorder Buttons */}
                      <button
                        disabled={index === 0}
                        onClick={() => {
                          if (index === 0) return;
                          const newProjects = [...content.projects];
                          const temp = newProjects[index - 1];
                          newProjects[index - 1] = newProjects[index];
                          newProjects[index] = temp;
                          newProjects.forEach((p, idx) => (p.order = idx + 1));
                          setContent({ ...content, projects: newProjects });
                        }}
                        className="p-1.5 border border-[#262626] rounded text-[#B7B7B7] hover:text-[#F5F5F5] disabled:opacity-30 cursor-pointer"
                        title="Move Up"
                      >
                        <ChevronUp className="w-3.5 h-3.5" />
                      </button>
                      <button
                        disabled={index === content.projects.length - 1}
                        onClick={() => {
                          if (index === content.projects.length - 1) return;
                          const newProjects = [...content.projects];
                          const temp = newProjects[index + 1];
                          newProjects[index + 1] = newProjects[index];
                          newProjects[index] = temp;
                          newProjects.forEach((p, idx) => (p.order = idx + 1));
                          setContent({ ...content, projects: newProjects });
                        }}
                        className="p-1.5 border border-[#262626] rounded text-[#B7B7B7] hover:text-[#F5F5F5] disabled:opacity-30 cursor-pointer"
                        title="Move Down"
                      >
                        <ChevronDown className="w-3.5 h-3.5" />
                      </button>

                      {/* Publish / Draft Toggle */}
                      <button
                        onClick={() => {
                          const updated = content.projects.map((p) =>
                            p.id === proj.id ? { ...p, published: !p.published } : p
                          );
                          setContent({ ...content, projects: updated });
                        }}
                        className={`text-xs px-3 py-1.5 rounded-md font-medium border transition-colors cursor-pointer ${
                          proj.published
                            ? "border-emerald-300 text-emerald-800 hover:bg-emerald-50"
                            : "border-amber-300 text-amber-800 hover:bg-amber-50"
                        }`}
                      >
                        {proj.published ? "Unpublish to Draft" : "Mark Published"}
                      </button>

                      {/* Delete Button */}
                      <button
                        onClick={() => setDeleteTarget({ type: "project", id: proj.id, name: proj.title })}
                        className="p-1.5 text-red-600 hover:bg-red-50 rounded border border-transparent hover:border-red-200 transition-colors cursor-pointer"
                        title="Delete project"
                      >
                        <Trash2 className="w-4 h-4" />
                      </button>
                    </div>
                  </div>

                  {/* Fields Grid */}
                  <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4 text-xs">
                    <div>
                      <label className="block text-[#B7B7B7] font-medium mb-1">Project Title</label>
                      <input
                        type="text"
                        value={proj.title}
                        onChange={(e) => {
                          const updated = content.projects.map((p) =>
                            p.id === proj.id ? { ...p, title: e.target.value } : p
                          );
                          setContent({ ...content, projects: updated });
                        }}
                        className="w-full px-3 py-1.5 rounded border border-[#262626] bg-[#121212] text-[#F5F5F5]"
                      />
                    </div>

                    <div>
                      <label className="block text-[#B7B7B7] font-medium mb-1">Slug (URL identifier)</label>
                      <input
                        type="text"
                        value={proj.slug}
                        onChange={(e) => {
                          const updated = content.projects.map((p) =>
                            p.id === proj.id ? { ...p, slug: e.target.value } : p
                          );
                          setContent({ ...content, projects: updated });
                        }}
                        className="w-full px-3 py-1.5 rounded border border-[#262626] bg-[#121212] text-[#F5F5F5]"
                      />
                    </div>

                    <div>
                      <label className="block text-[#B7B7B7] font-medium mb-1">Category</label>
                      <select
                        value={proj.category}
                        onChange={(e) => {
                          const updated = content.projects.map((p) =>
                            p.id === proj.id ? { ...p, category: e.target.value as Project["category"] } : p
                          );
                          setContent({ ...content, projects: updated });
                        }}
                        className="w-full px-3 py-1.5 rounded border border-[#262626] bg-[#121212] text-[#F5F5F5]"
                      >
                        <option value="Frontend & UI/UX">Frontend & UI/UX</option>
                        <option value="Systems & AI">Systems & AI</option>
                        <option value="Academic">Academic</option>
                        <option value="Full Stack">Full Stack</option>
                      </select>
                    </div>

                    <div>
                      <label className="block text-[#B7B7B7] font-medium mb-1">Role</label>
                      <input
                        type="text"
                        value={proj.role}
                        onChange={(e) => {
                          const updated = content.projects.map((p) =>
                            p.id === proj.id ? { ...p, role: e.target.value } : p
                          );
                          setContent({ ...content, projects: updated });
                        }}
                        className="w-full px-3 py-1.5 rounded border border-[#262626] bg-[#121212] text-[#F5F5F5]"
                      />
                    </div>

                    <div>
                      <label className="block text-[#B7B7B7] font-medium mb-1">Status</label>
                      <select
                        value={proj.status}
                        onChange={(e) => {
                          const updated = content.projects.map((p) =>
                            p.id === proj.id ? { ...p, status: e.target.value as Project["status"] } : p
                          );
                          setContent({ ...content, projects: updated });
                        }}
                        className="w-full px-3 py-1.5 rounded border border-[#262626] bg-[#121212] text-[#F5F5F5]"
                      >
                        <option value="Active">Active</option>
                        <option value="Concept">Concept</option>
                        <option value="In Development">In Development</option>
                        <option value="Completed">Completed</option>
                      </select>
                    </div>

                    <div className="flex items-center gap-3 pt-5">
                      <label className="flex items-center gap-2 cursor-pointer">
                        <input
                          type="checkbox"
                          checked={proj.featured}
                          onChange={(e) => {
                            const updated = content.projects.map((p) =>
                              p.id === proj.id ? { ...p, featured: e.target.checked } : p
                            );
                            setContent({ ...content, projects: updated });
                          }}
                          className="rounded border-[#262626] text-[#FF7A00] focus:ring-[#FF7A00]"
                        />
                        <span className="text-[#F5F5F5] font-medium">Feature on Homepage</span>
                      </label>
                    </div>

                    <div className="md:col-span-2 lg:col-span-3">
                      <label className="block text-[#B7B7B7] font-medium mb-1">Tagline</label>
                      <input
                        type="text"
                        value={proj.tagline}
                        onChange={(e) => {
                          const updated = content.projects.map((p) =>
                            p.id === proj.id ? { ...p, tagline: e.target.value } : p
                          );
                          setContent({ ...content, projects: updated });
                        }}
                        className="w-full px-3 py-1.5 rounded border border-[#262626] bg-[#121212] text-[#F5F5F5]"
                      />
                    </div>

                    {/* Web Links */}
                    <div>
                      <label className="block text-[#B7B7B7] font-medium mb-1 flex items-center gap-1">
                        <ExternalLink className="w-3 h-3 text-[#FF9D33]" />
                        <span>Live Website URL</span>
                      </label>
                      <input
                        type="url"
                        placeholder="https://example.com"
                        value={proj.liveUrl || ""}
                        onChange={(e) => {
                          const updated = content.projects.map((p) =>
                            p.id === proj.id ? { ...p, liveUrl: e.target.value } : p
                          );
                          setContent({ ...content, projects: updated });
                        }}
                        className="w-full px-3 py-1.5 rounded border border-[#262626] bg-[#121212] text-[#F5F5F5]"
                      />
                    </div>

                    <div>
                      <label className="block text-[#B7B7B7] font-medium mb-1 flex items-center gap-1">
                        <ExternalLink className="w-3 h-3 text-[#FF9D33]" />
                        <span>GitHub Repository URL</span>
                      </label>
                      <input
                        type="url"
                        placeholder="https://github.com/owner/repo"
                        value={proj.repoUrl || ""}
                        onChange={(e) => {
                          const updated = content.projects.map((p) =>
                            p.id === proj.id ? { ...p, repoUrl: e.target.value } : p
                          );
                          setContent({ ...content, projects: updated });
                        }}
                        className="w-full px-3 py-1.5 rounded border border-[#262626] bg-[#121212] text-[#F5F5F5]"
                      />
                    </div>

                    <div>
                      <label className="block text-[#B7B7B7] font-medium mb-1">Technologies (comma-separated)</label>
                      <input
                        type="text"
                        value={proj.technologies.join(", ")}
                        onChange={(e) => {
                          const techs = e.target.value.split(",").map((t) => t.trim()).filter(Boolean);
                          const updated = content.projects.map((p) =>
                            p.id === proj.id ? { ...p, technologies: techs } : p
                          );
                          setContent({ ...content, projects: updated });
                        }}
                        className="w-full px-3 py-1.5 rounded border border-[#262626] bg-[#121212] text-[#F5F5F5]"
                      />
                    </div>

                    <div className="md:col-span-2 lg:col-span-3">
                      <label className="block text-[#B7B7B7] font-medium mb-1">Overview</label>
                      <textarea
                        rows={2}
                        value={proj.overview}
                        onChange={(e) => {
                          const updated = content.projects.map((p) =>
                            p.id === proj.id ? { ...p, overview: e.target.value } : p
                          );
                          setContent({ ...content, projects: updated });
                        }}
                        className="w-full px-3 py-1.5 rounded border border-[#262626] bg-[#121212] text-[#F5F5F5]"
                      />
                    </div>

                    <div className="md:col-span-2 lg:col-span-3">
                      <label className="block text-[#B7B7B7] font-medium mb-1">Features Built (one per line)</label>
                      <textarea
                        rows={3}
                        value={proj.featuresBuilt.join("\n")}
                        onChange={(e) => {
                          const lines = e.target.value.split("\n").map((l) => l.trim()).filter(Boolean);
                          const updated = content.projects.map((p) =>
                            p.id === proj.id ? { ...p, featuresBuilt: lines } : p
                          );
                          setContent({ ...content, projects: updated });
                        }}
                        className="w-full px-3 py-1.5 rounded border border-[#262626] bg-[#121212] text-[#F5F5F5]"
                      />
                    </div>
                  </div>
                </div>
              ))}
            </div>
          </div>
        )}

        {/* ========================================================= */}
        {/* TAB 2: ACHIEVEMENTS & CREDENTIALS */}
        {/* ========================================================= */}
        {activeTab === "achievements" && (
          <div className="space-y-12">
            {/* Section A: Achievements */}
            <div className="space-y-6">
              <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
                <div>
                  <h2 className="font-display text-2xl text-[#F5F5F5]">Hackathons & Competitions</h2>
                  <p className="text-xs text-[#B7B7B7]">
                    Document verified hackathon placements, awards, and team distinctions.
                  </p>
                </div>
                <button
                  onClick={() => {
                    const newAch: Achievement = {
                      id: `ach-${Date.now()}`,
                      title: "Achievement Title",
                      event: "Event Name",
                      organizer: "Organizer Organization",
                      result: "1st Place / Finalist",
                      type: "Hackathon",
                      teamOrIndividual: "Individual",
                      year: "2026",
                      description: "Summary of the competition sprint and solution.",
                      verified: true,
                      published: true,
                      order: content.achievements.length + 1,
                      evidenceUrl: ""
                    };
                    setContent({ ...content, achievements: [...content.achievements, newAch] });
                  }}
                  className="inline-flex items-center gap-1.5 px-4 py-2 rounded-lg bg-[#FF7A00] text-black font-semibold text-xs font-medium hover:bg-[#FF8C1A] cursor-pointer self-start sm:self-auto shadow-xs"
                >
                  <Plus className="w-3.5 h-3.5" />
                  <span>Add Achievement</span>
                </button>
              </div>

              <div className="space-y-4">
                {content.achievements.map((ach, idx) => (
                  <div key={ach.id} className="p-6 bg-[#151515] rounded-xl border border-[#262626] space-y-4">
                    <div className="flex items-center justify-between pb-3 border-b border-[#262626]">
                      <div className="flex items-center gap-3">
                        <span className="font-display text-base text-[#F5F5F5] font-medium">{ach.title}</span>
                        <span className={`text-[10px] px-2 py-0.5 rounded-full font-medium ${ach.published ? "bg-emerald-100 text-emerald-800" : "bg-amber-100 text-amber-800"}`}>
                          {ach.published ? "Published" : "Draft"}
                        </span>
                      </div>
                      <div className="flex items-center gap-2">
                        <button
                          disabled={idx === 0}
                          onClick={() => {
                            if (idx === 0) return;
                            const copy = [...content.achievements];
                            const tmp = copy[idx - 1];
                            copy[idx - 1] = copy[idx];
                            copy[idx] = tmp;
                            copy.forEach((a, i) => (a.order = i + 1));
                            setContent({ ...content, achievements: copy });
                          }}
                          className="p-1 border border-[#262626] rounded text-[#B7B7B7] hover:text-[#F5F5F5] disabled:opacity-30 cursor-pointer"
                        >
                          <ChevronUp className="w-3.5 h-3.5" />
                        </button>
                        <button
                          disabled={idx === content.achievements.length - 1}
                          onClick={() => {
                            if (idx === content.achievements.length - 1) return;
                            const copy = [...content.achievements];
                            const tmp = copy[idx + 1];
                            copy[idx + 1] = copy[idx];
                            copy[idx] = tmp;
                            copy.forEach((a, i) => (a.order = i + 1));
                            setContent({ ...content, achievements: copy });
                          }}
                          className="p-1 border border-[#262626] rounded text-[#B7B7B7] hover:text-[#F5F5F5] disabled:opacity-30 cursor-pointer"
                        >
                          <ChevronDown className="w-3.5 h-3.5" />
                        </button>
                        <button
                          onClick={() => {
                            const updated = content.achievements.map((a) =>
                              a.id === ach.id ? { ...a, published: !a.published } : a
                            );
                            setContent({ ...content, achievements: updated });
                          }}
                          className={`text-xs px-2.5 py-1 rounded border font-medium cursor-pointer ${
                            ach.published ? "border-emerald-300 text-emerald-800" : "border-amber-300 text-amber-800"
                          }`}
                        >
                          {ach.published ? "Draft" : "Publish"}
                        </button>
                        <button
                          onClick={() => setDeleteTarget({ type: "achievement", id: ach.id, name: ach.title })}
                          className="p-1.5 text-red-600 hover:bg-red-50 rounded cursor-pointer"
                        >
                          <Trash2 className="w-4 h-4" />
                        </button>
                      </div>
                    </div>

                    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4 text-xs">
                      <div>
                        <label className="block text-[#B7B7B7] mb-1">Title</label>
                        <input
                          type="text"
                          value={ach.title}
                          onChange={(e) => {
                            const updated = content.achievements.map((a) =>
                              a.id === ach.id ? { ...a, title: e.target.value } : a
                            );
                            setContent({ ...content, achievements: updated });
                          }}
                          className="w-full px-3 py-1.5 rounded border border-[#262626] bg-[#121212]"
                        />
                      </div>
                      <div>
                        <label className="block text-[#B7B7B7] mb-1">Event</label>
                        <input
                          type="text"
                          value={ach.event}
                          onChange={(e) => {
                            const updated = content.achievements.map((a) =>
                              a.id === ach.id ? { ...a, event: e.target.value } : a
                            );
                            setContent({ ...content, achievements: updated });
                          }}
                          className="w-full px-3 py-1.5 rounded border border-[#262626] bg-[#121212]"
                        />
                      </div>
                      <div>
                        <label className="block text-[#B7B7B7] mb-1">Result</label>
                        <input
                          type="text"
                          value={ach.result}
                          onChange={(e) => {
                            const updated = content.achievements.map((a) =>
                              a.id === ach.id ? { ...a, result: e.target.value } : a
                            );
                            setContent({ ...content, achievements: updated });
                          }}
                          className="w-full px-3 py-1.5 rounded border border-[#262626] bg-[#121212]"
                        />
                      </div>
                      <div>
                        <label className="block text-[#B7B7B7] mb-1">Year</label>
                        <input
                          type="text"
                          value={ach.year}
                          onChange={(e) => {
                            const updated = content.achievements.map((a) =>
                              a.id === ach.id ? { ...a, year: e.target.value } : a
                            );
                            setContent({ ...content, achievements: updated });
                          }}
                          className="w-full px-3 py-1.5 rounded border border-[#262626] bg-[#121212]"
                        />
                      </div>
                      <div>
                        <label className="block text-[#B7B7B7] mb-1">Evidence / Proof URL</label>
                        <input
                          type="url"
                          placeholder="https://..."
                          value={ach.evidenceUrl || ""}
                          onChange={(e) => {
                            const updated = content.achievements.map((a) =>
                              a.id === ach.id ? { ...a, evidenceUrl: e.target.value } : a
                            );
                            setContent({ ...content, achievements: updated });
                          }}
                          className="w-full px-3 py-1.5 rounded border border-[#262626] bg-[#121212]"
                        />
                      </div>
                      <div>
                        <label className="block text-[#B7B7B7] mb-1">Format</label>
                        <select
                          value={ach.teamOrIndividual}
                          onChange={(e) => {
                            const updated = content.achievements.map((a) =>
                              a.id === ach.id ? { ...a, teamOrIndividual: e.target.value as Achievement["teamOrIndividual"] } : a
                            );
                            setContent({ ...content, achievements: updated });
                          }}
                          className="w-full px-3 py-1.5 rounded border border-[#262626] bg-[#121212]"
                        >
                          <option value="Individual">Individual</option>
                          <option value="Team">Team</option>
                        </select>
                      </div>
                      <div className="md:col-span-2 lg:col-span-3">
                        <label className="block text-[#B7B7B7] mb-1">Summary Description</label>
                        <textarea
                          rows={2}
                          value={ach.description}
                          onChange={(e) => {
                            const updated = content.achievements.map((a) =>
                              a.id === ach.id ? { ...a, description: e.target.value } : a
                            );
                            setContent({ ...content, achievements: updated });
                          }}
                          className="w-full px-3 py-1.5 rounded border border-[#262626] bg-[#121212]"
                        />
                      </div>
                    </div>
                  </div>
                ))}
              </div>
            </div>

            {/* Section B: Credentials */}
            <div className="space-y-6 pt-6 border-t border-[#262626]">
              <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
                <div>
                  <h2 className="font-display text-2xl text-[#F5F5F5]">Learning Credentials & Certificates</h2>
                  <p className="text-xs text-[#B7B7B7]">
                    Configure course badges, learning journeys, and certification links.
                  </p>
                </div>
                <button
                  onClick={() => {
                    const newCred: Credential = {
                      id: `cred-${Date.now()}`,
                      title: "New Credential",
                      issuer: "AWS / Google Cloud / Cisco",
                      type: "Course/Badge",
                      category: "course-module",
                      date: "2026",
                      summary: "Core competencies demonstrated.",
                      featured: true,
                      published: true,
                      order: content.credentials.length + 1,
                      isJourney: false,
                      verificationUrl: "",
                      linkedInPostUrl: "",
                      evidenceLink: ""
                    };
                    setContent({ ...content, credentials: [...content.credentials, newCred] });
                  }}
                  className="inline-flex items-center gap-1.5 px-4 py-2 rounded-lg bg-[#FF7A00] text-black font-semibold text-xs font-medium hover:bg-[#FF8C1A] cursor-pointer self-start sm:self-auto shadow-xs"
                >
                  <Plus className="w-3.5 h-3.5" />
                  <span>Add Credential</span>
                </button>
              </div>

              <div className="space-y-4">
                {(content.credentials || []).length === 0 ? (
                  <div className="p-8 rounded-xl border border-dashed border-[#262626] bg-[#121212] text-center">
                    <p className="text-xs text-[#B7B7B7]">No credentials or certificates added yet. Click &apos;Add Credential&apos; to add future verified certificates.</p>
                  </div>
                ) : (
                  content.credentials.map((cred, idx) => (
                  <div key={cred.id} className="p-6 bg-[#151515] rounded-xl border border-[#262626] space-y-4">
                    <div className="flex items-center justify-between pb-3 border-b border-[#262626]">
                      <div className="flex items-center gap-3">
                        <span className="font-display text-base text-[#F5F5F5] font-medium">{cred.title}</span>
                        <span className={`text-[10px] px-2 py-0.5 rounded-full font-medium ${cred.published ? "bg-emerald-100 text-emerald-800" : "bg-amber-100 text-amber-800"}`}>
                          {cred.published ? "Published" : "Draft"}
                        </span>
                        {cred.isJourney && (
                          <span className="text-[10px] px-2 py-0.5 rounded-full bg-blue-50 text-blue-800">
                            Journey Curriculum
                          </span>
                        )}
                      </div>
                      <div className="flex items-center gap-2">
                        <button
                          disabled={idx === 0}
                          onClick={() => {
                            if (idx === 0) return;
                            const copy = [...content.credentials];
                            const tmp = copy[idx - 1];
                            copy[idx - 1] = copy[idx];
                            copy[idx] = tmp;
                            copy.forEach((c, i) => (c.order = i + 1));
                            setContent({ ...content, credentials: copy });
                          }}
                          className="p-1 border border-[#262626] rounded text-[#B7B7B7] hover:text-[#F5F5F5] disabled:opacity-30 cursor-pointer"
                        >
                          <ChevronUp className="w-3.5 h-3.5" />
                        </button>
                        <button
                          disabled={idx === content.credentials.length - 1}
                          onClick={() => {
                            if (idx === content.credentials.length - 1) return;
                            const copy = [...content.credentials];
                            const tmp = copy[idx + 1];
                            copy[idx + 1] = copy[idx];
                            copy[idx] = tmp;
                            copy.forEach((c, i) => (c.order = i + 1));
                            setContent({ ...content, credentials: copy });
                          }}
                          className="p-1 border border-[#262626] rounded text-[#B7B7B7] hover:text-[#F5F5F5] disabled:opacity-30 cursor-pointer"
                        >
                          <ChevronDown className="w-3.5 h-3.5" />
                        </button>
                        <button
                          onClick={() => {
                            const updated = content.credentials.map((c) =>
                              c.id === cred.id ? { ...c, published: !c.published } : c
                            );
                            setContent({ ...content, credentials: updated });
                          }}
                          className={`text-xs px-2.5 py-1 rounded border font-medium cursor-pointer ${
                            cred.published ? "border-emerald-300 text-emerald-800" : "border-amber-300 text-amber-800"
                          }`}
                        >
                          {cred.published ? "Draft" : "Publish"}
                        </button>
                        <button
                          onClick={() => setDeleteTarget({ type: "credential", id: cred.id, name: cred.title })}
                          className="p-1.5 text-red-600 hover:bg-red-50 rounded cursor-pointer"
                        >
                          <Trash2 className="w-4 h-4" />
                        </button>
                      </div>
                    </div>

                    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4 text-xs">
                      <div>
                        <label className="block text-[#B7B7B7] mb-1">Title</label>
                        <input
                          type="text"
                          value={cred.title}
                          onChange={(e) => {
                            const updated = content.credentials.map((c) =>
                              c.id === cred.id ? { ...c, title: e.target.value } : c
                            );
                            setContent({ ...content, credentials: updated });
                          }}
                          className="w-full px-3 py-1.5 rounded border border-[#262626] bg-[#121212]"
                        />
                      </div>
                      <div>
                        <label className="block text-[#B7B7B7] mb-1">Issuer</label>
                        <input
                          type="text"
                          value={cred.issuer}
                          onChange={(e) => {
                            const updated = content.credentials.map((c) =>
                              c.id === cred.id ? { ...c, issuer: e.target.value } : c
                            );
                            setContent({ ...content, credentials: updated });
                          }}
                          className="w-full px-3 py-1.5 rounded border border-[#262626] bg-[#121212]"
                        />
                      </div>
                      <div>
                        <label className="block text-[#B7B7B7] mb-1">Date</label>
                        <input
                          type="text"
                          value={cred.date || ""}
                          onChange={(e) => {
                            const updated = content.credentials.map((c) =>
                              c.id === cred.id ? { ...c, date: e.target.value } : c
                            );
                            setContent({ ...content, credentials: updated });
                          }}
                          className="w-full px-3 py-1.5 rounded border border-[#262626] bg-[#121212]"
                        />
                      </div>

                      <div>
                        <label className="block text-[#B7B7B7] mb-1">Verification / Badge URL</label>
                        <input
                          type="url"
                          placeholder="https://credly.com/..."
                          value={cred.verificationUrl || ""}
                          onChange={(e) => {
                            const updated = content.credentials.map((c) =>
                              c.id === cred.id ? { ...c, verificationUrl: e.target.value } : c
                            );
                            setContent({ ...content, credentials: updated });
                          }}
                          className="w-full px-3 py-1.5 rounded border border-[#262626] bg-[#121212]"
                        />
                      </div>

                      <div>
                        <label className="block text-[#B7B7B7] mb-1">LinkedIn Post URL</label>
                        <input
                          type="url"
                          placeholder="https://linkedin.com/posts/..."
                          value={cred.linkedInPostUrl || ""}
                          onChange={(e) => {
                            const updated = content.credentials.map((c) =>
                              c.id === cred.id ? { ...c, linkedInPostUrl: e.target.value } : c
                            );
                            setContent({ ...content, credentials: updated });
                          }}
                          className="w-full px-3 py-1.5 rounded border border-[#262626] bg-[#121212]"
                        />
                      </div>

                      <div>
                        <label className="block text-[#B7B7B7] mb-1">Evidence / Certificate Image Link</label>
                        <input
                          type="text"
                          placeholder="/assets/credentials/... or https://"
                          value={cred.evidenceLink || ""}
                          onChange={(e) => {
                            const updated = content.credentials.map((c) =>
                              c.id === cred.id ? { ...c, evidenceLink: e.target.value } : c
                            );
                            setContent({ ...content, credentials: updated });
                          }}
                          className="w-full px-3 py-1.5 rounded border border-[#262626] bg-[#121212]"
                        />
                      </div>

                      <div className="md:col-span-2 lg:col-span-3">
                        <label className="block text-[#B7B7B7] mb-1">Summary</label>
                        <textarea
                          rows={2}
                          value={cred.summary}
                          onChange={(e) => {
                            const updated = content.credentials.map((c) =>
                              c.id === cred.id ? { ...c, summary: e.target.value } : c
                            );
                            setContent({ ...content, credentials: updated });
                          }}
                          className="w-full px-3 py-1.5 rounded border border-[#262626] bg-[#121212]"
                        />
                      </div>
                    </div>
                  </div>
                ))
              )}
              </div>
            </div>
          </div>
        )}

        {/* ========================================================= */}
        {/* TAB 3: SKILLS */}
        {/* ========================================================= */}
        {activeTab === "skills" && (
          <div className="space-y-6">
            <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
              <div>
                <h2 className="font-display text-2xl text-[#F5F5F5]">Technical Skills</h2>
                <p className="text-xs text-[#B7B7B7]">
                  Organize competencies, categorizations, proficiency levels, and linked project tags.
                </p>
              </div>
              <button
                onClick={() => {
                  const newSkill: Skill = {
                    id: `skill-${Date.now()}`,
                    name: "New Skill",
                    category: "Development",
                    proficiency: "Core",
                    relatedProjectSlugs: []
                  };
                  setContent({ ...content, skills: [...content.skills, newSkill] });
                }}
                className="inline-flex items-center gap-1.5 px-4 py-2 rounded-lg bg-[#FF7A00] text-black font-semibold text-xs font-medium hover:bg-[#FF8C1A] cursor-pointer self-start sm:self-auto shadow-xs"
              >
                <Plus className="w-3.5 h-3.5" />
                <span>Add Skill</span>
              </button>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              {content.skills.map((skill) => (
                <div key={skill.id} className="p-4 bg-[#151515] rounded-xl border border-[#262626] space-y-3">
                  <div className="flex items-center justify-between">
                    <span className="font-semibold text-sm text-[#F5F5F5]">{skill.name || "Unnamed"}</span>
                    <button
                      onClick={() => setDeleteTarget({ type: "skill", id: skill.id, name: skill.name })}
                      className="p-1 text-red-600 hover:bg-red-50 rounded cursor-pointer"
                    >
                      <Trash2 className="w-3.5 h-3.5" />
                    </button>
                  </div>
                  <div className="grid grid-cols-2 gap-3 text-xs">
                    <div>
                      <label className="block text-[#B7B7B7] mb-1">Skill Name</label>
                      <input
                        type="text"
                        value={skill.name}
                        onChange={(e) => {
                          const updated = content.skills.map((s) =>
                            s.id === skill.id ? { ...s, name: e.target.value } : s
                          );
                          setContent({ ...content, skills: updated });
                        }}
                        className="w-full px-2.5 py-1.5 rounded border border-[#262626] bg-[#121212]"
                      />
                    </div>
                    <div>
                      <label className="block text-[#B7B7B7] mb-1">Category</label>
                      <select
                        value={skill.category}
                        onChange={(e) => {
                          const updated = content.skills.map((s) =>
                            s.id === skill.id ? { ...s, category: e.target.value as Skill["category"] } : s
                          );
                          setContent({ ...content, skills: updated });
                        }}
                        className="w-full px-2.5 py-1.5 rounded border border-[#262626] bg-[#121212]"
                      >
                        <option value="Development">Development</option>
                        <option value="Design & Prototyping">Design & Prototyping</option>
                        <option value="Programming Foundations">Programming Foundations</option>
                        <option value="Tools & Workflow">Tools & Workflow</option>
                      </select>
                    </div>
                    <div>
                      <label className="block text-[#B7B7B7] mb-1">Proficiency</label>
                      <select
                        value={skill.proficiency}
                        onChange={(e) => {
                          const updated = content.skills.map((s) =>
                            s.id === skill.id ? { ...s, proficiency: e.target.value as Skill["proficiency"] } : s
                          );
                          setContent({ ...content, skills: updated });
                        }}
                        className="w-full px-2.5 py-1.5 rounded border border-[#262626] bg-[#121212]"
                      >
                        <option value="Core">Core</option>
                        <option value="Proficient">Proficient</option>
                        <option value="Learning">Learning</option>
                      </select>
                    </div>
                    <div>
                      <label className="block text-[#B7B7B7] mb-1">Linked Projects (slugs)</label>
                      <input
                        type="text"
                        placeholder="project-slug-1, project-slug-2"
                        value={skill.relatedProjectSlugs.join(", ")}
                        onChange={(e) => {
                          const slugs = e.target.value.split(",").map((s) => s.trim()).filter(Boolean);
                          const updated = content.skills.map((s) =>
                            s.id === skill.id ? { ...s, relatedProjectSlugs: slugs } : s
                          );
                          setContent({ ...content, skills: updated });
                        }}
                        className="w-full px-2.5 py-1.5 rounded border border-[#262626] bg-[#121212]"
                      />
                    </div>
                  </div>
                </div>
              ))}
            </div>
          </div>
        )}

        {/* ========================================================= */}
        {/* TAB 4: EXPERIENCE */}
        {/* ========================================================= */}
        {activeTab === "experience" && (
          <div className="space-y-6">
            <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
              <div>
                <h2 className="font-display text-2xl text-[#F5F5F5]">Leadership & Experience</h2>
                <p className="text-xs text-[#B7B7B7]">
                  Manage executive positions, startup leadership, operational roles, and verified responsibilities.
                </p>
              </div>
              <button
                onClick={() => {
                  const newExp: Experience = {
                    id: `exp-${Date.now()}`,
                    role: "Software Developer",
                    company: "Organization Name",
                    period: "2025–Present",
                    isCurrent: true,
                    summary: "Description of software development or engineering responsibilities.",
                    contributions: [
                      "Contributed to software development and engineering solutions.",
                      "Collaborated on technical projects and implementations."
                    ],
                    published: true
                  };
                  setContent({ ...content, experience: [...content.experience, newExp] });
                }}
                className="inline-flex items-center gap-1.5 px-4 py-2 rounded-lg bg-[#FF7A00] text-black font-semibold text-xs font-medium hover:bg-[#FF8C1A] cursor-pointer self-start sm:self-auto shadow-xs"
              >
                <Plus className="w-3.5 h-3.5" />
                <span>Add Experience Entry</span>
              </button>
            </div>

            <div className="space-y-6">
              {(content.experience || []).length === 0 ? (
                <div className="p-8 rounded-xl border border-dashed border-[#262626] bg-[#121212] text-center">
                  <p className="text-xs text-[#B7B7B7]">No professional experience entries added yet. Click &apos;Add Experience Entry&apos; to document future roles or internships.</p>
                </div>
              ) : (
                content.experience.map((exp) => (
                <div key={exp.id} className="p-6 bg-[#151515] rounded-xl border border-[#262626] space-y-4">
                  <div className="flex items-center justify-between pb-3 border-b border-[#262626]">
                    <div className="flex items-center gap-3">
                      <span className="font-display text-base text-[#F5F5F5] font-medium">
                        {exp.role} at {exp.company}
                      </span>
                      <span className={`text-[10px] px-2 py-0.5 rounded-full font-medium ${exp.published ? "bg-emerald-100 text-emerald-800" : "bg-amber-100 text-amber-800"}`}>
                        {exp.published ? "Published" : "Draft"}
                      </span>
                      {exp.isCurrent && (
                        <span className="text-[10px] px-2 py-0.5 rounded-full bg-[#FF9D33]/20 text-[#F5F5F5] font-medium">
                          Current Role
                        </span>
                      )}
                    </div>
                    <div className="flex items-center gap-2">
                      <button
                        onClick={() => {
                          const updated = content.experience.map((e) =>
                            e.id === exp.id ? { ...e, published: !e.published } : e
                          );
                          setContent({ ...content, experience: updated });
                        }}
                        className={`text-xs px-2.5 py-1 rounded border font-medium cursor-pointer ${
                          exp.published ? "border-emerald-300 text-emerald-800" : "border-amber-300 text-amber-800"
                        }`}
                      >
                        {exp.published ? "Draft" : "Publish"}
                      </button>
                      <button
                        onClick={() => setDeleteTarget({ type: "experience", id: exp.id, name: `${exp.role} (${exp.company})` })}
                        className="p-1.5 text-red-600 hover:bg-red-50 rounded cursor-pointer"
                      >
                        <Trash2 className="w-4 h-4" />
                      </button>
                    </div>
                  </div>

                  <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4 text-xs">
                    <div>
                      <label className="block text-[#B7B7B7] mb-1">Role Title</label>
                      <input
                        type="text"
                        value={exp.role}
                        onChange={(e) => {
                          const updated = content.experience.map((ex) =>
                            ex.id === exp.id ? { ...ex, role: e.target.value } : ex
                          );
                          setContent({ ...content, experience: updated });
                        }}
                        className="w-full px-3 py-1.5 rounded border border-[#262626] bg-[#121212]"
                      />
                    </div>
                    <div>
                      <label className="block text-[#B7B7B7] mb-1">Company / Organization</label>
                      <input
                        type="text"
                        value={exp.company}
                        onChange={(e) => {
                          const updated = content.experience.map((ex) =>
                            ex.id === exp.id ? { ...ex, company: e.target.value } : ex
                          );
                          setContent({ ...content, experience: updated });
                        }}
                        className="w-full px-3 py-1.5 rounded border border-[#262626] bg-[#121212]"
                      />
                    </div>
                    <div>
                      <label className="block text-[#B7B7B7] mb-1">Distinction / Focus</label>
                      <input
                        type="text"
                        value={exp.cooDistinction}
                        onChange={(e) => {
                          const updated = content.experience.map((ex) =>
                            ex.id === exp.id ? { ...ex, cooDistinction: e.target.value } : ex
                          );
                          setContent({ ...content, experience: updated });
                        }}
                        className="w-full px-3 py-1.5 rounded border border-[#262626] bg-[#121212]"
                      />
                    </div>
                    <div>
                      <label className="block text-[#B7B7B7] mb-1">Period (e.g. 2025–Present)</label>
                      <input
                        type="text"
                        value={exp.period}
                        onChange={(e) => {
                          const updated = content.experience.map((ex) =>
                            ex.id === exp.id ? { ...ex, period: e.target.value } : ex
                          );
                          setContent({ ...content, experience: updated });
                        }}
                        className="w-full px-3 py-1.5 rounded border border-[#262626] bg-[#121212]"
                      />
                    </div>
                    <div className="flex items-center gap-2 pt-5">
                      <label className="flex items-center gap-2 cursor-pointer">
                        <input
                          type="checkbox"
                          checked={exp.isCurrent}
                          onChange={(e) => {
                            const updated = content.experience.map((ex) =>
                              ex.id === exp.id ? { ...ex, isCurrent: e.target.checked } : ex
                            );
                            setContent({ ...content, experience: updated });
                          }}
                          className="rounded border-[#262626] text-[#FF7A00]"
                        />
                        <span className="font-medium text-[#F5F5F5]">Currently Active</span>
                      </label>
                    </div>
                    <div className="md:col-span-2 lg:col-span-3">
                      <label className="block text-[#B7B7B7] mb-1">Role Summary</label>
                      <input
                        type="text"
                        value={exp.summary}
                        onChange={(e) => {
                          const updated = content.experience.map((ex) =>
                            ex.id === exp.id ? { ...ex, summary: e.target.value } : ex
                          );
                          setContent({ ...content, experience: updated });
                        }}
                        className="w-full px-3 py-1.5 rounded border border-[#262626] bg-[#121212]"
                      />
                    </div>
                    <div className="md:col-span-2 lg:col-span-3">
                      <label className="block text-[#B7B7B7] mb-1">Key Responsibilities & Contributions (one per line)</label>
                      <textarea
                        rows={3}
                        value={exp.contributions.join("\n")}
                        onChange={(e) => {
                          const lines = e.target.value.split("\n").map((l) => l.trim()).filter(Boolean);
                          const updated = content.experience.map((ex) =>
                            ex.id === exp.id ? { ...ex, contributions: lines } : ex
                          );
                          setContent({ ...content, experience: updated });
                        }}
                        className="w-full px-3 py-1.5 rounded border border-[#262626] bg-[#121212]"
                      />
                    </div>
                  </div>
                </div>
              ))
            )}
            </div>
          </div>
        )}

        {/* ========================================================= */}
        {/* TAB 5: CURRENTLY LEARNING */}
        {/* ========================================================= */}
        {activeTab === "learning" && (
          <div className="space-y-6">
            <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
              <div>
                <h2 className="font-display text-2xl text-[#F5F5F5]">Currently Learning</h2>
                <p className="text-xs text-[#B7B7B7]">
                  Highlight active exploration areas, modern software frameworks, and technical goals.
                </p>
              </div>
              <button
                onClick={() => {
                  const newItem: CurrentlyLearningItem = {
                    id: `learn-${Date.now()}`,
                    topic: "New Technology or Paradigm",
                    area: "Frontend Architecture",
                    dated: "Active Exploration",
                    notes: "Key focus points and practical experiments.",
                    published: true
                  };
                  setContent({ ...content, currentlyLearning: [...content.currentlyLearning, newItem] });
                }}
                className="inline-flex items-center gap-1.5 px-4 py-2 rounded-lg bg-[#FF7A00] text-black font-semibold text-xs font-medium hover:bg-[#FF8C1A] cursor-pointer self-start sm:self-auto shadow-xs"
              >
                <Plus className="w-3.5 h-3.5" />
                <span>Add Learning Focus</span>
              </button>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              {content.currentlyLearning.map((item) => (
                <div key={item.id} className="p-4 bg-[#151515] rounded-xl border border-[#262626] space-y-3">
                  <div className="flex items-center justify-between pb-2 border-b border-[#262626]">
                    <div className="flex items-center gap-2">
                      <span className="font-semibold text-sm text-[#F5F5F5]">{item.topic || "Untitled"}</span>
                      <span className={`text-[10px] px-2 py-0.5 rounded-full font-medium ${item.published ? "bg-emerald-100 text-emerald-800" : "bg-amber-100 text-amber-800"}`}>
                        {item.published ? "Published" : "Draft"}
                      </span>
                    </div>
                    <div className="flex items-center gap-2">
                      <button
                        onClick={() => {
                          const updated = content.currentlyLearning.map((l) =>
                            l.id === item.id ? { ...l, published: !l.published } : l
                          );
                          setContent({ ...content, currentlyLearning: updated });
                        }}
                        className={`text-xs px-2 py-0.5 rounded border font-medium cursor-pointer ${
                          item.published ? "border-emerald-300 text-emerald-800" : "border-amber-300 text-amber-800"
                        }`}
                      >
                        {item.published ? "Draft" : "Publish"}
                      </button>
                      <button
                        onClick={() => setDeleteTarget({ type: "learning", id: item.id, name: item.topic })}
                        className="p-1 text-red-600 hover:bg-red-50 rounded cursor-pointer"
                      >
                        <Trash2 className="w-3.5 h-3.5" />
                      </button>
                    </div>
                  </div>

                  <div className="space-y-3 text-xs">
                    <div>
                      <label className="block text-[#B7B7B7] mb-1">Topic</label>
                      <input
                        type="text"
                        value={item.topic}
                        onChange={(e) => {
                          const updated = content.currentlyLearning.map((l) =>
                            l.id === item.id ? { ...l, topic: e.target.value } : l
                          );
                          setContent({ ...content, currentlyLearning: updated });
                        }}
                        className="w-full px-2.5 py-1.5 rounded border border-[#262626] bg-[#121212]"
                      />
                    </div>
                    <div className="grid grid-cols-2 gap-2">
                      <div>
                        <label className="block text-[#B7B7B7] mb-1">Area / Domain</label>
                        <input
                          type="text"
                          value={item.area}
                          onChange={(e) => {
                            const updated = content.currentlyLearning.map((l) =>
                              l.id === item.id ? { ...l, area: e.target.value } : l
                            );
                            setContent({ ...content, currentlyLearning: updated });
                          }}
                          className="w-full px-2.5 py-1.5 rounded border border-[#262626] bg-[#121212]"
                        />
                      </div>
                      <div>
                        <label className="block text-[#B7B7B7] mb-1">Date / Status</label>
                        <input
                          type="text"
                          value={item.dated}
                          onChange={(e) => {
                            const updated = content.currentlyLearning.map((l) =>
                              l.id === item.id ? { ...l, dated: e.target.value } : l
                            );
                            setContent({ ...content, currentlyLearning: updated });
                          }}
                          className="w-full px-2.5 py-1.5 rounded border border-[#262626] bg-[#121212]"
                        />
                      </div>
                    </div>
                    <div>
                      <label className="block text-[#B7B7B7] mb-1">Notes</label>
                      <textarea
                        rows={2}
                        value={item.notes}
                        onChange={(e) => {
                          const updated = content.currentlyLearning.map((l) =>
                            l.id === item.id ? { ...l, notes: e.target.value } : l
                          );
                          setContent({ ...content, currentlyLearning: updated });
                        }}
                        className="w-full px-2.5 py-1.5 rounded border border-[#262626] bg-[#121212]"
                      />
                    </div>
                  </div>
                </div>
              ))}
            </div>
          </div>
        )}

        {/* ========================================================= */}
        {/* TAB 6: PROFILE & IDENTITY */}
        {/* ========================================================= */}
        {activeTab === "profile" && (
          <div className="space-y-6">
            <div>
              <h2 className="font-display text-2xl text-[#F5F5F5]">Profile & Identity</h2>
              <p className="text-xs text-[#B7B7B7]">
                Configure candidate name, introductory copy, biography, academic credentials, and approved contact links.
              </p>
            </div>

            <div className="p-6 bg-[#151515] rounded-xl border border-[#262626] space-y-6 text-xs">
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div>
                  <label className="block text-[#B7B7B7] font-medium mb-1">Full Legal / Display Name</label>
                  <input
                    type="text"
                    value={content.profile.name}
                    onChange={(e) =>
                      setContent({
                        ...content,
                        profile: { ...content.profile, name: e.target.value }
                      })
                    }
                    className="w-full px-3 py-1.5 rounded border border-[#262626] bg-[#121212] text-[#F5F5F5]"
                  />
                </div>
                <div>
                  <label className="block text-[#B7B7B7] font-medium mb-1">Preferred Name</label>
                  <input
                    type="text"
                    value={content.profile.preferredName}
                    onChange={(e) =>
                      setContent({
                        ...content,
                        profile: { ...content.profile, preferredName: e.target.value }
                      })
                    }
                    className="w-full px-3 py-1.5 rounded border border-[#262626] bg-[#121212] text-[#F5F5F5]"
                  />
                </div>
                <div>
                  <label className="block text-[#B7B7B7] font-medium mb-1">Primary Role Headline</label>
                  <input
                    type="text"
                    value={content.profile.primaryRole}
                    onChange={(e) =>
                      setContent({
                        ...content,
                        profile: { ...content.profile, primaryRole: e.target.value }
                      })
                    }
                    className="w-full px-3 py-1.5 rounded border border-[#262626] bg-[#121212] text-[#F5F5F5]"
                  />
                </div>
                <div>
                  <label className="block text-[#B7B7B7] font-medium mb-1">Supporting Role</label>
                  <input
                    type="text"
                    value={content.profile.supportingRole}
                    onChange={(e) =>
                      setContent({
                        ...content,
                        profile: { ...content.profile, supportingRole: e.target.value }
                      })
                    }
                    className="w-full px-3 py-1.5 rounded border border-[#262626] bg-[#121212] text-[#F5F5F5]"
                  />
                </div>
                <div className="md:col-span-2">
                  <label className="block text-[#B7B7B7] font-medium mb-1">Location</label>
                  <input
                    type="text"
                    value={content.profile.location}
                    onChange={(e) =>
                      setContent({
                        ...content,
                        profile: { ...content.profile, location: e.target.value }
                      })
                    }
                    className="w-full px-3 py-1.5 rounded border border-[#262626] bg-[#121212] text-[#F5F5F5]"
                  />
                </div>
                <div className="md:col-span-2">
                  <label className="block text-[#B7B7B7] font-medium mb-1">Editorial Introduction</label>
                  <textarea
                    rows={2}
                    value={content.profile.introduction}
                    onChange={(e) =>
                      setContent({
                        ...content,
                        profile: { ...content.profile, introduction: e.target.value }
                      })
                    }
                    className="w-full px-3 py-1.5 rounded border border-[#262626] bg-[#121212] text-[#F5F5F5]"
                  />
                </div>
              </div>

              {/* Bio Paragraphs */}
              <div className="pt-4 border-t border-[#262626]">
                <label className="block text-[#B7B7B7] font-medium mb-1">About Biography Paragraphs (one per line)</label>
                <textarea
                  rows={4}
                  value={content.profile.aboutBio.join("\n\n")}
                  onChange={(e) => {
                    const paragraphs = e.target.value.split("\n\n").map((p) => p.trim()).filter(Boolean);
                    setContent({
                      ...content,
                      profile: { ...content.profile, aboutBio: paragraphs }
                    });
                  }}
                  className="w-full px-3 py-2 rounded border border-[#262626] bg-[#121212] text-[#F5F5F5]"
                />
              </div>

              {/* Education */}
              <div className="pt-4 border-t border-[#262626] space-y-4">
                <span className="font-semibold text-sm text-[#F5F5F5] block">Academic Education</span>
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  <div>
                    <label className="block text-[#B7B7B7] mb-1">Degree</label>
                    <input
                      type="text"
                      value={content.profile.education.degree}
                      onChange={(e) =>
                        setContent({
                          ...content,
                          profile: {
                            ...content.profile,
                            education: { ...content.profile.education, degree: e.target.value }
                          }
                        })
                      }
                      className="w-full px-3 py-1.5 rounded border border-[#262626] bg-[#121212]"
                    />
                  </div>
                  <div>
                    <label className="block text-[#B7B7B7] mb-1">Field</label>
                    <input
                      type="text"
                      value={content.profile.education.field}
                      onChange={(e) =>
                        setContent({
                          ...content,
                          profile: {
                            ...content.profile,
                            education: { ...content.profile.education, field: e.target.value }
                          }
                        })
                      }
                      className="w-full px-3 py-1.5 rounded border border-[#262626] bg-[#121212]"
                    />
                  </div>
                  <div>
                    <label className="block text-[#B7B7B7] mb-1">Institution</label>
                    <input
                      type="text"
                      value={content.profile.education.institution}
                      onChange={(e) =>
                        setContent({
                          ...content,
                          profile: {
                            ...content.profile,
                            education: { ...content.profile.education, institution: e.target.value }
                          }
                        })
                      }
                      className="w-full px-3 py-1.5 rounded border border-[#262626] bg-[#121212]"
                    />
                  </div>
                  <div>
                    <label className="block text-[#B7B7B7] mb-1">Period</label>
                    <input
                      type="text"
                      value={content.profile.education.period}
                      onChange={(e) =>
                        setContent({
                          ...content,
                          profile: {
                            ...content.profile,
                            education: { ...content.profile.education, period: e.target.value }
                          }
                        })
                      }
                      className="w-full px-3 py-1.5 rounded border border-[#262626] bg-[#121212]"
                    />
                  </div>
                </div>
              </div>

              {/* Contact Channels */}
              <div className="pt-4 border-t border-[#262626] space-y-4">
                <span className="font-semibold text-sm text-[#F5F5F5] block">Contact Channels & Availability</span>
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  <div>
                    <label className="block text-[#B7B7B7] mb-1">Public Contact Email</label>
                    <input
                      type="email"
                      value={content.profile.contact.email}
                      onChange={(e) =>
                        setContent({
                          ...content,
                          profile: {
                            ...content.profile,
                            contact: { ...content.profile.contact, email: e.target.value }
                          }
                        })
                      }
                      className="w-full px-3 py-1.5 rounded border border-[#262626] bg-[#121212]"
                    />
                  </div>
                  <div>
                    <label className="block text-[#B7B7B7] mb-1">GitHub Profile URL</label>
                    <input
                      type="url"
                      value={content.profile.contact.github}
                      onChange={(e) =>
                        setContent({
                          ...content,
                          profile: {
                            ...content.profile,
                            contact: { ...content.profile.contact, github: e.target.value }
                          }
                        })
                      }
                      className="w-full px-3 py-1.5 rounded border border-[#262626] bg-[#121212]"
                    />
                  </div>
                  <div>
                    <label className="block text-[#B7B7B7] mb-1">LinkedIn Profile URL</label>
                    <input
                      type="url"
                      value={content.profile.contact.linkedin}
                      onChange={(e) =>
                        setContent({
                          ...content,
                          profile: {
                            ...content.profile,
                            contact: { ...content.profile.contact, linkedin: e.target.value }
                          }
                        })
                      }
                      className="w-full px-3 py-1.5 rounded border border-[#262626] bg-[#121212]"
                    />
                  </div>
                  <div>
                    <label className="block text-[#B7B7B7] mb-1">Availability Status</label>
                    <input
                      type="text"
                      value={content.profile.contact.availabilityStatus}
                      onChange={(e) =>
                        setContent({
                          ...content,
                          profile: {
                            ...content.profile,
                            contact: { ...content.profile.contact, availabilityStatus: e.target.value }
                          }
                        })
                      }
                      className="w-full px-3 py-1.5 rounded border border-[#262626] bg-[#121212]"
                    />
                  </div>
                </div>
              </div>
            </div>
          </div>
        )}
      </main>

      {/* ========================================================= */}
      {/* DELETE CONFIRMATION MODAL */}
      {/* ========================================================= */}
      {deleteTarget && (
        <div className="fixed inset-0 z-50 bg-[#F5F5F5]/60 backdrop-blur-xs flex items-center justify-center p-4">
          <div className="bg-[#151515] rounded-2xl border border-[#262626] max-w-md w-full p-6 shadow-xl space-y-4 font-sans">
            <div className="flex items-center justify-between">
              <div className="flex items-center gap-2 text-red-600 font-semibold text-sm">
                <AlertTriangle className="w-4 h-4" />
                <span>Confirm Deletion</span>
              </div>
              <button
                onClick={() => setDeleteTarget(null)}
                className="p-1 text-[#B7B7B7] hover:text-[#F5F5F5] rounded cursor-pointer"
              >
                <X className="w-4 h-4" />
              </button>
            </div>

            <p className="text-xs text-[#B7B7B7] leading-relaxed">
              Are you sure you want to delete <strong className="text-[#F5F5F5]">&ldquo;{deleteTarget.name}&rdquo;</strong>? 
              This will remove the item from your portfolio store upon publishing.
            </p>

            <div className="flex items-center justify-end gap-3 pt-2">
              <button
                onClick={() => setDeleteTarget(null)}
                className="px-4 py-2 rounded-lg border border-[#262626] text-xs font-medium text-[#B7B7B7] hover:text-[#F5F5F5] cursor-pointer"
              >
                Cancel
              </button>
              <button
                onClick={executeDelete}
                className="px-4 py-2 rounded-lg bg-red-600 hover:bg-red-700 text-white text-xs font-semibold cursor-pointer shadow-xs"
              >
                Delete Permanently
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
