"use client";

import { useRef, useState } from "react";
import gsap from "gsap";

export function RindWipeTransition() {
  const wipeRef = useRef<HTMLDivElement>(null);
  const [isRunning, setIsRunning] = useState(false);

  const runWipe = () => {
    if (isRunning || !wipeRef.current) return;
    setIsRunning(true);

    const tl = gsap.timeline({
      onComplete: () => setIsRunning(false),
    });

    // Sweep in
    tl.set(wipeRef.current, { x: "-100%", display: "flex" })
      .to(wipeRef.current, {
        x: "0%",
        duration: 0.55,
        ease: "power3.inOut",
      })
      // Hold
      .to(wipeRef.current, {
        x: "100%",
        duration: 0.55,
        ease: "power3.inOut",
        delay: 0.3,
      })
      .set(wipeRef.current, { display: "none" });
  };

  return (
    <div className="relative w-full flex flex-col items-center gap-6 overflow-hidden">
      {/* Demo viewport */}
      <div className="relative w-full max-w-sm h-40 bg-[#0a0a0a] overflow-hidden flex items-center justify-center" style={{ border: "1px solid #1e1e1e" }}>
        <p className="font-mono text-[#555] text-sm">Page Content Here</p>

        {/* Wipe element */}
        <div
          ref={wipeRef}
          className="absolute inset-0 z-10 flex-col items-center justify-center"
          style={{ display: "none", background: "linear-gradient(90deg, #7fff5e 0%, #4dc43f 50%, #7fff5e 100%)" }}
        >
          <span
            className="text-[#050505] font-black text-2xl uppercase"
            style={{ fontFamily: "var(--font-anton)" }}
          >
            🍉 MelonUI
          </span>
        </div>

        {/* Rind stripe overlay decoration */}
        <div className="absolute top-0 inset-x-0 h-1.5 bg-[#1a1a1a]" />
        <div className="absolute bottom-0 inset-x-0 h-1.5 bg-[#1a1a1a]" />
      </div>

      <button
        onClick={runWipe}
        disabled={isRunning}
        className="px-8 py-3 bg-[#ff5c71] text-[#050505] font-black uppercase tracking-widest text-sm disabled:opacity-50 transition-opacity"
        style={{ fontFamily: "var(--font-anton)" }}
      >
        {isRunning ? "Wiping..." : "Trigger Wipe ->"}
      </button>

      <p className="font-mono text-xs text-[#444]">Click to simulate a route transition</p>
    </div>
  );
}
