import Link from "next/link";
import TechniqueCard from "@/components/techniques/TechniqueCard";
import type { Technique } from "@/lib/types";

const CATEGORY_META: Record<
  string,
  { nameKo: string; nameEn: string; icon: string; color: string; description: string }
> = {
  cinematography: {
    nameKo: "촬영기법",
    nameEn: "Cinematography",
    icon: "🎬",
    color: "#6366f1",
    description: "샷사이즈, 앵글, 카메라 무브먼트, 조명 기법",
  },
  directing: {
    nameKo: "연출기법",
    nameEn: "Directing",
    icon: "🎭",
    color: "#f97316",
    description: "내러티브 구조, 감정 곡선, 미장센 연출",
  },
  editing: {
    nameKo: "편집기법",
    nameEn: "Editing",
    icon: "✂️",
    color: "#10b981",
    description: "컷, 트랜지션, 편집 리듬, 페이싱",
  },
  "sound-design": {
    nameKo: "사운드디자인",
    nameEn: "Sound Design",
    icon: "🔊",
    color: "#eab308",
    description: "BGM, SFX, 나레이션, 앰비언스",
  },
  "color-grading": {
    nameKo: "색보정",
    nameEn: "Color Grading",
    icon: "🎨",
    color: "#a855f7",
    description: "컬러 팔레트, LUT, 색온도, 분위기",
  },
  "vfx-motion": {
    nameKo: "VFX/모션",
    nameEn: "VFX & Motion",
    icon: "✨",
    color: "#ef4444",
    description: "시각 효과, 모션그래픽, 합성 기법",
  },
  "pre-production": {
    nameKo: "사전기획",
    nameEn: "Pre-Production",
    icon: "📋",
    color: "#06b6d4",
    description: "콘셉트, 무드보드, 스토리보드, 체크리스트",
  },
  "genre-specific": {
    nameKo: "장르별기법",
    nameEn: "Genre-Specific",
    icon: "🎯",
    color: "#ec4899",
    description: "유튜브, 다큐, 광고, 숏폼 장르별 특화 기법",
  },
};

const CATEGORY_SLUGS = Object.keys(CATEGORY_META);

async function getTechniques(category: string): Promise<Technique[]> {
  try {
    const data = await import(`@/data/techniques/${category}.json`);
    return (data.default as Technique[]).filter(
      (t) => t.name && t.description
    );
  } catch {
    return [];
  }
}

export function generateStaticParams() {
  return CATEGORY_SLUGS.map((category) => ({ category }));
}

export default async function CategoryPage({
  params,
}: {
  params: Promise<{ category: string }>;
}) {
  const { category } = await params;
  const meta = CATEGORY_META[category];

  if (!meta) {
    return (
      <div className="space-y-4">
        <Link href="/techniques" className="text-sm" style={{ color: "var(--muted)" }}>
          ← 기법 목록으로
        </Link>
        <p style={{ color: "var(--muted)" }}>카테고리를 찾을 수 없습니다.</p>
      </div>
    );
  }

  const techniques = await getTechniques(category);

  return (
    <div className="space-y-8">
      {/* 헤더 */}
      <div>
        <Link
          href="/techniques"
          className="text-xs mb-4 inline-block transition-colors"
          style={{ color: "var(--muted)" }}
        >
          ← 기법 카테고리로 돌아가기
        </Link>
        <div className="flex items-center gap-3 mt-2">
          <span className="text-3xl">{meta.icon}</span>
          <div>
            <h1 className="text-3xl font-bold" style={{ color: meta.color }}>
              {meta.nameKo}
            </h1>
            <p className="text-sm font-mono" style={{ color: "var(--muted)" }}>
              {meta.nameEn}
            </p>
          </div>
        </div>
        <p className="mt-3 text-sm" style={{ color: "var(--muted)" }}>
          {meta.description} —{" "}
          <span style={{ color: meta.color }}>{techniques.length}개</span> 기법
        </p>
      </div>

      {/* 기법 목록 */}
      <div className="space-y-3">
        {techniques.map((technique, idx) => (
          <TechniqueCard
            key={`${technique.name}-${idx}`}
            technique={technique}
            accentColor={meta.color}
          />
        ))}
      </div>

      {techniques.length === 0 && (
        <p style={{ color: "var(--muted)" }}>기법 데이터를 찾을 수 없습니다.</p>
      )}
    </div>
  );
}
