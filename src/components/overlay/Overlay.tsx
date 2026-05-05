"use client";

import React from "react";
import { HeroSection } from "./HeroSection";
import { ShowcaseSection } from "./ShowcaseSection";
import { FeaturesSection } from "./FeaturesSection";
import { SandSection } from "./SandSection";
import { PlantSection } from "./PlantSection";
import { SmallMelonSection } from "./SmallMelonSection";
import { CTASection } from "./CTASection";
import { ScrollHud } from "./ScrollHud";

export function Overlay() {
  return (
    <>
      <div
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
