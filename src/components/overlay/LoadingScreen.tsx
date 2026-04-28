"use client";

import { useEffect, useState } from "react";
import gsap from "gsap";

export function LoadingScreen() {
  const [progress, setProgress] = useState(0);
  const [mounted, setMounted] = useState(true);

  useEffect(() => {
    // Synthetic loading progress since our 3D melon is a procedural shader
    // and doesn't trigger external network requests!
    // This gives WebGL shaders and CSS masks time to compile before revealing.
    const ctx = gsap.context(() => {
      const tracker = { p: 0 };
      
      gsap.to(tracker, {
        p: 100,
        duration: 1.5, // 1.5 seconds cinematic load
        ease: "power3.inOut",
        onUpdate: () => {
          setProgress(tracker.p);
        },
        onComplete: () => {
          const tl = gsap.timeline({
            onComplete: () => setMounted(false)
          });
          
          tl.to(".loading-content", {
            opacity: 0,
            y: -30,
            duration: 0.6,
            ease: "power3.inOut",
            delay: 0.2 // Brief pause at 100%
          })
          .to(".loading-screen", {
            yPercent: -100,
            duration: 1.2,
            ease: "power4.inOut"
          }, "-=0.2");
        }
      });
    });

    return () => ctx.revert();
  }, []);

  if (!mounted) return null;

  return (
    <div className="loading-screen fixed inset-0 z-[10000] bg-black flex flex-col items-center justify-center pointer-events-auto">
      <div className="loading-content relative flex flex-col items-center text-center">
        {/* Simple animated brand mark */}
        <h1 className="text-4xl md:text-6xl font-black uppercase tracking-tighter text-white mb-10">
          <span className="block text-outline" data-text="Melon">Melon</span>
          <span className="block">UI Store</span>
        </h1>
        
        {/* Progress Bar Container */}
        <div className="w-64 md:w-96 h-1 bg-white/10 rounded-full overflow-hidden">
          <div 
            className="h-full bg-accent transition-none"
            style={{ width: `${progress}%` }}
          />
        </div>
        
        {/* Progress Text */}
        <p className="absolute -bottom-10 text-sm font-bold tracking-widest text-accent">
          {Math.round(progress)}%
        </p>
      </div>
    </div>
  );
}
