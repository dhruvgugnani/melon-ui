"use client";

import { useEffect, useRef } from "react";
import Link from "next/link";
import gsap from "gsap";

const DROPS = [
  { name: "Seed Burst", type: "press / particles", access: "Free", href: "/community#buttons", color: "#ff5c71", preview: "burst" },
  { name: "Rind Peel", type: "hover card", access: "Free", href: "/community#cards", color: "#e0f2dc", preview: "peel" },
  { name: "Magnet Dock", type: "sticky nav", access: "Free", href: "/community#navigations", color: "#7fff5e", preview: "dock" },
  { name: "Pulp Field", type: "WebGL-ish bg", access: "Pro later", href: "/community#backgrounds", color: "#ff8d9a", preview: "field" },
] as const;

type PreviewKind = (typeof DROPS)[number]["preview"];

function SeedDots({ color }: { color: string }) {
  return (
    <span className="pointer-events-none absolute inset-0" aria-hidden>
      {Array.from({ length: 14 }).map((_, index) => (
        <span
          key={index}
          className="absolute h-2.5 w-1.5 rounded-[50%] border border-white/18 bg-black"
          style={{
            left: `${18 + ((index * 17) % 66)}%`,
            top: `${16 + ((index * 29) % 62)}%`,
            borderColor: index % 3 === 0 ? color : "rgba(255,255,255,0.18)",
            transform: `rotate(${-34 + index * 19}deg)`,
          }}
        />
      ))}
    </span>
  );
}

function Preview({ kind, color }: { kind: PreviewKind; color: string }) {
  if (kind === "burst") {
    return (
      <div className="relative flex h-24 items-center justify-center overflow-hidden rounded-[8px] border border-white/10 bg-[#060606] md:h-36">
        <SeedDots color={color} />
        <button className="relative z-10 min-w-28 overflow-hidden rounded-full px-4 py-2 text-xs font-black uppercase text-black md:min-w-36 md:px-6 md:py-3 md:text-sm" style={{ background: color }}>
          Pop Seed
          <span className="absolute inset-x-4 bottom-1 h-1 rounded-full bg-[#7fff5e]" />
        </button>
      </div>
    );
  }

  if (kind === "peel") {
    return (
      <div className="relative h-24 overflow-hidden rounded-[8px] border border-white/10 bg-[#7fff5e] p-3 md:h-36 md:p-4">
        <div className="absolute inset-x-0 top-0 h-[64%] origin-top skew-y-[-4deg] bg-[#090909] shadow-[0_18px_40px_rgba(0,0,0,0.45)] transition-transform duration-500 group-hover:-translate-y-8">
          <div className="absolute bottom-0 left-0 right-0 h-2 bg-[#ff5c71]" />
        </div>
        <div className="relative z-10 flex h-full flex-col justify-end">
          <p className="font-mono text-[10px] uppercase text-black/55" style={{ letterSpacing: 0 }}>revealed state</p>
          <p className="text-2xl font-black uppercase leading-none text-black md:text-3xl" style={{ fontFamily: "var(--font-londrina-solid)", letterSpacing: 0 }}>
            Fresh Card
          </p>
        </div>
      </div>
    );
  }

  if (kind === "dock") {
    return (
      <div className="flex h-24 items-center justify-center rounded-[8px] border border-white/10 bg-[#060606] md:h-36">
        <div className="flex items-center gap-1 rounded-full border border-white/12 bg-white/[0.04] p-1.5 md:gap-2 md:p-2">
          {["home", "drops", "lab", "ship"].map((item, index) => (
            <span
              key={item}
              className="rounded-full px-2 py-1.5 text-[10px] font-black uppercase text-white transition-transform group-hover:-translate-y-1 md:px-3 md:py-2 md:text-xs"
              style={{
                background: index === 1 ? color : "rgba(255,255,255,0.06)",
                color: index === 1 ? "#050505" : "rgba(255,255,255,0.72)",
                transitionDelay: `${index * 35}ms`,
              }}
            >
              {item}
            </span>
          ))}
        </div>
      </div>
    );
  }

  return (
    <div className="relative h-24 overflow-hidden rounded-[8px] border border-white/10 bg-[#050505] md:h-36">
      {Array.from({ length: 24 }).map((_, index) => (
        <span
          key={index}
          className="absolute rounded-full"
          style={{
            width: `${6 + (index % 5) * 3}px`,
            height: `${6 + (index % 5) * 3}px`,
            left: `${(index * 37) % 96}%`,
            top: `${(index * 53) % 90}%`,
            background: index % 4 === 0 ? color : index % 2 === 0 ? "#7fff5e" : "#ffffff",
            opacity: 0.18 + (index % 5) * 0.08,
            boxShadow: `0 0 24px ${index % 4 === 0 ? color : "#7fff5e"}`,
          }}
        />
      ))}
      <div className="absolute inset-x-5 bottom-5 flex items-center justify-between">
        <span className="font-mono text-[10px] uppercase text-white/42" style={{ letterSpacing: 0 }}>particle bg</span>
        <span className="h-8 w-8 rounded-full border border-white/15" style={{ background: color }} />
      </div>
    </div>
  );
}

export function ShowcaseSection() {
  const titleRef = useRef<HTMLHeadingElement>(null);
  const cardsRef = useRef<(HTMLAnchorElement | null)[]>([]);

  useEffect(() => {
    const ctx = gsap.context(() => {
      gsap.from(titleRef.current?.children ?? [], { y: 48, opacity: 0, duration: 0.65, stagger: 0.08, ease: "power3.out" });
      cardsRef.current.forEach((card, index) => {
        if (!card) return;
        gsap.from(card, {
          y: index % 2 === 0 ? 30 : -30,
          rotate: index % 2 === 0 ? -2 : 2,
          opacity: 0,
          duration: 0.55,
          delay: index * 0.06,
          ease: "power2.out",
        });
      });
    });

    return () => ctx.revert();
  }, []);

  return (
    <section
      id="showcase-section"
      className="snap-start relative z-10 flex h-screen w-full items-center overflow-hidden"
      style={{ scrollSnapStop: "always" }}
    >
      <span
        className="pointer-events-none absolute -right-8 top-10 text-[18vw] font-black uppercase leading-none text-white/[0.025]"
        style={{ fontFamily: "var(--font-londrina-solid)", letterSpacing: 0 }}
        aria-hidden
      >
        Cut
      </span>

      <div className="grid w-full grid-cols-12 gap-5 px-6 md:px-10">
        <div className="col-span-12 self-center lg:col-span-4">
          <p className="mb-3 font-mono text-xs uppercase text-[#ff5c71]" style={{ letterSpacing: 0 }}>
            Chapter 01 / Seeds open the crate
          </p>
          <h2
            ref={titleRef}
            className="font-black uppercase leading-[0.82] text-white text-[clamp(2.7rem,14vw,4.4rem)] md:text-[clamp(3.2rem,7vw,7.2rem)]"
            style={{ fontFamily: "var(--font-londrina-solid)", letterSpacing: 0 }}
          >
            <span className="block">Live</span>
            <span className="block text-[#ff5c71]">Drop</span>
            <span className="block">Shelf</span>
          </h2>
        </div>

        <div className="col-span-12 grid grid-cols-2 gap-2 md:gap-3 lg:col-span-8">
          {DROPS.map((drop, index) => (
            <Link
              key={drop.name}
              ref={(element) => { cardsRef.current[index] = element; }}
              href={drop.href}
              className={`group relative min-h-[11.5rem] overflow-hidden rounded-[8px] border border-white/10 bg-black/54 p-3 backdrop-blur-md transition-transform hover:-translate-y-1 md:min-h-64 md:p-4 ${index > 1 ? "hidden md:block" : ""}`}
            >
              <Preview kind={drop.preview} color={drop.color} />
              <div className="mt-4 flex items-end justify-between gap-3">
                <div>
                  <p className="text-xl font-black uppercase leading-none text-white md:text-3xl" style={{ fontFamily: "var(--font-londrina-solid)", letterSpacing: 0 }}>
                    {drop.name}
                  </p>
                  <p className="mt-1 font-mono text-xs uppercase text-white/35" style={{ letterSpacing: 0 }}>
                    {drop.type}
                  </p>
                </div>
                <span className="rounded-full border border-white/12 px-2 py-1 text-[10px] font-bold text-white/62 md:px-3 md:text-xs">
                  {drop.access}
                </span>
              </div>
            </Link>
          ))}
        </div>
      </div>
    </section>
  );
}
