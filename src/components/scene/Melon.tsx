"use client";

import { useMemo, useRef, useState, useEffect } from "react";
import { useFrame } from "@react-three/fiber";
import * as THREE from "three";
import gsap from "gsap";
import { ScrollTrigger } from "gsap/ScrollTrigger";
import { useGSAP } from "@gsap/react";

gsap.registerPlugin(ScrollTrigger);

// Pre-computed organic seed distribution for the X-ray effect
const seeds = [
  { x: 20, y: 30, a: 30 }, { x: -30, y: 10, a: -45 }, { x: 10, y: -40, a: 60 },
  { x: -20, y: -20, a: -15 }, { x: 40, y: -10, a: 80 }, { x: -10, y: 50, a: 10 },
  { x: -50, y: -30, a: -60 }, { x: 30, y: 15, a: 45 }, { x: -40, y: 35, a: -30 },
  { x: 0, y: -10, a: 0 }, { x: 15, y: -50, a: 120 }, { x: 45, y: -35, a: -20 },
  { x: -25, y: 60, a: 70 }, { x: 50, y: 40, a: 15 }
];
const seedElements = seeds.map(s => `<ellipse cx='${s.x}' cy='${s.y}' rx='3' ry='5' fill='%231a1a1a' transform='rotate(${s.a} ${s.x} ${s.y})'/>`).join('');

export function Melon() {
  const meshRef = useRef<THREE.Mesh>(null);
  const [scale, setScale] = useState(1);

  // Responsive scale and element tracking setup
  useEffect(() => {
    const handleResize = () => setScale(window.innerWidth < 768 ? 0.7 : 1);
    handleResize();

    // Cache elements and update their CSS custom properties only on scroll/resize!
    // Doing this inside useFrame at 60fps was a massive performance killer.
    const updateElements = () => {
      const elements = document.querySelectorAll('.text-outline, .text-outline-accent, .text-outline-thick');
      elements.forEach((el) => {
        const rect = el.getBoundingClientRect();
        (el as HTMLElement).style.setProperty('--elem-x', `${rect.left}px`);
        (el as HTMLElement).style.setProperty('--elem-y', `${rect.top}px`);
      });
    };

    updateElements();
    window.addEventListener("resize", handleResize, { passive: true });
    window.addEventListener("scroll", updateElements, { passive: true });
    window.addEventListener("resize", updateElements, { passive: true });

    return () => {
      window.removeEventListener("resize", handleResize);
      window.removeEventListener("scroll", updateElements);
      window.removeEventListener("resize", updateElements);
    };
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

    // Rotate the melon based on scroll
    gsap.to(meshRef.current.rotation, {
      y: Math.PI * 2,
      x: Math.PI / 4,
      ease: "none",
      scrollTrigger: {
        trigger: document.body,
        start: "top top",
        end: "bottom bottom",
        scrub: 1, // Smooth scrubbing
      },
    });

    // We can also animate its position or scale if we want
    gsap.to(meshRef.current.position, {
      y: -1, // move it down slightly
      ease: "power1.inOut",
      scrollTrigger: {
        trigger: document.body,
        start: "top top",
        end: "bottom bottom",
        scrub: 1,
      },
    });
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
      
      // WebGL Z-axis positive rotation is counter-clockwise on screen.
      // SVG positive rotation is clockwise. We negate Z to match the visual direction!
      // Multiplying by a scalar (1.2) if they feel it's too slow, but mathematically 1.0 is exact.
      const angle = (euler.y + euler.x - euler.z) * (180 / Math.PI);
      
      // Generate dynamic SVG for rotating seeds
      const svg = `<svg xmlns='http://www.w3.org/2000/svg' viewBox='-100 -100 200 200'><g transform='rotate(${angle.toFixed(1)})'>${seedElements}</g></svg>`;
      document.documentElement.style.setProperty('--melon-seeds-bg', `url("data:image/svg+xml,${svg}")`);
    }
  });

  return (
    <mesh ref={meshRef} scale={scale}>
      <sphereGeometry args={[2, 64, 64]} />
      <meshStandardMaterial 
        map={texture}
        roughness={0.7} 
        metalness={0.1} 
      />
    </mesh>
  );
}
