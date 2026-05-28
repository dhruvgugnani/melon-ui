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
    timeRef.current += 0.003 * speed; // slow, premium drift
    
    // Float movement in 3D
    meshRef.current.position.y = position[1] + Math.sin(timeRef.current) * 0.45;
    meshRef.current.position.x = position[0] + Math.cos(timeRef.current * 0.7) * 0.25;
    meshRef.current.position.z = position[2] + Math.sin(timeRef.current * 0.5) * 0.15;
    
    // Slow rotational drift
    meshRef.current.rotation.y += 0.001 * speed;
    meshRef.current.rotation.x += 0.0008 * speed;
  });

  return (
    <mesh ref={meshRef} position={position}>
      <sphereGeometry args={[radius, 64, 64]} />
      {/* Premium organic morphing material with clearcoat reflection */}
      <MeshDistortMaterial
        color={color}
        distort={distort}
        speed={speed * 0.5} // Slow down material vertex animation speed
        roughness={0.25}
        metalness={0.1}
        clearcoat={0.9}
        clearcoatRoughness={0.15}
        transparent
        opacity={0.7}
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
  orbCount = 4,
  speed = 1.0,
  distort = 0.5,
  primaryColor = "#ff5c71",
  secondaryColor = "#7fff5e",
}: FloatingOrbsProps) {
  // Setup large, scattered background coordinates for morphing orbs
  const orbs = useMemo(() => {
    const list = [];
    const colors = [primaryColor, secondaryColor, "#e8d5b7"];
    for (let i = 0; i < orbCount; i++) {
      const color = colors[i % colors.length];
      
      // Position them on the side quadrants, leaving the absolute center clear for hero text
      const isLeft = i % 2 === 0;
      const x = isLeft ? -1.6 - (i * 0.2) : 1.6 + (i * 0.2);
      const y = (Math.sin(i * 1.5) - 0.2) * 1.2;
      const z = -0.5 - (i * 0.3); // place them in the depth background
      
      // Giant blob sizes
      const radius = 0.75 + Math.abs(Math.sin(i * 7)) * 0.35;
      
      list.push({
        position: [x, y, z] as [number, number, number],
        color,
        radius,
      });
    }
    return list;
  }, [orbCount, primaryColor, secondaryColor]);

  return (
    <div className="w-full h-full min-h-[350px] bg-[#030303] relative overflow-hidden" style={{ border: "1px solid #111" }}>
      {/* Background Blueprint Grid Layer */}
      <div 
        className="absolute inset-0 opacity-[0.015] pointer-events-none" 
        style={{
          backgroundImage: `
            linear-gradient(to right, #ffffff 1px, transparent 1px),
            linear-gradient(to bottom, #ffffff 1px, transparent 1px)
          `,
          backgroundSize: "36px 36px"
        }}
      />

      {/* R3F Canvas */}
      <Canvas camera={{ position: [0, 0, 3.5], fov: 50 }} style={{ width: "100%", height: "100%" }}>
        <ambientLight intensity={0.45} />
        {/* Soft points casting atmospheric lights */}
        <pointLight position={[4, 4, 3]} intensity={2.2} color={primaryColor} />
        <pointLight position={[-4, -4, 2]} intensity={1.6} color={secondaryColor} />
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

      {/* Premium grain/noise paper texture overlay to blend blobs into the dark theme */}
      <div 
        className="absolute inset-0 opacity-[0.035] pointer-events-none mix-blend-overlay"
        style={{
          backgroundImage: `url("data:image/svg+xml,%3Csvg viewBox='0 0 200 200' xmlns='http://www.w3.org/2000/svg'%3E%3Cfilter id='noiseFilter'%3E%3CfeTurbulence type='fractalNoise' baseFrequency='0.8' numOctaves='3' stitchTiles='stitch'/%3E%3C/filter%3E%3Crect width='100%25' height='100%25' filter='url(%23noiseFilter)'/%3E%3C/svg%3E")`
        }}
      />

      {/* Dark Vignette shading to keep middle text highly legible */}
      <div className="absolute inset-0 bg-[radial-gradient(circle_at_center,transparent_30%,#030303_95%)] pointer-events-none z-10" />
    </div>
  );
}
