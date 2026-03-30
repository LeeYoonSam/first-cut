"use client";

const MOODS = [
  { id: "warm", label: "따뜻한", english: "Warm", color: "#f59e0b" },
  { id: "cool", label: "차가운", english: "Cool", color: "#06b6d4" },
  { id: "tension", label: "긴장감", english: "Tension", color: "#ef4444" },
  { id: "nostalgia", label: "노스탤지어", english: "Nostalgia", color: "#a78bfa" },
  { id: "fantasy", label: "판타지", english: "Fantasy", color: "#ec4899" },
  { id: "natural", label: "자연스러운", english: "Natural", color: "#10b981" },
  { id: "luxury", label: "럭셔리", english: "Luxury", color: "#d4af37" },
  { id: "energy", label: "에너지", english: "Energy", color: "#f97316" },
];

interface MoodSelectorProps {
  selected: string | null;
  onSelect: (id: string) => void;
}

export default function MoodSelector({ selected, onSelect }: MoodSelectorProps) {
  return (
    <div>
      <h3 className="text-sm font-semibold mb-3" style={{ color: "var(--foreground)" }}>
        분위기 선택
      </h3>
      <div className="grid grid-cols-2 gap-2">
        {MOODS.map((mood) => {
          const isSelected = selected === mood.id;
          return (
            <button
              key={mood.id}
              onClick={() => onSelect(mood.id)}
              className="px-3 py-2 rounded-lg text-xs font-medium transition-all flex items-center gap-2"
              style={{
                background: isSelected ? `${mood.color}22` : "var(--surface-hover)",
                color: isSelected ? mood.color : "var(--muted)",
                border: `1px solid ${isSelected ? mood.color : "var(--border)"}`,
                boxShadow: isSelected ? `0 0 0 2px ${mood.color}44` : "none",
              }}
            >
              <span
                className="w-2.5 h-2.5 rounded-full shrink-0"
                style={{ background: mood.color }}
              />
              <span className="leading-tight">
                {mood.label}
                <span className="block text-xs opacity-60">{mood.english}</span>
              </span>
            </button>
          );
        })}
      </div>
    </div>
  );
}

export { MOODS };
