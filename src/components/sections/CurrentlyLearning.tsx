"use client";

import React from "react";
import { Sparkles, Calendar, BookOpen } from "lucide-react";
import { CurrentlyLearningItem } from "@/types/portfolio";
import { FloatingCard } from "@/lib/motion";

interface CurrentlyLearningProps {
  items: CurrentlyLearningItem[];
}

export default function CurrentlyLearning({ items }: CurrentlyLearningProps) {
  if (!items || items.length === 0) {
    return null;
  }

  return (
    <section className="relative w-full py-16 px-6 lg:px-16 bg-[#080808] border-b border-[#262626]">
      <div className="max-w-[1600px] mx-auto">
        <div className="flex flex-col sm:flex-row sm:items-center justify-between pb-8 mb-8 border-b border-[#262626] gap-4">
          <div>
            <div className="flex items-center gap-2 mb-1.5">
              <Sparkles className="w-3.5 h-3.5 text-[#FF7A00]" />
              <span className="text-[11px] font-sans tracking-[0.24em] uppercase font-medium text-[#FF7A00]">
                ACTIVE CURRICULUM
              </span>
            </div>
            <h3 className="font-display text-3xl font-normal text-[#F5F5F5]">
              Currently Learning
            </h3>
          </div>
          <div className="text-xs font-sans text-[#818181] tracking-wide">
            Live technical exploration log
          </div>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
          {items.map((item, idx) => (
            <FloatingCard key={item.id} index={idx} distance={4}>
              <div
                className="p-6 bg-[#151515] rounded-xl border border-[#262626] shadow-xs flex flex-col justify-between hover:border-[#FF7A00]/40 transition-colors h-full"
              >
                <div>
                  <div className="flex items-center justify-between gap-2 mb-3">
                    <span className="text-[10px] tracking-wider uppercase font-semibold text-[#FF7A00] font-sans">
                      {item.area}
                    </span>
                    <div className="flex items-center gap-1 text-[11px] text-[#818181] font-sans">
                      <Calendar className="w-3 h-3 text-[#FF9D33]" />
                      <span>{item.dated}</span>
                    </div>
                  </div>

                  <h4 className="font-display text-xl text-[#F5F5F5] font-normal mb-2">
                    {item.topic}
                  </h4>

                  <p className="text-xs text-[#B7B7B7] font-editorial leading-relaxed">
                    {item.notes}
                  </p>
                </div>

                <div className="mt-4 pt-3 border-t border-[#262626] flex items-center gap-2 text-[11px] text-[#FF7A00] font-sans">
                  <BookOpen className="w-3.5 h-3.5" />
                  <span>Under active study</span>
                </div>
              </div>
            </FloatingCard>
          ))}
        </div>
      </div>
    </section>
  );
}
