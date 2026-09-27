"use client";

import React, { useState } from "react";
import Link from "next/link";
import { motion, AnimatePresence } from "framer-motion";
import { 
  ArrowUpRight, 
  ExternalLink, 
  Plus, 
  Minus
} from "lucide-react";
import { Skill } from "@/types/portfolio";
import { INITIAL_SKILLS } from "@/lib/initial-data";
import { COMPETENCY_CATEGORIES, CompetencySkill } from "@/lib/competencies-data";

interface SkillsGridProps {
  skills?: Skill[];
}

const ALL_COMPETENCY_SKILLS: Record<string, CompetencySkill> = {};
for (const cat of COMPETENCY_CATEGORIES) {
  for (const s of cat.skills) {
    ALL_COMPETENCY_SKILLS[s.name.toLowerCase().trim()] = s;
  }
}

const STANDARD_CATEGORIES: { name: string; tagline: string }[] = [
  {
    name: "Programming Foundations",
    tagline: "Core syntax, procedural logic, object-oriented concepts, and algorithmic problem solving."
  },
  {
    name: "Development",
    tagline: "Web markup, semantic document structure, and backend database workflows."
  }
];

interface EnrichedSkill {
  id: string;
  name: string;
  classification: string;
  shortUsage: string;
  appliedIn: string;
  practicalUsage: string;
  relatedTechnologies: string[];
  areasOfImplementation: string[];
  projectEvidence?: Array<{
    name: string;
    description: string;
    links?: Array<{ label: string; url: string; isExternal?: boolean }>;
  }>;
}

interface DynamicCategory {
  id: string;
  number: string;
  name: string;
  tagline: string;
  skills: EnrichedSkill[];
}

export default function SkillsGrid({ skills }: SkillsGridProps) {
  const effectiveSkills = skills && skills.length > 0 ? skills : INITIAL_SKILLS;

  const uniqueCategories = Array.from(
    new Set([
      ...STANDARD_CATEGORIES.map((c) => c.name),
      ...effectiveSkills.map((s) => s.category)
    ])
  ).filter((catName) => effectiveSkills.some((s) => s.category === catName));

  const categories: DynamicCategory[] = uniqueCategories.map((catName, index) => {
    const meta = STANDARD_CATEGORIES.find((c) => c.name === catName);
    const catSkills = effectiveSkills.filter((s) => s.category === catName);

    const enrichedSkills: EnrichedSkill[] = catSkills.map((s) => {
      const normalizedName = s.name.toLowerCase().trim();
      const match =
        ALL_COMPETENCY_SKILLS[normalizedName] ||
        Object.values(ALL_COMPETENCY_SKILLS).find(
          (cs) =>
            cs.name.toLowerCase().includes(normalizedName) ||
            normalizedName.includes(cs.name.toLowerCase())
        );

      const classification = s.proficiency || match?.classification || "Core";
      const appliedInText =
        s.relatedProjectSlugs && s.relatedProjectSlugs.length > 0
          ? `Applied in: ${s.relatedProjectSlugs.join(", ")}`
          : match?.appliedIn || "Applied in engineering coursework & practical development";

      const projectEvidence =
        s.relatedProjectSlugs && s.relatedProjectSlugs.length > 0
          ? s.relatedProjectSlugs.map((slug) => ({
              name: slug.toUpperCase(),
              description: `Applied in ${slug} architecture and production workflow.`,
              links: [{ label: "View Case Study", url: `/projects/${slug}` }]
            }))
          : match?.projectEvidence;

      return {
        id: s.id,
        name: s.name,
        classification,
        shortUsage:
          match?.shortUsage ||
          `Proficiency: ${s.proficiency}. Actively developed and applied in practical technical systems.`,
        appliedIn: appliedInText,
        practicalUsage:
          match?.practicalUsage ||
          `Hands-on proficiency in ${s.name} applied across portfolio implementations and design systems.`,
        relatedTechnologies: match?.relatedTechnologies || [s.category],
        areasOfImplementation: match?.areasOfImplementation || [s.category, `${s.proficiency} Proficiency`],
        projectEvidence
      };
    });

    return {
      id: catName.toLowerCase().replace(/[^a-z0-9]+/g, "-"),
      number: String(index + 1).padStart(2, "0"),
      name: catName,
      tagline: meta?.tagline || `Competencies and practical engineering execution in ${catName}.`,
      skills: enrichedSkills
    };
  });

  const [activeCategoryId, setActiveCategoryId] = useState<string>(
    categories[0]?.id || "development"
  );
  const [expandedSkillId, setExpandedSkillId] = useState<string | null>(null);

  const activeCategory =
    categories.find((cat) => cat.id === activeCategoryId) ||
    categories[0] || {
      id: "empty",
      number: "01",
      name: "Skills",
      tagline: "Technical competencies",
      skills: []
    };

  const handleCategoryChange = (categoryId: string) => {
    setActiveCategoryId(categoryId);
    setExpandedSkillId(null);
  };

  const toggleSkill = (skillId: string) => {
    setExpandedSkillId((prev) => (prev === skillId ? null : skillId));
  };

  return (
    <section
      id="skills"
      className="relative w-full py-20 px-6 lg:px-16 bg-[#0D0D0D] border-b border-[#262626] scroll-mt-20"
    >
      <div className="max-w-[1600px] mx-auto">
        {/* Section Header */}
        <div className="flex flex-col lg:flex-row lg:items-end justify-between pb-10 mb-12 border-b border-[#262626] gap-6">
          <div>
            <div className="flex items-center gap-3 mb-3">
              <span className="text-[11px] font-sans tracking-[0.24em] uppercase font-medium text-[#FF7A00]">
                TECHNICAL COMPETENCIES
              </span>
              <span className="w-8 h-[1px] bg-[#FF7A00]" aria-hidden="true" />
            </div>
            <h2 className="font-display text-4xl sm:text-5xl font-normal leading-[1.05] text-[#F5F5F5]">
              Core Technical Skills &amp; Foundations.
            </h2>
          </div>
          <span className="font-display text-4xl sm:text-5xl text-[#FF7A00]/25 leading-none select-none">
            04
          </span>
        </div>

        {/* Mobile & Tablet Category Tabs (Horizontally scrollable) */}
        <div className="lg:hidden mb-8">
          <div className="text-[10px] font-sans tracking-[0.2em] uppercase font-semibold text-[#FF7A00] mb-3">
            Select Discipline
          </div>
          <div
            role="tablist"
            aria-orientation="horizontal"
            className="flex items-center gap-2.5 overflow-x-auto pb-3 -mx-2 px-2 scrollbar-none snap-x snap-mandatory"
          >
            {categories.map((cat) => {
              const isActive = activeCategoryId === cat.id;
              return (
                <button
                  key={cat.id}
                  role="tab"
                  id={`mobile-tab-${cat.id}`}
                  aria-selected={isActive}
                  aria-controls={`competency-panel-${cat.id}`}
                  onClick={() => handleCategoryChange(cat.id)}
                  className={`shrink-0 min-h-[44px] px-4 py-2 rounded-full text-xs font-sans transition-all flex items-center gap-2 snap-start cursor-pointer focus-visible:ring-2 focus-visible:ring-[#FF7A00] focus-visible:outline-none ${
                    isActive
                      ? "bg-[#FF7A00] text-[#080808] font-bold shadow-sm border border-[#FF7A00]"
                      : "bg-[#151515] text-[#B7B7B7] hover:text-[#F5F5F5] border border-[#262626]"
                  }`}
                >
                  <span
                    className={`font-mono text-[11px] ${
                      isActive ? "text-[#080808]" : "text-[#FF7A00]"
                    }`}
                  >
                    {cat.number}
                  </span>
                  <span>{cat.name}</span>
                </button>
              );
            })}
          </div>
        </div>

        {/* Editorial Competency Layout: 30/70 Two-Column Desktop Split */}
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-10 lg:gap-14 items-start">
          {/* Left Column: Sticky Category Navigator (Desktop) */}
          <aside className="hidden lg:block lg:col-span-4 xl:col-span-3">
            <div className="sticky top-28 space-y-2 pr-6 border-r border-[#262626]">
              <div className="text-[10px] font-sans tracking-[0.24em] uppercase font-semibold text-[#FF7A00] mb-4">
                Disciplines Index
              </div>
              <nav
                role="tablist"
                aria-orientation="vertical"
                className="space-y-1.5"
              >
                {categories.map((cat) => {
                  const isActive = activeCategoryId === cat.id;
                  return (
                    <button
                      key={cat.id}
                      role="tab"
                      id={`tab-${cat.id}`}
                      aria-selected={isActive}
                      aria-controls={`competency-panel-${cat.id}`}
                      onClick={() => handleCategoryChange(cat.id)}
                      className={`w-full text-left py-3 px-3.5 rounded-lg transition-all relative flex items-center justify-between group cursor-pointer focus-visible:ring-2 focus-visible:ring-[#FF7A00] focus-visible:outline-none ${
                        isActive
                          ? "text-[#FF7A00] font-semibold bg-[#FF7A00]/10 border border-[#FF7A00]/25"
                          : "text-[#B7B7B7] hover:text-[#F5F5F5] hover:bg-[#151515] font-normal"
                      }`}
                    >
                      <div className="flex items-center gap-3">
                        <span
                          className={`text-xs font-mono transition-colors ${
                            isActive ? "text-[#FF7A00] font-bold" : "text-[#FF7A00]/70"
                          }`}
                        >
                          {cat.number}
                        </span>
                        <span className="text-sm font-sans tracking-tight">
                          — {cat.name}
                        </span>
                      </div>

                      {isActive && (
                        <motion.span
                          layoutId="active-category-indicator"
                          className="w-1 h-5 bg-[#FF7A00] rounded-full shrink-0 shadow-[0_0_8px_rgba(255,122,0,0.6)]"
                          aria-hidden="true"
                          transition={{ type: "spring", stiffness: 350, damping: 30 }}
                        />
                      )}
                    </button>
                  );
                })}
              </nav>

              {/* Minimal Note */}
              <div className="pt-8 mt-8 border-t border-[#262626] pr-2">
                <p className="text-[11px] font-sans text-[#818181] leading-relaxed">
                  Competencies are cataloged with verified application contexts from academic coursework, programming practice, and software exploration.
                </p>
              </div>
            </div>
          </aside>

          {/* Right Column: Full-Width Editorial Competency Rows */}
          <main className="lg:col-span-8 xl:col-span-9">
            <AnimatePresence mode="wait">
              <motion.div
                key={activeCategory.id}
                id={`competency-panel-${activeCategory.id}`}
                role="tabpanel"
                aria-labelledby={`tab-${activeCategory.id}`}
                initial={{ opacity: 0, y: 10 }}
                animate={{ opacity: 1, y: 0 }}
                exit={{ opacity: 0, y: -10 }}
                transition={{ duration: 0.22, ease: "easeInOut" }}
                className="space-y-0"
              >
                {/* Discipline Header Banner */}
                <div className="pb-6 mb-2 border-b border-[#262626] flex flex-col sm:flex-row sm:items-baseline justify-between gap-2">
                  <div>
                    <span className="text-xs font-mono text-[#FF7A00] font-semibold tracking-wider">
                      DISCIPLINE {activeCategory.number}
                    </span>
                    <h3 className="font-display text-2xl sm:text-3xl text-[#F5F5F5] font-medium mt-1">
                      {activeCategory.name}
                    </h3>
                  </div>
                  <p className="text-xs text-[#818181] font-sans italic sm:text-right">
                    {activeCategory.tagline}
                  </p>
                </div>

                {/* Editorial Competency Rows (Separated by thin horizontal line, not cards) */}
                <div className="divide-y divide-[#262626]">
                  {activeCategory.skills.map((skill) => {
                    const isExpanded = expandedSkillId === skill.id;

                    return (
                      <div
                        key={skill.id}
                        className="py-6 transition-colors group"
                      >
                        {/* Interactive Row Header */}
                        <button
                          type="button"
                          onClick={() => toggleSkill(skill.id)}
                          aria-expanded={isExpanded}
                          aria-controls={`skill-details-${skill.id}`}
                          className="w-full text-left flex items-start justify-between gap-4 cursor-pointer focus-visible:ring-2 focus-visible:ring-[#FF7A00] focus-visible:outline-none rounded-lg p-1.5 -m-1.5 transition-all"
                        >
                          <div className="space-y-2 pr-2">
                            <div className="flex flex-wrap items-center gap-2.5">
                              <h4 className="font-display text-xl sm:text-2xl text-[#F5F5F5] group-hover:text-[#FF7A00] transition-colors font-medium">
                                {skill.name}
                              </h4>
                              <span className="text-[10px] uppercase font-sans tracking-wider font-semibold text-[#FF7A00] bg-[#FF7A00]/10 border border-[#FF7A00]/25 px-2 py-0.5 rounded-full">
                                {skill.classification}
                              </span>
                            </div>

                            <p className="text-sm text-[#B7B7B7] font-editorial leading-relaxed max-w-3xl">
                              {skill.shortUsage}
                            </p>

                            <p className="text-xs text-[#FF7A00] font-sans font-medium flex items-center gap-1.5">
                              <span className="w-1.5 h-1.5 rounded-full bg-[#FF7A00]" aria-hidden="true" />
                              <span>{skill.appliedIn}</span>
                            </p>
                          </div>

                          {/* Minimal Expand/Collapse Icon */}
                          <div
                            className={`w-8 h-8 rounded-full border border-[#262626] flex items-center justify-center shrink-0 transition-all mt-0.5 ${
                              isExpanded
                                ? "border-[#FF7A00] bg-[#FF7A00] text-[#080808] shadow-xs"
                                : "text-[#FF7A00] group-hover:border-[#FF7A00] group-hover:text-[#FF8C1A] bg-[#151515]"
                            }`}
                            aria-hidden="true"
                          >
                            {isExpanded ? (
                              <Minus className="w-3.5 h-3.5" />
                            ) : (
                              <Plus className="w-3.5 h-3.5" />
                            )}
                          </div>
                        </button>

                        {/* Smooth Expandable Editorial Details */}
                        <AnimatePresence initial={false}>
                          {isExpanded && (
                            <motion.div
                              id={`skill-details-${skill.id}`}
                              initial={{ opacity: 0, height: 0 }}
                              animate={{ opacity: 1, height: "auto" }}
                              exit={{ opacity: 0, height: 0 }}
                              transition={{ duration: 0.28, ease: "easeInOut" }}
                              className="overflow-hidden"
                            >
                              <div className="pt-6 pb-2 pl-0 sm:pl-3 space-y-5 text-sm border-t border-[#262626] mt-4">
                                {/* Detailed Practical Usage */}
                                <div>
                                  <div className="text-[11px] uppercase tracking-wider font-sans font-semibold text-[#FF7A00] mb-1.5">
                                    Practical Usage &amp; Engineering Role
                                  </div>
                                  <p className="text-sm text-[#F5F5F5] font-sans leading-relaxed">
                                    {skill.practicalUsage}
                                  </p>
                                </div>

                                {/* Areas of Implementation */}
                                <div>
                                  <div className="text-[11px] uppercase tracking-wider font-sans font-semibold text-[#FF7A00] mb-2">
                                    Areas of Implementation
                                  </div>
                                  <div className="flex flex-wrap gap-2">
                                    {skill.areasOfImplementation.map((area, i) => (
                                      <span
                                        key={i}
                                        className="text-xs text-[#F5F5F5] bg-[#151515] border border-[#262626] px-3 py-1 rounded-md font-sans shadow-xs"
                                      >
                                        {area}
                                      </span>
                                    ))}
                                  </div>
                                </div>

                                {/* Related Tools & Technologies */}
                                <div>
                                  <div className="text-[11px] uppercase tracking-wider font-sans font-semibold text-[#FF7A00] mb-1.5">
                                    Related Tools &amp; Technologies
                                  </div>
                                  <div className="flex flex-wrap gap-1.5 text-xs text-[#818181] font-mono">
                                    {skill.relatedTechnologies.map((tech, i) => (
                                      <span
                                        key={i}
                                        className="after:content-[','] last:after:content-none pr-1"
                                      >
                                        {tech}
                                      </span>
                                    ))}
                                  </div>
                                </div>

                                {/* Genuine Project Evidence & References */}
                                {skill.projectEvidence && skill.projectEvidence.length > 0 && (
                                  <div className="pt-3 border-t border-[#262626]">
                                    <div className="text-[11px] uppercase tracking-wider font-sans font-semibold text-[#FF7A00] mb-3">
                                      Project Evidence &amp; References
                                    </div>
                                    <div className="space-y-2.5">
                                      {skill.projectEvidence.map((ev, i) => (
                                        <div
                                          key={i}
                                          className="bg-[#151515] p-4 rounded-xl border border-[#262626] flex flex-col sm:flex-row sm:items-center justify-between gap-3 shadow-xs"
                                        >
                                          <div>
                                            <div className="font-sans font-semibold text-[#F5F5F5] text-xs">
                                              {ev.name}
                                            </div>
                                            <p className="text-xs text-[#818181] font-sans mt-0.5">
                                              {ev.description}
                                            </p>
                                          </div>
                                          {ev.links && ev.links.length > 0 && (
                                            <div className="flex flex-wrap items-center gap-3 shrink-0">
                                              {ev.links.map((link, lIdx) => (
                                                <Link
                                                  key={lIdx}
                                                  href={link.url}
                                                  target={link.isExternal ? "_blank" : undefined}
                                                  rel={link.isExternal ? "noopener noreferrer" : undefined}
                                                  className="inline-flex items-center gap-1 text-xs text-[#FF7A00] hover:text-[#FF8C1A] font-medium font-sans underline underline-offset-4 decoration-[#FF7A00]/40 hover:decoration-[#FF7A00] transition-colors"
                                                >
                                                  <span>{link.label}</span>
                                                  {link.isExternal ? (
                                                    <ExternalLink className="w-3 h-3" />
                                                  ) : (
                                                    <ArrowUpRight className="w-3 h-3" />
                                                  )}
                                                </Link>
                                              ))}
                                            </div>
                                          )}
                                        </div>
                                      ))}
                                    </div>
                                  </div>
                                )}
                              </div>
                            </motion.div>
                          )}
                        </AnimatePresence>
                      </div>
                    );
                  })}
                </div>
              </motion.div>
            </AnimatePresence>
          </main>
        </div>
      </div>
    </section>
  );
}

