"use client";

import { useRef, useMemo } from "react";
import { Canvas, useFrame } from "@react-three/fiber";
import { OrbitControls } from "@react-three/drei";
import * as THREE from "three";

function Orb({ position, color, speed, size }: { position: [number, number, number]; color: string; speed: number; size: number }) {
  const meshRef = useRef<THREE.Mesh>(null);

  useFrame((state) => {
    if (!meshRef.current) return;
    const prefersReducedMotion = typeof window !== "undefined" && window.matchMedia("(prefers-reduced-motion: reduce)").matches;
    if (prefersReducedMotion) {
      meshRef.current.position.y = position[1];
      meshRef.current.position.x = position[0];
      return;
    }
    const t = state.clock.getElapsedTime() * speed;
    meshRef.current.position.y = position[1] + Math.sin(t) * 0.4;
    meshRef.current.position.x = position[0] + Math.cos(t * 0.8) * 0.2;
  });

  return (
    <mesh ref={meshRef} position={position}>
      <sphereGeometry args={[size, 32, 32]} />
      <meshStandardMaterial color={color} roughness={0.1} metalness={0.1} emissive={color} emissiveIntensity={0.2} />
    </mesh>
  );
}

function OrbsScene() {
  const orbs = useMemo(() => [
    { position: [-1.8, 0.5, 0] as [number, number, number], color: "#ff5c71", speed: 1.2, size: 0.6 },
    { position: [1.8, -0.5, 0.5] as [number, number, number], color: "#7fff5e", speed: 0.9, size: 0.8 },
    { position: [0, 1.2, -1] as [number, number, number], color: "#e8d5b7", speed: 1.5, size: 0.5 },
    { position: [-0.5, -1.2, -0.5] as [number, number, number], color: "#ff5c71", speed: 1.0, size: 0.4 },
    { position: [1.0, 1.0, 0.2] as [number, number, number], color: "#7fff5e", speed: 1.3, size: 0.5 },
  ], []);

  return (
    <>
      <ambientLight intensity={0.2} />
      <directionalLight position={[2, 4, 3]} intensity={1.5} />
      <pointLight position={[-3, 3, 2]} color="#ff5c71" intensity={2} distance={8} />
      <pointLight position={[3, -3, 2]} color="#7fff5e" intensity={2} distance={8} />
      
      {orbs.map((orb, i) => (
        <Orb key={i} {...orb} />
      ))}
      <OrbitControls enableZoom={false} enablePan={false} />
    </>
  );
}

export function FloatingOrbs() {
  return (
    <div className="w-full h-[360px] bg-[#060606]" style={{ border: "1px solid #1a1a1a" }}>
      <Canvas camera={{ position: [0, 0, 5], fov: 60 }}>
        <OrbsScene />
      </Canvas>
    </div>
  );
}
