"use client";

import { useState, type CSSProperties } from "react";

/**
 * Textarea — multi-line text input for longer notes (메모, P0-7). Shares the
 * Input visual language (surface-card, --border → --brand on focus, --focus-ring
 * glow). Shows a character counter when `maxLength` is set. See DESIGN.md O-9.
 */

export interface TextareaProps {
  value: string;
  onChange?: (value: string) => void;
  placeholder?: string;
  rows?: number;
  maxLength?: number;
  disabled?: boolean;
  "aria-label"?: string;
  style?: CSSProperties;
}

export function Textarea({
  value,
  onChange,
  placeholder,
  rows = 4,
  maxLength,
  disabled = false,
  "aria-label": ariaLabel,
  style,
}: TextareaProps) {
  const [focused, setFocused] = useState(false);

  return (
    <div style={{ display: "flex", flexDirection: "column" }}>
      <div
        style={{
          background: "var(--surface-card)",
          border: `1px solid ${focused ? "var(--brand)" : "var(--border)"}`,
          borderRadius: "var(--radius-md)",
          boxShadow: focused
            ? "0 0 0 3px color-mix(in srgb, var(--focus-ring) 55%, transparent)"
            : "var(--shadow-xs)",
          transition:
            "border-color var(--dur-fast) var(--ease-standard), box-shadow var(--dur-fast) var(--ease-standard)",
          opacity: disabled ? 0.5 : 1,
          padding: "10px 14px",
          ...style,
        }}
      >
        <textarea
          className="ds-input-field"
          value={value}
          onChange={(e) => onChange?.(e.target.value)}
          placeholder={placeholder}
          rows={rows}
          maxLength={maxLength}
          disabled={disabled}
          aria-label={ariaLabel || placeholder}
          onFocus={() => setFocused(true)}
          onBlur={() => setFocused(false)}
          style={{
            display: "block",
            width: "100%",
            margin: 0,
            padding: 0,
            border: "none",
            outline: "none",
            background: "transparent",
            resize: "none",
            fontFamily: "var(--font-sans)",
            fontSize: "var(--text-body)",
            lineHeight: "var(--lh-body)",
            fontWeight: "var(--fw-medium)",
            color: "var(--text-body)",
            caretColor: "var(--brand)",
          }}
        />
      </div>
      {maxLength && (
        <div style={{ alignSelf: "flex-end", marginTop: 4, fontSize: "var(--text-xs)", color: "var(--text-subtle)" }}>
          {value.length}/{maxLength}
        </div>
      )}
    </div>
  );
}

export default Textarea;
