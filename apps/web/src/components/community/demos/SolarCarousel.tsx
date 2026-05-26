"use client";

import React, { useRef, useEffect, useState } from "react";
import gsap from "gsap";

interface CarouselItem {
  id: number;
  title: string;
  tag: string;
  color: string;
  description: string;
}

const ITEMS: CarouselItem[] = [
  { id: 1, title: "AETHER", tag: "WebGL", color: "#ff5c71", description: "Procedural digital shader canvas engine." },
  { id: 2, title: "HELIOS", tag: "Core Light", color: "#7fff5e", description: "Ultra-fast volumetric illumination mapping." },
  { id: 3, title: "NOVA", tag: "Ecosystem", color: "#00f0ff", description: "Decentralized reactive state sync framework." },
  { id: 4, title: "CHRONOS", tag: "GSAP Util", color: "#ffb000", description: "Sub-millisecond interactive timeline controller." },
  { id: 5, title: "NEBULA", tag: "CSS 3D", color: "#d600ff", description: "Generative canvas stellar particle simulation." }
];

export function SolarCarousel() {
  const containerRef = useRef<HTMLDivElement>(null);
  const trackRef = useRef<HTMLDivElement>(null);
  const cardRefs = useRef<(HTMLDivElement | null)[]>([]);
  const coreRef = useRef<HTMLDivElement>(null);

  const [activeCard, setActiveCard] = useState<CarouselItem | null>(null);

  // Orbital physics state
  const physics = useRef({
    rotation: 0,
    velocity: 0.005,
    isDragging: false,
    dragStart: 0,
    targetRotation: 0,
    radius: 200,
    targetRadius: 200,
    tilt: 65, // tilt angle in degrees
  });

  useEffect(() => {
    const container = containerRef.current;
    if (!container) return;

    // Continuous orbit loop
    const tick = () => {
      if (!physics.current.isDragging) {
        // Natural friction/inertia decay
        physics.current.velocity *= 0.95;
        if (Math.abs(physics.current.velocity) < 0.001) {
          physics.current.velocity = 0.002; // Keep a slow baseline orbit
        }
        physics.current.rotation += physics.current.velocity;
      }

      // Ease radius adjustments (gravity pull)
      physics.current.radius += (physics.current.targetRadius - physics.current.radius) * 0.1;

      // Position cards along 3D elliptical orbit
      cardRefs.current.forEach((card, index) => {
        if (!card) return;

        const totalItems = ITEMS.length;
        // Distribute items evenly around the circle
        const angle = physics.current.rotation + (index / totalItems) * Math.PI * 2;

        // Elliptical coordinate calculations
        const x = Math.cos(angle) * physics.current.radius;
        const z = Math.sin(angle) * physics.current.radius;
        
        // Depth-based sorting & scaling
        const depth = (z + physics.current.radius) / (physics.current.radius * 2); // 0 (back) to 1 (front)
        const scale = 0.65 + depth * 0.35;
        const opacity = 0.3 + depth * 0.7;

        // Apply 3D transform: translate cards, tilt them back so they stay vertical (billboarding)
        gsap.set(card, {
          x,
          z,
          scale,
          opacity,
          zIndex: Math.round(depth * 100),
          // We counter-act the track's X-rotation tilt (e.g. 65deg) so cards face the screen upright
          rotationX: -physics.current.tilt,
        });
      });
    };

    gsap.ticker.add(tick);

    // Mouse/Touch Drag Handlers
    let lastX = 0;
    const handleDown = (clientX: number) => {
      physics.current.isDragging = true;
      lastX = clientX;
    };

    const handleMove = (clientX: number) => {
      if (!physics.current.isDragging) return;
      const deltaX = clientX - lastX;
      lastX = clientX;
      
      // Convert pixel movement to angular velocity
      const sensitivity = 0.007;
      physics.current.velocity = deltaX * sensitivity;
      physics.current.rotation += physics.current.velocity;
    };

    const handleUp = () => {
      physics.current.isDragging = false;
    };

    // Listeners
    const onMouseDown = (e: MouseEvent) => handleDown(e.clientX);
    const onMouseMove = (e: MouseEvent) => handleMove(e.clientX);
    const onMouseUp = () => handleUp();

    const onTouchStart = (e: TouchEvent) => handleDown(e.touches[0].clientX);
    const onTouchMove = (e: TouchEvent) => handleMove(e.touches[0].clientX);
    const onTouchEnd = () => handleUp();

    container.addEventListener("mousedown", onMouseDown);
    window.addEventListener("mousemove", onMouseMove);
    window.addEventListener("mouseup", onMouseUp);

    container.addEventListener("touchstart", onTouchStart);
    container.addEventListener("touchmove", onTouchMove);
    container.addEventListener("touchend", onTouchEnd);

    return () => {
      gsap.ticker.remove(tick);
      container.removeEventListener("mousedown", onMouseDown);
      window.removeEventListener("mousemove", onMouseMove);
      window.removeEventListener("mouseup", onMouseUp);

      container.removeEventListener("touchstart", onTouchStart);
      container.removeEventListener("touchmove", onTouchMove);
      container.removeEventListener("touchend", onTouchEnd);
    };
  }, []);

  // Increase gravitational pull (draw cards in) when hovering core
  const handleCoreEnter = () => {
    physics.current.targetRadius = 150; // Pull closer
    if (coreRef.current) {
      gsap.to(coreRef.current, {
        scale: 1.25,
        backgroundColor: "rgba(255, 92, 113, 0.4)",
        boxShadow: "0 0 40px 20px rgba(255, 92, 113, 0.3)",
        duration: 0.4,
      });
    }
  };

  const handleCoreLeave = () => {
    physics.current.targetRadius = 200; // Return to orbit
    if (coreRef.current) {
      gsap.to(coreRef.current, {
        scale: 1,
        backgroundColor: "rgba(255, 92, 113, 0.15)",
        boxShadow: "0 0 25px 8px rgba(255, 92, 113, 0.15)",
        duration: 0.4,
      });
    }
  };

  // Card Hover animations
  const handleCardEnter = (card: HTMLDivElement | null, item: CarouselItem) => {
    if (!card) return;
    setActiveCard(item);
    // Slow down rotation speed on focus
    physics.current.velocity *= 0.1;

    gsap.to(card, {
      y: -30, // Lift item vertically
      borderColor: item.color,
      boxShadow: `0 15px 30px rgba(${item.color === "#7fff5e" ? "127, 255, 94" : item.color === "#ff5c71" ? "255, 92, 113" : "0, 240, 255"}, 0.25)`,
      duration: 0.3,
    });
  };

  const handleCardLeave = (card: HTMLDivElement | null) => {
    setActiveCard(null);
    if (!card) return;
    gsap.to(card, {
      y: 0,
      borderColor: "rgba(255, 255, 255, 0.08)",
      boxShadow: "0 4px 20px rgba(0,0,0,0.4)",
      duration: 0.3,
    });
  };

  return (
    <div className="relative flex flex-col items-center justify-center w-full min-h-[500px] overflow-hidden select-none bg-[#050505] rounded-xl border border-white/5">
      {/* Dynamic Ambient Background Nebula Glow */}
      <div 
        className="absolute w-[400px] h-[400px] rounded-full blur-[100px] pointer-events-none opacity-20 transition-colors duration-500"
        style={{
          background: activeCard ? activeCard.color : "rgba(255, 92, 113, 0.4)",
          transform: "translate(-50%, -50%)",
          left: "50%",
          top: "50%"
        }}
      />

      {/* Orbit Space Container */}
      <div 
        ref={containerRef}
        className="relative flex items-center justify-center w-[500px] h-[340px] cursor-grab active:cursor-grabbing"
        style={{ 
          perspective: "900px", 
          transformStyle: "preserve-3d" 
        }}
      >
        {/* Tilting Orbital Ring Grid */}
        <div 
          ref={trackRef}
          className="absolute flex items-center justify-center pointer-events-none"
          style={{
            width: "480px",
            height: "480px",
            borderRadius: "50%",
            border: "1.5px dashed rgba(255, 255, 255, 0.08)",
            transform: "rotateX(65deg)",
            transformStyle: "preserve-3d",
          }}
        >
          {/* Gravitational Singularity Core */}
          <div 
            ref={coreRef}
            onMouseEnter={handleCoreEnter}
            onMouseLeave={handleCoreLeave}
            className="absolute w-20 h-20 rounded-full flex items-center justify-center cursor-pointer pointer-events-auto transition-all"
            style={{
              background: "rgba(255, 92, 113, 0.15)",
              border: "2px solid #ff5c71",
              boxShadow: "0 0 25px 8px rgba(255, 92, 113, 0.15)",
              // Counter-act the parent's X rotation to make the core face us upright
              transform: "rotateX(-65deg)",
              transformStyle: "preserve-3d",
            }}
          >
            <div className="w-10 h-10 rounded-full bg-[#ff5c71] flex items-center justify-center font-bold text-[#050505] text-[10px] animate-pulse">
              GRAV
            </div>
          </div>

          {/* Cards Orbiting inside Track */}
          {ITEMS.map((item, index) => (
            <div
              key={item.id}
              ref={(el) => { cardRefs.current[index] = el; }}
              onMouseEnter={() => handleCardEnter(cardRefs.current[index], item)}
              onMouseLeave={() => handleCardLeave(cardRefs.current[index])}
              className="absolute w-44 p-4 rounded-xl border border-white/8 bg-[#0b0b0d]/80 backdrop-blur-md cursor-pointer pointer-events-auto transition-all flex flex-col justify-between"
              style={{
                height: "150px",
                boxShadow: "0 4px 20px rgba(0,0,0,0.4)",
              }}
            >
              <div>
                <div className="flex justify-between items-center mb-2">
                  <span 
                    className="text-[9px] font-mono uppercase px-2 py-0.5 rounded-full bg-white/5 text-white/60 tracking-wider"
                  >
                    {item.tag}
                  </span>
                  <span className="w-1.5 h-1.5 rounded-full" style={{ backgroundColor: item.color }} />
                </div>
                <h4 
                  className="text-lg font-black tracking-tight text-white leading-tight uppercase"
                  style={{ fontFamily: "var(--font-anton)" }}
                >
                  {item.title}
                </h4>
              </div>
              <p className="text-[10px] font-mono text-white/50 leading-relaxed">
                {item.description}
              </p>
            </div>
          ))}
        </div>
      </div>

      {/* Orbit Helper Indicators */}
      <footer className="z-10 text-center pointer-events-none mt-2">
        <span className="text-[10px] font-mono uppercase tracking-widest text-white/30">
          ◀ drag space to orbit • hover gravitational core ▶
        </span>
      </footer>
    </div>
  );
}
