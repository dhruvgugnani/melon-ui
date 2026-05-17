"use client";

import { useRef } from "react";
import Link from "next/link";
import gsap from "gsap";

export function CTASection() {
  const btnRef = useRef<HTMLAnchorElement>(null);
  const glowRef = useRef<HTMLDivElement>(null);

  const handleEnter = () => {
    gsap.to(glowRef.current, { opacity: 1, scale: 1.3, duration: 0.4, ease: "power2.out" });
    gsap.to(btnRef.current, { scale: 1.04, duration: 0.3, ease: "power2.out" });
  };
  const handleLeave = () => {
    gsap.to(glowRef.current, { opacity: 0, scale: 1, duration: 0.4, ease: "power2.in" });
    gsap.to(btnRef.current, { scale: 1, duration: 0.5, ease: "elastic.out(1, 0.5)" });
  };

  return (
    <section
      className="snap-start relative w-full h-screen z-10 flex flex-col overflow-hidden"
      style={{ scrollSnapStop: "always" }}
    >
      {/* Chaotic background text — intentional noise */}
      <div className="absolute inset-0 flex items-center justify-center pointer-events-none select-none overflow-hidden" aria-hidden>
        <span
          className="font-black uppercase text-[25vw] leading-none tracking-tighter text-white/[0.018]"
          style={{ fontFamily: "var(--font-londrina-solid)" }}
        >
          GO
        </span>
      </div>

      {/* TOP — breadcrumb */}
      <div className="flex-none flex items-center justify-between px-8 pt-8">
        <span className="font-mono text-[10px] text-white/20 uppercase tracking-[0.3em]">
          Final stop
        </span>
        <div className="h-px flex-1 mx-8 bg-white/5" />
        <span className="font-mono text-[10px] text-[#ff5c71] uppercase tracking-[0.3em]">
          07 / 07
        </span>
      </div>

      {/* MIDDLE — CTA content */}
      <div className="flex-1 flex flex-col items-center justify-center gap-8 px-8">
        <h2
          className="font-black uppercase leading-[0.85] tracking-tighter text-center"
          style={{
            fontFamily: "var(--font-londrina-solid)",
            fontSize: "clamp(3.5rem, 11vw, 10rem)",
          }}
        >
          <span className="text-white block">Ready to</span>
          <span className="text-[#ff5c71] block">Build</span>
          <span className="text-[#7fff5e] block" style={{ fontFamily: "var(--font-londrina-sketch)" }}>
            Something?
          </span>
        </h2>

        {/* CTA button */}
        <div className="relative">
          {/* Glow */}
          <div
            ref={glowRef}
            className="absolute inset-0 rounded-none opacity-0 blur-xl"
            style={{ background: "#ff5c71", transform: "scale(1)" }}
          />
          <Link
            ref={btnRef}
            href="/community"
            className="relative inline-flex items-center gap-4 px-10 py-5 bg-[#ff5c71] text-[#050505] font-black uppercase tracking-widest hover:bg-white transition-colors"
            style={{ fontFamily: "var(--font-anton)", fontSize: "clamp(1rem, 2vw, 1.4rem)" }}
            onMouseEnter={handleEnter}
            onMouseLeave={handleLeave}
          >
            Enter the Store
            <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="square">
              <path d="M5 12h14M12 5l7 7-7 7" />
            </svg>
          </Link>
        </div>

        <p className="font-mono text-xs text-white/20 uppercase tracking-[0.2em] text-center max-w-sm">
          Free to use · Community driven · Submit your own components
        </p>
      </div>

      {/* BOTTOM footer */}
      <div className="flex-none flex items-center justify-between px-8 pb-8">
        <span className="font-mono text-[9px] text-white/15 uppercase tracking-widest">
          © 2026 MelonUI
        </span>
        <div className="flex items-center gap-6">
          {["GitHub", "Twitter", "Discord"].map((link) => (
            <a
              key={link}
              href="#"
              className="font-mono text-[9px] text-white/15 hover:text-white/40 uppercase tracking-widest transition-colors"
            >
              {link}
            </a>
          ))}
        </div>
      </div>
    </section>
  );
}
