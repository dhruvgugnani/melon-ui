"use client";

import { useEffect, useRef } from "react";
import gsap from "gsap";
import ScrollTrigger from "gsap/ScrollTrigger";

gsap.registerPlugin(ScrollTrigger);

function getScrollParent(el: HTMLElement): HTMLElement | null {
  let parent = el.parentElement;
  while (parent) {
    const { overflowY } = window.getComputedStyle(parent);
    if (overflowY === "auto" || overflowY === "scroll") return parent;
    parent = parent.parentElement;
  }
  return null;
}

export interface HarvestRevealProps extends React.ComponentPropsWithoutRef<"div"> {
  text?: string;
  stagger?: number;
  duration?: number;
  blur?: number;
  fontSize?: string;
  showSpacers?: boolean;
  showDecoration?: boolean;
  colorPattern?: string[]; // Custom color list pattern
  decorColor?: string;
}

export function HarvestReveal({
  text = "Every great UI starts as a seed.",
  stagger = 0.045,
  duration = 0.65,
  blur = 6,
  fontSize = "text-3xl md:text-4xl",
  showSpacers = false,
  showDecoration = false,
  colorPattern = ["#ff5c71", "#f4f4f4", "#7fff5e"],
  decorColor = "#ff5c71",
  className = "",
  style,
  ...props
}: HarvestRevealProps) {
  const containerRef = useRef<HTMLDivElement>(null);
  const charsRef = useRef<(HTMLSpanElement | null)[]>([]);

  const runAnimation = () => {
    const prefersReducedMotion = window.matchMedia("(prefers-reduced-motion: reduce)").matches;
    if (prefersReducedMotion) return;

    const chars = charsRef.current.filter(Boolean);
    gsap.killTweensOf(chars);
    gsap.set(chars, { opacity: 0, y: 24, filter: `blur(${blur}px)` });
    gsap.to(chars, {
      opacity: 1,
      y: 0,
      filter: "blur(0px)",
      duration: duration,
      stagger: stagger,
      ease: "power2.out",
    });
  };

  useEffect(() => {
    if (!containerRef.current) return;

    const prefersReducedMotion = window.matchMedia("(prefers-reduced-motion: reduce)").matches;
    if (prefersReducedMotion) {
      const chars = charsRef.current.filter(Boolean);
      gsap.set(chars, { opacity: 1, y: 0, filter: "none" });
      return;
    }

    const scroller = getScrollParent(containerRef.current) ?? undefined;

    const ctx = gsap.context(() => {
      const chars = charsRef.current.filter(Boolean);
      gsap.set(chars, { opacity: 0, y: 24, filter: `blur(${blur}px)` });

      gsap.to(chars, {
        opacity: 1,
        y: 0,
        filter: "blur(0px)",
        duration: duration,
        stagger: stagger,
        ease: "power2.out",
        scrollTrigger: {
          trigger: containerRef.current,
          scroller: scroller,
          start: "top 85%",
          toggleActions: "play reset play reset",
        },
      });
    }, containerRef);

    return () => ctx.revert();
  }, [stagger, duration, blur, text]);

  const chars = text.split("");

  return (
    <div className="w-full flex flex-col items-center justify-center bg-transparent">
      {/* Spacer above */}
      {showSpacers && (
        <div className="h-24 flex items-end justify-center pb-6">
          <p className="font-mono text-[9px] uppercase tracking-widest text-[#555] flex items-center gap-2">
            <svg width="12" height="12" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
              <path d="M12 5v14M5 12l7 7 7-7" />
            </svg>
            Scroll down or click text to replay
          </p>
        </div>
      )}

      {/* The reveal target */}
      <div 
        ref={containerRef} 
        onClick={runAnimation}
        className={`py-6 px-4 flex flex-col items-center gap-6 cursor-pointer transition-all duration-200 ${className}`}
        style={style}
        {...props}
      >
        <p
          className={`font-black uppercase tracking-tight text-center leading-tight select-none ${fontSize}`}
          style={{ fontFamily: "var(--font-anton)" }}
        >
          {chars.map((char, i) => {
            const charColor = char === " " 
              ? "transparent" 
              : colorPattern[i % colorPattern.length];
            return (
              <span
                key={i}
                ref={(el) => { charsRef.current[i] = el; }}
                className="inline-block"
                style={{
                  color: charColor,
                  marginRight: char === " " ? "0.25em" : "0",
                  willChange: "transform, opacity, filter"
                }}
              >
                {char === " " ? "\u00A0" : char}
              </span>
            );
          })}
        </p>

        {showDecoration && (
          <div className="flex gap-2 items-center">
            <div className="h-px w-10" style={{ backgroundColor: decorColor }} />
            <span className="text-base select-none" style={{ color: decorColor }}>🌱</span>
            <div className="h-px w-10" style={{ backgroundColor: decorColor }} />
          </div>
        )}
      </div>

      {/* Spacer below */}
      {showSpacers && <div className="h-12" />}
    </div>
  );
}
