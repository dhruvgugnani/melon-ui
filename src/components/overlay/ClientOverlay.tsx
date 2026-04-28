"use client";

import dynamic from "next/dynamic";

export const ClientOverlay = dynamic(
  () => import("./Overlay").then((mod) => mod.Overlay),
  { ssr: false }
);
