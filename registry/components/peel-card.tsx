"use client";

import { useRef } from "react";
import gsap from "gsap";

export function RindPeelCard() {
  const cardRef = useRef<HTMLDivElement>(null);
  const peelRef = useRef<HTMLDivElement>(null);
  const contentRef = useRef<HTMLDivElement>(null);

  const handleEnter = () => {
    gsap.to(peelRef.current, {
      scaleY: 0,
      transformOrigin: "top center",
      duration: 0.5,
      ease: "power3.inOut",
    });
    gsap.to(contentRef.current, {
      opacity: 1,
      y: 0,
      duration: 0.4,
      delay: 0.25,
      ease: "power2.out",
    });
  };

  const handleLeave = () => {
    gsap.to(peelRef.current, {
      scaleY: 1,
      duration: 0.5,
      ease: "power3.inOut",
    });
    gsap.to(contentRef.current, {
      opacity: 0,
      y: 12,
      duration: 0.3,
      ease: "power2.in",
    });
  };

  return (
    <div
      ref={cardRef}
      onMouseEnter={handleEnter}
      onMouseLeave={handleLeave}
      className="relative w-72 h-52 cursor-pointer overflow-hidden"
      style={{ border: "1px solid #1e1e1e" }}
    >
      {/* Inner content revealed under peel */}
      <div className="absolute inset-0 bg-[#7fff5e] flex flex-col justify-center px-6">
        <p className="text-[#050505] font-black text-2xl uppercase tracking-tight" style={{ fontFamily: "var(--font-anton)" }}>
          Fresh 🍉
        </p>
        <p className="text-[#050505]/70 text-sm font-mono mt-1">
          Underneath the rind, something juicy.
        </p>
      </div>

      {/* The "rind" peel layer */}
      <div
        ref={peelRef}
        className="absolute inset-0 bg-[#0a0a0a] flex flex-col justify-between p-6 z-10"
        style={{ transformOrigin: "top center" }}
      >
        {/* Rind stripe at bottom */}
        <div>
          <p className="text-[#e8d5b7] font-mono text-xs uppercase tracking-widest mb-2">Component</p>
          <p className="text-[#f4f4f4] font-black text-2xl uppercase" style={{ fontFamily: "var(--font-anton)" }}>Rind Peel Card</p>
        </div>
        <div className="flex items-center justify-between">
          <span className="text-[#555] font-mono text-xs">Hover to reveal</span>
          <span className="text-[#ff5c71] font-mono text-lg">↑</span>
        </div>
        {/* Rind stripe */}
        <div className="absolute bottom-0 inset-x-0 h-2 bg-[#7fff5e]" />
      </div>

      {/* Hidden content layer reference */}
      <div
        ref={contentRef}
        className="absolute inset-0 z-20 pointer-events-none"
        style={{ opacity: 0, transform: "translateY(12px)" }}
      />
    </div>
  );
}
