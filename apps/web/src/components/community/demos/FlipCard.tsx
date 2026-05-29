"use client";

import { useRef } from "react";
import gsap from "gsap";

export interface FlipCardProps extends React.ComponentPropsWithoutRef<"div"> {
  width?: string | number;
  height?: string | number;
  frontCategory?: string;
  frontTitle?: string;
  frontHint?: string;
  frontBg?: string;
  frontBorder?: string;
  frontTextColor?: string;
  frontCategoryColor?: string;
  frontHintColor?: string;
  frontStripeColor?: string;

  backEmoji?: string;
  backTitle?: string;
  backHint?: string;
  backBg?: string;
  backTextColor?: string;
  backHintColor?: string;
  
  perspective?: string | number;
  duration?: number;
}

export function FlipCard({
  width = 260,
  height = 180,
  frontCategory = "Component / Card",
  frontTitle = "Flip Card",
  frontHint = "Click to reveal >",
  frontBg = "#0d0d0d",
  frontBorder = "#1e1e1e",
  frontTextColor = "#f4f4f4",
  frontCategoryColor = "#444",
  frontHintColor = "#555",
  frontStripeColor = "rgba(255, 92, 113, 0.2)",

  backEmoji = "🍉",
  backTitle = "Surprise!",
  backHint = "Click again to flip back",
  backBg = "#ff5c71",
  backTextColor = "#050505",
  backHintColor = "rgba(5, 5, 5, 0.6)",

  perspective = "1000px",
  duration = 0.7,
  className = "",
  style,
  ...props
}: FlipCardProps) {
  const cardRef = useRef<HTMLDivElement>(null);
  const isFlipped = useRef(false);

  const flip = () => {
    if (!cardRef.current) return;
    const target = isFlipped.current ? 0 : 180;
    isFlipped.current = !isFlipped.current;
    gsap.to(cardRef.current, {
      rotationY: target,
      duration: duration,
      ease: "power3.inOut",
    });
  };

  const handleKeyDown = (e: React.KeyboardEvent) => {
    if (e.key === "Enter" || e.key === " ") {
      e.preventDefault();
      flip();
    }
  };

  return (
    <div
      role="button"
      tabIndex={0}
      className={`cursor-pointer focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-[#ff5c71] ${className}`}
      style={{
        perspective,
        width,
        height,
        ...style
      }}
      onClick={flip}
      onKeyDown={handleKeyDown}
      {...props}
    >
      <div
        ref={cardRef}
        style={{
          width: "100%",
          height: "100%",
          transformStyle: "preserve-3d",
          position: "relative",
        }}
      >
        {/* Front */}
        <div
          style={{
            backfaceVisibility: "hidden",
            backgroundColor: frontBg,
            borderColor: frontBorder,
          }}
          className="absolute inset-0 border flex flex-col justify-between p-5"
        >
          <span className="font-mono text-[10px] uppercase tracking-widest" style={{ color: frontCategoryColor }}>
            {frontCategory}
          </span>
          <div>
            <p className="font-black text-2xl uppercase" style={{ fontFamily: "var(--font-anton)", color: frontTextColor }}>
              {frontTitle}
            </p>
            <p className="font-mono text-xs mt-1" style={{ color: frontHintColor }}>
              {frontHint}
            </p>
          </div>
          <div className="w-full h-px" style={{ backgroundColor: frontStripeColor }} />
        </div>

        {/* Back */}
        <div
          style={{
            backfaceVisibility: "hidden",
            transform: "rotateY(180deg)",
            backgroundColor: backBg,
          }}
          className="absolute inset-0 flex flex-col justify-center items-center gap-3"
        >
          {backEmoji && <span className="text-4xl">{backEmoji}</span>}
          <p className="font-black text-xl uppercase" style={{ fontFamily: "var(--font-anton)", color: backTextColor }}>
            {backTitle}
          </p>
          <p className="font-mono text-xs" style={{ color: backHintColor }}>
            {backHint}
          </p>
        </div>
      </div>
    </div>
  );
}
