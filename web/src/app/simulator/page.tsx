"use client";
import { useState, useMemo } from "react";
import genreGuide from "@/data/skills/genre-guide.json";
import cinematography from "@/data/skills/cinematography.json";
import colorGrading from "@/data/skills/color-grading.json";
import soundDesign from "@/data/skills/sound-design.json";
import editing from "@/data/skills/editing.json";
import vfxMotion from "@/data/skills/vfx-motion.json";

interface MatrixRow {
  cells: string[];
}
interface Matrix {
  skillName: string;
  tableName: string;
  headers: string[];
  rows: MatrixRow[];
}

const allSkills = [genreGuide, cinematography, colorGrading, soundDesign, editing, vfxMotion] as {
  decisionMatrices: Matrix[];
}[];

function findMatrix(skillName: string, tableName: string): Matrix | undefined {
  for (const skill of allSkills) {
    const m = skill.decisionMatrices?.find(
      (m) => m.skillName === skillName && m.tableName === tableName
    );
    if (m) return m;
  }
  return undefined;
}

function findRowsByKeyword(matrix: Matrix | undefined, keyword: string): MatrixRow[] {
  if (!matrix) return [];
  return matrix.rows.filter((r) =>
    r.cells.some((c) => c.toLowerCase().includes(keyword.toLowerCase()))
  );
}

const GENRES = [
  { id: "TV광고", label: "TV광고", icon: "📺" },
  { id: "디지털광고", label: "디지털광고", icon: "📱" },
  { id: "브랜드필름", label: "브랜드필름", icon: "🏷" },
  { id: "다큐멘터리", label: "다큐멘터리", icon: "🎥" },
  { id: "뮤직비디오", label: "뮤직비디오", icon: "🎵" },
  { id: "유튜브", label: "유튜브", icon: "▶" },
  { id: "인스타릴스", label: "인스타릴스", icon: "📷" },
  { id: "웨딩", label: "웨딩", icon: "💒" },
  { id: "기업", label: "기업홍보", icon: "🏢" },
  { id: "이벤트", label: "이벤트", icon: "🎉" },
  { id: "제품", label: "제품", icon: "📦" },
  { id: "여행", label: "여행", icon: "✈" },
];

const MOODS = [
  { id: "따뜻한", label: "따뜻한", color: "#f59e0b" },
  { id: "차가운", label: "차가운", color: "#3b82f6" },
  { id: "긴장", label: "긴장감", color: "#ef4444" },
  { id: "노스탤지어", label: "노스탤지어", color: "#d97706" },
  { id: "판타지", label: "판타지", color: "#a855f7" },
  { id: "자연", label: "자연스러운", color: "#22c55e" },
  { id: "럭셔리", label: "럭셔리", color: "#f59e0b" },
  { id: "에너지", label: "에너지", color: "#f97316" },
];

const PLATFORMS = [
  "YouTube", "Instagram Feed", "Instagram Reels", "TikTok",
  "Facebook", "LinkedIn", "Naver/Kakao", "OTT",
];

const BUDGETS = [
  { id: "0-50", label: "0~50만원" },
  { id: "50-100", label: "50~100만원" },
  { id: "100-200", label: "100~200만원" },
  { id: "200-500", label: "200~500만원" },
  { id: "500+", label: "500만원+" },
];

interface Recommendation {
  category: string;
  color: string;
  items: { label: string; value: string }[];
}

export default function SimulatorPage() {
  const [genre, setGenre] = useState<string | null>(null);
  const [mood, setMood] = useState<string | null>(null);
  const [platform, setPlatform] = useState<string | null>(null);
  const [budget, setBudget] = useState<string | null>(null);

  const recommendations = useMemo<Recommendation[]>(() => {
    const recs: Recommendation[] = [];
    if (!genre && !mood && !platform && !budget) return recs;

    // 장르 기반 추천
    if (genre) {
      const genreMatrix = findMatrix("genre-guide", "장르별 핵심 기법");
      const rows = findRowsByKeyword(genreMatrix, genre);
      if (rows.length > 0 && genreMatrix) {
        const row = rows[0];
        const items: { label: string; value: string }[] = [];
        genreMatrix.headers.forEach((h, i) => {
          if (i > 0 && row.cells[i]) items.push({ label: h, value: row.cells[i] });
        });
        recs.push({ category: "장르별 추천 기법", color: "#8b5cf6", items });
      }

      const techMatrix = findMatrix("genre-guide", "장르별 촬영 기법 매핑");
      const techRows = findRowsByKeyword(techMatrix, genre);
      if (techRows.length > 0 && techMatrix) {
        const row = techRows[0];
        const items: { label: string; value: string }[] = [];
        techMatrix.headers.forEach((h, i) => {
          if (i > 0 && row.cells[i]) items.push({ label: h, value: row.cells[i] });
        });
        recs.push({ category: "촬영 기법 매핑", color: "#6366f1", items });
      }
    }

    // 분위기 기반 - 촬영 조명 추천
    if (mood) {
      const lightMatrix = findMatrix("cinematography", "조명 선택");
      const rows = findRowsByKeyword(lightMatrix, mood);
      if (rows.length > 0 && lightMatrix) {
        const row = rows[0];
        recs.push({
          category: "촬영 조명 추천",
          color: "#3b82f6",
          items: lightMatrix.headers.map((h, i) => ({ label: h, value: row.cells[i] })).filter((_, i) => i > 0),
        });
      }

      // 색보정 추천
      const colorMatrix = colorGrading.decisionMatrices?.find(
        (m) => m.tableName.includes("감정") || m.tableName.includes("무드")
      );
      if (colorMatrix) {
        const rows = findRowsByKeyword(colorMatrix as Matrix, mood);
        if (rows.length > 0) {
          const row = rows[0];
          recs.push({
            category: "색보정 추천",
            color: "#a855f7",
            items: colorMatrix.headers.map((h, i) => ({ label: h, value: row.cells[i] })).filter((_, i) => i > 0),
          });
        }
      }
    }

    // 플랫폼 기반 추천
    if (platform) {
      const platMatrix = findMatrix("genre-guide", "플랫폼 최적화 매트릭스");
      const rows = findRowsByKeyword(platMatrix, platform);
      if (rows.length > 0 && platMatrix) {
        const row = rows[0];
        recs.push({
          category: "플랫폼 최적화",
          color: "#06b6d4",
          items: platMatrix.headers.map((h, i) => ({ label: h, value: row.cells[i] })).filter((_, i) => i > 0),
        });
      }
    }

    // 예산 기반 VFX 추천
    if (budget) {
      const budgetMatrix = vfxMotion.decisionMatrices?.find(
        (m) => m.tableName.includes("예산")
      );
      if (budgetMatrix) {
        const budgetLabel = BUDGETS.find((b) => b.id === budget)?.label ?? budget;
        let rows = findRowsByKeyword(budgetMatrix as Matrix, budgetLabel);
        if (rows.length === 0) {
          // 숫자로 매칭 시도
          const num = budget.split("-")[0].replace("+", "");
          rows = findRowsByKeyword(budgetMatrix as Matrix, num);
        }
        if (rows.length > 0) {
          const row = rows[0];
          recs.push({
            category: "VFX/모션 추천 (예산 기반)",
            color: "#ef4444",
            items: budgetMatrix.headers
              .map((h, i) => ({ label: h, value: row.cells[i] }))
              .filter((_, i) => i > 0),
          });
        }
      }
    }

    return recs;
  }, [genre, mood, platform, budget]);

  const hasSelection = genre || mood || platform || budget;

  return (
    <div className="space-y-8">
      <div>
        <h1 className="text-3xl font-bold mb-2">기법 추천 시뮬레이터</h1>
        <p className="text-sm" style={{ color: "var(--muted)" }}>
          장르, 분위기, 플랫폼, 예산을 선택하면 최적의 기법 조합을 추천합니다
        </p>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
        {/* 좌측: 입력 패널 */}
        <div className="space-y-6">
          {/* 장르 선택 */}
          <div>
            <h2 className="text-sm font-semibold mb-3">장르 선택</h2>
            <div className="grid grid-cols-3 sm:grid-cols-4 gap-2">
              {GENRES.map((g) => (
                <button
                  key={g.id}
                  onClick={() => setGenre(genre === g.id ? null : g.id)}
                  className="flex flex-col items-center gap-1 p-3 rounded-lg text-xs transition-all"
                  style={{
                    background: genre === g.id ? "rgba(99,102,241,0.2)" : "var(--surface)",
                    border: `1px solid ${genre === g.id ? "var(--accent)" : "var(--border)"}`,
                    color: genre === g.id ? "var(--accent)" : "var(--muted)",
                  }}
                >
                  <span className="text-lg">{g.icon}</span>
                  <span>{g.label}</span>
                </button>
              ))}
            </div>
          </div>

          {/* 분위기 선택 */}
          <div>
            <h2 className="text-sm font-semibold mb-3">분위기 선택</h2>
            <div className="grid grid-cols-4 gap-2">
              {MOODS.map((m) => (
                <button
                  key={m.id}
                  onClick={() => setMood(mood === m.id ? null : m.id)}
                  className="px-3 py-2 rounded-lg text-xs transition-all text-center"
                  style={{
                    background: mood === m.id ? `${m.color}33` : "var(--surface)",
                    border: `1px solid ${mood === m.id ? m.color : "var(--border)"}`,
                    color: mood === m.id ? m.color : "var(--muted)",
                  }}
                >
                  {m.label}
                </button>
              ))}
            </div>
          </div>

          {/* 플랫폼 선택 */}
          <div>
            <h2 className="text-sm font-semibold mb-3">플랫폼 선택</h2>
            <div className="grid grid-cols-4 gap-2">
              {PLATFORMS.map((p) => (
                <button
                  key={p}
                  onClick={() => setPlatform(platform === p ? null : p)}
                  className="px-3 py-2 rounded-lg text-xs transition-all text-center"
                  style={{
                    background: platform === p ? "rgba(6,182,212,0.2)" : "var(--surface)",
                    border: `1px solid ${platform === p ? "#06b6d4" : "var(--border)"}`,
                    color: platform === p ? "#06b6d4" : "var(--muted)",
                  }}
                >
                  {p}
                </button>
              ))}
            </div>
          </div>

          {/* 예산 선택 */}
          <div>
            <h2 className="text-sm font-semibold mb-3">예산 범위</h2>
            <div className="grid grid-cols-5 gap-2">
              {BUDGETS.map((b) => (
                <button
                  key={b.id}
                  onClick={() => setBudget(budget === b.id ? null : b.id)}
                  className="px-2 py-2 rounded-lg text-xs transition-all text-center"
                  style={{
                    background: budget === b.id ? "rgba(239,68,68,0.2)" : "var(--surface)",
                    border: `1px solid ${budget === b.id ? "#ef4444" : "var(--border)"}`,
                    color: budget === b.id ? "#ef4444" : "var(--muted)",
                  }}
                >
                  {b.label}
                </button>
              ))}
            </div>
          </div>

          {hasSelection && (
            <button
              onClick={() => { setGenre(null); setMood(null); setPlatform(null); setBudget(null); }}
              className="text-xs px-4 py-2 rounded-lg transition-colors"
              style={{ background: "var(--surface)", border: "1px solid var(--border)", color: "var(--muted)" }}
            >
              선택 초기화
            </button>
          )}
        </div>

        {/* 우측: 추천 결과 */}
        <div className="space-y-4">
          <h2 className="text-sm font-semibold" style={{ color: "var(--accent)" }}>
            추천 결과 {recommendations.length > 0 && `(${recommendations.length}개 카테고리)`}
          </h2>

          {!hasSelection ? (
            <div className="card p-8 text-center" style={{ color: "var(--muted)" }}>
              <p className="text-sm">좌측에서 장르, 분위기, 플랫폼, 예산을 선택하면</p>
              <p className="text-sm">최적의 기법 조합이 여기에 표시됩니다.</p>
            </div>
          ) : recommendations.length === 0 ? (
            <div className="card p-8 text-center" style={{ color: "var(--muted)" }}>
              <p className="text-sm">선택한 조합에 대한 매칭 결과가 없습니다.</p>
              <p className="text-xs mt-1">다른 조합을 시도해보세요.</p>
            </div>
          ) : (
            recommendations.map((rec, idx) => (
              <div key={idx} className="card overflow-hidden">
                <div
                  className="px-4 py-2 text-xs font-semibold"
                  style={{ background: `${rec.color}22`, color: rec.color, borderBottom: `1px solid ${rec.color}33` }}
                >
                  {rec.category}
                </div>
                <div className="p-4 space-y-2">
                  {rec.items.map((item, i) => (
                    <div key={i} className="flex gap-3">
                      <span className="text-xs font-medium shrink-0 w-24" style={{ color: rec.color }}>
                        {item.label}
                      </span>
                      <span className="text-xs leading-relaxed" style={{ color: "var(--muted)" }}>
                        {item.value}
                      </span>
                    </div>
                  ))}
                </div>
              </div>
            ))
          )}
        </div>
      </div>
    </div>
  );
}
