"use client";

import React, { useRef, useState, useEffect } from "react";
import { motion, useMotionValue, useSpring, useTransform, AnimatePresence } from "framer-motion";

export interface HexNode {
  id: string;
  row: number;
  col: number;
  title?: string;
  icon?: React.ReactNode;
  status?: "online" | "offline" | "warning";
}

export interface HoloHexagonMapProps extends React.ComponentPropsWithoutRef<"div"> {
  nodes?: HexNode[];
  rows?: number;
  cols?: number;
  hexSize?: number;
  gap?: number;
  primaryColor?: string;
  accentColor?: string;
  warningColor?: string;
  onNodeClick?: (node: HexNode) => void;
}

const SQRT3 = Math.sqrt(3);

export function HoloHexagonMap({
  nodes = [
    { id: "core", row: 2, col: 2, title: "CORE", status: "online" },
    { id: "db", row: 1, col: 3, title: "DB_01", status: "online" },
    { id: "auth", row: 3, col: 1, title: "AUTH", status: "warning" },
    { id: "edge", row: 3, col: 3, title: "EDGE", status: "offline" },
    { id: "cache", row: 1, col: 1, title: "CACHE", status: "online" },
  ],
  rows = 5,
  cols = 5,
  hexSize = 48,
  gap = 4,
  primaryColor = "#7fff5e",
  accentColor = "#ff5c71",
  warningColor = "#f5a623",
  className = "",
  style,
  onNodeClick,
  ...props
}: HoloHexagonMapProps) {
  const containerRef = useRef<HTMLDivElement>(null);
  const [hoveredNode, setHoveredNode] = useState<string | null>(null);
  const [mounted, setMounted] = useState(false);

  useEffect(() => {
    setTimeout(() => {
      setMounted(true);
    }, 0);
  }, []);

  const mouseX = useMotionValue(0);
  const mouseY = useMotionValue(0);

  const handleMouseMove = (e: React.MouseEvent) => {
    if (!containerRef.current) return;
    const rect = containerRef.current.getBoundingClientRect();
    const x = e.clientX - rect.left - rect.width / 2;
    const y = e.clientY - rect.top - rect.height / 2;
    mouseX.set(x);
    mouseY.set(y);
  };

  const handleMouseLeave = () => {
    mouseX.set(0);
    mouseY.set(0);
  };

  const springConfig = { damping: 30, stiffness: 150, mass: 1 };
  const smoothX = useSpring(mouseX, springConfig);
  const smoothY = useSpring(mouseY, springConfig);

  const rotateX = useTransform(smoothY, [-300, 300], [15, -15]);
  const rotateY = useTransform(smoothX, [-300, 300], [-15, 15]);

  const hexWidth = SQRT3 * hexSize;
  const hexHeight = 2 * hexSize;
  const horizontalSpacing = hexWidth + gap;
  const verticalSpacing = (3 / 2) * hexSize + gap;

  const totalWidth = cols * horizontalSpacing + horizontalSpacing / 2;
  const totalHeight = rows * verticalSpacing + hexSize / 2;

  const getStatusColor = (status?: string) => {
    switch (status) {
      case "online":
        return primaryColor;
      case "warning":
        return warningColor;
      case "offline":
        return accentColor;
      default:
        return "rgba(255,255,255,0.1)";
    }
  };

  const getStatusGlow = (status?: string) => {
    const color = getStatusColor(status);
    return status && status !== "offline" ? `0 0 15px ${color}80` : "none";
  };

  const gridCells = [];
  for (let r = 0; r < rows; r++) {
    for (let c = 0; c < cols; c++) {
      gridCells.push({ row: r, col: c });
    }
  }

  const clipPath = "polygon(50% 0%, 100% 25%, 100% 75%, 50% 100%, 0% 75%, 0% 25%)";

  return (
    <div
      className={`relative w-full h-[500px] bg-black overflow-hidden flex items-center justify-center font-['Outfit'] ${className}`}
      onMouseMove={handleMouseMove}
      onMouseLeave={handleMouseLeave}
      ref={containerRef}
      style={{ perspective: 1200, ...style }}
      {...props}
    >
      <div className="absolute inset-0 bg-[radial-gradient(ellipse_at_center,_rgba(127,255,94,0.05)_0%,_rgba(0,0,0,1)_70%)] pointer-events-none" />

      <motion.div
        className="relative"
        style={{
          width: totalWidth,
          height: totalHeight,
          rotateX: mounted ? rotateX : 0,
          rotateY: mounted ? rotateY : 0,
          transformStyle: "preserve-3d",
        }}
      >
        {gridCells.map((cell) => {
          const node = nodes.find((n) => n.row === cell.row && n.col === cell.col);
          const x = cell.col * horizontalSpacing + (cell.row % 2 === 1 ? horizontalSpacing / 2 : 0);
          const y = cell.row * verticalSpacing;
          const isHovered = hoveredNode === (node ? node.id : `${cell.row}-${cell.col}`);
          const color = node ? getStatusColor(node.status) : "rgba(255,255,255,0.05)";
          const glow = node ? getStatusGlow(node.status) : "none";

          return (
            <motion.div
              key={node ? node.id : `${cell.row}-${cell.col}`}
              className={`absolute transition-all duration-300 ${node ? "cursor-pointer z-10" : "z-0"}`}
              style={{
                left: x,
                top: y,
                width: hexWidth,
                height: hexHeight,
                transformStyle: "preserve-3d",
              }}
              onMouseEnter={() => setHoveredNode(node ? node.id : `${cell.row}-${cell.col}`)}
              onMouseLeave={() => setHoveredNode(null)}
              onClick={() => node && onNodeClick && onNodeClick(node)}
              animate={{
                z: isHovered && node ? 30 : 0,
                scale: isHovered && node ? 1.1 : 1,
              }}
              transition={{ type: "spring", stiffness: 300, damping: 20 }}
            >
              {/* The Hexagon Shape */}
              <div
                className="absolute inset-0 bg-black/40 backdrop-blur-md flex flex-col items-center justify-center border-box transition-colors duration-300"
                style={{
                  clipPath,
                  backgroundColor: isHovered && !node ? "rgba(255,255,255,0.08)" : (node ? "rgba(20,20,20,0.8)" : "rgba(255,255,255,0.03)"),
                  boxShadow: node ? `inset 0 0 20px ${color}30` : "none",
                }}
              >
                {/* Border effect using an inner slightly smaller hex */}
                <div
                  className="absolute"
                  style={{
                    width: "96%",
                    height: "98%",
                    clipPath,
                    backgroundColor: "transparent",
                    border: `1px solid ${isHovered && node ? color : color.replace("1)", "0.3)")}`,
                    boxShadow: glow,
                  }}
                />

                {node && (
                  <motion.div
                    className="flex flex-col items-center gap-1"
                    initial={{ opacity: 0 }}
                    animate={{ opacity: 1 }}
                    transition={{ delay: 0.1 }}
                  >
                    <div
                      className="w-2 h-2 rounded-full mb-1"
                      style={{
                        backgroundColor: color,
                        boxShadow: `0 0 8px ${color}`,
                      }}
                    />
                    {node.title && (
                      <span
                        className="text-[10px] font-bold tracking-wider"
                        style={{ color: isHovered ? "#fff" : color }}
                      >
                        {node.title}
                      </span>
                    )}
                  </motion.div>
                )}
              </div>
            </motion.div>
          );
        })}
      </motion.div>

      {/* Floating Info Panel when a node is hovered */}
      <AnimatePresence>
        {hoveredNode && nodes.find((n) => n.id === hoveredNode) && (
          <motion.div
            initial={{ opacity: 0, y: 10, scale: 0.95 }}
            animate={{ opacity: 1, y: 0, scale: 1 }}
            exit={{ opacity: 0, y: 10, scale: 0.95 }}
            className="absolute bottom-8 right-8 bg-black/80 backdrop-blur-xl border p-4 min-w-[200px]"
            style={{
              borderColor: "rgba(255,255,255,0.1)",
              clipPath: "polygon(0 0, 100% 0, 100% calc(100% - 10px), calc(100% - 10px) 100%, 0 100%)"
            }}
          >
            {(() => {
              const node = nodes.find((n) => n.id === hoveredNode)!;
              const color = getStatusColor(node.status);
              return (
                <div className="flex flex-col gap-2 text-white">
                  <div className="flex items-center gap-2 border-b pb-2" style={{ borderColor: "rgba(255,255,255,0.1)" }}>
                     <div className="w-3 h-3 rounded-none bg-transparent border-2 animate-pulse" style={{ borderColor: color }} />
                     <span className="font-mono text-sm tracking-widest uppercase" style={{ color }}>
                       {node.title || "UNKNOWN"}
                     </span>
                  </div>
                  <div className="flex justify-between items-center text-xs text-white/50 font-mono mt-1">
                    <span>STATUS</span>
                    <span style={{ color }}>{node.status?.toUpperCase() || "N/A"}</span>
                  </div>
                  <div className="flex justify-between items-center text-xs text-white/50 font-mono mt-1">
                    <span>COORDS</span>
                    <span>[{node.row}, {node.col}]</span>
                  </div>
                </div>
              );
            })()}
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
}
