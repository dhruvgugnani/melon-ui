"use client";

import React, { useMemo, useState } from "react";
import {
  AnimatePresence,
  motion,
  useMotionValue,
  useSpring,
  useTransform,
  HTMLMotionProps,
} from "framer-motion";

export interface SignalLoomMetric {
  label: string;
  value: string;
}

export interface SignalLoomThread {
  id: string;
  title: string;
  meta: string;
  value: string;
  color: string;
  copy: string;
  metrics?: SignalLoomMetric[];
}

export interface SignalLoomProps extends Omit<HTMLMotionProps<"section">, "title"> {
  title?: string;
  eyebrow?: string;
  statusLabel?: string;
  lensLabel?: string;
  threads?: SignalLoomThread[];
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

const DEFAULT_THREADS: SignalLoomThread[] = [
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

export function SignalLoom({
  title = "Weave the next action",
  eyebrow = "Signal Loom",
  statusLabel = "Live",
  lensLabel = "Inspection Lens",
  threads = DEFAULT_THREADS,
  containerBg = "rgba(0, 0, 0, 0.45)",
  cardBgLeft = "rgba(8, 8, 8, 0.8)",
  cardBgRight = "rgba(10, 10, 10, 0.82)",
  currentThreadLabel = "Current Thread",
  hoverHint = "Hover threads",
  clickHint = "Click to pin",
  metricLabel1 = "Pulse",
  metricLabel2 = "Glass",
  metricLabel3 = "Drift",
  className = "",
  style,
  ...props
}: SignalLoomProps) {
  const [active, setActive] = useState(1);
  const [hovered, setHovered] = useState<number | null>(null);
  const [pressed, setPressed] = useState(false);
  const pointerX = useMotionValue(50);
  const pointerY = useMotionValue(50);

  const smoothX = useSpring(pointerX, { stiffness: 180, damping: 26, mass: 0.6 });
  const smoothY = useSpring(pointerY, { stiffness: 180, damping: 26, mass: 0.6 });
  const rotateX = useTransform(smoothY, [0, 100], [8, -8]);
  const rotateY = useTransform(smoothX, [0, 100], [-10, 10]);
  const glareX = useTransform(smoothX, (value) => `${value}%`);
  const glareY = useTransform(smoothY, (value) => `${value}%`);
  const ambientGlow = useTransform(
    [glareX, glareY],
    ([x, y]) =>
      `radial-gradient(circle at ${x} ${y}, rgba(255,92,113,0.22), rgba(127,255,94,0.08) 24%, transparent 52%)`
  );
  const lensX = useTransform(smoothX, [0, 100], [-26, 26]);
  const lensY = useTransform(smoothY, [0, 100], [-22, 22]);

  const safeThreads = threads.length > 0 ? threads : DEFAULT_THREADS;
  const activeIndex = Math.min(hovered ?? active, safeThreads.length - 1);
  const activeThread = safeThreads[activeIndex] ?? safeThreads[0];

  const handlePointerMove = (event: React.PointerEvent<HTMLDivElement>) => {
    const rect = event.currentTarget.getBoundingClientRect();
    pointerX.set(((event.clientX - rect.left) / rect.width) * 100);
    pointerY.set(((event.clientY - rect.top) / rect.height) * 100);
  };

  const resetPointer = () => {
    pointerX.set(50);
    pointerY.set(50);
    setHovered(null);
    setPressed(false);
  };

  return (
    <motion.section
      aria-label="Signal Loom interactive component"
      onPointerMove={handlePointerMove}
      onPointerLeave={resetPointer}
      onPointerDown={() => setPressed(true)}
      onPointerUp={() => setPressed(false)}
      className={`relative flex w-full items-center justify-center overflow-visible px-0 py-0 text-white ${className}`}
      style={style}
      {...props}
    >
      <motion.div
        className="pointer-events-none absolute -inset-6 opacity-70 blur-2xl"
        style={{
          background: ambientGlow,
        }}
      />

      <motion.div
        className="relative z-10 grid w-full max-w-5xl gap-3 rounded-[8px] border border-white/10 p-3 shadow-[0_35px_90px_rgba(0,0,0,0.55)] backdrop-blur-2xl md:grid-cols-[1.08fr_0.92fr] md:p-4"
        style={{ rotateX, rotateY, transformPerspective: 1000, backgroundColor: containerBg }}
        animate={{ scale: pressed ? 0.985 : 1 }}
        transition={{ type: "spring", stiffness: 260, damping: 22 }}
      >
        <div className="pointer-events-none absolute inset-0 rounded-[8px] bg-[linear-gradient(135deg,rgba(255,255,255,0.16),transparent_24%,transparent_72%,rgba(127,255,94,0.13))]" />
        <div className="pointer-events-none absolute inset-[1px] rounded-[7px] border border-white/5" />

        <div 
          className="relative min-h-fit overflow-hidden rounded-[6px] border border-white/10 p-4 md:min-h-[380px] sm:p-5"
          style={{ backgroundColor: cardBgLeft }}
        >
          {/* Futuristic Telemetry Dot Matrix */}
          <div 
            className="absolute inset-0 opacity-[0.04] pointer-events-none" 
            style={{
              backgroundImage: "radial-gradient(circle, #fff 1.5px, transparent 1.5px)",
              backgroundSize: "24px 24px"
            }}
          />

          {/* Interactive Radar Sweep Ring centered at pointer coordinate */}
          <div className="absolute inset-0 overflow-hidden pointer-events-none">
            <motion.div 
              className="absolute rounded-full border border-dashed opacity-30"
              style={{
                left: useTransform(smoothX, (v) => `${v}%`),
                top: useTransform(smoothY, (v) => `${v}%`),
                x: "-50%",
                y: "-50%",
                width: 130,
                height: 130,
                borderColor: activeThread.color,
                boxShadow: `0 0 35px ${activeThread.color}22`,
              }}
              animate={{ rotate: 360 }}
              transition={{ duration: 12, repeat: Infinity, ease: "linear" }}
            />
            <motion.div 
              className="absolute rounded-full border opacity-15"
              style={{
                left: useTransform(smoothX, (v) => `${v}%`),
                top: useTransform(smoothY, (v) => `${v}%`),
                x: "-50%",
                y: "-50%",
                width: 250,
                height: 250,
                borderColor: activeThread.color,
              }}
              animate={{ scale: [0.95, 1.08, 0.95] }}
              transition={{ duration: 5, repeat: Infinity, ease: "easeInOut" }}
            />
            {/* Glowing sweep line */}
            <motion.div 
              className="absolute w-[2px] h-[60px] opacity-25 origin-bottom"
              style={{
                left: useTransform(smoothX, (v) => `${v}%`),
                top: useTransform(smoothY, (v) => `${v}%`),
                x: "-50%",
                y: "-100%",
                background: `linear-gradient(to top, ${activeThread.color}, transparent)`,
              }}
              animate={{ rotate: 360 }}
              transition={{ duration: 4, repeat: Infinity, ease: "linear" }}
            />
          </div>

          <div className="relative z-10 flex h-full min-h-fit flex-col justify-between md:min-h-[340px]">
            <div className="flex items-start justify-between gap-4">
              <div>
                <p className="font-mono text-[10px] uppercase tracking-[0.28em] text-[#ff5c71]">
                  {eyebrow}
                </p>
                <h3
                  className="mt-2 max-w-[10ch] text-3xl uppercase leading-[0.82] text-white sm:text-5xl md:text-6xl"
                  style={{ fontFamily: "var(--font-Outfit), var(--font-londrina-solid), sans-serif" }}
                >
                  {title}
                </h3>
              </div>
              <div className="rounded-full border border-white/10 bg-white/[0.04] px-3 py-1 font-mono text-[10px] uppercase tracking-[0.22em] text-white/40">
                {statusLabel}
              </div>
            </div>

            <div className="grid grid-cols-1 sm:grid-cols-3 gap-2 mt-4">
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
                    className="group relative min-h-[86px] overflow-hidden rounded-[7px] border border-white/10 bg-white/[0.045] p-2.5 text-left backdrop-blur-xl transition-colors duration-300 hover:border-white/25 focus:outline-none focus-visible:ring-2 focus-visible:ring-[#ff5c71] sm:min-h-[96px]"
                    aria-pressed={active === index}
                  >
                    <motion.span
                      className="absolute inset-x-3 top-3 h-px"
                      style={{ backgroundColor: thread.color }}
                      animate={{ scaleX: isActive ? 1 : 0.34, opacity: isActive ? 1 : 0.35 }}
                      transition={{ type: "spring", stiffness: 260, damping: 24 }}
                    />
                    <span className="mt-4 block font-mono text-[8px] uppercase tracking-[0.22em] text-white/35">
                      {thread.meta}
                    </span>
                    <span
                      className="mt-1 block text-xl uppercase leading-none text-white sm:text-2xl"
                      style={{ fontFamily: "var(--font-Outfit), var(--font-londrina-solid), sans-serif" }}
                    >
                      {thread.title}
                    </span>
                    <span className="mt-2 block h-1.5 w-10 rounded-full opacity-45" style={{ backgroundColor: thread.color }} />
                    <span className="sr-only">
                      {thread.copy}
                    </span>
                    <motion.span
                      className="absolute bottom-3 right-3 rounded-full border px-2 py-0.5 font-mono text-[9px]"
                      style={{ borderColor: `${thread.color}55`, color: thread.color }}
                      animate={{ y: isActive ? -2 : 0, opacity: isActive ? 1 : 0.5 }}
                    >
                      {thread.value}
                    </motion.span>
                  </button>
                );
              })}
            </div>
          </div>
        </div>

        <aside 
          className="relative overflow-hidden rounded-[6px] border border-white/10 p-4 sm:p-5"
          style={{ backgroundColor: cardBgRight }}
        >
          <div className="absolute inset-0 bg-[radial-gradient(circle_at_70%_20%,rgba(127,255,94,0.14),transparent_32%),radial-gradient(circle_at_20%_80%,rgba(255,92,113,0.18),transparent_38%)]" />
          <div className="relative z-10 flex h-full min-h-fit flex-col md:min-h-[380px]">
            <div className="flex items-center justify-between border-b border-white/10 pb-4">
              <span className="font-mono text-[10px] uppercase tracking-[0.24em] text-white/35">
                {lensLabel}
              </span>
              <span
                className="h-2 w-2 rounded-full shadow-[0_0_20px_currentColor]"
                style={{ color: activeThread.color, backgroundColor: activeThread.color }}
              />
            </div>

            <div className="relative mt-5 flex flex-1 items-center justify-center">
              <motion.div
                className="absolute h-28 w-28 rounded-full border border-white/10 bg-white/[0.035] backdrop-blur-md md:h-44 md:w-44"
                style={{
                  x: lensX,
                  y: lensY,
                  boxShadow: `0 0 80px ${activeThread.color}22`,
                }}
              />
              <AnimatePresence mode="wait">
                <motion.div
                  key={activeThread.id}
                  initial={{ opacity: 0, y: 22, rotate: -3, filter: "blur(10px)" }}
                  animate={{ opacity: 1, y: 0, rotate: 0, filter: "blur(0px)" }}
                  exit={{ opacity: 0, y: -18, rotate: 3, filter: "blur(10px)" }}
                  transition={{ type: "spring", stiffness: 220, damping: 24 }}
                  className="relative w-full max-w-none md:max-w-[290px] rounded-[8px] border border-white/12 bg-black/52 p-4 backdrop-blur-2xl sm:p-5"
                >
                  <div
                    className="absolute -inset-px rounded-[8px] opacity-70"
                    style={{
                      background: `linear-gradient(135deg, ${activeThread.color}44, transparent 30%, rgba(255,255,255,0.08) 64%, ${activeThread.color}22)`,
                    }}
                  />
                  <div className="relative">
                    <p className="font-mono text-[10px] uppercase tracking-[0.24em] text-white/40">
                      {currentThreadLabel}
                    </p>
                    <h4
                      className="mt-2 text-5xl uppercase leading-none sm:text-6xl"
                      style={{ fontFamily: "var(--font-Outfit), var(--font-londrina-solid), sans-serif", color: activeThread.color }}
                    >
                      {activeThread.title}
                    </h4>
                    <p className="mt-3 font-mono text-[11px] leading-relaxed text-white/55 sm:text-xs">
                      {activeThread.copy}
                    </p>
                    <div className="mt-4 grid grid-cols-3 gap-2 sm:mt-5">
                      {(activeThread.metrics || [
                        { label: metricLabel1, value: activeThread.value },
                        { label: metricLabel2, value: "78%" },
                        { label: metricLabel3, value: "94%" }
                      ]).map((m, index) => (
                        <div
                          key={index}
                          className="rounded-[5px] border border-white/10 bg-white/[0.04] p-2"
                        >
                          <span className="block font-mono text-[8px] uppercase tracking-[0.18em] text-white/30">
                            {m.label}
                          </span>
                          <span className="mt-1 block font-mono text-[10px] text-white/70">
                            {m.value}
                          </span>
                        </div>
                      ))}
                    </div>
                  </div>
                </motion.div>
              </AnimatePresence>
            </div>

            <div className="mt-5 flex items-center justify-between border-t border-white/10 pt-4 font-mono text-[10px] uppercase tracking-[0.2em] text-white/35">
              <span>{hoverHint}</span>
              <span>{clickHint}</span>
            </div>
          </div>
        </aside>
      </motion.div>
    </motion.section>
  );
}
