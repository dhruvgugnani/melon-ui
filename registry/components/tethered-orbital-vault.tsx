"use client";

import React, { useState, useRef, useEffect } from "react";
import { motion, AnimatePresence, useAnimation, PanInfo } from "framer-motion";

export interface TetheredOrbitalVaultProps extends React.ComponentPropsWithoutRef<"div"> {
  title?: string;
  lockedSubtitle?: string;
  unlockedSubtitle?: string;
  primaryColor?: string;
  accentColor?: string;
  glowColor?: string;
  bgColor?: string;
}

export function TetheredOrbitalVault({
  title = "ORBITAL VAULT",
  lockedSubtitle = "ALIGN KEYS TO CORE",
  unlockedSubtitle = "VAULT SECURED. FULL ACCESS.",
  primaryColor = "#ff5c71",
  accentColor = "#7fff5e",
  glowColor = "#00f0ff",
  bgColor = "#050505",
  className = "",
  style,
  ...props
}: TetheredOrbitalVaultProps) {
  const containerRef = useRef<HTMLDivElement>(null);
  const coreRef = useRef<HTMLDivElement>(null);

  // States
  const [mounted, setMounted] = useState(false);
  const [unlocked, setUnlocked] = useState(false);
  const [lockedKeys, setLockedKeys] = useState<string[]>([]);

  // Constants
  const CORE_RADIUS = 50;
  const KEY_RADIUS = 30;

  useEffect(() => {
    setTimeout(() => setMounted(true), 0);
  }, []);

  // Check if all keys are locked
  useEffect(() => {
    if (lockedKeys.length === 3) {
      setTimeout(() => setUnlocked(true), 500);
    }
  }, [lockedKeys]);

  // Keys configuration
  const keysConfig = [
    { id: "key-1", label: "ALPHA", color: primaryColor, angle: -90 },
    { id: "key-2", label: "BETA", color: accentColor, angle: 150 },
    { id: "key-3", label: "GAMMA", color: glowColor, angle: 30 },
  ];

  const handleDragStart = () => {
    // Optional: Visual feedback during drag
  };

  const handleDragEnd = (event: MouseEvent | TouchEvent | PointerEvent, info: PanInfo, id: string, controls: ReturnType<typeof useAnimation>) => {
    if (!coreRef.current || !containerRef.current) {
      controls.start({ x: 0, y: 0, transition: { type: "spring", stiffness: 300, damping: 20 } });
      return;
    }

    const coreRect = coreRef.current.getBoundingClientRect();

    // Core center relative to viewport
    const coreCenterX = coreRect.left + coreRect.width / 2;
    const coreCenterY = coreRect.top + coreRect.height / 2;

    const dropX = info.point.x;
    const dropY = info.point.y;

    // Distance to core
    const dist = Math.sqrt(Math.pow(dropX - coreCenterX, 2) + Math.pow(dropY - coreCenterY, 2));

    // Snap threshold
    if (dist < CORE_RADIUS + KEY_RADIUS) {
      if (!lockedKeys.includes(id)) {
        setLockedKeys((prev) => [...prev, id]);
      }
    } else {
      controls.start({ x: 0, y: 0, transition: { type: "spring", stiffness: 300, damping: 20 } });
    }
  };

  const resetVault = () => {
    setUnlocked(false);
    setLockedKeys([]);
  };

  if (!mounted) return <div className={`w-full h-[600px] ${className}`} style={{ backgroundColor: bgColor, ...style }} />;

  return (
    <div
      ref={containerRef}
      className={`relative w-full h-[600px] rounded-3xl overflow-hidden flex flex-col items-center justify-center font-['Outfit',sans-serif] ${className}`}
      style={{
        backgroundColor: bgColor,
        backgroundImage: "radial-gradient(circle at 50% 50%, rgba(255,255,255,0.05) 0%, transparent 80%)",
        ...style
      }}
      {...props}
    >
      {/* Background Noise */}
      <div
        className="absolute inset-0 pointer-events-none opacity-[0.03] z-0 mix-blend-overlay"
        style={{ backgroundImage: "url('data:image/svg+xml,%3Csvg viewBox=%220 0 200 200%22 xmlns=%22http://www.w3.org/2000/svg%22%3E%3Cfilter id=%22noise%22%3E%3CfeTurbulence type=%22fractalNoise%22 baseFrequency=%220.8%22 numOctaves=%223%22 stitchTiles=%22stitch%22/%3E%3C/filter%3E%3Crect width=%22100%25%22 height=%22100%25%22 filter=%22url(%23noise)%22/%3E%3C/svg%3E')" }}
      />

      <AnimatePresence mode="wait">
        {!unlocked ? (
          <motion.div
            key="vault-locked"
            initial={{ opacity: 0, scale: 0.9 }}
            animate={{ opacity: 1, scale: 1 }}
            exit={{ opacity: 0, scale: 1.1, filter: "blur(10px)" }}
            transition={{ duration: 0.5, ease: "easeInOut" }}
            className="absolute inset-0 flex items-center justify-center z-10"
          >
            {/* Header Text */}
            <div className="absolute top-10 flex flex-col items-center text-center pointer-events-none">
              <h2 className="text-white/80 text-xl tracking-[0.3em] font-bold uppercase" style={{ textShadow: `0 0 20px ${primaryColor}50` }}>
                {title}
              </h2>
              <div className="flex items-center gap-2 mt-2">
                <div className="w-1.5 h-1.5 rounded-full bg-white/50 animate-pulse" />
                <span className="text-[10px] tracking-widest text-white/50">{lockedSubtitle}</span>
              </div>
            </div>

            {/* Central Core Lock */}
            <div
              ref={coreRef}
              className="relative flex items-center justify-center"
              style={{ width: CORE_RADIUS * 2, height: CORE_RADIUS * 2 }}
            >
              {/* Outer Ring */}
              <motion.div
                className="absolute inset-[-40px] rounded-full border border-white/10"
                animate={{ rotate: 360 }}
                transition={{ duration: 20, repeat: Infinity, ease: "linear" }}
                style={{ borderStyle: "dashed" }}
              />
              <motion.div
                className="absolute inset-[-60px] rounded-full border border-white/5"
                animate={{ rotate: -360 }}
                transition={{ duration: 30, repeat: Infinity, ease: "linear" }}
              />

              {/* Core Body */}
              <motion.div
                className="absolute inset-0 rounded-full bg-black/80 backdrop-blur-md border flex items-center justify-center z-10"
                style={{
                  borderColor: lockedKeys.length === 3 ? accentColor : "rgba(255,255,255,0.2)",
                  boxShadow: `0 0 40px ${lockedKeys.length > 0 ? lockedKeys.length === 3 ? accentColor : primaryColor : 'transparent'}20 inset`
                }}
                animate={{ scale: lockedKeys.length === 3 ? [1, 1.1, 1] : 1 }}
                transition={{ duration: 0.5 }}
              >
                <div className="w-1/2 h-1/2 rounded-full opacity-20 blur-md" style={{ backgroundColor: primaryColor }} />
                <div className="absolute inset-0 flex items-center justify-center">
                  <span className="text-white/40 text-xs font-mono">{lockedKeys.length}/3</span>
                </div>
              </motion.div>
            </div>

            {/* Orbiting Keys */}
            {keysConfig.map((key) => {
              return (
                <DraggableKey
                  key={key.id}
                  id={key.id}
                  label={key.label}
                  color={key.color}
                  angle={key.angle}
                  orbitRadius={160}
                  isLocked={lockedKeys.includes(key.id)}
                  onDragStart={handleDragStart}
                  onDragEnd={handleDragEnd}
                  containerRef={containerRef}
                />
              );
            })}
          </motion.div>
        ) : (
          <motion.div
            key="vault-unlocked"
            initial={{ opacity: 0, scale: 0.9, y: 20 }}
            animate={{ opacity: 1, scale: 1, y: 0 }}
            exit={{ opacity: 0, scale: 0.9 }}
            transition={{ duration: 0.7, type: "spring", bounce: 0.4 }}
            className="w-full h-full p-8 flex flex-col z-20"
          >
            {/* Dashboard Header */}
            <div className="flex items-center justify-between mb-8 relative z-20">
              <div>
                <h2 className="text-white text-3xl font-black tracking-tighter uppercase flex items-center gap-3" style={{ fontFamily: "var(--font-londrina-solid)" }}>
                  <span style={{ color: accentColor }}>{"//"}</span> {title}
                </h2>
                <p className="text-white/50 text-xs font-mono tracking-widest mt-2">{unlockedSubtitle}</p>
              </div>
              <button
                onClick={resetVault}
                className="px-4 py-2 rounded-lg bg-white/5 border border-white/10 hover:bg-white/10 text-white/70 hover:text-white text-[10px] tracking-widest transition-all uppercase flex items-center gap-2 backdrop-blur-md"
              >
                <svg width="12" height="12" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                  <path d="M21 12a9 9 0 1 1-9-9c2.52 0 4.93 1 6.74 2.74L21 8"/>
                  <path d="M21 3v5h-5"/>
                </svg>
                RE-LOCK
              </button>
            </div>

            {/* Dashboard Bento Grid */}
            <div className="flex-1 grid grid-cols-3 grid-rows-2 gap-4 relative z-20">
              <motion.div
                initial={{ opacity: 0, x: -20 }}
                animate={{ opacity: 1, x: 0 }}
                transition={{ delay: 0.2 }}
                className="col-span-2 row-span-2 rounded-2xl bg-white/[0.02] border border-white/10 p-6 flex flex-col overflow-hidden relative group backdrop-blur-md"
              >
                <div className="absolute top-0 left-0 w-full h-1" style={{ background: `linear-gradient(90deg, ${primaryColor}, ${accentColor})` }} />
                <div className="absolute -bottom-20 -right-20 w-64 h-64 rounded-full blur-[80px] opacity-20 group-hover:opacity-40 transition-opacity" style={{ backgroundColor: glowColor }} />
                <h3 className="text-white/40 text-xs tracking-widest uppercase font-mono mb-6">Encrypted Logs</h3>
                <div className="flex-1 flex flex-col gap-3 font-mono text-[10px] text-white/60">
                  <div className="flex justify-between items-center border-b border-white/5 pb-2">
                    <span className="text-white/30">14:02:41</span>
                    <span style={{ color: primaryColor }}>AUTH_BYPASS_INITIATED</span>
                  </div>
                  <div className="flex justify-between items-center border-b border-white/5 pb-2">
                    <span className="text-white/30">14:02:42</span>
                    <span style={{ color: accentColor }}>KEYS_ALIGNED_SUCCESS</span>
                  </div>
                  <div className="flex justify-between items-center border-b border-white/5 pb-2">
                    <span className="text-white/30">14:02:44</span>
                    <span style={{ color: glowColor }}>VAULT_DECRYPTED</span>
                  </div>
                  <div className="flex justify-between items-center border-b border-white/5 pb-2">
                    <span className="text-white/30">14:02:45</span>
                    <span className="text-white">DATA_STREAM_ESTABLISHED</span>
                  </div>
                </div>
              </motion.div>

              <motion.div
                initial={{ opacity: 0, y: -20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: 0.3 }}
                className="rounded-2xl bg-white/[0.02] border border-white/10 p-5 flex flex-col justify-between backdrop-blur-md"
              >
                <h3 className="text-white/40 text-xs tracking-widest uppercase font-mono">Integrity</h3>
                <div>
                  <div className="text-3xl font-light text-white">100%</div>
                  <div className="text-[10px] tracking-wider text-white/40 mt-1 uppercase">Systems Nominal</div>
                </div>
              </motion.div>

              <motion.div
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: 0.4 }}
                className="rounded-2xl bg-white/[0.02] border border-white/10 p-5 flex flex-col justify-between relative overflow-hidden backdrop-blur-md"
              >
                <div className="absolute inset-0 opacity-10" style={{
                  backgroundImage: `repeating-linear-gradient(-45deg, transparent, transparent 5px, ${accentColor} 5px, ${accentColor} 10px)`
                }} />
                <h3 className="text-white/40 text-xs tracking-widest uppercase font-mono relative z-10">Status</h3>
                <div className="relative z-10">
                  <div className="text-xl font-bold" style={{ color: accentColor }}>UNLOCKED</div>
                  <div className="text-[10px] tracking-wider text-white/40 mt-1 uppercase">Root Access</div>
                </div>
              </motion.div>
            </div>
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
}

// Sub-component for individual draggable keys
function DraggableKey({
  id,
  label,
  color,
  angle,
  orbitRadius,
  isLocked,
  onDragStart,
  onDragEnd,
  containerRef
}: {
  id: string;
  label: string;
  color: string;
  angle: number;
  orbitRadius: number;
  isLocked: boolean;
  onDragStart: () => void;
  onDragEnd: (event: MouseEvent | TouchEvent | PointerEvent, info: PanInfo, id: string, controls: ReturnType<typeof useAnimation>) => void;
  containerRef: React.RefObject<HTMLDivElement | null>;
}) {
  const controls = useAnimation();
  const rad = (angle * Math.PI) / 180;
  const startX = Math.cos(rad) * orbitRadius;
  const startY = Math.sin(rad) * orbitRadius;

  useEffect(() => {
    if (isLocked) {
      controls.start({
        x: 0,
        y: 0,
        scale: 0.5,
        opacity: 0,
        transition: { type: "spring", stiffness: 200, damping: 20 }
      });
    } else {
      controls.start({ x: startX, y: startY, scale: 1, opacity: 1, transition: { duration: 0 } });
    }
  }, [isLocked, startX, startY, controls]);

  return (
    <motion.div
      className="absolute z-20"
      initial={{ x: startX, y: startY }}
      animate={controls}
    >
      <motion.div
        drag={!isLocked}
        dragConstraints={containerRef}
        dragElastic={0.2}
        onDragStart={onDragStart}
        onDragEnd={(e, info) => onDragEnd(e, info, id, controls)}
        whileHover={!isLocked ? { scale: 1.1 } : {}}
        whileDrag={{ scale: 1.2, cursor: "grabbing" }}
        className={`w-14 h-14 rounded-full flex items-center justify-center cursor-grab relative group ${isLocked ? 'pointer-events-none' : ''}`}
        style={{
          background: `radial-gradient(circle at center, ${color}30 0%, rgba(0,0,0,0.8) 100%)`,
          border: `1px solid ${color}80`,
          boxShadow: `0 0 15px ${color}30`
        }}
      >
        <div className="absolute inset-0 rounded-full opacity-0 group-hover:opacity-100 transition-opacity duration-300"
             style={{ boxShadow: `inset 0 0 10px ${color}` }} />

        <div className="w-2 h-2 rounded-full" style={{ backgroundColor: color, boxShadow: `0 0 10px ${color}` }} />

        <span className="absolute -bottom-6 text-[8px] font-mono tracking-widest text-white/50 uppercase whitespace-nowrap">
          {label}
        </span>
      </motion.div>
    </motion.div>
  );
}
