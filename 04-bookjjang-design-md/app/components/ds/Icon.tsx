"use client";

import type { CSSProperties } from "react";
import {
  Search,
  Home,
  Library,
  Settings,
  User,
  Plus,
  ChevronDown,
  ChevronRight,
  ChevronLeft,
  Star,
  Flame,
  BookOpen,
  Signal,
  Wifi,
  BatteryFull,
  Calendar,
  List,
  Archive,
  Trash2,
  X,
  Check,
  LogOut,
  Lock,
  type LucideIcon,
} from "lucide-react";

/**
 * Icon — thin wrapper over Lucide line icons. Matches the design system's
 * `Icon` API (name / size / stroke / color) but resolves the glyph from
 * `lucide-react` instead of the CDN script. Color inherits `currentColor`.
 */

const REGISTRY: Record<string, LucideIcon> = {
  search: Search,
  home: Home,
  library: Library,
  settings: Settings,
  user: User,
  plus: Plus,
  "chevron-down": ChevronDown,
  "chevron-right": ChevronRight,
  "chevron-left": ChevronLeft,
  star: Star,
  flame: Flame,
  "book-open": BookOpen,
  signal: Signal,
  wifi: Wifi,
  "battery-full": BatteryFull,
  calendar: Calendar,
  list: List,
  archive: Archive,
  "trash-2": Trash2,
  x: X,
  check: Check,
  "log-out": LogOut,
  lock: Lock,
};

export interface IconProps {
  name: string;
  size?: number;
  stroke?: number;
  color?: string;
  fill?: string;
  style?: CSSProperties;
  className?: string;
}

export function Icon({
  name,
  size = 20,
  stroke = 2,
  color,
  fill,
  style,
  className,
}: IconProps) {
  const Glyph = REGISTRY[name];
  const baseStyle: CSSProperties = {
    display: "inline-flex",
    width: size,
    height: size,
    color: color ?? "inherit",
    flex: "0 0 auto",
    ...style,
  };

  if (!Glyph) {
    // Unknown name — render an empty slot rather than crashing.
    return <i className={className} style={baseStyle} aria-hidden />;
  }

  return (
    <Glyph
      width={size}
      height={size}
      strokeWidth={stroke}
      fill={fill}
      className={className}
      style={baseStyle}
    />
  );
}

export default Icon;
