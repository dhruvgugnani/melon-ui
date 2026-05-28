"use client";

import { useMemo } from "react";
import { motion } from "framer-motion";

export interface StickerWallProps {
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
  shadowColor: string;
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
  stickerDensity = 12,
  scaleOnHover = 1.15,
  stickerTheme = "melon",
}: StickerWallProps) {
  const stickers = useMemo(() => {
    const list: StickerItem[] = [];
    const source =
      stickerTheme === "melon"
        ? MELON_STICKERS
        : stickerTheme === "tech"
        ? TECH_STICKERS
        : MIXED_STICKERS;

    // Use a simple pseudo-random generator based on index to keep positions stable
    const pseudoRand = (seed: number) => {
      const x = Math.sin(seed * 9821.123 + 4381.54) * 10000;
      return x - Math.floor(x);
    };

    for (let i = 0; i < stickerDensity; i++) {
      const item = source[i % source.length];
      
      // Calculate coordinates to avoid overlapping too heavily in the center
      const angle = (i / stickerDensity) * Math.PI * 2;
      const radiusX = 15 + pseudoRand(i + 1) * 30; // 15% to 45% radius
      const radiusY = 15 + pseudoRand(i + 2) * 25;
      
      const x = 50 + Math.cos(angle) * radiusX - 8; // center + polar offset
      const y = 50 + Math.sin(angle) * radiusY - 8;

      const colors = ["#ff5c71", "#7fff5e", "#e8d5b7", "#0a0a0a"];
      const shadowColors = ["rgba(255,92,113,0.35)", "rgba(127,255,94,0.35)", "rgba(232,213,183,0.25)"];
      
      const color = item.color || colors[Math.floor(pseudoRand(i + 3) * colors.length)];
      const shadowColor = shadowColors[Math.floor(pseudoRand(i + 4) * shadowColors.length)];
      const rotation = (pseudoRand(i + 5) - 0.5) * 35; // -17.5 to 17.5 degrees

      list.push({
        id: i,
        label: item.label,
        emoji: item.emoji,
        x,
        y,
        color,
        shadowColor,
        rotation,
      });
    }
    return list;
  }, [stickerDensity, stickerTheme]);

  return (
    <div className="w-full h-full min-h-[300px] bg-[#050505] relative overflow-hidden p-6 select-none" style={{ border: "1px solid #111" }}>
      {/* Background Grid Pattern */}
      <div 
        className="absolute inset-0 opacity-[0.02] pointer-events-none" 
        style={{
          backgroundImage: `radial-gradient(#ffffff 1px, transparent 1px)`,
          backgroundSize: "20px 20px"
        }}
      />
      
      <div className="absolute inset-0 flex items-center justify-center pointer-events-none">
        <span className="font-mono text-[9px] uppercase tracking-[0.3em] text-[#333]">Sticker Wall Playground</span>
      </div>

      {stickers.map((s) => (
        <motion.div
          key={s.id}
          className="absolute cursor-pointer p-2.5 rounded-[8px] border-2 border-white bg-[#0d0d0d] flex items-center gap-2 select-none"
          style={{
            left: `${s.x}%`,
            top: `${s.y}%`,
            backgroundColor: "#0d0d0d",
            boxShadow: `5px 5px 0px 0px ${s.color}`,
          }}
          initial={{ scale: 0, rotate: 0 }}
          animate={{ scale: 1, rotate: s.rotation }}
          transition={{
            type: "spring",
            stiffness: 260,
            damping: 20,
            delay: s.id * 0.03,
          }}
          whileHover={{
            scale: scaleOnHover,
            rotate: s.rotation + (s.rotation > 0 ? 5 : -5),
            zIndex: 50,
            boxShadow: `8px 8px 0px 0px ${s.color}`,
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
