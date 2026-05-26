"use client";

import Link from "next/link";
import { useEffect, useState, useRef } from "react";
import gsap from "gsap";
import { useGSAP } from "@gsap/react";

const SECTIONS = [
  {
    name: "Getting Started",
    items: [
      { name: "Installation", id: "getting-started" },
      { name: "CLI Tool", id: "getting-started" },
    ],
  },
  {
    name: "Components",
    items: [
      { name: "Buttons", id: "buttons" },
      { name: "Navigations", id: "navigations" },
      { name: "Cards", id: "cards" },
      { name: "Inputs", id: "inputs" },
      { name: "Widgets", id: "widgets" },
    ],
  },
  {
    name: "3D & WebGL",
    items: [
      { name: "Backgrounds", id: "backgrounds" },
      { name: "Models", id: "backgrounds" },
      { name: "Shaders", id: "backgrounds" },
    ],
  },
  {
    name: "Interactions",
    items: [
      { name: "Cursors", id: "cursors" },
      { name: "Scroll Effects", id: "scroll-effects" },
      { name: "GSAP Text", id: "gsap-text" },
      { name: "Page Transitions", id: "gsap-transit" },
    ],
  },
];

// All unique section IDs in scroll order
const SECTION_IDS = [
  "getting-started",
  "buttons",
  "navigations",
  "cards",
  "inputs",
  "widgets",
  "backgrounds",
  "cursors",
  "scroll-effects",
  "gsap-text",
  "gsap-transit",
];

export function Sidebar() {
  const [activeId, setActiveId] = useState("getting-started");
  const [indicatorStyle, setIndicatorStyle] = useState<React.CSSProperties>({
    opacity: 0,
    transform: "translateY(0px)",
    height: "0px",
    width: "0px",
    left: "0px",
  });

  const sidebarRef = useRef<HTMLDivElement>(null);

  // GSAP Entrance Animations
  useGSAP(() => {
    gsap.from(".sidebar-logo", {
      opacity: 0,
      y: -10,
      duration: 0.5,
      ease: "power2.out",
    });

    gsap.from(".sidebar-section", {
      opacity: 0,
      x: -20,
      stagger: 0.08,
      duration: 0.6,
      ease: "power2.out",
      delay: 0.1,
    });
  }, { scope: sidebarRef });

  useEffect(() => {
    // Use IntersectionObserver on the lenis wrapper's content
    const wrapper = document.querySelector("[data-lenis-wrapper]");
    if (!wrapper) return;

    const observer = new IntersectionObserver(
      (entries) => {
        const visible = entries.filter((e) => e.isIntersecting);
        if (visible.length > 0) {
          const topmost = visible.reduce((prev, curr) =>
            prev.boundingClientRect.top < curr.boundingClientRect.top ? prev : curr
          );
          setActiveId(topmost.target.id);
        }
      },
      {
        root: wrapper,
        rootMargin: "-20% 0px -60% 0px",
        threshold: 0,
      }
    );

    SECTION_IDS.forEach((id) => {
      const el = document.getElementById(id);
      if (el) observer.observe(el);
    });

    return () => observer.disconnect();
  }, []);

  // Sliding Indicator update
  useEffect(() => {
    const activeBtn = document.querySelector(`[data-section-id="${activeId}"]`) as HTMLElement | null;
    const scrollContainer = document.querySelector("[data-sidebar-scroll]") as HTMLElement | null;

    if (activeBtn && scrollContainer) {
      const top = activeBtn.offsetTop;
      const height = activeBtn.offsetHeight;
      const width = activeBtn.offsetWidth;
      const left = activeBtn.offsetLeft;

      // eslint-disable-next-line react-hooks/set-state-in-effect
      setIndicatorStyle({
        opacity: 1,
        transform: `translateY(${top}px)`,
        left: `${left}px`,
        width: `${width}px`,
        height: `${height}px`,
      });
    } else {
      setIndicatorStyle((prev) => ({ ...prev, opacity: 0 }));
    }
  }, [activeId]);

  const scrollToSection = (id: string) => {
    const wrapper = document.querySelector("[data-lenis-wrapper]") as HTMLElement | null;
    const el = document.getElementById(id);
    if (!wrapper || !el) return;

    const contentEl = wrapper.firstElementChild as HTMLElement | null;
    if (!contentEl) return;

    const elRect = el.getBoundingClientRect();
    const wrapperRect = wrapper.getBoundingClientRect();
    const scrollTop = wrapper.scrollTop;
    const targetY = scrollTop + elRect.top - wrapperRect.top - 100;

    wrapper.scrollTo({ top: targetY, behavior: "smooth" });
  };

  return (
    <aside ref={sidebarRef} className="w-60 shrink-0 border-r border-[#ff5c71]/10 bg-[#050505] min-h-full flex-col hidden lg:flex relative z-20">
      {/* Logo */}
      <div className="p-5 border-b border-[#ff5c71]/10 sidebar-logo">
        <Link href="/" className="flex items-center gap-3 group" aria-label="MelonUI home">
          <span className="relative h-8 w-8 overflow-hidden rounded-full border border-white/15 bg-[#ff5c71] shrink-0 group-hover:scale-105 transition-transform duration-300">
            <span className="absolute inset-x-0.5 bottom-0.5 h-4.5 rounded-b-full bg-[#203f18]" />
            <span className="absolute inset-x-1 bottom-1 h-3.5 rounded-b-full bg-[#e0f2dc]" />
            <span className="absolute inset-x-2 bottom-2 h-2 rounded-b-full bg-[#ff5c71]" />
            <span className="absolute bottom-2 left-1/2 h-0.5 w-0.5 -translate-x-1/2 rounded-full bg-black" />
          </span>
          <span className="text-xl font-black uppercase text-white group-hover:text-[#ff5c71] transition-colors" style={{ fontFamily: "var(--font-londrina-solid)", letterSpacing: 0 }}>
            MelonUI
          </span>
          <span className="font-mono text-[9px] text-[#333] uppercase tracking-widest shrink-0">/store</span>
        </Link>
      </div>

      {/* Nav tree */}
      <div 
        data-sidebar-scroll
        className="flex-1 overflow-y-auto py-5 flex flex-col gap-5 relative"
      >
        {/* Dynamic Sliding Pill Indicator */}
        <div
          style={{
            ...indicatorStyle,
            transition: "transform 0.3s cubic-bezier(0.16, 1, 0.3, 1), width 0.3s cubic-bezier(0.16, 1, 0.3, 1), height 0.3s cubic-bezier(0.16, 1, 0.3, 1), opacity 0.2s ease",
          }}
          className="absolute bg-[#ff5c71]/12 border-l-2 border-[#ff5c71] rounded-r-sm pointer-events-none z-0"
        />

        {SECTIONS.map((category) => (
          <div key={category.name} className="px-5 sidebar-section">
            <h3 className="font-mono text-[9px] text-[#333] uppercase tracking-[0.25em] mb-2.5 pb-1.5 border-b border-[#111]">
              {category.name}
            </h3>
            <ul className="flex flex-col gap-0.5">
              {category.items.map((item) => {
                const isActive = activeId === item.id;
                return (
                  <li key={item.name}>
                    <button
                      data-section-id={item.id}
                      onClick={() => scrollToSection(item.id)}
                      className={`group w-full text-left flex items-center gap-2.5 py-1.5 px-2 rounded-sm font-mono text-[12px] transition-all duration-300 relative z-10 hover:translate-x-1 ${
                        isActive
                          ? "text-[#ff5c71] font-bold"
                          : "text-[#555] hover:text-[#aaa]"
                      }`}
                    >
                      {/* Active indicator dot */}
                      <span
                        className={`w-1.5 h-1.5 rounded-full shrink-0 transition-all duration-300 ${
                          isActive
                            ? "bg-[#ff5c71] scale-125"
                            : "bg-[#333] group-hover:bg-[#555] group-hover:scale-110"
                        }`}
                      />
                      {item.name}
                    </button>
                  </li>
                );
              })}
            </ul>
          </div>
        ))}
      </div>

      {/* Footer */}
      <div className="p-4 border-t border-[#ff5c71]/10 relative z-10">
        <div className="flex items-center gap-2">
          <span className="w-1.5 h-1.5 rounded-full bg-[#7fff5e] animate-pulse" />
          <span className="font-mono text-[9px] text-[#333] uppercase tracking-widest">All systems online</span>
        </div>
      </div>
    </aside>
  );
}
