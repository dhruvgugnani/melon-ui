"use client";

import { useRef, useEffect } from "react";
import gsap from "gsap";

export interface VineInputProps {
  placeholder?: string;
  glowColor?: string;
  growSpeed?: number;
}

export function VineInput({
  placeholder = "e.g. Farmer Joe",
  glowColor = "#7fff5e",
  growSpeed = 1.0,
}: VineInputProps) {
  const wrapperRef = useRef<HTMLDivElement>(null);
  const svgRef = useRef<SVGPathElement>(null);
  const inputRef = useRef<HTMLInputElement>(null);

  useEffect(() => {
    const path = svgRef.current;
    if (!path) return;

    const len = path.getTotalLength();
    gsap.set(path, {
      strokeDasharray: len,
      strokeDashoffset: len,
    });
  }, []);

  const handleFocus = () => {
    const path = svgRef.current;
    if (!path) return;
    gsap.to(path, {
      strokeDashoffset: 0,
      duration: 0.7 / growSpeed,
      ease: "power3.out",
    });
  };

  const handleBlur = () => {
    const path = svgRef.current;
    if (!path) return;
    const len = path.getTotalLength();
    gsap.to(path, {
      strokeDashoffset: len,
      duration: 0.5 / growSpeed,
      ease: "power2.in",
    });
  };

  return (
    <div className="flex flex-col gap-6 w-full max-w-sm">
      <label className="font-mono text-xs uppercase tracking-widest text-[#555]">Your Name</label>

      <div ref={wrapperRef} className="relative">
        <input
          ref={inputRef}
          type="text"
          placeholder={placeholder}
          onFocus={handleFocus}
          onBlur={handleBlur}
          className="w-full bg-transparent border-0 border-b border-[#333] px-0 py-3 text-[#f4f4f4] font-mono text-lg placeholder:text-[#333] outline-none"
        />
        {/* SVG vine underline */}
        <svg
          className="absolute bottom-0 left-0 w-full overflow-visible pointer-events-none"
          height="4"
          preserveAspectRatio="none"
          viewBox="0 0 300 4"
        >
          <path
            ref={svgRef}
            d="M0 2 Q 37.5 -2 75 2 Q 112.5 6 150 2 Q 187.5 -2 225 2 Q 262.5 6 300 2"
            fill="none"
            stroke={glowColor}
            strokeWidth="2"
            strokeLinecap="round"
          />
        </svg>

        {/* Leaf icon at end */}
        <span className="absolute right-0 bottom-3 text-lg select-none pointer-events-none">🌿</span>
      </div>

      <p className="font-mono text-xs text-[#444]">Focus the field — watch the vine grow</p>
    </div>
  );
}
