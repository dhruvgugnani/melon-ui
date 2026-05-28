"use client";

import React, { CSSProperties, useState } from "react";
import { motion } from "framer-motion";

export interface ChromaticMeltTextProps {
  text?: string;
  kicker?: string;
  primaryColor?: string;
  secondaryColor?: string;
  accentColor?: string;
  className?: string;
  style?: CSSProperties;
}

export function ChromaticMeltText({
  text = "MELT MODE",
  kicker = "Pointer reactive ink",
  primaryColor = "#ffffff",
  secondaryColor = "#ff5c71",
  accentColor = "#7fff5e",
  className = "",
  style,
}: ChromaticMeltTextProps) {
  const [spot, setSpot] = useState({ x: 48, y: 42 });

  const handlePointerMove = (event: React.PointerEvent<HTMLDivElement>) => {
    const rect = event.currentTarget.getBoundingClientRect();
    setSpot({
      x: ((event.clientX - rect.left) / rect.width) * 100,
      y: ((event.clientY - rect.top) / rect.height) * 100,
    });
  };

  return (
    <div
      aria-label={text}
      onPointerMove={handlePointerMove}
      onPointerLeave={() => setSpot({ x: 48, y: 42 })}
      className={`relative inline-flex w-full max-w-[980px] flex-col overflow-visible ${className}`}
      style={style}
    >
      {kicker && (
        <p
          className="mb-3 font-mono text-[10px] uppercase tracking-[0.28em]"
          style={{ color: secondaryColor }}
        >
          {kicker}
        </p>
      )}
      <h2
        className="relative flex flex-wrap items-end gap-x-[0.08em] gap-y-1 text-[clamp(3.2rem,13vw,10rem)] uppercase leading-[0.74]"
        style={{
          fontFamily: "var(--font-londrina-solid)",
          color: primaryColor,
          textShadow: `0 18px 42px ${secondaryColor}28`,
        }}
      >
        <span
          aria-hidden="true"
          className="pointer-events-none absolute -inset-x-8 -inset-y-6 opacity-70 blur-2xl"
          style={{
            background: `radial-gradient(circle at ${spot.x}% ${spot.y}%, ${secondaryColor}33, ${accentColor}1f 34%, transparent 62%)`,
          }}
        />
        {text.split("").map((char, index) => (
          <motion.span
            key={`${char}-${index}`}
            initial={{ y: 18, opacity: 0, filter: "blur(12px)" }}
            animate={{ y: 0, opacity: 1, filter: "blur(0px)" }}
            transition={{ delay: index * 0.016, duration: 0.45, ease: [0.16, 1, 0.3, 1] }}
            whileHover={{
              y: [0, 14, -5, 0],
              scaleY: [1, 0.82, 1.12, 1],
              color: accentColor,
            }}
            className="relative inline-block min-w-[0.28em]"
          >
            {char === " " ? "\u00a0" : char}
            {char !== " " && (
              <span
                aria-hidden="true"
                className="absolute inset-x-[18%] bottom-[-0.14em] h-[0.11em] rounded-full opacity-75 blur-[1px]"
                style={{
                  background:
                    index % 2 === 0
                      ? `linear-gradient(90deg, ${secondaryColor}, ${accentColor})`
                      : `linear-gradient(90deg, ${accentColor}, ${secondaryColor})`,
                }}
              />
            )}
          </motion.span>
        ))}
      </h2>
    </div>
  );
}
