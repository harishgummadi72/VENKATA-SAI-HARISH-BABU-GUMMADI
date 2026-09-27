import React from "react";

export default function Monogram({ className = "w-12 h-14" }: { className?: string }) {
  return (
    <svg
      viewBox="0 0 64 72"
      fill="none"
      xmlns="http://www.w3.org/2000/svg"
      className={className}
      aria-label="HB Monogram"
    >
      {/* H Left Stem */}
      <rect x="10" y="14" width="7" height="44" fill="#FF7A00" rx="0.5" />
      {/* H Left Serifs */}
      <path d="M 6 14 L 21 14 L 21 16 L 6 16 Z" fill="#FF7A00" />
      <path d="M 6 56 L 21 56 L 21 58 L 6 58 Z" fill="#FF7A00" />

      {/* H Crossbar */}
      <rect x="15" y="34" width="16" height="4" fill="#FF8C1A" />

      {/* H Right Stem / B Spine */}
      <rect x="28" y="14" width="7" height="44" fill="#FF9D33" rx="0.5" />
      {/* Center Top and Bottom Serifs */}
      <path d="M 24 14 L 37 14 L 37 16 L 24 16 Z" fill="#FF9D33" />
      <path d="M 24 56 L 37 56 L 37 58 L 24 58 Z" fill="#FF9D33" />

      {/* B Upper Bowl */}
      <path
        d="M 33 16 C 44 16 50 20 50 26 C 50 32 44 35 34 35 L 34 31 C 41 31 45 29 45 26 C 45 22 41 20 34 20 Z"
        fill="#FF7A00"
      />

      {/* B Lower Bowl (slightly wider) */}
      <path
        d="M 33 34 C 46 34 54 38 54 46 C 54 54 45 58 33 58 L 33 54 C 42 54 48 51 48 46 C 48 40 42 38 33 38 Z"
        fill="#FF7A00"
      />

      {/* Elegant Inner Accent Dot */}
      <circle cx="50" cy="20" r="1.5" fill="#FF7A00" opacity="0.9" />
    </svg>
  );
}
