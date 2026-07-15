"use client";

import React, { useRef, useState, useEffect } from "react";
import { motion, useMotionValue, useSpring, useTransform, AnimatePresence } from "framer-motion";

export interface VoidNexusProps {
  size?: number;
  coreColor?: string;
  shardColor?: string;
  glowColor?: string;
}

export const VoidNexus: React.FC<VoidNexusProps> = ({
  size = 400,
  coreColor = "#ff5c71",
  shardColor = "rgba(255, 255, 255, 0.05)",
  glowColor = "#7fff5e",
}) => {
  const containerRef = useRef<HTMLDivElement>(null);
  const [isHovered, setIsHovered] = useState(false);
  const [mounted, setMounted] = useState(false);

  useEffect(() => {
    const timer = setTimeout(() => setMounted(true), 0);
    return () => clearTimeout(timer);
  }, []);

  // Cursor tracking for magnetic tilt
  const mouseX = useMotionValue(0);
  const mouseY = useMotionValue(0);

  const springConfig = { damping: 25, stiffness: 150, mass: 1 };
  const springX = useSpring(mouseX, springConfig);
  const springY = useSpring(mouseY, springConfig);

  const rotateX = useTransform(springY, [-0.5, 0.5], [15, -15]);
  const rotateY = useTransform(springX, [-0.5, 0.5], [-15, 15]);

  const handleMouseMove = (e: React.MouseEvent<HTMLDivElement>) => {
    if (!containerRef.current) return;
    const rect = containerRef.current.getBoundingClientRect();

    // Calculate normalized position (-0.5 to 0.5)
    const normalizedX = (e.clientX - rect.left - rect.width / 2) / rect.width;
    const normalizedY = (e.clientY - rect.top - rect.height / 2) / rect.height;

    mouseX.set(normalizedX);
    mouseY.set(normalizedY);
  };

  const handleMouseLeave = () => {
    mouseX.set(0);
    mouseY.set(0);
    setIsHovered(false);
  };

  if (!mounted) return null;

  // Shard definitions (Top, Right, Bottom, Left)
  const shards = [
    { id: 1, label: "Explore", rotateZ: 0, hoverTransform: { x: 0, y: -40, rotateZ: 0 } },
    { id: 2, label: "Systems", rotateZ: 90, hoverTransform: { x: 40, y: 0, rotateZ: 90 } },
    { id: 3, label: "Network", rotateZ: 180, hoverTransform: { x: 0, y: 40, rotateZ: 180 } },
    { id: 4, label: "Deploy", rotateZ: 270, hoverTransform: { x: -40, y: 0, rotateZ: 270 } },
  ];

  // Deterministic particles
  const particles = Array.from({ length: 20 }).map((_, i) => ({
    id: i,
    x: ((i * 137.5) % 100) - 50,
    y: ((i * 93.2) % 100) - 50,
    scale: 0.5 + ((i * 7) % 10) / 10,
    duration: 2 + ((i * 3) % 5),
  }));

  return (
    <div
      ref={containerRef}
      style={{ width: size, height: size, perspective: 1200 }}
      className="relative flex items-center justify-center rounded-2xl overflow-hidden bg-black/40 backdrop-blur-sm border border-white/5"
      onMouseMove={handleMouseMove}
      onMouseEnter={() => setIsHovered(true)}
      onMouseLeave={handleMouseLeave}
    >
      {/* Background ambient glow */}
      <motion.div
        className="absolute inset-0 opacity-20"
        style={{
          background: `radial-gradient(circle at 50% 50%, ${glowColor} 0%, transparent 70%)`,
        }}
        animate={{
          scale: isHovered ? 1.2 : 1,
          opacity: isHovered ? 0.4 : 0.2,
        }}
        transition={{ duration: 0.8, ease: "easeInOut" }}
      />

      <motion.div
        style={{
          rotateX,
          rotateY,
          transformStyle: "preserve-3d",
        }}
        className="relative flex items-center justify-center w-full h-full"
      >
        {/* Core Element */}
        <motion.div
          className="absolute z-10 w-24 h-24 rounded-full flex items-center justify-center shadow-2xl cursor-pointer"
          style={{
            background: `radial-gradient(circle, ${coreColor} 0%, #000 80%)`,
            boxShadow: `0 0 30px ${coreColor}80`,
          }}
          animate={{
            scale: isHovered ? 1.1 : 0.8,
            rotateZ: isHovered ? 45 : 0,
          }}
          transition={{ type: "spring", stiffness: 200, damping: 20 }}
          whileHover={{ scale: 1.2 }}
        >
          <div className="w-12 h-12 border-2 border-white/30 rotate-45 rounded-sm flex items-center justify-center">
            <div className="w-4 h-4 bg-white rounded-full animate-pulse" />
          </div>
        </motion.div>

        {/* Orbiting Particles */}
        <AnimatePresence>
          {isHovered && (
            <motion.div
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
              className="absolute inset-0 pointer-events-none"
            >
              {particles.map((p) => (
                <motion.div
                  key={p.id}
                  className="absolute left-1/2 top-1/2 w-1.5 h-1.5 rounded-full"
                  style={{
                    backgroundColor: glowColor,
                    boxShadow: `0 0 10px ${glowColor}`,
                  }}
                  animate={{
                    x: [p.x * 0.5, p.x * 1.5, p.x * 0.5],
                    y: [p.y * 0.5, p.y * 1.5, p.y * 0.5],
                    scale: [p.scale, p.scale * 1.5, p.scale],
                    opacity: [0.3, 0.8, 0.3],
                  }}
                  transition={{
                    duration: p.duration,
                    repeat: Infinity,
                    ease: "linear",
                  }}
                />
              ))}
            </motion.div>
          )}
        </AnimatePresence>

        {/* 4 Shards */}
        {shards.map((shard) => (
          <motion.div
            key={shard.id}
            className="absolute flex items-center justify-center origin-center cursor-pointer group"
            style={{
              width: 160,
              height: 160,
              clipPath: "polygon(50% 0%, 100% 50%, 50% 100%, 0% 50%)", // Diamond shape
            }}
            initial={{
              x: 0,
              y: 0,
              rotateZ: shard.rotateZ,
              scale: 0.95
            }}
            animate={{
              x: isHovered ? shard.hoverTransform.x : 0,
              y: isHovered ? shard.hoverTransform.y : 0,
              rotateZ: shard.rotateZ, // Keep orientation
              scale: isHovered ? 1 : 0.95,
              z: isHovered ? 40 : 0,
            }}
            transition={{ type: "spring", stiffness: 150, damping: 15, mass: 0.8 }}
          >
            {/* Shard Background */}
            <div
              className="absolute inset-0 backdrop-blur-md transition-colors duration-300"
              style={{
                backgroundColor: shardColor,
                border: `1px solid ${coreColor}30`,
              }}
            />

            {/* Inner Content (Counter-rotate so text is upright) */}
            <motion.div
              style={{ rotateZ: -shard.rotateZ }}
              className="relative z-20 opacity-0 group-hover:opacity-100 transition-opacity duration-300 flex flex-col items-center justify-center"
            >
              <span className="text-white text-sm font-bold tracking-widest uppercase" style={{ textShadow: "0 0 10px rgba(255,255,255,0.5)"}}>
                {shard.label}
              </span>
              <div className="w-8 h-px bg-white/50 mt-2 group-hover:w-12 transition-all duration-300" />
            </motion.div>
          </motion.div>
        ))}

        {/* Floating geometric overlay lines */}
        <motion.div
          className="absolute inset-0 pointer-events-none border border-white/5 rounded-full"
          animate={{
            scale: isHovered ? [1, 1.05, 1] : 1,
            rotateZ: isHovered ? [0, 90] : 0,
          }}
          transition={{
            duration: 8,
            repeat: Infinity,
            ease: "linear"
          }}
          style={{ width: size * 0.8, height: size * 0.8, left: "10%", top: "10%" }}
        />
      </motion.div>
    </div>
  );
};
