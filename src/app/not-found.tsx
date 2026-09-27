import React from "react";
import Link from "next/link";
import { Home, Compass } from "lucide-react";
import Monogram from "@/components/ui/Monogram";

export default function NotFound() {
  return (
    <div className="min-h-screen bg-[#080808] flex flex-col items-center justify-center p-6 text-center selection:bg-[#FF7A00] selection:text-black">
      <div className="max-w-md w-full bg-[#151515] rounded-2xl border border-[#262626] p-10 shadow-[0_16px_40px_rgba(0,0,0,0.6)]">
        <div className="flex justify-center mb-6">
          <Monogram className="w-12 h-14" />
        </div>

        <span className="text-[11px] font-sans tracking-[0.24em] uppercase font-semibold text-[#FF7A00] block mb-2">
          ERROR 404 · RECORD NOT LOCATED
        </span>

        <h1 className="font-display text-4xl text-[#F5F5F5] font-normal mb-3">
          Page Beyond Archive
        </h1>

        <p className="text-sm text-[#B7B7B7] font-editorial leading-relaxed mb-8">
          The requested route or case study does not exist within Harish&apos;s published portfolio catalog.
        </p>

        <div className="flex flex-col sm:flex-row items-center justify-center gap-3">
          <Link
            href="/"
            className="w-full sm:w-auto inline-flex items-center justify-center gap-2 px-5 py-2.5 rounded-lg bg-[#FF7A00] text-black text-xs font-sans font-medium hover:bg-[#FF8C1A] transition-colors"
          >
            <Home className="w-3.5 h-3.5" />
            <span>Return to Portfolio</span>
          </Link>

          <Link
            href="/projects"
            className="w-full sm:w-auto inline-flex items-center justify-center gap-2 px-5 py-2.5 rounded-lg border border-[#262626] text-[#F5F5F5] text-xs font-sans font-medium hover:border-[#FF7A00]/50 transition-colors"
          >
            <Compass className="w-3.5 h-3.5" />
            <span>View All Projects</span>
          </Link>
        </div>
      </div>
    </div>
  );
}
