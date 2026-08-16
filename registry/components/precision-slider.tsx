"use client";

import * as React from "react";
import { useRef, useState, useEffect } from "react";
import { motion, useMotionValue, useTransform, useSpring, AnimatePresence } from "framer-motion";

export interface PrecisionSliderProps {
  min?: number;
  max?: number;
  step?: number;
  defaultValue?: number;
  onChange?: (val: number) => void;
  accentColor?: string;
  trackColor?: string;
  label?: string;
  unit?: string;
  className?: string;
}

export const PrecisionSlider: React.FC<PrecisionSliderProps> = ({
  min = 0,
  max = 100,
  step = 1,
  defaultValue = 50,
  onChange,
  accentColor = "#7fff5e",
  trackColor = "rgba(255, 255, 255, 0.05)",
  label = "FREQUENCY",
  unit = "HZ",
  className = "",
}) => {
  const trackRef = useRef<HTMLDivElement>(null);
  const [value, setValue] = useState(defaultValue);
  const [isDragging, setIsDragging] = useState(false);
  const [isHovered, setIsHovered] = useState(false);

  // Framer motion values
  const dragX = useMotionValue(0);
  const springX = useSpring(dragX, { stiffness: 400, damping: 30 });

  // Update dragX on mount based on defaultValue
  useEffect(() => {
    if (trackRef.current) {
      const rect = trackRef.current.getBoundingClientRect();
      const initialPercentage = (defaultValue - min) / (max - min);
      dragX.set(initialPercentage * rect.width);
    }
  }, [defaultValue, min, max, dragX]);

  const handlePointerDown = (e: React.PointerEvent) => {
    setIsDragging(true);
    e.currentTarget.setPointerCapture(e.pointerId);
    updateValue(e.clientX, e.shiftKey);
  };

  const handlePointerMove = (e: React.PointerEvent) => {
    if (isDragging) {
      updateValue(e.clientX, e.shiftKey);
    }
  };

  const handlePointerUp = (e: React.PointerEvent) => {
    setIsDragging(false);
    e.currentTarget.releasePointerCapture(e.pointerId);
  };

  const updateValue = (clientX: number, isFineTune: boolean) => {
    if (!trackRef.current) return;
    const rect = trackRef.current.getBoundingClientRect();

    // Normal calculation
    let rawPercentage = (clientX - rect.left) / rect.width;

    // If fine-tuning, reduce sensitivity around the current value
    if (isFineTune && isDragging) {
      const currentPercentage = (value - min) / (max - min);
      const delta = rawPercentage - currentPercentage;
      rawPercentage = currentPercentage + delta * 0.1; // 10% sensitivity for finer control
    }

    const clampedPercentage = Math.max(0, Math.min(1, rawPercentage));

    let newValue = min + clampedPercentage * (max - min);
    if (step) {
      newValue = Math.round(newValue / step) * step;
    }
    newValue = Math.max(min, Math.min(max, newValue));

    if (newValue !== value) {
      setValue(newValue);
      onChange?.(newValue);
    }

    // Update thumb position visually (snapped)
    const snappedPercentage = (newValue - min) / (max - min);
    dragX.set(snappedPercentage * rect.width);
  };

  const fillWidth = useTransform(springX, (x) => {
    if (!trackRef.current) return "0%";
    const rect = trackRef.current.getBoundingClientRect();
    return `${Math.max(0, Math.min(100, (x / rect.width) * 100))}%`;
  });

  // Calculate ticks
  const numTicks = 21; // 21 ticks for a nice dense look
  const ticks = Array.from({ length: numTicks }).map((_, i) => {
    return min + (i / (numTicks - 1)) * (max - min);
  });

  return (
    <div
      className={`relative w-full max-w-md flex flex-col font-mono select-none ${className}`}
      onMouseEnter={() => setIsHovered(true)}
      onMouseLeave={() => setIsHovered(false)}
    >
      {/* Header */}
      <div className="flex justify-between items-end mb-4 px-1">
        <span className="text-xs font-bold tracking-widest text-white/70 uppercase">
          {label}
        </span>
        <div className="flex items-baseline gap-1.5 opacity-80">
          <span className="text-sm font-bold text-white">FINE-TUNE</span>
          <span className="text-[9px] text-white/50 border border-white/20 px-1 rounded-sm tracking-wider">SHIFT</span>
        </div>
      </div>

      {/* Track Container */}
      <div
        className="relative h-16 flex items-center group touch-none"
        ref={trackRef}
        onPointerDown={handlePointerDown}
        onPointerMove={handlePointerMove}
        onPointerUp={handlePointerUp}
        onPointerCancel={handlePointerUp}
      >
        {/* Main Track Line */}
        <div
          className="absolute left-0 right-0 h-1.5 rounded-full overflow-hidden shadow-inner backdrop-blur-sm"
          style={{ backgroundColor: trackColor, border: '1px solid rgba(255,255,255,0.05)' }}
        >
          {/* Active Fill */}
          <motion.div
            className="absolute top-0 bottom-0 left-0 rounded-full"
            style={{
              width: fillWidth,
              backgroundColor: accentColor,
              boxShadow: `0 0 15px ${accentColor}`
            }}
          />
        </div>

        {/* Ticks Grid */}
        <div className="absolute inset-0 flex justify-between items-center pointer-events-none px-2">
          {ticks.map((tick, i) => {
            const isMajor = i % 5 === 0;
            const isPassed = value >= tick;
            const dist = Math.abs(value - tick);
            const maxDist = (max - min) * 0.15;
            const proximityOpacity = Math.max(0, 1 - dist / maxDist);

            return (
              <div key={i} className="flex flex-col items-center justify-center relative h-full">
                <motion.div
                  className="w-[1px] transition-colors duration-300"
                  style={{
                    height: isMajor ? '12px' : '6px',
                    backgroundColor: isPassed ? accentColor : 'rgba(255,255,255,0.15)',
                    opacity: isPassed ? 0.8 : 0.4,
                    boxShadow: proximityOpacity > 0 && isPassed ? `0 0 8px ${accentColor}` : 'none'
                  }}
                  animate={{
                    height: isMajor ? (proximityOpacity > 0.5 ? 16 : 12) : (proximityOpacity > 0.5 ? 8 : 6),
                    backgroundColor: isPassed ? accentColor : (proximityOpacity > 0.2 ? 'rgba(255,255,255,0.5)' : 'rgba(255,255,255,0.15)')
                  }}
                />
              </div>
            );
          })}
        </div>

        {/* Draggable Thumb */}
        <motion.div
          className="absolute top-1/2 -translate-y-1/2 -ml-3 w-6 h-10 bg-[#111] border border-white/20 rounded-md shadow-2xl flex flex-col items-center justify-center gap-1 cursor-grab active:cursor-grabbing z-10"
          style={{ x: springX }}
          whileHover={{ scale: 1.05, borderColor: "rgba(255,255,255,0.4)" }}
          animate={{
            scale: isDragging ? 1.1 : 1,
            borderColor: isDragging ? accentColor : "rgba(255,255,255,0.2)",
            boxShadow: isDragging ? `0 10px 20px -5px ${accentColor}40, 0 0 0 1px ${accentColor}` : "0 4px 10px rgba(0,0,0,0.5)"
          }}
        >
          {/* Thumb Texture (Knurling) */}
          <div className="w-1.5 h-1.5 rounded-full bg-white/40" />
          <div className="w-1.5 h-1.5 rounded-full bg-white/40" />
          <div className="w-1.5 h-1.5 rounded-full bg-white/40" />

          {/* Floating Value Indicator */}
          <AnimatePresence>
            {(isDragging || isHovered) && (
              <motion.div
                initial={{ opacity: 0, y: 10, scale: 0.8 }}
                animate={{ opacity: 1, y: -35, scale: 1 }}
                exit={{ opacity: 0, y: 10, scale: 0.8 }}
                className="absolute top-0 pointer-events-none"
              >
                <div
                  className="bg-[#1a1a1a] border px-2 py-1 rounded shadow-xl flex items-baseline gap-1"
                  style={{ borderColor: `${accentColor}50` }}
                >
                  <span className="text-sm font-bold text-white leading-none">
                    {value.toFixed(step % 1 !== 0 ? 1 : 0)}
                  </span>
                  <span className="text-[9px] text-white/50">{unit}</span>
                </div>
              </motion.div>
            )}
          </AnimatePresence>
        </motion.div>
      </div>

      {/* Min/Max Labels */}
      <div className="flex justify-between items-center mt-2 px-1 text-[10px] text-white/40 tracking-widest font-mono">
        <span>{min.toFixed(0)}</span>
        <div className="h-px flex-1 mx-4 bg-gradient-to-r from-transparent via-white/10 to-transparent" />
        <span>{max.toFixed(0)}</span>
      </div>
    </div>
  );
};
