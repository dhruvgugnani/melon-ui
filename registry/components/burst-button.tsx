"use client";

import { useRef, useState } from "react";
import gsap from "gsap";

// Seed shape as a small SVG
function Seed({ style }: { style?: React.CSSProperties }) {
  return (
    <svg
      width="8"
      height="14"
      viewBox="0 0 8 14"
      style={style}
      className="absolute pointer-events-none"
    >
      <ellipse cx="4" cy="7" rx="3.5" ry="6" fill="#1a1a1a" stroke="#ff5c71" strokeWidth="1" />
    </svg>
  );
}

const SEED_COUNT = 12;

export function SeedBurstButton() {
  const btnRef = useRef<HTMLButtonElement>(null);
  const seedsRef = useRef<(HTMLDivElement | null)[]>([]);
  const [active, setActive] = useState(false);

  const handleClick = (e: React.MouseEvent<HTMLButtonElement>) => {
    if (!btnRef.current) return;
    setActive(true);

    const rect = btnRef.current.getBoundingClientRect();
    const originX = e.clientX - rect.left;
    const originY = e.clientY - rect.top;

    seedsRef.current.forEach((seed, i) => {
      if (!seed) return;
      const angle = (i / SEED_COUNT) * Math.PI * 2;
      const dist = 60 + Math.random() * 60;
      const dx = Math.cos(angle) * dist;
      const dy = Math.sin(angle) * dist;

      gsap.set(seed, {
        x: originX,
        y: originY,
        opacity: 1,
        scale: 0.5 + Math.random() * 0.8,
        rotation: Math.random() * 360,
      });

      gsap.to(seed, {
        x: originX + dx,
        y: originY + dy,
        opacity: 0,
        scale: 0,
        rotation: `+=${180 + Math.random() * 360}`,
        duration: 0.8 + Math.random() * 0.4,
        ease: "power2.out",
        onComplete: () => setActive(false),
      });
    });
  };

  return (
    <div className="relative flex items-center justify-center w-64 h-32 overflow-visible">
      {/* Seeds overlay */}
      {Array.from({ length: SEED_COUNT }).map((_, i) => (
        <div
          key={i}
          ref={(el) => { seedsRef.current[i] = el; }}
          className="absolute opacity-0 pointer-events-none"
          style={{ left: 0, top: 0 }}
        >
          <Seed />
        </div>
      ))}

      <button
        ref={btnRef}
        onClick={handleClick}
        className="relative px-10 py-4 bg-[#ff5c71] text-[#050505] font-black uppercase tracking-widest text-lg overflow-hidden transition-transform active:scale-95 select-none"
        style={{ fontFamily: "var(--font-anton)" }}
      >
        {/* Rind stripe */}
        <span className="absolute inset-x-0 bottom-0 h-1.5 bg-[#7fff5e]" />
        <span className="relative z-10">Click Me</span>

        {/* Juice burst overlay */}
        <span
          className={`absolute inset-0 bg-[#e8d5b7] transition-opacity duration-150 ${active ? "opacity-20" : "opacity-0"}`}
        />
      </button>
    </div>
  );
}
