"use client";

import React, { useState, useRef } from "react";
import { motion, useMotionValue, useSpring, useTransform, AnimatePresence } from "framer-motion";

export interface ShatterOnHoverCardProps extends React.ComponentPropsWithoutRef<"div"> {
  title?: string;
  subtitle?: string;
  revealTitle?: string;
  revealText?: string;
  primaryColor?: string;
  accentColor?: string;
  bgColor?: string;
}

export function ShatterOnHoverCard({
  title = "DEPTH FOCUS",
  subtitle = "INTERACTIVE SHARDS",
  revealTitle = "INNER DETAIL",
  revealText = "PHYSICAL SPRING SEPARATION.",
  primaryColor = "#ff5c71",
  accentColor = "#7fff5e",
  bgColor = "#050505",
  className = "",
  style,
  ...props
}: ShatterOnHoverCardProps) {
  const [isHovered, setIsHovered] = useState(false);
  const containerRef = useRef<HTMLDivElement>(null);

  // Parallax / 3D tracking
  const mouseX = useMotionValue(0);
  const mouseY = useMotionValue(0);

  const springConfig = { damping: 25, stiffness: 200, mass: 0.5 };
  const smoothX = useSpring(mouseX, springConfig);
  const smoothY = useSpring(mouseY, springConfig);

  const rotateX = useTransform(smoothY, [-0.5, 0.5], [15, -15]);
  const rotateY = useTransform(smoothX, [-0.5, 0.5], [-15, 15]);

  const handleMouseMove = (e: React.MouseEvent<HTMLDivElement>) => {
    if (!containerRef.current) return;
    const rect = containerRef.current.getBoundingClientRect();
    const x = (e.clientX - rect.left) / rect.width - 0.5;
    const y = (e.clientY - rect.top) / rect.height - 0.5;
    mouseX.set(x);
    mouseY.set(y);
  };

  const handleMouseLeave = () => {
    setIsHovered(false);
    mouseX.set(0);
    mouseY.set(0);
  };

  // Define shatter pieces (SVG paths or absolute divs)
  // We'll use absolute positioned polygon divs for distinct shards.
  const shards = [
    { clipPath: "polygon(0 0, 50% 0, 30% 50%, 0 40%)", x: -80, y: -60, rot: -25, delay: 0.05 },
    { clipPath: "polygon(50% 0, 100% 0, 100% 30%, 60% 40%)", x: 90, y: -70, rot: 35, delay: 0.1 },
    { clipPath: "polygon(100% 30%, 100% 70%, 70% 60%, 60% 40%)", x: 100, y: 10, rot: 15, delay: 0.02 },
    { clipPath: "polygon(100% 70%, 100% 100%, 50% 100%, 60% 80%, 70% 60%)", x: 80, y: 80, rot: 45, delay: 0.08 },
    { clipPath: "polygon(50% 100%, 0 100%, 20% 70%, 40% 80%, 60% 80%)", x: -40, y: 90, rot: -20, delay: 0.15 },
    { clipPath: "polygon(0 100%, 0 40%, 30% 50%, 40% 70%, 20% 70%)", x: -90, y: 40, rot: -40, delay: 0.06 },
    { clipPath: "polygon(30% 50%, 60% 40%, 70% 60%, 40% 80%, 40% 70%)", x: 10, y: -20, rot: 60, delay: 0.12 }, // Center piece 1
    { clipPath: "polygon(20% 70%, 40% 70%, 40% 80%)", x: -10, y: 30, rot: -80, delay: 0.04 }, // Center piece 2
  ];

  return (
    <div
      ref={containerRef}
      onMouseMove={handleMouseMove}
      onMouseEnter={() => setIsHovered(true)}
      onMouseLeave={handleMouseLeave}
      className={`relative w-full max-w-[320px] h-[400px] flex items-center justify-center font-['Outfit',sans-serif] perspective-[1200px] ${className}`}
      style={{ ...style }}
      {...props}
    >
      <motion.div
        className="relative w-full h-full rounded-2xl flex items-center justify-center transform-style-3d"
        style={{
          rotateX,
          rotateY,
        }}
      >
        {/* Core (Revealed State) */}
        <div className="absolute inset-0 rounded-2xl border border-white/10 p-6 flex flex-col items-center justify-center overflow-hidden z-0"
             style={{ backgroundColor: bgColor }}>

          <div className="absolute inset-0 opacity-20 pointer-events-none mix-blend-screen"
                style={{
                  backgroundImage: `radial-gradient(circle at 50% 50%, ${primaryColor} 0%, transparent 70%)`
                }} />

          <div className="absolute inset-0 opacity-[0.03] pointer-events-none mix-blend-overlay"
            style={{
               backgroundImage: `url("data:image/svg+xml,%3Csvg viewBox='0 0 200 200' xmlns='http://www.w3.org/2000/svg'%3E%3Cfilter id='noiseFilter'%3E%3CfeTurbulence type='fractalNoise' baseFrequency='0.65' numOctaves='3' stitchTiles='stitch'/%3E%3C/filter%3E%3Crect width='100%25' height='100%25' filter='url(%23noiseFilter)'/%3E%3C/svg%3E")`,
            }}
          />

          <motion.div
            initial={{ opacity: 0, scale: 0.92 }}
            animate={{ 
              opacity: isHovered ? 1 : 0,
              scale: isHovered ? 1 : 0.92,
            }}
            transition={{ duration: 0.4, ease: "easeOut" }}
            className="w-full h-full flex flex-col items-center justify-center relative z-10"
          >
            {/* Cyber Core Graphic */}
            <motion.div
              animate={{
                scale: isHovered ? [1, 1.05, 1] : 1,
                opacity: isHovered ? 1 : 0.4
              }}
              transition={{ duration: 2, repeat: Infinity, ease: "easeInOut" }}
              className="w-24 h-24 rounded-full border-4 flex items-center justify-center mb-6 relative"
              style={{ borderColor: `${primaryColor}50`, boxShadow: isHovered ? `0 0 40px ${primaryColor}40` : 'none' }}
            >
               <div className="absolute w-full h-full border-2 border-dashed rounded-full animate-[spin_10s_linear_infinite]" style={{ borderColor: accentColor }} />
               <div className="w-8 h-8 rounded-full animate-pulse" style={{ backgroundColor: primaryColor, boxShadow: `0 0 20px ${primaryColor}` }} />
            </motion.div>

            <h3 className="text-white text-xl font-bold tracking-[0.2em] mb-2 text-center" style={{ textShadow: isHovered ? `0 0 10px ${primaryColor}` : 'none' }}>
              {revealTitle}
            </h3>
            <p className="text-white/50 text-xs tracking-widest text-center uppercase max-w-[200px]">
              {revealText}
            </p>

            <div className="mt-8 flex gap-4">
              <div className="px-3 py-1 rounded-full border text-[10px] tracking-widest bg-black/50" style={{ borderColor: primaryColor, color: primaryColor }}>SPRING</div>
              <div className="px-3 py-1 rounded-full border text-[10px] tracking-widest bg-black/50" style={{ borderColor: accentColor, color: accentColor }}>INTERACTIVE</div>
            </div>
          </motion.div>
        </div>

        {/* Shatter Shell (Front Layer) */}
        <div className="absolute inset-0 pointer-events-none z-10 perspective-[1000px]">
          <AnimatePresence>
            {shards.map((shard, index) => {

              // Base shell design logic applied to each shard
              return (
                <motion.div
                  key={index}
                  initial={false}
                  animate={
                    isHovered
                      ? {
                          x: shard.x * 2.2,
                          y: shard.y * 2.2 + 260, // Throw outward and drop downwards (gravity fall)
                          z: 160 + index * 10,
                          rotateX: shard.rot * 2.2,
                          rotateY: shard.rot * 2.4,
                          rotateZ: shard.rot * 2.8,
                          opacity: 0, // Fade out as shards fall off
                          scale: 0.5,
                          filter: "blur(2px)"
                        }
                      : {
                          x: 0,
                          y: 0,
                          z: 0,
                          rotateX: 0,
                          rotateY: 0,
                          rotateZ: 0,
                          opacity: 1,
                          scale: 1,
                          filter: "blur(0px)"
                        }
                  }
                  transition={{
                    type: "spring",
                    stiffness: 120,
                    damping: 20,
                    mass: 0.8,
                    delay: isHovered ? shard.delay : shard.delay * 0.3,
                  }}
                  className="absolute inset-0 w-full h-full transform-style-3d origin-center"
                  style={{
                    clipPath: shard.clipPath,
                  }}
                >
                  {/* The actual continuous UI of the front card */}
                  <div className="w-full h-full bg-white/[0.03] backdrop-blur-xl border border-white/10 flex flex-col items-center justify-between p-8 shadow-2xl relative overflow-hidden"
                       style={{
                         background: `linear-gradient(135deg, rgba(255,255,255,0.05) 0%, rgba(255,255,255,0.01) 100%)`,
                         boxShadow: `inset 0 0 0 1px rgba(255,255,255,0.1)`
                       }}>

                    {/* Glowing Edge on top */}
                    <div className="absolute top-0 left-0 right-0 h-px w-full" style={{ background: `linear-gradient(90deg, transparent, ${primaryColor}, transparent)` }} />

                    {/* Fake Scanline */}
                    <div className="absolute top-0 left-0 w-full h-1/2 opacity-10 bg-gradient-to-b from-transparent to-white pointer-events-none mix-blend-overlay" />

                    <div className="w-full flex justify-between items-start">
                      <div className="w-2 h-2 rounded-full" style={{ backgroundColor: accentColor }} />
                      <span className="text-[10px] tracking-widest text-white/40 font-mono">ID: 809.X</span>
                    </div>

                    <div className="flex flex-col items-center text-center">
                      <h2 className="text-2xl font-bold text-white tracking-[0.15em] mb-2">{title}</h2>
                      <p className="text-white/50 text-xs tracking-widest">{subtitle}</p>
                    </div>

                    <div className="w-full flex justify-center">
                      <div className="px-4 py-2 border border-white/20 rounded-md text-white/70 text-[10px] uppercase tracking-widest flex items-center gap-2 bg-black/20">
                        <svg width="12" height="12" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                          <path d="M12 2v20M17 5H9.5a3.5 3.5 0 0 0 0 7h5a3.5 3.5 0 0 1 0 7H6" />
                        </svg>
                        Hover to Disengage
                      </div>
                    </div>
                  </div>
                </motion.div>
              );
            })}
          </AnimatePresence>
        </div>
      </motion.div>
    </div>
  );
}
