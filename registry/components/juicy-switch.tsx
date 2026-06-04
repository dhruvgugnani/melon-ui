"use client";

import { useRef, useState, useEffect } from "react";
import gsap from "gsap";

export interface JuicySwitchProps extends Omit<React.ComponentPropsWithoutRef<"button">, "onChange"> {
  checked?: boolean;
  defaultChecked?: boolean;
  onChange?: (checked: boolean) => void;
  particleCount?: number;
  gravity?: number;
  seedColor?: string;
  primaryColor?: string;
  secondaryColor?: string;
}

export function JuicySwitch({
  checked: controlledChecked,
  defaultChecked = false,
  onChange,
  particleCount = 10,
  gravity = 0.5,
  seedColor = "#1a1a1a",
  primaryColor = "#ff5c71",
  secondaryColor = "#7fff5e",
  className = "",
  style,
  ...props
}: JuicySwitchProps) {
  const [isChecked, setIsChecked] = useState(defaultChecked);
  const trackRef = useRef<HTMLButtonElement>(null);
  const knobRef = useRef<HTMLSpanElement>(null);
  const particleContainerRef = useRef<HTMLSpanElement>(null);

  // Sync state if controlled
  useEffect(() => {
    if (controlledChecked !== undefined) {
      // eslint-disable-next-line react-hooks/set-state-in-effect
      setIsChecked(controlledChecked);
    }
  }, [controlledChecked]);

  // Animate knob position and morphing when state changes
  useEffect(() => {
    const knob = knobRef.current;
    if (!knob) return;

    if (isChecked) {
      // Toggle ON: slide right, rotate, scale up slightly
      gsap.to(knob, {
        x: 28,
        rotate: 180,
        scale: 1.1,
        duration: 0.45,
        ease: "back.out(1.4)",
      });
    } else {
      // Toggle OFF: slide left, reset rotation, restore original size
      gsap.to(knob, {
        x: 0,
        rotate: 0,
        scale: 1,
        duration: 0.4,
        ease: "power2.out",
      });
    }
  }, [isChecked]);

  const triggerJuiceBurst = () => {
    const container = particleContainerRef.current;
    const knob = knobRef.current;
    if (!container || !knob) return;

    const knobRect = knob.getBoundingClientRect();
    const trackRect = container.getBoundingClientRect();
    
    // Calculate burst origin relative to particle container
    const originX = knobRect.left - trackRect.left + knobRect.width / 2;
    const originY = knobRect.top - trackRect.top + knobRect.height / 2;

    for (let i = 0; i < particleCount; i++) {
      const particle = document.createElement("span");
      const size = 3 + Math.random() * 5;
      const isSeed = Math.random() > 0.65;
      const color = isSeed ? seedColor : (Math.random() > 0.4 ? primaryColor : secondaryColor);
      
      particle.style.cssText = `
        position: absolute;
        width: ${size}px;
        height: ${size}px;
        left: ${originX}px;
        top: ${originY}px;
        background-color: ${color};
        border-radius: 50%;
        pointer-events: none;
        will-change: transform, opacity;
      `;
      
      container.appendChild(particle);

      const angle = Math.random() * Math.PI * 2;
      const force = 30 + Math.random() * 45;
      const dx = Math.cos(angle) * force;
      const dy = Math.sin(angle) * force - 10; // launch slightly upwards

      gsap.set(particle, { scale: 1, opacity: 1 });
      
      // Animate particle with custom gravity simulation
      gsap.to(particle, {
        x: dx,
        y: dy + (gravity * 40),
        opacity: 0,
        scale: 0.2,
        duration: 0.6 + Math.random() * 0.4,
        ease: "power2.out",
        onComplete: () => {
          particle.remove();
        }
      });
    }
  };

  const handleToggle = (e: React.MouseEvent<HTMLButtonElement>) => {
    const nextState = !isChecked;
    
    if (controlledChecked === undefined) {
      setIsChecked(nextState);
    }

    if (onChange) {
      onChange(nextState);
    }

    if (nextState) {
      // Trigger particles burst only when toggled ON
      triggerJuiceBurst();
    }

    if (props.onClick) {
      props.onClick(e);
    }
  };

  return (
    <button
      ref={trackRef}
      role="switch"
      aria-checked={isChecked}
      onClick={handleToggle}
      className={`relative w-[64px] h-[34px] rounded-full border bg-zinc-950 p-1 flex items-center cursor-pointer select-none transition-all duration-300 focus:outline-none focus-visible:ring-1 focus-visible:ring-[#ff5c71] ${className}`}
      style={{
        borderColor: isChecked ? `${secondaryColor}50` : "rgba(255, 255, 255, 0.1)",
        boxShadow: isChecked ? `0 0 15px ${primaryColor}20` : "none",
        ...style,
      }}
      {...props}
    >
      {/* Background track line details */}
      <span className="absolute inset-x-4 top-1/2 -translate-y-1/2 h-[1px] bg-white/10 pointer-events-none" />
      
      {/* Particle overlay container */}
      <span ref={particleContainerRef} className="absolute inset-0 overflow-visible pointer-events-none" />

      {/* Switch Knob (Watermelon Seed / Slice Morph) */}
      <span
        ref={knobRef}
        className="relative z-10 w-[24px] h-[24px] flex items-center justify-center pointer-events-none"
        style={{ willChange: "transform" }}
      >
        {isChecked ? (
          /* Watermelon Slice Shape (ON state) */
          <svg width="22" height="22" viewBox="0 0 24 24" fill="none">
            {/* Outer secondary color rind (semi-circle) */}
            <path
              d="M2 12C2 17.5228 6.47715 22 12 22C17.5228 22 22 17.5228 22 12H2Z"
              fill={secondaryColor}
            />
            {/* Inner primary color pulp */}
            <path
              d="M4 12C4 16.4183 7.58172 20 12 20C16.4183 20 20 16.4183 20 12H4Z"
              fill={primaryColor}
            />
            {/* Tiny black seed dots */}
            <circle cx="9" cy="15" r="1" fill={seedColor} />
            <circle cx="12" cy="17" r="1" fill={seedColor} />
            <circle cx="15" cy="15" r="1" fill={seedColor} />
          </svg>
        ) : (
          /* Watermelon Seed Shape (OFF state) */
          <svg width="20" height="20" viewBox="0 0 24 24" fill="none">
            <path
              d="M12 2C9.5 7.5 7 13 7 16C7 18.7614 9.23858 21 12 21C14.7614 21 17 18.7614 17 16C17 13 14.5 7.5 12 2Z"
              fill="rgba(255,255,255,0.06)"
              stroke="#555"
              strokeWidth="1.5"
            />
            <path
              d="M12 5C10.5 9 8.5 13 8.5 16C8.5 17.933 10.067 19.5 12 19.5C13.933 19.5 15.5 17.933 15.5 16C15.5 13 13.5 9 12 5Z"
              fill={seedColor}
            />
          </svg>
        )}
      </span>
    </button>
  );
}
