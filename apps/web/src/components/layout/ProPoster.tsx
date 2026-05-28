"use client";

import React from "react";

export function ProPoster() {
  return (
    <div className="relative overflow-hidden rounded-[8px] border border-white/10 bg-zinc-950 p-5 shadow-[0_8px_32px_rgba(0,0,0,0.5)]">
      {/* Glow effect */}
      <div className="absolute -right-16 -top-16 h-36 w-36 rounded-full bg-[#7fff5e]/10 blur-3xl pointer-events-none" />
      <div className="absolute -left-16 -bottom-16 h-36 w-36 rounded-full bg-[#ff5c71]/5 blur-3xl pointer-events-none" />

      {/* Pro Badge */}
      <div className="flex items-center justify-between mb-4">
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
        className="text-2xl font-black uppercase leading-none text-white mb-2"
        style={{ fontFamily: "var(--font-londrina-solid)", letterSpacing: 0 }}
      >
        Get MelonUI Pro
      </h4>

      {/* Description */}
      <p className="text-xs text-white/60 leading-relaxed font-sans mb-5">
        Unlock the premium vault: 50+ cinematic WebGL layouts, R3F scenes, shaders, and complex GSAP setups. Ship unforgettable interfaces with production taste.
      </p>

      {/* Explore Button */}
      <button
        onClick={() => alert("MelonUI Pro is currently in preview! Launching soon.")}
        className="w-full py-2.5 bg-[#7fff5e] hover:bg-white text-black font-black uppercase tracking-wider text-xs rounded-full hover:scale-[1.02] active:scale-95 shadow-[0_0_20px_rgba(127,255,94,0.15)] transition-all duration-200 cursor-pointer"
        style={{ fontFamily: "var(--font-londrina-solid)" }}
      >
        Explore Pro Vault &rarr;
      </button>

      {/* Promo Code Card */}
      <div className="mt-4 p-2 rounded border border-dashed border-white/10 bg-white/3 flex items-center justify-between">
        <span className="font-mono text-[10px] text-white/40">Launch discount:</span>
        <span
          className="font-mono text-[10px] text-[#ff5c71] font-bold tracking-wider"
          aria-label="discount code MELON25"
        >
          MELON25 (25% OFF)
        </span>
      </div>
    </div>
  );
}
