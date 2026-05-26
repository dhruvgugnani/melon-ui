"use client";

import dynamic from "next/dynamic";

export const ClientHomeScene = dynamic(
  () => import("./HomeScene").then((mod) => mod.HomeScene),
  { ssr: false, loading: () => <div className="w-full h-full flex items-center justify-center font-mono text-[#333]">Loading 3D Object...</div> }
);
