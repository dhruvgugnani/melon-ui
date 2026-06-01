"use client";

import React, { useState, useRef, useEffect, useCallback } from "react";
import gsap from "gsap";
import Link from "next/link";
import { getComponentBySlug } from "@/data/components";
import { componentsRegistry } from "./componentsRegistry";

interface ComponentShowcaseProps {
  title: string;
  description: string;
  component?: React.ReactNode;
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

function highlightSyntax(code: string): string {
  // Escape HTML characters
  let escaped = code
    .replace(/&/g, "&amp;")
    .replace(/</g, "&lt;")
    .replace(/>/g, "&gt;");

  // Highlight comments (dim gray)
  escaped = escaped.replace(/(\/\/.*)/g, '<span style="color: #6a737d;">$1</span>');

  // Highlight strings (double quotes) - soft green
  escaped = escaped.replace(/(&quot;[^\n]*?&quot;)/g, '<span style="color: #7fff5e;">$1</span>');
  // Highlight strings (single quotes) - soft green
  escaped = escaped.replace(/('[^\n]*?')/g, '<span style="color: #7fff5e;">$1</span>');
  // Highlight strings (template literals) - soft green
  escaped = escaped.replace(/(`[^`]*?`)/g, '<span style="color: #7fff5e;">$1</span>');

  // Highlight keywords - neon pink/coral
  const keywords = [
    "import", "export", "default", "function", "const", "return", 
    "from", "let", "if", "else", "new", "class", "interface", "extends", "typeof", "undefined"
  ];
  keywords.forEach(kw => {
    const reg = new RegExp(`\\b(${kw})\\b`, "g");
    escaped = escaped.replace(reg, '<span style="color: #ff5c71; font-weight: bold;">$1</span>');
  });

  // Highlight hooks & functions (useState, useEffect, push, scrollIntoView) - cyan
  escaped = escaped.replace(/\b(use[A-Z][a-zA-Z0-9_]+)\b/g, '<span style="color: #00f0ff;">$1</span>');
  escaped = escaped.replace(/\b(push|scrollIntoView|onNavigate|onExecute|querySelector|addEventListener|removeEventListener|setTimeout|setInterval)\b/g, '<span style="color: #00f0ff;">$1</span>');

  // Highlight HTML/JSX component tags - light cyan/teal
  escaped = escaped.replace(/(&lt;\/?[A-Z][a-zA-Z0-9_]*)/g, '<span style="color: #00f0ff;">$1</span>');
  escaped = escaped.replace(/(&lt;\/?[a-z][a-zA-Z0-9_]*)/g, '<span style="color: #00f0ff;">$1</span>');
  // Highlight closing tag symbols
  escaped = escaped.replace(/(\/?&gt;)/g, '<span style="color: #00f0ff;">$1</span>');

  // Highlight custom classes and components - warm orange
  escaped = escaped.replace(/\b(CommandItem|OrbitalCommandRing|PageNavigationDemo|PageNavigationDemoProps|React|ComponentPropsWithoutRef|Feature|ChangelogCard|SignalLoom|HyperMorphBento|QuantumLensDecoder|BreadcrumbTrail|HarvestReveal|CliTerminal|TagInput|RindPeelCard|FlipCard|HoloTicket|KineticMagnet|KineticGlassGrid|MorphingCyberNode|SolarCarousel|GlitchPulseCore|RindWipeTransition|MorphTransition|useRef|useState|useEffect|useMotionValue|useSpring|useTransform|AnimatePresence|motion)\b/g, '<span style="color: #ff8c00;">$1</span>');

  // Highlight numbers - warm orange
  escaped = escaped.replace(/\b([0-9]+)\b/g, '<span style="color: #ff8c00;">$1</span>');

  return escaped;
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
  const ComponentToRender = componentPath ? componentsRegistry[componentPath] : null;
  const [installMethod, setInstallMethod] = useState<"cli" | "manual">("cli");
  const [previewTheme, setPreviewTheme] = useState<"dark" | "light">("dark");
  const [previewWidth, setPreviewWidth] = useState<string>("100%");
  const [showResizer, setShowResizer] = useState(false);
  const [isResizing, setIsResizing] = useState(false);
  const [displayedWidth, setDisplayedWidth] = useState<number>(0);
  const [copiedCli, setCopiedCli] = useState(false);
  const [copiedDeps, setCopiedDeps] = useState(false);
  const [copiedUsage, setCopiedUsage] = useState(false);
  const [copiedSource, setCopiedSource] = useState(false);
  const [copiedPrompt, setCopiedPrompt] = useState(false);

  const previewPanelRef = useRef<HTMLDivElement>(null);
  const installPanelRef = useRef<HTMLDivElement>(null);
  const previewBoxRef = useRef<HTMLDivElement>(null);
  const resizeDataRef = useRef({
    startX: 0,
    startWidth: 0,
    parentWidth: 0,
  });

  const compSlug = slug || title.replace(/\s+/g, "-").toLowerCase();
  const compName = componentPath || title.replace(/\s+/g, "");
  const resolvedCliCommand = cliCommand || `npx @melonui-dev/cli add ${compSlug}`;

  // Fetch component info and props list
  const componentInfo = slug ? getComponentBySlug(slug) : null;
  const propsList = componentInfo?.props || [];

  // Playground state management
  const [playgroundProps, setPlaygroundProps] = useState<Record<string, any>>({});

  useEffect(() => {
    const defaults: Record<string, any> = {};
    propsList.forEach((p) => {
      if (p.defaultValue.startsWith('"') || p.defaultValue.startsWith("'")) {
        defaults[p.name] = p.defaultValue.slice(1, -1);
      } else if (p.defaultValue === "true") {
        defaults[p.name] = true;
      } else if (p.defaultValue === "false") {
        defaults[p.name] = false;
      } else {
        const val = Number(p.defaultValue);
        defaults[p.name] = isNaN(val) ? p.defaultValue : val;
      }
    });
    setPlaygroundProps(defaults);
  }, [slug, componentInfo]); // Reset on slug / component change

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

  // Base resolved usage code
  const resolvedUsageCode = usageCode || `import { ${compName} } from "@/components/${compSlug}";

export default function Page() {
  return (
    <main className="flex min-h-screen items-center justify-center bg-[#050505] p-8">
      <${compName} />
    </main>
  );
}`;

  // Dynamic usage code builder
  const [dynamicUsageCode, setDynamicUsageCode] = useState(resolvedUsageCode);

  useEffect(() => {
    if (propsList.length === 0) {
      setDynamicUsageCode(resolvedUsageCode);
      return;
    }

    const propsStr = Object.entries(playgroundProps)
      .map(([key, val]) => {
        if (typeof val === "string") return `      ${key}="${val}"`;
        if (typeof val === "boolean") return `      ${key}={${val}}`;
        return `      ${key}={${val}}`;
      })
      .join("\n");

    const dynamicCode = `import { ${compName} } from "@/components/${compSlug}";

export default function Page() {
  return (
    <main className="flex min-h-screen items-center justify-center bg-[#050505] p-8">
      <${compName}
${propsStr}
      />
    </main>
  );
}`;
    setDynamicUsageCode(dynamicCode);
  }, [playgroundProps, propsList, compName, compSlug, resolvedUsageCode]);

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

  const startResize = useCallback((e: React.MouseEvent | React.TouchEvent) => {
    e.preventDefault();
    if (!previewBoxRef.current || !previewPanelRef.current) return;

    const clientX = "touches" in e ? e.touches[0].clientX : e.clientX;
    const startWidth = previewBoxRef.current.getBoundingClientRect().width;
    const parentWidth = previewPanelRef.current.clientWidth;

    resizeDataRef.current = {
      startX: clientX,
      startWidth,
      parentWidth,
    };

    setIsResizing(true);
  }, []);

  useEffect(() => {
    if (!isResizing) return;

    const handleMouseMove = (e: MouseEvent | TouchEvent) => {
      const clientX = "touches" in e ? e.touches[0].clientX : e.clientX;
      const { startX, startWidth, parentWidth } = resizeDataRef.current;
      
      const deltaX = clientX - startX;
      // Since it is centered, resizing right border extends both sides -> 2 * deltaX
      let newWidth = startWidth + 2 * deltaX;

      const minWidth = 280;
      const maxWidth = Math.max(minWidth, parentWidth - 64);
      
      if (newWidth < minWidth) newWidth = minWidth;
      if (newWidth > maxWidth) newWidth = maxWidth;

      setPreviewWidth(`${newWidth}px`);
    };

    const handleMouseUp = () => {
      setIsResizing(false);
    };

    window.addEventListener("mousemove", handleMouseMove);
    window.addEventListener("mouseup", handleMouseUp);
    window.addEventListener("touchmove", handleMouseMove, { passive: false });
    window.addEventListener("touchend", handleMouseUp);

    return () => {
      window.removeEventListener("mousemove", handleMouseMove);
      window.removeEventListener("mouseup", handleMouseUp);
      window.removeEventListener("touchmove", handleMouseMove);
      window.removeEventListener("touchend", handleMouseUp);
    };
  }, [isResizing]);

  useEffect(() => {
    if (isResizing) {
      document.body.style.cursor = "ew-resize";
      document.body.style.userSelect = "none";
    } else {
      document.body.style.cursor = "";
      document.body.style.userSelect = "";
    }
    return () => {
      document.body.style.cursor = "";
      document.body.style.userSelect = "";
    };
  }, [isResizing]);

  useEffect(() => {
    if (!previewBoxRef.current) return;
    
    const updateWidth = () => {
      if (previewBoxRef.current) {
        setDisplayedWidth(Math.round(previewBoxRef.current.getBoundingClientRect().width));
      }
    };

    updateWidth();

    const observer = new ResizeObserver(updateWidth);
    observer.observe(previewBoxRef.current);

    return () => {
      observer.disconnect();
    };
  }, [previewWidth]);

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
              <div className="flex items-center gap-2 border-l border-[#ff5c71]/10 pl-3">
                {/* Theme Toggle */}
                <button
                  onClick={() => setPreviewTheme(t => t === "dark" ? "light" : "dark")}
                  className="p-1 border border-[#ff5c71]/15 hover:border-[#ff5c71] rounded bg-[#0d0d0f] text-[#555] hover:text-[#ff5c71] transition-all cursor-pointer flex items-center justify-center w-6 h-6 z-10 active:scale-90 hover:scale-105 duration-200"
                  aria-label="Toggle Local Preview Theme"
                  title="Toggle Theme"
                >
                  {previewTheme === "dark" ? (
                    <svg width="11" height="11" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5">
                      <path d="M21 12.79A9 9 0 1 1 11.21 3 7 7 0 0 0 21 12.79z" />
                    </svg>
                  ) : (
                    <svg width="11" height="11" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5">
                      <circle cx="12" cy="12" r="5" />
                      <line x1="12" y1="1" x2="12" y2="3" /><line x1="12" y1="21" x2="12" y2="23" />
                      <line x1="4.22" y1="4.22" x2="5.64" y2="5.64" /><line x1="18.36" y1="18.36" x2="19.78" y2="19.78" />
                      <line x1="1" y1="12" x2="3" y2="12" /><line x1="21" y1="12" x2="23" y2="12" />
                      <line x1="4.22" y1="19.78" x2="5.64" y2="18.36" /><line x1="18.36" y1="5.64" x2="19.78" y2="4.22" />
                    </svg>
                  )}
                </button>

                {/* Desktop Preview */}
                <button
                  onClick={() => {
                    setPreviewWidth("100%");
                    setShowResizer(true);
                  }}
                  className={`p-1 border rounded bg-[#0d0d0f] transition-all cursor-pointer flex items-center justify-center w-6 h-6 z-10 active:scale-90 hover:scale-105 duration-200 ${
                    previewWidth === "100%"
                      ? "border-[#ff5c71] text-[#ff5c71]"
                      : "border-[#ff5c71]/15 text-[#555] hover:text-[#ccc]"
                  }`}
                  title="Desktop View (100%)"
                  aria-label="Desktop Preview"
                >
                  <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                    <rect x="2" y="3" width="20" height="14" rx="2" />
                    <line x1="8" y1="21" x2="16" y2="21" />
                    <line x1="12" y1="17" x2="12" y2="21" />
                  </svg>
                </button>

                {/* Tablet Preview */}
                <button
                  onClick={() => {
                    setPreviewWidth("680px");
                    setShowResizer(true);
                  }}
                  className={`p-1 border rounded bg-[#0d0d0f] transition-all cursor-pointer flex items-center justify-center w-6 h-6 z-10 active:scale-90 hover:scale-105 duration-200 ${
                    previewWidth === "680px"
                      ? "border-[#ff5c71] text-[#ff5c71]"
                      : "border-[#ff5c71]/15 text-[#555] hover:text-[#ccc]"
                  }`}
                  title="Tablet View (680px)"
                  aria-label="Tablet Preview"
                >
                  <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                    <rect x="4" y="3" width="16" height="18" rx="2" />
                    <circle cx="12" cy="17" r="0.75" fill="currentColor" />
                    <line x1="11" y1="5" x2="13" y2="5" />
                  </svg>
                </button>

                {/* Phone Preview */}
                <button
                  onClick={() => {
                    setPreviewWidth("320px");
                    setShowResizer(true);
                  }}
                  className={`p-1 border rounded bg-[#0d0d0f] transition-all cursor-pointer flex items-center justify-center w-6 h-6 z-10 active:scale-90 hover:scale-105 duration-200 ${
                    previewWidth === "320px"
                      ? "border-[#ff5c71] text-[#ff5c71]"
                      : "border-[#ff5c71]/15 text-[#555] hover:text-[#ccc]"
                  }`}
                  title="Phone View (320px)"
                  aria-label="Phone Preview"
                >
                  <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                    <rect x="7" y="3" width="10" height="18" rx="2" />
                    <circle cx="12" cy="17" r="0.5" fill="currentColor" />
                    <line x1="11" y1="5" x2="13" y2="5" />
                  </svg>
                </button>

                {/* Manual Width Display */}
                {showResizer && (
                  <div className="flex items-center gap-1.5 pl-2 border-l border-[#ff5c71]/10">
                    <span className="font-mono text-[9px] uppercase tracking-wider text-[#444] shrink-0">Width:</span>
                    <span className="font-mono text-[9px] text-[#ff5c71] font-bold shrink-0">{displayedWidth}px</span>
                  </div>
                )}
              </div>
            )}
          </div>
        </nav>

        {/* --- Panel 1: Live Preview --- */}
        <div
          ref={previewPanelRef}
          role="tabpanel"
          className={`relative w-full flex items-center justify-center p-4 sm:p-6 md:p-8 bg-[#080808] text-white transition-colors duration-300 ${
            previewTheme === "light" ? "light" : ""
          } ${
            scrollable ? "overflow-y-auto" : "overflow-hidden"
          }`}
          style={{ minHeight: scrollable ? "500px" : "380px", maxHeight: scrollable ? "500px" : undefined }}
        >
          {/* Responsive Preview Wrapper Frame */}
          <div
            ref={previewBoxRef}
            className={`h-full mx-auto relative flex items-center justify-center ${
              !isResizing ? "transition-all duration-300 ease-out" : ""
            } ${
              previewWidth === "100%" ? "w-full" : ""
            } ${
              showResizer 
                ? "border-2 border-dashed border-[#ff5c71]/30 rounded-xl shadow-2xl shadow-[#ff5c71]/5 bg-[#030303] overflow-hidden p-2 md:p-3" 
                : ""
            }`}
            style={{ 
              width: previewWidth, 
              maxWidth: "100%",
              height: "100%"
            }}
          >
            {ComponentToRender ? (
              <ComponentToRender {...playgroundProps} key={JSON.stringify(playgroundProps)} />
            ) : React.isValidElement(component) ? (
              React.cloneElement(component, {
                ...playgroundProps,
                key: JSON.stringify(playgroundProps)
              })
            ) : (
              component
            )}

            {/* Draggable resize handle */}
            {showResizer && (
              <div
                onMouseDown={startResize}
                onTouchStart={startResize}
                className="absolute top-0 bottom-0 -right-3 w-6 flex items-center justify-center cursor-ew-resize group/resizer z-30 select-none"
                title="Drag to resize viewport"
              >
                <div className="w-1.5 h-12 bg-white/10 group-hover/resizer:bg-[#ff5c71] group-active/resizer:bg-[#ff5c71] rounded-full transition-all flex flex-col items-center justify-center gap-0.5 shadow-md shadow-black/50 border border-white/5 group-hover/resizer:scale-x-125 duration-200">
                  <span className="w-0.5 h-0.5 rounded-full bg-white/40 group-hover/resizer:bg-white" />
                  <span className="w-0.5 h-0.5 rounded-full bg-white/40 group-hover/resizer:bg-white" />
                  <span className="w-0.5 h-0.5 rounded-full bg-white/40 group-hover/resizer:bg-white" />
                </div>
              </div>
            )}
          </div>
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
                      onClick={() => handleCopy(dynamicUsageCode, setCopiedUsage)}
                      className="px-3 py-1 bg-[#111] hover:bg-[#ff5c71] text-[#555] hover:text-[#050505] transition-all duration-200 border border-[#1a1a1a] hover:border-[#ff5c71] font-mono text-[10px] uppercase tracking-wider cursor-pointer active:scale-95 hover:scale-[1.02]"
                    >
                      {copiedUsage ? "Copied Code" : "Copy Code"}
                    </button>
                  </div>
                  <div className="relative bg-[#030303] border border-[#1a1a1a] rounded-[6px] overflow-hidden shadow-2xl">
                    <div className="px-4 py-2 border-b border-[#111] bg-[#0c0c0c] flex items-center justify-between">
                      <span className="font-mono text-[11px] text-[#ff5c71] font-bold">app/page.tsx</span>
                    </div>
                    <pre className="p-4 overflow-auto text-xs font-mono text-white/80 leading-relaxed max-h-[350px] scrollbar-thin scrollbar-thumb-zinc-800 scrollbar-track-transparent">
                      <code dangerouslySetInnerHTML={{ __html: highlightSyntax(dynamicUsageCode) }} />
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
                  <div className="relative bg-[#030303] border border-[#1a1a1a] rounded-[6px] overflow-hidden shadow-2xl">
                    <div className="px-4 py-2 border-b border-[#111] bg-[#0c0c0c] flex items-center justify-between">
                      <span className="font-mono text-[11px] text-[#7fff5e] font-bold">components/{compSlug}.tsx</span>
                    </div>
                    <pre className="p-4 overflow-auto text-xs font-mono text-white/80 leading-relaxed max-h-[450px] scrollbar-thin scrollbar-thumb-zinc-800 scrollbar-track-transparent">
                      <code dangerouslySetInnerHTML={{ __html: highlightSyntax(codeSnippet) }} />
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

      {/* Interactive Playground & API Reference */}
      {propsList.length > 0 && (
        <div className="mt-12 border-t border-[#ff5c71]/15 pt-10 grid grid-cols-1 lg:grid-cols-12 gap-8">
          {/* Left: Controls / Sliders */}
          <div className="lg:col-span-5 space-y-6">
            <div>
              <h4 className="text-xl font-black uppercase text-[#f4f4f4] tracking-tight flex items-center gap-2" style={{ fontFamily: "var(--font-londrina-solid)" }}>
                <span className="w-2.5 h-2.5 rounded-full bg-[#7fff5e] animate-pulse" />
                Interactive Playground
              </h4>
              <p className="text-xs font-mono text-[#555] mt-1">Adjust sliders and values to preview changes in real-time</p>
            </div>

            <div className="bg-[#070707] border border-[#ff5c71]/10 p-5 rounded-lg space-y-5">
              {propsList.map((prop) => {
                if (!prop.control) return null;
                const value = playgroundProps[prop.name] ?? "";

                return (
                  <div key={prop.name} className="space-y-2">
                    <div className="flex justify-between items-center">
                      <span className="font-mono text-xs text-[#e5e5e5] font-bold">{prop.name}</span>
                      <span className="font-mono text-[10px] text-[#ff5c71]">{String(value)}</span>
                    </div>

                    {prop.control.type === "slider" && (
                      <input
                        type="range"
                        min={prop.control.min ?? 0}
                        max={prop.control.max ?? 100}
                        step={prop.control.step ?? 1}
                        value={Number(value)}
                        onChange={(e) => {
                          setPlaygroundProps(prev => ({
                            ...prev,
                            [prop.name]: Number(e.target.value)
                          }));
                        }}
                        className="w-full h-1 bg-[#151515] rounded-lg appearance-none cursor-pointer accent-[#ff5c71]"
                      />
                    )}

                    {prop.control.type === "text" && (
                      <input
                        type="text"
                        value={String(value)}
                        onChange={(e) => {
                          setPlaygroundProps(prev => ({
                            ...prev,
                            [prop.name]: e.target.value
                          }));
                        }}
                        className="w-full bg-[#0a0a0a] border border-[#1a1a1a] rounded px-3 py-1.5 font-mono text-xs text-[#f4f4f4] focus:border-[#ff5c71]/40 outline-none"
                      />
                    )}

                    {prop.control.type === "color" && (
                      <div className="flex gap-2">
                        <input
                          type="color"
                          value={String(value).startsWith("rgba") ? "#ff5c71" : String(value)}
                          onChange={(e) => {
                            setPlaygroundProps(prev => ({
                              ...prev,
                              [prop.name]: e.target.value
                            }));
                          }}
                          className="w-8 h-8 rounded border border-[#1a1a1a] bg-[#0a0a0a] cursor-pointer"
                        />
                        <input
                          type="text"
                          value={String(value)}
                          onChange={(e) => {
                            setPlaygroundProps(prev => ({
                              ...prev,
                              [prop.name]: e.target.value
                            }));
                          }}
                          className="flex-1 bg-[#0a0a0a] border border-[#1a1a1a] rounded px-3 py-1.5 font-mono text-xs text-[#f4f4f4] focus:border-[#ff5c71]/40 outline-none"
                        />
                      </div>
                    )}
                    
                    <p className="text-[10px] font-mono text-[#555] leading-relaxed">{prop.description}</p>
                  </div>
                );
              })}

              <button
                onClick={() => {
                  const defaults: Record<string, any> = {};
                  propsList.forEach(p => {
                    if (p.defaultValue.startsWith('"') || p.defaultValue.startsWith("'")) {
                      defaults[p.name] = p.defaultValue.slice(1, -1);
                    } else if (p.defaultValue === "true") {
                      defaults[p.name] = true;
                    } else if (p.defaultValue === "false") {
                      defaults[p.name] = false;
                    } else {
                      const val = Number(p.defaultValue);
                      defaults[p.name] = isNaN(val) ? p.defaultValue : val;
                    }
                  });
                  setPlaygroundProps(defaults);
                }}
                className="w-full py-2 bg-[#0d0d0d] hover:bg-[#151515] border border-[#1a1a1a] text-[#777] hover:text-[#f4f4f4] font-mono text-[10px] uppercase tracking-widest transition-all rounded cursor-pointer active:scale-98"
              >
                Reset Default Settings
              </button>
            </div>
          </div>

          {/* Right: API Reference Table */}
          <div className="lg:col-span-7 space-y-6 font-sans">
            <div>
              <h4 className="text-xl font-black uppercase text-[#f4f4f4] tracking-tight" style={{ fontFamily: "var(--font-londrina-solid)" }}>
                API Reference (Props)
              </h4>
              <p className="text-xs font-mono text-[#555] mt-1">Component properties and type specifications</p>
            </div>

            <div className="border border-[#1a1a1a] bg-[#070707] rounded-lg overflow-hidden">
              <table className="w-full border-collapse text-left font-mono text-xs">
                <thead>
                  <tr className="border-b border-[#1a1a1a] bg-[#0d0d0d] text-[#ff5c71]">
                    <th className="p-3.5 font-bold uppercase tracking-wider">Prop</th>
                    <th className="p-3.5 font-bold uppercase tracking-wider">Type</th>
                    <th className="p-3.5 font-bold uppercase tracking-wider">Default</th>
                    <th className="p-3.5 font-bold uppercase tracking-wider">Description</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-[#111] text-[#ccc]">
                  {propsList.map((prop) => (
                    <tr key={prop.name} className="hover:bg-white/[0.01] transition-colors">
                      <td className="p-3.5 font-bold text-white">{prop.name}</td>
                      <td className="p-3.5 text-[#7fff5e]">{prop.type}</td>
                      <td className="p-3.5 text-[#ff5c71]/80">{prop.defaultValue}</td>
                      <td className="p-3.5 text-[#777] leading-relaxed text-[11px]">{prop.description}</td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          </div>
        </div>
      )}
    </article>
  );
}
