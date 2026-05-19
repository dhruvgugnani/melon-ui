"use client";

import { useEffect, useRef } from "react";
import { getScrollProgress } from "@/components/scene/engine";

const CHAPTERS = [
  "crate",
  "slice",
  "drops",
  "code",
  "wind",
  "access",
  "ship",
];

export function ScrollHud() {
  const progressTextRef = useRef<HTMLSpanElement>(null);
  const chapterTextRef = useRef<HTMLSpanElement>(null);
  const barRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    let progressFrameId: number | null = null;
    let lastProgress = -1;

    const updateProgress = () => {
      progressFrameId = null;

      const scroller = document.getElementById("snap-container");
      const content = document.getElementById("scroll-content");

      if (!scroller || !content) {
        return;
      }

      const progress = Math.round(getScrollProgress(scroller, content) * 1000) / 10;

      if (Math.abs(progress - lastProgress) < 0.1) {
        return;
      }

      lastProgress = progress;

      if (progressTextRef.current) {
        progressTextRef.current.textContent = `${progress.toFixed(1)}%`;
      }

      if (chapterTextRef.current) {
        const chapterIndex = Math.min(CHAPTERS.length - 1, Math.floor((progress / 100) * CHAPTERS.length));
        chapterTextRef.current.textContent = CHAPTERS[chapterIndex];
      }

      if (barRef.current) {
        barRef.current.style.scale = `${progress / 100} 1`;
      }
    };

    const scheduleProgress = () => {
      if (progressFrameId !== null) {
        return;
      }

      progressFrameId = window.requestAnimationFrame(updateProgress);
    };

    const scroller = document.getElementById("snap-container");
    scheduleProgress();
    scroller?.addEventListener("scroll", scheduleProgress, { passive: true });
    window.addEventListener("resize", scheduleProgress, { passive: true });

    return () => {
      if (progressFrameId !== null) {
        window.cancelAnimationFrame(progressFrameId);
      }

      scroller?.removeEventListener("scroll", scheduleProgress);
      window.removeEventListener("resize", scheduleProgress);
    };
  }, []);

  return (
    <div
      className="pointer-events-none fixed inset-x-6 bottom-5 z-40 md:inset-x-10"
      aria-hidden="true"
    >
      <div className="mb-2 flex items-end gap-3 text-xs font-bold uppercase text-white/58" style={{ letterSpacing: 0 }}>
        <span ref={progressTextRef}>0.0%</span>
        <span className="text-white/22">/</span>
        <span ref={chapterTextRef}>crate</span>
      </div>
      <div className="h-[3px] w-full overflow-hidden rounded-full bg-white/12">
        <div
          ref={barRef}
          className="h-full origin-left rounded-full bg-[#ff5c71] shadow-[0_0_18px_rgba(255,92,113,0.5)]"
          style={{ scale: "0 1" }}
        />
      </div>
    </div>
  );
}
