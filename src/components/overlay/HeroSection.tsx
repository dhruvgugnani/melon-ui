export function HeroSection() {
  return (
    <section className="relative w-full h-screen flex flex-col items-center justify-center overflow-hidden z-10 px-6">
      <div className="absolute top-10 left-10 flex items-center gap-3">
        <svg width="28" height="28" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg" className="drop-shadow-lg">
          {/* Dark green outer shell */}
          <path d="M2 12C2 17.5228 6.47715 22 12 22C17.5228 22 22 17.5228 22 12H2Z" fill="#2e4a25"/>
          {/* Light green / white rind */}
          <path d="M3.5 12C3.5 16.6944 7.30558 20.5 12 20.5C16.6944 20.5 20.5 16.6944 20.5 12H3.5Z" fill="#e0f2dc"/>
          {/* Red flesh */}
          <path d="M5 12C5 15.866 8.13401 19 12 19C15.866 19 19 15.866 19 12H5Z" fill="var(--accent)"/>
          {/* Seeds */}
          <circle cx="9" cy="15" r="1.5" fill="#000000"/>
          <circle cx="12" cy="17" r="1.5" fill="#000000"/>
          <circle cx="15" cy="15" r="1.5" fill="#000000"/>
          {/* Dashed outline for the top half (invisible melon) */}
          <path d="M2 12C2 6.47715 6.47715 2 12 2C17.5228 2 22 6.47715 22 12" stroke="#5c8a4d" strokeWidth="2" strokeDasharray="4 4" opacity="0.3"/>
        </svg>
        <span className="text-xl font-bold tracking-widest uppercase">Melon UI</span>
      </div>
      
      <div className="text-center mt-[-10vh]">
        <h1 className="text-[12vw] leading-none font-black tracking-tighter uppercase mb-4">
          <span className="block">Juicy</span>
          <span className="block text-outline-thick" data-text="Components">Components</span>
        </h1>
        <p className="text-xl md:text-2xl text-gray-400 font-medium max-w-lg mx-auto uppercase tracking-wide">
          Premium UI elements with a fresh taste. Scroll to taste.
        </p>
      </div>

      <div className="absolute bottom-10 left-1/2 -translate-x-1/2 flex flex-col items-center animate-bounce">
        <span className="text-sm font-bold uppercase tracking-widest mb-2 text-gray-500">Scroll</span>
        <div className="w-1 h-12 bg-gradient-to-b from-gray-500 to-transparent rounded-full" />
      </div>
    </section>
  );
}
