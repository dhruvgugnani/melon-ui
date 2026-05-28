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

  const baseRadiusRef = useRef(200);
  const scaleFactorRef = useRef(1.0);

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

    const handleResize = () => {
      const width = container.clientWidth;
      // Calculate a scale factor based on container width (mobile responsive)
      const scale = Math.min(1.0, Math.max(0.55, (width - 24) / 500));
      scaleFactorRef.current = scale;
      baseRadiusRef.current = 190 * scale;

      // Maintain core hover state proportions
      const isCoreHovered = physics.current.targetRadius < baseRadiusRef.current * 0.9;
      physics.current.targetRadius = isCoreHovered ? baseRadiusRef.current * 0.75 : baseRadiusRef.current;
      
      if (trackRef.current) {
        const size = baseRadiusRef.current * 2.3;
        trackRef.current.style.width = `${size}px`;
        trackRef.current.style.height = `${size}px`;
      }
    };

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
        const angle = physics.current.rotation + (index / totalItems) * Math.PI * 2;

        // Elliptical coordinate calculations
        const x = Math.cos(angle) * physics.current.radius;
        const z = Math.sin(angle) * physics.current.radius;
        
        // Depth-based sorting & scaling
        const depth = (z + physics.current.radius) / (physics.current.radius * 2 || 1); // 0 (back) to 1 (front)
        // Shrink card scale proportionally on mobile screens using scaleFactorRef
        const scale = (0.65 + depth * 0.35) * scaleFactorRef.current;
        const opacity = 0.3 + depth * 0.7;

        // Apply 3D transform: translate cards, tilt them back upright (billboarding)
        gsap.set(card, {
          x,
          z,
          scale,
          opacity,
          zIndex: Math.round(depth * 100),
          rotationX: -physics.current.tilt,
        });
      });
    };

    handleResize();
    window.addEventListener("resize", handleResize);
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
      
      const sensitivity = 0.007;
      physics.current.velocity = deltaX * sensitivity;
      physics.current.rotation += physics.current.velocity;
    };

    const handleUp = () => {
      physics.current.isDragging = false;
    };

    const onMouseDown = (e: MouseEvent) => handleDown(e.clientX);
    const onMouseMove = (e: MouseEvent) => handleMove(e.clientX);
    const onMouseUp = () => handleUp();

    const onTouchStart = (e: TouchEvent) => handleDown(e.touches[0].clientX);
    const onTouchMove = (e: TouchEvent) => handleMove(e.touches[0].clientX);
    const onTouchEnd = () => handleUp();

    container.addEventListener("mousedown", onMouseDown);
    window.addEventListener("mousemove", onMouseMove);
    window.addEventListener("mouseup", onMouseUp);

    container.addEventListener("touchstart", onTouchStart, { passive: true });
    container.addEventListener("touchmove", onTouchMove, { passive: true });
    container.addEventListener("touchend", onTouchEnd);

    return () => {
      gsap.ticker.remove(tick);
      window.removeEventListener("resize", handleResize);
      container.removeEventListener("mousedown", onMouseDown);
      window.removeEventListener("mousemove", onMouseMove);
      window.removeEventListener("mouseup", onMouseUp);

      container.removeEventListener("touchstart", onTouchStart);
      container.removeEventListener("touchmove", onTouchMove);
      container.removeEventListener("touchend", onTouchEnd);
    };
  }, []);

  // Hover core triggers core gravity pull
  const handleCoreEnter = () => {
    physics.current.targetRadius = baseRadiusRef.current * 0.75;
    if (coreRef.current) {
      gsap.to(coreRef.current, {
        scale: 1.2,
        backgroundColor: "rgba(255, 92, 113, 0.4)",
        boxShadow: "0 0 35px 15px rgba(255, 92, 113, 0.3)",
        duration: 0.4,
      });
    }
  };

  const handleCoreLeave = () => {
    physics.current.targetRadius = baseRadiusRef.current;
    if (coreRef.current) {
      gsap.to(coreRef.current, {
        scale: 1,
        backgroundColor: "rgba(255, 92, 113, 0.15)",
        boxShadow: "0 0 25px 8px rgba(255, 92, 113, 0.15)",
        duration: 0.4,
      });
    }
  };

  const handleCardEnter = (card: HTMLDivElement | null, item: CarouselItem) => {
    if (!card) return;
    setActiveCard(item);
    physics.current.velocity *= 0.1;

    gsap.to(card, {
      y: -25,
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
    <div className="relative flex flex-col items-center justify-center w-full min-h-[480px] overflow-hidden select-none bg-[#050505] rounded-xl border border-white/5 p-4">
      {/* Nebula Glow Background */}
      <div 
        className="absolute w-[300px] h-[300px] rounded-full blur-[90px] pointer-events-none opacity-15 transition-colors duration-500"
        style={{
          background: activeCard ? activeCard.color : "rgba(255, 92, 113, 0.35)",
          transform: "translate(-50%, -50%)",
          left: "50%",
          top: "50%"
        }}
      />

      {/* Orbit Space Container */}
      <div 
        ref={containerRef}
        className="relative flex items-center justify-center w-full max-w-[500px] h-[330px] cursor-grab active:cursor-grabbing"
        style={{ 
          perspective: "900px", 
          transformStyle: "preserve-3d" 
        }}
      >
        {/* Tilting Orbital Track */}
        <div 
          ref={trackRef}
          className="absolute flex items-center justify-center pointer-events-none"
          style={{
            width: "440px",
            height: "440px",
            borderRadius: "50%",
            border: "1.5px dashed rgba(255, 255, 255, 0.08)",
            transform: "rotateX(65deg)",
            transformStyle: "preserve-3d",
          }}
        >
          {/* Gravitational Core */}
          <div 
            ref={coreRef}
            onMouseEnter={handleCoreEnter}
            onMouseLeave={handleCoreLeave}
            className="absolute w-16 h-16 rounded-full flex items-center justify-center cursor-pointer pointer-events-auto transition-all"
            style={{
              background: "rgba(255, 92, 113, 0.15)",
              border: "2px solid #ff5c71",
              boxShadow: "0 0 25px 8px rgba(255, 92, 113, 0.15)",
              transform: "rotateX(-65deg)",
              transformStyle: "preserve-3d",
            }}
          >
            <div className="w-9 h-9 rounded-full bg-[#ff5c71] flex items-center justify-center font-bold text-[#050505] text-[9px] animate-pulse">
              GRAV
            </div>
          </div>

          {/* Orbiting cards */}
          {ITEMS.map((item, index) => (
            <div
              key={item.id}
              ref={(el) => { cardRefs.current[index] = el; }}
              onMouseEnter={() => handleCardEnter(cardRefs.current[index], item)}
              onMouseLeave={() => handleCardLeave(cardRefs.current[index])}
              className="absolute w-40 p-3.5 rounded-xl border border-white/8 bg-[#0b0b0d]/85 backdrop-blur-md cursor-pointer pointer-events-auto transition-all flex flex-col justify-between"
              style={{
                height: "135px",
                boxShadow: "0 4px 20px rgba(0,0,0,0.4)",
              }}
            >
              <div>
                <div className="flex justify-between items-center mb-1.5">
                  <span 
                    className="text-[8px] font-mono uppercase px-2 py-0.5 rounded-full bg-white/5 text-white/50 tracking-wider"
                  >
                    {item.tag}
                  </span>
                  <span className="w-1.5 h-1.5 rounded-full" style={{ backgroundColor: item.color }} />
                </div>
                <h4 
                  className="text-base font-black tracking-tight text-white leading-tight uppercase"
                  style={{ fontFamily: "var(--font-anton)" }}
                >
                  {item.title}
                </h4>
              </div>
              <p className="text-[9px] font-mono text-white/50 leading-relaxed line-clamp-3">
                {item.description}
              </p>
            </div>
          ))}
        </div>
      </div>

      <footer className="z-10 text-center pointer-events-none mt-1">
        <span className="text-[9px] font-mono uppercase tracking-widest text-white/25">
          ◀ drag space to orbit • hover gravitational core ▶
        </span>
      </footer>
    </div>
  );
}
