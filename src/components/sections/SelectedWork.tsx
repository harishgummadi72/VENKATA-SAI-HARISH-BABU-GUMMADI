"use client";

import React from "react";
import Link from "next/link";
import Image from "next/image";
import { motion, useReducedMotion } from "framer-motion";
import { Layers, ArrowUpRight, Code, ExternalLink, GitBranch, Terminal } from "lucide-react";
import { Project } from "@/types/portfolio";
import { useFinePointerTilt, FOCUS_RING, FloatingCard } from "@/lib/motion";

interface SelectedWorkProps {
  projects: Project[];
}

function ProjectCard({ project, idx }: { project: Project; idx: number }) {
  const shouldReduceMotion = useReducedMotion();
  const { ref, style, onMouseMove, onMouseLeave } = useFinePointerTilt();

  return (
    <motion.article
      initial={{ opacity: shouldReduceMotion ? 1 : 0, y: shouldReduceMotion ? 0 : 25 }}
      whileInView={{ opacity: 1, y: 0 }}
      viewport={{ once: true, margin: "-60px" }}
      transition={{
        duration: 0.5,
        delay: shouldReduceMotion ? 0 : idx * 0.1,
        ease: [0.22, 1, 0.36, 1]
      }}
      className="group relative flex flex-col justify-between rounded-xl sm:rounded-2xl border border-[#262626] bg-[#151515] p-7 shadow-[0_8px_32px_rgba(0,0,0,0.7)] hover:shadow-[0_16px_48px_rgba(255,122,0,0.12)] hover:border-[#FF7A00]/50 hover:-translate-y-1 active:translate-y-0 active:scale-[0.99] transition-all duration-300"
    >
      <div
        ref={ref}
        style={shouldReduceMotion ? undefined : style}
        onMouseMove={onMouseMove}
        onMouseLeave={onMouseLeave}
        className="flex flex-col justify-between h-full"
      >
        <Link
          href={`/projects/${project.slug}`}
          className={`absolute inset-0 z-10 rounded-xl sm:rounded-2xl ${FOCUS_RING}`}
          aria-label={`Read case study: ${project.title}`}
        />

        <div>
          <div className="flex items-center justify-between pb-4 mb-4 border-b border-[#262626] text-xs font-sans">
            <span className="text-[#FF7A00] font-medium tracking-wider uppercase">
              {project.category}
            </span>
            <span className="px-2.5 py-0.5 rounded-full text-[10px] tracking-wide font-medium bg-[#121212] text-[#FF9D33] border border-[#262626]">
              {project.status}
            </span>
          </div>

          <div className="relative h-48 w-full rounded-lg overflow-hidden mb-6 bg-[#0D0D0D] border border-[#262626]">
            {project.authenticPreviewUrl ? (
              <Image
                src={project.authenticPreviewUrl}
                alt={`${project.title} preview`}
                fill
                className="object-cover group-hover:scale-105 transition-transform duration-500 ease-out"
                sizes="(max-width: 768px) 100vw, 400px"
              />
            ) : (
              <div className="absolute inset-0 flex flex-col items-center justify-center p-6 text-center bg-gradient-to-br from-[#121212] to-[#0A0A0A]">
                <Layers className="w-8 h-8 text-[#FF7A00]/70 mb-2 transition-transform duration-300 group-hover:scale-110" />
                <span className="text-xs font-serif font-medium text-[#F5F5F5]">
                  {project.title}
                </span>
                <span className="text-[10px] text-[#818181] font-sans mt-0.5">
                  Interactive Web Architecture
                </span>
              </div>
            )}
            <div className="absolute top-2 left-2 px-2 py-0.5 rounded bg-[#080808]/85 text-[#F5F5F5] font-mono text-[10px] border border-[#262626]">
              0{idx + 1}
            </div>
          </div>

          <h3 className="font-display text-2xl font-normal text-[#F5F5F5] mb-2 group-hover:text-[#FF7A00] transition-colors">
            {project.title}
          </h3>
          <p className="text-sm text-[#B7B7B7] font-editorial leading-relaxed mb-4 line-clamp-3">
            {project.tagline}
          </p>

          {project.contribution && (
            <div className="p-3 bg-[#121212] rounded-lg border border-[#262626] mb-5 group-hover:border-[#FF7A00]/30 transition-colors">
              <div className="text-[10px] tracking-wider uppercase font-semibold text-[#FF7A00] mb-1 font-sans">
                Role &amp; Contribution
              </div>
              <p className="text-xs text-[#B7B7B7] font-sans leading-relaxed line-clamp-2">
                {project.contribution}
              </p>
            </div>
          )}
        </div>

        <div>
          <div className="flex flex-wrap gap-1.5 mb-6">
            {project.technologies.slice(0, 4).map((tech, i) => (
              <span
                key={i}
                className="text-[11px] font-sans px-2.5 py-1 bg-[#121212] text-[#F5F5F5] rounded border border-[#262626] group-hover:border-[#FF7A00]/30 transition-colors"
              >
                {tech}
              </span>
            ))}
          </div>

          <div className="pt-4 border-t border-[#262626] flex items-center justify-between">
            <div className="inline-flex items-center gap-1.5 text-sm font-sans font-medium text-[#FF7A00] group-hover:text-[#FF9D33] transition-colors pointer-events-none">
              <span>Read Case Study</span>
              <ArrowUpRight className="w-4 h-4 transition-transform duration-200 group-hover:translate-x-0.5 group-hover:-translate-y-0.5 text-[#FF7A00]" />
            </div>

            <div className="flex items-center gap-3 relative z-20">
              {project.liveUrl && (
                <a
                  href={project.liveUrl}
                  target="_blank"
                  rel="noopener noreferrer"
                  className={`text-xs text-[#FF7A00] hover:text-[#FF9D33] inline-flex items-center gap-1 font-medium transition-colors p-1 rounded ${FOCUS_RING}`}
                  aria-label={`Live demo for ${project.title}`}
                >
                  <ExternalLink className="w-3.5 h-3.5" />
                  <span>Live</span>
                </a>
              )}
              {project.repoUrl && (
                <a
                  href={project.repoUrl}
                  target="_blank"
                  rel="noopener noreferrer"
                  className={`text-xs text-[#B7B7B7] hover:text-[#F5F5F5] inline-flex items-center gap-1 transition-colors p-1 rounded ${FOCUS_RING}`}
                  aria-label={`Code repository for ${project.title}`}
                >
                  <Code className="w-3.5 h-3.5" />
                  <span>Code</span>
                </a>
              )}
            </div>
          </div>
        </div>
      </div>
    </motion.article>
  );
}

export default function SelectedWork({ projects }: SelectedWorkProps) {
  const featuredProjects = projects.filter((p) => p.featured && p.published);
  const shouldReduceMotion = useReducedMotion();

  return (
    <section
      id="projects"
      className="relative w-full py-20 px-6 lg:px-16 bg-[#080808] border-b border-[#262626] scroll-mt-20"
    >
      <div className="max-w-[1600px] mx-auto">
        {/* Section Header */}
        <motion.div
          initial={{ opacity: shouldReduceMotion ? 1 : 0, y: shouldReduceMotion ? 0 : 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true, margin: "-80px" }}
          transition={{ duration: 0.5, ease: [0.22, 1, 0.36, 1] }}
          className="flex flex-col lg:flex-row lg:items-end justify-between pb-12 mb-12 border-b border-[#262626] gap-6"
        >
          <div className="max-w-2xl">
            <div className="flex items-center gap-3 mb-3">
              <span className="text-[11px] font-sans tracking-[0.24em] uppercase font-medium text-[#FF7A00]">
                SELECTED WORK
              </span>
              <span className="w-8 h-[1px] bg-[#FF7A00]" aria-hidden="true" />
            </div>
            <h2 className="font-display text-4xl sm:text-5xl lg:text-[56px] font-normal leading-[1.05] text-[#F5F5F5]">
              Projects that turn ideas into software.
            </h2>
          </div>

          <div className="flex items-end justify-between lg:justify-end gap-8">
            <div className="max-w-xs text-sm text-[#B7B7B7] font-editorial leading-relaxed hidden sm:block">
              Building and documenting software solutions with clean architecture and practical problem solving.
            </div>
            <span className="font-display text-4xl sm:text-5xl text-[#FF7A00]/25 leading-none select-none">
              01
            </span>
          </div>
        </motion.div>

        {/* If projects exist, render grid with FloatingCard wrappers. Otherwise, render Future Work State */}
        {featuredProjects.length > 0 ? (
          <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
            {featuredProjects.map((project, idx) => (
              <FloatingCard key={project.id} index={idx} distance={6}>
                <ProjectCard project={project} idx={idx} />
              </FloatingCard>
            ))}
          </div>
        ) : (
          <motion.div
            initial={{ opacity: shouldReduceMotion ? 1 : 0, y: shouldReduceMotion ? 0 : 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true, margin: "-60px" }}
            transition={{ duration: 0.5, ease: [0.22, 1, 0.36, 1] }}
            className="rounded-2xl border border-[#262626] bg-[#151515] p-8 sm:p-12 lg:p-16 shadow-[0_12px_36px_rgba(0,0,0,0.6)] relative overflow-hidden"
          >
            {/* Subtle background decorative linework */}
            <div className="absolute top-0 right-0 w-96 h-96 bg-gradient-to-br from-[#FF7A00]/5 to-transparent rounded-full blur-3xl pointer-events-none -mr-20 -mt-20" />

            <div className="relative z-10 max-w-3xl">
              <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-[#FF7A00]/10 text-[#FF7A00] text-xs font-sans font-semibold tracking-wider uppercase mb-6">
                <GitBranch className="w-3.5 h-3.5" />
                <span>Projects in Progress</span>
              </div>

              <h3 className="font-display text-3xl sm:text-4xl text-[#F5F5F5] font-normal leading-tight mb-4">
                Currently building and documenting practical software projects.
              </h3>

              <p className="text-base sm:text-lg text-[#B7B7B7] font-editorial leading-relaxed mb-8">
                Selected work in full-stack web applications, algorithmic implementations, and backend database integrations will be published here as each project reaches production readiness.
              </p>

              {/* Working Button */}
              <div className="flex flex-wrap items-center gap-4 pt-2">
                <a
                  href="https://github.com/harishgummadi72"
                  target="_blank"
                  rel="noopener noreferrer"
                  className={`inline-flex items-center gap-2.5 px-6 py-3.5 rounded-xl bg-[#FF7A00] text-[#080808] text-sm font-sans font-semibold hover:bg-[#FF8C1A] hover:-translate-y-0.5 active:translate-y-0 transition-all duration-200 shadow-sm ${FOCUS_RING}`}
                >
                  <Code className="w-4 h-4" />
                  <span>Explore GitHub</span>
                  <ExternalLink className="w-4 h-4 ml-0.5" />
                </a>

                <Link
                  href="/#skills"
                  className={`inline-flex items-center gap-2 px-6 py-3.5 rounded-xl border border-[#262626] text-[#F5F5F5] bg-[#121212] text-sm font-sans font-medium hover:border-[#FF7A00]/50 transition-colors ${FOCUS_RING}`}
                >
                  <Terminal className="w-4 h-4 text-[#FF7A00]" />
                  <span>View Technical Skills</span>
                </Link>
              </div>

              {/* Development Tracks */}
              <div className="mt-10 pt-8 border-t border-[#262626] grid grid-cols-1 sm:grid-cols-3 gap-4 font-sans text-xs">
                <div className="p-3.5 bg-[#121212] rounded-lg border border-[#262626]">
                  <span className="font-semibold text-[#FF7A00] block mb-1">Track 01</span>
                  <p className="text-[#B7B7B7]">Full Stack Web Applications with HTML &amp; Supabase</p>
                </div>
                <div className="p-3.5 bg-[#121212] rounded-lg border border-[#262626]">
                  <span className="font-semibold text-[#FF7A00] block mb-1">Track 02</span>
                  <p className="text-[#B7B7B7]">Core Algorithmic Foundations in C, Java &amp; Python</p>
                </div>
                <div className="p-3.5 bg-[#121212] rounded-lg border border-[#262626]">
                  <span className="font-semibold text-[#FF7A00] block mb-1">Track 03</span>
                  <p className="text-[#B7B7B7]">Cybersecurity Mindset &amp; Defensible Development</p>
                </div>
              </div>
            </div>
          </motion.div>
        )}
      </div>
    </section>
  );
}
