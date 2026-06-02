"use client";

import { useEffect, useRef, useState } from "react";
import { useRouter } from "next/navigation";
import Link from "next/link";
import gsap from "gsap";
import { SeedBurstButton } from "../community/demos/SeedBurstButton";
import { RindPeelCard } from "../community/demos/RindPeelCard";
import { MagneticNav } from "../community/demos/MagneticNav";
import { JuicySwitch } from "../community/demos/JuicySwitch";

const GITHUB_URL = "https://github.com/dhruvgugnani/melon-ui";

const DROPS = [
  { name: "Seed Burst", type: "press / particles", access: "Free", href: "/components/burst-button", color: "#ff5c71", id: "burst" },
  { name: "Rind Peel", type: "hover card", access: "Free", href: "/components/peel-card", color: "#e0f2dc", id: "peel" },
  { name: "Magnet Dock", type: "sticky nav", access: "Free", href: "/components/magnetic-nav", color: "#7fff5e", id: "dock" },
  { name: "Juicy Switch", type: "morph / juice toggle", access: "Free", href: "/components/juicy-switch", color: "#ff8d9a", id: "switch" },
] as const;

function RealPreview({ id }: { id: string }) {
  if (id === "burst") {
    return (
      <div className="relative flex h-24 items-center justify-center overflow-hidden rounded-[8px] border border-white/10 bg-[#060606] md:h-36">
        <SeedBurstButton 
          buttonClassName="rounded-full px-5 py-2 text-xs md:text-sm font-semibold active:scale-95" 
          buttonStyle={{ fontFamily: "var(--font-londrina-solid)" }}
        />
      </div>
    );
  }
  if (id === "peel") {
    return (
      <div className="relative h-24 overflow-hidden rounded-[8px] border border-white/10 bg-black md:h-36 flex items-center justify-center">
        <RindPeelCard width="100%" height="100%" />
      </div>
    );
  }
  if (id === "dock") {
    return (
      <div className="flex h-24 items-center justify-center rounded-[8px] border border-white/10 bg-[#060606] md:h-36 overflow-hidden">
        <div className="scale-[0.8] md:scale-95">
          <MagneticNav />
        </div>
      </div>
    );
  }
  return (
    <div className="flex h-24 items-center justify-center rounded-[8px] border border-white/10 bg-[#060606] md:h-36 overflow-hidden">
      <div className="scale-100 md:scale-110">
        <JuicySwitch />
      </div>
    </div>
  );
}

function RepellingText({ text }: { text: string }) {
  const containerRef = useRef<HTMLParagraphElement>(null);

  useEffect(() => {
    const container = containerRef.current;
    if (!container) return;

    const words = container.querySelectorAll(".repel-word");
    if (!words.length) return;

    let cachedCenters: { el: HTMLElement; centerX: number; centerY: number; phase: number }[] = [];
    let mouseX = 0;
    let mouseY = 0;
    let isHovering = false;
    let rafId: number | null = null;

    const updateCenters = () => {
      words.forEach((word) => {
        gsap.set(word, { 
          x: 0, 
          y: 0, 
          opacity: 1, 
          filter: "blur(0px)", 
          rotate: 0, 
          skewX: 0, 
          scale: 1 
        });
      });

      cachedCenters = Array.from(words).map((word, i) => {
        const el = word as HTMLElement;
        const rect = el.getBoundingClientRect();
        return {
          el,
          centerX: rect.left + rect.width / 2,
          centerY: rect.top + rect.height / 2,
          phase: i * 0.4,
        };
      });
    };

    const animate = () => {
      if (!isHovering) return;

      const radius = 110;
      const strength = 20;
      const time = performance.now() * 0.005;

      cachedCenters.forEach((data) => {
        const dx = data.centerX - mouseX;
        const dy = data.centerY - mouseY;
        const distance = Math.sqrt(dx * dx + dy * dy);

        if (distance < radius) {
          const ratio = (radius - distance) / radius;
          const force = Math.pow(ratio, 2);

          const pushX = (dx / (distance || 1)) * force * strength;
          const pushY = (dy / (distance || 1)) * force * strength;

          const scaleWobble = Math.sin(time + data.phase) * 0.22;
          const floatWobbleY = Math.cos(time * 0.8 + data.phase) * 4.5;
          const floatWobbleX = Math.sin(time * 0.6 + data.phase) * 3;

          const targetX = pushX + floatWobbleX * force;
          const targetY = pushY + floatWobbleY * force;
          const targetScale = 1 + scaleWobble * force;
          
          const blurVal = force * 2.2;
          const skewVal = Math.sin(time * 1.2 + data.phase) * 6 * force;

          gsap.to(data.el, {
            x: targetX,
            y: targetY,
            scale: targetScale,
            filter: `blur(${blurVal}px)`,
            skewX: skewVal,
            opacity: 1 - force * 0.15,
            duration: 0.25,
            ease: "power2.out",
            overwrite: "auto",
          });
        } else {
          gsap.to(data.el, {
            x: 0,
            y: 0,
            scale: 1,
            filter: "blur(0px)",
            skewX: 0,
            opacity: 1,
            duration: 0.45,
            ease: "power2.out",
            overwrite: "auto",
          });
        }
      });

      rafId = requestAnimationFrame(animate);
    };

    const handleMouseEnter = () => {
      updateCenters();
      isHovering = true;
      if (rafId) cancelAnimationFrame(rafId);
      rafId = requestAnimationFrame(animate);
    };

    const handleMouseMove = (e: MouseEvent) => {
      mouseX = e.clientX;
      mouseY = e.clientY;
    };

    const handleMouseLeave = () => {
      isHovering = false;
      if (rafId) {
        cancelAnimationFrame(rafId);
        rafId = null;
      }
      
      words.forEach((word) => {
        gsap.to(word, {
          x: 0,
          y: 0,
          scale: 1,
          filter: "blur(0px)",
          skewX: 0,
          opacity: 1,
          duration: 0.75,
          ease: "elastic.out(1, 0.75)",
          overwrite: "auto",
        });
      });
      cachedCenters = [];
    };

    container.addEventListener("mouseenter", handleMouseEnter);
    container.addEventListener("mousemove", handleMouseMove);
    container.addEventListener("mouseleave", handleMouseLeave);

    window.addEventListener("resize", handleMouseLeave);
    window.addEventListener("scroll", handleMouseLeave);

    return () => {
      if (rafId) cancelAnimationFrame(rafId);
      container.removeEventListener("mouseenter", handleMouseEnter);
      container.removeEventListener("mousemove", handleMouseMove);
      container.removeEventListener("mouseleave", handleMouseLeave);
      window.removeEventListener("resize", handleMouseLeave);
      window.removeEventListener("scroll", handleMouseLeave);
    };
  }, [text]);

  const wordsArray = text.split(" ");

  return (
    <p 
      ref={containerRef} 
      className="text-sm md:text-base leading-relaxed text-zinc-400 group-hover/desc:text-zinc-200 transition-colors duration-300 select-none"
    >
      {wordsArray.map((word, i) => {
        let colorClass = "hover:text-white";
        if (word.toLowerCase().includes("react")) {
          colorClass = "text-[#7fff5e]/90 font-bold hover:text-[#7fff5e]";
        } else if (word.toLowerCase().includes("webgl") || word.toLowerCase().includes("gsap")) {
          colorClass = "text-[#ff5c71]/90 font-bold hover:text-[#ff5c71]";
        }
        return (
          <span 
            key={i} 
            className={`repel-word inline-block mr-[0.25em] transition-colors duration-300 ${colorClass}`}
            style={{ display: "inline-block", willChange: "transform, opacity, filter" }}
          >
            {word}
          </span>
        );
      })}
    </p>
  );
}

export function FasterSection() {
  const router = useRouter();
  const titleRef = useRef<HTMLHeadingElement>(null);
  const cardsRef = useRef<(HTMLDivElement | null)[]>([]);
  const [hoveredIndex, setHoveredIndex] = useState<number | null>(null);

  useEffect(() => {
    const ctx = gsap.context(() => {
      const tl = gsap.timeline({ defaults: { ease: "power3.out" } });
      tl.fromTo(titleRef.current?.children ?? [], { y: 72, opacity: 0 }, { y: 0, opacity: 1, duration: 0.85, stagger: 0.08 })
        .fromTo(cardsRef.current.filter(Boolean), { y: 40, opacity: 0, rotate: 1 }, { y: 0, opacity: 1, rotate: 0, duration: 0.6, stagger: 0.06, ease: "power2.out" }, "-=0.3");
    });

    return () => ctx.revert();
  }, []);

  return (
    <section
      className="snap-start relative h-screen w-full overflow-hidden z-10"
      style={{ scrollSnapStop: "always" }}
    >
      <div className="relative z-20 grid h-full grid-cols-12 gap-5 px-6 pb-16 pt-28 md:px-10 md:pb-20 items-center">
        {/* Left Column: Heading */}
        <div className="col-span-12 lg:col-span-4 flex flex-col justify-center">
          <p className="mb-3 font-mono text-xs uppercase text-[#e0f2dc]/62" style={{ letterSpacing: 0 }}>
            Chapter 02 / Build Faster
          </p>
          <h1
            ref={titleRef}
            className="font-black uppercase leading-[0.76] text-white text-[clamp(3.2rem,8vw,7.5rem)]"
            style={{ fontFamily: "var(--font-londrina-solid)", letterSpacing: 0 }}
          >
            <span className="block">Build</span>
            <span className="block text-[#ff5c71] translate-x-[2.5vw] md:translate-x-6">
              Faster<span className="text-[#7fff5e]">.</span>
            </span>
          </h1>
        </div>

        {/* Right Column: Sliding Crate Accordion Drawer */}
        <div className="col-span-12 lg:col-span-8 flex flex-col md:flex-row h-auto md:h-[400px] w-full gap-3 overflow-hidden lg:mb-2 z-10">
          {DROPS.map((drop, index) => {
            const isHovered = hoveredIndex === index;
            return (
              <div
                key={drop.name}
                ref={(element) => { cardsRef.current[index] = element; }}
                onClick={() => router.push(drop.href)}
                onMouseEnter={() => setHoveredIndex(index)}
                onMouseLeave={() => setHoveredIndex(null)}
                className={`group relative transition-all duration-500 ease-[cubic-bezier(0.25,1,0.3,1)] overflow-hidden rounded-[12px] border bg-black/54 p-3.5 md:p-4.5 backdrop-blur-md cursor-pointer flex flex-col justify-between
                  ${isHovered ? "flex-[3.5] h-[210px] md:h-full bg-zinc-950/60" : "flex-1 h-[68px] md:h-full"}
                `}
                style={{
                  borderColor: isHovered ? `${drop.color}50` : "rgba(255,255,255,0.08)",
                  boxShadow: isHovered ? `0 0 30px ${drop.color}10, inset 0 0 15px ${drop.color}05` : "none",
                }}
              >
                {/* Collapsed Mobile View */}
                <div className={`flex items-center justify-between w-full h-full md:hidden ${isHovered ? "hidden" : "flex"}`}>
                  <div className="flex items-center gap-2">
                    <p className="text-lg font-black uppercase text-white" style={{ fontFamily: "var(--font-londrina-solid)", letterSpacing: 0 }}>
                      {drop.name}
                    </p>
                    <span className="font-mono text-[9px] uppercase text-white/35">
                      {"// "}{drop.type.split(" / ")[0]}
                    </span>
                  </div>
                  <span className="rounded-full border border-white/12 px-2 py-0.5 text-[9px] font-bold text-white/62">
                    {drop.access}
                  </span>
                </div>

                {/* Desktop View & Expanded Mobile View */}
                <div className={`flex-col h-full justify-between w-full md:flex ${isHovered ? "flex" : "hidden"}`}>
                  {/* Dynamic Preview Container */}
                  <div 
                    className={`transition-all duration-500 ${isHovered ? "opacity-100 scale-100 mb-3" : "opacity-0 scale-95 md:invisible md:h-0"}`}
                    onClick={(e) => e.stopPropagation()}
                  >
                    <RealPreview id={drop.id} />
                  </div>

                  {/* Info and Status Row */}
                  <div className={`flex ${isHovered ? "flex-row items-end justify-between" : "flex-col items-start"} w-full gap-2`}>
                    <div className={`flex ${isHovered ? "flex-col" : "md:flex-col-reverse flex-row items-center md:items-start"} gap-1 md:gap-1.5`}>
                      {/* Name with writing mode toggle */}
                      <p 
                        className={`text-xl md:text-2.5xl font-black uppercase leading-none text-white transition-all duration-500 ease-[cubic-bezier(0.25,1,0.3,1)]
                          ${isHovered ? "md:[writing-mode:horizontal-tb] md:rotate-0" : "md:[writing-mode:vertical-rl] md:rotate-180 md:py-2"}
                        `}
                        style={{ fontFamily: "var(--font-londrina-solid)", letterSpacing: 0 }}
                      >
                        {drop.name}
                      </p>
                      <p className={`font-mono text-[9px] uppercase text-white/35 transition-opacity duration-300 ${!isHovered ? "md:hidden" : "block"}`}>
                        {drop.type}
                      </p>
                    </div>

                    {/* Access tag */}
                    <span 
                      className={`rounded-full border px-2 py-0.5 text-[9px] font-bold text-white/62 transition-colors duration-300 ${isHovered ? "border-[var(--accent-color)]/30 text-[var(--accent-color)]" : "border-white/12"}`}
                      style={{ 
                        ['--accent-color' as string]: drop.color,
                        writingMode: "horizontal-tb"
                      } as React.CSSProperties}
                    >
                      {drop.access}
                    </span>
                  </div>
                </div>
              </div>
            );
          })}
        </div>
      </div>
    </section>
  );
}
