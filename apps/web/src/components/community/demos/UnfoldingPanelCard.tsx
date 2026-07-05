"use client";

import React, { useState } from "react";
import { motion } from "framer-motion";

export interface UnfoldingPanelCardProps extends React.ComponentPropsWithoutRef<"div"> {
  title?: string;
  subtitle?: string;
  primaryColor?: string;
  secondaryColor?: string;
  topContent?: React.ReactNode;
  bottomContent?: React.ReactNode;
  leftContent?: React.ReactNode;
  rightContent?: React.ReactNode;
}

export function UnfoldingPanelCard({
  title = "CORE SYSTEM",
  subtitle = "HOVER TO DEPLOY",
  primaryColor = "#ff5c71",
  secondaryColor = "#7fff5e",
  topContent,
  bottomContent,
  leftContent,
  rightContent,
  className = "",
  style,
  ...props
}: UnfoldingPanelCardProps) {
  const [isHovered, setIsHovered] = useState(false);

  // Physics for the flaps
  const springConfig = { type: "spring" as const, stiffness: 180, damping: 15, mass: 1 };

  return (
    <div
      className={`relative flex items-center justify-center ${className}`}
      style={{
        perspective: "1200px",
        ...style,
      }}
      {...props}
    >
      <div
        className="relative z-10 w-48 h-48 sm:w-64 sm:h-64 cursor-pointer"
        style={{ transformStyle: "preserve-3d" }}
        onMouseEnter={() => setIsHovered(true)}
        onMouseLeave={() => setIsHovered(false)}
        onTouchStart={() => setIsHovered((prev) => !prev)}
      >
        {/* CENTER CARD */}
        <motion.div
          className="absolute inset-0 z-20 flex flex-col items-center justify-center rounded-xl overflow-hidden border border-white/10 backdrop-blur-md shadow-2xl bg-black/60"
          animate={{
            translateZ: isHovered ? 40 : 0,
            boxShadow: isHovered
              ? `0 20px 40px -10px ${primaryColor}40, 0 0 20px -5px ${secondaryColor}30`
              : "0 10px 30px -10px rgba(0,0,0,0.5)",
          }}
          transition={{ ...springConfig, delay: 0 }}
        >
          {/* Noise layer */}
          <div
            className="absolute inset-0 opacity-[0.03] pointer-events-none"
            style={{
              backgroundImage: `url("data:image/svg+xml,%3Csvg viewBox='0 0 200 200' xmlns='http://www.w3.org/2000/svg'%3E%3Cfilter id='noiseFilter'%3E%3CfeTurbulence type='fractalNoise' baseFrequency='0.8' numOctaves='3' stitchTiles='stitch'/%3E%3C/filter%3E%3Crect width='100%25' height='100%25' filter='url(%23noiseFilter)'/%3E%3C/svg%3E")`,
            }}
          />
          <motion.div
            className="text-center p-4 relative z-10"
            animate={{ scale: isHovered ? 1.05 : 1 }}
            transition={springConfig}
          >
            <div
              className="text-2xl font-black mb-1 uppercase tracking-widest"
              style={{
                background: `linear-gradient(135deg, ${primaryColor}, ${secondaryColor})`,
                WebkitBackgroundClip: "text",
                WebkitTextFillColor: "transparent",
              }}
            >
              {title}
            </div>
            <div className="text-[10px] font-mono tracking-widest text-white/50 uppercase">
              {subtitle}
            </div>
          </motion.div>
          {/* Animated glow orb inside center */}
          <motion.div
            className="absolute -bottom-8 -right-8 w-32 h-32 rounded-full blur-[40px] opacity-30 pointer-events-none"
            style={{ backgroundColor: primaryColor }}
            animate={{
              scale: isHovered ? 1.5 : 1,
              opacity: isHovered ? 0.5 : 0.3,
            }}
            transition={{ ...springConfig, delay: 0.1 }}
          />
        </motion.div>

        {/* TOP FLAP */}
        <motion.div
          className="absolute left-0 right-0 h-40 sm:h-48 origin-bottom flex items-center justify-center p-4 rounded-t-xl border border-white/10 backdrop-blur-md bg-black/80 overflow-hidden"
          style={{
            bottom: "100%",
            transformStyle: "preserve-3d",
            borderColor: `${primaryColor}60`,
            borderBottom: "none",
          }}
          initial={{ rotateX: -90, opacity: 0 }}
          animate={{
            rotateX: isHovered ? 0 : -90,
            opacity: isHovered ? 1 : 0,
          }}
          transition={{ ...springConfig, delay: isHovered ? 0.1 : 0.3 }}
        >
          {/* Glass noise */}
          <div className="absolute inset-0 opacity-[0.03] pointer-events-none bg-[url('data:image/svg+xml,%3Csvg viewBox=\'0 0 200 200\' xmlns=\'http://www.w3.org/2000/svg\'%3E%3Cfilter id=\'n\'%3E%3CfeTurbulence type=\'fractalNoise\' baseFrequency=\'0.8\' numOctaves=\'3\' stitchTiles=\'stitch\'/%3E%3C/filter%3E%3Crect width=\'100%25\' height=\'100%25\' filter=\'url(%23n)\'/%3E%3C/svg%3E')]" />
          <div className="relative z-10 w-full h-full text-white/80 font-mono text-xs flex flex-col justify-end pb-2">
            {topContent || (
              <div className="flex flex-col gap-2 opacity-80">
                <div className="text-[10px] text-white/40 mb-1 border-b border-white/10 pb-1">UPLINK_DATA</div>
                <div className="flex justify-between"><span>PACKETS</span> <span style={{ color: primaryColor }}>9,214</span></div>
                <div className="flex justify-between"><span>LATENCY</span> <span style={{ color: secondaryColor }}>12ms</span></div>
                <div className="flex justify-between"><span>NODE_ID</span> <span>0x8F21</span></div>
              </div>
            )}
          </div>
          {/* Hinge Line */}
          <div className="absolute bottom-0 left-4 right-4 h-[1px]" style={{ background: `linear-gradient(90deg, transparent, ${primaryColor}, transparent)` }} />
        </motion.div>

        {/* BOTTOM FLAP */}
        <motion.div
          className="absolute left-0 right-0 h-40 sm:h-48 origin-top flex items-center justify-center p-4 rounded-b-xl border border-white/10 backdrop-blur-md bg-black/80 overflow-hidden"
          style={{
            top: "100%",
            transformStyle: "preserve-3d",
            borderColor: `${secondaryColor}60`,
            borderTop: "none",
          }}
          initial={{ rotateX: 90, opacity: 0 }}
          animate={{
            rotateX: isHovered ? 0 : 90,
            opacity: isHovered ? 1 : 0,
          }}
          transition={{ ...springConfig, delay: isHovered ? 0.2 : 0.2 }}
        >
          <div className="absolute inset-0 opacity-[0.03] pointer-events-none bg-[url('data:image/svg+xml,%3Csvg viewBox=\'0 0 200 200\' xmlns=\'http://www.w3.org/2000/svg\'%3E%3Cfilter id=\'n\'%3E%3CfeTurbulence type=\'fractalNoise\' baseFrequency=\'0.8\' numOctaves=\'3\' stitchTiles=\'stitch\'/%3E%3C/filter%3E%3Crect width=\'100%25\' height=\'100%25\' filter=\'url(%23n)\'/%3E%3C/svg%3E')]" />
          <div className="relative z-10 w-full h-full text-white/80 font-mono text-xs flex flex-col pt-2">
            {bottomContent || (
              <div className="flex flex-col gap-2 opacity-80 h-full">
                <div className="text-[10px] text-white/40 mb-1 border-b border-white/10 pb-1">TERMINAL_OUTPUT</div>
                <div className="text-[10px] text-white/50 leading-relaxed font-mono">
                  &gt; Establishing secure connection... <br/>
                  &gt; Bypassing firewall protocols... <br/>
                  &gt; <span style={{ color: secondaryColor }}>Access granted.</span> <br/>
                  <span className="animate-pulse">_</span>
                </div>
              </div>
            )}
          </div>
          {/* Hinge Line */}
          <div className="absolute top-0 left-4 right-4 h-[1px]" style={{ background: `linear-gradient(90deg, transparent, ${secondaryColor}, transparent)` }} />
        </motion.div>

        {/* LEFT FLAP */}
        <motion.div
          className="absolute top-0 bottom-0 w-32 sm:w-40 origin-right flex items-center justify-center p-4 rounded-l-xl border border-white/10 backdrop-blur-md bg-black/80 overflow-hidden"
          style={{
            right: "100%",
            transformStyle: "preserve-3d",
            borderRight: "none",
          }}
          initial={{ rotateY: 90, opacity: 0 }}
          animate={{
            rotateY: isHovered ? 0 : 90,
            opacity: isHovered ? 1 : 0,
          }}
          transition={{ ...springConfig, delay: isHovered ? 0.3 : 0.1 }}
        >
          <div className="absolute inset-0 opacity-[0.03] pointer-events-none bg-[url('data:image/svg+xml,%3Csvg viewBox=\'0 0 200 200\' xmlns=\'http://www.w3.org/2000/svg\'%3E%3Cfilter id=\'n\'%3E%3CfeTurbulence type=\'fractalNoise\' baseFrequency=\'0.8\' numOctaves=\'3\' stitchTiles=\'stitch\'/%3E%3C/filter%3E%3Crect width=\'100%25\' height=\'100%25\' filter=\'url(%23n)\'/%3E%3C/svg%3E')]" />
          <div className="relative z-10 w-full h-full text-white/80 font-mono flex flex-col justify-between items-end pr-2 opacity-80">
            {leftContent || (
              <>
                <div className="h-2 w-full bg-white/10 rounded-full overflow-hidden flex justify-end">
                  <div className="h-full bg-white w-1/3" />
                </div>
                <div className="h-2 w-full bg-white/10 rounded-full overflow-hidden flex justify-end">
                  <div className="h-full w-2/3" style={{ backgroundColor: primaryColor }} />
                </div>
                <div className="h-2 w-full bg-white/10 rounded-full overflow-hidden flex justify-end">
                  <div className="h-full w-1/2" style={{ backgroundColor: secondaryColor }} />
                </div>
                <div className="h-2 w-full bg-white/10 rounded-full overflow-hidden flex justify-end">
                  <div className="h-full w-5/6 bg-white/30" />
                </div>
                <div className="h-2 w-full bg-white/10 rounded-full overflow-hidden flex justify-end">
                  <div className="h-full w-1/4 bg-white/50" />
                </div>
              </>
            )}
          </div>
          {/* Hinge Line */}
          <div className="absolute top-4 bottom-4 right-0 w-[1px]" style={{ background: `linear-gradient(180deg, transparent, rgba(255,255,255,0.3), transparent)` }} />
        </motion.div>

        {/* RIGHT FLAP */}
        <motion.div
          className="absolute top-0 bottom-0 w-32 sm:w-40 origin-left flex items-center justify-center p-4 rounded-r-xl border border-white/10 backdrop-blur-md bg-black/80 overflow-hidden"
          style={{
            left: "100%",
            transformStyle: "preserve-3d",
            borderLeft: "none",
          }}
          initial={{ rotateY: -90, opacity: 0 }}
          animate={{
            rotateY: isHovered ? 0 : -90,
            opacity: isHovered ? 1 : 0,
          }}
          transition={{ ...springConfig, delay: isHovered ? 0.4 : 0 }}
        >
          <div className="absolute inset-0 opacity-[0.03] pointer-events-none bg-[url('data:image/svg+xml,%3Csvg viewBox=\'0 0 200 200\' xmlns=\'http://www.w3.org/2000/svg\'%3E%3Cfilter id=\'n\'%3E%3CfeTurbulence type=\'fractalNoise\' baseFrequency=\'0.8\' numOctaves=\'3\' stitchTiles=\'stitch\'/%3E%3C/filter%3E%3Crect width=\'100%25\' height=\'100%25\' filter=\'url(%23n)\'/%3E%3C/svg%3E')]" />
          <div className="relative z-10 w-full h-full text-white/80 font-mono flex flex-col justify-between pl-2 opacity-80">
            {rightContent || (
              <>
                <div className="text-[10px] text-right text-white/40">SYSTEMS</div>
                <div className="flex gap-2 items-center">
                  <div className="w-2 h-2 rounded-full" style={{ backgroundColor: secondaryColor }} /> <span className="text-xs">PWR</span>
                </div>
                <div className="flex gap-2 items-center">
                  <div className="w-2 h-2 rounded-full bg-white" /> <span className="text-xs">NET</span>
                </div>
                <div className="flex gap-2 items-center">
                  <div className="w-2 h-2 rounded-full" style={{ backgroundColor: primaryColor }} /> <span className="text-xs">SEC</span>
                </div>
                <div className="flex gap-2 items-center">
                  <div className="w-2 h-2 rounded-full bg-white/20" /> <span className="text-xs text-white/40">AUX</span>
                </div>
              </>
            )}
          </div>
          {/* Hinge Line */}
          <div className="absolute top-4 bottom-4 left-0 w-[1px]" style={{ background: `linear-gradient(180deg, transparent, rgba(255,255,255,0.3), transparent)` }} />
        </motion.div>

      </div>
    </div>
  );
}
