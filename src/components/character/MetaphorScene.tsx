/**
 * Reusable, animated visual metaphors. Each topic was classified into one of these
 * templates at parse time (topic.metaphor.templateId), seeded from its existing
 * "real-world example" text — so 423 topics reuse ~12 motifs at zero marginal cost.
 * Pure SVG + CSS (keyframes in globals.css); respects prefers-reduced-motion.
 */
const NODE = "#818cf8";
const NODE2 = "#6366f1";
const EDGE = "#475569";
const ACCENT = "#fbbf24";

function Motif({ id }: { id: string }) {
  switch (id) {
    case "kitchen":
      return (
        <g>
          {[60, 70, 80].map((x, i) => (
            <path
              key={i}
              className="tdd-steam"
              style={{ animationDelay: `${i * 0.5}s`, transformOrigin: `${x}px 40px` }}
              d={`M${x} 40 q-4 -6 0 -12`}
              stroke="#cbd5e1"
              strokeWidth="3"
              strokeLinecap="round"
              fill="none"
            />
          ))}
          <rect x="44" y="44" width="52" height="30" rx="6" fill={NODE2} />
          <rect x="40" y="40" width="60" height="8" rx="4" fill={NODE} />
          <rect x="64" y="32" width="12" height="6" rx="3" fill="#cbd5e1" />
          <circle cx="34" cy="58" r="6" fill="none" stroke={NODE} strokeWidth="4" />
          <circle cx="106" cy="58" r="6" fill="none" stroke={NODE} strokeWidth="4" />
        </g>
      );
    case "stack":
      return (
        <g>
          {[0, 1, 2, 3].map((i) => (
            <rect
              key={i}
              className="tdd-pop"
              style={{ animationDelay: `${(3 - i) * 0.18}s`, transformOrigin: "70px 70px" }}
              x={46}
              y={66 - i * 13}
              width={48}
              height={11}
              rx={3}
              fill={i === 3 ? ACCENT : NODE}
              opacity={i === 3 ? 1 : 0.85}
            />
          ))}
          <text x="70" y="92" textAnchor="middle" fill="#64748b" fontSize="9">push / pop ↑</text>
        </g>
      );
    case "queue":
      return (
        <g>
          <line x1="20" y1="64" x2="120" y2="64" stroke={EDGE} strokeWidth="2" strokeDasharray="4 4" />
          {[0, 1, 2].map((i) => (
            <circle
              key={i}
              className="tdd-flow"
              style={{ animationDelay: `${i * 0.7}s`, ["--tdd-flow" as string]: "80px" }}
              cx={30}
              cy={56}
              r={8}
              fill={NODE}
            />
          ))}
          <rect x="112" y="44" width="6" height="28" rx="2" fill={ACCENT} />
        </g>
      );
    case "lock":
      return (
        <g>
          <path d="M52 50 v-8 a18 18 0 0 1 36 0 v8" fill="none" stroke={NODE} strokeWidth="6" />
          <rect x="44" y="50" width="52" height="36" rx="6" fill={NODE2} />
          <circle cx="70" cy="66" r="5" fill="#0b0f1a" />
          <rect x="68" y="66" width="4" height="10" fill="#0b0f1a" />
          <g className="tdd-turn">
            <circle cx="104" cy="80" r="6" fill="none" stroke={ACCENT} strokeWidth="3" />
            <line x1="104" y1="80" x2="92" y2="80" stroke={ACCENT} strokeWidth="3" />
          </g>
        </g>
      );
    case "tree":
      return (
        <g>
          <line x1="70" y1="34" x2="46" y2="58" stroke={EDGE} strokeWidth="2" />
          <line x1="70" y1="34" x2="94" y2="58" stroke={EDGE} strokeWidth="2" />
          <line x1="46" y1="58" x2="34" y2="82" stroke={EDGE} strokeWidth="2" />
          <line x1="46" y1="58" x2="58" y2="82" stroke={EDGE} strokeWidth="2" />
          <line x1="94" y1="58" x2="106" y2="82" stroke={EDGE} strokeWidth="2" />
          {[
            [70, 34, 0],
            [46, 58, 0.15],
            [94, 58, 0.3],
            [34, 82, 0.45],
            [58, 82, 0.6],
            [106, 82, 0.75],
          ].map(([x, y, d], i) => (
            <circle
              key={i}
              className="tdd-pop"
              style={{ animationDelay: `${d}s`, transformOrigin: `${x}px ${y}px` }}
              cx={x}
              cy={y}
              r={i === 0 ? 9 : 7}
              fill={i === 0 ? ACCENT : NODE}
            />
          ))}
        </g>
      );
    case "network":
      return (
        <g>
          <line x1="34" y1="40" x2="100" y2="44" stroke={EDGE} strokeWidth="2" />
          <line x1="34" y1="40" x2="60" y2="84" stroke={EDGE} strokeWidth="2" />
          <line x1="100" y1="44" x2="60" y2="84" stroke={EDGE} strokeWidth="2" />
          <circle cx="34" cy="40" r="9" fill={NODE} />
          <circle cx="100" cy="44" r="9" fill={NODE} />
          <circle cx="60" cy="84" r="9" fill={NODE2} />
          <circle
            className="tdd-flow"
            style={{ ["--tdd-flow" as string]: "66px" }}
            cx={34}
            cy={40}
            r={4}
            fill={ACCENT}
          />
        </g>
      );
    case "pipeline":
      return (
        <g>
          <rect x="20" y="52" width="100" height="18" rx="9" fill="none" stroke={EDGE} strokeWidth="3" />
          {[0, 1, 2, 3].map((i) => (
            <circle
              key={i}
              className="tdd-flow"
              style={{ animationDelay: `${i * 0.5}s`, ["--tdd-flow" as string]: "86px" }}
              cx={28}
              cy={61}
              r={5}
              fill={i % 2 ? ACCENT : NODE}
            />
          ))}
        </g>
      );
    case "container":
      return (
        <g>
          <rect x="42" y="46" width="56" height="40" rx="4" fill={NODE2} />
          <rect x="38" y="40" width="64" height="10" rx="3" fill={NODE} />
          {[
            [54, 62],
            [70, 62],
            [86, 62],
            [62, 74],
            [78, 74],
          ].map(([x, y], i) => (
            <rect
              key={i}
              className="tdd-pop"
              style={{ animationDelay: `${i * 0.12}s`, transformOrigin: `${x}px ${y}px` }}
              x={x - 5}
              y={y - 5}
              width={10}
              height={10}
              rx={2}
              fill="#c7d2fe"
            />
          ))}
        </g>
      );
    case "library":
      return (
        <g>
          {[
            [44, 18, NODE],
            [54, 26, NODE2],
            [64, 14, ACCENT],
            [74, 22, NODE],
            [84, 28, NODE2],
          ].map(([x, h, c], i) => (
            <rect
              key={i}
              className={i === 2 ? "tdd-float" : ""}
              x={x as number}
              y={76 - (h as number)}
              width={8}
              height={h as number}
              rx={1.5}
              fill={c as string}
            />
          ))}
          <rect x="38" y="78" width="60" height="5" rx="2" fill={EDGE} />
        </g>
      );
    case "map":
      return (
        <g>
          <rect x="34" y="40" width="72" height="44" rx="6" fill="#1e293b" stroke={EDGE} strokeWidth="2" />
          <path d="M40 60 H100 M70 44 V80" stroke={EDGE} strokeWidth="1.5" strokeDasharray="3 3" />
          <g className="tdd-float" style={{ transformOrigin: "70px 58px" }}>
            <path d="M70 46 a8 8 0 0 1 8 8 c0 6 -8 14 -8 14 c0 0 -8 -8 -8 -14 a8 8 0 0 1 8 -8 Z" fill={ACCENT} />
            <circle cx="70" cy="54" r="3" fill="#0b0f1a" />
          </g>
        </g>
      );
    case "blueprint":
      return (
        <g>
          <rect x="34" y="34" width="72" height="56" rx="4" fill="#0f172a" stroke={NODE2} strokeWidth="1.5" />
          <path d="M34 50 H106 M34 66 H106 M52 34 V90 M70 34 V90 M88 34 V90" stroke={EDGE} strokeWidth="0.8" />
          <g className="tdd-spin-slow" style={{ transformOrigin: "70px 62px" }}>
            <circle cx="70" cy="62" r="12" fill="none" stroke={ACCENT} strokeWidth="3" />
            {[0, 60, 120, 180, 240, 300].map((a) => (
              <rect key={a} x="68" y="46" width="4" height="6" fill={ACCENT} transform={`rotate(${a} 70 62)`} />
            ))}
          </g>
        </g>
      );
    default:
      return (
        <g>
          <g className="tdd-float" style={{ transformOrigin: "70px 56px" }}>
            <circle cx="70" cy="56" r="16" fill={NODE} />
            <circle cx="70" cy="56" r="16" fill="none" stroke={ACCENT} strokeWidth="2" opacity="0.8" />
            <path d="M64 56 q6 -10 12 0" stroke="#fff" strokeWidth="2.5" fill="none" strokeLinecap="round" />
            <rect x="64" y="72" width="12" height="5" rx="2" fill={NODE2} />
          </g>
          {[
            [40, 36],
            [100, 40],
            [44, 78],
          ].map(([x, y], i) => (
            <circle key={i} className="tdd-sparkle" style={{ animationDelay: `${i * 0.4}s`, transformOrigin: `${x}px ${y}px` }} cx={x} cy={y} r={3} fill={ACCENT} />
          ))}
        </g>
      );
  }
}

export function MetaphorScene({
  templateId,
  className = "",
}: {
  templateId: string;
  className?: string;
}) {
  return (
    <svg viewBox="0 0 140 100" className={className} role="img" aria-label={`${templateId} metaphor`}>
      <Motif id={templateId} />
    </svg>
  );
}
