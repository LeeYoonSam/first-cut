"use client";

const GENRES = [
  { id: "tv-ad", label: "TV 광고" },
  { id: "digital-ad", label: "디지털 광고" },
  { id: "brand-film", label: "브랜드 필름" },
  { id: "documentary", label: "다큐멘터리" },
  { id: "music-video", label: "뮤직비디오" },
  { id: "youtube", label: "유튜브" },
  { id: "reels", label: "인스타 릴스" },
  { id: "wedding", label: "웨딩" },
  { id: "corporate", label: "기업 홍보" },
  { id: "event", label: "이벤트" },
  { id: "product", label: "제품" },
  { id: "travel", label: "여행" },
];

interface GenreSelectorProps {
  selected: string | null;
  onSelect: (id: string) => void;
}

export default function GenreSelector({ selected, onSelect }: GenreSelectorProps) {
  return (
    <div>
      <h3 className="text-sm font-semibold mb-3" style={{ color: "var(--foreground)" }}>
        장르 선택
      </h3>
      <div className="grid grid-cols-3 gap-2">
        {GENRES.map((genre) => {
          const isSelected = selected === genre.id;
          return (
            <button
              key={genre.id}
              onClick={() => onSelect(genre.id)}
              className="px-2 py-2 rounded-lg text-xs font-medium transition-all text-center"
              style={{
                background: isSelected ? "var(--accent)" : "var(--surface-hover)",
                color: isSelected ? "white" : "var(--muted)",
                border: `1px solid ${isSelected ? "var(--accent)" : "var(--border)"}`,
                boxShadow: isSelected ? "0 0 0 2px rgba(99,102,241,0.3)" : "none",
              }}
            >
              {genre.label}
            </button>
          );
        })}
      </div>
    </div>
  );
}

export { GENRES };
