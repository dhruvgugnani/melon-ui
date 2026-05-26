"use client";

import React, { useRef } from "react";
import Link from "next/link";
import { ClientHomeScene } from "@/components/scene/ClientHomeScene";
import gsap from "gsap";
import { useGSAP } from "@gsap/react";

const GITHUB_URL = "https://github.com/dhruvgugnani/melon-ui";

export default function Home() {
  const containerRef = useRef<HTMLDivElement>(null);

  // Staggered GSAP reveal for home page content
  useGSAP(() => {
    const tl = gsap.timeline();

    tl.from(".home-reveal-fast", {
      opacity: 0,
      y: 30,
      stagger: 0.08,
      duration: 0.6,
      ease: "power2.out",
    });

    tl.from(".home-reveal-slow", {
      opacity: 0,
      y: 20,
      stagger: 0.05,
      duration: 0.5,
      ease: "power2.out",
    }, "-=0.35");
  }, { scope: containerRef });

  return (
    <main ref={containerRef} className="relative min-h-screen w-full overflow-x-hidden bg-[#050505] text-white select-none">
      
      {/* Cyber Grid & Glowing Ambient Backdrop */}
      <div className="store-backdrop-container">
        <div className="store-bg-grid" />
        <div className="store-glow-blob store-glow-pink" />
        <div className="store-glow-blob store-glow-green" />
      </div>

      {/* Brand Navigation Header */}
      <header className="absolute left-0 right-0 top-0 z-20 flex items-center justify-between px-6 py-6 md:px-10">
        <Link href="/" className="flex items-center gap-3 group" aria-label="MelonUI home">
          <span className="relative h-9 w-9 overflow-hidden rounded-full border border-white/15 bg-[#ff5c71] shrink-0 group-hover:scale-105 transition-transform duration-300">
            <span className="absolute inset-x-1 bottom-1 h-5 rounded-b-full bg-[#203f18]" />
            <span className="absolute inset-x-2 bottom-2 h-3 rounded-b-full bg-[#e0f2dc]" />
            <span className="absolute inset-x-3 bottom-3 h-2 rounded-b-full bg-[#ff5c71]" />
            <span className="absolute bottom-3 left-1/2 h-1 w-1 -translate-x-1/2 rounded-full bg-black" />
          </span>
          <span className="text-xl font-black uppercase text-white group-hover:text-[#ff5c71] transition-colors" style={{ fontFamily: "var(--font-londrina-solid)", letterSpacing: 0 }}>
            MelonUI
          </span>
        </Link>

        <div className="flex items-center gap-2.5 text-xs font-bold relative z-30">
          <a
            href={GITHUB_URL}
            target="_blank"
            rel="noreferrer"
            className="rounded-sm border border-white/12 bg-black/35 px-4.5 py-2 font-mono text-[10px] uppercase tracking-widest text-white/70 backdrop-blur-md transition-colors hover:text-white hover:border-white/20 cursor-pointer active:scale-95 transition-transform"
          >
            GitHub
          </a>
          <Link
            href="/community"
            className="rounded-sm bg-[#ff5c71] px-4.5 py-2 font-mono text-[10px] uppercase tracking-widest text-[#050505] font-black hover:bg-white hover:text-black transition-all cursor-pointer active:scale-95 transition-transform"
          >
            Store
          </Link>
        </div>
      </header>

      {/* Main Content Layout */}
      <div className="relative z-10 grid grid-cols-12 min-h-screen w-full items-center px-6 md:px-10 lg:px-16 pt-24 pb-12 gap-8">
        
        {/* Left Column: Copy & Actions */}
        <div className="col-span-12 lg:col-span-7 flex flex-col justify-center space-y-6">
          <div className="inline-flex items-center gap-2 px-3 py-1.5 bg-[#ff5c71]/10 border border-[#ff5c71]/20 rounded-sm w-fit home-reveal-fast">
            <span className="w-1.5 h-1.5 rounded-full bg-[#7fff5e] animate-pulse" />
            <span className="font-mono text-[10px] text-[#ff5c71] uppercase tracking-[0.2em]">Fresh Component Laboratory</span>
          </div>

          <h1 className="text-7xl sm:text-8xl md:text-9xl font-black uppercase leading-[0.8] tracking-tighter text-white home-reveal-fast" style={{ fontFamily: "var(--font-londrina-solid)" }}>
            Slice<br />
            The<br />
            <span className="text-[#ff5c71]">Web</span>
            <span className="text-[#7fff5e]">.</span>
          </h1>

          <p className="font-mono text-zinc-400 text-sm md:text-base max-w-xl leading-relaxed home-reveal-slow">
            A premium, futuristic 3D component laboratory for fresh, internet-native user interface pieces. Copy, paste, and ship beautifully animated components powered by GSAP & WebGL.
          </p>

          <div className="flex flex-wrap items-center gap-4 pt-4 home-reveal-slow">
            <Link 
              href="/community" 
              className="px-8 py-4 bg-[#ff5c71] text-[#050505] font-black uppercase tracking-widest text-sm cursor-pointer hover:scale-105 active:scale-95 transition-all duration-200 shadow-lg shadow-[#ff5c71]/20 rounded-sm" 
              style={{ fontFamily: "var(--font-anton)" }}
            >
              Explore Store
            </Link>
            <a 
              href={GITHUB_URL} 
              target="_blank" 
              rel="noreferrer" 
              className="px-8 py-4 bg-transparent text-white border border-white/15 hover:border-white font-black uppercase tracking-widest text-sm cursor-pointer hover:scale-105 active:scale-95 transition-all duration-200 rounded-sm" 
              style={{ fontFamily: "var(--font-anton)" }}
            >
              GitHub Repo
            </a>
            <Link 
              href="/preview" 
              className="px-6 py-4 bg-transparent text-zinc-500 hover:text-white font-mono text-[10px] uppercase tracking-widest cursor-pointer hover:underline"
            >
              View Story Mode →
            </Link>
          </div>
        </div>
        
        {/* Right Column: Standalone 3D Interactive Melon */}
        <div className="col-span-12 lg:col-span-5 h-[400px] lg:h-[600px] w-full relative flex items-center justify-center">
          <div className="absolute inset-0 z-0 pointer-events-auto">
            <ClientHomeScene />
          </div>
          
          {/* Mouse drag instruction indicator */}
          <div className="absolute bottom-4 font-mono text-[9px] uppercase tracking-widest text-zinc-500 pointer-events-none select-none flex items-center gap-1.5">
            <svg width="10" height="10" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5">
              <path d="M15 18l-6-6 6-6" />
            </svg>
            Drag to rotate Melon
            <svg width="10" height="10" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5">
              <path d="M9 18l6-6-6-6" />
            </svg>
          </div>
        </div>

      </div>
    </main>
  );
}
