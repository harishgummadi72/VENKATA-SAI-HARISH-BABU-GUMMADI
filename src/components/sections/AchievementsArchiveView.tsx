"use client";

import React, { useState, useMemo, useEffect } from "react";
import { 
  Trophy, 
  Building2, 
  Calendar, 
  ShieldCheck, 
  X, 
  ExternalLink
} from "lucide-react";
import { motion, AnimatePresence, useReducedMotion } from "framer-motion";
import { Achievement, Credential } from "@/types/portfolio";
import { DisplayRecord } from "./AchievementsSection";

interface AchievementsArchiveViewProps {
  achievements: Achievement[];
  credentials: Credential[];
}

export default function AchievementsArchiveView({
  achievements,
  credentials
}: AchievementsArchiveViewProps) {
  const [previewRecord, setPreviewRecord] = useState<DisplayRecord | null>(null);
  const shouldReduceMotion = useReducedMotion();

  // Normalize records
  const allRecords: DisplayRecord[] = useMemo(() => {
    const list: DisplayRecord[] = [];

    achievements.forEach((ach) => {
      list.push({
        id: ach.id,
        kind: "achievement",
        filterCategory: "achievements",
        categoryBadge: "HACKATHON PARTICIPATION",
        title: ach.title,
        issuer: ach.organizer,
        type: ach.type,
        year: ach.year || "",
        date: ach.year || "",
        result: ach.result,
        teamOrIndividual: ach.teamOrIndividual,
        summary: ach.description,
        verificationUrl: ach.evidenceUrl,
        order: ach.order
      });
    });

    credentials.forEach((cred) => {
      list.push({
        id: cred.id,
        kind: "credential",
        filterCategory: "certificates",
        categoryBadge: "CERTIFICATE",
        title: cred.title,
        issuer: cred.issuer,
        type: cred.type,
        date: cred.date,
        summary: cred.summary || "Structured technical curriculum record.",
        credentialId: cred.credentialId,
        verificationUrl: cred.verificationUrl,
        linkedInPostUrl: cred.linkedInPostUrl,
        certificateImage: cred.certificateImage,
        featured: cred.featured,
        order: 10 + cred.order
      });
    });

    return list.sort((a, b) => a.order - b.order);
  }, [achievements, credentials]);

  // Modal accessibility
  useEffect(() => {
    const handleKeyDown = (e: KeyboardEvent) => {
      if (e.key === "Escape") setPreviewRecord(null);
    };
    if (previewRecord) {
      document.body.style.overflow = "hidden";
      window.addEventListener("keydown", handleKeyDown);
    } else {
      document.body.style.overflow = "unset";
    }
    return () => {
      document.body.style.overflow = "unset";
      window.removeEventListener("keydown", handleKeyDown);
    };
  }, [previewRecord]);

  return (
    <div className="w-full">
      {/* Records Table View */}
      <div className="bg-[#151515] rounded-2xl border border-[#262626] shadow-xl overflow-hidden">
        <div className="divide-y divide-[#262626]">
          {allRecords.map((record, index) => (
            <motion.div
              key={record.id}
              initial={{ opacity: shouldReduceMotion ? 1 : 0, y: shouldReduceMotion ? 0 : 15 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.3, delay: shouldReduceMotion ? 0 : index * 0.04 }}
              className="p-6 sm:p-8 hover:bg-[#121212] transition-colors group"
            >
              <div className="grid grid-cols-1 lg:grid-cols-12 gap-6 items-start">
                {/* Left: Index & Meta */}
                <div className="lg:col-span-3 flex lg:flex-col items-baseline lg:items-start justify-between lg:justify-start gap-2">
                  <span className="font-mono text-xs font-semibold text-[#FF7A00]">
                    {String(index + 1).padStart(2, "0")}
                  </span>
                  
                  {record.date ? (
                    <div className="font-mono text-xs sm:text-sm font-medium text-[#F5F5F5] flex items-center gap-1.5 mt-1">
                      <Calendar className="w-3.5 h-3.5 text-[#FF7A00]" />
                      <span>{record.date}</span>
                    </div>
                  ) : (
                    <div className="text-[11px] font-sans text-[#818181] font-medium mt-1">
                      Academic Sprint
                    </div>
                  )}

                  <span className="text-[10px] tracking-[0.14em] uppercase font-sans font-semibold text-[#FF7A00] mt-1 bg-[#121212] px-2.5 py-0.5 rounded border border-[#262626]">
                    {record.categoryBadge}
                  </span>
                </div>

                {/* Middle: Title, Result, Summary */}
                <div className="lg:col-span-6 space-y-2">
                  <div className="flex flex-wrap items-center gap-2">
                    <h3 className="font-display text-xl sm:text-2xl text-[#F5F5F5] group-hover:text-[#FF7A00] transition-colors font-medium tracking-tight">
                      {record.title}
                    </h3>
                    {record.result && (
                      <span className="text-xs font-sans font-semibold px-2.5 py-0.5 rounded-full bg-[#121212] text-[#FF9D33] border border-[#262626]">
                        {record.result}
                      </span>
                    )}
                  </div>

                  <div className="text-xs text-[#818181] font-sans flex items-center gap-1.5">
                    <Building2 className="w-3.5 h-3.5 text-[#FF7A00] shrink-0" />
                    <span className="font-medium text-[#F5F5F5]">{record.issuer}</span>
                    <span className="text-[#262626]">·</span>
                    <span className="text-[#FF7A00]">{record.type}</span>
                  </div>

                  <p className="text-sm text-[#B7B7B7] font-editorial leading-relaxed max-w-2xl pt-1">
                    {record.summary}
                  </p>
                </div>

                {/* Right: Verified Badge & Actions */}
                <div className="lg:col-span-3 flex flex-col lg:items-end justify-between gap-3 pt-2 lg:pt-0">
                  <div className="inline-flex items-center gap-1 text-[11px] font-sans font-semibold tracking-wider text-[#FF7A00] uppercase">
                    <ShieldCheck className="w-3.5 h-3.5 text-[#FF7A00]" />
                    <span>VERIFIED RECORD</span>
                  </div>

                  <button
                    type="button"
                    onClick={() => setPreviewRecord(record)}
                    className="inline-flex items-center gap-1.5 text-xs font-sans font-medium text-[#FF7A00] hover:text-[#FF8C1A] transition-colors cursor-pointer py-1.5 px-3 rounded-lg border border-[#262626] hover:border-[#FF7A00] bg-[#121212]"
                  >
                    <span>View Record Details</span>
                    <ExternalLink className="w-3 h-3" />
                  </button>
                </div>
              </div>
            </motion.div>
          ))}
        </div>
      </div>

      {/* Modal */}
      <AnimatePresence>
        {previewRecord && (
          <div 
            className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/80 backdrop-blur-xs"
            onClick={() => setPreviewRecord(null)}
            role="dialog"
            aria-modal="true"
            aria-labelledby="modal-archive-title"
          >
            <motion.div
              initial={{ opacity: 0, scale: 0.96, y: 10 }}
              animate={{ opacity: 1, scale: 1, y: 0 }}
              exit={{ opacity: 0, scale: 0.96, y: 10 }}
              transition={{ duration: 0.2, ease: "easeOut" }}
              className="bg-[#151515] border border-[#262626] rounded-2xl max-w-lg w-full p-6 sm:p-8 shadow-2xl relative"
              onClick={(e) => e.stopPropagation()}
            >
              <div className="flex items-start justify-between gap-4 mb-4">
                <div className="inline-flex items-center gap-1.5 px-2.5 py-1 rounded-full bg-[#121212] text-[#FF7A00] text-[10px] font-mono uppercase tracking-wider font-semibold border border-[#262626]">
                  <Trophy className="w-3 h-3" />
                  <span>{previewRecord.categoryBadge}</span>
                </div>
                <button
                  type="button"
                  onClick={() => setPreviewRecord(null)}
                  className="p-1 rounded-lg text-[#818181] hover:text-[#F5F5F5] hover:bg-[#262626] transition-colors cursor-pointer"
                  aria-label="Close dialog"
                >
                  <X className="w-5 h-5" />
                </button>
              </div>

              <h3 id="modal-archive-title" className="font-display text-2xl text-[#F5F5F5] font-medium mb-2">
                {previewRecord.title}
              </h3>

              <div className="flex items-center gap-2 text-xs font-sans text-[#818181] mb-5">
                <span className="font-semibold text-[#F5F5F5]">{previewRecord.issuer}</span>
                {previewRecord.date && (
                  <>
                    <span>·</span>
                    <span>{previewRecord.date}</span>
                  </>
                )}
              </div>

              <div className="p-4 bg-[#121212] rounded-xl border border-[#262626] mb-5">
                <div className="text-[10px] font-sans font-semibold text-[#FF7A00] uppercase tracking-wider mb-1">
                  Participation Summary
                </div>
                <p className="text-xs text-[#B7B7B7] font-sans leading-relaxed">
                  {previewRecord.summary}
                </p>
              </div>

              <div className="flex items-center justify-between text-xs font-sans pt-2 border-t border-[#262626]">
                <span className="text-[#818181]">Classification: {previewRecord.type}</span>
                <button
                  type="button"
                  onClick={() => setPreviewRecord(null)}
                  className="px-4 py-2 rounded-lg bg-[#FF7A00] text-[#080808] text-xs font-semibold hover:bg-[#FF8C1A] transition-colors cursor-pointer"
                >
                  Close
                </button>
              </div>
            </motion.div>
          </div>
        )}
      </AnimatePresence>
    </div>
  );
}
