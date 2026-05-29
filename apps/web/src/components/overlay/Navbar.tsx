"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import { useEffect, useRef, useState } from "react";
import gsap from "gsap";
import { getComponentsByCategory } from "@/data/components";

const GITHUB_URL = "https://github.com/dhruvgugnani/melon-ui";

const CustomLink = Link;

const GETTING_STARTED = [
  { name: "Introduction", slug: "introduction", href: "/docs/introduction" },
  { name: "Installation", slug: "installation", href: "/docs/installation" },
  { name: "CLI Tool", slug: "cli", href: "/docs/cli" },
];

export function Navbar() {
  const pathname = usePathname();
  const navRef = useRef<HTMLDivElement>(null);
  const drawerRef = useRef<HTMLDivElement>(null);
  const [isOpen, setIsOpen] = useState(false);
  const [expandedCats, setExpandedCats] = useState<Record<string, boolean>>({
    "Getting Started": true,
  });

  const categories = getComponentsByCategory();
  const categoryNames = Object.keys(categories);

  const isDocsOrComponents =
    pathname?.startsWith("/docs") || pathname?.startsWith("/components");

  useEffect(() => {
    gsap.fromTo(
      navRef.current,
      { y: -20, opacity: 0 },
      { y: 0, opacity: 1, duration: 0.6, ease: "power3.out" }
    );
  }, []);

  // Lock body scroll when drawer is open
  useEffect(() => {
    if (isOpen) {
      document.body.style.overflow = "hidden";
    } else {
      document.body.style.overflow = "";
    }
    return () => {
      document.body.style.overflow = "";
    };
  }, [isOpen]);

  // Close drawer on route change
  useEffect(() => {
    setIsOpen(false);
  }, [pathname]);

  // Animate drawer
  useEffect(() => {
    const drawer = drawerRef.current;
    if (!drawer) return;
    if (isOpen) {
      gsap.fromTo(
        drawer,
        { x: "100%", opacity: 0 },
        { x: "0%", opacity: 1, duration: 0.35, ease: "power3.out" }
      );
    } else {
      gsap.to(drawer, {
        x: "100%",
        opacity: 0,
        duration: 0.25,
        ease: "power2.in",
      });
    }
  }, [isOpen]);

  const triggerSearch = () => {
    window.dispatchEvent(new CustomEvent("toggle-spotlight-search"));
    setIsOpen(false);
  };

  const toggleCat = (cat: string) =>
    setExpandedCats((prev) => ({ ...prev, [cat]: !prev[cat] }));

  const navLinks = [
    { name: "Docs", href: "/docs" },
    { name: "Components", href: "/components" },
    { name: "Blog", href: "/blog" },
    { name: "Community", href: "/community" },
  ];

  // Active slug for sidebar highlight
  let activeSlug = "";
  if (pathname?.startsWith("/docs/")) activeSlug = pathname.replace("/docs/", "");
  else if (pathname?.startsWith("/components/")) activeSlug = pathname.replace("/components/", "");

  return (
    <>
      {/* ─── Fixed Navbar Bar ─────────────────────────────────────────── */}
      <div className="fixed left-0 right-0 top-0 z-40 w-full px-4 pt-5 md:px-8">
        <div
          ref={navRef}
          className="mx-auto max-w-6xl flex items-center justify-between px-4 py-2.5 md:px-6 md:py-3 rounded-full border border-white/10 bg-zinc-950/40 backdrop-blur-md shadow-[0_8px_32px_rgba(0,0,0,0.5)] transition-all duration-350"
        >
          {/* Logo */}
          <CustomLink href="/" className="flex items-center gap-2.5 group" aria-label="MelonUI home">
            <img
              src="/logo.png"
              alt="MelonUI Logo"
              className="h-7 w-7 md:h-8 md:w-8 object-contain shrink-0 group-hover:scale-105 transition-transform duration-300"
            />
            <span
              className="text-base md:text-lg font-black uppercase text-white group-hover:text-[#ff5c71] transition-colors"
              style={{ fontFamily: "var(--font-londrina-solid)", letterSpacing: 0 }}
            >
              MelonUI
            </span>
          </CustomLink>

          {/* Desktop Nav Links */}
          <nav className="hidden md:flex items-center gap-1 md:gap-2">
            {navLinks.map((link) => {
              const isActive =
                pathname === link.href ||
                (link.href !== "/" && pathname?.startsWith(link.href));
              return (
                <Link
                  key={link.name}
                  href={link.href}
                  className={`relative px-3 py-1 font-mono text-[11px] md:text-[12px] uppercase tracking-wider transition-all rounded-full hover:scale-105 active:scale-95 ${
                    isActive
                      ? "bg-[#ff5c71]/10 text-[#ff5c71] font-bold border border-[#ff5c71]/20"
                      : "text-white/60 hover:text-white hover:bg-white/5 border border-transparent"
                  }`}
                >
                  {link.name}
                </Link>
              );
            })}
          </nav>

          {/* Right Actions: Search + GitHub + Hamburger */}
          <div className="flex items-center gap-2 text-xs font-bold">
            {/* Search Trigger */}
            <button
              onClick={triggerSearch}
              className="flex items-center justify-between gap-2 px-2.5 py-1.5 md:px-3 rounded-full border border-white/8 bg-white/3 text-white/40 hover:text-white/70 hover:bg-white/7 hover:border-white/12 transition-all text-[10px] md:text-[11px] font-mono text-left w-9 md:w-36 shrink-0 active:scale-95 cursor-pointer"
              aria-label="Open search palette"
            >
              <span className="flex items-center gap-1.5">
                <svg
                  width="12"
                  height="12"
                  viewBox="0 0 24 24"
                  fill="none"
                  stroke="currentColor"
                  strokeWidth="2.5"
                  className="shrink-0"
                >
                  <circle cx="11" cy="11" r="8" />
                  <path d="m21 21-4.3-4.3" />
                </svg>
                <span className="hidden md:inline">Search...</span>
              </span>
              <span className="hidden md:inline-block border border-white/8 bg-zinc-950 px-1 py-0.5 rounded text-[8px] text-white/30">
                ⌘K
              </span>
            </button>

            {/* GitHub — desktop only */}
            <a
              href={GITHUB_URL}
              target="_blank"
              rel="noreferrer"
              className="hidden md:inline-flex rounded-full border border-white/10 bg-white/5 px-3 py-1.5 md:px-4 text-white/70 hover:text-white hover:bg-white/10 hover:border-white/20 hover:scale-105 active:scale-95 transition-all duration-200 text-[10px] md:text-xs tracking-wider"
            >
              GitHub
            </a>

            {/* Hamburger — mobile only */}
            <button
              onClick={() => setIsOpen((o) => !o)}
              className="md:hidden flex flex-col justify-center items-center w-9 h-9 rounded-full border border-white/10 bg-white/5 hover:bg-white/10 transition-all active:scale-95 cursor-pointer gap-[5px]"
              aria-label={isOpen ? "Close menu" : "Open menu"}
              aria-expanded={isOpen}
            >
              <span
                className={`block w-4 h-[1.5px] bg-white transition-all duration-300 origin-center ${
                  isOpen ? "rotate-45 translate-y-[6.5px]" : ""
                }`}
              />
              <span
                className={`block w-4 h-[1.5px] bg-white transition-all duration-300 ${
                  isOpen ? "opacity-0 scale-x-0" : ""
                }`}
              />
              <span
                className={`block w-4 h-[1.5px] bg-white transition-all duration-300 origin-center ${
                  isOpen ? "-rotate-45 -translate-y-[6.5px]" : ""
                }`}
              />
            </button>
          </div>
        </div>
      </div>

      {/* ─── Mobile Drawer Overlay ─────────────────────────────────────── */}
      {/* Backdrop */}
      {isOpen && (
        <div
          className="fixed inset-0 z-30 bg-black/60 backdrop-blur-sm md:hidden"
          onClick={() => setIsOpen(false)}
          aria-hidden
        />
      )}

      {/* Drawer Panel */}
      <div
        ref={drawerRef}
        className="fixed top-0 right-0 z-50 h-full w-[min(85vw,360px)] md:hidden bg-zinc-950/95 border-l border-white/8 backdrop-blur-xl flex flex-col overflow-hidden"
        style={{ transform: "translateX(100%)" }}
        aria-hidden={!isOpen}
      >
        {/* Drawer Header */}
        <div className="flex items-center justify-between px-5 pt-5 pb-4 border-b border-white/5 shrink-0">
          <CustomLink
            href="/"
            className="flex items-center gap-2 group"
            onClick={() => setIsOpen(false)}
          >
            <img src="/logo.png" alt="MelonUI" className="h-6 w-6 object-contain" />
            <span
              className="text-sm font-black uppercase text-white"
              style={{ fontFamily: "var(--font-londrina-solid)" }}
            >
              MelonUI
            </span>
          </CustomLink>
          <button
            onClick={() => setIsOpen(false)}
            className="w-8 h-8 rounded-full border border-white/10 bg-white/5 flex items-center justify-center text-white/50 hover:text-white hover:bg-white/10 transition-all active:scale-90 cursor-pointer"
            aria-label="Close menu"
          >
            <svg width="12" height="12" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5">
              <path d="M18 6 6 18M6 6l12 12" />
            </svg>
          </button>
        </div>

        {/* Drawer Content — scrollable */}
        <div className="flex-1 overflow-y-auto py-4 px-5 flex flex-col gap-1 no-scrollbar">
          {/* Main Nav Links */}
          <div className="pb-4 mb-2 border-b border-white/5">
            {navLinks.map((link) => {
              const isActive =
                pathname === link.href ||
                (link.href !== "/" && pathname?.startsWith(link.href));
              return (
                <CustomLink
                  key={link.name}
                  href={link.href}
                  className={`flex items-center gap-3 px-3 py-3 rounded-lg font-mono text-sm uppercase tracking-wider transition-all ${
                    isActive
                      ? "text-[#ff5c71] font-bold bg-[#ff5c71]/8"
                      : "text-white/60 hover:text-white hover:bg-white/5"
                  }`}
                >
                  {isActive && (
                    <span className="w-1 h-1 rounded-full bg-[#ff5c71] shrink-0" />
                  )}
                  {!isActive && (
                    <span className="w-1 h-1 rounded-full bg-white/10 shrink-0" />
                  )}
                  {link.name}
                </CustomLink>
              );
            })}
            <a
              href={GITHUB_URL}
              target="_blank"
              rel="noreferrer"
              className="flex items-center gap-3 px-3 py-3 rounded-lg font-mono text-sm uppercase tracking-wider text-white/60 hover:text-white hover:bg-white/5 transition-all"
            >
              <span className="w-1 h-1 rounded-full bg-white/10 shrink-0" />
              GitHub
            </a>
          </div>

          {/* Sidebar tree — shown on /docs or /components */}
          {isDocsOrComponents && (
            <div className="flex flex-col gap-1 pt-2">
              <p className="px-3 pb-2 font-mono text-[9px] text-white/25 uppercase tracking-[0.25em]">
                Navigation
              </p>

              {/* Getting Started */}
              <div>
                <button
                  onClick={() => toggleCat("Getting Started")}
                  className="w-full flex items-center justify-between px-3 py-2 font-mono text-[10px] text-[#ff5c71] uppercase tracking-[0.2em] hover:text-white transition-colors cursor-pointer rounded-lg hover:bg-white/5"
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
                      expandedCats["Getting Started"] ? "rotate-90" : ""
                    }`}
                  >
                    <path d="m9 18 6-6-6-6" />
                  </svg>
                </button>
                <div
                  className={`overflow-hidden transition-all duration-300 ${
                    expandedCats["Getting Started"]
                      ? "max-h-40 opacity-100"
                      : "max-h-0 opacity-0 pointer-events-none"
                  }`}
                >
                  <ul className="ml-3 mt-1 flex flex-col gap-0.5 border-l border-white/5 pl-3">
                    {GETTING_STARTED.map((item) => {
                      const isActive = activeSlug === item.slug;
                      return (
                        <li key={item.slug}>
                          <CustomLink
                            href={item.href}
                            className={`flex items-center gap-2 py-2 px-2 rounded-md font-mono text-[12px] transition-all ${
                              isActive
                                ? "text-[#7fff5e] font-bold"
                                : "text-white/55 hover:text-white"
                            }`}
                          >
                            <span
                              className={`w-1 h-1 rounded-full shrink-0 ${
                                isActive ? "bg-[#7fff5e]" : "bg-white/10"
                              }`}
                            />
                            {item.name}
                          </CustomLink>
                        </li>
                      );
                    })}
                  </ul>
                </div>
              </div>

              {/* Component Index Link */}
              <CustomLink
                href="/components"
                className={`flex items-center gap-2 px-3 py-2 rounded-lg font-mono text-[12px] transition-all ${
                  pathname === "/components"
                    ? "text-[#7fff5e] font-bold bg-[#7fff5e]/8"
                    : "text-white/55 hover:text-white hover:bg-white/5"
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
              </CustomLink>

              {/* Blog */}
              <CustomLink
                href="/blog"
                className={`flex items-center gap-2 px-3 py-2 rounded-lg font-mono text-[12px] transition-all ${
                  pathname?.startsWith("/blog")
                    ? "text-[#7fff5e] font-bold bg-[#7fff5e]/8"
                    : "text-white/55 hover:text-white hover:bg-white/5"
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
                Blog &amp; Guides
              </CustomLink>

              {/* Component Categories */}
              {categoryNames
                .filter((c) => c !== "Getting Started")
                .map((catName) => {
                  const catComponents = categories[catName];
                  const isExpanded = !!expandedCats[catName];
                  return (
                    <div key={catName}>
                      <button
                         onClick={() => toggleCat(catName)}
                        className="w-full flex items-center justify-between px-3 py-2 font-mono text-[10px] text-white/45 uppercase tracking-[0.2em] hover:text-white transition-colors cursor-pointer rounded-lg hover:bg-white/5"
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
                            isExpanded ? "rotate-90" : ""
                          }`}
                        >
                          <path d="m9 18 6-6-6-6" />
                        </svg>
                      </button>
                      <div
                        className={`overflow-hidden transition-all duration-300 ${
                          isExpanded
                            ? "max-h-[300px] opacity-100"
                            : "max-h-0 opacity-0 pointer-events-none"
                        }`}
                      >
                        <ul className="ml-3 mt-1 flex flex-col gap-0.5 border-l border-white/5 pl-3">
                          {catComponents.map((comp) => {
                            const isActive = activeSlug === comp.slug;
                            return (
                              <li key={comp.slug}>
                                <CustomLink
                                  href={`/components/${comp.slug}`}
                                  className={`flex items-center gap-2 py-2 px-2 rounded-md font-mono text-[12px] transition-all ${
                                    isActive
                                      ? "text-[#7fff5e] font-bold"
                                      : "text-white/55 hover:text-white"
                                  }`}
                                >
                                  <span
                                    className={`w-1 h-1 rounded-full shrink-0 ${
                                      isActive ? "bg-[#7fff5e]" : "bg-white/10"
                                    }`}
                                  />
                                  {comp.title}
                                </CustomLink>
                              </li>
                            );
                          })}
                        </ul>
                      </div>
                    </div>
                  );
                })}
            </div>
          )}
        </div>

        {/* Drawer Footer */}
        <div className="px-5 py-4 border-t border-white/5 shrink-0">
          <div className="flex items-center gap-2">
            <span className="w-1.5 h-1.5 rounded-full bg-[#7fff5e] animate-pulse" />
            <span className="font-mono text-[9px] text-white/40 uppercase tracking-widest">
              All systems online
            </span>
          </div>
        </div>
      </div>
    </>
  );
}
