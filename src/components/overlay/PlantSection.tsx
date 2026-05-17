"use client";

import { useRef, useState } from "react";
import gsap from "gsap";
import Link from "next/link";

const STEPS = [
  {
    num: "01",
    title: "Browse the store",
    body: "Find a component from 20+ GSAP-powered, Three.js-infused pieces in our community store.",
    color: "#ff5c71",
  },
  {
    num: "02",
    title: "Copy the code",
    body: "Hit the Code tab — the source opens with a single copy button. No npm maze.",
    color: "#7fff5e",
  },
  {
    num: "03",
    title: "Paste & tweak",
    body: "Drop it in your project. Change colors, speeds, sizes. Every prop is documented inline.",
    color: "#e8d5b7",
  },
];

export function PlantSection() {
  const [active, setActive] = useState(0);
  const barRef = useRef<HTMLDivElement>(null);

  const go = (i: number) => {
    setActive(i);
    gsap.to(barRef.current, {
      height: `${((i + 1) / STEPS.length) * 100}%`,
      duration: 0.5,
      ease: "power3.out",
    });
  };

  return (
    <section
      id="plant-section"
      className="snap-start relative w-full h-screen z-10 flex items-center overflow-hidden"
      style={{ scrollSnapStop: "always" }}
    >
      {/* Huge background number */}
      <span
        className="absolute right-8 bottom-8 font-black text-[28vw] text-white/[0.015] select-none pointer-events-none leading-none"
        style={{ fontFamily: "var(--font-anton)" }}
        aria-hidden
      >
        {STEPS[active].num}
      </span>

      <div className="relative z-10 w-full max-w-7xl mx-auto px-8 grid grid-cols-1 md:grid-cols-[auto_1fr] gap-12 items-center">

        {/* LEFT: vertical progress bar + step numbers */}
        <div className="flex flex-col items-center gap-0 select-none">
          <div className="relative w-px h-48 bg-white/8">
            <div
              ref={barRef}
              className="absolute top-0 left-0 w-full bg-[#ff5c71] origin-top"
              style={{ height: "33%" }}
            />
          </div>
          <div className="flex flex-col gap-4 mt-4">
            {STEPS.map((s, i) => (
              <button
                key={s.num}
                onClick={() => go(i)}
                className={`font-mono text-xs transition-all ${
                  active === i ? "text-[#ff5c71] scale-110" : "text-white/20 hover:text-white/50"
                }`}
              >
                {s.num}
              </button>
            ))}
          </div>
        </div>

        {/* RIGHT: Content */}
        <div className="flex flex-col gap-6 max-w-xl">
          <div>
            <span className="font-mono text-[10px] text-white/20 uppercase tracking-[0.3em]">
              How to use
            </span>
            <h2
              className="text-[clamp(2.5rem,6vw,5.5rem)] font-black uppercase leading-[0.88] tracking-tighter mt-2"
              style={{ fontFamily: "var(--font-londrina-solid)" }}
            >
              <span className="text-white">Three</span>
              <br />
              <span style={{ color: STEPS[active].color }}>Steps</span>
            </h2>
          </div>

          {/* Animated step card */}
          <div
            key={active}
            className="border-l-2 pl-6 py-2"
            style={{ borderColor: STEPS[active].color }}
          >
            <p
              className="font-black text-2xl md:text-3xl uppercase tracking-tight text-white mb-2"
              style={{ fontFamily: "var(--font-anton)" }}
            >
              {STEPS[active].title}
            </p>
            <p className="font-mono text-sm text-white/40 leading-relaxed">
              {STEPS[active].body}
            </p>
          </div>

          <div className="flex items-center gap-4 pt-2">
            <Link
              href="/community"
              className="px-6 py-3 bg-[#ff5c71] text-[#050505] font-black uppercase tracking-widest text-xs hover:bg-white transition-colors"
              style={{ fontFamily: "var(--font-anton)" }}
            >
              Open Store →
            </Link>
            <button
              onClick={() => go((active + 1) % STEPS.length)}
              className="font-mono text-xs text-white/30 uppercase tracking-widest hover:text-white/60 transition-colors"
            >
              Next step ↓
            </button>
          </div>
        </div>
      </div>
    </section>
  );
}
