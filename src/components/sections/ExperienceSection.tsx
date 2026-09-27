"use client";

import React from "react";
import { Calendar, School, CheckCircle2 } from "lucide-react";
import { motion, useReducedMotion } from "framer-motion";
import { Experience } from "@/types/portfolio";
import { FloatingCard } from "@/lib/motion";

interface ExperienceSectionProps {
  experience?: Experience[];
}

export default function ExperienceSection({}: ExperienceSectionProps = {}) {
  const shouldReduceMotion = useReducedMotion();

  const educationMilestones = [
    {
      id: "edu-btech",
      period: "2025 – 2029",
      degree: "B.Tech in Computer Science and Engineering",
      institution: "Narasaraopeta Engineering College",
      board: "Affiliated to JNTUK (Jawaharlal Nehru Technological University Kakinada)",
      score: "CGPA: 8.46",
      status: "Ongoing",
      badgeColor: "bg-[#121212] text-[#FF9D33] border-[#262626]",
      description:
        "Pursuing undergraduate degree in Computer Science and Engineering with a focus on core programming, data structures, full-stack web development, and cybersecurity fundamentals.",
      highlights: [
        "Enrolled in 4-Year Undergraduate Technical Programme",
        "Building foundations in C, Java, Python, and Web Technologies",
        "Active participation in technical hackathons and problem-solving"
      ]
    },
    {
      id: "edu-inter",
      period: "Completed 2025",
      degree: "Intermediate (12th Standard)",
      institution: "Narayana",
      board: "State Board (Andhra Pradesh)",
      score: "Percentage: 91.3%",
      status: "Completed",
      badgeColor: "bg-[#121212] text-[#B7B7B7] border-[#262626]",
      description:
        "Completed intermediate education specializing in Mathematics, Physics, and Chemistry (MPC) with distinction, demonstrating strong quantitative and analytical foundations.",
      highlights: [
        "Stream: MPC (Mathematics, Physics, Chemistry)",
        "Graduated with 91.3% Academic Performance",
        "Strong foundation in calculus, physics, and analytical logic"
      ]
    },
    {
      id: "edu-ssc",
      period: "Completed 2023",
      degree: "Secondary School Certificate (SSC / 10th)",
      institution: "Kennedy English Medium High School",
      board: "State Board",
      score: "Percentage: 87%",
      status: "Completed",
      badgeColor: "bg-[#121212] text-[#B7B7B7] border-[#262626]",
      description:
        "Completed secondary school education with strong academic performance across mathematics, sciences, and languages.",
      highlights: [
        "English Medium Curriculum",
        "Graduated with 87% Academic Score",
        "Consistent academic discipline and extracurricular participation"
      ]
    }
  ];

  return (
    <section id="education" className="relative w-full py-20 px-6 lg:px-16 bg-[#080808] border-b border-[#262626] scroll-mt-20">
      <div className="max-w-[1600px] mx-auto">
        {/* Section Header */}
        <div className="flex flex-col lg:flex-row lg:items-end justify-between pb-10 mb-12 border-b border-[#262626] gap-6">
          <div>
            <div className="flex items-center gap-3 mb-3">
              <span className="text-[11px] font-sans tracking-[0.24em] uppercase font-medium text-[#FF7A00]">
                ACADEMIC JOURNEY
              </span>
              <span className="w-8 h-[1px] bg-[#FF7A00]" aria-hidden="true" />
            </div>
            <h2 className="font-display text-4xl sm:text-5xl font-normal leading-[1.05] text-[#F5F5F5]">
              Education &amp; Academic Milestones.
            </h2>
          </div>
          <span className="font-display text-4xl sm:text-5xl text-[#FF7A00]/25 leading-none select-none">
            03
          </span>
        </div>

        {/* Education Timeline Grid with FloatingCard Wrappers */}
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
          {educationMilestones.map((edu, idx) => (
            <FloatingCard key={edu.id} index={idx} distance={5}>
              <motion.div
                initial={{ opacity: shouldReduceMotion ? 1 : 0, y: shouldReduceMotion ? 0 : 20 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true, margin: "-60px" }}
                transition={{
                  duration: 0.5,
                  delay: shouldReduceMotion ? 0 : idx * 0.1,
                  ease: [0.22, 1, 0.36, 1]
                }}
                className="flex flex-col justify-between h-full rounded-2xl border border-[#262626] bg-[#151515] p-7 lg:p-8 shadow-[0_8px_32px_rgba(0,0,0,0.7)] hover:shadow-[0_16px_48px_rgba(255,122,0,0.12)] hover:border-[#FF7A00]/50 transition-all duration-300"
              >
                <div>
                  {/* Top Badge & Year */}
                  <div className="flex items-center justify-between gap-3 pb-4 mb-5 border-b border-[#262626]">
                    <div className="flex items-center gap-2 text-xs font-sans text-[#FF7A00] font-medium">
                      <Calendar className="w-3.5 h-3.5" />
                      <span>{edu.period}</span>
                    </div>
                    <span className={`text-[10px] uppercase tracking-wider font-semibold px-2.5 py-0.5 rounded-full border ${edu.badgeColor}`}>
                      {edu.status}
                    </span>
                  </div>

                  {/* Degree Title */}
                  <h3 className="font-display text-2xl text-[#F5F5F5] font-medium mb-3 leading-snug">
                    {edu.degree}
                  </h3>

                  {/* Institution Details */}
                  <div className="space-y-1.5 mb-5 font-sans">
                    <div className="flex items-start gap-2 text-sm font-semibold text-[#F5F5F5]">
                      <School className="w-4 h-4 text-[#FF7A00] shrink-0 mt-0.5" />
                      <span>{edu.institution}</span>
                    </div>
                    <p className="text-xs text-[#818181] pl-6 leading-relaxed">
                      {edu.board}
                    </p>
                  </div>

                  {/* Description */}
                  <p className="text-xs sm:text-sm text-[#B7B7B7] font-editorial leading-relaxed mb-6">
                    {edu.description}
                  </p>

                  {/* Highlights List */}
                  <div className="space-y-2 pt-4 border-t border-[#262626]">
                    {edu.highlights.map((h, i) => (
                      <div key={i} className="flex items-start gap-2 text-xs text-[#B7B7B7] font-sans">
                        <CheckCircle2 className="w-3.5 h-3.5 text-[#FF7A00] shrink-0 mt-0.5" />
                        <span>{h}</span>
                      </div>
                    ))}
                  </div>
                </div>

                {/* Bottom Score Footer */}
                <div className="mt-6 pt-4 border-t border-[#262626] flex items-center justify-between">
                  <span className="text-[11px] uppercase tracking-wider font-sans text-[#818181]">
                    Academic Score
                  </span>
                  <span className="text-sm font-bold text-[#FF7A00] font-sans">
                    {edu.score}
                  </span>
                </div>
              </motion.div>
            </FloatingCard>
          ))}
        </div>
      </div>
    </section>
  );
}
