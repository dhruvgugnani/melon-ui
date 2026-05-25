"use client";

import dynamic from "next/dynamic";

// We wrap the heavy 3D Scene in a Client Component dynamic import with ssr: false
// This allows page.tsx to remain a Server Component for SEO, while deferring the WebGL load.
export const ClientScene = dynamic(
  () => import("./Scene").then((mod) => mod.Scene),
  { ssr: false }
);
