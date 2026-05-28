"use client";

import { useRef, useMemo } from "react";
import { Canvas, useFrame } from "@react-three/fiber";
import { MeshDistortMaterial } from "@react-three/drei";
import * as THREE from "three";

interface FloatingOrbProps {
  position: [number, number, number];
  color: string;
  speed: number;
  distort: number;
  radius: number;
}

function FloatingOrb({
  position,
  color,
  speed,
  distort,
  radius,
}: FloatingOrbProps) {
  const meshRef = useRef<THREE.Mesh>(null);
  const timeRef = useRef(Math.random() * 100);

  useFrame((state) => {
    if (!meshRef.current) return;
    timeRef.current += 0.005 * speed;
    
    // Smooth floating position using sine waves
    meshRef.current.position.y = position[1] + Math.sin(timeRef.current) * 0.35;
    meshRef.current.position.x = position[0] + Math.cos(timeRef.current * 0.7) * 0.15;
    meshRef.current.position.z = position[2] + Math.sin(timeRef.current * 0.5) * 0.1;
    
    // Slow rotation
    meshRef.current.rotation.y += 0.003 * speed;
    meshRef.current.rotation.x += 0.002 * speed;
  });

  return (
    <mesh ref={meshRef} position={position}>
      <sphereGeometry args={[radius, 64, 64]} />
      <MeshDistortMaterial
        color={color}
        distort={distort}
        speed={speed}
        roughness={0.15}
        metalness={0.2}
        clearcoat={1}
        clearcoatRoughness={0.1}
      />
    </mesh>
  );
}

export interface FloatingOrbsProps {
  orbCount?: number;
  speed?: number;
  distort?: number;
  primaryColor?: string;
  secondaryColor?: string;
}

export function FloatingOrbs({
  orbCount = 5,
  speed = 1.5,
  distort = 0.45,
  primaryColor = "#ff5c71",
  secondaryColor = "#7fff5e",
}: FloatingOrbsProps) {
  // Generate random stable coordinates for the orbs based on count
  const orbs = useMemo(() => {
    const list = [];
    const colors = [primaryColor, secondaryColor, "#e8d5b7"];
    for (let i = 0; i < orbCount; i++) {
      // Alternate colors
      const color = colors[i % colors.length];
      
      // Position calculation to scatter them nicely in a [-2, 2] boundary
      const x = orbCount > 1 ? (((i / (orbCount - 1)) - 0.5) * 3.2) : 0; 
      const y = Math.sin(i * 1.7) * 0.8;
      const z = Math.cos(i * 2.3) * 0.3;
      
      // Varying sizes
      const radius = 0.22 + Math.abs(Math.sin(i * 9)) * 0.12;
      
      list.push({
        position: [x, y, z] as [number, number, number],
        color,
        radius,
      });
    }
    return list;
  }, [orbCount, primaryColor, secondaryColor]);

  return (
    <div className="w-full h-full min-h-[300px] bg-[#040404] relative overflow-hidden" style={{ border: "1px solid #111" }}>
      <div className="absolute inset-0 bg-[radial-gradient(circle_at_center,rgba(255,92,113,0.03),transparent_70%)] pointer-events-none" />
      <Canvas camera={{ position: [0, 0, 3], fov: 50 }} style={{ width: "100%", height: "100%" }}>
        <ambientLight intensity={0.4} />
        <pointLight position={[3, 3, 3]} intensity={1.8} color={primaryColor} />
        <pointLight position={[-3, -3, 2]} intensity={1.2} color={secondaryColor} />
        {orbs.map((orb, i) => (
          <FloatingOrb
            key={i}
            position={orb.position}
            color={orb.color}
            speed={speed}
            distort={distort}
            radius={orb.radius}
          />
        ))}
      </Canvas>
    </div>
  );
}
