"use client";

import React, { useRef, useState } from "react";
import { motion, useMotionValue, useSpring, useTransform, AnimatePresence } from "framer-motion";

export interface StackLayer {
  id: string;
  title: string;
  type: "glass" | "circuit" | "grid" | "hologram";
  color?: string;
  content?: React.ReactNode;
}

export interface KineticHoloStackProps extends React.ComponentPropsWithoutRef<"div"> {
  layers?: StackLayer[];
  baseColor?: string;
  accentColor?: string;
  glowColor?: string;
  width?: number;
  height?: number;
}

const DEFAULT_LAYERS: StackLayer[] = [
  { id: "L1", title: "Visual Casing", type: "glass" },
  { id: "L2", title: "Grid Layer", type: "grid", color: "#7fff5e" },
  { id: "L3", title: "Vector Wireframe", type: "circuit", color: "#ff5c71" },
  { id: "L4", title: "Accent Depth", type: "hologram", color: "#00f0ff" }
];

export const KineticHoloStack = React.forwardRef<HTMLDivElement, KineticHoloStackProps>(
  (
    {
      layers = DEFAULT_LAYERS,
      accentColor = "#ff5c71",
      glowColor = "#7fff5e",
      width = 320,
      height = 420,
      className = "",
      style,
      ...props
    },
    forwardedRef
  ) => {
    const internalRef = useRef<HTMLDivElement>(null);
    const ref = (forwardedRef as React.RefObject<HTMLDivElement>) || internalRef;
    const [isHovered, setIsHovered] = useState(false);
    const [mousePos, setMousePos] = useState({ x: 0.5, y: 0.5 });

    const handleMouseMove = (e: React.MouseEvent<HTMLDivElement>) => {
      if (!ref.current) return;
      const rect = ref.current.getBoundingClientRect();
      const x = (e.clientX - rect.left) / rect.width;
      const y = (e.clientY - rect.top) / rect.height;
      setMousePos({ x, y });
    };

    const handleMouseLeave = () => {
      setIsHovered(false);
      setMousePos({ x: 0.5, y: 0.5 });
    };

    const rotateXVal = isHovered ? 60 : (mousePos.y - 0.5) * -30;
    const rotateYVal = isHovered ? 0 : (mousePos.x - 0.5) * 30;
    const rotateZVal = isHovered ? -45 : 0;

    // Layer styles
    const renderLayerContent = (layer: StackLayer, index: number) => {
      const zOffset = isHovered ? (layers.length - 1 - index) * 60 : 0;

      const layerProps = {
        className: "absolute inset-0 rounded-2xl overflow-hidden border border-white/10 backdrop-blur-md flex flex-col justify-between p-6 transition-colors duration-500",
        style: {
          backgroundColor: layer.type === "glass" ? "rgba(20, 20, 20, 0.4)" : "rgba(10, 10, 10, 0.8)",
          borderColor: isHovered ? (layer.color ? `${layer.color}50` : "rgba(255,255,255,0.2)") : "rgba(255,255,255,0.1)",
          boxShadow: isHovered && layer.color ? `0 0 30px ${layer.color}20` : "none",
        }
      };

      return (
        <motion.div
          key={layer.id}
          className="absolute inset-0"
          initial={false}
          animate={{ z: zOffset }}
          transition={{ type: "spring", damping: 20, stiffness: 120, delay: index * 0.05 }}
        >
          <div {...layerProps}>
            {/* Top Bar */}
            <div className="flex justify-between items-center w-full z-10">
              <span className="font-mono text-[10px] uppercase tracking-widest text-white/50">
                {layer.id}
              </span>
              <div className="flex gap-1">
                <div className="w-1.5 h-1.5 rounded-full" style={{ backgroundColor: layer.color || accentColor, opacity: isHovered ? 1 : 0.3 }} />
                <div className="w-1.5 h-1.5 rounded-full bg-white/20" />
              </div>
            </div>

            {/* Center Content / Patterns */}
            <div className="flex-1 flex items-center justify-center relative w-full h-full mt-4 mb-4">
              {layer.type === "grid" && (
                <div className="absolute inset-0 opacity-20" style={{
                  backgroundImage: `linear-gradient(${layer.color || glowColor} 1px, transparent 1px), linear-gradient(90deg, ${layer.color || glowColor} 1px, transparent 1px)`,
                  backgroundSize: "20px 20px"
                }} />
              )}
              {layer.type === "circuit" && (
                <svg className="absolute inset-0 w-full h-full opacity-30" viewBox="0 0 100 100" preserveAspectRatio="none">
                  <path d="M10,50 L30,50 L40,20 L60,80 L70,50 L90,50" fill="none" stroke={layer.color || accentColor} strokeWidth="2" strokeLinejoin="round" />
                  <circle cx="10" cy="50" r="3" fill={layer.color || accentColor} />
                  <circle cx="90" cy="50" r="3" fill={layer.color || accentColor} />
                </svg>
              )}
              {layer.type === "hologram" && (
                <motion.div
                  className="w-16 h-16 rounded-full blur-xl"
                  style={{ backgroundColor: layer.color || glowColor }}
                  animate={isHovered ? { scale: [1, 1.5, 1], opacity: [0.5, 0.8, 0.5] } : { scale: 1, opacity: 0.2 }}
                  transition={{ duration: 2, repeat: Infinity, ease: "easeInOut" }}
                />
              )}
              {layer.content && <div className="z-10">{layer.content}</div>}
            </div>

            {/* Bottom Bar */}
            <div className="w-full z-10 flex justify-between items-end">
              <h3 className="font-sans font-bold text-lg text-white/90 tracking-tight leading-none">
                {layer.title}
              </h3>
              {isHovered && (
                <motion.div
                  initial={{ opacity: 0, x: -10 }}
                  animate={{ opacity: 1, x: 0 }}
                  className="font-mono text-[8px] text-white/40 uppercase"
                >
                  Render Active
                </motion.div>
              )}
            </div>

            {/* Noise Overlay */}
            <div className="absolute inset-0 opacity-[0.03] mix-blend-overlay pointer-events-none" style={{ backgroundImage: "url('data:image/svg+xml;utf8,%3Csvg viewBox=%220 0 200 200%22 xmlns=%22http://www.w3.org/2000/svg%22%3E%3Cfilter id=%22noiseFilter%22%3E%3CfeTurbulence type=%22fractalNoise%22 baseFrequency=%220.8%22 numOctaves=%223%22 stitchTiles=%22stitch%22/%3E%3C/filter%3E%3Crect width=%22100%25%22 height=%22100%25%22 filter=%22url(%23noiseFilter)%22/%3E%3C/svg%3E')" }} />
          </div>
        </motion.div>
      );
    };

    return (
      <div
        ref={ref}
        className={`relative cursor-crosshair ${className}`}
        style={{
          width: width || "100%",
          height: height || 420,
          perspective: "2000px",
          ...style
        }}
        onMouseMove={handleMouseMove}
        onMouseLeave={handleMouseLeave}
        onMouseEnter={() => setIsHovered(true)}
        {...props}
      >
        <motion.div
          className="w-full h-full relative"
          style={{
            transformStyle: "preserve-3d",
          }}
          animate={{
            rotateX: rotateXVal,
            rotateY: rotateYVal,
            rotateZ: rotateZVal,
          }}
          transition={{
            type: "spring",
            stiffness: 120,
            damping: 20,
            mass: 0.5
          }}
        >
          {/* Base Shadow */}
          <motion.div
            className="absolute inset-0 bg-black/60 blur-2xl rounded-3xl"
            animate={{
              opacity: isHovered ? 0.8 : 0.4,
              scale: isHovered ? 0.9 : 1,
              y: isHovered ? 100 : 20
            }}
            transition={{ type: "spring", damping: 25, stiffness: 120 }}
            style={{ transform: "translateZ(-100px)" }}
          />

          {/* Connecting Laser Lines (visible only on hover) */}
          <AnimatePresence>
            {isHovered && (
              <motion.div
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                exit={{ opacity: 0 }}
                className="absolute inset-0 pointer-events-none"
                style={{ transformStyle: "preserve-3d" }}
              >
                {/* 4 Corner connecting lines */}
                {[
                  { top: "10%", left: "10%" },
                  { top: "10%", right: "10%" },
                  { bottom: "10%", left: "10%" },
                  { bottom: "10%", right: "10%" }
                ].map((pos, i) => (
                  <div
                    key={i}
                    className="absolute w-[1px] bg-gradient-to-b from-transparent via-white/30 to-transparent"
                    style={{
                      ...pos,
                      height: `${layers.length * 60}px`,
                      transform: `translateZ(0px) rotateX(90deg)`,
                      transformOrigin: "top"
                    }}
                  />
                ))}
              </motion.div>
            )}
          </AnimatePresence>

          {/* Render Layers (Bottom to Top) */}
          {layers.map((layer, index) => renderLayerContent(layer, index))}

        </motion.div>
      </div>
    );
  }
);

KineticHoloStack.displayName = "KineticHoloStack";
