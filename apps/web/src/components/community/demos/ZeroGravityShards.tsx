"use client";

import React, { useState, useEffect, useRef } from "react";
import { motion, AnimatePresence, useMotionValue, useSpring, useTransform, HTMLMotionProps, MotionValue } from "framer-motion";

export interface ShardData {
  id: string;
  title: string;
  subtitle: string;
  icon: React.ReactNode;
  content: React.ReactNode;
  color: string;
  initialX: number;
  initialY: number;
  rotation: number;
}

export interface ZeroGravityShardsProps extends Omit<HTMLMotionProps<"div">, "children"> {
  shards?: ShardData[];
  coreLabel?: string;
  coreSublabel?: string;
  glowColor?: string;
}

const DEFAULT_SHARDS: ShardData[] = [
  {
    id: "shard-1",
    title: "Neural Core",
    subtitle: "Active",
    color: "#7fff5e",
    initialX: -150,
    initialY: -120,
    rotation: -10,
    icon: (
      <svg width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round">
        <path d="M18 20a6 6 0 0 0-12 0" />
        <circle cx="12" cy="10" r="4" />
        <circle cx="12" cy="12" r="10" />
      </svg>
    ),
    content: (
      <div className="flex flex-col gap-4 text-white w-full h-full">
        <div className="flex justify-between items-center pb-4 border-b border-white/10">
          <div>
            <h4 className="text-xl font-bold font-['Outfit']">System Status</h4>
            <p className="text-sm text-white/50">All nodes operational</p>
          </div>
          <div className="w-10 h-10 rounded-full bg-[#7fff5e]/20 flex items-center justify-center text-[#7fff5e]">
            <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2"><path d="M22 11.08V12a10 10 0 1 1-5.93-9.14"/><polyline points="22 4 12 14.01 9 11.01"/></svg>
          </div>
        </div>
        <div className="grid grid-cols-2 gap-4 mt-4">
          <div className="p-4 rounded-xl bg-white/5 border border-white/5">
            <p className="text-xs text-white/40 mb-1">LATENCY</p>
            <p className="text-2xl font-mono text-[#7fff5e]">12ms</p>
          </div>
          <div className="p-4 rounded-xl bg-white/5 border border-white/5">
            <p className="text-xs text-white/40 mb-1">THROUGHPUT</p>
            <p className="text-2xl font-mono text-white">4.2k/s</p>
          </div>
        </div>
      </div>
    )
  },
  {
    id: "shard-2",
    title: "Quantum Link",
    subtitle: "Encrypted",
    color: "#ff5c71",
    initialX: 180,
    initialY: -80,
    rotation: 15,
    icon: (
      <svg width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round">
        <rect x="3" y="11" width="18" height="11" rx="2" ry="2"></rect>
        <path d="M7 11V7a5 5 0 0 1 10 0v4"></path>
      </svg>
    ),
    content: (
      <div className="flex flex-col h-full w-full justify-between">
        <h4 className="text-xl font-bold text-white mb-4">Security Overview</h4>
        <div className="flex-1 rounded-xl bg-black/40 border border-white/10 p-4 relative overflow-hidden">
          <div className="absolute inset-0 bg-[url('data:image/svg+xml;base64,PHN2ZyB4bWxucz0iaHR0cDovL3d3dy53My5vcmcvMjAwMC9zdmciIHdpZHRoPSI4IiBoZWlnaHQ9IjgiPjxyZWN0IHdpZHRoPSI4IiBoZWlnaHQ9IjgiIGZpbGw9IiNmZmZmZmYiIGZpbGwtb3BhY2l0eT0iMC4wNSIvPjwvc3ZnPg==')] opacity-20"></div>
          <div className="relative z-10 flex flex-col gap-2 font-mono text-sm">
            <div className="flex justify-between text-white/70"><span>Protocol</span><span className="text-[#ff5c71]">AES-256</span></div>
            <div className="flex justify-between text-white/70"><span>Handshake</span><span className="text-white">Success</span></div>
            <div className="flex justify-between text-white/70"><span>Entropy</span><span className="text-[#7fff5e]">High</span></div>
          </div>
        </div>
      </div>
    )
  },
  {
    id: "shard-3",
    title: "Void Cache",
    subtitle: "Synchronizing",
    color: "#00f0ff",
    initialX: -120,
    initialY: 160,
    rotation: -25,
    icon: (
      <svg width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round">
        <ellipse cx="12" cy="5" rx="9" ry="3"></ellipse>
        <path d="M21 12c0 1.66-4 3-9 3s-9-1.34-9-3"></path>
        <path d="M3 5v14c0 1.66 4 3 9 3s9-1.34 9-3V5"></path>
      </svg>
    ),
    content: (
      <div className="flex flex-col items-center justify-center h-full text-center">
        <div className="w-16 h-16 rounded-full border-4 border-[#00f0ff]/30 border-t-[#00f0ff] animate-spin mb-6"></div>
        <h3 className="text-2xl font-bold text-white mb-2">Syncing Data</h3>
        <p className="text-white/50 text-sm">Transferring assets across nodes</p>
      </div>
    )
  },
  {
    id: "shard-4",
    title: "Omni-Grid",
    subtitle: "Expanded",
    color: "#e8d5b7",
    initialX: 160,
    initialY: 140,
    rotation: 12,
    icon: (
      <svg width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round">
        <rect x="3" y="3" width="7" height="7"></rect>
        <rect x="14" y="3" width="7" height="7"></rect>
        <rect x="14" y="14" width="7" height="7"></rect>
        <rect x="3" y="14" width="7" height="7"></rect>
      </svg>
    ),
    content: (
      <div className="grid grid-cols-3 grid-rows-3 gap-2 h-full w-full">
        {[...Array(9)].map((_, i) => (
          <div key={i} className="bg-white/5 rounded-lg border border-white/5 flex items-center justify-center hover:bg-white/10 transition-colors">
            <div className="w-2 h-2 rounded-full bg-[#e8d5b7]/50" />
          </div>
        ))}
      </div>
    )
  }
];


const ShardNode: React.FC<{
  shard: ShardData;
  i: number;
  activeShard: string | null;
  setActiveShard: (id: string | null) => void;
  isCoreActive: boolean;
  smoothMouseX: MotionValue<number>;
  smoothMouseY: MotionValue<number>;
}> = ({
  shard,
  i,
  activeShard,
  setActiveShard,
  isCoreActive,
  smoothMouseX,
  smoothMouseY
}) => {
  const parallaxX = useTransform(smoothMouseX, (val) => (val as number) * (shard.initialX / 500));
  const parallaxY = useTransform(smoothMouseY, (val) => (val as number) * (shard.initialY / 500));

  const floatY = {
    y: [0, -10, 0],
    transition: {
      duration: 4 + i,
      repeat: Infinity,
      ease: "easeInOut",
      delay: i * 0.5
    }
  };

  const isActive = activeShard === shard.id;
  const isDimmed = activeShard !== null && !isActive;

  return (
    <React.Fragment>
      <AnimatePresence>
        {!isActive && isCoreActive && (
          <motion.div
            layoutId={`shard-container-${shard.id}`}
            className="absolute left-1/2 top-1/2 z-20 cursor-pointer"
            style={{
              x: `calc(-50% + ${shard.initialX}px)`,
              y: `calc(-50% + ${shard.initialY}px)`,
              translateX: parallaxX,
              translateY: parallaxY,
            }}
            initial={{ opacity: 0, scale: 0, rotate: 0 }}
            animate={{
              opacity: isDimmed ? 0 : 1,
              scale: isDimmed ? 0.8 : 1,
              rotate: shard.rotation,
              /* eslint-disable-next-line @typescript-eslint/no-explicit-any */
              ...(floatY as any)
            }}
            exit={{ opacity: 0, scale: 0.5, transition: { duration: 0.2 } }}
            onClick={() => setActiveShard(shard.id)}
            whileHover={{ scale: 1.1, rotate: 0, zIndex: 30 }}
          >
            <motion.div
              layoutId={`shard-bg-${shard.id}`}
              className="w-48 p-4 rounded-2xl bg-black/60 backdrop-blur-xl border border-white/10 shadow-2xl relative overflow-hidden group"
            >
              {/* Inner highlight */}
              <div className="absolute inset-0 bg-gradient-to-br from-white/5 to-transparent opacity-0 group-hover:opacity-100 transition-opacity" />

              {/* Color glow hint */}
              <div className="absolute -top-10 -right-10 w-20 h-20 rounded-full blur-2xl opacity-30" style={{ backgroundColor: shard.color }} />

              <div className="flex items-center gap-3 relative z-10">
                <motion.div
                  layoutId={`shard-icon-${shard.id}`}
                  className="w-10 h-10 rounded-xl bg-white/5 border border-white/10 flex items-center justify-center"
                  style={{ color: shard.color }}
                >
                  {shard.icon}
                </motion.div>
                <div>
                  <motion.h4 layoutId={`shard-title-${shard.id}`} className="text-sm font-bold text-white font-['Outfit']">{shard.title}</motion.h4>
                  <motion.p layoutId={`shard-subtitle-${shard.id}`} className="text-[10px] text-white/50 uppercase tracking-wider">{shard.subtitle}</motion.p>
                </div>
              </div>
            </motion.div>
          </motion.div>
        )}
      </AnimatePresence>
    </React.Fragment>
  );
};

export function ZeroGravityShards({
  shards = DEFAULT_SHARDS,
  coreLabel = "Initialize",
  coreSublabel = "Core Offline",
  glowColor = "#7fff5e",
  className = "",
  ...props
}: ZeroGravityShardsProps) {
  const [activeShard, setActiveShard] = useState<string | null>(null);
  const [isCoreActive, setIsCoreActive] = useState(false);

  // Mouse position tracking
  const mouseX = useMotionValue(0);
  const mouseY = useMotionValue(0);

  // Smooth mouse coordinates for parallax
  const smoothMouseX = useSpring(mouseX, { stiffness: 50, damping: 20 });
  const smoothMouseY = useSpring(mouseY, { stiffness: 50, damping: 20 });

  const containerRef = useRef<HTMLDivElement>(null);

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

  // Close active shard on escape key
  useEffect(() => {
    const handleKeyDown = (e: KeyboardEvent) => {
      if (e.key === "Escape" && activeShard) {
        setActiveShard(null);
      }
    };
    window.addEventListener("keydown", handleKeyDown);
    return () => window.removeEventListener("keydown", handleKeyDown);
  }, [activeShard]);

  return (
    <motion.div
      ref={containerRef}
      className={`relative w-full h-[600px] bg-[#050505] overflow-hidden rounded-2xl flex items-center justify-center ${className}`}
      onMouseMove={handleMouseMove}
      onMouseLeave={handleMouseLeave}
      {...props}
    >
      {/* Background Grid */}
      <div
        className="absolute inset-0 pointer-events-none opacity-20"
        style={{
          backgroundImage: `
            linear-gradient(to right, rgba(255,255,255,0.05) 1px, transparent 1px),
            linear-gradient(to bottom, rgba(255,255,255,0.05) 1px, transparent 1px)
          `,
          backgroundSize: '40px 40px'
        }}
      />

      {/* Ambient noise */}
      <div
        className="absolute inset-0 opacity-[0.03] mix-blend-overlay pointer-events-none"
        style={{
          backgroundImage: "url('data:image/svg+xml,%3Csvg viewBox=%220 0 200 200%22 xmlns=%22http://www.w3.org/2000/svg%22%3E%3Cfilter id=%22noiseFilter%22%3E%3CfeTurbulence type=%22fractalNoise%22 baseFrequency=%220.85%22 numOctaves=%223%22 stitchTiles=%22stitch%22/%3E%3C/filter%3E%3Crect width=%22100%25%22 height=%22100%25%22 filter=%22url(%23noiseFilter)%22/%3E%3C/svg%3E')"
        }}
      />

      {/* Center Core */}
      <motion.button
        className="relative z-10 w-32 h-32 rounded-full flex flex-col items-center justify-center border border-white/10 bg-black/50 backdrop-blur-md group"
        onClick={() => setIsCoreActive(!isCoreActive)}
        whileHover={{ scale: 1.05 }}
        whileTap={{ scale: 0.95 }}
      >
        <motion.div
          className="absolute inset-0 rounded-full blur-xl opacity-20 transition-opacity duration-500 group-hover:opacity-40"
          style={{ backgroundColor: isCoreActive ? glowColor : "#ffffff" }}
          animate={{
            scale: isCoreActive ? [1, 1.2, 1] : 1,
            opacity: isCoreActive ? [0.4, 0.8, 0.4] : 0.2
          }}
          transition={{ duration: 2, repeat: Infinity, ease: "easeInOut" }}
        />
        <div className="absolute inset-0 rounded-full border border-white/5 flex items-center justify-center">
          <svg className="w-full h-full opacity-30 animate-[spin_10s_linear_infinite]" viewBox="0 0 100 100">
            <circle cx="50" cy="50" r="48" fill="none" stroke="currentColor" strokeWidth="0.5" strokeDasharray="4 4" />
          </svg>
        </div>
        <span className="relative z-10 font-mono text-sm text-white uppercase tracking-widest group-hover:text-[#7fff5e] transition-colors">{coreLabel}</span>
        <span className="relative z-10 text-[10px] text-white/40 mt-1 uppercase tracking-wider">{isCoreActive ? "System Online" : coreSublabel}</span>
      </motion.button>

      {/* Floating Shards */}
      {shards.map((shard, i) => (
        <ShardNode
          key={shard.id}
          shard={shard}
          i={i}
          activeShard={activeShard}
          setActiveShard={setActiveShard}
          isCoreActive={isCoreActive}
          smoothMouseX={smoothMouseX}
          smoothMouseY={smoothMouseY}
        />
      ))}

      {/* Expanded Shard View */}
      <AnimatePresence>
        {activeShard && (
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            className="absolute inset-0 z-40 flex items-center justify-center p-6 bg-black/60 backdrop-blur-sm"
            onClick={() => setActiveShard(null)}
          >
            {shards.map((shard) => (
              shard.id === activeShard && (
                <motion.div
                  key={`expanded-${shard.id}`}
                  layoutId={`shard-container-${shard.id}`}
                  className="w-full max-w-2xl h-[400px] rounded-3xl bg-[#0a0a0a] border border-white/10 shadow-2xl overflow-hidden flex flex-col relative"
                  onClick={(e) => e.stopPropagation()}
                >
                  {/* Expanded ambient glow */}
                  <div className="absolute top-0 left-1/2 -translate-x-1/2 w-[150%] h-32 blur-3xl opacity-20 pointer-events-none" style={{ backgroundColor: shard.color }} />

                  {/* Header */}
                  <motion.div layoutId={`shard-bg-${shard.id}`} className="flex items-center justify-between p-6 border-b border-white/10 bg-white/5 relative z-10">
                    <div className="flex items-center gap-4">
                      <motion.div
                        layoutId={`shard-icon-${shard.id}`}
                        className="w-12 h-12 rounded-xl bg-black/50 border border-white/10 flex items-center justify-center shadow-inner"
                        style={{ color: shard.color }}
                      >
                        {shard.icon}
                      </motion.div>
                      <div>
                        <motion.h4 layoutId={`shard-title-${shard.id}`} className="text-2xl font-bold text-white font-['Outfit']">{shard.title}</motion.h4>
                        <motion.p layoutId={`shard-subtitle-${shard.id}`} className="text-sm text-white/50 uppercase tracking-widest">{shard.subtitle}</motion.p>
                      </div>
                    </div>
                    <button
                      onClick={() => setActiveShard(null)}
                      className="w-10 h-10 rounded-full bg-white/5 border border-white/10 flex items-center justify-center text-white/50 hover:text-white hover:bg-white/10 transition-all"
                    >
                      <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><line x1="18" y1="6" x2="6" y2="18"></line><line x1="6" y1="6" x2="18" y2="18"></line></svg>
                    </button>
                  </motion.div>

                  {/* Content Area */}
                  <div className="flex-1 p-8 relative z-10 overflow-y-auto">
                    <motion.div
                      initial={{ opacity: 0, y: 20 }}
                      animate={{ opacity: 1, y: 0 }}
                      transition={{ delay: 0.2 }}
                      className="h-full"
                    >
                      {shard.content}
                    </motion.div>
                  </div>
                </motion.div>
              )
            ))}
          </motion.div>
        )}
      </AnimatePresence>
    </motion.div>
  );
}
