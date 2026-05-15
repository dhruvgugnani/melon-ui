"use client";

import { useRef, useCallback } from "react";
import gsap from "gsap";

const DRIP_TEXT = "MELON";

export function MelonDripText() {
  const charRefs = useRef<(HTMLSpanElement | null)[]>([]);

  const handleEnter = useCallback(() => {
    charRefs.current.forEach((el, i) => {
      if (!el) return;
      gsap.to(el, {
        y: 12 + Math.random() * 16,
        skewX: (Math.random() - 0.5) * 20,
        color: "#7fff5e",
        duration: 0.4 + i * 0.06,
        ease: "power3.in",
        delay: i * 0.04,
      });
    });
  }, []);

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
      {DRIP_TEXT.split("").map((char, i) => (
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
