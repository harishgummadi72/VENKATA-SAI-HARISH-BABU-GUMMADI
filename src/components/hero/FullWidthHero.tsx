"use client";

import React, { useState } from "react";
import Link from "next/link";
import { MapPin, Sparkles, Send, ExternalLink, Mail } from "lucide-react";
import { useAssistant } from "../ai/AssistantContext";
import ArchitecturalArtwork from "./ArchitecturalArtwork";
import { useAmbientAnimation, FOCUS_RING } from "@/lib/motion";
import { PortfolioProfile } from "@/types/portfolio";

interface FullWidthHeroProps {
  profile?: PortfolioProfile;
}

export default function FullWidthHero({ profile }: FullWidthHeroProps) {
  const { openAssistant } = useAssistant();
  const [query, setQuery] = useState("");
  const isAmbientActive = useAmbientAnimation();

  const rawName = (profile?.name || "VENKATA SAI HARISH BABU GUMMADI").trim();
  
  // Format long name into 3 visually balanced editorial lines
  const nameLines = rawName === "VENKATA SAI HARISH BABU GUMMADI"
    ? ["VENKATA SAI", "HARISH BABU", "GUMMADI"]
    : rawName.split(/\s+/).length >= 4
      ? ["VENKATA SAI", "HARISH BABU", rawName.split(/\s+/).slice(4).join(" ") || "GUMMADI"]
      : [rawName];

  const handleQuerySubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!query.trim()) {
      openAssistant("Tell me about Harish's education and technical skills.");
      return;
    }
    openAssistant(query.trim());
    setQuery("");
  };

  const handleExampleClick = () => {
    openAssistant("Tell me about Harish's education and technical skills.");
  };

  return (
    <section
      id="top"
      className="relative w-full min-h-[calc(100svh-72px)] flex flex-col justify-between py-8 sm:py-12 px-6 lg:px-16 bg-[#080808] paper-grain border-b border-[#262626] overflow-hidden"
    >
      {/* Delicate Architectural Linework in Background with visibility-aware ambient breathing */}
      <div className="absolute inset-0 flex items-center justify-center pointer-events-none opacity-30 select-none z-0">
        <ArchitecturalArtwork className="w-full max-w-5xl h-auto" isAmbientActive={isAmbientActive} />
      </div>

      <div className="relative z-10 max-w-4xl mx-auto w-full flex-1 flex flex-col justify-between items-center text-center">
        {/* Top Secondary Information */}
        <div
          className="w-full flex flex-col sm:flex-row items-center justify-between text-[11px] tracking-[0.15em] sm:tracking-[0.18em] uppercase font-sans text-[#818181] pb-4 gap-2 anim-fade-up"
          style={{ animationDelay: "0.05s" }}
        >
          <div className="flex items-center gap-1.5 text-[#B7B7B7]">
            <MapPin className="w-3.5 h-3.5 text-[#FF7A00]" />
            <span>{profile?.location || "Guntur, Andhra Pradesh, India"}</span>
          </div>
          <div className="text-[10px] sm:text-[11px] tracking-[0.18em] sm:tracking-[0.22em] text-[#818181]">
            BUILD · LEARN · COLLABORATE
          </div>
        </div>

        {/* Center: Main Balanced Editorial Introduction */}
        <div className="my-auto py-4 sm:py-8 w-full flex flex-col items-center">
          {/* Eyebrow with Animated Orange Rule */}
          <div
            className="flex items-center justify-center gap-3 mb-4 anim-fade-up"
            style={{ animationDelay: "0.15s" }}
          >
            <span className="text-[11px] sm:text-xs font-sans tracking-[0.24em] uppercase font-medium text-[#F5F5F5]">
              SOFTWARE &amp; SYSTEMS
            </span>
            <span
              className="h-[1px] bg-[#FF7A00] inline-block anim-rule"
              style={{ animationDelay: "0.25s" }}
              aria-hidden="true"
            />
          </div>

          {/* Dominant Heading: Dynamic Name from Profile */}
          <h1 className="font-display text-3xl xs:text-4xl sm:text-6xl md:text-7xl lg:text-[76px] font-normal leading-[0.95] tracking-[-0.015em] text-[#F5F5F5] mb-5 sm:mb-6 max-w-full">
            {nameLines.map((line, idx) => (
              <span
                key={idx}
                className="block anim-fade-up"
                style={{ animationDelay: `${0.25 + idx * 0.1}s` }}
              >
                {line}
              </span>
            ))}
          </h1>

          {/* Role & Supporting Role */}
          <div
            className="space-y-1 mb-5 sm:mb-6 anim-fade-up max-w-full px-2"
            style={{ animationDelay: "0.55s" }}
          >
            <p className="text-lg sm:text-2xl font-medium text-[#F5F5F5] tracking-tight font-sans">
              {profile?.primaryRole || "Software Developer"}
            </p>
            <p className="text-xs sm:text-[15px] text-[#B7B7B7] font-sans">
              {profile?.supportingRole || "Full Stack Web Development · AI · Cybersecurity"}
            </p>
            <p className="text-[11px] sm:text-xs uppercase tracking-wider text-[#FF7A00] font-sans font-medium pt-1">
              Computer Science and Engineering Undergraduate
            </p>
          </div>

          {/* Editorial Introduction Paragraph */}
          <p
            className="text-sm sm:text-base md:text-lg leading-relaxed text-[#B7B7B7] font-editorial max-w-2xl mb-6 sm:mb-8 anim-fade-up px-2 sm:px-0"
            style={{ animationDelay: "0.65s" }}
          >
            {profile?.introduction ||
              "Computer Science and Engineering student with hands-on experience developing AI-enabled web applications and participating in competitive internal hackathons. Interested in full-stack development, artificial intelligence, software engineering and cybersecurity."}
          </p>

          {/* Action Buttons */}
          <div
            className="flex flex-col sm:flex-row items-center justify-center gap-3 sm:gap-4 mb-6 sm:mb-8 w-full sm:w-auto anim-fade-up px-4 sm:px-0"
            style={{ animationDelay: "0.75s" }}
          >
            {/* Primary CTA: View Projects */}
            <Link
              href="/#projects"
              className={`group w-full sm:w-auto inline-flex items-center justify-center gap-2.5 px-6 sm:px-7 py-3 sm:py-3.5 rounded-xl bg-[#FF7A00] text-[#080808] text-sm font-sans font-semibold hover:bg-[#FF8C1A] hover:shadow-[0_0_20px_rgba(255,122,0,0.35)] hover:-translate-y-0.5 active:translate-y-0 active:scale-98 transition-all duration-200 shadow-sm ${FOCUS_RING}`}
            >
              <span>View Projects</span>
            </Link>

            {/* Secondary CTA: GitHub */}
            <a
              href={profile?.contact.github || "https://github.com/harishgummadi72"}
              target="_blank"
              rel="noopener noreferrer"
              className={`group w-full sm:w-auto inline-flex items-center justify-center gap-2 px-6 sm:px-7 py-3 sm:py-3.5 rounded-xl border border-[#262626] text-[#F5F5F5] bg-[#121212] hover:border-[#FF7A00]/60 hover:text-[#FF7A00] hover:-translate-y-0.5 active:translate-y-0 active:scale-98 transition-all duration-200 cursor-pointer ${FOCUS_RING}`}
            >
              <span>GitHub</span>
              <ExternalLink className="w-3.5 h-3.5 transition-transform duration-200 group-hover:translate-x-0.5" />
            </a>

            {/* Tertiary CTA: Contact Me */}
            <Link
              href="/#contact"
              className={`group w-full sm:w-auto inline-flex items-center justify-center gap-2 px-6 sm:px-7 py-3 sm:py-3.5 rounded-xl border border-[#262626] text-[#F5F5F5] bg-[#121212] hover:border-[#FF7A00]/60 hover:text-[#FF7A00] hover:-translate-y-0.5 active:translate-y-0 active:scale-98 transition-all duration-200 cursor-pointer ${FOCUS_RING}`}
            >
              <Mail className="w-4 h-4 text-[#FF7A00]" />
              <span>Contact</span>
            </Link>

            {/* AI Assistant Button */}
            <button
              onClick={() => openAssistant()}
              className={`group w-full sm:w-auto inline-flex items-center justify-center gap-2 px-5 py-3 sm:py-3.5 rounded-xl border border-[#FF7A00]/40 text-[#FF7A00] bg-[#121212] text-sm font-sans font-medium hover:bg-[#FF7A00]/10 hover:-translate-y-0.5 active:translate-y-0 active:scale-98 transition-all duration-200 cursor-pointer ${FOCUS_RING}`}
            >
              <Sparkles className="w-4 h-4 text-[#FF7A00] transition-transform duration-200 group-hover:rotate-12" />
              <span>Ask AI</span>
            </button>
          </div>

          {/* Wide Outlined Question Input */}
          <div
            className="w-full max-w-lg anim-fade-up"
            style={{ animationDelay: "0.85s" }}
          >
            <form
              onSubmit={handleQuerySubmit}
              className={`relative flex items-center bg-[#151515] border border-[#262626] rounded-xl px-4 py-3.5 shadow-[0_4px_24px_rgba(0,0,0,0.6)] hover:border-[#FF7A00]/50 focus-within:border-[#FF7A00] focus-within:ring-2 focus-within:ring-[#FF7A00]/20 transition-all ${FOCUS_RING}`}
            >
              <Sparkles className="w-4 h-4 text-[#FF7A00] mr-3 shrink-0" />
              <input
                type="text"
                value={query}
                onChange={(e) => setQuery(e.target.value)}
                placeholder="Ask about Harish's education, skills, or projects..."
                className="w-full bg-transparent text-sm text-[#F5F5F5] placeholder-[#818181] outline-none font-sans"
              />
              <button
                type="submit"
                className="p-1.5 text-[#FF7A00] hover:text-[#FF8C1A] hover:scale-110 active:scale-95 transition-all rounded focus:outline-none cursor-pointer"
                aria-label="Send query to AI Assistant"
              >
                <Send className="w-4 h-4" />
              </button>
            </form>

            {/* Helper Prompt */}
            <div className="mt-2.5 text-xs text-[#818181] font-sans">
              Example:{" "}
              <button
                type="button"
                onClick={handleExampleClick}
                className="text-[#FF7A00] underline underline-offset-2 hover:text-[#FF8C1A] transition-colors cursor-pointer"
              >
                &ldquo;Tell me about Harish&apos;s education and technical skills&rdquo;
              </button>
            </div>
          </div>
        </div>

        {/* Bottom Scroll Prompt Indicator */}
        <div
          className="pt-2 pb-1 anim-fade-up"
          style={{ animationDelay: "0.95s" }}
        >
          <Link
            href="/#about"
            className="group inline-flex flex-col items-center gap-1.5 text-[#818181] hover:text-[#FF7A00] transition-colors"
            aria-label="Scroll to About section"
          >
            <span className="text-[10px] tracking-[0.2em] uppercase font-sans">
              Explore Portfolio
            </span>
            <div className="w-4 h-7 rounded-full border border-[#262626] flex items-start justify-center p-1 group-hover:border-[#FF7A00] transition-colors">
              <span className="w-1 h-1.5 bg-[#FF7A00] rounded-full animate-bounce" />
            </div>
          </Link>
        </div>
      </div>
    </section>
  );
}
