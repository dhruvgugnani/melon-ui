"use client";

import React, { useEffect, useState, useRef, useMemo } from "react";
import { useRouter } from "next/navigation";
import { componentsData } from "@/data/components";
import gsap from "gsap";

interface SearchItem {
  title: string;
  category: string;
  description: string;
  href: string;
}

const STATIC_DOCS: SearchItem[] = [
  { title: "Introduction", category: "Getting Started", description: "Welcome to MelonUI premium component lab.", href: "/docs/introduction" },
  { title: "Installation", category: "Getting Started", description: "Learn how to configure your project and style variables.", href: "/docs/installation" },
  { title: "CLI Tool", category: "Getting Started", description: "Pull components directly into your project via npx command.", href: "/docs/cli" },
];

export function SpotlightSearch() {
  const router = useRouter();
  const [isOpen, setIsOpen] = useState(false);
  const [query, setQuery] = useState("");
  const [selectedIndex, setSelectedIndex] = useState(0);

  const containerRef = useRef<HTMLDivElement>(null);
  const inputRef = useRef<HTMLInputElement>(null);

  // Combine components and docs into a search list
  const searchItems = useMemo(() => {
    const list: SearchItem[] = [...STATIC_DOCS];
    componentsData.forEach((c) => {
      list.push({
        title: c.title,
        category: c.category,
        description: c.description,
        href: `/components/${c.slug}`,
      });
    });
    return list;
  }, []);

  // Filter items based on query
  const filteredItems = useMemo(() => {
    if (!query) return searchItems.slice(0, 5); // Default show first 5 items
    return searchItems.filter(
      (item) =>
        item.title.toLowerCase().includes(query.toLowerCase()) ||
        item.category.toLowerCase().includes(query.toLowerCase()) ||
        item.description.toLowerCase().includes(query.toLowerCase())
    );
  }, [query, searchItems]);

  // Keep index in bounds when results change
  useEffect(() => {
    // eslint-disable-next-line react-hooks/set-state-in-effect
    setSelectedIndex(0);
  }, [filteredItems]);

  // Listen for keybindings and global triggers
  useEffect(() => {
    const handleKeyDown = (e: KeyboardEvent) => {
      // Toggle on Ctrl+K, Cmd+K, or slash "/" (except inside inputs)
      if (
        (e.key === "k" && (e.metaKey || e.ctrlKey)) ||
        (e.key === "/" && document.activeElement?.tagName !== "INPUT" && document.activeElement?.tagName !== "TEXTAREA")
      ) {
        e.preventDefault();
        setIsOpen((prev) => !prev);
      }

      // Close on Esc
      if (e.key === "Escape" && isOpen) {
        setIsOpen(false);
      }
    };

    const handleToggleEvent = () => {
      setIsOpen((prev) => !prev);
    };

    window.addEventListener("keydown", handleKeyDown);
    window.addEventListener("toggle-spotlight-search", handleToggleEvent);

    return () => {
      window.removeEventListener("keydown", handleKeyDown);
      window.removeEventListener("toggle-spotlight-search", handleToggleEvent);
    };
  }, [isOpen]);

  // Handle focusing input on open and open animations
  useEffect(() => {
    if (isOpen) {
      document.body.style.overflow = "hidden";
      setTimeout(() => inputRef.current?.focus(), 50);

      // GSAP entrance
      gsap.fromTo(
        containerRef.current,
        { scale: 0.96, opacity: 0 },
        { scale: 1, opacity: 1, duration: 0.25, ease: "power2.out" }
      );
    } else {
      document.body.style.overflow = "";
      // eslint-disable-next-line react-hooks/set-state-in-effect
      setQuery("");
    }
  }, [isOpen]);

  // Handle navigation inside search results
  const handleKeyDownInside = (e: React.KeyboardEvent) => {
    if (!filteredItems.length) return;

    if (e.key === "ArrowDown") {
      e.preventDefault();
      setSelectedIndex((prev) => (prev + 1) % filteredItems.length);
    } else if (e.key === "ArrowUp") {
      e.preventDefault();
      setSelectedIndex((prev) => (prev - 1 + filteredItems.length) % filteredItems.length);
    } else if (e.key === "Enter") {
      e.preventDefault();
      selectItem(filteredItems[selectedIndex]);
    }
  };

  const selectItem = (item: SearchItem) => {
    setIsOpen(false);
    router.push(item.href);
  };

  if (!isOpen) return null;

  return (
    <div
      role="dialog"
      aria-modal="true"
      aria-labelledby="spotlight-search-title"
      className="fixed inset-0 z-50 bg-black/70 backdrop-blur-md flex items-center justify-center p-4"
      onClick={() => setIsOpen(false)}
    >
      <div
        ref={containerRef}
        className="w-full max-w-xl bg-zinc-950 border border-white/10 rounded-[8px] overflow-hidden flex flex-col shadow-[0_16px_64px_rgba(0,0,0,0.8)]"
        onClick={(e) => e.stopPropagation()}
        onKeyDown={handleKeyDownInside}
      >
        {/* Search Header */}
        <div className="relative border-b border-white/5 flex items-center px-4 py-3">
          <svg
            width="14"
            height="14"
            viewBox="0 0 24 24"
            fill="none"
            stroke="currentColor"
            strokeWidth="3"
            className="text-white/30 mr-3 shrink-0"
          >
            <circle cx="11" cy="11" r="8" />
            <path d="m21 21-4.3-4.3" />
          </svg>
          <input
            ref={inputRef}
            type="text"
            value={query}
            onChange={(e) => setQuery(e.target.value)}
            placeholder="Search components, documentation guides..."
            className="w-full bg-transparent font-mono text-xs text-white placeholder-white/20 focus:outline-none"
            aria-label="Search site content"
          />
          <button
            onClick={() => setIsOpen(false)}
            className="font-mono text-[9px] text-white/30 hover:text-white border border-white/10 px-2 py-0.5 rounded cursor-pointer transition-colors"
          >
            ESC
          </button>
        </div>

        {/* Search Results List */}
        <div className="flex-1 max-h-[320px] overflow-y-auto p-2 space-y-0.5 no-scrollbar">
          {filteredItems.length > 0 ? (
            filteredItems.map((item, index) => {
              const isSelected = selectedIndex === index;
              return (
                <button
                  key={item.href + item.title}
                  onClick={() => selectItem(item)}
                  onMouseEnter={() => setSelectedIndex(index)}
                  className={`w-full text-left p-3 rounded-[6px] transition-all flex items-start gap-4 cursor-pointer ${
                    isSelected ? "bg-white/5 border border-white/10" : "border border-transparent"
                  }`}
                >
                  <div className="flex-1 min-w-0">
                    <div className="flex items-center gap-2">
                      <span
                        className={`text-sm font-bold uppercase transition-colors ${
                          isSelected ? "text-[#7fff5e]" : "text-white/80"
                        }`}
                        style={{ fontFamily: "var(--font-londrina-solid)" }}
                      >
                        {item.title}
                      </span>
                      <span className="px-1.5 py-0.5 rounded border border-white/5 bg-white/2 font-mono text-[8px] uppercase tracking-wider text-white/20 shrink-0">
                        {item.category}
                      </span>
                    </div>
                    <p className="text-[10px] font-mono text-white/40 mt-1 truncate leading-relaxed">
                      {item.description}
                    </p>
                  </div>
                  <span className="shrink-0 text-white/20 group-hover:text-white/50 text-xs self-center">
                    &rarr;
                  </span>
                </button>
              );
            })
          ) : (
            <div className="text-center py-8 font-mono text-xs text-white/30">
              No matching resources found.
            </div>
          )}
        </div>

        {/* Search Help Footer */}
        <div className="border-t border-white/5 px-4 py-2 bg-zinc-950 flex items-center justify-between text-[8px] font-mono text-white/20 uppercase tracking-widest select-none">
          <span>&uarr;&darr; Navigate</span>
          <span>[Enter] Select</span>
          <span>[Esc] Close</span>
        </div>
      </div>
    </div>
  );
}
