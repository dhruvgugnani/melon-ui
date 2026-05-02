"use client";

import { useEffect, useState } from "react";

const MOBILE_BREAKPOINT = 768;
const DEFAULT_DPR_CAP = 1.5;

export type SceneMotionMode = "full" | "reduced";
export type SceneDeviceTier = "desktop" | "mobile";

export interface SceneQualityConfig {
  deviceTier: SceneDeviceTier;
  motion: SceneMotionMode;
  dpr: [number, number];
  sceneScale: number;
  segments: number;
  environmentResolution: number;
  enableEnvironment: boolean;
  seedCount: number;
  dropletCount: number;
}

const DEFAULT_QUALITY: SceneQualityConfig = {
  deviceTier: "desktop",
  motion: "full",
  dpr: [1, DEFAULT_DPR_CAP],
  sceneScale: 1,
  segments: 64,
  environmentResolution: 256,
  enableEnvironment: true,
  seedCount: 28,
  dropletCount: 36,
};

function getDeviceMemory() {
  if (typeof navigator === "undefined") {
    return undefined;
  }

  const nextNavigator = navigator as Navigator & { deviceMemory?: number };
  return nextNavigator.deviceMemory;
}

function getSceneQuality(): SceneQualityConfig {
  if (typeof window === "undefined") {
    return DEFAULT_QUALITY;
  }

  const reducedMotion = window.matchMedia("(prefers-reduced-motion: reduce)").matches;
  const coarsePointer = window.matchMedia("(pointer: coarse)").matches;
  const narrowViewport = window.innerWidth < MOBILE_BREAKPOINT;
  const lowThreadCount =
    typeof navigator.hardwareConcurrency === "number" && navigator.hardwareConcurrency <= 4;
  const deviceMemory = getDeviceMemory();
  const lowMemory = typeof deviceMemory === "number" && deviceMemory <= 4;
  const constrainedDevice = narrowViewport || coarsePointer || lowThreadCount || lowMemory;

  if (reducedMotion) {
    return {
      deviceTier: constrainedDevice ? "mobile" : "desktop",
      motion: "reduced",
      dpr: [1, 1],
      sceneScale: narrowViewport ? 0.7 : 1,
      segments: constrainedDevice ? 20 : 28,
      environmentResolution: 64,
      enableEnvironment: false,
      seedCount: constrainedDevice ? 12 : 16,
      dropletCount: 0,
    };
  }

  if (constrainedDevice) {
    return {
      deviceTier: "mobile",
      motion: "full",
      dpr: [1, 1.15],
      sceneScale: narrowViewport ? 0.7 : 1,
      segments: 32,
      environmentResolution: 128,
      enableEnvironment: true,
      seedCount: 20,
      dropletCount: 20,
    };
  }

  return DEFAULT_QUALITY;
}

export function useSceneQuality() {
  const [quality, setQuality] = useState(DEFAULT_QUALITY);

  useEffect(() => {
    const updateQuality = () => setQuality(getSceneQuality());

    updateQuality();

    if (typeof window === "undefined") {
      return;
    }

    const reducedMotionMedia = window.matchMedia("(prefers-reduced-motion: reduce)");
    const pointerMedia = window.matchMedia("(pointer: coarse)");

    window.addEventListener("resize", updateQuality, { passive: true });
    reducedMotionMedia.addEventListener("change", updateQuality);
    pointerMedia.addEventListener("change", updateQuality);

    return () => {
      window.removeEventListener("resize", updateQuality);
      reducedMotionMedia.removeEventListener("change", updateQuality);
      pointerMedia.removeEventListener("change", updateQuality);
    };
  }, []);

  return quality;
}
