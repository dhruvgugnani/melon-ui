"use client";

import { useRef } from "react";
import gsap from "gsap";

const STATS = [
  { value: "20+", label: "Components", accent: "#ff5c71" },
  { value: "60fps", label: "Animations", accent: "#7fff5e" },
  { value: "0", label: "Dependencies*", accent: "#e8d5b7" },
  { value: "∞", label: "Customizable", accent: "#ff5c71" },
];

const PRINCIPLES = [
  ["Copy-paste ready", "No build step required"],
  ["GSAP spring physics", "Real elastic motion"],
  ["React Three Fiber", "WebGL when needed"],
  ["Dark-first palette", "Melon accent system"],
];

export function FeaturesSection() {
  const hoverRefs = useRef<(HTMLDivElement | null)[]>([]);

  const onEnter = (i: number) => {
    if (!hoverRefs.current[i]) return;
    gsap.to(hoverRefs.current[i], {
      scaleX: 1,
      duration: 0.4,
      ease: "power3.out",
    });
  };
  const onLeave = (i: number) => {
    if (!hoverRefs.current[i]) return;
    gsap.to(hoverRefs.current[i], {
      scaleX: 0,
      duration: 0.3,
      ease: "power2.in",
    });
  };

  return (
    <section
      id="features-section"
      className="snap-start relative w-full h-screen z-10 flex flex-col justify-center overflow-hidden"
      style={{ scrollSnapStop: "always" }}
    >
      <div className="w-full max-w-7xl mx-auto px-8 grid grid-cols-1 md:grid-cols-2 gap-0 h-full items-center">

        {/* LEFT — Stats block */}
        <div className="flex flex-col justify-center gap-0 border-r border-white/5 pr-16">
          <h2
            className="text-[clamp(2rem,5vw,4.5rem)] font-black uppercase leading-none tracking-tighter mb-10"
            style={{ fontFamily: "var(--font-londrina-solid)" }}
          >
            <span className="text-white/20">Why</span>{" "}
            <span className="text-[#7fff5e]">Melon</span>
          </h2>

          <div className="grid grid-cols-2 gap-px bg-white/[0.04]">
            {STATS.map((stat) => (
              <div key={stat.label} className="bg-[#050505] p-6 flex flex-col gap-1">
                <span
                  className="font-black text-4xl md:text-5xl leading-none"
                  style={{ fontFamily: "var(--font-anton)", color: stat.accent }}
                >
                  {stat.value}
                </span>
                <span className="font-mono text-[10px] uppercase tracking-[0.2em] text-white/30 mt-1">
                  {stat.label}
                </span>
              </div>
            ))}
          </div>
          <p className="font-mono text-[9px] text-white/15 uppercase tracking-widest mt-3">
            *Copy paste, peer dependencies yours to choose
          </p>
        </div>

        {/* RIGHT — Principles list */}
        <div className="flex flex-col justify-center gap-0 pl-16">
          <h3
            className="font-mono text-[10px] uppercase tracking-[0.3em] text-white/25 mb-6"
          >
            Design Principles
          </h3>

          {PRINCIPLES.map(([title, sub], i) => (
            <div
              key={title}
              className="relative group flex items-center justify-between py-5 border-b border-white/[0.04] cursor-default overflow-hidden"
              onMouseEnter={() => onEnter(i)}
              onMouseLeave={() => onLeave(i)}
            >
              {/* Hover fill bar */}
              <div
                ref={(el) => { hoverRefs.current[i] = el; }}
                className="absolute inset-0 bg-[#ff5c71]/5 origin-left"
                style={{ transform: "scaleX(0)" }}
              />

              <div className="relative z-10">
                <p
                  className="font-black text-base md:text-xl uppercase tracking-tight text-white group-hover:text-[#ff5c71] transition-colors"
                  style={{ fontFamily: "var(--font-anton)" }}
                >
                  {title}
                </p>
                <p className="font-mono text-[10px] text-white/25 uppercase tracking-widest mt-0.5">
                  {sub}
                </p>
              </div>

              <span className="relative z-10 font-mono text-[10px] text-white/15 group-hover:text-[#ff5c71] transition-colors">
                {String(i + 1).padStart(2, "0")}
              </span>
            </div>
          ))}
        </div>

      </div>
    </section>
  );
}
