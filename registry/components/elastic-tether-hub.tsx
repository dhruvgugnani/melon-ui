"use client";

import React, { useState, useRef, useEffect } from "react";
import { motion, useMotionValue, useSpring, useTransform, AnimatePresence } from "framer-motion";

// --- Types ---
export interface ActionNodeData {
  id: string;
  label: string;
  icon: React.ReactNode;
  color: string;
}

export interface ElasticTetherHubProps extends React.ComponentPropsWithoutRef<"div"> {
  actions?: ActionNodeData[];
  centerIcon?: React.ReactNode;
  ringColor?: string;
}

// --- Defaults ---
const DEFAULT_ACTIONS: ActionNodeData[] = [
  {
    id: "deploy",
    label: "Deploy",
    color: "#7fff5e",
    icon: (
      <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
        <path d="M21 15v4a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2v-4" />
        <polyline points="17 8 12 3 7 8" />
        <line x1="12" y1="3" x2="12" y2="15" />
      </svg>
    ),
  },
  {
    id: "destroy",
    label: "Destroy",
    color: "#ff5c71",
    icon: (
      <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
        <polyline points="3 6 5 6 21 6" />
        <path d="M19 6v14a2 2 0 0 1-2 2H7a2 2 0 0 1-2-2V6m3 0V4a2 2 0 0 1 2-2h4a2 2 0 0 1 2 2v2" />
        <line x1="10" y1="11" x2="10" y2="17" />
        <line x1="14" y1="11" x2="14" y2="17" />
      </svg>
    ),
  },
  {
    id: "analyze",
    label: "Analyze",
    color: "#60a5fa",
    icon: (
      <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
        <circle cx="12" cy="12" r="10" />
        <polyline points="12 16 16 12 12 8" />
        <line x1="8" y1="12" x2="16" y2="12" />
      </svg>
    ),
  },
];

const CenterIcon = () => (
  <svg width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
    <circle cx="12" cy="12" r="3" />
    <path d="M19.4 15a1.65 1.65 0 0 0 .33 1.82l.06.06a2 2 0 0 1 0 2.83 2 2 0 0 1-2.83 0l-.06-.06a1.65 1.65 0 0 0-1.82-.33 1.65 1.65 0 0 0-1 1.51V21a2 2 0 0 1-2 2 2 2 0 0 1-2-2v-.09A1.65 1.65 0 0 0 9 19.4a1.65 1.65 0 0 0-1.82.33l-.06.06a2 2 0 0 1-2.83 0 2 2 0 0 1 0-2.83l.06-.06a1.65 1.65 0 0 0 .33-1.82 1.65 1.65 0 0 0-1.51-1H3a2 2 0 0 1-2-2 2 2 0 0 1 2-2h.09A1.65 1.65 0 0 0 4.6 9a1.65 1.65 0 0 0-.33-1.82l-.06-.06a2 2 0 0 1 0-2.83 2 2 0 0 1 2.83 0l.06.06a1.65 1.65 0 0 0 1.82.33H9a1.65 1.65 0 0 0 1-1.51V3a2 2 0 0 1 2-2 2 2 0 0 1 2 2v.09a1.65 1.65 0 0 0 1 1.51 1.65 1.65 0 0 0 1.82-.33l.06-.06a2 2 0 0 1 2.83 0 2 2 0 0 1 0 2.83l-.06.06a1.65 1.65 0 0 0-.33 1.82V9a1.65 1.65 0 0 0 1.51 1H21a2 2 0 0 1 2 2 2 2 0 0 1-2 2h-.09a1.65 1.65 0 0 0-1.51 1z" />
  </svg>
);

// --- Subcomponents ---

const TetherNode = ({
  data,
  index,
  total,
  hubRadius,
  isOpen,
  onFire,
}: {
  data: ActionNodeData;
  index: number;
  total: number;
  hubRadius: number;
  isOpen: boolean;
  onFire: (id: string) => void;
}) => {
  const [isHovered, setIsHovered] = useState(false);
  const [isFired, setIsFired] = useState(false);

  // Math for placing nodes in a circle
  const angle = (index / total) * Math.PI * 2 - Math.PI / 2; // Start from top
  const targetX = Math.cos(angle) * hubRadius;
  const targetY = Math.sin(angle) * hubRadius;

  // The core motion values that power the elastic drag
  const x = useMotionValue(0);
  const y = useMotionValue(0);

  // Springs for smooth snapping
  const springConfig = { damping: 15, stiffness: 200, mass: 1 };
  const springX = useSpring(x, springConfig);
  const springY = useSpring(y, springConfig);

  // Use a ref to ensure hooks are called unconditionally
  const isInitialRender = useRef(true);

  // Animate node out to radius when open, back to center when closed
  useEffect(() => {
    if (isInitialRender.current) {
        isInitialRender.current = false;
    }

    if (isOpen && !isFired) {
      x.set(targetX);
      y.set(targetY);
    } else {
      x.set(0);
      y.set(0);
    }
  }, [isOpen, targetX, targetY, x, y, isFired]);

  // Derived values for the line (tether) and styling
  const distance = useTransform(() => {
    const dx = springX.get() - targetX;
    const dy = springY.get() - targetY;
    return Math.sqrt(dx * dx + dy * dy);
  });

  const tetherOpacity = useTransform(distance, [0, 50, 150], [0.2, 0.8, 1]);
  const tetherWidth = useTransform(distance, [0, 150], [2, 6]);

  // Calculate stroke color based on pull distance (getting "hotter")
  const strokeColor = useTransform(distance, [0, 100], ["rgba(255,255,255,0.2)", data.color]);

  // Hook conditionally called in render causes errors, move useTransforms up
  const tetherX2 = useTransform(springX, (val) => `calc(50% + ${val}px)`);
  const tetherY2 = useTransform(springY, (val) => `calc(50% + ${val}px)`);

  const handleDragEnd = () => {
    // Check how far it was pulled from its resting spot
    const currentDist = distance.get();
    const FIRE_THRESHOLD = 80;

    if (currentDist > FIRE_THRESHOLD) {
      setIsFired(true);
      onFire(data.id);

      // Reset after animation
      setTimeout(() => {
        setIsFired(false);
        if (isOpen) {
          x.set(targetX);
          y.set(targetY);
        }
      }, 1000);
    } else {
      // Snap back to base position
      x.set(targetX);
      y.set(targetY);
    }
  };

  return (
    <>
      {/* The Elastic Tether Line */}
      {isOpen && !isFired && (
        <svg
          className="absolute inset-0 pointer-events-none"
          style={{ width: "100%", height: "100%", overflow: "visible" }}
        >
          <motion.line
            x1="50%"
            y1="50%"
            x2={tetherX2}
            y2={tetherY2}
            stroke={strokeColor}
            strokeWidth={tetherWidth}
            strokeLinecap="round"
            style={{ opacity: tetherOpacity }}
          />
        </svg>
      )}

      {/* The Draggable Node */}
      <motion.div
        drag
        dragElastic={0.6}
        dragConstraints={{ left: targetX, right: targetX, top: targetY, bottom: targetY }}
        onDragEnd={handleDragEnd}
        style={{ x: springX, y: springY }}
        className="absolute left-1/2 top-1/2 z-20 cursor-grab active:cursor-grabbing"
        onMouseEnter={() => setIsHovered(true)}
        onMouseLeave={() => setIsHovered(false)}
        initial={{ opacity: 0, scale: 0 }}
        animate={{
          opacity: isOpen && !isFired ? 1 : 0,
          scale: isOpen && !isFired ? (isHovered ? 1.1 : 1) : 0,
        }}
        transition={{ duration: 0.3, type: "spring", bounce: 0.4 }}
      >
        <div
          className="flex -translate-x-1/2 -translate-y-1/2 items-center justify-center w-14 h-14 rounded-full bg-black/60 backdrop-blur-md border border-white/10 shadow-[0_0_20px_rgba(0,0,0,0.5)] transition-colors duration-300 relative group"
          style={{ borderColor: isHovered ? data.color : "rgba(255,255,255,0.1)" }}
        >
          {/* Subtle noise texture */}
        <div className="absolute inset-0 rounded-full opacity-20 mix-blend-overlay pointer-events-none" style={{ backgroundImage: "url('data:image/svg+xml,%3Csvg viewBox=%220 0 200 200%22 xmlns=%22http://www.w3.org/2000/svg%22%3E%3Cfilter id=%22noiseFilter%22%3E%3CfeTurbulence type=%22fractalNoise%22 baseFrequency=%220.65%22 numOctaves=%223%22 stitchTiles=%22stitch%22/%3E%3C/filter%3E%3Crect width=%22100%25%22 height=%22100%25%22 filter=%22url(%23noiseFilter)%22/%3E%3C/svg%3E')" }}></div>

          <div style={{ color: isHovered ? data.color : "#fff" }} className="transition-colors duration-300">
            {data.icon}
          </div>

          {/* Tooltip Label */}
          <AnimatePresence>
            {isHovered && (
              <motion.div
                initial={{ opacity: 0, y: 10, scale: 0.8 }}
                animate={{ opacity: 1, y: 0, scale: 1 }}
                exit={{ opacity: 0, y: 5, scale: 0.9 }}
                className="absolute top-full mt-3 px-3 py-1 rounded-md bg-white/10 backdrop-blur-md border border-white/10 text-xs font-mono font-medium text-white whitespace-nowrap pointer-events-none"
              >
                {data.label}
              </motion.div>
            )}
          </AnimatePresence>
        </div>
      </motion.div>

      {/* Explosion/Fire Animation */}
      <AnimatePresence>
        {isFired && (
          <motion.div
            initial={{ scale: 0.5, opacity: 1 }}
            animate={{ scale: 3, opacity: 0 }}
            exit={{ opacity: 0 }}
            transition={{ duration: 0.6, ease: "easeOut" }}
            className="absolute left-1/2 top-1/2 z-10 w-14 h-14 rounded-full pointer-events-none -translate-x-1/2 -translate-y-1/2"
            style={{
              backgroundColor: data.color,
              boxShadow: `0 0 40px ${data.color}`
            }}
          />
        )}
      </AnimatePresence>
    </>
  );
};

// --- Main Component ---

export function ElasticTetherHub({
  actions = DEFAULT_ACTIONS,
  centerIcon = <CenterIcon />,
  ringColor = "#333",
  className = "",
  style,
  ...props
}: ElasticTetherHubProps) {
  const [isOpen, setIsOpen] = useState(false);
  const hubRadius = 120; // Distance nodes bloom out to

  const handleFire = (id: string) => {
    console.log(`Action fired: ${id}`);
    // In a real app, you might trigger a toast or a router push here
    // We auto-close the hub after a successful action
    setTimeout(() => setIsOpen(false), 800);
  };

  return (
    <div
      className={`relative flex items-center justify-center w-full min-h-[400px] ${className}`}
      style={style}
      {...props}
    >
      {/* Background tracking rings to show drag threshold */}
      <motion.div
        initial={false}
        animate={{
          scale: isOpen ? 1 : 0,
          opacity: isOpen ? 0.3 : 0,
        }}
        transition={{ duration: 0.6, type: "spring" }}
        className="absolute rounded-full border border-dashed pointer-events-none"
        style={{
          width: hubRadius * 2 + 160,
          height: hubRadius * 2 + 160,
          borderColor: ringColor,
        }}
      />

      {/* Nodes and Tethers */}
      {actions.map((action, i) => (
        <TetherNode
          key={action.id}
          data={action}
          index={i}
          total={actions.length}
          hubRadius={hubRadius}
          isOpen={isOpen}
          onFire={handleFire}
        />
      ))}

      {/* Central Hub Button */}
      <motion.button
        onClick={() => setIsOpen(!isOpen)}
        whileHover={{ scale: 1.05 }}
        whileTap={{ scale: 0.95 }}
        className="relative z-30 flex items-center justify-center w-20 h-20 rounded-full bg-black border border-white/20 shadow-[0_0_30px_rgba(255,255,255,0.1)] text-white overflow-hidden group"
      >
        {/* Core glow effect */}
        <div
          className="absolute inset-0 opacity-50 blur-xl transition-all duration-500 group-hover:opacity-100 group-hover:bg-[#ff5c71]/20"
        />

        {/* Subtle noise */}
        <div className="absolute inset-0 rounded-full opacity-20 mix-blend-overlay pointer-events-none" style={{ backgroundImage: "url('data:image/svg+xml,%3Csvg viewBox=%220 0 200 200%22 xmlns=%22http://www.w3.org/2000/svg%22%3E%3Cfilter id=%22noiseFilter%22%3E%3CfeTurbulence type=%22fractalNoise%22 baseFrequency=%220.65%22 numOctaves=%223%22 stitchTiles=%22stitch%22/%3E%3C/filter%3E%3Crect width=%22100%25%22 height=%22100%25%22 filter=%22url(%23noiseFilter)%22/%3E%3C/svg%3E')" }}></div>

        <motion.div
          animate={{ rotate: isOpen ? 135 : 0 }}
          transition={{ duration: 0.4, type: "spring" }}
          className="relative z-10"
        >
          {isOpen ? (
            <svg width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
              <line x1="12" y1="5" x2="12" y2="19" />
              <line x1="5" y1="12" x2="19" y2="12" />
            </svg>
          ) : (
             centerIcon
          )}
        </motion.div>
      </motion.button>

      {/* Help text */}
      <AnimatePresence>
        {isOpen && (
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: 10 }}
            className="absolute bottom-8 text-white/50 font-mono text-sm pointer-events-none"
          >
            Drag nodes outward to trigger
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
}

// Default export for the dynamic registry
export default ElasticTetherHub;
