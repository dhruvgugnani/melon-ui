"use client";

import { useEffect, useRef } from "react";
import gsap from "gsap";

const COMPONENTS = [
  { name: "Burst Button", tag: "GSAP", color: "#ff5c71", note: "Physics seeds on click" },
  { name: "Particle Field", tag: "Three.js", color: "#7fff5e", note: "Mouse-reactive cloud" },
  { name: "Magnetic Nav", tag: "GSAP", color: "#e8d5b7", note: "Elastic spring links" },
  { name: "Flip Card", tag: "CSS 3D", color: "#ff5c71", note: "preserve-3d rotate" },
  { name: "Scramble Text", tag: "GSAP", color: "#7fff5e", note: "Glyph randomizer" },
  { name: "Peel Card", tag: "GSAP", color: "#e8d5b7", note: "ScaleY reveal" },
];

export function ShowcaseSection() {
  const rowRefs = useRef<(HTMLDivElement | null)[]>([]);
  const headRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    const ctx = gsap.context(() => {
      gsap.from(headRef.current, {
        x: -60,
        opacity: 0,
        duration: 0.7,
        ease: "power3.out",
        scrollTrigger: undefined,
      });
      rowRefs.current.forEach((el, i) => {
        if (!el) return;
        gsap.from(el, {
          x: i % 2 === 0 ? -40 : 40,
          opacity: 0,
          duration: 0.6,
          delay: 0.08 * i,
          ease: "power2.out",
        });
      });
    });
    return () => ctx.revert();
  }, []);

  return (
    <section
      id="showcase-section"
      className="snap-start relative w-full h-screen z-10 flex flex-col justify-center overflow-hidden"
      style={{ scrollSnapStop: "always" }}
    >
      {/* Big rotated background label */}
      <span
        className="absolute -right-24 top-1/2 -translate-y-1/2 text-[20vw] font-black uppercase text-white/[0.02] select-none pointer-events-none leading-none"
        style={{ fontFamily: "var(--font-anton)", rotate: "90deg", transformOrigin: "center" }}
        aria-hidden
      >
        COMPONENTS
      </span>

      <div className="relative z-10 w-full max-w-7xl mx-auto px-8">
        {/* Header row */}
        <div ref={headRef} className="flex items-baseline justify-between mb-10 border-b border-white/5 pb-6">
          <h2
            className="text-[clamp(2.5rem,7vw,6rem)] font-black uppercase leading-none tracking-tighter"
            style={{ fontFamily: "var(--font-londrina-solid)" }}
          >
            <span className="text-white">What&apos;s</span>{" "}
            <span className="text-[#ff5c71]">Inside</span>
          </h2>
          <span className="font-mono text-xs text-white/20 uppercase tracking-[0.25em] hidden md:block">
            {COMPONENTS.length} featured
          </span>
        </div>

        {/* Component list — editorial table style */}
        <div className="flex flex-col gap-0">
          {COMPONENTS.map((comp, i) => (
            <div
              key={comp.name}
              ref={(el) => { rowRefs.current[i] = el; }}
              className="group flex items-center justify-between py-4 border-b border-white/[0.04] hover:border-white/10 transition-colors cursor-default"
            >
              {/* Index + name */}
              <div className="flex items-center gap-5">
                <span className="font-mono text-[10px] text-white/15 w-6 tabular-nums">
                  {String(i + 1).padStart(2, "0")}
                </span>
                <span
                  className="text-lg md:text-2xl font-black uppercase tracking-tight text-white group-hover:text-[#ff5c71] transition-colors"
                  style={{ fontFamily: "var(--font-anton)" }}
                >
                  {comp.name}
                </span>
              </div>

              {/* Note + tag */}
              <div className="flex items-center gap-6">
                <span className="font-mono text-xs text-white/20 hidden md:block">{comp.note}</span>
                <span
                  className="font-mono text-[10px] uppercase tracking-widest px-2.5 py-1 border transition-colors group-hover:text-[#050505] group-hover:bg-current"
                  style={{
                    color: comp.color,
                    borderColor: `${comp.color}30`,
                  }}
                >
                  {comp.tag}
                </span>
              </div>
            </div>
          ))}
        </div>

        {/* CTA row */}
        <div className="mt-8 flex items-center gap-6">
          <a
            href="/community"
            className="font-mono text-xs text-[#ff5c71] uppercase tracking-widest hover:underline"
          >
            Browse all 20+ components →
          </a>
        </div>
      </div>
    </section>
  );
}
