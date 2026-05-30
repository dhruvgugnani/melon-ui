"use client";

import React, { useEffect, useState } from "react";
import { motion, useAnimation } from "framer-motion";

export interface LivingAuroraMeshProps extends React.ComponentPropsWithoutRef<"div"> {
  bg?: string;
  color1?: string;
  color2?: string;
  color3?: string;
  opacity?: number;
  blurRadius?: number;
  titleText?: string;
  showCard?: boolean;
}

export const LivingAuroraMesh: React.FC<LivingAuroraMeshProps> = ({
  bg = "#000000",
  color1 = "#ff5c71",
  color2 = "#7fff5e",
  color3 = "#0052e0", // Purple Ban: deep blue instead of purple
  opacity = 0.6,
  blurRadius = 100,
  titleText = "",
  showCard = false,
  className = "",
  style,
  children,
  ...props
}) => {
  const [mounted, setMounted] = useState(false);
  const controls1 = useAnimation();
  const controls2 = useAnimation();
  const controls3 = useAnimation();

  useEffect(() => {
    // Wrap setMounted in a timeout to avoid sync update inside effect
    const timeout = setTimeout(() => setMounted(true), 0);

    // Animate color nodes fluidly around the screen
    controls1.start({
      x: ["0%", "50%", "20%", "-20%", "0%"],
      y: ["0%", "-30%", "40%", "10%", "0%"],
      scale: [1, 1.2, 0.9, 1.1, 1],
      transition: { duration: 25, ease: "linear", repeat: Infinity },
    });

    controls2.start({
      x: ["0%", "-40%", "-10%", "30%", "0%"],
      y: ["0%", "50%", "-20%", "-10%", "0%"],
      scale: [1, 0.8, 1.3, 0.9, 1],
      transition: { duration: 30, ease: "linear", repeat: Infinity },
    });

    controls3.start({
      x: ["0%", "30%", "-30%", "10%", "0%"],
      y: ["0%", "-20%", "30%", "-40%", "0%"],
      scale: [1, 1.4, 0.8, 1.2, 1],
      transition: { duration: 22, ease: "linear", repeat: Infinity },
    });

    return () => clearTimeout(timeout);
  }, [controls1, controls2, controls3]);

  if (!mounted) return <div className="w-full h-[600px] bg-[#050505]" />;

  return (
    <div
      className={`relative w-full h-[600px] overflow-hidden rounded-xl flex items-center justify-center ${className}`}
      style={{
        backgroundColor: bg,
        ...style
      }}
      {...props}
    >
      {/* Aurora Color Nodes */}
      <div 
        className="absolute inset-0 filter saturate-150 pointer-events-none"
        style={{
          opacity: opacity,
          filter: `blur(${blurRadius}px) saturate(1.5)`
        }}
      >
        {/* Neon Pink/Red Node */}
        <motion.div
          animate={controls1}
          className="absolute top-1/4 left-1/4 w-[500px] h-[500px] rounded-full mix-blend-screen"
          style={{ backgroundColor: color1, transformOrigin: "center center" }}
        />

        {/* Neon Green Node */}
        <motion.div
          animate={controls2}
          className="absolute bottom-1/4 right-1/4 w-[600px] h-[400px] rounded-[100%] mix-blend-screen"
          style={{ backgroundColor: color2, transformOrigin: "center center" }}
        />

        {/* Deep Blue Node (compliant with Purple Ban) */}
        <motion.div
          animate={controls3}
          className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[700px] h-[500px] rounded-[100%] mix-blend-screen opacity-70"
          style={{ backgroundColor: color3, transformOrigin: "center center" }}
        />
      </div>

      {/* Grainy Noise Overlay for organic texture */}
      <div
        className="absolute inset-0 opacity-[0.15] mix-blend-overlay pointer-events-none"
        style={{ backgroundImage: "url('https://grainy-gradients.vercel.app/noise.svg')" }}
      />

      {/* Dark Vignette to ground the edges */}
      <div className="absolute inset-0 pointer-events-none bg-[radial-gradient(ellipse_at_center,transparent_20%,#000000_100%)] opacity-80" />

      {/* Optional Foreground Card or Custom Children */}
      {children ? (
        <div className="relative z-10">{children}</div>
      ) : showCard || titleText ? (
        <div className="relative z-10 flex flex-col items-center justify-center p-10 rounded-2xl bg-black/10 border border-white/10 backdrop-blur-xl shadow-2xl">
          {titleText && (
            <h2 className="text-4xl md:text-5xl font-black text-white uppercase tracking-tighter mb-4" style={{ fontFamily: "var(--font-londrina-solid)" }}>
              {titleText}
            </h2>
          )}
          <div className="flex gap-4">
            <div className="h-1 w-12 rounded-full" style={{ backgroundColor: color1 }} />
            <div className="h-1 w-12 rounded-full" style={{ backgroundColor: color2 }} />
          </div>
        </div>
      ) : null}
    </div>
  );
};