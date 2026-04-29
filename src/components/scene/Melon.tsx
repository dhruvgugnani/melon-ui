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
  const meshRef = useRef<THREE.Mesh>(null);
  const [scale, setScale] = useState(1);
  const [segments, setSegments] = useState(64);

  // Responsive scale setup
  useEffect(() => {
    const handleResize = () => {
      setScale(window.innerWidth < 768 ? 0.7 : 1);
      setSegments(window.innerWidth < 768 ? 32 : 64);
    };
    
    // Initial calculation (slight delay to ensure DOM is fully laid out)
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
      // Light green base
      ctx.fillStyle = "#5c8a4d";
      ctx.fillRect(0, 0, 1024, 512);
      
      // Draw dark green stripes
      const stripes = 12;
      for (let i = 0; i < stripes; i++) {
        let startX = (i * 1024) / stripes;
        
        // Draw each stripe at x-1024, x, and x+1024 to guarantee perfect wrap-around at the seam
        [-1024, 0, 1024].forEach(offset => {
          // Main thick stripe
          ctx.beginPath();
          for (let y = 0; y <= 512; y += 5) {
            const wave1 = Math.sin(y * 0.05) * 15;
            const wave2 = Math.sin(y * 0.1 + i) * 10; // offset by i for variety
            const x = startX + offset + wave1 + wave2;
            
            if (y === 0) ctx.moveTo(x, y);
            else ctx.lineTo(x, y);
          }
          
          ctx.lineWidth = 20; // fixed width instead of random for seamless matching
          ctx.lineCap = "round";
          ctx.lineJoin = "round";
          ctx.strokeStyle = "#23401c";
          ctx.stroke();
          
          // Secondary thinner wavy line
          ctx.beginPath();
          for (let y = 0; y <= 512; y += 5) {
            const wave1 = Math.sin(y * 0.05) * 15;
            const wave2 = Math.sin(y * 0.1 + i) * 10;
            const x = startX + offset + wave1 + wave2 + 15; // static shift
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

  useGSAP(() => {
    if (!meshRef.current) return;

    // Wait slightly to ensure sibling Overlay components have mounted their DOM nodes
    setTimeout(() => {
      // Rotate the melon based on scroll
      gsap.to(meshRef.current!.rotation, {
        y: Math.PI * 2,
        x: Math.PI / 4,
        ease: "none",
        scrollTrigger: {
          trigger: "#scroll-content",
          scroller: "#snap-container",
          start: "top top",
          end: "bottom bottom",
          scrub: 1, // Smooth scrubbing
        },
      });

      // We can also animate its position or scale if we want
      gsap.to(meshRef.current!.position, {
        y: -1, // move it down slightly
        ease: "power1.inOut",
        scrollTrigger: {
          trigger: "#scroll-content",
          scroller: "#snap-container",
          start: "top top",
          end: "bottom bottom",
          scrub: 1,
        },
      });
      ScrollTrigger.refresh();
    }, 100);
  });

  // A slow continuous idle rotation and 2D projection for X-ray effect
  useFrame((state, delta) => {
    if (meshRef.current) {
      meshRef.current.rotation.z += delta * 0.1;

      // Calculate world position to account for parent <Float> component movement
      const pos = new THREE.Vector3();
      meshRef.current.getWorldPosition(pos);

      // Project the 3D melon's world position to 2D screen coordinates
      const center = pos.clone();
      center.project(state.camera);
      
      // Convert Normalized Device Coordinates (NDC) to Pixels
      const x = (center.x * 0.5 + 0.5) * window.innerWidth;
      const y = (-(center.y * 0.5) + 0.5) * window.innerHeight;
      
      // Calculate projected radius in pixels (sphere radius is 2 * responsive scale)
      const edge = pos.clone();
      edge.x += 2 * scale; // Adjust radius based on mobile scale
      edge.project(state.camera);
      const edgeX = (edge.x * 0.5 + 0.5) * window.innerWidth;
      // Add a slight multiplier to cover the 3D bulge perfectly
      const r = Math.abs(edgeX - x) * 1.05;

      document.documentElement.style.setProperty('--melon-x', `${x}px`);
      document.documentElement.style.setProperty('--melon-y', `${y}px`);
      document.documentElement.style.setProperty('--melon-r', `${r}px`);
      document.documentElement.style.setProperty('--melon-r-80', `${r * 0.8}px`);
      document.documentElement.style.setProperty('--melon-r-90', `${r * 0.9}px`);
      
      // Calculate 2D rotation from World Quaternion to capture all parent rotations
      const worldQuat = new THREE.Quaternion();
      meshRef.current.getWorldQuaternion(worldQuat);
      const euler = new THREE.Euler().setFromQuaternion(worldQuat, 'YXZ');
      
      const angleRad = (euler.y + euler.x - euler.z);
      
      // OPTIMIZATION: Calculate seeds directly in CSS variables via Trigonometry.
      // This completely removes the string-parsing and DOM injection lag of generating SVG strings,
      // allowing us to run this completely smoothly at 60fps!
      seedsPolar.forEach((seed, i) => {
        // Since original SVG viewBox was 200x200, the "radius" of coordinate space is 100.
        // We multiply by (r / 100) to perfectly map logical seed coordinates to dynamic pixel screen radius!
        const rScaled = seed.r * (r / 100);
        const sX = rScaled * Math.cos(seed.theta + angleRad);
        const sY = rScaled * Math.sin(seed.theta + angleRad);
        
        document.documentElement.style.setProperty(`--s${i}x`, `${sX}px`);
        document.documentElement.style.setProperty(`--s${i}y`, `${sY}px`);
      });
    }
  });

  return (
    <mesh ref={meshRef} scale={scale}>
      {/* Dynamically drop complexity by 75% on mobile to save GPU */}
      <sphereGeometry args={[2, segments, segments]} />
      <meshStandardMaterial 
        map={texture}
        roughness={0.7} 
        metalness={0.1} 
      />
    </mesh>
  );
}
