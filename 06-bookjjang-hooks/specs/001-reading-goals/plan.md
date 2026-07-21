# Implementation Plan: 월별 독서 목표 (Monthly Reading Goals)

**Branch**: `001-reading-goals` (구현은 워크트리 `wt1`/`worktree-wt1`에서 진행 예정) | **Date**: 2026-07-20 | **Spec**: [spec.md](./spec.md)

**Input**: Feature specification from `specs/001-reading-goals/spec.md`

## Summary

사용자가 월별 목표 권수를 설정하고, 홈에서 이번 달 `완독/목표 · 달성률(%)`을 확인하며, 달성/월전환 시 피드백을 받는다. 완독 판정은 기존 `library_books`(status=`done` + `end_date`)를 재사용하고, 목표만 새 테이블 `reading_goals`로 저장한다. 표시는 기존에 설치된 `recharts`를 활용한다.

## Technical Context

**Language/Version**: TypeScript 5, React 19.2.4

**Primary Dependencies**: Next.js 16.2.10 (App Router), @supabase/ssr ^0.12, @supabase/supabase-js ^2.110, recharts ^3.9 (진행률 시각화), Tailwind 4

**Storage**: Supabase Postgres. 기존 테이블 `profiles`, `books`, `library_books`(enum `reading_status`=`want|reading|done`). 신규 테이블 `reading_goals`.

**Testing**: 현재 없음 → **Vitest + @testing-library/react + jsdom 신규 도입**(순수 로직은 vitest 단위 테스트, 컴포넌트는 testing-library).

**Target Platform**: 모바일 우선 반응형 웹(기존 앱과 동일).

**Project Type**: Web application (Next.js 단일 앱, `web/`).

**Performance Goals**: 홈 달성률 1초 이내 표시(SC-002).

**Constraints**: 완독 집계는 서버에서 수행(RLS로 본인 데이터만). 익명 세션도 `profiles` 행이 있으므로 동일 경로 사용.

**Scale/Scope**: 개인용 독서 앱, 사용자당 월 1개 목표 행. 화면 영향: 홈 + 목표설정 진입점.

## Constitution Check

`.specify/memory/constitution.md` 미작성 상태(원칙 게이트 없음). 위반 없음 → 통과. (원하면 나중에 `/speckit-constitution`으로 프로젝트 원칙 수립 가능.)

## Project Structure

### Documentation (this feature)

```text
specs/001-reading-goals/
├── spec.md              # 완료
├── plan.md              # 이 파일
├── data-model.md        # 아래 Data Model 섹션으로 대체(별도 파일 생략)
├── tasks.md             # /speckit-tasks 산출물
└── checklists/
    └── requirements.md  # 완료(전 항목 통과)
```

### Source Code (repository root = `web/`)

```text
web/
├── supabase/
│   ├── schema.sql                         # 기존
│   └── migrations/
│       └── 20260720_reading_goals.sql     # 신규: reading_goals 테이블 + RLS
├── src/
│   ├── lib/
│   │   ├── reading-goals.ts               # 신규: 목표 CRUD + 월 완독 집계 데이터 접근
│   │   └── reading-goals.calc.ts          # 신규: 순수 계산(달성률/상태 판정) — 테스트 용이
│   ├── app/
│   │   ├── page.tsx                        # 수정: 홈에 달성률 카드 삽입
│   │   ├── goals/
│   │   │   ├── page.tsx                    # 신규: 목표 설정 화면
│   │   │   └── actions.ts                  # 신규: 목표 저장 server action(검증 포함)
│   │   └── components/
│   │       ├── GoalProgressCard.tsx        # 신규(US2): 홈 달성률 카드
│   │       └── GoalFeedback.tsx            # 신규(US3): 달성/회고 피드백
└── src/**/__tests__/                       # 신규: vitest 테스트
```

**Structure Decision**: 기존 `web/` 단일 Next.js 앱 구조를 그대로 사용. 순수 계산 로직(`reading-goals.calc.ts`)을 데이터 접근(`reading-goals.ts`)과 분리해 TDD 단위 테스트를 쉽게 한다.

## Data Model

**신규 `public.reading_goals`**
- `id uuid pk default gen_random_uuid()`
- `user_id uuid not null references public.profiles(id) on delete cascade`
- `year_month text not null`  — 'YYYY-MM' 형식(check 제약)
- `target_count int not null check (target_count >= 1)`
- `created_at timestamptz not null default now()`, `updated_at ... default now()`
- `unique (user_id, year_month)`
- RLS: 본인(`auth.uid() = user_id`) 행만 select/insert/update/delete.

**완독 집계(기존 재사용, 신규 테이블 없음)**
- 이번 달 완독 권수 = `count(*) from library_books where user_id = me and status = 'done' and end_date >= '월초' and end_date <= '월말'`.

## Complexity Tracking

위반 없음 — 해당 없음.
