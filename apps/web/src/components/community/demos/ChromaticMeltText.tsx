"use client";

import React, { useState } from "react";
import { motion } from "framer-motion";

export interface ChromaticMeltTextProps {
  text?: string;
  kicker?: string;
}

export function ChromaticMeltText({
  text = "MELT MODE",
  kicker = "Pointer reactive ink",
}: ChromaticMeltTextProps) {
  const [spot, setSpot] = useState({ x: 48, y: 42 });

  const handlePointerMove = (event: React.PointerEvent<HTMLDivElement>) => {
    const rect = event.currentTarget.getBoundingClientRect();
    setSpot({
      x: ((event.clientX - rect.left) / rect.width) * 100,
      y: ((event.clientY - rect.top) / rect.height) * 100,
    });
  };

  return (
    <section
      aria-label="Chromatic Melt Text"
      onPointerMove={handlePointerMove}
      onPointerLeave={() => setSpot({ x: 48, y: 42 })}
      className="relative flex min-h-[360px] w-full items-center justify-center overflow-hidden bg-[#050505] p-6 text-white"
    >
      <div className="absolute inset-0 bg-[linear-gradient(rgba(255,255,255,0.035)_1px,transparent_1px),linear-gradient(90deg,rgba(255,255,255,0.025)_1px,transparent_1px)] bg-[size:34px_34px]" />
      <div
        className="absolute inset-0 opacity-80"
        style={{
          background: `radial-gradient(circle at ${spot.x}% ${spot.y}%, rgba(255,92,113,0.28), rgba(127,255,94,0.12) 28%, transparent 56%)`,
        }}
      />

      <div className="relative w-full max-w-4xl rounded-[8px] border border-white/10 bg-black/45 p-6 shadow-[0_35px_90px_rgba(0,0,0,0.5)] backdrop-blur-2xl">
        <div className="absolute inset-0 rounded-[8px] bg-[radial-gradient(circle_at_15%_20%,rgba(255,92,113,0.16),transparent_34%),radial-gradient(circle_at_90%_80%,rgba(127,255,94,0.14),transparent_36%)]" />
        <div className="relative">
          <p className="mb-3 font-mono text-[10px] uppercase tracking-[0.28em] text-[#ff5c71]">
            {kicker}
          </p>
          <h2
            className="flex flex-wrap items-end gap-x-3 gap-y-1 text-[clamp(4rem,15vw,11rem)] uppercase leading-[0.72]"
            style={{ fontFamily: "var(--font-londrina-solid)" }}
          >
            {text.split("").map((char, index) => {
              const delay = index * 0.018;
              return (
                <motion.span
                  key={`${char}-${index}`}
                  initial={{ y: 24, opacity: 0, filter: "blur(14px)" }}
                  animate={{ y: 0, opacity: 1, filter: "blur(0px)" }}
                  transition={{ delay, duration: 0.5, ease: [0.16, 1, 0.3, 1] }}
                  whileHover={{
                    y: [0, 14, -5, 0],
                    scaleY: [1, 0.84, 1.12, 1],
                    color: "#7fff5e",
                  }}
                  className="relative inline-block min-w-[0.28em] text-white"
                  style={{
                    textShadow:
                      "0 1px 0 rgba(255,255,255,0.15), 0 18px 38px rgba(255,92,113,0.2)",
                  }}
                >
                  {char === " " ? "\u00a0" : char}
                  {char !== " " && (
                    <span
                      aria-hidden="true"
                      className="absolute inset-x-[18%] bottom-[-0.14em] h-[0.12em] rounded-full opacity-70 blur-[1px]"
                      style={{
                        background:
                          index % 2 === 0
                            ? "linear-gradient(90deg,#ff5c71,#f7f0d2)"
                            : "linear-gradient(90deg,#7fff5e,#ff5c71)",
                      }}
                    />
                  )}
                </motion.span>
              );
            })}
          </h2>
          <div className="mt-6 flex items-center justify-between border-t border-white/10 pt-4 font-mono text-[10px] uppercase tracking-[0.22em] text-white/35">
            <span>Hover letters</span>
            <span>Move pointer</span>
          </div>
        </div>
      </div>
    </section>
  );
}
