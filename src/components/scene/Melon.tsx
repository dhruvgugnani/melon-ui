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
  const idleSpeed = useRef({ val: 0.1 });
  const [scale, setScale] = useState(1);
  const [segments, setSegments] = useState(64);

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
    return Array.from({ length: 30 }).map(() => ({
      position: [(Math.random() - 0.5) * 0.5, (Math.random() - 0.5) * 0.5, (Math.random() - 0.5) * 0.5] as [number, number, number],
      scale: Math.random() * 0.08 + 0.02,
      target: [
        (Math.random() - 0.5) * 12, // Explode outwards X
        (Math.random() - 0.5) * 12, // Towards/Away Z
        -(Math.random() * 10 + 4)   // Explode UPWARDS! (Negative local Z)
      ]
    }));
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
    if (!groupRef.current || !idleGroupRef.current || !topHalfRef.current || !bottomHalfRef.current || !katanaRef.current) return;

    setTimeout(() => {
      // MASTER SCROLL TIMELINE
      // This entirely eliminates GSAP overwrite conflicts by putting all sequences 
      // into a single flawlessly scrubbable timeline attached to the whole page!
      const masterTl = gsap.timeline({
        scrollTrigger: {
          trigger: "#scroll-content",
          scroller: "#snap-container",
          start: "top top",
          end: "bottom bottom",
          scrub: 1,
        }
      });

      // SECTION 1 & 2: EXPLICIT DETERMINISTIC TUMBLE
      // We break the 3.0 continuous tumble into two explicit tweens that meet exactly at t=1.625.
      // This forces GSAP to hit the exact Euler angles at the moment of the slice without any interpolation drift.
      
      masterTl.to(groupRef.current!.rotation, {
        x: Math.PI / 2, // Exactly 90 degrees pitch (local Y points at camera)
        y: Math.PI * 2 - Math.PI / 12, // Exactly 1 full roll minus 15 degrees to match Katana
        z: Math.PI * 2, // Exactly 1 full yaw (0 relative). RED FACE IS LOCKED TO CAMERA!
        ease: "power1.inOut", 
        duration: 1.625
      }, 0);

      // Continue tumbling after the slice so it feels alive and organic!
      masterTl.to(groupRef.current!.rotation, {
        x: Math.PI,
        y: Math.PI * 3,
        z: Math.PI * 3,
        ease: "power1.inOut",
        duration: 1.375 // Remaining time (3.0 - 1.625)
      }, 1.625);

      // Deterministic Idle Spin: Spin continuously for the entire 3.0 duration
      masterTl.to(idleGroupRef.current!.rotation, {
        y: Math.PI * 4,
        ease: "none",
        duration: 3.0
      }, 0);

      // Hero -> Showcase position drop
      masterTl.to(groupRef.current!.position, {
        y: -1,
        ease: "power1.inOut",
        duration: 1
      }, 0);

      // SECTION 2: SHOWCASE -> FEATURES (50% to 100% of page scroll)
      // These animations start at time 1.0 on the master timeline

      // Reset initial states for Katana so it doesn't float in early
      katanaRef.current!.position.set(15, 10, 0);
      katanaRef.current!.rotation.set(0, 0, Math.PI / 4);

      // Phase 1 (1.0 to 1.35): Sword readies itself dynamically as you scroll.
      // Notice: NO melon rotation tweens here anymore! It's seamlessly handled by the continuous tumble above.
      masterTl.to(katanaRef.current!.position, { x: 8, y: 3, ease: "power2.out", duration: 0.35 }, 1.0)
            .to(katanaRef.current!.rotation, { z: -Math.PI / 12, ease: "power2.out", duration: 0.35 }, 1.0);

      // Phase 2 (1.35 to 1.9): THE HORIZONTAL SLICE! 
      masterTl.to(katanaRef.current!.position, { x: -8, y: -3, ease: "none", duration: 0.55 }, 1.35)
            .to(katanaRef.current!.rotation, { z: -Math.PI / 6, ease: "none", duration: 0.55 }, 1.35);

      // Phase 3 (1.625 to 2.0): Top half tumbles away!
      masterTl.to(topHalfRef.current!.position, { z: 12, y: 4, x: -2, ease: "power2.in", duration: 0.375 }, 1.625)
            .to(topHalfRef.current!.rotation, { x: Math.PI, y: Math.PI / 4, z: -Math.PI / 12, ease: "none", duration: 0.375 }, 1.625)
            // "Delete" the top half right after it flies out of view so it doesn't orbit back onto the screen!
            .to(topHalfRef.current!.scale, { x: 0, y: 0, z: 0, duration: 0.01 }, 2.0);

      // Juice Splash!
      dropletsData.forEach((drop, i) => {
        const mesh = dropletsRefs.current[i];
        if (mesh) {
          masterTl.set(mesh.scale, { x: drop.scale, y: drop.scale, z: drop.scale }, 1.625) // Pop into existence
                .to(mesh.position, { x: drop.target[0], y: drop.target[1], z: drop.target[2], duration: 0.275, ease: "power2.out" }, 1.625)
                .to(mesh.scale, { x: 0, y: 0, z: 0, duration: 0.1, ease: "power2.in" }, 1.8); // Shrink away
        }
      });

      // Phase 4 (1.9 to 2.0): Sword follows through and exits
      masterTl.to(katanaRef.current!.position, { x: -15, y: -5, ease: "power2.in", duration: 0.1 }, 1.9);

      // SECTION 3: FEATURES -> CTA (2.0 to 3.0)
      // This invisible 1-second spacer perfectly aligns the math!
      // Total Timeline Duration = 3.0.
      // Total Scroll Distance = 3 section transitions (Hero->Showcase, Showcase->Features, Features->CTA).
      // Therefore, 1.0 duration = exactly 1 section transition!
      masterTl.to(groupRef.current!.position, { y: -1, duration: 1 }, 2.0);

      ScrollTrigger.refresh();
    }, 100);
  }, { dependencies: [] });

  useFrame((state, delta) => {
    if (idleGroupRef.current) {
      // Need to use the idleGroupRef for the seeds calculations since it holds the actual rotation now
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

          {/* Juice Splash Particles */}
          <group position-y={0.01}>
            {dropletsData.map((drop, i) => (
              <mesh 
                key={`drop-${i}`} 
                ref={(el) => { if (el) dropletsRefs.current[i] = el; }} 
                position={drop.position}
                scale={0}
              >
                <sphereGeometry args={[2, 8, 8]} />
                <meshStandardMaterial map={innerTexture} bumpMap={innerTexture} bumpScale={0.2} roughness={0.6} transparent opacity={0.9} />
              </mesh>
            ))}
          </group>
        </group>
      </group>
    </>
  );
}
