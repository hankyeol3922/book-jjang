# CLAUDE.md

북박이장(BookJjang) — 읽은 책을 담고 별점·한 줄 평·메모를 기록하는 **개인 독서 기록 앱**. 스택은 Next.js / React / TypeScript다. 이 문서는 이 리포에서 작업하는 AI 에이전트를 위한 지침이다.

## 디자인 작업 규칙 (필수)

**이 리포에서 디자인과 관련된 작업을 하기 전에는 반드시 리포 루트의 [`DESIGN.md`](./DESIGN.md)를 먼저 읽는다.**
`DESIGN.md`는 북박이장의 **디자인 정본(single source of truth)** 으로, 모든 컬러/타이포/스페이싱/radius/shadow/모션 토큰, 컴포넌트 API, 마스코트(BookBuddy), 화면 명세, 마이크로카피가 원문 값으로 정리되어 있다.

- **먼저 읽기:** 아래 "디자인 작업"에 해당하는 요청을 받으면, 코드를 수정하기 전에 `DESIGN.md`의 관련 섹션을 읽고 그 값·규칙을 따른다.
- **정본 우선:** 색/폰트/여백/모션 값은 임의로 정하지 말고 `DESIGN.md`에 정의된 **semantic alias 토큰**(`--brand`, `--text-strong`, `--surface-page` 등)을 사용한다. raw 램프 직접 사용 금지.
- **무손실 유지:** 토큰·컴포넌트 값을 변경/추가하면, 같은 변경을 `DESIGN.md`에도 반영해 정본과 코드가 어긋나지 않게 한다(부록 커버리지 검증 갱신 포함).
- **정본에 없으면:** 필요한 토큰/컴포넌트/화면이 `DESIGN.md`에 없으면 임의 생성하지 말고, `DESIGN.md`의 "열린 질문(Open Questions)"을 확인한 뒤 사용자와 결정하거나 정본에 먼저 추가한다.

### "디자인 작업"의 범위 (트리거)
다음 중 하나라도 해당하면 위 규칙을 적용한다:
- `app/globals.css`의 디자인 토큰(컬러/타이포/스페이싱/radius/shadow/모션) 추가·수정
- `app/components/ds/**`의 컴포넌트(생성·props/variant/size/state 변경)
- `app/**`의 화면/레이아웃/폰 프레임/빈 상태 등 UI 구성
- 색상·폰트·아이콘(lucide)·마스코트(BookBuddy) 표현·마이크로카피(한국어 UI 문구) 변경
- 새 화면·컴포넌트·디자인 패턴 추가

## 프로젝트 구조

- [`DESIGN.md`](./DESIGN.md) — 디자인 정본(토큰·컴포넌트·화면·마이크로카피)
- `app/globals.css` — 디자인 토큰(semantic alias + raw 램프)
- `app/components/ds/` — 디자인 시스템 컴포넌트(`Icon`, `Button`, `IconButton`, `TopBar`, `BottomNav`)
- `app/layout.tsx`, `app/page.tsx` — 루트 레이아웃 및 화면
- `01-prd.md` — 제품 요구사항(배경 참고)
