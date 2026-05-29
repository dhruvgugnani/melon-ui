"use client";

import { useMemo } from "react";
import { motion } from "framer-motion";

export interface StickerItemInput {
  label: string;
  emoji?: string;
  color?: string;
}

export interface StickerWallProps extends React.ComponentPropsWithoutRef<"div"> {
  stickers?: StickerItemInput[] | string;
  stickerDensity?: number;
  scaleOnHover?: number;
  stickerTheme?: "melon" | "tech" | "mixed";
  bg?: string;
  borderColor?: string;
  titleText?: string;
  subtitleText?: string;
  textColor?: string;
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
  bg = "#050505",
  borderColor = "#111",
  titleText = "Your Hero Title Goes Here",
  subtitleText = "Stickers scattered along border bounds to preserve content layout",
  textColor = "rgba(255, 255, 255, 0.1)",
  className = "",
  style,
  ...props
}: StickerWallProps) {
  const stickers = useMemo(() => {
    let resolvedStickers: StickerItemInput[] = [];

    if (typeof customStickers === "string") {
      const trimmed = customStickers.trim();
      if (trimmed.startsWith("[") && trimmed.endsWith("]")) {
        try {
          resolvedStickers = JSON.parse(trimmed);
        } catch (e) {
          // fallback to comma-separated
        }
      }
      if (resolvedStickers.length === 0 && trimmed.length > 0) {
        // Parse comma-separated list of stickers, e.g. "🍉 MELON, 🌱 SEED"
        const parts = trimmed.split(",");
        resolvedStickers = parts
          .map(part => {
            const clean = part.trim();
            if (!clean) return null;
            // Match leading emoji characters like 🍉, ⚡, 💻, etc.
            const emojiMatch = clean.match(/^([\uD800-\uDBFF][\uDC00-\uDFFF]|\p{Emoji_Presentation}|\p{Emoji}\uFE0F?)\s*(.*)$/u);
            if (emojiMatch) {
              return {
                emoji: emojiMatch[1],
                label: emojiMatch[2].trim() || emojiMatch[1],
              };
            }
            return {
              label: clean,
            };
          })
          .filter(Boolean) as StickerItemInput[];
      }
    } else if (Array.isArray(customStickers)) {
      resolvedStickers = customStickers;
    }

    const source =
      resolvedStickers.length > 0
        ? resolvedStickers
        : stickerTheme === "melon"
        ? MELON_STICKERS
        : stickerTheme === "tech"
        ? TECH_STICKERS
        : MIXED_STICKERS;

    // Stable pseudo-random generator
    const pseudoRand = (seed: number) => {
      const x = Math.sin(seed * 9821.123 + 4381.54) * 10000;
      return x - Math.floor(x);
    };

    const count = resolvedStickers.length > 0 ? resolvedStickers.length : stickerDensity;
    const list: StickerItem[] = [];

    for (let i = 0; i < count; i++) {
      const item = source[i % source.length];
      const edge = i % 4; // 0: Top, 1: Right, 2: Bottom, 3: Left
      let x = 0;
      let y = 0;

      const randomVal = pseudoRand(i + 1);
      const insetVal = 5 + pseudoRand(i + 2) * 8; // 5% to 13% inset from edges

      if (edge === 0) {
        x = 5 + randomVal * 90;
        y = insetVal;
      } else if (edge === 1) {
        x = 100 - insetVal - 15;
        y = 10 + randomVal * 80;
      } else if (edge === 2) {
        x = 5 + randomVal * 90;
        y = 100 - insetVal - 15;
      } else {
        x = insetVal;
        y = 10 + randomVal * 80;
      }

      const colors = ["#ff5c71", "#7fff5e", "#e8d5b7", "#444444"];
      const color = item.color || colors[Math.floor(pseudoRand(i + 3) * colors.length)];
      const rotation = (pseudoRand(i + 5) - 0.5) * 28; // -14 to 14 deg

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
    <div 
      className={`w-full h-full min-h-[350px] relative overflow-hidden p-6 select-none ${className}`}
      style={{
        border: `1px solid ${borderColor}`,
        backgroundColor: bg,
        ...style
      }}
      {...props}
    >
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
        {titleText && (
          <h1 
            className="text-2xl md:text-4xl font-black uppercase tracking-tight" 
            style={{ 
              fontFamily: "var(--font-Outfit), sans-serif",
              color: textColor 
            }}
          >
            {titleText}
          </h1>
        )}
        {subtitleText && (
          <p className="text-[10px] font-mono uppercase tracking-[0.2em] text-white/20 mt-2">
            {subtitleText}
          </p>
        )}
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
          initial={{ scale: 0, rotate: 0, y: 0 }}
          animate={{
            scale: 1,
            rotate: s.rotation,
            y: [0, -6, 0],
          }}
          transition={{
            y: {
              repeat: Infinity,
              repeatType: "reverse",
              duration: 2.2 + (s.id % 3) * 0.8,
              ease: "easeInOut",
            },
            scale: {
              type: "spring",
              stiffness: 260,
              damping: 20,
              delay: s.id * 0.02,
            },
            rotate: {
              type: "spring",
              stiffness: 260,
              damping: 20,
              delay: s.id * 0.02,
            }
          }}
          whileHover={{
            scale: scaleOnHover,
            rotate: s.rotation + (s.rotation > 0 ? 6 : -6),
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
