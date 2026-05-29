"use client";

import React, { CSSProperties, useState } from "react";
import { motion, useReducedMotion } from "framer-motion";

export interface GlyphOrbitTextProps extends React.ComponentPropsWithoutRef<"button"> {
  text?: string;
  glyphs?: string[];
  primaryColor?: string;
  secondaryColor?: string;
  accentColor?: string;
}

export function GlyphOrbitText({
  text = "ORBIT",
  glyphs,
  primaryColor = "#ffffff",
  secondaryColor = "#ff5c71",
  accentColor = "#7fff5e",
  className = "",
  style,
  ...props
}: GlyphOrbitTextProps) {
  const [active, setActive] = useState(false);
  const shouldReduceMotion = useReducedMotion();
  const orbitGlyphs = glyphs && glyphs.length > 0 ? glyphs : text.replace(/\s/g, "").split("");

  return (
    <button
      type="button"
      aria-label={`${text} glyph orbit`}
      onPointerEnter={() => setActive(true)}
      onPointerLeave={() => setActive(false)}
      className={`relative inline-grid min-h-[clamp(15rem,34vw,22rem)] w-full max-w-[980px] cursor-pointer place-items-center overflow-visible bg-transparent p-0 focus:outline-none focus-visible:ring-2 focus-visible:ring-[#7fff5e] ${className}`}
      style={style}
      {...props}
      onClick={(e) => {
        setActive((value) => !value);
        if (props.onClick) props.onClick(e);
      }}
    >
      <motion.span
        aria-hidden="true"
        className="absolute h-[clamp(11rem,24vw,16rem)] w-[clamp(11rem,24vw,16rem)] rounded-full border border-dashed border-white/18"
        animate={{ rotate: active && !shouldReduceMotion ? 360 : 0, scale: active ? 1.08 : 1 }}
        transition={{ 
          rotate: { duration: shouldReduceMotion ? 0 : 8, repeat: active && !shouldReduceMotion ? Infinity : 0, ease: "linear" }, 
          scale: shouldReduceMotion ? { duration: 0 } : { type: "spring" } 
        }}
      />
      {orbitGlyphs.map((glyph, index) => {
        const angle = (index / orbitGlyphs.length) * Math.PI * 2 - Math.PI / 2;
        const radius = active ? 132 : 116;
        return (
          <motion.span
            key={`${glyph}-${index}`}
            className="absolute grid h-10 w-10 place-items-center rounded-[6px] border border-white/12 bg-black/20 text-2xl uppercase backdrop-blur-md sm:h-12 sm:w-12 sm:text-3xl"
            style={{ fontFamily: "var(--font-londrina-solid)", color: index % 2 ? secondaryColor : accentColor }}
            animate={{
              x: Math.cos(angle) * radius,
              y: Math.sin(angle) * radius,
              rotate: active && !shouldReduceMotion ? angle * (180 / Math.PI) + 90 : 0,
              opacity: active ? 1 : 0.34,
              scale: active ? 1 : 0.72,
            }}
            transition={shouldReduceMotion ? { duration: 0 } : { type: "spring", stiffness: 180, damping: 18, delay: index * 0.02 }}
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
        animate={{ scale: active ? 0.9 : 1, letterSpacing: active ? "0.045em" : "0em" }}
        transition={shouldReduceMotion ? { duration: 0 } : { type: "spring", stiffness: 220, damping: 20 }}
      >
        {text}
      </motion.span>
    </button>
  );
}
