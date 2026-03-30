"use client";

export interface SceneSelections {
  sceneType: string;
  shotSize: string;
  angle: string;
  movement: string;
  composition: string;
  lighting: string;
  bgm: string;
  sfx: string;
  narration: string;
  ambience: string;
  transition: string;
  pacing: string;
  timeExpression: string;
  colorMood: string;
  lut: string;
}

const SCENE_TYPES = ["인트로", "본론", "클라이맥스", "전환", "아웃트로"];

const SHOT_SIZES = [
  { id: "ECU", label: "ECU", desc: "익스트림 클로즈업" },
  { id: "CU", label: "CU", desc: "클로즈업" },
  { id: "MS", label: "MS", desc: "미디엄샷" },
  { id: "MLS", label: "MLS", desc: "미디엄롱샷" },
  { id: "LS", label: "LS", desc: "롱샷" },
  { id: "ELS", label: "ELS", desc: "익스트림 롱샷" },
];

const ANGLES = [
  { id: "low", label: "로우앵글", desc: "아이레벨 아래" },
  { id: "high", label: "하이앵글", desc: "아이레벨 위" },
  { id: "eye", label: "아이레벨", desc: "중립 시점" },
  { id: "dutch", label: "더치앵글", desc: "기울기" },
  { id: "birds", label: "버즈아이", desc: "정수리 위" },
  { id: "worms", label: "웜즈아이", desc: "바닥" },
];

const MOVEMENTS = [
  { id: "handheld", label: "핸드헬드", desc: "흔들림, 현장감" },
  { id: "dolly", label: "달리", desc: "트래킹, 서사" },
  { id: "pullback", label: "풀백", desc: "멀어짐, 분리감" },
  { id: "pushin", label: "푸쉬인", desc: "접근, 집중" },
  { id: "pan", label: "팬/틸트", desc: "속도감, 에너지" },
  { id: "timelapse", label: "타임랩스", desc: "시간 경과" },
  { id: "crane", label: "크레인", desc: "공간감, 조감" },
];

const COMPOSITIONS = [
  { id: "center", label: "중앙 구도", desc: "대칭, 권위" },
  { id: "thirds", label: "3분할", desc: "자연스러운 흐름" },
  { id: "headroom", label: "헤드룸/리드룸", desc: "진행 방향 암시" },
  { id: "frameinframe", label: "프레임인프레임", desc: "이중 액자" },
  { id: "diagonal", label: "대각선", desc: "원근, 깊이감" },
];

const LIGHTINGS = [
  { id: "highkey", label: "하이키", desc: "밝고 균일" },
  { id: "lowkey", label: "로우키", desc: "강한 그림자" },
  { id: "golden", label: "골든아워", desc: "황금빛 사이드라이트" },
  { id: "blue", label: "블루아워", desc: "파란 계열 쿨톤" },
  { id: "natural", label: "자연광", desc: "혼합, 현실감" },
  { id: "backlight", label: "역광", desc: "윤곽 강조, 신비감" },
];

const BGMS = [
  { id: "acoustic", label: "어쿠스틱팝", desc: "통기타, 피아노" },
  { id: "upbeat", label: "업비트팝", desc: "신디사이저, 드럼" },
  { id: "orchestra", label: "오케스트라", desc: "현악기, 금관" },
  { id: "piano", label: "미니멀피아노", desc: "피아노 솔로, 첼로" },
  { id: "darkambient", label: "다크앰비언트", desc: "저주파, 드론" },
  { id: "fullscore", label: "오케스트라풀", desc: "풀 오케스트라, 합창" },
  { id: "jazz", label: "재즈/팝", desc: "관악기, 밝은 피아노" },
  { id: "lofi", label: "Lo-fi", desc: "잔잔한 비트, 루프" },
  { id: "latin", label: "라틴/월드", desc: "어쿠스틱, 퍼커션" },
  { id: "edm", label: "EDM/클럽", desc: "강한 베이스 드롭" },
];

const SFXS = [
  { id: "indoor", label: "실내", desc: "냉장고, 시계 소리" },
  { id: "cafe", label: "카페", desc: "커피머신, 잔잔한 대화" },
  { id: "nature", label: "야외자연", desc: "새, 바람, 파도" },
  { id: "city", label: "도시", desc: "차량, 사람, 소음" },
  { id: "empty", label: "빈공간", desc: "잔향, 에코" },
];

const NARRATIONS = [
  { id: "edu", label: "교육형", desc: "명확하고 친절한 설명" },
  { id: "dialog", label: "대화형", desc: "자연스럽고 친근한" },
  { id: "ad", label: "광고형", desc: "설득력 있고 임팩트" },
  { id: "authority", label: "권위형", desc: "무게감, 전문성" },
  { id: "child", label: "밝고 경쾌", desc: "유쾌하고 에너지" },
  { id: "none", label: "없음", desc: "나레이션 없음" },
];

const TRANSITIONS = [
  { id: "straight", label: "스트레이트컷", desc: "자연스러운 연결" },
  { id: "jump", label: "점프컷", desc: "시간 생략" },
  { id: "dissolve", label: "디졸브", desc: "부드러운 흐름" },
  { id: "match", label: "매치컷", desc: "형태 일치 연결" },
  { id: "smash", label: "스매시컷", desc: "충격, 반전" },
  { id: "wipe", label: "와이프", desc: "공간 이동감" },
  { id: "black", label: "페이드투블랙", desc: "단락 종료" },
  { id: "fast", label: "패스트컷", desc: "빠른 몽타주" },
  { id: "split", label: "스플릿스크린", desc: "동시 진행" },
  { id: "overlay", label: "오버랩", desc: "이중 노출" },
];

const PACINGS = [
  { id: "0.5-2", label: "0.5~2초", desc: "긴장, 추격" },
  { id: "1-3", label: "1~3초", desc: "에너지, 역동" },
  { id: "3-5", label: "3~5초", desc: "편안, 자연스러움" },
  { id: "5-10", label: "5~10초", desc: "관조, 여유" },
  { id: "10+", label: "10초+", desc: "서사, 몰입" },
  { id: "variable", label: "가변", desc: "감정 흐름 따라" },
];

const TIME_EXPRESSIONS = [
  { id: "jump", label: "점프컷", desc: "짧은 시간 생략" },
  { id: "timelapse", label: "타임랩스", desc: "긴 시간 경과" },
  { id: "montage", label: "몽타주", desc: "시간 압축" },
  { id: "matchdissolve", label: "매치컷+디졸브", desc: "감성적 전환" },
  { id: "flashback", label: "플래시백", desc: "과거 회상" },
];

const COLOR_MOODS = [
  { id: "warm", label: "따뜻한", color: "#f59e0b" },
  { id: "cool", label: "차가운", color: "#06b6d4" },
  { id: "tension", label: "긴장", color: "#ef4444" },
  { id: "nostalgia", label: "노스탤지어", color: "#a78bfa" },
  { id: "fantasy", label: "판타지", color: "#ec4899" },
  { id: "natural", label: "자연", color: "#10b981" },
  { id: "luxury", label: "럭셔리", color: "#d4af37" },
  { id: "energy", label: "에너지", color: "#f97316" },
];

const LUTS = [
  { id: "film", label: "필름에뮬레이션", desc: "필름 입자감" },
  { id: "technical", label: "테크니컬", desc: "정확한 색보정" },
  { id: "faded", label: "페이디드", desc: "바랜 톤" },
  { id: "teal-orange", label: "틸앤오렌지", desc: "영화적 대비" },
  { id: "bw", label: "흑백", desc: "흑백 처리" },
  { id: "japanese", label: "일본필름", desc: "부드러운 감성" },
];

interface TechniqueSelectorProps {
  selections: SceneSelections;
  onChange: (key: keyof SceneSelections, value: string) => void;
}

function SelectGroup<T extends { id: string; label: string; desc: string }>({
  title,
  items,
  selected,
  onSelect,
  color,
}: {
  title: string;
  items: T[];
  selected: string;
  onSelect: (id: string) => void;
  color: string;
}) {
  return (
    <div>
      <h4 className="text-xs font-semibold mb-2" style={{ color }}>
        {title}
      </h4>
      <div className="flex flex-wrap gap-1.5">
        {items.map((item) => {
          const isSelected = selected === item.id;
          return (
            <button
              key={item.id}
              onClick={() => onSelect(isSelected ? "" : item.id)}
              title={item.desc}
              className="px-2 py-1 rounded text-xs transition-all"
              style={{
                background: isSelected ? `${color}22` : "var(--surface-hover)",
                color: isSelected ? color : "var(--muted)",
                border: `1px solid ${isSelected ? color : "var(--border)"}`,
              }}
            >
              {item.label}
            </button>
          );
        })}
      </div>
      {selected && (
        <p className="text-xs mt-1 pl-0.5" style={{ color: "var(--muted)" }}>
          {items.find((i) => i.id === selected)?.desc}
        </p>
      )}
    </div>
  );
}

export default function TechniqueSelector({
  selections,
  onChange,
}: TechniqueSelectorProps) {
  return (
    <div className="space-y-6">
      {/* 씬 타입 */}
      <div>
        <h3 className="text-sm font-semibold mb-3" style={{ color: "var(--foreground)" }}>
          씬 타입
        </h3>
        <div className="flex flex-wrap gap-2">
          {SCENE_TYPES.map((type) => {
            const isSelected = selections.sceneType === type;
            return (
              <button
                key={type}
                onClick={() => onChange("sceneType", isSelected ? "" : type)}
                className="px-4 py-2 rounded-lg text-sm font-medium transition-all"
                style={{
                  background: isSelected ? "var(--accent)" : "var(--surface-hover)",
                  color: isSelected ? "white" : "var(--muted)",
                  border: `1px solid ${isSelected ? "var(--accent)" : "var(--border)"}`,
                }}
              >
                {type}
              </button>
            );
          })}
        </div>
      </div>

      {/* 촬영 */}
      <div className="card p-4 space-y-4">
        <h3 className="text-sm font-semibold" style={{ color: "#6366f1" }}>
          촬영 (Cinematography)
        </h3>
        <SelectGroup
          title="샷 사이즈"
          items={SHOT_SIZES}
          selected={selections.shotSize}
          onSelect={(v) => onChange("shotSize", v)}
          color="#6366f1"
        />
        <SelectGroup
          title="앵글"
          items={ANGLES}
          selected={selections.angle}
          onSelect={(v) => onChange("angle", v)}
          color="#6366f1"
        />
        <SelectGroup
          title="무브먼트"
          items={MOVEMENTS}
          selected={selections.movement}
          onSelect={(v) => onChange("movement", v)}
          color="#6366f1"
        />
        <SelectGroup
          title="구도"
          items={COMPOSITIONS}
          selected={selections.composition}
          onSelect={(v) => onChange("composition", v)}
          color="#6366f1"
        />
        <SelectGroup
          title="조명"
          items={LIGHTINGS}
          selected={selections.lighting}
          onSelect={(v) => onChange("lighting", v)}
          color="#6366f1"
        />
      </div>

      {/* 사운드 */}
      <div className="card p-4 space-y-4">
        <h3 className="text-sm font-semibold" style={{ color: "#ec4899" }}>
          사운드 (Sound Design)
        </h3>
        <SelectGroup
          title="BGM 장르"
          items={BGMS}
          selected={selections.bgm}
          onSelect={(v) => onChange("bgm", v)}
          color="#ec4899"
        />
        <SelectGroup
          title="SFX / 앰비언스"
          items={SFXS}
          selected={selections.sfx}
          onSelect={(v) => onChange("sfx", v)}
          color="#ec4899"
        />
        <SelectGroup
          title="나레이션"
          items={NARRATIONS}
          selected={selections.narration}
          onSelect={(v) => onChange("narration", v)}
          color="#ec4899"
        />
      </div>

      {/* 편집 */}
      <div className="card p-4 space-y-4">
        <h3 className="text-sm font-semibold" style={{ color: "#06b6d4" }}>
          편집 (Editing)
        </h3>
        <SelectGroup
          title="전환"
          items={TRANSITIONS}
          selected={selections.transition}
          onSelect={(v) => onChange("transition", v)}
          color="#06b6d4"
        />
        <SelectGroup
          title="페이싱"
          items={PACINGS}
          selected={selections.pacing}
          onSelect={(v) => onChange("pacing", v)}
          color="#06b6d4"
        />
        <SelectGroup
          title="시간 표현"
          items={TIME_EXPRESSIONS}
          selected={selections.timeExpression}
          onSelect={(v) => onChange("timeExpression", v)}
          color="#06b6d4"
        />
      </div>

      {/* 색보정 */}
      <div className="card p-4 space-y-4">
        <h3 className="text-sm font-semibold" style={{ color: "#f59e0b" }}>
          색보정 (Color Grading)
        </h3>
        <div>
          <h4 className="text-xs font-semibold mb-2" style={{ color: "#f59e0b" }}>
            무드
          </h4>
          <div className="flex flex-wrap gap-1.5">
            {COLOR_MOODS.map((m) => {
              const isSelected = selections.colorMood === m.id;
              return (
                <button
                  key={m.id}
                  onClick={() => onChange("colorMood", isSelected ? "" : m.id)}
                  className="px-2 py-1 rounded text-xs transition-all flex items-center gap-1.5"
                  style={{
                    background: isSelected ? `${m.color}22` : "var(--surface-hover)",
                    color: isSelected ? m.color : "var(--muted)",
                    border: `1px solid ${isSelected ? m.color : "var(--border)"}`,
                  }}
                >
                  <span
                    className="w-2 h-2 rounded-full"
                    style={{ background: m.color }}
                  />
                  {m.label}
                </button>
              );
            })}
          </div>
        </div>
        <SelectGroup
          title="LUT"
          items={LUTS}
          selected={selections.lut}
          onSelect={(v) => onChange("lut", v)}
          color="#f59e0b"
        />
      </div>
    </div>
  );
}
