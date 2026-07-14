"use client";

import { useState, type CSSProperties, type ReactNode } from "react";
import { Icon } from "./Icon";

/**
 * Button — the pill CTA. Variants map to the brand's action hierarchy:
 *  primary (leaf green) · dark (ink) · soft (light green) · ghost · danger.
 */

type Variant = "primary" | "dark" | "soft" | "ghost" | "danger";
type Size = "sm" | "md" | "lg";

export interface ButtonProps {
  children?: ReactNode;
  variant?: Variant;
  size?: Size;
  block?: boolean;
  disabled?: boolean;
  iconLeft?: string;
  iconRight?: string;
  onClick?: () => void;
  style?: CSSProperties;
}

const SIZES: Record<Size, { h: number; px: number; fs: string; gap: number; icon: number }> = {
  sm: { h: 36, px: 14, fs: "var(--text-sm)", gap: 6, icon: 16 },
  md: { h: 46, px: 20, fs: "var(--text-body)", gap: 8, icon: 18 },
  lg: { h: 54, px: 26, fs: "var(--text-body-lg)", gap: 8, icon: 20 },
};

const PALETTES: Record<Variant, { bg: string; bgHover: string; bgActive: string; fg: string; bd: string }> = {
  primary: {
    bg: "var(--brand)",
    bgHover: "var(--brand-hover)",
    bgActive: "var(--brand-active)",
    fg: "var(--text-on-brand)",
    bd: "transparent",
  },
  dark: {
    bg: "var(--ink-800)",
    bgHover: "var(--ink-700)",
    bgActive: "var(--ink-900)",
    fg: "var(--text-on-dark)",
    bd: "transparent",
  },
  soft: {
    bg: "var(--brand-soft)",
    bgHover: "var(--green-300)",
    bgActive: "var(--green-300)",
    fg: "var(--brand-active)",
    bd: "transparent",
  },
  ghost: {
    bg: "transparent",
    bgHover: "var(--gray-100)",
    bgActive: "var(--gray-200)",
    fg: "var(--text-body)",
    bd: "transparent",
  },
  danger: {
    bg: "var(--danger)",
    bgHover: "#E5352B",
    bgActive: "#CC2E25",
    fg: "var(--white)",
    bd: "transparent",
  },
};

export function Button({
  children,
  variant = "primary",
  size = "md",
  block = false,
  disabled = false,
  iconLeft,
  iconRight,
  onClick,
  style,
}: ButtonProps) {
  const [hover, setHover] = useState(false);
  const [active, setActive] = useState(false);

  const s = SIZES[size];
  const p = PALETTES[variant] ?? PALETTES.primary;
  const bg = disabled ? p.bg : active ? p.bgActive : hover ? p.bgHover : p.bg;

  return (
    <button
      type="button"
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
        display: block ? "flex" : "inline-flex",
        width: block ? "100%" : "auto",
        alignItems: "center",
        justifyContent: "center",
        gap: s.gap,
        height: s.h,
        padding: `0 ${s.px}px`,
        fontFamily: "var(--font-sans)",
        fontSize: s.fs,
        fontWeight: "var(--fw-bold)",
        letterSpacing: "var(--tracking-label)",
        color: p.fg,
        background: bg,
        border: `1px solid ${p.bd}`,
        borderRadius: "var(--radius-pill)",
        cursor: disabled ? "not-allowed" : "pointer",
        opacity: disabled ? 0.4 : 1,
        transform: active && !disabled ? "scale(var(--press-scale))" : "scale(1)",
        transition:
          "background var(--dur-fast) var(--ease-standard), transform var(--dur-fast) var(--ease-standard)",
        outline: "none",
        WebkitTapHighlightColor: "transparent",
        ...style,
      }}
    >
      {iconLeft && <Icon name={iconLeft} size={s.icon} />}
      {children}
      {iconRight && <Icon name={iconRight} size={s.icon} />}
    </button>
  );
}

export default Button;
