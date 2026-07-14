-- 북박이장 DB 스키마 (Supabase / PostgreSQL)
-- 사용법: Supabase 대시보드 > SQL Editor 에 붙여넣고 실행
-- 상세 설명: ../../03-data-model.md

-- 0) 확장 & enum ------------------------------------------------------------
create extension if not exists "pgcrypto";           -- gen_random_uuid()

do $$ begin
  create type reading_status as enum ('want', 'reading', 'done');
exception when duplicate_object then null;
end $$;

-- 1) profiles ---------------------------------------------------------------
create table if not exists public.profiles (
  id          uuid primary key references auth.users(id) on delete cascade,
  nickname    text not null check (char_length(nickname) between 2 and 20),
  avatar_url  text,
  created_at  timestamptz not null default now(),
  updated_at  timestamptz not null default now()
);

-- 2) books (알라딘 메타 캐시) ------------------------------------------------
create table if not exists public.books (
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

-- 3) library_books (내 서재 = 독서 기록) ------------------------------------
create table if not exists public.library_books (
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

create index if not exists idx_library_user_status  on public.library_books (user_id, status);
create index if not exists idx_library_user_created on public.library_books (user_id, created_at desc);

-- 4) RLS --------------------------------------------------------------------
alter table public.profiles      enable row level security;
alter table public.library_books enable row level security;
alter table public.books         enable row level security;

drop policy if exists "profiles_select_own" on public.profiles;
create policy "profiles_select_own" on public.profiles
  for select using (auth.uid() = id);
drop policy if exists "profiles_upsert_own" on public.profiles;
create policy "profiles_upsert_own" on public.profiles
  for insert with check (auth.uid() = id);
drop policy if exists "profiles_update_own" on public.profiles;
create policy "profiles_update_own" on public.profiles
  for update using (auth.uid() = id);

drop policy if exists "library_all_own" on public.library_books;
create policy "library_all_own" on public.library_books
  for all using (auth.uid() = user_id) with check (auth.uid() = user_id);

drop policy if exists "books_select_auth" on public.books;
create policy "books_select_auth" on public.books
  for select to authenticated using (true);
drop policy if exists "books_insert_auth" on public.books;
create policy "books_insert_auth" on public.books
  for insert to authenticated with check (true);

-- 5) 트리거 -----------------------------------------------------------------
-- 신규 가입 시 profiles 자동 생성 (구글 이름을 기본 별명으로)
create or replace function public.handle_new_user()
returns trigger language plpgsql security definer as $$
begin
  insert into public.profiles (id, nickname)
  values (new.id, coalesce(new.raw_user_meta_data->>'name', '독서가'));
  return new;
end; $$;

drop trigger if exists on_auth_user_created on auth.users;
create trigger on_auth_user_created
  after insert on auth.users
  for each row execute function public.handle_new_user();

-- updated_at 자동 갱신
create or replace function public.touch_updated_at()
returns trigger language plpgsql as $$
begin new.updated_at = now(); return new; end; $$;

drop trigger if exists trg_profiles_touch on public.profiles;
create trigger trg_profiles_touch
  before update on public.profiles
  for each row execute function public.touch_updated_at();

drop trigger if exists trg_library_books_touch on public.library_books;
create trigger trg_library_books_touch
  before update on public.library_books
  for each row execute function public.touch_updated_at();
