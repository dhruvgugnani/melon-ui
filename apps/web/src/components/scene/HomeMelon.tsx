"use client";

import { useMemo, useRef, useEffect } from "react";
import { useFrame } from "@react-three/fiber";
import * as THREE from "three";
import { OrbitControls } from "@react-three/drei";
import gsap from "gsap";

// Pure, seedable LCG pseudo-random generator to satisfy react-hooks/purity
function createRandom(seed: number) {
  let s = seed;
  return function() {
    s = (s * 9301 + 49297) % 233280;
    return s / 233280;
  };
}

export function HomeMelon() {
  const meshRef = useRef<THREE.Mesh>(null);
  const mouse = useRef({ x: 0, y: 0 });

  // Procedural organic watermelon skin texture
  const rindTexture = useMemo(() => {
    const canvas = document.createElement("canvas");
    canvas.width = 1024;
    canvas.height = 512;
    const ctx = canvas.getContext("2d");
    const rng = createRandom(12345);

    if (ctx) {
      // 1. Base organic green background
      ctx.fillStyle = "#3b5d2f";
      ctx.fillRect(0, 0, 1024, 512);

      // 2. Add organic lighter green mottle patches for realism
      for (let i = 0; i < 150; i++) {
        const x = rng() * 1024;
        const y = rng() * 512;
        const radius = 25 + rng() * 65;
        const grad = ctx.createRadialGradient(x, y, 0, x, y, radius);
        grad.addColorStop(0, "rgba(95, 150, 75, 0.28)");
        grad.addColorStop(0.5, "rgba(80, 130, 65, 0.12)");
        grad.addColorStop(1, "rgba(59, 93, 47, 0)");
        ctx.fillStyle = grad;
        ctx.beginPath();
        ctx.arc(x, y, radius, 0, Math.PI * 2);
        ctx.fill();
      }

      // 3. Draw dark wavy stripes wrapping around the sphere
      for (let i = 0; i < 14; i += 1) {
        const startX = (i * 1024) / 14;
        [-1024, 0, 1024].forEach((offset) => {
          ctx.beginPath();
          for (let y = 0; y <= 512; y += 4) {
            // Organic wave offsets
            const wave1 = Math.sin(y * 0.04) * 18;
            const wave2 = Math.sin(y * 0.08 + i * 1.5) * 8;
            const wave3 = (rng() - 0.5) * 3; // fine organic noise jitter
            const x = startX + offset + wave1 + wave2 + wave3;
            
            if (y === 0) {
              ctx.moveTo(x, y);
            } else {
              ctx.lineTo(x, y);
            }
          }
          
          // Organic varying width stripes
          ctx.lineWidth = 14 + rng() * 12;
          ctx.lineCap = "round";
          ctx.lineJoin = "round";
          ctx.strokeStyle = "rgba(18, 33, 15, 0.9)";
          ctx.stroke();
        });
      }

      // 4. Fine details / sunspots
      for (let i = 0; i < 800; i++) {
        const x = rng() * 1024;
        const y = rng() * 512;
        const size = 0.5 + rng() * 1.5;
        ctx.fillStyle = rng() > 0.5 ? "rgba(100, 155, 80, 0.18)" : "rgba(15, 28, 12, 0.25)";
        ctx.beginPath();
        ctx.arc(x, y, size, 0, Math.PI * 2);
        ctx.fill();
      }
    }
    const tex = new THREE.CanvasTexture(canvas);
    tex.wrapS = THREE.RepeatWrapping;
    tex.wrapT = THREE.ClampToEdgeWrapping;
    return tex;
  }, []);

  // Procedural skin bump map for organic skin tactile depth texture
  const bumpTexture = useMemo(() => {
    const canvas = document.createElement("canvas");
    canvas.width = 512;
    canvas.height = 512;
    const ctx = canvas.getContext("2d");
    const rng = createRandom(54321);

    if (ctx) {
      ctx.fillStyle = "#808080";
      ctx.fillRect(0, 0, 512, 512);

      // Add fine grain bumps
      for (let i = 0; i < 20000; i++) {
        const x = rng() * 512;
        const y = rng() * 512;
        const size = 0.3 + rng() * 1.5;
        const val = Math.floor(95 + rng() * 55);
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

  // Set up mouse move listener for magnetic tracking
  useEffect(() => {
    const handleMouseMove = (e: MouseEvent) => {
      mouse.current.x = (e.clientX / window.innerWidth) - 0.5;
      mouse.current.y = (e.clientY / window.innerHeight) - 0.5;
    };
    window.addEventListener("mousemove", handleMouseMove);
    return () => window.removeEventListener("mousemove", handleMouseMove);
  }, []);

  // Click elastic squash and stretch bounce interaction
  const handlePointerDown = () => {
    if (!meshRef.current) return;
    
    gsap.killTweensOf(meshRef.current.scale);
    
    // Squash down on click and stretch out with elastic spring
    gsap.timeline()
      .to(meshRef.current.scale, {
        x: 2.3,
        y: 2.5,
        z: 2.3,
        duration: 0.12,
        ease: "power2.out",
      })
      .to(meshRef.current.scale, {
        x: 2.1,
        y: 3.0,
        z: 2.1,
        duration: 1.0,
        ease: "elastic.out(1.4, 0.35)",
      });
  };

  // Hover scale swell interaction
  const handlePointerOver = () => {
    document.body.style.cursor = "pointer";
    if (!meshRef.current) return;
    gsap.to(meshRef.current.scale, {
      x: 2.2,
      y: 3.15,
      z: 2.2,
      duration: 0.4,
      ease: "power3.out",
    });
  };

  const handlePointerOut = () => {
    document.body.style.cursor = "default";
    if (!meshRef.current) return;
    gsap.to(meshRef.current.scale, {
      x: 2.1,
      y: 3.0,
      z: 2.1,
      duration: 0.6,
      ease: "power3.out",
    });
  };

  // Frame tick animation loop
  useFrame((state) => {
    const t = state.clock.getElapsedTime();
    if (!meshRef.current) return;

    // 1. Slow continuous passive rotation
    meshRef.current.rotation.y = t * 0.16;

    // 2. Organic floating motion
    meshRef.current.position.y = Math.sin(t * 1.4) * 0.18;

    // 3. Magnetic pull / tracking towards cursor
    const targetRotX = mouse.current.y * 0.5;
    const targetRotZ = -mouse.current.x * 0.5;
    meshRef.current.rotation.x = THREE.MathUtils.lerp(meshRef.current.rotation.x, targetRotX, 0.08);
    meshRef.current.rotation.z = THREE.MathUtils.lerp(meshRef.current.rotation.z, targetRotZ, 0.08);
  });

  return (
    <>
      <mesh
        ref={meshRef}
        castShadow
        receiveShadow
        scale={[2.1, 3.0, 2.1]}
        onClick={handlePointerDown}
        onPointerOver={handlePointerOver}
        onPointerOut={handlePointerOut}
      >
        <sphereGeometry args={[1, 64, 64]} />
        <meshPhysicalMaterial
          map={rindTexture}
          bumpMap={bumpTexture}
          bumpScale={0.022}
          roughness={0.16}
          metalness={0.02}
          clearcoat={0.8}
          clearcoatRoughness={0.12}
        />
      </mesh>

      <OrbitControls
        enableZoom={false}
        enablePan={false}
        minPolarAngle={Math.PI / 3}
        maxPolarAngle={Math.PI * 2 / 3}
      />
    </>
  );
}
