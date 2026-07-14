import type { RecordBook } from "../components/screens/BookRecord";

/**
 * 로컬 목업 도서 카탈로그. 검색(BookSearch)과 서재(Library)가 공유한다.
 * 백엔드/도서 API가 없어 8권을 하드코딩(각 항목 표지 tint 포함). 실제 연동 시
 * 이 모듈을 데이터 소스로 교체한다. See DESIGN.md §11.3.
 */
export const CATALOG: RecordBook[] = [
  { id: "almond", title: "아몬드", author: "손원평", publisher: "창비", year: "2017", tint: "sage" },
  { id: "demian", title: "데미안", author: "헤르만 헤세", publisher: "민음사", year: "2000", tint: "gold" },
  { id: "fish", title: "물고기는 존재하지 않는다", author: "룰루 밀러", publisher: "곰출판", year: "2021", tint: "mist" },
  { id: "anxiety", title: "불안", author: "알랭 드 보통", publisher: "은행나무", year: "2011", tint: "rose" },
  { id: "courage", title: "미움받을 용기", author: "기시미 이치로", publisher: "인플루엔셜", year: "2014", tint: "gold" },
  { id: "sapiens", title: "사피엔스", author: "유발 하라리", publisher: "김영사", year: "2015", tint: "sage" },
  { id: "kim", title: "82년생 김지영", author: "조남주", publisher: "민음사", year: "2016", tint: "rose" },
  { id: "pachinko", title: "파친코", author: "이민진", publisher: "인플루엔셜", year: "2018", tint: "mist" },
];

export function getBook(id: string): RecordBook | undefined {
  return CATALOG.find((b) => b.id === id);
}
