"use client";

import { useRef } from "react";
import gsap from "gsap";

export function RippleButton() {
  const rippleContainer = useRef<HTMLSpanElement>(null);

  const handleClick = (e: React.MouseEvent<HTMLButtonElement>) => {
    const btn = e.currentTarget;
    const rect = btn.getBoundingClientRect();
    const size = Math.max(rect.width, rect.height) * 2;
    const x = e.clientX - rect.left - size / 2;
    const y = e.clientY - rect.top - size / 2;

    const ripple = document.createElement("span");
    ripple.style.cssText = `
      position: absolute;
      width: ${size}px;
      height: ${size}px;
      left: ${x}px;
      top: ${y}px;
      border-radius: 50%;
      background: rgba(127, 255, 94, 0.25);
      pointer-events: none;
    `;
    rippleContainer.current?.appendChild(ripple);

    gsap.fromTo(
      ripple,
      { scale: 0, opacity: 1 },
      {
        scale: 1,
        opacity: 0,
        duration: 0.7,
        ease: "power2.out",
        onComplete: () => ripple.remove(),
      }
    );
  };

  return (
    <button
      onClick={handleClick}
      className="relative overflow-hidden px-10 py-4 bg-transparent border border-[#ff5c71] text-[#ff5c71] font-mono text-sm uppercase tracking-widest hover:text-[#050505] transition-colors group"
    >
      {/* Hover fill */}
      <span className="absolute inset-0 bg-[#ff5c71] translate-y-full group-hover:translate-y-0 transition-transform duration-300 ease-out" />
      <span ref={rippleContainer} className="absolute inset-0 overflow-hidden" />
      <span className="relative z-10">Click for ripple</span>
    </button>
  );
}
