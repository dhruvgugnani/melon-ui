"use client";

import React, { useEffect, useRef } from "react";
import gsap from "gsap";
import { Navbar } from "./Navbar";
import { SpotlightSearch } from "../layout/SpotlightSearch";
import { HeroSection } from "./HeroSection";
import { ShowcaseSection } from "./ShowcaseSection";
import { FeaturesSection } from "./FeaturesSection";
import { SandSection } from "./SandSection";
import { PlantSection } from "./PlantSection";
import { SmallMelonSection } from "./SmallMelonSection";
import { CTASection } from "./CTASection";
import { ScrollHud } from "./ScrollHud";

export function Overlay() {
  const containerRef = useRef<HTMLDivElement>(null);
  const currentIndexRef = useRef(0);
  const isAnimatingRef = useRef(false);

  useEffect(() => {
    const container = containerRef.current;
    if (!container) return;

    const totalSections = 7;

    const handleWheel = (e: WheelEvent) => {
      // If we are currently animating, lock the scroll to prevent skipping
      if (isAnimatingRef.current) {
        e.preventDefault();
        return;
      }

      const delta = e.deltaY;
      // Ignore micro-scroll drift
      if (Math.abs(delta) < 20) return;

      let targetIndex = currentIndexRef.current;
      if (delta > 0) {
        targetIndex = Math.min(currentIndexRef.current + 1, totalSections - 1);
      } else {
        targetIndex = Math.max(currentIndexRef.current - 1, 0);
      }

      // If the index changed, animate smoothly to the target section
      if (targetIndex !== currentIndexRef.current) {
        e.preventDefault();
        isAnimatingRef.current = true;
        currentIndexRef.current = targetIndex;

        // Disable scroll snapping during GSAP scroll to prevent jitter
        container.style.scrollSnapType = "none";

        gsap.to(container, {
          scrollTop: targetIndex * window.innerHeight,
          duration: 0.85,
          ease: "power2.out",
          onComplete: () => {
            // Restore native snaps for stability and resizing
            container.style.scrollSnapType = "y mandatory";
            
            // Cooldown to absorb trackpad scroll momentum trail
            setTimeout(() => {
              isAnimatingRef.current = false;
            }, 450);
          }
        });
      }
    };

    // Keep index in sync if user navigates via scrollbar or keys
    const handleScroll = () => {
      if (!isAnimatingRef.current) {
        currentIndexRef.current = Math.round(container.scrollTop / window.innerHeight);
      }
    };

    container.addEventListener("wheel", handleWheel, { passive: false });
    container.addEventListener("scroll", handleScroll, { passive: true });

    return () => {
      container.removeEventListener("wheel", handleWheel);
      container.removeEventListener("scroll", handleScroll);
    };
  }, []);

  return (
    <>
      <Navbar />
      <SpotlightSearch />
      <div
        ref={containerRef}
        id="snap-container"
        className="absolute inset-0 z-10 h-screen w-full snap-y snap-mandatory overflow-y-auto overflow-x-hidden overscroll-y-contain no-scrollbar"
        style={{ scrollSnapType: "y mandatory" }}
      >
        <div id="scroll-content" className="w-full">
          <HeroSection />
          <ShowcaseSection />
          <FeaturesSection />
          <SandSection />
          <PlantSection />
          <SmallMelonSection />
          <CTASection />
        </div>
      </div>
      <ScrollHud />
    </>
  );
}
