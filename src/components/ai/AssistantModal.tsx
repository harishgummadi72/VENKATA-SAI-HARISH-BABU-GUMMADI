"use client";

import React, { useState, useEffect, useRef } from "react";
import { motion, AnimatePresence, useReducedMotion } from "framer-motion";
import { useAssistant } from "./AssistantContext";
import { X, Send, Sparkles, Trash2, ArrowUpRight, RotateCcw, Square, AlertCircle, Mail } from "lucide-react";
import Link from "next/link";

// Clean lightweight markdown parser for streaming output
function FormattedMessage({ text, isStreaming }: { text: string; isStreaming?: boolean }) {
  if (!text) {
    if (isStreaming) {
      return (
        <span className="inline-flex items-center gap-1 text-xs text-[#818181] italic">
          Thinking
          <span className="inline-block w-1.5 h-1.5 rounded-full bg-[#FF7A00] animate-ping" />
        </span>
      );
    }
    return null;
  }

  const lines = text.split("\n");

  return (
    <div className="space-y-2 text-sm leading-relaxed text-[#F5F5F5]">
      {lines.map((line, idx) => {
        const trimmed = line.trim();
        if (!trimmed) {
          return <div key={idx} className="h-1" />;
        }

        // Bullet point
        if (trimmed.startsWith("• ") || trimmed.startsWith("* ") || trimmed.startsWith("- ")) {
          const content = trimmed.replace(/^([•*-]\s+)/, "");
          return (
            <div key={idx} className="flex items-start gap-2 pl-1">
              <span className="text-[#FF7A00] font-bold select-none leading-tight mt-1">•</span>
              <div className="flex-1">{parseInlineFormatting(content)}</div>
            </div>
          );
        }

        // Numbered list
        const numMatch = trimmed.match(/^(\d+)\.\s+(.*)/);
        if (numMatch) {
          return (
            <div key={idx} className="flex items-start gap-2 pl-1">
              <span className="text-[#FF7A00] font-semibold text-xs min-w-4 text-right select-none pt-0.5">{numMatch[1]}.</span>
              <div className="flex-1">{parseInlineFormatting(numMatch[2])}</div>
            </div>
          );
        }

        // Header / Bold section line
        if (trimmed.startsWith("### ")) {
          return (
            <h4 key={idx} className="font-semibold text-[#FF7A00] text-sm pt-1">
              {parseInlineFormatting(trimmed.replace(/^###\s+/, ""))}
            </h4>
          );
        }

        return <p key={idx}>{parseInlineFormatting(trimmed)}</p>;
      })}

      {/* Streaming blinking cursor */}
      {isStreaming && (
        <span className="inline-block w-2 h-4 ml-1 bg-[#FF7A00] animate-pulse align-middle" aria-hidden="true" />
      )}
    </div>
  );
}

// Parses inline bold, links, and code
function parseInlineFormatting(str: string): React.ReactNode[] {
  const regex = /(\[[^\]]+\]\([^)]+\)|\*\*[^*]+\*\*|`[^`]+`)/g;
  const parts = str.split(regex);

  return parts.map((part, i) => {
    if (part.startsWith("[") && part.includes("](") && part.endsWith(")")) {
      const match = part.match(/^\[([^\]]+)\]\(([^)]+)\)$/);
      if (match) {
        const label = match[1];
        const url = match[2];
        const isExternal = url.startsWith("http");
        return (
          <Link
            key={i}
            href={url}
            target={isExternal ? "_blank" : undefined}
            rel={isExternal ? "noopener noreferrer" : undefined}
            className="inline-flex items-center gap-0.5 text-[#FF7A00] font-semibold underline underline-offset-2 hover:text-[#FF8C1A] transition-colors"
          >
            <span>{label}</span>
            <ArrowUpRight className="w-3 h-3 inline text-[#FF7A00]" />
          </Link>
        );
      }
    }

    if (part.startsWith("**") && part.endsWith("**")) {
      return (
        <strong key={i} className="font-semibold text-[#F5F5F5]">
          {part.slice(2, -2)}
        </strong>
      );
    }

    if (part.startsWith("`") && part.endsWith("`")) {
      return (
        <code key={i} className="px-1.5 py-0.5 rounded bg-[#121212] border border-[#262626] font-mono text-xs text-[#FF7A00]">
          {part.slice(1, -1)}
        </code>
      );
    }

    return part;
  });
}

export default function AssistantModal() {
  const {
    isOpen,
    closeAssistant,
    messages,
    sendMessage,
    stopGeneration,
    retryLastMessage,
    clearChat,
    isStreaming,
    isLoading,
    isConfigured,
    lastErrorCode,
    errorMessage,
    hasActiveRequest
  } = useAssistant();

  const [input, setInput] = useState("");
  const messagesEndRef = useRef<HTMLDivElement>(null);
  const inputRef = useRef<HTMLInputElement>(null);
  const shouldReduceMotion = useReducedMotion();

  // Focus input on open
  useEffect(() => {
    if (isOpen) {
      const timer = setTimeout(() => {
        inputRef.current?.focus();
      }, 120);
      return () => clearTimeout(timer);
    }
  }, [isOpen]);

  // Auto-scroll as messages update or stream
  useEffect(() => {
    if (isOpen) {
      messagesEndRef.current?.scrollIntoView({ behavior: isStreaming ? "auto" : "smooth" });
    }
  }, [messages, isStreaming, isLoading, isOpen]);

  // Escape key closes modal
  useEffect(() => {
    const handleKeyDown = (e: KeyboardEvent) => {
      if (e.key === "Escape" && isOpen) {
        closeAssistant();
      }
    };
    window.addEventListener("keydown", handleKeyDown);
    return () => window.removeEventListener("keydown", handleKeyDown);
  }, [isOpen, closeAssistant]);

  // Lock body scroll when modal is open
  useEffect(() => {
    if (isOpen) {
      document.body.style.overflow = "hidden";
    } else {
      document.body.style.overflow = "";
    }
    return () => {
      document.body.style.overflow = "";
    };
  }, [isOpen]);

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!input.trim() || hasActiveRequest) return;
    sendMessage(input.trim());
    setInput("");
  };

  return (
    <AnimatePresence>
      {isOpen && (
        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          exit={{ opacity: 0 }}
          transition={{ duration: shouldReduceMotion ? 0.05 : 0.2 }}
          className="fixed inset-0 z-50 flex items-end sm:items-center justify-center p-0 sm:p-4 bg-black/80 backdrop-blur-sm"
          role="dialog"
          aria-modal="true"
          aria-labelledby="assistant-modal-title"
          onClick={closeAssistant}
        >
          <motion.div
            initial={{
              opacity: shouldReduceMotion ? 1 : 0,
              scale: shouldReduceMotion ? 1 : 0.96,
              y: shouldReduceMotion ? 0 : 20
            }}
            animate={{ opacity: 1, scale: 1, y: 0 }}
            exit={{
              opacity: shouldReduceMotion ? 1 : 0,
              scale: shouldReduceMotion ? 1 : 0.96,
              y: shouldReduceMotion ? 0 : 20
            }}
            transition={{
              duration: shouldReduceMotion ? 0.05 : 0.25,
              ease: [0.22, 1, 0.36, 1]
            }}
            className="relative w-full max-w-2xl h-[100dvh] sm:h-[660px] max-h-[100dvh] sm:max-h-[90vh] bg-[#0D0D0D] border border-[#262626] sm:rounded-2xl shadow-2xl flex flex-col overflow-hidden"
            onClick={(e) => e.stopPropagation()}
          >
            {/* Header */}
            <div className="flex items-center justify-between px-5 sm:px-6 py-4 border-b border-[#262626] bg-[#121212] shrink-0">
              <div className="flex items-center gap-3">
                <div className="w-9 h-9 rounded-full bg-[#151515] flex items-center justify-center text-[#FF7A00] border border-[#262626]">
                  <Sparkles className="w-4 h-4 text-[#FF7A00]" />
                </div>
                <div>
                  <div className="flex items-center gap-2">
                    <h2 id="assistant-modal-title" className="font-display text-base sm:text-lg text-[#F5F5F5] font-semibold">
                      Harish&apos;s AI Assistant
                    </h2>

                    {/* Badge: Live Stream only when configured; Unavailable otherwise */}
                    {isConfigured ? (
                      <span className="inline-flex items-center gap-1 text-[10px] font-sans font-medium px-2 py-0.5 rounded-full bg-[#FF7A00]/15 text-[#FF7A00] border border-[#FF7A00]/30">
                        <span className="w-1.5 h-1.5 rounded-full bg-[#FF7A00]" />
                        Live Stream
                      </span>
                    ) : (
                      <span className="inline-flex items-center gap-1 text-[10px] font-sans font-medium px-2 py-0.5 rounded-full bg-[#181818] text-[#818181] border border-[#262626]">
                        <span className="w-1.5 h-1.5 rounded-full bg-[#818181]" />
                        Unavailable
                      </span>
                    )}
                  </div>
                  <p className="text-[11px] text-[#818181] font-sans">
                    Strictly Grounded in Published Records · Real-time Answers
                  </p>
                </div>
              </div>

              <div className="flex items-center gap-1.5">
                <button
                  onClick={clearChat}
                  title="Clear conversation"
                  className="p-2 text-[#818181] hover:text-[#FF7A00] hover:bg-[#151515] transition-colors rounded-lg focus:outline-none focus-visible:ring-2 focus-visible:ring-[#FF7A00]"
                  aria-label="Clear chat"
                >
                  <Trash2 className="w-4 h-4" />
                </button>
                <button
                  onClick={closeAssistant}
                  className="p-2 text-[#818181] hover:text-[#F5F5F5] hover:bg-[#151515] transition-colors rounded-lg focus:outline-none focus-visible:ring-2 focus-visible:ring-[#FF7A00]"
                  aria-label="Close assistant dialog"
                >
                  <X className="w-5 h-5" />
                </button>
              </div>
            </div>

            {/* Message Feed */}
            <div className="flex-1 overflow-y-auto px-4 sm:px-6 py-5 space-y-4 font-sans overscroll-contain">
              {messages.map((msg) => {
                const isUser = msg.sender === "user";
                const isConfigError = msg.errorCode === "AI_NOT_CONFIGURED";

                return (
                  <div
                    key={msg.id}
                    className={`flex flex-col ${isUser ? "items-end" : "items-start"}`}
                  >
                    <div
                      className={`max-w-[90%] sm:max-w-[85%] rounded-2xl px-4 sm:px-5 py-3 text-sm leading-relaxed transition-all ${
                        isUser
                          ? "bg-[#FF7A00] text-[#080808] font-medium rounded-br-xs shadow-sm"
                          : msg.isError
                          ? "bg-[#151515] border border-[#262626] text-[#F5F5F5] rounded-bl-xs shadow-sm"
                          : "bg-[#151515] border border-[#262626] text-[#F5F5F5] rounded-bl-xs shadow-sm"
                      }`}
                    >
                      {msg.isError && (
                        <div className="flex items-center gap-1.5 text-xs font-semibold text-[#FF7A00] mb-1.5">
                          <AlertCircle className="w-3.5 h-3.5 text-[#FF7A00]" />
                          <span>Status Notification</span>
                        </div>
                      )}

                      {isUser ? (
                        <div className="whitespace-pre-wrap">{msg.text}</div>
                      ) : (
                        <FormattedMessage text={msg.text} isStreaming={msg.isStreaming} />
                      )}

                      {/* Navigation / Contact links */}
                      {msg.links && msg.links.length > 0 && !msg.isStreaming && (
                        <div className="mt-3 pt-2.5 border-t border-[#262626] flex flex-wrap gap-2">
                          {msg.links.map((link, idx) => (
                            <Link
                              key={idx}
                              href={link.url}
                              onClick={closeAssistant}
                              className="inline-flex items-center gap-1 text-xs text-[#FF7A00] font-medium bg-[#121212] hover:bg-[#181818] border border-[#262626] px-2.5 py-1 rounded-md transition-colors"
                            >
                              <span>{link.label}</span>
                              <ArrowUpRight className="w-3 h-3 text-[#FF7A00]" />
                            </Link>
                          ))}
                        </div>
                      )}

                      {/* Retry only for non-config errors */}
                      {msg.isError && !isConfigError && (
                        <div className="mt-3 pt-2 border-t border-[#262626] flex items-center gap-2">
                          <button
                            onClick={retryLastMessage}
                            className="inline-flex items-center gap-1.5 text-xs font-medium text-[#080808] bg-[#FF7A00] hover:bg-[#FF8C1A] px-3 py-1 rounded-lg transition-colors cursor-pointer"
                          >
                            <RotateCcw className="w-3 h-3" />
                            <span>Retry Question</span>
                          </button>
                        </div>
                      )}
                    </div>

                    <span className="text-[10px] text-[#818181] mt-1 px-1">
                      {msg.timestamp}
                    </span>
                  </div>
                );
              })}

              {/* Loading indicator before stream starts */}
              {isLoading && !isStreaming && (
                <div className="flex items-start gap-2">
                  <div className="bg-[#151515] border border-[#262626] px-4 py-2.5 rounded-2xl rounded-bl-xs text-xs text-[#818181] flex items-center gap-2 shadow-sm">
                    <Sparkles className="w-3.5 h-3.5 text-[#FF7A00] animate-spin" />
                    <span>Consulting published records...</span>
                  </div>
                </div>
              )}

              <div ref={messagesEndRef} />
            </div>

            {/* Action Controls Bar */}
            <div className="px-4 py-1.5 bg-[#121212] border-t border-[#262626] flex items-center justify-between text-xs text-[#818181]">
              <div className="flex items-center gap-2">
                {isStreaming && (
                  <button
                    type="button"
                    onClick={stopGeneration}
                    className="inline-flex items-center gap-1.5 px-3 py-1 rounded-lg bg-[#151515] border border-[#262626] text-[#FF7A00] hover:bg-[#181818] font-medium transition-colors shadow-2xs cursor-pointer"
                  >
                    <Square className="w-3 h-3 fill-current text-[#FF7A00]" />
                    <span>Stop generation</span>
                  </button>
                )}

                {/* Show Retry only when failure is NOT missing configuration */}
                {errorMessage && !hasActiveRequest && lastErrorCode !== "AI_NOT_CONFIGURED" && (
                  <button
                    type="button"
                    onClick={retryLastMessage}
                    className="inline-flex items-center gap-1.5 px-3 py-1 rounded-lg bg-[#151515] border border-[#262626] text-[#FF7A00] hover:bg-[#181818] font-medium transition-colors shadow-2xs cursor-pointer"
                  >
                    <RotateCcw className="w-3 h-3" />
                    <span>Retry query</span>
                  </button>
                )}

                {/* Direct contact option when unconfigured */}
                {lastErrorCode === "AI_NOT_CONFIGURED" && (
                  <Link
                    href="/#contact"
                    onClick={closeAssistant}
                    className="inline-flex items-center gap-1 px-3 py-1 rounded-lg bg-[#151515] border border-[#262626] text-[#FF7A00] hover:bg-[#181818] font-medium transition-colors shadow-2xs text-xs"
                  >
                    <Mail className="w-3 h-3 text-[#FF7A00]" />
                    <span>Contact Harish Directly</span>
                  </Link>
                )}
              </div>

              <div className="text-[10px] text-[#818181] hidden sm:block">
                Session memory preserved
              </div>
            </div>

            {/* Input Bar */}
            <form
              onSubmit={handleSubmit}
              className="p-3 sm:p-4 bg-[#121212] border-t border-[#262626] pb-[max(0.75rem,env(safe-area-inset-bottom))] shrink-0"
            >
              <div className="flex items-center gap-2 relative">
                <input
                  ref={inputRef}
                  type="text"
                  value={input}
                  onChange={(e) => setInput(e.target.value)}
                  placeholder="Ask about Harish's education, skills, hackathon, focus areas..."
                  disabled={hasActiveRequest}
                  className="w-full bg-[#151515] border border-[#262626] focus:border-[#FF7A00] focus:ring-1 focus:ring-[#FF7A00] text-sm text-[#F5F5F5] placeholder-[#818181] rounded-xl px-4 py-3 pr-12 transition-all outline-none"
                />
                <button
                  type="submit"
                  disabled={!input.trim() || hasActiveRequest}
                  className="absolute right-2 p-2 rounded-lg bg-[#FF7A00] text-[#080808] hover:bg-[#FF8C1A] disabled:opacity-40 disabled:cursor-not-allowed transition-all focus:outline-none cursor-pointer"
                  aria-label="Send query"
                >
                  <Send className="w-4 h-4" />
                </button>
              </div>
              <div className="mt-2 text-[10px] text-[#818181] text-center font-sans">
                Grounded strictly on published portfolio records. Not Harish personally.
              </div>
            </form>
          </motion.div>
        </motion.div>
      )}
    </AnimatePresence>
  );
}
