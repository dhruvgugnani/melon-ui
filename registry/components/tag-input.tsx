"use client";

import { useState, useRef, KeyboardEvent } from "react";
import gsap from "gsap";

export interface TagInputProps extends Omit<React.ComponentPropsWithoutRef<"div">, "onChange"> {
  tags?: string[];
  onChange?: (tags: string[]) => void;
  presetTags?: string[];
  maxTags?: number;
  placeholder?: string;
  borderColor?: string;
  focusBorderColor?: string;
  tagBgColor?: string;
  tagTextColor?: string;
  tagBorderColor?: string;
  removeButtonColor?: string;
  removeButtonHoverColor?: string;
  presetButtonColor?: string;
  presetButtonHoverColor?: string;
}

export function TagInput({
  tags: controlledTags,
  onChange,
  presetTags = ["gsap", "three.js", "react", "tailwind"],
  maxTags = 6,
  placeholder = "Add tag...",
  
  borderColor = "#1e1e1e",
  focusBorderColor = "rgba(255, 92, 113, 0.4)",
  tagBgColor = "#111",
  tagTextColor = "#aaa",
  tagBorderColor = "#222",
  removeButtonColor = "#444",
  removeButtonHoverColor = "#ff5c71",
  presetButtonColor = "#444",
  presetButtonHoverColor = "#ff5c71",
  
  className = "",
  style,
  ...props
}: TagInputProps) {
  const [localTags, setLocalTags] = useState<string[]>(["animation"]);
  const [value, setValue] = useState("");
  const containerRef = useRef<HTMLDivElement>(null);

  const tags = controlledTags ?? localTags;

  const updateTags = (newTags: string[]) => {
    if (controlledTags !== undefined) {
      onChange?.(newTags);
    } else {
      setLocalTags(newTags);
      onChange?.(newTags);
    }
  };

  const addTag = (tag: string) => {
    const trimmed = tag.trim().toLowerCase();
    if (!trimmed || tags.includes(trimmed) || tags.length >= maxTags) return;
    updateTags([...tags, trimmed]);
    setValue("");

    // Animate new tag in
    setTimeout(() => {
      const newTag = containerRef.current?.querySelector(`[data-tag="${trimmed}"]`) as HTMLElement;
      if (newTag) {
        gsap.from(newTag, { scale: 0, opacity: 0, duration: 0.3, ease: "back.out(2)" });
      }
    }, 10);
  };

  const removeTag = (tag: string) => {
    const el = containerRef.current?.querySelector(`[data-tag="${tag}"]`) as HTMLElement;
    if (el) {
      gsap.to(el, {
        scale: 0,
        opacity: 0,
        duration: 0.2,
        ease: "power2.in",
        onComplete: () => updateTags(tags.filter((t) => t !== tag)),
      });
    } else {
      updateTags(tags.filter((t) => t !== tag));
    }
  };

  const handleKey = (e: KeyboardEvent<HTMLInputElement>) => {
    if (e.key === "Enter" || e.key === ",") {
      e.preventDefault();
      addTag(value);
    } else if (e.key === "Backspace" && !value && tags.length) {
      removeTag(tags[tags.length - 1]);
    }
  };

  return (
    <div
      className={`flex flex-col gap-5 w-full max-w-sm ${className}`}
      style={style}
      {...props}
    >
      {/* Tag container */}
      <div
        ref={containerRef}
        className="flex flex-wrap gap-2 p-3 border min-h-[52px] transition-colors focus-within:border-[var(--focus-border)]"
        style={{
          borderColor: borderColor,
          "--focus-border": focusBorderColor,
        } as React.CSSProperties}
      >
        {tags.map((tag) => (
          <span
            key={tag}
            data-tag={tag}
            className="flex items-center gap-1.5 px-2.5 py-1 border font-mono text-xs"
            style={{
              backgroundColor: tagBgColor,
              borderColor: tagBorderColor,
              color: tagTextColor,
            }}
          >
            {tag}
            <button
              onClick={() => removeTag(tag)}
              className="transition-colors leading-none font-bold"
              style={{
                color: removeButtonColor,
              }}
              onMouseEnter={(e) => {
                e.currentTarget.style.color = removeButtonHoverColor;
              }}
              onMouseLeave={(e) => {
                e.currentTarget.style.color = removeButtonColor;
              }}
            >
              ×
            </button>
          </span>
        ))}
        <input
          value={value}
          onChange={(e) => setValue(e.target.value)}
          onKeyDown={handleKey}
          placeholder={tags.length < maxTags ? placeholder : `Max ${maxTags} tags`}
          disabled={tags.length >= maxTags}
          className="flex-1 min-w-[80px] bg-transparent font-mono text-xs text-[#888] placeholder:text-[#333] outline-none"
        />
      </div>

      {/* Quick-add presets */}
      <div className="flex gap-2 flex-wrap">
        {presetTags.filter((t) => !tags.includes(t)).map((preset) => (
          <button
            key={preset}
            onClick={() => addTag(preset)}
            className="font-mono text-[10px] uppercase tracking-wider border px-2 py-1 transition-all"
            style={{
              color: presetButtonColor,
              borderColor: borderColor,
            }}
            onMouseEnter={(e) => {
              e.currentTarget.style.color = presetButtonHoverColor;
              e.currentTarget.style.borderColor = presetButtonHoverColor;
            }}
            onMouseLeave={(e) => {
              e.currentTarget.style.color = presetButtonColor;
              e.currentTarget.style.borderColor = borderColor;
            }}
          >
            + {preset}
          </button>
        ))}
      </div>
    </div>
  );
}
