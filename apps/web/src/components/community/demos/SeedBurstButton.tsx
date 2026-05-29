"use client";

import { useRef, useState } from "react";
import gsap from "gsap";

// Seed shape as a small SVG
function Seed({ style, fill, stroke }: { style?: React.CSSProperties; fill: string; stroke: string }) {
  return (
    <svg
      width="8"
      height="14"
      viewBox="0 0 8 14"
      style={style}
      className="absolute pointer-events-none"
    >
      <ellipse cx="4" cy="7" rx="3.5" ry="6" fill={fill} stroke={stroke} strokeWidth="1" />
    </svg>
  );
}

export interface SeedBurstButtonProps extends React.ComponentPropsWithoutRef<"div"> {
  label?: string;
  count?: number;
  gravity?: number;
  seedColor?: string;
  seedStrokeColor?: string;
  buttonColor?: string;
  buttonTextColor?: string;
  stripeColor?: string;
  juiceColor?: string;
  buttonClassName?: string;
  buttonStyle?: React.CSSProperties;
}

export function SeedBurstButton({
  label = "Click Me",
  count = 12,
  gravity = 0.6,
  seedColor = "#1a1a1a",
  seedStrokeColor = "#ff5c71",
  buttonColor = "#ff5c71",
  buttonTextColor = "#050505",
  stripeColor = "#7fff5e",
  juiceColor = "#e8d5b7",
  buttonClassName = "",
  buttonStyle,
  className = "",
  style,
  ...props
}: SeedBurstButtonProps) {
  const btnRef = useRef<HTMLButtonElement>(null);
  const seedsRef = useRef<(HTMLDivElement | null)[]>([]);
  const [active, setActive] = useState(false);

  const handleClick = (e: React.MouseEvent<HTMLButtonElement>) => {
    if (!btnRef.current) return;
    setActive(true);

    const rect = btnRef.current.getBoundingClientRect();
    const originX = e.clientX - rect.left;
    const originY = e.clientY - rect.top;

    seedsRef.current.forEach((seed, i) => {
      if (!seed) return;
      const angle = (i / count) * Math.PI * 2;
      const dist = 60 + Math.random() * 60;
      const dx = Math.cos(angle) * dist;
      const dy = Math.sin(angle) * dist + (gravity * 50);

      gsap.set(seed, {
        x: originX,
        y: originY,
        opacity: 1,
        scale: 0.5 + Math.random() * 0.8,
        rotation: Math.random() * 360,
      });

      gsap.to(seed, {
        x: originX + dx,
        y: originY + dy,
        opacity: 0,
        scale: 0,
        rotation: `+=${180 + Math.random() * 360}`,
        duration: 0.8 + Math.random() * 0.4,
        ease: "power2.out",
        onComplete: () => setActive(false),
      });
    });
  };

  return (
    <div
      className={`relative flex items-center justify-center overflow-visible ${className}`}
      style={style}
      {...props}
    >
      {/* Seeds overlay */}
      {Array.from({ length: count }).map((_, i) => (
        <div
          key={i}
          ref={(el) => { seedsRef.current[i] = el; }}
          className="absolute opacity-0 pointer-events-none"
          style={{ left: 0, top: 0 }}
        >
          <Seed fill={seedColor} stroke={seedStrokeColor} />
        </div>
      ))}

      <button
        ref={btnRef}
        onClick={handleClick}
        className={`relative px-10 py-4 font-black uppercase tracking-widest text-lg overflow-hidden transition-transform active:scale-95 select-none ${buttonClassName}`}
        style={{
          fontFamily: "var(--font-anton)",
          backgroundColor: buttonColor,
          color: buttonTextColor,
          ...buttonStyle,
        }}
      >
        {/* Rind stripe */}
        <span className="absolute inset-x-0 bottom-0 h-1.5" style={{ backgroundColor: stripeColor }} />
        <span className="relative z-10">{label}</span>

        {/* Juice burst overlay */}
        <span
          className={`absolute inset-0 transition-opacity duration-150 ${active ? "opacity-20" : "opacity-0"}`}
          style={{ backgroundColor: juiceColor }}
        />
      </button>
    </div>
  );
}
