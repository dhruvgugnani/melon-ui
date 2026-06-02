"use client";

import { useEffect, useRef } from "react";
import Link from "next/link";
import gsap from "gsap";

const GITHUB_URL = "https://github.com/dhruvgugnani/melon-ui";

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
      className="text-base font-semibold leading-7 text-white/68 md:text-lg md:leading-8 select-none"
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

export function HeroSection() {
  const titleRef = useRef<HTMLHeadingElement>(null);
  const copyRef = useRef<HTMLDivElement>(null);
  const chipsRef = useRef<HTMLDivElement>(null);
  const ctasRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    const ctx = gsap.context(() => {
      const tl = gsap.timeline({ defaults: { ease: "power3.out" } });
      tl.fromTo(titleRef.current?.children ?? [], { y: 72, opacity: 0 }, { y: 0, opacity: 1, duration: 0.85, stagger: 0.08 })
        .fromTo(copyRef.current, { y: 18, opacity: 0 }, { y: 0, opacity: 1, duration: 0.55 }, "-=0.35")
        .fromTo(chipsRef.current?.children ?? [], { y: 16, opacity: 0 }, { y: 0, opacity: 1, duration: 0.45, stagger: 0.05 }, "-=0.25")
        .fromTo(ctasRef.current?.children ?? [], { y: 16, opacity: 0 }, { y: 0, opacity: 1, duration: 0.45, stagger: 0.05 }, "-=0.25");
    });

    return () => ctx.revert();
  }, []);

  return (
    <section
      className="snap-start relative h-screen w-full overflow-hidden z-10"
      style={{ scrollSnapStop: "always" }}
    >
      <div className="relative z-20 grid h-full grid-cols-12 gap-5 px-6 pb-16 pt-28 md:px-10 md:pb-20">
        <div className="col-span-12 lg:col-span-8 self-end">
          <p className="mb-3 font-mono text-xs uppercase text-[#e0f2dc]/62" style={{ letterSpacing: 0 }}>
            Chaotic components. Production taste.
          </p>
          <h1
            ref={titleRef}
            className="font-black uppercase leading-[0.76] text-white text-[clamp(3.5rem,10vw,9.5rem)]"
            style={{ fontFamily: "var(--font-londrina-solid)", letterSpacing: 0 }}
          >
            <span className="block">Slice</span>
            <span className="block translate-x-[9vw] text-[#ff5c71] md:translate-x-24">The</span>
            <span className="block text-[#e0f2dc]">
              Web<span className="text-[#7fff5e]">.</span>
            </span>
          </h1>
        </div>

        <div className="col-span-12 max-w-xl lg:col-span-4 self-end lg:mb-2">
          <div ref={copyRef} className="py-1">
            <RepellingText text="Skip the generic. Access a curated laboratory of high-fidelity React components and custom WebGL animations engineered with GSAP to make your web applications feel alive." />
          </div>
          
          <div ref={chipsRef} className="mt-4 flex flex-wrap gap-2">
            {[
              { text: "React / Next.js", color: "bg-[#7fff5e]" },
              { text: "GSAP / Motion", color: "bg-[#ff5c71]" },
              { text: "Tailwind CSS", color: "bg-[#7fff5e]" },
              { text: "TypeScript", color: "bg-white/50" }
            ].map((chip) => (
              <span 
                key={chip.text} 
                className="inline-flex items-center gap-1.5 rounded-[4px] border border-white/8 bg-white/[0.02] px-3 py-1.5 font-mono text-[9px] uppercase tracking-wider text-zinc-400"
                style={{ letterSpacing: 0 }}
              >
                <span className={`w-1.5 h-1.5 rounded-full ${chip.color}`} />
                {chip.text}
              </span>
            ))}
          </div>

          <div ref={ctasRef} className="mt-6 flex items-center gap-4">
            <Link
              href="/components"
              className="px-6 py-3 bg-[#7fff5e] text-black font-black uppercase tracking-wider rounded-full hover:bg-white hover:scale-105 active:scale-95 shadow-[0_4px_20px_rgba(127,255,94,0.25)] transition-all duration-200 text-xs md:text-sm"
              style={{ fontFamily: "var(--font-londrina-solid)" }}
            >
              Explore Components
            </Link>
            <a
              href={GITHUB_URL}
              target="_blank"
              rel="noreferrer"
              className="px-6 py-3 bg-white/5 border border-white/10 text-white/90 hover:text-white hover:bg-white/10 hover:border-white/20 hover:scale-105 active:scale-95 rounded-full backdrop-blur-md transition-all duration-200 text-xs md:text-sm font-semibold"
            >
              GitHub Repo
            </a>
          </div>
        </div>
      </div>

      <div className="absolute bottom-7 left-1/2 z-20 flex -translate-x-1/2 flex-col items-center gap-2">
        <span className="font-mono text-[10px] uppercase text-white/30" style={{ letterSpacing: 0 }}>
          Scroll the story
        </span>
        <div className="h-10 w-px bg-gradient-to-b from-white/30 to-transparent" />
      </div>
    </section>
  );
}
