"use client";

import React, { useRef, useState, useEffect } from "react";
import { motion, useMotionValue, useSpring, useTransform, useMotionTemplate } from "framer-motion";

export interface ChromaticSliceCardProps extends Omit<React.ComponentPropsWithoutRef<"div">, "onDrag" | "onDragStart" | "onDragEnd" | "onAnimationStart"> {
  title?: string;
  subtitle?: string;
  slices?: number;
  glowColor?: string;
  accentColor?: string;
  imageSrc?: string;
}

export function ChromaticSliceCard({
  title = "VOID",
  subtitle = "SYSTEM OVERRIDE",
  slices = 5,
  glowColor = "#7fff5e",
  accentColor = "#ff5c71",
  imageSrc = "https://images.unsplash.com/photo-1618005182384-a83a8bd57fbe?q=80&w=2564&auto=format&fit=crop",
  className = "",
  style,
  ...props
}: ChromaticSliceCardProps) {
  const containerRef = useRef<HTMLDivElement>(null);
  const [isHovered, setIsHovered] = useState(false);

  // Mouse position tracking
  const mouseX = useMotionValue(0);
  const mouseY = useMotionValue(0);

  // Smooth springs for mouse movement
  const springConfig = { damping: 20, stiffness: 200, mass: 0.5 };
  const smoothX = useSpring(mouseX, springConfig);
  const smoothY = useSpring(mouseY, springConfig);

  // Calculate 3D rotation based on mouse position
  const rotateX = useTransform(smoothY, [-0.5, 0.5], [15, -15]);
  const rotateY = useTransform(smoothX, [-0.5, 0.5], [-15, 15]);

  // Handle mouse move
  const handleMouseMove = (e: React.MouseEvent<HTMLDivElement>) => {
    if (!containerRef.current) return;

    const rect = containerRef.current.getBoundingClientRect();

    // Calculate normalized mouse position (-0.5 to 0.5)
    const normalizedX = (e.clientX - rect.left) / rect.width - 0.5;
    const normalizedY = (e.clientY - rect.top) / rect.height - 0.5;

    mouseX.set(normalizedX);
    mouseY.set(normalizedY);
  };

  // Reset on mouse leave
  const handleMouseLeave = () => {
    setIsHovered(false);
    mouseX.set(0);
    mouseY.set(0);
  };

  // Generate deterministic random offsets for slices
  const getSliceOffsets = (index: number, total: number) => {
    // We avoid Math.random() in render to prevent hydration errors.
    // Creating pseudo-random values based on index
    const seed = index * 137;
    const dirX = (seed % 3) - 1; // -1, 0, or 1
    const shiftX = dirX * (10 + (seed % 20)); // Offset amount X

    // Spread slices vertically apart from the center
    const middle = (total - 1) / 2;
    const distFromCenter = index - middle;
    const shiftY = distFromCenter * 15; // Vertical separation

    return { shiftX, shiftY, rotateZ: dirX * (seed % 5) };
  };

  return (
    <motion.div
      ref={containerRef}
      className={`relative w-80 h-[26rem] rounded-xl cursor-pointer perspective-1000 ${className}`}
      onMouseMove={handleMouseMove}
      onMouseEnter={() => setIsHovered(true)}
      onMouseLeave={handleMouseLeave}
      style={{
        ...style,
        perspective: "1000px",
      }}
      {...props}
    >
      <motion.div
        className="w-full h-full relative preserve-3d"
        style={{
          rotateX,
          rotateY,
          transformStyle: "preserve-3d"
        }}
      >
        {/* Deep Background Core (Revealed when slices spread) */}
        <div
          className="absolute inset-0 rounded-xl overflow-hidden shadow-2xl transition-all duration-500"
          style={{
            background: "linear-gradient(to bottom right, #050505, #111)",
            boxShadow: isHovered
              ? `0 0 40px ${glowColor}66, inset 0 0 20px ${glowColor}33`
              : "0 10px 30px rgba(0,0,0,0.5)",
            border: `1px solid ${isHovered ? glowColor + '88' : '#333'}`
          }}
        >
          {/* Internal glowing grid / tech pattern */}
          <div className="absolute inset-0 opacity-20"
               style={{
                 backgroundImage: `radial-gradient(${glowColor} 1px, transparent 1px)`,
                 backgroundSize: "20px 20px"
               }}
          />

          <div className="absolute inset-0 flex flex-col items-center justify-center opacity-0 transition-opacity duration-500"
               style={{ opacity: isHovered ? 1 : 0 }}>
             <div className="text-4xl mb-2" style={{ color: glowColor }}>✧</div>
             <div className="text-xs tracking-[0.3em] font-mono" style={{ color: glowColor }}>
               CORE EXPOSED
             </div>
          </div>
        </div>

        {/* The Slices */}
        {Array.from({ length: slices }).map((_, i) => {
          // Calculate clip-path for each horizontal slice
          const sliceHeight = 100 / slices;
          const top = i * sliceHeight;
          const bottom = 100 - (i + 1) * sliceHeight;

          // Inset pattern: inset(top right bottom left)
          const clipPath = `inset(${top}% 0% ${bottom}% 0%)`;

          const { shiftX, shiftY, rotateZ } = getSliceOffsets(i, slices);

          // Z depth to make them float off the background
          const zDepth = isHovered ? 40 + Math.abs(shiftY) : 0;

          return (
            <motion.div
              key={i}
              className="absolute inset-0 rounded-xl overflow-hidden pointer-events-none"
              style={{
                clipPath,
              }}
              animate={{
                x: isHovered ? shiftX : 0,
                y: isHovered ? shiftY : 0,
                z: zDepth,
                rotateZ: isHovered ? rotateZ : 0,
                scale: isHovered ? 1.05 : 1,
              }}
              transition={{
                type: "spring",
                damping: 15,
                stiffness: 150 + (i * 20), // slight staggering in spring
                mass: 0.8
              }}
            >
              {/* Actual Content of the slice */}
              <div className="w-full h-full relative">
                {/* Background Image / Color */}
                <div
                  className="absolute inset-0 bg-cover bg-center"
                  style={{ backgroundImage: `url(${imageSrc})` }}
                >
                  {/* Glass overlay */}
                  <div className="absolute inset-0 bg-black/40 backdrop-blur-[2px]" />
                </div>

                {/* Border effect that follows the slice */}
                <div className="absolute inset-0 rounded-xl border border-white/10" />

                {/* Content Overlay - Only render text on middle slices or let it be cut naturally */}
                <div className="absolute inset-0 flex flex-col items-start justify-end p-6">
                  <div className="font-mono text-xs tracking-widest text-white/50 mb-1" style={{ color: accentColor }}>
                    {subtitle}
                  </div>
                  <h2 className="text-3xl font-black text-white tracking-tighter uppercase" style={{ WebkitTextStroke: '1px rgba(255,255,255,0.2)'}}>
                    {title}
                  </h2>
                </div>

                {/* Holographic edge glare */}
                {isHovered && (
                  <div
                    className="absolute inset-0 opacity-30 mix-blend-overlay"
                    style={{
                      background: `linear-gradient(135deg, transparent 0%, ${glowColor} 50%, transparent 100%)`
                    }}
                  />
                )}
              </div>
            </motion.div>
          );
        })}
      </motion.div>
    </motion.div>
  );
}
