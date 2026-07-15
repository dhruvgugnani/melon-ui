"use client";

import React from "react";

export function SandSection() {
  return (
    <section
      id="sand-section"
      className="snap-start relative z-10 flex h-screen w-full flex-col overflow-hidden bg-transparent"
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

      {/* Bottom Area aligned on vertical axis */}
      <div className="flex-1 w-full max-w-7xl mx-auto px-6 pb-14 md:px-10 lg:px-16 flex items-end">
        <div className="grid grid-cols-12 gap-5 w-full items-center">
          {/* Left Column: Responsiveness Explainer Card */}
          <div className="col-span-12 lg:col-span-5">
            <div className="rounded-xl border border-white/12 bg-[#0c0c0c]/62 p-5 backdrop-blur-2xl transition-all shadow-[inset_0_1px_1px_rgba(255,255,255,0.08),0_12px_40px_rgba(0,0,0,0.7)] hover:border-[#ff5c71]/35 duration-300">
              <div className="mb-4 flex items-center justify-between border-b border-white/8 pb-3">
                <span className="font-mono text-xs uppercase text-white/35" style={{ letterSpacing: 0 }}>
                  Chapter 03 // Fluid layouts
                </span>
                <span className="rounded-full bg-[#ff5c71]/10 border border-[#ff5c71]/22 px-2.5 py-0.5 font-mono text-[9px] uppercase text-[#ff5c71]">
                  Adaptive UX
                </span>
              </div>
              
              <h3 className="text-lg font-bold text-white mb-2">Designed for Every Screen</h3>
              <p className="text-xs text-white/64 leading-relaxed mb-4">
                Every MelonUI component is engineered with absolute fluid responsiveness, transitioning seamlessly from ultra-wide layouts down to compact mobile viewports without losing character.
              </p>
              
              <ul className="space-y-2 font-mono text-[10px] text-white/54">
                <li className="flex items-center gap-2">
                  <span className="text-[#ff5c71]">✓</span> Container Queries for local parent independence
                </li>
                <li className="flex items-center gap-2">
                  <span className="text-[#ff5c71]">✓</span> Auto-collapsing spring-animated mobile menus
                </li>
                <li className="flex items-center gap-2">
                  <span className="text-[#ff5c71]">✓</span> Sub-pixel scale interpolation via CSS calculations
                </li>
              </ul>
            </div>
          </div>

          {/* Right Column: Premium CSS Device Mockups (Laptop + Phone) */}
          <div className="col-span-12 lg:col-span-7 flex items-center justify-center p-4">
            <div className="relative w-full max-w-[440px] h-[270px]">
              {/* Laptop mockup frame */}
              <div className="absolute left-0 top-0 rounded-xl border border-white/12 bg-[#0a0a0a]/80 shadow-[0_25px_60px_rgba(0,0,0,0.85)] overflow-hidden aspect-video h-[200px] w-[320px] md:h-[230px] md:w-[370px] backdrop-blur-2xl select-none transition-all duration-300 hover:scale-[1.01] hover:border-white/20">
                {/* Top browser tab header */}
                <div className="flex items-center justify-between bg-black/40 border-b border-white/8 px-3 py-1.5">
                  <div className="flex gap-1.5">
                    <span className="h-1.5 w-1.5 rounded-full bg-[#ff5c71]" />
                    <span className="h-1.5 w-1.5 rounded-full bg-[#ffc338]" />
                    <span className="h-1.5 w-1.5 rounded-full bg-[#7fff5e]" />
                  </div>
                  <div className="h-2.5 w-32 rounded bg-white/[0.04] flex items-center justify-center text-[6px] font-mono text-white/32">
                    melonui.dev/components
                  </div>
                  <span className="h-1.5 w-1.5 rounded-full bg-white/20" />
                </div>

                {/* Laptop contents */}
                <div className="p-3 font-sans h-[calc(100%-25px)] flex flex-col justify-between">
                  {/* Navbar desktop */}
                  <div className="flex items-center justify-between border-b border-white/5 pb-2">
                    <span className="text-[10px] font-black text-white uppercase animate-pulse" style={{ fontFamily: "var(--font-londrina-solid)" }}>
                      Melon<span className="text-[#ff5c71]">UI</span>
                    </span>
                    <div className="flex gap-3 text-[8px] font-medium text-white/45">
                      <span className="text-[#7fff5e] font-bold">Docs</span>
                      <span>Showcase</span>
                      <span>Blog</span>
                    </div>
                    <span className="rounded bg-[#ff5c71] px-1.5 py-0.5 text-[6px] font-bold text-white uppercase">
                      Get Started
                    </span>
                  </div>

                  {/* Dashboard stats row (3 cards) */}
                  <div className="grid grid-cols-3 gap-2 mt-2">
                    {[
                      { title: "Active", val: "94.2%", col: "text-[#7fff5e]" },
                      { title: "Latency", val: "14ms", col: "text-white" },
                      { title: "Load", val: "2.1k/s", col: "text-[#ff5c71]" }
                    ].map((stat) => (
                      <div key={stat.title} className="rounded border border-white/5 bg-white/[0.02] p-1.5">
                        <p className="text-[6px] uppercase tracking-wider text-white/32">{stat.title}</p>
                        <p className={`text-[10px] font-black mt-0.5 ${stat.col}`}>{stat.val}</p>
                      </div>
                    ))}
                  </div>

                  {/* Desktop sparkline */}
                  <div className="mt-auto h-8 w-full border-t border-white/5 pt-1.5 flex items-end">
                    <svg className="w-full h-full" viewBox="0 0 300 30" preserveAspectRatio="none">
                      <path d="M0,25 Q40,10 80,18 T160,8 T240,15 T300,5" fill="none" stroke="#ff5c71" strokeWidth="1.5" strokeLinecap="round" />
                      <path d="M0,25 Q40,10 80,18 T160,8 T240,15 T300,5 L300,30 L0,30 Z" fill="rgba(255,92,113,0.05)" />
                    </svg>
                  </div>
                </div>
              </div>

              {/* Phone mockup frame (overlapping foreground) */}
              <div className="absolute right-0 bottom-0 rounded-2xl border-2 border-white/12 bg-[#0c0c0c]/92 shadow-[0_20px_50px_rgba(0,0,0,0.9)] overflow-hidden h-[230px] w-[110px] md:h-[260px] md:w-[125px] backdrop-blur-2xl select-none transition-all duration-300 hover:scale-[1.03] hover:border-[#ff5c71]/40">
                {/* Phone camera notch */}
                <div className="flex justify-center pt-1.5 pb-1 bg-black/40">
                  <div className="h-1 w-7 rounded-full bg-white/20" />
                </div>

                {/* Phone screen contents */}
                <div className="p-2.5 font-sans h-[calc(100%-25px)] flex flex-col justify-between">
                  {/* Navbar mobile */}
                  <div className="flex items-center justify-between border-b border-white/5 pb-2">
                    <span className="text-[10px] font-black text-white uppercase" style={{ fontFamily: "var(--font-londrina-solid)" }}>
                      M<span className="text-[#ff5c71]">UI</span>
                    </span>
                    <div className="flex flex-col gap-0.5 w-3 justify-center items-end">
                      <span className="h-0.5 w-full bg-[#ff5c71] rounded-full animate-pulse" />
                      <span className="h-0.5 w-2/3 bg-white rounded-full" />
                      <span className="h-0.5 w-full bg-[#ff5c71] rounded-full" />
                    </div>
                  </div>

                  {/* Stacked dashboard rows (mobile scale) */}
                  <div className="flex flex-col gap-1.5 mt-2">
                    {[
                      { title: "Active", val: "94.2%", col: "text-[#7fff5e]" },
                      { title: "Latency", val: "14ms", col: "text-white" },
                    ].map((stat) => (
                      <div key={stat.title} className="rounded border border-white/5 bg-white/[0.02] p-1.5 flex items-center justify-between">
                        <span className="text-[6px] uppercase tracking-wider text-white/32">{stat.title}</span>
                        <span className={`text-[8px] font-black ${stat.col}`}>{stat.val}</span>
                      </div>
                    ))}
                  </div>

                  {/* Mobile sparkline */}
                  <div className="h-7 mt-2 border-t border-white/5 pt-1 flex items-end">
                    <svg className="w-full h-full" viewBox="0 0 100 20" preserveAspectRatio="none">
                      <path d="M0,15 Q20,5 40,10 T80,5 T100,12" fill="none" stroke="#7fff5e" strokeWidth="1" strokeLinecap="round" />
                    </svg>
                  </div>

                  {/* Phone navigation buttons */}
                  <div className="mt-auto border-t border-white/5 pt-2 flex justify-between px-1 text-[8px] text-white/22">
                    <span className="text-[#ff5c71] font-bold">●</span>
                    <span>■</span>
                    <span>▲</span>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}
