"use client";

import { useEffect, useRef } from "react";

export interface LuminousWavesProps {
  waveCount?: number;
  amplitude?: number;
  frequency?: number;
  waveColor?: string;
  secondaryColor?: string;
  speed?: number;
}

interface Particle {
  x: number;
  y: number;
  size: number;
  speedX: number;
  speedY: number;
  opacity: number;
}

export function LuminousWaves({
  waveCount = 5,
  amplitude = 38,
  frequency = 0.006,
  waveColor = "#7fff5e",
  secondaryColor = "#ff5c71",
  speed = 0.5,
}: LuminousWavesProps) {
  const canvasRef = useRef<HTMLCanvasElement>(null);
  const mouseRef = useRef({ x: -1000, y: -1000 });
  const activeMouseRef = useRef({ x: -1000, y: -1000 });

  useEffect(() => {
    const canvas = canvasRef.current;
    if (!canvas) return;

    const ctx = canvas.getContext("2d");
    if (!ctx) return;

    let animationFrameId: number;
    let time = 0;
    const particles: Particle[] = [];

    const resizeCanvas = () => {
      const parent = canvas.parentElement;
      if (parent) {
        canvas.width = parent.clientWidth;
        canvas.height = parent.clientHeight || 400;
      }
    };

    resizeCanvas();
    window.addEventListener("resize", resizeCanvas);

    // Initialize stardust particles
    const particleCount = 45;
    for (let i = 0; i < particleCount; i++) {
      particles.push({
        x: Math.random() * canvas.width,
        y: Math.random() * canvas.height,
        size: 0.4 + Math.random() * 1.4,
        speedX: (Math.random() - 0.5) * 0.15,
        speedY: -0.08 - Math.random() * 0.25,
        opacity: 0.1 + Math.random() * 0.5,
      });
    }

    // Helper: Hex color parser
    const hexToRgb = (hex: string, defaultColor = { r: 127, g: 255, b: 94 }) => {
      const shorthandRegex = /^#?([a-f\d])([a-f\d])([a-f\d])$/i;
      const fullHex = hex.replace(shorthandRegex, (_, r, g, b) => r + r + g + g + b + b);
      const result = /^#?([a-f\d]{2})([a-f\d]{2})([a-f\d]{2})$/i.exec(fullHex);
      return result
        ? {
            r: parseInt(result[1], 16),
            g: parseInt(result[2], 16),
            b: parseInt(result[3], 16),
          }
        : defaultColor;
    };

    // Helper: Blend colors
    const blendColors = (color1: string, color2: string, ratio: number) => {
      const rgb1 = hexToRgb(color1, { r: 127, g: 255, b: 94 }); // default green
      const rgb2 = hexToRgb(color2, { r: 255, g: 92, b: 113 }); // default melon
      const r = Math.round(rgb1.r * (1 - ratio) + rgb2.r * ratio);
      const g = Math.round(rgb1.g * (1 - ratio) + rgb2.g * ratio);
      const b = Math.round(rgb1.b * (1 - ratio) + rgb2.b * ratio);
      return { r, g, b };
    };

    const draw = () => {
      ctx.clearRect(0, 0, canvas.width, canvas.height);
      time += 0.007 * speed;

      // Update and draw particles
      particles.forEach((p) => {
        p.x += p.speedX;
        p.y += p.speedY;

        // Wrap particles around borders
        if (p.y < 0) {
          p.y = canvas.height;
          p.x = Math.random() * canvas.width;
        }
        if (p.x < 0 || p.x > canvas.width) {
          p.x = Math.random() * canvas.width;
        }

        ctx.fillStyle = `rgba(255, 255, 255, ${p.opacity * 0.25})`;
        ctx.beginPath();
        ctx.arc(p.x, p.y, p.size, 0, Math.PI * 2);
        ctx.fill();
      });

      // Smooth mouse tracking
      const targetMouse = mouseRef.current;
      const currentMouse = activeMouseRef.current;
      
      if (targetMouse.x !== -1000) {
        if (currentMouse.x === -1000) {
          currentMouse.x = targetMouse.x;
          currentMouse.y = targetMouse.y;
        } else {
          currentMouse.x += (targetMouse.x - currentMouse.x) * 0.05;
          currentMouse.y += (targetMouse.y - currentMouse.y) * 0.05;
        }
      } else {
        currentMouse.x = -1000;
        currentMouse.y = -1000;
      }

      // Render Aurora Siri-style Waves
      // Enable screen blending composite for high-fidelity glowing overlapping colors
      ctx.globalCompositeOperation = "screen";

      for (let w = 0; w < waveCount; w++) {
        const progress = w / (waveCount - 1 || 1);
        const waveRGB = blendColors(waveColor, secondaryColor, progress);

        // Position waves close to the vertical center so they overlap and morph together
        const baseHeight = canvas.height * 0.5 + (progress - 0.5) * canvas.height * 0.08;
        const points: { x: number; y: number }[] = [];

        // 2px steps for vector-smooth lines without linear segments
        for (let x = 0; x <= canvas.width; x += 2) {
          // Combining multiple sine and cosine waves for an organic ribbon flow
          let y = baseHeight + 
                  Math.sin(x * frequency + time + w * 2.3) * amplitude * (0.65 + Math.sin(time * 0.4 + w) * 0.35) +
                  Math.cos(x * frequency * 2.5 - time * 0.6 + w * 1.2) * (amplitude * 0.22);

          // Proximity mouse attraction/warp
          if (currentMouse.x !== -1000) {
            const dist = Math.abs(x - currentMouse.x);
            if (dist < 280) {
              const strength = Math.pow(1 - dist / 280, 2);
              const dy = currentMouse.y - baseHeight;
              y += dy * strength * 0.42; // pull wave vertically
            }
          }

          points.push({ x, y });
        }

        // Draw fill (smooth gradient fading into background, zero side border strokes)
        const fillGrad = ctx.createLinearGradient(0, baseHeight - amplitude * 1.5, 0, canvas.height);
        fillGrad.addColorStop(0, `rgba(${waveRGB.r}, ${waveRGB.g}, ${waveRGB.b}, ${0.015 + (1 - progress) * 0.045})`);
        fillGrad.addColorStop(0.5, `rgba(${waveRGB.r}, ${waveRGB.g}, ${waveRGB.b}, 0.005)`);
        fillGrad.addColorStop(1, "transparent");

        ctx.fillStyle = fillGrad;
        ctx.beginPath();
        ctx.moveTo(0, canvas.height);
        points.forEach((pt) => {
          ctx.lineTo(pt.x, pt.y);
        });
        ctx.lineTo(canvas.width, canvas.height);
        ctx.closePath();
        ctx.fill();

        // High-Performance Double-Draw Stroke System
        // Draw 1: Thick low-opacity bloom stroke
        ctx.strokeStyle = `rgba(${waveRGB.r}, ${waveRGB.g}, ${waveRGB.b}, ${0.018 + (1 - progress) * 0.038})`;
        ctx.lineWidth = 14 + (1 - progress) * 8;
        ctx.beginPath();
        points.forEach((pt, idx) => {
          if (idx === 0) ctx.moveTo(pt.x, pt.y);
          else ctx.lineTo(pt.x, pt.y);
        });
        ctx.stroke();

        // Draw 2: Thin higher-opacity core stroke
        ctx.strokeStyle = `rgba(${waveRGB.r}, ${waveRGB.g}, ${waveRGB.b}, ${0.12 + (1 - progress) * 0.22})`;
        ctx.lineWidth = 1.0 + (1 - progress) * 1.2;
        ctx.beginPath();
        points.forEach((pt, idx) => {
          if (idx === 0) ctx.moveTo(pt.x, pt.y);
          else ctx.lineTo(pt.x, pt.y);
        });
        ctx.stroke();
      }

      ctx.globalCompositeOperation = "source-over"; // Reset composite
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
  }, [waveCount, amplitude, frequency, waveColor, secondaryColor, speed]);

  return (
    <div className="w-full h-full min-h-[350px] bg-[#030303] relative overflow-hidden" style={{ border: "1px solid #111" }}>
      {/* Editorial grid backing */}
      <div 
        className="absolute inset-0 opacity-[0.02] pointer-events-none" 
        style={{
          backgroundImage: `
            linear-gradient(to right, #fff 1px, transparent 1px),
            linear-gradient(to bottom, #fff 1px, transparent 1px)
          `,
          backgroundSize: "60px 60px"
        }}
      />
      {/* Radial vignette shader overlay */}
      <div className="absolute inset-0 bg-[radial-gradient(circle_at_center,transparent_35%,#030303_90%)] pointer-events-none z-10" />
      <canvas ref={canvasRef} className="absolute inset-0 block w-full h-full" />
    </div>
  );
}
