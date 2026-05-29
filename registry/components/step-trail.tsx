"use client";

import { useState, useRef } from "react";
import gsap from "gsap";

const STEPS = ["Harvest", "Slice", "Serve", "Enjoy"];

export interface BreadcrumbTrailProps {
  steps?: string[];
  onChange?: (index: number) => void;
}

export function BreadcrumbTrail({
  steps = STEPS,
  onChange
}: BreadcrumbTrailProps) {
  const [active, setActive] = useState(0);
  const progressRef = useRef<HTMLDivElement>(null);

  const go = (i: number) => {
    setActive(i);
    if (onChange) onChange(i);
    if (progressRef.current) {
      gsap.to(progressRef.current, {
        width: `${((i) / (steps.length - 1)) * 100}%`,
        duration: 0.5,
        ease: "power2.out",
      });
    }
  };

  return (
    <div className="flex flex-col items-center gap-8 w-full max-w-sm">
      {/* Step labels */}
      <div className="flex items-center w-full justify-between">
        {steps.map((step, i) => (
          <button
            key={step}
            onClick={() => go(i)}
            className="flex flex-col items-center gap-2 group cursor-pointer"
          >
            <span
              className={`w-8 h-8 flex items-center justify-center font-mono text-xs font-bold transition-all duration-300 ${
                i <= active
                  ? "bg-[#ff5c71] text-[#050505]"
                  : "bg-[#111] border border-[#222] text-[#444] group-hover:border-[#ff5c71]/40"
              }`}
            >
              {i + 1}
            </span>
            <span
              className={`font-mono text-[10px] uppercase tracking-wider transition-colors ${
                i <= active ? "text-[#ff5c71]" : "text-[#444]"
              }`}
            >
              {step}
            </span>
          </button>
        ))}
      </div>

      {/* Progress track */}
      <div className="w-full h-px bg-[#1a1a1a] relative">
        <div ref={progressRef} className="absolute top-0 left-0 h-full bg-[#ff5c71]" style={{ width: "0%" }} />
      </div>

      <p className="font-mono text-xs text-[#444]">
        Step {active + 1} of {steps.length}: <span className="text-[#ff5c71]">{steps[active]}</span>
      </p>
    </div>
  );
}
