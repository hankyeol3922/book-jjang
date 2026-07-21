// 닉네임 규칙 — 클라이언트/서버가 공유하는 단일 소스.
// DB CHECK(char_length(nickname) between 2 and 20) 및 트리거 clamp 규칙과 일치.

export const NICKNAME_MIN = 2
export const NICKNAME_MAX = 20

/** 앞뒤 공백을 제외한 실제 글자 수 (유니코드 코드포인트 기준) */
export function nicknameLength(raw: string): number {
  return [...raw.trim()].length
}

/** 공백 제외 2~20자인지 */
export function isValidNickname(raw: string): boolean {
  const len = nicknameLength(raw)
  return len >= NICKNAME_MIN && len <= NICKNAME_MAX
}
