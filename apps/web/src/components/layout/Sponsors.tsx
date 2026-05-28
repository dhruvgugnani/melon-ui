"use client";

import React from "react";

const DIAMOND_SPONSORS = [
  { name: "Shadcnblocks.com", note: "2000+ UI blocks", link: "https://shadcnblocks.com" },
  { name: "shadcnstudio.com", note: "next-gen templates", link: "https://shadcnstudio.com" },
];

const PLATINUM_SPONSORS = [
  { name: "tailark", link: "https://tailark.com" },
];

export function Sponsors() {
  return (
    <div className="space-y-5">
      <div className="flex items-center justify-between border-b border-white/5 pb-2">
        <h5
          className="text-xs font-black uppercase text-white/50 tracking-wider"
          style={{ fontFamily: "var(--font-outfit)" }}
        >
          Sponsors
        </h5>
        <a
          href="https://github.com/sponsors/dhruvgugnani"
          target="_blank"
          rel="noreferrer"
          className="font-mono text-[9px] text-[#ff5c71] hover:text-white transition-colors uppercase tracking-widest"
        >
          Become a sponsor &rarr;
        </a>
      </div>

      {/* Diamond Tier */}
      <div className="space-y-2">
        <p className="font-mono text-[9px] text-white/20 uppercase tracking-[0.2em]">Diamond</p>
        <div className="grid gap-2">
          {DIAMOND_SPONSORS.map((sp) => (
            <a
              key={sp.name}
              href={sp.link}
              target="_blank"
              rel="noreferrer"
              className="flex items-center justify-between p-3 rounded-[6px] border border-white/5 bg-zinc-950/40 hover:bg-zinc-950/80 hover:border-white/10 hover:scale-[1.01] active:scale-98 transition-all duration-200"
            >
              <span className="text-xs font-bold text-white/80">{sp.name}</span>
              <span className="font-mono text-[9px] text-white/30">{sp.note}</span>
            </a>
          ))}
        </div>
      </div>

      {/* Platinum Tier */}
      <div className="space-y-2">
        <p className="font-mono text-[9px] text-white/20 uppercase tracking-[0.2em]">Platinum</p>
        <div className="grid gap-2">
          {PLATINUM_SPONSORS.map((sp) => (
            <a
              key={sp.name}
              href={sp.link}
              target="_blank"
              rel="noreferrer"
              className="flex items-center justify-between p-3 rounded-[6px] border border-white/5 bg-zinc-950/40 hover:bg-zinc-950/80 hover:border-white/10 hover:scale-[1.01] active:scale-98 transition-all duration-200"
            >
              <span className="text-xs font-bold text-white/80">{sp.name}</span>
              <span className="font-mono text-[9px] text-white/30">sponsor</span>
            </a>
          ))}
        </div>
      </div>
    </div>
  );
}
