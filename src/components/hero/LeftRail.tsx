"use client";

import React, { useState } from "react";
import Link from "next/link";
import Monogram from "../ui/Monogram";
import { Menu, X } from "lucide-react";

interface LeftRailProps {
  activeSection?: string;
}

export default function LeftRail({ activeSection = "index" }: LeftRailProps) {
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);

  const navItems = [
    { label: "Home", href: "/#top", id: "top" },
    { label: "About", href: "/#about", id: "about" },
    { label: "Education", href: "/#education", id: "education" },
    { label: "Skills", href: "/#skills", id: "skills" },
    { label: "Projects", href: "/#projects", id: "projects" },
    { label: "Achievements", href: "/#achievements", id: "achievements" },
    { label: "Contact", href: "/#contact", id: "contact" }
  ];

  return (
    <>
      {/* Mobile Top Navigation Bar (replaces desktop rail on small screens) */}
      <div className="lg:hidden flex items-center justify-between px-6 py-4 border-b border-[#262626] bg-[#080808]/95 backdrop-blur-sm sticky top-0 z-40">
        <Link href="/" className="flex items-center gap-3">
          <Monogram className="w-8 h-9" />
          <div className="text-[10px] tracking-[0.2em] font-medium text-[#F5F5F5] leading-tight uppercase font-sans">
            <div>Royal</div>
            <div className="text-[#FF9D33]">Atelier</div>
          </div>
        </Link>
        <button
          onClick={() => setMobileMenuOpen(!mobileMenuOpen)}
          aria-label={mobileMenuOpen ? "Close navigation menu" : "Open navigation menu"}
          className="p-2 text-[#FF7A00] hover:text-[#F5F5F5] focus:outline-none focus-visible:ring-2 focus-visible:ring-[#FF7A00] rounded"
        >
          {mobileMenuOpen ? <X className="w-6 h-6" /> : <Menu className="w-6 h-6" />}
        </button>
      </div>

      {/* Mobile Drawer Menu */}
      {mobileMenuOpen && (
        <div className="lg:hidden fixed inset-0 top-[65px] bg-[#080808] z-50 p-6 flex flex-col justify-between border-b border-[#262626]">
          <nav className="flex flex-col space-y-6 pt-4">
            {navItems.map((item) => (
              <Link
                key={item.id}
                href={item.href}
                onClick={() => setMobileMenuOpen(false)}
                className={`text-lg tracking-wide uppercase font-medium transition-colors ${
                  activeSection === item.id ? "text-[#FF7A00] font-semibold" : "text-[#B7B7B7] hover:text-[#F5F5F5]"
                }`}
              >
                {item.label}
              </Link>
            ))}
            <Link
              href="/projects"
              onClick={() => setMobileMenuOpen(false)}
              className="text-base text-[#FF9D33] hover:text-[#FF7A00] font-medium pt-2 border-t border-[#262626]"
            >
              Full Project Archive →
            </Link>
          </nav>
          <div className="text-[11px] tracking-[0.25em] text-[#B7B7B7] uppercase font-sans pb-6 space-y-1">
            <div>Ideas</div>
            <div>Code</div>
            <div>People</div>
            <div className="text-[#FF9D33]">A Brighter Web</div>
          </div>
        </div>
      )}

      {/* Desktop Narrow Left Rail (~165px wide) */}
      <aside
        className="hidden lg:flex flex-col justify-between w-[165px] shrink-0 border-r border-[#262626] py-8 px-6 min-h-full"
        aria-label="Desktop primary navigation"
      >
        {/* Top: Monogram & Stacked Lockup */}
        <div className="flex flex-col items-start">
          <Link href="/" className="group block focus:outline-none focus-visible:ring-2 focus-visible:ring-[#FF7A00] rounded" aria-label="Harish Babu Home">
            <Monogram className="w-12 h-14 transition-transform duration-300 group-hover:scale-105" />
          </Link>
          <div className="mt-4 text-[10px] tracking-[0.22em] text-[#F5F5F5] leading-[1.35] uppercase font-sans font-medium">
            <div>Royal</div>
            <div>Technology</div>
            <div className="text-[#FF9D33]">Atelier</div>
          </div>
        </div>

        {/* Center: Navigation Links with Vertical Hairline Rules & Dot Marker */}
        <div className="flex flex-col items-start relative my-12">
          {/* Subtle vertical hairline behind active marker */}
          <div className="absolute left-[3px] top-[-16px] bottom-[-16px] w-[1px] bg-[#262626]/70" />

          <nav className="flex flex-col space-y-5 relative z-10">
            {navItems.map((item) => {
              const isActive = activeSection === item.id;
              return (
                <Link
                  key={item.id}
                  href={item.href}
                  className={`group flex items-center text-[13px] tracking-[0.06em] font-sans transition-colors duration-200 focus:outline-none focus-visible:ring-1 focus-visible:ring-[#FF7A00] ${
                    isActive ? "text-[#FF7A00] font-semibold" : "text-[#B7B7B7] hover:text-[#F5F5F5]"
                  }`}
                >
                  {/* Small burgundy active marker */}
                  {isActive ? (
                    <span className="w-1.5 h-1.5 rounded-full bg-[#FF7A00] mr-2.5 shrink-0" aria-hidden="true" />
                  ) : (
                    <span className="w-1.5 h-1.5 rounded-full bg-transparent group-hover:bg-[#FF9D33]/50 mr-2.5 shrink-0 transition-colors" aria-hidden="true" />
                  )}
                  <span>{item.label}</span>
                </Link>
              );
            })}
          </nav>
        </div>

        {/* Bottom Text Treatment */}
        <div className="text-[10px] tracking-[0.22em] text-[#B7B7B7] uppercase font-sans leading-relaxed space-y-0.5">
          <div>Ideas</div>
          <div>Code</div>
          <div>People</div>
          <div className="text-[#FF9D33] font-medium pt-1">A Brighter Web</div>
        </div>
      </aside>
    </>
  );
}
