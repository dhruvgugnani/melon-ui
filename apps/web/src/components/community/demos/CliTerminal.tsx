"use client";

import { useEffect, useRef } from "react";
import gsap from "gsap";

const LINES = [
  { text: "$ npx @melonui/cli init", delay: 0 },
  { text: "✔ Detected Next.js 15 project", delay: 1.2 },
  { text: "✔ Installing dependencies...", delay: 2.0 },
  { text: "✔ Copying component registry...", delay: 3.0 },
  { text: "🍉 MelonUI ready. Start building.", delay: 4.2 },
];

export function CliTerminal() {
  const containerRef = useRef<HTMLDivElement>(null);
  const cursorRef = useRef<HTMLSpanElement>(null);

  useEffect(() => {
    if (!containerRef.current) return;

    const lines = containerRef.current.querySelectorAll<HTMLDivElement>(".cli-line");
    const cursor = cursorRef.current;

    const ctx = gsap.context(() => {
      // Start all lines invisible
      gsap.set(lines, { opacity: 0, y: 8 });
      if (cursor) gsap.set(cursor, { opacity: 1 });

      const tl = gsap.timeline({ repeat: -1, repeatDelay: 2 });

      LINES.forEach((line, i) => {
        tl.to(lines[i], {
          opacity: 1,
          y: 0,
          duration: 0.3,
          ease: "power2.out",
        }, line.delay);
      });

      // Blink cursor
      if (cursor) {
        gsap.to(cursor, {
          opacity: 0,
          duration: 0.5,
          repeat: -1,
          yoyo: true,
          ease: "steps(1)",
        });
      }

      // Reset all lines before repeat
      tl.to(lines, {
        opacity: 0,
        y: 8,
        duration: 0.4,
        stagger: 0.05,
        ease: "power2.in",
      }, "+=1.5");
    }, containerRef);

    return () => ctx.revert();
  }, []);

  return (
    <div
      ref={containerRef}
      className="w-full max-w-2xl bg-[#060606] border border-[#1e1e1e] font-mono text-sm overflow-hidden"
      style={{ boxShadow: "0 0 0 1px #1a1a1a, inset 0 0 80px rgba(127,255,94,0.03)" }}
    >
      {/* Terminal header */}
      <div className="flex items-center gap-2 px-4 py-3 border-b border-[#1a1a1a] bg-[#111]">
        <span className="w-2.5 h-2.5 rounded-full bg-[#ff5c71]" />
        <span className="w-2.5 h-2.5 rounded-full bg-[#e8d5b7]" />
        <span className="w-2.5 h-2.5 rounded-full bg-[#7fff5e]" />
        <span className="ml-4 text-[#444] text-xs uppercase tracking-widest">melon — bash</span>
      </div>

      {/* Terminal body */}
      <div className="p-6 flex flex-col gap-3 min-h-[180px]">
        {LINES.map((line, i) => (
          <div
            key={i}
            className={`cli-line ${i === 0 ? "text-[#7fff5e]" : i === LINES.length - 1 ? "text-[#ff5c71]" : "text-[#a0a0a0]"}`}
          >
            {line.text}
          </div>
        ))}
        <div className="flex items-center text-[#7fff5e]">
          <span>$ </span>
          <span ref={cursorRef} className="ml-1 w-2 h-4 bg-[#7fff5e] inline-block" />
        </div>
      </div>
    </div>
  );
}
