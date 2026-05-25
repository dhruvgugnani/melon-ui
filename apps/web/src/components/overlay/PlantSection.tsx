"use client";

import { useRef, useState } from "react";
import Link from "next/link";
import gsap from "gsap";

const STEPS = [
  {
    num: "01",
    title: "Seeds start floating",
    body: "The seeds hang in the air for one absurd second, like the page forgot gravity on purpose.",
    color: "#ff5c71",
  },
  {
    num: "02",
    title: "Wind gets rude",
    body: "A cartoon gust clears the stage and throws the seeds out like tiny black commas.",
    color: "#e0f2dc",
  },
  {
    num: "03",
    title: "Melon lands",
    body: "A fresh melon drops from above, squashes on impact, and resets the story into the next storefront beat.",
    color: "#7fff5e",
  },
];

export function PlantSection() {
  const [active, setActive] = useState(0);
  const barRef = useRef<HTMLDivElement>(null);

  const go = (index: number) => {
    setActive(index);
    gsap.to(barRef.current, {
      height: `${((index + 1) / STEPS.length) * 100}%`,
      duration: 0.45,
      ease: "power3.out",
    });
  };

  return (
    <section
      id="plant-section"
      className="snap-start relative z-10 flex h-screen w-full items-center overflow-hidden"
      style={{ scrollSnapStop: "always" }}
    >
      <span
        className="pointer-events-none absolute bottom-3 right-6 text-[24vw] font-black leading-none text-white/[0.018]"
        style={{ fontFamily: "var(--font-londrina-solid)", letterSpacing: 0 }}
        aria-hidden
      >
        Gust
      </span>

      <div className="relative z-10 grid w-full grid-cols-12 items-center gap-5 px-6 md:px-10">
        <div className="col-span-2 hidden justify-center md:flex">
          <div className="flex flex-col items-center">
            <div className="relative h-56 w-px bg-white/10">
              <div ref={barRef} className="absolute left-0 top-0 w-full bg-[#ff5c71]" style={{ height: "33%" }} />
            </div>
            <div className="mt-4 flex flex-col gap-3">
              {STEPS.map((step, index) => (
                <button
                  key={step.num}
                  onClick={() => go(index)}
                  className={`font-mono text-xs transition-colors ${active === index ? "text-[#ff5c71]" : "text-white/24 hover:text-white/58"}`}
                >
                  {step.num}
                </button>
              ))}
            </div>
          </div>
        </div>

        <div className="col-span-12 md:col-span-5">
          <p className="mb-3 font-mono text-xs uppercase text-[#e0f2dc]/70" style={{ letterSpacing: 0 }}>
            Chapter 04 / Wind drop
          </p>
          <h2
            className="font-black uppercase leading-[0.84] text-white text-[clamp(3rem,7vw,7.5rem)]"
            style={{ fontFamily: "var(--font-londrina-solid)", letterSpacing: 0 }}
          >
            Wind
            <span className="block" style={{ color: STEPS[active].color }}>
              Drop
            </span>
          </h2>
        </div>

        <div className="col-span-12 md:col-span-5">
          <div className="rounded-[8px] border border-white/12 bg-black/58 p-5 backdrop-blur-md">
            <div className="mb-5 grid grid-cols-3 gap-2">
              {["float", "gust", "drop"].map((item, index) => (
                <button
                  key={item}
                  onClick={() => go(index)}
                  className={`relative h-20 overflow-hidden rounded-[8px] border text-left transition-transform hover:-translate-y-0.5 ${
                    active === index ? "border-white/28 bg-white/[0.08]" : "border-white/10 bg-white/[0.03]"
                  }`}
                >
                  <span className="absolute left-3 top-3 h-5 w-3 rotate-12 rounded-[50%] border border-[#ff5c71] bg-black" />
                  <span
                    className="absolute bottom-0 left-0 h-1"
                    style={{ width: `${46 + index * 18}%`, background: STEPS[index].color }}
                  />
                  <span className="absolute bottom-3 left-3 font-mono text-[10px] uppercase text-white/52" style={{ letterSpacing: 0 }}>
                    {item}
                  </span>
                </button>
              ))}
            </div>

            <span className="font-mono text-xs text-white/28">{STEPS[active].num}</span>
            <p className="mt-4 text-4xl font-black uppercase leading-none text-white" style={{ fontFamily: "var(--font-londrina-solid)", letterSpacing: 0 }}>
              {STEPS[active].title}
            </p>
            <p className="mt-4 min-h-24 text-base font-semibold leading-7 text-white/58">
              {STEPS[active].body}
            </p>
            <div className="mt-6 flex flex-wrap gap-3">
              <button
                onClick={() => go((active + 1) % STEPS.length)}
                className="rounded-full border border-white/12 px-5 py-3 text-sm font-bold text-white/72 transition-colors hover:text-white"
              >
                Next beat
              </button>
              <Link
                href="/community"
                className="rounded-full bg-[#ff5c71] px-5 py-3 text-sm font-black text-black transition-colors hover:bg-white"
              >
                Open store
              </Link>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}
