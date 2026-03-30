"use client";

import decisionMatrices from "@/data/decision-matrices.json";
import { DecisionMatrix } from "@/lib/types";

const matrices = decisionMatrices as DecisionMatrix[];

// 장르 ID → 장르별 핵심 기법 테이블의 장르명 매핑
const GENRE_MAP: Record<string, string> = {
  "tv-ad": "TV 광고",
  "digital-ad": "디지털 광고",
  "brand-film": "브랜드 필름",
  "documentary": "다큐멘터리",
  "music-video": "뮤직비디오",
  "youtube": "유튜브 콘텐츠",
  "reels": "인스타 릴스/틱톡",
  "wedding": "웨딩",
  "corporate": "기업 홍보",
  "event": "이벤트",
  "product": "제품 영상",
  "travel": "여행 영상",
};

// 분위기 ID → 색보정 테이블 감정/분위기 매핑
const MOOD_MAP: Record<string, string> = {
  "warm": "따뜻함·친근함",
  "cool": "차가움·세련됨",
  "tension": "긴장·스릴",
  "nostalgia": "향수·레트로",
  "fantasy": "판타지·비현실",
  "natural": "자연·힐링",
  "luxury": "고급·럭셔리",
  "energy": "에너지·역동",
};

// 플랫폼 ID → 플랫폼 최적화 매핑
const PLATFORM_MAP: Record<string, { ratio: string; length: string; subtitle: string }> = {
  "youtube": { ratio: "16:9", length: "5~20분", subtitle: "선택적" },
  "instagram-feed": { ratio: "1:1 또는 4:5", length: "15~60초", subtitle: "권장" },
  "instagram-reels": { ratio: "9:16", length: "15~90초", subtitle: "권장" },
  "tiktok": { ratio: "9:16", length: "15~60초", subtitle: "권장" },
  "facebook": { ratio: "16:9 또는 1:1", length: "1~3분", subtitle: "권장" },
  "linkedin": { ratio: "16:9", length: "30초~5분", subtitle: "선택적" },
  "naver-kakao": { ratio: "16:9 또는 1:1", length: "30초~3분", subtitle: "권장" },
  "ott": { ratio: "16:9 또는 2.39:1", length: "20~120분", subtitle: "필수" },
};

// 예산 ID → VFX 추천 매핑
const BUDGET_VFX_MAP: Record<string, string> = {
  "0-50": "텍스트 자막, 간단한 페이드/디졸브 전환",
  "50-100": "로고 애니메이션, 인트로/아웃트로 타이틀",
  "100-200": "인포그래픽 모션, 컬러 그레이딩",
  "200-500": "2D 제품 애니메이션, 크로마키+합성",
  "500+": "3D 애니메이션, 풀 VFX 합성, 시각적 특수효과",
};

function findMatrixRow(skillName: string, tableName: string, keyword: string) {
  const matrix = matrices.find(
    (m) => m.skillName === skillName && m.tableName === tableName
  );
  if (!matrix) return null;
  return matrix.rows.find((row) =>
    row.cells.some((cell) => cell.includes(keyword))
  );
}

interface RecommendationPanelProps {
  genre: string | null;
  mood: string | null;
  platform: string | null;
  budget: string | null;
}

export default function RecommendationPanel({
  genre,
  mood,
  platform,
  budget,
}: RecommendationPanelProps) {
  const hasSelection = genre || mood || platform || budget;

  if (!hasSelection) {
    return (
      <div
        className="card p-8 text-center h-full flex items-center justify-center"
        style={{ color: "var(--muted)", minHeight: "400px" }}
      >
        <div>
          <div className="text-4xl mb-4 opacity-30">🎬</div>
          <p className="text-sm">왼쪽에서 장르, 분위기, 플랫폼, 예산을 선택하면<br />맞춤 기법을 추천해드립니다.</p>
        </div>
      </div>
    );
  }

  // 장르 기반 추천
  let genreRow: string[] | null = null;
  let genreHeaders: string[] = [];
  if (genre) {
    const genreLabel = GENRE_MAP[genre];
    const matrix = matrices.find(
      (m) => m.skillName === "genre-guide" && m.tableName === "장르별 핵심 기법"
    );
    if (matrix) {
      genreHeaders = matrix.headers;
      const row = matrix.rows.find((r) => r.cells[0].includes(genreLabel) || genreLabel.includes(r.cells[0]));
      if (row) genreRow = row.cells;
    }
  }

  // 분위기 기반 색보정 추천
  let moodRow: string[] | null = null;
  let moodHeaders: string[] = [];
  if (mood) {
    const moodLabel = MOOD_MAP[mood];
    const matrix = matrices.find(
      (m) => m.skillName === "color-grading" && m.tableName === "감정/분위기별"
    );
    if (matrix) {
      moodHeaders = matrix.headers;
      const row = matrix.rows.find((r) =>
        r.cells[0].includes(moodLabel.split("·")[0]) || moodLabel.includes(r.cells[0].split("·")[0])
      );
      if (row) moodRow = row.cells;
    }
  }

  // 플랫폼 최적화
  const platformInfo = platform ? PLATFORM_MAP[platform] : null;

  // 예산 기반 VFX
  const budgetVfx = budget ? BUDGET_VFX_MAP[budget] : null;

  return (
    <div className="space-y-4">
      <h2 className="text-base font-semibold" style={{ color: "var(--foreground)" }}>
        추천 기법
      </h2>

      {/* 장르 기반 추천 */}
      {genreRow && (
        <div className="card p-4 space-y-3">
          <h3 className="text-xs font-semibold uppercase tracking-wide" style={{ color: "#6366f1" }}>
            장르: {GENRE_MAP[genre!]}
          </h3>
          <div className="grid grid-cols-1 gap-2">
            {genreHeaders.slice(1).map((header, i) => (
              <div key={header} className="flex gap-2">
                <span className="text-xs shrink-0 w-20 pt-0.5" style={{ color: "var(--muted)" }}>
                  {header}
                </span>
                <span
                  className="text-xs px-2 py-0.5 rounded font-medium"
                  style={{ background: "rgba(99,102,241,0.15)", color: "#818cf8" }}
                >
                  {genreRow![i + 1]}
                </span>
              </div>
            ))}
          </div>
        </div>
      )}

      {/* 분위기 기반 색보정 */}
      {moodRow && (
        <div className="card p-4 space-y-3">
          <h3 className="text-xs font-semibold uppercase tracking-wide" style={{ color: "#f59e0b" }}>
            색보정: {MOOD_MAP[mood!]}
          </h3>
          <div className="grid grid-cols-1 gap-2">
            {moodHeaders.slice(1).map((header, i) => (
              <div key={header} className="flex gap-2">
                <span className="text-xs shrink-0 w-20 pt-0.5" style={{ color: "var(--muted)" }}>
                  {header}
                </span>
                <span
                  className="text-xs px-2 py-0.5 rounded font-medium"
                  style={{ background: "rgba(245,158,11,0.15)", color: "#fbbf24" }}
                >
                  {moodRow![i + 1]}
                </span>
              </div>
            ))}
          </div>
        </div>
      )}

      {/* 플랫폼 최적화 */}
      {platformInfo && (
        <div className="card p-4 space-y-3">
          <h3 className="text-xs font-semibold uppercase tracking-wide" style={{ color: "#10b981" }}>
            플랫폼 최적화
          </h3>
          <div className="grid grid-cols-1 gap-2">
            <div className="flex gap-2">
              <span className="text-xs shrink-0 w-20 pt-0.5" style={{ color: "var(--muted)" }}>화면비</span>
              <span className="text-xs px-2 py-0.5 rounded font-medium" style={{ background: "rgba(16,185,129,0.15)", color: "#34d399" }}>
                {platformInfo.ratio}
              </span>
            </div>
            <div className="flex gap-2">
              <span className="text-xs shrink-0 w-20 pt-0.5" style={{ color: "var(--muted)" }}>권장 길이</span>
              <span className="text-xs px-2 py-0.5 rounded font-medium" style={{ background: "rgba(16,185,129,0.15)", color: "#34d399" }}>
                {platformInfo.length}
              </span>
            </div>
            <div className="flex gap-2">
              <span className="text-xs shrink-0 w-20 pt-0.5" style={{ color: "var(--muted)" }}>자막</span>
              <span className="text-xs px-2 py-0.5 rounded font-medium" style={{ background: "rgba(16,185,129,0.15)", color: "#34d399" }}>
                {platformInfo.subtitle}
              </span>
            </div>
          </div>
        </div>
      )}

      {/* 예산 기반 VFX */}
      {budgetVfx && (
        <div className="card p-4 space-y-3">
          <h3 className="text-xs font-semibold uppercase tracking-wide" style={{ color: "#06b6d4" }}>
            VFX/모션 (예산 기반)
          </h3>
          <p className="text-xs leading-relaxed" style={{ color: "var(--muted)" }}>
            {budgetVfx}
          </p>
        </div>
      )}

      {/* 촬영 기법 추천 (분위기 기반) */}
      {mood && (
        <MoodCinematographyRecommendation mood={mood} />
      )}
    </div>
  );
}

function MoodCinematographyRecommendation({ mood }: { mood: string }) {
  const moodToLighting: Record<string, string> = {
    "warm": "골든아워 자연광",
    "cool": "블루아워/쿨톤",
    "tension": "로우키 조명",
    "nostalgia": "골든아워 자연광",
    "fantasy": "백라이트/림라이트",
    "natural": "자연광 (혼합)",
    "luxury": "로우키 조명",
    "energy": "하이키 조명",
  };

  const lightingKeyword = moodToLighting[mood];
  if (!lightingKeyword) return null;

  const matrix = matrices.find(
    (m) => m.skillName === "cinematography" && m.tableName === "조명 선택"
  );
  if (!matrix) return null;

  const row = matrix.rows.find((r) => r.cells[1].includes(lightingKeyword.split("/")[0]));
  if (!row) return null;

  return (
    <div className="card p-4 space-y-3">
      <h3 className="text-xs font-semibold uppercase tracking-wide" style={{ color: "#8b5cf6" }}>
        추천 조명
      </h3>
      <div className="grid grid-cols-1 gap-2">
        {matrix.headers.slice(1).map((header, i) => (
          <div key={header} className="flex gap-2">
            <span className="text-xs shrink-0 w-20 pt-0.5" style={{ color: "var(--muted)" }}>
              {header}
            </span>
            <span
              className="text-xs px-2 py-0.5 rounded font-medium"
              style={{ background: "rgba(139,92,246,0.15)", color: "#a78bfa" }}
            >
              {row.cells[i + 1]}
            </span>
          </div>
        ))}
      </div>
    </div>
  );
}
