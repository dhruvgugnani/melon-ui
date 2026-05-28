"use client";
import dynamic from 'next/dynamic';

export const StickerWall = dynamic(
  () => import('./StickerWall').then((mod) => mod.StickerWall),
  { ssr: false }
);
