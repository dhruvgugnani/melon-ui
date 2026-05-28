"use client";

import React, { CSSProperties, useState } from "react";
import { motion } from "framer-motion";

export interface GlyphOrbitTextProps {
  text?: string;
  glyphs?: string[];
  primaryColor?: string;
  accentColor?: string;
  className?: string;
  style?: CSSProperties;
}

export function GlyphOrbitText({
  text = "ORBIT",
  glyphs = ["M", "E", "L", "O", "N", "U", "I"],
  primaryColor = "#ffffff",
  accentColor = "#7fff5e",
  className = "",
  style,
}: GlyphOrbitTextProps) {
  const [active, setActive] = useState(false);

  return (
    <button
      type="button"
      aria-label={`${text} glyph orbit`}
      onPointerEnter={() => setActive(true)}
      onPointerLeave={() => setActive(false)}
      onClick={() => setActive((value) => !value)}
      className={`relative inline-grid min-h-[clamp(17rem,38vw,24rem)] w-full max-w-[980px] cursor-pointer place-items-center overflow-visible bg-transparent p-0 focus:outline-none focus-visible:ring-2 focus-visible:ring-[#7fff5e] ${className}`}
      style={style}
    >
      <motion.span
        aria-hidden="true"
        className="absolute h-[clamp(12rem,25vw,17rem)] w-[clamp(12rem,25vw,17rem)] rounded-full border border-dashed border-white/18"
        animate={{ rotate: active ? 360 : 0, scale: active ? 1.08 : 1 }}
        transition={{ rotate: { duration: 8, repeat: active ? Infinity : 0, ease: "linear" }, scale: { type: "spring" } }}
      />
      {glyphs.map((glyph, index) => {
        const angle = (index / glyphs.length) * Math.PI * 2 - Math.PI / 2;
        const radius = active ? 132 : 98;
        return (
          <motion.span
            key={`${glyph}-${index}`}
            className="absolute grid h-12 w-12 place-items-center rounded-[6px] border border-white/12 bg-black/20 text-3xl uppercase backdrop-blur-md"
            style={{ fontFamily: "var(--font-londrina-solid)", color: index % 2 ? "#ff5c71" : accentColor }}
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
      <motion.span
        className="relative text-[clamp(4rem,13vw,9rem)] uppercase leading-none"
        style={{
          fontFamily: "var(--font-londrina-solid)",
          color: primaryColor,
          textShadow: "0 0 42px rgba(255,92,113,0.22)",
        }}
        animate={{ scale: active ? 0.86 : 1, letterSpacing: active ? "0.08em" : "0em" }}
        transition={{ type: "spring", stiffness: 220, damping: 20 }}
      >
        {text}
      </motion.span>
    </button>
  );
}
