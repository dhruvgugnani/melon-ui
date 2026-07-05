"use client";

import React, { useEffect, useRef, useState } from "react";
import { createPortal } from "react-dom";
import { motion, useMotionValue, useSpring } from "framer-motion";

export interface TerminalCursorProps extends React.ComponentPropsWithoutRef<"div"> {
  containerRef?: React.RefObject<HTMLElement | null>;
  color?: string;
  size?: number;
  global?: boolean;
}

export function TerminalCursor({
  containerRef,
  color = "#7fff5e",
  size = 20,
  global = false,
  className = "",
  style,
  ...props
}: TerminalCursorProps) {
  const localRef = useRef<HTMLDivElement>(null);
  const [isInside, setIsInside] = useState(false);
  const [mounted, setMounted] = useState(false);

  // Mouse coordinate motion values
  const mouseX = useMotionValue(-100);
  const mouseY = useMotionValue(-100);

  // Smooth springs for tracking
  const springConfig = { damping: 25, stiffness: 350, mass: 0.5 };
  const smoothX = useSpring(mouseX, springConfig);
  const smoothY = useSpring(mouseY, springConfig);

  useEffect(() => {
    setMounted(true);
  }, []);

  useEffect(() => {
    if (!mounted) return;

    // Determine listener target
    let target: HTMLElement | Window = window;
    if (!global) {
      target = containerRef ? containerRef.current || window : localRef.current?.parentElement || window;
    }

    if (!target) return;

    const el = target as HTMLElement;

    // Hide normal cursor
    const originalCursor = el.style ? el.style.cursor : "";
    if (el.style) el.style.cursor = "none";

    const handleMouseMove = (e: Event) => {
      const mouseEvent = e as MouseEvent;
      if (global || target === window) {
        mouseX.set(mouseEvent.clientX);
        mouseY.set(mouseEvent.clientY);
      } else {
        const rect = el.getBoundingClientRect();
        mouseX.set(mouseEvent.clientX - rect.left);
        mouseY.set(mouseEvent.clientY - rect.top);
      }
    };

    const handleMouseEnter = () => setIsInside(true);
    const handleMouseLeave = () => setIsInside(false);

    if (global || target === window) {
      window.addEventListener("mousemove", handleMouseMove);
      document.body.addEventListener("mouseenter", handleMouseEnter);
      document.body.addEventListener("mouseleave", handleMouseLeave);
      setIsInside(true);
    } else {
      el.addEventListener("mousemove", handleMouseMove);
      el.addEventListener("mouseenter", handleMouseEnter);
      el.addEventListener("mouseleave", handleMouseLeave);
      // Determine if initial pointer is inside bounds
      setIsInside(true);
    }

    return () => {
      if (global || target === window) {
        window.removeEventListener("mousemove", handleMouseMove);
        document.body.removeEventListener("mouseenter", handleMouseEnter);
        document.body.removeEventListener("mouseleave", handleMouseLeave);
      } else {
        el.removeEventListener("mousemove", handleMouseMove);
        el.removeEventListener("mouseenter", handleMouseEnter);
        el.removeEventListener("mouseleave", handleMouseLeave);
      }
      if (el.style) el.style.cursor = originalCursor;
    };
  }, [containerRef, global, mounted]);

  const cursorElement = (
    <motion.div
      className="pointer-events-none mix-blend-screen flex items-center justify-center z-[9999]"
      style={{
        position: global ? "fixed" : "absolute",
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
        className="rounded-full flex items-center justify-center relative border transition-colors duration-300"
        style={{
          width: size,
          height: size,
          borderColor: `${color}80`,
          boxShadow: `0 0 10px ${color}33`,
        }}
      >
        {/* Center dot */}
        <div 
          className="w-1.5 h-1.5 rounded-full"
          style={{ backgroundColor: color, boxShadow: `0 0 8px ${color}` }}
        />
        
        {/* Crosshair ticks */}
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

  // Return portal if global viewport tracking is enabled
  if (global && mounted) {
    return createPortal(cursorElement, document.body);
  }

  // Local containment wrapper
  return (
    <div
      ref={localRef}
      className={`absolute inset-0 pointer-events-none overflow-hidden z-[9999] ${className}`}
      style={{ display: "block", ...style }}
      {...props}
    >
      {cursorElement}
    </div>
  );
}
