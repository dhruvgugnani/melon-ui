"use client";

import { useRef, useCallback } from "react";
import gsap from "gsap";

export interface MelonDripTextProps {
  text?: string;
  stagger?: number;
  yOffset?: number;
}

export function MelonDripText({
  text = "MELON",
  stagger = 0.04,
  yOffset = 16,
}: MelonDripTextProps) {
  const charRefs = useRef<(HTMLSpanElement | null)[]>([]);

  const handleEnter = useCallback(() => {
    charRefs.current.forEach((el, i) => {
      if (!el) return;
      gsap.to(el, {
        y: 12 + Math.random() * yOffset,
        skewX: (Math.random() - 0.5) * 20,
        color: "#7fff5e",
        duration: 0.4 + i * stagger,
        ease: "power3.in",
        delay: i * stagger,
      });
    });
  }, [yOffset, stagger]);

  const handleLeave = useCallback(() => {
    charRefs.current.forEach((el, i) => {
      if (!el) return;
      gsap.to(el, {
        y: 0,
        skewX: 0,
        color: "#ff5c71",
        duration: 0.8,
        ease: "elastic.out(1,0.3)",
        delay: i * 0.03,
      });
    });
  }, []);

  return (
    <div
      className="cursor-pointer select-none flex items-center"
      onMouseEnter={handleEnter}
      onMouseLeave={handleLeave}
    >
      {text.split("").map((char, i) => (
        <span
          key={i}
          ref={(el) => { charRefs.current[i] = el; }}
          className="inline-block text-7xl font-black tracking-tight"
          style={{
            fontFamily: "var(--font-londrina-solid)",
            color: "#ff5c71",
            willChange: "transform",
          }}
        >
          {char}
        </span>
      ))}
    </div>
  );
}
