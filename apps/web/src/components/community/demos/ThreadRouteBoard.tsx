"use client";

import React, { useState, useEffect, useMemo } from "react";
import { motion, AnimatePresence, HTMLMotionProps } from "framer-motion";

export interface ThreadRouteBoardMetric {
  label: string;
  value: string;
}

export interface ThreadRouteBoardThread {
  id: string;
  title: string;
  meta: string;
  value: string;
  color: string;
  copy: string;
  metrics?: ThreadRouteBoardMetric[];
}

export interface ThreadRouteBoardProps extends Omit<HTMLMotionProps<"section">, "title"> {
  title?: string;
  eyebrow?: string;
  statusLabel?: string;
  lensLabel?: string;
  threads?: ThreadRouteBoardThread[];
  containerBg?: string;
  cardBgLeft?: string;
  cardBgRight?: string;
  currentThreadLabel?: string;
  hoverHint?: string;
  clickHint?: string;
  metricLabel1?: string;
  metricLabel2?: string;
  metricLabel3?: string;
}

const DEFAULT_THREADS: ThreadRouteBoardThread[] = [
  {
    id: "brief",
    title: "Brief",
    meta: "Input",
    value: "92%",
    color: "#ff5c71",
    copy: "Collect user intent, constraints, edge states, and the emotional target.",
    metrics: [
      { label: "Pulse", value: "92%" },
      { label: "Glass", value: "88%" },
      { label: "Drift", value: "15ms" },
    ]
  },
  {
    id: "taste",
    title: "Taste",
    meta: "Lens",
    value: "Hot",
    color: "#7fff5e",
    copy: "Filter the surface through MelonUI contrast, glass, glow, and tactile motion.",
    metrics: [
      { label: "Pulse", value: "Hot" },
      { label: "Glass", value: "96%" },
      { label: "Drift", value: "8ms" },
    ]
  },
  {
    id: "ship",
    title: "Ship",
    meta: "Output",
    value: "Live",
    color: "#f7f0d2",
    copy: "Package the interaction as source-first UI with demo, registry metadata, and polish.",
    metrics: [
      { label: "Pulse", value: "Live" },
      { label: "Glass", value: "99%" },
      { label: "Drift", value: "3ms" },
    ]
  },
];

export function ThreadRouteBoard({
  title = "Route the next best action",
  eyebrow = "Signal Loom",
  statusLabel = "Live sprint",
  lensLabel = "Buyer lens",
  threads = DEFAULT_THREADS,
  containerBg = "rgba(8, 8, 10, 0.95)",
  cardBgLeft = "rgba(12, 12, 16, 0.5)",
  cardBgRight = "rgba(10, 10, 12, 0.6)",
  currentThreadLabel = "Current Thread",
  hoverHint = "Hover threads",
  clickHint = "Click to pin",
  metricLabel1 = "Pulse",
  metricLabel2 = "Glass",
  metricLabel3 = "Drift",
  className = "",
  style,
  ...props
}: ThreadRouteBoardProps) {
  const [active, setActive] = useState(1);
  const [hovered, setHovered] = useState<number | null>(null);
  const [logs, setLogs] = useState<string[]>([]);

  const safeThreads = threads && threads.length > 0 ? threads : DEFAULT_THREADS;
  const activeIndex = Math.min(hovered ?? active, safeThreads.length - 1);
  const activeThread = safeThreads[activeIndex] ?? safeThreads[0];

  // Streaming logs mockup generator
  const getLogsForThread = (id: string) => {
    switch (id) {
      case "brief":
        return [
          "[sys] initiating trace: brief input data payload...",
          "[api] source telemetry schema validated: OK",
          "[parse] mapping constraints and edge layouts...",
          "[info] cluster processing signal routing indexes",
          "[success] thread trace ready for execution metrics."
        ];
      case "taste":
        return [
          "[sys] initializing visual taste matrices...",
          "[metrics] scanning contrast values and border physics...",
          "[safety] verification: brand color checks fully passed",
          "[telemetry] computing fluid scroll-animation weights...",
          "[success] active tactile values synced to dashboard."
        ];
      case "ship":
        return [
          "[sys] packaging build distribution registry...",
          "[bundler] packaging react client components...",
          "[sync] executing components registry sync pipeline...",
          "[telemetry] verified local compilation checks: OK",
          "[success] application exported to local node cluster."
        ];
      default:
        return [
          `[sys] establishing connection to node ${id}...`,
          "[api] validation: OK, streaming status metadata...",
          "[trace] pipeline executing trace logs...",
          "[success] node response processed successfully."
        ];
    }
  };

  useEffect(() => {
    const targetLogs = getLogsForThread(activeThread.id);
    setLogs([]);
    
    const timeouts = targetLogs.map((log, index) => 
      setTimeout(() => {
        setLogs(prev => [...prev, log]);
      }, index * 120)
    );

    return () => {
      timeouts.forEach(clearTimeout);
    };
  }, [activeThread.id]);

  return (
    <motion.section
      aria-label="Signal Loom interactive component"
      className={`relative flex w-full items-center justify-center overflow-visible px-0 py-0 text-white ${className}`}
      style={style}
      {...props}
    >
      <div
        className="relative z-10 grid w-full max-w-5xl gap-4 rounded-lg border border-white/10 p-4 shadow-[0_20px_50px_rgba(0,0,0,0.45)] md:grid-cols-[1.1fr_0.9fr]"
        style={{ backgroundColor: containerBg }}
      >
        {/* Left Card: Stepper / Pipeline Flow */}
        <div 
          className="relative min-h-fit overflow-hidden rounded border border-white/5 p-4 sm:p-5"
          style={{ backgroundColor: cardBgLeft }}
        >
          {/* Background Subtle Accent Grids */}
          <div 
            className="absolute inset-0 opacity-[0.02] pointer-events-none" 
            style={{
              backgroundImage: "linear-gradient(to right, #fff 1px, transparent 1px), linear-gradient(to bottom, #fff 1px, transparent 1px)",
              backgroundSize: "20px 20px"
            }}
          />

          <div className="relative z-10 flex h-full flex-col justify-between">
            {/* Header info */}
            <div className="flex items-start justify-between gap-4 mb-6">
              <div>
                <p className="font-mono text-[9px] uppercase tracking-[0.25em] text-[#ff5c71]">
                  {eyebrow}
                </p>
                <h3
                  className="mt-1 text-2xl font-bold tracking-tight text-white uppercase sm:text-3xl"
                  style={{ fontFamily: "var(--font-Outfit), sans-serif" }}
                >
                  {title}
                </h3>
              </div>
              <div className="shrink-0 rounded border border-white/10 bg-white/[0.02] px-2.5 py-1 font-mono text-[8px] uppercase tracking-[0.2em] text-white/40">
                {statusLabel}
              </div>
            </div>

            {/* Vertical Flow Stepper Container */}
            <div className="relative flex flex-col gap-3 py-1 pl-7">
              {/* Stepper Vertical Flow Line */}
              <div className="absolute left-[9px] top-4 bottom-4 w-0.5 pointer-events-none bg-white/[0.04]">
                <svg className="absolute top-0 left-0 w-full h-full" preserveAspectRatio="none">
                  <motion.line
                    x1="0" y1="0" x2="0" y2="100%"
                    stroke={activeThread.color}
                    strokeWidth="2"
                    strokeDasharray="4 6"
                    animate={{ strokeDashoffset: [0, -20] }}
                    transition={{ repeat: Infinity, duration: 1.5, ease: "linear" }}
                  />
                </svg>
              </div>

              {safeThreads.map((thread, index) => {
                const isActive = index === activeIndex;
                return (
                  <button
                    key={thread.id}
                    type="button"
                    onMouseEnter={() => setHovered(index)}
                    onFocus={() => setHovered(index)}
                    onBlur={() => setHovered(null)}
                    onClick={() => setActive(index)}
                    className={`
                      group relative w-full flex items-start gap-4 p-3 rounded text-left border transition-all duration-300
                      ${isActive ? "border-white/15 bg-white/[0.03]" : "border-transparent bg-white/[0.005] hover:bg-white/[0.015] hover:border-white/5"}
                    `}
                    aria-pressed={active === index}
                  >
                    {/* Stepper Node Bullet */}
                    <div 
                      className={`
                        absolute left-[-24px] top-[14px] w-2.5 h-2.5 rounded-full border bg-[#08080a] z-10 transition-all duration-300
                        ${isActive ? "scale-110 shadow-[0_0_8px_currentColor]" : "opacity-45 scale-90"}
                      `}
                      style={{ 
                        borderColor: thread.color,
                        color: thread.color
                      }}
                    />

                    <div className="flex-1 flex flex-col">
                      <div className="flex items-center justify-between gap-2">
                        <span className="font-mono text-[8px] uppercase tracking-wider text-white/30">
                          {thread.meta}
                        </span>
                        <span 
                          className="font-mono text-[9px] font-semibold"
                          style={{ color: thread.color }}
                        >
                          {thread.value}
                        </span>
                      </div>
                      <span
                        className="text-sm font-semibold tracking-tight text-white/90 uppercase mt-0.5"
                        style={{ fontFamily: "var(--font-Outfit), sans-serif" }}
                      >
                        {thread.title}
                      </span>
                      <p className="mt-1 text-[11px] leading-relaxed text-white/50 font-mono">
                        {thread.copy}
                      </p>
                    </div>
                  </button>
                );
              })}
            </div>
          </div>
        </div>

        {/* Right Card: Telemetry Trace log monitor */}
        <aside 
          className="relative overflow-hidden rounded border border-white/5 p-4 sm:p-5"
          style={{ backgroundColor: cardBgRight }}
        >
          {/* Subtle Corner Glow Accent */}
          <div className="absolute top-0 right-0 w-32 h-32 opacity-15 pointer-events-none rounded-full blur-2xl" 
               style={{ background: `radial-gradient(circle, ${activeThread.color} 0%, transparent 70%)` }} 
          />

          <div className="relative z-10 flex h-full flex-col justify-between">
            <div>
              {/* Header inside wafer */}
              <div className="flex items-center justify-between border-b border-white/5 pb-3 mb-4">
                <span className="font-mono text-[8px] uppercase tracking-[0.2em] text-white/30">
                  {lensLabel}
                </span>
                <div className="flex items-center gap-1.5">
                  <span className="font-mono text-[8px] tracking-wider text-white/40 uppercase">NODE:</span>
                  <span 
                    className="font-mono text-[8px] font-semibold uppercase tracking-wider"
                    style={{ color: activeThread.color }}
                  >
                    {activeThread.title}
                  </span>
                  <span
                    className="h-1.5 w-1.5 rounded-full shadow-[0_0_8px_currentColor]"
                    style={{ color: activeThread.color, backgroundColor: activeThread.color }}
                  />
                </div>
              </div>

              {/* Inspector details layout */}
              <div className="flex flex-col gap-3">
                <div className="flex flex-col">
                  <span className="font-mono text-[8px] uppercase tracking-[0.2em] text-white/40">
                    {currentThreadLabel}
                  </span>
                  <h4
                    className="text-2xl font-bold tracking-tight text-white uppercase mt-0.5"
                    style={{ fontFamily: "var(--font-Outfit), sans-serif", color: activeThread.color }}
                  >
                    {activeThread.title} Pipeline
                  </h4>
                </div>

                {/* Simulated Telemetry log monitor */}
                <div className="bg-[#050507] border border-white/5 rounded p-3 min-h-[140px] font-mono text-[9px] text-white/60 flex flex-col gap-1.5 overflow-hidden">
                  <AnimatePresence mode="popLayout">
                    {logs.map((log, idx) => (
                      <motion.div
                        key={log}
                        initial={{ opacity: 0, x: -3 }}
                        animate={{ opacity: 1, x: 0 }}
                        exit={{ opacity: 0 }}
                        transition={{ duration: 0.15 }}
                        className="leading-relaxed border-l-2 pl-2 border-white/5 break-all"
                        style={{ 
                          borderColor: idx === logs.length - 1 ? activeThread.color : "rgba(255,255,255,0.05)",
                          color: idx === logs.length - 1 ? "#fff" : "rgba(255,255,255,0.6)"
                        }}
                      >
                        {log}
                      </motion.div>
                    ))}
                  </AnimatePresence>
                </div>

                {/* Metrics Grid */}
                <div className="grid grid-cols-3 gap-2 mt-2">
                  {(activeThread.metrics || [
                    { label: metricLabel1, value: activeThread.value },
                    { label: metricLabel2, value: "78%" },
                    { label: metricLabel3, value: "94%" }
                  ]).map((m, index) => (
                    <div
                      key={index}
                      className="rounded border border-white/5 bg-white/[0.01] p-2 flex flex-col"
                    >
                      <span className="block font-mono text-[7px] uppercase tracking-[0.15em] text-white/30">
                        {m.label}
                      </span>
                      <span 
                        className="mt-1 block font-mono text-[10px] font-semibold text-white/80"
                        style={{ color: activeThread.color }}
                      >
                        {m.value}
                      </span>
                    </div>
                  ))}
                </div>
              </div>
            </div>

            {/* Wafer footer */}
            <div className="mt-5 flex items-center justify-between border-t border-white/5 pt-3 font-mono text-[8px] uppercase tracking-[0.2em] text-white/30">
              <span>{hoverHint}</span>
              <span>{clickHint}</span>
            </div>
          </div>
        </aside>
      </div>
    </motion.section>
  );
}
