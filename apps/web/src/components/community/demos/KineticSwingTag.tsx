"use client";

import React, { useRef, useState, useEffect } from "react";
import { motion, useMotionValue, useSpring, useTransform, useVelocity, useAnimationFrame } from "framer-motion";

export interface KineticSwingTagProps extends React.ComponentPropsWithoutRef<"div"> {
  tagWidth?: number;
  tagHeight?: number;
  primaryColor?: string;
  secondaryColor?: string;
  brandName?: string;
  seriesText?: string;
}

export function KineticSwingTag({
  tagWidth = 260,
  tagHeight = 400,
  primaryColor = "#ff5c71",
  secondaryColor = "#7fff5e",
  brandName = "MELON",
  seriesText = "S/S 2024 ARCHIVE",
  className = "",
  style,
  ...props
}: KineticSwingTagProps) {
  const containerRef = useRef<HTMLDivElement>(null);
  const tagRef = useRef<HTMLDivElement>(null);

  const [mounted, setMounted] = useState(false);

  // Positioning
  const x = useMotionValue(0);
  const y = useMotionValue(0);

  // Physics config
  const springConfig = { damping: 15, stiffness: 120, mass: 1.5 };

  // Springs for the tag's physical position
  const springX = useSpring(x, springConfig);
  const springY = useSpring(y, springConfig);

  // We keep springY if we want to use its value or velocity for additional physics later,
  // but we can also safely use it in the style tag for y if we want physical dampening on Y as well.

  // Calculate velocity for realistic swing
  const xVelocity = useVelocity(springX);

  // Map horizontal velocity to rotation angle (swinging effect)
  const rotateZ = useTransform(xVelocity, [-1000, 1000], [-35, 35]);
  const smoothRotateZ = useSpring(rotateZ, { damping: 20, stiffness: 200 });

  // Springy string attachment point
  const [stringPath, setStringPath] = useState("");

  // Holographic glare tracking
  const glareX = useMotionValue(50);
  const glareY = useMotionValue(50);
  const glareOpacity = useMotionValue(0);

  const glareBackground = useTransform(
    [glareX, glareY],
    ([gx, gy]) =>
      `radial-gradient(circle at ${gx}% ${gy}%, rgba(255,255,255,0.8) 0%, transparent 60%)`
  );

  useEffect(() => {
    const t = setTimeout(() => setMounted(true), 0);
    return () => clearTimeout(t);
  }, []);

  // Animate the string path every frame to follow the tag
  useAnimationFrame(() => {
    if (!tagRef.current || !containerRef.current) return;

    const containerRect = containerRef.current.getBoundingClientRect();

    // Top anchor point (center top of container)
    const anchorX = containerRect.width / 2;
    const anchorY = 0;

    // Actually, getting the real eyelet position from the DOM is more accurate
    const eyeletEl = tagRef.current.querySelector('.eyelet') as HTMLElement;
    if (eyeletEl) {
      const eyeletRect = eyeletEl.getBoundingClientRect();
      const targetX = eyeletRect.left + eyeletRect.width / 2 - containerRect.left;
      const targetY = eyeletRect.top + eyeletRect.height / 2 - containerRect.top;

      // Calculate a bezier curve that hangs slightly
      const cp1X = anchorX;
      const cp1Y = targetY * 0.4;
      const cp2X = targetX;
      const cp2Y = targetY * 0.6;

      setStringPath(`M ${anchorX} ${anchorY} C ${cp1X} ${cp1Y}, ${cp2X} ${cp2Y}, ${targetX} ${targetY}`);
    }
  });


  const handleMouseMove = (e: React.MouseEvent<HTMLDivElement>) => {
    if (!tagRef.current) return;
    const rect = tagRef.current.getBoundingClientRect();
    const xPct = ((e.clientX - rect.left) / rect.width) * 100;
    const yPct = ((e.clientY - rect.top) / rect.height) * 100;
    glareX.set(xPct);
    glareY.set(yPct);
  };

  if (!mounted) return null;

  return (
    <div
      ref={containerRef}
      className={`relative w-full h-[600px] overflow-hidden bg-[#050505] flex items-center justify-center font-['Outfit'] ${className}`}
      style={style}
      {...props}
    >
      {/* Background ambient light */}
      <div className="absolute inset-0 opacity-20 pointer-events-none">
        <div className="absolute top-0 left-1/2 -translate-x-1/2 w-[600px] h-[600px] bg-gradient-to-b from-white/10 to-transparent blur-3xl rounded-full mix-blend-screen" />
      </div>

      {/* The String */}
      <svg className="absolute inset-0 w-full h-full pointer-events-none z-10" style={{ overflow: 'visible' }}>
        <path
          d={stringPath}
          fill="none"
          stroke="rgba(255,255,255,0.4)"
          strokeWidth="2"
          strokeLinecap="round"
          style={{ filter: 'drop-shadow(0px 10px 10px rgba(0,0,0,0.5))' }}
        />
        {/* Top anchor ring */}
        <circle cx="50%" cy="0" r="6" fill="transparent" stroke="rgba(255,255,255,0.5)" strokeWidth="3" />
        <circle cx="50%" cy="0" r="10" fill="transparent" stroke="#111" strokeWidth="4" />
      </svg>

      {/* The Tag Draggable Container */}
      <motion.div
        drag
        dragElastic={0.2}
        dragConstraints={containerRef}
        dragMomentum={true}
        dragTransition={{ bounceStiffness: 200, bounceDamping: 20 }}
        style={{
          x,
          y,
          rotateZ: smoothRotateZ,
          cursor: "grab",
          touchAction: "none"
        }}
        whileDrag={{ cursor: "grabbing", scale: 1.02 }}
        className="relative z-20 mt-12"
      >
        {/* The Tag Element */}
        <div
          ref={tagRef}
          onMouseMove={handleMouseMove}
          onMouseEnter={() => glareOpacity.set(1)}
          onMouseLeave={() => glareOpacity.set(0)}
          className="relative rounded-2xl overflow-hidden backdrop-blur-2xl shadow-[0_30px_60px_rgba(0,0,0,0.6),0_0_0_1px_rgba(255,255,255,0.1)_inset]"
          style={{
            width: tagWidth,
            height: tagHeight,
            backgroundColor: "rgba(20, 20, 22, 0.7)",
            transformOrigin: "top center",
          }}
        >
          {/* Holographic Glare */}
          <motion.div
            className="absolute inset-0 pointer-events-none z-50 mix-blend-overlay transition-opacity duration-300"
            style={{
              opacity: glareOpacity,
              background: glareBackground as unknown as string,
            }}
          />

          {/* Internal gradient lighting */}
          <div
            className="absolute inset-0 opacity-40 pointer-events-none"
            style={{
              background: `linear-gradient(135deg, ${primaryColor}40 0%, transparent 50%, ${secondaryColor}40 100%)`
            }}
          />

          {/* The Metal Eyelet */}
          <div className="absolute top-6 left-1/2 -translate-x-1/2 w-8 h-8 rounded-full bg-[#111] border-[6px] border-[#555] shadow-[inset_0_2px_10px_rgba(0,0,0,1),0_2px_4px_rgba(255,255,255,0.1)] flex items-center justify-center z-20 eyelet">
            <div className="w-2 h-2 rounded-full bg-black shadow-[inset_0_1px_3px_rgba(0,0,0,0.8)]" />
          </div>

          {/* Top Section */}
          <div className="pt-20 px-6 pb-20 h-full flex flex-col justify-between relative z-10">
            <div>
              <div className="flex justify-between items-start mb-6">
                <span className="text-[10px] tracking-[0.2em] text-white/40 font-mono">AUTH_ID: X92-B</span>
                <span className="text-[10px] tracking-widest text-white/40 font-mono border border-white/20 px-2 py-0.5 rounded-sm">01</span>
              </div>

              <h2 className="text-5xl font-black text-white tracking-tighter mb-2" style={{ fontFamily: "Anton, sans-serif" }}>
                {brandName}
              </h2>

              <div className="inline-block bg-white text-black text-[10px] font-bold px-2 py-1 mb-6 tracking-widest">
                {seriesText}
              </div>

              <div className="space-y-4 font-mono text-[11px] text-white/60">
                <div className="flex justify-between border-b border-white/10 pb-1">
                  <span>MATERIAL</span>
                  <span className="text-white">GLASS / POLY</span>
                </div>
                <div className="flex justify-between border-b border-white/10 pb-1">
                  <span>FIT</span>
                  <span className="text-white">OVERSIZED</span>
                </div>
                <div className="flex justify-between border-b border-white/10 pb-1">
                  <span>WASH</span>
                  <span className="text-white">DO NOT WASH</span>
                </div>
              </div>
            </div>

            {/* Bottom Barcode Section */}
            <div className="mt-8">
              <div className="w-full h-12 flex gap-[2px] opacity-80 mix-blend-screen">
                {/* Generated Barcode lines */}
                {Array.from({ length: 30 }).map((_, i) => (
                  <div
                    key={i}
                    className="h-full bg-white"
                    style={{
                      width: `${Math.sin(i * 0.5) * 3 + 4}px`,
                      opacity: Math.cos(i) > 0 ? 1 : 0.6
                    }}
                  />
                ))}
              </div>
              <div className="flex justify-between mt-2 font-mono text-[9px] text-white/40 tracking-[0.3em]">
                <span>8</span>
                <span>40291</span>
                <span>89320</span>
                <span>2</span>
              </div>
            </div>
          </div>

          {/* Perforated bottom tear line */}
          <div className="absolute bottom-16 left-0 w-full flex items-center justify-between px-2">
            <div className="w-3 h-3 rounded-full bg-[#050505] -ml-4 shadow-[inset_0_2px_4px_rgba(0,0,0,0.5)]" />
            <div className="flex-1 border-t-2 border-dashed border-white/20 mx-2" />
            <div className="w-3 h-3 rounded-full bg-[#050505] -mr-4 shadow-[inset_0_2px_4px_rgba(0,0,0,0.5)]" />
          </div>

          {/* Tear-off slip content */}
          <div className="absolute bottom-0 left-0 w-full h-16 bg-white/5 backdrop-blur-md flex items-center justify-center border-t border-white/10">
            <span className="font-mono text-[10px] tracking-[0.2em] text-[#ff5c71] font-bold">
              [ DETACH BEFORE WEARING ]
            </span>
          </div>

        </div>
      </motion.div>
    </div>
  );
}
