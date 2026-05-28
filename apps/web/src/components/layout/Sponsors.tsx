"use client";

import React from "react";

export function Sponsors() {
  return (
    <div className="space-y-4">
      <div className="flex items-center justify-between border-b border-white/5 pb-2">
        <h5
          className="text-xs font-black uppercase text-white/50 tracking-wider"
          style={{ fontFamily: "var(--font-outfit)" }}
        >
          Sponsor Node
        </h5>
      </div>

      <div className="p-4 rounded-[8px] border border-dashed border-[#7fff5e]/25 bg-zinc-950/40 backdrop-blur-sm relative overflow-hidden group select-none flex flex-col justify-between h-44">
        {/* Glow grid background */}
        <div className="absolute inset-0 pointer-events-none opacity-5 group-hover:opacity-10 transition-opacity">
          <div className="absolute inset-0 bg-[linear-gradient(rgba(255,255,255,0.05)_1px,transparent_1px),linear-gradient(90deg,rgba(255,255,255,0.05)_1px,transparent_1px)] bg-[size:10px_10px]" />
        </div>

        <div className="space-y-2 relative z-10">
          <div className="flex items-center gap-1.5">
            <span className="w-1.5 h-1.5 rounded-full bg-[#ff5c71] animate-pulse" />
            <span className="font-mono text-[8px] text-[#ff5c71] uppercase tracking-widest font-bold">PORTAL OPEN</span>
          </div>
          <h6 className="font-mono text-[11px] text-white/70 uppercase tracking-wide leading-relaxed">
            Your logo could be here, supporting the curation of high-fidelity Gen-Z interfaces.
          </h6>
        </div>

        <a
          href="https://github.com/sponsors/dhruvgugnani"
          target="_blank"
          rel="noreferrer"
          className="w-full py-2 bg-zinc-900 border border-white/10 hover:border-[#7fff5e]/50 hover:bg-[#7fff5e]/10 text-white hover:text-[#7fff5e] font-mono text-[10px] uppercase tracking-wider rounded-md text-center transition-all duration-200 relative z-10"
        >
          CLAIM THIS NODE &rarr;
        </a>
      </div>
    </div>
  );
}
