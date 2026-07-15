"use client";

import React from "react";
import { TactileIDCard } from "../community/demos/TactileIDCard";

export function SandSection() {
  return (
    <section
      id="sand-section"
      className="snap-start relative z-10 flex h-screen w-full flex-col overflow-hidden bg-transparent"
      style={{ scrollSnapStop: "always" }}
    >
      {/* Header aligned on vertical axis and size-standardized */}
      <div className="flex-none w-full max-w-7xl mx-auto px-6 pt-[12vh] md:px-10 lg:px-16">
        <p className="mb-3 font-mono text-xs uppercase text-[#ff5c71]" style={{ letterSpacing: 0 }}>
          Chapter 03 / Seeds hit code
        </p>
        <h2
          className="font-black uppercase leading-[0.82] text-white text-[clamp(2.5rem,10vw,3.8rem)] md:text-[clamp(3rem,5vw,4.5rem)]"
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
            <div className="relative w-full max-w-[480px] h-[310px]">
              {/* Laptop mockup frame */}
              <div className="absolute left-0 top-0 rounded-xl border border-white/12 bg-[#0a0a0a]/85 shadow-[0_25px_60px_rgba(0,0,0,0.85)] overflow-hidden aspect-video h-[240px] w-[380px] md:h-[280px] md:w-[440px] backdrop-blur-2xl select-none transition-all duration-300 hover:scale-[1.01] hover:border-white/20">
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

                {/* Laptop contents (Renders scaled interactive TactileIDCard) */}
                <div className="relative h-[calc(100%-25px)] w-full overflow-hidden flex items-center justify-center">
                  <div className="absolute inset-0 scale-[0.62] origin-center flex items-center justify-center transform translate-y-[-15px]">
                    <TactileIDCard 
                      style={{ height: "400px", width: "560px", background: "transparent" }}
                      name="DHRUV G."
                      role="CREATIVE DIR"
                      idNumber="M-01992"
                    />
                  </div>
                </div>
              </div>

              {/* Phone mockup frame (overlapping foreground) */}
              <div className="absolute right-0 bottom-0 rounded-2xl border-2 border-white/12 bg-[#0c0c0c]/95 shadow-[0_20px_50px_rgba(0,0,0,0.9)] overflow-hidden h-[270px] w-[130px] md:h-[310px] md:w-[150px] backdrop-blur-2xl select-none transition-all duration-300 hover:scale-[1.03] hover:border-[#ff5c71]/40">
                {/* Phone camera notch */}
                <div className="flex justify-center pt-1.5 pb-1 bg-black/40">
                  <div className="h-1 w-7 rounded-full bg-white/20" />
                </div>

                {/* Phone screen contents (Renders scaled interactive TactileIDCard) */}
                <div className="relative h-[calc(100%-25px)] w-full overflow-hidden flex items-center justify-center">
                  <div className="absolute inset-0 scale-[0.34] origin-center flex items-center justify-center transform translate-y-[-10px]">
                    <TactileIDCard 
                      style={{ height: "760px", width: "380px", background: "transparent" }}
                      name="DHRUV G."
                      role="CREATIVE DIR"
                      idNumber="M-01992"
                    />
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
