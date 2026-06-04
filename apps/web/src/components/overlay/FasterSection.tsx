"use client";

import { useEffect, useRef, useState } from "react";
import { useRouter } from "next/navigation";
import gsap from "gsap";
import { SeedBurstButton } from "../community/demos/SeedBurstButton";
import { InfinityMirrorCard } from "../community/demos/InfinityMirrorCard";
import { MagneticNav } from "../community/demos/MagneticNav";
import { JuicySwitch } from "../community/demos/JuicySwitch";
import { RindPeelCard } from "../community/demos/RindPeelCard";

const DROPS = [
  { name: "Seed Burst", type: "particles / canvas", href: "/components/burst-button", color: "#ff5c71", id: "burst" },
  { name: "Infinity Mirror", type: "3d depth illusion", href: "/components/infinity-mirror-card", color: "#7fff5e", id: "mirror" },
  { name: "Magnet Dock", type: "gsap magnetic", href: "/components/magnetic-nav", color: "#e0f2dc", id: "dock" },
  { name: "Juicy Switch", type: "squash & stretch", href: "/components/juicy-switch", color: "#ff8d9a", id: "switch" },
  { name: "Rind Peel", type: "clip-path peel", href: "/components/peel-card", color: "#7fff5e", id: "peel" },
] as const;

function RealPreview({ id }: { id: string }) {
  if (id === "burst") {
    return (
      <div className="relative flex items-center justify-center p-8 scale-110">
        <SeedBurstButton 
          buttonClassName="rounded-full px-8 py-3 text-sm font-bold active:scale-95 transition-all" 
          buttonStyle={{ fontFamily: "var(--font-londrina-solid)" }}
        />
      </div>
    );
  }
  if (id === "mirror") {
    return (
      <div className="relative flex items-center justify-center p-2 scale-90">
        <InfinityMirrorCard title="MELON" subtitle="3D_PORTAL" layers={5} />
      </div>
    );
  }
  if (id === "dock") {
    return (
      <div className="flex items-center justify-center p-8 scale-100">
        <MagneticNav />
      </div>
    );
  }
  if (id === "switch") {
    return (
      <div className="flex items-center justify-center p-8 scale-[1.3] md:scale-[1.4]">
        <JuicySwitch />
      </div>
    );
  }
  return (
    <div className="relative flex items-center justify-center p-6 w-[280px] h-[340px]">
      <RindPeelCard width="100%" height="100%" />
    </div>
  );
}

export function FasterSection() {
  const router = useRouter();
  const titleRef = useRef<HTMLHeadingElement>(null);
  const menuRef = useRef<HTMLDivElement>(null);
  const previewRef = useRef<HTMLDivElement>(null);
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

  // Smooth transition when active component changes
  useEffect(() => {
    if (!previewRef.current) return;
    gsap.fromTo(
      previewRef.current,
      { scale: 0.95, opacity: 0.7 },
      { scale: 1, opacity: 1, duration: 0.45, ease: "power2.out" }
    );
  }, [activeIdx]);

  const activeDrop = DROPS[activeIdx];

  return (
    <section
      className="snap-start relative h-screen w-full overflow-hidden z-10 bg-[#050505]"
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
          className="absolute right-[20%] top-[25%] h-[500px] w-[500px] rounded-full blur-[140px] pointer-events-none transition-all duration-700 ease-out"
          style={{
            backgroundColor: `${activeDrop.color}15`
          }}
        />
      </div>

      <div className="relative z-10 grid h-full grid-cols-12 gap-6 px-6 pb-16 pt-28 md:px-10 lg:px-16 items-center">
        {/* Left Column: Heading and Brutalist List */}
        <div className="col-span-12 lg:col-span-5 flex flex-col justify-center select-none h-full">
          <div>
            <p className="mb-2 font-mono text-[10px] uppercase tracking-[0.2em] text-[#e0f2dc]/40">
              Chapter 02 / Component Lab
            </p>
            <h2
              ref={titleRef}
              className="font-black uppercase leading-[0.76] text-white text-[clamp(2.5rem,6vw,5.5rem)] mb-10"
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
                      isActive ? "text-[#7fff5e] font-bold" : "text-white/20 group-hover:text-white/40"
                    }`}
                  >
                    0{index + 1}
                  </span>
                  <span
                    className={`text-2.5xl md:text-3.5xl lg:text-4.5xl font-black uppercase transition-all duration-300 tracking-tight
                      ${isActive ? "text-white scale-105 translate-x-3" : "text-white/25 group-hover:text-white/50"}
                    `}
                    style={{ fontFamily: "var(--font-londrina-solid)" }}
                  >
                    {drop.name}
                  </span>
                  <span
                    className={`font-mono text-[9px] uppercase tracking-widest transition-opacity duration-300 ${
                      isActive ? "opacity-50 text-[#ff5c71]" : "opacity-0"
                    }`}
                  >
                    {"// "}{drop.type}
                  </span>
                </button>
              );
            })}
          </div>
        </div>

        {/* Right Column: Floating Preview Canvas (completely container-less) */}
        <div className="col-span-12 lg:col-span-7 flex items-center justify-center relative min-h-[380px] lg:h-[500px] z-20">
          <div
            ref={previewRef}
            className="w-full flex items-center justify-center select-none"
          >
            <RealPreview id={activeDrop.id} />
          </div>
        </div>
      </div>
    </section>
  );
}
