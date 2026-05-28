"use client";

import React, { CSSProperties, useMemo, useState } from "react";
import { motion } from "framer-motion";

export interface StickerLayer {
  label: string;
  color: string;
}

export interface StickerStackTextProps {
  layers?: StickerLayer[];
  topText?: string;
  middleText?: string;
  bottomText?: string;
  topColor?: string;
  middleColor?: string;
  bottomColor?: string;
  hint?: string;
  className?: string;
  style?: CSSProperties;
}

export function StickerStackText({
  layers,
  topText = "LOUD",
  middleText = "SOFT",
  bottomText = "TYPE",
  topColor = "#ff5c71",
  middleColor = "#f7f0d2",
  bottomColor = "#7fff5e",
  hint = "Hover to fan",
  className = "",
  style,
}: StickerStackTextProps) {
  const [open, setOpen] = useState(false);
  const prepared = useMemo(
    () => {
      const source = layers ?? [
        { label: topText, color: topColor },
        { label: middleText, color: middleColor },
        { label: bottomText, color: bottomColor },
      ];

      return source.map((layer, index) => ({
        ...layer,
        x: [-92, 0, 92, 38, -38][index % 5],
        y: [-28, 2, 32, -50, 54][index % 5],
        rotate: [-7, 2, 7, 9, -9][index % 5],
        openX: [-148, 0, 148, 82, -82][index % 5],
        openY: [-44, -4, 44, -78, 78][index % 5],
        openRotate: [-11, 0, 11, 14, -14][index % 5],
      }));
    },
    [layers, topText, middleText, bottomText, topColor, middleColor, bottomColor]
  );

  return (
    <button
      type="button"
      aria-label="Sticker stack text"
      onPointerEnter={() => setOpen(true)}
      onPointerLeave={() => setOpen(false)}
      onClick={() => setOpen((value) => !value)}
      className={`relative inline-grid min-h-[clamp(14rem,34vw,21rem)] w-full max-w-[980px] cursor-pointer place-items-center overflow-visible bg-transparent p-0 focus:outline-none focus-visible:ring-2 focus-visible:ring-[#ff5c71] ${className}`}
      style={style}
    >
      {prepared.map((layer, index) => (
        <motion.span
          key={`${layer.label}-${index}`}
          className="absolute rounded-[8px] border border-black/30 px-[clamp(0.75rem,2vw,1.2rem)] py-[clamp(0.35rem,1vw,0.62rem)] shadow-[0_24px_48px_rgba(0,0,0,0.28)]"
          style={{ backgroundColor: layer.color, zIndex: index + 1 }}
          initial={false}
          animate={{
            x: open ? layer.openX : layer.x,
            y: open ? layer.openY : layer.y,
            rotate: open ? layer.openRotate : layer.rotate,
            scale: open ? 1.04 + index * 0.025 : 0.96 + index * 0.015,
          }}
          transition={{ type: "spring", stiffness: 260, damping: 20, delay: index * 0.025 }}
        >
          <span
            className="block text-[clamp(2.8rem,10vw,7rem)] uppercase leading-[0.78] text-black"
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
