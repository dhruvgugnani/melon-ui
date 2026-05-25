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
    id: "grow-input",
    slug: "grow-input",
    title: "Grow Input",
    description: "SVG stroke dashoffset vine grows along the bottom border on focus.",
    category: "Inputs",
    tags: ["GSAP", "SVG"],
    cliCommand: "npx @melonui-dev/cli add grow-input",
    codeSnippet: `const onFocus = () => gsap.to(pathRef.current, { strokeDashoffset: 0, duration: 1, ease: "power2.out" });\nconst onBlur = () => gsap.to(pathRef.current, { strokeDashoffset: pathLength, duration: 0.6, ease: "power2.in" });`,
    componentPath: "VineInput",
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
    description: "R3F particle cloud in melon palette colors reacting to mouse movement.",
    category: "3D Backgrounds",
    tags: ["Three.js", "R3F"],
    cliCommand: "npx @melonui-dev/cli add particle-field",
    codeSnippet: `useFrame((state) => {\n  const t = state.clock.getElapsedTime();\n  points.current.rotation.y = Math.sin(t / 4);\n  points.current.rotation.x = Math.cos(t / 4);\n});`,
    componentPath: "ParticleBackground",
  },
  {
    id: "floating-orbs",
    slug: "floating-orbs",
    title: "Floating Orbs",
    description: "Sinusoidal floating spheres with dynamic colored point lighting.",
    category: "3D Backgrounds",
    tags: ["Three.js", "R3F"],
    cliCommand: "npx @melonui-dev/cli add floating-orbs",
    codeSnippet: `useFrame(({ clock }) => {\n  mesh.current.position.y = Math.sin(clock.getElapsedTime() + offset) * 0.5;\n});`,
    componentPath: "FloatingOrbs",
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
