"use client";

import React, { useRef, useState, useEffect } from "react";
import { motion, useMotionValue, useSpring, useTransform, AnimatePresence } from "framer-motion";

type CoreState = "STABLE" | "UNSTABLE" | "CRITICAL";

export function GlitchPulseCore() {
  const containerRef = useRef<HTMLDivElement>(null);
  const [coreState, setCoreState] = useState<CoreState>("STABLE");
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
    STABLE: "#7fff5e",
    UNSTABLE: "#ffaa00",
    CRITICAL: "#ff5c71",
  };

  const currentColor = colors[coreState];

  if (!mounted) return null;

  return (
    <div className="relative w-full h-[500px] flex items-center justify-center bg-[#050505] overflow-hidden rounded-xl border border-white/5" style={{ perspective: 1000 }}>
      {/* SVG Glitch Filter */}
      <svg className="absolute w-0 h-0 pointer-events-none">
        <defs>
          <filter id="glitch-filter">
            <feTurbulence type="fractalNoise" baseFrequency={coreState === "CRITICAL" ? "0.8 0.1" : coreState === "UNSTABLE" ? "0.2 0.05" : "0.01 0.01"} numOctaves="3" result="noise" />
            <feDisplacementMap in="SourceGraphic" in2="noise" scale={coreState === "CRITICAL" ? "30" : coreState === "UNSTABLE" ? "10" : "0"} xChannelSelector="R" yChannelSelector="G" />
          </filter>
        </defs>
      </svg>

      {/* Ambient Glow */}
      <motion.div
        className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[400px] h-[400px] rounded-full blur-[120px] pointer-events-none opacity-30"
        animate={{ backgroundColor: currentColor }}
        transition={{ duration: 1.5 }}
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
                className="h-[1px] bg-[#ff5c71]"
                initial={{ width: 0, x: i % 2 === 0 ? "-100%" : "100%" }}
                animate={{ width: "100%", x: 0 }}
                transition={{ repeat: Infinity, duration: 1 + (i % 3) * 0.5, ease: "linear" }}
              />
            ))}
          </motion.div>
        )}
      </AnimatePresence>

      <motion.div
        ref={containerRef}
        onMouseMove={handleMouseMove}
        onMouseLeave={handleMouseLeave}
        style={{
          rotateX,
          rotateY,
          transformStyle: "preserve-3d",
        }}
        className="relative flex items-center justify-center w-[300px] h-[300px] cursor-crosshair z-10"
      >
        {/* Orbital Rings */}
        <motion.div
          className="absolute inset-0 rounded-full border border-dashed border-white/20"
          animate={{ rotate: 360 }}
          transition={{ repeat: Infinity, duration: coreState === "CRITICAL" ? 4 : 20, ease: "linear" }}
          style={{ transform: "translateZ(-40px)", borderWidth: "2px" }}
        />

        <motion.div
          className="absolute inset-4 rounded-full border border-solid border-white/10"
          animate={{ rotate: -360 }}
          transition={{ repeat: Infinity, duration: coreState === "CRITICAL" ? 6 : 30, ease: "linear" }}
          style={{ transform: "translateZ(20px)" }}
        />

        <motion.div
          className="absolute inset-10 rounded-full border border-dotted border-white/30"
          animate={{ rotate: 360, scale: coreState === "UNSTABLE" ? [1, 1.05, 1] : 1 }}
          transition={{ rotate: { repeat: Infinity, duration: 10, ease: "linear" }, scale: { repeat: Infinity, duration: 2 } }}
          style={{ transform: "translateZ(60px)", borderColor: currentColor }}
        />

        {/* Central Core */}
        <motion.div
          onClick={handleCoreClick}
          whileHover={{ scale: 1.1 }}
          whileTap={{ scale: 0.9 }}
          className="relative w-24 h-24 rounded-full flex items-center justify-center overflow-hidden"
          style={{
            transform: "translateZ(100px)",
            backdropFilter: "blur(15px)",
            background: "rgba(20, 20, 20, 0.4)",
            border: `1px solid ${currentColor}`,
            boxShadow: `0 0 30px ${currentColor}40, inset 0 0 20px ${currentColor}20`,
            filter: "url(#glitch-filter)",
          }}
        >
          {/* Core Inner Energy */}
          <motion.div
            className="w-12 h-12 rounded-full blur-[8px]"
            animate={{
              scale: coreState === "CRITICAL" ? [1, 1.5, 1] : coreState === "UNSTABLE" ? [1, 1.2, 1] : [1, 1.05, 1],
              opacity: [0.5, 1, 0.5],
              backgroundColor: currentColor
            }}
            transition={{ repeat: Infinity, duration: coreState === "CRITICAL" ? 0.2 : coreState === "UNSTABLE" ? 0.5 : 2 }}
          />

          {/* Glitch Overlay */}
          <div className="absolute inset-0 bg-[url('data:image/svg+xml;utf8,%3Csvg%20viewBox=%220%200%20200%20200%22%20xmlns=%22http://www.w3.org/2000/svg%22%3E%3Cfilter%20id=%22noise%22%3E%3CfeTurbulence%20type=%22fractalNoise%22%20baseFrequency=%220.65%22%20numOctaves=%223%22%20stitchTiles=%22stitch%22/%3E%3C/filter%3E%3Crect%20width=%22100%25%22%20height=%22100%25%22%20filter=%22url(%23noise)%22%20opacity=%220.5%22/%3E%3C/svg%3E')] mix-blend-overlay opacity-30 pointer-events-none" />
        </motion.div>

        {/* State Label Floating Element */}
        <motion.div
          className="absolute -bottom-16 left-1/2 -translate-x-1/2 px-4 py-1 rounded-full bg-white/5 border border-white/10 font-mono text-xs tracking-[0.2em] uppercase backdrop-blur-sm"
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
