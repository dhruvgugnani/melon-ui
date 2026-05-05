export function SandSection() {
  return (
    <section
      id="sand-section"
      className="snap-start horizontal-section horizontal-section-left relative w-full h-screen flex flex-col justify-center px-6 z-10 pointer-events-none"
      style={{ scrollSnapStop: "always" }}
    >
      <div className="max-w-7xl w-full mx-auto flex flex-col md:flex-row items-center gap-12 md:gap-24">
        <div className="flex-1 space-y-8">
          <h2 className="text-[8vw] md:text-[6vw] leading-none font-black uppercase tracking-tighter">
            <span className="block text-outline-title">Seeds</span>
            <span className="block">Settle</span>
          </h2>
          <p className="text-xl text-gray-400 font-medium max-w-md uppercase tracking-wider leading-relaxed">
            The cut releases a single burst, then the seeds rain into the dune and clear the frame for the next act.
          </p>
        </div>

        <div className="flex-1 w-full max-w-lg">
          <div className="glass-panel rounded-[2rem] p-8 md:p-10">
            <p className="text-xs font-bold tracking-[0.35em] text-white/45 uppercase">Transition</p>
            <div className="mt-6 space-y-5">
              <div className="flex items-center justify-between border-b border-white/8 pb-4">
                <span className="text-sm font-bold uppercase tracking-[0.3em] text-white/55">Splash</span>
                <span className="text-lg font-black uppercase text-accent">One Cut</span>
              </div>
              <div className="flex items-center justify-between border-b border-white/8 pb-4">
                <span className="text-sm font-bold uppercase tracking-[0.3em] text-white/55">Landing</span>
                <span className="text-lg font-black uppercase text-white">Soft Sand</span>
              </div>
              <div className="flex items-center justify-between">
                <span className="text-sm font-bold uppercase tracking-[0.3em] text-white/55">Carryover</span>
                <span className="text-lg font-black uppercase text-white">One Seed</span>
              </div>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}
