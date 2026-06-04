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
          style={{ transformOrigin: "0 0", transform: "translate(-42.2%, -6.25%)" }}
          className="drop-shadow-[0_4px_12px_rgba(0,0,0,0.6)]"
        >
          <path
            d="M6.75 1a.75.75 0 0 1 .75.75V8a.5.5 0 0 0 1 0V5.467l.086-.004c.317-.012.637-.008.816.027.134.027.294.096.448.182.077.042.15.147.15.314V8a.5.5 0 0 0 1 0V6.435l.106-.01c.316-.024.584-.01.708.04.118.046.3.207.486.43.081.096.15.19.2.259V8.5a.5.5 0 1 0 1 0v-1h.342a1 1 0 0 1 .995 1.1l-.271 2.715a2.5 2.5 0 0 1-.317.991l-1.395 2.442a.5.5 0 0 1-.434.252H6.118a.5.5 0 0 1-.447-.276l-1.232-2.465-2.512-4.185a.517.517 0 0 1 .809-.631l2.41 2.41A.5.5 0 0 0 6 9.5V1.75A.75.75 0 0 1 6.75 1M8.5 4.466V1.75a1.75 1.75 0 1 0-3.5 0v6.543L3.443 6.736A1.517 1.517 0 0 0 1.07 8.588l2.491 4.153 1.215 2.43A1.5 1.5 0 0 0 6.118 16h6.302a1.5 1.5 0 0 0 1.302-.756l1.395-2.441a3.5 3.5 0 0 0 .444-1.389l.271-2.715a2 2 0 0 0-1.99-2.199h-.581a5 5 0 0 0-.195-.248c-.191-.229-.51-.568-.88-.716-.364-.146-.846-.132-1.158-.108l-.132.012a1.26 1.26 0 0 0-.56-.642 2.6 2.6 0 0 0-.738-.288c-.31-.062-.739-.058-1.05-.046zm2.094 2.025"
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
