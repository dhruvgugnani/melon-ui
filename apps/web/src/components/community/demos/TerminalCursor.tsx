"use client";

import React, { useRef, useState, useEffect } from "react";

export interface TerminalCursorDemoProps extends React.ComponentPropsWithoutRef<"div"> {
  primaryColor?: string;
  borderColor?: string;
}

export function TerminalCursor({
  primaryColor = "#7fff5e",
  borderColor = "#1a1a1a",
  className = "",
  style,
  ...props
}: TerminalCursorDemoProps) {
  const containerRef = useRef<HTMLDivElement>(null);
  const [color, setColor] = useState(primaryColor);
  const [size, setSize] = useState(24);

  const colors = ["#7fff5e", "#ff5c71", "#00f0ff", "#ffaa00", "#ffffff"];

  return (
    <div
      ref={containerRef}
      className={`w-full h-80 relative overflow-hidden rounded-2xl border flex flex-col items-center justify-between p-6 select-none bg-[#050505] group ${className}`}
      style={{
        borderColor: borderColor,
        cursor: "none", // Hide the native pointer inside container
        ...style
      }}
      {...props}
    >
      {/* Precision Crosshair Standalone Cursor attached to container */}
      <TerminalCursorComponent
        containerRef={containerRef}
        color={color}
        size={size}
      />

      <div className="w-full flex justify-between items-start z-10 pointer-events-auto">
        <div className="flex gap-1.5">
          {colors.map((c) => (
            <button
              key={c}
              onClick={(e) => {
                e.stopPropagation();
                setColor(c);
              }}
              className="w-4 h-4 rounded-full border border-white/10 hover:scale-110 active:scale-90 transition-transform"
              style={{ backgroundColor: c, boxShadow: color === c ? `0 0 8px ${c}` : "none" }}
            />
          ))}
        </div>
        <span className="font-mono text-[9px] tracking-widest text-white/30 uppercase">Terminal Cursor Demo</span>
      </div>

      <div className="text-center z-10 pointer-events-none">
        <p className="font-sans font-bold text-lg text-white mb-1 uppercase tracking-wider">Move Mouse Here</p>
        <p className="font-mono text-[10px] text-white/40 uppercase tracking-widest">Spring Velocity Crosshair</p>
      </div>

      <div className="w-full flex justify-between items-end z-10 pointer-events-auto">
        <div className="flex gap-2">
          <button
            onClick={(e) => { e.stopPropagation(); setSize(16); }}
            className={`px-2 py-0.5 font-mono text-[9px] border rounded transition-colors uppercase ${size === 16 ? "bg-white text-black border-white" : "border-white/10 text-white/50 hover:text-white"}`}
          >
            Small
          </button>
          <button
            onClick={(e) => { e.stopPropagation(); setSize(24); }}
            className={`px-2 py-0.5 font-mono text-[9px] border rounded transition-colors uppercase ${size === 24 ? "bg-white text-black border-white" : "border-white/10 text-white/50 hover:text-white"}`}
          >
            Medium
          </button>
          <button
            onClick={(e) => { e.stopPropagation(); setSize(32); }}
            className={`px-2 py-0.5 font-mono text-[9px] border rounded transition-colors uppercase ${size === 32 ? "bg-white text-black border-white" : "border-white/10 text-white/50 hover:text-white"}`}
          >
            Large
          </button>
        </div>
        <span className="font-mono text-[9px] text-[#7fff5e]/60 tracking-widest uppercase">System Locked</span>
      </div>
    </div>
  );
}

// Local re-export helper component to avoid path confusion in showcase bundle
import { motion, useMotionValue, useSpring } from "framer-motion";

function TerminalCursorComponent({
  containerRef,
  color,
  size
}: {
  containerRef: React.RefObject<HTMLDivElement | null>;
  color: string;
  size: number;
}) {
  const [isInside, setIsInside] = useState(false);
  const mouseX = useMotionValue(-100);
  const mouseY = useMotionValue(-100);

  const springConfig = { damping: 25, stiffness: 350, mass: 0.5 };
  const smoothX = useSpring(mouseX, springConfig);
  const smoothY = useSpring(mouseY, springConfig);

  useEffect(() => {
    const el = containerRef.current;
    if (!el) return;

    const handleMouseMove = (e: MouseEvent) => {
      const rect = el.getBoundingClientRect();
      mouseX.set(e.clientX - rect.left);
      mouseY.set(e.clientY - rect.top);
    };

    const handleMouseEnter = () => setIsInside(true);
    const handleMouseLeave = () => setIsInside(false);

    el.addEventListener("mousemove", handleMouseMove);
    el.addEventListener("mouseenter", handleMouseEnter);
    el.addEventListener("mouseleave", handleMouseLeave);

    return () => {
      el.removeEventListener("mousemove", handleMouseMove);
      el.removeEventListener("mouseenter", handleMouseEnter);
      el.removeEventListener("mouseleave", handleMouseLeave);
    };
  }, [containerRef]);

  return (
    <motion.div
      className="absolute pointer-events-none mix-blend-screen flex items-center justify-center z-[9999]"
      style={{
        left: 0,
        top: 0,
        x: smoothX,
        y: smoothY,
        translateX: "-50%",
        translateY: "-50%",
        display: isInside ? "flex" : "none",
      }}
    >
      <div 
        className="rounded-full flex items-center justify-center relative border transition-all duration-300"
        style={{
          width: size,
          height: size,
          borderColor: `${color}80`,
          boxShadow: `0 0 10px ${color}33`,
        }}
      >
        <div 
          className="w-1.5 h-1.5 rounded-full"
          style={{ backgroundColor: color, boxShadow: `0 0 8px ${color}` }}
        />
        <div 
          className="absolute w-[1px] h-2 -top-2.5 left-1/2 -translate-x-1/2" 
          style={{ backgroundColor: `${color}cc` }} 
        />
        <div 
          className="absolute w-[1px] h-2 -bottom-2.5 left-1/2 -translate-x-1/2" 
          style={{ backgroundColor: `${color}cc` }} 
        />
        <div 
          className="absolute w-2 h-[1px] -left-2.5 top-1/2 -translate-y-1/2" 
          style={{ backgroundColor: `${color}cc` }} 
        />
        <div 
          className="absolute w-2 h-[1px] -right-2.5 top-1/2 -translate-y-1/2" 
          style={{ backgroundColor: `${color}cc` }} 
        />
      </div>
    </motion.div>
  );
}
