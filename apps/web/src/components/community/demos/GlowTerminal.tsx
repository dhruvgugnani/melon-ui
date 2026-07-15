"use client";

import React, { useState, useEffect, useRef } from "react";
import { motion, AnimatePresence, useMotionValue, useSpring, useTransform } from "framer-motion";

interface GlowTerminalProps extends React.HTMLAttributes<HTMLDivElement> {
  primaryColor?: string;
  secondaryColor?: string;
  bgColor?: string;
  logs?: { id: string; time: string; message: string; type: "info" | "success" | "warning" | "error" }[];
}

const DEFAULT_GLOW_LOGS: GlowTerminalProps["logs"] = [
  { id: "1", time: "00:00:01", message: "SYSTEM_BOOT: AURA_CORE_INITIALIZED", type: "info" },
  { id: "2", time: "00:00:03", message: "NEURAL LINK ESTABLISHED", type: "success" },
  { id: "3", time: "00:00:05", message: "AURA SYNC IN PROGRESS...", type: "warning" },
  { id: "4", time: "00:00:07", message: "MORPH SEQUENCE READY", type: "success" },
];

export function GlowTerminal({
  primaryColor = "#ff5c71",
  secondaryColor = "#7fff5e",
  bgColor = "#0a0a0a",
  logs = DEFAULT_GLOW_LOGS,
  className = "",
  style,
  ...props
}: GlowTerminalProps) {
  const [isExpanded, setIsExpanded] = useState(false);
  const [mounted, setMounted] = useState(false);
  const containerRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    const t = setTimeout(() => setMounted(true), 0);
    return () => clearTimeout(t);
  }, []);

  // Mouse tracking for magnetic effect (when closed) and 3D parallax (when open)
  const mouseX = useMotionValue(0);
  const mouseY = useMotionValue(0);

  // Smooth springs
  const springConfig = { damping: 25, stiffness: 150 };
  const springX = useSpring(mouseX, springConfig);
  const springY = useSpring(mouseY, springConfig);

  // 3D Parallax rotations (only active when expanded)
  const rotateX = useTransform(springY, [-0.5, 0.5], ["10deg", "-10deg"]);
  const rotateY = useTransform(springX, [-0.5, 0.5], ["-10deg", "10deg"]);

  // Magnetic translation (only active when closed)
  const translateX = useTransform(springX, [-0.5, 0.5], [-30, 30]);
  const translateY = useTransform(springY, [-0.5, 0.5], [-30, 30]);

  const handleMouseMove = (e: React.MouseEvent<HTMLDivElement>) => {
    if (!containerRef.current) return;
    const rect = containerRef.current.getBoundingClientRect();
    const x = e.clientX - rect.left;
    const y = e.clientY - rect.top;

    // Normalize to -0.5 to 0.5
    const xPct = x / rect.width - 0.5;
    const yPct = y / rect.height - 0.5;

    mouseX.set(xPct);
    mouseY.set(yPct);
  };

  const handleMouseLeave = () => {
    mouseX.set(0);
    mouseY.set(0);
  };

  const toggleExpand = () => {
    setIsExpanded((prev) => !prev);
    mouseX.set(0);
    mouseY.set(0);
  };

  if (!mounted) return null;

  return (
    <div
      ref={containerRef}
      className={`relative w-full min-h-[500px] flex items-center justify-center perspective-1000 ${className}`}
      onMouseMove={handleMouseMove}
      onMouseLeave={handleMouseLeave}
      style={style}
      {...props}
    >
      <motion.div
        className="relative flex items-center justify-center z-10 w-full h-full"
        style={{
          rotateX: isExpanded ? rotateX : 0,
          rotateY: isExpanded ? rotateY : 0,
          x: isExpanded ? 0 : translateX,
          y: isExpanded ? 0 : translateY,
          transformStyle: "preserve-3d",
        }}
      >
        <motion.div
          layout
          onClick={toggleExpand}
          className={`
            cursor-pointer overflow-hidden backdrop-blur-xl border border-white/10
            ${isExpanded ? "w-full max-w-2xl h-[400px] rounded-2xl" : "w-24 h-24 rounded-[2rem]"}
          `}
          style={{
            background: `linear-gradient(145deg, ${bgColor}ee, rgba(5,5,5,0.9))`,
            boxShadow: isExpanded
              ? `0 30px 60px rgba(0,0,0,0.8), 0 0 40px ${primaryColor}20, inset 0 0 20px rgba(255,255,255,0.05)`
              : `0 10px 30px rgba(0,0,0,0.8), 0 0 30px ${primaryColor}40, inset 0 0 10px ${secondaryColor}30`,
          }}
          transition={{
            layout: { type: "spring", bounce: 0.2, duration: 0.8 },
          }}
          whileHover={{ scale: isExpanded ? 1 : 1.05 }}
          whileTap={{ scale: 0.95 }}
        >
          {/* Subtle noise overlay */}
          <div
            className="absolute inset-0 opacity-[0.15] pointer-events-none mix-blend-overlay"
            style={{
              backgroundImage: `url("data:image/svg+xml,%3Csvg viewBox='0 0 200 200' xmlns='http://www.w3.org/2000/svg'%3E%3Cfilter id='noiseFilter'%3E%3CfeTurbulence type='fractalNoise' baseFrequency='0.8' numOctaves='3' stitchTiles='stitch'/%3E%3C/filter%3E%3Crect width='100%25' height='100%25' filter='url(%23noiseFilter)'/%3E%3C/svg%3E")`,
            }}
          />

          <AnimatePresence mode="wait">
            {!isExpanded ? (
              <motion.div
                key="closed"
                initial={{ opacity: 0, scale: 0.8 }}
                animate={{ opacity: 1, scale: 1 }}
                exit={{ opacity: 0, scale: 0.5 }}
                transition={{ duration: 0.3 }}
                className="w-full h-full flex items-center justify-center relative"
              >
                {/* Glowing Core */}
                <motion.div
                  className="w-8 h-8 rounded-full"
                  style={{
                    background: primaryColor,
                    boxShadow: `0 0 20px ${primaryColor}, 0 0 40px ${secondaryColor}`,
                  }}
                  animate={{
                    scale: [1, 1.2, 1],
                    opacity: [0.8, 1, 0.8],
                  }}
                  transition={{
                    duration: 2,
                    repeat: Infinity,
                    ease: "easeInOut",
                  }}
                />

                {/* Orbiting Ring */}
                <motion.div
                  className="absolute inset-2 rounded-full border border-white/20"
                  animate={{ rotate: 360 }}
                  transition={{ duration: 8, repeat: Infinity, ease: "linear" }}
                >
                  <div className="absolute top-0 left-1/2 w-2 h-2 -ml-1 -mt-1 rounded-full" style={{ background: secondaryColor, boxShadow: `0 0 10px ${secondaryColor}` }} />
                </motion.div>
              </motion.div>
            ) : (
              <motion.div
                key="open"
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                exit={{ opacity: 0 }}
                transition={{ duration: 0.4, delay: 0.2 }}
                className="w-full h-full flex flex-col p-6"
              >
                {/* Terminal Header */}
                <div className="flex items-center justify-between mb-6 pb-4 border-b border-white/10">
                  <div className="flex items-center gap-3">
                    <div className="flex gap-1.5">
                      <div className="w-3 h-3 rounded-full bg-red-500/80" />
                      <div className="w-3 h-3 rounded-full bg-yellow-500/80" />
                      <div className="w-3 h-3 rounded-full bg-green-500/80" />
                    </div>
                    <span className="text-xs font-mono text-gray-400 tracking-widest uppercase ml-2">
                      Aura_Morph_Term v1.0
                    </span>
                  </div>
                  <div className="flex items-center gap-2">
                    <span className="relative flex h-2 w-2">
                      <span className="animate-ping absolute inline-flex h-full w-full rounded-full opacity-75" style={{ backgroundColor: secondaryColor }}></span>
                      <span className="relative inline-flex rounded-full h-2 w-2" style={{ backgroundColor: secondaryColor }}></span>
                    </span>
                    <span className="text-xs font-mono" style={{ color: secondaryColor }}>ONLINE</span>
                  </div>
                </div>

                {/* Terminal Body */}
                <div className="flex-1 overflow-hidden flex flex-col gap-2 font-mono text-sm">
                  {logs?.map((log, index) => (
                    <motion.div
                      key={log.id}
                      initial={{ opacity: 0, x: -20 }}
                      animate={{ opacity: 1, x: 0 }}
                      transition={{ delay: 0.4 + index * 0.1 }}
                      className="flex items-start gap-4"
                    >
                      <span className="text-gray-500 shrink-0">[{log.time}]</span>
                      <span
                        style={{
                          color:
                            log.type === "error" ? primaryColor :
                            log.type === "success" ? secondaryColor :
                            log.type === "warning" ? "#fbbf24" :
                            "#9ca3af"
                        }}
                      >
                        {log.message}
                      </span>
                    </motion.div>
                  ))}

                  {/* Blinking Cursor line */}
                  <motion.div
                    initial={{ opacity: 0 }}
                    animate={{ opacity: 1 }}
                    transition={{ delay: 0.4 + (logs?.length || 0) * 0.1 }}
                    className="flex items-center gap-2 mt-2"
                  >
                    <span className="text-gray-500">root@melonui:~#</span>
                    <motion.span
                      animate={{ opacity: [1, 0] }}
                      transition={{ duration: 0.8, repeat: Infinity, ease: "linear" }}
                      className="w-2 h-4"
                      style={{ backgroundColor: primaryColor }}
                    />
                  </motion.div>
                </div>

                {/* Decorative Grid Background for Terminal */}
                <div
                  className="absolute inset-0 pointer-events-none z-[-1] opacity-20"
                  style={{
                    backgroundImage: `linear-gradient(to right, ${primaryColor}10 1px, transparent 1px), linear-gradient(to bottom, ${primaryColor}10 1px, transparent 1px)`,
                    backgroundSize: '20px 20px',
                    maskImage: 'radial-gradient(ellipse at center, black 0%, transparent 80%)',
                    WebkitMaskImage: 'radial-gradient(ellipse at center, black 0%, transparent 80%)'
                  }}
                />
              </motion.div>
            )}
          </AnimatePresence>
        </motion.div>
      </motion.div>
    </div>
  );
}
