"use client";

import { useEffect, useRef } from "react";
import Link from "next/link";
import gsap from "gsap";

const NAV_ITEMS = ["Store", "Docs", "GitHub"];

export function HeroSection() {
  const headRef = useRef<HTMLHeadingElement>(null);
  const subRef = useRef<HTMLParagraphElement>(null);
  const navRef = useRef<HTMLDivElement>(null);
  const tagRef = useRef<HTMLDivElement>(null);
  const arrowRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    const ctx = gsap.context(() => {
      const tl = gsap.timeline({ defaults: { ease: "power3.out" } });
      tl.from(navRef.current, { y: -20, opacity: 0, duration: 0.6 })
        .from(tagRef.current, { x: -30, opacity: 0, duration: 0.5 }, "-=0.2")
        .from(headRef.current?.children ?? [], {
          y: 80,
          opacity: 0,
          duration: 0.9,
          stagger: 0.12,
        }, "-=0.2")
        .from(subRef.current, { y: 20, opacity: 0, duration: 0.6 }, "-=0.4")
        .from(arrowRef.current, { opacity: 0, y: 10, duration: 0.5 }, "-=0.2");
    });
    return () => ctx.revert();
  }, []);

  return (
    <section
      className="snap-start relative w-full h-screen overflow-hidden z-10"
      style={{ scrollSnapStop: "always" }}
    >
      {/* NAV */}
      <div ref={navRef} className="absolute top-0 left-0 right-0 flex items-center justify-between px-8 pt-8 z-20">
        <div className="flex items-center gap-2">
          {/* Logo mark */}
          <svg width="22" height="22" viewBox="0 0 24 24" fill="none">
            <path d="M2 12C2 17.5228 6.47715 22 12 22C17.5228 22 22 17.5228 22 12H2Z" fill="#2e4a25"/>
            <path d="M3.5 12C3.5 16.6944 7.30558 20.5 12 20.5C16.6944 20.5 20.5 16.6944 20.5 12H3.5Z" fill="#e0f2dc"/>
            <path d="M5 12C5 15.866 8.13401 19 12 19C15.866 19 19 15.866 19 12H5Z" fill="#ff5c71"/>
            <circle cx="9" cy="15" r="1.2" fill="#000"/>
            <circle cx="12" cy="17" r="1.2" fill="#000"/>
            <circle cx="15" cy="15" r="1.2" fill="#000"/>
          </svg>
          <span
            className="text-sm font-black uppercase tracking-widest text-white"
            style={{ fontFamily: "var(--font-anton)" }}
          >
            MelonUI
          </span>
        </div>
        <div ref={navRef} className="flex items-center gap-6">
          {NAV_ITEMS.map((item) => (
            <Link
              key={item}
              href={item === "Store" ? "/community" : "#"}
              className="font-mono text-xs uppercase tracking-widest text-white/40 hover:text-white transition-colors"
            >
              {item}
            </Link>
          ))}
          <Link
            href="/community"
            className="px-4 py-1.5 bg-[#ff5c71] text-[#050505] font-mono text-xs uppercase tracking-widest font-black hover:bg-white transition-colors"
          >
            Get Started →
          </Link>
        </div>
      </div>

      {/* CATEGORY TAG — top left floater */}
      <div
        ref={tagRef}
        className="absolute left-8 top-1/2 -translate-y-1/2 flex flex-col gap-1 z-20"
      >
        <span className="font-mono text-[9px] text-white/25 uppercase tracking-[0.3em]">v1.0.0</span>
        <div className="w-px h-24 bg-white/10 mx-auto" />
        <span className="font-mono text-[9px] text-white/25 uppercase tracking-[0.3em] [writing-mode:vertical-lr]">
          Component Library
        </span>
      </div>

      {/* MAIN HEADING — bottom anchored, massive */}
      <div className="absolute bottom-0 left-0 right-0 px-6 md:px-10 pb-28 z-20">
        <h1
          ref={headRef}
          className="font-black uppercase leading-[0.82] tracking-tighter overflow-hidden"
          style={{ fontFamily: "var(--font-londrina-solid)", fontSize: "clamp(4.5rem, 14vw, 14rem)" }}
        >
          <span className="block text-white overflow-hidden">Build</span>
          <span className="block text-[#ff5c71] overflow-hidden">Juicy</span>
          <span className="block text-[#7fff5e] overflow-hidden" style={{ fontFamily: "var(--font-londrina-sketch)" }}>
            Interfaces
          </span>
        </h1>

        {/* Inline sub + CTA row */}
        <div className="flex items-end justify-between mt-6">
          <p
            ref={subRef}
            className="font-mono text-xs text-white/35 uppercase tracking-[0.2em] max-w-xs leading-relaxed"
          >
            Premium UI components built with GSAP, Three.js & React.
            Copy-paste ready. No fluff.
          </p>
          <div className="flex items-center gap-4">
            <span className="font-mono text-[10px] text-white/20 uppercase tracking-widest hidden md:block">
              20+ components
            </span>
            <span className="font-mono text-[10px] text-white/20 uppercase tracking-widest hidden md:block">·</span>
            <span className="font-mono text-[10px] text-white/20 uppercase tracking-widest hidden md:block">
              Free forever
            </span>
          </div>
        </div>
      </div>

      {/* SCROLL INDICATOR */}
      <div
        ref={arrowRef}
        className="absolute bottom-8 left-1/2 -translate-x-1/2 flex flex-col items-center gap-2 z-20"
      >
        <span className="font-mono text-[9px] uppercase tracking-[0.3em] text-white/20">Scroll</span>
        <div className="w-px h-10 bg-gradient-to-b from-white/20 to-transparent" />
      </div>
    </section>
  );
}
