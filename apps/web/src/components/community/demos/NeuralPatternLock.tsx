"use client";

import React, { useRef, useState, useEffect } from "react";
import { motion, useMotionValue, useSpring, useTransform } from "framer-motion";

export interface NeuralPatternLockProps {
  className?: string;
  style?: React.CSSProperties;
  gridSize?: number;
  correctPattern?: number[];
  primaryColor?: string;
  successColor?: string;
  errorColor?: string;
  onSuccess?: () => void;
  onError?: () => void;
}

export function NeuralPatternLock({
  gridSize = 3,
  correctPattern = [0, 1, 2, 5, 8],
  primaryColor = "#7fff5e",
  successColor = "#00f0ff",
  errorColor = "#ff5c71",
  onSuccess,
  onError,
  className = "",
  style,
  ...props
}: NeuralPatternLockProps) {
  const containerRef = useRef<HTMLDivElement>(null);

  const [selectedNodes, setSelectedNodes] = useState<number[]>([]);
  const [isDrawing, setIsDrawing] = useState(false);
  const [status, setStatus] = useState<"idle" | "success" | "error">("idle");
  const [currentMousePos, setCurrentMousePos] = useState({ x: 0, y: 0 });
  const [nodePositions, setNodePositions] = useState<{ x: number; y: number }[]>([]);

  // 3D Tilt Effect
  const mouseX = useMotionValue(0);
  const mouseY = useMotionValue(0);

  const springConfig = { damping: 20, stiffness: 100, mass: 0.5 };
  const smoothMouseX = useSpring(mouseX, springConfig);
  const smoothMouseY = useSpring(mouseY, springConfig);

  const rotateX = useTransform(smoothMouseY, [-0.5, 0.5], [15, -15]);
  const rotateY = useTransform(smoothMouseX, [-0.5, 0.5], [-15, 15]);

  const handleMouseMove = (e: React.MouseEvent | React.TouchEvent) => {
    if (!containerRef.current) return;

    let clientX, clientY;
    if ("touches" in e) {
      clientX = e.touches[0].clientX;
      clientY = e.touches[0].clientY;
    } else {
      clientX = (e as React.MouseEvent).clientX;
      clientY = (e as React.MouseEvent).clientY;
    }

    const rect = containerRef.current.getBoundingClientRect();

    // For 3D Tilt
    const xPct = (clientX - rect.left) / rect.width - 0.5;
    const yPct = (clientY - rect.top) / rect.height - 0.5;
    mouseX.set(xPct);
    mouseY.set(yPct);

    // For Pattern Drawing
    if (isDrawing && status === "idle") {
      setCurrentMousePos({
        x: clientX - rect.left,
        y: clientY - rect.top,
      });

      // Check intersection with nodes
      const nodeRadius = 24; // Approximate hit area
      nodePositions.forEach((pos, index) => {
        if (selectedNodes.includes(index)) return;

        const dx = (clientX - rect.left) - pos.x;
        const dy = (clientY - rect.top) - pos.y;
        const distance = Math.sqrt(dx * dx + dy * dy);

        if (distance < nodeRadius) {
          setSelectedNodes((prev) => [...prev, index]);
        }
      });
    }
  };

  const handleMouseLeave = () => {
    mouseX.set(0);
    mouseY.set(0);
    if (isDrawing) {
      handleDrawEnd();
    }
  };

  const handleDrawStart = (index: number) => {
    if (status !== "idle") return;
    setIsDrawing(true);
    setSelectedNodes([index]);

    if (containerRef.current) {
        const pos = nodePositions[index];
        if (pos) {
            setCurrentMousePos({ x: pos.x, y: pos.y });
        }
    }
  };

  const handleDrawEnd = () => {
    if (!isDrawing) return;
    setIsDrawing(false);

    if (selectedNodes.length === 0) return;

    // Check pattern
    const isCorrect = selectedNodes.length === correctPattern.length &&
      selectedNodes.every((val, index) => val === correctPattern[index]);

    if (isCorrect) {
      setStatus("success");
      if (onSuccess) onSuccess();
    } else {
      setStatus("error");
      if (onError) onError();
    }

    // Reset after delay
    setTimeout(() => {
      setStatus("idle");
      setSelectedNodes([]);
    }, 1500);
  };

  useEffect(() => {
    // Calculate node centers relative to container
    if (containerRef.current) {
      const updatePositions = () => {
        if (!containerRef.current) return;
        const rect = containerRef.current.getBoundingClientRect();
        const nodes = containerRef.current.querySelectorAll('.pattern-node');
        const positions: { x: number; y: number }[] = [];

        nodes.forEach((node) => {
          const nodeRect = node.getBoundingClientRect();
          positions.push({
            x: nodeRect.left - rect.left + nodeRect.width / 2,
            y: nodeRect.top - rect.top + nodeRect.height / 2,
          });
        });
        setNodePositions(positions);
      };

      updatePositions();
      window.addEventListener('resize', updatePositions);
      return () => window.removeEventListener('resize', updatePositions);
    }
  }, []);

  const numNodes = gridSize * gridSize;
  const nodes = Array.from({ length: numNodes }, (_, i) => i);

  let activeColor = primaryColor;
  if (status === "success") activeColor = successColor;
  if (status === "error") activeColor = errorColor;

  return (
    <motion.div
      ref={containerRef}
      onMouseMove={handleMouseMove}
      onTouchMove={handleMouseMove}
      onMouseLeave={handleMouseLeave}
      onMouseUp={handleDrawEnd}
      onTouchEnd={handleDrawEnd}
      style={{
        rotateX,
        rotateY,
        transformStyle: "preserve-3d",
        ...style
      }}
      className={`relative w-full max-w-sm aspect-square p-8 rounded-3xl bg-black/40 border border-white/10 backdrop-blur-xl shadow-2xl flex items-center justify-center cursor-crosshair select-none touch-none ${className}`}
      {...props}
    >
      {/* Background Grid Elements */}
      <div className="absolute inset-0 pointer-events-none opacity-20"
        style={{
          backgroundImage: `radial-gradient(circle at center, ${activeColor} 1px, transparent 1px)`,
          backgroundSize: '24px 24px'
        }}
      />

      {/* Container for SVG Lines */}
      <svg className="absolute inset-0 w-full h-full pointer-events-none" style={{ zIndex: 1 }}>
        <defs>
            <filter id="glow" x="-20%" y="-20%" width="140%" height="140%">
                <feGaussianBlur stdDeviation="4" result="blur" />
                <feComposite in="SourceGraphic" in2="blur" operator="over" />
            </filter>
        </defs>

        {/* Draw confirmed paths */}
        {selectedNodes.map((nodeIndex, i) => {
          if (i === 0) return null;
          const prevNode = selectedNodes[i - 1];
          const pos1 = nodePositions[prevNode];
          const pos2 = nodePositions[nodeIndex];
          if (!pos1 || !pos2) return null;

          return (
            <motion.line
              key={`line-${prevNode}-${nodeIndex}`}
              initial={{ pathLength: 0, opacity: 0 }}
              animate={{ pathLength: 1, opacity: 1 }}
              transition={{ duration: 0.2, ease: "easeOut" }}
              x1={pos1.x}
              y1={pos1.y}
              x2={pos2.x}
              y2={pos2.y}
              stroke={activeColor}
              strokeWidth="6"
              strokeLinecap="round"
              filter="url(#glow)"
              className="drop-shadow-lg"
            />
          );
        })}

        {/* Draw current dragging line */}
        {isDrawing && selectedNodes.length > 0 && (
          <line
            x1={nodePositions[selectedNodes[selectedNodes.length - 1]]?.x || 0}
            y1={nodePositions[selectedNodes[selectedNodes.length - 1]]?.y || 0}
            x2={currentMousePos.x}
            y2={currentMousePos.y}
            stroke={activeColor}
            strokeWidth="4"
            strokeLinecap="round"
            strokeDasharray="8 8"
            opacity={0.6}
          />
        )}
      </svg>

      {/* Nodes Grid */}
      <div
        className="relative z-10 grid gap-6 sm:gap-8 w-full h-full"
        style={{
          gridTemplateColumns: `repeat(${gridSize}, 1fr)`,
          gridTemplateRows: `repeat(${gridSize}, 1fr)`,
          transform: "translateZ(30px)"
        }}
      >
        {nodes.map((index) => {
          const isSelected = selectedNodes.includes(index);
          const isLast = selectedNodes[selectedNodes.length - 1] === index;

          return (
            <div
              key={index}
              className="pattern-node relative flex items-center justify-center w-full h-full touch-none"
              onMouseDown={() => handleDrawStart(index)}
              onTouchStart={() => handleDrawStart(index)}
            >
              {/* Outer Glow Ring */}
              <motion.div
                animate={{
                  scale: isSelected ? 1.5 : 1,
                  opacity: isSelected ? 0.3 : 0,
                  borderColor: activeColor
                }}
                className="absolute w-12 h-12 sm:w-16 sm:h-16 rounded-full border-2"
                style={{ borderColor: activeColor }}
              />

              {/* Inner Node */}
              <motion.div
                animate={{
                  scale: isSelected ? (isLast ? 1.4 : 1.2) : 1,
                  backgroundColor: isSelected ? activeColor : "rgba(255,255,255,0.1)",
                  boxShadow: isSelected ? `0 0 20px ${activeColor}` : "none"
                }}
                className="w-4 h-4 sm:w-6 sm:h-6 rounded-full backdrop-blur-md border border-white/20 z-20"
              />

              {/* Shake Effect for Error */}
              {status === "error" && isSelected && (
                 <motion.div
                    initial={{ x: 0 }}
                    animate={{ x: [-5, 5, -5, 5, 0] }}
                    transition={{ duration: 0.4 }}
                    className="absolute inset-0"
                 />
              )}
            </div>
          );
        })}
      </div>
    </motion.div>
  );
}
