"use client";

import { PrecisionSlider } from "../../../../../../registry/components/precision-slider";

export function PrecisionSliderDemo() {
  return (
    <div className="flex flex-col items-center justify-center w-full min-h-[300px] bg-black p-8 rounded-xl border border-white/10">
      <PrecisionSlider
        min={0}
        max={1000}
        step={5}
        defaultValue={450}
        label="RESONANCE"
        unit="MHZ"
        accentColor="#00f0ff"
      />
    </div>
  );
}
