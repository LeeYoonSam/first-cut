"use client";
import { useState, useMemo } from "react";
import decisionMatrices from "@/data/decision-matrices.json";

interface DecisionMatrixRow {
  cells: string[];
}

interface DecisionMatrix {
  skillName: string;
  tableName: string;
  description?: string;
  headers: string[];
  rows: DecisionMatrixRow[];
}

const matrices = decisionMatrices as DecisionMatrix[];

const SKILL_LABELS: Record<string, string> = {
  cinematography: "촬영 기법",
  directing: "연출",
  editing: "편집",
  "sound-design": "사운드",
  "color-grading": "색보정",
  "vfx-motion": "VFX/모션",
  "genre-guide": "장르 가이드",
  "pre-production": "사전 기획",
};

const SKILL_COLORS: Record<string, string> = {
  cinematography: "#6366f1",
  directing: "#10b981",
  editing: "#06b6d4",
  "sound-design": "#ec4899",
  "color-grading": "#f59e0b",
  "vfx-motion": "#14b8a6",
  "genre-guide": "#8b5cf6",
  "pre-production": "#f97316",
};

const ALL_SKILLS = Array.from(new Set(matrices.map((m) => m.skillName)));

export default function DecisionMatrixPage() {
  const [selectedSkill, setSelectedSkill] = useState<string>("전체");
  const [query, setQuery] = useState("");

  const filtered = useMemo(() => {
    const q = query.trim().toLowerCase();
    return matrices.filter((m) => {
      const matchSkill =
        selectedSkill === "전체" || m.skillName === selectedSkill;
      const matchQuery =
        !q ||
        m.tableName.toLowerCase().includes(q) ||
        m.rows.some((r) => r.cells.some((c) => c.toLowerCase().includes(q)));
      return matchSkill && matchQuery;
    });
  }, [selectedSkill, query]);

  return (
    <div className="space-y-8">
      <div>
        <h1 className="text-3xl font-bold mb-2">결정 매트릭스</h1>
        <p className="text-sm" style={{ color: "var(--muted)" }}>
          장면 상황과 목적에 맞는 최적의 기법을{" "}
          <span style={{ color: "var(--accent)" }}>{matrices.length}개</span> 매트릭스로 탐색하세요.
        </p>
      </div>

      {/* 스킬 필터 탭 */}
      <div className="flex flex-wrap gap-2">
        <button
          onClick={() => setSelectedSkill("전체")}
          className="px-3 py-1.5 rounded-lg text-xs font-medium transition-colors"
          style={{
            background: selectedSkill === "전체" ? "var(--accent)" : "var(--surface)",
            color: selectedSkill === "전체" ? "white" : "var(--muted)",
            border: "1px solid var(--border)",
          }}
        >
          전체
        </button>
        {ALL_SKILLS.map((skill) => (
          <button
            key={skill}
            onClick={() => setSelectedSkill(skill)}
            className="px-3 py-1.5 rounded-lg text-xs font-medium transition-colors"
            style={{
              background:
                selectedSkill === skill
                  ? SKILL_COLORS[skill] ?? "var(--accent)"
                  : "var(--surface)",
              color: selectedSkill === skill ? "white" : "var(--muted)",
              border: "1px solid var(--border)",
            }}
          >
            {SKILL_LABELS[skill] ?? skill}
          </button>
        ))}
      </div>

      {/* 검색 */}
      <input
        type="text"
        placeholder="상황, 기법, 효과 검색..."
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
        {filtered.length}개 매트릭스
      </p>

      {/* 매트릭스 목록 */}
      <div className="space-y-8">
        {filtered.map((matrix, idx) => {
          const color = SKILL_COLORS[matrix.skillName] ?? "#888";
          return (
            <div key={idx} className="card overflow-hidden">
              {/* 매트릭스 헤더 */}
              <div
                className="px-4 py-3 flex items-center gap-3"
                style={{ borderBottom: "1px solid var(--border)" }}
              >
                <span
                  className="w-2 h-2 rounded-full shrink-0"
                  style={{ background: color }}
                />
                <div className="flex-1 min-w-0">
                  <span
                    className="text-xs font-mono"
                    style={{ color }}
                  >
                    {SKILL_LABELS[matrix.skillName] ?? matrix.skillName}
                  </span>
                  <h3 className="font-semibold text-sm mt-0.5">
                    {matrix.tableName}
                  </h3>
                </div>
              </div>

              {/* 테이블 */}
              <div className="overflow-x-auto">
                <table className="w-full text-xs">
                  <thead>
                    <tr style={{ background: "rgba(255,255,255,0.03)" }}>
                      {matrix.headers.map((h, i) => (
                        <th
                          key={i}
                          className="px-4 py-2.5 text-left font-semibold"
                          style={{
                            color: i === 0 ? color : "var(--foreground)",
                            borderBottom: "1px solid var(--border)",
                            whiteSpace: "nowrap",
                          }}
                        >
                          {h}
                        </th>
                      ))}
                    </tr>
                  </thead>
                  <tbody>
                    {matrix.rows.map((row, ri) => (
                      <tr
                        key={ri}
                        style={{
                          borderBottom:
                            ri < matrix.rows.length - 1
                              ? "1px solid var(--border)"
                              : "none",
                        }}
                        className="hover:bg-white/5 transition-colors"
                      >
                        {row.cells.map((cell, ci) => (
                          <td
                            key={ci}
                            className="px-4 py-2.5 align-top leading-relaxed"
                            style={{
                              color:
                                ci === 0
                                  ? "var(--foreground)"
                                  : "var(--muted)",
                              fontWeight: ci === 0 ? 500 : 400,
                            }}
                          >
                            {cell}
                          </td>
                        ))}
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
            </div>
          );
        })}
      </div>
    </div>
  );
}
