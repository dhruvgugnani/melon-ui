"use client";

import { useMemo } from "react";
import { motion } from "framer-motion";

export interface StickerItemInput {
  label: string;
  emoji?: string;
  color?: string;
}

export interface StickerWallProps {
  stickers?: StickerItemInput[];
  stickerDensity?: number;
  scaleOnHover?: number;
  stickerTheme?: "melon" | "tech" | "mixed";
}

interface StickerItem {
  id: number;
  label: string;
  emoji?: string;
  x: number; // percentage
  y: number; // percentage
  color: string;
  rotation: number;
}

const MELON_STICKERS = [
  { label: "MELON", emoji: "🍉", color: "#ff5c71" },
  { label: "SEED", emoji: "🌱", color: "#7fff5e" },
  { label: "JUICY", emoji: "💦", color: "#e8d5b7" },
  { label: "RIND", emoji: "🍈", color: "#7fff5e" },
  { label: "PRO", emoji: "⭐", color: "#ff5c71" },
  { label: "FRESH", emoji: "🍃", color: "#e8d5b7" },
  { label: "SLICE", emoji: "🔪", color: "#ff5c71" },
  { label: "SWEET", emoji: "🍭", color: "#7fff5e" },
];

const TECH_STICKERS = [
  { label: "REACT", emoji: "⚛️", color: "#00d8ff" },
  { label: "GSAP", emoji: "⚡", color: "#7fff5e" },
  { label: "CSS", emoji: "🎨", color: "#ff5c71" },
  { label: "R3F", emoji: "📦", color: "#e8d5b7" },
  { label: "NEXT.JS", emoji: "🌐", color: "#ffffff" },
  { label: "WEBGL", emoji: "🎮", color: "#7fff5e" },
  { label: "DEV", emoji: "💻", color: "#ff5c71" },
  { label: "BUILD", emoji: "🛠️", color: "#e8d5b7" },
];

const MIXED_STICKERS = [...MELON_STICKERS, ...TECH_STICKERS];

export function StickerWall({
  stickers: customStickers,
  stickerDensity = 12,
  scaleOnHover = 1.15,
  stickerTheme = "melon",
}: StickerWallProps) {
  const stickers = useMemo(() => {
    const list: StickerItem[] = [];
    const source =
      customStickers && customStickers.length > 0
        ? customStickers
        : stickerTheme === "melon"
        ? MELON_STICKERS
        : stickerTheme === "tech"
        ? TECH_STICKERS
        : MIXED_STICKERS;

    // Use a stable pseudo-random generator
    const pseudoRand = (seed: number) => {
      const x = Math.sin(seed * 9821.123 + 4381.54) * 10000;
      return x - Math.floor(x);
    };

    const count = customStickers && customStickers.length > 0 ? customStickers.length : stickerDensity;

    for (let i = 0; i < count; i++) {
      const item = source[i % source.length];
      
      // Determine which border edge to scatter the sticker along to keep the center clear
      const edge = i % 4; // 0: Top, 1: Right, 2: Bottom, 3: Left
      let x = 0;
      let y = 0;

      const randomVal = pseudoRand(i + 1);
      const insetVal = 5 + pseudoRand(i + 2) * 8; // 5% to 13% inset from the edge

      if (edge === 0) {
        // Top edge
        x = 5 + randomVal * 90; // spread horizontally
        y = insetVal;
      } else if (edge === 1) {
        // Right edge
        x = 100 - insetVal - 12;
        y = 10 + randomVal * 80; // spread vertically
      } else if (edge === 2) {
        // Bottom edge
        x = 5 + randomVal * 90;
        y = 100 - insetVal - 10;
      } else {
        // Left edge
        x = insetVal;
        y = 10 + randomVal * 80;
      }

      const colors = ["#ff5c71", "#7fff5e", "#e8d5b7", "#1f1f1f"];
      const color = item.color || colors[Math.floor(pseudoRand(i + 3) * colors.length)];
      const rotation = (pseudoRand(i + 5) - 0.5) * 28; // -14 to 14 degrees rotation

      list.push({
        id: i,
        label: item.label,
        emoji: item.emoji,
        x,
        y,
        color,
        rotation,
      });
    }
    return list;
  }, [customStickers, stickerDensity, stickerTheme]);

  return (
    <div className="w-full h-full min-h-[350px] bg-[#050505] relative overflow-hidden p-6 select-none" style={{ border: "1px solid #111" }}>
      {/* Editorial Grid Backing */}
      <div 
        className="absolute inset-0 opacity-[0.02] pointer-events-none" 
        style={{
          backgroundImage: `
            linear-gradient(to right, #fff 1px, transparent 1px),
            linear-gradient(to bottom, #fff 1px, transparent 1px)
          `,
          backgroundSize: "40px 40px"
        }}
      />
      
      {/* Clean central area placeholder indicator */}
      <div className="absolute inset-0 flex flex-col items-center justify-center pointer-events-none px-12 text-center">
        <h1 
          className="text-2xl md:text-4xl font-black uppercase tracking-tight text-white/10" 
          style={{ fontFamily: "var(--font-Outfit), sans-serif" }}
        >
          Your Hero Title Goes Here
        </h1>
        <p className="text-[10px] font-mono uppercase tracking-[0.2em] text-[#333] mt-2">
          Stickers scattered along border bounds to preserve content layout
        </p>
      </div>

      {stickers.map((s) => (
        <motion.div
          key={s.id}
          className="absolute cursor-pointer p-2.5 rounded-[8px] border-2 border-white bg-[#0d0d0d] flex items-center gap-2 select-none"
          style={{
            left: `${s.x}%`,
            top: `${s.y}%`,
            boxShadow: `5px 5px 0px 0px ${s.color}`,
          }}
          initial={{ scale: 0, rotate: 0 }}
          animate={{ scale: 1, rotate: s.rotation }}
          transition={{
            type: "spring",
            stiffness: 260,
            damping: 20,
            delay: s.id * 0.02,
          }}
          whileHover={{
            scale: scaleOnHover,
            rotate: s.rotation + (s.rotation > 0 ? 4 : -4),
            zIndex: 50,
            boxShadow: `7px 7px 0px 0px ${s.color}`,
          }}
        >
          {s.emoji && <span className="text-sm">{s.emoji}</span>}
          <span 
            className="font-black text-[10px] tracking-wider font-mono text-[#f4f4f4]"
            style={{ fontFamily: "var(--font-Outfit), monospace" }}
          >
            {s.label}
          </span>
        </motion.div>
      ))}
    </div>
  );
}
