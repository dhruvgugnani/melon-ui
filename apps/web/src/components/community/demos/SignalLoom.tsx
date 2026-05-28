"use client";

import React, { useMemo, useState } from "react";
import {
  AnimatePresence,
  motion,
  useMotionValue,
  useSpring,
  useTransform,
} from "framer-motion";

const THREADS = [
  {
    id: "brief",
    title: "Brief",
    meta: "Input",
    value: "92%",
    color: "#ff5c71",
    copy: "Collect user intent, constraints, edge states, and the emotional target.",
  },
  {
    id: "taste",
    title: "Taste",
    meta: "Lens",
    value: "Hot",
    color: "#7fff5e",
    copy: "Filter the surface through MelonUI contrast, glass, glow, and tactile motion.",
  },
  {
    id: "ship",
    title: "Ship",
    meta: "Output",
    value: "Live",
    color: "#f7f0d2",
    copy: "Package the interaction as source-first UI with demo, registry metadata, and polish.",
  },
];

const clamp = (value: number, min: number, max: number) => Math.min(Math.max(value, min), max);

export function SignalLoom() {
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

  const activeThread = THREADS[hovered ?? active];
  const pathData = useMemo(() => {
    const center = hovered ?? active;
    return THREADS.map((_, index) => {
      const startX = 22 + index * 28;
      const pull = center === index ? 10 : center > index ? 5 : -5;
      const waist = clamp(startX + pull, 16, 84);
      const lower = clamp(startX - pull * 0.75, 16, 84);
      return `M ${startX} 6 C ${waist} 28, ${waist} 48, ${startX} 56 C ${lower} 70, ${lower} 84, ${startX} 96`;
    });
  }, [active, hovered]);

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
      className="relative flex min-h-[360px] w-full items-center justify-center overflow-hidden bg-[#050505] px-3 py-4 text-white sm:min-h-[440px] sm:px-5"
    >
      <div className="absolute inset-0 bg-[linear-gradient(rgba(255,92,113,0.035)_1px,transparent_1px),linear-gradient(90deg,rgba(127,255,94,0.028)_1px,transparent_1px)] bg-[size:38px_38px]" />
      <motion.div
        className="absolute inset-0 opacity-70"
        style={{
          background: ambientGlow,
        }}
      />
      <div className="absolute inset-0 bg-[radial-gradient(circle_at_50%_110%,rgba(255,92,113,0.18),transparent_42%),radial-gradient(circle_at_10%_0%,rgba(127,255,94,0.14),transparent_34%)]" />

      <motion.div
        className="relative z-10 grid w-full max-w-5xl gap-3 rounded-[8px] border border-white/10 bg-black/45 p-3 shadow-[0_35px_90px_rgba(0,0,0,0.55)] backdrop-blur-2xl md:grid-cols-[1.08fr_0.92fr] md:p-4"
        style={{ rotateX, rotateY, transformPerspective: 1000 }}
        animate={{ scale: pressed ? 0.985 : 1 }}
        transition={{ type: "spring", stiffness: 260, damping: 22 }}
      >
        <div className="pointer-events-none absolute inset-0 rounded-[8px] bg-[linear-gradient(135deg,rgba(255,255,255,0.16),transparent_24%,transparent_72%,rgba(127,255,94,0.13))]" />
        <div className="pointer-events-none absolute inset-[1px] rounded-[7px] border border-white/5" />

        <div className="relative min-h-[320px] overflow-hidden rounded-[6px] border border-white/10 bg-[#080808]/80 p-4 sm:min-h-[380px] sm:p-5">
          <div className="absolute inset-0 bg-[radial-gradient(circle_at_50%_40%,rgba(255,255,255,0.08),transparent_34%)]" />
          <svg
            aria-hidden="true"
            viewBox="0 0 100 100"
            preserveAspectRatio="none"
            className="absolute inset-0 h-full w-full"
          >
            <defs>
              <filter id="loom-glow" x="-60%" y="-60%" width="220%" height="220%">
                <feGaussianBlur stdDeviation="1.2" result="blur" />
                <feMerge>
                  <feMergeNode in="blur" />
                  <feMergeNode in="SourceGraphic" />
                </feMerge>
              </filter>
            </defs>
            {pathData.map((d, index) => {
              const isActive = index === (hovered ?? active);
              return (
                <motion.path
                  key={THREADS[index].id}
                  d={d}
                  fill="none"
                  stroke={THREADS[index].color}
                  strokeLinecap="round"
                  strokeWidth={isActive ? 1.55 : 0.7}
                  strokeDasharray={isActive ? "1 3" : "0"}
                  opacity={isActive ? 0.96 : 0.34}
                  filter="url(#loom-glow)"
                  animate={{ pathLength: isActive ? [0.72, 1, 0.72] : 1 }}
                  transition={{ duration: 3.2, repeat: isActive ? Infinity : 0, ease: "easeInOut" }}
                />
              );
            })}
          </svg>

          <div className="relative z-10 flex h-full min-h-[290px] flex-col justify-between sm:min-h-[340px]">
            <div className="flex items-start justify-between gap-4">
              <div>
                <p className="font-mono text-[10px] uppercase tracking-[0.28em] text-[#ff5c71]">
                  Signal Loom
                </p>
                <h3
                  className="mt-2 max-w-[10ch] text-4xl uppercase leading-[0.82] text-white sm:text-6xl"
                  style={{ fontFamily: "var(--font-londrina-solid)" }}
                >
                  Weave the next action
                </h3>
              </div>
              <div className="rounded-full border border-white/10 bg-white/[0.04] px-3 py-1 font-mono text-[10px] uppercase tracking-[0.22em] text-white/40">
                Live
              </div>
            </div>

            <div className="grid gap-2 sm:grid-cols-3">
              {THREADS.map((thread, index) => {
                const isActive = index === (hovered ?? active);
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
                      style={{ fontFamily: "var(--font-londrina-solid)" }}
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

        <aside className="relative overflow-hidden rounded-[6px] border border-white/10 bg-[#0a0a0a]/82 p-4 sm:p-5">
          <div className="absolute inset-0 bg-[radial-gradient(circle_at_70%_20%,rgba(127,255,94,0.14),transparent_32%),radial-gradient(circle_at_20%_80%,rgba(255,92,113,0.18),transparent_38%)]" />
          <div className="relative z-10 flex h-full min-h-[320px] flex-col sm:min-h-[380px]">
            <div className="flex items-center justify-between border-b border-white/10 pb-4">
              <span className="font-mono text-[10px] uppercase tracking-[0.24em] text-white/35">
                Inspection Lens
              </span>
              <span
                className="h-2 w-2 rounded-full shadow-[0_0_20px_currentColor]"
                style={{ color: activeThread.color, backgroundColor: activeThread.color }}
              />
            </div>

            <div className="relative mt-5 flex flex-1 items-center justify-center">
              <motion.div
                className="absolute h-36 w-36 rounded-full border border-white/10 bg-white/[0.035] backdrop-blur-md sm:h-44 sm:w-44"
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
                  className="relative w-full max-w-[290px] rounded-[8px] border border-white/12 bg-black/52 p-4 backdrop-blur-2xl sm:p-5"
                >
                  <div
                    className="absolute -inset-px rounded-[8px] opacity-70"
                    style={{
                      background: `linear-gradient(135deg, ${activeThread.color}44, transparent 30%, rgba(255,255,255,0.08) 64%, ${activeThread.color}22)`,
                    }}
                  />
                  <div className="relative">
                    <p className="font-mono text-[10px] uppercase tracking-[0.24em] text-white/40">
                      Current Thread
                    </p>
                    <h4
                      className="mt-2 text-5xl uppercase leading-none sm:text-6xl"
                      style={{ fontFamily: "var(--font-londrina-solid)", color: activeThread.color }}
                    >
                      {activeThread.title}
                    </h4>
                    <p className="mt-3 font-mono text-[11px] leading-relaxed text-white/55 sm:text-xs">
                      {activeThread.copy}
                    </p>
                    <div className="mt-4 grid grid-cols-3 gap-2 sm:mt-5">
                      {["Pulse", "Glass", "Drift"].map((label, index) => (
                        <div
                          key={label}
                          className="rounded-[5px] border border-white/10 bg-white/[0.04] p-2"
                        >
                          <span className="block font-mono text-[8px] uppercase tracking-[0.18em] text-white/30">
                            {label}
                          </span>
                          <span className="mt-1 block font-mono text-[10px] text-white/70">
                            {index === 0 ? activeThread.value : `${68 + index * 11}%`}
                          </span>
                        </div>
                      ))}
                    </div>
                  </div>
                </motion.div>
              </AnimatePresence>
            </div>

            <div className="mt-5 flex items-center justify-between border-t border-white/10 pt-4 font-mono text-[10px] uppercase tracking-[0.2em] text-white/35">
              <span>Hover threads</span>
              <span>Click to pin</span>
            </div>
          </div>
        </aside>
      </motion.div>
    </motion.section>
  );
}
