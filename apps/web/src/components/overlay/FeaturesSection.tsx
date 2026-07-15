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

export function FeaturesSection() {
  const containerRef = useRef<HTMLDivElement>(null);
  const titleWordsRef = useRef<HTMLSpanElement[]>([]);
  const tagsRef = useRef<HTMLDivElement>(null);
  const chartPathRef = useRef<SVGPathElement>(null);
  
  // States
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
            borderColor: "rgba(255, 255, 255, 0.05)",
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

  // 5. 3D Melon Slicing Interaction
  const handleMouseEnter = () => {
    const angle = (Math.random() - 0.5) * Math.PI * 0.35;
    window.dispatchEvent(new CustomEvent("melon-slice", { detail: { angle } }));
  };

  const handleMouseLeave = () => {
    window.dispatchEvent(new CustomEvent("melon-regrow"));
  };

  const copyCommand = () => {
    navigator.clipboard.writeText("npx @melonui/cli add glow-terminal");
    setCopied(true);
    setTimeout(() => setCopied(false), 2000);
  };

  return (
    <section
      id="features-section"
      ref={containerRef}
      className="snap-start relative z-10 flex min-h-screen w-full items-center py-6 lg:py-0 overflow-y-auto lg:overflow-hidden bg-transparent"
      style={{ scrollSnapStop: "always" }}
    >
      <div 
        className="mx-auto w-full max-w-7xl px-4 md:px-8"
        onMouseEnter={handleMouseEnter}
        onMouseLeave={handleMouseLeave}
      >
        {/* Header Block */}
        <div className="mb-4 flex flex-col items-start justify-between gap-2 lg:flex-row lg:items-end">
          <div>
            <p className="font-mono text-xs uppercase tracking-[0.28em] text-[#ff5c71]">
              Chapter 02 / Platform Insights
            </p>
            <h2
              className="mt-1 font-black uppercase leading-[0.82] text-white text-[clamp(2.5rem,10vw,3.8rem)] md:text-[clamp(3rem,5vw,4.5rem)]"
              style={{ fontFamily: "var(--font-londrina-solid)", letterSpacing: 0 }}
            >
              WHAT'S{" "}
              <span className="text-[#7fff5e]">INSIDE.</span>
            </h2>
          </div>
          <p className="max-w-md font-sans text-xs leading-5 text-white/54">
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
        <div className="grid grid-cols-1 gap-4 md:grid-cols-6 lg:grid-cols-12 relative z-10">
          {/* Card 1: 50+ Premium Components (Floating Tag Cloud) */}
          <div className="group relative col-span-1 flex flex-col justify-between overflow-hidden rounded-xl border border-white/5 bg-[#030303]/10 px-4 py-3.5 backdrop-blur-2xl transition-all shadow-[inset_0_1px_1px_rgba(255,255,255,0.03),0_8px_32px_rgba(0,0,0,0.55)] hover:border-white/10 md:col-span-4 h-[185px]">
            <div className="absolute inset-0 bg-gradient-to-t from-transparent to-white/[0.01] pointer-events-none" />
            <div
              ref={tagsRef}
              className="flex flex-wrap gap-1.5 overflow-hidden h-20 select-none relative z-10"
            >
              {TAGS.map((tag) => (
                <span
                  key={tag}
                  className="rounded-full border border-white/5 bg-white/[0.02] px-2 py-0.5 font-mono text-[9px] uppercase text-white/54 transition-all hover:text-[#7fff5e]"
                  style={{ letterSpacing: 0 }}
                >
                  {tag}
                </span>
              ))}
            </div>
            <div className="relative z-15">
              <h3 className="text-sm font-bold text-white">55+ Premium Components</h3>
              <p className="mt-0.5 text-[10px] text-white/45 leading-normal">
                Physics-based card layouts, volumetric hologram projections, typography sliders, and responsive spring menus.
              </p>
            </div>
          </div>

          {/* Card 2: Community Growth (GitHub Stars graph) */}
          <div className="group relative col-span-1 flex flex-col justify-between overflow-hidden rounded-xl border border-white/5 bg-[#030303]/10 px-4 py-3.5 backdrop-blur-2xl transition-all shadow-[inset_0_1px_1px_rgba(255,255,255,0.03),0_8px_32px_rgba(0,0,0,0.55)] hover:border-white/10 md:col-span-5 h-[185px]">
            {/* Background SVG Sparkline */}
            <div className="absolute inset-0 z-0 h-32 overflow-hidden pointer-events-none">
              <svg className="w-full h-full" viewBox="0 0 320 180" preserveAspectRatio="none">
                <defs>
                  <linearGradient id="chart-grad" x1="0" y1="0" x2="0" y2="1">
                    <stop offset="0%" stopColor="#7fff5e" stopOpacity="0.12" />
                    <stop offset="100%" stopColor="#7fff5e" stopOpacity="0.0" />
                  </linearGradient>
                </defs>
                <path
                  d="M 0 170 Q 50 160 80 130 T 160 110 T 240 60 T 320 20"
                  fill="none"
                  stroke="rgba(255,255,255,0.04)"
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
                <h4 className="text-2xl font-black text-white mt-0.5">43.5K+</h4>
              </div>
              <span className="flex items-center gap-1 rounded-full border border-[#7fff5e]/15 bg-[#7fff5e]/5 px-2 py-0.5 font-mono text-[8px] uppercase text-[#7fff5e]">
                <span className="h-1 w-1 rounded-full bg-[#7fff5e] animate-pulse" />
                Growing Fast
              </span>
            </div>

            <div className="relative z-10 mt-auto">
              <h3 className="text-xs font-bold text-white">Active Community Growth</h3>
              <p className="mt-0.5 text-[9px] text-white/45">
                Our repository is backed by thousands of developers contributing custom layout primitives weekly.
              </p>
            </div>
          </div>

          {/* Card 3: Pick Your Stack Toggle */}
          <div className="group relative col-span-1 flex flex-col justify-between overflow-hidden rounded-xl border border-white/5 bg-[#030303]/10 px-4 py-3.5 backdrop-blur-2xl transition-all shadow-[inset_0_1px_1px_rgba(255,255,255,0.03),0_8px_32px_rgba(0,0,0,0.55)] hover:border-white/10 md:col-span-3 h-[185px]">
            <div className="flex flex-col gap-1.5">
              <p className="font-mono text-[9px] uppercase tracking-wider text-white/32">Developer Stack</p>
              <div className="grid grid-cols-2 gap-1 rounded border border-white/5 bg-black/60 p-0.5 relative z-10">
                {[
                  { id: 0, label: "JS + CSS" },
                  { id: 1, label: "TS + CSS" },
                  { id: 2, label: "JS + TW" },
                  { id: 3, label: "TS + TW" },
                ].map((stack) => (
                  <button
                    key={stack.id}
                    onClick={() => setActiveStack(stack.id)}
                    className={`rounded py-1 font-mono text-[8px] uppercase transition-all ${
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

            <div className="mt-2 pt-2 border-t border-white/5">
              <h3 className="text-xs font-bold text-white">Full Stack Versatility</h3>
              <p className="mt-0.5 text-[9px] text-white/45">
                Every component is modularized across four distinct flavors to integrate natively into any setup.
              </p>
            </div>
          </div>

          {/* Card 4: Dev-Ready CLI Terminal Mockup */}
          <div className="group relative col-span-1 overflow-hidden rounded-xl border border-white/5 bg-[#030303]/10 px-4 py-3.5 backdrop-blur-2xl transition-all shadow-[inset_0_1px_1px_rgba(255,255,255,0.03),0_8px_32px_rgba(0,0,0,0.55)] hover:border-white/10 md:col-span-7 h-[185px]">
            {/* Terminal Window Header */}
            <div className="flex items-center justify-between border-b border-white/5 pb-2">
              <div className="flex items-center gap-1">
                <span className="h-2 w-2 rounded-full bg-[#ff5c71]" />
                <span className="h-2 w-2 rounded-full bg-[#e0f2dc]" />
                <span className="h-2 w-2 rounded-full bg-[#7fff5e]" />
              </div>
              <p className="font-mono text-[9px] uppercase tracking-wider text-white/22">CLI terminal</p>
              <button
                onClick={copyCommand}
                className="rounded border border-white/5 bg-white/[0.02] px-2 py-0.5 font-mono text-[8px] uppercase text-white/54 hover:bg-white/5 hover:text-white"
              >
                {copied ? "Copied" : "Copy"}
              </button>
            </div>

            {/* Typewriter Command lines */}
            <div className="mt-2.5 font-mono text-[11px] text-white/70 space-y-1 leading-4 select-all">
              <p className="text-white/87">
                <span className="text-[#ff5c71] font-black">$</span> {cliText}
                {cliStep === 0 && <span className="inline-block w-1.5 h-3 bg-[#7fff5e] ml-0.5 animate-pulse" />}
              </p>
              {cliStep >= 1 && (
                <p className="text-[#e0f2dc]/60 text-[10px]">
                  <span className="text-[#7fff5e] font-black">❯</span> Copying component primitives...
                </p>
              )}
              {cliStep >= 2 && (
                <p className="text-[#7fff5e] text-[10px] font-bold">
                  ✔ Installed glow-terminal.tsx in 1.2s!
                </p>
              )}
            </div>
          </div>

          {/* Card 5: Modular Categories circular node menu */}
          <div className="group relative col-span-1 overflow-hidden rounded-xl border border-white/5 bg-[#030303]/10 px-4 py-3.5 backdrop-blur-2xl transition-all shadow-[inset_0_1px_1px_rgba(255,255,255,0.03),0_8px_32px_rgba(0,0,0,0.55)] hover:border-white/10 md:col-span-5 h-[185px] flex flex-col justify-between">
            <div className="relative flex h-20 items-center justify-center overflow-hidden">
              {/* Outer Orbit Line */}
              <div className="absolute h-16 w-16 rounded-full border border-white/[0.03] animate-[spin_12s_linear_infinite]" />
              
              {/* Central Core */}
              <div className="relative z-10 flex h-7 w-7 items-center justify-center rounded-full border border-[#7fff5e]/22 bg-[#7fff5e]/5 text-center text-xs">
                🍉
              </div>

              {/* Orbiting Nodes */}
              {[
                { label: "Btn", pos: "top-1 left-1/2 -translate-x-1/2" },
                { label: "Crd", pos: "bottom-1 left-1/2 -translate-x-1/2" },
                { label: "Nav", pos: "left-2 top-1/2 -translate-y-1/2" },
                { label: "Fx", pos: "right-2 top-1/2 -translate-y-1/2" },
              ].map((node) => (
                <span
                  key={node.label}
                  className={`absolute flex h-4.5 w-4.5 items-center justify-center rounded-full border border-white/8 bg-black/80 font-mono text-[6px] font-black uppercase text-white/45 transition-transform duration-300 hover:scale-125 hover:border-[#7fff5e] hover:text-white ${node.pos}`}
                  style={{ transformOrigin: "center" }}
                >
                  {node.label}
                </span>
              ))}
            </div>
            <div>
              <h3 className="text-xs font-bold text-white">Highly Organized</h3>
              <p className="mt-0.5 text-[9px] text-white/45">
                Five discrete categories of clean, production-taste components.
              </p>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}
