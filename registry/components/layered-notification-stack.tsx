"use client";

import React, { useState } from "react";
import { motion, AnimatePresence } from "framer-motion";

export interface NotificationItem {
  id: string;
  title: string;
  description: string;
  time: string;
  status?: "default" | "success" | "warning" | "error";
  read?: boolean;
}

export interface LayeredNotificationStackProps extends Omit<React.HTMLAttributes<HTMLDivElement>, "onSelect"> {
  notifications: NotificationItem[];
  maxVisible?: number;
  onSelect?: (item: NotificationItem) => void;
  accentColor?: string;
  borderColor?: string;
  backgroundColor?: string;
  textColor?: string;
}

export function LayeredNotificationStack({
  notifications = [],
  maxVisible = 3,
  onSelect,
  accentColor = "#ff5c71",
  borderColor = "#2a2a2a",
  backgroundColor = "#0d0d0d",
  textColor = "#f4f4f4",
  className = "",
  style,
  ...props
}: LayeredNotificationStackProps) {
  const [isHovered, setIsHovered] = useState(false);

  // Take only up to maxVisible + 1 for performance/rendering limits
  // (We render one extra to handle the "fold" gracefully if we want)
  const visibleItems = notifications.slice(0, maxVisible + 1);
  const hiddenCount = Math.max(0, notifications.length - maxVisible);

  return (
    <div
      className={`relative flex flex-col justify-end ${className}`}
      style={{
        width: "100%",
        maxWidth: "360px",
        minHeight: "240px",
        ...style,
      }}
      onMouseEnter={() => setIsHovered(true)}
      onMouseLeave={() => setIsHovered(false)}
      {...props}
    >
      <AnimatePresence mode="popLayout">
        {visibleItems.map((item, index) => {
          const isLastVisible = index === maxVisible;
          if (isLastVisible && !isHovered) return null; // Don't show the extra one unless hovered to give illusion of depth

          // Stack calculations
          const reverseIndex = visibleItems.length - 1 - index;
          const yOffset = isHovered ? index * 80 : index * -12;
          const scale = isHovered ? 1 : 1 - index * 0.05;
          const zIndex = 50 - index;
          const opacity = isHovered ? 1 : 1 - index * 0.2;

          // Status colors
          let statusIndicator = "transparent";
          if (item.status === "success") statusIndicator = "#7fff5e";
          else if (item.status === "warning") statusIndicator = "#ffb347";
          else if (item.status === "error") statusIndicator = "#ff5c71";
          else if (item.status === "default") statusIndicator = accentColor;

          return (
            <motion.div
              key={item.id}
              layout
              initial={{ opacity: 0, y: 50, scale: 0.9 }}
              animate={{
                opacity: isLastVisible ? (isHovered ? 1 : 0) : opacity,
                y: yOffset,
                scale: isLastVisible ? (isHovered ? 1 : scale) : scale,
                zIndex: zIndex,
              }}
              exit={{ opacity: 0, scale: 0.9, transition: { duration: 0.2 } }}
              transition={{
                type: "spring",
                stiffness: 300,
                damping: 25,
                mass: 0.8,
              }}
              className="absolute left-0 w-full cursor-pointer rounded-xl overflow-hidden shadow-xl"
              style={{
                backgroundColor: backgroundColor,
                border: `1px solid ${borderColor}`,
                top: isHovered ? 0 : "auto",
                bottom: isHovered ? "auto" : 0,
                position: isHovered ? "relative" : "absolute",
                marginBottom: isHovered ? "12px" : 0,
              }}
              onClick={() => onSelect?.(item)}
              role="button"
              tabIndex={0}
              onKeyDown={(e) => {
                if (e.key === "Enter" || e.key === " ") {
                  e.preventDefault();
                  onSelect?.(item);
                }
              }}
              aria-label={`Notification: ${item.title}`}
            >
              <div className="flex p-4 gap-3">
                {/* Status indicator pill */}
                <div
                  className="w-1.5 rounded-full shrink-0 mt-0.5 mb-0.5"
                  style={{ backgroundColor: statusIndicator, opacity: item.read ? 0.3 : 1 }}
                />

                <div className="flex-1 min-w-0">
                  <div className="flex justify-between items-start mb-1">
                    <h4
                      className="text-sm font-semibold truncate pr-2"
                      style={{ color: textColor, opacity: item.read ? 0.6 : 1 }}
                    >
                      {item.title}
                    </h4>
                    <span
                      className="text-xs shrink-0 whitespace-nowrap mt-0.5"
                      style={{ color: textColor, opacity: 0.4 }}
                    >
                      {item.time}
                    </span>
                  </div>
                  <p
                    className="text-xs line-clamp-2"
                    style={{ color: textColor, opacity: item.read ? 0.4 : 0.7 }}
                  >
                    {item.description}
                  </p>
                </div>
              </div>
            </motion.div>
          );
        })}
      </AnimatePresence>

      {/* Hidden count indicator (shows when stacked) */}
      {!isHovered && hiddenCount > 0 && (
        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          exit={{ opacity: 0 }}
          className="absolute -top-6 right-2 text-xs font-mono px-2 py-0.5 rounded-full z-0"
          style={{
            color: textColor,
            backgroundColor: borderColor,
            border: `1px solid ${borderColor}`
          }}
        >
          +{hiddenCount} older
        </motion.div>
      )}
    </div>
  );
}
