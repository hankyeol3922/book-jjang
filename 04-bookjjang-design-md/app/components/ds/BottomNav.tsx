"use client";

import type { CSSProperties } from "react";
import { IconButton } from "./IconButton";

/**
 * BottomNav — the fixed circular-button bar that anchors the app. One item is
 * the emphasized `primary` action (large, filled green, elevated); the rest are
 * soft/ghost circles. Floats over content with a soft top edge.
 */

export interface BottomNavItem {
  key: string;
  icon: string;
  label?: string;
  primary?: boolean;
}

export interface BottomNavProps {
  items?: BottomNavItem[];
  activeKey?: string;
  onSelect?: (key: string) => void;
  style?: CSSProperties;
}

export function BottomNav({ items = [], activeKey, onSelect, style }: BottomNavProps) {
  return (
    <nav
      style={{
        display: "flex",
        alignItems: "center",
        justifyContent: "center",
        gap: "var(--space-5)",
        padding: "12px 20px calc(12px + env(safe-area-inset-bottom, 0px))",
        background: "color-mix(in srgb, var(--surface-card) 88%, transparent)",
        backdropFilter: "blur(10px)",
        WebkitBackdropFilter: "blur(10px)",
        borderTop: "1px solid var(--divider)",
        ...style,
      }}
    >
      {items.map((it) => {
        const isPrimary = !!it.primary;
        const isActive = it.key === activeKey;
        const itemStyle: CSSProperties | undefined = isPrimary
          ? { marginTop: -20 } // lift the center action above the bar
          : !isActive
            ? { background: "var(--brand-soft)", color: "var(--white)" }
            : undefined;

        return (
          <IconButton
            key={it.key}
            icon={it.icon}
            aria-label={it.label || it.key}
            onClick={() => onSelect?.(it.key)}
            size={isPrimary ? "xl" : "lg"}
            elevated={isPrimary}
            variant={isPrimary ? "brand" : isActive ? "brand" : "soft"}
            style={itemStyle}
          />
        );
      })}
    </nav>
  );
}

export default BottomNav;
