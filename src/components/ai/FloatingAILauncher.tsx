"use client";

import React from "react";
import { motion, useReducedMotion } from "framer-motion";
import { Sparkles } from "lucide-react";
import { useAssistant } from "./AssistantContext";

export default function FloatingAILauncher() {
  const { openAssistant, isOpen } = useAssistant();
  const shouldReduceMotion = useReducedMotion();

  // If the assistant modal is currently open, hide the floating trigger
  if (isOpen) return null;

  return (
    <motion.div
      initial={{ opacity: 0, scale: 0.8, y: 20 }}
      animate={{ opacity: 1, scale: 1, y: 0 }}
      exit={{ opacity: 0, scale: 0.8, y: 20 }}
      transition={{
        duration: shouldReduceMotion ? 0.05 : 0.3,
        ease: [0.22, 1, 0.36, 1],
        delay: 0.5
      }}
      className="fixed bottom-5 right-5 sm:bottom-7 sm:right-7 z-40"
    >
      <button
        onClick={() => openAssistant()}
        className="group relative flex items-center gap-2.5 px-4 py-3 sm:px-5 sm:py-3.5 rounded-full bg-[#FF7A00] text-[#080808] shadow-[0_8px_30px_rgba(255,122,0,0.35)] hover:shadow-[0_12px_36px_rgba(255,122,0,0.5)] hover:bg-[#FF8C1A] active:scale-95 transition-all duration-200 border border-[#FF9D33]/40 focus:outline-none focus-visible:ring-2 focus-visible:ring-[#FF7A00] focus-visible:ring-offset-2 focus-visible:ring-offset-[#080808] cursor-pointer select-none"
        aria-label="Open Ask my AI Assistant"
      >
        {/* Subtle breathing ambient highlight */}
        <span
          className="absolute inset-0 rounded-full bg-gradient-to-r from-transparent via-white/20 to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-300 pointer-events-none"
          aria-hidden="true"
        />

        <div className="relative flex items-center justify-center">
          <Sparkles className="w-4 h-4 text-[#080808] transition-transform duration-300 group-hover:rotate-12 group-hover:scale-110" />
        </div>

        <div className="flex flex-col text-left">
          <span className="font-display text-xs sm:text-sm font-semibold tracking-wide leading-tight text-[#080808]">
            Ask my AI
          </span>
          <span className="text-[9px] font-sans text-[#080808]/80 font-medium uppercase tracking-wider hidden sm:block">
            Published Records
          </span>
        </div>

        {/* Live indicator dot */}
        <span className="relative flex h-2 w-2 ml-1">
          <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-[#080808] opacity-75" />
          <span className="relative inline-flex rounded-full h-2 w-2 bg-[#080808]" />
        </span>
      </button>
    </motion.div>
  );
}
