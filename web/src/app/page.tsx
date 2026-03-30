import Link from "next/link";
import glossaryData from "@/data/glossary.json";
import decisionMatrices from "@/data/decision-matrices.json";
import workflowData from "@/data/workflow.json";

const features = [
  {
    href: "/glossary",
    title: "용어집",
    description: "영상 제작 전문 용어 137개를 한눈에 검색하고 학습하세요.",
    stat: `${glossaryData.length}개 용어`,
    color: "#6366f1",
  },
  {
    href: "/techniques",
    title: "기법 학습",
    description: "촬영·편집·사운드·색보정 등 8개 분야의 기법을 상세히 학습하세요.",
    stat: "8개 분야",
    color: "#8b5cf6",
  },
  {
    href: "/decision-matrix",
    title: "결정 매트릭스",
    description: "장면 상황과 목적에 맞는 최적의 기법을 매트릭스로 빠르게 찾으세요.",
    stat: `${decisionMatrices.length}개 매트릭스`,
    color: "#06b6d4",
  },
  {
    href: "/workflow",
    title: "워크플로우",
    description: "아이디어 수집부터 최종 기획서 완성까지 9단계 워크플로우를 탐색하세요.",
    stat: `${(workflowData as { steps: unknown[] }).steps.length}단계`,
    color: "#10b981",
  },
];

export default function HomePage() {
  return (
    <div className="space-y-16">
      {/* 히어로 */}
      <section className="pt-16 pb-8 text-center space-y-6">
        <div
          className="inline-block px-3 py-1 rounded-full text-xs font-medium mb-2"
          style={{
            background: "rgba(99,102,241,0.15)",
            color: "var(--accent)",
            border: "1px solid rgba(99,102,241,0.3)",
          }}
        >
          영상 기획 AI 하니스
        </div>
        <h1 className="text-5xl font-bold leading-tight">
          First Cut
        </h1>
        <p className="text-xl max-w-2xl mx-auto" style={{ color: "var(--muted)" }}>
          씬별 촬영·사운드·편집 기법이 명시된 마크다운 기획서를 만드는
          체계적인 영상 기획 워크플로우
        </p>
        <div className="flex gap-4 justify-center">
          <Link href="/workflow" className="btn-primary text-sm font-medium">
            워크플로우 시작
          </Link>
          <Link
            href="/decision-matrix"
            className="text-sm font-medium px-4 py-2 rounded-lg transition-colors"
            style={{
              border: "1px solid var(--border)",
              color: "var(--foreground)",
            }}
          >
            결정 매트릭스 탐색
          </Link>
        </div>
      </section>

      {/* 기능 카드 */}
      <section>
        <h2 className="text-2xl font-bold mb-8">주요 기능</h2>
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          {features.map((f) => (
            <Link key={f.href} href={f.href} className="card p-6 block group">
              <div className="flex items-start justify-between mb-3">
                <h3
                  className="text-lg font-semibold group-hover:text-white transition-colors"
                  style={{ color: f.color }}
                >
                  {f.title}
                </h3>
                <span
                  className="text-xs px-2 py-1 rounded-full font-mono"
                  style={{
                    background: `${f.color}22`,
                    color: f.color,
                  }}
                >
                  {f.stat}
                </span>
              </div>
              <p className="text-sm leading-relaxed" style={{ color: "var(--muted)" }}>
                {f.description}
              </p>
            </Link>
          ))}
        </div>
      </section>

      {/* 스킬 목록 */}
      <section>
        <h2 className="text-2xl font-bold mb-4">스킬 라이브러리</h2>
        <p className="text-sm mb-6" style={{ color: "var(--muted)" }}>
          각 스킬은 독립적으로 참조할 수 있는 결정 매트릭스와 기법 가이드를 제공합니다.
        </p>
        <div className="flex flex-wrap gap-2">
          {(workflowData as { skills: { name: string; description: string }[] }).skills.map((s) => (
            <span key={s.name} className="tag text-xs px-3 py-1.5">
              {s.name} — {s.description}
            </span>
          ))}
        </div>
      </section>
    </div>
  );
}
