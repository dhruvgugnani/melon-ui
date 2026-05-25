"use client";
import dynamic from 'next/dynamic';

export const FloatingOrbs = dynamic(
  () => import('./FloatingOrbs').then((mod) => mod.FloatingOrbs),
  { ssr: false }
);
