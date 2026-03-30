"use client";

import { useState } from "react";
import { SceneSelections } from "./TechniqueSelector";

const LABEL_MAP: Record<keyof SceneSelections, string> = {
  sceneType: "씬 타입",
  shotSize: "샷 사이즈",
  angle: "앵글",
  movement: "무브먼트",
  composition: "구도",
  lighting: "조명",
  bgm: "BGM",
  sfx: "SFX/앰비언스",
  narration: "나레이션",
  ambience: "앰비언스",
  transition: "전환",
  pacing: "페이싱",
  timeExpression: "시간 표현",
  colorMood: "색보정 무드",
  lut: "LUT",
};

const SECTION_MAP: { title: string; color: string; keys: (keyof SceneSelections)[] }[] = [
  {
    title: "촬영",
    color: "#6366f1",
    keys: ["shotSize", "angle", "movement", "composition", "lighting"],
  },
  {
    title: "사운드",
    color: "#ec4899",
    keys: ["bgm", "sfx", "narration"],
  },
  {
    title: "편집",
    color: "#06b6d4",
    keys: ["transition", "pacing", "timeExpression"],
  },
  {
    title: "색보정",
    color: "#f59e0b",
    keys: ["colorMood", "lut"],
  },
];

interface ScenePreviewProps {
  selections: SceneSelections;
}

function toMarkdown(selections: SceneSelections): string {
  const lines: string[] = [];
  lines.push(`## 씬: ${selections.sceneType || "(미선택)"}`);
  lines.push("");

  for (const section of SECTION_MAP) {
    const hasAny = section.keys.some(
      (k) => selections[k] && selections[k] !== ""
    );
    if (!hasAny) continue;
    lines.push(`### ${section.title}`);
    for (const key of section.keys) {
      if (selections[key]) {
        lines.push(`- ${LABEL_MAP[key]}: ${selections[key]}`);
      }
    }
    lines.push("");
  }

  return lines.join("\n");
}

export default function ScenePreview({ selections }: ScenePreviewProps) {
  const [copied, setCopied] = useState(false);

  const hasAnySelection = Object.values(selections).some((v) => v !== "");

  const handleCopy = async () => {
    const md = toMarkdown(selections);
    try {
      await navigator.clipboard.writeText(md);
      setCopied(true);
      setTimeout(() => setCopied(false), 2000);
    } catch {
      // clipboard API 미지원 시 fallback
      const el = document.createElement("textarea");
      el.value = md;
      document.body.appendChild(el);
      el.select();
      document.execCommand("copy");
      document.body.removeChild(el);
      setCopied(true);
      setTimeout(() => setCopied(false), 2000);
    }
  };

  return (
    <div className="card p-5 space-y-4 sticky top-4">
      <div className="flex items-center justify-between">
        <h2 className="text-sm font-semibold" style={{ color: "var(--foreground)" }}>
          씬 프리뷰
        </h2>
        <button
          onClick={handleCopy}
          disabled={!hasAnySelection}
          className="text-xs px-3 py-1.5 rounded-lg transition-all font-medium"
          style={{
            background: copied
              ? "rgba(16,185,129,0.2)"
              : hasAnySelection
              ? "var(--accent)"
              : "var(--surface-hover)",
            color: copied ? "#34d399" : hasAnySelection ? "white" : "var(--muted)",
            border: `1px solid ${copied ? "#10b981" : hasAnySelection ? "var(--accent)" : "var(--border)"}`,
            cursor: hasAnySelection ? "pointer" : "not-allowed",
            opacity: hasAnySelection ? 1 : 0.5,
          }}
        >
          {copied ? "복사됨!" : "마크다운 복사"}
        </button>
      </div>

      {/* 씬 타입 배지 */}
      {selections.sceneType && (
        <div
          className="inline-block px-3 py-1 rounded-full text-xs font-semibold"
          style={{ background: "rgba(99,102,241,0.2)", color: "var(--accent)" }}
        >
          {selections.sceneType}
        </div>
      )}

      {!hasAnySelection ? (
        <p className="text-xs text-center py-6" style={{ color: "var(--muted)" }}>
          왼쪽에서 기법을 선택하면<br />씬 요약이 여기에 표시됩니다.
        </p>
      ) : (
        <div className="space-y-4">
          {SECTION_MAP.map((section) => {
            const items = section.keys.filter(
              (k) => selections[k] && selections[k] !== ""
            );
            if (items.length === 0) return null;
            return (
              <div key={section.title}>
                <h3
                  className="text-xs font-semibold mb-2 uppercase tracking-wide"
                  style={{ color: section.color }}
                >
                  {section.title}
                </h3>
                <div className="space-y-1.5">
                  {items.map((key) => (
                    <div key={key} className="flex gap-2 items-start">
                      <span
                        className="text-xs shrink-0 w-20"
                        style={{ color: "var(--muted)" }}
                      >
                        {LABEL_MAP[key]}
                      </span>
                      <span
                        className="text-xs px-2 py-0.5 rounded font-medium"
                        style={{
                          background: `${section.color}15`,
                          color: section.color,
                        }}
                      >
                        {selections[key]}
                      </span>
                    </div>
                  ))}
                </div>
              </div>
            );
          })}
        </div>
      )}

      {/* 마크다운 미리보기 */}
      {hasAnySelection && (
        <details className="mt-2">
          <summary
            className="text-xs cursor-pointer"
            style={{ color: "var(--muted)" }}
          >
            마크다운 미리보기
          </summary>
          <pre
            className="mt-2 p-3 rounded-lg text-xs overflow-x-auto leading-relaxed"
            style={{
              background: "var(--surface-hover)",
              color: "var(--muted)",
              whiteSpace: "pre-wrap",
              wordBreak: "break-word",
            }}
          >
            {toMarkdown(selections)}
          </pre>
        </details>
      )}
    </div>
  );
}
