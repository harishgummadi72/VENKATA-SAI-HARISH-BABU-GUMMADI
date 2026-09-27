import React from "react";
import Link from "next/link";
import Image from "next/image";
import { getPublishedProjects } from "@/lib/content-store";
import { ArrowLeft, ArrowUpRight, Layers, Code, ExternalLink } from "lucide-react";
import Monogram from "@/components/ui/Monogram";
import Footer from "@/components/layout/Footer";
import { FloatingCard } from "@/lib/motion";

export const metadata = {
  title: "Projects & Selected Work | Venkata Sai Harish Babu Gummadi",
  description: "Explore software development and practical engineering work by Venkata Sai Harish Babu Gummadi.",
};

export const dynamic = "force-dynamic";
export const revalidate = 0;

export default async function ProjectsArchivePage() {
  const projects = await getPublishedProjects();

  return (
    <div className="min-h-screen bg-[#080808] flex flex-col selection:bg-[#FF7A00] selection:text-black">
      {/* Top Header Bar */}
      <header className="w-full border-b border-[#262626] bg-[#080808]/90 backdrop-blur-sm sticky top-0 z-30 px-6 lg:px-16 py-4">
        <div className="max-w-[1600px] mx-auto flex items-center justify-between">
          <div className="flex items-center gap-4">
            <Link href="/" className="hover:opacity-80 transition-opacity">
              <Monogram className="w-8 h-9" />
            </Link>
            <div className="text-xs tracking-wider uppercase font-sans font-medium text-[#F5F5F5]">
              <span>Harish Babu</span>
              <span className="mx-2 text-[#262626]">/</span>
              <span className="text-[#FF7A00]">Project Archive</span>
            </div>
          </div>

          <Link
            href="/"
            className="inline-flex items-center gap-2 text-xs font-sans font-medium text-[#FF7A00] hover:text-[#FF9D33] transition-colors"
          >
            <ArrowLeft className="w-3.5 h-3.5" />
            <span>Return to Portfolio</span>
          </Link>
        </div>
      </header>

      {/* Main Content */}
      <main className="flex-1 max-w-[1600px] mx-auto w-full py-16 px-6 lg:px-16">
        {/* Eyebrow & Title */}
        <div className="max-w-3xl mb-12">
          <div className="flex items-center gap-3 mb-3">
            <span className="text-[11px] font-sans tracking-[0.24em] uppercase font-medium text-[#FF7A00]">
              SELECTED WORKS &amp; SYSTEMS
            </span>
            <span className="w-8 h-[1px] bg-[#FF7A00]/40" aria-hidden="true" />
          </div>
          <h1 className="font-display text-4xl sm:text-6xl font-normal text-[#F5F5F5] mb-4">
            Curated Project Archive
          </h1>
          <p className="text-base sm:text-lg text-[#B7B7B7] font-editorial leading-relaxed">
            Practical development work, application architectures, and hands-on software engineering projects.
          </p>
        </div>

        {/* Project Grid or In Progress State */}
        {projects.length === 0 ? (
          <div className="rounded-2xl border border-[#262626] bg-[#151515] p-8 sm:p-14 text-center max-w-2xl mx-auto shadow-xs">
            <span className="text-[11px] font-sans tracking-[0.24em] uppercase font-semibold text-[#FF7A00] block mb-2">
              PORTFOLIO ARCHIVE
            </span>
            <h2 className="font-display text-3xl sm:text-4xl text-[#F5F5F5] font-normal mb-4">
              Projects in Progress
            </h2>
            <p className="text-sm sm:text-base text-[#B7B7B7] font-editorial leading-relaxed mb-8">
              Currently building and documenting practical software projects. Selected work will be published here as it becomes ready. In the meantime, explore code repositories and ongoing development experiments directly on GitHub.
            </p>
            <a
              href="https://github.com/harishgummadi72"
              target="_blank"
              rel="noopener noreferrer"
              className="inline-flex items-center gap-2 px-6 py-3 rounded-xl bg-[#FF7A00] text-black text-xs sm:text-sm font-sans font-medium hover:bg-[#FF8C1A] hover:shadow-md active:scale-95 transition-all"
            >
              <span>Explore GitHub</span>
              <ArrowUpRight className="w-4 h-4" />
            </a>
          </div>
        ) : (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
            {projects.map((project, idx) => (
              <FloatingCard key={project.id} index={idx} distance={5}>
                <article
                  className="group relative flex flex-col justify-between rounded-2xl border border-[#262626] bg-[#151515] p-7 shadow-[0_8px_30px_rgba(0,0,0,0.5)] hover:shadow-[0_18px_44px_rgba(255,122,0,0.08)] hover:border-[#FF7A00]/45 hover:-translate-y-1 transition-all duration-300 h-full"
                >
                  {/* Accessible Full-Card Primary Navigation Link */}
                  <Link
                    href={`/projects/${project.slug}`}
                    className="absolute inset-0 z-10 rounded-2xl focus:outline-none focus:ring-2 focus:ring-[#FF7A00] focus:ring-offset-2 focus:ring-offset-[#080808]"
                    aria-label={`Read case study: ${project.title}`}
                  />

                  <div>
                    <div className="flex items-center justify-between pb-4 mb-4 border-b border-[#262626] text-xs font-sans">
                      <span className="text-[#FF7A00] font-medium tracking-wider uppercase">
                        {project.category}
                      </span>
                      <span className="px-2.5 py-0.5 rounded-full text-[10px] font-medium bg-[#121212] text-[#B7B7B7] border border-[#262626]">
                        {project.status}
                      </span>
                    </div>

                    <div className="relative h-48 w-full rounded-xl overflow-hidden mb-6 bg-[#0D0D0D] border border-[#262626]">
                      {project.authenticPreviewUrl ? (
                        <Image
                          src={project.authenticPreviewUrl}
                          alt={project.title}
                          fill
                          className="object-cover group-hover:scale-105 transition-transform duration-500"
                          sizes="(max-width: 768px) 100vw, 400px"
                        />
                      ) : (
                        <div className="absolute inset-0 flex flex-col items-center justify-center p-6 text-center bg-gradient-to-br from-[#121212] to-[#0D0D0D]">
                          <Layers className="w-8 h-8 text-[#FF7A00]/60 mb-2" />
                          <span className="text-sm font-serif font-medium text-[#F5F5F5]">
                            {project.title}
                          </span>
                          <span className="text-[10px] text-[#818181] font-sans mt-0.5">
                            Interface Concept
                          </span>
                        </div>
                      )}
                      <div className="absolute top-2 left-2 px-2 py-0.5 rounded bg-black/80 text-[#FF7A00] border border-[#262626] font-mono text-[10px] backdrop-blur-xs">
                        0{idx + 1}
                      </div>
                    </div>

                    <h2 className="font-display text-2xl font-normal text-[#F5F5F5] mb-2 group-hover:text-[#FF7A00] transition-colors">
                      {project.title}
                    </h2>
                    <p className="text-sm text-[#B7B7B7] font-editorial leading-relaxed mb-4">
                      {project.tagline}
                    </p>

                    <div className="p-3.5 bg-[#121212] rounded-lg border border-[#262626] mb-5">
                      <span className="text-[10px] uppercase font-semibold text-[#FF7A00] tracking-wider block mb-1">
                        Role &amp; Contribution
                      </span>
                      <p className="text-xs text-[#F5F5F5]/85 font-sans leading-relaxed">
                        {project.contribution}
                      </p>
                    </div>
                  </div>

                  <div>
                    <div className="flex flex-wrap gap-1.5 mb-6">
                      {project.technologies.map((t, i) => (
                        <span
                          key={i}
                          className="text-[11px] font-sans px-2.5 py-1 bg-[#0D0D0D] text-[#B7B7B7] rounded border border-[#262626]"
                        >
                          {t}
                        </span>
                      ))}
                    </div>

                    {/* Actions & Cue */}
                    <div className="space-y-3">
                      <div className="w-full inline-flex items-center justify-between p-3 rounded-lg bg-[#FF7A00] text-black text-xs font-sans font-medium group-hover:bg-[#FF8C1A] transition-colors pointer-events-none">
                        <span>Read Case Study</span>
                        <ArrowUpRight className="w-3.5 h-3.5 transition-transform duration-200 group-hover:translate-x-0.5 group-hover:-translate-y-0.5" />
                      </div>

                      {(project.liveUrl || project.repoUrl) && (
                        <div className="flex items-center justify-between pt-2 border-t border-[#262626] text-xs font-sans relative z-20">
                          {project.liveUrl ? (
                            <a
                              href={project.liveUrl}
                              target="_blank"
                              rel="noopener noreferrer"
                              className="inline-flex items-center gap-1.5 text-[#FF7A00] hover:text-[#FF9D33] font-medium transition-colors p-1"
                              aria-label={`Live demo for ${project.title}`}
                            >
                              <ExternalLink className="w-3.5 h-3.5" />
                              <span>Live Demo</span>
                            </a>
                          ) : <span />}

                          {project.repoUrl && (
                            <a
                              href={project.repoUrl}
                              target="_blank"
                              rel="noopener noreferrer"
                              className="inline-flex items-center gap-1.5 text-[#B7B7B7] hover:text-[#F5F5F5] transition-colors p-1"
                              aria-label={`GitHub repository for ${project.title}`}
                            >
                              <Code className="w-3.5 h-3.5" />
                              <span>Repository</span>
                            </a>
                          )}
                        </div>
                      )}
                    </div>
                  </div>
                </article>
              </FloatingCard>
            ))}
          </div>
        )}
      </main>

      <Footer />
    </div>
  );
}
