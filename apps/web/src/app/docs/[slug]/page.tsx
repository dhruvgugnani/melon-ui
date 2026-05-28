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
      { id: "dependencies", text: "Dependencies" },
      { id: "css-setup", text: "CSS Setup" },
      { id: "typescript", text: "TypeScript" },
    ],
    render: (copyFn, copiedId) => (
      <div className="space-y-10">
        <section id="dependencies" className="space-y-4">
          <h2 id="dependencies" className="text-3xl font-black uppercase text-white" style={{ fontFamily: "var(--font-londrina-solid)" }}>
            Dependencies
          </h2>
          <p className="text-white/60 leading-relaxed text-sm">
            Before using any MelonUI component, you need to install the required animation and rendering packages. Run the following command in your terminal:
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
      { id: "setup", text: "Setup" },
      { id: "init-command", text: "Initialization" },
      { id: "add-command", text: "Adding Components" },
    ],
    render: (copyFn, copiedId) => (
      <div className="space-y-10">
        <section id="setup" className="space-y-4">
          <h2 id="setup" className="text-3xl font-black uppercase text-white" style={{ fontFamily: "var(--font-londrina-solid)" }}>
            Setup
          </h2>
          <p className="text-white/60 leading-relaxed text-sm">
            The CLI tool lets you pull components directly from our registry straight into your project folder. No copy-pasting required. Install it globally or run it via npx:
          </p>
          <div className="relative">
            <pre className="p-4 bg-zinc-950 border border-white/10 rounded-[6px] font-mono text-xs text-[#7fff5e] overflow-x-auto select-all">
              npx @melonui-dev/cli --help
            </pre>
            <button
              onClick={() => copyFn("npx @melonui-dev/cli --help", "cli-help")}
              className="absolute right-3 top-3 px-2.5 py-1 rounded bg-white/5 border border-white/10 text-white/50 hover:text-white hover:bg-white/10 transition-all font-mono text-[9px] cursor-pointer"
            >
              {copiedId === "cli-help" ? "COPIED" : "COPY"}
            </button>
          </div>
        </section>

        <section id="init-command" className="space-y-4">
          <h2 id="init-command" className="text-3xl font-black uppercase text-white" style={{ fontFamily: "var(--font-londrina-solid)" }}>
            Initialization
          </h2>
          <p className="text-white/60 leading-relaxed text-sm">
            Configure your local directories. Run the initialization command at the root of your project:
          </p>
          <div className="relative">
            <pre className="p-4 bg-zinc-950 border border-white/10 rounded-[6px] font-mono text-xs text-[#7fff5e] overflow-x-auto select-all">
              npx @melonui-dev/cli init
            </pre>
            <button
              onClick={() => copyFn("npx @melonui-dev/cli init", "cli-init")}
              className="absolute right-3 top-3 px-2.5 py-1 rounded bg-white/5 border border-white/10 text-white/50 hover:text-white hover:bg-white/10 transition-all font-mono text-[9px] cursor-pointer"
            >
              {copiedId === "cli-init" ? "COPIED" : "COPY"}
            </button>
          </div>
          <p className="text-white/40 text-xs leading-relaxed font-sans">
            This will query your preferences (components folder, CSS filepath) and create a local config file `melonui.json`.
          </p>
        </section>

        <section id="add-command" className="space-y-4">
          <h2 id="add-command" className="text-3xl font-black uppercase text-white" style={{ fontFamily: "var(--font-londrina-solid)" }}>
            Adding Components
          </h2>
          <p className="text-white/60 leading-relaxed text-sm">
            Add any component to your workspace using the `add` command:
          </p>
          <div className="relative">
            <pre className="p-4 bg-zinc-950 border border-white/10 rounded-[6px] font-mono text-xs text-[#7fff5e] overflow-x-auto select-all">
              npx @melonui-dev/cli add burst-button
            </pre>
            <button
              onClick={() => copyFn("npx @melonui-dev/cli add burst-button", "cli-add")}
              className="absolute right-3 top-3 px-2.5 py-1 rounded bg-white/5 border border-white/10 text-white/50 hover:text-white hover:bg-white/10 transition-all font-mono text-[9px] cursor-pointer"
            >
              {copiedId === "cli-add" ? "COPIED" : "COPY"}
            </button>
          </div>
          <p className="text-white/40 text-xs leading-relaxed font-sans">
            The CLI automatically reads the component&apos;s registry record, installs missing packages, fetches dependencies, and drops the raw TSX component file straight into your components folder.
          </p>
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
