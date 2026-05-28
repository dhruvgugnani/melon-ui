"use client";

import { useEffect, useRef } from "react";

export interface LuminousWavesProps {
  waveCount?: number;
  amplitude?: number;
  frequency?: number;
  waveColor?: string;
  speed?: number;
}

export function LuminousWaves({
  waveCount = 4,
  amplitude = 35,
  frequency = 0.008,
  waveColor = "#7fff5e",
  speed = 1.0,
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

    const resizeCanvas = () => {
      const parent = canvas.parentElement;
      if (parent) {
        canvas.width = parent.clientWidth;
        canvas.height = parent.clientHeight || 300;
      }
    };

    resizeCanvas();
    window.addEventListener("resize", resizeCanvas);

    let time = 0;

    const draw = () => {
      ctx.clearRect(0, 0, canvas.width, canvas.height);
      time += 0.01 * speed;

      // Smooth mouse coordinate tracking
      const targetMouse = mouseRef.current;
      const currentMouse = activeMouseRef.current;
      
      if (targetMouse.x !== -1000) {
        if (currentMouse.x === -1000) {
          currentMouse.x = targetMouse.x;
          currentMouse.y = targetMouse.y;
        } else {
          currentMouse.x += (targetMouse.x - currentMouse.x) * 0.08;
          currentMouse.y += (targetMouse.y - currentMouse.y) * 0.08;
        }
      } else {
        currentMouse.x = -1000;
        currentMouse.y = -1000;
      }

      ctx.lineWidth = 1.8;
      ctx.shadowBlur = 8;
      ctx.shadowColor = waveColor;

      for (let w = 0; w < waveCount; w++) {
        ctx.strokeStyle = waveColor;
        ctx.globalAlpha = 0.15 + (1 - w / waveCount) * 0.55;
        
        ctx.beginPath();
        const baseHeight = canvas.height * 0.2 + (canvas.height * 0.6) * (w / (waveCount - 1 || 1));

        for (let x = 0; x < canvas.width; x += 5) {
          // Standard wave equation
          let y = baseHeight + Math.sin(x * frequency + time + w * 1.5) * amplitude;

          // Mouse warp impact
          if (currentMouse.x !== -1000) {
            const dist = Math.abs(x - currentMouse.x);
            if (dist < 150) {
              const intensity = (1 - dist / 150) * 0.5;
              const dy = currentMouse.y - baseHeight;
              y += dy * intensity; // Pull/push waves towards mouse height
            }
          }

          if (x === 0) {
            ctx.moveTo(x, y);
          } else {
            ctx.lineTo(x, y);
          }
        }
        ctx.stroke();
      }

      ctx.globalAlpha = 1.0;
      ctx.shadowBlur = 0; // reset

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
  }, [waveCount, amplitude, frequency, waveColor, speed]);

  return (
    <div className="w-full h-full min-h-[300px] bg-[#050505] relative overflow-hidden" style={{ border: "1px solid #111" }}>
      <canvas ref={canvasRef} className="absolute inset-0 block w-full h-full" />
    </div>
  );
}
