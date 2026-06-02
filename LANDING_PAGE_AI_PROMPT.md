# MelonUI Landing Page — AI Recreation Prompt

> Copy the entire prompt below and paste it into any capable AI (Claude, GPT-4o, Gemini) to recreate this landing page from scratch.

---

## THE PROMPT

Build a fullscreen, snap-scroll animated marketing landing page for a React/Next.js UI component library called **MelonUI**. The page should feel alive, premium, and technically bold — inspired by a "chaotic-but-crafted" design philosophy.

---

### 🎨 Brand Identity

**Name:** MelonUI  
**Tagline:** *"Slice the Web."*  
**Subtagline:** *"Chaotic components. Production taste."*  
**Design Philosophy:** High-energy, but production-quality. Not a safe, clean SaaS — a workshop that ships weird, beautiful things.  

**Color Palette:**
- Background: `#050505` (near-black)
- Primary Accent: `#7fff5e` (neon lime green — "melon green")
- Secondary Accent: `#ff5c71` (coral red)
- Tertiary: `#e0f2dc` (soft pale green)
- Text: `#ffffff` at varying opacities (90%, 68%, 35%, 22%)
- Border: `rgba(255,255,255,0.08)` to `rgba(255,255,255,0.12)`

**Typography:**
- Display / Headings: `Londrina Solid` (Google Font) — uppercase, tracked at `letterSpacing: 0`, very heavy font-weight (900)
- Body / Labels: `Inter` or system sans-serif
- Monospace labels: `font-mono` (system mono or `JetBrains Mono`)

---

### 🏗️ Architecture

**Tech Stack:**
- Next.js 14+ App Router
- React 18+ with TypeScript
- GSAP (GreenSock) for all animations — **no Framer Motion**
- Tailwind CSS v3 (utility-first)
- `scroll-snap` CSS for fullscreen section navigation

**Scroll System:**
- The entire page is a single `div` with `overflow-y: auto`, `scroll-snap-type: y mandatory`
- Each section has `scroll-snap-align: start` and `height: 100vh`
- A custom wheel event interceptor (attached to the container) detects mouse-wheel scrolls (deltaY > 40) and uses `gsap.to(container, { scrollTop: targetIndex * innerHeight, duration: 0.55, ease: "power2.out" })` to snap
- Trackpad input (deltaY < 40 or fractional) is allowed to pass through to native CSS snap
- A `currentIndexRef` tracks the active section index (0–6)
- A `isAnimatingRef` lock prevents rapid-fire scroll skipping

---

### 🖱️ Custom Cursor (Desktop Only)

Build a `SmoothCursor` component:
- Detect `(pointer: fine)` — only activate on mouse devices, hide on touch
- Two elements: a **precision dot** (8×8px, `#ff5c71` circle) that follows mouse exactly via `gsap.set`
- An **outer trailing ring** (28×28px, `border: 1px solid #ff5c71`, `mix-blend-mode: screen`) that lerps toward the mouse at 0.28 coefficient per frame using `requestAnimationFrame`
- On hover over `<a>` or `<button>` elements: ring scales to 1.6×, border and dot turn `#7fff5e`, ring gets `rgba(127,255,94,0.08)` fill
- On hover out: everything eases back to default with `duration: 0.25, ease: "power2.out"`
- Both elements are `position: fixed`, `pointer-events: none`, `z-index: 9999/9998`
- Mount globally on the landing page only — NOT on inner pages

---

### 📜 Page Sections (7 total, snap-scrolled)

---

#### SECTION 0 — Hero "Slice the Web"

**Visual Goal:** Full-viewport dark canvas with a massive typographic headline, a physics-animated description paragraph, tech stack chips, and two CTA buttons.

**Layout:** 12-column CSS grid
- Left 8 columns: headline anchored to bottom-left
- Right 4 columns: repelling text paragraph + chips + CTAs anchored to bottom-right

**Headline:**
```
SLICE
  THE         ← indented right ~9vw, colored #ff5c71
WEB.          ← "WEB" in #e0f2dc, the period in #7fff5e
```
Font: `Londrina Solid`, size `clamp(3.5rem, 10vw, 9.5rem)`, `font-weight: 900`, `line-height: 0.76`, uppercase

**Eyebrow label** (above headline):
```
Chaotic components. Production taste.
```
Font: `font-mono`, `text-xs`, uppercase, `color: #e0f2dc at 62% opacity`, `letterSpacing: 0`

**Description Paragraph (with Repelling Physics Effect):**
```
Skip the generic. Access a curated laboratory of high-fidelity React components 
and custom WebGL animations engineered with GSAP to make your web applications feel alive.
```
Split into individual `<span>` words. On `mouseenter` to the paragraph, start a `requestAnimationFrame` loop. Each word that falls within a 110px radius of the cursor is pushed away with quadratic falloff (`force = ((radius - dist) / radius)²`), receives wobble scale, Y-float, blur, and skewX. On mouse leave, all words spring back with `elastic.out(1, 0.75)`.

Special coloring: words containing "React" → `#7fff5e`, words containing "WebGL" or "GSAP" → `#ff5c71`.

**Tech Stack Chips** (below description):
- `React / Next.js` with `#7fff5e` dot
- `GSAP / Motion` with `#ff5c71` dot
- `Tailwind CSS` with `#7fff5e` dot
- `TypeScript` with `rgba(255,255,255,0.5)` dot
- Style: `border: 1px solid rgba(255,255,255,0.08)`, `background: rgba(255,255,255,0.02)`, `font-mono text-[9px] uppercase`, `border-radius: 4px`

**CTAs:**
1. Primary: `"Explore Components"` → `/components` — pill-shaped, `background: #7fff5e`, `color: black`, `font-black uppercase`, hover → `background: white, scale: 1.05`, shadow: `0 4px 20px rgba(127,255,94,0.25)`
2. Secondary: `"GitHub Repo"` → GitHub URL — ghost pill, `background: rgba(255,255,255,0.05)`, `border: 1px solid rgba(255,255,255,0.1)`, hover brightens

**Entrance animation** (GSAP timeline, `ease: "power3.out"`):
1. Headline lines: stagger up from y:72 with opacity fade, 0.85s
2. Description: fade up from y:18, 0.55s
3. Chips: stagger up from y:16
4. CTAs: stagger up from y:16

**Scroll indicator** (bottom center): monospace "Scroll the story" label + a gradient vertical line fading downward

---

#### SECTION 1 — "Build Faster" (Accordion Drawer)

**Visual Goal:** Interactive horizontal accordion of 4 component drops that expand on hover, showing live component previews.

**Eyebrow:** `Chapter 02 / Build Faster`  
**Headline:**
```
BUILD
  FASTER.    ← "FASTER." in #ff5c71, indented 2.5vw
```

**Accordion Items (4 cards):**

| Name | Type | Accent Color |
|------|------|-------------|
| Seed Burst | press / particles | `#ff5c71` |
| Rind Peel | hover card | `#e0f2dc` |
| Magnet Dock | sticky nav | `#7fff5e` |
| Juicy Switch | morph / juice toggle | `#ff8d9a` |

**Accordion behavior:**
- Desktop: cards laid out horizontally (`flex-row`). Default: each card `flex: 1`. Hovered: `flex: 3.5`.
- Mobile: cards laid out vertically. Default: each card `height: 68px`. Hovered: `height: 210px`.
- Transition: `transition-all 500ms cubic-bezier(0.25, 1, 0.3, 1)` — feels springy
- Each card: `border-radius: 12px`, `backdrop-blur-md`, `background: rgba(0,0,0,0.54)`, border changes to `${accentColor}50` on hover, subtle glow shadow
- Collapsed (desktop): component name in vertical writing mode (`writing-mode: vertical-rl; rotate: 180deg`) with `border-radius` tag showing "Free"
- Expanded: vertical writing mode → horizontal, live React component preview appears above the info row (fades/scales in)

**Live Previews** (real interactive components mounted inside each card):
- `SeedBurstButton` — a button that emits particle bursts on click
- `RindPeelCard` — a card with a corner-peel hover animation
- `MagneticNav` — a nav dock where icons magnetically attract the cursor
- `JuicySwitch` — a morphing toggle that feels juicy and bouncy

**Entrance animation:** Title lines stagger in from y:72, then cards stagger in from y:40 with slight rotation

---

#### SECTION 2 — "Component Previews" / Seeds become UI

**Visual Goal:** A 3-column showcase of component preview cards with static mock illustrations.

**Eyebrow:** `Chapter 02 / Seeds become UI`  
**Headline:**
```
Component
PREVIEWS    ← in #7fff5e
```

**Cards (3 total, `Link` elements):**

1. **Seed Command** — terminal mock UI: 3 macOS dots + 3 CLI lines (`npx melonui add seed-command`, `copying motion primitives`, `drop installed`). First line accented in `#ff5c71`, others in `#7fff5e`.
2. **Rind Tags** — animated token input mock: colored tag chips + an input field with an accent-colored underline sliding bar
3. **Slice Wipe** — page transition preview: two diagonal color blocks (`#ff5c71` and `#7fff5e`) with a centered `PAGE SLICE` text on dark overlay

Each card: hover lifts (`-translate-y-1`), displays index number in monospace top-right, shows `Free` (green pill) or `Pro later` (red-bordered ghost pill) badge

---

#### SECTION 3 — Sand Section (CLI Terminal)

A fullscreen section showcasing the MelonUI CLI with:
- An actual interactive `CliTerminal` component (copy-paste terminal that types and shows install commands)
- Left column: headline `"Install in Seconds."` style copy about `npx melonui add [component]`
- Right column: the rendered terminal component

---

#### SECTION 4 — Plant Section (Organic Components)

A fullscreen section with:
- Headline about "organic" motion design
- Featured showcase of 2–3 hand-picked components with live previews
- Nature/growth metaphor — components "grow" into view

---

#### SECTION 5 — Small Melon Section

A fullscreen section:
- Compact component grid or feature highlight
- "Every detail matters" style copy
- A single animated component spotlight

---

#### SECTION 6 — CTA Section (Ship It)

**Visual Goal:** Full-bleed dark closing section urging the user to start.

**Headline:** Large `"SHIP IT."` in Londrina Solid  
**Body copy:** "Stop waiting. The components are here. Your imagination is the only limit."  
**Primary CTA:** `"Get Started →"` → `/docs` — large, `#7fff5e` background  
**Secondary CTA:** `"Explore all components"` → `/components` — ghost  
**Footer line:** copyright + social links

---

### 🎯 Scroll HUD (Navigation Overlay)

A fixed vertical indicator on the right edge:
- 7 dots or thin lines, one per section
- Active section dot: larger and colored `#7fff5e`
- Inactive: small, `rgba(255,255,255,0.2)`
- Section labels appear on hover (e.g., `Slice`, `Faster`, `Better`, `Code`, `Wind`, `Access`, `Ship`)
- Transitions smoothly via GSAP on scroll index change

---

### 🔧 Shared Patterns

**`RepellingText` component** (used in Hero and FasterSection):
- Props: `text: string`
- Splits text into word spans with class `repel-word`
- On mount: attaches `mouseenter`/`mousemove`/`mouseleave` to the paragraph
- `mouseenter` → calls `updateCenters()` (reads `getBoundingClientRect` for each word after resetting transforms) → starts RAF loop
- RAF loop: for each word within `radius=110px` of cursor, compute `force = ((radius-dist)/radius)²`, then `gsap.to(word, { x: pushX + wobbleX*force, y: pushY + wobbleY*force, scale: 1+wobble*force, filter: blur, skewX: skew, opacity: 1-force*0.15, duration: 0.25, ease: "power2.out", overwrite: "auto" })`
- Words outside radius: `gsap.to(word, { x:0, y:0, scale:1, filter:"blur(0px)", skewX:0, opacity:1, duration:0.45, overwrite:"auto" })`
- `mouseleave` → cancels RAF, springs all words back with `elastic.out(1, 0.75)` over 0.75s

---

### 🌐 Global Background

The background `#050505` is set globally. A subtle radial gradient vignette or faint noise texture can be overlaid. No animated WebGL background — the components themselves provide the visual interest.

---

### 📐 Responsive Behavior

- Mobile (`< md`): accordion cards stack vertically, some grid columns collapse to full-width, font sizes shrink via `clamp()`
- Tablet (`md`): accordion shifts to horizontal, 2-column grids appear
- Desktop (`lg+`): full 12-column grid, max widths on copy columns

---

### ⚡ Performance Rules

- All GSAP animations cleaned up on unmount via `gsap.context(() => ...).revert()`
- `will-change: transform, opacity, filter` on animated word spans
- Custom cursor uses `gsap.set` (not `gsap.to`) for the precision dot to ensure 0-lag tracking
- RAF loops cancelled on unmount and on window resize
- No `position: absolute` children that cause reflow on each frame

---

### 📁 File Structure

```
apps/web/src/components/overlay/
├── Overlay.tsx          — Main shell, scroll snap container, wheel interceptor
├── HeroSection.tsx      — Section 0: Slice the Web
├── FasterSection.tsx    — Section 1: Build Faster accordion
├── FeaturesSection.tsx  — Section 2: Component Previews
├── SandSection.tsx      — Section 3: CLI Terminal
├── PlantSection.tsx     — Section 4: Organic Components
├── SmallMelonSection.tsx — Section 5: Compact spotlight
├── CTASection.tsx       — Section 6: Ship It
├── ScrollHud.tsx        — Fixed scroll indicator dots
├── SmoothCursor.tsx     — Custom dual-element cursor
├── Navbar.tsx           — Top navigation bar
└── LoadingScreen.tsx    — Entry loading animation
```

---

*Generated from the actual MelonUI source code. All component names, colors, and behaviors are 1:1 with the real implementation.*
