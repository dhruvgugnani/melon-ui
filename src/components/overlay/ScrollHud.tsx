"use client";

import { useEffect, useRef } from "react";
import { getScrollProgress } from "@/components/scene/engine";

export function ScrollHud() {
  const progressTextRef = useRef<HTMLSpanElement>(null);
  const fpsTextRef = useRef<HTMLSpanElement>(null);
  const barRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    let fpsFrameId = 0;
    let progressFrameId: number | null = null;
    let lastFpsSample = performance.now();
    let frameCount = 0;
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

      if (barRef.current) {
        barRef.current.style.transform = `scaleX(${progress / 100})`;
      }
    };

    const scheduleProgress = () => {
      if (progressFrameId !== null) {
        return;
      }

      progressFrameId = window.requestAnimationFrame(updateProgress);
    };

    const tickFps = (now: number) => {
      frameCount += 1;

      if (now - lastFpsSample >= 500) {
        const fps = Math.round((frameCount * 1000) / Math.max(now - lastFpsSample, 1));
        frameCount = 0;
        lastFpsSample = now;

        if (fpsTextRef.current) {
          fpsTextRef.current.textContent = `${fps} FPS`;
        }
      }

      fpsFrameId = window.requestAnimationFrame(tickFps);
    };

    const scroller = document.getElementById("snap-container");
    scheduleProgress();
    scroller?.addEventListener("scroll", scheduleProgress, { passive: true });
    window.addEventListener("resize", scheduleProgress, { passive: true });
    fpsFrameId = window.requestAnimationFrame(tickFps);

    return () => {
      window.cancelAnimationFrame(fpsFrameId);
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
      <div className="mb-2 flex items-end justify-between font-bold uppercase tracking-[0.28em] text-white/58">
        <span ref={progressTextRef} className="text-[10px] md:text-xs">0.0%</span>
        <span ref={fpsTextRef} className="text-[10px] md:text-xs">60 FPS</span>
      </div>
      <div className="h-[3px] w-full overflow-hidden rounded-full bg-white/12">
        <div
          ref={barRef}
          className="h-full origin-left scale-x-0 rounded-full bg-white shadow-[0_0_18px_rgba(255,92,113,0.5)]"
        />
      </div>
    </div>
  );
}
