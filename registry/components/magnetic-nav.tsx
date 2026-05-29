"use client";

import { useRef, useCallback } from "react";
import gsap from "gsap";

export interface NavItem {
  label: string;
  href?: string;
}

export interface MagneticNavProps {
  items?: (string | NavItem)[];
}

const DEFAULT_ITEMS = ["Home", "About", "Work", "Contact"];

export function MagneticNav({ items = DEFAULT_ITEMS }: MagneticNavProps) {
  const itemRefs = useRef<(HTMLAnchorElement | null)[]>([]);

  const handleMouseMove = useCallback((e: React.MouseEvent, i: number) => {
    const el = itemRefs.current[i];
    if (!el) return;
    const prefersReducedMotion = window.matchMedia("(prefers-reduced-motion: reduce)").matches;
    if (prefersReducedMotion) return;

    const rect = el.getBoundingClientRect();
    const cx = rect.left + rect.width / 2;
    const cy = rect.top + rect.height / 2;
    const dx = e.clientX - cx;
    const dy = e.clientY - cy;
    gsap.to(el, {
      x: dx * 0.35,
      y: dy * 0.35,
      duration: 0.4,
      ease: "power3.out",
    });
  }, []);

  const handleMouseLeave = useCallback((i: number) => {
    const el = itemRefs.current[i];
    if (!el) return;
    const prefersReducedMotion = window.matchMedia("(prefers-reduced-motion: reduce)").matches;
    if (prefersReducedMotion) {
      gsap.set(el, { x: 0, y: 0 });
      return;
    }
    gsap.to(el, {
      x: 0,
      y: 0,
      duration: 0.6,
      ease: "elastic.out(1,0.4)",
    });
  }, []);

  return (
    <nav className="flex items-center gap-10">
      {items.map((item, i) => {
        const label = typeof item === "string" ? item : item.label;
        const href = typeof item === "string" ? "#" : (item.href || "#");

        return (
          <a
            key={i}
            ref={(el) => { itemRefs.current[i] = el; }}
            href={href}
            onMouseMove={(e) => handleMouseMove(e, i)}
            onMouseLeave={() => handleMouseLeave(i)}
            className="group relative font-black uppercase text-2xl tracking-tighter text-[#f4f4f4] select-none cursor-pointer outline-none focus-visible:text-[#ff5c71] transition-colors duration-200"
            style={{ fontFamily: "var(--font-anton)" }}
          >
            {/* Melon-scan underline */}
            <span
              className="absolute -bottom-1 left-0 h-0.5 bg-[#ff5c71] w-0 group-hover:w-full group-focus-visible:w-full transition-all duration-300 ease-out"
            />
            {/* Leaf dot */}
            <span className="absolute -top-1 -right-1 w-1.5 h-1.5 bg-[#7fff5e] rounded-full opacity-0 group-hover:opacity-100 group-focus-visible:opacity-100 transition-opacity duration-200" />
            {label}
          </a>
        );
      })}
    </nav>
  );
}
