"use client";

import { useRef } from "react";
import gsap from "gsap";

export interface RippleButtonProps extends React.ComponentPropsWithoutRef<"button"> {
  label?: string;
  duration?: number;
  rippleColor?: string;
  borderColor?: string;
  textColor?: string;
  hoverBgColor?: string;
  hoverTextColor?: string;
}

export function RippleButton({
  label = "Click for ripple",
  duration = 0.7,
  rippleColor = "rgba(127, 255, 94, 0.25)",
  borderColor = "#ff5c71",
  textColor = "#ff5c71",
  hoverBgColor = "#ff5c71",
  hoverTextColor = "#050505",
  className = "",
  style,
  ...props
}: RippleButtonProps) {
  const rippleContainer = useRef<HTMLSpanElement>(null);

  const handleClick = (e: React.MouseEvent<HTMLButtonElement>) => {
    const btn = e.currentTarget;
    const rect = btn.getBoundingClientRect();
    const size = Math.max(rect.width, rect.height) * 2;
    const x = e.clientX - rect.left - size / 2;
    const y = e.clientY - rect.top - size / 2;

    const ripple = document.createElement("span");
    ripple.style.cssText = `
      position: absolute;
      width: ${size}px;
      height: ${size}px;
      left: ${x}px;
      top: ${y}px;
      border-radius: 50%;
      background: ${rippleColor};
      pointer-events: none;
    `;
    rippleContainer.current?.appendChild(ripple);

    gsap.fromTo(
      ripple,
      { scale: 0, opacity: 1 },
      {
        scale: 1,
        opacity: 0,
        duration: duration,
        ease: "power2.out",
        onComplete: () => ripple.remove(),
      }
    );

    if (props.onClick) {
      props.onClick(e);
    }
  };

  return (
    <button
      onClick={handleClick}
      className={`relative overflow-hidden px-10 py-4 bg-transparent border font-mono text-sm uppercase tracking-widest transition-colors group focus:outline-none focus-visible:ring-1 focus-visible:ring-[#ff5c71] ${className}`}
      style={{
        borderColor: borderColor,
        color: textColor,
        ...style
      }}
      {...props}
      onMouseEnter={(e) => {
        e.currentTarget.style.color = hoverTextColor;
        if (props.onMouseEnter) props.onMouseEnter(e);
      }}
      onMouseLeave={(e) => {
        e.currentTarget.style.color = textColor;
        if (props.onMouseLeave) props.onMouseLeave(e);
      }}
    >
      {/* Hover fill */}
      <span 
        className="absolute inset-0 translate-y-full group-hover:translate-y-0 transition-transform duration-300 ease-out" 
        style={{
          backgroundColor: hoverBgColor
        }}
      />
      <span ref={rippleContainer} className="absolute inset-0 overflow-hidden" />
      <span className="relative z-10">{label}</span>
    </button>
  );
}
