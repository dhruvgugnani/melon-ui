"use client";

import { useEffect, useRef } from "react";
import gsap from "gsap";
import ScrollTrigger from "gsap/ScrollTrigger";

gsap.registerPlugin(ScrollTrigger);

const HARVEST_TEXT = "Every great UI starts as a seed.";

function getScrollParent(el: HTMLElement): HTMLElement | null {
  let parent = el.parentElement;
  while (parent) {
    const { overflowY } = window.getComputedStyle(parent);
    if (overflowY === "auto" || overflowY === "scroll") return parent;
    parent = parent.parentElement;
  }
  return null;
}

export interface HarvestRevealProps {
  text?: string;
  stagger?: number;
  duration?: number;
  blur?: number;
}

export function HarvestReveal({
  text = "Every great UI starts as a seed.",
  stagger = 0.045,
  duration = 0.65,
  blur = 6,
}: HarvestRevealProps) {
  const containerRef = useRef<HTMLDivElement>(null);
  const charsRef = useRef<(HTMLSpanElement | null)[]>([]);

  const runAnimation = () => {
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
    <div className="w-full flex flex-col">
      {/* Spacer above so user has to scroll down to trigger */}
      <div className="h-44 flex items-end justify-center pb-6">
        <p className="font-mono text-[9px] uppercase tracking-widest text-[#555] flex items-center gap-2">
          <svg width="12" height="12" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
            <path d="M12 5v14M5 12l7 7 7-7" />
          </svg>
          Scroll down or click text to replay
        </p>
      </div>

      {/* The reveal target */}
      <div 
        ref={containerRef} 
        onClick={runAnimation}
        className="py-10 px-6 flex flex-col items-center gap-6 border-t border-[#111] cursor-pointer hover:bg-white/[0.01] transition-all duration-200"
      >
        <p
          className="text-3xl md:text-4xl font-black uppercase tracking-tight text-center leading-tight select-none"
          style={{ fontFamily: "var(--font-anton)" }}
        >
          {chars.map((char, i) => (
            <span
              key={i}
              ref={(el) => { charsRef.current[i] = el; }}
              className={`inline-block ${
                char === " "
                  ? "w-3"
                  : i % 3 === 0
                  ? "text-[#ff5c71]"
                  : i % 3 === 1
                  ? "text-[#f4f4f4]"
                  : "text-[#7fff5e]"
              }`}
            >
              {char === " " ? "\u00A0" : char}
            </span>
          ))}
        </p>

        <div className="flex gap-2 items-center">
          <div className="h-px w-10 bg-[#ff5c71]" />
          <span className="text-[#ff5c71] text-base select-none">🌱</span>
          <div className="h-px w-10 bg-[#ff5c71]" />
        </div>
      </div>

      {/* Spacer below so scroll feels natural */}
      <div className="h-24" />
    </div>
  );
}
