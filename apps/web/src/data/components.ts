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

export interface AntiGravityBentoProps {
  width?: string | number;
  height?: string | number;
  bg?: string;
  borderColor?: string;
  items?: React.ReactNode[];
  spotlightColor?: string;
  className?: string;
  style?: React.CSSProperties;
}

const DEFAULT_ITEMS = [
  <div key="1" className="h-full w-full bg-[#111] rounded-xl border border-white/10 flex items-center justify-center overflow-hidden">
    <div className="w-8 h-8 rounded-full bg-[#ff5c71] blur-md absolute opacity-50 mix-blend-screen" />
    <span className="text-white font-['Outfit'] font-bold text-lg relative z-10">METRICS</span>
  </div>,
  <div key="2" className="h-full w-full bg-[#111] rounded-xl border border-white/10 flex items-center justify-center overflow-hidden">
    <div className="w-12 h-[2px] bg-[#7fff5e] rotate-45" />
    <div className="w-12 h-[2px] bg-[#7fff5e] -rotate-45 absolute" />
  </div>,
  <div key="3" className="h-full w-full bg-[#111] rounded-xl border border-white/10 p-4 flex flex-col justify-between">
    <div className="w-4 h-4 rounded-full border border-[#00f0ff] animate-pulse" />
    <span className="text-[#00f0ff] font-mono text-xs">SYNCING</span>
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
  style
}) => {
  const containerRef = useRef<HTMLDivElement>(null);
  const [isHovered, setIsHovered] = useState(false);
  const [mounted, setMounted] = useState(false);

  useEffect(() => {
    const timeout = setTimeout(() => setMounted(true), 0);
    return () => clearTimeout(timeout);
  }, []);

  // Mouse position for spotlight and 3D tilt
  const mouseX = useMotionValue(0);
  const mouseY = useMotionValue(0);

  // Smooth mouse values
  const smoothX = useSpring(mouseX, { stiffness: 300, damping: 30 });
  const smoothY = useSpring(mouseY, { stiffness: 300, damping: 30 });

  // 3D Tilt transforms
  const rotateX = useTransform(smoothY, [-0.5, 0.5], [10, -10]);
  const rotateY = useTransform(smoothX, [-0.5, 0.5], [-10, 10]);

  // Spotlight radial gradient
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

  return (
    <div style={{ opacity: mounted ? 1 : 0, transition: "opacity 0.2s" }}>
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
    >
      {/* Container Body */}
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
        {/* Subtle SVG Noise */}
        <div
          className="absolute inset-0 opacity-[0.03] pointer-events-none mix-blend-overlay"
          style={{
            backgroundImage: \`url("data:image/svg+xml,%3Csvg viewBox='0 0 200 200' xmlns='http://www.w3.org/2000/svg'%3E%3Cfilter id='noiseFilter'%3E%3CfeTurbulence type='fractalNoise' baseFrequency='0.65' numOctaves='3' stitchTiles='stitch'/%3E%3C/filter%3E%3Crect width='100%25' height='100%25' filter='url(%23noiseFilter)'/%3E%3C/svg%3E")\`,
          }}
        />

        {/* Dynamic Spotlight */}
        <motion.div
          className="absolute inset-0 pointer-events-none opacity-0 group-hover:opacity-100 transition-opacity duration-500"
          style={{ background: spotlightBackground }}
        />

        {/* Inner Grid / Floating Area */}
        <div className="absolute inset-0 p-4">
          <div className="w-full h-full relative">
            {items.map((item, index) => {
              // Deterministic pseudo-random values for floating animation
              const seed = index * 137;
              const randomX = ((seed % 100) / 100 - 0.5) * 150; // -75 to 75
              const randomY = (((seed * 7) % 100) / 100 - 0.5) * 150;
              const randomRot = (((seed * 11) % 100) / 100 - 0.5) * 45;
              const randomZ = ((seed % 50) + 20); // 20 to 70

              // Base grid position logic (simple 2x2 assumption for 4 items)
              const row = Math.floor(index / 2);
              const col = index % 2;
              const gridTop = \`\${row * 50}%\`;
              const gridLeft = \`\${col * 50}%\`;

              // Parallax effect based on mouse when floating
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
                          // Floating State (Anti-Gravity)
                          top: "50%",
                          left: "50%",
                          x: \`calc(-50% + \${randomX}px)\`,
                          y: \`calc(-50% + \${randomY}px)\`,
                          rotate: randomRot,
                          scale: 1.1,
                          z: randomZ,
                        }
                      : {
                          // Snapped Grid State
                          top: gridTop,
                          left: gridLeft,
                          x: "0%",
                          y: "0%",
                          rotate: 0,
                          scale: 1,
                          z: 0,
                        }
                  }
                  style={
                    isHovered
                      ? {
                          // Add mouse parallax on top of the base animation position
                          // Framer motion allows combining animate state with style overwrites carefully,
                          // but to keep it simple and clean we apply parallax as a secondary translation.
                          // Wait, Framer motion style overrides animate's x/y if not careful.
                          // Let's use a wrapper for parallax!
                        }
                      : {}
                  }
                  transition={{
                    type: "spring",
                    stiffness: 150 + (index * 20), // staggered spring
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
                     {/* The item content wrapper */}
                     <div className="w-[160px] h-[160px] shadow-2xl">
                       {item}
                     </div>
                  </motion.div>
                </motion.div>
              );
            })}
          </div>
        </div>

        {/* Anti-Gravity Indicator */}
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
    </div>
  );
}

export default AntiGravityBento;
`,
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
      id: "blob-cursor",
      slug: "blob-cursor",
      title: "Blob Cursor",
      description: "Velocity-based squash and stretch blob with elastic trailing ring.",
      category: "Cursors",
      tags: ["GSAP", "Cursor"],
      cliCommand: "npx @melonui-dev/cli add blob-cursor",
      codeSnippet: `"use client";

import { useEffect, useRef, useState } from "react";
import { createPortal } from "react-dom";
import gsap from "gsap";

export interface JuicyCursorProps extends React.ComponentPropsWithoutRef<"div"> {
  containerRef?: React.RefObject<HTMLElement | null>;
  color?: string;
  size?: number;
  ringSize?: number;
  ringColor?: string;
  borderColor?: string;
}

export function JuicyCursor({
  containerRef,
  color = "#ff5c71",
  size = 20,
  ringSize = 40,
  ringColor = "#ff5c71",
  borderColor = "#1a1a1a",
  className = "",
  style,
  ...props
}: JuicyCursorProps) {
  const blobRef = useRef<HTMLDivElement>(null);
  const ringRef = useRef<HTMLDivElement>(null);
  const previewRef = useRef<HTMLDivElement>(null);
  const posRef = useRef({ x: 0, y: 0, vx: 0, vy: 0, px: 0, py: 0 });
  const [isVisible, setIsVisible] = useState(false);
  const [mounted, setMounted] = useState(false);

  useEffect(() => {
    setMounted(true);
  }, []);

  useEffect(() => {
    const blob = blobRef.current;
    const ring = ringRef.current;
    if (!blob || !ring) return;

    const target = containerRef ? containerRef.current : previewRef.current;
    if (!target) return;

    // Apply cursor-none to target
    const originalCursor = target.style.cursor;
    const originalPosition = target.style.position;
    
    if (containerRef) {
      target.style.cursor = "none";
      const computedStyle = window.getComputedStyle(target);
      if (computedStyle.position === "static") {
        target.style.position = "relative";
      }
    }

    const onMove = (e: MouseEvent) => {
      const p = posRef.current;
      const rect = target.getBoundingClientRect();
      const x = e.clientX - rect.left;
      const y = e.clientY - rect.top;

      p.vx = x - p.x;
      p.vy = y - p.y;
      p.x = x;
      p.y = y;

      const speed = Math.sqrt(p.vx ** 2 + p.vy ** 2);
      const scaleX = 1 + Math.min(speed * 0.02, 0.6);
      const scaleY = 1 - Math.min(speed * 0.01, 0.3);
      const angle = Math.atan2(p.vy, p.vx) * (180 / Math.PI);

      gsap.to(blob, {
        x,
        y,
        scaleX,
        scaleY,
        rotation: angle,
        duration: 0.15,
        ease: "power2.out",
      });

      gsap.to(ring, {
        x,
        y,
        duration: 0.5,
        ease: "power3.out",
      });
    };

    const onDown = () => {
      gsap.to(blob, { scale: 0.6, duration: 0.15, ease: "power2.in" });
      gsap.to(ring, { scale: 1.5, opacity: 0.3, duration: 0.2, ease: "power2.in" });
    };

    const onUp = () => {
      gsap.to(blob, { scale: 1, duration: 0.4, ease: "elastic.out(1,0.4)" });
      gsap.to(ring, { scale: 1, opacity: 0.4, duration: 0.4, ease: "elastic.out(1,0.4)" });
    };

    const onEnter = () => setIsVisible(true);
    const onLeave = () => setIsVisible(false);

    target.addEventListener("mousemove", onMove);
    target.addEventListener("mousedown", onDown);
    target.addEventListener("mouseup", onUp);
    target.addEventListener("mouseenter", onEnter);
    target.addEventListener("mouseleave", onLeave);

    // Initial state check
    setIsVisible(true);

    return () => {
      target.removeEventListener("mousemove", onMove);
      target.removeEventListener("mousedown", onDown);
      target.removeEventListener("mouseup", onUp);
      target.removeEventListener("mouseenter", onEnter);
      target.removeEventListener("mouseleave", onLeave);
      if (containerRef) {
        target.style.cursor = originalCursor;
        target.style.position = originalPosition;
      }
    };
  }, [containerRef, mounted]);

  const positionClass = "absolute";

  const cursorElements = (
    <>
      {/* Blob cursor */}
      <div
        ref={blobRef}
        className={\`\${positionClass} pointer-events-none z-[9999] -translate-x-1/2 -translate-y-1/2\`}
        style={{ top: 0, left: 0, display: isVisible ? "block" : "none" }}
      >
        <div
          className="rounded-full"
          style={{
            width: size,
            height: size,
            backgroundColor: color,
          }}
        />
      </div>

      {/* Trailing ring */}
      <div
        ref={ringRef}
        className={\`\${positionClass} pointer-events-none z-[9998] -translate-x-1/2 -translate-y-1/2\`}
        style={{ top: 0, left: 0, opacity: 0.4, display: isVisible ? "block" : "none" }}
      >
        <div
          className="rounded-full border"
          style={{
            width: ringSize,
            height: ringSize,
            borderColor: ringColor,
          }}
        />
      </div>
    </>
  );

  // If containerRef is provided, render via Portal
  if (containerRef) {
    if (!mounted || !containerRef.current) return null;
    return createPortal(cursorElements, containerRef.current);
  }

  // Localized preview
  return (
    <div
      ref={previewRef}
      className={\`w-full h-64 flex items-center justify-center relative overflow-hidden cursor-none \${className}\`}
      style={{
        border: \`1px solid \${borderColor}\`,
        backgroundColor: "transparent",
        ...style
      }}
      {...props}
    >
      <p className="font-mono text-[#333] text-sm uppercase tracking-widest select-none pointer-events-none">
        Move your cursor here
      </p>

      {cursorElements}

      {/* Decorative seeds pattern */}
      <div className="absolute bottom-4 right-4 flex gap-1 opacity-20 pointer-events-none">
        {Array.from({ length: 5 }).map((_, i) => (
          <div
            key={i}
            className="w-1 h-3 rounded-full border"
            style={{
              transform: \`rotate(\${-15 + i * 8}deg)\`,
              backgroundColor: borderColor,
              borderColor: color,
            }}
          />
        ))}
      </div>
    </div>
  );
}
`,
      componentPath: "JuicyCursor",
    },
  {
      id: "burst-button",
      slug: "burst-button",
      title: "Burst Button",
      description: "Seeds physically burst from the click point with GSAP staggered physics.",
      category: "Buttons",
      tags: ["GSAP", "Physics"],
      cliCommand: "npx @melonui-dev/cli add burst-button",
      codeSnippet: `"use client";

import { useRef, useState } from "react";
import gsap from "gsap";

// Seed shape as a small SVG
function Seed({ style, fill, stroke }: { style?: React.CSSProperties; fill: string; stroke: string }) {
  return (
    <svg
      width="8"
      height="14"
      viewBox="0 0 8 14"
      style={style}
      className="absolute pointer-events-none"
    >
      <ellipse cx="4" cy="7" rx="3.5" ry="6" fill={fill} stroke={stroke} strokeWidth="1" />
    </svg>
  );
}

export interface SeedBurstButtonProps extends React.ComponentPropsWithoutRef<"div"> {
  label?: string;
  count?: number;
  gravity?: number;
  seedColor?: string;
  seedStrokeColor?: string;
  buttonColor?: string;
  buttonTextColor?: string;
  stripeColor?: string;
  juiceColor?: string;
  buttonClassName?: string;
  buttonStyle?: React.CSSProperties;
}

export function SeedBurstButton({
  label = "Click Me",
  count = 12,
  gravity = 0.6,
  seedColor = "#1a1a1a",
  seedStrokeColor = "#ff5c71",
  buttonColor = "#ff5c71",
  buttonTextColor = "#050505",
  stripeColor = "#7fff5e",
  juiceColor = "#e8d5b7",
  buttonClassName = "",
  buttonStyle,
  className = "",
  style,
  ...props
}: SeedBurstButtonProps) {
  const btnRef = useRef<HTMLButtonElement>(null);
  const seedsRef = useRef<(HTMLDivElement | null)[]>([]);
  const [active, setActive] = useState(false);

  const handleClick = (e: React.MouseEvent<HTMLButtonElement>) => {
    if (!btnRef.current) return;
    setActive(true);

    const rect = btnRef.current.getBoundingClientRect();
    const originX = e.clientX - rect.left;
    const originY = e.clientY - rect.top;

    seedsRef.current.forEach((seed, i) => {
      if (!seed) return;
      const angle = (i / count) * Math.PI * 2;
      const dist = 60 + Math.random() * 60;
      const dx = Math.cos(angle) * dist;
      const dy = Math.sin(angle) * dist + (gravity * 50);

      gsap.set(seed, {
        x: originX,
        y: originY,
        opacity: 1,
        scale: 0.5 + Math.random() * 0.8,
        rotation: Math.random() * 360,
      });

      gsap.to(seed, {
        x: originX + dx,
        y: originY + dy,
        opacity: 0,
        scale: 0,
        rotation: \`+=\${180 + Math.random() * 360}\`,
        duration: 0.8 + Math.random() * 0.4,
        ease: "power2.out",
        onComplete: () => setActive(false),
      });
    });
  };

  return (
    <div
      className={\`relative flex items-center justify-center overflow-visible \${className}\`}
      style={style}
      {...props}
    >
      {/* Seeds overlay */}
      {Array.from({ length: count }).map((_, i) => (
        <div
          key={i}
          ref={(el) => { seedsRef.current[i] = el; }}
          className="absolute opacity-0 pointer-events-none"
          style={{ left: 0, top: 0 }}
        >
          <Seed fill={seedColor} stroke={seedStrokeColor} />
        </div>
      ))}

      <button
        ref={btnRef}
        onClick={handleClick}
        className={\`relative px-10 py-4 font-black uppercase tracking-widest text-lg overflow-hidden transition-transform active:scale-95 select-none \${buttonClassName}\`}
        style={{
          fontFamily: "var(--font-anton)",
          backgroundColor: buttonColor,
          color: buttonTextColor,
          ...buttonStyle,
        }}
      >
        {/* Rind stripe */}
        <span className="absolute inset-x-0 bottom-0 h-1.5" style={{ backgroundColor: stripeColor }} />
        <span className="relative z-10">{label}</span>

        {/* Juice burst overlay */}
        <span
          className={\`absolute inset-0 transition-opacity duration-150 \${active ? "opacity-20" : "opacity-0"}\`}
          style={{ backgroundColor: juiceColor }}
        />
      </button>
    </div>
  );
}
`,
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
      id: "char-reveal",
      slug: "char-reveal",
      title: "Char Reveal",
      description: "Characters blur-in with stagger tied to ScrollTrigger scroll position.",
      category: "Scroll Effects",
      tags: ["GSAP", "ScrollTrigger"],
      cliCommand: "npx @melonui-dev/cli add char-reveal",
      codeSnippet: `"use client";

import { useEffect, useRef } from "react";
import gsap from "gsap";
import ScrollTrigger from "gsap/ScrollTrigger";

gsap.registerPlugin(ScrollTrigger);

function getScrollParent(el: HTMLElement): HTMLElement | null {
  let parent = el.parentElement;
  while (parent) {
    const { overflowY } = window.getComputedStyle(parent);
    if (overflowY === "auto" || overflowY === "scroll") return parent;
    parent = parent.parentElement;
  }
  return null;
}

export interface HarvestRevealProps extends React.ComponentPropsWithoutRef<"div"> {
  text?: string;
  stagger?: number;
  duration?: number;
  blur?: number;
  fontSize?: string;
  showSpacers?: boolean;
  showDecoration?: boolean;
  colorPattern?: string[]; // Custom color list pattern
  decorColor?: string;
}

export function HarvestReveal({
  text = "Every great UI starts as a seed.",
  stagger = 0.045,
  duration = 0.65,
  blur = 6,
  fontSize = "text-3xl md:text-4xl",
  showSpacers = false,
  showDecoration = false,
  colorPattern = ["#ff5c71", "#f4f4f4", "#7fff5e"],
  decorColor = "#ff5c71",
  className = "",
  style,
  ...props
}: HarvestRevealProps) {
  const containerRef = useRef<HTMLDivElement>(null);
  const charsRef = useRef<(HTMLSpanElement | null)[]>([]);

  const runAnimation = () => {
    const prefersReducedMotion = window.matchMedia("(prefers-reduced-motion: reduce)").matches;
    if (prefersReducedMotion) return;

    const chars = charsRef.current.filter(Boolean);
    gsap.killTweensOf(chars);
    gsap.set(chars, { opacity: 0, y: 24, filter: \`blur(\${blur}px)\` });
    gsap.to(chars, {
      opacity: 1,
      y: 0,
      filter: "blur(0px)",
      duration: duration,
      stagger: stagger,
      ease: "power2.out",
    });
  };

  useEffect(() => {
    if (!containerRef.current) return;

    const prefersReducedMotion = window.matchMedia("(prefers-reduced-motion: reduce)").matches;
    if (prefersReducedMotion) {
      const chars = charsRef.current.filter(Boolean);
      gsap.set(chars, { opacity: 1, y: 0, filter: "none" });
      return;
    }

    const scroller = getScrollParent(containerRef.current) ?? undefined;

    const ctx = gsap.context(() => {
      const chars = charsRef.current.filter(Boolean);
      gsap.set(chars, { opacity: 0, y: 24, filter: \`blur(\${blur}px)\` });

      gsap.to(chars, {
        opacity: 1,
        y: 0,
        filter: "blur(0px)",
        duration: duration,
        stagger: stagger,
        ease: "power2.out",
        scrollTrigger: {
          trigger: containerRef.current,
          scroller: scroller,
          start: "top 85%",
          toggleActions: "play reset play reset",
        },
      });
    }, containerRef);

    return () => ctx.revert();
  }, [stagger, duration, blur, text]);

  const chars = text.split("");

  return (
    <div className="w-full flex flex-col items-center justify-center bg-transparent">
      {/* Spacer above */}
      {showSpacers && (
        <div className="h-24 flex items-end justify-center pb-6">
          <p className="font-mono text-[9px] uppercase tracking-widest text-[#555] flex items-center gap-2">
            <svg width="12" height="12" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
              <path d="M12 5v14M5 12l7 7 7-7" />
            </svg>
            Scroll down or click text to replay
          </p>
        </div>
      )}

      {/* The reveal target */}
      <div 
        ref={containerRef} 
        onClick={runAnimation}
        className={\`py-6 px-4 flex flex-col items-center gap-6 cursor-pointer transition-all duration-200 \${className}\`}
        style={style}
        {...props}
      >
        <p
          className={\`font-black uppercase tracking-tight text-center leading-tight select-none \${fontSize}\`}
          style={{ fontFamily: "var(--font-anton)" }}
        >
          {chars.map((char, i) => {
            const charColor = char === " " 
              ? "transparent" 
              : colorPattern[i % colorPattern.length];
            return (
              <span
                key={i}
                ref={(el) => { charsRef.current[i] = el; }}
                className="inline-block"
                style={{
                  color: charColor,
                  marginRight: char === " " ? "0.25em" : "0",
                  willChange: "transform, opacity, filter"
                }}
              >
                {char === " " ? "\u00A0" : char}
              </span>
            );
          })}
        </p>

        {showDecoration && (
          <div className="flex gap-2 items-center">
            <div className="h-px w-10" style={{ backgroundColor: decorColor }} />
            <span className="text-base select-none" style={{ color: decorColor }}>🌱</span>
            <div className="h-px w-10" style={{ backgroundColor: decorColor }} />
          </div>
        )}
      </div>

      {/* Spacer below */}
      {showSpacers && <div className="h-12" />}
    </div>
  );
}
`,
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
      id: "chromatic-melt-text",
      slug: "chromatic-melt-text",
      title: "Chromatic Melt Text",
      description: "A transparent chromatic wordmark with offset glass shadows, soft pointer glow, and restrained per-letter hover lift.",
      category: "GSAP Text",
      tags: ["Framer Motion", "Typography", "Pointer Physics", "Gradient"],
      cliCommand: "npx @melonui-dev/cli add chromatic-melt-text",
      codeSnippet: `"use client";

import React, { CSSProperties, useState } from "react";
import { motion } from "framer-motion";

export interface ChromaticMeltTextProps extends React.ComponentPropsWithoutRef<"div"> {
  text?: string;
  kicker?: string;
  primaryColor?: string;
  secondaryColor?: string;
  accentColor?: string;
}

export function ChromaticMeltText({
  text = "CHROMA",
  kicker = "Chromatic glass type",
  primaryColor = "#ffffff",
  secondaryColor = "#ff5c71",
  accentColor = "#7fff5e",
  className = "",
  style,
  ...props
}: ChromaticMeltTextProps) {
  const [spot, setSpot] = useState({ x: 48, y: 42 });

  const handlePointerMove = (event: React.PointerEvent<HTMLDivElement>) => {
    const rect = event.currentTarget.getBoundingClientRect();
    setSpot({
      x: ((event.clientX - rect.left) / rect.width) * 100,
      y: ((event.clientY - rect.top) / rect.height) * 100,
    });
  };

  return (
    <div
      aria-label={text}
      onPointerMove={handlePointerMove}
      onPointerLeave={() => setSpot({ x: 48, y: 42 })}
      className={\`relative inline-flex w-full max-w-[980px] flex-col overflow-visible \${className}\`}
      style={style}
      {...props}
    >
      {kicker && (
        <p
          className="mb-3 font-mono text-[10px] uppercase tracking-[0.28em]"
          style={{ color: secondaryColor }}
        >
          {kicker}
        </p>
      )}
      <h2
        className="relative flex flex-wrap items-end gap-x-[0.18em] gap-y-1 text-[clamp(3rem,11vw,8rem)] uppercase leading-[0.78]"
        style={{
          fontFamily: "var(--font-londrina-solid)",
          color: primaryColor,
          textShadow: \`0 18px 42px \${secondaryColor}24\`,
        }}
      >
        <span
          aria-hidden="true"
          className="pointer-events-none absolute -inset-x-8 -inset-y-6 opacity-70 blur-2xl"
          style={{
            background: \`radial-gradient(circle at \${spot.x}% \${spot.y}%, \${secondaryColor}33, \${accentColor}1f 34%, transparent 62%)\`,
          }}
        />
        {text.split(" ").map((word, wordIndex) => (
          <span key={\`\${word}-\${wordIndex}\`} className="inline-flex whitespace-nowrap">
            {word.split("").map((char, index) => {
              const letterIndex = wordIndex * 12 + index;

              return (
                <motion.span
                  key={\`\${char}-\${letterIndex}\`}
                  initial={{ y: 12, opacity: 0, filter: "blur(10px)" }}
                  animate={{ y: 0, opacity: 1, filter: "blur(0px)" }}
                  transition={{ delay: letterIndex * 0.018, duration: 0.42, ease: [0.16, 1, 0.3, 1] }}
                  whileHover={{
                    y: -8,
                    color: accentColor,
                    textShadow: \`-5px 0 0 \${secondaryColor}88, 5px 0 0 \${accentColor}66, 0 18px 42px \${secondaryColor}35\`,
                  }}
                  className="relative inline-block min-w-[0.25em]"
                  style={{
                    textShadow: \`-2px 0 0 \${secondaryColor}55, 2px 0 0 \${accentColor}44, 0 18px 42px \${secondaryColor}24\`,
                  }}
                >
                  {char}
                  <span
                    aria-hidden="true"
                    className="absolute -left-[0.04em] top-[0.12em] -z-10 text-current opacity-35 blur-[0.5px]"
                    style={{ color: secondaryColor }}
                  >
                    {char}
                  </span>
                  <span
                    aria-hidden="true"
                    className="absolute left-[0.05em] top-[-0.08em] -z-10 text-current opacity-30 blur-[0.5px]"
                    style={{ color: accentColor }}
                  >
                    {char}
                  </span>
                </motion.span>
              );
            })}
          </span>
        ))}
      </h2>
    </div>
  );
}
`,
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
      id: "chromatic-slice-card",
      slug: "chromatic-slice-card",
      title: "Chromatic Slice Card",
      description: "A Gen-Z premium card that dynamically slices into floating horizontal strips in 3D space on hover, revealing a neon core.",
      category: "Cards",
      tags: ["Framer Motion", "Premium", "Cyberpunk", "Hover Effect"],
      cliCommand: "npx @melonui-dev/cli add chromatic-slice-card",
      codeSnippet: `"use client";

import React, { useRef, useState, useEffect } from "react";
import { motion, useMotionValue, useSpring, useTransform, useMotionTemplate } from "framer-motion";

export interface ChromaticSliceCardProps extends Omit<React.ComponentPropsWithoutRef<"div">, "onDrag" | "onDragStart" | "onDragEnd" | "onAnimationStart"> {
  title?: string;
  subtitle?: string;
  slices?: number;
  glowColor?: string;
  accentColor?: string;
  imageSrc?: string;
}

export function ChromaticSliceCard({
  title = "CHROMA",
  subtitle = "INTERACTIVE SLICES",
  slices = 5,
  glowColor = "#7fff5e",
  accentColor = "#ff5c71",
  imageSrc = "https://images.unsplash.com/photo-1618005182384-a83a8bd57fbe?q=80&w=2564&auto=format&fit=crop",
  className = "",
  style,
  ...props
}: ChromaticSliceCardProps) {
  const containerRef = useRef<HTMLDivElement>(null);
  const [isHovered, setIsHovered] = useState(false);

  // Mouse position tracking
  const mouseX = useMotionValue(0);
  const mouseY = useMotionValue(0);

  // Smooth springs for mouse movement
  const springConfig = { damping: 20, stiffness: 200, mass: 0.5 };
  const smoothX = useSpring(mouseX, springConfig);
  const smoothY = useSpring(mouseY, springConfig);

  // Calculate 3D rotation based on mouse position
  const rotateX = useTransform(smoothY, [-0.5, 0.5], [15, -15]);
  const rotateY = useTransform(smoothX, [-0.5, 0.5], [-15, 15]);

  // Handle mouse move
  const handleMouseMove = (e: React.MouseEvent<HTMLDivElement>) => {
    if (!containerRef.current) return;

    const rect = containerRef.current.getBoundingClientRect();

    // Calculate normalized mouse position (-0.5 to 0.5)
    const normalizedX = (e.clientX - rect.left) / rect.width - 0.5;
    const normalizedY = (e.clientY - rect.top) / rect.height - 0.5;

    mouseX.set(normalizedX);
    mouseY.set(normalizedY);
  };

  // Reset on mouse leave
  const handleMouseLeave = () => {
    setIsHovered(false);
    mouseX.set(0);
    mouseY.set(0);
  };

  // Generate deterministic random offsets for slices
  const getSliceOffsets = (index: number, total: number) => {
    // We avoid Math.random() in render to prevent hydration errors.
    // Creating pseudo-random values based on index
    const seed = index * 137;
    const dirX = (seed % 3) - 1; // -1, 0, or 1
    const shiftX = dirX * (10 + (seed % 20)); // Offset amount X

    // Spread slices vertically apart from the center
    const middle = (total - 1) / 2;
    const distFromCenter = index - middle;
    const shiftY = distFromCenter * 15; // Vertical separation

    return { shiftX, shiftY, rotateZ: dirX * (seed % 5) };
  };

  return (
    <motion.div
      ref={containerRef}
      className={\`relative w-full max-w-[320px] h-[26rem] rounded-xl cursor-pointer perspective-1000 \${className}\`}
      onMouseMove={handleMouseMove}
      onMouseEnter={() => setIsHovered(true)}
      onMouseLeave={handleMouseLeave}
      style={{
        ...style,
        perspective: "1000px",
      }}
      {...props}
    >
      <motion.div
        className="w-full h-full relative preserve-3d"
        style={{
          rotateX,
          rotateY,
          transformStyle: "preserve-3d"
        }}
      >
        {/* Deep Background Core (Revealed when slices spread) */}
        <div
          className="absolute inset-0 rounded-xl overflow-hidden shadow-2xl transition-all duration-500"
          style={{
            background: "linear-gradient(to bottom right, #050505, #111)",
            boxShadow: isHovered
              ? \`0 0 40px \${glowColor}66, inset 0 0 20px \${glowColor}33\`
              : "0 10px 30px rgba(0,0,0,0.5)",
            border: \`1px solid \${isHovered ? glowColor + '88' : '#333'}\`
          }}
        >
          {/* Internal glowing grid / tech pattern */}
          <div className="absolute inset-0 opacity-20"
               style={{
                 backgroundImage: \`radial-gradient(\${glowColor} 1px, transparent 1px)\`,
                 backgroundSize: "20px 20px"
               }}
          />

          <div className="absolute inset-0 opacity-0 transition-opacity duration-500"
               style={{ opacity: isHovered ? 1 : 0 }}>
             <div className="absolute inset-0 flex flex-col items-center justify-center">
               <div className="text-4xl mb-2" style={{ color: glowColor }}>✧</div>
               <div className="text-xs tracking-[0.3em] font-mono" style={{ color: glowColor }}>
                 INNER VIEW
               </div>
             </div>
          </div>
        </div>

        {/* The Slices */}
        {Array.from({ length: slices }).map((_, i) => {
          // Calculate clip-path for each horizontal slice
          const sliceHeight = 100 / slices;
          const top = i * sliceHeight;
          const bottom = 100 - (i + 1) * sliceHeight;

          // Inset pattern: inset(top right bottom left)
          const clipPath = \`inset(\${top}% 0% \${bottom}% 0%)\`;

          const { shiftX, shiftY, rotateZ } = getSliceOffsets(i, slices);

          // Z depth to make them float off the background
          const zDepth = isHovered ? 40 + Math.abs(shiftY) : 0;

          return (
            <motion.div
              key={i}
              className="absolute inset-0 rounded-xl overflow-hidden pointer-events-none"
              style={{
                clipPath,
              }}
              animate={{
                x: isHovered ? shiftX : 0,
                y: isHovered ? shiftY : 0,
                z: zDepth,
                rotateZ: isHovered ? rotateZ : 0,
                scale: isHovered ? 1.05 : 1,
              }}
              transition={{
                type: "spring",
                damping: 15,
                stiffness: 150 + (i * 20), // slight staggering in spring
                mass: 0.8
              }}
            >
              {/* Actual Content of the slice */}
              <div className="w-full h-full relative">
                {/* Background Image / Color */}
                <div
                  className="absolute inset-0 bg-cover bg-center"
                  style={{ backgroundImage: \`url(\${imageSrc})\` }}
                >
                  {/* Glass overlay */}
                  <div className="absolute inset-0 bg-black/40 backdrop-blur-[2px]" />
                </div>

                {/* Border effect that follows the slice */}
                <div className="absolute inset-0 rounded-xl border border-white/10" />

                {/* Content Overlay - Only render text on middle slices or let it be cut naturally */}
                <div className="absolute inset-0 flex flex-col items-start justify-end p-6">
                  <div className="font-mono text-xs tracking-widest text-white/50 mb-1" style={{ color: accentColor }}>
                    {subtitle}
                  </div>
                  <h2 className="text-3xl font-black text-white tracking-tighter uppercase" style={{ WebkitTextStroke: '1px rgba(255,255,255,0.2)'}}>
                    {title}
                  </h2>
                </div>

                {/* Holographic edge glare */}
                {isHovered && (
                  <div
                    className="absolute inset-0 opacity-30 mix-blend-overlay"
                    style={{
                      background: \`linear-gradient(135deg, transparent 0%, \${glowColor} 50%, transparent 100%)\`
                    }}
                  />
                )}
              </div>
            </motion.div>
          );
        })}
      </motion.div>
    </motion.div>
  );
}
`,
      componentPath: "ChromaticSliceCard",
      usageCode: `import { ChromaticSliceCard } from "@/components/chromatic-slice-card";

  export default function App() {
    return (
      <div className="flex justify-center items-center h-screen bg-black">
        <ChromaticSliceCard
          title="VOID"
          subtitle="SYSTEM OVERRIDE"
          slices={7}
          glowColor="#7fff5e"
          accentColor="#ff5c71"
        />
      </div>
    );
  }`,
      props: [
        {
          name: "title",
          type: "string",
          defaultValue: "VOID",
          description: "The main title displayed on the card slices.",
          control: { type: "text" }
        },
        {
          name: "subtitle",
          type: "string",
          defaultValue: "SYSTEM OVERRIDE",
          description: "The subtitle or eyebrow text.",
          control: { type: "text" }
        },
        {
          name: "slices",
          type: "number",
          defaultValue: "5",
          description: "Number of horizontal slices the card breaks into.",
          control: { type: "slider", min: 3, max: 12, step: 1 }
        },
        {
          name: "glowColor",
          type: "string",
          defaultValue: "#7fff5e",
          description: "Color of the exposed core and internal grid.",
          control: { type: "color" }
        },
        {
          name: "accentColor",
          type: "string",
          defaultValue: "#ff5c71",
          description: "Color of the subtitle text.",
          control: { type: "color" }
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
      codeSnippet: `"use client";

import { useEffect, useRef } from "react";
import gsap from "gsap";

const DEFAULT_LINES = [
  { text: "$ npx @melonui-dev/cli init", delay: 0 },
  { text: "✔ Detected Next.js 15 project", delay: 1.2 },
  { text: "✔ Installing dependencies...", delay: 2.0 },
  { text: "✔ Copying component registry...", delay: 3.0 },
  { text: "🍉 MelonUI ready. Start building.", delay: 4.2 },
];

export interface TerminalLine {
  text: string;
  delay: number;
}

export interface CliTerminalProps extends React.ComponentPropsWithoutRef<"div"> {
  lines?: TerminalLine[];
  title?: string;
  borderColor?: string;
  headerBg?: string;
  bodyBg?: string;
  cursorColor?: string;
  firstLineColor?: string;
  lastLineColor?: string;
  defaultLineColor?: string;
  glowOpacity?: number;
  titleTextColor?: string;
}

export function CliTerminal({
  lines = DEFAULT_LINES,
  title = "melon — bash",
  borderColor = "#1e1e1e",
  headerBg = "rgba(17, 17, 17, 0.5)",
  bodyBg = "transparent",
  cursorColor = "#7fff5e",
  firstLineColor = "#7fff5e",
  lastLineColor = "#ff5c71",
  defaultLineColor = "#a0a0a0",
  glowOpacity = 0.03,
  titleTextColor = "#444",
  className = "",
  style,
  ...props
}: CliTerminalProps) {
  const containerRef = useRef<HTMLDivElement>(null);
  const cursorRef = useRef<HTMLSpanElement>(null);

  useEffect(() => {
    if (!containerRef.current) return;

    const cliLines = containerRef.current.querySelectorAll<HTMLDivElement>(".cli-line");
    const cursor = cursorRef.current;

    const ctx = gsap.context(() => {
      // Start all lines invisible
      gsap.set(cliLines, { opacity: 0, y: 8 });
      if (cursor) gsap.set(cursor, { opacity: 1 });

      const tl = gsap.timeline({ repeat: -1, repeatDelay: 2 });

      lines.forEach((line, i) => {
        if (cliLines[i]) {
          tl.to(cliLines[i], {
            opacity: 1,
            y: 0,
            duration: 0.3,
            ease: "power2.out",
          }, line.delay);
        }
      });

      // Blink cursor
      if (cursor) {
        gsap.to(cursor, {
          opacity: 0,
          duration: 0.5,
          repeat: -1,
          yoyo: true,
          ease: "steps(1)",
        });
      }

      // Reset all lines before repeat
      tl.to(cliLines, {
        opacity: 0,
        y: 8,
        duration: 0.4,
        stagger: 0.05,
        ease: "power2.in",
      }, "+=1.5");
    }, containerRef);

    return () => ctx.revert();
  }, [lines]);

  return (
    <div
      ref={containerRef}
      className={\`w-full max-w-2xl border font-mono text-sm overflow-hidden \${className}\`}
      style={{
        borderColor: borderColor,
        backgroundColor: bodyBg,
        boxShadow: \`0 0 0 1px \${borderColor}, inset 0 0 80px rgba(127,255,94,\${glowOpacity})\`,
        ...style
      }}
      {...props}
    >
      {/* Terminal header */}
      <div
        className="flex items-center gap-2 px-4 py-3 border-b"
        style={{
          backgroundColor: headerBg,
          borderColor: borderColor,
        }}
      >
        <span className="w-2.5 h-2.5 rounded-full bg-[#ff5c71]" />
        <span className="w-2.5 h-2.5 rounded-full bg-[#e8d5b7]" />
        <span className="w-2.5 h-2.5 rounded-full bg-[#7fff5e]" />
        <span className="ml-4 text-xs uppercase tracking-widest" style={{ color: titleTextColor }}>
          {title}
        </span>
      </div>

      {/* Terminal body */}
      <div className="p-6 flex flex-col gap-3 min-h-[180px]">
        {lines.map((line, i) => (
          <div
            key={i}
            className="cli-line"
            style={{
              color: i === 0 ? firstLineColor : i === lines.length - 1 ? lastLineColor : defaultLineColor
            }}
          >
            {line.text}
          </div>
        ))}
        <div className="flex items-center" style={{ color: cursorColor }}>
          <span>$ </span>
          <span ref={cursorRef} className="ml-1 w-2 h-4 inline-block" style={{ backgroundColor: cursorColor }} />
        </div>
      </div>
    </div>
  );
}
`,
      componentPath: "CliTerminal",
    },
  {
      id: "crosshair",
      slug: "crosshair",
      title: "Crosshair",
      description: "Precision crosshair with live coordinate readout and a grid overlay.",
      category: "Cursors",
      tags: ["GSAP", "Cursor"],
      cliCommand: "npx @melonui-dev/cli add crosshair",
      codeSnippet: `"use client";

import { useEffect, useRef, useState } from "react";
import { createPortal } from "react-dom";
import gsap from "gsap";

export interface CrosshairCursorProps extends React.ComponentPropsWithoutRef<"div"> {
  containerRef?: React.RefObject<HTMLElement | null>;
  color?: string;
  borderColor?: string;
}

export function CrosshairCursor({
  containerRef,
  color = "#ff5c71",
  borderColor = "#1a1a1a",
  className = "",
  style,
  ...props
}: CrosshairCursorProps) {
  const cursorRef = useRef<HTMLDivElement>(null);
  const hLineRef = useRef<HTMLDivElement>(null);
  const vLineRef = useRef<HTMLDivElement>(null);
  const labelRef = useRef<HTMLSpanElement>(null);
  const previewRef = useRef<HTMLDivElement>(null);
  const posRef = useRef({ x: 0, y: 0 });
  const [isInside, setIsInside] = useState(false);
  const [mounted, setMounted] = useState(false);

  useEffect(() => {
    setMounted(true);
  }, []);

  useEffect(() => {
    const container = containerRef ? containerRef.current : previewRef.current;
    if (!container) return;

    const originalCursor = container.style.cursor;
    const originalPosition = container.style.position;
    
    if (containerRef) {
      container.style.cursor = "none";
      const computedStyle = window.getComputedStyle(container);
      if (computedStyle.position === "static") {
        container.style.position = "relative";
      }
    }

    const onMove = (e: MouseEvent) => {
      const rect = container.getBoundingClientRect();
      const x = e.clientX - rect.left;
      const y = e.clientY - rect.top;
      posRef.current = { x, y };

      gsap.to(hLineRef.current, { top: y, duration: 0.1, ease: "none" });
      gsap.to(vLineRef.current, { left: x, duration: 0.1, ease: "none" });
      gsap.to(cursorRef.current, { x: x - 6, y: y - 6, duration: 0.08, ease: "none" });
      if (labelRef.current) {
        labelRef.current.textContent = \`\${Math.round(x)}, \${Math.round(y)}\`;
        gsap.to(labelRef.current, { x: x + 14, y: y - 22, duration: 0.1, ease: "none" });
      }
    };

    const onEnter = () => {
      setIsInside(true);
    };

    const onLeave = () => {
      setIsInside(false);
    };

    container.addEventListener("mousemove", onMove);
    container.addEventListener("mouseenter", onEnter);
    container.addEventListener("mouseleave", onLeave);

    setIsInside(true);

    return () => {
      container.removeEventListener("mousemove", onMove);
      container.removeEventListener("mouseenter", onEnter);
      container.removeEventListener("mouseleave", onLeave);
      if (containerRef) {
        container.style.cursor = originalCursor;
        container.style.position = originalPosition;
      }
    };
  }, [containerRef, mounted]);

  const crosshairElements = (
    <div 
      className="absolute inset-0 pointer-events-none overflow-hidden z-[9999]"
      style={{ display: isInside ? "block" : "none" }}
    >
      {/* Crosshair lines */}
      <div
        ref={hLineRef}
        className="absolute inset-x-0 h-px pointer-events-none opacity-40"
        style={{ top: "50%", backgroundColor: color }}
      />
      <div
        ref={vLineRef}
        className="absolute inset-y-0 w-px pointer-events-none opacity-40"
        style={{ left: "50%", backgroundColor: color }}
      />

      {/* Center dot */}
      <div
        ref={cursorRef}
        className="absolute w-3 h-3 pointer-events-none"
        style={{ top: 0, left: 0 }}
      >
        <div className="w-full h-full border rotate-45" style={{ borderColor: color }} />
      </div>

      {/* Coordinates label */}
      <span
        ref={labelRef}
        className="absolute font-mono text-[9px] pointer-events-none uppercase tracking-widest"
        style={{ top: 0, left: 0, color: color }}
      >
        0, 0
      </span>

      {/* Grid overlay */}
      <div
        className="absolute inset-0 pointer-events-none opacity-10"
        style={{
          backgroundImage: \`linear-gradient(\${color} 1px, transparent 1px), linear-gradient(90deg, \${color} 1px, transparent 1px)\`,
          backgroundSize: "40px 40px",
        }}
      />
    </div>
  );

  // If containerRef is provided, render elements via Portal
  if (containerRef) {
    if (!mounted || !containerRef.current) return null;
    return createPortal(crosshairElements, containerRef.current);
  }

  // Default localized preview
  return (
    <div
      ref={previewRef}
      className={\`w-full h-64 relative overflow-hidden cursor-none \${className}\`}
      style={{
        border: \`1px solid \${borderColor}\`,
        backgroundColor: "transparent",
        ...style
      }}
      {...props}
    >
      {crosshairElements}
      <p className="absolute bottom-3 left-0 right-0 text-center font-mono text-[10px] text-[#333] uppercase tracking-widest pointer-events-none">
        Move cursor inside
      </p>
    </div>
  );
}
`,
      componentPath: "CrosshairCursor",
    },
  {
      id: "drip-text",
      slug: "drip-text",
      title: "Drip Text",
      description: "Letters drip down on hover with random skew offsets, spring back on leave.",
      category: "GSAP Text",
      tags: ["GSAP", "Elastic"],
      cliCommand: "npx @melonui-dev/cli add drip-text",
      codeSnippet: `"use client";

import { useRef, useCallback } from "react";
import gsap from "gsap";

export interface MelonDripTextProps extends React.ComponentPropsWithoutRef<"div"> {
  text?: string;
  color?: string;
  activeColor?: string;
  fontSize?: string;
}

export function MelonDripText({
  text = "MELON",
  color = "#ff5c71",
  activeColor = "#7fff5e",
  fontSize = "text-7xl",
  className = "",
  style,
  ...props
}: MelonDripTextProps) {
  const charRefs = useRef<(HTMLSpanElement | null)[]>([]);

  const handleEnter = useCallback(() => {
    charRefs.current.forEach((el, i) => {
      if (!el) return;
      gsap.to(el, {
        y: 12 + Math.random() * 16,
        skewX: (Math.random() - 0.5) * 20,
        color: activeColor,
        duration: 0.4 + i * 0.06,
        ease: "power3.in",
        delay: i * 0.04,
      });
    });
  }, [activeColor]);

  const handleLeave = useCallback(() => {
    charRefs.current.forEach((el, i) => {
      if (!el) return;
      gsap.to(el, {
        y: 0,
        skewX: 0,
        color,
        duration: 0.8,
        ease: "elastic.out(1,0.3)",
        delay: i * 0.03,
      });
    });
  }, [color]);

  return (
    <div
      className={\`cursor-pointer select-none flex items-center \${className}\`}
      onMouseEnter={handleEnter}
      onMouseLeave={handleLeave}
      style={style}
      {...props}
    >
      {text.split("").map((char, i) => (
        <span
          key={i}
          ref={(el) => { charRefs.current[i] = el; }}
          className={\`inline-block font-black tracking-tight \${fontSize}\`}
          style={{
            fontFamily: "var(--font-londrina-solid)",
            color,
            willChange: "transform",
          }}
        >
          {char === " " ? "\u00A0" : char}
        </span>
      ))}
    </div>
  );
}
`,
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
      id: "flip-card",
      slug: "flip-card",
      title: "Flip Card",
      description: "3D rotateY flip using CSS preserve-3d and GSAP for precise control.",
      category: "Cards",
      tags: ["GSAP", "3D", "CSS"],
      cliCommand: "npx @melonui-dev/cli add flip-card",
      codeSnippet: `"use client";

import React, { useRef } from "react";
import gsap from "gsap";

export interface FlipCardProps extends React.ComponentPropsWithoutRef<"div"> {
  width?: string | number;
  height?: string | number;
  frontCategory?: string;
  frontTitle?: string;
  frontHint?: string;
  frontBg?: string;
  frontBorder?: string;
  frontTextColor?: string;
  frontCategoryColor?: string;
  frontHintColor?: string;
  frontStripeColor?: string;

  backEmoji?: string;
  backTitle?: string;
  backHint?: string;
  backBg?: string;
  backTextColor?: string;
  backHintColor?: string;
  
  perspective?: string | number;
  duration?: number;

  children?: React.ReactNode;
  frontChildren?: React.ReactNode;
  backChildren?: React.ReactNode;
}

export const FlipCard = React.forwardRef<HTMLDivElement, FlipCardProps>(
  (
    {
      width = 260,
      height = 180,
      frontCategory = "Component / Card",
      frontTitle = "Flip Card",
      frontHint = "Click to reveal >",
      frontBg = "#0d0d0d",
      frontBorder = "#1e1e1e",
      frontTextColor = "#f4f4f4",
      frontCategoryColor = "#444",
      frontHintColor = "#555",
      frontStripeColor = "rgba(255, 92, 113, 0.2)",

      backEmoji = "🍉",
      backTitle = "Surprise!",
      backHint = "Click again to flip back",
      backBg = "#ff5c71",
      backTextColor = "#050505",
      backHintColor = "rgba(5, 5, 5, 0.6)",

      perspective = "1000px",
      duration = 0.7,

      children,
      frontChildren,
      backChildren,
      className = "",
      style,
      ...props
    },
    forwardedRef
  ) => {
    const internalRef = useRef<HTMLDivElement>(null);
    const ref = (forwardedRef as React.RefObject<HTMLDivElement | null>) || internalRef;
    const cardRef = useRef<HTMLDivElement>(null);
    const isFlipped = useRef(false);

    const flip = () => {
      if (!cardRef.current) return;
      const target = isFlipped.current ? 0 : 180;
      isFlipped.current = !isFlipped.current;
      gsap.to(cardRef.current, {
        rotationY: target,
        duration: duration,
        ease: "power3.inOut",
      });
    };

    const handleKeyDown = (e: React.KeyboardEvent) => {
      if (e.key === "Enter" || e.key === " ") {
        e.preventDefault();
        flip();
      }
    };

    return (
      <div
        ref={ref}
        role="button"
        tabIndex={0}
        className={\`cursor-pointer focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-[#ff5c71] \${className}\`}
        style={{
          perspective,
          width,
          height,
          ...style
        }}
        onClick={flip}
        onKeyDown={handleKeyDown}
        {...props}
      >
        <div
          ref={cardRef}
          style={{
            width: "100%",
            height: "100%",
            transformStyle: "preserve-3d",
            position: "relative",
          }}
        >
          {/* Front */}
          <div
            style={{
              backfaceVisibility: "hidden",
              backgroundColor: frontBg,
              borderColor: frontBorder,
            }}
            className="absolute inset-0 border flex flex-col justify-between p-5"
          >
            {children || frontChildren ? (children || frontChildren) : (
              <>
                <span className="font-mono text-[10px] uppercase tracking-widest" style={{ color: frontCategoryColor }}>
                  {frontCategory}
                </span>
                <div>
                  <p className="font-black text-2xl uppercase" style={{ fontFamily: "var(--font-anton)", color: frontTextColor }}>
                    {frontTitle}
                  </p>
                  <p className="font-mono text-xs mt-1" style={{ color: frontHintColor }}>
                    {frontHint}
                  </p>
                </div>
                <div className="w-full h-px" style={{ backgroundColor: frontStripeColor }} />
              </>
            )}
          </div>

          {/* Back */}
          <div
            style={{
              backfaceVisibility: "hidden",
              transform: "rotateY(180deg)",
              backgroundColor: backBg,
            }}
            className="absolute inset-0 flex flex-col justify-center items-center gap-3 p-5"
          >
            {backChildren ? backChildren : (
              <>
                {backEmoji && <span className="text-4xl">{backEmoji}</span>}
                <p className="font-black text-xl uppercase" style={{ fontFamily: "var(--font-anton)", color: backTextColor }}>
                  {backTitle}
                </p>
                <p className="font-mono text-xs" style={{ color: backHintColor }}>
                  {backHint}
                </p>
              </>
            )}
          </div>
        </div>
      </div>
    );
  }
);

FlipCard.displayName = "FlipCard";
`,
      componentPath: "FlipCard",
      usageCode: `import { FlipCard } from "@/components/community/demos/FlipCard";

  export default function Demo() {
    return (
      <div className="flex items-center justify-center p-12">
        {/* Click the card to flip it and see your backTitle / backEmoji text */}
        <FlipCard 
          frontTitle="Click to open" 
          frontCategory="MelonUI"
          backEmoji="≡ƒÜÇ"
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
        { name: "backEmoji", type: "string", defaultValue: `"≡ƒìë"`, description: "Emoji icon displayed on the back face.", control: { type: "text" } }
      ]
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
      id: "glitch-pulse-core",
      slug: "glitch-pulse-core",
      title: "Glitch Pulse Core",
      description: "A highly interactive cybernetic core utilizing Framer Motion for magnetic hover physics, states (STABLE, UNSTABLE, CRITICAL) and SVG-based escalating glitch effects.",
      category: "Widgets",
      tags: ["Framer Motion", "Glitch", "Interactive", "SVG Filter"],
      cliCommand: "npx @melonui-dev/cli add glitch-pulse-core",
      codeSnippet: `"use client";

import React, { useRef, useState, useEffect } from "react";
import { motion, useMotionValue, useSpring, useTransform, AnimatePresence } from "framer-motion";

type CoreState = "STABLE" | "UNSTABLE" | "CRITICAL";

export interface GlitchPulseCoreProps extends React.ComponentPropsWithoutRef<"div"> {
  initialCoreState?: CoreState;
  stableColor?: string;
  unstableColor?: string;
  criticalColor?: string;
}

export function GlitchPulseCore({
  initialCoreState = "STABLE",
  stableColor = "#7fff5e",
  unstableColor = "#ffaa00",
  criticalColor = "#ff5c71",
  className = "",
  style,
  ...props
}: GlitchPulseCoreProps) {
  const containerRef = useRef<HTMLDivElement>(null);
  const [coreState, setCoreState] = useState<CoreState>(initialCoreState);
  const [mounted, setMounted] = useState(false);

  useEffect(() => {
    const timer = setTimeout(() => {
      setMounted(true);
    }, 0);
    return () => clearTimeout(timer);
  }, []);

  // Magnetic Physics
  const mouseX = useMotionValue(0);
  const mouseY = useMotionValue(0);

  const springConfig = { damping: 15, stiffness: 150, mass: 0.8 };
  const magneticX = useSpring(mouseX, springConfig);
  const magneticY = useSpring(mouseY, springConfig);

  const rotateX = useTransform(magneticY, [-0.5, 0.5], [25, -25]);
  const rotateY = useTransform(magneticX, [-0.5, 0.5], [-25, 25]);

  const handleMouseMove = (e: React.MouseEvent) => {
    if (!containerRef.current) return;
    const rect = containerRef.current.getBoundingClientRect();
    const x = (e.clientX - rect.left) / rect.width - 0.5;
    const y = (e.clientY - rect.top) / rect.height - 0.5;
    mouseX.set(x);
    mouseY.set(y);
  };

  const handleMouseLeave = () => {
    mouseX.set(0);
    mouseY.set(0);
  };

  const handleCoreClick = () => {
    setCoreState((prev) => {
      if (prev === "STABLE") return "UNSTABLE";
      if (prev === "UNSTABLE") return "CRITICAL";
      return "STABLE";
    });
  };

  const colors = {
    STABLE: stableColor,
    UNSTABLE: unstableColor,
    CRITICAL: criticalColor,
  };

  const currentColor = colors[coreState];

  if (!mounted) return null;

  return (
    <div
      ref={containerRef}
      onMouseMove={handleMouseMove}
      onMouseLeave={handleMouseLeave}
      className={\`relative w-full h-[500px] flex items-center justify-center bg-[#050505] overflow-hidden rounded-xl border border-white/5 \${className}\`}
      style={{
        perspective: 1000,
        ...style
      }}
      {...props}
    >
      {/* Ambient Glow */}
      <motion.div
        className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[400px] h-[400px] rounded-full blur-[120px] pointer-events-none opacity-30 animate-pulse"
        style={{ backgroundColor: currentColor }}
      />

      {/* Background Grid Pattern */}
      <div
        className="absolute inset-0 opacity-[0.03] pointer-events-none"
        style={{
          backgroundImage: \`radial-gradient(\${currentColor} 1px, transparent 1px)\`,
          backgroundSize: "24px 24px"
        }}
      />

      {/* Background Data Stream (only active in CRITICAL) */}
      <AnimatePresence>
        {coreState === "CRITICAL" && (
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 0.1 }}
            exit={{ opacity: 0 }}
            className="absolute inset-0 flex flex-col justify-between p-4 pointer-events-none"
          >
            {Array.from({ length: 15 }).map((_, i) => (
              <motion.div
                key={i}
                className="h-[1px]"
                style={{ backgroundColor: criticalColor }}
                initial={{ width: 0, x: i % 2 === 0 ? "-100%" : "100%" }}
                animate={{ width: "100%", x: 0 }}
                transition={{ repeat: Infinity, duration: 1 + (i % 3) * 0.5, ease: "linear" }}
              />
            ))}
          </motion.div>
        )}
      </AnimatePresence>

      <motion.div
        style={{
          rotateX,
          rotateY,
          transformStyle: "preserve-3d",
        }}
        className="relative flex items-center justify-center w-[300px] h-[300px] cursor-crosshair z-10"
      >
        {/* Orbital Rings */}
        <motion.div
          className="absolute inset-0 pointer-events-none"
          animate={{ rotate: 360 }}
          transition={{ repeat: Infinity, duration: coreState === "CRITICAL" ? 6 : coreState === "UNSTABLE" ? 12 : 24, ease: "linear" }}
          style={{ transform: "translateZ(-40px)" }}
        >
          <svg className="w-full h-full opacity-40" viewBox="0 0 100 100">
            <circle cx="50" cy="50" r="48" fill="none" stroke={currentColor} strokeWidth="0.5" strokeDasharray="3 3" />
            <circle cx="50" cy="50" r="45" fill="none" stroke="rgba(255,255,255,0.05)" strokeWidth="1" />
            {/* Outer ticks */}
            <path d="M50 0 L50 4 M50 96 L50 100 M0 50 L4 50 M96 50 L100 50" stroke={currentColor} strokeWidth="1" />
          </svg>
        </motion.div>

        <motion.div
          className="absolute inset-4 pointer-events-none"
          animate={{ rotate: -360 }}
          transition={{ repeat: Infinity, duration: coreState === "CRITICAL" ? 8 : coreState === "UNSTABLE" ? 18 : 36, ease: "linear" }}
          style={{ transform: "translateZ(20px)" }}
        >
          <svg className="w-full h-full opacity-35" viewBox="0 0 100 100">
            <circle cx="50" cy="50" r="40" fill="none" stroke={currentColor} strokeWidth="1.5" strokeDasharray="20 10 5 10" />
          </svg>
        </motion.div>

        <motion.div
          className="absolute inset-10 pointer-events-none"
          animate={{ rotate: 360 }}
          transition={{ repeat: Infinity, duration: coreState === "CRITICAL" ? 4 : coreState === "UNSTABLE" ? 10 : 20, ease: "linear" }}
          style={{ transform: "translateZ(60px)" }}
        >
          <svg className="w-full h-full opacity-50" viewBox="0 0 100 100">
            <circle cx="50" cy="50" r="30" fill="none" stroke={currentColor} strokeWidth="1" strokeDasharray="6 2" />
            {/* Rotating nodes */}
            <circle cx="50" cy="20" r="2" fill={currentColor} />
            <circle cx="50" cy="80" r="2" fill={currentColor} />
          </svg>
        </motion.div>

        {/* Central Core */}
        <motion.div
          onClick={handleCoreClick}
          whileHover={{ scale: 1.1 }}
          whileTap={{ scale: 0.95 }}
          className="relative w-28 h-28 rounded-full flex items-center justify-center overflow-hidden"
          style={{
            transform: "translateZ(100px)",
            backdropFilter: "blur(15px)",
            background: "rgba(10, 10, 10, 0.7)",
            border: \`1.5px solid \${currentColor}\`,
            boxShadow: \`0 0 40px \${currentColor}33, inset 0 0 25px \${currentColor}20\`,
          }}
        >
          {/* Inner Glowing Ring */}
          <div className="absolute inset-2 rounded-full border border-white/5" />

          {/* Core Inner Energy */}
          <motion.div
            className="w-14 h-14 rounded-full blur-[8px]"
            animate={{
              scale: coreState === "CRITICAL" ? [1, 1.4, 1] : coreState === "UNSTABLE" ? [1, 1.2, 1] : [1, 1.05, 1],
              opacity: [0.6, 0.9, 0.6],
              backgroundColor: currentColor
            }}
            transition={{ repeat: Infinity, duration: coreState === "CRITICAL" ? 0.3 : coreState === "UNSTABLE" ? 0.8 : 2 }}
          />

          {/* Core Center Solid Bead */}
          <motion.div
            className="absolute w-6 h-6 rounded-full shadow-[0_0_15px_rgba(255,255,255,0.8)]"
            style={{ backgroundColor: "#ffffff" }}
            animate={coreState === "CRITICAL" ? { scale: [0.8, 1.2, 0.8] } : { scale: 1 }}
            transition={{ repeat: Infinity, duration: 0.5 }}
          />

          {/* Tech Subdivisions */}
          <svg className="absolute inset-0 w-full h-full opacity-20 pointer-events-none" viewBox="0 0 100 100">
            <line x1="50" y1="0" x2="50" y2="100" stroke="white" strokeWidth="0.5" />
            <line x1="0" y1="50" x2="100" y2="50" stroke="white" strokeWidth="0.5" />
          </svg>
        </motion.div>

        {/* State Label Floating Element */}
        <motion.div
          className="absolute -bottom-16 left-1/2 -translate-x-1/2 px-4 py-1 rounded-full bg-white/5 border border-white/10 font-mono text-xs tracking-[0.2em] uppercase backdrop-blur-sm shadow-[0_4px_12px_rgba(0,0,0,0.5)]"
          style={{ transform: "translateZ(80px)", color: currentColor }}
          animate={{
             y: [0, -5, 0],
             opacity: coreState === "CRITICAL" ? [0.5, 1, 0.5] : 1
          }}
          transition={{ repeat: Infinity, duration: 2 }}
        >
          {coreState}
        </motion.div>
      </motion.div>
    </div>
  );
}
`,
      componentPath: "GlitchPulseCore",
      props: [
        { name: "initialCoreState", type: "string", defaultValue: `"STABLE"`, description: "Starting state of the core: STABLE, UNSTABLE, or CRITICAL.", control: { type: "text" } },
        { name: "stableColor", type: "string", defaultValue: `"#7fff5e"`, description: "Hex color of the core in STABLE state.", control: { type: "color" } },
        { name: "unstableColor", type: "string", defaultValue: `"#ffaa00"`, description: "Hex color of the core in UNSTABLE state.", control: { type: "color" } },
        { name: "criticalColor", type: "string", defaultValue: `"#ff5c71"`, description: "Hex color of the core in CRITICAL state.", control: { type: "color" } }
      ]
    },
  {
      id: "glyph-orbit-text",
      slug: "glyph-orbit-text",
      title: "Glyph Orbit Text",
      description: "A transparent central headline surrounded by orbiting character tiles derived from the same word, forming a readable typographic halo.",
      category: "GSAP Text",
      tags: ["Framer Motion", "Typography", "Orbit", "Glyphs"],
      cliCommand: "npx @melonui-dev/cli add glyph-orbit-text",
      codeSnippet: `"use client";

import React, { CSSProperties, useState } from "react";
import { motion, useReducedMotion } from "framer-motion";

export interface GlyphOrbitTextProps extends React.ComponentPropsWithoutRef<"button"> {
  text?: string;
  glyphs?: string[];
  primaryColor?: string;
  secondaryColor?: string;
  accentColor?: string;
}

export function GlyphOrbitText({
  text = "ORBIT",
  glyphs,
  primaryColor = "#ffffff",
  secondaryColor = "#ff5c71",
  accentColor = "#7fff5e",
  className = "",
  style,
  ...props
}: GlyphOrbitTextProps) {
  const [active, setActive] = useState(false);
  const shouldReduceMotion = useReducedMotion();
  const orbitGlyphs = glyphs && glyphs.length > 0 ? glyphs : text.replace(/\s/g, "").split("");

  return (
    <button
      type="button"
      aria-label={\`\${text} glyph orbit\`}
      onPointerEnter={() => setActive(true)}
      onPointerLeave={() => setActive(false)}
      className={\`relative inline-grid min-h-[clamp(15rem,34vw,22rem)] w-full max-w-[980px] cursor-pointer place-items-center overflow-visible bg-transparent p-0 focus:outline-none focus-visible:ring-2 focus-visible:ring-[#7fff5e] \${className}\`}
      style={style}
      {...props}
      onClick={(e) => {
        setActive((value) => !value);
        if (props.onClick) props.onClick(e);
      }}
    >
      <motion.span
        aria-hidden="true"
        className="absolute h-[clamp(11rem,24vw,16rem)] w-[clamp(11rem,24vw,16rem)] rounded-full border border-dashed border-white/18"
        animate={{ rotate: active && !shouldReduceMotion ? 360 : 0, scale: active ? 1.08 : 1 }}
        transition={{ 
          rotate: { duration: shouldReduceMotion ? 0 : 8, repeat: active && !shouldReduceMotion ? Infinity : 0, ease: "linear" }, 
          scale: shouldReduceMotion ? { duration: 0 } : { type: "spring" } 
        }}
      />
      {orbitGlyphs.map((glyph, index) => {
        const angle = (index / orbitGlyphs.length) * Math.PI * 2 - Math.PI / 2;
        const radius = active ? 132 : 116;
        return (
          <motion.span
            key={\`\${glyph}-\${index}\`}
            className="absolute grid h-10 w-10 place-items-center rounded-[6px] border border-white/12 bg-black/20 text-2xl uppercase backdrop-blur-md sm:h-12 sm:w-12 sm:text-3xl"
            style={{ fontFamily: "var(--font-londrina-solid)", color: index % 2 ? secondaryColor : accentColor }}
            animate={{
              x: Math.cos(angle) * radius,
              y: Math.sin(angle) * radius,
              rotate: active && !shouldReduceMotion ? angle * (180 / Math.PI) + 90 : 0,
              opacity: active ? 1 : 0.34,
              scale: active ? 1 : 0.72,
            }}
            transition={shouldReduceMotion ? { duration: 0 } : { type: "spring", stiffness: 180, damping: 18, delay: index * 0.02 }}
          >
            {glyph}
          </motion.span>
        );
      })}
      <motion.span
        className="relative text-[clamp(4rem,13vw,9rem)] uppercase leading-none"
        style={{
          fontFamily: "var(--font-londrina-solid)",
          color: primaryColor,
          textShadow: "0 0 42px rgba(255,92,113,0.22)",
        }}
        animate={{ scale: active ? 0.9 : 1, letterSpacing: active ? "0.045em" : "0em" }}
        transition={shouldReduceMotion ? { duration: 0 } : { type: "spring", stiffness: 220, damping: 20 }}
      >
        {text}
      </motion.span>
    </button>
  );
}
`,
      componentPath: "GlyphOrbitText",
      props: [
        { name: "text", type: "string", defaultValue: `"ORBIT"`, description: "Central headline text.", control: { type: "text" } },
        { name: "primaryColor", type: "string", defaultValue: `"#ffffff"`, description: "Central headline color.", control: { type: "color" } },
        { name: "accentColor", type: "string", defaultValue: `"#7fff5e"`, description: "Primary orbit glyph color.", control: { type: "color" } }
      ],
    },
  {
      id: "grow-input",
      slug: "grow-input",
      title: "Grow Input",
      description: "SVG stroke dashoffset vine grows along the bottom border on focus.",
      category: "Inputs",
      tags: ["GSAP", "SVG"],
      cliCommand: "npx @melonui-dev/cli add grow-input",
      codeSnippet: `"use client";

import { useRef, useEffect } from "react";
import gsap from "gsap";

export interface VineInputProps extends Omit<React.ComponentPropsWithoutRef<"input">, "style"> {
  label?: string;
  hint?: string;
  glowColor?: string;
  growSpeed?: number;
  
  labelColor?: string;
  hintColor?: string;
  inputTextColor?: string;
  placeholderColor?: string;
  borderColor?: string;
  
  wrapperClassName?: string;
  wrapperStyle?: React.CSSProperties;
  inputClassName?: string;
  inputStyle?: React.CSSProperties;
}

export function VineInput({
  label = "Your Name",
  hint = "Focus the field — watch the vine grow",
  glowColor = "#7fff5e",
  growSpeed = 1.0,
  
  labelColor = "#555",
  hintColor = "#444",
  inputTextColor = "#f4f4f4",
  placeholderColor = "#333",
  borderColor = "#333",
  
  wrapperClassName = "",
  wrapperStyle,
  inputClassName = "",
  inputStyle,
  placeholder = "e.g. Farmer Joe",
  ...props
}: VineInputProps) {
  const wrapperRef = useRef<HTMLDivElement>(null);
  const svgRef = useRef<SVGPathElement>(null);
  const inputRef = useRef<HTMLInputElement>(null);

  useEffect(() => {
    const path = svgRef.current;
    if (!path) return;

    const len = path.getTotalLength();
    gsap.set(path, {
      strokeDasharray: len,
      strokeDashoffset: len,
    });
  }, []);

  const handleFocus = (e: React.FocusEvent<HTMLInputElement>) => {
    const path = svgRef.current;
    if (path) {
      gsap.to(path, {
        strokeDashoffset: 0,
        duration: 0.7 / growSpeed,
        ease: "power3.out",
      });
    }
    if (props.onFocus) {
      props.onFocus(e);
    }
  };

  const handleBlur = (e: React.FocusEvent<HTMLInputElement>) => {
    const path = svgRef.current;
    if (path) {
      const len = path.getTotalLength();
      gsap.to(path, {
        strokeDashoffset: len,
        duration: 0.5 / growSpeed,
        ease: "power2.in",
      });
    }
    if (props.onBlur) {
      props.onBlur(e);
    }
  };

  return (
    <div
      className={\`flex flex-col gap-6 w-full max-w-sm \${wrapperClassName}\`}
      style={wrapperStyle}
    >
      {label && (
        <label className="font-mono text-xs uppercase tracking-widest" style={{ color: labelColor }}>
          {label}
        </label>
      )}

      <div ref={wrapperRef} className="relative">
        <input
          ref={inputRef}
          type="text"
          placeholder={placeholder}
          onFocus={handleFocus}
          onBlur={handleBlur}
          className={\`w-full bg-transparent border-0 border-b px-0 py-3 font-mono text-lg outline-none \${inputClassName}\`}
          style={{
            borderColor: borderColor,
            color: inputTextColor,
            ...inputStyle
          }}
          {...props}
        />
        {/* SVG vine underline */}
        <svg
          className="absolute bottom-0 left-0 w-full overflow-visible pointer-events-none"
          height="4"
          preserveAspectRatio="none"
          viewBox="0 0 300 4"
        >
          <path
            ref={svgRef}
            d="M0 2 Q 37.5 -2 75 2 Q 112.5 6 150 2 Q 187.5 -2 225 2 Q 262.5 6 300 2"
            fill="none"
            stroke={glowColor}
            strokeWidth="2"
            strokeLinecap="round"
          />
        </svg>

        {/* Leaf icon at end */}
        <span className="absolute right-0 bottom-3 text-lg select-none pointer-events-none">🌿</span>
      </div>

      {hint && (
        <p className="font-mono text-xs" style={{ color: hintColor }}>
          {hint}
        </p>
      )}
    </div>
  );
}
`,
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
      id: "holo-ticket",
      slug: "holo-ticket",
      title: "Holo Ticket",
      description: "Premium holographic ticket component with 3D pointer-tracking reflection, dynamic CSS clipping, and elastic tearing physics.",
      category: "Cards",
      tags: ["GSAP", "Clip", "Glassmorphism", "Holographic"],
      cliCommand: "npx @melonui-dev/cli add holo-ticket",
      codeSnippet: `"use client";

import React, { useRef, useState, useEffect } from "react";
import gsap from "gsap";

export interface HoloTicketProps extends React.ComponentPropsWithoutRef<"div"> {
  width?: string | number;
  height?: string | number;
  
  topEyebrow?: string;
  topSerial?: string;
  topTitle?: React.ReactNode;
  topSubtitle?: string;
  topBg?: string;
  topBorder?: string;
  topTextColor?: string;
  topSerialColor?: string;
  topSubtitleColor?: string;
  
  bottomBg?: string;
  bottomText?: string;
  bottomTextColor?: string;
  
  redeemedText?: string;
  redeemedColor?: string;
  redeemedBg?: string;
  
  perspective?: string | number;
  foilGradient?: string;

  children?: React.ReactNode;
  topChildren?: React.ReactNode;
  bottomChildren?: React.ReactNode;
}

export const HoloTicket = React.forwardRef<HTMLDivElement, HoloTicketProps>(
  (
    {
      width = 256,
      height = 384,
      
      topEyebrow = "Admit One",
      topSerial = "No. 0842",
      topTitle = <>Melon<br/>Fest</>,
      topSubtitle = "VIP ACCESS",
      topBg = "#0d0d0d",
      topBorder = "rgba(255, 92, 113, 0.2)",
      topTextColor = "#f4f4f4",
      topSerialColor = "#555",
      topSubtitleColor = "#7fff5e",
      
      bottomBg = "#ff5c71",
      bottomText = "Tear to Enter",
      bottomTextColor = "#050505",
      
      redeemedText = "Redeemed",
      redeemedColor = "#ff5c71",
      redeemedBg = "rgba(0, 0, 0, 0.6)",
      
      perspective = "1000px",
      foilGradient = "linear-gradient(125deg, rgba(255,92,113,0) 0%, rgba(255,92,113,0.3) 30%, rgba(127,255,94,0.4) 50%, rgba(255,92,113,0.3) 70%, rgba(255,92,113,0) 100%)",
      
      children,
      topChildren,
      bottomChildren,
      className = "",
      style,
      ...props
    },
    forwardedRef
  ) => {
    const internalRef = useRef<HTMLDivElement>(null);
    const ref = (forwardedRef as React.RefObject<HTMLDivElement | null>) || internalRef;
    const ticketRef = useRef<HTMLDivElement>(null);
    const topRef = useRef<HTMLDivElement>(null);
    const bottomRef = useRef<HTMLDivElement>(null);
    const foilRef = useRef<HTMLDivElement>(null);

    const [isTorn, setIsTorn] = useState(false);
    const [isDragging, setIsDragging] = useState(false);
    const startY = useRef(0);
    const currentY = useRef(0);

    // 3D Tilt Effect
    const handleMouseMove = (e: React.MouseEvent) => {
      if (!ticketRef.current || isDragging || isTorn) return;
      const rect = ticketRef.current.getBoundingClientRect();
      const x = e.clientX - rect.left;
      const y = e.clientY - rect.top;
      const centerX = rect.width / 2;
      const centerY = rect.height / 2;

      const rotateX = ((y - centerY) / centerY) * -15;
      const rotateY = ((x - centerX) / centerX) * 15;

      gsap.to(ticketRef.current, {
        rotateX,
        rotateY,
        duration: 0.4,
        ease: "power2.out",
      });

      if (foilRef.current) {
        gsap.to(foilRef.current, {
          backgroundPosition: \`\${(x / rect.width) * 100}% \${(y / rect.height) * 100}%\`,
          opacity: 0.8,
          duration: 0.4,
        });
      }
    };

    const handleMouseLeave = () => {
      if (!ticketRef.current || isDragging || isTorn) return;
      gsap.to(ticketRef.current, {
        rotateX: 0,
        rotateY: 0,
        duration: 0.8,
        ease: "elastic.out(1, 0.5)",
      });
      if (foilRef.current) {
        gsap.to(foilRef.current, { opacity: 0, duration: 0.5 });
      }
    };

    // Drag to Tear Effect
    const handlePointerDown = (e: React.PointerEvent) => {
      if (isTorn) return;
      // Only drag from the bottom stub
      if (!bottomRef.current?.contains(e.target as Node)) return;

      setIsDragging(true);
      startY.current = e.clientY;
      currentY.current = 0;

      if (ticketRef.current) {
        gsap.to(ticketRef.current, {
          rotateX: 0,
          rotateY: 0,
          duration: 0.3,
        });
      }

      window.addEventListener("pointermove", handlePointerMove);
      window.addEventListener("pointerup", handlePointerUp);
      e.currentTarget.setPointerCapture(e.pointerId);
    };

    const handlePointerMove = (e: PointerEvent) => {
      if (isTorn) return;
      const deltaY = Math.max(0, e.clientY - startY.current);
      currentY.current = deltaY * 0.4;

      if (bottomRef.current) {
        gsap.set(bottomRef.current, {
          y: currentY.current,
          rotateZ: currentY.current * 0.05,
        });
      }

      if (topRef.current && bottomRef.current) {
        const gap = currentY.current;
        gsap.set(topRef.current, {
           clipPath: \`polygon(0 0, 100% 0, 100% calc(100% + \${gap}px), 0 calc(100% + \${gap}px))\`
        });
      }
    };

    const handlePointerUp = () => {
      setIsDragging(false);
      window.removeEventListener("pointermove", handlePointerMove);
      window.removeEventListener("pointerup", handlePointerUp);

      const TEAR_THRESHOLD = 40;

      if (currentY.current > TEAR_THRESHOLD) {
        tearTicket();
      } else {
        snapBack();
      }
    };

    const snapBack = () => {
      if (!bottomRef.current) return;
      gsap.to(bottomRef.current, {
        y: 0,
        rotateZ: 0,
        duration: 0.6,
        ease: "elastic.out(1, 0.3)",
      });
      if (topRef.current) {
        gsap.to(topRef.current, {
           clipPath: "polygon(0 0, 100% 0, 100% 100%, 0 100%)",
           duration: 0.6,
           ease: "elastic.out(1, 0.3)",
        });
      }
    };

    const tearTicket = () => {
      setIsTorn(true);

      if (bottomRef.current) {
        const rotateVal = ((currentY.current % 10) - 5) * 8;
        gsap.to(bottomRef.current, {
          y: currentY.current + 200,
          rotateZ: rotateVal,
          opacity: 0,
          duration: 0.8,
          ease: "power2.in",
        });
      }

      if (topRef.current) {
        gsap.timeline()
          .to(topRef.current, {
            scale: 1.05,
            duration: 0.1,
            ease: "power2.out",
          })
          .to(topRef.current, {
            scale: 1,
            duration: 0.5,
            ease: "elastic.out(1, 0.4)",
          });
      }

      setTimeout(() => {
        resetTicket();
      }, 2500);
    };

    const resetTicket = () => {
      setIsTorn(false);
      currentY.current = 0;
      if (bottomRef.current) {
        gsap.set(bottomRef.current, { y: 0, rotateZ: 0, opacity: 1 });
      }
      if (topRef.current) {
        gsap.set(topRef.current, { scale: 1, clipPath: "polygon(0 0, 100% 0, 100% 100%, 0 100%)" });
      }
      if (ticketRef.current) {
        gsap.to(ticketRef.current, {
          rotateX: 0,
          rotateY: 0,
          duration: 0.4,
        });
      }
    };

    const handleKeyDown = (e: React.KeyboardEvent) => {
      if (e.key === "Enter" || e.key === " ") {
        e.preventDefault();
        if (!isTorn && !isDragging) {
          tearTicket();
        }
      }
    };

    useEffect(() => {
      return () => {
        window.removeEventListener("pointermove", handlePointerMove);
        window.removeEventListener("pointerup", handlePointerUp);
      };
      // eslint-disable-next-line react-hooks/exhaustive-deps
    }, []);

    return (
      <div
        ref={ref}
        role="button"
        tabIndex={isTorn ? -1 : 0}
        className={\`relative select-none focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-[#ff5c71] \${className}\`}
        style={{
          perspective,
          width,
          height,
          ...style,
        }}
        onKeyDown={handleKeyDown}
        {...props}
      >
        {/* Container to handle 3D Transforms */}
        <div
          ref={ticketRef}
          className="w-full h-full relative"
          onMouseMove={handleMouseMove}
          onMouseLeave={handleMouseLeave}
          onPointerDown={handlePointerDown}
          style={{ transformStyle: "preserve-3d", touchAction: "none" }}
        >
          {/* Shadow Layer */}
          <div className="absolute inset-0 bg-black/50 blur-xl translate-y-4 -z-10 rounded-2xl" />

          {/* --- Top Part --- */}
          <div
            ref={topRef}
            className="absolute top-0 left-0 w-full h-[70%] rounded-t-2xl flex flex-col justify-between overflow-hidden"
            style={{
              clipPath: "polygon(0 0, 100% 0, 100% 100%, 0 100%)",
              backgroundColor: topBg,
              border: \`1px solid \${topBorder}\`,
              borderBottom: "none"
            }}
          >
            {/* Noise overlay */}
            <div className="absolute inset-0 opacity-10 mix-blend-overlay pointer-events-none" style={{ backgroundImage: "url('data:image/svg+xml;utf8,%3Csvg viewBox=%220 0 200 200%22 xmlns=%22http://www.w3.org/2000/svg%22%3E%3Cfilter id=%22noiseFilter%22%3E%3CfeTurbulence type=%22fractalNoise%22 baseFrequency=%220.65%22 numOctaves=%223%22 stitchTiles=%22stitch%22/%3E%3C/filter%3E%3Crect width=%22100%25%22 height=%22100%25%22 filter=%22url(%23noiseFilter)%22/%3E%3C/svg%3E')" }} />

            <div className="p-6 relative z-10 h-full flex flex-col justify-between">
              {children || topChildren ? (children || topChildren) : (
                <>
                  <div className="flex justify-between items-start mb-4">
                    <span className="font-mono text-[10px] uppercase tracking-widest" style={{ color: redeemedColor }}>
                      {topEyebrow}
                    </span>
                    <span className="font-mono text-[10px]" style={{ color: topSerialColor }}>
                      {topSerial}
                    </span>
                  </div>

                  <div>
                    <h3 className="text-4xl font-black uppercase tracking-tighter mb-1 leading-none" style={{ fontFamily: "var(--font-anton)", color: topTextColor }}>
                      {topTitle}
                    </h3>
                    <p className="font-mono text-xs" style={{ color: topSubtitleColor }}>
                      {topSubtitle}
                    </p>
                  </div>
                </>
              )}

              {/* Holographic foil overlay effect */}
              <div
                ref={foilRef}
                className="absolute inset-0 pointer-events-none mix-blend-color-dodge opacity-0 transition-opacity duration-300"
                style={{
                  background: foilGradient,
                  backgroundSize: "200% 200%",
                }}
              />
            </div>

            {/* Status overlay when torn */}
            <div
              className={\`absolute inset-0 flex items-center justify-center backdrop-blur-sm z-20 transition-all duration-300 \${isTorn ? 'opacity-100' : 'opacity-0 pointer-events-none'}\`}
              style={{ backgroundColor: redeemedBg }}
            >
               <span
                 className="border-2 px-4 py-1 font-mono text-lg font-bold uppercase tracking-widest rotate-[-15deg]"
                 style={{ color: redeemedColor, borderColor: redeemedColor }}
               >
                 {redeemedText}
               </span>
            </div>

            {/* Jagged bottom edge (Top Half) */}
            <div className="absolute bottom-0 left-0 w-full h-2 flex">
              {Array.from({ length: 16 }).map((_, i) => (
                <div key={i} className="flex-1" style={{ backgroundColor: topBg, clipPath: "polygon(50% 100%, 0 0, 100% 0)" }} />
              ))}
            </div>
          </div>

          {/* --- Bottom Part (Stub) --- */}
          <div
            ref={bottomRef}
            className="absolute bottom-0 left-0 w-full h-[30%] rounded-b-2xl flex flex-col justify-center items-center cursor-grab active:cursor-grabbing border-t border-dashed border-[#050505]/40"
            style={{
              transformOrigin: "top center",
              backgroundColor: bottomBg,
            }}
          >
             {/* Jagged top edge (Bottom Half) */}
             <div className="absolute top-0 left-0 w-full h-2 flex -translate-y-full">
              {Array.from({ length: 16 }).map((_, i) => (
                <div key={i} className="flex-1" style={{ backgroundColor: bottomBg, clipPath: "polygon(50% 0, 0 100%, 100% 100%)" }} />
              ))}
            </div>

            {/* Noise overlay */}
            <div className="absolute inset-0 opacity-10 mix-blend-overlay pointer-events-none" style={{ backgroundImage: "url('data:image/svg+xml;utf8,%3Csvg viewBox=%220 0 200 200%22 xmlns=%22http://www.w3.org/2000/svg%22%3E%3Cfilter id=%22noiseFilter%22%3E%3CfeTurbulence type=%22fractalNoise%22 baseFrequency=%220.65%22 numOctaves=%223%22 stitchTiles=%22stitch%22/%3E%3C/filter%3E%3Crect width=%22100%25%22 height=%22100%25%22 filter=%22url(%23noiseFilter)%22/%3E%3C/svg%3E')" }} />

            {bottomChildren ? bottomChildren : (
              <>
                <p className="font-mono text-xs font-bold uppercase tracking-widest mb-1 relative z-10" style={{ color: bottomTextColor }}>
                  {bottomText}
                </p>
                <div className="flex gap-1 relative z-10">
                   <div className="w-1 h-1 rounded-full" style={{ backgroundColor: bottomTextColor }} />
                   <div className="w-1 h-1 rounded-full" style={{ backgroundColor: bottomTextColor }} />
                   <div className="w-1 h-1 rounded-full" style={{ backgroundColor: bottomTextColor }} />
                </div>
              </>
            )}
          </div>
        </div>
      </div>
    );
  }
);

HoloTicket.displayName = "HoloTicket";
`,
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
      id: "infinity-mirror-card",
      slug: "infinity-mirror-card",
      title: "Infinity Mirror",
      description: "Deep nested 3D card creating an optical illusion of infinite layers, reacting to magnetic mouse movement.",
      category: "Cards",
      tags: ["Framer Motion", "3D", "Premium"],
      cliCommand: "npx @melonui-dev/cli add infinity-mirror-card",
      codeSnippet: `"use client";

import React, { useRef } from "react";
import { motion, useMotionValue, useSpring, useTransform } from "framer-motion";

export interface InfinityMirrorCardProps {
  title?: string;
  subtitle?: string;
  layers?: number;
  glowColor?: string;
  borderColor?: string;
  children?: React.ReactNode;
}

export const InfinityMirrorCard: React.FC<InfinityMirrorCardProps> = ({
  title = "MIRROR",
  subtitle = "ACTIVE DEPTH",
  layers = 5,
  glowColor = "#7fff5e",
  borderColor = "rgba(255, 255, 255, 0.1)",
  children,
}) => {
  const containerRef = useRef<HTMLDivElement>(null);

  // Safe static initial values for SSR to prevent hydration errors
  const x = useMotionValue(0);
  const y = useMotionValue(0);

  // Smooth springs for the 3D tilt, feeling premium and magnetic
  const springConfig = { damping: 20, stiffness: 100, mass: 0.5 };
  const rotateX = useSpring(useTransform(y, [-0.5, 0.5], [18, -18]), springConfig);
  const rotateY = useSpring(useTransform(x, [-0.5, 0.5], [-18, 18]), springConfig);

  const handleMouseMove = (e: React.MouseEvent<HTMLDivElement>) => {
    if (!containerRef.current) return;
    const rect = containerRef.current.getBoundingClientRect();
    const width = rect.width;
    const height = rect.height;
    const mouseX = e.clientX - rect.left;
    const mouseY = e.clientY - rect.top;

    // Calculate percentage from center (-0.5 to 0.5)
    const xPct = mouseX / width - 0.5;
    const yPct = mouseY / height - 0.5;

    x.set(xPct);
    y.set(yPct);
  };

  const handleMouseLeave = () => {
    x.set(0);
    y.set(0);
  };

  return (
    <div
      className="relative flex items-center justify-center p-8 w-full h-full min-h-[500px]"
      style={{ perspective: "1400px" }}
    >
      <motion.div
        ref={containerRef}
        onMouseMove={handleMouseMove}
        onMouseLeave={handleMouseLeave}
        style={{
          rotateX,
          rotateY,
          transformStyle: "preserve-3d",
        }}
        className="relative w-full max-w-[280px] h-[400px] cursor-pointer group"
      >
        {/* Infinity Mirror Backwards Layers */}
        {Array.from({ length: layers }).map((_, i) => {
          // Push back into the screen with increasing depth
          const depth = (i + 1) * -50;
          // Shrink slightly as they go back to enhance perspective
          const scale = 1 - (i * 0.04);
          const opacity = 1 - (i * (1 / layers));
          // Convert glowColor and apply opacity dynamically for inset shadow
          const hexOpacity = Math.floor(opacity * 255).toString(16).padStart(2, '0');

          return (
            <div
              key={i}
              className="absolute inset-0 rounded-2xl border transition-all duration-700 ease-out"
              style={{
                transform: \`translateZ(\${depth}px) scale(\${scale})\`,
                borderColor: borderColor,
                boxShadow: \`0 0 30px \${glowColor}\${hexOpacity} inset, 0 0 10px rgba(0,0,0,0.8)\`,
                opacity: Math.max(0.1, opacity),
                transformStyle: "preserve-3d",
                background: "rgba(0,0,0,0.6)",
                backdropFilter: "blur(4px)",
              }}
            >
               {/* Noise Texture for that organic Gen-Z feel */}
               <div
                 className="absolute inset-0 opacity-20 mix-blend-overlay rounded-2xl pointer-events-none"
                 style={{
                   backgroundImage: "url('data:image/svg+xml,%3Csvg viewBox=%220 0 200 200%22 xmlns=%22http://www.w3.org/2000/svg%22%3E%3Cfilter id=%22noiseFilter%22%3E%3CfeTurbulence type=%22fractalNoise%22 baseFrequency=%220.8%22 numOctaves=%223%22 stitchTiles=%22stitch%22/%3E%3C/filter%3E%3Crect width=%22100%25%22 height=%22100%25%22 filter=%22url(%23noiseFilter)%22/%3E%3C/svg%3E')",
                 }}
               />
            </div>
          );
        })}

        {/* Top Front Glass Card */}
        <div
          className="absolute inset-0 rounded-2xl border border-white/20 bg-black/40 backdrop-blur-md overflow-hidden flex flex-col justify-between p-6 transition-all duration-500 group-hover:border-white/40 group-hover:bg-black/50"
          style={{
            transform: "translateZ(0px)",
            transformStyle: "preserve-3d",
            boxShadow: \`0 0 50px \${glowColor}30, inset 0 0 20px \${glowColor}10\`
          }}
        >
          {/* Subtle Front Noise Overlay */}
          <div
            className="absolute inset-0 opacity-15 pointer-events-none mix-blend-overlay"
            style={{
              backgroundImage: "url('data:image/svg+xml,%3Csvg viewBox=%220 0 200 200%22 xmlns=%22http://www.w3.org/2000/svg%22%3E%3Cfilter id=%22noiseFilter%22%3E%3CfeTurbulence type=%22fractalNoise%22 baseFrequency=%220.85%22 numOctaves=%223%22 stitchTiles=%22stitch%22/%3E%3C/filter%3E%3Crect width=%22100%25%22 height=%22100%25%22 filter=%22url(%23noiseFilter)%22/%3E%3C/svg%3E')",
            }}
          />

          {children ? children : (
            <>
              {/* Floating Content: Text */}
              <motion.div
                className="relative z-10"
                style={{ transform: "translateZ(40px)" }}
              >
                <h3
                  className="text-5xl font-black uppercase tracking-tighter drop-shadow-lg"
                  style={{ fontFamily: "var(--font-anton)", color: "#fff" }}
                >
                  {title}
                </h3>
                <p
                  className="text-sm font-bold tracking-[0.2em] uppercase mt-2 drop-shadow-md"
                  style={{ color: glowColor }}
                >
                  {subtitle}
                </p>
              </motion.div>

              {/* Floating Content: UI Element */}
              <motion.div
                className="relative z-10 w-full h-1/2 flex flex-col items-center justify-end pb-4"
                style={{ transform: "translateZ(60px)" }}
              >
                 <div className="w-full h-px bg-gradient-to-r from-transparent via-white/40 to-transparent relative flex items-center justify-center group-hover:via-white/70 transition-colors duration-500">
                    <motion.div
                      className="w-5 h-5 rounded-full border-2 border-white/80"
                      style={{ backgroundColor: glowColor, boxShadow: \`0 0 25px \${glowColor}\` }}
                      animate={{ scale: [1, 1.2, 1], opacity: [0.8, 1, 0.8] }}
                      transition={{ duration: 2.5, repeat: Infinity, ease: "easeInOut" }}
                    />
                 </div>
                 <p className="text-[10px] font-mono text-white/50 tracking-widest uppercase mt-6 opacity-0 group-hover:opacity-100 transition-opacity duration-500 translate-y-2 group-hover:translate-y-0">
                   Initialize Sequence
                 </p>
              </motion.div>
            </>
          )}
        </div>
      </motion.div>
    </div>
  );
};
`,
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
      id: "kinetic-glass-grid",
      slug: "kinetic-glass-grid",
      title: "Kinetic Glass Grid",
      description: "A physical, reactive glass grid that elevates and glows intelligently based on cursor proximity, using complex distance-based spring physics.",
      category: "Backgrounds",
      tags: ["Framer Motion", "Physics", "Glassmorphism", "Interactive Grid"],
      cliCommand: "npx @melonui-dev/cli add kinetic-glass-grid",
      codeSnippet: `"use client";

import React, { useRef } from "react";
import { motion, useMotionValue, useSpring, useTransform, MotionValue } from "framer-motion";

const MAX_DISTANCE = 250;

interface TileProps {
  mouseX: MotionValue<number>;
  mouseY: MotionValue<number>;
  index: number;
  primaryColor: string;
  accentColor: string;
  maxDistance: number;
}

const Tile: React.FC<TileProps> = ({ mouseX, mouseY, primaryColor, accentColor, maxDistance }) => {
  const tileRef = useRef<HTMLDivElement>(null);

  // Derive distance from mouse to the center of this tile
  const distance = useTransform([mouseX, mouseY], ([latestX, latestY]) => {
    if (!tileRef.current) return maxDistance;

    // We use a safe default if ref isn't attached yet
    const rect = tileRef.current.getBoundingClientRect();
    const centerX = rect.left + rect.width / 2;
    const centerY = rect.top + rect.height / 2;

    const dx = (latestX as number) - centerX;
    const dy = (latestY as number) - centerY;

    return Math.sqrt(dx * dx + dy * dy);
  });

  // Calculate scaling and transform effects based on distance
  // Tiles closer to the cursor scale up and lift
  const scaleRaw = useTransform(distance, [0, maxDistance], [1.3, 1]);
  const scale = useSpring(scaleRaw, { stiffness: 300, damping: 20 });

  const zRaw = useTransform(distance, [0, maxDistance], [40, 0]);
  const z = useSpring(zRaw, { stiffness: 300, damping: 20 });

  const opacityRaw = useTransform(distance, [0, maxDistance], [1, 0.4]);
  const opacity = useSpring(opacityRaw, { stiffness: 300, damping: 30 });

  // Border glow intensity based on proximity
  const glowRaw = useTransform(distance, [0, maxDistance / 2], [1, 0]);
  const glow = useSpring(glowRaw, { stiffness: 300, damping: 30 });
  
  const borderColor = useTransform(
    glow,
    [0, 1],
    ["rgba(255, 255, 255, 0.05)", \`\${primaryColor}cc\`]
  );

  const boxShadow = useTransform(
    glow,
    [0, 1],
    ["0px 0px 0px rgba(0,0,0,0)", \`0px 0px 30px \${primaryColor}66\`]
  );

  return (
    <motion.div
      ref={tileRef}
      style={{
        scale,
        z,
        opacity,
        borderColor,
        boxShadow,
      }}
      className="relative flex items-center justify-center rounded-xl bg-white/5 backdrop-blur-md border border-white/5 transition-colors duration-200 aspect-square"
    >
      {/* Subtle inner noise texture */}
      <div className="absolute inset-0 rounded-xl opacity-20 pointer-events-none mix-blend-overlay bg-[url('https://grainy-gradients.vercel.app/noise.svg')]" />

      {/* Decorative dot in the center */}
      <motion.div
        style={{ scale: glow, backgroundColor: accentColor }}
        className="w-1.5 h-1.5 rounded-full"
      />
    </motion.div>
  );
};

export interface KineticGlassGridProps extends React.ComponentPropsWithoutRef<"div"> {
  gridSize?: number;
  primaryColor?: string;
  accentColor?: string;
  bg?: string;
  title?: string;
  eyebrow?: string;
  maxDistance?: number;
}

export const KineticGlassGrid: React.FC<KineticGlassGridProps> = ({
  gridSize = 8,
  primaryColor = "#ff5c71",
  accentColor = "#7fff5e",
  bg = "#050505",
  title,
  eyebrow,
  maxDistance = 250,
  className = "",
  style,
  ...props
}) => {
  const mouseX = useMotionValue(typeof window !== "undefined" ? window.innerWidth / 2 : 0);
  const mouseY = useMotionValue(typeof window !== "undefined" ? window.innerHeight / 2 : 0);
  const containerRef = useRef<HTMLDivElement>(null);

  const handleMouseMove = (e: React.MouseEvent) => {
    mouseX.set(e.clientX);
    mouseY.set(e.clientY);
  };

  const handleMouseLeave = () => {
    // Reset to center of the container or off-screen
    if (containerRef.current) {
      const rect = containerRef.current.getBoundingClientRect();
      mouseX.set(rect.left + rect.width / 2);
      mouseY.set(rect.top + rect.height / 2);
    }
  };

  return (
    <div
      ref={containerRef}
      onMouseMove={handleMouseMove}
      onMouseLeave={handleMouseLeave}
      className={\`relative w-full h-[600px] overflow-hidden flex items-center justify-center p-8 [perspective:1000px] \${className}\`}
      style={{
        backgroundColor: bg,
        ...style
      }}
      {...props}
    >
      {/* Ambient background glow */}
      <div 
        className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[300px] h-[300px] rounded-full blur-[100px] pointer-events-none" 
        style={{ backgroundColor: \`\${primaryColor}33\` }}
      />
      <div 
        className="absolute top-1/3 left-1/3 -translate-x-1/2 -translate-y-1/2 w-[200px] h-[200px] rounded-full blur-[80px] pointer-events-none" 
        style={{ backgroundColor: \`\${accentColor}33\` }}
      />

      {/* Decorative telemetry headers */}
      {(title || eyebrow) && (
        <div className="absolute top-6 left-6 z-20 flex flex-col pointer-events-none text-left">
          {eyebrow && (
            <span className="font-mono text-[9px] uppercase tracking-[0.28em] text-[#ff5c71] mb-1">
              {eyebrow}
            </span>
          )}
          {title && (
            <h3
              className="text-xl uppercase leading-none text-white font-bold"
              style={{ fontFamily: "var(--font-Outfit), var(--font-londrina-solid), sans-serif" }}
            >
              {title}
            </h3>
          )}
        </div>
      )}

      {/* Grid container */}
      <motion.div
        className="grid gap-4 z-10"
        style={{
          gridTemplateColumns: \`repeat(\${gridSize}, minmax(0, 1fr))\`,
          width: "100%",
          maxWidth: "600px",
          transformStyle: "preserve-3d",
          rotateX: 10,
          rotateZ: -5,
        }}
      >
        {Array.from({ length: gridSize * gridSize }).map((_, i) => (
          <Tile 
            key={i} 
            index={i} 
            mouseX={mouseX} 
            mouseY={mouseY} 
            primaryColor={primaryColor} 
            accentColor={accentColor} 
            maxDistance={maxDistance}
          />
        ))}
      </motion.div>

      {/* Overlay vignette to blend grid edges into background */}
      <div 
        className="absolute inset-0 pointer-events-none" 
        style={{
          boxShadow: \`inset 0 0 100px 40px \${bg}\`
        }}
      />
    </div>
  );
};
`,
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
      id: "kinetic-holo-stack",
      slug: "kinetic-holo-stack",
      title: "Kinetic Holo Stack",
      description: "A highly interactive 'Holo-Stack' card that reveals its layered 3D structural blueprints on hover using physical spring separation and glowing lasers.",
      category: "Cards",
      tags: ["Framer Motion", "3D", "Premium", "Glassmorphism"],
      cliCommand: "npx @melonui-dev/cli add kinetic-holo-stack",
      codeSnippet: `"use client";

import React, { useRef, useState } from "react";
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
  { id: "L1", title: "Visual Casing", type: "glass" },
  { id: "L2", title: "Grid Layer", type: "grid", color: "#7fff5e" },
  { id: "L3", title: "Vector Wireframe", type: "circuit", color: "#ff5c71" },
  { id: "L4", title: "Accent Depth", type: "hologram", color: "#00f0ff" }
];

export const KineticHoloStack = React.forwardRef<HTMLDivElement, KineticHoloStackProps>(
  (
    {
      layers = DEFAULT_LAYERS,
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
    const [mousePos, setMousePos] = useState({ x: 0.5, y: 0.5 });

    const handleMouseMove = (e: React.MouseEvent<HTMLDivElement>) => {
      if (!ref.current) return;
      const rect = ref.current.getBoundingClientRect();
      const x = (e.clientX - rect.left) / rect.width;
      const y = (e.clientY - rect.top) / rect.height;
      setMousePos({ x, y });
    };

    const handleMouseLeave = () => {
      setIsHovered(false);
      setMousePos({ x: 0.5, y: 0.5 });
    };

    const rotateXVal = isHovered ? 60 : (mousePos.y - 0.5) * -30;
    const rotateYVal = isHovered ? 0 : (mousePos.x - 0.5) * 30;
    const rotateZVal = isHovered ? -45 : 0;

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
                  Render Active
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
        className={\`relative perspective-[2000px] cursor-crosshair \${className}\`}
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
          }}
          animate={{
            rotateX: rotateXVal,
            rotateY: rotateYVal,
            rotateZ: rotateZVal,
          }}
          transition={{
            type: "spring",
            stiffness: 120,
            damping: 20,
            mass: 0.5
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
                      height: \`\${layers.length * 60}px\`,
                      transform: \`translateZ(0px) rotateX(90deg)\`,
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
      id: "kinetic-shard-terminal",
      slug: "kinetic-shard-terminal",
      title: "Kinetic Shard Terminal",
      description: "A highly interactive cyberpunk-style terminal that unlocks via dragging and dropping a 'Data Shard' into a magnetic slot.",
      category: "Cards",
      tags: ["Framer Motion", "Drag and Drop", "Premium", "Cyberpunk"],
      cliCommand: "npx @melonui-dev/cli add kinetic-shard-terminal",
      codeSnippet: `"use client";

import React, { useState, useRef } from "react";
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
  title = "DATA CONTAINER",
  lockedSubtitle = "AWAITING ACCESS KEY CARD",
  unlockedSubtitle = "CONTAINER SUCCESSFULLY MOUNTED",
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
                  <span className="text-white/30 text-[10px] tracking-widest uppercase z-10">Drop Key Card</span>
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

                <span className="text-white font-bold tracking-widest text-[10px] sm:text-xs" style={{ textShadow: \`0 0 10px \${primaryColor}\` }}>
                  KEY CARD
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
                    <span style={{ color: primaryColor }}>{"//"}</span> {title}
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
              <div className="flex-1 grid grid-cols-1 sm:grid-cols-3 gap-4 auto-rows-min sm:grid-rows-2">
                {/* Main Graph Card */}
                <motion.div
                  initial={{ opacity: 0, x: -20 }}
                  animate={{ opacity: 1, x: 0 }}
                  transition={{ delay: 0.2 }}
                  className="col-span-1 sm:col-span-2 row-span-1 sm:row-span-2 rounded-xl bg-white/[0.02] border border-white/5 p-6 flex flex-col relative overflow-hidden min-h-[180px]"
                >
                  <div className="absolute top-0 right-0 w-32 h-32 blur-3xl opacity-20" style={{ backgroundColor: primaryColor }} />
                  <h3 className="text-white/40 text-xs tracking-widest uppercase mb-4">Network Activity</h3>

                  {/* Fake Graph */}
                  <div className="flex-1 flex items-end gap-2 mt-4 min-h-[60px]">
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
                  className="rounded-xl bg-white/[0.02] border border-white/5 p-4 flex flex-col justify-between min-h-[100px]"
                >
                  <h3 className="text-white/40 text-xs tracking-widest uppercase">Nodes</h3>
                  <div className="text-2xl sm:text-4xl font-light text-white mt-2">1,024</div>
                  <div className="text-[10px] tracking-wider text-white/50 mt-1 flex items-center gap-1">
                    <span style={{ color: primaryColor }}>↑ 12%</span> active
                  </div>
                </motion.div>

                {/* Stats Card 2 */}
                <motion.div
                  initial={{ opacity: 0, y: 20 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ delay: 0.4 }}
                  className="rounded-xl bg-white/[0.02] border border-white/5 p-4 flex flex-col justify-between relative overflow-hidden min-h-[100px]"
                >
                  <div className="absolute inset-0 opacity-10" style={{
                    backgroundImage: \`repeating-linear-gradient(-45deg, transparent, transparent 5px, \${primaryColor} 5px, \${primaryColor} 10px)\`
                  }} />
                  <h3 className="text-white/40 text-xs tracking-widest uppercase relative z-10">Access Level</h3>
                  <div className="text-xl sm:text-2xl font-bold mt-2 relative z-10" style={{ color: primaryColor }}>ADMIN</div>
                  <div className="text-[10px] tracking-wider text-white/50 mt-1 relative z-10">
                    Session Authenticated
                  </div>
                </motion.div>
              </div>
            </motion.div>
          )}
        </AnimatePresence>
      </div>
    </div>
  );
}
`,
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
      id: "kinetic-shatter-card",
      slug: "kinetic-shatter-card",
      title: "Kinetic Shatter Card",
      description: "A premium glassmorphic enclosure that violently shatters into 3D floating shards on hover, revealing a cybernetic glowing core inside.",
      category: "Cards",
      tags: ["Framer Motion", "3D", "Interactive", "Shatter", "Cyber"],
      cliCommand: "npx @melonui-dev/cli add kinetic-shatter-card",
      codeSnippet: "// See KineticShatterCard.tsx",
      componentPath: "KineticShatterCard",
      scrollable: false,
      usageCode: `import { KineticShatterCard } from "@/components/community/demos/KineticShatterCard";

  export default function Demo() {
    return (
      <div className="flex items-center justify-center p-12 min-h-[500px]">
        <KineticShatterCard
          title="SHATTER CORE"
          subtitle="LOCKED ENCLOSURE"
          revealTitle="SYSTEM EXPOSED"
          primaryColor="#ff5c71"
          accentColor="#7fff5e"
        />
      </div>
    );
  }`,
      props: [
        {
          name: "title",
          type: "string",
          defaultValue: `"SHATTER CORE"`,
          description: "The main title displayed on the outer shell.",
          control: { type: "text" }
        },
        {
          name: "subtitle",
          type: "string",
          defaultValue: `"LOCKED ENCLOSURE"`,
          description: "The subtitle displayed on the outer shell.",
          control: { type: "text" }
        },
        {
          name: "revealTitle",
          type: "string",
          defaultValue: `"SYSTEM EXPOSED"`,
          description: "The title revealed on the inner core.",
          control: { type: "text" }
        },
        {
          name: "revealText",
          type: "string",
          defaultValue: `"INTERNAL MECHANISMS ONLINE."`,
          description: "The text description revealed on the inner core.",
          control: { type: "text" }
        },
        {
          name: "primaryColor",
          type: "string",
          defaultValue: `"#ff5c71"`,
          description: "The primary neon color used for the core glow and highlights.",
          control: { type: "color" }
        },
        {
          name: "accentColor",
          type: "string",
          defaultValue: `"#7fff5e"`,
          description: "The secondary accent color used for secondary highlights.",
          control: { type: "color" }
        }
      ]
    },
  {
      id: "liquid-dimensional-nav",
      slug: "liquid-dimensional-nav",
      title: "Liquid Dimensional Nav",
      description: "A highly interactive sidebar component combining liquid morphing, dimensional 3D peeling, and magnetic physics-based hovering.",
      category: "Navigation",
      tags: ["Morphing", "Magnetic", "3D", "Premium"],
      componentPath: "LiquidDimensionalNav",
      codeSnippet: `"use client";

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
        <h3 className="font-['Outfit'] font-bold text-2xl text-white">System Metrics</h3>
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
        <h3 className="font-['Outfit'] font-bold text-2xl text-white">Connectivity Net</h3>
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
        <h3 className="font-['Outfit'] font-bold text-2xl text-white">Access Protection</h3>
        <div className="flex-1 border border-[#ff5c71]/30 bg-[#ff5c71]/5 rounded-xl flex items-center justify-center p-4">
          <div className="text-center">
            <svg width="48" height="48" viewBox="0 0 24 24" fill="none" stroke="#ff5c71" strokeWidth="1" strokeLinecap="round" strokeLinejoin="round" className="mx-auto mb-2">
              <path d="M12 22s8-4 8-10V5l-8-3-8 3v7c0 6 8 10 8 10z" />
            </svg>
            <span className="text-[#ff5c71] font-mono text-sm uppercase tracking-widest">All Sessions Secured</span>
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
        <h3 className="font-['Outfit'] font-bold text-2xl text-white">Configuration Settings</h3>
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
      className={\`relative w-full h-[500px] flex items-center justify-center font-['Outfit'] overflow-hidden \${className}\`}
      style={{ backgroundColor: bg, ...style }}
      {...props}
    >
      {/* Background Grid */}
      <div
        className="absolute inset-0 opacity-[0.07] pointer-events-none"
        style={{ backgroundImage: "linear-gradient(#fff 1px, transparent 1px), linear-gradient(90deg, #fff 1px, transparent 1px)", backgroundSize: "30px 30px" }}
      />

      {/* Ambient Backplate Glow */}
      <motion.div
        className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[380px] h-[380px] rounded-full blur-[120px] pointer-events-none opacity-20"
        style={{
          background: \`radial-gradient(circle, \${primaryColor} 0%, \${accentColor} 100%)\`
        }}
      />

      <div className="relative flex items-center h-full max-h-[400px] scale-[0.82] min-[390px]:scale-[0.9] sm:scale-100 transition-transform duration-300">
        {/* The Navigation Bar */}
        <motion.div
          className="relative z-20 w-20 bg-black/70 backdrop-blur-xl border rounded-[2rem] py-4 flex flex-col items-center justify-between gap-2 shadow-[0_0_40px_rgba(0,0,0,0.8)]"
          style={{ borderColor: "rgba(255, 255, 255, 0.12)" }}
          layout
        >
          {/* Liquid Indicator */}
          <div className="absolute inset-y-4 left-0 w-full pointer-events-none flex flex-col items-center gap-2">
            {items.map((item) => (
              <div key={\`indicator-\${item.id}\`} className="relative h-[72px] w-full flex items-center justify-center">
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
              className="absolute inset-0 bg-black/80 backdrop-blur-2xl border rounded-3xl p-6 shadow-[0_20px_50px_rgba(0,0,0,0.7)] transform-origin-left overflow-hidden"
              style={{ borderColor: "rgba(255, 255, 255, 0.12)", transformStyle: "preserve-3d" }}
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
                  background: \`linear-gradient(135deg, \${primaryColor} 0%, transparent 50%, \${accentColor} 100%)\`
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
`,
      usageCode: `import { LiquidDimensionalNav } from "@/components/ui/liquid-dimensional-nav";\n\n<LiquidDimensionalNav primaryColor="#7fff5e" accentColor="#ff5c71" />`,
      props: [
        {
          name: "primaryColor",
          type: "string",
          defaultValue: "#7fff5e",
          description: "Primary accent color for the liquid drop and glowing elements.",
          control: { type: "color" }
        },
        {
          name: "accentColor",
          type: "string",
          defaultValue: "#ff5c71",
          description: "Secondary accent color used for decorative elements and hover effects.",
          control: { type: "color" }
        },
        {
          name: "bg",
          type: "string",
          defaultValue: "#050505",
          description: "Background color of the container.",
          control: { type: "color" }
        }
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
      codeSnippet: `"use client";

import { useEffect, useRef } from "react";

export interface LuminousWavesProps extends React.ComponentPropsWithoutRef<"div"> {
  waveCount?: number;
  amplitude?: number;
  frequency?: number;
  waveColor?: string;
  secondaryColor?: string;
  speed?: number;
  bg?: string;
}

interface Particle {
  x: number;
  y: number;
  size: number;
  speedX: number;
  speedY: number;
  opacity: number;
}

export function LuminousWaves({
  waveCount = 5,
  amplitude = 38,
  frequency = 0.006,
  waveColor = "#7fff5e",
  secondaryColor = "#ff5c71",
  speed = 0.5,
  bg = "#030303",
  className = "",
  style,
  ...props
}: LuminousWavesProps) {
  const canvasRef = useRef<HTMLCanvasElement>(null);
  const mouseRef = useRef({ x: -1000, y: -1000 });
  const activeMouseRef = useRef({ x: -1000, y: -1000 });

  useEffect(() => {
    const canvas = canvasRef.current;
    if (!canvas) return;

    const ctx = canvas.getContext("2d");
    if (!ctx) return;

    let animationFrameId: number;
    let time = 0;
    const particles: Particle[] = [];

    const resizeCanvas = () => {
      const parent = canvas.parentElement;
      if (parent) {
        canvas.width = parent.clientWidth;
        canvas.height = parent.clientHeight || 400;
      }
    };

    resizeCanvas();
    window.addEventListener("resize", resizeCanvas);

    // Initialize stardust particles
    const particleCount = 45;
    for (let i = 0; i < particleCount; i++) {
      particles.push({
        x: Math.random() * canvas.width,
        y: Math.random() * canvas.height,
        size: 0.4 + Math.random() * 1.4,
        speedX: (Math.random() - 0.5) * 0.15,
        speedY: -0.08 - Math.random() * 0.25,
        opacity: 0.1 + Math.random() * 0.5,
      });
    }

    // Helper: Hex color parser
    const hexToRgb = (hex: string, defaultColor = { r: 127, g: 255, b: 94 }) => {
      const shorthandRegex = /^#?([a-f\d])([a-f\d])([a-f\d])$/i;
      const fullHex = hex.replace(shorthandRegex, (_, r, g, b) => r + r + g + g + b + b);
      const result = /^#?([a-f\d]{2})([a-f\d]{2})([a-f\d]{2})$/i.exec(fullHex);
      return result
        ? {
            r: parseInt(result[1], 16),
            g: parseInt(result[2], 16),
            b: parseInt(result[3], 16),
          }
        : defaultColor;
    };

    // Helper: Blend colors
    const blendColors = (color1: string, color2: string, ratio: number) => {
      const rgb1 = hexToRgb(color1, { r: 127, g: 255, b: 94 }); // default green
      const rgb2 = hexToRgb(color2, { r: 255, g: 92, b: 113 }); // default melon
      const r = Math.round(rgb1.r * (1 - ratio) + rgb2.r * ratio);
      const g = Math.round(rgb1.g * (1 - ratio) + rgb2.g * ratio);
      const b = Math.round(rgb1.b * (1 - ratio) + rgb2.b * ratio);
      return { r, g, b };
    };

    const draw = () => {
      ctx.clearRect(0, 0, canvas.width, canvas.height);
      time += 0.007 * speed;

      // Update and draw particles
      particles.forEach((p) => {
        p.x += p.speedX;
        p.y += p.speedY;

        // Wrap particles around borders
        if (p.y < 0) {
          p.y = canvas.height;
          p.x = Math.random() * canvas.width;
        }
        if (p.x < 0 || p.x > canvas.width) {
          p.x = Math.random() * canvas.width;
        }

        ctx.fillStyle = \`rgba(255, 255, 255, \${p.opacity * 0.25})\`;
        ctx.beginPath();
        ctx.arc(p.x, p.y, p.size, 0, Math.PI * 2);
        ctx.fill();
      });

      // Smooth mouse tracking
      const targetMouse = mouseRef.current;
      const currentMouse = activeMouseRef.current;
      
      if (targetMouse.x !== -1000) {
        if (currentMouse.x === -1000) {
          currentMouse.x = targetMouse.x;
          currentMouse.y = targetMouse.y;
        } else {
          currentMouse.x += (targetMouse.x - currentMouse.x) * 0.05;
          currentMouse.y += (targetMouse.y - currentMouse.y) * 0.05;
        }
      } else {
        currentMouse.x = -1000;
        currentMouse.y = -1000;
      }

      // Render Aurora Siri-style Waves
      // Enable screen blending composite for high-fidelity glowing overlapping colors
      ctx.globalCompositeOperation = "screen";

      for (let w = 0; w < waveCount; w++) {
        const progress = w / (waveCount - 1 || 1);
        const waveRGB = blendColors(waveColor, secondaryColor, progress);

        // Position waves close to the vertical center so they overlap and morph together
        const baseHeight = canvas.height * 0.5 + (progress - 0.5) * canvas.height * 0.08;
        const points: { x: number; y: number }[] = [];

        // 2px steps for vector-smooth lines without linear segments
        for (let x = 0; x <= canvas.width; x += 2) {
          // Combining multiple sine and cosine waves for an organic ribbon flow
          let y = baseHeight + 
                  Math.sin(x * frequency + time + w * 2.3) * amplitude * (0.65 + Math.sin(time * 0.4 + w) * 0.35) +
                  Math.cos(x * frequency * 2.5 - time * 0.6 + w * 1.2) * (amplitude * 0.22);

          // Proximity mouse attraction/warp
          if (currentMouse.x !== -1000) {
            const dist = Math.abs(x - currentMouse.x);
            if (dist < 280) {
              const strength = Math.pow(1 - dist / 280, 2);
              const dy = currentMouse.y - baseHeight;
              y += dy * strength * 0.42; // pull wave vertically
            }
          }

          points.push({ x, y });
        }

        // Draw fill (smooth gradient fading into background, zero side border strokes)
        const fillGrad = ctx.createLinearGradient(0, baseHeight - amplitude * 1.5, 0, canvas.height);
        fillGrad.addColorStop(0, \`rgba(\${waveRGB.r}, \${waveRGB.g}, \${waveRGB.b}, \${0.015 + (1 - progress) * 0.045})\`);
        fillGrad.addColorStop(0.5, \`rgba(\${waveRGB.r}, \${waveRGB.g}, \${waveRGB.b}, 0.005)\`);
        fillGrad.addColorStop(1, "transparent");

        ctx.fillStyle = fillGrad;
        ctx.beginPath();
        ctx.moveTo(0, canvas.height);
        points.forEach((pt) => {
          ctx.lineTo(pt.x, pt.y);
        });
        ctx.lineTo(canvas.width, canvas.height);
        ctx.closePath();
        ctx.fill();

        // High-Performance Double-Draw Stroke System
        // Draw 1: Thick low-opacity bloom stroke
        ctx.strokeStyle = \`rgba(\${waveRGB.r}, \${waveRGB.g}, \${waveRGB.b}, \${0.018 + (1 - progress) * 0.038})\`;
        ctx.lineWidth = 14 + (1 - progress) * 8;
        ctx.beginPath();
        points.forEach((pt, idx) => {
          if (idx === 0) ctx.moveTo(pt.x, pt.y);
          else ctx.lineTo(pt.x, pt.y);
        });
        ctx.stroke();

        // Draw 2: Thin higher-opacity core stroke
        ctx.strokeStyle = \`rgba(\${waveRGB.r}, \${waveRGB.g}, \${waveRGB.b}, \${0.12 + (1 - progress) * 0.22})\`;
        ctx.lineWidth = 1.0 + (1 - progress) * 1.2;
        ctx.beginPath();
        points.forEach((pt, idx) => {
          if (idx === 0) ctx.moveTo(pt.x, pt.y);
          else ctx.lineTo(pt.x, pt.y);
        });
        ctx.stroke();
      }

      ctx.globalCompositeOperation = "source-over"; // Reset composite
      animationFrameId = requestAnimationFrame(draw);
    };

    draw();

    const handleMouseMove = (e: MouseEvent) => {
      const rect = canvas.getBoundingClientRect();
      mouseRef.current.x = e.clientX - rect.left;
      mouseRef.current.y = e.clientY - rect.top;
    };

    const handleMouseLeave = () => {
      mouseRef.current.x = -1000;
      mouseRef.current.y = -1000;
    };

    canvas.addEventListener("mousemove", handleMouseMove);
    canvas.addEventListener("mouseleave", handleMouseLeave);

    return () => {
      cancelAnimationFrame(animationFrameId);
      window.removeEventListener("resize", resizeCanvas);
      canvas.removeEventListener("mousemove", handleMouseMove);
      canvas.removeEventListener("mouseleave", handleMouseLeave);
    };
  }, [waveCount, amplitude, frequency, waveColor, secondaryColor, speed]);

  return (
    <div 
      className={\`w-full h-full min-h-[350px] relative overflow-hidden \${className}\`} 
      style={{ 
        border: "1px solid #111",
        backgroundColor: bg,
        ...style 
      }}
      {...props}
    >
      {/* Editorial grid backing */}
      <div 
        className="absolute inset-0 opacity-[0.02] pointer-events-none" 
        style={{
          backgroundImage: \`
            linear-gradient(to right, #fff 1px, transparent 1px),
            linear-gradient(to bottom, #fff 1px, transparent 1px)
          \`,
          backgroundSize: "60px 60px"
        }}
      />
      {/* Radial vignette shader overlay */}
      <div 
        className="absolute inset-0 pointer-events-none z-10" 
        style={{
          background: \`radial-gradient(circle at center, transparent 35%, \${bg} 90%)\`
        }}
      />
      <canvas ref={canvasRef} className="absolute inset-0 block w-full h-full" />
    </div>
  );
}
`,
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
      id: "magnetic-nav",
      slug: "magnetic-nav",
      title: "Magnetic Nav",
      description: "Nav links magnetically attract the cursor; elastic spring snaps back on leave.",
      category: "Navigation",
      tags: ["GSAP", "Elastic"],
      cliCommand: "npx @melonui-dev/cli add magnetic-nav",
      codeSnippet: `"use client";

import { useRef, useCallback } from "react";
import gsap from "gsap";

export interface NavItem {
  label: string;
  href?: string;
}

export interface MagneticNavProps extends React.ComponentPropsWithoutRef<"nav"> {
  items?: (string | NavItem)[];
  accentColor?: string;
  dotColor?: string;
  textColor?: string;
}

const DEFAULT_ITEMS = ["Home", "About", "Work", "Contact"];

export function MagneticNav({
  items = DEFAULT_ITEMS,
  accentColor = "#ff5c71",
  dotColor = "#7fff5e",
  textColor = "#f4f4f4",
  className = "",
  style,
  ...props
}: MagneticNavProps) {
  const itemRefs = useRef<(HTMLAnchorElement | null)[]>([]);

  const handleMouseMove = useCallback((e: React.MouseEvent, i: number) => {
    const el = itemRefs.current[i];
    if (!el) return;
    const prefersReducedMotion = typeof window !== "undefined" && window.matchMedia("(prefers-reduced-motion: reduce)").matches;
    if (prefersReducedMotion) return;

    const rect = el.getBoundingClientRect();
    const cx = rect.left + rect.width / 2;
    const cy = rect.top + rect.height / 2;
    const dx = e.clientX - cx;
    const dy = e.clientY - cy;
    gsap.to(el, {
      x: dx * 0.35,
      y: dy * 0.35,
      duration: 0.4,
      ease: "power3.out",
    });
  }, []);

  const handleMouseLeave = useCallback((i: number) => {
    const el = itemRefs.current[i];
    if (!el) return;
    const prefersReducedMotion = typeof window !== "undefined" && window.matchMedia("(prefers-reduced-motion: reduce)").matches;
    if (prefersReducedMotion) {
      gsap.set(el, { x: 0, y: 0 });
      return;
    }
    gsap.to(el, {
      x: 0,
      y: 0,
      duration: 0.6,
      ease: "elastic.out(1,0.4)",
    });
  }, []);

  return (
    <nav 
      className={\`flex items-center gap-10 \${className}\`} 
      style={style}
      {...props}
    >
      {items.map((item, i) => {
        const label = typeof item === "string" ? item : item.label;
        const href = typeof item === "string" ? "#" : (item.href || "#");

        return (
          <a
            key={i}
            ref={(el) => { itemRefs.current[i] = el; }}
            href={href}
            onMouseMove={(e) => handleMouseMove(e, i)}
            onMouseLeave={() => handleMouseLeave(i)}
            className="group relative font-black uppercase text-2xl tracking-tighter select-none cursor-pointer outline-none transition-colors duration-200"
            style={{ 
              fontFamily: "var(--font-anton)",
              color: textColor
            }}
          >
            {/* Melon-scan underline */}
            <span
              className="absolute -bottom-1 left-0 h-0.5 w-0 group-hover:w-full group-focus-visible:w-full transition-all duration-300 ease-out"
              style={{ backgroundColor: accentColor }}
            />
            {/* Leaf dot */}
            <span 
              className="absolute -top-1 -right-1 w-1.5 h-1.5 rounded-full opacity-0 group-hover:opacity-100 group-focus-visible:opacity-100 transition-opacity duration-200" 
              style={{ backgroundColor: dotColor }}
            />
            {label}
          </a>
        );
      })}
    </nav>
  );
}
`,
      componentPath: "MagneticNav",
    },
  {
      id: "magnetic-particle-field",
      slug: "magnetic-particle-field",
      title: "Magnetic Particle Field",
      description: "Background particles dynamically attract toward cursor and components in a verlet physics R3F instance field.",
      category: "Backgrounds",
      tags: ["Three.js", "R3F", "Physics", "InstancedMesh"],
      cliCommand: "npx @melonui-dev/cli add magnetic-particle-field",
      codeSnippet: `"use client";

import React, { useRef, useMemo, useState, useEffect } from "react";
import { Canvas, useFrame, useThree } from "@react-three/fiber";
import * as THREE from "three";

interface ParticlesProps {
  count?: number;
  particleColor?: string;
  particleSize?: number;
  glowIntensity?: number;
}

const Particles: React.FC<ParticlesProps> = ({
  count = 500,
  particleColor = "#7fff5e",
  particleSize = 0.08,
  glowIntensity = 1.5
}) => {
  const mesh = useRef<THREE.InstancedMesh>(null);
  const { mouse, viewport } = useThree();
  const [dummy] = useState(() => new THREE.Object3D());

  // Generate initial random particle positions
  const particles = useMemo(() => {
    const temp = [];
    for (let i = 0; i < count; i++) {
      // Deterministic math logic for SSR compatibility
      const x = (Math.sin(i * 12.3) * 2 - 1) * 10;
      const y = (Math.cos(i * 45.6) * 2 - 1) * 10;
      const z = (Math.sin(i * 78.9) * 2 - 1) * 5 - 2;
      const velocity = new THREE.Vector3(0, 0, 0);
      const originalPosition = new THREE.Vector3(x, y, z);
      temp.push({ position: new THREE.Vector3(x, y, z), velocity, originalPosition });
    }
    return temp;
  }, [count]);

  useFrame(() => {
    if (!mesh.current) return;

    // Convert normalized mouse coordinates to world coordinates
    const targetX = (mouse.x * viewport.width) / 2;
    const targetY = (mouse.y * viewport.height) / 2;
    const mouseVector = new THREE.Vector3(targetX, targetY, 0);

    particles.forEach((particle, i) => {
      if (i >= count) return;
      // Calculate distance to mouse
      const distance = particle.position.distanceTo(mouseVector);

      // Magnetic attraction force
      if (distance < 5) {
        const force = mouseVector.clone().sub(particle.position).normalize().multiplyScalar(0.05);
        particle.velocity.add(force);
      }

      // Spring force returning to original position
      const springForce = particle.originalPosition.clone().sub(particle.position).multiplyScalar(0.02);
      particle.velocity.add(springForce);

      // Apply friction/damping
      particle.velocity.multiplyScalar(0.92);

      // Update position
      particle.position.add(particle.velocity);

      // Update instance matrix
      dummy.position.copy(particle.position);

      // Rotate based on velocity for dynamic feel
      dummy.rotation.x += particle.velocity.y * 0.1;
      dummy.rotation.y += particle.velocity.x * 0.1;

      // Scale based on proximity
      const scale = distance < 3 ? 1.5 : 1;
      dummy.scale.setScalar(scale);

      dummy.updateMatrix();
      mesh.current!.setMatrixAt(i, dummy.matrix);
    });

    mesh.current.instanceMatrix.needsUpdate = true;
  });

  return (
    <instancedMesh ref={mesh} args={[null as any, null as any, count]}>
      {/* Small glowing tetrahedrons/diamonds */}
      <octahedronGeometry args={[particleSize, 0]} />
      <meshPhysicalMaterial
        color={particleColor}
        emissive={particleColor}
        emissiveIntensity={glowIntensity}
        transparent
        opacity={0.8}
        wireframe
      />
    </instancedMesh>
  );
};

export interface MagneticParticleFieldProps extends React.ComponentPropsWithoutRef<"div"> {
  particleCount?: number;
  particleColor?: string;
  particleSize?: number;
  glowIntensity?: number;
  bg?: string;
  titleText?: string;
  eyebrowText?: string;
  showCard?: boolean;
}

export const MagneticParticleField: React.FC<MagneticParticleFieldProps> = ({
  particleCount = 500,
  particleColor = "#7fff5e",
  particleSize = 0.08,
  glowIntensity = 1.5,
  bg = "#050505",
  titleText = "",
  eyebrowText = "",
  showCard = false,
  className = "",
  style,
  children,
  ...props
}) => {
  const [mounted, setMounted] = useState(false);

  useEffect(() => {
    setMounted(true);
  }, []);

  if (!mounted) {
    return (
      <div 
        className={\`relative w-full h-[600px] overflow-hidden rounded-xl \${className}\`}
        style={{ backgroundColor: bg, ...style }}
        {...props}
      />
    );
  }

  return (
    <div
      className={\`relative w-full h-[600px] overflow-hidden rounded-xl \${className}\`}
      style={{
        backgroundColor: bg,
        ...style
      }}
      {...props}
    >
      <div className="absolute inset-0 z-0 pointer-events-none">
        <Canvas camera={{ position: [0, 0, 15], fov: 45 }}>
          <ambientLight intensity={0.5} />
          <Particles 
            count={particleCount}
            particleColor={particleColor}
            particleSize={particleSize}
            glowIntensity={glowIntensity}
          />
        </Canvas>
      </div>

      {/* Optional Foreground Card or Custom Children */}
      {children ? (
        <div className="absolute inset-0 z-10 flex items-center justify-center pointer-events-none">
          <div className="pointer-events-auto">{children}</div>
        </div>
      ) : showCard || titleText ? (
        <div className="absolute inset-0 z-10 pointer-events-none flex items-center justify-center">
          <div className="p-8 rounded-2xl bg-black/40 backdrop-blur-sm border border-white/10 flex flex-col items-center shadow-[0_0_50px_rgba(127,255,94,0.1)] pointer-events-auto">
             {titleText && (
               <h2 className="text-4xl md:text-5xl font-black text-white uppercase tracking-tighter mb-2" style={{ fontFamily: "var(--font-londrina-solid)" }}>
                {titleText}
              </h2>
             )}
             {eyebrowText && (
              <p className="text-[#7fff5e] font-mono text-xs uppercase tracking-widest" style={{ color: particleColor }}>
                {eyebrowText}
              </p>
             )}
          </div>
        </div>
      ) : null}
    </div>
  );
};`,
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
      id: "matrix-rain",
      slug: "matrix-rain",
      title: "Matrix Rain",
      description: "Digital cascading streams of custom alphanumeric glyphs and seeds in neon-green and coral-red.",
      category: "Backgrounds",
      tags: ["Canvas", "Matrix", "Retro"],
      cliCommand: "npx @melonui-dev/cli add matrix-rain",
      codeSnippet: `"use client";

import { useEffect, useRef } from "react";

export interface MatrixRainProps extends React.ComponentPropsWithoutRef<"div"> {
  rainSpeed?: number;
  fontSize?: number;
  rainColor?: string;
  accentColor?: string;
  glow?: boolean;
  bg?: string;
  bgOpacity?: number;
}

export function MatrixRain({
  rainSpeed = 1.2,
  fontSize = 14,
  rainColor = "#7fff5e",
  accentColor = "#ff5c71",
  glow = true,
  bg = "#050505",
  bgOpacity = 0.08,
  className = "",
  style,
  ...props
}: MatrixRainProps) {
  const canvasRef = useRef<HTMLCanvasElement>(null);

  useEffect(() => {
    const canvas = canvasRef.current;
    if (!canvas) return;

    const ctx = canvas.getContext("2d");
    if (!ctx) return;

    let animationFrameId: number;

    const resizeCanvas = () => {
      const parent = canvas.parentElement;
      if (parent) {
        canvas.width = parent.clientWidth;
        canvas.height = parent.clientHeight || 300;
      }
    };

    resizeCanvas();
    window.addEventListener("resize", resizeCanvas);

    // Columns calculation
    const columns = Math.floor(canvas.width / fontSize) + 1;
    const drops: number[] = Array(columns).fill(0).map(() => Math.random() * -30); // start at offset random heights

    const glyphs = "🍉🌱🌿💦🍈•010101MELONUISEEDS".split("");

    const hexToRgb = (hex: string) => {
      const shorthandRegex = /^#?([a-f\d])([a-f\d])([a-f\d])$/i;
      const fullHex = hex.replace(shorthandRegex, (_, r, g, b) => r + r + g + g + b + b);
      const result = /^#?([a-f\d]{2})([a-f\d]{2})([a-f\d]{2})$/i.exec(fullHex);
      return result
        ? {
            r: parseInt(result[1], 16),
            g: parseInt(result[2], 16),
            b: parseInt(result[3], 16),
          }
        : { r: 5, g: 5, b: 5 };
    };

    const rgbBg = hexToRgb(bg);

    const draw = () => {
      // Fade canvas slightly to create matrix rain tail trail matching custom background color
      ctx.fillStyle = \`rgba(\${rgbBg.r}, \${rgbBg.g}, \${rgbBg.b}, \${bgOpacity})\`;
      ctx.fillRect(0, 0, canvas.width, canvas.height);

      ctx.font = \`bold \${fontSize}px monospace\`;
      
      if (glow) {
        ctx.shadowBlur = 6;
        ctx.shadowColor = rainColor;
      }

      for (let i = 0; i < drops.length; i++) {
        // Pick a random glyph
        const char = glyphs[Math.floor(Math.random() * glyphs.length)];
        
        // Horizontal x coord
        const x = i * fontSize;
        // Vertical y coord
        const y = drops[i] * fontSize;

        // Occasional accent color drops or white/bright leading characters
        const isLeading = Math.random() > 0.98;
        const isAccent = Math.random() > 0.90;

        if (isLeading) {
          ctx.fillStyle = "#ffffff";
          if (glow) ctx.shadowColor = "#ffffff";
        } else if (isAccent) {
          ctx.fillStyle = accentColor;
          if (glow) ctx.shadowColor = accentColor;
        } else {
          ctx.fillStyle = rainColor;
          if (glow) ctx.shadowColor = rainColor;
        }

        ctx.fillText(char, x, y);

        // Reset text shadow
        if (glow) ctx.shadowColor = rainColor;

        // Move drop downwards
        if (y > canvas.height && Math.random() > 0.975) {
          drops[i] = 0;
        } else {
          drops[i] += 0.5 * rainSpeed;
        }
      }

      if (glow) ctx.shadowBlur = 0; // reset

      animationFrameId = requestAnimationFrame(draw);
    };

    draw();

    return () => {
      cancelAnimationFrame(animationFrameId);
      window.removeEventListener("resize", resizeCanvas);
    };
  }, [rainSpeed, fontSize, rainColor, accentColor, glow, bg, bgOpacity]);

  return (
    <div 
      className={\`w-full h-full min-h-[300px] relative overflow-hidden \${className}\`} 
      style={{ 
        border: "1px solid #111",
        backgroundColor: bg,
        ...style 
      }}
      {...props}
    >
      <canvas ref={canvasRef} className="absolute inset-0 block w-full h-full" />
    </div>
  );
}
`,
      componentPath: "MatrixRain",
      props: [
        { name: "rainSpeed", type: "number", defaultValue: "1.2", description: "Drop rate speed multiplier.", control: { type: "slider", min: 0.2, max: 3.0, step: 0.1 } },
        { name: "fontSize", type: "number", defaultValue: "14", description: "Font size in pixels for characters.", control: { type: "slider", min: 10, max: 24, step: 1 } },
        { name: "rainColor", type: "string", defaultValue: `"#7fff5e"`, description: "Base drop stream color.", control: { type: "color" } },
        { name: "accentColor", type: "string", defaultValue: `"#ff5c71"`, description: "Occasional spark character color.", control: { type: "color" } }
      ]
    },
  {
      id: "morph-transition",
      slug: "morph-transition",
      title: "Morph Transition",
      description: "Circular clip expands from center masking the page swap between routes.",
      category: "Page Transitions",
      tags: ["GSAP", "Clip"],
      cliCommand: "npx @melonui-dev/cli add morph-transition",
      codeSnippet: `"use client";

import { useRef, useState, useEffect } from "react";
import gsap from "gsap";

export interface MorphTransitionProps extends React.ComponentPropsWithoutRef<"div"> {
  global?: boolean;
  trigger?: boolean;
  onHalfComplete?: () => void;
  onComplete?: () => void;
  
  pageColorA?: string;
  pageColorB?: string;
  titleA?: string;
  titleB?: string;
  contentA?: React.ReactNode;
  contentB?: React.ReactNode;
  
  buttonLabel?: string;
  duration?: number;
  borderColor?: string;
}

export function MorphTransition({
  global = false,
  trigger = false,
  onHalfComplete,
  onComplete,
  
  pageColorA = "#7fff5e",
  pageColorB = "#ff5c71",
  titleA = "HOME",
  titleB = "ABOUT",
  contentA,
  contentB,
  
  buttonLabel = "Morph →",
  duration = 0.55,
  borderColor = "#1e1e1e",
  
  className = "",
  style,
  ...props
}: MorphTransitionProps) {
  const overlayRef = useRef<HTMLDivElement>(null);
  const [page, setPage] = useState<"A" | "B">("A");
  const [isRunning, setIsRunning] = useState(false);

  const morph = () => {
    if (isRunning || !overlayRef.current) return;
    setIsRunning(true);

    const tl = gsap.timeline({
      onComplete: () => {
        setIsRunning(false);
        onComplete?.();
      },
    });

    // Grow circle from center
    tl.set(overlayRef.current, { display: "block", scale: 0, opacity: 1 })
      .to(overlayRef.current, {
        scale: 4,
        duration: duration,
        ease: "power3.in",
      })
      .call(() => {
        setPage((prev) => (prev === "A" ? "B" : "A"));
        onHalfComplete?.();
      })
      .to(overlayRef.current, {
        scale: 12,
        opacity: 0,
        duration: duration,
        ease: "power3.out",
      })
      .set(overlayRef.current, { display: "none", scale: 0, opacity: 1 });
  };

  useEffect(() => {
    if (trigger) {
      morph();
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [trigger]);

  // If in global mode, render only the full-screen absolute/fixed transition morph circle
  if (global) {
    return (
      <div
        ref={overlayRef}
        className={\`fixed top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-24 h-24 rounded-full pointer-events-none z-[9999] \${className}\`}
        style={{
          display: "none",
          backgroundColor: page === "A" ? pageColorA : pageColorB,
          transformOrigin: "center center",
          ...style
        }}
        {...props}
      />
    );
  }

  // Local demo container
  return (
    <div
      className={\`relative w-full max-w-sm overflow-hidden flex flex-col items-center gap-5 \${className}\`}
      style={style}
      {...props}
    >
      {/* Demo viewport */}
      <div
        className="relative w-full h-44 overflow-hidden flex items-center justify-center bg-transparent"
        style={{ border: \`1px solid \${borderColor}\` }}
      >
        {/* Morph overlay */}
        <div
          ref={overlayRef}
          className="absolute w-24 h-24 rounded-full pointer-events-none"
          style={{
            display: "none",
            backgroundColor: page === "A" ? pageColorA : pageColorB,
            transformOrigin: "center center",
          }}
        />

        {/* Content */}
        <div className="text-center z-10">
          <p className="font-mono text-xs uppercase tracking-widest text-[#444] mb-2">Page {page}</p>
          {page === "A" ? (
            contentA ?? (
              <p
                className="font-black text-4xl"
                style={{
                  fontFamily: "var(--font-anton)",
                  color: pageColorB,
                }}
              >
                {titleA}
              </p>
            )
          ) : (
            contentB ?? (
              <p
                className="font-black text-4xl"
                style={{
                  fontFamily: "var(--font-anton)",
                  color: pageColorA,
                }}
              >
                {titleB}
              </p>
            )
          )}
        </div>
      </div>

      <button
        onClick={morph}
        disabled={isRunning}
        className="px-8 py-3 font-mono text-xs uppercase tracking-widest text-[#f4f4f4] border border-[#ff5c71]/30 hover:border-[#ff5c71] hover:text-[#ff5c71] transition-all disabled:opacity-30"
      >
        {isRunning ? "Morphing..." : buttonLabel}
      </button>
    </div>
  );
}
`,
      componentPath: "MorphTransition",
    },
  {
      id: "morphing-cyber-node",
      slug: "morphing-cyber-node",
      title: "Morphing Cyber Node",
      description: "A multi-state, fluid-morphing interactive widget with magnetic hover physics and dynamic glassmorphism.",
      category: "Widgets",
      tags: ["Framer Motion", "Morph", "Glassmorphism", "Interactive"],
      cliCommand: "npx @melonui-dev/cli add morphing-cyber-node",
      codeSnippet: `"use client";

import React, { useRef, useState, useEffect, useMemo } from "react";
import { motion, AnimatePresence, useMotionValue, useSpring, useTransform } from "framer-motion";

export type NodeState = "IDLE" | "SCANNING" | "AUDIO" | "ALERT";

export interface MorphingCyberNodeProps extends React.ComponentPropsWithoutRef<"div"> {
  initialState?: NodeState;
  primaryColor?: string;
  secondaryColor?: string;
  tertiaryColor?: string;
  bg?: string;
  borderColor?: string;
  idleText?: string;
  scanningText?: string;
  scanningIp?: string;
  audioModeText?: string;
  cancelText?: string;
  alertTitle?: string;
  alertSubtitle?: string;
  lockdownText?: string;
}

export function MorphingCyberNode({
  initialState = "IDLE",
  primaryColor = "#7fff5e",
  secondaryColor = "#ff5c71",
  tertiaryColor = "#e8d5b7",
  bg = "transparent",
  borderColor = "rgba(255, 255, 255, 0.05)",
  idleText = "System Ready",
  scanningText = "Scanning",
  scanningIp = "192.168.1.X",
  audioModeText = "Audio Mode",
  cancelText = "Cancel",
  alertTitle = "BREACH",
  alertSubtitle = "UNAUTHORIZED ACCESS DETECTED",
  lockdownText = "LOCKDOWN",
  className = "",
  style,
  ...props
}: MorphingCyberNodeProps) {
  const [nodeState, setNodeState] = useState<NodeState>(initialState);
  const [mounted, setMounted] = useState(false);
  const containerRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    setMounted(true);
  }, []);

  // Use pseudo-random seeded values based on index to ensure deterministic rendering
  // and prevent hydration mismatches
  const radarConfig = useMemo(() => 
    Array.from({ length: 18 }).map((_, i) => ({
      delay: (i * 0.3) % 2,
      duration: ((i * 0.7) % 2) + 0.5
    })),
    []
  );

  const audioDurations = useMemo(() => 
    Array.from({ length: 12 }).map((_, i) => 0.5 + ((i * 0.4) % 0.5)),
    []
  );

  // Magnetic Hover Physics
  const mouseX = useMotionValue(0);
  const mouseY = useMotionValue(0);

  const springConfig = { damping: 20, stiffness: 300, mass: 0.5 };
  const rotateX = useSpring(useTransform(mouseY, [-0.5, 0.5], [15, -15]), springConfig);
  const rotateY = useSpring(useTransform(mouseX, [-0.5, 0.5], [-15, 15]), springConfig);

  const handleMouseMove = (e: React.MouseEvent) => {
    if (!containerRef.current) return;
    const rect = containerRef.current.getBoundingClientRect();
    const x = (e.clientX - rect.left) / rect.width - 0.5;
    const y = (e.clientY - rect.top) / rect.height - 0.5;
    mouseX.set(x);
    mouseY.set(y);
  };

  const handleMouseLeave = () => {
    mouseX.set(0);
    mouseY.set(0);
  };

  const handleCardClick = () => {
    if (nodeState === "IDLE") {
      setNodeState("SCANNING");
    }
  };

  const states = {
    IDLE: { width: 220, height: 70, borderRadius: 35, backgroundColor: "rgba(5, 5, 5, 0.8)", borderColor: "rgba(255, 255, 255, 0.1)" },
    SCANNING: { width: 320, height: 180, borderRadius: 24, backgroundColor: "rgba(10, 15, 10, 0.9)", borderColor: \`\${primaryColor}66\` },
    AUDIO: { width: 280, height: 110, borderRadius: 32, backgroundColor: "rgba(15, 5, 10, 0.85)", borderColor: \`\${secondaryColor}4d\` },
    ALERT: { width: 340, height: 220, borderRadius: 16, backgroundColor: "rgba(20, 0, 0, 0.95)", borderColor: \`\${secondaryColor}cc\` }
  };

  return (
    <div 
      className={\`relative w-full h-[400px] flex items-center justify-center overflow-hidden rounded-xl border \${className}\`} 
      style={{ 
        perspective: 1200,
        backgroundColor: bg,
        borderColor: borderColor,
        ...style 
      }}
      {...props}
    >
      {/* Background ambient light */}
      <motion.div
        className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[300px] h-[300px] rounded-full blur-[100px] pointer-events-none opacity-20"
        animate={{
          backgroundColor:
            nodeState === "SCANNING" ? primaryColor :
            nodeState === "ALERT" ? secondaryColor :
            nodeState === "AUDIO" ? tertiaryColor :
            "#ffffff"
        }}
        transition={{ duration: 0.8 }}
      />

      <motion.div
        ref={containerRef}
        onMouseMove={handleMouseMove}
        onMouseLeave={handleMouseLeave}
        onClick={handleCardClick}
        initial={false}
        animate={states[nodeState]}
        transition={{ type: "spring", damping: 25, stiffness: 200 }}
        style={{
          rotateX: mounted ? rotateX : 0,
          rotateY: mounted ? rotateY : 0,
          transformStyle: "preserve-3d",
          backdropFilter: "blur(20px)",
        }}
        className="relative flex flex-col items-center justify-center cursor-pointer border shadow-2xl z-10"
      >
        {/* SVG Noise Overlay */}
        <div
          className="absolute inset-0 opacity-10 mix-blend-overlay pointer-events-none rounded-[inherit] overflow-hidden"
          style={{ backgroundImage: "url('data:image/svg+xml;utf8,%3Csvg viewBox=%220 0 200 200%22 xmlns=%22http://www.w3.org/2000/svg%22%3E%3Cfilter id=%22noiseFilter%22%3E%3CfeTurbulence type=%22fractalNoise%22 baseFrequency=%220.8%22 numOctaves=%223%22 stitchTiles=%22stitch%22/%3E%3C/filter%3E%3Crect width=%22100%25%22 height=%22100%25%22 filter=%22url(%23noiseFilter)%22/%3E%3C/svg%3E')" }}
        />

        {/* Content Layers */}
        <AnimatePresence mode="wait">
          {nodeState === "IDLE" && (
            <motion.div
              key="idle"
              initial={{ opacity: 0, scale: 0.8 }}
              animate={{ opacity: 1, scale: 1 }}
              exit={{ opacity: 0, scale: 0.8, filter: "blur(10px)" }}
              transition={{ duration: 0.2 }}
              className="flex items-center gap-4 px-6 w-full justify-between"
              style={{ transform: "translateZ(30px)" }}
            >
              <div className="flex items-center gap-2">
                <div className="relative w-2.5 h-2.5 flex items-center justify-center">
                  <div className="absolute inset-0 rounded-full bg-[#7fff5e] opacity-40 animate-ping" />
                  <div className="w-1.5 h-1.5 rounded-full bg-[#7fff5e]" />
                </div>
                <span className="font-mono text-[10px] tracking-[0.25em] text-white/70 uppercase select-none">Monitor</span>
              </div>
              <span className="font-sans font-bold text-xs text-white/95">{idleText}</span>
              <button 
                onClick={(e) => { e.stopPropagation(); setNodeState("SCANNING"); }} 
                className="w-8 h-8 rounded-full bg-white/5 hover:bg-white/10 flex items-center justify-center transition-colors group"
                aria-label="Start Scanning"
              >
                <span className="text-white/60 group-hover:text-[#7fff5e] transition-colors text-xs font-mono">⛶</span>
              </button>
            </motion.div>
          )}

          {nodeState === "SCANNING" && (
            <motion.div
              key="scanning"
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, y: -20, filter: "blur(10px)" }}
              className="flex flex-col items-center p-5 w-full h-full relative"
              style={{ transform: "translateZ(40px)" }}
            >
              <div className="flex w-full justify-between items-center mb-3">
                <span className="font-mono text-[10px] uppercase tracking-[0.3em] font-semibold" style={{ color: primaryColor }}>{scanningText}</span>
                <span className="font-mono text-[9px] text-white/30">{scanningIp}</span>
              </div>

              <div className="flex-1 w-full border rounded bg-black/40 overflow-hidden relative mb-3 flex items-center justify-center" style={{ borderColor: \`\${primaryColor}22\` }}>
                <svg className="w-full h-full absolute inset-0 opacity-20 pointer-events-none" viewBox="0 0 100 100" preserveAspectRatio="none">
                  <circle cx="50" cy="50" r="15" fill="none" stroke={primaryColor} strokeWidth="0.5" />
                  <circle cx="50" cy="50" r="30" fill="none" stroke={primaryColor} strokeWidth="0.5" />
                  <circle cx="50" cy="50" r="45" fill="none" stroke={primaryColor} strokeWidth="0.5" />
                  <line x1="50" y1="0" x2="50" y2="100" stroke={primaryColor} strokeWidth="0.25" />
                  <line x1="0" y1="50" x2="100" y2="50" stroke={primaryColor} strokeWidth="0.25" />
                </svg>

                {/* Rotating vector line scanner */}
                <motion.div
                  className="w-full h-full absolute origin-center flex items-center justify-center pointer-events-none"
                  animate={{ rotate: 360 }}
                  transition={{ repeat: Infinity, duration: 4, ease: "linear" }}
                >
                  <div className="w-[150px] h-[150px] absolute right-1/2 bottom-1/2 origin-bottom-right" style={{
                    background: \`conic-gradient(from 180deg, \${primaryColor}22, transparent)\`
                  }} />
                  <div className="w-[150px] h-[1.5px] absolute right-1/2" style={{
                    backgroundColor: primaryColor,
                    boxShadow: \`0 0 8px \${primaryColor}\`
                  }} />
                </motion.div>

                <div className="relative font-mono text-[8px] text-white/40 tracking-[0.3em] text-center uppercase select-none">
                  SEARCHING NET...
                </div>
              </div>

              <div className="flex gap-2 w-full">
                <button onClick={(e) => { e.stopPropagation(); setNodeState("AUDIO"); }} className="flex-1 py-1 rounded bg-white/5 hover:bg-white/10 font-mono text-[9px] uppercase text-white/70 transition-colors border border-white/5">{audioModeText}</button>
                <button onClick={(e) => { e.stopPropagation(); setNodeState("IDLE"); }} className="px-3 py-1 rounded bg-[#ff5c71]/10 hover:bg-[#ff5c71]/20 font-mono text-[9px] uppercase transition-colors border border-[#ff5c71]/20" style={{ color: secondaryColor }}>{cancelText}</button>
              </div>
            </motion.div>
          )}

          {nodeState === "AUDIO" && (
            <motion.div
              key="audio"
              initial={{ opacity: 0, scale: 0.9 }}
              animate={{ opacity: 1, scale: 1 }}
              exit={{ opacity: 0, scale: 1.1, filter: "blur(10px)" }}
              className="flex items-center w-full px-6 gap-5"
              style={{ transform: "translateZ(50px)" }}
            >
              <div 
                className="w-10 h-10 rounded-full border flex items-center justify-center shrink-0"
                style={{
                  borderColor: \`\${secondaryColor}33\`,
                  backgroundColor: \`\${secondaryColor}11\`
                }}
              >
                <motion.div
                  className="w-3.5 h-3.5 rounded-full"
                  style={{ backgroundColor: secondaryColor }}
                  animate={{ scale: [1, 1.3, 1] }}
                  transition={{ repeat: Infinity, duration: 1.2, ease: "easeInOut" }}
                />
              </div>

              <div className="flex-1 flex items-center gap-[3px] h-7 max-w-[140px]">
                {audioDurations.map((duration, i) => (
                  <motion.div
                    key={i}
                    className="flex-1 rounded-full"
                    style={{ backgroundColor: \`\${secondaryColor}b3\` }}
                    animate={{ height: ["25%", "100%", "25%"] }}
                    transition={{ repeat: Infinity, duration, delay: i * 0.04 }}
                  />
                ))}
              </div>

              <button 
                onClick={(e) => { e.stopPropagation(); setNodeState("ALERT"); }} 
                className="w-8 h-8 rounded-full bg-white/5 hover:bg-white/10 flex items-center justify-center transition-colors border border-white/5 group" 
                aria-label="Trigger Alert"
              >
                <span className="text-white/60 group-hover:text-[#ff5c71] transition-colors text-[10px]">⚠</span>
              </button>
            </motion.div>
          )}

          {nodeState === "ALERT" && (
            <motion.div
              key="alert"
              initial={{ opacity: 0, rotateX: -90 }}
              animate={{ opacity: 1, rotateX: 0 }}
              exit={{ opacity: 0, rotateX: 90, filter: "blur(10px)" }}
              className="flex flex-col items-center justify-center w-full h-full p-5 text-center"
              style={{ transform: "translateZ(60px)", transformOrigin: "bottom" }}
            >
              <motion.div
                className="text-2xl font-black uppercase tracking-[0.1em] mb-1"
                animate={{ scale: [1, 1.03, 1] }}
                transition={{ repeat: Infinity, duration: 1.5 }}
                style={{ color: secondaryColor }}
              >
                {alertTitle}
              </motion.div>
              <p className="font-mono text-[9px] tracking-widest text-white/50 mb-5 uppercase">{alertSubtitle}</p>

              <button
                onClick={(e) => { e.stopPropagation(); setNodeState("IDLE"); }}
                className="px-5 py-1.5 rounded bg-white/5 border border-white/10 text-white font-mono uppercase tracking-widest text-[9px] hover:bg-white/10 transition-colors shadow-[0_4px_12px_rgba(255,92,113,0.15)]"
              >
                Reset System
              </button>
            </motion.div>
          )}
        </AnimatePresence>
      </motion.div>
    </div>
  );
}
`,
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
      id: "nexus-prompt-core",
      slug: "nexus-prompt-core",
      title: "Nexus Prompt Core",
      description: "A fluidly morphing AI prompt interface that transitions from a sleek input pill to a glowing processing core, and finally unfolds into a premium glassmorphic response dashboard.",
      category: "Widgets",
      tags: ["Framer Motion", "AI Interface", "Morphing", "Premium"],
      cliCommand: "npx @melonui-dev/cli add nexus-prompt-core",
      codeSnippet: "// See NexusPromptCore.tsx",
      componentPath: "NexusPromptCore",
      scrollable: false,
      usageCode: `import { NexusPromptCore } from "@/components/community/demos/NexusPromptCore";

  export default function MyPage() {
    return (
      <div className="w-full p-12">
        <NexusPromptCore />
      </div>
    );
  }`,
      aiPrompt: "Generate a Nexus Prompt Core component that morphs fluidly between states: an input pill, a glowing processing core, and a glassmorphic dashboard.",
      props: [
        {
          name: "primaryColor",
          type: "string",
          defaultValue: "#00f0ff",
          description: "The primary neon color for the gradients.",
          control: { type: "color" }
        },
        {
          name: "accentColor",
          type: "string",
          defaultValue: "#ff5c71",
          description: "The secondary neon color for the gradients.",
          control: { type: "color" }
        },
        {
          name: "glowColor",
          type: "string",
          defaultValue: "#7fff5e",
          description: "The tertiary neon color for the gradients.",
          control: { type: "color" }
        }
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
      codeSnippet: `"use client";

import { useMemo } from "react";
import { motion } from "framer-motion";

export interface NoiseBlobProps extends React.ComponentPropsWithoutRef<"div"> {
  primaryColor?: string;
  secondaryColor?: string;
  tertiaryColor?: string;
  blobSize?: number;
  speed?: number;
  gooeyness?: number; // threshold matrix
  bg?: string;
}

export function NoiseBlob({
  primaryColor = "#ff5c71",
  secondaryColor = "#7fff5e",
  tertiaryColor = "#e8d5b7",
  blobSize = 120,
  speed = 1.0,
  gooeyness = 10,
  bg = "#050505",
  className = "",
  style,
  ...props
}: NoiseBlobProps) {
  // Generate random movement offsets and delays
  const blobs = useMemo(() => {
    return [
      {
        id: 1,
        color: primaryColor,
        x: [0, 80, -60, 0],
        y: [0, -50, 60, 0],
        delay: 0,
        sizeMult: 1.1,
      },
      {
        id: 2,
        color: secondaryColor,
        x: [0, -70, 80, 0],
        y: [0, 60, -40, 0],
        delay: 1.5,
        sizeMult: 0.95,
      },
      {
        id: 3,
        color: tertiaryColor,
        x: [0, 50, -40, 0],
        y: [0, 70, -60, 0],
        delay: 3.0,
        sizeMult: 0.85,
      },
      {
        id: 4,
        color: primaryColor,
        x: [0, -90, 50, 0],
        y: [0, -40, 50, 0],
        delay: 4.5,
        sizeMult: 1.05,
      },
    ];
  }, [primaryColor, secondaryColor, tertiaryColor]);

  // Adjust SVG blur & alpha matrix based on gooeyness (range 2 to 20)
  const stdDeviation = gooeyness * 2;
  const matrixValues = \`1 0 0 0 0  0 1 0 0 0  0 0 1 0 0  0 0 0 \${gooeyness * 3} -\${gooeyness * 1.5}\`;

  return (
    <div
      className={\`w-full h-full min-h-[300px] relative overflow-hidden flex items-center justify-center \${className}\`}
      style={{
        border: "1px solid #111",
        backgroundColor: bg,
        ...style
      }}
      {...props}
    >
      {/* Liquid Blobs Container with SVG Filter applied */}
      <div
        className="absolute inset-0 w-full h-full filter"
        style={{
          filter: "url(#melon-gooey-filter)",
        }}
      >
        {blobs.map((b) => (
          <motion.div
            key={b.id}
            className="absolute rounded-full opacity-60"
            style={{
              left: \`calc(50% - \${blobSize * b.sizeMult / 2}px)\`,
              top: \`calc(50% - \${blobSize * b.sizeMult / 2}px)\`,
              width: \`\${blobSize * b.sizeMult}px\`,
              height: \`\${blobSize * b.sizeMult}px\`,
              backgroundColor: b.color,
              filter: "blur(2px)",
            }}
            animate={{
              x: b.x,
              y: b.y,
            }}
            transition={{
              duration: (14 / speed) * b.sizeMult,
              ease: "easeInOut",
              repeat: Infinity,
              delay: b.delay,
            }}
          />
        ))}
      </div>

      {/* SVG filter definition */}
      <svg className="absolute w-0 h-0 pointer-events-none">
        <defs>
          <filter id="melon-gooey-filter">
            <feGaussianBlur in="SourceGraphic" stdDeviation={stdDeviation} result="blur" />
            <feColorMatrix
              in="blur"
              mode="matrix"
              values={matrixValues}
              result="goo"
            />
            <feBlend in="SourceGraphic" in2="goo" />
          </filter>
        </defs>
      </svg>

      {/* Interactive Overlay Light */}
      <div
        className="absolute inset-0 pointer-events-none"
        style={{
          background: \`radial-gradient(circle at center, transparent 30%, \${bg}b3 90%)\`,
        }}
      />
    </div>
  );
}
`,
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
      id: "orbital-command-ring",
      slug: "orbital-command-ring",
      title: "Orbital Command Ring",
      description: "A futuristic radial page navigation menu summoned by dragging with elastic joystick physics, custom target paths, and cinematic flashes.",
      category: "Page Transitions",
      tags: ["Framer Motion", "Spring", "Radial Menu", "Interactive", "Navigation"],
      cliCommand: "npx @melonui-dev/cli add orbital-command-ring",
      codeSnippet: `"use client";

import React, { useRef, useState } from "react";
import { motion, AnimatePresence, useMotionValue, useSpring, useTransform } from "framer-motion";

export interface CommandItem {
  id: string;
  label: string;
  icon: string;
  color: string;
  path?: string;
}

const DEFAULT_COMMANDS: CommandItem[] = [
  { id: "home", label: "Home", icon: "🏠", color: "#7fff5e", path: "/" },
  { id: "components", label: "Components", icon: "🍱", color: "#00f0ff", path: "/components" },
  { id: "docs", label: "Docs", icon: "📖", color: "#ff5c71", path: "/docs/introduction" },
  { id: "loom", label: "Loom", icon: "🧶", color: "#ff8c00", path: "/components/signal-loom" },
  { id: "bento", label: "Bento", icon: "🍱", color: "#e8d5b7", path: "/components/hypermorph-bento" },
];

export interface OrbitalCommandRingProps extends React.ComponentPropsWithoutRef<"div"> {
  options?: CommandItem[];
  commands?: CommandItem[];
  bg?: string;
  borderColor?: string;
  joystickColor?: string;
  onExecute?: (command: CommandItem) => void;
  onNavigate?: (path: string) => void;
  title?: string;
  eyebrow?: string;
}

export function OrbitalCommandRing({
  options,
  commands,
  bg = "#050505",
  borderColor = "rgba(255,255,255,0.05)",
  joystickColor = "#ffffff",
  title = "Orbital Command Ring",
  eyebrow = "Hold & drag anywhere to summon",
  onExecute,
  onNavigate,
  className = "",
  style,
  ...props
}: OrbitalCommandRingProps) {
  const containerRef = useRef<HTMLDivElement>(null);

  const items = (Array.isArray(options) ? options : null) || 
                (Array.isArray(commands) ? commands : null) || 
                DEFAULT_COMMANDS;

  const [menuState, setMenuState] = useState<"idle" | "active" | "executing">("idle");
  const [origin, setOrigin] = useState({ x: 0, y: 0 });
  const [selectedNode, setSelectedNode] = useState<number | null>(null);
  const [lastExecuted, setLastExecuted] = useState<{ label: string; color: string } | null>(null);

  // Motion values for smooth joystick physics
  const dragX = useMotionValue(0);
  const dragY = useMotionValue(0);

  const springConfig = { damping: 20, stiffness: 300, mass: 0.5 };
  const joystickX = useSpring(dragX, springConfig);
  const joystickY = useSpring(dragY, springConfig);

  const originX = useMotionValue(0);
  const originY = useMotionValue(0);

  // Derived absolute position for the joystick
  const joystickAbsX = useTransform(() => originX.get() + joystickX.get());
  const joystickAbsY = useTransform(() => originY.get() + joystickY.get());

  const handlePointerDown = (e: React.PointerEvent) => {
    // Only capture primary pointer
    if (e.button !== 0 && e.pointerType === 'mouse') return;
    if (menuState === "executing") return;

    const rect = containerRef.current?.getBoundingClientRect();
    if (!rect) return;

    const x = e.clientX - rect.left;
    const y = e.clientY - rect.top;

    setOrigin({ x, y });
    originX.set(x);
    originY.set(y);

    dragX.set(0);
    dragY.set(0);

    setMenuState("active");
    setSelectedNode(null);
  };

  const handlePointerMove = (e: React.PointerEvent) => {
    if (menuState !== "active") return;

    const rect = containerRef.current?.getBoundingClientRect();
    if (!rect) return;

    const currentX = e.clientX - rect.left;
    const currentY = e.clientY - rect.top;

    const dx = currentX - origin.x;
    const dy = currentY - origin.y;

    const maxDist = 70;
    const dist = Math.sqrt(dx * dx + dy * dy);

    if (dist > 0) {
      const pullRatio = Math.min(dist / maxDist, 1);
      dragX.set((dx / dist) * maxDist * pullRatio);
      dragY.set((dy / dist) * maxDist * pullRatio);
    } else {
      dragX.set(0);
      dragY.set(0);
    }

    if (dist > 35) {
      // Calculate angle
      let angle = Math.atan2(dy, dx);
      if (angle < 0) angle += 2 * Math.PI;

      const segment = (2 * Math.PI) / items.length;
      const adjustedAngle = (angle + segment / 2) % (2 * Math.PI);
      const index = Math.floor(adjustedAngle / segment);
      setSelectedNode(index);
    } else {
      setSelectedNode(null);
    }
  };

  const handlePointerUp = () => {
    if (menuState !== "active") return;

    dragX.set(0);
    dragY.set(0);

    if (selectedNode !== null) {
      const cmd = items[selectedNode];
      setLastExecuted({ label: cmd.label, color: cmd.color });
      setMenuState("executing");

      if (onExecute) {
        onExecute(cmd);
      }

      // Safe page navigation trigger after a short delay to let cinematic play
      setTimeout(() => {
        if (cmd.path) {
          if (onNavigate) {
            onNavigate(cmd.path);
          } else if (typeof window !== "undefined") {
            if (cmd.path.startsWith("#")) {
              const target = document.querySelector(cmd.path);
              if (target) {
                target.scrollIntoView({ behavior: "smooth" });
              }
            } else {
              window.location.href = cmd.path;
            }
          }
        }
      }, 800);

      setTimeout(() => {
        setMenuState("idle");
        setSelectedNode(null);
      }, 1200);
    } else {
      setMenuState("idle");
    }
  };

  return (
    <div
      ref={containerRef}
      onPointerDown={handlePointerDown}
      onPointerMove={handlePointerMove}
      onPointerUp={handlePointerUp}
      onPointerLeave={handlePointerUp}
      onContextMenu={(e) => e.preventDefault()}
      className={\`relative w-full h-[500px] overflow-hidden border cursor-crosshair touch-none select-none \${className}\`}
      style={{
        backgroundColor: bg,
        borderColor: borderColor,
        ...style
      }}
      {...props}
    >
      {/* Background ambient noise/hint */}
      <div className="absolute inset-0 flex flex-col items-center justify-center pointer-events-none opacity-30">
        <span className="font-mono text-xs uppercase tracking-[0.2em] text-white/50 mb-2">
          {title}
        </span>
        <span className="font-mono text-[10px] text-white/30">
          {eyebrow}
        </span>
      </div>

      <AnimatePresence>
        {menuState === "active" && (
          <motion.div
            key="ring"
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            transition={{ duration: 0.2 }}
            className="absolute inset-0 pointer-events-none"
          >
            {/* SVG Tether connecting origin to joystick */}
            <svg className="absolute inset-0 w-full h-full">
              <motion.line
                x1={originX}
                y1={originY}
                x2={joystickAbsX}
                y2={joystickAbsY}
                stroke="rgba(255, 255, 255, 0.15)"
                strokeWidth={2}
                strokeDasharray="4 4"
              />
            </svg>

            {/* Orbit rings */}
            <div
              className="absolute w-64 h-64 -ml-32 -mt-32 rounded-full border border-white/5 border-dashed"
              style={{ left: origin.x, top: origin.y }}
            />
            <div
              className="absolute w-16 h-16 -ml-8 -mt-8 rounded-full border border-white/10"
              style={{ left: origin.x, top: origin.y }}
            />
            <div
              className="absolute w-2 h-2 -ml-1 -mt-1 rounded-full bg-white/30"
              style={{ left: origin.x, top: origin.y }}
            />

            {/* Command Nodes */}
            {items.map((cmd, i) => {
              const angle = (i / items.length) * 2 * Math.PI;
              const radius = 120; // Distance of the nodes from origin
              const nx = origin.x + Math.cos(angle) * radius;
              const ny = origin.y + Math.sin(angle) * radius;

              const isSelected = selectedNode === i;

              return (
                <motion.div
                  key={cmd.id}
                  initial={{ x: origin.x, y: origin.y, opacity: 0, scale: 0 }}
                  animate={{
                    x: nx,
                    y: ny,
                    opacity: 1,
                    scale: isSelected ? 1.15 : 1,
                  }}
                  exit={{ x: origin.x, y: origin.y, opacity: 0, scale: 0 }}
                  transition={{
                    type: "spring",
                    damping: 15,
                    stiffness: 250,
                    delay: i * 0.02,
                  }}
                  className="absolute w-14 h-14 -ml-7 -mt-7 rounded-full flex items-center justify-center border backdrop-blur-md transition-colors"
                  style={{
                    backgroundColor: isSelected
                      ? \`\${cmd.color}22\`
                      : "rgba(10, 10, 10, 0.7)",
                    borderColor: isSelected
                      ? cmd.color
                      : "rgba(255, 255, 255, 0.1)",
                    boxShadow: isSelected
                      ? \`0 0 25px \${cmd.color}44\`
                      : "0 0 0px transparent",
                    color: isSelected ? cmd.color : "rgba(255, 255, 255, 0.5)",
                  }}
                >
                  <span className="text-xl" style={{ textShadow: isSelected ? \`0 0 10px \${cmd.color}\` : 'none' }}>
                    {cmd.icon}
                  </span>

                  <AnimatePresence>
                    {isSelected && (
                      <motion.div
                        initial={{ opacity: 0, y: 10, scale: 0.8 }}
                        animate={{ opacity: 1, y: 0, scale: 1 }}
                        exit={{ opacity: 0, y: 5, scale: 0.8 }}
                        className="absolute top-[110%] text-[10px] font-mono tracking-[0.2em] uppercase whitespace-nowrap px-2 py-1 rounded bg-black/80 border"
                        style={{ color: cmd.color, borderColor: \`\${cmd.color}44\` }}
                      >
                        {cmd.label}
                      </motion.div>
                    )}
                  </AnimatePresence>
                </motion.div>
              );
            })}

            {/* Joystick Core */}
            <motion.div
              style={{ x: joystickAbsX, y: joystickAbsY }}
              className="absolute w-10 h-10 -ml-5 -mt-5 rounded-full border border-white/30 bg-white/10 backdrop-blur-md flex items-center justify-center shadow-[0_0_20px_rgba(255,255,255,0.15)]"
            >
              <div
                className="w-2.5 h-2.5 rounded-full transition-colors duration-200"
                style={{
                  backgroundColor:
                    selectedNode !== null ? items[selectedNode].color : joystickColor,
                  boxShadow:
                    selectedNode !== null
                      ? \`0 0 10px \${items[selectedNode].color}\`
                      : \`0 0 5px \${joystickColor}\`,
                }}
              />
            </motion.div>
          </motion.div>
        )}
      </AnimatePresence>

      {/* Execution Cinematic */}
      <AnimatePresence>
        {menuState === "executing" && lastExecuted && (
          <motion.div
            key="executing"
            className="absolute inset-0 flex items-center justify-center pointer-events-none z-50 overflow-hidden"
          >
            {/* Flash background */}
            <motion.div
              initial={{ opacity: 0.5, backgroundColor: lastExecuted.color }}
              animate={{ opacity: 0 }}
              transition={{ duration: 0.6 }}
              className="absolute inset-0 mix-blend-screen"
            />

            {/* Ripple ring from origin */}
            <motion.div
              initial={{
                width: 0,
                height: 0,
                opacity: 1,
                borderWidth: 10,
              }}
              animate={{
                width: 1000,
                height: 1000,
                opacity: 0,
                borderWidth: 1,
              }}
              transition={{ duration: 0.8, ease: "easeOut" }}
              className="absolute rounded-full"
              style={{
                left: origin.x,
                top: origin.y,
                x: "-50%",
                y: "-50%",
                borderColor: lastExecuted.color,
              }}
            />

            {/* Giant typography flash */}
            <motion.div
              initial={{ scale: 0.8, opacity: 0, y: 30 }}
              animate={{ scale: 1, opacity: 1, y: 0 }}
              exit={{ scale: 1.1, opacity: 0, filter: "blur(20px)" }}
              transition={{ type: "spring", damping: 15, stiffness: 200 }}
              className="relative"
            >
              <h2
                className="text-7xl md:text-9xl font-black uppercase tracking-tighter"
                style={{
                  fontFamily: "var(--font-anton)",
                  color: "transparent",
                  WebkitTextStroke: \`2px \${lastExecuted.color}\`,
                  textShadow: \`0 0 40px \${lastExecuted.color}66\`,
                }}
              >
                {lastExecuted.label}
              </h2>
            </motion.div>
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
}
`,
      componentPath: "OrbitalCommandRing",
      usageCode: `import { OrbitalCommandRing } from "@/components/orbital-command-ring";
  import { useRouter } from "next/navigation";

  export default function PageNavigationDemo() {
    const router = useRouter();

    // Define custom options linked to your application routes
    const customOptions = [
      { id: "home", label: "Home", icon: "≡ƒÅá", color: "#7fff5e", path: "/" },
      { id: "docs", label: "Docs", icon: "≡ƒôû", color: "#00f0ff", path: "/docs/introduction" },
      { id: "loom", label: "Loom", icon: "≡ƒº╢", color: "#ff5c71", path: "/components/signal-loom" },
      { id: "bento", label: "Bento", icon: "≡ƒì▒", color: "#ff8c00", path: "/components/hypermorph-bento" }
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
      id: "parallax-strips",
      slug: "parallax-strips",
      title: "Parallax Strips",
      description: "Depth strips that scroll at different speeds creating a parallax illusion.",
      category: "Scroll Effects",
      tags: ["GSAP", "Parallax"],
      cliCommand: "npx @melonui-dev/cli add parallax-strips",
      codeSnippet: `"use client";

import { useEffect, useRef } from "react";
import gsap from "gsap";
import ScrollTrigger from "gsap/ScrollTrigger";

gsap.registerPlugin(ScrollTrigger);

export interface StripItem {
  text: string;
  depth: number;
  speed: number;
}

const DEFAULT_STRIPS: StripItem[] = [
  { text: "GSAP", depth: 1, speed: -0.3 },
  { text: "THREE.JS", depth: 2, speed: 0.5 },
  { text: "REACT", depth: 1.5, speed: -0.2 },
  { text: "NEXT.JS", depth: 3, speed: 0.7 },
  { text: "MELON", depth: 2, speed: -0.4 },
];

export interface ParallaxStripsProps extends React.ComponentPropsWithoutRef<"div"> {
  strips?: StripItem[];
  primaryColor?: string;
  secondaryColor?: string;
  strokeColor?: string;
  fontFamily?: string;
}

export function ParallaxStrips({
  strips = DEFAULT_STRIPS,
  primaryColor = "#ff5c71",
  secondaryColor = "#1e1e1e",
  strokeColor = "#333",
  fontFamily = "var(--font-anton)",
  className = "",
  style,
  ...props
}: ParallaxStripsProps) {
  const containerRef = useRef<HTMLDivElement>(null);
  const stripRefs = useRef<(HTMLDivElement | null)[]>([]);

  useEffect(() => {
    if (!containerRef.current) return;
    const prefersReducedMotion = typeof window !== "undefined" && window.matchMedia("(prefers-reduced-motion: reduce)").matches;
    if (prefersReducedMotion) return;

    const ctx = gsap.context(() => {
      stripRefs.current.forEach((strip, i) => {
        if (!strip || !strips[i]) return;
        gsap.to(strip, {
          x: strips[i].speed * 400,
          ease: "none",
          scrollTrigger: {
            trigger: containerRef.current,
            start: "top bottom",
            end: "bottom top",
            scrub: true,
          },
        });
      });
    }, containerRef);

    return () => ctx.revert();
  }, [strips]);

  return (
    <div
      ref={containerRef}
      className={\`w-full overflow-hidden flex flex-col gap-4 py-8 select-none \${className}\`}
      style={style}
      {...props}
    >
      {strips.map((strip, i) => (
        <div
          key={strip.text}
          ref={(el) => { stripRefs.current[i] = el; }}
          className="whitespace-nowrap"
          style={{ fontSize: \`\${22 + strip.depth * 8}px\`, opacity: 1 / strip.depth + 0.2 }}
        >
          {Array.from({ length: 8 }).map((_, j) => (
            <span
              key={j}
              className="font-black uppercase tracking-tighter mr-8"
              style={{
                fontFamily: fontFamily,
                color: i % 2 === 0 ? primaryColor : secondaryColor,
                WebkitTextStroke: i % 2 !== 0 ? \`1px \${strokeColor}\` : undefined,
              }}
            >
              {strip.text}
            </span>
          ))}
        </div>
      ))}
    </div>
  );
}
`,
      componentPath: "ParallaxStrips",
      scrollable: true,
    },
  {
      id: "particle-field",
      slug: "particle-field",
      title: "Particle Field",
      description: "Interactive 2D Canvas particle constellation network connecting nearby nodes on cursor proximity.",
      category: "Backgrounds",
      tags: ["Canvas", "Interactive"],
      cliCommand: "npx @melonui-dev/cli add particle-field",
      codeSnippet: `"use client";

import { useEffect, useMemo, useRef } from "react";
import { Canvas, useFrame } from "@react-three/fiber";
import * as THREE from "three";

const DEFAULT_PARTICLE_COUNT = 1200;
const DEFAULT_PALETTE: [number, number, number][] = [
  [0.5, 1.0, 0.37],
  [1.0, 0.36, 0.44],
  [0.91, 0.84, 0.72],
];

function pseudoRandom(seed: number) {
  const value = Math.sin(seed * 12.9898 + 78.233) * 43758.5453;
  return value - Math.floor(value);
}

interface ParticleFieldProps {
  particleCount?: number;
  particleSize?: number;
  palette?: [number, number, number][];
}

function ParticleField({
  particleCount = DEFAULT_PARTICLE_COUNT,
  particleSize = 0.04,
  palette = DEFAULT_PALETTE,
}: ParticleFieldProps) {
  const meshRef = useRef<THREE.Points>(null);
  const mouse = useRef({ x: 0, y: 0 });

  const positions = useMemo(() => {
    const arr = new Float32Array(particleCount * 3);
    for (let i = 0; i < particleCount * 3; i += 1) {
      arr[i] = (pseudoRandom(i + 1) - 0.5) * 8;
    }
    return arr;
  }, [particleCount]);

  const colors = useMemo(() => {
    const arr = new Float32Array(particleCount * 3);
    for (let i = 0; i < particleCount; i += 1) {
      const c = palette[Math.floor(pseudoRandom(i + 4001) * palette.length)] || [1, 1, 1];
      arr[i * 3] = c[0];
      arr[i * 3 + 1] = c[1];
      arr[i * 3 + 2] = c[2];
    }
    return arr;
  }, [particleCount, palette]);

  useEffect(() => {
    const onMove = (e: MouseEvent) => {
      mouse.current.x = (e.clientX / window.innerWidth - 0.5) * 2;
      mouse.current.y = -(e.clientY / window.innerHeight - 0.5) * 2;
    };
    window.addEventListener("mousemove", onMove);
    return () => window.removeEventListener("mousemove", onMove);
  }, []);

  useFrame(({ clock }) => {
    if (!meshRef.current) return;
    const t = clock.getElapsedTime();
    const prefersReducedMotion = typeof window !== "undefined" && window.matchMedia("(prefers-reduced-motion: reduce)").matches;
    if (prefersReducedMotion) {
      meshRef.current.rotation.y = mouse.current.x * 0.3;
      meshRef.current.rotation.x = mouse.current.y * 0.1;
      return;
    }
    meshRef.current.rotation.y = t * 0.04 + mouse.current.x * 0.3;
    meshRef.current.rotation.x = t * 0.02 + mouse.current.y * 0.1;
  });

  return (
    <points ref={meshRef}>
      <bufferGeometry>
        <bufferAttribute
          attach="attributes-position"
          args={[positions, 3]}
        />
        <bufferAttribute
          attach="attributes-color"
          args={[colors, 3]}
        />
      </bufferGeometry>
      <pointsMaterial
        size={particleSize}
        vertexColors
        transparent
        opacity={0.85}
        sizeAttenuation
      />
    </points>
  );
}

export interface ParticleBackgroundProps extends React.ComponentPropsWithoutRef<"div"> {
  particleCount?: number;
  particleSize?: number;
  palette?: [number, number, number][];
  bg?: string;
  borderColor?: string;
  showHint?: boolean;
  hintText?: string;
}

export function ParticleBackground({
  particleCount = DEFAULT_PARTICLE_COUNT,
  particleSize = 0.04,
  palette = DEFAULT_PALETTE,
  bg = "#060606",
  borderColor = "#1a1a1a",
  showHint = true,
  hintText = "Move your mouse to interact",
  className = "",
  style,
  ...props
}: ParticleBackgroundProps) {
  return (
    <div 
      className={\`w-full h-[360px] relative \${className}\`}
      style={{
        backgroundColor: bg,
        border: \`1px solid \${borderColor}\`,
        ...style
      }}
      {...props}
    >
      <Canvas camera={{ position: [0, 0, 5], fov: 60 }}>
        <ambientLight intensity={0.5} />
        <ParticleField 
          particleCount={particleCount} 
          particleSize={particleSize} 
          palette={palette} 
        />
      </Canvas>
      {showHint && (
        <p className="text-center font-mono text-xs text-[#444] -mt-7 relative z-10 pb-4 pointer-events-none">
          {hintText}
        </p>
      )}
    </div>
  );
}
`,
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
      id: "peel-card",
      slug: "peel-card",
      title: "Peel Card",
      description: "Card front retracts on hover revealing vibrant content underneath.",
      category: "Cards",
      tags: ["GSAP", "Transform"],
      cliCommand: "npx @melonui-dev/cli add peel-card",
      codeSnippet: `"use client";

import React, { useRef } from "react";
import gsap from "gsap";

export interface RindPeelCardProps extends React.ComponentPropsWithoutRef<"div"> {
  width?: string | number;
  height?: string | number;
  
  revealTitle?: string;
  revealDesc?: string;
  revealBg?: string;
  revealTextColor?: string;
  revealDescColor?: string;

  peelCategory?: string;
  peelTitle?: string;
  peelHint?: string;
  peelArrow?: string;
  peelBg?: string;
  peelTextColor?: string;
  peelCategoryColor?: string;
  peelHintColor?: string;
  peelArrowColor?: string;
  peelStripeColor?: string;
  borderColor?: string;

  children?: React.ReactNode;
  peelChildren?: React.ReactNode;
  revealChildren?: React.ReactNode;
}

export const RindPeelCard = React.forwardRef<HTMLDivElement, RindPeelCardProps>(
  (
    {
      width = 288, // 72 * 4 = 288px
      height = 208, // 52 * 4 = 208px
      
      revealTitle = "Fresh 🍉",
      revealDesc = "Underneath the rind, something juicy.",
      revealBg = "#7fff5e",
      revealTextColor = "#050505",
      revealDescColor = "rgba(5, 5, 5, 0.7)",

      peelCategory = "Component",
      peelTitle = "Rind Peel Card",
      peelHint = "Hover to reveal",
      peelArrow = "↑",
      peelBg = "#0a0a0a",
      peelTextColor = "#f4f4f4",
      peelCategoryColor = "#e8d5b7",
      peelHintColor = "#555",
      peelArrowColor = "#ff5c71",
      peelStripeColor = "#7fff5e",
      borderColor = "#1e1e1e",

      children,
      peelChildren,
      revealChildren,
      className = "",
      style,
      ...props
    },
    forwardedRef
  ) => {
    const internalRef = useRef<HTMLDivElement>(null);
    const ref = (forwardedRef as React.RefObject<HTMLDivElement | null>) || internalRef;
    const peelRef = useRef<HTMLDivElement>(null);
    const contentRef = useRef<HTMLDivElement>(null);

    const handleEnter = () => {
      if (peelRef.current) {
        gsap.to(peelRef.current, {
          scaleY: 0,
          transformOrigin: "top center",
          duration: 0.5,
          ease: "power3.inOut",
        });
      }
      if (contentRef.current) {
        gsap.to(contentRef.current, {
          opacity: 1,
          y: 0,
          duration: 0.4,
          delay: 0.25,
          ease: "power2.out",
        });
      }
    };

    const handleLeave = () => {
      if (peelRef.current) {
        gsap.to(peelRef.current, {
          scaleY: 1,
          duration: 0.5,
          ease: "power3.inOut",
        });
      }
      if (contentRef.current) {
        gsap.to(contentRef.current, {
          opacity: 0,
          y: 12,
          duration: 0.3,
          ease: "power2.in",
        });
      }
    };

    return (
      <div
        ref={ref}
        onMouseEnter={handleEnter}
        onMouseLeave={handleLeave}
        onFocus={handleEnter}
        onBlur={handleLeave}
        role="button"
        tabIndex={0}
        className={\`relative cursor-pointer overflow-hidden focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-[#ff5c71] \${className}\`}
        style={{
          width,
          height,
          border: \`1px solid \${borderColor}\`,
          ...style,
        }}
        {...props}
      >
        {/* Inner content revealed under peel */}
        <div className="absolute inset-0 flex flex-col justify-center px-6" style={{ backgroundColor: revealBg }}>
          {revealChildren ? revealChildren : (
            <>
              <p className="font-black text-2xl uppercase tracking-tight" style={{ fontFamily: "var(--font-anton)", color: revealTextColor }}>
                {revealTitle}
              </p>
              <p className="text-sm font-mono mt-1" style={{ color: revealDescColor }}>
                {revealDesc}
              </p>
            </>
          )}
        </div>

        {/* The "rind" peel layer */}
        <div
          ref={peelRef}
          className="absolute inset-0 flex flex-col justify-between p-6 z-10"
          style={{ transformOrigin: "top center", backgroundColor: peelBg }}
        >
          {children || peelChildren ? (children || peelChildren) : (
            <>
              <div>
                <p className="font-mono text-xs uppercase tracking-widest mb-2" style={{ color: peelCategoryColor }}>
                  {peelCategory}
                </p>
                <p className="font-black text-2xl uppercase" style={{ fontFamily: "var(--font-anton)", color: peelTextColor }}>
                  {peelTitle}
                </p>
              </div>
              <div className="flex items-center justify-between">
                <span className="font-mono text-xs" style={{ color: peelHintColor }}>
                  {peelHint}
                </span>
                <span className="font-mono text-lg" style={{ color: peelArrowColor }}>
                  {peelArrow}
                </span>
              </div>
            </>
          )}
          {/* Rind stripe */}
          <div className="absolute bottom-0 inset-x-0 h-2" style={{ backgroundColor: peelStripeColor }} />
        </div>

        {/* Hidden content layer reference */}
        <div
          ref={contentRef}
          className="absolute inset-0 z-20 pointer-events-none"
          style={{ opacity: 0, transform: "translateY(12px)" }}
        />
      </div>
    );
  }
);

RindPeelCard.displayName = "RindPeelCard";
`,
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
        { name: "revealTitle", type: "string", defaultValue: `"Fresh ≡ƒìë"`, description: "The title revealed underneath the peel.", control: { type: "text" } },
        { name: "revealDesc", type: "string", defaultValue: `"Underneath the rind, something juicy."`, description: "The description text revealed underneath the peel.", control: { type: "text" } }
      ]
    },
  {
      id: "prism-vault",
      slug: "prism-vault",
      title: "Prism Vault",
      description: "A 3D cryptographic data vault that unspools into a responsive bento dashboard using fluid layout morphing.",
      category: "Layout",
      tags: ["3D", "Framer Motion", "Layout", "Glassmorphism", "Bento", "Interactive"],
      cliCommand: "npx @melonui/cli add prism-vault",
      componentPath: "PrismVault",
      usageCode: `import { PrismVault } from "@/components/PrismVault";

  export default function App() {
    return (
      <div className="p-10 flex justify-center bg-black min-h-screen">
        <PrismVault />
      </div>
    );
  }`,
      props: [
        {
          name: "primaryColor",
          type: "string",
          defaultValue: "#ff5c71",
          description: "Primary accent color for text and borders.",
          control: { type: "color" }
        },
        {
          name: "secondaryColor",
          type: "string",
          defaultValue: "#7fff5e",
          description: "Secondary accent color for highlights and statuses.",
          control: { type: "color" }
        },
        {
          name: "glowColor",
          type: "string",
          defaultValue: "rgba(255, 92, 113, 0.4)",
          description: "Color of the ambient glow.",
          control: { type: "color" }
        },
        {
          name: "title",
          type: "string",
          defaultValue: "SECURE PRISM VAULT",
          description: "Title of the vault card.",
          control: { type: "text" }
        }
      ],
      codeSnippet: `"use client";

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
      className={\`relative w-full max-w-4xl mx-auto flex items-center justify-center min-h-[500px] perspective-1000 \${className}\`}
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
          className={\`relative \${
            isExpanded
              ? "w-full max-w-3xl grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4"
              : "w-64 h-80"
          }\`}
          transition={{ duration: 0.8, ease: [0.16, 1, 0.3, 1] }}
        >
          {/* Main Cover Card */}
          <motion.div
            layout
            onClick={toggleExpand}
            className={\`
              relative flex flex-col justify-between overflow-hidden cursor-pointer
              backdrop-blur-md border border-white/10
              \${isExpanded ? "col-span-1 md:col-span-2 lg:col-span-2 row-span-2 h-full rounded-3xl" : "absolute inset-0 rounded-2xl z-30"}
            \`}
            style={{
              background: \`linear-gradient(135deg, rgba(20,20,20,0.8) 0%, rgba(10,10,10,0.95) 100%)\`,
              boxShadow: isExpanded
                ? \`0 0 40px \${glowColor}, inset 0 0 20px rgba(255,255,255,0.05)\`
                : \`0 20px 40px rgba(0,0,0,0.8), 0 0 20px \${glowColor}, inset 0 0 10px rgba(255,255,255,0.1)\`,
              transform: isExpanded ? "none" : "translateZ(40px)",
            }}
            whileHover={{ scale: isExpanded ? 1 : 1.02 }}
            whileTap={{ scale: 0.98 }}
          >
            {/* Subtle Noise Filter */}
            <div
              className="absolute inset-0 opacity-20 pointer-events-none mix-blend-overlay"
              style={{
                backgroundImage: \`url("data:image/svg+xml,%3Csvg viewBox='0 0 200 200' xmlns='http://www.w3.org/2000/svg'%3E%3Cfilter id='noiseFilter'%3E%3CfeTurbulence type='fractalNoise' baseFrequency='0.65' numOctaves='3' stitchTiles='stitch'/%3E%3C/filter%3E%3Crect width='100%25' height='100%25' filter='url(%23noiseFilter)'/%3E%3C/svg%3E")\`,
              }}
            />

            <div className="p-6 relative z-10 h-full flex flex-col justify-between">
              <div>
                <motion.div
                  layout
                  className="w-12 h-12 rounded-full flex items-center justify-center mb-4"
                  style={{
                    background: \`linear-gradient(135deg, \${primaryColor}20, \${secondaryColor}20)\`,
                    border: \`1px solid \${primaryColor}50\`,
                  }}
                >
                  <span className="text-xl" style={{ textShadow: \`0 0 10px \${primaryColor}\` }}>
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
                            <polygon points="50,15 50,85 80,70" fill="none" stroke={primaryColor} strokeWidth="0.6" strokeDasharray="2,2" />
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
                  className={\`
                    flex flex-col justify-center items-center text-center p-6
                    backdrop-blur-md border border-white/10 rounded-2xl
                    \${isExpanded ? "col-span-1 min-h-[160px]" : "absolute inset-0"}
                  \`}
                  style={{
                    background: \`linear-gradient(135deg, rgba(30,30,30,0.8) 0%, rgba(15,15,15,0.9) 100%)\`,
                    zIndex: isExpanded ? 1 : 20 - index,
                    transform: isExpanded ? "none" : \`translateY(\${stackY}px) translateZ(\${stackZ}px) scale(\${stackScale})\`,
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
              border: \`1px solid \${primaryColor}20\`,
              boxShadow: \`0 0 100px \${primaryColor}10, inset 0 0 50px \${secondaryColor}10\`,
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
`,
      aiPrompt: "Generate a PrismVault component that acts as a 3D cryptographic data vault, expanding into a bento dashboard using framer-motion layout animations, with a magnetic hover effect and glassmorphic styling."
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
      id: "retro-crt-background",
      slug: "retro-crt-background",
      title: "Retro CRT Scan Universe",
      description: "A nostalgic cyber-terminal background featuring scanlines, phosphor glow, typing effect, and screen flicker.",
      category: "Backgrounds",
      tags: ["CSS", "Retro", "Terminal", "Animations"],
      cliCommand: "npx @melonui-dev/cli add retro-crt-background",
      codeSnippet: `"use client";

import React, { useState, useEffect, useRef } from "react";

export interface RetroCrtBackgroundProps extends React.ComponentPropsWithoutRef<"div"> {
  bg?: string;
  color?: string;
  scanlineSpeed?: number;
  typingSpeed?: number;
  flickerIntensity?: number;
  terminalOutput?: string[];
}

export const RetroCrtBackground: React.FC<RetroCrtBackgroundProps> = ({
  bg = "#0a1105",
  color = "#7fff5e",
  scanlineSpeed = 10,
  typingSpeed = 20,
  flickerIntensity = 0.15,
  terminalOutput = [
    "INITIATING SECURE CONNECTION...",
    "HANDSHAKE PROTOCOL: ACCEPTED",
    "DECRYPTING CORE MODULES [██████████] 100%",
    "ACCESS GRANTED.",
    "SYSTEM: ONLINE."
  ],
  className = "",
  style,
  children,
  ...props
}) => {
  const [typedText, setTypedText] = useState("");
  const cursorRef = useRef<HTMLSpanElement>(null);

  useEffect(() => {
    let currentLine = 0;
    let currentChar = 0;
    let textStr = "";
    let isCancelled = false;

    const typeChar = () => {
      if (isCancelled) return;
      if (currentLine < terminalOutput.length) {
        if (currentChar < terminalOutput[currentLine].length) {
          textStr += terminalOutput[currentLine][currentChar];
          setTypedText(textStr);
          currentChar++;
          // Base speed on typingSpeed and add deterministic variance
          const delay = typingSpeed + Math.sin(currentChar) * (typingSpeed * 0.5);
          setTimeout(typeChar, Math.max(5, delay));
        } else {
          textStr += "\n";
          setTypedText(textStr);
          currentLine++;
          currentChar = 0;
          setTimeout(typeChar, 400); // Pause between lines
        }
      }
    };

    setTimeout(typeChar, 1000); // Initial delay

    return () => {
      isCancelled = true;
    };
  }, [terminalOutput, typingSpeed]);

  return (
    <div 
      className={\`relative w-full h-[600px] overflow-hidden rounded-xl font-mono \${className}\`}
      style={{
        backgroundColor: bg,
        color: color,
        ...style
      }}
      {...props}
    >
      {/* CRT Curvature and Screen Border */}
      <div
        className="absolute inset-0 pointer-events-none z-50 border-8 border-[#050505]"
        style={{
          boxShadow: "inset 0 0 100px rgba(0,0,0,0.9)",
          borderRadius: "16px",
        }}
      />

      {/* Phosphor Glow and Vignette */}
      <div className="absolute inset-0 pointer-events-none z-40 bg-[radial-gradient(circle_at_center,transparent_50%,#000000_150%)] mix-blend-multiply opacity-80" />

      {/* Moving Scanlines */}
      <div
        className="absolute inset-0 pointer-events-none z-30 opacity-20 bg-[linear-gradient(rgba(18,16,16,0)_50%,rgba(0,0,0,0.25)_50%),linear-gradient(90deg,rgba(255,0,0,0.06),rgba(0,255,0,0.02),rgba(0,0,255,0.06))]"
        style={{
          backgroundSize: "100% 4px, 3px 100%",
          animation: \`scanlines \${scanlineSpeed}s linear infinite\`
        }}
      />
      <style dangerouslySetInnerHTML={{__html: \`
        @keyframes scanlines {
          from { background-position: 0 0, 0 0; }
          to { background-position: 0 100%, 0 0; }
        }
        @keyframes flicker {
          0% { opacity: 0.95; }
          5% { opacity: 0.85; }
          10% { opacity: 0.95; }
          15% { opacity: 1; }
          100% { opacity: 1; }
        }
        @keyframes cursorBlink {
          0%, 100% { opacity: 1; }
          50% { opacity: 0; }
        }
      \`}} />

      {/* Subtle Screen Flicker */}
      <div
        className="absolute inset-0 w-full h-full pointer-events-none z-20"
        style={{ animation: \`flicker \${flickerIntensity}s infinite alternate\` }}
      >
        {/* Terminal Content */}
        <div className="p-8 h-full flex flex-col justify-end text-sm md:text-base leading-relaxed tracking-wider" style={{ textShadow: \`0 0 5px \${color}bf\` }}>
          <div className="whitespace-pre-wrap">
            {typedText}
            <span ref={cursorRef} className="inline-block w-2.5 h-4 md:w-3 md:h-5 ml-1 align-middle" style={{ backgroundColor: color, animation: "cursorBlink 1s step-end infinite" }} />
          </div>
        </div>
      </div>

      {/* Custom Children container */}
      {children && (
        <div className="absolute inset-0 z-10 flex items-center justify-center">
          {children}
        </div>
      )}

      {/* Screen Glitch Overlay */}
      <div
        className="absolute inset-0 pointer-events-none mix-blend-overlay opacity-30 z-10"
        style={{ backgroundImage: "url('https://grainy-gradients.vercel.app/noise.svg')" }}
      />
    </div>
  );
};`,
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
      id: "retro-grid",
      slug: "retro-grid",
      title: "Retro Grid",
      description: "A neon 3D perspective grid extending to the horizon that moves forward and tilts on cursor coordinates.",
      category: "Backgrounds",
      tags: ["CSS 3D", "Perspective", "Parallax"],
      cliCommand: "npx @melonui-dev/cli add retro-grid",
      codeSnippet: `"use client";

import { useEffect, useRef, useState } from "react";

export interface RetroGridProps extends React.ComponentPropsWithoutRef<"div"> {
  gridColor?: string;
  speed?: number;
  horizonColor?: string;
  tiltMultiplier?: number;
  bg?: string;
  borderColor?: string;
}

export function RetroGrid({
  gridColor = "#ff5c71",
  speed = 1.5,
  horizonColor = "#7fff5e",
  tiltMultiplier = 1.0,
  bg = "#050505",
  borderColor = "#111",
  className = "",
  style,
  ...props
}: RetroGridProps) {
  const containerRef = useRef<HTMLDivElement>(null);
  const canvasRef = useRef<HTMLCanvasElement>(null);
  const [tilt, setTilt] = useState({ x: 0, y: 0 });
  const tiltRef = useRef({ x: 0, y: 0 });

  useEffect(() => {
    const container = containerRef.current;
    if (!container) return;

    const handleMouseMove = (e: MouseEvent) => {
      const rect = container.getBoundingClientRect();
      const x = (e.clientX - rect.left) / rect.width - 0.5; // -0.5 to 0.5
      const y = (e.clientY - rect.top) / rect.height - 0.5; // -0.5 to 0.5

      setTilt({
        x: x * 12 * tiltMultiplier,
        y: -y * 8 * tiltMultiplier,
      });
    };

    const handleMouseLeave = () => {
      setTilt({ x: 0, y: 0 });
    };

    container.addEventListener("mousemove", handleMouseMove);
    container.addEventListener("mouseleave", handleMouseLeave);

    return () => {
      container.removeEventListener("mousemove", handleMouseMove);
      container.removeEventListener("mouseleave", handleMouseLeave);
    };
  }, [tiltMultiplier]);

  // Keep tiltRef in sync with tilt state for smooth animation loop
  useEffect(() => {
    tiltRef.current = tilt;
  }, [tilt]);

  // Canvas perspective grid drawing loop
  useEffect(() => {
    const canvas = canvasRef.current;
    if (!canvas) return;

    const ctx = canvas.getContext("2d");
    if (!ctx) return;

    let animationFrameId: number;
    let scrollOffset = 0;

    const resizeCanvas = () => {
      const parent = canvas.parentElement;
      if (parent) {
        canvas.width = parent.clientWidth;
        canvas.height = parent.clientHeight || 300;
      }
    };

    resizeCanvas();
    window.addEventListener("resize", resizeCanvas);

    // Initialize rising dust particles
    const particles = Array.from({ length: 30 }, () => ({
      x: Math.random(), // normalized 0-1
      y: 0.4 + Math.random() * 0.6, // normalized starting inside grid area
      size: 0.5 + Math.random() * 1.2,
      speedY: -0.0008 - Math.random() * 0.0012,
      speedX: (Math.random() - 0.5) * 0.0003,
      opacity: 0.15 + Math.random() * 0.45,
    }));

    const draw = () => {
      ctx.clearRect(0, 0, canvas.width, canvas.height);
      
      const horizonY = canvas.height * 0.40; // Horizon height set exactly to 40%
      const currentTilt = tiltRef.current;
      // Interpolate center X based on cursor tilt (parallax)
      const horizonX = canvas.width / 2 + currentTilt.x * 3.5;

      // --- Draw Rising Dust Particles ---
      particles.forEach((p) => {
        p.y += p.speedY;
        p.x += p.speedX;

        // Reset particle if it goes above the horizon
        if (p.y < 0.38) {
          p.y = 0.95;
          p.x = Math.random();
        }
        if (p.x < 0 || p.x > 1) {
          p.x = Math.random();
        }

        const px = p.x * canvas.width;
        const py = p.y * canvas.height;

        ctx.fillStyle = gridColor;
        ctx.globalAlpha = p.opacity * 0.35;
        ctx.beginPath();
        ctx.arc(px, py, p.size, 0, Math.PI * 2);
        ctx.fill();
      });
      ctx.globalAlpha = 1.0;

      // --- Draw 3D Perspective Grid ---
      ctx.strokeStyle = gridColor;
      ctx.lineWidth = 1.0;
      
      // We will use screen composite to make grid lines blend beautifully
      ctx.globalCompositeOperation = "screen";

      // 1. Draw horizontal lines with perspective projection
      scrollOffset += 0.015 * speed;
      const numHorizontalLines = 18;
      
      for (let i = 0; i <= numHorizontalLines; i++) {
        // Compute line index shifted by the scrolling fractional offset
        const ratio = (i + (scrollOffset % 1.0)) / numHorizontalLines;
        
        // Power distribution maps linear steps to perspective depth spacing
        const y = horizonY + (canvas.height - horizonY) * Math.pow(ratio, 2.5);
        
        // Calculate grid line transparency: fades out as it approaches the horizon
        const fadeRatio = Math.min(1.0, Math.max(0.0, (y - horizonY) / (canvas.height - horizonY)));
        ctx.globalAlpha = 0.28 * Math.pow(fadeRatio, 1.8);

        ctx.beginPath();
        ctx.moveTo(0, y);
        ctx.lineTo(canvas.width, y);
        ctx.stroke();
      }

      // 2. Draw vertical perspective lines radiating from horizon center
      const numVerticalLines = 28;
      const bottomSpacing = canvas.width / 14; // spread lines at bottom

      for (let j = -numVerticalLines / 2; j <= numVerticalLines / 2; j++) {
        const xBottom = canvas.width / 2 + j * bottomSpacing + currentTilt.x * 2.0;

        // Visual fade for perspective lines as they approach horizon
        ctx.globalAlpha = 0.28;

        ctx.beginPath();
        ctx.moveTo(horizonX, horizonY);
        ctx.lineTo(xBottom, canvas.height);
        ctx.stroke();
      }

      ctx.globalAlpha = 1.0;
      ctx.globalCompositeOperation = "source-over"; // Reset composite operation

      animationFrameId = requestAnimationFrame(draw);
    };

    draw();

    return () => {
      cancelAnimationFrame(animationFrameId);
      window.removeEventListener("resize", resizeCanvas);
    };
  }, [gridColor, speed]);

  return (
    <div
      ref={containerRef}
      className={\`w-full h-full min-h-[300px] relative overflow-hidden flex items-center justify-center select-none \${className}\`}
      style={{
        border: \`1px solid \${borderColor}\`,
        backgroundColor: bg,
        ...style
      }}
      {...props}
    >
      {/* Synthwave Cyber Sun */}
      <div
        className="absolute pointer-events-none"
        style={{
          width: "240px",
          height: "120px",
          top: "calc(40% - 120px)",
          left: "calc(50% - 120px)",
          borderTopLeftRadius: "120px",
          borderTopRightRadius: "120px",
          background: \`linear-gradient(to bottom,
            \${horizonColor} 0%,
            \${horizonColor} 35%,
            transparent 35%,
            transparent 44%,
            \${horizonColor} 44%,
            \${horizonColor} 66%,
            transparent 66%,
            transparent 74%,
            \${horizonColor} 74%,
            \${horizonColor} 86%,
            transparent 86%,
            transparent 92%,
            \${horizonColor} 92%,
            \${horizonColor} 100%
          )\`,
          opacity: 0.12,
          filter: "blur(0.5px)",
        }}
      />

      {/* Grid Canvas Layer */}
      <canvas ref={canvasRef} className="absolute inset-0 block w-full h-full pointer-events-none z-10" />

      {/* Horizon Ambient Radial Glow */}
      <div
        className="absolute inset-0 pointer-events-none"
        style={{
          background: \`radial-gradient(ellipse at 50% 40%, \${horizonColor}0d, transparent 65%)\`,
        }}
      />

      {/* Retro Horizon Laser Line */}
      <div
        className="absolute left-0 right-0 h-[1.5px] pointer-events-none z-20"
        style={{
          top: "40%",
          background: \`linear-gradient(to right, transparent, \${horizonColor}33, \${horizonColor}66, \${horizonColor}33, transparent)\`,
          boxShadow: \`0 0 10px \${horizonColor}33\`,
        }}
      />
    </div>
  );
}
`,
      componentPath: "RetroGrid",
      props: [
        { name: "gridColor", type: "string", defaultValue: `"#ff5c71"`, description: "Hex color code for perspective grid lines.", control: { type: "color" } },
        { name: "speed", type: "number", defaultValue: "1.5", description: "Forward velocity of grid movement.", control: { type: "slider", min: 0.5, max: 4.0, step: 0.1 } },
        { name: "horizonColor", type: "string", defaultValue: `"#7fff5e"`, description: "Laser line and horizon glow hex color.", control: { type: "color" } },
        { name: "tiltMultiplier", type: "number", defaultValue: "1.0", description: "Strength of pointer parallax grid tilt.", control: { type: "slider", min: 0.0, max: 2.0, step: 0.1 } }
      ]
    },
  {
      id: "rind-scanner-text",
      slug: "rind-scanner-text",
      title: "Rind Reveal Text",
      description: "A transparent pointer-light wordmark that reveals a primary/secondary color pass inside readable chunky type.",
      category: "GSAP Text",
      tags: ["Framer Motion", "Typography", "Reveal", "Gradient"],
      cliCommand: "npx @melonui-dev/cli add rind-scanner-text",
      codeSnippet: `"use client";

import React, { useState } from "react";
import { motion } from "framer-motion";

export interface RindScannerTextProps extends React.ComponentPropsWithoutRef<"button"> {
  text?: string;
  label?: string;
  baseColor?: string;
  scanColor?: string;
  accentColor?: string;
}

export function RindScannerText({
  text = "RIND",
  label = "Pointer light reveal",
  baseColor = "#f4f4f4",
  scanColor = "#7fff5e",
  accentColor = "#ff5c71",
  className = "",
  style,
  ...props
}: RindScannerTextProps) {
  const [active, setActive] = useState(false);
  const [spot, setSpot] = useState({ x: 52, y: 46 });

  const handlePointerMove = (event: React.PointerEvent<HTMLButtonElement>) => {
    const rect = event.currentTarget.getBoundingClientRect();
    setSpot({
      x: ((event.clientX - rect.left) / rect.width) * 100,
      y: ((event.clientY - rect.top) / rect.height) * 100,
    });
  };

  return (
    <button
      type="button"
      aria-label={\`\${label}: \${text}\`}
      onPointerMove={handlePointerMove}
      onPointerEnter={() => setActive(true)}
      onPointerLeave={() => {
        setActive(false);
        setSpot({ x: 52, y: 46 });
      }}
      className={\`group relative inline-flex w-full max-w-[980px] cursor-pointer flex-col overflow-visible bg-transparent p-0 text-left focus:outline-none focus-visible:ring-2 focus-visible:ring-[#7fff5e] \${className}\`}
      style={style}
      {...props}
      onClick={(e) => {
        setActive((value) => !value);
        if (props.onClick) props.onClick(e);
      }}
    >
      {label && (
        <span className="mb-3 block font-mono text-[10px] uppercase tracking-[0.3em]" style={{ color: scanColor }}>
          {label}
        </span>
      )}

      <span className="relative inline-block overflow-visible">
        <motion.span
          aria-hidden="true"
          className="pointer-events-none absolute -inset-x-6 -inset-y-5 rounded-full opacity-75 blur-2xl"
          style={{
            background: \`radial-gradient(circle at \${spot.x}% \${spot.y}%, \${accentColor}33, \${scanColor}24 32%, transparent 64%)\`,
          }}
          animate={{ scale: active ? 1.04 : 0.92, opacity: active ? 0.9 : 0.48 }}
          transition={{ duration: 0.35, ease: [0.16, 1, 0.3, 1] }}
        />

        <motion.span
          className="relative block text-[clamp(3.6rem,12vw,8rem)] uppercase leading-[0.8]"
          style={{
            fontFamily: "var(--font-londrina-solid)",
            color: baseColor,
            textShadow: \`0 18px 42px \${accentColor}1f\`,
          }}
          animate={{
            y: active ? -3 : 0,
            letterSpacing: active ? "0.025em" : "0em",
          }}
          transition={{ type: "spring", stiffness: 220, damping: 20 }}
        >
          {text}
        </motion.span>

        <motion.span
          aria-hidden="true"
          className="absolute inset-0 block text-[clamp(3.6rem,12vw,8rem)] uppercase leading-[0.8]"
          style={{
            fontFamily: "var(--font-londrina-solid)",
            color: "transparent",
            backgroundImage: \`
              radial-gradient(circle at \${spot.x}% \${spot.y}%, #fff 0%, \${accentColor} 28%, \${scanColor} 54%, transparent 72%),
              repeating-linear-gradient(105deg, \${scanColor} 0 8px, #163f16 8px 13px, \${accentColor} 13px 19px)
            \`,
            backgroundClip: "text",
            WebkitBackgroundClip: "text",
            WebkitTextFillColor: "transparent",
            filter: \`drop-shadow(0 0 18px \${scanColor}44)\`,
          }}
          animate={{
            opacity: active ? 1 : 0.34,
            clipPath: active
              ? \`circle(52% at \${spot.x}% \${spot.y}%)\`
              : \`circle(22% at \${spot.x}% \${spot.y}%)\`,
          }}
          transition={{ duration: 0.32, ease: [0.16, 1, 0.3, 1] }}
        >
          {text}
        </motion.span>

        <span
          aria-hidden="true"
          className="absolute -bottom-[0.12em] left-0 h-[0.08em] w-full origin-left rounded-full opacity-80 transition-transform duration-300 group-hover:scale-x-100"
          style={{
            background: \`linear-gradient(90deg, \${accentColor}, \${scanColor}, transparent)\`,
            transform: active ? "scaleX(1)" : "scaleX(0.38)",
          }}
        />
      </span>
    </button>
  );
}
`,
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
      id: "ripple-button",
      slug: "ripple-button",
      title: "Ripple Button",
      description: "Click-origin radial ripple expands from the exact cursor position.",
      category: "Buttons",
      tags: ["GSAP", "Ripple"],
      cliCommand: "npx @melonui-dev/cli add ripple-button",
      codeSnippet: `"use client";

import { useRef } from "react";
import gsap from "gsap";

export interface RippleButtonProps extends React.ComponentPropsWithoutRef<"button"> {
  label?: string;
  duration?: number;
  rippleColor?: string;
  borderColor?: string;
  textColor?: string;
  hoverBgColor?: string;
  hoverTextColor?: string;
}

export function RippleButton({
  label = "Click for ripple",
  duration = 0.7,
  rippleColor = "rgba(127, 255, 94, 0.25)",
  borderColor = "#ff5c71",
  textColor = "#ff5c71",
  hoverBgColor = "#ff5c71",
  hoverTextColor = "#050505",
  className = "",
  style,
  ...props
}: RippleButtonProps) {
  const rippleContainer = useRef<HTMLSpanElement>(null);

  const handleClick = (e: React.MouseEvent<HTMLButtonElement>) => {
    const btn = e.currentTarget;
    const rect = btn.getBoundingClientRect();
    const size = Math.max(rect.width, rect.height) * 2;
    const x = e.clientX - rect.left - size / 2;
    const y = e.clientY - rect.top - size / 2;

    const ripple = document.createElement("span");
    ripple.style.cssText = \`
      position: absolute;
      width: \${size}px;
      height: \${size}px;
      left: \${x}px;
      top: \${y}px;
      border-radius: 50%;
      background: \${rippleColor};
      pointer-events: none;
    \`;
    rippleContainer.current?.appendChild(ripple);

    gsap.fromTo(
      ripple,
      { scale: 0, opacity: 1 },
      {
        scale: 1,
        opacity: 0,
        duration: duration,
        ease: "power2.out",
        onComplete: () => ripple.remove(),
      }
    );

    if (props.onClick) {
      props.onClick(e);
    }
  };

  return (
    <button
      onClick={handleClick}
      className={\`relative overflow-hidden px-10 py-4 bg-transparent border font-mono text-sm uppercase tracking-widest transition-colors group focus:outline-none focus-visible:ring-1 focus-visible:ring-[#ff5c71] \${className}\`}
      style={{
        borderColor: borderColor,
        color: textColor,
        ...style
      }}
      {...props}
      onMouseEnter={(e) => {
        e.currentTarget.style.color = hoverTextColor;
        if (props.onMouseEnter) props.onMouseEnter(e);
      }}
      onMouseLeave={(e) => {
        e.currentTarget.style.color = textColor;
        if (props.onMouseLeave) props.onMouseLeave(e);
      }}
    >
      {/* Hover fill */}
      <span 
        className="absolute inset-0 translate-y-full group-hover:translate-y-0 transition-transform duration-300 ease-out" 
        style={{
          backgroundColor: hoverBgColor
        }}
      />
      <span ref={rippleContainer} className="absolute inset-0 overflow-hidden" />
      <span className="relative z-10">{label}</span>
    </button>
  );
}
`,
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
      id: "scramble-text",
      slug: "scramble-text",
      title: "Scramble Text",
      description: "Characters cycle through random glyphs before resolving back on hover.",
      category: "GSAP Text",
      tags: ["GSAP", "Text"],
      cliCommand: "npx @melonui-dev/cli add scramble-text",
      codeSnippet: `"use client";

import { useRef, useCallback } from "react";

const CHARS = "ABCDEFGHIJKLMNOPQRSTUVWXYZ0123456789!@#$%";

export interface ScrambleTextProps extends React.ComponentPropsWithoutRef<"div"> {
  text?: string;
  glyphs?: string;
  label?: string;
  speed?: number;
  fontSize?: string;
  textColor?: string;
  hoverTextColor?: string;
  labelColor?: string;
}

export function ScrambleText({
  text = "SCRAMBLE",
  glyphs = CHARS,
  label = "Hover to scramble",
  speed = 35,
  fontSize = "text-6xl",
  textColor = "#f4f4f4",
  hoverTextColor = "#ff5c71",
  labelColor = "#444",
  className = "",
  style,
  ...props
}: ScrambleTextProps) {
  const textRef = useRef<HTMLSpanElement>(null);
  const intervalRef = useRef<ReturnType<typeof setInterval> | null>(null);
  const isRunning = useRef(false);

  const scramble = useCallback(() => {
    if (isRunning.current || !textRef.current) return;
    isRunning.current = true;

    let iterations = 0;
    const maxIter = text.length * 5;

    intervalRef.current = setInterval(() => {
      if (!textRef.current) return;
      iterations++;

      textRef.current.textContent = text
        .split("")
        .map((char, i) => {
          if (char === " ") return " ";
          const resolveAt = Math.floor((i / text.length) * maxIter);
          if (iterations > resolveAt) return char;
          return glyphs[Math.floor(Math.random() * glyphs.length)];
        })
        .join("");

      if (iterations >= maxIter) {
        clearInterval(intervalRef.current!);
        if (textRef.current) textRef.current.textContent = text;
        isRunning.current = false;
      }
    }, speed);
  }, [glyphs, speed, text]);

  const handleKeyDown = (e: React.KeyboardEvent) => {
    if (e.key === "Enter" || e.key === " ") {
      e.preventDefault();
      scramble();
    }
  };

  return (
    <div
      role="button"
      tabIndex={0}
      className={\`flex flex-col items-center gap-6 cursor-pointer group focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-[#ff5c71] \${className}\`}
      onMouseEnter={scramble}
      onFocus={scramble}
      onKeyDown={handleKeyDown}
      style={style}
      {...props}
    >
      <span
        ref={textRef}
        className={\`font-black tracking-tighter transition-colors duration-300 \${fontSize}\`}
        style={{
          fontFamily: "var(--font-anton)",
          minWidth: "8ch",
          textAlign: "center",
          color: textColor,
          "--hover-color": hoverTextColor,
        } as React.CSSProperties}
        onMouseEnter={(e) => {
          e.currentTarget.style.color = hoverTextColor;
        }}
        onMouseLeave={(e) => {
          e.currentTarget.style.color = textColor;
        }}
      >
        {text}
      </span>
      {label && (
        <span className="font-mono text-[10px] uppercase tracking-widest" style={{ color: labelColor }}>
          {label}
        </span>
      )}
    </div>
  );
}
`,
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
      id: "seedwave-text",
      slug: "seedwave-text",
      title: "Seedwave Text",
      description: "Transparent click-born particle typography that compresses the headline and throws melon-colored seed sparks from the exact press point.",
      category: "GSAP Text",
      tags: ["Framer Motion", "Typography", "Particles", "Click"],
      cliCommand: "npx @melonui-dev/cli add seedwave-text",
      codeSnippet: `"use client";

import React, { useState } from "react";
import { AnimatePresence, motion } from "framer-motion";

interface Seed {
  id: number;
  x: number;
  y: number;
}

export interface SeedwaveTextProps extends React.ComponentPropsWithoutRef<"button"> {
  topText?: string;
  bottomText?: string;
  seedCount?: number;
  primaryColor?: string;
  colors?: string[];
}

export function SeedwaveText({
  topText = "Seed",
  bottomText = "Wave",
  seedCount = 18,
  primaryColor = "#ffffff",
  colors = ["#7fff5e", "#ff5c71", "#f7f0d2"],
  className = "",
  style,
  ...props
}: SeedwaveTextProps) {
  const [seeds, setSeeds] = useState<Seed[]>([]);
  const [wave, setWave] = useState(0);

  const burst = (event: React.PointerEvent<HTMLButtonElement>) => {
    const rect = event.currentTarget.getBoundingClientRect();
    const x = event.clientX - rect.left;
    const y = event.clientY - rect.top;
    const created = Array.from({ length: seedCount }, (_, index) => ({
      id: Date.now() + index,
      x,
      y,
    }));
    setSeeds((current) => [...current.slice(-seedCount), ...created]);
    setWave((value) => value + 1);
    window.setTimeout(() => {
      setSeeds((current) => current.filter((seed) => !created.some((item) => item.id === seed.id)));
    }, 1200);

    if (props.onPointerDown) {
      props.onPointerDown(event);
    }
  };

  return (
    <button
      type="button"
      aria-label={\`\${topText} \${bottomText}\`}
      className={\`relative inline-block w-full max-w-[980px] cursor-pointer overflow-visible bg-transparent p-0 text-left focus:outline-none focus-visible:ring-2 focus-visible:ring-[#ff5c71] \${className}\`}
      style={style}
      {...props}
      onPointerDown={burst}
    >
      <motion.span
        key={wave}
        className="relative z-10 block text-[clamp(4.5rem,15vw,10rem)] uppercase leading-[0.76]"
        style={{
          fontFamily: "var(--font-londrina-solid)",
          color: primaryColor,
          textShadow: "0 22px 50px rgba(255,92,113,0.18)",
        }}
        animate={{ y: [0, -12, 0], scaleY: [1, 0.92, 1] }}
        transition={{ duration: 0.42, ease: [0.16, 1, 0.3, 1] }}
      >
        {topText}
        <br />
        {bottomText}
      </motion.span>
      <AnimatePresence>
        {seeds.map((seed, index) => {
          const angle = (index / seedCount) * Math.PI * 2;
          const distance = 70 + (index % 5) * 18;
          const color = colors[index % colors.length] ?? "#ff5c71";
          return (
            <motion.span
              key={seed.id}
              className="absolute z-20 h-3 w-1.5 rounded-full"
              style={{ left: seed.x, top: seed.y, backgroundColor: color }}
              initial={{ x: 0, y: 0, rotate: 0, opacity: 1, scale: 0.3 }}
              animate={{
                x: Math.cos(angle) * distance,
                y: Math.sin(angle) * distance,
                rotate: angle * 120,
                opacity: 0,
                scale: 1,
              }}
              exit={{ opacity: 0 }}
              transition={{ duration: 0.95, ease: [0.16, 1, 0.3, 1] }}
            />
          );
        })}
      </AnimatePresence>
    </button>
  );
}
`,
      componentPath: "SeedwaveText",
      props: [
        { name: "topText", type: "string", defaultValue: `"Seed"`, description: "First line of the headline.", control: { type: "text" } },
        { name: "bottomText", type: "string", defaultValue: `"Wave"`, description: "Second line of the headline.", control: { type: "text" } },
        { name: "seedCount", type: "number", defaultValue: "18", description: "Number of seed particles emitted per press.", control: { type: "slider", min: 6, max: 36, step: 1 } },
        { name: "primaryColor", type: "string", defaultValue: `"#ffffff"`, description: "Headline text color.", control: { type: "color" } }
      ],
    },
  {
      id: "signal-loom",
      slug: "signal-loom",
      title: "Signal Loom",
      description: "A transparent pointer-reactive glass command surface where luminous workflow threads bend toward the cursor and layered inspection wafers morph into focus.",
      category: "Cards",
      tags: ["Framer Motion", "Glassmorphism", "Pointer Physics", "Workflow"],
      cliCommand: "npx @melonui-dev/cli add signal-loom",
      codeSnippet: `"use client";

import React, { useState, useEffect, useMemo } from "react";
import { motion, AnimatePresence, HTMLMotionProps } from "framer-motion";

export interface SignalLoomMetric {
  label: string;
  value: string;
}

export interface SignalLoomThread {
  id: string;
  title: string;
  meta: string;
  value: string;
  color: string;
  copy: string;
  metrics?: SignalLoomMetric[];
}

export interface SignalLoomProps extends Omit<HTMLMotionProps<"section">, "title"> {
  title?: string;
  eyebrow?: string;
  statusLabel?: string;
  lensLabel?: string;
  threads?: SignalLoomThread[];
  containerBg?: string;
  cardBgLeft?: string;
  cardBgRight?: string;
  currentThreadLabel?: string;
  hoverHint?: string;
  clickHint?: string;
  metricLabel1?: string;
  metricLabel2?: string;
  metricLabel3?: string;
}

const DEFAULT_THREADS: SignalLoomThread[] = [
  {
    id: "brief",
    title: "Brief",
    meta: "Input",
    value: "92%",
    color: "#ff5c71",
    copy: "Collect user intent, constraints, edge states, and the emotional target.",
    metrics: [
      { label: "Pulse", value: "92%" },
      { label: "Glass", value: "88%" },
      { label: "Drift", value: "15ms" },
    ]
  },
  {
    id: "taste",
    title: "Taste",
    meta: "Lens",
    value: "Hot",
    color: "#7fff5e",
    copy: "Filter the surface through MelonUI contrast, glass, glow, and tactile motion.",
    metrics: [
      { label: "Pulse", value: "Hot" },
      { label: "Glass", value: "96%" },
      { label: "Drift", value: "8ms" },
    ]
  },
  {
    id: "ship",
    title: "Ship",
    meta: "Output",
    value: "Live",
    color: "#f7f0d2",
    copy: "Package the interaction as source-first UI with demo, registry metadata, and polish.",
    metrics: [
      { label: "Pulse", value: "Live" },
      { label: "Glass", value: "99%" },
      { label: "Drift", value: "3ms" },
    ]
  },
];

export function SignalLoom({
  title = "Route the next best action",
  eyebrow = "Signal Loom",
  statusLabel = "Live sprint",
  lensLabel = "Buyer lens",
  threads = DEFAULT_THREADS,
  containerBg = "rgba(8, 8, 10, 0.95)",
  cardBgLeft = "rgba(12, 12, 16, 0.5)",
  cardBgRight = "rgba(10, 10, 12, 0.6)",
  currentThreadLabel = "Current Thread",
  hoverHint = "Hover threads",
  clickHint = "Click to pin",
  metricLabel1 = "Pulse",
  metricLabel2 = "Glass",
  metricLabel3 = "Drift",
  className = "",
  style,
  ...props
}: SignalLoomProps) {
  const [active, setActive] = useState(1);
  const [hovered, setHovered] = useState<number | null>(null);
  const [logs, setLogs] = useState<string[]>([]);

  const safeThreads = threads && threads.length > 0 ? threads : DEFAULT_THREADS;
  const activeIndex = Math.min(hovered ?? active, safeThreads.length - 1);
  const activeThread = safeThreads[activeIndex] ?? safeThreads[0];

  // Streaming logs mockup generator
  const getLogsForThread = (id: string) => {
    switch (id) {
      case "brief":
        return [
          "[sys] initiating trace: brief input data payload...",
          "[api] source telemetry schema validated: OK",
          "[parse] mapping constraints and edge layouts...",
          "[info] cluster processing signal routing indexes",
          "[success] thread trace ready for execution metrics."
        ];
      case "taste":
        return [
          "[sys] initializing visual taste matrices...",
          "[metrics] scanning contrast values and border physics...",
          "[safety] verification: brand color checks fully passed",
          "[telemetry] computing fluid scroll-animation weights...",
          "[success] active tactile values synced to dashboard."
        ];
      case "ship":
        return [
          "[sys] packaging build distribution registry...",
          "[bundler] packaging react client components...",
          "[sync] executing components registry sync pipeline...",
          "[telemetry] verified local compilation checks: OK",
          "[success] application exported to local node cluster."
        ];
      default:
        return [
          \`[sys] establishing connection to node \${id}...\`,
          "[api] validation: OK, streaming status metadata...",
          "[trace] pipeline executing trace logs...",
          "[success] node response processed successfully."
        ];
    }
  };

  useEffect(() => {
    const targetLogs = getLogsForThread(activeThread.id);
    setLogs([]);
    
    const timeouts = targetLogs.map((log, index) => 
      setTimeout(() => {
        setLogs(prev => [...prev, log]);
      }, index * 120)
    );

    return () => {
      timeouts.forEach(clearTimeout);
    };
  }, [activeThread.id]);

  return (
    <motion.section
      aria-label="Signal Loom interactive component"
      className={\`relative flex w-full items-center justify-center overflow-visible px-0 py-0 text-white \${className}\`}
      style={style}
      {...props}
    >
      <div
        className="relative z-10 grid w-full max-w-5xl gap-4 rounded-lg border border-white/10 p-4 shadow-[0_20px_50px_rgba(0,0,0,0.45)] md:grid-cols-[1.1fr_0.9fr]"
        style={{ backgroundColor: containerBg }}
      >
        {/* Left Card: Stepper / Pipeline Flow */}
        <div 
          className="relative min-h-fit overflow-hidden rounded border border-white/5 p-4 sm:p-5"
          style={{ backgroundColor: cardBgLeft }}
        >
          {/* Background Subtle Accent Grids */}
          <div 
            className="absolute inset-0 opacity-[0.02] pointer-events-none" 
            style={{
              backgroundImage: "linear-gradient(to right, #fff 1px, transparent 1px), linear-gradient(to bottom, #fff 1px, transparent 1px)",
              backgroundSize: "20px 20px"
            }}
          />

          <div className="relative z-10 flex h-full flex-col justify-between">
            {/* Header info */}
            <div className="flex items-start justify-between gap-4 mb-6">
              <div>
                <p className="font-mono text-[9px] uppercase tracking-[0.25em] text-[#ff5c71]">
                  {eyebrow}
                </p>
                <h3
                  className="mt-1 text-2xl font-bold tracking-tight text-white uppercase sm:text-3xl"
                  style={{ fontFamily: "var(--font-Outfit), sans-serif" }}
                >
                  {title}
                </h3>
              </div>
              <div className="shrink-0 rounded border border-white/10 bg-white/[0.02] px-2.5 py-1 font-mono text-[8px] uppercase tracking-[0.2em] text-white/40">
                {statusLabel}
              </div>
            </div>

            {/* Vertical Flow Stepper Container */}
            <div className="relative flex flex-col gap-3 py-1 pl-7">
              {/* Stepper Vertical Flow Line */}
              <div className="absolute left-[9px] top-4 bottom-4 w-0.5 pointer-events-none bg-white/[0.04]">
                <svg className="absolute top-0 left-0 w-full h-full" preserveAspectRatio="none">
                  <motion.line
                    x1="0" y1="0" x2="0" y2="100%"
                    stroke={activeThread.color}
                    strokeWidth="2"
                    strokeDasharray="4 6"
                    animate={{ strokeDashoffset: [0, -20] }}
                    transition={{ repeat: Infinity, duration: 1.5, ease: "linear" }}
                  />
                </svg>
              </div>

              {safeThreads.map((thread, index) => {
                const isActive = index === activeIndex;
                return (
                  <button
                    key={thread.id}
                    type="button"
                    onMouseEnter={() => setHovered(index)}
                    onFocus={() => setHovered(index)}
                    onBlur={() => setHovered(null)}
                    onClick={() => setActive(index)}
                    className={\`
                      group relative w-full flex items-start gap-4 p-3 rounded text-left border transition-all duration-300
                      \${isActive ? "border-white/15 bg-white/[0.03]" : "border-transparent bg-white/[0.005] hover:bg-white/[0.015] hover:border-white/5"}
                    \`}
                    aria-pressed={active === index}
                  >
                    {/* Stepper Node Bullet */}
                    <div 
                      className={\`
                        absolute left-[-24px] top-[14px] w-2.5 h-2.5 rounded-full border bg-[#08080a] z-10 transition-all duration-300
                        \${isActive ? "scale-110 shadow-[0_0_8px_currentColor]" : "opacity-45 scale-90"}
                      \`}
                      style={{ 
                        borderColor: thread.color,
                        color: thread.color
                      }}
                    />

                    <div className="flex-1 flex flex-col">
                      <div className="flex items-center justify-between gap-2">
                        <span className="font-mono text-[8px] uppercase tracking-wider text-white/30">
                          {thread.meta}
                        </span>
                        <span 
                          className="font-mono text-[9px] font-semibold"
                          style={{ color: thread.color }}
                        >
                          {thread.value}
                        </span>
                      </div>
                      <span
                        className="text-sm font-semibold tracking-tight text-white/90 uppercase mt-0.5"
                        style={{ fontFamily: "var(--font-Outfit), sans-serif" }}
                      >
                        {thread.title}
                      </span>
                      <p className="mt-1 text-[11px] leading-relaxed text-white/50 font-mono">
                        {thread.copy}
                      </p>
                    </div>
                  </button>
                );
              })}
            </div>
          </div>
        </div>

        {/* Right Card: Telemetry Trace log monitor */}
        <aside 
          className="relative overflow-hidden rounded border border-white/5 p-4 sm:p-5"
          style={{ backgroundColor: cardBgRight }}
        >
          {/* Subtle Corner Glow Accent */}
          <div className="absolute top-0 right-0 w-32 h-32 opacity-15 pointer-events-none rounded-full blur-2xl" 
               style={{ background: \`radial-gradient(circle, \${activeThread.color} 0%, transparent 70%)\` }} 
          />

          <div className="relative z-10 flex h-full flex-col justify-between">
            <div>
              {/* Header inside wafer */}
              <div className="flex items-center justify-between border-b border-white/5 pb-3 mb-4">
                <span className="font-mono text-[8px] uppercase tracking-[0.2em] text-white/30">
                  {lensLabel}
                </span>
                <div className="flex items-center gap-1.5">
                  <span className="font-mono text-[8px] tracking-wider text-white/40 uppercase">NODE:</span>
                  <span 
                    className="font-mono text-[8px] font-semibold uppercase tracking-wider"
                    style={{ color: activeThread.color }}
                  >
                    {activeThread.title}
                  </span>
                  <span
                    className="h-1.5 w-1.5 rounded-full shadow-[0_0_8px_currentColor]"
                    style={{ color: activeThread.color, backgroundColor: activeThread.color }}
                  />
                </div>
              </div>

              {/* Inspector details layout */}
              <div className="flex flex-col gap-3">
                <div className="flex flex-col">
                  <span className="font-mono text-[8px] uppercase tracking-[0.2em] text-white/40">
                    {currentThreadLabel}
                  </span>
                  <h4
                    className="text-2xl font-bold tracking-tight text-white uppercase mt-0.5"
                    style={{ fontFamily: "var(--font-Outfit), sans-serif", color: activeThread.color }}
                  >
                    {activeThread.title} Pipeline
                  </h4>
                </div>

                {/* Simulated Telemetry log monitor */}
                <div className="bg-[#050507] border border-white/5 rounded p-3 min-h-[140px] font-mono text-[9px] text-white/60 flex flex-col gap-1.5 overflow-hidden">
                  <AnimatePresence mode="popLayout">
                    {logs.map((log, idx) => (
                      <motion.div
                        key={log}
                        initial={{ opacity: 0, x: -3 }}
                        animate={{ opacity: 1, x: 0 }}
                        exit={{ opacity: 0 }}
                        transition={{ duration: 0.15 }}
                        className="leading-relaxed border-l-2 pl-2 border-white/5 break-all"
                        style={{ 
                          borderColor: idx === logs.length - 1 ? activeThread.color : "rgba(255,255,255,0.05)",
                          color: idx === logs.length - 1 ? "#fff" : "rgba(255,255,255,0.6)"
                        }}
                      >
                        {log}
                      </motion.div>
                    ))}
                  </AnimatePresence>
                </div>

                {/* Metrics Grid */}
                <div className="grid grid-cols-3 gap-2 mt-2">
                  {(activeThread.metrics || [
                    { label: metricLabel1, value: activeThread.value },
                    { label: metricLabel2, value: "78%" },
                    { label: metricLabel3, value: "94%" }
                  ]).map((m, index) => (
                    <div
                      key={index}
                      className="rounded border border-white/5 bg-white/[0.01] p-2 flex flex-col"
                    >
                      <span className="block font-mono text-[7px] uppercase tracking-[0.15em] text-white/30">
                        {m.label}
                      </span>
                      <span 
                        className="mt-1 block font-mono text-[10px] font-semibold text-white/80"
                        style={{ color: activeThread.color }}
                      >
                        {m.value}
                      </span>
                    </div>
                  ))}
                </div>
              </div>
            </div>

            {/* Wafer footer */}
            <div className="mt-5 flex items-center justify-between border-t border-white/5 pt-3 font-mono text-[8px] uppercase tracking-[0.2em] text-white/30">
              <span>{hoverHint}</span>
              <span>{clickHint}</span>
            </div>
          </div>
        </aside>
      </div>
    </motion.section>
  );
}
`,
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
      id: "step-trail",
      slug: "step-trail",
      title: "Step Trail",
      description: "Animated step breadcrumb with GSAP-driven progress bar between stages.",
      category: "Navigation",
      tags: ["GSAP", "Progress"],
      cliCommand: "npx @melonui-dev/cli add step-trail",
      codeSnippet: `"use client";

import { useState, useRef } from "react";
import gsap from "gsap";

const DEFAULT_STEPS = ["Harvest", "Slice", "Serve", "Enjoy"];

export interface BreadcrumbTrailProps extends Omit<React.ComponentPropsWithoutRef<"div">, "onChange"> {
  steps?: string[];
  activeColor?: string;
  inactiveBgColor?: string;
  inactiveBorderColor?: string;
  textColor?: string;
  onChange?: (index: number) => void;
}

export function BreadcrumbTrail({
  steps = DEFAULT_STEPS,
  activeColor = "#ff5c71",
  inactiveBgColor = "#111",
  inactiveBorderColor = "#222",
  textColor = "#444",
  onChange,
  className = "",
  style,
  ...props
}: BreadcrumbTrailProps) {
  const [active, setActive] = useState(0);
  const progressRef = useRef<HTMLDivElement>(null);

  const go = (i: number) => {
    setActive(i);
    if (onChange) onChange(i);
    if (progressRef.current) {
      gsap.to(progressRef.current, {
        width: \`\${((i) / (steps.length - 1)) * 100}%\`,
        duration: 0.5,
        ease: "power2.out",
      });
    }
  };

  const handleKeyDown = (e: React.KeyboardEvent, i: number) => {
    if (e.key === "Enter" || e.key === " ") {
      e.preventDefault();
      go(i);
    }
  };

  return (
    <div 
      className={\`flex flex-col items-center gap-8 w-full max-w-sm \${className}\`}
      style={style}
      {...props}
    >
      {/* Step labels */}
      <div className="flex items-center w-full justify-between">
        {steps.map((step, i) => {
          const isActive = i <= active;
          return (
            <button
              key={step}
              onClick={() => go(i)}
              onKeyDown={(e) => handleKeyDown(e, i)}
              className="flex flex-col items-center gap-2 group cursor-pointer focus:outline-none focus-visible:ring-1 focus-visible:ring-[#ff5c71] rounded"
            >
              <span
                className="w-8 h-8 flex items-center justify-center font-mono text-xs font-bold transition-all duration-300 border"
                style={{
                  backgroundColor: isActive ? activeColor : inactiveBgColor,
                  borderColor: isActive ? activeColor : inactiveBorderColor,
                  color: isActive ? "#050505" : textColor,
                }}
                onMouseEnter={(e) => {
                  if (!isActive) {
                    e.currentTarget.style.borderColor = activeColor;
                  }
                }}
                onMouseLeave={(e) => {
                  if (!isActive) {
                    e.currentTarget.style.borderColor = inactiveBorderColor;
                  }
                }}
              >
                {i + 1}
              </span>
              <span
                className="font-mono text-[10px] uppercase tracking-wider transition-colors"
                style={{
                  color: isActive ? activeColor : textColor
                }}
              >
                {step}
              </span>
            </button>
          );
        })}
      </div>

      {/* Progress track */}
      <div className="w-full h-px relative" style={{ backgroundColor: inactiveBorderColor }}>
        <div 
          ref={progressRef} 
          className="absolute top-0 left-0 h-full" 
          style={{ width: "0%", backgroundColor: activeColor }} 
        />
      </div>

      <p className="font-mono text-xs" style={{ color: textColor }}>
        Step {active + 1} of {steps.length}: <span style={{ color: activeColor }}>{steps[active]}</span>
      </p>
    </div>
  );
}
`,
      componentPath: "BreadcrumbTrail",
    },
  {
      id: "sticker-collage-wall",
      slug: "sticker-collage-wall",
      title: "Sticker Collage Noise Wall",
      description: "A Gen-Z chaotic scrapbook aesthetic with draggable torn paper stickers and reactive physics.",
      category: "Backgrounds",
      tags: ["Framer Motion", "Physics", "Drag", "Gen-Z"],
      cliCommand: "npx @melonui-dev/cli add sticker-collage-wall",
      codeSnippet: `"use client";

import React, { useState, useEffect } from "react";
import { motion } from "framer-motion";

interface StickerProps {
  x: number;
  y: number;
  rotation: number;
  scale: number;
  imageUrl: string;
  delay: number;
  zIndex: number;
}

export interface StickerCollageWallProps extends React.ComponentPropsWithoutRef<"div"> {
  bg?: string;
  gridOpacity?: number;
  stickerScaleMultiplier?: number;
  dragFree?: boolean;
  titleText?: string;
  primaryColor?: string;
  secondaryColor?: string;
  accentColor?: string;
}

export const StickerCollageWall: React.FC<StickerCollageWallProps> = ({
  bg = "#e5e5e5",
  gridOpacity = 0.2,
  stickerScaleMultiplier = 1.0,
  dragFree = true,
  titleText = "",
  primaryColor = "#ff5c71",
  secondaryColor = "#7fff5e",
  accentColor = "#000000",
  className = "",
  style,
  children,
  ...props
}) => {
  const [stickers, setStickers] = useState<StickerProps[]>([]);
  const [isMounted, setIsMounted] = useState(false);

  useEffect(() => {
    const timeout = setTimeout(() => setIsMounted(true), 0);
    // Deterministic pseudo-random generation for SSR compatibility
    const predefinedStickers = [
      { x: 10, y: 20, r: -15, s: 1.2, z: 1 },
      { x: 70, y: 15, r: 10, s: 0.9, z: 2 },
      { x: 40, y: 50, r: -5, s: 1.5, z: 3 },
      { x: 80, y: 60, r: 25, s: 1.1, z: 4 },
      { x: 20, y: 70, r: -20, s: 1.3, z: 5 },
      { x: 50, y: 85, r: 5, s: 1, z: 6 },
    ];

    const generateStickers = predefinedStickers.map((pos, i) => ({
      x: pos.x,
      y: pos.y,
      rotation: pos.r,
      scale: pos.s * stickerScaleMultiplier,
      // Placeholder abstract shapes for stickers to avoid external image dependencies
      imageUrl: \`https://picsum.photos/seed/\${i * 100}/200/200\`,
      delay: i * 0.1,
      zIndex: pos.z,
    }));

    const stickersTimeout = setTimeout(() => setStickers(generateStickers), 0);
    return () => {
      clearTimeout(timeout);
      clearTimeout(stickersTimeout);
    };
  }, [stickerScaleMultiplier]);

  if (!isMounted) return <div className="w-full h-[600px] bg-[#f0f0f0]" />;

  return (
    <div 
      className={\`relative w-full h-[600px] overflow-hidden rounded-xl flex items-center justify-center \${className}\`}
      style={{
        backgroundColor: bg,
        ...style
      }}
      {...props}
    >
      {/* Background Paper Texture */}
      <div
        className="absolute inset-0 opacity-40 mix-blend-multiply pointer-events-none"
        style={{ backgroundImage: "url('https://grainy-gradients.vercel.app/noise.svg')" }}
      />

      {/* Grid pattern overlay */}
      <div
        className="absolute inset-0 pointer-events-none"
        style={{
          opacity: gridOpacity,
          backgroundImage: "linear-gradient(#000 1px, transparent 1px), linear-gradient(90deg, #000 1px, transparent 1px)",
          backgroundSize: "40px 40px"
        }}
      />

      {/* Stickers */}
      {stickers.map((sticker, i) => (
        <motion.div
          key={i}
          initial={{ opacity: 0, scale: 0, rotate: sticker.rotation - 30 }}
          animate={{ opacity: 1, scale: sticker.scale, rotate: sticker.rotation }}
          transition={{
            type: "spring",
            stiffness: 260,
            damping: 20,
            delay: sticker.delay,
          }}
          whileHover={{
            scale: sticker.scale * 1.1,
            rotate: sticker.rotation + (i % 2 === 0 ? 10 : -10),
            zIndex: 50,
            boxShadow: "0px 20px 25px -5px rgba(0, 0, 0, 0.3)",
          }}
          whileTap={{ scale: sticker.scale * 0.95 }}
          className="absolute origin-center cursor-grab active:cursor-grabbing"
          style={{
            left: \`\${sticker.x}%\`,
            top: \`\${sticker.y}%\`,
            zIndex: sticker.zIndex,
            // Torn paper styling
            filter: "drop-shadow(2px 4px 6px rgba(0,0,0,0.15))",
          }}
          drag={dragFree}
          dragConstraints={{ left: -50, right: 50, top: -50, bottom: 50 }}
        >
          <div className="relative p-2 bg-white rounded-sm transform-gpu">
             {/* Masking tape effect */}
             {i % 2 === 0 && (
                <div className="absolute -top-3 left-1/2 -translate-x-1/2 w-12 h-6 bg-white/60 backdrop-blur-sm -rotate-3 border border-white/20 shadow-sm z-10" />
             )}

             {/* Sticker Content - Abstract gradient blocks instead of external images for reliability */}
             <div
                className="w-32 h-32 md:w-40 md:h-40 rounded-sm"
                style={{
                  background: i % 3 === 0
                    ? \`linear-gradient(135deg, \${primaryColor}, #ff8a98)\`
                    : i % 3 === 1
                      ? \`linear-gradient(135deg, \${secondaryColor}, #aaff99)\`
                      : \`linear-gradient(135deg, \${accentColor}, #333333)\`,
                  maskImage: i % 2 === 0 ? "radial-gradient(circle, black 50%, transparent 100%)" : "none",
                  WebkitMaskImage: i % 2 === 0 ? "radial-gradient(circle, black 80%, transparent 100%)" : "none",
                }}
             >
                <div className="w-full h-full flex items-center justify-center font-black text-4xl text-white/50 mix-blend-overlay" style={{ fontFamily: "var(--font-londrina-solid)" }}>
                  #{i + 1}
                </div>
             </div>
          </div>
        </motion.div>
      ))}

      {/* Optional Foreground Card or Custom Children */}
      {children ? (
        <div className="relative z-10">{children}</div>
      ) : titleText ? (
        <div className="relative z-0 pointer-events-none flex flex-col items-center">
          <h2 className="text-5xl md:text-7xl font-black text-[#111] uppercase tracking-tighter mix-blend-color-burn" style={{ fontFamily: "var(--font-londrina-solid)" }}>
            {titleText}
          </h2>
        </div>
      ) : null}
    </div>
  );
};
`,
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
      id: "sticker-stack-text",
      slug: "sticker-stack-text",
      title: "Sticker Stack Text",
      description: "Transparent layered sticker-style type cards that fan open with springy Gen-Z poster energy and bold MelonUI color blocking.",
      category: "GSAP Text",
      tags: ["Framer Motion", "Typography", "Stickers", "Spring"],
      cliCommand: "npx @melonui-dev/cli add sticker-stack-text",
      codeSnippet: `"use client";

import React, { useMemo, useState } from "react";
import { motion } from "framer-motion";

export interface StickerLayer {
  label: string;
  color: string;
}

export interface StickerStackTextProps extends React.ComponentPropsWithoutRef<"button"> {
  layers?: StickerLayer[];
  topText?: string;
  middleText?: string;
  bottomText?: string;
  topColor?: string;
  middleColor?: string;
  bottomColor?: string;
  hint?: string;
}

export function StickerStackText({
  layers,
  topText = "LOUD",
  middleText = "SOFT",
  bottomText = "TYPE",
  topColor = "#ff5c71",
  middleColor = "#f7f0d2",
  bottomColor = "#7fff5e",
  hint = "Hover to fan",
  className = "",
  style,
  ...props
}: StickerStackTextProps) {
  const [open, setOpen] = useState(false);
  const prepared = useMemo(
    () => {
      const source = layers ?? [
        { label: topText, color: topColor },
        { label: middleText, color: middleColor },
        { label: bottomText, color: bottomColor },
      ];

      return source.map((layer, index) => ({
        ...layer,
        x: [-92, 0, 92, 38, -38][index % 5],
        y: [-28, 2, 32, -50, 54][index % 5],
        rotate: [-7, 2, 7, 9, -9][index % 5],
        openX: [-148, 0, 148, 82, -82][index % 5],
        openY: [-44, -4, 44, -78, 78][index % 5],
        openRotate: [-11, 0, 11, 14, -14][index % 5],
      }));
    },
    [layers, topText, middleText, bottomText, topColor, middleColor, bottomColor]
  );

  return (
    <button
      type="button"
      aria-label="Sticker stack text"
      onPointerEnter={() => setOpen(true)}
      onPointerLeave={() => setOpen(false)}
      className={\`relative inline-grid min-h-[clamp(14rem,34vw,21rem)] w-full max-w-[980px] cursor-pointer place-items-center overflow-visible bg-transparent p-0 focus:outline-none focus-visible:ring-2 focus-visible:ring-[#ff5c71] \${className}\`}
      style={style}
      {...props}
      onClick={(e) => {
        setOpen((value) => !value);
        if (props.onClick) props.onClick(e);
      }}
    >
      {prepared.map((layer, index) => (
        <motion.span
          key={\`\${layer.label}-\${index}\`}
          className="absolute rounded-[8px] border border-black/30 px-[clamp(0.75rem,2vw,1.2rem)] py-[clamp(0.35rem,1vw,0.62rem)] shadow-[0_24px_48px_rgba(0,0,0,0.28)]"
          style={{ backgroundColor: layer.color, zIndex: index + 1 }}
          initial={false}
          animate={{
            x: open ? layer.openX : layer.x,
            y: open ? layer.openY : layer.y,
            rotate: open ? layer.openRotate : layer.rotate,
            scale: open ? 1.04 + index * 0.025 : 0.96 + index * 0.015,
          }}
          transition={{ type: "spring", stiffness: 260, damping: 20, delay: index * 0.025 }}
        >
          <span
            className="block text-[clamp(2.8rem,10vw,7rem)] uppercase leading-[0.78] text-black"
            style={{
              fontFamily: "var(--font-londrina-solid)",
              textShadow: "0 2px 0 rgba(255,255,255,0.22)",
            }}
          >
            {layer.label}
          </span>
          <span
            aria-hidden="true"
            className="absolute -right-3 -top-3 rounded-full border border-black/20 bg-black px-3 py-1 font-mono text-[9px] uppercase tracking-[0.18em] text-white"
          >
            0{index + 1}
          </span>
        </motion.span>
      ))}
      {hint && (
        <span className="absolute bottom-0 font-mono text-[10px] uppercase tracking-[0.2em] text-white/40">
          {hint}
        </span>
      )}
    </button>
  );
}
`,
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
      id: "sticker-wall",
      slug: "sticker-wall",
      title: "Sticker Wall",
      description: "Interactive Gen-Z editorial sticker grid that fans out, scales, and tilts dynamically on pointer hover.",
      category: "Backgrounds",
      tags: ["Framer Motion", "Stickers", "Brutalist"],
      cliCommand: "npx @melonui-dev/cli add sticker-wall",
      codeSnippet: `"use client";

import { useMemo } from "react";
import { motion } from "framer-motion";

export interface StickerItemInput {
  label: string;
  emoji?: string;
  color?: string;
}

export interface StickerWallProps extends React.ComponentPropsWithoutRef<"div"> {
  stickers?: StickerItemInput[] | string;
  stickerDensity?: number;
  scaleOnHover?: number;
  stickerTheme?: "melon" | "tech" | "mixed";
  bg?: string;
  borderColor?: string;
  titleText?: string;
  subtitleText?: string;
  textColor?: string;
}

interface StickerItem {
  id: number;
  label: string;
  emoji?: string;
  x: number; // percentage
  y: number; // percentage
  color: string;
  rotation: number;
}

const MELON_STICKERS = [
  { label: "MELON", emoji: "🍉", color: "#ff5c71" },
  { label: "SEED", emoji: "🌱", color: "#7fff5e" },
  { label: "JUICY", emoji: "💦", color: "#e8d5b7" },
  { label: "RIND", emoji: "🍈", color: "#7fff5e" },
  { label: "PRO", emoji: "⭐", color: "#ff5c71" },
  { label: "FRESH", emoji: "🍃", color: "#e8d5b7" },
  { label: "SLICE", emoji: "🔪", color: "#ff5c71" },
  { label: "SWEET", emoji: "🍭", color: "#7fff5e" },
];

const TECH_STICKERS = [
  { label: "REACT", emoji: "⚛️", color: "#00d8ff" },
  { label: "GSAP", emoji: "⚡", color: "#7fff5e" },
  { label: "CSS", emoji: "🎨", color: "#ff5c71" },
  { label: "R3F", emoji: "📦", color: "#e8d5b7" },
  { label: "NEXT.JS", emoji: "🌐", color: "#ffffff" },
  { label: "WEBGL", emoji: "🎮", color: "#7fff5e" },
  { label: "DEV", emoji: "💻", color: "#ff5c71" },
  { label: "BUILD", emoji: "🛠️", color: "#e8d5b7" },
];

const MIXED_STICKERS = [...MELON_STICKERS, ...TECH_STICKERS];

export function StickerWall({
  stickers: customStickers,
  stickerDensity = 12,
  scaleOnHover = 1.15,
  stickerTheme = "melon",
  bg = "#050505",
  borderColor = "#111",
  titleText = "",
  subtitleText = "",
  textColor = "rgba(255, 255, 255, 0.1)",
  className = "",
  style,
  children,
  ...props
}: StickerWallProps) {
  const stickers = useMemo(() => {
    let resolvedStickers: StickerItemInput[] = [];

    if (typeof customStickers === "string") {
      const trimmed = customStickers.trim();
      if (trimmed.startsWith("[") && trimmed.endsWith("]")) {
        try {
          resolvedStickers = JSON.parse(trimmed);
        } catch (e) {
          // fallback to comma-separated
        }
      }
      if (resolvedStickers.length === 0 && trimmed.length > 0) {
        // Parse comma-separated list of stickers, e.g. "🍉 MELON, 🌱 SEED"
        const parts = trimmed.split(",");
        resolvedStickers = parts
          .map(part => {
            const clean = part.trim();
            if (!clean) return null;
            // Match leading emoji characters like 🍉, ⚡, 💻, etc.
            const emojiMatch = clean.match(/^([\uD800-\uDBFF][\uDC00-\uDFFF]|\p{Emoji_Presentation}|\p{Emoji}\uFE0F?)\s*(.*)$/u);
            if (emojiMatch) {
              return {
                emoji: emojiMatch[1],
                label: emojiMatch[2].trim() || emojiMatch[1],
              };
            }
            return {
              label: clean,
            };
          })
          .filter(Boolean) as StickerItemInput[];
      }
    } else if (Array.isArray(customStickers)) {
      resolvedStickers = customStickers;
    }

    const source =
      resolvedStickers.length > 0
        ? resolvedStickers
        : stickerTheme === "melon"
        ? MELON_STICKERS
        : stickerTheme === "tech"
        ? TECH_STICKERS
        : MIXED_STICKERS;

    // Stable pseudo-random generator
    const pseudoRand = (seed: number) => {
      const x = Math.sin(seed * 9821.123 + 4381.54) * 10000;
      return x - Math.floor(x);
    };

    const count = resolvedStickers.length > 0 ? resolvedStickers.length : stickerDensity;
    const list: StickerItem[] = [];

    for (let i = 0; i < count; i++) {
      const item = source[i % source.length];
      const edge = i % 4; // 0: Top, 1: Right, 2: Bottom, 3: Left
      let x = 0;
      let y = 0;

      const randomVal = pseudoRand(i + 1);
      const insetVal = 5 + pseudoRand(i + 2) * 8; // 5% to 13% inset from edges

      if (edge === 0) {
        x = 5 + randomVal * 90;
        y = insetVal;
      } else if (edge === 1) {
        x = 100 - insetVal - 15;
        y = 10 + randomVal * 80;
      } else if (edge === 2) {
        x = 5 + randomVal * 90;
        y = 100 - insetVal - 15;
      } else {
        x = insetVal;
        y = 10 + randomVal * 80;
      }

      const colors = ["#ff5c71", "#7fff5e", "#e8d5b7", "#444444"];
      const color = item.color || colors[Math.floor(pseudoRand(i + 3) * colors.length)];
      const rotation = (pseudoRand(i + 5) - 0.5) * 28; // -14 to 14 deg

      list.push({
        id: i,
        label: item.label,
        emoji: item.emoji,
        x,
        y,
        color,
        rotation,
      });
    }
    return list;
  }, [customStickers, stickerDensity, stickerTheme]);

  return (
    <div 
      className={\`w-full h-full min-h-[350px] relative overflow-hidden p-6 select-none \${className}\`}
      style={{
        border: \`1px solid \${borderColor}\`,
        backgroundColor: bg,
        ...style
      }}
      {...props}
    >
      {/* Editorial Grid Backing */}
      <div 
        className="absolute inset-0 opacity-[0.02] pointer-events-none" 
        style={{
          backgroundImage: \`
            linear-gradient(to right, #fff 1px, transparent 1px),
            linear-gradient(to bottom, #fff 1px, transparent 1px)
          \`,
          backgroundSize: "40px 40px"
        }}
      />
      
      {/* Clean central area placeholder indicator */}
      <div className="absolute inset-0 flex flex-col items-center justify-center pointer-events-none px-12 text-center">
        {titleText && (
          <h1 
            className="text-2xl md:text-4xl font-black uppercase tracking-tight" 
            style={{ 
              fontFamily: "var(--font-Outfit), sans-serif",
              color: textColor 
            }}
          >
            {titleText}
          </h1>
        )}
        {subtitleText && (
          <p className="text-[10px] font-mono uppercase tracking-[0.2em] text-white/20 mt-2">
            {subtitleText}
          </p>
        )}
      </div>

      {children && (
        <div className="absolute inset-0 flex flex-col items-center justify-center px-12 text-center pointer-events-auto z-10">
          {children}
        </div>
      )}

      {stickers.map((s) => (
        <motion.div
          key={s.id}
          className="absolute cursor-pointer p-2.5 rounded-[8px] border-2 border-white bg-[#0d0d0d] flex items-center gap-2 select-none"
          style={{
            left: \`\${s.x}%\`,
            top: \`\${s.y}%\`,
            boxShadow: \`5px 5px 0px 0px \${s.color}\`,
          }}
          initial={{ scale: 0, rotate: 0, y: 0 }}
          animate={{
            scale: 1,
            rotate: s.rotation,
            y: [0, -6, 0],
          }}
          transition={{
            y: {
              repeat: Infinity,
              repeatType: "reverse",
              duration: 2.2 + (s.id % 3) * 0.8,
              ease: "easeInOut",
            },
            scale: {
              type: "spring",
              stiffness: 260,
              damping: 20,
              delay: s.id * 0.02,
            },
            rotate: {
              type: "spring",
              stiffness: 260,
              damping: 20,
              delay: s.id * 0.02,
            }
          }}
          whileHover={{
            scale: scaleOnHover,
            rotate: s.rotation + (s.rotation > 0 ? 6 : -6),
            zIndex: 50,
            boxShadow: \`7px 7px 0px 0px \${s.color}\`,
          }}
        >
          {s.emoji && <span className="text-sm">{s.emoji}</span>}
          <span 
            className="font-black text-[10px] tracking-wider font-mono text-[#f4f4f4]"
            style={{ fontFamily: "var(--font-Outfit), monospace" }}
          >
            {s.label}
          </span>
        </motion.div>
      ))}
    </div>
  );
}
`,
      componentPath: "StickerWall",
      props: [
        { name: "stickers", type: "string", defaultValue: `"≡ƒìë MELON, ≡ƒî▒ SEED, ≡ƒÆª JUICY, ≡ƒìê RIND, Γ¡É PRO, ≡ƒìâ FRESH, ≡ƒö¬ SLICE, ≡ƒì¡ SWEET"`, description: "Custom comma-separated list of stickers: 'Emoji Label, Emoji Label, ...'", control: { type: "text" } },
        { name: "stickerDensity", type: "number", defaultValue: "12", description: "Number of stickers scattered on the wall.", control: { type: "slider", min: 4, max: 24, step: 1 } },
        { name: "scaleOnHover", type: "number", defaultValue: "1.15", description: "Scale enlargement factor on hover.", control: { type: "slider", min: 1.0, max: 1.4, step: 0.05 } },
        { name: "stickerTheme", type: "string", defaultValue: `"melon"`, description: "Sticker label presets: 'melon', 'tech', or 'mixed'.", control: { type: "text" } }
      ]
    },
  {
      id: "stripe-wipe",
      slug: "stripe-wipe",
      title: "Stripe Wipe",
      description: "A colored stripe sweeps across the viewport to mask route changes.",
      category: "Page Transitions",
      tags: ["GSAP", "Timeline"],
      cliCommand: "npx @melonui-dev/cli add stripe-wipe",
      codeSnippet: `"use client";

import { useRef, useState, useEffect } from "react";
import gsap from "gsap";

export interface RindWipeTransitionProps extends React.ComponentPropsWithoutRef<"div"> {
  global?: boolean;
  trigger?: boolean;
  onHalfComplete?: () => void;
  onComplete?: () => void;
  gradient?: string;
  text?: string;
  textColor?: string;
  duration?: number;
  holdDelay?: number;
  buttonLabel?: string;
  buttonColor?: string;
  buttonTextColor?: string;
  borderColor?: string;
  demoContent?: React.ReactNode;
}

export function RindWipeTransition({
  global = false,
  trigger = false,
  onHalfComplete,
  onComplete,
  gradient = "linear-gradient(90deg, #7fff5e 0%, #4dc43f 50%, #7fff5e 100%)",
  text = "🍉 MelonUI",
  textColor = "#050505",
  duration = 0.55,
  holdDelay = 0.3,
  buttonLabel = "Trigger Wipe →",
  buttonColor = "#ff5c71",
  buttonTextColor = "#050505",
  borderColor = "#1e1e1e",
  demoContent = "Page Content Here",
  className = "",
  style,
  ...props
}: RindWipeTransitionProps) {
  const wipeRef = useRef<HTMLDivElement>(null);
  const [isRunning, setIsRunning] = useState(false);

  const runWipe = () => {
    if (isRunning || !wipeRef.current) return;
    setIsRunning(true);

    const tl = gsap.timeline({
      onComplete: () => {
        setIsRunning(false);
        onComplete?.();
      },
    });

    // Sweep in
    tl.set(wipeRef.current, { x: "-100%", display: "flex" })
      .to(wipeRef.current, {
        x: "0%",
        duration: duration,
        ease: "power3.inOut",
      })
      .call(() => {
        onHalfComplete?.();
      })
      // Hold
      .to(wipeRef.current, {
        x: "100%",
        duration: duration,
        ease: "power3.inOut",
        delay: holdDelay,
      })
      .set(wipeRef.current, { display: "none" });
  };

  useEffect(() => {
    if (trigger) {
      runWipe();
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [trigger]);

  // If in global mode, render only the portal-like full-screen absolute/fixed wipe overlay
  if (global) {
    return (
      <div
        ref={wipeRef}
        className={\`fixed inset-0 z-[9999] flex-col items-center justify-center pointer-events-none \${className}\`}
        style={{
          display: "none",
          background: gradient,
          ...style
        }}
        {...props}
      >
        <span
          className="font-black text-4xl uppercase"
          style={{ fontFamily: "var(--font-anton)", color: textColor }}
        >
          {text}
        </span>
      </div>
    );
  }

  // Local demo container
  return (
    <div
      className={\`relative w-full flex flex-col items-center gap-6 overflow-hidden \${className}\`}
      style={style}
      {...props}
    >
      {/* Demo viewport */}
      <div
        className="relative w-full max-w-sm h-40 overflow-hidden flex items-center justify-center bg-transparent"
        style={{ border: \`1px solid \${borderColor}\` }}
      >
        <div className="font-mono text-[#555] text-sm">{demoContent}</div>

        {/* Wipe element */}
        <div
          ref={wipeRef}
          className="absolute inset-0 z-10 flex-col items-center justify-center"
          style={{
            display: "none",
            background: gradient,
          }}
        >
          <span
            className="font-black text-2xl uppercase"
            style={{ fontFamily: "var(--font-anton)", color: textColor }}
          >
            {text}
          </span>
        </div>

        {/* Rind stripe overlay decoration */}
        <div className="absolute top-0 inset-x-0 h-1.5 bg-[#1a1a1a]" />
        <div className="absolute bottom-0 inset-x-0 h-1.5 bg-[#1a1a1a]" />
      </div>

      <button
        onClick={runWipe}
        disabled={isRunning}
        className="px-8 py-3 font-black uppercase tracking-widest text-sm disabled:opacity-50 transition-opacity"
        style={{
          fontFamily: "var(--font-anton)",
          backgroundColor: buttonColor,
          color: buttonTextColor,
        }}
      >
        {isRunning ? "Wiping..." : buttonLabel}
      </button>

      <p className="font-mono text-xs text-[#444]">Click to simulate a route transition</p>
    </div>
  );
}
`,
      componentPath: "RindWipeTransition",
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
    },
  {
      id: "tag-input",
      slug: "tag-input",
      title: "Tag Input",
      description: "Animated tag management ΓÇö press Enter or comma to add, backspace to remove.",
      category: "Inputs",
      tags: ["GSAP", "Input"],
      cliCommand: "npx @melonui-dev/cli add tag-input",
      codeSnippet: `"use client";

import { useState, useRef, KeyboardEvent } from "react";
import gsap from "gsap";

export interface TagInputProps extends Omit<React.ComponentPropsWithoutRef<"div">, "onChange"> {
  tags?: string[];
  onChange?: (tags: string[]) => void;
  presetTags?: string[];
  maxTags?: number;
  placeholder?: string;
  borderColor?: string;
  focusBorderColor?: string;
  tagBgColor?: string;
  tagTextColor?: string;
  tagBorderColor?: string;
  removeButtonColor?: string;
  removeButtonHoverColor?: string;
  presetButtonColor?: string;
  presetButtonHoverColor?: string;
}

export function TagInput({
  tags: controlledTags,
  onChange,
  presetTags = ["gsap", "three.js", "react", "tailwind"],
  maxTags = 6,
  placeholder = "Add tag...",
  
  borderColor = "#1e1e1e",
  focusBorderColor = "rgba(255, 92, 113, 0.4)",
  tagBgColor = "#111",
  tagTextColor = "#aaa",
  tagBorderColor = "#222",
  removeButtonColor = "#444",
  removeButtonHoverColor = "#ff5c71",
  presetButtonColor = "#444",
  presetButtonHoverColor = "#ff5c71",
  
  className = "",
  style,
  ...props
}: TagInputProps) {
  const [localTags, setLocalTags] = useState<string[]>(["animation"]);
  const [value, setValue] = useState("");
  const containerRef = useRef<HTMLDivElement>(null);

  const tags = controlledTags ?? localTags;

  const updateTags = (newTags: string[]) => {
    if (controlledTags !== undefined) {
      onChange?.(newTags);
    } else {
      setLocalTags(newTags);
      onChange?.(newTags);
    }
  };

  const addTag = (tag: string) => {
    const trimmed = tag.trim().toLowerCase();
    if (!trimmed || tags.includes(trimmed) || tags.length >= maxTags) return;
    updateTags([...tags, trimmed]);
    setValue("");

    // Animate new tag in
    setTimeout(() => {
      const newTag = containerRef.current?.querySelector(\`[data-tag="\${trimmed}"]\`) as HTMLElement;
      if (newTag) {
        gsap.from(newTag, { scale: 0, opacity: 0, duration: 0.3, ease: "back.out(2)" });
      }
    }, 10);
  };

  const removeTag = (tag: string) => {
    const el = containerRef.current?.querySelector(\`[data-tag="\${tag}"]\`) as HTMLElement;
    if (el) {
      gsap.to(el, {
        scale: 0,
        opacity: 0,
        duration: 0.2,
        ease: "power2.in",
        onComplete: () => updateTags(tags.filter((t) => t !== tag)),
      });
    } else {
      updateTags(tags.filter((t) => t !== tag));
    }
  };

  const handleKey = (e: KeyboardEvent<HTMLInputElement>) => {
    if (e.key === "Enter" || e.key === ",") {
      e.preventDefault();
      addTag(value);
    } else if (e.key === "Backspace" && !value && tags.length) {
      removeTag(tags[tags.length - 1]);
    }
  };

  return (
    <div
      className={\`flex flex-col gap-5 w-full max-w-sm \${className}\`}
      style={style}
      {...props}
    >
      {/* Tag container */}
      <div
        ref={containerRef}
        className="flex flex-wrap gap-2 p-3 border min-h-[52px] transition-colors focus-within:border-[var(--focus-border)]"
        style={{
          borderColor: borderColor,
          "--focus-border": focusBorderColor,
        } as React.CSSProperties}
      >
        {tags.map((tag) => (
          <span
            key={tag}
            data-tag={tag}
            className="flex items-center gap-1.5 px-2.5 py-1 border font-mono text-xs"
            style={{
              backgroundColor: tagBgColor,
              borderColor: tagBorderColor,
              color: tagTextColor,
            }}
          >
            {tag}
            <button
              onClick={() => removeTag(tag)}
              className="transition-colors leading-none font-bold"
              style={{
                color: removeButtonColor,
              }}
              onMouseEnter={(e) => {
                e.currentTarget.style.color = removeButtonHoverColor;
              }}
              onMouseLeave={(e) => {
                e.currentTarget.style.color = removeButtonColor;
              }}
            >
              ×
            </button>
          </span>
        ))}
        <input
          value={value}
          onChange={(e) => setValue(e.target.value)}
          onKeyDown={handleKey}
          placeholder={tags.length < maxTags ? placeholder : \`Max \${maxTags} tags\`}
          disabled={tags.length >= maxTags}
          className="flex-1 min-w-[80px] bg-transparent font-mono text-xs text-[#888] placeholder:text-[#333] outline-none"
        />
      </div>

      {/* Quick-add presets */}
      <div className="flex gap-2 flex-wrap">
        {presetTags.filter((t) => !tags.includes(t)).map((preset) => (
          <button
            key={preset}
            onClick={() => addTag(preset)}
            className="font-mono text-[10px] uppercase tracking-wider border px-2 py-1 transition-all"
            style={{
              color: presetButtonColor,
              borderColor: borderColor,
            }}
            onMouseEnter={(e) => {
              e.currentTarget.style.color = presetButtonHoverColor;
              e.currentTarget.style.borderColor = presetButtonHoverColor;
            }}
            onMouseLeave={(e) => {
              e.currentTarget.style.color = presetButtonColor;
              e.currentTarget.style.borderColor = borderColor;
            }}
          >
            + {preset}
          </button>
        ))}
      </div>
    </div>
  );
}
`,
      componentPath: "TagInput",
    }
  ,{
      id: "terminal-cursor",
      slug: "terminal-cursor",
      title: "Terminal Cursor",
      description: "A precision spring-velocity cursor containing crosshair ticks and vector neon glow.",
      category: "Cursors",
      tags: ["Framer Motion", "Spring", "Cursor", "Precision"],
      cliCommand: "npx @melonui-dev/cli add terminal-cursor",
      codeSnippet: `"use client";

import React, { useEffect, useRef, useState } from "react";
import { createPortal } from "react-dom";
import { motion, useMotionValue, useSpring } from "framer-motion";

export interface TerminalCursorProps extends React.ComponentPropsWithoutRef<"div"> {
  containerRef?: React.RefObject<HTMLElement | null>;
  color?: string;
  size?: number;
  global?: boolean;
}

export function TerminalCursor({
  containerRef,
  color = "#7fff5e",
  size = 20,
  global = false,
  className = "",
  style,
  ...props
}: TerminalCursorProps) {
  const localRef = useRef<HTMLDivElement>(null);
  const [isInside, setIsInside] = useState(false);
  const [mounted, setMounted] = useState(false);

  // Mouse coordinate motion values
  const mouseX = useMotionValue(-100);
  const mouseY = useMotionValue(-100);

  // Smooth springs for tracking
  const springConfig = { damping: 25, stiffness: 350, mass: 0.5 };
  const smoothX = useSpring(mouseX, springConfig);
  const smoothY = useSpring(mouseY, springConfig);

  useEffect(() => {
    setMounted(true);
  }, []);

  useEffect(() => {
    if (!mounted) return;

    // Determine listener target
    let target: HTMLElement | Window = window;
    if (!global) {
      target = containerRef ? containerRef.current || window : localRef.current?.parentElement || window;
    }

    if (!target) return;

    const el = target as HTMLElement;

    // Hide normal cursor
    const originalCursor = el.style ? el.style.cursor : "";
    if (el.style) el.style.cursor = "none";

    const handleMouseMove = (e: Event) => {
      const mouseEvent = e as MouseEvent;
      if (global || target === window) {
        mouseX.set(mouseEvent.clientX);
        mouseY.set(mouseEvent.clientY);
      } else {
        const rect = el.getBoundingClientRect();
        mouseX.set(mouseEvent.clientX - rect.left);
        mouseY.set(mouseEvent.clientY - rect.top);
      }
    };

    const handleMouseEnter = () => setIsInside(true);
    const handleMouseLeave = () => setIsInside(false);

    if (global || target === window) {
      window.addEventListener("mousemove", handleMouseMove);
      document.body.addEventListener("mouseenter", handleMouseEnter);
      document.body.addEventListener("mouseleave", handleMouseLeave);
      setIsInside(true);
    } else {
      el.addEventListener("mousemove", handleMouseMove);
      el.addEventListener("mouseenter", handleMouseEnter);
      el.addEventListener("mouseleave", handleMouseLeave);
      // Determine if initial pointer is inside bounds
      setIsInside(true);
    }

    return () => {
      if (global || target === window) {
        window.removeEventListener("mousemove", handleMouseMove);
        document.body.removeEventListener("mouseenter", handleMouseEnter);
        document.body.removeEventListener("mouseleave", handleMouseLeave);
      } else {
        el.removeEventListener("mousemove", handleMouseMove);
        el.removeEventListener("mouseenter", handleMouseEnter);
        el.removeEventListener("mouseleave", handleMouseLeave);
      }
      if (el.style) el.style.cursor = originalCursor;
    };
  }, [containerRef, global, mounted]);

  const cursorElement = (
    <motion.div
      className="pointer-events-none mix-blend-screen flex items-center justify-center z-[9999]"
      style={{
        position: global ? "fixed" : "absolute",
        left: 0,
        top: 0,
        x: smoothX,
        y: smoothY,
        translateX: "-50%",
        translateY: "-50%",
        display: isInside ? "flex" : "none",
      }}
    >
      <div 
        className="rounded-full flex items-center justify-center relative border transition-colors duration-300"
        style={{
          width: size,
          height: size,
          borderColor: \`\${color}80\`,
          boxShadow: \`0 0 10px \${color}33\`,
        }}
      >
        {/* Center dot */}
        <div 
          className="w-1.5 h-1.5 rounded-full"
          style={{ backgroundColor: color, boxShadow: \`0 0 8px \${color}\` }}
        />
        
        {/* Crosshair ticks */}
        <div 
          className="absolute w-[1px] h-2 -top-2.5 left-1/2 -translate-x-1/2" 
          style={{ backgroundColor: \`\${color}cc\` }} 
        />
        <div 
          className="absolute w-[1px] h-2 -bottom-2.5 left-1/2 -translate-x-1/2" 
          style={{ backgroundColor: \`\${color}cc\` }} 
        />
        <div 
          className="absolute w-2 h-[1px] -left-2.5 top-1/2 -translate-y-1/2" 
          style={{ backgroundColor: \`\${color}cc\` }} 
        />
        <div 
          className="absolute w-2 h-[1px] -right-2.5 top-1/2 -translate-y-1/2" 
          style={{ backgroundColor: \`\${color}cc\` }} 
        />
      </div>
    </motion.div>
  );

  // Return portal if global viewport tracking is enabled
  if (global && mounted) {
    return createPortal(cursorElement, document.body);
  }

  // Local containment wrapper
  return (
    <div
      ref={localRef}
      className={\`absolute inset-0 pointer-events-none overflow-hidden z-[9999] \${className}\`}
      style={{ display: "block", ...style }}
      {...props}
    >
      {cursorElement}
    </div>
  );
}
`,
      componentPath: "TerminalCursor",
  },
{
      id: "zero-gravity-shards",
      slug: "zero-gravity-shards",
      title: "Zero Gravity Shards",
      description: "A highly interactive 'zero gravity' shard interface where glassmorphic cards drift organically using Framer Motion physics, snap to the cursor on hover, and seamlessly morph into full-screen bento grids using layoutId when clicked.",
      category: "Cards",
      tags: ["Framer Motion", "Morphing", "Layout ID", "Interactive", "Zero Gravity", "Bento"],
      cliCommand: "npx @melonui-dev/cli add zero-gravity-shards",
      codeSnippet: `"use client";

import React, { useState, useEffect, useRef } from "react";
import { motion, AnimatePresence, useMotionValue, useSpring, useTransform, HTMLMotionProps, MotionValue } from "framer-motion";

export interface ShardData {
  id: string;
  title: string;
  subtitle: string;
  icon: React.ReactNode;
  content: React.ReactNode;
  color: string;
  initialX: number;
  initialY: number;
  rotation: number;
}

export interface ZeroGravityShardsProps extends Omit<HTMLMotionProps<"div">, "children"> {
  shards?: ShardData[];
  coreLabel?: string;
  coreSublabel?: string;
  glowColor?: string;
}

const DEFAULT_SHARDS: ShardData[] = [
  {
    id: "shard-1",
    title: "Neural Core",
    subtitle: "Active",
    color: "#7fff5e",
    initialX: -150,
    initialY: -120,
    rotation: -10,
    icon: (
      <svg width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round">
        <path d="M18 20a6 6 0 0 0-12 0" />
        <circle cx="12" cy="10" r="4" />
        <circle cx="12" cy="12" r="10" />
      </svg>
    ),
    content: (
      <div className="flex flex-col gap-4 text-white w-full h-full">
        <div className="flex justify-between items-center pb-4 border-b border-white/10">
          <div>
            <h4 className="text-xl font-bold font-['Outfit']">System Status</h4>
            <p className="text-sm text-white/50">All nodes operational</p>
          </div>
          <div className="w-10 h-10 rounded-full bg-[#7fff5e]/20 flex items-center justify-center text-[#7fff5e]">
            <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2"><path d="M22 11.08V12a10 10 0 1 1-5.93-9.14"/><polyline points="22 4 12 14.01 9 11.01"/></svg>
          </div>
        </div>
        <div className="grid grid-cols-2 gap-4 mt-4">
          <div className="p-4 rounded-xl bg-white/5 border border-white/5">
            <p className="text-xs text-white/40 mb-1">LATENCY</p>
            <p className="text-2xl font-mono text-[#7fff5e]">12ms</p>
          </div>
          <div className="p-4 rounded-xl bg-white/5 border border-white/5">
            <p className="text-xs text-white/40 mb-1">THROUGHPUT</p>
            <p className="text-2xl font-mono text-white">4.2k/s</p>
          </div>
        </div>
      </div>
    )
  },
  {
    id: "shard-2",
    title: "Quantum Link",
    subtitle: "Encrypted",
    color: "#ff5c71",
    initialX: 180,
    initialY: -80,
    rotation: 15,
    icon: (
      <svg width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round">
        <rect x="3" y="11" width="18" height="11" rx="2" ry="2"></rect>
        <path d="M7 11V7a5 5 0 0 1 10 0v4"></path>
      </svg>
    ),
    content: (
      <div className="flex flex-col h-full w-full justify-between">
        <h4 className="text-xl font-bold text-white mb-4">Security Overview</h4>
        <div className="flex-1 rounded-xl bg-black/40 border border-white/10 p-4 relative overflow-hidden">
          <div className="absolute inset-0 bg-[url('data:image/svg+xml;base64,PHN2ZyB4bWxucz0iaHR0cDovL3d3dy53My5vcmcvMjAwMC9zdmciIHdpZHRoPSI4IiBoZWlnaHQ9IjgiPjxyZWN0IHdpZHRoPSI4IiBoZWlnaHQ9IjgiIGZpbGw9IiNmZmZmZmYiIGZpbGwtb3BhY2l0eT0iMC4wNSIvPjwvc3ZnPg==')] opacity-20"></div>
          <div className="relative z-10 flex flex-col gap-2 font-mono text-sm">
            <div className="flex justify-between text-white/70"><span>Protocol</span><span className="text-[#ff5c71]">AES-256</span></div>
            <div className="flex justify-between text-white/70"><span>Handshake</span><span className="text-white">Success</span></div>
            <div className="flex justify-between text-white/70"><span>Entropy</span><span className="text-[#7fff5e]">High</span></div>
          </div>
        </div>
      </div>
    )
  },
  {
    id: "shard-3",
    title: "Void Cache",
    subtitle: "Synchronizing",
    color: "#00f0ff",
    initialX: -120,
    initialY: 160,
    rotation: -25,
    icon: (
      <svg width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round">
        <ellipse cx="12" cy="5" rx="9" ry="3"></ellipse>
        <path d="M21 12c0 1.66-4 3-9 3s-9-1.34-9-3"></path>
        <path d="M3 5v14c0 1.66 4 3 9 3s9-1.34 9-3V5"></path>
      </svg>
    ),
    content: (
      <div className="flex flex-col items-center justify-center h-full text-center">
        <div className="w-16 h-16 rounded-full border-4 border-[#00f0ff]/30 border-t-[#00f0ff] animate-spin mb-6"></div>
        <h3 className="text-2xl font-bold text-white mb-2">Syncing Data</h3>
        <p className="text-white/50 text-sm">Transferring assets across nodes</p>
      </div>
    )
  },
  {
    id: "shard-4",
    title: "Omni-Grid",
    subtitle: "Expanded",
    color: "#e8d5b7",
    initialX: 160,
    initialY: 140,
    rotation: 12,
    icon: (
      <svg width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round">
        <rect x="3" y="3" width="7" height="7"></rect>
        <rect x="14" y="3" width="7" height="7"></rect>
        <rect x="14" y="14" width="7" height="7"></rect>
        <rect x="3" y="14" width="7" height="7"></rect>
      </svg>
    ),
    content: (
      <div className="grid grid-cols-3 grid-rows-3 gap-2 h-full w-full">
        {[...Array(9)].map((_, i) => (
          <div key={i} className="bg-white/5 rounded-lg border border-white/5 flex items-center justify-center hover:bg-white/10 transition-colors">
            <div className="w-2 h-2 rounded-full bg-[#e8d5b7]/50" />
          </div>
        ))}
      </div>
    )
  }
];


const ShardNode: React.FC<{
  shard: ShardData;
  i: number;
  activeShard: string | null;
  setActiveShard: (id: string | null) => void;
  isCoreActive: boolean;
  smoothMouseX: MotionValue<number>;
  smoothMouseY: MotionValue<number>;
}> = ({
  shard,
  i,
  activeShard,
  setActiveShard,
  isCoreActive,
  smoothMouseX,
  smoothMouseY
}) => {
  const parallaxX = useTransform(smoothMouseX, (val) => (val as number) * (shard.initialX / 500));
  const parallaxY = useTransform(smoothMouseY, (val) => (val as number) * (shard.initialY / 500));

  const floatY = {
    y: [0, -10, 0],
    transition: {
      duration: 4 + i,
      repeat: Infinity,
      ease: "easeInOut",
      delay: i * 0.5
    }
  };

  const isActive = activeShard === shard.id;
  const isDimmed = activeShard !== null && !isActive;

  return (
    <React.Fragment>
      <AnimatePresence>
        {!isActive && isCoreActive && (
          <motion.div
            layoutId={\`shard-container-\${shard.id}\`}
            className="absolute left-1/2 top-1/2 z-20 cursor-pointer"
            style={{
              x: \`calc(-50% + \${shard.initialX}px)\`,
              y: \`calc(-50% + \${shard.initialY}px)\`,
              translateX: parallaxX,
              translateY: parallaxY,
            }}
            initial={{ opacity: 0, scale: 0, rotate: 0 }}
            animate={{
              opacity: isDimmed ? 0 : 1,
              scale: isDimmed ? 0.8 : 1,
              rotate: shard.rotation,
              /* eslint-disable-next-line @typescript-eslint/no-explicit-any */
              ...(floatY as any)
            }}
            exit={{ opacity: 0, scale: 0.5, transition: { duration: 0.2 } }}
            onClick={() => setActiveShard(shard.id)}
            whileHover={{ scale: 1.1, rotate: 0, zIndex: 30 }}
          >
            <motion.div
              layoutId={\`shard-bg-\${shard.id}\`}
              className="w-48 p-4 rounded-2xl bg-black/60 backdrop-blur-xl border border-white/10 shadow-2xl relative overflow-hidden group"
            >
              {/* Inner highlight */}
              <div className="absolute inset-0 bg-gradient-to-br from-white/5 to-transparent opacity-0 group-hover:opacity-100 transition-opacity" />

              {/* Color glow hint */}
              <div className="absolute -top-10 -right-10 w-20 h-20 rounded-full blur-2xl opacity-30" style={{ backgroundColor: shard.color }} />

              <div className="flex items-center gap-3 relative z-10">
                <motion.div
                  layoutId={\`shard-icon-\${shard.id}\`}
                  className="w-10 h-10 rounded-xl bg-white/5 border border-white/10 flex items-center justify-center"
                  style={{ color: shard.color }}
                >
                  {shard.icon}
                </motion.div>
                <div>
                  <motion.h4 layoutId={\`shard-title-\${shard.id}\`} className="text-sm font-bold text-white font-['Outfit']">{shard.title}</motion.h4>
                  <motion.p layoutId={\`shard-subtitle-\${shard.id}\`} className="text-[10px] text-white/50 uppercase tracking-wider">{shard.subtitle}</motion.p>
                </div>
              </div>
            </motion.div>
          </motion.div>
        )}
      </AnimatePresence>
    </React.Fragment>
  );
};

export function ZeroGravityShards({
  shards = DEFAULT_SHARDS,
  coreLabel = "Initialize",
  coreSublabel = "Core Offline",
  glowColor = "#7fff5e",
  className = "",
  ...props
}: ZeroGravityShardsProps) {
  const [activeShard, setActiveShard] = useState<string | null>(null);
  const [isCoreActive, setIsCoreActive] = useState(false);

  // Mouse position tracking
  const mouseX = useMotionValue(0);
  const mouseY = useMotionValue(0);

  // Smooth mouse coordinates for parallax
  const smoothMouseX = useSpring(mouseX, { stiffness: 50, damping: 20 });
  const smoothMouseY = useSpring(mouseY, { stiffness: 50, damping: 20 });

  const containerRef = useRef<HTMLDivElement>(null);

  const handleMouseMove = (e: React.MouseEvent) => {
    if (!containerRef.current) return;
    const rect = containerRef.current.getBoundingClientRect();
    const x = e.clientX - rect.left - rect.width / 2;
    const y = e.clientY - rect.top - rect.height / 2;
    mouseX.set(x);
    mouseY.set(y);
  };

  const handleMouseLeave = () => {
    mouseX.set(0);
    mouseY.set(0);
  };

  // Close active shard on escape key
  useEffect(() => {
    const handleKeyDown = (e: KeyboardEvent) => {
      if (e.key === "Escape" && activeShard) {
        setActiveShard(null);
      }
    };
    window.addEventListener("keydown", handleKeyDown);
    return () => window.removeEventListener("keydown", handleKeyDown);
  }, [activeShard]);

  return (
    <motion.div
      ref={containerRef}
      className={\`relative w-full h-[600px] bg-[#050505] overflow-hidden rounded-2xl flex items-center justify-center \${className}\`}
      onMouseMove={handleMouseMove}
      onMouseLeave={handleMouseLeave}
      {...props}
    >
      {/* Background Grid */}
      <div
        className="absolute inset-0 pointer-events-none opacity-20"
        style={{
          backgroundImage: \`
            linear-gradient(to right, rgba(255,255,255,0.05) 1px, transparent 1px),
            linear-gradient(to bottom, rgba(255,255,255,0.05) 1px, transparent 1px)
          \`,
          backgroundSize: '40px 40px'
        }}
      />

      {/* Ambient noise */}
      <div
        className="absolute inset-0 opacity-[0.03] mix-blend-overlay pointer-events-none"
        style={{
          backgroundImage: "url('data:image/svg+xml,%3Csvg viewBox=%220 0 200 200%22 xmlns=%22http://www.w3.org/2000/svg%22%3E%3Cfilter id=%22noiseFilter%22%3E%3CfeTurbulence type=%22fractalNoise%22 baseFrequency=%220.85%22 numOctaves=%223%22 stitchTiles=%22stitch%22/%3E%3C/filter%3E%3Crect width=%22100%25%22 height=%22100%25%22 filter=%22url(%23noiseFilter)%22/%3E%3C/svg%3E')"
        }}
      />

      {/* Center Core */}
      <motion.button
        className="relative z-10 w-32 h-32 rounded-full flex flex-col items-center justify-center border border-white/10 bg-black/50 backdrop-blur-md group"
        onClick={() => setIsCoreActive(!isCoreActive)}
        whileHover={{ scale: 1.05 }}
        whileTap={{ scale: 0.95 }}
      >
        <motion.div
          className="absolute inset-0 rounded-full blur-xl opacity-20 transition-opacity duration-500 group-hover:opacity-40"
          style={{ backgroundColor: isCoreActive ? glowColor : "#ffffff" }}
          animate={{
            scale: isCoreActive ? [1, 1.2, 1] : 1,
            opacity: isCoreActive ? [0.4, 0.8, 0.4] : 0.2
          }}
          transition={{ duration: 2, repeat: Infinity, ease: "easeInOut" }}
        />
        <div className="absolute inset-0 rounded-full border border-white/5 flex items-center justify-center">
          <svg className="w-full h-full opacity-30 animate-[spin_10s_linear_infinite]" viewBox="0 0 100 100">
            <circle cx="50" cy="50" r="48" fill="none" stroke="currentColor" strokeWidth="0.5" strokeDasharray="4 4" />
          </svg>
        </div>
        <span className="relative z-10 font-mono text-sm text-white uppercase tracking-widest group-hover:text-[#7fff5e] transition-colors">{coreLabel}</span>
        <span className="relative z-10 text-[10px] text-white/40 mt-1 uppercase tracking-wider">{isCoreActive ? "System Online" : coreSublabel}</span>
      </motion.button>

      {/* Floating Shards */}
      {shards.map((shard, i) => (
        <ShardNode
          key={shard.id}
          shard={shard}
          i={i}
          activeShard={activeShard}
          setActiveShard={setActiveShard}
          isCoreActive={isCoreActive}
          smoothMouseX={smoothMouseX}
          smoothMouseY={smoothMouseY}
        />
      ))}

      {/* Expanded Shard View */}
      <AnimatePresence>
        {activeShard && (
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            className="absolute inset-0 z-40 flex items-center justify-center p-6 bg-black/60 backdrop-blur-sm"
            onClick={() => setActiveShard(null)}
          >
            {shards.map((shard) => (
              shard.id === activeShard && (
                <motion.div
                  key={\`expanded-\${shard.id}\`}
                  layoutId={\`shard-container-\${shard.id}\`}
                  className="w-full max-w-2xl h-[400px] rounded-3xl bg-[#0a0a0a] border border-white/10 shadow-2xl overflow-hidden flex flex-col relative"
                  onClick={(e) => e.stopPropagation()}
                >
                  {/* Expanded ambient glow */}
                  <div className="absolute top-0 left-1/2 -translate-x-1/2 w-[150%] h-32 blur-3xl opacity-20 pointer-events-none" style={{ backgroundColor: shard.color }} />

                  {/* Header */}
                  <motion.div layoutId={\`shard-bg-\${shard.id}\`} className="flex items-center justify-between p-6 border-b border-white/10 bg-white/5 relative z-10">
                    <div className="flex items-center gap-4">
                      <motion.div
                        layoutId={\`shard-icon-\${shard.id}\`}
                        className="w-12 h-12 rounded-xl bg-black/50 border border-white/10 flex items-center justify-center shadow-inner"
                        style={{ color: shard.color }}
                      >
                        {shard.icon}
                      </motion.div>
                      <div>
                        <motion.h4 layoutId={\`shard-title-\${shard.id}\`} className="text-2xl font-bold text-white font-['Outfit']">{shard.title}</motion.h4>
                        <motion.p layoutId={\`shard-subtitle-\${shard.id}\`} className="text-sm text-white/50 uppercase tracking-widest">{shard.subtitle}</motion.p>
                      </div>
                    </div>
                    <button
                      onClick={() => setActiveShard(null)}
                      className="w-10 h-10 rounded-full bg-white/5 border border-white/10 flex items-center justify-center text-white/50 hover:text-white hover:bg-white/10 transition-all"
                    >
                      <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><line x1="18" y1="6" x2="6" y2="18"></line><line x1="6" y1="6" x2="18" y2="18"></line></svg>
                    </button>
                  </motion.div>

                  {/* Content Area */}
                  <div className="flex-1 p-8 relative z-10 overflow-y-auto">
                    <motion.div
                      initial={{ opacity: 0, y: 20 }}
                      animate={{ opacity: 1, y: 0 }}
                      transition={{ delay: 0.2 }}
                      className="h-full"
                    >
                      {shard.content}
                    </motion.div>
                  </div>
                </motion.div>
              )
            ))}
          </motion.div>
        )}
      </AnimatePresence>
    </motion.div>
  );
}
`,
      componentPath: "ZeroGravityShards",
      scrollable: false,
      usageCode: `import { ZeroGravityShards } from "@/components/ZeroGravityShards";

export default function App() {
  return (
    <ZeroGravityShards
      coreLabel="System"
      coreSublabel="Initialize Core"
      glowColor="#ff5c71"
    />
  );
}`,
      props: [
        { name: "coreLabel", type: "string", defaultValue: `"Initialize"`, description: "The label text on the central core button.", control: { type: "text" } },
        { name: "coreSublabel", type: "string", defaultValue: `"Core Offline"`, description: "The sublabel text on the central core button.", control: { type: "text" } },
        { name: "glowColor", type: "string", defaultValue: `"#7fff5e"`, description: "The glow color of the central core button.", control: { type: "color" } }
      ]
  },
{
      id: "neural-pattern-lock",
      slug: "neural-pattern-lock",
      title: "Neural Pattern Lock",
      description: "A highly interactive, 3D-tilting pattern lock screen with magnetic physics and glowing neon paths.",
      category: "Inputs",
      tags: ["Framer Motion", "3D", "Interactive", "Form"],
      cliCommand: "npx @melonui-dev/cli add neural-pattern-lock",
      codeSnippet: `"use client";

import React, { useRef, useState, useEffect } from "react";
import { motion, useMotionValue, useSpring, useTransform } from "framer-motion";

export interface NeuralPatternLockProps {
  className?: string;
  style?: React.CSSProperties;
  gridSize?: number;
  correctPattern?: number[];
  primaryColor?: string;
  successColor?: string;
  errorColor?: string;
  onSuccess?: () => void;
  onError?: () => void;
}

export function NeuralPatternLock({
  gridSize = 3,
  correctPattern = [0, 1, 2, 5, 8],
  primaryColor = "#7fff5e",
  successColor = "#00f0ff",
  errorColor = "#ff5c71",
  onSuccess,
  onError,
  className = "",
  style,
  ...props
}: NeuralPatternLockProps) {
  const containerRef = useRef<HTMLDivElement>(null);

  const [selectedNodes, setSelectedNodes] = useState<number[]>([]);
  const [isDrawing, setIsDrawing] = useState(false);
  const [status, setStatus] = useState<"idle" | "success" | "error">("idle");
  const [currentMousePos, setCurrentMousePos] = useState({ x: 0, y: 0 });
  const [nodePositions, setNodePositions] = useState<{ x: number; y: number }[]>([]);

  // 3D Tilt Effect
  const mouseX = useMotionValue(0);
  const mouseY = useMotionValue(0);

  const springConfig = { damping: 20, stiffness: 100, mass: 0.5 };
  const smoothMouseX = useSpring(mouseX, springConfig);
  const smoothMouseY = useSpring(mouseY, springConfig);

  const rotateX = useTransform(smoothMouseY, [-0.5, 0.5], [15, -15]);
  const rotateY = useTransform(smoothMouseX, [-0.5, 0.5], [-15, 15]);

  const handleMouseMove = (e: React.MouseEvent | React.TouchEvent) => {
    if (!containerRef.current) return;

    let clientX, clientY;
    if ("touches" in e) {
      clientX = e.touches[0].clientX;
      clientY = e.touches[0].clientY;
    } else {
      clientX = (e as React.MouseEvent).clientX;
      clientY = (e as React.MouseEvent).clientY;
    }

    const rect = containerRef.current.getBoundingClientRect();

    // For 3D Tilt
    const xPct = (clientX - rect.left) / rect.width - 0.5;
    const yPct = (clientY - rect.top) / rect.height - 0.5;
    mouseX.set(xPct);
    mouseY.set(yPct);

    // For Pattern Drawing
    if (isDrawing && status === "idle") {
      setCurrentMousePos({
        x: clientX - rect.left,
        y: clientY - rect.top,
      });

      // Check intersection with nodes
      const nodeRadius = 24; // Approximate hit area
      nodePositions.forEach((pos, index) => {
        if (selectedNodes.includes(index)) return;

        const dx = (clientX - rect.left) - pos.x;
        const dy = (clientY - rect.top) - pos.y;
        const distance = Math.sqrt(dx * dx + dy * dy);

        if (distance < nodeRadius) {
          setSelectedNodes((prev) => [...prev, index]);
        }
      });
    }
  };

  const handleMouseLeave = () => {
    mouseX.set(0);
    mouseY.set(0);
    if (isDrawing) {
      handleDrawEnd();
    }
  };

  const handleDrawStart = (index: number) => {
    if (status !== "idle") return;
    setIsDrawing(true);
    setSelectedNodes([index]);

    if (containerRef.current) {
        const pos = nodePositions[index];
        if (pos) {
            setCurrentMousePos({ x: pos.x, y: pos.y });
        }
    }
  };

  const handleDrawEnd = () => {
    if (!isDrawing) return;
    setIsDrawing(false);

    if (selectedNodes.length === 0) return;

    // Check pattern
    const isCorrect = selectedNodes.length === correctPattern.length &&
      selectedNodes.every((val, index) => val === correctPattern[index]);

    if (isCorrect) {
      setStatus("success");
      if (onSuccess) onSuccess();
    } else {
      setStatus("error");
      if (onError) onError();
    }

    // Reset after delay
    setTimeout(() => {
      setStatus("idle");
      setSelectedNodes([]);
    }, 1500);
  };

  useEffect(() => {
    // Calculate node centers relative to container
    if (containerRef.current) {
      const updatePositions = () => {
        if (!containerRef.current) return;
        const rect = containerRef.current.getBoundingClientRect();
        const nodes = containerRef.current.querySelectorAll('.pattern-node');
        const positions: { x: number; y: number }[] = [];

        nodes.forEach((node) => {
          const nodeRect = node.getBoundingClientRect();
          positions.push({
            x: nodeRect.left - rect.left + nodeRect.width / 2,
            y: nodeRect.top - rect.top + nodeRect.height / 2,
          });
        });
        setNodePositions(positions);
      };

      updatePositions();
      window.addEventListener('resize', updatePositions);
      return () => window.removeEventListener('resize', updatePositions);
    }
  }, []);

  const numNodes = gridSize * gridSize;
  const nodes = Array.from({ length: numNodes }, (_, i) => i);

  let activeColor = primaryColor;
  if (status === "success") activeColor = successColor;
  if (status === "error") activeColor = errorColor;

  return (
    <motion.div
      ref={containerRef}
      onMouseMove={handleMouseMove}
      onTouchMove={handleMouseMove}
      onMouseLeave={handleMouseLeave}
      onMouseUp={handleDrawEnd}
      onTouchEnd={handleDrawEnd}
      style={{
        rotateX,
        rotateY,
        transformStyle: "preserve-3d",
        ...style
      }}
      className={\`relative w-full max-w-sm aspect-square p-8 rounded-3xl bg-black/40 border border-white/10 backdrop-blur-xl shadow-2xl flex items-center justify-center cursor-crosshair select-none touch-none \${className}\`}
      {...props}
    >
      {/* Background Grid Elements */}
      <div className="absolute inset-0 pointer-events-none opacity-20"
        style={{
          backgroundImage: \`radial-gradient(circle at center, \${activeColor} 1px, transparent 1px)\`,
          backgroundSize: '24px 24px'
        }}
      />

      {/* Container for SVG Lines */}
      <svg className="absolute inset-0 w-full h-full pointer-events-none" style={{ zIndex: 1 }}>
        <defs>
            <filter id="glow" x="-20%" y="-20%" width="140%" height="140%">
                <feGaussianBlur stdDeviation="4" result="blur" />
                <feComposite in="SourceGraphic" in2="blur" operator="over" />
            </filter>
        </defs>

        {/* Draw confirmed paths */}
        {selectedNodes.map((nodeIndex, i) => {
          if (i === 0) return null;
          const prevNode = selectedNodes[i - 1];
          const pos1 = nodePositions[prevNode];
          const pos2 = nodePositions[nodeIndex];
          if (!pos1 || !pos2) return null;

          return (
            <motion.line
              key={\`line-\${prevNode}-\${nodeIndex}\`}
              initial={{ pathLength: 0, opacity: 0 }}
              animate={{ pathLength: 1, opacity: 1 }}
              transition={{ duration: 0.2, ease: "easeOut" }}
              x1={pos1.x}
              y1={pos1.y}
              x2={pos2.x}
              y2={pos2.y}
              stroke={activeColor}
              strokeWidth="6"
              strokeLinecap="round"
              filter="url(#glow)"
              className="drop-shadow-lg"
            />
          );
        })}

        {/* Draw current dragging line */}
        {isDrawing && selectedNodes.length > 0 && (
          <line
            x1={nodePositions[selectedNodes[selectedNodes.length - 1]]?.x || 0}
            y1={nodePositions[selectedNodes[selectedNodes.length - 1]]?.y || 0}
            x2={currentMousePos.x}
            y2={currentMousePos.y}
            stroke={activeColor}
            strokeWidth="4"
            strokeLinecap="round"
            strokeDasharray="8 8"
            opacity={0.6}
          />
        )}
      </svg>

      {/* Nodes Grid */}
      <div
        className="relative z-10 grid gap-6 sm:gap-8 w-full h-full"
        style={{
          gridTemplateColumns: \`repeat(\${gridSize}, 1fr)\`,
          gridTemplateRows: \`repeat(\${gridSize}, 1fr)\`,
          transform: "translateZ(30px)"
        }}
      >
        {nodes.map((index) => {
          const isSelected = selectedNodes.includes(index);
          const isLast = selectedNodes[selectedNodes.length - 1] === index;

          return (
            <div
              key={index}
              className="pattern-node relative flex items-center justify-center w-full h-full touch-none"
              onMouseDown={() => handleDrawStart(index)}
              onTouchStart={() => handleDrawStart(index)}
            >
              {/* Outer Glow Ring */}
              <motion.div
                animate={{
                  scale: isSelected ? 1.5 : 1,
                  opacity: isSelected ? 0.3 : 0,
                  borderColor: activeColor
                }}
                className="absolute w-12 h-12 sm:w-16 sm:h-16 rounded-full border-2"
                style={{ borderColor: activeColor }}
              />

              {/* Inner Node */}
              <motion.div
                animate={{
                  scale: isSelected ? (isLast ? 1.4 : 1.2) : 1,
                  backgroundColor: isSelected ? activeColor : "rgba(255,255,255,0.1)",
                  boxShadow: isSelected ? \`0 0 20px \${activeColor}\` : "none"
                }}
                className="w-4 h-4 sm:w-6 sm:h-6 rounded-full backdrop-blur-md border border-white/20 z-20"
              />

              {/* Shake Effect for Error */}
              {status === "error" && isSelected && (
                 <motion.div
                    initial={{ x: 0 }}
                    animate={{ x: [-5, 5, -5, 5, 0] }}
                    transition={{ duration: 0.4 }}
                    className="absolute inset-0"
                 />
              )}
            </div>
          );
        })}
      </div>
    </motion.div>
  );
}
`,
      componentPath: "NeuralPatternLock",
      scrollable: false,
      usageCode: `import { NeuralPatternLock } from "@/components/community/demos/NeuralPatternLock";

export default function App() {
  return (
    <div className="flex items-center justify-center p-12">
      <NeuralPatternLock
        onSuccess={() => console.log("Success!")}
        onError={() => console.log("Error!")}
      />
    </div>
  );
}`,
      props: [
        {
          name: "primaryColor",
          type: "string",
          defaultValue: `"#7fff5e"`,
          description: "Base color of the lock pattern nodes and trails.",
          control: { type: "color" },
        },
        {
          name: "successColor",
          type: "string",
          defaultValue: `"#00f0ff"`,
          description: "Color shown when pattern is successfully entered.",
          control: { type: "color" },
        },
        {
          name: "errorColor",
          type: "string",
          defaultValue: `"#ff5c71"`,
          description: "Color shown when pattern entry fails.",
          control: { type: "color" },
        },
        {
          name: "gridSize",
          type: "number",
          defaultValue: "3",
          description: "Dimensions of the lock grid (e.g., 3 for a 3x3 grid).",
          control: { type: "slider", min: 2, max: 5, step: 1 },
        },
      ]
    },
{
      id: "singularity-control-node",
      slug: "singularity-control-node",
      title: "Singularity Control Node",
      description: "A centralized magnetic core that expands into an interactive circular grid of glowing, glassmorphic nodes connected by animated synapse lines.",
      category: "Navigation",
      tags: ["Framer Motion", "Glassmorphism", "Interactive", "Navigation"],
      cliCommand: "npx @melonui-dev/cli add singularity-control-node",
      codeSnippet: `"use client";

import React, { useRef, useState } from "react";
import { motion, AnimatePresence, useMotionValue, useSpring } from "framer-motion";

export interface SingularityNode {
  id: string;
  label: string;
  icon: React.ReactNode;
  color: string;
}

export interface SingularityControlNodeProps extends React.ComponentPropsWithoutRef<"div"> {
  nodes?: SingularityNode[];
  coreColor?: string;
  onNodeClick?: (node: SingularityNode) => void;
}

const DEFAULT_NODES: SingularityNode[] = [
  {
    id: "neural-link",
    label: "Neural Link",
    color: "#ff5c71",
    icon: (
      <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
        <path d="M12 2v20M17 5H9.5a3.5 3.5 0 0 0 0 7h5a3.5 3.5 0 0 1 0 7H6" />
      </svg>
    ),
  },
  {
    id: "quantum-state",
    label: "Quantum State",
    color: "#7fff5e",
    icon: (
      <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
        <circle cx="12" cy="12" r="10" />
        <path d="M12 16v-4M12 8h.01" />
      </svg>
    ),
  },
  {
    id: "hyper-drive",
    label: "Hyper Drive",
    color: "#00f0ff",
    icon: (
      <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
        <path d="M5 12h14M12 5l7 7-7 7" />
      </svg>
    ),
  },
  {
    id: "void-core",
    label: "Void Core",
    color: "#a371f7",
    icon: (
      <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
        <path d="M21 12.79A9 9 0 1 1 11.21 3 7 7 0 0 0 21 12.79z" />
      </svg>
    ),
  },
];

export const SingularityControlNode: React.FC<SingularityControlNodeProps> = ({
  nodes = DEFAULT_NODES,
  coreColor = "#ff5c71",
  onNodeClick,
  className = "",
  style,
  ...props
}) => {
  const [isOpen, setIsOpen] = useState(false);
  const containerRef = useRef<HTMLDivElement>(null);

  // Magnetic Core Physics
  const mouseX = useMotionValue(0);
  const mouseY = useMotionValue(0);

  const springConfig = { damping: 15, stiffness: 150, mass: 0.5 };
  const smoothX = useSpring(mouseX, springConfig);
  const smoothY = useSpring(mouseY, springConfig);

  const handleMouseMove = (e: React.MouseEvent<HTMLDivElement>) => {
    if (!containerRef.current || isOpen) {
      mouseX.set(0);
      mouseY.set(0);
      return;
    }
    const rect = containerRef.current.getBoundingClientRect();
    const centerX = rect.left + rect.width / 2;
    const centerY = rect.top + rect.height / 2;

    // Magnetic pull extent
    const pullX = (e.clientX - centerX) * 0.3;
    const pullY = (e.clientY - centerY) * 0.3;

    mouseX.set(pullX);
    mouseY.set(pullY);
  };

  const handleMouseLeave = () => {
    mouseX.set(0);
    mouseY.set(0);
  };

  // Radius for the expanded nodes
  const RADIUS = 120;

  return (
    <div
      className={\`relative flex items-center justify-center w-full h-[400px] bg-[#050505] overflow-hidden rounded-2xl border border-white/5 \${className}\`}
      style={style}
      {...props}
    >
      {/* Background Grid & Noise */}
      <div className="absolute inset-0 opacity-[0.03]" style={{ backgroundImage: "radial-gradient(circle at center, white 1px, transparent 1px)", backgroundSize: "20px 20px" }} />
      <div className="absolute inset-0 opacity-20 mix-blend-overlay pointer-events-none" style={{ backgroundImage: "url(\"data:image/svg+xml,%3Csvg viewBox='0 0 200 200' xmlns='http://www.w3.org/2000/svg'%3E%3Cfilter id='noiseFilter'%3E%3CfeTurbulence type='fractalNoise' baseFrequency='0.65' numOctaves='3' stitchTiles='stitch'/%3E%3C/filter%3E%3Crect width='100%25' height='100%25' filter='url(%23noiseFilter)'/%3E%3C/svg%3E\")" }} />

      <div
        ref={containerRef}
        className="relative w-full h-full flex items-center justify-center z-10"
        onMouseMove={handleMouseMove}
        onMouseLeave={handleMouseLeave}
      >
        {/* Connection Lines (Synapses) */}
        <svg className="absolute inset-0 w-full h-full pointer-events-none">
          <AnimatePresence>
            {isOpen && nodes.map((node, index) => {
              const angle = (index / nodes.length) * Math.PI * 2 - Math.PI / 2;
              const x2 = \`calc(50% + \${Math.cos(angle) * RADIUS}px)\`;
              const y2 = \`calc(50% + \${Math.sin(angle) * RADIUS}px)\`;

              return (
                <motion.line
                  key={\`line-\${node.id}\`}
                  x1="50%"
                  y1="50%"
                  x2={x2}
                  y2={y2}
                  stroke={node.color}
                  strokeWidth="2"
                  strokeOpacity="0.4"
                  strokeDasharray="4 4"
                  initial={{ pathLength: 0, opacity: 0 }}
                  animate={{ pathLength: 1, opacity: 1 }}
                  exit={{ pathLength: 0, opacity: 0 }}
                  transition={{ duration: 0.6, ease: [0.16, 1, 0.3, 1], delay: index * 0.05 }}
                />
              );
            })}
          </AnimatePresence>
        </svg>

        {/* Orbiting Nodes */}
        <AnimatePresence>
          {isOpen && nodes.map((node, index) => {
            const angle = (index / nodes.length) * Math.PI * 2 - Math.PI / 2;
            const x = Math.cos(angle) * RADIUS;
            const y = Math.sin(angle) * RADIUS;

            return (
              <motion.div
                key={\`node-\${node.id}\`}
                className="absolute"
                initial={{ x: 0, y: 0, opacity: 0, scale: 0.5, rotate: -45 }}
                animate={{ x, y, opacity: 1, scale: 1, rotate: 0 }}
                exit={{ x: 0, y: 0, opacity: 0, scale: 0.5, rotate: 45 }}
                transition={{
                  type: "spring",
                  stiffness: 260,
                  damping: 20,
                  delay: index * 0.05
                }}
              >
                <motion.button
                  whileHover={{ scale: 1.1, boxShadow: \`0 0 20px \${node.color}40\` }}
                  whileTap={{ scale: 0.95 }}
                  onClick={(e) => {
                    e.stopPropagation();
                    if (onNodeClick) onNodeClick(node);
                  }}
                  className="group relative flex items-center justify-center w-12 h-12 rounded-xl bg-black/40 border border-white/10 backdrop-blur-md overflow-hidden cursor-pointer"
                >
                  <div className="absolute inset-0 bg-gradient-to-br from-white/10 to-transparent opacity-0 group-hover:opacity-100 transition-opacity" />
                  <div className="text-white/70 group-hover:text-white transition-colors">
                    {node.icon}
                  </div>
                  {/* Node Glow */}
                  <div
                    className="absolute inset-0 rounded-xl opacity-20 group-hover:opacity-40 transition-opacity blur-md -z-10"
                    style={{ backgroundColor: node.color }}
                  />

                  {/* Tooltip */}
                  <div className="absolute -bottom-8 left-1/2 -translate-x-1/2 whitespace-nowrap px-2 py-1 bg-black/80 border border-white/10 rounded-md text-[10px] text-white/60 font-mono opacity-0 group-hover:opacity-100 transition-opacity pointer-events-none">
                    {node.label}
                  </div>
                </motion.button>
              </motion.div>
            );
          })}
        </AnimatePresence>

        {/* Central Core */}
        <motion.button
          className="relative flex items-center justify-center w-20 h-20 rounded-full cursor-pointer group z-20"
          style={{ x: smoothX, y: smoothY }}
          onClick={() => setIsOpen(!isOpen)}
          whileHover={{ scale: isOpen ? 1 : 1.05 }}
          whileTap={{ scale: 0.95 }}
          aria-expanded={isOpen}
          aria-label="Toggle Singularity Control Node"
        >
          {/* Core Inner */}
          <div className="absolute inset-0 rounded-full bg-black border border-white/10 flex items-center justify-center overflow-hidden">
            {/* Core Gradient Spin */}
            <motion.div
              className="absolute w-[200%] h-[200%] opacity-40 blur-xl"
              style={{
                background: \`conic-gradient(from 0deg, transparent, \${coreColor}, transparent)\`,
              }}
              animate={{ rotate: 360 }}
              transition={{ duration: 4, repeat: Infinity, ease: "linear" }}
            />
            {/* Core Center Dot */}
            <motion.div
              className="w-4 h-4 rounded-full bg-white z-10 shadow-[0_0_15px_rgba(255,255,255,0.8)]"
              animate={{
                scale: isOpen ? [1, 1.2, 1] : 1,
                backgroundColor: isOpen ? coreColor : "#ffffff"
              }}
              transition={{ duration: 2, repeat: isOpen ? Infinity : 0 }}
            />
          </div>

          {/* Core Outer Glow */}
          <motion.div
            className="absolute inset-[-10px] rounded-full border border-white/5 opacity-50 pointer-events-none"
            animate={{
              scale: isOpen ? [1, 1.2, 1] : 1,
              opacity: isOpen ? [0.5, 0.2, 0.5] : 0.5
            }}
            transition={{ duration: 2, repeat: Infinity, ease: "easeInOut" }}
          />
          <motion.div
            className="absolute inset-[-20px] rounded-full border border-white/5 opacity-30 pointer-events-none"
            animate={{
              scale: isOpen ? [1, 1.4, 1] : 1,
              opacity: isOpen ? [0.3, 0.1, 0.3] : 0.3
            }}
            transition={{ duration: 2, repeat: Infinity, ease: "easeInOut", delay: 0.2 }}
          />

          {/* Active Rings */}
          <AnimatePresence>
            {isOpen && (
              <motion.div
                className="absolute inset-[-30px] rounded-full border border-dashed border-white/20 pointer-events-none"
                initial={{ opacity: 0, scale: 0.8, rotate: 0 }}
                animate={{ opacity: 1, scale: 1, rotate: 180 }}
                exit={{ opacity: 0, scale: 0.8 }}
                transition={{ duration: 10, repeat: Infinity, ease: "linear" }}
              />
            )}
          </AnimatePresence>
        </motion.button>
      </div>
    </div>
  );
};
`,
      componentPath: "SingularityControlNode",
      scrollable: false,
      aiPrompt: "Create a singularity control node component that acts as a central magnetic hub. When clicked, it expands via spring physics into a circular array of glassmorphic nodes connected by animated SVG lines. It should have a Gen-Z premium aesthetic with layered depth, noise textures, and smooth Framer Motion animations."
  },
{
      id: "tethered-orbital-vault",
      slug: "tethered-orbital-vault",
      title: "Tethered Orbital Vault",
      description: "A highly tactile digital lock where users drag orbiting cryptographic keys into a central core via magnetic tethers, morphing into a futuristic dashboard upon decryption.",
      category: "Widgets",
      tags: ["Framer Motion", "Interactive", "Drag and Drop", "Cyber", "Dashboard"],
      cliCommand: "npx @melonui-dev/cli add tethered-orbital-vault",
      codeSnippet: "// See TetheredOrbitalVault.tsx",
      componentPath: "TetheredOrbitalVault",
      scrollable: false,
      usageCode: `import { TetheredOrbitalVault } from "@/components/community/demos/TetheredOrbitalVault";

  export default function MyPage() {
    return (
      <div className="w-full max-w-4xl p-8">
        <TetheredOrbitalVault />
      </div>
    );
  }`,
      aiPrompt: "Generate a Tethered Orbital Vault component that features draggable orbiting keys connected by magnetic tethers to a central core, which unlocks and expands into a glassmorphic dashboard.",
      props: [
        {
          name: "title",
          type: "string",
          defaultValue: `"ORBITAL VAULT"`,
          description: "Main header title for the component."
        },
        {
          name: "primaryColor",
          type: "string",
          defaultValue: `"#ff5c71"`,
          description: "Neon color for the first key and logs."
        },
        {
          name: "accentColor",
          type: "string",
          defaultValue: `"#7fff5e"`,
          description: "Neon color for the second key and success state."
        },
        {
          name: "glowColor",
          type: "string",
          defaultValue: `"#00f0ff"`,
          description: "Neon color for the third key and ambient glow."
        }
      ]
    },
{
      id: "cyber-biometric-scanner",
      slug: "cyber-biometric-scanner",
      title: "Cyber Biometric Scanner",
      description: "A highly interactive, press-and-hold biometric scanner featuring dynamic SVG topography, glowing laser sweeps, and glitching cybernetic states.",
      category: "Widgets",
      tags: ["Framer Motion", "Biometric", "Scanner", "Interactive"],
      cliCommand: "npx @melonui-dev/cli add cyber-biometric-scanner",
      codeSnippet: `"use client";

import React, { useState, useRef, useEffect } from "react";
import { motion, AnimatePresence, useAnimation, PanInfo } from "framer-motion";

export interface TetheredOrbitalVaultProps extends React.ComponentPropsWithoutRef<"div"> {
  title?: string;
  lockedSubtitle?: string;
  unlockedSubtitle?: string;
  primaryColor?: string;
  accentColor?: string;
  glowColor?: string;
  bgColor?: string;
}

export function TetheredOrbitalVault({
  title = "ORBITAL VAULT",
  lockedSubtitle = "ALIGN KEYS TO CORE",
  unlockedSubtitle = "VAULT SECURED. FULL ACCESS.",
  primaryColor = "#ff5c71",
  accentColor = "#7fff5e",
  glowColor = "#00f0ff",
  bgColor = "#050505",
  className = "",
  style,
  ...props
}: TetheredOrbitalVaultProps) {
  const containerRef = useRef<HTMLDivElement>(null);
  const coreRef = useRef<HTMLDivElement>(null);

  // States
  const [mounted, setMounted] = useState(false);
  const [unlocked, setUnlocked] = useState(false);
  const [lockedKeys, setLockedKeys] = useState<string[]>([]);

  // Constants
  const CORE_RADIUS = 50;
  const KEY_RADIUS = 30;

  useEffect(() => {
    setTimeout(() => setMounted(true), 0);
  }, []);

  // Check if all keys are locked
  useEffect(() => {
    if (lockedKeys.length === 3) {
      setTimeout(() => setUnlocked(true), 500);
    }
  }, [lockedKeys]);

  // Keys configuration
  const keysConfig = [
    { id: "key-1", label: "ALPHA", color: primaryColor, angle: -90 },
    { id: "key-2", label: "BETA", color: accentColor, angle: 150 },
    { id: "key-3", label: "GAMMA", color: glowColor, angle: 30 },
  ];

  const handleDragStart = () => {
    // Optional: Visual feedback during drag
  };

  const handleDragEnd = (event: MouseEvent | TouchEvent | PointerEvent, info: PanInfo, id: string, controls: ReturnType<typeof useAnimation>) => {
    if (!coreRef.current || !containerRef.current) {
      controls.start({ x: 0, y: 0, transition: { type: "spring", stiffness: 300, damping: 20 } });
      return;
    }

    const coreRect = coreRef.current.getBoundingClientRect();

    // Core center relative to viewport
    const coreCenterX = coreRect.left + coreRect.width / 2;
    const coreCenterY = coreRect.top + coreRect.height / 2;

    const dropX = info.point.x;
    const dropY = info.point.y;

    // Distance to core
    const dist = Math.sqrt(Math.pow(dropX - coreCenterX, 2) + Math.pow(dropY - coreCenterY, 2));

    // Snap threshold
    if (dist < CORE_RADIUS + KEY_RADIUS) {
      if (!lockedKeys.includes(id)) {
        setLockedKeys((prev) => [...prev, id]);
      }
    } else {
      controls.start({ x: 0, y: 0, transition: { type: "spring", stiffness: 300, damping: 20 } });
    }
  };

  const resetVault = () => {
    setUnlocked(false);
    setLockedKeys([]);
  };

  if (!mounted) return <div className={\`w-full h-[600px] \${className}\`} style={{ backgroundColor: bgColor, ...style }} />;

  return (
    <div
      ref={containerRef}
      className={\`relative w-full h-[600px] rounded-3xl overflow-hidden flex flex-col items-center justify-center font-['Outfit',sans-serif] \${className}\`}
      style={{
        backgroundColor: bgColor,
        backgroundImage: "radial-gradient(circle at 50% 50%, rgba(255,255,255,0.05) 0%, transparent 80%)",
        ...style
      }}
      {...props}
    >
      {/* Background Noise */}
      <div
        className="absolute inset-0 pointer-events-none opacity-[0.03] z-0 mix-blend-overlay"
        style={{ backgroundImage: "url('data:image/svg+xml,%3Csvg viewBox=%220 0 200 200%22 xmlns=%22http://www.w3.org/2000/svg%22%3E%3Cfilter id=%22noise%22%3E%3CfeTurbulence type=%22fractalNoise%22 baseFrequency=%220.8%22 numOctaves=%223%22 stitchTiles=%22stitch%22/%3E%3C/filter%3E%3Crect width=%22100%25%22 height=%22100%25%22 filter=%22url(%23noise)%22/%3E%3C/svg%3E')" }}
      />

      <AnimatePresence mode="wait">
        {!unlocked ? (
          <motion.div
            key="vault-locked"
            initial={{ opacity: 0, scale: 0.9 }}
            animate={{ opacity: 1, scale: 1 }}
            exit={{ opacity: 0, scale: 1.1, filter: "blur(10px)" }}
            transition={{ duration: 0.5, ease: "easeInOut" }}
            className="absolute inset-0 flex items-center justify-center z-10"
          >
            {/* Header Text */}
            <div className="absolute top-10 flex flex-col items-center text-center pointer-events-none">
              <h2 className="text-white/80 text-xl tracking-[0.3em] font-bold uppercase" style={{ textShadow: \`0 0 20px \${primaryColor}50\` }}>
                {title}
              </h2>
              <div className="flex items-center gap-2 mt-2">
                <div className="w-1.5 h-1.5 rounded-full bg-white/50 animate-pulse" />
                <span className="text-[10px] tracking-widest text-white/50">{lockedSubtitle}</span>
              </div>
            </div>

            {/* Central Core Lock */}
            <div
              ref={coreRef}
              className="relative flex items-center justify-center"
              style={{ width: CORE_RADIUS * 2, height: CORE_RADIUS * 2 }}
            >
              {/* Outer Ring */}
              <motion.div
                className="absolute inset-[-40px] rounded-full border border-white/10"
                animate={{ rotate: 360 }}
                transition={{ duration: 20, repeat: Infinity, ease: "linear" }}
                style={{ borderStyle: "dashed" }}
              />
              <motion.div
                className="absolute inset-[-60px] rounded-full border border-white/5"
                animate={{ rotate: -360 }}
                transition={{ duration: 30, repeat: Infinity, ease: "linear" }}
              />

              {/* Core Body */}
              <motion.div
                className="absolute inset-0 rounded-full bg-black/80 backdrop-blur-md border flex items-center justify-center z-10"
                style={{
                  borderColor: lockedKeys.length === 3 ? accentColor : "rgba(255,255,255,0.2)",
                  boxShadow: \`0 0 40px \${lockedKeys.length > 0 ? lockedKeys.length === 3 ? accentColor : primaryColor : 'transparent'}20 inset\`
                }}
                animate={{ scale: lockedKeys.length === 3 ? [1, 1.1, 1] : 1 }}
                transition={{ duration: 0.5 }}
              >
                <div className="w-1/2 h-1/2 rounded-full opacity-20 blur-md" style={{ backgroundColor: primaryColor }} />
                <div className="absolute inset-0 flex items-center justify-center">
                  <span className="text-white/40 text-xs font-mono">{lockedKeys.length}/3</span>
                </div>
              </motion.div>
            </div>

            {/* Orbiting Keys */}
            {keysConfig.map((key) => {
              return (
                <DraggableKey
                  key={key.id}
                  id={key.id}
                  label={key.label}
                  color={key.color}
                  angle={key.angle}
                  orbitRadius={160}
                  isLocked={lockedKeys.includes(key.id)}
                  onDragStart={handleDragStart}
                  onDragEnd={handleDragEnd}
                  containerRef={containerRef}
                />
              );
            })}
          </motion.div>
        ) : (
          <motion.div
            key="vault-unlocked"
            initial={{ opacity: 0, scale: 0.9, y: 20 }}
            animate={{ opacity: 1, scale: 1, y: 0 }}
            exit={{ opacity: 0, scale: 0.9 }}
            transition={{ duration: 0.7, type: "spring", bounce: 0.4 }}
            className="w-full h-full p-8 flex flex-col z-20"
          >
            {/* Dashboard Header */}
            <div className="flex items-center justify-between mb-8 relative z-20">
              <div>
                <h2 className="text-white text-3xl font-black tracking-tighter uppercase flex items-center gap-3" style={{ fontFamily: "var(--font-londrina-solid)" }}>
                  <span style={{ color: accentColor }}>{"//"}</span> {title}
                </h2>
                <p className="text-white/50 text-xs font-mono tracking-widest mt-2">{unlockedSubtitle}</p>
              </div>
              <button
                onClick={resetVault}
                className="px-4 py-2 rounded-lg bg-white/5 border border-white/10 hover:bg-white/10 text-white/70 hover:text-white text-[10px] tracking-widest transition-all uppercase flex items-center gap-2 backdrop-blur-md"
              >
                <svg width="12" height="12" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                  <path d="M21 12a9 9 0 1 1-9-9c2.52 0 4.93 1 6.74 2.74L21 8"/>
                  <path d="M21 3v5h-5"/>
                </svg>
                RE-LOCK
              </button>
            </div>

            {/* Dashboard Bento Grid */}
            <div className="flex-1 grid grid-cols-3 grid-rows-2 gap-4 relative z-20">
              <motion.div
                initial={{ opacity: 0, x: -20 }}
                animate={{ opacity: 1, x: 0 }}
                transition={{ delay: 0.2 }}
                className="col-span-2 row-span-2 rounded-2xl bg-white/[0.02] border border-white/10 p-6 flex flex-col overflow-hidden relative group backdrop-blur-md"
              >
                <div className="absolute top-0 left-0 w-full h-1" style={{ background: \`linear-gradient(90deg, \${primaryColor}, \${accentColor})\` }} />
                <div className="absolute -bottom-20 -right-20 w-64 h-64 rounded-full blur-[80px] opacity-20 group-hover:opacity-40 transition-opacity" style={{ backgroundColor: glowColor }} />
                <h3 className="text-white/40 text-xs tracking-widest uppercase font-mono mb-6">Encrypted Logs</h3>
                <div className="flex-1 flex flex-col gap-3 font-mono text-[10px] text-white/60">
                  <div className="flex justify-between items-center border-b border-white/5 pb-2">
                    <span className="text-white/30">14:02:41</span>
                    <span style={{ color: primaryColor }}>AUTH_BYPASS_INITIATED</span>
                  </div>
                  <div className="flex justify-between items-center border-b border-white/5 pb-2">
                    <span className="text-white/30">14:02:42</span>
                    <span style={{ color: accentColor }}>KEYS_ALIGNED_SUCCESS</span>
                  </div>
                  <div className="flex justify-between items-center border-b border-white/5 pb-2">
                    <span className="text-white/30">14:02:44</span>
                    <span style={{ color: glowColor }}>VAULT_DECRYPTED</span>
                  </div>
                  <div className="flex justify-between items-center border-b border-white/5 pb-2">
                    <span className="text-white/30">14:02:45</span>
                    <span className="text-white">DATA_STREAM_ESTABLISHED</span>
                  </div>
                </div>
              </motion.div>

              <motion.div
                initial={{ opacity: 0, y: -20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: 0.3 }}
                className="rounded-2xl bg-white/[0.02] border border-white/10 p-5 flex flex-col justify-between backdrop-blur-md"
              >
                <h3 className="text-white/40 text-xs tracking-widest uppercase font-mono">Integrity</h3>
                <div>
                  <div className="text-3xl font-light text-white">100%</div>
                  <div className="text-[10px] tracking-wider text-white/40 mt-1 uppercase">Systems Nominal</div>
                </div>
              </motion.div>

              <motion.div
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: 0.4 }}
                className="rounded-2xl bg-white/[0.02] border border-white/10 p-5 flex flex-col justify-between relative overflow-hidden backdrop-blur-md"
              >
                <div className="absolute inset-0 opacity-10" style={{
                  backgroundImage: \`repeating-linear-gradient(-45deg, transparent, transparent 5px, \${accentColor} 5px, \${accentColor} 10px)\`
                }} />
                <h3 className="text-white/40 text-xs tracking-widest uppercase font-mono relative z-10">Status</h3>
                <div className="relative z-10">
                  <div className="text-xl font-bold" style={{ color: accentColor }}>UNLOCKED</div>
                  <div className="text-[10px] tracking-wider text-white/40 mt-1 uppercase">Root Access</div>
                </div>
              </motion.div>
            </div>
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
}

// Sub-component for individual draggable keys
function DraggableKey({
  id,
  label,
  color,
  angle,
  orbitRadius,
  isLocked,
  onDragStart,
  onDragEnd,
  containerRef
}: {
  id: string;
  label: string;
  color: string;
  angle: number;
  orbitRadius: number;
  isLocked: boolean;
  onDragStart: () => void;
  onDragEnd: (event: MouseEvent | TouchEvent | PointerEvent, info: PanInfo, id: string, controls: ReturnType<typeof useAnimation>) => void;
  containerRef: React.RefObject<HTMLDivElement | null>;
}) {
  const controls = useAnimation();
  const rad = (angle * Math.PI) / 180;
  const startX = Math.cos(rad) * orbitRadius;
  const startY = Math.sin(rad) * orbitRadius;

  useEffect(() => {
    if (isLocked) {
      controls.start({
        x: 0,
        y: 0,
        scale: 0.5,
        opacity: 0,
        transition: { type: "spring", stiffness: 200, damping: 20 }
      });
    } else {
      controls.start({ x: startX, y: startY, scale: 1, opacity: 1, transition: { duration: 0 } });
    }
  }, [isLocked, startX, startY, controls]);

  return (
    <motion.div
      className="absolute z-20"
      initial={{ x: startX, y: startY }}
      animate={controls}
    >
      <motion.div
        drag={!isLocked}
        dragConstraints={containerRef}
        dragElastic={0.2}
        onDragStart={onDragStart}
        onDragEnd={(e, info) => onDragEnd(e, info, id, controls)}
        whileHover={!isLocked ? { scale: 1.1 } : {}}
        whileDrag={{ scale: 1.2, cursor: "grabbing" }}
        className={\`w-14 h-14 rounded-full flex items-center justify-center cursor-grab relative group \${isLocked ? 'pointer-events-none' : ''}\`}
        style={{
          background: \`radial-gradient(circle at center, \${color}30 0%, rgba(0,0,0,0.8) 100%)\`,
          border: \`1px solid \${color}80\`,
          boxShadow: \`0 0 15px \${color}30\`
        }}
      >
        <div className="absolute inset-0 rounded-full opacity-0 group-hover:opacity-100 transition-opacity duration-300"
             style={{ boxShadow: \`inset 0 0 10px \${color}\` }} />

        <div className="w-2 h-2 rounded-full" style={{ backgroundColor: color, boxShadow: \`0 0 10px \${color}\` }} />

        <span className="absolute -bottom-6 text-[8px] font-mono tracking-widest text-white/50 uppercase whitespace-nowrap">
          {label}
        </span>
      </motion.div>
    </motion.div>
  );
}
`,
      componentPath: "CyberBiometricScanner",
      scrollable: false,
      usageCode: `import { CyberBiometricScanner } from "@/components/community/demos/CyberBiometricScanner";

  export default function Demo() {
    return (
      <div className="flex items-center justify-center p-12">
        <CyberBiometricScanner />
      </div>
    );
  }`,
      aiPrompt: "Generate a CyberBiometricScanner component that uses framer-motion to create a press-and-hold biometric scanner featuring dynamic SVG topography, glowing laser sweeps, and glitching cybernetic states.",
      props: [
        {
          name: "title",
          type: "string",
          defaultValue: `"IDENTITY VERIFICATION"`,
          description: "The main title displayed above the scanner.",
          control: { type: "text" }
        },
        {
          name: "subtitle",
          type: "string",
          defaultValue: `"HOLD TO SCAN"`,
          description: "The instructional subtitle displayed at the bottom.",
          control: { type: "text" }
        },
        {
          name: "successText",
          type: "string",
          defaultValue: `"ACCESS GRANTED"`,
          description: "The text displayed upon successful scan.",
          control: { type: "text" }
        },
        {
          name: "primaryColor",
          type: "string",
          defaultValue: `"#00f0ff"`,
          description: "The main neon color used for the scanner UI and success state.",
          control: { type: "color" }
        },
        {
          name: "accentColor",
          type: "string",
          defaultValue: `"#ff5c71"`,
          description: "The secondary accent color used for error/failed states.",
          control: { type: "color" }
        },
        {
          name: "scanDuration",
          type: "number",
          defaultValue: "2500",
          description: "Duration required to hold the scanner in milliseconds before success.",
          control: { type: "slider", min: 1000, max: 5000, step: 100 }
        }
      ]
    },
{
    id: "holo-seal-vault",
    slug: "holo-seal-vault",
    title: "Holo Seal Vault",
    description: "A tactile unboxing experience where users physically drag and tear a holographic security seal to reveal encrypted content.",
    category: "Cards",
    tags: ["Framer Motion", "Interactive", "Physics", "Tactile"],
    cliCommand: "npx @melonui-dev/cli add holo-seal-vault",
    codeSnippet: `"use client";

import React, { useState, useRef, useEffect } from "react";
import { motion, useMotionValue, useSpring, useTransform, AnimatePresence } from "framer-motion";

export interface HoloSealVaultProps extends React.ComponentPropsWithoutRef<"div"> {
  vaultTitle?: string;
  vaultDescription?: string;
  sealColor?: string;
  accentColor?: string;
  contentNode?: React.ReactNode;
}

export function HoloSealVault({
  vaultTitle = "CLASSIFIED_DATA",
  vaultDescription = "ENCRYPTED SECTOR. AUTHORIZATION REQUIRED.",
  sealColor = "#ff5c71",
  accentColor = "#7fff5e",
  contentNode,
  className,
  style,
}: HoloSealVaultProps) {
  const [isUnlocked, setIsUnlocked] = useState(false);
  const containerRef = useRef<HTMLDivElement>(null);

  // Seal physics
  const dragX = useMotionValue(0);
  const dragY = useMotionValue(0);

  const springX = useSpring(dragX, { stiffness: 400, damping: 25 });
  const springY = useSpring(dragY, { stiffness: 400, damping: 25 });

  // Calculate drag progress (distance from center)
  const distance = useTransform(() => {
    return Math.sqrt(springX.get() ** 2 + springY.get() ** 2);
  });

  // Seal starts tearing as it gets further away
  const tearProgress = useTransform(distance, [0, 200], [0, 1]);

  // Visual effects based on tear
  const sealRotate = useTransform(springX, [-200, 200], [-15, 15]);
  const sealScale = useTransform(tearProgress, [0, 0.8, 1], [1, 1.1, 0]);
  const sealOpacity = useTransform(tearProgress, [0, 0.8, 1], [1, 0.9, 0]);

  // Glitch effect on the vault when tearing
  const vaultGlitchX = useTransform(distance, [0, 150], [0, 10]);
  const vaultGlitchOpacity = useTransform(distance, [0, 150], [0, 0.5]);

  useEffect(() => {
    const unsubscribe = tearProgress.on("change", (latest) => {
      if (latest >= 0.95 && !isUnlocked) {
        setIsUnlocked(true);
      }
    });
    return () => unsubscribe();
  }, [tearProgress, isUnlocked]);

  // Generate some deterministic noise/stars for the background
  const noisePattern = Array.from({ length: 40 }).map((_, i) => ({
    x: (Math.sin(i * 12.4) * 50 + 50) + "%",
    y: (Math.cos(i * 4.3) * 50 + 50) + "%",
    size: Math.abs(Math.sin(i * 7.1)) * 3 + 1,
  }));

  return (
    <div
      ref={containerRef}
      className={\`relative w-full max-w-2xl mx-auto h-[400px] rounded-2xl overflow-hidden bg-[#0a0a0a] border border-white/10 \${className || ""}\`}
      style={style}
    >
      {/* Background Noise / Grid */}
      <div className="absolute inset-0 pointer-events-none opacity-20">
        <div className="absolute inset-0 bg-[radial-gradient(ellipse_at_center,_var(--tw-gradient-stops))] from-[#ffffff15] via-transparent to-transparent" />
        {noisePattern.map((point, i) => (
          <div
            key={i}
            className="absolute rounded-full bg-white/40"
            style={{
              left: point.x,
              top: point.y,
              width: point.size,
              height: point.size,
            }}
          />
        ))}
        {/* CRT Scanline */}
        <motion.div
          className="absolute inset-x-0 h-1 bg-white/5"
          animate={{ y: ["0%", "40000%"] }}
          transition={{ duration: 8, repeat: Infinity, ease: "linear" }}
        />
      </div>

      <AnimatePresence mode="wait">
        {!isUnlocked ? (
          <motion.div
            key="locked"
            className="absolute inset-0 flex flex-col items-center justify-center p-8 z-10"
            exit={{ opacity: 0, scale: 0.95, filter: "blur(10px)" }}
            transition={{ duration: 0.5, ease: "easeInOut" }}
          >
            {/* Vault Frame */}
            <motion.div
              className="relative w-full max-w-md bg-black/40 border border-white/5 rounded-xl p-8 backdrop-blur-xl overflow-hidden"
              style={{ x: vaultGlitchX }}
            >
              <div className="absolute inset-0 border-2 border-dashed border-white/10 rounded-xl" />

              <div className="text-center space-y-2 mb-12">
                <h3 className="font-['Anton'] text-3xl tracking-wider text-white uppercase">
                  {vaultTitle}
                </h3>
                <p className="font-['Outfit'] text-xs text-white/50 tracking-widest font-bold">
                  {vaultDescription}
                </p>
              </div>

              {/* The Seal Constraint Area */}
              <div className="relative h-32 flex items-center justify-center">

                {/* Visual connection wires under the seal */}
                <div className="absolute inset-x-0 h-[2px] bg-white/10 flex justify-between">
                  <div className="w-2 h-2 rounded-full bg-white/20 -mt-[3px] ml-4" />
                  <div className="w-2 h-2 rounded-full bg-white/20 -mt-[3px] mr-4" />
                </div>

                {/* The Draggable Holographic Seal */}
                <motion.div
                  drag
                  dragConstraints={{ top: 0, left: 0, right: 0, bottom: 0 }}
                  dragElastic={0.8}
                  style={{
                    x: dragX,
                    y: dragY,
                    rotate: sealRotate,
                    scale: sealScale,
                    opacity: sealOpacity,
                  }}
                  className="relative z-20 cursor-grab active:cursor-grabbing"
                  whileHover={{ scale: 1.05 }}
                  whileTap={{ scale: 0.95 }}
                >
                  <div className="relative px-8 py-4 bg-black border-2 rounded-lg overflow-hidden group shadow-2xl"
                       style={{ borderColor: sealColor, boxShadow: \`0 0 40px -10px \${sealColor}80\` }}>

                    {/* Holographic foil effect */}
                    <div className="absolute inset-0 opacity-50 mix-blend-screen bg-gradient-to-tr from-transparent via-white/20 to-transparent group-hover:via-white/40 transition-colors" />

                    {/* Caution stripes */}
                    <div className="absolute inset-0 opacity-20 bg-[repeating-linear-gradient(45deg,transparent,transparent_10px,#fff_10px,#fff_20px)]" />

                    <div className="relative flex items-center space-x-3">
                      <div className="w-3 h-3 rounded-full animate-pulse" style={{ backgroundColor: sealColor }} />
                      <span className="font-['Outfit'] font-black tracking-[0.2em] text-sm text-white drop-shadow-md">
                        RIP TO UNLOCK
                      </span>
                    </div>
                  </div>
                </motion.div>

                {/* Glitch Overlay rendering under the seal based on drag distance */}
                <motion.div
                  className="absolute inset-0 pointer-events-none bg-red-500/10 mix-blend-overlay"
                  style={{ opacity: vaultGlitchOpacity }}
                />
              </div>
            </motion.div>
          </motion.div>
        ) : (
          <motion.div
            key="unlocked"
            className="absolute inset-0 flex items-center justify-center p-8 z-20"
            initial={{ opacity: 0, scale: 1.1, filter: "blur(20px)" }}
            animate={{ opacity: 1, scale: 1, filter: "blur(0px)" }}
            transition={{ duration: 0.8, type: "spring", bounce: 0.4 }}
          >
            <div className="w-full h-full border border-white/20 bg-black/60 backdrop-blur-2xl rounded-xl p-6 relative overflow-hidden shadow-[0_0_100px_-20px_rgba(127,255,94,0.3)]">
              {/* Decorative Corner Borders */}
              <div className="absolute top-0 left-0 w-8 h-8 border-t-2 border-l-2 rounded-tl-xl" style={{ borderColor: accentColor }} />
              <div className="absolute bottom-0 right-0 w-8 h-8 border-b-2 border-r-2 rounded-br-xl" style={{ borderColor: accentColor }} />

              <div className="absolute top-4 right-4 flex space-x-2">
                <div className="w-2 h-2 rounded-full" style={{ backgroundColor: accentColor }} />
                <span className="font-mono text-[10px] text-white/50 tracking-widest">ACCESS_GRANTED</span>
              </div>

              <div className="mt-8 h-full">
                {contentNode || (
                  <div className="flex flex-col items-center justify-center h-full text-center space-y-6">
                    <motion.div
                      initial={{ rotate: -90, opacity: 0 }}
                      animate={{ rotate: 0, opacity: 1 }}
                      transition={{ delay: 0.2, type: "spring" }}
                      className="w-16 h-16 rounded-2xl border-2 flex items-center justify-center"
                      style={{ borderColor: accentColor, color: accentColor }}
                    >
                      <svg width="32" height="32" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                        <path d="M21 16V8a2 2 0 0 0-1-1.73l-7-4a2 2 0 0 0-2 0l-7 4A2 2 0 0 0 3 8v8a2 2 0 0 0 1 1.73l7 4a2 2 0 0 0 2 0l7-4A2 2 0 0 0 21 16z" />
                        <polyline points="3.27 6.96 12 12.01 20.73 6.96" />
                        <line x1="12" y1="22.08" x2="12" y2="12" />
                      </svg>
                    </motion.div>

                    <div className="space-y-2">
                      <h4 className="font-['Outfit'] font-bold text-2xl text-white">DECRYPTED PAYLOAD</h4>
                      <p className="font-sans text-sm text-white/60 max-w-sm">
                        The physical security seal has been breached. Welcome to the inner systems.
                      </p>
                    </div>

                    <motion.button
                      whileHover={{ scale: 1.05 }}
                      whileTap={{ scale: 0.95 }}
                      onClick={() => setIsUnlocked(false)}
                      className="px-6 py-2 rounded-full bg-white/5 border border-white/10 text-white text-xs font-bold tracking-widest hover:bg-white/10 transition-colors"
                    >
                      RE-SEAL VAULT
                    </motion.button>
                  </div>
                )}
              </div>
            </div>
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
}
`,
      componentPath: "HoloSealVault",
    props: [
      {
        name: "vaultTitle",
        type: "string",
        defaultValue: "\"CLASSIFIED_DATA\"",
        description: "The title text displayed on the locked vault.",
        control: { type: "text" }
      },
      {
        name: "vaultDescription",
        type: "string",
        defaultValue: "\"ENCRYPTED SECTOR. AUTHORIZATION REQUIRED.\"",
        description: "The subtitle text displayed on the locked vault.",
        control: { type: "text" }
      },
      {
        name: "sealColor",
        type: "string",
        defaultValue: "\"#ff5c71\"",
        description: "The primary color of the holographic security seal.",
        control: { type: "color" }
      },
      {
        name: "accentColor",
        type: "string",
        defaultValue: "\"#7fff5e\"",
        description: "The accent color used inside the unlocked vault.",
        control: { type: "color" }
      }
    ]
  },
{
    id: "holo-deploy-card",
    slug: "holo-deploy-card",
    title: "Holo Deploy Card",
    description: "A highly kinetic, tactile 3D card. On hover, glassmorphic panels deploy outwardly like a satellite or an unfolding sci-fi interface, expanding the interface area.",
    category: "Cards",
    tags: ["Framer Motion", "3D", "Interactive", "Cyber"],
    cliCommand: "npx @melonui-dev/cli add holo-deploy-card",
    codeSnippet: "// HoloDeployCard.tsx",
    componentPath: "HoloDeployCard",
    usageCode: `import { HoloDeployCard } from "@/components/community/demos/HoloDeployCard";

export default function Demo() {
  return (
    <div className="w-full py-32 flex justify-center items-center">
      <HoloDeployCard
        title="MAIN TERMINAL"
        subtitle="HOVER TO INITIALIZE"
      />
    </div>
  );
}`,
    props: [
      { name: "title", type: "string", defaultValue: `"CORE SYSTEM"`, description: "Central glowing title text.", control: { type: "text" } },
      { name: "subtitle", type: "string", defaultValue: `"HOVER TO DEPLOY"`, description: "Helper text on the center card.", control: { type: "text" } },
      { name: "primaryColor", type: "string", defaultValue: `"#ff5c71"`, description: "Primary neon accent color.", control: { type: "color" } },
      { name: "secondaryColor", type: "string", defaultValue: `"#7fff5e"`, description: "Secondary neon accent color.", control: { type: "color" } }
    ]
  },
{
    id: "tactile-cyber-badge",
    slug: "tactile-cyber-badge",
    title: "Tactile Cyber Badge",
    description: "A highly interactive, draggable physical ID badge with framer-motion kinetics, realistic lanyard string physics, and premium digital aesthetic.",
    category: "Widgets",
    tags: ["Framer Motion", "Physics", "Interactive", "3D", "Draggable"],
    cliCommand: "npx @melonui-dev/cli add tactile-cyber-badge",
    codeSnippet: `"use client";

import React, { useRef } from "react";
import { motion, useMotionValue, useSpring, useTransform } from "framer-motion";

export interface TactileCyberBadgeProps extends React.ComponentPropsWithoutRef<"div"> {
  name?: string;
  role?: string;
  idNumber?: string;
  primaryColor?: string;
  accentColor?: string;
  companyName?: string;
}

export const TactileCyberBadge: React.FC<TactileCyberBadgeProps> = ({
  name = "ALEX CHEN",
  role = "LEAD ENGINEER",
  idNumber = "M-99201",
  primaryColor = "#ff5c71",
  accentColor = "#7fff5e",
  companyName = "MELON_UI //",
  className = "",
  style,
  ...props
}) => {
  const containerRef = useRef<HTMLDivElement>(null);

  // Motion values for drag
  const x = useMotionValue(0);
  const y = useMotionValue(0);

  // Smooth springs for physics
  const springConfig = { damping: 15, stiffness: 120, mass: 1.2 };
  const springX = useSpring(x, springConfig);
  const springY = useSpring(y, springConfig);

  // 3D Tilt based on drag offset
  const rotateX = useTransform(springY, [-300, 300], [25, -25]);
  const rotateY = useTransform(springX, [-300, 300], [-25, 25]);

  // Lanyard string physics
  const lanyardPath = useTransform([springX, springY], ([latestX, latestY]) => {
    const bX = latestX as number;
    const bY = latestY as number;

    // Top-center anchor point (assuming 600px container, so -300 from center)
    const startX = 0;
    const startY = -300;

    // Badge attachment point (top center of the badge)
    const endX = bX;
    const endY = bY - 180;

    // Control point for realistic gravity sag
    const ctrlX = (startX + endX) / 2;
    // Add extra slack when badge is pulled up
    const slack = Math.max(0, 150 - Math.abs(endY - startY));
    const ctrlY = Math.max(startY, endY) + 50 + slack;

    return \`M \${startX} \${startY} Q \${ctrlX} \${ctrlY} \${endX} \${endY}\`;
  });

  return (
    <div
      ref={containerRef}
      className={\`relative w-full h-[600px] bg-[#050505] overflow-hidden flex items-center justify-center [perspective:1200px] \${className}\`}
      style={style}
      {...props}
    >
      {/* Background Subtle Grid */}
      <div
        className="absolute inset-0 opacity-[0.03] pointer-events-none"
        style={{
          backgroundImage: \`linear-gradient(rgba(255,255,255,1) 1px, transparent 1px), linear-gradient(90deg, rgba(255,255,255,1) 1px, transparent 1px)\`,
          backgroundSize: "40px 40px"
        }}
      />

      {/* Floating Ambience Particles (Deterministic) */}
      <div className="absolute inset-0 pointer-events-none overflow-hidden z-0">
        {[...Array(6)].map((_, i) => (
          <motion.div
            key={i}
            className="absolute rounded-full"
            style={{
              width: (i % 3 + 1) * 3 + 'px',
              height: (i % 3 + 1) * 3 + 'px',
              backgroundColor: i % 2 === 0 ? primaryColor : accentColor,
              left: \`\${15 + (i * 17)}%\`,
              top: \`\${20 + (i * 13)}%\`,
              opacity: 0.3,
              filter: "blur(2px)"
            }}
            animate={{
              y: [0, -30, 0],
              opacity: [0.1, 0.5, 0.1]
            }}
            transition={{
              duration: 4 + (i % 3),
              repeat: Infinity,
              ease: "easeInOut",
              delay: i * 0.5
            }}
          />
        ))}
      </div>

      {/* Dynamic Lanyard SVG (Centered origin) */}
      <div className="absolute top-1/2 left-1/2 w-0 h-0 z-0 pointer-events-none">
        <svg className="overflow-visible w-0 h-0 pointer-events-none">
          <motion.path
            d={lanyardPath}
            fill="none"
            stroke="url(#lanyard-gradient)"
            strokeWidth="8"
            strokeLinecap="round"
            style={{ filter: "drop-shadow(0px 10px 10px rgba(0,0,0,0.5))" }}
          />
          <defs>
            <linearGradient id="lanyard-gradient" x1="0%" y1="0%" x2="0%" y2="100%">
              <stop offset="0%" stopColor="#111" />
              <stop offset="100%" stopColor={primaryColor} />
            </linearGradient>
          </defs>
        </svg>
      </div>

      {/* The Badge */}
      <motion.div
        style={{
          x,
          y,
          rotateX,
          rotateY,
          transformStyle: "preserve-3d"
        }}
        drag
        dragConstraints={{ left: 0, right: 0, top: 0, bottom: 0 }}
        dragElastic={0.4}
        whileHover={{ scale: 1.02 }}
        whileDrag={{ scale: 1.05, cursor: "grabbing" }}
        className="relative z-10 w-[260px] h-[360px] cursor-grab"
      >
        {/* Badge Glass Body */}
        <div className="absolute inset-0 rounded-3xl bg-white/[0.03] backdrop-blur-xl border border-white/10 overflow-hidden shadow-2xl flex flex-col">

          {/* Subtle noise texture */}
          <div className="absolute inset-0 opacity-[0.04] mix-blend-overlay pointer-events-none bg-[url('https://grainy-gradients.vercel.app/noise.svg')]" />

          {/* Top Metallic Clip Section */}
          <div className="h-16 w-full border-b border-white/10 bg-white/[0.02] relative flex items-center justify-center">
            {/* The Hole for Lanyard */}
            <div className="w-14 h-3 rounded-full bg-black/60 shadow-inner border border-white/5 absolute top-3" />
            <div className="mt-6 font-mono text-[10px] text-white/30 tracking-[0.2em]">{companyName}</div>
          </div>

          {/* Holographic Element */}
          <div className="absolute top-20 right-5 w-12 h-12 rounded-full border border-white/10 flex items-center justify-center bg-black/40 overflow-hidden shadow-inner">
            <motion.div
              animate={{ rotate: 360 }}
              transition={{ duration: 8, repeat: Infinity, ease: "linear" }}
              className="w-full h-full"
              style={{
                background: \`conic-gradient(from 0deg, transparent 0%, \${accentColor} 50%, transparent 100%)\`,
                opacity: 0.8
              }}
            />
            <div className="absolute inset-[2px] rounded-full bg-[#111] flex items-center justify-center shadow-inner border border-white/5">
              <div className="w-3 h-3 rounded-full bg-white/20 animate-pulse" />
            </div>
          </div>

          {/* Profile Section */}
          <div className="px-6 pt-6 flex-1 flex flex-col justify-end pb-6 relative z-10">
            {/* Avatar Mock */}
            <div className="w-20 h-20 rounded-2xl mb-4 bg-gradient-to-br from-white/10 to-transparent border border-white/10 p-1 backdrop-blur-md shadow-lg">
              <div className="w-full h-full rounded-xl bg-[#0a0a0a] overflow-hidden relative flex items-end justify-center">
                <div className="absolute inset-0 opacity-30" style={{ background: \`linear-gradient(135deg, \${primaryColor}, \${accentColor})\` }} />
                <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5" className="w-16 h-16 text-white/60 translate-y-3">
                  <path strokeLinecap="round" strokeLinejoin="round" d="M16 7a4 4 0 11-8 0 4 4 0 018 0zM12 14a7 7 0 00-7 7h14a7 7 0 00-7-7z" />
                </svg>
              </div>
            </div>

            <div className="space-y-1 mb-6">
              <h2 className="font-['Outfit'] text-2xl font-bold text-white tracking-tight uppercase leading-none drop-shadow-md">{name}</h2>
              <p className="font-mono text-[10px] text-white/60 tracking-wider" style={{ color: primaryColor }}>{role}</p>
            </div>

            <div className="pt-4 border-t border-white/10 flex justify-between items-end">
              <div>
                <p className="font-mono text-[8px] text-white/40 mb-1">ID NO.</p>
                <p className="font-mono text-xs text-white/80">{idNumber}</p>
              </div>

              {/* Barcode Mock */}
              <div className="flex gap-[2px] h-6 opacity-50">
                {[2,1,3,1,1,2,3,1,2,1].map((w, i) => (
                  <div key={i} className="bg-white h-full rounded-sm" style={{ width: \`\${w * 2}px\` }} />
                ))}
              </div>
            </div>
          </div>

          {/* Bottom Edge LED Strip */}
          <div className="h-[3px] w-full mt-auto" style={{ background: \`linear-gradient(90deg, \${primaryColor}, \${accentColor})\`, boxShadow: \`0 -5px 15px \${primaryColor}40\` }} />
        </div>

        {/* 3D Glare Overlay Effect */}
        <motion.div
          className="absolute inset-0 rounded-3xl pointer-events-none mix-blend-overlay"
          style={{
            background: useTransform(
              [springX, springY],
              ([x, y]) => {
                // Normalize position relative to drag bounds
                const posX = ((x as number) + 300) / 600 * 100;
                const posY = ((y as number) + 300) / 600 * 100;
                return \`radial-gradient(circle at \${posX}% \${posY}%, rgba(255,255,255,0.4) 0%, transparent 50%)\`;
              }
            )
          }}
        />
      </motion.div>
    </div>
  );
};
`,
      componentPath: "TactileCyberBadge",
    scrollable: false,
    usageCode: `import { TactileCyberBadge } from "@/components/community/demos/TactileCyberBadge";

export default function MyPage() {
  return (
    <div className="w-full flex justify-center items-center py-20 bg-black">
      <TactileCyberBadge />
    </div>
  );
}`,
  },
{
      id: "hyperdrive-widget",
      slug: "hyperdrive-widget",
      title: "HyperDrive Widget",
      description: "A highly interactive, futuristic widget featuring a central magnetic core and orbiting rings that react to hover and click.",
      category: "Widgets",
      tags: ["Framer Motion", "Interactive", "Premium", "Cyber"],
      cliCommand: "npx @melonui-dev/cli add hyperdrive-widget",
      componentPath: "HyperDriveWidget",
      scrollable: false,
      codeSnippet: `"use client";

import React, { useRef, useState, useEffect } from "react";
import { motion, useMotionValue, useSpring, useTransform, AnimatePresence } from "framer-motion";

export interface HyperDriveWidgetProps extends React.ComponentPropsWithoutRef<"div"> {
  title?: string;
  statusText?: string;
  primaryColor?: string;
  secondaryColor?: string;
  glowColor?: string;
  size?: number;
}

export const HyperDriveWidget = React.forwardRef<HTMLDivElement, HyperDriveWidgetProps>(
  (
    {
      title = "HYPERDRIVE CORE",
      statusText = "IDLE",
      primaryColor = "#00f0ff",
      secondaryColor = "#ff5c71",
      glowColor = "#7fff5e",
      size = 360,
      className = "",
      style,
      ...props
    },
    forwardedRef
  ) => {
    const internalRef = useRef<HTMLDivElement>(null);
    const ref = (forwardedRef as React.RefObject<HTMLDivElement>) || internalRef;

    const [isHovered, setIsHovered] = useState(false);
    const [isActive, setIsActive] = useState(false);

    // Mouse tracking for magnetic pull and 3D tilt
    const mouseX = useMotionValue(0.5);
    const mouseY = useMotionValue(0.5);

    // Smooth physics for the core
    const springConfig = { damping: 20, stiffness: 150, mass: 0.8 };
    const smoothX = useSpring(mouseX, springConfig);
    const smoothY = useSpring(mouseY, springConfig);

    // 3D Tilt transforms
    const rotateX = useTransform(smoothY, [0, 1], [isHovered ? 20 : 0, isHovered ? -20 : 0]);
    const rotateY = useTransform(smoothX, [0, 1], [isHovered ? -20 : 0, isHovered ? 20 : 0]);

    // Magnetic pull for the core
    const coreX = useTransform(smoothX, [0, 1], [isHovered ? -30 : 0, isHovered ? 30 : 0]);
    const coreY = useTransform(smoothY, [0, 1], [isHovered ? -30 : 0, isHovered ? 30 : 0]);

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
      setIsActive(false);
      mouseX.set(0.5);
      mouseY.set(0.5);
    };

    // Calculate dynamic colors based on state
    const currentPrimary = isActive ? glowColor : isHovered ? primaryColor : "rgba(255,255,255,0.2)";
    const currentStatus = isActive ? "JUMPING" : isHovered ? "CHARGING" : statusText;

    return (
      <div
        ref={ref}
        className={\`relative perspective-[1000px] flex items-center justify-center \${className}\`}
        style={{ width: size, height: size, ...style }}
        onMouseMove={handleMouseMove}
        onMouseLeave={handleMouseLeave}
        onMouseEnter={() => setIsHovered(true)}
        onMouseDown={() => setIsActive(true)}
        onMouseUp={() => setIsActive(false)}
        onTouchStart={() => setIsActive(true)}
        onTouchEnd={() => setIsActive(false)}
        {...props}
      >
        <motion.div
          className="w-full h-full relative preserve-3d"
          style={{
            rotateX,
            rotateY,
            transformStyle: "preserve-3d",
          }}
        >
          {/* Background Glass Plate */}
          <div className="absolute inset-0 rounded-[2.5rem] bg-black/40 border border-white/10 backdrop-blur-xl shadow-2xl overflow-hidden">
            {/* Ambient background glow */}
            <motion.div
              className="absolute inset-0 opacity-30"
              animate={{
                background: isActive
                  ? \`radial-gradient(circle at 50% 50%, \${glowColor}40 0%, transparent 70%)\`
                  : isHovered
                  ? \`radial-gradient(circle at 50% 50%, \${primaryColor}30 0%, transparent 60%)\`
                  : \`radial-gradient(circle at 50% 50%, rgba(255,255,255,0.05) 0%, transparent 50%)\`
              }}
              transition={{ duration: 0.5 }}
            />

            {/* Noise Texture */}
            <div
              className="absolute inset-0 opacity-[0.04] mix-blend-overlay pointer-events-none"
              style={{ backgroundImage: "url('data:image/svg+xml;utf8,%3Csvg viewBox=%220 0 200 200%22 xmlns=%22http://www.w3.org/2000/svg%22%3E%3Cfilter id=%22noiseFilter%22%3E%3CfeTurbulence type=%22fractalNoise%22 baseFrequency=%220.8%22 numOctaves=%223%22 stitchTiles=%22stitch%22/%3E%3C/filter%3E%3Crect width=%22100%25%22 height=%22100%25%22 filter=%22url(%23noiseFilter)%22/%3E%3C/svg%3E')" }}
            />

            {/* Corner Accents */}
            <div className="absolute top-4 left-4 w-2 h-2 rounded-full border border-white/30" />
            <div className="absolute top-4 right-4 w-2 h-2 rounded-full border border-white/30" />
            <div className="absolute bottom-4 left-4 w-2 h-2 rounded-full border border-white/30" />
            <div className="absolute bottom-4 right-4 w-2 h-2 rounded-full border border-white/30" />

            {/* Header Text */}
            <div className="absolute top-6 left-0 right-0 flex flex-col items-center pointer-events-none">
               <motion.span
                 className="text-white/80 font-bold tracking-[0.2em] text-sm"
                 animate={{ textShadow: isHovered ? \`0 0 10px \${currentPrimary}\` : "none" }}
               >
                 {title}
               </motion.span>
               <motion.span
                 className="font-mono text-[10px] tracking-widest mt-1 uppercase"
                 animate={{ color: isActive ? glowColor : isHovered ? primaryColor : "rgba(255,255,255,0.4)" }}
               >
                 {currentStatus}
               </motion.span>
            </div>
          </div>

          {/* Orbiting Rings System */}
          <div className="absolute inset-0 flex items-center justify-center pointer-events-none" style={{ transform: "translateZ(30px)" }}>

            {/* Outer Ring */}
            <motion.div
              className="absolute rounded-full border border-dashed opacity-30"
              style={{ width: size * 0.75, height: size * 0.75, borderColor: currentPrimary }}
              animate={{
                rotate: isActive ? 360 : 0,
                scale: isActive ? 1.1 : isHovered ? 1.05 : 1,
              }}
              transition={{
                rotate: { duration: isActive ? 1 : 10, repeat: Infinity, ease: "linear" },
                scale: { type: "spring", stiffness: 200, damping: 20 }
              }}
            />

            {/* Middle Ring */}
            <motion.div
              className="absolute rounded-full border-2 border-transparent opacity-50"
              style={{
                width: size * 0.6,
                height: size * 0.6,
                borderTopColor: secondaryColor,
                borderBottomColor: secondaryColor
              }}
              animate={{
                rotate: isActive ? -360 : 0,
                scale: isActive ? 0.9 : isHovered ? 0.95 : 1,
              }}
              transition={{
                rotate: { duration: isActive ? 0.8 : 8, repeat: Infinity, ease: "linear" },
                scale: { type: "spring", stiffness: 200, damping: 20 }
              }}
            />

            {/* Inner Data Track */}
            <motion.svg
              className="absolute"
              style={{ width: size * 0.45, height: size * 0.45 }}
              viewBox="0 0 100 100"
              animate={{ rotate: isActive ? 360 : 0 }}
              transition={{ duration: isActive ? 0.5 : 20, repeat: Infinity, ease: "linear" }}
            >
              <circle cx="50" cy="50" r="48" fill="none" stroke="rgba(255,255,255,0.1)" strokeWidth="1" />
              <circle
                cx="50" cy="50" r="48"
                fill="none"
                stroke={currentPrimary}
                strokeWidth="2"
                strokeDasharray={isActive ? "20 10" : "50 250"}
                strokeLinecap="round"
              />
            </motion.svg>
          </div>

          {/* Central Magnetic Core */}
          <motion.div
            className="absolute inset-0 flex items-center justify-center cursor-pointer z-10"
            style={{ x: coreX, y: coreY, transform: "translateZ(60px)" }}
          >
             <motion.div
               className="relative rounded-full flex items-center justify-center backdrop-blur-md overflow-hidden"
               style={{
                 width: size * 0.25,
                 height: size * 0.25,
                 background: "rgba(0,0,0,0.5)",
                 border: \`1px solid \${currentPrimary}\`,
                 boxShadow: isActive ? \`0 0 40px \${glowColor}\` : isHovered ? \`0 0 20px \${primaryColor}\` : \`0 0 10px rgba(0,0,0,0.5)\`
               }}
               whileHover={{ scale: 1.1 }}
               whileTap={{ scale: 0.9 }}
             >
               {/* Core Center Pulse */}
               <motion.div
                 className="w-1/2 h-1/2 rounded-full blur-md"
                 animate={{
                   backgroundColor: currentPrimary,
                   scale: isActive ? [1, 1.5, 1] : [1, 1.2, 1],
                   opacity: isActive ? 1 : 0.6
                 }}
                 transition={{ duration: isActive ? 0.5 : 2, repeat: Infinity, ease: "easeInOut" }}
               />

               {/* Cybernetic details inside core */}
               <div className="absolute inset-0 flex items-center justify-center pointer-events-none">
                 <div className="w-1/3 h-px bg-white/50 absolute" style={{ transform: "rotate(45deg)" }} />
                 <div className="w-1/3 h-px bg-white/50 absolute" style={{ transform: "rotate(-45deg)" }} />
                 <div className="w-2 h-2 bg-white rounded-full z-10 shadow-[0_0_10px_white]" />
               </div>
             </motion.div>
          </motion.div>

          {/* Scanning Line Effect on Active */}
          <AnimatePresence>
            {isActive && (
              <motion.div
                initial={{ top: "0%", opacity: 0 }}
                animate={{ top: "100%", opacity: 0.5 }}
                exit={{ opacity: 0 }}
                transition={{ duration: 0.8, repeat: Infinity, ease: "linear" }}
                className="absolute left-0 right-0 h-1 bg-gradient-to-r from-transparent via-white to-transparent pointer-events-none"
                style={{ transform: "translateZ(80px)", boxShadow: \`0 0 20px \${glowColor}\` }}
              />
            )}
          </AnimatePresence>

        </motion.div>
      </div>
    );
  }
);

HyperDriveWidget.displayName = "HyperDriveWidget";
`,
      usageCode: `import { HyperDriveWidget } from "@/components/community/demos/HyperDriveWidget";

export default function Demo() {
  return (
    <div className="flex items-center justify-center p-12 min-h-[500px]">
      <HyperDriveWidget
        title="HYPERDRIVE CORE"
        primaryColor="#00f0ff"
        secondaryColor="#ff5c71"
        glowColor="#7fff5e"
      />
    </div>
  );
}`,
      props: [
        {
          name: "title",
          type: "string",
          defaultValue: `"HYPERDRIVE CORE"`,
          description: "The main title displayed inside the widget.",
          control: { type: "text" }
        },
        {
          name: "statusText",
          type: "string",
          defaultValue: `"IDLE"`,
          description: "The default status text shown under the title.",
          control: { type: "text" }
        },
        {
          name: "size",
          type: "number",
          defaultValue: "360",
          description: "The width and height of the widget container.",
          control: { type: "slider", min: 200, max: 600, step: 10 }
        },
        {
          name: "primaryColor",
          type: "string",
          defaultValue: `"#00f0ff"`,
          description: "The primary neon color used for the core and rings during hover.",
          control: { type: "color" }
        },
        {
          name: "secondaryColor",
          type: "string",
          defaultValue: `"#ff5c71"`,
          description: "The secondary neon color used for the middle ring.",
          control: { type: "color" }
        },
        {
          name: "glowColor",
          type: "string",
          defaultValue: `"#7fff5e"`,
          description: "The neon glow color used during active (clicked) state.",
          control: { type: "color" }
        }
      ]
    },
{
      id: "kinetic-swing-tag",
      slug: "kinetic-swing-tag",
      title: "Kinetic Swing Tag",
      description: "A Gen-Z digital streetwear fashion tag with realistic string physics, draggable swinging motion, and holographic glare.",
      category: "Cards",
      tags: ["Framer Motion", "Physics", "Gen-Z", "Streetwear", "Interactive"],
      cliCommand: "npx @melonui-dev/cli add kinetic-swing-tag",
      codeSnippet: `"use client";

import React, { useRef, useState, useEffect } from "react";
import { motion, useMotionValue, useSpring, useTransform, useVelocity, useAnimationFrame } from "framer-motion";

export interface KineticSwingTagProps extends React.ComponentPropsWithoutRef<"div"> {
  tagWidth?: number;
  tagHeight?: number;
  primaryColor?: string;
  secondaryColor?: string;
  brandName?: string;
  seriesText?: string;
}

export function KineticSwingTag({
  tagWidth = 260,
  tagHeight = 400,
  primaryColor = "#ff5c71",
  secondaryColor = "#7fff5e",
  brandName = "MELON",
  seriesText = "S/S 2024 ARCHIVE",
  className = "",
  style,
  ...props
}: KineticSwingTagProps) {
  const containerRef = useRef<HTMLDivElement>(null);
  const tagRef = useRef<HTMLDivElement>(null);

  const [mounted, setMounted] = useState(false);

  // Positioning
  const x = useMotionValue(0);
  const y = useMotionValue(0);

  // Physics config
  const springConfig = { damping: 15, stiffness: 120, mass: 1.5 };

  // Springs for the tag's physical position
  const springX = useSpring(x, springConfig);
  const springY = useSpring(y, springConfig);

  // We keep springY if we want to use its value or velocity for additional physics later,
  // but we can also safely use it in the style tag for y if we want physical dampening on Y as well.

  // Calculate velocity for realistic swing
  const xVelocity = useVelocity(springX);

  // Map horizontal velocity to rotation angle (swinging effect)
  const rotateZ = useTransform(xVelocity, [-1000, 1000], [-35, 35]);
  const smoothRotateZ = useSpring(rotateZ, { damping: 20, stiffness: 200 });

  // Springy string attachment point
  const [stringPath, setStringPath] = useState("");

  // Holographic glare tracking
  const glareX = useMotionValue(50);
  const glareY = useMotionValue(50);
  const glareOpacity = useMotionValue(0);

  const glareBackground = useTransform(
    [glareX, glareY],
    ([gx, gy]) =>
      \`radial-gradient(circle at \${gx}% \${gy}%, rgba(255,255,255,0.8) 0%, transparent 60%)\`
  );

  useEffect(() => {
    const t = setTimeout(() => setMounted(true), 0);
    return () => clearTimeout(t);
  }, []);

  // Animate the string path every frame to follow the tag
  useAnimationFrame(() => {
    if (!tagRef.current || !containerRef.current) return;

    const containerRect = containerRef.current.getBoundingClientRect();

    // Top anchor point (center top of container)
    const anchorX = containerRect.width / 2;
    const anchorY = 0;

    // Actually, getting the real eyelet position from the DOM is more accurate
    const eyeletEl = tagRef.current.querySelector('.eyelet') as HTMLElement;
    if (eyeletEl) {
      const eyeletRect = eyeletEl.getBoundingClientRect();
      const targetX = eyeletRect.left + eyeletRect.width / 2 - containerRect.left;
      const targetY = eyeletRect.top + eyeletRect.height / 2 - containerRect.top;

      // Calculate a bezier curve that hangs slightly
      const cp1X = anchorX;
      const cp1Y = targetY * 0.4;
      const cp2X = targetX;
      const cp2Y = targetY * 0.6;

      setStringPath(\`M \${anchorX} \${anchorY} C \${cp1X} \${cp1Y}, \${cp2X} \${cp2Y}, \${targetX} \${targetY}\`);
    }
  });


  const handleMouseMove = (e: React.MouseEvent<HTMLDivElement>) => {
    if (!tagRef.current) return;
    const rect = tagRef.current.getBoundingClientRect();
    const xPct = ((e.clientX - rect.left) / rect.width) * 100;
    const yPct = ((e.clientY - rect.top) / rect.height) * 100;
    glareX.set(xPct);
    glareY.set(yPct);
  };

  if (!mounted) return null;

  return (
    <div
      ref={containerRef}
      className={\`relative w-full h-[600px] overflow-hidden bg-[#050505] flex items-center justify-center font-['Outfit'] \${className}\`}
      style={style}
      {...props}
    >
      {/* Background ambient light */}
      <div className="absolute inset-0 opacity-20 pointer-events-none">
        <div className="absolute top-0 left-1/2 -translate-x-1/2 w-[600px] h-[600px] bg-gradient-to-b from-white/10 to-transparent blur-3xl rounded-full mix-blend-screen" />
      </div>

      {/* The String */}
      <svg className="absolute inset-0 w-full h-full pointer-events-none z-10" style={{ overflow: 'visible' }}>
        <path
          d={stringPath}
          fill="none"
          stroke="rgba(255,255,255,0.4)"
          strokeWidth="2"
          strokeLinecap="round"
          style={{ filter: 'drop-shadow(0px 10px 10px rgba(0,0,0,0.5))' }}
        />
        {/* Top anchor ring */}
        <circle cx="50%" cy="0" r="6" fill="transparent" stroke="rgba(255,255,255,0.5)" strokeWidth="3" />
        <circle cx="50%" cy="0" r="10" fill="transparent" stroke="#111" strokeWidth="4" />
      </svg>

      {/* The Tag Draggable Container */}
      <motion.div
        drag
        dragElastic={0.2}
        dragConstraints={containerRef}
        dragMomentum={true}
        dragTransition={{ bounceStiffness: 200, bounceDamping: 20 }}
        style={{
          x: springX,
          y: springY,
          rotateZ: smoothRotateZ,
          cursor: "grab",
          touchAction: "none"
        }}
        whileDrag={{ cursor: "grabbing", scale: 1.02 }}
        className="relative z-20 mt-12"
      >
        {/* The Tag Element */}
        <div
          ref={tagRef}
          onMouseMove={handleMouseMove}
          onMouseEnter={() => glareOpacity.set(1)}
          onMouseLeave={() => glareOpacity.set(0)}
          className="relative rounded-2xl overflow-hidden backdrop-blur-2xl shadow-[0_30px_60px_rgba(0,0,0,0.6),0_0_0_1px_rgba(255,255,255,0.1)_inset]"
          style={{
            width: tagWidth,
            height: tagHeight,
            backgroundColor: "rgba(20, 20, 22, 0.7)",
            transformOrigin: "top center",
          }}
        >
          {/* Holographic Glare */}
          <motion.div
            className="absolute inset-0 pointer-events-none z-50 mix-blend-overlay transition-opacity duration-300"
            style={{
              opacity: glareOpacity,
              background: glareBackground as unknown as string,
            }}
          />

          {/* Internal gradient lighting */}
          <div
            className="absolute inset-0 opacity-40 pointer-events-none"
            style={{
              background: \`linear-gradient(135deg, \${primaryColor}40 0%, transparent 50%, \${secondaryColor}40 100%)\`
            }}
          />

          {/* The Metal Eyelet */}
          <div className="absolute top-6 left-1/2 -translate-x-1/2 w-8 h-8 rounded-full bg-[#111] border-[6px] border-[#555] shadow-[inset_0_2px_10px_rgba(0,0,0,1),0_2px_4px_rgba(255,255,255,0.1)] flex items-center justify-center z-20 eyelet">
            <div className="w-2 h-2 rounded-full bg-black shadow-[inset_0_1px_3px_rgba(0,0,0,0.8)]" />
          </div>

          {/* Top Section */}
          <div className="pt-20 px-6 pb-20 h-full flex flex-col justify-between relative z-10">
            <div>
              <div className="flex justify-between items-start mb-6">
                <span className="text-[10px] tracking-[0.2em] text-white/40 font-mono">AUTH_ID: X92-B</span>
                <span className="text-[10px] tracking-widest text-white/40 font-mono border border-white/20 px-2 py-0.5 rounded-sm">01</span>
              </div>

              <h2 className="text-5xl font-black text-white tracking-tighter mb-2" style={{ fontFamily: "Anton, sans-serif" }}>
                {brandName}
              </h2>

              <div className="inline-block bg-white text-black text-[10px] font-bold px-2 py-1 mb-6 tracking-widest">
                {seriesText}
              </div>

              <div className="space-y-4 font-mono text-[11px] text-white/60">
                <div className="flex justify-between border-b border-white/10 pb-1">
                  <span>MATERIAL</span>
                  <span className="text-white">GLASS / POLY</span>
                </div>
                <div className="flex justify-between border-b border-white/10 pb-1">
                  <span>FIT</span>
                  <span className="text-white">OVERSIZED</span>
                </div>
                <div className="flex justify-between border-b border-white/10 pb-1">
                  <span>WASH</span>
                  <span className="text-white">DO NOT WASH</span>
                </div>
              </div>
            </div>

            {/* Bottom Barcode Section */}
            <div className="mt-8">
              <div className="w-full h-12 flex gap-[2px] opacity-80 mix-blend-screen">
                {/* Generated Barcode lines */}
                {Array.from({ length: 30 }).map((_, i) => (
                  <div
                    key={i}
                    className="h-full bg-white"
                    style={{
                      width: \`\${Math.sin(i * 0.5) * 3 + 4}px\`,
                      opacity: Math.cos(i) > 0 ? 1 : 0.6
                    }}
                  />
                ))}
              </div>
              <div className="flex justify-between mt-2 font-mono text-[9px] text-white/40 tracking-[0.3em]">
                <span>8</span>
                <span>40291</span>
                <span>89320</span>
                <span>2</span>
              </div>
            </div>
          </div>

          {/* Perforated bottom tear line */}
          <div className="absolute bottom-16 left-0 w-full flex items-center justify-between px-2">
            <div className="w-3 h-3 rounded-full bg-[#050505] -ml-4 shadow-[inset_0_2px_4px_rgba(0,0,0,0.5)]" />
            <div className="flex-1 border-t-2 border-dashed border-white/20 mx-2" />
            <div className="w-3 h-3 rounded-full bg-[#050505] -mr-4 shadow-[inset_0_2px_4px_rgba(0,0,0,0.5)]" />
          </div>

          {/* Tear-off slip content */}
          <div className="absolute bottom-0 left-0 w-full h-16 bg-white/5 backdrop-blur-md flex items-center justify-center border-t border-white/10">
            <span className="font-mono text-[10px] tracking-[0.2em] text-[#ff5c71] font-bold">
              [ DETACH BEFORE WEARING ]
            </span>
          </div>

        </div>
      </motion.div>
    </div>
  );
}
`,
      componentPath: "KineticSwingTag",
      props: [
        { name: "primaryColor", type: "string", defaultValue: `"#ff5c71"`, description: "Left accent gradient color.", control: { type: "color" } },
        { name: "secondaryColor", type: "string", defaultValue: `"#7fff5e"`, description: "Right accent gradient color.", control: { type: "color" } },
        { name: "brandName", type: "string", defaultValue: `"MELON"`, description: "The central brand text.", control: { type: "text" } },
        { name: "seriesText", type: "string", defaultValue: `"S/S 2024 ARCHIVE"`, description: "The subtext collection label.", control: { type: "text" } }
      ]
    },
{
    id: "void-portal-reveal",
    slug: "void-portal-reveal",
    title: "Void Portal Reveal",
    description: "A highly interactive, gyroscopic 3D ring portal that massively scales on hover to simulate flying through, revealing a glassmorphic hidden dashboard or UI beneath.",
    category: "Backgrounds",
    tags: ["portal", "3d", "interactive", "reveal", "glassmorphism", "framer-motion", "gen-z"],
    cliCommand: "npx @melonui-dev/cli add void-portal-reveal",
    componentPath: "VoidPortalReveal",
    codeSnippet: `"use client";

import React, { useState, useRef } from "react";
import { motion, useMotionValue, useSpring, useTransform, AnimatePresence } from "framer-motion";

export interface VoidPortalRevealProps extends React.ComponentPropsWithoutRef<"div"> {
  portalText?: string;
  primaryColor?: string;
  secondaryColor?: string;
  accentColor?: string;
  revealedContent?: React.ReactNode;
}

export function VoidPortalReveal({
  portalText = "ENTER THE VOID",
  primaryColor = "#ff5c71",
  secondaryColor = "#7fff5e",
  accentColor = "#00f0ff",
  revealedContent,
  className = "",
  style,
  ...props
}: VoidPortalRevealProps) {
  const containerRef = useRef<HTMLDivElement>(null);
  const [isRevealed, setIsRevealed] = useState(false);
  const [isHovered, setIsHovered] = useState(false);

  const mouseX = useMotionValue(0);
  const mouseY = useMotionValue(0);

  // Smooth out the mouse values
  const smoothX = useSpring(mouseX, { stiffness: 50, damping: 20 });
  const smoothY = useSpring(mouseY, { stiffness: 50, damping: 20 });

  // Map mouse position to rotation and translation
  const rotateX = useTransform(smoothY, [-0.5, 0.5], [20, -20]);
  const rotateY = useTransform(smoothX, [-0.5, 0.5], [-20, 20]);

  const handleMouseMove = (e: React.MouseEvent<HTMLDivElement>) => {
    if (!containerRef.current || isRevealed) return;
    const rect = containerRef.current.getBoundingClientRect();
    const x = (e.clientX - rect.left) / rect.width - 0.5;
    const y = (e.clientY - rect.top) / rect.height - 0.5;
    mouseX.set(x);
    mouseY.set(y);
  };

  const handleMouseLeave = () => {
    if (!isRevealed) {
      mouseX.set(0);
      mouseY.set(0);
    }
    setIsHovered(false);
  };

  const handleMouseEnter = () => {
    setIsHovered(true);
  };

  // Generate rings
  const rings = Array.from({ length: 5 });

  const defaultRevealedContent = (
    <div className="flex flex-col items-center justify-center h-full w-full bg-black/40 backdrop-blur-xl rounded-2xl border border-white/10 p-8 shadow-[0_0_50px_rgba(0,0,0,0.8)] overflow-hidden relative">
      <div className="absolute inset-0 pointer-events-none opacity-[0.03]" style={{ backgroundImage: 'url("data:image/svg+xml,%3Csvg viewBox=%220 0 200 200%22 xmlns=%22http://www.w3.org/2000/svg%22%3E%3Cfilter id=%22noiseFilter%22%3E%3CfeTurbulence type=%22fractalNoise%22 baseFrequency=%220.65%22 numOctaves=%223%22 stitchTiles=%22stitch%22/%3E%3C/filter%3E%3Crect width=%22100%25%22 height=%22100%25%22 filter=%22url(%23noiseFilter)%22/%3E%3C/svg%3E")' }} />

      <motion.div
        initial={{ opacity: 0, y: 30, filter: "blur(10px)" }}
        animate={{ opacity: 1, y: 0, filter: "blur(0px)" }}
        transition={{ delay: 0.6, duration: 0.8, type: "spring" }}
        className="text-center space-y-6 relative z-10"
      >
        <div className="w-20 h-20 rounded-2xl border mx-auto flex items-center justify-center relative overflow-hidden" style={{ backgroundColor: \`\${primaryColor}10\`, borderColor: \`\${primaryColor}40\` }}>
          <div className="absolute inset-0 opacity-50" style={{ background: \`radial-gradient(circle at center, \${primaryColor} 0%, transparent 70%)\` }} />
          <span className="text-3xl relative z-10" style={{ color: primaryColor }}>✦</span>
        </div>

        <div>
          <h3 className="text-3xl font-black tracking-widest text-transparent bg-clip-text bg-gradient-to-r from-white to-gray-500">NEXUS OPEN</h3>
          <p className="text-xs text-gray-400 font-mono tracking-widest mt-2 uppercase">Secure Connection Established</p>
        </div>

        <div className="grid grid-cols-2 gap-3 w-full max-w-[240px] mx-auto mt-6">
          <div className="bg-white/5 border border-white/10 rounded-xl p-3 text-left backdrop-blur-sm relative overflow-hidden group">
            <div className="absolute inset-0 opacity-0 group-hover:opacity-20 transition-opacity" style={{ background: \`linear-gradient(to bottom right, \${secondaryColor}, transparent)\` }} />
            <div className="text-[10px] text-gray-500 font-mono mb-1">UPLINK</div>
            <div className="text-sm text-white font-bold tracking-wider" style={{ color: secondaryColor }}>99.9%</div>
          </div>
          <div className="bg-white/5 border border-white/10 rounded-xl p-3 text-left backdrop-blur-sm relative overflow-hidden group">
            <div className="absolute inset-0 opacity-0 group-hover:opacity-20 transition-opacity" style={{ background: \`linear-gradient(to bottom right, \${accentColor}, transparent)\` }} />
            <div className="text-[10px] text-gray-500 font-mono mb-1">LATENCY</div>
            <div className="text-sm text-white font-bold tracking-wider" style={{ color: accentColor }}>4ms</div>
          </div>
        </div>
      </motion.div>
    </div>
  );

  return (
    <div
      ref={containerRef}
      className={\`relative w-full max-w-[400px] aspect-[4/5] rounded-[2.5rem] overflow-hidden cursor-pointer group perspective-[1200px] bg-[#030303] shadow-2xl border border-white/5 \${className}\`}
      onMouseMove={handleMouseMove}
      onMouseLeave={handleMouseLeave}
      onMouseEnter={handleMouseEnter}
      onClick={() => setIsRevealed(!isRevealed)}
      style={style}
      {...props}
    >
      {/* Noise overlay for the outer card */}
      <div className="absolute inset-0 pointer-events-none opacity-[0.02] z-0" style={{ backgroundImage: 'url("data:image/svg+xml,%3Csvg viewBox=%220 0 200 200%22 xmlns=%22http://www.w3.org/2000/svg%22%3E%3Cfilter id=%22noiseFilter%22%3E%3CfeTurbulence type=%22fractalNoise%22 baseFrequency=%220.65%22 numOctaves=%223%22 stitchTiles=%22stitch%22/%3E%3C/filter%3E%3Crect width=%22100%25%22 height=%22100%25%22 filter=%22url(%23noiseFilter)%22/%3E%3C/svg%3E")' }} />

      {/* Deep Space Background */}
      <div className="absolute inset-0 opacity-40 bg-[radial-gradient(circle_at_50%_50%,_rgba(255,255,255,0.05)_0%,_transparent_60%)]" />

      {/* Portal Container */}
      <motion.div
        className="absolute inset-0 flex items-center justify-center transform-gpu"
        style={{
          rotateX: isRevealed ? 0 : rotateX,
          rotateY: isRevealed ? 0 : rotateY,
        }}
        animate={{
          scale: isRevealed ? 5 : 1,
          opacity: isRevealed ? 0 : 1,
          z: isRevealed ? 500 : 0,
        }}
        transition={{
          duration: 1.4,
          ease: [0.16, 1, 0.3, 1], // cinematic ease out
        }}
      >
        {/* Dynamic Rings */}
        {rings.map((_, i) => {
          const isOuter = i === rings.length - 1;
          const isInner = i === 0;
          return (
            <motion.div
              key={i}
              className="absolute rounded-full border transform-gpu"
              style={{
                width: \`\${(i + 1) * 22}%\`,
                height: \`\${(i + 1) * 22}%\`,
                borderColor: isOuter ? \`\${primaryColor}80\` : isInner ? \`\${secondaryColor}80\` : "rgba(255,255,255,0.15)",
                borderStyle: i % 2 === 0 ? "solid" : "dashed",
                boxShadow: isOuter ? \`0 0 40px \${primaryColor}30, inset 0 0 20px \${primaryColor}20\` : "none",
                borderWidth: isOuter ? "2px" : "1px",
              }}
              animate={{
                rotateZ: isHovered ? [0, i % 2 === 0 ? 180 : -180] : 0,
                rotateX: isHovered ? [0, 10, 0] : 0,
                rotateY: isHovered ? [0, -10, 0] : 0,
                scale: isHovered ? 1.05 + i * 0.03 : 1,
              }}
              transition={{
                rotateZ: {
                  duration: 15 - i * 1.5,
                  repeat: Infinity,
                  ease: "linear"
                },
                rotateX: {
                  duration: 5,
                  repeat: Infinity,
                  ease: "easeInOut"
                },
                rotateY: {
                  duration: 6,
                  repeat: Infinity,
                  ease: "easeInOut",
                  delay: 1
                },
                scale: {
                  duration: 0.8,
                  ease: "easeOut"
                }
              }}
            />
          );
        })}

        {/* Center Portal Text and Core */}
        <motion.div
          className="absolute z-10 flex flex-col items-center justify-center pointer-events-none"
          animate={{
            scale: isHovered ? 1.15 : 1,
            opacity: isHovered ? 1 : 0.7,
          }}
          transition={{ duration: 0.4 }}
        >
          <div className="relative flex flex-col items-center">
            <span className="text-sm font-black tracking-[0.5em] text-white z-10 relative drop-shadow-[0_0_10px_rgba(255,255,255,0.5)]">
              {portalText}
            </span>
            <span className="text-[8px] text-gray-500 font-mono tracking-widest mt-2 uppercase">
              Click to initiate
            </span>
            <motion.div
              className="absolute inset-0 blur-lg opacity-50 z-0"
              animate={{ opacity: isHovered ? 0.8 : 0.2 }}
              style={{ color: primaryColor }}
            >
              {portalText}
            </motion.div>
          </div>

          <motion.div
            className="w-16 h-[1px] mt-4 rounded-full"
            style={{ backgroundColor: primaryColor, boxShadow: \`0 0 10px \${primaryColor}\` }}
            animate={{
              width: isHovered ? 80 : 40,
              opacity: isHovered ? 1 : 0.3
            }}
          />
        </motion.div>

        {/* Deep Center Core Glow */}
        <motion.div
          className="absolute w-24 h-24 rounded-full blur-[40px] mix-blend-screen"
          style={{ backgroundColor: primaryColor }}
          animate={{
            opacity: isHovered ? 0.6 : 0.2,
            scale: isHovered ? 1.5 : 1,
          }}
          transition={{ duration: 1.2, ease: "easeOut" }}
        />

        <motion.div
          className="absolute w-12 h-12 rounded-full blur-[20px] mix-blend-screen"
          style={{ backgroundColor: secondaryColor }}
          animate={{
            opacity: isHovered ? 0.8 : 0,
            scale: isHovered ? 1.2 : 0.5,
          }}
          transition={{ duration: 0.8, delay: 0.1 }}
        />
      </motion.div>

      {/* Revealed Content */}
      <AnimatePresence>
        {isRevealed && (
          <motion.div
            className="absolute inset-0 z-20 flex items-center justify-center p-4"
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0, transition: { duration: 0.5 } }}
            transition={{ duration: 0.5, delay: 0.4 }}
          >
            {/* Backdrop for click-away */}
            <div
              className="absolute inset-0 bg-black/40 backdrop-blur-sm"
              onClick={(e) => { e.stopPropagation(); setIsRevealed(false); }}
            />

            <motion.div
              className="relative w-full h-full z-10 cursor-default"
              initial={{ scale: 0.8, opacity: 0, rotateX: 20 }}
              animate={{ scale: 1, opacity: 1, rotateX: 0 }}
              exit={{ scale: 1.1, opacity: 0 }}
              transition={{ duration: 0.7, delay: 0.5, type: "spring", bounce: 0.4 }}
              onClick={(e) => e.stopPropagation()}
            >
               {revealedContent || defaultRevealedContent}
            </motion.div>

            <motion.button
              initial={{ opacity: 0, scale: 0 }}
              animate={{ opacity: 1, scale: 1 }}
              exit={{ opacity: 0, scale: 0 }}
              transition={{ delay: 1 }}
              className="absolute top-6 right-6 z-30 w-10 h-10 rounded-full bg-white/5 hover:bg-white/20 border border-white/10 flex items-center justify-center text-white transition-all backdrop-blur-md"
              onClick={(e) => { e.stopPropagation(); setIsRevealed(false); }}
            >
              ✕
            </motion.button>
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
}
`,
      props: [
      {
        name: "portalText",
        type: "string",
        defaultValue: "ENTER THE VOID",
        description: "Text displayed in the center of the portal.",
        control: { type: "text" }
      },
      {
        name: "primaryColor",
        type: "string",
        defaultValue: "#ff5c71",
        description: "The main glow/accent color for the outer rings and center core.",
        control: { type: "color" }
      },
      {
        name: "secondaryColor",
        type: "string",
        defaultValue: "#7fff5e",
        description: "The secondary color used for inner rings and deep glow elements.",
        control: { type: "color" }
      },
      {
        name: "accentColor",
        type: "string",
        defaultValue: "#00f0ff",
        description: "The accent color used for secondary stats and highlights in the revealed dashboard.",
        control: { type: "color" }
      }
    ]
  },
{
    id: "holo-hexagon-map",
    slug: "holo-hexagon-map",
    title: "Holo Hexagon Map",
    description: "A 3D interactive, glassmorphic hexagon grid with magnetic hover and status nodes.",
    category: "Widgets",
    tags: ["hex", "grid", "3d", "interactive", "map", "nodes", "dashboard"],
    componentPath: "HoloHexagonMap",
    cliCommand: "npx melonui add HoloHexagonMap",
    codeSnippet: `"use client";

import React, { useRef, useState, useEffect } from "react";
import { motion, useMotionValue, useSpring, useTransform, AnimatePresence } from "framer-motion";

export interface HexNode {
  id: string;
  row: number;
  col: number;
  title?: string;
  icon?: React.ReactNode;
  status?: "online" | "offline" | "warning";
}

export interface HoloHexagonMapProps extends React.ComponentPropsWithoutRef<"div"> {
  nodes?: HexNode[];
  rows?: number;
  cols?: number;
  hexSize?: number;
  gap?: number;
  primaryColor?: string;
  accentColor?: string;
  warningColor?: string;
  onNodeClick?: (node: HexNode) => void;
}

const SQRT3 = Math.sqrt(3);

export function HoloHexagonMap({
  nodes = [
    { id: "core", row: 2, col: 2, title: "CORE", status: "online" },
    { id: "db", row: 1, col: 3, title: "DB_01", status: "online" },
    { id: "auth", row: 3, col: 1, title: "AUTH", status: "warning" },
    { id: "edge", row: 3, col: 3, title: "EDGE", status: "offline" },
    { id: "cache", row: 1, col: 1, title: "CACHE", status: "online" },
  ],
  rows = 5,
  cols = 5,
  hexSize = 48,
  gap = 4,
  primaryColor = "#7fff5e",
  accentColor = "#ff5c71",
  warningColor = "#f5a623",
  className = "",
  style,
  onNodeClick,
  ...props
}: HoloHexagonMapProps) {
  const containerRef = useRef<HTMLDivElement>(null);
  const [hoveredNode, setHoveredNode] = useState<string | null>(null);
  const [mounted, setMounted] = useState(false);

  useEffect(() => {
    setTimeout(() => {
      setMounted(true);
    }, 0);
  }, []);

  const mouseX = useMotionValue(0);
  const mouseY = useMotionValue(0);

  const handleMouseMove = (e: React.MouseEvent) => {
    if (!containerRef.current) return;
    const rect = containerRef.current.getBoundingClientRect();
    const x = e.clientX - rect.left - rect.width / 2;
    const y = e.clientY - rect.top - rect.height / 2;
    mouseX.set(x);
    mouseY.set(y);
  };

  const handleMouseLeave = () => {
    mouseX.set(0);
    mouseY.set(0);
  };

  const springConfig = { damping: 30, stiffness: 150, mass: 1 };
  const smoothX = useSpring(mouseX, springConfig);
  const smoothY = useSpring(mouseY, springConfig);

  const rotateX = useTransform(smoothY, [-300, 300], [15, -15]);
  const rotateY = useTransform(smoothX, [-300, 300], [-15, 15]);

  const hexWidth = SQRT3 * hexSize;
  const hexHeight = 2 * hexSize;
  const horizontalSpacing = hexWidth + gap;
  const verticalSpacing = (3 / 2) * hexSize + gap;

  const totalWidth = cols * horizontalSpacing + horizontalSpacing / 2;
  const totalHeight = rows * verticalSpacing + hexSize / 2;

  const getStatusColor = (status?: string) => {
    switch (status) {
      case "online":
        return primaryColor;
      case "warning":
        return warningColor;
      case "offline":
        return accentColor;
      default:
        return "rgba(255,255,255,0.1)";
    }
  };

  const getStatusGlow = (status?: string) => {
    const color = getStatusColor(status);
    return status && status !== "offline" ? \`0 0 15px \${color}80\` : "none";
  };

  const gridCells = [];
  for (let r = 0; r < rows; r++) {
    for (let c = 0; c < cols; c++) {
      gridCells.push({ row: r, col: c });
    }
  }

  const clipPath = "polygon(50% 0%, 100% 25%, 100% 75%, 50% 100%, 0% 75%, 0% 25%)";

  return (
    <div
      className={\`relative w-full h-[500px] bg-black overflow-hidden flex items-center justify-center font-['Outfit'] \${className}\`}
      onMouseMove={handleMouseMove}
      onMouseLeave={handleMouseLeave}
      ref={containerRef}
      style={{ perspective: 1200, ...style }}
      {...props}
    >
      <div className="absolute inset-0 bg-[radial-gradient(ellipse_at_center,_rgba(127,255,94,0.05)_0%,_rgba(0,0,0,1)_70%)] pointer-events-none" />

      <motion.div
        className="relative"
        style={{
          width: totalWidth,
          height: totalHeight,
          rotateX: mounted ? rotateX : 0,
          rotateY: mounted ? rotateY : 0,
          transformStyle: "preserve-3d",
        }}
      >
        {gridCells.map((cell) => {
          const node = nodes.find((n) => n.row === cell.row && n.col === cell.col);
          const x = cell.col * horizontalSpacing + (cell.row % 2 === 1 ? horizontalSpacing / 2 : 0);
          const y = cell.row * verticalSpacing;
          const isHovered = hoveredNode === (node ? node.id : \`\${cell.row}-\${cell.col}\`);
          const color = node ? getStatusColor(node.status) : "rgba(255,255,255,0.05)";
          const glow = node ? getStatusGlow(node.status) : "none";

          return (
            <motion.div
              key={node ? node.id : \`\${cell.row}-\${cell.col}\`}
              className={\`absolute transition-all duration-300 \${node ? "cursor-pointer z-10" : "z-0"}\`}
              style={{
                left: x,
                top: y,
                width: hexWidth,
                height: hexHeight,
                transformStyle: "preserve-3d",
              }}
              onMouseEnter={() => setHoveredNode(node ? node.id : \`\${cell.row}-\${cell.col}\`)}
              onMouseLeave={() => setHoveredNode(null)}
              onClick={() => node && onNodeClick && onNodeClick(node)}
              animate={{
                z: isHovered && node ? 30 : 0,
                scale: isHovered && node ? 1.1 : 1,
              }}
              transition={{ type: "spring", stiffness: 300, damping: 20 }}
            >
              {/* The Hexagon Shape */}
              <div
                className="absolute inset-0 bg-black/40 backdrop-blur-md flex flex-col items-center justify-center border-box transition-colors duration-300"
                style={{
                  clipPath,
                  backgroundColor: isHovered && !node ? "rgba(255,255,255,0.08)" : (node ? "rgba(20,20,20,0.8)" : "rgba(255,255,255,0.03)"),
                  boxShadow: node ? \`inset 0 0 20px \${color}30\` : "none",
                }}
              >
                {/* Border effect using an inner slightly smaller hex */}
                <div
                  className="absolute"
                  style={{
                    width: "96%",
                    height: "98%",
                    clipPath,
                    backgroundColor: "transparent",
                    border: \`1px solid \${isHovered && node ? color : color.replace("1)", "0.3)")}\`,
                    boxShadow: glow,
                  }}
                />

                {node && (
                  <motion.div
                    className="flex flex-col items-center gap-1"
                    initial={{ opacity: 0 }}
                    animate={{ opacity: 1 }}
                    transition={{ delay: 0.1 }}
                  >
                    <div
                      className="w-2 h-2 rounded-full mb-1"
                      style={{
                        backgroundColor: color,
                        boxShadow: \`0 0 8px \${color}\`,
                      }}
                    />
                    {node.title && (
                      <span
                        className="text-[10px] font-bold tracking-wider"
                        style={{ color: isHovered ? "#fff" : color }}
                      >
                        {node.title}
                      </span>
                    )}
                  </motion.div>
                )}
              </div>
            </motion.div>
          );
        })}
      </motion.div>

      {/* Floating Info Panel when a node is hovered */}
      <AnimatePresence>
        {hoveredNode && nodes.find((n) => n.id === hoveredNode) && (
          <motion.div
            initial={{ opacity: 0, y: 10, scale: 0.95 }}
            animate={{ opacity: 1, y: 0, scale: 1 }}
            exit={{ opacity: 0, y: 10, scale: 0.95 }}
            className="absolute bottom-8 right-8 bg-black/80 backdrop-blur-xl border p-4 min-w-[200px]"
            style={{
              borderColor: "rgba(255,255,255,0.1)",
              clipPath: "polygon(0 0, 100% 0, 100% calc(100% - 10px), calc(100% - 10px) 100%, 0 100%)"
            }}
          >
            {(() => {
              const node = nodes.find((n) => n.id === hoveredNode)!;
              const color = getStatusColor(node.status);
              return (
                <div className="flex flex-col gap-2 text-white">
                  <div className="flex items-center gap-2 border-b pb-2" style={{ borderColor: "rgba(255,255,255,0.1)" }}>
                     <div className="w-3 h-3 rounded-none bg-transparent border-2 animate-pulse" style={{ borderColor: color }} />
                     <span className="font-mono text-sm tracking-widest uppercase" style={{ color }}>
                       {node.title || "UNKNOWN"}
                     </span>
                  </div>
                  <div className="flex justify-between items-center text-xs text-white/50 font-mono mt-1">
                    <span>STATUS</span>
                    <span style={{ color }}>{node.status?.toUpperCase() || "N/A"}</span>
                  </div>
                  <div className="flex justify-between items-center text-xs text-white/50 font-mono mt-1">
                    <span>COORDS</span>
                    <span>[{node.row}, {node.col}]</span>
                  </div>
                </div>
              );
            })()}
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
}
`,
      props: [
      { name: "rows", type: "number", defaultValue: "4", description: "Number of hexagon rows.", control: { type: "slider", min: 2, max: 8, step: 1 } },
      { name: "cols", type: "number", defaultValue: "6", description: "Number of columns.", control: { type: "slider", min: 3, max: 12, step: 1 } },
      { name: "hexSize", type: "number", defaultValue: "60", description: "Hexagon cell size.", control: { type: "slider", min: 40, max: 100, step: 5 } },
      { name: "primaryColor", type: "string", defaultValue: "\"#ff5c71\"", description: "Primary accent color.", control: { type: "color" } },
      { name: "accentColor", type: "string", defaultValue: "\"#7fff5e\"", description: "Secondary accent color.", control: { type: "color" } }
    ]
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
