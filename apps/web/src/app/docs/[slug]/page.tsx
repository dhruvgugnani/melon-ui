"use client";

import React, { useState } from "react";
import { notFound, useParams } from "next/navigation";

interface DocContent {
  title: string;
  category: string;
  description: string;
  headings: { id: string; text: string }[];
  render: (copyFn: (text: string, id: string) => void, copiedId: string | null) => React.ReactNode;
}

const DOCS_DATA: Record<string, DocContent> = {
  introduction: {
    title: "Introduction",
    category: "Getting Started",
    description: "Welcome to MelonUI, the premium Gen-Z component lab.",
    headings: [
      { id: "welcome", text: "Welcome" },
      { id: "philosophy", text: "Philosophy" },
      { id: "tech-stack", text: "Tech Stack" },
    ],
    render: () => (
      <div className="space-y-10">
        <section id="welcome" className="space-y-4">
          <h2 id="welcome" className="text-3xl font-black uppercase text-white" style={{ fontFamily: "var(--font-londrina-solid)" }}>
            Welcome
          </h2>
          <p className="text-white/60 leading-relaxed text-sm">
            MelonUI is a hand-crafted collection of premium, chaotic, and highly animated interactive components designed for the modern web. Built specifically for developers who value design taste and visual excellence, MelonUI drops custom WebGL, Three.js, and GSAP pieces directly into your codebase.
          </p>
        </section>

        <section id="philosophy" className="space-y-4">
          <h2 id="philosophy" className="text-3xl font-black uppercase text-white" style={{ fontFamily: "var(--font-londrina-solid)" }}>
            Philosophy
          </h2>
          <p className="text-white/60 leading-relaxed text-sm">
            MelonUI believes that interfaces should feel alive. We deliver layout disruptions, spring physics, dynamic cursor trails, and WebGL particle fields that wow users at first glance. We prioritize premium, memorable visual design over boring defaults.
          </p>
        </section>

        <section id="tech-stack" className="space-y-4">
          <h2 id="tech-stack" className="text-3xl font-black uppercase text-white" style={{ fontFamily: "var(--font-londrina-solid)" }}>
            Tech Stack
          </h2>
          <p className="text-white/60 leading-relaxed text-sm">
            MelonUI is built on top of industry-standard animation and rendering tools:
          </p>
          <ul className="list-disc pl-5 space-y-2 text-white/50 text-sm">
            <li>
              <strong className="text-white">GSAP (GreenSock)</strong>: Used for high-performance timeline sequencing and micro-interactions.
            </li>
            <li>
              <strong className="text-white">Three.js / React Three Fiber (R3F)</strong>: Used for hardware-accelerated 3D meshes, particle clouds, and shaders.
            </li>
            <li>
              <strong className="text-white">Framer Motion</strong>: Handles simple spring physics, layout updates, and SVG path morphing.
            </li>
            <li>
              <strong className="text-white">Tailwind CSS v4</strong>: Clean styling configurations utilizing CSS design tokens.
            </li>
          </ul>
        </section>
      </div>
    ),
  },
  installation: {
    title: "Installation",
    category: "Getting Started",
    description: "Learn how to configure your project and install the necessary dependencies for MelonUI.",
    headings: [
      { id: "cli-setup", text: "CLI Setup" },
      { id: "dependencies", text: "Manual Dependencies" },
      { id: "css-setup", text: "CSS Setup" },
      { id: "typescript", text: "TypeScript" },
    ],
    render: (copyFn, copiedId) => (
      <div className="space-y-10">
        <section id="cli-setup" className="space-y-4">
          <h2 id="cli-setup" className="text-3xl font-black uppercase text-white" style={{ fontFamily: "var(--font-londrina-solid)" }}>
            CLI Setup (Recommended)
          </h2>
          <p className="text-white/60 leading-relaxed text-sm">
            The fastest way to get started is by using the official MelonUI CLI. You can install it globally or run it on-the-fly using <code className="text-white font-mono px-1 py-0.5 rounded bg-white/5">npx</code>.
          </p>
          
          <div className="space-y-3">
            <h3 className="text-lg font-bold text-white/90">Global Installation</h3>
            <p className="text-white/50 leading-relaxed text-xs">
              Install the CLI globally to access the <code className="text-white font-mono">melonui</code> binary anywhere on your system:
            </p>
            <div className="relative">
              <pre className="p-4 bg-zinc-950 border border-white/10 rounded-[6px] font-mono text-xs text-[#7fff5e] overflow-x-auto select-all">
                npm install -g @melonui-dev/cli
              </pre>
              <button
                onClick={() => copyFn("npm install -g @melonui-dev/cli", "global-cli")}
                className="absolute right-3 top-3 px-2.5 py-1 rounded bg-white/5 border border-white/10 text-white/50 hover:text-white hover:bg-white/10 transition-all font-mono text-[9px] cursor-pointer"
              >
                {copiedId === "global-cli" ? "COPIED" : "COPY"}
              </button>
            </div>
          </div>

          <div className="space-y-3 pt-2">
            <h3 className="text-lg font-bold text-white/90">Initialize Project</h3>
            <p className="text-white/50 leading-relaxed text-xs">
              Run the initialization command at the root of your project to detect package manager, install core helpers, and configure directory paths:
            </p>
            <div className="relative">
              <pre className="p-4 bg-zinc-950 border border-white/10 rounded-[6px] font-mono text-xs text-[#7fff5e] overflow-x-auto select-all">
                melonui init
              </pre>
              <button
                onClick={() => copyFn("melonui init", "global-init")}
                className="absolute right-3 top-3 px-2.5 py-1 rounded bg-white/5 border border-white/10 text-white/50 hover:text-white hover:bg-white/10 transition-all font-mono text-[9px] cursor-pointer"
              >
                {copiedId === "global-init" ? "COPIED" : "COPY"}
              </button>
            </div>
            <p className="text-white/40 text-[11px] leading-relaxed">
              *Alternative npx usage: <code className="text-white/70">npx @melonui-dev/cli init</code>
            </p>
          </div>

          <div className="space-y-3 pt-2">
            <h3 className="text-lg font-bold text-white/90">Add Components & Interactive List</h3>
            <p className="text-white/50 leading-relaxed text-xs">
              To view all available components and select which ones to add, run the <code className="text-white font-mono">add</code> command without any arguments. This fetches the remote registry list and opens a searchable, interactive multiselect menu:
            </p>
            <div className="relative">
              <pre className="p-4 bg-zinc-950 border border-white/10 rounded-[6px] font-mono text-xs text-[#7fff5e] overflow-x-auto select-all">
                melonui add
              </pre>
              <button
                onClick={() => copyFn("melonui add", "global-add-interactive")}
                className="absolute right-3 top-3 px-2.5 py-1 rounded bg-white/5 border border-white/10 text-white/50 hover:text-white hover:bg-white/10 transition-all font-mono text-[9px] cursor-pointer"
              >
                {copiedId === "global-add-interactive" ? "COPIED" : "COPY"}
              </button>
            </div>
            <p className="text-white/40 text-[11px] leading-relaxed">
              *Use the arrow keys to browse, <kbd className="bg-white/10 px-1 rounded">Space</kbd> to select/deselect, start typing to search/filter the registry, and press <kbd className="bg-white/10 px-1 rounded">Enter</kbd> to install.
            </p>
          </div>
        </section>

        <section id="dependencies" className="space-y-4">
          <h2 id="dependencies" className="text-3xl font-black uppercase text-white" style={{ fontFamily: "var(--font-londrina-solid)" }}>
            Manual Dependencies
          </h2>
          <p className="text-white/60 leading-relaxed text-sm">
            Before using any MelonUI component manually, you need to install the required animation and rendering packages. Run the following command in your terminal:
          </p>
          <div className="relative">
            <pre className="p-4 bg-zinc-950 border border-white/10 rounded-[6px] font-mono text-xs text-[#7fff5e] overflow-x-auto select-all">
              npm install gsap @gsap/react three @react-three/fiber @react-three/drei clsx tailwind-merge framer-motion lenis
            </pre>
            <button
              onClick={() => copyFn("npm install gsap @gsap/react three @react-three/fiber @react-three/drei clsx tailwind-merge framer-motion lenis", "deps")}
              className="absolute right-3 top-3 px-2.5 py-1 rounded bg-white/5 border border-white/10 text-white/50 hover:text-white hover:bg-white/10 transition-all font-mono text-[9px] cursor-pointer"
            >
              {copiedId === "deps" ? "COPIED" : "COPY"}
            </button>
          </div>
        </section>

        <section id="css-setup" className="space-y-4">
          <h2 id="css-setup" className="text-3xl font-black uppercase text-white" style={{ fontFamily: "var(--font-londrina-solid)" }}>
            CSS Setup
          </h2>
          <p className="text-white/60 leading-relaxed text-sm">
            Configure your global CSS variables to support MelonUI&apos;s custom color mapping (coral-red and neon-green accents). Add the following variables to your global CSS stylesheet:
          </p>
          <div className="relative">
            <pre className="p-4 bg-zinc-950 border border-white/10 rounded-[6px] font-mono text-xs text-white/70 overflow-x-auto select-all">
{`:root {
  --color-[#ff5c71]: #ff5c71; /* Coral Red */
  --color-[#7fff5e]: #7fff5e; /* Neon Green */
  --color-[#e0f2dc]: #e0f2dc; /* Pale White */
  --font-londrina-solid: 'Londrina Solid', sans-serif;
}`}
            </pre>
            <button
              onClick={() => copyFn(`:root {\n  --color-[#ff5c71]: #ff5c71;\n  --color-[#7fff5e]: #7fff5e;\n  --color-[#e0f2dc]: #e0f2dc;\n  --font-londrina-solid: 'Londrina Solid', sans-serif;\n}`, "css")}
              className="absolute right-3 top-3 px-2.5 py-1 rounded bg-white/5 border border-white/10 text-white/50 hover:text-white hover:bg-white/10 transition-all font-mono text-[9px] cursor-pointer"
            >
              {copiedId === "css" ? "COPIED" : "COPY"}
            </button>
          </div>
        </section>

        <section id="typescript" className="space-y-4">
          <h2 id="typescript" className="text-3xl font-black uppercase text-white" style={{ fontFamily: "var(--font-londrina-solid)" }}>
            TypeScript
          </h2>
          <p className="text-white/60 leading-relaxed text-sm">
            MelonUI components are fully typed out. Ensure your project&apos;s tsconfig options support path mappings and module resolution:
          </p>
          <pre className="p-4 bg-zinc-950 border border-white/10 rounded-[6px] font-mono text-xs text-white/60 overflow-x-auto">
{`{
  "compilerOptions": {
    "baseUrl": ".",
    "paths": {
      "@/*": ["./src/*"]
    }
  }
}`}
          </pre>
        </section>
      </div>
    ),
  },
  cli: {
    title: "CLI Tool",
    category: "Getting Started",
    description: "Discover how to use the MelonUI CLI to quickly add components to your codebase.",
    headings: [
      { id: "global-vs-npx", text: "Installation & Execution" },
      { id: "interactive-mode", text: "Interactive Mode" },
      { id: "cli-commands", text: "Command Reference" },
    ],
    render: (copyFn, copiedId) => (
      <div className="space-y-10">
        <section id="global-vs-npx" className="space-y-4">
          <h2 id="global-vs-npx" className="text-3xl font-black uppercase text-white" style={{ fontFamily: "var(--font-londrina-solid)" }}>
            Installation & Execution
          </h2>
          <p className="text-white/60 leading-relaxed text-sm">
            You can run the MelonUI CLI tool globally on your system, or execute it dynamically on-demand using <code className="text-white font-mono px-1 py-0.5 rounded bg-white/5">npx</code>.
          </p>
          
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4 pt-2">
            <div className="p-4 bg-white/5 border border-white/10 rounded-[6px] space-y-3">
              <h3 className="text-sm font-bold text-white uppercase tracking-wider font-mono">1. Global Installation</h3>
              <p className="text-white/50 text-xs leading-relaxed">
                Install once globally to access the command directly as <code className="text-white font-mono">melonui</code>:
              </p>
              <div className="relative">
                <pre className="p-2.5 bg-zinc-950 border border-white/5 rounded font-mono text-[11px] text-[#7fff5e] overflow-x-auto select-all">
                  npm install -g @melonui-dev/cli
                </pre>
                <button
                  onClick={() => copyFn("npm install -g @melonui-dev/cli", "cli-global-inst")}
                  className="absolute right-2 top-2 px-1.5 py-0.5 rounded bg-white/5 border border-white/10 text-white/50 hover:text-white hover:bg-white/10 transition-all font-mono text-[8px] cursor-pointer"
                >
                  {copiedId === "cli-global-inst" ? "COPIED" : "COPY"}
                </button>
              </div>
              <p className="text-white/40 text-[10px] leading-relaxed">
                Once installed, run any command prefixing with <code className="text-white/60">melonui</code> (e.g. <code className="text-white/60">melonui init</code>).
              </p>
            </div>

            <div className="p-4 bg-white/5 border border-white/10 rounded-[6px] space-y-3">
              <h3 className="text-sm font-bold text-white uppercase tracking-wider font-mono">2. Dynamic Execution</h3>
              <p className="text-white/50 text-xs leading-relaxed">
                Run directly using <code className="text-white font-mono">npx</code> without a global installation:
              </p>
              <div className="relative">
                <pre className="p-2.5 bg-zinc-950 border border-white/5 rounded font-mono text-[11px] text-[#7fff5e] overflow-x-auto select-all">
                  npx @melonui-dev/cli [command]
                </pre>
                <button
                  onClick={() => copyFn("npx @melonui-dev/cli", "cli-npx-inst")}
                  className="absolute right-2 top-2 px-1.5 py-0.5 rounded bg-white/5 border border-white/10 text-white/50 hover:text-white hover:bg-white/10 transition-all font-mono text-[8px] cursor-pointer"
                >
                  {copiedId === "cli-npx-inst" ? "COPIED" : "COPY"}
                </button>
              </div>
              <p className="text-white/40 text-[10px] leading-relaxed">
                Useful for environments where you don&apos;t want to maintain global node_modules dependencies.
              </p>
            </div>
          </div>
        </section>

        <section id="interactive-mode" className="space-y-4">
          <h2 id="interactive-mode" className="text-3xl font-black uppercase text-white" style={{ fontFamily: "var(--font-londrina-solid)" }}>
            Interactive Modes
          </h2>
          <p className="text-white/60 leading-relaxed text-sm">
            MelonUI provides a rich console interface. If you call commands without parameters, it opens intuitive interactive screens.
          </p>

          <div className="space-y-4">
            <div className="border border-white/10 bg-zinc-950/40 p-4 rounded-[6px] space-y-2">
              <h3 className="text-sm font-bold text-[#7fff5e] font-mono">Interactive Navigation Dashboard</h3>
              <p className="text-white/60 text-xs leading-relaxed">
                Running the binary with zero arguments opens the main dashboard prompt:
              </p>
              <pre className="p-3 bg-zinc-950 rounded font-mono text-[11px] text-white/40 border border-white/5">
{`$ melonui

What would you like to do?
> Initialize MelonUI Project   (Set up utils, paths, and core dependencies)
  Add/Install Components       (Search, select, and install components dynamically)
  Exit`}
              </pre>
            </div>

            <div className="border border-white/10 bg-zinc-950/40 p-4 rounded-[6px] space-y-2">
              <h3 className="text-sm font-bold text-[#7fff5e] font-mono">Searchable Component Multiselect List</h3>
              <p className="text-white/60 text-xs leading-relaxed">
                Running <code className="text-white font-mono">melonui add</code> (or <code className="text-white font-mono">npx @melonui-dev/cli add</code>) without a component name fetches the entire remote component registry list and launches a searchable multi-select selector:
              </p>
              <pre className="p-3 bg-zinc-950 rounded font-mono text-[11px] text-white/40 border border-white/5">
{`$ melonui add
Fetching components from MelonUI registry...

Select components to install (Space to select, Enter to confirm, type to search)
> [ ] Burst Button [Buttons] - Seeds physically burst from click point
  [ ] Ripple Button [Buttons] - Radial click ripple effect
  [ ] Luminous Waves [Backgrounds] - Hardware accelerated WebGL wave field
  [ ] Retro Grid [Backgrounds] - Nostalgic neon perspective grid`}
              </pre>
              <ul className="list-disc pl-5 text-white/50 text-[11px] space-y-1">
                <li>Use <kbd className="bg-white/10 px-1.5 py-0.5 rounded text-white font-bold">Arrow Keys</kbd> (Up/Down) to navigate components.</li>
                <li>Press <kbd className="bg-white/10 px-1.5 py-0.5 rounded text-white font-bold">Spacebar</kbd> to select or deselect components.</li>
                <li>Start typing characters to filter/search dynamically by name, category, or description.</li>
                <li>Press <kbd className="bg-white/10 px-1.5 py-0.5 rounded text-white font-bold">Enter</kbd> to download and install all selected components.</li>
              </ul>
            </div>
          </div>
        </section>

        <section id="cli-commands" className="space-y-4">
          <h2 id="cli-commands" className="text-3xl font-black uppercase text-white" style={{ fontFamily: "var(--font-londrina-solid)" }}>
            Command Reference
          </h2>
          
          <div className="space-y-6">
            <div className="space-y-2">
              <div className="flex items-center gap-3">
                <span className="font-mono px-2 py-1 bg-[#ff5c71]/10 text-[#ff5c71] text-xs font-bold rounded">init</span>
                <span className="text-white/50 text-xs font-mono">melonui init</span>
              </div>
              <p className="text-white/60 text-xs leading-relaxed pl-2">
                Initializes the MelonUI workspace configurations. It detects your package manager, installs core requirements (<code className="text-white/80 font-mono">clsx</code> and <code className="text-white/80 font-mono">tailwind-merge</code>), and copies a standard <code className="text-white/80 font-mono">utils.ts</code> file containing the custom Tailwind utility classes joiner.
              </p>
            </div>

            <div className="space-y-2">
              <div className="flex items-center gap-3">
                <span className="font-mono px-2 py-1 bg-[#ff5c71]/10 text-[#ff5c71] text-xs font-bold rounded">add [component]</span>
                <span className="text-white/50 text-xs font-mono">melonui add [component]</span>
              </div>
              <p className="text-white/60 text-xs leading-relaxed pl-2">
                Pulls the specified component from the registry. If a component name is provided (e.g. <code className="text-white/80 font-mono">melonui add burst-button</code>), it is downloaded directly. If not, it opens the interactive search menu. The CLI automatically downloads the necessary files, resolves dependencies, and installs them using your detected package manager.
              </p>
            </div>

            <div className="space-y-2">
              <div className="flex items-center gap-3">
                <span className="font-mono px-2 py-1 bg-[#ff5c71]/10 text-[#ff5c71] text-xs font-bold rounded">--help</span>
                <span className="text-white/50 text-xs font-mono">melonui --help</span>
              </div>
              <p className="text-white/60 text-xs leading-relaxed pl-2">
                Displays usage information, package version, list of commands, and descriptive options.
              </p>
            </div>
          </div>
        </section>
      </div>
    ),
  },
};

export default function DocPage() {
  const params = useParams();
  const slug = (params?.slug as string) || "introduction";

  const [copiedId, setCopiedId] = useState<string | null>(null);

  const doc = DOCS_DATA[slug];

  if (!doc) {
    notFound();
  }

  const handleCopy = async (text: string, id: string) => {
    try {
      await navigator.clipboard.writeText(text);
      setCopiedId(id);
      setTimeout(() => setCopiedId(null), 2000);
    } catch (err) {
      console.error("Failed to copy text:", err);
    }
  };

  return (
    <article className="space-y-8 select-text">
      {/* Header */}
      <header className="space-y-4">
        <div className="flex items-center gap-2">
          <span className="font-mono text-[9px] text-[#ff5c71] uppercase tracking-[0.25em]">
            {doc.category}
          </span>
          <span className="h-px w-6 bg-white/10" />
          <span className="font-mono text-[9px] text-white/30 uppercase tracking-[0.25em]">
            Docs
          </span>
        </div>
        <h1
          className="text-5xl md:text-7xl font-black uppercase tracking-tighter text-white leading-none"
          style={{ fontFamily: "var(--font-londrina-solid)" }}
        >
          {doc.title}
        </h1>
        <p className="font-mono text-white/50 text-sm max-w-xl leading-relaxed">
          {doc.description}
        </p>
      </header>

      {/* Separator */}
      <div className="h-px w-full bg-white/5" />

      {/* Render Document Sections */}
      <div className="pt-4">{doc.render(handleCopy, copiedId)}</div>
    </article>
  );
}
