"use client";

import * as React from "react";
import { useRef, useState, useEffect } from "react";
import { motion, useMotionValue, useSpring, useTransform, useMotionTemplate } from "framer-motion";

export interface HoloDropSurfaceProps extends React.ComponentPropsWithoutRef<"div"> {
  primaryColor?: string;
  secondaryColor?: string;
  baseColor?: string;
  title?: string;
  subtitle?: string;
}

export function HoloDropSurface({
  primaryColor = "#ff5c71",
  secondaryColor = "#7fff5e",
  baseColor = "#050505",
  title = "HOLO LENS",
  subtitle = "TACTILE FLUID INTERFACE",
  className = "",
  style,
  ...props
}: HoloDropSurfaceProps) {
  const containerRef = useRef<HTMLDivElement>(null);

  const mouseX = useMotionValue(0);
  const mouseY = useMotionValue(0);

  const springConfig = { damping: 25, stiffness: 150, mass: 0.5 };
  const smoothX = useSpring(mouseX, springConfig);
  const smoothY = useSpring(mouseY, springConfig);

  const springConfigSlow = { damping: 40, stiffness: 100, mass: 1 };
  const smoothXSlow = useSpring(mouseX, springConfigSlow);
  const smoothYSlow = useSpring(mouseY, springConfigSlow);

  const [isHovered, setIsHovered] = useState(false);
  const opacity = useSpring(isHovered ? 1 : 0, { damping: 20, stiffness: 100 });

  useEffect(() => {
    if (containerRef.current) {
       const rect = containerRef.current.getBoundingClientRect();

       // initial center pos
       mouseX.set(rect.width / 2);
       mouseY.set(rect.height / 2);
    }
  }, [mouseX, mouseY]);

  const handlePointerMove = (e: React.PointerEvent<HTMLDivElement>) => {
    if (!containerRef.current) return;
    const rect = containerRef.current.getBoundingClientRect();
    mouseX.set(e.clientX - rect.left);
    mouseY.set(e.clientY - rect.top);
  };

  // Parallax calculations
  const parallaxX = useTransform(smoothX, [0, 420], [-10, 10]);
  const parallaxY = useTransform(smoothY, [0, 315], [-10, 10]);

  const reverseParallaxX = useTransform(smoothX, [0, 420], [10, -10]);
  const reverseParallaxY = useTransform(smoothY, [0, 315], [10, -10]);

  const coordsText = useMotionTemplate`X:${useTransform(smoothX, v => Math.round(v))} Y:${useTransform(smoothY, v => Math.round(v))}`;

  return (
    <div
      ref={containerRef}
      onPointerMove={handlePointerMove}
      onPointerEnter={() => setIsHovered(true)}
      onPointerLeave={() => setIsHovered(false)}
      className={`relative w-full max-w-[420px] aspect-[4/3] rounded-[24px] overflow-hidden group border border-white/5 shadow-2xl cursor-none ${className}`}
      style={{
         backgroundColor: baseColor,
         ...style
      }}
      {...props}
    >
      {/* Dynamic Grid Background with Parallax */}
      <motion.div
         className="absolute inset-[-10%] w-[120%] h-[120%] opacity-30 pointer-events-none"
         style={{
            x: reverseParallaxX,
            y: reverseParallaxY,
            backgroundImage: "radial-gradient(circle at center, rgba(255,255,255,0.1) 1px, transparent 1px)",
            backgroundSize: "24px 24px"
         }}
      />

      {/* Outer Glow */}
      <motion.div
        className="absolute w-[500px] h-[500px] rounded-full pointer-events-none blur-[100px]"
        style={{
          x: smoothXSlow,
          y: smoothYSlow,
          translateX: "-50%",
          translateY: "-50%",
          background: `radial-gradient(circle, ${primaryColor}20 0%, ${secondaryColor}10 50%, transparent 70%)`,
          opacity: useTransform(opacity, (v) => (v as number) * 0.8 + 0.2)
        }}
      />

      {/* The Holo Drop - Magnifying Lens */}
      <motion.div
        className="absolute w-40 h-40 rounded-full pointer-events-none shadow-[inset_0_0_30px_rgba(255,255,255,0.4),_0_20px_50px_rgba(0,0,0,0.6)] z-20 flex items-center justify-center overflow-hidden"
        style={{
          x: smoothX,
          y: smoothY,
          translateX: "-50%",
          translateY: "-50%",
          backdropFilter: "blur(16px) brightness(1.2)",
          WebkitBackdropFilter: "blur(16px) brightness(1.2)",
          scale: useTransform(opacity, (v) => (v as number) * 0.2 + 0.8),
          border: "1px solid rgba(255,255,255,0.2)"
        }}
      >
        <div className="absolute inset-0 rounded-full bg-gradient-to-br from-white/10 to-transparent pointer-events-none" />
        <motion.div
          className="w-full h-full rounded-full border border-white/20 opacity-50 absolute"
          style={{
             scale: 0.8,
             rotate: useTransform(smoothX, [0, 420], [0, 180])
          }}
        >
           <div className="w-1.5 h-1.5 bg-white rounded-full absolute top-0 left-1/2 -translate-x-1/2 -translate-y-1/2 shadow-[0_0_10px_white]" />
        </motion.div>
      </motion.div>

      {/* Content Container (Parallax) */}
      <motion.div
         className="absolute inset-0 flex flex-col justify-between p-8 pointer-events-none z-10"
         style={{
            x: parallaxX,
            y: parallaxY
         }}
      >
         <div className="flex justify-between items-start">
            <div>
               <motion.div
                 className="inline-block"
                 animate={isHovered ? { letterSpacing: "2px" } : { letterSpacing: "0px" }}
                 transition={{ duration: 0.4, ease: "easeOut" }}
               >
                  <h3 className="text-3xl font-black tracking-tight text-white mix-blend-overlay drop-shadow-md uppercase leading-none">{title}</h3>
               </motion.div>
               <p className="text-[10px] font-mono text-white/50 tracking-[0.2em] mt-2 uppercase">{subtitle}</p>
            </div>
            <div className="px-3 py-1.5 rounded-full border border-white/10 bg-white/5 backdrop-blur-md flex items-center gap-2">
               <div className="w-1.5 h-1.5 rounded-full" style={{ backgroundColor: secondaryColor }} />
               <span className="text-[9px] font-mono text-white/70 tracking-widest">SYS_04</span>
            </div>
         </div>

         <div className="flex justify-between items-end">
            <div className="flex flex-col gap-3">
               <div className="flex items-center gap-2">
                  <div className="text-[9px] font-mono text-white/40 tracking-wider">
                     COORDS
                  </div>
                  <div className="h-px w-8 bg-white/20" />
                  <motion.div className="text-[9px] font-mono text-white/60 w-24">
                     {coordsText}
                  </motion.div>
               </div>
               <div className="flex gap-1.5">
                  {[...Array(6)].map((_, i) => (
                     <div key={i} className="w-6 h-1 bg-white/20 rounded-full overflow-hidden relative">
                        <motion.div
                           className="absolute inset-y-0 left-0 bg-white"
                           initial={{ width: 0 }}
                           animate={{ width: isHovered ? "100%" : "0%" }}
                           transition={{ duration: 0.8, delay: i * 0.1, ease: "easeOut" }}
                        />
                     </div>
                  ))}
               </div>
            </div>

            <motion.svg
               width="48" height="48" viewBox="0 0 48 48" fill="none" xmlns="http://www.w3.org/2000/svg"
               className="opacity-40"
               animate={{ rotate: isHovered ? 90 : 0 }}
               transition={{ duration: 1, ease: "backOut" }}
            >
               <path d="M24 0V48M0 24H48" stroke="white" strokeWidth="1.5" strokeDasharray="2 4"/>
               <circle cx="24" cy="24" r="16" stroke="white" strokeWidth="1.5" strokeDasharray="2 4"/>
               <rect x="18" y="18" width="12" height="12" stroke="white" strokeWidth="1.5" />
            </motion.svg>
         </div>
      </motion.div>

      {/* Glass & Noise Texture */}
      <div
        className="absolute inset-0 opacity-30 mix-blend-overlay pointer-events-none z-30"
        style={{
          backgroundImage: "url('data:image/svg+xml;utf8,%3Csvg viewBox=%220 0 200 200%22 xmlns=%22http://www.w3.org/2000/svg%22%3E%3Cfilter id=%22noiseFilter%22%3E%3CfeTurbulence type=%22fractalNoise%22 baseFrequency=%220.8%22 numOctaves=%223%22 stitchTiles=%22stitch%22/%3E%3C/filter%3E%3Crect width=%22100%25%22 height=%22100%25%22 filter=%22url(%23noiseFilter)%22/%3E%3C/svg%3E')"
        }}
      />
      <div className="absolute inset-0 rounded-[24px] border-[1.5px] border-white/10 pointer-events-none z-40 shadow-[inset_0_0_20px_rgba(255,255,255,0.02)]" />
    </div>
  );
}
