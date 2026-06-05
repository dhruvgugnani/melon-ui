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

  // We use standard React state for the display text to allow for "glitch" effects
  const [displayText, setDisplayText] = useState(defaultValue.toFixed(0));

  // Framer Motion values for the knob position
  const knobX = useMotionValue(0);
  const knobY = useMotionValue(0);

  // Smooth springs for a magnetic, fluid feel
  const springConfig = { damping: 15, stiffness: 150, mass: 0.5 };
  const smoothKnobX = useSpring(knobX, springConfig);
  const smoothKnobY = useSpring(knobY, springConfig);

  // Filter out hydration mismatches by setting an ID only once mounted
  const [filterId, setFilterId] = useState("");
  useEffect(() => {
    // Generate a unique ID to prevent conflicts if multiple dials exist
    const timer = setTimeout(() => {
      setFilterId(`gooey-filter-${Math.random().toString(36).substring(2, 9)}`);
    }, 0);
    return () => clearTimeout(timer);
  }, []);

  const radius = size / 2;
  const trackRadius = radius * 0.7; // Inner track for the knob

  const updateValueFromPosition = (clientX: number, clientY: number) => {
    if (!containerRef.current) return;
    const rect = containerRef.current.getBoundingClientRect();
    const centerX = rect.left + rect.width / 2;
    const centerY = rect.top + rect.height / 2;

    const dx = clientX - centerX;
    const dy = clientY - centerY;

    // Calculate angle in radians, then degrees
    // We want 0 at the bottom (or top)
    // Math.atan2(dy, dx) is 0 at right, PI/2 at bottom
    // Let's make bottom = 0 progress, and it goes clockwise, opening at bottom.
    // Or just a full 360 circle. Let's do top = 0.
    let angle = Math.atan2(dy, dx) + Math.PI / 2;
    if (angle < 0) angle += Math.PI * 2;

    // Map angle (0 to 2PI) to progress (0 to 1)
    const progress = angle / (Math.PI * 2);

    // Limit value
    const newValue = min + progress * (max - min);
    setValue(newValue);
    if (onValueChange) onValueChange(newValue);

    // Position the knob magnetically on the edge

    // When dragging, we pull the knob out to the exact angle but bounded by the track radius.
    // Actually, for a fluid dial, let's make it freely draggable inside the circle,
    // and the angle defines the value, while the distance adds a satisfying "pull" tension.
    knobX.set(dx);
    knobY.set(dy);
  };

  const handlePointerDown = (e: React.PointerEvent) => {
    setIsDragging(true);
    updateValueFromPosition(e.clientX, e.clientY);
  };

  const handlePointerMove = (e: React.PointerEvent) => {
    if (isDragging) {
      updateValueFromPosition(e.clientX, e.clientY);

      // Glitch text effect while dragging
      if (Math.random() > 0.7) {
        setDisplayText(
          value.toFixed(0).split('').map(c => Math.random() > 0.5 ? '0123456789!@#$%'[Math.floor(Math.random() * 15)] : c).join('')
        );
      } else {
        setDisplayText(value.toFixed(0));
      }
    } else if (isHovered && containerRef.current) {
      // Magnetic hover effect (subtle pull towards cursor)
      const rect = containerRef.current.getBoundingClientRect();
      const centerX = rect.left + rect.width / 2;
      const centerY = rect.top + rect.height / 2;
      const dx = e.clientX - centerX;
      const dy = e.clientY - centerY;
      knobX.set(dx * 0.2); // Only pull 20% towards cursor
      knobY.set(dy * 0.2);
    }
  };

  const handlePointerUp = () => {
    setIsDragging(false);
    // Snap back to center
    knobX.set(0);
    knobY.set(0);
    setDisplayText(value.toFixed(0));
  };

  const handlePointerEnter = () => {
    setIsHovered(true);
  };

  const handlePointerLeave = () => {
    setIsHovered(false);
    if (!isDragging) {
      knobX.set(0);
      knobY.set(0);
    }
  };

  // Ensure text settles when dragging stops
  useEffect(() => {
    if (!isDragging) {
      const timer = setTimeout(() => {
        setDisplayText(value.toFixed(0));
      }, 0);
      return () => clearTimeout(timer);
    }
  }, [value, isDragging]);

  // Calculate the SVG circle progress
  const progressPercent = (value - min) / (max - min);
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
              <feGaussianBlur in="SourceGraphic" stdDeviation="12" result="blur" />
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
            stroke="rgba(255,255,255,0.05)"
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
            background: "linear-gradient(135deg, rgba(255,255,255,0.1), rgba(0,0,0,0.8))",
            boxShadow: `0 0 20px ${progressColor}40`,
            border: "1px solid rgba(255,255,255,0.2)"
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
          <div className="w-2 h-2 rounded-full bg-black/50" />
        </motion.div>
      </div>

      {/* Decorative Outer Rings */}
      <div className="absolute inset-0 rounded-full border border-white/5 pointer-events-none" style={{ margin: "-10px" }} />
      <div className="absolute inset-0 rounded-full border border-white/[0.02] pointer-events-none" style={{ margin: "-20px" }} />

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
