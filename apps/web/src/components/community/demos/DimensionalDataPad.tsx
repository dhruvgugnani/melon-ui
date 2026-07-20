"use client";

import React, { useRef, useState } from "react";
import { motion, useMotionValue, useSpring, useTransform } from "framer-motion";

export interface DimensionalDataPadProps extends React.ComponentPropsWithoutRef<"div"> {
  primaryColor?: string;
  secondaryColor?: string;
  glowColor?: string;
  title?: string;
  subtitle?: string;
}

export const DimensionalDataPad = React.forwardRef<HTMLDivElement, DimensionalDataPadProps>(
  (
    {
      primaryColor = "#00f0ff",
      secondaryColor = "#ff5c71",
      glowColor = "#7fff5e",
      title = "QUANTUM.CORE",
      subtitle = "SYS.SYNC_ACTIVE",
      className = "",
      style,
      ...props
    },
    forwardedRef
  ) => {
    const internalRef = useRef<HTMLDivElement>(null);
    const containerRef = (forwardedRef as React.RefObject<HTMLDivElement>) || internalRef;

    const [isHovered, setIsHovered] = useState(false);

    // Mouse position tracking (0 to 1)
    const mouseX = useMotionValue(0.5);
    const mouseY = useMotionValue(0.5);

    // Smooth springs for mouse
    const springX = useSpring(mouseX, { stiffness: 150, damping: 20 });
    const springY = useSpring(mouseY, { stiffness: 150, damping: 20 });

    // 3D rotation transforms based on mouse position
    const rotateX = useTransform(springY, [0, 1], [15, -15]);
    const rotateY = useTransform(springX, [0, 1], [-15, 15]);

    const handleMouseMove = (e: React.MouseEvent<HTMLDivElement>) => {
      if (!containerRef.current) return;
      const rect = containerRef.current.getBoundingClientRect();
      const x = (e.clientX - rect.left) / rect.width;
      const y = (e.clientY - rect.top) / rect.height;
      mouseX.set(x);
      mouseY.set(y);
    };

    const handleMouseEnter = () => {
      setIsHovered(true);
    };

    const handleMouseLeave = () => {
      setIsHovered(false);
      mouseX.set(0.5);
      mouseY.set(0.5);
    };

    // Deterministic values for faux data blocks
    const dataBlocks = [
      { id: 1, label: "SECTOR_1", color: primaryColor, value: "87%" },
      { id: 2, label: "SECTOR_2", color: secondaryColor, value: "64%" },
      { id: 3, label: "SECTOR_3", color: glowColor, value: "92%" },
    ];

    return (
      <div
        ref={containerRef}
        className={`relative flex items-center justify-center w-full h-[500px] bg-[#030303] overflow-hidden rounded-2xl border border-white/5 group ${className}`}
        onMouseMove={handleMouseMove}
        onMouseEnter={handleMouseEnter}
        onMouseLeave={handleMouseLeave}
        style={{ perspective: "1200px", ...style }}
        {...props}
      >
        {/* Background ambient glow */}
        <motion.div
          className="absolute inset-0 opacity-20 pointer-events-none blur-3xl transition-opacity duration-500"
          animate={{ opacity: isHovered ? 0.4 : 0.1 }}
          style={{
            background: `radial-gradient(circle at center, ${primaryColor}40 0%, transparent 70%)`
          }}
        />

        {/* Subtle noise texture */}
        <div
          className="absolute inset-0 opacity-10 pointer-events-none mix-blend-overlay"
          style={{
            backgroundImage: "url(\"data:image/svg+xml,%3Csvg viewBox='0 0 200 200' xmlns='http://www.w3.org/2000/svg'%3E%3Cfilter id='noiseFilter'%3E%3CfeTurbulence type='fractalNoise' baseFrequency='0.85' numOctaves='3' stitchTiles='stitch'/%3E%3C/filter%3E%3Crect width='100%25' height='100%25' filter='url(%23noiseFilter)'/%3E%3C/svg%3E\")"
          }}
        />

        {/* 3D Container */}
        <motion.div
          className="relative w-[280px] h-[380px] cursor-pointer"
          style={{
            rotateX: isHovered ? rotateX : 35,
            rotateY: isHovered ? rotateY : -20,
            transformStyle: "preserve-3d"
          }}
          animate={{
            rotateZ: isHovered ? 0 : 10,
            scale: isHovered ? 1.05 : 0.9,
          }}
          transition={{ type: "spring", stiffness: 100, damping: 20 }}
        >
          {/* Layer 1: Base Chassis */}
          <motion.div
            className="absolute inset-0 rounded-2xl bg-[#0a0a0a] border border-white/10 shadow-[0_20px_50px_rgba(0,0,0,0.5)] overflow-hidden"
            style={{
              boxShadow: `0 0 0 1px rgba(255,255,255,0.05), 0 10px 30px -10px ${primaryColor}20`
            }}
            animate={{
              translateZ: isHovered ? -40 : 0,
            }}
            transition={{ type: "spring", stiffness: 120, damping: 20 }}
          >
            {/* Grid pattern on base */}
            <div className="absolute inset-0 opacity-20" style={{ backgroundImage: "linear-gradient(rgba(255,255,255,0.1) 1px, transparent 1px), linear-gradient(90deg, rgba(255,255,255,0.1) 1px, transparent 1px)", backgroundSize: "20px 20px" }} />
          </motion.div>

          {/* Layer 2: Circuit Board / Data Layer */}
          <motion.div
            className="absolute inset-4 rounded-xl border border-white/5 bg-gradient-to-b from-white/[0.03] to-transparent backdrop-blur-[2px] flex flex-col p-6"
            animate={{
              translateZ: isHovered ? 40 : 10,
            }}
            transition={{ type: "spring", stiffness: 120, damping: 20 }}
          >
            <div className="flex justify-between items-center mb-6">
              <div className="flex items-center gap-2">
                <div className="w-2 h-2 rounded-full" style={{ backgroundColor: primaryColor, boxShadow: `0 0 10px ${primaryColor}` }} />
                <span className="text-[10px] font-mono tracking-widest text-white/50">{subtitle}</span>
              </div>
              <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" className="text-white/30">
                <path d="M12 2v20M17 5H9.5a3.5 3.5 0 0 0 0 7h5a3.5 3.5 0 0 1 0 7H6" />
              </svg>
            </div>

            <h3 className="text-2xl font-bold tracking-tight text-white/90 mb-2" style={{ textShadow: `0 0 20px ${primaryColor}40` }}>
              {title}
            </h3>

            {/* Faux Data Blocks */}
            <div className="flex-1 flex flex-col gap-3 mt-4">
              {dataBlocks.map((block) => (
                <div key={block.id} className="w-full h-8 rounded bg-white/[0.03] border border-white/[0.05] relative overflow-hidden group-hover:bg-white/[0.05] transition-colors">
                  <motion.div
                    className="absolute top-0 left-0 bottom-0 bg-white/10"
                    initial={{ width: "20%" }}
                    animate={{ width: isHovered ? `${40 + block.id * 15}%` : "20%" }}
                    transition={{ type: "spring", stiffness: 100, damping: 20, delay: block.id * 0.1 }}
                    style={{ backgroundColor: block.color, opacity: 0.2 }}
                  />
                  <div className="absolute inset-0 flex items-center px-3 justify-between text-[10px] font-mono text-white/40">
                    <span>{block.label}</span>
                    <span>{block.value}</span>
                  </div>
                </div>
              ))}
            </div>

            {/* Bottom Bar */}
            <div className="h-1 w-full bg-white/10 rounded-full mt-auto overflow-hidden">
               <motion.div
                 className="h-full"
                 style={{ backgroundColor: glowColor }}
                 animate={{ width: isHovered ? "100%" : "30%" }}
                 transition={{ type: "spring", stiffness: 50, damping: 20 }}
               />
            </div>
          </motion.div>

          {/* Layer 3: Glass Top Cover */}
          <motion.div
            className="absolute -inset-2 rounded-2xl border border-white/10 bg-gradient-to-br from-white/[0.05] via-transparent to-white/[0.02] backdrop-blur-sm pointer-events-none flex items-center justify-center"
            animate={{
              translateZ: isHovered ? 80 : 20,
            }}
            transition={{ type: "spring", stiffness: 120, damping: 20 }}
          >
             {/* Glare effect */}
             <div className="absolute top-0 left-0 right-0 h-1/2 bg-gradient-to-b from-white/10 to-transparent rounded-t-2xl mix-blend-overlay" />

             {/* Corner Accents */}
             <div className="absolute top-4 left-4 w-2 h-2 border-t border-l border-white/30" />
             <div className="absolute top-4 right-4 w-2 h-2 border-t border-r border-white/30" />
             <div className="absolute bottom-4 left-4 w-2 h-2 border-b border-l border-white/30" />
             <div className="absolute bottom-4 right-4 w-2 h-2 border-b border-r border-white/30" />

             {/* Center Reticle (only visible on hover) */}
             <motion.div
               className="relative flex items-center justify-center"
               animate={{ opacity: isHovered ? 1 : 0, scale: isHovered ? 1 : 0.8 }}
               transition={{ duration: 0.3 }}
             >
                <motion.div
                  className="w-12 h-12 rounded-full border border-white/20 border-dashed"
                  animate={{ rotate: 360 }}
                  transition={{ repeat: Infinity, duration: 10, ease: "linear" }}
                />
                <div className="absolute w-2 h-2 bg-white/50 rounded-full" />
             </motion.div>
          </motion.div>

        </motion.div>
      </div>
    );
  }
);

DimensionalDataPad.displayName = "DimensionalDataPad";
