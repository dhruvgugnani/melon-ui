"use client";
import dynamic from 'next/dynamic';

export const RetroGrid = dynamic(
  () => import('./RetroGrid').then((mod) => mod.RetroGrid),
  { ssr: false }
);
