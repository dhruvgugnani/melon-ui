"use client";

import React, { useState } from "react";
import { motion } from "framer-motion";

export interface RindScannerTextProps {
  text?: string;
}

export function RindScannerText({ text = "SCAN THE RIND" }: RindScannerTextProps) {
  const [active, setActive] = useState(false);
  const slices = ["clip-path:inset(0 0 78% 0)", "clip-path:inset(24% 0 48% 0)", "clip-path:inset(54% 0 18% 0)"];

  return (
    <section className="relative flex min-h-[360px] w-full items-center justify-center overflow-hidden bg-[#050505] p-6 text-white">
      <div className="absolute inset-0 bg-[radial-gradient(circle_at_18%_20%,rgba(127,255,94,0.13),transparent_32%),radial-gradient(circle_at_82%_72%,rgba(255,92,113,0.16),transparent_34%)]" />
      <button
        type="button"
        onPointerEnter={() => setActive(true)}
        onPointerLeave={() => setActive(false)}
        onClick={() => setActive((value) => !value)}
        className="group relative w-full max-w-4xl overflow-hidden rounded-[8px] border border-white/10 bg-black/55 p-7 text-left shadow-[0_35px_90px_rgba(0,0,0,0.5)] backdrop-blur-xl focus:outline-none focus-visible:ring-2 focus-visible:ring-[#7fff5e]"
      >
        <div className="absolute inset-0 bg-[linear-gradient(90deg,transparent,rgba(127,255,94,0.08),transparent)] opacity-70" />
        <motion.div
          aria-hidden="true"
          className="absolute inset-y-0 w-20 bg-[linear-gradient(90deg,transparent,rgba(127,255,94,0.36),transparent)] blur-md"
          animate={{ x: active ? ["-20%", "460%"] : "-30%" }}
          transition={{ duration: 1.25, ease: "easeInOut", repeat: active ? Infinity : 0, repeatDelay: 0.35 }}
        />
        <p className="relative mb-4 font-mono text-[10px] uppercase tracking-[0.3em] text-[#7fff5e]">
          hover activated typography scanner
        </p>
        <div className="relative min-h-[170px]">
          <h2
            className="absolute inset-0 text-[clamp(4rem,13vw,9rem)] uppercase leading-[0.78] text-white/16"
            style={{ fontFamily: "var(--font-londrina-solid)" }}
          >
            {text}
          </h2>
          {slices.map((clip, index) => (
            <motion.h2
              key={clip}
              aria-hidden="true"
              className="absolute inset-0 text-[clamp(4rem,13vw,9rem)] uppercase leading-[0.78]"
              style={{
                fontFamily: "var(--font-londrina-solid)",
                color: index === 1 ? "#7fff5e" : "#f4f4f4",
                textShadow: index === 1 ? "0 0 34px rgba(127,255,94,0.42)" : "0 0 30px rgba(255,92,113,0.22)",
                clipPath: clip.replace("clip-path:", ""),
              }}
              animate={{
                x: active ? [0, index === 1 ? -16 : 12, 0] : 0,
                skewX: active ? [0, index === 1 ? -5 : 4, 0] : 0,
              }}
              transition={{ duration: 0.45, repeat: active ? Infinity : 0, repeatDelay: 0.7 + index * 0.1 }}
            >
              {text}
            </motion.h2>
          ))}
        </div>
        <div className="relative flex flex-wrap gap-2 border-t border-white/10 pt-4 font-mono text-[10px] uppercase tracking-[0.2em] text-white/35">
          <span className="rounded-full border border-[#7fff5e]/25 px-3 py-1 text-[#7fff5e]">slice</span>
          <span className="rounded-full border border-[#ff5c71]/25 px-3 py-1 text-[#ff5c71]">offset</span>
          <span className="rounded-full border border-white/10 px-3 py-1">scan</span>
        </div>
      </button>
    </section>
  );
}
