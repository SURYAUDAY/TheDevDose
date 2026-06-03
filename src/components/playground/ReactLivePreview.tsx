"use client";

import { useEffect, useState } from "react";
import * as React from "react";
import { LiveProvider, LivePreview, LiveError } from "react-live";

// All of React (incl. hooks) available unqualified inside the snippet.
const scope = { React, ...React };

/** Turn a `export default function Foo() {…}` JSX snippet into noInline live code:
 *  strip imports, drop `export default`, and render the component. */
function prepare(src: string): string {
  let code = src.replace(/^\s*import[^\n]*\r?\n/gm, "").replace(/export\s+default\s+/g, "");
  const m =
    src.match(/(?:export\s+default\s+function|function)\s+([A-Z]\w*)/) ||
    src.match(/(?:export\s+default|const)\s+([A-Z]\w*)\s*[=(]/);
  const name = m?.[1];
  if (name && !/\brender\s*\(/.test(code)) code += `\nrender(<${name} />);`;
  return code;
}

export function ReactLivePreview({ source }: { source: string }) {
  // react-live transforms with Babel/sucrase — run it only in the browser.
  const [mounted, setMounted] = useState(false);
  useEffect(() => setMounted(true), []);

  if (!mounted) {
    return (
      <div className="grid h-28 place-items-center rounded-xl border border-white/10 bg-slate-100 text-sm text-slate-500">
        Loading live preview…
      </div>
    );
  }

  return (
    <figure className="overflow-hidden rounded-xl border border-white/10">
      <figcaption className="flex items-center justify-between border-b border-white/10 bg-slate-900/60 px-4 py-2 text-xs">
        <span className="font-medium text-slate-300">Live preview</span>
        <span className="rounded-full bg-emerald-500/15 px-2 py-0.5 font-medium text-emerald-300">
          interactive
        </span>
      </figcaption>
      <LiveProvider code={prepare(source)} scope={scope} noInline>
        <div className="bg-slate-100 p-4 text-slate-900 [&_button]:cursor-pointer [&_button]:rounded [&_button]:bg-indigo-600 [&_button]:px-3 [&_button]:py-1 [&_button]:text-white">
          <LivePreview />
        </div>
        <LiveError className="m-0 whitespace-pre-wrap bg-rose-950/50 px-4 py-2 font-mono text-xs text-rose-300 empty:hidden" />
      </LiveProvider>
    </figure>
  );
}
