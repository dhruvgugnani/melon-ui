export function SmallMelonSection() {
  return (
    <section
      id="small-melon-section"
      className="snap-start horizontal-section horizontal-section-left relative w-full h-screen z-10 pointer-events-none flex items-center px-6"
      style={{ scrollSnapStop: "always" }}
    >
      <div className="max-w-7xl w-full mx-auto flex flex-col md:flex-row items-center gap-12 md:gap-24">
        <div className="flex-1 space-y-8">
          <h2 className="text-[8vw] md:text-[6vw] leading-none font-black uppercase tracking-tighter">
            <span className="block text-outline-title">Ripen</span>
            <span className="block text-white">Then Pull</span>
          </h2>
          <p className="text-xl text-gray-400 font-medium max-w-md uppercase tracking-wider leading-relaxed">
            The young melon swells, hangs for a beat, then breaks free and travels back into the hero composition.
          </p>
        </div>

        <div className="flex-1 w-full max-w-lg">
          <div className="glass-panel rounded-[2rem] p-8 md:p-10 rotate-[-2deg]">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm font-bold uppercase tracking-[0.35em] text-white/45">Cinematic</p>
                <p className="mt-2 text-3xl font-black uppercase tracking-tight text-white">Pluck + Return</p>
              </div>
              <div className="h-14 w-14 rounded-full border border-white/10 bg-white/5" />
            </div>
            <div className="mt-10 space-y-4">
              <div className="h-3 rounded-full bg-white/10 overflow-hidden">
                <div className="h-full w-[72%] rounded-full bg-accent" />
              </div>
              <div className="h-3 rounded-full bg-white/10 overflow-hidden">
                <div className="h-full w-[48%] rounded-full bg-white/35" />
              </div>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}
