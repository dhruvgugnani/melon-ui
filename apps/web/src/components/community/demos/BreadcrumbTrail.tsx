"use client";

import { useState, useRef } from "react";
import gsap from "gsap";

const DEFAULT_STEPS = ["Harvest", "Slice", "Serve", "Enjoy"];

export interface BreadcrumbTrailProps extends Omit<React.ComponentPropsWithoutRef<"div">, "onChange"> {
  steps?: string[];
  activeColor?: string;
  inactiveBgColor?: string;
  inactiveBorderColor?: string;
  textColor?: string;
  onChange?: (index: number) => void;
}

export function BreadcrumbTrail({
  steps = DEFAULT_STEPS,
  activeColor = "#ff5c71",
  inactiveBgColor = "#111",
  inactiveBorderColor = "#222",
  textColor = "#444",
  onChange,
  className = "",
  style,
  ...props
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

  const handleKeyDown = (e: React.KeyboardEvent, i: number) => {
    if (e.key === "Enter" || e.key === " ") {
      e.preventDefault();
      go(i);
    }
  };

  return (
    <div 
      className={`flex flex-col items-center gap-8 w-full max-w-sm ${className}`}
      style={style}
      {...props}
    >
      {/* Step labels */}
      <div className="flex items-center w-full justify-between">
        {steps.map((step, i) => {
          const isActive = i <= active;
          return (
            <button
              key={step}
              onClick={() => go(i)}
              onKeyDown={(e) => handleKeyDown(e, i)}
              className="flex flex-col items-center gap-2 group cursor-pointer focus:outline-none focus-visible:ring-1 focus-visible:ring-[#ff5c71] rounded"
            >
              <span
                className="w-8 h-8 flex items-center justify-center font-mono text-xs font-bold transition-all duration-300 border"
                style={{
                  backgroundColor: isActive ? activeColor : inactiveBgColor,
                  borderColor: isActive ? activeColor : inactiveBorderColor,
                  color: isActive ? "#050505" : textColor,
                }}
                onMouseEnter={(e) => {
                  if (!isActive) {
                    e.currentTarget.style.borderColor = activeColor;
                  }
                }}
                onMouseLeave={(e) => {
                  if (!isActive) {
                    e.currentTarget.style.borderColor = inactiveBorderColor;
                  }
                }}
              >
                {i + 1}
              </span>
              <span
                className="font-mono text-[10px] uppercase tracking-wider transition-colors"
                style={{
                  color: isActive ? activeColor : textColor
                }}
              >
                {step}
              </span>
            </button>
          );
        })}
      </div>

      {/* Progress track */}
      <div className="w-full h-px relative" style={{ backgroundColor: inactiveBorderColor }}>
        <div 
          ref={progressRef} 
          className="absolute top-0 left-0 h-full" 
          style={{ width: "0%", backgroundColor: activeColor }} 
        />
      </div>

      <p className="font-mono text-xs" style={{ color: textColor }}>
        Step {active + 1} of {steps.length}: <span style={{ color: activeColor }}>{steps[active]}</span>
      </p>
    </div>
  );
}
