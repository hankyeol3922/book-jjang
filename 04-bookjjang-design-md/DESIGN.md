# 북박이장(BookJjang) · DESIGN.md — 디자인 정본(正本)

> **이 문서의 목적.** 북박이장 리포지토리(`04-bookjjang-design-md`)의 디자인 정보를 **단 한 조각도 잃지 않고(Zero Information Loss)** 하나의 정본으로 응축한다. 모든 색상 HEX·px·ms·배수·cubic-bezier 값은 **원문 그대로** 옮겼으며, 요약·반올림·근사를 하지 않았다. 이 문서만 읽고도 현재 구현의 토큰·컴포넌트·화면을 코드 없이 재현할 수 있어야 한다.
>
> **출처 표기 규칙.** 코드/시안에서 직접 확인한 값은 그대로 기록하고, 코드 위치를 `경로:라인`으로 병기한다. 필자가 추론·보완한 내용은 _(추론)_ 으로, 근거가 불명확한 값은 `근거: TBD` 로, 소스에 없는 것은 "미정의/미구현"으로 명시한다. 토큰은 semantic alias를 앞세우고 참조 raw 램프를 병기한다(예: `--brand (= --green-500 = #4FA557)`).
>
> **기준 리포.** 인접 폴더 `../02-bookjjang_design-system`, `../03-bookjjang-hi-fi` 는 확인 결과 PRD·폰트·레퍼런스 이미지 사본만 담고 있어 추가 디자인 소스가 없다. 본 문서는 **현재 리포의 실제 구현**을 정본으로 삼는다.

---

## 목차 (Table of Contents)

1. [개요 & 디자인 철학](#1-개요--디자인-철학)
2. [디자인 원칙(Principles)](#2-디자인-원칙principles)
3. [컬러 시스템](#3-컬러-시스템)
4. [타이포그래피](#4-타이포그래피)
5. [레이아웃 & 스페이싱](#5-레이아웃--스페이싱)
6. [모양(Radius) · 그림자(Shadow/Elevation)](#6-모양radius--그림자shadowelevation)
7. [모션 & 인터랙션](#7-모션--인터랙션)
8. [아이코노그래피](#8-아이코노그래피)
9. [컴포넌트 라이브러리](#9-컴포넌트-라이브러리)
10. [마스코트 — BookBuddy](#10-마스코트--bookbuddy)
11. [화면 명세(Screens)](#11-화면-명세screens)
12. [패턴(Patterns)](#12-패턴patterns)
13. [보이스 & 톤 / 마이크로카피](#13-보이스--톤--마이크로카피)
14. [접근성](#14-접근성)
15. [에셋 인벤토리 & 레퍼런스](#15-에셋-인벤토리--레퍼런스)
16. [PRD ↔ 디자인 매핑](#16-prd--디자인-매핑)
17. [미정의 / 열린 질문(Open Questions)](#17-미정의--열린-질문open-questions)
- [부록: 커버리지 검증](#부록-커버리지-검증)

---

## 1. 개요 & 디자인 철학

- **제품 한 줄 정의.** 북박이장(BookJjang) — 읽은 책을 담고, 별점과 한 줄 평·메모를 기록하는 **개인 독서 기록 앱**. ("book(책) + 붙박이장"에서 온 이름.) 출처: `app/layout.tsx:6`, `01-prd.md:1,12`.
- **브랜드 성격.** **"나만의 조용한 책장"** — 소셜 압박 없이 책을 차곡차곡 쌓아가는 개인 아카이브. 앱 UI에도 태그라인 "나만의 조용한 책장"이 그대로 등장한다. 출처: `01-prd.md:28,118`, `app/page.tsx:146`.
- **타깃 경험.** 검색 → 서재 추가 → 기록까지 **3분 이내** 첫 책 기록, 부담 없는 빠른 기록, 표지 중심의 시각적 책장. 출처: `01-prd.md:38,118`.
- **비주얼 톤.** 따뜻한 세이지빛 배경(`--surface-page = #F0F2EA`) 위에 잎사귀 그린(`--brand = #4FA557`)을 포인트로 쓰고, 친근한 책 캐릭터 **BookBuddy**가 정서를 담당한다. 알약형(pill) 버튼과 원형 아이콘 버튼, 부드러운 그림자로 말랑한 인상을 준다.
- **PRD 6장 "경험 원칙" 연결.** "소셜 압박 없는 조용한 개인 책장. 빠른 기록, 부담 없는 UI, 표지 중심의 시각적 책장." (`01-prd.md:118`) → 디자인은 이를 ①차분한 저채도 팔레트 ②마스코트의 다정한 넛지 ③큰 터치 타깃의 단순한 3탭 내비게이션으로 구현한다. _(추론)_

---

## 2. 디자인 원칙(Principles)

각 원칙과 그것이 현재 UI에서 구현되는 방식. (원칙 명칭은 PRD 경험 원칙과 코드에서 관찰한 패턴을 근거로 정리 — 명칭 자체는 _(추론)_, 구현 근거는 코드.)

| # | 원칙 | UI 구현 방식 |
|---|------|-------------|
| P1 | **조용함(Quiet)** _(추론)_ | 저채도 세이지 배경 + 단일 브랜드 그린 포인트. 강한 색은 별점 gold·경고 red로 제한. 소셜/알림 요소 없음. |
| P2 | **다정함(Warmth)** _(추론)_ | 마스코트 BookBuddy가 빈 상태에서 낮잠(sleepy)을 자며 감정을 전달. 볼터치(Cheeks, red-500 opacity 0.35), 둥근 표정. |
| P3 | **부담 없는 기록(Effortless)** _(추론)_ | 큰 알약형 CTA(`Button size=lg`), 명확한 단일 행동 유도("책 검색하러 가기"). 3탭 하단 내비의 중앙 강조 버튼. |
| P4 | **표지 중심의 시각성 · 캐릭터 은유(Visual shelf)** | 두 뷰: **홈=북버디 옷 갈아입히기(§11.6)** — 읽기를 캐릭터 꾸미기 보상으로, **내 서재=3열 표지 그리드(§11.2)**. 표지 이미지는 플레이스홀더(틴트+이니셜)이며 알라딘 실사 표지 연동은 §11.3·O-15. |
| P5 | **일관된 토큰(Systematic)** | 소비자 코드는 raw 램프를 직접 쓰지 않고 semantic alias(`--brand`, `--text-strong`, …)만 참조하도록 설계. 출처: `app/globals.css:5,56`. |
| P6 | **큰 터치 타깃(Touchable)** _(추론)_ | 원형 버튼 최소 36px(sm)~64px(xl), 알약 버튼 높이 36/46/54px. 중앙 primary 내비 버튼 64px. |

---

## 3. 컬러 시스템

전체 정의 출처: `app/globals.css:17–88`. **사용 규칙: 소비자(컴포넌트/화면)는 semantic alias만 참조하고 raw 램프를 직접 쓰지 않는다.** (`app/globals.css:5` 주석에 명시.) 단, 코드에서 일부 컴포넌트가 raw 램프(`--green-300`, `--ink-800` 등)를 직접 참조하는 예외가 존재하며 아래 컴포넌트 섹션·열린 질문에 기록한다.

### 3.1 원시 램프(Raw ramps) — 전수

**Brand green (primary)** — 잎사귀 그린 램프. `--green-500`이 기본 브랜드 색.

| 토큰 | HEX | 스와치 설명 |
|------|-----|------------|
| `--green-50`  | `#EDF4E8` | 아주 옅은 연둣빛 틴트 (배경/tint) |
| `--green-100` | `#DAEBD0` | 옅은 연두 |
| `--green-200` | `#B7DCA6` | 부드러운 소프트 그린 |
| `--green-300` | `#92CC7C` | 중간 연두 (focus-ring) |
| `--green-400` | `#6DB95C` | 생기 있는 초록 |
| `--green-500` | `#4FA557` | **primary brand green** (잎사귀) |
| `--green-600` | `#3E8C46` | 진한 초록 (hover/link) |
| `--green-700` | `#2E7238` | 가장 진한 초록 (active) |

**Ink (near-black slate, faintly warm)** — 텍스트/다크 표면용 웜 그레이-블랙 램프.

| 토큰 | HEX | 스와치 설명 |
|------|-----|------------|
| `--ink-900` | `#22261F` | 거의 검정, 미세한 웜 (강조 텍스트) |
| `--ink-800` | `#2B2F27` | 매우 진한 잉크 (본문/다크 표면) |
| `--ink-700` | `#3C4038` | 진한 잉크 |
| `--ink-600` | `#575C51` | 중간-진한 잉크 |
| `--ink-500` | `#797E71` | 중간 잉크 (뮤트 텍스트) |
| `--ink-400` | `#9BA093` | 옅은 잉크 (subtle 텍스트) |
| `--ink-300` | `#C3C7BC` | 가장 옅은 잉크 |

**Neutral surfaces (warm sage-tinted)** — 표면/보더용 세이지빛 뉴트럴.

| 토큰 | HEX | 스와치 설명 |
|------|-----|------------|
| `--sage-page` | `#F0F2EA` | 페이지 배경 세이지 |
| `--gray-50`  | `#FAFBF8` | 거의 흰색 |
| `--gray-100` | `#F1F3ED` | 옅은 그레이 (sunken) |
| `--gray-200` | `#E7E9E1` | 옅은 그레이 (divider/blobs) |
| `--gray-300` | `#DDE0D6` | 중간 그레이 (border) |
| `--gray-400` | `#CDD0C6` | 진한 그레이 (border-strong) |
| `--white`    | `#FFFFFF` | 순백 (카드 표면) |

**Accents** — 별점 골드 · 경고 레드.

| 토큰 | HEX | 스와치 설명 |
|------|-----|------------|
| `--red-500` | `#FF5247` | 경고/삭제 레드 (마스코트 볼터치·북마크에도 사용) |
| `--red-50`  | `#FFEBEA` | 옅은 레드 틴트 |
| `--gold-500`| `#EFC24B` | 별점 골드 |
| `--gold-50` | `#FBF3D8` | 옅은 골드 틴트 |

### 3.2 Semantic alias — 전수

| Alias | 참조 램프 | 최종 HEX | 용도 |
|-------|----------|---------|------|
| `--brand` | `--green-500` | `#4FA557` | 주 브랜드/버튼/강조 |
| `--brand-hover` | `--green-600` | `#3E8C46` | 브랜드 hover |
| `--brand-active` | `--green-700` | `#2E7238` | 브랜드 active/press |
| `--brand-soft` | `--green-200` | `#B7DCA6` | 소프트 브랜드 배경(soft 버튼) |
| `--brand-tint` | `--green-50` | `#EDF4E8` | 옅은 브랜드 틴트(아바타 배경 등) |
| `--text-strong` | `--ink-900` | `#22261F` | 강조 텍스트(제목/워드마크) |
| `--text-body` | `--ink-800` | `#2B2F27` | 본문 텍스트 |
| `--text-muted` | `--ink-500` | `#797E71` | 보조 텍스트 |
| `--text-subtle` | `--ink-400` | `#9BA093` | 가장 옅은 텍스트 |
| `--text-on-brand` | `--white` | `#FFFFFF` | 브랜드 위 텍스트 |
| `--text-on-dark` | `--white` | `#FFFFFF` | 다크 표면 위 텍스트 |
| `--text-link` | `--green-600` | `#3E8C46` | 링크 |
| `--surface-page` | `--sage-page` | `#F0F2EA` | 페이지 배경 |
| `--surface-card` | `--white` | `#FFFFFF` | 카드/헤더/내비 표면 |
| `--surface-sunken` | `--gray-100` | `#F1F3ED` | 눌린 표면(plain IconButton 배경) |
| `--surface-dark` | `--ink-800` | `#2B2F27` | 다크 표면 |
| `--surface-blobs` | `--gray-200` | `#E7E9E1` | 배경 블롭/장식 |
| `--border` | `--gray-300` | `#DDE0D6` | 기본 보더 |
| `--border-strong` | `--gray-400` | `#CDD0C6` | 강한 보더 |
| `--divider` | `--gray-200` | `#E7E9E1` | 구분선(헤더/내비 경계) |
| `--success` | `--green-600` | `#3E8C46` | 성공 상태 |
| `--success-tint` | `--green-50` | `#EDF4E8` | 성공 틴트 |
| `--danger` | `--red-500` | `#FF5247` | 위험/삭제 |
| `--danger-tint` | `--red-50` | `#FFEBEA` | 위험 틴트 |
| `--rating` | `--gold-500` | `#EFC24B` | 별점 채움 |
| `--rating-track` | `--gray-300` | `#DDE0D6` | 별점 빈 트랙 |
| `--focus-ring` | `--green-300` | `#92CC7C` | 포커스 링 |

### 3.3 토큰이 아닌 하드코딩 색상 (Zero-loss 기록)

코드에 존재하지만 CSS 변수로 토큰화되지 않은 색상 값 — **삭제하지 않고 기록**한다.

| 값 | 위치 | 용도 | 비고 |
|----|------|------|------|
| `#d9ddcf` | `app/globals.css:163` | `body` 배경(폰 목업 뒤 "책상" 배경) | 토큰 미정의 · `근거: TBD` |
| `#1a1c17` | `app/page.tsx:38` | 폰 디바이스 베젤(기기 몸체) | 토큰 미정의 |
| `#0d0f0b` | `app/page.tsx:65` | 다이나믹 아일랜드/노치 | 토큰 미정의 |
| `#E5352B` | `app/components/ds/Button.tsx:64` | `danger` 버튼 hover 배경 | red-500보다 진한 값, 토큰 미정의 |
| `#CC2E25` | `app/components/ds/Button.tsx:65` | `danger` 버튼 active 배경 | 토큰 미정의 |
| `#fff` | `app/components/ds/BookBuddy.tsx:171,92,93` | 책 표지(페이지)·surprised 눈 흰자 | `--white`와 동일하나 리터럴 사용 |
| `rgba(34,38,31,.5)` / `rgba(34,38,31,.2)` | `app/page.tsx:41` | 폰 목업 드롭섀도 | ink-900(#22261F=34,38,31) 기반, 토큰 미사용 |
| `#EA4335`/`#4285F4`/`#FBBC05`/`#34A853` | `Login.tsx` | Google G 로고 4색 | 외부 브랜드 색 |
| `#F0913D` | `BookBuddy.tsx`(DuckArt) | 오리 부리(주황) | 캐릭터 리터럴 |
| `#E3AE37` | `BookBuddy.tsx`(DuckArt) | 오리 날개/깃(진노랑) | 캐릭터 리터럴 |
| `#EE5B4A` / `#B83224` | `BookBuddy.tsx`(TomatoArt) | 토마토 몸통 / 볼터치 | 캐릭터 리터럴 |
| `#E2895A`/`#BE6A3C`/`#F2E7CE`/`#5A4636` | `Home.tsx` | 옷·소품 니트 세트 팔레트(WOOL/WOOL_D/CREAM/안경프레임) | 한 세트 통일용 리터럴 |
| `#3E8DC4`·`#E56A5E`·`#8A6BC0`(+파생) | `Home.tsx`(THEMES) | 테마 색 프리셋 ocean/coral/grape의 `--brand` 계열 오버라이드 | sage는 토큰(green) 기반, 나머지는 리터럴 |

---

## 4. 타이포그래피

정의 출처: `app/globals.css:8–15, 90–115`.

### 4.1 폰트

- **UI 서체:** Pretendard Variable (한글 + 라틴 UI face), **가변 weight 45–920**.
- **@font-face 정의** (`app/globals.css:9–15`):
  - `font-family: "Pretendard Variable"`
  - `font-weight: 45 920` (가변 범위)
  - `font-style: normal`
  - `font-display: swap`
  - `src: url("/fonts/PretendardVariable.woff2") format("woff2-variations")`
- **font-family 폴백 체인** (`--font-sans`, `app/globals.css:93–94`):
  ```
  "Pretendard Variable", -apple-system, BlinkMacSystemFont,
  "Apple SD Gothic Neo", "Malgun Gothic", system-ui, sans-serif
  ```
- **`--font-display`** = `var(--font-sans)` (별도 디스플레이 서체 없음, 동일 폰트 사용).

### 4.2 Weight 토큰

| 토큰 | 값 |
|------|----|
| `--fw-regular` | `400` |
| `--fw-medium` | `500` |
| `--fw-semibold` | `600` |
| `--fw-bold` | `700` |
| `--fw-extrabold` | `800` |

> 참고: 워드마크는 토큰을 쓰지 않고 `fontWeight: 900`(TopBar), `fontWeight: 700`(상태바) 등 리터럴을 사용하는 곳이 있다. 아래 컴포넌트 섹션 참조.

### 4.3 타입 스케일 — 전 항목

| 토큰 | size | line-height(토큰) | 용도 _(추론)_ |
|------|------|------------------|------|
| `--text-display` / `--lh-display` | `34px` | `1.24` | 최상위 디스플레이 |
| `--text-h1` / `--lh-h1` | `26px` | `1.30` | 페이지 제목 |
| `--text-h2` / `--lh-h2` | `21px` | `1.34` | 섹션 제목 |
| `--text-h3` / `--lh-h3` | `18px` | `1.40` | 소제목(TopBar 타이틀·프로필명·빈상태 제목) |
| `--text-body-lg` / `--lh-body-lg` | `17px` | `1.60` | 큰 본문(빈상태 설명·lg 버튼) |
| `--text-body` / `--lh-body` | `15px` | `1.60` | 기본 본문(md 버튼·stats) |
| `--text-sm` / `--lh-sm` | `13px` | `1.50` | 작은 텍스트(프로필 서브·sm 버튼) |
| `--text-xs` / `--lh-xs` | `12px` | `1.40` | 캡션/최소 텍스트 |

### 4.4 Tracking(letter-spacing) 토큰

| 토큰 | 값 | 용도 _(추론)_ |
|------|----|------|
| `--tracking-display` | `-0.02em` | 디스플레이 |
| `--tracking-heading` | `-0.01em` | 제목 |
| `--tracking-body` | `0em` | 본문 |
| `--tracking-label` | `0.01em` | 라벨/버튼 텍스트(Button이 사용) |

> 리터럴 tracking 사용처: 워드마크 `letter-spacing: -0.03em`(`TopBar.tsx:71`), 상태바 배터리 글리프 `letterSpacing: "1px"`(`page.tsx:87`).

---

## 5. 레이아웃 & 스페이싱

정의 출처: `app/globals.css:117–133`.

### 5.1 Spacing 스케일 — 전수

| 토큰 | 값 |
|------|----|
| `--space-0` | `0` |
| `--space-1` | `4px` |
| `--space-2` | `8px` |
| `--space-3` | `12px` |
| `--space-4` | `16px` |
| `--space-5` | `20px` |
| `--space-6` | `24px` |
| `--space-8` | `32px` |
| `--space-10` | `40px` |
| `--space-12` | `48px` |
| `--space-16` | `64px` |

> 스케일에 `space-7`, `space-9`, `space-11`, `space-13~15` 는 **정의되지 않음**(의도적 서브셋).

### 5.2 레이아웃 토큰

| 토큰 | 값 | 의미 |
|------|----|------|
| `--page-gutter` | `20px` | 페이지 좌우 여백 |
| `--content-max` | `480px` | 콘텐츠 최대 폭 |

### 5.3 반응형 / 브레이크포인트

- **미정의.** `globals.css`에 미디어 쿼리·브레이크포인트 토큰 없음. PRD는 "반응형 웹 우선"(`01-prd.md:121,148`)이나 현재 구현은 고정 390×844 폰 목업 하나뿐이다 → 열린 질문 O-1.

### 5.4 폰 프레임 규격 (공유 셸 `app/components/PhoneFrame.tsx`)

> **셸 추출.** 폰 목업(디바이스·노치·상태바·하단 내비·홈 인디케이터)은 검색 화면 추가와 함께 `app/page.tsx`에서 `PhoneFrame` 컴포넌트로 분리되었다. 값은 아래와 **동일**하다(원래 `page.tsx`의 리터럴을 무손실 이전). 아래 표의 `page.tsx:라인`은 추출 이전 기준의 역사적 출처이며, 현재 위치는 `PhoneFrame.tsx`다. `page.tsx`는 이제 `activeKey` 상태로 화면(빈 서재/검색)을 스위치하는 셸이다.

| 요소 | 값 | 위치 |
|------|----|------|
| 디바이스 크기 | `width 390 × height 844` | `page.tsx:35–36` |
| 디바이스 베젤 색 | `#1a1c17` | `page.tsx:38` |
| 디바이스 radius | `56` | `page.tsx:39` |
| 디바이스 패딩(베젤 두께) | `13` | `page.tsx:40` |
| 디바이스 그림자 | `0 40px 80px -24px rgba(34,38,31,.5), 0 8px 24px rgba(34,38,31,.2)` | `page.tsx:41` |
| 스크린 radius | `44` | `page.tsx:50` |
| 스크린 배경 | `var(--surface-page)` | `page.tsx:49` |
| 노치(다이나믹 아일랜드) | `top 11`, `width 118`, `height 34`, `background #0d0f0b`, `radius 99`, `zIndex 30` | `page.tsx:58–69` |
| 상태바 | `padding 15px 30px 8px`, `fontSize 15`, `fw 700`, `color text-strong`, `background surface-card` | `page.tsx:73–88` |
| 상태바 시각 | 좌 `9:41` · 우 `▮▮▮▯`(`fontSize 13`, `letterSpacing 1px`) | `page.tsx:86–87` |
| 홈 인디케이터 | `width 134 × height 5`, `radius 99`, `background ink-900`, `opacity 0.85`, 컨테이너 `padding 6px 0 9px` | `page.tsx:205–222` |
| 바깥 페이지 패딩 | `48px 24px` (폰을 중앙 배치) | `page.tsx:30` |

---

## 6. 모양(Radius) · 그림자(Shadow/Elevation)

정의 출처: `app/globals.css:135–146`.

### 6.1 Radius — 전수

| 토큰 | 값 | 사용처 _(추론/확인)_ |
|------|----|------|
| `--radius-sm` | `8px` | 작은 요소 |
| `--radius-md` | `12px` | 카드/입력 |
| `--radius-lg` | `16px` | 큰 카드 |
| `--radius-xl` | `24px` | 시트/모달 |
| `--radius-2xl` | `28px` | 큰 시트 |
| `--radius-pill` | `999px` | **모든 버튼·IconButton·칩**(Button/IconButton이 사용) |

> 폰 목업의 `56/44` radius(디바이스/스크린), 노치·홈인디케이터 `99` radius는 토큰이 아닌 리터럴이다(`page.tsx`).

### 6.2 Shadow / Elevation — 전수

| 토큰 | 값 | 언제 쓰나 _(추론/확인)_ |
|------|----|------|
| `--shadow-xs` | `0 1px 2px rgba(34, 38, 31, 0.04)` | 미세한 분리 |
| `--shadow-sm` | `0 2px 8px rgba(34, 38, 31, 0.06)` | 카드 기본 |
| `--shadow-md` | `0 6px 20px rgba(34, 38, 31, 0.08)` | 떠 있는 카드 |
| `--shadow-lg` | `0 12px 32px rgba(34, 38, 31, 0.10)` | 시트/모달 |
| `--shadow-brand` | `0 8px 20px rgba(79, 165, 87, 0.32)` | **elevated brand IconButton**(중앙 내비 버튼)이 사용. 출처: `IconButton.tsx:98` |

> 그림자 rgba 기준색: `rgba(34,38,31,…)` = `--ink-900 #22261F`, `rgba(79,165,87,…)` = `--brand #4FA557`. 폰 목업 그림자는 별도 리터럴(위 5.4).

---

## 7. 모션 & 인터랙션

정의 출처: `app/globals.css:88, 148–153`.

### 7.1 모션 토큰 — 전수

| 토큰 | 값 |
|------|----|
| `--ease-standard` | `cubic-bezier(0.2, 0.8, 0.2, 1)` |
| `--ease-out` | `cubic-bezier(0.16, 1, 0.3, 1)` |
| `--dur-fast` | `120ms` |
| `--dur-base` | `200ms` |
| `--dur-slow` | `320ms` |
| `--press-scale` | `0.96` |
| `--focus-ring` | `var(--green-300) = #92CC7C` (색상이지만 포커스용) |

### 7.2 인터랙션 상태 규칙

Button / IconButton 공통(출처: `Button.tsx:81–124`, `IconButton.tsx:65–108`):

| 상태 | 처리 |
|------|------|
| **hover** | `bgHover` 팔레트 색으로 배경 전환. transition: `background var(--dur-fast) var(--ease-standard)` |
| **active(press)** | `bgActive` 색 + `transform: scale(var(--press-scale))`(=0.96). disabled가 아닐 때만. transition에 `transform var(--dur-fast) var(--ease-standard)` 포함 |
| **disabled** | `opacity: 0.4`, `cursor: not-allowed`, hover/active/press 무효(배경은 기본 `bg` 고정) |
| **focus** | `outline: "none"` — 커스텀 포커스 링 미적용. `--focus-ring` 토큰은 정의되어 있으나 컴포넌트에서 **미사용** → 접근성 이슈(14장·O-4) |
| **tap** | `WebkitTapHighlightColor: "transparent"` (모바일 하이라이트 제거) |

- **프레스 피드백:** 눌림 시 `scale(0.96)` 축소 + 배경 진해짐. 모든 버튼류 공통.
- **BookBuddy 애니메이션:** blink(눈 깜빡임) `animateTransform` scale, `dur=4.2s`, `repeatCount=indefinite`; cycle(표정 순환) 기본 `cycleMs=2600ms`. 둘 다 `prefers-reduced-motion: reduce`를 감지해 정지. 출처: `BookBuddy.tsx:145–154, 176–190`.

---

## 8. 아이코노그래피

출처: `app/components/ds/Icon.tsx`.

- **아이콘 소스:** `lucide-react` (버전 `0.469.0`, `package.json:12`). CDN 스크립트가 아닌 패키지에서 글리프를 resolve.
- **기본 크기:** `size = 20`(default), `stroke = 2`(default). 색은 `currentColor` 상속(미지정 시 `"inherit"`).
- **미등록 이름 처리:** REGISTRY에 없는 `name`이면 크래시 대신 빈 `<i aria-hidden>` 슬롯을 렌더. 출처: `Icon.tsx:84–87`.

### 8.1 Icon `REGISTRY` — 사용 가능한 아이콘 전수 (23개)

| name(키) | Lucide 컴포넌트 | 용도 _(추론)_ |
|----------|-----------------|------|
| `search` | `Search` | 검색 탭/버튼 |
| `home` | `Home` | 홈 탭(중앙 primary) |
| `library` | `Library` | 내 서재 탭 |
| `settings` | `Settings` | 설정 액션 |
| `user` | `User` | 프로필 아바타 |
| `plus` | `Plus` | 추가 |
| `chevron-down` | `ChevronDown` | TopBar 드롭다운 |
| `chevron-right` | `ChevronRight` | 이동/더보기 |
| `chevron-left` | `ChevronLeft` | 뒤로 |
| `star` | `Star` | 별점 |
| `flame` | `Flame` | 스트릭/불꽃 stat |
| `book-open` | `BookOpen` | 책/독서 |
| `signal` | `Signal` | 상태바 신호 |
| `wifi` | `Wifi` | 상태바 와이파이 |
| `battery-full` | `BatteryFull` | 상태바 배터리 |
| `calendar` | `Calendar` | 날짜/기록일 |
| `list` | `List` | 목록 보기 |
| `archive` | `Archive` | 보관/서재 |
| `trash-2` | `Trash2` | 삭제 |
| `x` | `X` | 닫기(검색창 clear 버튼) |
| `check` | `Check` | 성공/완료(담기 완료·토스트) |
| `log-out` | `LogOut` | 로그아웃(TopBar 액션) |
| `lock` | `Lock` | 잠긴 옷(홈 옷장) |

> 실제 화면에서 현재 사용 중인 것: `user`, `search`, `home`, `library`(NAV_ITEMS), `log-out`(TopBar), `lock`·`check`(홈 옷장 잠금/완료), `chevron-left`(TopBar leading), `x`(Input clear), `plus`·`check`(담기/담김·토스트), `star`(별점·통계), `book-open`(BookCover 폴백). `settings`는 등록돼 있으나 현재 미사용(설정 화면은 향후). 나머지도 등록만 된 향후용.

---

## 9. 컴포넌트 라이브러리

`app/components/ds/index.ts`가 export하는 **모든** 심볼:
- 컴포넌트(10): `Icon`, `Button`, `IconButton`, `Input`, `Textarea`, `StarRating`, `BookCover`, `BookBuddy`, `TopBar`, `BottomNav`
- 타입(16): `IconProps`, `ButtonProps`, `IconButtonProps`, `InputProps`, `TextareaProps`, `StarRatingProps`, `BookCoverProps`, `BookCoverTint`, `BookBuddyProps`, `Expression`, `Character`, `TopBarProps`, `TopBarStat`, `TopBarAction`, `BottomNavProps`, `BottomNavItem`

> 공통: 모든 컴포넌트는 `"use client"`. 스타일은 CSS 파일이 아닌 **인라인 style 객체**로 토큰(`var(--…)`)을 참조한다.
>
> **DS 외 조립 컴포넌트/화면**(`app/components/ds` 밖): `PhoneFrame`(`app/components/PhoneFrame.tsx` — 390×844 폰 목업 셸 + 전역 토스트), 화면 컴포넌트 `Login`·`Home`·`Library`·`BookSearch`·`BookRecord`(`app/components/screens/*`), 공유 데이터 `app/data/books.ts`(목업 카탈로그 `CATALOG`+`getBook`). 이들은 DS 프리미티브를 조립한 화면/데이터 레이어로, index.ts export에는 포함되지 않는다(11장 참조).

### 9.1 Icon

- **목적/언제:** Lucide 라인 아이콘의 얇은 래퍼. name/size/stroke/color API로 글리프 렌더.
- **Anatomy:** 단일 `<svg>`(또는 미등록 시 `<i>`), `display: inline-flex`, `flex: 0 0 auto`.
- **Props**

| 이름 | 타입 | 기본값 | 필수 | 설명 |
|------|------|--------|:---:|------|
| `name` | `string` | — | ✅ | REGISTRY 키(8장 목록) |
| `size` | `number` | `20` | | 가로·세로 px |
| `stroke` | `number` | `2` | | 선 두께(strokeWidth) |
| `color` | `string` | `undefined`→`"inherit"` | | 색(미지정 시 currentColor 상속, stroke에 적용) |
| `fill` | `string` | `undefined` | | 채움 색(미지정 시 Lucide 기본 `none`). 채운 별점 등에 사용 |
| `style` | `CSSProperties` | `undefined` | | 추가 인라인 스타일(baseStyle에 spread) |
| `className` | `string` | `undefined` | | 클래스 |

- **Variants/Sizes/States:** 없음(크기는 `size` prop으로 자유). 미등록 name → 빈 슬롯. `fill`은 라인 아이콘을 채운(solid) 형태로 렌더할 때 사용(예: `StarRating`의 채운 별 `fill="var(--rating)"`).
- **사용 토큰:** 없음(색은 상속). **코드 위치:** `app/components/ds/Icon.tsx`.
- **사용 예:** `<Icon name="user" size={28} />` (`page.tsx:133`), `<Icon name="chevron-down" size={18} color="var(--ink-500)" />` (`TopBar.tsx:91`).
- **Do/Don't:** Do — currentColor 상속을 활용해 부모 색을 물려받기. Don't — REGISTRY에 없는 이름 사용(빈 슬롯이 됨).

### 9.2 Button

- **목적/언제:** 알약형 CTA. 브랜드 행동 위계를 variant로 표현. 출처: `Button.tsx:6–9`.
- **Anatomy:** `<button type="button">` + 선택적 `iconLeft`/`iconRight`(Icon) + children(라벨). 중앙 정렬 flex, `gap`은 사이즈별.
- **Props**

| 이름 | 타입 | 기본값 | 필수 | 설명 |
|------|------|--------|:---:|------|
| `children` | `ReactNode` | — | | 라벨 |
| `variant` | `"primary"\|"dark"\|"soft"\|"ghost"\|"danger"` | `"primary"` | | 색 위계 |
| `size` | `"sm"\|"md"\|"lg"` | `"md"` | | 크기 |
| `block` | `boolean` | `false` | | true 시 `width:100%`, `display:flex` |
| `disabled` | `boolean` | `false` | | 비활성 |
| `iconLeft` | `string` | `undefined` | | 왼쪽 아이콘 name |
| `iconRight` | `string` | `undefined` | | 오른쪽 아이콘 name |
| `onClick` | `() => void` | `undefined` | | 클릭 핸들러 |
| `style` | `CSSProperties` | `undefined` | | 추가 스타일 |

- **Sizes 표** (출처: `Button.tsx:26–30`)

| size | height | padding-x | font-size | gap | icon |
|------|--------|-----------|-----------|-----|------|
| `sm` | `36` | `14` | `var(--text-sm)`(13px) | `6` | `16` |
| `md` | `46` | `20` | `var(--text-body)`(15px) | `8` | `18` |
| `lg` | `54` | `26` | `var(--text-body-lg)`(17px) | `8` | `20` |

- **Variants 팔레트** (출처: `Button.tsx:32–68`)

| variant | bg | bgHover | bgActive | fg | border |
|---------|----|---------|----------|----|--------|
| `primary` | `--brand` | `--brand-hover` | `--brand-active` | `--text-on-brand` | transparent |
| `dark` | `--ink-800` | `--ink-700` | `--ink-900` | `--text-on-dark` | transparent |
| `soft` | `--brand-soft` | `--green-300` | `--green-300` | `--brand-active` | transparent |
| `ghost` | transparent | `--gray-100` | `--gray-200` | `--text-body` | transparent |
| `danger` | `--danger` | `#E5352B` | `#CC2E25` | `--white` | transparent |

- **States:** hover/active/disabled — 7장 규칙. active 시 `scale(0.96)`. disabled `opacity 0.4`.
- **사용 토큰:** `--font-sans`, `--fw-bold`, `--tracking-label`, `--radius-pill`, `--press-scale`, `--dur-fast`, `--ease-standard`, 위 팔레트 색. (일부 raw 램프 `--ink-700/800/900`, `--green-300`, `--gray-100/200` 직접 참조 — 규칙 예외.)
- **코드 위치:** `app/components/ds/Button.tsx`. **사용 예:** `<Button variant="primary" size="lg" iconLeft="search" onClick={…}>책 검색하러 가기</Button>` (`page.tsx:187–189`).
- **Do/Don't:** Do — 화면당 primary 1개 권장(위계 유지) _(추론)_. Don't — `soft` fg는 `--brand-active`(진초록)이므로 어두운 배경 위 사용 금지.

### 9.3 IconButton

- **목적/언제:** 원형 아이콘 전용 버튼. 하단 내비 + 헤더의 주력. 출처: `IconButton.tsx:6–9`.
- **Anatomy:** 원형 `<button>` + 단일 `Icon`. `border-radius: pill`.
- **Props**

| 이름 | 타입 | 기본값 | 필수 | 설명 |
|------|------|--------|:---:|------|
| `icon` | `string` | — | ✅ | 아이콘 name |
| `variant` | `"brand"\|"soft"\|"ghost"\|"plain"` | `"ghost"` | | 색 |
| `size` | `"sm"\|"md"\|"lg"\|"xl"` | `"md"` | | 크기 |
| `elevated` | `boolean` | `false` | | brand일 때만 `--shadow-brand` 부여 |
| `disabled` | `boolean` | `false` | | 비활성 |
| `aria-label` | `string` | `undefined` | | 접근성 라벨 |
| `onClick` | `() => void` | `undefined` | | 클릭 핸들러 |
| `style` | `CSSProperties` | `undefined` | | 추가 스타일 |

- **Sizes** (버튼 지름 / 아이콘 크기, 출처: `IconButton.tsx:25–26`)

| size | 버튼 dim | 아이콘 |
|------|---------|--------|
| `sm` | `36` | `18` |
| `md` | `44` | `22` |
| `lg` | `56` | `26` |
| `xl` | `64` | `28` |

- **Variants 팔레트** (출처: `IconButton.tsx:28–53`)

| variant | bg | bgHover | bgActive | fg |
|---------|----|---------|----------|----|
| `brand` | `--brand` | `--brand-hover` | `--brand-active` | `--white` |
| `soft` | `--brand-soft` | `--green-300` | `--green-300` | `--white` |
| `ghost` | transparent | `--gray-100` | `--gray-200` | `--ink-600` |
| `plain` | `--surface-sunken` | `--gray-200` | `--gray-300` | `--ink-700` |

- **States:** hover/active/disabled — 7장. `elevated && variant==="brand"` 일 때만 그림자. 그 외 `boxShadow: none`.
- **사용 토큰:** `--radius-pill`, `--shadow-brand`, `--press-scale`, `--dur-fast`, `--ease-standard`, 위 팔레트.
- **코드 위치:** `app/components/ds/IconButton.tsx`. **사용:** TopBar actions/leading, BottomNav 전 항목이 내부적으로 사용.
- **Do/Don't:** Do — 반드시 `aria-label` 제공(아이콘만 있으므로). Don't — `soft` variant fg가 `--white`라 밝은 `--brand-soft(#B7DCA6)` 위 흰 아이콘은 대비가 낮음 → 접근성 주의(O-4).

### 9.4 TopBar

- **목적/언제:** 고정 앱 헤더. 홈은 워드마크, 하위 화면은 중앙 타이틀(+옵션 chevron). 출처: `TopBar.tsx:7–12`.
- **Anatomy:** `<header>` → [옵션 leading IconButton] · [워드마크 "북박이장" 또는 중앙 타이틀(+chevron)] · [우측 stats 칩 + actions IconButton들]. 높이 `56`, `padding 0 16px`, `gap --space-3`, 배경 `color-mix(in srgb, var(--surface-card) 88%, transparent)` + `backdrop-filter: blur(10px)`.
- **Props**

| 이름 | 타입 | 기본값 | 필수 | 설명 |
|------|------|--------|:---:|------|
| `wordmark` | `boolean` | `false` | | true 시 "북박이장" 워드마크(좌측), 우측에 flex spacer |
| `title` | `string` | `undefined` | | 중앙 타이틀(wordmark=false일 때) |
| `withChevron` | `boolean` | `false` | | 타이틀 옆 `chevron-down`(size 18, `--ink-500`) |
| `leading` | `string` | `undefined` | | 좌측 아이콘 name(ghost md IconButton, aria-label "menu") |
| `onLeading` | `() => void` | `undefined` | | leading 클릭 |
| `stats` | `TopBarStat[]` | `[]` | | 우측 아이콘+값 칩 |
| `actions` | `TopBarAction[]` | `[]` | | 우측 ghost IconButton들 |
| `style` | `CSSProperties` | `undefined` | | 추가 스타일 |

- **연관 타입**
  - `TopBarStat`: `{ icon: string; value: string | number; color?: string }` — 칩: `Icon size 20 color s.color||--ink-600`, 값 텍스트 `--text-body`, `--fw-bold`, `--ink-700`, `gap 5`.
  - `TopBarAction`: `{ icon: string; label?: string; onClick?: () => void }` — ghost md IconButton, `aria-label = label || icon`.
- **워드마크 스타일:** `font-display`, `fontSize 22`(리터럴), `fontWeight 900`(리터럴), `letterSpacing -0.03em`(리터럴), `color --text-strong`. **타이틀 스타일:** `--text-h3`, `--fw-bold`, `--text-strong`, 중앙 정렬.
- **Variants:** 모드는 상호배타 — (a)wordmark 모드, (b)title 모드. States 별도 없음.
- **사용 토큰:** `--space-3`, `--surface-card`, `--text-strong`, `--text-h3`, `--fw-bold`, `--text-body`, `--ink-500/600/700`, `--font-display`.
- **코드 위치:** `app/components/ds/TopBar.tsx`. **사용 예:** `<TopBar wordmark actions={[{ icon: "settings", label: "설정" }]} />` (`page.tsx:98`).
- **Do/Don't:** Do — 서브스크린은 `title`+`leading="chevron-left"` 조합 _(추론)_. Don't — `wordmark`와 `title` 동시 지정 시 워드마크가 우선(title 무시).

### 9.5 BottomNav

- **목적/언제:** 앱을 고정하는 원형 버튼 바. 한 항목이 강조 primary(크고 채운 초록, elevated), 나머지는 soft/brand 원형. 출처: `BottomNav.tsx:7–10`.
- **Anatomy:** `<nav>` 중앙 정렬, `gap --space-5`, `padding "12px 20px calc(12px + env(safe-area-inset-bottom, 0px))"`, 배경 `color-mix(... surface-card 88% ...)` + `blur(10px)`, `borderTop 1px var(--divider)`. 각 항목은 IconButton.
- **Props**

| 이름 | 타입 | 기본값 | 필수 | 설명 |
|------|------|--------|:---:|------|
| `items` | `BottomNavItem[]` | `[]` | | 내비 항목들 |
| `activeKey` | `string` | `undefined` | | 현재 활성 key |
| `onSelect` | `(key: string) => void` | `undefined` | | 항목 선택 콜백 |
| `style` | `CSSProperties` | `undefined` | | 추가 스타일 |

- **연관 타입** `BottomNavItem`: `{ key: string; icon: string; label?: string; primary?: boolean }`.
- **항목 렌더 규칙** (출처: `BottomNav.tsx:42–62`)

| 조건 | IconButton size | variant | elevated | 추가 스타일 |
|------|-----------------|---------|:---:|------|
| `primary` 항목 | `xl`(64) | `brand` | ✅ | `marginTop: -20` (바 위로 띄움) |
| 활성(`key===activeKey`, 비primary) | `lg`(56) | `brand` | — | — |
| 비활성(비primary) | `lg`(56) | `soft` | — | `{ background: --brand-soft, color: --white }` (인라인 오버라이드) |

- **States:** active 여부로 variant 전환. `aria-label = label || key`.
- **사용 토큰:** `--space-5`, `--surface-card`, `--divider`, `--brand-soft`, `--white`, `--shadow-brand`(primary elevated 경유).
- **코드 위치:** `app/components/ds/BottomNav.tsx`. **사용 예:** `<BottomNav activeKey={activeKey} items={NAV_ITEMS} onSelect={setActiveKey} />` (`page.tsx:201`).
- **Do/Don't:** Do — 3탭 구조 유지, 중앙에 primary. Don't — primary 2개 지정. **주의(quirk):** 비활성 항목은 `variant="soft"`(soft fg=white)이면서 인라인으로 `background: --brand-soft, color: white`를 다시 지정 → 실질적으로 `soft`와 동일 배경. 열린 질문 O-3.

### 9.6 Input

- **목적/언제:** 한 줄 텍스트 입력. 검색창(P0-2)·향후 한줄평/메모(P0-6,7)에 사용. 열린 질문 O-9의 "입력 컴포넌트 미정의"를 해소. 출처: `app/components/ds/Input.tsx`.
- **Anatomy:** 래퍼 `<div>`(보이는 필드) → [옵션 leading `Icon`] · `<input class="ds-input-field">` · [옵션 clear `IconButton(x, ghost, sm)`]. 값이 있고 `clearable`이며 비활성이 아닐 때만 clear 노출.
- **Props**

| 이름 | 타입 | 기본값 | 필수 | 설명 |
|------|------|--------|:---:|------|
| `value` | `string` | — | ✅ | 제어 값 |
| `onChange` | `(value: string) => void` | `undefined` | | 값 변경(문자열 인자) |
| `placeholder` | `string` | `undefined` | | 플레이스홀더 |
| `iconLeft` | `string` | `undefined` | | 좌측 아이콘 name |
| `clearable` | `boolean` | `false` | | 값 존재 시 clear(x) 버튼 |
| `onClear` | `() => void` | `undefined` | | clear 이후 콜백 |
| `size` | `"md" \| "lg"` | `"md"` | | 크기 |
| `type` | `string` | `"text"` | | input type |
| `disabled` | `boolean` | `false` | | 비활성(`opacity 0.5`) |
| `autoFocus` | `boolean` | `false` | | 마운트 시 포커스 |
| `aria-label` | `string` | `undefined`→`placeholder` | | 접근성 라벨(미지정 시 placeholder) |
| `onKeyDown` | `(e) => void` | `undefined` | | 키다운 핸들러 |
| `style` | `CSSProperties` | `undefined` | | 래퍼 추가 스타일 |

- **Sizes** (출처: `Input.tsx:34–37`)

| size | height | padding-x | font-size | icon |
|------|--------|-----------|-----------|------|
| `md` | `46` | `14` | `var(--text-body)`(15px) | `18` |
| `lg` | `54` | `16` | `var(--text-body-lg)`(17px) | `20` |

- **States:**

| 상태 | 처리 |
|------|------|
| **기본** | border `1px --border`, `boxShadow --shadow-xs`, leading 아이콘 `--text-subtle` |
| **focus** | border `--brand`, `boxShadow: 0 0 0 3px color-mix(in srgb, var(--focus-ring) 55%, transparent)`(포커스 링 글로우), leading 아이콘 `--brand`. transition `border-color/box-shadow --dur-fast --ease-standard` |
| **disabled** | `opacity 0.5` |

- **사용 토큰:** `--surface-card`, `--border`, `--brand`, `--focus-ring`(**컴포넌트 중 최초로 실사용** — O-4 부분 해소), `--radius-md`, `--shadow-xs`, `--text-body`/`--text-body-lg`, `--text-subtle`, `--text-body`(입력 텍스트), `--fw-medium`, `--font-sans`, `--dur-fast`, `--ease-standard`. 플레이스홀더 색은 전역 규칙 `.ds-input-field::placeholder { color: var(--text-subtle) }`(`globals.css`).
- **코드 위치:** `app/components/ds/Input.tsx`. **사용 예:** `<Input value={query} onChange={setQuery} placeholder="제목이나 저자를 검색해 보세요" iconLeft="search" clearable autoFocus aria-label="책 검색" />` (BookSearch, §11.3).
- **Do/Don't:** Do — 아이콘만 있는 입력엔 `aria-label` 제공. Don't — `caretColor`/포커스 링 색을 임의 변경(토큰 유지).

### 9.7 BookCover

- **목적/언제:** 책 표지 썸네일. 실제 표지 이미지가 없을 때 **플레이스홀더**(틴트 카드 + 좌측 spine + 제목 앞 2글자)를 렌더. `src` 지정 시 실제 이미지로 대체. 출처: `app/components/ds/BookCover.tsx`.
- **Anatomy:** `<div>`(둥근 카드, `overflow hidden`, `--shadow-xs`) → 좌측 spine `<span>`(width 4, `color-mix(--text-strong 8%, transparent)`) + [`src`면 `<img objectFit:cover>` / `title`이면 앞 2글자 텍스트 / 둘 다 없으면 `book-open` 아이콘]. `title` 없으면 `aria-hidden`.
- **Props**

| 이름 | 타입 | 기본값 | 필수 | 설명 |
|------|------|--------|:---:|------|
| `title` | `string` | `undefined` | | 제목(이니셜/이미지 alt용) |
| `src` | `string` | `undefined` | | 실제 표지 이미지 URL |
| `size` | `"sm" \| "md" \| "lg"` | `"sm"` | | 크기 |
| `tint` | `BookCoverTint` | `"sage"` | | 플레이스홀더 배경 틴트 |
| `style` | `CSSProperties` | `undefined` | | 추가 스타일 |

- **Sizes** (가로×세로 / 이니셜 font-size / radius, 출처: `BookCover.tsx:29–33`)

| size | w × h | font-size | radius |
|------|-------|-----------|--------|
| `sm` | `44 × 62` | `15` | `--radius-sm` |
| `md` | `56 × 78` | `18` | `--radius-sm` |
| `lg` | `72 × 100` | `22` | `--radius-md` |

- **`BookCoverTint` 팔레트**(플레이스홀더 배경, 이니셜은 항상 `--text-strong`, 출처: `BookCover.tsx:35–40`)

| tint | 배경 토큰 | HEX |
|------|----------|-----|
| `sage` | `--brand-tint` | `#EDF4E8` |
| `gold` | `--gold-50` | `#FBF3D8` |
| `rose` | `--danger-tint` | `#FFEBEA` |
| `mist` | `--surface-sunken` | `#F1F3ED` |

- **사용 토큰:** `--radius-sm`/`--radius-md`, `--shadow-xs`, `--brand-tint`/`--gold-50`/`--danger-tint`/`--surface-sunken`, `--text-strong`(이니셜·spine color-mix), `--text-subtle`(book-open 폴백), `--font-display`, `--fw-bold`. 비율은 대략 책 표지(≈1:1.4).
- **코드 위치:** `app/components/ds/BookCover.tsx`. **사용 예:** `<BookCover title="데미안" tint="gold" size="sm" />` (BookSearch 결과 행, §11.3).
- **Do/Don't:** Do — 이니셜 대비를 위해 전경은 `--text-strong` 고정. Don't — 틴트에 raw 램프 직접 지정(semantic tint만 사용).

### 9.8 StarRating

- **목적/언제:** 1~max **정수** 별점 입력/표시(반 개 없음, §12 별점 패턴 구현). 채운 별 `--rating`(gold), 빈 별 `--rating-track`. PRD P0-5. 출처: `app/components/ds/StarRating.tsx`.
- **Anatomy:** `role="radiogroup"` `<div>` → `max`개 별 `<button role="radio">`. 각 버튼은 `Icon(star)`. 채움 여부는 `n <= (hover || value)`.
- **Props**

| 이름 | 타입 | 기본값 | 필수 | 설명 |
|------|------|--------|:---:|------|
| `value` | `number` | — | ✅ | 현재 별점(0~max, 0=미평가) |
| `onChange` | `(value: number) => void` | `undefined` | | 값 변경. 같은 별 재클릭 시 `0`(해제) |
| `max` | `number` | `5` | | 별 개수 |
| `size` | `"sm" \| "md" \| "lg"` | `"md"` | | 크기 |
| `readOnly` | `boolean` | `false` | | 정적 표시(버튼 비활성, hover 없음) |
| `aria-label` | `string` | `undefined`→`"별점"` | | 그룹 라벨 |
| `style` | `CSSProperties` | `undefined` | | 래퍼 스타일 |

- **Sizes**(별 아이콘 px / gap, 출처: `StarRating.tsx:29–30`)

| size | icon | gap |
|------|------|-----|
| `sm` | `20` | `4` |
| `md` | `28` | `6` |
| `lg` | `36` | `8` |

- **States/인터랙션:** 채운 별 `color+fill = --rating`, 빈 별 `color = --rating-track`(fill none). **인터랙티브 모드:** 컨테이너 `role="radiogroup"`, 각 별은 `<button role="radio" aria-checked aria-label="별 N개">`. hover 중인 별은 `scale(1.12)`(`--dur-fast`), 클릭 → 해당 값, 현재 값 재클릭 → `0`. **readOnly 모드:** 버튼을 렌더하지 않고(중첩 버튼/하이드레이션 오류 회피 — 클릭 카드 안에 들어갈 수 있으므로) 컨테이너 `role="img" aria-label="별점 N점"` + 별은 `<span>`(비인터랙티브). 서재 그리드의 별점 표시가 이 경로를 사용.
- **사용 토큰:** `--rating`, `--rating-track`, `--press-scale`(미사용, hover는 1.12 리터럴), `--dur-fast`, `--ease-standard`, `Icon`의 `star`+`fill`.
- **코드 위치:** `app/components/ds/StarRating.tsx`. **사용 예:** `<StarRating value={rating} onChange={setRating} size="lg" aria-label="별점" />` (BookRecord, §11.4).
- **Do/Don't:** Do — 정수만(반 개 없음). Don't — 채움 색을 `--rating` 외 임의 색으로 지정.

### 9.9 Textarea

- **목적/언제:** 여러 줄 텍스트 입력(메모 P0-7, 향후 긴 글). `Input`과 동일한 시각 언어(포커스 시 `--brand` 보더 + `--focus-ring` 글로우). `maxLength` 지정 시 글자 수 카운터 표시. O-9 부분 해소. 출처: `app/components/ds/Textarea.tsx`.
- **Anatomy:** 래퍼 `<div>`(카드) → `<textarea class="ds-input-field" resize:none>`. `maxLength` 있으면 하단 우측 "`{길이}/{maxLength}`" 카운터(text-xs, subtle).
- **Props**

| 이름 | 타입 | 기본값 | 필수 | 설명 |
|------|------|--------|:---:|------|
| `value` | `string` | — | ✅ | 제어 값 |
| `onChange` | `(value: string) => void` | `undefined` | | 값 변경 |
| `placeholder` | `string` | `undefined` | | 플레이스홀더 |
| `rows` | `number` | `4` | | 표시 줄 수 |
| `maxLength` | `number` | `undefined` | | 최대 글자 수(+카운터) |
| `disabled` | `boolean` | `false` | | 비활성(`opacity 0.5`) |
| `aria-label` | `string` | `undefined`→`placeholder` | | 접근성 라벨 |
| `style` | `CSSProperties` | `undefined` | | 래퍼 추가 스타일 |

- **States:** 기본 border `--border` + `--shadow-xs`; focus border `--brand` + `--focus-ring` 글로우; disabled `opacity 0.5`. `resize: none`.
- **사용 토큰:** `--surface-card`, `--border`, `--brand`, `--focus-ring`, `--radius-md`, `--shadow-xs`, `--text-body`/`--lh-body`, `--text-subtle`(카운터), `--fw-medium`, `--font-sans`, `--dur-fast`, `--ease-standard`. 플레이스홀더는 `.ds-input-field::placeholder` 전역 규칙 공유.
- **코드 위치:** `app/components/ds/Textarea.tsx`. **사용 예:** `<Textarea value={memo} onChange={setMemo} placeholder="자유롭게 남겨보세요" rows={4} maxLength={500} aria-label="메모" />` (BookRecord, §11.4).
- **Do/Don't:** Do — 카운터가 필요하면 `maxLength` 지정. Don't — `resize`를 켜 폰 목업 레이아웃을 깨뜨리지 않기.

---

## 10. 마스코트 — BookBuddy

출처: `app/components/ds/BookBuddy.tsx`.

- **정체성:** BookJjang의 다정한 **책 캐릭터**. 확장 가능한 SVG로 렌더. 표정(`expression`)·눈 깜빡임(`blink`)·표정 순환(`cycle`)을 지원. `role="img"`, `aria-label={`book character — ${expr}`}`.
- **형태(SVG, viewBox `0 0 100 106`):**
  - 책 몸체: `rect x8 y8 width72 height90 rx8 fill var(--brand)` (`:172`)
  - 책 페이지: `rect x24 y14 width70 height86 rx7 fill #fff stroke var(--gray-200) strokeWidth1.5` (`:171`)
  - 책등(spine): `path … fill var(--green-700)` (`:173`)
  - 북마크(옵션): `path M60 4 … fill var(--red-500)` (`:174`, `bookmark`가 true일 때)
  - 크기: 렌더 `w = size`, `h = size * 1.06`.
- **선/색 상수:** `INK = var(--ink-900)`; STROKE = `{ stroke: ink-900, strokeWidth: 2.6, strokeLinecap: "round", fill: "none" }`. 볼터치(Cheeks) = `--red-500 opacity 0.35` 타원 2개(cx 28,62 / cy 59 / rx 4 ry 2.6).

- **Props**

| 이름 | 타입 | 기본값 | 필수 | 설명 |
|------|------|--------|:---:|------|
| `expression` | `Expression` | `"happy"` | | 표정(7종, 아래). `character`가 book일 때만 전체 표정 |
| `character` | `Character` (`"book"\|"duck"\|"tomato"`) | `"book"` | | 캐릭터 종류. duck/tomato는 **행복 표정 고정**(눈 cx34/56 정렬 유지 → 액세서리 호환), 색: 오리 `--gold-500`+부리 `#F0913D`, 토마토 `#EE5B4A`+꼭지 `--green-700`. book 몸체는 `--brand`이라 **테마 색을 따라감** |
| `size` | `number` | `80` | | 가로 px(세로=size×1.06) |
| `bookmark` | `boolean` | `true` | | 상단 빨간 북마크 표시 |
| `blink` | `boolean` | `true` | | 눈 깜빡임(happy/sad에서만 작동) |
| `cycle` | `boolean` | `false` | | 표정 자동 순환 |
| `cycleMs` | `number` | `2600` | | 순환 간격(ms) |
| `cycleList` | `Expression[]` | `["happy","reading","wink","excited","sleepy"]` | | 순환 목록 |
| `style` | `CSSProperties` | `undefined` | | 컨테이너 스타일 |

- **`Expression` 타입 — 전수(7종)** 및 얼굴 구성(출처: `BookBuddy.tsx:11–18, 46–118`)

| 값 | 눈 | 입/특징 | 볼터치 |
|----|----|--------|:---:|
| `happy`(기본) | 점 눈(dot, r3.5) | 아래로 벌어진 미소 `M38 60 Q45 68 52 60` | ✅ |
| `excited` | 위로 굽은 눈(archUp) | 크게 벌린 입 `M38 60 Q45 71 52 60 Z`(fill ink) + 혀 `M42 66…`(red-500) | ✅ |
| `reading` | 아래로 굽은 눈(archDown) | 잔잔한 입 `M40 62 Q45 65 50 62` | — |
| `sleepy` | 아래로 굽은 눈(archDown) | 작은 벌린 입(타원) + "z z" 잠 텍스트(fill ink, opacity 0.55/0.4) | — |
| `wink` | 왼쪽 점 눈 + 오른쪽 archUp | 윙크 미소 `M38 60 Q45 67 52 60` | ✅ |
| `surprised` | 흰자 원(r4.2, fill #fff stroke ink) + 동공 | 놀란 입(세로 타원 rx3 ry3.6) | — |
| `sad` | 점 눈 2개 | 아래로 처진 입 `M38 65 Q45 59 52 65` | — |

- **깜빡임/순환 동작:**
  - `blink`은 두 눈이 모두 둥근 표정(`happy`, `sad`)에서만 작동(`openEyes`). `<animateTransform type="scale" dur="4.2s" repeatCount="indefinite">`로 눈만 순간 납작해짐.
  - `cycle`은 `cycleList`를 `cycleMs`(2600ms) 간격으로 순환.
  - 둘 다 `prefers-reduced-motion: reduce`면 애니메이션 정지(정적 표정). 출처: `:146–151, 176–190`.
- **사용 맥락(현재):** 빈 서재 화면에서 `expression="sleepy" size={112} blink={false}` — 빈 선반 위에서 낮잠 자며 첫 책 추가를 넛지. 출처: `page.tsx:164`.
- **톤:** 조용하고 다정함. 볼터치·둥근 선(strokeLinecap round)·잠자는 표정으로 "압박 없는" 정서를 표현.
- **사용 토큰:** `--brand`, `--green-700`, `--gray-200`, `--red-500`, `--ink-900`, `--font-sans`(잠 텍스트). (리터럴 `#fff` 사용 — 3.3 참조.)

---

## 11. 화면 명세(Screens)

### 11.1 구현 상태 요약

| 화면 | PRD 요구 | 상태 |
|------|:---:|------|
| 홈(북버디 옷 갈아입히기: "오늘은 어떤 책…" + 옷장) | (내비 홈 탭) | ✅ **구현됨** (`app/components/screens/Home.tsx`, §11.6) |
| 내 서재(Library: 빈 상태 + 표지 그리드) | P0-8 | ✅ **구현됨** (`app/components/screens/Library.tsx`, §11.2) |
| 책 검색(검색→결과→담기/기록) | P0-2, (P0-4) | ✅ **구현됨** (`app/components/screens/BookSearch.tsx`, §11.3) |
| 기록하기(별점·한줄평·메모→서재 담기) | P0-4~7 | ✅ **구현됨** (`app/components/screens/BookRecord.tsx`, §11.4) |
| 로그인(Google 로그인/로그아웃) | P0-1 | ✅ **구현됨** (`app/components/screens/Login.tsx`, §11.5). 단 실제 OAuth 없이 시뮬레이션 |
| 책 상세(표지·소개 등) | P0-3 | ⚠️ 부분(기록 화면이 표지·제목·저자·출판사·연도 표시. 책 소개/설명 미구현) |
| 독서 통계(총 권수·평균·차트) | P0-9 | ⚠️ 부분(서재에 권수·평균 별점 요약 카드. 월별 차트 미구현) |
| 시작/완료일·진행률·독서 상태 | P1-10~12 | ⏳ 예정 |

> **인증 게이팅.** `page.tsx`는 `loggedIn`(localStorage 저장) 상태로 앱을 게이팅한다. 마운트 복원 전(`!hydrated`)엔 **스플래시**(중앙 BookBuddy happy, 내비 없음)를 보여 SSR 빈 상태와 일치시켜 하이드레이션 미스매치를 피하고, 복원 후 `!loggedIn`이면 `Login`(§11.5, 내비 없음), 로그인 상태면 앱을 렌더한다. 하단 내비·토스트는 로그인 상태에서만 노출.
>
> **앱 셸/라우팅.** `app/page.tsx`는 `PhoneFrame` 안에서 `activeKey`(`"home"`/`"shelf"`/`"search"`/`"record"`) 상태로 화면을 스위치한다. **기본 진입 `"home"`**. `"record"`→`BookRecord`, `"search"`→`BookSearch`, `"shelf"`→`Library`(내 서재 그리드), 그 외(`"home"`)→`Home`(붙박이장 뷰, §11.6). **홈 탭과 내 서재 탭은 서로 다른 화면**(홈=책등 캐비닛, 서재=표지 그리드). 담긴 책(`added` id 배열)·기록(`records`)·토스트(`toast`)는 `page.tsx`가 소유하여 서재/검색/기록 화면이 공유하고, 토스트는 `PhoneFrame`이 전역으로 렌더한다. `added`·`records`는 `localStorage`에 저장되어 새로고침해도 유지된다(O-13). 아직 실제 URL 라우팅·백엔드·계정 동기화는 없다(로컬 프로토타입).

### 11.2 내 서재 (Library) — 구현 화면

> **위치/구성.** 화면 본문은 `app/components/screens/Library.tsx`(프레임/상태바/내비/토스트는 `PhoneFrame`). 담긴 책이 **없으면 빈 상태**, **있으면 표지 그리드**를 렌더한다(구 `LibraryEmpty`를 대체). NAV_ITEMS는 `page.tsx`. 초기 `activeKey="shelf"`.

- **목적:** "내 서재" — 담은 책을 표지 중심으로 쌓아 보여주는 개인 책장(P0-8, 원칙 P4). 첫 방문 시 빈 상태로 첫 책 추가를 유도. 출처: `Library.tsx`.
- **공통 상단:** TopBar `wordmark`("북박이장") + `actions=[log-out("로그아웃", →`onLogout`)]`, 하단 divider. (구 `settings` 액션을 기능형 로그아웃으로 교체 — 설정 화면은 향후.) 프로필 블록(아바타 56×56 원 `--brand-tint`+`user` 28 `--brand`, 이름 "독서가 민지" text-h3 fw-bold, 서브 "나만의 조용한 책장" text-sm muted).
- **상태(state)별 구성:**
  - **빈 상태(`items.length===0`):** 프로필 아래 중앙 정렬 `BookBuddy(sleepy, 112, blink off)` → "아직 서재가 비어 있어요"(text-h3, fw-bold) → "읽은 책을 검색해서 / 내 서재에 첫 책을 담아볼까요?"(text-body-lg, lineHeight 1.55, muted, maxWidth 240) → CTA `Button(primary, lg, iconLeft=search)` "책 검색하러 가기"(→`onSearch`). (구 빈 서재 화면과 값·문구 동일.)
  - **채워진 상태(`items.length>0`, 스크롤):**
    - **통계 카드:** `--surface-card` 카드(`--radius-lg`, `--shadow-sm`, `flexShrink 0` — 스크롤 넘침 시 찌그러짐 방지), 좌우 2분할(가운데 1px `--divider`). 좌 "**N** 권 / 읽은 책"(수 text-h2 extrabold), 우 "★ **X.X** / 평균 별점"(별점 있는 책들의 평균, gold `star`+fill; 없으면 "-").
    - **월별 차트("최근 6개월"):** 최근 6개월 월별 담은 책 수 막대 차트(`MonthlyChart`, Library 내부). 단일 시리즈 → 레전드 없음. 막대 `--brand`(4/6px 라운드 상단, baseline 0), 빈 트랙 `--surface-sunken`, 0인 달은 트랙만. 막대 위 개수 라벨(text-xs, `--text-strong` — 시리즈색 아님), 아래 "N월" 라벨(muted). `role="img"`+요약 aria-label. (dataviz 규칙 준수: baseline 0·단일 색조·흐린 트랙·잉크 텍스트.)
    - **섹션 헤더:** 좌 "내 책장"(text-h3, fw-bold) + 우 `Button(ghost, sm, iconLeft="plus")` "책 담기"(→`onSearch`).
    - **표지 그리드:** `grid-template-columns: repeat(3, 1fr)`, gap `18px 8px`. 각 셀은 탭 가능한 버튼(`aria-label="{제목} 기록 보기"`): `BookCover(lg, 제목·tint)` → 제목(text-sm, fw-semibold, 2줄 말줄임) → 별점 있으면 `StarRating(sm, readOnly)`, 없으면 "미평가"(text-xs, subtle). 최신 담은 책이 앞(역순).
- **인터랙션:** 셀 탭 → `onOpen(book)` → **기록 수정 화면(§11.4)**(별점·한줄평·메모 수정 또는 서재에서 빼기, 기존값 프리필). "책 담기"/CTA → 검색(§11.3). 하단 내비로 화면 전환. 서재 데이터는 `page.tsx`의 `added`(순서 있는 id 배열) + `records`(id→기록)에서 `getBook`으로 조립.
- **영속화:** `added`·`records`·`addedAt`(담은 시각, 월별 차트용)는 `localStorage`(키 `bookjjang.shelf.v1`)에 저장되어 **새로고침해도 유지**된다. 마운트 후 `useEffect`로 로드(초기 렌더는 빈 상태 → 하이드레이션 미스매치 회피; 월별 차트도 서재가 비어있지 않을 때만 렌더되어 `new Date()` 사용이 안전), 변경 시 저장(초기 로드 전 `hydrated` 가드로 빈 상태가 저장을 덮어쓰지 않게 함). 백엔드·다기기 동기화는 미구현(O-13).
- **마이크로카피(원문):** "북박이장", "설정", "독서가 민지", "나만의 조용한 책장", (빈)"아직 서재가 비어 있어요"·"읽은 책을 검색해서"·"내 서재에 첫 책을 담아볼까요?"·"책 검색하러 가기", (채워짐)"읽은 책"·"권"·"평균 별점"·"최근 6개월"·"N월"·"내 책장"·"책 담기"·"미평가". (13장 참조.)

### 11.3 책 검색 (Book Search) — 구현 화면

- **목적:** 제목/저자로 책을 검색해 결과를 보고 서재에 담는다. PRD P0-2(검색·결과·없음/오류 처리) 및 P0-4 일부(담기·성공 피드백) 대응. 출처: `app/components/screens/BookSearch.tsx`.
- **진입:** 빈 서재 CTA "책 검색하러 가기" 또는 하단 내비 `search` 탭(`activeKey="search"`).
- **데이터:** **알라딘(Aladin) 도서 검색 API**를 서버 라우트 `app/api/search/route.ts`(프록시, CORS·키 은닉)로 호출 → 실제 도서 결과(표지 URL 포함). 300ms 디바운스 fetch. **키(`ALADIN_TTB_KEY`) 미설정 시 `configured:false`** → 공유 모듈 `app/data/books.ts`의 **로컬 목업 8권**(아몬드/데미안/물고기는 존재하지 않는다/불안/미움받을 용기/사피엔스/82년생 김지영/파친코)으로 폴백. 결과 항목: `{id,title,author,publisher,year,cover?,tint}`. 담은 책 전체 정보는 `page.tsx`의 `booksById`에 저장(카탈로그에 없는 알라딘 책도 서재/기록에서 표지 표시). (O-15)
- **레이아웃 구조(위→아래)**

| 순서 | 영역 | 구성 |
|------|------|------|
| 1 | TopBar | `title="책 검색"` + `leading="chevron-left"`(→`onBack`, 빈 서재로 복귀), 하단 divider 보더 |
| 2 | 검색창 | `Input`(iconLeft `search`, `clearable`, `autoFocus`, placeholder "제목이나 저자를 검색해 보세요"). 패딩 `12px 20px 8px` |
| 3 | 결과/상태 영역 | 스크롤(`overflowY auto`), 패딩 `4px 20px 20px`. 아래 상태별 분기 |

- **상태(state)별 구성:**
  - **대기(빈 검색어):** 중앙 정렬 `BookBuddy(reading, 92, blink off)` → 제목 "어떤 책을 찾고 있나요?"(text-h3, fw-bold) → 설명 "제목이나 저자를 입력하면 여기에 결과가 나와요"(text-body, muted, maxWidth 250).
  - **결과 있음:** 상단 카운트 "검색 결과 N권"(text-sm, muted) + 결과 행 리스트. 각 행(`ResultRow`): 좌측 **탭 가능한 버튼 영역**(`BookCover(sm, 제목·tint)` + [제목(text-body, fw-bold, 1줄 말줄임) · 저자(text-sm, muted, 1줄 말줄임) · "출판사 · 연도"(text-xs, subtle)], `aria-label="{제목} 기록하기"`) + 우측 담기/담김 버튼. 행 사이 `1px --divider` 보더.
  - **행 탭 → 기록:** 좌측 영역 클릭 시 `onOpen(book)` → **기록하기 화면(§11.4)** 진입. 우측 "담기"는 별점 없이 빠른 담기(quick-add).
  - **담기 액션:** 미담김 → `Button(sm, soft, iconLeft="plus")` "담기". 클릭 시 `onAdd(book)` → 상위(`page.tsx`)가 `added` Set에 추가 + 토스트 → 버튼이 `Button(sm, ghost, iconLeft="check", disabled)` "담김"으로 전환. (중복 방지: 이미 담긴 책은 버튼 비활성.)
  - **토스트(성공 피드백):** `page.tsx`가 소유하고 **`PhoneFrame`이 전역 렌더**(내비 위 중앙). `--surface-dark` + `--text-on-dark` + `check`(`--brand-soft`) + "'{제목}' 서재에 담았어요". `--radius-pill`, `--shadow-md`, `2200ms` 후 자동 소멸.
  - **결과 없음:** 중앙 정렬 `BookBuddy(sad, 92)` → "'{검색어}' 검색 결과가 없어요"(text-h3, fw-bold) → "다른 제목이나 저자로 검색해 볼까요?"(text-body, muted).
  - **로딩:** fetch 중 `BookBuddy(reading)` + "책을 찾고 있어요 / 잠시만 기다려 주세요".
  - **오류:** 요청 실패 시 `BookBuddy(sad)` + "검색 중 문제가 생겼어요 / 잠시 후 다시 시도해 주세요". (키 미설정·네트워크 실패는 오류 대신 목업 폴백.)
  - **표지:** 결과 행 `BookCover`에 `src={cover}` 전달 → 실제 표지(없으면 플레이스홀더).
- **인터랙션:** 입력 변경 시 `query` 상태 → 즉시 재필터. clear(x) → 검색어 비움 → 대기 상태. leading chevron → `onBack`(빈 서재로). 행 탭 → `onOpen`(기록). 담기 → `onAdd`. 하단 내비 `search`/`shelf` 선택 → 화면 전환.
- **사용 컴포넌트/토큰:** `TopBar`·`Input`·`BookCover`·`Button`(sm soft/ghost)·`BookBuddy`(reading/sad)·`Icon`(check). 토스트는 `--surface-dark`/`--text-on-dark`/`--radius-pill`/`--shadow-md`.
- **마이크로카피(원문):** "책 검색", "제목이나 저자를 검색해 보세요", "어떤 책을 찾고 있나요?", "제목이나 저자를 입력하면 여기에 결과가 나와요", "검색 결과 N권", "담기", "담김", "'{제목}' 서재에 담았어요", "'{검색어}' 검색 결과가 없어요", "다른 제목이나 저자로 검색해 볼까요?", clear 버튼 aria "지우기". (13장 참조.)

### 11.4 기록하기 (Book Record) — 구현 화면

- **목적:** 책에 **별점·한 줄 평·메모**를 남겨 서재에 담는다. PRD P0-4(담기·성공 피드백·중복 방지)·P0-5(별점 1~5 정수)·P0-6(한줄평)·P0-7(메모). 상단에 책 상세 정보(P0-3 일부)도 표시. 출처: `app/components/screens/BookRecord.tsx`.
- **진입:** 검색 결과 행 탭(`onOpen`). `page.tsx`가 `recordBook` 지정 + `activeKey="record"`. 재진입 시 저장된 `records[id]`가 초기값으로 복원.
- **레이아웃 구조(위→아래)**

| 순서 | 영역 | 구성 |
|------|------|------|
| 1 | TopBar | `title`=신규 "기록하기" / 수정 "기록 수정" + `leading="chevron-left"`(→`onBack`) |
| 2 | 책 헤더 | 중앙 정렬: `BookCover(lg, 제목·tint)` → 제목(text-h2, fw-bold) → 저자(text-body, muted) → "출판사 · 연도"(text-xs, subtle) |
| 3 | 별점 | 섹션 라벨 "별점" + 우측 힌트("N/5" 또는 "탭해서 별점을 남겨요"). 중앙 `StarRating(lg)` |
| 4 | 한 줄 평 | 라벨 "한 줄 평 (선택)" + `Input`(placeholder "이 책을 한 줄로 남긴다면?") |
| 5 | 메모 | 라벨 "메모 (선택)" + `Textarea`(rows 4, maxLength 500, placeholder "자유롭게 남겨보세요") + 글자 수 카운터 |
| 6 | 저장 | `Button(primary, lg, block, iconLeft="check")` — 신규 "서재에 담기" / 수정 "수정 완료". **별점 0이면 비활성**. 신규는 아래 안내 "별점을 남기면 서재에 담을 수 있어요"; **수정 모드는 아래 "서재에서 빼기" 삭제 버튼** |

- **섹션 패턴(`Section`):** 라벨 행(제목 + 옵션 "선택" 배지 + 우측 힌트) + 내용. `marginBottom 18`.
- **신규 vs 수정(`isEditing`):** 진입 책이 이미 서재에 있으면(`added`에 존재) **수정 모드** — 저장 버튼 "수정 완료", TopBar "기록 수정", 기존 `records[id]` 값 프리필. 신규(검색에서 진입, 미담김)면 "서재에 담기".
- **삭제(수정 모드):** 저장 버튼 아래 `Button` "서재에서 빼기"(iconLeft `trash-2`). **2탭 확인** — 1탭 시 `danger` variant + "한 번 더 누르면 서재에서 빠져요", 2탭 시 `onDelete`(`page.tsx`가 `added`/`records`/`addedAt`/`booksById`에서 제거 + 토스트 "'{제목}' 서재에서 뺐어요" + 서재로 복귀).
- **상태(state):**
  - **별점 필수 게이트:** `rating === 0`이면 저장 버튼 `disabled`(opacity 0.4). 별점 지정 시 활성(진초록).
  - **한줄평/메모:** 선택 입력. 저장 시 `trim()`. (비우면 삭제와 동일 효과 — 값이 지워짐.)
  - **저장(`onSave`)**: `page.tsx`가 `records[id]=draft` 저장 + `added`에 추가 + 토스트 + `activeKey="shelf"`로 복귀(담은 책을 서재에서 바로 확인). 영속화는 localStorage(O-13).
- **인터랙션:** 별 클릭 → 별점 설정(같은 별 재클릭 시 0). 입력 → 로컬 상태. leading chevron → `onBack`. 저장 → `onSave`. 삭제 → 2탭 후 `onDelete`.
- **사용 컴포넌트/토큰:** `TopBar`·`BookCover(lg)`·`StarRating(lg)`·`Input`·`Textarea`·`Button(primary lg block)`. 별점 `--rating`/`--rating-track`.
- **마이크로카피(원문):** "기록하기", "기록 수정", "별점", "탭해서 별점을 남겨요", "N/5", "한 줄 평", "선택", "이 책을 한 줄로 남긴다면?", "메모", "자유롭게 남겨보세요", "서재에 담기", "수정 완료", "별점을 남기면 서재에 담을 수 있어요", "서재에서 빼기", "한 번 더 누르면 서재에서 빠져요", "'{제목}' 서재에서 뺐어요". (13장 참조.)

### 11.5 로그인 (Login) — 구현 화면

- **목적:** 앱 진입 전 환영 + Google 로그인. PRD P0-1. **백엔드 없음** → "Google로 계속하기"는 실제 OAuth가 아니라 로그인 상태를 시뮬레이션(`onLogin`→`loggedIn=true`, localStorage 저장). 출처: `app/components/screens/Login.tsx`.
- **표시 조건:** `hydrated && !loggedIn`. 그 전(`!hydrated`)엔 스플래시(중앙 BookBuddy happy). 로그인 화면·스플래시엔 하단 내비 없음.
- **레이아웃(위→아래, 폰 내부):**

| 순서 | 영역 | 구성 |
|------|------|------|
| 1 | 히어로(중앙, flex-1) | `BookBuddy(happy, 120)` → 워드마크 "북박이장"(font-display, text-display 34px, fw 900, letterSpacing -0.03em) → 태그라인 "나만의 조용한 책장. / 읽은 책을 담고 별점과 한 줄 평을 남겨요."(text-body-lg, muted, maxWidth 260) |
| 2 | 로그인(하단) | **Google 버튼**(알약, `--surface-card` 배경 + `--border` + `--shadow-sm`, hover `--gray-50`, press scale, 좌측 4색 Google G 로고 20px + "Google로 계속하기" text-body-lg fw-bold) → 안내 "로그인하면 나만의 책장을 시작할 수 있어요"(text-xs, subtle) |

- **인터랙션:** Google 버튼 → `onLogin`(로그인). 로그아웃은 서재 TopBar `log-out` 액션(§11.2). 로그인 상태는 localStorage로 유지되어 새로고침해도 앱에 머문다.
- **사용 토큰/에셋:** `--surface-card`·`--border`·`--shadow-sm`·`--gray-50`·`--radius-pill`·`--press-scale`, `--text-strong`/`--text-muted`/`--text-subtle`, `--font-display`. Google G 로고는 4색 인라인 SVG(외부 브랜드 색 `#EA4335`/`#4285F4`/`#FBBC05`/`#34A853` 리터럴 — 토큰 아님, 15장).
- **마이크로카피(원문):** "북박이장", "나만의 조용한 책장.", "읽은 책을 담고 별점과 한 줄 평을 남겨요.", "Google로 계속하기", "로그인하면 나만의 책장을 시작할 수 있어요", (서재)"로그아웃". (13장 참조.)

### 11.6 홈 (Home) — 구현 화면 · 캐릭터 꾸미기(Avatar Customizer)

- **목적/컨셉:** 앱의 **시그니처 화면**. 마스코트를 **캐릭터·색·옷·소품으로 꾸미는 아바타 커스터마이저**(동물의 숲 스타일). 책을 읽을수록 옷·소품이 잠금 해제(**읽기 = 보상**), 캐릭터·테마색은 자유 선택. "오늘은 어떤 책을 읽으셨나요?" 로 오늘의 기록 유도. **내 서재(§11.2, 표지 그리드)와 다른 뷰.** 기본 진입 화면. 출처: `app/components/screens/Home.tsx`.
- **커스터마이즈 상태(`Customize`, localStorage):** `{ character, theme, outfit(소품), clothes(옷) }`.
- **레이아웃(위→아래, 스크롤):** 인사 → **스테이지**(`--brand-tint` 원형 + 그림자 위 DressedBuddy 132) → **잠금 티저**(`lock` "N권 더 읽으면 '{다음}'" / 전부 해제 시 `check` "다 모았어요!") → **캐릭터**(3) → **테마 색**(4) → **옷**(4) → **소품**(4) → CTA "오늘 읽은 책 담기".
- **캐릭터(3, 자유):** `book`(북버디, 몸체 `--brand`→테마색 따라감) · `duck`(오리, `--gold-500`+부리) · `tomato`(토마토, `#EE5B4A`+`--green-700` 꼭지). `BookBuddy character` prop(§10). 오리·토마토는 자기 색 유지(테마 무관).
- **테마 색(4, 자유):** `sage`(기본 그린) · `ocean`(파랑) · `coral`(코랄) · `grape`(보라). 각 프리셋이 `page.tsx` 최상위 래퍼에 `--brand`/`--brand-hover`/`--brand-active`/`--brand-soft`/`--brand-tint`를 인라인 오버라이드 → **UI 전체 + book 캐릭터 리컬러**. (리터럴 hex, 3.3.)
- **옷(clothes, body slot)·소품(outfit, 소품 slot) — 별도 2슬롯(동시 착용):**
  - 옷: `none`·`scarf`(목도리,2권)·`sweater`(스웨터,4권)·`apron`(앞치마,7권).
  - 소품: `none`·`bow`(리본,1권)·`glasses`(안경,3권)·`beret`(베레모,6권)·`crown`(왕관,10권).
  - **잠금 해제 = 읽은 책 수(`items.length`).**
- **한 세트 팔레트(제각각 방지):** 옷·소품은 **니트 팔레트 리터럴** `WOOL #E2895A`·`WOOL_D #BE6A3C`·`CREAM #F2E7CE`(+안경 프레임 `#5A4636`, 왕관은 특별 `--gold-500`)로 통일 → 하나의 세트처럼 보이게.
- **DressedBuddy(캐릭터별 착용 맞춤):** `BookBuddy(character)` 위 동일 viewBox 오버레이. 각 아이템은 `slot`(face/neck/hat/body)별로, **캐릭터별 `FIT` 트랜스폼**(CSS transform + `transformBox:view-box` transform-origin)으로 위치·크기 보정 — 둥근 오리/토마토는 모자를 더 아래로, 옷을 더 좁게. 안경(face)은 눈 cx34/56 정렬이라 보정 불필요.
- **타일:** 미니 `DressedBuddy(40/44)`(그 캐릭터가 해당 아이템 착용 미리보기) 또는 캐릭터/색 스와치 + 라벨. 상태: 선택(2px `--brand`+`--brand-tint`) · 해제(tap) · 잠금(`grayscale`+opacity.4+`lock`+"N권").
- **마이크로카피(원문):** "오늘은 어떤 책을 읽으셨나요?", "지금까지 N권 읽었어요", "책을 읽고 친구를 꾸며보세요", "N권 더 읽으면 '{아이템}'", "다 모았어요!", "캐릭터", "테마 색", "옷", "소품", 캐릭터명 "북버디/오리/토마토", 테마명 "세이지/바다/코랄/포도", 아이템명 "없음/리본/안경/베레모/왕관/목도리/스웨터/앞치마", "N권", "오늘 읽은 책 담기". (13장 참조.)

---

## 12. 패턴(Patterns)

관찰된 반복 패턴(출처: 컴포넌트/화면 코드).

- **내비게이션 — 3탭 원형 바:** BottomNav. 좌/우 soft 원형 + 중앙 primary 강조(xl 64px, elevated `--shadow-brand`, marginTop -20으로 바 위 돌출). 구성: 검색 · 홈(primary) · 내 서재.
- **상단바 패턴:** 홈=워드마크("북박이장", fontWeight 900), 서브스크린=중앙 타이틀 + `chevron-down`; 우측은 `stats`(아이콘+숫자 칩, 예: flame/friend) 와 `actions`(ghost IconButton, 예: settings). 반투명 배경 + `blur(10px)`.
- **표면 계층:** 페이지 `--surface-page`(세이지) 위에 카드 `--surface-card`(흰색), 눌린 표면 `--surface-sunken`. 헤더/내비는 `color-mix(surface-card 88%)` 반투명 + blur로 콘텐츠 위에 떠 있음.
- **버튼 위계:** 알약형. primary(그린) > dark(잉크) > soft(연그린) > ghost > danger. 아이콘 전용은 원형 IconButton(brand/soft/ghost/plain).
- **프레스 피드백:** 모든 버튼 `scale(0.96)` + 배경 진해짐(dur-fast 120ms).
- **별점(rating) 패턴:** 1~5 **정수**(별 5개, 0.5 없음). 채움 `--rating(gold-500 #EFC24B)` + `Icon` `fill`, 빈 트랙 `--rating-track(gray-300)`. 아이콘 `star`. (PRD P0-5 `01-prd.md:80,143`.) — **`StarRating`(§9.8)로 구현됨.** 기록 화면에서 사용.
- **프로필 표현:** 원형 아바타(`--brand-tint` 배경 + `user` 아이콘 또는 이미지) + 이름 + 태그라인. 미설정 시 기본 아바타(PRD P1-14).
- **빈 상태(empty state) 패턴:** 마스코트 + 제목 + 설명(2줄) + 단일 primary CTA. 중앙 정렬, `maxWidth 240`으로 텍스트 폭 제한. **결과 없음/대기 상태**도 같은 골격(마스코트 표정만 교체: 대기 `reading`, 없음 `sad`)을 재사용.
- **검색 입력 패턴:** `Input`(iconLeft `search`, `clearable`, `autoFocus`). 포커스 시 border `--brand` + `--focus-ring` 글로우. 값 입력 시 즉시 필터(디바운스 없음, 로컬).
- **결과 리스트 행(ResultRow) 패턴:** 표지 썸네일(`BookCover sm`) + 텍스트 블록(제목/저자/메타 3단, 1줄 말줄임) + 우측 상태형 액션 버튼. 행 구분 `1px --divider`.
- **표지 플레이스홀더 패턴:** 실제 표지 부재 시 `BookCover`가 틴트 카드 + spine + 제목 앞 2글자로 대체. 항목별 `tint`로 시각 구분.
- **성공 토스트 패턴:** 화면 하단 중앙 다크 알약(`--surface-dark`) + `check` 아이콘(`--brand-soft`) + 짧은 확인 문구. `2200ms` 자동 소멸. **`page.tsx`가 상태를 소유하고 `PhoneFrame`이 내비 위에 전역 렌더** → 검색·기록 등 어느 화면에서 담아도 동일 위치에 노출. "담기"·"서재에 담기" 등 되돌릴 수 있는 단발 액션의 피드백에 사용(O-9의 "성공 피드백" 부분 해소).
- **폼 섹션 패턴(기록 화면):** 라벨 행(제목 + 옵션 "선택" 배지 + 우측 힌트) + 입력. `Input`/`Textarea`/`StarRating`을 세로로 쌓고, 마지막에 primary block 저장 버튼.
- **필수 입력 게이트 패턴:** 핵심 입력(별점)이 비면 저장 버튼 `disabled`(opacity 0.4) + 하단 안내 문구. 조건 충족 시 활성. 과한 에러 대신 조용한 비활성으로 유도(P1 조용함 원칙).
- **표지 그리드(shelf) 패턴:** 서재를 `repeat(3, 1fr)` 그리드로 표지 중심 표시(원칙 P4). 셀 = `BookCover(lg)` + 제목(2줄 말줄임) + `StarRating(sm, readOnly)` 또는 "미평가". 최신 담은 책이 앞.
- **캐릭터 옷 갈아입히기(dress-up) 패턴:** 홈(§11.6)의 시그니처. `BookBuddy` 위에 동일 viewBox 오버레이 SVG로 액세서리를 겹쳐 꾸민다. **읽은 책 수로 옷이 잠금 해제**되고(진행=보상), 옷장 그리드에서 선택(선택 상태 하이라이트, 잠김은 grayscale+`lock`). 미니 프리뷰 = 그 옷 입은 미니 북버디.
- **통계 요약 카드 패턴:** `--surface-card` 카드를 세로 divider로 N분할해 핵심 수치(권수·평균 별점)를 큰 숫자(text-h2 extrabold) + 라벨로. 평균 별점은 gold `star` 아이콘 동반. 스크롤 컨테이너 안에서는 `flexShrink: 0`으로 찌그러짐 방지.
- **막대 차트 패턴:** 시간축 magnitude → 세로 막대. 단일 시리즈면 레전드 없음(제목이 시리즈명). baseline 0, 막대 `--brand` 단일 색조(4~6px 라운드 데이터-엔드), 흐린 트랙 `--surface-sunken`, 0 값은 트랙만. 개수/값 라벨은 **잉크 토큰**(시리즈색 아님). 모바일 폭 고려해 최근 6개월. (dataviz 스킬 절차 준수.)
- **스트릭/스탯 칩(레퍼런스에서만):** 레퍼런스 시안에는 flame·friend 카운트 칩과 "클로버 2개" 초록 배지가 있으나(TopBarStat 패턴에 대응) 현재 BookJjang 화면에는 미사용. (15·17장 참조.)

---

## 13. 보이스 & 톤 / 마이크로카피

### 13.1 어조 규칙 _(관찰 기반, 일부 추론)_

- **다정한 반말–존댓말 혼합의 청유형:** "…담아볼까요?" 처럼 부드럽게 권유. 명령형 대신 청유형.
- **조용하고 담백:** 과장·느낌표 남발 없음(빈상태 문구에 느낌표 없음). "나만의 조용한 책장" 톤 유지.
- **짧고 명확한 CTA:** "책 검색하러 가기" 처럼 행동 동사 + 목적.
- **한국어 원문 보존:** UI 문구는 한 글자도 바꾸지 않는다(줄바꿈 `<br/>` 포함).

### 13.2 UI 등장 문구 — 원문 전수(BookJjang)

| 문구(원문) | 위치 | 맥락 |
|-----------|------|------|
| `북박이장` | `TopBar.tsx:76`, `page.tsx`(wordmark) | 워드마크 |
| `북박이장 — 나만의 조용한 책장` | `layout.tsx:5` | 문서 title(탭). (구 "북박이장 — 빈 서재"에서 변경 — 앱이 빈 서재 외 화면을 포함하게 되어 갱신) |
| `북박이장(BookJjang) — 나만의 조용한 책장. 읽은 책을 담고, 별점과 한 줄 평을 기록하는 개인 독서 기록 앱.` | `layout.tsx:6` | meta description |
| `9:41` | `page.tsx:86` | 상태바 시간 |
| `설정` | (미사용) | 구 settings 액션 라벨. 현재 서재 헤더는 `로그아웃`으로 교체됨(설정 화면 향후) |
| `독서가 민지` | `page.tsx:143` | 프로필 이름(예시) |
| `나만의 조용한 책장` | `page.tsx:146` | 프로필 서브/태그라인 |
| `아직 서재가 비어 있어요` | `page.tsx:173` | 빈 상태 제목 |
| `읽은 책을 검색해서` | `page.tsx:184` | 빈 상태 설명 1행 |
| `내 서재에 첫 책을 담아볼까요?` | `page.tsx:185` | 빈 상태 설명 2행 |
| `책 검색하러 가기` | `page.tsx:189` | 빈 상태 CTA |
| `검색` | `page.tsx:8` | 내비 라벨(search) |
| `홈` | `page.tsx:9` | 내비 라벨(home) |
| `내 서재` | `page.tsx:10` | 내비 라벨(shelf) |
| `책 검색` | `BookSearch.tsx` | 검색 화면 TopBar 타이틀 |
| `제목이나 저자를 검색해 보세요` | `BookSearch.tsx` | 검색창 placeholder |
| `어떤 책을 찾고 있나요?` | `BookSearch.tsx` | 검색 대기 상태 제목 |
| `제목이나 저자를 입력하면 여기에 결과가 나와요` | `BookSearch.tsx` | 검색 대기 상태 설명 |
| `검색 결과 N권` | `BookSearch.tsx` | 결과 카운트(N=결과 수) |
| `담기` | `BookSearch.tsx` | 결과 행 담기 버튼 |
| `담김` | `BookSearch.tsx` | 담긴 뒤(비활성) 버튼 |
| `'{제목}' 서재에 담았어요` | `BookSearch.tsx` | 담기 성공 토스트(제목 삽입) |
| `'{검색어}' 검색 결과가 없어요` | `BookSearch.tsx` | 결과 없음 제목(검색어 삽입) |
| `다른 제목이나 저자로 검색해 볼까요?` | `BookSearch.tsx` | 결과 없음 설명 |
| `지우기` | `Input.tsx` | 검색창 clear 버튼 aria-label |
| `기록하기` | `BookRecord.tsx` | 기록 화면 TopBar 타이틀 |
| `별점` | `BookRecord.tsx` | 별점 섹션 라벨 |
| `탭해서 별점을 남겨요` | `BookRecord.tsx` | 별점 미입력 힌트 |
| `N/5` | `BookRecord.tsx` | 별점 힌트(N=현재 별점) |
| `한 줄 평` | `BookRecord.tsx` | 한줄평 섹션 라벨 |
| `선택` | `BookRecord.tsx` | 선택 입력 배지 |
| `이 책을 한 줄로 남긴다면?` | `BookRecord.tsx` | 한줄평 placeholder |
| `메모` | `BookRecord.tsx` | 메모 섹션 라벨 |
| `자유롭게 남겨보세요` | `BookRecord.tsx` | 메모 placeholder |
| `서재에 담기` | `BookRecord.tsx` | 기록 저장 버튼 |
| `별점을 남기면 서재에 담을 수 있어요` | `BookRecord.tsx` | 저장 버튼 하단 안내 |
| `별 N개` | `StarRating.tsx` | 별 버튼 aria-label |
| `읽은 책` | `Library.tsx` | 서재 통계 라벨(권수) |
| `권` | `Library.tsx` | 권수 단위 |
| `평균 별점` | `Library.tsx` | 서재 통계 라벨(평균) |
| `내 책장` | `Library.tsx` | 서재 그리드 섹션 헤더 |
| `책 담기` | `Library.tsx` | 서재 헤더의 검색 이동 버튼 |
| `미평가` | `Library.tsx` | 별점 없는 책 표시 |
| `최근 6개월` | `Library.tsx` | 월별 차트 제목 |
| `N월` | `Library.tsx` | 월별 차트 x축 라벨(N=월) |
| `로그아웃` | `Library.tsx`·`Home.tsx` | TopBar 로그아웃 액션 |
| `오늘은 어떤 책을 읽으셨나요?` | `Home.tsx` | 홈 인사 |
| `지금까지 N권 읽었어요` | `Home.tsx` | 홈 서브(N=읽은 수) |
| `책을 읽고 친구를 꾸며보세요` | `Home.tsx` | 홈 서브(0권) |
| `N권 더 읽으면 '{아이템}'` | `Home.tsx` | 다음 아이템 잠금 티저 |
| `다 모았어요!` | `Home.tsx` | 아이템 전부 해제 |
| `캐릭터`·`테마 색`·`옷`·`소품` | `Home.tsx` | 꾸미기 섹션 헤더 |
| `북버디`·`오리`·`토마토` | `Home.tsx` | 캐릭터 이름 |
| `세이지`·`바다`·`코랄`·`포도` | `Home.tsx` | 테마 색 이름 |
| `없음`·`리본`·`안경`·`베레모`·`왕관`·`목도리`·`스웨터`·`앞치마` | `Home.tsx` | 옷/소품 이름 |
| `N권`(잠금) | `Home.tsx` | 잠긴 아이템 해제 조건 |
| `오늘 읽은 책 담기` | `Home.tsx` | 홈 담기 CTA |
| `나만의 조용한 책장.` | `Login.tsx` | 로그인 태그라인 1행 |
| `읽은 책을 담고 별점과 한 줄 평을 남겨요.` | `Login.tsx` | 로그인 태그라인 2행 |
| `Google로 계속하기` | `Login.tsx` | Google 로그인 버튼 |
| `로그인하면 나만의 책장을 시작할 수 있어요` | `Login.tsx` | 로그인 버튼 하단 안내 |

> **레퍼런스 이미지에만 등장(BookJjang 아님, 15·17장 참조):** "오늘의 냠냠지식이 도착했어요!", "클로버 2개", "2026년 5월", "5.7 목요일", "오늘 날씨가 너무 좋다", "동생이 전역기념 밥을 사준다!", "답장 확인".

---

## 14. 접근성

코드/시안에서 확인되는 항목.

| 항목 | 상태 | 근거 |
|------|------|------|
| 아이콘 버튼 대체텍스트 | ✅ 부분 — IconButton `aria-label`, TopBar action `aria-label = label||icon`, leading "menu" | `IconButton.tsx:76`, `TopBar.tsx:62,121` |
| Icon 장식 처리 | ✅ 미등록 name 시 `aria-hidden` | `Icon.tsx:86` |
| 마스코트 대체텍스트 | ✅ `role="img"` + `aria-label="book character — {expr}"` | `BookBuddy.tsx:168–169` |
| 모션 저감 | ✅ BookBuddy가 `prefers-reduced-motion` 존중 | `BookBuddy.tsx:147–151` |
| 문서 언어 | ✅ `<html lang="ko">` | `layout.tsx:20` |
| 포커스 표시 | ⚠️ **부분** — `Input`·`Textarea`는 포커스 시 `--brand` 보더 + `--focus-ring` 글로우로 가시성 확보. 단 `Button`/`IconButton`/`StarRating` 별 버튼은 여전히 `outline: "none"`으로 키보드 포커스 가시성 없음 | `Input.tsx`, `Textarea.tsx`, `Button.tsx:121`, `IconButton.tsx:102` |
| 별점 시맨틱 | ✅ `StarRating`은 `role="radiogroup"` + 별 `role="radio"`·`aria-checked`·`aria-label="별 N개"` | `StarRating.tsx` |
| 폼 입력 라벨 | ✅ 기록 화면 입력은 `aria-label`(별점/한 줄 평/메모) 제공 | `BookRecord.tsx` |
| 색 대비 | ⚠️ 미검증 — 특히 `soft`/`brand-soft(#B7DCA6)` 위 흰색 아이콘·텍스트 대비 낮을 가능성. WCAG 수치 미확인 | 권고 |
| 터치 타깃 | ✅ 대체로 충분 — 최소 36px(sm), 내비 56/64px | `IconButton.tsx:25` |
| 상태바/장식 요소 | ⚠️ 상태바·노치·홈인디케이터에 대체텍스트/aria 없음(순수 장식) | `page.tsx` |

권고: 포커스 링을 `--focus-ring`로 부활, soft 계열 대비 재검토, 실제 텍스트 대비 측정.

---

## 15. 에셋 인벤토리 & 레퍼런스

| 유형 | 파일/소스 | 경로 | 비고 |
|------|----------|------|------|
| 폰트 | Pretendard Variable | `public/fonts/PretendardVariable.woff2` | @font-face `src: /fonts/PretendardVariable.woff2` (`globals.css:14`) |
| 폰트(중복본) | Pretendard Variable | 리포 루트 `PretendardVariable.woff2` | 2,057,688 bytes(루트 사본). 실제 로드는 `public/fonts/`에서 |
| 아이콘 | lucide-react | npm `lucide-react@0.469.0` | 23개 등록(8장, `check`·`log-out`·`lock` 추가) |
| Favicon | 브랜드 book SVG | `app/icon.svg` | Next App Router가 자동 favicon으로 서빙(`<link rel=icon href=/icon.svg>`). 색: `#4FA557`(=`--brand`)·`#FFFFFF`(=`--white`)·`#DDE0D6`(=`--border`)·`#FF5247`(=`--danger`), 빨간 북마크 포함(BookBuddy 모티프). SVG라 토큰 대신 리터럴 hex |
| 도서 검색 API | 알라딘(Aladin) ItemSearch | `app/api/search/route.ts`(서버 프록시) | `ALADIN_TTB_KEY` 환경변수로 호출. 결과 표지(`cover` URL, `image.aladin.co.kr`)·제목·저자·출판사·출간연도 반환. 키 없으면 `configured:false` |
| 환경변수 | `ALADIN_TTB_KEY` | `.env.local`(미포함) | 알라딘 오픈API TTB 키. 무료 발급(aladin.co.kr). 미설정 시 목업 폴백(O-15) |
| 도서 카탈로그(폴백) | 로컬 목업 데이터 | `app/data/books.ts` | 8권 `RecordBook[]` + `getBook(id)`. **알라딘 키 없을 때 폴백**. 담은 책 전체정보는 `page.tsx` `booksById`에 저장 |
| Google G 로고 | 4색 인라인 SVG | `Login.tsx`(`GoogleG`) | Google 로그인 버튼용. 외부 브랜드 색 리터럴(`#EA4335`/`#4285F4`/`#FBBC05`/`#34A853`) — DS 토큰 아님 |
| 레퍼런스 이미지 1 | `reference1.png` | 리포 루트 | ⚠️ **BookJjang 화면 아님** — 파란 고래 마스코트 "냠냠지식" 카드 앱. 아래 15.1 |
| 레퍼런스 이미지 2 | `rreferece2.png` | 리포 루트 | ⚠️ **BookJjang 화면 아님** — 캘린더/다이어리 앱. 파일명 오타(`rreferece`). 아래 15.1 |
| PRD | `01-prd.md` | 리포 루트 | 제품 요구사항 |
| 메타 프롬프트 | `04-design-md-meta.md` | 리포 루트 | 본 문서 생성 지시서 |

**정적 에셋 인벤토리:** `public/` 하위에는 `fonts/PretendardVariable.woff2` 하나뿐(이미지/아이콘 정적 파일 없음).

### 15.1 레퍼런스 이미지 관찰(Read 도구로 실제 확인) 및 코드 대조

두 이미지는 **BookJjang의 하이파이 시안이 아니라 같은 디자인 언어(원형 하단 내비·마스코트·스탯 칩·폰 프레임)를 공유하는 형제 앱의 스타일 레퍼런스**다. 관찰된 요소와 BookJjang DS 대응:

**`reference1.png`** — 상태바 `3:16` + 신호/와이파이/배터리; 상단바에 좌측 스타일 로고("EEO" 느낌) · `flame 0` · `person 0` · `settings`; 중앙 흰 라운드 카드; 카드 우상단에 **파란 고래 마스코트가 걸쳐 넘겨다봄**(검은 점눈 2개, 빨간 코/볼, 물방울); 카드 안 오니기리(주먹밥, 김=검은 라운드 사각) 일러스트; 문구 "오늘의 냠냠지식이 도착했어요!"; 하단 **3원형 내비**(연파랑 `+` · 큰 파랑 elevated `home` · 연파랑 archive).
→ 대응: TopBar(stats: flame/friend, actions: settings) · 카드 빈상태 · **마스코트가 카드에 걸쳐 넘겨다보는 배치**(BookJjang은 현재 중앙 배치) · BottomNav(중앙 primary elevated). 색만 파랑(BookJjang은 그린).

**`rreferece2.png`** — 상태바 `10:48`; 상단바에 좌측 `list` · 중앙 타이틀 "2026년 5월" + `chevron-down` · 우측 `settings`; 우측 초록 배지 "클로버 2개"; **월간 캘린더 그리드**(일~토, 1–31, 날짜 뒤 구름/블롭, 일부 날에 초록 클로버, 7일 선택=다크 원); 하단 시트 "5.7 목요일" + kebab(⋮) + 카드형 리스트 2개("1. 오늘 날씨가 너무 좋다", "2. 동생이 전역기념 밥을 사준다!"); 다크 버튼 "답장 확인"; 우하단 원형 FAB 일부.
→ 대응: TopBar(leading=list, title+chevron, actions=settings) · 초록 tint 배지(green chip 패턴) · `Button variant="dark"`("답장 확인") · 카드형 리스트 · surface-blobs(구름 블롭).

**결론:** 위 요소 중 BookJjang 코드에 **아직 없는 것** = 마스코트의 "카드에 걸쳐 넘겨다보기" 배치, 캘린더, 스탯 칩 실사용, green chip 배지, FAB, 카드 리스트. 모두 "시안에만 존재(형제 앱)"로 표기하고 열린 질문 O-2로 이관.

---

## 16. PRD ↔ 디자인 매핑

PRD(`01-prd.md`) 요구사항 → 대응 화면/컴포넌트. 대응 디자인이 없으면 "디자인 필요".

### P0 (필수 · MVP)

| PRD # | 요구사항 | 대응 디자인 | 상태 |
|:---:|------|------|------|
| P0-1 | 구글 로그인/로그아웃 | 로그인 화면(§11.5) + 서재 로그아웃 | ⚠️ 부분(로그인 화면·Google 버튼·로그아웃·세션 유지 구현. **실제 OAuth/백엔드 없이 시뮬레이션** — O-14) |
| P0-2 | 책 검색(제목/저자, 결과 표지·제목·저자·출판사·출간일, 없음/오류 처리) | **책 검색 화면**(§11.3) · **알라딘 API 프록시** · `Input`·`BookCover`(실표지) | ✅ 구현(실검색·표지·로딩·오류·없음). 키 미설정 시 목업 폴백(O-15) |
| P0-3 | 책 상세(표지·제목·저자·출판사·출간일·소개) | 기록 화면 책 헤더(§11.4) + 실표지 | ⚠️ 부분(실표지·제목·저자·출판사·연도 표시. 책 소개/설명·전용 상세 페이지 미구현) |
| P0-4 | 내 서재에 추가(중복 방지·성공 피드백) | 결과 "담기" + 기록 "서재에 담기" · 토스트(§12) | ✅ 구현(담기·기록 저장+토스트+중복방지 + localStorage 영속화). 계정 연동은 미구현 |
| P0-5 | 별점 1~5 정수 | **`StarRating`(§9.8)** · 기록 화면 | ✅ 구현(정수 1~5, 재클릭 해제, 저장 게이트) |
| P0-6 | 한줄평 작성/수정/삭제 | `Input` · 기록/수정 화면 "한 줄 평" | ✅ 구현(작성·수정·재진입 프리필, 비우면 삭제). 책째 삭제는 "서재에서 빼기" |
| P0-7 | 메모(책당 1개) 작성/수정/삭제 | **`Textarea`(§9.9)** · 기록/수정 화면 "메모" | ✅ 구현(작성·수정, 비우면 삭제) |
| P0-8 | 마이페이지 읽은 책 목록/그리드(표지·제목·별점) | **내 서재(§11.2)** 3열 표지 그리드 + 프로필 | ✅ 구현(표지·제목·별점 그리드 + localStorage 영속화). 정렬/필터(P1-15) 미구현 |
| P0-9 | 독서 통계(총 읽은 권수·읽는 중·평균 별점 카드 + 최근 12개월 월별 막대) | 서재 통계 요약 카드 + 월별 막대 차트(§11.2) | ✅ 대부분(총 권수·평균 별점 카드 + 월별 막대 차트 구현). "읽는 중" 분류(P1-12)·12→6개월 축약 예외 |

### P1 (권장)

| PRD # | 요구사항 | 대응 디자인 | 상태 |
|:---:|------|------|------|
| P1-10 | 시작일/완료일 | 날짜 입력 · `calendar` 아이콘 | ⚠️ 아이콘만 |
| P1-11 | 진행률(페이지/%) | 진행률 바 | ❌ 디자인 필요 |
| P1-12 | 독서 상태(읽는 중/완료/읽고 싶음) 분류·필터 | 상태 칩·필터 | ❌ 디자인 필요 |
| P1-13 | 별명 변경 | 프로필 편집 | ❌ 디자인 필요 |
| P1-14 | 프로필 이미지(기본 아바타·JPG/PNG·2MB·정사각 크롭) | 아바타(`user` 기본) | ⚠️ 기본 아바타 패턴만 |
| P1-15 | 삭제/정렬/필터 | 삭제="서재에서 빼기"(§11.4, `trash-2`, 2탭 확인) · 정렬/필터 UI | ⚠️ 부분(삭제 구현. 정렬/필터 미구현) |

> P2(16~19: 목표·장르통계·내보내기·스트릭)는 디자인 전무. `flame` 아이콘이 스트릭용으로 등록만 됨.

---

## 17. 미정의 / 열린 질문(Open Questions)

| ID | 항목 | 내용 | 근거/후속 |
|:---:|------|------|------|
| O-1 | 반응형 규격 | PRD는 "반응형 웹 우선"이나 구현은 고정 390×844 폰 목업뿐. 브레이크포인트/데스크톱 레이아웃 미정의 | `01-prd.md:121` vs `page.tsx` · **디자인 필요** |
| O-2 | 레퍼런스 불일치 | `reference1.png`/`rreferece2.png`가 BookJjang이 아닌 형제 앱(고래 "냠냠지식", 캘린더). 진짜 BookJjang 하이파이 시안 부재 | 15.1 · 시안 확보 필요 |
| O-3 | BottomNav 비활성 quirk | 비활성 항목이 `variant="soft"`이면서 인라인으로 `background: --brand-soft, color: white` 재지정 — 중복. active/비active 시각 구분 의도 불명확 | `BottomNav.tsx:45–49` · `근거: TBD` |
| O-4 | 포커스 링 부분 적용 | `--focus-ring(#92CC7C)`이 `Input`에는 적용됨(포커스 글로우). 그러나 `Button`/`IconButton`은 여전히 `outline:none` → 버튼류 키보드 포커스 가시성 미해결 | `Input.tsx` · `Button.tsx:121`, `IconButton.tsx:102` · 접근성 |
| O-5 | soft 대비 | `soft`/`brand-soft(#B7DCA6)` 위 흰색 전경 대비 WCAG 미검증 | 14장 |
| O-6 | 하드코딩 색 토큰화 | `#d9ddcf`(body), `#1a1c17`/`#0d0f0b`(디바이스), `#E5352B`/`#CC2E25`(danger hover/active) 토큰 미정의 | 3.3 · `근거: TBD` |
| O-7 | 미사용 자산 | 사용 확대됨(search·chevron-left·x·plus·check·book-open·star·log-out, BookBuddy happy/reading/sad, Button soft/ghost, StarRating). **여전히 미사용:** 아이콘 `settings`·`flame`·`calendar`·`list`·`archive`·`trash-2`·`chevron-right`·`signal`·`wifi`·`battery-full`, 표정 excited/wink/surprised, Button `dark`/`danger`, IconButton `plain`, BookBuddy cycle | 향후 화면(설정·상태·정렬 등)에서 활용 예정 |
| O-8 | 차트 라이브러리 | 월별 막대 차트를 **Recharts 대신 토큰 기반 네이티브 CSS 막대**(`MonthlyChart`)로 구현 — 단일 시리즈 6막대엔 의존성 불필요, 토큰 정합·번들 경량·React 19 호환 이슈 회피. PRD가 명시한 Recharts(`01-prd.md:126,147`)와의 의도적 편차. 또한 모바일 폭 위해 "최근 12개월"→**6개월** 축약. 더 복잡한 차트(다시리즈 등) 필요 시 Recharts 재검토 | §11.2 · 결정 기록 |
| O-9 | 성공/토스트·입력 컴포넌트 | `Input`(§9.6)·`Textarea`(§9.9)·`StarRating`(§9.8)·성공 토스트(PhoneFrame 전역)까지 추가되어 검색 입력·별점·한줄평·메모·성공 피드백은 구현. **남은 것:** 재사용 가능한 독립 `Toast`·`Dialog(확인창)` DS 컴포넌트(현재 토스트는 PhoneFrame 인라인, 삭제 확인은 2탭 방식), 폼 유효성/에러 메시지 컴포넌트 | 컴포넌트 확장 필요 |
| O-12 | 원격 검색 상태 | **대부분 해결.** 알라딘 연동으로 로딩("책을 찾고 있어요")·오류("검색 중 문제가…")·결과없음 상태 구현. **남은 것:** 페이지네이션/무한스크롤(현재 MaxResults 20 고정) | §11.3 |
| O-15 | 알라딘 키 필요 | 실사 표지·실검색은 **알라딘 TTB 키**(`ALADIN_TTB_KEY`, `.env.local`)가 있어야 켜진다. 무료 발급이나 사용자 계정 필요 → 미설정 시 목업 8권으로 폴백. 키 발급: aladin.co.kr 오픈API. 프록시는 `app/api/search/route.ts` | §11.3 · 사용자 키 발급 |
| O-14 | 인증 시뮬레이션 | 로그인 화면·Google 버튼·로그아웃·세션 유지(localStorage)는 구현되나 **실제 Google OAuth·백엔드·사용자 계정이 없다**. "Google로 계속하기"는 `loggedIn=true`로 전환만. 실제 인증·프로필(이름/이미지 P1-13,14)·계정별 데이터는 백엔드 필요 | §11.5 · P0-1 |
| O-13 | 서재 영속화 | **로컬 영속화 구현됨.** `page.tsx`가 `added`+`records`를 `localStorage`(키 `bookjjang.shelf.v1`)에 저장/복원 → 새로고침해도 서재·기록 유지(마운트 후 `useEffect`로 로드, SSR 하이드레이션 미스매치 회피). **남은 것:** 백엔드 동기화·다기기·로그인 계정 연동(P0-1 필요) | §11.2 · P0-4,8 |
| O-10 | 폰트 중복본 | `PretendardVariable.woff2`가 루트와 `public/fonts/`에 이중 존재. 루트본 용도 불명 | 정리 검토 |
| O-11 | 워드마크 weight | 워드마크가 토큰(`--fw-*` 최대 800) 밖의 `fontWeight 900` 리터럴 사용(TopBar 22px / page 22px). 가변폰트 상한 920 내이므로 유효하나 토큰 부재 | `TopBar.tsx:70` |

---

## 부록: 커버리지 검증

메타 프롬프트 §4 자기감사 수행 결과.

### A. `app/globals.css` CSS 변수 1:1 대조

`globals.css`에 정의된 전체 커스텀 프로퍼티를 카테고리별로 카운트하고 본문 등장 여부를 대조.

| 카테고리 | 정의 수 | 문서 반영 | 위치 |
|------|:---:|:---:|------|
| 원시 컬러 램프(green8·ink7·surface7·accent4) | 26 | ✅ 26 | §3.1 |
| Semantic alias | 27 | ✅ 27 | §3.2 |
| 타이포(font2·weight5·scale16·tracking4) | 27 | ✅ 27 | §4 |
| 스페이싱/레이아웃(space11·gutter·max) | 13 | ✅ 13 | §5.1–5.2 |
| Radius | 6 | ✅ 6 | §6.1 |
| Shadow | 5 | ✅ 5 | §6.2 |
| 모션(ease2·dur3·press1) | 6 | ✅ 6 | §7.1 |
| **합계** | **110** | **✅ 110** | 누락 0 |

> 주: `--focus-ring`은 색상 정의(§3.2)이자 모션/포커스 맥락(§7.1)에 이중 언급. 이중 카운트 방지를 위해 컬러(§3.2)에서 1회만 집계. 하드코딩 비(非)토큰 색상 7종은 §3.3에 별도 기록.

✅ **CSS 변수 누락 0.**

### B. `index.ts` export ↔ 컴포넌트 섹션 대조

| export 심볼 | 종류 | 문서 |
|------|------|:---:|
| `Icon` / `IconProps` | 컴포넌트+타입 | ✅ §9.1 |
| `Button` / `ButtonProps` | 컴포넌트+타입 | ✅ §9.2 |
| `IconButton` / `IconButtonProps` | 컴포넌트+타입 | ✅ §9.3 |
| `Input` / `InputProps` | 컴포넌트+타입 | ✅ §9.6 |
| `Textarea` / `TextareaProps` | 컴포넌트+타입 | ✅ §9.9 |
| `StarRating` / `StarRatingProps` | 컴포넌트+타입 | ✅ §9.8 |
| `BookCover` / `BookCoverProps` / `BookCoverTint` | 컴포넌트+타입 | ✅ §9.7 |
| `BookBuddy` / `BookBuddyProps` / `Expression` / `Character` | 컴포넌트+타입 | ✅ §10 |
| `TopBar` / `TopBarProps` / `TopBarStat` / `TopBarAction` | 컴포넌트+타입 | ✅ §9.4 |
| `BottomNav` / `BottomNavProps` / `BottomNavItem` | 컴포넌트+타입 | ✅ §9.5 |

✅ **누락 컴포넌트/타입 0** (컴포넌트 10/10, 타입 16/16). PhoneFrame·Login·Home·Library·BookSearch·BookRecord(+`app/data/books.ts`·`app/api/search`)는 index.ts 미export 화면/데이터 레이어(§9 주석·§11).

### C. 각 `.tsx` Props 인터페이스 ↔ Props 표 대조

| 컴포넌트 | 정의 props 수 | 문서 표 | 결과 |
|------|:---:|:---:|:---:|
| Icon | 7 (name,size,stroke,color,fill,style,className) | 7 | ✅ |
| Button | 9 (children,variant,size,block,disabled,iconLeft,iconRight,onClick,style) | 9 | ✅ |
| IconButton | 8 (icon,variant,size,elevated,disabled,aria-label,onClick,style) | 8 | ✅ |
| Input | 13 (value,onChange,placeholder,iconLeft,clearable,onClear,size,type,disabled,autoFocus,aria-label,onKeyDown,style) | 13 | ✅ |
| Textarea | 8 (value,onChange,placeholder,rows,maxLength,disabled,aria-label,style) | 8 | ✅ |
| StarRating | 7 (value,onChange,max,size,readOnly,aria-label,style) | 7 | ✅ |
| BookCover | 5 (title,src,size,tint,style) | 5 | ✅ |
| BookBuddy | 9 (expression,character,size,bookmark,blink,cycle,cycleMs,cycleList,style) | 9 | ✅ |
| TopBar | 8 (wordmark,title,withChevron,leading,onLeading,stats,actions,style) | 8 | ✅ |
| BottomNav | 4 (items,activeKey,onSelect,style) | 4 | ✅ |

✅ **누락 prop 0.** (variant/size/expression/tint 등 열거형 값도 전수 반영: Button variant 5·size 3, IconButton variant 4·size 4, Input size 2, Textarea, StarRating size 3, BookCover size 3·tint 4, Expression 7.)

### D. `reference*.png` 관찰 요소 반영 여부

| 관찰 요소 | 반영 | 위치 |
|------|:---:|------|
| 폰 프레임/상태바/노치 | ✅ | §5.4 |
| 마스코트가 카드에 걸쳐 넘겨다봄 | ⚠️ 기록됨(미구현) | §15.1, O-2 |
| TopBar stats(flame/friend)·settings | ✅ 기록 | §15.1, §12 |
| green chip("클로버 2개") | ⚠️ 기록됨(미구현) | §15.1, O-2 |
| 3원형 BottomNav(중앙 primary) | ✅ | §9.5, §15.1 |
| 캘린더 그리드 | ⚠️ 기록됨(형제앱, 미구현) | §15.1, O-2 |
| dark 버튼("답장 확인") | ✅ 매핑 | §15.1 |
| FAB/카드 리스트/구름 블롭 | ⚠️ 기록됨(미구현) | §15.1, O-2 |

⚠️ 미구현 관찰 요소는 모두 §17 O-2로 이관 완료.

### E. PRD P0 요구사항 ↔ §16 매핑표 존재 확인

P0-1 ~ P0-9 **9개 전부** §16 매핑표에 등재. ✅ (P1 6개, P2 4개도 반영/언급.)

### F. 검증 체크리스트 요약

| 항목 | 결과 |
|------|:---:|
| A. CSS 변수 110/110 | ✅ |
| B. export 심볼 26/26 | ✅ |
| C. props 78/78 | ✅ |
| D. 레퍼런스 요소 반영 | ⚠️ (미구현분 O-2 이관) |
| E. PRD P0 매핑 9/9 | ✅ |
| 하드코딩 색·quirk·미사용 자산 | ⚠️ (O-3·O-6·O-7 등 이관) |

모든 ⚠️ 항목은 §17 열린 질문으로 이관되었으며, 누락(❌)은 없음.

---

*본 DESIGN.md는 리포 `04-bookjjang-design-md`의 커밋 시점 구현을 기준으로 작성된 정본이다. 코드가 변경되면 해당 섹션과 부록 커버리지 검증을 갱신한다.*
