"use client";

import { useEffect, useRef } from "react";
import gsap from "gsap";

export function SmoothCursor() {
  const dotRef = useRef<HTMLDivElement>(null);
  const ringRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    const dot = dotRef.current;
    const ring = ringRef.current;
    if (!dot || !ring) return;

    // Detect cursor capability (pointing device like mouse)
    const hasFinePointer = window.matchMedia("(pointer: fine)").matches;
    if (hasFinePointer) {
      document.body.style.cursor = "none";
    } else {
      // Hide completely on touch devices
      dot.style.display = "none";
      ring.style.display = "none";
      return;
    }

    const mouse = { x: 0, y: 0 };
    const ringPos = { x: 0, y: 0 };

    const handleMouseMove = (e: MouseEvent) => {
      mouse.x = e.clientX;
      mouse.y = e.clientY;
      
      // Instantly position the center dot
      gsap.set(dot, { x: mouse.x, y: mouse.y });
    };

    // Smooth physics LERP loop for the outer trailing ring
    let animFrameId: number;
    const tick = () => {
      ringPos.x += (mouse.x - ringPos.x) * 0.15;
      ringPos.y += (mouse.y - ringPos.y) * 0.15;

      gsap.set(ring, { x: ringPos.x, y: ringPos.y });
      animFrameId = requestAnimationFrame(tick);
    };

    window.addEventListener("mousemove", handleMouseMove);
    animFrameId = requestAnimationFrame(tick);

    // Hover transformations over active links/buttons
    const handleMouseOver = (e: MouseEvent) => {
      const target = e.target as HTMLElement;
      if (
        target.tagName === "A" ||
        target.tagName === "BUTTON" ||
        target.closest("a") ||
        target.closest("button") ||
        target.classList.contains("cursor-pointer")
      ) {
        gsap.to(ring, {
          scale: 1.6,
          borderColor: "#7fff5e",
          backgroundColor: "rgba(127, 255, 94, 0.08)",
          duration: 0.2,
          ease: "power2.out"
        });
        gsap.to(dot, {
          scale: 0.5,
          backgroundColor: "#7fff5e",
          duration: 0.2,
          ease: "power2.out"
        });
      }
    };

    const handleMouseOut = (e: MouseEvent) => {
      const target = e.target as HTMLElement;
      if (
        target.tagName === "A" ||
        target.tagName === "BUTTON" ||
        target.closest("a") ||
        target.closest("button") ||
        target.classList.contains("cursor-pointer")
      ) {
        gsap.to(ring, {
          scale: 1,
          borderColor: "#ff5c71",
          backgroundColor: "transparent",
          duration: 0.25,
          ease: "power2.out"
        });
        gsap.to(dot, {
          scale: 1,
          backgroundColor: "#ff5c71",
          duration: 0.25,
          ease: "power2.out"
        });
      }
    };

    window.addEventListener("mouseover", handleMouseOver);
    window.addEventListener("mouseout", handleMouseOut);

    return () => {
      document.body.style.cursor = "auto";
      window.removeEventListener("mousemove", handleMouseMove);
      cancelAnimationFrame(animFrameId);
      window.removeEventListener("mouseover", handleMouseOver);
      window.removeEventListener("mouseout", handleMouseOut);
    };
  }, []);

  return (
    <>
      {/* Precision Core Dot */}
      <div
        ref={dotRef}
        className="fixed w-2 h-2 bg-[#ff5c71] rounded-full pointer-events-none z-[9999] -translate-x-1/2 -translate-y-1/2"
      />
      {/* Outer Springy Ring */}
      <div
        ref={ringRef}
        className="fixed w-7 h-7 border border-[#ff5c71] rounded-full pointer-events-none z-[9998] -translate-x-1/2 -translate-y-1/2 mix-blend-screen"
        style={{ willChange: "transform" }}
      />
    </>
  );
}
