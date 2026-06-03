**TypeScript**

Interview Preparation — Study Guide

Phase 1B  •  Topics 26–50

*Each topic includes: plain-English \+ Hinglish explanation, key interview points,*

*a real-world example, complete runnable code, tests with expected output, and follow-up Q\&A.*

Run any code sample with:  npx tsx filename.ts  
**Contents**

# **Phase 1B — TypeScript Detailed (Topics 26–50)**

This batch covers intermediate TypeScript — function overloading and callback typing, array/object/tuple/Record types, enums and const enums, classes (abstract, access modifiers, readonly), decorators, generics (functions, interfaces, constraints, defaults), and the core utility types (Partial, Required, Pick, Omit, Record, Exclude). Every sample is written in TypeScript and verified to both run and type-check under strict mode.

## **26\. Function Overloading**

**Simple Explanation (English)**

Function overloading lets one function have multiple type signatures so it can be called in different ways with accurate types for each. You write several overload SIGNATURES (no body) followed by ONE implementation signature (with the body) that must be compatible with all of them.

Callers see only the overload signatures, so TypeScript picks the matching one and infers the right return type. The implementation signature is internal and usually broader (often using unions). It's useful when a function's return type depends on its argument types.

**Hinglish Explanation**

Function overloading ek function ko multiple type signatures dene deta hai taaki use alag-alag tarah se call kiya ja sake har ek ke accurate types ke saath. Aap kai overload SIGNATURES (bina body) likhte ho phir EK implementation signature (body ke saath) jo un sabse compatible ho.  
Callers ko sirf overload signatures dikhte hain, isliye TypeScript matching wala chunta hai aur sahi return type infer karta hai. Implementation signature internal aur aam taur par broader hota hai (aksar unions use karke). Ye tab useful hai jab function ka return type uske argument types par depend kare.

**Key Interview Points**

* Multiple overload signatures \+ one compatible implementation signature.

* Callers only see the overloads; the implementation is hidden.

* TypeScript selects the matching overload and infers its return type.

* Implementation signature is usually broader (unions/any-ish).

* Use when the return type depends on argument types.

**Real-World Example**

A \`parse\` helper that returns a \`Date\` when given a string and a \`number\[\]\` when given a CSV-like input — overloads let each call site get the precise return type instead of a vague union.

**Code — Full & Runnable**

// solution.ts — overload signatures \+ one implementation.  
   
export function makeArray(value: string): string\[\];  
export function makeArray(value: number): number\[\];  
export function makeArray(value: string | number): string\[\] | number\[\] {  
  // implementation handles all overloads  
  return \[value\] as string\[\] | number\[\];  
}  
   
export function len(value: string): number;  
export function len(value: unknown\[\]): number;  
export function len(value: string | unknown\[\]): number {  
  return value.length;  
}

**Test / Demo & Expected Output**

// test.ts — run: npx tsx test.ts  
import { makeArray, len } from "./solution";  
   
console.log(makeArray("x"));   // \['x'\] (typed as string\[\])  
console.log(makeArray(5));     // \[5\]  (typed as number\[\])  
console.log(len("hello"));     // 5  
console.log(len(\[1, 2, 3\]));   // 3  
   
console.assert(JSON.stringify(makeArray("x")) \=== '\["x"\]', "string overload");  
console.assert(JSON.stringify(makeArray(5)) \=== "\[5\]", "number overload");  
console.assert(len("hello") \=== 5, "string length overload");  
console.assert(len(\[1, 2, 3\]) \=== 3, "array length overload");  
console.log("function-overloading assertions passed.");  
   
/\* EXPECTED OUTPUT:  
\[ 'x' \]  
\[ 5 \]  
5  
3  
function-overloading assertions passed.  
\*/

**Common Follow-up Questions**

**Q: How many implementation signatures can an overloaded function have?**

**A:** Exactly one. You write multiple overload signatures (no body) and a single implementation signature with the body that must be compatible with all overloads. The implementation signature isn't visible to callers.

**Q: When is overloading preferable to a union return type?**

**A:** When the return type depends on which argument type was passed, so each call site gets a precise type instead of a broad union it would have to narrow afterward.

## **27\. Callback Typing**

**Simple Explanation (English)**

Typing callbacks means giving a precise function type to a parameter that is itself a function. This makes higher-order functions safe: the compiler checks that the callback you pass has the right parameters and return type, and it infers parameter types for inline arrow functions.

A callback type is written like any function type — \`(item: T, index: number) \=\> boolean\`. Generic callbacks (e.g. for a generic \`map\`) let the parameter and return types flow through, giving fully type-safe utilities.

**Hinglish Explanation**

Callbacks ko type karne ka matlab ek aise parameter ko precise function type dena jo khud ek function hai. Isse higher-order functions safe ho jaate hain: compiler check karta hai ki aapne jo callback pass kiya uske parameters aur return type sahi hain, aur inline arrow functions ke parameter types infer karta hai.  
Callback type kisi bhi function type ki tarah likha jaata hai — \`(item: T, index: number) \=\> boolean\`. Generic callbacks (jaise generic \`map\` ke liye) parameter aur return types ko flow karne dete hain, jisse fully type-safe utilities milti hain.

**Key Interview Points**

* A callback parameter gets a function type: \`(args) \=\> ReturnType\`.

* The compiler validates the callback's signature at the call site.

* Inline arrow callbacks get their parameter types inferred.

* Generic callbacks let types flow through HOFs.

* Prevents passing a callback with the wrong shape.

**Real-World Example**

Typing a custom \`eachUser(users, callback)\` so \`callback\` is \`(user: User, index: number) \=\> void\` means the editor autocompletes \`user.name\` inside the callback and rejects a callback expecting the wrong argument type.

**Code — Full & Runnable**

// solution.ts — typed callbacks, including a generic one.  
   
export function filterNumbers(  
  nums: number\[\],  
  predicate: (n: number, index: number) \=\> boolean  
): number\[\] {  
  return nums.filter(predicate);  
}  
   
// Generic callback: types flow through  
export function mapItems\<T, U\>(items: T\[\], fn: (item: T) \=\> U): U\[\] {  
  return items.map(fn);  
}

**Test / Demo & Expected Output**

// test.ts — run: npx tsx test.ts  
import { filterNumbers, mapItems } from "./solution";  
   
console.log(filterNumbers(\[1, 2, 3, 4\], (n) \=\> n % 2 \=== 0)); // \[2,4\]  
console.log(mapItems(\["a", "bb"\], (s) \=\> s.length));          // \[1,2\]  
   
console.assert(JSON.stringify(filterNumbers(\[1,2,3,4\], (n) \=\> n \> 2)) \=== "\[3,4\]", "typed predicate");  
console.assert(JSON.stringify(mapItems(\["a","bb"\], (s) \=\> s.length)) \=== "\[1,2\]", "generic callback");  
console.log("callback-typing assertions passed.");  
   
/\* EXPECTED OUTPUT:  
\[ 2, 4 \]  
\[ 1, 2 \]  
callback-typing assertions passed.  
\*/

**Common Follow-up Questions**

**Q: How do you type a callback parameter?**

**A:** Give it a function type, e.g. \`predicate: (n: number, i: number) \=\> boolean\`. The compiler then validates any callback passed and infers types for inline arrows.

**Q: Why use generics for callbacks?**

**A:** So the input and output types flow through the higher-order function, keeping it fully type-safe and reusable across element types (like a generic \`map\<T, U\>\`).

## **28\. Array Typing**

**Simple Explanation (English)**

Arrays are typed either as \`Type\[\]\` (e.g. \`number\[\]\`) or equivalently \`Array\<Type\>\`. This constrains every element to that type, so pushing a wrong type is a compile error. Multidimensional arrays use repeated brackets (\`number\[\]\[\]\`).

For arrays whose elements shouldn't change, use \`readonly Type\[\]\` or \`ReadonlyArray\<Type\>\`. Arrays of unions (\`(string | number)\[\]\`) hold mixed-but-restricted values. TypeScript infers array element types from literals, so explicit annotations are often optional.

**Hinglish Explanation**

Arrays ya to \`Type\[\]\` (jaise \`number\[\]\`) ya equivalently \`Array\<Type\>\` se type hote hain. Ye har element ko us type tak seemit karta hai, isliye galat type push karna compile error hai. Multidimensional arrays repeated brackets use karte hain (\`number\[\]\[\]\`).  
Jin arrays ke elements change nahi hone chahiye unke liye \`readonly Type\[\]\` ya \`ReadonlyArray\<Type\>\` use karo. Unions ke arrays (\`(string | number)\[\]\`) mixed-par-restricted values rakhte hain. TypeScript literals se array element types infer kar leta hai, isliye explicit annotations aksar optional hain.

**Key Interview Points**

* Two equivalent forms: \`T\[\]\` and \`Array\<T\>\`.

* Elements are constrained to T (wrong types are errors).

* Multidimensional: \`T\[\]\[\]\`; union arrays: \`(A | B)\[\]\`.

* Immutable arrays: \`readonly T\[\]\` / \`ReadonlyArray\<T\>\`.

* Element types are usually inferred from literals.

**Real-World Example**

Typing API data as \`User\[\]\` ensures every map/filter over the list gets a fully-typed \`user\`, and prevents accidentally pushing a non-User object into the collection.

**Code — Full & Runnable**

// solution.ts — array typing variants.  
   
export function sum(nums: number\[\]): number {  
  return nums.reduce((a, b) \=\> a \+ b, 0);  
}  
   
export function flatten(matrix: number\[\]\[\]): number\[\] {  
  return matrix.reduce\<number\[\]\>((acc, row) \=\> acc.concat(row), \[\]);  
}  
   
export function firstString(values: (string | number)\[\]): string | undefined {  
  return values.find((v): v is string \=\> typeof v \=== "string");  
}

**Test / Demo & Expected Output**

// test.ts — run: npx tsx test.ts  
import { sum, flatten, firstString } from "./solution";  
   
console.log(sum(\[1, 2, 3\]));                 // 6  
console.log(flatten(\[\[1, 2\], \[3\], \[4, 5\]\])); // \[1,2,3,4,5\]  
console.log(firstString(\[1, "two", 3\]));     // two  
   
console.assert(sum(\[1, 2, 3\]) \=== 6, "number\[\] sum");  
console.assert(JSON.stringify(flatten(\[\[1,2\],\[3\]\])) \=== "\[1,2,3\]", "number\[\]\[\] flatten");  
console.assert(firstString(\[1, "two"\]) \=== "two", "union array find");  
console.log("array-typing assertions passed.");  
   
/\* EXPECTED OUTPUT:  
6  
\[ 1, 2, 3, 4, 5 \]  
two  
array-typing assertions passed.  
\*/

**Common Follow-up Questions**

**Q: What are the two ways to type an array?**

**A:** \`T\[\]\` (e.g. \`number\[\]\`) and \`Array\<T\>\` (e.g. \`Array\<number\>\`). They're equivalent; \`T\[\]\` is more common.

**Q: How do you make an array immutable in the type system?**

**A:** Use \`readonly T\[\]\` or \`ReadonlyArray\<T\>\`, which disallow mutating methods (push/splice) and element reassignment at compile time.

## **29\. Object Typing**

**Simple Explanation (English)**

You type an object by describing its properties and their types, either inline (\`{ name: string; age: number }\`), via a type alias, or via an interface. The compiler then checks that objects have the right properties with the right types.

TypeScript uses structural typing ('duck typing'): an object is compatible with a type if it has the required members, regardless of how it was declared. Object literals get extra-property checks (excess properties are flagged), which catches typos in keys.

**Hinglish Explanation**

Object ko aap uski properties aur unke types describe karke type karte ho, ya inline (\`{ name: string; age: number }\`), ya type alias se, ya interface se. Phir compiler check karta hai ki objects ke paas sahi properties sahi types ke saath hain.  
TypeScript structural typing ('duck typing') use karta hai: ek object kisi type se compatible hai agar uske paas required members hain, chahe woh kaise bhi declare hua ho. Object literals par extra-property checks lagte hain (excess properties flag hoti hain), jo keys me typos pakadta hai.

**Key Interview Points**

* Describe shape inline, via \`type\`, or via \`interface\`.

* Structural typing: compatibility is by shape, not by name.

* Object literals get excess-property checks (catches key typos).

* Properties can be optional (\`?\`) or \`readonly\`.

* Same shape from different declarations is interchangeable.

**Real-World Example**

A function \`(point: { x: number; y: number }) \=\> number\` accepts any object with x and y numbers — structural typing means you don't need a named class, just the right shape.

**Code — Full & Runnable**

// solution.ts — inline object typing \+ structural typing.  
   
export function distanceFromOrigin(point: { x: number; y: number }): number {  
  return Math.hypot(point.x, point.y);  
}  
   
type Config \= { host: string; port: number; secure?: boolean };  
   
export function url(config: Config): string {  
  const scheme \= config.secure ? "https" : "http";  
  return scheme \+ "://" \+ config.host \+ ":" \+ config.port;  
}

**Test / Demo & Expected Output**

// test.ts — run: npx tsx test.ts  
import { distanceFromOrigin, url } from "./solution";  
   
console.log(distanceFromOrigin({ x: 3, y: 4 })); // 5  
console.log(url({ host: "localhost", port: 8080 }));               // http://localhost:8080  
console.log(url({ host: "api.x.com", port: 443, secure: true }));  // https://api.x.com:443  
   
console.assert(distanceFromOrigin({ x: 3, y: 4 }) \=== 5, "inline object type");  
console.assert(url({ host: "localhost", port: 8080 }) \=== "http://localhost:8080", "config typing");  
console.assert(url({ host: "x", port: 1, secure: true }).startsWith("https"), "optional secure");  
console.log("object-typing assertions passed.");  
   
/\* EXPECTED OUTPUT:  
5  
http://localhost:8080  
https://api.x.com:443  
object-typing assertions passed.  
\*/

**Common Follow-up Questions**

**Q: What is structural typing?**

**A:** Type compatibility based on shape rather than name — an object is assignable to a type if it has the required members, regardless of how or where it was declared ('if it has the right shape, it fits').

**Q: What is an excess property check?**

**A:** When you pass an object literal directly, TypeScript flags properties not present in the target type, catching key typos. (Assigning via a variable can bypass this check.)

## **30\. Nested Object Typing**

**Simple Explanation (English)**

Nested object typing describes objects that contain other objects (or arrays of objects) to any depth. You nest type definitions accordingly, and it's good practice to extract inner shapes into their own named types/interfaces for readability and reuse.

TypeScript checks the entire nested shape, so accessing \`user.address.city\` is type-safe only if each level is correctly typed (and you handle optional/nullable levels). Breaking deep shapes into named pieces makes errors clearer and types maintainable.

**Hinglish Explanation**

Nested object typing un objects ko describe karta hai jo doosre objects (ya objects ke arrays) rakhte hain kisi bhi depth tak. Aap type definitions accordingly nest karte ho, aur achhi practice hai inner shapes ko apne named types/interfaces me nikaalna readability aur reuse ke liye.  
TypeScript poori nested shape check karta hai, isliye \`user.address.city\` access tabhi type-safe hai jab har level sahi type ho (aur aap optional/nullable levels handle karo). Deep shapes ko named pieces me todna errors clearer aur types maintainable banata hai.

**Key Interview Points**

* Nest type/interface definitions to any depth.

* Extract inner shapes into named types/interfaces for clarity and reuse.

* Deep access is type-safe only if every level is typed.

* Handle optional/nullable nested levels explicitly.

* Named sub-types make errors and maintenance easier.

**Real-World Example**

Modeling an API response like \`{ user: { profile: { name: string }; roles: string\[\] } }\` with named \`Profile\` and \`User\` interfaces gives type-safe deep access and lets you reuse \`Profile\` elsewhere.

**Code — Full & Runnable**

// solution.ts — nested shapes via named interfaces.  
   
interface Address { city: string; zip: string; }  
interface User {  
  name: string;  
  address: Address;  
  roles: string\[\];  
}  
   
export function locationLabel(user: User): string {  
  return user.name \+ " — " \+ user.address.city \+ " (" \+ user.address.zip \+ ")";  
}  
   
export function hasRole(user: User, role: string): boolean {  
  return user.roles.includes(role);  
}

**Test / Demo & Expected Output**

// test.ts — run: npx tsx test.ts  
import { locationLabel, hasRole } from "./solution";  
   
const user \= { name: "Asha", address: { city: "Pune", zip: "411001" }, roles: \["admin", "user"\] };  
console.log(locationLabel(user)); // Asha — Pune (411001)  
console.log(hasRole(user, "admin")); // true  
console.log(hasRole(user, "owner")); // false  
   
console.assert(locationLabel(user) \=== "Asha — Pune (411001)", "nested access");  
console.assert(hasRole(user, "admin") \=== true, "role present");  
console.assert(hasRole(user, "owner") \=== false, "role absent");  
console.log("nested-object-typing assertions passed.");  
   
/\* EXPECTED OUTPUT:  
Asha — Pune (411001)  
true  
false  
nested-object-typing assertions passed.  
\*/

**Common Follow-up Questions**

**Q: Why extract nested shapes into named types?**

**A:** Readability, reuse, and clearer error messages. A named \`Address\`/\`Profile\` can be referenced in multiple places and makes deep structures easier to maintain than large inline definitions.

**Q: How do you safely access a possibly-missing nested property?**

**A:** Type the intermediate levels as optional/nullable where appropriate and narrow before access — e.g. optional chaining \`user.address?.city\` and a \`??\` fallback.

## **31\. Tuple Types**

**Simple Explanation (English)**

A tuple is a fixed-length array where each position has a known, specific type — e.g. \`\[string, number\]\` is exactly a string followed by a number. Tuples give precise types to positional data, unlike a regular array where every element shares one type.

Tuples support optional elements (\`\[string, number?\]\`), rest elements (\`\[string, ...number\[\]\]\`), labels for readability (\`\[name: string, age: number\]\`), and \`readonly\`. They're famously used by React hooks like \`useState\`, which returns \`\[value, setter\]\`.

**Hinglish Explanation**

Tuple ek fixed-length array hai jisme har position ka ek known, specific type hota hai — jaise \`\[string, number\]\` bilkul ek string phir ek number. Tuples positional data ko precise types dete hain, regular array ke विपरीत jahan har element ek hi type share karta hai.  
Tuples optional elements (\`\[string, number?\]\`), rest elements (\`\[string, ...number\[\]\]\`), readability ke liye labels (\`\[name: string, age: number\]\`), aur \`readonly\` support karte hain. Ye React hooks jaise \`useState\` me famous hain, jo \`\[value, setter\]\` return karta hai.

**Key Interview Points**

* Fixed-length array with a specific type per position: \`\[string, number\]\`.

* Different from arrays (each slot can be a different type).

* Supports optional (\`?\`), rest (\`...T\[\]\`), labels, and \`readonly\`.

* Used by \`useState\` → \`\[value, setValue\]\`.

* Great for returning multiple typed values from a function.

**Real-World Example**

Returning a typed pair from a function (like \`\[error, result\]\` from an async helper, or \`\[value, setValue\]\` from a hook) so destructuring gives each element its exact type.

**Code — Full & Runnable**

// solution.ts — tuples for precise positional data.  
   
export function divmod(a: number, b: number): \[quotient: number, remainder: number\] {  
  return \[Math.floor(a / b), a % b\];  
}  
   
export function parseCoord(s: string): \[number, number\] {  
  const \[x, y\] \= s.split(",").map(Number);  
  return \[x, y\];  
}  
   
// rest element in a tuple  
export function describe(...args: \[string, ...number\[\]\]): string {  
  const \[label, ...nums\] \= args;  
  return label \+ ":" \+ nums.join(",");  
}

**Test / Demo & Expected Output**

// test.ts — run: npx tsx test.ts  
import { divmod, parseCoord, describe } from "./solution";  
   
console.log(divmod(17, 5));        // \[3, 2\]  
console.log(parseCoord("3,4"));    // \[3, 4\]  
console.log(describe("nums", 1, 2, 3)); // nums:1,2,3  
   
const \[q, r\] \= divmod(17, 5);  
console.assert(q \=== 3 && r \=== 2, "tuple destructured with correct types");  
console.assert(JSON.stringify(parseCoord("3,4")) \=== "\[3,4\]", "coord tuple");  
console.assert(describe("nums", 1, 2, 3\) \=== "nums:1,2,3", "tuple rest element");  
console.log("tuple-types assertions passed.");  
   
/\* EXPECTED OUTPUT:  
\[ 3, 2 \]  
\[ 3, 4 \]  
nums:1,2,3  
tuple-types assertions passed.  
\*/

**Common Follow-up Questions**

**Q: How does a tuple differ from a regular array?**

**A:** A tuple has a fixed length and a specific type per position (e.g. \`\[string, number\]\`), while a regular array has variable length with all elements sharing one element type.

**Q: Where do you commonly see tuples in real code?**

**A:** React's \`useState\` returns \`\[value, setValue\]\`, and 'errors-as-values' helpers return \`\[error, result\]\` — destructuring gives each position its precise type.

## **32\. Record Type**

**Simple Explanation (English)**

\`Record\<K, V\>\` is a built-in utility type that constructs an object type with keys of type \`K\` and values of type \`V\`. For example \`Record\<string, number\>\` is an object whose every key is a string mapping to a number.

It shines with a finite key set expressed as a literal union: \`Record\<"a" | "b", number\>\` requires exactly those keys. This is often clearer and safer than an index signature when the keys are known, and the compiler ensures all required keys are present.

**Hinglish Explanation**

\`Record\<K, V\>\` ek built-in utility type hai jo ek object type banata hai jiski keys \`K\` type ki aur values \`V\` type ki hoti hain. Jaise \`Record\<string, number\>\` ek aisa object hai jiski har key string ek number se map karti hai.  
Ye literal union se express kiye gaye finite key set ke saath chamakta hai: \`Record\<"a" | "b", number\>\` bilkul un keys ki maang karta hai. Jab keys known hon to ye index signature se aksar clearer aur safe hai, aur compiler ensure karta hai ki saari required keys present hain.

**Key Interview Points**

* \`Record\<K, V\>\` builds an object type with keys K and values V.

* Use a literal union for K to require an exact set of keys.

* Clearer/safer than an index signature when keys are known.

* Compiler enforces presence of all required keys.

* Great for lookup maps, enums-to-value maps, config dictionaries.

**Real-World Example**

Mapping each app theme to its color: \`Record\<"light" | "dark", string\>\` guarantees you provide a value for every theme, so adding a new theme to the union forces you to fill in its color.

**Code — Full & Runnable**

// solution.ts — Record with a literal-union key set.  
   
type Theme \= "light" | "dark";  
const colors: Record\<Theme, string\> \= { light: "\#fff", dark: "\#000" };  
   
export function colorFor(theme: Theme): string {  
  return colors\[theme\];  
}  
   
// Open-ended Record (any string key \-\> number)  
export function tally(items: string\[\]): Record\<string, number\> {  
  const out: Record\<string, number\> \= {};  
  for (const i of items) out\[i\] \= (out\[i\] ?? 0\) \+ 1;  
  return out;  
}

**Test / Demo & Expected Output**

// test.ts — run: npx tsx test.ts  
import { colorFor, tally } from "./solution";  
   
console.log(colorFor("dark"));  // \#000  
console.log(colorFor("light")); // \#fff  
console.log(tally(\["a", "b", "a"\])); // { a: 2, b: 1 }  
   
console.assert(colorFor("dark") \=== "\#000", "record literal-key lookup");  
console.assert(tally(\["a", "b", "a"\]).a \=== 2, "open record tally");  
console.log("record-type assertions passed.");  
   
/\* EXPECTED OUTPUT:  
\#000  
\#fff  
{ a: 2, b: 1 }  
record-type assertions passed.  
\*/

**Common Follow-up Questions**

**Q: What does \`Record\<K, V\>\` produce?**

**A:** An object type whose keys are of type K and whose values are of type V — e.g. \`Record\<'a'|'b', number\>\` requires keys \`a\` and \`b\`, each mapping to a number.

**Q: Record vs index signature?**

**A:** Use \`Record\` with a literal-union key when the key set is known (it enforces all keys exist). Use an index signature for open-ended/dynamic keys where any string/number key is allowed.

## **33\. Enums**

**Simple Explanation (English)**

An enum defines a set of named constants. Numeric enums auto-assign incrementing numbers starting at 0 (or from a value you set); string enums assign explicit string values. Enums give meaningful names to a fixed set of related values.

Unlike most type features, a regular enum produces real JavaScript code at runtime (an object), so it exists when the program runs. Many teams now prefer string literal unions or \`as const\` objects for lighter output, but enums remain common and are worth knowing.

**Hinglish Explanation**

Enum named constants ka ek set define karta hai. Numeric enums 0 se (ya aapke set kiye value se) incrementing numbers auto-assign karte hain; string enums explicit string values assign karte hain. Enums related values ke fixed set ko meaningful naam dete hain.  
Zyadatar type features ke विपरीत, regular enum runtime par real JavaScript code (ek object) banata hai, isliye program chalne par ye exist karta hai. Aaj kai teams lighter output ke liye string literal unions ya \`as const\` objects prefer karti hain, par enums abhi bhi common hain aur jaanne layak.

**Key Interview Points**

* Defines named constants; numeric (auto-increment) or string enums.

* Numeric enums start at 0 by default; you can set start values.

* Regular enums emit a real runtime object (unlike type-only features).

* Reverse mapping exists for numeric enums (value → name).

* Alternatives: string literal unions or \`as const\` objects.

**Real-World Example**

Representing order states with \`enum Status { Pending, Shipped, Delivered }\` gives readable names instead of magic numbers, and the compiler restricts a status field to those values.

**Code — Full & Runnable**

// solution.ts — numeric and string enums.  
   
export enum Direction { Up, Down, Left, Right } // 0,1,2,3  
   
export enum Status {  
  Pending \= "PENDING",  
  Shipped \= "SHIPPED",  
  Delivered \= "DELIVERED",  
}  
   
export function move(d: Direction): string {  
  return "moving " \+ Direction\[d\]; // reverse mapping (numeric enum)  
}  
   
export function isFinal(s: Status): boolean {  
  return s \=== Status.Delivered;  
}

**Test / Demo & Expected Output**

// test.ts — run: npx tsx test.ts  
import { Direction, Status, move, isFinal } from "./solution";  
   
console.log(Direction.Up, Direction.Right); // 0 3  
console.log(move(Direction.Left));          // moving Left  
console.log(Status.Shipped);                // SHIPPED  
console.log(isFinal(Status.Delivered));     // true  
console.log(isFinal(Status.Pending));       // false  
   
console.assert(Direction.Up \=== 0 && Direction.Right \=== 3, "numeric enum values");  
console.assert(move(Direction.Left) \=== "moving Left", "reverse mapping");  
console.assert(Status.Shipped \=== "SHIPPED", "string enum value");  
console.assert(isFinal(Status.Delivered) \=== true, "final status check");  
console.log("enums assertions passed.");  
   
/\* EXPECTED OUTPUT:  
0 3  
moving Left  
SHIPPED  
true  
false  
enums assertions passed.  
\*/

**Common Follow-up Questions**

**Q: Difference between numeric and string enums?**

**A:** Numeric enums auto-assign incrementing numbers (and support reverse mapping value→name); string enums require explicit string values and have no reverse mapping but are more readable in output/logs.

**Q: Do enums exist at runtime?**

**A:** Regular enums do — they compile to a real JavaScript object. This differs from most type features, which are erased. (const enums are an exception — they're inlined.)

## **34\. const enums**

**Simple Explanation (English)**

A \`const enum\` is an enum that the compiler INLINES at every usage site instead of emitting a runtime object. So \`const enum Color { Red }\` produces no enum object in the output — \`Color.Red\` is replaced directly with its value, giving smaller, faster output.

The trade-off: because nothing exists at runtime, you lose reverse mapping and dynamic access, and const enums interact poorly with isolated-module build tools (like Babel/esbuild/ts-node with \`isolatedModules\`), which often can't inline them. For library code or those toolchains, prefer regular enums or \`as const\` objects.

**Hinglish Explanation**

\`const enum\` woh enum hai jise compiler har usage site par INLINE kar deta hai bajaye runtime object emit karne ke. To \`const enum Color { Red }\` output me koi enum object nahi banata — \`Color.Red\` seedhe apni value se replace ho jaata hai, jisse chhota, fast output milta hai.  
Trade-off: kyunki runtime par kuch exist nahi karta, aap reverse mapping aur dynamic access kho dete ho, aur const enums isolated-module build tools (jaise Babel/esbuild/ts-node with \`isolatedModules\`) ke saath theek se kaam nahi karte, jo aksar inhe inline nahi kar paate. Library code ya un toolchains ke liye regular enums ya \`as const\` objects prefer karo.

**Key Interview Points**

* \`const enum\` is inlined at each use — no runtime enum object emitted.

* Smaller/faster output than a regular enum.

* No reverse mapping and no dynamic/runtime access.

* Problematic with isolatedModules (Babel/esbuild/ts-node).

* For libraries or those toolchains, prefer regular enums or \`as const\`.

**Real-World Example**

A performance-sensitive internal module compiled only by \`tsc\` uses const enums so the constants vanish into inlined values, but a library shipped to many consumers avoids them to stay compatible with every build tool.

**Code — Full & Runnable**

// const enum (inlined by tsc). NOTE: isolatedModules tools (esbuild/tsx)  
// can't inline const enums, so for a runnable demo we use the recommended  
// modern alternative: an 'as const' object that yields a literal union.  
   
export const Color \= { Red: "RED", Green: "GREEN", Blue: "BLUE" } as const;  
export type Color \= typeof Color\[keyof typeof Color\]; // "RED" | "GREEN" | "BLUE"  
   
export function hex(color: Color): string {  
  const map: Record\<Color, string\> \= { RED: "\#f00", GREEN: "\#0f0", BLUE: "\#00f" };  
  return map\[color\];  
}  
   
// Equivalent const enum (compiled by tsc only):  
//   const enum ColorEnum { Red, Green, Blue }  
//   const c \= ColorEnum.Red;   // inlined to: const c \= 0;

**Test / Demo & Expected Output**

// test.ts — run: npx tsx test.ts  
import { Color, hex } from "./solution";  
   
console.log(Color.Red);          // RED  
console.log(hex(Color.Green));   // \#0f0  
console.log(hex("BLUE"));        // \#00f  
   
console.assert(Color.Red \=== "RED", "as-const literal value");  
console.assert(hex(Color.Green) \=== "\#0f0", "lookup via Record");  
console.log("const-enum assertions passed.");  
console.log("Note: a true 'const enum' is inlined by tsc and emits no runtime object.");  
   
/\* EXPECTED OUTPUT:  
RED  
\#0f0  
\#00f  
const-enum assertions passed.  
Note: a true 'const enum' is inlined by tsc and emits no runtime object.  
\*/

**Common Follow-up Questions**

**Q: What's the benefit of a const enum?**

**A:** It's inlined at each usage, so no enum object is emitted — producing smaller and slightly faster output than a regular enum.

**Q: Why can const enums be problematic?**

**A:** They have no runtime representation (no reverse mapping, no dynamic access) and many isolated-module build tools (Babel, esbuild, ts-node) can't inline them, breaking the build — so libraries usually avoid them.

## **35\. Abstract Classes**

**Simple Explanation (English)**

An abstract class is a base class that cannot be instantiated directly — it's meant to be extended. It can define implemented methods (shared behaviour) AND abstract methods, which have no body and must be implemented by every concrete subclass.

Abstract classes model a common template with mandatory hooks: the base provides shared logic and declares the pieces subclasses must fill in. This is the OOP 'template method' pattern, giving you partial implementation plus enforced contracts.

**Hinglish Explanation**

Abstract class ek base class hai jise directly instantiate nahi kar sakte — ye extend karne ke liye hai. Ye implemented methods (shared behaviour) AUR abstract methods, jinki koi body nahi hoti aur jo har concrete subclass me implement karne padte hain, dono define kar sakti hai.  
Abstract classes ek common template model karti hain mandatory hooks ke saath: base shared logic deta hai aur woh pieces declare karta hai jo subclasses ko bharne hain. Ye OOP ka 'template method' pattern hai, jo partial implementation plus enforced contracts deta hai.

**Key Interview Points**

* Cannot be instantiated directly — only extended.

* Can mix implemented methods with \`abstract\` (body-less) methods.

* Subclasses MUST implement all abstract members.

* Models a shared template with mandatory hooks (template method pattern).

* Abstract methods/properties can't be \`private\`.

**Real-World Example**

A \`Shape\` abstract class implements a shared \`describe()\` but declares \`abstract area()\`, forcing \`Circle\` and \`Square\` subclasses to provide their own area while reusing the common description logic.

**Code — Full & Runnable**

// solution.ts — abstract base with an abstract method.  
   
export abstract class Shape {  
  abstract area(): number;          // must be implemented by subclasses  
  describe(): string {              // shared, implemented method  
    return "Area is " \+ this.area().toFixed(2);  
  }  
}  
   
export class Circle extends Shape {  
  constructor(private r: number) { super(); }  
  area(): number { return Math.PI \* this.r \* this.r; }  
}  
   
export class Square extends Shape {  
  constructor(private s: number) { super(); }  
  area(): number { return this.s \* this.s; }  
}

**Test / Demo & Expected Output**

// test.ts — run: npx tsx test.ts  
import { Circle, Square } from "./solution";  
   
const c \= new Circle(2);  
const s \= new Square(3);  
console.log(c.describe()); // Area is 12.57  
console.log(s.describe()); // Area is 9.00  
// new Shape(); // compile error: cannot instantiate an abstract class  
   
console.assert(Math.round(c.area()) \=== 13, "circle area");  
console.assert(s.area() \=== 9, "square area");  
console.assert(s.describe() \=== "Area is 9.00", "shared describe uses subclass area");  
console.log("abstract-classes assertions passed.");  
   
/\* EXPECTED OUTPUT:  
Area is 12.57  
Area is 9.00  
abstract-classes assertions passed.  
\*/

**Common Follow-up Questions**

**Q: Can you instantiate an abstract class?**

**A:** No. \`new\` on an abstract class is a compile error. You instantiate a concrete subclass that implements all abstract members.

**Q: What's the point of an abstract method?**

**A:** It declares a required method with no implementation, forcing every concrete subclass to provide one — while the abstract base can still share other implemented logic that calls it.

## **36\. Access Modifiers (public / private / protected)**

**Simple Explanation (English)**

Access modifiers control where a class member can be accessed. \`public\` (the default) is accessible anywhere; \`private\` is accessible only within the same class; \`protected\` is accessible within the class and its subclasses.

These are compile-time (TypeScript) checks and don't enforce true runtime privacy — for genuine runtime privacy use JS \`\#private\` fields. A handy shortcut: putting a modifier on a constructor parameter (parameter properties) declares and assigns the field automatically.

**Hinglish Explanation**

Access modifiers control karte hain ki class member kahan access ho sakta hai. \`public\` (default) kahin bhi accessible; \`private\` sirf usi class ke andar; \`protected\` class aur uske subclasses ke andar.  
Ye compile-time (TypeScript) checks hain aur true runtime privacy enforce nahi karte — asli runtime privacy ke liye JS \`\#private\` fields use karo. Ek handy shortcut: constructor parameter par modifier lagana (parameter properties) field ko automatically declare aur assign kar deta hai.

**Key Interview Points**

* \`public\` (default): accessible anywhere.

* \`private\`: only within the declaring class.

* \`protected\`: within the class and its subclasses.

* Compile-time only — not true runtime privacy (use \`\#field\` for that).

* Parameter properties: a modifier on a ctor param declares+assigns it.

**Real-World Example**

A \`BankAccount\` keeps \`private balance\` so external code can only change it through \`deposit\`/\`withdraw\`, while a \`protected\` field lets a \`SavingsAccount\` subclass extend behaviour without exposing internals publicly.

**Code — Full & Runnable**

// solution.ts — access modifiers \+ parameter properties.  
   
export class BankAccount {  
  // 'private' parameter property: declared \+ assigned automatically  
  constructor(private balance: number, protected readonly owner: string) {}  
   
  deposit(amount: number): number {  
    this.balance \+= amount;  
    return this.balance;  
  }  
  getBalance(): number { return this.balance; } // public accessor  
}  
   
export class AuditedAccount extends BankAccount {  
  whoOwns(): string { return this.owner; } // protected \-\> visible to subclass  
}

**Test / Demo & Expected Output**

// test.ts — run: npx tsx test.ts  
import { BankAccount, AuditedAccount } from "./solution";  
   
const acc \= new BankAccount(100, "Asha");  
console.log(acc.deposit(50));     // 150  
console.log(acc.getBalance());    // 150  
// acc.balance;   // compile error: 'balance' is private  
const aud \= new AuditedAccount(0, "Ravi");  
console.log(aud.whoOwns());       // Ravi  
   
console.assert(acc.deposit(50) \=== 200, "deposit via public method");  
console.assert(acc.getBalance() \=== 200, "balance accessed via accessor");  
console.assert(aud.whoOwns() \=== "Ravi", "protected visible to subclass");  
console.log("access-modifiers assertions passed.");  
   
/\* EXPECTED OUTPUT:  
150  
150  
Ravi  
access-modifiers assertions passed.  
\*/

**Common Follow-up Questions**

**Q: Difference between private and protected?**

**A:** \`private\` is accessible only inside the declaring class; \`protected\` is also accessible in subclasses. Both restrict external access.

**Q: Do TypeScript's private members provide runtime privacy?**

**A:** No — they're compile-time checks and the field still exists at runtime. For true runtime privacy use JavaScript's \`\#private\` class fields.

## **37\. readonly in Classes**

**Simple Explanation (English)**

A \`readonly\` class property can be assigned only in its declaration or inside the constructor, and never reassigned afterward. It enforces immutability of specific instance fields at compile time — perfect for ids and values fixed at construction.

\`readonly\` combines with access modifiers (\`private readonly\`, \`public readonly\`) and with parameter properties (\`constructor(public readonly id: number)\`). Like all TypeScript features it's compile-time only; the value can still technically change at runtime unless you also freeze the object.

**Hinglish Explanation**

\`readonly\` class property sirf apni declaration me ya constructor ke andar assign ho sakti hai, aur baad me kabhi reassign nahi. Ye specific instance fields ki immutability compile time par enforce karti hai — ids aur construction par fix values ke liye perfect.  
\`readonly\` access modifiers (\`private readonly\`, \`public readonly\`) aur parameter properties (\`constructor(public readonly id: number)\`) ke saath combine hota hai. Saare TypeScript features ki tarah ye compile-time only hai; value runtime par technically badal sakti hai jab tak aap object ko freeze na karo.

**Key Interview Points**

* Assignable only in declaration or constructor; no later reassignment.

* Enforces immutability of instance fields at compile time.

* Combines with access modifiers and parameter properties.

* Common for ids and construction-time constants.

* Compile-time only — use \`Object.freeze\` for runtime immutability.

**Real-World Example**

Declaring \`public readonly id: number\` on an entity guarantees the id, set once in the constructor, can never be reassigned anywhere else — the compiler rejects \`entity.id \= 2\`.

**Code — Full & Runnable**

// solution.ts — readonly class fields (with a parameter property).  
   
export class Product {  
  public readonly id: number;  
  constructor(id: number, public name: string, public readonly sku: string) {  
    this.id \= id; // allowed in constructor  
  }  
  rename(newName: string): void {  
    this.name \= newName;   // allowed: 'name' is not readonly  
    // this.id \= 99;        // compile error: 'id' is readonly  
  }  
}

**Test / Demo & Expected Output**

// test.ts — run: npx tsx test.ts  
import { Product } from "./solution";  
   
const p \= new Product(1, "Lamp", "SKU-001");  
console.log(p.id, p.name, p.sku); // 1 Lamp SKU-001  
p.rename("Desk Lamp");  
console.log(p.name);              // Desk Lamp  
   
console.assert(p.id \=== 1, "readonly id set in constructor");  
console.assert(p.sku \=== "SKU-001", "readonly param property");  
console.assert(p.name \=== "Desk Lamp", "mutable field can change");  
console.log("readonly-in-classes assertions passed.");  
   
/\* EXPECTED OUTPUT:  
1 Lamp SKU-001  
Desk Lamp  
readonly-in-classes assertions passed.  
\*/

**Common Follow-up Questions**

**Q: Where can a readonly class field be assigned?**

**A:** Only in its declaration (initializer) or within the constructor. Any assignment elsewhere is a compile error.

**Q: Can readonly be combined with access modifiers?**

**A:** Yes — e.g. \`private readonly\` or \`public readonly\`, including as a parameter property like \`constructor(public readonly id: number)\`.

## **38\. Decorators**

**Simple Explanation (English)**

Decorators are special functions, prefixed with \`@\`, that attach reusable behaviour or metadata to classes, methods, accessors, properties, or parameters. They let you wrap or augment a declaration declaratively — e.g. logging, validation, dependency injection.

A method decorator, for instance, receives the original method and can return a replacement that adds behaviour (like timing or logging) around the original call. Frameworks like Angular and NestJS rely heavily on decorators. Note: enabling them requires the right compiler/runtime configuration.

**Hinglish Explanation**

Decorators special functions hain, \`@\` se prefixed, jo classes, methods, accessors, properties, ya parameters ko reusable behaviour ya metadata attach karte hain. Ye aapko ek declaration ko declaratively wrap ya augment karne dete hain — jaise logging, validation, dependency injection.  
Ek method decorator, jaise, original method receive karta hai aur ek replacement return kar sakta hai jo original call ke aas-paas behaviour add kare (jaise timing ya logging). Angular aur NestJS jaise frameworks decorators par bohot bharosa karte hain. Note: inhe enable karne ke liye sahi compiler/runtime configuration chahiye.

**Key Interview Points**

* \`@decorator\` attaches behaviour/metadata to a declaration.

* Apply to classes, methods, accessors, properties, parameters.

* A method decorator can wrap/replace the original method.

* Heavily used by Angular, NestJS, TypeORM, etc.

* Require enabling (decorators support / experimentalDecorators).

**Real-World Example**

In NestJS, \`@Controller()\` and \`@Get()\` decorators declaratively register routes; a custom \`@Log()\` decorator can wrap a method to log its calls and timing without cluttering the method body.

**Code — Full & Runnable**

// Decorator syntax (TС 5+ stage-3 decorators):  
//  
//   function logged(orig: any, ctx: ClassMethodDecoratorContext) {  
//     return function (this: any, ...args: any\[\]) {  
//       console.log("calling " \+ String(ctx.name));  
//       return orig.apply(this, args);  
//     };  
//   }  
//   class Calc { @logged add(a: number, b: number) { return a \+ b; } }  
//  
// Decorators need build config (and some bundlers differ), so for a runnable  
// demo we show the SAME idea as a plain higher-order wrapper.  
   
export function logged\<A extends any\[\], R\>(name: string, fn: (...a: A) \=\> R) {  
  return (...args: A): R \=\> {  
    // (would console.log in a real decorator)  
    return fn(...args);  
  };  
}  
   
export class Calc {  
  add \= logged("add", (a: number, b: number) \=\> a \+ b);  
}

**Test / Demo & Expected Output**

// test.ts — run: npx tsx test.ts  
import { Calc, logged } from "./solution";  
   
const calc \= new Calc();  
console.log(calc.add(2, 3)); // 5  
   
const timesTwo \= logged("double", (n: number) \=\> n \* 2);  
console.log(timesTwo(21));   // 42  
   
console.assert(calc.add(2, 3\) \=== 5, "wrapped method works");  
console.assert(timesTwo(21) \=== 42, "wrapper preserves behaviour");  
console.log("decorators assertions passed.");  
console.log("Note: real @decorators need compiler/runtime config; logic shown via a wrapper.");  
   
/\* EXPECTED OUTPUT:  
5  
42  
decorators assertions passed.  
Note: real @decorators need compiler/runtime config; logic shown via a wrapper.  
\*/

**Common Follow-up Questions**

**Q: What can decorators be applied to?**

**A:** Classes, methods, accessors, properties, and (with the legacy implementation) parameters. They attach reusable behaviour or metadata declaratively with the \`@\` syntax.

**Q: Name a framework that relies on decorators.**

**A:** Angular and NestJS use them extensively (e.g. \`@Component\`, \`@Injectable\`, \`@Controller\`, \`@Get\`), as does TypeORM for entity/column definitions.

## **39\. Generics**

**Simple Explanation (English)**

Generics let you write reusable, type-safe code that works over MANY types while preserving the relationship between inputs and outputs. A type parameter (commonly \`\<T\>\`) acts as a placeholder filled in when the function/class is used.

Without generics you'd either duplicate code per type or fall back to \`any\` (losing safety). With generics, an \`identity\<T\>(x: T): T\` keeps the exact type: pass a string, get a string back — checked by the compiler. They're the backbone of typed collections and utilities.

**Hinglish Explanation**

Generics aapko reusable, type-safe code likhne dete hain jo KAI types par chale jabki inputs aur outputs ka rishta bana rahe. Ek type parameter (aam taur par \`\<T\>\`) ek placeholder ki tarah kaam karta hai jo function/class use hone par bhar jaata hai.  
Generics ke bina aap ya to per type code duplicate karte ya \`any\` par gir jaate (safety khote). Generics se, ek \`identity\<T\>(x: T): T\` exact type rakhta hai: string do, string wapas milega — compiler se checked. Ye typed collections aur utilities ki reedh hain.

**Key Interview Points**

* Type parameters (\`\<T\>\`) make code reusable across types.

* Preserve the input↔output type relationship (unlike \`any\`).

* Filled in at the use site, often inferred automatically.

* Foundation of typed collections and utility functions.

* Multiple parameters allowed: \`\<T, U\>\`.

**Real-World Example**

A typed \`first\<T\>(arr: T\[\]): T | undefined\` returns an element of the same type as the array — call it on \`User\[\]\` and get a \`User\`, on \`number\[\]\` and get a \`number\`, all without duplicating the function.

**Code — Full & Runnable**

// solution.ts — basic generics.  
   
export function identity\<T\>(value: T): T {  
  return value;  
}  
   
export function first\<T\>(arr: T\[\]): T | undefined {  
  return arr\[0\];  
}  
   
export function pair\<A, B\>(a: A, b: B): \[A, B\] {  
  return \[a, b\];  
}

**Test / Demo & Expected Output**

// test.ts — run: npx tsx test.ts  
import { identity, first, pair } from "./solution";  
   
console.log(identity("hello"));   // hello (typed as string)  
console.log(identity(42));        // 42    (typed as number)  
console.log(first(\[10, 20, 30\])); // 10  
console.log(first\<string\>(\[\]));   // undefined  
console.log(pair("age", 30));     // \['age', 30\]  
   
console.assert(identity("hello") \=== "hello", "generic identity");  
console.assert(first(\[10, 20\]) \=== 10, "generic first");  
console.assert(first(\[\]) \=== undefined, "empty \-\> undefined");  
console.assert(JSON.stringify(pair("age", 30)) \=== '\["age",30\]', "two type params");  
console.log("generics assertions passed.");  
   
/\* EXPECTED OUTPUT:  
hello  
42  
10  
undefined  
\[ 'age', 30 \]  
generics assertions passed.  
\*/

**Common Follow-up Questions**

**Q: Why use generics instead of \`any\`?**

**A:** Generics preserve type information and the relationship between inputs and outputs, so the compiler still checks usage. \`any\` discards type safety entirely.

**Q: Do you always have to specify the type argument?**

**A:** No — TypeScript usually infers it from the arguments (e.g. \`identity(42)\` infers \`T \= number\`). You can specify it explicitly (\`identity\<number\>(42)\`) when inference isn't possible or you want to constrain it.

## **40\. Generic Functions**

**Simple Explanation (English)**

A generic function declares one or more type parameters in angle brackets before its parameter list, then uses them in its parameters and return type. This lets a single function adapt to whatever types it's called with while staying type-safe.

Type arguments are usually INFERRED from the arguments you pass, so you rarely write them explicitly. Generic functions are everywhere in typed utilities — mapping, picking, wrapping — and they keep the precise types flowing from input to output.

**Hinglish Explanation**

Generic function apne parameter list se pehle angle brackets me ek ya zyada type parameters declare karta hai, phir unhe apne parameters aur return type me use karta hai. Isse ek hi function jin types ke saath call ho un par adapt kar leta hai jabki type-safe rehta hai.  
Type arguments aam taur par aapke pass kiye arguments se INFER hote hain, isliye aap inhe shaayad hi explicitly likho. Generic functions typed utilities me har jagah hain — mapping, picking, wrapping — aur ye precise types ko input se output tak flow karte rehte hain.

**Key Interview Points**

* Declare type params before the parameter list: \`function f\<T\>(...)\`.

* Use the params in parameters and return type.

* Type arguments are usually inferred from the call.

* Enable reusable, type-preserving utilities.

* Can have several params: \`function f\<T, U\>(...)\`.

**Real-World Example**

A \`groupBy\<T, K\>(items: T\[\], keyFn: (item: T) \=\> K)\` utility works for any item and key type, returning a correctly-typed map — written once, reused for users, orders, anything.

**Code — Full & Runnable**

// solution.ts — generic functions with inference.  
   
export function last\<T\>(arr: T\[\]): T | undefined {  
  return arr\[arr.length \- 1\];  
}  
   
export function mapKeys\<T, K extends string\>(items: T\[\], keyFn: (item: T) \=\> K): Record\<K, T\> {  
  const out \= {} as Record\<K, T\>;  
  for (const item of items) out\[keyFn(item)\] \= item;  
  return out;  
}

**Test / Demo & Expected Output**

// test.ts — run: npx tsx test.ts  
import { last, mapKeys } from "./solution";  
   
console.log(last(\[1, 2, 3\]));        // 3  
console.log(last(\["a", "b"\]));       // b  
   
const users \= \[{ id: "u1", name: "Asha" }, { id: "u2", name: "Ravi" }\];  
const byId \= mapKeys(users, (u) \=\> u.id);  
console.log(byId.u1.name);           // Asha  
   
console.assert(last(\[1, 2, 3\]) \=== 3, "generic last (number)");  
console.assert(last(\["a", "b"\]) \=== "b", "generic last (string)");  
console.assert(byId.u2.name \=== "Ravi", "mapKeys builds typed record");  
console.log("generic-functions assertions passed.");  
   
/\* EXPECTED OUTPUT:  
3  
b  
Asha  
generic-functions assertions passed.  
\*/

**Common Follow-up Questions**

**Q: Do you usually pass type arguments to generic functions explicitly?**

**A:** No — TypeScript infers them from the arguments. You only specify them when inference can't determine the type or you want to enforce a particular one.

**Q: Where do you declare a function's type parameters?**

**A:** In angle brackets immediately before the parameter list: \`function f\<T\>(arg: T): T\`. They're then usable throughout the signature and body.

## **41\. Generic Interfaces**

**Simple Explanation (English)**

A generic interface takes type parameters so it can describe shapes that vary by type — like a container, response wrapper, or key-value store. You write \`interface Box\<T\> { value: T }\` and then use \`Box\<string\>\`, \`Box\<number\>\`, etc.

Generic interfaces are ideal for reusable data structures and API contracts: an \`ApiResponse\<T\>\` can wrap any payload type while keeping \`data: T\` precise. The same idea applies to generic type aliases and generic classes.

**Hinglish Explanation**

Generic interface type parameters leta hai taaki woh aise shapes describe kar sake jo type se vary karein — jaise container, response wrapper, ya key-value store. Aap \`interface Box\<T\> { value: T }\` likhte ho phir \`Box\<string\>\`, \`Box\<number\>\` use karte ho.  
Generic interfaces reusable data structures aur API contracts ke liye ideal hain: ek \`ApiResponse\<T\>\` kisi bhi payload type ko wrap kar sakta hai jabki \`data: T\` precise rahe. Yahi idea generic type aliases aur generic classes par bhi lagta hai.

**Key Interview Points**

* Interfaces can take type parameters: \`interface Box\<T\> { value: T }\`.

* Use as \`Box\<string\>\`, \`Box\<User\>\`, etc.

* Perfect for containers, wrappers, and API response types.

* Keeps payload types precise across reuse.

* Same idea works for generic type aliases and classes.

**Real-World Example**

An \`ApiResponse\<T\>\` interface (\`{ status: number; data: T }\`) is reused for every endpoint — \`ApiResponse\<User\>\`, \`ApiResponse\<Order\[\]\>\` — so the \`data\` field is always correctly typed for each call.

**Code — Full & Runnable**

// solution.ts — a generic interface used with different types.  
   
export interface ApiResponse\<T\> {  
  status: number;  
  data: T;  
}  
   
export interface KeyValue\<K, V\> {  
  key: K;  
  value: V;  
}  
   
export function ok\<T\>(data: T): ApiResponse\<T\> {  
  return { status: 200, data };  
}  
   
export function entry\<K, V\>(key: K, value: V): KeyValue\<K, V\> {  
  return { key, value };  
}

**Test / Demo & Expected Output**

// test.ts — run: npx tsx test.ts  
import { ok, entry, ApiResponse } from "./solution";  
   
const userResp: ApiResponse\<{ name: string }\> \= ok({ name: "Asha" });  
console.log(userResp);            // { status: 200, data: { name: 'Asha' } }  
console.log(ok(\[1, 2, 3\]).data);  // \[1,2,3\]  
console.log(entry("age", 30));    // { key: 'age', value: 30 }  
   
console.assert(userResp.status \=== 200 && userResp.data.name \=== "Asha", "generic ApiResponse");  
console.assert(JSON.stringify(ok(\[1, 2\]).data) \=== "\[1,2\]", "wraps array payload");  
console.assert(entry("age", 30).value \=== 30, "generic KeyValue");  
console.log("generic-interfaces assertions passed.");  
   
/\* EXPECTED OUTPUT:  
{ status: 200, data: { name: 'Asha' } }  
\[ 1, 2, 3 \]  
{ key: 'age', value: 30 }  
generic-interfaces assertions passed.  
\*/

**Common Follow-up Questions**

**Q: What's a common use for a generic interface?**

**A:** Reusable containers and API wrappers — e.g. \`ApiResponse\<T\>\` or \`Box\<T\>\` — where the structure is fixed but the contained data type varies per use.

**Q: Can a generic interface have multiple type parameters?**

**A:** Yes — e.g. \`interface KeyValue\<K, V\> { key: K; value: V }\`. You can declare as many as you need, and they can have constraints and defaults.

## **42\. Generic Constraints**

**Simple Explanation (English)**

A generic constraint limits what types a type parameter can be, using \`extends\`: \`\<T extends { length: number }\>\` allows only types that have a \`length\`. This lets you safely use members of \`T\` inside the function while still being generic.

Without a constraint, the compiler knows nothing about \`T\` and won't let you access its properties. Constraints strike the balance between flexibility and safety, and \`keyof\` constraints (e.g. \`K extends keyof T\`) power type-safe property access.

**Hinglish Explanation**

Generic constraint \`extends\` se limit karta hai ki type parameter kaunse types ho sakte hain: \`\<T extends { length: number }\>\` sirf un types ko allow karta hai jinme \`length\` ho. Isse aap function ke andar \`T\` ke members safely use kar sakte ho jabki generic rehte ho.  
Constraint ke bina, compiler \`T\` ke baare me kuch nahi jaanta aur uski properties access nahi karne deta. Constraints flexibility aur safety ke beech balance laate hain, aur \`keyof\` constraints (jaise \`K extends keyof T\`) type-safe property access deते hain.

**Key Interview Points**

* \`\<T extends Constraint\>\` restricts what T can be.

* Lets you safely access members guaranteed by the constraint.

* Without a constraint, T's members are unknown and inaccessible.

* \`K extends keyof T\` enables type-safe property access by key.

* Balances generic flexibility with member safety.

**Real-World Example**

A type-safe \`getProperty(obj, key)\` constrained with \`K extends keyof T\` guarantees the key exists on the object and returns the correctly-typed value — impossible to call with a misspelled key.

**Code — Full & Runnable**

// solution.ts — constraints with extends and keyof.  
   
export function longest\<T extends { length: number }\>(a: T, b: T): T {  
  return a.length \>= b.length ? a : b;  
}  
   
export function getProperty\<T, K extends keyof T\>(obj: T, key: K): T\[K\] {  
  return obj\[key\]; // type-safe: key must be a valid property of T  
}

**Test / Demo & Expected Output**

// test.ts — run: npx tsx test.ts  
import { longest, getProperty } from "./solution";  
   
console.log(longest("abc", "de"));         // abc  
console.log(longest(\[1, 2\], \[3, 4, 5\]));   // \[3,4,5\]  
   
const user \= { id: 1, name: "Asha" };  
console.log(getProperty(user, "name"));    // Asha (typed as string)  
console.log(getProperty(user, "id"));      // 1    (typed as number)  
// getProperty(user, "age"); // compile error: 'age' is not a key of user  
   
console.assert(longest("abc", "de") \=== "abc", "constraint allows .length");  
console.assert(JSON.stringify(longest(\[1,2\],\[3,4,5\])) \=== "\[3,4,5\]", "works for arrays too");  
console.assert(getProperty(user, "name") \=== "Asha", "keyof constraint");  
console.log("generic-constraints assertions passed.");  
   
/\* EXPECTED OUTPUT:  
abc  
\[ 3, 4, 5 \]  
Asha  
1  
generic-constraints assertions passed.  
\*/

**Common Follow-up Questions**

**Q: Why constrain a generic type parameter?**

**A:** To safely use members of the type inside the function. \`\<T extends { length: number }\>\` guarantees \`T\` has \`length\`, so accessing it is type-safe; without the constraint the compiler wouldn't allow it.

**Q: What does \`K extends keyof T\` achieve?**

**A:** It restricts \`K\` to the actual property names of \`T\`, enabling type-safe property access (\`obj\[key\]\` returns \`T\[K\]\`) and rejecting invalid/misspelled keys at compile time.

## **43\. Generic Defaults**

**Simple Explanation (English)**

A generic default provides a fallback type for a type parameter when the caller doesn't specify (and it can't be inferred): \`\<T \= string\>\`. The default is used unless a type argument is supplied or inferred from usage.

Defaults make generic APIs more convenient — common cases need no explicit type argument while advanced cases can override. They're often combined with constraints (\`\<T extends object \= {}\>\`) and are common in library types (e.g. React's \`useState\`, generic config types).

**Hinglish Explanation**

Generic default ek type parameter ke liye fallback type deta hai jab caller specify na kare (aur infer na ho sake): \`\<T \= string\>\`. Default tab use hota hai jab tak koi type argument na diya jaaye ya usage se infer na ho.  
Defaults generic APIs ko zyada convenient banate hain — common cases me explicit type argument nahi chahiye jabki advanced cases override kar sakte hain. Ye aksar constraints ke saath combine hote hain (\`\<T extends object \= {}\>\`) aur library types me common hain (jaise React ka \`useState\`, generic config types).

**Key Interview Points**

* \`\<T \= Default\>\` supplies a fallback type parameter.

* Used when no type argument is given or inferred.

* Makes common usage simpler; advanced usage can override.

* Often combined with constraints: \`\<T extends X \= Y\>\`.

* Common in library/config type definitions.

**Real-World Example**

A generic \`createStore\<State \= {}\>()\` defaults to an empty state shape so simple usage needs no type argument, while a typed app passes its specific \`AppState\` to get full type safety.

**Code — Full & Runnable**

// solution.ts — generic defaults.  
   
export interface Container\<T \= string\> {  
  items: T\[\];  
}  
   
export function makeContainer\<T \= number\>(items: T\[\]): Container\<T\> {  
  return { items };  
}  
   
// Default applies when nothing is specified/inferable:  
export function emptyContainer\<T \= boolean\>(): Container\<T\> {  
  return { items: \[\] };  
}

**Test / Demo & Expected Output**

// test.ts — run: npx tsx test.ts  
import { makeContainer, emptyContainer } from "./solution";  
   
console.log(makeContainer(\[1, 2, 3\]));      // T inferred as number  
console.log(makeContainer(\["a", "b"\]));     // T inferred as string  
console.log(emptyContainer());              // uses default T \= boolean  
console.log(emptyContainer\<number\>());      // overridden to number  
   
console.assert(makeContainer(\[1, 2, 3\]).items.length \=== 3, "inferred number container");  
console.assert(makeContainer(\["a"\]).items\[0\] \=== "a", "inferred string container");  
console.assert(emptyContainer().items.length \=== 0, "default-typed empty container");  
console.log("generic-defaults assertions passed.");  
   
/\* EXPECTED OUTPUT:  
{ items: \[ 1, 2, 3 \] }  
{ items: \[ 'a', 'b' \] }  
{ items: \[\] }  
{ items: \[\] }  
generic-defaults assertions passed.  
\*/

**Common Follow-up Questions**

**Q: When is a generic default used?**

**A:** When the type argument is neither explicitly provided nor inferable from the arguments. The default fills in so common usage doesn't need an explicit type.

**Q: Can defaults and constraints be combined?**

**A:** Yes — \`\<T extends object \= {}\>\` both restricts what T can be and provides a fallback when none is supplied.

## **44\. Utility Types (overview)**

**Simple Explanation (English)**

Utility types are built-in generic types that transform existing types into new ones, so you don't have to redefine variations by hand. They make types DRY and expressive. Common ones include \`Partial\`, \`Required\`, \`Readonly\`, \`Pick\`, \`Omit\`, \`Record\`, \`Exclude\`, \`Extract\`, \`NonNullable\`, \`ReturnType\`, and \`Parameters\`.

Most are implemented with mapped and conditional types under the hood. Knowing them well lets you derive types from a single source of truth — e.g. an update DTO as \`Partial\<User\>\`, or a public view as \`Omit\<User, "password"\>\` — keeping related types automatically in sync.

**Hinglish Explanation**

Utility types built-in generic types hain jo existing types ko naye types me transform karte hain, taaki aapko variations haath se dobara define na karni padein. Ye types ko DRY aur expressive banate hain. Common ones: \`Partial\`, \`Required\`, \`Readonly\`, \`Pick\`, \`Omit\`, \`Record\`, \`Exclude\`, \`Extract\`, \`NonNullable\`, \`ReturnType\`, \`Parameters\`.  
Zyadatar andar se mapped aur conditional types se bane hain. Inhe achhe se jaanna aapko ek single source of truth se types derive karne deta hai — jaise update DTO ko \`Partial\<User\>\`, ya public view ko \`Omit\<User, "password"\>\` — jisse related types automatically sync me rehte hain.

**Key Interview Points**

* Built-in generics that transform types into new types.

* Keep types DRY — derive variations from one source.

* Examples: Partial, Required, Readonly, Pick, Omit, Record, Exclude, Extract.

* Also: NonNullable, ReturnType, Parameters, InstanceType, Awaited.

* Built on mapped \+ conditional types internally.

**Real-World Example**

From one \`User\` interface you derive \`Partial\<User\>\` for PATCH updates, \`Omit\<User, "password"\>\` for API responses, and \`Pick\<User, "id" | "name"\>\` for a summary — all stay in sync if \`User\` changes.

**Code — Full & Runnable**

// solution.ts — a quick tour of several utility types.  
   
interface User {  
  id: number;  
  name: string;  
  email: string;  
  password: string;  
}  
   
export type UserUpdate \= Partial\<User\>;          // all optional  
export type PublicUser \= Omit\<User, "password"\>; // drop a field  
export type UserSummary \= Pick\<User, "id" | "name"\>; // keep some  
   
export function applyUpdate(user: User, update: UserUpdate): User {  
  return { ...user, ...update };  
}  
   
export function toPublic(user: User): PublicUser {  
  const { password, ...pub } \= user;  
  return pub;  
}

**Test / Demo & Expected Output**

// test.ts — run: npx tsx test.ts  
import { applyUpdate, toPublic } from "./solution";  
   
const user \= { id: 1, name: "Asha", email: "a@x.com", password: "secret" };  
console.log(applyUpdate(user, { name: "Asha K" }).name); // Asha K  
const pub \= toPublic(user);  
console.log(pub);                  // no password field  
console.log("password" in pub);    // false  
   
console.assert(applyUpdate(user, { name: "Asha K" }).name \=== "Asha K", "Partial update");  
console.assert(\!("password" in pub), "Omit removes password");  
console.assert(pub.email \=== "a@x.com", "other fields preserved");  
console.log("utility-types-overview assertions passed.");  
   
/\* EXPECTED OUTPUT:  
Asha K  
{ id: 1, name: 'Asha', email: 'a@x.com' }  
false  
utility-types-overview assertions passed.  
\*/

**Common Follow-up Questions**

**Q: Why use utility types?**

**A:** To derive related types from a single source of truth instead of hand-maintaining variations, keeping them DRY and automatically in sync when the base type changes.

**Q: What are utility types built from internally?**

**A:** Mostly mapped types and conditional types — the same building blocks you can use to author your own custom utility types.

## **45\. Partial\<T\>**

**Simple Explanation (English)**

\`Partial\<T\>\` produces a new type with all of \`T\`'s properties made OPTIONAL. It's perfect for update/patch operations where the caller supplies only the fields they want to change, and for default-merging configuration objects.

Internally it's a mapped type that adds \`?\` to every property. Note it's shallow — nested objects aren't made partial. For deep optionality you'd write a recursive \`DeepPartial\<T\>\` yourself.

**Hinglish Explanation**

\`Partial\<T\>\` ek naya type banata hai jisme \`T\` ki saari properties OPTIONAL ho jaati hain. Ye update/patch operations ke liye perfect hai jahan caller sirf woh fields deta hai jo change karne hain, aur configuration objects ke default-merging ke liye.  
Andar se ye ek mapped type hai jo har property me \`?\` add karta hai. Note ye shallow hai — nested objects partial nahi hote. Deep optionality ke liye aapko khud ek recursive \`DeepPartial\<T\>\` likhna padega.

**Key Interview Points**

* Makes every property of T optional.

* Ideal for patch/update functions and merging defaults.

* Implemented as a mapped type adding \`?\`.

* Shallow — nested objects are not made partial.

* Pair with spread to merge updates onto a full object.

**Real-World Example**

An \`updateUser(id, changes: Partial\<User\>)\` function lets callers send only the fields to change (e.g. just \`{ email }\`), which the server merges onto the existing record.

**Code — Full & Runnable**

// solution.ts — Partial for updates.  
   
interface Settings {  
  theme: string;  
  fontSize: number;  
  notifications: boolean;  
}  
   
export function updateSettings(current: Settings, changes: Partial\<Settings\>): Settings {  
  return { ...current, ...changes };  
}

**Test / Demo & Expected Output**

// test.ts — run: npx tsx test.ts  
import { updateSettings } from "./solution";  
   
const current \= { theme: "light", fontSize: 14, notifications: true };  
console.log(updateSettings(current, { theme: "dark" }));         // only theme changes  
console.log(updateSettings(current, { fontSize: 18, notifications: false }));  
   
const r \= updateSettings(current, { theme: "dark" });  
console.assert(r.theme \=== "dark", "changed field applied");  
console.assert(r.fontSize \=== 14 && r.notifications \=== true, "other fields preserved");  
console.log("Partial assertions passed.");  
   
/\* EXPECTED OUTPUT:  
{ theme: 'dark', fontSize: 14, notifications: true }  
{ theme: 'light', fontSize: 18, notifications: false }  
Partial assertions passed.  
\*/

**Common Follow-up Questions**

**Q: What does Partial\<T\> do?**

**A:** It returns a type identical to T but with every property optional (\`?\`). Useful for partial updates where only some fields are provided.

**Q: Is Partial deep or shallow?**

**A:** Shallow — only top-level properties become optional. Nested object properties stay required; you'd need a custom recursive \`DeepPartial\<T\>\` for deep optionality.

## **46\. Required\<T\>**

**Simple Explanation (English)**

\`Required\<T\>\` is the opposite of \`Partial\<T\>\`: it produces a new type with all of \`T\`'s properties made REQUIRED, removing every \`?\`. Use it when you've validated/filled in an object and want to guarantee no optional fields remain.

It's a mapped type that strips optionality (and, since TS, the implicit \`undefined\`). A common pattern is to accept a \`Partial\`/optional config from the caller, merge with defaults, and then treat the result as \`Required\<Config\>\` internally.

**Hinglish Explanation**

\`Required\<T\>\` \`Partial\<T\>\` ka ulta hai: ye ek naya type banata hai jisme \`T\` ki saari properties REQUIRED ho jaati hain, har \`?\` hata kar. Ise tab use karo jab aapne ek object validate/fill kar liya ho aur guarantee chahiye ki koi optional field na bache.  
Ye ek mapped type hai jo optionality (aur implicit \`undefined\`) strip karta hai. Common pattern: caller se \`Partial\`/optional config lo, defaults ke saath merge karo, phir result ko internally \`Required\<Config\>\` ki tarah treat karo.

**Key Interview Points**

* Makes every property of T required (removes \`?\`).

* Opposite of Partial\<T\>.

* Useful after merging defaults to guarantee completeness.

* Implemented as a mapped type removing optionality.

* Helps internal code assume all fields are present.

**Real-World Example**

A function takes an optional \`Partial\<Options\>\` from users, merges it with defaults, and returns a \`Required\<Options\>\` so the rest of the code never has to null-check those fields again.

**Code — Full & Runnable**

// solution.ts — Required after merging defaults.  
   
interface Options {  
  retries?: number;  
  timeout?: number;  
}  
   
const DEFAULTS: Required\<Options\> \= { retries: 3, timeout: 3000 };  
   
export function resolveOptions(opts: Options): Required\<Options\> {  
  return { ...DEFAULTS, ...opts }; // result has no optional fields  
}

**Test / Demo & Expected Output**

// test.ts — run: npx tsx test.ts  
import { resolveOptions } from "./solution";  
   
console.log(resolveOptions({}));                  // { retries: 3, timeout: 3000 }  
console.log(resolveOptions({ retries: 5 }));      // { retries: 5, timeout: 3000 }  
   
const r \= resolveOptions({ timeout: 1000 });  
console.assert(r.retries \=== 3 && r.timeout \=== 1000, "defaults filled, override applied");  
console.assert(Object.keys(resolveOptions({})).length \=== 2, "all required fields present");  
console.log("Required assertions passed.");  
   
/\* EXPECTED OUTPUT:  
{ retries: 3, timeout: 3000 }  
{ retries: 5, timeout: 3000 }  
Required assertions passed.  
\*/

**Common Follow-up Questions**

**Q: What does Required\<T\> do?**

**A:** It produces a type where every property of T is required, removing all \`?\` optional markers — the inverse of Partial\<T\>.

**Q: Give a typical use of Required\<T\>.**

**A:** After merging user-supplied optional options with defaults, type the result as \`Required\<Options\>\` so downstream code can assume all fields are present without null checks.

## **47\. Pick\<T, K\>**

**Simple Explanation (English)**

\`Pick\<T, K\>\` constructs a new type by selecting only the properties named in \`K\` (a union of keys) from \`T\`. It's how you create a focused subset of a larger type — like a summary or a form's relevant fields.

\`K\` must be keys of \`T\`, so the compiler rejects invalid names. Pick is the complement of \`Omit\` (which removes keys instead of selecting them) and keeps your subset types tied to the original so they update automatically.

**Hinglish Explanation**

\`Pick\<T, K\>\` ek naya type banata hai \`T\` se sirf \`K\` (keys ka union) me named properties select karke. Ye ek bade type ka focused subset banane ka tarika hai — jaise summary ya form ke relevant fields.  
\`K\` ko \`T\` ki keys honi chahiye, isliye compiler invalid names reject karta hai. Pick \`Omit\` ka complement hai (jo keys hatata hai select karne ke bajaye) aur aapke subset types ko original se juda rakhta hai taaki woh automatically update hon.

**Key Interview Points**

* Selects only the listed keys K from T.

* K must be valid keys of T (invalid names error).

* Creates focused subsets (summaries, partial views).

* Complement of Omit (select vs remove).

* Subset stays in sync with the source type.

**Real-World Example**

A list view that only needs \`Pick\<User, "id" | "name" | "avatar"\>\` keeps the component's props minimal and type-safe, automatically reflecting any change to those fields in the base \`User\`.

**Code — Full & Runnable**

// solution.ts — Pick a subset of a type.  
   
interface User {  
  id: number;  
  name: string;  
  email: string;  
  password: string;  
}  
   
export type UserCard \= Pick\<User, "id" | "name"\>;  
   
export function toCard(user: User): UserCard {  
  return { id: user.id, name: user.name };  
}

**Test / Demo & Expected Output**

// test.ts — run: npx tsx test.ts  
import { toCard } from "./solution";  
   
const user \= { id: 1, name: "Asha", email: "a@x.com", password: "secret" };  
const card \= toCard(user);  
console.log(card);                 // { id: 1, name: 'Asha' }  
console.log("email" in card);      // false  
   
console.assert(card.id \=== 1 && card.name \=== "Asha", "picked fields present");  
console.assert(\!("email" in card), "non-picked field absent");  
console.log("Pick assertions passed.");  
   
/\* EXPECTED OUTPUT:  
{ id: 1, name: 'Asha' }  
false  
Pick assertions passed.  
\*/

**Common Follow-up Questions**

**Q: What does Pick\<T, K\> produce?**

**A:** A type containing only the properties of T named in the key union K — a focused subset. K must consist of valid keys of T.

**Q: How does Pick relate to Omit?**

**A:** They're complementary: \`Pick\` keeps the listed keys, \`Omit\` removes them. \`Pick\<T, K\>\` and \`Omit\<T, Exclude\<keyof T, K\>\>\` are equivalent.

## **48\. Omit\<T, K\>**

**Simple Explanation (English)**

\`Omit\<T, K\>\` constructs a new type with all properties of \`T\` EXCEPT those named in \`K\`. It's the go-to for removing sensitive or irrelevant fields — e.g. stripping \`password\` from a user before sending it to the client.

Unlike \`Pick\`, \`K\` in \`Omit\` isn't restricted to keys of \`T\` (you can list non-existent keys without error in many versions), so be careful with typos. Omit is widely used for DTOs, public views, and 'everything but these' subset types.

**Hinglish Explanation**

\`Omit\<T, K\>\` ek naya type banata hai jisme \`T\` ki saari properties hain SIVAY un ke jo \`K\` me named hain. Ye sensitive ya irrelevant fields hatane ka go-to hai — jaise client ko bhejne se pehle user se \`password\` strip karna.  
\`Pick\` ke विपरीत, \`Omit\` me \`K\` \`T\` ki keys tak restricted nahi (kai versions me non-existent keys bina error ke list kar sakte ho), isliye typos se savdhaan. Omit DTOs, public views, aur 'in sab ke alawa' subset types ke liye widely use hota hai.

**Key Interview Points**

* Keeps all properties of T except the listed keys K.

* Great for removing sensitive/irrelevant fields.

* Complement of Pick (remove vs select).

* K isn't strictly constrained to keyof T — watch for typos.

* Common for DTOs and public API views.

**Real-World Example**

Returning \`Omit\<User, "password" | "passwordHash"\>\` from an API ensures credentials never leak to the client, and the type updates automatically if you add more sensitive fields to remove.

**Code — Full & Runnable**

// solution.ts — Omit sensitive fields.  
   
interface User {  
  id: number;  
  name: string;  
  email: string;  
  password: string;  
}  
   
export type SafeUser \= Omit\<User, "password"\>;  
   
export function toSafe(user: User): SafeUser {  
  const { password, ...safe } \= user;  
  return safe;  
}

**Test / Demo & Expected Output**

// test.ts — run: npx tsx test.ts  
import { toSafe } from "./solution";  
   
const user \= { id: 1, name: "Asha", email: "a@x.com", password: "secret" };  
const safe \= toSafe(user);  
console.log(safe);                  // no password  
console.log("password" in safe);    // false  
console.log(safe.email);            // a@x.com  
   
console.assert(\!("password" in safe), "Omit removes password");  
console.assert(safe.id \=== 1 && safe.email \=== "a@x.com", "remaining fields kept");  
console.log("Omit assertions passed.");  
   
/\* EXPECTED OUTPUT:  
{ id: 1, name: 'Asha', email: 'a@x.com' }  
false  
a@x.com  
Omit assertions passed.  
\*/

**Common Follow-up Questions**

**Q: What does Omit\<T, K\> produce?**

**A:** A type with all of T's properties except those named in K — the inverse of Pick. It's commonly used to drop sensitive fields like passwords.

**Q: What's a gotcha with Omit's key argument?**

**A:** Unlike Pick, the keys in Omit aren't strictly required to exist on T in many TS versions, so a typo in a key name may not be flagged — double-check the key names.

## **49\. Record\<K, V\> (utility)**

**Simple Explanation (English)**

As a utility type, \`Record\<K, V\>\` builds an object type whose keys are of type \`K\` and whose values are of type \`V\`. With a literal-union \`K\` it requires exactly those keys; with \`string\`/\`number\` it models an open dictionary.

It's frequently used to map a fixed set of keys to values — config tables, status-to-label maps, or enum-to-handler dictionaries. Because the key set is enforced, adding a key to the union forces you to provide its value, keeping maps exhaustive.

**Hinglish Explanation**

Utility type ki tarah, \`Record\<K, V\>\` ek object type banata hai jiski keys \`K\` type ki aur values \`V\` type ki hoti hain. Literal-union \`K\` ke saath ye bilkul un keys ki maang karta hai; \`string\`/\`number\` ke saath ye ek open dictionary model karta hai.  
Ye ek fixed set of keys ko values se map karne ke liye aksar use hota hai — config tables, status-to-label maps, ya enum-to-handler dictionaries. Kyunki key set enforce hota hai, union me key add karne par uski value deni padti hai, jisse maps exhaustive rehte hain.

**Key Interview Points**

* \`Record\<K, V\>\` → object type with keys K and values V.

* Literal-union K enforces an exact, exhaustive key set.

* \`Record\<string, V\>\` models an open dictionary.

* Adding a key to the union forces providing its value.

* Common for label maps, config tables, handler dictionaries.

**Real-World Example**

A \`Record\<Status, string\>\` mapping each order status to a display label guarantees every status has a label — so introducing a new status to the union won't compile until you add its label.

**Code — Full & Runnable**

// solution.ts — Record mapping a fixed key set to values.  
   
type Status \= "pending" | "shipped" | "delivered";  
   
const LABELS: Record\<Status, string\> \= {  
  pending: "Pending",  
  shipped: "Shipped",  
  delivered: "Delivered",  
};  
   
export function labelFor(status: Status): string {  
  return LABELS\[status\];  
}  
   
// Record as an exhaustive handler map:  
export const handlers: Record\<Status, () \=\> string\> \= {  
  pending: () \=\> "waiting",  
  shipped: () \=\> "on the way",  
  delivered: () \=\> "done",  
};

**Test / Demo & Expected Output**

// test.ts — run: npx tsx test.ts  
import { labelFor, handlers } from "./solution";  
   
console.log(labelFor("shipped"));    // Shipped  
console.log(labelFor("delivered"));  // Delivered  
console.log(handlers.pending());     // waiting  
   
console.assert(labelFor("shipped") \=== "Shipped", "record label lookup");  
console.assert(handlers.delivered() \=== "done", "record handler map");  
console.log("Record-utility assertions passed.");  
   
/\* EXPECTED OUTPUT:  
Shipped  
Delivered  
waiting  
Record-utility assertions passed.  
\*/

**Common Follow-up Questions**

**Q: How does Record enforce exhaustiveness?**

**A:** When K is a literal union, the object must include every key in the union, so adding a new member to the union causes a compile error until you provide its value.

**Q: Record\<string, V\> vs Record\<'a'|'b', V\>?**

**A:** \`Record\<string, V\>\` is an open dictionary allowing any string key; \`Record\<'a'|'b', V\>\` requires exactly keys \`a\` and \`b\`, giving exhaustive, typo-proof maps.

## **50\. Exclude\<T, U\>**

**Simple Explanation (English)**

\`Exclude\<T, U\>\` removes from union type \`T\` any members that are assignable to \`U\`, returning the remaining union. For example \`Exclude\<"a" | "b" | "c", "a"\>\` is \`"b" | "c"\`. It operates on union members, not object properties (that's \`Omit\`).

It's built with a conditional type and is handy for filtering union/literal types — e.g. removing certain statuses, or computing keys. Its counterpart is \`Extract\<T, U\>\`, which keeps only the members assignable to \`U\`.

**Hinglish Explanation**

\`Exclude\<T, U\>\` union type \`T\` se woh members hata deta hai jo \`U\` ko assignable hain, baaki union return karke. Jaise \`Exclude\<"a" | "b" | "c", "a"\>\` \`"b" | "c"\` hai. Ye union members par kaam karta hai, object properties par nahi (woh \`Omit\` hai).  
Ye ek conditional type se bana hai aur union/literal types filter karne ke liye useful hai — jaise kuch statuses hatana, ya keys compute karna. Iska counterpart \`Extract\<T, U\>\` hai, jo sirf woh members rakhta hai jo \`U\` ko assignable hain.

**Key Interview Points**

* Removes union members of T that are assignable to U.

* Operates on UNION types, not object properties (that's Omit).

* Built on a conditional type.

* Counterpart: \`Extract\<T, U\>\` keeps the matching members.

* Useful for filtering literal unions and computing key sets.

**Real-World Example**

Computing 'all roles except admin' as \`Exclude\<Role, "admin"\>\` derives a restricted role type from the full union — so adding a new role automatically flows through wherever that derived type is used.

**Code — Full & Runnable**

// solution.ts — Exclude on a union, plus a runtime filter mirroring it.  
   
export type Role \= "admin" | "editor" | "viewer";  
export type NonAdminRole \= Exclude\<Role, "admin"\>; // "editor" | "viewer"  
   
const ALL\_ROLES: Role\[\] \= \["admin", "editor", "viewer"\];  
   
// runtime function reflecting the type-level Exclude  
export function nonAdminRoles(): NonAdminRole\[\] {  
  return ALL\_ROLES.filter((r): r is NonAdminRole \=\> r \!== "admin");  
}

**Test / Demo & Expected Output**

// test.ts — run: npx tsx test.ts  
import { nonAdminRoles } from "./solution";  
   
console.log(nonAdminRoles()); // \['editor','viewer'\]  
   
console.assert(JSON.stringify(nonAdminRoles()) \=== '\["editor","viewer"\]', "admin excluded");  
console.assert(\!nonAdminRoles().includes("admin" as any), "no admin in result");  
console.log("Exclude assertions passed.");  
   
/\* EXPECTED OUTPUT:  
\[ 'editor', 'viewer' \]  
Exclude assertions passed.  
\*/

**Common Follow-up Questions**

**Q: What does Exclude\<T, U\> do?**

**A:** It removes from the union T any members assignable to U, returning the remaining union. E.g. \`Exclude\<'a'|'b'|'c', 'a'|'b'\>\` is \`'c'\`.

**Q: Exclude vs Omit?**

**A:** \`Exclude\` filters members of a union type; \`Omit\` removes properties from an object type. They operate at different levels — union members vs object keys.