"use client";

import React, { useRef } from "react";
import { motion, useMotionValue, useSpring, useTransform } from "framer-motion";

export interface TactileCyberBadgeProps extends React.ComponentPropsWithoutRef<"div"> {
  name?: string;
  role?: string;
  idNumber?: string;
  primaryColor?: string;
  accentColor?: string;
  companyName?: string;
}

export const TactileCyberBadge: React.FC<TactileCyberBadgeProps> = ({
  name = "ALEX CHEN",
  role = "LEAD ENGINEER",
  idNumber = "M-99201",
  primaryColor = "#ff5c71",
  accentColor = "#7fff5e",
  companyName = "MELON_UI //",
  className = "",
  style,
  ...props
}) => {
  const containerRef = useRef<HTMLDivElement>(null);

  // Motion values for drag
  const x = useMotionValue(0);
  const y = useMotionValue(0);

  // Smooth springs for physics
  const springConfig = { damping: 15, stiffness: 120, mass: 1.2 };
  const springX = useSpring(x, springConfig);
  const springY = useSpring(y, springConfig);

  // 3D Tilt based on drag offset
  const rotateX = useTransform(springY, [-300, 300], [25, -25]);
  const rotateY = useTransform(springX, [-300, 300], [-25, 25]);

  // Lanyard string physics
  const lanyardPath = useTransform([springX, springY], ([latestX, latestY]) => {
    const bX = latestX as number;
    const bY = latestY as number;

    // Top-center anchor point (assuming 600px container, so -300 from center)
    const startX = 0;
    const startY = -300;

    // Badge attachment point (top center of the badge)
    const endX = bX;
    const endY = bY - 180;

    // Control point for realistic gravity sag
    const ctrlX = (startX + endX) / 2;
    // Add extra slack when badge is pulled up
    const slack = Math.max(0, 150 - Math.abs(endY - startY));
    const ctrlY = Math.max(startY, endY) + 50 + slack;

    return `M ${startX} ${startY} Q ${ctrlX} ${ctrlY} ${endX} ${endY}`;
  });

  return (
    <div
      ref={containerRef}
      className={`relative w-full h-[600px] bg-[#050505] overflow-hidden flex items-center justify-center [perspective:1200px] ${className}`}
      style={style}
      {...props}
    >
      {/* Background Subtle Grid */}
      <div
        className="absolute inset-0 opacity-[0.03] pointer-events-none"
        style={{
          backgroundImage: `linear-gradient(rgba(255,255,255,1) 1px, transparent 1px), linear-gradient(90deg, rgba(255,255,255,1) 1px, transparent 1px)`,
          backgroundSize: "40px 40px"
        }}
      />

      {/* Floating Ambience Particles (Deterministic) */}
      <div className="absolute inset-0 pointer-events-none overflow-hidden z-0">
        {[...Array(6)].map((_, i) => (
          <motion.div
            key={i}
            className="absolute rounded-full"
            style={{
              width: (i % 3 + 1) * 3 + 'px',
              height: (i % 3 + 1) * 3 + 'px',
              backgroundColor: i % 2 === 0 ? primaryColor : accentColor,
              left: `${15 + (i * 17)}%`,
              top: `${20 + (i * 13)}%`,
              opacity: 0.3,
              filter: "blur(2px)"
            }}
            animate={{
              y: [0, -30, 0],
              opacity: [0.1, 0.5, 0.1]
            }}
            transition={{
              duration: 4 + (i % 3),
              repeat: Infinity,
              ease: "easeInOut",
              delay: i * 0.5
            }}
          />
        ))}
      </div>

      {/* Dynamic Lanyard SVG (Centered origin) */}
      <div className="absolute top-1/2 left-1/2 w-0 h-0 z-0 pointer-events-none">
        <svg className="overflow-visible w-0 h-0 pointer-events-none">
          <motion.path
            d={lanyardPath}
            fill="none"
            stroke="url(#lanyard-gradient)"
            strokeWidth="8"
            strokeLinecap="round"
            style={{ filter: "drop-shadow(0px 10px 10px rgba(0,0,0,0.5))" }}
          />
          <defs>
            <linearGradient id="lanyard-gradient" x1="0%" y1="0%" x2="0%" y2="100%">
              <stop offset="0%" stopColor="#111" />
              <stop offset="100%" stopColor={primaryColor} />
            </linearGradient>
          </defs>
        </svg>
      </div>

      {/* The Badge */}
      <motion.div
        style={{
          x,
          y,
          rotateX,
          rotateY,
          transformStyle: "preserve-3d"
        }}
        drag
        dragConstraints={{ left: 0, right: 0, top: 0, bottom: 0 }}
        dragElastic={0.4}
        whileHover={{ scale: 1.02 }}
        whileDrag={{ scale: 1.05, cursor: "grabbing" }}
        className="relative z-10 w-[260px] h-[360px] cursor-grab"
      >
        {/* Badge Glass Body */}
        <div className="absolute inset-0 rounded-3xl bg-white/[0.03] backdrop-blur-xl border border-white/10 overflow-hidden shadow-2xl flex flex-col">

          {/* Subtle noise texture */}
          <div className="absolute inset-0 opacity-[0.04] mix-blend-overlay pointer-events-none bg-[url('https://grainy-gradients.vercel.app/noise.svg')]" />

          {/* Top Metallic Clip Section */}
          <div className="h-16 w-full border-b border-white/10 bg-white/[0.02] relative flex items-center justify-center">
            {/* The Hole for Lanyard */}
            <div className="w-14 h-3 rounded-full bg-black/60 shadow-inner border border-white/5 absolute top-3" />
            <div className="mt-6 font-mono text-[10px] text-white/30 tracking-[0.2em]">{companyName}</div>
          </div>

          {/* Holographic Element */}
          <div className="absolute top-20 right-5 w-12 h-12 rounded-full border border-white/10 flex items-center justify-center bg-black/40 overflow-hidden shadow-inner">
            <motion.div
              animate={{ rotate: 360 }}
              transition={{ duration: 8, repeat: Infinity, ease: "linear" }}
              className="w-full h-full"
              style={{
                background: `conic-gradient(from 0deg, transparent 0%, ${accentColor} 50%, transparent 100%)`,
                opacity: 0.8
              }}
            />
            <div className="absolute inset-[2px] rounded-full bg-[#111] flex items-center justify-center shadow-inner border border-white/5">
              <div className="w-3 h-3 rounded-full bg-white/20 animate-pulse" />
            </div>
          </div>

          {/* Profile Section */}
          <div className="px-6 pt-6 flex-1 flex flex-col justify-end pb-6 relative z-10">
            {/* Avatar Mock */}
            <div className="w-20 h-20 rounded-2xl mb-4 bg-gradient-to-br from-white/10 to-transparent border border-white/10 p-1 backdrop-blur-md shadow-lg">
              <div className="w-full h-full rounded-xl bg-[#0a0a0a] overflow-hidden relative flex items-end justify-center">
                <div className="absolute inset-0 opacity-30" style={{ background: `linear-gradient(135deg, ${primaryColor}, ${accentColor})` }} />
                <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5" className="w-16 h-16 text-white/60 translate-y-3">
                  <path strokeLinecap="round" strokeLinejoin="round" d="M16 7a4 4 0 11-8 0 4 4 0 018 0zM12 14a7 7 0 00-7 7h14a7 7 0 00-7-7z" />
                </svg>
              </div>
            </div>

            <div className="space-y-1 mb-6">
              <h2 className="font-['Outfit'] text-2xl font-bold text-white tracking-tight uppercase leading-none drop-shadow-md">{name}</h2>
              <p className="font-mono text-[10px] text-white/60 tracking-wider" style={{ color: primaryColor }}>{role}</p>
            </div>

            <div className="pt-4 border-t border-white/10 flex justify-between items-end">
              <div>
                <p className="font-mono text-[8px] text-white/40 mb-1">ID NO.</p>
                <p className="font-mono text-xs text-white/80">{idNumber}</p>
              </div>

              {/* Barcode Mock */}
              <div className="flex gap-[2px] h-6 opacity-50">
                {[2,1,3,1,1,2,3,1,2,1].map((w, i) => (
                  <div key={i} className="bg-white h-full rounded-sm" style={{ width: `${w * 2}px` }} />
                ))}
              </div>
            </div>
          </div>

          {/* Bottom Edge LED Strip */}
          <div className="h-[3px] w-full mt-auto" style={{ background: `linear-gradient(90deg, ${primaryColor}, ${accentColor})`, boxShadow: `0 -5px 15px ${primaryColor}40` }} />
        </div>

        {/* 3D Glare Overlay Effect */}
        <motion.div
          className="absolute inset-0 rounded-3xl pointer-events-none mix-blend-overlay"
          style={{
            background: useTransform(
              [springX, springY],
              ([x, y]) => {
                // Normalize position relative to drag bounds
                const posX = ((x as number) + 300) / 600 * 100;
                const posY = ((y as number) + 300) / 600 * 100;
                return `radial-gradient(circle at ${posX}% ${posY}%, rgba(255,255,255,0.4) 0%, transparent 50%)`;
              }
            )
          }}
        />
      </motion.div>
    </div>
  );
};
