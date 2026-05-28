"use client";

import { useRef, useCallback } from "react";

export interface ScrambleTextProps {
  text?: string;
  speed?: number;
  glyphs?: string;
}

export function ScrambleText({
  text = "SCRAMBLE",
  speed = 35,
  glyphs = "ABCDEFGHIJKLMNOPQRSTUVWXYZ0123456789!@#$%",
}: ScrambleTextProps) {
  const textRef = useRef<HTMLSpanElement>(null);
  const intervalRef = useRef<ReturnType<typeof setInterval> | null>(null);
  const isRunning = useRef(false);

  const scramble = useCallback(() => {
    if (isRunning.current || !textRef.current) return;
    isRunning.current = true;

    let iterations = 0;
    const maxIter = text.length * 5;

    intervalRef.current = setInterval(() => {
      if (!textRef.current) return;
      iterations++;

      textRef.current.textContent = text
        .split("")
        .map((char, i) => {
          if (char === " ") return " ";
          const resolveAt = Math.floor((i / text.length) * maxIter);
          if (iterations > resolveAt) return char;
          return glyphs[Math.floor(Math.random() * glyphs.length)];
        })
        .join("");

      if (iterations >= maxIter) {
        clearInterval(intervalRef.current!);
        if (textRef.current) textRef.current.textContent = text;
        isRunning.current = false;
      }
    }, speed);
  }, [text, speed, glyphs]);

  return (
    <div
      key={text}
      className="flex flex-col items-center gap-6 cursor-pointer group"
      onMouseEnter={scramble}
    >
      <span
        ref={textRef}
        className="font-black text-6xl text-[#f4f4f4] tracking-tighter group-hover:text-[#ff5c71] transition-colors duration-300"
        style={{ fontFamily: "var(--font-anton)", minWidth: "8ch", textAlign: "center" }}
      >
        {text}
      </span>
      <span className="font-mono text-[10px] uppercase tracking-widest text-[#444]">
        Hover to scramble
      </span>
    </div>
  );
}
