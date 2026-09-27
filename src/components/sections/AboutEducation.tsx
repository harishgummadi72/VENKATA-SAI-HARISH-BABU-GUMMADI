"use client";

import React from "react";
import { GraduationCap, ShieldCheck, Code, Sparkles, Languages, Cpu, Users } from "lucide-react";
import { PortfolioProfile } from "@/types/portfolio";
import { FloatingCard } from "@/lib/motion";

interface AboutEducationProps {
  profile: PortfolioProfile;
}

export default function AboutEducation({ profile }: AboutEducationProps) {
  return (
    <section id="about" className="relative w-full py-20 px-6 lg:px-16 bg-[#0D0D0D] border-b border-[#262626] scroll-mt-20">
      <div className="max-w-[1600px] mx-auto">
        {/* Section Header */}
        <div className="flex flex-col lg:flex-row lg:items-end justify-between pb-10 mb-12 border-b border-[#262626] gap-6">
          <div>
            <div className="flex items-center gap-3 mb-3">
              <span className="text-[11px] font-sans tracking-[0.24em] uppercase font-medium text-[#FF7A00]">
                BACKGROUND &amp; FOUNDATIONS
              </span>
              <span className="w-8 h-[1px] bg-[#FF7A00]" aria-hidden="true" />
            </div>
            <h2 className="font-display text-4xl sm:text-5xl font-normal leading-[1.05] text-[#F5F5F5]">
              Where Engineering Rigor Meets Practical Development.
            </h2>
          </div>
          <span className="font-display text-4xl sm:text-5xl text-[#FF7A00]/25 leading-none select-none">
            02
          </span>
        </div>

        {/* 2-Column Split: Editorial Biography + Academic Enrolment Card */}
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-12 items-start">
          {/* Left Column: Narrative Story, Focus Areas, Soft Skills & Languages */}
          <div className="lg:col-span-7 space-y-6 font-editorial text-lg text-[#B7B7B7] leading-relaxed">
            {profile.aboutBio.map((paragraph, idx) => (
              <p key={idx} className="first-of-type:text-xl first-of-type:text-[#F5F5F5]">
                {paragraph}
              </p>
            ))}

            {/* Areas of Interest Grid */}
            <div className="pt-6 grid grid-cols-1 sm:grid-cols-2 gap-4 not-italic font-sans">
              <div className="p-4 bg-[#151515] rounded-xl border border-[#262626] flex items-start gap-3">
                <Code className="w-5 h-5 text-[#FF7A00] shrink-0 mt-0.5" />
                <div>
                  <h4 className="text-sm font-semibold text-[#F5F5F5]">Full Stack Web Development</h4>
                  <p className="text-xs text-[#818181] mt-1 leading-normal">
                    Building responsive web applications using HTML, JavaScript, FastAPI, and Supabase database services.
                  </p>
                </div>
              </div>

              <div className="p-4 bg-[#151515] rounded-xl border border-[#262626] flex items-start gap-3">
                <Cpu className="w-5 h-5 text-[#FF7A00] shrink-0 mt-0.5" />
                <div>
                  <h4 className="text-sm font-semibold text-[#F5F5F5]">Artificial Intelligence &amp; GenAI</h4>
                  <p className="text-xs text-[#818181] mt-1 leading-normal">
                    Integrating LLMs, prompt engineering, and local AI runtimes into real-world software workflows.
                  </p>
                </div>
              </div>

              <div className="p-4 bg-[#151515] rounded-xl border border-[#262626] flex items-start gap-3">
                <ShieldCheck className="w-5 h-5 text-[#FF7A00] shrink-0 mt-0.5" />
                <div>
                  <h4 className="text-sm font-semibold text-[#F5F5F5]">Cybersecurity &amp; Software</h4>
                  <p className="text-xs text-[#818181] mt-1 leading-normal">
                    Grounding software engineering with defensive design principles, secure coding, and system awareness.
                  </p>
                </div>
              </div>

              {/* Soft Skills */}
              <div className="p-4 bg-[#151515] rounded-xl border border-[#262626] flex items-start gap-3">
                <Users className="w-5 h-5 text-[#FF7A00] shrink-0 mt-0.5" />
                <div>
                  <h4 className="text-sm font-semibold text-[#F5F5F5]">Soft Skills &amp; Collaboration</h4>
                  <p className="text-xs text-[#818181] mt-1 leading-normal">
                    Problem Solving · Teamwork · Communication · Quick Learning · Adaptability · Technical Learning
                  </p>
                </div>
              </div>

              {/* Languages Known */}
              <div className="sm:col-span-2 p-4 bg-[#151515] rounded-xl border border-[#262626] flex items-center justify-between gap-4">
                <div className="flex items-center gap-3">
                  <Languages className="w-5 h-5 text-[#FF7A00] shrink-0" />
                  <div>
                    <h4 className="text-sm font-semibold text-[#F5F5F5]">Languages Known</h4>
                    <p className="text-xs text-[#818181] mt-0.5">
                      Multilingual communication for collaborative engineering environments.
                    </p>
                  </div>
                </div>
                <div className="flex items-center gap-2">
                  <span className="px-3 py-1 rounded-full text-xs font-medium bg-[#121212] text-[#FF7A00] border border-[#262626]">
                    English
                  </span>
                  <span className="px-3 py-1 rounded-full text-xs font-medium bg-[#121212] text-[#FF7A00] border border-[#262626]">
                    Telugu
                  </span>
                </div>
              </div>
            </div>
          </div>

          {/* Right Column: Formal Enrolled Academic Record with Floating Animation */}
          <div className="lg:col-span-5">
            <FloatingCard index={1} distance={5}>
              <div className="bg-[#151515] rounded-2xl border border-[#262626] p-8 shadow-[0_12px_36px_rgba(0,0,0,0.6)] hover:border-[#FF7A00]/40 transition-colors">
                <div className="flex items-center justify-between mb-6">
                  <div className="flex items-center gap-2.5 text-[#FF7A00] text-xs font-sans font-semibold uppercase tracking-wider">
                    <GraduationCap className="w-5 h-5 text-[#FF7A00]" />
                    <span>Undergraduate Degree</span>
                  </div>
                  <span className="px-2.5 py-0.5 rounded-full text-[10px] font-sans font-medium bg-[#121212] text-[#FF9D33] border border-[#262626]">
                    Ongoing
                  </span>
                </div>

                <div className="space-y-5">
                  <div>
                    <span className="text-[11px] uppercase tracking-wider font-sans text-[#818181]">Degree &amp; Branch</span>
                    <h3 className="font-display text-2xl text-[#F5F5F5] font-medium mt-0.5">
                      B.Tech in Computer Science and Engineering
                    </h3>
                  </div>

                  <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 pt-2 border-t border-[#262626]">
                    <div>
                      <span className="text-[11px] uppercase tracking-wider font-sans text-[#818181]">Enrolled College</span>
                      <p className="text-sm font-medium text-[#F5F5F5] mt-0.5">
                        Narasaraopeta Engineering College
                      </p>
                    </div>

                    <div>
                      <span className="text-[11px] uppercase tracking-wider font-sans text-[#818181]">Affiliating University</span>
                      <p className="text-sm font-medium text-[#F5F5F5] mt-0.5">
                        JNTUK
                      </p>
                    </div>
                  </div>

                  <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 pt-2 border-t border-[#262626]">
                    <div>
                      <span className="text-[11px] uppercase tracking-wider font-sans text-[#818181]">Study Timeline</span>
                      <p className="text-sm font-semibold text-[#FF7A00] mt-0.5">
                        2025–2029
                      </p>
                    </div>

                    <div>
                      <span className="text-[11px] uppercase tracking-wider font-sans text-[#818181]">Academic Performance</span>
                      <p className="text-sm font-semibold text-[#FF7A00] mt-0.5">
                        CGPA 8.46
                      </p>
                    </div>
                  </div>

                  {/* Institutional disclaimer */}
                  <div className="mt-6 pt-4 border-t border-[#262626] text-[11px] text-[#818181] leading-relaxed font-sans bg-[#121212] p-3.5 rounded-lg border border-[#262626]">
                    <div className="flex items-center gap-1.5 text-[#FF7A00] font-medium mb-1">
                      <Sparkles className="w-3 h-3" />
                      <span>Enrolment Record</span>
                    </div>
                    {profile.education.disclaimer}
                  </div>
                </div>
              </div>
            </FloatingCard>
          </div>
        </div>
      </div>
    </section>
  );
}
