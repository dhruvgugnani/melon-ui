"use client";

import { startTransition, useDeferredValue, useEffect, useState } from "react";
import { useProgress } from "@react-three/drei";
import gsap from "gsap";

const SCENE_READY_EVENT = "melonui:scene-ready";

export function LoadingScreen() {
  const { progress: actualProgress, active, total } = useProgress();
  const [displayProgress, setDisplayProgress] = useState(0);
  const [mounted, setMounted] = useState(true);
  const [sceneReady, setSceneReady] = useState(
    () => typeof document !== "undefined" && document.documentElement.dataset.melonSceneReady === "true",
  );
  const deferredProgress = useDeferredValue(displayProgress);

  useEffect(() => {
    const handleSceneReady = () => setSceneReady(true);

    window.addEventListener(SCENE_READY_EVENT, handleSceneReady, { once: true });
    return () => window.removeEventListener(SCENE_READY_EVENT, handleSceneReady);
  }, []);

  useEffect(() => {
    const ctx = gsap.context(() => {
      const tracker = { p: 0 };
      const progressTarget = sceneReady
        ? (actualProgress === 0 && !active ? 100 : actualProgress)
        : Math.min(actualProgress, 92);

      gsap.to(tracker, {
        p: progressTarget,
        duration: sceneReady ? 0.9 : 1.2,
        ease: "power3.inOut",
        onUpdate: () => {
          startTransition(() => setDisplayProgress(tracker.p));
        },
      });
    });

    return () => ctx.revert();
  }, [actualProgress, active, sceneReady]);

  useEffect(() => {
    const isAssetLoadingComplete = actualProgress === 100 || (!active && total === 0);

    if (displayProgress >= 99 && isAssetLoadingComplete && sceneReady) {
      const ctx = gsap.context(() => {
        const tl = gsap.timeline({
          onComplete: () => {
            startTransition(() => setMounted(false));
          },
        });

        tl.to(".loading-content", {
          opacity: 0,
          y: -30,
          duration: 0.6,
          ease: "power3.inOut",
          delay: 0.2
        })
        .to(".loading-screen", {
          yPercent: -100,
          duration: 1.2,
          ease: "power4.inOut",
        }, "-=0.2");
      });
      return () => ctx.revert();
    }
  }, [displayProgress, actualProgress, active, total, sceneReady]);

  if (!mounted) return null;

  return (
    <div className="loading-screen fixed inset-0 z-[10000] bg-black flex flex-col items-center justify-center pointer-events-auto">
      <div className="loading-content relative flex flex-col items-center text-center">
        {/* Sleek animated brand mark */}
        <h1 className="text-2xl md:text-3xl font-bold uppercase tracking-[0.2em] mb-8 flex gap-2">
          <span className="text-[#5c8a4d]">Melon</span>
          <span className="text-accent">UI</span>
        </h1>
        
        {/* Progress Bar Container */}
        <div className="w-64 md:w-96 h-1 bg-white/10 rounded-full overflow-hidden">
          <div
            className="w-full h-full bg-accent transition-none"
            style={{ transform: `scaleX(${deferredProgress / 100})`, transformOrigin: "left" }}
          />
        </div>

        {/* Progress Text */}
        <p className="absolute -bottom-10 text-sm font-bold tracking-widest text-accent">
          {Math.round(deferredProgress)}%
        </p>
      </div>
    </div>
  );
}
