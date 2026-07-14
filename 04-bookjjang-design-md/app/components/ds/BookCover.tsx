"use client";

import type { CSSProperties } from "react";
import { Icon } from "./Icon";

/**
 * BookCover — a book-cover thumbnail. With no real artwork available it renders
 * a tasteful placeholder: a tinted card (semantic tint tokens), a subtle spine
 * on the left, and the title's first characters in near-black. Pass `src` to
 * show a real cover image once artwork exists.
 */

type Size = "sm" | "md" | "lg";
export type BookCoverTint = "sage" | "gold" | "rose" | "mist";

export interface BookCoverProps {
  title?: string;
  src?: string;
  size?: Size;
  tint?: BookCoverTint;
  style?: CSSProperties;
}

const SIZES: Record<Size, { w: number; h: number; fs: number; radius: string }> = {
  sm: { w: 44, h: 62, fs: 15, radius: "var(--radius-sm)" },
  md: { w: 56, h: 78, fs: 18, radius: "var(--radius-sm)" },
  lg: { w: 72, h: 100, fs: 22, radius: "var(--radius-md)" },
};

const TINTS: Record<BookCoverTint, string> = {
  sage: "var(--brand-tint)",
  gold: "var(--gold-50)",
  rose: "var(--danger-tint)",
  mist: "var(--surface-sunken)",
};

function initials(title: string): string {
  return title.trim().slice(0, 2);
}

export function BookCover({ title, src, size = "sm", tint = "sage", style }: BookCoverProps) {
  const s = SIZES[size];
  const bg = TINTS[tint] ?? TINTS.sage;

  return (
    <div
      aria-hidden={!title}
      style={{
        position: "relative",
        width: s.w,
        height: s.h,
        flex: "0 0 auto",
        borderRadius: s.radius,
        background: bg,
        overflow: "hidden",
        boxShadow: "var(--shadow-xs)",
        display: "flex",
        alignItems: "center",
        justifyContent: "center",
        ...style,
      }}
    >
      {/* spine */}
      <span
        style={{
          position: "absolute",
          top: 0,
          left: 0,
          bottom: 0,
          width: 4,
          background: "color-mix(in srgb, var(--text-strong) 8%, transparent)",
        }}
      />
      {src ? (
        // eslint-disable-next-line @next/next/no-img-element
        <img
          src={src}
          alt={title ? `${title} 표지` : ""}
          style={{ width: "100%", height: "100%", objectFit: "cover" }}
        />
      ) : title ? (
        <span
          style={{
            fontFamily: "var(--font-display)",
            fontSize: s.fs,
            fontWeight: "var(--fw-bold)",
            letterSpacing: "-0.02em",
            lineHeight: 1.1,
            color: "var(--text-strong)",
            textAlign: "center",
            padding: "0 4px",
          }}
        >
          {initials(title)}
        </span>
      ) : (
        <Icon name="book-open" size={Math.round(s.w * 0.42)} color="var(--text-subtle)" />
      )}
    </div>
  );
}

export default BookCover;
