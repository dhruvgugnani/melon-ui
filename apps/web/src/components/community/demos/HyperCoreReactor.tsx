"use client";

import * as React from "react";
import { useState, useEffect, useRef } from "react";
import { motion, useMotionValue, useTransform, useSpring, AnimatePresence, animate } from "framer-motion";

export interface HyperCoreReactorProps {
  /** Color of the central core (e.g., "#ff5c71") */
  coreColor?: string;
  /** Color of the glowing charge ring (e.g., "#7fff5e") */
  ringColor?: string;
  /** Duration in milliseconds required to hold to unlock */
  chargeTime?: number;
  /** Callback fired upon successful charge */
  onUnlock?: () => void;
}

export const HyperCoreReactor: React.FC<HyperCoreReactorProps> = ({
  coreColor = "#ff5c71",
  ringColor = "#7fff5e",
  chargeTime = 2000,
  onUnlock,
}) => {
  const [isCharging, setIsCharging] = useState(false);
  const [isUnlocked, setIsUnlocked] = useState(false);
  const containerRef = useRef<HTMLDivElement>(null);

  // Magnetic hover state for the Core
  const mouseX = useMotionValue(0);
  const mouseY = useMotionValue(0);
  const springX = useSpring(mouseX, { stiffness: 300, damping: 20 });
  const springY = useSpring(mouseY, { stiffness: 300, damping: 20 });

  // 3D Tilt for container
  const tiltX = useMotionValue(0);
  const tiltY = useMotionValue(0);
  const rotateX = useSpring(useTransform(tiltY, [-0.5, 0.5], [15, -15]), { stiffness: 300, damping: 30 });
  const rotateY = useSpring(useTransform(tiltX, [-0.5, 0.5], [-15, 15]), { stiffness: 300, damping: 30 });

  const handleMouseMove = (e: React.MouseEvent) => {
    if (!containerRef.current || isCharging || isUnlocked) return;
    const rect = containerRef.current.getBoundingClientRect();
    const x = e.clientX - rect.left - rect.width / 2;
    const y = e.clientY - rect.top - rect.height / 2;

    // Magnetic pull for core
    mouseX.set(x * 0.3);
    mouseY.set(y * 0.3);

    // 3D Tilt calculation (normalized -0.5 to 0.5)
    tiltX.set(x / rect.width);
    tiltY.set(y / rect.height);
  };

  const handleMouseLeave = () => {
    mouseX.set(0);
    mouseY.set(0);
    tiltX.set(0);
    tiltY.set(0);
  };

  // Charge Progress
  const chargeProgress = useMotionValue(0);
  const pathLength = useTransform(chargeProgress, [0, 1], [0, 1]);
  const glowOpacity = useTransform(chargeProgress, [0, 1], [0, 0.8]);

  // Shake Effect during charge
  const shakeX = useMotionValue(0);
  const shakeY = useMotionValue(0);

  useEffect(() => {
    let chargeTimeout: NodeJS.Timeout;
    let shakeInterval: NodeJS.Timeout;
    // eslint-disable-next-line @typescript-eslint/no-explicit-any
    let animationControls: any;

    if (isCharging) {
      // Animate progress smoothly over chargeTime
      animationControls = animate(chargeProgress, 1, {
        duration: chargeTime / 1000,
        ease: "linear",
      });

      // Intense Shake during charge
      shakeInterval = setInterval(() => {
        const intensity = (chargeProgress.get() || 0.1) * 8;
        shakeX.set((Math.random() - 0.5) * intensity);
        shakeY.set((Math.random() - 0.5) * intensity);
      }, 50);

      chargeTimeout = setTimeout(() => {
        setIsUnlocked(true);
        if (onUnlock) onUnlock();
      }, chargeTime);
    } else {
      if (animationControls) animationControls.stop();
      animate(chargeProgress, 0, { duration: 0.3, ease: "easeOut" });
      shakeX.set(0);
      shakeY.set(0);
    }

    return () => {
      clearTimeout(chargeTimeout);
      clearInterval(shakeInterval);
      if (animationControls) animationControls.stop();
    };
  }, [isCharging, chargeTime, onUnlock, chargeProgress, shakeX, shakeY]);

  const handlePointerDown = () => {
    if (!isUnlocked) {
      setIsCharging(true);
      mouseX.set(0);
      mouseY.set(0);
      tiltX.set(0);
      tiltY.set(0);
    }
  };

  const handlePointerUp = () => {
    if (!isUnlocked) setIsCharging(false);
  };

  const reset = () => {
    setIsUnlocked(false);
    setIsCharging(false);
    chargeProgress.set(0);
  };

  return (
    <div className="flex items-center justify-center p-8 min-h-[400px] w-full" style={{ perspective: 1200 }}>
      <motion.div
        ref={containerRef}
        className="relative w-80 h-80 rounded-[40px] overflow-hidden bg-zinc-950 border border-zinc-800/80 shadow-2xl flex items-center justify-center cursor-pointer select-none group"
        onMouseMove={handleMouseMove}
        onMouseLeave={handleMouseLeave}
        onPointerDown={handlePointerDown}
        onPointerUp={handlePointerUp}
        onPointerLeave={handlePointerUp}
        style={{
          x: shakeX,
          y: shakeY,
          rotateX,
          rotateY,
          transformStyle: "preserve-3d",
        }}
        whileHover={{ scale: isUnlocked ? 1 : 1.02 }}
        whileTap={{ scale: isUnlocked ? 1 : 0.98 }}
      >
        {/* Subtle Noise Background */}
        <div
          className="absolute inset-0 opacity-[0.04] pointer-events-none mix-blend-overlay"
          style={{ backgroundImage: 'url("data:image/svg+xml,%3Csvg viewBox=%220 0 200 200%22 xmlns=%22http://www.w3.org/2000/svg%22%3E%3Cfilter id=%22noiseFilter%22%3E%3CfeTurbulence type=%22fractalNoise%22 baseFrequency=%220.85%22 numOctaves=%223%22 stitchTiles=%22stitch%22/%3E%3C/filter%3E%3Crect width=%22100%25%22 height=%22100%25%22 filter=%22url(%23noiseFilter)%22/%3E%3C/svg%3E")' }}
        />

        {/* Ambient Inner Glow depending on charge */}
        <motion.div
          className="absolute inset-0 transition-opacity duration-300 pointer-events-none"
          style={{
            background: `radial-gradient(circle at center, ${ringColor}40 0%, transparent 60%)`,
            opacity: glowOpacity,
          }}
        />

        <AnimatePresence>
          {!isUnlocked ? (
            <motion.div
              key="core-group"
              className="relative flex flex-col items-center justify-center w-full h-full"
              style={{ x: springX, y: springY, translateZ: 50 }}
              exit={{ scale: 15, opacity: 0, filter: "blur(10px)", transition: { duration: 0.8, ease: "easeInOut" } }}
            >
              {/* Outer Ring SVG */}
              <div className="absolute inset-0 flex items-center justify-center pointer-events-none">
                <svg width="180" height="180" viewBox="0 0 180 180">
                  <circle
                    cx="90"
                    cy="90"
                    r="84"
                    fill="none"
                    stroke="#ffffff10"
                    strokeWidth="1"
                    strokeDasharray="4 4"
                  />
                  <circle
                    cx="90"
                    cy="90"
                    r="84"
                    fill="none"
                    stroke="#ffffff20"
                    strokeWidth="2"
                    className="opacity-50"
                  />
                  <motion.circle
                    cx="90"
                    cy="90"
                    r="84"
                    fill="none"
                    stroke={ringColor}
                    strokeWidth="4"
                    strokeLinecap="round"
                    style={{
                      pathLength,
                      rotate: -90,
                      transformOrigin: "center",
                    }}
                    className="drop-shadow-[0_0_12px_rgba(127,255,94,0.6)]"
                  />
                </svg>
              </div>

              {/* Core Element */}
              <motion.div
                className="w-28 h-28 rounded-full flex items-center justify-center relative z-10 overflow-hidden"
                style={{
                  background: `linear-gradient(135deg, ${coreColor} 0%, #000 100%)`,
                  boxShadow: `inset 0 0 20px rgba(255,255,255,0.2), 0 10px 30px ${coreColor}40`,
                }}
                animate={{
                  scale: isCharging ? 0.85 : 1,
                  boxShadow: isCharging
                    ? `inset 0 0 30px rgba(255,255,255,0.5), 0 0 60px ${coreColor}`
                    : `inset 0 0 20px rgba(255,255,255,0.2), 0 10px 30px ${coreColor}40`,
                }}
                transition={{ duration: 0.4, type: "spring", bounce: 0.4 }}
              >
                {/* Internal Holographic Detail */}
                <motion.div
                  className="w-14 h-14 rounded-full border-2 border-white/20 backdrop-blur-md flex items-center justify-center"
                  animate={{
                    rotate: isCharging ? 360 : 0,
                    scale: isCharging ? 1.3 : 1,
                  }}
                  transition={{
                    rotate: { duration: chargeTime / 1000, ease: "linear", repeat: isCharging ? Infinity : 0 },
                    scale: { duration: 0.3 }
                  }}
                >
                  <div className="w-2 h-2 rounded-full bg-white/80 shadow-[0_0_10px_white]" />
                </motion.div>

                {/* Core Glare Overlay */}
                <div className="absolute inset-0 bg-gradient-to-br from-white/30 to-transparent opacity-50 rounded-full pointer-events-none" />
              </motion.div>

              <div className="absolute bottom-8 text-zinc-500 text-[10px] font-medium tracking-[0.2em] uppercase transition-colors duration-300" style={{ color: isCharging ? ringColor : "" }}>
                {isCharging ? "Stabilizing Core..." : "Hold to Ignite"}
              </div>
            </motion.div>
          ) : (
            <motion.div
              key="unlocked-state"
              className="absolute inset-0 flex flex-col items-center justify-center bg-zinc-950 z-20"
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              transition={{ duration: 0.5, delay: 0.1 }}
              style={{ translateZ: 30 }}
            >
              <motion.div
                initial={{ scale: 0.8, opacity: 0, y: 20 }}
                animate={{ scale: 1, opacity: 1, y: 0 }}
                transition={{ type: "spring", bounce: 0.5, delay: 0.3 }}
                className="text-center flex flex-col items-center"
              >
                <div
                  className="w-20 h-20 rounded-2xl mb-6 flex items-center justify-center border relative overflow-hidden"
                  style={{ borderColor: `${ringColor}55`, background: `${ringColor}11`, boxShadow: `0 0 40px ${ringColor}33` }}
                >
                  <div className="absolute inset-0 bg-gradient-to-t from-transparent to-white/10" />
                  <svg width="32" height="32" viewBox="0 0 24 24" fill="none" stroke={ringColor} strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" className="relative z-10">
                    <path d="M22 11.08V12a10 10 0 1 1-5.93-9.14"></path>
                    <polyline points="22 4 12 14.01 9 11.01"></polyline>
                  </svg>
                </div>
                <h3 className="text-white font-semibold text-lg tracking-widest mb-1">REACTOR ONLINE</h3>
                <p className="text-zinc-500 text-xs font-mono mb-8 opacity-80">Energy output stabilized</p>

                <button
                  onClick={(e) => { e.stopPropagation(); reset(); }}
                  className="px-6 py-2 rounded-full border border-zinc-800 bg-zinc-900/50 text-zinc-400 text-[10px] uppercase tracking-widest hover:bg-zinc-800 hover:text-white transition-all duration-300"
                >
                  Initiate Shutdown
                </button>
              </motion.div>
            </motion.div>
          )}
        </AnimatePresence>
      </motion.div>
    </div>
  );
};
