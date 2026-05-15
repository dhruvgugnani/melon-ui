"use client";

import React, { useState, useRef, useEffect } from "react";
import gsap from "gsap";

interface ComponentShowcaseProps {
  title: string;
  description: string;
  component: React.ReactNode;
  codeSnippet: string;
  cliCommand?: string;
  tags?: string[];
  /** If true, the preview area will be scrollable so scroll-triggered demos work */
  scrollable?: boolean;
}

export function ComponentShowcase({
  title,
  description,
  component,
  codeSnippet,
  cliCommand,
  tags = [],
  scrollable = false,
}: ComponentShowcaseProps) {
  const [showCode, setShowCode] = useState(false);
  const [copiedCode, setCopiedCode] = useState(false);
  const [copiedCli, setCopiedCli] = useState(false);

  const codeDrawerRef = useRef<HTMLDivElement>(null);
  const previewContainerRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    if (!codeDrawerRef.current || !previewContainerRef.current) return;

    if (showCode) {
      gsap.to(codeDrawerRef.current, {
        height: "auto",
        opacity: 1,
        duration: 0.45,
        ease: "power3.out",
      });
      gsap.to(previewContainerRef.current, {
        opacity: 0.35,
        duration: 0.3,
        ease: "power2.out",
      });
    } else {
      gsap.to(codeDrawerRef.current, {
        height: 0,
        opacity: 0,
        duration: 0.35,
        ease: "power2.in",
      });
      gsap.to(previewContainerRef.current, {
        opacity: 1,
        duration: 0.35,
        ease: "power2.in",
      });
    }
  }, [showCode]);

  const copyToClipboard = async (text: string, isCli: boolean) => {
    try {
      await navigator.clipboard.writeText(text);
      if (isCli) {
        setCopiedCli(true);
        setTimeout(() => setCopiedCli(false), 2000);
      } else {
        setCopiedCode(true);
        setTimeout(() => setCopiedCode(false), 2000);
      }
    } catch (err) {
      console.error("Failed to copy:", err);
    }
  };

  return (
    <div className="relative w-full mb-24">
      {/* Header */}
      <div className="mb-5 flex flex-col md:flex-row md:items-end justify-between gap-3">
        <div>
          <h3
            className="text-3xl md:text-5xl font-black uppercase tracking-tighter text-[#f4f4f4] leading-none mb-1.5"
            style={{ fontFamily: "var(--font-anton)" }}
          >
            {title}
          </h3>
          <p className="text-[#555] max-w-xl text-sm font-mono leading-relaxed">
            {description}
          </p>
        </div>

        <div className="flex gap-1.5 flex-wrap shrink-0">
          {tags.map((tag) => (
            <span
              key={tag}
              className="px-2.5 py-1 bg-[#0d0d0d] border border-[#1a1a1a] text-[#555] text-[10px] font-mono uppercase tracking-widest"
            >
              {tag}
            </span>
          ))}
        </div>
      </div>

      {/* Main Container */}
      <div className="relative border border-[#ff5c71]/15 bg-[#080808]">
        {/* Toolbar */}
        <div className="flex items-center justify-between px-4 py-2.5 border-b border-[#ff5c71]/10 bg-[#0a0a0a]">
          <div className="flex gap-1">
            <button
              onClick={() => setShowCode(false)}
              className={`px-3 py-1 font-mono text-xs uppercase tracking-widest transition-colors ${
                !showCode
                  ? "bg-[#ff5c71] text-[#050505] font-bold"
                  : "text-[#555] hover:text-[#f4f4f4]"
              }`}
            >
              Preview
            </button>
            <button
              onClick={() => setShowCode(true)}
              className={`px-3 py-1 font-mono text-xs uppercase tracking-widest transition-colors ${
                showCode
                  ? "bg-[#ff5c71] text-[#050505] font-bold"
                  : "text-[#555] hover:text-[#f4f4f4]"
              }`}
            >
              Code
            </button>
          </div>

          <div className="flex items-center gap-3">
            {scrollable && (
              <span className="font-mono text-[9px] uppercase tracking-widest text-[#333] flex items-center gap-1">
                <svg width="10" height="10" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2"><path d="M12 5v14M5 12l7 7 7-7"/></svg>
                scroll inside
              </span>
            )}

            {cliCommand && (
              <button
                onClick={() => copyToClipboard(cliCommand, true)}
                className="flex items-center gap-1.5 group/cli"
              >
                <span className="font-mono text-[10px] text-[#444] group-hover/cli:text-[#ff5c71] transition-colors">
                  $ {cliCommand}
                </span>
                <div className="p-1 bg-[#111] border border-[#1a1a1a] group-hover/cli:bg-[#ff5c71] group-hover/cli:border-[#ff5c71] transition-colors">
                  {copiedCli ? (
                    <svg width="10" height="10" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="3" strokeLinecap="round" strokeLinejoin="round" className="text-white">
                      <polyline points="20 6 9 17 4 12" />
                    </svg>
                  ) : (
                    <svg width="10" height="10" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" className="text-[#555] group-hover/cli:text-white">
                      <rect x="9" y="9" width="13" height="13" rx="2" ry="2" />
                      <path d="M5 15H4a2 2 0 0 1-2-2V4a2 2 0 0 1 2-2h9a2 2 0 0 1 2 2v1" />
                    </svg>
                  )}
                </div>
              </button>
            )}
          </div>
        </div>

        {/* Live Preview Area */}
        <div
          ref={previewContainerRef}
          className={`relative w-full flex items-center justify-center p-8 bg-[#080808] ${
            scrollable ? "overflow-y-auto" : "overflow-hidden"
          }`}
          style={{ minHeight: scrollable ? "500px" : "380px", maxHeight: scrollable ? "500px" : undefined }}
        >
          {component}
        </div>

        {/* Code Drawer */}
        <div
          ref={codeDrawerRef}
          className="overflow-hidden bg-[#040404] border-t border-[#ff5c71]/10"
          style={{ height: 0, opacity: 0 }}
        >
          <div className="px-4 py-3 flex justify-between items-center border-b border-[#111]">
            <span className="font-mono text-[#333] text-xs">
              components/{title.replace(/\s+/g, "").toLowerCase()}.tsx
            </span>
            <button
              onClick={() => copyToClipboard(codeSnippet, false)}
              className="flex items-center gap-1.5 px-2.5 py-1 bg-[#111] hover:bg-[#ff5c71] text-[#555] hover:text-white transition-colors border border-[#1a1a1a] hover:border-[#ff5c71]"
            >
              <span className="font-mono text-[10px] uppercase tracking-widest">
                {copiedCode ? "Copied!" : "Copy"}
              </span>
              {copiedCode ? (
                <svg width="10" height="10" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="3" strokeLinecap="round" strokeLinejoin="round">
                  <polyline points="20 6 9 17 4 12" />
                </svg>
              ) : (
                <svg width="10" height="10" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                  <rect x="9" y="9" width="13" height="13" rx="2" ry="2" />
                  <path d="M5 15H4a2 2 0 0 1-2-2V4a2 2 0 0 1 2-2h9a2 2 0 0 1 2 2v1" />
                </svg>
              )}
            </button>
          </div>
          <pre className="p-5 overflow-x-auto text-xs font-mono text-[#888] leading-relaxed max-h-[360px] overflow-y-auto">
            <code>{codeSnippet}</code>
          </pre>
        </div>
      </div>
    </div>
  );
}
