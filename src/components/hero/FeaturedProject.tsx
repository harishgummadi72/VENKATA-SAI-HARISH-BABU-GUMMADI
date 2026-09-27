"use client";

import React from "react";
import Link from "next/link";
import Image from "next/image";
import { ArrowRight, BookOpen, GraduationCap, FileText, Bell } from "lucide-react";
import ArchitecturalArtwork from "./ArchitecturalArtwork";

export default function FeaturedProject() {
  return (
    <div className="relative flex flex-col justify-between py-8 px-6 lg:px-10 h-full border-t lg:border-t-0 lg:border-l border-[#262626] overflow-hidden">
      {/* Background Architectural Linework */}
      <div className="absolute top-0 right-0 left-0 h-[280px] pointer-events-none opacity-60 z-0">
        <ArchitecturalArtwork />
      </div>

      {/* Top Section: Watermark & Project Header */}
      <div className="relative z-10">
        {/* Upper Right Vertical Spaced Keywords */}
        <div className="flex justify-end pb-3">
          <div className="text-[10px] tracking-[0.3em] text-[#FF9D33]/80 uppercase font-sans font-medium space-x-3 sm:space-x-4">
            <span>SYSTEMS</span>
            <span>·</span>
            <span>PEOPLE</span>
            <span>·</span>
            <span>IDEAS</span>
            <span>·</span>
            <span>IMPACT</span>
          </div>
        </div>

        {/* Featured Project Eyebrow & Title Bar */}
        <div className="pt-2">
          <div className="flex items-center gap-2 mb-2">
            <span className="text-[11px] font-sans tracking-[0.22em] uppercase font-medium text-[#FF9D33]">
              FEATURED PROJECT
            </span>
            <span className="w-8 h-[1px] bg-[#FF9D33]" aria-hidden="true" />
          </div>

          <div className="flex items-baseline justify-between">
            <div>
              <h2 className="font-display text-3xl sm:text-[38px] font-normal leading-tight text-[#F5F5F5]">
                Projects in Progress
              </h2>
              <p className="text-xs tracking-[0.18em] uppercase text-[#B7B7B7] font-sans mt-0.5">
                Software Development · Practical Projects
              </p>
            </div>
            <a
              href="https://github.com/harishgummadi72"
              target="_blank"
              rel="noopener noreferrer"
              className="group inline-flex items-center gap-1.5 text-sm font-sans font-medium text-[#FF7A00] hover:text-[#F5F5F5] transition-colors"
            >
              <span>Explore GitHub</span>
              <ArrowRight className="w-4 h-4 transition-transform group-hover:translate-x-0.5" />
            </a>
          </div>
        </div>
      </div>

      {/* Center: Large Project-Preview Frame */}
      <div className="relative z-10 my-6">
        <Link
          href="/#projects"
          className="group block relative rounded-xl sm:rounded-2xl border border-[#262626] bg-[#151515] shadow-[0_16px_40px_-12px_rgba(89,11,32,0.08)] overflow-hidden transition-all duration-300 hover:shadow-[0_20px_48px_-10px_rgba(89,11,32,0.12)] hover:border-[#FF9D33]"
        >
          {/* Academic Portal Interface Mockup Header */}
          <div className="px-4 py-2.5 bg-[#121212] border-b border-[#262626] flex items-center justify-between text-[11px] font-sans">
            <div className="flex items-center gap-2">
              <span className="font-serif font-bold text-[#FF7A00] text-sm tracking-wider">NEC</span>
              <span className="hidden sm:inline-block text-[10px] text-[#B7B7B7] border-l border-[#262626] pl-2">
                Autonomous
              </span>
            </div>
            <div className="hidden sm:flex items-center gap-4 text-[#F5F5F5]/80 text-[11px]">
              <span className="font-semibold text-[#FF7A00] border-b border-[#FF7A00]">Home</span>
              <span>Academics</span>
              <span>Examinations</span>
              <span>Student Life</span>
              <span>Notices</span>
            </div>
            <div className="flex items-center gap-2">
              <div className="text-[10px] font-medium bg-[#FF7A00] text-white px-2.5 py-1 rounded">
                Student Login
              </div>
            </div>
          </div>

          {/* Hero Banner Section with Authentic Building Photo */}
          <div className="relative h-44 sm:h-52 bg-gradient-to-r from-[#F5F5F5]/90 via-[#F5F5F5]/75 to-transparent flex items-center overflow-hidden">
            {/* Concept Badge positioned cleanly inside the banner */}
            <div className="absolute top-2.5 right-3 z-20 bg-[#080808]/90 border border-[#262626] backdrop-blur-sm text-[9px] tracking-wider uppercase px-2 py-0.5 rounded text-[#FF7A00] font-sans font-medium shadow-xs">
              Interface Concept
            </div>
            {/* Real College Building Photo */}
            <Image
              src="/assets/images/nec-college-building.jpg"
              alt="Narasaraopeta Engineering College campus building"
              fill
              className="object-cover object-center mix-blend-overlay opacity-50 group-hover:scale-105 transition-transform duration-700"
              sizes="(max-width: 768px) 100vw, 600px"
              priority
            />

            {/* Banner Text Overlay matching the reference */}
            <div className="relative z-10 p-5 sm:p-6 text-white max-w-sm">
              <h3 className="font-display text-lg sm:text-xl font-medium leading-tight mb-1 text-white">
                Empowering Brighter Futures
              </h3>
              <p className="text-[10px] sm:text-xs text-[#262626] font-sans mb-2">
                Narasaraopeta Engineering College
              </p>
              <p className="text-[10px] sm:text-[11px] text-white/80 font-sans leading-relaxed line-clamp-2 mb-3">
                Education today for a better tomorrow. A platform for students, faculty and a stronger academic community.
              </p>
              <div className="flex items-center gap-2">
                <span className="text-[10px] font-medium bg-[#FF7A00] text-white px-3 py-1 rounded">
                  Explore Resources
                </span>
                <span className="text-[10px] font-medium bg-[#151515]/20 text-white border border-white/30 px-3 py-1 rounded">
                  View Notices
                </span>
              </div>
            </div>
          </div>

          {/* 4 Quick Access Cards Grid below banner */}
          <div className="p-3 sm:p-4 bg-[#FCFAF6] grid grid-cols-2 sm:grid-cols-4 gap-2 border-t border-[#262626]">
            <div className="p-2 bg-[#151515] rounded border border-[#262626] flex flex-col">
              <div className="flex items-center gap-1.5 text-[#FF7A00] mb-0.5">
                <FileText className="w-3.5 h-3.5 text-[#FF9D33]" />
                <span className="font-medium text-[11px] text-[#F5F5F5]">Examinations</span>
              </div>
              <span className="text-[9px] text-[#B7B7B7]">Results &amp; Schedules</span>
            </div>

            <div className="p-2 bg-[#151515] rounded border border-[#262626] flex flex-col">
              <div className="flex items-center gap-1.5 text-[#FF7A00] mb-0.5">
                <BookOpen className="w-3.5 h-3.5 text-[#FF9D33]" />
                <span className="font-medium text-[11px] text-[#F5F5F5]">Academics</span>
              </div>
              <span className="text-[9px] text-[#B7B7B7]">Courses &amp; Syllabus</span>
            </div>

            <div className="p-2 bg-[#151515] rounded border border-[#262626] flex flex-col">
              <div className="flex items-center gap-1.5 text-[#FF7A00] mb-0.5">
                <GraduationCap className="w-3.5 h-3.5 text-[#FF9D33]" />
                <span className="font-medium text-[11px] text-[#F5F5F5]">Student Services</span>
              </div>
              <span className="text-[9px] text-[#B7B7B7]">Forms &amp; Requests</span>
            </div>

            <div className="p-2 bg-[#151515] rounded border border-[#262626] flex flex-col">
              <div className="flex items-center gap-1.5 text-[#FF7A00] mb-0.5">
                <Bell className="w-3.5 h-3.5 text-[#FF9D33]" />
                <span className="font-medium text-[11px] text-[#F5F5F5]">Notices</span>
              </div>
              <span className="text-[9px] text-[#B7B7B7]">Latest Updates</span>
            </div>
          </div>
        </Link>
      </div>

      {/* Bottom Section: Caption, Metadata, and Tilted Cursive Signature */}
      <div className="relative z-10 pt-2">
        <div className="flex items-start justify-between gap-4">
          <div className="flex items-start gap-3 max-w-md">
            <span className="w-6 h-[1px] bg-[#FF9D33] mt-2.5 shrink-0" aria-hidden="true" />
            <p className="text-xs sm:text-[13px] text-[#B7B7B7] font-editorial leading-relaxed">
              A streamlined academic portal designed for Narasaraopeta Engineering College, focused on clarity, accessibility, and a better student experience.
            </p>
          </div>
          <div className="text-right shrink-0">
            <span className="text-[11px] tracking-wider uppercase text-[#B7B7B7] font-sans">
              Frontend · UI/UX
            </span>
          </div>
        </div>

        {/* Tilted Cursive Script Signature Watermark */}
        <div className="flex justify-end mt-2 pr-2">
          <div className="font-script text-2xl sm:text-[26px] text-[#C5A880]/90 select-none transform -rotate-6 leading-[1.08] tracking-wide text-right">
            <div>Better Interfaces</div>
            <div>Brighter People</div>
          </div>
        </div>
      </div>
    </div>
  );
}
