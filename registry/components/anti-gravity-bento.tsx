"use client";

import React, { useRef, useState, useEffect } from "react";
import { motion, useMotionValue, useSpring, useTransform, AnimatePresence } from "framer-motion";

export interface AntiGravityBentoProps {
  width?: string | number;
  height?: string | number;
  bg?: string;
  borderColor?: string;
  items?: React.ReactNode[];
  spotlightColor?: string;
  className?: string;
  style?: React.CSSProperties;
}

const DEFAULT_ITEMS = [
  <div key="1" className="h-full w-full bg-[#111] rounded-xl border border-white/10 flex items-center justify-center overflow-hidden">
    <div className="w-8 h-8 rounded-full bg-[#ff5c71] blur-md absolute opacity-50 mix-blend-screen" />
    <span className="text-white font-['Outfit'] font-bold text-lg relative z-10">SYS_01</span>
  </div>,
  <div key="2" className="h-full w-full bg-[#111] rounded-xl border border-white/10 flex items-center justify-center overflow-hidden">
    <div className="w-12 h-[2px] bg-[#7fff5e] rotate-45" />
    <div className="w-12 h-[2px] bg-[#7fff5e] -rotate-45 absolute" />
  </div>,
  <div key="3" className="h-full w-full bg-[#111] rounded-xl border border-white/10 p-4 flex flex-col justify-between">
    <div className="w-4 h-4 rounded-full border border-[#00f0ff] animate-pulse" />
    <span className="text-[#00f0ff] font-mono text-xs">DATA.SYNC</span>
  </div>,
  <div key="4" className="h-full w-full bg-[#111] rounded-xl border border-white/10 flex items-center justify-center relative">
    <svg className="w-1/2 h-1/2 text-white/20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
      <path strokeLinecap="round" strokeLinejoin="round" d="M13 10V3L4 14h7v7l9-11h-7z" />
    </svg>
    <div className="absolute inset-0 bg-gradient-to-tr from-transparent via-white/5 to-transparent opacity-0 hover:opacity-100 transition-opacity" />
  </div>
];

export const AntiGravityBento: React.FC<AntiGravityBentoProps> = ({
  width = 400,
  height = 400,
  bg = "rgba(10, 10, 10, 0.6)",
  borderColor = "rgba(255, 255, 255, 0.1)",
  items = DEFAULT_ITEMS,
  spotlightColor = "rgba(255, 92, 113, 0.15)",
  className = "",
  style
}) => {
  const containerRef = useRef<HTMLDivElement>(null);
  const [isHovered, setIsHovered] = useState(false);
  const [mounted, setMounted] = useState(false);

  useEffect(() => {
    const timeout = setTimeout(() => setMounted(true), 0);
    return () => clearTimeout(timeout);
  }, []);

  // Mouse position for spotlight and 3D tilt
  const mouseX = useMotionValue(0);
  const mouseY = useMotionValue(0);

  // Smooth mouse values
  const smoothX = useSpring(mouseX, { stiffness: 300, damping: 30 });
  const smoothY = useSpring(mouseY, { stiffness: 300, damping: 30 });

  // 3D Tilt transforms
  const rotateX = useTransform(smoothY, [-0.5, 0.5], [10, -10]);
  const rotateY = useTransform(smoothX, [-0.5, 0.5], [-10, 10]);

  // Spotlight radial gradient
  const spotlightX = useTransform(smoothX, [-0.5, 0.5], ["0%", "100%"]);
  const spotlightY = useTransform(smoothY, [-0.5, 0.5], ["0%", "100%"]);
  const spotlightBackground = useTransform(
    [spotlightX, spotlightY],
    ([x, y]) => `radial-gradient(circle at ${x} ${y}, ${spotlightColor}, transparent 60%)`
  );

  const handleMouseMove = (e: React.MouseEvent<HTMLDivElement>) => {
    if (!containerRef.current) return;
    const rect = containerRef.current.getBoundingClientRect();
    const x = (e.clientX - rect.left) / rect.width - 0.5;
    const y = (e.clientY - rect.top) / rect.height - 0.5;
    mouseX.set(x);
    mouseY.set(y);
  };

  const handleMouseEnter = () => setIsHovered(true);
  const handleMouseLeave = () => {
    setIsHovered(false);
    mouseX.set(0);
    mouseY.set(0);
  };

  return (
    <div style={{ opacity: mounted ? 1 : 0, transition: "opacity 0.2s" }}>
    <motion.div
      ref={containerRef}
      onMouseMove={handleMouseMove}
      onMouseEnter={handleMouseEnter}
      onMouseLeave={handleMouseLeave}
      style={{
        width,
        height,
        perspective: "1000px",
        ...style,
      }}
      className={`relative group ${className}`}
    >
      {/* Container Body */}
      <motion.div
        style={{
          rotateX,
          rotateY,
          background: bg,
          borderColor,
          transformStyle: "preserve-3d",
        }}
        className="w-full h-full rounded-2xl border backdrop-blur-xl relative overflow-hidden"
      >
        {/* Subtle SVG Noise */}
        <div
          className="absolute inset-0 opacity-[0.03] pointer-events-none mix-blend-overlay"
          style={{
            backgroundImage: `url("data:image/svg+xml,%3Csvg viewBox='0 0 200 200' xmlns='http://www.w3.org/2000/svg'%3E%3Cfilter id='noiseFilter'%3E%3CfeTurbulence type='fractalNoise' baseFrequency='0.65' numOctaves='3' stitchTiles='stitch'/%3E%3C/filter%3E%3Crect width='100%25' height='100%25' filter='url(%23noiseFilter)'/%3E%3C/svg%3E")`,
          }}
        />

        {/* Dynamic Spotlight */}
        <motion.div
          className="absolute inset-0 pointer-events-none opacity-0 group-hover:opacity-100 transition-opacity duration-500"
          style={{ background: spotlightBackground }}
        />

        {/* Inner Grid / Floating Area */}
        <div className="absolute inset-0 p-4">
          <div className="w-full h-full relative">
            {items.map((item, index) => {
              // Deterministic pseudo-random values for floating animation
              const seed = index * 137;
              const randomX = ((seed % 100) / 100 - 0.5) * 150; // -75 to 75
              const randomY = (((seed * 7) % 100) / 100 - 0.5) * 150;
              const randomRot = (((seed * 11) % 100) / 100 - 0.5) * 45;
              const randomZ = ((seed % 50) + 20); // 20 to 70

              // Base grid position logic (simple 2x2 assumption for 4 items)
              const row = Math.floor(index / 2);
              const col = index % 2;
              const gridTop = `${row * 50}%`;
              const gridLeft = `${col * 50}%`;

              // Parallax effect based on mouse when floating
              const parallaxX = useTransform(smoothX, [-0.5, 0.5], [-randomZ, randomZ]);
              const parallaxY = useTransform(smoothY, [-0.5, 0.5], [-randomZ, randomZ]);

              return (
                <motion.div
                  key={index}
                  className="absolute"
                  initial={false}
                  animate={
                    isHovered
                      ? {
                          // Floating State (Anti-Gravity)
                          top: "50%",
                          left: "50%",
                          x: `calc(-50% + ${randomX}px)`,
                          y: `calc(-50% + ${randomY}px)`,
                          rotate: randomRot,
                          scale: 1.1,
                          z: randomZ,
                        }
                      : {
                          // Snapped Grid State
                          top: gridTop,
                          left: gridLeft,
                          x: "0%",
                          y: "0%",
                          rotate: 0,
                          scale: 1,
                          z: 0,
                        }
                  }
                  style={
                    isHovered
                      ? {
                          // Add mouse parallax on top of the base animation position
                          // Framer motion allows combining animate state with style overwrites carefully,
                          // but to keep it simple and clean we apply parallax as a secondary translation.
                          // Wait, Framer motion style overrides animate's x/y if not careful.
                          // Let's use a wrapper for parallax!
                        }
                      : {}
                  }
                  transition={{
                    type: "spring",
                    stiffness: 150 + (index * 20), // staggered spring
                    damping: 15,
                    mass: 0.8
                  }}
                >
                  <motion.div
                    style={
                      isHovered ? { x: parallaxX, y: parallaxY } : { x: 0, y: 0 }
                    }
                    className="w-full h-full p-2"
                  >
                     {/* The item content wrapper */}
                     <div className="w-[160px] h-[160px] shadow-2xl">
                       {item}
                     </div>
                  </motion.div>
                </motion.div>
              );
            })}
          </div>
        </div>

        {/* Anti-Gravity Indicator */}
        <div className="absolute bottom-4 left-0 right-0 flex justify-center pointer-events-none">
          <motion.div
            initial={{ opacity: 0, y: 10 }}
            animate={{ opacity: isHovered ? 1 : 0, y: isHovered ? 0 : 10 }}
            className="px-3 py-1 rounded-full bg-black/50 border border-white/20 backdrop-blur-md flex items-center space-x-2"
          >
            <div className="w-2 h-2 rounded-full bg-[#ff5c71] animate-ping" />
            <span className="text-white/80 font-mono text-[10px] tracking-widest uppercase">Zero Gravity</span>
          </motion.div>
        </div>
      </motion.div>
    </motion.div>
    </div>
  );
}

export default AntiGravityBento;
