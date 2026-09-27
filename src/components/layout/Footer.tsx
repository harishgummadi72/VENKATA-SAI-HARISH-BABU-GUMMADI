import React from "react";
import Link from "next/link";
import Monogram from "../ui/Monogram";

export default function Footer() {
  return (
    <footer className="w-full bg-[#080808] border-t border-[#262626] py-12 px-6 lg:px-16 text-[#818181] font-sans">
      <div className="max-w-[1600px] mx-auto flex flex-col sm:flex-row items-center justify-between gap-6">
        <div className="flex items-center gap-4">
          <Monogram className="w-8 h-9" />
          <div className="flex flex-col">
            <span className="font-semibold text-[#F5F5F5] tracking-wide text-xs uppercase">Harish Babu</span>
            <span className="text-[10px] text-[#FF7A00] uppercase tracking-wider">
              Software Development · Full Stack · Cybersecurity
            </span>
          </div>
        </div>

        <div className="flex flex-wrap items-center justify-center sm:justify-start gap-4 sm:gap-6 text-xs text-[#818181]">
          <Link href="/#top" className="hover:text-[#FF7A00] transition-colors">
            Top
          </Link>
          <Link href="/#projects" className="hover:text-[#FF7A00] transition-colors">
            Projects
          </Link>
          <Link href="/#about" className="hover:text-[#FF7A00] transition-colors">
            About
          </Link>
          <Link href="/#education" className="hover:text-[#FF7A00] transition-colors">
            Education
          </Link>
          <Link href="/#skills" className="hover:text-[#FF7A00] transition-colors">
            Skills
          </Link>
          <Link href="/#achievements" className="hover:text-[#FF7A00] transition-colors">
            Achievements
          </Link>
          <Link href="/#contact" className="hover:text-[#FF7A00] transition-colors">
            Contact
          </Link>
          <a
            href="https://github.com/harishgummadi72"
            target="_blank"
            rel="noopener noreferrer"
            className="hover:text-[#FF7A00] transition-colors font-medium text-[#F5F5F5]"
          >
            GitHub
          </a>
          <a
            href="https://www.linkedin.com/in/harish-gummadi-18a3153a7/"
            target="_blank"
            rel="noopener noreferrer"
            className="hover:text-[#FF7A00] transition-colors font-medium text-[#F5F5F5]"
          >
            LinkedIn
          </a>
        </div>
      </div>
    </footer>
  );
}
