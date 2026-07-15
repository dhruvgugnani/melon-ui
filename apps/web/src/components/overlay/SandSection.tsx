"use client";

import { useEffect, useRef } from "react";
import gsap from "gsap";

const TICKER_ITEMS = [
  "install",
  "preview",
  "copy",
  "theme",
  "ship",
  "remix",
  "upgrade later",
  "stay weird",
];

const CODE_LINES = [
  "npx @melonui-dev/cli add seed-burst-button",
  "npx @melonui-dev/cli add magnetic-nav",
  "npx @melonui-dev/cli add particle-field --pro",
];

export function SandSection() {
  const tickerRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    if (!tickerRef.current) return;

    const tween = gsap.to(tickerRef.current, {
      xPercent: -50,
      duration: 22,
      ease: "none",
      repeat: -1,
    });

    return () => {
      tween.kill();
    };
  }, []);

  return (
    <section
      id="sand-section"
      className="snap-start relative z-10 flex h-screen w-full flex-col overflow-hidden"
      style={{ scrollSnapStop: "always" }}
    >
      {/* Header aligned on vertical axis */}
      <div className="flex-none w-full max-w-7xl mx-auto px-6 pt-[12vh] md:px-10 lg:px-16">
        <p className="mb-3 font-mono text-xs uppercase text-[#ff5c71]" style={{ letterSpacing: 0 }}>
          Chapter 03 / Seeds hit code
        </p>
        <h2
          className="font-black uppercase leading-[0.82] text-white text-[clamp(3rem,9vw,8.5rem)]"
          style={{ fontFamily: "var(--font-londrina-solid)", letterSpacing: 0 }}
        >
          Drop It
          <span className="block text-[#ff5c71]">Into Your Repo</span>
        </h2>
      </div>

      {/* Marquee Separator with Seamless Loop */}
      <div className="mt-7 flex-none overflow-hidden border-y border-white/8 bg-[#ff5c71]/8 py-3">
        <div ref={tickerRef} className="flex w-max whitespace-nowrap will-change-transform">
          {/* Block 1 */}
          <div className="flex gap-10 pr-10">
            {TICKER_ITEMS.map((item) => (
              <span key={item} className="font-mono text-xs uppercase text-white/38" style={{ letterSpacing: 0 }}>
                {item} <span className="text-[#ff5c71]">/</span>
              </span>
            ))}
          </div>
          {/* Block 2 */}
          <div className="flex gap-10 pr-10">
            {TICKER_ITEMS.map((item) => (
              <span key={`${item}-dup`} className="font-mono text-xs uppercase text-white/38" style={{ letterSpacing: 0 }}>
                {item} <span className="text-[#ff5c71]">/</span>
              </span>
            ))}
          </div>
        </div>
      </div>

      {/* Bottom Area aligned on vertical axis */}
      <div className="flex-1 w-full max-w-7xl mx-auto px-6 pb-10 md:px-10 lg:px-16 flex items-end">
        <div className="grid grid-cols-12 gap-5 w-full items-end">
          {/* Left Column: Premium Terminal */}
          <div className="col-span-12 lg:col-span-7">
            <div className="rounded-xl border border-white/10 bg-[#0c0c0c]/65 p-5 font-mono text-sm text-white/72 backdrop-blur-2xl shadow-[inset_0_1px_1px_rgba(255,255,255,0.08),0_12px_40px_rgba(0,0,0,0.7)]">
              <div className="mb-4 flex items-center justify-between border-b border-white/8 pb-3">
                <span className="text-xs uppercase text-white/35" style={{ letterSpacing: 0 }}>
                  terminal
                </span>
                <span className="rounded-full bg-[#e0f2dc] px-2.5 py-1 text-[10px] font-bold text-black uppercase">
                  copy ready
                </span>
              </div>
              {CODE_LINES.map((line, index) => (
                <div key={line} className="flex gap-3 py-2">
                  <span className="text-[#ff5c71] font-black">$</span>
                  <span className={index === 2 ? "text-white/45" : "text-white"}>{line}</span>
                </div>
              ))}
            </div>
          </div>

          {/* Right Column: Premium High-contrast Coral Cards */}
          <div className="col-span-12 lg:col-span-5">
            <div className="grid gap-3 sm:grid-cols-3 lg:grid-cols-1">
              {[
                ["Free core", "Buttons, inputs, navs, cards"],
                ["Paid later", "Big WebGL scenes and packs"],
                ["No lock-in", "Source-first components"],
              ].map(([title, body]) => (
                <div 
                  key={title} 
                  className="rounded-xl border border-white/12 bg-[#0c0c0c]/62 p-4 backdrop-blur-2xl transition-all shadow-[inset_0_1px_1px_rgba(255,255,255,0.08),0_12px_40px_rgba(0,0,0,0.7)] hover:border-[#ff5c71]/35 hover:bg-[#0f0f0f]/80 hover:scale-[1.02] hover:shadow-[0_20px_50px_rgba(0,0,0,0.85)] duration-300 ease-out"
                >
                  <p className="text-xl font-black uppercase text-white" style={{ fontFamily: "var(--font-londrina-solid)", letterSpacing: 0 }}>
                    {title}
                  </p>
                  <p className="mt-2 text-xs font-semibold leading-normal text-white/54">{body}</p>
                </div>
              ))}
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}
