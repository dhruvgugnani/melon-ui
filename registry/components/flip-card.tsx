"use client";

import { useRef } from "react";
import gsap from "gsap";

export function FlipCard() {
  const cardRef = useRef<HTMLDivElement>(null);
  const isFlipped = useRef(false);

  const flip = () => {
    if (!cardRef.current) return;
    const target = isFlipped.current ? 0 : 180;
    isFlipped.current = !isFlipped.current;
    gsap.to(cardRef.current, {
      rotationY: target,
      duration: 0.7,
      ease: "power3.inOut",
    });
  };

  return (
    <div
      className="cursor-pointer"
      style={{ perspective: "1000px", width: 260, height: 180 }}
      onClick={flip}
    >
      <div
        ref={cardRef}
        style={{
          width: "100%",
          height: "100%",
          transformStyle: "preserve-3d",
          position: "relative",
        }}
      >
        {/* Front */}
        <div
          style={{ backfaceVisibility: "hidden" }}
          className="absolute inset-0 bg-[#0d0d0d] border border-[#1e1e1e] flex flex-col justify-between p-5"
        >
          <span className="font-mono text-[10px] text-[#444] uppercase tracking-widest">
            Component / Card
          </span>
          <div>
            <p className="font-black text-2xl uppercase text-[#f4f4f4]" style={{ fontFamily: "var(--font-anton)" }}>
              Flip Card
            </p>
            <p className="font-mono text-xs text-[#555] mt-1">Click to reveal -></p>
          </div>
          <div className="w-full h-px bg-[#ff5c71]/20" />
        </div>

        {/* Back */}
        <div
          style={{ backfaceVisibility: "hidden", transform: "rotateY(180deg)" }}
          className="absolute inset-0 bg-[#ff5c71] flex flex-col justify-center items-center gap-3"
        >
          <span className="text-4xl">🍉</span>
          <p className="font-black text-xl uppercase text-[#050505]" style={{ fontFamily: "var(--font-anton)" }}>
            Surprise!
          </p>
          <p className="font-mono text-xs text-[#050505]/60">Click again to flip back</p>
        </div>
      </div>
    </div>
  );
}
