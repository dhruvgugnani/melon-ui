"use client";

import React, { useRef, useState, useEffect } from "react";
import { motion, useMotionValue, useSpring } from "framer-motion";

export interface FluidMagneticDialProps extends React.ComponentPropsWithoutRef<"div"> {
  size?: number;
  min?: number;
  max?: number;
  defaultValue?: number;
  primaryColor?: string;
  secondaryColor?: string;
  bgColor?: string;
  label?: string;
  onValueChange?: (val: number) => void;
}

export function FluidMagneticDial({
  size = 240,
  min = 0,
  max = 100,
  defaultValue = 50,
  primaryColor = "#7fff5e",
  secondaryColor = "#ff5c71",
  bgColor = "rgba(255, 255, 255, 0.03)",
  label = "INTENSITY",
  onValueChange,
  className = "",
  style,
}: FluidMagneticDialProps) {
  const containerRef = useRef<HTMLDivElement>(null);

  const [value, setValue] = useState(defaultValue);
  const [isDragging, setIsDragging] = useState(false);
  const [isHovered, setIsHovered] = useState(false);

  // We use standard React state for the display text
  const [displayText, setDisplayText] = useState(defaultValue.toFixed(0));

  const radius = size / 2;
  const trackRadius = radius * 0.7; // Inner track for the knob

  // Calculate the progress percent
  const progressPercent = (value - min) / (max - min);

  // Initialize Framer Motion values for the knob on the track circumference
  const initialAngle = progressPercent * (Math.PI * 2) - Math.PI / 2;
  const knobX = useMotionValue(Math.cos(initialAngle) * trackRadius);
  const knobY = useMotionValue(Math.sin(initialAngle) * trackRadius);

  // Smooth springs for a magnetic, fluid feel
  const springConfig = { damping: 20, stiffness: 200, mass: 0.5 };
  const smoothKnobX = useSpring(knobX, springConfig);
  const smoothKnobY = useSpring(knobY, springConfig);

  // Filter out hydration mismatches by setting an ID only once mounted
  const [filterId, setFilterId] = useState("");
  useEffect(() => {
    const timer = setTimeout(() => {
      setFilterId(`gooey-filter-${Math.random().toString(36).substring(2, 9)}`);
    }, 0);
    return () => clearTimeout(timer);
  }, []);

  const updateValueFromPosition = (clientX: number, clientY: number) => {
    if (!containerRef.current) return;
    const rect = containerRef.current.getBoundingClientRect();
    const centerX = rect.left + rect.width / 2;
    const centerY = rect.top + rect.height / 2;

    const dx = clientX - centerX;
    const dy = clientY - centerY;
    const dist = Math.hypot(dx, dy);

    let angle = Math.atan2(dy, dx) + Math.PI / 2;
    if (angle < 0) angle += Math.PI * 2;

    const progress = angle / (Math.PI * 2);
    const newValue = min + progress * (max - min);
    setValue(newValue);
    if (onValueChange) onValueChange(newValue);

    // Keep the knob on the circumference during dragging
    const dragX = (dx / (dist || 1)) * trackRadius;
    const dragY = (dy / (dist || 1)) * trackRadius;

    knobX.set(dragX);
    knobY.set(dragY);
  };

  const handlePointerDown = (e: React.PointerEvent) => {
    setIsDragging(true);
    updateValueFromPosition(e.clientX, e.clientY);
  };

  const handlePointerMove = (e: React.PointerEvent) => {
    if (isDragging) {
      updateValueFromPosition(e.clientX, e.clientY);
      setDisplayText(value.toFixed(0));
    } else if (isHovered && containerRef.current) {
      // Hover magnetic effect: pull slightly towards pointer, but keep anchored to current angle!
      const rect = containerRef.current.getBoundingClientRect();
      const centerX = rect.left + rect.width / 2;
      const centerY = rect.top + rect.height / 2;
      const mouseDx = e.clientX - centerX;
      const mouseDy = e.clientY - centerY;

      const angle = progressPercent * (Math.PI * 2) - Math.PI / 2;
      const restingX = Math.cos(angle) * trackRadius;
      const restingY = Math.sin(angle) * trackRadius;

      // Pull slightly toward mouse pointer (15% weight)
      knobX.set(restingX + (mouseDx - restingX) * 0.15);
      knobY.set(restingY + (mouseDy - restingY) * 0.15);
    }
  };

  const handlePointerUp = () => {
    setIsDragging(false);
    const angle = progressPercent * (Math.PI * 2) - Math.PI / 2;
    knobX.set(Math.cos(angle) * trackRadius);
    knobY.set(Math.sin(angle) * trackRadius);
    setDisplayText(value.toFixed(0));
  };

  const handlePointerEnter = () => {
    setIsHovered(true);
  };

  const handlePointerLeave = () => {
    setIsHovered(false);
    if (!isDragging) {
      const angle = progressPercent * (Math.PI * 2) - Math.PI / 2;
      knobX.set(Math.cos(angle) * trackRadius);
      knobY.set(Math.sin(angle) * trackRadius);
    }
  };

  // Sync knob position when value is changed externally or on mount/unmount
  useEffect(() => {
    if (!isDragging) {
      const angle = progressPercent * (Math.PI * 2) - Math.PI / 2;
      knobX.set(Math.cos(angle) * trackRadius);
      knobY.set(Math.sin(angle) * trackRadius);
    }
  }, [value, isDragging, progressPercent, trackRadius, knobX, knobY]);

  // Ensure text settles when dragging stops
  useEffect(() => {
    if (!isDragging) {
      const timer = setTimeout(() => {
        setDisplayText(value.toFixed(0));
      }, 0);
      return () => clearTimeout(timer);
    }
  }, [value, isDragging]);

  const strokeDasharray = 2 * Math.PI * trackRadius;
  const strokeDashoffset = strokeDasharray * (1 - progressPercent);

  // Interpolate colors based on progress
  const progressColor = `color-mix(in srgb, ${primaryColor} ${100 - progressPercent * 100}%, ${secondaryColor} ${progressPercent * 100}%)`;

  return (
    <div
      className={`relative flex flex-col items-center justify-center ${className}`}
      style={{ width: size, height: size, ...style }}
    >
      {/* Label and Value Display */}
      <div className="absolute top-[-40px] flex flex-col items-center pointer-events-none z-20">
        <span className="text-[10px] font-bold tracking-[0.2em] text-white/50 mb-1">{label}</span>
        <motion.div
          className="text-2xl font-mono font-bold"
          style={{ color: isDragging ? progressColor : "white" }}
          animate={{ scale: isDragging ? 1.1 : 1 }}
        >
          {displayText}
        </motion.div>
      </div>

      {/* SVG Filters for Gooey Effect */}
      {filterId && (
        <svg className="absolute w-0 h-0">
          <defs>
            <filter id={filterId}>
              <feGaussianBlur in="SourceGraphic" stdDeviation="6" result="blur" />
              <feColorMatrix
                in="blur"
                mode="matrix"
                values="1 0 0 0 0  0 1 0 0 0  0 0 1 0 0  0 0 0 25 -9"
                result="goo"
              />
              <feComposite in="SourceGraphic" in2="goo" operator="atop" />
            </filter>
          </defs>
        </svg>
      )}

      {/* The main dial area */}
      <div
        ref={containerRef}
        onPointerDown={handlePointerDown}
        onPointerMove={handlePointerMove}
        onPointerUp={handlePointerUp}
        onPointerLeave={handlePointerLeave}
        onPointerEnter={handlePointerEnter}
        className="relative rounded-full cursor-grab active:cursor-grabbing touch-none select-none flex items-center justify-center"
        style={{ width: size, height: size, filter: filterId ? `url(#${filterId})` : "none" }}
      >
        {/* Background track (subtle) */}
        <div
          className="absolute rounded-full"
          style={{
            width: size * 0.8,
            height: size * 0.8,
            background: bgColor,
            boxShadow: "inset 0 4px 20px rgba(0,0,0,0.5)"
          }}
        />

        {/* Progress Ring (SVG) */}
        <svg
          className="absolute inset-0 w-full h-full pointer-events-none -rotate-90 z-10"
          viewBox={`0 0 ${size} ${size}`}
        >
          <circle
            cx={size / 2}
            cy={size / 2}
            r={trackRadius}
            fill="none"
            stroke="rgba(255,255,255,0.12)"
            strokeWidth="8"
            strokeLinecap="round"
          />
          <motion.circle
            cx={size / 2}
            cy={size / 2}
            r={trackRadius}
            fill="none"
            stroke={progressColor}
            strokeWidth="8"
            strokeLinecap="round"
            strokeDasharray={strokeDasharray}
            strokeDashoffset={strokeDashoffset}
            style={{
              transition: isDragging ? "none" : "stroke-dashoffset 0.5s ease-out, stroke 0.5s ease-out"
            }}
          />
        </svg>

        {/* Center Base Node */}
        <div
          className="absolute rounded-full z-10"
          style={{
            width: 48,
            height: 48,
            background: "linear-gradient(135deg, rgba(255,255,255,0.15), rgba(15,15,15,0.9))",
            boxShadow: `0 0 20px ${progressColor}40`,
            border: "1px solid rgba(255,255,255,0.25)"
          }}
        />

        {/* The Draggable / Magnetic Knob */}
        <motion.div
          className="absolute rounded-full z-20 flex items-center justify-center"
          style={{
            x: smoothKnobX,
            y: smoothKnobY,
            width: 32,
            height: 32,
            background: progressColor,
            boxShadow: `0 0 15px ${progressColor}`,
          }}
        >
          <div className="w-3 h-3 rounded-full bg-black/40 border border-white/20" />
        </motion.div>
      </div>

      {/* Decorative Outer Rings */}
      <div className="absolute inset-0 rounded-full border border-white/10 pointer-events-none" style={{ margin: "-10px" }} />
      <div className="absolute inset-0 rounded-full border border-white/[0.04] pointer-events-none" style={{ margin: "-20px" }} />

      {/* Noise Texture Overlay */}
      <div
        className="absolute inset-0 opacity-20 mix-blend-overlay rounded-full pointer-events-none"
        style={{
          backgroundImage: "url('data:image/svg+xml,%3Csvg viewBox=%220 0 200 200%22 xmlns=%22http://www.w3.org/2000/svg%22%3E%3Cfilter id=%22noiseFilter%22%3E%3CfeTurbulence type=%22fractalNoise%22 baseFrequency=%220.8%22 numOctaves=%223%22 stitchTiles=%22stitch%22/%3E%3C/filter%3E%3Crect width=%22100%25%22 height=%22100%25%22 filter=%22url(%23noiseFilter)%22/%3E%3C/svg%3E')",
        }}
      />
    </div>
  );
}
