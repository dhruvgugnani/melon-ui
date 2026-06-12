export interface ComponentProp {
  name: string;
  type: string;
  defaultValue: string;
  description: string;
  control?: {
    type: "slider" | "text" | "color" | "boolean";
    min?: number;
    max?: number;
    step?: number;
  };
}

export interface ComponentData {
  id: string;
  slug: string;
  title: string;
  description: string;
  category: string;
  tags: string[];
  cliCommand?: string;
  codeSnippet: string;
  componentPath: string;
  scrollable?: boolean;
  usageCode?: string;
  aiPrompt?: string;
  props?: ComponentProp[];
}

export const componentsData: ComponentData[] = [
  {
    id: "kinetic-holo-stack",
    slug: "kinetic-holo-stack",
    title: "Kinetic Holo Stack",
    description: "A highly interactive 'Holo-Stack' card that reveals its layered 3D structural blueprints on hover using physical spring separation and glowing lasers.",
    category: "Cards",
    tags: ["Framer Motion", "3D", "Premium", "Glassmorphism"],
    cliCommand: "npx @melonui-dev/cli add kinetic-holo-stack",
    codeSnippet: `"use client";

import React, { useRef, useState, useEffect } from "react";
import { motion, useMotionValue, useSpring, useTransform, AnimatePresence } from "framer-motion";

export interface StackLayer {
  id: string;
  title: string;
  type: "glass" | "circuit" | "grid" | "hologram";
  color?: string;
  content?: React.ReactNode;
}

export interface KineticHoloStackProps extends React.ComponentPropsWithoutRef<"div"> {
  layers?: StackLayer[];
  baseColor?: string;
  accentColor?: string;
  glowColor?: string;
  width?: number;
  height?: number;
}

const DEFAULT_LAYERS: StackLayer[] = [
  { id: "L1", title: "Glass Casing", type: "glass" },
  { id: "L2", title: "Neural Matrix", type: "grid", color: "#7fff5e" },
  { id: "L3", title: "Logic Circuit", type: "circuit", color: "#ff5c71" },
  { id: "L4", title: "Core Projection", type: "hologram", color: "#00f0ff" }
];

export const KineticHoloStack = React.forwardRef<HTMLDivElement, KineticHoloStackProps>(
  (
    {
      layers = DEFAULT_LAYERS,
      baseColor = "#111111",
      accentColor = "#ff5c71",
      glowColor = "#7fff5e",
      width = 320,
      height = 420,
      className = "",
      style,
      ...props
    },
    forwardedRef
  ) => {
    const internalRef = useRef<HTMLDivElement>(null);
    const ref = (forwardedRef as React.RefObject<HTMLDivElement>) || internalRef;
    const [isHovered, setIsHovered] = useState(false);

    // Mouse tracking for tilt
    const mouseX = useMotionValue(0.5);
    const mouseY = useMotionValue(0.5);

    // Smooth spring physics for tilt
    const springX = useSpring(mouseX, { damping: 20, stiffness: 100, mass: 0.5 });
    const springY = useSpring(mouseY, { damping: 20, stiffness: 100, mass: 0.5 });

    // 2D to 3D Transform Map
    const rotateX = useTransform(springY, [0, 1], [isHovered ? 25 : 5, isHovered ? -25 : -5]);
    const rotateY = useTransform(springX, [0, 1], [isHovered ? -25 : -5, isHovered ? 25 : 5]);
    const rotateZ = useTransform(springX, [0, 1], [isHovered ? -10 : 0, isHovered ? 10 : 0]);

    // Overall Isometric transform when hovered
    const isoRotateX = useSpring(isHovered ? 60 : 0, { damping: 25, stiffness: 120 });
    const isoRotateZ = useSpring(isHovered ? -45 : 0, { damping: 25, stiffness: 120 });

    const handleMouseMove = (e: React.MouseEvent<HTMLDivElement>) => {
      if (!ref.current) return;
      const rect = ref.current.getBoundingClientRect();
      const x = (e.clientX - rect.left) / rect.width;
      const y = (e.clientY - rect.top) / rect.height;
      mouseX.set(x);
      mouseY.set(y);
    };

    const handleMouseLeave = () => {
      setIsHovered(false);
      mouseX.set(0.5);
      mouseY.set(0.5);
    };

    // Layer styles
    const renderLayerContent = (layer: StackLayer, index: number) => {
      const zOffset = isHovered ? (layers.length - 1 - index) * 60 : 0;

      const layerProps = {
        className: "absolute inset-0 rounded-2xl overflow-hidden border border-white/10 backdrop-blur-md flex flex-col justify-between p-6 transition-colors duration-500",
        style: {
          backgroundColor: layer.type === "glass" ? "rgba(20, 20, 20, 0.4)" : "rgba(10, 10, 10, 0.8)",
          borderColor: isHovered ? (layer.color ? \`\${layer.color}50\` : "rgba(255,255,255,0.2)") : "rgba(255,255,255,0.1)",
          boxShadow: isHovered && layer.color ? \`0 0 30px \${layer.color}20\` : "none",
        }
      };

      return (
        <motion.div
          key={layer.id}
          className="absolute inset-0"
          initial={false}
          animate={{ z: zOffset }}
          transition={{ type: "spring", damping: 20, stiffness: 120, delay: index * 0.05 }}
        >
          <div {...layerProps}>
            {/* Top Bar */}
            <div className="flex justify-between items-center w-full z-10">
              <span className="font-mono text-[10px] uppercase tracking-widest text-white/50">
                {layer.id}
              </span>
              <div className="flex gap-1">
                <div className="w-1.5 h-1.5 rounded-full" style={{ backgroundColor: layer.color || accentColor, opacity: isHovered ? 1 : 0.3 }} />
                <div className="w-1.5 h-1.5 rounded-full bg-white/20" />
              </div>
            </div>

            {/* Center Content / Patterns */}
            <div className="flex-1 flex items-center justify-center relative w-full h-full mt-4 mb-4">
              {layer.type === "grid" && (
                <div className="absolute inset-0 opacity-20" style={{
                  backgroundImage: \`linear-gradient(\${layer.color || glowColor} 1px, transparent 1px), linear-gradient(90deg, \${layer.color || glowColor} 1px, transparent 1px)\`,
                  backgroundSize: "20px 20px"
                }} />
              )}
              {layer.type === "circuit" && (
                <svg className="absolute inset-0 w-full h-full opacity-30" viewBox="0 0 100 100" preserveAspectRatio="none">
                  <path d="M10,50 L30,50 L40,20 L60,80 L70,50 L90,50" fill="none" stroke={layer.color || accentColor} strokeWidth="2" strokeLinejoin="round" />
                  <circle cx="10" cy="50" r="3" fill={layer.color || accentColor} />
                  <circle cx="90" cy="50" r="3" fill={layer.color || accentColor} />
                </svg>
              )}
              {layer.type === "hologram" && (
                <motion.div
                  className="w-16 h-16 rounded-full blur-xl"
                  style={{ backgroundColor: layer.color || glowColor }}
                  animate={isHovered ? { scale: [1, 1.5, 1], opacity: [0.5, 0.8, 0.5] } : { scale: 1, opacity: 0.2 }}
                  transition={{ duration: 2, repeat: Infinity, ease: "easeInOut" }}
                />
              )}
              {layer.content && <div className="z-10">{layer.content}</div>}
            </div>

            {/* Bottom Bar */}
            <div className="w-full z-10 flex justify-between items-end">
              <h3 className="font-sans font-bold text-lg text-white/90 tracking-tight leading-none">
                {layer.title}
              </h3>
              {isHovered && (
                <motion.div
                  initial={{ opacity: 0, x: -10 }}
                  animate={{ opacity: 1, x: 0 }}
                  className="font-mono text-[8px] text-white/40 uppercase"
                >
                  Active
                </motion.div>
              )}
            </div>

            {/* Noise Overlay */}
            <div className="absolute inset-0 opacity-[0.03] mix-blend-overlay pointer-events-none" style={{ backgroundImage: "url('data:image/svg+xml;utf8,%3Csvg viewBox=%220 0 200 200%22 xmlns=%22http://www.w3.org/2000/svg%22%3E%3Cfilter id=%22noiseFilter%22%3E%3CfeTurbulence type=%22fractalNoise%22 baseFrequency=%220.8%22 numOctaves=%223%22 stitchTiles=%22stitch%22/%3E%3C/filter%3E%3Crect width=%22100%25%22 height=%22100%25%22 filter=%22url(%23noiseFilter)%22/%3E%3C/svg%3E')" }} />
          </div>
        </motion.div>
      );
    };

    return (
      <div
        ref={ref}
        className={\\\`relative perspective-[2000px] cursor-crosshair \\\${className}\\\`}
        style={{ width, height, ...style }}
        onMouseMove={handleMouseMove}
        onMouseLeave={handleMouseLeave}
        onMouseEnter={() => setIsHovered(true)}
        {...props}
      >
        <motion.div
          className="w-full h-full relative"
          style={{
            transformStyle: "preserve-3d",
            rotateX: isHovered ? isoRotateX : rotateX,
            rotateY: isHovered ? 0 : rotateY,
            rotateZ: isHovered ? isoRotateZ : rotateZ,
          }}
        >
          {/* Base Shadow */}
          <motion.div
            className="absolute inset-0 bg-black/60 blur-2xl rounded-3xl"
            animate={{
              opacity: isHovered ? 0.8 : 0.4,
              scale: isHovered ? 0.9 : 1,
              y: isHovered ? 100 : 20
            }}
            transition={{ type: "spring", damping: 25, stiffness: 120 }}
            style={{ transform: "translateZ(-100px)" }}
          />

          {/* Connecting Laser Lines (visible only on hover) */}
          <AnimatePresence>
            {isHovered && (
              <motion.div
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                exit={{ opacity: 0 }}
                className="absolute inset-0 pointer-events-none"
                style={{ transformStyle: "preserve-3d" }}
              >
                {/* 4 Corner connecting lines */}
                {[
                  { top: "10%", left: "10%" },
                  { top: "10%", right: "10%" },
                  { bottom: "10%", left: "10%" },
                  { bottom: "10%", right: "10%" }
                ].map((pos, i) => (
                  <div
                    key={i}
                    className="absolute w-[1px] bg-gradient-to-b from-transparent via-white/30 to-transparent"
                    style={{
                      ...pos,
                      height: \\\`\\\${layers.length * 60}px\\\`,
                      transform: \\\`translateZ(0px) rotateX(90deg)\\\`,
                      transformOrigin: "top"
                    }}
                  />
                ))}
              </motion.div>
            )}
          </AnimatePresence>

          {/* Render Layers (Bottom to Top) */}
          {layers.map((layer, index) => renderLayerContent(layer, index))}

        </motion.div>
      </div>
    );
  }
);

KineticHoloStack.displayName = "KineticHoloStack";
`,
    componentPath: "components/community/demos/KineticHoloStack.tsx",
    props: [
      {
        name: "baseColor",
        type: "string",
        defaultValue: "#111111",
        description: "The base color of the layers",
        control: { type: "color" }
      },
      {
        name: "accentColor",
        type: "string",
        defaultValue: "#ff5c71",
        description: "The accent color used for circuits and active states",
        control: { type: "color" }
      },
      {
        name: "glowColor",
        type: "string",
        defaultValue: "#7fff5e",
        description: "The glowing color for holograms and matrices",
        control: { type: "color" }
      }
    ]
  },

  {
    id: "kinetic-shard-terminal",
    slug: "kinetic-shard-terminal",
    title: "Kinetic Shard Terminal",
    description: "A highly interactive cyberpunk-style terminal that unlocks via dragging and dropping a 'Data Shard' into a magnetic slot.",
    category: "Cards",
    tags: ["Framer Motion", "Drag and Drop", "Premium", "Cyberpunk"],
    cliCommand: "npx @melonui-dev/cli add kinetic-shard-terminal",
    codeSnippet: `"use client";

import React, { useState, useRef, useEffect } from "react";
import { motion, AnimatePresence, useAnimation, PanInfo } from "framer-motion";

export interface KineticShardTerminalProps extends React.ComponentPropsWithoutRef<"div"> {
  title?: string;
  lockedSubtitle?: string;
  unlockedSubtitle?: string;
  primaryColor?: string;
  accentColor?: string;
  bgColor?: string;
}

export function KineticShardTerminal({
  title = "CORE TERMINAL",
  lockedSubtitle = "AWAITING DATA SHARD",
  unlockedSubtitle = "SYSTEM OVERRIDE SUCCESSFUL",
  primaryColor = "#7fff5e",
  accentColor = "#ff5c71",
  bgColor = "#050505",
  className = "",
  style,
  ...props
}: KineticShardTerminalProps) {
  const [isUnlocked, setIsUnlocked] = useState(false);
  const [isDragging, setIsDragging] = useState(false);
  const containerRef = useRef<HTMLDivElement>(null);
  const slotRef = useRef<HTMLDivElement>(null);
  const shardControls = useAnimation();

  // Reset to locked state after some time in demo (optional) or provide a reset button.
  // We will provide an "Eject" button inside the unlocked dashboard.

  const handleDragStart = () => {
    setIsDragging(true);
  };

  const handleDragEnd = (event: MouseEvent | TouchEvent | PointerEvent, info: PanInfo) => {
    setIsDragging(false);

    if (!slotRef.current || !containerRef.current) {
      shardControls.start({ x: 0, y: 0 });
      return;
    }

    const slotRect = slotRef.current.getBoundingClientRect();
    const containerRect = containerRef.current.getBoundingClientRect();

    // The shard is roughly 120x60, check if drop point is inside the slot area
    const dropX = info.point.x;
    const dropY = info.point.y;

    // Expand the hit area slightly for easier interaction
    const hitArea = {
      left: slotRect.left - 40,
      right: slotRect.right + 40,
      top: slotRect.top - 40,
      bottom: slotRect.bottom + 40
    };

    if (
      dropX >= hitArea.left &&
      dropX <= hitArea.right &&
      dropY >= hitArea.top &&
      dropY <= hitArea.bottom
    ) {
      // Success! Snap in place then unlock
      const targetX = slotRect.left - containerRect.left + (slotRect.width / 2) - 60; // 60 is half shard width
      const targetY = slotRect.top - containerRect.top + (slotRect.height / 2) - 30; // 30 is half shard height

      setIsUnlocked(true);
    } else {
      // Snap back
      shardControls.start({ x: 0, y: 0, transition: { type: "spring", stiffness: 300, damping: 20 } });
    }
  };

  const handleEject = () => {
    setIsUnlocked(false);
    // Reset shard position after layout change
    setTimeout(() => {
      shardControls.start({ x: 0, y: 0, transition: { duration: 0 } });
    }, 100);
  };

  return (
    <div
      ref={containerRef}
      className={\`relative w-full h-[500px] rounded-2xl overflow-hidden flex flex-col items-center justify-center font-['Outfit',sans-serif] \${className}\`}
      style={{
        backgroundColor: bgColor,
        backgroundImage: "radial-gradient(circle at 50% 50%, rgba(255,255,255,0.03) 0%, transparent 100%)",
        ...style
      }}
      {...props}
    >
      {/* Subtle Noise Overlay */}
      <div
        className="absolute inset-0 pointer-events-none opacity-[0.03] z-0"
        style={{ backgroundImage: "url('data:image/svg+xml,%3Csvg viewBox=%220 0 200 200%22 xmlns=%22http://www.w3.org/2000/svg%22%3E%3Cfilter id=%22noiseFilter%22%3E%3CfeTurbulence type=%22fractalNoise%22 baseFrequency=%220.65%22 numOctaves=%223%22 stitchTiles=%22stitch%22/%3E%3C/filter%3E%3Crect width=%22100%25%22 height=%22100%25%22 filter=%22url(%23noiseFilter)%22/%3E%3C/svg%3E')" }}
      />

      {/* Main Terminal Area */}
      <div className="relative z-10 w-full max-w-2xl h-full flex items-center justify-center p-6">
        <AnimatePresence mode="wait">
          {!isUnlocked ? (
            <motion.div
              key="locked"
              initial={{ opacity: 0, scale: 0.95 }}
              animate={{ opacity: 1, scale: 1 }}
              exit={{ opacity: 0, scale: 1.05, filter: "blur(10px)" }}
              transition={{ duration: 0.4, ease: "easeInOut" }}
              className="flex flex-col items-center gap-12 w-full"
            >
              {/* Terminal Frame */}
              <div className="relative border border-white/10 rounded-xl bg-black/40 backdrop-blur-md p-8 w-full max-w-md shadow-2xl flex flex-col items-center">
                <div className="absolute -top-px left-1/2 -translate-x-1/2 w-1/3 h-px" style={{ background: \`linear-gradient(90deg, transparent, \${accentColor}, transparent)\` }} />

                <h2 className="text-white/80 text-xl tracking-[0.2em] font-bold mb-2">
                  {title}
                </h2>
                <div className="flex items-center gap-2 mb-8">
                  <div className="w-2 h-2 rounded-full animate-pulse" style={{ backgroundColor: accentColor }} />
                  <span className="text-xs tracking-widest text-white/50">{lockedSubtitle}</span>
                </div>

                {/* The Slot */}
                <div
                  ref={slotRef}
                  className="w-[140px] h-[70px] rounded-lg border-2 border-dashed flex items-center justify-center relative overflow-hidden transition-colors duration-300"
                  style={{
                    borderColor: isDragging ? primaryColor : "rgba(255,255,255,0.2)",
                    backgroundColor: isDragging ? \`\${primaryColor}10\` : "rgba(0,0,0,0.5)"
                  }}
                >
                  <motion.div
                    className="absolute inset-0 opacity-20"
                    animate={{
                      backgroundPosition: ["0% 0%", "100% 100%"],
                    }}
                    transition={{ duration: 3, repeat: Infinity, ease: "linear" }}
                    style={{
                      backgroundImage: \`repeating-linear-gradient(45deg, transparent, transparent 10px, \${primaryColor} 10px, \${primaryColor} 20px)\`,
                      backgroundSize: "200% 200%",
                      display: isDragging ? "block" : "none"
                    }}
                  />
                  <span className="text-white/30 text-[10px] tracking-widest uppercase z-10">Insert Shard</span>
                </div>
              </div>

              {/* The Draggable Shard */}
              <motion.div
                drag
                dragConstraints={containerRef}
                dragElastic={0.1}
                onDragStart={handleDragStart}
                onDragEnd={handleDragEnd}
                animate={shardControls}
                whileHover={{ scale: 1.05 }}
                whileDrag={{ scale: 1.1, cursor: "grabbing" }}
                className="w-[120px] h-[60px] rounded-md cursor-grab flex items-center justify-center relative shadow-lg z-50 group"
                style={{
                  background: \`linear-gradient(135deg, \${primaryColor}30, \${primaryColor}10)\`,
                  border: \`1px solid \${primaryColor}80\`,
                  boxShadow: \`0 0 20px \${primaryColor}40\`
                }}
              >
                {/* Glowing edge */}
                <div className="absolute inset-0 rounded-md opacity-0 group-hover:opacity-100 transition-opacity duration-300"
                     style={{ boxShadow: \`inset 0 0 15px \${primaryColor}\` }} />

                {/* Circuit lines decorative */}
                <div className="absolute top-2 left-2 w-4 h-px bg-white/50" />
                <div className="absolute top-2 left-2 w-px h-4 bg-white/50" />
                <div className="absolute bottom-2 right-2 w-4 h-px bg-white/50" />
                <div className="absolute bottom-2 right-2 w-px h-4 bg-white/50" />

                <span className="text-white font-bold tracking-widest text-xs" style={{ textShadow: \`0 0 10px \${primaryColor}\` }}>
                  0xSHARD
                </span>
              </motion.div>
            </motion.div>
          ) : (
            <motion.div
              key="unlocked"
              initial={{ opacity: 0, scale: 0.9, y: 20 }}
              animate={{ opacity: 1, scale: 1, y: 0 }}
              exit={{ opacity: 0, scale: 0.95 }}
              transition={{ duration: 0.6, type: "spring", bounce: 0.4 }}
              className="w-full h-full flex flex-col"
            >
              {/* Dashboard Header */}
              <div className="flex items-center justify-between mb-6">
                <div>
                  <h2 className="text-white text-2xl font-bold tracking-widest flex items-center gap-3">
                    <span style={{ color: primaryColor }}>//</span> {title}
                  </h2>
                  <p className="text-white/50 text-sm tracking-wider mt-1">{unlockedSubtitle}</p>
                </div>
                <button
                  onClick={handleEject}
                  className="px-4 py-2 rounded-md bg-white/5 border border-white/10 hover:bg-white/10 text-white/70 hover:text-white text-xs tracking-widest transition-all uppercase flex items-center gap-2"
                >
                  <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                    <path d="M5 12h14M12 5l7 7-7 7"/>
                  </svg>
                  Eject
                </button>
              </div>

              {/* Bento Grid Layout */}
              <div className="flex-1 grid grid-cols-3 gap-4 grid-rows-2">
                {/* Main Graph Card */}
                <motion.div
                  initial={{ opacity: 0, x: -20 }}
                  animate={{ opacity: 1, x: 0 }}
                  transition={{ delay: 0.2 }}
                  className="col-span-2 row-span-2 rounded-xl bg-white/[0.02] border border-white/5 p-6 flex flex-col relative overflow-hidden"
                >
                  <div className="absolute top-0 right-0 w-32 h-32 blur-3xl opacity-20" style={{ backgroundColor: primaryColor }} />
                  <h3 className="text-white/40 text-xs tracking-widest uppercase mb-4">Network Activity</h3>

                  {/* Fake Graph */}
                  <div className="flex-1 flex items-end gap-2 mt-4">
                    {[40, 70, 45, 90, 65, 85, 30, 55, 75, 100, 60, 80].map((h, i) => (
                      <motion.div
                        key={i}
                        initial={{ height: 0 }}
                        animate={{ height: \`\${h}%\` }}
                        transition={{ delay: 0.3 + (i * 0.05), type: "spring" }}
                        className="flex-1 rounded-t-sm opacity-80 hover:opacity-100 transition-opacity"
                        style={{ backgroundColor: i % 3 === 0 ? accentColor : primaryColor }}
                      />
                    ))}
                  </div>

                  <div className="flex justify-between mt-4 text-white/30 text-[10px] font-mono">
                    <span>00:00</span>
                    <span>LIVE</span>
                  </div>
                </motion.div>

                {/* Stats Card 1 */}
                <motion.div
                  initial={{ opacity: 0, y: -20 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ delay: 0.3 }}
                  className="rounded-xl bg-white/[0.02] border border-white/5 p-4 flex flex-col justify-between"
                >
                  <h3 className="text-white/40 text-xs tracking-widest uppercase">Nodes</h3>
                  <div className="text-4xl font-light text-white mt-2">1,024</div>
                  <div className="text-[10px] tracking-wider text-white/50 mt-1 flex items-center gap-1">
                    <span style={{ color: primaryColor }}>↑ 12%</span> active
                  </div>
                </motion.div>

                {/* Stats Card 2 */}
                <motion.div
                  initial={{ opacity: 0, y: 20 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ delay: 0.4 }}
                  className="rounded-xl bg-white/[0.02] border border-white/5 p-4 flex flex-col justify-between relative overflow-hidden"
                >
                  <div className="absolute inset-0 opacity-10" style={{
                    backgroundImage: \`repeating-linear-gradient(-45deg, transparent, transparent 5px, \${accentColor} 5px, \${accentColor} 10px)\`
                  }} />
                  <h3 className="text-white/40 text-xs tracking-widest uppercase relative z-10">Security</h3>
                  <div className="text-2xl font-bold mt-2 relative z-10" style={{ color: accentColor }}>COMPROMISED</div>
                  <div className="text-[10px] tracking-wider text-white/50 mt-1 relative z-10">
                    Bypassed via Shard
                  </div>
                </motion.div>
              </div>
            </motion.div>
          )}
        </AnimatePresence>
      </div>
    </div>
  );
}`,
    componentPath: "KineticShardTerminal",
    scrollable: false,
    usageCode: `import { KineticShardTerminal } from "@/components/community/demos/KineticShardTerminal";

export default function Demo() {
  return (
    <div className="flex items-center justify-center p-12">
      <KineticShardTerminal />
    </div>
  );
}`,
    aiPrompt: "A highly interactive cyberpunk-style terminal that unlocks via dragging and dropping a 'Data Shard' into a magnetic slot.",
    props: [
      {
        name: "title",
        type: "string",
        defaultValue: `"CORE TERMINAL"`,
        description: "The main title displayed on the locked and unlocked views."
      },
      {
        name: "primaryColor",
        type: "string",
        defaultValue: `"#7fff5e"`,
        description: "The main neon color used for the shard, slot bounding box, and graphs."
      },
      {
        name: "accentColor",
        type: "string",
        defaultValue: `"#ff5c71"`,
        description: "The accent color used for secondary highlights."
      }
    ]
  },
  {
    id: "infinity-mirror-card",
    slug: "infinity-mirror-card",
    title: "Infinity Mirror",
    description: "Deep nested 3D card creating an optical illusion of infinite layers, reacting to magnetic mouse movement.",
    category: "Cards",
    tags: ["Framer Motion", "3D", "Premium"],
    cliCommand: "npx @melonui-dev/cli add infinity-mirror-card",
    codeSnippet: `// See InfinityMirrorCard.tsx`,
    componentPath: "InfinityMirrorCard",
    scrollable: true,
    usageCode: `import { InfinityMirrorCard } from "@/components/community/demos/InfinityMirrorCard";

export default function Demo() {
  return (
    <div className="flex items-center justify-center p-12">
      {/* Customize the text below using the 'title' and 'subtitle' props */}
      <InfinityMirrorCard 
        title="CREATIVE" 
        subtitle="MELONUI_PRO" 
        layers={5}
        glowColor="#7fff5e"
      />
    </div>
  );
}`,
    props: [
      {
        name: "title",
        type: "string",
        defaultValue: "VOID",
        description: "The main text displayed on the front layer. Pass your own custom text string to display here.",
        control: { type: "text" }
      },
      {
        name: "subtitle",
        type: "string",
        defaultValue: "SYSTEM_READY",
        description: "The smaller accent text displayed on the front layer. Customize this prop to add secondary metadata.",
        control: { type: "text" }
      },
      {
        name: "layers",
        type: "number",
        defaultValue: "5",
        description: "Number of nested layers in the infinity mirror.",
        control: { type: "slider", min: 2, max: 10, step: 1 }
      },
      {
        name: "glowColor",
        type: "string",
        defaultValue: "#7fff5e",
        description: "The neon glow color cast by the infinite tunnel.",
        control: { type: "color" }
      }
    ]
  },
  {
    id: "anti-gravity-bento",
    slug: "anti-gravity-bento",
    title: "Anti-Gravity Bento",
    description: "A premium glassmorphic bento grid where items float into zero-gravity on hover.",
    category: "Cards",
    tags: ["Framer Motion", "3D", "Glassmorphism", "Bento"],
    cliCommand: "npx @melonui-dev/cli add anti-gravity-bento",
    codeSnippet: `"use client";

import React, { useRef, useState, useEffect } from "react";
import { motion, useMotionValue, useSpring, useTransform, AnimatePresence } from "framer-motion";

export interface AntiGravityBentoProps extends React.ComponentPropsWithoutRef<"div"> {
  width?: string | number;
  height?: string | number;
  bg?: string;
  borderColor?: string;
  items?: React.ReactNode[];
  spotlightColor?: string;
}

const DEFAULT_ITEMS = [
  <div key="1" className="h-full w-full bg-[#111] rounded-xl border border-white/10 flex items-center justify-center overflow-hidden">
    <div className="w-8 h-8 rounded-full bg-[#ff5c71] blur-md absolute opacity-50 mix-blend-screen" />
    <span className="text-white font-['Outfit'] font-bold text-lg relative z-10">SYS_01</span>
  </div>,
  <div key="2" className="h-full w-full bg-[#111] rounded-xl border border-white/10 flex items-center justify-center overflow-hidden">
    <div className="w-12 h-[2px] bg-[#7fff5e] rotate-45" />
    <div className="w-12 h-[2px] bg-[#7fff5e] -rotate-45 absolute" />
  </div>,
  <div key="3" className="h-full w-full bg-[#111] rounded-xl border border-white/10 p-4 flex flex-col justify-between">
    <div className="w-4 h-4 rounded-full border border-[#00f0ff] animate-pulse" />
    <span className="text-[#00f0ff] font-mono text-xs">DATA.SYNC</span>
  </div>,
  <div key="4" className="h-full w-full bg-[#111] rounded-xl border border-white/10 flex items-center justify-center relative">
    <svg className="w-1/2 h-1/2 text-white/20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
      <path strokeLinecap="round" strokeLinejoin="round" d="M13 10V3L4 14h7v7l9-11h-7z" />
    </svg>
    <div className="absolute inset-0 bg-gradient-to-tr from-transparent via-white/5 to-transparent opacity-0 hover:opacity-100 transition-opacity" />
  </div>
];

export const AntiGravityBento: React.FC<AntiGravityBentoProps> = ({
  width = 400,
  height = 400,
  bg = "rgba(10, 10, 10, 0.6)",
  borderColor = "rgba(255, 255, 255, 0.1)",
  items = DEFAULT_ITEMS,
  spotlightColor = "rgba(255, 92, 113, 0.15)",
  className = "",
  style,
  ...props
}) => {
  const containerRef = useRef<HTMLDivElement>(null);
  const [isHovered, setIsHovered] = useState(false);
  const [mounted, setMounted] = useState(false);

  useEffect(() => {
    setMounted(true);
  }, []);

  const mouseX = useMotionValue(0);
  const mouseY = useMotionValue(0);

  const smoothX = useSpring(mouseX, { stiffness: 300, damping: 30 });
  const smoothY = useSpring(mouseY, { stiffness: 300, damping: 30 });

  const rotateX = useTransform(smoothY, [-0.5, 0.5], [10, -10]);
  const rotateY = useTransform(smoothX, [-0.5, 0.5], [-10, 10]);

  const spotlightX = useTransform(smoothX, [-0.5, 0.5], ["0%", "100%"]);
  const spotlightY = useTransform(smoothY, [-0.5, 0.5], ["0%", "100%"]);
  const spotlightBackground = useTransform(
    [spotlightX, spotlightY],
    ([x, y]) => \`radial-gradient(circle at \${x} \${y}, \${spotlightColor}, transparent 60%)\`
  );

  const handleMouseMove = (e: React.MouseEvent<HTMLDivElement>) => {
    if (!containerRef.current) return;
    const rect = containerRef.current.getBoundingClientRect();
    const x = (e.clientX - rect.left) / rect.width - 0.5;
    const y = (e.clientY - rect.top) / rect.height - 0.5;
    mouseX.set(x);
    mouseY.set(y);
  };

  const handleMouseEnter = () => setIsHovered(true);
  const handleMouseLeave = () => {
    setIsHovered(false);
    mouseX.set(0);
    mouseY.set(0);
  };

  if (!mounted) return <div style={{ width, height, ...style }} className={className} />;

  return (
    <motion.div
      ref={containerRef}
      onMouseMove={handleMouseMove}
      onMouseEnter={handleMouseEnter}
      onMouseLeave={handleMouseLeave}
      style={{
        width,
        height,
        perspective: "1000px",
        ...style,
      }}
      className={\`relative group \${className}\`}
      {...props}
    >
      <motion.div
        style={{
          rotateX,
          rotateY,
          background: bg,
          borderColor,
          transformStyle: "preserve-3d",
        }}
        className="w-full h-full rounded-2xl border backdrop-blur-xl relative overflow-hidden"
      >
        <div
          className="absolute inset-0 opacity-[0.03] pointer-events-none mix-blend-overlay"
          style={{
            backgroundImage: \`url("data:image/svg+xml,%3Csvg viewBox='0 0 200 200' xmlns='http://www.w3.org/2000/svg'%3E%3Cfilter id='noiseFilter'%3E%3CfeTurbulence type='fractalNoise' baseFrequency='0.65' numOctaves='3' stitchTiles='stitch'/%3E%3C/filter%3E%3Crect width='100%25' height='100%25' filter='url(%23noiseFilter)'/%3E%3C/svg%3E")\`,
          }}
        />

        <motion.div
          className="absolute inset-0 pointer-events-none opacity-0 group-hover:opacity-100 transition-opacity duration-500"
          style={{ background: spotlightBackground }}
        />

        <div className="absolute inset-0 p-4">
          <div className="w-full h-full relative">
            {items.map((item, index) => {
              const seed = index * 137;
              const randomX = ((seed % 100) / 100 - 0.5) * 150;
              const randomY = (((seed * 7) % 100) / 100 - 0.5) * 150;
              const randomRot = (((seed * 11) % 100) / 100 - 0.5) * 45;
              const randomZ = ((seed % 50) + 20);

              const row = Math.floor(index / 2);
              const col = index % 2;
              const gridTop = \`\${row * 50}%\`;
              const gridLeft = \`\${col * 50}%\`;

              const parallaxX = useTransform(smoothX, [-0.5, 0.5], [-randomZ, randomZ]);
              const parallaxY = useTransform(smoothY, [-0.5, 0.5], [-randomZ, randomZ]);

              return (
                <motion.div
                  key={index}
                  className="absolute"
                  initial={false}
                  animate={
                    isHovered
                      ? {
                          top: "50%",
                          left: "50%",
                          x: \`calc(-50% + \${randomX}px)\`,
                          y: \`calc(-50% + \${randomY}px)\`,
                          rotate: randomRot,
                          scale: 1.1,
                          z: randomZ,
                        }
                      : {
                          top: gridTop,
                          left: gridLeft,
                          x: "0%",
                          y: "0%",
                          rotate: 0,
                          scale: 1,
                          z: 0,
                        }
                  }
                  transition={{
                    type: "spring",
                    stiffness: 150 + (index * 20),
                    damping: 15,
                    mass: 0.8
                  }}
                >
                  <motion.div
                    style={
                      isHovered ? { x: parallaxX, y: parallaxY } : { x: 0, y: 0 }
                    }
                    className="w-full h-full p-2"
                  >
                     <div className="w-[160px] h-[160px] shadow-2xl">
                       {item}
                     </div>
                  </motion.div>
                </motion.div>
              );
            })}
          </div>
        </div>

        <div className="absolute bottom-4 left-0 right-0 flex justify-center pointer-events-none">
          <motion.div
            initial={{ opacity: 0, y: 10 }}
            animate={{ opacity: isHovered ? 1 : 0, y: isHovered ? 0 : 10 }}
            className="px-3 py-1 rounded-full bg-black/50 border border-white/20 backdrop-blur-md flex items-center space-x-2"
          >
            <div className="w-2 h-2 rounded-full bg-[#ff5c71] animate-ping" />
            <span className="text-white/80 font-mono text-[10px] tracking-widest uppercase">Zero Gravity</span>
          </motion.div>
        </div>
      </motion.div>
    </motion.div>
  );
}

export default AntiGravityBento;`,
    componentPath: "AntiGravityBento",
    usageCode: `import { AntiGravityBento } from "@/components/community/demos/AntiGravityBento";

export default function Demo() {
  // Add your own custom text, images, or components inside this array to populate the bento
  const myCustomCards = [
    <div key="1" className="h-full w-full bg-[#111] rounded-xl p-4 flex flex-col justify-between">
      <span className="text-[#7fff5e] font-mono text-xs">CUSTOM CARD</span>
      <span className="text-white font-bold text-lg">My Content</span>
    </div>,
    <div key="2" className="h-full w-full bg-zinc-900 rounded-xl p-4 flex items-center justify-center">
      <span className="text-white/60 text-xs">Hover to see zero gravity!</span>
    </div>
  ];

  return (
    <div className="flex items-center justify-center p-12">
      <AntiGravityBento 
        width={400} 
        height={400} 
        items={myCustomCards}
      />
    </div>
  );
}`,
    aiPrompt: "A glassmorphic bento grid container that breaks its layout into zero-gravity on hover. It uses Framer Motion for spring physics and 3D tilting.",
    props: [
      {
        name: "width",
        type: "string | number",
        defaultValue: "400",
        description: "The width of the bento card.",
        control: {
          type: "slider",
          min: 300,
          max: 800,
          step: 10
        }
      },
      {
        name: "height",
        type: "string | number",
        defaultValue: "400",
        description: "The height of the bento card.",
        control: {
          type: "slider",
          min: 300,
          max: 800,
          step: 10
        }
      },
      {
        name: "bg",
        type: "string",
        defaultValue: "rgba(10, 10, 10, 0.6)",
        description: "The background color (supports rgba for glassmorphism).",
        control: {
          type: "color"
        }
      },
      {
        name: "spotlightColor",
        type: "string",
        defaultValue: "rgba(255, 92, 113, 0.15)",
        description: "The color of the internal hover spotlight.",
        control: {
          type: "color"
        }
      },
      {
        name: "items",
        type: "React.ReactNode[]",
        defaultValue: "DEFAULT_ITEMS",
        description: "Array of custom components/React nodes. Modify this prop to pass your own cards, text, or images."
      }
    ]
  },
  {
    id: "cli-terminal",
    slug: "cli-terminal",
    title: "CLI Terminal",
    description: "Live animated terminal showing the installation flow. Drop it in your docs.",
    category: "Getting Started",
    tags: ["GSAP", "Timeline"],
    cliCommand: "npx @melonui-dev/cli add cli-terminal",
    codeSnippet: `npm install -g @melonui-dev/cli\nnpx @melonui-dev/cli init\nnpx @melonui-dev/cli add burst-button`,
    componentPath: "CliTerminal",
  },
  {
    id: "changelog",
    slug: "changelog",
    title: "Changelog",
    description: "Accordion-style versioned release list with smooth GSAP height animation.",
    category: "Getting Started",
    tags: ["GSAP", "Accordion"],
    cliCommand: "npx @melonui-dev/cli add changelog",
    codeSnippet: "// See ChangelogCard.tsx",
    componentPath: "ChangelogCard",
  },
  {
    id: "burst-button",
    slug: "burst-button",
    title: "Burst Button",
    description: "Seeds physically burst from the click point with GSAP staggered physics.",
    category: "Buttons",
    tags: ["GSAP", "Physics"],
    cliCommand: "npx @melonui-dev/cli add burst-button",
    codeSnippet: `const burst = (e) => {\n  const rect = e.target.getBoundingClientRect();\n  const x = e.clientX - rect.left;\n  const y = e.clientY - rect.top;\n  // Particle creation logic...\n};`,
    componentPath: "SeedBurstButton",
    props: [
      {
        name: "label",
        type: "string",
        defaultValue: `"Click Me"`,
        description: "The text displayed on the button surface.",
        control: { type: "text" }
      },
      {
        name: "count",
        type: "number",
        defaultValue: "12",
        description: "Number of seed particles generated on click.",
        control: { type: "slider", min: 4, max: 32, step: 1 }
      },
      {
        name: "gravity",
        type: "number",
        defaultValue: "0.6",
        description: "Downwards weight force applied to bursting seed particles.",
        control: { type: "slider", min: 0.1, max: 2.0, step: 0.1 }
      }
    ]
  },
  {
    id: "ripple-button",
    slug: "ripple-button",
    title: "Ripple Button",
    description: "Click-origin radial ripple expands from the exact cursor position.",
    category: "Buttons",
    tags: ["GSAP", "Ripple"],
    cliCommand: "npx @melonui-dev/cli add ripple-button",
    codeSnippet: `const createRipple = (e) => {\n  const btn = e.currentTarget;\n  const circle = document.createElement("span");\n  const diameter = Math.max(btn.clientWidth, btn.clientHeight);\n  const radius = diameter / 2;\n\n  circle.style.width = circle.style.height = \`\${diameter}px\`;\n  circle.style.left = \`\${e.clientX - btn.getBoundingClientRect().left - radius}px\`;\n  circle.style.top = \`\${e.clientY - btn.getBoundingClientRect().top - radius}px\`;\n  circle.classList.add("ripple");\n\n  const ripple = btn.getElementsByClassName("ripple")[0];\n  if (ripple) { ripple.remove(); }\n  btn.appendChild(circle);\n};`,
    componentPath: "RippleButton",
    props: [
      {
        name: "label",
        type: "string",
        defaultValue: `"Click for ripple"`,
        description: "The text content displayed in the center of the button.",
        control: { type: "text" }
      },
      {
        name: "duration",
        type: "number",
        defaultValue: "0.7",
        description: "Speed (seconds) for ripple fade out and scale animation.",
        control: { type: "slider", min: 0.2, max: 2.0, step: 0.1 }
      },
      {
        name: "rippleColor",
        type: "string",
        defaultValue: `"rgba(127, 255, 94, 0.25)"`,
        description: "CSS color definition applied to the expanding circular ripple.",
        control: { type: "color" }
      }
    ]
  },
  {
    id: "magnetic-nav",
    slug: "magnetic-nav",
    title: "Magnetic Nav",
    description: "Nav links magnetically attract the cursor; elastic spring snaps back on leave.",
    category: "Navigations",
    tags: ["GSAP", "Elastic"],
    cliCommand: "npx @melonui-dev/cli add magnetic-nav",
    codeSnippet: `const handleMouseMove = (e) => {\n  const { clientX, clientY } = e;\n  const { height, width, left, top } = ref.current.getBoundingClientRect();\n  const x = clientX - (left + width / 2);\n  const y = clientY - (top + height / 2);\n  gsap.to(ref.current, { x: x * 0.3, y: y * 0.3, duration: 0.8, ease: "power3.out" });\n};`,
    componentPath: "MagneticNav",
  },
  {
    id: "step-trail",
    slug: "step-trail",
    title: "Step Trail",
    description: "Animated step breadcrumb with GSAP-driven progress bar between stages.",
    category: "Navigations",
    tags: ["GSAP", "Progress"],
    cliCommand: "npx @melonui-dev/cli add step-trail",
    codeSnippet: `const tl = gsap.timeline();\ntl.to(progressRef.current, { scaleX: activeStep / totalSteps, duration: 0.5, ease: "power2.inOut" });`,
    componentPath: "BreadcrumbTrail",
  },
  {
    id: "peel-card",
    slug: "peel-card",
    title: "Peel Card",
    description: "Card front retracts on hover revealing vibrant content underneath.",
    category: "Cards",
    tags: ["GSAP", "Transform"],
    cliCommand: "npx @melonui-dev/cli add peel-card",
    codeSnippet: `const onEnter = () => gsap.to(peelRef.current, { y: "-85%", duration: 0.6, ease: "power3.inOut" });\nconst onLeave = () => gsap.to(peelRef.current, { y: "0%", duration: 0.6, ease: "power3.inOut" });`,
    componentPath: "RindPeelCard",
    usageCode: `import { RindPeelCard } from "@/components/community/demos/RindPeelCard";

export default function Demo() {
  return (
    <div className="flex items-center justify-center p-12">
      {/* Customize the text below using the 'peelTitle' and 'revealTitle' props */}
      <RindPeelCard 
        peelTitle="Hover Me" 
        peelCategory="Interactive"
        revealTitle="Hello World!" 
        revealDesc="This is my custom revealed description."
      />
    </div>
  );
}`,
    props: [
      { name: "width", type: "string | number", defaultValue: "288", description: "The width of the peel card.", control: { type: "slider", min: 200, max: 600, step: 10 } },
      { name: "height", type: "string | number", defaultValue: "208", description: "The height of the peel card.", control: { type: "slider", min: 150, max: 500, step: 10 } },
      { name: "peelTitle", type: "string", defaultValue: `"Rind Peel Card"`, description: "The title shown on the front peel layer. Set this prop to your own title text.", control: { type: "text" } },
      { name: "peelCategory", type: "string", defaultValue: `"Component"`, description: "The small category text on the front layer.", control: { type: "text" } },
      { name: "peelHint", type: "string", defaultValue: `"Hover to reveal"`, description: "The helper text on the front layer.", control: { type: "text" } },
      { name: "revealTitle", type: "string", defaultValue: `"Fresh 🍉"`, description: "The title revealed underneath the peel.", control: { type: "text" } },
      { name: "revealDesc", type: "string", defaultValue: `"Underneath the rind, something juicy."`, description: "The description text revealed underneath the peel.", control: { type: "text" } }
    ]
  },
  {
    id: "flip-card",
    slug: "flip-card",
    title: "Flip Card",
    description: "3D rotateY flip using CSS preserve-3d and GSAP for precise control.",
    category: "Cards",
    tags: ["GSAP", "3D", "CSS"],
    cliCommand: "npx @melonui-dev/cli add flip-card",
    codeSnippet: `const handleFlip = () => {\n  gsap.to(cardRef.current, {\n    rotateY: isFlipped ? 0 : 180,\n    duration: 0.8,\n    ease: "back.out(1.2)"\n  });\n  setIsFlipped(!isFlipped);\n};`,
    componentPath: "FlipCard",
    usageCode: `import { FlipCard } from "@/components/community/demos/FlipCard";

export default function Demo() {
  return (
    <div className="flex items-center justify-center p-12">
      {/* Click the card to flip it and see your backTitle / backEmoji text */}
      <FlipCard 
        frontTitle="Click to open" 
        frontCategory="MelonUI"
        backEmoji="🚀"
        backTitle="Welcome!" 
        backHint="Click to close"
      />
    </div>
  );
}`,
    props: [
      { name: "width", type: "string | number", defaultValue: "260", description: "The width of the flip card.", control: { type: "slider", min: 180, max: 500, step: 10 } },
      { name: "height", type: "string | number", defaultValue: "180", description: "The height of the flip card.", control: { type: "slider", min: 120, max: 400, step: 10 } },
      { name: "frontTitle", type: "string", defaultValue: `"Flip Card"`, description: "The title shown on the front of the card. Customize this prop for your front text.", control: { type: "text" } },
      { name: "frontCategory", type: "string", defaultValue: `"Component / Card"`, description: "Small category text on the front face.", control: { type: "text" } },
      { name: "frontHint", type: "string", defaultValue: `"Click to reveal >"`, description: "Helper action text on the front face.", control: { type: "text" } },
      { name: "backTitle", type: "string", defaultValue: `"Surprise!"`, description: "The title shown on the back of the card after flipping.", control: { type: "text" } },
      { name: "backHint", type: "string", defaultValue: `"Click again to flip back"`, description: "Helper action text on the back face.", control: { type: "text" } },
      { name: "backEmoji", type: "string", defaultValue: `"🍉"`, description: "Emoji icon displayed on the back face.", control: { type: "text" } }
    ]
  },
  {
    id: "holo-ticket",
    slug: "holo-ticket",
    title: "Holo Ticket",
    description: "Premium holographic ticket component with 3D pointer-tracking reflection, dynamic CSS clipping, and elastic tearing physics.",
    category: "Cards",
    tags: ["GSAP", "Clip", "Glassmorphism", "Holographic"],
    cliCommand: "npx @melonui-dev/cli add holo-ticket",
    codeSnippet: `const handleMouseMove = (e) => {\n  const rect = ticketRef.current.getBoundingClientRect();\n  const x = e.clientX - rect.left;\n  const y = e.clientY - rect.top;\n  const rotateX = ((y - centerY) / centerY) * -15;\n  const rotateY = ((x - centerX) / centerX) * 15;\n  gsap.to(ticketRef.current, { rotateX, rotateY, duration: 0.4 });\n};`,
    componentPath: "HoloTicket",
    usageCode: `import { HoloTicket } from "@/components/community/demos/HoloTicket";

export default function Demo() {
  return (
    <div className="flex items-center justify-center p-12">
      {/* Hover over ticket to tilt in 3D or drag bottom stub to tear off */}
      <HoloTicket 
        topEyebrow="Developer Conf"
        topSerial="No. 1337"
        topTitle={<>Melon<br/>Con</>}
        topSubtitle="ALL ACCESS"
        bottomText="Tear stub to register entry"
      />
    </div>
  );
}`,
    props: [
      { name: "width", type: "string | number", defaultValue: "256", description: "The width of the holographic ticket.", control: { type: "slider", min: 200, max: 500, step: 10 } },
      { name: "height", type: "string | number", defaultValue: "384", description: "The height of the holographic ticket.", control: { type: "slider", min: 300, max: 600, step: 10 } },
      { name: "topEyebrow", type: "string", defaultValue: `"Admit One"`, description: "Label text at the top of the ticket.", control: { type: "text" } },
      { name: "topSerial", type: "string", defaultValue: `"No. 0842"`, description: "Serial number text at the top right.", control: { type: "text" } },
      { name: "topSubtitle", type: "string", defaultValue: `"VIP ACCESS"`, description: "Pill subheader text in the top ticket section.", control: { type: "text" } },
      { name: "bottomText", type: "string", defaultValue: `"Scan barcode for verified admission"`, description: "Instructional text in the bottom stub of the ticket.", control: { type: "text" } },
      { name: "redeemedText", type: "string", defaultValue: `"REDEEMED"`, description: "Watermark text overlayed when the ticket is torn/redeemed.", control: { type: "text" } }
    ]
  },
  {
    id: "grow-input",
    slug: "grow-input",
    title: "Grow Input",
    description: "SVG stroke dashoffset vine grows along the bottom border on focus.",
    category: "Inputs",
    tags: ["GSAP", "SVG"],
    cliCommand: "npx @melonui-dev/cli add grow-input",
    codeSnippet: `const onFocus = () => gsap.to(pathRef.current, { strokeDashoffset: 0, duration: 1, ease: "power2.out" });\nconst onBlur = () => gsap.to(pathRef.current, { strokeDashoffset: pathLength, duration: 0.6, ease: "power2.in" });`,
    componentPath: "VineInput",
    props: [
      {
        name: "placeholder",
        type: "string",
        defaultValue: `"e.g. Farmer Joe"`,
        description: "Placeholder text for the text input.",
        control: { type: "text" }
      },
      {
        name: "glowColor",
        type: "string",
        defaultValue: `"#7fff5e"`,
        description: "SVG stroke color for the animated growing vine.",
        control: { type: "color" }
      },
      {
        name: "growSpeed",
        type: "number",
        defaultValue: "1.0",
        description: "Speed multiplier for vine growing animation on focus.",
        control: { type: "slider", min: 0.2, max: 3.0, step: 0.1 }
      }
    ]
  },
  {
    id: "tag-input",
    slug: "tag-input",
    title: "Tag Input",
    description: "Animated tag management — press Enter or comma to add, backspace to remove.",
    category: "Inputs",
    tags: ["GSAP", "Input"],
    cliCommand: "npx @melonui-dev/cli add tag-input",
    codeSnippet: `const handleKeyDown = (e) => {\n  if (e.key === 'Enter' && inputValue) {\n    setTags([...tags, inputValue]);\n    setInputValue('');\n  }\n};`,
    componentPath: "TagInput",
  },
  {
    id: "particle-field",
    slug: "particle-field",
    title: "Particle Field",
    description: "Interactive 2D Canvas particle constellation network connecting nearby nodes on cursor proximity.",
    category: "Backgrounds",
    tags: ["Canvas", "Interactive"],
    cliCommand: "npx @melonui-dev/cli add particle-field",
    codeSnippet: `// High performance HTML5 Canvas 2D constellation background.`,
    componentPath: "ParticleBackground",
    props: [
      { name: "particleCount", type: "number", defaultValue: "100", description: "Number of floating particles.", control: { type: "slider", min: 20, max: 250, step: 5 } },
      { name: "speed", type: "number", defaultValue: "1.0", description: "Movement speed multiplier.", control: { type: "slider", min: 0.2, max: 4.0, step: 0.1 } },
      { name: "particleColor", type: "string", defaultValue: `"#ff5c71"`, description: "Color of the particle dots.", control: { type: "color" } },
      { name: "lineColor", type: "string", defaultValue: `"#7fff5e"`, description: "Color of the connecting constellation lines.", control: { type: "color" } },
      { name: "linkDistance", type: "number", defaultValue: "100", description: "Maximum linking distance threshold.", control: { type: "slider", min: 50, max: 200, step: 5 } }
    ]
  },
  {
    id: "sticker-wall",
    slug: "sticker-wall",
    title: "Sticker Wall",
    description: "Interactive Gen-Z editorial sticker grid that fans out, scales, and tilts dynamically on pointer hover.",
    category: "Backgrounds",
    tags: ["Framer Motion", "Stickers", "Brutalist"],
    cliCommand: "npx @melonui-dev/cli add sticker-wall",
    codeSnippet: `// StickerWall.tsx`,
    componentPath: "StickerWall",
    props: [
      { name: "stickers", type: "string", defaultValue: `"🍉 MELON, 🌱 SEED, 💦 JUICY, 🍈 RIND, ⭐ PRO, 🍃 FRESH, 🔪 SLICE, 🍭 SWEET"`, description: "Custom comma-separated list of stickers: 'Emoji Label, Emoji Label, ...'", control: { type: "text" } },
      { name: "stickerDensity", type: "number", defaultValue: "12", description: "Number of stickers scattered on the wall.", control: { type: "slider", min: 4, max: 24, step: 1 } },
      { name: "scaleOnHover", type: "number", defaultValue: "1.15", description: "Scale enlargement factor on hover.", control: { type: "slider", min: 1.0, max: 1.4, step: 0.05 } },
      { name: "stickerTheme", type: "string", defaultValue: `"melon"`, description: "Sticker label presets: 'melon', 'tech', or 'mixed'.", control: { type: "text" } }
    ]
  },
  {
    id: "luminous-waves",
    slug: "luminous-waves",
    title: "Luminous Waves",
    description: "Canvas-based glowing sine wave threads running horizontally and bending dynamically to track cursor position.",
    category: "Backgrounds",
    tags: ["Canvas", "Glow", "Sine Wave"],
    cliCommand: "npx @melonui-dev/cli add luminous-waves",
    codeSnippet: `// LuminousWaves.tsx`,
    componentPath: "LuminousWaves",
    props: [
      { name: "waveCount", type: "number", defaultValue: "5", description: "Number of horizontal wave threads.", control: { type: "slider", min: 1, max: 10, step: 1 } },
      { name: "amplitude", type: "number", defaultValue: "38", description: "Peak vertical displacement amplitude.", control: { type: "slider", min: 10, max: 100, step: 5 } },
      { name: "frequency", type: "number", defaultValue: "0.006", description: "Wave cycle horizontal frequency spacing.", control: { type: "slider", min: 0.002, max: 0.02, step: 0.001 } },
      { name: "waveColor", type: "string", defaultValue: `"#7fff5e"`, description: "Neon hex color of the glowing waves.", control: { type: "color" } },
      { name: "secondaryColor", type: "string", defaultValue: `"#ff5c71"`, description: "Secondary color to blend into for iridescent waves.", control: { type: "color" } },
      { name: "speed", type: "number", defaultValue: "0.5", description: "Velocity of horizontal wave flow.", control: { type: "slider", min: 0.2, max: 3.0, step: 0.1 } }
    ]
  },
  {
    id: "retro-grid",
    slug: "retro-grid",
    title: "Retro Grid",
    description: "A neon 3D perspective grid extending to the horizon that moves forward and tilts on cursor coordinates.",
    category: "Backgrounds",
    tags: ["CSS 3D", "Perspective", "Parallax"],
    cliCommand: "npx @melonui-dev/cli add retro-grid",
    codeSnippet: `// RetroGrid.tsx`,
    componentPath: "RetroGrid",
    props: [
      { name: "gridColor", type: "string", defaultValue: `"#ff5c71"`, description: "Hex color code for perspective grid lines.", control: { type: "color" } },
      { name: "speed", type: "number", defaultValue: "1.5", description: "Forward velocity of grid movement.", control: { type: "slider", min: 0.5, max: 4.0, step: 0.1 } },
      { name: "horizonColor", type: "string", defaultValue: `"#7fff5e"`, description: "Laser line and horizon glow hex color.", control: { type: "color" } },
      { name: "tiltMultiplier", type: "number", defaultValue: "1.0", description: "Strength of pointer parallax grid tilt.", control: { type: "slider", min: 0.0, max: 2.0, step: 0.1 } }
    ]
  },
  {
    id: "noise-blob",
    slug: "noise-blob",
    title: "Noise Blob",
    description: "Organic liquid morphing blobs using SVG color matrix and blur filters to create a gooey lava lamp visual.",
    category: "Backgrounds",
    tags: ["SVG Filter", "Gooey", "Liquid"],
    cliCommand: "npx @melonui-dev/cli add noise-blob",
    codeSnippet: `// NoiseBlob.tsx`,
    componentPath: "NoiseBlob",
    props: [
      { name: "primaryColor", type: "string", defaultValue: `"#ff5c71"`, description: "Main color of gooey blobs.", control: { type: "color" } },
      { name: "secondaryColor", type: "string", defaultValue: `"#7fff5e"`, description: "Secondary color of gooey blobs.", control: { type: "color" } },
      { name: "blobSize", type: "number", defaultValue: "120", description: "Pixel diameter of individual blobs.", control: { type: "slider", min: 60, max: 240, step: 10 } },
      { name: "speed", type: "number", defaultValue: "1.0", description: "Floating and morphing speed.", control: { type: "slider", min: 0.2, max: 3.0, step: 0.1 } },
      { name: "gooeyness", type: "number", defaultValue: "10", description: "Intensity of gooey blending threshold.", control: { type: "slider", min: 2, max: 20, step: 1 } }
    ]
  },
  {
    id: "matrix-rain",
    slug: "matrix-rain",
    title: "Matrix Rain",
    description: "Digital cascading streams of custom alphanumeric glyphs and seeds in neon-green and coral-red.",
    category: "Backgrounds",
    tags: ["Canvas", "Matrix", "Retro"],
    cliCommand: "npx @melonui-dev/cli add matrix-rain",
    codeSnippet: `// MatrixRain.tsx`,
    componentPath: "MatrixRain",
    props: [
      { name: "rainSpeed", type: "number", defaultValue: "1.2", description: "Drop rate speed multiplier.", control: { type: "slider", min: 0.2, max: 3.0, step: 0.1 } },
      { name: "fontSize", type: "number", defaultValue: "14", description: "Font size in pixels for characters.", control: { type: "slider", min: 10, max: 24, step: 1 } },
      { name: "rainColor", type: "string", defaultValue: `"#7fff5e"`, description: "Base drop stream color.", control: { type: "color" } },
      { name: "accentColor", type: "string", defaultValue: `"#ff5c71"`, description: "Occasional spark character color.", control: { type: "color" } }
    ]
  },
  {
    id: "blob-cursor",
    slug: "blob-cursor",
    title: "Blob Cursor",
    description: "Velocity-based squash and stretch blob with elastic trailing ring.",
    category: "Cursors",
    tags: ["GSAP", "Cursor"],
    cliCommand: "npx @melonui-dev/cli add blob-cursor",
    codeSnippet: `useEffect(() => {\n  const onMouseMove = (e) => {\n    gsap.to(cursorRef.current, { x: e.clientX, y: e.clientY, duration: 0.1 });\n  };\n  window.addEventListener("mousemove", onMouseMove);\n  return () => window.removeEventListener("mousemove", onMouseMove);\n}, []);`,
    componentPath: "JuicyCursor",
  },
  {
    id: "crosshair",
    slug: "crosshair",
    title: "Crosshair",
    description: "Precision crosshair with live coordinate readout and a grid overlay.",
    category: "Cursors",
    tags: ["GSAP", "Cursor"],
    cliCommand: "npx @melonui-dev/cli add crosshair",
    codeSnippet: `// Updates crosshair position and coordinate labels on mouse move.`,
    componentPath: "CrosshairCursor",
  },
  {
    id: "char-reveal",
    slug: "char-reveal",
    title: "Char Reveal",
    description: "Characters blur-in with stagger tied to ScrollTrigger scroll position.",
    category: "Scroll Effects",
    tags: ["GSAP", "ScrollTrigger"],
    cliCommand: "npx @melonui-dev/cli add char-reveal",
    codeSnippet: `gsap.to(chars, {\n  scrollTrigger: { trigger: container, start: "top center", end: "bottom center", scrub: true },\n  opacity: 1, filter: "blur(0px)", stagger: 0.05\n});`,
    componentPath: "HarvestReveal",
    scrollable: true,
    props: [
      {
        name: "text",
        type: "string",
        defaultValue: `"Every great UI starts as a seed."`,
        description: "The text content to animate character-by-character.",
        control: { type: "text" }
      },
      {
        name: "stagger",
        type: "number",
        defaultValue: "0.045",
        description: "Delay interval between starting animation for successive letters.",
        control: { type: "slider", min: 0.01, max: 0.2, step: 0.005 }
      },
      {
        name: "duration",
        type: "number",
        defaultValue: "0.65",
        description: "Duration of single letter fade, translate, and un-blur transition.",
        control: { type: "slider", min: 0.2, max: 2.0, step: 0.05 }
      },
      {
        name: "blur",
        type: "number",
        defaultValue: "6",
        description: "Initial pixel radius of the CSS blur filter on letters.",
        control: { type: "slider", min: 0, max: 20, step: 1 }
      }
    ]
  },
  {
    id: "parallax-strips",
    slug: "parallax-strips",
    title: "Parallax Strips",
    description: "Depth strips that scroll at different speeds creating a parallax illusion.",
    category: "Scroll Effects",
    tags: ["GSAP", "Parallax"],
    cliCommand: "npx @melonui-dev/cli add parallax-strips",
    codeSnippet: `gsap.to(strip1, { y: -100, scrollTrigger: { trigger: container, scrub: true } });\ngsap.to(strip2, { y: -200, scrollTrigger: { trigger: container, scrub: true } });`,
    componentPath: "ParallaxStrips",
    scrollable: true,
  },
  {
    id: "drip-text",
    slug: "drip-text",
    title: "Drip Text",
    description: "Letters drip down on hover with random skew offsets, spring back on leave.",
    category: "GSAP Text",
    tags: ["GSAP", "Elastic"],
    cliCommand: "npx @melonui-dev/cli add drip-text",
    codeSnippet: `const handleEnter = () => {\n  charRefs.current.forEach((el, i) => {\n    gsap.to(el, {\n      y: 12 + Math.random() * 16,\n      skewX: (Math.random() - 0.5) * 20,\n      color: "#7fff5e", duration: 0.4 + i * 0.06,\n      ease: "power3.in", delay: i * 0.04,\n    });\n  });\n};`,
    componentPath: "MelonDripText",
    props: [
      {
        name: "text",
        type: "string",
        defaultValue: `"MELON"`,
        description: "The text phrase displayed on screen.",
        control: { type: "text" }
      },
      {
        name: "stagger",
        type: "number",
        defaultValue: "0.04",
        description: "Delay step (seconds) added progressively to each character animation.",
        control: { type: "slider", min: 0.01, max: 0.15, step: 0.01 }
      },
      {
        name: "yOffset",
        type: "number",
        defaultValue: "16",
        description: "Max random pixel translation distance the letters drip downwards.",
        control: { type: "slider", min: 5, max: 40, step: 1 }
      }
    ]
  },
  {
    id: "scramble-text",
    slug: "scramble-text",
    title: "Scramble Text",
    description: "Characters cycle through random glyphs before resolving back on hover.",
    category: "GSAP Text",
    tags: ["GSAP", "Text"],
    cliCommand: "npx @melonui-dev/cli add scramble-text",
    codeSnippet: `const scramble = () => {\n  let iterations = 0;\n  const maxIter = text.length * 5;\n  const interval = setInterval(() => {\n    iterations++;\n    el.textContent = text.split("").map((char, i) => {\n      if (iterations > Math.floor((i / text.length) * maxIter))\n        return char;\n      return CHARS[Math.floor(Math.random() * CHARS.length)];\n    }).join("");\n    if (iterations >= maxIter) clearInterval(interval);\n  }, 35);\n};`,
    componentPath: "ScrambleText",
    props: [
      {
        name: "text",
        type: "string",
        defaultValue: `"SCRAMBLE"`,
        description: "The text string to scramble and resolve.",
        control: { type: "text" }
      },
      {
        name: "speed",
        type: "number",
        defaultValue: "35",
        description: "Interval duration (milliseconds) between scrambling letter updates.",
        control: { type: "slider", min: 10, max: 120, step: 5 }
      },
      {
        name: "glyphs",
        type: "string",
        defaultValue: `"ABCDEFGHIJKLMNOPQRSTUVWXYZ0123456789!@#$%"`,
        description: "A string of random character glyphs chosen during scramble cycles.",
        control: { type: "text" }
      }
    ]
  },
  {
    id: "chromatic-melt-text",
    slug: "chromatic-melt-text",
    title: "Chromatic Melt Text",
    description: "A transparent chromatic wordmark with offset glass shadows, soft pointer glow, and restrained per-letter hover lift.",
    category: "GSAP Text",
    tags: ["Framer Motion", "Typography", "Pointer Physics", "Gradient"],
    cliCommand: "npx @melonui-dev/cli add chromatic-melt-text",
    codeSnippet: `const [spot, setSpot] = useState({ x: 48, y: 42 });

// Pointer position drives a soft chromatic glow while each glyph gets offset glass shadows.`,
    componentPath: "ChromaticMeltText",
    props: [
      { name: "text", type: "string", defaultValue: `"CHROMA"`, description: "Headline text to render.", control: { type: "text" } },
      { name: "kicker", type: "string", defaultValue: `"Chromatic glass type"`, description: "Optional small label above the text.", control: { type: "text" } },
      { name: "primaryColor", type: "string", defaultValue: `"#ffffff"`, description: "Main glyph color.", control: { type: "color" } },
      { name: "secondaryColor", type: "string", defaultValue: `"#ff5c71"`, description: "Glow and under-drip color.", control: { type: "color" } },
      { name: "accentColor", type: "string", defaultValue: `"#7fff5e"`, description: "Hover and alternate drip color.", control: { type: "color" } }
    ],
  },
  {
    id: "rind-scanner-text",
    slug: "rind-scanner-text",
    title: "Rind Reveal Text",
    description: "A transparent pointer-light wordmark that reveals a primary/secondary color pass inside readable chunky type.",
    category: "GSAP Text",
    tags: ["Framer Motion", "Typography", "Reveal", "Gradient"],
    cliCommand: "npx @melonui-dev/cli add rind-scanner-text",
    codeSnippet: `const [spot, setSpot] = useState({ x: 52, y: 46 });
const clipPath = active
  ? \`circle(52% at \${spot.x}% \${spot.y}%)\`
  : \`circle(22% at \${spot.x}% \${spot.y}%)\`;

// Pointer position reveals a primary/secondary gradient inside the text while the base word stays readable.`,
    componentPath: "RindScannerText",
    props: [
      { name: "text", type: "string", defaultValue: `"RIND"`, description: "Headline text to reveal.", control: { type: "text" } },
      { name: "label", type: "string", defaultValue: `"Pointer light reveal"`, description: "Optional accessibility and eyebrow label.", control: { type: "text" } },
      { name: "baseColor", type: "string", defaultValue: `"#f4f4f4"`, description: "Base text color.", control: { type: "color" } },
      { name: "scanColor", type: "string", defaultValue: `"#7fff5e"`, description: "Secondary green reveal color.", control: { type: "color" } },
      { name: "accentColor", type: "string", defaultValue: `"#ff5c71"`, description: "Primary accent reveal color.", control: { type: "color" } }
    ],
  },
  {
    id: "sticker-stack-text",
    slug: "sticker-stack-text",
    title: "Sticker Stack Text",
    description: "Transparent layered sticker-style type cards that fan open with springy Gen-Z poster energy and bold MelonUI color blocking.",
    category: "GSAP Text",
    tags: ["Framer Motion", "Typography", "Stickers", "Spring"],
    cliCommand: "npx @melonui-dev/cli add sticker-stack-text",
    codeSnippet: `const layers = [
  { label: "LOUD", color: "#ff5c71" },
  { label: "SOFT", color: "#f7f0d2" },
  { label: "TYPE", color: "#7fff5e" },
];

// Hover expands each text sticker into an offset editorial stack.`,
    componentPath: "StickerStackText",
    props: [
      { name: "topText", type: "string", defaultValue: `"LOUD"`, description: "Top sticker label.", control: { type: "text" } },
      { name: "middleText", type: "string", defaultValue: `"SOFT"`, description: "Middle sticker label.", control: { type: "text" } },
      { name: "bottomText", type: "string", defaultValue: `"TYPE"`, description: "Bottom sticker label.", control: { type: "text" } },
      { name: "topColor", type: "string", defaultValue: `"#ff5c71"`, description: "Top sticker color.", control: { type: "color" } },
      { name: "middleColor", type: "string", defaultValue: `"#f7f0d2"`, description: "Middle sticker color.", control: { type: "color" } },
      { name: "bottomColor", type: "string", defaultValue: `"#7fff5e"`, description: "Bottom sticker color.", control: { type: "color" } },
      { name: "hint", type: "string", defaultValue: `"Hover to fan"`, description: "Optional helper label shown under the sticker stack.", control: { type: "text" } }
    ],
  },
  {
    id: "glyph-orbit-text",
    slug: "glyph-orbit-text",
    title: "Glyph Orbit Text",
    description: "A transparent central headline surrounded by orbiting character tiles derived from the same word, forming a readable typographic halo.",
    category: "GSAP Text",
    tags: ["Framer Motion", "Typography", "Orbit", "Glyphs"],
    cliCommand: "npx @melonui-dev/cli add glyph-orbit-text",
    codeSnippet: `const orbitGlyphs = glyphs?.length ? glyphs : text.replace(/\\s/g, "").split("");
const angle = (index / orbitGlyphs.length) * Math.PI * 2;
const x = Math.cos(angle) * radius;
const y = Math.sin(angle) * radius;

// Glyph tiles are derived from the rendered word unless custom glyphs are passed.`,
    componentPath: "GlyphOrbitText",
    props: [
      { name: "text", type: "string", defaultValue: `"ORBIT"`, description: "Central headline text.", control: { type: "text" } },
      { name: "primaryColor", type: "string", defaultValue: `"#ffffff"`, description: "Central headline color.", control: { type: "color" } },
      { name: "accentColor", type: "string", defaultValue: `"#7fff5e"`, description: "Primary orbit glyph color.", control: { type: "color" } }
    ],
  },
  {
    id: "seedwave-text",
    slug: "seedwave-text",
    title: "Seedwave Text",
    description: "Transparent click-born particle typography that compresses the headline and throws melon-colored seed sparks from the exact press point.",
    category: "GSAP Text",
    tags: ["Framer Motion", "Typography", "Particles", "Click"],
    cliCommand: "npx @melonui-dev/cli add seedwave-text",
    codeSnippet: `const burst = (event) => {
  const rect = event.currentTarget.getBoundingClientRect();
  const x = event.clientX - rect.left;
  const y = event.clientY - rect.top;
  // Create seed particles from the press point.
};`,
    componentPath: "SeedwaveText",
    props: [
      { name: "topText", type: "string", defaultValue: `"Seed"`, description: "First line of the headline.", control: { type: "text" } },
      { name: "bottomText", type: "string", defaultValue: `"Wave"`, description: "Second line of the headline.", control: { type: "text" } },
      { name: "seedCount", type: "number", defaultValue: "18", description: "Number of seed particles emitted per press.", control: { type: "slider", min: 6, max: 36, step: 1 } },
      { name: "primaryColor", type: "string", defaultValue: `"#ffffff"`, description: "Headline text color.", control: { type: "color" } }
    ],
  },
  {
    id: "stripe-wipe",
    slug: "stripe-wipe",
    title: "Stripe Wipe",
    description: "A colored stripe sweeps across the viewport to mask route changes.",
    category: "Page Transitions",
    tags: ["GSAP", "Timeline"],
    cliCommand: "npx @melonui-dev/cli add stripe-wipe",
    codeSnippet: `const runWipe = () => {\n  gsap.timeline()\n    .set(wipeEl, { x: "-100%", display: "flex" })\n    .to(wipeEl, { x: "0%", duration: 0.55,\n      ease: "power3.inOut" })\n    .to(wipeEl, { x: "100%", duration: 0.55,\n      ease: "power3.inOut", delay: 0.3 })\n    .set(wipeEl, { display: "none" });\n};`,
    componentPath: "RindWipeTransition",
  },
  {
    id: "morph-transition",
    slug: "morph-transition",
    title: "Morph Transition",
    description: "Circular clip expands from center masking the page swap between routes.",
    category: "Page Transitions",
    tags: ["GSAP", "Clip"],
    cliCommand: "npx @melonui-dev/cli add morph-transition",
    codeSnippet: `const morph = () => {\n  gsap.timeline()\n    .set(overlay, { display: "block", scale: 0, opacity: 1 })\n    .to(overlay, { scale: 4, duration: 0.55, ease: "power3.in" })\n    .call(() => setPage(p => p === "A" ? "B" : "A"))\n    .to(overlay, { scale: 12, opacity: 0,\n      duration: 0.55, ease: "power3.out" })\n    .set(overlay, { display: "none" });\n};`,
    componentPath: "MorphTransition",
  },
  {
    id: "solar-carousel",
    slug: "solar-carousel",
    title: "Solar Carousel",
    description: "3D orbital carousel where cards rotate in a physical orbit around an interactive central gravity core with inertial drag.",
    category: "Cards",
    tags: ["GSAP", "3D", "Perspective"],
    cliCommand: "npx @melonui-dev/cli add solar-carousel",
    codeSnippet: "",
    componentPath: "SolarCarousel",
    usageCode: `import { SolarCarousel } from "@/components/community/demos/SolarCarousel";

export default function Demo() {
  // Add your own custom card content here to render in the 3D orbit
  const myCustomCards = [
    { id: 1, title: "FIRST", tag: "Design", color: "#ff5c71", description: "My custom component description." },
    { id: 2, title: "SECOND", tag: "Code", color: "#7fff5e", description: "Copy and customize this easily." },
    { id: 3, title: "THIRD", tag: "Deploy", color: "#00f0ff", description: "Run it on your project root." }
  ];

  return (
    <div className="w-full">
      <SolarCarousel 
        radius={200}
        tilt={65}
        items={myCustomCards}
      />
    </div>
  );
}`,
    props: [
      { name: "radius", type: "number", defaultValue: "200", description: "Orbit radius in pixels of cards around core.", control: { type: "slider", min: 100, max: 400, step: 10 } },
      { name: "tilt", type: "number", defaultValue: "65", description: "X-axis tilt angle in degrees of orbital track.", control: { type: "slider", min: 30, max: 90, step: 5 } },
      { name: "items", type: "CarouselItem[]", defaultValue: "DEFAULT_ITEMS", description: "Array of cards to orbit in the carousel. Change this prop to add your own data." }
    ]
  },
  {
    id: "kinetic-magnet",
    slug: "kinetic-magnet",
    title: "Kinetic Magnet",
    description: "A mechanical grid of interactive SVG lines/needles that act as magnetic nodes pointing directly at your cursor, emitting elastic spring waves on clicks.",
    category: "Cursors",
    tags: ["GSAP", "SVG", "Elastic"],
    cliCommand: "npx @melonui-dev/cli add kinetic-magnet",
    codeSnippet: "",
    componentPath: "KineticMagnet",
  },
  {
    id: "morphing-cyber-node",
    slug: "morphing-cyber-node",
    title: "Morphing Cyber Node",
    description: "A multi-state, fluid-morphing interactive widget with magnetic hover physics and dynamic glassmorphism.",
    category: "Widgets",
    tags: ["Framer Motion", "Morph", "Glassmorphism", "Interactive"],
    cliCommand: "npx @melonui-dev/cli add morphing-cyber-node",
    codeSnippet: `const springConfig = { damping: 20, stiffness: 300, mass: 0.5 };\nconst rotateX = useSpring(useTransform(mouseY, [-0.5, 0.5], [15, -15]), springConfig);`,
    componentPath: "MorphingCyberNode",
    props: [
      { name: "idleText", type: "string", defaultValue: `"System Ready"`, description: "Label shown in ready/idle state.", control: { type: "text" } },
      { name: "scanningText", type: "string", defaultValue: `"Scanning"`, description: "Status label shown during scanner active state.", control: { type: "text" } },
      { name: "scanningIp", type: "string", defaultValue: `"192.168.1.X"`, description: "Eyebrow detail label in scanning mode.", control: { type: "text" } },
      { name: "audioModeText", type: "string", defaultValue: `"Audio Mode"`, description: "Primary action button label in scanner view.", control: { type: "text" } },
      { name: "cancelText", type: "string", defaultValue: `"Cancel"`, description: "Secondary cancel button label in scanner view.", control: { type: "text" } },
      { name: "alertTitle", type: "string", defaultValue: `"BREACH"`, description: "Large headline text in danger/alert state.", control: { type: "text" } },
      { name: "alertSubtitle", type: "string", defaultValue: `"UNAUTHORIZED ACCESS DETECTED"`, description: "Eyebrow detail text in danger/alert state.", control: { type: "text" } },
      { name: "lockdownText", type: "string", defaultValue: `"LOCKDOWN"`, description: "Lockdown recovery button label in alert state.", control: { type: "text" } },
      { name: "primaryColor", type: "string", defaultValue: `"#7fff5e"`, description: "Theme color for scanner scanning states.", control: { type: "color" } },
      { name: "secondaryColor", type: "string", defaultValue: `"#ff5c71"`, description: "Theme color for alarm and cancel states.", control: { type: "color" } },
      { name: "tertiaryColor", type: "string", defaultValue: `"#e8d5b7"`, description: "Theme color for ambient audio/idle glow.", control: { type: "color" } }
    ]
  },
  {
    id: "orbital-command-ring",
    slug: "orbital-command-ring",
    title: "Orbital Command Ring",
    description: "A futuristic radial page navigation menu summoned by dragging with elastic joystick physics, custom target paths, and cinematic flashes.",
    category: "Page Transitions",
    tags: ["Framer Motion", "Spring", "Radial Menu", "Interactive", "Navigation"],
    cliCommand: "npx @melonui-dev/cli add orbital-command-ring",
    codeSnippet: `const joystickX = useSpring(dragX, springConfig);\nconst joystickY = useSpring(dragY, springConfig);\n\n// Derived absolute position for the joystick\nconst joystickAbsX = useTransform(() => originX.get() + joystickX.get());\nconst joystickAbsY = useTransform(() => originY.get() + joystickY.get());`,
    componentPath: "OrbitalCommandRing",
    usageCode: `import { OrbitalCommandRing } from "@/components/orbital-command-ring";
import { useRouter } from "next/navigation";

export default function PageNavigationDemo() {
  const router = useRouter();

  // Define custom options linked to your application routes
  const customOptions = [
    { id: "home", label: "Home", icon: "🏠", color: "#7fff5e", path: "/" },
    { id: "docs", label: "Docs", icon: "📖", color: "#00f0ff", path: "/docs/introduction" },
    { id: "loom", label: "Loom", icon: "🧶", color: "#ff5c71", path: "/components/signal-loom" },
    { id: "bento", label: "Bento", icon: "🍱", color: "#ff8c00", path: "/components/hypermorph-bento" }
  ];

  return (
    <div className="h-[500px] w-full flex items-center justify-center bg-black">
      <OrbitalCommandRing
        options={customOptions}
        onNavigate={(path) => router.push(path)}
        title="Page Navigator"
        eyebrow="Hold & drag to select destination"
      />
    </div>
  );
}`,
    props: [
      { name: "options", type: "CommandItem[]", defaultValue: "DEFAULT_COMMANDS", description: "Array of options mapping radial menu nodes. Link custom pages by setting path properties: e.g. path: '/components/signal-loom'." },
      { name: "onNavigate", type: "(path: string) => void", defaultValue: "undefined", description: "Optional custom router navigation callback: e.g. (path) => router.push(path). Defers navigation until execution animations play." },
      { name: "title", type: "string", defaultValue: `"Orbital Command Ring"`, description: "Ambient background watermark text.", control: { type: "text" } },
      { name: "eyebrow", type: "string", defaultValue: `"Hold & drag anywhere to summon"`, description: "Action instruction hint displayed under the watermark.", control: { type: "text" } },
      { name: "bg", type: "string", defaultValue: `"#050505"`, description: "Hex backdrop background color of the widget viewport.", control: { type: "color" } },
      { name: "borderColor", type: "string", defaultValue: `"rgba(255,255,255,0.05)"`, description: "Outer frame CSS border color.", control: { type: "color" } },
      { name: "joystickColor", type: "string", defaultValue: `"#ffffff"`, description: "Default color of the central indicator node.", control: { type: "color" } }
    ]
  },
  {
    id: "kinetic-glass-grid",
    slug: "kinetic-glass-grid",
    title: "Kinetic Glass Grid",
    description: "A physical, reactive glass grid that elevates and glows intelligently based on cursor proximity, using complex distance-based spring physics.",
    category: "Backgrounds",
    tags: ["Framer Motion", "Physics", "Glassmorphism", "Interactive Grid"],
    cliCommand: "npx @melonui-dev/cli add kinetic-glass-grid",
    codeSnippet: `const distance = useTransform([mouseX, mouseY], ([latestX, latestY]) => {\n  // Distance calculation logic\n});\nconst scale = useSpring(useTransform(distance, [0, MAX_DISTANCE], [1.3, 1]), springConfig);`,
    componentPath: "KineticGlassGrid",
    props: [
      { name: "title", type: "string", defaultValue: `""`, description: "Optional title header to render in top left corner.", control: { type: "text" } },
      { name: "eyebrow", type: "string", defaultValue: `""`, description: "Optional smaller eyebrow label placed above the title.", control: { type: "text" } },
      { name: "gridSize", type: "number", defaultValue: "8", description: "Row/column size of the grid layout (e.g. 8 yields 64 glass tiles).", control: { type: "slider", min: 4, max: 12, step: 1 } },
      { name: "maxDistance", type: "number", defaultValue: "250", description: "Radius in pixels for proximity tracking to elevate tiles.", control: { type: "slider", min: 100, max: 500, step: 10 } },
      { name: "primaryColor", type: "string", defaultValue: `"#ff5c71"`, description: "Hover glowing shadow color on tiles.", control: { type: "color" } },
      { name: "accentColor", type: "string", defaultValue: `"#7fff5e"`, description: "Color of central dots inside hovered tiles.", control: { type: "color" } },
      { name: "bg", type: "string", defaultValue: `"#050505"`, description: "Hex background color of the grid canvas.", control: { type: "color" } }
    ]
  },
  {
    id: "signal-loom",
    slug: "signal-loom",
    title: "Signal Loom",
    description: "A transparent pointer-reactive glass command surface where luminous workflow threads bend toward the cursor and layered inspection wafers morph into focus.",
    category: "Cards",
    tags: ["Framer Motion", "Glassmorphism", "Pointer Physics", "Workflow"],
    cliCommand: "npx @melonui-dev/cli add signal-loom",
    codeSnippet: `const pointerX = useMotionValue(50);
const pointerY = useMotionValue(50);
const smoothX = useSpring(pointerX, { stiffness: 180, damping: 26, mass: 0.6 });
const smoothY = useSpring(pointerY, { stiffness: 180, damping: 26, mass: 0.6 });

// Curved SVG loom paths, radial glare, and inspection lens all derive from pointer motion.`,
    componentPath: "SignalLoom",
    usageCode: `import { SignalLoom } from "@/components/community/demos/SignalLoom";

export default function Demo() {
  return (
    <div className="w-full">
      {/* Customize the label text below using the eyebrow, title, and lensLabel props */}
      <SignalLoom 
        eyebrow="Workflow telemetry"
        title="Bespoke Pipeline Controller"
        statusLabel="Active"
        lensLabel="Inspector Tool"
        currentThreadLabel="Selected Node"
        hoverHint="Hover thread to select"
        clickHint="Click thread to lockdown"
      />
    </div>
  );
}`,
    props: [
      { name: "title", type: "string", defaultValue: `"Weave the next action"`, description: "Main command-surface headline text. Set this prop to customize card title.", control: { type: "text" } },
      { name: "eyebrow", type: "string", defaultValue: `"Signal Loom"`, description: "Small eyebrow label text above the headline. Customize to change eyebrow.", control: { type: "text" } },
      { name: "statusLabel", type: "string", defaultValue: `"Live"`, description: "Status pill indicator label.", control: { type: "text" } },
      { name: "lensLabel", type: "string", defaultValue: `"Inspection Lens"`, description: "Inspector panel section label.", control: { type: "text" } },
      { name: "currentThreadLabel", type: "string", defaultValue: `"Current Thread"`, description: "Eyebrow detail text inside detail wafer card.", control: { type: "text" } },
      { name: "hoverHint", type: "string", defaultValue: `"Hover threads"`, description: "Footer left-side indicator text.", control: { type: "text" } },
      { name: "clickHint", type: "string", defaultValue: `"Click to pin"`, description: "Footer right-side indicator text.", control: { type: "text" } },
      { name: "metricLabel1", type: "string", defaultValue: `"Pulse"`, description: "First telemetry metric label key.", control: { type: "text" } },
      { name: "metricLabel2", type: "string", defaultValue: `"Glass"`, description: "Second telemetry metric label key.", control: { type: "text" } },
      { name: "metricLabel3", type: "string", defaultValue: `"Drift"`, description: "Third telemetry metric label key.", control: { type: "text" } }
    ],
  },
  {
    id: "floating-orbs",
    slug: "floating-orbs",
    title: "Floating Orbs",
    description: "3D interactive floating orbs rendered with React Three Fiber, supporting OrbitControls, custom sizing, and reduced-motion states.",
    category: "Backgrounds",
    tags: ["React Three Fiber", "ThreeJS", "3D", "Interactive"],
    cliCommand: "npx @melonui-dev/cli add floating-orbs",
    codeSnippet: "",
    componentPath: "FloatingOrbs",
    props: [
      { name: "fov", type: "number", defaultValue: "60", description: "Camera field of view.", control: { type: "slider", min: 30, max: 120, step: 5 } }
    ]
  },
  {
    id: "glitch-pulse-core",
    slug: "glitch-pulse-core",
    title: "Glitch Pulse Core",
    description: "A highly interactive cybernetic core utilizing Framer Motion for magnetic hover physics, states (STABLE, UNSTABLE, CRITICAL) and SVG-based escalating glitch effects.",
    category: "Widgets",
    tags: ["Framer Motion", "Glitch", "Interactive", "SVG Filter"],
    cliCommand: "npx @melonui-dev/cli add glitch-pulse-core",
    codeSnippet: ``,
    componentPath: "GlitchPulseCore",
    props: [
      { name: "initialCoreState", type: "string", defaultValue: `"STABLE"`, description: "Starting state of the core: STABLE, UNSTABLE, or CRITICAL.", control: { type: "text" } },
      { name: "stableColor", type: "string", defaultValue: `"#7fff5e"`, description: "Hex color of the core in STABLE state.", control: { type: "color" } },
      { name: "unstableColor", type: "string", defaultValue: `"#ffaa00"`, description: "Hex color of the core in UNSTABLE state.", control: { type: "color" } },
      { name: "criticalColor", type: "string", defaultValue: `"#ff5c71"`, description: "Hex color of the core in CRITICAL state.", control: { type: "color" } }
    ]
  },
  {
    id: "magnetic-particle-field",
    slug: "magnetic-particle-field",
    title: "Magnetic Particle Field",
    description: "Background particles dynamically attract toward cursor and components in a verlet physics R3F instance field.",
    category: "Backgrounds",
    tags: ["Three.js", "R3F", "Physics", "InstancedMesh"],
    cliCommand: "npx @melonui-dev/cli add magnetic-particle-field",
    codeSnippet: ``,
    componentPath: "MagneticParticleField",
    props: [
      { name: "particleCount", type: "number", defaultValue: "500", description: "Number of active physics particles.", control: { type: "slider", min: 100, max: 1000, step: 50 } },
      { name: "particleColor", type: "string", defaultValue: `"#7fff5e"`, description: "Hex color of the physical particles.", control: { type: "color" } },
      { name: "particleSize", type: "number", defaultValue: "0.08", description: "Geometric scale radius of octahedrons.", control: { type: "slider", min: 0.02, max: 0.25, step: 0.01 } },
      { name: "glowIntensity", type: "number", defaultValue: "1.5", description: "Emissive physical light intensity.", control: { type: "slider", min: 0.1, max: 5.0, step: 0.1 } },
      { name: "bg", type: "string", defaultValue: `"#050505"`, description: "Backdrop space canvas color.", control: { type: "color" } },
      { name: "titleText", type: "string", defaultValue: `""`, description: "Optional alert box title.", control: { type: "text" } },
      { name: "eyebrowText", type: "string", defaultValue: `""`, description: "Optional subtitle text.", control: { type: "text" } }
    ]
  },
  {
    id: "retro-crt-background",
    slug: "retro-crt-background",
    title: "Retro CRT Scan Universe",
    description: "A nostalgic cyber-terminal background featuring scanlines, phosphor glow, typing effect, and screen flicker.",
    category: "Backgrounds",
    tags: ["CSS", "Retro", "Terminal", "Animations"],
    cliCommand: "npx @melonui-dev/cli add retro-crt-background",
    codeSnippet: ``,
    componentPath: "RetroCrtBackground",
    props: [
      { name: "bg", type: "string", defaultValue: `"#0a1105"`, description: "Retro green-black base background color.", control: { type: "color" } },
      { name: "color", type: "string", defaultValue: `"#7fff5e"`, description: "Phosphor green terminal display color.", control: { type: "color" } },
      { name: "scanlineSpeed", type: "number", defaultValue: "10", description: "Cycle duration (seconds) of scanline sweep animation.", control: { type: "slider", min: 1, max: 30, step: 1 } },
      { name: "typingSpeed", type: "number", defaultValue: "20", description: "Base interval (milliseconds) between keyboard strokes.", control: { type: "slider", min: 5, max: 100, step: 5 } },
      { name: "flickerIntensity", type: "number", defaultValue: "0.15", description: "Flicker speed rate multiplier.", control: { type: "slider", min: 0.0, max: 1.0, step: 0.05 } }
    ]
  },
  {
    id: "sticker-collage-wall",
    slug: "sticker-collage-wall",
    title: "Sticker Collage Noise Wall",
    description: "A Gen-Z chaotic scrapbook aesthetic with draggable torn paper stickers and reactive physics.",
    category: "Backgrounds",
    tags: ["Framer Motion", "Physics", "Drag", "Gen-Z"],
    cliCommand: "npx @melonui-dev/cli add sticker-collage-wall",
    codeSnippet: ``,
    componentPath: "StickerCollageWall",
    props: [
      { name: "bg", type: "string", defaultValue: `"#e5e5e5"`, description: "Editorial backing board color.", control: { type: "color" } },
      { name: "gridOpacity", type: "number", defaultValue: "0.2", description: "Opacity of background grids.", control: { type: "slider", min: 0.0, max: 1.0, step: 0.05 } },
      { name: "stickerScaleMultiplier", type: "number", defaultValue: "1.0", description: "Uniform scale multiplier for stickers.", control: { type: "slider", min: 0.5, max: 2.0, step: 0.1 } },
      { name: "dragFree", type: "boolean", defaultValue: "true", description: "Toggle cursor physics dragging.", control: { type: "text" } },
      { name: "titleText", type: "string", defaultValue: `""`, description: "Watermark editorial title text.", control: { type: "text" } },
      { name: "primaryColor", type: "string", defaultValue: `"#ff5c71"`, description: "Gradient color for stickers.", control: { type: "color" } },
      { name: "secondaryColor", type: "string", defaultValue: `"#7fff5e"`, description: "Gradient color for stickers.", control: { type: "color" } }
    ]
  },
  {
    id: "hypermorph-bento",
    slug: "hypermorph-bento",
    title: "HyperMorph Bento",
    description: "A highly dynamic 2x2 grid of layout items expanding to flex columns/rows with spring animations.",
    category: "Cards",
    tags: ["Framer Motion", "Layout", "Bento"],
    cliCommand: "npx @melonui-dev/cli add hypermorph-bento",
    codeSnippet: "// See HyperMorphBento.tsx",
    componentPath: "HyperMorphBento",
    usageCode: `import { HyperMorphBento } from "@/components/community/demos/HyperMorphBento";

export default function Demo() {
  // Customize bento grid content by passing custom cards, icons, colors, and stats
  const customItems = [
    {
      id: "node-1",
      title: "Custom Service",
      subtitle: "API LAYER",
      color: "#ff5c71",
      icon: (
        <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
          <circle cx="12" cy="12" r="10" />
        </svg>
      ),
      content: "Customize this bento box with your own custom descriptive text content.",
      metrics: [
        { label: "Status", value: "Active" },
        { label: "Queries", value: "99.9%" }
      ]
    }
  ];

  return (
    <div className="w-full">
      <HyperMorphBento items={customItems} />
    </div>
  );
}`,
    props: [
      { name: "items", type: "BentoItem[]", defaultValue: "DEFAULT_ITEMS", description: "Array of bento items to render inside the grid. Modify this array to render your own bento content." }
    ]
  },
  {
    id: "quantum-lens-decoder",
    slug: "quantum-lens-decoder",
    title: "Quantum Lens Decoder",
    description: "An interactive code-breaking surface revealing clear text through a cursor-tracking lens.",
    category: "Cards",
    tags: ["Framer Motion", "Clip Path", "Scramble"],
    cliCommand: "npx @melonui-dev/cli add quantum-lens-decoder",
    codeSnippet: "// See QuantumLensDecoder.tsx",
    componentPath: "QuantumLensDecoder",
    props: [
      { name: "title", type: "string", defaultValue: `"TOP SECRET"`, description: "The reveal title header.", control: { type: "text" } },
      { name: "clearText", type: "string", defaultValue: `"PROJECT MELON IS THE FUTURE OF UI. INITIATING PROTOCOL NEON. BYPASSING SECURITY. SYSTEM COMPROMISED. FULL ACCESS GRANTED. PREPARE FOR DEPLOYMENT."`, description: "The underlying decrypted text revealed inside the lens.", control: { type: "text" } },
      { name: "lensSize", type: "number", defaultValue: "180", description: "Pixel diameter of the cursor-tracking decryption lens.", control: { type: "slider", min: 100, max: 300, step: 10 } },
      { name: "primaryColor", type: "string", defaultValue: `"#7fff5e"`, description: "Main theme neon color for decoded content.", control: { type: "color" } },
      { name: "secondaryColor", type: "string", defaultValue: `"#ff5c71"`, description: "Accent secondary neon color.", control: { type: "color" } },
      { name: "bgColor", type: "string", defaultValue: `"#050505"`, description: "Backdrop background color of the canvas.", control: { type: "color" } }
    ]
  },
  {
    id: "elastic-tether-hub",
    slug: "elastic-tether-hub",
    title: "Elastic Tether Hub",
    description: "A centralized command core that blooms draggable action nodes on click, featuring elastic spring physics, real-time distance tracking, and a dramatic pull-to-fire release mechanic.",
    category: "Widgets",
    tags: ["Framer Motion", "Physics", "Drag", "Interactive", "Menu"],
    cliCommand: "npx @melonui-dev/cli add elastic-tether-hub",
    codeSnippet: "// See ElasticTetherHub.tsx",
    componentPath: "ElasticTetherHub",
    usageCode: `import { ElasticTetherHub } from "@/components/community/demos/ElasticTetherHub";

export default function Demo() {
  return (
    <div className="flex items-center justify-center p-12 w-full min-h-[500px]">
      <ElasticTetherHub />
    </div>
  );
}`,
  },
  {
    id: "fluid-magnetic-dial",
    slug: "fluid-magnetic-dial",
    title: "Fluid Magnetic Dial",
    description: "A highly interactive, fluid-like control dial featuring magnetic Framer Motion physics, gooey SVG filters, and dynamic glitching text. Perfect for premium, futuristic dashboard interfaces.",
    category: "Inputs",
    tags: ["Framer Motion", "Magnetic", "Gooey", "Experimental"],
    cliCommand: "npx @melonui-dev/cli add fluid-magnetic-dial",
    codeSnippet: "// See FluidMagneticDial.tsx",
    componentPath: "FluidMagneticDial",
    scrollable: false,
    usageCode: `import { FluidMagneticDial } from "@/components/community/demos/FluidMagneticDial";

export default function Demo() {
  return (
    <div className="flex items-center justify-center p-20 min-h-[400px]">
      <FluidMagneticDial
        size={240}
        label="SYSTEM LOAD"
        primaryColor="#00f0ff"
        secondaryColor="#ff5c71"
      />
    </div>
  );
}`,
    props: [
      {
        name: "size",
        type: "number",
        defaultValue: "240",
        description: "The width and height of the entire dial component in pixels.",
        control: { type: "slider", min: 100, max: 400, step: 10 }
      },
      {
        name: "label",
        type: "string",
        defaultValue: "INTENSITY",
        description: "The small text label displayed above the value.",
        control: { type: "text" }
      },
      {
        name: "defaultValue",
        type: "number",
        defaultValue: "50",
        description: "The initial starting value of the dial.",
        control: { type: "slider", min: 0, max: 100, step: 1 }
      },
      {
        name: "primaryColor",
        type: "string",
        defaultValue: "#7fff5e",
        description: "The starting color of the circular progress track (at min value).",
        control: { type: "color" }
      },
      {
        name: "secondaryColor",
        type: "string",
        defaultValue: "#ff5c71",
        description: "The ending color of the circular progress track (at max value).",
        control: { type: "color" }
      }
    ]
  },
  {
    id: "synapse-terminal",
    slug: "synapse-terminal",
    title: "Synapse Terminal",
    description: "A Gen-Z premium interactive graph node UI with animated bezier tethers, glassmorphic floating elements, and a reactive custom cursor. Perfect for data visualization, SaaS dashboards, or cyber-aesthetic landing pages.",
    category: "Widgets",
    tags: ["Graph", "Network", "Framer Motion", "Interactive", "Cyber", "Dashboard"],
    cliCommand: "npx @melonui-dev/cli add synapse-terminal",
    codeSnippet: "// See SynapseTerminal.tsx",
    componentPath: "SynapseTerminal",
    scrollable: false,
    usageCode: `import { SynapseTerminal } from "@/components/community/demos/SynapseTerminal";

export default function MyPage() {
  return (
    <div className="w-full max-w-4xl p-8">
      <SynapseTerminal />
    </div>
  );
}`,
    aiPrompt: "Generate a Synapse Terminal component that renders an interactive graph visualization with magnetic glassmorphic nodes, animated bezier connection tethers, and a custom reactive tracking cursor.",
  }
];

// Helper to group components by category
export const getComponentsByCategory = () => {
  const categories: Record<string, ComponentData[]> = {};
  componentsData.forEach((component) => {
    if (!categories[component.category]) {
      categories[component.category] = [];
    }
    categories[component.category].push(component);
  });
  return categories;
};

export const getComponentBySlug = (slug: string) => {
  return componentsData.find(c => c.slug === slug);
};
