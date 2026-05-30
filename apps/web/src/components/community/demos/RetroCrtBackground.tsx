"use client";

import React, { useState, useEffect, useRef } from "react";

export interface RetroCrtBackgroundProps extends React.ComponentPropsWithoutRef<"div"> {
  bg?: string;
  color?: string;
  scanlineSpeed?: number;
  typingSpeed?: number;
  flickerIntensity?: number;
  terminalOutput?: string[];
}

export const RetroCrtBackground: React.FC<RetroCrtBackgroundProps> = ({
  bg = "#0a1105",
  color = "#7fff5e",
  scanlineSpeed = 10,
  typingSpeed = 20,
  flickerIntensity = 0.15,
  terminalOutput = [
    "INITIATING SECURE CONNECTION...",
    "HANDSHAKE PROTOCOL: ACCEPTED",
    "DECRYPTING CORE MODULES [██████████] 100%",
    "ACCESS GRANTED.",
    "SYSTEM: ONLINE."
  ],
  className = "",
  style,
  children,
  ...props
}) => {
  const [typedText, setTypedText] = useState("");
  const cursorRef = useRef<HTMLSpanElement>(null);

  useEffect(() => {
    let currentLine = 0;
    let currentChar = 0;
    let textStr = "";
    let isCancelled = false;

    const typeChar = () => {
      if (isCancelled) return;
      if (currentLine < terminalOutput.length) {
        if (currentChar < terminalOutput[currentLine].length) {
          textStr += terminalOutput[currentLine][currentChar];
          setTypedText(textStr);
          currentChar++;
          // Base speed on typingSpeed and add deterministic variance
          const delay = typingSpeed + Math.sin(currentChar) * (typingSpeed * 0.5);
          setTimeout(typeChar, Math.max(5, delay));
        } else {
          textStr += "\n";
          setTypedText(textStr);
          currentLine++;
          currentChar = 0;
          setTimeout(typeChar, 400); // Pause between lines
        }
      }
    };

    setTimeout(typeChar, 1000); // Initial delay

    return () => {
      isCancelled = true;
    };
  }, [terminalOutput, typingSpeed]);

  return (
    <div 
      className={`relative w-full h-[600px] overflow-hidden rounded-xl font-mono ${className}`}
      style={{
        backgroundColor: bg,
        color: color,
        ...style
      }}
      {...props}
    >
      {/* CRT Curvature and Screen Border */}
      <div
        className="absolute inset-0 pointer-events-none z-50 border-8 border-[#050505]"
        style={{
          boxShadow: "inset 0 0 100px rgba(0,0,0,0.9)",
          borderRadius: "16px",
        }}
      />

      {/* Phosphor Glow and Vignette */}
      <div className="absolute inset-0 pointer-events-none z-40 bg-[radial-gradient(circle_at_center,transparent_50%,#000000_150%)] mix-blend-multiply opacity-80" />

      {/* Moving Scanlines */}
      <div
        className="absolute inset-0 pointer-events-none z-30 opacity-20 bg-[linear-gradient(rgba(18,16,16,0)_50%,rgba(0,0,0,0.25)_50%),linear-gradient(90deg,rgba(255,0,0,0.06),rgba(0,255,0,0.02),rgba(0,0,255,0.06))]"
        style={{
          backgroundSize: "100% 4px, 3px 100%",
          animation: `scanlines ${scanlineSpeed}s linear infinite`
        }}
      />
      <style dangerouslySetInnerHTML={{__html: `
        @keyframes scanlines {
          from { background-position: 0 0, 0 0; }
          to { background-position: 0 100%, 0 0; }
        }
        @keyframes flicker {
          0% { opacity: 0.95; }
          5% { opacity: 0.85; }
          10% { opacity: 0.95; }
          15% { opacity: 1; }
          100% { opacity: 1; }
        }
        @keyframes cursorBlink {
          0%, 100% { opacity: 1; }
          50% { opacity: 0; }
        }
      `}} />

      {/* Subtle Screen Flicker */}
      <div
        className="absolute inset-0 w-full h-full pointer-events-none z-20"
        style={{ animation: `flicker ${flickerIntensity}s infinite alternate` }}
      >
        {/* Terminal Content */}
        <div className="p-8 h-full flex flex-col justify-end text-sm md:text-base leading-relaxed tracking-wider" style={{ textShadow: `0 0 5px ${color}bf` }}>
          <div className="whitespace-pre-wrap">
            {typedText}
            <span ref={cursorRef} className="inline-block w-2.5 h-4 md:w-3 md:h-5 ml-1 align-middle" style={{ backgroundColor: color, animation: "cursorBlink 1s step-end infinite" }} />
          </div>
        </div>
      </div>

      {/* Custom Children container */}
      {children && (
        <div className="absolute inset-0 z-10 flex items-center justify-center">
          {children}
        </div>
      )}

      {/* Screen Glitch Overlay */}
      <div
        className="absolute inset-0 pointer-events-none mix-blend-overlay opacity-30 z-10"
        style={{ backgroundImage: "url('https://grainy-gradients.vercel.app/noise.svg')" }}
      />
    </div>
  );
};