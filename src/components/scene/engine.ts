"use client";

function clamp(value: number, min: number, max: number) {
  return Math.min(max, Math.max(min, value));
}

export function getScrollProgress(scroller: HTMLElement, content: HTMLElement) {
  const maxScroll = Math.max(content.scrollHeight - scroller.clientHeight, 1);
  return clamp(scroller.scrollTop / maxScroll, 0, 1);
}

export function getTargetSceneTime(duration: number, progress: number) {
  return clamp(progress, 0, 1) * Math.max(duration, 0);
}
