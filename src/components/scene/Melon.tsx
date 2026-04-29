"use client";

import { useMemo, useRef, useState, useEffect } from "react";
import { useFrame } from "@react-three/fiber";
import * as THREE from "three";
import gsap from "gsap";
import { ScrollTrigger } from "gsap/ScrollTrigger";
import { useGSAP } from "@gsap/react";

gsap.registerPlugin(ScrollTrigger);

// Pre-computed polar coordinates for the seed distribution
const seedsRaw = [
  { x: 20, y: 30 }, { x: -30, y: 10 }, { x: 10, y: -40 },
  { x: -20, y: -20 }, { x: 40, y: -10 }, { x: -10, y: 50 },
  { x: -50, y: -30 }, { x: 30, y: 15 }, { x: -40, y: 35 },
  { x: 0, y: -10 }, { x: 15, y: -50 }, { x: 45, y: -35 },
  { x: -25, y: 60 }, { x: 50, y: 40 }
];
const seedsPolar = seedsRaw.map(s => ({
  r: Math.sqrt(s.x * s.x + s.y * s.y),
  theta: Math.atan2(s.y, s.x)
}));

export function Melon() {
  const groupRef = useRef<THREE.Group>(null);
  const idleGroupRef = useRef<THREE.Group>(null);
  const topHalfRef = useRef<THREE.Group>(null);
  const bottomHalfRef = useRef<THREE.Group>(null);
  const katanaRef = useRef<THREE.Group>(null);
  const splashGroupRef = useRef<THREE.Group>(null); // Independent group for splashes so they don't orbit!
  const idleSpeed = useRef({ val: 0.1 });
  const [scale, setScale] = useState(1);
  const [segments, setSegments] = useState(64);

  // Physically accurate Anime Teardrop geometry (Fat head at +X, Pointy tail at -X)
  const teardropShape = useMemo(() => {
    const shape = new THREE.Shape();
    shape.moveTo(-1, 0); // Pointy tail
    shape.bezierCurveTo(-0.2, 0.4, 0.5, 0.6, 0.5, 0); // Top curve
    shape.bezierCurveTo(0.5, -0.6, -0.2, -0.4, -1, 0); // Bottom curve
    return shape;
  }, []);

  // Responsive scale setup
  useEffect(() => {
    const handleResize = () => {
      setScale(window.innerWidth < 768 ? 0.7 : 1);
      setSegments(window.innerWidth < 768 ? 32 : 64);
    };
    
    setTimeout(handleResize, 100);
    window.addEventListener("resize", handleResize, { passive: true });
    return () => window.removeEventListener("resize", handleResize);
  }, []);

  const texture = useMemo(() => {
    const canvas = document.createElement("canvas");
    canvas.width = 1024;
    canvas.height = 512;
    const ctx = canvas.getContext("2d");
    if (ctx) {
      ctx.fillStyle = "#5c8a4d";
      ctx.fillRect(0, 0, 1024, 512);
      
      const stripes = 12;
      for (let i = 0; i < stripes; i++) {
        let startX = (i * 1024) / stripes;
        [-1024, 0, 1024].forEach(offset => {
          ctx.beginPath();
          for (let y = 0; y <= 512; y += 5) {
            const wave1 = Math.sin(y * 0.05) * 15;
            const wave2 = Math.sin(y * 0.1 + i) * 10;
            const x = startX + offset + wave1 + wave2;
            if (y === 0) ctx.moveTo(x, y);
            else ctx.lineTo(x, y);
          }
          ctx.lineWidth = 20;
          ctx.lineCap = "round";
          ctx.lineJoin = "round";
          ctx.strokeStyle = "#23401c";
          ctx.stroke();
          
          ctx.beginPath();
          for (let y = 0; y <= 512; y += 5) {
            const wave1 = Math.sin(y * 0.05) * 15;
            const wave2 = Math.sin(y * 0.1 + i) * 10;
            const x = startX + offset + wave1 + wave2 + 15;
            if (y === 0) ctx.moveTo(x, y);
            else ctx.lineTo(x, y);
          }
          ctx.lineWidth = 6;
          ctx.stroke();
        });
      }
    }
    const tex = new THREE.CanvasTexture(canvas);
    tex.wrapS = THREE.RepeatWrapping;
    tex.anisotropy = 16;
    return tex;
  }, []);

  const innerTexture = useMemo(() => {
    const canvas = document.createElement("canvas");
    canvas.width = 512;
    canvas.height = 512;
    const ctx = canvas.getContext("2d");
    if (ctx) {
      // Spongy Red Flesh Base with White Rind Transition
      const grad = ctx.createRadialGradient(256, 256, 0, 256, 256, 256);
      grad.addColorStop(0, "#e62e45");
      grad.addColorStop(0.7, "#ff475e");
      grad.addColorStop(0.9, "#f5aeb8");
      grad.addColorStop(0.95, "#e0f2dc");
      grad.addColorStop(1, "#2e4a25");
      
      ctx.fillStyle = grad;
      ctx.fillRect(0, 0, 512, 512);

      // Noise generator for spongy texture
      ctx.fillStyle = "rgba(255,255,255,0.06)";
      for (let i = 0; i < 20000; i++) {
        const x = Math.random() * 512;
        const y = Math.random() * 512;
        const r = Math.sqrt((x-256)**2 + (y-256)**2);
        if (r < 230) ctx.fillRect(x, y, 2, 2);
      }
      ctx.fillStyle = "rgba(100,0,0,0.06)";
      for (let i = 0; i < 20000; i++) {
        const x = Math.random() * 512;
        const y = Math.random() * 512;
        const r = Math.sqrt((x-256)**2 + (y-256)**2);
        if (r < 230) ctx.fillRect(x, y, 2, 2);
      }
    }
    return new THREE.CanvasTexture(canvas);
  }, []);

  const seeds3D = useMemo(() => {
    const seeds = [];
    for(let i = 0; i < 45; i++) {
      const angle = Math.random() * Math.PI * 2;
      const r = 0.2 + Math.random() * 1.5; // Radius up to 1.7 inside the 2.0 sphere
      const x = Math.cos(angle) * r;
      const y = Math.sin(angle) * r;
      seeds.push({ position: [x, y, 0.01], rotation: [0, 0, angle + Math.PI/2] });
    }
    return seeds;
  }, []);

  const bladeTexture = useMemo(() => {
    const canvas = document.createElement("canvas");
    canvas.width = 512;
    canvas.height = 128;
    const ctx = canvas.getContext("2d");
    if (ctx) {
      ctx.fillStyle = "#a0a0a0";
      ctx.fillRect(0, 0, 512, 128);
      ctx.fillStyle = "#b0b0b0";
      for (let i = 0; i < 200; i++) {
        ctx.fillRect(Math.random() * 512, Math.random() * 128, Math.random() * 50 + 10, 1);
      }
      ctx.beginPath();
      ctx.moveTo(0, 128);
      for (let x = 0; x <= 512; x += 10) {
        ctx.lineTo(x, 100 + Math.sin(x * 0.05) * 10 + Math.random() * 5);
      }
      ctx.lineTo(512, 128);
      ctx.fillStyle = "#d0d0d0";
      ctx.fill();
    }
    return new THREE.CanvasTexture(canvas);
  }, []);

  const dropletsData = useMemo(() => {
    // Mixed Artistic Splash: 24 manga streaks + 12 round droplets
    return Array.from({ length: 36 }).map((_, i) => {
      const isStreak = i < 24;
      const angle = isStreak ? (Math.PI * 2 / 24) * i : Math.random() * Math.PI * 2;
      
      let speed = 12;
      let scale = 0.3;
      
      if (isStreak) {
        // Fixed starburst for streaks (reduced scale for finer, sharper lines)
        const lengthType = i % 3;
        if (lengthType === 0) { speed = 22; scale = 0.25; }
        else if (lengthType === 1) { speed = 10; scale = 0.1; }
        else { speed = 16; scale = 0.15; }
      } else {
        // Random distribution for droplets (much smaller, subtle droplets)
        speed = Math.random() * 8 + 4;
        scale = Math.random() * 0.08 + 0.05;
      }

      const targetX = Math.cos(angle) * speed;
      let targetY = Math.sin(angle) * speed * 0.5; // Flatten explosion
      
      if (!isStreak) {
        targetY -= 2; // Drops fall slightly more
      }

      // Calculate display angle AFTER gravity offset so teardrops align flawlessly with their trajectory!
      const displayAngle = Math.atan2(targetY, targetX);

      return {
        isStreak,
        angle: displayAngle,
        // Z=1 places them IN FRONT of the melon (which is at Z=0)
        position: [
          isStreak ? 0 : (Math.random() - 0.5), 
          isStreak ? 0 : (Math.random() - 0.5), 
          1 
        ] as [number, number, number],
        targetX,
        targetY,
        targetZ: 1.5, // Fly slightly towards camera
        scale
      };
    });
  }, []);
  const dropletsRefs = useRef<(THREE.Mesh | null)[]>([]);

  const handleTexture = useMemo(() => {
    const canvas = document.createElement("canvas");
    canvas.width = 128;
    canvas.height = 128;
    const ctx = canvas.getContext("2d");
    if (ctx) {
      ctx.fillStyle = "#8b0000";
      ctx.fillRect(0, 0, 128, 128);
      ctx.strokeStyle = "#1a1a1a";
      ctx.lineWidth = 12;
      for (let i = -128; i < 256; i += 32) {
        ctx.beginPath(); ctx.moveTo(i, 0); ctx.lineTo(i + 128, 128); ctx.stroke();
        ctx.beginPath(); ctx.moveTo(i + 128, 0); ctx.lineTo(i, 128); ctx.stroke();
      }
    }
    const tex = new THREE.CanvasTexture(canvas);
    tex.wrapS = THREE.RepeatWrapping;
    tex.wrapT = THREE.RepeatWrapping;
    tex.repeat.set(5, 1);
    return tex;
  }, []);

  useGSAP(() => {
    if (!groupRef.current || !idleGroupRef.current || !topHalfRef.current || !bottomHalfRef.current || !katanaRef.current || !splashGroupRef.current) return;

    setTimeout(() => {
      const masterTl = gsap.timeline({
        scrollTrigger: {
          trigger: "#scroll-content",
          scroller: "#snap-container",
          start: "top top",
          end: "bottom bottom",
          scrub: 1,
        }
      });

      masterTl.to(groupRef.current!.rotation, {
        x: Math.PI / 2,
        y: Math.PI * 2 - Math.PI / 12,
        z: Math.PI * 2,
        ease: "power1.inOut", 
        duration: 1.625
      }, 0);

      masterTl.to(groupRef.current!.rotation, {
        x: Math.PI,
        y: Math.PI * 3,
        z: Math.PI * 3,
        ease: "power1.inOut",
        duration: 1.375
      }, 1.625);

      masterTl.to(idleGroupRef.current!.rotation, {
        y: Math.PI * 4,
        ease: "none",
        duration: 3.0
      }, 0);

      masterTl.to([groupRef.current!.position, splashGroupRef.current!.position], {
        y: -1,
        ease: "power1.inOut",
        duration: 1
      }, 0);

      katanaRef.current!.position.set(15, 10, 0);
      katanaRef.current!.rotation.set(0, 0, Math.PI / 4);

      masterTl.to(katanaRef.current!.position, { x: 8, y: 3, ease: "power2.out", duration: 0.35 }, 1.0)
            .to(katanaRef.current!.rotation, { z: -Math.PI / 12, ease: "power2.out", duration: 0.35 }, 1.0);

      masterTl.to(katanaRef.current!.position, { x: -8, y: -3, ease: "none", duration: 0.55 }, 1.35)
            .to(katanaRef.current!.rotation, { z: -Math.PI / 6, ease: "none", duration: 0.55 }, 1.35);

      masterTl.to(topHalfRef.current!.position, { z: 12, y: 4, x: -2, ease: "power2.in", duration: 0.375 }, 1.625)
            .to(topHalfRef.current!.rotation, { x: Math.PI, y: Math.PI / 4, z: -Math.PI / 12, ease: "none", duration: 0.375 }, 1.625)
            .to(topHalfRef.current!.scale, { x: 0, y: 0, z: 0, duration: 0.01 }, 2.0);

      // Mixed Artistic Splash!
      dropletsData.forEach((drop, i) => {
        const mesh = dropletsRefs.current[i];
        if (mesh) {
          // Start exactly at 0 so they don't pop in as thick blobs!
          masterTl.set(mesh.scale, { x: 0, y: 0, z: 0 }, 1.625)
                .to(mesh.position, { x: drop.targetX, y: drop.targetY, z: drop.targetZ, duration: 1.375, ease: "power3.out" }, 1.625);

          if (drop.isStreak) {
            // Smoothly grow into sharp, thin lines
            masterTl.to(mesh.scale, { x: drop.scale * 6, y: drop.scale * 0.15, z: drop.scale * 0.15, duration: 0.2, ease: "power4.out" }, 1.625);
          } else {
            // Smoothly pop into elongated anime teardrops! (Stretched in direction of travel)
            masterTl.to(mesh.scale, { x: drop.scale * 2.5, y: drop.scale * 0.8, z: drop.scale * 0.8, duration: 0.3, ease: "back.out(2)" }, 1.625);
          }

          masterTl.to(mesh.scale, { x: 0, y: 0, z: 0, duration: 1.175, ease: "power2.inOut" }, 1.825); // Shrink and disappear
        }
      });

      masterTl.to(katanaRef.current!.position, { x: -15, y: -5, ease: "power2.in", duration: 0.1 }, 1.9);

      masterTl.to(groupRef.current!.position, { y: -1, duration: 1 }, 2.0);

      ScrollTrigger.refresh();
    }, 100);
  }, { dependencies: [] });

  useFrame((state, delta) => {
    if (idleGroupRef.current) {
      const pos = new THREE.Vector3();
      groupRef.current?.getWorldPosition(pos);

      const center = pos.clone();
      center.project(state.camera);
      
      const x = (center.x * 0.5 + 0.5) * window.innerWidth;
      const y = (-(center.y * 0.5) + 0.5) * window.innerHeight;
      
      const edge = pos.clone();
      edge.x += 2 * scale;
      edge.project(state.camera);
      const edgeX = (edge.x * 0.5 + 0.5) * window.innerWidth;
      const r = Math.abs(edgeX - x) * 1.05;

      document.documentElement.style.setProperty('--melon-x', `${x}px`);
      document.documentElement.style.setProperty('--melon-y', `${y}px`);
      document.documentElement.style.setProperty('--melon-r', `${r}px`);
      document.documentElement.style.setProperty('--melon-r-80', `${r * 0.8}px`);
      document.documentElement.style.setProperty('--melon-r-90', `${r * 0.9}px`);
      
      const worldQuat = new THREE.Quaternion();
      idleGroupRef.current.getWorldQuaternion(worldQuat);
      const euler = new THREE.Euler().setFromQuaternion(worldQuat, 'YXZ');
      
      const angleRad = (euler.y + euler.x - euler.z);
      
      seedsPolar.forEach((seed, i) => {
        const rScaled = seed.r * (r / 100);
        const sX = rScaled * Math.cos(seed.theta + angleRad);
        const sY = rScaled * Math.sin(seed.theta + angleRad);
        
        document.documentElement.style.setProperty(`--s${i}x`, `${sX}px`);
        document.documentElement.style.setProperty(`--s${i}y`, `${sY}px`);
      });
    }
  });

  return (
    <>
      {/* 3D Katana */}
      <group ref={katanaRef} scale={scale * 1.2}>
        {/* Blade */}
        <mesh position={[-3, 0, 0]}>
          <boxGeometry args={[10, 0.05, 0.2]} />
          <meshStandardMaterial map={bladeTexture} metalness={1} roughness={0.1} />
        </mesh>
        
        {/* Glowing Edge */}
        <mesh position={[-3, 0.03, 0]}>
          <boxGeometry args={[10, 0.02, 0.05]} />
          <meshStandardMaterial color="#ffffff" emissive="#00ffcc" emissiveIntensity={3} toneMapped={false} />
        </mesh>

        {/* Tsuba (Guard) */}
        <mesh position={[2, 0, 0]} rotation={[0, 0, Math.PI / 2]}>
          <cylinderGeometry args={[0.35, 0.35, 0.1, 16]} />
          <meshStandardMaterial color="#ffd700" metalness={0.9} roughness={0.2} />
        </mesh>

        {/* Tsuka (Handle) */}
        <mesh position={[3, 0, 0]} rotation={[0, 0, Math.PI / 2]}>
          <cylinderGeometry args={[0.15, 0.15, 2, 16]} />
          <meshStandardMaterial map={handleTexture} roughness={0.7} />
        </mesh>
        
        {/* Kashira (Pommel) */}
        <mesh position={[4.05, 0, 0]} rotation={[0, 0, Math.PI / 2]}>
          <cylinderGeometry args={[0.16, 0.16, 0.2, 16]} />
          <meshStandardMaterial color="#ffd700" metalness={0.9} roughness={0.2} />
        </mesh>
      </group>

      {/* The Rotating Melon */}
      <group ref={groupRef} scale={scale}>
        <group ref={idleGroupRef}>
          {/* TOP HALF */}
          <group ref={topHalfRef} position-y={-0.01}>
            {/* Rind Hemisphere */}
            <mesh>
              <sphereGeometry args={[2, segments, segments / 2, 0, Math.PI * 2, 0, Math.PI / 2]} />
              <meshStandardMaterial map={texture} roughness={0.7} metalness={0.1} />
            </mesh>
            {/* Inner Flesh Cap */}
            <mesh rotation-x={Math.PI / 2} position-y={0.005}>
              <circleGeometry args={[2, segments]} />
              <meshStandardMaterial map={innerTexture} bumpMap={innerTexture} bumpScale={0.05} roughness={0.5} />
            </mesh>
          </group>

          {/* BOTTOM HALF */}
          <group ref={bottomHalfRef} position-y={0.01}>
            {/* Rind Hemisphere */}
            <mesh>
              <sphereGeometry args={[2, segments, segments / 2, 0, Math.PI * 2, Math.PI / 2, Math.PI / 2]} />
              <meshStandardMaterial map={texture} roughness={0.7} metalness={0.1} />
            </mesh>
            {/* Inner Flesh Cap */}
            <mesh rotation-x={-Math.PI / 2} position-y={-0.005}>
              <circleGeometry args={[2, segments]} />
              <meshStandardMaterial map={innerTexture} bumpMap={innerTexture} bumpScale={0.1} roughness={0.7} />
              {/* 3D Seeds for true physical depth */}
              {seeds3D.map((s, i) => (
                <mesh key={i} position={[s.position[0], s.position[1], s.position[2]]} rotation={[s.rotation[0], s.rotation[1], s.rotation[2]]} scale={[1, 1.8, 0.4]}>
                  <sphereGeometry args={[0.04, 8, 8]} />
                  <meshStandardMaterial color="#1a0a05" roughness={0.2} metalness={0.1} />
                </mesh>
              ))}
            </mesh>
          </group>
        </group>
      </group>

      {/* 2D Fixed Starburst Splashes - INDEPENDENT FROM MELON ROTATION! */}
      <group ref={splashGroupRef} scale={scale}>
        {dropletsData.map((drop, i) => (
          <mesh 
            key={`drop-${i}`} 
            ref={(el) => { if (el) dropletsRefs.current[i] = el; }} 
            position={drop.position}
            rotation={[0, 0, drop.angle]}
            scale={0}
          >
            {drop.isStreak ? (
              <circleGeometry args={[1, 16]} />
            ) : (
              <shapeGeometry args={[teardropShape]} />
            )}
            <meshBasicMaterial color="#d92027" transparent opacity={0.8} />
          </mesh>
        ))}
      </group>
    </>
  );
}
