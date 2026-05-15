"use client";

import { useEffect, useRef } from "react";
import { Canvas, useFrame, useThree } from "@react-three/fiber";
import * as THREE from "three";

function ParticleField() {
  const meshRef = useRef<THREE.Points>(null);
  const mouse = useRef({ x: 0, y: 0 });
  const count = 1200;

  // Generate random particle positions
  const positions = useRef(() => {
    const arr = new Float32Array(count * 3);
    for (let i = 0; i < count * 3; i++) {
      arr[i] = (Math.random() - 0.5) * 8;
    }
    return arr;
  });

  const colors = useRef(() => {
    const arr = new Float32Array(count * 3);
    const palette = [
      [0.5, 1.0, 0.37], // #7fff5e leaf green
      [1.0, 0.36, 0.44], // #ff5c71 melon red
      [0.91, 0.84, 0.72], // #e8d5b7 sand
    ];
    for (let i = 0; i < count; i++) {
      const c = palette[Math.floor(Math.random() * palette.length)];
      arr[i * 3] = c[0];
      arr[i * 3 + 1] = c[1];
      arr[i * 3 + 2] = c[2];
    }
    return arr;
  });

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
          args={[positions.current(), 3]}
        />
        <bufferAttribute
          attach="attributes-color"
          args={[colors.current(), 3]}
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
    <div className="w-full h-[360px] bg-[#060606]" style={{ border: "1px solid #1a1a1a" }}>
      <Canvas camera={{ position: [0, 0, 5], fov: 60 }}>
        <ambientLight intensity={0.5} />
        <ParticleField />
      </Canvas>
      <p className="text-center font-mono text-xs text-[#444] -mt-7 relative z-10 pb-4">
        Move your mouse to interact
      </p>
    </div>
  );
}
