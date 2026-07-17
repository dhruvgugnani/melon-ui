"use client";

import * as React from 'react';
import { useRef, useState, useEffect } from 'react';
import { motion, useMotionValue, useSpring, useTransform } from "framer-motion";

export interface TactileZipperCardProps extends React.ComponentPropsWithoutRef<"div"> {
  width?: string | number;
  height?: string | number;
  title?: string;
  subtitle?: string;
  glowColor?: string;
  accentColor?: string;
  innerTitle?: string;
  innerContent?: React.ReactNode;
}

export function TactileZipperCard({
  width = 320,
  height = 480,
  title = "SECURE PAYLOAD",
  subtitle = "PULL TO DECRYPT",
  glowColor = "#7fff5e",
  accentColor = "#ff5c71",
  innerTitle = "SYSTEM CORE UNLOCKED",
  innerContent,
  className = "",
  style,
  ...props
}: TactileZipperCardProps) {
  const containerRef = useRef<HTMLDivElement>(null);
  const [mounted, setMounted] = useState(false);
  const [isUnzipped, setIsUnzipped] = useState(false);

  useEffect(() => {
    const t = setTimeout(() => setMounted(true), 0);
    return () => clearTimeout(t);
  }, []);

  // Y position of the zipper pull (-0.5 to 0.5)
  const zipY = useMotionValue(-0.5);
  // Smooth the dragging
  const springZipY = useSpring(zipY, { damping: 20, stiffness: 200, mass: 0.5 });

  // Transform zip position to a clip path percentage (0% to 100%)
  const clipPercent = useTransform(springZipY, [-0.5, 0.5], [0, 100]);

  // Create clip path string for the top overlapping flap
  // When clipPercent is 0, the whole front is shown. When 100, the front is split open.
  const leftFlapClip = useTransform(clipPercent, (val) => {
    // If we want a diagonal tear opening up like a zipper:
    // Left flap: top-left, bottom-left, bottom-center, top-center(variable)
    return `polygon(0 0, 50% ${val}%, 50% 100%, 0 100%)`;
  });

  const rightFlapClip = useTransform(clipPercent, (val) => {
    return `polygon(100% 0, 100% 100%, 50% 100%, 50% ${val}%)`;
  });

  // 3D Tilt for the whole card based on mouse
  const mouseX = useMotionValue(0);
  const mouseY = useMotionValue(0);
  const smoothX = useSpring(mouseX, { damping: 20, stiffness: 150 });
  const smoothY = useSpring(mouseY, { damping: 20, stiffness: 150 });

  const rotateX = useTransform(smoothY, [-0.5, 0.5], [10, -10]);
  const rotateY = useTransform(smoothX, [-0.5, 0.5], [-10, 10]);

  const handleMouseMove = (e: React.MouseEvent<HTMLDivElement>) => {
    if (!containerRef.current) return;
    const rect = containerRef.current.getBoundingClientRect();
    mouseX.set((e.clientX - rect.left) / rect.width - 0.5);
    mouseY.set((e.clientY - rect.top) / rect.height - 0.5);
  };

  const handleMouseLeave = () => {
    mouseX.set(0);
    mouseY.set(0);
  };

  // Draggable Zipper logic
  const handleDrag = (e: MouseEvent | TouchEvent | PointerEvent, info: { point: { x: number; y: number } }) => {
    if (!containerRef.current) return;
    const rect = containerRef.current.getBoundingClientRect();
    // Calculate normalized Y position based on drag offset within container height
    const dragYLocal = info.point.y - rect.top;
    let newY = (dragYLocal / rect.height) - 0.5;

    // Constrain
    if (newY < -0.5) newY = -0.5;
    if (newY > 0.5) newY = 0.5;

    zipY.set(newY);

    if (newY > 0.4) {
      setIsUnzipped(true);
    } else {
      setIsUnzipped(false);
    }
  };

  const defaultInner = (
    <div className="flex flex-col items-center justify-center h-full text-center p-6 space-y-6">
      <motion.div
        className="w-20 h-20 rounded-full flex items-center justify-center relative shadow-[0_0_40px_rgba(127,255,94,0.3)]"
        style={{ border: `1px solid ${glowColor}60`, backgroundColor: `${glowColor}10` }}
        animate={{ scale: [1, 1.1, 1], rotate: [0, 90, 0] }}
        transition={{ duration: 4, repeat: Infinity, ease: "easeInOut" }}
      >
        <div className="absolute inset-0 bg-gradient-to-tr from-transparent via-white/10 to-transparent rounded-full" />
        <div className="w-10 h-10 border-2 border-dashed rounded-full animate-[spin_10s_linear_infinite]" style={{ borderColor: glowColor }} />
        <div className="w-4 h-4 rounded-full absolute" style={{ backgroundColor: glowColor, boxShadow: `0 0 20px ${glowColor}` }} />
      </motion.div>
      <div>
        <h4 className="text-xl font-black text-white tracking-widest uppercase mb-2">{innerTitle}</h4>
        <p className="font-mono text-xs text-white/50 tracking-widest leading-relaxed">
          CORE SYSTEMS ONLINE.
          <br/>
          AWAITING COMMAND INPUT.
        </p>
      </div>

      <div className="w-full h-px bg-gradient-to-r from-transparent via-white/20 to-transparent my-4" />

      <div className="flex w-full justify-between font-mono text-[10px] text-white/40">
        <span>LATENCY: 12MS</span>
        <span>NODE: ALPHA_9</span>
      </div>
    </div>
  );


  if (!mounted) return <div style={{ width, height, ...style }} className={className} />;

  return (
    <div
      ref={containerRef}
      onMouseMove={handleMouseMove}
      onMouseLeave={handleMouseLeave}
      className={`relative flex items-center justify-center perspective-[1000px] ${className}`}
      style={{ width, height, ...style }}
      {...props}
    >
      <motion.div
        className="w-full h-full relative"
        style={{
          rotateX,
          rotateY,
          transformStyle: "preserve-3d",
        }}
      >
        {/* INNER CORE (Revealed when unzipped) */}
        <div
          className="absolute inset-0 rounded-2xl bg-black border border-white/20 shadow-2xl overflow-hidden"
          style={{ transform: "translateZ(-20px)" }}
        >
          {/* Inner Grid Pattern */}
          <div
            className="absolute inset-0 opacity-10 pointer-events-none"
            style={{
              backgroundImage: `radial-gradient(${glowColor} 1px, transparent 1px)`,
              backgroundSize: "20px 20px"
            }}
          />
          {innerContent || defaultInner}
        </div>

        {/* FRONT OUTER SHELL (Split into Left and Right Flaps via Clip Path) */}

        {/* Left Flap */}
        <motion.div
          className="absolute inset-0 rounded-2xl bg-[#111]/80 backdrop-blur-xl border-l border-t border-b border-white/20 shadow-[0_0_30px_rgba(0,0,0,0.8)] flex flex-col items-center p-8 overflow-hidden"
          style={{
            clipPath: leftFlapClip,
            transform: "translateZ(10px)",
            transformOrigin: "left center"
          }}
        >
           {/* Decor */}
           <div className="absolute top-4 left-4 w-4 h-4 border-l-2 border-t-2 border-white/40" />
           <div className="mt-8 text-left w-full">
             <h3 className="font-['Anton'] text-4xl uppercase tracking-wider text-white opacity-90 drop-shadow-md">
               {title.split(' ')[0]}
             </h3>
             <p className="font-mono text-xs mt-2 text-white/50 tracking-[0.2em]">
               {subtitle}
             </p>
           </div>
        </motion.div>

        {/* Right Flap */}
        <motion.div
          className="absolute inset-0 rounded-2xl bg-[#111]/80 backdrop-blur-xl border-r border-t border-b border-white/20 shadow-[0_0_30px_rgba(0,0,0,0.8)] flex flex-col items-center p-8 overflow-hidden"
          style={{
            clipPath: rightFlapClip,
            transform: "translateZ(10px)",
            transformOrigin: "right center"
          }}
        >
           <div className="absolute top-4 right-4 w-4 h-4 border-r-2 border-t-2 border-white/40" />
           <div className="mt-8 text-right w-full flex justify-end">
             <h3 className="font-['Anton'] text-4xl uppercase tracking-wider text-white opacity-90 drop-shadow-md relative -left-[140px] whitespace-nowrap">
               {/* Shift text to align visually with left flap since they are split in half */}
               {title}
             </h3>
           </div>

           {/* Barcode graphic on right side */}
           <div className="absolute bottom-8 right-6 flex gap-[2px] opacity-30">
              {[...Array(12)].map((_,i) => (
                <div key={i} className="bg-white" style={{ width: i%3===0 ? 4 : 2, height: i%4===0 ? 30 : 20 }} />
              ))}
           </div>
        </motion.div>

        {/* Zipper Teeth Line (Visible behind the pull) */}
        <div className="absolute top-0 bottom-0 left-1/2 -translate-x-1/2 w-4 z-10 pointer-events-none flex flex-col justify-between py-4" style={{ transform: "translateZ(15px)" }}>
           {[...Array(20)].map((_,i) => (
             <div key={i} className="w-full h-1.5 bg-black/40 border border-white/10 rounded-sm" />
           ))}
        </div>

        {/* Draggable Zipper Pull */}
        <div className="absolute inset-0 z-20 pointer-events-none" style={{ transform: "translateZ(30px)" }}>
          <motion.div
            className="absolute left-1/2 -translate-x-1/2 pointer-events-auto"


            drag="y"
            dragConstraints={containerRef}
            dragElastic={0}
            dragMomentum={false}
            onDrag={handleDrag as unknown as (e: MouseEvent | TouchEvent | PointerEvent, info: { point: { x: number; y: number } }) => void}
          >
            {/* The physical zipper pull UI */}
            <motion.div
              className="relative -mt-6 w-12 h-16 cursor-grab active:cursor-grabbing group flex flex-col items-center"
              whileHover={{ scale: 1.1 }}
              whileTap={{ scale: 0.9 }}
            >
              {/* Slider head */}
              <div className="w-8 h-6 bg-gradient-to-b from-[#333] to-[#111] rounded-t-lg border border-white/30 shadow-[0_5px_15px_rgba(0,0,0,0.5)] flex items-center justify-center z-10">
                 <div className="w-4 h-1 bg-black/50 rounded-full" />
              </div>
              {/* Pull tab */}
              <div
                className="w-10 h-12 bg-black/80 backdrop-blur-md rounded-b-xl rounded-t-sm border border-white/20 shadow-xl flex flex-col items-center justify-end pb-2 gap-1 -mt-1 origin-top transition-colors group-hover:border-white/40"
                style={{ borderColor: isUnzipped ? accentColor : "rgba(255,255,255,0.2)" }}
              >
                <div className="w-4 h-1 bg-white/20 rounded-full" />
                <div className="w-4 h-1 bg-white/20 rounded-full" />
                <div className="w-4 h-1 bg-white/20 rounded-full" />
              </div>

              {/* Glowing connection spark */}
              <div className="absolute top-4 w-2 h-2 rounded-full z-20" style={{ backgroundColor: accentColor, boxShadow: `0 0 10px ${accentColor}` }} />
            </motion.div>
          </motion.div>
        </div>

      </motion.div>
    </div>
  );
}
