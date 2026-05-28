"use client";

import React, { useState } from "react";
import { motion } from "framer-motion";

const LAYERS = [
  { label: "LOUD", color: "#ff5c71", x: -18, y: -18, rotate: -7 },
  { label: "SOFT", color: "#f7f0d2", x: 16, y: 4, rotate: 5 },
  { label: "TYPE", color: "#7fff5e", x: -4, y: 22, rotate: -2 },
];

export function StickerStackText() {
  const [open, setOpen] = useState(false);

  return (
    <section className="relative flex min-h-[380px] w-full items-center justify-center overflow-hidden bg-[#050505] p-6 text-white">
      <div className="absolute inset-0 bg-[radial-gradient(circle_at_50%_20%,rgba(255,92,113,0.18),transparent_34%),linear-gradient(135deg,rgba(255,255,255,0.04),transparent_36%)]" />
      <button
        type="button"
        onPointerEnter={() => setOpen(true)}
        onPointerLeave={() => setOpen(false)}
        onClick={() => setOpen((value) => !value)}
        className="relative h-[300px] w-full max-w-4xl rounded-[8px] border border-white/10 bg-black/50 p-6 shadow-[0_35px_90px_rgba(0,0,0,0.55)] backdrop-blur-xl focus:outline-none focus-visible:ring-2 focus-visible:ring-[#ff5c71]"
      >
        <span className="absolute left-6 top-6 font-mono text-[10px] uppercase tracking-[0.28em] text-[#ff5c71]">
          sticker stack text
        </span>
        <div className="absolute inset-0 flex items-center justify-center">
          {LAYERS.map((layer, index) => (
            <motion.div
              key={layer.label}
              className="absolute rounded-[8px] border border-black/35 px-6 py-2 shadow-[0_24px_48px_rgba(0,0,0,0.36)]"
              style={{ backgroundColor: layer.color }}
              initial={false}
              animate={{
                x: open ? layer.x * 2.2 : layer.x,
                y: open ? layer.y * 1.8 : layer.y,
                rotate: open ? layer.rotate * 2 : layer.rotate,
                scale: open ? 1.04 + index * 0.03 : 1,
              }}
              transition={{ type: "spring", stiffness: 260, damping: 20, delay: index * 0.025 }}
            >
              <span
                className="block text-[clamp(4rem,14vw,9rem)] uppercase leading-[0.78] text-black"
                style={{
                  fontFamily: "var(--font-londrina-solid)",
                  textShadow: "0 2px 0 rgba(255,255,255,0.22)",
                }}
              >
                {layer.label}
              </span>
              <span
                aria-hidden="true"
                className="absolute -right-3 -top-3 rounded-full border border-black/20 bg-black px-3 py-1 font-mono text-[9px] uppercase tracking-[0.18em] text-white"
              >
                0{index + 1}
              </span>
            </motion.div>
          ))}
        </div>
        <div className="absolute bottom-5 left-6 right-6 flex items-center justify-between border-t border-white/10 pt-4 font-mono text-[10px] uppercase tracking-[0.2em] text-white/35">
          <span>Hover to fan</span>
          <span>Click to pin</span>
        </div>
      </button>
    </section>
  );
}
