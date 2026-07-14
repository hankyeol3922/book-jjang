"use client";

import { useState, type ReactNode } from "react";
import { BookCover, Button, Input, StarRating, Textarea, TopBar } from "../ds";
import type { BookCoverTint } from "../ds";

/**
 * 기록하기 (Book record) — leave a rating, one-line review and memo on a book,
 * then save it to the shelf. Covers PRD P0-4~7 (rating required; review/memo
 * optional). No persistence backend yet: the draft is handed to `onSave`.
 * See DESIGN.md §11.4.
 */

export interface RecordBook {
  id: string;
  title: string;
  author: string;
  publisher: string;
  year: string;
  tint: BookCoverTint;
  cover?: string; // real cover image URL (Aladin); falls back to placeholder
}

export interface RecordDraft {
  rating: number;
  review: string;
  memo: string;
}

export function BookRecord({
  book,
  initial,
  onBack,
  onSave,
  isEditing = false,
  onDelete,
}: {
  book: RecordBook;
  initial?: RecordDraft;
  onBack: () => void;
  onSave: (draft: RecordDraft) => void;
  isEditing?: boolean;
  onDelete?: () => void;
}) {
  const [rating, setRating] = useState(initial?.rating ?? 0);
  const [review, setReview] = useState(initial?.review ?? "");
  const [memo, setMemo] = useState(initial?.memo ?? "");
  const [confirmDelete, setConfirmDelete] = useState(false);

  return (
    <>
      {/* top bar */}
      <div style={{ background: "var(--surface-card)", borderBottom: "1px solid var(--divider)", zIndex: 20 }}>
        <TopBar title={isEditing ? "기록 수정" : "기록하기"} leading="chevron-left" onLeading={onBack} />
      </div>

      {/* body */}
      <div style={{ flex: 1, minHeight: 0, overflowY: "auto", padding: "16px 20px 24px" }}>
        {/* book header */}
        <div style={{ display: "flex", flexDirection: "column", alignItems: "center", textAlign: "center", gap: 10, marginBottom: 22 }}>
          <BookCover title={book.title} src={book.cover} tint={book.tint} size="lg" />
          <div>
            <div style={{ fontSize: "var(--text-h2)", fontWeight: "var(--fw-bold)", color: "var(--text-strong)", lineHeight: 1.3 }}>
              {book.title}
            </div>
            <div style={{ marginTop: 4, fontSize: "var(--text-body)", color: "var(--text-muted)" }}>{book.author}</div>
            <div style={{ marginTop: 2, fontSize: "var(--text-xs)", color: "var(--text-subtle)" }}>
              {book.publisher} · {book.year}
            </div>
          </div>
        </div>

        {/* rating */}
        <Section title="별점" hint={rating > 0 ? `${rating}/5` : "탭해서 별점을 남겨요"}>
          <div style={{ display: "flex", justifyContent: "center", padding: "4px 0 2px" }}>
            <StarRating value={rating} onChange={setRating} size="lg" aria-label="별점" />
          </div>
        </Section>

        {/* one-line review */}
        <Section title="한 줄 평" optional>
          <Input value={review} onChange={setReview} placeholder="이 책을 한 줄로 남긴다면?" aria-label="한 줄 평" />
        </Section>

        {/* memo */}
        <Section title="메모" optional>
          <Textarea value={memo} onChange={setMemo} placeholder="자유롭게 남겨보세요" rows={4} maxLength={500} aria-label="메모" />
        </Section>

        <Button
          variant="primary"
          size="lg"
          block
          iconLeft="check"
          disabled={rating === 0}
          onClick={() => onSave({ rating, review: review.trim(), memo: memo.trim() })}
        >
          {isEditing ? "수정 완료" : "서재에 담기"}
        </Button>

        {isEditing && onDelete ? (
          <div style={{ marginTop: 10 }}>
            <Button
              variant={confirmDelete ? "danger" : "ghost"}
              size="md"
              block
              iconLeft="trash-2"
              onClick={() => (confirmDelete ? onDelete() : setConfirmDelete(true))}
            >
              {confirmDelete ? "한 번 더 누르면 서재에서 빠져요" : "서재에서 빼기"}
            </Button>
          </div>
        ) : (
          <p style={{ margin: "10px 0 0", textAlign: "center", fontSize: "var(--text-xs)", color: "var(--text-subtle)" }}>
            별점을 남기면 서재에 담을 수 있어요
          </p>
        )}
      </div>
    </>
  );
}

function Section({ title, hint, optional, children }: { title: string; hint?: string; optional?: boolean; children: ReactNode }) {
  return (
    <section style={{ marginBottom: 18 }}>
      <div style={{ display: "flex", alignItems: "baseline", justifyContent: "space-between", marginBottom: 8 }}>
        <span style={{ fontSize: "var(--text-body)", fontWeight: "var(--fw-bold)", color: "var(--text-strong)" }}>
          {title}
          {optional && (
            <span style={{ marginLeft: 6, fontSize: "var(--text-xs)", fontWeight: "var(--fw-regular)", color: "var(--text-subtle)" }}>
              선택
            </span>
          )}
        </span>
        {hint && <span style={{ fontSize: "var(--text-sm)", color: "var(--text-muted)" }}>{hint}</span>}
      </div>
      {children}
    </section>
  );
}

export default BookRecord;
