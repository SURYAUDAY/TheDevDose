**TypeScript**

Interview Preparation — Study Guide

Phase 1B  •  Topics 51–77

*Each topic includes: plain-English \+ Hinglish explanation, key interview points,*

*a real-world example, complete runnable code, tests with expected output, and follow-up Q\&A.*

Run any code sample with:  npx tsx filename.ts  
**Contents**

# **Phase 1B — TypeScript Detailed (Topics 51–77)**

This batch covers advanced TypeScript — the rest of the utility types (Extract, ReturnType, NonNullable, Parameters, InstanceType, Awaited), type operators (keyof, typeof), the type-programming toolkit (mapped, conditional, infer, template-literal, recursive types, satisfies), narrowing and guards, declaration files, type-only imports, namespaces, and practical React typing (props, hooks, events, API responses, Redux Toolkit, React Query, reusable generic components). Every sample is verified to both run and type-check under strict mode; React APIs are shown as patterns alongside runnable logic demos.

## **51\. Extract\<T, U\>**

**Simple Explanation (English)**

\`Extract\<T, U\>\` is the counterpart of \`Exclude\`: it keeps only the members of union \`T\` that ARE assignable to \`U\`, discarding the rest. For example \`Extract\<"a" | "b" | 1 | 2, string\>\` is \`"a" | "b"\`.

It's a conditional type used to filter a union down to a subset — e.g. selecting only the string members, or only the action types of a particular kind. Pair it with \`Exclude\` to split a union into matching and non-matching parts.

**Hinglish Explanation**

\`Extract\<T, U\>\` \`Exclude\` ka counterpart hai: ye union \`T\` ke sirf un members ko rakhta hai jo \`U\` ko assignable HAIN, baaki hata kar. Jaise \`Extract\<"a" | "b" | 1 | 2, string\>\` \`"a" | "b"\` hai.  
Ye ek conditional type hai jo union ko ek subset tak filter karne ke liye use hota hai — jaise sirf string members select karna, ya ek particular kind ke action types. Ise \`Exclude\` ke saath mila kar union ko matching aur non-matching parts me baant sakte ho.

**Key Interview Points**

* Keeps union members of T assignable to U (opposite of Exclude).

* \`Extract\<'a'|'b'|1, string\>\` → \`'a'|'b'\`.

* Built on a conditional type.

* Use to filter a union to a matching subset.

* Exclude \+ Extract together partition a union.

**Real-World Example**

From a union of mixed action types, \`Extract\<Action, { type: "add" }\>\` narrows to just the 'add' actions, giving precise types for a handler that only deals with that subset.

**Code — Full & Runnable**

// solution.ts — Extract keeps matching union members.  
   
type Mixed \= "a" | "b" | 1 | 2;  
export type OnlyStrings \= Extract\<Mixed, string\>; // "a" | "b"  
   
type Action \=  
  | { type: "add"; amount: number }  
  | { type: "reset" };  
export type AddAction \= Extract\<Action, { type: "add" }\>;  
   
export function handleAdd(action: AddAction): number {  
  return action.amount; // typed: only the 'add' shape  
}

**Test / Demo & Expected Output**

// test.ts — run: npx tsx test.ts  
import { handleAdd } from "./solution";  
   
console.log(handleAdd({ type: "add", amount: 5 })); // 5  
console.assert(handleAdd({ type: "add", amount: 5 }) \=== 5, "Extract narrows to add action");  
console.log("Extract assertions passed.");  
   
/\* EXPECTED OUTPUT:  
5  
Extract assertions passed.  
\*/

**Common Follow-up Questions**

**Q: How is Extract different from Exclude?**

**A:** They're opposites: \`Extract\<T, U\>\` keeps union members assignable to U; \`Exclude\<T, U\>\` removes them. Together they partition a union into matching and non-matching parts.

**Q: Give a practical use of Extract.**

**A:** Narrowing a discriminated-union action type to one variant, e.g. \`Extract\<Action, { type: 'add' }\>\`, so a handler gets the precise shape for that action.

## **52\. ReturnType\<T\>**

**Simple Explanation (English)**

\`ReturnType\<T\>\` extracts the return type of a function type \`T\`. You typically combine it with \`typeof\` to get the return type of an existing function: \`ReturnType\<typeof getUser\>\`.

This keeps derived types in sync with their source function — if you change what \`getUser\` returns, every type derived via \`ReturnType\<typeof getUser\>\` updates automatically. It's invaluable for typing the output of factories, selectors, and configuration functions.

**Hinglish Explanation**

\`ReturnType\<T\>\` ek function type \`T\` ka return type nikaalta hai. Aap ise aam taur par \`typeof\` ke saath mila kar kisi existing function ka return type lete ho: \`ReturnType\<typeof getUser\>\`.  
Ye derived types ko unke source function ke saath sync me rakhta hai — agar aap \`getUser\` ka return change karo, to \`ReturnType\<typeof getUser\>\` se derive har type automatically update ho jaata hai. Factories, selectors, aur configuration functions ke output ko type karne ke liye ye bohot useful hai.

**Key Interview Points**

* Extracts a function type's return type.

* Usually used as \`ReturnType\<typeof fn\>\`.

* Keeps derived types in sync with the source function.

* Great for typing factory/selector/config outputs.

* Built on a conditional type with \`infer\`.

**Real-World Example**

Typing a Redux selector's result as \`ReturnType\<typeof selectUser\>\` means components automatically get the right type, and any change to the selector's return shape flows through everywhere it's used.

**Code — Full & Runnable**

// solution.ts — ReturnType derived from an existing function.  
   
export function createUser(name: string) {  
  return { id: Date.now(), name, active: true };  
}  
   
export type User \= ReturnType\<typeof createUser\>; // { id:number; name:string; active:boolean }  
   
export function describe(user: User): string {  
  return user.name \+ (user.active ? " (active)" : " (inactive)");  
}

**Test / Demo & Expected Output**

// test.ts — run: npx tsx test.ts  
import { createUser, describe } from "./solution";  
   
const u \= createUser("Asha");  
console.log(describe(u)); // Asha (active)  
   
console.assert(describe(u) \=== "Asha (active)", "ReturnType-derived shape works");  
console.assert(typeof u.id \=== "number" && u.name \=== "Asha", "shape matches function return");  
console.log("ReturnType assertions passed.");  
   
/\* EXPECTED OUTPUT:  
Asha (active)  
ReturnType assertions passed.  
\*/

**Common Follow-up Questions**

**Q: How do you get the return type of an existing function?**

**A:** Combine \`typeof\` and \`ReturnType\`: \`ReturnType\<typeof myFunction\>\`. \`typeof\` gets the function's type, and \`ReturnType\` extracts what it returns.

**Q: Why derive a type with ReturnType instead of writing it out?**

**A:** It stays automatically in sync with the function. If the function's return shape changes, the derived type updates everywhere, eliminating drift between the function and its consumers.

## **53\. NonNullable\<T\>**

**Simple Explanation (English)**

\`NonNullable\<T\>\` removes \`null\` and \`undefined\` from a type. For example \`NonNullable\<string | null | undefined\>\` is just \`string\`. It's handy once you've checked/filtered out nullish values and want a type that guarantees their absence.

It's commonly used after a narrowing step (like a \`filter(Boolean)\` or a guard) to express that the result can no longer be null/undefined, keeping downstream code free of redundant null checks.

**Hinglish Explanation**

\`NonNullable\<T\>\` ek type se \`null\` aur \`undefined\` hata deta hai. Jaise \`NonNullable\<string | null | undefined\>\` sirf \`string\` hai. Ye tab useful hai jab aap nullish values check/filter kar chuke ho aur ek aisa type chahiye jo unki gairhaaziri guarantee kare.  
Ise aksar ek narrowing step ke baad use karte hain (jaise \`filter(Boolean)\` ya ek guard) ye express karne ke liye ki result ab null/undefined nahi ho sakta, jisse downstream code redundant null checks se mukt rehta hai.

**Key Interview Points**

* Removes \`null\` and \`undefined\` from a type.

* \`NonNullable\<string | null\>\` → \`string\`.

* Use after narrowing/filtering out nullish values.

* Keeps downstream code free of repeated null checks.

* Built on a conditional type.

**Real-World Example**

After \`items.filter((x): x is NonNullable\<typeof x\> \=\> x \!= null)\`, the resulting array's element type drops null/undefined, so the rest of the pipeline can use the values directly without optional chaining.

**Code — Full & Runnable**

// solution.ts — NonNullable to express 'definitely present'.  
   
type MaybeName \= string | null | undefined;  
export type DefiniteName \= NonNullable\<MaybeName\>; // string  
   
export function compact\<T\>(arr: (T | null | undefined)\[\]): NonNullable\<T\>\[\] {  
  return arr.filter((x): x is NonNullable\<T\> \=\> x \!== null && x \!== undefined);  
}

**Test / Demo & Expected Output**

// test.ts — run: npx tsx test.ts  
import { compact } from "./solution";  
   
console.log(compact(\["a", null, "b", undefined, "c"\])); // \['a','b','c'\]  
console.log(compact(\[1, undefined, 2, null\]));          // \[1,2\]  
   
console.assert(JSON.stringify(compact(\["a", null, "b"\])) \=== '\["a","b"\]', "nullish removed");  
console.assert(compact(\[1, null, 2\]).length \=== 2, "length after compact");  
console.log("NonNullable assertions passed.");  
   
/\* EXPECTED OUTPUT:  
\[ 'a', 'b', 'c' \]  
\[ 1, 2 \]  
NonNullable assertions passed.  
\*/

**Common Follow-up Questions**

**Q: What does NonNullable\<T\> do?**

**A:** It produces a type with \`null\` and \`undefined\` removed from T. For example \`NonNullable\<string | null | undefined\>\` becomes \`string\`.

**Q: When is NonNullable useful?**

**A:** After you've filtered or guarded out nullish values, to express that the remaining values are definitely present — avoiding redundant null checks downstream.

## **54\. Parameters\<T\>**

**Simple Explanation (English)**

\`Parameters\<T\>\` extracts the parameter types of a function type \`T\` as a TUPLE. Combined with \`typeof\`, \`Parameters\<typeof fn\>\` gives the exact argument-type tuple of an existing function.

This is useful for wrapping functions (logging, memoising, currying) where you want the wrapper to accept exactly the same arguments. You can index into the tuple (e.g. \`Parameters\<typeof fn\>\[0\]\`) to get a single parameter's type.

**Hinglish Explanation**

\`Parameters\<T\>\` ek function type \`T\` ke parameter types ko ek TUPLE ki tarah nikaalta hai. \`typeof\` ke saath, \`Parameters\<typeof fn\>\` ek existing function ka exact argument-type tuple deta hai.  
Ye functions wrap karne ke liye useful hai (logging, memoising, currying) jahan aap chahte ho ki wrapper bilkul same arguments accept kare. Tuple me index karke (jaise \`Parameters\<typeof fn\>\[0\]\`) ek single parameter ka type le sakte ho.

**Key Interview Points**

* Extracts a function's parameter types as a tuple.

* Use as \`Parameters\<typeof fn\>\`.

* Great for wrappers that mirror the original's arguments.

* Index it for a single parameter: \`Parameters\<typeof fn\>\[0\]\`.

* Built on a conditional type with \`infer\`.

**Real-World Example**

A generic \`withLogging(fn)\` wrapper typed \`(...args: Parameters\<typeof fn\>) \=\> ReturnType\<typeof fn\>\` accepts exactly the wrapped function's arguments and returns its return type — fully type-safe instrumentation.

**Code — Full & Runnable**

// solution.ts — Parameters to mirror a function's arguments.  
   
export function multiply(a: number, b: number): number {  
  return a \* b;  
}  
   
type MulArgs \= Parameters\<typeof multiply\>; // \[number, number\]  
   
export function callWith(args: MulArgs): number {  
  return multiply(...args);  
}  
   
export type FirstArg \= Parameters\<typeof multiply\>\[0\]; // number

**Test / Demo & Expected Output**

// test.ts — run: npx tsx test.ts  
import { callWith } from "./solution";  
   
console.log(callWith(\[6, 7\])); // 42  
console.assert(callWith(\[6, 7\]) \=== 42, "Parameters tuple spread into call");  
console.log("Parameters assertions passed.");  
   
/\* EXPECTED OUTPUT:  
42  
Parameters assertions passed.  
\*/

**Common Follow-up Questions**

**Q: What does Parameters\<T\> return?**

**A:** A tuple of the function's parameter types. For \`(a: number, b: string) \=\> void\` it yields \`\[number, string\]\`.

**Q: How do you get just the first parameter's type?**

**A:** Index the tuple: \`Parameters\<typeof fn\>\[0\]\`. This gives the type of the first argument.

## **55\. InstanceType\<T\>**

**Simple Explanation (English)**

\`InstanceType\<T\>\` extracts the instance type produced by a constructor function/class type \`T\`. Used with \`typeof MyClass\`, it gives the type of an instance of that class — useful when you have the class value but need its instance type.

It's handy for factories, dependency containers, or generic code that operates on class instances created from a constructor passed in as a value. It pairs with \`ConstructorParameters\<T\>\` (the constructor's argument tuple).

**Hinglish Explanation**

\`InstanceType\<T\>\` ek constructor function/class type \`T\` se bani instance ka type nikaalta hai. \`typeof MyClass\` ke saath, ye us class ki ek instance ka type deta hai — tab useful jab aapke paas class value ho par uska instance type chahiye.  
Ye factories, dependency containers, ya us generic code ke liye useful hai jo value ke roop me pass kiye constructor se bani class instances par kaam karta hai. Ye \`ConstructorParameters\<T\>\` (constructor ka argument tuple) ke saath jodi banata hai.

**Key Interview Points**

* Extracts the instance type of a class/constructor type.

* Use as \`InstanceType\<typeof MyClass\>\`.

* Useful when you have the class value but need its instance type.

* Pairs with \`ConstructorParameters\<T\>\`.

* Built on a conditional type with \`infer\`.

**Real-World Example**

A generic factory \`create\<C\>(ctor: C): InstanceType\<C\>\` builds and returns a typed instance from any class you pass in — common in dependency-injection containers and plugin systems.

**Code — Full & Runnable**

// solution.ts — InstanceType from a class value.  
   
export class Logger {  
  constructor(public prefix: string) {}  
  log(msg: string): string { return this.prefix \+ ": " \+ msg; }  
}  
   
type LoggerInstance \= InstanceType\<typeof Logger\>; // Logger  
   
export function useLogger(logger: LoggerInstance, msg: string): string {  
  return logger.log(msg);  
}

**Test / Demo & Expected Output**

// test.ts — run: npx tsx test.ts  
import { Logger, useLogger } from "./solution";  
   
const logger \= new Logger("APP");  
console.log(useLogger(logger, "started")); // APP: started  
   
console.assert(useLogger(logger, "started") \=== "APP: started", "InstanceType-typed instance works");  
console.log("InstanceType assertions passed.");  
   
/\* EXPECTED OUTPUT:  
APP: started  
InstanceType assertions passed.  
\*/

**Common Follow-up Questions**

**Q: What does InstanceType\<typeof MyClass\> give you?**

**A:** The type of an instance of MyClass — equivalent to writing \`MyClass\` as a type. It's useful when you only have the class value and need to refer to its instance type.

**Q: What's the companion utility for constructor arguments?**

**A:** \`ConstructorParameters\<T\>\`, which extracts the constructor's parameter types as a tuple — the constructor equivalent of \`Parameters\<T\>\`.

## **56\. Awaited\<T\>**

**Simple Explanation (English)**

\`Awaited\<T\>\` unwraps the value type that a Promise resolves to — and it does so recursively for nested promises. \`Awaited\<Promise\<string\>\>\` is \`string\`, and \`Awaited\<Promise\<Promise\<number\>\>\>\` is \`number\`.

It models exactly what \`await\` does at the type level, so it's perfect for typing the result of awaiting an async function: \`Awaited\<ReturnType\<typeof fetchUser\>\>\` gives the resolved value type, not the Promise.

**Hinglish Explanation**

\`Awaited\<T\>\` woh value type unwrap karta hai jisme ek Promise resolve hota hai — aur ye nested promises ke liye recursively karta hai. \`Awaited\<Promise\<string\>\>\` \`string\` hai, aur \`Awaited\<Promise\<Promise\<number\>\>\>\` \`number\` hai.  
Ye type level par bilkul wahi model karta hai jo \`await\` karta hai, isliye ek async function ko await karne ke result ko type karne ke liye perfect hai: \`Awaited\<ReturnType\<typeof fetchUser\>\>\` resolved value type deta hai, Promise nahi.

**Key Interview Points**

* Unwraps a Promise's resolved value type (recursively).

* \`Awaited\<Promise\<T\>\>\` → \`T\`.

* Mirrors \`await\` at the type level.

* Combine with ReturnType for async function results.

* Handles nested promises automatically.

**Real-World Example**

Typing the data from an async fetcher: \`type User \= Awaited\<ReturnType\<typeof fetchUser\>\>\` gives the resolved user shape, so consumers work with the value type instead of \`Promise\<User\>\`.

**Code — Full & Runnable**

// solution.ts — Awaited unwraps a promise's value type.  
   
export async function fetchCount(): Promise\<number\> {  
  return 42;  
}  
   
export type Count \= Awaited\<ReturnType\<typeof fetchCount\>\>; // number  
   
export async function useCount(): Promise\<Count\> {  
  const count: Count \= await fetchCount();  
  return count;  
}

**Test / Demo & Expected Output**

// test.ts — run: npx tsx test.ts  
import { useCount } from "./solution";  
   
(async () \=\> {  
  const c \= await useCount();  
  console.log(c); // 42  
  console.assert(c \=== 42, "Awaited-typed resolved value");  
  console.log("Awaited assertions passed.");  
})();  
   
/\* EXPECTED OUTPUT:  
42  
Awaited assertions passed.  
\*/

**Common Follow-up Questions**

**Q: What does Awaited\<T\> do?**

**A:** It unwraps the value a Promise resolves to (recursively for nested promises), mirroring what \`await\` produces — \`Awaited\<Promise\<string\>\>\` is \`string\`.

**Q: How do you type the resolved result of an async function?**

**A:** Combine utilities: \`Awaited\<ReturnType\<typeof asyncFn\>\>\` gives the value type after awaiting, rather than the \`Promise\<...\>\` wrapper.

## **57\. keyof**

**Simple Explanation (English)**

The \`keyof\` operator produces a union of the property KEYS of a type. For \`type Point \= { x: number; y: number }\`, \`keyof Point\` is \`"x" | "y"\`. It turns an object type's keys into a usable literal union.

\`keyof\` is the backbone of type-safe property access and mapped types. Combined with generics (\`K extends keyof T\`), it lets you write helpers that only accept valid keys and return the correctly-typed value for each.

**Hinglish Explanation**

\`keyof\` operator ek type ki property KEYS ka union banata hai. \`type Point \= { x: number; y: number }\` ke liye, \`keyof Point\` \`"x" | "y"\` hai. Ye ek object type ki keys ko usable literal union me badal deta hai.  
\`keyof\` type-safe property access aur mapped types ki reedh hai. Generics ke saath (\`K extends keyof T\`), ye aapko aise helpers likhne deta hai jo sirf valid keys accept karein aur har ke liye correctly-typed value return karein.

**Key Interview Points**

* \`keyof T\` is the union of T's property keys.

* \`keyof { x: 1; y: 2 }\` → \`'x' | 'y'\`.

* Foundation of type-safe key access and mapped types.

* With \`K extends keyof T\`, helpers accept only valid keys.

* Returns \`string | number | symbol\` for index-signature types.

**Real-World Example**

A type-safe \`pluck(objects, key)\` constrained by \`keyof T\` extracts a column of values from a list of objects while guaranteeing the key exists and the result is correctly typed.

**Code — Full & Runnable**

// solution.ts — keyof for safe key access and plucking.  
   
interface Point { x: number; y: number; }  
export type PointKey \= keyof Point; // "x" | "y"  
   
export function getValue\<T, K extends keyof T\>(obj: T, key: K): T\[K\] {  
  return obj\[key\];  
}  
   
export function pluck\<T, K extends keyof T\>(items: T\[\], key: K): T\[K\]\[\] {  
  return items.map((item) \=\> item\[key\]);  
}

**Test / Demo & Expected Output**

// test.ts — run: npx tsx test.ts  
import { getValue, pluck } from "./solution";  
   
const point \= { x: 3, y: 4 };  
console.log(getValue(point, "x")); // 3  
   
const people \= \[{ name: "Asha", age: 30 }, { name: "Ravi", age: 25 }\];  
console.log(pluck(people, "name")); // \['Asha','Ravi'\]  
console.log(pluck(people, "age"));  // \[30,25\]  
   
console.assert(getValue(point, "y") \=== 4, "keyof-constrained access");  
console.assert(JSON.stringify(pluck(people, "name")) \=== '\["Asha","Ravi"\]', "pluck names");  
console.assert(JSON.stringify(pluck(people, "age")) \=== "\[30,25\]", "pluck ages");  
console.log("keyof assertions passed.");  
   
/\* EXPECTED OUTPUT:  
3  
\[ 'Asha', 'Ravi' \]  
\[ 30, 25 \]  
keyof assertions passed.  
\*/

**Common Follow-up Questions**

**Q: What does keyof produce?**

**A:** A union of a type's property keys. For \`{ a: number; b: string }\`, \`keyof\` yields \`'a' | 'b'\`.

**Q: Why is keyof important for generics?**

**A:** Constraining a parameter with \`K extends keyof T\` ensures only valid keys are accepted and lets you return \`T\[K\]\` — the correctly-typed value for that specific key.

## **58\. typeof (type query)**

**Simple Explanation (English)**

In TYPE position, \`typeof x\` queries the type of an existing value or variable and uses it as a type. This is different from JavaScript's runtime \`typeof\` (which returns a string). The type-query \`typeof\` lets you derive types from values you've already written.

It's frequently combined with other operators: \`typeof obj\` to reuse an object's inferred type, \`keyof typeof obj\` to get its keys, and \`ReturnType\<typeof fn\>\` to get a function's return type — deriving types from a single source of truth.

**Hinglish Explanation**

TYPE position me, \`typeof x\` ek existing value ya variable ka type query karta hai aur use type ki tarah use karta hai. Ye JavaScript ke runtime \`typeof\` (jo string return karta hai) se alag hai. Type-query \`typeof\` aapko already likhi gayi values se types derive karne deta hai.  
Ise aksar doosre operators ke saath mila kar use karte hain: \`typeof obj\` ek object ka inferred type reuse karne ko, \`keyof typeof obj\` uski keys lene ko, aur \`ReturnType\<typeof fn\>\` function ka return type lene ko — ek single source of truth se types derive karke.

**Key Interview Points**

* In type position, \`typeof value\` yields that value's type.

* Different from JS runtime \`typeof\` (which returns a string).

* Derive types from existing values/variables.

* Common combos: \`keyof typeof obj\`, \`ReturnType\<typeof fn\>\`.

* Keeps types in sync with the values they describe.

**Real-World Example**

Deriving a union of valid config keys from the config object itself: \`type ConfigKey \= keyof typeof config\` means the key type updates automatically whenever you add or remove a config entry.

**Code — Full & Runnable**

// solution.ts — typeof type query \+ keyof combo.  
   
export const config \= { host: "localhost", port: 8080, secure: false };  
   
export type Config \= typeof config;            // { host:string; port:number; secure:boolean }  
export type ConfigKey \= keyof typeof config;   // "host" | "port" | "secure"  
   
export function getConfig\<K extends ConfigKey\>(key: K): Config\[K\] {  
  return config\[key\];  
}

**Test / Demo & Expected Output**

// test.ts — run: npx tsx test.ts  
import { getConfig } from "./solution";  
   
console.log(getConfig("host")); // localhost  
console.log(getConfig("port")); // 8080  
console.log(getConfig("secure")); // false  
   
console.assert(getConfig("host") \=== "localhost", "typeof-derived access (host)");  
console.assert(getConfig("port") \=== 8080, "typeof-derived access (port)");  
console.log("typeof assertions passed.");  
   
/\* EXPECTED OUTPUT:  
localhost  
8080  
false  
typeof assertions passed.  
\*/

**Common Follow-up Questions**

**Q: How does type-position \`typeof\` differ from runtime \`typeof\`?**

**A:** Runtime \`typeof\` returns a string describing a value's type at execution. Type-position \`typeof\` (used in type annotations) extracts the static type of a value to use as a type.

**Q: What's a common \`typeof\` combination?**

**A:** \`keyof typeof obj\` to derive the union of an object's keys, and \`ReturnType\<typeof fn\>\` to derive a function's return type — both keep types tied to existing values/functions.

## **59\. Mapped Types**

**Simple Explanation (English)**

A mapped type creates a new type by transforming each property of an existing type, using the syntax \`{ \[K in keyof T\]: ... }\`. It iterates over a union of keys and produces a member for each — the mechanism behind utility types like \`Partial\` and \`Readonly\`.

You can add or remove modifiers while mapping: \`?\` for optional, \`readonly\`, or strip them with \`-?\` / \`-readonly\`. You can also remap keys with \`as\`. Mapped types let you derive whole families of types from one source automatically.

**Hinglish Explanation**

Mapped type ek existing type ki har property ko transform karke ek naya type banata hai, syntax \`{ \[K in keyof T\]: ... }\` se. Ye keys ke union par iterate karta hai aur har ke liye ek member banata hai — \`Partial\` aur \`Readonly\` jaise utility types ka mechanism.  
Map karte samay aap modifiers add/remove kar sakte ho: optional ke liye \`?\`, \`readonly\`, ya \`-?\` / \`-readonly\` se strip. Keys ko \`as\` se remap bhi kar sakte ho. Mapped types aapko ek source se types ke poore parivaar automatically derive karne dete hain.

**Key Interview Points**

* Syntax: \`{ \[K in keyof T\]: NewType }\` — transform each property.

* Powers utility types like Partial, Required, Readonly, Pick.

* Add/remove modifiers: \`?\`, \`readonly\`, \`-?\`, \`-readonly\`.

* Remap keys with \`as\` (key remapping).

* Derive whole type families from one source type.

**Real-World Example**

Building a \`Nullable\<T\>\` that makes every property \`T\[K\] | null\`, or a \`Stringify\<T\>\` that turns all values into strings — one mapped type generates the variant for any input type.

**Code — Full & Runnable**

// solution.ts — custom mapped types.  
   
// Make all properties optional (like Partial)  
type MyPartial\<T\> \= { \[K in keyof T\]?: T\[K\] };  
   
// Make all properties nullable  
type Nullable\<T\> \= { \[K in keyof T\]: T\[K\] | null };  
   
interface User { id: number; name: string; }  
   
export function merge(base: User, patch: MyPartial\<User\>): User {  
  return { ...base, ...patch };  
}  
   
export function nullify(user: User): Nullable\<User\> {  
  return { id: null, name: null };  
}

**Test / Demo & Expected Output**

// test.ts — run: npx tsx test.ts  
import { merge, nullify } from "./solution";  
   
console.log(merge({ id: 1, name: "Asha" }, { name: "Asha K" })); // partial patch  
console.log(nullify({ id: 1, name: "Asha" }));                   // { id:null, name:null }  
   
console.assert(merge({ id: 1, name: "Asha" }, { name: "X" }).name \=== "X", "MyPartial mapped type");  
console.assert(nullify({ id: 1, name: "Asha" }).id \=== null, "Nullable mapped type");  
console.log("mapped-types assertions passed.");  
   
/\* EXPECTED OUTPUT:  
{ id: 1, name: 'Asha K' }  
{ id: null, name: null }  
mapped-types assertions passed.  
\*/

**Common Follow-up Questions**

**Q: What is the syntax of a mapped type?**

**A:** \`{ \[K in keyof T\]: NewType }\` — it iterates over the keys of T and defines a property for each, optionally transforming the value type and modifiers.

**Q: How do you remove \`optional\` or \`readonly\` in a mapped type?**

**A:** Use the subtractive modifiers \`-?\` and \`-readonly\`, e.g. \`{ \[K in keyof T\]-?: T\[K\] }\` makes all properties required (this is how \`Required\<T\>\` works).

## **60\. Conditional Types**

**Simple Explanation (English)**

A conditional type chooses one type or another based on a condition, using the ternary-like syntax \`T extends U ? X : Y\`. It reads as: 'if T is assignable to U, the result is X, otherwise Y.' This brings if/else logic to the type level.

Conditional types are how utilities like \`Exclude\`, \`Extract\`, \`NonNullable\`, and \`ReturnType\` are built. They also distribute over union types by default (applying the condition to each member), enabling powerful type transformations.

**Hinglish Explanation**

Conditional type ek condition ke aadhaar par ek ya doosra type chunta hai, ternary-jaisi syntax \`T extends U ? X : Y\` se. Ye padha jaata hai: 'agar T, U ko assignable hai to result X, warna Y.' Ye if/else logic ko type level par laata hai.  
Conditional types se hi \`Exclude\`, \`Extract\`, \`NonNullable\`, aur \`ReturnType\` jaise utilities bante hain. Ye default me union types par distribute bhi hote hain (har member par condition apply karke), jisse powerful type transformations possible hote hain.

**Key Interview Points**

* Syntax: \`T extends U ? X : Y\` — type-level if/else.

* Underlies Exclude, Extract, NonNullable, ReturnType.

* Distributes over unions by default (per-member).

* Combine with \`infer\` to capture and reuse types.

* Wrap in \`\[T\] extends \[U\]\` to disable distribution when needed.

**Real-World Example**

A \`Flatten\<T\>\` that yields the element type if \`T\` is an array and \`T\` otherwise (\`T extends (infer E)\[\] ? E : T\`) — a single conditional type adapts based on whether the input is an array.

**Code — Full & Runnable**

// solution.ts — conditional types.  
   
type IsString\<T\> \= T extends string ? "yes" : "no";  
type Flatten\<T\> \= T extends (infer E)\[\] ? E : T;  
   
export function classify\<T\>(value: T): IsString\<T\> {  
  return (typeof value \=== "string" ? "yes" : "no") as IsString\<T\>;  
}  
   
export function flattenFirst\<T\>(value: T\[\] | T): Flatten\<T\[\] | T\> {  
  return (Array.isArray(value) ? value\[0\] : value) as Flatten\<T\[\] | T\>;  
}

**Test / Demo & Expected Output**

// test.ts — run: npx tsx test.ts  
import { classify, flattenFirst } from "./solution";  
   
console.log(classify("hi"));        // yes  
console.log(classify(123));         // no  
console.log(flattenFirst(\[1, 2, 3\])); // 1  
console.log(flattenFirst(99));        // 99  
   
console.assert(classify("hi") \=== "yes", "conditional: string \-\> yes");  
console.assert(classify(123) \=== "no", "conditional: number \-\> no");  
console.assert(flattenFirst(\[1, 2, 3\]) \=== 1, "Flatten array");  
console.assert(flattenFirst(99) \=== 99, "Flatten non-array");  
console.log("conditional-types assertions passed.");  
   
/\* EXPECTED OUTPUT:  
yes  
no  
1  
99  
conditional-types assertions passed.  
\*/

**Common Follow-up Questions**

**Q: What is the syntax of a conditional type?**

**A:** \`T extends U ? X : Y\` — if T is assignable to U, the type resolves to X, otherwise Y. It's type-level if/else.

**Q: What does it mean that conditional types distribute over unions?**

**A:** When the checked type is a naked type parameter and a union is passed, the condition is applied to each union member separately, then the results are unioned — enabling per-member transformations.

## **61\. Infer (infer basics)**

**Simple Explanation (English)**

The \`infer\` keyword, used inside a conditional type's \`extends\` clause, captures part of a type into a new type variable you can then use. For example \`T extends (infer E)\[\] ? E : never\` extracts the element type \`E\` from an array type.

It's the key to extracting parts of complex types — array elements, promise values, function return types, parameter types. The built-in \`ReturnType\`, \`Parameters\`, and \`Awaited\` are all implemented with \`infer\`.

**Hinglish Explanation**

\`infer\` keyword, ek conditional type ke \`extends\` clause ke andar use hota hai, ek type ke hisse ko ek naye type variable me capture karta hai jise aap phir use kar sakte ho. Jaise \`T extends (infer E)\[\] ? E : never\` array type se element type \`E\` extract karta hai.  
Ye complex types ke hisse extract karne ki kunji hai — array elements, promise values, function return types, parameter types. Built-in \`ReturnType\`, \`Parameters\`, aur \`Awaited\` sab \`infer\` se bane hain.

**Key Interview Points**

* \`infer X\` captures a type within a conditional's \`extends\` clause.

* Use the captured \`X\` in the true branch.

* Extracts array elements, promise values, return/param types.

* Powers ReturnType, Parameters, Awaited internally.

* Only valid inside the \`extends\` part of a conditional type.

**Real-World Example**

Writing your own \`UnwrapPromise\<T\> \= T extends Promise\<infer V\> ? V : T\` to get the resolved value type of any promise — exactly the pattern the built-in \`Awaited\` uses.

**Code — Full & Runnable**

// solution.ts — infer to extract inner types.  
   
type ElementType\<T\> \= T extends (infer E)\[\] ? E : never;  
type UnwrapPromise\<T\> \= T extends Promise\<infer V\> ? V : T;  
   
export function firstElement\<T extends unknown\[\]\>(arr: T): ElementType\<T\> {  
  return arr\[0\] as ElementType\<T\>;  
}  
   
export async function unwrap\<T\>(p: Promise\<T\>): Promise\<UnwrapPromise\<Promise\<T\>\>\> {  
  return await p;  
}

**Test / Demo & Expected Output**

// test.ts — run: npx tsx test.ts  
import { firstElement, unwrap } from "./solution";  
   
console.log(firstElement(\[10, 20, 30\])); // 10  
console.log(firstElement(\["a", "b"\]));   // a  
   
(async () \=\> {  
  const v \= await unwrap(Promise.resolve(42));  
  console.log(v); // 42  
  console.assert(firstElement(\[10, 20\]) \=== 10, "infer element type");  
  console.assert(v \=== 42, "infer promise value");  
  console.log("infer assertions passed.");  
})();  
   
/\* EXPECTED OUTPUT:  
10  
a  
42  
infer assertions passed.  
\*/

**Common Follow-up Questions**

**Q: What does \`infer\` do?**

**A:** Inside a conditional type's \`extends\` clause, it captures a portion of the matched type into a new type variable you can use in the result — e.g. extracting an array's element type or a promise's value type.

**Q: Name a built-in utility implemented with infer.**

**A:** \`ReturnType\`, \`Parameters\`, and \`Awaited\` all use \`infer\` to extract the return type, parameter tuple, and resolved promise value respectively.

## **62\. Template Literal Types**

**Simple Explanation (English)**

Template literal types let you build new string-literal types by interpolating other types inside backtick type expressions: \`type Greeting \= \\\`Hello, ${string}\\\`\`. They mirror template literals but at the type level.

Combined with unions they generate combinations — e.g. \`\\\`${"on" | "off"}-${"a" | "b"}\\\`\` produces all four string variants. With intrinsic helpers like \`Uppercase\`/\`Lowercase\`/\`Capitalize\`, they enable precise, derived string types for event names, CSS classes, and keys.

**Hinglish Explanation**

Template literal types aapko naye string-literal types banane dete hain doosre types ko backtick type expressions me interpolate karke: \`type Greeting \= \\\`Hello, ${string}\\\`\`. Ye template literals ki nakal karte hain par type level par.  
Unions ke saath ye combinations generate karte hain — jaise \`\\\`${"on" | "off"}-${"a" | "b"}\\\`\` chaaro string variants banata hai. \`Uppercase\`/\`Lowercase\`/\`Capitalize\` jaise intrinsic helpers ke saath, ye event names, CSS classes, aur keys ke liye precise, derived string types dete hain.

**Key Interview Points**

* Build string-literal types via \`\\\`...${T}...\\\`\` type expressions.

* Unions inside generate all combinations.

* Intrinsics: Uppercase, Lowercase, Capitalize, Uncapitalize.

* Great for event names, prefixed keys, CSS class types.

* Type-level mirror of runtime template literals.

**Real-World Example**

Typing event handler keys as \`\\\`on${Capitalize\<EventName\>}\\\`\` derives \`onClick\`, \`onChange\`, etc. from a base list — keeping handler prop names exact and in sync with the event names.

**Code — Full & Runnable**

// solution.ts — template literal types.  
   
type Event \= "click" | "change";  
export type Handler \= \`on${Capitalize\<Event\>}\`; // "onClick" | "onChange"  
   
export function makeHandlerName(event: Event): Handler {  
  return ("on" \+ event.charAt(0).toUpperCase() \+ event.slice(1)) as Handler;  
}  
   
type Size \= "sm" | "lg";  
type Color \= "red" | "blue";  
export type Variant \= \`${Size}-${Color}\`; // 4 combinations  
   
export function variant(size: Size, color: Color): Variant {  
  return \`${size}-${color}\`;  
}

**Test / Demo & Expected Output**

// test.ts — run: npx tsx test.ts  
import { makeHandlerName, variant } from "./solution";  
   
console.log(makeHandlerName("click"));  // onClick  
console.log(makeHandlerName("change")); // onChange  
console.log(variant("sm", "red"));      // sm-red  
   
console.assert(makeHandlerName("click") \=== "onClick", "capitalized handler name");  
console.assert(variant("lg", "blue") \=== "lg-blue", "combined variant");  
console.log("template-literal-types assertions passed.");  
   
/\* EXPECTED OUTPUT:  
onClick  
onChange  
sm-red  
template-literal-types assertions passed.  
\*/

**Common Follow-up Questions**

**Q: What do template literal types let you build?**

**A:** New string-literal types by interpolating other types in backtick type expressions (e.g. \`\\\`on${Capitalize\<E\>}\\\`\`), including generating all combinations from unions.

**Q: What intrinsic string helpers exist?**

**A:** \`Uppercase\`, \`Lowercase\`, \`Capitalize\`, and \`Uncapitalize\` transform string-literal types, often used together with template literal types to derive precise key/event names.

## **63\. Recursive Types**

**Simple Explanation (English)**

A recursive type references itself in its own definition, letting you model arbitrarily nested data — trees, linked lists, nested comments, or JSON. For example a JSON value type refers to itself for arrays and objects of JSON values.

TypeScript supports recursion in type aliases and interfaces. It's essential for typing self-similar structures and for advanced recursive utility types (like a \`DeepReadonly\<T\>\` or \`DeepPartial\<T\>\` that applies recursively to every nested level).

**Hinglish Explanation**

Recursive type apni definition me khud ko reference karta hai, jisse aap arbitrarily nested data model kar sakte ho — trees, linked lists, nested comments, ya JSON. Jaise ek JSON value type arrays aur objects of JSON values ke liye khud ko reference karta hai.  
TypeScript type aliases aur interfaces me recursion support karta hai. Ye self-similar structures type karne aur advanced recursive utility types (jaise \`DeepReadonly\<T\>\` ya \`DeepPartial\<T\>\` jo har nested level par recursively apply ho) ke liye zaruri hai.

**Key Interview Points**

* A type that references itself to model nested data.

* Models trees, linked lists, comments, and JSON.

* Supported in type aliases and interfaces.

* Enables deep recursive utilities (DeepReadonly, DeepPartial).

* Each recursive reference handles one nesting level.

**Real-World Example**

Typing a comment thread where each comment has \`replies: Comment\[\]\` — a recursive type captures unlimited nesting so the whole tree is type-safe to traverse.

**Code — Full & Runnable**

// solution.ts — recursive type for a tree \+ a JSON value type.  
   
export interface TreeNode {  
  value: number;  
  children: TreeNode\[\];  
}  
   
export function sumTree(node: TreeNode): number {  
  return node.value \+ node.children.reduce((acc, c) \=\> acc \+ sumTree(c), 0);  
}  
   
export type Json \=  
  | string | number | boolean | null  
  | Json\[\]  
  | { \[key: string\]: Json };  
   
export function depth(json: Json): number {  
  if (Array.isArray(json)) return 1 \+ Math.max(0, ...json.map(depth));  
  if (json && typeof json \=== "object") return 1 \+ Math.max(0, ...Object.values(json).map(depth));  
  return 0;  
}

**Test / Demo & Expected Output**

// test.ts — run: npx tsx test.ts  
import { sumTree, depth } from "./solution";  
   
const tree \= { value: 1, children: \[{ value: 2, children: \[\] }, { value: 3, children: \[{ value: 4, children: \[\] }\] }\] };  
console.log(sumTree(tree)); // 10  
console.log(depth({ a: { b: \[1, 2\] } })); // 3  
   
console.assert(sumTree(tree) \=== 10, "recursive tree sum");  
console.assert(depth({ a: { b: \[1\] } }) \=== 3, "recursive JSON depth");  
console.log("recursive-types assertions passed.");  
   
/\* EXPECTED OUTPUT:  
10  
3  
recursive-types assertions passed.  
\*/

**Common Follow-up Questions**

**Q: What is a recursive type?**

**A:** A type that refers to itself in its definition, used to model arbitrarily nested structures like trees, linked lists, or JSON values.

**Q: Give an example of a recursive utility type.**

**A:** \`DeepReadonly\<T\>\` or \`DeepPartial\<T\>\` — they apply the transformation recursively to every nested object level, unlike the shallow built-in \`Readonly\`/\`Partial\`.

## **64\. satisfies Operator**

**Simple Explanation (English)**

The \`satisfies\` operator (TS 4.9+) checks that an expression conforms to a type WITHOUT widening or changing the expression's own inferred type. You get validation against a constraint while keeping the most specific inferred type.

Contrast with a type annotation, which would widen the value to the annotated type. \`satisfies\` is ideal for config objects: you ensure the object matches a shape (catching missing/extra keys) but still retain the precise literal types for autocomplete and narrowing.

**Hinglish Explanation**

\`satisfies\` operator (TS 4.9+) check karta hai ki ek expression ek type ke anuroop hai BINA expression ke apne inferred type ko widen ya change kiye. Aapko ek constraint ke against validation milti hai jabki sabse specific inferred type bana rehta hai.  
Type annotation ke विपरीत, jo value ko annotated type me widen kar deti, \`satisfies\` config objects ke liye ideal hai: aap ensure karte ho ki object ek shape se match kare (missing/extra keys pakad kar) par precise literal types autocomplete aur narrowing ke liye retain karte ho.

**Key Interview Points**

* \`expr satisfies Type\` validates against Type without widening expr.

* Keeps the most specific inferred type (literals preserved).

* Catches missing/extra/wrong properties like an annotation would.

* Better than annotation when you want both checking AND narrow types.

* Available since TypeScript 4.9.

**Real-World Example**

A theme config \`const theme \= {...} satisfies Record\<string, string\>\` is validated as a string map yet each key keeps its literal type, so \`theme.primary\` autocompletes and narrows precisely — something a plain annotation would lose.

**Code — Full & Runnable**

// solution.ts — satisfies validates without widening.  
   
type Color \= string;  
const palette \= {  
  primary: "\#1f4e79",  
  danger: "\#d33",  
} satisfies Record\<string, Color\>;  
   
// 'palette.primary' keeps its literal type, but the shape was checked.  
export function getColor(key: keyof typeof palette): string {  
  return palette\[key\];  
}  
   
export const keys \= Object.keys(palette);

**Test / Demo & Expected Output**

// test.ts — run: npx tsx test.ts  
import { getColor, keys } from "./solution";  
   
console.log(getColor("primary")); // \#1f4e79  
console.log(getColor("danger"));  // \#d33  
console.log(keys);                // \['primary','danger'\]  
   
console.assert(getColor("primary") \=== "\#1f4e79", "satisfies preserves literal access");  
console.assert(keys.length \=== 2, "shape validated, keys intact");  
console.log("satisfies assertions passed.");  
   
/\* EXPECTED OUTPUT:  
\#1f4e79  
\#d33  
\[ 'primary', 'danger' \]  
satisfies assertions passed.  
\*/

**Common Follow-up Questions**

**Q: How does \`satisfies\` differ from a type annotation?**

**A:** An annotation widens the value to the annotated type. \`satisfies\` only checks conformance while keeping the expression's own, more specific inferred type (preserving literals and exact keys).

**Q: When is \`satisfies\` especially useful?**

**A:** For config/constant objects where you want to validate the overall shape but retain precise literal types for autocomplete, narrowing, and \`keyof typeof\` derivations.

## **65\. Type Narrowing**

**Simple Explanation (English)**

Type narrowing is how TypeScript refines a broad type (like a union) to a more specific one based on control-flow checks. After a check, within that branch, the compiler treats the value as the narrowed type so you can safely access its members.

Common narrowing techniques: \`typeof\` (for primitives), \`instanceof\` (for classes), truthiness checks, equality checks against literals, the \`in\` operator (property presence), and discriminated-union checks. Narrowing is what makes unions practical to work with.

**Hinglish Explanation**

Type narrowing woh tarika hai jisse TypeScript ek broad type (jaise union) ko control-flow checks ke aadhaar par ek zyada specific type me refine karta hai. Check ke baad, us branch ke andar, compiler value ko narrowed type ki tarah treat karta hai taaki aap uske members safely access kar sako.  
Common narrowing techniques: \`typeof\` (primitives ke liye), \`instanceof\` (classes ke liye), truthiness checks, literals ke against equality checks, \`in\` operator (property presence), aur discriminated-union checks. Narrowing hi unions ke saath kaam karna practical banata hai.

**Key Interview Points**

* Refines a broad/union type to a specific one via control-flow checks.

* Techniques: typeof, instanceof, truthiness, equality, \`in\`, discriminants.

* Within a checked branch, the value has the narrowed type.

* Makes union types safe and practical to use.

* The compiler tracks narrowing across if/switch/early returns.

**Real-World Example**

Handling a value that's \`string | string\[\]\`: \`if (Array.isArray(x)) x.join(',') else x.trim()\` — each branch safely uses the methods of the narrowed type without casts.

**Code — Full & Runnable**

// solution.ts — several narrowing techniques.  
   
export function lengthOf(value: string | string\[\] | null): number {  
  if (value \=== null) return 0;               // equality narrowing  
  if (typeof value \=== "string") return value.length; // typeof narrowing  
  return value.length;                         // narrowed to string\[\]  
}  
   
export class Cat { meow() { return "meow"; } }  
export class Dog { bark() { return "woof"; } }  
export function speak(animal: Cat | Dog): string {  
  if (animal instanceof Cat) return animal.meow(); // instanceof narrowing  
  return animal.bark();  
}  
   
export function hasName(obj: { name?: string } | { id: number }): boolean {  
  return "name" in obj; // 'in' operator narrowing  
}

**Test / Demo & Expected Output**

// test.ts — run: npx tsx test.ts  
import { lengthOf, speak, Cat, Dog } from "./solution";  
   
console.log(lengthOf("hello"));      // 5  
console.log(lengthOf(\["a", "b"\]));   // 2  
console.log(lengthOf(null));         // 0  
console.log(speak(new Cat()));       // meow  
console.log(speak(new Dog()));       // woof  
   
console.assert(lengthOf("hello") \=== 5, "typeof narrowing");  
console.assert(lengthOf(\["a", "b"\]) \=== 2, "array branch");  
console.assert(lengthOf(null) \=== 0, "null narrowing");  
console.assert(speak(new Cat()) \=== "meow", "instanceof narrowing");  
console.log("type-narrowing assertions passed.");  
   
/\* EXPECTED OUTPUT:  
5  
2  
0  
meow  
woof  
type-narrowing assertions passed.  
\*/

**Common Follow-up Questions**

**Q: What is type narrowing?**

**A:** The compiler refining a broad type (like a union) into a more specific one inside a branch, based on runtime checks (typeof, instanceof, equality, \`in\`, etc.), so member access is type-safe.

**Q: List a few narrowing techniques.**

**A:** \`typeof\` for primitives, \`instanceof\` for class instances, truthiness and literal-equality checks, the \`in\` operator for property presence, and discriminant-field checks on discriminated unions.

## **66\. Type Guards**

**Simple Explanation (English)**

A type guard is an expression (often a function) that narrows a type at runtime in a way the compiler understands. A user-defined type guard uses a return type of the form \`value is Type\` (a 'type predicate'), telling TypeScript that when the function returns true, the argument is that type.

Built-in guards include \`typeof\`, \`instanceof\`, and \`Array.isArray\`. Custom guards are invaluable for validating unknown/external data (like API responses) and narrowing unions, letting the rest of your code work with precise types.

**Hinglish Explanation**

Type guard ek expression (aksar ek function) hai jo runtime par type ko aise narrow karta hai jise compiler samajhta hai. User-defined type guard \`value is Type\` form ka return type (ek 'type predicate') use karta hai, TypeScript ko batate hue ki jab function true return kare to argument us type ka hai.  
Built-in guards me \`typeof\`, \`instanceof\`, aur \`Array.isArray\` aate hain. Custom guards unknown/external data (jaise API responses) validate karne aur unions narrow karne ke liye bohot useful hain, jisse baaki code precise types ke saath kaam karta hai.

**Key Interview Points**

* A type guard narrows a type in a compiler-aware way.

* User-defined guard returns a predicate: \`value is Type\`.

* When it returns true, TS narrows the argument to that type.

* Built-in guards: typeof, instanceof, Array.isArray.

* Essential for validating unknown/external data and unions.

**Real-World Example**

An \`isUser(value): value is User\` guard validates incoming API JSON; after \`if (isUser(data))\`, the rest of the code treats \`data\` as a fully-typed \`User\` with no casts.

**Code — Full & Runnable**

// solution.ts — a user-defined type guard (type predicate).  
   
interface User { id: number; name: string; }  
   
export function isUser(value: unknown): value is User {  
  return (  
    typeof value \=== "object" && value \!== null &&  
    typeof (value as any).id \=== "number" &&  
    typeof (value as any).name \=== "string"  
  );  
}  
   
export function describe(value: unknown): string {  
  if (isUser(value)) return "User: " \+ value.name; // narrowed to User  
  return "Unknown";  
}

**Test / Demo & Expected Output**

// test.ts — run: npx tsx test.ts  
import { isUser, describe } from "./solution";  
   
console.log(isUser({ id: 1, name: "Asha" })); // true  
console.log(isUser({ id: 1 }));               // false  
console.log(describe({ id: 2, name: "Ravi" })); // User: Ravi  
console.log(describe("nope"));                  // Unknown  
   
console.assert(isUser({ id: 1, name: "Asha" }) \=== true, "valid user passes guard");  
console.assert(isUser({ id: 1 }) \=== false, "invalid object fails guard");  
console.assert(describe({ id: 2, name: "Ravi" }) \=== "User: Ravi", "narrowed access");  
console.log("type-guards assertions passed.");  
   
/\* EXPECTED OUTPUT:  
true  
false  
User: Ravi  
Unknown  
type-guards assertions passed.  
\*/

**Common Follow-up Questions**

**Q: What is a type predicate?**

**A:** A special return type of the form \`value is Type\` on a boolean-returning function. When the function returns true, TypeScript narrows the argument to that type in the calling code.

**Q: Why are type guards important for unknown data?**

**A:** They let you validate external/untrusted data at runtime and have the compiler treat it as a known type afterward, combining runtime safety with static typing.

## **67\. Discriminated Unions**

**Simple Explanation (English)**

A discriminated (or 'tagged') union is a union of object types that all share a common literal property — the discriminant (e.g. \`kind\` or \`type\`). Checking that property narrows the union to exactly one member, giving precise, safe access to its fields.

This pattern is the idiomatic way to model values with several distinct shapes (a result that's success or error, a shape that's circle or square). Combined with a \`never\` default in a switch, it enables exhaustiveness checking so missing a case is a compile error.

**Hinglish Explanation**

Discriminated (ya 'tagged') union object types ka ek union hai jo sab ek common literal property share karte hain — discriminant (jaise \`kind\` ya \`type\`). Us property ko check karne par union bilkul ek member tak narrow ho jaata hai, jisse uske fields tak precise, safe access milti hai.  
Ye pattern kai distinct shapes wali values model karne ka idiomatic tarika hai (ek result jo success ya error ho, ek shape jo circle ya square ho). Switch me \`never\` default ke saath, ye exhaustiveness checking enable karta hai taaki koi case chhutne par compile error aaye.

**Key Interview Points**

* A union of object types sharing a literal discriminant field.

* Checking the discriminant narrows to one exact member.

* Ideal for results (ok/error) and shape variants.

* Enables exhaustiveness checks with a \`never\` default.

* Safer and clearer than checking many optional fields.

**Real-World Example**

An async result modeled as \`{ status: "loading" } | { status: "success"; data: T } | { status: "error"; error: string }\` forces UI code to handle every state and only access \`data\` after confirming success.

**Code — Full & Runnable**

// solution.ts — discriminated union with exhaustive handling.  
   
type Shape \=  
  | { kind: "circle"; radius: number }  
  | { kind: "rectangle"; width: number; height: number };  
   
export function area(shape: Shape): number {  
  switch (shape.kind) {  
    case "circle": return Math.PI \* shape.radius \*\* 2;  
    case "rectangle": return shape.width \* shape.height;  
    default: {  
      const \_exhaustive: never \= shape; // compile error if a case is missing  
      return \_exhaustive;  
    }  
  }  
}

**Test / Demo & Expected Output**

// test.ts — run: npx tsx test.ts  
import { area } from "./solution";  
   
console.log(Math.round(area({ kind: "circle", radius: 2 })));      // 13  
console.log(area({ kind: "rectangle", width: 3, height: 4 }));     // 12  
   
console.assert(Math.round(area({ kind: "circle", radius: 2 })) \=== 13, "circle area via discriminant");  
console.assert(area({ kind: "rectangle", width: 3, height: 4 }) \=== 12, "rectangle area");  
console.log("discriminated-unions assertions passed.");  
   
/\* EXPECTED OUTPUT:  
13  
12  
discriminated-unions assertions passed.  
\*/

**Common Follow-up Questions**

**Q: What makes a union 'discriminated'?**

**A:** A shared literal property (the discriminant, like \`kind\`) present on every member with a distinct value. Checking it lets TypeScript narrow the union to a single member safely.

**Q: How do discriminated unions enable exhaustiveness checks?**

**A:** After handling all members in a switch, the value narrows to \`never\` in the default case. Assigning it to a \`never\` variable causes a compile error if any case was forgotten.

## **68\. Declaration Files (.d.ts) & declare**

**Simple Explanation (English)**

A declaration file (\`.d.ts\`) contains only type declarations — no implementations. It describes the shapes of existing JavaScript code (libraries, globals, modules) so TypeScript can type-check usage without the original source. The \`declare\` keyword introduces 'ambient' declarations: types for things that exist at runtime but aren't defined in TypeScript.

You use \`declare\` for global variables, modules, or values provided by the environment (\`declare const VERSION: string\`), and \`.d.ts\` files to ship types for JS libraries (this is what \`@types/...\` packages are). They provide types without emitting any JavaScript.

**Hinglish Explanation**

Declaration file (\`.d.ts\`) me sirf type declarations hote hain — koi implementation nahi. Ye existing JavaScript code (libraries, globals, modules) ki shapes describe karta hai taaki TypeScript original source ke bina usage type-check kar sake. \`declare\` keyword 'ambient' declarations introduce karta hai: un cheezon ke types jo runtime par exist karti hain par TypeScript me defined nahi.  
Aap \`declare\` global variables, modules, ya environment ke diye values ke liye use karte ho (\`declare const VERSION: string\`), aur \`.d.ts\` files JS libraries ke types ship karne ke liye (yahi \`@types/...\` packages hain). Ye koi JavaScript emit kiye bina types provide karte hain.

**Key Interview Points**

* \`.d.ts\` files contain types only — no implementation.

* Describe existing JS (libraries, globals) for the type checker.

* \`declare\` introduces ambient types for runtime-existing things.

* \`@types/...\` packages are community-maintained .d.ts files.

* They emit no JavaScript — purely compile-time information.

**Real-World Example**

Using an untyped JS library, you (or DefinitelyTyped) write a \`.d.ts\` so TypeScript knows its API; or \`declare global\` to type a value injected onto \`window\` by an external script.

**Code — Full & Runnable**

// A declaration file (math-lib.d.ts) describing an untyped JS module:  
//  
//   declare module "math-lib" {  
//     export function square(n: number): number;  
//   }  
//  
// Ambient global declaration (globals.d.ts):  
//  
//   declare const APP\_VERSION: string; // exists at runtime, typed here  
//  
// .d.ts files emit NO JavaScript — they only provide types.  
// Below is a runnable stand-in showing the typed contract such a file describes.  
   
export interface MathLib {  
  square(n: number): number;  
}  
   
export const mathLib: MathLib \= {  
  square: (n) \=\> n \* n,  
};

**Test / Demo & Expected Output**

// test.ts — run: npx tsx test.ts  
import { mathLib } from "./solution";  
   
console.log(mathLib.square(5)); // 25  
console.assert(mathLib.square(5) \=== 25, "typed contract (as a .d.ts would describe) works");  
console.log("declaration-files assertions passed.");  
console.log("Note: a real .d.ts provides these types with NO implementation/JS output.");  
   
/\* EXPECTED OUTPUT:  
25  
declaration-files assertions passed.  
Note: a real .d.ts provides these types with NO implementation/JS output.  
\*/

**Common Follow-up Questions**

**Q: What is a \`.d.ts\` file?**

**A:** A TypeScript declaration file that contains only type information (no implementation). It describes the shapes of existing JS so the compiler can type-check usage; it emits no JavaScript.

**Q: What does the \`declare\` keyword do?**

**A:** It introduces an ambient declaration — a type for something that exists at runtime but isn't defined in your TypeScript (e.g. a global variable or an external module's API).

## **69\. import type (type-only imports)**

**Simple Explanation (English)**

\`import type { X } from "./module"\` imports something used ONLY as a type. The compiler guarantees it's erased from the output JavaScript, so it never causes a runtime import or side effect. There's also \`export type\` and inline \`import { type X, value }\`.

Type-only imports make intent explicit, prevent accidental runtime dependencies on type-only modules, and help bundlers/\`isolatedModules\` strip types correctly. They're a best practice in modern codebases for clearly separating type imports from value imports.

**Hinglish Explanation**

\`import type { X } from "./module"\` kisi aisi cheez ko import karta hai jo SIRF type ki tarah use hoti hai. Compiler guarantee karta hai ki ye output JavaScript se erase ho jaaye, isliye ye kabhi runtime import ya side effect nahi karta. \`export type\` aur inline \`import { type X, value }\` bhi hote hain.  
Type-only imports intent explicit banate hain, type-only modules par accidental runtime dependencies rokte hain, aur bundlers/\`isolatedModules\` ko types sahi strip karne me help karte hain. Ye modern codebases me type imports ko value imports se clearly alag karne ki best practice hain.

**Key Interview Points**

* \`import type {...}\` imports types only; erased from output.

* No runtime import or side effect occurs.

* Also \`export type\` and inline \`import { type X, value }\`.

* Helps isolatedModules/bundlers strip types correctly.

* Best practice for separating type vs value imports.

**Real-World Example**

Importing only a \`User\` interface for annotations with \`import type { User } from "./models"\` guarantees the models module isn't pulled into the runtime bundle just to satisfy a type reference.

**Code — Full & Runnable**

// In a real project across files:  
//  
//   // models.ts  
//   export interface User { id: number; name: string; }  
//  
//   // consumer.ts  
//   import type { User } from "./models"; // erased at runtime  
//   function greet(u: User) { return "Hi " \+ u.name; }  
//  
// Type-only imports produce NO runtime import. Below (single file) shows the  
// equivalent typed usage; the type reference is compile-time only.  
   
export interface User { id: number; name: string; }  
   
export function greet(u: User): string {  
  return "Hi " \+ u.name;  
}

**Test / Demo & Expected Output**

// test.ts — run: npx tsx test.ts  
import { greet } from "./solution";  
import type { User } from "./solution"; // type-only: erased at runtime  
   
const user: User \= { id: 1, name: "Asha" };  
console.log(greet(user)); // Hi Asha  
   
console.assert(greet(user) \=== "Hi Asha", "type-only import used for annotation");  
console.log("import-type assertions passed.");  
   
/\* EXPECTED OUTPUT:  
Hi Asha  
import-type assertions passed.  
\*/

**Common Follow-up Questions**

**Q: What does \`import type\` guarantee?**

**A:** That the import is used only as a type and is fully erased from the emitted JavaScript — it causes no runtime import or side effect.

**Q: Why use type-only imports?**

**A:** They make intent explicit, prevent accidental runtime dependencies on type-only modules, and help tools with \`isolatedModules\` reliably strip types during compilation/bundling.

## **70\. Namespaces**

**Simple Explanation (English)**

A namespace groups related code (types, functions, variables) under a single named container, accessed with dot notation (\`MyNamespace.thing\`). It was TypeScript's original way to organize code and avoid polluting the global scope before ES modules became standard.

Namespaces emit a real object at runtime and can use \`export\` internally to expose members. In modern code, ES modules (\`import\`/\`export\`) are preferred for organizing files; namespaces are now mainly seen in legacy code, global type augmentation, and bundled library type definitions.

**Hinglish Explanation**

Namespace related code (types, functions, variables) ko ek named container ke andar group karta hai, dot notation se access hota hai (\`MyNamespace.thing\`). Ye ES modules standard banne se pehle TypeScript ka code organize karne aur global scope ganda hone se bachne ka original tarika tha.  
Namespaces runtime par ek real object emit karte hain aur internally \`export\` se members expose kar sakte hain. Modern code me, files organize karne ke liye ES modules (\`import\`/\`export\`) preferred hain; namespaces ab mainly legacy code, global type augmentation, aur bundled library type definitions me dikhte hain.

**Key Interview Points**

* Groups related code under a named container (\`NS.member\`).

* Original pre-modules way to organize code and avoid globals.

* Use \`export\` inside to expose members; emits a runtime object.

* Modern code prefers ES modules over namespaces.

* Still seen in legacy code and library .d.ts bundles.

**Real-World Example**

Older codebases or large library type bundles group helpers like \`Validation.isEmail\` and \`Validation.isPhone\` under a \`Validation\` namespace; new code would instead use a module file with named exports.

**Code — Full & Runnable**

// solution.ts — a namespace grouping related helpers.  
   
export namespace Geometry {  
  export const PI \= 3.14159;  
  export function circleArea(r: number): number {  
    return PI \* r \* r;  
  }  
  export function rectArea(w: number, h: number): number {  
    return w \* h;  
  }  
}

**Test / Demo & Expected Output**

// test.ts — run: npx tsx test.ts  
import { Geometry } from "./solution";  
   
console.log(Math.round(Geometry.circleArea(2))); // 13  
console.log(Geometry.rectArea(3, 4));            // 12  
console.log(Geometry.PI);                        // 3.14159  
   
console.assert(Math.round(Geometry.circleArea(2)) \=== 13, "namespace function");  
console.assert(Geometry.rectArea(3, 4\) \=== 12, "another namespace function");  
console.log("namespaces assertions passed.");  
   
/\* EXPECTED OUTPUT:  
13  
12  
3.14159  
namespaces assertions passed.  
\*/

**Common Follow-up Questions**

**Q: What is a namespace used for?**

**A:** Grouping related types/functions/values under one named container to organize code and avoid polluting the global scope — TypeScript's pre-ES-modules organization mechanism.

**Q: Should you use namespaces in new code?**

**A:** Generally no — ES modules (\`import\`/\`export\`) are the modern standard for organizing code. Namespaces remain useful mainly for legacy code and bundled library type declarations.

## **71\. Typing React Props**

**Simple Explanation (English)**

Component props are typed with an interface or type alias describing each prop's name and type, including optional (\`?\`) props and callback props. The component then receives a fully-typed \`props\` object, so the compiler checks every usage and every parent passing them.

Common patterns: a \`Props\` interface for a function component, \`children: React.ReactNode\` for wrapping content, and event/callback props like \`onClick: () \=\> void\`. Typed props give autocomplete to consumers and catch missing or wrong props at compile time.

**Hinglish Explanation**

Component props ko ek interface ya type alias se type karte hain jo har prop ka naam aur type describe kare, including optional (\`?\`) props aur callback props. Phir component ko ek fully-typed \`props\` object milta hai, isliye compiler har usage aur har parent ke pass karne ko check karta hai.  
Common patterns: function component ke liye ek \`Props\` interface, content wrap karne ke liye \`children: React.ReactNode\`, aur event/callback props jaise \`onClick: () \=\> void\`. Typed props consumers ko autocomplete dete hain aur missing/galat props compile time par pakadte hain.

**Key Interview Points**

* Define a Props interface/type for each component.

* Mark optional props with \`?\`; type callbacks like \`onClick: () \=\> void\`.

* Use \`children: React.ReactNode\` for wrapper components.

* Consumers get autocomplete and compile-time prop checking.

* Defaults via default parameters/destructuring or defaultProps.

**Real-World Example**

A reusable \`\<Button label onClick disabled?\>\` defines a \`ButtonProps\` interface so every place that renders the button is checked for the right props, and the editor autocompletes them.

**Code — Full & Runnable**

// React usage (in a .tsx file):  
//  
//   interface ButtonProps {  
//     label: string;  
//     onClick: () \=\> void;  
//     disabled?: boolean;  
//   }  
//   const Button: React.FC\<ButtonProps\> \= ({ label, onClick, disabled \= false }) \=\> (  
//     \<button onClick={onClick} disabled={disabled}\>{label}\</button\>  
//   );  
//  
// Runnable stand-in (no React): the SAME props type \+ a render() that returns  
// the markup as a string so we can verify the typing/logic.  
   
export interface ButtonProps {  
  label: string;  
  onClick: () \=\> void;  
  disabled?: boolean;  
}  
   
export function renderButton({ label, onClick, disabled \= false }: ButtonProps): string {  
  return \`\<button disabled=${disabled}\>${label}\</button\>\`;  
}

**Test / Demo & Expected Output**

// test.ts — run: npx tsx test.ts  
import { renderButton } from "./solution";  
   
let clicked \= 0;  
console.log(renderButton({ label: "Save", onClick: () \=\> clicked++ }));  
console.log(renderButton({ label: "Delete", onClick: () \=\> {}, disabled: true }));  
   
console.assert(renderButton({ label: "Save", onClick: () \=\> {} }) \=== "\<button disabled=false\>Save\</button\>", "default disabled=false");  
console.assert(renderButton({ label: "X", onClick: () \=\> {}, disabled: true }).includes("disabled=true"), "disabled prop applied");  
console.log("typing-react-props assertions passed.");  
   
/\* EXPECTED OUTPUT:  
\<button disabled=false\>Save\</button\>  
\<button disabled=true\>Delete\</button\>  
typing-react-props assertions passed.  
\*/

**Common Follow-up Questions**

**Q: How do you type a component's props?**

**A:** Define an interface/type listing each prop with its type (optional ones marked \`?\`, callbacks as function types), then type the component's props parameter with it so usage is checked.

**Q: How do you type children?**

**A:** Use \`children: React.ReactNode\`, which accepts anything renderable (elements, strings, arrays, null) — the standard type for wrapper/container components.

## **72\. Typing Hooks**

**Simple Explanation (English)**

React hooks are generic, so you can specify or let TypeScript infer their types. \`useState(0)\` infers \`number\`; \`useState\<string | null\>(null)\` specifies a union. \`useRef\<HTMLInputElement\>(null)\` types the ref, and \`useReducer\` infers state/action types from the reducer.

Typing hooks correctly gives you safe state updates and refs. For custom hooks, type the arguments and the returned tuple/object explicitly so consumers get accurate types — e.g. a \`useToggle\` returning \`\[boolean, () \=\> void\]\`.

**Hinglish Explanation**

React hooks generic hain, isliye aap unke types specify kar sakte ho ya TypeScript ko infer karne de sakte ho. \`useState(0)\` \`number\` infer karta hai; \`useState\<string | null\>(null)\` ek union specify karta hai. \`useRef\<HTMLInputElement\>(null)\` ref type karta hai, aur \`useReducer\` reducer se state/action types infer karta hai.  
Hooks ko sahi type karna safe state updates aur refs deta hai. Custom hooks ke liye, arguments aur returned tuple/object explicitly type karo taaki consumers ko accurate types milein — jaise ek \`useToggle\` jo \`\[boolean, () \=\> void\]\` return kare.

**Key Interview Points**

* Hooks are generic: \`useState\<T\>\`, \`useRef\<T\>\`, \`useReducer\`.

* \`useState(0)\` infers number; specify for unions/null initial.

* Type custom hooks' args and returned tuple/object explicitly.

* Typed reducers infer state/action types for useReducer.

* Accurate hook types give safe updates and autocomplete.

**Real-World Example**

A custom \`useToggle(): \[boolean, () \=\> void\]\` returns a strongly-typed value and toggler, so destructuring \`const \[open, toggle\] \= useToggle()\` gives \`open: boolean\` and \`toggle: () \=\> void\` automatically.

**Code — Full & Runnable**

// React usage (in a .tsx file):  
//  
//   const \[count, setCount\] \= useState\<number\>(0);  
//   const inputRef \= useRef\<HTMLInputElement\>(null);  
//  
// Runnable stand-in: a typed mini 'useState' returning a \[getter, setter\] tuple.  
   
export function createState\<T\>(initial: T): \[() \=\> T, (next: T) \=\> void\] {  
  let value \= initial;  
  const get \= () \=\> value;  
  const set \= (next: T) \=\> { value \= next; };  
  return \[get, set\];  
}  
   
// A typed custom 'hook' (logic only)  
export function createToggle(initial \= false): \[() \=\> boolean, () \=\> void\] {  
  let on \= initial;  
  return \[() \=\> on, () \=\> { on \= \!on; }\];  
}

**Test / Demo & Expected Output**

// test.ts — run: npx tsx test.ts  
import { createState, createToggle } from "./solution";  
   
const \[count, setCount\] \= createState\<number\>(0);  
setCount(5);  
console.log(count()); // 5  
   
const \[isOn, toggle\] \= createToggle();  
toggle();  
console.log(isOn()); // true  
   
console.assert(count() \=== 5, "typed state setter/getter");  
console.assert(isOn() \=== true, "typed toggle hook");  
console.log("typing-hooks assertions passed.");  
   
/\* EXPECTED OUTPUT:  
5  
true  
typing-hooks assertions passed.  
\*/

**Common Follow-up Questions**

**Q: When should you specify useState's type explicitly?**

**A:** When the initial value doesn't capture the full type — e.g. \`useState\<string | null\>(null)\` or an empty array you intend to fill: \`useState\<User\[\]\>(\[\])\`. Otherwise inference is fine.

**Q: How do you type a custom hook's return?**

**A:** Annotate the returned tuple/object explicitly (e.g. \`\[boolean, () \=\> void\]\`) so consumers destructure with precise types instead of inferred-but-vague ones.

## **73\. Typing Events**

**Simple Explanation (English)**

React event handlers receive typed synthetic events. The correct types are generic over the element, e.g. \`React.ChangeEvent\<HTMLInputElement\>\` for an input's change, \`React.MouseEvent\<HTMLButtonElement\>\` for a button click, and \`React.FormEvent\<HTMLFormElement\>\` for form submit.

Typing events gives you safe access to \`event.target.value\`, \`event.preventDefault()\`, and element-specific properties. If you write the handler inline in JSX, TypeScript often infers the event type from the element, so explicit types are mainly needed for standalone handler functions.

**Hinglish Explanation**

React event handlers typed synthetic events receive karte hain. Sahi types element par generic hote hain, jaise input ke change ke liye \`React.ChangeEvent\<HTMLInputElement\>\`, button click ke liye \`React.MouseEvent\<HTMLButtonElement\>\`, aur form submit ke liye \`React.FormEvent\<HTMLFormElement\>\`.  
Events ko type karna \`event.target.value\`, \`event.preventDefault()\`, aur element-specific properties tak safe access deta hai. Agar aap handler ko JSX me inline likhte ho, to TypeScript aksar element se event type infer kar leta hai, isliye explicit types mainly standalone handler functions ke liye chahiye.

**Key Interview Points**

* Event types are generic over the element type.

* Input change: \`React.ChangeEvent\<HTMLInputElement\>\`.

* Button click: \`React.MouseEvent\<HTMLButtonElement\>\`.

* Form submit: \`React.FormEvent\<HTMLFormElement\>\`.

* Inline JSX handlers usually infer the event type automatically.

**Real-World Example**

A controlled input's \`onChange={(e) \=\> setValue(e.target.value)}\` is type-safe because \`e\` is \`ChangeEvent\<HTMLInputElement\>\`, so \`e.target.value\` is known to be a string.

**Code — Full & Runnable**

// React usage (in a .tsx file):  
//  
//   function handleChange(e: React.ChangeEvent\<HTMLInputElement\>) {  
//     setValue(e.target.value);  
//   }  
//   \<input onChange={handleChange} /\>  
//  
// Runnable stand-in: a minimal change-event shape \+ a typed handler.  
   
export interface ChangeEvent\<T extends { value: string }\> {  
  target: T;  
}  
   
export function handleChange(  
  e: ChangeEvent\<{ value: string }\>,  
  setValue: (v: string) \=\> void  
): void {  
  setValue(e.target.value); // safely typed as string  
}

**Test / Demo & Expected Output**

// test.ts — run: npx tsx test.ts  
import { handleChange } from "./solution";  
   
let value \= "";  
handleChange({ target: { value: "hello" } }, (v) \=\> { value \= v; });  
console.log(value); // hello  
   
console.assert(value \=== "hello", "typed event handler read target.value");  
console.log("typing-events assertions passed.");  
   
/\* EXPECTED OUTPUT:  
hello  
typing-events assertions passed.  
\*/

**Common Follow-up Questions**

**Q: What type is a React input change event?**

**A:** \`React.ChangeEvent\<HTMLInputElement\>\`, which makes \`event.target.value\` correctly typed as a string and gives access to input-specific properties.

**Q: Do you always need to annotate event types?**

**A:** No — for handlers written inline in JSX, TypeScript usually infers the event type from the element. Explicit annotations are mainly needed for standalone handler functions.

## **74\. Typing API Responses**

**Simple Explanation (English)**

Since \`fetch\`/JSON return \`any\`/\`unknown\`, you should type API responses explicitly so the rest of the app works with known shapes. A common pattern is a generic wrapper type and a typed fetch helper that returns \`Promise\<T\>\` for a specific response type.

For untrusted data, validate at the boundary (with a type guard or a schema library like Zod) so the typed result actually matches reality. Typing responses gives end-to-end safety from the network call to the UI, catching shape mismatches at compile time.

**Hinglish Explanation**

Kyunki \`fetch\`/JSON \`any\`/\`unknown\` return karte hain, aapko API responses explicitly type karne chahiye taaki baaki app known shapes ke saath kaam kare. Common pattern ek generic wrapper type aur ek typed fetch helper hai jo specific response type ke liye \`Promise\<T\>\` return kare.  
Untrusted data ke liye, boundary par validate karo (type guard ya Zod jaisi schema library se) taaki typed result actually reality se match kare. Responses type karna network call se UI tak end-to-end safety deta hai, shape mismatches compile time par pakad kar.

**Key Interview Points**

* Type responses explicitly — fetch/JSON return any/unknown.

* Use a generic helper returning \`Promise\<T\>\` for the expected shape.

* Validate untrusted data at the boundary (type guard or Zod).

* Gives end-to-end type safety from network to UI.

* Define response interfaces close to where data is consumed.

**Real-World Example**

A typed \`getJSON\<User\[\]\>("/api/users")\` returns \`Promise\<User\[\]\>\`, so the component mapping over the result has fully-typed users — and a schema check at the boundary guards against malformed payloads.

**Code — Full & Runnable**

// React/fetch usage:  
//  
//   async function getJSON\<T\>(url: string): Promise\<T\> {  
//     const res \= await fetch(url);  
//     if (\!res.ok) throw new Error("HTTP " \+ res.status);  
//     return res.json() as Promise\<T\>;  
//   }  
//   const users \= await getJSON\<User\[\]\>("/api/users");  
//  
// Runnable stand-in: a typed parser over a mocked response.  
   
export interface User { id: number; name: string; }  
   
export function parseUsers(json: string): User\[\] {  
  const data \= JSON.parse(json) as unknown;  
  if (\!Array.isArray(data)) throw new Error("expected array");  
  return data as User\[\];  
}

**Test / Demo & Expected Output**

// test.ts — run: npx tsx test.ts  
import { parseUsers } from "./solution";  
   
const users \= parseUsers('\[{"id":1,"name":"Asha"},{"id":2,"name":"Ravi"}\]');  
console.log(users.map((u) \=\> u.name)); // \['Asha','Ravi'\]  
   
console.assert(users.length \=== 2 && users\[0\].name \=== "Asha", "typed API response parsed");  
let threw \= false; try { parseUsers('{"not":"array"}'); } catch { threw \= true; }  
console.assert(threw, "boundary validation rejects bad shape");  
console.log("typing-api-responses assertions passed.");  
   
/\* EXPECTED OUTPUT:  
\[ 'Asha', 'Ravi' \]  
typing-api-responses assertions passed.  
\*/

**Common Follow-up Questions**

**Q: Why type API responses explicitly?**

**A:** Because \`fetch\`/\`JSON.parse\` produce \`any\`/\`unknown\`. Declaring the expected shape (e.g. via a generic \`getJSON\<T\>\`) gives the rest of the app type-safe access instead of untyped data.

**Q: How do you ensure the typed response matches reality?**

**A:** Validate at the boundary with a type guard or a runtime schema validator (like Zod). Static types alone don't check actual data; validation confirms the payload before you trust the type.

## **75\. Typing Redux Toolkit**

**Simple Explanation (English)**

Redux Toolkit (RTK) is designed for TypeScript: \`createSlice\` infers action types from your reducers, and you derive \`RootState\`/\`AppDispatch\` from the store. Action creators are fully typed, and \`PayloadAction\<T\>\` types a reducer's action payload.

Best practices: type the slice's initial state, use \`PayloadAction\<T\>\` in reducers, and export typed hooks (\`useAppDispatch\`, \`useAppSelector\`) derived from the store types. This gives end-to-end type safety across state, actions, and selectors.

**Hinglish Explanation**

Redux Toolkit (RTK) TypeScript ke liye banaya gaya hai: \`createSlice\` aapke reducers se action types infer karta hai, aur aap store se \`RootState\`/\`AppDispatch\` derive karte ho. Action creators fully typed hote hain, aur \`PayloadAction\<T\>\` ek reducer ke action payload ko type karta hai.  
Best practices: slice ki initial state type karo, reducers me \`PayloadAction\<T\>\` use karo, aur store types se derive typed hooks (\`useAppDispatch\`, \`useAppSelector\`) export karo. Isse state, actions, aur selectors me end-to-end type safety milti hai.

**Key Interview Points**

* \`createSlice\` infers action types from reducers.

* \`PayloadAction\<T\>\` types a reducer's action payload.

* Derive \`RootState\` and \`AppDispatch\` from the store.

* Export typed \`useAppSelector\`/\`useAppDispatch\` hooks.

* Gives end-to-end typing across state, actions, selectors.

**Real-World Example**

A counter slice typed with \`PayloadAction\<number\>\` for \`incrementBy\` ensures dispatching \`incrementBy("x")\` is a compile error, and \`useAppSelector(s \=\> s.counter.value)\` is correctly typed as a number.

**Code — Full & Runnable**

// Redux Toolkit usage:  
//  
//   const slice \= createSlice({  
//     name: "counter",  
//     initialState: { value: 0 } as { value: number },  
//     reducers: {  
//       increment: (s) \=\> { s.value++; },  
//       incrementBy: (s, action: PayloadAction\<number\>) \=\> { s.value \+= action.payload; },  
//     },  
//   });  
//   type RootState \= ReturnType\<typeof store.getState\>;  
//  
// Runnable stand-in: a typed reducer mirroring the same logic.  
   
interface CounterState { value: number; }  
type CounterAction \=  
  | { type: "increment" }  
  | { type: "incrementBy"; payload: number };  
   
export function counterReducer(state: CounterState, action: CounterAction): CounterState {  
  switch (action.type) {  
    case "increment": return { value: state.value \+ 1 };  
    case "incrementBy": return { value: state.value \+ action.payload };  
  }  
}

**Test / Demo & Expected Output**

// test.ts — run: npx tsx test.ts  
import { counterReducer } from "./solution";  
   
let state \= { value: 0 };  
state \= counterReducer(state, { type: "increment" });  
state \= counterReducer(state, { type: "incrementBy", payload: 5 });  
console.log(state.value); // 6  
   
console.assert(state.value \=== 6, "typed reducer with payload action");  
console.log("typing-redux-toolkit assertions passed.");  
   
/\* EXPECTED OUTPUT:  
6  
typing-redux-toolkit assertions passed.  
\*/

**Common Follow-up Questions**

**Q: What does \`PayloadAction\<T\>\` do?**

**A:** It types a Redux Toolkit reducer's action so \`action.payload\` is \`T\`. This makes dispatching and handling the action fully type-safe.

**Q: How do you get the store's state/dispatch types?**

**A:** Derive them: \`type RootState \= ReturnType\<typeof store.getState\>\` and \`type AppDispatch \= typeof store.dispatch\`, then build typed \`useAppSelector\`/\`useAppDispatch\` hooks from them.

## **76\. Typing React Query**

**Simple Explanation (English)**

React Query (TanStack Query) is generic, so \`useQuery\` is parameterized by the data and error types. With a well-typed fetcher, the data type is usually inferred: \`useQuery({ queryKey, queryFn })\` infers \`data\` from \`queryFn\`'s return type.

Typing the query function (e.g. \`(): Promise\<User\[\]\>\`) flows the type through to \`data\`, which is \`User\[\] | undefined\` until the query resolves. Mutations are typed similarly via \`useMutation\`. The key idea is to type the async functions, and the hooks infer the rest.

**Hinglish Explanation**

React Query (TanStack Query) generic hai, isliye \`useQuery\` data aur error types se parameterized hota hai. Achhe se typed fetcher ke saath, data type aam taur par infer ho jaata hai: \`useQuery({ queryKey, queryFn })\` \`queryFn\` ke return type se \`data\` infer karta hai.  
Query function ko type karna (jaise \`(): Promise\<User\[\]\>\`) type ko \`data\` tak flow karta hai, jo query resolve hone tak \`User\[\] | undefined\` hota hai. Mutations \`useMutation\` se similarly type hote hain. Key idea: async functions ko type karo, hooks baaki infer kar lenge.

**Key Interview Points**

* \`useQuery\` infers \`data\` from the typed \`queryFn\`'s return.

* \`data\` is \`T | undefined\` until the query succeeds.

* Type the async functions; the hooks infer the rest.

* \`useMutation\` types variables and result similarly.

* Errors can be typed via the hook's generics.

**Real-World Example**

Typing \`queryFn: (): Promise\<User\[\]\>\` makes \`const { data } \= useQuery(...)\` give \`data: User\[\] | undefined\`, so the component must handle the loading/undefined state before mapping users.

**Code — Full & Runnable**

// React Query usage:  
//  
//   const { data, isLoading } \= useQuery({  
//     queryKey: \["users"\],  
//     queryFn: (): Promise\<User\[\]\> \=\> getJSON("/api/users"),  
//   });  
//   // data: User\[\] | undefined  
//  
// Runnable stand-in: a typed query result \+ a runner mirroring the inference.  
   
export interface User { id: number; name: string; }  
   
export interface QueryResult\<T\> {  
  data: T | undefined;  
  isLoading: boolean;  
  error: Error | null;  
}  
   
export async function runQuery\<T\>(queryFn: () \=\> Promise\<T\>): Promise\<QueryResult\<T\>\> {  
  try {  
    const data \= await queryFn();  
    return { data, isLoading: false, error: null };  
  } catch (e) {  
    return { data: undefined, isLoading: false, error: e as Error };  
  }  
}

**Test / Demo & Expected Output**

// test.ts — run: npx tsx test.ts  
import { runQuery, User } from "./solution";  
   
(async () \=\> {  
  const result \= await runQuery\<User\[\]\>(async () \=\> \[{ id: 1, name: "Asha" }\]);  
  console.log(result.data?.map((u) \=\> u.name)); // \['Asha'\]  
  console.log(result.isLoading, result.error);  // false null  
   
  console.assert(result.data?.\[0\].name \=== "Asha", "typed query data inferred");  
  console.assert(result.isLoading \=== false && result.error \=== null, "success state");  
  console.log("typing-react-query assertions passed.");  
})();  
   
/\* EXPECTED OUTPUT:  
\[ 'Asha' \]  
false null  
typing-react-query assertions passed.  
\*/

**Common Follow-up Questions**

**Q: How does useQuery know the type of \`data\`?**

**A:** It infers it from the \`queryFn\`'s return type. If \`queryFn\` returns \`Promise\<User\[\]\>\`, then \`data\` is typed \`User\[\] | undefined\` (undefined until the query resolves).

**Q: Why is \`data\` possibly undefined?**

**A:** Because the query may not have resolved yet (loading/error states). You must handle the \`undefined\` case before using the data, which the type enforces.

## **77\. Reusable Typed Components**

**Simple Explanation (English)**

Reusable components often need to be generic so they work with any data type while staying type-safe. A generic component takes a type parameter (e.g. the item type of a list) and threads it through its props — like a \`List\<T\>\` whose \`renderItem\` receives a correctly-typed \`T\`.

Combine generics with well-typed props, sensible defaults, and \`children\` typing to build a flexible, type-safe component library. The payoff is components that adapt to any data while giving consumers full autocomplete and compile-time checks.

**Hinglish Explanation**

Reusable components ko aksar generic hona padta hai taaki woh kisi bhi data type ke saath kaam karein jabki type-safe rahein. Ek generic component ek type parameter leta hai (jaise list ka item type) aur use apne props me thread karta hai — jaise ek \`List\<T\>\` jiska \`renderItem\` ek correctly-typed \`T\` receive kare.  
Generics ko well-typed props, sensible defaults, aur \`children\` typing ke saath mila kar ek flexible, type-safe component library banao. Faayda: aise components jo kisi bhi data par adapt karein jabki consumers ko full autocomplete aur compile-time checks dein.

**Key Interview Points**

* Make components generic to work with any item/data type.

* Thread the type parameter through props (e.g. \`renderItem: (item: T) \=\> ...\`).

* Consumers get correctly-typed callbacks and props.

* Combine with default props and \`children\` typing.

* Enables a flexible, type-safe component library.

**Real-World Example**

A generic \`\<List items={users} renderItem={u \=\> u.name} /\>\` works for any array — users, orders, products — and the \`renderItem\` callback always receives the correct element type, with full autocomplete.

**Code — Full & Runnable**

// React usage (generic component in a .tsx file):  
//  
//   interface ListProps\<T\> {  
//     items: T\[\];  
//     renderItem: (item: T, index: number) \=\> React.ReactNode;  
//   }  
//   function List\<T\>({ items, renderItem }: ListProps\<T\>) {  
//     return \<ul\>{items.map((it, i) \=\> \<li key={i}\>{renderItem(it, i)}\</li\>)}\</ul\>;  
//   }  
//  
// Runnable stand-in: the same generic logic returning strings instead of JSX.  
   
export interface ListProps\<T\> {  
  items: T\[\];  
  renderItem: (item: T, index: number) \=\> string;  
}  
   
export function renderList\<T\>({ items, renderItem }: ListProps\<T\>): string\[\] {  
  return items.map((item, i) \=\> renderItem(item, i));  
}

**Test / Demo & Expected Output**

// test.ts — run: npx tsx test.ts  
import { renderList } from "./solution";  
   
const users \= \[{ name: "Asha" }, { name: "Ravi" }\];  
console.log(renderList({ items: users, renderItem: (u) \=\> u.name })); // \['Asha','Ravi'\]  
console.log(renderList({ items: \[1, 2, 3\], renderItem: (n, i) \=\> i \+ ":" \+ n })); // \['0:1','1:2','2:3'\]  
   
console.assert(JSON.stringify(renderList({ items: users, renderItem: (u) \=\> u.name })) \=== '\["Asha","Ravi"\]', "generic component over objects");  
console.assert(JSON.stringify(renderList({ items: \[1, 2\], renderItem: (n) \=\> String(n \* 10\) })) \=== '\["10","20"\]', "generic component over numbers");  
console.log("reusable-typed-components assertions passed.");  
   
/\* EXPECTED OUTPUT:  
\[ 'Asha', 'Ravi' \]  
\[ '0:1', '1:2', '2:3' \]  
reusable-typed-components assertions passed.  
\*/

**Common Follow-up Questions**

**Q: Why make a component generic?**

**A:** So one reusable component works with any data type while staying type-safe — the type parameter flows into props/callbacks (like \`renderItem: (item: T) \=\> ...\`), giving consumers correctly-typed access.

**Q: How do consumers benefit from a generic component?**

**A:** They get full autocomplete and compile-time checks for the specific data they pass — e.g. \`renderItem\` receives the exact element type of the \`items\` array they provided.