"use client";

import { useEffect, useRef, useState } from "react";
import { createPortal } from "react-dom";
import gsap from "gsap";

export interface JuicyCursorProps extends React.ComponentPropsWithoutRef<"div"> {
  containerRef?: React.RefObject<HTMLElement | null>;
  color?: string;
  size?: number;
  ringSize?: number;
  ringColor?: string;
  borderColor?: string;
}

export function JuicyCursor({
  containerRef,
  color = "#ff5c71",
  size = 20,
  ringSize = 40,
  ringColor = "#ff5c71",
  borderColor = "#1a1a1a",
  className = "",
  style,
  ...props
}: JuicyCursorProps) {
  const blobRef = useRef<HTMLDivElement>(null);
  const ringRef = useRef<HTMLDivElement>(null);
  const previewRef = useRef<HTMLDivElement>(null);
  const posRef = useRef({ x: 0, y: 0, vx: 0, vy: 0, px: 0, py: 0 });
  const [isVisible, setIsVisible] = useState(false);
  const [mounted, setMounted] = useState(false);

  useEffect(() => {
    setMounted(true);
  }, []);

  useEffect(() => {
    const blob = blobRef.current;
    const ring = ringRef.current;
    if (!blob || !ring) return;

    const target = containerRef ? containerRef.current : previewRef.current;
    if (!target) return;

    // Apply cursor-none to target
    const originalCursor = target.style.cursor;
    const originalPosition = target.style.position;
    
    if (containerRef) {
      target.style.cursor = "none";
      const computedStyle = window.getComputedStyle(target);
      if (computedStyle.position === "static") {
        target.style.position = "relative";
      }
    }

    const onMove = (e: MouseEvent) => {
      const p = posRef.current;
      const rect = target.getBoundingClientRect();
      const x = e.clientX - rect.left;
      const y = e.clientY - rect.top;

      p.vx = x - p.x;
      p.vy = y - p.y;
      p.x = x;
      p.y = y;

      const speed = Math.sqrt(p.vx ** 2 + p.vy ** 2);
      const scaleX = 1 + Math.min(speed * 0.02, 0.6);
      const scaleY = 1 - Math.min(speed * 0.01, 0.3);
      const angle = Math.atan2(p.vy, p.vx) * (180 / Math.PI);

      gsap.to(blob, {
        x,
        y,
        scaleX,
        scaleY,
        rotation: angle,
        duration: 0.15,
        ease: "power2.out",
      });

      gsap.to(ring, {
        x,
        y,
        duration: 0.5,
        ease: "power3.out",
      });
    };

    const onDown = () => {
      gsap.to(blob, { scale: 0.6, duration: 0.15, ease: "power2.in" });
      gsap.to(ring, { scale: 1.5, opacity: 0.3, duration: 0.2, ease: "power2.in" });
    };

    const onUp = () => {
      gsap.to(blob, { scale: 1, duration: 0.4, ease: "elastic.out(1,0.4)" });
      gsap.to(ring, { scale: 1, opacity: 0.4, duration: 0.4, ease: "elastic.out(1,0.4)" });
    };

    const onEnter = () => setIsVisible(true);
    const onLeave = () => setIsVisible(false);

    target.addEventListener("mousemove", onMove);
    target.addEventListener("mousedown", onDown);
    target.addEventListener("mouseup", onUp);
    target.addEventListener("mouseenter", onEnter);
    target.addEventListener("mouseleave", onLeave);

    // Initial state check
    setIsVisible(true);

    return () => {
      target.removeEventListener("mousemove", onMove);
      target.removeEventListener("mousedown", onDown);
      target.removeEventListener("mouseup", onUp);
      target.removeEventListener("mouseenter", onEnter);
      target.removeEventListener("mouseleave", onLeave);
      if (containerRef) {
        target.style.cursor = originalCursor;
        target.style.position = originalPosition;
      }
    };
  }, [containerRef, mounted]);

  const positionClass = "absolute";

  const cursorElements = (
    <>
      {/* Blob cursor */}
      <div
        ref={blobRef}
        className={`${positionClass} pointer-events-none z-[9999] -translate-x-1/2 -translate-y-1/2`}
        style={{ top: 0, left: 0, display: isVisible ? "block" : "none" }}
      >
        <div
          className="rounded-full"
          style={{
            width: size,
            height: size,
            backgroundColor: color,
          }}
        />
      </div>

      {/* Trailing ring */}
      <div
        ref={ringRef}
        className={`${positionClass} pointer-events-none z-[9998] -translate-x-1/2 -translate-y-1/2`}
        style={{ top: 0, left: 0, opacity: 0.4, display: isVisible ? "block" : "none" }}
      >
        <div
          className="rounded-full border"
          style={{
            width: ringSize,
            height: ringSize,
            borderColor: ringColor,
          }}
        />
      </div>
    </>
  );

  // If containerRef is provided, render via Portal
  if (containerRef) {
    if (!mounted || !containerRef.current) return null;
    return createPortal(cursorElements, containerRef.current);
  }

  // Localized preview
  return (
    <div
      ref={previewRef}
      className={`w-full h-64 flex items-center justify-center relative overflow-hidden cursor-none ${className}`}
      style={{
        border: `1px solid ${borderColor}`,
        backgroundColor: "transparent",
        ...style
      }}
      {...props}
    >
      <p className="font-mono text-[#333] text-sm uppercase tracking-widest select-none pointer-events-none">
        Move your cursor here
      </p>

      {cursorElements}

      {/* Decorative seeds pattern */}
      <div className="absolute bottom-4 right-4 flex gap-1 opacity-20 pointer-events-none">
        {Array.from({ length: 5 }).map((_, i) => (
          <div
            key={i}
            className="w-1 h-3 rounded-full border"
            style={{
              transform: `rotate(${-15 + i * 8}deg)`,
              backgroundColor: borderColor,
              borderColor: color,
            }}
          />
        ))}
      </div>
    </div>
  );
}
