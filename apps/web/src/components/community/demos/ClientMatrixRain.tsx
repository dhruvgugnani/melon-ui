"use client";
import dynamic from 'next/dynamic';

export const MatrixRain = dynamic(
  () => import('./MatrixRain').then((mod) => mod.MatrixRain),
  { ssr: false }
);
