"use client";

import { useRef } from "react";
import Link from "next/link";
import gsap from "gsap";

const GITHUB_URL = "https://github.com/dhruvgugnani/melon-ui";

export function CTASection() {
  const glowRef = useRef<HTMLDivElement>(null);

  const handleEnter = () => {
    gsap.to(glowRef.current, { opacity: 1, scale: 1.18, duration: 0.35, ease: "power2.out" });
  };

  const handleLeave = () => {
    gsap.to(glowRef.current, { opacity: 0, scale: 1, duration: 0.35, ease: "power2.in" });
  };

  return (
    <section
      className="snap-start relative z-10 flex h-screen w-full flex-col overflow-hidden"
      style={{ scrollSnapStop: "always" }}
    >
      <div className="pointer-events-none absolute inset-0 flex items-center justify-center overflow-hidden" aria-hidden>
        <span
          className="text-[28vw] font-black uppercase leading-none text-white/[0.018]"
          style={{ fontFamily: "var(--font-londrina-solid)", letterSpacing: 0 }}
        >
          Ship
        </span>
      </div>

      <div className="flex flex-none items-center justify-between px-6 pt-8 md:px-10">
        <span className="font-mono text-xs uppercase text-white/25" style={{ letterSpacing: 0 }}>
          Final stop
        </span>
        <span className="font-mono text-xs uppercase text-[#ff5c71]" style={{ letterSpacing: 0 }}>
          07 / 07
        </span>
      </div>

      <div className="relative z-10 flex flex-1 flex-col items-center justify-center gap-7 px-6 text-center md:px-10">
        <h2
          className="font-black uppercase leading-[0.82] text-white text-[clamp(4rem,11vw,10rem)]"
          style={{ fontFamily: "var(--font-londrina-solid)", letterSpacing: 0 }}
        >
          <span className="block">Steal</span>
          <span className="block text-[#ff5c71]">Good</span>
          <span className="block text-[#e0f2dc]">Taste</span>
        </h2>
        <p className="max-w-xl text-lg font-semibold leading-7 text-white/58">
          Browse the real demos, copy the free pieces, and keep the pro vault for the expensive cinematic drops.
        </p>

        <div className="relative mt-2 flex flex-wrap justify-center gap-3">
          <div ref={glowRef} className="absolute inset-0 rounded-full bg-[#ff5c71] opacity-0 blur-2xl" />
          <Link
            href="/community"
            onMouseEnter={handleEnter}
            onMouseLeave={handleLeave}
            className="relative rounded-full bg-[#ff5c71] px-7 py-4 text-base font-black text-black transition-colors hover:bg-white"
          >
            Enter the store
          </Link>
          <a
            href={GITHUB_URL}
            target="_blank"
            rel="noreferrer"
            className="relative rounded-full border border-white/14 bg-black/36 px-7 py-4 text-base font-black text-white/74 backdrop-blur-md transition-colors hover:text-white"
          >
            Star on GitHub
          </a>
        </div>
      </div>

      <div className="flex flex-none items-center justify-between px-6 pb-8 text-xs font-bold uppercase text-white/25 md:px-10" style={{ letterSpacing: 0 }}>
        <span>MelonUI 2026</span>
        <span>Core free / Pro when it earns it</span>
      </div>
    </section>
  );
}
