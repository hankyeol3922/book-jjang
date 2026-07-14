"use client";

import { useState, type CSSProperties, type KeyboardEvent } from "react";
import { Icon } from "./Icon";
import { IconButton } from "./IconButton";

/**
 * Input — a single-line text field. Rounded (radius-md), sits on --surface-card
 * with a --border outline that turns --brand on focus and shows a --focus-ring
 * glow (the token was previously defined but unused — see DESIGN.md O-4).
 * Optional leading icon and a clear (x) button when `clearable`.
 */

type Size = "md" | "lg";

export interface InputProps {
  value: string;
  onChange?: (value: string) => void;
  placeholder?: string;
  iconLeft?: string;
  clearable?: boolean;
  onClear?: () => void;
  size?: Size;
  type?: string;
  disabled?: boolean;
  autoFocus?: boolean;
  "aria-label"?: string;
  onKeyDown?: (e: KeyboardEvent<HTMLInputElement>) => void;
  style?: CSSProperties;
}

const SIZES: Record<Size, { h: number; px: number; fs: string; icon: number }> = {
  md: { h: 46, px: 14, fs: "var(--text-body)", icon: 18 },
  lg: { h: 54, px: 16, fs: "var(--text-body-lg)", icon: 20 },
};

export function Input({
  value,
  onChange,
  placeholder,
  iconLeft,
  clearable = false,
  onClear,
  size = "md",
  type = "text",
  disabled = false,
  autoFocus = false,
  "aria-label": ariaLabel,
  onKeyDown,
  style,
}: InputProps) {
  const [focused, setFocused] = useState(false);
  const s = SIZES[size];
  const showClear = clearable && value.length > 0 && !disabled;

  return (
    <div
      style={{
        display: "flex",
        alignItems: "center",
        gap: 8,
        height: s.h,
        padding: `0 ${s.px}px`,
        background: "var(--surface-card)",
        border: `1px solid ${focused ? "var(--brand)" : "var(--border)"}`,
        borderRadius: "var(--radius-md)",
        boxShadow: focused
          ? "0 0 0 3px color-mix(in srgb, var(--focus-ring) 55%, transparent)"
          : "var(--shadow-xs)",
        transition:
          "border-color var(--dur-fast) var(--ease-standard), box-shadow var(--dur-fast) var(--ease-standard)",
        opacity: disabled ? 0.5 : 1,
        ...style,
      }}
    >
      {iconLeft && (
        <Icon
          name={iconLeft}
          size={s.icon}
          color={focused ? "var(--brand)" : "var(--text-subtle)"}
        />
      )}
      <input
        className="ds-input-field"
        value={value}
        onChange={(e) => onChange?.(e.target.value)}
        placeholder={placeholder}
        type={type}
        disabled={disabled}
        autoFocus={autoFocus}
        aria-label={ariaLabel || placeholder}
        onFocus={() => setFocused(true)}
        onBlur={() => setFocused(false)}
        onKeyDown={onKeyDown}
        style={{
          flex: 1,
          minWidth: 0,
          height: "100%",
          margin: 0,
          padding: 0,
          border: "none",
          outline: "none",
          background: "transparent",
          fontFamily: "var(--font-sans)",
          fontSize: s.fs,
          fontWeight: "var(--fw-medium)",
          color: "var(--text-body)",
          caretColor: "var(--brand)",
        }}
      />
      {showClear && (
        <IconButton
          icon="x"
          variant="ghost"
          size="sm"
          aria-label="지우기"
          onClick={() => {
            onChange?.("");
            onClear?.();
          }}
        />
      )}
    </div>
  );
}

export default Input;
