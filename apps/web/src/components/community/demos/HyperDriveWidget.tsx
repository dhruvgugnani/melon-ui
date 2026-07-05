"use client";

import React, { useRef, useState, useEffect } from "react";
import { motion, useMotionValue, useSpring, useTransform, AnimatePresence } from "framer-motion";

export interface HyperDriveWidgetProps extends React.ComponentPropsWithoutRef<"div"> {
  title?: string;
  statusText?: string;
  primaryColor?: string;
  secondaryColor?: string;
  glowColor?: string;
  size?: number;
}

export const HyperDriveWidget = React.forwardRef<HTMLDivElement, HyperDriveWidgetProps>(
  (
    {
      title = "HYPERDRIVE CORE",
      statusText = "IDLE",
      primaryColor = "#00f0ff",
      secondaryColor = "#ff5c71",
      glowColor = "#7fff5e",
      size = 360,
      className = "",
      style,
      ...props
    },
    forwardedRef
  ) => {
    const internalRef = useRef<HTMLDivElement>(null);
    const ref = (forwardedRef as React.RefObject<HTMLDivElement>) || internalRef;

    const [isHovered, setIsHovered] = useState(false);
    const [isActive, setIsActive] = useState(false);

    // Mouse tracking for magnetic pull and 3D tilt
    const mouseX = useMotionValue(0.5);
    const mouseY = useMotionValue(0.5);

    // Smooth physics for the core
    const springConfig = { damping: 20, stiffness: 150, mass: 0.8 };
    const smoothX = useSpring(mouseX, springConfig);
    const smoothY = useSpring(mouseY, springConfig);

    // 3D Tilt transforms
    const rotateX = useTransform(smoothY, [0, 1], [isHovered ? 20 : 0, isHovered ? -20 : 0]);
    const rotateY = useTransform(smoothX, [0, 1], [isHovered ? -20 : 0, isHovered ? 20 : 0]);

    // Magnetic pull for the core
    const coreX = useTransform(smoothX, [0, 1], [isHovered ? -30 : 0, isHovered ? 30 : 0]);
    const coreY = useTransform(smoothY, [0, 1], [isHovered ? -30 : 0, isHovered ? 30 : 0]);

    const handleMouseMove = (e: React.MouseEvent<HTMLDivElement>) => {
      if (!ref.current) return;
      const rect = ref.current.getBoundingClientRect();
      const x = (e.clientX - rect.left) / rect.width;
      const y = (e.clientY - rect.top) / rect.height;
      mouseX.set(x);
      mouseY.set(y);
    };

    const handleMouseLeave = () => {
      setIsHovered(false);
      setIsActive(false);
      mouseX.set(0.5);
      mouseY.set(0.5);
    };

    // Calculate dynamic colors based on state
    const currentPrimary = isActive ? glowColor : isHovered ? primaryColor : "rgba(255,255,255,0.2)";
    const currentStatus = isActive ? "JUMPING" : isHovered ? "CHARGING" : statusText;

    return (
      <div
        ref={ref}
        className={`relative perspective-[1000px] flex items-center justify-center ${className}`}
        style={{ width: size, height: size, ...style }}
        onMouseMove={handleMouseMove}
        onMouseLeave={handleMouseLeave}
        onMouseEnter={() => setIsHovered(true)}
        onMouseDown={() => setIsActive(true)}
        onMouseUp={() => setIsActive(false)}
        onTouchStart={() => setIsActive(true)}
        onTouchEnd={() => setIsActive(false)}
        {...props}
      >
        <motion.div
          className="w-full h-full relative preserve-3d"
          style={{
            rotateX,
            rotateY,
            transformStyle: "preserve-3d",
          }}
        >
          {/* Background Glass Plate */}
          <div className="absolute inset-0 rounded-[2.5rem] bg-black/40 border border-white/10 backdrop-blur-xl shadow-2xl overflow-hidden">
            {/* Ambient background glow */}
            <motion.div
              className="absolute inset-0 opacity-30"
              animate={{
                background: isActive
                  ? `radial-gradient(circle at 50% 50%, ${glowColor}40 0%, transparent 70%)`
                  : isHovered
                  ? `radial-gradient(circle at 50% 50%, ${primaryColor}30 0%, transparent 60%)`
                  : `radial-gradient(circle at 50% 50%, rgba(255,255,255,0.05) 0%, transparent 50%)`
              }}
              transition={{ duration: 0.5 }}
            />

            {/* Noise Texture */}
            <div
              className="absolute inset-0 opacity-[0.04] mix-blend-overlay pointer-events-none"
              style={{ backgroundImage: "url('data:image/svg+xml;utf8,%3Csvg viewBox=%220 0 200 200%22 xmlns=%22http://www.w3.org/2000/svg%22%3E%3Cfilter id=%22noiseFilter%22%3E%3CfeTurbulence type=%22fractalNoise%22 baseFrequency=%220.8%22 numOctaves=%223%22 stitchTiles=%22stitch%22/%3E%3C/filter%3E%3Crect width=%22100%25%22 height=%22100%25%22 filter=%22url(%23noiseFilter)%22/%3E%3C/svg%3E')" }}
            />

            {/* Corner Accents */}
            <div className="absolute top-4 left-4 w-2 h-2 rounded-full border border-white/30" />
            <div className="absolute top-4 right-4 w-2 h-2 rounded-full border border-white/30" />
            <div className="absolute bottom-4 left-4 w-2 h-2 rounded-full border border-white/30" />
            <div className="absolute bottom-4 right-4 w-2 h-2 rounded-full border border-white/30" />

            {/* Header Text */}
            <div className="absolute top-6 left-0 right-0 flex flex-col items-center pointer-events-none">
               <motion.span
                 className="text-white/80 font-bold tracking-[0.2em] text-sm"
                 animate={{ textShadow: isHovered ? `0 0 10px ${currentPrimary}` : "none" }}
               >
                 {title}
               </motion.span>
               <motion.span
                 className="font-mono text-[10px] tracking-widest mt-1 uppercase"
                 animate={{ color: isActive ? glowColor : isHovered ? primaryColor : "rgba(255,255,255,0.4)" }}
               >
                 {currentStatus}
               </motion.span>
            </div>
          </div>

          {/* Orbiting Rings System */}
          <div className="absolute inset-0 flex items-center justify-center pointer-events-none" style={{ transform: "translateZ(30px)" }}>

            {/* Outer Ring */}
            <motion.div
              className="absolute rounded-full border border-dashed opacity-30"
              style={{ width: size * 0.75, height: size * 0.75, borderColor: currentPrimary }}
              animate={{
                rotate: isActive ? 360 : 0,
                scale: isActive ? 1.1 : isHovered ? 1.05 : 1,
              }}
              transition={{
                rotate: { duration: isActive ? 1 : 10, repeat: Infinity, ease: "linear" },
                scale: { type: "spring", stiffness: 200, damping: 20 }
              }}
            />

            {/* Middle Ring */}
            <motion.div
              className="absolute rounded-full border-2 border-transparent opacity-50"
              style={{
                width: size * 0.6,
                height: size * 0.6,
                borderTopColor: secondaryColor,
                borderBottomColor: secondaryColor
              }}
              animate={{
                rotate: isActive ? -360 : 0,
                scale: isActive ? 0.9 : isHovered ? 0.95 : 1,
              }}
              transition={{
                rotate: { duration: isActive ? 0.8 : 8, repeat: Infinity, ease: "linear" },
                scale: { type: "spring", stiffness: 200, damping: 20 }
              }}
            />

            {/* Inner Data Track */}
            <motion.svg
              className="absolute"
              style={{ width: size * 0.45, height: size * 0.45 }}
              viewBox="0 0 100 100"
              animate={{ rotate: isActive ? 360 : 0 }}
              transition={{ duration: isActive ? 0.5 : 20, repeat: Infinity, ease: "linear" }}
            >
              <circle cx="50" cy="50" r="48" fill="none" stroke="rgba(255,255,255,0.1)" strokeWidth="1" />
              <circle
                cx="50" cy="50" r="48"
                fill="none"
                stroke={currentPrimary}
                strokeWidth="2"
                strokeDasharray={isActive ? "20 10" : "50 250"}
                strokeLinecap="round"
              />
            </motion.svg>
          </div>

          {/* Central Magnetic Core */}
          <motion.div
            className="absolute inset-0 flex items-center justify-center cursor-pointer z-10"
            style={{ x: coreX, y: coreY, transform: "translateZ(60px)" }}
          >
             <motion.div
               className="relative rounded-full flex items-center justify-center backdrop-blur-md overflow-hidden"
               style={{
                 width: size * 0.25,
                 height: size * 0.25,
                 background: "rgba(0,0,0,0.5)",
                 border: `1px solid ${currentPrimary}`,
                 boxShadow: isActive ? `0 0 40px ${glowColor}` : isHovered ? `0 0 20px ${primaryColor}` : `0 0 10px rgba(0,0,0,0.5)`
               }}
               whileHover={{ scale: 1.1 }}
               whileTap={{ scale: 0.9 }}
             >
               {/* Core Center Pulse */}
               <motion.div
                 className="w-1/2 h-1/2 rounded-full blur-md"
                 animate={{
                   backgroundColor: currentPrimary,
                   scale: isActive ? [1, 1.5, 1] : [1, 1.2, 1],
                   opacity: isActive ? 1 : 0.6
                 }}
                 transition={{ duration: isActive ? 0.5 : 2, repeat: Infinity, ease: "easeInOut" }}
               />

               {/* Cybernetic details inside core */}
               <div className="absolute inset-0 flex items-center justify-center pointer-events-none">
                 <div className="w-1/3 h-px bg-white/50 absolute" style={{ transform: "rotate(45deg)" }} />
                 <div className="w-1/3 h-px bg-white/50 absolute" style={{ transform: "rotate(-45deg)" }} />
                 <div className="w-2 h-2 bg-white rounded-full z-10 shadow-[0_0_10px_white]" />
               </div>
             </motion.div>
          </motion.div>

          {/* Scanning Line Effect on Active */}
          <AnimatePresence>
            {isActive && (
              <motion.div
                initial={{ top: "0%", opacity: 0 }}
                animate={{ top: "100%", opacity: 0.5 }}
                exit={{ opacity: 0 }}
                transition={{ duration: 0.8, repeat: Infinity, ease: "linear" }}
                className="absolute left-0 right-0 h-1 bg-gradient-to-r from-transparent via-white to-transparent pointer-events-none"
                style={{ transform: "translateZ(80px)", boxShadow: `0 0 20px ${glowColor}` }}
              />
            )}
          </AnimatePresence>

        </motion.div>
      </div>
    );
  }
);

HyperDriveWidget.displayName = "HyperDriveWidget";
