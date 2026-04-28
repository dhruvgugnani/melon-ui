export function CTASection() {
  return (
    <section className="relative w-full h-screen flex flex-col items-center justify-center text-center px-6 z-10">
      <h2 className="text-[10vw] leading-none font-black uppercase tracking-tighter mb-12">
        <span className="block text-outline" data-text="Ready To">Ready To</span>
        <span className="block">Build?</span>
      </h2>
      
      <button className="group relative inline-flex items-center justify-center px-12 py-6 text-2xl font-black uppercase tracking-widest bg-accent text-black rounded-full overflow-hidden transition-transform hover:scale-105 hover:bg-white">
        <div className="absolute inset-0 bg-white translate-y-full group-hover:translate-y-0 transition-transform duration-300 ease-out" />
        <span className="relative z-10">Use Em Now</span>
      </button>

      <div className="absolute bottom-10 text-sm font-bold tracking-widest text-gray-600 uppercase">
        © 2026 MelonUI. All rights reserved.
      </div>
    </section>
  );
}
