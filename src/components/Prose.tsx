import type { ReactNode } from "react";

/**
 * Minimal, dependency-free markdown renderer for the content prose. The source
 * only uses three inline features (inline `code`, **bold**, paragraph breaks),
 * so we render React nodes directly — no dangerouslySetInnerHTML, no parser dep.
 */

const INLINE = /(`[^`]+`|\*\*[^*]+\*\*)/g;

function renderInline(text: string): ReactNode[] {
  const out: ReactNode[] = [];
  let last = 0;
  let key = 0;
  for (const m of text.matchAll(INLINE)) {
    const idx = m.index ?? 0;
    if (idx > last) out.push(text.slice(last, idx));
    const tok = m[0];
    if (tok.startsWith("`")) {
      out.push(
        <code
          key={key++}
          className="rounded bg-slate-800/80 px-1.5 py-0.5 font-mono text-[0.85em] text-brand-300 ring-1 ring-white/10"
        >
          {tok.slice(1, -1)}
        </code>,
      );
    } else {
      out.push(
        <strong key={key++} className="font-semibold text-slate-100">
          {tok.slice(2, -2)}
        </strong>,
      );
    }
    last = idx + tok.length;
  }
  if (last < text.length) out.push(text.slice(last));
  return out;
}

export function Prose({ text, className }: { text: string; className?: string }) {
  const paragraphs = text.split(/\n{2,}/).filter((p) => p.trim().length);
  return (
    <div className={className}>
      {paragraphs.map((p, i) => (
        <p key={i} className="mb-3 leading-relaxed text-slate-300 last:mb-0">
          {renderInline(p.replace(/\n/g, " "))}
        </p>
      ))}
    </div>
  );
}
