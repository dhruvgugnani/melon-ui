"use client";

import React, { useEffect, useState } from "react";

interface HeadingItem {
  id: string;
  text: string;
}

export function TableOfContents() {
  const [headings, setHeadings] = useState<HeadingItem[]>([]);
  const [activeId, setActiveId] = useState<string>("");

  useEffect(() => {
    // Select all h2 tags with an id inside the <article> or <main>
    const elements = Array.from(document.querySelectorAll("article h2, main h2"))
      .filter((el) => el.id)
      .map((el) => ({
        id: el.id,
        text: el.textContent || "",
      }));

    // eslint-disable-next-line react-hooks/set-state-in-effect
    setHeadings(elements);

    if (elements.length === 0) return;

    // Scroll spy intersection observer
    const observer = new IntersectionObserver(
      (entries) => {
        const visible = entries.filter((e) => e.isIntersecting);
        if (visible.length > 0) {
          // Highlight the topmost visible heading
          const topmost = visible.reduce((prev, curr) =>
            prev.boundingClientRect.top < curr.boundingClientRect.top ? prev : curr
          );
          setActiveId(topmost.target.id);
        }
      },
      {
        rootMargin: "-10% 0px -75% 0px",
        threshold: 0,
      }
    );

    elements.forEach((heading) => {
      const el = document.getElementById(heading.id);
      if (el) observer.observe(el);
    });

    return () => observer.disconnect();
  }, []);

  const handleClick = (id: string) => {
    const el = document.getElementById(id);
    if (el) {
      el.scrollIntoView({ behavior: "smooth", block: "start" });
    }
  };

  if (headings.length === 0) {
    return null;
  }

  return (
    <div className="space-y-4">
      <div className="border-b border-white/5 pb-2">
        <h5
          className="text-xs font-black uppercase text-white/50 tracking-wider"
          style={{ fontFamily: "var(--font-outfit)" }}
        >
          On This Page
        </h5>
      </div>

      <nav aria-label="Table of contents index" className="flex flex-col gap-0.5 relative pl-2.5 border-l border-white/5">
        {headings.map((heading) => {
          const isActive = activeId === heading.id;
          return (
            <button
              key={heading.id}
              onClick={() => handleClick(heading.id)}
              className={`text-left py-1.5 font-mono text-[11px] uppercase tracking-wider transition-all duration-200 hover:translate-x-0.5 cursor-pointer flex items-center gap-2 ${
                isActive ? "text-[#7fff5e] font-bold" : "text-white/40 hover:text-white/70"
              }`}
            >
              <span
                className={`w-1 h-1 rounded-full shrink-0 transition-all duration-200 ${
                  isActive ? "bg-[#7fff5e] scale-125" : "bg-transparent"
                }`}
              />
              {heading.text}
            </button>
          );
        })}
      </nav>
    </div>
  );
}
