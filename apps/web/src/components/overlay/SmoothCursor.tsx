"use client";

import { useEffect, useRef } from "react";
import gsap from "gsap";

export function SmoothCursor() {
  const cursorRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    const cursor = cursorRef.current;
    if (!cursor) return;

    // Detect cursor capability (pointing device like mouse)
    const hasFinePointer = window.matchMedia("(pointer: fine)").matches;
    if (hasFinePointer) {
      document.body.style.cursor = "none";
    } else {
      // Hide completely on touch devices
      cursor.style.display = "none";
      return;
    }

    const mouse = { x: 0, y: 0 };
    const cursorPos = { x: 0, y: 0 };

    const handleMouseMove = (e: MouseEvent) => {
      mouse.x = e.clientX;
      mouse.y = e.clientY;
    };

    // Smooth physics LERP loop (0.15 coefficient for a premium, water-like lag)
    let animFrameId: number;
    const tick = () => {
      cursorPos.x += (mouse.x - cursorPos.x) * 0.15;
      cursorPos.y += (mouse.y - cursorPos.y) * 0.15;

      gsap.set(cursor, { x: cursorPos.x, y: cursorPos.y });
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
        const path = cursor.querySelector("path");
        if (path) {
          gsap.to(path, {
            fill: "#7fff5e",
            duration: 0.2,
            ease: "power2.out",
          });
        }
        gsap.to(cursor, {
          scale: 1.25,
          duration: 0.2,
          ease: "power2.out",
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
        const path = cursor.querySelector("path");
        if (path) {
          gsap.to(path, {
            fill: "#ff5c71",
            duration: 0.25,
            ease: "power2.out",
          });
        }
        gsap.to(cursor, {
          scale: 1.0,
          duration: 0.25,
          ease: "power2.out",
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
    <div
      ref={cursorRef}
      className="fixed pointer-events-none z-[9999] will-change-transform"
      style={{ left: 0, top: 0 }}
    >
      <svg
        width="28"
        height="28"
        viewBox="0 0 24 24"
        fill="none"
        xmlns="http://www.w3.org/2000/svg"
        style={{ transformOrigin: "0 0" }}
        className="drop-shadow-[0_4px_12px_rgba(0,0,0,0.6)]"
      >
        <path
          d="M0 0v16l4-4 3 7 2-1-3-7h6L0 0z"
          fill="#ff5c71"
          stroke="#050505"
          strokeWidth="1.5"
          strokeLinejoin="round"
        />
      </svg>
    </div>
  );
}
