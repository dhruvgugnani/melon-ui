"use client";

import React, { useRef } from "react";
import gsap from "gsap";

export function ProPoster() {
  const cardRef = useRef<HTMLButtonElement>(null);
  const glowRef = useRef<HTMLDivElement>(null);

  const handleMouseMove = (e: React.MouseEvent<HTMLButtonElement>) => {
    const card = cardRef.current;
    const glow = glowRef.current;
    if (!card) return;

    const rect = card.getBoundingClientRect();
    const x = e.clientX - rect.left;
    const y = e.clientY - rect.top;

    const centerX = rect.width / 2;
    const centerY = rect.height / 2;

    // Calculate rotation angles (max 12 degrees)
    const rotateX = ((centerY - y) / centerY) * 12;
    const rotateY = ((x - centerX) / centerX) * 12;

    gsap.to(card, {
      rotateX,
      rotateY,
      duration: 0.25,
      ease: "power2.out",
      transformPerspective: 600,
    });

    if (glow) {
      gsap.to(glow, {
        x: x - 64, // Center the 128px glow circle
        y: y - 64,
        opacity: 1,
        duration: 0.2,
      });
    }
  };

  const handleMouseLeave = () => {
    const card = cardRef.current;
    const glow = glowRef.current;
    if (!card) return;

    gsap.to(card, {
      rotateX: 0,
      rotateY: 0,
      duration: 0.5,
      ease: "power3.out",
    });

    if (glow) {
      gsap.to(glow, {
        opacity: 0,
        duration: 0.3,
      });
    }
  };

  return (
    <button
      ref={cardRef}
      onMouseMove={handleMouseMove}
      onMouseLeave={handleMouseLeave}
      onClick={() => alert("MelonUI Pro is currently in preview! Launching soon.")}
      className="w-full text-left font-sans block relative overflow-hidden rounded-[8px] border border-[#7fff5e]/25 bg-zinc-950/70 p-5 shadow-[0_12px_48px_rgba(0,0,0,0.6)] group transition-all duration-300 hover:border-[#7fff5e]/60 hover:shadow-[0_16px_48px_rgba(127,255,94,0.15)] select-none cursor-pointer outline-none focus:outline-none"
      style={{ transformStyle: "preserve-3d" }}
    >
      {/* Interactive Cursor Spotlight Glow */}
      <div
        ref={glowRef}
        className="absolute pointer-events-none w-32 h-32 rounded-full bg-[radial-gradient(circle,rgba(127,255,94,0.18)_0%,transparent_70%)] opacity-0 z-0"
        style={{ left: 0, top: 0 }}
      />

      {/* Sheen reflection strip */}
      <div 
        className="absolute inset-0 w-[200%] h-full bg-[linear-gradient(115deg,transparent_45%,rgba(255,255,255,0.06)_50%,transparent_55%)] -translate-x-full group-hover:translate-x-1/2 transition-transform duration-1000 ease-out z-10 pointer-events-none" 
      />

      {/* Background ambient blur glows */}
      <div className="absolute -right-16 -top-16 h-36 w-36 rounded-full bg-[#7fff5e]/15 blur-3xl pointer-events-none z-0" />
      <div className="absolute -left-16 -bottom-16 h-36 w-36 rounded-full bg-[#ff5c71]/5 blur-3xl pointer-events-none z-0" />

      {/* Pro Badge */}
      <div className="flex items-center justify-between mb-4 relative z-10">
        <span
          className="px-2 py-0.5 text-[10px] font-black uppercase text-black bg-[#7fff5e] rounded-[3px] tracking-wider"
          style={{ fontFamily: "var(--font-outfit)" }}
        >
          PRO
        </span>
        <span className="font-mono text-[9px] text-white/30 uppercase tracking-widest">
          Premium Access
        </span>
      </div>

      {/* Title */}
      <h4
        className="text-2xl font-black uppercase leading-none text-white mb-2 relative z-10"
        style={{ fontFamily: "var(--font-londrina-solid)", letterSpacing: 0 }}
      >
        Get MelonUI Pro
      </h4>

      {/* Description */}
      <p className="text-xs text-white/60 leading-relaxed font-sans mb-5 relative z-10">
        Unlock the premium vault: 50+ cinematic WebGL layouts, R3F scenes, shaders, and complex GSAP setups. Ship unforgettable interfaces with production taste.
      </p>

      {/* Explore Button */}
      <div
        className="w-full py-2.5 bg-[#7fff5e] group-hover:bg-white text-black font-black uppercase tracking-wider text-xs rounded-full text-center shadow-[0_0_20px_rgba(127,255,94,0.15)] transition-all duration-200 relative z-10"
        style={{ fontFamily: "var(--font-londrina-solid)" }}
      >
        Explore Pro Vault &rarr;
      </div>

      {/* Promo Code Card */}
      <div className="mt-4 p-2 rounded border border-dashed border-white/10 bg-white/3 flex items-center justify-between relative z-10">
        <span className="font-mono text-[10px] text-white/40">Launch discount:</span>
        <span
          className="font-mono text-[10px] text-[#ff5c71] font-bold tracking-wider"
          aria-label="discount code MELON25"
        >
          MELON25 (25% OFF)
        </span>
      </div>
    </button>
  );
}
