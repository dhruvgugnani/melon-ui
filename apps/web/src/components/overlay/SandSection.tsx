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
      <div className="flex-none px-6 pt-[12vh] md:px-10">
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

      <div className="mt-7 flex-none overflow-hidden border-y border-white/8 bg-[#ff5c71]/8 py-3">
        <div ref={tickerRef} className="flex w-max gap-10 whitespace-nowrap will-change-transform">
          {[...TICKER_ITEMS, ...TICKER_ITEMS].map((item, index) => (
            <span key={`${item}-${index}`} className="font-mono text-xs uppercase text-white/38" style={{ letterSpacing: 0 }}>
              {item} <span className="text-[#ff5c71]">/</span>
            </span>
          ))}
        </div>
      </div>

      <div className="grid flex-1 grid-cols-12 items-end gap-5 px-6 pb-10 md:px-10">
        <div className="col-span-12 lg:col-span-7">
          <div className="rounded-[8px] border border-white/10 bg-black/62 p-5 font-mono text-sm text-white/72 backdrop-blur-md">
            <div className="mb-4 flex items-center justify-between border-b border-white/8 pb-3">
              <span className="text-xs uppercase text-white/35" style={{ letterSpacing: 0 }}>
                terminal
              </span>
              <span className="rounded-full bg-[#e0f2dc] px-2.5 py-1 text-xs font-bold text-black">
                copy ready
              </span>
            </div>
            {CODE_LINES.map((line, index) => (
              <div key={line} className="flex gap-3 py-2">
                <span className="text-[#ff5c71]">$</span>
                <span className={index === 2 ? "text-white/45" : "text-white"}>{line}</span>
              </div>
            ))}
          </div>
        </div>

        <div className="col-span-12 lg:col-span-5">
          <div className="grid gap-3 sm:grid-cols-3 lg:grid-cols-1">
            {[
              ["Free core", "Buttons, inputs, navs, cards"],
              ["Paid later", "Big WebGL scenes and packs"],
              ["No lock-in", "Source-first components"],
            ].map(([title, body]) => (
              <div key={title} className="rounded-[8px] border border-white/10 bg-white/7 p-4 backdrop-blur-md">
                <p className="text-xl font-black uppercase text-white" style={{ fontFamily: "var(--font-londrina-solid)", letterSpacing: 0 }}>
                  {title}
                </p>
                <p className="mt-2 text-sm font-semibold leading-6 text-white/55">{body}</p>
              </div>
            ))}
          </div>
        </div>
      </div>
    </section>
  );
}
