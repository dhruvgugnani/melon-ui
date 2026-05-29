"use client";

import { useRef, useEffect } from "react";
import gsap from "gsap";

export interface VineInputProps extends Omit<React.ComponentPropsWithoutRef<"input">, "style"> {
  label?: string;
  hint?: string;
  glowColor?: string;
  growSpeed?: number;
  
  labelColor?: string;
  hintColor?: string;
  inputTextColor?: string;
  placeholderColor?: string;
  borderColor?: string;
  
  wrapperClassName?: string;
  wrapperStyle?: React.CSSProperties;
  inputClassName?: string;
  inputStyle?: React.CSSProperties;
}

export function VineInput({
  label = "Your Name",
  hint = "Focus the field — watch the vine grow",
  glowColor = "#7fff5e",
  growSpeed = 1.0,
  
  labelColor = "#555",
  hintColor = "#444",
  inputTextColor = "#f4f4f4",
  placeholderColor = "#333",
  borderColor = "#333",
  
  wrapperClassName = "",
  wrapperStyle,
  inputClassName = "",
  inputStyle,
  placeholder = "e.g. Farmer Joe",
  ...props
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

  const handleFocus = (e: React.FocusEvent<HTMLInputElement>) => {
    const path = svgRef.current;
    if (path) {
      gsap.to(path, {
        strokeDashoffset: 0,
        duration: 0.7 / growSpeed,
        ease: "power3.out",
      });
    }
    if (props.onFocus) {
      props.onFocus(e);
    }
  };

  const handleBlur = (e: React.FocusEvent<HTMLInputElement>) => {
    const path = svgRef.current;
    if (path) {
      const len = path.getTotalLength();
      gsap.to(path, {
        strokeDashoffset: len,
        duration: 0.5 / growSpeed,
        ease: "power2.in",
      });
    }
    if (props.onBlur) {
      props.onBlur(e);
    }
  };

  return (
    <div
      className={`flex flex-col gap-6 w-full max-w-sm ${wrapperClassName}`}
      style={wrapperStyle}
    >
      {label && (
        <label className="font-mono text-xs uppercase tracking-widest" style={{ color: labelColor }}>
          {label}
        </label>
      )}

      <div ref={wrapperRef} className="relative">
        <input
          ref={inputRef}
          type="text"
          placeholder={placeholder}
          onFocus={handleFocus}
          onBlur={handleBlur}
          className={`w-full bg-transparent border-0 border-b px-0 py-3 font-mono text-lg outline-none ${inputClassName}`}
          style={{
            borderColor: borderColor,
            color: inputTextColor,
            ...inputStyle
          }}
          {...props}
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

      {hint && (
        <p className="font-mono text-xs" style={{ color: hintColor }}>
          {hint}
        </p>
      )}
    </div>
  );
}
