"use client";

import React, { useState, useRef, useEffect } from "react";
import { motion, useAnimation, AnimatePresence } from "framer-motion";

export interface BiometricTouchScannerProps extends React.ComponentPropsWithoutRef<"div"> {
  title?: string;
  subtitle?: string;
  successText?: string;
  primaryColor?: string;
  accentColor?: string;
  scanDuration?: number;
}

export const BiometricTouchScanner = React.forwardRef<HTMLDivElement, BiometricTouchScannerProps>(
  (
    {
      title = "IDENTITY VERIFICATION",
      subtitle = "HOLD TO SCAN",
      successText = "ACCESS GRANTED",
      primaryColor = "#00f0ff",
      accentColor = "#ff5c71",
      scanDuration = 2500,
      className = "",
      style,
      ...props
    },
    ref
  ) => {
    const [isScanning, setIsScanning] = useState(false);
    const [progress, setProgress] = useState(0);
    const [status, setStatus] = useState<"IDLE" | "SCANNING" | "SUCCESS" | "FAILED">("IDLE");
    const scanIntervalRef = useRef<ReturnType<typeof setTimeout> | null>(null);
    const scanControls = useAnimation();
    const ringControls = useAnimation();

    const handlePointerDown = () => {
      if (status === "SUCCESS") return;

      setIsScanning(true);
      setStatus("SCANNING");
      setProgress(0);

      // Start glowing and spinning effects
      scanControls.start({
        opacity: [0.3, 1, 0.8],
        scale: [1, 1.05, 1.02],
        filter: ["blur(0px)", "blur(2px)", "blur(0px)"],
        transition: { duration: 0.8, repeat: Infinity, repeatType: "reverse" }
      });

      ringControls.start({
        rotate: 360,
        transition: { duration: 3, repeat: Infinity, ease: "linear" }
      });

      const startTime = Date.now();

      scanIntervalRef.current = setInterval(() => {
        const elapsed = Date.now() - startTime;
        const currentProgress = Math.min((elapsed / scanDuration) * 100, 100);
        setProgress(currentProgress);

        if (currentProgress >= 100) {
          handleSuccess();
        }
      }, 50);
    };

    const handlePointerUp = () => {
      if (status === "SUCCESS") return;

      setIsScanning(false);
      if (scanIntervalRef.current) {
        clearInterval(scanIntervalRef.current);
      }

      if (progress > 0 && progress < 100) {
        setStatus("FAILED");
        setTimeout(() => {
          setStatus((prev) => (prev !== "SUCCESS" ? "IDLE" : "SUCCESS"));
        }, 1500);
      } else {
        setStatus("IDLE");
      }

      setProgress(0);
      scanControls.stop();
      ringControls.stop();

      scanControls.start({
        opacity: 0.2,
        scale: 1,
        filter: "blur(0px)",
        transition: { duration: 0.3 }
      });
      ringControls.start({
        rotate: 0,
        transition: { duration: 0.5, type: "spring" }
      });
    };

    const handleSuccess = () => {
      if (scanIntervalRef.current) {
        clearInterval(scanIntervalRef.current);
      }
      setIsScanning(false);
      setStatus("SUCCESS");

      scanControls.start({
        opacity: 0,
        scale: 1.5,
        transition: { duration: 0.5 }
      });
      ringControls.stop();

      // Auto reset after 3 seconds for demo purposes
      setTimeout(() => {
        setStatus("IDLE");
        setProgress(0);
        scanControls.start({
          opacity: 0.2,
          scale: 1,
          transition: { duration: 0.5 }
        });
      }, 3000);
    };

    useEffect(() => {
      return () => {
        if (scanIntervalRef.current) {
          clearInterval(scanIntervalRef.current);
        }
      };
    }, []);

    // Fingerprint SVG Path
    const fingerprintPath = "M24.5,12.5c-4.2,0-7.8,2.7-9,6.5M10.8,24.1c1.5-6.5,7.3-11.4,14.3-11.4s12.8,4.9,14.3,11.4M33.7,13c-2.3-3.6-6.1-6-10.5-6s-8.2,2.4-10.5,6M7,31.5C9,20.1,18.9,11.2,30.8,11.2s21.7,8.9,23.8,20.3M24.7,21.5c-1.8,0-3.3,1.5-3.3,3.3v10.5M30.8,21.5c-1.8,0-3.3,1.5-3.3,3.3v10.5M37,21.5c-1.8,0-3.3,1.5-3.3,3.3v10.5M18.7,24.8c0-1.8,1.5-3.3,3.3-3.3M43,24.8c0-1.8-1.5-3.3-3.3-3.3";

    return (
      <div
        ref={ref}
        className={`relative w-[320px] h-[400px] bg-[#050505] rounded-3xl border border-white/10 overflow-hidden flex flex-col items-center justify-between p-8 shadow-2xl ${className}`}
        style={{
          boxShadow: "inset 0 0 40px rgba(0,0,0,0.8), 0 20px 40px rgba(0,0,0,0.5)",
          ...style
        }}
        {...props}
      >
        {/* Abstract Tech Background */}
        <div className="absolute inset-0 opacity-20 pointer-events-none"
             style={{
               backgroundImage: `radial-gradient(circle at 50% 50%, ${primaryColor}20 0%, transparent 60%), linear-gradient(0deg, transparent 24%, rgba(255, 255, 255, .05) 25%, rgba(255, 255, 255, .05) 26%, transparent 27%, transparent 74%, rgba(255, 255, 255, .05) 75%, rgba(255, 255, 255, .05) 76%, transparent 77%, transparent), linear-gradient(90deg, transparent 24%, rgba(255, 255, 255, .05) 25%, rgba(255, 255, 255, .05) 26%, transparent 27%, transparent 74%, rgba(255, 255, 255, .05) 75%, rgba(255, 255, 255, .05) 76%, transparent 77%, transparent)`,
               backgroundSize: "100% 100%, 30px 30px, 30px 30px"
             }}
        />

        {/* Header Text */}
        <div className="z-10 text-center w-full">
          <h3 className="text-white/40 text-[10px] tracking-[0.3em] font-mono mb-2">
            {status === "FAILED" ? "ERROR" : "SYS.VERIFY"}
          </h3>
          <h2 className="text-white text-sm tracking-widest font-bold uppercase relative"
              style={{ textShadow: status === "SUCCESS" ? `0 0 10px ${primaryColor}` : "none" }}>
            {status === "SUCCESS" ? successText : status === "FAILED" ? "VERIFICATION FAILED" : title}
          </h2>
        </div>

        {/* Scanner Area */}
        <div className="relative w-40 h-40 flex items-center justify-center my-4">

          {/* Scanning Laser Line */}
          <AnimatePresence>
            {isScanning && (
              <motion.div
                initial={{ top: "0%", opacity: 0 }}
                animate={{ top: "100%", opacity: [0, 1, 1, 0] }}
                exit={{ opacity: 0 }}
                transition={{ duration: 1.5, repeat: Infinity, ease: "linear" }}
                className="absolute left-0 w-full h-[2px] z-30"
                style={{
                  background: `linear-gradient(90deg, transparent, ${primaryColor}, transparent)`,
                  boxShadow: `0 0 10px ${primaryColor}`
                }}
              />
            )}
          </AnimatePresence>

          {/* Core Fingerprint Button */}
          <motion.div
            className="w-24 h-32 relative z-20 cursor-pointer touch-none"
            onPointerDown={handlePointerDown}
            onPointerUp={handlePointerUp}
            onPointerLeave={handlePointerUp}
            whileHover={{ scale: 1.05 }}
            whileTap={{ scale: 0.95 }}
          >
            {/* The SVG Fingerprint */}
            <svg
              viewBox="0 0 60 60"
              className="w-full h-full"
              style={{
                filter: `drop-shadow(0 0 8px ${status === 'SUCCESS' ? primaryColor : status === 'FAILED' ? accentColor : 'transparent'})`
              }}
            >
              <motion.path
                d={fingerprintPath}
                fill="none"
                stroke={status === "SUCCESS" ? primaryColor : status === "FAILED" ? accentColor : "rgba(255,255,255,0.2)"}
                strokeWidth="2"
                strokeLinecap="round"
                animate={scanControls}
                initial={{ opacity: 0.2 }}
                style={{
                  vectorEffect: "non-scaling-stroke"
                }}
              />

              {/* Overlay path that fills up during scan */}
              <motion.path
                d={fingerprintPath}
                fill="none"
                stroke={primaryColor}
                strokeWidth="2"
                strokeLinecap="round"
                strokeDasharray="200"
                strokeDashoffset={200 - (progress / 100) * 200}
                style={{
                  vectorEffect: "non-scaling-stroke",
                  opacity: status === "IDLE" ? 0 : 1
                }}
              />
            </svg>

            {/* Glowing orb behind fingerprint */}
            <motion.div
              className="absolute inset-0 rounded-full blur-2xl -z-10"
              animate={{
                background: status === "SUCCESS"
                  ? `radial-gradient(circle, ${primaryColor}50 0%, transparent 70%)`
                  : status === "FAILED"
                  ? `radial-gradient(circle, ${accentColor}50 0%, transparent 70%)`
                  : `radial-gradient(circle, ${primaryColor}${isScanning ? '40' : '00'} 0%, transparent 70%)`
              }}
            />
          </motion.div>

          {/* Outer Rotating Ring */}
          <motion.div
            className="absolute inset-0 rounded-full border border-white/5 border-t-white/20 border-r-white/20 pointer-events-none"
            animate={ringControls}
          />
          <motion.div
            className="absolute inset-2 rounded-full border border-dashed border-white/10 pointer-events-none"
            animate={{ rotate: isScanning ? -180 : 0 }}
            transition={{ duration: 4, repeat: Infinity, ease: "linear" }}
          />

        </div>

        {/* Footer Progress & Status */}
        <div className="w-full z-10 flex flex-col items-center gap-3">
          <div className="h-1 w-full bg-white/5 rounded-full overflow-hidden relative">
            <motion.div
              className="absolute top-0 left-0 h-full rounded-full"
              style={{ backgroundColor: status === "FAILED" ? accentColor : primaryColor }}
              animate={{ width: `${progress}%` }}
              transition={{ ease: "linear", duration: 0.1 }}
            />
          </div>

          <div className="flex justify-between w-full text-[10px] font-mono tracking-widest text-white/40">
            <span>{Math.round(progress)}%</span>
            <motion.span
              animate={{ opacity: isScanning ? [0.5, 1, 0.5] : 1 }}
              transition={{ duration: 1, repeat: Infinity }}
            >
              {status === "SCANNING" ? "ANALYZING..." : status === "SUCCESS" ? "UNLOCKED" : status === "FAILED" ? "REJECTED" : subtitle}
            </motion.span>
          </div>
        </div>
      </div>
    );
  }
);

BiometricTouchScanner.displayName = "BiometricTouchScanner";
