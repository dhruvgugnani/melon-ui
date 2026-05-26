"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import { componentsData } from "@/data/components";

// Category structure mapping
const CATEGORIES = [
  { name: "Getting Started", id: "getting-started" },
  { name: "Buttons", id: "buttons" },
  { name: "Navigations", id: "navigations" },
  { name: "Cards", id: "cards" },
  { name: "Inputs", id: "inputs" },
  { name: "3D Backgrounds", id: "backgrounds" },
  { name: "Cursors", id: "cursors" },
  { name: "Scroll Effects", id: "scroll-effects" },
  { name: "GSAP Text", id: "gsap-text" },
  { name: "Page Transitions", id: "gsap-transit" }
];

export function Sidebar() {
  const pathname = usePathname();

  // Group components dynamically by category
  const getSections = () => {
    const sections = [
      {
        name: "Getting Started",
        items: [
          { name: "Overview / Store", href: "/community" }
        ]
      }
    ];

    CATEGORIES.forEach((cat) => {
      // Find components matching this category
      const matched = componentsData.filter(
        (c) => c.category.toLowerCase() === cat.name.toLowerCase()
      );

      if (matched.length > 0) {
        sections.push({
          name: cat.name,
          items: matched.map((c) => ({
            name: c.title,
            href: `/community/${c.slug}`
          }))
        });
      }
    });

    return sections;
  };

  const sections = getSections();

  return (
    <aside className="w-64 shrink-0 border-r border-[#ff5c71]/10 bg-[#050505] min-h-full flex flex-col hidden lg:flex">
      {/* Brand Header */}
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

      {/* Docs Tree Navigation */}
      <div className="flex-1 overflow-y-auto py-5 flex flex-col gap-5 scrollbar-thin">
        {sections.map((section) => (
          <div key={section.name} className="px-5">
            <h3 className="font-mono text-[9px] text-[#333] uppercase tracking-[0.25em] mb-2.5 pb-1.5 border-b border-[#111]">
              {section.name}
            </h3>
            <ul className="flex flex-col gap-0.5">
              {section.items.map((item) => {
                const isActive = pathname === item.href;
                return (
                  <li key={item.href}>
                    <Link
                      href={item.href}
                      className={`group w-full text-left flex items-center gap-2.5 py-1.5 px-2 rounded-sm font-mono text-[11px] transition-all ${
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
                    </Link>
                  </li>
                );
              })}
            </ul>
          </div>
        ))}
      </div>

      {/* Footer */}
      <div className="p-4 border-t border-[#ff5c71]/10 bg-[#070709]">
        <div className="flex items-center gap-2">
          <span className="w-1.5 h-1.5 rounded-full bg-[#7fff5e] animate-pulse" />
          <span className="font-mono text-[9px] text-[#333] uppercase tracking-widest">All systems online</span>
        </div>
      </div>
    </aside>
  );
}
