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

export function RindScannerText({
  text = "SCANNER",
  label = "Readable scan reveal",
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
      <span className="relative block min-h-[clamp(5rem,12vw,8rem)] w-full overflow-hidden">
        <motion.span
          aria-hidden="true"
          className="pointer-events-none absolute inset-y-0 z-30 w-[3px] rounded-full"
          style={{
            left: 0,
            background: `linear-gradient(180deg, transparent, ${scanColor}, ${accentColor}, transparent)`,
            boxShadow: `0 0 18px ${scanColor}, 0 0 44px ${scanColor}66`,
          }}
          animate={{ left: active ? ["0%", "100%"] : "0%" }}
          transition={{ duration: 1.1, ease: [0.16, 1, 0.3, 1], repeat: active ? Infinity : 0, repeatDelay: 0.32 }}
        />
        <motion.span
          aria-hidden="true"
          className="pointer-events-none absolute inset-y-0 z-20 w-24 rounded-full blur-xl"
          style={{
            left: 0,
            background: `linear-gradient(90deg, transparent, ${scanColor}66, transparent)`,
          }}
          animate={{ left: active ? ["-12%", "96%"] : "-18%" }}
          transition={{ duration: 1.1, ease: [0.16, 1, 0.3, 1], repeat: active ? Infinity : 0, repeatDelay: 0.32 }}
        />
        <span
          aria-hidden="true"
          className="absolute inset-x-0 top-[12%] h-px opacity-70"
          style={{
            background: `linear-gradient(90deg, transparent, ${scanColor}77, transparent)`,
          }}
        />
        <span
          aria-hidden="true"
          className="absolute inset-x-0 bottom-[18%] h-px opacity-60"
          style={{
            background: `linear-gradient(90deg, transparent, ${scanColor}88, ${accentColor}66, transparent)`,
          }}
        />
        <span className="sr-only">{text}</span>
        <motion.span
          aria-hidden="true"
          className="absolute inset-0 block text-[clamp(3.3rem,11vw,7.6rem)] uppercase leading-[0.84]"
          style={{
            fontFamily: "var(--font-londrina-solid)",
            color: baseColor,
            textShadow: `0 18px 40px ${accentColor}22`,
          }}
          animate={{
            letterSpacing: active ? "0.035em" : "0em",
            filter: active ? "brightness(1.08)" : "brightness(1)",
          }}
          transition={{ duration: 0.35, ease: [0.16, 1, 0.3, 1] }}
        >
          {text}
        </motion.span>
        <motion.span
          aria-hidden="true"
          className="absolute inset-0 block overflow-hidden text-[clamp(3.3rem,11vw,7.6rem)] uppercase leading-[0.84]"
          style={{
            fontFamily: "var(--font-londrina-solid)",
            color: scanColor,
            textShadow: `0 0 28px ${scanColor}77`,
          }}
          initial={false}
          animate={{
            clipPath: active
              ? ["inset(0 100% 0 0)", "inset(0 0% 0 0)", "inset(0 0% 0 100%)"]
              : "inset(0 100% 0 0)",
          }}
          transition={{ duration: 1.2, ease: [0.16, 1, 0.3, 1], repeat: active ? Infinity : 0, repeatDelay: 0.35 }}
        >
          {text}
        </motion.span>
      </span>
    </button>
  );
}
