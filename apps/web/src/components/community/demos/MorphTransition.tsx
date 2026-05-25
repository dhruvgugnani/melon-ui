"use client";

import { useRef, useState } from "react";
import gsap from "gsap";

export function MorphTransition() {
  const overlayRef = useRef<HTMLDivElement>(null);
  const [page, setPage] = useState<"A" | "B">("A");
  const [isRunning, setIsRunning] = useState(false);

  const morph = () => {
    if (isRunning || !overlayRef.current) return;
    setIsRunning(true);

    const tl = gsap.timeline({
      onComplete: () => setIsRunning(false),
    });

    // Grow circle from center
    tl.set(overlayRef.current, { display: "block", scale: 0, opacity: 1 })
      .to(overlayRef.current, {
        scale: 4,
        duration: 0.55,
        ease: "power3.in",
      })
      .call(() => setPage((prev) => (prev === "A" ? "B" : "A")))
      .to(overlayRef.current, {
        scale: 12,
        opacity: 0,
        duration: 0.55,
        ease: "power3.out",
      })
      .set(overlayRef.current, { display: "none", scale: 0, opacity: 1 });
  };

  return (
    <div className="relative w-full max-w-sm overflow-hidden flex flex-col items-center gap-5">
      {/* Demo viewport */}
      <div
        className="relative w-full h-44 overflow-hidden flex items-center justify-center"
        style={{ border: "1px solid #1e1e1e" }}
      >
        {/* Morph overlay */}
        <div
          ref={overlayRef}
          className="absolute w-24 h-24 rounded-full pointer-events-none"
          style={{
            display: "none",
            background: page === "A" ? "#7fff5e" : "#ff5c71",
            transformOrigin: "center center",
          }}
        />

        {/* Content */}
        <div className="text-center z-10">
          <p className="font-mono text-xs uppercase tracking-widest text-[#444] mb-2">Page {page}</p>
          <p
            className="font-black text-4xl"
            style={{
              fontFamily: "var(--font-anton)",
              color: page === "A" ? "#ff5c71" : "#7fff5e",
            }}
          >
            {page === "A" ? "HOME" : "ABOUT"}
          </p>
        </div>
      </div>

      <button
        onClick={morph}
        disabled={isRunning}
        className="px-8 py-3 font-mono text-xs uppercase tracking-widest text-[#f4f4f4] border border-[#ff5c71]/30 hover:border-[#ff5c71] hover:text-[#ff5c71] transition-all disabled:opacity-30"
      >
        {isRunning ? "Morphing..." : "Morph →"}
      </button>
    </div>
  );
}
