"use client";

import { useMemo, useRef, useEffect } from "react";
import { useFrame } from "@react-three/fiber";
import * as THREE from "three";
import { OrbitControls } from "@react-three/drei";

const NUM_WEDGES = 6;
const WEDGE_ANGLE = (2 * Math.PI) / NUM_WEDGES;

// Pure, seedable LCG pseudo-random generator to satisfy react-hooks/purity
function createRandom(seed: number) {
  let s = seed;
  return function() {
    s = (s * 9301 + 49297) % 233280;
    return s / 233280;
  };
}

export function HomeMelon() {
  const sceneContainerRef = useRef<THREE.Group>(null);
  const wedgesRefs = useRef<(THREE.Group | null)[]>([]);

  // Procedural watermelon skin rind texture
  const rindTexture = useMemo(() => {
    const canvas = document.createElement("canvas");
    canvas.width = 1024;
    canvas.height = 512;
    const ctx = canvas.getContext("2d");
    if (ctx) {
      // Base green shell
      ctx.fillStyle = "#4a733c";
      ctx.fillRect(0, 0, 1024, 512);

      // Draw dark wavy stripes
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
          ctx.lineWidth = 18;
          ctx.lineCap = "round";
          ctx.lineJoin = "round";
          ctx.strokeStyle = "#1b3316";
          ctx.stroke();
        });
      }
    }
    const tex = new THREE.CanvasTexture(canvas);
    tex.wrapS = THREE.RepeatWrapping;
    tex.wrapT = THREE.ClampToEdgeWrapping;
    return tex;
  }, []);

  // Procedural skin bump map for tactile depth texture
  const bumpTexture = useMemo(() => {
    const canvas = document.createElement("canvas");
    canvas.width = 512;
    canvas.height = 512;
    const ctx = canvas.getContext("2d");
    const rng = createRandom(98765); // Pure seeded generator
    if (ctx) {
      // Base gray
      ctx.fillStyle = "#808080";
      ctx.fillRect(0, 0, 512, 512);

      // Add organic fine noise grain
      for (let i = 0; i < 12000; i++) {
        const x = rng() * 512;
        const y = rng() * 512;
        const size = 0.4 + rng() * 1.2;
        const val = Math.floor(100 + rng() * 45);
        ctx.fillStyle = `rgb(${val}, ${val}, ${val})`;
        ctx.beginPath();
        ctx.arc(x, y, size, 0, Math.PI * 2);
        ctx.fill();
      }
    }
    const tex = new THREE.CanvasTexture(canvas);
    tex.wrapS = THREE.RepeatWrapping;
    tex.wrapT = THREE.RepeatWrapping;
    return tex;
  }, []);

  // Procedural pulp texture with grain and scattered black seeds
  const pulpTexture = useMemo(() => {
    const canvas = document.createElement("canvas");
    canvas.width = 512;
    canvas.height = 512;
    const ctx = canvas.getContext("2d");
    const rng = createRandom(54321); // Pure seeded generator
    if (ctx) {
      // Base red pulp
      ctx.fillStyle = "#ff5c71";
      ctx.fillRect(0, 0, 512, 512);

      // Add organic texture flecks
      for (let i = 0; i < 4000; i++) {
        const x = rng() * 512;
        const y = rng() * 512;
        const radius = 0.5 + rng() * 2.5;
        ctx.fillStyle = "rgba(255, 140, 154, 0.22)";
        ctx.beginPath();
        ctx.arc(x, y, radius, 0, Math.PI * 2);
        ctx.fill();
      }

      // Draw scattered seeds
      ctx.fillStyle = "#1a0e0d";
      for (let i = 0; i < 12; i++) {
        const x = 100 + rng() * 312;
        const y = 100 + rng() * 312;
        ctx.save();
        ctx.translate(x, y);
        ctx.rotate(rng() * Math.PI * 2);
        ctx.beginPath();
        ctx.ellipse(0, 0, 9, 4.5, 0, 0, Math.PI * 2);
        ctx.fill();
        // Seed highlights
        ctx.fillStyle = "rgba(255, 255, 255, 0.15)";
        ctx.beginPath();
        ctx.ellipse(-2, -1, 3, 1.5, 0, 0, Math.PI * 2);
        ctx.fill();
        ctx.restore();
        ctx.fillStyle = "#1a0e0d";
      }
    }
    const tex = new THREE.CanvasTexture(canvas);
    return tex;
  }, []);

  // Helper 2D shape for vertical cut faces
  const semiCircleShape = useMemo(() => {
    const shape = new THREE.Shape();
    shape.moveTo(0, -1);
    shape.lineTo(0, 1);
    shape.absarc(0, 0, 1, Math.PI / 2, -Math.PI / 2, true);
    return shape;
  }, []);

  // Physics data for each wedge
  const physicsData = useRef(
    Array.from({ length: NUM_WEDGES }, (_, i) => ({
      index: i,
      sliced: false,
      regrowing: false,
      // Current offsets
      x: 0, y: 0, z: 0,
      rotX: 0, rotY: 0, rotZ: 0,
      // Velocity
      vx: 0, vy: 0, vz: 0,
      vRotX: 0, vRotY: 0, vRotZ: 0,
      // Default radial bisector angle
      bisector: i * WEDGE_ANGLE + WEDGE_ANGLE / 2,
    }))
  );

  // Subscribe to slicing/regrowing events
  useEffect(() => {
    const handleSlice = (e: Event) => {
      const customEvent = e as CustomEvent;
      const { angle } = customEvent.detail || { angle: 0 };

      // Find the first unsliced wedge
      const unsliced = physicsData.current.find((w) => !w.sliced && !w.regrowing);
      if (unsliced) {
        unsliced.sliced = true;
        
        // Blow the sliced wedge outward matching the slash angle, plus vertical pop
        const force = 6 + Math.random() * 3;
        const pushAngle = angle + (Math.random() * 0.4 - 0.2); // add minor spread

        unsliced.vx = Math.cos(pushAngle) * force;
        unsliced.vy = 4 + Math.random() * 4;
        unsliced.vz = Math.sin(pushAngle) * force;

        // Dynamic tumble spin
        unsliced.vRotX = (Math.random() - 0.5) * 6;
        unsliced.vRotY = (Math.random() - 0.5) * 6;
        unsliced.vRotZ = (Math.random() - 0.5) * 6;

        // Broadcast count update
        const slicedCount = physicsData.current.filter((w) => w.sliced).length;
        window.dispatchEvent(new CustomEvent("melon-sliced-count", { detail: { count: slicedCount } }));
      }
    };

    const handleRegrow = () => {
      physicsData.current.forEach((w) => {
        if (w.sliced) {
          w.regrowing = true;
        }
      });
      window.dispatchEvent(new CustomEvent("melon-sliced-count", { detail: { count: 0 } }));
    };

    window.addEventListener("melon-slice", handleSlice);
    window.addEventListener("melon-regrow", handleRegrow);

    return () => {
      window.removeEventListener("melon-slice", handleSlice);
      window.removeEventListener("melon-regrow", handleRegrow);
    };
  }, []);

  // Frame tick physics solver
  useFrame((state, delta) => {
    const t = state.clock.getElapsedTime();
    const dt = Math.min(delta, 0.1); // cap time step to avoid physics explosion

    physicsData.current.forEach((data, i) => {
      const group = wedgesRefs.current[i];
      if (!group) return;

      if (data.regrowing) {
        // Smoothly interpolate coordinate offsets back to zero slots
        const lerpSpeed = 0.1;
        data.x += (0 - data.x) * lerpSpeed;
        data.y += (0 - data.y) * lerpSpeed;
        data.z += (0 - data.z) * lerpSpeed;
        data.rotX += (0 - data.rotX) * lerpSpeed;
        data.rotY += (0 - data.rotY) * lerpSpeed;
        data.rotZ += (0 - data.rotZ) * lerpSpeed;

        // Snap and lock when close enough
        if (
          Math.abs(data.x) < 0.02 &&
          Math.abs(data.y) < 0.02 &&
          Math.abs(data.z) < 0.02
        ) {
          data.x = 0; data.y = 0; data.z = 0;
          data.rotX = 0; data.rotY = 0; data.rotZ = 0;
          data.sliced = false;
          data.regrowing = false;
        }
      } else if (data.sliced) {
        // Apply position delta
        data.x += data.vx * dt;
        data.y += data.vy * dt;
        data.z += data.vz * dt;

        // Gravity pull
        data.vy -= 12 * dt;

        // Apply tumble spin
        data.rotX += data.vRotX * dt;
        data.rotY += data.vRotY * dt;
        data.rotZ += data.vRotZ * dt;
      }

      // Sync data to 3D matrix
      group.position.set(data.x, data.y, data.z);
      group.rotation.set(data.rotX, data.rotY, data.rotZ);
    });

    // Idle organic float and slow spin on the overall assembly
    if (sceneContainerRef.current) {
      sceneContainerRef.current.position.y = Math.sin(t * 1.2) * 0.12;
      // Only apply idle spin if not fully sliced
      const allSliced = physicsData.current.every((w) => w.sliced);
      if (!allSliced) {
        sceneContainerRef.current.rotation.y = t * 0.12;
      }
    }
  });

  return (
    <>
      <group ref={sceneContainerRef}>
        {Array.from({ length: NUM_WEDGES }).map((_, i) => {
          const phiStart = i * WEDGE_ANGLE;
          return (
            <group
              key={i}
              ref={(el) => { wedgesRefs.current[i] = el; }}
            >
              {/* Outer shell segment (tactile skin) */}
              <mesh castShadow receiveShadow scale={[2.3, 2.35, 2.3]}>
                <sphereGeometry args={[1, 32, 32, phiStart, WEDGE_ANGLE, 0, Math.PI]} />
                <meshPhysicalMaterial
                  map={rindTexture}
                  bumpMap={bumpTexture}
                  bumpScale={0.012}
                  roughness={0.48}
                  metalness={0.05}
                  clearcoat={0.12}
                  clearcoatRoughness={0.35}
                />
              </mesh>

              {/* Flat cut wall 1 */}
              <mesh
                rotation={[0, phiStart, 0]}
                scale={[2.3, 2.35, 2.3]}
                castShadow
              >
                <shapeGeometry args={[semiCircleShape]} />
                <meshPhysicalMaterial
                  map={pulpTexture}
                  roughness={0.62}
                  metalness={0.05}
                  side={THREE.DoubleSide}
                />
              </mesh>

              {/* Flat cut wall 2 */}
              <mesh
                rotation={[0, phiStart + WEDGE_ANGLE, 0]}
                scale={[2.3, 2.35, 2.3]}
                castShadow
              >
                <shapeGeometry args={[semiCircleShape]} />
                <meshPhysicalMaterial
                  map={pulpTexture}
                  roughness={0.62}
                  metalness={0.05}
                  side={THREE.DoubleSide}
                />
              </mesh>
            </group>
          );
        })}
      </group>
      <OrbitControls
        enableZoom={false}
        enablePan={false}
        minPolarAngle={Math.PI / 3}
        maxPolarAngle={Math.PI * 2 / 3}
      />
    </>
  );
}
