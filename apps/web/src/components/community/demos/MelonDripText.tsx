"use client";

import { useRef, useCallback } from "react";
import gsap from "gsap";

export interface MelonDripTextProps extends React.ComponentPropsWithoutRef<"div"> {
  text?: string;
  color?: string;
  activeColor?: string;
  fontSize?: string;
}

export function MelonDripText({
  text = "MELON",
  color = "#ff5c71",
  activeColor = "#7fff5e",
  fontSize = "text-7xl",
  className = "",
  style,
  ...props
}: MelonDripTextProps) {
  const charRefs = useRef<(HTMLSpanElement | null)[]>([]);

  const handleEnter = useCallback(() => {
    charRefs.current.forEach((el, i) => {
      if (!el) return;
      gsap.to(el, {
        y: 12 + Math.random() * 16,
        skewX: (Math.random() - 0.5) * 20,
        color: activeColor,
        duration: 0.4 + i * 0.06,
        ease: "power3.in",
        delay: i * 0.04,
      });
    });
  }, [activeColor]);

  const handleLeave = useCallback(() => {
    charRefs.current.forEach((el, i) => {
      if (!el) return;
      gsap.to(el, {
        y: 0,
        skewX: 0,
        color,
        duration: 0.8,
        ease: "elastic.out(1,0.3)",
        delay: i * 0.03,
      });
    });
  }, [color]);

  return (
    <div
      className={`cursor-pointer select-none flex items-center ${className}`}
      onMouseEnter={handleEnter}
      onMouseLeave={handleLeave}
      style={style}
      {...props}
    >
      {text.split("").map((char, i) => (
        <span
          key={i}
          ref={(el) => { charRefs.current[i] = el; }}
          className={`inline-block font-black tracking-tight ${fontSize}`}
          style={{
            fontFamily: "var(--font-londrina-solid)",
            color,
            willChange: "transform",
          }}
        >
          {char === " " ? "\u00A0" : char}
        </span>
      ))}
    </div>
  );
}
