"use client";

import React, { useEffect, useRef, useState } from "react";
import gsap from "gsap";

const TAGS = [
  "HologramProjector",
  "MagneticCard",
  "GlowTerminal",
  "CliTerminal",
  "JuicySwitch",
  "RindPeel",
  "SeedBurst",
  "PortalReveal",
  "BentoGrid",
  "PatternLock",
  "CommandRing",
  "TerminalCursor",
  "PrismVault",
  "Waves",
];

const TIMELINE_STAGES = [
  {
    id: "drop",
    label: "Drop (Seed)",
    icon: "🌱",
    desc: "CLI fetches the components package instantly from remote registry.",
  },
  {
    id: "sprout",
    label: "Sprout (Install)",
    icon: "🌿",
    desc: "Resolves dynamic Tailwind extensions and Framer/GSAP animations.",
  },
  {
    id: "bloom",
    label: "Bloom (Customize)",
    icon: "🍉",
    desc: "Raw, fully editable code files are written directly into your components folder.",
  },
  {
    id: "slice",
    label: "Slice (Ship)",
    icon: "🔪",
    desc: "Deployed to production with 100/100 Lighthouse performance metrics.",
  },
];

export function FeaturesSection() {
  const containerRef = useRef<HTMLDivElement>(null);
  const titleWordsRef = useRef<HTMLSpanElement[]>([]);
  const tagsRef = useRef<HTMLDivElement>(null);
  const chartPathRef = useRef<SVGPathElement>(null);
  
  // States
  const [activeStage, setActiveStage] = useState(0);
  const [activeStack, setActiveStack] = useState(1); // 1 = TS + CSS
  const [copied, setCopied] = useState(false);
  const [cliText, setCliText] = useState("");
  const [cliStep, setCliStep] = useState(0); // 0 = typing, 1 = copying, 2 = success

  // 1. Title text repel effect
  useEffect(() => {
    const words = titleWordsRef.current.filter(Boolean);
    if (words.length === 0) return;

    const centers = words.map((word) => {
      const rect = word.getBoundingClientRect();
      return {
        x: rect.left + rect.width / 2,
        y: rect.top + rect.height / 2,
      };
    });

    const handleMouseMove = (e: MouseEvent) => {
      const mouseX = e.clientX;
      const mouseY = e.clientY;

      words.forEach((word, index) => {
        const center = centers[index];
        if (!center) return;
        const dx = mouseX - center.x;
        const dy = mouseY - center.y;
        const dist = Math.sqrt(dx * dx + dy * dy);
        const radius = 100;

        if (dist < radius) {
          const force = ((radius - dist) / radius) ** 2;
          const pushX = (dx / dist) * 16 * force;
          const pushY = (dy / dist) * 16 * force;

          gsap.to(word, {
            x: pushX,
            y: pushY,
            color: "#7fff5e",
            duration: 0.3,
            ease: "power2.out",
            overwrite: "auto",
          });
        } else {
          gsap.to(word, {
            x: 0,
            y: 0,
            color: "#ffffff",
            duration: 0.45,
            ease: "power2.out",
            overwrite: "auto",
          });
        }
      });
    };

    window.addEventListener("mousemove", handleMouseMove);
    return () => window.removeEventListener("mousemove", handleMouseMove);
  }, []);

  // 2. Floating tag chips & mouse repel
  useEffect(() => {
    const tagsContainer = tagsRef.current;
    if (!tagsContainer) return;

    const chips = Array.from(tagsContainer.children) as HTMLSpanElement[];
    const ctx = gsap.context(() => {
      chips.forEach((chip) => {
        // Gently float randomly
        gsap.to(chip, {
          x: "random(-10, 10)",
          y: "random(-10, 10)",
          rotation: "random(-4, 4)",
          duration: "random(2.5, 4.5)",
          repeat: -1,
          yoyo: true,
          ease: "sine.inOut",
        });
      });
    });

    const handleMouseMove = (e: MouseEvent) => {
      const rect = tagsContainer.getBoundingClientRect();
      const relativeX = e.clientX - rect.left;
      const relativeY = e.clientY - rect.top;

      chips.forEach((chip) => {
        const chipRect = chip.getBoundingClientRect();
        const cx = chipRect.left + chipRect.width / 2 - rect.left;
        const cy = chipRect.top + chipRect.height / 2 - rect.top;
        const dx = relativeX - cx;
        const dy = relativeY - cy;
        const dist = Math.sqrt(dx * dx + dy * dy);
        const radius = 80;

        if (dist < radius) {
          const force = ((radius - dist) / radius) ** 2;
          gsap.to(chip, {
            x: `-=${(dx / dist) * 12 * force}`,
            y: `-=${(dy / dist) * 12 * force}`,
            scale: 1.05,
            borderColor: "rgba(127, 255, 94, 0.4)",
            duration: 0.3,
            overwrite: "auto",
          });
        } else {
          // Allow float to take back control slowly
          gsap.to(chip, {
            scale: 1,
            borderColor: "rgba(255, 255, 255, 0.08)",
            duration: 0.6,
            overwrite: "auto",
          });
        }
      });
    };

    tagsContainer.addEventListener("mousemove", handleMouseMove);
    return () => {
      ctx.revert();
      tagsContainer.removeEventListener("mousemove", handleMouseMove);
    };
  }, []);

  // 3. GitHub stars animated path
  useEffect(() => {
    const path = chartPathRef.current;
    if (!path) return;

    const length = path.getTotalLength();
    path.style.strokeDasharray = `${length}`;
    path.style.strokeDashoffset = `${length}`;

    // Simple Intersection Observer to trigger drawing
    const observer = new IntersectionObserver(
      (entries) => {
        entries.forEach((entry) => {
          if (entry.isIntersecting) {
            gsap.to(path, {
              strokeDashoffset: 0,
              duration: 2.2,
              ease: "power2.out",
            });
            observer.disconnect();
          }
        });
      },
      { threshold: 0.1 }
    );

    if (containerRef.current) {
      observer.observe(containerRef.current);
    }
    return () => observer.disconnect();
  }, []);

  // 4. Typewriter Terminal Loop
  useEffect(() => {
    const fullCommand = "npx @melonui/cli add glow-terminal";
    let isMounted = true;
    let timer: NodeJS.Timeout;

    const runTerminalAnimation = () => {
      if (!isMounted) return;
      setCliStep(0);
      setCliText("");

      let index = 0;
      const type = () => {
        if (!isMounted) return;
        if (index < fullCommand.length) {
          setCliText(fullCommand.slice(0, index + 1));
          index++;
          timer = setTimeout(type, 70);
        } else {
          // Move to copying/installing
          timer = setTimeout(() => {
            if (!isMounted) return;
            setCliStep(1);
            timer = setTimeout(() => {
              if (!isMounted) return;
              setCliStep(2);
              // Restart after 6 seconds
              timer = setTimeout(runTerminalAnimation, 6000);
            }, 1200);
          }, 800);
        }
      };
      timer = setTimeout(type, 500);
    };

    runTerminalAnimation();

    return () => {
      isMounted = false;
      clearTimeout(timer);
    };
  }, []);

  const copyCommand = () => {
    navigator.clipboard.writeText("npx @melonui/cli add glow-terminal");
    setCopied(true);
    setTimeout(() => setCopied(false), 2000);
  };

  return (
    <section
      id="features-section"
      ref={containerRef}
      className="snap-start relative z-10 flex min-h-screen w-full items-center py-16 lg:py-0 overflow-y-auto lg:overflow-hidden bg-[#050505]"
      style={{ scrollSnapStop: "always" }}
    >
      <div className="mx-auto w-full max-w-7xl px-4 md:px-8">
        {/* Header Block */}
        <div className="mb-8 flex flex-col items-start justify-between gap-4 lg:flex-row lg:items-end">
          <div>
            <p className="font-mono text-xs uppercase tracking-[0.28em] text-[#ff5c71]">
              Chapter 02 / Platform Insights
            </p>
            <h2
              className="mt-2 font-black uppercase leading-[0.82] text-white text-[clamp(2.7rem,12vw,4.4rem)] md:text-[clamp(3.2rem,6vw,5.5rem)]"
              style={{ fontFamily: "var(--font-londrina-solid)", letterSpacing: 0 }}
            >
              WHAT'S{" "}
              <span className="text-[#7fff5e]">INSIDE.</span>
            </h2>
          </div>
          <p className="max-w-md font-sans text-sm leading-6 text-white/54">
            { "Explore the core architecture, community growth metrics, and organic lifecycle timeline that makes MelonUI the premier choice for high-fidelity animations."
              .split(" ")
              .map((word, idx) => (
                <span
                  key={idx}
                  ref={(el) => {
                    if (el) titleWordsRef.current[idx] = el;
                  }}
                  className="inline-block mr-1 cursor-default transition-colors duration-150"
                >
                  {word}
                </span>
              ))
            }
          </p>
        </div>

        {/* Bento Grid */}
        <div className="grid grid-cols-1 gap-6 md:grid-cols-6 lg:grid-cols-12">
          {/* Card 1: 50+ Premium Components (Floating Tag Cloud) */}
          <div className="group relative col-span-1 flex flex-col justify-between overflow-hidden rounded-xl border border-white/8 bg-white/[0.02] p-5 backdrop-blur-md md:col-span-3 lg:col-span-4 min-h-[260px]">
            <div className="absolute inset-0 bg-gradient-to-t from-transparent to-white/[0.01] pointer-events-none" />
            <div
              ref={tagsRef}
              className="flex flex-wrap gap-2 overflow-hidden h-28 select-none relative z-10"
            >
              {TAGS.map((tag) => (
                <span
                  key={tag}
                  className="rounded-full border border-white/8 bg-white/[0.03] px-2.5 py-1 font-mono text-[10px] uppercase text-white/62 transition-all hover:text-[#7fff5e]"
                  style={{ letterSpacing: 0 }}
                >
                  {tag}
                </span>
              ))}
            </div>
            <div className="relative z-15 mt-4">
              <h3 className="text-xl font-bold text-white">55+ Premium Components</h3>
              <p className="mt-1 text-xs text-white/54 leading-normal">
                Physics-based card layouts, volumetric hologram projections, typography sliders, and responsive spring menus.
              </p>
            </div>
          </div>

          {/* Card 2: The Melon Timeline (Interactive Lifecycle) */}
          <div className="group relative col-span-1 overflow-hidden rounded-xl border border-white/8 bg-white/[0.02] p-5 backdrop-blur-md md:col-span-3 lg:col-span-4 min-h-[260px]">
            <div className="absolute inset-x-5 top-12 h-0.5 bg-white/8 hidden sm:block pointer-events-none" />
            <div
              className="absolute inset-x-5 top-12 h-0.5 bg-gradient-to-r from-[#ff5c71] to-[#7fff5e] origin-left transition-transform duration-500 hidden sm:block pointer-events-none"
              style={{ transform: `scaleX(${activeStage / (TIMELINE_STAGES.length - 1)})` }}
            />
            
            {/* Timeline Nodes */}
            <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center relative z-10 gap-4 sm:gap-0">
              {TIMELINE_STAGES.map((stage, idx) => (
                <button
                  key={stage.id}
                  onClick={() => setActiveStage(idx)}
                  className="flex sm:flex-col items-center gap-3 sm:gap-2 focus:outline-none group/node text-left sm:text-center"
                >
                  <span
                    className={`flex h-8 w-8 items-center justify-center rounded-full border text-sm transition-all duration-300 ${
                      activeStage === idx
                        ? "border-[#7fff5e] bg-[#7fff5e]/10 shadow-[0_0_15px_rgba(127,255,94,0.3)] scale-110"
                        : "border-white/12 bg-[#0d0d0d] hover:border-white/35"
                    }`}
                  >
                    {stage.icon}
                  </span>
                  <span
                    className={`font-mono text-[9px] uppercase tracking-wider transition-colors ${
                      activeStage === idx ? "text-[#7fff5e] font-black" : "text-white/35"
                    }`}
                  >
                    {stage.label}
                  </span>
                </button>
              ))}
            </div>

            {/* Stage Description Box */}
            <div className="mt-5 rounded-lg border border-white/6 bg-white/[0.02] p-3 min-h-[72px]">
              <p className="font-mono text-[9px] uppercase text-[#ff5c71] font-bold">
                Stage {activeStage + 1} / {TIMELINE_STAGES[activeStage].label}
              </p>
              <p className="mt-1 text-xs text-white/68 leading-relaxed">
                {TIMELINE_STAGES[activeStage].desc}
              </p>
            </div>
          </div>

          {/* Card 3: Community Growth (GitHub Stars graph) */}
          <div className="group relative col-span-1 flex flex-col justify-between overflow-hidden rounded-xl border border-white/8 bg-white/[0.02] p-5 backdrop-blur-md md:col-span-3 lg:col-span-4 min-h-[260px]">
            {/* Background SVG Sparkline */}
            <div className="absolute inset-0 z-0 h-44 overflow-hidden pointer-events-none">
              <svg className="w-full h-full" viewBox="0 0 320 180" preserveAspectRatio="none">
                <defs>
                  <linearGradient id="chart-grad" x1="0" y1="0" x2="0" y2="1">
                    <stop offset="0%" stopColor="#7fff5e" stopOpacity="0.16" />
                    <stop offset="100%" stopColor="#7fff5e" stopOpacity="0.0" />
                  </linearGradient>
                </defs>
                <path
                  d="M 0 170 Q 50 160 80 130 T 160 110 T 240 60 T 320 20"
                  fill="none"
                  stroke="rgba(255,255,255,0.06)"
                  strokeWidth="2.5"
                />
                <path
                  ref={chartPathRef}
                  d="M 0 170 Q 50 160 80 130 T 160 110 T 240 60 T 320 20"
                  fill="url(#chart-grad)"
                  stroke="#7fff5e"
                  strokeWidth="2.5"
                  strokeLinecap="round"
                />
              </svg>
            </div>

            <div className="relative z-10 flex items-start justify-between">
              <div>
                <p className="font-mono text-[9px] uppercase tracking-wider text-white/35">GitHub Stars</p>
                <h4 className="text-4xl font-black text-white mt-1">43.5K+</h4>
              </div>
              <span className="flex items-center gap-1.5 rounded-full border border-[#7fff5e]/15 bg-[#7fff5e]/5 px-2 py-0.5 font-mono text-[9px] uppercase text-[#7fff5e]">
                <span className="h-1.5 w-1.5 rounded-full bg-[#7fff5e] animate-pulse" />
                Growing Fast
              </span>
            </div>

            <div className="relative z-10 mt-auto pt-6">
              <h3 className="text-sm font-bold text-white">Active Community Growth</h3>
              <p className="mt-1 text-[11px] text-white/45">
                Our repository is backed by thousands of developers contributing custom layout primitives weekly.
              </p>
            </div>
          </div>

          {/* Card 4: Dev-Ready CLI Terminal Mockup */}
          <div className="group relative col-span-1 overflow-hidden rounded-xl border border-white/8 bg-white/[0.02] p-5 backdrop-blur-md md:col-span-3 lg:col-span-5 min-h-[240px]">
            {/* Terminal Window Header */}
            <div className="flex items-center justify-between border-b border-white/8 pb-3">
              <div className="flex items-center gap-1.5">
                <span className="h-2.5 w-2.5 rounded-full bg-[#ff5c71]" />
                <span className="h-2.5 w-2.5 rounded-full bg-[#e0f2dc]" />
                <span className="h-2.5 w-2.5 rounded-full bg-[#7fff5e]" />
              </div>
              <p className="font-mono text-[9px] uppercase tracking-wider text-white/22">CLI terminal</p>
              <button
                onClick={copyCommand}
                className="rounded border border-white/8 bg-white/[0.03] px-2 py-0.5 font-mono text-[9px] uppercase text-white/54 hover:bg-white/8 hover:text-white"
              >
                {copied ? "Copied" : "Copy"}
              </button>
            </div>

            {/* Typewriter Command lines */}
            <div className="mt-3 font-mono text-xs text-white/70 space-y-1.5 leading-5 select-all">
              <p className="text-white/87">
                <span className="text-[#ff5c71] font-black">$</span> {cliText}
                {cliStep === 0 && <span className="inline-block w-1.5 h-3.5 bg-[#7fff5e] ml-0.5 animate-pulse" />}
              </p>
              {cliStep >= 1 && (
                <p className="text-[#e0f2dc]/60 text-[11px]">
                  <span className="text-[#7fff5e] font-black">❯</span> Copying component primitives...
                </p>
              )}
              {cliStep >= 2 && (
                <p className="text-[#7fff5e] text-[11px] font-bold">
                  ✔ Installed glow-terminal.tsx in 1.2s!
                </p>
              )}
            </div>
          </div>

          {/* Card 5: Pick Your Stack Toggle */}
          <div className="group relative col-span-1 flex flex-col justify-between overflow-hidden rounded-xl border border-white/8 bg-white/[0.02] p-5 backdrop-blur-md md:col-span-3 lg:col-span-4 min-h-[240px]">
            <div className="flex flex-col gap-2">
              <p className="font-mono text-[9px] uppercase tracking-wider text-white/32">Developer Stack</p>
              <div className="grid grid-cols-2 gap-1.5 rounded-lg border border-white/8 bg-black/60 p-1 relative z-10">
                {[
                  { id: 0, label: "JS + CSS" },
                  { id: 1, label: "TS + CSS" },
                  { id: 2, label: "JS + Tailwind" },
                  { id: 3, label: "TS + Tailwind" },
                ].map((stack) => (
                  <button
                    key={stack.id}
                    onClick={() => setActiveStack(stack.id)}
                    className={`rounded px-2 py-1.5 font-mono text-[10px] uppercase transition-all ${
                      activeStack === stack.id
                        ? "bg-[#7fff5e] text-black font-black"
                        : "text-white/54 hover:bg-white/[0.04]"
                    }`}
                  >
                    {stack.label}
                  </button>
                ))}
              </div>
            </div>

            <div className="mt-4 pt-4 border-t border-white/6">
              <h3 className="text-sm font-bold text-white">Full Stack Versatility</h3>
              <p className="mt-1 text-[11px] text-white/45">
                Every component is modularized across four distinct flavors to integrate natively into any setup.
              </p>
            </div>
          </div>

          {/* Card 6: Modular Categories circular node menu */}
          <div className="group relative col-span-1 overflow-hidden rounded-xl border border-white/8 bg-white/[0.02] p-5 backdrop-blur-md md:col-span-3 lg:col-span-3 min-h-[240px] flex flex-col justify-between">
            <div className="relative flex h-28 items-center justify-center overflow-hidden">
              {/* Outer Orbit Line */}
              <div className="absolute h-24 w-24 rounded-full border border-white/[0.04] animate-[spin_12s_linear_infinite]" />
              
              {/* Central Core */}
              <div className="relative z-10 flex h-9 w-9 items-center justify-center rounded-full border border-[#7fff5e]/22 bg-[#7fff5e]/5 text-center text-xs">
                🍉
              </div>

              {/* Orbiting Nodes */}
              {[
                { label: "Btn", pos: "top-2 left-1/2 -translate-x-1/2" },
                { label: "Crd", pos: "bottom-2 left-1/2 -translate-x-1/2" },
                { label: "Nav", pos: "left-2 top-1/2 -translate-y-1/2" },
                { label: "Fx", pos: "right-2 top-1/2 -translate-y-1/2" },
              ].map((node, i) => (
                <span
                  key={node.label}
                  className={`absolute flex h-5 w-5 items-center justify-center rounded-full border border-white/10 bg-black/80 font-mono text-[7px] font-black uppercase text-white/45 transition-transform duration-300 hover:scale-125 hover:border-[#7fff5e] hover:text-white ${node.pos}`}
                  style={{ transformOrigin: "center" }}
                >
                  {node.label}
                </span>
              ))}
            </div>
            <div>
              <h3 className="text-sm font-bold text-white">Highly Organized</h3>
              <p className="mt-0.5 text-[10px] text-white/45">
                Five discrete categories of clean, production-taste components.
              </p>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}
