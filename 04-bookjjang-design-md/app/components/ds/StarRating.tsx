"use client";

import { useState, type CSSProperties } from "react";
import { Icon } from "./Icon";

/**
 * StarRating — 1~max integer star rating (no half stars, per DESIGN.md §12).
 * Filled stars use --rating (gold), empty ones --rating-track. Clicking a star
 * sets that value; clicking the current value again clears to 0. `readOnly`
 * renders a static display.
 */

type Size = "sm" | "md" | "lg";

export interface StarRatingProps {
  value: number;
  onChange?: (value: number) => void;
  max?: number;
  size?: Size;
  readOnly?: boolean;
  "aria-label"?: string;
  style?: CSSProperties;
}

const ICON: Record<Size, number> = { sm: 20, md: 28, lg: 36 };
const GAP: Record<Size, number> = { sm: 4, md: 6, lg: 8 };

export function StarRating({
  value,
  onChange,
  max = 5,
  size = "md",
  readOnly = false,
  "aria-label": ariaLabel,
  style,
}: StarRatingProps) {
  const [hover, setHover] = useState(0);
  const active = hover || value;
  const iconSize = ICON[size];

  const star = (filled: boolean) => (
    <Icon
      name="star"
      size={iconSize}
      stroke={2}
      color={filled ? "var(--rating)" : "var(--rating-track)"}
      fill={filled ? "var(--rating)" : "none"}
    />
  );

  // Read-only display renders plain (non-button) marks — it must not emit
  // <button>s, e.g. when nested inside a clickable card (avoids invalid nested
  // buttons / hydration errors).
  if (readOnly) {
    return (
      <div role="img" aria-label={ariaLabel || `별점 ${value}점`} style={{ display: "inline-flex", gap: GAP[size], ...style }}>
        {Array.from({ length: max }, (_, i) => (
          <span key={i} style={{ display: "inline-flex", lineHeight: 0 }}>
            {star(i < value)}
          </span>
        ))}
      </div>
    );
  }

  return (
    <div role="radiogroup" aria-label={ariaLabel || "별점"} style={{ display: "inline-flex", gap: GAP[size], ...style }}>
      {Array.from({ length: max }, (_, i) => {
        const n = i + 1;
        const filled = n <= active;
        return (
          <button
            key={n}
            type="button"
            role="radio"
            aria-checked={value === n}
            aria-label={`별 ${n}개`}
            disabled={readOnly}
            onMouseEnter={() => !readOnly && setHover(n)}
            onMouseLeave={() => !readOnly && setHover(0)}
            onClick={() => onChange?.(value === n ? 0 : n)}
            style={{
              display: "inline-flex",
              padding: 0,
              border: "none",
              background: "none",
              lineHeight: 0,
              cursor: readOnly ? "default" : "pointer",
              transform: !readOnly && hover === n ? "scale(1.12)" : "scale(1)",
              transition: "transform var(--dur-fast) var(--ease-standard)",
              outline: "none",
              WebkitTapHighlightColor: "transparent",
            }}
          >
            <Icon
              name="star"
              size={iconSize}
              stroke={2}
              color={filled ? "var(--rating)" : "var(--rating-track)"}
              fill={filled ? "var(--rating)" : "none"}
            />
          </button>
        );
      })}
    </div>
  );
}

export default StarRating;
