/**
 * Pixel — the reusable learner mascot, drawn as an animated SVG so it needs no
 * binary assets and scales to every topic at zero marginal cost. Mood is a prop;
 * the same component powers the topic hero, playground reactions, and
 * celebrations. (A second character can be added by swapping the palette.)
 */
export type Mood =
  | "idle"
  | "waving"
  | "explaining"
  | "thinking"
  | "celebrating"
  | "error"
  | "pointing";

const MOUTHS: Record<Mood, string> = {
  idle: "M46 70 Q60 82 74 70",
  waving: "M46 70 Q60 82 74 70",
  explaining: "M50 70 Q60 84 70 70",
  pointing: "M48 70 Q60 80 72 70",
  thinking: "M52 74 H68",
  celebrating: "M44 68 Q60 92 76 68",
  error: "M46 78 q5 -8 10 0 q5 8 10 0",
};

export function Mascot({
  mood = "idle",
  size = 96,
  className = "",
}: {
  mood?: Mood;
  size?: number;
  className?: string;
}) {
  const bodyAnim =
    mood === "celebrating"
      ? "tdd-celebrate"
      : mood === "error"
        ? "tdd-shake"
        : "tdd-bob";
  const lookUp = mood === "thinking";
  const smallEyes = mood === "error";

  return (
    <svg
      width={size}
      height={size}
      viewBox="0 0 120 120"
      fill="none"
      className={className}
      role="img"
      aria-label={`Mascot, ${mood}`}
    >
      <defs>
        <linearGradient id="tdd-body" x1="0" y1="0" x2="0" y2="1">
          <stop offset="0" stopColor="#a5b4fc" />
          <stop offset="1" stopColor="#6366f1" />
        </linearGradient>
      </defs>

      {/* celebration sparkles */}
      {mood === "celebrating" && (
        <g>
          {[
            [22, 30],
            [98, 36],
            [30, 86],
            [92, 80],
          ].map(([x, y], i) => (
            <path
              key={i}
              className="tdd-sparkle"
              style={{ animationDelay: `${i * 0.2}s`, transformOrigin: `${x}px ${y}px` }}
              d={`M${x} ${y - 6} L${x + 1.5} ${y - 1.5} L${x + 6} ${y} L${x + 1.5} ${y + 1.5} L${x} ${y + 6} L${x - 1.5} ${y + 1.5} L${x - 6} ${y} L${x - 1.5} ${y - 1.5} Z`}
              fill="#fde68a"
            />
          ))}
        </g>
      )}

      <g className={bodyAnim} style={{ transformOrigin: "60px 70px", transformBox: "fill-box" }}>
        {/* antenna */}
        <line x1="60" y1="22" x2="60" y2="34" stroke="#818cf8" strokeWidth="3" strokeLinecap="round" />
        <circle
          cx="60"
          cy="18"
          r="5"
          fill="#c7d2fe"
          className={mood === "thinking" ? "tdd-sparkle" : ""}
          style={{ transformOrigin: "60px 18px" }}
        />

        {/* body */}
        <rect x="28" y="34" width="64" height="60" rx="22" fill="url(#tdd-body)" />
        <rect x="36" y="44" width="48" height="38" rx="16" fill="#0b0f1a" opacity="0.55" />

        {/* eyes */}
        {smallEyes ? (
          <>
            <path d="M46 58 l8 6" stroke="#e0e7ff" strokeWidth="3" strokeLinecap="round" />
            <path d="M74 58 l-8 6" stroke="#e0e7ff" strokeWidth="3" strokeLinecap="round" />
          </>
        ) : (
          <g className="tdd-blink" style={{ transformOrigin: "60px 58px" }}>
            <circle cx="50" cy={lookUp ? 56 : 58} r="5.5" fill="#e0e7ff" />
            <circle cx="70" cy={lookUp ? 56 : 58} r="5.5" fill="#e0e7ff" />
            <circle cx={lookUp ? 49 : 51} cy={lookUp ? 54 : 59} r="2.2" fill="#1e1b4b" />
            <circle cx={lookUp ? 69 : 71} cy={lookUp ? 54 : 59} r="2.2" fill="#1e1b4b" />
          </g>
        )}

        {/* mouth */}
        <path
          d={MOUTHS[mood]}
          stroke="#e0e7ff"
          strokeWidth="3"
          strokeLinecap="round"
          fill={mood === "celebrating" ? "#312e81" : "none"}
        />

        {/* arm — waves, or points */}
        {mood === "waving" && (
          <g className="tdd-wave" style={{ transformOrigin: "92px 70px", transformBox: "fill-box" }}>
            <line x1="92" y1="66" x2="104" y2="54" stroke="#6366f1" strokeWidth="5" strokeLinecap="round" />
            <circle cx="106" cy="51" r="5" fill="#a5b4fc" />
          </g>
        )}
        {(mood === "pointing" || mood === "explaining") && (
          <g>
            <line x1="90" y1="70" x2="106" y2="74" stroke="#6366f1" strokeWidth="5" strokeLinecap="round" />
            <circle cx="108" cy="74" r="5" fill="#a5b4fc" />
          </g>
        )}
        {mood === "celebrating" && (
          <>
            <line x1="30" y1="56" x2="18" y2="42" stroke="#6366f1" strokeWidth="5" strokeLinecap="round" />
            <line x1="90" y1="56" x2="102" y2="42" stroke="#6366f1" strokeWidth="5" strokeLinecap="round" />
          </>
        )}

        {/* feet */}
        <rect x="42" y="92" width="12" height="8" rx="4" fill="#4f46e5" />
        <rect x="66" y="92" width="12" height="8" rx="4" fill="#4f46e5" />
      </g>
    </svg>
  );
}
