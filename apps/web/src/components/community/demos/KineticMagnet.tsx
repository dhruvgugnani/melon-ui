"use client";

import React, { useRef, useEffect } from "react";
import gsap from "gsap";

export interface KineticMagnetProps extends React.ComponentPropsWithoutRef<"div"> {
  cols?: number;
  rows?: number;
  primaryColor?: string;
  secondaryColor?: string;
  bg?: string;
  innerBg?: string;
  borderColor?: string;
  showFooter?: boolean;
}

export function KineticMagnet({
  cols = 14,
  rows = 8,
  primaryColor = "#7fff5e",
  secondaryColor = "#ff5c71",
  bg = "#050505",
  innerBg = "#0a0a0c",
  borderColor = "rgba(255,255,255,0.05)",
  showFooter = true,
  className = "",
  style,
  ...props
}: KineticMagnetProps) {
  const containerRef = useRef<HTMLDivElement>(null);
  const needlesRef = useRef<(SVGSVGElement | null)[]>([]);
  const needleCount = cols * rows;

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

    const prefersReducedMotion = typeof window !== "undefined" && window.matchMedia("(prefers-reduced-motion: reduce)").matches;

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
        if (!pos) return;
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
        if (!pos) return;
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
      window.removeEventListener("resize", handleResize);
    };
  }, [cols, rows]);

  return (
    <div
      className={`relative flex flex-col items-center justify-center w-full min-h-[500px] overflow-hidden select-none rounded-xl border p-8 ${className}`}
      style={{
        backgroundColor: bg,
        borderColor: borderColor,
        ...style
      }}
      {...props}
    >
      {/* Decorative Interactive Grid Glow */}
      <div 
        className="absolute inset-0 pointer-events-none" 
        style={{
          background: `radial-gradient(ellipse at center, ${primaryColor}08 0%, rgba(0,0,0,0) 70%)`
        }}
      />

      {/* Grid Container */}
      <div 
        ref={containerRef}
        className="relative grid gap-4 p-8 border rounded-xl cursor-crosshair overflow-hidden"
        style={{
          gridTemplateColumns: `repeat(${cols}, minmax(0, 1fr))`,
          backgroundColor: innerBg,
          borderColor: borderColor,
          boxShadow: "inset 0 0 40px rgba(0,0,0,0.8), 0 10px 40px rgba(0,0,0,0.5)",
        }}
      >
        {Array.from({ length: needleCount }).map((_, i) => {
          // Color variance to make grid look dynamic
          const isCoreNode = (i % 7 === 0 || i % 9 === 0);
          const needleColor = isCoreNode ? secondaryColor : primaryColor;
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
      {showFooter && (
        <footer className="z-10 text-center pointer-events-none mt-4">
          <span className="text-[10px] font-mono uppercase tracking-widest text-white/30">
            move mouse to polarize needles • click grid to trigger shockwave
          </span>
        </footer>
      )}
    </div>
  );
}
