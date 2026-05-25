"use client";

import React from "react";
import Link from "next/link";
import { ComponentShowcase } from "@/components/community/ComponentShowcase";
import { CliTerminal } from "@/components/community/demos/CliTerminal";
import { ChangelogCard } from "@/components/community/demos/ChangelogCard";
import { SeedBurstButton } from "@/components/community/demos/SeedBurstButton";
import { RippleButton } from "@/components/community/demos/RippleButton";
import { MagneticNav } from "@/components/community/demos/MagneticNav";
import { BreadcrumbTrail } from "@/components/community/demos/BreadcrumbTrail";
import { RindPeelCard } from "@/components/community/demos/RindPeelCard";
import { FlipCard } from "@/components/community/demos/FlipCard";
import { HoloTicket } from "@/components/community/demos/HoloTicket";
import { VineInput } from "@/components/community/demos/VineInput";
import { TagInput } from "@/components/community/demos/TagInput";
import { JuicyCursor } from "@/components/community/demos/JuicyCursor";
import { CrosshairCursor } from "@/components/community/demos/CrosshairCursor";
import { HarvestReveal } from "@/components/community/demos/HarvestReveal";
import { ParallaxStrips } from "@/components/community/demos/ParallaxStrips";
import { MelonDripText } from "@/components/community/demos/MelonDripText";
import { ScrambleText } from "@/components/community/demos/ScrambleText";
import { RindWipeTransition } from "@/components/community/demos/RindWipeTransition";
import { MorphTransition } from "@/components/community/demos/MorphTransition";
import dynamic from "next/dynamic";

const ParticleBackground = dynamic(
  () => import("@/components/community/demos/ParticleBackground").then((m) => m.ParticleBackground),
  { ssr: false, loading: () => <div className="w-full h-[360px] bg-[#060606] flex items-center justify-center"><span className="font-mono text-[#333] text-sm">Loading 3D...</span></div> }
);
const FloatingOrbs = dynamic(
  () => import("@/components/community/demos/FloatingOrbs").then((m) => m.FloatingOrbs),
  { ssr: false, loading: () => <div className="w-full h-[360px] bg-[#060606] flex items-center justify-center"><span className="font-mono text-[#333] text-sm">Loading 3D...</span></div> }
);

function SectionLabel({ id, label, count }: { id: string; label: string; count: string }) {
  return (
    <div id={id} className="scroll-mt-4 pt-20 mb-14 border-t border-[#ff5c71]/8 flex items-baseline gap-4">
      <span className="font-mono text-[10px] text-[#333] uppercase tracking-[0.3em]">{count}</span>
      <h2 className="text-5xl md:text-7xl font-black uppercase tracking-tighter text-[#f4f4f4] leading-none"
        style={{ fontFamily: "var(--font-londrina-solid)" }}>
        {label}
      </h2>
    </div>
  );
}

// ── code snippets (trimmed) ──────────────────────────────────────────────────
const CLI_CODE = `npm install -g @melonui/cli
npx @melonui/cli init
npx @melonui/cli add burst-button`.trim();

const BURST_CODE = `const handleClick = (e) => {
  seeds.forEach((seed, i) => {
    const angle = (i / 12) * Math.PI * 2;
    gsap.to(seed, {
      x: Math.cos(angle) * (60 + Math.random() * 60),
      y: Math.sin(angle) * (60 + Math.random() * 60),
      opacity: 0, scale: 0,
      duration: 0.8, ease: "power2.out",
    });
  });
};`.trim();

const RIPPLE_CODE = `const handleClick = (e) => {
  const ripple = document.createElement("span");
  const size = Math.max(w, h) * 2;
  gsap.fromTo(ripple,
    { scale: 0, opacity: 1 },
    { scale: 1, opacity: 0, duration: 0.7, ease: "power2.out",
      onComplete: () => ripple.remove() }
  );
};`.trim();

const MAGNETIC_CODE = `const handleMouseMove = (e, i) => {
  const el = refs.current[i];
  const rect = el.getBoundingClientRect();
  const dx = e.clientX - (rect.left + rect.width / 2);
  const dy = e.clientY - (rect.top + rect.height / 2);
  gsap.to(el, { x: dx * 0.35, y: dy * 0.35,
    duration: 0.4, ease: "power3.out" });
};
const handleLeave = (i) =>
  gsap.to(refs.current[i], { x: 0, y: 0,
    duration: 0.6, ease: "elastic.out(1,0.4)" });`.trim();

const BREADCRUMB_CODE = `const go = (i) => {
  setActive(i);
  gsap.to(progressRef.current, {
    width: \`\${(i / (steps.length - 1)) * 100}%\`,
    duration: 0.5, ease: "power2.out",
  });
};`.trim();

const TICKET_CODE = `const tearTicket = () => {
  setIsTorn(true);
  if (bottomRef.current) {
    gsap.to(bottomRef.current, {
      y: currentY.current + 200,
      rotateZ: (Math.random() - 0.5) * 40,
      opacity: 0, duration: 0.8, ease: "power2.in"
    });
  }
  if (topRef.current) {
    gsap.timeline()
      .to(topRef.current, { scale: 1.05, duration: 0.1 })
      .to(topRef.current, { scale: 1, duration: 0.5, ease: "elastic.out(1, 0.4)" });
  }
};`.trim();

const PEEL_CODE = `const handleEnter = () =>
  gsap.to(peelRef.current, {
    scaleY: 0, transformOrigin: "top center",
    duration: 0.5, ease: "power3.inOut",
  });
const handleLeave = () =>
  gsap.to(peelRef.current, { scaleY: 1,
    duration: 0.5, ease: "power3.inOut" });`.trim();

const FLIP_CODE = `const flip = () => {
  const target = isFlipped.current ? 0 : 180;
  isFlipped.current = !isFlipped.current;
  gsap.to(cardRef.current, {
    rotationY: target, duration: 0.7,
    ease: "power3.inOut",
  });
};`.trim();

const VINE_CODE = `useEffect(() => {
  const len = pathRef.current.getTotalLength();
  gsap.set(pathRef.current, {
    strokeDasharray: len, strokeDashoffset: len });
}, []);
const onFocus = () =>
  gsap.to(pathRef.current, {
    strokeDashoffset: 0, duration: 0.7, ease: "power3.out" });`.trim();

const TAG_CODE = `const addTag = (tag) => {
  setTags(prev => [...prev, tag]);
  gsap.from(newTagEl, { scale: 0, opacity: 0,
    duration: 0.3, ease: "back.out(2)" });
};
const removeTag = (tag) =>
  gsap.to(tagEl, { scale: 0, opacity: 0,
    duration: 0.2, ease: "power2.in",
    onComplete: () => setTags(prev => prev.filter(t => t !== tag)) });`.trim();

const PARTICLE_CODE = `useFrame(({ clock }) => {
  ref.current.rotation.y = clock.getElapsedTime() * 0.04
    + mouse.current.x * 0.3;
});
<points ref={ref}>
  <bufferGeometry>
    <bufferAttribute attach="attributes-position"
      args={[positions, 3]} />
    <bufferAttribute attach="attributes-color"
      args={[colors, 3]} />
  </bufferGeometry>
  <pointsMaterial size={0.04} vertexColors />
</points>`.trim();

const ORBS_CODE = `useFrame(() => {
  t.current += 0.006 * speed;
  mesh.current.position.y =
    base.y + Math.sin(t.current) * 0.4;
  mesh.current.position.x =
    base.x + Math.cos(t.current * 0.7) * 0.15;
});`.trim();

const BLOB_CODE = `const onMove = (e) => {
  const vx = e.clientX - pos.current.x;
  const vy = e.clientY - pos.current.y;
  pos.current = { x: e.clientX, y: e.clientY };
  const speed = Math.sqrt(vx**2 + vy**2);
  gsap.to(blobRef.current, {
    x: e.clientX, y: e.clientY,
    scaleX: 1 + Math.min(speed * 0.02, 0.6),
    scaleY: 1 - Math.min(speed * 0.01, 0.3),
    rotation: Math.atan2(vy, vx) * (180 / Math.PI),
    duration: 0.15, ease: "power2.out",
  });
};`.trim();

const CROSSHAIR_CODE = `const onMove = (e) => {
  const { x, y } = getRelativePos(e, containerEl);
  gsap.to(hLine, { top: y, duration: 0.1, ease: "none" });
  gsap.to(vLine, { left: x, duration: 0.1, ease: "none" });
  gsap.to(dot, { x: x - 6, y: y - 6,
    duration: 0.08, ease: "none" });
};`.trim();

const REVEAL_CODE = `gsap.to(chars, {
  opacity: 1, y: 0, filter: "blur(0px)",
  duration: 0.6, stagger: 0.04, ease: "power2.out",
  scrollTrigger: {
    trigger: container,
    scroller: lenisWrapper,
    start: "top 80%",
    toggleActions: "play none none reverse",
  },
});`.trim();

const PARALLAX_CODE = `STRIPS.forEach((strip, i) => {
  gsap.to(stripRefs.current[i], {
    x: strip.speed * 120,
    ease: "none",
    scrollTrigger: {
      trigger: container,
      scroller: lenisWrapper,
      start: "top bottom",
      end: "bottom top",
      scrub: true,
    },
  });
});`.trim();

const DRIP_CODE = `const handleEnter = () => {
  charRefs.current.forEach((el, i) => {
    gsap.to(el, {
      y: 12 + Math.random() * 16,
      skewX: (Math.random() - 0.5) * 20,
      color: "#7fff5e", duration: 0.4 + i * 0.06,
      ease: "power3.in", delay: i * 0.04,
    });
  });
};
const handleLeave = () => {
  charRefs.current.forEach((el, i) => {
    gsap.to(el, { y: 0, skewX: 0, color: "#ff5c71",
      duration: 0.8, ease: "elastic.out(1,0.3)",
      delay: i * 0.03 });
  });
};`.trim();

const SCRAMBLE_CODE = `const scramble = () => {
  let iterations = 0;
  const maxIter = text.length * 5;
  const interval = setInterval(() => {
    iterations++;
    el.textContent = text.split("").map((char, i) => {
      if (iterations > Math.floor((i / text.length) * maxIter))
        return char;
      return CHARS[Math.floor(Math.random() * CHARS.length)];
    }).join("");
    if (iterations >= maxIter) clearInterval(interval);
  }, 35);
};`.trim();

const WIPE_CODE = `const runWipe = () => {
  gsap.timeline()
    .set(wipeEl, { x: "-100%", display: "flex" })
    .to(wipeEl, { x: "0%", duration: 0.55,
      ease: "power3.inOut" })
    .to(wipeEl, { x: "100%", duration: 0.55,
      ease: "power3.inOut", delay: 0.3 })
    .set(wipeEl, { display: "none" });
};`.trim();

const MORPH_CODE = `const morph = () => {
  gsap.timeline()
    .set(overlay, { display: "block", scale: 0, opacity: 1 })
    .to(overlay, { scale: 4, duration: 0.55, ease: "power3.in" })
    .call(() => setPage(p => p === "A" ? "B" : "A"))
    .to(overlay, { scale: 12, opacity: 0,
      duration: 0.55, ease: "power3.out" })
    .set(overlay, { display: "none" });
};`.trim();

export default function CommunityPage() {
  return (
    <main className="min-h-screen bg-[#050505] selection:bg-[#ff5c71] selection:text-[#050505] px-6 md:px-10 lg:px-14 pb-32">

      {/* ── Hero ── */}
      <header className="pt-14 pb-20 max-w-4xl">
        <div className="flex items-center gap-3 mb-6">
          <span className="font-mono text-[10px] text-[#333] uppercase tracking-[0.25em]">MelonUI</span>
          <span className="h-px w-8 bg-[#1a1a1a]" />
          <span className="font-mono text-[10px] text-[#ff5c71] uppercase tracking-[0.25em]">Community Store</span>
        </div>
        <h1 className="text-6xl md:text-9xl font-black uppercase leading-[0.85] tracking-tighter text-[#f4f4f4] mb-8"
          style={{ fontFamily: "var(--font-londrina-solid)" }}>
          Build<br />
          <span className="text-[#ff5c71]">Different</span>
          <span className="text-[#7fff5e]">.</span>
        </h1>
        <p className="font-mono text-[#555] text-sm max-w-xl leading-relaxed">
          Hand-crafted, GSAP-powered, Three.js-infused components.
          Copy. Paste. Ship. No accounts. No subscriptions.
        </p>
        <div className="flex items-center gap-4 mt-10">
          <button className="px-6 py-3 bg-[#ff5c71] text-[#050505] font-black uppercase tracking-widest text-sm"
            style={{ fontFamily: "var(--font-anton)" }}>
            Submit Component
          </button>
          <Link href="/" className="font-mono text-xs text-[#333] hover:text-[#f4f4f4] transition-colors uppercase tracking-widest">
            ← Home
          </Link>
        </div>
      </header>

      {/* ── GETTING STARTED ── */}
      <SectionLabel id="getting-started" label="Getting Started" count="00" />
      <ComponentShowcase title="CLI Terminal" description="Live animated terminal showing the installation flow. Drop it in your docs."
        tags={["GSAP", "Timeline"]} cliCommand="npx @melonui/cli add cli-terminal" codeSnippet={CLI_CODE}
        component={<CliTerminal />} />
      <ComponentShowcase title="Changelog" description="Accordion-style versioned release list with smooth GSAP height animation."
        tags={["GSAP", "Accordion"]} cliCommand="npx @melonui/cli add changelog" codeSnippet={`// See ChangelogCard.tsx`}
        component={<ChangelogCard />} />

      {/* ── BUTTONS ── */}
      <SectionLabel id="buttons" label="Buttons" count="01" />
      <ComponentShowcase title="Burst Button" description="Seeds physically burst from the click point with GSAP staggered physics."
        tags={["GSAP", "Physics"]} cliCommand="npx @melonui/cli add burst-button" codeSnippet={BURST_CODE}
        component={<SeedBurstButton />} />
      <ComponentShowcase title="Ripple Button" description="Click-origin radial ripple expands from the exact cursor position."
        tags={["GSAP", "Ripple"]} cliCommand="npx @melonui/cli add ripple-button" codeSnippet={RIPPLE_CODE}
        component={<RippleButton />} />

      {/* ── NAVIGATIONS ── */}
      <SectionLabel id="navigations" label="Navigations" count="02" />
      <ComponentShowcase title="Magnetic Nav" description="Nav links magnetically attract the cursor; elastic spring snaps back on leave."
        tags={["GSAP", "Elastic"]} cliCommand="npx @melonui/cli add magnetic-nav" codeSnippet={MAGNETIC_CODE}
        component={<MagneticNav />} />
      <ComponentShowcase title="Step Trail" description="Animated step breadcrumb with GSAP-driven progress bar between stages."
        tags={["GSAP", "Progress"]} cliCommand="npx @melonui/cli add step-trail" codeSnippet={BREADCRUMB_CODE}
        component={<BreadcrumbTrail />} />

      {/* ── CARDS ── */}
      <SectionLabel id="cards" label="Cards" count="03" />
      <ComponentShowcase title="Holo Ticket" description="Interactive 3D holographic ticket. Drag the bottom stub to stretch and tear it."
        tags={["GSAP", "Physics", "Interactive"]} cliCommand="npx @melonui/cli add holo-ticket" codeSnippet={TICKET_CODE}
        component={<HoloTicket />} />
      <ComponentShowcase title="Peel Card" description="Card front retracts on hover revealing vibrant content underneath."
        tags={["GSAP", "Transform"]} cliCommand="npx @melonui/cli add peel-card" codeSnippet={PEEL_CODE}
        component={<RindPeelCard />} />
      <ComponentShowcase title="Flip Card" description="3D rotateY flip using CSS preserve-3d and GSAP for precise control."
        tags={["GSAP", "3D", "CSS"]} cliCommand="npx @melonui/cli add flip-card" codeSnippet={FLIP_CODE}
        component={<FlipCard />} />

      {/* ── INPUTS ── */}
      <SectionLabel id="inputs" label="Inputs" count="04" />
      <ComponentShowcase title="Grow Input" description="SVG stroke dashoffset vine grows along the bottom border on focus."
        tags={["GSAP", "SVG"]} cliCommand="npx @melonui/cli add grow-input" codeSnippet={VINE_CODE}
        component={<VineInput />} />
      <ComponentShowcase title="Tag Input" description="Animated tag management — press Enter or comma to add, backspace to remove."
        tags={["GSAP", "Input"]} cliCommand="npx @melonui/cli add tag-input" codeSnippet={TAG_CODE}
        component={<TagInput />} />

      {/* ── 3D BACKGROUNDS ── */}
      <SectionLabel id="backgrounds" label="3D Backgrounds" count="05" />
      <ComponentShowcase title="Particle Field" description="R3F particle cloud in melon palette colors reacting to mouse movement."
        tags={["Three.js", "R3F"]} cliCommand="npx @melonui/cli add particle-field" codeSnippet={PARTICLE_CODE}
        component={<ParticleBackground />} />
      <ComponentShowcase title="Floating Orbs" description="Sinusoidal floating spheres with dynamic colored point lighting."
        tags={["Three.js", "R3F"]} cliCommand="npx @melonui/cli add floating-orbs" codeSnippet={ORBS_CODE}
        component={<FloatingOrbs />} />

      {/* ── CURSORS ── */}
      <SectionLabel id="cursors" label="Cursors" count="06" />
      <ComponentShowcase title="Blob Cursor" description="Velocity-based squash and stretch blob with elastic trailing ring."
        tags={["GSAP", "Cursor"]} cliCommand="npx @melonui/cli add blob-cursor" codeSnippet={BLOB_CODE}
        component={<JuicyCursor />} />
      <ComponentShowcase title="Crosshair" description="Precision crosshair with live coordinate readout and a grid overlay."
        tags={["GSAP", "Cursor"]} cliCommand="npx @melonui/cli add crosshair" codeSnippet={CROSSHAIR_CODE}
        component={<CrosshairCursor />} />

      {/* ── SCROLL EFFECTS ── */}
      <SectionLabel id="scroll-effects" label="Scroll Effects" count="07" />
      <ComponentShowcase title="Char Reveal" description="Characters blur-in with stagger tied to ScrollTrigger scroll position."
        tags={["GSAP", "ScrollTrigger"]} cliCommand="npx @melonui/cli add char-reveal" codeSnippet={REVEAL_CODE}
        component={<HarvestReveal />} scrollable />
      <ComponentShowcase title="Parallax Strips" description="Depth strips that scroll at different speeds creating a parallax illusion."
        tags={["GSAP", "Parallax"]} cliCommand="npx @melonui/cli add parallax-strips" codeSnippet={PARALLAX_CODE}
        component={<ParallaxStrips />} scrollable />

      {/* ── GSAP TEXT ── */}
      <SectionLabel id="gsap-text" label="GSAP Text" count="08" />
      <ComponentShowcase title="Drip Text" description="Letters drip down on hover with random skew offsets, spring back on leave."
        tags={["GSAP", "Elastic"]} cliCommand="npx @melonui/cli add drip-text" codeSnippet={DRIP_CODE}
        component={<MelonDripText />} />
      <ComponentShowcase title="Scramble Text" description="Characters cycle through random glyphs before resolving back on hover."
        tags={["GSAP", "Text"]} cliCommand="npx @melonui/cli add scramble-text" codeSnippet={SCRAMBLE_CODE}
        component={<ScrambleText />} />

      {/* ── PAGE TRANSITIONS ── */}
      <SectionLabel id="gsap-transit" label="Page Transitions" count="09" />
      <ComponentShowcase title="Stripe Wipe" description="A colored stripe sweeps across the viewport to mask route changes."
        tags={["GSAP", "Timeline"]} cliCommand="npx @melonui/cli add stripe-wipe" codeSnippet={WIPE_CODE}
        component={<RindWipeTransition />} />
      <ComponentShowcase title="Morph Transition" description="Circular clip expands from center masking the page swap between routes."
        tags={["GSAP", "Clip"]} cliCommand="npx @melonui/cli add morph-transition" codeSnippet={MORPH_CODE}
        component={<MorphTransition />} />

    </main>
  );
}
