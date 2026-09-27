"use client";

import React, { useState } from "react";
import Link from "next/link";
import { MapPin, Sparkles, Send, ArrowRight } from "lucide-react";
import { useAssistant } from "../ai/AssistantContext";

export default function HeroIntro() {
  const { openAssistant } = useAssistant();
  const [query, setQuery] = useState("");

  const handleQuerySubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!query.trim()) {
      openAssistant("Tell me about the NEC Portal project.");
      return;
    }
    openAssistant(query.trim());
    setQuery("");
  };

  const handleExampleClick = () => {
    openAssistant("Tell me about the NEC Portal project.");
  };

  return (
    <div className="flex flex-col justify-between py-8 px-6 lg:px-12 h-full">
      {/* Top Utility Bar */}
      <div className="flex items-center justify-between pb-8 text-[12px] tracking-[0.14em] uppercase font-sans text-[#B7B7B7]">
        <div className="flex items-center gap-1.5 text-[#B7B7B7]">
          <MapPin className="w-3.5 h-3.5 text-[#FF9D33]" />
          <span>Guntur, Andhra Pradesh</span>
        </div>
        <div className="hidden sm:block text-[11px] tracking-[0.2em] text-[#B7B7B7]">
          BUILD · LEARN · COLLABORATE
        </div>
      </div>

      {/* Main Copy Block */}
      <div className="my-auto max-w-xl">
        {/* Eyebrow */}
        <div className="flex items-center gap-3 mb-6">
          <span className="text-[12px] font-sans tracking-[0.22em] uppercase font-medium text-[#F5F5F5]">
            DESIGN MEETS SYSTEMS
          </span>
          <span className="w-10 h-[1px] bg-[#FF9D33]" aria-hidden="true" />
        </div>

        {/* Display Heading - Broken into two deliberate lines */}
        <h1 className="font-display text-5xl sm:text-6xl lg:text-[76px] font-normal leading-[0.92] tracking-[-0.01em] text-[#F5F5F5] mb-8">
          <span className="block">HARISH</span>
          <span className="block text-[#F5F5F5]">BABU</span>
        </h1>

        {/* Role & Supporting Role */}
        <div className="space-y-1.5 mb-6">
          <p className="text-xl sm:text-[22px] font-medium text-[#F5F5F5] tracking-tight font-sans">
            Software Developer
          </p>
          <p className="text-sm sm:text-[15px] text-[#B7B7B7] font-sans">
            Full Stack Web Development · Cybersecurity
          </p>
        </div>

        {/* Introduction */}
        <p className="text-base sm:text-[17px] leading-relaxed text-[#F5F5F5]/90 font-editorial max-w-lg mb-9">
          I turn ideas into clear, responsive digital products through design, code, and thoughtful execution.
        </p>

        {/* Actions */}
        <div className="flex flex-wrap items-center gap-4 mb-9">
          {/* Filled Burgundy Button */}
          <Link
            href="/#projects"
            className="inline-flex items-center justify-center gap-2.5 px-6 py-3.5 rounded-lg bg-[#FF7A00] text-white text-sm font-sans font-medium hover:bg-[#FF8C1A] transition-all duration-200 shadow-sm focus:outline-none focus-visible:ring-2 focus-visible:ring-[#FF7A00] focus-visible:ring-offset-2"
          >
            <span>View Selected Work</span>
            <ArrowRight className="w-4 h-4" />
          </Link>

          {/* Outlined Burgundy Button */}
          <button
            onClick={() => openAssistant()}
            className="inline-flex items-center justify-center gap-2 px-6 py-3.5 rounded-lg border border-[#FF7A00] text-[#FF7A00] bg-transparent text-sm font-sans font-medium hover:bg-[#FF7A00]/5 transition-all duration-200 focus:outline-none focus-visible:ring-2 focus-visible:ring-[#FF7A00]"
          >
            <Sparkles className="w-4 h-4 text-[#FF9D33]" />
            <span>Ask my AI</span>
          </button>
        </div>

        {/* Wide Outlined Question Input */}
        <div className="w-full max-w-lg">
          <form
            onSubmit={handleQuerySubmit}
            className="relative flex items-center bg-[#151515] border border-[#262626] rounded-xl px-4 py-3 shadow-[0_4px_16px_rgba(89,11,32,0.03)] hover:border-[#FF9D33] focus-within:border-[#FF7A00] focus-within:ring-1 focus-within:ring-[#FF7A00] transition-all"
          >
            <Sparkles className="w-4 h-4 text-[#FF9D33] mr-3 shrink-0" />
            <input
              type="text"
              value={query}
              onChange={(e) => setQuery(e.target.value)}
              placeholder="Ask about my work, skills, or experience..."
              className="w-full bg-transparent text-sm text-[#F5F5F5] placeholder-[#B7B7B7]/70 outline-none font-sans"
            />
            <button
              type="submit"
              className="p-1.5 text-[#FF7A00] hover:text-[#F5F5F5] transition-colors rounded focus:outline-none"
              aria-label="Send query to AI Assistant"
            >
              <Send className="w-4 h-4" />
            </button>
          </form>

          {/* Helper Text */}
          <div className="mt-2 text-xs text-[#B7B7B7] font-sans">
            Example:{" "}
            <button
              type="button"
              onClick={handleExampleClick}
              className="text-[#FF7A00] underline underline-offset-2 hover:text-[#F5F5F5] transition-colors cursor-pointer"
            >
              “Tell me about the NEC Portal project.”
            </button>
          </div>
        </div>
      </div>

      {/* Bottom spacer on desktop to balance composition */}
      <div className="hidden lg:block pt-6" />
    </div>
  );
}
