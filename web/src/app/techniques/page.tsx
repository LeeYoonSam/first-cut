import CategoryGrid from "@/components/techniques/CategoryGrid";

export default function TechniquesPage() {
  return (
    <div className="space-y-8">
      <div>
        <h1 className="text-3xl font-bold mb-2">영상 기법 학습</h1>
        <p className="text-sm" style={{ color: "var(--muted)" }}>
          촬영·연출·편집·사운드·색보정 등{" "}
          <span style={{ color: "var(--accent)" }}>8개 분야</span>의 영상 제작 기법을 학습하세요.
          카테고리를 선택하면 상세 기법을 확인할 수 있습니다.
        </p>
      </div>

      <CategoryGrid />
    </div>
  );
}
