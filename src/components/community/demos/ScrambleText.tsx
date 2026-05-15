"use client";

import { useRef, useCallback } from "react";
import gsap from "gsap";

const CHARS = "ABCDEFGHIJKLMNOPQRSTUVWXYZ0123456789!@#$%";

export function ScrambleText() {
  const textRef = useRef<HTMLSpanElement>(null);
  const originalText = "SCRAMBLE";
  const intervalRef = useRef<ReturnType<typeof setInterval> | null>(null);
  const isRunning = useRef(false);

  const scramble = useCallback(() => {
    if (isRunning.current || !textRef.current) return;
    isRunning.current = true;

    let iterations = 0;
    const maxIter = originalText.length * 5;

    intervalRef.current = setInterval(() => {
      if (!textRef.current) return;
      iterations++;

      textRef.current.textContent = originalText
        .split("")
        .map((char, i) => {
          if (char === " ") return " ";
          const resolveAt = Math.floor((i / originalText.length) * maxIter);
          if (iterations > resolveAt) return char;
          return CHARS[Math.floor(Math.random() * CHARS.length)];
        })
        .join("");

      if (iterations >= maxIter) {
        clearInterval(intervalRef.current!);
        if (textRef.current) textRef.current.textContent = originalText;
        isRunning.current = false;
      }
    }, 35);
  }, []);

  return (
    <div
      className="flex flex-col items-center gap-6 cursor-pointer group"
      onMouseEnter={scramble}
    >
      <span
        ref={textRef}
        className="font-black text-6xl text-[#f4f4f4] tracking-tighter group-hover:text-[#ff5c71] transition-colors duration-300"
        style={{ fontFamily: "var(--font-anton)", minWidth: "8ch", textAlign: "center" }}
      >
        {originalText}
      </span>
      <span className="font-mono text-[10px] uppercase tracking-widest text-[#444]">
        Hover to scramble
      </span>
    </div>
  );
}
