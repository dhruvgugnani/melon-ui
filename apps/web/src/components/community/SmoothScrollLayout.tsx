"use client";

import { useEffect, useRef, useState } from "react";
import Lenis from "lenis";

export function SmoothScrollLayout({ children }: { children: React.ReactNode }) {
  const wrapperRef = useRef<HTMLDivElement>(null);
  const contentRef = useRef<HTMLDivElement>(null);
  const [scrollY, setScrollY] = useState(0);

  useEffect(() => {
    if (!wrapperRef.current || !contentRef.current) return;

    const lenis = new Lenis({
      wrapper: wrapperRef.current,
      content: contentRef.current,
      lerp: 0.1,
      wheelMultiplier: 1,
    });

    lenis.on("scroll", ({ scroll }: { scroll: number }) => {
      setScrollY(scroll);
    });

    function raf(time: number) {
      lenis.raf(time);
      requestAnimationFrame(raf);
    }

    requestAnimationFrame(raf);

    return () => {
      lenis.destroy();
    };
  }, []);

  return (
    <div
      ref={wrapperRef}
      data-lenis-wrapper
      data-scroll-y={scrollY}
      className="h-screen w-full overflow-y-auto bg-[#050505]"
    >
      <div ref={contentRef} className="min-h-full">
        {children}
      </div>
    </div>
  );
}
