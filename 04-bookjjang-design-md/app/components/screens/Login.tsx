"use client";

import { useState } from "react";
import { BookBuddy } from "../ds";

/**
 * 로그인 (Login) — the pre-auth welcome screen. Since there is no backend yet,
 * "Google로 계속하기" simulates sign-in (sets the logged-in state). Covers PRD
 * P0-1. See DESIGN.md §11.5.
 */
export function Login({ onLogin }: { onLogin: () => void }) {
  return (
    <div
      style={{
        flex: 1,
        minHeight: 0,
        display: "flex",
        flexDirection: "column",
        alignItems: "center",
        padding: "24px 28px 32px",
      }}
    >
      {/* hero */}
      <div
        style={{
          flex: 1,
          display: "flex",
          flexDirection: "column",
          alignItems: "center",
          justifyContent: "center",
          textAlign: "center",
          gap: 6,
        }}
      >
        <BookBuddy expression="happy" size={120} />
        <div
          style={{
            marginTop: 18,
            fontFamily: "var(--font-display)",
            fontSize: "var(--text-display)",
            fontWeight: 900,
            letterSpacing: "-0.03em",
            color: "var(--text-strong)",
          }}
        >
          북박이장
        </div>
        <p
          style={{
            margin: "8px 0 0",
            fontSize: "var(--text-body-lg)",
            lineHeight: 1.55,
            color: "var(--text-muted)",
            maxWidth: 260,
          }}
        >
          나만의 조용한 책장.
          <br />읽은 책을 담고 별점과 한 줄 평을 남겨요.
        </p>
      </div>

      {/* sign-in */}
      <div style={{ width: "100%", display: "flex", flexDirection: "column", alignItems: "center", gap: 14 }}>
        <GoogleButton onClick={onLogin} />
        <p style={{ margin: 0, fontSize: "var(--text-xs)", color: "var(--text-subtle)", textAlign: "center" }}>
          로그인하면 나만의 책장을 시작할 수 있어요
        </p>
      </div>
    </div>
  );
}

function GoogleButton({ onClick }: { onClick: () => void }) {
  const [hover, setHover] = useState(false);
  const [active, setActive] = useState(false);
  return (
    <button
      type="button"
      onClick={onClick}
      onMouseEnter={() => setHover(true)}
      onMouseLeave={() => {
        setHover(false);
        setActive(false);
      }}
      onMouseDown={() => setActive(true)}
      onMouseUp={() => setActive(false)}
      style={{
        display: "flex",
        alignItems: "center",
        justifyContent: "center",
        gap: 10,
        width: "100%",
        height: 54,
        padding: "0 20px",
        background: hover ? "var(--gray-50)" : "var(--surface-card)",
        color: "var(--text-body)",
        border: "1px solid var(--border)",
        borderRadius: "var(--radius-pill)",
        boxShadow: "var(--shadow-sm)",
        cursor: "pointer",
        fontFamily: "var(--font-sans)",
        fontSize: "var(--text-body-lg)",
        fontWeight: "var(--fw-bold)",
        transform: active ? "scale(var(--press-scale))" : "scale(1)",
        transition: "background var(--dur-fast) var(--ease-standard), transform var(--dur-fast) var(--ease-standard)",
        outline: "none",
        WebkitTapHighlightColor: "transparent",
      }}
    >
      <GoogleG />
      Google로 계속하기
    </button>
  );
}

// Official Google "G" mark (brand colors — external brand, literal hex, not tokens).
function GoogleG() {
  return (
    <svg width="20" height="20" viewBox="0 0 48 48" aria-hidden="true" style={{ flex: "0 0 auto" }}>
      <path fill="#EA4335" d="M24 9.5c3.54 0 6.71 1.22 9.21 3.6l6.85-6.85C35.9 2.38 30.47 0 24 0 14.62 0 6.51 5.38 2.56 13.22l7.98 6.19C12.43 13.72 17.74 9.5 24 9.5z" />
      <path fill="#4285F4" d="M46.98 24.55c0-1.57-.15-3.09-.38-4.55H24v9.02h12.94c-.58 2.96-2.26 5.48-4.78 7.18l7.73 6c4.51-4.18 7.09-10.36 7.09-17.65z" />
      <path fill="#FBBC05" d="M10.53 28.59c-.48-1.45-.76-2.99-.76-4.59s.27-3.14.76-4.59l-7.98-6.19C.92 16.46 0 20.12 0 24c0 3.88.92 7.54 2.56 10.78l7.97-6.19z" />
      <path fill="#34A853" d="M24 48c6.48 0 11.93-2.13 15.89-5.81l-7.73-6c-2.15 1.45-4.92 2.3-8.16 2.3-6.26 0-11.57-4.22-13.47-9.91l-7.98 6.19C6.51 42.62 14.62 48 24 48z" />
    </svg>
  );
}

export default Login;
