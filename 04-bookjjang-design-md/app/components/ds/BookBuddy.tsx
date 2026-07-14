"use client";

import { useEffect, useState, type CSSProperties, type SVGProps } from "react";

/**
 * BookBuddy — BookJjang's friendly book character, rendered as scalable SVG.
 * Supports multiple facial `expression`s, an optional idle `blink`, and a
 * `cycle` mode that rotates through expressions on a timer.
 */

export type Expression =
  | "happy"
  | "excited"
  | "reading"
  | "sleepy"
  | "wink"
  | "surprised"
  | "sad";

const INK = "var(--ink-900)";

const STROKE: SVGProps<SVGPathElement> = {
  stroke: INK,
  strokeWidth: 2.6,
  strokeLinecap: "round",
  fill: "none",
};

function dot(cx: number) {
  return <circle cx={cx} cy="52" r="3.5" fill={INK} />;
}
function archUp(cx: number) {
  return <path d={`M${cx - 4} 53 Q${cx} 48 ${cx + 4} 53`} {...STROKE} />;
}
function archDown(cx: number) {
  return <path d={`M${cx - 4} 51 Q${cx} 55 ${cx + 4} 51`} {...STROKE} />;
}

const Cheeks = () => (
  <>
    <ellipse cx="28" cy="59" rx="4" ry="2.6" fill="var(--red-500)" opacity="0.35" />
    <ellipse cx="62" cy="59" rx="4" ry="2.6" fill="var(--red-500)" opacity="0.35" />
  </>
);

function Face({ expression }: { expression: Expression }) {
  switch (expression) {
    case "excited":
      return (
        <g>
          <Cheeks />
          {archUp(34)}
          {archUp(56)}
          <path d="M38 60 Q45 71 52 60 Z" fill={INK} />
          <path d="M42 66 Q45 69 48 66 Z" fill="var(--red-500)" />
        </g>
      );
    case "reading":
      return (
        <g>
          {archDown(34)}
          {archDown(56)}
          <path d="M40 62 Q45 65 50 62" {...STROKE} />
        </g>
      );
    case "sleepy":
      return (
        <g>
          {archDown(34)}
          {archDown(56)}
          <ellipse cx="45" cy="63" rx="2.4" ry="3" fill={INK} />
          <text x="60" y="40" fontSize="10" fontWeight="800" fill={INK} opacity="0.55" fontFamily="var(--font-sans)">
            z
          </text>
          <text x="66" y="33" fontSize="7" fontWeight="800" fill={INK} opacity="0.4" fontFamily="var(--font-sans)">
            z
          </text>
        </g>
      );
    case "wink":
      return (
        <g>
          <Cheeks />
          {dot(34)}
          {archUp(56)}
          <path d="M38 60 Q45 67 52 60" {...STROKE} />
        </g>
      );
    case "surprised":
      return (
        <g>
          <circle cx="34" cy="51" r="4.2" fill="#fff" stroke={INK} strokeWidth="2" />
          <circle cx="56" cy="51" r="4.2" fill="#fff" stroke={INK} strokeWidth="2" />
          <circle cx="34" cy="51.5" r="1.8" fill={INK} />
          <circle cx="56" cy="51.5" r="1.8" fill={INK} />
          <ellipse cx="45" cy="63" rx="3" ry="3.6" fill={INK} />
        </g>
      );
    case "sad":
      return (
        <g>
          {dot(34)}
          {dot(56)}
          <path d="M38 65 Q45 59 52 65" {...STROKE} />
        </g>
      );
    case "happy":
    default:
      return (
        <g>
          <Cheeks />
          {dot(34)}
          {dot(56)}
          <path d="M38 60 Q45 68 52 60" {...STROKE} />
        </g>
      );
  }
}

export type Character = "book" | "duck" | "tomato";

export interface BookBuddyProps {
  expression?: Expression;
  character?: Character;
  size?: number;
  bookmark?: boolean;
  blink?: boolean;
  cycle?: boolean;
  cycleMs?: number;
  cycleList?: Expression[];
  style?: CSSProperties;
}

export function BookBuddy({
  expression = "happy",
  character = "book",
  size = 80,
  bookmark = true,
  blink = true,
  cycle = false,
  cycleMs = 2600,
  cycleList,
  style,
}: BookBuddyProps) {
  // Duck / tomato characters render a fixed happy face (eyes aligned to the book
  // at cx34/56 so accessories transfer). Only "book" uses the full expression set.
  if (character !== "book") {
    const w = size;
    const h = size * 1.06;
    return (
      <div style={{ width: w, height: h, ...style }}>
        <svg viewBox="0 0 100 106" width={w} height={h} style={{ display: "block", overflow: "visible" }} role="img" aria-label={`${character} character`}>
          {character === "duck" ? <DuckArt /> : <TomatoArt />}
        </svg>
      </div>
    );
  }

  const list = cycleList ?? ["happy", "reading", "wink", "excited", "sleepy"];
  const [i, setI] = useState(0);
  const cycling = cycle && list.length > 0;

  useEffect(() => {
    if (!cycling) return;
    const reduce =
      typeof window !== "undefined" &&
      window.matchMedia &&
      window.matchMedia("(prefers-reduced-motion: reduce)").matches;
    if (reduce) return;
    const t = setInterval(() => setI((n) => (n + 1) % list.length), cycleMs);
    return () => clearInterval(t);
  }, [cycling, cycleMs, list.length]);

  const expr: Expression = cycling ? list[i] : expression;
  const openEyes = expr === "happy" || expr === "sad"; // blink only when both eyes are round
  const w = size;
  const h = size * 1.06;

  return (
    <div style={{ width: w, height: h, ...style }}>
      <svg
        viewBox="0 0 100 106"
        width={w}
        height={h}
        style={{ display: "block", overflow: "visible" }}
        role="img"
        aria-label={`book character — ${expr}`}
      >
        <rect x="24" y="14" width="70" height="86" rx="7" fill="#fff" stroke="var(--gray-200)" strokeWidth="1.5" />
        <rect x="8" y="8" width="72" height="90" rx="8" fill="var(--brand)" />
        <path d="M8 16 Q8 8 16 8 L20 8 L20 98 L16 98 Q8 98 8 90 Z" fill="var(--green-700)" />
        {bookmark && <path d="M60 4 L70 4 L70 30 L65 25 L60 30 Z" fill="var(--red-500)" />}

        {blink && openEyes ? (
          <g style={{ transformBox: "fill-box" }}>
            <g transform="translate(0,52)">
              <animateTransform
                attributeName="transform"
                attributeType="XML"
                type="scale"
                values="1 1;1 1;1 0.1;1 1"
                keyTimes="0;0.92;0.96;1"
                dur="4.2s"
                repeatCount="indefinite"
                additive="sum"
              />
              <circle cx="34" cy="0" r="3.5" fill={INK} />
              <circle cx="56" cy="0" r="3.5" fill={INK} />
            </g>
            {expr === "sad" ? (
              <path d="M38 65 Q45 59 52 65" stroke={INK} strokeWidth="2.6" strokeLinecap="round" fill="none" />
            ) : (
              <>
                <ellipse cx="28" cy="59" rx="4" ry="2.6" fill="var(--red-500)" opacity="0.35" />
                <ellipse cx="62" cy="59" rx="4" ry="2.6" fill="var(--red-500)" opacity="0.35" />
                <path d="M38 60 Q45 68 52 60" stroke={INK} strokeWidth="2.6" strokeLinecap="round" fill="none" />
              </>
            )}
          </g>
        ) : (
          <Face expression={expr} />
        )}
      </svg>
    </div>
  );
}

function DuckArt() {
  return (
    <g>
      {/* body */}
      <ellipse cx="47" cy="59" rx="37" ry="43" fill="var(--gold-500)" />
      {/* wing */}
      <path d="M15 56 Q6 67 17 79 Q28 74 25 57 Z" fill="#E3AE37" />
      {/* tufts */}
      <path d="M42 17 Q45 6 48 16" stroke="#E3AE37" strokeWidth="3" fill="none" strokeLinecap="round" />
      <path d="M48 16 Q51 5 54 16" stroke="#E3AE37" strokeWidth="3" fill="none" strokeLinecap="round" />
      {/* cheeks */}
      <ellipse cx="25" cy="60" rx="4.5" ry="3" fill="var(--red-500)" opacity="0.35" />
      <ellipse cx="65" cy="60" rx="4.5" ry="3" fill="var(--red-500)" opacity="0.35" />
      {/* eyes (aligned to book cx34/56) */}
      <circle cx="34" cy="51" r="3.8" fill={INK} />
      <circle cx="56" cy="51" r="3.8" fill={INK} />
      {/* beak */}
      <path d="M39 60 L57 60 L48 70 Z" fill="#F0913D" />
    </g>
  );
}

function TomatoArt() {
  return (
    <g>
      {/* body */}
      <circle cx="46" cy="62" r="39" fill="#EE5B4A" />
      {/* gloss */}
      <ellipse cx="31" cy="47" rx="8" ry="5" fill="#fff" opacity="0.22" transform="rotate(-25 31 47)" />
      {/* calyx (green top) */}
      <path d="M46 7 L40 21 L30 17 L38 26 L27 28 L40 31 L46 21 L52 31 L65 28 L54 26 L62 17 L52 21 Z" fill="var(--green-700)" />
      <rect x="44" y="4" width="4" height="9" rx="2" fill="var(--green-700)" />
      {/* cheeks */}
      <ellipse cx="26" cy="64" rx="4.5" ry="3" fill="#B83224" opacity="0.4" />
      <ellipse cx="66" cy="64" rx="4.5" ry="3" fill="#B83224" opacity="0.4" />
      {/* eyes */}
      <circle cx="34" cy="51" r="3.8" fill={INK} />
      <circle cx="56" cy="51" r="3.8" fill={INK} />
      {/* smile */}
      <path d="M38 61 Q45 69 52 61" stroke={INK} strokeWidth="2.6" strokeLinecap="round" fill="none" />
    </g>
  );
}

export default BookBuddy;
