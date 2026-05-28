"use client";
import dynamic from 'next/dynamic';

export const NoiseBlob = dynamic(
  () => import('./NoiseBlob').then((mod) => mod.NoiseBlob),
  { ssr: false }
);
