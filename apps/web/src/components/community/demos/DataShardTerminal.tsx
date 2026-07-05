"use client";

import React, { useState, useRef } from "react";
import { motion, AnimatePresence, useAnimation, PanInfo } from "framer-motion";

export interface DataShardTerminalProps extends React.ComponentPropsWithoutRef<"div"> {
  title?: string;
  lockedSubtitle?: string;
  unlockedSubtitle?: string;
  primaryColor?: string;
  accentColor?: string;
  bgColor?: string;
}

export function DataShardTerminal({
  title = "DATA CONTAINER",
  lockedSubtitle = "AWAITING ACCESS KEY CARD",
  unlockedSubtitle = "CONTAINER SUCCESSFULLY MOUNTED",
  primaryColor = "#7fff5e",
  accentColor = "#ff5c71",
  bgColor = "#050505",
  className = "",
  style,
  ...props
}: DataShardTerminalProps) {
  const [isUnlocked, setIsUnlocked] = useState(false);
  const [isDragging, setIsDragging] = useState(false);
  const containerRef = useRef<HTMLDivElement>(null);
  const slotRef = useRef<HTMLDivElement>(null);
  const shardControls = useAnimation();

  // Reset to locked state after some time in demo (optional) or provide a reset button.
  // We will provide an "Eject" button inside the unlocked dashboard.

  const handleDragStart = () => {
    setIsDragging(true);
  };

  const handleDragEnd = (event: MouseEvent | TouchEvent | PointerEvent, info: PanInfo) => {
    setIsDragging(false);

    if (!slotRef.current || !containerRef.current) {
      shardControls.start({ x: 0, y: 0 });
      return;
    }

    const slotRect = slotRef.current.getBoundingClientRect();

    // The shard is roughly 120x60, check if drop point is inside the slot area
    const dropX = info.point.x;
    const dropY = info.point.y;

    // Expand the hit area slightly for easier interaction
    const hitArea = {
      left: slotRect.left - 40,
      right: slotRect.right + 40,
      top: slotRect.top - 40,
      bottom: slotRect.bottom + 40
    };

    if (
      dropX >= hitArea.left &&
      dropX <= hitArea.right &&
      dropY >= hitArea.top &&
      dropY <= hitArea.bottom
    ) {
      // Success! Snap in place then unlock
      setIsUnlocked(true);
    } else {
      // Snap back
      shardControls.start({ x: 0, y: 0, transition: { type: "spring", stiffness: 300, damping: 20 } });
    }
  };

  const handleEject = () => {
    setIsUnlocked(false);
    // Reset shard position after layout change
    setTimeout(() => {
      shardControls.start({ x: 0, y: 0, transition: { duration: 0 } });
    }, 100);
  };

  return (
    <div
      ref={containerRef}
      className={`relative w-full h-[500px] rounded-2xl overflow-hidden flex flex-col items-center justify-center font-['Outfit',sans-serif] ${className}`}
      style={{
        backgroundColor: bgColor,
        backgroundImage: "radial-gradient(circle at 50% 50%, rgba(255,255,255,0.03) 0%, transparent 100%)",
        ...style
      }}
      {...props}
    >
      {/* Subtle Noise Overlay */}
      <div
        className="absolute inset-0 pointer-events-none opacity-[0.03] z-0"
        style={{ backgroundImage: "url('data:image/svg+xml,%3Csvg viewBox=%220 0 200 200%22 xmlns=%22http://www.w3.org/2000/svg%22%3E%3Cfilter id=%22noiseFilter%22%3E%3CfeTurbulence type=%22fractalNoise%22 baseFrequency=%220.65%22 numOctaves=%223%22 stitchTiles=%22stitch%22/%3E%3C/filter%3E%3Crect width=%22100%25%22 height=%22100%25%22 filter=%22url(%23noiseFilter)%22/%3E%3C/svg%3E')" }}
      />

      {/* Main Terminal Area */}
      <div className="relative z-10 w-full max-w-2xl h-full flex items-center justify-center p-6">
        <AnimatePresence mode="wait">
          {!isUnlocked ? (
            <motion.div
              key="locked"
              initial={{ opacity: 0, scale: 0.95 }}
              animate={{ opacity: 1, scale: 1 }}
              exit={{ opacity: 0, scale: 1.05, filter: "blur(10px)" }}
              transition={{ duration: 0.4, ease: "easeInOut" }}
              className="flex flex-col items-center gap-12 w-full"
            >
              {/* Terminal Frame */}
              <div className="relative border border-white/10 rounded-xl bg-black/40 backdrop-blur-md p-8 w-full max-w-md shadow-2xl flex flex-col items-center">
                <div className="absolute -top-px left-1/2 -translate-x-1/2 w-1/3 h-px" style={{ background: `linear-gradient(90deg, transparent, ${accentColor}, transparent)` }} />

                <h2 className="text-white/80 text-xl tracking-[0.2em] font-bold mb-2">
                  {title}
                </h2>
                <div className="flex items-center gap-2 mb-8">
                  <div className="w-2 h-2 rounded-full animate-pulse" style={{ backgroundColor: accentColor }} />
                  <span className="text-xs tracking-widest text-white/50">{lockedSubtitle}</span>
                </div>

                {/* The Slot */}
                <div
                  ref={slotRef}
                  className="w-[140px] h-[70px] rounded-lg border-2 border-dashed flex items-center justify-center relative overflow-hidden transition-colors duration-300"
                  style={{
                    borderColor: isDragging ? primaryColor : "rgba(255,255,255,0.2)",
                    backgroundColor: isDragging ? `${primaryColor}10` : "rgba(0,0,0,0.5)"
                  }}
                >
                  <motion.div
                    className="absolute inset-0 opacity-20"
                    animate={{
                      backgroundPosition: ["0% 0%", "100% 100%"],
                    }}
                    transition={{ duration: 3, repeat: Infinity, ease: "linear" }}
                    style={{
                      backgroundImage: `repeating-linear-gradient(45deg, transparent, transparent 10px, ${primaryColor} 10px, ${primaryColor} 20px)`,
                      backgroundSize: "200% 200%",
                      display: isDragging ? "block" : "none"
                    }}
                  />
                  <span className="text-white/30 text-[10px] tracking-widest uppercase z-10">Drop Key Card</span>
                </div>
              </div>

              {/* The Draggable Shard */}
              <motion.div
                drag
                dragConstraints={containerRef}
                dragElastic={0.1}
                onDragStart={handleDragStart}
                onDragEnd={handleDragEnd}
                animate={shardControls}
                whileHover={{ scale: 1.05 }}
                whileDrag={{ scale: 1.1, cursor: "grabbing" }}
                className="w-[120px] h-[60px] rounded-md cursor-grab flex items-center justify-center relative shadow-lg z-50 group"
                style={{
                  background: `linear-gradient(135deg, ${primaryColor}30, ${primaryColor}10)`,
                  border: `1px solid ${primaryColor}80`,
                  boxShadow: `0 0 20px ${primaryColor}40`
                }}
              >
                {/* Glowing edge */}
                <div className="absolute inset-0 rounded-md opacity-0 group-hover:opacity-100 transition-opacity duration-300"
                     style={{ boxShadow: `inset 0 0 15px ${primaryColor}` }} />

                {/* Circuit lines decorative */}
                <div className="absolute top-2 left-2 w-4 h-px bg-white/50" />
                <div className="absolute top-2 left-2 w-px h-4 bg-white/50" />
                <div className="absolute bottom-2 right-2 w-4 h-px bg-white/50" />
                <div className="absolute bottom-2 right-2 w-px h-4 bg-white/50" />

                <span className="text-white font-bold tracking-widest text-[10px] sm:text-xs" style={{ textShadow: `0 0 10px ${primaryColor}` }}>
                  KEY CARD
                </span>
              </motion.div>
            </motion.div>
          ) : (
            <motion.div
              key="unlocked"
              initial={{ opacity: 0, scale: 0.9, y: 20 }}
              animate={{ opacity: 1, scale: 1, y: 0 }}
              exit={{ opacity: 0, scale: 0.95 }}
              transition={{ duration: 0.6, type: "spring", bounce: 0.4 }}
              className="w-full h-full flex flex-col"
            >
              {/* Dashboard Header */}
              <div className="flex items-center justify-between mb-6">
                <div>
                  <h2 className="text-white text-2xl font-bold tracking-widest flex items-center gap-3">
                    <span style={{ color: primaryColor }}>{"//"}</span> {title}
                  </h2>
                  <p className="text-white/50 text-sm tracking-wider mt-1">{unlockedSubtitle}</p>
                </div>
                <button
                  onClick={handleEject}
                  className="px-4 py-2 rounded-md bg-white/5 border border-white/10 hover:bg-white/10 text-white/70 hover:text-white text-xs tracking-widest transition-all uppercase flex items-center gap-2"
                >
                  <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                    <path d="M5 12h14M12 5l7 7-7 7"/>
                  </svg>
                  Eject
                </button>
              </div>

              {/* Bento Grid Layout */}
              <div className="flex-1 grid grid-cols-1 sm:grid-cols-3 gap-4 auto-rows-min sm:grid-rows-2">
                {/* Main Graph Card */}
                <motion.div
                  initial={{ opacity: 0, x: -20 }}
                  animate={{ opacity: 1, x: 0 }}
                  transition={{ delay: 0.2 }}
                  className="col-span-1 sm:col-span-2 row-span-1 sm:row-span-2 rounded-xl bg-white/[0.02] border border-white/5 p-6 flex flex-col relative overflow-hidden min-h-[180px]"
                >
                  <div className="absolute top-0 right-0 w-32 h-32 blur-3xl opacity-20" style={{ backgroundColor: primaryColor }} />
                  <h3 className="text-white/40 text-xs tracking-widest uppercase mb-4">Network Activity</h3>

                  {/* Fake Graph */}
                  <div className="flex-1 flex items-end gap-2 mt-4 min-h-[60px]">
                    {[40, 70, 45, 90, 65, 85, 30, 55, 75, 100, 60, 80].map((h, i) => (
                      <motion.div
                        key={i}
                        initial={{ height: 0 }}
                        animate={{ height: `${h}%` }}
                        transition={{ delay: 0.3 + (i * 0.05), type: "spring" }}
                        className="flex-1 rounded-t-sm opacity-80 hover:opacity-100 transition-opacity"
                        style={{ backgroundColor: i % 3 === 0 ? accentColor : primaryColor }}
                      />
                    ))}
                  </div>

                  <div className="flex justify-between mt-4 text-white/30 text-[10px] font-mono">
                    <span>00:00</span>
                    <span>LIVE</span>
                  </div>
                </motion.div>

                {/* Stats Card 1 */}
                <motion.div
                  initial={{ opacity: 0, y: -20 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ delay: 0.3 }}
                  className="rounded-xl bg-white/[0.02] border border-white/5 p-4 flex flex-col justify-between min-h-[100px]"
                >
                  <h3 className="text-white/40 text-xs tracking-widest uppercase">Nodes</h3>
                  <div className="text-2xl sm:text-4xl font-light text-white mt-2">1,024</div>
                  <div className="text-[10px] tracking-wider text-white/50 mt-1 flex items-center gap-1">
                    <span style={{ color: primaryColor }}>↑ 12%</span> active
                  </div>
                </motion.div>

                {/* Stats Card 2 */}
                <motion.div
                  initial={{ opacity: 0, y: 20 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ delay: 0.4 }}
                  className="rounded-xl bg-white/[0.02] border border-white/5 p-4 flex flex-col justify-between relative overflow-hidden min-h-[100px]"
                >
                  <div className="absolute inset-0 opacity-10" style={{
                    backgroundImage: `repeating-linear-gradient(-45deg, transparent, transparent 5px, ${primaryColor} 5px, ${primaryColor} 10px)`
                  }} />
                  <h3 className="text-white/40 text-xs tracking-widest uppercase relative z-10">Access Level</h3>
                  <div className="text-xl sm:text-2xl font-bold mt-2 relative z-10" style={{ color: primaryColor }}>ADMIN</div>
                  <div className="text-[10px] tracking-wider text-white/50 mt-1 relative z-10">
                    Session Authenticated
                  </div>
                </motion.div>
              </div>
            </motion.div>
          )}
        </AnimatePresence>
      </div>
    </div>
  );
}
