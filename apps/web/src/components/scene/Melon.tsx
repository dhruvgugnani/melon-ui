"use client";

import { useEffect, useMemo, useRef } from "react";
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
  const originalSeedMeshesRef = useRef<(THREE.Mesh | null)[]>([]);
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
  const weedsRefs = useRef<(THREE.Mesh | null)[]>([]);
  const sunOrbitRef = useRef<THREE.Group>(null);
  const sunLightRef = useRef<THREE.DirectionalLight>(null);
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

  const windStreakGeometry = useMemo(() => new THREE.BoxGeometry(1, 0.045, 0.045), []);
  const impactRingGeometry = useMemo(() => new THREE.TorusGeometry(0.92, 0.018, 8, 96), []);
  const dustPuffGeometry = useMemo(() => new THREE.IcosahedronGeometry(0.16, 1), []);

  const smallMelonRind = useMemo(() => {
    const canvas = document.createElement("canvas");
    canvas.width = 256;
    canvas.height = 256;
    const ctx = canvas.getContext("2d");
    if (ctx) {
      // Base realistic green
      ctx.fillStyle = "#3c6115";
      ctx.fillRect(0, 0, 256, 256);
      
      // Noise for organic texture
      for (let i = 0; i < 4000; i++) {
        ctx.fillStyle = pseudoRandom(i) > 0.5 ? "rgba(45, 75, 20, 0.3)" : "rgba(20, 35, 10, 0.3)";
        ctx.fillRect(pseudoRandom(i + 1) * 256, pseudoRandom(i + 2) * 256, 2, 2);
      }

      // Watermelon stripes
      for (let i = 0; i < 10; i += 1) {
        ctx.save();
        ctx.translate(128, 128);
        ctx.rotate((i / 10) * Math.PI * 2);
        
        ctx.beginPath();
        ctx.moveTo(-4, -128);
        for(let y = -128; y <= 128; y += 10) {
          const wiggle = Math.sin(y * 0.1) * 3 + (pseudoRandom(y + i * 100) * 4 - 2);
          ctx.lineTo(-4 + wiggle, y);
        }
        for(let y = 128; y >= -128; y -= 10) {
          const wiggle = Math.sin(y * 0.1) * 3 + (pseudoRandom(y + i * 100) * 4 - 2);
          ctx.lineTo(4 + wiggle, y);
        }
        ctx.closePath();
        
        ctx.fillStyle = "rgba(18, 38, 8, 0.6)"; // Dark green stripe
        ctx.fill();
        ctx.restore();
      }
    }
    const tex = new THREE.CanvasTexture(canvas);
    tex.wrapS = THREE.RepeatWrapping;
    tex.wrapT = THREE.RepeatWrapping;
    return tex;
  }, []);

  const grassGeometry = useMemo(() => {
    const geom = new THREE.ConeGeometry(0.04, 0.4, 4);
    geom.translate(0, 0.2, 0);
    const pos = geom.attributes.position;
    for (let i = 0; i < pos.count; i++) {
      const y = pos.getY(i);
      const z = pos.getZ(i);
      pos.setZ(i, z + (y * y) * 0.3);
    }
    geom.computeVertexNormals();
    return geom;
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
  // Removed instanced matrix updates to improve performance on Brave

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
      clamp((fruitPhase - 0.06 - phase) / 0.32, 0, 1);
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
    const finalPopEase = reducedMotion ? "power2.out" : "elastic.out(0.9, 0.55)";
    let masterTl: gsap.core.Timeline | null = null;
    let scrollFrameId: number | null = null;
    let cleanupScroll: (() => void) | null = null;
    let setupId: number;

    const setupScrollBinding = () => {
      const scroller = document.getElementById("snap-container");
      const trigger = document.getElementById("scroll-content");
      if (!scroller || !trigger) {
        setupId = window.setTimeout(setupScrollBinding, 50);
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

      plantGroup.position.set(0, -0.86, 0.18);
      plantGroup.rotation.set(0, 0, 0);
      plantGroup.scale.set(1, 1, 1);
      plantGroup.visible = false;

      sprout.position.set(0, -0.56, 0.1);
      sprout.scale.set(0, 0, 0);
      sprout.rotation.set(0, 0, 0);

      cotyledon1.scale.set(0, 0, 0);
      cotyledon1.position.set(-0.92, 2.04, 0.1);
      cotyledon1.rotation.set(0, 0, -0.18);
      cotyledon2.scale.set(0, 0, 0);
      cotyledon2.position.set(-0.72, 1.66, 0.08);
      cotyledon2.rotation.set(0, 0, -0.06);

      plantStem.position.set(0, -0.54, 0.12);
      plantStem.scale.set(0, 0, 0);
      plantStem.rotation.set(Math.PI / 2, 0, 0);
      sideVine.scale.set(0, 0, 0);
      sideVine.position.set(-0.86, 1.32, 0.2);
      sideVine.rotation.set(0, 0, 0.08);
      fruitStem.scale.set(0, 0, 0);
      fruitStem.position.set(-1.12, 2.34, 0.12);
      fruitStem.rotation.set(0, 0, -0.32);
      fruitCalyx.position.set(0, -0.42, 0.28);
      fruitCalyx.scale.set(0, 0, 0);
      tendrilLeft.scale.set(0, 0, 0);
      tendrilLeft.position.set(-0.62, 1.66, 0.14);
      tendrilRight.scale.set(0, 0, 0);
      tendrilRight.position.set(0.22, 1.82, 0.14);

      plantLeaf1.scale.set(0, 0, 0);
      plantLeaf1.position.set(-0.72, -0.5, 0.4);
      plantLeaf2.scale.set(0, 0, 0);
      plantLeaf2.position.set(0.72, -0.54, 0.36);
      plantLeaf3.scale.set(0, 0, 0);
      plantLeaf3.position.set(-1.24, -0.64, 0.18);
      plantLeaf4.scale.set(0, 0, 0);
      plantLeaf4.position.set(1.22, -0.66, 0.2);
      smallMelon.scale.set(0, 0, 0);
      smallMelon.rotation.set(0, 0, 0);
      smallMelon.position.set(-0.12, 5.85, 0.16);
      smallMelon.visible = false;

      pluckMelon.position.set(0.68, 0.19, 0.26);
      pluckMelon.scale.set(0, 0, 0);
      pluckMelon.rotation.set(0, 0, 0);
      pluckMelon.visible = false;

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

      if (sunOrbitRef.current && sunLightRef.current) {
        timeline.set(sunLightRef.current, { intensity: 0 }, 0);
        timeline.set(sunLightRef.current, { intensity: 2.5 }, plantPhase - 0.1);
        timeline.to(sunLightRef.current, { intensity: 0, duration: 0.5 }, fruitPhase);
        timeline.to(sunOrbitRef.current.rotation, {
          y: Math.PI * 3, // Slower orbit (1.5 full orbits instead of 6)
          duration: fruitPhase - plantPhase + 0.5,
          ease: "power2.inOut"
        }, plantPhase - 0.1);
      }

      timeline.set(katana.position, { x: 15, y: 6.9, z: 0 }, 0);
      timeline.set(katana.rotation, { x: 0, y: 0, z: Math.PI / 5.4 }, 0);

      seeds3D.forEach((_, index) => {
        const seedMesh = originalSeedMeshesRef.current[index];
        if (seedMesh) {
          timeline.set(seedMesh.scale, { x: 1, y: 1.8, z: 0.4 }, 0);
          timeline.set(seedMesh, { visible: true }, 0);
        }
      });

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
        const seedMesh = originalSeedMeshesRef.current[index];

        if (seedMesh) {
          timeline.to(seedMesh.scale, {
            x: 0,
            y: 0,
            z: 0,
            duration: 0.05,
            ease: "power1.out",
          }, fall.releaseAt);
          timeline.set(seedMesh, { visible: false }, fall.releaseAt + 0.05);
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
        const floatAt = plantPhase - 0.2 + randomBetween(index + 41001, -0.08, 0.04);
        const floatDuration = Math.max(0.18, floatAt - (fall.releaseAt + fall.slipDuration));
        const floatX = fall.land[0] * 0.72 + randomBetween(index + 42001, -0.2, 0.2);
        const floatY = 0.34 + randomBetween(index + 43001, -0.12, 0.36);
        const floatZ = fall.land[2] * 0.58 + randomBetween(index + 44001, -0.18, 0.18);
        const windAt = plantPhase + randomBetween(index + 45001, 0.02, 0.22);
        timeline.to(fallingMesh.position, {
          x: floatX,
          y: floatY,
          z: floatZ,
          duration: floatDuration,
          ease: "sine.out",
        }, fall.releaseAt + fall.slipDuration);
        timeline.to(fallingMesh.rotation, {
          x: fall.endRotation[0],
          y: fall.endRotation[1],
          z: fall.endRotation[2],
          duration: floatDuration + 0.12,
          ease: "none",
        }, fall.releaseAt);
        timeline.to(fallingMesh.scale, {
          x: fall.restScale[0] * 0.9,
          y: fall.restScale[1] * 0.9,
          z: fall.restScale[2] * 0.9,
          duration: 0.18,
          ease: "sine.inOut",
        }, fall.releaseAt + fall.slipDuration + 0.08);
        timeline.to(fallingMesh.position, {
          x: 6.6 + randomBetween(index + 46001, 0, 1.6),
          y: floatY + randomBetween(index + 47001, -0.8, 1.25),
          z: floatZ + randomBetween(index + 48001, -0.7, 0.5),
          duration: 0.5 + randomBetween(index + 49001, 0, 0.18),
          ease: "power4.in",
        }, windAt);
        timeline.to(fallingMesh.rotation, {
          x: fall.endRotation[0] + Math.PI * 2.4,
          y: fall.endRotation[1] + Math.PI * 1.7,
          z: fall.endRotation[2] + Math.PI * 2.1,
          duration: 0.52,
          ease: "power3.in",
        }, windAt);
        timeline.to(fallingMesh.scale, {
          x: 0,
          y: 0,
          z: 0,
          duration: 0.16,
          ease: "power2.in",
        }, windAt + 0.38);
      });

      const firstSeedReleaseAt = Math.min(...seedFallData.map((fall) => fall.releaseAt));
      const finalSeedFadeAt = Math.max(
        ...seedFallData.map((_, index) => plantPhase + 0.58 + index * 0.006),
        plantPhase + 0.68,
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

      timeline.set(plantGroup, { visible: true }, plantPhase - 0.16);

      [cotyledon1, cotyledon2, sideVine, fruitStem].forEach((gust, index) => {
        const startAt = plantPhase - 0.08 + index * 0.045;
        timeline.to(gust.scale, {
          x: 0.18 + index * 0.04,
          y: 1,
          z: 1,
          duration: 0.14,
          ease: "power4.out",
        }, startAt);
        timeline.to(gust.position, {
          x: 0.58 + index * 0.18,
          duration: 0.46,
          ease: "power3.inOut",
        }, startAt);
        timeline.to(gust.scale, {
          x: 0,
          y: 0,
          z: 0,
          duration: 0.16,
          ease: "power2.in",
        }, startAt + 0.34);
      });

      timeline.to(tendrilLeft.scale, {
        x: 0.2,
        y: 1,
        z: 1,
        duration: 0.14,
        ease: "power3.out",
      }, plantPhase + 0.08);
      timeline.to(tendrilRight.scale, {
        x: 0.2,
        y: 1,
        z: 1,
        duration: 0.14,
        ease: "power3.out",
      }, plantPhase + 0.12);
      timeline.to([tendrilLeft.position, tendrilRight.position], {
        x: "+=0.82",
        duration: 0.42,
        ease: "power3.inOut",
      }, plantPhase + 0.12);
      timeline.to([tendrilLeft.scale, tendrilRight.scale], {
        x: 0,
        y: 0,
        z: 0,
        duration: 0.16,
        ease: "power2.in",
      }, plantPhase + 0.46);

      timeline.set(smallMelon, { visible: true }, fruitPhase - 0.62);
      timeline.set(smallMelon.position, { x: -0.12, y: 5.85, z: 0.16 }, fruitPhase - 0.62);
      timeline.set(smallMelon.scale, { x: 0.82, y: 0.82, z: 0.82 }, fruitPhase - 0.62);
      timeline.to(smallMelon.position, {
        x: 0.05,
        y: -0.1,
        z: 0.12,
        duration: 0.38,
        ease: "power4.in",
      }, fruitPhase - 0.52);
      timeline.to(smallMelon.rotation, {
        x: Math.PI * 1.1,
        y: Math.PI * 0.42,
        z: -Math.PI * 0.18,
        duration: 0.38,
        ease: "power2.in",
      }, fruitPhase - 0.52);
      timeline.to(smallMelon.scale, {
        x: 1.06,
        y: 0.62,
        z: 1.06,
        duration: 0.08,
        ease: "power2.out",
      }, fruitPhase - 0.14);
      timeline.to(smallMelon.scale, {
        x: 0.88,
        y: 1.02,
        z: 0.88,
        duration: 0.16,
        ease: reducedMotion ? "power2.out" : "back.out(2.2)",
      }, fruitPhase - 0.06);
      timeline.to(smallMelon.position, {
        y: 0.2,
        duration: 0.16,
        ease: "power2.out",
      }, fruitPhase - 0.06);
      timeline.to(smallMelon.position, {
        y: 0.08,
        duration: 0.18,
        ease: "bounce.out",
      }, fruitPhase + 0.08);
      timeline.to(smallMelon.scale, {
        x: 0.92 * fruitScale,
        y: 0.92 * fruitScale,
        z: 0.92 * fruitScale,
        duration: 0.24,
        ease: "power2.out",
      }, fruitPhase + 0.06);

      timeline.to(sprout.scale, {
        x: 1.28,
        y: 0.08,
        z: 0.78,
        duration: 0.18,
        ease: "power2.out",
      }, fruitPhase - 0.22);
      timeline.to(plantStem.scale, {
        x: 0.1,
        y: 0.1,
        z: 0.1,
        duration: 0.01,
      }, fruitPhase - 0.18);
      timeline.to(plantStem.scale, {
        x: 1.82,
        y: 1.82,
        z: 1.82,
        duration: 0.36,
        ease: "power3.out",
      }, fruitPhase - 0.14);
      timeline.to(plantStem.scale, {
        x: 0,
        y: 0,
        z: 0,
        duration: 0.18,
        ease: "power2.in",
      }, fruitPhase + 0.04);

      [plantLeaf1, plantLeaf2, plantLeaf3, plantLeaf4].forEach((puff, index) => {
        timeline.to(puff.scale, {
          x: 1 + index * 0.12,
          y: 0.74,
          z: 1 + index * 0.08,
          duration: 0.14,
          ease: "back.out(1.6)",
        }, fruitPhase - 0.14 + index * 0.03);
        timeline.to(puff.position, {
          x: `${index % 2 === 0 ? "-" : "+"}=0.42`,
          y: `+=${0.12 + index * 0.02}`,
          duration: 0.28,
          ease: "power2.out",
        }, fruitPhase - 0.1 + index * 0.03);
        timeline.to(puff.scale, {
          x: 0,
          y: 0,
          z: 0,
          duration: 0.18,
          ease: "power2.in",
        }, fruitPhase + 0.04 + index * 0.02);
      });

      timeline.to(fruitCalyx.scale, {
        x: 1,
        y: 1,
        z: 1,
        duration: 0.16,
        ease: "back.out(1.4)",
      }, fruitPhase - 0.1);
      timeline.to(fruitCalyx.position, {
        y: -0.08,
        duration: 0.26,
        ease: "power2.out",
      }, fruitPhase - 0.08);
      timeline.to(fruitCalyx.scale, {
        x: 0,
        y: 0,
        z: 0,
        duration: 0.16,
        ease: "power2.in",
      }, fruitPhase + 0.08);

      timeline.set(pluckMelon, { visible: true }, returnPhase);
      timeline.set(pluckMelon.position, { x: 0.68, y: 0.19, z: 0.26 }, returnPhase);
      timeline.set(pluckMelon.scale, { x: 0.62, y: 0.62, z: 0.62 }, returnPhase);
      timeline.to(smallMelon.scale, {
        x: 0.94 * fruitScale,
        y: 0.94 * fruitScale,
        z: 0.94 * fruitScale,
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
        x: 0.72,
        y: 0.72,
        z: 0.72,
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

      seeds3D.forEach((_, index) => {
        const seedMesh = originalSeedMeshesRef.current[index];
        if (seedMesh) {
          timeline.set(seedMesh.scale, { x: 1, y: 1.8, z: 0.4 }, returnPhase + 0.16);
          timeline.set(seedMesh, { visible: true }, returnPhase + 0.16);
        }
      });

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

      const applySceneTime = (sceneTime: number) => {
        sceneTimeRef.current = sceneTime;
        scenePhaseRef.current = sceneTime;
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
    };

    setupId = window.setTimeout(setupScrollBinding, 0);

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
    seedFallData,
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
                {seeds3D.map((seed, index) => (
                  <mesh
                    key={`original-seed-${index}`}
                    ref={(element) => {
                      originalSeedMeshesRef.current[index] = element;
                    }}
                    position={seed.position}
                    rotation={seed.rotation}
                    scale={[1, 1.8, 0.4]}
                    geometry={seedGeometry}
                    material={originalSeedMaterial}
                  />
                ))}
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

      <group ref={sunOrbitRef}>
        <directionalLight
          ref={sunLightRef}
          position={[10, 8, 4]}
          intensity={0}
          castShadow
          color="#ffd6a5"
          shadow-mapSize-width={quality.shadowMapSize}
          shadow-mapSize-height={quality.shadowMapSize}
        />
      </group>

      <group ref={sandRef} position={[0, -4.7, 0]} scale={0}>
        <mesh scale={[4.2, 0.82, 4.2]} receiveShadow>
          <sphereGeometry args={[2, 28, 16, 0, Math.PI * 2, 0, Math.PI / 2]} />
          <meshStandardMaterial color="#111111" roughness={0.86} metalness={0.34} emissive="#21070b" emissiveIntensity={0.12} />
        </mesh>

        {Array.from({ length: 0 }).map((_, i) => (
          <mesh 
            key={`weed-${i}`}
            ref={(el) => { weedsRefs.current[i] = el; }}
            position={[
              (pseudoRandom(i + 100) * 3) - 1.5,
              1.21, // Position on sand surface
              (pseudoRandom(i + 200) * 3) - 1.5,
            ]}
            rotation={[
              (pseudoRandom(i + 300) - 0.5) * 0.4,
              pseudoRandom(i + 400) * Math.PI * 2,
              (pseudoRandom(i + 500) - 0.5) * 0.4
            ]}
            scale={0}
            geometry={grassGeometry}
            castShadow
            receiveShadow
          >
            <meshStandardMaterial color={pseudoRandom(i) > 0.5 ? "#4f8221" : "#5d9628"} roughness={0.8} />
          </mesh>
        ))}
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

      <group ref={plantGroupRef} position={[0, -0.86, 0.18]}>
        <mesh ref={sproutRef} position={[0, -0.56, 0.1]} rotation={[-Math.PI / 2, 0, 0]} scale={0} receiveShadow>
          <circleGeometry args={[1, 48]} />
          <meshStandardMaterial color="#050505" roughness={0.9} transparent opacity={0.52} />
        </mesh>

        <mesh ref={cotyledon1Ref} position={[-0.92, 2.04, 0.1]} rotation={[0, 0, -0.18]} scale={0}>
          <primitive object={windStreakGeometry} attach="geometry" />
          <meshStandardMaterial color="#ffffff" roughness={0.42} emissive="#ffffff" emissiveIntensity={0.12} transparent opacity={0.32} toneMapped={false} />
        </mesh>
        <mesh ref={cotyledon2Ref} position={[-0.72, 1.66, 0.08]} rotation={[0, 0, -0.06]} scale={0}>
          <primitive object={windStreakGeometry} attach="geometry" />
          <meshStandardMaterial color="#ffffff" roughness={0.42} emissive="#ffffff" emissiveIntensity={0.12} transparent opacity={0.3} toneMapped={false} />
        </mesh>
        <mesh ref={sideVineRef} position={[-0.86, 1.32, 0.2]} rotation={[0, 0, 0.08]} scale={0}>
          <primitive object={windStreakGeometry} attach="geometry" />
          <meshStandardMaterial color="#ffffff" roughness={0.42} emissive="#ffffff" emissiveIntensity={0.12} transparent opacity={0.28} toneMapped={false} />
        </mesh>
        <mesh ref={fruitStemRef} position={[-1.12, 2.34, 0.12]} rotation={[0, 0, -0.32]} scale={0}>
          <primitive object={windStreakGeometry} attach="geometry" />
          <meshStandardMaterial color="#ffffff" roughness={0.42} emissive="#ffffff" emissiveIntensity={0.12} transparent opacity={0.3} toneMapped={false} />
        </mesh>

        <mesh ref={tendrilLeftRef} position={[-0.62, 1.66, 0.14]} rotation={[0, 0, 0.12]} scale={0}>
          <primitive object={windStreakGeometry} attach="geometry" />
          <meshStandardMaterial color="#ffffff" roughness={0.4} emissive="#ffffff" emissiveIntensity={0.12} transparent opacity={0.26} toneMapped={false} />
        </mesh>
        <mesh ref={tendrilRightRef} position={[0.22, 1.82, 0.14]} rotation={[0, 0, -0.08]} scale={0}>
          <primitive object={windStreakGeometry} attach="geometry" />
          <meshStandardMaterial color="#ffffff" roughness={0.4} emissive="#ffffff" emissiveIntensity={0.12} transparent opacity={0.24} toneMapped={false} />
        </mesh>

        <mesh ref={plantStemRef} position={[0, -0.54, 0.12]} rotation={[Math.PI / 2, 0, 0]} scale={0}>
          <primitive object={impactRingGeometry} attach="geometry" />
          <meshStandardMaterial color="#ff5c71" roughness={0.3} metalness={0.18} emissive="#ff5c71" emissiveIntensity={0.5} toneMapped={false} />
        </mesh>

        <group ref={fruitCalyxRef} position={[0, -0.42, 0.28]} scale={0}>
          {Array.from({ length: 6 }).map((_, index) => (
            <mesh
              key={`impact-pop-${index}`}
              position={[
                Math.cos((index / 6) * Math.PI * 2) * 0.42,
                Math.sin((index / 6) * Math.PI * 2) * 0.22,
                0,
              ]}
              rotation={[0.12, 0, (index / 6) * Math.PI * 2]}
            >
              <boxGeometry args={[0.24, 0.06, 0.05]} />
              <meshStandardMaterial color={index % 2 === 0 ? "#ff5c71" : "#7fff5e"} emissive={index % 2 === 0 ? "#ff5c71" : "#7fff5e"} emissiveIntensity={0.4} toneMapped={false} />
            </mesh>
          ))}
        </group>

        <mesh ref={plantLeaf1Ref} position={[-0.72, -0.5, 0.4]} scale={0} castShadow>
          <primitive object={dustPuffGeometry} attach="geometry" />
          <meshStandardMaterial color="#ff8d9a" roughness={0.7} emissive="#ff5c71" emissiveIntensity={0.12} />
        </mesh>
        <mesh ref={plantLeaf2Ref} position={[0.72, -0.54, 0.36]} scale={0} castShadow>
          <primitive object={dustPuffGeometry} attach="geometry" />
          <meshStandardMaterial color="#e0f2dc" roughness={0.72} emissive="#7fff5e" emissiveIntensity={0.1} />
        </mesh>
        <mesh ref={plantLeaf3Ref} position={[-1.24, -0.64, 0.18]} scale={0} castShadow>
          <primitive object={dustPuffGeometry} attach="geometry" />
          <meshStandardMaterial color="#ff5c71" roughness={0.74} emissive="#ff5c71" emissiveIntensity={0.12} />
        </mesh>
        <mesh ref={plantLeaf4Ref} position={[1.22, -0.66, 0.2]} scale={0} castShadow>
          <primitive object={dustPuffGeometry} attach="geometry" />
          <meshStandardMaterial color="#7fff5e" roughness={0.74} emissive="#7fff5e" emissiveIntensity={0.1} />
        </mesh>

        <mesh ref={smallMelonRef} position={[-0.12, 5.85, 0.16]} scale={0} castShadow>
          <sphereGeometry args={[0.82, segments, segments / 2]} />
          <meshStandardMaterial map={texture} roughness={0.62} metalness={0.1} />
        </mesh>
      </group>

      <mesh ref={pluckMelonRef} position={[0.68, 0.19, 0.26]} scale={0} castShadow>
        <sphereGeometry args={[0.34, 24, 20]} />
        <meshStandardMaterial map={smallMelonRind} bumpMap={smallMelonRind} bumpScale={0.02} roughness={0.7} emissive="#0d1405" emissiveIntensity={0.1} />
      </mesh>
    </>
  );
}
