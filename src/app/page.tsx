import Link from "next/link";
import { ClientScene } from "@/components/scene/ClientScene";

const GITHUB_URL = "https://github.com/dhruvgugnani/melon-ui";

export default function Home() {
  return (
    <main className="relative h-screen w-full overflow-y-auto overflow-x-hidden bg-black text-white selection:bg-[#ff5c71] selection:text-black">
      <ClientScene />

      <div
        className="pointer-events-none fixed inset-0 z-[1]"
        style={{
          background:
            "linear-gradient(90deg, rgba(0,0,0,0.96) 0%, rgba(0,0,0,0.78) 44%, rgba(0,0,0,0.34) 100%)",
        }}
      />
      <div
        className="pointer-events-none fixed inset-0 z-[2] opacity-30"
        style={{
          backgroundImage:
            "repeating-linear-gradient(135deg, rgba(92,138,77,0.18) 0px, rgba(92,138,77,0.18) 1px, transparent 1px, transparent 24px)",
        }}
      />

      <nav className="fixed inset-x-0 top-0 z-30 flex flex-wrap items-center justify-between gap-3 px-6 py-5 md:px-10">
        <Link href="/" className="group flex items-center gap-3" aria-label="MelonUI home">
          <span className="relative h-9 w-9 overflow-hidden rounded-full border border-white/15 bg-[#ff5c71] shadow-[0_0_22px_rgba(255,92,113,0.28)]">
            <span className="absolute inset-x-1 bottom-1 h-5 rounded-b-full bg-[#203f18]" />
            <span className="absolute inset-x-2 bottom-2 h-3 rounded-b-full bg-[#e0f2dc]" />
            <span className="absolute inset-x-3 bottom-3 h-2 rounded-b-full bg-[#ff5c71]" />
            <span className="absolute bottom-3 left-1/2 h-1 w-1 -translate-x-1/2 rounded-full bg-black" />
          </span>
          <span className="text-base font-black uppercase" style={{ letterSpacing: 0 }}>
            MelonUI
          </span>
        </Link>

        <div className="flex flex-wrap items-center justify-end gap-2 text-sm font-bold">
          <Link
            href="/preview"
            className="rounded-full border border-white/12 bg-black/35 px-4 py-2 text-white/82 backdrop-blur-md transition-colors hover:border-[#ff5c71]/50 hover:text-white"
          >
            Preview
          </Link>
          <a
            href={GITHUB_URL}
            target="_blank"
            rel="noreferrer"
            className="rounded-full border border-white/12 bg-black/35 px-4 py-2 text-white/82 backdrop-blur-md transition-colors hover:border-[#e0f2dc]/50 hover:text-white"
          >
            GitHub
          </a>
          <Link
            href="/community"
            className="rounded-full bg-[#e0f2dc] px-4 py-2 text-black transition-colors hover:bg-white"
          >
            Join community
          </Link>
        </div>
      </nav>

      <section className="relative z-20 flex min-h-screen w-full items-center px-6 pb-10 pt-28 md:px-10 md:pt-24">
        <div className="grid w-full items-end gap-10 lg:grid-cols-[minmax(0,1fr)_minmax(320px,460px)]">
          <div className="max-w-4xl">
            <p className="mb-4 text-sm font-black uppercase text-[#e0f2dc]/72" style={{ letterSpacing: 0 }}>
              Fresh interface components
            </p>
            <h1
              className="font-black uppercase leading-[0.88] text-white text-6xl sm:text-7xl md:text-8xl lg:text-[8.5rem]"
              style={{ fontFamily: "var(--font-londrina-solid)", letterSpacing: 0 }}
            >
              MelonUI
            </h1>
            <p className="mt-6 max-w-2xl text-lg font-semibold leading-7 text-white/70 md:text-xl md:leading-8">
              A rind-dark component lab with juicy motion, 3D storytelling, and community-built interface pieces.
            </p>

            <div className="mt-8 flex flex-wrap gap-3">
              <Link
                href="/preview"
                className="group inline-flex min-h-12 items-center justify-center rounded-full bg-[#ff5c71] px-6 py-3 text-base font-black text-black transition-transform hover:scale-[1.02] hover:bg-white"
              >
                Open preview
              </Link>
              <Link
                href="/community"
                className="inline-flex min-h-12 items-center justify-center rounded-full border border-white/14 bg-white/8 px-6 py-3 text-base font-black text-white backdrop-blur-md transition-colors hover:border-[#e0f2dc]/50 hover:bg-white/12"
              >
                Explore community
              </Link>
            </div>
          </div>

          <div className="grid gap-3">
            <Link
              href="/preview"
              className="group rounded-[8px] border border-[#ff5c71]/30 bg-[#ff5c71]/12 p-5 backdrop-blur-md transition-colors hover:bg-[#ff5c71]/18"
            >
              <span className="block text-sm font-black uppercase text-[#ff8d9a]" style={{ letterSpacing: 0 }}>
                Preview
              </span>
              <span className="mt-3 block text-2xl font-black uppercase text-white" style={{ letterSpacing: 0 }}>
                Scroll the melon story
              </span>
              <span className="mt-3 block text-sm leading-6 text-white/62">
                The cinematic 3D cut, seed fall, sprout, and final build moment now live at /preview.
              </span>
            </Link>

            <Link
              href="/community"
              className="group rounded-[8px] border border-[#e0f2dc]/18 bg-[#e0f2dc]/8 p-5 backdrop-blur-md transition-colors hover:bg-[#e0f2dc]/12"
            >
              <span className="block text-sm font-black uppercase text-[#c9f0bb]" style={{ letterSpacing: 0 }}>
                Community
              </span>
              <span className="mt-3 block text-2xl font-black uppercase text-white" style={{ letterSpacing: 0 }}>
                Join the component garden
              </span>
              <span className="mt-3 block text-sm leading-6 text-white/62">
                Browse the interactive component demos, motion patterns, and experiments from the MelonUI set.
              </span>
            </Link>
          </div>
        </div>
      </section>
    </main>
  );
}
