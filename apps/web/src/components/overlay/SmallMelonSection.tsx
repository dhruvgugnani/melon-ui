"use client";

import Link from "next/link";

const PLANS = [
  {
    name: "Core Drops",
    price: "$0",
    note: "Most components stay free: buttons, inputs, cards, navs, cursors, and text effects.",
    accent: "#e0f2dc",
    href: "/community",
  },
  {
    name: "Pro Vault",
    price: "Later",
    note: "Bigger cinematic sections, WebGL kits, templates, and launch packs when the library expands.",
    accent: "#ff5c71",
    href: "/community#backgrounds",
  },
  {
    name: "Team Harvest",
    price: "Soon",
    note: "Licensing and packaged drops for teams that want the weird without hand-wiring everything.",
    accent: "#7fff5e",
    href: "/community",
  },
];

export function SmallMelonSection() {
  return (
    <section
      id="small-melon-section"
      className="snap-start relative z-10 flex h-screen w-full flex-col overflow-hidden"
      style={{ scrollSnapStop: "always" }}
    >
      <div className="grid flex-1 grid-cols-12 items-center gap-5 px-6 md:px-10">
        <div className="col-span-12 lg:col-span-4">
          <p className="mb-3 font-mono text-xs uppercase text-[#ff5c71]" style={{ letterSpacing: 0 }}>
            Chapter 05 / Access model
          </p>
          <h2
            className="font-black uppercase leading-[0.84] text-white text-[clamp(3rem,7vw,7rem)]"
            style={{ fontFamily: "var(--font-londrina-solid)", letterSpacing: 0 }}
          >
            Free
            <span className="block text-[#ff5c71]">First</span>
            <span className="block text-[#e0f2dc]">Paid Later</span>
          </h2>
          <p className="mt-5 max-w-sm text-base font-semibold leading-7 text-white/58">
            The business model should not choke the library. Free components build trust; paid drops fund the heavier cinematic pieces.
          </p>
        </div>

        <div className="col-span-12 grid gap-3 md:grid-cols-3 lg:col-span-8">
          {PLANS.map((plan) => (
            <Link
              key={plan.name}
              href={plan.href}
              className="group relative min-h-72 overflow-hidden rounded-[8px] border border-white/10 bg-black/52 p-5 backdrop-blur-md transition-transform hover:-translate-y-1"
            >
              <div className="absolute left-5 right-5 top-0 h-1" style={{ background: plan.accent }} />
              <p className="text-sm font-black uppercase text-white/64" style={{ letterSpacing: 0 }}>
                {plan.name}
              </p>
              <p className="mt-7 text-6xl font-black uppercase leading-none text-white" style={{ fontFamily: "var(--font-londrina-solid)", letterSpacing: 0 }}>
                {plan.price}
              </p>
              <p className="mt-5 text-sm font-semibold leading-6 text-white/56">{plan.note}</p>
              <span className="absolute bottom-5 left-5 rounded-full border border-white/12 px-4 py-2 text-xs font-bold text-white/58 transition-colors group-hover:text-white">
                View access
              </span>
            </Link>
          ))}
        </div>
      </div>
    </section>
  );
}
