import { describe, it, expect } from "vitest";
import { resolveConceptKey } from "../src/components/concept/concepts";

describe("resolveConceptKey", () => {
  it("maps JS internals to bespoke visualizers", () => {
    expect(resolveConceptKey("execution-context", "Execution Context", "P1A")).toBe("callstack");
    expect(resolveConceptKey("closures", "Closures", "P1A")).toBe("closure");
    expect(resolveConceptKey("event-loop", "Event Loop", "P1A")).toBe("eventloop");
    expect(resolveConceptKey("promises", "Promises", "P1A")).toBe("promise");
  });

  it("maps cross-phase concepts to pipelines", () => {
    expect(resolveConceptKey("jwt-authentication", "JWT Authentication", "P3")).toBe("jwt");
    expect(resolveConceptKey("what-is-rag", "What is RAG", "P4")).toBe("rag");
    expect(resolveConceptKey("load-balancing", "Load Balancing", "P5")).toBe("load-balancer");
    expect(resolveConceptKey("generics", "Generics", "P1B")).toBe("generics");
  });

  it("is phase-aware ('token' = jwt in backend, tokenization in genai)", () => {
    expect(resolveConceptKey("access-tokens", "Access Tokens", "P3")).toBe("jwt");
    expect(resolveConceptKey("tokenization", "Tokenization", "P4")).toBe("tokenization");
  });

  it("returns null for non-mechanical (career) topics", () => {
    expect(resolveConceptKey("resume-update", "Resume update", "P5")).toBeNull();
  });
});
