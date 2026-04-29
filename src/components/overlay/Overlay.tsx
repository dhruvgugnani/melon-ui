"use client";
import React from "react";
import { HeroSection } from "./HeroSection";
import { ShowcaseSection } from "./ShowcaseSection";
import { CTASection } from "./CTASection";

export function Overlay() {
  return (
    <div id="snap-container" className="absolute inset-0 h-screen w-full overflow-y-auto overflow-x-hidden snap-y snap-mandatory z-10 no-scrollbar">
      <div id="scroll-content" className="w-full">
        <div className="snap-start h-screen w-full flex flex-col"><HeroSection /></div>
        <div className="snap-start h-screen w-full flex flex-col"><ShowcaseSection /></div>
        <div className="snap-start h-screen w-full flex flex-col"><CTASection /></div>
      </div>
    </div>
  );
}
