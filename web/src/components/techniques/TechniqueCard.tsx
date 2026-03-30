"use client";
import { useState } from "react";
import type { Technique } from "@/lib/types";

interface TechniqueCardProps {
  technique: Technique;
  accentColor?: string;
}

export default function TechniqueCard({ technique, accentColor = "#6366f1" }: TechniqueCardProps) {
  const [expanded, setExpanded] = useState(false);

  const hasDetails =
    technique.whenToUse ||
    technique.howToExecute ||
    technique.commonMistakes ||
    technique.examples;

  return (
    <div className="card overflow-hidden">
      <button
        className="w-full p-4 text-left"
        onClick={() => hasDetails && setExpanded((v) => !v)}
        style={{ cursor: hasDetails ? "pointer" : "default" }}
      >
        <div className="flex items-start justify-between gap-4">
          <div className="flex-1 min-w-0">
            <div className="flex items-baseline gap-2 flex-wrap">
              <span className="font-semibold text-sm">{technique.name}</span>
              {technique.english && (
                <span className="text-xs font-mono" style={{ color: accentColor }}>
                  {technique.english}
                </span>
              )}
            </div>
            <p className="text-xs mt-1 leading-relaxed" style={{ color: "var(--muted)" }}>
              {technique.description}
            </p>
          </div>
          {hasDetails && (
            <span
              className="text-xs shrink-0 transition-transform duration-300"
              style={{
                color: "var(--muted)",
                transform: expanded ? "rotate(180deg)" : "rotate(0deg)",
                display: "inline-block",
              }}
            >
              ▼
            </span>
          )}
        </div>
      </button>

      <div
        className="overflow-hidden transition-all duration-300"
        style={{
          maxHeight: expanded && hasDetails ? "600px" : "0px",
        }}
      >
        {hasDetails && (
          <div
            className="px-4 pb-4 space-y-3"
            style={{ borderTop: "1px solid var(--border)" }}
          >
            {technique.whenToUse && (
              <div className="pt-3">
                <p className="text-xs font-semibold mb-1" style={{ color: accentColor }}>
                  사용 시기
                </p>
                <p className="text-xs leading-relaxed" style={{ color: "var(--muted)" }}>
                  {technique.whenToUse}
                </p>
              </div>
            )}
            {technique.howToExecute && (
              <div>
                <p className="text-xs font-semibold mb-1" style={{ color: "#10b981" }}>
                  실행 방법 / 효과
                </p>
                <p className="text-xs leading-relaxed" style={{ color: "var(--muted)" }}>
                  {technique.howToExecute}
                </p>
              </div>
            )}
            {technique.examples && (
              <div>
                <p className="text-xs font-semibold mb-1" style={{ color: "#f59e0b" }}>
                  예시
                </p>
                <p className="text-xs leading-relaxed" style={{ color: "var(--muted)" }}>
                  {technique.examples}
                </p>
              </div>
            )}
            {technique.commonMistakes && (
              <div>
                <p className="text-xs font-semibold mb-1" style={{ color: "#ef4444" }}>
                  주의 사항
                </p>
                <p className="text-xs leading-relaxed" style={{ color: "var(--muted)" }}>
                  {technique.commonMistakes}
                </p>
              </div>
            )}
          </div>
        )}
      </div>
    </div>
  );
}
