"use client";

import React, { useRef, useState, useEffect } from "react";
import gsap from "gsap";

export function HoloTicket() {
  const ticketRef = useRef<HTMLDivElement>(null);
  const topRef = useRef<HTMLDivElement>(null);
  const bottomRef = useRef<HTMLDivElement>(null);
  const foilRef = useRef<HTMLDivElement>(null);

  const [isTorn, setIsTorn] = useState(false);
  const [isDragging, setIsDragging] = useState(false);
  const startY = useRef(0);
  const currentY = useRef(0);

  // 3D Tilt Effect
  const handleMouseMove = (e: React.MouseEvent) => {
    if (!ticketRef.current || isDragging || isTorn) return;
    const rect = ticketRef.current.getBoundingClientRect();
    const x = e.clientX - rect.left;
    const y = e.clientY - rect.top;
    const centerX = rect.width / 2;
    const centerY = rect.height / 2;

    const rotateX = ((y - centerY) / centerY) * -15;
    const rotateY = ((x - centerX) / centerX) * 15;

    gsap.to(ticketRef.current, {
      rotateX,
      rotateY,
      duration: 0.4,
      ease: "power2.out",
    });

    if (foilRef.current) {
      gsap.to(foilRef.current, {
        backgroundPosition: `${(x / rect.width) * 100}% ${(y / rect.height) * 100}%`,
        opacity: 0.8,
        duration: 0.4,
      });
    }
  };

  const handleMouseLeave = () => {
    if (!ticketRef.current || isDragging || isTorn) return;
    gsap.to(ticketRef.current, {
      rotateX: 0,
      rotateY: 0,
      duration: 0.8,
      ease: "elastic.out(1, 0.5)",
    });
    if (foilRef.current) {
      gsap.to(foilRef.current, { opacity: 0, duration: 0.5 });
    }
  };

  // Drag to Tear Effect
  const handlePointerDown = (e: React.PointerEvent) => {
    if (isTorn) return;
    // Only drag from the bottom stub
    if (!bottomRef.current?.contains(e.target as Node)) return;

    setIsDragging(true);
    startY.current = e.clientY;
    currentY.current = 0;

    if (ticketRef.current) {
      gsap.to(ticketRef.current, {
        rotateX: 0,
        rotateY: 0,
        duration: 0.3,
      });
    }

    // Add event listeners to window for smooth dragging outside element
    window.addEventListener("pointermove", handlePointerMove);
    window.addEventListener("pointerup", handlePointerUp);
    // Prevent default drag behaviors
    e.currentTarget.setPointerCapture(e.pointerId);
  };

  const handlePointerMove = (e: PointerEvent) => {
    if (isTorn) return;
    const deltaY = Math.max(0, e.clientY - startY.current);

    // Resist the drag
    currentY.current = deltaY * 0.4;

    if (bottomRef.current) {
      gsap.set(bottomRef.current, {
        y: currentY.current,
        rotateZ: currentY.current * 0.05,
      });
    }

    // Stretch the middle gap visual
    if (topRef.current && bottomRef.current) {
      const gap = currentY.current;
      gsap.set(topRef.current, {
         clipPath: `polygon(0 0, 100% 0, 100% calc(100% + ${gap}px), 0 calc(100% + ${gap}px))`
      });
    }
  };

  const handlePointerUp = () => {
    setIsDragging(false);
    window.removeEventListener("pointermove", handlePointerMove);
    window.removeEventListener("pointerup", handlePointerUp);

    const TEAR_THRESHOLD = 40;

    if (currentY.current > TEAR_THRESHOLD) {
      tearTicket();
    } else {
      snapBack();
    }
  };

  const snapBack = () => {
    if (!bottomRef.current) return;
    gsap.to(bottomRef.current, {
      y: 0,
      rotateZ: 0,
      duration: 0.6,
      ease: "elastic.out(1, 0.3)",
    });
    if (topRef.current) {
      gsap.to(topRef.current, {
         clipPath: "polygon(0 0, 100% 0, 100% 100%, 0 100%)",
         duration: 0.6,
         ease: "elastic.out(1, 0.3)",
      });
    }
  };

  const tearTicket = () => {
    setIsTorn(true);

    // Animate bottom stub falling away
    if (bottomRef.current) {
      // Use a consistent pseudo-random value based on currentY for deterministic tearing
      const rotateVal = ((currentY.current % 10) - 5) * 8;
      gsap.to(bottomRef.current, {
        y: currentY.current + 200,
        rotateZ: rotateVal,
        opacity: 0,
        duration: 0.8,
        ease: "power2.in",
      });
    }

    // Pop animation on the top stub
    if (topRef.current) {
      gsap.timeline()
        .to(topRef.current, {
          scale: 1.05,
          duration: 0.1,
          ease: "power2.out",
        })
        .to(topRef.current, {
          scale: 1,
          duration: 0.5,
          ease: "elastic.out(1, 0.4)",
        });
    }

    // Reset after delay to allow replay
    setTimeout(() => {
      resetTicket();
    }, 2500);
  };

  const resetTicket = () => {
    setIsTorn(false);
    currentY.current = 0;
    if (bottomRef.current) {
      gsap.set(bottomRef.current, { y: 0, rotateZ: 0, opacity: 1 });
    }
    if (topRef.current) {
      gsap.set(topRef.current, { scale: 1, clipPath: "polygon(0 0, 100% 0, 100% 100%, 0 100%)" });
    }
    if (ticketRef.current) {
      gsap.to(ticketRef.current, {
        rotateX: 0,
        rotateY: 0,
        duration: 0.4,
      });
    }
  };

  useEffect(() => {
    return () => {
      window.removeEventListener("pointermove", handlePointerMove);
      window.removeEventListener("pointerup", handlePointerUp);
    };
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []); // Only run on mount/unmount to avoid accidentally unbinding listeners after re-renders

  return (
    <div
      className="relative w-64 h-96 select-none"
      style={{ perspective: "1000px" }}
    >
      {/* Container to handle 3D Transforms */}
      <div
        ref={ticketRef}
        className="w-full h-full relative"
        onMouseMove={handleMouseMove}
        onMouseLeave={handleMouseLeave}
        onPointerDown={handlePointerDown}
        style={{ transformStyle: "preserve-3d", touchAction: "none" }}
      >
        {/* Shadow Layer */}
        <div className="absolute inset-0 bg-black/50 blur-xl translate-y-4 -z-10 rounded-2xl" />

        {/* --- Top Part --- */}
        <div
          ref={topRef}
          className="absolute top-0 left-0 w-full h-[70%] bg-[#0d0d0d] rounded-t-2xl border border-[#ff5c71]/20 flex flex-col justify-between overflow-hidden"
          style={{
            clipPath: "polygon(0 0, 100% 0, 100% 100%, 0 100%)",
            borderBottom: "none"
          }}
        >
          {/* Noise overlay */}
          <div className="absolute inset-0 opacity-10 mix-blend-overlay pointer-events-none" style={{ backgroundImage: "url('data:image/svg+xml;utf8,%3Csvg viewBox=%220 0 200 200%22 xmlns=%22http://www.w3.org/2000/svg%22%3E%3Cfilter id=%22noiseFilter%22%3E%3CfeTurbulence type=%22fractalNoise%22 baseFrequency=%220.65%22 numOctaves=%223%22 stitchTiles=%22stitch%22/%3E%3C/filter%3E%3Crect width=%22100%25%22 height=%22100%25%22 filter=%22url(%23noiseFilter)%22/%3E%3C/svg%3E')" }} />

          <div className="p-6 relative z-10">
            <div className="flex justify-between items-start mb-4">
              <span className="font-mono text-[10px] text-[#ff5c71] uppercase tracking-widest">Admit One</span>
              <span className="font-mono text-[10px] text-[#555]">No. 0842</span>
            </div>

            <h3 className="text-4xl font-black uppercase tracking-tighter text-[#f4f4f4] mb-1" style={{ fontFamily: "var(--font-anton)" }}>
              Melon<br/>Fest
            </h3>
            <p className="font-mono text-xs text-[#7fff5e] mb-4">VIP ACCESS</p>

            {/* Holographic foil overlay effect */}
            <div
              ref={foilRef}
              className="absolute inset-0 pointer-events-none mix-blend-color-dodge opacity-0 transition-opacity duration-300"
              style={{
                background: "linear-gradient(125deg, rgba(255,92,113,0) 0%, rgba(255,92,113,0.3) 30%, rgba(127,255,94,0.4) 50%, rgba(255,92,113,0.3) 70%, rgba(255,92,113,0) 100%)",
                backgroundSize: "200% 200%",
              }}
            />
          </div>

          {/* Status overlay when torn */}
          <div className={`absolute inset-0 flex items-center justify-center bg-black/60 backdrop-blur-sm z-20 transition-all duration-300 ${isTorn ? 'opacity-100' : 'opacity-0 pointer-events-none'}`}>
             <span className="text-[#ff5c71] border-2 border-[#ff5c71] px-4 py-1 font-mono text-lg font-bold uppercase tracking-widest rotate-[-15deg]">
               Redeemed
             </span>
          </div>

          {/* Jagged bottom edge (Top Half) */}
          <div className="absolute bottom-0 left-0 w-full h-2 flex">
            {Array.from({ length: 16 }).map((_, i) => (
              <div key={i} className="flex-1 bg-[#0d0d0d]" style={{ clipPath: "polygon(50% 100%, 0 0, 100% 0)" }} />
            ))}
          </div>
        </div>

        {/* --- Bottom Part (Stub) --- */}
        <div
          ref={bottomRef}
          className="absolute bottom-0 left-0 w-full h-[30%] bg-[#ff5c71] rounded-b-2xl flex flex-col justify-center items-center cursor-grab active:cursor-grabbing border-t border-dashed border-[#050505]/40"
          style={{ transformOrigin: "top center" }}
        >
           {/* Jagged top edge (Bottom Half) */}
           <div className="absolute top-0 left-0 w-full h-2 flex -translate-y-full">
            {Array.from({ length: 16 }).map((_, i) => (
              <div key={i} className="flex-1 bg-[#ff5c71]" style={{ clipPath: "polygon(50% 0, 0 100%, 100% 100%)" }} />
            ))}
          </div>

          {/* Noise overlay */}
          <div className="absolute inset-0 opacity-10 mix-blend-overlay pointer-events-none" style={{ backgroundImage: "url('data:image/svg+xml;utf8,%3Csvg viewBox=%220 0 200 200%22 xmlns=%22http://www.w3.org/2000/svg%22%3E%3Cfilter id=%22noiseFilter%22%3E%3CfeTurbulence type=%22fractalNoise%22 baseFrequency=%220.65%22 numOctaves=%223%22 stitchTiles=%22stitch%22/%3E%3C/filter%3E%3Crect width=%22100%25%22 height=%22100%25%22 filter=%22url(%23noiseFilter)%22/%3E%3C/svg%3E')" }} />

          <p className="font-mono text-xs font-bold text-[#050505] uppercase tracking-widest mb-1 relative z-10">
            Tear to Enter
          </p>
          <div className="flex gap-1 relative z-10">
             <div className="w-1 h-1 rounded-full bg-[#050505]" />
             <div className="w-1 h-1 rounded-full bg-[#050505]" />
             <div className="w-1 h-1 rounded-full bg-[#050505]" />
          </div>
        </div>
      </div>

      {/* Hidden SVG filter for noise if needed globally */}
    </div>
  );
}
