import React from "react";
import Link from "next/link";
import Image from "next/image";
import { notFound } from "next/navigation";
import { getPublishedProjectBySlug, getPublishedProjects } from "@/lib/content-store";
import { ArrowLeft, CheckCircle2, AlertCircle, Layers, ArrowUpRight, ShieldCheck, UserCheck, ExternalLink } from "lucide-react";
import Monogram from "@/components/ui/Monogram";
import Footer from "@/components/layout/Footer";

export const dynamic = "force-dynamic";
export const dynamicParams = true;
export const revalidate = 0;

export async function generateStaticParams() {
  const projects = await getPublishedProjects();
  return projects.map((p) => ({ slug: p.slug }));
}

export default async function ProjectCaseStudyPage({
  params,
}: {
  params: Promise<{ slug: string }>;
}) {
  const { slug } = await params;
  const project = await getPublishedProjectBySlug(slug);

  if (!project) {
    notFound();
  }

  return (
    <div className="min-h-screen bg-[#080808] flex flex-col selection:bg-[#FF7A00] selection:text-black">
      {/* Header Bar */}
      <header className="w-full border-b border-[#262626] bg-[#080808]/90 backdrop-blur-sm sticky top-0 z-30 px-6 lg:px-16 py-4">
        <div className="max-w-[1600px] mx-auto flex items-center justify-between">
          <div className="flex items-center gap-4">
            <Link href="/" className="hover:opacity-80 transition-opacity">
              <Monogram className="w-8 h-9" />
            </Link>
            <div className="text-xs tracking-wider uppercase font-sans font-medium text-[#F5F5F5]">
              <Link href="/projects" className="text-[#818181] hover:text-[#F5F5F5] transition-colors">
                Projects
              </Link>
              <span className="mx-2 text-[#262626]">/</span>
              <span className="text-[#FF7A00]">{project.title}</span>
            </div>
          </div>

          <Link
            href="/projects"
            className="inline-flex items-center gap-2 text-xs font-sans font-medium text-[#FF7A00] hover:text-[#FF9D33] transition-colors"
          >
            <ArrowLeft className="w-3.5 h-3.5" />
            <span>All Projects</span>
          </Link>
        </div>
      </header>

      {/* Main Case Study Article */}
      <main className="flex-1 max-w-[1200px] mx-auto w-full py-16 px-6 lg:px-12">
        {/* Project Title Block */}
        <div className="pb-10 border-b border-[#262626]">
          <div className="flex items-center gap-2.5 mb-4 text-xs font-sans">
            <span className="px-3 py-1 rounded-full bg-[#FF7A00]/10 text-[#FF7A00] border border-[#FF7A00]/30 font-semibold tracking-wider uppercase">
              {project.category}
            </span>
            <span className="text-[#262626]">·</span>
            <span className="text-[#818181] font-medium tracking-wide uppercase">
              Status: {project.status}
            </span>
          </div>

          <h1 className="font-display text-4xl sm:text-6xl font-normal text-[#F5F5F5] mb-4">
            {project.title}
          </h1>
          <p className="text-lg sm:text-xl text-[#B7B7B7] font-editorial leading-relaxed max-w-3xl mb-6">
            {project.tagline}
          </p>

          {/* Action Buttons: Live Demo and GitHub Repository */}
          {(project.liveUrl || project.repoUrl) && (
            <div className="flex flex-wrap items-center gap-3 pt-2 font-sans">
              {project.liveUrl && (
                <a
                  href={project.liveUrl}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="inline-flex items-center gap-2 px-5 py-2.5 rounded-xl bg-[#FF7A00] text-black text-xs sm:text-sm font-semibold hover:bg-[#FF8C1A] hover:shadow-md transition-all focus:outline-none focus:ring-2 focus:ring-[#FF7A00] focus:ring-offset-2 focus:ring-offset-[#080808]"
                >
                  <span>Live Demo</span>
                  <ExternalLink className="w-4 h-4" />
                </a>
              )}

              {project.repoUrl && (
                <a
                  href={project.repoUrl}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="inline-flex items-center gap-2 px-5 py-2.5 rounded-xl bg-[#151515] border border-[#262626] text-[#F5F5F5] text-xs sm:text-sm font-medium hover:border-[#FF7A00]/50 hover:text-[#FF7A00] transition-all focus:outline-none focus:ring-2 focus:ring-[#FF7A00] focus:ring-offset-2 focus:ring-offset-[#080808]"
                >
                  <svg className="w-4 h-4 fill-current" viewBox="0 0 24 24" aria-hidden="true">
                    <path d="M12 0C5.37 0 0 5.37 0 12c0 5.31 3.435 9.795 8.205 11.385.6.105.825-.255.825-.57 0-.285-.015-1.23-.015-2.235-3.015.555-3.795-.735-4.035-1.41-.135-.345-.72-1.41-1.23-1.695-.42-.225-1.02-.78-.015-.795.945-.015 1.62.87 1.845 1.23 1.08 1.815 2.805 1.305 3.495.99.105-.78.42-1.305.765-1.605-2.67-.3-5.46-1.335-5.46-5.925 0-1.305.465-2.385 1.23-3.225-.12-.3-.54-1.53.12-3.18 0 0 1.005-.315 3.3 1.23.96-.27 1.98-.405 3-.405s2.04.135 3 .405c2.295-1.56 3.3-1.23 3.3-1.23.66 1.65.24 2.88.12 3.18.765.84 1.23 1.905 1.23 3.225 0 4.605-2.805 5.625-5.475 5.925.435.375.81 1.095.81 2.22 0 1.605-.015 2.895-.015 3.3 0 .315.225.69.825.57A12.02 12.02 0 0024 12c0-6.63-5.37-12-12-12z" />
                  </svg>
                  <span>GitHub Repository</span>
                </a>
              )}
            </div>
          )}
        </div>

        {/* Metadata Strip */}
        <div className="grid grid-cols-1 sm:grid-cols-3 gap-6 py-8 border-b border-[#262626] text-xs font-sans">
          <div>
            <span className="text-[10px] uppercase tracking-wider font-semibold text-[#FF7A00] block mb-1">
              Role in Project
            </span>
            <span className="font-medium text-[#F5F5F5] text-sm">{project.role}</span>
          </div>

          <div>
            <span className="text-[10px] uppercase tracking-wider font-semibold text-[#FF7A00] block mb-1">
              Core Technologies
            </span>
            <div className="flex flex-wrap gap-1">
              {project.technologies.map((t, i) => (
                <span key={i} className="text-[#B7B7B7] font-medium">
                  {t}{i < project.technologies.length - 1 ? ", " : ""}
                </span>
              ))}
            </div>
          </div>

          <div>
            <span className="text-[10px] uppercase tracking-wider font-semibold text-[#FF7A00] block mb-1">
              Project Type
            </span>
            <span className="font-medium text-[#F5F5F5] text-sm">
              {project.previewType === "authentic" ? "Deployed Product" : "Interface & Architecture Prototype"}
            </span>
          </div>
        </div>

        {/* Hero Visual / Media */}
        <div className="my-12">
          {project.authenticPreviewUrl ? (
            <div className="relative h-[380px] sm:h-[480px] w-full rounded-2xl overflow-hidden border border-[#262626] shadow-lg">
              <Image
                src={project.authenticPreviewUrl}
                alt={`${project.title} asset`}
                fill
                className="object-cover"
                priority
              />
              <div className="absolute bottom-4 left-4 bg-black/80 text-[#F5F5F5] text-xs px-3 py-1.5 rounded-lg border border-[#262626] backdrop-blur-sm">
                Authentic Project Preview · {project.title}
              </div>
            </div>
          ) : (
            <div className="h-64 rounded-2xl border border-[#262626] bg-[#151515] flex flex-col items-center justify-center p-8 text-center shadow-xs">
              <Layers className="w-12 h-12 text-[#FF7A00]/60 mb-3" />
              <h3 className="font-display text-2xl text-[#F5F5F5] mb-1">
                {project.title} Interface Concept
              </h3>
              <p className="text-xs text-[#818181] font-sans max-w-md">
                Demonstration prototype and information architecture designed for high-clarity user engagement.
              </p>
            </div>
          )}
        </div>

        {/* Case Study Content Sections */}
        <div className="space-y-12">
          {/* 1. Overview & Problem */}
          <section className="grid grid-cols-1 md:grid-cols-12 gap-8">
            <div className="md:col-span-4">
              <h2 className="font-display text-2xl text-[#F5F5F5] sticky top-24">
                Overview &amp; Problem
              </h2>
            </div>
            <div className="md:col-span-8 space-y-4 font-editorial text-lg text-[#F5F5F5]/90 leading-relaxed">
              <p>{project.overview}</p>
              <div className="p-6 bg-[#151515] rounded-xl border border-[#262626] not-italic font-sans text-sm">
                <span className="text-[11px] uppercase tracking-wider font-semibold text-[#FF7A00] block mb-2">
                  The Problem Addressed
                </span>
                <p className="text-[#B7B7B7] leading-relaxed">{project.problem}</p>
              </div>
            </div>
          </section>

          {/* 2. Intended Users */}
          <section className="grid grid-cols-1 md:grid-cols-12 gap-8 pt-8 border-t border-[#262626]">
            <div className="md:col-span-4">
              <h2 className="font-display text-2xl text-[#F5F5F5] sticky top-24">
                Intended Users
              </h2>
            </div>
            <div className="md:col-span-8">
              <ul className="space-y-3 font-sans">
                {project.intendedUsers.map((user, i) => (
                  <li key={i} className="flex items-start gap-3 p-4 bg-[#151515] rounded-xl border border-[#262626]">
                    <UserCheck className="w-5 h-5 text-[#FF7A00] shrink-0 mt-0.5" />
                    <span className="text-sm text-[#F5F5F5] font-medium">{user}</span>
                  </li>
                ))}
              </ul>
            </div>
          </section>

          {/* 3. Team Context & Individual Contribution */}
          <section className="grid grid-cols-1 md:grid-cols-12 gap-8 pt-8 border-t border-[#262626]">
            <div className="md:col-span-4">
              <h2 className="font-display text-2xl text-[#F5F5F5] sticky top-24">
                Team Context &amp; Contribution
              </h2>
            </div>
            <div className="md:col-span-8 space-y-4 font-sans text-sm">
              <div className="p-5 bg-[#151515] rounded-xl border border-[#262626]">
                <span className="text-[10px] uppercase tracking-wider font-semibold text-[#818181] block mb-1">
                  Collaboration Context
                </span>
                <p className="text-[#B7B7B7] leading-relaxed">{project.teamContext}</p>
              </div>

              {project.contribution && (
                <div className="p-5 bg-[#121212] rounded-xl border border-[#FF7A00]/40">
                  <div className="flex items-center gap-2 text-[#FF7A00] font-semibold text-xs uppercase tracking-wider mb-2">
                    <ShieldCheck className="w-4 h-4" />
                    <span>My Individual Contribution</span>
                  </div>
                  <p className="text-[#F5F5F5] leading-relaxed font-medium">
                    {project.contribution}
                  </p>
                </div>
              )}
            </div>
          </section>

          {/* 4. Features Actually Built */}
          <section className="grid grid-cols-1 md:grid-cols-12 gap-8 pt-8 border-t border-[#262626]">
            <div className="md:col-span-4">
              <h2 className="font-display text-2xl text-[#F5F5F5] sticky top-24">
                Features Actually Built
              </h2>
            </div>
            <div className="md:col-span-8">
              <ul className="space-y-3 font-sans">
                {project.featuresBuilt.map((feature, i) => (
                  <li key={i} className="flex items-start gap-3 p-4 bg-[#151515] rounded-xl border border-[#262626]">
                    <CheckCircle2 className="w-4 h-4 text-[#FF7A00] shrink-0 mt-0.5" />
                    <span className="text-sm text-[#F5F5F5]">{feature}</span>
                  </li>
                ))}
              </ul>
            </div>
          </section>

          {/* 5. Challenges & Lessons */}
          <section className="grid grid-cols-1 md:grid-cols-12 gap-8 pt-8 border-t border-[#262626]">
            <div className="md:col-span-4">
              <h2 className="font-display text-2xl text-[#F5F5F5] sticky top-24">
                Challenges &amp; Lessons
              </h2>
            </div>
            <div className="md:col-span-8 space-y-4 font-sans text-sm">
              <div className="p-6 bg-[#151515] rounded-xl border border-[#262626]">
                <h4 className="text-xs uppercase tracking-wider font-semibold text-[#FF7A00] mb-3">
                  Technical Obstacles
                </h4>
                <ul className="space-y-2 text-[#B7B7B7]">
                  {project.challenges.map((c, i) => (
                    <li key={i} className="flex items-start gap-2">
                      <span className="text-[#FF7A00] font-bold">•</span>
                      <span>{c}</span>
                    </li>
                  ))}
                </ul>
              </div>

              <div className="p-6 bg-[#151515] rounded-xl border border-[#262626]">
                <h4 className="text-xs uppercase tracking-wider font-semibold text-[#FF7A00] mb-3">
                  Key Learnings
                </h4>
                <ul className="space-y-2 text-[#F5F5F5]">
                  {project.lessons.map((l, i) => (
                    <li key={i} className="flex items-start gap-2">
                      <span className="text-[#FF7A00] font-bold">•</span>
                      <span>{l}</span>
                    </li>
                  ))}
                </ul>
              </div>
            </div>
          </section>

          {/* 6. Current Limitations & Status */}
          <section className="grid grid-cols-1 md:grid-cols-12 gap-8 pt-8 border-t border-[#262626]">
            <div className="md:col-span-4">
              <h2 className="font-display text-2xl text-[#F5F5F5] sticky top-24">
                Current Status &amp; Limitations
              </h2>
            </div>
            <div className="md:col-span-8">
              <div className="p-6 bg-[#121212] rounded-xl border border-[#262626] flex items-start gap-3 text-sm font-sans">
                <AlertCircle className="w-5 h-5 text-[#FF7A00] shrink-0 mt-0.5" />
                <div>
                  <h4 className="font-semibold text-[#F5F5F5] mb-1">Truthful Scope Boundary</h4>
                  <ul className="space-y-1.5 text-xs text-[#B7B7B7] leading-relaxed">
                    {project.limitations.map((lim, idx) => (
                      <li key={idx}>{lim}</li>
                    ))}
                  </ul>
                </div>
              </div>
            </div>
          </section>
        </div>

        {/* Back navigation */}
        <div className="mt-16 pt-8 border-t border-[#262626] flex items-center justify-between">
          <Link
            href="/projects"
            className="inline-flex items-center gap-2 text-sm font-sans font-medium text-[#FF7A00] hover:text-[#FF9D33] transition-colors"
          >
            <ArrowLeft className="w-4 h-4" />
            <span>Back to All Projects</span>
          </Link>
          <Link
            href="/#contact"
            className="inline-flex items-center gap-1.5 text-sm font-sans font-medium text-[#B7B7B7] hover:text-[#FF7A00] transition-colors"
          >
            <span>Discuss this project with Harish</span>
            <ArrowUpRight className="w-4 h-4" />
          </Link>
        </div>
      </main>

      <Footer />
    </div>
  );
}
