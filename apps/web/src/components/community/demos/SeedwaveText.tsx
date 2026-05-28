"use client";

import React, { useState } from "react";
import { AnimatePresence, motion } from "framer-motion";

interface Seed {
  id: number;
  x: number;
  y: number;
}

export function SeedwaveText() {
  const [seeds, setSeeds] = useState<Seed[]>([]);
  const [wave, setWave] = useState(0);

  const burst = (event: React.PointerEvent<HTMLButtonElement>) => {
    const rect = event.currentTarget.getBoundingClientRect();
    const x = event.clientX - rect.left;
    const y = event.clientY - rect.top;
    const created = Array.from({ length: 18 }, (_, index) => ({
      id: Date.now() + index,
      x,
      y,
    }));
    setSeeds((current) => [...current.slice(-18), ...created]);
    setWave((value) => value + 1);
    window.setTimeout(() => {
      setSeeds((current) => current.filter((seed) => !created.some((item) => item.id === seed.id)));
    }, 1200);
  };

  return (
    <section className="relative flex min-h-[370px] w-full items-center justify-center overflow-hidden bg-[#050505] p-6 text-white">
      <div className="absolute inset-0 bg-[radial-gradient(circle_at_20%_80%,rgba(255,92,113,0.18),transparent_36%),radial-gradient(circle_at_75%_30%,rgba(247,240,210,0.12),transparent_34%)]" />
      <button
        type="button"
        onPointerDown={burst}
        className="relative w-full max-w-4xl overflow-hidden rounded-[8px] border border-white/10 bg-black/55 p-8 text-left shadow-[0_35px_90px_rgba(0,0,0,0.55)] backdrop-blur-xl focus:outline-none focus-visible:ring-2 focus-visible:ring-[#ff5c71]"
      >
        <span className="relative z-10 mb-4 block font-mono text-[10px] uppercase tracking-[0.28em] text-[#ff5c71]">
          click born seedwave
        </span>
        <motion.h2
          key={wave}
          className="relative z-10 text-[clamp(4.5rem,15vw,10rem)] uppercase leading-[0.76] text-white"
          style={{ fontFamily: "var(--font-londrina-solid)", textShadow: "0 22px 50px rgba(255,92,113,0.18)" }}
          animate={{ y: [0, -12, 0], scaleY: [1, 0.92, 1] }}
          transition={{ duration: 0.42, ease: [0.16, 1, 0.3, 1] }}
        >
          Seed
          <br />
          Wave
        </motion.h2>
        <AnimatePresence>
          {seeds.map((seed, index) => {
            const angle = (index / 18) * Math.PI * 2;
            const distance = 70 + (index % 5) * 18;
            const color = index % 3 === 0 ? "#7fff5e" : index % 3 === 1 ? "#ff5c71" : "#f7f0d2";
            return (
              <motion.span
                key={seed.id}
                className="absolute z-20 h-3 w-1.5 rounded-full"
                style={{ left: seed.x, top: seed.y, backgroundColor: color }}
                initial={{ x: 0, y: 0, rotate: 0, opacity: 1, scale: 0.3 }}
                animate={{
                  x: Math.cos(angle) * distance,
                  y: Math.sin(angle) * distance,
                  rotate: angle * 120,
                  opacity: 0,
                  scale: 1,
                }}
                exit={{ opacity: 0 }}
                transition={{ duration: 0.95, ease: [0.16, 1, 0.3, 1] }}
              />
            );
          })}
        </AnimatePresence>
        <div className="relative z-10 mt-6 flex items-center justify-between border-t border-white/10 pt-4 font-mono text-[10px] uppercase tracking-[0.2em] text-white/35">
          <span>Press anywhere</span>
          <span>Particle typography</span>
        </div>
      </button>
    </section>
  );
}
