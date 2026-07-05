"use client";

import React, { useState, useRef } from "react";
import { motion, useMotionValue, useSpring, useTransform, AnimatePresence } from "framer-motion";

export interface VoidPortalRevealProps extends React.ComponentPropsWithoutRef<"div"> {
  portalText?: string;
  primaryColor?: string;
  secondaryColor?: string;
  accentColor?: string;
  revealedContent?: React.ReactNode;
}

export function VoidPortalReveal({
  portalText = "ENTER THE VOID",
  primaryColor = "#ff5c71",
  secondaryColor = "#7fff5e",
  accentColor = "#00f0ff",
  revealedContent,
  className = "",
  style,
  ...props
}: VoidPortalRevealProps) {
  const containerRef = useRef<HTMLDivElement>(null);
  const [isRevealed, setIsRevealed] = useState(false);
  const [isHovered, setIsHovered] = useState(false);

  const mouseX = useMotionValue(0);
  const mouseY = useMotionValue(0);

  // Smooth out the mouse values
  const smoothX = useSpring(mouseX, { stiffness: 50, damping: 20 });
  const smoothY = useSpring(mouseY, { stiffness: 50, damping: 20 });

  // Map mouse position to rotation and translation
  const rotateX = useTransform(smoothY, [-0.5, 0.5], [20, -20]);
  const rotateY = useTransform(smoothX, [-0.5, 0.5], [-20, 20]);

  const handleMouseMove = (e: React.MouseEvent<HTMLDivElement>) => {
    if (!containerRef.current || isRevealed) return;
    const rect = containerRef.current.getBoundingClientRect();
    const x = (e.clientX - rect.left) / rect.width - 0.5;
    const y = (e.clientY - rect.top) / rect.height - 0.5;
    mouseX.set(x);
    mouseY.set(y);
  };

  const handleMouseLeave = () => {
    if (!isRevealed) {
      mouseX.set(0);
      mouseY.set(0);
    }
    setIsHovered(false);
  };

  const handleMouseEnter = () => {
    setIsHovered(true);
  };

  // Generate rings
  const rings = Array.from({ length: 5 });

  const defaultRevealedContent = (
    <div className="flex flex-col items-center justify-center h-full w-full bg-black/40 backdrop-blur-xl rounded-2xl border border-white/10 p-8 shadow-[0_0_50px_rgba(0,0,0,0.8)] overflow-hidden relative">
      <div className="absolute inset-0 pointer-events-none opacity-[0.03]" style={{ backgroundImage: 'url("data:image/svg+xml,%3Csvg viewBox=%220 0 200 200%22 xmlns=%22http://www.w3.org/2000/svg%22%3E%3Cfilter id=%22noiseFilter%22%3E%3CfeTurbulence type=%22fractalNoise%22 baseFrequency=%220.65%22 numOctaves=%223%22 stitchTiles=%22stitch%22/%3E%3C/filter%3E%3Crect width=%22100%25%22 height=%22100%25%22 filter=%22url(%23noiseFilter)%22/%3E%3C/svg%3E")' }} />

      <motion.div
        initial={{ opacity: 0, y: 30, filter: "blur(10px)" }}
        animate={{ opacity: 1, y: 0, filter: "blur(0px)" }}
        transition={{ delay: 0.6, duration: 0.8, type: "spring" }}
        className="text-center space-y-6 relative z-10"
      >
        <div className="w-20 h-20 rounded-2xl border mx-auto flex items-center justify-center relative overflow-hidden" style={{ backgroundColor: `${primaryColor}10`, borderColor: `${primaryColor}40` }}>
          <div className="absolute inset-0 opacity-50" style={{ background: `radial-gradient(circle at center, ${primaryColor} 0%, transparent 70%)` }} />
          <span className="text-3xl relative z-10" style={{ color: primaryColor }}>✦</span>
        </div>

        <div>
          <h3 className="text-3xl font-black tracking-widest text-transparent bg-clip-text bg-gradient-to-r from-white to-gray-500">NEXUS OPEN</h3>
          <p className="text-xs text-gray-400 font-mono tracking-widest mt-2 uppercase">Secure Connection Established</p>
        </div>

        <div className="grid grid-cols-2 gap-3 w-full max-w-[240px] mx-auto mt-6">
          <div className="bg-white/5 border border-white/10 rounded-xl p-3 text-left backdrop-blur-sm relative overflow-hidden group">
            <div className="absolute inset-0 opacity-0 group-hover:opacity-20 transition-opacity" style={{ background: `linear-gradient(to bottom right, ${secondaryColor}, transparent)` }} />
            <div className="text-[10px] text-gray-500 font-mono mb-1">UPLINK</div>
            <div className="text-sm text-white font-bold tracking-wider" style={{ color: secondaryColor }}>99.9%</div>
          </div>
          <div className="bg-white/5 border border-white/10 rounded-xl p-3 text-left backdrop-blur-sm relative overflow-hidden group">
            <div className="absolute inset-0 opacity-0 group-hover:opacity-20 transition-opacity" style={{ background: `linear-gradient(to bottom right, ${accentColor}, transparent)` }} />
            <div className="text-[10px] text-gray-500 font-mono mb-1">LATENCY</div>
            <div className="text-sm text-white font-bold tracking-wider" style={{ color: accentColor }}>4ms</div>
          </div>
        </div>
      </motion.div>
    </div>
  );

  return (
    <div
      ref={containerRef}
      className={`relative w-full max-w-[400px] aspect-[4/5] rounded-[2.5rem] overflow-hidden cursor-pointer group perspective-[1200px] bg-[#030303] shadow-2xl border border-white/5 ${className}`}
      onMouseMove={handleMouseMove}
      onMouseLeave={handleMouseLeave}
      onMouseEnter={handleMouseEnter}
      onClick={() => setIsRevealed(!isRevealed)}
      style={style}
      {...props}
    >
      {/* Noise overlay for the outer card */}
      <div className="absolute inset-0 pointer-events-none opacity-[0.02] z-0" style={{ backgroundImage: 'url("data:image/svg+xml,%3Csvg viewBox=%220 0 200 200%22 xmlns=%22http://www.w3.org/2000/svg%22%3E%3Cfilter id=%22noiseFilter%22%3E%3CfeTurbulence type=%22fractalNoise%22 baseFrequency=%220.65%22 numOctaves=%223%22 stitchTiles=%22stitch%22/%3E%3C/filter%3E%3Crect width=%22100%25%22 height=%22100%25%22 filter=%22url(%23noiseFilter)%22/%3E%3C/svg%3E")' }} />

      {/* Deep Space Background */}
      <div className="absolute inset-0 opacity-40 bg-[radial-gradient(circle_at_50%_50%,_rgba(255,255,255,0.05)_0%,_transparent_60%)]" />

      {/* Portal Container */}
      <motion.div
        className="absolute inset-0 flex items-center justify-center transform-gpu"
        style={{
          rotateX: isRevealed ? 0 : rotateX,
          rotateY: isRevealed ? 0 : rotateY,
        }}
        animate={{
          scale: isRevealed ? 5 : 1,
          opacity: isRevealed ? 0 : 1,
          z: isRevealed ? 500 : 0,
        }}
        transition={{
          duration: 1.4,
          ease: [0.16, 1, 0.3, 1], // cinematic ease out
        }}
      >
        {/* Dynamic Rings */}
        {rings.map((_, i) => {
          const isOuter = i === rings.length - 1;
          const isInner = i === 0;
          return (
            <motion.div
              key={i}
              className="absolute rounded-full border transform-gpu"
              style={{
                width: `${(i + 1) * 22}%`,
                height: `${(i + 1) * 22}%`,
                borderColor: isOuter ? `${primaryColor}80` : isInner ? `${secondaryColor}80` : "rgba(255,255,255,0.15)",
                borderStyle: i % 2 === 0 ? "solid" : "dashed",
                boxShadow: isOuter ? `0 0 40px ${primaryColor}30, inset 0 0 20px ${primaryColor}20` : "none",
                borderWidth: isOuter ? "2px" : "1px",
              }}
              animate={{
                rotateZ: isHovered ? [0, i % 2 === 0 ? 180 : -180] : 0,
                rotateX: isHovered ? [0, 10, 0] : 0,
                rotateY: isHovered ? [0, -10, 0] : 0,
                scale: isHovered ? 1.05 + i * 0.03 : 1,
              }}
              transition={{
                rotateZ: {
                  duration: 15 - i * 1.5,
                  repeat: Infinity,
                  ease: "linear"
                },
                rotateX: {
                  duration: 5,
                  repeat: Infinity,
                  ease: "easeInOut"
                },
                rotateY: {
                  duration: 6,
                  repeat: Infinity,
                  ease: "easeInOut",
                  delay: 1
                },
                scale: {
                  duration: 0.8,
                  ease: "easeOut"
                }
              }}
            />
          );
        })}

        {/* Center Portal Text and Core */}
        <motion.div
          className="absolute z-10 flex flex-col items-center justify-center pointer-events-none"
          animate={{
            scale: isHovered ? 1.15 : 1,
            opacity: isHovered ? 1 : 0.7,
          }}
          transition={{ duration: 0.4 }}
        >
          <div className="relative flex flex-col items-center">
            <span className="text-sm font-black tracking-[0.5em] text-white z-10 relative drop-shadow-[0_0_10px_rgba(255,255,255,0.5)]">
              {portalText}
            </span>
            <span className="text-[8px] text-gray-500 font-mono tracking-widest mt-2 uppercase">
              Click to initiate
            </span>
            <motion.div
              className="absolute inset-0 blur-lg opacity-50 z-0"
              animate={{ opacity: isHovered ? 0.8 : 0.2 }}
              style={{ color: primaryColor }}
            >
              {portalText}
            </motion.div>
          </div>

          <motion.div
            className="w-16 h-[1px] mt-4 rounded-full"
            style={{ backgroundColor: primaryColor, boxShadow: `0 0 10px ${primaryColor}` }}
            animate={{
              width: isHovered ? 80 : 40,
              opacity: isHovered ? 1 : 0.3
            }}
          />
        </motion.div>

        {/* Deep Center Core Glow */}
        <motion.div
          className="absolute w-24 h-24 rounded-full blur-[40px] mix-blend-screen"
          style={{ backgroundColor: primaryColor }}
          animate={{
            opacity: isHovered ? 0.6 : 0.2,
            scale: isHovered ? 1.5 : 1,
          }}
          transition={{ duration: 1.2, ease: "easeOut" }}
        />

        <motion.div
          className="absolute w-12 h-12 rounded-full blur-[20px] mix-blend-screen"
          style={{ backgroundColor: secondaryColor }}
          animate={{
            opacity: isHovered ? 0.8 : 0,
            scale: isHovered ? 1.2 : 0.5,
          }}
          transition={{ duration: 0.8, delay: 0.1 }}
        />
      </motion.div>

      {/* Revealed Content */}
      <AnimatePresence>
        {isRevealed && (
          <motion.div
            className="absolute inset-0 z-20 flex items-center justify-center p-4"
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0, transition: { duration: 0.5 } }}
            transition={{ duration: 0.5, delay: 0.4 }}
          >
            {/* Backdrop for click-away */}
            <div
              className="absolute inset-0 bg-black/40 backdrop-blur-sm"
              onClick={(e) => { e.stopPropagation(); setIsRevealed(false); }}
            />

            <motion.div
              className="relative w-full h-full z-10 cursor-default"
              initial={{ scale: 0.8, opacity: 0, rotateX: 20 }}
              animate={{ scale: 1, opacity: 1, rotateX: 0 }}
              exit={{ scale: 1.1, opacity: 0 }}
              transition={{ duration: 0.7, delay: 0.5, type: "spring", bounce: 0.4 }}
              onClick={(e) => e.stopPropagation()}
            >
               {revealedContent || defaultRevealedContent}
            </motion.div>

            <motion.button
              initial={{ opacity: 0, scale: 0 }}
              animate={{ opacity: 1, scale: 1 }}
              exit={{ opacity: 0, scale: 0 }}
              transition={{ delay: 1 }}
              className="absolute top-6 right-6 z-30 w-10 h-10 rounded-full bg-white/5 hover:bg-white/20 border border-white/10 flex items-center justify-center text-white transition-all backdrop-blur-md"
              onClick={(e) => { e.stopPropagation(); setIsRevealed(false); }}
            >
              ✕
            </motion.button>
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
}
