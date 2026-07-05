"use client";

import React, { useRef, useState } from "react";
import { motion, AnimatePresence, useMotionValue, useSpring } from "framer-motion";

export interface SingularityNode {
  id: string;
  label: string;
  icon: React.ReactNode;
  color: string;
}

export interface SingularityControlNodeProps extends React.ComponentPropsWithoutRef<"div"> {
  nodes?: SingularityNode[];
  coreColor?: string;
  onNodeClick?: (node: SingularityNode) => void;
}

const DEFAULT_NODES: SingularityNode[] = [
  {
    id: "neural-link",
    label: "Neural Link",
    color: "#ff5c71",
    icon: (
      <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
        <path d="M12 2v20M17 5H9.5a3.5 3.5 0 0 0 0 7h5a3.5 3.5 0 0 1 0 7H6" />
      </svg>
    ),
  },
  {
    id: "quantum-state",
    label: "Quantum State",
    color: "#7fff5e",
    icon: (
      <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
        <circle cx="12" cy="12" r="10" />
        <path d="M12 16v-4M12 8h.01" />
      </svg>
    ),
  },
  {
    id: "hyper-drive",
    label: "Hyper Drive",
    color: "#00f0ff",
    icon: (
      <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
        <path d="M5 12h14M12 5l7 7-7 7" />
      </svg>
    ),
  },
  {
    id: "void-core",
    label: "Void Core",
    color: "#a371f7",
    icon: (
      <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
        <path d="M21 12.79A9 9 0 1 1 11.21 3 7 7 0 0 0 21 12.79z" />
      </svg>
    ),
  },
];

export const SingularityControlNode: React.FC<SingularityControlNodeProps> = ({
  nodes = DEFAULT_NODES,
  coreColor = "#ff5c71",
  onNodeClick,
  className = "",
  style,
  ...props
}) => {
  const [isOpen, setIsOpen] = useState(false);
  const containerRef = useRef<HTMLDivElement>(null);

  // Magnetic Core Physics
  const mouseX = useMotionValue(0);
  const mouseY = useMotionValue(0);

  const springConfig = { damping: 15, stiffness: 150, mass: 0.5 };
  const smoothX = useSpring(mouseX, springConfig);
  const smoothY = useSpring(mouseY, springConfig);

  const handleMouseMove = (e: React.MouseEvent<HTMLDivElement>) => {
    if (!containerRef.current || isOpen) {
      mouseX.set(0);
      mouseY.set(0);
      return;
    }
    const rect = containerRef.current.getBoundingClientRect();
    const centerX = rect.left + rect.width / 2;
    const centerY = rect.top + rect.height / 2;

    // Magnetic pull extent
    const pullX = (e.clientX - centerX) * 0.3;
    const pullY = (e.clientY - centerY) * 0.3;

    mouseX.set(pullX);
    mouseY.set(pullY);
  };

  const handleMouseLeave = () => {
    mouseX.set(0);
    mouseY.set(0);
  };

  // Radius for the expanded nodes
  const RADIUS = 120;

  return (
    <div
      className={`relative flex items-center justify-center w-full h-[400px] bg-[#050505] overflow-hidden rounded-2xl border border-white/5 ${className}`}
      style={style}
      {...props}
    >
      {/* Background Grid & Noise */}
      <div className="absolute inset-0 opacity-[0.03]" style={{ backgroundImage: "radial-gradient(circle at center, white 1px, transparent 1px)", backgroundSize: "20px 20px" }} />
      <div className="absolute inset-0 opacity-20 mix-blend-overlay pointer-events-none" style={{ backgroundImage: "url(\"data:image/svg+xml,%3Csvg viewBox='0 0 200 200' xmlns='http://www.w3.org/2000/svg'%3E%3Cfilter id='noiseFilter'%3E%3CfeTurbulence type='fractalNoise' baseFrequency='0.65' numOctaves='3' stitchTiles='stitch'/%3E%3C/filter%3E%3Crect width='100%25' height='100%25' filter='url(%23noiseFilter)'/%3E%3C/svg%3E\")" }} />

      <div
        ref={containerRef}
        className="relative w-full h-full flex items-center justify-center z-10"
        onMouseMove={handleMouseMove}
        onMouseLeave={handleMouseLeave}
      >
        {/* Connection Lines (Synapses) */}
        <svg className="absolute inset-0 w-full h-full pointer-events-none">
          <AnimatePresence>
            {isOpen && nodes.map((node, index) => {
              const angle = (index / nodes.length) * Math.PI * 2 - Math.PI / 2;
              const x2 = `calc(50% + ${Math.cos(angle) * RADIUS}px)`;
              const y2 = `calc(50% + ${Math.sin(angle) * RADIUS}px)`;

              return (
                <motion.line
                  key={`line-${node.id}`}
                  x1="50%"
                  y1="50%"
                  x2={x2}
                  y2={y2}
                  stroke={node.color}
                  strokeWidth="2"
                  strokeOpacity="0.4"
                  strokeDasharray="4 4"
                  initial={{ pathLength: 0, opacity: 0 }}
                  animate={{ pathLength: 1, opacity: 1 }}
                  exit={{ pathLength: 0, opacity: 0 }}
                  transition={{ duration: 0.6, ease: [0.16, 1, 0.3, 1], delay: index * 0.05 }}
                />
              );
            })}
          </AnimatePresence>
        </svg>

        {/* Orbiting Nodes */}
        <AnimatePresence>
          {isOpen && nodes.map((node, index) => {
            const angle = (index / nodes.length) * Math.PI * 2 - Math.PI / 2;
            const x = Math.cos(angle) * RADIUS;
            const y = Math.sin(angle) * RADIUS;

            return (
              <motion.div
                key={`node-${node.id}`}
                className="absolute"
                initial={{ x: 0, y: 0, opacity: 0, scale: 0.5, rotate: -45 }}
                animate={{ x, y, opacity: 1, scale: 1, rotate: 0 }}
                exit={{ x: 0, y: 0, opacity: 0, scale: 0.5, rotate: 45 }}
                transition={{
                  type: "spring",
                  stiffness: 260,
                  damping: 20,
                  delay: index * 0.05
                }}
              >
                <motion.button
                  whileHover={{ scale: 1.1, boxShadow: `0 0 20px ${node.color}40` }}
                  whileTap={{ scale: 0.95 }}
                  onClick={(e) => {
                    e.stopPropagation();
                    if (onNodeClick) onNodeClick(node);
                  }}
                  className="group relative flex items-center justify-center w-12 h-12 rounded-xl bg-black/40 border border-white/10 backdrop-blur-md overflow-hidden cursor-pointer"
                >
                  <div className="absolute inset-0 bg-gradient-to-br from-white/10 to-transparent opacity-0 group-hover:opacity-100 transition-opacity" />
                  <div className="text-white/70 group-hover:text-white transition-colors">
                    {node.icon}
                  </div>
                  {/* Node Glow */}
                  <div
                    className="absolute inset-0 rounded-xl opacity-20 group-hover:opacity-40 transition-opacity blur-md -z-10"
                    style={{ backgroundColor: node.color }}
                  />

                  {/* Tooltip */}
                  <div className="absolute -bottom-8 left-1/2 -translate-x-1/2 whitespace-nowrap px-2 py-1 bg-black/80 border border-white/10 rounded-md text-[10px] text-white/60 font-mono opacity-0 group-hover:opacity-100 transition-opacity pointer-events-none">
                    {node.label}
                  </div>
                </motion.button>
              </motion.div>
            );
          })}
        </AnimatePresence>

        {/* Central Core */}
        <motion.button
          className="relative flex items-center justify-center w-20 h-20 rounded-full cursor-pointer group z-20"
          style={{ x: smoothX, y: smoothY }}
          onClick={() => setIsOpen(!isOpen)}
          whileHover={{ scale: isOpen ? 1 : 1.05 }}
          whileTap={{ scale: 0.95 }}
          aria-expanded={isOpen}
          aria-label="Toggle Singularity Control Node"
        >
          {/* Core Inner */}
          <div className="absolute inset-0 rounded-full bg-black border border-white/10 flex items-center justify-center overflow-hidden">
            {/* Core Gradient Spin */}
            <motion.div
              className="absolute w-[200%] h-[200%] opacity-40 blur-xl"
              style={{
                background: `conic-gradient(from 0deg, transparent, ${coreColor}, transparent)`,
              }}
              animate={{ rotate: 360 }}
              transition={{ duration: 4, repeat: Infinity, ease: "linear" }}
            />
            {/* Core Center Dot */}
            <motion.div
              className="w-4 h-4 rounded-full bg-white z-10 shadow-[0_0_15px_rgba(255,255,255,0.8)]"
              animate={{
                scale: isOpen ? [1, 1.2, 1] : 1,
                backgroundColor: isOpen ? coreColor : "#ffffff"
              }}
              transition={{ duration: 2, repeat: isOpen ? Infinity : 0 }}
            />
          </div>

          {/* Core Outer Glow */}
          <motion.div
            className="absolute inset-[-10px] rounded-full border border-white/5 opacity-50 pointer-events-none"
            animate={{
              scale: isOpen ? [1, 1.2, 1] : 1,
              opacity: isOpen ? [0.5, 0.2, 0.5] : 0.5
            }}
            transition={{ duration: 2, repeat: Infinity, ease: "easeInOut" }}
          />
          <motion.div
            className="absolute inset-[-20px] rounded-full border border-white/5 opacity-30 pointer-events-none"
            animate={{
              scale: isOpen ? [1, 1.4, 1] : 1,
              opacity: isOpen ? [0.3, 0.1, 0.3] : 0.3
            }}
            transition={{ duration: 2, repeat: Infinity, ease: "easeInOut", delay: 0.2 }}
          />

          {/* Active Rings */}
          <AnimatePresence>
            {isOpen && (
              <motion.div
                className="absolute inset-[-30px] rounded-full border border-dashed border-white/20 pointer-events-none"
                initial={{ opacity: 0, scale: 0.8, rotate: 0 }}
                animate={{ opacity: 1, scale: 1, rotate: 180 }}
                exit={{ opacity: 0, scale: 0.8 }}
                transition={{ duration: 10, repeat: Infinity, ease: "linear" }}
              />
            )}
          </AnimatePresence>
        </motion.button>
      </div>
    </div>
  );
};
