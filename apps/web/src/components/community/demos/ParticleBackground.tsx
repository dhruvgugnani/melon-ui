"use client";

import { useEffect, useRef } from "react";

export interface ParticleBackgroundProps {
  particleCount?: number;
  speed?: number;
  particleColor?: string;
  lineColor?: string;
  linkDistance?: number;
}

interface Particle {
  x: number;
  y: number;
  vx: number;
  vy: number;
  radius: number;
  alpha: number;
}

export function ParticleBackground({
  particleCount = 120,
  speed = 0.8,
  particleColor = "#ff5c71",
  lineColor = "#7fff5e",
  linkDistance = 110,
}: ParticleBackgroundProps) {
  const canvasRef = useRef<HTMLCanvasElement>(null);
  const mouseRef = useRef({ x: -1000, y: -1000 });

  useEffect(() => {
    const canvas = canvasRef.current;
    if (!canvas) return;

    const ctx = canvas.getContext("2d");
    if (!ctx) return;

    let animationFrameId: number;
    let particles: Particle[] = [];

    const resizeCanvas = () => {
      const parent = canvas.parentElement;
      if (parent) {
        canvas.width = parent.clientWidth;
        canvas.height = parent.clientHeight || 400;
      }
    };

    resizeCanvas();
    window.addEventListener("resize", resizeCanvas);

    // Initialize particles
    const initParticles = () => {
      particles = [];
      for (let i = 0; i < particleCount; i++) {
        particles.push({
          x: Math.random() * canvas.width,
          y: Math.random() * canvas.height,
          vx: (Math.random() - 0.5) * 0.25 * speed, // slow drifting
          vy: (Math.random() - 0.5) * 0.25 * speed,
          radius: 0.6 + Math.random() * 1.2, // very fine dust
          alpha: 0.12 + Math.random() * 0.28, // translucent
        });
      }
    };

    initParticles();

    const draw = () => {
      ctx.clearRect(0, 0, canvas.width, canvas.height);

      // Draw and update particles
      particles.forEach((p) => {
        p.x += p.vx;
        p.y += p.vy;

        // Wrap around boundaries (better than bounce for clean backgrounds)
        if (p.x < 0) p.x = canvas.width;
        if (p.x > canvas.width) p.x = 0;
        if (p.y < 0) p.y = canvas.height;
        if (p.y > canvas.height) p.y = 0;

        // Draw particle
        ctx.beginPath();
        ctx.arc(p.x, p.y, p.radius, 0, Math.PI * 2);
        ctx.fillStyle = particleColor;
        ctx.globalAlpha = p.alpha;
        ctx.fill();
        ctx.globalAlpha = 1.0;
      });

      // Draw connections
      ctx.lineWidth = 0.55;
      for (let i = 0; i < particles.length; i++) {
        const p1 = particles[i];
        for (let j = i + 1; j < particles.length; j++) {
          const p2 = particles[j];
          const dist = Math.hypot(p1.x - p2.x, p1.y - p2.y);

          if (dist < linkDistance) {
            // Highly transparent link lines
            const alpha = (1 - dist / linkDistance) * 0.12 * Math.min(p1.alpha, p2.alpha);
            ctx.strokeStyle = lineColor;
            ctx.beginPath();
            ctx.moveTo(p1.x, p1.y);
            ctx.lineTo(p2.x, p2.y);
            ctx.globalAlpha = alpha;
            ctx.stroke();
            ctx.globalAlpha = 1.0;
          }
        }

        // Ambient glow near mouse pointer
        if (mouseRef.current.x !== -1000) {
          const distMouse = Math.hypot(p1.x - mouseRef.current.x, p1.y - mouseRef.current.y);
          if (distMouse < linkDistance * 1.6) {
            const alpha = (1 - distMouse / (linkDistance * 1.6)) * 0.18;
            ctx.strokeStyle = lineColor;
            ctx.beginPath();
            ctx.moveTo(p1.x, p1.y);
            ctx.lineTo(mouseRef.current.x, mouseRef.current.y);
            ctx.globalAlpha = alpha;
            ctx.stroke();
            ctx.globalAlpha = 1.0;
          }
        }
      }

      animationFrameId = requestAnimationFrame(draw);
    };

    draw();

    const handleMouseMove = (e: MouseEvent) => {
      const rect = canvas.getBoundingClientRect();
      mouseRef.current.x = e.clientX - rect.left;
      mouseRef.current.y = e.clientY - rect.top;
    };

    const handleMouseLeave = () => {
      mouseRef.current.x = -1000;
      mouseRef.current.y = -1000;
    };

    canvas.addEventListener("mousemove", handleMouseMove);
    canvas.addEventListener("mouseleave", handleMouseLeave);

    return () => {
      cancelAnimationFrame(animationFrameId);
      window.removeEventListener("resize", resizeCanvas);
      canvas.removeEventListener("mousemove", handleMouseMove);
      canvas.removeEventListener("mouseleave", handleMouseLeave);
    };
  }, [particleCount, speed, particleColor, lineColor, linkDistance]);

  return (
    <div className="w-full h-full min-h-[350px] bg-[#030303] relative overflow-hidden" style={{ border: "1px solid #111" }}>
      {/* Premium subtle tech-grid background overlay */}
      <div 
        className="absolute inset-0 opacity-[0.015] pointer-events-none" 
        style={{
          backgroundImage: `
            linear-gradient(to right, #ffffff 1px, transparent 1px),
            linear-gradient(to bottom, #ffffff 1px, transparent 1px)
          `,
          backgroundSize: "30px 30px"
        }}
      />
      {/* Smooth vignette overlay */}
      <div className="absolute inset-0 bg-[radial-gradient(circle_at_center,transparent_40%,#030303_95%)] pointer-events-none" />
      <canvas ref={canvasRef} className="absolute inset-0 block w-full h-full" />
    </div>
  );
}
