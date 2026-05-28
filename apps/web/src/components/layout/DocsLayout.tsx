"use client";

import React, { useEffect, useRef } from "react";
import { usePathname } from "next/navigation";
import { Navbar } from "@/components/overlay/Navbar";
import { Sidebar } from "@/components/community/Sidebar";
import { ProPoster } from "./ProPoster";
import { Sponsors } from "./Sponsors";
import { TableOfContents } from "./TableOfContents";
import { SpotlightSearch } from "./SpotlightSearch";
import Lenis from "lenis";

interface DocsLayoutProps {
  children: React.ReactNode;
}

export function DocsLayout({ children }: DocsLayoutProps) {
  const pathname = usePathname();
  const scrollWrapperRef = useRef<HTMLElement>(null);
  const scrollContentRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    if (!scrollWrapperRef.current || !scrollContentRef.current) return;

    const lenis = new Lenis({
      wrapper: scrollWrapperRef.current,
      content: scrollContentRef.current,
      lerp: 0.1,
      wheelMultiplier: 1,
    });

    let rafId: number;
    function raf(time: number) {
      lenis.raf(time);
      rafId = requestAnimationFrame(raf);
    }

    rafId = requestAnimationFrame(raf);

    return () => {
      lenis.destroy();
      cancelAnimationFrame(rafId);
    };
  }, []);

  // Determine what to show in the right column
  const isIndexPage = pathname === "/components";

  return (
    <div className="flex h-screen w-full flex-col overflow-hidden bg-[#050505] relative text-white">
      {/* Background Cyber Grid */}
      <div className="absolute inset-0 pointer-events-none z-0" aria-hidden>
        <div 
          className="absolute inset-0 opacity-15"
          style={{
            backgroundImage: `
              linear-gradient(rgba(255,255,255,0.015) 1px, transparent 1px),
              linear-gradient(90deg, rgba(255,255,255,0.015) 1px, transparent 1px)
            `,
            backgroundSize: "24px 24px"
          }}
        />
        {/* Glow blobs */}
        <div className="absolute -left-[10%] top-[20%] h-[500px] w-[500px] rounded-full bg-[#ff5c71]/3 blur-[120px]" />
        <div className="absolute -right-[10%] bottom-[10%] h-[500px] w-[500px] rounded-full bg-[#7fff5e]/3 blur-[120px]" />
      </div>

      {/* Persistent Floating Navbar */}
      <Navbar />
      <SpotlightSearch />

      {/* Main Workspace: Left Sidebar + Middle Content + Right Sidebar */}
      <div className="flex flex-1 w-full overflow-hidden relative z-10">
        
        {/* Left Column: Sidebar */}
        <Sidebar />

        {/* Middle Column: Scrollable Content Area */}
        <main 
          ref={scrollWrapperRef}
          id="docs-content-wrapper"
          className="flex-1 overflow-y-auto overflow-x-hidden pt-24 px-6 md:px-10 lg:px-14 pb-32 no-scrollbar"
        >
          <div ref={scrollContentRef} className="max-w-4xl mx-auto min-h-full">
            {children}
          </div>
        </main>

        {/* Right Column: Table of Contents & Promos */}
        <aside className="w-80 shrink-0 border-l border-white/5 bg-zinc-950/20 backdrop-blur-sm min-h-full flex-col hidden xl:flex relative z-20 pt-24 pb-10 px-5 gap-8 overflow-y-auto no-scrollbar">
          {isIndexPage ? (
            <>
              <ProPoster />
              <Sponsors />
            </>
          ) : (
            <>
              <TableOfContents />
              <div className="border-t border-white/5 pt-6 mt-2">
                <ProPoster />
              </div>
            </>
          )}
        </aside>

      </div>
    </div>
  );
}
