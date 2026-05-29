"use client";

import React, { useRef } from "react";
import { motion, useMotionValue, useSpring, useTransform } from "framer-motion";

const GRID_SIZE = 8;
const MAX_DISTANCE = 250;

interface TileProps {
  mouseX: import("framer-motion").MotionValue<number>;
  mouseY: import("framer-motion").MotionValue<number>;
  index: number;
}

const Tile: React.FC<TileProps> = ({ mouseX, mouseY }) => {
  const tileRef = useRef<HTMLDivElement>(null);

  // Derive distance from mouse to the center of this tile
  const distance = useTransform([mouseX, mouseY], ([latestX, latestY]) => {
    if (!tileRef.current) return MAX_DISTANCE;

    // We use a safe default if ref isn't attached yet
    const rect = tileRef.current.getBoundingClientRect();
    const centerX = rect.left + rect.width / 2;
    const centerY = rect.top + rect.height / 2;

    const dx = (latestX as number) - centerX;
    const dy = (latestY as number) - centerY;

    return Math.sqrt(dx * dx + dy * dy);
  });

  // Calculate scaling and transform effects based on distance
  // Tiles closer to the cursor scale up and lift
  const scaleRaw = useTransform(distance, [0, MAX_DISTANCE], [1.3, 1]);
  const scale = useSpring(scaleRaw, { stiffness: 300, damping: 20 });

  const zRaw = useTransform(distance, [0, MAX_DISTANCE], [40, 0]);
  const z = useSpring(zRaw, { stiffness: 300, damping: 20 });

  const opacityRaw = useTransform(distance, [0, MAX_DISTANCE], [1, 0.4]);
  const opacity = useSpring(opacityRaw, { stiffness: 300, damping: 30 });

  // Border glow intensity based on proximity
  const glowRaw = useTransform(distance, [0, MAX_DISTANCE / 2], [1, 0]);
  const glow = useSpring(glowRaw, { stiffness: 300, damping: 30 });
  const borderColor = useTransform(
    glow,
    [0, 1],
    ["rgba(255, 255, 255, 0.05)", "rgba(255, 92, 113, 0.8)"] // #ff5c71 glow
  );

  const boxShadow = useTransform(
    glow,
    [0, 1],
    ["0px 0px 0px rgba(0,0,0,0)", "0px 0px 30px rgba(255, 92, 113, 0.4)"]
  );

  return (
    <motion.div
      ref={tileRef}
      style={{
        scale,
        z,
        opacity,
        borderColor,
        boxShadow,
      }}
      className="relative flex items-center justify-center rounded-xl bg-white/5 backdrop-blur-md border border-white/5 transition-colors duration-200 aspect-square"
    >
      {/* Subtle inner noise texture */}
      <div className="absolute inset-0 rounded-xl opacity-20 pointer-events-none mix-blend-overlay bg-[url('https://grainy-gradients.vercel.app/noise.svg')]" />

      {/* Decorative dot in the center */}
      <motion.div
        style={{ scale: glow }}
        className="w-1.5 h-1.5 rounded-full bg-[#7fff5e]"
      />
    </motion.div>
  );
};

export const KineticGlassGrid: React.FC = () => {
  const mouseX = useMotionValue(typeof window !== "undefined" ? window.innerWidth / 2 : 0);
  const mouseY = useMotionValue(typeof window !== "undefined" ? window.innerHeight / 2 : 0);
  const containerRef = useRef<HTMLDivElement>(null);

  const handleMouseMove = (e: React.MouseEvent) => {
    mouseX.set(e.clientX);
    mouseY.set(e.clientY);
  };

  const handleMouseLeave = () => {
    // Reset to center of the container or off-screen
    if (containerRef.current) {
      const rect = containerRef.current.getBoundingClientRect();
      mouseX.set(rect.left + rect.width / 2);
      mouseY.set(rect.top + rect.height / 2);
    }
  };

  return (
    <div
      ref={containerRef}
      onMouseMove={handleMouseMove}
      onMouseLeave={handleMouseLeave}
      className="relative w-full h-[600px] bg-[#050505] overflow-hidden flex items-center justify-center p-8 [perspective:1000px]"
    >
      {/* Ambient background glow */}
      <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[300px] h-[300px] bg-[#ff5c71]/20 rounded-full blur-[100px] pointer-events-none" />
      <div className="absolute top-1/3 left-1/3 -translate-x-1/2 -translate-y-1/2 w-[200px] h-[200px] bg-[#7fff5e]/20 rounded-full blur-[80px] pointer-events-none" />

      {/* Grid container */}
      <motion.div
        className="grid gap-4 z-10"
        style={{
          gridTemplateColumns: `repeat(${GRID_SIZE}, minmax(0, 1fr))`,
          width: "100%",
          maxWidth: "600px",
          transformStyle: "preserve-3d",
          rotateX: 10,
          rotateZ: -5,
        }}
      >
        {Array.from({ length: GRID_SIZE * GRID_SIZE }).map((_, i) => (
          <Tile key={i} index={i} mouseX={mouseX} mouseY={mouseY} />
        ))}
      </motion.div>

      {/* Overlay vignette to blend grid edges into background */}
      <div className="absolute inset-0 pointer-events-none shadow-[inset_0_0_100px_40px_#050505]" />
    </div>
  );
};
