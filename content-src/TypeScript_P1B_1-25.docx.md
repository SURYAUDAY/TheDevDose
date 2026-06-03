**TypeScript**

Interview Preparation — Study Guide

Phase 1B  •  Topics 1–25

*Each topic includes: plain-English \+ Hinglish explanation, key interview points,*

*a real-world example, complete runnable code, tests with expected output, and follow-up Q\&A.*

Run any code sample with:  npx tsx filename.ts  
**Contents**

# **Phase 1B — TypeScript Detailed (Topics 1–25)**

This batch covers TypeScript fundamentals — the type system and tooling (compiler, tsconfig, strict mode), core types (primitives, any/unknown, never/void, literals), composition (unions, intersections, type aliases, interfaces), and function typing (optional, default, rest parameters). Every code sample is written in TypeScript and verified to both type-check under strict mode and run.

## **1\. What is TypeScript**

**Simple Explanation (English)**

TypeScript is a strongly-typed superset of JavaScript developed by Microsoft. It adds an optional static type system on top of JavaScript: every valid JavaScript program is also valid TypeScript, but TypeScript lets you annotate types that are checked at compile time.

Crucially, types exist only during development — TypeScript is compiled ("transpiled") down to plain JavaScript, and all type annotations are erased. The browser/Node runs the resulting JavaScript; the types were just there to catch mistakes before the code ever ran.

**Hinglish Explanation**

TypeScript JavaScript ka ek strongly-typed superset hai jo Microsoft ne banaya. Ye JavaScript ke upar ek optional static type system add karta hai: har valid JavaScript program valid TypeScript bhi hai, par TypeScript aapko types annotate karne deta hai jo compile time par check hote hain.  
Important: types sirf development ke dauraan hote hain — TypeScript compile ("transpile") ho kar plain JavaScript banta hai, aur saari type annotations hat (erase) jaati hain. Browser/Node resulting JavaScript chalata hai; types sirf isliye the ki code chalne se pehle galtiyaan pakdi jaayein.

**Key Interview Points**

* A typed superset of JavaScript — all valid JS is valid TS.

* Adds an optional static type system checked at compile time.

* Compiles to plain JavaScript; type annotations are erased at runtime.

* Created and maintained by Microsoft; hugely popular in modern codebases.

* Types catch bugs before running, improving safety and tooling (autocomplete, refactoring).

**Real-World Example**

A large React/Node codebase uses TypeScript so a function expecting a \`number\` flags any caller passing a \`string\` at compile time — preventing 'undefined is not a function' style runtime crashes in production.

**Code — Full & Runnable**

// solution.ts — TypeScript adds compile-time type checking.  
   
export function add(a: number, b: number): number {  
  return a \+ b;  
}  
   
// At RUNTIME, types are gone (erased). This proves types are compile-time only:  
export function runtimeHasNoTypes(): string {  
  return typeof add; // "function" — there is no "number" type info at runtime  
}  
   
// The following would be a COMPILE error (not runtime), so it's commented out:  
//   add("2", 3); // Error: Argument of type 'string' is not assignable to 'number'

**Test / Demo & Expected Output**

// test.ts — run: npx tsx test.ts  
import { add, runtimeHasNoTypes } from "./solution";  
   
console.log(add(2, 3));            // 5  
console.log(runtimeHasNoTypes());  // function  
   
console.assert(add(2, 3\) \=== 5, "typed add works at runtime");  
console.assert(runtimeHasNoTypes() \=== "function", "types are erased at runtime");  
console.log("What-is-TypeScript assertions passed.");  
   
/\* EXPECTED OUTPUT:  
5  
function  
What-is-TypeScript assertions passed.  
\*/

**Common Follow-up Questions**

**Q: Do TypeScript types exist at runtime?**

**A:** No. Types are erased during compilation to JavaScript. They exist only at compile time for checking; the running code is plain JS with no type information.

**Q: Is every JavaScript file valid TypeScript?**

**A:** Essentially yes — TypeScript is a superset, so valid JS is valid TS. You can adopt TypeScript incrementally by renaming \`.js\` to \`.ts\` and adding types gradually.

## **2\. Why TypeScript over JavaScript**

**Simple Explanation (English)**

TypeScript's main advantage is catching a whole class of bugs at compile time that JavaScript would only reveal at runtime — wrong argument types, typos in property names, missing return values, and null/undefined misuse. This makes large codebases safer to change.

Beyond safety, types power excellent tooling: precise autocomplete, reliable refactoring, inline documentation, and self-describing function signatures. The cost is a build step and some learning curve, but for medium-to-large projects the productivity and reliability gains are substantial.

**Hinglish Explanation**

TypeScript ka main faayda hai compile time par bugs ka ek poora class pakadna jo JavaScript sirf runtime par dikhata — galat argument types, property names me typos, missing return values, aur null/undefined ka galat use. Isse bade codebases me change karna safe ho jaata hai.  
Safety ke alawa, types behtareen tooling dete hain: precise autocomplete, reliable refactoring, inline documentation, aur self-describing function signatures. Cost hai ek build step aur thoda learning curve, par medium-to-large projects ke liye productivity aur reliability gains kaafi zyada hain.

**Key Interview Points**

* Catches type errors, typos, and null misuse at compile time.

* Superior tooling: autocomplete, safe refactoring, go-to-definition.

* Types act as living documentation of function/data shapes.

* Scales well — large teams change code with more confidence.

* Trade-off: a build step and a modest learning curve.

**Real-World Example**

Renaming a property \`userName\` → \`username\` across a 200-file project: TypeScript flags every stale reference instantly, whereas in plain JavaScript you'd discover the misses only when something breaks at runtime.

**Code — Full & Runnable**

// solution.ts — types prevent shape/typo bugs.  
   
export interface User {  
  id: number;  
  name: string;  
}  
   
export function formatUser(user: User): string {  
  // TS guarantees user.name exists and is a string.  
  return user.name \+ " (\#" \+ user.id \+ ")";  
  // user.nam  \-\> compile error (typo caught), not a silent runtime bug  
}  
   
export function safeDivide(a: number, b: number): number {  
  if (b \=== 0\) return 0;  
  return a / b;  
}

**Test / Demo & Expected Output**

// test.ts — run: npx tsx test.ts  
import { formatUser, safeDivide } from "./solution";  
   
console.log(formatUser({ id: 1, name: "Asha" })); // Asha (\#1)  
console.log(safeDivide(10, 2));                    // 5  
console.log(safeDivide(10, 0));                    // 0  
   
console.assert(formatUser({ id: 1, name: "Asha" }) \=== "Asha (\#1)", "typed shape works");  
console.assert(safeDivide(10, 2\) \=== 5, "division");  
console.assert(safeDivide(10, 0\) \=== 0, "guarded divide by zero");  
console.log("Why-TypeScript assertions passed.");  
   
/\* EXPECTED OUTPUT:  
Asha (\#1)  
5  
0  
Why-TypeScript assertions passed.  
\*/

**Common Follow-up Questions**

**Q: Name two concrete benefits of TypeScript over JavaScript.**

**A:** It catches type/shape errors at compile time (before running), and it enables powerful editor tooling like accurate autocomplete and safe, project-wide refactoring.

**Q: What are the trade-offs of adopting TypeScript?**

**A:** You add a compilation/build step and there's a learning curve for the type system, but these are usually outweighed by fewer runtime bugs and better maintainability on larger projects.

## **3\. TS Compiler basics**

**Simple Explanation (English)**

The TypeScript compiler, \`tsc\`, reads your \`.ts\` files, type-checks them, and emits plain \`.js\` files. You run it from the command line (\`tsc file.ts\` or just \`tsc\` to use a project's \`tsconfig.json\`). It can also report type errors without emitting (\`tsc \--noEmit\`).

Two important ideas: type checking and code emission are separate (by default tsc still emits JS even if there are type errors, unless configured otherwise), and types are fully erased — the output JS has no type annotations. Tools like \`tsx\`/\`ts-node\` run TS directly by compiling on the fly.

**Hinglish Explanation**

TypeScript compiler, \`tsc\`, aapki \`.ts\` files padhta hai, type-check karta hai, aur plain \`.js\` files emit karta hai. Ise command line se chalate ho (\`tsc file.ts\` ya sirf \`tsc\` jo project ki \`tsconfig.json\` use karta hai). Ye bina emit kiye sirf errors bhi report kar sakta hai (\`tsc \--noEmit\`).  
Do important ideas: type checking aur code emission alag hain (default me tsc type errors hone par bhi JS emit kar deta hai, jab tak config na badlo), aur types poori tarah erase ho jaate hain — output JS me koi type annotations nahi hote. \`tsx\`/\`ts-node\` jaise tools TS ko on-the-fly compile karke seedhe chalate hain.

**Key Interview Points**

* \`tsc\` type-checks \`.ts\` and emits \`.js\`.

* Run \`tsc file.ts\`, or \`tsc\` to use \`tsconfig.json\`.

* Type checking and emitting are separate; \`--noEmit\` checks only.

* Output JS has all type annotations erased.

* \`tsx\`/\`ts-node\` compile-and-run TS directly for development.

**Real-World Example**

A CI pipeline runs \`tsc \--noEmit\` to fail the build if there are any type errors, while the actual bundle is produced by a bundler (esbuild/webpack) that strips types — separating type-checking from emitting.

**Code — Full & Runnable**

// Compiler usage (commands):  
//   tsc app.ts            \# emit app.js  
//   tsc                   \# compile the whole project via tsconfig.json  
//   tsc \--noEmit          \# type-check only, emit nothing  
//   npx tsx app.ts        \# compile \+ run in one step (dev)  
//  
// solution.ts — demonstrating type erasure in the emitted output.  
   
export function double(n: number): number {  
  return n \* 2;  
}  
// After 'tsc', the emitted double.js is simply:  
//   function double(n) { return n \* 2; }   // ':number' annotations gone

**Test / Demo & Expected Output**

// test.ts — run: npx tsx test.ts  
import { double } from "./solution";  
   
console.log(double(21)); // 42  
console.assert(double(21) \=== 42, "compiled TS runs as JS");  
console.log("TS-compiler-basics assertions passed.");  
console.log("Note: 'tsc' emits .js with all type annotations removed.");  
   
/\* EXPECTED OUTPUT:  
42  
TS-compiler-basics assertions passed.  
Note: 'tsc' emits .js with all type annotations removed.  
\*/

**Common Follow-up Questions**

**Q: What does \`tsc \--noEmit\` do?**

**A:** It type-checks the project and reports errors but does not produce any JavaScript output. It's commonly used in CI to validate types separately from the actual build/bundling step.

**Q: Does tsc stop emitting JS if there are type errors?**

**A:** By default no — it still emits JS even with type errors (a deliberate design choice). You can change this with \`noEmitOnError: true\` in tsconfig.

## **4\. tsconfig basics**

**Simple Explanation (English)**

\`tsconfig.json\` is the configuration file that tells the TypeScript compiler how to compile a project: which files to include, what JavaScript version to target, which module system to use, where to output files, and how strict the type checking should be.

Running \`tsc\` with no arguments uses this file. Key options live under \`compilerOptions\`: \`target\` (output JS version), \`module\`, \`outDir\`/\`rootDir\`, \`strict\`, \`esModuleInterop\`, and \`lib\`. A good config is the foundation of a maintainable TypeScript project.

**Hinglish Explanation**

\`tsconfig.json\` woh configuration file hai jo TypeScript compiler ko batati hai ki project kaise compile karna hai: kaunsi files include karni hain, kaunsa JavaScript version target karna hai, kaunsa module system use karna hai, output kahan jaaye, aur type checking kitni strict ho.  
Bina arguments ke \`tsc\` chalane par yahi file use hoti hai. Key options \`compilerOptions\` ke andar hoti hain: \`target\` (output JS version), \`module\`, \`outDir\`/\`rootDir\`, \`strict\`, \`esModuleInterop\`, aur \`lib\`. Achhi config ek maintainable TypeScript project ki neev hai.

**Key Interview Points**

* \`tsconfig.json\` configures how \`tsc\` compiles the project.

* \`target\`: which JS version to emit (e.g. ES2020).

* \`module\`: module system (CommonJS, ESNext).

* \`outDir\`/\`rootDir\`: output and source roots.

* \`strict\`: enables the full set of strict type-checking flags (recommended).

**Real-World Example**

Every real TypeScript project ships a tsconfig.json; turning on \`"strict": true\` is the single most impactful setting teams add to catch null bugs and implicit \`any\` early.

**Code — Full & Runnable**

// A typical tsconfig.json:  
//  
// {  
//   "compilerOptions": {  
//     "target": "ES2020",  
//     "module": "CommonJS",  
//     "rootDir": "src",  
//     "outDir": "dist",  
//     "strict": true,  
//     "esModuleInterop": true,  
//     "skipLibCheck": true,  
//     "forceConsistentCasingInFileNames": true  
//   },  
//   "include": \["src/\*\*/\*"\],  
//   "exclude": \["node\_modules", "dist"\]  
// }  
//  
// solution.ts — code that this config would compile.  
   
export const config \= {  
  target: "ES2020",  
  strict: true,  
} as const;  
   
export function describeConfig(): string {  
  return "target=" \+ config.target \+ ", strict=" \+ config.strict;  
}

**Test / Demo & Expected Output**

// test.ts — run: npx tsx test.ts  
import { describeConfig } from "./solution";  
   
console.log(describeConfig()); // target=ES2020, strict=true  
console.assert(describeConfig() \=== "target=ES2020, strict=true", "config described");  
console.log("tsconfig-basics assertions passed.");  
   
/\* EXPECTED OUTPUT:  
target=ES2020, strict=true  
tsconfig-basics assertions passed.  
\*/

**Common Follow-up Questions**

**Q: What does the \`target\` option control?**

**A:** The JavaScript language version the compiler emits (e.g. ES2020 vs ES5). It affects which features are down-leveled and what syntax appears in the output JS.

**Q: Why enable \`strict\` in tsconfig?**

**A:** It turns on the full suite of strict checks (strictNullChecks, noImplicitAny, etc.), catching far more bugs at compile time. It's the recommended default for new projects.

## **5\. Strict mode (TypeScript)**

**Simple Explanation (English)**

Setting \`"strict": true\` in tsconfig enables TypeScript's strict family of checks at once. The most important are \`strictNullChecks\` (null/undefined must be handled explicitly) and \`noImplicitAny\` (variables/params can't silently become \`any\`).

Strict mode forces you to deal with the cases that cause most real bugs — accessing a property of something that might be null, or passing the wrong type. It's stricter to write but dramatically safer; nearly all modern TypeScript projects enable it.

**Hinglish Explanation**

tsconfig me \`"strict": true\` set karna TypeScript ke strict checks ke poore parivaar ko ek saath enable kar deta hai. Sabse important hain \`strictNullChecks\` (null/undefined ko explicitly handle karna padta hai) aur \`noImplicitAny\` (variables/params silently \`any\` nahi ban sakte).  
Strict mode aapko un cases handle karne par majboor karta hai jo zyadatar real bugs banate hain — null ho sakti cheez ki property access karna, ya galat type pass karna. Likhna thoda strict, par kaafi safe; lagbhag saare modern TypeScript projects ise enable karte hain.

**Key Interview Points**

* \`strict: true\` enables many checks together.

* \`strictNullChecks\`: null/undefined are not assignable unless allowed.

* \`noImplicitAny\`: implicit \`any\` becomes an error.

* Forces explicit handling of nullable values (fewer runtime crashes).

* Recommended for virtually all projects.

**Real-World Example**

With strictNullChecks on, \`user.profile.name\` won't compile if \`profile\` might be undefined — forcing an explicit check or optional chaining, which eliminates a classic 'cannot read property of undefined' production crash.

**Code — Full & Runnable**

// solution.ts — strictNullChecks forces handling of nullable values.  
   
export function getLength(text: string | null): number {  
  // Must handle null explicitly under strictNullChecks:  
  if (text \=== null) return 0;  
  return text.length;  
}  
   
// noImplicitAny would flag a parameter with no inferable type:  
export function greet(name: string): string { // explicit type avoids implicit any  
  return "Hi " \+ name;  
}

**Test / Demo & Expected Output**

// test.ts — run: npx tsx test.ts  
import { getLength, greet } from "./solution";  
   
console.log(getLength("hello")); // 5  
console.log(getLength(null));    // 0  
console.log(greet("Asha"));      // Hi Asha  
   
console.assert(getLength("hello") \=== 5, "length of string");  
console.assert(getLength(null) \=== 0, "null handled safely");  
console.assert(greet("Asha") \=== "Hi Asha", "typed greet");  
console.log("strict-mode assertions passed.");  
   
/\* EXPECTED OUTPUT:  
5  
0  
Hi Asha  
strict-mode assertions passed.  
\*/

**Common Follow-up Questions**

**Q: What does strictNullChecks change?**

**A:** It removes \`null\`/\`undefined\` from every type by default, so you must explicitly include them in a type (e.g. \`string | null\`) and handle them before use — preventing null-access bugs.

**Q: What is \`noImplicitAny\`?**

**A:** A strict flag that makes it an error when TypeScript can't infer a type and would otherwise fall back to \`any\`, forcing you to annotate types and avoid silently untyped code.

## **6\. Module resolution & tsconfig paths**

**Simple Explanation (English)**

Module resolution is how TypeScript figures out what an \`import\` refers to. The two main strategies are \`node\` (mimics Node.js resolution — node\_modules, index files, extensions) and the newer \`bundler\`/\`nodenext\` modes. It's set via \`moduleResolution\` in tsconfig.

\`paths\` (with \`baseUrl\`) lets you create import aliases so you can write \`import { x } from "@/utils"\` instead of long relative paths like \`../../../utils\`. Note: \`paths\` only affects type resolution at compile time — your bundler/runtime needs matching aliases to actually resolve them.

**Hinglish Explanation**

Module resolution ka matlab hai TypeScript kaise pata lagata hai ki ek \`import\` kis cheez ko refer kar raha hai. Do main strategies hain \`node\` (Node.js resolution ki nakal — node\_modules, index files, extensions) aur naye \`bundler\`/\`nodenext\` modes. Ye tsconfig me \`moduleResolution\` se set hota hai.  
\`paths\` (\`baseUrl\` ke saath) aapko import aliases banane deta hai taaki aap \`import { x } from "@/utils"\` likh sako lambe relative paths jaise \`../../../utils\` ke bajaye. Note: \`paths\` sirf compile-time type resolution affect karta hai — actually resolve karne ke liye aapke bundler/runtime me matching aliases chahiye.

**Key Interview Points**

* \`moduleResolution\` controls how imports are located (node/bundler/nodenext).

* \`baseUrl\` \+ \`paths\` create import aliases (e.g. \`@/...\`).

* Aliases replace long relative paths for cleaner imports.

* \`paths\` affects TS type resolution only — runtime/bundler must match.

* Common in React/Next.js setups for tidy module imports.

**Real-World Example**

A Next.js project configures \`"@/\*": \["./src/\*"\]\` so components import with \`@/components/Button\` instead of brittle \`../../../components/Button\`, making refactors and moves painless.

**Code — Full & Runnable**

// tsconfig.json snippet enabling path aliases:  
//  
// {  
//   "compilerOptions": {  
//     "baseUrl": ".",  
//     "paths": {  
//       "@/utils/\*": \["src/utils/\*"\],  
//       "@/components/\*": \["src/components/\*"\]  
//     },  
//     "moduleResolution": "bundler"  
//   }  
// }  
//  
// Then you write:  
//   import { formatMoney } from "@/utils/money";  // instead of ../../../utils/money  
//  
// solution.ts — a tiny resolvable utility (relative import used here so it runs).  
   
export function formatMoney(amount: number): string {  
  return "$" \+ amount.toFixed(2);  
}

**Test / Demo & Expected Output**

// test.ts — run: npx tsx test.ts  
// (Real projects would import via an alias like "@/utils/money".)  
import { formatMoney } from "./solution";  
   
console.log(formatMoney(9.5)); // $9.50  
console.assert(formatMoney(9.5) \=== "$9.50", "alias-style util works");  
console.log("module-resolution assertions passed.");  
   
/\* EXPECTED OUTPUT:  
$9.50  
module-resolution assertions passed.  
\*/

**Common Follow-up Questions**

**Q: What do \`paths\` in tsconfig do?**

**A:** They define import aliases (with \`baseUrl\`) so you can use short names like \`@/utils\` instead of long relative paths. They only affect TypeScript's compile-time resolution.

**Q: Do tsconfig \`paths\` work at runtime automatically?**

**A:** No. They're for the type checker only. Your runtime/bundler (webpack, Vite, ts-node, etc.) must be configured with the same aliases to resolve them when the code actually runs.

## **7\. string / number / boolean types**

**Simple Explanation (English)**

These are TypeScript's basic primitive types, matching JavaScript's primitives: \`string\` for text, \`number\` for all numeric values (integers and floats alike), and \`boolean\` for true/false. You annotate variables, parameters, and return values with them.

TypeScript can also INFER these automatically (\`let x \= 5\` infers \`number\`), so you don't always need explicit annotations. Use lowercase \`string\`/\`number\`/\`boolean\` (the primitive types) — not the capitalized \`String\`/\`Number\`/\`Boolean\` wrapper object types, which you almost never want.

**Hinglish Explanation**

Ye TypeScript ke basic primitive types hain, JavaScript ke primitives se match karte: text ke liye \`string\`, sabhi numeric values (integers aur floats dono) ke liye \`number\`, aur true/false ke liye \`boolean\`. Inse aap variables, parameters, aur return values annotate karte ho.  
TypeScript inhe automatically INFER bhi kar leta hai (\`let x \= 5\` se \`number\` infer hota hai), isliye hamesha explicit annotations ki zarurat nahi. Lowercase \`string\`/\`number\`/\`boolean\` (primitive types) use karo — capitalized \`String\`/\`Number\`/\`Boolean\` wrapper object types nahi, jinki aapko lagbhag kabhi zarurat nahi.

**Key Interview Points**

* \`string\`, \`number\` (ints \+ floats), \`boolean\` are the core primitives.

* Annotate via \`let x: number \= 5\` or rely on inference (\`let x \= 5\`).

* Use lowercase primitive types, not \`String\`/\`Number\`/\`Boolean\` wrappers.

* Types flow into parameters and return values for safety.

* Mismatched assignments (e.g. number into a string) are compile errors.

**Real-World Example**

A pricing function typed \`(price: number, currency: string, taxable: boolean) \=\> string\` makes its contract obvious and rejects callers that, say, pass the price as a string from a form field without conversion.

**Code — Full & Runnable**

// solution.ts — basic primitive types in action.  
   
export function describeProduct(  
  name: string,  
  price: number,  
  inStock: boolean  
): string {  
  const status \= inStock ? "available" : "sold out";  
  return name \+ " costs $" \+ price.toFixed(2) \+ " (" \+ status \+ ")";  
}  
   
// Inference: TS infers the types here without annotations.  
export const inferred \= { count: 3, label: "items", ready: true };

**Test / Demo & Expected Output**

// test.ts — run: npx tsx test.ts  
import { describeProduct, inferred } from "./solution";  
   
console.log(describeProduct("Pen", 1.5, true));   // Pen costs $1.50 (available)  
console.log(describeProduct("Lamp", 20, false));  // Lamp costs $20.00 (sold out)  
console.log(inferred.count, inferred.label, inferred.ready); // 3 items true  
   
console.assert(describeProduct("Pen", 1.5, true) \=== "Pen costs $1.50 (available)", "string/number/boolean");  
console.assert(describeProduct("Lamp", 20, false).includes("sold out"), "boolean branch");  
console.log("primitive-types assertions passed.");  
   
/\* EXPECTED OUTPUT:  
Pen costs $1.50 (available)  
Lamp costs $20.00 (sold out)  
3 items true  
primitive-types assertions passed.  
\*/

**Common Follow-up Questions**

**Q: Does TypeScript distinguish integers from floats?**

**A:** No. There's a single \`number\` type for all numeric values — integers, floats, hex, etc. (BigInt has its own \`bigint\` type.)

**Q: Why use \`string\` instead of \`String\`?**

**A:** \`string\` is the primitive type you almost always want. \`String\` is the wrapper object type; using it is misleading and can cause subtle issues, so lowercase primitives are the convention.

## **8\. null / undefined types**

**Simple Explanation (English)**

\`null\` and \`undefined\` each have their own types in TypeScript. Under \`strictNullChecks\`, they are NOT automatically part of other types — so a \`string\` cannot be \`null\` unless you explicitly write \`string | null\`. This is what forces safe handling of 'missing' values.

The convention: \`undefined\` usually means 'not provided/not yet set', and \`null\` means 'intentionally empty'. To use a possibly-null value you must narrow it first (an \`if\` check, optional chaining \`?.\`, or the non-null assertion \`\!\` when you're certain).

**Hinglish Explanation**

\`null\` aur \`undefined\` dono ke TypeScript me apne types hain. \`strictNullChecks\` ke under, ye automatically doosre types ka hissa NAHI hote — to ek \`string\` \`null\` nahi ho sakti jab tak aap explicitly \`string | null\` na likho. Yahi 'missing' values ke safe handling par majboor karta hai.  
Convention: \`undefined\` ka matlab aam taur par 'provide nahi kiya/abhi set nahi', aur \`null\` ka matlab 'jaan-bujhkar khaali'. Possibly-null value use karne ke liye pehle use narrow karo (\`if\` check, optional chaining \`?.\`, ya non-null assertion \`\!\` jab aap sure ho).

**Key Interview Points**

* \`null\` and \`undefined\` have distinct types.

* Under strictNullChecks they're excluded from other types unless added (\`T | null\`).

* Convention: \`undefined\` \= not set/provided; \`null\` \= intentionally empty.

* Narrow before use: \`if\` check, optional chaining \`?.\`, or \`??\` default.

* Non-null assertion \`x\!\` tells TS 'this isn't null' — use sparingly.

**Real-World Example**

An API field that may be absent is typed \`email: string | null\`. The compiler then forces every consumer to handle the null case (e.g. show 'no email on file') instead of crashing when \`email\` is missing.

**Code — Full & Runnable**

// solution.ts — handling nullable types safely.  
   
export function displayName(name: string | null | undefined): string {  
  // narrow with nullish coalescing  
  return name ?? "Guest";  
}  
   
export function firstInitial(name: string | null): string {  
  if (name \=== null || name.length \=== 0\) return "?";  
  return name\[0\].toUpperCase();  
}

**Test / Demo & Expected Output**

// test.ts — run: npx tsx test.ts  
import { displayName, firstInitial } from "./solution";  
   
console.log(displayName("Asha"));    // Asha  
console.log(displayName(null));      // Guest  
console.log(displayName(undefined)); // Guest  
console.log(firstInitial("ravi"));   // R  
console.log(firstInitial(null));     // ?  
   
console.assert(displayName(null) \=== "Guest", "null defaults to Guest");  
console.assert(displayName("Asha") \=== "Asha", "value passes through");  
console.assert(firstInitial("ravi") \=== "R", "first initial uppercased");  
console.assert(firstInitial(null) \=== "?", "null initial handled");  
console.log("null/undefined assertions passed.");  
   
/\* EXPECTED OUTPUT:  
Asha  
Guest  
Guest  
R  
?  
null/undefined assertions passed.  
\*/

**Common Follow-up Questions**

**Q: Under strictNullChecks, can a \`string\` variable hold null?**

**A:** No. You must explicitly widen the type to \`string | null\` (or \`| undefined\`). Otherwise assigning null/undefined is a compile error, forcing you to handle those cases.

**Q: What's the conventional difference between null and undefined?**

**A:** \`undefined\` typically means a value was never set or provided; \`null\` typically means it was intentionally set to 'empty'. TypeScript treats them as distinct types.

## **9\. any vs unknown**

**Simple Explanation (English)**

\`any\` opts a value OUT of type checking entirely — you can do anything with it and TypeScript won't complain, which defeats the purpose of types and can hide bugs. \`unknown\` is the type-safe counterpart: it can hold any value, but you must narrow/check it before you can use it.

Rule of thumb: prefer \`unknown\` over \`any\` for values of uncertain type (like JSON from an API or user input), because \`unknown\` forces you to validate before use. Reserve \`any\` for rare escape hatches during migration.

**Hinglish Explanation**

\`any\` ek value ko type checking se poori tarah BAHAR kar deta hai — aap usse kuch bhi kar sakte ho aur TypeScript complain nahi karega, jo types ka maksad hi khatam kar deta hai aur bugs chhupa sakta hai. \`unknown\` iska type-safe roop hai: ye koi bhi value rakh sakta hai, par use karne se pehle aapko narrow/check karna padta hai.  
Rule of thumb: uncertain type wali values (jaise API se JSON ya user input) ke liye \`any\` ke bajaye \`unknown\` prefer karo, kyunki \`unknown\` aapko use se pehle validate karne par majboor karta hai. \`any\` ko migration ke dauraan rare escape hatch ke liye rakho.

**Key Interview Points**

* \`any\` disables type checking — unsafe, hides bugs.

* \`unknown\` accepts any value but blocks usage until narrowed.

* Prefer \`unknown\` for uncertain values (API data, user input).

* Narrow \`unknown\` with typeof/instanceof/checks before using it.

* Use \`any\` only as a deliberate, temporary escape hatch.

**Real-World Example**

Parsing untrusted JSON: typing it as \`unknown\` forces a validation step (e.g. checking shape) before you treat it as a \`User\`, preventing the classic bug where bad data flows unchecked through the app.

**Code — Full & Runnable**

// solution.ts — unknown forces safe narrowing; any does not.  
   
export function safeLength(value: unknown): number {  
  // Must narrow before use:  
  if (typeof value \=== "string") return value.length;  
  if (Array.isArray(value)) return value.length;  
  return 0;  
}  
   
// With 'any' this would compile but could crash at runtime:  
//   function unsafe(value: any) { return value.length; } // no checks\!  
   
export function isUser(value: unknown): value is { id: number; name: string } {  
  return (  
    typeof value \=== "object" && value \!== null &&  
    "id" in value && "name" in value  
  );  
}

**Test / Demo & Expected Output**

// test.ts — run: npx tsx test.ts  
import { safeLength, isUser } from "./solution";  
   
console.log(safeLength("hello"));   // 5  
console.log(safeLength(\[1, 2, 3\])); // 3  
console.log(safeLength(42));        // 0 (not narrowable)  
console.log(isUser({ id: 1, name: "Asha" })); // true  
console.log(isUser({ id: 1 }));     // false  
   
console.assert(safeLength("hello") \=== 5, "string length");  
console.assert(safeLength(\[1, 2, 3\]) \=== 3, "array length");  
console.assert(safeLength(42) \=== 0, "non-narrowable \-\> 0");  
console.assert(isUser({ id: 1, name: "Asha" }) \=== true, "type guard passes");  
console.assert(isUser({ id: 1 }) \=== false, "type guard fails");  
console.log("any-vs-unknown assertions passed.");  
   
/\* EXPECTED OUTPUT:  
5  
3  
0  
true  
false  
any-vs-unknown assertions passed.  
\*/

**Common Follow-up Questions**

**Q: Why prefer unknown over any?**

**A:** \`unknown\` keeps type safety: it accepts any value but won't let you use it until you narrow/validate the type, whereas \`any\` disables checking entirely and can hide runtime bugs.

**Q: How do you use an \`unknown\` value?**

**A:** Narrow it first — with \`typeof\`, \`instanceof\`, \`Array.isArray\`, property checks, or a custom type guard (\`value is T\`) — after which TypeScript treats it as the narrowed type.

## **10\. never vs void**

**Simple Explanation (English)**

\`void\` is the return type of a function that doesn't return a useful value (it returns \`undefined\` implicitly) — like a function that just logs something. \`never\` is the type of a value that NEVER occurs: the return type of a function that never finishes normally (always throws or loops forever).

\`never\` is also what's left after you've narrowed away every possible type, which makes it perfect for exhaustiveness checks in \`switch\` statements — if a new case is added and unhandled, assigning it to \`never\` becomes a compile error.

**Hinglish Explanation**

\`void\` us function ka return type hai jo koi useful value return nahi karta (implicitly \`undefined\` return karta hai) — jaise sirf kuch log karne wala function. \`never\` us value ka type hai jo KABHI occur nahi hoti: us function ka return type jo kabhi normally khatam hi nahi hota (hamesha throw ya infinite loop).  
\`never\` woh bhi hai jo har possible type narrow karne ke baad bachta hai, jisse ye \`switch\` statements me exhaustiveness checks ke liye perfect hai — agar naya case add ho aur unhandled rahe, to use \`never\` me assign karna compile error ban jaata hai.

**Key Interview Points**

* \`void\`: function returns no useful value (effectively undefined).

* \`never\`: a value that never occurs (function always throws or never ends).

* \`never\` is the result of narrowing away all possibilities.

* Use \`never\` for exhaustiveness checks in switch/discriminated unions.

* A function returning \`never\` can't reach a normal \`return\`.

**Real-World Example**

An exhaustive \`switch\` over a union of shapes uses a \`never\` default case so that if someone later adds a new shape and forgets to handle it, the build fails — catching the omission at compile time.

**Code — Full & Runnable**

// solution.ts — void, never, and exhaustiveness checking.  
   
export function logMessage(msg: string): void {  
  console.log("LOG: " \+ msg); // returns nothing useful  
}  
   
export function fail(message: string): never {  
  throw new Error(message); // never returns normally  
}  
   
type Shape \= { kind: "circle"; r: number } | { kind: "square"; s: number };  
   
export function area(shape: Shape): number {  
  switch (shape.kind) {  
    case "circle": return Math.PI \* shape.r \* shape.r;  
    case "square": return shape.s \* shape.s;  
    default: {  
      const \_exhaustive: never \= shape; // compile error if a case is missed  
      return \_exhaustive;  
    }  
  }  
}

**Test / Demo & Expected Output**

// test.ts — run: npx tsx test.ts  
import { logMessage, fail, area } from "./solution";  
   
logMessage("hello"); // LOG: hello  
console.log(Math.round(area({ kind: "circle", r: 2 }))); // 13  
console.log(area({ kind: "square", s: 4 }));             // 16  
   
let threw \= false;  
try { fail("boom"); } catch (e) { threw \= e instanceof Error; }  
   
console.assert(Math.round(area({ kind: "circle", r: 2 })) \=== 13, "circle area");  
console.assert(area({ kind: "square", s: 4 }) \=== 16, "square area");  
console.assert(threw, "fail() always throws (never)");  
console.log("never-vs-void assertions passed.");  
   
/\* EXPECTED OUTPUT:  
LOG: hello  
13  
16  
never-vs-void assertions passed.  
\*/

**Common Follow-up Questions**

**Q: Difference between void and never?**

**A:** \`void\` means the function returns no useful value (it completes and yields undefined). \`never\` means the function never returns at all — it always throws or loops forever — or a value that can't exist.

**Q: How does never enable exhaustiveness checks?**

**A:** After handling all union members, the remaining type narrows to \`never\`. Assigning the value to a \`never\` variable in the default case forces a compile error if any case is left unhandled.

## **11\. Literal Types**

**Simple Explanation (English)**

A literal type restricts a value to one EXACT value rather than a whole primitive type. For example \`type Direction \= "up" | "down"\` allows only those two strings — not any string. Literal types exist for strings, numbers, and booleans.

Combined with unions, literal types model a fixed set of allowed options (like a status or a mode) far more safely than a plain \`string\`. The compiler then rejects any value outside the allowed set and powers exact autocomplete.

**Hinglish Explanation**

Literal type ek value ko poore primitive type ke bajaye ek EXACT value tak seemit karta hai. Jaise \`type Direction \= "up" | "down"\` sirf un do strings ko allow karta hai — kisi bhi string ko nahi. Literal types strings, numbers, aur booleans ke liye hote hain.  
Unions ke saath mila kar, literal types allowed options ka ek fixed set model karte hain (jaise status ya mode) plain \`string\` se kaafi safe tarike se. Phir compiler allowed set ke bahar koi value reject karta hai aur exact autocomplete deta hai.

**Key Interview Points**

* Restricts a value to one exact literal (e.g. \`"GET"\`, \`200\`, \`true\`).

* Usually combined with unions for a fixed option set.

* Safer than \`string\`/\`number\` — rejects out-of-set values.

* Enables precise autocomplete for allowed values.

* Common for statuses, modes, HTTP methods, sizes.

**Real-World Example**

Typing a button's \`size\` as \`"sm" | "md" | "lg"\` instead of \`string\` means the editor autocompletes the options and the compiler rejects a typo like \`"meduim"\` immediately.

**Code — Full & Runnable**

// solution.ts — literal types restrict to exact values.  
   
export type Size \= "sm" | "md" | "lg";  
   
export function pixelSize(size: Size): number {  
  const map: Record\<Size, number\> \= { sm: 12, md: 16, lg: 24 };  
  return map\[size\];  
}  
   
export type HttpMethod \= "GET" | "POST" | "PUT" | "DELETE";  
export function isSafeMethod(method: HttpMethod): boolean {  
  return method \=== "GET";  
}

**Test / Demo & Expected Output**

// test.ts — run: npx tsx test.ts  
import { pixelSize, isSafeMethod } from "./solution";  
   
console.log(pixelSize("md"));      // 16  
console.log(pixelSize("lg"));      // 24  
console.log(isSafeMethod("GET"));  // true  
console.log(isSafeMethod("POST")); // false  
// pixelSize("xl"); // compile error: not assignable to Size  
   
console.assert(pixelSize("md") \=== 16, "md size");  
console.assert(pixelSize("lg") \=== 24, "lg size");  
console.assert(isSafeMethod("GET") \=== true, "GET is safe");  
console.assert(isSafeMethod("POST") \=== false, "POST is not safe");  
console.log("literal-types assertions passed.");  
   
/\* EXPECTED OUTPUT:  
16  
24  
true  
false  
literal-types assertions passed.  
\*/

**Common Follow-up Questions**

**Q: What is a literal type?**

**A:** A type that allows only one specific value (e.g. the string \`"up"\` or the number \`200\`), rather than the entire primitive type. They're usually combined into unions for a fixed set of options.

**Q: Why use a literal union instead of \`string\`?**

**A:** It restricts values to a known set, catching typos at compile time and providing exact autocomplete — far safer than accepting any string for things like statuses or modes.

## **12\. Type Assertions**

**Simple Explanation (English)**

A type assertion tells the compiler 'trust me, I know the type of this value', overriding its inference. The syntax is \`value as Type\` (or the older \`\<Type\>value\`). It does NOT convert or check anything at runtime — it's purely a compile-time instruction.

Use assertions sparingly and only when you genuinely know more than the compiler (e.g. you know a DOM element is an \`HTMLInputElement\`). Asserting the wrong type silences the checker and can lead to runtime errors, so it's an escape hatch, not a tool for everyday typing.

**Hinglish Explanation**

Type assertion compiler ko kehta hai 'mujhpe bharosa karo, mujhe is value ka type pata hai', uski inference ko override karke. Syntax hai \`value as Type\` (ya purana \`\<Type\>value\`). Ye runtime par kuch convert ya check NAHI karta — ye sirf ek compile-time instruction hai.  
Assertions ko kam aur sirf tab use karo jab aap sach me compiler se zyada jaante ho (jaise aapko pata hai ki ek DOM element \`HTMLInputElement\` hai). Galat type assert karne par checker chup ho jaata hai aur runtime errors aa sakte hain, isliye ye ek escape hatch hai, rozmarra typing ka tool nahi.

**Key Interview Points**

* Syntax: \`value as Type\` (or \`\<Type\>value\`).

* Overrides the compiler's inferred type — a compile-time-only hint.

* Does NOT convert or validate at runtime.

* Use only when you genuinely know the type better than TS.

* Wrong assertions hide bugs; prefer narrowing/type guards when possible.

**Real-World Example**

Reading a DOM input: \`const input \= document.querySelector("\#email") as HTMLInputElement\` lets you access \`input.value\`, which TypeScript wouldn't allow on the generic \`Element\` type returned by querySelector.

**Code — Full & Runnable**

// solution.ts — assertions tell TS a more specific type.  
   
interface ApiResponse { data: { id: number; name: string }; }  
   
export function parseResponse(json: string): ApiResponse {  
  // JSON.parse returns 'any'; we assert the expected shape.  
  return JSON.parse(json) as ApiResponse;  
}  
   
// Narrowing 'unknown' to a known type via assertion (after a check is safer).  
export function asNumber(value: unknown): number {  
  return value as number; // assertion: no runtime conversion  
}

**Test / Demo & Expected Output**

// test.ts — run: npx tsx test.ts  
import { parseResponse, asNumber } from "./solution";  
   
const res \= parseResponse('{"data":{"id":1,"name":"Asha"}}');  
console.log(res.data.name); // Asha  
console.log(asNumber(42));  // 42  
   
console.assert(res.data.id \=== 1, "asserted shape gives typed access");  
console.assert(res.data.name \=== "Asha", "name accessible");  
console.assert(asNumber(42) \=== 42, "assertion is compile-time only (value unchanged)");  
console.log("type-assertions assertions passed.");  
   
/\* EXPECTED OUTPUT:  
Asha  
42  
type-assertions assertions passed.  
\*/

**Common Follow-up Questions**

**Q: Do type assertions change the value at runtime?**

**A:** No. They're purely compile-time hints that override the inferred type. No conversion or validation happens at runtime — \`value as number\` doesn't actually convert anything.

**Q: When is a type assertion appropriate?**

**A:** Only when you genuinely know the type better than the compiler can infer — e.g. a specific DOM element type. Otherwise prefer narrowing/type guards, since a wrong assertion silently hides bugs.

## **13\. as const Assertions**

**Simple Explanation (English)**

\`as const\` tells TypeScript to infer the narrowest, most specific (and readonly) type for a literal. Instead of widening \`"up"\` to \`string\` or \`{ x: 1 }\` to \`{ x: number }\`, it keeps the exact literal values and marks everything as readonly.

It's invaluable for creating typed constant objects/arrays where you want the precise literal types preserved — for configuration, action-type constants, or deriving a literal union from an array's values via \`typeof arr\[number\]\`.

**Hinglish Explanation**

\`as const\` TypeScript ko kehta hai ki literal ke liye sabse narrow, sabse specific (aur readonly) type infer kare. \`"up"\` ko \`string\` ya \`{ x: 1 }\` ko \`{ x: number }\` me widen karne ke bajaye, ye exact literal values rakhta hai aur sab kuch readonly mark karta hai.  
Ye typed constant objects/arrays banane ke liye bohot useful hai jahan aap precise literal types preserve karna chahte ho — configuration, action-type constants, ya \`typeof arr\[number\]\` se array ki values se literal union derive karne ke liye.

**Key Interview Points**

* \`as const\` infers the narrowest literal types and makes them readonly.

* Prevents widening (\`"up"\` stays \`"up"\`, not \`string\`).

* Great for config objects and constant arrays.

* Derive a union from an array: \`typeof arr\[number\]\`.

* Everything becomes deeply readonly (can't be mutated).

**Real-World Example**

Defining \`const ROLES \= \["admin", "user", "guest"\] as const\` lets you derive \`type Role \= typeof ROLES\[number\]\` ('admin' | 'user' | 'guest'), keeping the list and the type in perfect sync from a single source.

**Code — Full & Runnable**

// solution.ts — as const preserves literal types and readonly-ness.  
   
export const ROLES \= \["admin", "user", "guest"\] as const;  
export type Role \= typeof ROLES\[number\]; // "admin" | "user" | "guest"  
   
export function isAdmin(role: Role): boolean {  
  return role \=== "admin";  
}  
   
export const CONFIG \= { retries: 3, mode: "fast" } as const;  
// CONFIG.retries is the literal type 3 (readonly), not 'number'.  
   
export function describeConfig(): string {  
  return "retries=" \+ CONFIG.retries \+ ", mode=" \+ CONFIG.mode;  
}

**Test / Demo & Expected Output**

// test.ts — run: npx tsx test.ts  
import { ROLES, isAdmin, describeConfig } from "./solution";  
   
console.log(\[...ROLES\]);          // \['admin','user','guest'\]  
console.log(isAdmin("admin"));    // true  
console.log(isAdmin("guest"));    // false  
console.log(describeConfig());    // retries=3, mode=fast  
   
console.assert(ROLES.length \=== 3, "three roles");  
console.assert(isAdmin("admin") \=== true, "admin check");  
console.assert(isAdmin("guest") \=== false, "guest is not admin");  
console.assert(describeConfig() \=== "retries=3, mode=fast", "config literal preserved");  
console.log("as-const assertions passed.");  
   
/\* EXPECTED OUTPUT:  
\[ 'admin', 'user', 'guest' \]  
true  
false  
retries=3, mode=fast  
as-const assertions passed.  
\*/

**Common Follow-up Questions**

**Q: What does \`as const\` do to a literal?**

**A:** It infers the narrowest possible (literal) type and marks the whole structure as readonly — so \`"up"\` stays the literal \`"up"\` instead of widening to \`string\`, and objects/arrays become immutable in the type system.

**Q: How do you derive a union type from a const array?**

**A:** Use \`as const\` on the array, then \`typeof arr\[number\]\` produces a union of its element literal types — keeping the data and the type in sync from one declaration.

## **14\. Union Types**

**Simple Explanation (English)**

A union type means a value can be one of several types, written with \`|\`: \`string | number\` accepts either. Unions model 'this OR that' — a value that could legitimately take different forms (e.g. an id that's a number or a string).

Before using a union value's type-specific members, you must NARROW it (with \`typeof\`, \`instanceof\`, property checks, or discriminant fields) so TypeScript knows which member you're dealing with. Discriminated unions (a shared literal \`kind\` field) are an especially powerful pattern.

**Hinglish Explanation**

Union type ka matlab ek value kai types me se ek ho sakti hai, \`|\` se likhte hain: \`string | number\` dono accept karta hai. Unions 'ye YA woh' model karte hain — ek value jo legitimately alag forms le sakti hai (jaise ek id jo number ya string ho).  
Union value ke type-specific members use karne se pehle aapko use NARROW karna padta hai (\`typeof\`, \`instanceof\`, property checks, ya discriminant fields se) taaki TypeScript jaane aap kis member se deal kar rahe ho. Discriminated unions (ek shared literal \`kind\` field) ek khaaskar powerful pattern hai.

**Key Interview Points**

* \`A | B\` means the value is one of the listed types.

* Models 'this OR that' alternatives.

* Narrow before using type-specific members (typeof/instanceof/checks).

* Discriminated unions use a shared literal field (e.g. \`kind\`) to narrow.

* Common for ids, results, and shape variants.

**Real-World Example**

An API result typed as \`{ status: "ok"; data: T } | { status: "error"; message: string }\` lets the compiler force you to handle both cases — you can't read \`.data\` without first checking \`status \=== "ok"\`.

**Code — Full & Runnable**

// solution.ts — union \+ narrowing, and a discriminated union.  
   
export function formatId(id: string | number): string {  
  // narrow with typeof  
  return typeof id \=== "number" ? "\#" \+ id : id.toUpperCase();  
}  
   
type Result \=  
  | { status: "ok"; data: number }  
  | { status: "error"; message: string };  
   
export function handle(result: Result): string {  
  if (result.status \=== "ok") return "value:" \+ result.data; // narrowed  
  return "error:" \+ result.message;                          // narrowed  
}

**Test / Demo & Expected Output**

// test.ts — run: npx tsx test.ts  
import { formatId, handle } from "./solution";  
   
console.log(formatId(42));    // \#42  
console.log(formatId("abc")); // ABC  
console.log(handle({ status: "ok", data: 10 }));            // value:10  
console.log(handle({ status: "error", message: "bad" }));  // error:bad  
   
console.assert(formatId(42) \=== "\#42", "number id");  
console.assert(formatId("abc") \=== "ABC", "string id");  
console.assert(handle({ status: "ok", data: 10 }) \=== "value:10", "ok branch");  
console.assert(handle({ status: "error", message: "bad" }) \=== "error:bad", "error branch");  
console.log("union-types assertions passed.");  
   
/\* EXPECTED OUTPUT:  
\#42  
ABC  
value:10  
error:bad  
union-types assertions passed.  
\*/

**Common Follow-up Questions**

**Q: Why must you narrow a union before using it?**

**A:** Because TypeScript only lets you access members common to all union members until you narrow. Narrowing (typeof, instanceof, discriminant checks) tells the compiler which specific type you have.

**Q: What is a discriminated union?**

**A:** A union where each member has a shared literal field (like \`kind\` or \`status\`). Checking that field narrows the union to a single member, enabling safe, exhaustive handling.

## **15\. Intersection Types**

**Simple Explanation (English)**

An intersection type combines multiple types into one that has ALL of their members, written with \`&\`: \`A & B\` is a value that satisfies both \`A\` and \`B\` simultaneously. Where unions mean 'one OR the other', intersections mean 'both AND together'.

Intersections are used to compose/merge types — for example, adding common fields (like timestamps or an id) to many entity types, or combining several capability/mixin interfaces into one object type.

**Hinglish Explanation**

Intersection type kai types ko ek me combine karta hai jisme un sabke SAARE members hote hain, \`&\` se likhte hain: \`A & B\` woh value hai jo \`A\` aur \`B\` dono ko ek saath satisfy kare. Jahan unions ka matlab 'ek YA doosra', wahan intersections ka matlab 'dono AUR saath me'.  
Intersections types ko compose/merge karne ke liye use hote hain — jaise kai entity types me common fields add karna (jaise timestamps ya id), ya kai capability/mixin interfaces ko ek object type me combine karna.

**Key Interview Points**

* \`A & B\` has ALL members of both A and B.

* Union \= OR; Intersection \= AND (must satisfy all).

* Used to compose/merge types and add shared fields.

* Great for mixins and attaching common metadata.

* Conflicting member types in an intersection become \`never\`.

**Real-World Example**

Adding audit fields to entities: \`type Entity\<T\> \= T & { id: number; createdAt: string }\` gives every entity its specific fields PLUS the shared id/timestamp, without repeating those fields in each type.

**Code — Full & Runnable**

// solution.ts — intersection composes types.  
   
interface HasId { id: number; }  
interface HasTimestamp { createdAt: string; }  
   
type Entity\<T\> \= T & HasId & HasTimestamp;  
   
interface ProductFields { name: string; price: number; }  
type Product \= Entity\<ProductFields\>;  
   
export function makeProduct(name: string, price: number): Product {  
  return { id: 1, createdAt: "2025-01-01", name, price };  
}  
   
export function summary(p: Product): string {  
  return p.name \+ " ($" \+ p.price \+ ") \#" \+ p.id;  
}

**Test / Demo & Expected Output**

// test.ts — run: npx tsx test.ts  
import { makeProduct, summary } from "./solution";  
   
const p \= makeProduct("Lamp", 20);  
console.log(p);          // has id, createdAt, name, price  
console.log(summary(p)); // Lamp ($20) \#1  
   
console.assert(p.id \=== 1 && p.name \=== "Lamp", "intersection merges all fields");  
console.assert(typeof p.createdAt \=== "string", "timestamp field present");  
console.assert(summary(p) \=== "Lamp ($20) \#1", "summary uses combined fields");  
console.log("intersection-types assertions passed.");  
   
/\* EXPECTED OUTPUT:  
{ id: 1, createdAt: '2025-01-01', name: 'Lamp', price: 20 }  
Lamp ($20) \#1  
intersection-types assertions passed.  
\*/

**Common Follow-up Questions**

**Q: Difference between union and intersection types?**

**A:** A union (\`A | B\`) is one of the types (OR) and exposes only common members until narrowed. An intersection (\`A & B\`) must satisfy all types (AND) and has the combined members of all of them.

**Q: What happens if intersected types have a conflicting property?**

**A:** If the same property has incompatible types in each, the resulting property type becomes \`never\` (no value can satisfy both), effectively making it unusable.

## **16\. Type Aliases**

**Simple Explanation (English)**

A type alias gives a name to any type using the \`type\` keyword: \`type ID \= string | number\`. It doesn't create a new type — it's a reusable label for an existing one, which makes complex types readable and DRY.

Aliases can name unions, intersections, primitives, objects, tuples, functions, and generics. They differ from interfaces in that they can alias non-object types (like unions) and can't be 'reopened'/merged, whereas interfaces are best for object shapes and support declaration merging.

**Hinglish Explanation**

Type alias kisi bhi type ko \`type\` keyword se naam deta hai: \`type ID \= string | number\`. Ye naya type nahi banata — ye existing type ka ek reusable label hai, jo complex types ko readable aur DRY banata hai.  
Aliases unions, intersections, primitives, objects, tuples, functions, aur generics ko naam de sakte hain. Ye interfaces se is tarah alag hain ki ye non-object types (jaise unions) ko alias kar sakte hain aur 'reopen'/merge nahi ho sakte, jabki interfaces object shapes ke liye best hain aur declaration merging support karte hain.

**Key Interview Points**

* \`type Name \= ...\` names any type for reuse.

* Can alias unions, intersections, primitives, tuples, functions, objects.

* Improves readability and avoids repetition (DRY).

* Unlike interfaces, can name non-object types and don't merge.

* Often interchangeable with interfaces for object shapes.

**Real-World Example**

Defining \`type Handler \= (event: string) \=\> void\` once and reusing it across many function signatures keeps callback types consistent and lets you change the signature in a single place.

**Code — Full & Runnable**

// solution.ts — type aliases for unions, objects, and functions.  
   
export type ID \= string | number;  
export type Point \= { x: number; y: number };  
export type Transformer \= (value: number) \=\> number;  
   
export function distance(a: Point, b: Point): number {  
  return Math.hypot(b.x \- a.x, b.y \- a.y);  
}  
   
export function applyAll(value: number, fns: Transformer\[\]): number {  
  return fns.reduce((acc, fn) \=\> fn(acc), value);  
}

**Test / Demo & Expected Output**

// test.ts — run: npx tsx test.ts  
import { distance, applyAll, Transformer } from "./solution";  
   
console.log(distance({ x: 0, y: 0 }, { x: 3, y: 4 })); // 5  
const fns: Transformer\[\] \= \[(n) \=\> n \+ 1, (n) \=\> n \* 2\];  
console.log(applyAll(5, fns)); // (5+1)\*2 \= 12  
   
console.assert(distance({ x: 0, y: 0 }, { x: 3, y: 4 }) \=== 5, "distance via aliased Point");  
console.assert(applyAll(5, fns) \=== 12, "applies aliased Transformer fns");  
console.log("type-aliases assertions passed.");  
   
/\* EXPECTED OUTPUT:  
5  
12  
type-aliases assertions passed.  
\*/

**Common Follow-up Questions**

**Q: Type alias vs interface — when does it matter?**

**A:** Aliases can name any type (unions, tuples, functions, primitives) but can't be merged. Interfaces are ideal for object shapes and support declaration merging/extends. For plain object types they're largely interchangeable.

**Q: Does a type alias create a new distinct type?**

**A:** No. It's just a name for an existing type. \`type ID \= string\` makes \`ID\` and \`string\` interchangeable; it doesn't create a separate nominal type.

## **17\. Interfaces**

**Simple Explanation (English)**

An interface describes the SHAPE of an object — its property names and types, and method signatures. It's the primary tool for typing objects, class contracts, and function parameters in TypeScript.

Interfaces support optional (\`?\`) and readonly properties, method definitions, and can be extended and implemented by classes. A distinctive feature is declaration merging: declaring the same interface name twice merges them — useful for augmenting existing types.

**Hinglish Explanation**

Interface ek object ki SHAPE describe karta hai — uske property names aur types, aur method signatures. Ye TypeScript me objects, class contracts, aur function parameters ko type karne ka primary tool hai.  
Interfaces optional (\`?\`) aur readonly properties, method definitions support karte hain, aur classes inhe extend aur implement kar sakti hain. Ek khaas feature declaration merging hai: same interface naam do baar declare karne par woh merge ho jaate hain — existing types augment karne me useful.

**Key Interview Points**

* Describes object shape: properties, types, and methods.

* Supports optional (\`?\`) and \`readonly\` members.

* Can be \`extends\`-ed and \`implements\`-ed by classes.

* Supports declaration merging (same-name interfaces combine).

* Preferred for public object/class contracts.

**Real-World Example**

Defining \`interface User { id: number; name: string; email?: string }\` as the contract for user objects across the app means every function that takes a \`User\` agrees on its shape, and the optional \`email\` is handled safely.

**Code — Full & Runnable**

// solution.ts — an interface as an object contract.  
   
export interface User {  
  readonly id: number;   // can't be reassigned  
  name: string;  
  email?: string;        // optional  
  greet(): string;       // method signature  
}  
   
export function createUser(id: number, name: string, email?: string): User {  
  return {  
    id,  
    name,  
    email,  
    greet() { return "Hi, I'm " \+ this.name; },  
  };  
}

**Test / Demo & Expected Output**

// test.ts — run: npx tsx test.ts  
import { createUser } from "./solution";  
   
const u \= createUser(1, "Asha", "asha@x.com");  
console.log(u.greet());         // Hi, I'm Asha  
console.log(u.email);           // asha@x.com  
const u2 \= createUser(2, "Ravi");  
console.log(u2.email);          // undefined (optional)  
   
console.assert(u.id \=== 1 && u.name \=== "Asha", "interface shape");  
console.assert(u.greet() \=== "Hi, I'm Asha", "method works");  
console.assert(u2.email \=== undefined, "optional property omitted");  
console.log("interfaces assertions passed.");  
   
/\* EXPECTED OUTPUT:  
Hi, I'm Asha  
asha@x.com  
undefined  
interfaces assertions passed.  
\*/

**Common Follow-up Questions**

**Q: What is declaration merging?**

**A:** Declaring an interface with the same name more than once merges their members into one. It's useful for augmenting library types or extending global interfaces — something type aliases can't do.

**Q: When would you choose an interface over a type alias?**

**A:** For public object/class contracts that may need extending or merging. Interfaces communicate object shapes clearly and support \`extends\`/\`implements\`; aliases are better for unions and other non-object types.

## **18\. Extending Interfaces**

**Simple Explanation (English)**

Interfaces can build on other interfaces with \`extends\`, inheriting all their members and adding new ones. This models 'is-a' relationships and lets you compose larger contracts from smaller, reusable pieces without repeating fields.

An interface can extend multiple interfaces at once (\`extends A, B\`), effectively merging their members. This is the interface equivalent of intersection types, and is the idiomatic way to share common fields across related object shapes.

**Hinglish Explanation**

Interfaces \`extends\` se doosre interfaces par bana sakte hain, unke saare members inherit karke aur naye add karke. Ye 'is-a' relationships model karta hai aur aapko chhote, reusable pieces se bade contracts compose karne deta hai bina fields repeat kiye.  
Ek interface ek saath kai interfaces extend kar sakta hai (\`extends A, B\`), unke members ko effectively merge karke. Ye intersection types ka interface equivalent hai, aur related object shapes me common fields share karne ka idiomatic tarika hai.

**Key Interview Points**

* \`interface B extends A\` inherits all of A's members plus B's new ones.

* Can extend multiple interfaces: \`extends A, B\`.

* Models 'is-a' relationships and composes contracts.

* Interface equivalent of intersection types.

* Avoids repeating shared fields across related shapes.

**Real-World Example**

A base \`interface Person { name: string }\` extended by \`interface Employee extends Person { employeeId: number }\` means every Employee automatically has a name plus employee-specific fields — shared shape, no duplication.

**Code — Full & Runnable**

// solution.ts — extending interfaces (single and multiple).  
   
interface Person { name: string; }  
interface Timestamps { createdAt: string; }  
   
interface Employee extends Person, Timestamps {  
  employeeId: number;  
}  
   
export function makeEmployee(name: string, id: number): Employee {  
  return { name, employeeId: id, createdAt: "2025-01-01" };  
}  
   
export function describe(e: Employee): string {  
  return e.name \+ " (\#" \+ e.employeeId \+ ") since " \+ e.createdAt;  
}

**Test / Demo & Expected Output**

// test.ts — run: npx tsx test.ts  
import { makeEmployee, describe } from "./solution";  
   
const e \= makeEmployee("Asha", 7);  
console.log(e);          // { name:'Asha', employeeId:7, createdAt:'2025-01-01' }  
console.log(describe(e)); // Asha (\#7) since 2025-01-01  
   
console.assert(e.name \=== "Asha", "inherited Person.name");  
console.assert(e.employeeId \=== 7, "own field");  
console.assert(typeof e.createdAt \=== "string", "inherited Timestamps.createdAt");  
console.assert(describe(e) \=== "Asha (\#7) since 2025-01-01", "uses all fields");  
console.log("extending-interfaces assertions passed.");  
   
/\* EXPECTED OUTPUT:  
{ name: 'Asha', employeeId: 7, createdAt: '2025-01-01' }  
Asha (\#7) since 2025-01-01  
extending-interfaces assertions passed.  
\*/

**Common Follow-up Questions**

**Q: Can an interface extend more than one interface?**

**A:** Yes. \`interface C extends A, B\` inherits members from both A and B, merging their contracts — similar to an intersection type.

**Q: How is extending interfaces different from an intersection type?**

**A:** They achieve similar composition, but \`extends\` is interface-specific syntax with better error messages for object shapes and supports class implementation; intersections (\`A & B\`) work on any types, including non-object ones.

## **19\. Optional Properties**

**Simple Explanation (English)**

An optional property is marked with a \`?\` after its name (\`email?: string\`), meaning the property may be present or absent. If absent, its type effectively includes \`undefined\`, so you must handle the missing case before using it.

Optional properties model fields that aren't always provided — like an optional middle name or a config flag with a default. They differ from a required property typed \`T | undefined\`: an optional property can be omitted entirely, whereas the latter must be present (even if set to undefined).

**Hinglish Explanation**

Optional property apne naam ke baad \`?\` se mark hoti hai (\`email?: string\`), matlab property ho bhi sakti hai aur nahi bhi. Agar nahi ho, to uska type effectively \`undefined\` include karta hai, isliye use karne se pehle missing case handle karna padta hai.  
Optional properties un fields ko model karti hain jo hamesha provide nahi hoti — jaise optional middle name ya default wala config flag. Ye \`T | undefined\` wali required property se alag hain: optional property poori tarah omit ki ja sakti hai, jabki doosri present honi chahiye (chahe undefined set ho).

**Key Interview Points**

* Marked with \`?\`: \`prop?: Type\` may be present or absent.

* Its type effectively includes \`undefined\` when absent.

* Must handle the missing case (check, \`?.\`, or \`??\`).

* Omittable entirely — different from a required \`T | undefined\`.

* Great for optional config, partial inputs, and metadata.

**Real-World Example**

A function options object like \`{ retries?: number; timeout?: number }\` lets callers pass only what they care about, and the function fills in defaults for the omitted ones.

**Code — Full & Runnable**

// solution.ts — optional properties with defaults.  
   
interface RequestOptions {  
  url: string;  
  method?: string;   // optional  
  timeout?: number;  // optional  
}  
   
export function buildRequest(opts: RequestOptions): string {  
  const method \= opts.method ?? "GET";  
  const timeout \= opts.timeout ?? 3000;  
  return method \+ " " \+ opts.url \+ " (timeout " \+ timeout \+ "ms)";  
}

**Test / Demo & Expected Output**

// test.ts — run: npx tsx test.ts  
import { buildRequest } from "./solution";  
   
console.log(buildRequest({ url: "/api" }));                       // GET /api (timeout 3000ms)  
console.log(buildRequest({ url: "/api", method: "POST" }));      // POST /api (timeout 3000ms)  
console.log(buildRequest({ url: "/api", timeout: 500 }));        // GET /api (timeout 500ms)  
   
console.assert(buildRequest({ url: "/api" }) \=== "GET /api (timeout 3000ms)", "defaults applied");  
console.assert(buildRequest({ url: "/api", method: "POST" }).startsWith("POST"), "method override");  
console.assert(buildRequest({ url: "/api", timeout: 500 }).includes("500"), "timeout override");  
console.log("optional-properties assertions passed.");  
   
/\* EXPECTED OUTPUT:  
GET /api (timeout 3000ms)  
POST /api (timeout 3000ms)  
GET /api (timeout 500ms)  
optional-properties assertions passed.  
\*/

**Common Follow-up Questions**

**Q: Difference between \`prop?: T\` and \`prop: T | undefined\`?**

**A:** An optional property can be omitted entirely from the object. A required \`T | undefined\` property must be present (the key must exist), though its value may be undefined.

**Q: How do you safely use an optional property?**

**A:** Handle the absent case — check \`if (opts.x \!== undefined)\`, use optional chaining \`opts.x?.method()\`, or supply a default with \`opts.x ?? fallback\`.

## **20\. Readonly Properties**

**Simple Explanation (English)**

Marking a property \`readonly\` means it can be set once (at creation) but not reassigned afterward. The compiler flags any attempt to write to it. This enforces immutability of specific fields at compile time.

It's purely a compile-time guarantee (erased at runtime), useful for ids, configuration, and values that should never change after construction. There's also \`ReadonlyArray\<T\>\` (and \`readonly T\[\]\`) for arrays whose elements can't be mutated, plus the \`Readonly\<T\>\` utility type to make all properties readonly.

**Hinglish Explanation**

Property ko \`readonly\` mark karne ka matlab use ek baar (creation par) set kar sakte ho par baad me reassign nahi. Compiler usme likhne ki koi koshish flag karta hai. Ye specific fields ki immutability compile time par enforce karta hai.  
Ye sirf compile-time guarantee hai (runtime par erase), ids, configuration, aur un values ke liye useful jo construction ke baad kabhi nahi badalni chahiye. \`ReadonlyArray\<T\>\` (aur \`readonly T\[\]\`) bhi hai un arrays ke liye jinke elements mutate na ho, aur \`Readonly\<T\>\` utility type sab properties ko readonly banane ke liye.

**Key Interview Points**

* \`readonly prop\` can be set at creation but not reassigned later.

* Compile-time enforcement only (erased at runtime).

* Great for ids, config, and construction-time values.

* \`readonly T\[\]\` / \`ReadonlyArray\<T\>\` prevent array mutation.

* \`Readonly\<T\>\` makes every property of T readonly.

**Real-World Example**

An entity's \`readonly id: number\` guarantees no code accidentally reassigns the primary key after the object is created — the compiler rejects \`obj.id \= 5\`, catching a dangerous mutation at build time.

**Code — Full & Runnable**

// solution.ts — readonly properties and arrays.  
   
interface Account {  
  readonly id: number;  
  balance: number;  
}  
   
export function deposit(acc: Account, amount: number): Account {  
  // acc.id \= 99; // compile error: id is readonly  
  return { ...acc, balance: acc.balance \+ amount };  
}  
   
export function sumReadonly(nums: readonly number\[\]): number {  
  // nums.push(1); // compile error: cannot mutate a readonly array  
  return nums.reduce((a, b) \=\> a \+ b, 0);  
}

**Test / Demo & Expected Output**

// test.ts — run: npx tsx test.ts  
import { deposit, sumReadonly } from "./solution";  
   
const acc \= { id: 1, balance: 100 };  
const updated \= deposit(acc, 50);  
console.log(updated);                 // { id:1, balance:150 }  
console.log(sumReadonly(\[1, 2, 3\]));  // 6  
   
console.assert(updated.balance \=== 150, "deposit updates balance immutably");  
console.assert(updated.id \=== 1, "id preserved");  
console.assert(acc.balance \=== 100, "original unchanged");  
console.assert(sumReadonly(\[1, 2, 3\]) \=== 6, "readonly array summed");  
console.log("readonly-properties assertions passed.");  
   
/\* EXPECTED OUTPUT:  
{ id: 1, balance: 150 }  
6  
readonly-properties assertions passed.  
\*/

**Common Follow-up Questions**

**Q: Is readonly enforced at runtime?**

**A:** No. It's a compile-time check only; like all TypeScript types it's erased in the emitted JS. For runtime immutability you'd use \`Object.freeze\`.

**Q: How do you make an array's elements immutable in the type system?**

**A:** Use \`readonly T\[\]\` or \`ReadonlyArray\<T\>\`. Mutating methods like \`push\`/\`splice\` then become compile errors, and elements can't be reassigned.

## **21\. Index Signatures**

**Simple Explanation (English)**

An index signature describes the type of properties whose names you don't know in advance, like a dictionary. The syntax \`{ \[key: string\]: number }\` means 'any string key maps to a number value'. Keys can be \`string\`, \`number\`, or \`symbol\`.

Index signatures are used for dynamic key-value maps (e.g. a lookup table of counts). Note: all explicitly declared properties must be compatible with the index signature's value type. For known fixed keys, prefer \`Record\<K, V\>\` or specific properties; reach for index signatures when keys are truly open-ended.

**Hinglish Explanation**

Index signature un properties ka type describe karta hai jinke naam aapko pehle se nahi pata, jaise dictionary. Syntax \`{ \[key: string\]: number }\` ka matlab 'koi bhi string key ek number value se map karti hai'. Keys \`string\`, \`number\`, ya \`symbol\` ho sakti hain.  
Index signatures dynamic key-value maps ke liye use hote hain (jaise counts ki lookup table). Note: saari explicitly declared properties index signature ke value type se compatible honi chahiye. Known fixed keys ke liye \`Record\<K, V\>\` ya specific properties prefer karo; index signatures tab use karo jab keys sach me open-ended hon.

**Key Interview Points**

* \`{ \[key: string\]: V }\` types objects with unknown/dynamic keys.

* Key types allowed: string, number, symbol.

* All declared properties must match the index value type.

* Use for dictionaries/lookup maps with open-ended keys.

* Prefer \`Record\<K, V\>\` for known key sets; index signatures for dynamic ones.

**Real-World Example**

A word-frequency counter typed \`{ \[word: string\]: number }\` lets you accumulate counts under arbitrary word keys, with the compiler ensuring every value is a number.

**Code — Full & Runnable**

// solution.ts — index signature for a dynamic map.  
   
interface CountMap {  
  \[word: string\]: number;  
}  
   
export function countWords(words: string\[\]): CountMap {  
  const counts: CountMap \= {};  
  for (const w of words) counts\[w\] \= (counts\[w\] ?? 0\) \+ 1;  
  return counts;  
}  
   
// Record\<K, V\> alternative for a fixed key set:  
export type Scores \= Record\<"math" | "science", number\>;

**Test / Demo & Expected Output**

// test.ts — run: npx tsx test.ts  
import { countWords } from "./solution";  
   
const counts \= countWords(\["a", "b", "a", "a", "b"\]);  
console.log(counts); // { a: 3, b: 2 }  
   
console.assert(counts.a \=== 3, "count of a");  
console.assert(counts.b \=== 2, "count of b");  
console.assert(counts.z \=== undefined, "missing key is undefined");  
console.log("index-signatures assertions passed.");  
   
/\* EXPECTED OUTPUT:  
{ a: 3, b: 2 }  
index-signatures assertions passed.  
\*/

**Common Follow-up Questions**

**Q: What is an index signature for?**

**A:** Typing objects with dynamic/unknown property names, like dictionaries — e.g. \`{ \[key: string\]: number }\` allows any string key mapping to a number.

**Q: Index signature vs Record\<K, V\>?**

**A:** \`Record\<K, V\>\` is best when the set of keys is known/finite (it can use literal unions as keys). Index signatures are for genuinely open-ended keys where any string/number key is allowed.

## **22\. Function Typing**

**Simple Explanation (English)**

TypeScript lets you type a function's parameters and its return value, and also type a variable that HOLDS a function. A function type looks like \`(a: number, b: number) \=\> number\` — listing parameter types and the return type after \`=\>\`.

You can annotate parameters inline, declare a reusable function type via a type alias or interface, and let TypeScript INFER return types (though annotating them documents intent and catches mistakes). Callbacks are typed the same way, which makes higher-order functions safe.

**Hinglish Explanation**

TypeScript aapko function ke parameters aur uski return value type karne deta hai, aur ek aisa variable bhi type karne deta hai jo function HOLD karta hai. Function type aisa dikhta hai \`(a: number, b: number) \=\> number\` — parameter types aur \`=\>\` ke baad return type.  
Aap parameters inline annotate kar sakte ho, type alias ya interface se reusable function type declare kar sakte ho, aur TypeScript ko return types INFER karne de sakte ho (bhale annotate karna intent document karta hai aur galtiyaan pakadta hai). Callbacks bhi isi tarah type hote hain, jisse higher-order functions safe ho jaate hain.

**Key Interview Points**

* Function type syntax: \`(params) \=\> ReturnType\`.

* Type parameters and return value; return type can be inferred.

* Type a variable that holds a function with a function type.

* Reusable function types via type alias/interface.

* Callbacks are typed too, making HOFs type-safe.

**Real-World Example**

Typing an event handler or array callback — \`const onChange: (value: string) \=\> void\` — ensures every assignment and call matches the expected signature, catching mismatched callbacks before runtime.

**Code — Full & Runnable**

// solution.ts — typing functions and callbacks.  
   
type BinaryOp \= (a: number, b: number) \=\> number;  
   
export const add: BinaryOp \= (a, b) \=\> a \+ b;     // params inferred from type  
export const multiply: BinaryOp \= (a, b) \=\> a \* b;  
   
// A higher-order function with a typed callback parameter.  
export function transform(nums: number\[\], fn: (n: number) \=\> number): number\[\] {  
  return nums.map(fn);  
}

**Test / Demo & Expected Output**

// test.ts — run: npx tsx test.ts  
import { add, multiply, transform } from "./solution";  
   
console.log(add(2, 3));                 // 5  
console.log(multiply(4, 5));            // 20  
console.log(transform(\[1, 2, 3\], (n) \=\> n \* 10)); // \[10,20,30\]  
   
console.assert(add(2, 3\) \=== 5, "typed add");  
console.assert(multiply(4, 5\) \=== 20, "typed multiply");  
console.assert(JSON.stringify(transform(\[1, 2\], (n) \=\> n \+ 1)) \=== "\[2,3\]", "typed callback");  
console.log("function-typing assertions passed.");  
   
/\* EXPECTED OUTPUT:  
5  
20  
\[ 10, 20, 30 \]  
function-typing assertions passed.  
\*/

**Common Follow-up Questions**

**Q: How do you write the type of a function?**

**A:** Using \`(paramName: ParamType, ...) \=\> ReturnType\`. For example \`(a: number, b: number) \=\> number\`. This can annotate a variable, a parameter (callback), or be aliased for reuse.

**Q: Do you have to annotate return types?**

**A:** No — TypeScript infers them. But annotating return types documents intent and catches accidental wrong returns, which is valuable on public/complex functions.

## **23\. Optional Parameters**

**Simple Explanation (English)**

An optional parameter is marked with \`?\` after its name (\`function greet(name: string, title?: string)\`). It may be omitted by callers; when omitted, its value is \`undefined\`, so its type is effectively \`T | undefined\` inside the function.

Optional parameters must come AFTER all required parameters. Inside the function you must handle the undefined case (a check or a default). They're the typed equivalent of JavaScript's 'this argument might not be passed'.

**Hinglish Explanation**

Optional parameter apne naam ke baad \`?\` se mark hota hai (\`function greet(name: string, title?: string)\`). Callers ise omit kar sakte hain; omit hone par uski value \`undefined\` hoti hai, isliye function ke andar uska type effectively \`T | undefined\` hota hai.  
Optional parameters saare required parameters ke BAAD aane chahiye. Function ke andar aapko undefined case handle karna padta hai (check ya default). Ye JavaScript ke 'ye argument shaayad pass na ho' ka typed equivalent hai.

**Key Interview Points**

* Mark with \`?\`: \`param?: Type\` may be omitted.

* When omitted, the value is \`undefined\` (type is \`T | undefined\`).

* Must come AFTER required parameters.

* Handle the undefined case inside the function.

* Different from default parameters (which supply a value).

**Real-World Example**

A \`formatName(first: string, last?: string)\` function works whether or not a last name is provided, returning just the first name when \`last\` is omitted — common with partial form data.

**Code — Full & Runnable**

// solution.ts — optional parameter handling.  
   
export function formatName(first: string, last?: string): string {  
  return last ? first \+ " " \+ last : first;  
}  
   
export function repeat(text: string, times?: number): string {  
  const n \= times ?? 1; // handle the omitted case  
  return text.repeat(n);  
}

**Test / Demo & Expected Output**

// test.ts — run: npx tsx test.ts  
import { formatName, repeat } from "./solution";  
   
console.log(formatName("Asha", "Kumar")); // Asha Kumar  
console.log(formatName("Asha"));          // Asha  
console.log(repeat("ab", 3));             // ababab  
console.log(repeat("x"));                 // x (default times \= 1\)  
   
console.assert(formatName("Asha", "Kumar") \=== "Asha Kumar", "with last name");  
console.assert(formatName("Asha") \=== "Asha", "without last name");  
console.assert(repeat("ab", 3\) \=== "ababab", "with count");  
console.assert(repeat("x") \=== "x", "omitted count handled");  
console.log("optional-parameters assertions passed.");  
   
/\* EXPECTED OUTPUT:  
Asha Kumar  
Asha  
ababab  
x  
optional-parameters assertions passed.  
\*/

**Common Follow-up Questions**

**Q: Where must optional parameters be placed?**

**A:** After all required parameters. You can't have a required parameter following an optional one (the compiler will reject it).

**Q: What's the value of an omitted optional parameter?**

**A:** \`undefined\`. Inside the function its type is effectively \`T | undefined\`, so you should check it or provide a fallback before use.

## **24\. Default Parameters**

**Simple Explanation (English)**

A default parameter provides a value to use when the caller omits an argument (or passes \`undefined\`): \`function greet(name: string \= "Guest")\`. TypeScript infers the parameter's type from the default, so you often don't need an explicit annotation.

Unlike optional parameters (which can be \`undefined\`), a defaulted parameter always has a concrete value inside the function. A parameter with a default is implicitly optional for callers, and defaults can reference earlier parameters.

**Hinglish Explanation**

Default parameter ek value provide karta hai jo tab use hoti hai jab caller argument omit kare (ya \`undefined\` pass kare): \`function greet(name: string \= "Guest")\`. TypeScript default se parameter ka type infer kar leta hai, isliye aksar explicit annotation ki zarurat nahi.  
Optional parameters (jo \`undefined\` ho sakte hain) ke विपरीत, defaulted parameter ke paas function ke andar hamesha ek concrete value hoti hai. Default wala parameter callers ke liye implicitly optional hota hai, aur defaults pehle ke parameters ko reference kar sakte hain.

**Key Interview Points**

* \`param: Type \= defaultValue\` — used when the arg is omitted/undefined.

* Type is inferred from the default (annotation often optional).

* Always has a concrete value inside the function (unlike optional).

* Callers may omit a defaulted parameter (implicitly optional).

* Defaults can reference earlier parameters.

**Real-World Example**

A pagination helper \`fetchPage(page: number \= 1, pageSize: number \= 20)\` works with no arguments for the common case while still allowing overrides — cleaner than checking for undefined inside.

**Code — Full & Runnable**

// solution.ts — default parameters (incl. referencing earlier params).  
   
export function greet(name: string \= "Guest"): string {  
  return "Hello, " \+ name;  
}  
   
export function range(start: number \= 0, end: number \= start \+ 5): number\[\] {  
  const out: number\[\] \= \[\];  
  for (let i \= start; i \< end; i++) out.push(i);  
  return out;  
}

**Test / Demo & Expected Output**

// test.ts — run: npx tsx test.ts  
import { greet, range } from "./solution";  
   
console.log(greet());          // Hello, Guest  
console.log(greet("Asha"));    // Hello, Asha  
console.log(range());          // \[0,1,2,3,4\]  
console.log(range(10));        // \[10,11,12,13,14\]  
console.log(range(1, 4));      // \[1,2,3\]  
   
console.assert(greet() \=== "Hello, Guest", "default used");  
console.assert(greet("Asha") \=== "Hello, Asha", "override used");  
console.assert(JSON.stringify(range()) \=== "\[0,1,2,3,4\]", "both defaults");  
console.assert(JSON.stringify(range(10)) \=== "\[10,11,12,13,14\]", "end defaults from start");  
console.log("default-parameters assertions passed.");  
   
/\* EXPECTED OUTPUT:  
Hello, Guest  
Hello, Asha  
\[ 0, 1, 2, 3, 4 \]  
\[ 10, 11, 12, 13, 14 \]  
\[ 1, 2, 3 \]  
default-parameters assertions passed.  
\*/

**Common Follow-up Questions**

**Q: Difference between optional and default parameters?**

**A:** An optional parameter (\`x?\`) may be undefined inside the function; a default parameter (\`x \= v\`) always has a concrete value because the default fills in when the argument is omitted or undefined.

**Q: Do you need to annotate a default parameter's type?**

**A:** Usually not — TypeScript infers it from the default value. You can still annotate it explicitly when you want a broader or more specific type than the default implies.

## **25\. Rest Parameters (TypeScript)**

**Simple Explanation (English)**

A rest parameter collects an indefinite number of trailing arguments into a typed array, written \`(...nums: number\[\])\`. It lets a function accept any number of arguments while keeping full type safety on each one.

The rest parameter must be last, and its type is always an array type. With tuple types you can even type variadic functions precisely (e.g. \`(...args: \[string, number\])\`). This is the typed version of JavaScript's rest operator for parameters.

**Hinglish Explanation**

Rest parameter trailing arguments ki indefinite sankhya ko ek typed array me collect karta hai, \`(...nums: number\[\])\` likhte hain. Ye function ko kisi bhi sankhya me arguments accept karne deta hai jabki har ek par poori type safety bani rehti hai.  
Rest parameter last me hona chahiye, aur uska type hamesha ek array type hota hai. Tuple types ke saath aap variadic functions ko precisely type kar sakte ho (jaise \`(...args: \[string, number\])\`). Ye JavaScript ke rest operator ka typed version hai parameters ke liye.

**Key Interview Points**

* \`(...name: T\[\])\` collects trailing args into a typed array.

* Accepts any number of arguments with full type checking.

* Must be the LAST parameter; its type is an array (or tuple).

* Tuple types enable precise variadic signatures.

* The typed counterpart of JS rest parameters.

**Real-World Example**

A typed \`sum(...nums: number\[\])\` or a logger \`log(level: string, ...messages: string\[\])\` accepts a variable number of strongly-typed arguments, so passing a wrong type is caught at compile time.

**Code — Full & Runnable**

// solution.ts — typed rest parameters.  
   
export function sum(...nums: number\[\]): number {  
  return nums.reduce((a, b) \=\> a \+ b, 0);  
}  
   
export function joinWith(separator: string, ...parts: string\[\]): string {  
  return parts.join(separator);  
}  
   
// Tuple rest type for a precise variadic signature.  
export function pair(...args: \[string, number\]): string {  
  const \[label, value\] \= args;  
  return label \+ "=" \+ value;  
}

**Test / Demo & Expected Output**

// test.ts — run: npx tsx test.ts  
import { sum, joinWith, pair } from "./solution";  
   
console.log(sum(1, 2, 3, 4));               // 10  
console.log(sum());                          // 0  
console.log(joinWith("-", "2025", "01", "01")); // 2025-01-01  
console.log(pair("age", 30));                // age=30  
   
console.assert(sum(1, 2, 3, 4\) \=== 10, "rest sum");  
console.assert(sum() \=== 0, "rest with no args");  
console.assert(joinWith("-", "a", "b") \=== "a-b", "rest strings joined");  
console.assert(pair("age", 30\) \=== "age=30", "tuple rest");  
console.log("rest-parameters assertions passed.");  
   
/\* EXPECTED OUTPUT:  
10  
0  
2025-01-01  
age=30  
rest-parameters assertions passed.  
\*/

**Common Follow-up Questions**

**Q: What type does a rest parameter have?**

**A:** An array type (e.g. \`number\[\]\`) — or a tuple type for precise variadic signatures. It gathers all remaining arguments into that typed array.

**Q: Where must a rest parameter appear in the parameter list?**

**A:** Last. There can be only one rest parameter and nothing can follow it, since it absorbs all remaining arguments.