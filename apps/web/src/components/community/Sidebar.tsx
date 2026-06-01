"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import { useEffect, useState, useRef } from "react";
import gsap from "gsap";
import { useGSAP } from "@gsap/react";
import { componentsData, getComponentsByCategory } from "@/data/components";

const GETTING_STARTED = [
  { name: "Introduction", slug: "introduction", href: "/docs/introduction" },
  { name: "Installation", slug: "installation", href: "/docs/installation" },
  { name: "CLI Tool", slug: "cli", href: "/docs/cli" },
];

export function Sidebar() {
  const pathname = usePathname();
  const sidebarRef = useRef<HTMLDivElement>(null);
  const [expanded, setExpanded] = useState<Record<string, boolean>>({
    "Getting Started": true,
  });

  const categories = getComponentsByCategory();
  const categoryNames = Object.keys(categories);

  // Determine active item and category from URL
  let activeSlug = "";
  let activeCategory = "";

  if (pathname?.startsWith("/docs/")) {
    activeSlug = pathname.replace("/docs/", "");
    activeCategory = "Getting Started";
  } else if (pathname?.startsWith("/components/")) {
    activeSlug = pathname.replace("/components/", "");
    const matchedComp = componentsData.find((c) => c.slug === activeSlug);
    if (matchedComp) {
      activeCategory = matchedComp.category;
    }
  }

  // Auto-expand category containing active item
  useEffect(() => {
    if (activeCategory) {
      // eslint-disable-next-line react-hooks/set-state-in-effect
      setExpanded((prev) => ({ ...prev, [activeCategory]: true }));
    }
  }, [activeCategory]);

  const toggleCategory = (catName: string) => {
    setExpanded((prev) => ({ ...prev, [catName]: !prev[catName] }));
  };

  // GSAP Entrance Animations
  useGSAP(
    () => {
      gsap.from(".sidebar-section-container", {
        opacity: 0,
        x: -15,
        stagger: 0.05,
        duration: 0.5,
        ease: "power2.out",
      });
    },
    { scope: sidebarRef }
  );

  return (
    <aside
      ref={sidebarRef}
      className="w-64 shrink-0 border-r border-white/5 bg-zinc-950/20 backdrop-blur-sm h-full flex flex-col hidden lg:flex relative z-20 pt-20 overflow-hidden"
    >
      {/* Scrollable nav tree */}
      <div className="flex-1 overflow-y-auto py-6 px-4 flex flex-col gap-6 no-scrollbar">
        {/* Getting Started Category */}
        <div className="sidebar-section-container">
          <button
            onClick={() => toggleCategory("Getting Started")}
            className="w-full flex items-center justify-between py-1 text-left font-mono text-[10px] text-[#ff5c71] uppercase tracking-[0.2em] hover:text-white transition-colors cursor-pointer"
          >
            <span>Getting Started</span>
            <svg
              width="8"
              height="8"
              viewBox="0 0 24 24"
              fill="none"
              stroke="currentColor"
              strokeWidth="3.5"
              className={`transition-transform duration-200 ${
                expanded["Getting Started"] ? "rotate-90" : ""
              }`}
            >
              <path d="m9 18 6-6-6-6" />
            </svg>
          </button>
          
          <ul
            className={`mt-2 flex flex-col gap-0.5 border-l border-white/5 pl-2.5 transition-all duration-300 overflow-hidden ${
              expanded["Getting Started"] ? "max-h-40 opacity-100" : "max-h-0 opacity-0 pointer-events-none"
            }`}
          >
            {GETTING_STARTED.map((item) => {
              const isActive = activeCategory === "Getting Started" && activeSlug === item.slug;
              return (
                <li key={item.slug}>
                  <Link
                    href={item.href}
                    className={`group w-full flex items-center gap-2 py-1.5 px-2 rounded-sm font-mono text-[12px] transition-all duration-200 hover:translate-x-1 ${
                      isActive ? "text-[#7fff5e] font-bold" : "text-white/60 hover:text-white/95"
                    }`}
                  >
                    <span
                      className={`w-1 h-1 rounded-full shrink-0 transition-all duration-200 ${
                        isActive ? "bg-[#7fff5e] scale-125" : "bg-white/10 group-hover:bg-white/30"
                      }`}
                    />
                    {item.name}
                  </Link>
                </li>
              );
            })}
          </ul>
        </div>

        {/* Index Page Link */}
        <div className="sidebar-section-container border-t border-white/5 pt-4">
          <Link
            href="/components"
            className={`group w-full flex items-center gap-2 py-1.5 px-2 rounded-sm font-mono text-[12px] transition-all duration-200 hover:translate-x-1 ${
              pathname === "/components" ? "text-[#7fff5e] font-bold" : "text-white/60 hover:text-white/95"
            }`}
          >
            <svg
              width="12"
              height="12"
              viewBox="0 0 24 24"
              fill="none"
              stroke="currentColor"
              strokeWidth="2.5"
              className="shrink-0"
            >
              <rect x="3" y="3" width="7" height="9" />
              <rect x="14" y="3" width="7" height="5" />
              <rect x="14" y="12" width="7" height="9" />
              <rect x="3" y="16" width="7" height="5" />
            </svg>
            Component Index
          </Link>
        </div>

        {/* Blog Link */}
        <div className="sidebar-section-container border-t border-white/5 pt-4">
          <Link
            href="/blog"
            className={`group w-full flex items-center gap-2 py-1.5 px-2 rounded-sm font-mono text-[12px] transition-all duration-200 hover:translate-x-1 ${
              pathname?.startsWith("/blog") ? "text-[#7fff5e] font-bold" : "text-white/60 hover:text-white/95"
            }`}
          >
            <svg
              width="12"
              height="12"
              viewBox="0 0 24 24"
              fill="none"
              stroke="currentColor"
              strokeWidth="2.5"
              className="shrink-0"
            >
              <path d="M4 19.5v-15A2.5 2.5 0 0 1 6.5 2H20v20H6.5a2.5 2.5 0 0 1-2.5-2.5Z" />
              <path d="M6 6h10M6 10h10" />
            </svg>
            Blog & Guides
          </Link>
        </div>

        {/* Components categories list */}
        {categoryNames.map((catName) => {
          if (catName === "Getting Started") return null; // Already handled above
          const catComponents = categories[catName];
          const isCatExpanded = !!expanded[catName];
          const isCatActive = activeCategory === catName;

          return (
            <div key={catName} className="sidebar-section-container">
              <button
                onClick={() => toggleCategory(catName)}
                className={`w-full flex items-center justify-between py-1 text-left font-mono text-[10px] uppercase tracking-[0.2em] transition-colors cursor-pointer ${
                  isCatActive ? "text-[#ff5c71]" : "text-white/50 hover:text-white/90"
                }`}
              >
                <span>{catName}</span>
                <svg
                  width="8"
                  height="8"
                  viewBox="0 0 24 24"
                  fill="none"
                  stroke="currentColor"
                  strokeWidth="3.5"
                  className={`transition-transform duration-200 ${
                    isCatExpanded ? "rotate-90" : ""
                  }`}
                >
                  <path d="m9 18 6-6-6-6" />
                </svg>
              </button>

              <ul
                className={`mt-2 flex flex-col gap-0.5 border-l border-white/5 pl-2.5 transition-all duration-300 overflow-hidden ${
                  isCatExpanded
                    ? "max-h-[300px] opacity-100"
                    : "max-h-0 opacity-0 pointer-events-none"
                }`}
              >
                {catComponents.map((comp) => {
                  const isActive = activeSlug === comp.slug;
                  return (
                    <li key={comp.slug}>
                      <Link
                        href={`/components/${comp.slug}`}
                        className={`group w-full flex items-center gap-2 py-1.5 px-2 rounded-sm font-mono text-[12px] transition-all duration-200 hover:translate-x-1 ${
                          isActive ? "text-[#7fff5e] font-bold" : "text-white/60 hover:text-white/95"
                        }`}
                      >
                        <span
                          className={`w-1 h-1 rounded-full shrink-0 transition-all duration-200 ${
                            isActive ? "bg-[#7fff5e] scale-125" : "bg-white/10 group-hover:bg-white/30"
                          }`}
                        />
                        {comp.title}
                      </Link>
                    </li>
                  );
                })}
              </ul>
            </div>
          );
        })}
      </div>

      {/* Footer */}
      <div className="p-4 border-t border-white/5 relative z-10 shrink-0">
        <div className="flex items-center gap-2">
          <span className="w-1.5 h-1.5 rounded-full bg-[#7fff5e] animate-pulse" />
          <span className="font-mono text-[9px] text-white/50 uppercase tracking-widest">
            All systems online
          </span>
        </div>
      </div>
    </aside>
  );
}
