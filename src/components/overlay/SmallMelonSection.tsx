"use client";

import { useRef } from "react";
import gsap from "gsap";

const QUOTES = [
  { text: "Animations that feel alive", author: "GSAP Spring Physics" },
  { text: "WebGL when you need the extra dimension", author: "React Three Fiber" },
  { text: "Smooth scrolling without the jank", author: "Lenis" },
];

export function SmallMelonSection() {
  const quoteRefs = useRef<(HTMLDivElement | null)[]>([]);

  const handleEnter = (i: number) => {
    if (!quoteRefs.current[i]) return;
    gsap.to(quoteRefs.current[i], {
      x: 10,
      duration: 0.35,
      ease: "power2.out",
    });
  };
  const handleLeave = (i: number) => {
    if (!quoteRefs.current[i]) return;
    gsap.to(quoteRefs.current[i], {
      x: 0,
      duration: 0.5,
      ease: "elastic.out(1, 0.5)",
    });
  };

  return (
    <section
      id="small-melon-section"
      className="snap-start relative w-full h-screen z-10 flex flex-col overflow-hidden"
      style={{ scrollSnapStop: "always" }}
    >
      {/* TOP strip */}
      <div className="flex-none h-1 bg-[#ff5c71]" />

      <div className="flex-1 flex flex-col md:flex-row">
        {/* LEFT — tall heading */}
        <div className="flex-none md:w-[45%] flex flex-col justify-end p-8 md:p-12 border-r border-white/5">
          <span className="font-mono text-[9px] text-white/20 uppercase tracking-[0.3em] mb-4">Philosophy</span>
          <h2
            className="font-black uppercase leading-[0.85] tracking-tighter"
            style={{
              fontFamily: "var(--font-londrina-solid)",
              fontSize: "clamp(3rem, 7vw, 6.5rem)",
            }}
          >
            <span className="text-white">Less</span>
            <br />
            <span className="text-[#7fff5e]">Config</span>
            <br />
            <span className="text-white">More</span>
            <br />
            <span className="text-[#ff5c71]">Motion</span>
          </h2>
          <p className="font-mono text-xs text-white/25 uppercase tracking-widest mt-6 max-w-xs leading-relaxed">
            Every component is a self-contained unit of animation logic.
            Grab what you need. Skip the rest.
          </p>
        </div>

        {/* RIGHT — Manifesto quotes */}
        <div className="flex-1 flex flex-col justify-center gap-0 p-8 md:p-12">
          {QUOTES.map((q, i) => (
            <div
              key={q.author}
              ref={(el) => { quoteRefs.current[i] = el; }}
              className="group py-6 border-b border-white/[0.04] cursor-default"
              onMouseEnter={() => handleEnter(i)}
              onMouseLeave={() => handleLeave(i)}
            >
              <p
                className="text-xl md:text-2xl font-black uppercase tracking-tight text-white mb-1 group-hover:text-[#ff5c71] transition-colors"
                style={{ fontFamily: "var(--font-anton)" }}
              >
                &quot;{q.text}&quot;
              </p>
              <p className="font-mono text-[10px] text-white/20 uppercase tracking-[0.2em]">
                — {q.author}
              </p>
            </div>
          ))}

          {/* Color palette row */}
          <div className="flex items-center gap-3 pt-8">
            {["#ff5c71", "#7fff5e", "#e8d5b7", "#050505", "#f4f4f4"].map((color) => (
              <div
                key={color}
                className="w-6 h-6 rounded-sm"
                style={{ background: color, outline: "1px solid rgba(255,255,255,0.08)" }}
                title={color}
              />
            ))}
            <span className="font-mono text-[9px] text-white/20 uppercase tracking-widest ml-2">
              System palette
            </span>
          </div>
        </div>
      </div>
    </section>
  );
}
