"use client";

import React, { useRef, useState } from "react";
import { motion, AnimatePresence, useMotionValue, useSpring, useTransform } from "framer-motion";

type NodeState = "IDLE" | "SCANNING" | "AUDIO" | "ALERT";

export function MorphingCyberNode() {
  const [nodeState, setNodeState] = useState<NodeState>("IDLE");
  const containerRef = useRef<HTMLDivElement>(null);

  // Use pseudo-random seeded values based on index to ensure deterministic rendering
  // and prevent hydration mismatches
  const radarConfig = Array.from({length: 18}).map((_, i) => ({
    delay: (i * 0.3) % 2,
    duration: ((i * 0.7) % 2) + 0.5
  }));
  const audioDurations = Array.from({length: 12}).map((_, i) => 0.5 + ((i * 0.4) % 0.5));

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

  const states = {
    IDLE: { width: 220, height: 70, borderRadius: 35, background: "rgba(5, 5, 5, 0.8)", borderColor: "rgba(255, 255, 255, 0.1)" },
    SCANNING: { width: 320, height: 180, borderRadius: 24, background: "rgba(10, 15, 10, 0.9)", borderColor: "rgba(127, 255, 94, 0.4)" },
    AUDIO: { width: 280, height: 110, borderRadius: 32, background: "rgba(15, 5, 10, 0.85)", borderColor: "rgba(255, 92, 113, 0.3)" },
    ALERT: { width: 340, height: 220, borderRadius: 16, background: "rgba(20, 0, 0, 0.95)", borderColor: "rgba(255, 92, 113, 0.8)" }
  };

  return (
    <div className="relative w-full h-[400px] flex items-center justify-center bg-[#000] overflow-hidden rounded-xl border border-white/5" style={{ perspective: 1200 }}>
      {/* Background ambient light */}
      <motion.div
        className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[300px] h-[300px] rounded-full blur-[100px] pointer-events-none opacity-20"
        animate={{
          backgroundColor:
            nodeState === "SCANNING" ? "#7fff5e" :
            nodeState === "ALERT" ? "#ff5c71" :
            nodeState === "AUDIO" ? "#d600ff" :
            "#ffffff"
        }}
        transition={{ duration: 0.8 }}
      />

      <motion.div
        ref={containerRef}
        onMouseMove={handleMouseMove}
        onMouseLeave={handleMouseLeave}
        initial={false}
        animate={states[nodeState]}
        transition={{ type: "spring", damping: 25, stiffness: 200 }}
        style={{
          rotateX,
          rotateY,
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
              <span className="font-mono text-sm tracking-widest text-white/50 uppercase">System Ready</span>
              <button onClick={() => setNodeState("SCANNING")} className="w-8 h-8 rounded-full bg-white/5 hover:bg-white/10 flex items-center justify-center transition-colors">
                <span className="text-[#7fff5e]">⛶</span>
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
              <div className="absolute top-0 left-0 w-full h-[2px] bg-[#7fff5e]/50 shadow-[0_0_15px_#7fff5e]">
                <motion.div
                  className="w-full h-full bg-[#7fff5e]"
                  animate={{ x: ["-100%", "100%"] }}
                  transition={{ repeat: Infinity, duration: 1.5, ease: "linear" }}
                />
              </div>
              <div className="flex w-full justify-between items-center mb-4 mt-2">
                <span className="font-mono text-xs text-[#7fff5e] uppercase tracking-[0.3em]">Scanning</span>
                <span className="font-mono text-[10px] text-white/40">192.168.1.X</span>
              </div>

              <div className="flex-1 w-full border border-[#7fff5e]/20 rounded bg-black/50 overflow-hidden relative mb-4">
                {/* Radar sweep effect */}
                <motion.div
                  className="absolute inset-0 bg-gradient-to-r from-transparent via-[#7fff5e]/20 to-transparent"
                  animate={{ x: ["-100%", "100%"] }}
                  transition={{ repeat: Infinity, duration: 2, ease: "linear" }}
                />
                <div className="absolute inset-0 flex items-center justify-center grid grid-cols-6 grid-rows-3 gap-1 p-2 opacity-50">
                   {radarConfig.map((config, i) => (
                     <motion.div
                        key={i}
                        className="bg-[#7fff5e]/30 rounded-[1px]"
                        animate={{ opacity: [0.1, 1, 0.1] }}
                        transition={{ duration: config.duration, repeat: Infinity, delay: config.delay }}
                     />
                   ))}
                </div>
              </div>

              <div className="flex gap-2 w-full">
                <button onClick={() => setNodeState("AUDIO")} className="flex-1 py-1.5 rounded bg-white/5 hover:bg-white/10 font-mono text-[10px] uppercase text-white/70 transition-colors">Audio Mode</button>
                <button onClick={() => setNodeState("IDLE")} className="px-3 py-1.5 rounded bg-red-500/10 hover:bg-red-500/20 text-[#ff5c71] font-mono text-[10px] uppercase transition-colors">Cancel</button>
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
              <div className="w-12 h-12 rounded-full border-2 border-[#ff5c71]/30 flex items-center justify-center bg-[#ff5c71]/10">
                <motion.div
                  className="w-4 h-4 rounded-full bg-[#ff5c71]"
                  animate={{ scale: [1, 1.5, 1] }}
                  transition={{ repeat: Infinity, duration: 0.8, ease: "easeInOut" }}
                />
              </div>

              <div className="flex-1 flex items-center gap-1 h-8">
                 {audioDurations.map((duration, i) => (
                   <motion.div
                     key={i}
                     className="flex-1 bg-[#ff5c71]/80 rounded-full"
                     animate={{ height: ["20%", "100%", "20%"] }}
                     transition={{ repeat: Infinity, duration, delay: i * 0.05 }}
                   />
                 ))}
              </div>

              <button onClick={() => setNodeState("ALERT")} className="w-8 h-8 rounded-full bg-white/5 hover:bg-white/10 flex items-center justify-center transition-colors">
                <span className="text-[#ff5c71]">⚠</span>
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
                className="text-[4rem] leading-none text-[#ff5c71] mb-2"
                style={{ fontFamily: "var(--font-anton)" }}
                animate={{ scale: [1, 1.05, 1], color: ["#ff5c71", "#ffffff", "#ff5c71"] }}
                transition={{ repeat: Infinity, duration: 1 }}
              >
                BREACH
              </motion.div>
              <p className="font-mono text-xs text-[#ff5c71]/70 tracking-widest mb-6">UNAUTHORIZED ACCESS DETECTED</p>

              <button
                onClick={() => setNodeState("IDLE")}
                className="px-6 py-2 rounded-sm bg-[#ff5c71] text-black font-black uppercase tracking-widest text-xs hover:bg-white transition-colors"
              >
                LOCKDOWN
              </button>
            </motion.div>
          )}
        </AnimatePresence>
      </motion.div>
    </div>
  );
}
