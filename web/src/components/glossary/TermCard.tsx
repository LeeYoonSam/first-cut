import { GlossaryTerm } from "@/lib/types";

const CATEGORY_COLORS: Record<string, string> = {
  촬영: "#3b82f6",
  편집: "#22c55e",
  사운드: "#eab308",
  색보정: "#a855f7",
  VFX: "#ef4444",
  연출: "#f97316",
  사전기획: "#06b6d4",
};

function getCategoryColor(category: string): string {
  // 초성 카테고리(ㄱ, ㄴ 등)는 기본 색상
  if (category.length === 1 && /[ㄱ-ㅎ]/.test(category)) {
    return "#6366f1";
  }
  return CATEGORY_COLORS[category] ?? "#6b6b8a";
}

interface TermCardProps {
  term: GlossaryTerm;
}

export default function TermCard({ term }: TermCardProps) {
  const color = getCategoryColor(term.category);

  return (
    <div
      className="card p-4 space-y-2 transition-all"
      style={{ cursor: "default" }}
    >
      <div className="flex items-start justify-between gap-2">
        <div className="flex items-baseline gap-2 flex-wrap">
          <span className="font-semibold text-sm">{term.term}</span>
          {term.english && (
            <span
              className="text-xs font-mono"
              style={{ color: "var(--accent)" }}
            >
              {term.english}
            </span>
          )}
        </div>
        <span
          className="text-xs px-2 py-0.5 rounded-full shrink-0"
          style={{
            background: `${color}22`,
            color: color,
          }}
        >
          {term.category}
        </span>
      </div>
      <p
        className="text-xs leading-relaxed"
        style={{ color: "var(--muted)" }}
      >
        {term.description}
      </p>
    </div>
  );
}
