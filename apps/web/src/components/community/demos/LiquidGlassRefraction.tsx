"use client";

import React, { useRef, useEffect } from "react";
import { motion, useMotionValue, useSpring, useTransform } from "framer-motion";

export interface LiquidGlassRefractionProps extends React.ComponentPropsWithoutRef<"div"> {
  bg?: string;
  primaryColor?: string;
  secondaryColor?: string;
  accentColor?: string;
  distortionScale?: number;
  titleText?: string;
  descriptionText?: string;
  showCard?: boolean;
}

export const LiquidGlassRefraction: React.FC<LiquidGlassRefractionProps> = ({
  bg = "#000000",
  primaryColor = "#ff5c71",
  secondaryColor = "#7fff5e",
  accentColor = "#3b82f6",
  distortionScale = 50,
  titleText = "",
  descriptionText = "",
  showCard = false,
  className = "",
  style,
  children,
  ...props
}) => {
  const containerRef = useRef<HTMLDivElement>(null);
  const mouseX = useMotionValue(500);
  const mouseY = useMotionValue(500);

  // Smooth out mouse movements for the turbulence base frequency
  const springConfig = { damping: 30, stiffness: 100 };
  const smoothX = useSpring(mouseX, springConfig);
  const smoothY = useSpring(mouseY, springConfig);

  // Map mouse position to subtle frequency changes
  const baseFrequencyX = useTransform(smoothX, [0, 2000], [0.01, 0.03]);
  const baseFrequencyY = useTransform(smoothY, [0, 2000], [0.03, 0.01]);

  useEffect(() => {
    const handleMouseMove = (e: MouseEvent) => {
      mouseX.set(e.clientX);
      mouseY.set(e.clientY);
    };

    // Set initial position based on container size if possible
    if (containerRef.current) {
      const rect = containerRef.current.getBoundingClientRect();
      mouseX.set(rect.width / 2);
      mouseY.set(rect.height / 2);
    } else {
      mouseX.set(window.innerWidth / 2);
      mouseY.set(window.innerHeight / 2);
    }

    window.addEventListener("mousemove", handleMouseMove);
    return () => window.removeEventListener("mousemove", handleMouseMove);
  }, [mouseX, mouseY]);

  return (
    <div
      ref={containerRef}
      className={`relative w-full h-[600px] overflow-hidden rounded-xl flex items-center justify-center ${className}`}
      style={{
        backgroundColor: bg,
        ...style
      }}
      {...props}
    >
      {/* Background gradients that will be refracted */}
      <div className="absolute inset-0 opacity-80 pointer-events-none">
        <div 
          className="absolute top-1/4 left-1/4 w-96 h-96 rounded-full mix-blend-screen filter blur-[100px] animate-pulse" 
          style={{ backgroundColor: primaryColor, animationDuration: '8s' }} 
        />
        <div 
          className="absolute bottom-1/4 right-1/4 w-96 h-96 rounded-full mix-blend-screen filter blur-[100px] animate-pulse" 
          style={{ backgroundColor: secondaryColor, animationDuration: '6s', animationDelay: '1s' }} 
        />
        <div 
          className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-80 h-80 rounded-full mix-blend-screen filter blur-[120px] animate-pulse" 
          style={{ backgroundColor: accentColor, animationDuration: '10s', animationDelay: '2s' }} 
        />
      </div>

      {/* SVG Filter Definition for the liquid refraction */}
      <svg className="hidden">
        <defs>
          <filter id="liquid-refraction" x="-20%" y="-20%" width="140%" height="140%">
            <motion.feTurbulence
              type="fractalNoise"
              baseFrequency={useTransform(() => `${baseFrequencyX.get()} ${baseFrequencyY.get()}`)}
              numOctaves="3"
              result="noise"
            />
            <feDisplacementMap
              in="SourceGraphic"
              in2="noise"
              scale={distortionScale}
              xChannelSelector="R"
              yChannelSelector="G"
            />
          </filter>
        </defs>
      </svg>

      {/* The glass layer applying the filter */}
      <div
        className="absolute inset-0 pointer-events-none"
        style={{
          backdropFilter: "blur(10px)",
          WebkitBackdropFilter: "blur(10px)",
          filter: "url(#liquid-refraction)",
        }}
      />

      {/* Optional Foreground Card or Custom Children */}
      {children ? (
        <div className="relative z-10">{children}</div>
      ) : showCard || titleText ? (
        <div className="relative z-10 flex flex-col items-center justify-center p-12 rounded-3xl bg-white/5 border border-white/10 backdrop-blur-md shadow-2xl">
          {titleText && (
            <h2 className="text-4xl md:text-6xl font-black text-white uppercase tracking-tighter mb-4" style={{ fontFamily: "var(--font-londrina-solid)" }}>
              {titleText}
            </h2>
          )}
          {descriptionText && (
            <p className="text-white/70 font-mono text-sm max-w-sm text-center">
              {descriptionText}
            </p>
          )}
        </div>
      ) : null}
    </div>
  );
};
