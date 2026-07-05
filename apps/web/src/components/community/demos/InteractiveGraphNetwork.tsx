"use client";

import React, { useRef, useState, useEffect } from "react";
import { motion, useMotionValue, useSpring } from "framer-motion";

export interface SynapseNode {
  id: string;
  label: string;
  x: number; // Percentage 0-100
  y: number; // Percentage 0-100
  color: string;
  connections?: string[]; // IDs of other nodes to connect to
}

export interface InteractiveGraphNetworkProps {
  nodes?: SynapseNode[];
  containerBg?: string;
  accentColor?: string;
  title?: string;
  subtitle?: string;
}

const DEFAULT_NODES: SynapseNode[] = [
  { id: "core", label: "Core Router", x: 50, y: 50, color: "#ff5c71", connections: ["data", "net", "sys"] },
  { id: "data", label: "Data Gateway", x: 20, y: 80, color: "#7fff5e", connections: ["auth"] },
  { id: "auth", label: "Auth Manager", x: 80, y: 20, color: "#00f0ff", connections: ["sys"] },
  { id: "sys", label: "System Monitor", x: 80, y: 80, color: "#b026ff", connections: ["core"] },
  { id: "net", label: "Network Policy", x: 20, y: 20, color: "#ffb800", connections: ["auth"] },
];

export const InteractiveGraphNetwork: React.FC<InteractiveGraphNetworkProps> = ({
  nodes = DEFAULT_NODES,
  containerBg = "#050505",
  accentColor = "#ff5c71",
  title = "SYNAPSE TERMINAL",
  subtitle = "SERVICE STATUS: ACTIVE",
}) => {
  const containerRef = useRef<HTMLDivElement>(null);
  const [dimensions, setDimensions] = useState({ width: 0, height: 0 });
  const [activeNode, setActiveNode] = useState<string | null>(null);
  const [hoveredNode, setHoveredNode] = useState<string | null>(null);
  const [mounted, setMounted] = useState(false);

  const mouseX = useMotionValue(-1000);
  const mouseY = useMotionValue(-1000);

  const springConfig = { stiffness: 150, damping: 20, mass: 0.5 };
  const smoothMouseX = useSpring(mouseX, springConfig);
  const smoothMouseY = useSpring(mouseY, springConfig);

  useEffect(() => {
    setTimeout(() => setMounted(true), 0);
    if (!containerRef.current) return;

    const updateDimensions = () => {
      if (containerRef.current) {
        setDimensions({
          width: containerRef.current.offsetWidth,
          height: containerRef.current.offsetHeight,
        });
      }
    };

    updateDimensions();
    window.addEventListener("resize", updateDimensions);

    // Set initial mouse position to center
    if (containerRef.current) {
      mouseX.set(containerRef.current.offsetWidth / 2);
      mouseY.set(containerRef.current.offsetHeight / 2);
    }

    return () => window.removeEventListener("resize", updateDimensions);
  }, [mouseX, mouseY]);

  const handleMouseMove = (e: React.MouseEvent<HTMLDivElement>) => {
    if (!containerRef.current) return;
    const rect = containerRef.current.getBoundingClientRect();
    mouseX.set(e.clientX - rect.left);
    mouseY.set(e.clientY - rect.top);
  };

  const handleMouseLeave = () => {
    if (!containerRef.current) return;
    mouseX.set(containerRef.current.offsetWidth / 2);
    mouseY.set(containerRef.current.offsetHeight / 2);
    setHoveredNode(null);
  };

  // Helper to get pixel coordinates for nodes
  const getNodePos = (xPct: number, yPct: number) => {
    return {
      x: (xPct / 100) * dimensions.width,
      y: (yPct / 100) * dimensions.height,
    };
  };

  return (
    <div
      ref={containerRef}
      onMouseMove={handleMouseMove}
      onMouseLeave={handleMouseLeave}
      className="relative w-full h-[600px] rounded-3xl overflow-hidden font-mono group"
      style={{ backgroundColor: containerBg }}
    >
      {/* Background Grid & Noise */}
      <div
        className="absolute inset-0 z-0 opacity-10 pointer-events-none"
        style={{
          backgroundImage: `
            linear-gradient(rgba(255, 255, 255, 0.15) 1px, transparent 1px),
            linear-gradient(90deg, rgba(255, 255, 255, 0.15) 1px, transparent 1px)
          `,
          backgroundSize: '40px 40px',
          backgroundPosition: 'center center',
          maskImage: 'radial-gradient(circle at center, black, transparent 80%)',
          WebkitMaskImage: 'radial-gradient(circle at center, black, transparent 80%)'
        }}
      />

      {/* Global Glow */}
      <motion.div
        className="absolute w-[600px] h-[600px] rounded-full pointer-events-none z-0 blur-[100px] opacity-20"
        style={{
          background: `radial-gradient(circle, ${accentColor} 0%, transparent 70%)`,
          x: smoothMouseX,
          y: smoothMouseY,
          translateX: "-50%",
          translateY: "-50%",
        }}
      />

      {/* Header */}
      <div className="absolute top-6 left-6 z-20 pointer-events-none">
        <h2 className="text-white/90 text-sm font-bold tracking-widest flex items-center gap-3">
          <div className="w-2 h-2 rounded-full bg-white animate-pulse" />
          {title}
        </h2>
        <p className="text-white/40 text-xs mt-1 tracking-wider">{subtitle}</p>
      </div>

      {/* Connection Lines (SVG) */}
      <svg className="absolute inset-0 w-full h-full z-0 pointer-events-none">
        <defs>
          {nodes.map(node => (
            <linearGradient key={`grad-${node.id}`} id={`grad-${node.id}`} x1="0%" y1="0%" x2="100%" y2="100%">
              <stop offset="0%" stopColor={node.color} stopOpacity="0.8" />
              <stop offset="100%" stopColor={node.color} stopOpacity="0.1" />
            </linearGradient>
          ))}
          <filter id="glow">
            <feGaussianBlur stdDeviation="3" result="coloredBlur"/>
            <feMerge>
              <feMergeNode in="coloredBlur"/>
              <feMergeNode in="SourceGraphic"/>
            </feMerge>
          </filter>
        </defs>

        {mounted && dimensions.width > 0 && nodes.map((node) => {
          if (!node.connections) return null;
          const start = getNodePos(node.x, node.y);

          return node.connections.map((targetId) => {
            const targetNode = nodes.find(n => n.id === targetId);
            if (!targetNode) return null;

            const end = getNodePos(targetNode.x, targetNode.y);

            // Calculate bezier control points for curved lines
            const midX = (start.x + end.x) / 2;
            const midY = (start.y + end.y) / 2;
            const dist = Math.sqrt(Math.pow(end.x - start.x, 2) + Math.pow(end.y - start.y, 2));
            const curvature = dist * 0.2;

            // Perpendicular offset for curves
            const angle = Math.atan2(end.y - start.y, end.x - start.x);
            const cpX = midX + Math.cos(angle - Math.PI/2) * curvature;
            const cpY = midY + Math.sin(angle - Math.PI/2) * curvature;

            const isHighlighted = activeNode === node.id || activeNode === targetId ||
                                  hoveredNode === node.id || hoveredNode === targetId;

            return (
              <g key={`${node.id}-${targetId}`}>
                {/* Base Line */}
                <path
                  d={`M ${start.x} ${start.y} Q ${cpX} ${cpY} ${end.x} ${end.y}`}
                  fill="none"
                  stroke="rgba(255,255,255,0.05)"
                  strokeWidth="1"
                />
                {/* Animated Flow Line */}
                <path
                  d={`M ${start.x} ${start.y} Q ${cpX} ${cpY} ${end.x} ${end.y}`}
                  fill="none"
                  stroke={`url(#grad-${node.id})`}
                  strokeWidth={isHighlighted ? "2" : "1"}
                  strokeDasharray="4 8"
                  className="transition-all duration-500"
                  style={{
                    opacity: isHighlighted ? 1 : 0.3,
                    filter: isHighlighted ? "url(#glow)" : "none",
                    animation: isHighlighted ? "dashFlow 2s linear infinite" : "none",
                  }}
                />
              </g>
            );
          });
        })}
      </svg>

      {/* Interactive Custom Cursor */}
      <motion.div
        className="absolute z-50 pointer-events-none mix-blend-screen flex items-center justify-center"
        style={{
          x: smoothMouseX,
          y: smoothMouseY,
          translateX: "-50%",
          translateY: "-50%",
        }}
      >
        <div className="w-4 h-4 border border-white/50 rounded-full flex items-center justify-center relative">
          <div className="w-1 h-1 bg-white rounded-full" />
          {/* Crosshairs */}
          <div className="absolute top-[-10px] w-[1px] h-[6px] bg-white/30" />
          <div className="absolute bottom-[-10px] w-[1px] h-[6px] bg-white/30" />
          <div className="absolute left-[-10px] h-[1px] w-[6px] bg-white/30" />
          <div className="absolute right-[-10px] h-[1px] w-[6px] bg-white/30" />
        </div>
      </motion.div>

      {/* Nodes */}
      {nodes.map((node) => {
        const isActive = activeNode === node.id;
        const isHovered = hoveredNode === node.id;
        const isRelated = activeNode ?
          nodes.find(n => n.id === activeNode)?.connections?.includes(node.id) || node.connections?.includes(activeNode)
          : false;

        const isHighlighted = isActive || isHovered || isRelated;

        return (
          <motion.div
            key={node.id}
            className="absolute z-30"
            style={{
              left: `${node.x}%`,
              top: `${node.y}%`,
              transform: "translate(-50%, -50%)",
            }}
            initial={{ scale: 0, opacity: 0 }}
            animate={{ scale: 1, opacity: 1 }}
            transition={{ type: "spring", delay: (nodes.indexOf(node) % 5) * 0.1 }}
          >
            {/* Magnetic Hover Area */}
            <div
              className="absolute inset-[-30px] rounded-full z-40 cursor-crosshair"
              onMouseEnter={() => setHoveredNode(node.id)}
              onMouseLeave={() => setHoveredNode(null)}
              onClick={() => setActiveNode(isActive ? null : node.id)}
            />

            <motion.div
              className={`
                relative px-5 py-3 rounded-2xl backdrop-blur-xl border flex items-center gap-3
                transition-colors duration-300 pointer-events-none
                ${isHighlighted
                  ? "bg-black/60 border-white/30"
                  : "bg-black/40 border-white/5"}
              `}
              animate={{
                y: isHovered ? -5 : 0,
                boxShadow: isHighlighted
                  ? `0 10px 30px -10px ${node.color}50, 0 0 15px -5px ${node.color}50 inset`
                  : "0 0 0 transparent",
                scale: isHovered ? 1.05 : 1
              }}
            >
              {/* Node Indicator */}
              <div className="relative flex items-center justify-center">
                <motion.div
                  className="w-3 h-3 rounded-full z-10"
                  style={{ backgroundColor: node.color }}
                  animate={{
                    boxShadow: isHighlighted ? `0 0 15px ${node.color}` : `0 0 0px transparent`,
                    scale: isActive ? [1, 1.2, 1] : 1
                  }}
                  transition={{ repeat: isActive ? Infinity : 0, duration: 1.5 }}
                />
                {isActive && (
                  <motion.div
                    className="absolute w-6 h-6 rounded-full border border-current z-0"
                    style={{ color: node.color }}
                    initial={{ scale: 0.5, opacity: 1 }}
                    animate={{ scale: 2, opacity: 0 }}
                    transition={{ repeat: Infinity, duration: 1.5, ease: "easeOut" }}
                  />
                )}
              </div>

              {/* Label */}
              <div className="flex flex-col">
                <span className={`text-xs font-bold tracking-[0.2em] uppercase transition-colors duration-300 ${isHighlighted ? "text-white" : "text-white/50"}`}>
                  {node.label}
                </span>
                <span className="text-[10px] text-white/30 uppercase tracking-widest mt-0.5">
                  ID_{node.id}
                </span>
              </div>
            </motion.div>
          </motion.div>
        );
      })}

      <style dangerouslySetInnerHTML={{__html: `
        @keyframes dashFlow {
          from { stroke-dashoffset: 24; }
          to { stroke-dashoffset: 0; }
        }
      `}} />
    </div>
  );
};
