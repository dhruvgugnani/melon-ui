"use client";

import { useMemo, useRef, useEffect, useState } from "react";
import { useFrame } from "@react-three/fiber";
import * as THREE from "three";
import { OrbitControls } from "@react-three/drei";
import gsap from "gsap";

const NUM_PARTICLES = 35;

// Pure, seedable LCG pseudo-random generator
function createRandom(seed: number) {
  let s = seed;
  return function() {
    s = (s * 9301 + 49297) % 233280;
    return s / 233280;
  };
}

export function HomeMelon() {
  const group1Ref = useRef<THREE.Group>(null); // Left half group
  const group2Ref = useRef<THREE.Group>(null); // Right half group
  const particleRefs = useRef<(THREE.Mesh | null)[]>([]);

  // Local state to manage material opacity during fadeout
  const [halvesOpacity, setHalvesOpacity] = useState(1.0);
  const halvesOpacityRef = useRef(1.0);

  // Slicing state
  const isSlicedRef = useRef(false);
  const regrowingRef = useRef(false);

  // Physics vectors for the two halves
  const h1Phys = useRef({
    px: 0, py: 0, pz: 0,
    vx: 0, vy: 0, vz: 0,
    rx: 0, ry: 0, rz: 0,
    vrx: 0, vry: 0, vrz: 0,
  });
  const h2Phys = useRef({
    px: 0, py: 0, pz: 0,
    vx: 0, vy: 0, vz: 0,
    rx: 0, ry: 0, rz: 0,
    vrx: 0, vry: 0, vrz: 0,
  });

  // Particle pool data
  const particlesData = useRef(
    Array.from({ length: NUM_PARTICLES }, () => ({
      active: false,
      x: 0, y: 0, z: 0,
      vx: 0, vy: 0, vz: 0,
      scale: 0.1,
      opacity: 0,
      color: "#ff5c71",
    }))
  );

  // Procedural matte watermelon rind texture
  const rindTexture = useMemo(() => {
    const canvas = document.createElement("canvas");
    canvas.width = 1024;
    canvas.height = 512;
    const ctx = canvas.getContext("2d");
    const rng = createRandom(22334);

    if (ctx) {
      ctx.fillStyle = "#3d6431";
      ctx.fillRect(0, 0, 1024, 512);

      // Light green mottle patches
      for (let i = 0; i < 180; i++) {
        const x = rng() * 1024;
        const y = rng() * 512;
        const radius = 30 + rng() * 70;
        const grad = ctx.createRadialGradient(x, y, 0, x, y, radius);
        grad.addColorStop(0, "rgba(105, 165, 85, 0.25)");
        grad.addColorStop(0.5, "rgba(85, 140, 70, 0.12)");
        grad.addColorStop(1, "rgba(61, 100, 49, 0)");
        ctx.fillStyle = grad;
        ctx.beginPath();
        ctx.arc(x, y, radius, 0, Math.PI * 2);
        ctx.fill();
      }

      // Wavy stripes
      for (let i = 0; i < 14; i++) {
        const startX = (i * 1024) / 14;
        [-1024, 0, 1024].forEach((offset) => {
          ctx.beginPath();
          for (let y = 0; y <= 512; y += 4) {
            const wave1 = Math.sin(y * 0.04) * 16;
            const wave2 = Math.sin(y * 0.08 + i * 1.5) * 6;
            const wave3 = (rng() - 0.5) * 4;
            const x = startX + offset + wave1 + wave2 + wave3;
            if (y === 0) ctx.moveTo(x, y);
            else ctx.lineTo(x, y);
          }
          ctx.lineWidth = 15 + rng() * 10;
          ctx.lineCap = "round";
          ctx.lineJoin = "round";
          ctx.strokeStyle = "rgba(16, 30, 14, 0.9)";
          ctx.stroke();
        });
      }
    }
    const tex = new THREE.CanvasTexture(canvas);
    tex.wrapS = THREE.RepeatWrapping;
    tex.wrapT = THREE.ClampToEdgeWrapping;
    return tex;
  }, []);

  // Bump map for matte rind
  const bumpTexture = useMemo(() => {
    const canvas = document.createElement("canvas");
    canvas.width = 512;
    canvas.height = 512;
    const ctx = canvas.getContext("2d");
    const rng = createRandom(66778);

    if (ctx) {
      ctx.fillStyle = "#808080";
      ctx.fillRect(0, 0, 512, 512);

      for (let i = 0; i < 22000; i++) {
        const x = rng() * 512;
        const y = rng() * 512;
        const size = 0.2 + rng() * 1.6;
        const val = Math.floor(90 + rng() * 60);
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

  // Pulp texture for inner cut face
  const pulpTexture = useMemo(() => {
    const canvas = document.createElement("canvas");
    canvas.width = 512;
    canvas.height = 512;
    const ctx = canvas.getContext("2d");
    const rng = createRandom(99887);

    if (ctx) {
      // Base vibrant red
      ctx.fillStyle = "#ff4f66";
      ctx.fillRect(0, 0, 512, 512);

      // Pulp grain details
      for (let i = 0; i < 5000; i++) {
        const x = rng() * 512;
        const y = rng() * 512;
        const radius = 0.5 + rng() * 2.0;
        ctx.fillStyle = "rgba(255, 150, 165, 0.22)";
        ctx.beginPath();
        ctx.arc(x, y, radius, 0, Math.PI * 2);
        ctx.fill();
      }

      // Watermelon Seeds
      ctx.fillStyle = "#1c100f";
      for (let i = 0; i < 16; i++) {
        const x = 80 + rng() * 352;
        const y = 80 + rng() * 352;
        ctx.save();
        ctx.translate(x, y);
        ctx.rotate(rng() * Math.PI * 2);
        ctx.beginPath();
        ctx.ellipse(0, 0, 11, 6, 0, 0, Math.PI * 2);
        ctx.fill();
        ctx.fillStyle = "rgba(255, 255, 255, 0.2)";
        ctx.beginPath();
        ctx.ellipse(-3, -1.5, 3.5, 1.8, 0, 0, Math.PI * 2);
        ctx.fill();
        ctx.restore();
        ctx.fillStyle = "#1c100f";
      }
    }
    const tex = new THREE.CanvasTexture(canvas);
    return tex;
  }, []);

  const spawnParticles = (x: number, y: number, z: number) => {
    const rng = createRandom(Math.random() * 99999);
    particlesData.current.forEach((p, idx) => {
      if (!p.active) {
        p.active = true;
        p.x = x;
        p.y = y;
        p.z = z;

        const theta = rng() * Math.PI * 2;
        const phi = rng() * Math.PI;
        const speed = 4 + rng() * 8;

        p.vx = Math.cos(theta) * Math.sin(phi) * speed;
        p.vy = Math.sin(theta) * Math.sin(phi) * speed + 3.0; // spray upward
        p.vz = Math.cos(phi) * speed;

        p.opacity = 1.0;
        p.scale = 0.35 + rng() * 0.85;
        p.color = rng() > 0.18 ? "#ff4f66" : "#1c100f"; // Pulp or seed color

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

  useEffect(() => {
    const handleSlice = (e: Event) => {
      if (isSlicedRef.current || regrowingRef.current) return;

      const customEvent = e as CustomEvent;
      const angle = customEvent.detail?.angle ?? 0;
      isSlicedRef.current = true;

      // Align both half groups' rotation to the cut angle
      h1Phys.current.rz = angle;
      h2Phys.current.rz = angle;

      if (group1Ref.current) group1Ref.current.rotation.z = angle;
      if (group2Ref.current) group2Ref.current.rotation.z = angle;

      // Slicing velocities perpendicular to the slash angle
      const perpAngle1 = angle + Math.PI / 2;
      const perpAngle2 = angle - Math.PI / 2;
      const ejectSpeed = 4.5 + Math.random() * 1.5;

      h1Phys.current.vx = Math.cos(perpAngle1) * ejectSpeed;
      h1Phys.current.vy = Math.sin(perpAngle1) * ejectSpeed + 3.0; // add slight pop up
      h1Phys.current.vz = (Math.random() - 0.5) * 2;

      h2Phys.current.vx = Math.cos(perpAngle2) * ejectSpeed;
      h2Phys.current.vy = Math.sin(perpAngle2) * ejectSpeed + 3.0;
      h2Phys.current.vz = (Math.random() - 0.5) * 2;

      // Add tumble rotations
      h1Phys.current.vrx = (Math.random() - 0.5) * 6;
      h1Phys.current.vry = (Math.random() - 0.5) * 6;
      h1Phys.current.vrz = (Math.random() - 0.5) * 6;

      h2Phys.current.vrx = (Math.random() - 0.5) * 6;
      h2Phys.current.vry = (Math.random() - 0.5) * 6;
      h2Phys.current.vrz = (Math.random() - 0.5) * 6;

      // Spawn juicy particles
      spawnParticles(0, 0, 0);

      // Trigger "Regrow" UI visibility on page
      window.dispatchEvent(new CustomEvent("melon-sliced-count", { detail: { count: 1 } }));
    };

    const handleRegrow = () => {
      if (!isSlicedRef.current || regrowingRef.current) return;
      regrowingRef.current = true;

      // Reset local positions and rotations smoothly using GSAP
      const timeline = gsap.timeline({
        onComplete: () => {
          // Hard reset properties
          h1Phys.current = { px: 0, py: 0, pz: 0, vx: 0, vy: 0, vz: 0, rx: 0, ry: 0, rz: 0, vrx: 0, vry: 0, vrz: 0 };
          h2Phys.current = { px: 0, py: 0, pz: 0, vx: 0, vy: 0, vz: 0, rx: 0, ry: 0, rz: 0, vrx: 0, vry: 0, vrz: 0 };
          
          isSlicedRef.current = false;
          regrowingRef.current = false;
          window.dispatchEvent(new CustomEvent("melon-sliced-count", { detail: { count: 0 } }));
        }
      });

      // Smoothly fade-in halves back
      setHalvesOpacity(1.0);
      halvesOpacityRef.current = 1.0;

      if (group1Ref.current && group2Ref.current) {
        timeline.to([group1Ref.current.position, group2Ref.current.position], {
          x: 0, y: 0, z: 0,
          duration: 0.65,
          ease: "power2.inOut",
        }, 0);
        timeline.to([group1Ref.current.rotation, group2Ref.current.rotation], {
          x: 0, y: 0, z: 0,
          duration: 0.65,
          ease: "power2.inOut",
        }, 0);
      }
    };

    window.addEventListener("melon-slice", handleSlice);
    window.addEventListener("melon-regrow", handleRegrow);

    return () => {
      window.removeEventListener("melon-slice", handleSlice);
      window.removeEventListener("melon-regrow", handleRegrow);
    };
  }, []);

  useFrame((state, delta) => {
    const t = state.clock.getElapsedTime();
    const dt = Math.min(delta, 0.1);

    // Particle Physics update
    particlesData.current.forEach((p, idx) => {
      const mesh = particleRefs.current[idx];
      if (!mesh) return;

      if (p.active) {
        p.x += p.vx * dt;
        p.y += p.vy * dt;
        p.z += p.vz * dt;
        p.vy -= 9.8 * dt; // gravity
        p.opacity -= 0.85 * dt;

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

    // Melon Halves Physics solver
    if (isSlicedRef.current && !regrowingRef.current) {
      // 1. Apply gravity and velocities
      h1Phys.current.px += h1Phys.current.vx * dt;
      h1Phys.current.py += h1Phys.current.vy * dt;
      h1Phys.current.pz += h1Phys.current.vz * dt;
      h1Phys.current.vy -= 12 * dt; // gravity

      h2Phys.current.px += h2Phys.current.vx * dt;
      h2Phys.current.py += h2Phys.current.vy * dt;
      h2Phys.current.pz += h2Phys.current.vz * dt;
      h2Phys.current.vy -= 12 * dt;

      // 2. Apply tumbles
      h1Phys.current.rx += h1Phys.current.vrx * dt;
      h1Phys.current.ry += h1Phys.current.vry * dt;
      h1Phys.current.rz += h1Phys.current.vrz * dt;

      h2Phys.current.rx += h2Phys.current.vrx * dt;
      h2Phys.current.ry += h2Phys.current.vry * dt;
      h2Phys.current.rz += h2Phys.current.vrz * dt;

      // Update positions & rotations
      if (group1Ref.current) {
        group1Ref.current.position.set(h1Phys.current.px, h1Phys.current.py, h1Phys.current.pz);
        group1Ref.current.rotation.set(h1Phys.current.rx, h1Phys.current.ry, h1Phys.current.rz);
      }
      if (group2Ref.current) {
        group2Ref.current.position.set(h2Phys.current.px, h2Phys.current.py, h2Phys.current.pz);
        group2Ref.current.rotation.set(h2Phys.current.rx, h2Phys.current.ry, h2Phys.current.rz);
      }

      // 3. Fade out
      if (halvesOpacityRef.current > 0) {
        const nextOpacity = Math.max(0, halvesOpacityRef.current - 0.55 * dt);
        halvesOpacityRef.current = nextOpacity;
        setHalvesOpacity(nextOpacity);
      }
    } else if (!isSlicedRef.current && !regrowingRef.current) {
      // Whole Melon Idle Animations
      if (group1Ref.current && group2Ref.current) {
        // Slow rotation
        const baseRotY = t * 0.16;
        group1Ref.current.rotation.y = baseRotY;
        group2Ref.current.rotation.y = baseRotY;

        // float height
        const floatY = Math.sin(t * 1.4) * 0.15;
        group1Ref.current.position.y = floatY;
        group2Ref.current.position.y = floatY;

        // Reset X and Z
        group1Ref.current.position.x = 0;
        group1Ref.current.position.z = 0;
        group2Ref.current.position.x = 0;
        group2Ref.current.position.z = 0;

        group1Ref.current.rotation.x = 0;
        group1Ref.current.rotation.z = 0;
        group2Ref.current.rotation.x = 0;
        group2Ref.current.rotation.z = 0;
      }
    }
  });

  return (
    <>
      {/* Group 1: Left/Right Half 1 */}
      <group ref={group1Ref}>
        <group scale={[2.4, 2.7, 2.4]}>
          {/* Half Sphere outer rind */}
          <mesh castShadow receiveShadow>
            <sphereGeometry args={[1, 64, 32, -Math.PI / 2, Math.PI]} />
            <meshPhysicalMaterial
              map={rindTexture}
              bumpMap={bumpTexture}
              bumpScale={0.016}
              roughness={0.8}
              metalness={0.02}
              clearcoat={0}
              transparent
              opacity={halvesOpacity}
            />
          </mesh>

          {/* Inner pulp flat cut face */}
          <mesh rotation={[0, -Math.PI / 2, 0]}>
            <circleGeometry args={[1, 64]} />
            <meshPhysicalMaterial
              map={pulpTexture}
              roughness={0.7}
              metalness={0.0}
              clearcoat={0}
              side={THREE.DoubleSide}
              transparent
              opacity={halvesOpacity}
            />
          </mesh>
        </group>
      </group>

      {/* Group 2: Left/Right Half 2 */}
      <group ref={group2Ref}>
        <group scale={[2.4, 2.7, 2.4]}>
          {/* Other Half Sphere outer rind */}
          <mesh castShadow receiveShadow>
            <sphereGeometry args={[1, 64, 32, Math.PI / 2, Math.PI]} />
            <meshPhysicalMaterial
              map={rindTexture}
              bumpMap={bumpTexture}
              bumpScale={0.016}
              roughness={0.8}
              metalness={0.02}
              clearcoat={0}
              transparent
              opacity={halvesOpacity}
            />
          </mesh>

          {/* Inner pulp flat cut face */}
          <mesh rotation={[0, Math.PI / 2, 0]}>
            <circleGeometry args={[1, 64]} />
            <meshPhysicalMaterial
              map={pulpTexture}
              roughness={0.7}
              metalness={0.0}
              clearcoat={0}
              side={THREE.DoubleSide}
              transparent
              opacity={halvesOpacity}
            />
          </mesh>
        </group>
      </group>

      {/* 3D Pre-allocated Juice Splatter Particles */}
      {Array.from({ length: NUM_PARTICLES }).map((_, idx) => (
        <mesh
          key={idx}
          ref={(el) => { particleRefs.current[idx] = el; }}
          visible={false}
        >
          <sphereGeometry args={[0.07, 8, 8]} />
          <meshBasicMaterial color="#ff4f66" transparent opacity={0} />
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
