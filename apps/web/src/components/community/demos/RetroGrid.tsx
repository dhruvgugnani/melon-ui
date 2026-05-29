"use client";

import { useEffect, useRef, useState } from "react";

export interface RetroGridProps extends React.ComponentPropsWithoutRef<"div"> {
  gridColor?: string;
  speed?: number;
  horizonColor?: string;
  tiltMultiplier?: number;
  bg?: string;
  borderColor?: string;
}

export function RetroGrid({
  gridColor = "#ff5c71",
  speed = 1.5,
  horizonColor = "#7fff5e",
  tiltMultiplier = 1.0,
  bg = "#050505",
  borderColor = "#111",
  className = "",
  style,
  ...props
}: RetroGridProps) {
  const containerRef = useRef<HTMLDivElement>(null);
  const canvasRef = useRef<HTMLCanvasElement>(null);
  const [tilt, setTilt] = useState({ x: 0, y: 0 });
  const tiltRef = useRef({ x: 0, y: 0 });

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

  // Keep tiltRef in sync with tilt state for smooth animation loop
  useEffect(() => {
    tiltRef.current = tilt;
  }, [tilt]);

  // Canvas perspective grid drawing loop
  useEffect(() => {
    const canvas = canvasRef.current;
    if (!canvas) return;

    const ctx = canvas.getContext("2d");
    if (!ctx) return;

    let animationFrameId: number;
    let scrollOffset = 0;

    const resizeCanvas = () => {
      const parent = canvas.parentElement;
      if (parent) {
        canvas.width = parent.clientWidth;
        canvas.height = parent.clientHeight || 300;
      }
    };

    resizeCanvas();
    window.addEventListener("resize", resizeCanvas);

    // Initialize rising dust particles
    const particles = Array.from({ length: 30 }, () => ({
      x: Math.random(), // normalized 0-1
      y: 0.4 + Math.random() * 0.6, // normalized starting inside grid area
      size: 0.5 + Math.random() * 1.2,
      speedY: -0.0008 - Math.random() * 0.0012,
      speedX: (Math.random() - 0.5) * 0.0003,
      opacity: 0.15 + Math.random() * 0.45,
    }));

    const draw = () => {
      ctx.clearRect(0, 0, canvas.width, canvas.height);
      
      const horizonY = canvas.height * 0.40; // Horizon height set exactly to 40%
      const currentTilt = tiltRef.current;
      // Interpolate center X based on cursor tilt (parallax)
      const horizonX = canvas.width / 2 + currentTilt.x * 3.5;

      // --- Draw Rising Dust Particles ---
      particles.forEach((p) => {
        p.y += p.speedY;
        p.x += p.speedX;

        // Reset particle if it goes above the horizon
        if (p.y < 0.38) {
          p.y = 0.95;
          p.x = Math.random();
        }
        if (p.x < 0 || p.x > 1) {
          p.x = Math.random();
        }

        const px = p.x * canvas.width;
        const py = p.y * canvas.height;

        ctx.fillStyle = gridColor;
        ctx.globalAlpha = p.opacity * 0.35;
        ctx.beginPath();
        ctx.arc(px, py, p.size, 0, Math.PI * 2);
        ctx.fill();
      });
      ctx.globalAlpha = 1.0;

      // --- Draw 3D Perspective Grid ---
      ctx.strokeStyle = gridColor;
      ctx.lineWidth = 1.0;
      
      // We will use screen composite to make grid lines blend beautifully
      ctx.globalCompositeOperation = "screen";

      // 1. Draw horizontal lines with perspective projection
      scrollOffset += 0.015 * speed;
      const numHorizontalLines = 18;
      
      for (let i = 0; i <= numHorizontalLines; i++) {
        // Compute line index shifted by the scrolling fractional offset
        const ratio = (i + (scrollOffset % 1.0)) / numHorizontalLines;
        
        // Power distribution maps linear steps to perspective depth spacing
        const y = horizonY + (canvas.height - horizonY) * Math.pow(ratio, 2.5);
        
        // Calculate grid line transparency: fades out as it approaches the horizon
        const fadeRatio = Math.min(1.0, Math.max(0.0, (y - horizonY) / (canvas.height - horizonY)));
        ctx.globalAlpha = 0.28 * Math.pow(fadeRatio, 1.8);

        ctx.beginPath();
        ctx.moveTo(0, y);
        ctx.lineTo(canvas.width, y);
        ctx.stroke();
      }

      // 2. Draw vertical perspective lines radiating from horizon center
      const numVerticalLines = 28;
      const bottomSpacing = canvas.width / 14; // spread lines at bottom

      for (let j = -numVerticalLines / 2; j <= numVerticalLines / 2; j++) {
        const xBottom = canvas.width / 2 + j * bottomSpacing + currentTilt.x * 2.0;

        // Visual fade for perspective lines as they approach horizon
        ctx.globalAlpha = 0.28;

        ctx.beginPath();
        ctx.moveTo(horizonX, horizonY);
        ctx.lineTo(xBottom, canvas.height);
        ctx.stroke();
      }

      ctx.globalAlpha = 1.0;
      ctx.globalCompositeOperation = "source-over"; // Reset composite operation

      animationFrameId = requestAnimationFrame(draw);
    };

    draw();

    return () => {
      cancelAnimationFrame(animationFrameId);
      window.removeEventListener("resize", resizeCanvas);
    };
  }, [gridColor, speed]);

  return (
    <div
      ref={containerRef}
      className={`w-full h-full min-h-[300px] relative overflow-hidden flex items-center justify-center select-none ${className}`}
      style={{
        border: `1px solid ${borderColor}`,
        backgroundColor: bg,
        ...style
      }}
      {...props}
    >
      {/* Synthwave Cyber Sun */}
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
          opacity: 0.12,
          filter: "blur(0.5px)",
        }}
      />

      {/* Grid Canvas Layer */}
      <canvas ref={canvasRef} className="absolute inset-0 block w-full h-full pointer-events-none z-10" />

      {/* Horizon Ambient Radial Glow */}
      <div
        className="absolute inset-0 pointer-events-none"
        style={{
          background: `radial-gradient(ellipse at 50% 40%, ${horizonColor}0d, transparent 65%)`,
        }}
      />

      {/* Retro Horizon Laser Line */}
      <div
        className="absolute left-0 right-0 h-[1.5px] pointer-events-none z-20"
        style={{
          top: "40%",
          background: `linear-gradient(to right, transparent, ${horizonColor}33, ${horizonColor}66, ${horizonColor}33, transparent)`,
          boxShadow: `0 0 10px ${horizonColor}33`,
        }}
      />
    </div>
  );
}
