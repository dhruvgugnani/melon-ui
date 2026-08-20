"use client";

import * as React from "react";
import { useState, useRef, useEffect, useId } from "react";
import { motion, AnimatePresence } from "framer-motion";

export interface FilterOption {
  value: string;
  label: string;
}

export interface MorphingFilterPillProps {
  label?: string;
  options?: FilterOption[];
  defaultValue?: string;
  onChange?: (value: string) => void;
  primaryColor?: string;
  className?: string;
}

export function MorphingFilterPill({
  label = "Status",
  options = [
    { value: "all", label: "All" },
    { value: "active", label: "Active" },
    { value: "inactive", label: "Inactive" },
  ],
  defaultValue = "all",
  onChange,
  primaryColor = "#00f0ff",
  className = "",
}: MorphingFilterPillProps) {
  const [isOpen, setIsOpen] = useState(false);
  const [selectedValue, setSelectedValue] = useState(defaultValue);
  const containerRef = useRef<HTMLDivElement>(null);
  const uniqueId = useId();

  useEffect(() => {
    const handleClickOutside = (event: MouseEvent) => {
      if (containerRef.current && !containerRef.current.contains(event.target as Node)) {
        setIsOpen(false);
      }
    };

    document.addEventListener("mousedown", handleClickOutside);
    return () => document.removeEventListener("mousedown", handleClickOutside);
  }, []);

  const handleSelect = (value: string) => {
    setSelectedValue(value);
    setIsOpen(false);
    onChange?.(value);
  };

  const toggleOpen = () => setIsOpen(!isOpen);

  const selectedOption = options.find((opt) => opt.value === selectedValue) || options[0];

  return (
    <motion.div
      ref={containerRef}
      layout
      className={`relative inline-flex items-center bg-black/40 border border-white/10 backdrop-blur-md overflow-hidden ${className}`}
      style={{ borderRadius: 9999 }}
      transition={{ type: "spring", bounce: 0, duration: 0.3 }}
    >
      <motion.button
        layout
        onClick={toggleOpen}
        className="flex items-center gap-2 px-4 py-2 text-sm font-medium text-white/80 hover:text-white transition-colors cursor-pointer select-none"
      >
        <span className="text-white/40 whitespace-nowrap">{label}:</span>
        <span className="whitespace-nowrap">{selectedOption?.label}</span>
        <motion.svg
          width="12"
          height="12"
          viewBox="0 0 24 24"
          fill="none"
          stroke="currentColor"
          strokeWidth="2"
          strokeLinecap="round"
          strokeLinejoin="round"
          animate={{ rotate: isOpen ? 180 : 0 }}
          transition={{ duration: 0.2 }}
        >
          <polyline points="6 9 12 15 18 9"></polyline>
        </motion.svg>
      </motion.button>

      <AnimatePresence>
        {isOpen && (
          <motion.div
            initial={{ width: 0, opacity: 0 }}
            animate={{ width: "auto", opacity: 1 }}
            exit={{ width: 0, opacity: 0 }}
            transition={{ type: "spring", bounce: 0, duration: 0.3 }}
            className="flex items-center border-l border-white/10 ml-1 overflow-hidden"
          >
            <div className="flex px-1 min-w-max">
              {options.map((option) => {
                const isSelected = option.value === selectedValue;
                return (
                  <button
                    key={option.value}
                    onClick={() => handleSelect(option.value)}
                    className={`relative px-3 py-1.5 mx-1 my-1 text-sm rounded-full transition-colors ${
                      isSelected ? "text-black font-semibold" : "text-white/60 hover:text-white hover:bg-white/5"
                    }`}
                  >
                    {isSelected && (
                      <motion.div
                        layoutId={`active-filter-bg-${uniqueId}`}
                        className="absolute inset-0 rounded-full"
                        style={{ backgroundColor: primaryColor }}
                        transition={{ type: "spring", bounce: 0.2, duration: 0.4 }}
                      />
                    )}
                    <span className="relative z-10 whitespace-nowrap">{option.label}</span>
                  </button>
                );
              })}
            </div>
          </motion.div>
        )}
      </AnimatePresence>
    </motion.div>
  );
}
