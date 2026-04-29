export function ShowcaseSection() {
  return (
    <section className="relative w-full h-full flex flex-col justify-center px-6 z-10">
      <div className="max-w-7xl w-full mx-auto flex flex-col md:flex-row items-center gap-12 md:gap-24">
        
        {/* Text Block */}
        <div className="flex-1 space-y-8">
          <h2 className="text-[8vw] md:text-[6vw] leading-none font-black uppercase tracking-tighter">
            <span className="block text-outline" data-text="Fresh">Fresh</span>
            <span className="block">Design</span>
          </h2>
          <p className="text-xl text-gray-400 font-medium max-w-md uppercase tracking-wider leading-relaxed">
            Beautifully crafted components that feel right at home in modern, bold interfaces.
          </p>
        </div>

        {/* Component Showcase Block (Placeholder) */}
        <div className="flex-1 w-full max-w-lg">
          <div className="glass-panel rounded-3xl p-8 transform rotate-3 hover:rotate-0 transition-transform duration-500 ease-out will-change-transform">
            <div className="flex justify-between items-start mb-12">
              <div className="w-12 h-12 rounded-full bg-accent" />
              <div className="text-right">
                <p className="text-sm font-bold tracking-widest text-gray-400 uppercase">Status</p>
                <p className="text-lg font-black uppercase text-accent">Active</p>
              </div>
            </div>
            <div className="space-y-4">
              <div className="h-4 bg-gray-800 rounded-full w-3/4" />
              <div className="h-4 bg-gray-800 rounded-full w-1/2" />
            </div>
            <div className="mt-12 flex justify-end">
              <button className="px-6 py-3 rounded-full bg-white text-black font-bold uppercase tracking-widest text-sm hover:scale-105 transition-transform">
                Interact
              </button>
            </div>
          </div>
        </div>

      </div>
    </section>
  );
}
