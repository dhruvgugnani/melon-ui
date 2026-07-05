"use client";

import React, { useRef, useState, useEffect } from "react";
import { motion, useMotionValue, useSpring, useTransform, AnimatePresence } from "framer-motion";

type CoreState = "STABLE" | "UNSTABLE" | "CRITICAL";

export interface GlitchPulseCoreProps extends React.ComponentPropsWithoutRef<"div"> {
  initialCoreState?: CoreState;
  stableColor?: string;
  unstableColor?: string;
  criticalColor?: string;
}

export function GlitchPulseCore({
  initialCoreState = "STABLE",
  stableColor = "#7fff5e",
  unstableColor = "#ffaa00",
  criticalColor = "#ff5c71",
  className = "",
  style,
  ...props
}: GlitchPulseCoreProps) {
  const containerRef = useRef<HTMLDivElement>(null);
  const [coreState, setCoreState] = useState<CoreState>(initialCoreState);
  const [mounted, setMounted] = useState(false);

  useEffect(() => {
    const timer = setTimeout(() => {
      setMounted(true);
    }, 0);
    return () => clearTimeout(timer);
  }, []);

  // Magnetic Physics
  const mouseX = useMotionValue(0);
  const mouseY = useMotionValue(0);

  const springConfig = { damping: 15, stiffness: 150, mass: 0.8 };
  const magneticX = useSpring(mouseX, springConfig);
  const magneticY = useSpring(mouseY, springConfig);

  const rotateX = useTransform(magneticY, [-0.5, 0.5], [25, -25]);
  const rotateY = useTransform(magneticX, [-0.5, 0.5], [-25, 25]);

  const handleMouseMove = (e: React.MouseEvent) => {
    if (!containerRef.current) return;
    const rect = containerRef.current.getBoundingClientRect();
    const x = (e.clientX - rect.left) / rect.width - 0.5;
    const y = (e.clientY - rect.top) / rect.height - 0.5;
    mouseX.set(x);
    mouseY.set(y);
  };

  const handleMouseLeave = () => {
    mouseX.set(0);
    mouseY.set(0);
  };

  const handleCoreClick = () => {
    setCoreState((prev) => {
      if (prev === "STABLE") return "UNSTABLE";
      if (prev === "UNSTABLE") return "CRITICAL";
      return "STABLE";
    });
  };

  const colors = {
    STABLE: stableColor,
    UNSTABLE: unstableColor,
    CRITICAL: criticalColor,
  };

  const currentColor = colors[coreState];

  if (!mounted) return null;

  return (
    <div
      ref={containerRef}
      onMouseMove={handleMouseMove}
      onMouseLeave={handleMouseLeave}
      className={`relative w-full h-[500px] flex items-center justify-center bg-[#050505] overflow-hidden rounded-xl border border-white/5 ${className}`}
      style={{
        perspective: 1000,
        ...style
      }}
      {...props}
    >
      {/* Ambient Glow */}
      <motion.div
        className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[400px] h-[400px] rounded-full blur-[120px] pointer-events-none opacity-30 animate-pulse"
        style={{ backgroundColor: currentColor }}
      />

      {/* Background Grid Pattern */}
      <div
        className="absolute inset-0 opacity-[0.03] pointer-events-none"
        style={{
          backgroundImage: `radial-gradient(${currentColor} 1px, transparent 1px)`,
          backgroundSize: "24px 24px"
        }}
      />

      {/* Background Data Stream (only active in CRITICAL) */}
      <AnimatePresence>
        {coreState === "CRITICAL" && (
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 0.1 }}
            exit={{ opacity: 0 }}
            className="absolute inset-0 flex flex-col justify-between p-4 pointer-events-none"
          >
            {Array.from({ length: 15 }).map((_, i) => (
              <motion.div
                key={i}
                className="h-[1px]"
                style={{ backgroundColor: criticalColor }}
                initial={{ width: 0, x: i % 2 === 0 ? "-100%" : "100%" }}
                animate={{ width: "100%", x: 0 }}
                transition={{ repeat: Infinity, duration: 1 + (i % 3) * 0.5, ease: "linear" }}
              />
            ))}
          </motion.div>
        )}
      </AnimatePresence>

      <motion.div
        style={{
          rotateX,
          rotateY,
          transformStyle: "preserve-3d",
        }}
        className="relative flex items-center justify-center w-[300px] h-[300px] cursor-crosshair z-10"
      >
        {/* Orbital Rings */}
        <motion.div
          className="absolute inset-0 pointer-events-none"
          animate={{ rotate: 360 }}
          transition={{ repeat: Infinity, duration: coreState === "CRITICAL" ? 6 : coreState === "UNSTABLE" ? 12 : 24, ease: "linear" }}
          style={{ transform: "translateZ(-40px)" }}
        >
          <svg className="w-full h-full opacity-40" viewBox="0 0 100 100">
            <circle cx="50" cy="50" r="48" fill="none" stroke={currentColor} strokeWidth="0.5" strokeDasharray="3 3" />
            <circle cx="50" cy="50" r="45" fill="none" stroke="rgba(255,255,255,0.05)" strokeWidth="1" />
            {/* Outer ticks */}
            <path d="M50 0 L50 4 M50 96 L50 100 M0 50 L4 50 M96 50 L100 50" stroke={currentColor} strokeWidth="1" />
          </svg>
        </motion.div>

        <motion.div
          className="absolute inset-4 pointer-events-none"
          animate={{ rotate: -360 }}
          transition={{ repeat: Infinity, duration: coreState === "CRITICAL" ? 8 : coreState === "UNSTABLE" ? 18 : 36, ease: "linear" }}
          style={{ transform: "translateZ(20px)" }}
        >
          <svg className="w-full h-full opacity-35" viewBox="0 0 100 100">
            <circle cx="50" cy="50" r="40" fill="none" stroke={currentColor} strokeWidth="1.5" strokeDasharray="20 10 5 10" />
          </svg>
        </motion.div>

        <motion.div
          className="absolute inset-10 pointer-events-none"
          animate={{ rotate: 360 }}
          transition={{ repeat: Infinity, duration: coreState === "CRITICAL" ? 4 : coreState === "UNSTABLE" ? 10 : 20, ease: "linear" }}
          style={{ transform: "translateZ(60px)" }}
        >
          <svg className="w-full h-full opacity-50" viewBox="0 0 100 100">
            <circle cx="50" cy="50" r="30" fill="none" stroke={currentColor} strokeWidth="1" strokeDasharray="6 2" />
            {/* Rotating nodes */}
            <circle cx="50" cy="20" r="2" fill={currentColor} />
            <circle cx="50" cy="80" r="2" fill={currentColor} />
          </svg>
        </motion.div>

        {/* Central Core */}
        <motion.div
          onClick={handleCoreClick}
          whileHover={{ scale: 1.1 }}
          whileTap={{ scale: 0.95 }}
          className="relative w-28 h-28 rounded-full flex items-center justify-center overflow-hidden"
          style={{
            transform: "translateZ(100px)",
            backdropFilter: "blur(15px)",
            background: "rgba(10, 10, 10, 0.7)",
            border: `1.5px solid ${currentColor}`,
            boxShadow: `0 0 40px ${currentColor}33, inset 0 0 25px ${currentColor}20`,
          }}
        >
          {/* Inner Glowing Ring */}
          <div className="absolute inset-2 rounded-full border border-white/5" />

          {/* Core Inner Energy */}
          <motion.div
            className="w-14 h-14 rounded-full blur-[8px]"
            animate={{
              scale: coreState === "CRITICAL" ? [1, 1.4, 1] : coreState === "UNSTABLE" ? [1, 1.2, 1] : [1, 1.05, 1],
              opacity: [0.6, 0.9, 0.6],
              backgroundColor: currentColor
            }}
            transition={{ repeat: Infinity, duration: coreState === "CRITICAL" ? 0.3 : coreState === "UNSTABLE" ? 0.8 : 2 }}
          />

          {/* Core Center Solid Bead */}
          <motion.div
            className="absolute w-6 h-6 rounded-full shadow-[0_0_15px_rgba(255,255,255,0.8)]"
            style={{ backgroundColor: "#ffffff" }}
            animate={coreState === "CRITICAL" ? { scale: [0.8, 1.2, 0.8] } : { scale: 1 }}
            transition={{ repeat: Infinity, duration: 0.5 }}
          />

          {/* Tech Subdivisions */}
          <svg className="absolute inset-0 w-full h-full opacity-20 pointer-events-none" viewBox="0 0 100 100">
            <line x1="50" y1="0" x2="50" y2="100" stroke="white" strokeWidth="0.5" />
            <line x1="0" y1="50" x2="100" y2="50" stroke="white" strokeWidth="0.5" />
          </svg>
        </motion.div>

        {/* State Label Floating Element */}
        <motion.div
          className="absolute -bottom-16 left-1/2 -translate-x-1/2 px-4 py-1 rounded-full bg-white/5 border border-white/10 font-mono text-xs tracking-[0.2em] uppercase backdrop-blur-sm shadow-[0_4px_12px_rgba(0,0,0,0.5)]"
          style={{ transform: "translateZ(80px)", color: currentColor }}
          animate={{
             y: [0, -5, 0],
             opacity: coreState === "CRITICAL" ? [0.5, 1, 0.5] : 1
          }}
          transition={{ repeat: Infinity, duration: 2 }}
        >
          {coreState}
        </motion.div>
      </motion.div>
    </div>
  );
}
