"use client";
import { useState, useMemo } from "react";
import cinematography from "@/data/skills/cinematography.json";
import soundDesign from "@/data/skills/sound-design.json";
import editing from "@/data/skills/editing.json";
import colorGrading from "@/data/skills/color-grading.json";

interface MatrixRow { cells: string[] }
interface Matrix { skillName: string; tableName: string; headers: string[]; rows: MatrixRow[] }

function getMatrixOptions(skill: { decisionMatrices: Matrix[] }, tableName: string): { value: string; description: string }[] {
  const matrix = skill.decisionMatrices?.find((m) => m.tableName.includes(tableName));
  if (!matrix) return [];
  return matrix.rows.map((r) => ({
    value: r.cells[1] ?? r.cells[0],
    description: r.cells.slice(2).filter(Boolean).join(" / "),
  }));
}

function getMatrixRow(skill: { decisionMatrices: Matrix[] }, tableName: string, keyword: string): string[] {
  const matrix = skill.decisionMatrices?.find((m) => m.tableName.includes(tableName));
  if (!matrix) return [];
  const row = matrix.rows.find((r) => r.cells.some((c) => c.includes(keyword)));
  return row?.cells.slice(1) ?? [];
}

const SCENE_TYPES = [
  { id: "intro", label: "인트로", icon: "🎬", desc: "시청자의 관심을 끄는 도입부" },
  { id: "main", label: "본론", icon: "📝", desc: "핵심 내용을 전달하는 메인 파트" },
  { id: "climax", label: "클라이맥스", icon: "⚡", desc: "감정이 최고조에 달하는 절정" },
  { id: "transition", label: "전환", icon: "🔄", desc: "장면 간 자연스러운 이어짐" },
  { id: "outro", label: "아웃트로", icon: "🎞", desc: "영상의 마무리와 여운" },
];

// 드롭다운 옵션 데이터 추출
const shotSizes = getMatrixOptions(cinematography as any, "샷사이즈");
const angles = getMatrixOptions(cinematography as any, "앵글");
const movements = getMatrixOptions(cinematography as any, "무브먼트");
const compositions = getMatrixOptions(cinematography as any, "구도");
const lightings = getMatrixOptions(cinematography as any, "조명");
const bgmGenres = getMatrixOptions(soundDesign as any, "BGM") .length > 0
  ? getMatrixOptions(soundDesign as any, "BGM")
  : (soundDesign as any).decisionMatrices?.[0]?.rows?.map((r: MatrixRow) => ({ value: r.cells[0] ?? r.cells[1], description: r.cells.slice(1).filter(Boolean).join(" / ") })) ?? [];
const narrationStyles = getMatrixOptions(soundDesign as any, "나레이션");
const ambiences = getMatrixOptions(soundDesign as any, "앰비언스");
const transitions = getMatrixOptions(editing as any, "전환");
const pacings = getMatrixOptions(editing as any, "리듬") .length > 0
  ? getMatrixOptions(editing as any, "리듬")
  : getMatrixOptions(editing as any, "페이싱");
const colorMoods = getMatrixOptions(colorGrading as any, "감정") .length > 0
  ? getMatrixOptions(colorGrading as any, "감정")
  : getMatrixOptions(colorGrading as any, "무드");
const luts = getMatrixOptions(colorGrading as any, "LUT");

interface SceneConfig {
  type: string;
  shotSize: string;
  angle: string;
  movement: string;
  composition: string;
  lighting: string;
  bgm: string;
  narration: string;
  ambience: string;
  transition: string;
  pacing: string;
  colorMood: string;
  lut: string;
}

const defaultConfig: SceneConfig = {
  type: "", shotSize: "", angle: "", movement: "", composition: "", lighting: "",
  bgm: "", narration: "", ambience: "", transition: "", pacing: "", colorMood: "", lut: "",
};

function SelectField({
  label, value, onChange, options, color,
}: {
  label: string; value: string; onChange: (v: string) => void;
  options: { value: string; description: string }[]; color: string;
}) {
  if (options.length === 0) return null;
  return (
    <div className="space-y-1">
      <label className="text-xs font-medium" style={{ color }}>{label}</label>
      <select
        value={value}
        onChange={(e) => onChange(e.target.value)}
        className="w-full px-3 py-2 rounded-lg text-xs outline-none appearance-none"
        style={{ background: "var(--surface)", border: "1px solid var(--border)", color: "var(--foreground)" }}
      >
        <option value="">선택하세요</option>
        {options.map((o, i) => (
          <option key={i} value={o.value}>{o.value}</option>
        ))}
      </select>
      {value && (
        <p className="text-xs leading-relaxed" style={{ color: "var(--muted)" }}>
          {options.find((o) => o.value === value)?.description}
        </p>
      )}
    </div>
  );
}

export default function ScenePlannerPage() {
  const [config, setConfig] = useState<SceneConfig>(defaultConfig);

  const update = (field: keyof SceneConfig) => (value: string) =>
    setConfig((prev) => ({ ...prev, [field]: value }));

  const selectedCount = Object.values(config).filter(Boolean).length;

  const markdown = useMemo(() => {
    const sceneLabel = SCENE_TYPES.find((s) => s.id === config.type)?.label ?? config.type;
    const lines: string[] = [];
    lines.push(`## 씬: ${sceneLabel || "(미선택)"}`);
    lines.push("");
    lines.push("### 촬영");
    if (config.shotSize) lines.push(`- 샷 사이즈: ${config.shotSize}`);
    if (config.angle) lines.push(`- 앵글: ${config.angle}`);
    if (config.movement) lines.push(`- 무브먼트: ${config.movement}`);
    if (config.composition) lines.push(`- 구도: ${config.composition}`);
    if (config.lighting) lines.push(`- 조명: ${config.lighting}`);
    lines.push("");
    lines.push("### 사운드");
    if (config.bgm) lines.push(`- BGM: ${config.bgm}`);
    if (config.narration) lines.push(`- 나레이션: ${config.narration}`);
    if (config.ambience) lines.push(`- 앰비언스: ${config.ambience}`);
    lines.push("");
    lines.push("### 편집");
    if (config.transition) lines.push(`- 전환: ${config.transition}`);
    if (config.pacing) lines.push(`- 페이싱: ${config.pacing}`);
    lines.push("");
    lines.push("### 색보정");
    if (config.colorMood) lines.push(`- 무드: ${config.colorMood}`);
    if (config.lut) lines.push(`- LUT: ${config.lut}`);
    return lines.join("\n");
  }, [config]);

  const [copied, setCopied] = useState(false);
  const copyMarkdown = async () => {
    await navigator.clipboard.writeText(markdown);
    setCopied(true);
    setTimeout(() => setCopied(false), 2000);
  };

  return (
    <div className="space-y-8">
      <div>
        <h1 className="text-3xl font-bold mb-2">씬 플래너</h1>
        <p className="text-sm" style={{ color: "var(--muted)" }}>
          촬영, 사운드, 편집, 색보정 요소를 조합하여 씬을 구성하세요
        </p>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-5 gap-8">
        {/* 좌측: 선택기 (3/5) */}
        <div className="lg:col-span-3 space-y-6">
          {/* 씬 타입 */}
          <div>
            <h2 className="text-sm font-semibold mb-3">씬 타입</h2>
            <div className="grid grid-cols-5 gap-2">
              {SCENE_TYPES.map((s) => (
                <button
                  key={s.id}
                  onClick={() => update("type")(config.type === s.id ? "" : s.id)}
                  className="flex flex-col items-center gap-1 p-3 rounded-lg text-xs transition-all"
                  style={{
                    background: config.type === s.id ? "rgba(99,102,241,0.2)" : "var(--surface)",
                    border: `1px solid ${config.type === s.id ? "var(--accent)" : "var(--border)"}`,
                    color: config.type === s.id ? "var(--accent)" : "var(--muted)",
                  }}
                >
                  <span className="text-lg">{s.icon}</span>
                  <span>{s.label}</span>
                </button>
              ))}
            </div>
            {config.type && (
              <p className="text-xs mt-2" style={{ color: "var(--muted)" }}>
                {SCENE_TYPES.find((s) => s.id === config.type)?.desc}
              </p>
            )}
          </div>

          {/* 촬영 */}
          <div className="card p-4 space-y-4">
            <h3 className="text-sm font-semibold" style={{ color: "#6366f1" }}>🎬 촬영</h3>
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
              <SelectField label="샷 사이즈" value={config.shotSize} onChange={update("shotSize")} options={shotSizes} color="#6366f1" />
              <SelectField label="앵글" value={config.angle} onChange={update("angle")} options={angles} color="#6366f1" />
              <SelectField label="무브먼트" value={config.movement} onChange={update("movement")} options={movements} color="#6366f1" />
              <SelectField label="구도" value={config.composition} onChange={update("composition")} options={compositions} color="#6366f1" />
              <SelectField label="조명" value={config.lighting} onChange={update("lighting")} options={lightings} color="#6366f1" />
            </div>
          </div>

          {/* 사운드 */}
          <div className="card p-4 space-y-4">
            <h3 className="text-sm font-semibold" style={{ color: "#ec4899" }}>🔊 사운드</h3>
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
              <SelectField label="BGM 장르" value={config.bgm} onChange={update("bgm")} options={bgmGenres} color="#ec4899" />
              <SelectField label="나레이션 스타일" value={config.narration} onChange={update("narration")} options={narrationStyles} color="#ec4899" />
              <SelectField label="앰비언스" value={config.ambience} onChange={update("ambience")} options={ambiences} color="#ec4899" />
            </div>
          </div>

          {/* 편집 */}
          <div className="card p-4 space-y-4">
            <h3 className="text-sm font-semibold" style={{ color: "#06b6d4" }}>✂️ 편집</h3>
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
              <SelectField label="전환 효과" value={config.transition} onChange={update("transition")} options={transitions} color="#06b6d4" />
              <SelectField label="페이싱/리듬" value={config.pacing} onChange={update("pacing")} options={pacings} color="#06b6d4" />
            </div>
          </div>

          {/* 색보정 */}
          <div className="card p-4 space-y-4">
            <h3 className="text-sm font-semibold" style={{ color: "#f59e0b" }}>🎨 색보정</h3>
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
              <SelectField label="무드/감정" value={config.colorMood} onChange={update("colorMood")} options={colorMoods} color="#f59e0b" />
              <SelectField label="LUT 스타일" value={config.lut} onChange={update("lut")} options={luts} color="#f59e0b" />
            </div>
          </div>
        </div>

        {/* 우측: 프리뷰 (2/5) */}
        <div className="lg:col-span-2">
          <div className="sticky top-4 space-y-4">
            <div className="flex items-center justify-between">
              <h2 className="text-sm font-semibold" style={{ color: "var(--accent)" }}>
                씬 프리뷰
              </h2>
              <span className="text-xs" style={{ color: "var(--muted)" }}>
                {selectedCount}/13 선택됨
              </span>
            </div>

            <div className="card p-4 space-y-3">
              {selectedCount === 0 ? (
                <p className="text-xs text-center py-8" style={{ color: "var(--muted)" }}>
                  좌측에서 요소를 선택하면 프리뷰가 표시됩니다.
                </p>
              ) : (
                <>
                  {config.type && (
                    <div className="flex items-center gap-2 pb-2" style={{ borderBottom: "1px solid var(--border)" }}>
                      <span className="text-lg">{SCENE_TYPES.find((s) => s.id === config.type)?.icon}</span>
                      <span className="font-semibold text-sm">
                        {SCENE_TYPES.find((s) => s.id === config.type)?.label}
                      </span>
                    </div>
                  )}

                  {/* 촬영 요약 */}
                  {(config.shotSize || config.angle || config.movement || config.composition || config.lighting) && (
                    <div>
                      <p className="text-xs font-semibold mb-1" style={{ color: "#6366f1" }}>촬영</p>
                      <div className="flex flex-wrap gap-1">
                        {[config.shotSize, config.angle, config.movement, config.composition, config.lighting]
                          .filter(Boolean)
                          .map((v, i) => (
                            <span key={i} className="px-2 py-0.5 rounded text-xs" style={{ background: "rgba(99,102,241,0.15)", color: "#818cf8" }}>
                              {v}
                            </span>
                          ))}
                      </div>
                    </div>
                  )}

                  {/* 사운드 요약 */}
                  {(config.bgm || config.narration || config.ambience) && (
                    <div>
                      <p className="text-xs font-semibold mb-1" style={{ color: "#ec4899" }}>사운드</p>
                      <div className="flex flex-wrap gap-1">
                        {[config.bgm, config.narration, config.ambience]
                          .filter(Boolean)
                          .map((v, i) => (
                            <span key={i} className="px-2 py-0.5 rounded text-xs" style={{ background: "rgba(236,72,153,0.15)", color: "#f472b6" }}>
                              {v}
                            </span>
                          ))}
                      </div>
                    </div>
                  )}

                  {/* 편집 요약 */}
                  {(config.transition || config.pacing) && (
                    <div>
                      <p className="text-xs font-semibold mb-1" style={{ color: "#06b6d4" }}>편집</p>
                      <div className="flex flex-wrap gap-1">
                        {[config.transition, config.pacing]
                          .filter(Boolean)
                          .map((v, i) => (
                            <span key={i} className="px-2 py-0.5 rounded text-xs" style={{ background: "rgba(6,182,212,0.15)", color: "#22d3ee" }}>
                              {v}
                            </span>
                          ))}
                      </div>
                    </div>
                  )}

                  {/* 색보정 요약 */}
                  {(config.colorMood || config.lut) && (
                    <div>
                      <p className="text-xs font-semibold mb-1" style={{ color: "#f59e0b" }}>색보정</p>
                      <div className="flex flex-wrap gap-1">
                        {[config.colorMood, config.lut]
                          .filter(Boolean)
                          .map((v, i) => (
                            <span key={i} className="px-2 py-0.5 rounded text-xs" style={{ background: "rgba(245,158,11,0.15)", color: "#fbbf24" }}>
                              {v}
                            </span>
                          ))}
                      </div>
                    </div>
                  )}
                </>
              )}
            </div>

            {/* 마크다운 복사 */}
            {selectedCount > 0 && (
              <div className="space-y-2">
                <div
                  className="card p-3 text-xs font-mono leading-relaxed overflow-auto max-h-60"
                  style={{ color: "var(--muted)", whiteSpace: "pre-wrap" }}
                >
                  {markdown}
                </div>
                <button
                  onClick={copyMarkdown}
                  className="w-full py-2 rounded-lg text-xs font-medium transition-colors"
                  style={{
                    background: copied ? "rgba(34,197,94,0.2)" : "var(--accent)",
                    color: copied ? "#22c55e" : "white",
                    border: copied ? "1px solid #22c55e" : "none",
                  }}
                >
                  {copied ? "복사됨!" : "마크다운으로 복사"}
                </button>
                <button
                  onClick={() => setConfig(defaultConfig)}
                  className="w-full py-2 rounded-lg text-xs transition-colors"
                  style={{ background: "var(--surface)", border: "1px solid var(--border)", color: "var(--muted)" }}
                >
                  초기화
                </button>
              </div>
            )}
          </div>
        </div>
      </div>
    </div>
  );
}
