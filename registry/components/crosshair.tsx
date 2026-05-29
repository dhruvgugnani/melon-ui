"use client";

import { useEffect, useRef, useState } from "react";
import { createPortal } from "react-dom";
import gsap from "gsap";

export interface CrosshairCursorProps extends React.ComponentPropsWithoutRef<"div"> {
  containerRef?: React.RefObject<HTMLElement | null>;
  color?: string;
  borderColor?: string;
}

export function CrosshairCursor({
  containerRef,
  color = "#ff5c71",
  borderColor = "#1a1a1a",
  className = "",
  style,
  ...props
}: CrosshairCursorProps) {
  const cursorRef = useRef<HTMLDivElement>(null);
  const hLineRef = useRef<HTMLDivElement>(null);
  const vLineRef = useRef<HTMLDivElement>(null);
  const labelRef = useRef<HTMLSpanElement>(null);
  const previewRef = useRef<HTMLDivElement>(null);
  const posRef = useRef({ x: 0, y: 0 });
  const [isInside, setIsInside] = useState(false);
  const [mounted, setMounted] = useState(false);

  useEffect(() => {
    setMounted(true);
  }, []);

  useEffect(() => {
    const container = containerRef ? containerRef.current : previewRef.current;
    if (!container) return;

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

    setIsInside(true);

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
        className="absolute inset-x-0 h-px pointer-events-none opacity-40"
        style={{ top: "50%", backgroundColor: color }}
      />
      <div
        ref={vLineRef}
        className="absolute inset-y-0 w-px pointer-events-none opacity-40"
        style={{ left: "50%", backgroundColor: color }}
      />

      {/* Center dot */}
      <div
        ref={cursorRef}
        className="absolute w-3 h-3 pointer-events-none"
        style={{ top: 0, left: 0 }}
      >
        <div className="w-full h-full border rotate-45" style={{ borderColor: color }} />
      </div>

      {/* Coordinates label */}
      <span
        ref={labelRef}
        className="absolute font-mono text-[9px] pointer-events-none uppercase tracking-widest"
        style={{ top: 0, left: 0, color: color }}
      >
        0, 0
      </span>

      {/* Grid overlay */}
      <div
        className="absolute inset-0 pointer-events-none opacity-10"
        style={{
          backgroundImage: `linear-gradient(${color} 1px, transparent 1px), linear-gradient(90deg, ${color} 1px, transparent 1px)`,
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
      ref={previewRef}
      className={`w-full h-64 relative overflow-hidden cursor-none ${className}`}
      style={{
        border: `1px solid ${borderColor}`,
        backgroundColor: "transparent",
        ...style
      }}
      {...props}
    >
      {crosshairElements}
      <p className="absolute bottom-3 left-0 right-0 text-center font-mono text-[10px] text-[#333] uppercase tracking-widest pointer-events-none">
        Move cursor inside
      </p>
    </div>
  );
}
