"use client";

import { useCallback, useEffect, useMemo, useRef } from "react";
import { useFrame } from "@react-three/fiber";
import * as THREE from "three";
import gsap from "gsap";
import type { SceneQualityConfig } from "./runtime";
import { getScrollProgress, getTargetSceneTime } from "./engine";

const seedsRaw = [
  { x: 20, y: 30 }, { x: -30, y: 10 }, { x: 10, y: -40 },
  { x: -20, y: -20 }, { x: 40, y: -10 }, { x: -10, y: 50 },
  { x: -50, y: -30 }, { x: 30, y: 15 }, { x: -40, y: 35 },
  { x: 0, y: -10 }, { x: 15, y: -50 }, { x: 45, y: -35 },
  { x: -25, y: 60 }, { x: 50, y: 40 },
];

const SCENE_READY_EVENT = "melonui:scene-ready";

function pseudoRandom(seed: number) {
  const value = Math.sin(seed * 12.9898 + 78.233) * 43758.5453;
  return value - Math.floor(value);
}

function randomBetween(seed: number, min: number, max: number) {
  return min + pseudoRandom(seed) * (max - min);
}

function clamp(value: number, min: number, max: number) {
  return Math.min(max, Math.max(min, value));
}

function smoothStep(value: number) {
  const t = clamp(value, 0, 1);
  return t * t * (3 - 2 * t);
}

type MelonProps = {
  quality: SceneQualityConfig;
};

export function Melon({ quality }: MelonProps) {
  const ambientRigRef = useRef<THREE.Group>(null);
  const groupRef = useRef<THREE.Group>(null);
  const idleGroupRef = useRef<THREE.Group>(null);
  const topHalfRef = useRef<THREE.Group>(null);
  const bottomHalfRef = useRef<THREE.Group>(null);
  const katanaRef = useRef<THREE.Group>(null);
  const splashGroupRef = useRef<THREE.Group>(null);
  const originalSeedsRef = useRef<THREE.InstancedMesh>(null);
  const originalSeedScalesRef = useRef<{ x: number; y: number; z: number }[]>([]);
  const originalSeedsResetRef = useRef(false);
  const fallingSeedsGroupRef = useRef<THREE.Group>(null);
  const fallingSeedsRefs = useRef<(THREE.Mesh | null)[]>([]);
  const sandRef = useRef<THREE.Group>(null);
  const plantGroupRef = useRef<THREE.Group>(null);
  const sproutRef = useRef<THREE.Mesh>(null);
  const cotyledon1Ref = useRef<THREE.Mesh>(null);
  const cotyledon2Ref = useRef<THREE.Mesh>(null);
  const plantStemRef = useRef<THREE.Mesh>(null);
  const sideVineRef = useRef<THREE.Mesh>(null);
  const fruitStemRef = useRef<THREE.Mesh>(null);
  const fruitCalyxRef = useRef<THREE.Group>(null);
  const tendrilLeftRef = useRef<THREE.Mesh>(null);
  const tendrilRightRef = useRef<THREE.Mesh>(null);
  const plantLeaf1Ref = useRef<THREE.Mesh>(null);
  const plantLeaf2Ref = useRef<THREE.Mesh>(null);
  const plantLeaf3Ref = useRef<THREE.Mesh>(null);
  const plantLeaf4Ref = useRef<THREE.Mesh>(null);
  const smallMelonRef = useRef<THREE.Mesh>(null);
  const pluckMelonRef = useRef<THREE.Mesh>(null);
  const dropletsRefs = useRef<(THREE.Mesh | null)[]>([]);
  const scenePhaseRef = useRef(0);
  const sceneTimeRef = useRef(0);
  const introSectionDurationRef = useRef(0);

  const scale = quality.sceneScale;
  const segments = quality.segments;
  const reducedMotion = quality.motion === "reduced";
  const fruitScale = quality.deviceTier === "desktop" ? 1.26 : 1.08;
  const featurePhase = 2.02;
  const sandPhase = 3.02;
  const plantPhase = 4.02;
  const fruitPhase = 5.02;
  const returnPhase = 5.72;
  const swordEnterAt = 1.16;
  const swordCutAt = 1.5;
  const swordExitAt = 2.05;

  const teardropShape = useMemo(() => {
    const shape = new THREE.Shape();
    shape.moveTo(-1, 0);
    shape.bezierCurveTo(-0.2, 0.4, 0.5, 0.6, 0.5, 0);
    shape.bezierCurveTo(0.5, -0.6, -0.2, -0.4, -1, 0);
    return shape;
  }, []);

  const texture = useMemo(() => {
    const canvas = document.createElement("canvas");
    canvas.width = 1024;
    canvas.height = 512;
    const ctx = canvas.getContext("2d");
    if (ctx) {
      ctx.fillStyle = "#5c8a4d";
      ctx.fillRect(0, 0, 1024, 512);

      for (let i = 0; i < 12; i += 1) {
        const startX = (i * 1024) / 12;
        [-1024, 0, 1024].forEach((offset) => {
          ctx.beginPath();
          for (let y = 0; y <= 512; y += 5) {
            const wave1 = Math.sin(y * 0.05) * 15;
            const wave2 = Math.sin(y * 0.1 + i) * 10;
            const x = startX + offset + wave1 + wave2;
            if (y === 0) {
              ctx.moveTo(x, y);
            } else {
              ctx.lineTo(x, y);
            }
          }
          ctx.lineWidth = 20;
          ctx.lineCap = "round";
          ctx.lineJoin = "round";
          ctx.strokeStyle = "#23401c";
          ctx.stroke();

          ctx.beginPath();
          for (let y = 0; y <= 512; y += 5) {
            const wave1 = Math.sin(y * 0.05) * 15;
            const wave2 = Math.sin(y * 0.1 + i) * 10;
            const x = startX + offset + wave1 + wave2 + 15;
            if (y === 0) {
              ctx.moveTo(x, y);
            } else {
              ctx.lineTo(x, y);
            }
          }
          ctx.lineWidth = 6;
          ctx.stroke();
        });
      }
    }
    const tex = new THREE.CanvasTexture(canvas);
    tex.wrapS = THREE.RepeatWrapping;
    tex.anisotropy = quality.deviceTier === "desktop" ? 16 : 4;
    return tex;
  }, [quality.deviceTier]);

  const innerTexture = useMemo(() => {
    const canvas = document.createElement("canvas");
    canvas.width = 512;
    canvas.height = 512;
    const ctx = canvas.getContext("2d");
    if (ctx) {
      const gradient = ctx.createRadialGradient(256, 256, 0, 256, 256, 256);
      gradient.addColorStop(0, "#e62e45");
      gradient.addColorStop(0.68, "#ff4b63");
      gradient.addColorStop(0.88, "#f7b2bd");
      gradient.addColorStop(0.95, "#e0f2dc");
      gradient.addColorStop(1, "#2e4a25");

      ctx.fillStyle = gradient;
      ctx.fillRect(0, 0, 512, 512);

      ctx.fillStyle = "rgba(255,255,255,0.06)";
      for (let i = 0; i < 20000; i += 1) {
        const x = pseudoRandom(i + 1) * 512;
        const y = pseudoRandom(i + 20001) * 512;
        const r = Math.sqrt((x - 256) ** 2 + (y - 256) ** 2);
        if (r < 230) {
          ctx.fillRect(x, y, 2, 2);
        }
      }

      ctx.fillStyle = "rgba(100,0,0,0.08)";
      for (let i = 0; i < 20000; i += 1) {
        const x = pseudoRandom(i + 40001) * 512;
        const y = pseudoRandom(i + 60001) * 512;
        const r = Math.sqrt((x - 256) ** 2 + (y - 256) ** 2);
        if (r < 230) {
          ctx.fillRect(x, y, 2, 2);
        }
      }
    }
    return new THREE.CanvasTexture(canvas);
  }, []);

  const seeds3D = useMemo(() => {
    return Array.from({ length: quality.seedCount }, (_, index) => {
      const baseSeed = seedsRaw[index % seedsRaw.length];
      const ringIndex = Math.floor(index / seedsRaw.length);
      const ringScale = Math.max(0.42, 1 - ringIndex * 0.22);
      const ringRotation = ringIndex * 0.24;
      const jitter = ringIndex === 0 ? 0.03 : 0.05;
      const baseX = (baseSeed.x / 36) * ringScale;
      const baseY = (baseSeed.y / 36) * ringScale;
      const rotatedX = baseX * Math.cos(ringRotation) - baseY * Math.sin(ringRotation);
      const rotatedY = baseX * Math.sin(ringRotation) + baseY * Math.cos(ringRotation);
      const x = rotatedX + randomBetween(index + 1201, -jitter, jitter);
      const y = rotatedY + randomBetween(index + 2201, -jitter, jitter);
      const angle = Math.atan2(y, x);
      return {
        position: [x, y, 0.01] as [number, number, number],
        rotation: [0, 0, angle + Math.PI / 2] as [number, number, number],
      };
    });
  }, [quality.seedCount]);

  const landingSeedIndex = useMemo(() => {
    return seeds3D.reduce((bestIndex, seed, index) => {
      const [x, y] = seed.position;
      const [bestX, bestY] = seeds3D[bestIndex].position;
      const score = Math.abs(x) * 0.8 + Math.abs(y + 0.18);
      const bestScore = Math.abs(bestX) * 0.8 + Math.abs(bestY + 0.18);
      return score < bestScore ? index : bestIndex;
    }, 0);
  }, [seeds3D]);

  const seedFallData = useMemo(() => {
    const revealGroup = new THREE.Object3D();
    revealGroup.position.set(-0.02, 1.18, 0.22);
    revealGroup.rotation.set(Math.PI * 0.54, Math.PI * 1.44, -0.08);
    revealGroup.scale.set(0.97, 0.97, 0.97);

    const revealIdle = new THREE.Object3D();
    revealIdle.rotation.set(0, Math.PI * 0.88, 0);

    const revealBottom = new THREE.Object3D();
    revealBottom.position.set(0, 0.01, 0);

    const revealFace = new THREE.Object3D();
    revealFace.position.set(0, -0.005, 0);
    revealFace.rotation.set(-Math.PI / 2, 0, 0);

    revealGroup.add(revealIdle);
    revealIdle.add(revealBottom);
    revealBottom.add(revealFace);
    revealGroup.updateMatrixWorld(true);

    const worldNormal = new THREE.Vector3(0, 0, 1)
      .transformDirection(revealFace.matrixWorld)
      .normalize();
    const gravity = new THREE.Vector3(0, -1, 0);

    return seeds3D.map((seed, index) => {
      const isLandingSeed = index === landingSeedIndex;
      const seedVector = new THREE.Vector3(...seed.position);
      const startVector = revealFace.localToWorld(seedVector.clone());
      const radialLocal = new THREE.Vector3(seed.position[0], seed.position[1], 0);
      const radialLength = radialLocal.length();
      const edgeFactor = clamp((radialLength - 0.18) / 1.5, 0, 1);
      const topBias = clamp((seed.position[1] + 1.75) / 3.5, 0, 1);
      const releaseDirectionLocal =
        radialLength > 0.0001 ? radialLocal.normalize() : new THREE.Vector3(0, 1, 0);
      const releaseDirection = releaseDirectionLocal
        .clone()
        .transformDirection(revealFace.matrixWorld)
        .normalize();

      startVector.addScaledVector(worldNormal, 0.03 + edgeFactor * 0.015);

      const slipVector = startVector
        .clone()
        .addScaledVector(releaseDirection, isLandingSeed ? 0.16 : 0.22 + edgeFactor * 0.22)
        .addScaledVector(worldNormal, isLandingSeed ? 0.03 : 0.05)
        .addScaledVector(gravity, 0.08 + (1 - topBias) * 0.12);

      const landX = isLandingSeed
        ? 0.08
        : clamp(
            startVector.x +
              releaseDirection.x * (0.46 + edgeFactor * 0.8) +
              randomBetween(index + 19001, -0.16, 0.16),
            -1.95,
            1.95,
          );
      const landY = -1.48 + (isLandingSeed ? 0.04 : randomBetween(index + 20001, 0.02, 0.14));
      const landZ = isLandingSeed
        ? 0.16
        : clamp(
            startVector.z +
              releaseDirection.z * (0.38 + edgeFactor * 0.54) +
              randomBetween(index + 21001, -0.14, 0.14),
            -1.2,
            1.08,
          );
      const settleX = landX + (isLandingSeed ? 0 : randomBetween(index + 29001, -0.08, 0.08));
      const settleZ = landZ + (isLandingSeed ? 0 : randomBetween(index + 30001, -0.08, 0.08));
      const settleY = landY + (isLandingSeed ? 0.01 : 0);
      const bounceY = landY + (isLandingSeed ? 0.05 : randomBetween(index + 31001, 0.08, 0.18));
      const releaseAt =
        sandPhase -
        0.18 +
        (1 - edgeFactor) * 0.12 +
        topBias * 0.06 +
        randomBetween(index + 22001, 0, 0.06);
      const slipDuration = randomBetween(index + 23001, 0.1, 0.16);
      const fallDuration = randomBetween(index + 24001, 0.28, 0.44);
      const bounceDuration = isLandingSeed ? 0.08 : randomBetween(index + 25001, 0.08, 0.14);
      const settleDuration = isLandingSeed ? 0.12 : randomBetween(index + 26001, 0.1, 0.16);
      const activeScale = isLandingSeed
        ? [1.7, 3, 0.72]
        : [1, 1.8, 0.4];
      const impactScale = isLandingSeed
        ? [1.56, 2.56, 0.68]
        : [1.16, 0.72, 0.24];
      const restScale = isLandingSeed
        ? [1.52, 2.84, 0.68]
        : [0.84, 1.26, 0.28];
      const endRotation = [
        seed.rotation[0] + randomBetween(index + 32001, 0.8, 2.4) * Math.PI,
        seed.rotation[1] + randomBetween(index + 33001, 0.7, 2.6) * Math.PI,
        seed.rotation[2] + randomBetween(index + 34001, 0.6, 2.1) * Math.PI,
      ] as [number, number, number];

      return {
        start: [startVector.x, startVector.y, startVector.z] as [number, number, number],
        slip: [slipVector.x, slipVector.y, slipVector.z] as [number, number, number],
        land: [landX, landY, landZ] as [number, number, number],
        bounce: [(landX + settleX) * 0.5, bounceY, (landZ + settleZ) * 0.5] as [number, number, number],
        settle: [settleX, settleY, settleZ] as [number, number, number],
        releaseAt,
        slipDuration,
        fallDuration,
        bounceDuration,
        settleDuration,
        activeScale: activeScale as [number, number, number],
        impactScale: impactScale as [number, number, number],
        restScale: restScale as [number, number, number],
        startRotation: seed.rotation,
        endRotation,
        fadeAt: plantPhase - 0.08 + randomBetween(index + 35001, 0, 0.16),
        fadeDuration: randomBetween(index + 36001, 0.16, 0.28),
      };
    });
  }, [landingSeedIndex, plantPhase, sandPhase, seeds3D]);

  const stemCurve = useMemo(() => new THREE.CatmullRomCurve3([
    new THREE.Vector3(0, 0, 0),
    new THREE.Vector3(0.03, 0.26, 0.02),
    new THREE.Vector3(-0.04, 0.62, -0.04),
    new THREE.Vector3(0.08, 1.02, 0.06),
    new THREE.Vector3(-0.02, 1.38, -0.03),
    new THREE.Vector3(0.1, 1.76, 0.08),
    new THREE.Vector3(0.22, 2.08, 0.16),
  ]), []);

  const sideVineCurve = useMemo(() => new THREE.CatmullRomCurve3([
    new THREE.Vector3(-0.02, 0.86, 0.02),
    new THREE.Vector3(-0.28, 1.02, -0.08),
    new THREE.Vector3(-0.56, 1.18, -0.2),
    new THREE.Vector3(-0.84, 1.26, -0.28),
  ]), []);

  const fruitStemCurve = useMemo(() => new THREE.CatmullRomCurve3([
    new THREE.Vector3(0.2, 1.92, 0.14),
    new THREE.Vector3(0.42, 1.92, 0.12),
    new THREE.Vector3(0.58, 1.78, 0.08),
    new THREE.Vector3(0.68, 1.62, 0.03),
  ]), []);

  const tendrilLeftCurve = useMemo(() => new THREE.CatmullRomCurve3([
    new THREE.Vector3(-0.32, 1.02, -0.08),
    new THREE.Vector3(-0.48, 1.08, -0.16),
    new THREE.Vector3(-0.52, 0.95, -0.22),
    new THREE.Vector3(-0.36, 0.88, -0.18),
    new THREE.Vector3(-0.28, 1.0, -0.12),
  ]), []);

  const tendrilRightCurve = useMemo(() => new THREE.CatmullRomCurve3([
    new THREE.Vector3(0.2, 1.58, 0.04),
    new THREE.Vector3(0.34, 1.66, 0.14),
    new THREE.Vector3(0.26, 1.82, 0.2),
    new THREE.Vector3(0.12, 1.76, 0.18),
    new THREE.Vector3(0.18, 1.6, 0.08),
  ]), []);

  const cotyledonShape = useMemo(() => {
    const shape = new THREE.Shape();
    shape.moveTo(0, 0);
    shape.bezierCurveTo(0.16, -0.02, 0.16, 0.22, 0, 0.26);
    shape.bezierCurveTo(-0.16, 0.22, -0.16, -0.02, 0, 0);
    return shape;
  }, []);

  const leafShape = useMemo(() => {
    const shape = new THREE.Shape();
    shape.moveTo(0, 0.02);
    shape.bezierCurveTo(-0.08, -0.05, -0.24, -0.1, -0.38, 0.06);
    shape.bezierCurveTo(-0.56, 0.24, -0.54, 0.54, -0.38, 0.72);
    shape.bezierCurveTo(-0.24, 0.9, -0.06, 0.94, 0, 0.78);
    shape.bezierCurveTo(0.08, 0.94, 0.28, 0.9, 0.42, 0.74);
    shape.bezierCurveTo(0.58, 0.56, 0.56, 0.24, 0.38, 0.06);
    shape.bezierCurveTo(0.24, -0.1, 0.08, -0.05, 0, 0.02);
    return shape;
  }, []);

  const calyxShape = useMemo(() => {
    const shape = new THREE.Shape();
    shape.moveTo(0, 0);
    shape.lineTo(0.1, 0.3);
    shape.bezierCurveTo(0.04, 0.26, -0.02, 0.26, -0.1, 0.3);
    shape.closePath();
    return shape;
  }, []);

  const stemTexture = useMemo(() => {
    const canvas = document.createElement("canvas");
    canvas.width = 128;
    canvas.height = 512;
    const ctx = canvas.getContext("2d");
    if (ctx) {
      const gradient = ctx.createLinearGradient(0, 0, 128, 0);
      gradient.addColorStop(0, "#47811a");
      gradient.addColorStop(0.5, "#25550f");
      gradient.addColorStop(1, "#4e8a1f");
      ctx.fillStyle = gradient;
      ctx.fillRect(0, 0, 128, 512);
      ctx.strokeStyle = "rgba(18,45,6,0.28)";
      ctx.lineWidth = 1;
      for (let x = 0; x < 128; x += 10) {
        ctx.beginPath();
        ctx.moveTo(x, 0);
        ctx.lineTo(x + (pseudoRandom(x + 1) - 0.5) * 4, 512);
        ctx.stroke();
      }
      ctx.fillStyle = "rgba(195,235,140,0.08)";
      for (let i = 0; i < 260; i += 1) {
        ctx.fillRect(pseudoRandom(i + 3001) * 128, pseudoRandom(i + 6001) * 512, 1, 2);
      }
    }
    return new THREE.CanvasTexture(canvas);
  }, []);

  const leafTexture = useMemo(() => {
    const canvas = document.createElement("canvas");
    canvas.width = 256;
    canvas.height = 256;
    const ctx = canvas.getContext("2d");
    if (ctx) {
      ctx.fillStyle = "#2c6a13";
      ctx.fillRect(0, 0, 256, 256);
      const gradient = ctx.createRadialGradient(128, 82, 12, 128, 128, 150);
      gradient.addColorStop(0, "rgba(86,170,35,0.55)");
      gradient.addColorStop(1, "rgba(15,52,5,0)");
      ctx.fillStyle = gradient;
      ctx.fillRect(0, 0, 256, 256);
      ctx.strokeStyle = "rgba(120,220,45,0.48)";
      ctx.lineWidth = 2;
      ctx.beginPath();
      ctx.moveTo(128, 250);
      ctx.bezierCurveTo(126, 196, 132, 96, 128, 8);
      ctx.stroke();
      ctx.lineWidth = 1;
      for (let i = 0; i < 6; i += 1) {
        const y = 224 - i * 38;
        const direction = i % 2 === 0 ? 1 : -1;
        ctx.beginPath();
        ctx.moveTo(128, y);
        ctx.quadraticCurveTo(128 + direction * 36, y - 18, 128 + direction * 84, y - 28);
        ctx.stroke();
      }
      ctx.fillStyle = "rgba(24,78,8,0.16)";
      for (let i = 0; i < 12; i += 1) {
        ctx.beginPath();
        ctx.arc(
          pseudoRandom(i + 7001) * 200 + 28,
          pseudoRandom(i + 8001) * 200 + 28,
          pseudoRandom(i + 9001) * 22 + 5,
          0,
          Math.PI * 2,
        );
        ctx.fill();
      }
    }
    return new THREE.CanvasTexture(canvas);
  }, []);

  const smallMelonRind = useMemo(() => {
    const canvas = document.createElement("canvas");
    canvas.width = 256;
    canvas.height = 256;
    const ctx = canvas.getContext("2d");
    if (ctx) {
      ctx.fillStyle = "#4b7d25";
      ctx.fillRect(0, 0, 256, 256);
      for (let i = 0; i < 8; i += 1) {
        ctx.save();
        ctx.translate(128, 128);
        ctx.rotate((i / 8) * Math.PI * 2);
        ctx.fillStyle = "rgba(26,58,10,0.38)";
        ctx.fillRect(-7, -128, 14, 256);
        ctx.restore();
      }
    }
    return new THREE.CanvasTexture(canvas);
  }, []);

  const bladeTexture = useMemo(() => {
    const canvas = document.createElement("canvas");
    canvas.width = 512;
    canvas.height = 128;
    const ctx = canvas.getContext("2d");
    if (ctx) {
      ctx.fillStyle = "#a0a0a0";
      ctx.fillRect(0, 0, 512, 128);
      ctx.fillStyle = "#b0b0b0";
      for (let i = 0; i < 200; i += 1) {
        ctx.fillRect(
          pseudoRandom(i + 10001) * 512,
          pseudoRandom(i + 11001) * 128,
          pseudoRandom(i + 12001) * 50 + 10,
          1,
        );
      }
      ctx.beginPath();
      ctx.moveTo(0, 128);
      for (let x = 0; x <= 512; x += 10) {
        ctx.lineTo(x, 100 + Math.sin(x * 0.05) * 10 + pseudoRandom(x + 13001) * 5);
      }
      ctx.lineTo(512, 128);
      ctx.fillStyle = "#d0d0d0";
      ctx.fill();
    }
    return new THREE.CanvasTexture(canvas);
  }, []);

  const dropletsData = useMemo(() => {
    const streakCount = quality.deviceTier === "desktop" ? 8 : 5;
    const dropletCount = reducedMotion ? 0 : quality.deviceTier === "desktop" ? 3 : 2;
    const totalCount = streakCount + dropletCount;

    return Array.from({ length: totalCount }).map((_, index) => {
      const isStreak = index < streakCount;
      const angle = isStreak
        ? -0.9 + (index / Math.max(streakCount - 1, 1)) * 1.8
        : pseudoRandom(index + 14001) * Math.PI * 2;

      let speed = 10;
      let dropScale = 0.2;

      if (isStreak) {
        const lengthType = index % 4;
        if (lengthType === 0) {
          speed = 14;
          dropScale = 0.15;
        } else if (lengthType === 1) {
          speed = 18;
          dropScale = 0.11;
        } else if (lengthType === 2) {
          speed = 12;
          dropScale = 0.08;
        } else {
          speed = 9;
          dropScale = 0.06;
        }
      } else {
        speed = randomBetween(index + 15001, 3, 7);
        dropScale = randomBetween(index + 16001, 0.035, 0.08);
      }

      const targetX = Math.cos(angle) * speed;
      let targetY = Math.sin(angle) * speed * 0.28 + randomBetween(index + 16501, 1.2, 2.4);
      if (!isStreak) {
        targetY -= 0.6;
      }

      return {
        isStreak,
        angle: Math.atan2(targetY, targetX),
        position: [
          isStreak ? randomBetween(index + 17001, -0.04, 0.04) : randomBetween(index + 17001, -0.16, 0.16),
          isStreak ? randomBetween(index + 18001, -0.06, 0.06) : randomBetween(index + 18001, -0.14, 0.14),
          1.02,
        ] as [number, number, number],
        targetX,
        targetY,
        targetZ: 1.22,
        scale: dropScale,
      };
    });
  }, [quality.deviceTier, reducedMotion]);

  const handleTexture = useMemo(() => {
    const canvas = document.createElement("canvas");
    canvas.width = 128;
    canvas.height = 128;
    const ctx = canvas.getContext("2d");
    if (ctx) {
      ctx.fillStyle = "#8b0000";
      ctx.fillRect(0, 0, 128, 128);
      ctx.strokeStyle = "#1a1a1a";
      ctx.lineWidth = 12;
      for (let i = -128; i < 256; i += 32) {
        ctx.beginPath();
        ctx.moveTo(i, 0);
        ctx.lineTo(i + 128, 128);
        ctx.stroke();
        ctx.beginPath();
        ctx.moveTo(i + 128, 0);
        ctx.lineTo(i, 128);
        ctx.stroke();
      }
    }
    const tex = new THREE.CanvasTexture(canvas);
    tex.wrapS = THREE.RepeatWrapping;
    tex.wrapT = THREE.RepeatWrapping;
    tex.repeat.set(5, 1);
    return tex;
  }, []);


  const seedGeometry = useMemo(() => new THREE.SphereGeometry(0.04, 8, 8), []);
  const originalSeedMaterial = useMemo(() => new THREE.MeshStandardMaterial({
    color: "#1a0a05",
    roughness: 0.2,
    metalness: 0.1,
  }), []);
  const fallingSeedMaterial = useMemo(() => new THREE.MeshStandardMaterial({
    color: "#1a0a05",
    roughness: 0.2,
    metalness: 0.2,
    emissive: "#0a0502",
    emissiveIntensity: 0.3,
  }), []);
  const streakGeometry = useMemo(() => new THREE.CircleGeometry(1, 12), []);
  const dropletGeometry = useMemo(() => new THREE.ShapeGeometry(teardropShape), [teardropShape]);
  const splashMaterial = useMemo(() => new THREE.MeshBasicMaterial({
    color: "#d92027",
    transparent: true,
    opacity: 0.8,
  }), []);
  const pebbleGeometry = useMemo(() => new THREE.SphereGeometry(1, 8, 8), []);
  const seedMatrixDummy = useMemo(() => new THREE.Object3D(), []);

  const updateSeedInstance = useCallback((index: number) => {
    const mesh = originalSeedsRef.current;
    const seed = seeds3D[index];
    const scaleState = originalSeedScalesRef.current[index];

    if (!mesh || !seed || !scaleState) {
      return;
    }

    seedMatrixDummy.position.set(...seed.position);
    seedMatrixDummy.rotation.set(...seed.rotation);
    seedMatrixDummy.scale.set(scaleState.x, scaleState.y, scaleState.z);
    seedMatrixDummy.updateMatrix();
    mesh.setMatrixAt(index, seedMatrixDummy.matrix);
    mesh.instanceMatrix.needsUpdate = true;
  }, [seedMatrixDummy, seeds3D]);

  const resetOriginalSeeds = useCallback(() => {
    const mesh = originalSeedsRef.current;
    if (!mesh) {
      return;
    }

    mesh.visible = true;
    mesh.instanceMatrix.setUsage(THREE.DynamicDrawUsage);
    originalSeedScalesRef.current = seeds3D.map(() => ({ x: 1, y: 1.8, z: 0.4 }));
    seeds3D.forEach((_, index) => updateSeedInstance(index));
    originalSeedsResetRef.current = true;
  }, [seeds3D, updateSeedInstance]);

  useFrame((state) => {
    if (reducedMotion) {
      return;
    }

    const phase = scenePhaseRef.current;
    const introWeight = clamp(1 - Math.max(phase - 2.72, 0) / 0.4, 0, 1);
    const returnWeight = clamp((phase - returnPhase) / 0.32, 0, 1);
    const ambientWeight = Math.max(introWeight, returnWeight * 0.75);
    const plantWeight =
      clamp((phase - plantPhase) / 0.24, 0, 1) *
      clamp((returnPhase + 0.08 - phase) / 0.32, 0, 1);
    const fruitWeight =
      clamp((phase - fruitPhase) / 0.18, 0, 1) *
      clamp((returnPhase - phase) / 0.18, 0, 1);
    const elapsed = state.clock.getElapsedTime();

    if (ambientRigRef.current) {
      ambientRigRef.current.position.y = Math.sin(elapsed * 1.05) * 0.12 * ambientWeight;
      ambientRigRef.current.rotation.z = Math.sin(elapsed * 0.55) * 0.035 * ambientWeight;
      ambientRigRef.current.rotation.x = Math.cos(elapsed * 0.45) * 0.02 * ambientWeight;
    }

    if (plantGroupRef.current) {
      plantGroupRef.current.rotation.z = Math.sin(elapsed * 0.92) * 0.045 * plantWeight;
      plantGroupRef.current.rotation.y = Math.cos(elapsed * 0.52) * 0.08 * plantWeight;
    }

    if (smallMelonRef.current) {
      smallMelonRef.current.rotation.z = Math.sin(elapsed * 1.28) * 0.12 * fruitWeight;
      smallMelonRef.current.rotation.x = Math.cos(elapsed * 1.08) * 0.06 * fruitWeight;
    }

    if (katanaRef.current) {
      katanaRef.current.visible = true;
    }
  });

  useEffect(() => {
    if (
      !ambientRigRef.current ||
      !groupRef.current ||
      !idleGroupRef.current ||
      !topHalfRef.current ||
      !bottomHalfRef.current ||
      !katanaRef.current ||
      !splashGroupRef.current ||
      !originalSeedsRef.current ||
      !fallingSeedsGroupRef.current ||
      !sandRef.current ||
      !plantGroupRef.current ||
      !sproutRef.current ||
      !cotyledon1Ref.current ||
      !cotyledon2Ref.current ||
      !plantStemRef.current ||
      !sideVineRef.current ||
      !fruitStemRef.current ||
      !fruitCalyxRef.current ||
      !tendrilLeftRef.current ||
      !tendrilRightRef.current ||
      !plantLeaf1Ref.current ||
      !plantLeaf2Ref.current ||
      !plantLeaf3Ref.current ||
      !plantLeaf4Ref.current ||
      !smallMelonRef.current ||
      !pluckMelonRef.current
    ) {
      return;
    }

    const dropEase = reducedMotion ? "power2.out" : "back.out(2)";
    const growthEase = reducedMotion ? "power2.out" : "back.out(1.8)";
    const finalPopEase = reducedMotion ? "power2.out" : "elastic.out(0.9, 0.55)";
    let masterTl: gsap.core.Timeline | null = null;
    let scrollFrameId: number | null = null;
    let cleanupScroll: (() => void) | null = null;

    const setupId = window.setTimeout(() => {
      const scroller = document.getElementById("snap-container");
      const trigger = document.getElementById("scroll-content");
      if (!scroller || !trigger) {
        return;
      }

      const ambientRig = ambientRigRef.current!;
      const group = groupRef.current!;
      const idleGroup = idleGroupRef.current!;
      const topHalf = topHalfRef.current!;
      const bottomHalf = bottomHalfRef.current!;
      const katana = katanaRef.current!;
      const splashGroup = splashGroupRef.current!;
      const fallingSeedsGroup = fallingSeedsGroupRef.current!;
      const sand = sandRef.current!;
      const plantGroup = plantGroupRef.current!;
      const sprout = sproutRef.current!;
      const cotyledon1 = cotyledon1Ref.current!;
      const cotyledon2 = cotyledon2Ref.current!;
      const plantStem = plantStemRef.current!;
      const sideVine = sideVineRef.current!;
      const fruitStem = fruitStemRef.current!;
      const fruitCalyx = fruitCalyxRef.current!;
      const tendrilLeft = tendrilLeftRef.current!;
      const tendrilRight = tendrilRightRef.current!;
      const plantLeaf1 = plantLeaf1Ref.current!;
      const plantLeaf2 = plantLeaf2Ref.current!;
      const plantLeaf3 = plantLeaf3Ref.current!;
      const plantLeaf4 = plantLeaf4Ref.current!;
      const smallMelon = smallMelonRef.current!;
      const pluckMelon = pluckMelonRef.current!;

      scenePhaseRef.current = 0;

      ambientRig.position.set(0, 0, 0);
      ambientRig.rotation.set(0, 0, 0);

      group.position.set(0, 0, 0);
      group.rotation.set(0, 0, 0);
      group.scale.set(1, 1, 1);
      group.visible = true;
      idleGroup.rotation.set(0, 0, 0);

      topHalf.position.set(0, 0, 0);
      topHalf.rotation.set(0, 0, 0);
      topHalf.scale.set(1, 1, 1);
      bottomHalf.position.set(0, 0, 0);
      bottomHalf.rotation.set(0, 0, 0);
      bottomHalf.scale.set(1, 1, 1);

      splashGroup.position.set(0, 0, 0);
      splashGroup.scale.set(1, 1, 1);
      splashGroup.visible = false;

      fallingSeedsGroup.visible = false;

      katana.position.set(15, 6.9, 0);
      katana.rotation.set(0, 0, Math.PI / 5.4);
      katana.visible = true;

      sand.position.set(0, -4.7, 0);
      sand.rotation.set(0, 0, 0);
      sand.scale.set(0, 0, 0);
      sand.visible = false;

      plantGroup.position.set(0, -1.55, 0.22);
      plantGroup.rotation.set(0, 0, 0);
      plantGroup.scale.set(1, 1, 1);
      plantGroup.visible = false;

      sprout.scale.set(1, 0, 1);
      sprout.rotation.set(0, 0, 1.1);

      cotyledon1.scale.set(0, 0, 0);
      cotyledon1.rotation.set(0.08, 0, -0.28);
      cotyledon2.scale.set(0, 0, 0);
      cotyledon2.rotation.set(-0.08, 0, 0.28);

      plantStem.scale.set(1, 0, 1);
      sideVine.scale.set(0, 0, 0);
      fruitStem.scale.set(0, 0, 0);
      fruitCalyx.scale.set(0, 0, 0);
      tendrilLeft.scale.set(0, 0, 0);
      tendrilRight.scale.set(0, 0, 0);

      plantLeaf1.scale.set(0, 0, 0);
      plantLeaf2.scale.set(0, 0, 0);
      plantLeaf3.scale.set(0, 0, 0);
      plantLeaf4.scale.set(0, 0, 0);
      smallMelon.scale.set(0, 0, 0);
      smallMelon.rotation.set(0, 0, 0);
      smallMelon.visible = false;

      pluckMelon.position.set(0.68, 0.19, 0.26);
      pluckMelon.scale.set(0, 0, 0);
      pluckMelon.rotation.set(0, 0, 0);
      pluckMelon.visible = false;

      resetOriginalSeeds();

      fallingSeedsRefs.current.forEach((mesh, index) => {
        if (!mesh) {
          return;
        }
        mesh.position.set(...seedFallData[index].start);
        mesh.rotation.set(...seedFallData[index].startRotation);
        mesh.scale.set(0, 0, 0);
      });

      dropletsRefs.current.forEach((mesh, index) => {
        const drop = dropletsData[index];
        if (!mesh || !drop) {
          return;
        }
        mesh.position.set(...drop.position);
        mesh.scale.set(0, 0, 0);
      });

      const timeline = gsap.timeline({ paused: true });
      masterTl = timeline;

      timeline.set(katana.position, { x: 15, y: 6.9, z: 0 }, 0);
      timeline.set(katana.rotation, { x: 0, y: 0, z: Math.PI / 5.4 }, 0);

      timeline.to(group.rotation, {
        x: Math.PI / 2,
        y: Math.PI * 1.1,
        z: Math.PI * 0.32,
        ease: "power1.inOut",
        duration: 1.6,
      }, 0);

      timeline.to(group.rotation, {
        x: Math.PI / 2,
        y: Math.PI * 1.34,
        z: Math.PI * 0.16,
        ease: reducedMotion ? "power1.out" : "power3.out",
        duration: 0.4,
      }, 1.6);

      timeline.to(idleGroup.rotation, {
        y: Math.PI * 0.88,
        ease: "none",
        duration: 2,
      }, 0);

      timeline.to([group.position, splashGroup.position], {
        y: -0.58,
        ease: "power1.inOut",
        duration: 1,
      }, 0);

      timeline.to(katana.position, {
        x: 8,
        y: 0.7,
        ease: "power2.out",
        duration: 0.34,
      }, swordEnterAt);
      timeline.to(katana.rotation, {
        z: -Math.PI / 14,
        ease: "power2.out",
        duration: 0.34,
      }, swordEnterAt);

      timeline.to(katana.position, {
        x: -8,
        y: -2.45,
        ease: "none",
        duration: 0.54,
      }, swordCutAt);
      timeline.to(katana.rotation, {
        z: -Math.PI / 8,
        ease: "none",
        duration: 0.54,
      }, swordCutAt);

      timeline.to(topHalf.position, {
        z: reducedMotion ? 5.2 : 7.4,
        y: 2.4,
        x: -0.9,
        ease: "power2.in",
        duration: 0.34,
      }, 1.78);
      timeline.to(topHalf.rotation, {
        x: Math.PI * 0.82,
        y: Math.PI / 7,
        z: -Math.PI / 10,
        ease: "none",
        duration: 0.34,
      }, 1.78);
      timeline.to(topHalf.scale, {
        x: 0,
        y: 0,
        z: 0,
        duration: 0.01,
      }, 2.0);

      timeline.set(splashGroup, { visible: true }, 1.76);

      dropletsData.forEach((drop, index) => {
        const mesh = dropletsRefs.current[index];
        if (!mesh) {
          return;
        }

        timeline.set(mesh.scale, { x: 0, y: 0, z: 0 }, 1.78);
        timeline.to(mesh.position, {
          x: drop.targetX,
          y: drop.targetY,
          z: drop.targetZ,
          duration: 0.88,
          ease: reducedMotion ? "power2.out" : "power3.out",
        }, 1.78);

        if (drop.isStreak) {
          timeline.to(mesh.scale, {
            x: drop.scale * 5.2,
            y: drop.scale * 0.18,
            z: drop.scale * 0.18,
            duration: 0.16,
            ease: reducedMotion ? "power2.out" : "power4.out",
          }, 1.78);
        } else {
          timeline.to(mesh.scale, {
            x: drop.scale * 2,
            y: drop.scale * 0.72,
            z: drop.scale * 0.72,
            duration: 0.22,
            ease: dropEase,
          }, 1.78);
        }

        timeline.to(mesh.scale, {
          x: 0,
          y: 0,
          z: 0,
          duration: 0.56,
          ease: "power2.inOut",
        }, 2.02);
      });
      timeline.set(splashGroup, { visible: false }, 2.28);

      timeline.to(katana.position, {
        x: -15,
        y: -5.8,
        ease: "power2.in",
        duration: 0.16,
      }, swordExitAt);

      timeline.to(group.position, {
        x: -0.02,
        y: 1.18,
        z: 0.22,
        duration: 0.54,
        ease: "power2.out",
      }, featurePhase - 0.02);
      timeline.to(group.rotation, {
        x: Math.PI * 0.54,
        y: Math.PI * 1.44,
        z: -0.08,
        duration: 0.54,
        ease: "power2.out",
      }, featurePhase - 0.02);
      timeline.to(group.scale, {
        x: 0.97,
        y: 0.97,
        z: 0.97,
        duration: 0.54,
        ease: "power2.out",
      }, featurePhase - 0.02);

      timeline.set(sand, { visible: true }, sandPhase);
      timeline.to(sand.position, {
        y: -3.15,
        duration: 0.48,
        ease: "power2.out",
      }, sandPhase);
      timeline.to(sand.scale, {
        x: 1,
        y: 1,
        z: 1,
        duration: 0.48,
        ease: "power2.out",
      }, sandPhase);
      timeline.to(sand.rotation, {
        z: 0.04,
        duration: 0.42,
        ease: "power2.out",
      }, sandPhase + 0.02);

      seedFallData.forEach((fall, index) => {
        const fallingMesh = fallingSeedsRefs.current[index];
        const isLandingSeed = index === landingSeedIndex;
        const impactAt = fall.releaseAt + fall.slipDuration + fall.fallDuration;
        const originalSeedScale = originalSeedScalesRef.current[index];

        if (originalSeedScale) {
          timeline.to(originalSeedScale, {
            x: 0,
            y: 0,
            z: 0,
            duration: 0.05,
            ease: "power1.out",
            onUpdate: () => {
              originalSeedsResetRef.current = false;
              updateSeedInstance(index);
            },
          }, fall.releaseAt);
        }
        if (!fallingMesh) {
          return;
        }

        timeline.set(fallingMesh.position, {
          x: fall.start[0],
          y: fall.start[1],
          z: fall.start[2],
        }, fall.releaseAt - 0.02);
        timeline.set(fallingMesh.rotation, {
          x: fall.startRotation[0],
          y: fall.startRotation[1],
          z: fall.startRotation[2],
        }, fall.releaseAt - 0.02);
        timeline.to(fallingMesh.scale, {
          x: fall.activeScale[0],
          y: fall.activeScale[1],
          z: fall.activeScale[2],
          duration: 0.06,
          ease: "power2.out",
        }, fall.releaseAt);
        timeline.to(fallingMesh.position, {
          x: fall.slip[0],
          y: fall.slip[1],
          z: fall.slip[2],
          duration: fall.slipDuration,
          ease: "power1.out",
        }, fall.releaseAt);
        timeline.to(fallingMesh.position, {
          x: fall.land[0],
          y: fall.land[1],
          z: fall.land[2],
          duration: fall.fallDuration,
          ease: "power2.in",
        }, fall.releaseAt + fall.slipDuration);
        timeline.to(fallingMesh.rotation, {
          x: fall.endRotation[0],
          y: fall.endRotation[1],
          z: fall.endRotation[2],
          duration: fall.slipDuration + fall.fallDuration + fall.bounceDuration + fall.settleDuration,
          ease: "none",
        }, fall.releaseAt);
        timeline.to(fallingMesh.scale, {
          x: fall.impactScale[0],
          y: fall.impactScale[1],
          z: fall.impactScale[2],
          duration: 0.06,
          ease: "power1.in",
        }, impactAt);
        timeline.to(fallingMesh.position, {
          x: fall.bounce[0],
          y: fall.bounce[1],
          z: fall.bounce[2],
          duration: fall.bounceDuration,
          ease: "power1.out",
        }, impactAt + 0.02);
        timeline.to(fallingMesh.position, {
          x: fall.settle[0],
          y: fall.settle[1],
          z: fall.settle[2],
          duration: fall.settleDuration,
          ease: "power1.in",
        }, impactAt + 0.02 + fall.bounceDuration);
        timeline.to(fallingMesh.scale, {
          x: fall.restScale[0],
          y: fall.restScale[1],
          z: fall.restScale[2],
          duration: 0.14,
          ease: "power2.out",
        }, impactAt + 0.02);

        if (!isLandingSeed) {
          timeline.to(fallingMesh.scale, {
            x: 0,
            y: 0,
            z: 0,
            duration: fall.fadeDuration,
            ease: "power1.in",
          }, fall.fadeAt);
        }
      });

      const firstSeedReleaseAt = Math.min(...seedFallData.map((fall) => fall.releaseAt));
      const finalSeedFadeAt = Math.max(
        ...seedFallData.map((fall) => fall.fadeAt + fall.fadeDuration),
        plantPhase + 0.2,
      );
      timeline.set(fallingSeedsGroup, { visible: true }, firstSeedReleaseAt - 0.04);
      timeline.set(fallingSeedsGroup, { visible: false }, finalSeedFadeAt + 0.02);

      timeline.to(group.position, {
        x: -0.12,
        y: 5.9,
        z: -1.48,
        duration: 0.42,
        ease: "power2.inOut",
      }, sandPhase - 0.1);
      timeline.to(group.rotation, {
        x: Math.PI * 0.42,
        y: Math.PI * 1.56,
        z: -0.22,
        duration: 0.4,
        ease: "power2.in",
      }, sandPhase - 0.1);
      timeline.to(group.scale, {
        x: 0.72,
        y: 0.72,
        z: 0.72,
        duration: 0.36,
        ease: "power2.inOut",
      }, sandPhase - 0.06);
      timeline.set(group, { visible: false }, sandPhase + 0.16);

      timeline.set(plantGroup, { visible: true }, plantPhase - 0.02);
      timeline.to(fallingSeedsRefs.current[landingSeedIndex]!.scale, {
        x: 0,
        y: 0,
        z: 0,
        duration: 0.12,
      }, plantPhase + 0.04);

      timeline.to(sprout.scale, {
        y: 1,
        duration: 0.18,
        ease: "power2.out",
      }, plantPhase + 0.06);
      timeline.to(sprout.rotation, {
        z: 0,
        duration: 0.16,
        ease: "power2.inOut",
      }, plantPhase + 0.16);

      timeline.to(cotyledon1.scale, {
        x: 1,
        y: 1,
        z: 1,
        duration: 0.16,
        ease: growthEase,
      }, plantPhase + 0.2);
      timeline.to(cotyledon2.scale, {
        x: 1,
        y: 1,
        z: 1,
        duration: 0.16,
        ease: growthEase,
      }, plantPhase + 0.26);
      timeline.to(cotyledon1.rotation, {
        z: -0.8,
        duration: 0.14,
      }, plantPhase + 0.28);
      timeline.to(cotyledon2.rotation, {
        z: 0.8,
        duration: 0.14,
      }, plantPhase + 0.28);

      timeline.to(plantStem.scale, {
        y: 0.38,
        duration: 0.18,
        ease: "power1.out",
      }, plantPhase + 0.32);
      timeline.to(plantStem.scale, {
        y: 0.7,
        duration: 0.18,
        ease: "power1.out",
      }, plantPhase + 0.56);
      timeline.to(plantStem.scale, {
        y: 1,
        duration: 0.22,
        ease: "power2.out",
      }, plantPhase + 0.78);

      timeline.to(sideVine.scale, {
        x: 1,
        y: 1,
        z: 1,
        duration: 0.18,
        ease: growthEase,
      }, plantPhase + 0.5);
      timeline.to(plantLeaf1.scale, {
        x: 1,
        y: 1,
        z: 1,
        duration: 0.18,
        ease: growthEase,
      }, plantPhase + 0.44);
      timeline.to(plantLeaf2.scale, {
        x: 1,
        y: 1,
        z: 1,
        duration: 0.18,
        ease: growthEase,
      }, plantPhase + 0.6);
      timeline.to(tendrilLeft.scale, {
        x: 1,
        y: 1,
        z: 1,
        duration: 0.16,
        ease: growthEase,
      }, plantPhase + 0.64);
      timeline.to(tendrilRight.scale, {
        x: 1,
        y: 1,
        z: 1,
        duration: 0.16,
        ease: growthEase,
      }, plantPhase + 0.72);
      timeline.to(plantLeaf3.scale, {
        x: 1,
        y: 1,
        z: 1,
        duration: 0.18,
        ease: growthEase,
      }, plantPhase + 0.76);
      timeline.to(fruitStem.scale, {
        x: 1,
        y: 1,
        z: 1,
        duration: 0.2,
        ease: "power2.out",
      }, plantPhase + 0.84);
      timeline.to(fruitCalyx.scale, {
        x: 1,
        y: 1,
        z: 1,
        duration: 0.18,
        ease: growthEase,
      }, plantPhase + 0.96);
      timeline.to(plantLeaf4.scale, {
        x: 1,
        y: 1,
        z: 1,
        duration: 0.18,
        ease: growthEase,
      }, plantPhase + 0.9);

      timeline.set(smallMelon, { visible: true }, fruitPhase);
      timeline.to(smallMelon.scale, {
        x: 0.16,
        y: 0.16,
        z: 0.16,
        duration: 0.14,
        ease: "power2.out",
      }, fruitPhase + 0.02);
      timeline.to(smallMelon.position, {
        x: 0.68,
        y: 1.74,
        z: 0.04,
        duration: 0.56,
        ease: "power2.out",
      }, fruitPhase + 0.08);
      timeline.to(smallMelon.scale, {
        x: fruitScale,
        y: fruitScale,
        z: fruitScale,
        duration: 0.5,
        ease: reducedMotion ? "power2.out" : "back.out(1.18)",
      }, fruitPhase + 0.14);

      timeline.set(pluckMelon, { visible: true }, returnPhase);
      timeline.set(pluckMelon.position, { x: 0.68, y: 0.19, z: 0.26 }, returnPhase);
      timeline.set(pluckMelon.scale, { x: 0.42, y: 0.42, z: 0.42 }, returnPhase);
      timeline.to(smallMelon.scale, {
        x: 1.04 * fruitScale,
        y: 1.04 * fruitScale,
        z: 1.04 * fruitScale,
        duration: 0.08,
        ease: "power2.out",
      }, returnPhase - 0.02);
      timeline.set(smallMelon, { visible: false }, returnPhase + 0.02);
      timeline.to(pluckMelon.position, {
        x: 0.12,
        y: 0.12,
        z: 0.04,
        duration: 0.26,
        ease: "power3.out",
      }, returnPhase);
      timeline.to(pluckMelon.rotation, {
        x: 0.16,
        y: Math.PI * 0.12,
        z: -0.22,
        duration: 0.22,
        ease: "power2.out",
      }, returnPhase);
      timeline.to(pluckMelon.scale, {
        x: 0.54,
        y: 0.54,
        z: 0.54,
        duration: 0.26,
        ease: "power3.out",
      }, returnPhase);

      timeline.to(plantGroup.scale, {
        x: 0.72,
        y: 0.72,
        z: 0.72,
        duration: 0.18,
        ease: "power2.in",
      }, returnPhase + 0.02);
      timeline.to(plantGroup.position, {
        x: -0.12,
        y: -4.5,
        z: -0.36,
        duration: 0.48,
        ease: "power3.in",
      }, returnPhase + 0.08);
      timeline.to(sand.rotation, {
        x: -0.12,
        y: 0.08,
        z: -0.18,
        duration: 0.34,
        ease: "power2.in",
      }, returnPhase + 0.02);
      timeline.to(sand.position, {
        x: 0.56,
        y: -14.2,
        z: -1.18,
        duration: 0.58,
        ease: "power4.in",
      }, returnPhase + 0.08);
      timeline.to(sand.scale, {
        x: 0.78,
        y: 0.46,
        z: 0.78,
        duration: 0.48,
        ease: "power1.in",
      }, returnPhase + 0.08);

      timeline.set(topHalf.scale, { x: 1, y: 1, z: 1 }, returnPhase);
      timeline.set(topHalf.position, { x: 0, y: 0, z: 0 }, returnPhase);
      timeline.set(topHalf.rotation, { x: 0, y: 0, z: 0 }, returnPhase);
      timeline.set(bottomHalf.scale, { x: 1, y: 1, z: 1 }, returnPhase);
      timeline.set(group.position, { x: 0.12, y: 0.12, z: 0.04 }, returnPhase + 0.16);
      timeline.set(group.rotation, { x: 0.16, y: Math.PI * 0.12, z: -0.22 }, returnPhase + 0.16);
      timeline.set(group.scale, { x: 0.22, y: 0.22, z: 0.22 }, returnPhase + 0.16);
      timeline.set(idleGroup.rotation, { y: 0 }, returnPhase);
      timeline.set(group, { visible: true }, returnPhase + 0.16);
      timeline.set(pluckMelon, { visible: false }, returnPhase + 0.18);
      timeline.set(plantGroup, { visible: false }, returnPhase + 0.28);

      timeline.to(group.position, {
        x: 0,
        y: 0,
        z: 0,
        duration: 0.36,
        ease: "power4.out",
      }, returnPhase + 0.16);
      timeline.to(group.rotation, {
        x: 0,
        y: Math.PI * 1.2,
        z: 0,
        duration: 0.36,
        ease: "power3.out",
      }, returnPhase + 0.16);
      timeline.to(group.scale, {
        x: 1,
        y: 1,
        z: 1,
        duration: 0.42,
        ease: finalPopEase,
      }, returnPhase + 0.14);
      timeline.to(idleGroup.rotation, {
        y: Math.PI * (reducedMotion ? 2 : 4),
        duration: 0.38,
        ease: "power2.out",
      }, returnPhase + 0.22);

      const sectionIntervals = Math.max(trigger.children.length - 1, 1);
      introSectionDurationRef.current = timeline.duration() / sectionIntervals;

      const renderIntroSection = (sceneTime: number) => {
        const time = clamp(sceneTime, 0, Math.max(introSectionDurationRef.current, 0.001));
        const rotationEase = smoothStep(time / 1.6);
        const positionEase = smoothStep(time / 1);
        const idleEase = clamp(time / 2, 0, 1);

        group.visible = true;
        group.position.set(0, -0.58 * positionEase, 0);
        group.rotation.set(
          Math.PI / 2 * rotationEase,
          Math.PI * 1.1 * rotationEase,
          Math.PI * 0.32 * rotationEase,
        );
        group.scale.set(1, 1, 1);
        idleGroup.rotation.set(0, Math.PI * 0.88 * idleEase, 0);

        topHalf.position.set(0, 0, 0);
        topHalf.rotation.set(0, 0, 0);
        topHalf.scale.set(1, 1, 1);
        bottomHalf.position.set(0, 0, 0);
        bottomHalf.rotation.set(0, 0, 0);
        bottomHalf.scale.set(1, 1, 1);

        katana.position.set(15, 6.9, 0);
        katana.rotation.set(0, 0, Math.PI / 5.4);
        katana.visible = true;

        splashGroup.position.set(0, group.position.y, 0);
        splashGroup.visible = false;
        fallingSeedsGroup.visible = false;
        if (!originalSeedsResetRef.current) {
          resetOriginalSeeds();
        }
        sand.visible = false;
        plantGroup.visible = false;
        smallMelon.visible = false;
        pluckMelon.visible = false;
      };

      const applySceneTime = (sceneTime: number) => {
        sceneTimeRef.current = sceneTime;
        scenePhaseRef.current = sceneTime;

        if (
          introSectionDurationRef.current > 0 &&
          sceneTime <= introSectionDurationRef.current
        ) {
          renderIntroSection(sceneTime);
          return;
        }

        timeline.totalTime(sceneTime, false);
      };

      const syncTargetTime = (force = false) => {
        const progress = getScrollProgress(scroller, trigger);
        const targetTime = getTargetSceneTime(timeline.duration(), progress);

        if (!force && Math.abs(targetTime - sceneTimeRef.current) < 0.0005) {
          return;
        }

        applySceneTime(targetTime);
      };

      const handleScroll = () => {
        if (scrollFrameId !== null) {
          return;
        }

        scrollFrameId = window.requestAnimationFrame(() => {
          scrollFrameId = null;
          syncTargetTime();
        });
      };

      sceneTimeRef.current = 0;
      timeline.totalTime(0, false);
      scenePhaseRef.current = 0;
      syncTargetTime(true);
      document.documentElement.dataset.melonSceneReady = "true";
      window.dispatchEvent(new Event(SCENE_READY_EVENT));
      scroller.addEventListener("scroll", handleScroll, { passive: true });
      window.addEventListener("resize", handleScroll, { passive: true });
      cleanupScroll = () => {
        scroller.removeEventListener("scroll", handleScroll);
        window.removeEventListener("resize", handleScroll);
      };
    }, 0);

    return () => {
      window.clearTimeout(setupId);
      cleanupScroll?.();
      if (scrollFrameId !== null) {
        window.cancelAnimationFrame(scrollFrameId);
        scrollFrameId = null;
      }
      sceneTimeRef.current = 0;
      introSectionDurationRef.current = 0;
      masterTl?.kill();
    };
  }, [
    dropletsData,
    fruitScale,
    landingSeedIndex,
    reducedMotion,
    resetOriginalSeeds,
    seedFallData,
    updateSeedInstance,
  ]);

  return (
    <>
      <group ref={ambientRigRef}>
        <group ref={katanaRef} scale={scale * 1.2}>
          <mesh position={[-3, 0, 0]}>
            <boxGeometry args={[10, 0.05, 0.2]} />
            <meshStandardMaterial map={bladeTexture} metalness={1} roughness={0.1} />
          </mesh>

          <mesh position={[-3, 0.03, 0]}>
            <boxGeometry args={[10, 0.02, 0.05]} />
            <meshStandardMaterial color="#ffffff" emissive="#00ffcc" emissiveIntensity={3} toneMapped={false} />
          </mesh>

          <mesh position={[2, 0, 0]} rotation={[0, 0, Math.PI / 2]}>
            <cylinderGeometry args={[0.35, 0.35, 0.1, 16]} />
            <meshStandardMaterial color="#ffd700" metalness={0.9} roughness={0.2} />
          </mesh>

          <mesh position={[3, 0, 0]} rotation={[0, 0, Math.PI / 2]}>
            <cylinderGeometry args={[0.15, 0.15, 2, 16]} />
            <meshStandardMaterial map={handleTexture} roughness={0.7} />
          </mesh>

          <mesh position={[4.05, 0, 0]} rotation={[0, 0, Math.PI / 2]}>
            <cylinderGeometry args={[0.16, 0.16, 0.2, 16]} />
            <meshStandardMaterial color="#ffd700" metalness={0.9} roughness={0.2} />
          </mesh>
        </group>

        <group ref={groupRef} scale={scale}>
          <group ref={idleGroupRef}>
            <group ref={topHalfRef} position-y={-0.01}>
              <mesh>
                <sphereGeometry args={[2, segments, segments / 2, 0, Math.PI * 2, 0, Math.PI / 2]} />
                <meshStandardMaterial map={texture} roughness={0.7} metalness={0.1} />
              </mesh>
              <mesh rotation-x={Math.PI / 2} position-y={0.005}>
                <circleGeometry args={[2, segments]} />
                <meshStandardMaterial map={innerTexture} bumpMap={innerTexture} bumpScale={0.05} roughness={0.5} />
              </mesh>
            </group>

            <group ref={bottomHalfRef} position-y={0.01}>
              <mesh>
                <sphereGeometry args={[2, segments, segments / 2, 0, Math.PI * 2, Math.PI / 2, Math.PI / 2]} />
                <meshStandardMaterial map={texture} roughness={0.7} metalness={0.1} />
              </mesh>
              <mesh rotation-x={-Math.PI / 2} position-y={-0.005}>
                <circleGeometry args={[2, segments]} />
                <meshStandardMaterial map={innerTexture} bumpMap={innerTexture} bumpScale={0.1} roughness={0.7} />
                <instancedMesh
                  ref={originalSeedsRef}
                  args={[seedGeometry, originalSeedMaterial, seeds3D.length]}
                />
              </mesh>
            </group>
          </group>
        </group>

        <group ref={splashGroupRef} scale={scale}>
          {dropletsData.map((drop, index) => (
            <mesh
              key={`drop-${index}`}
              ref={(element) => { if (element) { dropletsRefs.current[index] = element; } }}
              position={drop.position}
              rotation={[0, 0, drop.angle]}
              scale={0}
              geometry={drop.isStreak ? streakGeometry : dropletGeometry}
              material={splashMaterial}
            />
          ))}
        </group>
      </group>

      <group ref={sandRef} position={[0, -4.7, 0]} scale={0}>
        <mesh scale={[4.2, 0.82, 4.2]}>
          <sphereGeometry args={[2, 28, 16, 0, Math.PI * 2, 0, Math.PI / 2]} />
          <meshStandardMaterial color="#d4b473" roughness={1} metalness={0.08} />
        </mesh>
        <mesh position={[1.22, 1.66, 0.84]} scale={0.1} geometry={pebbleGeometry}>
          <meshStandardMaterial color="#8a7660" roughness={0.8} emissive="#4a3a28" emissiveIntensity={0.3} />
        </mesh>
        <mesh position={[-1.4, 1.62, 0.5]} scale={0.08} geometry={pebbleGeometry}>
          <meshStandardMaterial color="#6e5f4a" roughness={0.9} emissive="#3a2818" emissiveIntensity={0.3} />
        </mesh>
        <mesh position={[0.34, 1.68, -1.02]} scale={0.12} geometry={pebbleGeometry}>
          <meshStandardMaterial color="#9b8a70" roughness={0.85} emissive="#4a3a20" emissiveIntensity={0.28} />
        </mesh>
        <mesh position={[-0.84, 1.64, 1.24]} scale={0.09} geometry={pebbleGeometry}>
          <meshStandardMaterial color="#7a6a55" roughness={0.9} emissive="#3a2818" emissiveIntensity={0.28} />
        </mesh>
      </group>

      <group ref={fallingSeedsGroupRef} visible={false}>
        {seeds3D.map((seed, index) => (
          <mesh
            key={`falling-seed-${index}`}
            ref={(element) => { if (element) { fallingSeedsRefs.current[index] = element; } }}
            position={seedFallData[index].start}
            scale={0}
            geometry={seedGeometry}
            material={fallingSeedMaterial}
          />
        ))}
      </group>

      <group ref={plantGroupRef} position={[0, -1.55, 0.22]}>
        <mesh ref={sproutRef} position={[0.04, 0.09, 0]} rotation={[0, 0, 1.1]} scale={[1, 0, 1]}>
          <cylinderGeometry args={[0.013, 0.02, 0.22, 7]} />
          <meshStandardMaterial color="#c8e89c" roughness={0.72} emissive="#253d0f" emissiveIntensity={0.28} />
        </mesh>

        <mesh ref={cotyledon1Ref} position={[0.12, 0.21, 0.02]} rotation={[0.08, 0, -0.28]} scale={0}>
          <shapeGeometry args={[cotyledonShape]} />
          <meshStandardMaterial color="#b8e072" roughness={0.68} side={2} emissive="#29440a" emissiveIntensity={0.22} />
        </mesh>
        <mesh ref={cotyledon2Ref} position={[-0.12, 0.2, -0.01]} rotation={[-0.08, 0, 0.28]} scale={0}>
          <shapeGeometry args={[cotyledonShape]} />
          <meshStandardMaterial color="#afd96a" roughness={0.68} side={2} emissive="#29440a" emissiveIntensity={0.22} />
        </mesh>

        <mesh ref={plantStemRef} scale={[1, 0, 1]}>
          <tubeGeometry args={[stemCurve, 42, 0.024, 8, false]} />
          <meshStandardMaterial map={stemTexture} roughness={0.88} emissive="#102106" emissiveIntensity={0.24} />
        </mesh>
        <mesh ref={sideVineRef} scale={0}>
          <tubeGeometry args={[sideVineCurve, 28, 0.014, 6, false]} />
          <meshStandardMaterial map={stemTexture} roughness={0.88} emissive="#102106" emissiveIntensity={0.24} />
        </mesh>
        <mesh ref={fruitStemRef} scale={0}>
          <tubeGeometry args={[fruitStemCurve, 28, 0.018, 6, false]} />
          <meshStandardMaterial map={stemTexture} roughness={0.84} emissive="#102106" emissiveIntensity={0.24} />
        </mesh>
        <group ref={fruitCalyxRef} position={[0.68, 1.58, 0.03]} scale={0}>
          {Array.from({ length: 5 }).map((_, index) => (
            <mesh
              key={`calyx-${index}`}
              rotation={[0.2, 0, (index / 5) * Math.PI * 2]}
            >
              <shapeGeometry args={[calyxShape]} />
              <meshStandardMaterial color="#4f8a20" roughness={0.78} side={2} emissive="#132307" emissiveIntensity={0.18} />
            </mesh>
          ))}
        </group>
        <mesh ref={tendrilLeftRef} scale={0}>
          <tubeGeometry args={[tendrilLeftCurve, 22, 0.008, 5, false]} />
          <meshStandardMaterial color="#5f9f28" roughness={0.74} emissive="#142207" emissiveIntensity={0.16} />
        </mesh>
        <mesh ref={tendrilRightRef} scale={0}>
          <tubeGeometry args={[tendrilRightCurve, 22, 0.008, 5, false]} />
          <meshStandardMaterial color="#5f9f28" roughness={0.74} emissive="#142207" emissiveIntensity={0.16} />
        </mesh>

        <mesh ref={plantLeaf1Ref} position={[0.36, 0.64, 0.08]} rotation={[0.4, 0.3, -0.72]} scale={0}>
          <shapeGeometry args={[leafShape]} />
          <meshStandardMaterial map={leafTexture} roughness={0.62} side={2} emissive="#091a04" emissiveIntensity={0.24} />
        </mesh>
        <mesh ref={plantLeaf2Ref} position={[-0.46, 0.98, -0.12]} rotation={[-0.32, -0.28, 0.76]} scale={0}>
          <shapeGeometry args={[leafShape]} />
          <meshStandardMaterial map={leafTexture} roughness={0.62} side={2} emissive="#091a04" emissiveIntensity={0.24} />
        </mesh>
        <mesh ref={plantLeaf3Ref} position={[0.06, 1.54, 0.18]} rotation={[0.26, 0.14, -0.08]} scale={0}>
          <shapeGeometry args={[leafShape]} />
          <meshStandardMaterial map={leafTexture} roughness={0.62} side={2} emissive="#091a04" emissiveIntensity={0.24} />
        </mesh>
        <mesh ref={plantLeaf4Ref} position={[0.56, 1.7, 0]} rotation={[0.34, 0.38, -0.7]} scale={0}>
          <shapeGeometry args={[leafShape]} />
          <meshStandardMaterial map={leafTexture} roughness={0.62} side={2} emissive="#091a04" emissiveIntensity={0.24} />
        </mesh>

        <mesh ref={smallMelonRef} position={[0.68, 1.72, 0.04]} scale={0}>
          <sphereGeometry args={[0.28, 20, 16]} />
          <meshStandardMaterial map={smallMelonRind} roughness={0.46} emissive="#182808" emissiveIntensity={0.22} />
        </mesh>
      </group>

      <mesh ref={pluckMelonRef} position={[0.68, 0.19, 0.26]} scale={0}>
        <sphereGeometry args={[0.34, 22, 18]} />
        <meshStandardMaterial map={smallMelonRind} roughness={0.44} emissive="#182808" emissiveIntensity={0.22} />
      </mesh>
    </>
  );
}
