"use client";

import { useState, useRef, KeyboardEvent } from "react";
import gsap from "gsap";

const PRESET_TAGS = ["gsap", "three.js", "react", "tailwind"];

export interface TagInputProps {
  tags?: string[];
  onChange?: (tags: string[]) => void;
  presetTags?: string[];
}

export function TagInput({
  tags: externalTags,
  onChange,
  presetTags = PRESET_TAGS
}: TagInputProps) {
  const [internalTags, setInternalTags] = useState<string[]>(["animation"]);
  const [value, setValue] = useState("");
  const containerRef = useRef<HTMLDivElement>(null);

  const tags = externalTags !== undefined ? externalTags : internalTags;

  const updateTags = (nextTags: string[] | ((prev: string[]) => string[])) => {
    const resolved = typeof nextTags === "function" ? nextTags(tags) : nextTags;
    if (externalTags === undefined) {
      setInternalTags(resolved);
    }
    if (onChange) {
      onChange(resolved);
    }
  };

  const addTag = (tag: string) => {
    const trimmed = tag.trim().toLowerCase();
    if (!trimmed || tags.includes(trimmed) || tags.length >= 6) return;
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
    <div className="flex flex-col gap-5 w-full max-w-sm">
      {/* Tag container */}
      <div
        ref={containerRef}
        className="flex flex-wrap gap-2 p-3 border border-[#1e1e1e] bg-[#0a0a0a] min-h-[52px] focus-within:border-[#ff5c71]/40 transition-colors"
      >
        {tags.map((tag) => (
          <span
            key={tag}
            data-tag={tag}
            className="flex items-center gap-1.5 px-2.5 py-1 bg-[#111] border border-[#222] font-mono text-xs text-[#aaa]"
          >
            {tag}
            <button
              onClick={() => removeTag(tag)}
              className="text-[#444] hover:text-[#ff5c71] transition-colors leading-none cursor-pointer"
            >
              ×
            </button>
          </span>
        ))}
        <input
          value={value}
          onChange={(e) => setValue(e.target.value)}
          onKeyDown={handleKey}
          placeholder={tags.length < 6 ? "Add tag..." : "Max 6 tags"}
          disabled={tags.length >= 6}
          className="flex-1 min-w-[80px] bg-transparent font-mono text-xs text-[#888] placeholder:text-[#333] outline-none"
        />
      </div>

      {/* Quick-add presets */}
      <div className="flex gap-2 flex-wrap">
        {presetTags.filter((t) => !tags.includes(t)).map((preset) => (
          <button
            key={preset}
            onClick={() => addTag(preset)}
            className="font-mono text-[10px] text-[#444] hover:text-[#ff5c71] uppercase tracking-wider border border-[#1a1a1a] hover:border-[#ff5c71]/30 px-2 py-1 transition-all cursor-pointer"
          >
            + {preset}
          </button>
        ))}
      </div>
    </div>
  );
}
