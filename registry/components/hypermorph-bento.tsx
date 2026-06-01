"use client";

import React, { useState } from "react";
import { motion, AnimatePresence } from "framer-motion";

interface BentoItem {
  id: string;
  title: string;
  subtitle: string;
  color: string;
  icon: React.ReactNode;
  content: string;
}

export interface HyperMorphBentoProps extends React.ComponentPropsWithoutRef<"div"> {
  items?: BentoItem[];
}

const DEFAULT_ITEMS: BentoItem[] = [
  {
    id: "module-alpha",
    title: "Quantum Core",
    subtitle: "PROCESSING NODE",
    color: "#ff5c71",
    icon: (
      <svg width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
        <circle cx="12" cy="12" r="10" />
        <circle cx="12" cy="12" r="4" />
        <line x1="21.17" y1="8" x2="12" y2="8" />
        <line x1="3.95" y1="6.06" x2="8.54" y2="14" />
        <line x1="10.88" y1="21.94" x2="15.46" y2="14" />
      </svg>
    ),
    content: "Initiating multi-threaded quantum sequences. Neural pathways optimized for maximum data throughput. Connection stable."
  },
  {
    id: "module-beta",
    title: "Neon Nexus",
    subtitle: "DATA RELAY",
    color: "#7fff5e",
    icon: (
      <svg width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
        <polygon points="13 2 3 14 12 14 11 22 21 10 12 10 13 2" />
      </svg>
    ),
    content: "Routing external traffic through secured subnets. Real-time telemetry established. Latency at absolute zero."
  },
  {
    id: "module-gamma",
    title: "Synth Weave",
    subtitle: "MEMORY BANK",
    color: "#00f0ff",
    icon: (
      <svg width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
        <rect x="2" y="2" width="20" height="8" rx="2" ry="2" />
        <rect x="2" y="14" width="20" height="8" rx="2" ry="2" />
        <line x1="6" y1="6" x2="6.01" y2="6" />
        <line x1="6" y1="18" x2="6.01" y2="18" />
      </svg>
    ),
    content: "Accessing deep archive storage. Retrievable assets indexed and ready for deployment. Sector integrity at 100%."
  },
  {
    id: "module-delta",
    title: "Void Protocol",
    subtitle: "SECURITY GRID",
    color: "#ffaa00",
    icon: (
      <svg width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
        <path d="M12 22s8-4 8-10V5l-8-3-8 3v7c0 6 8 10 8 10z" />
      </svg>
    ),
    content: "Active defense systems online. Intrusion countermeasures fully automated. Firewall parameters locked."
  }
];

export function HyperMorphBento({ items = DEFAULT_ITEMS, className = "", style, ...props }: HyperMorphBentoProps) {
  const [activeId, setActiveId] = useState<string | null>(null);

  return (
    <div
      className={`relative w-full max-w-4xl min-h-[500px] flex items-center justify-center bg-[#050505] p-6 rounded-2xl border border-white/5 overflow-hidden ${className}`}
      style={{ ...style }}
      {...props}
    >
      {/* Background Noise & Glow */}
      <div className="absolute inset-0 pointer-events-none opacity-20 mix-blend-overlay" style={{ backgroundImage: "url('data:image/svg+xml;utf8,%3Csvg viewBox=%220 0 200 200%22 xmlns=%22http://www.w3.org/2000/svg%22%3E%3Cfilter id=%22noise%22%3E%3CfeTurbulence type=%22fractalNoise%22 baseFrequency=%220.85%22 numOctaves=%223%22 stitchTiles=%22stitch%22/%3E%3C/filter%3E%3Crect width=%22100%25%22 height=%22100%25%22 filter=%22url(%23noise)%22/%3E%3C/svg%3E')" }} />
      <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[80%] h-[80%] rounded-full blur-[100px] pointer-events-none opacity-[0.03] bg-white" />

      <motion.div
        layout
        className={`w-full h-[400px] gap-4 ${activeId === null ? "grid grid-cols-2 grid-rows-2" : "flex flex-col md:flex-row"}`}
      >
        <AnimatePresence mode="popLayout">
          {items.map((item) => {
            const isActive = activeId === item.id;
            const isOther = activeId !== null && !isActive;

            return (
              <motion.div
                key={item.id}
                layout
                layoutId={`bento-${item.id}`}
                onClick={() => setActiveId(isActive ? null : item.id)}
                className={`
                  relative group cursor-pointer overflow-hidden rounded-xl border border-white/10
                  ${isActive ? "w-full md:w-2/3 h-full z-10" : ""}
                  ${isOther ? "w-full md:w-1/3 h-[125px] md:h-auto flex-1 opacity-70 hover:opacity-100" : ""}
                  ${activeId === null ? "w-full h-full" : ""}
                `}
                style={{
                  background: `linear-gradient(135deg, rgba(15,15,15,0.8) 0%, rgba(5,5,5,0.9) 100%)`,
                  boxShadow: isActive ? `0 0 40px ${item.color}20, inset 0 0 20px ${item.color}10` : "none",
                  borderColor: isActive ? `${item.color}50` : "rgba(255,255,255,0.1)",
                }}
                transition={{ type: "spring", stiffness: 300, damping: 30 }}
                whileHover={!isActive ? { scale: 0.98 } : {}}
                whileTap={{ scale: 0.95 }}
              >
                {/* Active Inner Glow */}
                <motion.div
                  className="absolute inset-0 opacity-0 group-hover:opacity-100 transition-opacity duration-500 pointer-events-none"
                  style={{ background: `radial-gradient(circle at 50% 0%, ${item.color}15 0%, transparent 70%)` }}
                />

                <div className={`p-6 flex flex-col h-full ${isActive ? "justify-between" : "justify-center"}`}>
                  <motion.div layout className="flex items-center gap-4">
                    <motion.div
                      layout="position"
                      className="w-12 h-12 rounded-lg flex items-center justify-center shrink-0 border border-white/10 bg-black/50"
                      style={{ color: item.color, boxShadow: `0 0 20px ${item.color}20` }}
                    >
                      {item.icon}
                    </motion.div>
                    <motion.div layout="position" className="flex flex-col">
                      <motion.span layout="position" className="text-[10px] tracking-widest text-white/40 font-mono">
                        {item.subtitle}
                      </motion.span>
                      <motion.h3 layout="position" className="text-xl text-white/90 font-medium tracking-tight">
                        {item.title}
                      </motion.h3>
                    </motion.div>
                  </motion.div>

                  <AnimatePresence>
                    {isActive && (
                      <motion.div
                        initial={{ opacity: 0, y: 20 }}
                        animate={{ opacity: 1, y: 0 }}
                        exit={{ opacity: 0, y: -20 }}
                        transition={{ delay: 0.1, duration: 0.3 }}
                        className="mt-8 text-white/60 font-mono text-sm leading-relaxed max-w-md"
                      >
                        {item.content}

                        <div className="mt-8 flex gap-3">
                          <button
                            className="px-4 py-2 rounded-md text-xs font-semibold tracking-wider bg-white/10 hover:bg-white/20 text-white transition-colors border border-white/5"
                          >
                            EXECUTE
                          </button>
                          <button
                            className="px-4 py-2 rounded-md text-xs font-semibold tracking-wider transition-colors border border-transparent"
                            style={{ backgroundColor: `${item.color}20`, color: item.color }}
                          >
                            CONFIGURE
                          </button>
                        </div>
                      </motion.div>
                    )}
                  </AnimatePresence>
                </div>

                {/* Decorative Elements */}
                {isActive && (
                   <motion.div
                     initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }}
                     className="absolute bottom-0 right-0 p-6 pointer-events-none opacity-20"
                   >
                     <div className="text-[10rem] leading-none font-bold tracking-tighter" style={{ color: item.color }}>
                       {item.id.split('-')[1].charAt(0).toUpperCase()}
                     </div>
                   </motion.div>
                )}

                {/* Top right indicator */}
                <motion.div
                  layout
                  className="absolute top-4 right-4 w-2 h-2 rounded-full"
                  style={{ backgroundColor: item.color, boxShadow: `0 0 10px ${item.color}` }}
                  animate={{ opacity: isActive ? [1, 0.5, 1] : 0.5 }}
                  transition={{ duration: 2, repeat: Infinity }}
                />
              </motion.div>
            );
          })}
        </AnimatePresence>
      </motion.div>
    </div>
  );
}
