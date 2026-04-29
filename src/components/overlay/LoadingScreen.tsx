"use client";

import { useEffect, useState } from "react";
import { useProgress } from "@react-three/drei";
import gsap from "gsap";

export function LoadingScreen() {
  const { progress: actualProgress, active, total } = useProgress();
  const [displayProgress, setDisplayProgress] = useState(0);
  const [mounted, setMounted] = useState(true);

  useEffect(() => {
    const ctx = gsap.context(() => {
      // Create a minimum loading duration for WebGL shader compilation (1.5s)
      // while also waiting for actual WebGL assets to load via useProgress.
      const tracker = { p: 0 };
      
      gsap.to(tracker, {
        p: 100,
        duration: 1.5,
        ease: "power3.inOut",
        onUpdate: () => {
          // Display the slower of the two: actual loading or synthetic minimum
          setDisplayProgress(Math.min(tracker.p, actualProgress === 0 ? tracker.p : actualProgress));
        },
      });
    });

    return () => ctx.revert();
  }, [actualProgress]);

  useEffect(() => {
    // Only dismiss the loading screen if our minimum compilation timeout has passed AND 
    // either actual assets are loaded (100%), or there are no assets to load at all (total === 0).
    const isAssetLoadingComplete = actualProgress === 100 || (!active && total === 0);
    
    if (displayProgress >= 99 && isAssetLoadingComplete) {
      const ctx = gsap.context(() => {
        const tl = gsap.timeline({
          onComplete: () => setMounted(false)
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
          ease: "power4.inOut"
        }, "-=0.2");
      });
      return () => ctx.revert();
    }
  }, [displayProgress, actualProgress, active, total]);

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
            style={{ transform: `scaleX(${displayProgress / 100})`, transformOrigin: "left" }}
          />
        </div>
        
        {/* Progress Text */}
        <p className="absolute -bottom-10 text-sm font-bold tracking-widest text-accent">
          {Math.round(displayProgress)}%
        </p>
      </div>
    </div>
  );
}
