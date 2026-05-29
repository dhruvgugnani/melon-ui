"use client";

import React, { useRef, useState } from "react";
import { motion, AnimatePresence, useMotionValue, useSpring, useTransform } from "framer-motion";

export interface CommandItem {
  id: string;
  label: string;
  icon: string;
  color: string;
}

const DEFAULT_COMMANDS: CommandItem[] = [
  { id: "deploy", label: "Deploy", icon: "🚀", color: "#7fff5e" },
  { id: "analyze", label: "Analyze", icon: "⌖", color: "#00f0ff" },
  { id: "purge", label: "Purge", icon: "⚠", color: "#ff5c71" },
  { id: "sync", label: "Sync", icon: "⟳", color: "#ff8c00" }, // Orange to avoid purple ban
  { id: "shield", label: "Shield", icon: "⛨", color: "#e8d5b7" },
];

export interface OrbitalCommandRingProps extends React.ComponentPropsWithoutRef<"div"> {
  commands?: CommandItem[];
  bg?: string;
  borderColor?: string;
  joystickColor?: string;
  onExecute?: (command: CommandItem) => void;
}

export function OrbitalCommandRing({
  commands = DEFAULT_COMMANDS,
  bg = "#050505",
  borderColor = "rgba(255,255,255,0.05)",
  joystickColor = "#ffffff",
  onExecute,
  className = "",
  style,
  ...props
}: OrbitalCommandRingProps) {
  const containerRef = useRef<HTMLDivElement>(null);

  const [menuState, setMenuState] = useState<"idle" | "active" | "executing">("idle");
  const [origin, setOrigin] = useState({ x: 0, y: 0 });
  const [selectedNode, setSelectedNode] = useState<number | null>(null);
  const [lastExecuted, setLastExecuted] = useState<{ label: string; color: string } | null>(null);

  // Motion values for smooth joystick physics
  const dragX = useMotionValue(0);
  const dragY = useMotionValue(0);

  const springConfig = { damping: 20, stiffness: 300, mass: 0.5 };
  const joystickX = useSpring(dragX, springConfig);
  const joystickY = useSpring(dragY, springConfig);

  const originX = useMotionValue(0);
  const originY = useMotionValue(0);

  // Derived absolute position for the joystick
  const joystickAbsX = useTransform(() => originX.get() + joystickX.get());
  const joystickAbsY = useTransform(() => originY.get() + joystickY.get());

  const handlePointerDown = (e: React.PointerEvent) => {
    // Only capture primary pointer
    if (e.button !== 0 && e.pointerType === 'mouse') return;
    if (menuState === "executing") return;

    const rect = containerRef.current?.getBoundingClientRect();
    if (!rect) return;

    const x = e.clientX - rect.left;
    const y = e.clientY - rect.top;

    setOrigin({ x, y });
    originX.set(x);
    originY.set(y);

    dragX.set(0);
    dragY.set(0);

    setMenuState("active");
    setSelectedNode(null);
  };

  const handlePointerMove = (e: React.PointerEvent) => {
    if (menuState !== "active") return;

    const rect = containerRef.current?.getBoundingClientRect();
    if (!rect) return;

    const currentX = e.clientX - rect.left;
    const currentY = e.clientY - rect.top;

    const dx = currentX - origin.x;
    const dy = currentY - origin.y;

    const maxDist = 70;
    const dist = Math.sqrt(dx * dx + dy * dy);

    if (dist > 0) {
      const pullRatio = Math.min(dist / maxDist, 1);
      dragX.set((dx / dist) * maxDist * pullRatio);
      dragY.set((dy / dist) * maxDist * pullRatio);
    } else {
      dragX.set(0);
      dragY.set(0);
    }

    if (dist > 35) {
      // Calculate angle
      let angle = Math.atan2(dy, dx);
      if (angle < 0) angle += 2 * Math.PI;

      const segment = (2 * Math.PI) / commands.length;
      const adjustedAngle = (angle + segment / 2) % (2 * Math.PI);
      const index = Math.floor(adjustedAngle / segment);
      setSelectedNode(index);
    } else {
      setSelectedNode(null);
    }
  };

  const handlePointerUp = () => {
    if (menuState !== "active") return;

    dragX.set(0);
    dragY.set(0);

    if (selectedNode !== null) {
      const cmd = commands[selectedNode];
      setLastExecuted({ label: cmd.label, color: cmd.color });
      setMenuState("executing");

      if (onExecute) {
        onExecute(cmd);
      }

      setTimeout(() => {
        setMenuState("idle");
        setSelectedNode(null);
      }, 1200);
    } else {
      setMenuState("idle");
    }
  };

  return (
    <div
      ref={containerRef}
      onPointerDown={handlePointerDown}
      onPointerMove={handlePointerMove}
      onPointerUp={handlePointerUp}
      onPointerLeave={handlePointerUp}
      onContextMenu={(e) => e.preventDefault()}
      className={`relative w-full h-[500px] overflow-hidden border cursor-crosshair touch-none select-none ${className}`}
      style={{
        backgroundColor: bg,
        borderColor: borderColor,
        ...style
      }}
      {...props}
    >
      {/* Background ambient noise/hint */}
      <div className="absolute inset-0 flex flex-col items-center justify-center pointer-events-none opacity-30">
        <span className="font-mono text-xs uppercase tracking-[0.2em] text-white/50 mb-2">
          Orbital Command Ring
        </span>
        <span className="font-mono text-[10px] text-white/30">
          Hold & drag anywhere to summon
        </span>
      </div>

      <AnimatePresence>
        {menuState === "active" && (
          <motion.div
            key="ring"
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            transition={{ duration: 0.2 }}
            className="absolute inset-0 pointer-events-none"
          >
            {/* SVG Tether connecting origin to joystick */}
            <svg className="absolute inset-0 w-full h-full">
              <motion.line
                x1={originX}
                y1={originY}
                x2={joystickAbsX}
                y2={joystickAbsY}
                stroke="rgba(255, 255, 255, 0.15)"
                strokeWidth={2}
                strokeDasharray="4 4"
              />
            </svg>

            {/* Orbit rings */}
            <div
              className="absolute w-64 h-64 -ml-32 -mt-32 rounded-full border border-white/5 border-dashed"
              style={{ left: origin.x, top: origin.y }}
            />
            <div
              className="absolute w-16 h-16 -ml-8 -mt-8 rounded-full border border-white/10"
              style={{ left: origin.x, top: origin.y }}
            />
            <div
              className="absolute w-2 h-2 -ml-1 -mt-1 rounded-full bg-white/30"
              style={{ left: origin.x, top: origin.y }}
            />

            {/* Command Nodes */}
            {commands.map((cmd, i) => {
              const angle = (i / commands.length) * 2 * Math.PI;
              const radius = 120; // Distance of the nodes from origin
              const nx = origin.x + Math.cos(angle) * radius;
              const ny = origin.y + Math.sin(angle) * radius;

              const isSelected = selectedNode === i;

              return (
                <motion.div
                  key={cmd.id}
                  initial={{ x: origin.x, y: origin.y, opacity: 0, scale: 0 }}
                  animate={{
                    x: nx,
                    y: ny,
                    opacity: 1,
                    scale: isSelected ? 1.15 : 1,
                  }}
                  exit={{ x: origin.x, y: origin.y, opacity: 0, scale: 0 }}
                  transition={{
                    type: "spring",
                    damping: 15,
                    stiffness: 250,
                    delay: i * 0.02,
                  }}
                  className="absolute w-14 h-14 -ml-7 -mt-7 rounded-full flex items-center justify-center border backdrop-blur-md transition-colors"
                  style={{
                    backgroundColor: isSelected
                      ? `${cmd.color}22`
                      : "rgba(10, 10, 10, 0.7)",
                    borderColor: isSelected
                      ? cmd.color
                      : "rgba(255, 255, 255, 0.1)",
                    boxShadow: isSelected
                      ? `0 0 25px ${cmd.color}44`
                      : "0 0 0px transparent",
                    color: isSelected ? cmd.color : "rgba(255, 255, 255, 0.5)",
                  }}
                >
                  <span className="text-xl" style={{ textShadow: isSelected ? `0 0 10px ${cmd.color}` : 'none' }}>
                    {cmd.icon}
                  </span>

                  <AnimatePresence>
                    {isSelected && (
                      <motion.div
                        initial={{ opacity: 0, y: 10, scale: 0.8 }}
                        animate={{ opacity: 1, y: 0, scale: 1 }}
                        exit={{ opacity: 0, y: 5, scale: 0.8 }}
                        className="absolute top-[110%] text-[10px] font-mono tracking-[0.2em] uppercase whitespace-nowrap px-2 py-1 rounded bg-black/80 border"
                        style={{ color: cmd.color, borderColor: `${cmd.color}44` }}
                      >
                        {cmd.label}
                      </motion.div>
                    )}
                  </AnimatePresence>
                </motion.div>
              );
            })}

            {/* Joystick Core */}
            <motion.div
              style={{ x: joystickAbsX, y: joystickAbsY }}
              className="absolute w-10 h-10 -ml-5 -mt-5 rounded-full border border-white/30 bg-white/10 backdrop-blur-md flex items-center justify-center shadow-[0_0_20px_rgba(255,255,255,0.15)]"
            >
              <div
                className="w-2.5 h-2.5 rounded-full transition-colors duration-200"
                style={{
                  backgroundColor:
                    selectedNode !== null ? commands[selectedNode].color : joystickColor,
                  boxShadow:
                    selectedNode !== null
                      ? `0 0 10px ${commands[selectedNode].color}`
                      : `0 0 5px ${joystickColor}`,
                }}
              />
            </motion.div>
          </motion.div>
        )}
      </AnimatePresence>

      {/* Execution Cinematic */}
      <AnimatePresence>
        {menuState === "executing" && lastExecuted && (
          <motion.div
            key="executing"
            className="absolute inset-0 flex items-center justify-center pointer-events-none z-50 overflow-hidden"
          >
            {/* Flash background */}
            <motion.div
              initial={{ opacity: 0.5, backgroundColor: lastExecuted.color }}
              animate={{ opacity: 0 }}
              transition={{ duration: 0.6 }}
              className="absolute inset-0 mix-blend-screen"
            />

            {/* Ripple ring from origin */}
            <motion.div
              initial={{
                width: 0,
                height: 0,
                opacity: 1,
                borderWidth: 10,
              }}
              animate={{
                width: 1000,
                height: 1000,
                opacity: 0,
                borderWidth: 1,
              }}
              transition={{ duration: 0.8, ease: "easeOut" }}
              className="absolute rounded-full"
              style={{
                left: origin.x,
                top: origin.y,
                x: "-50%",
                y: "-50%",
                borderColor: lastExecuted.color,
              }}
            />

            {/* Giant typography flash */}
            <motion.div
              initial={{ scale: 0.8, opacity: 0, y: 30 }}
              animate={{ scale: 1, opacity: 1, y: 0 }}
              exit={{ scale: 1.1, opacity: 0, filter: "blur(20px)" }}
              transition={{ type: "spring", damping: 15, stiffness: 200 }}
              className="relative"
            >
              <h2
                className="text-7xl md:text-9xl font-black uppercase tracking-tighter"
                style={{
                  fontFamily: "var(--font-anton)",
                  color: "transparent",
                  WebkitTextStroke: `2px ${lastExecuted.color}`,
                  textShadow: `0 0 40px ${lastExecuted.color}66`,
                }}
              >
                {lastExecuted.label}
              </h2>
            </motion.div>
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
}
