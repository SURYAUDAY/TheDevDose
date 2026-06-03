/**
 * Un-escape the backslash artifacts that the .docx -> markdown conversion introduced.
 *
 * The converter escaped ASCII punctuation with a leading backslash (e.g. `\=`, `\<`,
 * `` \` ``, `\+`). We strip the backslash before punctuation ONLY. We deliberately do
 * NOT touch:
 *   - backslash before a LETTER or DIGIT  -> preserves real string escapes like \n \t \d
 *   - `\"`  `\'`  `\\`                     -> preserves quote/backslash escapes inside code
 * Backtick IS un-escaped because the source escapes template-literal backticks (`` \` ``)
 * in code and inline-code backticks in prose; both should become a real backtick.
 *
 * The converter ALSO doubled every original backslash (regex `\d` -> `\\d`,
 * `\/` -> `\\/`), so after stripping punctuation escapes we collapse `\\` -> `\`
 * to restore real regex/string escapes. Order matters: strip first (so the
 * second backslash of a `\\[` pair consumes the bracket escape), then collapse.
 */
const STRIP = /\\([!#$%&()*+,\-.:;<=>?@[\]^_`{|}~])/g;

export function unescape(text: string): string {
  return text.replace(STRIP, "$1").replace(/\\\\/g, "\\");
}
