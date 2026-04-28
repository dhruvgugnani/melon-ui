"use client";

import { HeroSection } from "./HeroSection";
import { ShowcaseSection } from "./ShowcaseSection";
import { CTASection } from "./CTASection";

export function Overlay() {
  return (
    <div className="relative w-full">
      <HeroSection />
      <ShowcaseSection />
      <CTASection />
    </div>
  );
}
