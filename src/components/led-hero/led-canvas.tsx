"use client";

import { useEffect, useRef } from "react";

type MelonDot = {
  nx: number;
  ny: number;
  radial: number;
  surface: number;
  edge: number;
  delay: number;
};

type Dot = {
  x: number;
  y: number;
  noise: number;
  level: number;
  offsetX: number;
  offsetY: number;
  melon: MelonDot | null;
};

type Seed = {
  x: number;
  y: number;
  size: number;
  angle: number;
};

type MelonLayout = {
  cx: number;
  cy: number;
  rx: number;
  ry: number;
  seeds: Seed[];
};

type Grid = {
  width: number;
  height: number;
  dpr: number;
  spacing: number;
  radius: number;
  dots: Dot[];
  basePath: Path2D;
  baseLayer: HTMLCanvasElement;
  melon: MelonLayout;
};

type MousePosition = {
  x: number;
  y: number;
  active: boolean;
};

type IlluminationRegion = {
  x: number;
  y: number;
  width: number;
  height: number;
  strength: number;
  feather: number;
};

type Rgb = {
  r: number;
  g: number;
  b: number;
};

type MelonSignal = {
  level: number;
  halo: Rgb;
  core: Rgb;
  haloStrength: number;
  seed: number;
};

const ROTATION_DURATION = 18_000;
const MELON_BUILD_DURATION = 1_050;
const COOL_GRID = { r: 232, g: 250, b: 255 };
const COOL_HALO = { r: 98, g: 188, b: 255 };
const RIND_DARK = { r: 18, g: 132, b: 62 };
const RIND_MID = { r: 58, g: 218, b: 92 };
const RIND_LIGHT = { r: 192, g: 255, b: 96 };
const PITH = { r: 250, g: 255, b: 188 };
const PITH_BRIGHT = { r: 255, g: 255, b: 236 };
const FLESH_DEEP = { r: 214, g: 32, b: 55 };
const FLESH = { r: 255, g: 64, b: 74 };
const FLESH_LIGHT = { r: 255, g: 144, b: 108 };
const SEED = { r: 20, g: 17, b: 16 };

const WATERMELON_SEEDS: Seed[] = [
  { x: -0.46, y: -0.27, size: 0.074, angle: -0.42 },
  { x: -0.28, y: 0.1, size: 0.065, angle: 0.24 },
  { x: -0.04, y: -0.15, size: 0.072, angle: -0.2 },
  { x: 0.22, y: 0.2, size: 0.064, angle: 0.38 },
  { x: 0.46, y: -0.25, size: 0.07, angle: -0.34 },
  { x: -0.56, y: 0.3, size: 0.056, angle: 0.18 },
  { x: 0.06, y: 0.46, size: 0.055, angle: -0.08 },
  { x: 0.52, y: 0.08, size: 0.054, angle: 0.46 },
  { x: -0.18, y: -0.44, size: 0.052, angle: -0.28 },
];

function clamp(value: number, min: number, max: number) {
  return Math.min(max, Math.max(min, value));
}

function smoothstep(value: number) {
  const t = clamp(value, 0, 1);
  return t * t * (3 - 2 * t);
}

function bell(value: number, center: number, width: number) {
  return 1 - smoothstep(Math.abs(value - center) / width);
}

function mixColor(from: Rgb, to: Rgb, amount: number): Rgb {
  const t = clamp(amount, 0, 1);

  return {
    r: from.r + (to.r - from.r) * t,
    g: from.g + (to.g - from.g) * t,
    b: from.b + (to.b - from.b) * t,
  };
}

function rgba(color: Rgb, alpha: number) {
  return `rgba(${Math.round(color.r)}, ${Math.round(color.g)}, ${Math.round(
    color.b,
  )}, ${alpha})`;
}

function readIlluminationRegions(): IlluminationRegion[] {
  const elements =
    document.querySelectorAll<HTMLElement>("[data-led-illuminate]");
  const regions: IlluminationRegion[] = [];

  for (const element of elements) {
    const rect = element.getBoundingClientRect();

    if (rect.width < 6 || rect.height < 6) {
      continue;
    }

    const parsedStrength = Number(element.dataset.ledStrength ?? "1");
    const strength = Number.isFinite(parsedStrength) ? parsedStrength : 1;

    regions.push({
      x: rect.left,
      y: rect.top,
      width: rect.width,
      height: rect.height,
      strength,
      feather: clamp(Math.min(rect.width, rect.height) * 0.42, 18, 58),
    });
  }

  return regions;
}

function getIlluminationLevel(
  x: number,
  y: number,
  regions: IlluminationRegion[],
) {
  let level = 0;

  for (const region of regions) {
    if (
      x < region.x - region.feather ||
      x > region.x + region.width + region.feather ||
      y < region.y - region.feather ||
      y > region.y + region.height + region.feather
    ) {
      continue;
    }

    const halfWidth = region.width / 2;
    const halfHeight = region.height / 2;
    const centerX = region.x + halfWidth;
    const centerY = region.y + halfHeight;
    const dx = Math.abs(x - centerX) - halfWidth;
    const dy = Math.abs(y - centerY) - halfHeight;
    const outsideDistance = Math.hypot(Math.max(dx, 0), Math.max(dy, 0));
    const insideDistance = Math.min(Math.max(dx, dy), 0);
    const signedDistance = outsideDistance + insideDistance;
    const coverage =
      signedDistance <= 0
        ? 1
        : 1 - smoothstep(signedDistance / region.feather);

    if (coverage <= 0) {
      continue;
    }

    const centerFalloff =
      1 -
      smoothstep(
        Math.max(
          Math.abs((x - centerX) / Math.max(halfWidth, 1)),
          Math.abs((y - centerY) / Math.max(halfHeight, 1)),
        ),
      );

    level = Math.max(
      level,
      coverage * (0.78 + centerFalloff * 0.22) * region.strength,
    );
  }

  return clamp(level, 0, 1.35);
}

function getSpacing(width: number, height: number) {
  const shortSide = Math.min(width, height);

  if (shortSide < 480) {
    return 8.75;
  }

  if (shortSide < 760) {
    return 9.5;
  }

  return 10.25;
}

function getMelonLayout(width: number, height: number): MelonLayout {
  const shortSide = Math.min(width, height);
  const visualSize = clamp(shortSide * (width < 640 ? 0.62 : 0.68), 260, 660);

  return {
    cx: width / 2,
    cy: height < 700 ? height * 0.36 : height * 0.38,
    rx: visualSize * 0.58,
    ry: visualSize * 0.46,
    seeds: WATERMELON_SEEDS,
  };
}

function addDotToPath(path: Path2D, x: number, y: number, radius: number) {
  path.moveTo(x + radius, y);
  path.arc(x, y, radius, 0, Math.PI * 2);
}

function createMelonDot(layout: MelonLayout, x: number, y: number, noise: number) {
  const nx = (x - layout.cx) / layout.rx;
  const ny = (y - layout.cy) / layout.ry;
  const ellipse = nx * nx + ny * ny;

  if (ellipse > 1) {
    return null;
  }

  const radial = Math.sqrt(ellipse);
  const surface = Math.sqrt(Math.max(0, 1 - ellipse));
  const edge = smoothstep((radial - 0.82) / 0.18);
  const distanceFromTopLeft = Math.hypot(nx + 0.22, ny + 0.18);

  return {
    nx,
    ny,
    radial,
    surface,
    edge,
    delay: smoothstep(distanceFromTopLeft / 1.55) * 240 + noise * 160,
  };
}

function createBaseLayer(grid: Grid) {
  const baseLayer = document.createElement("canvas");
  const context = baseLayer.getContext("2d");

  baseLayer.width = Math.floor(grid.width * grid.dpr);
  baseLayer.height = Math.floor(grid.height * grid.dpr);

  if (!context) {
    return baseLayer;
  }

  context.setTransform(grid.dpr, 0, 0, grid.dpr, 0, 0);
  context.save();
  context.shadowColor = "rgba(128, 210, 255, 0.105)";
  context.shadowBlur = 1.7;
  context.fillStyle = "rgba(176, 232, 255, 0.104)";
  context.fill(grid.basePath);
  context.restore();

  return baseLayer;
}

function createGrid(canvas: HTMLCanvasElement): Grid {
  const width = window.innerWidth;
  const height = window.innerHeight;
  const dpr = Math.min(window.devicePixelRatio || 1, 2);
  const spacing = getSpacing(width, height);
  const radius = clamp(spacing * 0.095, 0.78, 1.18);
  const columns = Math.ceil(width / spacing) + 2;
  const rows = Math.ceil(height / spacing) + 2;
  const offsetX = (width - (columns - 1) * spacing) / 2;
  const offsetY = (height - (rows - 1) * spacing) / 2;
  const dots: Dot[] = [];
  const basePath = new Path2D();
  const melon = getMelonLayout(width, height);

  canvas.width = Math.floor(width * dpr);
  canvas.height = Math.floor(height * dpr);
  canvas.style.width = `${width}px`;
  canvas.style.height = `${height}px`;

  for (let row = 0; row < rows; row += 1) {
    for (let column = 0; column < columns; column += 1) {
      const x = offsetX + column * spacing;
      const y = offsetY + row * spacing;
      const noise = Math.random();

      dots.push({
        x,
        y,
        noise,
        level: 0.062 + noise * 0.022,
        offsetX: 0,
        offsetY: 0,
        melon: createMelonDot(melon, x, y, noise),
      });

      addDotToPath(basePath, x, y, radius);
    }
  }

  const grid: Grid = {
    width,
    height,
    dpr,
    spacing,
    radius,
    dots,
    basePath,
    baseLayer: document.createElement("canvas"),
    melon,
  };

  grid.baseLayer = createBaseLayer(grid);

  return grid;
}

function getRotation(elapsed: number, reducedMotion: boolean) {
  if (reducedMotion) {
    return 0.45;
  }

  return (elapsed / ROTATION_DURATION) * Math.PI * 2;
}

function getSeedLevel(point: MelonDot, layout: MelonLayout, rotation: number) {
  if (point.radial > 0.72) {
    return 0;
  }

  let level = 0;

  for (const seed of layout.seeds) {
    const driftX = Math.sin(rotation + seed.y * 3.8) * 0.018;
    const driftY = Math.cos(rotation * 0.7 + seed.x * 3.2) * 0.012;
    const angle = seed.angle + Math.sin(rotation * 0.55 + seed.x * 2) * 0.08;
    const cos = Math.cos(angle);
    const sin = Math.sin(angle);
    const localX = point.nx - seed.x - driftX;
    const localY = point.ny - seed.y - driftY;
    const dx = (localX * cos + localY * sin) / seed.size;
    const dy = (-localX * sin + localY * cos) / (seed.size * 1.95);
    const distance = dx * dx + dy * dy;
    const seedLevel = 1 - smoothstep(distance);

    level = Math.max(level, seedLevel);
  }

  return level;
}

function getMelonSignal(
  dot: Dot,
  grid: Grid,
  elapsed: number,
  reducedMotion: boolean,
): MelonSignal {
  const point = dot.melon;

  if (!point) {
    return {
      level: 0,
      halo: COOL_HALO,
      core: COOL_GRID,
      haloStrength: 0.1,
      seed: 0,
    };
  }

  const intro = reducedMotion
    ? 1
    : smoothstep((elapsed - point.delay) / MELON_BUILD_DURATION);
  const rotation = getRotation(elapsed, reducedMotion);
  const lightSweep = Math.sin(rotation + point.nx * 1.8 - point.ny * 0.9);
  const sweepCenter = Math.sin(elapsed * 0.00105) * 0.72;
  const fleshAmount = 1 - smoothstep((point.radial - 0.665) / 0.045);
  const pithAmount = bell(point.radial, 0.735, 0.06);
  const rindAmount = smoothstep((point.radial - 0.79) / 0.075);
  const innerCutLine = bell(point.radial, 0.67, 0.034);
  const outerEdge = bell(point.radial, 0.965, 0.04);
  const cutSweep = bell(point.nx + point.ny * 0.22, sweepCenter, 0.19) * fleshAmount;
  const stripeRaw =
    0.5 +
    0.5 *
      Math.sin(
        point.nx * 18 +
          point.ny * 5.5 +
          Math.sin(point.ny * 7) * 0.9 +
          rotation * 0.42,
      );
  const stripeAmount = rindAmount * smoothstep((stripeRaw - 0.46) / 0.2);
  const seed = getSeedLevel(point, grid.melon, rotation);
  const highlight = clamp(point.surface * 0.62 + lightSweep * 0.1 + cutSweep * 0.78, 0, 1);
  const fleshColor = mixColor(FLESH_DEEP, FLESH, 0.58 + highlight * 0.42);
  const brightFlesh = mixColor(
    fleshColor,
    FLESH_LIGHT,
    highlight * 0.3 + cutSweep * 0.58,
  );
  const rindBase = mixColor(RIND_MID, RIND_DARK, stripeAmount * 0.92);
  const rindColor = mixColor(rindBase, RIND_LIGHT, outerEdge * 0.3 + highlight * 0.16);
  const pithBase = mixColor(PITH, PITH_BRIGHT, pithAmount * 0.6 + innerCutLine * 0.32);
  const pithColor = mixColor(pithBase, RIND_LIGHT, rindAmount * 0.14);
  const cutColor = mixColor(brightFlesh, pithColor, pithAmount * 0.98);
  const naturalColor = mixColor(cutColor, rindColor, rindAmount);
  const core = mixColor(naturalColor, SEED, seed * 0.96);
  const bodyLight =
    fleshAmount * 0.74 +
    pithAmount * 0.86 +
    rindAmount * (0.54 + (1 - stripeAmount) * 0.16 + outerEdge * 0.18) +
    innerCutLine * 0.13 +
    cutSweep * 0.34 +
    point.edge * 0.05;
  const seedCut = 1 - seed * 0.56;
  const shimmer = reducedMotion
    ? 0
    : Math.sin(elapsed * 0.0032 + dot.noise * Math.PI * 2) * 0.008;
  const level = clamp(
    (bodyLight + highlight * 0.16 + cutSweep * 0.2 + shimmer) *
      seedCut *
      intro,
    0,
    1.22,
  );
  const halo = mixColor(RIND_MID, FLESH, fleshAmount * 0.7);

  return {
    level,
    halo,
    core,
    haloStrength:
      seed > 0.24 ? 0.006 : 0.032 + cutSweep * 0.052 + outerEdge * 0.022,
    seed,
  };
}

function drawBackdrop(context: CanvasRenderingContext2D, grid: Grid) {
  context.fillStyle = "#050505";
  context.fillRect(0, 0, grid.width, grid.height);

  const depth = context.createLinearGradient(0, 0, 0, grid.height);

  depth.addColorStop(0, "rgba(5, 5, 5, 0.96)");
  depth.addColorStop(0.42, "rgba(8, 10, 10, 0.42)");
  depth.addColorStop(1, "rgba(0, 0, 0, 0.9)");

  context.fillStyle = depth;
  context.fillRect(0, 0, grid.width, grid.height);
}

function drawBaseDots(context: CanvasRenderingContext2D, grid: Grid) {
  context.drawImage(grid.baseLayer, 0, 0, grid.width, grid.height);
}

function updateDotDisplacement(
  dot: Dot,
  mouse: MousePosition,
  isMelonDot: boolean,
  reducedMotion: boolean,
) {
  let targetX = 0;
  let targetY = 0;

  if (mouse.active && !reducedMotion) {
    const dx = dot.x - mouse.x;
    const dy = dot.y - mouse.y;
    const distance = Math.max(Math.hypot(dx, dy), 0.001);
    const radius = isMelonDot ? 168 : 112;
    const force = smoothstep(1 - distance / radius);

    if (force > 0) {
      const normalX = dx / distance;
      const normalY = dy / distance;
      const tangent = (dot.noise - 0.5) * 0.36;
      const push = force * force * (isMelonDot ? 34 : 12);

      targetX = normalX * push - normalY * push * tangent;
      targetY = normalY * push + normalX * push * tangent;
    }
  }

  if (
    targetX === 0 &&
    targetY === 0 &&
    Math.abs(dot.offsetX) + Math.abs(dot.offsetY) < 0.01
  ) {
    dot.offsetX = 0;
    dot.offsetY = 0;
    return;
  }

  dot.offsetX += (targetX - dot.offsetX) * (isMelonDot ? 0.22 : 0.16);
  dot.offsetY += (targetY - dot.offsetY) * (isMelonDot ? 0.22 : 0.16);
}

function drawActiveDots(
  context: CanvasRenderingContext2D,
  grid: Grid,
  elapsed: number,
  mouse: MousePosition,
  regions: IlluminationRegion[],
  reducedMotion: boolean,
) {
  const pulse = reducedMotion ? 0 : Math.sin(elapsed * 0.003) * 0.008;

  for (const dot of grid.dots) {
    const isMelonDot = dot.melon !== null;
    updateDotDisplacement(dot, mouse, isMelonDot, reducedMotion);

    const drawX = dot.x + dot.offsetX;
    const drawY = dot.y + dot.offsetY;
    const melonSignal = isMelonDot
      ? getMelonSignal(dot, grid, elapsed, reducedMotion)
      : null;
    const illuminationLevel = getIlluminationLevel(drawX, drawY, regions);
    let mouseLevel = 0;

    if (mouse.active) {
      const distance = Math.hypot(drawX - mouse.x, drawY - mouse.y);
      mouseLevel = smoothstep(1 - distance / 126) * 0.34;
    }

    const base = isMelonDot
      ? 0.034 + dot.noise * 0.02 + pulse
      : 0.058 + dot.noise * 0.03 + pulse;
    const melonLevel = melonSignal?.level ?? 0;
    const componentLevel = illuminationLevel * (isMelonDot ? 0.48 : 0.66);
    const desired = clamp(base + melonLevel + mouseLevel + componentLevel, 0, 1.34);
    const response = illuminationLevel > 0.05 ? 0.16 : reducedMotion ? 0.18 : 0.1;

    dot.level += (desired - dot.level) * response;

    const glow = clamp(dot.level - 0.078, 0, 1);

    if (glow <= 0.007) {
      continue;
    }

    const seed = melonSignal?.seed ?? 0;
    const seedBoost = seed > 0.24 ? 1 + seed * 0.62 : 1;
    const haloRadius = grid.radius * (1.55 + glow * (isMelonDot ? 2.05 : 2.1));
    const coreRadius =
      grid.radius * (0.92 + glow * (isMelonDot ? 0.5 : 0.35)) * seedBoost;
    const haloColor = melonSignal?.halo ?? COOL_HALO;
    const coreColor = melonSignal
      ? mixColor(melonSignal.core, COOL_GRID, mouseLevel * 0.36)
      : COOL_GRID;
    const haloAlpha =
      glow * (melonSignal?.haloStrength ?? 0.055) * (1 - seed * 0.68) +
      illuminationLevel * (isMelonDot ? 0.018 : 0.045) * (1 - seed * 0.7);
    const coreAlpha = clamp(
      seed > 0.24 ? 0.78 + glow * 0.18 : 0.24 + glow * 0.84,
      0,
      1,
    );

    context.save();
    context.globalCompositeOperation = "lighter";
    context.beginPath();
    context.fillStyle = rgba(haloColor, haloAlpha);
    context.arc(drawX, drawY, haloRadius, 0, Math.PI * 2);
    context.fill();
    context.restore();

    context.save();
    context.globalCompositeOperation = seed > 0.24 ? "source-over" : "lighter";
    context.beginPath();
    context.fillStyle = rgba(coreColor, coreAlpha);
    context.arc(drawX, drawY, coreRadius, 0, Math.PI * 2);
    context.fill();
    context.restore();
  }
}

export function LedCanvas() {
  const canvasRef = useRef<HTMLCanvasElement | null>(null);
  const gridRef = useRef<Grid | null>(null);
  const animationStartRef = useRef(0);
  const reducedMotionRef = useRef(false);
  const mouseRef = useRef<MousePosition>({ x: 0, y: 0, active: false });
  const illuminationRef = useRef<IlluminationRegion[]>([]);

  useEffect(() => {
    const canvas = canvasRef.current;

    if (!canvas) {
      return;
    }

    const context = canvas.getContext("2d");

    if (!context) {
      return;
    }

    let animationFrame = 0;
    let resizeTimer = 0;
    let measurementTimer = 0;
    const motionQuery = window.matchMedia("(prefers-reduced-motion: reduce)");

    const measureIllumination = () => {
      illuminationRef.current = readIlluminationRegions();
    };

    const scheduleIlluminationMeasure = () => {
      measureIllumination();
      window.clearTimeout(measurementTimer);
      measurementTimer = window.setTimeout(measureIllumination, 320);
    };

    const rebuild = () => {
      gridRef.current = createGrid(canvas);
      context.setTransform(
        gridRef.current.dpr,
        0,
        0,
        gridRef.current.dpr,
        0,
        0,
      );
      scheduleIlluminationMeasure();
    };

    const handleResize = () => {
      window.clearTimeout(resizeTimer);
      resizeTimer = window.setTimeout(rebuild, 120);
    };

    const handlePointerMove = (event: PointerEvent) => {
      mouseRef.current = {
        x: event.clientX,
        y: event.clientY,
        active: true,
      };
    };

    const handlePointerLeave = () => {
      mouseRef.current.active = false;
    };

    const handleMotionChange = () => {
      reducedMotionRef.current = motionQuery.matches;
      animationStartRef.current = performance.now();
    };

    const render = (now: number) => {
      const grid = gridRef.current;

      if (!grid) {
        animationFrame = window.requestAnimationFrame(render);
        return;
      }

      const reducedMotion = reducedMotionRef.current;
      const elapsed = reducedMotion
        ? MELON_BUILD_DURATION * 2
        : now - animationStartRef.current;

      drawBackdrop(context, grid);
      drawBaseDots(context, grid);
      drawActiveDots(
        context,
        grid,
        elapsed,
        mouseRef.current,
        illuminationRef.current,
        reducedMotion,
      );

      animationFrame = window.requestAnimationFrame(render);
    };

    reducedMotionRef.current = motionQuery.matches;
    animationStartRef.current = performance.now();
    rebuild();

    window.addEventListener("resize", handleResize);
    window.addEventListener("pointermove", handlePointerMove, { passive: true });
    window.addEventListener("pointerleave", handlePointerLeave);
    motionQuery.addEventListener("change", handleMotionChange);

    animationFrame = window.requestAnimationFrame(render);

    return () => {
      window.cancelAnimationFrame(animationFrame);
      window.clearTimeout(resizeTimer);
      window.clearTimeout(measurementTimer);
      window.removeEventListener("resize", handleResize);
      window.removeEventListener("pointermove", handlePointerMove);
      window.removeEventListener("pointerleave", handlePointerLeave);
      motionQuery.removeEventListener("change", handleMotionChange);
    };
  }, []);

  return (
    <canvas
      ref={canvasRef}
      aria-hidden="true"
      className="absolute inset-0 z-0 h-full w-full"
    />
  );
}
