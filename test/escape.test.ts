import { describe, it, expect } from "vitest";
import { unescape } from "../scripts/lib/escape";

describe("unescape (docx artifact cleanup)", () => {
  it("strips backslash before punctuation", () => {
    expect(unescape("a \\= b")).toBe("a = b");
    expect(unescape("x \\+= 1")).toBe("x += 1");
    expect(unescape("\\`this\\`")).toBe("`this`");
    expect(unescape("Q\\&A")).toBe("Q&A");
  });

  it("collapses doubled backslashes so regex escapes survive", () => {
    expect(unescape("\\\\d")).toBe("\\d"); // \\d -> \d
    expect(unescape("\\\\/todos")).toBe("\\/todos"); // \\/ -> \/
  });

  it("preserves real string escapes (backslash + letter)", () => {
    expect(unescape("line\\nbreak")).toBe("line\\nbreak");
    expect(unescape("tab\\there")).toBe("tab\\there");
  });
});
