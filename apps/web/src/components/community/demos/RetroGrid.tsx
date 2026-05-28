"use client";

import { useEffect, useRef, useState } from "react";

export interface RetroGridProps {
  gridColor?: string;
  speed?: number;
  horizonColor?: string;
  tiltMultiplier?: number;
}

export function RetroGrid({
  gridColor = "#ff5c71",
  speed = 1.5,
  horizonColor = "#7fff5e",
  tiltMultiplier = 1.0,
}: RetroGridProps) {
  const containerRef = useRef<HTMLDivElement>(null);
  const [tilt, setTilt] = useState({ x: 0, y: 0 });

  useEffect(() => {
    const container = containerRef.current;
    if (!container) return;

    const handleMouseMove = (e: MouseEvent) => {
      const rect = container.getBoundingClientRect();
      const x = (e.clientX - rect.left) / rect.width - 0.5; // -0.5 to 0.5
      const y = (e.clientY - rect.top) / rect.height - 0.5; // -0.5 to 0.5

      setTilt({
        x: x * 12 * tiltMultiplier,
        y: -y * 8 * tiltMultiplier,
      });
    };

    const handleMouseLeave = () => {
      setTilt({ x: 0, y: 0 });
    };

    container.addEventListener("mousemove", handleMouseMove);
    container.addEventListener("mouseleave", handleMouseLeave);

    return () => {
      container.removeEventListener("mousemove", handleMouseMove);
      container.removeEventListener("mouseleave", handleMouseLeave);
    };
  }, [tiltMultiplier]);

  return (
    <div
      ref={containerRef}
      className="w-full h-full min-h-[300px] bg-[#050505] relative overflow-hidden flex items-center justify-center"
      style={{
        border: "1px solid #111",
        perspective: "220px",
      }}
    >
      {/* 3D Moving Grid Layer */}
      <div
        className="absolute inset-0 w-full h-[200%] origin-bottom"
        style={{
          transform: `rotateX(78deg) rotateY(${tilt.x}deg) translateY(-25%)`,
          transition: "transform 0.4s cubic-bezier(0.1, 0.8, 0.3, 1)",
          backgroundImage: `
            linear-gradient(to right, ${gridColor}1a 1px, transparent 1px),
            linear-gradient(to bottom, ${gridColor}1a 1px, transparent 1px)
          `,
          backgroundSize: "40px 40px",
          maskImage: "linear-gradient(to top, rgba(0,0,0,1) 30%, rgba(0,0,0,0) 85%)",
          WebkitMaskImage: "linear-gradient(to top, rgba(0,0,0,1) 30%, rgba(0,0,0,0) 85%)",
          animation: `retro-grid-scroll ${10 / speed}s linear infinite`,
        }}
      />

      {/* Horizon Glow Mask */}
      <div
        className="absolute inset-0 pointer-events-none"
        style={{
          background: `radial-gradient(ellipse at 50% 30%, ${horizonColor}0f, transparent 65%)`,
        }}
      />

      {/* Retro Horizon Laser Line */}
      <div
        className="absolute left-0 right-0 h-[1px] pointer-events-none"
        style={{
          top: "40%",
          background: `linear-gradient(to right, transparent, ${horizonColor}33, ${horizonColor}55, ${horizonColor}33, transparent)`,
          boxShadow: `0 0 12px ${horizonColor}44`,
        }}
      />

      {/* Custom keyframes for grid scroll */}
      <style jsx global>{`
        @keyframes retro-grid-scroll {
          0% {
            background-position: 0 0;
          }
          100% {
            background-position: 0 80px;
          }
        }
      `}</style>
    </div>
  );
}
