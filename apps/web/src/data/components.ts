export interface ComponentProp {
  name: string;
  type: string;
  defaultValue: string;
  description: string;
  control?: {
    type: "slider" | "text" | "color" | "boolean";
    min?: number;
    max?: number;
    step?: number;
  };
}

export interface ComponentData {
  id: string;
  slug: string;
  title: string;
  description: string;
  category: string;
  tags: string[];
  cliCommand?: string;
  codeSnippet: string;
  componentPath: string;
  scrollable?: boolean;
  usageCode?: string;
  aiPrompt?: string;
  props?: ComponentProp[];
}

export const componentsData: ComponentData[] = [
  {
    id: "cli-terminal",
    slug: "cli-terminal",
    title: "CLI Terminal",
    description: "Live animated terminal showing the installation flow. Drop it in your docs.",
    category: "Getting Started",
    tags: ["GSAP", "Timeline"],
    cliCommand: "npx @melonui-dev/cli add cli-terminal",
    codeSnippet: `npm install -g @melonui-dev/cli\nnpx @melonui-dev/cli init\nnpx @melonui-dev/cli add burst-button`,
    componentPath: "CliTerminal",
  },
  {
    id: "changelog",
    slug: "changelog",
    title: "Changelog",
    description: "Accordion-style versioned release list with smooth GSAP height animation.",
    category: "Getting Started",
    tags: ["GSAP", "Accordion"],
    cliCommand: "npx @melonui-dev/cli add changelog",
    codeSnippet: "// See ChangelogCard.tsx",
    componentPath: "ChangelogCard",
  },
  {
    id: "burst-button",
    slug: "burst-button",
    title: "Burst Button",
    description: "Seeds physically burst from the click point with GSAP staggered physics.",
    category: "Buttons",
    tags: ["GSAP", "Physics"],
    cliCommand: "npx @melonui-dev/cli add burst-button",
    codeSnippet: `const burst = (e) => {\n  const rect = e.target.getBoundingClientRect();\n  const x = e.clientX - rect.left;\n  const y = e.clientY - rect.top;\n  // Particle creation logic...\n};`,
    componentPath: "SeedBurstButton",
    props: [
      {
        name: "label",
        type: "string",
        defaultValue: `"Click Me"`,
        description: "The text displayed on the button surface.",
        control: { type: "text" }
      },
      {
        name: "count",
        type: "number",
        defaultValue: "12",
        description: "Number of seed particles generated on click.",
        control: { type: "slider", min: 4, max: 32, step: 1 }
      },
      {
        name: "gravity",
        type: "number",
        defaultValue: "0.6",
        description: "Downwards weight force applied to bursting seed particles.",
        control: { type: "slider", min: 0.1, max: 2.0, step: 0.1 }
      }
    ]
  },
  {
    id: "ripple-button",
    slug: "ripple-button",
    title: "Ripple Button",
    description: "Click-origin radial ripple expands from the exact cursor position.",
    category: "Buttons",
    tags: ["GSAP", "Ripple"],
    cliCommand: "npx @melonui-dev/cli add ripple-button",
    codeSnippet: `const createRipple = (e) => {\n  const btn = e.currentTarget;\n  const circle = document.createElement("span");\n  const diameter = Math.max(btn.clientWidth, btn.clientHeight);\n  const radius = diameter / 2;\n\n  circle.style.width = circle.style.height = \`\${diameter}px\`;\n  circle.style.left = \`\${e.clientX - btn.getBoundingClientRect().left - radius}px\`;\n  circle.style.top = \`\${e.clientY - btn.getBoundingClientRect().top - radius}px\`;\n  circle.classList.add("ripple");\n\n  const ripple = btn.getElementsByClassName("ripple")[0];\n  if (ripple) { ripple.remove(); }\n  btn.appendChild(circle);\n};`,
    componentPath: "RippleButton",
    props: [
      {
        name: "label",
        type: "string",
        defaultValue: `"Click for ripple"`,
        description: "The text content displayed in the center of the button.",
        control: { type: "text" }
      },
      {
        name: "duration",
        type: "number",
        defaultValue: "0.7",
        description: "Speed (seconds) for ripple fade out and scale animation.",
        control: { type: "slider", min: 0.2, max: 2.0, step: 0.1 }
      },
      {
        name: "rippleColor",
        type: "string",
        defaultValue: `"rgba(127, 255, 94, 0.25)"`,
        description: "CSS color definition applied to the expanding circular ripple.",
        control: { type: "color" }
      }
    ]
  },
  {
    id: "magnetic-nav",
    slug: "magnetic-nav",
    title: "Magnetic Nav",
    description: "Nav links magnetically attract the cursor; elastic spring snaps back on leave.",
    category: "Navigations",
    tags: ["GSAP", "Elastic"],
    cliCommand: "npx @melonui-dev/cli add magnetic-nav",
    codeSnippet: `const handleMouseMove = (e) => {\n  const { clientX, clientY } = e;\n  const { height, width, left, top } = ref.current.getBoundingClientRect();\n  const x = clientX - (left + width / 2);\n  const y = clientY - (top + height / 2);\n  gsap.to(ref.current, { x: x * 0.3, y: y * 0.3, duration: 0.8, ease: "power3.out" });\n};`,
    componentPath: "MagneticNav",
  },
  {
    id: "step-trail",
    slug: "step-trail",
    title: "Step Trail",
    description: "Animated step breadcrumb with GSAP-driven progress bar between stages.",
    category: "Navigations",
    tags: ["GSAP", "Progress"],
    cliCommand: "npx @melonui-dev/cli add step-trail",
    codeSnippet: `const tl = gsap.timeline();\ntl.to(progressRef.current, { scaleX: activeStep / totalSteps, duration: 0.5, ease: "power2.inOut" });`,
    componentPath: "BreadcrumbTrail",
  },
  {
    id: "peel-card",
    slug: "peel-card",
    title: "Peel Card",
    description: "Card front retracts on hover revealing vibrant content underneath.",
    category: "Cards",
    tags: ["GSAP", "Transform"],
    cliCommand: "npx @melonui-dev/cli add peel-card",
    codeSnippet: `const onEnter = () => gsap.to(peelRef.current, { y: "-85%", duration: 0.6, ease: "power3.inOut" });\nconst onLeave = () => gsap.to(peelRef.current, { y: "0%", duration: 0.6, ease: "power3.inOut" });`,
    componentPath: "RindPeelCard",
  },
  {
    id: "flip-card",
    slug: "flip-card",
    title: "Flip Card",
    description: "3D rotateY flip using CSS preserve-3d and GSAP for precise control.",
    category: "Cards",
    tags: ["GSAP", "3D", "CSS"],
    cliCommand: "npx @melonui-dev/cli add flip-card",
    codeSnippet: `const handleFlip = () => {\n  gsap.to(cardRef.current, {\n    rotateY: isFlipped ? 0 : 180,\n    duration: 0.8,\n    ease: "back.out(1.2)"\n  });\n  setIsFlipped(!isFlipped);\n};`,
    componentPath: "FlipCard",
  },
  {
    id: "holo-ticket",
    slug: "holo-ticket",
    title: "Holo Ticket",
    description: "Premium holographic ticket component with 3D pointer-tracking reflection, dynamic CSS clipping, and elastic tearing physics.",
    category: "Cards",
    tags: ["GSAP", "Clip", "Glassmorphism", "Holographic"],
    cliCommand: "npx @melonui-dev/cli add holo-ticket",
    codeSnippet: `const handleMouseMove = (e) => {\n  const rect = ticketRef.current.getBoundingClientRect();\n  const x = e.clientX - rect.left;\n  const y = e.clientY - rect.top;\n  const rotateX = ((y - centerY) / centerY) * -15;\n  const rotateY = ((x - centerX) / centerX) * 15;\n  gsap.to(ticketRef.current, { rotateX, rotateY, duration: 0.4 });\n};`,
    componentPath: "HoloTicket",
  },
  {
    id: "grow-input",
    slug: "grow-input",
    title: "Grow Input",
    description: "SVG stroke dashoffset vine grows along the bottom border on focus.",
    category: "Inputs",
    tags: ["GSAP", "SVG"],
    cliCommand: "npx @melonui-dev/cli add grow-input",
    codeSnippet: `const onFocus = () => gsap.to(pathRef.current, { strokeDashoffset: 0, duration: 1, ease: "power2.out" });\nconst onBlur = () => gsap.to(pathRef.current, { strokeDashoffset: pathLength, duration: 0.6, ease: "power2.in" });`,
    componentPath: "VineInput",
    props: [
      {
        name: "placeholder",
        type: "string",
        defaultValue: `"e.g. Farmer Joe"`,
        description: "Placeholder text for the text input.",
        control: { type: "text" }
      },
      {
        name: "glowColor",
        type: "string",
        defaultValue: `"#7fff5e"`,
        description: "SVG stroke color for the animated growing vine.",
        control: { type: "color" }
      },
      {
        name: "growSpeed",
        type: "number",
        defaultValue: "1.0",
        description: "Speed multiplier for vine growing animation on focus.",
        control: { type: "slider", min: 0.2, max: 3.0, step: 0.1 }
      }
    ]
  },
  {
    id: "tag-input",
    slug: "tag-input",
    title: "Tag Input",
    description: "Animated tag management — press Enter or comma to add, backspace to remove.",
    category: "Inputs",
    tags: ["GSAP", "Input"],
    cliCommand: "npx @melonui-dev/cli add tag-input",
    codeSnippet: `const handleKeyDown = (e) => {\n  if (e.key === 'Enter' && inputValue) {\n    setTags([...tags, inputValue]);\n    setInputValue('');\n  }\n};`,
    componentPath: "TagInput",
  },
  {
    id: "particle-field",
    slug: "particle-field",
    title: "Particle Field",
    description: "Interactive 2D Canvas particle constellation network connecting nearby nodes on cursor proximity.",
    category: "3D Backgrounds",
    tags: ["Canvas", "Interactive"],
    cliCommand: "npx @melonui-dev/cli add particle-field",
    codeSnippet: `// High performance HTML5 Canvas 2D constellation background.`,
    componentPath: "ParticleBackground",
    props: [
      { name: "particleCount", type: "number", defaultValue: "100", description: "Number of floating particles.", control: { type: "slider", min: 20, max: 250, step: 5 } },
      { name: "speed", type: "number", defaultValue: "1.0", description: "Movement speed multiplier.", control: { type: "slider", min: 0.2, max: 4.0, step: 0.1 } },
      { name: "particleColor", type: "string", defaultValue: `"#ff5c71"`, description: "Color of the particle dots.", control: { type: "color" } },
      { name: "lineColor", type: "string", defaultValue: `"#7fff5e"`, description: "Color of the connecting constellation lines.", control: { type: "color" } },
      { name: "linkDistance", type: "number", defaultValue: "100", description: "Maximum linking distance threshold.", control: { type: "slider", min: 50, max: 200, step: 5 } }
    ]
  },
  {
    id: "floating-orbs",
    slug: "floating-orbs",
    title: "Floating Orbs",
    description: "Organic fluid-morphing custom glass shader mesh floating slowly and reacting to cursor hover.",
    category: "3D Backgrounds",
    tags: ["Three.js", "R3F", "Glassmorphism"],
    cliCommand: "npx @melonui-dev/cli add floating-orbs",
    codeSnippet: `// Custom glass morphing orbs utilizing MeshDistortionMaterial from Drei.`,
    componentPath: "FloatingOrbs",
    props: [
      { name: "orbCount", type: "number", defaultValue: "5", description: "Number of floating glass orbs.", control: { type: "slider", min: 1, max: 10, step: 1 } },
      { name: "speed", type: "number", defaultValue: "1.5", description: "Speed of floating and vertex morphing.", control: { type: "slider", min: 0.2, max: 4.0, step: 0.1 } },
      { name: "distort", type: "number", defaultValue: "0.45", description: "Amount of liquid mesh distortion.", control: { type: "slider", min: 0.1, max: 1.0, step: 0.05 } },
      { name: "primaryColor", type: "string", defaultValue: `"#ff5c71"`, description: "Primary orb color.", control: { type: "color" } },
      { name: "secondaryColor", type: "string", defaultValue: `"#7fff5e"`, description: "Secondary orb color.", control: { type: "color" } }
    ]
  },
  {
    id: "sticker-wall",
    slug: "sticker-wall",
    title: "Sticker Wall",
    description: "Interactive Gen-Z editorial sticker grid that fans out, scales, and tilts dynamically on pointer hover.",
    category: "3D Backgrounds",
    tags: ["Framer Motion", "Stickers", "Brutalist"],
    cliCommand: "npx @melonui-dev/cli add sticker-wall",
    codeSnippet: `// StickerWall.tsx`,
    componentPath: "StickerWall",
    props: [
      { name: "stickers", type: "array", defaultValue: "[]", description: "Custom array of stickers: { label: string, emoji?: string, color?: string }[]" },
      { name: "stickerDensity", type: "number", defaultValue: "12", description: "Number of stickers scattered on the wall.", control: { type: "slider", min: 4, max: 24, step: 1 } },
      { name: "scaleOnHover", type: "number", defaultValue: "1.15", description: "Scale enlargement factor on hover.", control: { type: "slider", min: 1.0, max: 1.4, step: 0.05 } },
      { name: "stickerTheme", type: "string", defaultValue: `"melon"`, description: "Sticker label presets: 'melon', 'tech', or 'mixed'.", control: { type: "text" } }
    ]
  },
  {
    id: "luminous-waves",
    slug: "luminous-waves",
    title: "Luminous Waves",
    description: "Canvas-based glowing sine wave threads running horizontally and bending dynamically to track cursor position.",
    category: "3D Backgrounds",
    tags: ["Canvas", "Glow", "Sine Wave"],
    cliCommand: "npx @melonui-dev/cli add luminous-waves",
    codeSnippet: `// LuminousWaves.tsx`,
    componentPath: "LuminousWaves",
    props: [
      { name: "waveCount", type: "number", defaultValue: "4", description: "Number of horizontal wave threads.", control: { type: "slider", min: 1, max: 10, step: 1 } },
      { name: "amplitude", type: "number", defaultValue: "35", description: "Peak vertical displacement amplitude.", control: { type: "slider", min: 10, max: 100, step: 5 } },
      { name: "frequency", type: "number", defaultValue: "0.008", description: "Wave cycle horizontal frequency spacing.", control: { type: "slider", min: 0.002, max: 0.02, step: 0.001 } },
      { name: "waveColor", type: "string", defaultValue: `"#7fff5e"`, description: "Neon hex color of the glowing waves.", control: { type: "color" } },
      { name: "speed", type: "number", defaultValue: "1.0", description: "Velocity of horizontal wave flow.", control: { type: "slider", min: 0.2, max: 3.0, step: 0.1 } }
    ]
  },
  {
    id: "retro-grid",
    slug: "retro-grid",
    title: "Retro Grid",
    description: "A neon 3D perspective grid extending to the horizon that moves forward and tilts on cursor coordinates.",
    category: "3D Backgrounds",
    tags: ["CSS 3D", "Perspective", "Parallax"],
    cliCommand: "npx @melonui-dev/cli add retro-grid",
    codeSnippet: `// RetroGrid.tsx`,
    componentPath: "RetroGrid",
    props: [
      { name: "gridColor", type: "string", defaultValue: `"#ff5c71"`, description: "Hex color code for perspective grid lines.", control: { type: "color" } },
      { name: "speed", type: "number", defaultValue: "1.5", description: "Forward velocity of grid movement.", control: { type: "slider", min: 0.5, max: 4.0, step: 0.1 } },
      { name: "horizonColor", type: "string", defaultValue: `"#7fff5e"`, description: "Laser line and horizon glow hex color.", control: { type: "color" } },
      { name: "tiltMultiplier", type: "number", defaultValue: "1.0", description: "Strength of pointer parallax grid tilt.", control: { type: "slider", min: 0.0, max: 2.0, step: 0.1 } }
    ]
  },
  {
    id: "noise-blob",
    slug: "noise-blob",
    title: "Noise Blob",
    description: "Organic liquid morphing blobs using SVG color matrix and blur filters to create a gooey lava lamp visual.",
    category: "3D Backgrounds",
    tags: ["SVG Filter", "Gooey", "Liquid"],
    cliCommand: "npx @melonui-dev/cli add noise-blob",
    codeSnippet: `// NoiseBlob.tsx`,
    componentPath: "NoiseBlob",
    props: [
      { name: "primaryColor", type: "string", defaultValue: `"#ff5c71"`, description: "Main color of gooey blobs.", control: { type: "color" } },
      { name: "secondaryColor", type: "string", defaultValue: `"#7fff5e"`, description: "Secondary color of gooey blobs.", control: { type: "color" } },
      { name: "blobSize", type: "number", defaultValue: "120", description: "Pixel diameter of individual blobs.", control: { type: "slider", min: 60, max: 240, step: 10 } },
      { name: "speed", type: "number", defaultValue: "1.0", description: "Floating and morphing speed.", control: { type: "slider", min: 0.2, max: 3.0, step: 0.1 } },
      { name: "gooeyness", type: "number", defaultValue: "10", description: "Intensity of gooey blending threshold.", control: { type: "slider", min: 2, max: 20, step: 1 } }
    ]
  },
  {
    id: "matrix-rain",
    slug: "matrix-rain",
    title: "Matrix Rain",
    description: "Digital cascading streams of custom alphanumeric glyphs and seeds in neon-green and coral-red.",
    category: "3D Backgrounds",
    tags: ["Canvas", "Matrix", "Retro"],
    cliCommand: "npx @melonui-dev/cli add matrix-rain",
    codeSnippet: `// MatrixRain.tsx`,
    componentPath: "MatrixRain",
    props: [
      { name: "rainSpeed", type: "number", defaultValue: "1.2", description: "Drop rate speed multiplier.", control: { type: "slider", min: 0.2, max: 3.0, step: 0.1 } },
      { name: "fontSize", type: "number", defaultValue: "14", description: "Font size in pixels for characters.", control: { type: "slider", min: 10, max: 24, step: 1 } },
      { name: "rainColor", type: "string", defaultValue: `"#7fff5e"`, description: "Base drop stream color.", control: { type: "color" } },
      { name: "accentColor", type: "string", defaultValue: `"#ff5c71"`, description: "Occasional spark character color.", control: { type: "color" } }
    ]
  },
  {
    id: "blob-cursor",
    slug: "blob-cursor",
    title: "Blob Cursor",
    description: "Velocity-based squash and stretch blob with elastic trailing ring.",
    category: "Cursors",
    tags: ["GSAP", "Cursor"],
    cliCommand: "npx @melonui-dev/cli add blob-cursor",
    codeSnippet: `useEffect(() => {\n  const onMouseMove = (e) => {\n    gsap.to(cursorRef.current, { x: e.clientX, y: e.clientY, duration: 0.1 });\n  };\n  window.addEventListener("mousemove", onMouseMove);\n  return () => window.removeEventListener("mousemove", onMouseMove);\n}, []);`,
    componentPath: "JuicyCursor",
  },
  {
    id: "crosshair",
    slug: "crosshair",
    title: "Crosshair",
    description: "Precision crosshair with live coordinate readout and a grid overlay.",
    category: "Cursors",
    tags: ["GSAP", "Cursor"],
    cliCommand: "npx @melonui-dev/cli add crosshair",
    codeSnippet: `// Updates crosshair position and coordinate labels on mouse move.`,
    componentPath: "CrosshairCursor",
  },
  {
    id: "char-reveal",
    slug: "char-reveal",
    title: "Char Reveal",
    description: "Characters blur-in with stagger tied to ScrollTrigger scroll position.",
    category: "Scroll Effects",
    tags: ["GSAP", "ScrollTrigger"],
    cliCommand: "npx @melonui-dev/cli add char-reveal",
    codeSnippet: `gsap.to(chars, {\n  scrollTrigger: { trigger: container, start: "top center", end: "bottom center", scrub: true },\n  opacity: 1, filter: "blur(0px)", stagger: 0.05\n});`,
    componentPath: "HarvestReveal",
    scrollable: true,
    props: [
      {
        name: "text",
        type: "string",
        defaultValue: `"Every great UI starts as a seed."`,
        description: "The text content to animate character-by-character.",
        control: { type: "text" }
      },
      {
        name: "stagger",
        type: "number",
        defaultValue: "0.045",
        description: "Delay interval between starting animation for successive letters.",
        control: { type: "slider", min: 0.01, max: 0.2, step: 0.005 }
      },
      {
        name: "duration",
        type: "number",
        defaultValue: "0.65",
        description: "Duration of single letter fade, translate, and un-blur transition.",
        control: { type: "slider", min: 0.2, max: 2.0, step: 0.05 }
      },
      {
        name: "blur",
        type: "number",
        defaultValue: "6",
        description: "Initial pixel radius of the CSS blur filter on letters.",
        control: { type: "slider", min: 0, max: 20, step: 1 }
      }
    ]
  },
  {
    id: "parallax-strips",
    slug: "parallax-strips",
    title: "Parallax Strips",
    description: "Depth strips that scroll at different speeds creating a parallax illusion.",
    category: "Scroll Effects",
    tags: ["GSAP", "Parallax"],
    cliCommand: "npx @melonui-dev/cli add parallax-strips",
    codeSnippet: `gsap.to(strip1, { y: -100, scrollTrigger: { trigger: container, scrub: true } });\ngsap.to(strip2, { y: -200, scrollTrigger: { trigger: container, scrub: true } });`,
    componentPath: "ParallaxStrips",
    scrollable: true,
  },
  {
    id: "drip-text",
    slug: "drip-text",
    title: "Drip Text",
    description: "Letters drip down on hover with random skew offsets, spring back on leave.",
    category: "GSAP Text",
    tags: ["GSAP", "Elastic"],
    cliCommand: "npx @melonui-dev/cli add drip-text",
    codeSnippet: `const handleEnter = () => {\n  charRefs.current.forEach((el, i) => {\n    gsap.to(el, {\n      y: 12 + Math.random() * 16,\n      skewX: (Math.random() - 0.5) * 20,\n      color: "#7fff5e", duration: 0.4 + i * 0.06,\n      ease: "power3.in", delay: i * 0.04,\n    });\n  });\n};`,
    componentPath: "MelonDripText",
    props: [
      {
        name: "text",
        type: "string",
        defaultValue: `"MELON"`,
        description: "The text phrase displayed on screen.",
        control: { type: "text" }
      },
      {
        name: "stagger",
        type: "number",
        defaultValue: "0.04",
        description: "Delay step (seconds) added progressively to each character animation.",
        control: { type: "slider", min: 0.01, max: 0.15, step: 0.01 }
      },
      {
        name: "yOffset",
        type: "number",
        defaultValue: "16",
        description: "Max random pixel translation distance the letters drip downwards.",
        control: { type: "slider", min: 5, max: 40, step: 1 }
      }
    ]
  },
  {
    id: "scramble-text",
    slug: "scramble-text",
    title: "Scramble Text",
    description: "Characters cycle through random glyphs before resolving back on hover.",
    category: "GSAP Text",
    tags: ["GSAP", "Text"],
    cliCommand: "npx @melonui-dev/cli add scramble-text",
    codeSnippet: `const scramble = () => {\n  let iterations = 0;\n  const maxIter = text.length * 5;\n  const interval = setInterval(() => {\n    iterations++;\n    el.textContent = text.split("").map((char, i) => {\n      if (iterations > Math.floor((i / text.length) * maxIter))\n        return char;\n      return CHARS[Math.floor(Math.random() * CHARS.length)];\n    }).join("");\n    if (iterations >= maxIter) clearInterval(interval);\n  }, 35);\n};`,
    componentPath: "ScrambleText",
    props: [
      {
        name: "text",
        type: "string",
        defaultValue: `"SCRAMBLE"`,
        description: "The text string to scramble and resolve.",
        control: { type: "text" }
      },
      {
        name: "speed",
        type: "number",
        defaultValue: "35",
        description: "Interval duration (milliseconds) between scrambling letter updates.",
        control: { type: "slider", min: 10, max: 120, step: 5 }
      },
      {
        name: "glyphs",
        type: "string",
        defaultValue: `"ABCDEFGHIJKLMNOPQRSTUVWXYZ0123456789!@#$%"`,
        description: "A string of random character glyphs chosen during scramble cycles.",
        control: { type: "text" }
      }
    ]
  },
  {
    id: "chromatic-melt-text",
    slug: "chromatic-melt-text",
    title: "Chromatic Melt Text",
    description: "A transparent chromatic wordmark with offset glass shadows, soft pointer glow, and restrained per-letter hover lift.",
    category: "GSAP Text",
    tags: ["Framer Motion", "Typography", "Pointer Physics", "Gradient"],
    cliCommand: "npx @melonui-dev/cli add chromatic-melt-text",
    codeSnippet: `const [spot, setSpot] = useState({ x: 48, y: 42 });

// Pointer position drives a soft chromatic glow while each glyph gets offset glass shadows.`,
    componentPath: "ChromaticMeltText",
    props: [
      { name: "text", type: "string", defaultValue: `"CHROMA"`, description: "Headline text to render.", control: { type: "text" } },
      { name: "kicker", type: "string", defaultValue: `"Chromatic glass type"`, description: "Optional small label above the text.", control: { type: "text" } },
      { name: "primaryColor", type: "string", defaultValue: `"#ffffff"`, description: "Main glyph color.", control: { type: "color" } },
      { name: "secondaryColor", type: "string", defaultValue: `"#ff5c71"`, description: "Glow and under-drip color.", control: { type: "color" } },
      { name: "accentColor", type: "string", defaultValue: `"#7fff5e"`, description: "Hover and alternate drip color.", control: { type: "color" } }
    ],
  },
  {
    id: "rind-scanner-text",
    slug: "rind-scanner-text",
    title: "Rind Reveal Text",
    description: "A transparent pointer-light wordmark that reveals a melon/rind color pass inside readable chunky type.",
    category: "GSAP Text",
    tags: ["Framer Motion", "Typography", "Reveal", "Gradient"],
    cliCommand: "npx @melonui-dev/cli add rind-scanner-text",
    codeSnippet: `const [spot, setSpot] = useState({ x: 52, y: 46 });
const clipPath = active
  ? \`circle(52% at \${spot.x}% \${spot.y}%)\`
  : \`circle(22% at \${spot.x}% \${spot.y}%)\`;

// Pointer position reveals a melon/rind gradient inside the text while the base word stays readable.`,
    componentPath: "RindScannerText",
    props: [
      { name: "text", type: "string", defaultValue: `"RIND"`, description: "Headline text to reveal.", control: { type: "text" } },
      { name: "label", type: "string", defaultValue: `"Pointer light reveal"`, description: "Optional accessibility and eyebrow label.", control: { type: "text" } },
      { name: "baseColor", type: "string", defaultValue: `"#f4f4f4"`, description: "Base text color.", control: { type: "color" } },
      { name: "scanColor", type: "string", defaultValue: `"#7fff5e"`, description: "Rind green reveal color.", control: { type: "color" } },
      { name: "accentColor", type: "string", defaultValue: `"#ff5c71"`, description: "Pulp accent reveal color.", control: { type: "color" } }
    ],
  },
  {
    id: "sticker-stack-text",
    slug: "sticker-stack-text",
    title: "Sticker Stack Text",
    description: "Transparent layered sticker-style type cards that fan open with springy Gen-Z poster energy and bold MelonUI color blocking.",
    category: "GSAP Text",
    tags: ["Framer Motion", "Typography", "Stickers", "Spring"],
    cliCommand: "npx @melonui-dev/cli add sticker-stack-text",
    codeSnippet: `const layers = [
  { label: "LOUD", color: "#ff5c71" },
  { label: "SOFT", color: "#f7f0d2" },
  { label: "TYPE", color: "#7fff5e" },
];

// Hover expands each text sticker into an offset editorial stack.`,
    componentPath: "StickerStackText",
    props: [
      { name: "topText", type: "string", defaultValue: `"LOUD"`, description: "Top sticker label.", control: { type: "text" } },
      { name: "middleText", type: "string", defaultValue: `"SOFT"`, description: "Middle sticker label.", control: { type: "text" } },
      { name: "bottomText", type: "string", defaultValue: `"TYPE"`, description: "Bottom sticker label.", control: { type: "text" } },
      { name: "topColor", type: "string", defaultValue: `"#ff5c71"`, description: "Top sticker color.", control: { type: "color" } },
      { name: "middleColor", type: "string", defaultValue: `"#f7f0d2"`, description: "Middle sticker color.", control: { type: "color" } },
      { name: "bottomColor", type: "string", defaultValue: `"#7fff5e"`, description: "Bottom sticker color.", control: { type: "color" } },
      { name: "hint", type: "string", defaultValue: `"Hover to fan"`, description: "Optional helper label shown under the sticker stack.", control: { type: "text" } }
    ],
  },
  {
    id: "glyph-orbit-text",
    slug: "glyph-orbit-text",
    title: "Glyph Orbit Text",
    description: "A transparent central headline surrounded by orbiting character tiles derived from the same word, forming a readable typographic halo.",
    category: "GSAP Text",
    tags: ["Framer Motion", "Typography", "Orbit", "Glyphs"],
    cliCommand: "npx @melonui-dev/cli add glyph-orbit-text",
    codeSnippet: `const orbitGlyphs = glyphs?.length ? glyphs : text.replace(/\\s/g, "").split("");
const angle = (index / orbitGlyphs.length) * Math.PI * 2;
const x = Math.cos(angle) * radius;
const y = Math.sin(angle) * radius;

// Glyph tiles are derived from the rendered word unless custom glyphs are passed.`,
    componentPath: "GlyphOrbitText",
    props: [
      { name: "text", type: "string", defaultValue: `"ORBIT"`, description: "Central headline text.", control: { type: "text" } },
      { name: "primaryColor", type: "string", defaultValue: `"#ffffff"`, description: "Central headline color.", control: { type: "color" } },
      { name: "accentColor", type: "string", defaultValue: `"#7fff5e"`, description: "Primary orbit glyph color.", control: { type: "color" } }
    ],
  },
  {
    id: "seedwave-text",
    slug: "seedwave-text",
    title: "Seedwave Text",
    description: "Transparent click-born particle typography that compresses the headline and throws melon-colored seed sparks from the exact press point.",
    category: "GSAP Text",
    tags: ["Framer Motion", "Typography", "Particles", "Click"],
    cliCommand: "npx @melonui-dev/cli add seedwave-text",
    codeSnippet: `const burst = (event) => {
  const rect = event.currentTarget.getBoundingClientRect();
  const x = event.clientX - rect.left;
  const y = event.clientY - rect.top;
  // Create seed particles from the press point.
};`,
    componentPath: "SeedwaveText",
    props: [
      { name: "topText", type: "string", defaultValue: `"Seed"`, description: "First line of the headline.", control: { type: "text" } },
      { name: "bottomText", type: "string", defaultValue: `"Wave"`, description: "Second line of the headline.", control: { type: "text" } },
      { name: "seedCount", type: "number", defaultValue: "18", description: "Number of seed particles emitted per press.", control: { type: "slider", min: 6, max: 36, step: 1 } },
      { name: "primaryColor", type: "string", defaultValue: `"#ffffff"`, description: "Headline text color.", control: { type: "color" } }
    ],
  },
  {
    id: "stripe-wipe",
    slug: "stripe-wipe",
    title: "Stripe Wipe",
    description: "A colored stripe sweeps across the viewport to mask route changes.",
    category: "Page Transitions",
    tags: ["GSAP", "Timeline"],
    cliCommand: "npx @melonui-dev/cli add stripe-wipe",
    codeSnippet: `const runWipe = () => {\n  gsap.timeline()\n    .set(wipeEl, { x: "-100%", display: "flex" })\n    .to(wipeEl, { x: "0%", duration: 0.55,\n      ease: "power3.inOut" })\n    .to(wipeEl, { x: "100%", duration: 0.55,\n      ease: "power3.inOut", delay: 0.3 })\n    .set(wipeEl, { display: "none" });\n};`,
    componentPath: "RindWipeTransition",
  },
  {
    id: "morph-transition",
    slug: "morph-transition",
    title: "Morph Transition",
    description: "Circular clip expands from center masking the page swap between routes.",
    category: "Page Transitions",
    tags: ["GSAP", "Clip"],
    cliCommand: "npx @melonui-dev/cli add morph-transition",
    codeSnippet: `const morph = () => {\n  gsap.timeline()\n    .set(overlay, { display: "block", scale: 0, opacity: 1 })\n    .to(overlay, { scale: 4, duration: 0.55, ease: "power3.in" })\n    .call(() => setPage(p => p === "A" ? "B" : "A"))\n    .to(overlay, { scale: 12, opacity: 0,\n      duration: 0.55, ease: "power3.out" })\n    .set(overlay, { display: "none" });\n};`,
    componentPath: "MorphTransition",
  },
  {
    id: "solar-carousel",
    slug: "solar-carousel",
    title: "Solar Carousel",
    description: "3D orbital carousel where cards rotate in a physical orbit around an interactive central gravity core with inertial drag.",
    category: "Cards",
    tags: ["GSAP", "3D", "Perspective"],
    cliCommand: "npx @melonui-dev/cli add solar-carousel",
    codeSnippet: "",
    componentPath: "SolarCarousel",
  },
  {
    id: "kinetic-magnet",
    slug: "kinetic-magnet",
    title: "Kinetic Magnet",
    description: "A mechanical grid of interactive SVG lines/needles that act as magnetic nodes pointing directly at your cursor, emitting elastic spring waves on clicks.",
    category: "Cursors",
    tags: ["GSAP", "SVG", "Elastic"],
    cliCommand: "npx @melonui-dev/cli add kinetic-magnet",
    codeSnippet: "",
    componentPath: "KineticMagnet",
  },
  {
    id: "morphing-cyber-node",
    slug: "morphing-cyber-node",
    title: "Morphing Cyber Node",
    description: "A multi-state, fluid-morphing interactive widget with magnetic hover physics and dynamic glassmorphism.",
    category: "Widgets",
    tags: ["Framer Motion", "Morph", "Glassmorphism", "Interactive"],
    cliCommand: "npx @melonui-dev/cli add morphing-cyber-node",
    codeSnippet: `const springConfig = { damping: 20, stiffness: 300, mass: 0.5 };\nconst rotateX = useSpring(useTransform(mouseY, [-0.5, 0.5], [15, -15]), springConfig);`,
    componentPath: "MorphingCyberNode",
  },
  {
    id: "orbital-command-ring",
    slug: "orbital-command-ring",
    title: "Orbital Command Ring",
    description: "A futuristic radial menu summoned by drag with elastic joystick tether physics and cinematic execution flashes.",
    category: "Widgets",
    tags: ["Framer Motion", "Spring", "Radial Menu", "Interactive"],
    cliCommand: "npx @melonui-dev/cli add orbital-command-ring",
    codeSnippet: `const joystickX = useSpring(dragX, springConfig);\nconst joystickY = useSpring(dragY, springConfig);\n\n// Derived absolute position for the joystick\nconst joystickAbsX = useTransform(() => originX.get() + joystickX.get());\nconst joystickAbsY = useTransform(() => originY.get() + joystickY.get());`,
    componentPath: "OrbitalCommandRing",
  },
  {
    id: "kinetic-glass-grid",
    slug: "kinetic-glass-grid",
    title: "Kinetic Glass Grid",
    description: "A physical, reactive glass grid that elevates and glows intelligently based on cursor proximity, using complex distance-based spring physics.",
    category: "Widgets",
    tags: ["Framer Motion", "Physics", "Glassmorphism", "Interactive Grid"],
    cliCommand: "npx @melonui-dev/cli add kinetic-glass-grid",
    codeSnippet: `const distance = useTransform([mouseX, mouseY], ([latestX, latestY]) => {\n  // Distance calculation logic\n});\nconst scale = useSpring(useTransform(distance, [0, MAX_DISTANCE], [1.3, 1]), springConfig);`,
    componentPath: "KineticGlassGrid",
  },
  {
    id: "signal-loom",
    slug: "signal-loom",
    title: "Signal Loom",
    description: "A transparent pointer-reactive glass command surface where luminous workflow threads bend toward the cursor and layered inspection wafers morph into focus.",
    category: "Widgets",
    tags: ["Framer Motion", "Glassmorphism", "Pointer Physics", "Workflow"],
    cliCommand: "npx @melonui-dev/cli add signal-loom",
    codeSnippet: `const pointerX = useMotionValue(50);
const pointerY = useMotionValue(50);
const smoothX = useSpring(pointerX, { stiffness: 180, damping: 26, mass: 0.6 });
const smoothY = useSpring(pointerY, { stiffness: 180, damping: 26, mass: 0.6 });

// Curved SVG loom paths, radial glare, and inspection lens all derive from pointer motion.`,
    componentPath: "SignalLoom",
    props: [
      { name: "title", type: "string", defaultValue: `"Weave the next action"`, description: "Main command-surface headline.", control: { type: "text" } },
      { name: "eyebrow", type: "string", defaultValue: `"Signal Loom"`, description: "Small label above the headline.", control: { type: "text" } },
      { name: "statusLabel", type: "string", defaultValue: `"Live"`, description: "Status pill text.", control: { type: "text" } },
      { name: "lensLabel", type: "string", defaultValue: `"Inspection Lens"`, description: "Right panel label.", control: { type: "text" } }
    ],
  }
];

// Helper to group components by category
export const getComponentsByCategory = () => {
  const categories: Record<string, ComponentData[]> = {};
  componentsData.forEach((component) => {
    if (!categories[component.category]) {
      categories[component.category] = [];
    }
    categories[component.category].push(component);
  });
  return categories;
};

export const getComponentBySlug = (slug: string) => {
  return componentsData.find(c => c.slug === slug);
};
