"use client";
import { useState, useMemo } from "react";
import decisionMatrices from "@/data/decision-matrices.json";
import type { DecisionMatrix } from "@/lib/types";

const matrices = decisionMatrices as DecisionMatrix[];

const SKILL_LABELS: Record<string, string> = {
  cinematography: "촬영",
  directing: "연출",
  editing: "편집",
  "sound-design": "사운드",
  "color-grading": "색보정",
  "vfx-motion": "VFX",
  "genre-guide": "장르",
  "pre-production": "사전기획",
};

const SKILL_COLORS: Record<string, string> = {
  cinematography: "#6366f1",
  directing: "#f97316",
  editing: "#10b981",
  "sound-design": "#eab308",
  "color-grading": "#a855f7",
  "vfx-motion": "#ef4444",
  "genre-guide": "#ec4899",
  "pre-production": "#06b6d4",
};

const ALL_SKILLS = Array.from(new Set(matrices.map((m) => m.skillName)));
const FILTER_TABS = ["전체", ...ALL_SKILLS];

function MatrixTable({ matrix }: { matrix: DecisionMatrix }) {
  const [expandedRow, setExpandedRow] = useState<number | null>(null);
  const color = SKILL_COLORS[matrix.skillName] ?? "#888";

  return (
    <div className="overflow-x-auto">
      <table className="w-full text-xs">
        <thead>
          <tr style={{ background: "rgba(255,255,255,0.04)" }}>
            {matrix.headers.map((h, i) => (
              <th
                key={i}
                className="px-4 py-2.5 text-left font-semibold whitespace-nowrap"
                style={{
                  color: i === 0 ? color : "var(--foreground)",
                  borderBottom: "1px solid var(--border)",
                }}
              >
                {h}
              </th>
            ))}
          </tr>
        </thead>
        <tbody>
          {matrix.rows.map((row, ri) => (
            <>
              <tr
                key={`row-${ri}`}
                onClick={() => setExpandedRow(expandedRow === ri ? null : ri)}
                className="cursor-pointer transition-colors"
                style={{
                  borderBottom: "1px solid var(--border)",
                  background: expandedRow === ri ? `${color}11` : "transparent",
                }}
                onMouseEnter={(e) => {
                  if (expandedRow !== ri)
                    (e.currentTarget as HTMLElement).style.background = "rgba(255,255,255,0.03)";
                }}
                onMouseLeave={(e) => {
                  if (expandedRow !== ri)
                    (e.currentTarget as HTMLElement).style.background = "transparent";
                }}
              >
                {row.cells.map((cell, ci) => (
                  <td
                    key={ci}
                    className="px-4 py-2.5 align-top leading-relaxed"
                    style={{
                      color: ci === 0 ? "var(--foreground)" : "var(--muted)",
                      fontWeight: ci === 0 ? 500 : 400,
                    }}
                  >
                    {cell}
                  </td>
                ))}
              </tr>
              {expandedRow === ri && (
                <tr key={`detail-${ri}`}>
                  <td
                    colSpan={matrix.headers.length}
                    style={{
                      background: `${color}08`,
                      borderBottom: "1px solid var(--border)",
                      padding: "0.75rem 1rem",
                    }}
                  >
                    <div className="flex flex-wrap gap-3">
                      {matrix.headers.map((header, hi) => (
                        <div
                          key={hi}
                          className="rounded-lg px-3 py-2 min-w-32"
                          style={{
                            background: "var(--surface)",
                            border: `1px solid ${hi === 0 ? color : "var(--border)"}`,
                          }}
                        >
                          <p
                            className="text-xs font-semibold mb-1"
                            style={{ color: hi === 0 ? color : "var(--foreground)" }}
                          >
                            {header}
                          </p>
                          <p className="text-xs" style={{ color: "var(--muted)" }}>
                            {row.cells[hi] || "-"}
                          </p>
                        </div>
                      ))}
                    </div>
                  </td>
                </tr>
              )}
            </>
          ))}
        </tbody>
      </table>
    </div>
  );
}

function MatrixAccordion({ matrix }: { matrix: DecisionMatrix }) {
  const [open, setOpen] = useState(false);
  const color = SKILL_COLORS[matrix.skillName] ?? "#888";

  return (
    <div className="card overflow-hidden">
      {/* 매트릭스 헤더 (클릭으로 펼침/접힘) */}
      <button
        className="w-full px-4 py-3 flex items-center gap-3 text-left"
        onClick={() => setOpen((v) => !v)}
        style={{ borderBottom: open ? "1px solid var(--border)" : "none" }}
      >
        <span className="w-2 h-2 rounded-full shrink-0" style={{ background: color }} />
        <div className="flex-1 min-w-0">
          <div className="flex items-center gap-2 flex-wrap">
            <span
              className="text-xs font-mono px-2 py-0.5 rounded-full"
              style={{ background: `${color}22`, color }}
            >
              {SKILL_LABELS[matrix.skillName] ?? matrix.skillName}
            </span>
            <h3 className="font-semibold text-sm">{matrix.tableName}</h3>
          </div>
          {matrix.description && (
            <p className="text-xs mt-0.5 truncate" style={{ color: "var(--muted)" }}>
              {matrix.description}
            </p>
          )}
        </div>
        <span
          className="text-xs shrink-0 transition-transform duration-300"
          style={{
            color: "var(--muted)",
            transform: open ? "rotate(180deg)" : "rotate(0deg)",
            display: "inline-block",
          }}
        >
          ▼
        </span>
      </button>

      {/* 테이블 (아코디언) */}
      <div
        className="overflow-hidden transition-all duration-300"
        style={{ maxHeight: open ? "2000px" : "0px" }}
      >
        <MatrixTable matrix={matrix} />
      </div>
    </div>
  );
}

export default function MatricesPage() {
  const [selectedSkill, setSelectedSkill] = useState("전체");
  const [query, setQuery] = useState("");

  const filtered = useMemo(() => {
    const q = query.trim().toLowerCase();
    return matrices.filter((m) => {
      const matchSkill = selectedSkill === "전체" || m.skillName === selectedSkill;
      const matchQuery =
        !q ||
        m.tableName.toLowerCase().includes(q) ||
        m.headers.some((h) => h.toLowerCase().includes(q)) ||
        m.rows.some((r) => r.cells.some((c) => c.toLowerCase().includes(q)));
      return matchSkill && matchQuery;
    });
  }, [selectedSkill, query]);

  return (
    <div className="space-y-8">
      <div>
        <h1 className="text-3xl font-bold mb-2">결정 매트릭스 탐색기</h1>
        <p className="text-sm" style={{ color: "var(--muted)" }}>
          장면 상황과 목적에 맞는 최적의 기법을{" "}
          <span style={{ color: "var(--accent)" }}>{matrices.length}개</span> 매트릭스로 빠르게 찾으세요.
          행을 클릭하면 상세 정보가 펼쳐집니다.
        </p>
      </div>

      {/* 카테고리 필터 탭 */}
      <div className="flex flex-wrap gap-2">
        {FILTER_TABS.map((tab) => {
          const isActive = selectedSkill === tab || (tab === "전체" && selectedSkill === "전체");
          const color = tab === "전체" ? "var(--accent)" : (SKILL_COLORS[tab] ?? "var(--accent)");
          return (
            <button
              key={tab}
              onClick={() => setSelectedSkill(tab)}
              className="px-3 py-1.5 rounded-lg text-xs font-medium transition-colors"
              style={{
                background: isActive ? color : "var(--surface)",
                color: isActive ? "white" : "var(--muted)",
                border: "1px solid var(--border)",
              }}
            >
              {tab === "전체" ? "전체" : (SKILL_LABELS[tab] ?? tab)}
            </button>
          );
        })}
      </div>

      {/* 검색 */}
      <input
        type="text"
        placeholder="매트릭스명, 상황, 기법, 효과 검색..."
        value={query}
        onChange={(e) => setQuery(e.target.value)}
        className="w-full px-4 py-2 rounded-lg text-sm outline-none"
        style={{
          background: "var(--surface)",
          border: "1px solid var(--border)",
          color: "var(--foreground)",
        }}
      />

      <p className="text-xs" style={{ color: "var(--muted)" }}>
        {filtered.length}개 매트릭스 — 제목을 클릭하면 테이블이 펼쳐집니다
      </p>

      {/* 매트릭스 아코디언 목록 */}
      <div className="space-y-4">
        {filtered.map((matrix, idx) => (
          <MatrixAccordion key={`${matrix.skillName}-${matrix.tableName}-${idx}`} matrix={matrix} />
        ))}
      </div>

      {filtered.length === 0 && (
        <div
          className="text-center py-12 rounded-xl"
          style={{ border: "1px dashed var(--border)", color: "var(--muted)" }}
        >
          <p className="text-sm">검색 결과가 없습니다.</p>
        </div>
      )}
    </div>
  );
}
