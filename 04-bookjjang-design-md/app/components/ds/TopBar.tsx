"use client";

import type { CSSProperties } from "react";
import { Icon } from "./Icon";
import { IconButton } from "./IconButton";

/**
 * TopBar — fixed app header. Either shows the BookJjang wordmark (home) or a
 * centered title with an optional dropdown chevron (sub-screens). `leading` is
 * an optional icon-name; `actions` render as ghost IconButtons on the right.
 * `stats` render as small icon+count chips (e.g. streak / friends).
 */

export interface TopBarStat {
  icon: string;
  value: string | number;
  color?: string;
}

export interface TopBarAction {
  icon: string;
  label?: string;
  onClick?: () => void;
}

export interface TopBarProps {
  wordmark?: boolean;
  title?: string;
  withChevron?: boolean;
  leading?: string;
  onLeading?: () => void;
  stats?: TopBarStat[];
  actions?: TopBarAction[];
  style?: CSSProperties;
}

export function TopBar({
  wordmark = false,
  title,
  withChevron = false,
  leading,
  onLeading,
  stats = [],
  actions = [],
  style,
}: TopBarProps) {
  return (
    <header
      style={{
        display: "flex",
        alignItems: "center",
        gap: "var(--space-3)",
        height: 56,
        padding: "0 16px",
        background: "color-mix(in srgb, var(--surface-card) 88%, transparent)",
        backdropFilter: "blur(10px)",
        WebkitBackdropFilter: "blur(10px)",
        ...style,
      }}
    >
      {leading ? (
        <IconButton icon={leading} variant="ghost" size="md" onClick={onLeading} aria-label="menu" />
      ) : null}

      {wordmark ? (
        <span
          style={{
            fontFamily: "var(--font-display)",
            fontSize: 22,
            fontWeight: 900,
            letterSpacing: "-0.03em",
            color: "var(--text-strong)",
            whiteSpace: "nowrap",
          }}
        >
          북박이장
        </span>
      ) : (
        <div style={{ flex: 1, display: "flex", alignItems: "center", justifyContent: "center", gap: 6 }}>
          <span
            style={{
              fontFamily: "var(--font-display)",
              fontSize: "var(--text-h3)",
              fontWeight: "var(--fw-bold)",
              color: "var(--text-strong)",
              whiteSpace: "nowrap",
            }}
          >
            {title}
          </span>
          {withChevron && <Icon name="chevron-down" size={18} color="var(--ink-500)" />}
        </div>
      )}

      {wordmark && <div style={{ flex: 1 }} />}

      <div style={{ display: "flex", alignItems: "center", gap: "var(--space-3)" }}>
        {stats.map((s, i) => (
          <span
            key={i}
            style={{
              display: "inline-flex",
              alignItems: "center",
              gap: 5,
              color: "var(--ink-700)",
              fontSize: "var(--text-body)",
              fontWeight: "var(--fw-bold)",
            }}
          >
            <Icon name={s.icon} size={20} color={s.color || "var(--ink-600)"} />
            {s.value}
          </span>
        ))}
        {actions.map((a, i) => (
          <IconButton
            key={i}
            icon={a.icon}
            variant="ghost"
            size="md"
            onClick={a.onClick}
            aria-label={a.label || a.icon}
          />
        ))}
      </div>
    </header>
  );
}

export default TopBar;
