import {
  HERO_CTA,
  HERO_EYEBROW,
  HERO_HEADLINE,
  HERO_SUBTEXT,
} from "./led-scenes";

const glassSurface =
  "relative overflow-hidden rounded-lg border border-white/35 bg-white/[0.20] shadow-[0_0_34px_rgba(168,224,255,0.18),inset_0_1px_0_rgba(255,255,255,0.34),inset_0_-18px_42px_rgba(255,255,255,0.055)] backdrop-blur-[18px] before:pointer-events-none before:absolute before:inset-0 before:bg-[linear-gradient(135deg,rgba(255,255,255,0.34),rgba(255,255,255,0.08)_34%,rgba(255,255,255,0.16)_68%,rgba(255,255,255,0.05))] before:opacity-80 after:pointer-events-none after:absolute after:inset-0 after:bg-[radial-gradient(circle_at_50%_0%,rgba(255,255,255,0.22),transparent_58%)]";

export function HeroContent() {
  return (
    <div className="relative z-10 flex min-h-screen items-center justify-center px-6 py-20">
      <div className="relative flex w-full max-w-5xl flex-col items-center text-center">
        <div
          aria-hidden="true"
          className="pointer-events-none absolute left-1/2 top-1/2 -z-10 h-56 w-[min(86vw,760px)] -translate-x-1/2 -translate-y-1/2 opacity-70 motion-safe:animate-pulse [background-image:radial-gradient(circle,rgba(198,234,255,0.2)_1px,transparent_1.8px)] [background-size:18px_18px] [mask-image:radial-gradient(ellipse_at_center,black_0%,rgba(0,0,0,0.72)_38%,transparent_74%)]"
        />
        <div
          aria-hidden="true"
          className="pointer-events-none absolute left-1/2 top-[54%] -z-10 h-px w-[min(76vw,680px)] -translate-x-1/2 bg-[linear-gradient(to_right,transparent,rgba(173,224,255,0.5),transparent)] shadow-[0_0_28px_rgba(130,205,255,0.42)]"
        />
        <p
          data-led-illuminate
          data-led-strength="0.95"
          className={`${glassSurface} mb-5 px-4 py-2 text-xs font-medium uppercase leading-none tracking-normal text-sky-50/90`}
        >
          <span className="relative z-10">{HERO_EYEBROW}</span>
        </p>
        <h1
          data-led-illuminate
          data-led-strength="1.18"
          className={`${glassSurface} max-w-4xl px-5 py-4 text-5xl font-semibold leading-[1.02] tracking-normal text-white sm:px-7 sm:py-5 sm:text-6xl lg:text-7xl`}
        >
          <span className="relative z-10">{HERO_HEADLINE}</span>
        </h1>
        <p
          data-led-illuminate
          data-led-strength="1"
          className={`${glassSurface} mt-6 px-5 py-3 text-lg font-medium leading-8 tracking-normal text-sky-50/85 sm:px-6 sm:text-xl`}
        >
          <span className="relative z-10">{HERO_SUBTEXT}</span>
        </p>
        <a
          href="#components"
          data-led-illuminate
          data-led-strength="1.26"
          className={`${glassSurface} group mt-10 inline-flex h-14 items-center justify-center px-7 text-sm font-semibold tracking-normal text-white transition duration-200 ease-out hover:-translate-y-0.5 hover:bg-white/[0.24] hover:shadow-[0_0_48px_rgba(194,235,255,0.28),inset_0_1px_0_rgba(255,255,255,0.42)] focus:outline-none focus-visible:ring-2 focus-visible:ring-sky-100 focus-visible:ring-offset-2 focus-visible:ring-offset-[#050505] active:translate-y-0`}
        >
          <span
            aria-hidden="true"
            className="absolute inset-0 z-0 opacity-50 transition-opacity duration-200 group-hover:opacity-80 [background-image:radial-gradient(circle,rgba(210,241,255,0.34)_1px,transparent_1.7px)] [background-size:11px_11px]"
          />
          <span className="relative z-10">{HERO_CTA}</span>
        </a>
      </div>
    </div>
  );
}
