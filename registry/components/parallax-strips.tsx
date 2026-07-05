"use client";

import { useEffect, useRef } from "react";
import gsap from "gsap";
import ScrollTrigger from "gsap/ScrollTrigger";

gsap.registerPlugin(ScrollTrigger);

export interface StripItem {
  text: string;
  depth: number;
  speed: number;
}

const DEFAULT_STRIPS: StripItem[] = [
  { text: "GSAP", depth: 1, speed: -0.3 },
  { text: "THREE.JS", depth: 2, speed: 0.5 },
  { text: "REACT", depth: 1.5, speed: -0.2 },
  { text: "NEXT.JS", depth: 3, speed: 0.7 },
  { text: "MELON", depth: 2, speed: -0.4 },
];

export interface ParallaxStripsProps extends React.ComponentPropsWithoutRef<"div"> {
  strips?: StripItem[];
  primaryColor?: string;
  secondaryColor?: string;
  strokeColor?: string;
  fontFamily?: string;
}

export function ParallaxStrips({
  strips = DEFAULT_STRIPS,
  primaryColor = "#ff5c71",
  secondaryColor = "#1e1e1e",
  strokeColor = "#333",
  fontFamily = "var(--font-anton)",
  className = "",
  style,
  ...props
}: ParallaxStripsProps) {
  const containerRef = useRef<HTMLDivElement>(null);
  const stripRefs = useRef<(HTMLDivElement | null)[]>([]);

  useEffect(() => {
    if (!containerRef.current) return;
    const prefersReducedMotion = typeof window !== "undefined" && window.matchMedia("(prefers-reduced-motion: reduce)").matches;
    if (prefersReducedMotion) return;

    const ctx = gsap.context(() => {
      stripRefs.current.forEach((strip, i) => {
        if (!strip || !strips[i]) return;
        gsap.to(strip, {
          x: strips[i].speed * 120,
          ease: "none",
          scrollTrigger: {
            trigger: containerRef.current,
            start: "top bottom",
            end: "bottom top",
            scrub: true,
          },
        });
      });
    }, containerRef);

    return () => ctx.revert();
  }, [strips]);

  return (
    <div
      ref={containerRef}
      className={`w-full overflow-hidden flex flex-col gap-4 py-8 select-none ${className}`}
      style={style}
      {...props}
    >
      {strips.map((strip, i) => (
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
                fontFamily: fontFamily,
                color: i % 2 === 0 ? primaryColor : secondaryColor,
                WebkitTextStroke: i % 2 !== 0 ? `1px ${strokeColor}` : undefined,
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
