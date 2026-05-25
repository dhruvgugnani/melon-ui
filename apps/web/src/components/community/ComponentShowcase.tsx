"use client";

import React, { useState, useRef, useEffect } from "react";
import gsap from "gsap";
import Link from "next/link";

interface ComponentShowcaseProps {
  title: string;
  description: string;
  component: React.ReactNode;
  codeSnippet: string;
  cliCommand?: string;
  tags?: string[];
  /** If true, the preview area will be scrollable so scroll-triggered demos work */
  scrollable?: boolean;
  slug?: string;
  usageCode?: string;
  aiPrompt?: string;
  componentPath?: string;
}

export function ComponentShowcase({
  title,
  description,
  component,
  cliCommand,
  tags = [],
  scrollable = false,
  slug,
  usageCode,
  aiPrompt,
  componentPath,
}: ComponentShowcaseProps) {
  const [activeTab, setActiveTab] = useState<"preview" | "installation">("preview");
  const [copiedCli, setCopiedCli] = useState(false);
  const [copiedUsage, setCopiedUsage] = useState(false);
  const [copiedPrompt, setCopiedPrompt] = useState(false);

  const previewPanelRef = useRef<HTMLDivElement>(null);
  const installPanelRef = useRef<HTMLDivElement>(null);

  // Dynamic values generator if not provided explicitly in componentsData
  const compSlug = slug || title.replace(/\s+/g, "-").toLowerCase();
  const compName = componentPath || title.replace(/\s+/g, "");
  const resolvedCliCommand = cliCommand || `npx @melonui-dev/cli add ${compSlug}`;

  const resolvedUsageCode = usageCode || `import { ${compName} } from "@/components/community/demos/${compName}";

export default function Page() {
  return (
    <main className="flex min-h-screen items-center justify-center bg-[#050505] p-8">
      <${compName} />
    </main>
  );
}`;

  const resolvedAiPrompt = aiPrompt || `I want to integrate the MelonUI "${title}" component into my React/Next.js project.
Component description: "${description}"
CLI Installation command: \`${resolvedCliCommand}\`
Tags/Technologies used: ${tags.join(", ")}

Please write a premium, responsive React page component in Next.js that:
1. Imports \`${compName}\` from \`@/components/community/demos/${compName}\`.
2. Places it inside a visually stunning layout matching a dark-mode, glassmorphism design system.
3. Outlines its props and options with clean code structure and comments.`;

  useEffect(() => {
    const previewEl = previewPanelRef.current;
    const installEl = installPanelRef.current;

    if (activeTab === "preview") {
      gsap.killTweensOf([previewEl, installEl]);
      // Hide installation panel
      gsap.set(installEl, { display: "none", opacity: 0, y: 10 });
      // Fade in preview panel
      gsap.set(previewEl, { display: "flex" });
      gsap.to(previewEl, {
        opacity: 1,
        y: 0,
        duration: 0.4,
        ease: "power2.out",
      });
    } else {
      gsap.killTweensOf([previewEl, installEl]);
      // Hide preview panel
      gsap.set(previewEl, { display: "none", opacity: 0 });
      // Fade in installation panel
      gsap.set(installEl, { display: "block" });
      gsap.to(installEl, {
        opacity: 1,
        y: 0,
        duration: 0.4,
        ease: "power2.out",
      });
    }
  }, [activeTab]);

  const handleCopy = async (text: string, type: "cli" | "usage" | "prompt") => {
    try {
      await navigator.clipboard.writeText(text);
      if (type === "cli") {
        setCopiedCli(true);
        setTimeout(() => setCopiedCli(false), 2000);
      } else if (type === "usage") {
        setCopiedUsage(true);
        setTimeout(() => setCopiedUsage(false), 2000);
      } else if (type === "prompt") {
        setCopiedPrompt(true);
        setTimeout(() => setCopiedPrompt(false), 2000);
      }
    } catch (err) {
      console.error("Failed to copy text: ", err);
    }
  };

  return (
    <article className="relative w-full mb-24">
      {/* Header */}
      <header className="mb-5 flex flex-col md:flex-row md:items-end justify-between gap-3">
        <div>
          {slug ? (
            <Link href={`/community/${slug}`} className="group inline-block">
              <h3
                className="text-3xl md:text-5xl font-black uppercase tracking-tighter text-[#f4f4f4] group-hover:text-[#ff5c71] transition-colors leading-none mb-1.5"
                style={{ fontFamily: "var(--font-anton)" }}
              >
                {title}
              </h3>
            </Link>
          ) : (
            <h3
              className="text-3xl md:text-5xl font-black uppercase tracking-tighter text-[#f4f4f4] leading-none mb-1.5"
              style={{ fontFamily: "var(--font-anton)" }}
            >
              {title}
            </h3>
          )}
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
      </header>

      {/* Main Container */}
      <div className="relative border border-[#ff5c71]/15 bg-[#080808] overflow-hidden">
        {/* Navigation Toolbar */}
        <nav
          aria-label={`${title} component toolbar`}
          className="flex items-center justify-between px-4 py-2.5 border-b border-[#ff5c71]/10 bg-[#0a0a0a]"
        >
          <div className="flex gap-1" role="tablist">
            <button
              role="tab"
              aria-selected={activeTab === "preview"}
              onClick={() => setActiveTab("preview")}
              className={`px-3 py-1 font-mono text-xs uppercase tracking-widest transition-colors cursor-pointer ${
                activeTab === "preview"
                  ? "bg-[#ff5c71] text-[#050505] font-bold"
                  : "text-[#555] hover:text-[#f4f4f4]"
              }`}
            >
              Preview
            </button>
            <button
              role="tab"
              aria-selected={activeTab === "installation"}
              onClick={() => setActiveTab("installation")}
              className={`px-3 py-1 font-mono text-xs uppercase tracking-widest transition-colors cursor-pointer ${
                activeTab === "installation"
                  ? "bg-[#ff5c71] text-[#050505] font-bold"
                  : "text-[#555] hover:text-[#f4f4f4]"
              }`}
            >
              Installation & AI
            </button>
          </div>

          <div className="hidden sm:flex items-center gap-3">
            {scrollable && activeTab === "preview" && (
              <span className="font-mono text-[9px] uppercase tracking-widest text-[#333] flex items-center gap-1">
                <svg width="10" height="10" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                  <path d="M12 5v14M5 12l7 7 7-7" />
                </svg>
                scroll inside
              </span>
            )}
          </div>
        </nav>

        {/* --- Panel 1: Live Preview --- */}
        <div
          ref={previewPanelRef}
          role="tabpanel"
          className={`relative w-full flex items-center justify-center p-8 bg-[#080808] ${
            scrollable ? "overflow-y-auto" : "overflow-hidden"
          }`}
          style={{ minHeight: scrollable ? "500px" : "380px", maxHeight: scrollable ? "500px" : undefined }}
        >
          {component}
        </div>

        {/* --- Panel 2: Installation & AI --- */}
        <div
          ref={installPanelRef}
          role="tabpanel"
          style={{ display: "none" }}
          className="p-6 md:p-8 bg-[#040404] text-white/90 border-t border-[#ff5c71]/10 overflow-y-auto"
        >
          <div className="max-w-4xl mx-auto space-y-8">
            
            {/* Step 1: CLI Add Command */}
            <section className="space-y-3">
              <h4 className="font-mono text-xs text-[#ff5c71] uppercase tracking-wider flex items-center gap-2">
                <span className="w-1.5 h-1.5 rounded-full bg-[#ff5c71]" />
                Step 1: Install via CLI
              </h4>
              <div className="flex items-center justify-between p-4 bg-[#0a0a0a] border border-[#1a1a1a] rounded-[6px] font-mono text-sm group">
                <span className="text-[#7fff5e] select-all">$ {resolvedCliCommand}</span>
                <button
                  onClick={() => handleCopy(resolvedCliCommand, "cli")}
                  className="px-3 py-1.5 bg-[#111] hover:bg-[#ff5c71] text-[#555] hover:text-[#050505] transition-all border border-[#1a1a1a] hover:border-[#ff5c71] font-mono text-[10px] uppercase tracking-wider cursor-pointer"
                >
                  {copiedCli ? "Copied!" : "Copy"}
                </button>
              </div>
            </section>

            {/* Step 2: Usage / Demo Code */}
            <section className="space-y-3">
              <div className="flex items-center justify-between">
                <h4 className="font-mono text-xs text-[#ff5c71] uppercase tracking-wider flex items-center gap-2">
                  <span className="w-1.5 h-1.5 rounded-full bg-[#ff5c71]" />
                  Step 2: Import & Use
                </h4>
                <button
                  onClick={() => handleCopy(resolvedUsageCode, "usage")}
                  className="px-3 py-1 bg-[#111] hover:bg-[#ff5c71] text-[#555] hover:text-[#050505] transition-all border border-[#1a1a1a] hover:border-[#ff5c71] font-mono text-[10px] uppercase tracking-wider cursor-pointer"
                >
                  {copiedUsage ? "Copied Code" : "Copy Code"}
                </button>
              </div>
              <div className="relative bg-[#080808] border border-[#1a1a1a] rounded-[6px] overflow-hidden">
                <div className="px-4 py-2 border-b border-[#111] bg-[#0c0c0c] flex items-center justify-between">
                  <span className="font-mono text-[11px] text-[#444]">demo-usage.tsx</span>
                </div>
                <pre className="p-4 overflow-x-auto text-xs font-mono text-white/70 leading-relaxed max-h-[220px]">
                  <code>{resolvedUsageCode}</code>
                </pre>
              </div>
            </section>

            {/* Step 3: AI Prompt Automation */}
            <section className="space-y-3">
              <div className="flex items-center justify-between">
                <h4 className="font-mono text-xs text-[#7fff5e] uppercase tracking-wider flex items-center gap-2">
                  <span className="w-1.5 h-1.5 rounded-full bg-[#7fff5e]" />
                  Step 3: Automate integration with AI
                </h4>
                <button
                  onClick={() => handleCopy(resolvedAiPrompt, "prompt")}
                  className="px-3 py-1 bg-[#111] hover:bg-[#7fff5e] text-[#555] hover:text-[#050505] transition-all border border-[#1a1a1a] hover:border-[#7fff5e] font-mono text-[10px] uppercase tracking-wider cursor-pointer"
                >
                  {copiedPrompt ? "Prompt Copied!" : "Copy AI Prompt"}
                </button>
              </div>
              <p className="text-xs font-mono text-[#555] leading-relaxed">
                Copy this prompt and paste it into Claude, ChatGPT, or Gemini to generate a complete custom layout, dynamic page styling, or prop variations for this component automatically.
              </p>
              <div className="p-4 bg-[#0a0a0a] border border-[#7fff5e]/10 rounded-[6px] font-mono text-[11px] text-white/50 leading-relaxed bg-gradient-to-br from-[#0a0a0a] to-[#040404] select-all max-h-[160px] overflow-y-auto">
                {resolvedAiPrompt}
              </div>
            </section>

          </div>
        </div>

      </div>
    </article>
  );
}
