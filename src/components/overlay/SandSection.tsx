"use client";

import { useRef, useEffect } from "react";
import gsap from "gsap";

const TICKER_ITEMS = [
  "GSAP Physics", "React Three Fiber", "Lenis Scroll", "ScrollTrigger",
  "Spring Elastics", "SVG Stroke", "WebGL Particles", "3D Transforms",
  "Magnetic Fields", "Blur Reveal", "Scramble Text", "Morph Clips",
];

export function SandSection() {
  const tickerRef = useRef<HTMLDivElement>(null);
  const codeRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    if (!tickerRef.current) return;
    const inner = tickerRef.current;
    // Duplicate for seamless loop
    inner.innerHTML += inner.innerHTML;
    const totalWidth = inner.scrollWidth / 2;
    gsap.to(inner, {
      x: -totalWidth,
      duration: 28,
      ease: "none",
      repeat: -1,
    });
  }, []);

  return (
    <section
      id="sand-section"
      className="snap-start relative w-full h-screen z-10 flex flex-col overflow-hidden"
      style={{ scrollSnapStop: "always" }}
    >
      {/* TOP: Full-width heading */}
      <div className="flex-none pt-[12vh] px-8">
        <div className="flex items-baseline gap-6">
          <h2
            className="text-[clamp(3rem,10vw,9rem)] font-black uppercase leading-none tracking-tighter"
            style={{ fontFamily: "var(--font-londrina-solid)" }}
          >
            <span className="text-white">How It</span>
          </h2>
          <span className="font-mono text-xs text-white/20 uppercase tracking-[0.3em] self-end pb-4">
            under the hood
          </span>
        </div>
        <h2
          className="text-[clamp(3rem,10vw,9rem)] font-black uppercase leading-none tracking-tighter text-[#ff5c71] -mt-3"
          style={{ fontFamily: "var(--font-londrina-solid)" }}
        >
          Works
        </h2>
      </div>

      {/* MIDDLE: Full-bleed ticker */}
      <div className="flex-none mt-8 overflow-hidden border-t border-b border-white/5 py-3 bg-[#ff5c71]/5">
        <div ref={tickerRef} className="flex gap-12 whitespace-nowrap will-change-transform">
          {TICKER_ITEMS.map((item, i) => (
            <span key={i} className="flex items-center gap-12 font-mono text-xs uppercase tracking-[0.25em] text-white/30">
              {item}
              <span className="text-[#ff5c71]">·</span>
            </span>
          ))}
        </div>
      </div>

      {/* BOTTOM: Two-col layout */}
      <div className="flex-1 flex items-end px-8 pb-10 gap-0">
        {/* Left code block */}
        <div
          ref={codeRef}
          className="flex-1 font-mono text-xs leading-6 border border-white/5 bg-[#0a0a0a] p-6 mr-8"
        >
          <div className="text-[10px] text-white/20 uppercase tracking-widest mb-4 pb-2 border-b border-white/5">
            burst-button.tsx
          </div>
          <div className="text-[#7fff5e]">{"import"}{" "}
            <span className="text-white">{"{ gsap }"}</span>
            <span className="text-white/30">{" from "}</span>
            <span className="text-[#ff5c71]">{'"gsap"'}</span>
          </div>
          <br />
          <div className="text-white/50">{"// Seeds burst on click"}</div>
          <div className="text-[#7fff5e]">{"const "}<span className="text-white">handleClick</span><span className="text-white/50">{" = (e) => {"}</span></div>
          <div className="pl-4 text-white/50">{"seeds.forEach((seed, i) => {"}</div>
          <div className="pl-8 text-[#7fff5e]">gsap<span className="text-white">.to</span><span className="text-white/50">(seed, {"{"}</span></div>
          <div className="pl-12 text-white">x<span className="text-white/50">:</span> Math.cos<span className="text-white/50">(angle) * </span><span className="text-[#ff5c71]">80</span>,</div>
          <div className="pl-12 text-white">ease<span className="text-white/50">:</span> <span className="text-[#ff5c71]">&quot;power2.out&quot;</span></div>
          <div className="pl-8 text-white/50">{"});"}</div>
          <div className="pl-4 text-white/50">{"});"}</div>
          <div className="text-white/50">{"}"}</div>
        </div>

        {/* Right — vertical stat list */}
        <div className="flex flex-col gap-5 min-w-[180px]">
          {[
            ["GSAP", "Animation engine"],
            ["R3F", "3D renderer"],
            ["Lenis", "Smooth scroll"],
          ].map(([title, desc]) => (
            <div key={title} className="flex flex-col gap-0.5">
              <span
                className="font-black text-2xl text-white"
                style={{ fontFamily: "var(--font-anton)" }}
              >
                {title}
              </span>
              <span className="font-mono text-[10px] text-white/25 uppercase tracking-widest">
                {desc}
              </span>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
}
