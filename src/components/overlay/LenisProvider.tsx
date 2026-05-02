"use client";

import { useEffect } from "react";
import Lenis from "lenis";
import gsap from "gsap";
import { ScrollTrigger } from "gsap/ScrollTrigger";

const READY_EVENT = "melonui:ready";

gsap.registerPlugin(ScrollTrigger);

/**
 * LenisProvider mounts after the DOM so it can take over the custom scroller
 * once the loading handoff is complete.
 */
export function LenisProvider() {
  useEffect(() => {
    const container = document.getElementById("snap-container");
    const content = container?.firstElementChild as HTMLElement | null;
    if (!container || !content) {
      return;
    }

    const reducedMotionMedia = window.matchMedia("(prefers-reduced-motion: reduce)");
    let cleanupScroll: (() => void) | null = null;

    const activateScroll = () => {
      cleanupScroll?.();
      cleanupScroll = null;
      ScrollTrigger.defaults({ scroller: container });

      if (reducedMotionMedia.matches) {
        ScrollTrigger.refresh();
        return;
      }

      const lenis = new Lenis({
        wrapper: container,
        content,
        duration: 0.95,
        easing: (t: number) => 1 - Math.pow(1 - t, 3),
        orientation: "vertical",
        smoothWheel: true,
        wheelMultiplier: 0.95,
        touchMultiplier: 1.2,
        infinite: false,
      });

      const handleScroll = () => ScrollTrigger.update();

      ScrollTrigger.scrollerProxy(container, {
        scrollTop(value?: number) {
          if (value !== undefined) {
            lenis.scrollTo(value, { immediate: true });
          }
          return lenis.scroll;
        },
        getBoundingClientRect() {
          return {
            top: 0,
            left: 0,
            width: container.clientWidth,
            height: container.clientHeight,
          };
        },
      });

      lenis.on("scroll", handleScroll);

      const tick = (time: number) => lenis.raf(time * 1000);
      gsap.ticker.add(tick);
      gsap.ticker.lagSmoothing(0);
      ScrollTrigger.refresh();

      cleanupScroll = () => {
        gsap.ticker.remove(tick);
        lenis.off("scroll", handleScroll);
        ScrollTrigger.scrollerProxy(container, undefined as never);
        lenis.destroy();
        ScrollTrigger.refresh();
      };
    };

    const handleReady = () => activateScroll();
    const handleMotionChange = () => {
      if (document.documentElement.dataset.melonReady === "true") {
        activateScroll();
      } else {
        ScrollTrigger.refresh();
      }
    };

    ScrollTrigger.defaults({ scroller: container });

    if (document.documentElement.dataset.melonReady === "true") {
      activateScroll();
    } else {
      window.addEventListener(READY_EVENT, handleReady, { once: true });
    }

    reducedMotionMedia.addEventListener("change", handleMotionChange);

    return () => {
      window.removeEventListener(READY_EVENT, handleReady);
      reducedMotionMedia.removeEventListener("change", handleMotionChange);
      cleanupScroll?.();
      cleanupScroll = null;
    };
  }, []);

  return null;
}
