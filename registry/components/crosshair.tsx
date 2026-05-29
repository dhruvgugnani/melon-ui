"use client";

import { useEffect, useRef, useState } from "react";
import { createPortal } from "react-dom";
import gsap from "gsap";

export interface CrosshairCursorProps {
  containerRef?: React.RefObject<HTMLElement | null>;
}

export function CrosshairCursor({ containerRef }: CrosshairCursorProps) {
  const cursorRef = useRef<HTMLDivElement>(null);
  const hLineRef = useRef<HTMLDivElement>(null);
  const vLineRef = useRef<HTMLDivElement>(null);
  const labelRef = useRef<HTMLSpanElement>(null);
  const posRef = useRef({ x: 0, y: 0 });
  const [isInside, setIsInside] = useState(false);
  const [mounted, setMounted] = useState(false);

  useEffect(() => {
    setMounted(true);
  }, []);

  useEffect(() => {
    // If containerRef is provided, use it. Otherwise, use our default container.
    const container = containerRef ? containerRef.current : cursorRef.current?.parentElement;
    if (!container) return;

    // Apply cursor-none and ensure relative positioning
    const originalCursor = container.style.cursor;
    const originalPosition = container.style.position;
    
    if (containerRef) {
      container.style.cursor = "none";
      const computedStyle = window.getComputedStyle(container);
      if (computedStyle.position === "static") {
        container.style.position = "relative";
      }
    }

    const onMove = (e: MouseEvent) => {
      const rect = container.getBoundingClientRect();
      const x = e.clientX - rect.left;
      const y = e.clientY - rect.top;
      posRef.current = { x, y };

      gsap.to(hLineRef.current, { top: y, duration: 0.1, ease: "none" });
      gsap.to(vLineRef.current, { left: x, duration: 0.1, ease: "none" });
      gsap.to(cursorRef.current, { x: x - 6, y: y - 6, duration: 0.08, ease: "none" });
      if (labelRef.current) {
        labelRef.current.textContent = `${Math.round(x)}, ${Math.round(y)}`;
        gsap.to(labelRef.current, { x: x + 14, y: y - 22, duration: 0.1, ease: "none" });
      }
    };

    const onEnter = () => {
      setIsInside(true);
    };

    const onLeave = () => {
      setIsInside(false);
    };

    container.addEventListener("mousemove", onMove);
    container.addEventListener("mouseenter", onEnter);
    container.addEventListener("mouseleave", onLeave);

    // Initial check if cursor is already inside (for default container or if mouseenter triggered)
    if (!containerRef) {
      setIsInside(true);
    }

    return () => {
      container.removeEventListener("mousemove", onMove);
      container.removeEventListener("mouseenter", onEnter);
      container.removeEventListener("mouseleave", onLeave);
      if (containerRef) {
        container.style.cursor = originalCursor;
        container.style.position = originalPosition;
      }
    };
  }, [containerRef, mounted]);

  const crosshairElements = (
    <div 
      className="absolute inset-0 pointer-events-none overflow-hidden z-[9999]"
      style={{ display: isInside ? "block" : "none" }}
    >
      {/* Crosshair lines */}
      <div
        ref={hLineRef}
        className="absolute inset-x-0 h-px bg-[#ff5c71]/40 pointer-events-none"
        style={{ top: "50%" }}
      />
      <div
        ref={vLineRef}
        className="absolute inset-y-0 w-px bg-[#ff5c71]/40 pointer-events-none"
        style={{ left: "50%" }}
      />

      {/* Center dot */}
      <div
        ref={cursorRef}
        className="absolute w-3 h-3 pointer-events-none"
        style={{ top: 0, left: 0 }}
      >
        <div className="w-full h-full border border-[#ff5c71] rotate-45" />
      </div>

      {/* Coordinates label */}
      <span
        ref={labelRef}
        className="absolute font-mono text-[9px] text-[#ff5c71] pointer-events-none uppercase tracking-widest"
        style={{ top: 0, left: 0 }}
      >
        0, 0
      </span>

      {/* Grid overlay */}
      <div
        className="absolute inset-0 pointer-events-none opacity-10"
        style={{
          backgroundImage: "linear-gradient(#ff5c71 1px, transparent 1px), linear-gradient(90deg, #ff5c71 1px, transparent 1px)",
          backgroundSize: "40px 40px",
        }}
      />
    </div>
  );

  // If containerRef is provided, render elements via Portal
  if (containerRef) {
    if (!mounted || !containerRef.current) return null;
    return createPortal(crosshairElements, containerRef.current);
  }

  // Default localized preview
  return (
    <div
      className="w-full h-64 bg-[#040404] relative overflow-hidden cursor-none"
      style={{ border: "1px solid #1a1a1a" }}
    >
      {crosshairElements}
      <p className="absolute bottom-3 left-0 right-0 text-center font-mono text-[10px] text-[#333] uppercase tracking-widest pointer-events-none">
        Move cursor inside
      </p>
    </div>
  );
}

