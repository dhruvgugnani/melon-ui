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
      {/* Header */}
      <div className="flex-none w-full max-w-7xl mx-auto px-6 pt-[10vh] md:px-10 lg:px-16">
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

      {/* Body */}
      <div className="flex-1 w-full max-w-7xl mx-auto px-6 pb-10 md:px-10 lg:px-16 flex items-end">
        <div className="grid grid-cols-12 gap-6 w-full items-end">

          {/* Left: Explainer */}
          <div className="col-span-12 lg:col-span-4">
            <div className="rounded-xl border border-white/12 bg-[#0c0c0c]/62 p-5 backdrop-blur-2xl shadow-[inset_0_1px_1px_rgba(255,255,255,0.08),0_12px_40px_rgba(0,0,0,0.7)] hover:border-[#ff5c71]/35 transition-colors duration-300">
              <div className="mb-4 flex items-center justify-between border-b border-white/8 pb-3">
                <span className="font-mono text-[9px] uppercase text-white/35" style={{ letterSpacing: 0 }}>
                  Chapter 03 // Fluid layouts
                </span>
                <span className="rounded-full bg-[#ff5c71]/10 border border-[#ff5c71]/22 px-2.5 py-0.5 font-mono text-[9px] uppercase text-[#ff5c71]">
                  Adaptive UX
                </span>
              </div>
              <h3 className="text-base font-bold text-white mb-2">Designed for Every Screen</h3>
              <p className="text-[11px] text-white/60 leading-relaxed mb-4">
                Every MelonUI component transitions seamlessly from ultra-wide layouts down to compact mobile viewports without losing character.
              </p>
              <ul className="space-y-2 font-mono text-[10px] text-white/50">
                <li className="flex items-center gap-2">
                  <span className="text-[#ff5c71]">✓</span> Container Queries for local parent independence
                </li>
                <li className="flex items-center gap-2">
                  <span className="text-[#ff5c71]">✓</span> Auto-collapsing spring-animated mobile menus
                </li>
                <li className="flex items-center gap-2">
                  <span className="text-[#ff5c71]">✓</span> Sub-pixel scale interpolation via CSS
                </li>
              </ul>
            </div>
          </div>

          {/* Right: Device Mockups */}
          <div className="col-span-12 lg:col-span-8 flex items-end justify-center">
            <div className="relative w-full" style={{ height: "340px" }}>

              {/* ─── LAPTOP / BROWSER MOCKUP ─── */}
              <div
                className="absolute left-0 bottom-0 overflow-hidden select-none transition-all duration-500 hover:scale-[1.01]"
                style={{
                  width: "500px",
                  height: "320px",
                  borderRadius: "10px",
                  border: "1.5px solid rgba(255,255,255,0.14)",
                  background: "linear-gradient(160deg, #161616 0%, #0d0d0d 100%)",
                  boxShadow: "0 32px 80px rgba(0,0,0,0.92), 0 0 0 1px rgba(255,255,255,0.04), inset 0 1px 0 rgba(255,255,255,0.06)",
                }}
              >
                {/* macOS Title bar */}
                <div
                  className="flex items-center gap-0 border-b"
                  style={{
                    background: "linear-gradient(180deg, #232323 0%, #1c1c1c 100%)",
                    borderColor: "rgba(255,255,255,0.07)",
                    height: "30px",
                    padding: "0 12px",
                  }}
                >
                  {/* Traffic lights */}
                  <div className="flex items-center gap-[5px] mr-4">
                    <div className="h-[10px] w-[10px] rounded-full" style={{ background: "#ff5f57", boxShadow: "0 0 4px rgba(255,95,87,0.6)" }} />
                    <div className="h-[10px] w-[10px] rounded-full" style={{ background: "#ffbd2e", boxShadow: "0 0 4px rgba(255,189,46,0.6)" }} />
                    <div className="h-[10px] w-[10px] rounded-full" style={{ background: "#27c840", boxShadow: "0 0 4px rgba(39,200,64,0.6)" }} />
                  </div>

                  {/* Window title */}
                  <div className="flex-1 flex items-center justify-center">
                    <span className="font-mono text-[9px] text-white/28" style={{ letterSpacing: "0.05em" }}>
                      melonui.dev — Components
                    </span>
                  </div>

                  {/* Window controls placeholder */}
                  <div className="flex gap-1 items-center opacity-30">
                    <div className="h-[6px] w-[14px] rounded-[2px] border border-white/30" />
                    <div className="h-[6px] w-[6px] rounded-[1px] border border-white/30" />
                  </div>
                </div>

                {/* Tab bar */}
                <div
                  className="flex items-end border-b"
                  style={{
                    background: "#1a1a1a",
                    borderColor: "rgba(255,255,255,0.06)",
                    height: "26px",
                    padding: "0 8px",
                    gap: "2px",
                  }}
                >
                  {/* Active tab */}
                  <div
                    className="flex items-center gap-1.5 px-3 rounded-t-md"
                    style={{
                      height: "22px",
                      background: "#111",
                      border: "1px solid rgba(255,255,255,0.1)",
                      borderBottom: "1px solid #111",
                      minWidth: "120px",
                    }}
                  >
                    <div className="h-2 w-2 rounded-full" style={{ background: "#ff5c71" }} />
                    <span className="font-mono text-[8px] text-white/50" style={{ whiteSpace: "nowrap" }}>Components — MelonUI</span>
                    <span className="ml-auto font-mono text-[8px] text-white/20 leading-none">×</span>
                  </div>
                  {/* Inactive tab */}
                  <div
                    className="flex items-center gap-1.5 px-3 rounded-t-md"
                    style={{
                      height: "20px",
                      background: "transparent",
                      minWidth: "80px",
                    }}
                  >
                    <span className="font-mono text-[8px] text-white/22">Docs</span>
                  </div>
                  {/* New tab */}
                  <div className="ml-1 flex items-center justify-center w-5 h-5 rounded text-white/25 font-mono text-xs">+</div>
                </div>

                {/* Address bar */}
                <div
                  className="flex items-center gap-2 border-b"
                  style={{
                    background: "#111",
                    borderColor: "rgba(255,255,255,0.05)",
                    height: "26px",
                    padding: "0 10px",
                  }}
                >
                  {/* Nav arrows */}
                  <div className="flex gap-1.5 items-center opacity-40">
                    <span className="font-mono text-[8px] text-white/60 leading-none">‹</span>
                    <span className="font-mono text-[8px] text-white/30 leading-none">›</span>
                    <span className="font-mono text-[8px] text-white/30 leading-none">↺</span>
                  </div>

                  {/* URL bar */}
                  <div
                    className="flex-1 flex items-center gap-1.5 rounded px-2"
                    style={{
                      height: "16px",
                      background: "rgba(255,255,255,0.04)",
                      border: "1px solid rgba(255,255,255,0.08)",
                    }}
                  >
                    <span className="text-[7px] text-[#7fff5e] opacity-70">🔒</span>
                    <span className="font-mono text-[7px] text-white/40">melonui.dev</span>
                    <span className="font-mono text-[7px] text-white/20">/components/tactile-id-card</span>
                  </div>

                  {/* Bookmark star */}
                  <span className="font-mono text-[8px] text-white/20 opacity-50">☆</span>
                </div>

                {/* Bookmarks bar */}
                <div
                  className="flex items-center gap-3 border-b"
                  style={{
                    background: "#0f0f0f",
                    borderColor: "rgba(255,255,255,0.04)",
                    height: "20px",
                    padding: "0 10px",
                  }}
                >
                  {["Docs", "Showcase", "Pricing", "GitHub"].map((item) => (
                    <span key={item} className="font-mono text-[7px] text-white/22 hover:text-white/40 cursor-pointer transition-colors">{item}</span>
                  ))}
                </div>

                {/* Page content — MelonUI Nav + TactileIDCard */}
                <div
                  className="relative overflow-hidden"
                  style={{ height: "calc(100% - 102px)", background: "#0a0a0a" }}
                >
                  {/* In-page MelonUI Navbar */}
                  <div
                    className="flex items-center justify-between border-b"
                    style={{
                      height: "32px",
                      padding: "0 16px",
                      background: "rgba(0,0,0,0.6)",
                      borderColor: "rgba(255,255,255,0.05)",
                      backdropFilter: "blur(12px)",
                    }}
                  >
                    <span className="font-black text-[10px] text-white uppercase" style={{ fontFamily: "var(--font-londrina-solid)", letterSpacing: "0.02em" }}>
                      Melon<span style={{ color: "#ff5c71" }}>UI</span>
                    </span>
                    <div className="flex items-center gap-4">
                      {["Components", "Docs", "Showcase"].map((n) => (
                        <span key={n} className="font-mono text-[7px] uppercase text-white/40" style={{ letterSpacing: "0.05em" }}>{n}</span>
                      ))}
                    </div>
                    <div
                      className="flex items-center gap-1 px-2 rounded"
                      style={{
                        height: "16px",
                        background: "#ff5c71",
                        border: "none",
                      }}
                    >
                      <span className="font-mono text-[7px] font-black text-black uppercase">Get Started</span>
                    </div>
                  </div>

                  {/* TactileIDCard — centered and scaled */}
                  <div
                    className="flex items-center justify-center overflow-hidden"
                    style={{ height: "calc(100% - 32px)", width: "100%" }}
                  >
                    <div style={{ transform: "scale(0.5)", transformOrigin: "center center", width: "260px", height: "360px" }}>
                      <TactileIDCard
                        style={{ width: "260px", height: "360px", background: "transparent" }}
                        name="DHRUV G."
                        role="CREATIVE DIR"
                        idNumber="M-01992"
                      />
                    </div>
                  </div>
                </div>
              </div>

              {/* ─── PHONE / iOS MOCKUP ─── */}
              <div
                className="absolute right-0 bottom-0 overflow-hidden select-none transition-all duration-500 hover:scale-[1.02]"
                style={{
                  width: "158px",
                  height: "320px",
                  borderRadius: "36px",
                  border: "2px solid rgba(255,255,255,0.16)",
                  background: "linear-gradient(160deg, #191919 0%, #111111 100%)",
                  boxShadow: "0 28px 70px rgba(0,0,0,0.95), 0 0 0 1px rgba(255,255,255,0.04), inset 0 1px 0 rgba(255,255,255,0.08), 4px 4px 20px rgba(255,92,113,0.08)",
                  zIndex: 10,
                }}
              >
                {/* Side buttons (physical) */}
                <div
                  className="absolute"
                  style={{
                    left: "-4px",
                    top: "72px",
                    width: "3px",
                    height: "26px",
                    background: "rgba(255,255,255,0.12)",
                    borderRadius: "2px 0 0 2px",
                  }}
                />
                <div
                  className="absolute"
                  style={{
                    left: "-4px",
                    top: "104px",
                    width: "3px",
                    height: "42px",
                    background: "rgba(255,255,255,0.12)",
                    borderRadius: "2px 0 0 2px",
                  }}
                />
                <div
                  className="absolute"
                  style={{
                    right: "-4px",
                    top: "80px",
                    width: "3px",
                    height: "56px",
                    background: "rgba(255,255,255,0.12)",
                    borderRadius: "0 2px 2px 0",
                  }}
                />

                {/* Screen inner rounded container */}
                <div
                  className="absolute inset-[3px] overflow-hidden flex flex-col"
                  style={{ borderRadius: "34px", background: "#0a0a0a" }}
                >
                  {/* Status bar */}
                  <div
                    className="flex items-center justify-between flex-none"
                    style={{ height: "30px", padding: "0 16px", paddingTop: "8px" }}
                  >
                    <span className="font-mono text-[7px] font-bold text-white/70">11:07</span>
                    <div
                      className="rounded-full"
                      style={{
                        width: "56px",
                        height: "14px",
                        background: "rgba(0,0,0,0.9)",
                        border: "1.5px solid rgba(255,255,255,0.1)",
                      }}
                    />
                    <div className="flex items-center gap-1">
                      <span className="font-mono text-[7px] text-white/50">●●●</span>
                      <span className="font-mono text-[7px] text-white/30">▲</span>
                      <div
                        className="rounded-[2px] flex items-center"
                        style={{
                          width: "18px",
                          height: "8px",
                          border: "1px solid rgba(255,255,255,0.25)",
                          padding: "0 1px",
                        }}
                      >
                        <div
                          className="rounded-[1px]"
                          style={{ width: "70%", height: "5px", background: "#7fff5e" }}
                        />
                      </div>
                    </div>
                  </div>

                  {/* In-app MelonUI Nav */}
                  <div
                    className="flex items-center justify-between border-b flex-none"
                    style={{
                      height: "32px",
                      padding: "0 12px",
                      borderColor: "rgba(255,255,255,0.05)",
                      background: "rgba(0,0,0,0.4)",
                    }}
                  >
                    <span className="font-black text-[9px] text-white uppercase" style={{ fontFamily: "var(--font-londrina-solid)" }}>
                      M<span style={{ color: "#ff5c71" }}>UI</span>
                    </span>
                    {/* Hamburger */}
                    <div className="flex flex-col gap-[3px]">
                      <div className="h-[1.5px] w-[14px] rounded" style={{ background: "rgba(255,255,255,0.4)" }} />
                      <div className="h-[1.5px] w-[10px] rounded" style={{ background: "rgba(255,255,255,0.3)" }} />
                      <div className="h-[1.5px] w-[14px] rounded" style={{ background: "rgba(255,255,255,0.4)" }} />
                    </div>
                  </div>

                  {/* TactileIDCard centered */}
                  <div
                    className="flex-1 flex items-center justify-center overflow-hidden"
                    style={{ position: "relative" }}
                  >
                    <div style={{ transform: "scale(0.42)", transformOrigin: "center center", width: "260px", height: "360px" }}>
                      <TactileIDCard
                        style={{ width: "260px", height: "360px", background: "transparent" }}
                        name="DHRUV G."
                        role="CREATIVE DIR"
                        idNumber="M-01992"
                        primaryColor="#7fff5e"
                        accentColor="#ff5c71"
                      />
                    </div>
                  </div>

                  {/* Home indicator */}
                  <div className="flex justify-center pb-2 flex-none">
                    <div
                      className="rounded-full"
                      style={{ width: "40px", height: "3px", background: "rgba(255,255,255,0.35)" }}
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
