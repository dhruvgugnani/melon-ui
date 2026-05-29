"use client";

import { useRef, useState, useEffect } from "react";
import gsap from "gsap";

export interface RindWipeTransitionProps extends React.ComponentPropsWithoutRef<"div"> {
  global?: boolean;
  trigger?: boolean;
  onHalfComplete?: () => void;
  onComplete?: () => void;
  gradient?: string;
  text?: string;
  textColor?: string;
  duration?: number;
  holdDelay?: number;
  buttonLabel?: string;
  buttonColor?: string;
  buttonTextColor?: string;
  borderColor?: string;
  demoContent?: React.ReactNode;
}

export function RindWipeTransition({
  global = false,
  trigger = false,
  onHalfComplete,
  onComplete,
  gradient = "linear-gradient(90deg, #7fff5e 0%, #4dc43f 50%, #7fff5e 100%)",
  text = "🍉 MelonUI",
  textColor = "#050505",
  duration = 0.55,
  holdDelay = 0.3,
  buttonLabel = "Trigger Wipe →",
  buttonColor = "#ff5c71",
  buttonTextColor = "#050505",
  borderColor = "#1e1e1e",
  demoContent = "Page Content Here",
  className = "",
  style,
  ...props
}: RindWipeTransitionProps) {
  const wipeRef = useRef<HTMLDivElement>(null);
  const [isRunning, setIsRunning] = useState(false);

  const runWipe = () => {
    if (isRunning || !wipeRef.current) return;
    setIsRunning(true);

    const tl = gsap.timeline({
      onComplete: () => {
        setIsRunning(false);
        onComplete?.();
      },
    });

    // Sweep in
    tl.set(wipeRef.current, { x: "-100%", display: "flex" })
      .to(wipeRef.current, {
        x: "0%",
        duration: duration,
        ease: "power3.inOut",
      })
      .call(() => {
        onHalfComplete?.();
      })
      // Hold
      .to(wipeRef.current, {
        x: "100%",
        duration: duration,
        ease: "power3.inOut",
        delay: holdDelay,
      })
      .set(wipeRef.current, { display: "none" });
  };

  useEffect(() => {
    if (trigger) {
      runWipe();
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [trigger]);

  // If in global mode, render only the portal-like full-screen absolute/fixed wipe overlay
  if (global) {
    return (
      <div
        ref={wipeRef}
        className={`fixed inset-0 z-[9999] flex-col items-center justify-center pointer-events-none ${className}`}
        style={{
          display: "none",
          background: gradient,
          ...style
        }}
        {...props}
      >
        <span
          className="font-black text-4xl uppercase"
          style={{ fontFamily: "var(--font-anton)", color: textColor }}
        >
          {text}
        </span>
      </div>
    );
  }

  // Local demo container
  return (
    <div
      className={`relative w-full flex flex-col items-center gap-6 overflow-hidden ${className}`}
      style={style}
      {...props}
    >
      {/* Demo viewport */}
      <div
        className="relative w-full max-w-sm h-40 overflow-hidden flex items-center justify-center bg-transparent"
        style={{ border: `1px solid ${borderColor}` }}
      >
        <div className="font-mono text-[#555] text-sm">{demoContent}</div>

        {/* Wipe element */}
        <div
          ref={wipeRef}
          className="absolute inset-0 z-10 flex-col items-center justify-center"
          style={{
            display: "none",
            background: gradient,
          }}
        >
          <span
            className="font-black text-2xl uppercase"
            style={{ fontFamily: "var(--font-anton)", color: textColor }}
          >
            {text}
          </span>
        </div>

        {/* Rind stripe overlay decoration */}
        <div className="absolute top-0 inset-x-0 h-1.5 bg-[#1a1a1a]" />
        <div className="absolute bottom-0 inset-x-0 h-1.5 bg-[#1a1a1a]" />
      </div>

      <button
        onClick={runWipe}
        disabled={isRunning}
        className="px-8 py-3 font-black uppercase tracking-widest text-sm disabled:opacity-50 transition-opacity"
        style={{
          fontFamily: "var(--font-anton)",
          backgroundColor: buttonColor,
          color: buttonTextColor,
        }}
      >
        {isRunning ? "Wiping..." : buttonLabel}
      </button>

      <p className="font-mono text-xs text-[#444]">Click to simulate a route transition</p>
    </div>
  );
}
