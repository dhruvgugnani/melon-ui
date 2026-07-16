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

    const wrappers = Array.from(tagsContainer.children) as HTMLSpanElement[];
    const ctx = gsap.context(() => {
      wrappers.forEach((wrapper) => {
        // Gently float wrappers randomly
        gsap.to(wrapper, {
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

      wrappers.forEach((wrapper) => {
        const innerChip = wrapper.firstElementChild as HTMLSpanElement;
        if (!innerChip) return;

        const wrapperRect = wrapper.getBoundingClientRect();
        const cx = wrapperRect.left + wrapperRect.width / 2 - rect.left;
        const cy = wrapperRect.top + wrapperRect.height / 2 - rect.top;
        const dx = relativeX - cx;
        const dy = relativeY - cy;
        const dist = Math.sqrt(dx * dx + dy * dy);
        const radius = 80;

        if (dist < radius) {
          const force = ((radius - dist) / radius) ** 2;
          const pushX = -(dx / dist) * 14 * force;
          const pushY = -(dy / dist) * 14 * force;

          gsap.to(innerChip, {
            x: pushX,
            y: pushY,
            scale: 1.05,
            borderColor: "rgba(127, 255, 94, 0.55)",
            duration: 0.35,
            overwrite: "auto",
          });
        } else {
          // Spring back exactly to its center inside the wrapper
          gsap.to(innerChip, {
            x: 0,
            y: 0,
            scale: 1,
            borderColor: "rgba(255, 255, 255, 0.12)",
            duration: 0.6,
            ease: "power2.out",
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

  const cardStyle = "group relative flex flex-col justify-between overflow-hidden rounded-xl border border-white/12 bg-[#0c0c0c]/62 backdrop-blur-2xl transition-all shadow-[inset_0_1px_1px_rgba(255,255,255,0.08),0_12px_40px_rgba(0,0,0,0.7)] hover:border-white/22 hover:bg-[#0f0f0f]/80 hover:scale-[1.015] hover:shadow-[0_20px_50px_rgba(0,0,0,0.85)] duration-300 ease-out h-[200px] p-5";

  return (
    <section
      id="features-section"
      ref={containerRef}
      className="snap-start relative z-10 flex min-h-screen w-full items-center py-6 lg:py-0 overflow-y-auto lg:overflow-hidden bg-transparent"
      style={{ scrollSnapStop: "always" }}
    >
      <div
        className="mx-auto w-full max-w-[88rem] px-4 md:px-8 lg:px-10"
        onMouseEnter={handleMouseEnter}
        onMouseLeave={handleMouseLeave}
      >
        {/* Chapter label */}
        <p className="mb-3 font-mono text-xs uppercase tracking-[0.28em] text-[#ff5c71]">
          Chapter 02 / Platform Insights
        </p>

        {/* ── OUTER BENTO CONTAINER ── */}
        <div
          className="relative w-full rounded-2xl border border-white/5 p-6 md:p-7"
        >
          {/* ── 12-COL INNER GRID ── */}
          <div className="relative grid grid-cols-12 gap-4" style={{ gridTemplateRows: "auto auto" }}>

            {/* ── HEADING — top-left, no card ── */}
            <div className="col-span-12 md:col-span-4 flex flex-col justify-between pb-1">
              <h2
                className="font-black uppercase leading-[0.82] text-white text-[clamp(2rem,8vw,3.2rem)] md:text-[clamp(2.4rem,4vw,4rem)]"
                style={{ fontFamily: "var(--font-londrina-solid)", letterSpacing: 0 }}
              >
                WHAT&apos;S{" "}
                <span className="text-[#7fff5e]">INSIDE.</span>
              </h2>
              {/* Description text — bottom of heading column */}
              <p className="mt-3 hidden max-w-[315px] font-sans text-[13px] font-semibold leading-[1.52] text-white/58 md:block">
                {
                  "Explore the core architecture, community growth metrics, and organic lifecycle timeline that makes MelonUI the premier choice for high-fidelity animations."
                    .split(" ")
                    .map((word, idx) => (
                      <span
                        key={idx}
                        ref={(el) => {
                          if (el) titleWordsRef.current[idx] = el;
                        }}
                        className="inline-block mr-1 cursor-default"
                      >
                        {word}
                      </span>
                    ))
                }
              </p>
            </div>

            {/* ── ROW 1 RIGHT: two cards side-by-side ── */}
            {/* Card A — Tags cloud (top-middle) */}
            <div
              className={`${cardStyle} col-span-12 md:col-span-4`}
              style={{ height: "172px" }}
            >
              <div className="absolute inset-0 bg-gradient-to-t from-transparent to-white/[0.01] pointer-events-none rounded-xl" />
              <div
                ref={tagsRef}
                className="flex h-[84px] flex-wrap gap-1.5 overflow-hidden select-none relative z-10"
              >
                {TAGS.map((tag) => (
                  <span key={tag} className="inline-block relative">
                    <span
                      className="inline-block rounded-full border border-white/10 bg-white/[0.04] px-2 py-0.5 font-mono text-[9px] uppercase text-white/68 transition-all hover:text-[#7fff5e]"
                      style={{ letterSpacing: 0 }}
                    >
                      {tag}
                    </span>
                  </span>
                ))}
              </div>
              <div className="relative z-10 mt-auto">
                <h3 className="text-xs font-bold text-white">55+ Premium Components</h3>
                <p className="mt-0.5 text-[9px] text-white/50">Physics-based, volumetric & spring-driven.</p>
              </div>
            </div>

            {/* Card B — Community / GitHub Stars (top-right, row-span-2) */}
            <div
              className={`${cardStyle} col-span-12 md:col-span-4 md:row-span-2`}
              style={{ height: "auto", minHeight: "360px" }}
            >
              {/* Background SVG Sparkline */}
              <div className="absolute inset-0 z-0 overflow-hidden pointer-events-none rounded-xl">
                <svg className="w-full h-[55%]" viewBox="0 0 320 180" preserveAspectRatio="none">
                  <defs>
                    <linearGradient id="chart-grad-b" x1="0" y1="0" x2="0" y2="1">
                      <stop offset="0%" stopColor="#7fff5e" stopOpacity="0.1" />
                      <stop offset="100%" stopColor="#7fff5e" stopOpacity="0.0" />
                    </linearGradient>
                  </defs>
                  <path d="M 0 170 Q 50 160 80 130 T 160 110 T 240 60 T 320 20" fill="none" stroke="rgba(255,255,255,0.05)" strokeWidth="2" />
                  <path
                    ref={chartPathRef}
                    d="M 0 170 Q 50 160 80 130 T 160 110 T 240 60 T 320 20"
                    fill="url(#chart-grad-b)"
                    stroke="#7fff5e"
                    strokeWidth="2"
                    strokeLinecap="round"
                  />
                </svg>
              </div>

              <div className="relative z-10 flex items-start justify-between">
                <div>
                  <p className="font-mono text-[9px] uppercase tracking-wider text-white/38">GitHub Stars</p>
                  <h4 className="text-3xl font-black text-white mt-0.5 leading-none">43.5K+</h4>
                </div>
                <span className="flex items-center gap-1 rounded-full border border-[#7fff5e]/22 bg-[#7fff5e]/5 px-2.5 py-0.5 font-mono text-[8px] uppercase text-[#7fff5e]">
                  <span className="h-1 w-1 rounded-full bg-[#7fff5e] animate-pulse" />
                  Growing
                </span>
              </div>

              <div className="relative z-10 mt-auto">
                {/* Stack Toggle */}
                <p className="font-mono text-[9px] uppercase tracking-wider text-white/38 mb-2">Developer Stack</p>
                <div className="grid grid-cols-2 gap-1 rounded border border-white/10 bg-black/70 p-0.5 mb-4">
                  {[{ id: 0, label: "JS + CSS" }, { id: 1, label: "TS + CSS" }, { id: 2, label: "JS + TW" }, { id: 3, label: "TS + TW" }].map((stack) => (
                    <button
                      key={stack.id}
                      onClick={() => setActiveStack(stack.id)}
                      className={`rounded py-1 font-mono text-[8px] uppercase transition-all ${activeStack === stack.id ? "bg-[#7fff5e] text-black font-black" : "text-white/54 hover:bg-white/[0.04]"}`}
                    >
                      {stack.label}
                    </button>
                  ))}
                </div>
                <h3 className="text-xs font-bold text-white">Active Community Growth</h3>
                <p className="mt-0.5 text-[9px] text-white/50">
                  Thousands of devs. Supported across JS, TS, Tailwind & plain CSS.
                </p>
              </div>
            </div>

            {/* ── ROW 2 LEFT: Large CLI terminal card ── */}
            <div
              className={`${cardStyle} col-span-12 md:col-span-5`}
              style={{ height: "184px" }}
            >
              {/* Terminal Window Header */}
              <div className="flex items-center justify-between border-b border-white/8 pb-2">
                <div className="flex items-center gap-1.5">
                  <span className="h-2 w-2 rounded-full bg-[#ff5c71]" />
                  <span className="h-2 w-2 rounded-full bg-[#ffc338]" />
                  <span className="h-2 w-2 rounded-full bg-[#7fff5e]" />
                </div>
                <p className="font-mono text-[9px] uppercase tracking-wider text-white/30">CLI terminal</p>
                <button
                  onClick={copyCommand}
                  className="rounded border border-white/8 bg-white/[0.03] px-2 py-0.5 font-mono text-[8px] uppercase text-white/50 hover:bg-white/10 hover:text-white"
                >
                  {copied ? "Copied ✓" : "Copy"}
                </button>
              </div>
              <div className="mt-2.5 font-mono text-[11px] text-white/70 space-y-1 leading-4 select-all">
                <p className="text-white/90">
                  <span className="text-[#ff5c71] font-black">$</span> {cliText}
                  {cliStep === 0 && <span className="inline-block w-1.5 h-3 bg-[#7fff5e] ml-0.5 animate-pulse" />}
                </p>
                {cliStep >= 1 && (
                  <p className="text-[#e0f2dc]/70 text-[10px]">
                    <span className="text-[#7fff5e] font-black">❯</span> Copying component primitives...
                  </p>
                )}
                {cliStep >= 2 && (
                  <p className="text-[#7fff5e] text-[10px] font-bold">✔ Installed glow-terminal.tsx in 1.2s!</p>
                )}
              </div>
              <div className="mt-auto">
                <h3 className="text-[10px] font-bold text-white">Drop It Into Your Stack</h3>
                <p className="mt-0.5 text-[9px] text-white/50">One CLI command, zero config required.</p>
              </div>
            </div>

            {/* Card D — Orbital categories (row 2 middle) */}
            <div
              className={`${cardStyle} col-span-12 md:col-span-3`}
              style={{ height: "184px" }}
            >
              <div className="relative flex flex-1 items-center justify-center overflow-hidden">
                <div className="absolute h-16 w-16 rounded-full border border-white/[0.05] animate-[spin_12s_linear_infinite]" />
                <div className="relative z-10 flex h-8 w-8 items-center justify-center rounded-full border border-[#7fff5e]/22 bg-[#7fff5e]/5 text-sm">🍉</div>
                {[
                  { label: "Btn", pos: "top-0 left-1/2 -translate-x-1/2" },
                  { label: "Crd", pos: "bottom-0 left-1/2 -translate-x-1/2" },
                  { label: "Nav", pos: "left-1 top-1/2 -translate-y-1/2" },
                  { label: "Fx",  pos: "right-1 top-1/2 -translate-y-1/2" },
                ].map((node) => (
                  <span
                    key={node.label}
                    className={`absolute flex h-5 w-5 items-center justify-center rounded-full border border-white/12 bg-black/80 font-mono text-[6px] font-black uppercase text-white/50 hover:scale-125 hover:border-[#7fff5e] hover:text-white transition-transform duration-300 ${node.pos}`}
                  >
                    {node.label}
                  </span>
                ))}
              </div>
              <div className="mt-auto">
                <h3 className="text-[10px] font-bold text-white">Highly Organized</h3>
                <p className="mt-0.5 text-[9px] text-white/50">5 categories. Zero ambiguity.</p>
              </div>
            </div>

          </div>
        </div>
      </div>
    </section>
  );
}
