"use client";

import React, { useState, useRef, useEffect } from "react";
import {
  motion,
  AnimatePresence,
  useMotionValue,
  useSpring,
  useTransform,
} from "framer-motion";

import { HTMLMotionProps } from "framer-motion";

export interface PrismVaultProps extends HTMLMotionProps<"div"> {
  primaryColor?: string;
  secondaryColor?: string;
  glowColor?: string;
  title?: string;
  description?: string;
  vaultItems?: Array<{ title: string; value: string; icon: string }>;
}

const DEFAULT_VAULT_ITEMS = [
  { title: "Access Key", value: "K-892A", icon: "🔑" },
  { title: "Verification Hash", value: "0x7F...A1B", icon: "🧠" },
  { title: "Account Balance", value: "9,430.00", icon: "💎" },
  { title: "Region", value: "East-1", icon: "🪐" },
];

export function PrismVault({
  primaryColor = "#ff5c71",
  secondaryColor = "#7fff5e",
  glowColor = "rgba(255, 92, 113, 0.4)",
  title = "SECURE DATA STORAGE",
  description = "AWAITING ACCESS SEQUENCE...",
  vaultItems = DEFAULT_VAULT_ITEMS,
  className = "",
  style,
  ...props
}: PrismVaultProps) {
  const [isExpanded, setIsExpanded] = useState(false);
  const containerRef = useRef<HTMLDivElement>(null);
  const [mounted, setMounted] = useState(false);

  useEffect(() => {
    const timer = setTimeout(() => {
      setMounted(true);
    }, 0);
    return () => clearTimeout(timer);
  }, []);

  // 3D Magnetic Hover Logic
  const mouseX = useMotionValue(0);
  const mouseY = useMotionValue(0);

  const springConfig = { damping: 20, stiffness: 150 };
  const springX = useSpring(mouseX, springConfig);
  const springY = useSpring(mouseY, springConfig);

  const rotateX = useTransform(springY, [-0.5, 0.5], ["15deg", "-15deg"]);
  const rotateY = useTransform(springX, [-0.5, 0.5], ["-15deg", "15deg"]);

  const handleMouseMove = (e: React.MouseEvent<HTMLDivElement>) => {
    if (isExpanded || !containerRef.current) return;
    const rect = containerRef.current.getBoundingClientRect();
    const x = e.clientX - rect.left;
    const y = e.clientY - rect.top;
    const xPct = x / rect.width - 0.5;
    const yPct = y / rect.height - 0.5;

    mouseX.set(xPct);
    mouseY.set(yPct);
  };

  const handleMouseLeave = () => {
    if (isExpanded) return;
    mouseX.set(0);
    mouseY.set(0);
  };

  const toggleExpand = () => {
    setIsExpanded((prev) => !prev);
    if (!isExpanded) {
      mouseX.set(0);
      mouseY.set(0);
    }
  };

  if (!mounted) return null;

  return (
    <motion.div
      ref={containerRef}
      className={`relative w-full max-w-4xl mx-auto flex items-center justify-center min-h-[500px] perspective-1000 ${className}`}
      onMouseMove={handleMouseMove}
      onMouseLeave={handleMouseLeave}
      style={style}
      {...props}
    >
      <motion.div
        className="w-full h-full absolute inset-0 flex items-center justify-center"
        style={{
          rotateX: isExpanded ? "0deg" : rotateX,
          rotateY: isExpanded ? "0deg" : rotateY,
          transformStyle: "preserve-3d",
        }}
      >
        <motion.div
          layout
          className={`relative ${
            isExpanded
              ? "w-full max-w-3xl grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4"
              : "w-64 h-80"
          }`}
          transition={{ duration: 0.8, ease: [0.16, 1, 0.3, 1] }}
        >
          {/* Main Cover Card */}
          <motion.div
            layout
            onClick={toggleExpand}
            className={`
              relative flex flex-col justify-between overflow-hidden cursor-pointer
              backdrop-blur-md border border-white/10
              ${isExpanded ? "col-span-1 md:col-span-2 lg:col-span-2 row-span-2 h-full rounded-3xl" : "absolute inset-0 rounded-2xl z-30"}
            `}
            style={{
              background: `linear-gradient(135deg, rgba(20,20,20,0.8) 0%, rgba(10,10,10,0.95) 100%)`,
              boxShadow: isExpanded
                ? `0 0 40px ${glowColor}, inset 0 0 20px rgba(255,255,255,0.05)`
                : `0 20px 40px rgba(0,0,0,0.8), 0 0 20px ${glowColor}, inset 0 0 10px rgba(255,255,255,0.1)`,
              transform: isExpanded ? "none" : "translateZ(40px)",
            }}
            whileHover={{ scale: isExpanded ? 1 : 1.02 }}
            whileTap={{ scale: 0.98 }}
          >
            {/* Subtle Noise Filter */}
            <div
              className="absolute inset-0 opacity-20 pointer-events-none mix-blend-overlay"
              style={{
                backgroundImage: `url("data:image/svg+xml,%3Csvg viewBox='0 0 200 200' xmlns='http://www.w3.org/2000/svg'%3E%3Cfilter id='noiseFilter'%3E%3CfeTurbulence type='fractalNoise' baseFrequency='0.65' numOctaves='3' stitchTiles='stitch'/%3E%3C/filter%3E%3Crect width='100%25' height='100%25' filter='url(%23noiseFilter)'/%3E%3C/svg%3E")`,
              }}
            />

            <div className="p-6 relative z-10 h-full flex flex-col justify-between">
              <div>
                <motion.div
                  layout
                  className="w-12 h-12 rounded-full flex items-center justify-center mb-4"
                  style={{
                    background: `linear-gradient(135deg, ${primaryColor}20, ${secondaryColor}20)`,
                    border: `1px solid ${primaryColor}50`,
                  }}
                >
                  <span className="text-xl" style={{ textShadow: `0 0 10px ${primaryColor}` }}>
                    {isExpanded ? "🔓" : "🔒"}
                  </span>
                </motion.div>
                <motion.h2
                  layout="position"
                  className="font-bold uppercase tracking-wider"
                  style={{
                    color: "white",
                    fontSize: isExpanded ? "1.5rem" : "1.25rem",
                    fontFamily: "'Anton', sans-serif",
                    letterSpacing: "0.05em",
                  }}
                >
                  {title}
                </motion.h2>
              </div>

              <div className="mt-8">
                <AnimatePresence mode="wait">
                  {!isExpanded ? (
                    <motion.div
                      key="collapsed-content"
                      initial={{ opacity: 0 }}
                      animate={{ opacity: 1 }}
                      exit={{ opacity: 0 }}
                    >
                       <div className="w-full flex justify-center items-center py-4 h-24 relative overflow-visible my-3">
                         <div className="absolute w-20 h-20 rounded-full blur-2xl opacity-40 bg-[radial-gradient(circle,_#ff5c71_0%,_transparent_70%)] animate-pulse" />
                         <svg width="72" height="72" viewBox="0 0 100 100" className="relative z-10 overflow-visible">
                           <motion.g
                             animate={{ rotateY: 360, rotateX: [15, 25, 15] }}
                             transition={{ repeat: Infinity, duration: 8, ease: "linear" }}
                             style={{ originX: "50px", originY: "50px", transformStyle: "preserve-3d" }}
                           >
                             <polygon points="50,15 20,70 50,85" fill="none" stroke={primaryColor} strokeWidth="1" opacity="0.8" />
                             <polygon points="50,15 50,85 80,70" fill="none" stroke={primaryColor} strokeWidth="1" opacity="0.6" strokeDasharray="2,2" />
                             <line x1="20" y1="70" x2="80" y2="70" stroke={primaryColor} strokeWidth="0.5" opacity="0.4" />
                             <circle cx="50" cy="56" r="4" fill={secondaryColor} opacity="0.9" className="animate-ping" style={{ transformOrigin: "50px 56px" }} />
                             <circle cx="50" cy="56" r="3" fill={secondaryColor} />
                           </motion.g>
                         </svg>
                       </div>
                       <p className="text-[10px] text-gray-400 font-mono mb-3 tracking-wider text-center uppercase">
                         {description}
                       </p>
                       <div className="h-[2px] w-full bg-white/10 rounded-full overflow-hidden">
                         <motion.div
                           className="h-full rounded-full"
                           style={{ backgroundColor: primaryColor }}
                           animate={{ width: ["0%", "100%", "0%"] }}
                           transition={{ duration: 3, repeat: Infinity, ease: "linear" }}
                         />
                       </div>
                     </motion.div>
                  ) : (
                    <motion.div
                      key="expanded-content"
                      initial={{ opacity: 0, y: 20 }}
                      animate={{ opacity: 1, y: 0 }}
                      exit={{ opacity: 0, y: -20 }}
                      transition={{ delay: 0.3 }}
                      className="grid grid-cols-2 gap-4"
                    >
                       <div className="p-4 bg-white/5 rounded-xl border border-white/10">
                          <p className="text-xs text-gray-400 font-mono mb-1">STATUS</p>
                          <p className="text-sm text-white font-bold" style={{ color: secondaryColor }}>AUTHORIZED</p>
                       </div>
                       <div className="p-4 bg-white/5 rounded-xl border border-white/10">
                          <p className="text-xs text-gray-400 font-mono mb-1">ENCRYPTION</p>
                          <p className="text-sm text-white font-bold">AES-256-GCM</p>
                       </div>
                    </motion.div>
                  )}
                </AnimatePresence>
              </div>
            </div>

            {/* Decorative Corner Lines */}
            <div className="absolute top-0 right-0 w-8 h-8 border-t-2 border-r-2 opacity-50" style={{ borderColor: primaryColor, margin: "1rem" }} />
            <div className="absolute bottom-0 left-0 w-8 h-8 border-b-2 border-l-2 opacity-50" style={{ borderColor: secondaryColor, margin: "1rem" }} />
          </motion.div>

          {/* Sub-Panels (Stacked when closed, grid when open) */}
          <AnimatePresence>
            {vaultItems.map((item, index) => {

              // Pre-calculate stacked transform for performance
              const stackZ = 20 - index * 20;
              const stackY = index * 10;
              const stackScale = 1 - index * 0.05;

              return (
                <motion.div
                  key={index}
                  layout
                  className={`
                    flex flex-col justify-center items-center text-center p-6
                    backdrop-blur-md border border-white/10 rounded-2xl
                    ${isExpanded ? "col-span-1 min-h-[160px]" : "absolute inset-0"}
                  `}
                  style={{
                    background: `linear-gradient(135deg, rgba(30,30,30,0.8) 0%, rgba(15,15,15,0.9) 100%)`,
                    zIndex: isExpanded ? 1 : 20 - index,
                    transform: isExpanded ? "none" : `translateY(${stackY}px) translateZ(${stackZ}px) scale(${stackScale})`,
                    opacity: isExpanded ? 1 : index < 3 ? 1 - index * 0.2 : 0,
                  }}
                  initial={false}
                  animate={{
                     opacity: isExpanded ? 1 : index < 3 ? 1 - index * 0.2 : 0,
                  }}
                  transition={{ duration: 0.8, ease: [0.16, 1, 0.3, 1] }}
                >
                  {isExpanded && (
                    <motion.div
                      initial={{ opacity: 0, scale: 0.5 }}
                      animate={{ opacity: 1, scale: 1 }}
                      transition={{ delay: 0.4 + index * 0.1, type: "spring" }}
                      className="w-full h-full flex flex-col items-center justify-center"
                    >
                      <span className="text-3xl mb-2 filter drop-shadow-lg">{item.icon}</span>
                      <h3 className="text-xs text-gray-400 font-mono tracking-widest mb-1">{item.title}</h3>
                      <p className="text-lg font-bold text-white tracking-wide">{item.value}</p>
                    </motion.div>
                  )}
                </motion.div>
              );
            })}
          </AnimatePresence>

          {/* Background Glow Ring */}
          <motion.div
            layout
            className="absolute inset-0 rounded-[3rem] pointer-events-none z-[-1]"
            style={{
              border: `1px solid ${primaryColor}20`,
              boxShadow: `0 0 100px ${primaryColor}10, inset 0 0 50px ${secondaryColor}10`,
              transform: isExpanded ? "scale(1.05)" : "translateZ(-20px) scale(1.1)",
              opacity: isExpanded ? 0.5 : 1,
            }}
            transition={{ duration: 0.8 }}
          />

        </motion.div>
      </motion.div>
    </motion.div>
  );
}
