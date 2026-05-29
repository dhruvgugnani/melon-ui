"use client";

import { useRef, useState, useEffect } from "react";
import gsap from "gsap";

export interface MorphTransitionProps extends React.ComponentPropsWithoutRef<"div"> {
  global?: boolean;
  trigger?: boolean;
  onHalfComplete?: () => void;
  onComplete?: () => void;
  
  pageColorA?: string;
  pageColorB?: string;
  titleA?: string;
  titleB?: string;
  contentA?: React.ReactNode;
  contentB?: React.ReactNode;
  
  buttonLabel?: string;
  duration?: number;
  borderColor?: string;
}

export function MorphTransition({
  global = false,
  trigger = false,
  onHalfComplete,
  onComplete,
  
  pageColorA = "#7fff5e",
  pageColorB = "#ff5c71",
  titleA = "HOME",
  titleB = "ABOUT",
  contentA,
  contentB,
  
  buttonLabel = "Morph →",
  duration = 0.55,
  borderColor = "#1e1e1e",
  
  className = "",
  style,
  ...props
}: MorphTransitionProps) {
  const overlayRef = useRef<HTMLDivElement>(null);
  const [page, setPage] = useState<"A" | "B">("A");
  const [isRunning, setIsRunning] = useState(false);

  const morph = () => {
    if (isRunning || !overlayRef.current) return;
    setIsRunning(true);

    const tl = gsap.timeline({
      onComplete: () => {
        setIsRunning(false);
        onComplete?.();
      },
    });

    // Grow circle from center
    tl.set(overlayRef.current, { display: "block", scale: 0, opacity: 1 })
      .to(overlayRef.current, {
        scale: 4,
        duration: duration,
        ease: "power3.in",
      })
      .call(() => {
        setPage((prev) => (prev === "A" ? "B" : "A"));
        onHalfComplete?.();
      })
      .to(overlayRef.current, {
        scale: 12,
        opacity: 0,
        duration: duration,
        ease: "power3.out",
      })
      .set(overlayRef.current, { display: "none", scale: 0, opacity: 1 });
  };

  useEffect(() => {
    if (trigger) {
      morph();
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [trigger]);

  // If in global mode, render only the full-screen absolute/fixed transition morph circle
  if (global) {
    return (
      <div
        ref={overlayRef}
        className={`fixed top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-24 h-24 rounded-full pointer-events-none z-[9999] ${className}`}
        style={{
          display: "none",
          backgroundColor: page === "A" ? pageColorA : pageColorB,
          transformOrigin: "center center",
          ...style
        }}
        {...props}
      />
    );
  }

  // Local demo container
  return (
    <div
      className={`relative w-full max-w-sm overflow-hidden flex flex-col items-center gap-5 ${className}`}
      style={style}
      {...props}
    >
      {/* Demo viewport */}
      <div
        className="relative w-full h-44 overflow-hidden flex items-center justify-center bg-transparent"
        style={{ border: `1px solid ${borderColor}` }}
      >
        {/* Morph overlay */}
        <div
          ref={overlayRef}
          className="absolute w-24 h-24 rounded-full pointer-events-none"
          style={{
            display: "none",
            backgroundColor: page === "A" ? pageColorA : pageColorB,
            transformOrigin: "center center",
          }}
        />

        {/* Content */}
        <div className="text-center z-10">
          <p className="font-mono text-xs uppercase tracking-widest text-[#444] mb-2">Page {page}</p>
          {page === "A" ? (
            contentA ?? (
              <p
                className="font-black text-4xl"
                style={{
                  fontFamily: "var(--font-anton)",
                  color: pageColorB,
                }}
              >
                {titleA}
              </p>
            )
          ) : (
            contentB ?? (
              <p
                className="font-black text-4xl"
                style={{
                  fontFamily: "var(--font-anton)",
                  color: pageColorA,
                }}
              >
                {titleB}
              </p>
            )
          )}
        </div>
      </div>

      <button
        onClick={morph}
        disabled={isRunning}
        className="px-8 py-3 font-mono text-xs uppercase tracking-widest text-[#f4f4f4] border border-[#ff5c71]/30 hover:border-[#ff5c71] hover:text-[#ff5c71] transition-all disabled:opacity-30"
      >
        {isRunning ? "Morphing..." : buttonLabel}
      </button>
    </div>
  );
}
