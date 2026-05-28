"use client";

import React, { useState, useRef, useEffect } from "react";
import gsap from "gsap";
import Link from "next/link";

interface ComponentShowcaseProps {
  title: string;
  description: string;
  component: React.ReactNode;
  codeSnippet: string; // Will hold the full source code passed from the server
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
  codeSnippet,
  cliCommand,
  tags = [],
  scrollable = false,
  slug,
  usageCode,
  aiPrompt,
  componentPath,
}: ComponentShowcaseProps) {
  const [activeTab, setActiveTab] = useState<"preview" | "installation">("preview");
  const [installMethod, setInstallMethod] = useState<"cli" | "manual">("cli");
  const [previewTheme, setPreviewTheme] = useState<"dark" | "light">("dark");
  const [copiedCli, setCopiedCli] = useState(false);
  const [copiedDeps, setCopiedDeps] = useState(false);
  const [copiedUsage, setCopiedUsage] = useState(false);
  const [copiedSource, setCopiedSource] = useState(false);
  const [copiedPrompt, setCopiedPrompt] = useState(false);

  const previewPanelRef = useRef<HTMLDivElement>(null);
  const installPanelRef = useRef<HTMLDivElement>(null);

  const compSlug = slug || title.replace(/\s+/g, "-").toLowerCase();
  const compName = componentPath || title.replace(/\s+/g, "");
  const resolvedCliCommand = cliCommand || `npx @melonui-dev/cli add ${compSlug}`;

  // Dynamically calculate dependencies based on tags
  const getDependencies = (tagsList: string[]) => {
    const deps = ["clsx", "tailwind-merge"];
    const tagsLower = tagsList.map(t => t.toLowerCase());
    
    if (tagsLower.some(t => t.includes("gsap"))) {
      deps.push("gsap", "@gsap/react");
    }
    if (tagsLower.some(t => t.includes("three") || t.includes("r3f"))) {
      deps.push("three", "@react-three/fiber", "@react-three/drei");
    }
    if (tagsLower.some(t => t.includes("framer") || t.includes("motion"))) {
      deps.push("framer-motion");
    }
    if (tagsLower.some(t => t.includes("lenis"))) {
      deps.push("lenis");
    }
    return Array.from(new Set(deps));
  };

  const dependenciesList = getDependencies(tags);
  const installDepsCommand = `npm install ${dependenciesList.join(" ")}`;

  // Correct import path for the user's project
  const resolvedUsageCode = usageCode || `import { ${compName} } from "@/components/${compSlug}";

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
1. Imports \`${compName}\` from \`@/components/${compSlug}\`.
2. Places it inside a visually stunning layout matching a dark-mode, glassmorphism design system.
3. Outlines its props and options with clean code structure and comments.`;

  useEffect(() => {
    const previewEl = previewPanelRef.current;
    const installEl = installPanelRef.current;

    if (activeTab === "preview") {
      gsap.killTweensOf([previewEl, installEl]);
      gsap.set(installEl, { display: "none", opacity: 0, y: 10 });
      gsap.set(previewEl, { display: "flex" });
      gsap.to(previewEl, {
        opacity: 1,
        y: 0,
        duration: 0.4,
        ease: "power2.out",
      });
    } else {
      gsap.killTweensOf([previewEl, installEl]);
      gsap.set(previewEl, { display: "none", opacity: 0 });
      gsap.set(installEl, { display: "block" });
      gsap.to(installEl, {
        opacity: 1,
        y: 0,
        duration: 0.4,
        ease: "power2.out",
      });
    }
  }, [activeTab]);

  const handleCopy = async (text: string, setCopiedState: React.Dispatch<React.SetStateAction<boolean>>) => {
    try {
      await navigator.clipboard.writeText(text);
      setCopiedState(true);
      setTimeout(() => setCopiedState(false), 2000);
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
            <Link href={`/components/${slug}`} className="group inline-block">
              <h3
                className="text-3xl md:text-5xl font-black uppercase tracking-tighter text-[#f4f4f4] group-hover:text-[#ff5c71] transition-colors leading-none mb-1.5"
                style={{ fontFamily: "var(--font-londrina-solid)" }}
              >
                {title}
              </h3>
            </Link>
          ) : (
            <h3
              className="text-3xl md:text-5xl font-black uppercase tracking-tighter text-[#f4f4f4] leading-none mb-1.5"
              style={{ fontFamily: "var(--font-londrina-solid)" }}
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
      <div className="relative border border-[#ff5c71]/15 bg-[#080808] overflow-hidden store-card-glow">
        {/* Cyber Corner Brackets */}
        <div className="absolute top-0 left-0 w-2.5 h-2.5 border-t-2 border-l-2 border-[#ff5c71]/35 pointer-events-none z-10" />
        <div className="absolute top-0 right-0 w-2.5 h-2.5 border-t-2 border-r-2 border-[#ff5c71]/35 pointer-events-none z-10" />
        <div className="absolute bottom-0 left-0 w-2.5 h-2.5 border-b-2 border-l-2 border-[#ff5c71]/35 pointer-events-none z-10" />
        <div className="absolute bottom-0 right-0 w-2.5 h-2.5 border-b-2 border-r-2 border-[#ff5c71]/35 pointer-events-none z-10" />
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
              className={`px-3 py-1 font-mono text-xs uppercase tracking-widest transition-all duration-200 cursor-pointer active:scale-95 hover:scale-[1.02] ${
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
              className={`px-3 py-1 font-mono text-xs uppercase tracking-widest transition-all duration-200 cursor-pointer active:scale-95 hover:scale-[1.02] ${
                activeTab === "installation"
                  ? "bg-[#ff5c71] text-[#050505] font-bold"
                  : "text-[#555] hover:text-[#f4f4f4]"
              }`}
            >
              Installation & AI
            </button>
          </div>

          <div className="flex items-center gap-3">
            {scrollable && activeTab === "preview" && (
              <span className="font-mono text-[9px] uppercase tracking-widest text-[#333] hidden sm:flex items-center gap-1">
                <svg width="10" height="10" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                  <path d="M12 5v14M5 12l7 7 7-7" />
                </svg>
                scroll inside
              </span>
            )}

            {activeTab === "preview" && (
              <button
                onClick={() => setPreviewTheme(t => t === "dark" ? "light" : "dark")}
                className="p-1 border border-[#ff5c71]/15 hover:border-[#ff5c71] rounded bg-[#0d0d0f] text-[#555] hover:text-[#ff5c71] transition-all cursor-pointer flex items-center justify-center w-6 h-6 z-10 active:scale-90 hover:scale-105 duration-200"
                aria-label="Toggle Local Preview Theme"
              >
                {previewTheme === "dark" ? (
                  // Moon icon
                  <svg width="11" height="11" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5">
                    <path d="M21 12.79A9 9 0 1 1 11.21 3 7 7 0 0 0 21 12.79z" />
                  </svg>
                ) : (
                  // Sun icon
                  <svg width="11" height="11" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5">
                    <circle cx="12" cy="12" r="5" />
                    <line x1="12" y1="1" x2="12" y2="3" /><line x1="12" y1="21" x2="12" y2="23" />
                    <line x1="4.22" y1="4.22" x2="5.64" y2="5.64" /><line x1="18.36" y1="18.36" x2="19.78" y2="19.78" />
                    <line x1="1" y1="12" x2="3" y2="12" /><line x1="21" y1="12" x2="23" y2="12" />
                    <line x1="4.22" y1="19.78" x2="5.64" y2="18.36" /><line x1="18.36" y1="5.64" x2="19.78" y2="4.22" />
                  </svg>
                )}
              </button>
            )}
          </div>
        </nav>

        {/* --- Panel 1: Live Preview --- */}
        <div
          ref={previewPanelRef}
          role="tabpanel"
          className={`relative w-full flex items-center justify-center p-8 bg-[#080808] text-white transition-colors duration-300 ${
            previewTheme === "light" ? "light" : ""
          } ${
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
            
            {/* Method Choice Selector */}
            <div className="border-b border-[#111] pb-4 flex items-center justify-between">
              <div>
                <h4 className="text-lg font-black uppercase text-white" style={{ fontFamily: "var(--font-londrina-solid)" }}>
                  Choose Installation Method
                </h4>
                <p className="text-xs font-mono text-[#555] mt-1">Select how you want to add this component to your project</p>
              </div>
              <div className="flex bg-[#0a0a0a] border border-[#1a1a1a] p-1 rounded-[6px]">
                <button
                  onClick={() => setInstallMethod("cli")}
                  className={`px-3 py-1.5 font-mono text-[10px] uppercase tracking-wider transition-all rounded-[4px] cursor-pointer active:scale-95 hover:scale-[1.02] ${
                    installMethod === "cli"
                      ? "bg-[#ff5c71] text-[#050505] font-bold"
                      : "text-[#555] hover:text-[#ccc]"
                  }`}
                >
                  CLI (npx)
                </button>
                <button
                  onClick={() => setInstallMethod("manual")}
                  className={`px-3 py-1.5 font-mono text-[10px] uppercase tracking-wider transition-all rounded-[4px] cursor-pointer active:scale-95 hover:scale-[1.02] ${
                    installMethod === "manual"
                      ? "bg-[#ff5c71] text-[#050505] font-bold"
                      : "text-[#555] hover:text-[#ccc]"
                  }`}
                >
                  Manual (Code)
                </button>
              </div>
            </div>

            {/* --- CLI INSTALLATION VIEW --- */}
            {installMethod === "cli" && (
              <div className="space-y-6">
                {/* CLI Command */}
                <div className="space-y-2.5">
                  <span className="font-mono text-[10px] text-[#ff5c71] uppercase tracking-wider">
                    Run command in your project root
                  </span>
                  <div className="flex items-center justify-between p-4 bg-[#0a0a0a] border border-[#1a1a1a] rounded-[6px] font-mono text-sm">
                    <span className="text-[#7fff5e] select-all">$ {resolvedCliCommand}</span>
                    <button
                      onClick={() => handleCopy(resolvedCliCommand, setCopiedCli)}
                      className="px-3 py-1.5 bg-[#111] hover:bg-[#ff5c71] text-[#555] hover:text-[#050505] transition-all duration-200 border border-[#1a1a1a] hover:border-[#ff5c71] font-mono text-[10px] uppercase tracking-wider cursor-pointer active:scale-95 hover:scale-[1.02]"
                    >
                      {copiedCli ? "Copied!" : "Copy"}
                    </button>
                  </div>
                </div>

                {/* Helping Code (Usage) */}
                <div className="space-y-2.5">
                  <div className="flex items-center justify-between">
                    <span className="font-mono text-[10px] text-[#ff5c71] uppercase tracking-wider">
                      How to import and use
                    </span>
                    <button
                      onClick={() => handleCopy(resolvedUsageCode, setCopiedUsage)}
                      className="px-3 py-1 bg-[#111] hover:bg-[#ff5c71] text-[#555] hover:text-[#050505] transition-all duration-200 border border-[#1a1a1a] hover:border-[#ff5c71] font-mono text-[10px] uppercase tracking-wider cursor-pointer active:scale-95 hover:scale-[1.02]"
                    >
                      {copiedUsage ? "Copied Code" : "Copy Code"}
                    </button>
                  </div>
                  <div className="relative bg-[#080808] border border-[#1a1a1a] rounded-[6px] overflow-hidden">
                    <div className="px-4 py-2 border-b border-[#111] bg-[#0c0c0c] flex items-center justify-between">
                      <span className="font-mono text-[11px] text-[#444]">app/page.tsx</span>
                    </div>
                    <pre className="p-4 overflow-x-auto text-xs font-mono text-white/70 leading-relaxed max-h-[220px]">
                      <code>{resolvedUsageCode}</code>
                    </pre>
                  </div>
                </div>
              </div>
            )}

            {/* --- MANUAL INSTALLATION VIEW --- */}
            {installMethod === "manual" && (
              <div className="space-y-6">
                {/* Step 1: Install Dependencies */}
                <div className="space-y-2.5">
                  <span className="font-mono text-[10px] text-[#ff5c71] uppercase tracking-wider">
                    1. Install NPM dependencies
                  </span>
                  <div className="flex items-center justify-between p-4 bg-[#0a0a0a] border border-[#1a1a1a] rounded-[6px] font-mono text-sm">
                    <span className="text-[#7fff5e] select-all">$ {installDepsCommand}</span>
                    <button
                      onClick={() => handleCopy(installDepsCommand, setCopiedDeps)}
                      className="px-3 py-1.5 bg-[#111] hover:bg-[#ff5c71] text-[#555] hover:text-[#050505] transition-all duration-200 border border-[#1a1a1a] hover:border-[#ff5c71] font-mono text-[10px] uppercase tracking-wider cursor-pointer active:scale-95 hover:scale-[1.02]"
                    >
                      {copiedDeps ? "Copied!" : "Copy"}
                    </button>
                  </div>
                </div>

                {/* Step 2: Create File & Paste Code */}
                <div className="space-y-2.5">
                  <div className="flex items-center justify-between">
                    <span className="font-mono text-[10px] text-[#ff5c71] uppercase tracking-wider">
                      2. Create file at <code className="text-[#ff5c71]">components/{compSlug}.tsx</code> and paste source code
                    </span>
                    <button
                      onClick={() => handleCopy(codeSnippet, setCopiedSource)}
                      className="px-3 py-1 bg-[#111] hover:bg-[#ff5c71] text-[#555] hover:text-[#050505] transition-all duration-200 border border-[#1a1a1a] hover:border-[#ff5c71] font-mono text-[10px] uppercase tracking-wider cursor-pointer active:scale-95 hover:scale-[1.02]"
                    >
                      {copiedSource ? "Source Copied!" : "Copy Source Code"}
                    </button>
                  </div>
                  <div className="relative bg-[#080808] border border-[#1a1a1a] rounded-[6px] overflow-hidden">
                    <div className="px-4 py-2 border-b border-[#111] bg-[#0c0c0c] flex items-center justify-between">
                      <span className="font-mono text-[11px] text-[#444]">components/{compSlug}.tsx</span>
                    </div>
                    <pre className="p-4 overflow-x-auto text-xs font-mono text-white/50 leading-relaxed max-h-[320px] overflow-y-auto">
                      <code>{codeSnippet}</code>
                    </pre>
                  </div>
                </div>
              </div>
            )}

            {/* AI Prompt Section (Shared) */}
            <section className="space-y-3 pt-4 border-t border-[#111]">
              <div className="flex items-center justify-between">
                <h4 className="font-mono text-xs text-[#7fff5e] uppercase tracking-wider flex items-center gap-2">
                  <span className="w-1.5 h-1.5 rounded-full bg-[#7fff5e]" />
                  AI Automation Agent Prompt
                </h4>
                <button
                  onClick={() => handleCopy(resolvedAiPrompt, setCopiedPrompt)}
                  className="px-3 py-1 bg-[#111] hover:bg-[#7fff5e] text-[#555] hover:text-[#050505] transition-all duration-200 border border-[#1a1a1a] hover:border-[#7fff5e] font-mono text-[10px] uppercase tracking-wider cursor-pointer active:scale-95 hover:scale-[1.02]"
                >
                  {copiedPrompt ? "Prompt Copied!" : "Copy AI Prompt"}
                </button>
              </div>
              <p className="text-xs font-mono text-[#555] leading-relaxed">
                Feed this prompt to Claude, ChatGPT, or Gemini to quickly write custom integrations, layouts, or configure props for this component on your system.
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
