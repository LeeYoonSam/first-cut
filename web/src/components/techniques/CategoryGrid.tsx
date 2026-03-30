import Link from "next/link";

interface CategoryInfo {
  slug: string;
  icon: string;
  nameKo: string;
  nameEn: string;
  count: number;
  description: string;
  color: string;
}

const CATEGORIES: CategoryInfo[] = [
  {
    slug: "cinematography",
    icon: "🎬",
    nameKo: "촬영기법",
    nameEn: "Cinematography",
    count: 14,
    description: "샷사이즈, 앵글, 카메라 무브먼트, 조명 기법",
    color: "#6366f1",
  },
  {
    slug: "directing",
    icon: "🎭",
    nameKo: "연출기법",
    nameEn: "Directing",
    count: 13,
    description: "내러티브 구조, 감정 곡선, 미장센 연출",
    color: "#f97316",
  },
  {
    slug: "editing",
    icon: "✂️",
    nameKo: "편집기법",
    nameEn: "Editing",
    count: 13,
    description: "컷, 트랜지션, 편집 리듬, 페이싱",
    color: "#10b981",
  },
  {
    slug: "sound-design",
    icon: "🔊",
    nameKo: "사운드디자인",
    nameEn: "Sound Design",
    count: 13,
    description: "BGM, SFX, 나레이션, 앰비언스",
    color: "#eab308",
  },
  {
    slug: "color-grading",
    icon: "🎨",
    nameKo: "색보정",
    nameEn: "Color Grading",
    count: 13,
    description: "컬러 팔레트, LUT, 색온도, 분위기",
    color: "#a855f7",
  },
  {
    slug: "vfx-motion",
    icon: "✨",
    nameKo: "VFX/모션",
    nameEn: "VFX & Motion",
    count: 13,
    description: "시각 효과, 모션그래픽, 합성 기법",
    color: "#ef4444",
  },
  {
    slug: "pre-production",
    icon: "📋",
    nameKo: "사전기획",
    nameEn: "Pre-Production",
    count: 13,
    description: "콘셉트, 무드보드, 스토리보드, 체크리스트",
    color: "#06b6d4",
  },
  {
    slug: "genre-specific",
    icon: "🎯",
    nameKo: "장르별기법",
    nameEn: "Genre-Specific",
    count: 13,
    description: "유튜브, 다큐, 광고, 숏폼 장르별 특화 기법",
    color: "#ec4899",
  },
];

export default function CategoryGrid() {
  return (
    <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-4">
      {CATEGORIES.map((cat) => (
        <Link
          key={cat.slug}
          href={`/techniques/${cat.slug}`}
          className="card p-5 block group transition-all duration-200"
          style={{ borderColor: `${cat.color}33` }}
        >
          <div className="flex items-start justify-between mb-3">
            <span className="text-2xl">{cat.icon}</span>
            <span
              className="text-xs px-2 py-0.5 rounded-full font-mono"
              style={{
                background: `${cat.color}22`,
                color: cat.color,
              }}
            >
              {cat.count}개
            </span>
          </div>
          <h3
            className="font-bold text-base mb-0.5 transition-colors"
            style={{ color: cat.color }}
          >
            {cat.nameKo}
          </h3>
          <p className="text-xs font-mono mb-2" style={{ color: "var(--muted)" }}>
            {cat.nameEn}
          </p>
          <p className="text-xs leading-relaxed" style={{ color: "var(--muted)" }}>
            {cat.description}
          </p>
        </Link>
      ))}
    </div>
  );
}
