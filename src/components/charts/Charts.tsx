/** Dependency-free dashboard charts (SVG/CSS), server-renderable. */

export function ProgressRing({
  value,
  size = 84,
  stroke = 8,
  label,
  sublabel,
  color = "#818cf8",
}: {
  value: number; // 0..100
  size?: number;
  stroke?: number;
  label?: string;
  sublabel?: string;
  color?: string;
}) {
  const r = (size - stroke) / 2;
  const c = 2 * Math.PI * r;
  const dash = (clamp(value) / 100) * c;
  return (
    <div className="flex flex-col items-center">
      <svg width={size} height={size} className="-rotate-90">
        <circle cx={size / 2} cy={size / 2} r={r} fill="none" stroke="#1e293b" strokeWidth={stroke} />
        <circle
          cx={size / 2}
          cy={size / 2}
          r={r}
          fill="none"
          stroke={color}
          strokeWidth={stroke}
          strokeLinecap="round"
          strokeDasharray={`${dash} ${c - dash}`}
        />
        <text
          x="50%"
          y="50%"
          dominantBaseline="central"
          textAnchor="middle"
          className="rotate-90"
          style={{ transformOrigin: "center" }}
          fill="#e2e8f0"
          fontSize={size * 0.22}
          fontWeight="700"
        >
          {Math.round(clamp(value))}
        </text>
      </svg>
      {label && <span className="mt-1.5 text-xs font-medium text-slate-300">{label}</span>}
      {sublabel && <span className="text-[11px] text-slate-500">{sublabel}</span>}
    </div>
  );
}

export function StatCard({
  label,
  value,
  hint,
}: {
  label: string;
  value: string | number;
  hint?: string;
}) {
  return (
    <div className="rounded-xl border border-white/10 bg-slate-900/40 p-4">
      <div className="text-xs uppercase tracking-wide text-slate-500">{label}</div>
      <div className="mt-1 text-2xl font-bold text-white">{value}</div>
      {hint && <div className="text-xs text-slate-500">{hint}</div>}
    </div>
  );
}

export function Heatmap({ data }: { data: { day: string; count: number }[] }) {
  const level = (n: number) =>
    n === 0 ? "bg-slate-800/60" : n < 2 ? "bg-emerald-900" : n < 4 ? "bg-emerald-700" : n < 7 ? "bg-emerald-500" : "bg-emerald-400";
  // 12 columns (weeks) × 7 rows (days)
  const weeks: { day: string; count: number }[][] = [];
  for (let i = 0; i < data.length; i += 7) weeks.push(data.slice(i, i + 7));
  return (
    <div className="flex gap-1 overflow-x-auto">
      {weeks.map((w, i) => (
        <div key={i} className="flex flex-col gap-1">
          {w.map((d) => (
            <div
              key={d.day}
              title={`${d.day}: ${d.count}`}
              className={`h-3 w-3 rounded-sm ${level(d.count)}`}
            />
          ))}
        </div>
      ))}
    </div>
  );
}

export function BarList({
  items,
}: {
  items: { label: string; value: number; max: number; sub?: string; href?: string }[];
}) {
  return (
    <ul className="space-y-2">
      {items.map((it, i) => (
        <li key={i}>
          <div className="flex items-baseline justify-between text-sm">
            <span className="truncate text-slate-300">{it.label}</span>
            <span className="ml-2 shrink-0 text-slate-400">{it.sub ?? it.value}</span>
          </div>
          <div className="mt-1 h-2 overflow-hidden rounded-full bg-slate-800">
            <div
              className="h-full rounded-full bg-gradient-to-r from-brand-500 to-brand-400"
              style={{ width: `${it.max ? Math.round((it.value / it.max) * 100) : 0}%` }}
            />
          </div>
        </li>
      ))}
    </ul>
  );
}

function clamp(n: number): number {
  return Math.max(0, Math.min(100, n));
}
