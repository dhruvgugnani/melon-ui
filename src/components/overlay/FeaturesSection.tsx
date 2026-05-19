"use client";

import Link from "next/link";

const COMPONENTS = [
  {
    name: "Seed Command",
    detail: "copy-ready terminal",
    access: "Free",
    href: "/community#core",
    accent: "#ff5c71",
    kind: "terminal",
  },
  {
    name: "Rind Tags",
    detail: "animated token input",
    access: "Free",
    href: "/community#inputs",
    accent: "#7fff5e",
    kind: "tags",
  },
  {
    name: "Slice Wipe",
    detail: "page transition",
    access: "Pro later",
    href: "/community#transitions",
    accent: "#e0f2dc",
    kind: "wipe",
  },
] as const;

type ComponentKind = (typeof COMPONENTS)[number]["kind"];

function ComponentPreview({ kind, accent }: { kind: ComponentKind; accent: string }) {
  if (kind === "terminal") {
    return (
      <div className="relative h-28 overflow-hidden rounded-[8px] border border-white/10 bg-[#060606] p-3 md:h-52 md:p-4">
        <div className="mb-3 flex gap-2 md:mb-5">
          <span className="h-2.5 w-2.5 rounded-full bg-[#ff5c71]" />
          <span className="h-2.5 w-2.5 rounded-full bg-[#e0f2dc]" />
          <span className="h-2.5 w-2.5 rounded-full bg-[#7fff5e]" />
        </div>
        {["npx melonui add seed-command", "copying motion primitives", "drop installed"].map((line, index) => (
          <p key={line} className="mb-2 font-mono text-[10px] uppercase text-white/54 md:mb-3 md:text-xs" style={{ letterSpacing: 0 }}>
            <span style={{ color: index === 0 ? accent : "#7fff5e" }}>{index === 0 ? "$" : ">"}</span> {line}
          </p>
        ))}
        <div className="absolute bottom-3 right-3 hidden h-14 w-14 rounded-full border border-white/10 bg-black sm:block md:bottom-4 md:right-4">
          <span className="absolute left-5 top-2 h-8 w-4 rotate-12 rounded-[50%] border border-[#ff5c71] bg-[#050505]" />
        </div>
      </div>
    );
  }

  if (kind === "tags") {
    return (
      <div className="relative flex h-28 flex-col justify-between overflow-hidden rounded-[8px] border border-white/10 bg-[#060606] p-3 md:h-52 md:p-4">
        <div className="flex flex-wrap gap-2">
          {["motion", "button", "rind", "free"].map((tag, index) => (
            <span
              key={tag}
              className="rounded-full border px-2 py-1.5 font-mono text-[10px] uppercase md:px-3 md:py-2 md:text-[11px]"
              style={{
                borderColor: index === 1 ? accent : "rgba(255,255,255,0.12)",
                color: index === 1 ? "#050505" : "rgba(255,255,255,0.64)",
                background: index === 1 ? accent : "rgba(255,255,255,0.04)",
                letterSpacing: 0,
              }}
            >
              {tag}
            </span>
          ))}
        </div>
        <div className="relative h-11 rounded-[8px] border border-white/10 bg-black/60 px-3 py-2 md:h-14 md:px-4 md:py-3">
          <span className="font-mono text-xs uppercase text-white/32" style={{ letterSpacing: 0 }}>add component...</span>
          <span className="absolute bottom-0 left-0 h-0.5 w-2/3" style={{ background: accent }} />
        </div>
      </div>
    );
  }

  return (
    <div className="relative h-28 overflow-hidden rounded-[8px] border border-white/10 bg-[#060606] md:h-52">
      <div className="absolute inset-y-0 left-0 w-[58%] -skew-x-12 bg-[#ff5c71]" />
      <div className="absolute inset-y-0 right-0 w-[54%] skew-x-12 bg-[#7fff5e]" />
      <div className="absolute inset-5 flex items-center justify-center border border-black/25 bg-black/70 backdrop-blur-sm">
        <p className="text-center text-3xl font-black uppercase leading-[0.82] text-white md:text-5xl" style={{ fontFamily: "var(--font-londrina-solid)", letterSpacing: 0 }}>
          Page<br />Slice
        </p>
      </div>
    </div>
  );
}

export function FeaturesSection() {
  return (
    <section
      id="features-section"
      className="snap-start relative z-10 flex h-screen w-full items-center overflow-hidden"
      style={{ scrollSnapStop: "always" }}
    >
      <div className="grid w-full grid-cols-12 items-center gap-5 px-6 md:px-10">
        <div className="col-span-12 lg:col-span-3">
          <p className="mb-3 font-mono text-xs uppercase text-[#e0f2dc]/70" style={{ letterSpacing: 0 }}>
            Chapter 02 / Seeds become UI
          </p>
          <h2
            className="font-black uppercase leading-[0.84] text-white text-[clamp(2.7rem,14vw,4.4rem)] md:text-[clamp(3rem,6vw,6.4rem)]"
            style={{ fontFamily: "var(--font-londrina-solid)", letterSpacing: 0 }}
          >
            Component
            <span className="block text-[#7fff5e]">Previews</span>
          </h2>
        </div>

        <div className="col-span-12 grid gap-2 md:grid-cols-3 md:gap-3 lg:col-span-9">
          {COMPONENTS.map((component, index) => (
            <Link
              key={component.name}
              href={component.href}
              className={`group relative overflow-hidden rounded-[8px] border border-white/10 bg-black/54 p-3 backdrop-blur-md transition-transform hover:-translate-y-1 md:p-4 ${index > 1 ? "hidden md:block" : ""}`}
            >
              <span className="absolute right-4 top-3 font-mono text-xs text-white/22">
                {String(index + 1).padStart(2, "0")}
              </span>
              <ComponentPreview kind={component.kind} accent={component.accent} />
              <div className="mt-3 flex min-h-14 flex-col justify-between md:mt-4 md:min-h-20">
                <div>
                  <p className="text-2xl font-black uppercase leading-none text-white transition-colors group-hover:text-[#ff5c71] md:text-3xl" style={{ fontFamily: "var(--font-londrina-solid)", letterSpacing: 0 }}>
                    {component.name}
                  </p>
                  <p className="mt-1 font-mono text-xs uppercase text-white/35" style={{ letterSpacing: 0 }}>
                    {component.detail}
                  </p>
                </div>
                <span className={`mt-2 w-fit rounded-full px-3 py-1 text-xs font-bold md:mt-4 ${component.access === "Free" ? "bg-[#e0f2dc] text-black" : "border border-[#ff5c71]/40 text-[#ff8d9a]"}`}>
                  {component.access}
                </span>
              </div>
            </Link>
          ))}
        </div>
      </div>
    </section>
  );
}
