"use client";

import { useEffect, useRef, useState } from "react";

export interface RetroGridProps {
  gridColor?: string;
  speed?: number;
  horizonColor?: string;
  tiltMultiplier?: number;
}

interface Particle {
  x: number;
  y: number;
  size: number;
  speedY: number;
  speedX: number;
  opacity: number;
}

export function RetroGrid({
  gridColor = "#ff5c71",
  speed = 1.5,
  horizonColor = "#7fff5e",
  tiltMultiplier = 1.0,
}: RetroGridProps) {
  const containerRef = useRef<HTMLDivElement>(null);
  const canvasRef = useRef<HTMLCanvasElement>(null);
  const [tilt, setTilt] = useState({ x: 0, y: 0 });

  useEffect(() => {
    const container = containerRef.current;
    if (!container) return;

    const handleMouseMove = (e: MouseEvent) => {
      const rect = container.getBoundingClientRect();
      const x = (e.clientX - rect.left) / rect.width - 0.5; // -0.5 to 0.5
      const y = (e.clientY - rect.top) / rect.height - 0.5; // -0.5 to 0.5

      setTilt({
        x: x * 10 * tiltMultiplier,
        y: -y * 6 * tiltMultiplier,
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

  // Rising grid-dust effect
  useEffect(() => {
    const canvas = canvasRef.current;
    if (!canvas) return;

    const ctx = canvas.getContext("2d");
    if (!ctx) return;

    let animationFrameId: number;

    const resizeCanvas = () => {
      const parent = canvas.parentElement;
      if (parent) {
        canvas.width = parent.clientWidth;
        canvas.height = parent.clientHeight || 300;
      }
    };

    resizeCanvas();
    window.addEventListener("resize", resizeCanvas);

    // Grid particles rising from horizon/bottom
    const particles: Particle[] = [];
    const particleCount = 25;

    for (let i = 0; i < particleCount; i++) {
      particles.push({
        x: Math.random() * canvas.width,
        y: canvas.height * 0.4 + Math.random() * (canvas.height * 0.6),
        size: 0.5 + Math.random() * 1.2,
        speedY: -0.15 - Math.random() * 0.3,
        speedX: (Math.random() - 0.5) * 0.1,
        opacity: 0.15 + Math.random() * 0.45,
      });
    }

    const draw = () => {
      ctx.clearRect(0, 0, canvas.width, canvas.height);

      particles.forEach((p) => {
        p.y += p.speedY;
        p.x += p.speedX;

        // Reset particle when it rises above horizon (40% height)
        if (p.y < canvas.height * 0.38) {
          p.y = canvas.height * 0.95;
          p.x = Math.random() * canvas.width;
        }

        ctx.fillStyle = gridColor;
        ctx.globalAlpha = p.opacity * 0.3;
        ctx.beginPath();
        ctx.arc(p.x, p.y, p.size, 0, Math.PI * 2);
        ctx.fill();
      });

      ctx.globalAlpha = 1.0;
      animationFrameId = requestAnimationFrame(draw);
    };

    draw();

    return () => {
      cancelAnimationFrame(animationFrameId);
      window.removeEventListener("resize", resizeCanvas);
    };
  }, [gridColor]);

  return (
    <div
      ref={containerRef}
      className="w-full h-full min-h-[300px] bg-[#050505] relative overflow-hidden flex items-center justify-center select-none"
      style={{
        border: "1px solid #111",
        perspective: "220px",
      }}
    >
      {/* Dynamic Keyframe Animation Stylesheet */}
      <style dangerouslySetInnerHTML={{
        __html: `
          @keyframes retro-grid-scroll {
            0% {
              background-position: 0 0;
            }
            100% {
              background-position: 0 80px;
            }
          }
        `
      }} />

      {/* Retro Synthwave Cyber Sun */}
      <div
        className="absolute pointer-events-none"
        style={{
          width: "240px",
          height: "120px",
          top: "calc(40% - 120px)",
          left: "calc(50% - 120px)",
          borderTopLeftRadius: "120px",
          borderTopRightRadius: "120px",
          background: `linear-gradient(to bottom,
            ${horizonColor} 0%,
            ${horizonColor} 35%,
            transparent 35%,
            transparent 44%,
            ${horizonColor} 44%,
            ${horizonColor} 66%,
            transparent 66%,
            transparent 74%,
            ${horizonColor} 74%,
            ${horizonColor} 86%,
            transparent 86%,
            transparent 92%,
            ${horizonColor} 92%,
            ${horizonColor} 100%
          )`,
          opacity: 0.08,
          filter: "blur(0.5px)",
        }}
      />

      {/* 3D Moving Grid Layer */}
      <div
        className="absolute inset-0 w-full h-[200%] origin-bottom pointer-events-none"
        style={{
          transform: `rotateX(78deg) rotateY(${tilt.x}deg) translateY(-25%)`,
          transition: "transform 0.4s cubic-bezier(0.1, 0.8, 0.3, 1)",
          backgroundImage: `
            linear-gradient(to right, ${gridColor} 1.5px, transparent 1.5px),
            linear-gradient(to bottom, ${gridColor} 1.5px, transparent 1.5px)
          `,
          backgroundSize: "40px 40px",
          opacity: 0.15, // Uniform opacity to support named colors and hex strings
          maskImage: "linear-gradient(to top, rgba(0,0,0,1) 25%, rgba(0,0,0,0) 80%)",
          WebkitMaskImage: "linear-gradient(to top, rgba(0,0,0,1) 25%, rgba(0,0,0,0) 80%)",
          animation: `retro-grid-scroll ${10 / speed}s linear infinite`,
        }}
      />

      {/* Grid Particles Canvas */}
      <canvas ref={canvasRef} className="absolute inset-0 block w-full h-full pointer-events-none z-10" />

      {/* Horizon Ambient Radial Glow */}
      <div
        className="absolute inset-0 pointer-events-none"
        style={{
          background: `radial-gradient(ellipse at 50% 40%, ${horizonColor}0f, transparent 65%)`,
        }}
      />

      {/* Retro Horizon Laser Line */}
      <div
        className="absolute left-0 right-0 h-[1.5px] pointer-events-none"
        style={{
          top: "40%",
          background: `linear-gradient(to right, transparent, ${horizonColor}33, ${horizonColor}66, ${horizonColor}33, transparent)`,
          boxShadow: `0 0 10px ${horizonColor}33`,
        }}
      />
    </div>
  );
}
