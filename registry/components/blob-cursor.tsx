"use client";

import { useEffect, useRef, useState } from "react";
import gsap from "gsap";

export interface JuicyCursorProps {
  containerRef?: React.RefObject<HTMLElement | null>;
}

export function JuicyCursor({ containerRef }: JuicyCursorProps) {
  const blobRef = useRef<HTMLDivElement>(null);
  const ringRef = useRef<HTMLDivElement>(null);
  const posRef = useRef({ x: 0, y: 0, vx: 0, vy: 0, px: 0, py: 0 });
  const [isVisible, setIsVisible] = useState(false);

  useEffect(() => {
    const blob = blobRef.current;
    const ring = ringRef.current;
    if (!blob || !ring) return;

    const target = containerRef?.current || window;

    const onMove = (e: Event) => {
      const mouseEvent = e as MouseEvent;
      const p = posRef.current;
      
      let x = mouseEvent.clientX;
      let y = mouseEvent.clientY;
      
      if (containerRef?.current) {
        const rect = containerRef.current.getBoundingClientRect();
        x = mouseEvent.clientX - rect.left;
        y = mouseEvent.clientY - rect.top;
      }

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

    if (containerRef?.current) {
      containerRef.current.addEventListener("mouseenter", onEnter);
      containerRef.current.addEventListener("mouseleave", onLeave);
      // Determine initial hover state if cursor is already inside bounds
      setIsVisible(true);
    } else {
      setIsVisible(true);
    }

    return () => {
      target.removeEventListener("mousemove", onMove);
      target.removeEventListener("mousedown", onDown);
      target.removeEventListener("mouseup", onUp);
      if (containerRef?.current) {
        containerRef.current.removeEventListener("mouseenter", onEnter);
        containerRef.current.removeEventListener("mouseleave", onLeave);
      }
    };
  }, [containerRef]);

  const positionClass = containerRef ? "absolute" : "fixed";

  return (
    <div className="w-full h-64 bg-[#060606] flex items-center justify-center relative overflow-hidden" style={{ border: "1px solid #1a1a1a" }}>
      <p className="font-mono text-[#333] text-sm uppercase tracking-widest select-none">
        Move your cursor here
      </p>

      {/* Blob cursor */}
      <div
        ref={blobRef}
        className={`${positionClass} pointer-events-none z-[9999] -translate-x-1/2 -translate-y-1/2`}
        style={{ top: 0, left: 0, display: isVisible ? "block" : "none" }}
      >
        <div className="w-5 h-5 rounded-full bg-[#ff5c71]" />
      </div>

      {/* Trailing ring */}
      <div
        ref={ringRef}
        className={`${positionClass} pointer-events-none z-[9998] -translate-x-1/2 -translate-y-1/2`}
        style={{ top: 0, left: 0, opacity: 0.4, display: isVisible ? "block" : "none" }}
      >
        <div className="w-10 h-10 rounded-full border border-[#ff5c71]" />
      </div>

      {/* Decorative seeds pattern */}
      <div className="absolute bottom-4 right-4 flex gap-1 opacity-20">
        {Array.from({ length: 5 }).map((_, i) => (
          <div key={i} className="w-1 h-3 bg-[#1a1a1a] rounded-full border border-[#ff5c71]" style={{ transform: `rotate(${-15 + i * 8}deg)` }} />
        ))}
      </div>
    </div>
  );
}
