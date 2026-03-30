"use client";
import { useState, useMemo } from "react";
import glossaryData from "@/data/glossary.json";
import { GlossaryTerm } from "@/lib/types";
import GlossarySearch from "@/components/glossary/GlossarySearch";
import TermCard from "@/components/glossary/TermCard";

const CHOSUNG = ["전체", "ㄱ", "ㄴ", "ㄷ", "ㄹ", "ㅁ", "ㅂ", "ㅅ", "ㅇ", "ㅈ", "ㅊ", "ㅋ", "ㅌ", "ㅍ", "ㅎ"];
const CHOSUNG_START = 0xAC00;
const CHOSUNG_COUNT = 21 * 28;
const CHOSUNG_LIST = ["ㄱ", "ㄲ", "ㄴ", "ㄷ", "ㄸ", "ㄹ", "ㅁ", "ㅂ", "ㅃ", "ㅅ", "ㅆ", "ㅇ", "ㅈ", "ㅉ", "ㅊ", "ㅋ", "ㅌ", "ㅍ", "ㅎ"];

function getChosung(char: string): string {
  const code = char.charCodeAt(0);
  if (code < CHOSUNG_START || code > 0xD7A3) return char;
  const index = Math.floor((code - CHOSUNG_START) / CHOSUNG_COUNT);
  return CHOSUNG_LIST[index] ?? char;
}

const SKILL_CATEGORIES = ["전체", "촬영", "편집", "사운드", "색보정", "VFX", "연출", "사전기획", "일반"];

const CATEGORY_COLORS: Record<string, string> = {
  촬영: "#3b82f6",
  편집: "#22c55e",
  사운드: "#eab308",
  색보정: "#a855f7",
  VFX: "#ef4444",
  연출: "#f97316",
  사전기획: "#06b6d4",
};

const terms = glossaryData as GlossaryTerm[];

export default function GlossaryPage() {
  const [query, setQuery] = useState("");
  const [selectedChosung, setSelectedChosung] = useState("전체");
  const [selectedCategory, setSelectedCategory] = useState("전체");

  const filtered = useMemo(() => {
    const q = query.trim().toLowerCase();
    return terms.filter((term) => {
      const matchQuery =
        !q ||
        term.term.toLowerCase().includes(q) ||
        (term.english?.toLowerCase().includes(q) ?? false) ||
        term.description.toLowerCase().includes(q);

      const matchChosung =
        selectedChosung === "전체" ||
        getChosung(term.term[0]) === selectedChosung;

      const matchCategory =
        selectedCategory === "전체" || term.category === selectedCategory;

      return matchQuery && matchChosung && matchCategory;
    });
  }, [query, selectedChosung, selectedCategory]);

  return (
    <div className="space-y-6">
      {/* 헤더 */}
      <div>
        <h1 className="text-3xl font-bold mb-1">용어집</h1>
        <p className="text-sm" style={{ color: "var(--muted)" }}>
          영상 제작에서 자주 사용되는 전문 용어{" "}
          <span style={{ color: "var(--accent)" }}>{terms.length}</span>개
        </p>
      </div>

      {/* 검색 */}
      <GlossarySearch
        query={query}
        onQueryChange={setQuery}
        resultCount={filtered.length}
      />

      {/* 초성 필터 */}
      <div>
        <p className="text-xs mb-2" style={{ color: "var(--muted)" }}>초성 필터</p>
        <div className="flex flex-wrap gap-1.5">
          {CHOSUNG.map((ch) => (
            <button
              key={ch}
              onClick={() => setSelectedChosung(ch)}
              className="px-2.5 py-1 rounded text-sm transition-all"
              style={{
                background:
                  selectedChosung === ch
                    ? "var(--accent)"
                    : "var(--surface)",
                color:
                  selectedChosung === ch
                    ? "white"
                    : "var(--muted)",
                border: "1px solid var(--border)",
              }}
            >
              {ch}
            </button>
          ))}
        </div>
      </div>

      {/* 카테고리 필터 탭 */}
      <div>
        <p className="text-xs mb-2" style={{ color: "var(--muted)" }}>카테고리</p>
        <div className="flex flex-wrap gap-1.5">
          {SKILL_CATEGORIES.map((cat) => {
            const color = CATEGORY_COLORS[cat];
            const isActive = selectedCategory === cat;
            return (
              <button
                key={cat}
                onClick={() => setSelectedCategory(cat)}
                className="px-3 py-1 rounded-full text-xs transition-all"
                style={{
                  background: isActive
                    ? color ?? "var(--accent)"
                    : color
                    ? `${color}22`
                    : "var(--surface)",
                  color: isActive ? "white" : color ?? "var(--muted)",
                  border: `1px solid ${color ?? "var(--border)"}`,
                }}
              >
                {cat}
              </button>
            );
          })}
        </div>
      </div>

      {/* 용어 카드 그리드 */}
      {filtered.length === 0 ? (
        <p className="text-sm" style={{ color: "var(--muted)" }}>
          검색 결과가 없습니다.
        </p>
      ) : (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
          {filtered.map((term) => (
            <TermCard key={term.term} term={term} />
          ))}
        </div>
      )}
    </div>
  );
}
