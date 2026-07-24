"use client";

import * as React from "react";
import { useState, useRef, useEffect } from "react";
import { motion, AnimatePresence, useMotionValue, useSpring, useTransform } from "framer-motion";

export interface AuraMorphTerminalProps extends React.ComponentPropsWithoutRef<"div"> {
  primaryColor?: string;
  secondaryColor?: string;
  bgColor?: string;
  terminalText?: string[];
  pillText?: string;
}

const DEFAULT_TERMINAL_TEXT = [
  "INITIALIZING KERNEL...",
  "BYPASSING SECURITY PROTOCOLS...",
  "ACCESS GRANTED.",
  "ESTABLISHING SECURE CONNECTION...",
  "UPLINK READY.",
];

export function AuraMorphTerminal({
  primaryColor = "#00f0ff",
  secondaryColor = "#ff00e5",
  bgColor = "#0a0a0a",
  terminalText = DEFAULT_TERMINAL_TEXT,
  pillText = "ACTIVATE AURA",
  className = "",
  style,
  ...props
}: AuraMorphTerminalProps) {
  const [isExpanded, setIsExpanded] = useState(false);
  const containerRef = useRef<HTMLDivElement>(null);

  // Mouse position for parallax
  const mouseX = useMotionValue(0);
  const mouseY = useMotionValue(0);

  // Smooth spring for parallax
  const springConfig = { damping: 25, stiffness: 150, mass: 0.5 };
  const smoothX = useSpring(mouseX, springConfig);
  const smoothY = useSpring(mouseY, springConfig);

  // Parallax transforms
  const rotateX = useTransform(smoothY, [-0.5, 0.5], [10, -10]);
  const rotateY = useTransform(smoothX, [-0.5, 0.5], [-10, 10]);
  const translateZLayer1 = useTransform(smoothX, [-0.5, 0.5], [-20, 20]);
  const translateZLayer2 = useTransform(smoothY, [-0.5, 0.5], [-30, 30]);

  const handleMouseMove = (e: React.MouseEvent<HTMLDivElement>) => {
    if (!containerRef.current || !isExpanded) return;
    const rect = containerRef.current.getBoundingClientRect();
    const x = (e.clientX - rect.left) / rect.width - 0.5;
    const y = (e.clientY - rect.top) / rect.height - 0.5;
    mouseX.set(x);
    mouseY.set(y);
  };

  const handleMouseLeave = () => {
    if (!isExpanded) return;
    mouseX.set(0);
    mouseY.set(0);
  };

  // Typewriter effect for terminal text
  const [visibleLines, setVisibleLines] = useState<number>(0);

  useEffect(() => {
    if (isExpanded) {
      let currentLine = 0;
      const interval = setInterval(() => {
        if (currentLine < terminalText.length) {
          setVisibleLines(currentLine + 1);
          currentLine++;
        } else {
          clearInterval(interval);
        }
      }, 400); // Speed of line appearance
      return () => clearInterval(interval);
    } else {
      setTimeout(() => setVisibleLines(0), 0);
    }
  }, [isExpanded, terminalText]);

  return (
    <div
      className={`relative flex items-center justify-center w-full h-[500px] perspective-1000 ${className}`}
      style={{ ...style }}
      {...props}
    >
      <AnimatePresence mode="wait">
        {!isExpanded ? (
          <motion.button
            key="pill"
            layoutId="aura-container"
            onClick={() => setIsExpanded(true)}
            onKeyDown={(e) => e.key === 'Enter' && setIsExpanded(true)}
            aria-label="Expand Terminal"
            aria-expanded={isExpanded}
            className="relative group flex items-center justify-center px-8 py-4 rounded-full cursor-pointer overflow-hidden outline-none"
            style={{
              background: `linear-gradient(135deg, ${bgColor}, #1a1a1a)`,
              boxShadow: `0 0 20px -5px ${primaryColor}50, inset 0 0 10px ${secondaryColor}20`,
              border: `1px solid rgba(255,255,255,0.1)`
            }}
            whileHover={{ scale: 1.05 }}
            whileTap={{ scale: 0.95 }}
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, scale: 0.8, transition: { duration: 0.2 } }}
          >
            {/* Animated Gradient Border */}
            <motion.div
              className="absolute inset-0 z-0 opacity-50 group-hover:opacity-100 transition-opacity duration-500"
              style={{
                background: `linear-gradient(90deg, ${primaryColor}, ${secondaryColor}, ${primaryColor})`,
                backgroundSize: "200% 100%",
                borderRadius: "inherit",
                padding: "2px",
                WebkitMask: "linear-gradient(#fff 0 0) content-box, linear-gradient(#fff 0 0)",
                WebkitMaskComposite: "xor",
                maskComposite: "exclude"
              }}
              animate={{
                backgroundPosition: ["0% 0%", "200% 0%"]
              }}
              transition={{
                duration: 3,
                repeat: Infinity,
                ease: "linear"
              }}
            />

            {/* Glowing Aura Effect */}
            <div className="absolute inset-0 z-0 opacity-0 group-hover:opacity-30 blur-xl transition-opacity duration-500"
                 style={{ background: `linear-gradient(45deg, ${primaryColor}, ${secondaryColor})` }} />

            <span className="relative z-10 font-mono text-sm tracking-[0.2em] font-bold text-white/90 drop-shadow-md">
              {pillText}
            </span>
          </motion.button>
        ) : (
          <motion.div
            key="terminal"
            layoutId="aura-container"
            ref={containerRef}
            onMouseMove={handleMouseMove}
            onMouseLeave={handleMouseLeave}
            className="relative w-full max-w-2xl h-80 rounded-2xl overflow-hidden cursor-crosshair border border-white/10"
            style={{
              background: `linear-gradient(180deg, ${bgColor}dd, #000000ee)`,
              backdropFilter: "blur(20px)",
              boxShadow: `0 25px 50px -12px rgba(0, 0, 0, 0.5), 0 0 40px -10px ${primaryColor}40`,
              rotateX,
              rotateY,
              transformStyle: "preserve-3d"
            }}
            initial={{ borderRadius: 9999 }}
            animate={{ borderRadius: 16 }}
            transition={{ type: "spring", bounce: 0.2, duration: 0.8 }}
          >
            {/* Background Noise Texture */}
            <div
              className="absolute inset-0 z-0 opacity-20 pointer-events-none mix-blend-overlay"
              style={{
                backgroundImage: `url("data:image/svg+xml,%3Csvg viewBox='0 0 200 200' xmlns='http://www.w3.org/2000/svg'%3E%3Cfilter id='noiseFilter'%3E%3CfeTurbulence type='fractalNoise' baseFrequency='0.65' numOctaves='3' stitchTiles='stitch'/%3E%3C/filter%3E%3Crect width='100%25' height='100%25' filter='url(%23noiseFilter)'/%3E%3C/svg%3E")`,
              }}
            />

            {/* Top Bar */}
            <div className="absolute top-0 left-0 right-0 h-10 bg-white/5 border-b border-white/10 flex items-center px-4 z-20 justify-between transform-gpu translate-z-10">
              <div className="flex gap-2">
                <button
                  onClick={(e) => {
                    e.stopPropagation();
                    setIsExpanded(false);
                  }}
                  aria-label="Close Terminal"
                  className="w-3 h-3 rounded-full bg-red-500 hover:bg-red-400 transition-colors"
                />
                <div className="w-3 h-3 rounded-full bg-yellow-500" />
                <div className="w-3 h-3 rounded-full bg-green-500" />
              </div>
              <div className="font-mono text-xs text-white/30 tracking-widest">
                AURA.SYS // V1.0
              </div>
            </div>

            {/* Scanner Line Effect */}
            <motion.div
              className="absolute left-0 right-0 h-[2px] z-10 pointer-events-none"
              style={{
                background: `linear-gradient(90deg, transparent, ${primaryColor}, transparent)`,
                boxShadow: `0 0 10px ${primaryColor}`
              }}
              animate={{
                top: ["10%", "90%", "10%"],
                opacity: [0, 0.5, 0]
              }}
              transition={{
                duration: 4,
                repeat: Infinity,
                ease: "easeInOut"
              }}
            />

            {/* Content Area */}
            <div className="relative z-20 p-8 pt-16 h-full flex flex-col font-mono text-sm transform-gpu"
                 style={{ transform: "translateZ(30px)" }}>

              {/* Floating Status Node (Parallax Layer 1) */}
              <motion.div
                className="absolute top-16 right-8 w-16 h-16 rounded-full border border-white/20 flex items-center justify-center backdrop-blur-md"
                style={{
                  x: translateZLayer1,
                  y: translateZLayer2,
                  background: `radial-gradient(circle, ${secondaryColor}20 0%, transparent 70%)`
                }}
              >
                <motion.div
                  className="w-2 h-2 rounded-full"
                  style={{ backgroundColor: primaryColor, boxShadow: `0 0 10px ${primaryColor}` }}
                  animate={{ scale: [1, 1.5, 1], opacity: [0.5, 1, 0.5] }}
                  transition={{ duration: 2, repeat: Infinity }}
                />
              </motion.div>

              {/* Terminal Text Lines */}
              <div className="flex-1 overflow-hidden flex flex-col gap-2">
                {terminalText.map((line, index) => (
                  <motion.div
                    key={index}
                    initial={{ opacity: 0, x: -10 }}
                    animate={{ opacity: index < visibleLines ? 1 : 0, x: index < visibleLines ? 0 : -10 }}
                    transition={{ duration: 0.3 }}
                    className="flex items-start gap-3"
                  >
                    <span className="text-white/40 shrink-0">[{String(index + 1).padStart(2, '0')}]</span>
                    <span className="text-white/80" style={{ textShadow: `0 0 5px ${primaryColor}40` }}>
                      {line}
                    </span>
                  </motion.div>
                ))}

                {/* Blinking Cursor */}
                {visibleLines >= terminalText.length && (
                  <motion.div
                    className="flex items-start gap-3 mt-2"
                    initial={{ opacity: 0 }}
                    animate={{ opacity: 1 }}
                    transition={{ delay: 0.2 }}
                  >
                    <span className="text-white/40">[{String(terminalText.length + 1).padStart(2, '0')}]</span>
                    <span className="text-white/80">$</span>
                    <motion.div
                      className="w-2 h-4 bg-white/80"
                      animate={{ opacity: [1, 0, 1] }}
                      transition={{ duration: 0.8, repeat: Infinity, ease: "linear" }}
                    />
                  </motion.div>
                )}
              </div>

              {/* Decorative Tech Elements */}
              <div className="absolute bottom-4 left-8 right-8 flex justify-between items-end opacity-40 font-mono text-[10px]">
                <div className="flex flex-col gap-1">
                  <div className="flex gap-1">
                    {[1,2,3,4,5].map(i => (
                      <div key={i} className="w-1 h-3 bg-white/20" />
                    ))}
                  </div>
                  <span>MEM: 4096MB</span>
                </div>
                <div className="text-right">
                  <div style={{ color: secondaryColor }}>ENCRYPTED</div>
                  <span>UPLINK ACTIVE</span>
                </div>
              </div>

            </div>
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
}
