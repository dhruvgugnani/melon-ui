"use client";

import React, { useRef, useState, useEffect } from "react";
import Link from "next/link";
import { ClientHomeScene } from "@/components/scene/ClientHomeScene";
import { SmoothCursor } from "@/components/overlay/SmoothCursor";
import gsap from "gsap";
import { useGSAP } from "@gsap/react";

const GITHUB_URL = "https://github.com/dhruvgugnani/melon-ui";

export default function Home() {
  const containerRef = useRef<HTMLDivElement>(null);
  const slashCanvasRef = useRef<HTMLCanvasElement>(null);
  const melonContainerRef = useRef<HTMLDivElement>(null);
  
  const [slicedCount, setSlicedCount] = useState(0);

  // Staggered GSAP reveal for home page content
  useGSAP(() => {
    const tl = gsap.timeline();

    tl.from(".home-reveal-fast", {
      opacity: 0,
      y: 35,
      stagger: 0.08,
      duration: 0.65,
      ease: "power2.out",
    });

    tl.from(".home-reveal-slow", {
      opacity: 0,
      y: 25,
      stagger: 0.06,
      duration: 0.55,
      ease: "power2.out",
    }, "-=0.35");
  }, { scope: containerRef });

  // Sliced wedges counter window updates
  useEffect(() => {
    const handleCount = (e: Event) => {
      const customEvent = e as CustomEvent;
      const count = customEvent.detail?.count ?? 0;
      setSlicedCount(count);
    };
    window.addEventListener("melon-sliced-count", handleCount);
    return () => window.removeEventListener("melon-sliced-count", handleCount);
  }, []);

  // Dispatch regrow event
  const handleRegrow = () => {
    window.dispatchEvent(new Event("melon-regrow"));
  };

  // Viewport drag slash trail tracker
  useEffect(() => {
    const canvas = slashCanvasRef.current;
    if (!canvas) return;

    const resizeCanvas = () => {
      canvas.width = window.innerWidth;
      canvas.height = window.innerHeight;
    };
    resizeCanvas();
    window.addEventListener("resize", resizeCanvas);

    let isDrawing = false;
    let points: { x: number; y: number }[] = [];
    let startX = 0;
    let startY = 0;

    const distanceToSegment = (px: number, py: number, x1: number, y1: number, x2: number, y2: number) => {
      const dx = x2 - x1;
      const dy = y2 - y1;
      const l2 = dx * dx + dy * dy;
      if (l2 === 0) return Math.hypot(px - x1, py - y1);
      
      let t = ((px - x1) * dx + (py - y1) * dy) / l2;
      t = Math.max(0, Math.min(1, t));
      
      return Math.hypot(px - (x1 + t * dx), py - (y1 + t * dy));
    };

    const handleMouseDown = (e: MouseEvent) => {
      const target = e.target as HTMLElement;
      // Skip drawing if clicking a button or anchor
      if (target.tagName === "BUTTON" || target.closest("button") || target.tagName === "A" || target.closest("a")) {
        return;
      }
      isDrawing = true;
      startX = e.clientX;
      startY = e.clientY;
      points = [{ x: startX, y: startY }];
      canvas.style.opacity = "1";
    };

    const handleMouseMove = (e: MouseEvent) => {
      if (!isDrawing) return;
      points.push({ x: e.clientX, y: e.clientY });

      const ctx = canvas.getContext("2d");
      if (ctx) {
        ctx.clearRect(0, 0, canvas.width, canvas.height);
        if (points.length >= 2) {
          ctx.shadowBlur = 18;
          ctx.shadowColor = "#ff5c71";
          ctx.strokeStyle = "#ff5c71";
          ctx.lineWidth = 6;
          ctx.lineCap = "round";
          ctx.lineJoin = "round";
          
          ctx.beginPath();
          ctx.moveTo(points[0].x, points[0].y);
          for (let i = 1; i < points.length; i++) {
            ctx.lineTo(points[i].x, points[i].y);
          }
          ctx.stroke();

          // Hot inner laser core
          ctx.shadowBlur = 0;
          ctx.strokeStyle = "#ffffff";
          ctx.lineWidth = 2.5;
          ctx.stroke();
        }
      }
    };

    const handleMouseUp = (e: MouseEvent) => {
      if (!isDrawing) return;
      isDrawing = false;

      const melonContainer = melonContainerRef.current;
      if (melonContainer && points.length >= 2) {
        const rect = melonContainer.getBoundingClientRect();
        const cx = rect.left + rect.width / 2;
        const cy = rect.top + rect.height / 2;
        const r = Math.min(rect.width, rect.height) * 0.35; // 3D collision radius

        let intersected = false;
        for (let i = 0; i < points.length - 1; i++) {
          const p1 = points[i];
          const p2 = points[i + 1];
          const dist = distanceToSegment(cx, cy, p1.x, p1.y, p2.x, p2.y);
          if (dist < r) {
            intersected = true;
            break;
          }
        }

        if (intersected) {
          const dx = e.clientX - startX;
          const dy = e.clientY - startY;
          const angle = Math.atan2(dy, dx);
          window.dispatchEvent(new CustomEvent("melon-slice", { detail: { angle } }));
        }
      }

      gsap.to(canvas, {
        opacity: 0,
        duration: 0.25,
        onComplete: () => {
          const ctx = canvas.getContext("2d");
          ctx?.clearRect(0, 0, canvas.width, canvas.height);
        }
      });
    };

    // Touch Support
    const handleTouchStart = (e: TouchEvent) => {
      const target = e.target as HTMLElement;
      if (target.tagName === "BUTTON" || target.closest("button") || target.tagName === "A" || target.closest("a")) {
        return;
      }
      isDrawing = true;
      startX = e.touches[0].clientX;
      startY = e.touches[0].clientY;
      points = [{ x: startX, y: startY }];
      canvas.style.opacity = "1";
    };

    const handleTouchMove = (e: TouchEvent) => {
      if (!isDrawing) return;
      points.push({ x: e.touches[0].clientX, y: e.touches[0].clientY });

      const ctx = canvas.getContext("2d");
      if (ctx) {
        ctx.clearRect(0, 0, canvas.width, canvas.height);
        if (points.length >= 2) {
          ctx.shadowBlur = 18;
          ctx.shadowColor = "#ff5c71";
          ctx.strokeStyle = "#ff5c71";
          ctx.lineWidth = 6;
          ctx.lineCap = "round";
          ctx.lineJoin = "round";
          
          ctx.beginPath();
          ctx.moveTo(points[0].x, points[0].y);
          for (let i = 1; i < points.length; i++) {
            ctx.lineTo(points[i].x, points[i].y);
          }
          ctx.stroke();

          ctx.shadowBlur = 0;
          ctx.strokeStyle = "#ffffff";
          ctx.lineWidth = 2.5;
          ctx.stroke();
        }
      }
    };

    const handleTouchEnd = () => {
      if (!isDrawing) return;
      isDrawing = false;

      const melonContainer = melonContainerRef.current;
      if (melonContainer && points.length >= 2) {
        const rect = melonContainer.getBoundingClientRect();
        const cx = rect.left + rect.width / 2;
        const cy = rect.top + rect.height / 2;
        const r = Math.min(rect.width, rect.height) * 0.35;

        let intersected = false;
        for (let i = 0; i < points.length - 1; i++) {
          const p1 = points[i];
          const p2 = points[i + 1];
          const dist = distanceToSegment(cx, cy, p1.x, p1.y, p2.x, p2.y);
          if (dist < r) {
            intersected = true;
            break;
          }
        }

        if (intersected) {
          const lastPoint = points[points.length - 1];
          const dx = lastPoint.x - startX;
          const dy = lastPoint.y - startY;
          const angle = Math.atan2(dy, dx);
          window.dispatchEvent(new CustomEvent("melon-slice", { detail: { angle } }));
        }
      }

      gsap.to(canvas, {
        opacity: 0,
        duration: 0.25,
        onComplete: () => {
          const ctx = canvas.getContext("2d");
          ctx?.clearRect(0, 0, canvas.width, canvas.height);
        }
      });
    };

    window.addEventListener("mousedown", handleMouseDown);
    window.addEventListener("mousemove", handleMouseMove);
    window.addEventListener("mouseup", handleMouseUp);
    window.addEventListener("touchstart", handleTouchStart, { passive: true });
    window.addEventListener("touchmove", handleTouchMove, { passive: true });
    window.addEventListener("touchend", handleTouchEnd, { passive: true });

    return () => {
      window.removeEventListener("resize", resizeCanvas);
      window.removeEventListener("mousedown", handleMouseDown);
      window.removeEventListener("mousemove", handleMouseMove);
      window.removeEventListener("mouseup", handleMouseUp);
      window.removeEventListener("touchstart", handleTouchStart);
      window.removeEventListener("touchmove", handleTouchMove);
      window.removeEventListener("touchend", handleTouchEnd);
    };
  }, []);

  return (
    <main ref={containerRef} className="relative min-h-screen w-full overflow-x-hidden bg-[#050505] text-white select-none">
      
      {/* Custom Smooth Cursor trail */}
      <SmoothCursor />

      {/* Viewport Slice Slash Trail Overlay Canvas */}
      <canvas
        ref={slashCanvasRef}
        className="pointer-events-none fixed inset-0 z-50 transition-opacity duration-150"
      />

      {/* Cyber Grid & Glowing Ambient Backdrop */}
      <div className="store-backdrop-container">
        <div className="store-bg-grid" />
        <div className="store-glow-blob store-glow-pink" />
        <div className="store-glow-blob store-glow-green" />
      </div>

      {/* Brand Navigation Header */}
      <header className="absolute left-0 right-0 top-0 z-20 flex items-center justify-between px-6 py-6 md:px-10">
        <Link href="/" className="flex items-center gap-3 group" aria-label="MelonUI home">
          <span className="relative h-9 w-9 overflow-hidden rounded-full border border-white/15 bg-[#ff5c71] shrink-0 group-hover:scale-105 transition-transform duration-300">
            <span className="absolute inset-x-1 bottom-1 h-5 rounded-b-full bg-[#203f18]" />
            <span className="absolute inset-x-2 bottom-2 h-3 rounded-b-full bg-[#e0f2dc]" />
            <span className="absolute inset-x-3 bottom-3 h-2 rounded-b-full bg-[#ff5c71]" />
            <span className="absolute bottom-3 left-1/2 h-1 w-1 -translate-x-1/2 rounded-full bg-black" />
          </span>
          <span className="text-xl font-black uppercase text-white group-hover:text-[#ff5c71] transition-colors" style={{ fontFamily: "var(--font-londrina-solid)", letterSpacing: 0 }}>
            MelonUI
          </span>
        </Link>

        <div className="flex items-center gap-2.5 text-xs font-bold relative z-30">
          <a
            href={GITHUB_URL}
            target="_blank"
            rel="noreferrer"
            className="rounded-sm border border-white/12 bg-black/35 px-4.5 py-2 font-mono text-[10px] uppercase tracking-widest text-white/70 backdrop-blur-md transition-colors hover:text-white hover:border-white/20 cursor-pointer active:scale-95 transition-transform"
          >
            GitHub
          </a>
          <Link
            href="/community"
            className="rounded-sm bg-[#ff5c71] px-4.5 py-2 font-mono text-[10px] uppercase tracking-widest text-[#050505] font-black hover:bg-white hover:text-black transition-all cursor-pointer active:scale-95 transition-transform"
          >
            Store
          </Link>
        </div>
      </header>

      {/* Main Content Layout */}
      <div className="relative z-10 grid grid-cols-12 min-h-screen w-full items-center px-6 md:px-10 lg:px-16 pt-24 pb-12 gap-8">
        
        {/* Left Column: Copy & Actions */}
        <div className="col-span-12 lg:col-span-7 flex flex-col justify-center space-y-6">
          <div className="inline-flex items-center gap-2 px-3 py-1.5 bg-[#ff5c71]/10 border border-[#ff5c71]/20 rounded-sm w-fit home-reveal-fast">
            <span className="w-1.5 h-1.5 rounded-full bg-[#7fff5e] animate-pulse" />
            <span className="font-mono text-[10px] text-[#ff5c71] uppercase tracking-[0.2em]">Fresh Component Laboratory</span>
          </div>

          <h1 className="text-8xl sm:text-[7.5rem] md:text-[10rem] xl:text-[12rem] font-black uppercase leading-[0.76] tracking-tighter text-white home-reveal-fast" style={{ fontFamily: "var(--font-londrina-solid)" }}>
            Slice<br />
            The<br />
            <span className="text-[#ff5c71]">Web</span>
            <span className="text-[#7fff5e]">.</span>
          </h1>

          <p className="font-mono text-zinc-400 text-base md:text-lg max-w-2xl leading-relaxed home-reveal-slow">
            A premium, futuristic 3D component laboratory for fresh, internet-native user interface pieces. Copy, paste, and ship beautifully animated components powered by GSAP & WebGL.
          </p>

          <div className="flex flex-wrap items-center gap-5 pt-4 home-reveal-slow">
            <Link 
              href="/community" 
              className="px-10 py-5 bg-[#ff5c71] text-[#050505] font-black uppercase tracking-widest text-base cursor-pointer hover:scale-105 active:scale-95 transition-all duration-200 shadow-lg shadow-[#ff5c71]/25 rounded-sm" 
              style={{ fontFamily: "var(--font-londrina-solid)" }}
            >
              Explore Store
            </Link>
            <a 
              href={GITHUB_URL} 
              target="_blank" 
              rel="noreferrer" 
              className="px-10 py-5 bg-transparent text-white border border-white/18 hover:border-white font-black uppercase tracking-widest text-base cursor-pointer hover:scale-105 active:scale-95 transition-all duration-200 rounded-sm" 
              style={{ fontFamily: "var(--font-londrina-solid)" }}
            >
              GitHub Repo
            </a>
            <Link 
              href="/preview" 
              className="px-8 py-5 bg-transparent text-zinc-400 hover:text-white font-mono text-[11px] uppercase tracking-widest cursor-pointer hover:underline"
            >
              View Story Mode →
            </Link>
          </div>
        </div>
        
        {/* Right Column: Standalone 3D Interactive Melon */}
        <div className="col-span-12 lg:col-span-5 h-[400px] lg:h-[600px] w-full relative flex flex-col items-center justify-center">
          <div ref={melonContainerRef} className="absolute inset-0 z-0 pointer-events-auto">
            <ClientHomeScene />
          </div>
          
          {/* Mouse drag instruction indicator */}
          <div className="absolute bottom-4 font-mono text-[9px] uppercase tracking-widest text-zinc-500 pointer-events-none select-none flex items-center gap-1.5">
            <svg width="10" height="10" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5">
              <path d="M15 18l-6-6 6-6" />
            </svg>
            Drag to rotate • Slash to slice Melon
            <svg width="10" height="10" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5">
              <path d="M9 18l6-6-6-6" />
            </svg>
          </div>

          {/* Regrow button overlays below the scene */}
          <div className={`absolute bottom-16 z-30 transition-all duration-300 transform ${
            slicedCount > 0 ? "opacity-100 translate-y-0" : "opacity-0 translate-y-4 pointer-events-none"
          }`}>
            <button
              onClick={handleRegrow}
              className="px-6 py-3 bg-[#7fff5e] text-[#050505] font-black uppercase tracking-widest text-xs rounded-sm hover:scale-105 active:scale-95 transition-all duration-200 shadow-lg shadow-[#7fff5e]/20 cursor-pointer"
              style={{ fontFamily: "var(--font-londrina-solid)" }}
            >
              Regrow Melon
            </button>
          </div>
        </div>

      </div>
    </main>
  );
}
