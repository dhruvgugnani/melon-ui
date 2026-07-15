"use client";

import React, { useState, useRef, useEffect } from "react";
import { motion, useMotionValue, useSpring, useTransform, AnimatePresence } from "framer-motion";

export interface HologramSlide {
  id: string;
  title: string;
  content: React.ReactNode;
}

export interface HologramProjectorProps extends React.ComponentPropsWithoutRef<"div"> {
  primaryColor?: string;
  secondaryColor?: string;
  glowColor?: string;
  baseColor?: string;
  slides?: HologramSlide[];
}

const DEFAULT_HOLOGRAM_SLIDES: HologramSlide[] = [
  {
    id: "sys-status",
    title: "SYS.STATUS",
    content: (
      <div className="flex flex-col gap-2 h-full justify-center">
        <div className="flex justify-between items-center text-xs opacity-70">
          <span>CORE_TEMP</span>
          <span className="font-mono text-[var(--glow-color)]">34.2°C</span>
        </div>
        <div className="h-1 w-full bg-white/10 rounded-full overflow-hidden">
          <motion.div
            className="h-full bg-[var(--glow-color)]"
            initial={{ width: "0%" }}
            animate={{ width: "45%" }}
            transition={{ duration: 1, ease: "easeOut" }}
          />
        </div>

        <div className="flex justify-between items-center text-xs opacity-70 mt-2">
          <span>NETWORK_LOAD</span>
          <span className="font-mono text-[var(--secondary-color)]">89.4%</span>
        </div>
        <div className="h-1 w-full bg-white/10 rounded-full overflow-hidden">
          <motion.div
            className="h-full bg-[var(--secondary-color)]"
            initial={{ width: "0%" }}
            animate={{ width: "89%" }}
            transition={{ duration: 1.2, ease: "easeOut" }}
          />
        </div>
      </div>
    )
  },
  {
    id: "bio-scan",
    title: "BIO.SCAN",
    content: (
      <div className="flex flex-col items-center justify-center h-full gap-3 relative">
        {/* Animated fingerprint/scan visual */}
        <div className="w-16 h-16 border-2 border-[var(--primary-color)] rounded-full flex items-center justify-center relative overflow-hidden">
           <motion.div
             className="absolute w-full h-[2px] bg-[var(--glow-color)] shadow-[0_0_10px_var(--glow-color)] z-10"
             animate={{ top: ["0%", "100%", "0%"] }}
             transition={{ duration: 2, repeat: Infinity, ease: "linear" }}
           />
           <div className="w-10 h-10 border border-white/20 rounded-full flex items-center justify-center">
              <div className="w-4 h-4 bg-[var(--primary-color)] rounded-full animate-pulse" />
           </div>
        </div>
        <div className="text-xs tracking-widest font-mono text-[var(--primary-color)]">
          IDENTITY_VERIFIED
        </div>
      </div>
    )
  },
  {
    id: "neural-link",
    title: "NEURAL.LINK",
    content: (
      <div className="flex flex-col h-full gap-2 justify-center relative">
        <div className="flex justify-between items-end h-16 gap-1">
           {[...Array(12)].map((_, i) => (
             <motion.div
               key={i}
               className="w-full bg-[var(--secondary-color)] rounded-t-sm"
               animate={{
                 height: ["20%", `${40 + (i * 5 % 60)}%`, "20%"]
               }}
               transition={{
                 duration: 1 + (i % 2),
                 repeat: Infinity,
                 ease: "easeInOut",
                 delay: (i * 0.1) % 0.5
               }}
             />
           ))}
        </div>
        <div className="text-[10px] uppercase font-mono text-center tracking-widest opacity-70">
          Syncing Cortex...
        </div>
      </div>
    )
  }
];

export function HologramProjector({
  primaryColor = "#00f0ff",
  secondaryColor = "#ff5c71",
  glowColor = "#7fff5e",
  baseColor = "#111111",
  slides = DEFAULT_HOLOGRAM_SLIDES,
  className = "",
  style,
  ...props
}: HologramProjectorProps) {
  const [activeSlide, setActiveSlide] = useState(0);
  const [isGlitching, setIsGlitching] = useState(false);
  const containerRef = useRef<HTMLDivElement>(null);
  const [mounted, setMounted] = useState(false);

  useEffect(() => {
    const timer = setTimeout(() => setMounted(true), 0);
    return () => clearTimeout(timer);
  }, []);

  // Mouse tracking for parallax
  const x = useMotionValue(0);
  const y = useMotionValue(0);

  const handleMouseMove = (e: React.MouseEvent) => {
    if (!containerRef.current) return;
    const rect = containerRef.current.getBoundingClientRect();
    const centerX = rect.left + rect.width / 2;
    const centerY = rect.top + rect.height / 2;

    // Calculate normalized offset (-1 to 1)
    const offsetX = (e.clientX - centerX) / (rect.width / 2);
    const offsetY = (e.clientY - centerY) / (rect.height / 2);

    x.set(offsetX);
    y.set(offsetY);
  };

  const handleMouseLeave = () => {
    x.set(0);
    y.set(0);
  };

  // Parallax transforms
  const rotateX = useTransform(useSpring(y, { stiffness: 150, damping: 20 }), [-1, 1], [15, -15]);
  const rotateY = useTransform(useSpring(x, { stiffness: 150, damping: 20 }), [-1, 1], [-15, 15]);

  // Beam interaction
  const beamOpacity = useTransform(useSpring(y, { stiffness: 150, damping: 20 }), [-1, 1], [0.8, 0.4]);
  const beamSkew = useTransform(useSpring(x, { stiffness: 150, damping: 20 }), [-1, 1], [-5, 5]);

  const handleBaseClick = () => {
    if (isGlitching) return;
    setIsGlitching(true);

    // Glitch sound/haptic simulation
    if (typeof navigator !== 'undefined' && navigator.vibrate) {
      navigator.vibrate([20, 30, 20]);
    }

    setTimeout(() => {
      setActiveSlide((prev) => (prev + 1) % slides.length);
      setTimeout(() => {
        setIsGlitching(false);
      }, 300);
    }, 200);
  };

  const currentSlide = slides[activeSlide];

  // Custom CSS variables for easy styling
  const customStyle = {
    "--primary-color": primaryColor,
    "--secondary-color": secondaryColor,
    "--glow-color": glowColor,
    "--base-color": baseColor,
    ...style
  } as React.CSSProperties;

  if (!mounted) return null; // Prevent hydration mismatch with random values in animations (if any)

  return (
    <div
      className={`relative flex flex-col items-center justify-end h-[400px] w-full max-w-sm mx-auto perspective-1000 ${className}`}
      style={customStyle}
      ref={containerRef}
      onMouseMove={handleMouseMove}
      onMouseLeave={handleMouseLeave}
      {...props}
    >

      {/* Hologram Display Area */}
      <div className="relative w-full h-[250px] mb-8 flex items-center justify-center transform-style-3d z-10 pointer-events-none">

        {/* Hologram Card */}
        <motion.div
          style={{ rotateX, rotateY }}
          className="relative w-64 h-48 rounded-xl border border-[var(--primary-color)]/30 p-4 flex flex-col overflow-hidden bg-black/40 backdrop-blur-md shadow-[0_0_30px_rgba(var(--primary-color),0.2)]"
        >
          {/* Scanlines Overlay */}
          <div
            className="absolute inset-0 pointer-events-none opacity-20 mix-blend-overlay z-20"
            style={{
              backgroundImage: 'repeating-linear-gradient(0deg, transparent, transparent 2px, #fff 2px, #fff 4px)',
              backgroundSize: '100% 4px'
            }}
          />

          {/* Noise Overlay */}
          <div
            className="absolute inset-0 opacity-10 mix-blend-screen pointer-events-none z-20"
            style={{
              backgroundImage: `url("data:image/svg+xml,%3Csvg viewBox='0 0 200 200' xmlns='http://www.w3.org/2000/svg'%3E%3Cfilter id='noiseFilter'%3E%3CfeTurbulence type='fractalNoise' baseFrequency='0.65' numOctaves='3' stitchTiles='stitch'/%3E%3C/filter%3E%3Crect width='100%25' height='100%25' filter='url(%23noiseFilter)'/%3E%3C/svg%3E")`
            }}
          />

          {/* Glitch Overlay */}
          <AnimatePresence>
            {isGlitching && (
              <motion.div
                initial={{ opacity: 0 }}
                animate={{
                  opacity: [0, 1, 0.5, 1, 0],
                  x: [0, -10, 10, -5, 0],
                  filter: ["hue-rotate(0deg)", "hue-rotate(90deg)", "hue-rotate(-90deg)", "hue-rotate(0deg)"]
                }}
                exit={{ opacity: 0 }}
                transition={{ duration: 0.3 }}
                className="absolute inset-0 bg-[var(--primary-color)]/20 z-30 mix-blend-difference pointer-events-none"
              >
                <div className="w-full h-1/3 bg-white/10 absolute top-1/4 -left-4 w-[120%]" />
                <div className="w-full h-1/4 bg-white/20 absolute bottom-1/4 left-2 w-[110%]" />
              </motion.div>
            )}
          </AnimatePresence>

          {/* Content Wrapper */}
          <motion.div
            className="relative z-10 flex flex-col h-full"
            animate={isGlitching ? { opacity: 0.3, scale: 0.98 } : { opacity: 1, scale: 1 }}
            transition={{ duration: 0.2 }}
          >
            {/* Header */}
            <div className="flex justify-between items-center mb-4 border-b border-[var(--primary-color)]/20 pb-2">
              <span className="text-[10px] font-mono tracking-widest text-[var(--primary-color)]">
                {currentSlide.id.toUpperCase()}
              </span>
              <div className="flex gap-1">
                 <div className="w-1.5 h-1.5 rounded-full bg-[var(--glow-color)] animate-pulse" />
                 <div className="w-1.5 h-1.5 rounded-full bg-[var(--primary-color)]/50" />
              </div>
            </div>

            {/* Body */}
            <div className="flex-1 overflow-hidden">
               <AnimatePresence mode="wait">
                 <motion.div
                   key={currentSlide.id}
                   initial={{ opacity: 0, y: 10, filter: "blur(4px)" }}
                   animate={{ opacity: 1, y: 0, filter: "blur(0px)" }}
                   exit={{ opacity: 0, y: -10, filter: "blur(4px)" }}
                   transition={{ duration: 0.3 }}
                   className="h-full text-white/90"
                 >
                   {currentSlide.content}
                 </motion.div>
               </AnimatePresence>
            </div>

            {/* Footer */}
            <div className="mt-4 flex justify-between items-end opacity-50 text-[8px] font-mono">
              <span>OS_v2.4</span>
              <span>{String(activeSlide + 1).padStart(2, '0')}/{String(slides.length).padStart(2, '0')}</span>
            </div>
          </motion.div>

          {/* Hologram Corner Accents */}
          <div className="absolute top-0 left-0 w-3 h-3 border-t-2 border-l-2 border-[var(--primary-color)] rounded-tl-sm pointer-events-none" />
          <div className="absolute top-0 right-0 w-3 h-3 border-t-2 border-r-2 border-[var(--primary-color)] rounded-tr-sm pointer-events-none" />
          <div className="absolute bottom-0 left-0 w-3 h-3 border-b-2 border-l-2 border-[var(--primary-color)] rounded-bl-sm pointer-events-none" />
          <div className="absolute bottom-0 right-0 w-3 h-3 border-b-2 border-r-2 border-[var(--primary-color)] rounded-br-sm pointer-events-none" />
        </motion.div>
      </div>

      {/* Volumetric Light Beam */}
      <motion.div
        style={{
          opacity: beamOpacity,
          skewX: beamSkew
        }}
        className="absolute bottom-8 left-1/2 -translate-x-1/2 w-48 h-64 pointer-events-none z-0"
      >
        <div
          className="w-full h-full"
          style={{
            background: `linear-gradient(to top, var(--primary-color) 0%, transparent 100%)`,
            clipPath: 'polygon(20% 100%, 80% 100%, 100% 0, 0 0)',
            maskImage: 'linear-gradient(to top, rgba(0,0,0,0.6) 0%, rgba(0,0,0,0) 100%)',
            WebkitMaskImage: 'linear-gradient(to top, rgba(0,0,0,0.6) 0%, rgba(0,0,0,0) 100%)',
            filter: 'blur(8px)',
            opacity: 0.5
          }}
        />
        {/* Core beam */}
        <div
          className="absolute inset-0 w-full h-full"
          style={{
            background: `linear-gradient(to top, var(--glow-color) 0%, transparent 80%)`,
            clipPath: 'polygon(35% 100%, 65% 100%, 80% 0, 20% 0)',
            maskImage: 'linear-gradient(to top, rgba(0,0,0,0.8) 0%, rgba(0,0,0,0) 100%)',
            WebkitMaskImage: 'linear-gradient(to top, rgba(0,0,0,0.8) 0%, rgba(0,0,0,0) 100%)',
            filter: 'blur(4px)',
            opacity: 0.7
          }}
        />
      </motion.div>

      {/* Projector Base */}
      <button
        onClick={handleBaseClick}
        className="relative w-40 h-16 cursor-pointer group z-20 focus:outline-none focus:ring-2 focus:ring-[var(--primary-color)] focus:ring-offset-2 focus:ring-offset-black rounded-full"
        aria-label="Cycle hologram data"
      >
        {/* Shadow */}
        <div className="absolute -bottom-4 left-1/2 -translate-x-1/2 w-32 h-6 bg-black/50 blur-md rounded-[100%]" />

        {/* Base Cylinder Layer */}
        <div className="absolute inset-0 rounded-[100px_100px_40px_40px] bg-gradient-to-b from-[#2a2a2a] to-[#111] shadow-[inset_0_-2px_10px_rgba(0,0,0,0.8),_0_5px_15px_rgba(0,0,0,0.5)] border-b-2 border-black border-x border-x-white/5 transition-transform duration-100 group-active:translate-y-1 group-active:scale-[0.98]">

          {/* Top Plate (Lens Area) */}
          <div className="absolute -top-3 left-1/2 -translate-x-1/2 w-32 h-10 rounded-full bg-gradient-to-b from-[#333] to-[#1a1a1a] shadow-[inset_0_2px_5px_rgba(255,255,255,0.1),_0_2px_5px_rgba(0,0,0,0.5)] border border-black/50 flex items-center justify-center">

            {/* The Lens */}
            <div className="w-16 h-6 rounded-full bg-black flex items-center justify-center shadow-[inset_0_2px_4px_rgba(0,0,0,1)] relative overflow-hidden">
               {/* Lens Glow */}
               <motion.div
                 className="absolute inset-0 bg-[var(--primary-color)]/40 blur-sm"
                 animate={{ opacity: isGlitching ? [0.2, 0.8, 0.2] : 0.6 }}
                 transition={{ duration: 0.1 }}
               />

               {/* Lens Inner Ring */}
               <div className="w-10 h-3 rounded-full border border-[var(--primary-color)]/30 shadow-[0_0_10px_var(--primary-color)] flex items-center justify-center z-10 bg-[var(--primary-color)]/10">
                  {/* Laser Diode */}
                  <div className="w-2 h-1 rounded-full bg-[var(--glow-color)] shadow-[0_0_8px_var(--glow-color)]" />
               </div>

               {/* Lens reflection curve */}
               <div className="absolute top-0 left-1/2 -translate-x-1/2 w-12 h-2 bg-white/10 rounded-b-full blur-[1px]" />
            </div>

            {/* Base indicator lights */}
            <div className="absolute right-3 top-1/2 -translate-y-1/2 flex gap-1">
              <div className="w-1.5 h-1.5 rounded-full bg-[var(--secondary-color)] shadow-[0_0_5px_var(--secondary-color)]" />
              <div className="w-1.5 h-1.5 rounded-full bg-black border border-white/20" />
            </div>
          </div>

          {/* Base detailing */}
          <div className="absolute bottom-2 left-1/2 -translate-x-1/2 w-24 h-1 flex justify-between px-2">
            {[...Array(6)].map((_, i) => (
              <div key={i} className="w-1 h-full bg-black/60 rounded-full shadow-[inset_0_1px_1px_rgba(255,255,255,0.1)]" />
            ))}
          </div>

        </div>
      </button>

      {/* Instructions / Label */}
      <div className="absolute bottom-[-30px] text-xs font-mono text-white/30 tracking-widest pointer-events-none">
        TAP BASE TO CYCLE DATA
      </div>

    </div>
  );
}
