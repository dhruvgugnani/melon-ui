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

  useEffect(() => {
    const ctx = gsap.context(() => {
      const tl = gsap.timeline({ defaults: { ease: "power3.out" } });
      tl.from(navRef.current, { y: -18, opacity: 0, duration: 0.55 })
        .from(titleRef.current?.children ?? [], { y: 72, opacity: 0, duration: 0.85, stagger: 0.08 }, "-=0.2")
        .from(copyRef.current, { y: 18, opacity: 0, duration: 0.55 }, "-=0.35")
        .from(chipsRef.current?.children ?? [], { y: 16, opacity: 0, duration: 0.45, stagger: 0.05 }, "-=0.25");
    });

    return () => ctx.revert();
  }, []);

  return (
    <section
      className="snap-start relative h-screen w-full overflow-hidden z-10"
      style={{ scrollSnapStop: "always" }}
    >
      <div className="pointer-events-none absolute left-[-12vw] top-[18vh] h-10 w-[52vw] -rotate-6 bg-[#ff5c71]" />
      <div className="pointer-events-none absolute bottom-[18vh] right-[-10vw] h-16 w-[48vw] rotate-[-8deg] border-y border-[#e0f2dc]/30 bg-[#203f18]/30" />

      <div ref={navRef} className="absolute left-0 right-0 top-0 z-20 flex items-center justify-between px-6 py-6 md:px-10">
        <Link href="/" className="flex items-center gap-3 group" aria-label="MelonUI home">
          <span className="relative h-9 w-9 overflow-hidden rounded-full border border-white/15 bg-[#ff5c71] shrink-0 group-hover:scale-105 transition-transform duration-300">
            <span className="absolute inset-x-1 bottom-1 h-5 rounded-b-full bg-[#203f18]" />
            <span className="absolute inset-x-2 bottom-2 h-3 rounded-b-full bg-[#e0f2dc]" />
            <span className="absolute inset-x-3 bottom-3 h-2 rounded-b-full bg-[#ff5c71]" />
            <span className="absolute bottom-3 left-1/2 h-1 w-1 -translate-x-1/2 rounded-full bg-black" />
          </span>
          <span className="text-xl font-black uppercase text-white group-hover:text-[#ff5c71] transition-colors" style={{ fontFamily: "var(--font-londrina-solid)", letterSpacing: 0 }}>
            MelonUI
          </span>
        </Link>

        <div className="flex items-center gap-2 text-xs font-bold">
          <a
            href={GITHUB_URL}
            target="_blank"
            rel="noreferrer"
            className="rounded-full border border-white/12 bg-black/35 px-4 py-2 text-white/70 backdrop-blur-md transition-colors hover:text-white"
          >
            GitHub
          </a>
          <Link
            href="/community"
            className="rounded-full bg-[#e0f2dc] px-4 py-2 text-black transition-colors hover:bg-white"
          >
            Store
          </Link>
        </div>
      </div>

      <div className="relative z-20 grid h-full grid-cols-12 items-end gap-5 px-6 pb-24 pt-28 md:px-10 md:pb-28">
        <div className="col-span-12 lg:col-span-8">
          <p className="mb-4 font-mono text-xs uppercase text-[#e0f2dc]/62" style={{ letterSpacing: 0 }}>
            Chaotic components. Production taste.
          </p>
          <h1
            ref={titleRef}
            className="font-black uppercase leading-[0.76] text-white text-[clamp(4.5rem,14vw,14rem)]"
            style={{ fontFamily: "var(--font-londrina-solid)", letterSpacing: 0 }}
          >
            <span className="block">Slice</span>
            <span className="block translate-x-[9vw] text-[#ff5c71] md:translate-x-24">The</span>
            <span className="block text-[#e0f2dc]">Web</span>
          </h1>
        </div>

        <div className="col-span-12 mb-3 max-w-xl lg:col-span-4">
          <p ref={copyRef} className="text-lg font-semibold leading-7 text-white/68 md:text-xl md:leading-8">
            A scrollable component storefront told through one melon: cut it open, collect the drops, copy the code, and unlock the pieces your interface actually deserves.
          </p>
          <div ref={chipsRef} className="mt-6 flex flex-wrap gap-2">
            {["Most drops free", "Pro vault later", "GSAP + R3F", "Copy ready"].map((chip) => (
              <span key={chip} className="rounded-full border border-white/12 bg-white/7 px-3 py-1.5 text-xs font-bold text-white/72 backdrop-blur-md">
                {chip}
              </span>
            ))}
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
