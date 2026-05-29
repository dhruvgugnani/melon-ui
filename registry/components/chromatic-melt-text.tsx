"use client";

import React, { CSSProperties, useState } from "react";
import { motion } from "framer-motion";

export interface ChromaticMeltTextProps extends React.ComponentPropsWithoutRef<"div"> {
  text?: string;
  kicker?: string;
  primaryColor?: string;
  secondaryColor?: string;
  accentColor?: string;
}

export function ChromaticMeltText({
  text = "CHROMA",
  kicker = "Chromatic glass type",
  primaryColor = "#ffffff",
  secondaryColor = "#ff5c71",
  accentColor = "#7fff5e",
  className = "",
  style,
  ...props
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
      {...props}
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
        className="relative flex flex-wrap items-end gap-x-[0.18em] gap-y-1 text-[clamp(3rem,11vw,8rem)] uppercase leading-[0.78]"
        style={{
          fontFamily: "var(--font-londrina-solid)",
          color: primaryColor,
          textShadow: `0 18px 42px ${secondaryColor}24`,
        }}
      >
        <span
          aria-hidden="true"
          className="pointer-events-none absolute -inset-x-8 -inset-y-6 opacity-70 blur-2xl"
          style={{
            background: `radial-gradient(circle at ${spot.x}% ${spot.y}%, ${secondaryColor}33, ${accentColor}1f 34%, transparent 62%)`,
          }}
        />
        {text.split(" ").map((word, wordIndex) => (
          <span key={`${word}-${wordIndex}`} className="inline-flex whitespace-nowrap">
            {word.split("").map((char, index) => {
              const letterIndex = wordIndex * 12 + index;

              return (
                <motion.span
                  key={`${char}-${letterIndex}`}
                  initial={{ y: 12, opacity: 0, filter: "blur(10px)" }}
                  animate={{ y: 0, opacity: 1, filter: "blur(0px)" }}
                  transition={{ delay: letterIndex * 0.018, duration: 0.42, ease: [0.16, 1, 0.3, 1] }}
                  whileHover={{
                    y: -8,
                    color: accentColor,
                    textShadow: `-5px 0 0 ${secondaryColor}88, 5px 0 0 ${accentColor}66, 0 18px 42px ${secondaryColor}35`,
                  }}
                  className="relative inline-block min-w-[0.25em]"
                  style={{
                    textShadow: `-2px 0 0 ${secondaryColor}55, 2px 0 0 ${accentColor}44, 0 18px 42px ${secondaryColor}24`,
                  }}
                >
                  {char}
                  <span
                    aria-hidden="true"
                    className="absolute -left-[0.04em] top-[0.12em] -z-10 text-current opacity-35 blur-[0.5px]"
                    style={{ color: secondaryColor }}
                  >
                    {char}
                  </span>
                  <span
                    aria-hidden="true"
                    className="absolute left-[0.05em] top-[-0.08em] -z-10 text-current opacity-30 blur-[0.5px]"
                    style={{ color: accentColor }}
                  >
                    {char}
                  </span>
                </motion.span>
              );
            })}
          </span>
        ))}
      </h2>
    </div>
  );
}
