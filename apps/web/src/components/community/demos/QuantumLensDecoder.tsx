"use client";

import React, { useRef, useState, useEffect } from "react";
import { motion, useMotionValue, useSpring, useTransform, useMotionTemplate } from "framer-motion";

export interface QuantumLensDecoderProps extends React.ComponentPropsWithoutRef<"div"> {
  title?: string;
  clearText?: string;
  lensSize?: number;
  primaryColor?: string;
  secondaryColor?: string;
  bgColor?: string;
}

const CHARS = "ABCDEFGHIJKLMNOPQRSTUVWXYZ0123456789@#$%&*<>";

export function QuantumLensDecoder({
  title = "TOP SECRET",
  clearText = "PROJECT MELON IS THE FUTURE OF UI. INITIATING PROTOCOL NEON. BYPASSING SECURITY. SYSTEM COMPROMISED. FULL ACCESS GRANTED. PREPARE FOR DEPLOYMENT.",
  lensSize = 180,
  primaryColor = "#7fff5e",
  secondaryColor = "#ff5c71",
  bgColor = "#050505",
  className = "",
  style,
  ...props
}: QuantumLensDecoderProps) {
  const containerRef = useRef<HTMLDivElement>(null);

  // State for scrambled text
  const [scrambledText, setScrambledText] = useState(clearText);
  const [isHovered, setIsHovered] = useState(false);
  const [mounted, setMounted] = useState(false);

  useEffect(() => {
    const t = setTimeout(() => setMounted(true), 0);
    let interval: NodeJS.Timeout;

    // Scramble the text repeatedly
    const scramble = () => {
      let result = "";
      for (let i = 0; i < clearText.length; i++) {
        if (clearText[i] === " " || clearText[i] === ".") {
          result += clearText[i];
        } else {
          result += CHARS[Math.floor(Math.random() * CHARS.length)];
        }
      }
      setScrambledText(result);
    };

    if (mounted) {
      scramble();
      interval = setInterval(scramble, 80);
    }

    return () => {
      clearInterval(interval);
      clearTimeout(t);
    };
  }, [clearText, mounted]);

  // Framer motion values for mouse position
  const mouseX = useMotionValue(0);
  const mouseY = useMotionValue(0);

  // Smooth springs for the lens movement
  const springConfig = { damping: 25, stiffness: 200, mass: 0.5 };
  const smoothX = useSpring(mouseX, springConfig);
  const smoothY = useSpring(mouseY, springConfig);

  // Calculate percentages for 3D tilt
  const xPct = useMotionValue(0.5);
  const yPct = useMotionValue(0.5);
  const smoothXPct = useSpring(xPct, springConfig);
  const smoothYPct = useSpring(yPct, springConfig);

  const rotateX = useTransform(smoothYPct, [0, 1], [10, -10]);
  const rotateY = useTransform(smoothXPct, [0, 1], [-10, 10]);

  // Clip path template for the reveal layer
  const clipPath = useMotionTemplate`circle(${isHovered ? lensSize / 2 : 0}px at ${smoothX}px ${smoothY}px)`;

  const handleMouseMove = (e: React.MouseEvent) => {
    if (!containerRef.current) return;
    const rect = containerRef.current.getBoundingClientRect();
    const x = e.clientX - rect.left;
    const y = e.clientY - rect.top;

    mouseX.set(x);
    mouseY.set(y);
    xPct.set(x / rect.width);
    yPct.set(y / rect.height);
  };

  const handleMouseEnter = () => setIsHovered(true);
  const handleMouseLeave = () => {
    setIsHovered(false);
    // Reset tilt on leave
    xPct.set(0.5);
    yPct.set(0.5);
  };

  if (!mounted) return null;

  return (
    <div
      className={`relative w-full h-[400px] flex items-center justify-center p-8 ${className}`}
      style={{
        perspective: 1200,
        ...style
      }}
      {...props}
    >
      <motion.div
        ref={containerRef}
        onMouseMove={handleMouseMove}
        onMouseEnter={handleMouseEnter}
        onMouseLeave={handleMouseLeave}
        className="relative w-full max-w-2xl h-full rounded-2xl overflow-hidden cursor-crosshair border shadow-2xl"
        style={{
          rotateX,
          rotateY,
          transformStyle: "preserve-3d",
          backgroundColor: bgColor,
          borderColor: `${primaryColor}33`,
          boxShadow: `0 20px 50px -20px ${primaryColor}40`
        }}
      >
        {/* SVG Noise Overlay */}
        <div
          className="absolute inset-0 opacity-[0.15] mix-blend-overlay pointer-events-none z-0"
          style={{ backgroundImage: "url('data:image/svg+xml;utf8,%3Csvg viewBox=%220 0 200 200%22 xmlns=%22http://www.w3.org/2000/svg%22%3E%3Cfilter id=%22noiseFilter%22%3E%3CfeTurbulence type=%22fractalNoise%22 baseFrequency=%220.8%22 numOctaves=%223%22 stitchTiles=%22stitch%22/%3E%3C/filter%3E%3Crect width=%22100%25%22 height=%22100%25%22 filter=%22url(%23noiseFilter)%22/%3E%3C/svg%3E')" }}
        />

        {/* ================= BASE LAYER (ENCRYPTED) ================= */}
        <div className="absolute inset-0 p-8 flex flex-col z-10 select-none">
          <div className="flex justify-between items-center mb-6 border-b pb-4" style={{ borderColor: "rgba(255,255,255,0.1)" }}>
            <div className="flex items-center gap-3">
              <div className="w-2 h-2 rounded-full bg-white/20 animate-pulse" />
              <h3 className="font-mono text-sm tracking-[0.2em] text-white/40 uppercase">ENCRYPTED SIGNAL</h3>
            </div>
            <span className="font-mono text-xs text-white/30">LOCKED</span>
          </div>

          <div className="flex-1 font-mono text-sm leading-relaxed text-white/20 break-words">
            {scrambledText}
          </div>

          <div className="mt-6 flex justify-between items-end border-t pt-4" style={{ borderColor: "rgba(255,255,255,0.1)" }}>
             <div className="flex flex-col gap-1">
               <div className="h-1 w-16 bg-white/10 rounded" />
               <div className="h-1 w-24 bg-white/10 rounded" />
             </div>
             <div className="text-[10px] font-mono text-white/20 tracking-widest">
               ID: 3X9V2M1L
             </div>
          </div>
        </div>


        {/* ================= REVEAL LAYER (DECRYPTED) ================= */}
        <motion.div
          className="absolute inset-0 p-8 flex flex-col z-20 pointer-events-none select-none"
          style={{
            clipPath,
            backgroundColor: "rgba(10, 20, 10, 0.4)", // Slight tint inside lens
            backdropFilter: "blur(2px) contrast(1.2)"
          }}
        >
          <div className="flex justify-between items-center mb-6 border-b pb-4" style={{ borderColor: `${primaryColor}40` }}>
            <div className="flex items-center gap-3">
              <div className="w-2 h-2 rounded-full animate-pulse" style={{ backgroundColor: secondaryColor, boxShadow: `0 0 10px ${secondaryColor}` }} />
              <h3 className="font-mono text-sm tracking-[0.2em] uppercase font-bold" style={{ color: primaryColor, textShadow: `0 0 10px ${primaryColor}80` }}>
                {title}
              </h3>
            </div>
            <span className="font-mono text-xs font-bold" style={{ color: secondaryColor }}>DECRYPTED</span>
          </div>

          <div
            className="flex-1 font-mono text-sm leading-relaxed break-words font-medium"
            style={{ color: primaryColor, textShadow: `0 0 8px ${primaryColor}66` }}
          >
            {clearText}
          </div>

          <div className="mt-6 flex justify-between items-end border-t pt-4" style={{ borderColor: `${primaryColor}40` }}>
             <div className="flex flex-col gap-1">
               <div className="h-1 w-16 rounded" style={{ backgroundColor: primaryColor }} />
               <div className="h-1 w-24 rounded" style={{ backgroundColor: secondaryColor }} />
             </div>
             <div className="text-[10px] font-mono tracking-widest font-bold" style={{ color: primaryColor }}>
               CLEARANCE: OMEGA
             </div>
          </div>
        </motion.div>


        {/* ================= LENS RING ================= */}
        <motion.div
          className="absolute pointer-events-none z-30 rounded-full border border-dashed flex items-center justify-center"
          style={{
            width: lensSize,
            height: lensSize,
            left: 0,
            top: 0,
            opacity: isHovered ? 1 : 0,
            borderColor: secondaryColor,
            borderWidth: "2px",
            boxShadow: `0 0 20px ${secondaryColor}66, inset 0 0 20px ${primaryColor}40`,
            transform: `translate(${mouseX.get() - lensSize / 2}px, ${mouseY.get() - lensSize / 2}px)`
          }}
          animate={{
             rotate: isHovered ? 180 : 0,
             scale: isHovered ? 1 : 0.8
          }}
          transition={{
            rotate: { duration: 4, repeat: Infinity, ease: "linear" },
            scale: { duration: 0.3 }
          }}
        >
          {/* Inner ring */}
          <div
            className="absolute inset-2 rounded-full border opacity-50"
            style={{ borderColor: primaryColor }}
          />
          {/* Crosshairs */}
          <div className="absolute w-full h-[1px] opacity-30" style={{ backgroundColor: primaryColor }} />
          <div className="absolute h-full w-[1px] opacity-30" style={{ backgroundColor: primaryColor }} />
        </motion.div>

      </motion.div>
    </div>
  );
}
