"use client";

import React, { useRef, useMemo, useState, useEffect } from "react";
import { Canvas, useFrame, useThree } from "@react-three/fiber";
import * as THREE from "three";

interface ParticlesProps {
  count?: number;
  particleColor?: string;
  particleSize?: number;
  glowIntensity?: number;
}

const Particles: React.FC<ParticlesProps> = ({
  count = 500,
  particleColor = "#7fff5e",
  particleSize = 0.08,
  glowIntensity = 1.5
}) => {
  const mesh = useRef<THREE.InstancedMesh>(null);
  const { mouse, viewport } = useThree();
  const [dummy] = useState(() => new THREE.Object3D());

  // Generate initial random particle positions
  const particles = useMemo(() => {
    const temp = [];
    for (let i = 0; i < count; i++) {
      // Deterministic math logic for SSR compatibility
      const x = (Math.sin(i * 12.3) * 2 - 1) * 10;
      const y = (Math.cos(i * 45.6) * 2 - 1) * 10;
      const z = (Math.sin(i * 78.9) * 2 - 1) * 5 - 2;
      const velocity = new THREE.Vector3(0, 0, 0);
      const originalPosition = new THREE.Vector3(x, y, z);
      temp.push({ position: new THREE.Vector3(x, y, z), velocity, originalPosition });
    }
    return temp;
  }, [count]);

  useFrame(() => {
    if (!mesh.current) return;

    // Convert normalized mouse coordinates to world coordinates
    const targetX = (mouse.x * viewport.width) / 2;
    const targetY = (mouse.y * viewport.height) / 2;
    const mouseVector = new THREE.Vector3(targetX, targetY, 0);

    particles.forEach((particle, i) => {
      if (i >= count) return;
      // Calculate distance to mouse
      const distance = particle.position.distanceTo(mouseVector);

      // Magnetic attraction force
      if (distance < 5) {
        const force = mouseVector.clone().sub(particle.position).normalize().multiplyScalar(0.05);
        particle.velocity.add(force);
      }

      // Spring force returning to original position
      const springForce = particle.originalPosition.clone().sub(particle.position).multiplyScalar(0.02);
      particle.velocity.add(springForce);

      // Apply friction/damping
      particle.velocity.multiplyScalar(0.92);

      // Update position
      particle.position.add(particle.velocity);

      // Update instance matrix
      dummy.position.copy(particle.position);

      // Rotate based on velocity for dynamic feel
      dummy.rotation.x += particle.velocity.y * 0.1;
      dummy.rotation.y += particle.velocity.x * 0.1;

      // Scale based on proximity
      const scale = distance < 3 ? 1.5 : 1;
      dummy.scale.setScalar(scale);

      dummy.updateMatrix();
      mesh.current!.setMatrixAt(i, dummy.matrix);
    });

    mesh.current.instanceMatrix.needsUpdate = true;
  });

  return (
    <instancedMesh ref={mesh} args={[null as any, null as any, count]}>
      {/* Small glowing tetrahedrons/diamonds */}
      <octahedronGeometry args={[particleSize, 0]} />
      <meshPhysicalMaterial
        color={particleColor}
        emissive={particleColor}
        emissiveIntensity={glowIntensity}
        transparent
        opacity={0.8}
        wireframe
      />
    </instancedMesh>
  );
};

export interface MagneticParticleFieldProps extends React.ComponentPropsWithoutRef<"div"> {
  particleCount?: number;
  particleColor?: string;
  particleSize?: number;
  glowIntensity?: number;
  bg?: string;
  titleText?: string;
  eyebrowText?: string;
  showCard?: boolean;
}

export const MagneticParticleField: React.FC<MagneticParticleFieldProps> = ({
  particleCount = 500,
  particleColor = "#7fff5e",
  particleSize = 0.08,
  glowIntensity = 1.5,
  bg = "#050505",
  titleText = "",
  eyebrowText = "",
  showCard = false,
  className = "",
  style,
  children,
  ...props
}) => {
  const [mounted, setMounted] = useState(false);

  useEffect(() => {
    setMounted(true);
  }, []);

  if (!mounted) {
    return (
      <div 
        className={`relative w-full h-[600px] overflow-hidden rounded-xl ${className}`}
        style={{ backgroundColor: bg, ...style }}
        {...props}
      />
    );
  }

  return (
    <div
      className={`relative w-full h-[600px] overflow-hidden rounded-xl ${className}`}
      style={{
        backgroundColor: bg,
        ...style
      }}
      {...props}
    >
      <div className="absolute inset-0 z-0 pointer-events-none">
        <Canvas camera={{ position: [0, 0, 15], fov: 45 }}>
          <ambientLight intensity={0.5} />
          <Particles 
            count={particleCount}
            particleColor={particleColor}
            particleSize={particleSize}
            glowIntensity={glowIntensity}
          />
        </Canvas>
      </div>

      {/* Optional Foreground Card or Custom Children */}
      {children ? (
        <div className="absolute inset-0 z-10 flex items-center justify-center pointer-events-none">
          <div className="pointer-events-auto">{children}</div>
        </div>
      ) : showCard || titleText ? (
        <div className="absolute inset-0 z-10 pointer-events-none flex items-center justify-center">
          <div className="p-8 rounded-2xl bg-black/40 backdrop-blur-sm border border-white/10 flex flex-col items-center shadow-[0_0_50px_rgba(127,255,94,0.1)] pointer-events-auto">
             {titleText && (
               <h2 className="text-4xl md:text-5xl font-black text-white uppercase tracking-tighter mb-2" style={{ fontFamily: "var(--font-londrina-solid)" }}>
                {titleText}
              </h2>
             )}
             {eyebrowText && (
              <p className="text-[#7fff5e] font-mono text-xs uppercase tracking-widest" style={{ color: particleColor }}>
                {eyebrowText}
              </p>
             )}
          </div>
        </div>
      ) : null}
    </div>
  );
};