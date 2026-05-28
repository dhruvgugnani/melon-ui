"use client";

import React, { useState } from "react";
import { motion } from "framer-motion";

const GLYPHS = ["M", "E", "L", "O", "N", "U", "I"];

export function GlyphOrbitText() {
  const [active, setActive] = useState(false);

  return (
    <section className="relative flex min-h-[400px] w-full items-center justify-center overflow-hidden bg-[#050505] p-6 text-white">
      <div className="absolute inset-0 bg-[radial-gradient(circle_at_50%_50%,rgba(127,255,94,0.12),transparent_36%),radial-gradient(circle_at_75%_20%,rgba(255,92,113,0.18),transparent_30%)]" />
      <button
        type="button"
        onPointerEnter={() => setActive(true)}
        onPointerLeave={() => setActive(false)}
        onClick={() => setActive((value) => !value)}
        className="relative grid h-[330px] w-full max-w-4xl place-items-center overflow-hidden rounded-[8px] border border-white/10 bg-black/55 shadow-[0_35px_90px_rgba(0,0,0,0.55)] backdrop-blur-xl focus:outline-none focus-visible:ring-2 focus-visible:ring-[#7fff5e]"
      >
        <span className="absolute left-6 top-6 font-mono text-[10px] uppercase tracking-[0.28em] text-white/35">
          orbital glyph lockup
        </span>
        <motion.div
          className="absolute h-56 w-56 rounded-full border border-dashed border-white/12"
          animate={{ rotate: active ? 360 : 0, scale: active ? 1.08 : 1 }}
          transition={{ rotate: { duration: 8, repeat: active ? Infinity : 0, ease: "linear" }, scale: { type: "spring" } }}
        />
        {GLYPHS.map((glyph, index) => {
          const angle = (index / GLYPHS.length) * Math.PI * 2 - Math.PI / 2;
          const radius = active ? 132 : 98;
          return (
            <motion.span
              key={`${glyph}-${index}`}
              className="absolute grid h-12 w-12 place-items-center rounded-[6px] border border-white/10 bg-white/[0.045] text-3xl uppercase backdrop-blur-md"
              style={{ fontFamily: "var(--font-londrina-solid)", color: index % 2 ? "#ff5c71" : "#7fff5e" }}
              animate={{
                x: Math.cos(angle) * radius,
                y: Math.sin(angle) * radius,
                rotate: active ? angle * (180 / Math.PI) + 90 : 0,
              }}
              transition={{ type: "spring", stiffness: 180, damping: 18, delay: index * 0.02 }}
            >
              {glyph}
            </motion.span>
          );
        })}
        <motion.h2
          className="relative text-[clamp(4rem,13vw,9rem)] uppercase leading-none text-white"
          style={{ fontFamily: "var(--font-londrina-solid)", textShadow: "0 0 42px rgba(255,92,113,0.22)" }}
          animate={{ scale: active ? 0.86 : 1, letterSpacing: active ? "0.08em" : "0em" }}
          transition={{ type: "spring", stiffness: 220, damping: 20 }}
        >
          ORBIT
        </motion.h2>
        <span className="absolute bottom-6 font-mono text-[10px] uppercase tracking-[0.22em] text-white/35">
          Hover to unlock the glyph ring
        </span>
      </button>
    </section>
  );
}
