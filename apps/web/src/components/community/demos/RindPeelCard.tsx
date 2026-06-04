"use client";

import React, { useRef } from "react";
import gsap from "gsap";

export interface RindPeelCardProps extends React.ComponentPropsWithoutRef<"div"> {
  width?: string | number;
  height?: string | number;
  
  revealTitle?: string;
  revealDesc?: string;
  revealBg?: string;
  revealTextColor?: string;
  revealDescColor?: string;

  peelCategory?: string;
  peelTitle?: string;
  peelHint?: string;
  peelArrow?: string;
  peelBg?: string;
  peelTextColor?: string;
  peelCategoryColor?: string;
  peelHintColor?: string;
  peelArrowColor?: string;
  peelStripeColor?: string;
  borderColor?: string;

  children?: React.ReactNode;
  peelChildren?: React.ReactNode;
  revealChildren?: React.ReactNode;
}

export const RindPeelCard = React.forwardRef<HTMLDivElement, RindPeelCardProps>(
  (
    {
      width = 288, // 72 * 4 = 288px
      height = 208, // 52 * 4 = 208px
      
      revealTitle = "Fresh 🍉",
      revealDesc = "Underneath the rind, something juicy.",
      revealBg = "#7fff5e",
      revealTextColor = "#050505",
      revealDescColor = "rgba(5, 5, 5, 0.7)",

      peelCategory = "Component",
      peelTitle = "Rind Peel Card",
      peelHint = "Hover to reveal",
      peelArrow = "↑",
      peelBg = "#0a0a0a",
      peelTextColor = "#f4f4f4",
      peelCategoryColor = "#e8d5b7",
      peelHintColor = "#555",
      peelArrowColor = "#ff5c71",
      peelStripeColor = "#7fff5e",
      borderColor = "#1e1e1e",

      children,
      peelChildren,
      revealChildren,
      className = "",
      style,
      ...props
    },
    forwardedRef
  ) => {
    const internalRef = useRef<HTMLDivElement>(null);
    const ref = (forwardedRef as React.RefObject<HTMLDivElement | null>) || internalRef;
    const peelRef = useRef<HTMLDivElement>(null);
    const contentRef = useRef<HTMLDivElement>(null);

    const handleEnter = () => {
      if (peelRef.current) {
        gsap.to(peelRef.current, {
          scaleY: 0,
          transformOrigin: "top center",
          duration: 0.5,
          ease: "power3.inOut",
        });
      }
      if (contentRef.current) {
        gsap.to(contentRef.current, {
          opacity: 1,
          y: 0,
          duration: 0.4,
          delay: 0.25,
          ease: "power2.out",
        });
      }
    };

    const handleLeave = () => {
      if (peelRef.current) {
        gsap.to(peelRef.current, {
          scaleY: 1,
          duration: 0.5,
          ease: "power3.inOut",
        });
      }
      if (contentRef.current) {
        gsap.to(contentRef.current, {
          opacity: 0,
          y: 12,
          duration: 0.3,
          ease: "power2.in",
        });
      }
    };

    return (
      <div
        ref={ref}
        onMouseEnter={handleEnter}
        onMouseLeave={handleLeave}
        onFocus={handleEnter}
        onBlur={handleLeave}
        role="button"
        tabIndex={0}
        className={`relative cursor-pointer overflow-hidden focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-[#ff5c71] ${className}`}
        style={{
          width,
          height,
          border: `1px solid ${borderColor}`,
          ...style,
        }}
        {...props}
      >
        {/* Inner content revealed under peel */}
        <div className="absolute inset-0 flex flex-col justify-center px-6" style={{ backgroundColor: revealBg }}>
          {revealChildren ? revealChildren : (
            <>
              <p className="font-black text-2xl uppercase tracking-tight" style={{ fontFamily: "var(--font-anton)", color: revealTextColor }}>
                {revealTitle}
              </p>
              <p className="text-sm font-mono mt-1" style={{ color: revealDescColor }}>
                {revealDesc}
              </p>
            </>
          )}
        </div>

        {/* The "rind" peel layer */}
        <div
          ref={peelRef}
          className="absolute inset-0 flex flex-col justify-between p-6 z-10"
          style={{ transformOrigin: "top center", backgroundColor: peelBg }}
        >
          {children || peelChildren ? (children || peelChildren) : (
            <>
              <div>
                <p className="font-mono text-xs uppercase tracking-widest mb-2" style={{ color: peelCategoryColor }}>
                  {peelCategory}
                </p>
                <p className="font-black text-2xl uppercase" style={{ fontFamily: "var(--font-anton)", color: peelTextColor }}>
                  {peelTitle}
                </p>
              </div>
              <div className="flex items-center justify-between">
                <span className="font-mono text-xs" style={{ color: peelHintColor }}>
                  {peelHint}
                </span>
                <span className="font-mono text-lg" style={{ color: peelArrowColor }}>
                  {peelArrow}
                </span>
              </div>
            </>
          )}
          {/* Rind stripe */}
          <div className="absolute bottom-0 inset-x-0 h-2" style={{ backgroundColor: peelStripeColor }} />
        </div>

        {/* Hidden content layer reference */}
        <div
          ref={contentRef}
          className="absolute inset-0 z-20 pointer-events-none"
          style={{ opacity: 0, transform: "translateY(12px)" }}
        />
      </div>
    );
  }
);

RindPeelCard.displayName = "RindPeelCard";
