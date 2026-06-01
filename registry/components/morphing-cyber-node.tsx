"use client";

import React, { useRef, useState, useEffect, useMemo } from "react";
import { motion, AnimatePresence, useMotionValue, useSpring, useTransform } from "framer-motion";

export type NodeState = "IDLE" | "SCANNING" | "AUDIO" | "ALERT";

export interface MorphingCyberNodeProps extends React.ComponentPropsWithoutRef<"div"> {
  initialState?: NodeState;
  primaryColor?: string;
  secondaryColor?: string;
  tertiaryColor?: string;
  bg?: string;
  borderColor?: string;
  idleText?: string;
  scanningText?: string;
  scanningIp?: string;
  audioModeText?: string;
  cancelText?: string;
  alertTitle?: string;
  alertSubtitle?: string;
  lockdownText?: string;
}

export function MorphingCyberNode({
  initialState = "IDLE",
  primaryColor = "#7fff5e",
  secondaryColor = "#ff5c71",
  tertiaryColor = "#e8d5b7",
  bg = "transparent",
  borderColor = "rgba(255, 255, 255, 0.05)",
  idleText = "System Ready",
  scanningText = "Scanning",
  scanningIp = "192.168.1.X",
  audioModeText = "Audio Mode",
  cancelText = "Cancel",
  alertTitle = "BREACH",
  alertSubtitle = "UNAUTHORIZED ACCESS DETECTED",
  lockdownText = "LOCKDOWN",
  className = "",
  style,
  ...props
}: MorphingCyberNodeProps) {
  const [nodeState, setNodeState] = useState<NodeState>(initialState);
  const [mounted, setMounted] = useState(false);
  const containerRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    setMounted(true);
  }, []);

  // Use pseudo-random seeded values based on index to ensure deterministic rendering
  // and prevent hydration mismatches
  const radarConfig = useMemo(() => 
    Array.from({ length: 18 }).map((_, i) => ({
      delay: (i * 0.3) % 2,
      duration: ((i * 0.7) % 2) + 0.5
    })),
    []
  );

  const audioDurations = useMemo(() => 
    Array.from({ length: 12 }).map((_, i) => 0.5 + ((i * 0.4) % 0.5)),
    []
  );

  // Magnetic Hover Physics
  const mouseX = useMotionValue(0);
  const mouseY = useMotionValue(0);

  const springConfig = { damping: 20, stiffness: 300, mass: 0.5 };
  const rotateX = useSpring(useTransform(mouseY, [-0.5, 0.5], [15, -15]), springConfig);
  const rotateY = useSpring(useTransform(mouseX, [-0.5, 0.5], [-15, 15]), springConfig);

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

  const handleCardClick = () => {
    if (nodeState === "IDLE") {
      setNodeState("SCANNING");
    }
  };

  const states = {
    IDLE: { width: 220, height: 70, borderRadius: 35, backgroundColor: "rgba(5, 5, 5, 0.8)", borderColor: "rgba(255, 255, 255, 0.1)" },
    SCANNING: { width: 320, height: 180, borderRadius: 24, backgroundColor: "rgba(10, 15, 10, 0.9)", borderColor: `${primaryColor}66` },
    AUDIO: { width: 280, height: 110, borderRadius: 32, backgroundColor: "rgba(15, 5, 10, 0.85)", borderColor: `${secondaryColor}4d` },
    ALERT: { width: 340, height: 220, borderRadius: 16, backgroundColor: "rgba(20, 0, 0, 0.95)", borderColor: `${secondaryColor}cc` }
  };

  return (
    <div 
      className={`relative w-full h-[400px] flex items-center justify-center overflow-hidden rounded-xl border ${className}`} 
      style={{ 
        perspective: 1200,
        backgroundColor: bg,
        borderColor: borderColor,
        ...style 
      }}
      {...props}
    >
      {/* Background ambient light */}
      <motion.div
        className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[300px] h-[300px] rounded-full blur-[100px] pointer-events-none opacity-20"
        animate={{
          backgroundColor:
            nodeState === "SCANNING" ? primaryColor :
            nodeState === "ALERT" ? secondaryColor :
            nodeState === "AUDIO" ? tertiaryColor :
            "#ffffff"
        }}
        transition={{ duration: 0.8 }}
      />

      <motion.div
        ref={containerRef}
        onMouseMove={handleMouseMove}
        onMouseLeave={handleMouseLeave}
        onClick={handleCardClick}
        initial={false}
        animate={states[nodeState]}
        transition={{ type: "spring", damping: 25, stiffness: 200 }}
        style={{
          rotateX: mounted ? rotateX : 0,
          rotateY: mounted ? rotateY : 0,
          transformStyle: "preserve-3d",
          backdropFilter: "blur(20px)",
        }}
        className="relative flex flex-col items-center justify-center cursor-pointer border shadow-2xl z-10"
      >
        {/* SVG Noise Overlay */}
        <div
          className="absolute inset-0 opacity-10 mix-blend-overlay pointer-events-none rounded-[inherit] overflow-hidden"
          style={{ backgroundImage: "url('data:image/svg+xml;utf8,%3Csvg viewBox=%220 0 200 200%22 xmlns=%22http://www.w3.org/2000/svg%22%3E%3Cfilter id=%22noiseFilter%22%3E%3CfeTurbulence type=%22fractalNoise%22 baseFrequency=%220.8%22 numOctaves=%223%22 stitchTiles=%22stitch%22/%3E%3C/filter%3E%3Crect width=%22100%25%22 height=%22100%25%22 filter=%22url(%23noiseFilter)%22/%3E%3C/svg%3E')" }}
        />

        {/* Content Layers */}
        <AnimatePresence mode="wait">
          {nodeState === "IDLE" && (
            <motion.div
              key="idle"
              initial={{ opacity: 0, scale: 0.8 }}
              animate={{ opacity: 1, scale: 1 }}
              exit={{ opacity: 0, scale: 0.8, filter: "blur(10px)" }}
              transition={{ duration: 0.2 }}
              className="flex items-center gap-4 px-6 w-full justify-between"
              style={{ transform: "translateZ(30px)" }}
            >
              <div className="w-3 h-3 rounded-full bg-white/20 animate-pulse" />
              <span className="font-mono text-sm tracking-widest text-white/50 uppercase select-none">{idleText}</span>
              <button 
                onClick={(e) => { e.stopPropagation(); setNodeState("SCANNING"); }} 
                className="w-8 h-8 rounded-full bg-white/5 hover:bg-white/10 flex items-center justify-center transition-colors"
                aria-label="Start Scanning"
              >
                <span style={{ color: primaryColor }}>⛶</span>
              </button>
            </motion.div>
          )}

          {nodeState === "SCANNING" && (
            <motion.div
              key="scanning"
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, y: -20, filter: "blur(10px)" }}
              className="flex flex-col items-center p-6 w-full h-full relative"
              style={{ transform: "translateZ(40px)" }}
            >
              <div 
                className="absolute top-0 left-0 w-full h-[2px]"
                style={{
                  backgroundColor: `${primaryColor}80`,
                  boxShadow: `0 0 15px ${primaryColor}`
                }}
              >
                <motion.div
                  className="w-full h-full"
                  style={{ backgroundColor: primaryColor }}
                  animate={{ x: ["-100%", "100%"] }}
                  transition={{ repeat: Infinity, duration: 1.5, ease: "linear" }}
                />
              </div>
              <div className="flex w-full justify-between items-center mb-4 mt-2">
                <span className="font-mono text-xs uppercase tracking-[0.3em]" style={{ color: primaryColor }}>{scanningText}</span>
                <span className="font-mono text-[10px] text-white/40">{scanningIp}</span>
              </div>

              <div className="flex-1 w-full border rounded bg-black/50 overflow-hidden relative mb-4" style={{ borderColor: `${primaryColor}33` }}>
                {/* Radar sweep effect */}
                <motion.div
                  className="absolute inset-0"
                  style={{
                    background: `linear-gradient(to right, transparent, ${primaryColor}33, transparent)`
                  }}
                  animate={{ x: ["-100%", "100%"] }}
                  transition={{ repeat: Infinity, duration: 2, ease: "linear" }}
                />
                <div className="absolute inset-0 grid grid-cols-6 grid-rows-3 gap-1 p-2 opacity-50">
                   {radarConfig.map((config, i) => (
                     <motion.div
                        key={i}
                        className="rounded-[1px]"
                        style={{ backgroundColor: `${primaryColor}4d` }}
                        animate={{ opacity: [0.1, 1, 0.1] }}
                        transition={{ duration: config.duration, repeat: Infinity, delay: config.delay }}
                     />
                   ))}
                </div>
              </div>

              <div className="flex gap-2 w-full">
                <button onClick={(e) => { e.stopPropagation(); setNodeState("AUDIO"); }} className="flex-1 py-1.5 rounded bg-white/5 hover:bg-white/10 font-mono text-[10px] uppercase text-white/70 transition-colors">{audioModeText}</button>
                <button onClick={(e) => { e.stopPropagation(); setNodeState("IDLE"); }} className="px-3 py-1.5 rounded bg-red-500/10 hover:bg-red-500/20 font-mono text-[10px] uppercase transition-colors" style={{ color: secondaryColor }}>{cancelText}</button>
              </div>
            </motion.div>
          )}

          {nodeState === "AUDIO" && (
            <motion.div
              key="audio"
              initial={{ opacity: 0, scale: 0.9 }}
              animate={{ opacity: 1, scale: 1 }}
              exit={{ opacity: 0, scale: 1.1, filter: "blur(10px)" }}
              className="flex items-center w-full px-6 gap-6"
              style={{ transform: "translateZ(50px)" }}
            >
              <div 
                className="w-12 h-12 rounded-full border-2 flex items-center justify-center"
                style={{
                  borderColor: `${secondaryColor}4d`,
                  backgroundColor: `${secondaryColor}1a`
                }}
              >
                <motion.div
                  className="w-4 h-4 rounded-full"
                  style={{ backgroundColor: secondaryColor }}
                  animate={{ scale: [1, 1.5, 1] }}
                  transition={{ repeat: Infinity, duration: 0.8, ease: "easeInOut" }}
                />
              </div>

              <div className="flex-1 flex items-center gap-1 h-8">
                 {audioDurations.map((duration, i) => (
                   <motion.div
                     key={i}
                     className="flex-1 rounded-full"
                     style={{ backgroundColor: `${secondaryColor}cc` }}
                     animate={{ height: ["20%", "100%", "20%"] }}
                     transition={{ repeat: Infinity, duration, delay: i * 0.05 }}
                   />
                 ))}
              </div>

              <button onClick={(e) => { e.stopPropagation(); setNodeState("ALERT"); }} className="w-8 h-8 rounded-full bg-white/5 hover:bg-white/10 flex items-center justify-center transition-colors" aria-label="Trigger Alert">
                <span style={{ color: secondaryColor }}>⚠</span>
              </button>
            </motion.div>
          )}

          {nodeState === "ALERT" && (
            <motion.div
              key="alert"
              initial={{ opacity: 0, rotateX: -90 }}
              animate={{ opacity: 1, rotateX: 0 }}
              exit={{ opacity: 0, rotateX: 90, filter: "blur(10px)" }}
              className="flex flex-col items-center justify-center w-full h-full p-6 text-center"
              style={{ transform: "translateZ(60px)", transformOrigin: "bottom" }}
            >
              <motion.div
                className="text-[4rem] leading-none mb-2"
                style={{ fontFamily: "var(--font-anton)" }}
                animate={{ scale: [1, 1.05, 1], color: [secondaryColor, "#ffffff", secondaryColor] }}
                transition={{ repeat: Infinity, duration: 1 }}
              >
                {alertTitle}
              </motion.div>
              <p className="font-mono text-xs tracking-widest mb-6" style={{ color: `${secondaryColor}b3` }}>{alertSubtitle}</p>

              <button
                onClick={(e) => { e.stopPropagation(); setNodeState("IDLE"); }}
                className="px-6 py-2 rounded-sm text-black font-black uppercase tracking-widest text-xs hover:bg-white transition-colors"
                style={{ backgroundColor: secondaryColor }}
              >
                {lockdownText}
              </button>
            </motion.div>
          )}
        </AnimatePresence>
      </motion.div>
    </div>
  );
}
