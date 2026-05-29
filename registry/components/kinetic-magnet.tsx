"use client";

import React, { useRef, useEffect } from "react";
import gsap from "gsap";

const GRID_COLS = 14;
const GRID_ROWS = 8;
const NEEDLE_COUNT = GRID_COLS * GRID_ROWS;

export function KineticMagnet() {
  const containerRef = useRef<HTMLDivElement>(null);
  const needlesRef = useRef<(SVGSVGElement | null)[]>([]);

  useEffect(() => {
    const container = containerRef.current;
    if (!container) return;

    // Cache needle positions
    const needlePositions = needlesRef.current.map((needle) => {
      if (!needle) return { x: 0, y: 0 };
      const rect = needle.getBoundingClientRect();
      const parentRect = container.getBoundingClientRect();
      return {
        x: rect.left - parentRect.left + rect.width / 2,
        y: rect.top - parentRect.top + rect.height / 2,
      };
    });

    // We use GSAP's quickSetter for maximum rendering performance
    const setters = needlesRef.current.map((needle) => {
      if (!needle) return null;
      return gsap.quickSetter(needle, "rotation", "deg");
    });

    const prefersReducedMotion = window.matchMedia("(prefers-reduced-motion: reduce)").matches;

    const handleMouseMove = (e: MouseEvent) => {
      if (prefersReducedMotion) return;

      const parentRect = container.getBoundingClientRect();
      const mouseX = e.clientX - parentRect.left;
      const mouseY = e.clientY - parentRect.top;

      needlesRef.current.forEach((needle, i) => {
        if (!needle || !setters[i]) return;

        // Skip animating if currently in a click spin tween to prevent overrides
        if (gsap.isTweening(needle)) return;

        const pos = needlePositions[i];
        const dx = mouseX - pos.x;
        const dy = mouseY - pos.y;
        
        // Calculate angle pointing towards cursor
        const angleRad = Math.atan2(dy, dx);
        const angleDeg = angleRad * (180 / Math.PI);

        // Instantly update rotation bypass React rendering
        setters[i]!(angleDeg);
      });
    };

    const handleClick = (e: MouseEvent) => {
      if (prefersReducedMotion) return;

      const parentRect = container.getBoundingClientRect();
      const clickX = e.clientX - parentRect.left;
      const clickY = e.clientY - parentRect.top;

      needlesRef.current.forEach((needle, i) => {
        if (!needle) return;

        const pos = needlePositions[i];
        const dx = clickX - pos.x;
        const dy = clickY - pos.y;
        const distance = Math.sqrt(dx * dx + dy * dy);

        // Ripple delay based on distance from click point
        const delay = distance * 0.0018; 

        // Satisfying mechanical spin with elastic spring easing
        gsap.to(needle, {
          rotation: "+=360",
          duration: 1.4,
          ease: "elastic.out(1, 0.55)",
          delay: delay,
          overwrite: "auto",
        });
      });
    };

    container.addEventListener("mousemove", handleMouseMove);
    container.addEventListener("click", handleClick);

    // Re-cache coordinates on resize
    const handleResize = () => {
      needlesRef.current.forEach((needle, i) => {
        if (!needle) return;
        const rect = needle.getBoundingClientRect();
        const parentRect = container.getBoundingClientRect();
        needlePositions[i] = {
          x: rect.left - parentRect.left + rect.width / 2,
          y: rect.top - parentRect.top + rect.height / 2,
        };
      });
    };

    window.addEventListener("resize", handleResize);

    return () => {
      container.removeEventListener("mousemove", handleMouseMove);
      container.removeEventListener("click", handleClick);
      window.addEventListener("resize", handleResize);
    };
  }, []);

  return (
    <div className="relative flex flex-col items-center justify-center w-full min-h-[500px] overflow-hidden select-none bg-[#050505] rounded-xl border border-white/5 p-8">
      {/* Decorative Interactive Grid Glow */}
      <div className="absolute inset-0 pointer-events-none bg-[radial-gradient(ellipse_at_center,rgba(127,255,94,0.03)_0%,rgba(0,0,0,0)_70%)]" />

      {/* Grid Container */}
      <div 
        ref={containerRef}
        className="relative grid gap-4 p-8 bg-[#0a0a0c] border border-white/5 rounded-xl cursor-crosshair overflow-hidden"
        style={{
          gridTemplateColumns: `repeat(${GRID_COLS}, minmax(0, 1fr))`,
          boxShadow: "inset 0 0 40px rgba(0,0,0,0.8), 0 10px 40px rgba(0,0,0,0.5)",
        }}
      >
        {Array.from({ length: NEEDLE_COUNT }).map((_, i) => {
          // Color variance to make grid look dynamic
          const isCoreNode = (i % 7 === 0 || i % 9 === 0);
          const needleColor = isCoreNode ? "#ff5c71" : "#7fff5e";
          const opacity = isCoreNode ? "opacity-90" : "opacity-40 hover:opacity-100";

          return (
            <svg
              key={i}
              ref={(el) => { needlesRef.current[i] = el; }}
              width="24"
              height="24"
              viewBox="0 0 24 24"
              fill="none"
              className={`transition-opacity duration-300 ${opacity}`}
              style={{ transformOrigin: "center center" }}
            >
              {/* Compass Ring Outer Circle */}
              <circle cx="12" cy="12" r="10" stroke="rgba(255,255,255,0.03)" strokeWidth="1" />
              
              {/* Magnetic Pointer Needle */}
              <path
                d="M12 2L15 12H9L12 2Z"
                fill={needleColor}
                style={{
                  filter: `drop-shadow(0 0 3px ${needleColor}33)`,
                }}
              />
              <path
                d="M12 22L15 12H9L12 22Z"
                fill="rgba(255,255,255,0.15)"
              />
              
              {/* Frictionless Center Pivot Pin */}
              <circle cx="12" cy="12" r="1.5" fill="#ffffff" />
            </svg>
          );
        })}
      </div>

      {/* Footer Info */}
      <footer className="z-10 text-center pointer-events-none mt-4">
        <span className="text-[10px] font-mono uppercase tracking-widest text-white/30">
          move mouse to polarize needles • click grid to trigger shockwave
        </span>
      </footer>
    </div>
  );
}
