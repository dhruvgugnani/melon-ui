"use client";

import { useEffect, useRef } from "react";
import Link from "next/link";
import gsap from "gsap";

const GITHUB_URL = "https://github.com/dhruvgugnani/melon-ui";

export function HeroSection() {
  const navRef = useRef<HTMLDivElement>(null);
  const titleRef = useRef<HTMLHeadingElement>(null);
  const copyRef = useRef<HTMLParagraphElement>(null);
  const chipsRef = useRef<HTMLDivElement>(null);
  const ctasRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    const ctx = gsap.context(() => {
      const tl = gsap.timeline({ defaults: { ease: "power3.out" } });
      tl.fromTo(navRef.current, { y: -18, opacity: 0 }, { y: 0, opacity: 1, duration: 0.55 })
        .fromTo(titleRef.current?.children ?? [], { y: 72, opacity: 0 }, { y: 0, opacity: 1, duration: 0.85, stagger: 0.08 }, "-=0.2")
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
      {/* Floating Modern Glass Melon-Themed Navbar */}
      <div className="absolute left-0 right-0 top-0 z-20 w-full px-4 pt-6 md:px-8">
        <div 
          ref={navRef} 
          className="mx-auto max-w-6xl flex items-center justify-between px-6 py-3 rounded-full border border-white/10 bg-zinc-950/40 backdrop-blur-md shadow-[0_8px_32px_rgba(0,0,0,0.5)]"
        >
          <Link href="/" className="flex items-center gap-3 group" aria-label="MelonUI home">
            <span className="relative h-8 w-8 overflow-hidden rounded-full border border-white/15 bg-[#ff5c71] shrink-0 group-hover:scale-105 transition-transform duration-300">
              <span className="absolute inset-x-1 bottom-1 h-4 rounded-b-full bg-[#203f18]" />
              <span className="absolute inset-x-2 bottom-2 h-2.5 rounded-b-full bg-[#e0f2dc]" />
              <span className="absolute inset-x-3 bottom-3 h-1.5 rounded-b-full bg-[#ff5c71]" />
              <span className="absolute bottom-2.5 left-1/2 h-1 w-1 -translate-x-1/2 rounded-full bg-black" />
            </span>
            <span className="text-lg font-black uppercase text-white group-hover:text-[#ff5c71] transition-colors" style={{ fontFamily: "var(--font-londrina-solid)", letterSpacing: 0 }}>
              MelonUI
            </span>
          </Link>

          <div className="flex items-center gap-3 text-xs font-bold">
            <a
              href={GITHUB_URL}
              target="_blank"
              rel="noreferrer"
              className="rounded-full border border-white/10 bg-white/5 px-4 py-1.5 text-white/70 hover:text-white hover:bg-white/10 hover:border-white/20 hover:scale-105 active:scale-95 transition-all duration-200"
            >
              GitHub
            </a>
            <Link
              href="/community"
              className="rounded-full bg-[#7fff5e] px-4 py-1.5 text-black font-black uppercase tracking-wider hover:bg-white hover:scale-105 active:scale-95 shadow-[0_0_12px_rgba(127,255,94,0.2)] transition-all duration-200"
              style={{ fontFamily: "var(--font-londrina-solid)" }}
            >
              Store
            </Link>
          </div>
        </div>
      </div>

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
          <p ref={copyRef} className="text-base font-semibold leading-7 text-white/68 md:text-lg md:leading-8">
            A scrollable component storefront told through one melon: cut it open, collect the drops, copy the code, and unlock the pieces your interface actually deserves.
          </p>
          
          <div ref={chipsRef} className="mt-4 flex flex-wrap gap-2">
            {["Most drops free", "Pro vault later", "GSAP + R3F", "Copy ready"].map((chip) => (
              <span key={chip} className="rounded-full border border-white/12 bg-white/7 px-3 py-1 text-xs font-bold text-white/72 backdrop-blur-md">
                {chip}
              </span>
            ))}
          </div>

          <div ref={ctasRef} className="mt-6 flex items-center gap-4">
            <Link
              href="/community"
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
