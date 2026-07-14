# 데이터 모델 (Supabase / PostgreSQL): 북박이장

**작성자**: lhank0103
**작성일**: 2026-07-07
**상태**: Draft
**관련 문서**: [01-prd.md](./01-prd.md) · [02-ia-wireframe.md](./02-ia-wireframe.md)

---

## 1. 개요

- DB: Supabase(PostgreSQL). 인증은 Supabase Auth(구글 OAuth) → 사용자는 `auth.users`에 자동 생성.
- 애플리케이션 테이블은 `public` 스키마에 정의하고, 사용자 데이터는 **RLS(Row Level Security)**로 본인만 접근하도록 강제.
- 도서 메타(`books`)는 **알라딘 API 응답을 ISBN13 기준으로 1회 캐싱**하여 사용자 간 중복 저장을 방지.

### ERD (개념)
```
auth.users (Supabase)
      │ 1
      │
      ▼ 1
  profiles ─────────────< library_books >───────── books
   (사용자)      1     N   (내 서재 1권)    N     1  (도서 메타 캐시)
```
- `profiles` 1 : N `library_books`
- `books` 1 : N `library_books`
- `library_books`는 `(user_id, book_id)` 유니크 → 같은 책 중복 추가 방지.

---

## 2. 테이블 정의

### 2.1 `profiles` — 사용자 프로필
| 컬럼 | 타입 | 설명 |
|------|------|------|
| id | uuid (PK) | `auth.users.id` 참조 |
| nickname | text | 별명 (2~20자) |
| avatar_url | text (nullable) | 프로필 이미지 URL (Storage) |
| created_at | timestamptz | 생성 시각 |
| updated_at | timestamptz | 수정 시각 |

### 2.2 `books` — 도서 메타 캐시(알라딘)
| 컬럼 | 타입 | 설명 |
|------|------|------|
| id | uuid (PK) | 내부 식별자 |
| isbn13 | text (UNIQUE) | ISBN13 (캐시 기준 키) |
| title | text | 제목 |
| author | text | 저자 |
| publisher | text | 출판사 |
| pub_date | date (nullable) | 출간일 |
| cover_url | text (nullable) | 표지 이미지 URL |
| description | text (nullable) | 소개 |
| aladin_item_id | text (nullable) | 알라딘 상품 ID |
| created_at | timestamptz | 캐싱 시각 |

### 2.3 `library_books` — 내 서재의 책 1권 = 독서 기록
| 컬럼 | 타입 | 설명 |
|------|------|------|
| id | uuid (PK) | 식별자 |
| user_id | uuid (FK→profiles.id) | 소유자 |
| book_id | uuid (FK→books.id) | 도서 |
| status | reading_status (enum) | `want`/`reading`/`done` (기본 `reading`) |
| rating | smallint (nullable) | 별점 1~5 (CHECK) |
| one_liner | text (nullable) | 한줄평 |
| memo | text (nullable) | 메모 (책당 1개) |
| start_date | date (nullable) | 독서 시작일 |
| end_date | date (nullable) | 독서 완료일 |
| total_pages | int (nullable) | 전체 페이지 |
| current_page | int (nullable) | 현재 페이지 |
| progress_percent | smallint (nullable) | 진행률 0~100 (CHECK) |
| created_at | timestamptz | 서재 추가 시각 |
| updated_at | timestamptz | 수정 시각 |
| **UNIQUE** | (user_id, book_id) | 중복 추가 방지 |

> 진행률은 `current_page/total_pages`로 계산하거나 `progress_percent`를 직접 입력하는 두 방식을 모두 허용(둘 중 있는 값 사용). 상태가 `done`이면 UI에서 100% 표시.

---

## 3. Supabase DDL (SQL)

```sql
-- 0) 확장 & enum
create extension if not exists "pgcrypto";           -- gen_random_uuid()
create type reading_status as enum ('want', 'reading', 'done');

-- 1) profiles
create table public.profiles (
  id          uuid primary key references auth.users(id) on delete cascade,
  nickname    text not null check (char_length(nickname) between 2 and 20),
  avatar_url  text,
  created_at  timestamptz not null default now(),
  updated_at  timestamptz not null default now()
);

-- 2) books (알라딘 메타 캐시)
create table public.books (
  id             uuid primary key default gen_random_uuid(),
  isbn13         text unique not null,
  title          text not null,
  author         text,
  publisher      text,
  pub_date       date,
  cover_url      text,
  description    text,
  aladin_item_id text,
  created_at     timestamptz not null default now()
);

-- 3) library_books (내 서재 = 독서 기록)
create table public.library_books (
  id               uuid primary key default gen_random_uuid(),
  user_id          uuid not null references public.profiles(id) on delete cascade,
  book_id          uuid not null references public.books(id) on delete restrict,
  status           reading_status not null default 'reading',
  rating           smallint check (rating between 1 and 5),
  one_liner        text,
  memo             text,
  start_date       date,
  end_date         date,
  total_pages      int check (total_pages >= 0),
  current_page     int check (current_page >= 0),
  progress_percent smallint check (progress_percent between 0 and 100),
  created_at       timestamptz not null default now(),
  updated_at       timestamptz not null default now(),
  unique (user_id, book_id)
);

create index on public.library_books (user_id, status);
create index on public.library_books (user_id, created_at desc);
```

---

## 4. RLS 정책 (보안)

```sql
alter table public.profiles      enable row level security;
alter table public.library_books enable row level security;
alter table public.books         enable row level security;

-- profiles: 본인 것만 조회/수정
create policy "profiles_select_own" on public.profiles
  for select using (auth.uid() = id);
create policy "profiles_upsert_own" on public.profiles
  for insert with check (auth.uid() = id);
create policy "profiles_update_own" on public.profiles
  for update using (auth.uid() = id);

-- library_books: 본인 데이터만 CRUD
create policy "library_all_own" on public.library_books
  for all using (auth.uid() = user_id) with check (auth.uid() = user_id);

-- books: 로그인 사용자는 읽기 가능, 추가는 인증된 사용자가 가능(서재 추가 시 upsert)
create policy "books_select_auth" on public.books
  for select to authenticated using (true);
create policy "books_insert_auth" on public.books
  for insert to authenticated with check (true);
```
> 운영 안전성을 높이려면 `books` 쓰기를 서버(Service Role)로 제한하고, 알라딘 프록시 API 라우트에서만 upsert 하도록 할 수 있음.

---

## 5. 자동화 (트리거)

```sql
-- 신규 가입 시 profiles 자동 생성 (구글 이름을 기본 별명으로)
create or replace function public.handle_new_user()
returns trigger language plpgsql security definer as $$
begin
  insert into public.profiles (id, nickname)
  values (new.id, coalesce(new.raw_user_meta_data->>'name', '독서가'));
  return new;
end; $$;

create trigger on_auth_user_created
  after insert on auth.users
  for each row execute function public.handle_new_user();

-- updated_at 자동 갱신
create or replace function public.touch_updated_at()
returns trigger language plpgsql as $$
begin new.updated_at = now(); return new; end; $$;

create trigger trg_profiles_touch      before update on public.profiles      for each row execute function public.touch_updated_at();
create trigger trg_library_books_touch before update on public.library_books for each row execute function public.touch_updated_at();
```

---

## 6. 대표 쿼리 (통계 카드)

```sql
-- 총 읽은 권수 / 읽는 중 / 평균 별점
select
  count(*) filter (where status = 'done')            as total_done,
  count(*) filter (where status = 'reading')         as total_reading,
  round(avg(rating)::numeric, 1)                     as avg_rating
from public.library_books
where user_id = auth.uid();

-- 최근 12개월 월별 완독 권수
select to_char(date_trunc('month', end_date), 'YYYY-MM') as month,
       count(*) as done_count
from public.library_books
where user_id = auth.uid() and status = 'done' and end_date is not null
  and end_date >= (current_date - interval '12 months')
group by 1 order by 1;
```

---

## 7. Storage (프로필 이미지)
- 버킷: `avatars` (public read 또는 signed URL).
- 경로 규칙: `avatars/{user_id}.{ext}` — 사용자당 1장 덮어쓰기.
- 제약: JPG/PNG, 최대 2MB, 정사각형 크롭 후 업로드 (01-prd 확정 사항).
