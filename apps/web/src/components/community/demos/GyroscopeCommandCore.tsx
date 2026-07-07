"use client";

import React, { useRef, useState, useEffect } from "react";
import { motion, useMotionValue, useSpring, useTransform, AnimatePresence } from "framer-motion";

export interface CommandNode {
  id: string;
  label: string;
  icon: React.ReactNode;
  angle: number; // Angle in degrees (0-360) where it sits on the orbit
  color?: string;
}

export interface GyroscopeCommandCoreProps extends React.ComponentPropsWithoutRef<"div"> {
  nodes?: CommandNode[];
  primaryColor?: string;
  secondaryColor?: string;
  glowColor?: string;
  coreLabel?: string;
  onNodeClick?: (node: CommandNode) => void;
}

const DEFAULT_NODES: CommandNode[] = [
  {
    id: "nav-system",
    label: "Nav System",
    angle: 0,
    color: "#ff5c71",
    icon: (
      <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
        <polygon points="3 11 22 2 13 21 11 13 3 11" />
      </svg>
    ),
  },
  {
    id: "shield-grid",
    label: "Shield Grid",
    angle: 72,
    color: "#7fff5e",
    icon: (
      <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
        <path d="M12 22s8-4 8-10V5l-8-3-8 3v7c0 6 8 10 8 10z" />
      </svg>
    ),
  },
  {
    id: "hyper-drive",
    label: "Hyper Drive",
    angle: 144,
    color: "#00f0ff",
    icon: (
      <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
        <polygon points="13 2 3 14 12 14 11 22 21 10 12 10 13 2" />
      </svg>
    ),
  },
  {
    id: "comms-array",
    label: "Comms Array",
    angle: 216,
    color: "#ff8c00",
    icon: (
      <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
        <path d="M4 11a9 9 0 0 1 9 9" />
        <path d="M4 4a16 16 0 0 1 16 16" />
        <circle cx="5" cy="19" r="1" />
      </svg>
    ),
  },
  {
    id: "life-support",
    label: "Life Support",
    angle: 288,
    color: "#e8d5b7",
    icon: (
      <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
        <path d="M20.42 4.58a5.4 5.4 0 0 0-7.65 0l-.77.78-.77-.78a5.4 5.4 0 0 0-7.65 0C1.46 6.7 1.33 10.28 4 13l8 8 8-8c2.67-2.72 2.54-6.3.42-8.42z" />
      </svg>
    ),
  },
];

export const GyroscopeCommandCore = React.forwardRef<HTMLDivElement, GyroscopeCommandCoreProps>(
  (
    {
      nodes = DEFAULT_NODES,
      primaryColor = "#ff5c71",
      secondaryColor = "#7fff5e",
      glowColor = "#00f0ff",
      coreLabel = "INITIALIZE",
      onNodeClick,
      className = "",
      style,
      ...props
    },
    forwardedRef
  ) => {
    const internalRef = useRef<HTMLDivElement>(null);
    const containerRef = (forwardedRef as React.RefObject<HTMLDivElement>) || internalRef;

    const [isHovered, setIsHovered] = useState(false);
    const [isDeployed, setIsDeployed] = useState(false);
    const [isClient, setIsClient] = useState(false);

    useEffect(() => {
      setIsClient(true);
    }, []);

    // Mouse tracking for parallax
    const mouseX = useMotionValue(0);
    const mouseY = useMotionValue(0);

    const springConfig = { damping: 20, stiffness: 100, mass: 0.5 };
    const smoothX = useSpring(mouseX, springConfig);
    const smoothY = useSpring(mouseY, springConfig);

    const handleMouseMove = (e: React.MouseEvent<HTMLDivElement>) => {
      if (!containerRef.current || isDeployed) return;

      const rect = containerRef.current.getBoundingClientRect();
      const centerX = rect.left + rect.width / 2;
      const centerY = rect.top + rect.height / 2;

      const distanceX = e.clientX - centerX;
      const distanceY = e.clientY - centerY;

      // Normalize between -1 and 1
      mouseX.set(distanceX / (rect.width / 2));
      mouseY.set(distanceY / (rect.height / 2));
    };

    const handleMouseLeave = () => {
      setIsHovered(false);
      if (!isDeployed) {
        mouseX.set(0);
        mouseY.set(0);
      }
    };

    const handleMouseEnter = () => {
      setIsHovered(true);
    };

    const toggleDeploy = () => {
      if (isDeployed) {
        setIsDeployed(false);
      } else {
        setIsDeployed(true);
        mouseX.set(0);
        mouseY.set(0);
      }
    };

    // Calculate ring rotations based on state and mouse position
    // Ring 1 (Outer)
    const ring1RotateX = useTransform(smoothY, [-1, 1], [60, -60]);
    const ring1RotateY = useTransform(smoothX, [-1, 1], [-60, 60]);

    // Ring 2 (Middle)
    const ring2RotateX = useTransform(smoothY, [-1, 1], [-45, 45]);
    const ring2RotateY = useTransform(smoothX, [-1, 1], [45, -45]);

    // Ring 3 (Inner)
    const ring3RotateX = useTransform(smoothY, [-1, 1], [30, -30]);
    const ring3RotateY = useTransform(smoothX, [-1, 1], [-30, 30]);

    if (!isClient) return <div className={`w-96 h-96 ${className}`} style={style} />;

    return (
      <div
        ref={containerRef}
        className={`relative w-[400px] h-[400px] flex items-center justify-center perspective-[1200px] ${className}`}
        onMouseMove={handleMouseMove}
        onMouseEnter={handleMouseEnter}
        onMouseLeave={handleMouseLeave}
        style={style}
        {...props}
      >
        {/* Core Component */}
        <motion.div
          className="relative w-full h-full flex items-center justify-center preserve-3d"
          animate={{
            scale: isDeployed ? 1.1 : isHovered ? 1.05 : 1,
          }}
          transition={{ duration: 0.8, ease: [0.16, 1, 0.3, 1] }}
          style={{
            transformStyle: "preserve-3d",
          }}
        >
          {/* Ring 1 (Outer) */}
          <motion.div
            className="absolute w-72 h-72 rounded-full border border-white/20"
            style={{
              rotateX: isDeployed ? 0 : ring1RotateX,
              rotateY: isDeployed ? 0 : ring1RotateY,
              boxShadow: isDeployed ? `0 0 40px -10px ${primaryColor}40 inset` : "none",
              borderColor: isDeployed ? `${primaryColor}40` : "rgba(255,255,255,0.2)",
              transformStyle: "preserve-3d",
            }}
            animate={{
              rotateZ: isDeployed ? 180 : 0,
            }}
            transition={{
              rotateX: { duration: 0.8, ease: [0.16, 1, 0.3, 1] },
              rotateY: { duration: 0.8, ease: [0.16, 1, 0.3, 1] },
              rotateZ: { duration: 20, ease: "linear", repeat: Infinity },
              borderColor: { duration: 0.8 },
            }}
          >
            {/* Deploying nodes along the outer ring */}
            <AnimatePresence>
              {isDeployed && nodes.map((node, i) => {
                const radius = 144; // Half of 288px (w-72)
                const angleRad = (node.angle * Math.PI) / 180;
                // Position on the circle
                const x = Math.cos(angleRad) * radius;
                const y = Math.sin(angleRad) * radius;

                return (
                  <motion.div
                    key={node.id}
                    className="absolute top-1/2 left-1/2 flex items-center justify-center"
                    initial={{ x: 0, y: 0, opacity: 0, scale: 0 }}
                    animate={{ x, y, opacity: 1, scale: 1 }}
                    exit={{ x: 0, y: 0, opacity: 0, scale: 0 }}
                    transition={{
                      duration: 0.6,
                      delay: i * 0.05,
                      ease: [0.16, 1, 0.3, 1],
                    }}
                    style={{
                      // Counter-rotate the nodes so they stay upright while the ring rotates
                      rotateZ: isDeployed ? -180 : 0,
                    }}
                  >
                    <motion.button
                      className="group absolute flex flex-col items-center justify-center gap-2"
                      onClick={(e) => {
                        e.stopPropagation();
                        onNodeClick?.(node);
                      }}
                      whileHover={{ scale: 1.15 }}
                      whileTap={{ scale: 0.95 }}
                      style={{
                        x: "-50%",
                        y: "-50%",
                      }}
                    >
                      <div
                        className="w-12 h-12 rounded-full backdrop-blur-md flex items-center justify-center border border-white/20 transition-colors"
                        style={{
                          backgroundColor: "rgba(10, 10, 10, 0.8)",
                          color: node.color || primaryColor,
                          boxShadow: `0 0 20px -5px ${node.color || primaryColor}60`,
                        }}
                      >
                        {node.icon}
                      </div>
                      <span
                        className="absolute top-14 whitespace-nowrap text-xs font-mono font-semibold tracking-widest opacity-0 group-hover:opacity-100 transition-opacity"
                        style={{ color: node.color || primaryColor }}
                      >
                        {node.label}
                      </span>
                    </motion.button>
                  </motion.div>
                );
              })}
            </AnimatePresence>
          </motion.div>

          {/* Ring 2 (Middle) */}
          <motion.div
            className="absolute w-52 h-52 rounded-full border border-dashed border-white/30"
            style={{
              rotateX: isDeployed ? 0 : ring2RotateX,
              rotateY: isDeployed ? 0 : ring2RotateY,
              transformStyle: "preserve-3d",
            }}
            animate={{
              rotateZ: isDeployed ? -180 : 360,
              borderColor: isDeployed ? `${secondaryColor}50` : "rgba(255,255,255,0.3)",
            }}
            transition={{
              rotateX: { duration: 0.8, ease: [0.16, 1, 0.3, 1] },
              rotateY: { duration: 0.8, ease: [0.16, 1, 0.3, 1] },
              rotateZ: { duration: 15, ease: "linear", repeat: Infinity },
              borderColor: { duration: 0.8 },
            }}
          />

          {/* Ring 3 (Inner) */}
          <motion.div
            className="absolute w-32 h-32 rounded-full border-[3px] border-transparent"
            style={{
              rotateX: isDeployed ? 0 : ring3RotateX,
              rotateY: isDeployed ? 0 : ring3RotateY,
              borderTopColor: `${glowColor}80`,
              borderBottomColor: `${glowColor}80`,
              transformStyle: "preserve-3d",
            }}
            animate={{
              rotateZ: isDeployed ? 360 : -360,
              scale: isDeployed ? 1.2 : 1,
            }}
            transition={{
              rotateX: { duration: 0.8, ease: [0.16, 1, 0.3, 1] },
              rotateY: { duration: 0.8, ease: [0.16, 1, 0.3, 1] },
              rotateZ: { duration: 10, ease: "linear", repeat: Infinity },
              scale: { duration: 0.8, ease: [0.16, 1, 0.3, 1] },
            }}
          />

          {/* Core Button */}
          <motion.button
            className="absolute z-10 w-20 h-20 rounded-full flex flex-col items-center justify-center cursor-pointer outline-none overflow-hidden backdrop-blur-md border border-white/20"
            style={{
              backgroundColor: "rgba(0, 0, 0, 0.7)",
              boxShadow: isDeployed
                ? `0 0 40px ${glowColor}80, 0 0 100px ${primaryColor}60 inset`
                : isHovered
                  ? `0 0 30px ${glowColor}40, 0 0 40px ${primaryColor}40 inset`
                  : `0 0 15px ${glowColor}20, 0 0 20px ${primaryColor}20 inset`,
            }}
            animate={{
              scale: isDeployed ? 0.9 : isHovered ? 1.1 : 1,
            }}
            whileHover={{ scale: 1.1 }}
            whileTap={{ scale: 0.85 }}
            onClick={toggleDeploy}
          >
            {/* Core glowing orb inner */}
            <motion.div
              className="absolute inset-0 rounded-full"
              style={{
                background: `radial-gradient(circle at 30% 30%, ${primaryColor} 0%, transparent 60%)`,
                opacity: 0.4,
              }}
              animate={{
                rotate: isDeployed ? 360 : 0,
              }}
              transition={{
                rotate: { duration: 5, ease: "linear", repeat: Infinity },
              }}
            />

            <AnimatePresence mode="wait">
              {isDeployed ? (
                <motion.div
                  key="close"
                  initial={{ opacity: 0, scale: 0, rotate: -90 }}
                  animate={{ opacity: 1, scale: 1, rotate: 0 }}
                  exit={{ opacity: 0, scale: 0, rotate: 90 }}
                  transition={{ duration: 0.3 }}
                >
                  <svg width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="white" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                    <line x1="18" y1="6" x2="6" y2="18"></line>
                    <line x1="6" y1="6" x2="18" y2="18"></line>
                  </svg>
                </motion.div>
              ) : (
                <motion.div
                  key="open"
                  initial={{ opacity: 0, scale: 0, rotate: 90 }}
                  animate={{ opacity: 1, scale: 1, rotate: 0 }}
                  exit={{ opacity: 0, scale: 0, rotate: -90 }}
                  transition={{ duration: 0.3 }}
                  className="flex flex-col items-center justify-center text-white"
                >
                  <span className="font-mono text-[8px] font-bold tracking-[0.2em] mb-1 opacity-70">CORE</span>
                  <div className="w-6 h-[2px] bg-white rounded-full"></div>
                </motion.div>
              )}
            </AnimatePresence>
          </motion.button>

          {/* Holographic floor plane */}
          <motion.div
            className="absolute bottom-[-100px] w-48 h-48 rounded-full pointer-events-none"
            style={{
              background: `radial-gradient(circle, ${primaryColor} 0%, transparent 70%)`,
              rotateX: 80,
              opacity: isDeployed ? 0.3 : 0.1,
              filter: "blur(20px)",
              scale: isDeployed ? 2 : 1,
            }}
            transition={{ duration: 0.8, ease: [0.16, 1, 0.3, 1] }}
          />
        </motion.div>
      </div>
    );
  }
);

GyroscopeCommandCore.displayName = "GyroscopeCommandCore";
