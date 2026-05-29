"use client";

import { useEffect, useRef } from "react";

export interface MatrixRainProps extends React.ComponentPropsWithoutRef<"div"> {
  rainSpeed?: number;
  fontSize?: number;
  rainColor?: string;
  accentColor?: string;
  glow?: boolean;
  bg?: string;
  bgOpacity?: number;
}

export function MatrixRain({
  rainSpeed = 1.2,
  fontSize = 14,
  rainColor = "#7fff5e",
  accentColor = "#ff5c71",
  glow = true,
  bg = "#050505",
  bgOpacity = 0.08,
  className = "",
  style,
  ...props
}: MatrixRainProps) {
  const canvasRef = useRef<HTMLCanvasElement>(null);

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

    // Columns calculation
    const columns = Math.floor(canvas.width / fontSize) + 1;
    const drops: number[] = Array(columns).fill(0).map(() => Math.random() * -30); // start at offset random heights

    const glyphs = "🍉🌱🌿💦🍈•010101MELONUISEEDS".split("");

    const hexToRgb = (hex: string) => {
      const shorthandRegex = /^#?([a-f\d])([a-f\d])([a-f\d])$/i;
      const fullHex = hex.replace(shorthandRegex, (_, r, g, b) => r + r + g + g + b + b);
      const result = /^#?([a-f\d]{2})([a-f\d]{2})([a-f\d]{2})$/i.exec(fullHex);
      return result
        ? {
            r: parseInt(result[1], 16),
            g: parseInt(result[2], 16),
            b: parseInt(result[3], 16),
          }
        : { r: 5, g: 5, b: 5 };
    };

    const rgbBg = hexToRgb(bg);

    const draw = () => {
      // Fade canvas slightly to create matrix rain tail trail matching custom background color
      ctx.fillStyle = `rgba(${rgbBg.r}, ${rgbBg.g}, ${rgbBg.b}, ${bgOpacity})`;
      ctx.fillRect(0, 0, canvas.width, canvas.height);

      ctx.font = `bold ${fontSize}px monospace`;
      
      if (glow) {
        ctx.shadowBlur = 6;
        ctx.shadowColor = rainColor;
      }

      for (let i = 0; i < drops.length; i++) {
        // Pick a random glyph
        const char = glyphs[Math.floor(Math.random() * glyphs.length)];
        
        // Horizontal x coord
        const x = i * fontSize;
        // Vertical y coord
        const y = drops[i] * fontSize;

        // Occasional accent color drops or white/bright leading characters
        const isLeading = Math.random() > 0.98;
        const isAccent = Math.random() > 0.90;

        if (isLeading) {
          ctx.fillStyle = "#ffffff";
          if (glow) ctx.shadowColor = "#ffffff";
        } else if (isAccent) {
          ctx.fillStyle = accentColor;
          if (glow) ctx.shadowColor = accentColor;
        } else {
          ctx.fillStyle = rainColor;
          if (glow) ctx.shadowColor = rainColor;
        }

        ctx.fillText(char, x, y);

        // Reset text shadow
        if (glow) ctx.shadowColor = rainColor;

        // Move drop downwards
        if (y > canvas.height && Math.random() > 0.975) {
          drops[i] = 0;
        } else {
          drops[i] += 0.5 * rainSpeed;
        }
      }

      if (glow) ctx.shadowBlur = 0; // reset

      animationFrameId = requestAnimationFrame(draw);
    };

    draw();

    return () => {
      cancelAnimationFrame(animationFrameId);
      window.removeEventListener("resize", resizeCanvas);
    };
  }, [rainSpeed, fontSize, rainColor, accentColor, glow, bg, bgOpacity]);

  return (
    <div 
      className={`w-full h-full min-h-[300px] relative overflow-hidden ${className}`} 
      style={{ 
        border: "1px solid #111",
        backgroundColor: bg,
        ...style 
      }}
      {...props}
    >
      <canvas ref={canvasRef} className="absolute inset-0 block w-full h-full" />
    </div>
  );
}
