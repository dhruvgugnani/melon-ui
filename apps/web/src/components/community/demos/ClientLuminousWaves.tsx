"use client";
import dynamic from 'next/dynamic';

export const LuminousWaves = dynamic(
  () => import('./LuminousWaves').then((mod) => mod.LuminousWaves),
  { ssr: false }
);
