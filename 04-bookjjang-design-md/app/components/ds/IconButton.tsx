"use client";

import { useState, type CSSProperties } from "react";
import { Icon } from "./Icon";

/**
 * IconButton — a circular icon-only button. The bottom-nav + header workhorse.
 * variants: brand (filled green, elevated) · soft (light green) · ghost · plain.
 */

type Variant = "brand" | "soft" | "ghost" | "plain";
type Size = "sm" | "md" | "lg" | "xl";

export interface IconButtonProps {
  icon: string;
  variant?: Variant;
  size?: Size;
  elevated?: boolean;
  disabled?: boolean;
  "aria-label"?: string;
  onClick?: () => void;
  style?: CSSProperties;
}

const SIZES: Record<Size, number> = { sm: 36, md: 44, lg: 56, xl: 64 };
const ICON_SIZES: Record<Size, number> = { sm: 18, md: 22, lg: 26, xl: 28 };

const PALETTES: Record<Variant, { bg: string; bgHover: string; bgActive: string; fg: string }> = {
  brand: {
    bg: "var(--brand)",
    bgHover: "var(--brand-hover)",
    bgActive: "var(--brand-active)",
    fg: "var(--white)",
  },
  soft: {
    bg: "var(--brand-soft)",
    bgHover: "var(--green-300)",
    bgActive: "var(--green-300)",
    fg: "var(--white)",
  },
  ghost: {
    bg: "transparent",
    bgHover: "var(--gray-100)",
    bgActive: "var(--gray-200)",
    fg: "var(--ink-600)",
  },
  plain: {
    bg: "var(--surface-sunken)",
    bgHover: "var(--gray-200)",
    bgActive: "var(--gray-300)",
    fg: "var(--ink-700)",
  },
};

export function IconButton({
  icon,
  variant = "ghost",
  size = "md",
  elevated = false,
  disabled = false,
  "aria-label": ariaLabel,
  onClick,
  style,
}: IconButtonProps) {
  const [hover, setHover] = useState(false);
  const [active, setActive] = useState(false);

  const dim = SIZES[size];
  const iconSize = ICON_SIZES[size];
  const p = PALETTES[variant] ?? PALETTES.ghost;
  const bg = disabled ? p.bg : active ? p.bgActive : hover ? p.bgHover : p.bg;

  return (
    <button
      type="button"
      aria-label={ariaLabel}
      disabled={disabled}
      onClick={onClick}
      onMouseEnter={() => setHover(true)}
      onMouseLeave={() => {
        setHover(false);
        setActive(false);
      }}
      onMouseDown={() => setActive(true)}
      onMouseUp={() => setActive(false)}
      style={{
        display: "inline-flex",
        alignItems: "center",
        justifyContent: "center",
        width: dim,
        height: dim,
        color: p.fg,
        background: bg,
        border: "none",
        borderRadius: "var(--radius-pill)",
        cursor: disabled ? "not-allowed" : "pointer",
        opacity: disabled ? 0.4 : 1,
        boxShadow: elevated && variant === "brand" ? "var(--shadow-brand)" : "none",
        transform: active && !disabled ? "scale(var(--press-scale))" : "scale(1)",
        transition:
          "background var(--dur-fast) var(--ease-standard), transform var(--dur-fast) var(--ease-standard)",
        outline: "none",
        WebkitTapHighlightColor: "transparent",
        ...style,
      }}
    >
      <Icon name={icon} size={iconSize} />
    </button>
  );
}

export default IconButton;
