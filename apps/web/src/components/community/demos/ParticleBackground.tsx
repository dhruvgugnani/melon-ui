"use client";

import { useEffect, useMemo, useRef } from "react";
import { Canvas, useFrame } from "@react-three/fiber";
import * as THREE from "three";

const PARTICLE_COUNT = 1200;
const PARTICLE_PALETTE = [
  [0.5, 1.0, 0.37],
  [1.0, 0.36, 0.44],
  [0.91, 0.84, 0.72],
];

function pseudoRandom(seed: number) {
  const value = Math.sin(seed * 12.9898 + 78.233) * 43758.5453;
  return value - Math.floor(value);
}

function createParticlePositions() {
  const arr = new Float32Array(PARTICLE_COUNT * 3);
  for (let i = 0; i < PARTICLE_COUNT * 3; i += 1) {
    arr[i] = (pseudoRandom(i + 1) - 0.5) * 8;
  }
  return arr;
}

function createParticleColors() {
  const arr = new Float32Array(PARTICLE_COUNT * 3);
  for (let i = 0; i < PARTICLE_COUNT; i += 1) {
    const c = PARTICLE_PALETTE[Math.floor(pseudoRandom(i + 4001) * PARTICLE_PALETTE.length)];
    arr[i * 3] = c[0];
    arr[i * 3 + 1] = c[1];
    arr[i * 3 + 2] = c[2];
  }
  return arr;
}

function ParticleField() {
  const meshRef = useRef<THREE.Points>(null);
  const mouse = useRef({ x: 0, y: 0 });
  const positions = useMemo(() => createParticlePositions(), []);
  const colors = useMemo(() => createParticleColors(), []);

  useEffect(() => {
    const onMove = (e: MouseEvent) => {
      mouse.current.x = (e.clientX / window.innerWidth - 0.5) * 2;
      mouse.current.y = -(e.clientY / window.innerHeight - 0.5) * 2;
    };
    window.addEventListener("mousemove", onMove);
    return () => window.removeEventListener("mousemove", onMove);
  }, []);

  useFrame(({ clock }) => {
    if (!meshRef.current) return;
    const t = clock.getElapsedTime();
    meshRef.current.rotation.y = t * 0.04 + mouse.current.x * 0.3;
    meshRef.current.rotation.x = t * 0.02 + mouse.current.y * 0.1;
  });

  return (
    <points ref={meshRef}>
      <bufferGeometry>
        <bufferAttribute
          attach="attributes-position"
          args={[positions, 3]}
        />
        <bufferAttribute
          attach="attributes-color"
          args={[colors, 3]}
        />
      </bufferGeometry>
      <pointsMaterial
        size={0.04}
        vertexColors
        transparent
        opacity={0.85}
        sizeAttenuation
      />
    </points>
  );
}

export function ParticleBackground() {
  return (
    <div className="w-full h-full min-h-[180px] bg-[#060606] relative" style={{ border: "1px solid #1a1a1a" }}>
      <Canvas camera={{ position: [0, 0, 5], fov: 60 }} style={{ width: "100%", height: "100%" }}>
        <ambientLight intensity={0.5} />
        <ParticleField />
      </Canvas>
    </div>
  );
}
