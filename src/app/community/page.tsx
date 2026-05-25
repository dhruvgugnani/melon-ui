"use client";

import React from "react";
import Link from "next/link";
import { getComponentsByCategory } from "@/data/components";
import { ComponentShowcase } from "@/components/community/ComponentShowcase";
import dynamic from "next/dynamic";

// Dynamically import all components
// eslint-disable-next-line @typescript-eslint/no-explicit-any
const componentsMap: Record<string, React.ComponentType<any>> = {
  CliTerminal: dynamic(() => import("@/components/community/demos/CliTerminal").then(m => m.CliTerminal)),
  ChangelogCard: dynamic(() => import("@/components/community/demos/ChangelogCard").then(m => m.ChangelogCard)),
  SeedBurstButton: dynamic(() => import("@/components/community/demos/SeedBurstButton").then(m => m.SeedBurstButton)),
  RippleButton: dynamic(() => import("@/components/community/demos/RippleButton").then(m => m.RippleButton)),
  MagneticNav: dynamic(() => import("@/components/community/demos/MagneticNav").then(m => m.MagneticNav)),
  BreadcrumbTrail: dynamic(() => import("@/components/community/demos/BreadcrumbTrail").then(m => m.BreadcrumbTrail)),
  HoloTicket: dynamic(() => import("@/components/community/demos/HoloTicket").then(m => m.HoloTicket)),
  RindPeelCard: dynamic(() => import("@/components/community/demos/RindPeelCard").then(m => m.RindPeelCard)),
  FlipCard: dynamic(() => import("@/components/community/demos/FlipCard").then(m => m.FlipCard)),
  VineInput: dynamic(() => import("@/components/community/demos/VineInput").then(m => m.VineInput)),
  TagInput: dynamic(() => import("@/components/community/demos/TagInput").then(m => m.TagInput)),
  ParticleBackground: dynamic(() => import("@/components/community/demos/ParticleBackground").then(m => m.ParticleBackground), { ssr: false, loading: () => <div className="w-full h-[360px] bg-[#060606] flex items-center justify-center"><span className="font-mono text-[#333] text-sm">Loading 3D...</span></div> }),
  FloatingOrbs: dynamic(() => import("@/components/community/demos/FloatingOrbs").then(m => m.FloatingOrbs), { ssr: false, loading: () => <div className="w-full h-[360px] bg-[#060606] flex items-center justify-center"><span className="font-mono text-[#333] text-sm">Loading 3D...</span></div> }),
  JuicyCursor: dynamic(() => import("@/components/community/demos/JuicyCursor").then(m => m.JuicyCursor)),
  CrosshairCursor: dynamic(() => import("@/components/community/demos/CrosshairCursor").then(m => m.CrosshairCursor)),
  HarvestReveal: dynamic(() => import("@/components/community/demos/HarvestReveal").then(m => m.HarvestReveal)),
  ParallaxStrips: dynamic(() => import("@/components/community/demos/ParallaxStrips").then(m => m.ParallaxStrips)),
  MelonDripText: dynamic(() => import("@/components/community/demos/MelonDripText").then(m => m.MelonDripText)),
  ScrambleText: dynamic(() => import("@/components/community/demos/ScrambleText").then(m => m.ScrambleText)),
  RindWipeTransition: dynamic(() => import("@/components/community/demos/RindWipeTransition").then(m => m.RindWipeTransition)),
  MorphTransition: dynamic(() => import("@/components/community/demos/MorphTransition").then(m => m.MorphTransition)),
};

function SectionLabel({ id, label, count }: { id: string; label: string; count: string }) {
  return (
    <div id={id} className="scroll-mt-4 pt-20 mb-14 border-t border-[#ff5c71]/8 flex items-baseline gap-4">
      <span className="font-mono text-[10px] text-[#333] uppercase tracking-[0.3em]">{count}</span>
      <h2 className="text-5xl md:text-7xl font-black uppercase tracking-tighter text-[#f4f4f4] leading-none"
        style={{ fontFamily: "var(--font-londrina-solid)" }}>
        {label}
      </h2>
    </div>
  );
}

export default function CommunityPage() {
  const categories = getComponentsByCategory();
  const categoryOrder = [
    { name: "Getting Started", id: "getting-started" },
    { name: "Buttons", id: "buttons" },
    { name: "Navigations", id: "navigations" },
    { name: "Cards", id: "cards" },
    { name: "Inputs", id: "inputs" },
    { name: "3D Backgrounds", id: "backgrounds" },
    { name: "Cursors", id: "cursors" },
    { name: "Scroll Effects", id: "scroll-effects" },
    { name: "GSAP Text", id: "gsap-text" },
    { name: "Page Transitions", id: "gsap-transit" }
  ];

  return (
    <main className="min-h-screen bg-[#050505] selection:bg-[#ff5c71] selection:text-[#050505] px-6 md:px-10 lg:px-14 pb-32">

      {/* ── Hero ── */}
      <header className="pt-14 pb-20 max-w-4xl">
        <div className="flex items-center gap-3 mb-6">
          <span className="font-mono text-[10px] text-[#333] uppercase tracking-[0.25em]">MelonUI</span>
          <span className="h-px w-8 bg-[#1a1a1a]" />
          <span className="font-mono text-[10px] text-[#ff5c71] uppercase tracking-[0.25em]">Community Store</span>
        </div>
        <h1 className="text-6xl md:text-9xl font-black uppercase leading-[0.85] tracking-tighter text-[#f4f4f4] mb-8"
          style={{ fontFamily: "var(--font-londrina-solid)" }}>
          Build<br />
          <span className="text-[#ff5c71]">Different</span>
          <span className="text-[#7fff5e]">.</span>
        </h1>
        <p className="font-mono text-[#555] text-sm max-w-xl leading-relaxed">
          Hand-crafted, GSAP-powered, Three.js-infused components.
          Copy. Paste. Ship. No accounts. No subscriptions.
        </p>
        <div className="flex items-center gap-4 mt-10">
          <button className="px-6 py-3 bg-[#ff5c71] text-[#050505] font-black uppercase tracking-widest text-sm"
            style={{ fontFamily: "var(--font-anton)" }}>
            Submit Component
          </button>
          <Link href="/" className="font-mono text-xs text-[#333] hover:text-[#f4f4f4] transition-colors uppercase tracking-widest">
            ← Home
          </Link>
        </div>
      </header>

      {/* ── DYNAMIC CATEGORIES ── */}
      {categoryOrder.map((cat, index) => {
        const catComponents = categories[cat.name];
        if (!catComponents) return null;

        return (
          <section key={cat.id} aria-labelledby={cat.id}>
            <SectionLabel id={cat.id} label={cat.name} count={`0${index}`} />
            {catComponents.map(comp => {
              const ComponentToRender = componentsMap[comp.componentPath];
              return (
                <ComponentShowcase
                  key={comp.id}
                  title={comp.title}
                  description={comp.description}
                  tags={comp.tags}
                  cliCommand={comp.cliCommand}
                  codeSnippet={comp.codeSnippet}
                  scrollable={comp.scrollable}
                  slug={comp.slug}
                  component={ComponentToRender ? <ComponentToRender /> : <div>Loading...</div>}
                />
              );
            })}
          </section>
        );
      })}

    </main>
  );
}
