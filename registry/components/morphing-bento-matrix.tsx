"use client";

import * as React from "react";
import { useState, useRef } from "react";
import {
  motion,
  AnimatePresence,
  useMotionValue,
  useSpring,
  useTransform,
} from "framer-motion";

export interface MorphingBentoMatrixProps
  extends React.HTMLAttributes<HTMLDivElement> {
  primaryColor?: string;
  secondaryColor?: string;
  bgColor?: string;
}

export function MorphingBentoMatrix({
  primaryColor = "#ff5c71",
  secondaryColor = "#7fff5e",
  bgColor = "#050505",
  className = "",
  style,
  ...props
}: MorphingBentoMatrixProps) {
  // Use state to track which cell is hovered (0 = TopLeft, 1 = TopRight, 2 = BottomLeft, 3 = BottomRight, null = none)
  const [hoveredIndex, setHoveredIndex] = useState<number | null>(null);
  const containerRef = useRef<HTMLDivElement>(null);

  // Parallax tracking
  const mouseX = useMotionValue(0.5);
  const mouseY = useMotionValue(0.5);
  const springConfig = { damping: 30, stiffness: 200, mass: 0.5 };
  const smoothX = useSpring(mouseX, springConfig);
  const smoothY = useSpring(mouseY, springConfig);

  const rotateX = useTransform(smoothY, [0, 1], [10, -10]);
  const rotateY = useTransform(smoothX, [0, 1], [-10, 10]);

  const handleMouseMove = (e: React.MouseEvent<HTMLDivElement>) => {
    if (!containerRef.current) return;
    const rect = containerRef.current.getBoundingClientRect();
    const x = (e.clientX - rect.left) / rect.width;
    const y = (e.clientY - rect.top) / rect.height;
    mouseX.set(x);
    mouseY.set(y);
  };

  const handleMouseLeave = () => {
    mouseX.set(0.5);
    mouseY.set(0.5);
    setHoveredIndex(null);
  };

  // Determine flex ratios based on hovered index
  // Row 1 flexes
  const row1Flex = hoveredIndex === 0 || hoveredIndex === 1 ? 2 : 1;
  const row2Flex = hoveredIndex === 2 || hoveredIndex === 3 ? 2 : 1;

  // Col flexes inside rows
  const row1Col1Flex = hoveredIndex === 0 ? 2 : 1;
  const row1Col2Flex = hoveredIndex === 1 ? 2 : 1;

  const row2Col1Flex = hoveredIndex === 2 ? 2 : 1;
  const row2Col2Flex = hoveredIndex === 3 ? 2 : 1;

  const springFlexConfig = {
    type: "spring" as const,
    stiffness: 250,
    damping: 30,
    mass: 0.8,
  };

  return (
    <div
      className={`relative w-full max-w-3xl aspect-square md:aspect-[4/3] flex items-center justify-center p-4 md:p-12 overflow-hidden ${className}`}
      style={{
        backgroundColor: bgColor,
        perspective: "1200px",
        ...style,
      }}
      {...props}
    >
      {/* Background ambient glow */}
      <div
        className="absolute inset-0 opacity-20 pointer-events-none"
        style={{
          background: `radial-gradient(circle at center, ${primaryColor}40 0%, transparent 60%)`,
          filter: "blur(60px)",
        }}
      />

      {/* Main 3D Container */}
      <motion.div
        ref={containerRef}
        onMouseMove={handleMouseMove}
        onMouseLeave={handleMouseLeave}
        style={{
          rotateX,
          rotateY,
          transformStyle: "preserve-3d",
        }}
        className="relative w-full h-full flex flex-col gap-3 md:gap-4 p-3 md:p-4 rounded-3xl border border-white/10 bg-white/[0.02] backdrop-blur-md shadow-2xl"
      >
        {/* Row 1 */}
        <motion.div
          layout
          transition={springFlexConfig}
          className="flex w-full gap-3 md:gap-4"
          style={{ flex: row1Flex }}
        >
          {/* Cell 0: Top Left */}
          <motion.div
            layout
            transition={springFlexConfig}
            onMouseEnter={() => setHoveredIndex(0)}
            onMouseLeave={() => setHoveredIndex(null)}
            onFocus={() => setHoveredIndex(0)}
            onBlur={() => setHoveredIndex(null)}
            tabIndex={0}
            role="group"
            aria-label="Neural Link matrix cell"
            className="relative rounded-2xl overflow-hidden group cursor-pointer border border-white/10 bg-[#0a0a0a] focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-white/60"
            style={{ flex: row1Col1Flex }}
          >
            <CellBackground isActive={hoveredIndex === 0} color={primaryColor} />
            <div className="absolute inset-0 p-4 md:p-6 flex flex-col justify-between z-10 pointer-events-none">
              <div className="flex flex-col md:flex-row md:justify-between items-start gap-1 md:gap-0">
                <span className="text-white/40 text-[10px] md:text-xs font-mono font-semibold tracking-wider">01 // NEXUS CORE</span>
                <StatusDot isActive={hoveredIndex === 0} color={primaryColor} />
              </div>
              <div className="space-y-1">
                <motion.h3
                  layout="position"
                  className="text-white font-['Outfit'] font-bold text-lg md:text-2xl leading-none"
                >
                  Neural Link
                </motion.h3>
                <AnimatePresence>
                  {hoveredIndex === 0 && (
                    <motion.p
                      initial={{ opacity: 0, height: 0, marginTop: 0 }}
                      animate={{ opacity: 1, height: "auto", marginTop: 8 }}
                      exit={{ opacity: 0, height: 0, marginTop: 0 }}
                      transition={{ duration: 0.2 }}
                      className="text-white/60 text-sm font-light"
                    >
                      Establishing high-bandwidth connection to central cortex. Monitoring synaptic flux.
                    </motion.p>
                  )}
                </AnimatePresence>
              </div>
            </div>

            {/* Interactive Visual for Cell 0 */}
            <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-32 h-32 opacity-20 group-hover:opacity-100 transition-opacity duration-500 flex items-center justify-center">
               <motion.div
                 animate={{ rotate: hoveredIndex === 0 ? 180 : 0, scale: hoveredIndex === 0 ? 1.2 : 1 }}
                 transition={{ duration: 1, ease: "easeOut" }}
                 className="relative w-16 h-16 border-2 border-dashed rounded-full flex items-center justify-center"
                 style={{ borderColor: primaryColor }}
               >
                 <div className="w-8 h-8 rounded-full" style={{ backgroundColor: primaryColor }} />
               </motion.div>
            </div>
          </motion.div>

          {/* Cell 1: Top Right */}
          <motion.div
            layout
            transition={springFlexConfig}
            onMouseEnter={() => setHoveredIndex(1)}
            onMouseLeave={() => setHoveredIndex(null)}
            onFocus={() => setHoveredIndex(1)}
            onBlur={() => setHoveredIndex(null)}
            tabIndex={0}
            role="group"
            aria-label="Quantum Flux matrix cell"
            className="relative rounded-2xl overflow-hidden group cursor-pointer border border-white/10 bg-[#0a0a0a] focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-white/60"
            style={{ flex: row1Col2Flex }}
          >
            <CellBackground isActive={hoveredIndex === 1} color={secondaryColor} />
             <div className="absolute inset-0 p-4 md:p-6 flex flex-col justify-between z-10 pointer-events-none">
              <div className="flex flex-col md:flex-row md:justify-between items-start gap-1 md:gap-0">
                <span className="text-white/40 text-[10px] md:text-xs font-mono font-semibold tracking-wider">02 // DATA STREAM</span>
                <StatusDot isActive={hoveredIndex === 1} color={secondaryColor} />
              </div>
              <div className="space-y-1">
                <motion.h3
                  layout="position"
                  className="text-white font-['Outfit'] font-bold text-lg md:text-2xl leading-none"
                >
                  Quantum Flux
                </motion.h3>
                <AnimatePresence>
                  {hoveredIndex === 1 && (
                    <motion.p
                      initial={{ opacity: 0, height: 0, marginTop: 0 }}
                      animate={{ opacity: 1, height: "auto", marginTop: 8 }}
                      exit={{ opacity: 0, height: 0, marginTop: 0 }}
                      transition={{ duration: 0.2 }}
                      className="text-white/60 text-sm font-light"
                    >
                      Routing sub-atomic data packets through the manifold network architecture.
                    </motion.p>
                  )}
                </AnimatePresence>
              </div>
            </div>

             {/* Interactive Visual for Cell 1 */}
             <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-full h-full opacity-10 group-hover:opacity-40 transition-opacity duration-500 flex items-center justify-center overflow-hidden">
                <div className="flex gap-2">
                  {[...Array(5)].map((_, i) => (
                    <motion.div
                      key={i}
                      animate={hoveredIndex === 1 ? { height: [20, 80, 20] } : { height: 20 }}
                      transition={{ duration: 0.8, repeat: Infinity, delay: i * 0.1, ease: "easeInOut" }}
                      className="w-2 rounded-full"
                      style={{ backgroundColor: secondaryColor }}
                    />
                  ))}
                </div>
            </div>
          </motion.div>
        </motion.div>

        {/* Row 2 */}
        <motion.div
          layout
          transition={springFlexConfig}
          className="flex w-full gap-3 md:gap-4"
          style={{ flex: row2Flex }}
        >
          {/* Cell 2: Bottom Left */}
          <motion.div
            layout
            transition={springFlexConfig}
            onMouseEnter={() => setHoveredIndex(2)}
            onMouseLeave={() => setHoveredIndex(null)}
            onFocus={() => setHoveredIndex(2)}
            onBlur={() => setHoveredIndex(null)}
            tabIndex={0}
            role="group"
            aria-label="Firewall Array matrix cell"
            className="relative rounded-2xl overflow-hidden group cursor-pointer border border-white/10 bg-[#0a0a0a] focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-white/60"
            style={{ flex: row2Col1Flex }}
          >
            <CellBackground isActive={hoveredIndex === 2} color="#00f0ff" />
             <div className="absolute inset-0 p-4 md:p-6 flex flex-col justify-between z-10 pointer-events-none">
              <div className="flex flex-col md:flex-row md:justify-between items-start gap-1 md:gap-0">
                <span className="text-white/40 text-[10px] md:text-xs font-mono font-semibold tracking-wider">03 // SECURITY</span>
                <StatusDot isActive={hoveredIndex === 2} color="#00f0ff" />
              </div>
              <div className="space-y-1">
                <motion.h3
                  layout="position"
                  className="text-white font-['Outfit'] font-bold text-lg md:text-2xl leading-none"
                >
                  Firewall Array
                </motion.h3>
                <AnimatePresence>
                  {hoveredIndex === 2 && (
                    <motion.p
                      initial={{ opacity: 0, height: 0, marginTop: 0 }}
                      animate={{ opacity: 1, height: "auto", marginTop: 8 }}
                      exit={{ opacity: 0, height: 0, marginTop: 0 }}
                      transition={{ duration: 0.2 }}
                      className="text-white/60 text-sm font-light"
                    >
                      Active defense mechanisms deployed. Shield resonance at nominal capacity.
                    </motion.p>
                  )}
                </AnimatePresence>
              </div>
            </div>

            {/* Interactive Visual for Cell 2 */}
            <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 opacity-20 group-hover:opacity-100 transition-opacity duration-500">
               <motion.div
                  animate={hoveredIndex === 2 ? { rotate: -180, scale: [1, 1.1, 1] } : { rotate: 0, scale: 1 }}
                  transition={{ duration: 2, repeat: Infinity, ease: "linear" }}
                  className="w-24 h-24 border border-white/20 rounded-lg flex items-center justify-center relative"
               >
                 <div className="absolute inset-2 border border-dashed border-[#00f0ff] opacity-50" />
                 <div className="w-8 h-8 bg-[#00f0ff]/30 backdrop-blur-sm shadow-[0_0_20px_#00f0ff]" />
               </motion.div>
            </div>
          </motion.div>

          {/* Cell 3: Bottom Right */}
          <motion.div
            layout
            transition={springFlexConfig}
            onMouseEnter={() => setHoveredIndex(3)}
            onMouseLeave={() => setHoveredIndex(null)}
            onFocus={() => setHoveredIndex(3)}
            onBlur={() => setHoveredIndex(null)}
            tabIndex={0}
            role="group"
            aria-label="System Vitality matrix cell"
            className="relative rounded-2xl overflow-hidden group cursor-pointer border border-white/10 bg-[#0a0a0a] focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-white/60"
            style={{ flex: row2Col2Flex }}
          >
            <CellBackground isActive={hoveredIndex === 3} color="#f000ff" />
             <div className="absolute inset-0 p-4 md:p-6 flex flex-col justify-between z-10 pointer-events-none">
              <div className="flex flex-col md:flex-row md:justify-between items-start gap-1 md:gap-0">
                <span className="text-white/40 text-[10px] md:text-xs font-mono font-semibold tracking-wider">04 // DIAGNOSTICS</span>
                <StatusDot isActive={hoveredIndex === 3} color="#f000ff" />
              </div>
              <div className="space-y-1">
                <motion.h3
                  layout="position"
                  className="text-white font-['Outfit'] font-bold text-lg md:text-2xl leading-none"
                >
                  System Vitality
                </motion.h3>
                <AnimatePresence>
                  {hoveredIndex === 3 && (
                    <motion.p
                      initial={{ opacity: 0, height: 0, marginTop: 0 }}
                      animate={{ opacity: 1, height: "auto", marginTop: 8 }}
                      exit={{ opacity: 0, height: 0, marginTop: 0 }}
                      transition={{ duration: 0.2 }}
                      className="text-white/60 text-sm font-light"
                    >
                      Core temperature stable. Memory allocation optimal. Predictive engines online.
                    </motion.p>
                  )}
                </AnimatePresence>
              </div>
            </div>

            {/* Interactive Visual for Cell 3 */}
            <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 opacity-20 group-hover:opacity-100 transition-opacity duration-500 w-full h-full p-8 flex flex-col gap-2 justify-center">
                {[...Array(4)].map((_, i) => (
                   <div key={i} className="w-full h-2 bg-white/5 rounded-full overflow-hidden">
                     <motion.div
                        animate={hoveredIndex === 3 ? { x: ["-100%", "200%"] } : { x: "-100%" }}
                        transition={{ duration: 1.5, repeat: Infinity, delay: i * 0.2, ease: "linear" }}
                        className="h-full w-1/2"
                        style={{ backgroundColor: "#f000ff" }}
                     />
                   </div>
                ))}
            </div>
          </motion.div>
        </motion.div>

      </motion.div>
    </div>
  );
}

function CellBackground({ isActive, color }: { isActive: boolean; color: string }) {
  return (
    <motion.div
      initial={false}
      animate={{ opacity: isActive ? 1 : 0 }}
      transition={{ duration: 0.4 }}
      className="absolute inset-0 pointer-events-none"
    >
      <div
        className="absolute inset-0 opacity-10"
        style={{
          background: `radial-gradient(circle at 50% 50%, ${color} 0%, transparent 70%)`
        }}
      />
      {/* Grid Pattern overlay */}
      <div
        className="absolute inset-0 opacity-[0.03]"
        style={{
          backgroundImage: `linear-gradient(to right, #ffffff 1px, transparent 1px), linear-gradient(to bottom, #ffffff 1px, transparent 1px)`,
          backgroundSize: '20px 20px'
        }}
      />
    </motion.div>
  );
}

function StatusDot({ isActive, color }: { isActive: boolean; color: string }) {
  return (
    <div className="flex items-center gap-2">
      <AnimatePresence>
        {isActive && (
          <motion.span
            initial={{ opacity: 0, x: 10 }}
            animate={{ opacity: 1, x: 0 }}
            exit={{ opacity: 0, x: 10 }}
            className="text-[10px] font-mono tracking-widest uppercase"
            style={{ color }}
          >
            Active
          </motion.span>
        )}
      </AnimatePresence>
      <motion.div
        animate={{
          boxShadow: isActive ? `0 0 10px ${color}` : "0 0 0px transparent",
          backgroundColor: isActive ? color : "#333"
        }}
        className="w-2 h-2 rounded-full"
      />
    </div>
  );
}
