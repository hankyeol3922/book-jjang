# 📚 북박이장 (BookJjang)

> **나만의 온라인 책장** — 읽은 책을 차곡차곡 쌓아 독서 습관을 만드는 개인 독서 기록 서비스
> `book(책) + 붙박이장` — 책을 차곡차곡 쌓아두는 나만의 공간

---

## 이게 뭔가요?
읽은 책을 한곳에서 체계적으로 기록하고, 독서 중 느낀 생각과 메모를 함께 저장하며, 독서량과 습관을 시각적으로 확인할 수 있는 서비스입니다. 소셜·커머스 없이 **조용한 나만의 독서 아카이브**에 집중합니다.

**핵심 기능**: 구글 로그인 · 알라딘으로 책 검색 → 내 서재에 추가 · 별점/한줄평/메모 기록 · 독서 통계 시각화

---

## 문서 안내 (읽는 순서)
| 문서 | 내용 |
|------|------|
| **[01-prd.md](./01-prd.md)** | 제품 요구사항 정의서 — 목표·사용자·기능(P0/P1/P2)·성공지표·확정사항 |
| **[02-ia-wireframe.md](./02-ia-wireframe.md)** | 정보구조·화면 흐름·페이지별 와이어프레임 |
| **[03-data-model.md](./03-data-model.md)** | Supabase 데이터 모델 — 테이블·SQL DDL·RLS·통계 쿼리 |
| **[04-backlog.md](./04-backlog.md)** | Phase 1(MVP) 개발 백로그 — 에픽·작업·완료조건·스프린트 |
| **[05-phase2-backlog.md](./05-phase2-backlog.md)** | Phase 2 개발 백로그 — 진행률·상태 분류·프로필·서재 관리 |

---

## 기술 스택
| 영역 | 선택 |
|------|------|
| 프런트엔드 | Next.js (React) · 반응형 웹 |
| 인증 | Supabase Auth — 구글 OAuth |
| DB | Supabase PostgreSQL (+ RLS) |
| 스토리지 | Supabase Storage (프로필 이미지) |
| 도서 데이터 | 알라딘 Open API (서버 사이드 호출) — ✅ 연동 완료 |
| 차트 | Recharts |
| 호스팅 | Vercel(프런트) + Supabase(백엔드) |

---

## 시작하기 (Getting Started)

### 사전 준비물 (계정·키)
- [ ] **Supabase** 프로젝트 (무료 티어) — DB·Auth·Storage
- [ ] **Google Cloud** OAuth 클라이언트 ID/Secret — 구글 로그인용
- [ ] **알라딘 TTB 키** — [알라딘 Open API](https://www.aladin.co.kr/ttb/wblog_manage.aspx) 신청
- [ ] 로컬 개발 환경: Node.js 18+ / npm (✅ 현재 환경 확인됨: Node v24 · npm 11 · git 2.55)

### 환경 변수 (`.env.local`)
```env
# Supabase
NEXT_PUBLIC_SUPABASE_URL=your-project-url
NEXT_PUBLIC_SUPABASE_ANON_KEY=your-anon-key
SUPABASE_SERVICE_ROLE_KEY=your-service-role-key   # 서버 전용

# 알라딘 (서버 전용 — 절대 클라이언트 노출 금지)
ALADIN_TTB_KEY=your-ttb-key
```

### 로컬 실행
앱 코드는 **`web/`** 폴더에 있습니다. (Next.js 16 · TypeScript · Tailwind, 이미 스캐폴딩·빌드 검증 완료)
```bash
cd web
cp .env.local.example .env.local   # 값 채우기
npm install                        # 최초 1회
npm run dev                        # http://localhost:3000
```

### DB 초기화
`web/supabase/schema.sql`(= `03-data-model.md`의 DDL·RLS·트리거)을 Supabase SQL Editor에 붙여 넣어 스키마를 생성합니다.

---

## 프로젝트 구조
```
book_jjang/
├─ 00-README.md ~ 05-phase2-backlog.md   # 기획·설계 문서
└─ web/                                   # Next.js 16 앱
   ├─ src/
   │  ├─ app/
   │  │  ├─ page.tsx                      # 랜딩(구글 로그인 진입)
   │  │  ├─ layout.tsx
   │  │  ├─ library/page.tsx              # 내 서재(프로필·통계·목록)
   │  │  ├─ library/[id]/page.tsx         # 독서 기록 상세
   │  │  ├─ library/[id]/RecordEditor.tsx # 기록 편집 폼(client)
   │  │  ├─ search/page.tsx               # 책 검색(client)
   │  │  └─ api/aladin/search/route.ts    # 알라딘 검색 프록시(서버)
   │  ├─ components/                       # Nav·BookCover·StarRating·
   │  │                                    #   StatusBadge·ProgressBar·
   │  │                                    #   StatCard·MonthlyChart
   │  ├─ lib/
   │  │  ├─ mock.ts                       # 프로토타입용 더미 데이터
   │  │  ├─ aladin.ts                     # 알라딘 API 헬퍼(검색/조회)
   │  │  └─ supabase/{client,server}.ts   # Supabase 클라이언트
   │  └─ types/db.ts                      # DB 타입(03과 1:1)
   ├─ supabase/schema.sql                 # DB 스키마(붙여넣기용)
   └─ .env.local.example                  # 필요한 환경변수 목록
```

## 현재 구현 상태
| 화면 | 상태 |
|------|------|
| 랜딩 / 로그인 | UI 완성 · 구글 OAuth 연결 대기(현재 클릭 시 목업 서재로 이동) |
| 내 서재(통계·목록) | UI 완성 · 더미 데이터 |
| 책 검색 | ✅ **알라딘 실시간 검색 연동 완료** (표지·저자·출판사 실데이터) |
| 독서 기록(별점·한줄평·메모·상태·기간·진행률) | UI 완성 · 로컬 상태(Supabase 저장 연동 대기) |

> 모든 화면은 `next build` 통과 및 런타임 렌더 검증 완료. `src/lib/mock.ts`의 더미 데이터를 실제 Supabase/알라딘 호출로 교체하면 동작합니다.

> **개발 참고(Next.js 16)**: 미들웨어 파일명이 `middleware.ts` → **`proxy.ts`**로 변경됨. Supabase 세션 갱신 로직 작성 시 `proxy.ts`를 사용할 것.

---

## 개발 로드맵
```
Phase 1 (MVP)  로그인 · 검색/서재추가 · 별점/한줄평/메모 · 목록/통계   → 04-backlog.md
Phase 2        진행률 · 시작/완료일 · 상태 분류 · 프로필 편집 · 정렬/필터 → 05-phase2-backlog.md
Phase 3 (향후) 독서 목표 · 장르 통계 · 내보내기 · 연속기록(스트릭)
```

---

*상태: 기획·설계 완료 · 앱 스캐폴딩(Next.js 16) · Phase 1 화면 UI 목업 구현·빌드/런타임 검증 완료 · Supabase·알라딘 실연동 대기. 최종 수정 2026-07-07.*
