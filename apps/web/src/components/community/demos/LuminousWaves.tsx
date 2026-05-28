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
    const particleCount = 40;
    for (let i = 0; i < particleCount; i++) {
      particles.push({
        x: Math.random() * canvas.width,
        y: Math.random() * canvas.height,
        size: 0.5 + Math.random() * 1.5,
        speedX: (Math.random() - 0.5) * 0.2,
        speedY: -0.1 - Math.random() * 0.3,
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
      time += 0.008 * speed;

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

        ctx.fillStyle = `rgba(255, 255, 255, ${p.opacity * 0.3})`;
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
      for (let w = 0; w < waveCount; w++) {
        const progress = w / (waveCount - 1 || 1);
        const waveRGB = blendColors(waveColor, secondaryColor, progress);

        // Center line height of this specific wave
        const baseHeight = canvas.height * 0.45 + (canvas.height * 0.3) * progress;
        const points: { x: number; y: number }[] = [];

        // Step 1: Calculate wave points
        for (let x = 0; x <= canvas.width; x += 15) {
          let y = baseHeight + 
                  Math.sin(x * frequency + time + w * 2.3) * amplitude * (0.6 + Math.sin(time * 0.4 + w) * 0.4) +
                  Math.cos(x * frequency * 2.3 - time * 0.7 + w * 1.5) * (amplitude * 0.2);

          // Proximity warp (soft spring gravity pulling to cursor)
          if (currentMouse.x !== -1000) {
            const dist = Math.abs(x - currentMouse.x);
            if (dist < 260) {
              const strength = Math.pow(1 - dist / 260, 2);
              const dy = currentMouse.y - baseHeight;
              y += dy * strength * 0.38; // pull wave vertically
            }
          }

          points.push({ x, y });
        }

        // Step 2: Render fill (No side/bottom border lines)
        const fillGrad = ctx.createLinearGradient(0, baseHeight - amplitude, 0, canvas.height);
        fillGrad.addColorStop(0, `rgba(${waveRGB.r}, ${waveRGB.g}, ${waveRGB.b}, ${0.03 + (1 - progress) * 0.08})`);
        fillGrad.addColorStop(0.5, `rgba(${waveRGB.r}, ${waveRGB.g}, ${waveRGB.b}, 0.01)`);
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

        // Step 3: Render stroke (Top edge line ONLY)
        ctx.strokeStyle = `rgba(${waveRGB.r}, ${waveRGB.g}, ${waveRGB.b}, ${0.08 + (1 - progress) * 0.16})`;
        ctx.lineWidth = 1.0 + (1 - progress) * 1.5;
        
        // Dynamic neon glow
        ctx.shadowBlur = w === waveCount - 1 ? 10 : 4;
        ctx.shadowColor = `rgb(${waveRGB.r}, ${waveRGB.g}, ${waveRGB.b})`;

        ctx.beginPath();
        points.forEach((pt, idx) => {
          if (idx === 0) {
            ctx.moveTo(pt.x, pt.y);
          } else {
            ctx.lineTo(pt.x, pt.y);
          }
        });
        ctx.stroke();
      }

      ctx.shadowBlur = 0; // Reset shadow glow
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
