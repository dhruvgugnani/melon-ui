"use client";

import React, { CSSProperties, useState } from "react";
import { AnimatePresence, motion } from "framer-motion";

interface Seed {
  id: number;
  x: number;
  y: number;
}

export interface SeedwaveTextProps {
  topText?: string;
  bottomText?: string;
  seedCount?: number;
  primaryColor?: string;
  colors?: string[];
  className?: string;
  style?: CSSProperties;
}

export function SeedwaveText({
  topText = "Seed",
  bottomText = "Wave",
  seedCount = 18,
  primaryColor = "#ffffff",
  colors = ["#7fff5e", "#ff5c71", "#f7f0d2"],
  className = "",
  style,
}: SeedwaveTextProps) {
  const [seeds, setSeeds] = useState<Seed[]>([]);
  const [wave, setWave] = useState(0);

  const burst = (event: React.PointerEvent<HTMLButtonElement>) => {
    const rect = event.currentTarget.getBoundingClientRect();
    const x = event.clientX - rect.left;
    const y = event.clientY - rect.top;
    const created = Array.from({ length: seedCount }, (_, index) => ({
      id: Date.now() + index,
      x,
      y,
    }));
    setSeeds((current) => [...current.slice(-seedCount), ...created]);
    setWave((value) => value + 1);
    window.setTimeout(() => {
      setSeeds((current) => current.filter((seed) => !created.some((item) => item.id === seed.id)));
    }, 1200);
  };

  return (
    <button
      type="button"
      aria-label={`${topText} ${bottomText}`}
      onPointerDown={burst}
      className={`relative inline-block w-full max-w-[980px] cursor-pointer overflow-visible bg-transparent p-0 text-left focus:outline-none focus-visible:ring-2 focus-visible:ring-[#ff5c71] ${className}`}
      style={style}
    >
      <motion.span
        key={wave}
        className="relative z-10 block text-[clamp(4.5rem,15vw,10rem)] uppercase leading-[0.76]"
        style={{
          fontFamily: "var(--font-londrina-solid)",
          color: primaryColor,
          textShadow: "0 22px 50px rgba(255,92,113,0.18)",
        }}
        animate={{ y: [0, -12, 0], scaleY: [1, 0.92, 1] }}
        transition={{ duration: 0.42, ease: [0.16, 1, 0.3, 1] }}
      >
        {topText}
        <br />
        {bottomText}
      </motion.span>
      <AnimatePresence>
        {seeds.map((seed, index) => {
          const angle = (index / seedCount) * Math.PI * 2;
          const distance = 70 + (index % 5) * 18;
          const color = colors[index % colors.length] ?? "#ff5c71";
          return (
            <motion.span
              key={seed.id}
              className="absolute z-20 h-3 w-1.5 rounded-full"
              style={{ left: seed.x, top: seed.y, backgroundColor: color }}
              initial={{ x: 0, y: 0, rotate: 0, opacity: 1, scale: 0.3 }}
              animate={{
                x: Math.cos(angle) * distance,
                y: Math.sin(angle) * distance,
                rotate: angle * 120,
                opacity: 0,
                scale: 1,
              }}
              exit={{ opacity: 0 }}
              transition={{ duration: 0.95, ease: [0.16, 1, 0.3, 1] }}
            />
          );
        })}
      </AnimatePresence>
    </button>
  );
}
