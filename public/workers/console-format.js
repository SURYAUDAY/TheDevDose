/* Node-console-compatible value formatter (a util.inspect subset).
 *
 * The content's verified EXPECTED OUTPUT blocks were produced by real Node, so
 * the playground must format logged values the same way Node's console.log does
 * — `[ 1, 2 ]`, `{ a: 1, b: 'x' }`, single-quoted nested strings, and wrapping
 * onto multiple lines past 80 columns. Shared verbatim by the JS worker and the
 * scripts/check-runnable.ts self-test so they can't drift.
 */
(function (global) {
  var BREAK = 80;

  function repeat(n) {
    return n > 0 ? new Array(n + 1).join(" ") : "";
  }

  function isIdent(k) {
    return /^[A-Za-z_$][A-Za-z0-9_$]*$/.test(k);
  }

  function quoteString(s) {
    var esc = s
      .replace(/\\/g, "\\\\")
      .replace(/\n/g, "\\n")
      .replace(/\t/g, "\\t")
      .replace(/\r/g, "\\r");
    if (s.indexOf("'") === -1) return "'" + esc + "'";
    if (s.indexOf('"') === -1) return '"' + esc + '"';
    return "'" + esc.replace(/'/g, "\\'") + "'";
  }

  function wrap(prefix, open, close, entries, indent) {
    if (entries.length === 0) return prefix + open + close;
    var single = prefix + open + " " + entries.join(", ") + " " + close;
    var hasNewline = entries.some(function (e) {
      return e.indexOf("\n") !== -1;
    });
    if (!hasNewline && indent + single.length <= BREAK) return single;
    var childIndent = repeat(indent + 2);
    var body = entries
      .map(function (e) {
        return childIndent + e;
      })
      .join(",\n");
    return prefix + open + "\n" + body + "\n" + repeat(indent) + close;
  }

  function inspect(v, indent, depth, seen) {
    indent = indent || 0;
    if (depth === undefined) depth = 2;
    var t = typeof v;
    if (v === null) return "null";
    if (t === "undefined") return "undefined";
    if (t === "number") return Object.is(v, -0) ? "-0" : String(v);
    if (t === "bigint") return String(v) + "n";
    if (t === "boolean") return String(v);
    if (t === "string") return quoteString(v);
    if (t === "symbol") return v.toString();
    if (t === "function") {
      var src = Function.prototype.toString.call(v);
      if (/^class[\s{]/.test(src)) return "[class " + (v.name || "(anonymous)") + "]";
      return v.name ? "[Function: " + v.name + "]" : "[Function (anonymous)]";
    }

    if (seen && seen.has(v)) return "[Circular *1]";
    seen = seen || new Set();
    seen.add(v);
    try {
      if (Array.isArray(v)) {
        if (depth < 0) return "[Array]";
        return wrap(
          "",
          "[",
          "]",
          v.map(function (e) {
            return inspect(e, indent + 2, depth - 1, seen);
          }),
          indent,
        );
      }
      if (v instanceof Map) {
        if (depth < 0) return "[Map]";
        var mapEntries = [];
        v.forEach(function (val, key) {
          mapEntries.push(
            inspect(key, indent + 2, depth - 1, seen) +
              " => " +
              inspect(val, indent + 2, depth - 1, seen),
          );
        });
        return wrap("Map(" + v.size + ") ", "{", "}", mapEntries, indent);
      }
      if (v instanceof Set) {
        if (depth < 0) return "[Set]";
        var setEntries = [];
        v.forEach(function (val) {
          setEntries.push(inspect(val, indent + 2, depth - 1, seen));
        });
        return wrap("Set(" + v.size + ") ", "{", "}", setEntries, indent);
      }
      if (v instanceof Date) return isNaN(v.getTime()) ? "Invalid Date" : v.toISOString();
      if (v instanceof RegExp) return String(v);
      if (v instanceof Error) return "[" + (v.name || "Error") + ": " + v.message + "]";

      if (depth < 0) return "[Object]";
      var ctor = v.constructor && v.constructor.name;
      var prefix = ctor && ctor !== "Object" ? ctor + " " : "";
      var entries = Object.keys(v).map(function (k) {
        var keyStr = isIdent(k) ? k : quoteString(k);
        return keyStr + ": " + inspect(v[k], indent + 2, depth - 1, seen);
      });
      return wrap(prefix, "{", "}", entries, indent);
    } finally {
      seen.delete(v);
    }
  }

  function formatArg(v) {
    return typeof v === "string" ? v : inspect(v, 0, 2, new Set());
  }

  global.__tddInspect = inspect;
  global.__tddFormatArg = formatArg;
})(typeof self !== "undefined" ? self : globalThis);
