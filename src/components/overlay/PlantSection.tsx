export function PlantSection() {
  return (
    <section
      id="plant-section"
      className="snap-start horizontal-section horizontal-section-right relative w-full h-screen z-10 pointer-events-none flex items-center px-6"
      style={{ scrollSnapStop: "always" }}
    >
      <div className="max-w-7xl w-full mx-auto flex flex-col md:flex-row-reverse items-center gap-12 md:gap-24">
        <div className="flex-1 space-y-8 text-right">
          <h2 className="text-[8vw] md:text-[6vw] leading-none font-black uppercase tracking-tighter">
            <span className="block text-outline-title">Rooted</span>
            <span className="block text-white">Growth</span>
          </h2>
          <p className="text-xl text-gray-400 font-medium max-w-md ml-auto uppercase tracking-wider leading-relaxed">
            One seed survives the fall, hooks into the dune, and climbs into a more natural melon vine with tendrils and hanging fruit.
          </p>
        </div>

        <div className="flex-1 w-full max-w-lg grid grid-cols-2 gap-4">
          <div className="glass-panel rounded-3xl p-6 aspect-square flex flex-col justify-end">
            <h3 className="text-xl font-black uppercase text-accent">Timelapse</h3>
            <p className="text-xs tracking-widest text-gray-500 uppercase font-bold mt-1">Germination</p>
          </div>
          <div className="glass-panel rounded-3xl p-6 aspect-square flex flex-col justify-end">
            <h3 className="text-xl font-black uppercase text-white">Vine</h3>
            <p className="text-xs tracking-widest text-gray-500 uppercase font-bold mt-1">Side Growth</p>
          </div>
          <div className="glass-panel rounded-3xl p-6 aspect-square flex flex-col justify-end">
            <h3 className="text-xl font-black uppercase text-white">Leaves</h3>
            <p className="text-xs tracking-widest text-gray-500 uppercase font-bold mt-1">Layered Canopy</p>
          </div>
          <div className="glass-panel rounded-3xl p-6 aspect-square flex flex-col justify-end">
            <h3 className="text-xl font-black uppercase text-accent">Fruit Set</h3>
            <p className="text-xs tracking-widest text-gray-500 uppercase font-bold mt-1">Hanging Stem</p>
          </div>
        </div>
      </div>
    </section>
  );
}
