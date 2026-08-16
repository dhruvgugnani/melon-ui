"use client";

import * as React from "react";
import { AnimatePresence, motion, useReducedMotion } from "framer-motion";

const TICK_COUNT = 21;

function clamp(value: number, min: number, max: number) {
  return Math.min(max, Math.max(min, value));
}

function decimalPlaces(value: number) {
  const text = value.toString().toLowerCase();
  if (text.includes("e-")) {
    return Number(text.split("e-")[1]);
  }
  return text.includes(".") ? text.split(".")[1].length : 0;
}

function snapValue(value: number, min: number, max: number, increment: number) {
  const snapped = min + Math.round((value - min) / increment) * increment;
  return Number(clamp(snapped, min, max).toFixed(Math.min(6, decimalPlaces(increment))));
}

export interface PrecisionSliderProps {
  min?: number;
  max?: number;
  step?: number;
  defaultValue?: number;
  onChange?: (value: number) => void;
  accentColor?: string;
  trackColor?: string;
  label?: string;
  unit?: string;
  className?: string;
}

export function PrecisionSlider({
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
}: PrecisionSliderProps) {
  const lowerBound = Math.min(min, max);
  const upperBound = Math.max(min, max);
  const range = upperBound - lowerBound;
  const normalStep = Number.isFinite(step) && step > 0 ? step : 1;
  const fineStep = normalStep / 10;
  const prefersReducedMotion = useReducedMotion();
  const trackRef = React.useRef<HTMLDivElement>(null);
  const dragRef = React.useRef<{
    pointerId: number;
    startX: number;
    startValue: number;
    width: number;
  } | null>(null);
  const [value, setValue] = React.useState(() =>
    snapValue(defaultValue, lowerBound, upperBound, normalStep),
  );
  const [isDragging, setIsDragging] = React.useState(false);
  const [isHovered, setIsHovered] = React.useState(false);
  const [isFocused, setIsFocused] = React.useState(false);

  const normalizedValue = clamp(value, lowerBound, upperBound);
  const percentage = range === 0 ? 0 : ((normalizedValue - lowerBound) / range) * 100;
  const displayPrecision = Math.min(4, decimalPlaces(fineStep));

  const commitValue = (nextValue: number, fineTune = false) => {
    const next = snapValue(
      nextValue,
      lowerBound,
      upperBound,
      fineTune ? fineStep : normalStep,
    );
    if (next === normalizedValue) return;
    setValue(next);
    onChange?.(next);
  };

  const valueFromPointer = (clientX: number) => {
    const rect = trackRef.current?.getBoundingClientRect();
    if (!rect || rect.width === 0 || range === 0) return normalizedValue;
    const ratio = clamp((clientX - rect.left) / rect.width, 0, 1);
    return lowerBound + ratio * range;
  };

  const handlePointerDown = (event: React.PointerEvent<HTMLDivElement>) => {
    const rect = trackRef.current?.getBoundingClientRect();
    if (!rect || rect.width === 0 || range === 0) return;

    event.currentTarget.setPointerCapture(event.pointerId);
    let startValue = normalizedValue;
    if (!event.shiftKey) {
      startValue = snapValue(
        valueFromPointer(event.clientX),
        lowerBound,
        upperBound,
        normalStep,
      );
      commitValue(startValue);
    }

    dragRef.current = {
      pointerId: event.pointerId,
      startX: event.clientX,
      startValue,
      width: rect.width,
    };
    setIsDragging(true);
  };

  const handlePointerMove = (event: React.PointerEvent<HTMLDivElement>) => {
    const drag = dragRef.current;
    if (!drag || drag.pointerId !== event.pointerId || range === 0) return;

    const sensitivity = event.shiftKey ? 0.1 : 1;
    const delta = ((event.clientX - drag.startX) / drag.width) * range * sensitivity;
    commitValue(drag.startValue + delta, event.shiftKey);
  };

  const finishDrag = (event: React.PointerEvent<HTMLDivElement>) => {
    if (event.currentTarget.hasPointerCapture(event.pointerId)) {
      event.currentTarget.releasePointerCapture(event.pointerId);
    }
    dragRef.current = null;
    setIsDragging(false);
  };

  const handleKeyDown = (event: React.KeyboardEvent<HTMLDivElement>) => {
    const increment = event.shiftKey ? fineStep : normalStep;
    const pageIncrement = increment * 10;
    let nextValue: number | undefined;

    switch (event.key) {
      case "ArrowRight":
      case "ArrowUp":
        nextValue = normalizedValue + increment;
        break;
      case "ArrowLeft":
      case "ArrowDown":
        nextValue = normalizedValue - increment;
        break;
      case "PageUp":
        nextValue = normalizedValue + pageIncrement;
        break;
      case "PageDown":
        nextValue = normalizedValue - pageIncrement;
        break;
      case "Home":
        nextValue = lowerBound;
        break;
      case "End":
        nextValue = upperBound;
        break;
      default:
        return;
    }

    event.preventDefault();
    commitValue(nextValue, event.shiftKey);
  };

  const ticks = Array.from({ length: TICK_COUNT }, (_, index) => {
    return lowerBound + (index / (TICK_COUNT - 1)) * range;
  });

  return (
    <div
      className={`relative flex w-full max-w-md select-none flex-col font-mono ${className}`}
      onMouseEnter={() => setIsHovered(true)}
      onMouseLeave={() => setIsHovered(false)}
    >
      <div className="mb-4 flex items-end justify-between gap-3 px-1">
        <span className="text-xs font-bold uppercase tracking-widest text-white/70">
          {label}
        </span>
        <div className="flex items-baseline gap-1.5 opacity-80">
          <span className="text-[10px] font-bold text-white sm:text-xs">FINE-TUNE</span>
          <span className="rounded-sm border border-white/20 px-1 text-[9px] tracking-wider text-white/50">
            SHIFT
          </span>
        </div>
      </div>

      <div
        ref={trackRef}
        role="slider"
        aria-label={label}
        aria-orientation="horizontal"
        aria-valuemin={lowerBound}
        aria-valuemax={upperBound}
        aria-valuenow={normalizedValue}
        aria-valuetext={`${normalizedValue.toFixed(displayPrecision)} ${unit}`}
        aria-disabled={range === 0}
        tabIndex={range === 0 ? -1 : 0}
        className="group relative flex h-16 touch-none items-center rounded-md outline-none focus-visible:ring-2 focus-visible:ring-white/80 focus-visible:ring-offset-4 focus-visible:ring-offset-black"
        onPointerDown={handlePointerDown}
        onPointerMove={handlePointerMove}
        onPointerUp={finishDrag}
        onPointerCancel={finishDrag}
        onLostPointerCapture={() => {
          dragRef.current = null;
          setIsDragging(false);
        }}
        onKeyDown={handleKeyDown}
        onFocus={() => setIsFocused(true)}
        onBlur={() => setIsFocused(false)}
      >
        <div
          className="absolute left-0 right-0 h-1.5 overflow-hidden rounded-full border border-white/5 shadow-inner backdrop-blur-sm"
          style={{ backgroundColor: trackColor }}
        >
          <motion.div
            className="absolute inset-y-0 left-0 rounded-full"
            animate={{ width: `${percentage}%` }}
            transition={{ duration: prefersReducedMotion ? 0 : 0.16, ease: "easeOut" }}
            style={{
              backgroundColor: accentColor,
              boxShadow: `0 0 15px ${accentColor}`,
            }}
          />
        </div>

        <div className="pointer-events-none absolute inset-0 flex items-center justify-between px-2">
          {ticks.map((tick, index) => {
            const isMajor = index % 5 === 0;
            const isPassed = normalizedValue >= tick;
            const maxDistance = range * 0.15;
            const proximity = maxDistance === 0
              ? 1
              : Math.max(0, 1 - Math.abs(normalizedValue - tick) / maxDistance);

            return (
              <div key={index} className="relative flex h-full items-center justify-center">
                <motion.div
                  className="w-px"
                  animate={{
                    height: isMajor ? (proximity > 0.5 ? 16 : 12) : (proximity > 0.5 ? 8 : 6),
                    backgroundColor: isPassed
                      ? accentColor
                      : proximity > 0.2
                        ? "rgba(255,255,255,0.5)"
                        : "rgba(255,255,255,0.15)",
                    opacity: isPassed ? 0.8 : 0.4,
                  }}
                  transition={{ duration: prefersReducedMotion ? 0 : 0.2 }}
                  style={{
                    boxShadow: proximity > 0 && isPassed ? `0 0 8px ${accentColor}` : "none",
                  }}
                />
              </div>
            );
          })}
        </div>

        <motion.div
          className="absolute top-1/2 z-10 flex h-10 w-6 -translate-x-1/2 -translate-y-1/2 cursor-grab flex-col items-center justify-center gap-1 rounded-md border bg-[#111] shadow-2xl active:cursor-grabbing"
          animate={{
            left: `${percentage}%`,
            scale: isDragging ? 1.1 : 1,
            borderColor: isDragging || isFocused ? accentColor : "rgba(255,255,255,0.2)",
            boxShadow: isDragging
              ? `0 10px 20px -5px ${accentColor}40, 0 0 0 1px ${accentColor}`
              : "0 4px 10px rgba(0,0,0,0.5)",
          }}
          transition={{ duration: prefersReducedMotion ? 0 : 0.16, ease: "easeOut" }}
          whileHover={prefersReducedMotion ? undefined : { scale: 1.05 }}
          aria-hidden="true"
        >
          <div className="h-1.5 w-1.5 rounded-full bg-white/40" />
          <div className="h-1.5 w-1.5 rounded-full bg-white/40" />
          <div className="h-1.5 w-1.5 rounded-full bg-white/40" />

          <AnimatePresence>
            {(isDragging || isHovered || isFocused) && (
              <motion.div
                initial={{ opacity: 0, y: 10, scale: 0.8 }}
                animate={{ opacity: 1, y: -35, scale: 1 }}
                exit={{ opacity: 0, y: 10, scale: 0.8 }}
                transition={{ duration: prefersReducedMotion ? 0 : 0.16 }}
                className="pointer-events-none absolute top-0"
              >
                <div
                  className="flex items-baseline gap-1 rounded border bg-[#1a1a1a] px-2 py-1 shadow-xl"
                  style={{ borderColor: `${accentColor}50` }}
                >
                  <span className="text-sm font-bold leading-none text-white">
                    {normalizedValue.toFixed(displayPrecision)}
                  </span>
                  <span className="text-[9px] text-white/50">{unit}</span>
                </div>
              </motion.div>
            )}
          </AnimatePresence>
        </motion.div>
      </div>

      <div className="mt-2 flex items-center justify-between px-1 font-mono text-[10px] tracking-widest text-white/40">
        <span>{lowerBound.toFixed(0)}</span>
        <div className="mx-4 h-px flex-1 bg-gradient-to-r from-transparent via-white/10 to-transparent" />
        <span>{upperBound.toFixed(0)}</span>
      </div>
    </div>
  );
}
