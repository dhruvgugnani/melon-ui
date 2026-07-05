"use client";

import React, { useState, useRef } from "react";
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

export interface DynamicBentoLayoutProps extends React.ComponentPropsWithoutRef<"div"> {
  items?: BentoItem[];
}

const DEFAULT_ITEMS: BentoItem[] = [
  {
    id: "model-registry",
    title: "Model Registry",
    subtitle: "Neural Inference",
    color: "#f97066",
    icon: (
      <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round">
        <path d="M21 16V8a2 2 0 0 0-1-1.73l-7-4a2 2 0 0 0-2 0l-7 4A2 2 0 0 0 3 8v8a2 2 0 0 0 1 1.73l7 4a2 2 0 0 0 2 0l7-4A2 2 0 0 0 21 16z" />
        <polyline points="3.27 6.96 12 12.01 20.73 6.96" />
        <line x1="12" y1="22.08" x2="12" y2="12" />
      </svg>
    ),
    content: "Host and version neural weights locally. Track inference pipeline drift and configure model fallback routes automatically.",
    metrics: [
      { label: "Active Models", value: "24" },
      { label: "Throughput", value: "1.2k/s" },
      { label: "Uptime", value: "99.97%" }
    ]
  },
  {
    id: "vector-ingestion",
    title: "Vector Ingestion",
    subtitle: "Data Pipelines",
    color: "#34d399",
    icon: (
      <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round">
        <polyline points="22 12 18 12 15 21 9 3 6 12 2 12" />
      </svg>
    ),
    content: "Index raw unstructured documents into multi-dimensional embeddings within real-time vector subnets with zero pipeline delay.",
    metrics: [
      { label: "Indexed", value: "3.8M" },
      { label: "Queue", value: "12" },
      { label: "Latency", value: "8ms" }
    ]
  },
  {
    id: "response-cache",
    title: "Response Cache",
    subtitle: "Latency Shield",
    color: "#38bdf8",
    icon: (
      <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round">
        <path d="M12 2L2 7l10 5 10-5-10-5z" />
        <path d="M2 17l10 5 10-5" />
        <path d="M2 12l10 5 10-5" />
      </svg>
    ),
    content: "Deduplicate identical queries before model calls. Serve cached semantic embeddings directly from memory for instant responses.",
    metrics: [
      { label: "Hit Rate", value: "94.3%" },
      { label: "Saved", value: "$2.4k" },
      { label: "Entries", value: "18k" }
    ]
  },
  {
    id: "guardrails",
    title: "Safety Guardrails",
    subtitle: "Content Filters",
    color: "#fbbf24",
    icon: (
      <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round">
        <path d="M12 22s8-4 8-10V5l-8-3-8 3v7c0 6 8 10 8 10z" />
      </svg>
    ),
    content: "Enforce safety boundaries on model I/O. Filter toxic inputs and lock unauthorized data leak vectors in real time.",
    metrics: [
      { label: "Blocked", value: "847" },
      { label: "Accuracy", value: "99.1%" },
      { label: "Policies", value: "12" }
    ]
  }
];

/* ─── Small ring chart for metric visualization ─── */
const MetricRing = ({ value, color, size = 32 }: { value: string; color: string; size?: number }) => {
  const numVal = parseFloat(value.replace(/[^0-9.]/g, ""));
  const pct = isNaN(numVal) ? 65 : numVal > 100 ? 65 : numVal;
  const r = (size - 4) / 2;
  const circ = 2 * Math.PI * r;
  const offset = circ - (pct / 100) * circ;

  return (
    <svg width={size} height={size} className="shrink-0 -rotate-90">
      <circle cx={size / 2} cy={size / 2} r={r} fill="none" stroke="rgba(255,255,255,0.06)" strokeWidth="2.5" />
      <motion.circle
        cx={size / 2}
        cy={size / 2}
        r={r}
        fill="none"
        stroke={color}
        strokeWidth="2.5"
        strokeLinecap="round"
        strokeDasharray={circ}
        initial={{ strokeDashoffset: circ }}
        animate={{ strokeDashoffset: offset }}
        transition={{ duration: 0.8, ease: "easeOut" }}
      />
    </svg>
  );
};

export const DynamicBentoLayout = React.forwardRef<HTMLDivElement, DynamicBentoLayoutProps>(
  ({ items = DEFAULT_ITEMS, className = "", style, ...props }, forwardedRef) => {
    const [activeId, setActiveId] = useState<string | null>(null);
    const safeItems = Array.isArray(items) ? items : DEFAULT_ITEMS;
    const internalRef = useRef<HTMLDivElement>(null);
    const ref = (forwardedRef as React.RefObject<HTMLDivElement | null>) || internalRef;

    return (
      <div
        ref={ref}
        className={`relative w-full max-w-4xl min-h-[480px] flex flex-col rounded-2xl overflow-hidden ${className}`}
        style={{
          background: "linear-gradient(145deg, rgba(15,15,20,0.95) 0%, rgba(8,8,14,0.98) 100%)",
          ...style
        }}
        {...props}
      >
        {/* Soft ambient background glow */}
        <div className="absolute inset-0 pointer-events-none overflow-hidden">
          <div
            className="absolute -top-20 -right-20 w-72 h-72 rounded-full opacity-[0.04]"
            style={{ background: "radial-gradient(circle, #38bdf8 0%, transparent 70%)" }}
          />
          <div
            className="absolute -bottom-16 -left-16 w-64 h-64 rounded-full opacity-[0.03]"
            style={{ background: "radial-gradient(circle, #f97066 0%, transparent 70%)" }}
          />
        </div>

        {/* Header */}
        <div className="relative z-10 px-6 pt-6 pb-4 flex justify-between items-center">
          <div className="flex flex-col gap-0.5">
            <span className="text-[11px] font-medium tracking-wide text-white/35 uppercase">
              Infrastructure
            </span>
            <h2 className="text-lg font-semibold text-white/90 tracking-tight">
              System Overview
            </h2>
          </div>
          <div className="flex items-center gap-2 px-3 py-1.5 rounded-full bg-white/[0.04] border border-white/[0.06]">
            <span className="w-[6px] h-[6px] rounded-full bg-emerald-400" />
            <span className="text-[11px] font-medium text-white/50">
              All systems online
            </span>
          </div>
        </div>

        {/* Divider */}
        <div className="mx-6 h-px bg-gradient-to-r from-transparent via-white/[0.06] to-transparent" />

        {/* Bento Grid */}
        <motion.div
          layout
          className={`relative z-10 p-5 flex-1 gap-3 flex flex-col ${
            activeId === null
              ? "grid grid-cols-1 sm:grid-cols-2"
              : "md:flex-row min-h-[360px]"
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
                    relative group cursor-pointer overflow-hidden rounded-xl border transition-colors duration-300
                    ${isActive ? "w-full md:w-[60%] min-h-[340px] md:min-h-0 z-10" : ""}
                    ${isOther ? "w-full md:w-[40%] h-[80px] md:h-auto flex-1 opacity-60 hover:opacity-100" : ""}
                    ${activeId === null ? "w-full h-[170px]" : ""}
                  `}
                  style={{
                    backgroundColor: isActive
                      ? `color-mix(in srgb, ${item.color} 4%, rgba(16,16,22,0.95))`
                      : "rgba(16,16,22,0.7)",
                    borderColor: isActive ? `${item.color}30` : "rgba(255,255,255,0.05)",
                    backdropFilter: "blur(12px)",
                  }}
                  transition={{ duration: 0.45, ease: [0.22, 1, 0.36, 1] }}
                  whileHover={
                    !isActive
                      ? { borderColor: "rgba(255,255,255,0.10)", backgroundColor: "rgba(20,20,28,0.85)" }
                      : {}
                  }
                  whileTap={{ scale: 0.985 }}
                >
                  {/* Hover gradient bloom */}
                  <div
                    className="absolute inset-0 opacity-0 group-hover:opacity-100 transition-opacity duration-500 pointer-events-none"
                    style={{
                      background: `radial-gradient(ellipse 80% 60% at 50% 0%, ${item.color}0a 0%, transparent 70%)`,
                    }}
                  />

                  <div className="p-5 flex flex-col h-full relative z-10">
                    {/* Card header */}
                    <motion.div layout className="flex items-start justify-between">
                      <div className="flex items-center gap-3">
                        <motion.div
                          layout="position"
                          className="w-9 h-9 rounded-lg flex items-center justify-center shrink-0"
                          style={{
                            color: item.color,
                            backgroundColor: `${item.color}12`,
                          }}
                        >
                          {item.icon}
                        </motion.div>
                        <motion.div layout="position" className="flex flex-col">
                          <motion.span
                            layout="position"
                            className="text-[10px] font-medium text-white/30 uppercase tracking-wider leading-none"
                          >
                            {item.subtitle}
                          </motion.span>
                          <motion.h3
                            layout="position"
                            className="text-[15px] font-semibold text-white/90 mt-1 leading-none"
                          >
                            {item.title}
                          </motion.h3>
                        </motion.div>
                      </div>

                      {/* Status dot */}
                      <motion.div
                        layout
                        className="mt-1 w-2 h-2 rounded-full shrink-0"
                        style={{
                          backgroundColor: item.color,
                          boxShadow: `0 0 6px ${item.color}60`,
                        }}
                      />
                    </motion.div>

                    {/* Collapsed mini metrics */}
                    {!isActive && (
                      <motion.div
                        initial={{ opacity: 0 }}
                        animate={{ opacity: 1 }}
                        className="mt-auto pt-3 flex items-center gap-4"
                      >
                        {item.metrics?.slice(0, 2).map((m, idx) => (
                          <div key={idx} className="flex flex-col">
                            <span className="text-[10px] text-white/25 leading-none">{m.label}</span>
                            <span className="text-[13px] font-semibold text-white/70 mt-1 leading-none">{m.value}</span>
                          </div>
                        ))}
                      </motion.div>
                    )}

                    {/* Expanded content */}
                    <AnimatePresence>
                      {isActive && (
                        <motion.div
                          initial={{ opacity: 0, y: 8 }}
                          animate={{ opacity: 1, y: 0 }}
                          exit={{ opacity: 0, y: -6 }}
                          transition={{ duration: 0.3, ease: "easeOut" }}
                          className="mt-5 flex flex-col flex-1"
                        >
                          <p className="text-[13px] leading-relaxed text-white/50 max-w-md">
                            {item.content}
                          </p>

                          {/* Metric cards with ring charts */}
                          <div className="grid grid-cols-3 gap-2.5 mt-6">
                            {item.metrics?.map((m, idx) => (
                              <div
                                key={idx}
                                className="flex flex-col items-center gap-2 rounded-lg px-3 py-3.5 bg-white/[0.02] border border-white/[0.04]"
                              >
                                <MetricRing value={m.value} color={item.color} size={36} />
                                <div className="flex flex-col items-center text-center">
                                  <span
                                    className="text-[14px] font-semibold leading-none"
                                    style={{ color: item.color }}
                                  >
                                    {m.value}
                                  </span>
                                  <span className="text-[10px] text-white/30 mt-1 leading-none">{m.label}</span>
                                </div>
                              </div>
                            ))}
                          </div>

                          {/* Action buttons */}
                          <div className="mt-auto pt-5 flex gap-2">
                            <button
                              onClick={(e) => e.stopPropagation()}
                              className="px-4 py-2 rounded-lg text-[12px] font-medium bg-white/[0.05] hover:bg-white/[0.08] text-white/70 hover:text-white/90 transition-all border border-white/[0.06] cursor-pointer active:scale-[0.97]"
                            >
                              View Details
                            </button>
                            <button
                              onClick={(e) => e.stopPropagation()}
                              className="px-4 py-2 rounded-lg text-[12px] font-medium transition-all border border-transparent cursor-pointer active:scale-[0.97]"
                              style={{
                                backgroundColor: `${item.color}18`,
                                color: item.color,
                              }}
                            >
                              Configure
                            </button>
                          </div>
                        </motion.div>
                      )}
                    </AnimatePresence>
                  </div>
                </motion.div>
              );
            })}
          </AnimatePresence>
        </motion.div>
      </div>
    );
  }
);

DynamicBentoLayout.displayName = "DynamicBentoLayout";
