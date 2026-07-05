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
              <div className="flex items-center gap-2">
                <div className="relative w-2.5 h-2.5 flex items-center justify-center">
                  <div className="absolute inset-0 rounded-full bg-[#7fff5e] opacity-40 animate-ping" />
                  <div className="w-1.5 h-1.5 rounded-full bg-[#7fff5e]" />
                </div>
                <span className="font-mono text-[10px] tracking-[0.25em] text-white/70 uppercase select-none">Monitor</span>
              </div>
              <span className="font-sans font-bold text-xs text-white/95">{idleText}</span>
              <button 
                onClick={(e) => { e.stopPropagation(); setNodeState("SCANNING"); }} 
                className="w-8 h-8 rounded-full bg-white/5 hover:bg-white/10 flex items-center justify-center transition-colors group"
                aria-label="Start Scanning"
              >
                <span className="text-white/60 group-hover:text-[#7fff5e] transition-colors text-xs font-mono">⛶</span>
              </button>
            </motion.div>
          )}

          {nodeState === "SCANNING" && (
            <motion.div
              key="scanning"
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, y: -20, filter: "blur(10px)" }}
              className="flex flex-col items-center p-5 w-full h-full relative"
              style={{ transform: "translateZ(40px)" }}
            >
              <div className="flex w-full justify-between items-center mb-3">
                <span className="font-mono text-[10px] uppercase tracking-[0.3em] font-semibold" style={{ color: primaryColor }}>{scanningText}</span>
                <span className="font-mono text-[9px] text-white/30">{scanningIp}</span>
              </div>

              <div className="flex-1 w-full border rounded bg-black/40 overflow-hidden relative mb-3 flex items-center justify-center" style={{ borderColor: `${primaryColor}22` }}>
                <svg className="w-full h-full absolute inset-0 opacity-20 pointer-events-none" viewBox="0 0 100 100" preserveAspectRatio="none">
                  <circle cx="50" cy="50" r="15" fill="none" stroke={primaryColor} strokeWidth="0.5" />
                  <circle cx="50" cy="50" r="30" fill="none" stroke={primaryColor} strokeWidth="0.5" />
                  <circle cx="50" cy="50" r="45" fill="none" stroke={primaryColor} strokeWidth="0.5" />
                  <line x1="50" y1="0" x2="50" y2="100" stroke={primaryColor} strokeWidth="0.25" />
                  <line x1="0" y1="50" x2="100" y2="50" stroke={primaryColor} strokeWidth="0.25" />
                </svg>

                {/* Rotating vector line scanner */}
                <motion.div
                  className="w-full h-full absolute origin-center flex items-center justify-center pointer-events-none"
                  animate={{ rotate: 360 }}
                  transition={{ repeat: Infinity, duration: 4, ease: "linear" }}
                >
                  <div className="w-[150px] h-[150px] absolute right-1/2 bottom-1/2 origin-bottom-right" style={{
                    background: `conic-gradient(from 180deg, ${primaryColor}22, transparent)`
                  }} />
                  <div className="w-[150px] h-[1.5px] absolute right-1/2" style={{
                    backgroundColor: primaryColor,
                    boxShadow: `0 0 8px ${primaryColor}`
                  }} />
                </motion.div>

                <div className="relative font-mono text-[8px] text-white/40 tracking-[0.3em] text-center uppercase select-none">
                  SEARCHING NET...
                </div>
              </div>

              <div className="flex gap-2 w-full">
                <button onClick={(e) => { e.stopPropagation(); setNodeState("AUDIO"); }} className="flex-1 py-1 rounded bg-white/5 hover:bg-white/10 font-mono text-[9px] uppercase text-white/70 transition-colors border border-white/5">{audioModeText}</button>
                <button onClick={(e) => { e.stopPropagation(); setNodeState("IDLE"); }} className="px-3 py-1 rounded bg-[#ff5c71]/10 hover:bg-[#ff5c71]/20 font-mono text-[9px] uppercase transition-colors border border-[#ff5c71]/20" style={{ color: secondaryColor }}>{cancelText}</button>
              </div>
            </motion.div>
          )}

          {nodeState === "AUDIO" && (
            <motion.div
              key="audio"
              initial={{ opacity: 0, scale: 0.9 }}
              animate={{ opacity: 1, scale: 1 }}
              exit={{ opacity: 0, scale: 1.1, filter: "blur(10px)" }}
              className="flex items-center w-full px-6 gap-5"
              style={{ transform: "translateZ(50px)" }}
            >
              <div 
                className="w-10 h-10 rounded-full border flex items-center justify-center shrink-0"
                style={{
                  borderColor: `${secondaryColor}33`,
                  backgroundColor: `${secondaryColor}11`
                }}
              >
                <motion.div
                  className="w-3.5 h-3.5 rounded-full"
                  style={{ backgroundColor: secondaryColor }}
                  animate={{ scale: [1, 1.3, 1] }}
                  transition={{ repeat: Infinity, duration: 1.2, ease: "easeInOut" }}
                />
              </div>

              <div className="flex-1 flex items-center gap-[3px] h-7 max-w-[140px]">
                {audioDurations.map((duration, i) => (
                  <motion.div
                    key={i}
                    className="flex-1 rounded-full"
                    style={{ backgroundColor: `${secondaryColor}b3` }}
                    animate={{ height: ["25%", "100%", "25%"] }}
                    transition={{ repeat: Infinity, duration, delay: i * 0.04 }}
                  />
                ))}
              </div>

              <button 
                onClick={(e) => { e.stopPropagation(); setNodeState("ALERT"); }} 
                className="w-8 h-8 rounded-full bg-white/5 hover:bg-white/10 flex items-center justify-center transition-colors border border-white/5 group" 
                aria-label="Trigger Alert"
              >
                <span className="text-white/60 group-hover:text-[#ff5c71] transition-colors text-[10px]">⚠</span>
              </button>
            </motion.div>
          )}

          {nodeState === "ALERT" && (
            <motion.div
              key="alert"
              initial={{ opacity: 0, rotateX: -90 }}
              animate={{ opacity: 1, rotateX: 0 }}
              exit={{ opacity: 0, rotateX: 90, filter: "blur(10px)" }}
              className="flex flex-col items-center justify-center w-full h-full p-5 text-center"
              style={{ transform: "translateZ(60px)", transformOrigin: "bottom" }}
            >
              <motion.div
                className="text-2xl font-black uppercase tracking-[0.1em] mb-1"
                animate={{ scale: [1, 1.03, 1] }}
                transition={{ repeat: Infinity, duration: 1.5 }}
                style={{ color: secondaryColor }}
              >
                {alertTitle}
              </motion.div>
              <p className="font-mono text-[9px] tracking-widest text-white/50 mb-5 uppercase">{alertSubtitle}</p>

              <button
                onClick={(e) => { e.stopPropagation(); setNodeState("IDLE"); }}
                className="px-5 py-1.5 rounded bg-white/5 border border-white/10 text-white font-mono uppercase tracking-widest text-[9px] hover:bg-white/10 transition-colors shadow-[0_4px_12px_rgba(255,92,113,0.15)]"
              >
                Reset System
              </button>
            </motion.div>
          )}
        </AnimatePresence>
      </motion.div>
    </div>
  );
}
