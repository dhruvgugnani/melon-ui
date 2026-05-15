"use client";

import Link from "next/link";
import { useEffect, useState } from "react";

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
  "backgrounds",
  "cursors",
  "scroll-effects",
  "gsap-text",
  "gsap-transit",
];

export function Sidebar() {
  const [activeId, setActiveId] = useState("getting-started");

  useEffect(() => {
    // Use IntersectionObserver on the lenis wrapper's content
    const wrapper = document.querySelector("[data-lenis-wrapper]");
    if (!wrapper) return;

    const observer = new IntersectionObserver(
      (entries) => {
        // Find the topmost intersecting entry
        const visible = entries.filter((e) => e.isIntersecting);
        if (visible.length > 0) {
          // Pick the one closest to the top of the viewport
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

  const scrollToSection = (id: string) => {
    const wrapper = document.querySelector("[data-lenis-wrapper]") as HTMLElement | null;
    const el = document.getElementById(id);
    if (!wrapper || !el) return;

    // Get offset relative to the scroll container's content
    const contentEl = wrapper.firstElementChild as HTMLElement | null;
    if (!contentEl) return;

    const elRect = el.getBoundingClientRect();
    const wrapperRect = wrapper.getBoundingClientRect();
    const scrollTop = wrapper.scrollTop;
    const targetY = scrollTop + elRect.top - wrapperRect.top - 100;

    wrapper.scrollTo({ top: targetY, behavior: "smooth" });
  };

  return (
    <aside className="w-60 shrink-0 border-r border-[#ff5c71]/10 bg-[#050505] min-h-full flex-col hidden lg:flex">
      {/* Logo */}
      <div className="p-5 border-b border-[#ff5c71]/10">
        <Link href="/" className="block group">
          <span
            className="font-black text-xl uppercase tracking-tighter text-[#f4f4f4] group-hover:text-[#ff5c71] transition-colors"
            style={{ fontFamily: "var(--font-londrina-solid)" }}
          >
            Melon
          </span>
          <span
            className="font-black text-xl uppercase tracking-tighter text-[#ff5c71]"
            style={{ fontFamily: "var(--font-londrina-solid)" }}
          >
            UI
          </span>
          <span className="ml-2 font-mono text-[10px] text-[#333] uppercase tracking-widest">/docs</span>
        </Link>
      </div>

      {/* Nav tree */}
      <div className="flex-1 overflow-y-auto py-5 flex flex-col gap-5">
        {SECTIONS.map((category) => (
          <div key={category.name} className="px-5">
            <h3 className="font-mono text-[9px] text-[#333] uppercase tracking-[0.25em] mb-2.5 pb-1.5 border-b border-[#111]">
              {category.name}
            </h3>
            <ul className="flex flex-col gap-0.5">
              {category.items.map((item) => {
                const isActive = activeId === item.id;
                return (
                  <li key={item.name}>
                    <button
                      onClick={() => scrollToSection(item.id)}
                      className={`group w-full text-left flex items-center gap-2.5 py-1.5 px-2 rounded-sm font-mono text-[12px] transition-all ${
                        isActive
                          ? "text-[#ff5c71] bg-[#ff5c71]/6"
                          : "text-[#555] hover:text-[#aaa]"
                      }`}
                    >
                      {/* Active indicator dot */}
                      <span
                        className={`w-1 h-1 rounded-full shrink-0 transition-all duration-300 ${
                          isActive
                            ? "bg-[#ff5c71] scale-125"
                            : "bg-[#333] group-hover:bg-[#555]"
                        }`}
                      />
                      {item.name}
                      {/* Active indicator bar on right */}
                      {isActive && (
                        <span className="ml-auto w-0.5 h-3 bg-[#ff5c71] rounded-full" />
                      )}
                    </button>
                  </li>
                );
              })}
            </ul>
          </div>
        ))}
      </div>

      {/* Footer */}
      <div className="p-4 border-t border-[#ff5c71]/10">
        <div className="flex items-center gap-2">
          <span className="w-1.5 h-1.5 rounded-full bg-[#7fff5e] animate-pulse" />
          <span className="font-mono text-[9px] text-[#333] uppercase tracking-widest">All systems online</span>
        </div>
      </div>
    </aside>
  );
}
