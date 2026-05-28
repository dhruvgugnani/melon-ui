"use client";

import React, { useState, useMemo } from "react";
import Link from "next/link";
import { componentsData, ComponentData } from "@/data/components";

// Beautiful custom preview placeholders for the cards (to avoid heavy WebGL contexts)
function CardPreview({ slug, color }: { slug: string; color: string }) {
  // Styles for different components
  if (slug === "cli-terminal") {
    return (
      <div className="relative h-32 w-full overflow-hidden rounded-[4px] border border-white/5 bg-[#080808] p-3 font-mono text-[9px] text-[#7fff5e]/70 flex flex-col justify-between select-none">
        <div className="space-y-1">
          <p className="text-white/20">&gt; npx @melonui-dev/cli init</p>
          <p className="text-white/40">✓ Configuration complete</p>
          <p>&gt; npx @melonui-dev/cli add cli-terminal</p>
        </div>
        <div className="h-1.5 w-1.5 bg-[#7fff5e] animate-pulse" />
      </div>
    );
  }

  if (slug === "burst-button" || slug === "ripple-button") {
    return (
      <div className="relative h-32 w-full overflow-hidden rounded-[4px] border border-white/5 bg-[#080808] flex items-center justify-center select-none">
        <button 
          className="px-4 py-1.5 text-[10px] font-black uppercase text-black rounded-full select-none cursor-default"
          style={{ backgroundColor: color || "#ff5c71" }}
        >
          {slug === "burst-button" ? "Burst" : "Ripple"}
        </button>
      </div>
    );
  }

  if (slug === "magnetic-nav" || slug === "step-trail") {
    return (
      <div className="relative h-32 w-full overflow-hidden rounded-[4px] border border-white/5 bg-[#080808] flex items-center justify-center gap-1.5 select-none">
        {["Index", "Docs", "Vault"].map((n, i) => (
          <span 
            key={n} 
            className="px-2.5 py-1 rounded-full font-mono text-[9px] border border-white/5 bg-white/3 text-white/50"
            style={i === 0 ? { borderColor: color, color: "#fff" } : undefined}
          >
            {n}
          </span>
        ))}
      </div>
    );
  }

  if (slug === "peel-card" || slug === "flip-card" || slug === "holo-ticket" || slug === "solar-carousel") {
    return (
      <div className="relative h-32 w-full overflow-hidden rounded-[4px] border border-white/5 bg-[#080808] flex items-center justify-center p-3 select-none">
        <div 
          className="h-20 w-32 border border-white/10 rounded-[6px] p-2 flex flex-col justify-end relative overflow-hidden"
          style={{ 
            background: slug === "holo-ticket" 
              ? `linear-gradient(135deg, ${color}20, #000 80%)` 
              : "rgba(255,255,255,0.02)" 
          }}
        >
          {slug === "peel-card" && (
            <div className="absolute inset-x-0 top-0 h-12 bg-zinc-900 border-b border-[#ff5c71]/35 flex items-center px-2">
              <span className="h-1 w-6 rounded-full bg-white/20" />
            </div>
          )}
          <span className="font-mono text-[8px] text-white/40">Melon Card</span>
        </div>
      </div>
    );
  }

  if (slug === "grow-input" || slug === "tag-input") {
    return (
      <div className="relative h-32 w-full overflow-hidden rounded-[4px] border border-white/5 bg-[#080808] flex items-center justify-center p-4 select-none">
        <div className="w-full max-w-[150px] space-y-1.5">
          <div className="h-6 w-full rounded border border-white/10 bg-white/3 flex items-center px-2">
            <span className="h-2.5 w-16 bg-white/20 rounded-full" />
          </div>
          <div className="flex gap-1">
            <span className="h-3 w-8 bg-[#ff5c71]/20 border border-[#ff5c71]/40 rounded text-[7px] text-[#ff5c71] flex items-center justify-center">tag</span>
            <span className="h-3 w-8 bg-[#7fff5e]/20 border border-[#7fff5e]/40 rounded text-[7px] text-[#7fff5e] flex items-center justify-center">drop</span>
          </div>
        </div>
      </div>
    );
  }

  // Fallback pattern (abstract vector or particles)
  return (
    <div className="relative h-32 w-full overflow-hidden rounded-[4px] border border-white/5 bg-[#080808] flex items-center justify-center select-none">
      {/* Decorative patterns */}
      <div className="absolute inset-0 opacity-15 flex flex-wrap gap-2 p-3 overflow-hidden justify-center items-center">
        {Array.from({ length: 15 }).map((_, i) => (
          <span 
            key={i} 
            className="h-2 w-2 rounded-full" 
            style={{ 
              backgroundColor: i % 2 === 0 ? color : "#7fff5e",
              opacity: 0.3 + (i % 5) * 0.15
            }} 
          />
        ))}
      </div>
      <span className="font-mono text-[10px] text-white/30 uppercase tracking-widest relative z-10 border border-white/8 bg-black/60 px-3 py-1 rounded">
        {slug.replace("-", " ")}
      </span>
    </div>
  );
}

export default function ComponentsIndexPage() {
  const [searchQuery, setSearchQuery] = useState("");
  const [selectedCategory, setSelectedCategory] = useState("All");

  // Get list of unique categories
  const categories = useMemo(() => {
    const list = new Set<string>();
    componentsData.forEach((c) => list.add(c.category));
    return ["All", ...Array.from(list)];
  }, []);

  // Filter components list
  const filteredComponents = useMemo(() => {
    return componentsData.filter((c) => {
      const matchesSearch =
        c.title.toLowerCase().includes(searchQuery.toLowerCase()) ||
        c.description.toLowerCase().includes(searchQuery.toLowerCase()) ||
        c.tags.some((t) => t.toLowerCase().includes(searchQuery.toLowerCase()));

      const matchesCategory = selectedCategory === "All" || c.category === selectedCategory;

      return matchesSearch && matchesCategory;
    });
  }, [searchQuery, selectedCategory]);

  return (
    <div className="space-y-12">
      {/* Header Banner */}
      <header className="space-y-4">
        <div className="flex items-center gap-2">
          <span className="font-mono text-[9px] text-[#ff5c71] uppercase tracking-[0.25em]">MelonUI</span>
          <span className="h-px w-6 bg-white/10" />
          <span className="font-mono text-[9px] text-white/30 uppercase tracking-[0.25em]">Components</span>
        </div>
        <h1
          className="text-5xl md:text-7xl font-black uppercase tracking-tighter text-white leading-none"
          style={{ fontFamily: "var(--font-londrina-solid)" }}
        >
          Component Index
        </h1>
        <p className="font-mono text-white/50 text-sm max-w-xl leading-relaxed">
          Explore our collection of custom interfaces, timeline nodes, text animations, and dynamic transitions. Search by tag or filter by category.
        </p>
      </header>

      {/* Filter / Search Bar */}
      <div className="space-y-4 border-y border-white/5 py-6">
        <div className="flex flex-col sm:flex-row gap-3 items-stretch sm:items-center">
          {/* Search Box */}
          <div className="relative flex-1">
            <input
              type="text"
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              placeholder="Search components, tags..."
              className="w-full px-4 py-2.5 bg-zinc-950 border border-white/10 rounded-[6px] font-mono text-xs text-white placeholder-white/20 focus:outline-none focus:border-[#7fff5e] focus:ring-1 focus:ring-[#7fff5e]/20 transition-all"
            />
            {searchQuery && (
              <button 
                onClick={() => setSearchQuery("")}
                className="absolute right-3 top-1/2 -translate-y-1/2 font-mono text-[10px] text-white/30 hover:text-white transition-colors cursor-pointer"
              >
                CLEAR
              </button>
            )}
          </div>
        </div>

        {/* Categories Horizontal Scroll List */}
        <div className="flex items-center gap-1.5 overflow-x-auto pb-2 no-scrollbar scroll-smooth">
          {categories.map((cat) => {
            const isActive = selectedCategory === cat;
            return (
              <button
                key={cat}
                onClick={() => setSelectedCategory(cat)}
                className={`px-3.5 py-1.5 rounded-full font-mono text-[10px] uppercase tracking-wider transition-all cursor-pointer whitespace-nowrap active:scale-95 hover:scale-[1.01] ${
                  isActive
                    ? "bg-[#ff5c71] text-black font-black"
                    : "border border-white/10 bg-white/2 text-white/40 hover:text-white/80 hover:bg-white/5"
                }`}
              >
                {cat}
              </button>
            );
          })}
        </div>
      </div>

      {/* Components Grid */}
      {filteredComponents.length > 0 ? (
        <div className="grid grid-cols-1 sm:grid-cols-2 gap-6">
          {filteredComponents.map((comp) => {
            // Determine preview theme color based on category
            const color = comp.category === "Buttons" 
              ? "#ff5c71" 
              : comp.category === "Navigations" 
                ? "#e0f2dc" 
                : comp.category === "Cards" 
                  ? "#7fff5e" 
                  : "#ff8d9a";

            return (
              <Link
                key={comp.id}
                href={`/components/${comp.slug}`}
                className="group relative flex flex-col p-4 rounded-[8px] border border-white/5 bg-zinc-950/20 hover:border-[#ff5c71]/40 hover:bg-zinc-950/50 hover:shadow-[0_8px_24px_rgba(255,92,113,0.03)] transition-all duration-300"
              >
                {/* Visual Preview */}
                <CardPreview slug={comp.slug} color={color} />

                {/* Info Header */}
                <div className="mt-4 flex items-start justify-between gap-4">
                  <div>
                    <h3
                      className="text-2xl font-black uppercase text-[#e5e5e5] group-hover:text-[#ff5c71] transition-colors leading-none"
                      style={{ fontFamily: "var(--font-londrina-solid)", letterSpacing: 0 }}
                    >
                      {comp.title}
                    </h3>
                    <p className="mt-1.5 text-xs text-white/50 leading-relaxed font-sans line-clamp-2">
                      {comp.description}
                    </p>
                  </div>
                  <span className="shrink-0 px-2 py-0.5 rounded border border-white/10 bg-white/3 font-mono text-[9px] uppercase tracking-wider text-white/30">
                    {comp.category}
                  </span>
                </div>

                {/* Footer tags */}
                <div className="mt-4 pt-3 border-t border-white/5 flex flex-wrap gap-1">
                  {comp.tags.slice(0, 3).map((tag) => (
                    <span 
                      key={tag} 
                      className="px-1.5 py-0.5 rounded font-mono text-[8px] uppercase tracking-wider text-white/20 bg-white/1 border border-white/3"
                    >
                      {tag}
                    </span>
                  ))}
                  <span className="ml-auto font-mono text-[10px] text-[#ff5c71] group-hover:translate-x-1 transition-transform duration-200 uppercase tracking-widest flex items-center gap-1 font-bold">
                    View &rarr;
                  </span>
                </div>
              </Link>
            );
          })}
        </div>
      ) : (
        <div className="text-center py-20 border border-dashed border-white/10 rounded-[8px] bg-white/2">
          <p className="font-mono text-sm text-white/30">No components match your search filter.</p>
          <button 
            onClick={() => { setSearchQuery(""); setSelectedCategory("All"); }}
            className="mt-4 px-4 py-2 rounded-full border border-[#ff5c71]/20 bg-[#ff5c71]/5 text-[#ff5c71] font-mono text-xs uppercase tracking-widest hover:bg-[#ff5c71]/10 active:scale-95 transition-all cursor-pointer"
          >
            Reset Filters
          </button>
        </div>
      )}
    </div>
  );
}
