"use client";

import { useMemo, useRef, useEffect } from "react";
import { useFrame } from "@react-three/fiber";
import * as THREE from "three";
import { OrbitControls } from "@react-three/drei";

const NUM_WEDGES = 4;

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
  const particleRefs = useRef<(THREE.Mesh | null)[]>([]);

  // Physics refs
  const sliceStateRef = useRef(0); // 0 = whole, 1 = halves, 2 = quarters
  const regrowingRef = useRef(false);
  const parentPosRef = useRef({ x: 0, y: 0, z: 0 });
  const parentVelRef = useRef({ x: 0, y: 0, z: 0 });
  const parentRotZRef = useRef(0);
  
  // Local displacements (relative to center of mass)
  const localOffset = useRef({ x: 0, y: 0, z: 0 });
  const localVel = useRef({ x: 0, y: 0, z: 0 });

  // Procedural watermelon skin rind texture
  const rindTexture = useMemo(() => {
    const canvas = document.createElement("canvas");
    canvas.width = 1024;
    canvas.height = 512;
    const ctx = canvas.getContext("2d");
    if (ctx) {
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
    const rng = createRandom(88776);
    if (ctx) {
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

  // Procedural pulp texture with grain and seeds
  const pulpTexture = useMemo(() => {
    const canvas = document.createElement("canvas");
    canvas.width = 512;
    canvas.height = 512;
    const ctx = canvas.getContext("2d");
    const rng = createRandom(11223);
    if (ctx) {
      ctx.fillStyle = "#ff5c71";
      ctx.fillRect(0, 0, 512, 512);

      for (let i = 0; i < 4000; i++) {
        const x = rng() * 512;
        const y = rng() * 512;
        const radius = 0.5 + rng() * 2.5;
        ctx.fillStyle = "rgba(255, 140, 154, 0.22)";
        ctx.beginPath();
        ctx.arc(x, y, radius, 0, Math.PI * 2);
        ctx.fill();
      }

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

  // Individual tumbles for the 4 quarters
  const physicsData = useRef(
    Array.from({ length: NUM_WEDGES }, (_, i) => ({
      index: i,
      rotX: 0, rotY: 0, rotZ: 0,
      vRotX: 0, vRotY: 0, vRotZ: 0,
    }))
  );

  // Instanced juice particle pool data
  const particlesData = useRef(
    Array.from({ length: 30 }, () => ({
      active: false,
      x: 0, y: 0, z: 0,
      vx: 0, vy: 0, vz: 0,
      scale: 0.1,
      opacity: 0,
      color: "#ff5c71",
    }))
  );

  // Trigger 3D particles splash
  const spawnParticles = (x: number, y: number, z: number) => {
    const rng = createRandom(Math.random() * 100000);
    particlesData.current.forEach((p, idx) => {
      if (!p.active) {
        p.active = true;
        p.x = x;
        p.y = y;
        p.z = z;
        
        // Sphere coordinate directions
        const angle = rng() * Math.PI * 2;
        const speed = 3 + rng() * 5;
        const pitch = rng() * Math.PI;

        p.vx = Math.cos(angle) * Math.sin(pitch) * speed;
        p.vy = Math.sin(angle) * Math.sin(pitch) * speed + 2.5; // push up
        p.vz = Math.cos(pitch) * speed;

        p.opacity = 1.0;
        p.scale = 0.4 + rng() * 0.9;
        p.color = rng() > 0.2 ? "#ff5c71" : "#1a0e0d"; // Pulp or seeds

        const mesh = particleRefs.current[idx];
        if (mesh) {
          mesh.visible = true;
          mesh.position.set(p.x, p.y, p.z);
          mesh.scale.setScalar(p.scale);
          if (!Array.isArray(mesh.material)) {
            const mat = mesh.material as THREE.MeshBasicMaterial;
            mat.color.set(p.color);
            mat.opacity = 1.0;
          }
        }
      }
    });
  };

  // Subscribe to slicing/regrowing events
  useEffect(() => {
    const handleSlice = (e: Event) => {
      if (regrowingRef.current) return;

      const customEvent = e as CustomEvent;
      const { angle } = customEvent.detail || { angle: 0 };

      if (sliceStateRef.current === 0) {
        // --- SLICE 1: Split into Halves along the cut line ---
        sliceStateRef.current = 1;
        parentRotZRef.current = angle; // align axis with cut line

        // Center of mass global launch
        parentVelRef.current.x = Math.cos(angle) * 1.5;
        parentVelRef.current.y = 3.5 + Math.random() * 1.5;
        parentVelRef.current.z = (Math.random() - 0.5) * 2;

        // Local separating velocity along the local Y axis (perpendicular to cut)
        localVel.current.y = 4.5 + Math.random() * 1.5;

        // Tumbles for the wedges
        physicsData.current.forEach((w) => {
          w.vRotX = (Math.random() - 0.5) * 5;
          w.vRotY = (Math.random() - 0.5) * 5;
          w.vRotZ = (Math.random() - 0.5) * 5;
        });

        // Eject juice particles
        spawnParticles(
          parentPosRef.current.x,
          parentPosRef.current.y,
          parentPosRef.current.z
        );

        window.dispatchEvent(new CustomEvent("melon-sliced-count", { detail: { count: 1 } }));

      } else if (sliceStateRef.current === 1) {
        // --- SLICE 2: Split halves into Quarters ---
        sliceStateRef.current = 2;

        // Secondary launch pop
        parentVelRef.current.y += 2.5;
        parentVelRef.current.x += Math.cos(angle) * 1.2;

        // Local separating velocity along local X and Z axes
        localVel.current.x = 4.0 + Math.random() * 1.5;
        localVel.current.z = 2.5 + Math.random() * 1.0;

        // Speed up tumbles
        physicsData.current.forEach((w) => {
          w.vRotX += (Math.random() - 0.5) * 4;
          w.vRotY += (Math.random() - 0.5) * 4;
          w.vRotZ += (Math.random() - 0.5) * 4;
        });

        // Spawn more particles
        spawnParticles(
          parentPosRef.current.x,
          parentPosRef.current.y,
          parentPosRef.current.z
        );

        window.dispatchEvent(new CustomEvent("melon-sliced-count", { detail: { count: 2 } }));

      } else {
        // --- SLICE 3+: Extra slices just apply kinetic shock & spawn particles ---
        parentVelRef.current.y += 1.5;
        localVel.current.x += 1.0;
        localVel.current.y += 1.0;

        spawnParticles(
          parentPosRef.current.x + (Math.random() - 0.5) * 2,
          parentPosRef.current.y + (Math.random() - 0.5) * 2,
          parentPosRef.current.z + (Math.random() - 0.5) * 2
        );
      }
    };

    const handleRegrow = () => {
      regrowingRef.current = true;
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
    const dt = Math.min(delta, 0.1);

    // Particle updates
    particlesData.current.forEach((p, idx) => {
      const mesh = particleRefs.current[idx];
      if (!mesh) return;

      if (p.active) {
        p.x += p.vx * dt;
        p.y += p.vy * dt;
        p.z += p.vz * dt;
        p.vy -= 10 * dt; // gravity
        p.opacity -= 0.82 * dt; // fade

        if (p.opacity <= 0) {
          p.active = false;
          mesh.visible = false;
        } else {
          mesh.position.set(p.x, p.y, p.z);
          mesh.scale.setScalar(p.scale * p.opacity);
          if (!Array.isArray(mesh.material)) {
            (mesh.material as THREE.MeshBasicMaterial).opacity = p.opacity;
          }
        }
      }
    });

    if (regrowingRef.current) {
      // Smooth lerp return coordinates back to 0 origin
      const lerpSpeed = 0.08;
      
      parentPosRef.current.x += (0 - parentPosRef.current.x) * lerpSpeed;
      parentPosRef.current.y += (0 - parentPosRef.current.y) * lerpSpeed;
      parentPosRef.current.z += (0 - parentPosRef.current.z) * lerpSpeed;
      parentRotZRef.current += (0 - parentRotZRef.current) * lerpSpeed;

      localOffset.current.x += (0 - localOffset.current.x) * lerpSpeed;
      localOffset.current.y += (0 - localOffset.current.y) * lerpSpeed;
      localOffset.current.z += (0 - localOffset.current.z) * lerpSpeed;

      physicsData.current.forEach((w) => {
        w.rotX += (0 - w.rotX) * lerpSpeed;
        w.rotY += (0 - w.rotY) * lerpSpeed;
        w.rotZ += (0 - w.rotZ) * lerpSpeed;
      });

      // Lock positions
      if (
        Math.abs(localOffset.current.y) < 0.01 &&
        Math.abs(parentPosRef.current.y) < 0.01
      ) {
        localOffset.current.x = 0; localOffset.current.y = 0; localOffset.current.z = 0;
        parentPosRef.current.x = 0; parentPosRef.current.y = 0; parentPosRef.current.z = 0;
        parentRotZRef.current = 0;
        sliceStateRef.current = 0;
        regrowingRef.current = false;
        physicsData.current.forEach((w) => {
          w.rotX = 0; w.rotY = 0; w.rotZ = 0;
          w.vRotX = 0; w.vRotY = 0; w.vRotZ = 0;
        });
      }
    } else {
      if (sliceStateRef.current >= 1) {
        // Parent center-of-mass trajectory
        parentPosRef.current.x += parentVelRef.current.x * dt;
        parentPosRef.current.y += parentVelRef.current.y * dt;
        parentPosRef.current.z += parentVelRef.current.z * dt;
        parentVelRef.current.y -= 11 * dt; // gravity

        // Local relative splitting
        localOffset.current.y += localVel.current.y * dt;
        localVel.current.y *= 0.94; // friction damping

        if (sliceStateRef.current >= 2) {
          localOffset.current.x += localVel.current.x * dt;
          localOffset.current.z += localVel.current.z * dt;
          localVel.current.x *= 0.94;
          localVel.current.z *= 0.94;
        }

        // Individual tumbles
        physicsData.current.forEach((w) => {
          w.rotX += w.vRotX * dt;
          w.rotY += w.vRotY * dt;
          w.rotZ += w.vRotZ * dt;
        });
      }
    }

    // Apply parent position and orientation
    if (sceneContainerRef.current) {
      sceneContainerRef.current.position.set(
        parentPosRef.current.x,
        parentPosRef.current.y,
        parentPosRef.current.z
      );
      sceneContainerRef.current.rotation.z = parentRotZRef.current;

      // Idle float (only when NOT sliced)
      if (sliceStateRef.current === 0) {
        sceneContainerRef.current.position.y = Math.sin(t * 1.2) * 0.12;
        sceneContainerRef.current.rotation.y = t * 0.12;
      } else {
        sceneContainerRef.current.rotation.y = 0;
      }
    }

    // Sync offsets to local child mesh groups
    physicsData.current.forEach((data, i) => {
      const group = wedgesRefs.current[i];
      if (!group) return;

      let px = 0, py = 0, pz = 0;
      if (sliceStateRef.current >= 1) {
        // local X split (Quarter 0/3 right, Quarter 1/2 left)
        const xSign = (i === 0 || i === 3) ? 1 : -1;
        px = localOffset.current.x * xSign;

        // local Y split (Quarter 0/1 top, Quarter 2/3 bottom)
        const ySign = (i === 0 || i === 1) ? 1 : -1;
        py = localOffset.current.y * ySign;

        // local Z split (Quarter 0/2 forward, Quarter 1/3 backward)
        const zSign = (i === 0 || i === 2) ? 1 : -1;
        pz = localOffset.current.z * zSign;
      }

      group.position.set(px, py, pz);
      group.rotation.set(data.rotX, data.rotY, data.rotZ);
    });
  });

  return (
    <>
      <group ref={sceneContainerRef}>
        {Array.from({ length: NUM_WEDGES }).map((_, i) => {
          const phiStart = i * (Math.PI / 2);
          return (
            <group
              key={i}
              ref={(el) => { wedgesRefs.current[i] = el; }}
            >
              {/* Outer rind shell segment */}
              <mesh castShadow receiveShadow scale={[2.3, 2.35, 2.3]}>
                <sphereGeometry args={[1, 32, 16, phiStart, Math.PI / 2, 0, Math.PI]} />
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

              {/* Red pulp flat wall 1 */}
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

              {/* Red pulp flat wall 2 */}
              <mesh
                rotation={[0, phiStart + Math.PI / 2, 0]}
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

      {/* Pre-allocated juice particles */}
      {Array.from({ length: 30 }).map((_, idx) => (
        <mesh
          key={idx}
          ref={(el) => { particleRefs.current[idx] = el; }}
          visible={false}
        >
          <sphereGeometry args={[0.07, 8, 8]} />
          <meshBasicMaterial color="#ff5c71" transparent opacity={0} />
        </mesh>
      ))}

      <OrbitControls
        enableZoom={false}
        enablePan={false}
        minPolarAngle={Math.PI / 3}
        maxPolarAngle={Math.PI * 2 / 3}
      />
    </>
  );
}
