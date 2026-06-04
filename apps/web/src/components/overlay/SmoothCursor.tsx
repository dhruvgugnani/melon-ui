"use client";

import { useEffect, useRef, useState } from "react";
import gsap from "gsap";

export function SmoothCursor() {
  const cursorRef = useRef<HTMLDivElement>(null);
  const [cursorType, setCursorType] = useState<"arrow" | "hand">("arrow");

  useEffect(() => {
    const cursor = cursorRef.current;
    if (!cursor) return;

    // Detect cursor capability (pointing device like mouse)
    const hasFinePointer = window.matchMedia("(pointer: fine)").matches;
    if (hasFinePointer) {
      // Inject global CSS rule to hide default cursor everywhere, including on hover
      const style = document.createElement("style");
      style.id = "hide-default-cursor";
      style.innerHTML = `
        *, *::before, *::after {
          cursor: none !important;
        }
      `;
      document.head.appendChild(style);
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
        setCursorType("hand");
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
        setCursorType("arrow");
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
      const style = document.getElementById("hide-default-cursor");
      if (style) style.remove();
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
      {cursorType === "arrow" ? (
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
      ) : (
        <svg
          width="28"
          height="28"
          viewBox="11 2 24 24"
          fill="none"
          xmlns="http://www.w3.org/2000/svg"
          style={{ transformOrigin: "0 0" }}
          className="drop-shadow-[0_4px_12px_rgba(0,0,0,0.6)]"
        >
          <path
            d="M14 9V5a3 3 0 0 0-3-3 3 3 0 0 0-3 3v6.35C7.41 11.13 6.7 11 6 11c-2.2 0-4 1.8-4 4s1.8 4 4 4h7c3.31 0 6-2.69 6-6V9a3 3 0 0 0-3-3 3 3 0 0 0-2 1.05A3 3 0 0 0 14 9z"
            fill="#7fff5e"
            stroke="#050505"
            strokeWidth="1.5"
            strokeLinejoin="round"
          />
        </svg>
      )}
    </div>
  );
}
