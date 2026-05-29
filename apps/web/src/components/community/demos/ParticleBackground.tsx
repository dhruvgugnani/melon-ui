"use client";

import { useEffect, useMemo, useRef } from "react";
import { Canvas, useFrame } from "@react-three/fiber";
import * as THREE from "three";

const DEFAULT_PARTICLE_COUNT = 1200;
const DEFAULT_PALETTE: [number, number, number][] = [
  [0.5, 1.0, 0.37],
  [1.0, 0.36, 0.44],
  [0.91, 0.84, 0.72],
];

function pseudoRandom(seed: number) {
  const value = Math.sin(seed * 12.9898 + 78.233) * 43758.5453;
  return value - Math.floor(value);
}

interface ParticleFieldProps {
  particleCount?: number;
  particleSize?: number;
  palette?: [number, number, number][];
}

function ParticleField({
  particleCount = DEFAULT_PARTICLE_COUNT,
  particleSize = 0.04,
  palette = DEFAULT_PALETTE,
}: ParticleFieldProps) {
  const meshRef = useRef<THREE.Points>(null);
  const mouse = useRef({ x: 0, y: 0 });

  const positions = useMemo(() => {
    const arr = new Float32Array(particleCount * 3);
    for (let i = 0; i < particleCount * 3; i += 1) {
      arr[i] = (pseudoRandom(i + 1) - 0.5) * 8;
    }
    return arr;
  }, [particleCount]);

  const colors = useMemo(() => {
    const arr = new Float32Array(particleCount * 3);
    for (let i = 0; i < particleCount; i += 1) {
      const c = palette[Math.floor(pseudoRandom(i + 4001) * palette.length)] || [1, 1, 1];
      arr[i * 3] = c[0];
      arr[i * 3 + 1] = c[1];
      arr[i * 3 + 2] = c[2];
    }
    return arr;
  }, [particleCount, palette]);

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
    const prefersReducedMotion = typeof window !== "undefined" && window.matchMedia("(prefers-reduced-motion: reduce)").matches;
    if (prefersReducedMotion) {
      meshRef.current.rotation.y = mouse.current.x * 0.3;
      meshRef.current.rotation.x = mouse.current.y * 0.1;
      return;
    }
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
        size={particleSize}
        vertexColors
        transparent
        opacity={0.85}
        sizeAttenuation
      />
    </points>
  );
}

export interface ParticleBackgroundProps extends React.ComponentPropsWithoutRef<"div"> {
  particleCount?: number;
  particleSize?: number;
  palette?: [number, number, number][];
  bg?: string;
  borderColor?: string;
  showHint?: boolean;
  hintText?: string;
}

export function ParticleBackground({
  particleCount = DEFAULT_PARTICLE_COUNT,
  particleSize = 0.04,
  palette = DEFAULT_PALETTE,
  bg = "#060606",
  borderColor = "#1a1a1a",
  showHint = true,
  hintText = "Move your mouse to interact",
  className = "",
  style,
  ...props
}: ParticleBackgroundProps) {
  return (
    <div 
      className={`w-full h-[360px] relative ${className}`}
      style={{
        backgroundColor: bg,
        border: `1px solid ${borderColor}`,
        ...style
      }}
      {...props}
    >
      <Canvas camera={{ position: [0, 0, 5], fov: 60 }}>
        <ambientLight intensity={0.5} />
        <ParticleField 
          particleCount={particleCount} 
          particleSize={particleSize} 
          palette={palette} 
        />
      </Canvas>
      {showHint && (
        <p className="text-center font-mono text-xs text-[#444] -mt-7 relative z-10 pb-4 pointer-events-none">
          {hintText}
        </p>
      )}
    </div>
  );
}
