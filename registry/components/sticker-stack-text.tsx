"use client";

import React, { CSSProperties, useMemo, useState } from "react";
import { motion } from "framer-motion";

export interface StickerLayer {
  label: string;
  color: string;
}

export interface StickerStackTextProps {
  layers?: StickerLayer[];
  hint?: string;
  className?: string;
  style?: CSSProperties;
}

const DEFAULT_LAYERS: StickerLayer[] = [
  { label: "LOUD", color: "#ff5c71" },
  { label: "SOFT", color: "#f7f0d2" },
  { label: "TYPE", color: "#7fff5e" },
];

export function StickerStackText({
  layers = DEFAULT_LAYERS,
  hint = "Hover to fan",
  className = "",
  style,
}: StickerStackTextProps) {
  const [open, setOpen] = useState(false);
  const prepared = useMemo(
    () =>
      layers.map((layer, index) => ({
        ...layer,
        x: [-18, 16, -4, 20, -12][index % 5],
        y: [-18, 4, 22, -8, 14][index % 5],
        rotate: [-7, 5, -2, 8, -5][index % 5],
      })),
    [layers]
  );

  return (
    <button
      type="button"
      aria-label="Sticker stack text"
      onPointerEnter={() => setOpen(true)}
      onPointerLeave={() => setOpen(false)}
      onClick={() => setOpen((value) => !value)}
      className={`relative inline-grid min-h-[clamp(13rem,34vw,21rem)] w-full max-w-[980px] cursor-pointer place-items-center overflow-visible bg-transparent p-0 focus:outline-none focus-visible:ring-2 focus-visible:ring-[#ff5c71] ${className}`}
      style={style}
    >
      {prepared.map((layer, index) => (
        <motion.span
          key={`${layer.label}-${index}`}
          className="absolute rounded-[8px] border border-black/30 px-[clamp(1rem,3vw,1.6rem)] py-[clamp(0.35rem,1vw,0.7rem)] shadow-[0_24px_48px_rgba(0,0,0,0.28)]"
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
            className="block text-[clamp(3.8rem,14vw,9rem)] uppercase leading-[0.78] text-black"
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
        </motion.span>
      ))}
      {hint && (
        <span className="absolute bottom-0 font-mono text-[10px] uppercase tracking-[0.2em] text-white/40">
          {hint}
        </span>
      )}
    </button>
  );
}
