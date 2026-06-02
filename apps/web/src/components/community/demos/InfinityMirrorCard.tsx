"use client";

import React, { useRef } from "react";
import { motion, useMotionValue, useSpring, useTransform } from "framer-motion";

export interface InfinityMirrorCardProps {
  title?: string;
  subtitle?: string;
  layers?: number;
  glowColor?: string;
  borderColor?: string;
}

export const InfinityMirrorCard: React.FC<InfinityMirrorCardProps> = ({
  title = "VOID",
  subtitle = "SYSTEM_READY",
  layers = 5,
  glowColor = "#7fff5e",
  borderColor = "rgba(255, 255, 255, 0.1)",
}) => {
  const containerRef = useRef<HTMLDivElement>(null);

  // Safe static initial values for SSR to prevent hydration errors
  const x = useMotionValue(0);
  const y = useMotionValue(0);

  // Smooth springs for the 3D tilt, feeling premium and magnetic
  const springConfig = { damping: 20, stiffness: 100, mass: 0.5 };
  const rotateX = useSpring(useTransform(y, [-0.5, 0.5], [18, -18]), springConfig);
  const rotateY = useSpring(useTransform(x, [-0.5, 0.5], [-18, 18]), springConfig);

  const handleMouseMove = (e: React.MouseEvent<HTMLDivElement>) => {
    if (!containerRef.current) return;
    const rect = containerRef.current.getBoundingClientRect();
    const width = rect.width;
    const height = rect.height;
    const mouseX = e.clientX - rect.left;
    const mouseY = e.clientY - rect.top;

    // Calculate percentage from center (-0.5 to 0.5)
    const xPct = mouseX / width - 0.5;
    const yPct = mouseY / height - 0.5;

    x.set(xPct);
    y.set(yPct);
  };

  const handleMouseLeave = () => {
    x.set(0);
    y.set(0);
  };

  return (
    <div
      className="relative flex items-center justify-center p-8 w-full h-full min-h-[500px]"
      style={{ perspective: "1400px" }}
    >
      <motion.div
        ref={containerRef}
        onMouseMove={handleMouseMove}
        onMouseLeave={handleMouseLeave}
        style={{
          rotateX,
          rotateY,
          transformStyle: "preserve-3d",
        }}
        className="relative w-[280px] h-[400px] cursor-pointer group"
      >
        {/* Infinity Mirror Backwards Layers */}
        {Array.from({ length: layers }).map((_, i) => {
          // Push back into the screen with increasing depth
          const depth = (i + 1) * -50;
          // Shrink slightly as they go back to enhance perspective
          const scale = 1 - (i * 0.04);
          const opacity = 1 - (i * (1 / layers));
          // Convert glowColor and apply opacity dynamically for inset shadow
          const hexOpacity = Math.floor(opacity * 255).toString(16).padStart(2, '0');

          return (
            <div
              key={i}
              className="absolute inset-0 rounded-2xl border transition-all duration-700 ease-out"
              style={{
                transform: `translateZ(${depth}px) scale(${scale})`,
                borderColor: borderColor,
                boxShadow: `0 0 30px ${glowColor}${hexOpacity} inset, 0 0 10px rgba(0,0,0,0.8)`,
                opacity: Math.max(0.1, opacity),
                transformStyle: "preserve-3d",
                background: "rgba(0,0,0,0.6)",
                backdropFilter: "blur(4px)",
              }}
            >
               {/* Noise Texture for that organic Gen-Z feel */}
               <div
                 className="absolute inset-0 opacity-20 mix-blend-overlay rounded-2xl pointer-events-none"
                 style={{
                   backgroundImage: "url('data:image/svg+xml,%3Csvg viewBox=%220 0 200 200%22 xmlns=%22http://www.w3.org/2000/svg%22%3E%3Cfilter id=%22noiseFilter%22%3E%3CfeTurbulence type=%22fractalNoise%22 baseFrequency=%220.8%22 numOctaves=%223%22 stitchTiles=%22stitch%22/%3E%3C/filter%3E%3Crect width=%22100%25%22 height=%22100%25%22 filter=%22url(%23noiseFilter)%22/%3E%3C/svg%3E')",
                 }}
               />
            </div>
          );
        })}

        {/* Top Front Glass Card */}
        <div
          className="absolute inset-0 rounded-2xl border border-white/20 bg-black/40 backdrop-blur-md overflow-hidden flex flex-col justify-between p-6 transition-all duration-500 group-hover:border-white/40 group-hover:bg-black/50"
          style={{
            transform: "translateZ(0px)",
            transformStyle: "preserve-3d",
            boxShadow: `0 0 50px ${glowColor}30, inset 0 0 20px ${glowColor}10`
          }}
        >
          {/* Subtle Front Noise Overlay */}
          <div
            className="absolute inset-0 opacity-15 pointer-events-none mix-blend-overlay"
            style={{
              backgroundImage: "url('data:image/svg+xml,%3Csvg viewBox=%220 0 200 200%22 xmlns=%22http://www.w3.org/2000/svg%22%3E%3Cfilter id=%22noiseFilter%22%3E%3CfeTurbulence type=%22fractalNoise%22 baseFrequency=%220.85%22 numOctaves=%223%22 stitchTiles=%22stitch%22/%3E%3C/filter%3E%3Crect width=%22100%25%22 height=%22100%25%22 filter=%22url(%23noiseFilter)%22/%3E%3C/svg%3E')",
            }}
          />

          {/* Floating Content: Text */}
          <motion.div
            className="relative z-10"
            style={{ transform: "translateZ(40px)" }}
          >
            <h3
              className="text-5xl font-black uppercase tracking-tighter drop-shadow-lg"
              style={{ fontFamily: "var(--font-anton)", color: "#fff" }}
            >
              {title}
            </h3>
            <p
              className="text-sm font-bold tracking-[0.2em] uppercase mt-2 drop-shadow-md"
              style={{ color: glowColor }}
            >
              {subtitle}
            </p>
          </motion.div>

          {/* Floating Content: UI Element */}
          <motion.div
            className="relative z-10 w-full h-1/2 flex flex-col items-center justify-end pb-4"
            style={{ transform: "translateZ(60px)" }}
          >
             <div className="w-full h-px bg-gradient-to-r from-transparent via-white/40 to-transparent relative flex items-center justify-center group-hover:via-white/70 transition-colors duration-500">
                <motion.div
                  className="w-5 h-5 rounded-full border-2 border-white/80"
                  style={{ backgroundColor: glowColor, boxShadow: `0 0 25px ${glowColor}` }}
                  animate={{ scale: [1, 1.2, 1], opacity: [0.8, 1, 0.8] }}
                  transition={{ duration: 2.5, repeat: Infinity, ease: "easeInOut" }}
                />
             </div>
             <p className="text-[10px] font-mono text-white/50 tracking-widest uppercase mt-6 opacity-0 group-hover:opacity-100 transition-opacity duration-500 translate-y-2 group-hover:translate-y-0">
               Initialize Sequence
             </p>
          </motion.div>
        </div>
      </motion.div>
    </div>
  );
};
