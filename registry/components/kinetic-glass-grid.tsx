"use client";

import React, { useRef } from "react";
import { motion, useMotionValue, useSpring, useTransform, MotionValue } from "framer-motion";

const MAX_DISTANCE = 250;

interface TileProps {
  mouseX: MotionValue<number>;
  mouseY: MotionValue<number>;
  index: number;
  primaryColor: string;
  accentColor: string;
}

const Tile: React.FC<TileProps> = ({ mouseX, mouseY, primaryColor, accentColor }) => {
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
    ["rgba(255, 255, 255, 0.05)", `${primaryColor}cc`]
  );

  const boxShadow = useTransform(
    glow,
    [0, 1],
    ["0px 0px 0px rgba(0,0,0,0)", `0px 0px 30px ${primaryColor}66`]
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
        style={{ scale: glow, backgroundColor: accentColor }}
        className="w-1.5 h-1.5 rounded-full"
      />
    </motion.div>
  );
};

export interface KineticGlassGridProps extends React.ComponentPropsWithoutRef<"div"> {
  gridSize?: number;
  primaryColor?: string;
  accentColor?: string;
  bg?: string;
}

export const KineticGlassGrid: React.FC<KineticGlassGridProps> = ({
  gridSize = 8,
  primaryColor = "#ff5c71",
  accentColor = "#7fff5e",
  bg = "#050505",
  className = "",
  style,
  ...props
}) => {
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
      className={`relative w-full h-[600px] overflow-hidden flex items-center justify-center p-8 [perspective:1000px] ${className}`}
      style={{
        backgroundColor: bg,
        ...style
      }}
      {...props}
    >
      {/* Ambient background glow */}
      <div 
        className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[300px] h-[300px] rounded-full blur-[100px] pointer-events-none" 
        style={{ backgroundColor: `${primaryColor}33` }}
      />
      <div 
        className="absolute top-1/3 left-1/3 -translate-x-1/2 -translate-y-1/2 w-[200px] h-[200px] rounded-full blur-[80px] pointer-events-none" 
        style={{ backgroundColor: `${accentColor}33` }}
      />

      {/* Grid container */}
      <motion.div
        className="grid gap-4 z-10"
        style={{
          gridTemplateColumns: `repeat(${gridSize}, minmax(0, 1fr))`,
          width: "100%",
          maxWidth: "600px",
          transformStyle: "preserve-3d",
          rotateX: 10,
          rotateZ: -5,
        }}
      >
        {Array.from({ length: gridSize * gridSize }).map((_, i) => (
          <Tile 
            key={i} 
            index={i} 
            mouseX={mouseX} 
            mouseY={mouseY} 
            primaryColor={primaryColor} 
            accentColor={accentColor} 
          />
        ))}
      </motion.div>

      {/* Overlay vignette to blend grid edges into background */}
      <div 
        className="absolute inset-0 pointer-events-none" 
        style={{
          boxShadow: `inset 0 0 100px 40px ${bg}`
        }}
      />
    </div>
  );
};
