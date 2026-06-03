/**
 * Concept visualizers — animations that show the MECHANICS of a concept (not a
 * generic metaphor): the call stack pushing/popping frames, a closure retaining
 * a variable, the event loop draining queues, scope-chain lookup, promise state
 * transitions, references, array transforms, recursion, sync-vs-async. Topics are
 * routed here by slug/title keywords; everything else falls back to the metaphor
 * scene. Pure SVG + CSS (keyframes in globals.css), respects reduced-motion.
 */
import type { JSX } from "react";
import { PIPELINES, isBespoke } from "./concepts";

const NODE = "#818cf8";
const NODE2 = "#6366f1";
const ACCENT = "#fbbf24";
const EDGE = "#475569";
const GOOD = "#34d399";
const BAD = "#fb7185";
const TXT = "#cbd5e1";
const MUTE = "#64748b";
const MONO = "ui-monospace, monospace";

function frame(label: string, y: number, delay: number, color: string) {
  return (
    <g
      key={label}
      className="tdd-frame"
      style={{ animationDelay: `${delay}s`, transformOrigin: `180px ${y + 24}px`, transformBox: "fill-box" }}
    >
      <rect x={120} y={y} width={120} height={26} rx={5} fill={color} opacity={0.92} />
      <text x={180} y={y + 17} textAnchor="middle" fill="#0b0f1a" fontSize={12} fontFamily={MONO} fontWeight={600}>
        {label}
      </text>
    </g>
  );
}

function CallStack() {
  return (
    <svg viewBox="0 0 320 170" className="h-full w-full">
      <text x={20} y={24} fill={MUTE} fontSize={12}>Call Stack</text>
      <rect x={108} y={34} width={144} height={120} rx={8} fill="none" stroke={EDGE} strokeDasharray="4 4" />
      {frame("global()", 124, 0, NODE2)}
      {frame("greet()", 94, 0.55, NODE)}
      {frame("inner()", 64, 1.1, ACCENT)}
      <text x={180} y={168} textAnchor="middle" fill={MUTE} fontSize={10}>push on call · pop on return (LIFO)</text>
    </svg>
  );
}

function Closure() {
  return (
    <svg viewBox="0 0 320 170" className="h-full w-full">
      <text x={20} y={20} fill={MUTE} fontSize={12}>Closure</text>
      <g className="tdd-stateA">
        <rect x={28} y={32} width={150} height={114} rx={8} fill="none" stroke={EDGE} strokeDasharray="4 4" />
        <text x={38} y={48} fill={MUTE} fontSize={11} fontFamily={MONO}>makeCounter()</text>
        <text x={120} y={140} fill={MUTE} fontSize={9}>returns →</text>
      </g>
      <g className="tdd-pulse" style={{ transformOrigin: "92px 98px", transformBox: "fill-box" }}>
        <rect x={56} y={84} width={72} height={28} rx={6} fill={ACCENT} />
        <text x={92} y={102} textAnchor="middle" fontFamily={MONO} fontSize={12} fill="#0b0f1a">count</text>
      </g>
      <rect x={208} y={70} width={96} height={46} rx={8} fill={NODE2} />
      <text x={256} y={90} textAnchor="middle" fill="#e0e7ff" fontSize={11} fontFamily={MONO}>increment()</text>
      <text x={256} y={104} textAnchor="middle" fill="#c7d2fe" fontSize={9}>(the closure)</text>
      <line x1={208} y1={93} x2={130} y2={97} stroke={ACCENT} strokeWidth={2} />
      <polygon points="130,97 138,93 138,101" fill={ACCENT} />
      <text x={160} y={166} textAnchor="middle" fill={MUTE} fontSize={10}>inner() still reads count after the outer returns</text>
    </svg>
  );
}

function EventLoop() {
  return (
    <svg viewBox="0 0 320 170" className="h-full w-full">
      <text x={18} y={20} fill={MUTE} fontSize={12}>Event Loop</text>
      <rect x={20} y={40} width={96} height={100} rx={8} fill="none" stroke={EDGE} />
      <text x={68} y={58} textAnchor="middle" fill={TXT} fontSize={11}>Call Stack</text>
      <rect x={206} y={36} width={104} height={42} rx={8} fill="none" stroke={EDGE} />
      <text x={258} y={52} textAnchor="middle" fill={TXT} fontSize={10}>Microtasks</text>
      <rect x={206} y={100} width={104} height={42} rx={8} fill="none" stroke={EDGE} />
      <text x={258} y={116} textAnchor="middle" fill={TXT} fontSize={10}>Macrotasks</text>
      <circle className="tdd-go" style={{ ["--tdd-go" as string]: "-150px", animationDelay: "0s" }} cx={232} cy={64} r={7} fill={NODE} />
      <circle className="tdd-go" style={{ ["--tdd-go" as string]: "-150px", animationDelay: "1.3s" }} cx={232} cy={128} r={7} fill={ACCENT} />
      <g className="tdd-spin-slow" style={{ transformOrigin: "160px 90px", transformBox: "fill-box" }}>
        <path d="M150 78 A20 20 0 1 1 148 102" fill="none" stroke={GOOD} strokeWidth={2.5} />
        <polygon points="148,102 144,94 153,96" fill={GOOD} />
      </g>
      <text x={160} y={166} textAnchor="middle" fill={MUTE} fontSize={10}>loop drains queues onto the stack when it&apos;s empty</text>
    </svg>
  );
}

function Scope() {
  return (
    <svg viewBox="0 0 320 170" className="h-full w-full">
      <rect x={24} y={28} width={272} height={116} rx={8} fill="none" stroke={EDGE} />
      <text x={32} y={44} fill={MUTE} fontSize={11} fontFamily={MONO}>global</text>
      <rect x={34} y={34} width={48} height={22} rx={5} fill={ACCENT} />
      <text x={58} y={49} textAnchor="middle" fontFamily={MONO} fontSize={11} fill="#0b0f1a">x = 1</text>
      <rect x={70} y={56} width={200} height={78} rx={8} fill="none" stroke={EDGE} />
      <text x={78} y={72} fill={MUTE} fontSize={11} fontFamily={MONO}>outer()</text>
      <rect x={120} y={80} width={130} height={46} rx={8} fill="none" stroke={EDGE} />
      <text x={128} y={96} fill={MUTE} fontSize={11} fontFamily={MONO}>inner()</text>
      <text x={185} y={116} textAnchor="middle" fill={TXT} fontSize={11} fontFamily={MONO}>use x</text>
      <circle
        className="tdd-seek"
        style={{ ["--tdd-sx" as string]: "-127px", ["--tdd-sy" as string]: "-62px", transformBox: "fill-box" }}
        cx={185}
        cy={108}
        r={6}
        fill={GOOD}
      />
      <text x={160} y={162} textAnchor="middle" fill={MUTE} fontSize={10}>lookup walks outward through the scope chain</text>
    </svg>
  );
}

function Promise() {
  return (
    <svg viewBox="0 0 320 170" className="h-full w-full">
      <text x={20} y={22} fill={MUTE} fontSize={12}>Promise</text>
      <g className="tdd-stateA">
        <circle className="tdd-spin-slow" style={{ transformOrigin: "160px 88px", transformBox: "fill-box" }} cx={160} cy={88} r={34} fill="none" stroke={NODE} strokeWidth={5} strokeDasharray="40 18" />
        <text x={160} y={92} textAnchor="middle" fill={NODE} fontSize={13} fontFamily={MONO}>pending</text>
      </g>
      <g className="tdd-stateB">
        <circle cx={160} cy={88} r={34} fill={GOOD} opacity={0.18} stroke={GOOD} strokeWidth={3} />
        <path d="M146 88 l9 10 l18 -20" fill="none" stroke={GOOD} strokeWidth={4} strokeLinecap="round" strokeLinejoin="round" />
        <text x={160} y={140} textAnchor="middle" fill={GOOD} fontSize={12} fontFamily={MONO}>fulfilled</text>
      </g>
      <text x={160} y={164} textAnchor="middle" fill={MUTE} fontSize={10}>settles once: pending → fulfilled / rejected</text>
    </svg>
  );
}

function Reference() {
  return (
    <svg viewBox="0 0 320 170" className="h-full w-full">
      <text x={20} y={22} fill={MUTE} fontSize={12}>Reference</text>
      <rect x={26} y={50} width={56} height={26} rx={5} fill={NODE2} />
      <text x={54} y={67} textAnchor="middle" fill="#e0e7ff" fontSize={12} fontFamily={MONO}>a</text>
      <rect x={26} y={104} width={56} height={26} rx={5} fill={NODE2} />
      <text x={54} y={121} textAnchor="middle" fill="#e0e7ff" fontSize={12} fontFamily={MONO}>b</text>
      <g className="tdd-pulse" style={{ transformOrigin: "212px 88px", transformBox: "fill-box" }}>
        <rect x={170} y={66} width={120} height={44} rx={8} fill={ACCENT} />
        <text x={230} y={92} textAnchor="middle" fill="#0b0f1a" fontSize={12} fontFamily={MONO}>{"{ name }"}</text>
      </g>
      <line x1={82} y1={63} x2={170} y2={82} stroke={EDGE} strokeWidth={2} />
      <line x1={82} y1={117} x2={170} y2={94} stroke={EDGE} strokeWidth={2} />
      <text x={170} y={162} textAnchor="middle" fill={MUTE} fontSize={10}>a and b point to the SAME object — mutate one, both change</text>
    </svg>
  );
}

function ArrayMethods() {
  return (
    <svg viewBox="0 0 320 170" className="h-full w-full">
      <text x={20} y={22} fill={MUTE} fontSize={12}>map</text>
      <text x={40} y={94} textAnchor="middle" fill={TXT} fontSize={13} fontFamily={MONO}>[1,2,3]</text>
      <rect x={120} y={66} width={80} height={44} rx={8} fill={NODE2} />
      <text x={160} y={92} textAnchor="middle" fill="#e0e7ff" fontSize={11} fontFamily={MONO}>x =&gt; x*2</text>
      <text x={284} y={94} textAnchor="middle" fill={GOOD} fontSize={13} fontFamily={MONO}>[2,4,6]</text>
      {[0, 1, 2].map((i) => (
        <circle key={i} className="tdd-go" style={{ ["--tdd-go" as string]: "208px", animationDelay: `${i * 0.5}s` }} cx={74} cy={88} r={6} fill={i === 0 ? NODE : i === 1 ? ACCENT : GOOD} />
      ))}
      <text x={160} y={150} textAnchor="middle" fill={MUTE} fontSize={10}>each item is transformed into a new array</text>
    </svg>
  );
}

function Recursion() {
  return (
    <svg viewBox="0 0 320 170" className="h-full w-full">
      <text x={20} y={22} fill={MUTE} fontSize={12}>Recursion</text>
      {[
        { l: "fact(3)", x: 30, w: 260, y: 36, d: 0, c: NODE2 },
        { l: "fact(2)", x: 62, w: 196, y: 64, d: 0.5, c: NODE },
        { l: "fact(1)", x: 94, w: 132, y: 92, d: 1.0, c: ACCENT },
      ].map((f) => (
        <g key={f.l} className="tdd-rise" style={{ animationDelay: `${f.d}s` }}>
          <rect x={f.x} y={f.y} width={f.w} height={24} rx={5} fill={f.c} opacity={0.92} />
          <text x={f.x + 12} y={f.y + 16} fill="#0b0f1a" fontSize={11} fontFamily={MONO} fontWeight={600}>{f.l}</text>
        </g>
      ))}
      <text x={160} y={140} textAnchor="middle" fill={GOOD} fontSize={12} fontFamily={MONO}>1 → 2 → 6</text>
      <text x={160} y={162} textAnchor="middle" fill={MUTE} fontSize={10}>each call waits for a smaller one, then returns back up</text>
    </svg>
  );
}

function Async() {
  return (
    <svg viewBox="0 0 320 170" className="h-full w-full">
      <text x={20} y={22} fill={MUTE} fontSize={12}>Sync vs Async</text>
      <line x1={30} y1={96} x2={296} y2={96} stroke={EDGE} strokeWidth={2} />
      <g className="tdd-rise">
        <circle cx={70} cy={96} r={8} fill={GOOD} />
        <text x={70} y={78} textAnchor="middle" fill={TXT} fontSize={10}>sync (now)</text>
      </g>
      <circle className="tdd-go" style={{ ["--tdd-go" as string]: "150px" }} cx={70} cy={96} r={6} fill={ACCENT} />
      <g className="tdd-stateB">
        <circle cx={248} cy={96} r={8} fill={ACCENT} />
        <text x={248} y={124} textAnchor="middle" fill={TXT} fontSize={10}>callback (later)</text>
      </g>
      <text x={160} y={158} textAnchor="middle" fill={MUTE} fontSize={10}>sync runs now; callbacks run later, after the stack clears</text>
    </svg>
  );
}

const VISUALS: Record<string, () => JSX.Element> = {
  callstack: CallStack,
  closure: Closure,
  eventloop: EventLoop,
  scope: Scope,
  promise: Promise,
  reference: Reference,
  arraymethods: ArrayMethods,
  recursion: Recursion,
  async: Async,
};

function wrapLabel(label: string): string[] {
  if (label.length <= 10 || !label.includes(" ")) return [label];
  const parts = label.split(" ");
  const mid = Math.ceil(parts.length / 2);
  return [parts.slice(0, mid).join(" "), parts.slice(mid).join(" ")];
}

/** Generic data-flow visualizer: labelled stages light up in sequence as a token
 *  travels through them — covers most "X flows through Y to Z" concepts. */
function PipelineViz({ nodes, caption }: { nodes: string[]; caption: string }) {
  const n = nodes.length;
  const pad = 14;
  const span = (320 - pad * 2) / n;
  const boxW = Math.min(span - 12, 80);
  const cy = 82;
  const boxH = 42;
  const centers = nodes.map((_, i) => pad + span * i + span / 2);
  return (
    <svg viewBox="0 0 320 170" className="h-full w-full">
      {centers.slice(0, -1).map((cx, i) => {
        const x2 = centers[i + 1] - boxW / 2;
        return (
          <g key={i}>
            <line x1={cx + boxW / 2} y1={cy} x2={x2 - 5} y2={cy} stroke={EDGE} strokeWidth={2} />
            <polygon points={`${x2 - 4},${cy} ${x2 - 11},${cy - 4} ${x2 - 11},${cy + 4}`} fill={EDGE} />
          </g>
        );
      })}
      {nodes.map((label, i) => {
        const lines = wrapLabel(label);
        const fill = i === 0 ? NODE2 : i === n - 1 ? GOOD : NODE;
        return (
          <g key={i}>
            <rect
              className="tdd-pulse"
              style={{ animationDelay: `${i * 0.45}s`, transformOrigin: `${centers[i]}px ${cy}px`, transformBox: "fill-box" }}
              x={centers[i] - boxW / 2}
              y={cy - boxH / 2}
              width={boxW}
              height={boxH}
              rx={8}
              fill={fill}
              opacity={0.92}
            />
            {lines.map((ln, li) => (
              <text
                key={li}
                x={centers[i]}
                y={cy + 4 + (li - (lines.length - 1) / 2) * 11}
                textAnchor="middle"
                fill="#0b0f1a"
                fontSize={9.5}
                fontWeight={600}
              >
                {ln}
              </text>
            ))}
          </g>
        );
      })}
      <circle
        className="tdd-go"
        style={{ ["--tdd-go" as string]: `${centers[n - 1] - centers[0]}px` }}
        cx={centers[0]}
        cy={cy - 30}
        r={5}
        fill={ACCENT}
      />
      <text x={160} y={150} textAnchor="middle" fill={MUTE} fontSize={10}>{caption}</text>
    </svg>
  );
}

export function ConceptVisual({ conceptKey }: { conceptKey: string }) {
  if (isBespoke(conceptKey)) {
    const V = VISUALS[conceptKey];
    return V ? <V /> : null;
  }
  const p = PIPELINES[conceptKey];
  return p ? <PipelineViz nodes={p.nodes} caption={p.caption} /> : null;
}
