"use client";
import { useState } from "react";
import workflowData from "@/data/workflow.json";

interface WorkflowStep {
  id: string;
  name: string;
  description: string;
  skillRef?: string;
  subSteps?: string[];
  inputs?: string[];
  outputs?: string[];
}

interface WorkflowSkill {
  name: string;
  description: string;
  ref: string;
}

interface WorkflowData {
  steps: WorkflowStep[];
  skills: WorkflowSkill[];
}

const data = workflowData as WorkflowData;

const STEP_COLORS = [
  "#6366f1",
  "#8b5cf6",
  "#06b6d4",
  "#10b981",
  "#f59e0b",
  "#ec4899",
  "#f97316",
  "#14b8a6",
  "#ef4444",
];

const SKILL_COLORS: Record<string, string> = {
  cinematography: "#6366f1",
  directing: "#10b981",
  editing: "#06b6d4",
  "sound-design": "#ec4899",
  "color-grading": "#f59e0b",
  "vfx-motion": "#14b8a6",
  "genre-guide": "#8b5cf6",
  "pre-production": "#f97316",
  benchmark: "#94a3b8",
  "scene-builder": "#22d3ee",
  "export-plan": "#a3e635",
  "notion-sync": "#e2e8f0",
  "first-cut": "#6366f1",
};

export default function WorkflowPage() {
  const [activeStep, setActiveStep] = useState<string | null>(null);
  const [activeTab, setActiveTab] = useState<"workflow" | "skills">("workflow");

  const selectedStep = data.steps.find((s) => s.id === activeStep);

  return (
    <div className="space-y-8">
      <div>
        <h1 className="text-3xl font-bold mb-2">워크플로우</h1>
        <p className="text-sm" style={{ color: "var(--muted)" }}>
          영상 기획 아이디어부터 최종 기획서까지{" "}
          <span style={{ color: "var(--accent)" }}>{data.steps.length}단계</span> 프로세스
        </p>
      </div>

      {/* 탭 */}
      <div className="flex gap-2">
        {(["workflow", "skills"] as const).map((tab) => (
          <button
            key={tab}
            onClick={() => setActiveTab(tab)}
            className="px-4 py-2 rounded-lg text-sm font-medium transition-colors"
            style={{
              background: activeTab === tab ? "var(--accent)" : "var(--surface)",
              color: activeTab === tab ? "white" : "var(--muted)",
              border: "1px solid var(--border)",
            }}
          >
            {tab === "workflow" ? "단계별 워크플로우" : "스킬 라이브러리"}
          </button>
        ))}
      </div>

      {activeTab === "workflow" && (
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
          {/* 스텝 목록 */}
          <div className="lg:col-span-1 space-y-2">
            {data.steps.map((step, idx) => {
              const color = STEP_COLORS[idx % STEP_COLORS.length];
              const isActive = activeStep === step.id;
              return (
                <button
                  key={step.id}
                  onClick={() => setActiveStep(isActive ? null : step.id)}
                  className="w-full text-left p-3 rounded-lg transition-colors"
                  style={{
                    background: isActive ? `${color}22` : "var(--surface)",
                    border: `1px solid ${isActive ? color : "var(--border)"}`,
                  }}
                >
                  <div className="flex items-center gap-3">
                    <span
                      className="w-6 h-6 rounded-full flex items-center justify-center text-xs font-bold shrink-0"
                      style={{ background: color, color: "white" }}
                    >
                      {idx}
                    </span>
                    <span className="text-sm font-medium truncate">
                      {step.name}
                    </span>
                  </div>
                </button>
              );
            })}
          </div>

          {/* 스텝 상세 */}
          <div className="lg:col-span-2">
            {selectedStep ? (
              <StepDetail
                step={selectedStep}
                color={STEP_COLORS[data.steps.findIndex((s) => s.id === selectedStep.id) % STEP_COLORS.length]}
              />
            ) : (
              <div
                className="card p-8 text-center"
                style={{ color: "var(--muted)" }}
              >
                <p className="text-sm">왼쪽 단계를 클릭하면 상세 내용을 확인할 수 있습니다.</p>
              </div>
            )}
          </div>
        </div>
      )}

      {activeTab === "skills" && (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
          {data.skills.map((skill) => {
            const color = SKILL_COLORS[skill.name] ?? "#888";
            return (
              <div key={skill.name} className="card p-4">
                <div className="flex items-center gap-2 mb-2">
                  <span
                    className="w-2 h-2 rounded-full"
                    style={{ background: color }}
                  />
                  <span
                    className="text-xs font-mono font-semibold"
                    style={{ color }}
                  >
                    /{skill.name}
                  </span>
                </div>
                <p className="text-xs leading-relaxed" style={{ color: "var(--muted)" }}>
                  {skill.description}
                </p>
              </div>
            );
          })}
        </div>
      )}

      {/* 플로우 다이어그램 (간략한 시각화) */}
      {activeTab === "workflow" && (
        <div className="card p-6 overflow-x-auto">
          <h2 className="text-sm font-semibold mb-4" style={{ color: "var(--muted)" }}>
            전체 흐름
          </h2>
          <div className="flex items-center gap-2 min-w-max">
            {data.steps.map((step, idx) => {
              const color = STEP_COLORS[idx % STEP_COLORS.length];
              return (
                <div key={step.id} className="flex items-center gap-2">
                  <button
                    onClick={() => setActiveStep(step.id)}
                    className="flex flex-col items-center gap-1 px-3 py-2 rounded-lg transition-colors"
                    style={{
                      background:
                        activeStep === step.id
                          ? `${color}33`
                          : "var(--surface-hover)",
                      border: `1px solid ${activeStep === step.id ? color : "var(--border)"}`,
                    }}
                  >
                    <span
                      className="w-5 h-5 rounded-full flex items-center justify-center text-xs font-bold"
                      style={{ background: color, color: "white" }}
                    >
                      {idx}
                    </span>
                    <span
                      className="text-xs whitespace-nowrap"
                      style={{
                        color: activeStep === step.id ? "var(--foreground)" : "var(--muted)",
                        maxWidth: "80px",
                        overflow: "hidden",
                        textOverflow: "ellipsis",
                      }}
                    >
                      {step.name.length > 8 ? step.name.slice(0, 8) + "…" : step.name}
                    </span>
                  </button>
                  {idx < data.steps.length - 1 && (
                    <span style={{ color: "var(--muted)" }} className="text-xs">
                      →
                    </span>
                  )}
                </div>
              );
            })}
          </div>
        </div>
      )}
    </div>
  );
}

function StepDetail({ step, color }: { step: WorkflowStep; color: string }) {
  return (
    <div className="card p-6 space-y-4">
      <div className="flex items-start gap-3">
        <span
          className="w-8 h-8 rounded-full flex items-center justify-center text-sm font-bold shrink-0 mt-0.5"
          style={{ background: color, color: "white" }}
        >
          {step.id.replace("step-", "")}
        </span>
        <div>
          <h2 className="font-bold text-lg">{step.name}</h2>
          {step.skillRef && (
            <span
              className="text-xs font-mono mt-1 inline-block"
              style={{ color }}
            >
              /{step.skillRef}
            </span>
          )}
        </div>
      </div>

      {step.description && (
        <p className="text-sm leading-relaxed" style={{ color: "var(--muted)" }}>
          {step.description}
        </p>
      )}

      {step.subSteps && step.subSteps.length > 0 && (
        <div>
          <h3 className="text-xs font-semibold mb-2" style={{ color }}>
            세부 단계
          </h3>
          <ul className="space-y-1">
            {step.subSteps.map((sub, i) => (
              <li key={i} className="flex gap-2 text-xs" style={{ color: "var(--muted)" }}>
                <span style={{ color }} className="shrink-0">
                  •
                </span>
                <span className="leading-relaxed">{sub}</span>
              </li>
            ))}
          </ul>
        </div>
      )}
    </div>
  );
}
