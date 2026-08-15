"use client";

import * as React from "react";
import { useRef, useState } from "react";
import { motion, useMotionValue, useSpring, useTransform, AnimatePresence } from "framer-motion";

export interface AstralMorphNodeProps extends React.ComponentPropsWithoutRef<"div"> {
  size?: number;
  coreColor?: string;
  accentColor?: string;
  glowColor?: string;
  orbitNodes?: string[];
}

export const AstralMorphNode: React.FC<AstralMorphNodeProps> = ({
  size = 400,
  coreColor = "#8b5cf6",
  accentColor = "#06b6d4",
  glowColor = "#d946ef",
  orbitNodes = ["Init", "Sync", "Link", "Emit", "Void"],
  className = "",
  style,
  onMouseMove,
  onMouseEnter,
  onMouseLeave,
  onFocus,
  onBlur,
  tabIndex,
  ...props
}) => {
  const containerRef = useRef<HTMLDivElement>(null);
  const [isHovered, setIsHovered] = useState(false);

  const mouseX = useMotionValue(0);
  const mouseY = useMotionValue(0);

  const springConfig = { damping: 20, stiffness: 100, mass: 0.5 };
  const springX = useSpring(mouseX, springConfig);
  const springY = useSpring(mouseY, springConfig);

  const rotateX = useTransform(springY, [-0.5, 0.5], [20, -20]);
  const rotateY = useTransform(springX, [-0.5, 0.5], [-20, 20]);

  // Cast useTransform callbacks to numbers to satisfy TypeScript
  const coreX = useTransform(springX, (val) => (val as number) * -30);
  const coreY = useTransform(springY, (val) => (val as number) * -30);

  const handleMouseMove = (event: React.MouseEvent<HTMLDivElement>) => {
    if (!containerRef.current) return;
    const rect = containerRef.current.getBoundingClientRect();
    const nx = (event.clientX - rect.left - rect.width / 2) / rect.width;
    const ny = (event.clientY - rect.top - rect.height / 2) / rect.height;
    mouseX.set(nx);
    mouseY.set(ny);
    onMouseMove?.(event);
  };

  const resetInteraction = () => {
    mouseX.set(0);
    mouseY.set(0);
    setIsHovered(false);
  };

  const handleMouseLeave = (event: React.MouseEvent<HTMLDivElement>) => {
    resetInteraction();
    onMouseLeave?.(event);
  };

  return (
    <div
      ref={containerRef}
      style={{ width: "100%", maxWidth: size, aspectRatio: "1 / 1", perspective: 1500, ...style }}
      className={`relative flex items-center justify-center rounded-3xl overflow-hidden bg-black/60 backdrop-blur-xl border border-white/10 ${className}`}
      onMouseMove={handleMouseMove}
      onMouseEnter={(event) => {
        setIsHovered(true);
        onMouseEnter?.(event);
      }}
      onMouseLeave={handleMouseLeave}
      onFocus={(event) => {
        setIsHovered(true);
        onFocus?.(event);
      }}
      onBlur={(event) => {
        resetInteraction();
        onBlur?.(event);
      }}
      tabIndex={tabIndex ?? 0}
      role="group"
      aria-label="Astral morph node visualization"
      {...props}
    >
      {/* Background glow */}
      <motion.div
        className="absolute inset-0 opacity-20 pointer-events-none"
        style={{
          background: `radial-gradient(circle at 50% 50%, ${glowColor} 0%, transparent 70%)`,
        }}
        animate={{
          scale: isHovered ? 1.5 : 1,
          opacity: isHovered ? 0.5 : 0.2,
        }}
        transition={{ duration: 1.5, ease: "easeOut" }}
      />

      {/* Subtle Noise Texture */}
      <div
        className="absolute inset-0 opacity-[0.03] pointer-events-none"
        style={{ backgroundImage: `url("data:image/svg+xml,%3Csvg viewBox='0 0 200 200' xmlns='http://www.w3.org/2000/svg'%3E%3Cfilter id='noiseFilter'%3E%3CfeTurbulence type='fractalNoise' baseFrequency='0.65' numOctaves='3' stitchTiles='stitch'/%3E%3C/filter%3E%3Crect width='100%25' height='100%25' filter='url(%23noiseFilter)'/%3E%3C/svg%3E")` }}
      />

      <motion.div
        style={{ rotateX, rotateY, transformStyle: "preserve-3d" }}
        className="relative flex items-center justify-center w-full h-full"
      >
        {/* Outer Orbit Rings */}
        {[0, 1, 2].map((ringIndex) => (
          <motion.div
            key={`ring-${ringIndex}`}
            className="absolute rounded-full border border-white/10"
            style={{
              width: 140 + ringIndex * 80,
              height: 140 + ringIndex * 80,
              borderStyle: ringIndex === 1 ? 'dashed' : 'solid',
            }}
            animate={{
              rotateZ: isHovered ? (ringIndex % 2 === 0 ? 180 : -180) : 0,
              scale: isHovered ? 1.1 : 1,
              opacity: isHovered ? 0.8 : 0.3,
            }}
            transition={{
              rotateZ: { duration: 10 + ringIndex * 5, repeat: Infinity, ease: "linear" },
              scale: { type: "spring", stiffness: 100, damping: 20 },
              opacity: { duration: 0.5 }
            }}
          />
        ))}

        {/* Orbiting Nodes */}
        <AnimatePresence>
          {isHovered && (
            <motion.div
              initial={{ opacity: 0, scale: 0.8 }}
              animate={{ opacity: 1, scale: 1 }}
              exit={{ opacity: 0, scale: 0.8 }}
              transition={{ type: "spring", stiffness: 200, damping: 20 }}
              className="absolute inset-0 pointer-events-none"
            >
              {orbitNodes.map((node, i) => {
                const angle = (i * 360) / orbitNodes.length;
                const radius = 130;
                return (
                  <motion.div
                    key={`${node}-${i}`}
                    className="absolute left-1/2 top-1/2 flex items-center justify-center"
                    style={{
                      width: 40,
                      height: 40,
                      marginLeft: -20,
                      marginTop: -20,
                      rotateZ: angle,
                    }}
                    animate={{
                      rotateZ: angle + 360,
                    }}
                    transition={{
                      duration: 20,
                      repeat: Infinity,
                      ease: "linear",
                    }}
                  >
                    <motion.div
                      className="w-10 h-10 rounded-full flex items-center justify-center bg-black/80 backdrop-blur-md border border-white/20 shadow-lg pointer-events-auto cursor-pointer"
                      style={{
                        transform: `translateY(-${radius}px)`,
                      }}
                      whileHover={{ scale: 1.2, borderColor: accentColor }}
                    >
                      <motion.div
                        style={{ rotateZ: -angle }}
                        animate={{ rotateZ: -(angle + 360) }}
                        transition={{ duration: 20, repeat: Infinity, ease: "linear" }}
                      >
                         <span className="text-[10px] font-bold text-white uppercase tracking-wider">{node}</span>
                      </motion.div>
                    </motion.div>
                  </motion.div>
                );
              })}
            </motion.div>
          )}
        </AnimatePresence>

        {/* Central Core container */}
        <motion.div
          style={{ x: coreX, y: coreY, z: 50, transformStyle: "preserve-3d" }}
          className="relative flex items-center justify-center cursor-pointer group"
          animate={{
            scale: isHovered ? 1.1 : 1,
          }}
          transition={{ type: "spring", stiffness: 300, damping: 15 }}
        >
          {/* Inner pulsating aura */}
          <motion.div
            className="absolute inset-0 rounded-full blur-xl pointer-events-none"
            style={{ background: coreColor }}
            animate={{
              opacity: isHovered ? 0.8 : 0.4,
              scale: isHovered ? [1, 1.2, 1] : 1,
            }}
            transition={{
              scale: { duration: 2, repeat: Infinity, ease: "easeInOut" },
              opacity: { duration: 0.3 }
            }}
          />

          {/* Solid Core Structure */}
          <motion.div
            className="relative z-10 w-24 h-24 flex items-center justify-center rounded-2xl overflow-hidden backdrop-blur-xl border border-white/30"
            style={{
              background: `linear-gradient(135deg, ${coreColor}40 0%, #000000cc 100%)`,
              boxShadow: `0 0 40px ${coreColor}60, inset 0 0 20px ${coreColor}40`,
            }}
            animate={{
              rotateZ: isHovered ? 45 : 0,
              borderRadius: isHovered ? "50%" : "25%",
            }}
            transition={{ type: "spring", stiffness: 200, damping: 20 }}
          >
            {/* Core Data visualization lines */}
            <div className="absolute inset-0 flex flex-col justify-around p-3 opacity-50 pointer-events-none">
              <motion.div className="h-0.5 w-full bg-white/50 rounded-full" animate={{ x: isHovered ? ['-100%', '100%'] : '0%' }} transition={{ duration: 1.5, repeat: Infinity, ease: "linear" }} />
              <motion.div className="h-0.5 w-3/4 bg-white/50 rounded-full" animate={{ x: isHovered ? ['100%', '-100%'] : '0%' }} transition={{ duration: 2, repeat: Infinity, ease: "linear" }} />
              <motion.div className="h-0.5 w-5/6 bg-white/50 rounded-full" animate={{ x: isHovered ? ['-100%', '100%'] : '0%' }} transition={{ duration: 1.8, repeat: Infinity, ease: "linear" }} />
            </div>

            {/* Core Center Prism */}
            <motion.div
              className="z-20 w-8 h-8 bg-white shadow-2xl flex items-center justify-center mix-blend-overlay"
              animate={{
                rotateZ: isHovered ? -90 : 0,
                scale: isHovered ? 0.5 : 1,
                borderRadius: isHovered ? "10%" : "50%",
              }}
              transition={{ type: "spring", stiffness: 200, damping: 20 }}
            >
              <div className="w-2 h-2 bg-black rounded-full" />
            </motion.div>
          </motion.div>

          {/* Floating Data Shards */}
          <AnimatePresence>
            {isHovered && (
              <>
                <motion.div
                  initial={{ opacity: 0, y: 20, x: -30, z: 0 }}
                  animate={{ opacity: 1, y: -40, x: -60, z: 40 }}
                  exit={{ opacity: 0, y: 20, x: -30, z: 0 }}
                  className="absolute p-2 bg-black/80 backdrop-blur-md border border-white/20 rounded-md shadow-xl whitespace-nowrap pointer-events-none"
                >
                  <span className="text-[10px] text-white font-mono flex items-center gap-2">
                    <span className="w-1.5 h-1.5 rounded-full bg-green-400 animate-pulse" />
                    SYSTEM_ACTIVE
                  </span>
                </motion.div>
                <motion.div
                  initial={{ opacity: 0, y: -20, x: 30, z: 0 }}
                  animate={{ opacity: 1, y: 40, x: 60, z: 60 }}
                  exit={{ opacity: 0, y: -20, x: 30, z: 0 }}
                  className="absolute p-2 bg-black/80 backdrop-blur-md border border-white/20 rounded-md shadow-xl whitespace-nowrap pointer-events-none"
                  style={{ borderColor: accentColor }}
                >
                  <span className="text-[10px] text-white font-mono flex items-center gap-2">
                    <span className="w-1.5 h-1.5 rounded-full bg-blue-400 animate-pulse" />
                    MEM_ALLOC: 98%
                  </span>
                </motion.div>
              </>
            )}
          </AnimatePresence>
        </motion.div>
      </motion.div>
    </div>
  );
};
