"use client";

import { useEffect, useRef } from "react";
import gsap from "gsap";

const DEFAULT_LINES = [
  { text: "$ npx @melonui-dev/cli init", delay: 0 },
  { text: "✔ Detected Next.js 15 project", delay: 1.2 },
  { text: "✔ Installing dependencies...", delay: 2.0 },
  { text: "✔ Copying component registry...", delay: 3.0 },
  { text: "🍉 MelonUI ready. Start building.", delay: 4.2 },
];

export interface TerminalLine {
  text: string;
  delay: number;
}

export interface CliTerminalProps extends React.ComponentPropsWithoutRef<"div"> {
  lines?: TerminalLine[];
  title?: string;
  borderColor?: string;
  headerBg?: string;
  bodyBg?: string;
  cursorColor?: string;
  firstLineColor?: string;
  lastLineColor?: string;
  defaultLineColor?: string;
  glowOpacity?: number;
  titleTextColor?: string;
}

export function CliTerminal({
  lines = DEFAULT_LINES,
  title = "melon — bash",
  borderColor = "#1e1e1e",
  headerBg = "rgba(17, 17, 17, 0.5)",
  bodyBg = "transparent",
  cursorColor = "#7fff5e",
  firstLineColor = "#7fff5e",
  lastLineColor = "#ff5c71",
  defaultLineColor = "#a0a0a0",
  glowOpacity = 0.03,
  titleTextColor = "#444",
  className = "",
  style,
  ...props
}: CliTerminalProps) {
  const containerRef = useRef<HTMLDivElement>(null);
  const cursorRef = useRef<HTMLSpanElement>(null);

  useEffect(() => {
    if (!containerRef.current) return;

    const cliLines = containerRef.current.querySelectorAll<HTMLDivElement>(".cli-line");
    const cursor = cursorRef.current;

    const ctx = gsap.context(() => {
      // Start all lines invisible
      gsap.set(cliLines, { opacity: 0, y: 8 });
      if (cursor) gsap.set(cursor, { opacity: 1 });

      const tl = gsap.timeline({ repeat: -1, repeatDelay: 2 });

      lines.forEach((line, i) => {
        if (cliLines[i]) {
          tl.to(cliLines[i], {
            opacity: 1,
            y: 0,
            duration: 0.3,
            ease: "power2.out",
          }, line.delay);
        }
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
      tl.to(cliLines, {
        opacity: 0,
        y: 8,
        duration: 0.4,
        stagger: 0.05,
        ease: "power2.in",
      }, "+=1.5");
    }, containerRef);

    return () => ctx.revert();
  }, [lines]);

  return (
    <div
      ref={containerRef}
      className={`w-full max-w-2xl border font-mono text-sm overflow-hidden ${className}`}
      style={{
        borderColor: borderColor,
        backgroundColor: bodyBg,
        boxShadow: `0 0 0 1px ${borderColor}, inset 0 0 80px rgba(127,255,94,${glowOpacity})`,
        ...style
      }}
      {...props}
    >
      {/* Terminal header */}
      <div
        className="flex items-center gap-2 px-4 py-3 border-b"
        style={{
          backgroundColor: headerBg,
          borderColor: borderColor,
        }}
      >
        <span className="w-2.5 h-2.5 rounded-full bg-[#ff5c71]" />
        <span className="w-2.5 h-2.5 rounded-full bg-[#e8d5b7]" />
        <span className="w-2.5 h-2.5 rounded-full bg-[#7fff5e]" />
        <span className="ml-4 text-xs uppercase tracking-widest" style={{ color: titleTextColor }}>
          {title}
        </span>
      </div>

      {/* Terminal body */}
      <div className="p-6 flex flex-col gap-3 min-h-[180px]">
        {lines.map((line, i) => (
          <div
            key={i}
            className="cli-line"
            style={{
              color: i === 0 ? firstLineColor : i === lines.length - 1 ? lastLineColor : defaultLineColor
            }}
          >
            {line.text}
          </div>
        ))}
        <div className="flex items-center" style={{ color: cursorColor }}>
          <span>$ </span>
          <span ref={cursorRef} className="ml-1 w-2 h-4 inline-block" style={{ backgroundColor: cursorColor }} />
        </div>
      </div>
    </div>
  );
}
