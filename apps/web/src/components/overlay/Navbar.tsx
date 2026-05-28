"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import { useEffect, useRef } from "react";
import gsap from "gsap";

const GITHUB_URL = "https://github.com/dhruvgugnani/melon-ui";

export function Navbar() {
  const pathname = usePathname();
  const navRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    // Smooth entry animation for the navbar
    gsap.fromTo(
      navRef.current,
      { y: -20, opacity: 0 },
      { y: 0, opacity: 1, duration: 0.6, ease: "power3.out" }
    );
  }, []);

  const triggerSearch = () => {
    window.dispatchEvent(new CustomEvent("toggle-spotlight-search"));
  };

  const navLinks = [
    { name: "Docs", href: "/docs" },
    { name: "Components", href: "/components" },
    { name: "Blog", href: "/blog" },
    { name: "Community", href: "/community" },
  ];

  return (
    <div className="fixed left-0 right-0 top-0 z-40 w-full px-4 pt-5 md:px-8">
      <div
        ref={navRef}
        className="mx-auto max-w-6xl flex items-center justify-between px-4 py-2.5 md:px-6 md:py-3 rounded-full border border-white/10 bg-zinc-950/40 backdrop-blur-md shadow-[0_8px_32px_rgba(0,0,0,0.5)] transition-all duration-350"
      >
        {/* Logo */}
        <Link href="/" className="flex items-center gap-2.5 group" aria-label="MelonUI home">
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
        </Link>

        {/* Center Nav Links */}
        <nav className="flex items-center gap-1 md:gap-2">
          {navLinks.map((link) => {
            // Check if active (direct match or prefix)
            const isActive =
              pathname === link.href || (link.href !== "/" && pathname?.startsWith(link.href));
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

        {/* Right Actions: Search + GitHub */}
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

          {/* GitHub Repo Button */}
          <a
            href={GITHUB_URL}
            target="_blank"
            rel="noreferrer"
            className="rounded-full border border-white/10 bg-white/5 px-3 py-1.5 md:px-4 text-white/70 hover:text-white hover:bg-white/10 hover:border-white/20 hover:scale-105 active:scale-95 transition-all duration-200 text-[10px] md:text-xs tracking-wider"
          >
            GitHub
          </a>
        </div>
      </div>
    </div>
  );
}
