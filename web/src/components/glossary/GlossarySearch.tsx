"use client";

interface GlossarySearchProps {
  query: string;
  onQueryChange: (q: string) => void;
  resultCount: number;
}

export default function GlossarySearch({
  query,
  onQueryChange,
  resultCount,
}: GlossarySearchProps) {
  return (
    <div className="space-y-2">
      <div className="relative">
        <span
          className="absolute left-3 top-1/2 -translate-y-1/2 text-sm"
          style={{ color: "var(--muted)" }}
        >
          🔍
        </span>
        <input
          type="text"
          placeholder="용어, 영문명, 설명 검색..."
          value={query}
          onChange={(e) => onQueryChange(e.target.value)}
          className="w-full pl-9 pr-4 py-2.5 rounded-lg text-sm outline-none transition-all"
          style={{
            background: "var(--surface)",
            border: "1px solid var(--border)",
            color: "var(--foreground)",
          }}
        />
      </div>
      <p className="text-xs" style={{ color: "var(--muted)" }}>
        검색 결과:{" "}
        <span style={{ color: "var(--accent)" }}>{resultCount}</span>개 용어
      </p>
    </div>
  );
}
