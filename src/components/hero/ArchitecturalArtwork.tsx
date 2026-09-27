"use client";

import React from "react";

export default function ArchitecturalArtwork({
  className = "",
  isAmbientActive = true
}: {
  className?: string;
  isAmbientActive?: boolean;
}) {
  return (
    <div
      className={`relative pointer-events-none select-none overflow-hidden transition-opacity duration-1000 ${className}`}
      style={{
        animation: isAmbientActive ? "slowLineworkPulse 16s ease-in-out infinite" : "none",
        animationPlayState: isAmbientActive ? "running" : "paused"
      }}
    >
      <svg
        viewBox="0 0 700 420"
        fill="none"
        xmlns="http://www.w3.org/2000/svg"
        className="w-full h-full"
        aria-hidden="true"
      >
        <style>{`
          @keyframes slowLineworkPulse {
            0%, 100% { opacity: 0.22; transform: scale(1); }
            50% { opacity: 0.32; transform: scale(1.008); }
          }
        `}</style>
        <g stroke="#FF7A00" strokeWidth="0.85" opacity="0.3" strokeLinecap="round" strokeLinejoin="round">
          {/* Main perspective horizon & ground lines */}
          <line x1="20" y1="280" x2="680" y2="280" />
          <line x1="80" y1="310" x2="650" y2="310" strokeDasharray="3 3" />
          <line x1="140" y1="330" x2="620" y2="330" />

          {/* Perspective grid lines converging toward vanishing point */}
          <line x1="390" y1="180" x2="160" y2="380" opacity="0.3" />
          <line x1="390" y1="180" x2="260" y2="380" opacity="0.3" />
          <line x1="390" y1="180" x2="380" y2="380" opacity="0.3" />
          <line x1="390" y1="180" x2="500" y2="380" opacity="0.3" />
          <line x1="390" y1="180" x2="600" y2="380" opacity="0.3" />

          {/* Classical arch and circular geometry in background */}
          <path d="M 230 280 A 180 180 0 0 1 590 280" strokeWidth="0.75" />
          <path d="M 270 280 A 140 140 0 0 1 550 280" strokeWidth="0.6" strokeDasharray="4 4" />
          <circle cx="410" cy="180" r="90" strokeWidth="0.5" opacity="0.25" />

          {/* Pavilion front colonnade & vertical structural pillars */}
          <line x1="430" y1="40" x2="430" y2="280" strokeWidth="1.2" />
          <line x1="442" y1="40" x2="442" y2="280" strokeWidth="0.8" />
          <line x1="470" y1="55" x2="470" y2="280" strokeWidth="1.1" />
          <line x1="480" y1="55" x2="480" y2="280" strokeWidth="0.8" />
          <line x1="530" y1="80" x2="530" y2="280" strokeWidth="1.2" />
          <line x1="540" y1="80" x2="540" y2="280" strokeWidth="0.8" />
          <line x1="610" y1="110" x2="610" y2="280" strokeWidth="1.1" />
          <line x1="618" y1="110" x2="618" y2="280" strokeWidth="0.8" />

          {/* Secondary rear pillars */}
          <line x1="370" y1="90" x2="370" y2="280" strokeWidth="0.8" strokeDasharray="2 2" />
          <line x1="330" y1="120" x2="330" y2="280" strokeWidth="0.8" strokeDasharray="2 2" />

          {/* Entablatures & upper beams */}
          <line x1="390" y1="40" x2="630" y2="110" strokeWidth="1.2" />
          <line x1="390" y1="48" x2="630" y2="118" strokeWidth="0.75" />
          <line x1="350" y1="75" x2="610" y2="140" strokeWidth="0.8" />

          {/* Pediment & roof framework */}
          <line x1="430" y1="40" x2="520" y2="10" strokeWidth="1.1" />
          <line x1="520" y1="10" x2="630" y2="110" strokeWidth="1.1" />
          <line x1="520" y1="10" x2="520" y2="70" strokeWidth="0.7" />

          {/* Transverse cross-bracing rafters */}
          <line x1="430" y1="40" x2="350" y2="75" strokeWidth="0.75" />
          <line x1="470" y1="55" x2="400" y2="90" strokeWidth="0.75" />
          <line x1="530" y1="80" x2="460" y2="110" strokeWidth="0.75" />

          {/* Subtle architectural elevation dimension ticks */}
          <line x1="420" y1="40" x2="425" y2="40" />
          <line x1="420" y1="160" x2="425" y2="160" />
          <line x1="420" y1="280" x2="425" y2="280" />
          <line x1="422" y1="40" x2="422" y2="280" strokeWidth="0.5" strokeDasharray="2 2" />

          {/* Human scale silhouettes standing inside the portico */}
          <circle cx="490" cy="245" r="3.5" fill="#FF7A00" opacity="0.5" stroke="none" />
          <path d="M 490 250 L 490 278 M 487 257 L 493 257 M 488 278 L 488 280 M 492 278 L 492 280" strokeWidth="1" opacity="0.5" />

          <circle cx="515" cy="248" r="3" fill="#FF7A00" opacity="0.4" stroke="none" />
          <path d="M 515 252 L 515 278 M 512 258 L 518 258 M 513 278 L 513 280 M 517 278 L 517 280" strokeWidth="0.9" opacity="0.4" />
        </g>
      </svg>
    </div>
  );
}
