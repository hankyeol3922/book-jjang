/**
 * 1회성 초기 세팅 스크립트 — `node scripts/seed.mjs`
 *
 * 하는 일:
 *   1. 데모 유저 1명 생성 (로그인 UI 없이 RLS를 정상 통과시키기 위한 고정 계정)
 *   2. 알라딘에서 실제 표지/소개를 가져와 books 7권 캐싱
 *   3. 데모 유저의 library_books 7건 시드
 *
 * ⚠️ 이 파일은 SUPABASE_SERVICE_ROLE_KEY(= RLS 무시하는 마스터키)를 사용합니다.
 *    앱 소스(src/)에서는 절대 import 되지 않습니다. 터미널에서 수동 실행 전용.
 *    세팅이 끝나면 .env.local 에서 SERVICE_ROLE 키를 지워도 앱은 정상 동작합니다.
 */
import { readFileSync, appendFileSync } from 'node:fs'
import { randomBytes } from 'node:crypto'
import { resolve, dirname } from 'node:path'
import { fileURLToPath } from 'node:url'

const ROOT = resolve(dirname(fileURLToPath(import.meta.url)), '..')
const ENV_PATH = resolve(ROOT, '.env.local')

// ---------- env ----------
function readEnv() {
  const env = {}
  for (const line of readFileSync(ENV_PATH, 'utf8').split(/\r?\n/)) {
    const m = line.match(/^\s*([A-Za-z0-9_]+)\s*=\s*(.*?)\s*$/)
    if (m) env[m[1]] = m[2]
  }
  return env
}

let env = readEnv()

const URL = env.NEXT_PUBLIC_SUPABASE_URL
const SECRET = env.SUPABASE_SERVICE_ROLE_KEY
const TTB = env.ALADIN_TTB_KEY

for (const [k, v] of Object.entries({
  NEXT_PUBLIC_SUPABASE_URL: URL,
  SUPABASE_SERVICE_ROLE_KEY: SECRET,
})) {
  if (!v) {
    console.error(`❌ .env.local 에 ${k} 가 없습니다.`)
    process.exit(1)
  }
}

// 데모 계정 자격증명이 없으면 생성해서 .env.local 에 추가 (서버 전용 — NEXT_PUBLIC 아님)
if (!env.DEMO_USER_EMAIL || !env.DEMO_USER_PASSWORD) {
  const password = randomBytes(24).toString('base64url')
  appendFileSync(
    ENV_PATH,
    `\n# === 데모 계정 (로그인 UI 없이 RLS 통과용 · 서버 전용) ===\n` +
      `DEMO_USER_EMAIL=demo@bookjjang.dev\n` +
      `DEMO_USER_PASSWORD=${password}\n`,
    'utf8',
  )
  console.log('🔑 데모 계정 자격증명을 .env.local 에 생성했습니다.')
  env = readEnv()
}

const DEMO_EMAIL = env.DEMO_USER_EMAIL
const DEMO_PASSWORD = env.DEMO_USER_PASSWORD

const admin = { apikey: SECRET, Authorization: `Bearer ${SECRET}` }

async function rest(path, init = {}) {
  const res = await fetch(`${URL}${path}`, {
    ...init,
    headers: { ...admin, 'Content-Type': 'application/json', ...(init.headers ?? {}) },
  })
  const text = await res.text()
  if (!res.ok) throw new Error(`${init.method ?? 'GET'} ${path} → ${res.status}: ${text.slice(0, 300)}`)
  return text ? JSON.parse(text) : null
}

// ---------- 1) 데모 유저 ----------
async function ensureDemoUser() {
  const list = await rest(`/auth/v1/admin/users?per_page=200`)
  const existing = (list.users ?? []).find((u) => u.email === DEMO_EMAIL)
  if (existing) {
    console.log(`👤 데모 유저 이미 존재 — ${DEMO_EMAIL}`)
    return existing.id
  }

  const created = await rest(`/auth/v1/admin/users`, {
    method: 'POST',
    body: JSON.stringify({
      email: DEMO_EMAIL,
      password: DEMO_PASSWORD,
      email_confirm: true,
      user_metadata: { name: '책읽는곰' },
    }),
  })
  console.log(`👤 데모 유저 생성 — ${DEMO_EMAIL}`)
  return created.id
}

// 트리거(handle_new_user)가 profiles 를 만들어줬는지 확인, 없으면 직접 생성
async function ensureProfile(userId) {
  const rows = await rest(`/rest/v1/profiles?id=eq.${userId}&select=id,nickname`)
  if (rows.length) {
    console.log(`🪪 프로필 확인 — "${rows[0].nickname}" (트리거 정상 동작)`)
    return
  }
  await rest(`/rest/v1/profiles`, {
    method: 'POST',
    body: JSON.stringify({ id: userId, nickname: '책읽는곰' }),
  })
  console.log('🪪 프로필 생성 (트리거가 동작하지 않아 직접 생성)')
}

// ---------- 2) 도서 메타 (알라딘 실데이터) ----------
const SEED = [
  { isbn13: '9788934972464', title: '사피엔스', author: '유발 하라리', publisher: '김영사', pub_date: '2015-11-24', description: '인지혁명부터 과학혁명까지, 호모 사피엔스의 역사를 관통하는 대서사.',
    lib: { status: 'done', rating: 5, one_liner: '인류사를 보는 눈이 바뀐 책', memo: '허구를 함께 믿는 능력이 대규모 협력을 가능하게 했다는 통찰이 인상적.', start_date: '2025-12-20', end_date: '2026-01-20', total_pages: 636, current_page: 636, progress_percent: null } },
  { isbn13: '9788970125190', title: '총, 균, 쇠', author: '재레드 다이아몬드', publisher: '문학사상', pub_date: '2005-12-19', description: '왜 어떤 문명은 앞서고 어떤 문명은 뒤처졌는가를 지리와 환경으로 설명한다.',
    lib: { status: 'done', rating: 4, one_liner: '문명의 불평등을 지리로 설명하다', memo: null, start_date: '2026-02-01', end_date: '2026-03-05', total_pages: 750, current_page: 750, progress_percent: null } },
  { isbn13: '9788937460449', title: '데미안', author: '헤르만 헤세', publisher: '민음사', pub_date: '2000-12-20', description: '한 소년이 자아를 찾아가는 성장의 기록.',
    lib: { status: 'reading', rating: null, one_liner: null, memo: '알을 깨고 나오는 새의 이미지가 강렬하다.', start_date: '2026-06-25', end_date: null, total_pages: 240, current_page: 150, progress_percent: 62 } },
  { isbn13: '9788983711892', title: '코스모스', author: '칼 세이건', publisher: '사이언스북스', pub_date: '2006-12-20', description: '우주와 인간, 그리고 과학적 사고에 대한 고전.',
    lib: { status: 'reading', rating: null, one_liner: null, memo: null, start_date: '2026-07-01', end_date: null, total_pages: 720, current_page: 210, progress_percent: 29 } },
  { isbn13: '9788932917245', title: '어린 왕자', author: '앙투안 드 생텍쥐페리', publisher: '열린책들', pub_date: '2015-10-20', description: '어른을 위한 동화. 가장 중요한 것은 눈에 보이지 않는다.',
    lib: { status: 'done', rating: 5, one_liner: '어른을 위한 동화', memo: '길들인다는 것의 의미를 다시 생각하게 된다.', start_date: '2026-05-05', end_date: '2026-05-12', total_pages: 120, current_page: 120, progress_percent: null } },
  { isbn13: '9788937473135', title: '82년생 김지영', author: '조남주', publisher: '민음사', pub_date: '2016-10-14', description: '한 여성의 삶을 통해 보편적 경험을 그린 소설.',
    lib: { status: 'want', rating: null, one_liner: null, memo: null, start_date: null, end_date: null, total_pages: 176, current_page: 0, progress_percent: 0 } },
  { isbn13: '9788934985600', title: '팩트풀니스', author: '한스 로슬링', publisher: '김영사', pub_date: '2019-03-08', description: '데이터로 세상을 올바르게 바라보는 열 가지 사고 습관.',
    lib: { status: 'done', rating: 4, one_liner: '세상은 생각보다 나아지고 있다', memo: null, start_date: '2026-06-10', end_date: '2026-06-28', total_pages: 400, current_page: 400, progress_percent: null } },
]

// 알라딘 ItemLookUp — 실제 표지 URL / 소개 / itemId 보강 (실패해도 시드는 계속)
async function enrich(seed) {
  if (!TTB) return {}
  const params = new URLSearchParams({
    ttbkey: TTB, ItemId: seed.isbn13, ItemIdType: 'ISBN13',
    Cover: 'Big', output: 'js', Version: '20131101',
  })
  try {
    const res = await fetch(`https://www.aladin.co.kr/ttb/api/ItemLookUp.aspx?${params}`)
    if (!res.ok) return {}
    const item = (await res.json()).item?.[0]
    if (!item) return {}
    return {
      cover_url: item.cover || null,
      description: item.description || seed.description,
      aladin_item_id: item.itemId != null ? String(item.itemId) : null,
    }
  } catch {
    return {}
  }
}

async function seedBooks() {
  const payload = []
  let covers = 0
  for (const s of SEED) {
    const extra = await enrich(s)
    if (extra.cover_url) covers++
    payload.push({
      isbn13: s.isbn13,
      title: s.title,
      author: s.author,
      publisher: s.publisher,
      pub_date: s.pub_date,
      description: s.description,
      cover_url: null,
      aladin_item_id: null,
      ...extra,
    })
  }

  const rows = await rest(`/rest/v1/books?on_conflict=isbn13`, {
    method: 'POST',
    headers: { Prefer: 'resolution=merge-duplicates,return=representation' },
    body: JSON.stringify(payload),
  })
  console.log(`📚 books ${rows.length}권 저장 (알라딘 실제 표지 ${covers}건 확보)`)

  return new Map(rows.map((r) => [r.isbn13, r.id]))
}

// ---------- 3) 서재 ----------
async function seedLibrary(userId, bookIdByIsbn) {
  const payload = SEED.map((s) => ({
    user_id: userId,
    book_id: bookIdByIsbn.get(s.isbn13),
    ...s.lib,
  }))

  const rows = await rest(`/rest/v1/library_books?on_conflict=user_id,book_id`, {
    method: 'POST',
    headers: { Prefer: 'resolution=merge-duplicates,return=representation' },
    body: JSON.stringify(payload),
  })
  console.log(`🗂️  library_books ${rows.length}건 저장`)
}

// ---------- run ----------
console.log('=== 북박이장 초기 시드 ===\n')
const userId = await ensureDemoUser()
await ensureProfile(userId)
const bookIdByIsbn = await seedBooks()
await seedLibrary(userId, bookIdByIsbn)
console.log('\n✅ 시드 완료')
