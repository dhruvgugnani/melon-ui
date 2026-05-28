"use client";

import React, { CSSProperties, useState } from "react";
import { motion } from "framer-motion";

export interface RindScannerTextProps {
  text?: string;
  label?: string;
  baseColor?: string;
  scanColor?: string;
  accentColor?: string;
  className?: string;
  style?: CSSProperties;
}

const SCANNER_SLICES = ["inset(0 0 78% 0)", "inset(24% 0 48% 0)", "inset(54% 0 18% 0)"];

export function RindScannerText({
  text = "SCAN THE RIND",
  label = "Typography scanner",
  baseColor = "#f4f4f4",
  scanColor = "#7fff5e",
  accentColor = "#ff5c71",
  className = "",
  style,
}: RindScannerTextProps) {
  const [active, setActive] = useState(false);

  return (
    <button
      type="button"
      aria-label={`${label}: ${text}`}
      onPointerEnter={() => setActive(true)}
      onPointerLeave={() => setActive(false)}
      onClick={() => setActive((value) => !value)}
      className={`group relative inline-grid w-full max-w-[980px] cursor-pointer place-items-start overflow-visible bg-transparent p-0 text-left focus:outline-none focus-visible:ring-2 focus-visible:ring-offset-4 focus-visible:ring-offset-transparent ${className}`}
      style={{ ...style, "--scanner-ring": scanColor } as CSSProperties}
    >
      {label && (
        <span className="mb-3 block font-mono text-[10px] uppercase tracking-[0.3em]" style={{ color: scanColor }}>
          {label}
        </span>
      )}
      <span className="relative block min-h-[clamp(7rem,18vw,11rem)] w-full overflow-visible">
        <motion.span
          aria-hidden="true"
          className="pointer-events-none absolute inset-y-0 z-10 w-16 blur-md"
          style={{
            background: `linear-gradient(90deg, transparent, ${scanColor}66, transparent)`,
          }}
          animate={{ x: active ? ["-20%", "640%"] : "-35%" }}
          transition={{ duration: 1.2, ease: "easeInOut", repeat: active ? Infinity : 0, repeatDelay: 0.35 }}
        />
        <span
          className="absolute inset-0 block text-[clamp(3.4rem,13vw,9rem)] uppercase leading-[0.78] opacity-15"
          style={{ fontFamily: "var(--font-londrina-solid)", color: baseColor }}
        >
          {text}
        </span>
        {SCANNER_SLICES.map((clip, index) => (
          <motion.span
            key={clip}
            aria-hidden="true"
            className="absolute inset-0 block text-[clamp(3.4rem,13vw,9rem)] uppercase leading-[0.78]"
            style={{
              fontFamily: "var(--font-londrina-solid)",
              color: index === 1 ? scanColor : baseColor,
              textShadow: index === 1 ? `0 0 34px ${scanColor}66` : `0 0 30px ${accentColor}33`,
              clipPath: clip,
            }}
            animate={{
              x: active ? [0, index === 1 ? -16 : 12, 0] : 0,
              skewX: active ? [0, index === 1 ? -5 : 4, 0] : 0,
            }}
            transition={{ duration: 0.45, repeat: active ? Infinity : 0, repeatDelay: 0.7 + index * 0.1 }}
          >
            {text}
          </motion.span>
        ))}
      </span>
    </button>
  );
}
