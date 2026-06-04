"use client";

import { useEffect, useRef, useState } from "react";
import { useRouter } from "next/navigation";
import gsap from "gsap";
import { SeedBurstButton } from "../community/demos/SeedBurstButton";
import { InfinityMirrorCard } from "../community/demos/InfinityMirrorCard";
import { HoloTicket } from "../community/demos/HoloTicket";
import { MagneticNav } from "../community/demos/MagneticNav";

const DROPS = [
  { name: "Seed Burst", type: "particles / canvas", href: "/components/burst-button", color: "#ff5c71", id: "burst" },
  { name: "Infinity Mirror", type: "3d depth illusion", href: "/components/infinity-mirror-card", color: "#7fff5e", id: "mirror" },
  { name: "Holo Ticket", type: "shimmer & 3d tilt", href: "/components/holo-ticket", color: "#ff5c71", id: "ticket" },
  { name: "Magnet Dock", type: "gsap magnetic icon", href: "/components/magnetic-nav", color: "#e0f2dc", id: "dock" },
] as const;

function RealPreview({ id }: { id: string }) {
  if (id === "burst") {
    return (
      <div className="relative flex items-center justify-center p-8 scale-100 sm:scale-110">
        <SeedBurstButton 
          label="Melon UI"
          buttonColor="#ff5c71"
          buttonTextColor="#050505"
          stripeColor="#7fff5e"
          buttonClassName="rounded-full px-8 py-3 text-sm font-bold active:scale-95 transition-all" 
          buttonStyle={{ fontFamily: "var(--font-londrina-solid)" }}
        />
      </div>
    );
  }
  if (id === "mirror") {
    return (
      <div className="relative flex items-center justify-center p-2 scale-80 sm:scale-90">
        <InfinityMirrorCard title="MELON UI" subtitle="NEXT_GEN_SYSTEM" layers={6} />
      </div>
    );
  }
  if (id === "ticket") {
    return (
      <div className="relative flex items-center justify-center p-2 scale-[0.7] sm:scale-[0.8] md:scale-90 xl:scale-95">
        <HoloTicket 
          topTitle={<>Melon<br/>UI</>}
          topSubtitle="PREMIUM CORE"
          bottomText="Unlock Access"
        />
      </div>
    );
  }
  return (
    <div className="flex items-center justify-center p-8 scale-90 sm:scale-100">
      <MagneticNav 
        items={["Melon", "UI", "Docs", "Store"]}
        accentColor="#ff5c71"
        dotColor="#7fff5e"
      />
    </div>
  );
}

export function FasterSection() {
  const router = useRouter();
  const titleRef = useRef<HTMLHeadingElement>(null);
  const menuRef = useRef<HTMLDivElement>(null);
  const previewRef = useRef<HTMLDivElement>(null);
  const contentRef = useRef<HTMLDivElement>(null);
  const [activeIdx, setActiveIdx] = useState<number>(0);

  // Entrance animations using GSAP
  useEffect(() => {
    const ctx = gsap.context(() => {
      const tl = gsap.timeline({ defaults: { ease: "power3.out" } });
      tl.fromTo(
        titleRef.current?.children ?? [],
        { y: 50, opacity: 0 },
        { y: 0, opacity: 1, duration: 0.8, stagger: 0.1 }
      ).fromTo(
        menuRef.current?.children ?? [],
        { x: -30, opacity: 0 },
        { x: 0, opacity: 1, duration: 0.7, stagger: 0.08, ease: "power2.out" },
        "-=0.4"
      ).fromTo(
        previewRef.current,
        { scale: 0.9, opacity: 0 },
        { scale: 1, opacity: 1, duration: 0.8, ease: "back.out(1.2)" },
        "-=0.5"
      );
    });

    return () => ctx.revert();
  }, []);

  // Smooth transition when active component changes (only content inside glass animates, glass stays static)
  useEffect(() => {
    if (!contentRef.current) return;
    gsap.fromTo(
      contentRef.current,
      { scale: 0.95, opacity: 0 },
      { scale: 1, opacity: 1, duration: 0.35, ease: "power2.out" }
    );
  }, [activeIdx]);

  const activeDrop = DROPS[activeIdx];

  return (
    <section
      className="snap-start relative min-h-screen lg:h-screen w-full overflow-hidden z-10 bg-transparent flex items-center"
      style={{ scrollSnapStop: "always" }}
    >
      {/* Cyber Grid Background */}
      <div className="absolute inset-0 pointer-events-none z-0" aria-hidden>
        <div 
          className="absolute inset-0 opacity-10"
          style={{
            backgroundImage: `
              linear-gradient(rgba(255,255,255,0.01) 1px, transparent 1px),
              linear-gradient(90deg, rgba(255,255,255,0.01) 1px, transparent 1px)
            `,
            backgroundSize: "32px 32px"
          }}
        />
        {/* Soft active glow behind the component */}
        <div 
          className="absolute right-[25%] top-[25%] h-[500px] w-[500px] rounded-full blur-[140px] pointer-events-none transition-all duration-700 ease-out animate-pulse"
          style={{
            backgroundColor: `${activeDrop.color}10`
          }}
        />
      </div>

      <div className="relative z-10 flex flex-col lg:grid lg:grid-cols-12 gap-8 lg:gap-6 w-full max-w-7xl mx-auto px-6 py-20 md:px-10 lg:px-16 items-center">
        {/* Left Column: Heading and Brutalist List */}
        <div className="col-span-12 lg:col-span-5 flex flex-col justify-center select-none w-full">
          <div>
            <p className="mb-3 font-mono text-xs uppercase tracking-[0.25em] text-[#e0f2dc]/60">
              Chapter 02 / Component Lab
            </p>
            <h2
              ref={titleRef}
              className="font-black uppercase leading-[0.76] text-white text-[clamp(2.5rem,6vw,5.5rem)] mb-8 lg:mb-10"
              style={{ fontFamily: "var(--font-londrina-solid)", letterSpacing: 0 }}
            >
              <span className="block">Build</span>
              <span className="block text-[#ff5c71] translate-x-4">
                Faster<span className="text-[#7fff5e]">.</span>
              </span>
            </h2>
          </div>

          {/* Staggered text list without boxed containers */}
          <div ref={menuRef} className="flex flex-col gap-5 pt-2">
            {DROPS.map((drop, index) => {
              const isActive = activeIdx === index;
              return (
                <button
                  key={drop.name}
                  onMouseEnter={() => setActiveIdx(index)}
                  onClick={() => router.push(drop.href)}
                  className="flex items-center gap-6 group text-left outline-none cursor-pointer border-none bg-transparent"
                >
                  <span
                    className={`font-mono text-xs md:text-sm transition-all duration-300 ${
                      isActive ? "text-[#7fff5e] font-bold" : "text-white/35 group-hover:text-white/60"
                    }`}
                  >
                    0{index + 1}
                  </span>
                  <span
                    className={`text-3xl md:text-4xl lg:text-5xl font-black uppercase transition-all duration-300 tracking-tight
                      ${isActive ? "text-white scale-105 translate-x-4" : "text-white/40 group-hover:text-white/75"}
                    `}
                    style={{ fontFamily: "var(--font-londrina-solid)" }}
                  >
                    {drop.name}
                  </span>
                  <span
                    className={`font-mono text-xs uppercase tracking-widest transition-opacity duration-300 ${
                      isActive ? "opacity-90 text-[#ff5c71]/80 font-bold" : "opacity-0"
                    }`}
                  >
                    {"// "}{drop.type}
                  </span>
                </button>
              );
            })}
          </div>
        </div>

        {/* Right Column: Floating Preview Canvas with Frosted Glass Tile */}
        <div className="col-span-12 lg:col-span-7 flex items-center justify-center relative w-full h-[300px] sm:h-[350px] md:h-[400px] lg:h-[480px] z-20">
          <div
            ref={previewRef}
            className="w-full max-w-[480px] h-full rounded-3xl border border-white/8 bg-zinc-950/20 backdrop-blur-md flex items-center justify-center select-none relative shadow-[0_24px_80px_rgba(0,0,0,0.8)] overflow-hidden"
          >
            {/* Ambient color light source */}
            <div 
              className="absolute -right-20 -top-20 h-60 w-60 rounded-full blur-[100px] opacity-20 pointer-events-none transition-all duration-700 ease-out"
              style={{
                backgroundColor: activeDrop.color
              }}
            />
            {/* Real Preview element (wrapped inside animated contentRef) */}
            <div ref={contentRef} className="relative z-10 w-full h-full flex items-center justify-center">
              <RealPreview id={activeDrop.id} />
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}
