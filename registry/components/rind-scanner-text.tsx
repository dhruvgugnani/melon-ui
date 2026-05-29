"use client";

import React, { useState } from "react";
import { motion } from "framer-motion";

export interface RindScannerTextProps extends React.ComponentPropsWithoutRef<"button"> {
  text?: string;
  label?: string;
  baseColor?: string;
  scanColor?: string;
  accentColor?: string;
}

export function RindScannerText({
  text = "RIND",
  label = "Pointer light reveal",
  baseColor = "#f4f4f4",
  scanColor = "#7fff5e",
  accentColor = "#ff5c71",
  className = "",
  style,
  ...props
}: RindScannerTextProps) {
  const [active, setActive] = useState(false);
  const [spot, setSpot] = useState({ x: 52, y: 46 });

  const handlePointerMove = (event: React.PointerEvent<HTMLButtonElement>) => {
    const rect = event.currentTarget.getBoundingClientRect();
    setSpot({
      x: ((event.clientX - rect.left) / rect.width) * 100,
      y: ((event.clientY - rect.top) / rect.height) * 100,
    });
  };

  return (
    <button
      type="button"
      aria-label={`${label}: ${text}`}
      onPointerMove={handlePointerMove}
      onPointerEnter={() => setActive(true)}
      onPointerLeave={() => {
        setActive(false);
        setSpot({ x: 52, y: 46 });
      }}
      className={`group relative inline-flex w-full max-w-[980px] cursor-pointer flex-col overflow-visible bg-transparent p-0 text-left focus:outline-none focus-visible:ring-2 focus-visible:ring-[#7fff5e] ${className}`}
      style={style}
      {...props}
      onClick={(e) => {
        setActive((value) => !value);
        if (props.onClick) props.onClick(e);
      }}
    >
      {label && (
        <span className="mb-3 block font-mono text-[10px] uppercase tracking-[0.3em]" style={{ color: scanColor }}>
          {label}
        </span>
      )}

      <span className="relative inline-block overflow-visible">
        <motion.span
          aria-hidden="true"
          className="pointer-events-none absolute -inset-x-6 -inset-y-5 rounded-full opacity-75 blur-2xl"
          style={{
            background: `radial-gradient(circle at ${spot.x}% ${spot.y}%, ${accentColor}33, ${scanColor}24 32%, transparent 64%)`,
          }}
          animate={{ scale: active ? 1.04 : 0.92, opacity: active ? 0.9 : 0.48 }}
          transition={{ duration: 0.35, ease: [0.16, 1, 0.3, 1] }}
        />

        <motion.span
          className="relative block text-[clamp(3.6rem,12vw,8rem)] uppercase leading-[0.8]"
          style={{
            fontFamily: "var(--font-londrina-solid)",
            color: baseColor,
            textShadow: `0 18px 42px ${accentColor}1f`,
          }}
          animate={{
            y: active ? -3 : 0,
            letterSpacing: active ? "0.025em" : "0em",
          }}
          transition={{ type: "spring", stiffness: 220, damping: 20 }}
        >
          {text}
        </motion.span>

        <motion.span
          aria-hidden="true"
          className="absolute inset-0 block text-[clamp(3.6rem,12vw,8rem)] uppercase leading-[0.8]"
          style={{
            fontFamily: "var(--font-londrina-solid)",
            color: "transparent",
            backgroundImage: `
              radial-gradient(circle at ${spot.x}% ${spot.y}%, #fff 0%, ${accentColor} 28%, ${scanColor} 54%, transparent 72%),
              repeating-linear-gradient(105deg, ${scanColor} 0 8px, #163f16 8px 13px, ${accentColor} 13px 19px)
            `,
            backgroundClip: "text",
            WebkitBackgroundClip: "text",
            WebkitTextFillColor: "transparent",
            filter: `drop-shadow(0 0 18px ${scanColor}44)`,
          }}
          animate={{
            opacity: active ? 1 : 0.34,
            clipPath: active
              ? `circle(52% at ${spot.x}% ${spot.y}%)`
              : `circle(22% at ${spot.x}% ${spot.y}%)`,
          }}
          transition={{ duration: 0.32, ease: [0.16, 1, 0.3, 1] }}
        >
          {text}
        </motion.span>

        <span
          aria-hidden="true"
          className="absolute -bottom-[0.12em] left-0 h-[0.08em] w-full origin-left rounded-full opacity-80 transition-transform duration-300 group-hover:scale-x-100"
          style={{
            background: `linear-gradient(90deg, ${accentColor}, ${scanColor}, transparent)`,
            transform: active ? "scaleX(1)" : "scaleX(0.38)",
          }}
        />
      </span>
    </button>
  );
}
