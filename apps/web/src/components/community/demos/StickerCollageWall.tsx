"use client";

import React, { useState, useEffect } from "react";
import { motion } from "framer-motion";

interface StickerProps {
  x: number;
  y: number;
  rotation: number;
  scale: number;
  imageUrl: string;
  delay: number;
  zIndex: number;
}

export interface StickerCollageWallProps extends React.ComponentPropsWithoutRef<"div"> {
  bg?: string;
  gridOpacity?: number;
  stickerScaleMultiplier?: number;
  dragFree?: boolean;
  titleText?: string;
  primaryColor?: string;
  secondaryColor?: string;
  accentColor?: string;
}

export const StickerCollageWall: React.FC<StickerCollageWallProps> = ({
  bg = "#e5e5e5",
  gridOpacity = 0.2,
  stickerScaleMultiplier = 1.0,
  dragFree = true,
  titleText = "",
  primaryColor = "#ff5c71",
  secondaryColor = "#7fff5e",
  accentColor = "#000000",
  className = "",
  style,
  children,
  ...props
}) => {
  const [stickers, setStickers] = useState<StickerProps[]>([]);
  const [isMounted, setIsMounted] = useState(false);

  useEffect(() => {
    const timeout = setTimeout(() => setIsMounted(true), 0);
    // Deterministic pseudo-random generation for SSR compatibility
    const predefinedStickers = [
      { x: 10, y: 20, r: -15, s: 1.2, z: 1 },
      { x: 70, y: 15, r: 10, s: 0.9, z: 2 },
      { x: 40, y: 50, r: -5, s: 1.5, z: 3 },
      { x: 80, y: 60, r: 25, s: 1.1, z: 4 },
      { x: 20, y: 70, r: -20, s: 1.3, z: 5 },
      { x: 50, y: 85, r: 5, s: 1, z: 6 },
    ];

    const generateStickers = predefinedStickers.map((pos, i) => ({
      x: pos.x,
      y: pos.y,
      rotation: pos.r,
      scale: pos.s * stickerScaleMultiplier,
      // Placeholder abstract shapes for stickers to avoid external image dependencies
      imageUrl: `https://picsum.photos/seed/${i * 100}/200/200`,
      delay: i * 0.1,
      zIndex: pos.z,
    }));

    const stickersTimeout = setTimeout(() => setStickers(generateStickers), 0);
    return () => {
      clearTimeout(timeout);
      clearTimeout(stickersTimeout);
    };
  }, [stickerScaleMultiplier]);

  if (!isMounted) return <div className="w-full h-[600px] bg-[#f0f0f0]" />;

  return (
    <div 
      className={`relative w-full h-[600px] overflow-hidden rounded-xl flex items-center justify-center ${className}`}
      style={{
        backgroundColor: bg,
        ...style
      }}
      {...props}
    >
      {/* Background Paper Texture */}
      <div
        className="absolute inset-0 opacity-40 mix-blend-multiply pointer-events-none"
        style={{ backgroundImage: "url('https://grainy-gradients.vercel.app/noise.svg')" }}
      />

      {/* Grid pattern overlay */}
      <div
        className="absolute inset-0 pointer-events-none"
        style={{
          opacity: gridOpacity,
          backgroundImage: "linear-gradient(#000 1px, transparent 1px), linear-gradient(90deg, #000 1px, transparent 1px)",
          backgroundSize: "40px 40px"
        }}
      />

      {/* Stickers */}
      {stickers.map((sticker, i) => (
        <motion.div
          key={i}
          initial={{ opacity: 0, scale: 0, rotate: sticker.rotation - 30 }}
          animate={{ opacity: 1, scale: sticker.scale, rotate: sticker.rotation }}
          transition={{
            type: "spring",
            stiffness: 260,
            damping: 20,
            delay: sticker.delay,
          }}
          whileHover={{
            scale: sticker.scale * 1.1,
            rotate: sticker.rotation + (i % 2 === 0 ? 10 : -10),
            zIndex: 50,
            boxShadow: "0px 20px 25px -5px rgba(0, 0, 0, 0.3)",
          }}
          whileTap={{ scale: sticker.scale * 0.95 }}
          className="absolute origin-center cursor-grab active:cursor-grabbing"
          style={{
            left: `${sticker.x}%`,
            top: `${sticker.y}%`,
            zIndex: sticker.zIndex,
            // Torn paper styling
            filter: "drop-shadow(2px 4px 6px rgba(0,0,0,0.15))",
          }}
          drag={dragFree}
          dragConstraints={{ left: -50, right: 50, top: -50, bottom: 50 }}
        >
          <div className="relative p-2 bg-white rounded-sm transform-gpu">
             {/* Masking tape effect */}
             {i % 2 === 0 && (
                <div className="absolute -top-3 left-1/2 -translate-x-1/2 w-12 h-6 bg-white/60 backdrop-blur-sm -rotate-3 border border-white/20 shadow-sm z-10" />
             )}

             {/* Sticker Content - Abstract gradient blocks instead of external images for reliability */}
             <div
                className="w-32 h-32 md:w-40 md:h-40 rounded-sm"
                style={{
                  background: i % 3 === 0
                    ? `linear-gradient(135deg, ${primaryColor}, #ff8a98)`
                    : i % 3 === 1
                      ? `linear-gradient(135deg, ${secondaryColor}, #aaff99)`
                      : `linear-gradient(135deg, ${accentColor}, #333333)`,
                  maskImage: i % 2 === 0 ? "radial-gradient(circle, black 50%, transparent 100%)" : "none",
                  WebkitMaskImage: i % 2 === 0 ? "radial-gradient(circle, black 80%, transparent 100%)" : "none",
                }}
             >
                <div className="w-full h-full flex items-center justify-center font-black text-4xl text-white/50 mix-blend-overlay" style={{ fontFamily: "var(--font-londrina-solid)" }}>
                  #{i + 1}
                </div>
             </div>
          </div>
        </motion.div>
      ))}

      {/* Optional Foreground Card or Custom Children */}
      {children ? (
        <div className="relative z-10">{children}</div>
      ) : titleText ? (
        <div className="relative z-0 pointer-events-none flex flex-col items-center">
          <h2 className="text-5xl md:text-7xl font-black text-[#111] uppercase tracking-tighter mix-blend-color-burn" style={{ fontFamily: "var(--font-londrina-solid)" }}>
            {titleText}
          </h2>
        </div>
      ) : null}
    </div>
  );
};
