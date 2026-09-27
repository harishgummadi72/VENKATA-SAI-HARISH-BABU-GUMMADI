"use client";

import React, { useState } from "react";
import { Mail, ArrowUpRight, Copy, Check, Phone, MapPin } from "lucide-react";
import { motion, useReducedMotion } from "framer-motion";
import { PortfolioProfile } from "@/types/portfolio";
import { FOCUS_RING, FloatingCard } from "@/lib/motion";

interface ContactSectionProps {
  profile: PortfolioProfile;
}

export default function ContactSection({ profile }: ContactSectionProps) {
  const [copied, setCopied] = useState(false);
  const shouldReduceMotion = useReducedMotion();

  const handleCopyEmail = (e: React.MouseEvent) => {
    e.preventDefault();
    if (navigator.clipboard) {
      navigator.clipboard.writeText(profile.contact.email);
      setCopied(true);
      setTimeout(() => setCopied(false), 2500);
    }
  };

  return (
    <section
      id="contact"
      className="relative w-full py-20 px-6 lg:px-16 bg-[#0D0D0D] border-b border-[#262626] scroll-mt-20"
    >
      <div className="max-w-[1600px] mx-auto">
        {/* Section Header */}
        <motion.div
          initial={{ opacity: shouldReduceMotion ? 1 : 0, y: shouldReduceMotion ? 0 : 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true, margin: "-80px" }}
          transition={{ duration: 0.5, ease: [0.22, 1, 0.36, 1] }}
          className="flex flex-col lg:flex-row lg:items-end justify-between pb-10 mb-12 border-b border-[#262626] gap-6"
        >
          <div>
            <div className="flex items-center gap-3 mb-3">
              <span className="text-[11px] font-sans tracking-[0.24em] uppercase font-medium text-[#FF7A00]">
                INITIATE DIALOGUE
              </span>
              <span className="w-8 h-[1px] bg-[#FF7A00]" aria-hidden="true" />
            </div>
            <h2 className="font-display text-4xl sm:text-5xl font-normal leading-[1.05] text-[#F5F5F5]">
              Let&apos;s Connect &amp; Collaborate.
            </h2>
          </div>
          <span className="font-display text-4xl sm:text-5xl text-[#FF7A00]/25 leading-none select-none">
            06
          </span>
        </motion.div>

        {/* Section Body */}
        <div className="space-y-10">
          {/* Context & Engagement Status */}
          <div className="flex flex-col lg:flex-row lg:items-center justify-between gap-6">
            <div className="max-w-2xl">
              <h3 className="font-display text-2xl text-[#F5F5F5] mb-2">
                Direct Communication
              </h3>
              <p className="text-sm text-[#B7B7B7] font-editorial leading-relaxed">
                Whether discussing software development, technical collaborations, hackathons, or academic inquiries, reach out directly through any of the verified channels below.
              </p>
            </div>

            {/* Availability Status Badge */}
            <div className="p-4 bg-[#151515] rounded-xl border border-[#262626] flex items-center gap-3 shadow-xs shrink-0 self-start lg:self-auto">
              <div className="w-2.5 h-2.5 rounded-full bg-emerald-500 shrink-0 animate-pulse" />
              <div>
                <span className="text-[11px] uppercase tracking-wider font-semibold text-[#FF7A00] font-sans block">
                  Engagement Status
                </span>
                <p className="text-xs text-[#F5F5F5] font-sans mt-0.5 leading-relaxed">
                  {profile.contact.availabilityStatus || "Open to software projects & hackathon collaboration"}
                </p>
              </div>
            </div>
          </div>

          {/* Verified Channels Grid: 4 Cards */}
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6 font-sans">
            {/* Email Card with Copy Action */}
            <FloatingCard index={0} distance={4}>
              <div className="relative group flex flex-col justify-between h-full p-6 bg-[#151515] rounded-xl border border-[#262626] hover:border-[#FF7A00]/50 hover:shadow-[0_12px_36px_rgba(255,122,0,0.1)] hover:-translate-y-1 active:translate-y-0 active:scale-[0.99] transition-all duration-200">
                <a
                  href={`mailto:${profile.contact.email}`}
                  className={`absolute inset-0 rounded-xl ${FOCUS_RING}`}
                  aria-label={`Send email to ${profile.contact.email}`}
                />
                <div className="flex items-center justify-between gap-4 mb-4 relative z-10">
                  <div className="w-10 h-10 rounded-lg bg-[#121212] border border-[#262626] flex items-center justify-center text-[#FF7A00] group-hover:border-[#FF7A00]/50 transition-colors">
                    <Mail className="w-5 h-5" />
                  </div>
                  <div className="flex items-center gap-2">
                    <button
                      type="button"
                      onClick={handleCopyEmail}
                      title="Copy email address"
                      className="p-1.5 text-[#818181] hover:text-[#FF7A00] hover:bg-[#121212] rounded-md transition-colors relative z-20 cursor-pointer"
                      aria-label="Copy email address"
                    >
                      {copied ? <Check className="w-4 h-4 text-emerald-500" /> : <Copy className="w-4 h-4" />}
                    </button>
                    <ArrowUpRight className="w-5 h-5 text-[#818181] group-hover:text-[#FF7A00] group-hover:translate-x-0.5 group-hover:-translate-y-0.5 transition-all" />
                  </div>
                </div>
                <div className="relative z-10">
                  <div className="flex items-center justify-between">
                    <span className="text-[11px] uppercase tracking-wider font-semibold text-[#FF7A00] block mb-1">
                      Email
                    </span>
                    {copied && (
                      <span className="text-[10px] text-emerald-500 font-medium">Copied!</span>
                    )}
                  </div>
                  <span className="text-sm font-medium text-[#F5F5F5] break-all group-hover:text-[#FF7A00] transition-colors">
                    {profile.contact.email}
                  </span>
                </div>
              </div>
            </FloatingCard>

            {/* Phone Card */}
            <FloatingCard index={1} distance={4}>
              <a
                href="tel:+918919580966"
                className={`flex flex-col justify-between h-full p-6 bg-[#151515] rounded-xl border border-[#262626] hover:border-[#FF7A00]/50 hover:shadow-[0_12px_36px_rgba(255,122,0,0.1)] hover:-translate-y-1 active:translate-y-0 active:scale-[0.99] transition-all duration-200 group min-w-0 ${FOCUS_RING}`}
              >
                <div className="flex items-center justify-between gap-4 mb-4">
                  <div className="w-10 h-10 rounded-lg bg-[#121212] border border-[#262626] flex items-center justify-center text-[#FF7A00] group-hover:border-[#FF7A00]/50 transition-colors">
                    <Phone className="w-5 h-5" />
                  </div>
                  <ArrowUpRight className="w-5 h-5 text-[#818181] group-hover:text-[#FF7A00] group-hover:translate-x-0.5 group-hover:-translate-y-0.5 transition-all" />
                </div>
                <div>
                  <span className="text-[11px] uppercase tracking-wider font-semibold text-[#FF7A00] block mb-1">
                    Phone
                  </span>
                  <span className="text-sm font-medium text-[#F5F5F5] break-all group-hover:text-[#FF7A00] transition-colors">
                    +91 8919580966
                  </span>
                </div>
              </a>
            </FloatingCard>

            {/* LinkedIn Card */}
            <FloatingCard index={2} distance={4}>
              <a
                href="https://www.linkedin.com/in/harish-gummadi-18a3153a7/"
                target="_blank"
                rel="noopener noreferrer"
                className={`flex flex-col justify-between h-full p-6 bg-[#151515] rounded-xl border border-[#262626] hover:border-[#FF7A00]/50 hover:shadow-[0_12px_36px_rgba(255,122,0,0.1)] hover:-translate-y-1 active:translate-y-0 active:scale-[0.99] transition-all duration-200 group min-w-0 ${FOCUS_RING}`}
              >
                <div className="flex items-center justify-between gap-4 mb-4">
                  <div className="w-10 h-10 rounded-lg bg-[#121212] border border-[#262626] flex items-center justify-center text-[#FF7A00] group-hover:border-[#FF7A00]/50 transition-colors">
                    <svg className="w-5 h-5 fill-current" viewBox="0 0 24 24" aria-hidden="true">
                      <path d="M19 0h-14c-2.761 0-5 2.239-5 5v14c0 2.761 2.239 5 5 5h14c2.762 0 5-2.239 5-5v-14c0-2.761-2.238-5-5-5zm-11 19h-3v-11h3v11zm-1.5-12.268c-.966 0-1.75-.79-1.75-1.764s.784-1.764 1.75-1.764 1.75.79 1.75 1.764-.783 1.764-1.75 1.764zm13.5 12.268h-3v-5.604c0-3.368-4-3.113-4 0v5.604h-3v-11h3v1.765c1.396-2.586 7-2.777 7 2.476v6.759z"/>
                    </svg>
                  </div>
                  <ArrowUpRight className="w-5 h-5 text-[#818181] group-hover:text-[#FF7A00] group-hover:translate-x-0.5 group-hover:-translate-y-0.5 transition-all" />
                </div>
                <div>
                  <span className="text-[11px] uppercase tracking-wider font-semibold text-[#FF7A00] block mb-1">
                    LinkedIn
                  </span>
                  <span className="text-sm font-medium text-[#F5F5F5] break-all group-hover:text-[#FF7A00] transition-colors">
                    linkedin.com/in/harish-gummadi
                  </span>
                </div>
              </a>
            </FloatingCard>

            {/* GitHub Card */}
            <FloatingCard index={3} distance={4}>
              <a
                href={profile.contact.github}
                target="_blank"
                rel="noopener noreferrer"
                className={`flex flex-col justify-between h-full p-6 bg-[#151515] rounded-xl border border-[#262626] hover:border-[#FF7A00]/50 hover:shadow-[0_12px_36px_rgba(255,122,0,0.1)] hover:-translate-y-1 active:translate-y-0 active:scale-[0.99] transition-all duration-200 group min-w-0 ${FOCUS_RING}`}
              >
                <div className="flex items-center justify-between gap-4 mb-4">
                  <div className="w-10 h-10 rounded-lg bg-[#121212] border border-[#262626] flex items-center justify-center text-[#FF7A00] group-hover:border-[#FF7A00]/50 transition-colors">
                    <svg className="w-5 h-5 fill-current" viewBox="0 0 24 24" aria-hidden="true">
                      <path d="M12 0C5.37 0 0 5.37 0 12c0 5.31 3.435 9.795 8.205 11.385.6.105.825-.255.825-.57 0-.285-.015-1.23-.015-2.235-3.015.555-3.795-.735-4.035-1.41-.135-.345-.72-1.41-1.23-1.695-.42-.225-1.02-.78-.015-.795.945-.015 1.62.87 1.845 1.23 1.08 1.815 2.805 1.305 3.495.99.105-.78.42-1.305.765-1.605-2.67-.3-5.46-1.335-5.46-5.925 0-1.305.465-2.385 1.23-3.225-.12-.3-.54-1.53.12-3.18 0 0 1.005-.315 3.3 1.23.96-.27 1.98-.405 3-.405s2.04.135 3 .405c2.295-1.56 3.3-1.23 3.3-1.23.66 1.65.24 2.88.12 3.18.765.84 1.23 1.905 1.23 3.225 0 4.605-2.805 5.625-5.475 5.925.435.375.81 1.095.81 2.22 0 1.605-.015 2.895-.015 3.3 0 .315.225.69.825.57A12.02 12.02 0 0024 12c0-6.63-5.37-12-12-12z" />
                    </svg>
                  </div>
                  <ArrowUpRight className="w-5 h-5 text-[#818181] group-hover:text-[#FF7A00] group-hover:translate-x-0.5 group-hover:-translate-y-0.5 transition-all" />
                </div>
                <div>
                  <span className="text-[11px] uppercase tracking-wider font-semibold text-[#FF7A00] block mb-1">
                    GitHub
                  </span>
                  <span className="text-sm font-medium text-[#F5F5F5] break-all group-hover:text-[#FF7A00] transition-colors">
                    github.com/harishgummadi72
                  </span>
                </div>
              </a>
            </FloatingCard>
          </div>

          {/* Location Line */}
          <div className="flex items-center justify-center gap-2 text-xs font-sans text-[#818181] pt-2">
            <MapPin className="w-4 h-4 text-[#FF7A00]" />
            <span>Based in {profile.location || "Guntur, Andhra Pradesh, India"}</span>
          </div>
        </div>
      </div>
    </section>
  );
}
