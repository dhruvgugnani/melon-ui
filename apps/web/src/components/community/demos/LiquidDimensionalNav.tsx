"use client";

import React, { useRef, useState, useEffect } from "react";
import { motion, AnimatePresence, useMotionValue, useSpring } from "framer-motion";

export interface NavItem {
  id: string;
  label: string;
  icon: React.ReactNode;
  content: React.ReactNode;
}

export interface LiquidDimensionalNavProps extends React.ComponentPropsWithoutRef<"div"> {
  items?: NavItem[];
  primaryColor?: string;
  accentColor?: string;
  bg?: string;
  borderColor?: string;
}

const DEFAULT_ITEMS: NavItem[] = [
  {
    id: "dashboard",
    label: "Dashboard",
    icon: (
      <svg width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
        <rect x="3" y="3" width="7" height="9" />
        <rect x="14" y="3" width="7" height="5" />
        <rect x="14" y="12" width="7" height="9" />
        <rect x="3" y="16" width="7" height="5" />
      </svg>
    ),
    content: (
      <div className="h-full w-full flex flex-col gap-4">
        <h3 className="font-['Outfit'] font-bold text-2xl text-white">System Core</h3>
        <div className="flex-1 grid grid-cols-2 gap-3">
          <div className="bg-[#111] rounded-xl border border-white/5 p-4 flex flex-col justify-center items-center">
            <span className="text-[#7fff5e] text-3xl font-mono">99%</span>
            <span className="text-white/50 text-xs mt-1">UPTIME</span>
          </div>
          <div className="bg-[#111] rounded-xl border border-white/5 p-4 flex flex-col justify-center items-center">
            <span className="text-[#00f0ff] text-3xl font-mono">12ms</span>
            <span className="text-white/50 text-xs mt-1">LATENCY</span>
          </div>
        </div>
      </div>
    ),
  },
  {
    id: "network",
    label: "Network",
    icon: (
      <svg width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
        <path d="M12 20h9" />
        <path d="M16.5 14h.01" />
        <path d="M12 14h.01" />
        <path d="M7.5 14h.01" />
        <path d="M12 8h.01" />
        <path d="M3 20h6v-6H3v6z" />
        <path d="M12 14v6" />
        <path d="M12 8v6" />
      </svg>
    ),
    content: (
      <div className="h-full w-full flex flex-col gap-4">
        <h3 className="font-['Outfit'] font-bold text-2xl text-white">Neural Net</h3>
        <div className="flex-1 bg-[#111] rounded-xl border border-white/5 p-4 relative overflow-hidden">
          <div className="absolute inset-0 opacity-20" style={{ backgroundImage: "radial-gradient(#ff5c71 1px, transparent 1px)", backgroundSize: "16px 16px" }} />
          <motion.div
            animate={{ x: [0, 100, 0], y: [0, 50, 0] }}
            transition={{ duration: 5, repeat: Infinity, ease: "linear" }}
            className="w-8 h-8 rounded-full bg-[#ff5c71] blur-xl absolute top-1/4 left-1/4"
          />
        </div>
      </div>
    ),
  },
  {
    id: "security",
    label: "Security",
    icon: (
      <svg width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
        <rect x="3" y="11" width="18" height="11" rx="2" ry="2" />
        <path d="M7 11V7a5 5 0 0 1 10 0v4" />
      </svg>
    ),
    content: (
      <div className="h-full w-full flex flex-col gap-4">
        <h3 className="font-['Outfit'] font-bold text-2xl text-white">Firewall</h3>
        <div className="flex-1 border border-[#ff5c71]/30 bg-[#ff5c71]/5 rounded-xl flex items-center justify-center p-4">
          <div className="text-center">
            <svg width="48" height="48" viewBox="0 0 24 24" fill="none" stroke="#ff5c71" strokeWidth="1" strokeLinecap="round" strokeLinejoin="round" className="mx-auto mb-2">
              <path d="M12 22s8-4 8-10V5l-8-3-8 3v7c0 6 8 10 8 10z" />
            </svg>
            <span className="text-[#ff5c71] font-mono text-sm uppercase tracking-widest">Breach Attempt Blocked</span>
          </div>
        </div>
      </div>
    ),
  },
  {
    id: "settings",
    label: "Settings",
    icon: (
      <svg width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
        <circle cx="12" cy="12" r="3" />
        <path d="M19.4 15a1.65 1.65 0 0 0 .33 1.82l.06.06a2 2 0 0 1 0 2.83 2 2 0 0 1-2.83 0l-.06-.06a1.65 1.65 0 0 0-1.82-.33 1.65 1.65 0 0 0-1 1.51V21a2 2 0 0 1-2 2 2 2 0 0 1-2-2v-.09A1.65 1.65 0 0 0 9 19.4a1.65 1.65 0 0 0-1.82.33l-.06.06a2 2 0 0 1-2.83 0 2 2 0 0 1 0-2.83l.06-.06a1.65 1.65 0 0 0 .33-1.82 1.65 1.65 0 0 0-1.51-1H3a2 2 0 0 1-2-2 2 2 0 0 1 2-2h.09A1.65 1.65 0 0 0 4.6 9a1.65 1.65 0 0 0-.33-1.82l-.06-.06a2 2 0 0 1 0-2.83 2 2 0 0 1 2.83 0l.06.06a1.65 1.65 0 0 0 1.82.33H9a1.65 1.65 0 0 0 1-1.51V3a2 2 0 0 1 2-2 2 2 0 0 1 2 2v.09a1.65 1.65 0 0 0 1 1.51 1.65 1.65 0 0 0 1.82-.33l.06-.06a2 2 0 0 1 2.83 0 2 2 0 0 1 0 2.83l-.06.06a1.65 1.65 0 0 0-.33 1.82V9a1.65 1.65 0 0 0 1.51 1H21a2 2 0 0 1 2 2 2 2 0 0 1-2 2h-.09a1.65 1.65 0 0 0-1.51 1z" />
      </svg>
    ),
    content: (
      <div className="h-full w-full flex flex-col gap-4">
        <h3 className="font-['Outfit'] font-bold text-2xl text-white">Parameters</h3>
        <div className="flex-1 bg-[#111] rounded-xl border border-white/5 p-4 flex flex-col gap-3">
          {[1, 2, 3].map((i) => (
            <div key={i} className="flex items-center justify-between">
              <div className="h-2 w-16 bg-white/20 rounded-full" />
              <div className="w-8 h-4 rounded-full bg-white/10 relative">
                <div className="absolute right-0 top-0 bottom-0 w-4 bg-[#7fff5e] rounded-full" />
              </div>
            </div>
          ))}
        </div>
      </div>
    ),
  },
];

const MagneticIcon = ({
  children,
  isActive,
  onClick,
  onHover,
  accentColor
}: {
  children: React.ReactNode;
  isActive: boolean;
  onClick: () => void;
  onHover: () => void;
  accentColor: string;
}) => {
  const ref = useRef<HTMLDivElement>(null);
  const [isHovered, setIsHovered] = useState(false);

  const x = useMotionValue(0);
  const y = useMotionValue(0);

  const springX = useSpring(x, { stiffness: 150, damping: 15, mass: 0.1 });
  const springY = useSpring(y, { stiffness: 150, damping: 15, mass: 0.1 });

  const handleMouseMove = (e: React.MouseEvent<HTMLDivElement>) => {
    if (!ref.current) return;
    const rect = ref.current.getBoundingClientRect();
    const centerX = rect.left + rect.width / 2;
    const centerY = rect.top + rect.height / 2;

    // Calculate distance for magnetic pull
    const distanceX = e.clientX - centerX;
    const distanceY = e.clientY - centerY;

    x.set(distanceX * 0.4);
    y.set(distanceY * 0.4);
  };

  const handleMouseLeave = () => {
    setIsHovered(false);
    x.set(0);
    y.set(0);
  };

  const handleMouseEnter = () => {
    setIsHovered(true);
    onHover();
  };

  return (
    <div
      className="relative p-4 cursor-pointer flex items-center justify-center"
      onMouseMove={handleMouseMove}
      onMouseLeave={handleMouseLeave}
      onMouseEnter={handleMouseEnter}
      onClick={onClick}
    >
      <motion.div
        ref={ref}
        style={{ x: springX, y: springY }}
        className="relative z-10 w-10 h-10 flex items-center justify-center transition-colors duration-300"
        animate={{ color: isActive || isHovered ? accentColor : "rgba(255,255,255,0.4)" }}
      >
        {children}
      </motion.div>
    </div>
  );
};

export function LiquidDimensionalNav({
  items = DEFAULT_ITEMS,
  primaryColor = "#7fff5e",
  accentColor = "#ff5c71",
  bg = "#050505",
  borderColor = "rgba(255, 255, 255, 0.05)",
  className = "",
  style,
  ...props
}: LiquidDimensionalNavProps) {
  const [activeItem, setActiveItem] = useState<string>(items[0].id);
  const [hoveredItem, setHoveredItem] = useState<string | null>(null);
  const [mounted, setMounted] = useState(false);

  useEffect(() => {
    const t = setTimeout(() => setMounted(true), 0);
    return () => clearTimeout(t);
  }, []);

  if (!mounted) return null;

  const currentHover = hoveredItem || activeItem;
  const activeContent = items.find((item) => item.id === activeItem)?.content;

  return (
    <div
      className={`relative w-full h-[500px] flex items-center justify-center font-['Outfit'] ${className}`}
      style={{ backgroundColor: bg, ...style }}
      {...props}
    >
      {/* Background Grid */}
      <div
        className="absolute inset-0 opacity-[0.03] pointer-events-none"
        style={{ backgroundImage: "linear-gradient(#fff 1px, transparent 1px), linear-gradient(90deg, #fff 1px, transparent 1px)", backgroundSize: "30px 30px" }}
      />

      <div className="relative flex items-center h-full max-h-[400px]">
        {/* The Navigation Bar */}
        <motion.div
          className="relative z-20 w-20 bg-black/40 backdrop-blur-xl border rounded-[2rem] py-4 flex flex-col items-center justify-between gap-2 shadow-[0_0_40px_rgba(0,0,0,0.5)]"
          style={{ borderColor }}
          layout
        >
          {/* Liquid Indicator */}
          <div className="absolute inset-y-4 left-0 w-full pointer-events-none flex flex-col items-center gap-2">
            {items.map((item) => (
              <div key={`indicator-${item.id}`} className="relative h-[72px] w-full flex items-center justify-center">
                <AnimatePresence>
                  {currentHover === item.id && (
                    <motion.div
                      layoutId="liquid-blob"
                      initial={{ opacity: 0, scale: 0.8 }}
                      animate={{ opacity: 1, scale: 1 }}
                      exit={{ opacity: 0, scale: 0.8 }}
                      transition={{
                        type: "spring",
                        stiffness: 300,
                        damping: 25,
                        mass: 1
                      }}
                      className="absolute w-12 h-12 rounded-2xl bg-white/5 border border-white/10 shadow-[0_0_20px_rgba(255,255,255,0.05)]"
                    >
                      {/* Inner glow dot */}
                      <motion.div
                        className="absolute right-0 top-1/2 -translate-y-1/2 w-1 h-4 rounded-full shadow-[0_0_10px_currentColor]"
                        style={{ backgroundColor: primaryColor, color: primaryColor }}
                        layoutId="liquid-dot"
                        transition={{ type: "spring", stiffness: 300, damping: 25 }}
                      />
                    </motion.div>
                  )}
                </AnimatePresence>
              </div>
            ))}
          </div>

          {/* Nav Items */}
          <div className="flex flex-col gap-2 w-full relative z-10" onMouseLeave={() => setHoveredItem(null)}>
            {items.map((item) => (
              <MagneticIcon
                key={item.id}
                isActive={activeItem === item.id}
                onHover={() => setHoveredItem(item.id)}
                onClick={() => setActiveItem(item.id)}
                accentColor={primaryColor}
              >
                {item.icon}
              </MagneticIcon>
            ))}
          </div>
        </motion.div>

        {/* The Content Panel (3D Peeling) */}
        <div className="relative z-10 w-[320px] h-[360px] ml-6 perspective-[1000px]">
          <AnimatePresence mode="wait">
            <motion.div
              key={activeItem}
              initial={{ opacity: 0, rotateY: -30, x: -40, scale: 0.95 }}
              animate={{ opacity: 1, rotateY: 0, x: 0, scale: 1 }}
              exit={{ opacity: 0, rotateY: 10, x: 20, scale: 0.95 }}
              transition={{ type: "spring", stiffness: 200, damping: 20, mass: 0.8 }}
              className="absolute inset-0 bg-black/60 backdrop-blur-2xl border rounded-3xl p-6 shadow-[0_20px_50px_rgba(0,0,0,0.5)] transform-origin-left overflow-hidden"
              style={{ borderColor, transformStyle: "preserve-3d" }}
            >
              {/* Decorative top right tech corner */}
              <div className="absolute top-0 right-0 w-16 h-16 pointer-events-none">
                <svg viewBox="0 0 100 100" fill="none" className="w-full h-full opacity-20">
                  <path d="M100 0 L100 100 L0 0 Z" fill="currentColor" />
                  <line x1="80" y1="10" x2="90" y2="20" stroke="white" strokeWidth="2" />
                  <line x1="70" y1="20" x2="80" y2="30" stroke="white" strokeWidth="2" />
                </svg>
              </div>

              {/* Inner glowing edge */}
              <div className="absolute inset-0 border border-white/5 rounded-3xl pointer-events-none" />
              <div
                className="absolute inset-0 opacity-10 pointer-events-none mix-blend-overlay"
                style={{
                  background: `linear-gradient(135deg, ${primaryColor} 0%, transparent 50%, ${accentColor} 100%)`
                }}
              />

              <div className="relative z-10 h-full">
                {activeContent}
              </div>
            </motion.div>
          </AnimatePresence>
        </div>
      </div>
    </div>
  );
}
