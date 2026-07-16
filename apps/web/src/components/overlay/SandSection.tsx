"use client";

import { TactileIDCard } from "../community/demos/TactileIDCard";

const bentoPanel =
  "relative overflow-hidden rounded-xl border border-white/12 bg-[#0c0c0c]/62 backdrop-blur-2xl shadow-[inset_0_1px_1px_rgba(255,255,255,0.08),0_12px_40px_rgba(0,0,0,0.7)] transition-all duration-300 ease-out";

function ResponsiveHoverDetails({
  label,
  title,
  points,
  compact = false,
  direction = "left",
}: {
  label: string;
  title: string;
  points: string[];
  compact?: boolean;
  direction?: "left" | "topRight";
}) {
  const frostOrigin =
    direction === "topRight"
      ? "origin-top-right scale-x-0 scale-y-0 group-hover:scale-x-100 group-hover:scale-y-100 group-focus:scale-x-100 group-focus:scale-y-100"
      : "origin-left scale-x-0 group-hover:scale-x-100 group-focus:scale-x-100";
  const revealClip =
    direction === "topRight"
      ? "[clip-path:inset(0_0_100%_100%)] group-hover:[clip-path:inset(0_0_0_0)] group-focus:[clip-path:inset(0_0_0_0)]"
      : "[clip-path:inset(0_100%_0_0)] group-hover:[clip-path:inset(0_0_0_0)] group-focus:[clip-path:inset(0_0_0_0)]";

  return (
    <div className={`pointer-events-none absolute inset-0 z-20 flex items-center justify-center overflow-hidden ${compact ? "p-4" : "p-5"}`}>
      <div
        className={`absolute inset-0 bg-[#020605]/64 opacity-0 backdrop-blur-xl transition-all duration-700 ease-out group-hover:opacity-100 group-focus:opacity-100 ${frostOrigin}`}
      />
      <div
        className={`absolute inset-0 opacity-0 transition-opacity delay-150 duration-500 group-hover:opacity-100 group-focus:opacity-100 ${
          direction === "topRight"
            ? "bg-[radial-gradient(circle_at_82%_18%,rgba(127,255,94,0.16),transparent_30%),linear-gradient(225deg,rgba(255,255,255,0.11),transparent_42%)]"
            : "bg-[radial-gradient(circle_at_18%_50%,rgba(127,255,94,0.14),transparent_32%),linear-gradient(90deg,rgba(255,255,255,0.1),transparent_48%)]"
        }`}
      />
      <div className={`relative w-full rounded-xl border border-white/14 bg-[#0c0c0c]/76 opacity-0 shadow-[0_24px_64px_rgba(0,0,0,0.74),inset_0_1px_0_rgba(255,255,255,0.08)] transition-all duration-700 ease-out group-hover:opacity-100 group-focus:opacity-100 ${revealClip} ${compact ? "max-w-[250px] p-4" : "max-w-[330px] p-4"}`}>
        <p className="font-mono text-[9px] uppercase text-[#7fff5e]">{label}</p>
        <h3
          className={`mt-2 font-black uppercase leading-[0.82] text-white ${compact ? "text-[1.65rem]" : "text-3xl"}`}
          style={{ fontFamily: "var(--font-londrina-solid)", letterSpacing: 0 }}
        >
          {title}
        </h3>
        <div className="mt-4 space-y-2">
          {points.map((point) => (
            <div key={point} className="flex items-center gap-2 rounded-lg border border-white/8 bg-white/[0.04] px-3 py-2">
              <span className="h-1.5 w-1.5 shrink-0 rounded-full bg-[#7fff5e]" />
              <span className={`font-mono uppercase leading-tight text-white/64 ${compact ? "text-[8.5px]" : "text-[9px]"}`}>{point}</span>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
}

function MiniIdCard({ scale }: { scale: number }) {
  return (
    <div className="relative h-full w-full">
      <div
        className="absolute left-1/2 top-1/2"
        style={{
          height: "360px",
          transform: `translate(-50%, -50%) scale(${scale})`,
          transformOrigin: "center",
          width: "260px",
        }}
      >
        <TactileIDCard
          accentColor="#ff5c71"
          idNumber="M-01992"
          name="DHRUV G."
          primaryColor="#7fff5e"
          role="CREATIVE DIR"
          style={{ background: "transparent", height: "360px", width: "260px" }}
        />
      </div>
    </div>
  );
}

function DesktopScreen() {
  return (
    <div
      tabIndex={0}
      aria-label="Desktop responsiveness details"
      className={`${bentoPanel} group col-span-12 flex min-h-[230px] items-center justify-center p-4 outline-none lg:col-span-8 lg:row-start-2`}
    >
      <div className="flex aspect-[25/16] max-h-[250px] w-full max-w-[640px] overflow-hidden rounded-[10px] border border-white/12 bg-[#080808] shadow-[0_22px_54px_rgba(0,0,0,0.72)] transition duration-300 group-hover:blur-[5px] group-hover:brightness-125 group-hover:saturate-150 group-focus:blur-[5px] group-focus:brightness-125 group-focus:saturate-150">
        <div className="flex h-full w-full flex-col">
          <div className="flex h-8 shrink-0 items-center gap-2 border-b border-white/8 bg-[#171717] px-3">
            <span className="h-2.5 w-2.5 rounded-full bg-[#ff5c71]" />
            <span className="h-2.5 w-2.5 rounded-full bg-[#ffc338]" />
            <span className="h-2.5 w-2.5 rounded-full bg-[#7fff5e]" />
            <span className="ml-auto font-mono text-[8px] uppercase text-white/28">desktop / responsive canvas</span>
          </div>

          <div className="grid min-h-0 flex-1 grid-cols-[0.9fr_1.1fr] gap-3 bg-black/45 p-3">
            <div className="flex flex-col justify-between rounded-lg border border-white/8 bg-white/[0.025] p-3">
              <div>
                <p className="font-mono text-[8px] uppercase text-[#ff5c71]">desktop</p>
                <h3
                  className="mt-2 text-3xl font-black uppercase leading-[0.82] text-white"
                  style={{ fontFamily: "var(--font-londrina-solid)", letterSpacing: 0 }}
                >
                  Fluid by default
                </h3>
              </div>
              <div className="space-y-2">
                <span className="block h-2 w-11/12 rounded-full bg-white/16" />
                <span className="block h-2 w-8/12 rounded-full bg-white/10" />
                <span className="block h-2 w-10/12 rounded-full bg-white/10" />
              </div>
            </div>

            <div className="overflow-hidden rounded-lg border border-[#ff5c71]/18 bg-[#050505]">
              <MiniIdCard scale={0.43} />
            </div>
          </div>
        </div>
      </div>
      <ResponsiveHoverDetails
        label="desktop behavior"
        title="wide without stretch"
        points={["Fluid grid tracks", "Pointer-safe motion", "Aspect ratio locked"]}
        direction="left"
      />
    </div>
  );
}

function PhoneScreen() {
  return (
    <div
      tabIndex={0}
      aria-label="Phone responsiveness details"
      className={`${bentoPanel} group col-span-12 flex min-h-[390px] flex-col p-5 outline-none md:col-span-5 lg:col-span-4 lg:row-span-2 lg:row-start-1`}
    >
      <div className="flex min-h-0 flex-1 flex-col transition duration-300 group-hover:blur-[5px] group-hover:brightness-125 group-hover:saturate-150 group-focus:blur-[5px] group-focus:brightness-125 group-focus:saturate-150">
        <div className="mb-4 shrink-0">
          <p className="font-mono text-[9px] uppercase text-white/35">phone</p>
          <p className="mt-1 text-[10px] leading-relaxed text-white/48">
            Same component, compact frame, readable touch spacing.
          </p>
        </div>

        <div className="flex min-h-0 flex-1 items-center justify-center">
          <div className="relative aspect-[79/160] h-full max-h-[330px] rounded-[36px] border border-white/16 bg-[#121212] p-1.5 shadow-[0_26px_60px_rgba(0,0,0,0.78)]">
            <div className="flex h-full flex-col overflow-hidden rounded-[31px] bg-[#070707]">
            <div className="flex h-9 items-center justify-between px-4 pt-1">
              <span className="font-mono text-[7px] font-bold text-white/68">11:07</span>
              <span className="h-3.5 w-11 rounded-full border border-white/10 bg-black" />
              <span className="h-2 w-4 rounded-[2px] border border-white/20 bg-[#7fff5e]/70" />
            </div>

            <div className="flex h-9 items-center justify-between border-y border-white/10 px-4">
              <span
                className="text-sm font-black uppercase text-white"
                style={{ fontFamily: "var(--font-londrina-solid)", letterSpacing: 0 }}
              >
                M<span className="text-[#ff5c71]">UI</span>
              </span>
              <span className="flex flex-col gap-1">
                <span className="h-0.5 w-4 rounded bg-white/42" />
                <span className="h-0.5 w-3 rounded bg-white/28" />
                <span className="h-0.5 w-4 rounded bg-white/42" />
              </span>
            </div>

            <div className="min-h-0 flex-1">
              <MiniIdCard scale={0.34} />
            </div>

            <div className="flex justify-center pb-2">
              <span className="h-1 w-10 rounded-full bg-white/32" />
            </div>
            </div>
          </div>
        </div>
      </div>
      <ResponsiveHoverDetails
        label="phone behavior"
        title="compact stays clear"
        points={["Thumb-safe spacing", "Readable scaled type", "Motion softened"]}
        compact
        direction="topRight"
      />
    </div>
  );
}

export function SandSection() {
  return (
    <section
      id="sand-section"
      className="snap-start relative z-10 flex h-screen w-full items-center overflow-hidden bg-transparent"
      style={{ scrollSnapStop: "always" }}
    >
      <div className="mx-auto w-full max-w-[72rem] px-4 md:px-8">
        <p className="mb-3 font-mono text-xs uppercase tracking-[0.28em] text-[#ff5c71]">
          Chapter 03 / Seeds hit code
        </p>

        <div className="p-5 md:p-7">
          <div className="grid grid-cols-12 gap-5">
            <div className="col-span-12 flex min-h-[150px] flex-col justify-center lg:col-span-4 lg:row-start-1">
              <h2
                className="font-black uppercase leading-[0.82] text-white text-[clamp(2.8rem,8vw,4.6rem)] lg:text-[4.35rem]"
                style={{ fontFamily: "var(--font-londrina-solid)", letterSpacing: 0 }}
              >
                Drop It
                <span className="block text-[#ff5c71]">Into Your Repo.</span>
              </h2>
            </div>

            <div className={`${bentoPanel} col-span-12 min-h-[150px] p-5 md:col-span-7 lg:col-span-4 lg:row-start-1`}>
              <div className="flex h-full flex-col justify-between">
                <div className="flex items-center justify-between gap-3">
                  <p className="font-mono text-[9px] uppercase text-white/35">responsive install</p>
                  <span className="rounded-full border border-[#7fff5e]/22 bg-[#7fff5e]/8 px-2.5 py-0.5 font-mono text-[8px] uppercase text-[#7fff5e]">
                    zero config
                  </span>
                </div>
                <p className="mt-5 text-[13px] font-semibold leading-[1.52] text-white/62">
                  Drop a component into any repo and it keeps its rhythm across desktop and phone layouts.
                </p>
                <div className="mt-4 rounded-lg border border-white/8 bg-black/55 px-3 py-2 font-mono text-[10px] text-white/66">
                  <span className="text-[#ff5c71]">$</span> npx @melonui/cli add tactile-id-card
                </div>
              </div>
            </div>

            <DesktopScreen />
            <PhoneScreen />
          </div>
        </div>
      </div>
    </section>
  );
}
