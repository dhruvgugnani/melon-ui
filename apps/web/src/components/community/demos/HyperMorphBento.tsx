"use client";

import React, { useState } from "react";
import { motion, AnimatePresence } from "framer-motion";

export interface BentoItem {
  id: string;
  title: string;
  subtitle: string;
  color: string;
  icon: React.ReactNode;
  content: string;
  metrics?: { label: string; value: string }[];
}

export interface HyperMorphBentoProps extends React.ComponentPropsWithoutRef<"div"> {
  items?: BentoItem[];
}

const DEFAULT_ITEMS: BentoItem[] = [
  {
    id: "model-registry",
    title: "Model Registry",
    subtitle: "INFERENCE CODES",
    color: "#ff5c71",
    icon: (
      <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
        <circle cx="12" cy="12" r="10" />
        <path d="M12 2v20" />
        <path d="M17 5H9.5a3.5 3.5 0 0 0 0 7h5a3.5 3.5 0 0 1 0 7H6" />
      </svg>
    ),
    content: "Host and version neural weights locally. Track inference pipeline drift and configure model fallback routes automatically.",
    metrics: [
      { label: "Active Nodes", value: "14/16" },
      { label: "Throughput", value: "1.4k rps" },
      { label: "Drift Index", value: "0.02" }
    ]
  },
  {
    id: "vector-ingestion",
    title: "Vector Ingestion",
    subtitle: "DATA PIPELINES",
    color: "#7fff5e",
    icon: (
      <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
        <polyline points="22 12 18 12 15 21 9 3 6 12 2 12" />
      </svg>
    ),
    content: "Index raw unstructured documents into multi-dimensional embeddings inside real-time vector subnets with zero pipeline delay.",
    metrics: [
      { label: "Embedding Lag", value: "4ms" },
      { label: "Load Index", value: "28%" },
      { label: "Queue Depth", value: "0" }
    ]
  },
  {
    id: "response-cache",
    title: "Response Cache",
    subtitle: "LATENCY SHIELD",
    color: "#00f0ff",
    icon: (
      <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
        <rect x="2" y="2" width="20" height="8" rx="2" ry="2" />
        <rect x="2" y="14" width="20" height="8" rx="2" ry="2" />
        <line x1="6" y1="6" x2="6.01" y2="6" />
        <line x1="6" y1="18" x2="6.01" y2="18" />
      </svg>
    ),
    content: "Deduplicate identical queries before running model calls. Serving cached semantic embeddings directly from physical RAM registers.",
    metrics: [
      { label: "Cache Hit Rate", value: "74.2%" },
      { label: "RAM Allocation", value: "1.2 GB" },
      { label: "Avg Latency", value: "1.5ms" }
    ]
  },
  {
    id: "guardrails",
    title: "Safety Guardrails",
    subtitle: "CONTENT FILTERS",
    color: "#ffaa00",
    icon: (
      <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
        <path d="M12 22s8-4 8-10V5l-8-3-8 3v7c0 6 8 10 8 10z" />
      </svg>
    ),
    content: "Enforce safety boundaries on model inputs and outputs. Filter toxic inputs and lock unauthorized leak parameters automatically.",
    metrics: [
      { label: "Block Count", value: "21" },
      { label: "Filter Delay", value: "11ms" },
      { label: "Trigger Ratio", value: "0.04%" }
    ]
  }
];

export function HyperMorphBento({ items = DEFAULT_ITEMS, className = "", style, ...props }: HyperMorphBentoProps) {
  const [activeId, setActiveId] = useState<string | null>(null);
  const safeItems = Array.isArray(items) ? items : DEFAULT_ITEMS;

  return (
    <div
      className={`relative w-full max-w-4xl min-h-[480px] flex flex-col bg-[#08080a] p-4 md:p-6 rounded-lg border border-white/10 overflow-hidden ${className}`}
      style={{ ...style }}
      {...props}
    >
      {/* Background Subtle Accent Grids */}
      <div 
        className="absolute inset-0 opacity-[0.02] pointer-events-none" 
        style={{
          backgroundImage: "linear-gradient(to right, #fff 1px, transparent 1px), linear-gradient(to bottom, #fff 1px, transparent 1px)",
          backgroundSize: "24px 24px"
        }}
      />

      {/* Practical SaaS Panel Header */}
      <div className="relative z-10 flex justify-between items-center mb-6 pb-4 border-b border-white/5">
        <div className="flex flex-col">
          <span className="text-[9px] font-mono tracking-[0.25em] text-white/35 uppercase">
            CLUSTER TELEMETRY
          </span>
          <h2 className="text-base font-bold text-white tracking-tight mt-1">
            Active Processing Nodes
          </h2>
        </div>
        <div className="flex items-center gap-2 border border-white/5 bg-white/[0.02] px-2.5 py-1 rounded">
          <span className="w-1.5 h-1.5 rounded-full bg-[#7fff5e] animate-pulse" />
          <span className="text-[9px] font-mono tracking-widest text-[#7fff5e]">
            SYSTEM SECURE
          </span>
        </div>
      </div>

      <motion.div
        layout
        className={`relative z-10 w-full gap-4 flex-1 flex flex-col ${
          activeId === null
            ? "grid grid-cols-1 sm:grid-cols-2"
            : "md:flex-row min-h-[380px]"
        }`}
      >
        <AnimatePresence mode="popLayout">
          {safeItems.map((item) => {
            const isActive = activeId === item.id;
            const isOther = activeId !== null && !isActive;

            return (
              <motion.div
                key={item.id}
                layout
                layoutId={`bento-${item.id}`}
                onClick={() => setActiveId(isActive ? null : item.id)}
                className={`
                  relative group cursor-pointer overflow-hidden rounded-md border transition-all duration-300
                  ${isActive ? "w-full md:w-[62%] min-h-[340px] md:min-h-0 z-10" : ""}
                  ${isOther ? "w-full md:w-[38%] h-[80px] md:h-auto flex-1 opacity-60 hover:opacity-100" : ""}
                  ${activeId === null ? "w-full h-[160px] md:h-[180px]" : ""}
                `}
                style={{
                  backgroundColor: "rgba(13, 13, 16, 0.95)",
                  borderColor: isActive ? `${item.color}50` : "rgba(255,255,255,0.08)",
                  boxShadow: isActive 
                    ? `0 15px 30px -15px ${item.color}20, inset 0 0 10px ${item.color}05` 
                    : "none",
                }}
                transition={{ type: "spring", stiffness: 320, damping: 28 }}
                whileHover={!isActive ? { scale: 0.995, borderColor: "rgba(255,255,255,0.15)" } : {}}
                whileTap={{ scale: 0.99 }}
              >
                {/* Active Accent Ambient Glow */}
                <motion.div
                  className="absolute inset-x-0 top-0 h-32 opacity-0 group-hover:opacity-100 transition-opacity duration-300 pointer-events-none"
                  style={{ background: `radial-gradient(circle at 50% 0%, ${item.color}08 0%, transparent 70%)` }}
                />

                <div className="p-4 md:p-5 flex flex-col h-full justify-between">
                  <div className="w-full">
                    <motion.div layout className="flex items-start gap-3.5">
                      <motion.div
                        layout="position"
                        className="w-9 h-9 rounded flex items-center justify-center shrink-0 border bg-white/[0.01]"
                        style={{ 
                          color: item.color, 
                          borderColor: `${item.color}20`,
                        }}
                      >
                        {item.icon}
                      </motion.div>
                      <motion.div layout="position" className="flex flex-col">
                        <motion.span layout="position" className="text-[8px] tracking-[0.2em] text-white/30 font-mono uppercase">
                          {item.subtitle}
                        </motion.span>
                        <motion.h3 layout="position" className="text-sm md:text-base text-white/90 font-semibold mt-0.5 leading-tight">
                          {item.title}
                        </motion.h3>
                      </motion.div>
                    </motion.div>

                    {/* Collapsed view metrics snippet */}
                    {!isActive && (
                      <motion.div 
                        initial={{ opacity: 0 }}
                        animate={{ opacity: 0.4 }}
                        className="flex gap-4 border-t border-white/5 pt-3 mt-4"
                      >
                        {item.metrics?.slice(0, 2).map((m, idx) => (
                          <div key={idx} className="flex flex-col font-mono text-[9px]">
                            <span className="text-white/40 uppercase tracking-wider leading-none">{m.label}</span>
                            <span className="text-white/80 mt-1 leading-none">{m.value}</span>
                          </div>
                        ))}
                      </motion.div>
                    )}

                    <AnimatePresence>
                      {isActive && (
                        <motion.div
                          initial={{ opacity: 0, y: 10 }}
                          animate={{ opacity: 1, y: 0 }}
                          exit={{ opacity: 0, y: -10 }}
                          transition={{ delay: 0.05, duration: 0.2 }}
                          className="mt-4 flex flex-col"
                        >
                          <p className="text-white/50 text-xs leading-relaxed max-w-md">
                            {item.content}
                          </p>

                          {/* Metric Dashboard Block inside expanded card */}
                          <div className="grid grid-cols-3 gap-2.5 border-t border-white/5 pt-4 mt-5">
                            {item.metrics?.map((m, idx) => (
                              <div key={idx} className="bg-white/[0.01] border border-white/5 p-2 rounded flex flex-col">
                                <span className="font-mono text-[8px] text-white/30 uppercase tracking-widest leading-none">
                                  {m.label}
                                </span>
                                <span className="font-mono text-xs font-semibold mt-1.5 leading-none" style={{ color: item.color }}>
                                  {m.value}
                                </span>
                              </div>
                            ))}
                          </div>
                        </motion.div>
                      )}
                    </AnimatePresence>
                  </div>

                  {isActive && (
                    <motion.div
                      initial={{ opacity: 0 }}
                      animate={{ opacity: 1 }}
                      exit={{ opacity: 0 }}
                      transition={{ delay: 0.1 }}
                      className="mt-5 flex gap-2.5"
                    >
                      <button
                        onClick={(e) => e.stopPropagation()}
                        className="px-3 py-1.5 rounded font-mono text-[9px] tracking-wider bg-white/5 hover:bg-white/10 text-white/90 transition-all border border-white/5 active:scale-95"
                      >
                        RUN TELEMETRY
                      </button>
                      <button
                        onClick={(e) => e.stopPropagation()}
                        className="px-3 py-1.5 rounded font-mono text-[9px] tracking-wider transition-all border border-transparent active:scale-95"
                        style={{ backgroundColor: `${item.color}15`, color: item.color }}
                      >
                        SYS OPTIMIZE
                      </button>
                    </motion.div>
                  )}
                </div>

                {/* Top right status indicator */}
                <motion.div
                  layout
                  className="absolute top-4 right-4 w-1.5 h-1.5 rounded-full"
                  style={{ backgroundColor: item.color, boxShadow: `0 0 6px ${item.color}` }}
                  animate={{ opacity: isActive ? [1, 0.4, 1] : 0.6 }}
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
