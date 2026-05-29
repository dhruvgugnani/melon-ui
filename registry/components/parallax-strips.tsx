"use client";

import { useEffect, useRef } from "react";
import gsap from "gsap";
import ScrollTrigger from "gsap/ScrollTrigger";

gsap.registerPlugin(ScrollTrigger);

const STRIPS = [
  { text: "GSAP", depth: 1, speed: -0.3 },
  { text: "THREE.JS", depth: 2, speed: 0.5 },
  { text: "REACT", depth: 1.5, speed: -0.2 },
  { text: "NEXT.JS", depth: 3, speed: 0.7 },
  { text: "MELON", depth: 2, speed: -0.4 },
];

export function ParallaxStrips() {
  const containerRef = useRef<HTMLDivElement>(null);
  const stripRefs = useRef<(HTMLDivElement | null)[]>([]);

  useEffect(() => {
    if (!containerRef.current) return;
    const prefersReducedMotion = window.matchMedia("(prefers-reduced-motion: reduce)").matches;
    if (prefersReducedMotion) return;

    const wrapper = document.querySelector("[data-lenis-wrapper]");

    const ctx = gsap.context(() => {
      stripRefs.current.forEach((strip, i) => {
        if (!strip) return;
        gsap.to(strip, {
          x: STRIPS[i].speed * 120,
          ease: "none",
          scrollTrigger: {
            trigger: containerRef.current,
            scroller: wrapper || undefined,
            start: "top bottom",
            end: "bottom top",
            scrub: true,
          },
        });
      });
    }, containerRef);

    return () => ctx.revert();
  }, []);

  return (
    <div
      ref={containerRef}
      className="w-full overflow-hidden flex flex-col gap-4 py-8 select-none"
    >
      {STRIPS.map((strip, i) => (
        <div
          key={strip.text}
          ref={(el) => { stripRefs.current[i] = el; }}
          className="whitespace-nowrap"
          style={{ fontSize: `${22 + strip.depth * 8}px`, opacity: 1 / strip.depth + 0.2 }}
        >
          {Array.from({ length: 8 }).map((_, j) => (
            <span
              key={j}
              className="font-black uppercase tracking-tighter mr-8"
              style={{
                fontFamily: "var(--font-anton)",
                color: i % 2 === 0 ? "#ff5c71" : "#1e1e1e",
                WebkitTextStroke: i % 2 !== 0 ? "1px #333" : undefined,
              }}
            >
              {strip.text}
            </span>
          ))}
        </div>
      ))}
    </div>
  );
}
