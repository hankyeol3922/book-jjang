---
description: "Task list for 월별 독서 목표 (Monthly Reading Goals)"
---

# Tasks: 월별 독서 목표 (Monthly Reading Goals)

**Input**: `specs/001-reading-goals/` (spec.md, plan.md)

**Tests**: 포함함 — 사용자가 TDD/테스트를 명시적으로 요청. 각 스토리의 테스트는 **구현 전에 작성하고 FAIL을 확인**한다.

**Repository root for paths**: `web/`

## Format: `[ID] [P?] [Story] Description`

- **[P]**: 서로 다른 파일·의존성 없음 → 병렬 가능
- **[Story]**: US1/US2/US3 매핑

---

## Phase 1: Setup (Shared Infrastructure)

- [ ] T001 `web/`에 Vitest 도입: `vitest`, `@vitest/coverage-v8`, `@testing-library/react`, `@testing-library/jest-dom`, `jsdom` devDependencies 추가 + `web/vitest.config.mts` 작성 + `package.json`에 `"test": "vitest"` 스크립트 추가
- [ ] T002 [P] `web/vitest.setup.ts` 작성(jsdom 환경 + `@testing-library/jest-dom` matcher 등록)

---

## Phase 2: Foundational (Blocking Prerequisites)

**⚠️ 이 단계 완료 전에는 어떤 유저 스토리도 시작 불가**

- [ ] T003 `web/supabase/migrations/20260720_reading_goals.sql` 신규: `public.reading_goals`(id, user_id→profiles, year_month text 'YYYY-MM' check, target_count int check>=1, created_at, updated_at, unique(user_id, year_month))
- [ ] T004 동일 마이그레이션에 RLS 활성화 + 정책(본인 `auth.uid() = user_id`만 select/insert/update/delete) 추가
- [ ] T005 [P] `web/src/lib/reading-goals.calc.ts` 순수 계산 모듈 스캐폴드(함수 시그니처만: `validateTarget`, `computeProgress`, `feedbackFor`)
- [ ] T006 `web/src/lib/reading-goals.ts` 데이터 접근: `getGoal(userId, ym)`, `upsertGoal(userId, ym, target)`, `getMonthlyDoneCount(userId, ym)`(library_books status='done' + end_date 월범위)

**Checkpoint**: DB·데이터접근·계산 스캐폴드 준비 완료

---

## Phase 3: User Story 1 - 월별 목표 설정 (P1) 🎯 MVP

**Goal**: 사용자가 이번 달 목표 권수를 설정·수정한다.

**Independent Test**: 목표를 입력·저장 후 재진입 시 값이 유지되고, 유효하지 않은 값은 거부.

### Tests (먼저 작성, FAIL 확인) ⚠️

- [ ] T007 [P] [US1] `web/src/lib/__tests__/validateTarget.test.ts`: 1↑ 정수 통과, 0·음수·소수·빈값 거부
- [ ] T008 [US1] `web/src/app/goals/__tests__/actions.test.ts`: 저장 액션이 검증 실패 시 에러, 성공 시 upsert 호출(데이터접근 mock)

### Implementation

- [ ] T009 [US1] `reading-goals.calc.ts`의 `validateTarget` 구현 → T007 GREEN
- [ ] T010 [US1] `web/src/app/goals/actions.ts` server action: 검증 → `upsertGoal` → T008 GREEN
- [ ] T011 [US1] `web/src/app/goals/page.tsx` 목표 입력 폼(현재 목표 프리필, 저장/수정)

**Checkpoint**: US1 단독으로 동작·검증 가능

---

## Phase 4: User Story 2 - 홈 달성률 표시 (P2)

**Goal**: 홈에서 `완독/목표 · %`를 보여준다(목표 없으면 설정 유도).

**Independent Test**: 목표+완독 데이터로 홈 진입 시 정확한 수치·백분율 표시.

### Tests (먼저 작성, FAIL 확인) ⚠️

- [ ] T012 [P] [US2] `web/src/lib/__tests__/computeProgress.test.ts`: 완독0/부분/정확100%/초과(>100%)/목표없음 각 케이스

### Implementation

- [ ] T013 [US2] `reading-goals.calc.ts`의 `computeProgress(done, target)` 구현 → T012 GREEN
- [ ] T014 [US2] `web/src/app/components/GoalProgressCard.tsx`(recharts로 진행률, 초과달성 표기)
- [ ] T015 [US2] `web/src/app/page.tsx`에 카드 삽입 — 목표 있으면 진행률, 없으면 "이번 달 목표 설정" 유도

**Checkpoint**: US1 + US2 각각 독립 동작

---

## Phase 5: User Story 3 - 목표 결과 피드백 (P3)

**Goal**: 달성/월전환 시 축하·회고 문구 표시.

**Independent Test**: 완독=목표 도달 또는 새 달 진입 시 해당 문구 노출.

### Tests (먼저 작성, FAIL 확인) ⚠️

- [ ] T016 [P] [US3] `web/src/lib/__tests__/feedbackFor.test.ts`: 달성/미달/초과/새달 각 문구 분기

### Implementation

- [ ] T017 [US3] `reading-goals.calc.ts`의 `feedbackFor(done, target, isNewMonth)` 구현 → T016 GREEN
- [ ] T018 [US3] `web/src/app/components/GoalFeedback.tsx` + 홈에 연결

**Checkpoint**: 세 스토리 모두 독립 동작

---

## Phase N: Polish & Cross-Cutting

- [ ] T019 [P] 문구·접근성(aria) 다듬기
- [ ] T020 `npm run lint` + `tsc --noEmit` 통과 확인
- [ ] T021 전체 흐름 수동 검증(목표설정→홈 달성률→피드백)

---

## Dependencies & Execution Order

- **Setup(T001-2)** → **Foundational(T003-6)** → 이후 스토리.
- **US1(P1)**: Foundational 후 시작, MVP. **US2(P2)/US3(P3)**: Foundational 후 시작, US1과 독립 테스트 가능.
- 각 스토리 내: **테스트 작성·FAIL 확인 → 구현 → GREEN**. calc(순수) → data-access → server action → UI 순.

### Parallel Opportunities

- T002, T005는 [P]. 각 스토리의 테스트 `[P]`(T007/T012/T016)는 서로 독립 파일이라 병렬 작성 가능.

## Notes

- 완독 판정은 기존 `library_books.status='done' + end_date`. 신규 완독 로직 없음.
- 순수 계산을 `reading-goals.calc.ts`로 분리 → DB 없이 단위 테스트(TDD 핵심).
- 각 태스크/논리단위 후 커밋. 각 체크포인트에서 스토리 단독 검증.
