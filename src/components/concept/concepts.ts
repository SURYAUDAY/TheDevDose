/**
 * Concept routing + data (pure, no JSX so it can be unit-checked in Node).
 * A topic is mapped by slug/title to either a bespoke visualizer (mechanics that
 * need a special shape — call stack, closure, …) or a parameterised "pipeline"
 * (a labelled left-to-right data flow). Everything else falls back to the
 * metaphor scene. Phase-aware so e.g. "token" means JWT in Backend but
 * tokenization in GenAI.
 */

export interface Pipeline {
  nodes: string[];
  caption: string;
}

/** Bespoke visualizers implemented as dedicated SVGs in visualizers.tsx. */
export const BESPOKE_KEYS = [
  "callstack",
  "closure",
  "eventloop",
  "scope",
  "promise",
  "reference",
  "arraymethods",
  "recursion",
  "async",
] as const;

/** Pipeline concepts — defined as data, rendered by one generic component. */
export const PIPELINES: Record<string, Pipeline> = {
  // Backend
  "request-response": { nodes: ["Client", "Server", "Database", "Response"], caption: "a request hits the server, queries the DB, and returns" },
  middleware: { nodes: ["Request", "Auth", "Logger", "Handler"], caption: "middleware runs in order before the route handler" },
  rest: { nodes: ["Client", "REST API", "Database"], caption: "CRUD maps to HTTP verbs acting on resources" },
  jwt: { nodes: ["Login", "Sign JWT", "Verify", "Access"], caption: "the server signs a token; later requests are verified" },
  caching: { nodes: ["Request", "Cache", "Database"], caption: "check the cache first; hit the DB only on a miss" },
  "db-index": { nodes: ["Query", "Index", "Row"], caption: "an index jumps to the row instead of scanning all" },
  queue: { nodes: ["Producer", "Queue", "Consumer"], caption: "work is queued and processed asynchronously" },
  pubsub: { nodes: ["Publisher", "Topic", "Subscribers"], caption: "one event fans out to many subscribers" },
  websocket: { nodes: ["Client", "Open socket", "Server"], caption: "a persistent two-way connection stays open" },
  microservices: { nodes: ["Gateway", "Service A", "Service B"], caption: "independent services talk over the network" },
  orm: { nodes: ["Code", "ORM", "SQL", "Database"], caption: "an ORM maps objects to SQL queries" },
  "sql-join": { nodes: ["Table A", "JOIN", "Table B"], caption: "a join combines rows across related tables" },
  transaction: { nodes: ["Begin", "Writes", "Commit"], caption: "all-or-nothing: commit together or roll back" },
  // GenAI
  rag: { nodes: ["Query", "Retriever", "Vector DB", "LLM", "Answer"], caption: "retrieve relevant chunks, then answer using them" },
  tokenization: { nodes: ["Text", "Tokenizer", "Tokens"], caption: "text is split into tokens the model reads" },
  embeddings: { nodes: ["Text", "Model", "Vector"], caption: "text becomes a vector that captures meaning" },
  "vector-search": { nodes: ["Query vector", "Index", "Nearest"], caption: "find the closest vectors by similarity" },
  llm: { nodes: ["Prompt", "LLM", "Next token"], caption: "the model predicts the next token, repeatedly" },
  agent: { nodes: ["Goal", "Think", "Tool", "Observe"], caption: "an agent loops: reason, act with a tool, observe" },
  chunking: { nodes: ["Document", "Chunks", "Index"], caption: "split documents into chunks, then index them" },
  prompt: { nodes: ["System", "User", "LLM", "Output"], caption: "system + user messages steer the model's output" },
  finetune: { nodes: ["Base model", "Your data", "Tuned model"], caption: "adapt a base model on your own examples" },
  // System Design
  "load-balancer": { nodes: ["Requests", "Load Balancer", "Servers"], caption: "spread traffic across many servers" },
  sharding: { nodes: ["Data", "Shard key", "Shards"], caption: "split data across shards by a key" },
  replication: { nodes: ["Primary", "Replicate", "Replicas"], caption: "copy writes to replicas for reads & failover" },
  "rate-limit": { nodes: ["Requests", "Limiter", "Allowed"], caption: "excess requests are throttled" },
  cdn: { nodes: ["User", "CDN edge", "Origin"], caption: "serve from the nearest edge cache" },
  "ci-cd": { nodes: ["Commit", "Build", "Test", "Deploy"], caption: "every commit is built, tested, and deployed" },
  scaling: { nodes: ["Load", "Add nodes", "Capacity"], caption: "scale out by adding more machines" },
  idempotency: { nodes: ["Retry", "Same key", "One effect"], caption: "repeating a request changes nothing extra" },
  // TypeScript
  "compile-ts": { nodes: ["TypeScript", "Type check", "JavaScript"], caption: "types are checked, then erased to plain JS" },
  generics: { nodes: ["Type T", "Generic<T>", "Typed result"], caption: "one definition works for many types, safely" },
  narrowing: { nodes: ["unknown", "Type guard", "Narrowed"], caption: "a check narrows a value to a specific type" },
  // React
  vdom: { nodes: ["New VDOM", "Diff", "Patch DOM"], caption: "compare trees and patch only what changed" },
  "state-update": { nodes: ["setState", "Re-render", "New UI"], caption: "a state change triggers a re-render" },
  "props-flow": { nodes: ["Parent", "Props", "Child"], caption: "data flows down from parent to child via props" },
  effect: { nodes: ["Render", "Run effect", "Cleanup"], caption: "effects run after render; cleanup before re-run" },
  ssr: { nodes: ["Request", "Render on server", "HTML"], caption: "the server renders HTML, the client hydrates" },
  "data-fetch": { nodes: ["Mount", "Fetch", "Render data"], caption: "fetch on mount, then render the data" },
  bundler: { nodes: ["Modules", "Bundler", "Bundle"], caption: "many modules are bundled into shippable assets" },
  memo: { nodes: ["Inputs", "Memo cache", "Skip work"], caption: "cache results so unchanged inputs skip recompute" },
  // JS — values, functions, memory
  "this-binding": { nodes: ["Call site", "this", "Object"], caption: "how a function is called decides its 'this'" },
  prototype: { nodes: ["Object", "Prototype", "Inherited"], caption: "objects delegate lookups up the prototype chain" },
  coercion: { nodes: ["Value", "Coerce", "Other type"], caption: "JS converts types during comparison & math" },
  destructure: { nodes: ["Object / Array", "Destructure", "Variables"], caption: "unpack values into named variables" },
  collection: { nodes: ["Items", "Set / Map", "Unique / keyed"], caption: "Set holds unique values; Map keys to values" },
  iterator: { nodes: ["Iterable", "next()", "Values"], caption: "iterators yield values one at a time" },
  "fn-transform": { nodes: ["Function", "Wrap", "New function"], caption: "functions that take or return functions" },
  memory: { nodes: ["Allocate", "Reference", "Free (GC)"], caption: "unreferenced memory is reclaimed by the GC" },
  "error-handling": { nodes: ["try", "catch", "recover"], caption: "catch errors and respond gracefully" },
  // TS
  "type-annotation": { nodes: ["Value", "Type", "Checked"], caption: "annotations let the compiler verify usage" },
  // React
  render: { nodes: ["Props & State", "Component", "UI"], caption: "a component renders UI from its props & state" },
  hook: { nodes: ["Component", "Hook", "Reusable logic"], caption: "hooks add state & behavior to components" },
  routing: { nodes: ["URL", "Router", "Component"], caption: "the router shows a component per URL" },
  // Backend DB
  schema: { nodes: ["Entities", "Relations", "Tables"], caption: "model data as related tables" },
  validation: { nodes: ["Input", "Validate", "Accept / reject"], caption: "check input before you trust it" },
  // System Design — DSA & architecture
  bigo: { nodes: ["Input n", "Algorithm", "Time / Space"], caption: "cost grows with input size (Big-O)" },
  hashmap: { nodes: ["Key", "Hash", "Bucket"], caption: "a hash maps keys to buckets for O(1) access" },
  tree: { nodes: ["Root", "Branches", "Leaves"], caption: "data branches from a root into nodes" },
  sorting: { nodes: ["Unsorted", "Compare & swap", "Sorted"], caption: "compare and reorder until sorted" },
  dsa: { nodes: ["Problem", "Pattern", "Solution"], caption: "spot the pattern, apply the technique" },
  architecture: { nodes: ["Modules", "Layers", "System"], caption: "organize code into clear layers" },
  modules: { nodes: ["export", "import", "use"], caption: "modules share code via import / export" },
  events: { nodes: ["Target", "Bubbles up", "Document"], caption: "events bubble up from the target through ancestors" },
  storage: { nodes: ["Data", "Browser store", "Persists"], caption: "the browser keeps data locally between visits" },
};

type Phase = "P1A" | "P1B" | "P2" | "P3" | "P4" | "P5" | string;

// Ordered, phase-gated rules. First match wins.
const RULES: { key: string; re: RegExp; phases?: Phase[] }[] = [
  // JS bespoke
  { key: "callstack", re: /execution-context|call-stack|global-execution|function-execution|execution-phase|memory-creation|stack-vs-heap/ },
  { key: "closure", re: /closure/ },
  { key: "eventloop", re: /event-loop|microtask|macrotask|task-queue/ },
  { key: "promise", re: /promise/ },
  { key: "recursion", re: /recursion|recursive|backtrack/ },
  { key: "scope", re: /\bscope\b|scope-chain|hoisting|temporal-dead-zone|lexical|var-vs-let|block-scope|let-const|declaration/ },
  { key: "reference", re: /reference|shallow-copy|deep-copy|primitive-vs|structured-?clone|immutab|mutation|nested-object|object-freeze|object-seal|object-assign|\bcopy\b/ },
  { key: "arraymethods", re: /array-\w+|(^|-)(map|filter|reduce)($|-)|for-?each/, phases: ["P1A", "P2"] },
  { key: "async", re: /async|await|callback|synchronous|set-?timeout|set-?interval|debounc|throttl|abort/ },
  // TypeScript
  { key: "generics", re: /generic/, phases: ["P1B"] },
  { key: "narrowing", re: /narrow|type-guard|guard|discriminated|unknown|never|assertion/, phases: ["P1B"] },
  { key: "compile-ts", re: /typescript|tsconfig|compiler|type|interface|union|intersection|enum|tuple|utility/, phases: ["P1B"] },
  // React
  { key: "vdom", re: /virtual-dom|reconcil|diffing|fiber/, phases: ["P2"] },
  { key: "state-update", re: /use-?state|state-management|set-?state|use-?reducer|redux|zustand|signal/, phases: ["P2"] },
  { key: "props-flow", re: /props|prop-drilling|context|lifting-state|composition|children/, phases: ["P2"] },
  { key: "effect", re: /use-?effect|use-?layouteffect|lifecycle|cleanup|mount/, phases: ["P2"] },
  { key: "memo", re: /memo|use-?callback|use-?memo|optimi|profil|re-?render/, phases: ["P2"] },
  { key: "data-fetch", re: /react-query|fetch|swr|suspense|loading/, phases: ["P2"] },
  { key: "ssr", re: /ssr|server-side|server-component|hydrat|next|ssg|static-site|streaming/, phases: ["P2"] },
  { key: "bundler", re: /vite|webpack|bundl|code-split|lazy|tree-shak|build-tool/, phases: ["P2"] },
  // Backend
  { key: "middleware", re: /middleware/, phases: ["P3"] },
  { key: "jwt", re: /jwt|json-web|auth|oauth|session|login|rbac|bearer|access-token|refresh-token|password|hashing|api-key|csrf|cors|secure-cookie|helmet/, phases: ["P3", "P5"] },
  { key: "caching", re: /cach|redis/, phases: ["P3", "P2", "P5"] },
  { key: "db-index", re: /index|query-optim|pagination/, phases: ["P3"] },
  { key: "queue", re: /queue|background-job|\bcron\b|worker|message-broker|kafka|rabbit|bull/, phases: ["P3"] },
  { key: "pubsub", re: /pub-?sub|publish-subscribe|webhook|server-sent|\bsse\b|event-driven/, phases: ["P3"] },
  { key: "websocket", re: /websocket|socket|real-?time/, phases: ["P3"] },
  { key: "transaction", re: /transaction|\bacid\b|rollback|commit/, phases: ["P3"] },
  { key: "sql-join", re: /join|relationship|normaliz|foreign-key/, phases: ["P3"] },
  { key: "orm", re: /\borm\b|prisma|mongoose|sequelize|typeorm/, phases: ["P3"] },
  { key: "microservices", re: /microservice|monolith|\bgrpc\b/, phases: ["P3", "P5"] },
  { key: "request-response", re: /http|request|response|express|node|rest|crud|api|graphql|endpoint|status-code|fetch|axios|upload|email/, phases: ["P3"] },
  // GenAI
  { key: "rag", re: /\brag\b|retrieval-augmented|retriev/, phases: ["P4", "P5"] },
  { key: "tokenization", re: /token|context-window/, phases: ["P4"] },
  { key: "embeddings", re: /embedding/, phases: ["P4", "P5"] },
  { key: "vector-search", re: /vector|similarity|cosine|semantic|pinecone|chroma|faiss|pgvector|qdrant|weaviate|rerank|hybrid-search/, phases: ["P4", "P5"] },
  { key: "agent", re: /agent|react-pattern|tool-call|function-call/, phases: ["P4"] },
  { key: "chunking", re: /chunk|document-load|parsing|indexing/, phases: ["P4"] },
  { key: "prompt", re: /prompt|system|few-shot|zero-shot|chain-of-thought|structured-output|output-parser/, phases: ["P4"] },
  { key: "finetune", re: /fine-?tune|train|model-select/, phases: ["P4"] },
  { key: "llm", re: /llm|generative|temperature|top-|max-token|penalt|sampling|streaming|hallucinat|function-calling/, phases: ["P4"] },
  // System Design
  { key: "load-balancer", re: /load-balanc|horizontal|vertical/, phases: ["P5"] },
  { key: "sharding", re: /shard|partition/, phases: ["P5"] },
  { key: "replication", re: /replica|consistency|eventual/, phases: ["P5"] },
  { key: "rate-limit", re: /rate-limit|throttl/, phases: ["P5"] },
  { key: "cdn", re: /\bcdn\b|edge/, phases: ["P5"] },
  { key: "ci-cd", re: /ci-?cd|docker|kubernetes|jenkins|github-actions|terraform|deploy|nginx|serverless|lambda|\baws\b|pm2|monitoring|logging|health/, phases: ["P3", "P5"] },
  { key: "scaling", re: /scal|capacity|throughput/, phases: ["P5"] },
  { key: "idempotency", re: /idempoten/, phases: ["P5"] },
  // JS — values, functions, memory
  { key: "this-binding", re: /\bthis\b|binding|call-apply|\bbind\b|\bcall\b|\bapply\b/, phases: ["P1A"] },
  { key: "prototype", re: /prototype|inherit|\bclass(es)?\b|constructor|instanceof|object-oriented|\bnew\b/, phases: ["P1A"] },
  { key: "collection", re: /weakmap|weakset|set-weakset|map-weakmap/, phases: ["P1A"] },
  { key: "iterator", re: /iterator|iterable|generator/, phases: ["P1A"] },
  { key: "destructure", re: /destructur|spread|\brest\b|optional-chain|nullish|template-literal|default-param|parameter/, phases: ["P1A"] },
  { key: "fn-transform", re: /curry|memoiz|composition|partial|higher-order|pure-function|side-effect|first-class|callback/, phases: ["P1A"] },
  { key: "memory", re: /garbage|memory|leak|\bheap\b/, phases: ["P1A"] },
  { key: "coercion", re: /coerc|equality|truthy|falsy|\bnan\b|bigint|symbol|type-conversion|comparison|number|string|boolean|primitive|\buse-strict\b|strict-mode|iife/, phases: ["P1A"] },
  { key: "error-handling", re: /try-?catch|\berror\b|throw|finally|exception|boundary/, phases: ["P1A", "P2", "P3"] },
  // TypeScript — typing, then a catch-all (every TS topic is about types)
  { key: "type-annotation", re: /propert|signature|typing|overload|readonly|optional|access-modifier|abstract|implements|tuple|getter|setter|parameter|decorator|module/, phases: ["P1B"] },
  { key: "compile-ts", re: /./, phases: ["P1B"] },
  // React — routing, hooks, then a render catch-all
  { key: "routing", re: /router|route|navigation|\blink\b/, phases: ["P2"] },
  { key: "hook", re: /hook|use-?ref|use-?id|forward-?ref|controlled|uncontrolled|imperative|portal/, phases: ["P2"] },
  { key: "render", re: /./, phases: ["P2"] },
  // Backend — DB, validation, architecture, then a request catch-all
  { key: "schema", re: /schema|table|\bsql\b|postgres|mysql|nosql|mongo|database|normaliz|relation|aggregation|migration|connection-pool|\bdocument\b|embedding-vs-referencing|prisma|mongoose/, phases: ["P3"] },
  { key: "validation", re: /validation|sanitiz/, phases: ["P3"] },
  { key: "architecture", re: /\bmvc\b|repository|\bpattern\b/, phases: ["P3"] },
  { key: "request-response", re: /./, phases: ["P3"] },
  // System Design — DSA & architecture (career topics fall back to the metaphor)
  { key: "bigo", re: /big-o|complexity|time-space|space-time/, phases: ["P5"] },
  { key: "hashmap", re: /hashmap|hash-map|hashing|hash-set/, phases: ["P5"] },
  { key: "tree", re: /\btree\b|graph|\bbst\b|traversal|\bheap\b|trie/, phases: ["P5"] },
  { key: "sorting", re: /sort|search|two-pointer|sliding-window|binary-search/, phases: ["P5"] },
  { key: "architecture", re: /architecture|\bhld\b|\blld\b|folder|component|state-management|performance|lazy|scalab|api-/, phases: ["P5"] },
  { key: "dsa", re: /array|string|problem|pattern|machine-coding|debugging/, phases: ["P5"] },
  // P1A extras
  { key: "modules", re: /module|import|export/, phases: ["P1A"] },
  { key: "iterator", re: /object-keys|object-values|object-entries|object-method/, phases: ["P1A"] },
  { key: "prototype", re: /getter|setter|accessor/, phases: ["P1A"] },
  // P4 — LangChain / memory
  { key: "rag", re: /langchain|\bchain\b|chains|context-inject|ai-memory|\bmemory\b/, phases: ["P4"] },
  // P5 — db / design / dsa / GenAI explainers
  { key: "schema", re: /database|\bsql\b|storage|data-model/, phases: ["P5"] },
  { key: "replication", re: /\bcap\b|cap-theorem/, phases: ["P5"] },
  { key: "architecture", re: /design|url-shortener|chat-app|news-feed|notification|messaging/, phases: ["P5"] },
  { key: "dsa", re: /\bdsa\b|data-structure|algorithm|interview/, phases: ["P5"] },
  { key: "rag", re: /retriev|chunk|\brag\b|indexing/, phases: ["P5"] },
  { key: "agent", re: /agent|tool-call/, phases: ["P5"] },
  // P1A — browser / DOM / storage / fetch
  { key: "events", re: /bubbl|captur|delegation|event-listener|event-target|\bdom\b|requestanimationframe|browser-render/, phases: ["P1A"] },
  { key: "storage", re: /localstorage|sessionstorage|\bcookie/, phases: ["P1A"] },
  { key: "request-response", re: /fetch|\bcors\b|\bxhr\b|ajax/, phases: ["P1A"] },
  { key: "llm", re: /temperature|top-k|top-p|sampling|generation-param|\bllm\b|prompt/, phases: ["P5"] },
  { key: "vector-search", re: /embed|vector|semantic/, phases: ["P5"] },
];

/** Returns a visualizer key (bespoke or pipeline) for a topic, or null for the metaphor fallback. */
export function resolveConceptKey(slug: string, title: string, phaseCode?: string): string | null {
  const hay = (slug + " " + title).toLowerCase();
  for (const r of RULES) {
    if (r.phases && phaseCode && !r.phases.includes(phaseCode)) continue;
    if (r.re.test(hay)) return r.key;
  }
  return null;
}

export function isBespoke(key: string): boolean {
  return (BESPOKE_KEYS as readonly string[]).includes(key);
}
