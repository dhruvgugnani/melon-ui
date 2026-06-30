"use client";

import React, { useState, useRef, useEffect } from "react";
import { motion, useMotionValue, useSpring, useTransform, AnimatePresence } from "framer-motion";

export interface HoloSealVaultProps extends React.ComponentPropsWithoutRef<"div"> {
  vaultTitle?: string;
  vaultDescription?: string;
  sealColor?: string;
  accentColor?: string;
  contentNode?: React.ReactNode;
}

export function HoloSealVault({
  vaultTitle = "CLASSIFIED_DATA",
  vaultDescription = "ENCRYPTED SECTOR. AUTHORIZATION REQUIRED.",
  sealColor = "#ff5c71",
  accentColor = "#7fff5e",
  contentNode,
  className,
  style,
}: HoloSealVaultProps) {
  const [isUnlocked, setIsUnlocked] = useState(false);
  const containerRef = useRef<HTMLDivElement>(null);

  // Seal physics
  const dragX = useMotionValue(0);
  const dragY = useMotionValue(0);

  const springX = useSpring(dragX, { stiffness: 400, damping: 25 });
  const springY = useSpring(dragY, { stiffness: 400, damping: 25 });

  // Calculate drag progress (distance from center)
  const distance = useTransform(() => {
    return Math.sqrt(springX.get() ** 2 + springY.get() ** 2);
  });

  // Seal starts tearing as it gets further away
  const tearProgress = useTransform(distance, [0, 200], [0, 1]);

  // Visual effects based on tear
  const sealRotate = useTransform(springX, [-200, 200], [-15, 15]);
  const sealScale = useTransform(tearProgress, [0, 0.8, 1], [1, 1.1, 0]);
  const sealOpacity = useTransform(tearProgress, [0, 0.8, 1], [1, 0.9, 0]);

  // Glitch effect on the vault when tearing
  const vaultGlitchX = useTransform(distance, [0, 150], [0, 10]);
  const vaultGlitchOpacity = useTransform(distance, [0, 150], [0, 0.5]);

  useEffect(() => {
    const unsubscribe = tearProgress.on("change", (latest) => {
      if (latest >= 0.95 && !isUnlocked) {
        setIsUnlocked(true);
      }
    });
    return () => unsubscribe();
  }, [tearProgress, isUnlocked]);

  // Generate some deterministic noise/stars for the background
  const noisePattern = Array.from({ length: 40 }).map((_, i) => ({
    x: (Math.sin(i * 12.4) * 50 + 50) + "%",
    y: (Math.cos(i * 4.3) * 50 + 50) + "%",
    size: Math.abs(Math.sin(i * 7.1)) * 3 + 1,
  }));

  return (
    <div
      ref={containerRef}
      className={`relative w-full max-w-2xl mx-auto h-[400px] rounded-2xl overflow-hidden bg-[#0a0a0a] border border-white/10 ${className || ""}`}
      style={style}
    >
      {/* Background Noise / Grid */}
      <div className="absolute inset-0 pointer-events-none opacity-20">
        <div className="absolute inset-0 bg-[radial-gradient(ellipse_at_center,_var(--tw-gradient-stops))] from-[#ffffff15] via-transparent to-transparent" />
        {noisePattern.map((point, i) => (
          <div
            key={i}
            className="absolute rounded-full bg-white/40"
            style={{
              left: point.x,
              top: point.y,
              width: point.size,
              height: point.size,
            }}
          />
        ))}
        {/* CRT Scanline */}
        <motion.div
          className="absolute inset-x-0 h-1 bg-white/5"
          animate={{ y: ["0%", "40000%"] }}
          transition={{ duration: 8, repeat: Infinity, ease: "linear" }}
        />
      </div>

      <AnimatePresence mode="wait">
        {!isUnlocked ? (
          <motion.div
            key="locked"
            className="absolute inset-0 flex flex-col items-center justify-center p-8 z-10"
            exit={{ opacity: 0, scale: 0.95, filter: "blur(10px)" }}
            transition={{ duration: 0.5, ease: "easeInOut" }}
          >
            {/* Vault Frame */}
            <motion.div
              className="relative w-full max-w-md bg-black/40 border border-white/5 rounded-xl p-8 backdrop-blur-xl overflow-hidden"
              style={{ x: vaultGlitchX }}
            >
              <div className="absolute inset-0 border-2 border-dashed border-white/10 rounded-xl" />

              <div className="text-center space-y-2 mb-12">
                <h3 className="font-['Anton'] text-3xl tracking-wider text-white uppercase">
                  {vaultTitle}
                </h3>
                <p className="font-['Outfit'] text-xs text-white/50 tracking-widest font-bold">
                  {vaultDescription}
                </p>
              </div>

              {/* The Seal Constraint Area */}
              <div className="relative h-32 flex items-center justify-center">

                {/* Visual connection wires under the seal */}
                <div className="absolute inset-x-0 h-[2px] bg-white/10 flex justify-between">
                  <div className="w-2 h-2 rounded-full bg-white/20 -mt-[3px] ml-4" />
                  <div className="w-2 h-2 rounded-full bg-white/20 -mt-[3px] mr-4" />
                </div>

                {/* The Draggable Holographic Seal */}
                <motion.div
                  drag
                  dragConstraints={{ top: 0, left: 0, right: 0, bottom: 0 }}
                  dragElastic={0.8}
                  style={{
                    x: dragX,
                    y: dragY,
                    rotate: sealRotate,
                    scale: sealScale,
                    opacity: sealOpacity,
                  }}
                  className="relative z-20 cursor-grab active:cursor-grabbing"
                  whileHover={{ scale: 1.05 }}
                  whileTap={{ scale: 0.95 }}
                >
                  <div className="relative px-8 py-4 bg-black border-2 rounded-lg overflow-hidden group shadow-2xl"
                       style={{ borderColor: sealColor, boxShadow: `0 0 40px -10px ${sealColor}80` }}>

                    {/* Holographic foil effect */}
                    <div className="absolute inset-0 opacity-50 mix-blend-screen bg-gradient-to-tr from-transparent via-white/20 to-transparent group-hover:via-white/40 transition-colors" />

                    {/* Caution stripes */}
                    <div className="absolute inset-0 opacity-20 bg-[repeating-linear-gradient(45deg,transparent,transparent_10px,#fff_10px,#fff_20px)]" />

                    <div className="relative flex items-center space-x-3">
                      <div className="w-3 h-3 rounded-full animate-pulse" style={{ backgroundColor: sealColor }} />
                      <span className="font-['Outfit'] font-black tracking-[0.2em] text-sm text-white drop-shadow-md">
                        RIP TO UNLOCK
                      </span>
                    </div>
                  </div>
                </motion.div>

                {/* Glitch Overlay rendering under the seal based on drag distance */}
                <motion.div
                  className="absolute inset-0 pointer-events-none bg-red-500/10 mix-blend-overlay"
                  style={{ opacity: vaultGlitchOpacity }}
                />
              </div>
            </motion.div>
          </motion.div>
        ) : (
          <motion.div
            key="unlocked"
            className="absolute inset-0 flex items-center justify-center p-8 z-20"
            initial={{ opacity: 0, scale: 1.1, filter: "blur(20px)" }}
            animate={{ opacity: 1, scale: 1, filter: "blur(0px)" }}
            transition={{ duration: 0.8, type: "spring", bounce: 0.4 }}
          >
            <div className="w-full h-full border border-white/20 bg-black/60 backdrop-blur-2xl rounded-xl p-6 relative overflow-hidden shadow-[0_0_100px_-20px_rgba(127,255,94,0.3)]">
              {/* Decorative Corner Borders */}
              <div className="absolute top-0 left-0 w-8 h-8 border-t-2 border-l-2 rounded-tl-xl" style={{ borderColor: accentColor }} />
              <div className="absolute bottom-0 right-0 w-8 h-8 border-b-2 border-r-2 rounded-br-xl" style={{ borderColor: accentColor }} />

              <div className="absolute top-4 right-4 flex space-x-2">
                <div className="w-2 h-2 rounded-full" style={{ backgroundColor: accentColor }} />
                <span className="font-mono text-[10px] text-white/50 tracking-widest">ACCESS_GRANTED</span>
              </div>

              <div className="mt-8 h-full">
                {contentNode || (
                  <div className="flex flex-col items-center justify-center h-full text-center space-y-6">
                    <motion.div
                      initial={{ rotate: -90, opacity: 0 }}
                      animate={{ rotate: 0, opacity: 1 }}
                      transition={{ delay: 0.2, type: "spring" }}
                      className="w-16 h-16 rounded-2xl border-2 flex items-center justify-center"
                      style={{ borderColor: accentColor, color: accentColor }}
                    >
                      <svg width="32" height="32" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                        <path d="M21 16V8a2 2 0 0 0-1-1.73l-7-4a2 2 0 0 0-2 0l-7 4A2 2 0 0 0 3 8v8a2 2 0 0 0 1 1.73l7 4a2 2 0 0 0 2 0l7-4A2 2 0 0 0 21 16z" />
                        <polyline points="3.27 6.96 12 12.01 20.73 6.96" />
                        <line x1="12" y1="22.08" x2="12" y2="12" />
                      </svg>
                    </motion.div>

                    <div className="space-y-2">
                      <h4 className="font-['Outfit'] font-bold text-2xl text-white">DECRYPTED PAYLOAD</h4>
                      <p className="font-sans text-sm text-white/60 max-w-sm">
                        The physical security seal has been breached. Welcome to the inner systems.
                      </p>
                    </div>

                    <motion.button
                      whileHover={{ scale: 1.05 }}
                      whileTap={{ scale: 0.95 }}
                      onClick={() => setIsUnlocked(false)}
                      className="px-6 py-2 rounded-full bg-white/5 border border-white/10 text-white text-xs font-bold tracking-widest hover:bg-white/10 transition-colors"
                    >
                      RE-SEAL VAULT
                    </motion.button>
                  </div>
                )}
              </div>
            </div>
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
}
