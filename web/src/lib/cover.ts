// 표지 이미지가 없는 책을 위한 결정적(deterministic) 그라디언트 폴백

const PALETTE = [
  ['#7c3aed', '#4f46e5'],
  ['#0891b2', '#0e7490'],
  ['#e11d48', '#9f1239'],
  ['#1e3a8a', '#312e81'],
  ['#f59e0b', '#d97706'],
  ['#64748b', '#475569'],
  ['#059669', '#047857'],
]

/** 같은 책이면 항상 같은 색이 나오도록 문자열 해시로 팔레트를 고른다 */
export function gradientFor(seed: string): string {
  let hash = 0
  for (let i = 0; i < seed.length; i++) {
    hash = (hash * 31 + seed.charCodeAt(i)) | 0
  }
  const [from, to] = PALETTE[Math.abs(hash) % PALETTE.length]
  return `linear-gradient(135deg,${from},${to})`
}
