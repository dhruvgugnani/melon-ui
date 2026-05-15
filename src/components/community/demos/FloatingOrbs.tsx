"use client";

import { useRef } from "react";
import { Canvas, useFrame } from "@react-three/fiber";
import * as THREE from "three";

function FloatingOrb({
  position,
  color,
  speed,
  phase,
  radius,
}: {
  position: [number, number, number];
  color: string;
  speed: number;
  phase: number;
  radius: number;
}) {
  const meshRef = useRef<THREE.Mesh>(null);
  const t = useRef(phase);

  useFrame(() => {
    if (!meshRef.current) return;
    t.current += 0.006 * speed;
    meshRef.current.position.y = position[1] + Math.sin(t.current) * 0.4;
    meshRef.current.position.x = position[0] + Math.cos(t.current * 0.7) * 0.15;
    meshRef.current.rotation.y += 0.008;
  });

  return (
    <mesh ref={meshRef} position={position}>
      <sphereGeometry args={[radius, 32, 32]} />
      <meshStandardMaterial
        color={color}
        roughness={0.2}
        metalness={0.1}
        transparent
        opacity={0.9}
      />
    </mesh>
  );
}

const ORBS = [
  { position: [-1.4, 0, 0] as [number, number, number], color: "#ff5c71", speed: 1, phase: 0.4, radius: 0.26 },
  { position: [0, 0.6, -0.5] as [number, number, number], color: "#7fff5e", speed: 1.3, phase: 2.1, radius: 0.31 },
  { position: [1.4, -0.2, 0] as [number, number, number], color: "#e8d5b7", speed: 0.8, phase: 4.2, radius: 0.24 },
  { position: [-0.6, -0.7, 0.5] as [number, number, number], color: "#ff5c71", speed: 1.5, phase: 1.3, radius: 0.29 },
  { position: [0.8, 0.8, 0.3] as [number, number, number], color: "#7fff5e", speed: 0.9, phase: 5.1, radius: 0.27 },
];

export function FloatingOrbs() {
  return (
    <div className="w-full h-[360px] bg-[#040404]" style={{ border: "1px solid #1a1a1a" }}>
      <Canvas camera={{ position: [0, 0, 4], fov: 55 }}>
        <ambientLight intensity={0.4} />
        <pointLight position={[3, 3, 3]} intensity={1.5} color="#ff5c71" />
        <pointLight position={[-3, -2, 2]} intensity={1} color="#7fff5e" />
        {ORBS.map((orb, i) => (
          <FloatingOrb key={i} {...orb} />
        ))}
      </Canvas>
    </div>
  );
}
