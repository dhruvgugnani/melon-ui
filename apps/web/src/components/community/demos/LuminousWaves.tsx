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
  waveCount = 5,
  amplitude = 42,
  frequency = 0.005,
  waveColor = "#7fff5e",
  speed = 0.6, // slower, elegant waves
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
        canvas.height = parent.clientHeight || 400;
      }
    };

    resizeCanvas();
    window.addEventListener("resize", resizeCanvas);

    let time = 0;

    const draw = () => {
      ctx.clearRect(0, 0, canvas.width, canvas.height);
      time += 0.006 * speed; // slow motion

      // Smooth mouse coordinate tracking
      const targetMouse = mouseRef.current;
      const currentMouse = activeMouseRef.current;
      
      if (targetMouse.x !== -1000) {
        if (currentMouse.x === -1000) {
          currentMouse.x = targetMouse.x;
          currentMouse.y = targetMouse.y;
        } else {
          currentMouse.x += (targetMouse.x - currentMouse.x) * 0.06;
          currentMouse.y += (targetMouse.y - currentMouse.y) * 0.06;
        }
      } else {
        currentMouse.x = -1000;
        currentMouse.y = -1000;
      }

      // Draw waves from back to front
      for (let w = 0; w < waveCount; w++) {
        const progress = w / (waveCount - 1 || 1);
        
        // Setup filled gradient path for the wave surface
        const grad = ctx.createLinearGradient(0, 0, 0, canvas.height);
        
        // Gradient color fading to black at bottom
        grad.addColorStop(0, `${waveColor}${Math.floor((0.03 + (1 - progress) * 0.12) * 255).toString(16).padStart(2, '0')}`);
        grad.addColorStop(0.5, `${waveColor}05`);
        grad.addColorStop(1, "transparent");

        ctx.fillStyle = grad;
        ctx.strokeStyle = `${waveColor}${Math.floor((0.08 + (1 - progress) * 0.15) * 255).toString(16).padStart(2, '0')}`;
        ctx.lineWidth = 1.2 + (1 - progress) * 1.5;

        // Add soft glow lines
        ctx.shadowBlur = w === waveCount - 1 ? 12 : 4;
        ctx.shadowColor = waveColor;

        ctx.beginPath();
        ctx.moveTo(0, canvas.height);

        // Center line height of this specific wave
        const baseHeight = canvas.height * 0.4 + (canvas.height * 0.45) * progress;

        for (let x = 0; x <= canvas.width; x += 10) {
          // Complex sine-wave combination for natural shape
          let y = baseHeight + 
                  Math.sin(x * frequency + time + w * 2.3) * amplitude * (0.6 + Math.sin(time * 0.5 + w) * 0.4) +
                  Math.cos(x * frequency * 2.1 - time * 0.8 + w * 1.1) * (amplitude * 0.25);

          // Pointer proximity warp
          if (currentMouse.x !== -1000) {
            const dist = Math.abs(x - currentMouse.x);
            if (dist < 220) {
              const strength = (1 - dist / 220) ** 1.8;
              const dy = currentMouse.y - baseHeight;
              y += dy * strength * 0.45; // attract wave peak to mouse height
            }
          }

          ctx.lineTo(x, y);
        }

        // Close the path to the bottom right and left to create a polygon for fill
        ctx.lineTo(canvas.width, canvas.height);
        ctx.closePath();
        
        // Draw fill first, then outline stroke
        ctx.fill();
        ctx.stroke();
      }

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
    <div className="w-full h-full min-h-[350px] bg-[#030303] relative overflow-hidden" style={{ border: "1px solid #111" }}>
      {/* Abstract dark vignette shading */}
      <div className="absolute inset-0 bg-[radial-gradient(circle_at_center,transparent_40%,#030303_95%)] pointer-events-none z-10" />
      <canvas ref={canvasRef} className="absolute inset-0 block w-full h-full" />
    </div>
  );
}
