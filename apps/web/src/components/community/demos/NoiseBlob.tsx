"use client";

import { useMemo } from "react";
import { motion } from "framer-motion";

export interface NoiseBlobProps {
  primaryColor?: string;
  secondaryColor?: string;
  blobSize?: number;
  speed?: number;
  gooeyness?: number; // threshold matrix
}

export function NoiseBlob({
  primaryColor = "#ff5c71",
  secondaryColor = "#7fff5e",
  blobSize = 120,
  speed = 1.0,
  gooeyness = 10,
}: NoiseBlobProps) {
  // Generate random movement offsets and delays
  const blobs = useMemo(() => {
    return [
      {
        id: 1,
        color: primaryColor,
        x: [0, 80, -60, 0],
        y: [0, -50, 60, 0],
        delay: 0,
        sizeMult: 1.1,
      },
      {
        id: 2,
        color: secondaryColor,
        x: [0, -70, 80, 0],
        y: [0, 60, -40, 0],
        delay: 1.5,
        sizeMult: 0.95,
      },
      {
        id: 3,
        color: "#e8d5b7",
        x: [0, 50, -40, 0],
        y: [0, 70, -60, 0],
        delay: 3.0,
        sizeMult: 0.85,
      },
      {
        id: 4,
        color: primaryColor,
        x: [0, -90, 50, 0],
        y: [0, -40, 50, 0],
        delay: 4.5,
        sizeMult: 1.05,
      },
    ];
  }, [primaryColor, secondaryColor]);

  // Adjust SVG blur & alpha matrix based on gooeyness (range 2 to 20)
  const stdDeviation = gooeyness * 2;
  const matrixValues = `1 0 0 0 0  0 1 0 0 0  0 0 1 0 0  0 0 0 ${gooeyness * 3} -${gooeyness * 1.5}`;

  return (
    <div
      className="w-full h-full min-h-[300px] bg-[#050505] relative overflow-hidden flex items-center justify-center"
      style={{
        border: "1px solid #111",
      }}
    >
      {/* Liquid Blobs Container with SVG Filter applied */}
      <div
        className="absolute inset-0 w-full h-full filter"
        style={{
          filter: "url(#melon-gooey-filter)",
        }}
      >
        {blobs.map((b) => (
          <motion.div
            key={b.id}
            className="absolute rounded-full opacity-60"
            style={{
              left: `calc(50% - ${blobSize * b.sizeMult / 2}px)`,
              top: `calc(50% - ${blobSize * b.sizeMult / 2}px)`,
              width: `${blobSize * b.sizeMult}px`,
              height: `${blobSize * b.sizeMult}px`,
              backgroundColor: b.color,
              filter: "blur(2px)",
            }}
            animate={{
              x: b.x,
              y: b.y,
            }}
            transition={{
              duration: (14 / speed) * b.sizeMult,
              ease: "easeInOut",
              repeat: Infinity,
              delay: b.delay,
            }}
          />
        ))}
      </div>

      {/* SVG filter definition */}
      <svg className="absolute w-0 h-0 pointer-events-none">
        <defs>
          <filter id="melon-gooey-filter">
            <feGaussianBlur in="SourceGraphic" stdDeviation={stdDeviation} result="blur" />
            <feColorMatrix
              in="blur"
              mode="matrix"
              values={matrixValues}
              result="goo"
            />
            <feBlend in="SourceGraphic" in2="goo" />
          </filter>
        </defs>
      </svg>

      {/* Interactive Overlay Light */}
      <div
        className="absolute inset-0 pointer-events-none"
        style={{
          background: "radial-gradient(circle at center, transparent 30%, rgba(5,5,5,0.7) 90%)",
        }}
      />
    </div>
  );
}
