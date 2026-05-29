"use client";

import { useRef, useCallback } from "react";

const CHARS = "ABCDEFGHIJKLMNOPQRSTUVWXYZ0123456789!@#$%";

export interface ScrambleTextProps extends React.ComponentPropsWithoutRef<"div"> {
  text?: string;
  glyphs?: string;
  label?: string;
  speed?: number;
  fontSize?: string;
  textColor?: string;
  hoverTextColor?: string;
  labelColor?: string;
}

export function ScrambleText({
  text = "SCRAMBLE",
  glyphs = CHARS,
  label = "Hover to scramble",
  speed = 35,
  fontSize = "text-6xl",
  textColor = "#f4f4f4",
  hoverTextColor = "#ff5c71",
  labelColor = "#444",
  className = "",
  style,
  ...props
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
  }, [glyphs, speed, text]);

  const handleKeyDown = (e: React.KeyboardEvent) => {
    if (e.key === "Enter" || e.key === " ") {
      e.preventDefault();
      scramble();
    }
  };

  return (
    <div
      role="button"
      tabIndex={0}
      className={`flex flex-col items-center gap-6 cursor-pointer group focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-[#ff5c71] ${className}`}
      onMouseEnter={scramble}
      onFocus={scramble}
      onKeyDown={handleKeyDown}
      style={style}
      {...props}
    >
      <span
        ref={textRef}
        className={`font-black tracking-tighter transition-colors duration-300 ${fontSize}`}
        style={{
          fontFamily: "var(--font-anton)",
          minWidth: "8ch",
          textAlign: "center",
          color: textColor,
          "--hover-color": hoverTextColor,
        } as React.CSSProperties}
        onMouseEnter={(e) => {
          e.currentTarget.style.color = hoverTextColor;
        }}
        onMouseLeave={(e) => {
          e.currentTarget.style.color = textColor;
        }}
      >
        {text}
      </span>
      {label && (
        <span className="font-mono text-[10px] uppercase tracking-widest" style={{ color: labelColor }}>
          {label}
        </span>
      )}
    </div>
  );
}
