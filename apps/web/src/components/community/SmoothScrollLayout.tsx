"use client";

import { useEffect, useRef } from "react";
import Lenis from "lenis";

export function SmoothScrollLayout({ children }: { children: React.ReactNode }) {
  const wrapperRef = useRef<HTMLDivElement>(null);
  const contentRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    if (!wrapperRef.current || !contentRef.current) return;

    const lenis = new Lenis({
      wrapper: wrapperRef.current,
      content: contentRef.current,
      lerp: 0.1,
      wheelMultiplier: 1,
    });

    let rafId: number;
    function raf(time: number) {
      lenis.raf(time);
      rafId = requestAnimationFrame(raf);
    }

    rafId = requestAnimationFrame(raf);

    return () => {
      lenis.destroy();
      cancelAnimationFrame(rafId);
    };
  }, []);

  return (
    <div
      ref={wrapperRef}
      data-lenis-wrapper
      className="h-screen w-full overflow-y-auto bg-[#050505]"
    >
      <div ref={contentRef} className="min-h-full">
        {children}
      </div>
    </div>
  );
}
