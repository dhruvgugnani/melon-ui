"use client";

import React from "react";
import { HeroSection } from "./HeroSection";
import { ShowcaseSection } from "./ShowcaseSection";
import { FeaturesSection } from "./FeaturesSection";
import { SandSection } from "./SandSection";
import { PlantSection } from "./PlantSection";
import { SmallMelonSection } from "./SmallMelonSection";
import { CTASection } from "./CTASection";

export function Overlay() {
  return (
    <div
      id="snap-container"
      className="absolute inset-0 h-screen w-full overflow-y-auto overflow-x-hidden snap-y snap-mandatory overscroll-y-contain z-10 no-scrollbar"
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
  );
}
