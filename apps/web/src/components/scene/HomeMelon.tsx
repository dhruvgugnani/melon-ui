"use client";

import { useMemo, useRef } from "react";
import { useFrame } from "@react-three/fiber";
import * as THREE from "three";
import { OrbitControls } from "@react-three/drei";

export function HomeMelon() {
  const meshRef = useRef<THREE.Mesh>(null);

  // Procedural watermelon stripe texture
  const texture = useMemo(() => {
    const canvas = document.createElement("canvas");
    canvas.width = 1024;
    canvas.height = 512;
    const ctx = canvas.getContext("2d");
    if (ctx) {
      // Base green shell
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

  // Frame loop for organic floating and rotation
  useFrame((state) => {
    const t = state.clock.getElapsedTime();
    if (meshRef.current) {
      // Continuous slow rotation
      meshRef.current.rotation.y = t * 0.15;
      meshRef.current.rotation.x = Math.sin(t * 0.4) * 0.08;
      // Slight floating motion
      meshRef.current.position.y = Math.sin(t * 1.2) * 0.15;
    }
  });

  return (
    <>
      <mesh
        ref={meshRef}
        castShadow
        receiveShadow
        scale={[2.2, 2.7, 2.2]}
      >
        <sphereGeometry args={[1, 64, 64]} />
        <meshPhysicalMaterial
          map={texture}
          roughness={0.24}
          metalness={0.1}
          clearcoat={0.6}
          clearcoatRoughness={0.15}
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
