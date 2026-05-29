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

export interface ChangelogCardProps extends React.ComponentPropsWithoutRef<"div"> {
  versions?: ChangelogVersion[];
  title?: string;
  borderColor?: string;
  titleColor?: string;
  plusColor?: string;
  versionColor?: string;
  noteColor?: string;
  dateColor?: string;
  rowHoverBg?: string;
}

export function ChangelogCard({
  versions = VERSIONS,
  title = "Changelog",
  borderColor = "#1a1a1a",
  titleColor = "#555",
  plusColor = "#ff5c71",
  versionColor = "#ff5c71",
  noteColor = "#444",
  dateColor = "#333",
  rowHoverBg = "rgba(255, 255, 255, 0.03)",
  className = "",
  style,
  ...props
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

  const handleKeyDown = (e: React.KeyboardEvent) => {
    if (e.key === "Enter" || e.key === " ") {
      e.preventDefault();
      toggle();
    }
  };

  return (
    <div
      className={`w-full max-w-sm border ${className}`}
      style={{
        borderColor: borderColor,
        backgroundColor: "transparent",
        ...style
      }}
      {...props}
    >
      <button
        onClick={toggle}
        onKeyDown={handleKeyDown}
        className="w-full flex items-center justify-between px-5 py-4 group focus-visible:outline-none focus-visible:ring-1 focus-visible:ring-[#ff5c71]"
      >
        <span className="font-mono text-xs uppercase tracking-widest transition-colors group-hover:text-[#aaa]" style={{ color: titleColor }}>
          {title}
        </span>
        <span
          className="font-black text-xl transition-transform duration-300"
          style={{
            display: "inline-block",
            transform: open ? "rotate(45deg)" : "rotate(0)",
            color: plusColor
          }}
        >
          +
        </span>
      </button>

      <div ref={listRef} style={{ height: 0, opacity: 0, overflow: "hidden" }}>
        <div className="border-t divide-y" style={{ borderColor: borderColor, color: borderColor }}>
          {versions.map((ver) => (
            <div
              key={ver.v}
              className="px-5 py-3 flex items-center justify-between group/row transition-colors"
              style={{ borderBottomColor: borderColor }}
              onMouseEnter={(e) => {
                e.currentTarget.style.backgroundColor = rowHoverBg;
              }}
              onMouseLeave={(e) => {
                e.currentTarget.style.backgroundColor = "transparent";
              }}
            >
              <div>
                <span className="font-mono text-xs font-bold" style={{ color: versionColor }}>{ver.v}</span>
                <p className="font-mono text-[10px] mt-0.5" style={{ color: noteColor }}>{ver.note}</p>
              </div>
              <span className="font-mono text-[9px] transition-colors" style={{ color: dateColor }}>
                {ver.date}
              </span>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
}
