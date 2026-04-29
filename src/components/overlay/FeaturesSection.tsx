export function FeaturesSection() {
  return (
    <section id="features-section" className="snap-start relative w-full h-screen flex flex-col justify-center px-6 z-10">
      <div className="max-w-7xl w-full mx-auto flex flex-col md:flex-row-reverse items-center gap-12 md:gap-24">
        
        {/* Text Block */}
        <div className="flex-1 space-y-8 text-right">
          <h2 className="text-[8vw] md:text-[6vw] leading-none font-black uppercase tracking-tighter">
            <span className="block text-outline-thick" data-text="Crisp">Crisp</span>
            <span className="block">Details</span>
          </h2>
          <p className="text-xl text-gray-400 font-medium max-w-md ml-auto uppercase tracking-wider leading-relaxed">
            Every pixel is optimized for maximum flavor. No bloated code, just pure performance.
          </p>
        </div>

        {/* Feature Grid */}
        <div className="flex-1 w-full max-w-lg grid grid-cols-2 gap-4">
          <div className="glass-panel rounded-3xl p-6 aspect-square flex flex-col justify-end hover:bg-white/10 transition-colors cursor-crosshair">
            <h3 className="text-xl font-black uppercase text-accent">60fps</h3>
            <p className="text-xs tracking-widest text-gray-500 uppercase font-bold mt-1">Animations</p>
          </div>
          <div className="glass-panel rounded-3xl p-6 aspect-square flex flex-col justify-end hover:bg-white/10 transition-colors cursor-crosshair">
            <h3 className="text-xl font-black uppercase text-accent">Zero</h3>
            <p className="text-xs tracking-widest text-gray-500 uppercase font-bold mt-1">Layout Shift</p>
          </div>
          <div className="glass-panel rounded-3xl p-6 aspect-square flex flex-col justify-end hover:bg-white/10 transition-colors cursor-crosshair">
            <h3 className="text-xl font-black uppercase text-accent">Dark</h3>
            <p className="text-xs tracking-widest text-gray-500 uppercase font-bold mt-1">Mode First</p>
          </div>
          <div className="glass-panel rounded-3xl p-6 aspect-square flex flex-col justify-end hover:bg-white/10 transition-colors cursor-crosshair">
            <h3 className="text-xl font-black uppercase text-accent">React</h3>
            <p className="text-xs tracking-widest text-gray-500 uppercase font-bold mt-1">Three Fiber</p>
          </div>
        </div>

      </div>
    </section>
  );
}
