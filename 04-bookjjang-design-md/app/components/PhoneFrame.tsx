"use client";

import type { CSSProperties, ReactNode } from "react";
import { BottomNav, Icon } from "./ds";
import type { BottomNavItem } from "./ds";

/**
 * PhoneFrame — the shared 390×844 phone mockup shell. Owns the device bezel,
 * notch, status bar, bottom nav and home indicator; screens supply their own
 * TopBar + content via `children`. Extracted from the original page.tsx so the
 * empty library and book search screens can share one frame. See DESIGN.md §5.4.
 */

export interface PhoneFrameProps {
  children: ReactNode;
  nav?: {
    items: BottomNavItem[];
    activeKey?: string;
    onSelect?: (key: string) => void;
  };
  toast?: string | null;
  statusTime?: string;
}

const CHROME: CSSProperties = { background: "var(--surface-card)", zIndex: 20 };

export function PhoneFrame({ children, nav, toast, statusTime = "9:41" }: PhoneFrameProps) {
  return (
    <div
      style={{
        minHeight: "100vh",
        display: "flex",
        alignItems: "center",
        justifyContent: "center",
        padding: "48px 24px",
      }}
    >
      {/* phone device */}
      <div
        style={{
          width: 390,
          height: 844,
          background: "#1a1c17",
          borderRadius: 56,
          padding: 13,
          boxShadow:
            "0 40px 80px -24px rgba(34,38,31,.5), 0 8px 24px rgba(34,38,31,.2)",
        }}
      >
        {/* screen */}
        <div
          style={{
            position: "relative",
            width: "100%",
            height: "100%",
            background: "var(--surface-page)",
            borderRadius: 44,
            overflow: "hidden",
            display: "flex",
            flexDirection: "column",
          }}
        >
          {/* dynamic island / notch */}
          <div
            style={{
              position: "absolute",
              top: 11,
              left: "50%",
              transform: "translateX(-50%)",
              width: 118,
              height: 34,
              background: "#0d0f0b",
              borderRadius: 99,
              zIndex: 30,
            }}
          />

          {/* status bar */}
          <div
            style={{
              display: "flex",
              alignItems: "center",
              justifyContent: "space-between",
              padding: "15px 30px 8px",
              fontSize: 15,
              fontWeight: 700,
              color: "var(--text-strong)",
              ...CHROME,
            }}
          >
            <span>{statusTime}</span>
            <span style={{ fontSize: 13, letterSpacing: "1px" }}>▮▮▮▯</span>
          </div>

          {/* screen content (screen supplies TopBar + body) */}
          <div
            style={{
              flex: 1,
              minHeight: 0,
              display: "flex",
              flexDirection: "column",
              overflow: "hidden",
            }}
          >
            {children}
          </div>

          {/* toast — floats above the nav, over any screen */}
          {toast && (
            <div
              role="status"
              style={{
                position: "absolute",
                left: "50%",
                bottom: nav ? 104 : 28,
                transform: "translateX(-50%)",
                display: "inline-flex",
                alignItems: "center",
                gap: 8,
                maxWidth: "calc(100% - 40px)",
                padding: "10px 16px",
                background: "var(--surface-dark)",
                color: "var(--text-on-dark)",
                borderRadius: "var(--radius-pill)",
                boxShadow: "var(--shadow-md)",
                fontSize: "var(--text-sm)",
                fontWeight: "var(--fw-semibold)",
                whiteSpace: "nowrap",
                overflow: "hidden",
                textOverflow: "ellipsis",
                zIndex: 40,
              }}
            >
              <Icon name="check" size={16} color="var(--brand-soft)" />
              <span style={{ overflow: "hidden", textOverflow: "ellipsis" }}>{toast}</span>
            </div>
          )}

          {/* bottom nav */}
          {nav && (
            <div style={{ borderTop: "1px solid var(--divider)", ...CHROME }}>
              <BottomNav activeKey={nav.activeKey} items={nav.items} onSelect={nav.onSelect} />
            </div>
          )}

          {/* home indicator */}
          <div style={{ display: "flex", justifyContent: "center", padding: "6px 0 9px", ...CHROME }}>
            <div
              style={{
                width: 134,
                height: 5,
                borderRadius: 99,
                background: "var(--ink-900)",
                opacity: 0.85,
              }}
            />
          </div>
        </div>
      </div>
    </div>
  );
}

export default PhoneFrame;
