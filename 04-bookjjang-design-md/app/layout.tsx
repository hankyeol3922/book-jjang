import type { Metadata, Viewport } from "next";
import "./globals.css";

export const metadata: Metadata = {
  title: "북박이장 — 나만의 조용한 책장",
  description: "북박이장(BookJjang) — 나만의 조용한 책장. 읽은 책을 담고, 별점과 한 줄 평을 기록하는 개인 독서 기록 앱.",
};

export const viewport: Viewport = {
  width: "device-width",
  initialScale: 1,
};

export default function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <html lang="ko">
      <body>{children}</body>
    </html>
  );
}
