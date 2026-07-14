"use client";

import React, { useRef, useState, useEffect } from "react";
import { motion, useMotionValue, useSpring, useTransform } from "framer-motion";

export interface HyperMagnetCardProps {
  title?: string;
  subtitle?: string;
  stickerText?: string;
  primaryColor?: string;
  accentColor?: string;
  bg?: string;
  width?: number | string;
  height?: number | string;
  className?: string;
  style?: React.CSSProperties;
}

function HyperMagnetCard({
  title = "HYPER",
  subtitle = "MAGNETIC STICKER",
  stickerText = "100% PURE",
  primaryColor = "#7fff5e",
  accentColor = "#ff5c71",
  bg = "#050505",
  width = 340,
  height = 420,
  className = "",
  style,
}: HyperMagnetCardProps) {
  const containerRef = useRef<HTMLDivElement>(null);
  const [isHovered, setIsHovered] = useState(false);
  const [mounted, setMounted] = useState(false);

  useEffect(() => {
    const t = setTimeout(() => setMounted(true), 0);
    return () => clearTimeout(t);
  }, []);

  const mouseX = useMotionValue(0);
  const mouseY = useMotionValue(0);

  const springConfig = { damping: 20, stiffness: 150, mass: 0.5 };
  const smoothX = useSpring(mouseX, springConfig);
  const smoothY = useSpring(mouseY, springConfig);

  const stickerX = useSpring(mouseX, { damping: 12, stiffness: 200, mass: 0.8 });
  const stickerY = useSpring(mouseY, { damping: 12, stiffness: 200, mass: 0.8 });

  const handleMouseMove = (e: React.MouseEvent<HTMLDivElement>) => {
    if (!containerRef.current) return;
    const { left, top, width, height } = containerRef.current.getBoundingClientRect();

    const x = (e.clientX - left) / width - 0.5;
    const y = (e.clientY - top) / height - 0.5;

    mouseX.set(x);
    mouseY.set(y);
  };

  const handleMouseLeave = () => {
    setIsHovered(false);
    mouseX.set(0);
    mouseY.set(0);
  };

  const handleMouseEnter = () => setIsHovered(true);

  const stickerTranslateX = useTransform(stickerX, [-0.5, 0.5], [-120, 120]);
  const stickerTranslateY = useTransform(stickerY, [-0.5, 0.5], [-120, 120]);
  const stickerRotate = useTransform(stickerX, [-0.5, 0.5], [-20, 20]);

  const ambientGlow = useTransform(
    [smoothX, smoothY],
    ([x, y]: number[]) => `radial-gradient(circle at ${(x + 0.5) * 100}% ${(y + 0.5) * 100}%, ${primaryColor}40, transparent 60%)`
  );

  const sheenPosition = useTransform(stickerX, [-0.5, 0.5], ["100% 0", "0 0"]);

  if (!mounted) return <div style={{ width, height, ...style }} className={className} />;

  return (
    <motion.div
      ref={containerRef}
      onMouseMove={handleMouseMove}
      onMouseLeave={handleMouseLeave}
      onMouseEnter={handleMouseEnter}
      className={`relative perspective-[1200px] cursor-crosshair group ${className}`}
      style={{ width, height, ...style }}
    >
      <motion.div
        className="w-full h-full relative rounded-2xl border border-white/10 overflow-hidden"
        style={{
          background: bg,
          boxShadow: isHovered ? `0 20px 40px -10px ${primaryColor}20` : "0 10px 30px -10px rgba(0,0,0,0.5)",
          rotateX: useTransform(smoothY, [-0.5, 0.5], [15, -15]),
          rotateY: useTransform(smoothX, [-0.5, 0.5], [-15, 15]),
          transformStyle: "preserve-3d",
        }}
        transition={{ type: "spring", stiffness: 300, damping: 20 }}
      >
        <motion.div
          className="absolute inset-0 z-0 opacity-50 transition-opacity duration-300"
          style={{ background: ambientGlow, opacity: isHovered ? 1 : 0.4 }}
        />

        <div className="absolute inset-0 z-0 opacity-20 pointer-events-none mix-blend-overlay">
          <svg viewBox="0 0 200 200" xmlns="http://www.w3.org/2000/svg" width="100%" height="100%">
            <filter id="noiseFilter">
              <feTurbulence type="fractalNoise" baseFrequency="0.85" numOctaves="3" stitchTiles="stitch" />
            </filter>
            <rect width="100%" height="100%" filter="url(#noiseFilter)" />
          </svg>
        </div>

        <div className="absolute bottom-6 left-6 z-10 flex flex-col pointer-events-none">
          <h3 className="font-outfit text-3xl font-black text-white leading-none tracking-tight">
            {title}
          </h3>
          <p className="font-mono text-xs mt-2 uppercase tracking-widest" style={{ color: accentColor }}>
            {subtitle}
          </p>
        </div>

        <motion.div
          className="absolute top-1/2 left-1/2 flex items-center justify-center z-20 pointer-events-none"
          style={{
            x: stickerTranslateX,
            y: stickerTranslateY,
            rotate: stickerRotate,
            marginLeft: "-60px",
            marginTop: "-30px",
          }}
        >
          <motion.div
            className="w-[120px] h-[60px] rounded-xl flex items-center justify-center relative overflow-hidden backdrop-blur-md"
            style={{
              background: `linear-gradient(135deg, ${primaryColor}cc, ${primaryColor}88)`,
              border: `1px solid ${primaryColor}aa`,
              boxShadow: `0 10px 20px -5px ${primaryColor}60`,
            }}
          >
            <motion.div
              className="absolute inset-0 z-0 opacity-40"
              style={{
                background: "linear-gradient(115deg, transparent 20%, rgba(255,255,255,0.8) 45%, transparent 70%)",
                backgroundSize: "200% 100%",
                backgroundPosition: sheenPosition,
              }}
            />

            <div
              className="absolute inset-0 z-0 opacity-10 mix-blend-overlay pointer-events-none"
              style={{ backgroundImage: "repeating-linear-gradient(0deg, transparent, transparent 2px, black 2px, black 4px)" }}
            />

            <span className="font-londrina text-lg tracking-wider text-black z-10 drop-shadow-sm">
              {stickerText}
            </span>

            <div className="absolute top-1.5 left-1.5 w-1 h-1 rounded-full bg-black/40 z-10" />
            <div className="absolute top-1.5 right-1.5 w-1 h-1 rounded-full bg-black/40 z-10" />
            <div className="absolute bottom-1.5 left-1.5 w-1 h-1 rounded-full bg-black/40 z-10" />
            <div className="absolute bottom-1.5 right-1.5 w-1 h-1 rounded-full bg-black/40 z-10" />
          </motion.div>
        </motion.div>

        <div className="absolute inset-0 z-0 opacity-10 pointer-events-none flex items-center justify-center">
            <div className="w-[80%] h-[80%] border border-dashed border-white rounded-full opacity-30" />
            <div className="absolute w-[2px] h-[120%] bg-white/20 rotate-45 mix-blend-overlay" />
            <div className="absolute w-[2px] h-[120%] bg-white/20 -rotate-45 mix-blend-overlay" />
        </div>

        <div className="absolute top-4 left-4 z-10 font-mono text-[9px] text-white/40 flex items-center gap-2">
            <div className="w-1.5 h-1.5 rounded-full bg-green-400" />
            <span>SYS_REQ: VALID</span>
        </div>

      </motion.div>
    </motion.div>
  );
}

export default HyperMagnetCard;
