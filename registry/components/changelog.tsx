"use client";

import { useState, useRef } from "react";
import gsap from "gsap";

const VERSIONS = [
  { v: "v0.1.0", date: "2025-01-12", note: "Initial release" },
  { v: "v0.2.0", date: "2025-02-28", note: "Added GSAP support" },
  { v: "v0.3.0", date: "2025-04-10", note: "Three.js integration" },
  { v: "v1.0.0", date: "2025-05-15", note: "Stable release 🍉" },
];

export interface ChangelogVersion {
  v: string;
  date: string;
  note: string;
}

export interface ChangelogCardProps {
  versions?: ChangelogVersion[];
  title?: string;
}

export function ChangelogCard({
  versions = VERSIONS,
  title = "Changelog"
}: ChangelogCardProps) {
  const [open, setOpen] = useState(false);
  const listRef = useRef<HTMLDivElement>(null);

  const toggle = () => {
    setOpen((prev) => {
      const next = !prev;
      if (listRef.current) {
        gsap.to(listRef.current, {
          height: next ? "auto" : 0,
          opacity: next ? 1 : 0,
          duration: 0.45,
          ease: next ? "power3.out" : "power2.in",
        });
      }
      return next;
    });
  };

  return (
    <div className="w-full max-w-sm border border-[#1a1a1a] bg-[#0a0a0a]">
      <button
        onClick={toggle}
        className="w-full flex items-center justify-between px-5 py-4 group"
      >
        <span className="font-mono text-xs uppercase tracking-widest text-[#555] group-hover:text-[#aaa] transition-colors">
          {title}
        </span>
        <span
          className="font-black text-[#ff5c71] text-xl transition-transform duration-300"
          style={{ display: "inline-block", transform: open ? "rotate(45deg)" : "rotate(0)" }}
        >
          +
        </span>
      </button>

      <div ref={listRef} style={{ height: 0, opacity: 0, overflow: "hidden" }}>
        <div className="border-t border-[#111] divide-y divide-[#111]">
          {versions.map((ver) => (
            <div key={ver.v} className="px-5 py-3 flex items-center justify-between group/row hover:bg-[#0f0f0f] transition-colors">
              <div>
                <span className="font-mono text-xs text-[#ff5c71] font-bold">{ver.v}</span>
                <p className="font-mono text-[10px] text-[#444] mt-0.5">{ver.note}</p>
              </div>
              <span className="font-mono text-[9px] text-[#333] group-hover/row:text-[#555] transition-colors">{ver.date}</span>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
}
