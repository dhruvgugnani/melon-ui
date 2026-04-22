import { LedCanvas } from "./led-canvas";
import { HeroContent } from "./hero-content";

export function LedHero() {
  return (
    <section
      id="hero"
      className="relative isolate min-h-screen overflow-hidden bg-[#050505] text-white"
    >
      <LedCanvas />

      <div className="pointer-events-none absolute inset-0 z-[1] bg-[linear-gradient(to_bottom,rgba(5,5,5,0.14),rgba(5,5,5,0.46)_62%,rgba(5,5,5,0.84))]" />
      <div className="pointer-events-none absolute inset-x-0 bottom-0 z-[1] h-32 bg-[linear-gradient(to_top,#050505,rgba(5,5,5,0))]" />

      <HeroContent />
    </section>
  );
}
