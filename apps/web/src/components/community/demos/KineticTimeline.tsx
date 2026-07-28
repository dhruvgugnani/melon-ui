"use client";

import * as React from "react";
import { useRef, useState, useEffect } from "react";
import { motion, useMotionValue, useSpring, useTransform } from "framer-motion";

export interface KineticTimelineItem {
  id: string;
  title: string;
  description: string;
  date: string;
  icon?: React.ReactNode;
}

export interface KineticTimelineProps extends React.ComponentPropsWithoutRef<"div"> {
  items?: KineticTimelineItem[];
  lineColor?: string;
  accentColor?: string;
  glowColor?: string;
}

const DEFAULT_ITEMS: KineticTimelineItem[] = [
  {
    id: "1",
    title: "System Initialization",
    description: "Core modules loaded and neural pathways synchronized. The mainframe is now online and awaiting further instructions from the primary terminal.",
    date: "2024.01.12",
    icon: (
      <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
        <path d="M12 2v20M17 5H9.5a3.5 3.5 0 0 0 0 7h5a3.5 3.5 0 0 1 0 7H6" />
      </svg>
    ),
  },
  {
    id: "2",
    title: "Quantum Decryption",
    description: "Successfully bypassed the outer firewalls. Extracting encrypted data fragments from the decentralized server cluster.",
    date: "2024.02.28",
    icon: (
      <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
        <rect x="3" y="11" width="18" height="11" rx="2" ry="2"></rect>
        <path d="M7 11V7a5 5 0 0 1 10 0v4"></path>
      </svg>
    ),
  },
  {
    id: "3",
    title: "Nexus Breach",
    description: "Unauthorized access detected in sector 7G. Initiating lockdown protocols and deploying counter-intrusion countermeasures.",
    date: "2024.04.05",
    icon: (
      <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
        <path d="M12 22s8-4 8-10V5l-8-3-8 3v7c0 6 8 10 8 10z"></path>
      </svg>
    ),
  },
  {
    id: "4",
    title: "Data Singularity",
    description: "All endpoints have converged into a single unified data stream. The singularity has been achieved. Awaiting physical manifestation.",
    date: "2024.06.19",
    icon: (
      <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
        <circle cx="12" cy="12" r="10"></circle>
        <circle cx="12" cy="12" r="6"></circle>
        <circle cx="12" cy="12" r="2"></circle>
      </svg>
    ),
  },
];

export function KineticTimeline({
  items = DEFAULT_ITEMS,
  lineColor = "rgba(255, 255, 255, 0.2)",
  accentColor = "#00f0ff",
  glowColor = "rgba(0, 240, 255, 0.5)",
  className = "",
  style,
  ...props
}: KineticTimelineProps) {
  const containerRef = useRef<HTMLDivElement>(null);
  const [containerHeight, setContainerHeight] = useState(0);

  // Mouse position relative to the container
  const mouseY = useMotionValue(0);
  const mouseX = useMotionValue(0);

  // Spring configurations for smooth physical movement
  const springConfig = { damping: 20, stiffness: 150, mass: 0.8 };
  const smoothMouseY = useSpring(mouseY, springConfig);
  const smoothMouseX = useSpring(mouseX, springConfig);

  useEffect(() => {
    if (!containerRef.current) return;
    const observer = new ResizeObserver((entries) => {
      for (const entry of entries) {
        setContainerHeight(entry.contentRect.height);
      }
    });
    observer.observe(containerRef.current);

    // Initial height
    setContainerHeight(containerRef.current.getBoundingClientRect().height);

    return () => observer.disconnect();
  }, []);

  const handleMouseMove = (e: React.MouseEvent) => {
    if (!containerRef.current) return;
    const rect = containerRef.current.getBoundingClientRect();
    const x = e.clientX - rect.left;
    const y = e.clientY - rect.top;

    mouseY.set(y);

    // Magnetic pull logic: only pull if within a certain X distance from center
    const centerX = 40; // The X position of the timeline line
    const distanceX = x - centerX;
    const pullRadius = 150;

    if (Math.abs(distanceX) < pullRadius) {
      // Gaussian-like falloff for magnetic pull
      const pullFactor = Math.exp(-(distanceX * distanceX) / (pullRadius * pullRadius * 0.5));
      mouseX.set(centerX + distanceX * pullFactor * 0.8);
    } else {
      mouseX.set(centerX);
    }
  };

  const handleMouseLeave = () => {
    mouseX.set(40); // Reset to center
  };

  // Generate SVG Path dynamically using useTransform
  const pathData = useTransform(
    [smoothMouseX, smoothMouseY],
    ([x, y]) => {
      // If containerHeight is 0, render a straight line
      const h = containerHeight || 500;

      // Control point logic for the bezier curve
      // The curve starts at (40, 0) and ends at (40, h)
      // The control point is at (x, y)
      // But we want it to look like a tense string, so a single Q curve works well

      return `M 40 0 Q ${x} ${y} 40 ${h}`;
    }
  );

  return (
    <div
      ref={containerRef}
      className={`relative w-full max-w-3xl mx-auto py-12 ${className}`}
      onMouseMove={handleMouseMove}
      onMouseLeave={handleMouseLeave}
      style={style}
      {...props}
    >
      {/* Background SVG for the magnetic line */}
      <div className="absolute inset-0 pointer-events-none overflow-visible">
        <svg
          className="w-full h-full"
          style={{ overflow: "visible" }}
        >
          {/* Chromatic Aberration - Red/Magenta Layer */}
          <motion.path
            d={pathData as unknown as string}
            fill="transparent"
            stroke="rgba(255, 0, 100, 0.4)"
            strokeWidth="2"
            style={{ translateX: -2 }}
            className="blur-[1px]"
          />
          {/* Chromatic Aberration - Cyan/Blue Layer */}
          <motion.path
            d={pathData as unknown as string}
            fill="transparent"
            stroke="rgba(0, 240, 255, 0.4)"
            strokeWidth="2"
            style={{ translateX: 2 }}
            className="blur-[1px]"
          />
          {/* Main Line */}
          <motion.path
            d={pathData as unknown as string}
            fill="transparent"
            stroke={lineColor}
            strokeWidth="1.5"
          />
        </svg>
      </div>

      {/* Timeline Items */}
      <div className="relative z-10 flex flex-col gap-24">
        {items.map((item) => {
          // Calculate node position along the curve
          // We don't mathematically trace the bezier exactly for the DOM elements to keep it performant,
          // instead we use a simplified horizontal pull based on the Y proximity to the mouse.

          return (
            <TimelineNode
              key={item.id}
              item={item}

              containerHeight={containerHeight}
              mouseY={smoothMouseY}
              mouseX={smoothMouseX}
              accentColor={accentColor}
              glowColor={glowColor}

            />
          );
        })}
      </div>
    </div>
  );
}

interface TimelineNodeProps {
  item: KineticTimelineItem;
  containerHeight: number;
  mouseY: import("framer-motion").MotionValue<number>;
  mouseX: import("framer-motion").MotionValue<number>;
  accentColor: string;
  glowColor: string;
}

function TimelineNode({
  item,

  containerHeight,
  mouseY,
  mouseX,
  accentColor,
  glowColor,

}: TimelineNodeProps) {
  const nodeRef = useRef<HTMLDivElement>(null);
  const [nodeY, setNodeY] = useState(0);

  useEffect(() => {
    if (!nodeRef.current) return;
    // Calculate the Y center of this node relative to its container
    // We can do this roughly by index since they are spaced evenly, but measuring is better.
    // However, since offsetTop requires the element to be rendered and settled, we can approximate:

    const updatePosition = () => {
      if (nodeRef.current) {
        setNodeY(nodeRef.current.offsetTop + nodeRef.current.offsetHeight / 2);
      }
    };

    updatePosition();
    window.addEventListener('resize', updatePosition);
    return () => window.removeEventListener('resize', updatePosition);
  }, [containerHeight]);

  // Calculate the X offset for this specific node based on mouse proximity
  // The bezier equation for X at given T: X(t) = (1-t)^2 * X0 + 2(1-t)t * X1 + t^2 * X2
  // X0 = 40, X2 = 40, X1 = smoothMouseX
  // Therefore X(t) = 40 * ((1-t)^2 + t^2) + smoothMouseX * 2(1-t)t
  // Let's calculate the horizontal shift.

  const nodeXShift = useTransform(
    [mouseX, mouseY],
    ([mx]) => {
      if (containerHeight === 0) return 0;

      const t = nodeY / containerHeight;
      const t_clamped = Math.max(0, Math.min(1, t));

      // Calculate X coordinate on the quadratic bezier curve
      const x0 = 40;
      const x2 = 40;
      const x1 = mx as number;

      const xt = Math.pow(1 - t_clamped, 2) * x0 + 2 * (1 - t_clamped) * t_clamped * x1 + Math.pow(t_clamped, 2) * x2;

      // We return the difference from the base center (40)
      return xt - 40;
    }
  );

  // 3D Tilt effect for the card based on mouse proximity
  const cardRotateX = useTransform(mouseY, (y) => {
    const distance = (y as number) - nodeY;
    if (Math.abs(distance) > 200) return 0;
    return (distance / 200) * -15; // Max 15 degree tilt
  });

  const cardRotateY = useTransform(mouseX, (x) => {
    const distance = (x as number) - 40; // distance from center
    return (distance / 150) * 10;
  });

  return (
    <div ref={nodeRef} className="relative flex items-center group">
      {/* Node Point that snaps to the curve */}
      <motion.div
        className="absolute left-[40px] w-0 h-0 flex items-center justify-center z-20 pointer-events-none"
        style={{ x: nodeXShift }}
      >
        <div
          className="w-3 h-3 rounded-full border-2 border-black bg-white transition-colors duration-300 group-hover:bg-black"
          style={{ borderColor: accentColor }}
        />
        {/* Glow behind the dot */}
        <div
          className="absolute w-8 h-8 rounded-full opacity-0 group-hover:opacity-100 transition-opacity duration-300 mix-blend-screen blur-md"
          style={{ backgroundColor: glowColor }}
        />
      </motion.div>

      {/* Content Card */}
      <motion.div
        className="ml-[100px] w-full"
        style={{
          perspective: 1000,
        }}
      >
        <motion.div
          className="relative p-6 rounded-2xl border border-white/5 bg-white/5 backdrop-blur-md overflow-hidden transition-colors duration-300 group-hover:border-white/20 group-hover:bg-white/10"
          style={{
            rotateX: cardRotateX,
            rotateY: cardRotateY,
            transformStyle: "preserve-3d",
          }}
        >
          {/* Subtle noise texture */}
          <div
            className="absolute inset-0 opacity-[0.03] mix-blend-overlay pointer-events-none"
            style={{
              backgroundImage: `url("data:image/svg+xml,%3Csvg viewBox='0 0 200 200' xmlns='http://www.w3.org/2000/svg'%3E%3Cfilter id='noiseFilter'%3E%3CfeTurbulence type='fractalNoise' baseFrequency='0.65' numOctaves='3' stitchTiles='stitch'/%3E%3C/filter%3E%3Crect width='100%25' height='100%25' filter='url(%23noiseFilter)'/%3E%3C/svg%3E")`,
            }}
          />

          <div className="relative z-10 flex flex-col md:flex-row md:items-center gap-4 mb-3">
            <div
              className="flex items-center justify-center w-10 h-10 rounded-xl bg-black/40 border border-white/10 text-white shadow-inner"
              style={{ color: accentColor }}
            >
              {item.icon}
            </div>
            <div>
              <div
                className="text-xs font-mono tracking-wider mb-1"
                style={{ color: accentColor }}
              >
                {item.date}
              </div>
              <h3 className="text-xl font-medium text-white tracking-tight">{item.title}</h3>
            </div>
          </div>

          <p className="relative z-10 text-white/60 leading-relaxed text-sm">
            {item.description}
          </p>

          {/* Hover highlight sweep */}
          <div
            className="absolute inset-0 opacity-0 group-hover:opacity-100 transition-opacity duration-700 pointer-events-none"
            style={{
              background: `radial-gradient(circle at 50% 0%, ${glowColor}, transparent 70%)`,
            }}
          />
        </motion.div>
      </motion.div>
    </div>
  );
}
