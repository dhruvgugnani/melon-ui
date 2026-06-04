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
          viewBox="0 0 16 16"
          fill="none"
          xmlns="http://www.w3.org/2000/svg"
          style={{ transformOrigin: "0 0", transform: "translate(-42.2%, -10.9%)" }}
          className="drop-shadow-[0_4px_12px_rgba(0,0,0,0.6)]"
        >
          <path
            d="M8.5 1.75v2.716l.047-.002c.312-.012.742-.016 1.051.046.28.056.543.18.738.288.273.152.456.385.56.642l.132-.012c.312-.024.794-.038 1.158.108.37.148.689.487.88.716q.113.137.195.248h.582a2 2 0 0 1 1.99 2.199l-.272 2.715a3.5 3.5 0 0 1-.444 1.389l-1.395 2.441A1.5 1.5 0 0 1 12.42 16H6.118a1.5 1.5 0 0 1-1.342-.83l-1.215-2.43L1.07 8.589a1.517 1.517 0 0 1 2.373-1.852L5 8.293V1.75a1.75 1.75 0 0 1 3.5 0"
            fill="#7fff5e"
            stroke="#050505"
            strokeWidth="0.8"
            strokeLinejoin="round"
          />
        </svg>
      )}
    </div>
  );
}
