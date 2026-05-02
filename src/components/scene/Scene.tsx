"use client";

import { Canvas } from "@react-three/fiber";
import { Environment, Lightformer } from "@react-three/drei";
import { Melon } from "./Melon";
import { useSceneQuality } from "./runtime";

export function Scene() {
  const quality = useSceneQuality();

  return (
    <div className="fixed inset-0 z-0 pointer-events-none">
      <Canvas
        camera={{ position: [0, 0, 8], fov: 45 }}
        dpr={quality.dpr}
        frameloop={quality.motion === "full" ? "always" : "demand"}
        gl={{
          antialias: quality.deviceTier === "desktop" && quality.motion === "full",
          alpha: true,
          powerPreference: "high-performance",
        }}
      >
        <ambientLight intensity={0.5} />
        <directionalLight position={[5, 5, 5]} intensity={2} />
        <directionalLight position={[-5, -5, -5]} intensity={0.5} color="#78efff" />

        {quality.enableEnvironment ? (
          <Environment resolution={quality.environmentResolution}>
            <group rotation={[-Math.PI / 4, -0.3, 0]}>
              <Lightformer intensity={4} rotation-x={Math.PI / 2} position={[0, 5, -9]} scale={[10, 10, 1]} />
              <Lightformer intensity={2} rotation-y={Math.PI / 2} position={[-5, 1, -1]} scale={[10, 2, 1]} />
              <Lightformer intensity={2} rotation-y={-Math.PI / 2} position={[10, 1, 0]} scale={[10, 2, 1]} />
              <Lightformer intensity={2} rotation-y={Math.PI / 2} position={[-5, -1, -1]} scale={[10, 2, 1]} color="#ff5c71" />
            </group>
          </Environment>
        ) : null}

        <Melon quality={quality} />
      </Canvas>
    </div>
  );
}
