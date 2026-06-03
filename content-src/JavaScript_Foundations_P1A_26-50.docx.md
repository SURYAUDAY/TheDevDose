**JavaScript Foundations**

Interview Preparation — Study Guide

Phase 1A  •  Topics 26–50

*Each topic includes: plain-English \+ Hinglish explanation, key interview points,*

*a real-world example, complete runnable code, tests with expected output, and follow-up Q\&A.*

Run any code sample with:  node filename.js  
**Contents**

# **Phase 1A — JavaScript Foundations (Topics 26–50)**

This batch covers the functional concepts, the \`this\` keyword and binding, prototypes and classes, object utilities, and the core array methods — high-frequency object-oriented and functional fundamentals in front-end and full-stack interviews.

## **26\. Pure Functions & Side Effects**

**Simple Explanation (English)**

A pure function always returns the same output for the same input and causes no side effects — it doesn't modify anything outside itself (no changing global variables, no mutating its arguments, no I/O, no DOM updates). Given the same inputs, it is perfectly predictable.

A side effect is any observable interaction with the outside world: mutating external state, logging, network calls, writing files, or changing the DOM. Pure functions are easier to test, cache (memoise), and reason about; impure code is sometimes necessary but should be isolated.

**Hinglish Explanation**

Pure function hamesha same input par same output deta hai aur koi side effect nahi karta — apne bahar ki kisi cheez ko change nahi karta (na global variable, na arguments ko mutate, na I/O, na DOM update). Same input do to result bilkul predictable.  
Side effect matlab bahar ki duniya se koi bhi observable interaction: external state badalna, logging, network call, file likhna, ya DOM change. Pure functions test karna, cache (memoise) karna aur samajhna aasaan hota hai; impure code kabhi-kabhi zaruri hota hai par use alag rakhna chahiye.

**Key Interview Points**

* Pure \= same input → same output, AND no side effects.

* Side effects: mutating external/argument state, I/O, logging, network, DOM changes.

* Pure functions are deterministic, testable, and safe to memoise/parallelise.

* Don't mutate arguments — return a new value instead.

* Real apps need side effects; keep them at the edges and keep core logic pure.

**Real-World Example**

Redux reducers must be pure: given the current state and an action they return a new state without mutating the old one. This purity is what makes time-travel debugging and predictable state updates possible.

**Code — Full & Runnable**

// Pure vs impure versions of the same task.  
   
// IMPURE: mutates the input array (side effect)  
function addItemImpure(cart, item) {  
  cart.push(item);  // mutates caller's array  
  return cart;  
}  
   
// PURE: returns a new array, original untouched  
function addItemPure(cart, item) {  
  return \[...cart, item\];  
}  
   
// PURE: deterministic, no external dependency  
function add(a, b) { return a \+ b; }  
   
module.exports \= { addItemImpure, addItemPure, add };

**Test / Demo & Expected Output**

// \--- run: node test.js \---  
const { addItemImpure, addItemPure, add } \= require("./solution");  
   
const original \= \[1, 2\];  
const pureResult \= addItemPure(original, 3);  
console.log("pure result:", pureResult);     // \[1,2,3\]  
console.log("original after pure:", original); // \[1,2\] unchanged  
   
const original2 \= \[1, 2\];  
addItemImpure(original2, 3);  
console.log("original after impure:", original2); // \[1,2,3\] mutated\!  
   
console.assert(JSON.stringify(original) \=== "\[1,2\]", "pure leaves original untouched");  
console.assert(JSON.stringify(original2) \=== "\[1,2,3\]", "impure mutated original");  
console.assert(add(2, 3\) \=== 5 && add(2, 3\) \=== 5, "pure add is deterministic");  
console.log("pure function assertions passed.");  
   
/\* EXPECTED OUTPUT:  
pure result: \[ 1, 2, 3 \]  
original after pure: \[ 1, 2 \]  
original after impure: \[ 1, 2, 3 \]  
pure function assertions passed.  
\*/

**Common Follow-up Questions**

**Q: What two conditions make a function pure?**

**A:** It returns the same output for the same input (deterministic), and it produces no side effects (doesn't mutate external state, arguments, or interact with the outside world).

**Q: Why are pure functions valuable?**

**A:** They're easy to test, can be safely cached/memoised, are predictable for debugging, and can be reordered or parallelised without changing behaviour.

## **27\. Recursion**

**Simple Explanation (English)**

Recursion is when a function calls itself to solve a problem by breaking it into smaller sub-problems. Every recursive function needs a base case (a condition that stops the recursion) and a recursive case (where it calls itself with a smaller input).

Recursion is natural for tree/graph traversal, nested data, and divide-and-conquer algorithms. The trade-off is that each call adds a stack frame, so deep recursion can overflow the call stack — sometimes an iterative version or tail-call style is preferable.

**Hinglish Explanation**

Recursion tab hota hai jab ek function khud ko call karta hai, problem ko chhote sub-problems me todkar. Har recursive function me ek base case (jo recursion rokta hai) aur ek recursive case (jisme woh chhote input ke saath khud ko call karta hai) hona chahiye.  
Recursion tree/graph traversal, nested data, aur divide-and-conquer algorithms ke liye natural hai. Trade-off: har call ek stack frame add karti hai, isliye deep recursion call stack overflow kar sakti hai — kabhi iterative version ya tail-call style behtar hota hai.

**Key Interview Points**

* Needs a base case (stop condition) and a recursive case (self-call on a smaller input).

* Without a reachable base case → infinite recursion → stack overflow.

* Ideal for trees, graphs, nested structures, and divide-and-conquer.

* Each call adds a stack frame → memory cost grows with depth.

* Many recursions can be rewritten iteratively (or with an explicit stack) for safety.

**Real-World Example**

Walking a file system or a nested comment thread: each folder/comment can contain more of the same structure, so you recurse into children until you hit leaves (files / comments with no replies).

**Code — Full & Runnable**

// Recursion examples: factorial, sum of nested array (deep traversal).  
   
function factorial(n) {  
  if (n \<= 1\) return 1;          // base case  
  return n \* factorial(n \- 1);   // recursive case  
}  
   
// Deeply sum numbers in an arbitrarily nested array.  
function deepSum(arr) {  
  let total \= 0;  
  for (const item of arr) {  
    if (Array.isArray(item)) total \+= deepSum(item); // recurse  
    else total \+= item;  
  }  
  return total;  
}  
   
// Flatten a nested object tree into a list of leaf values.  
function collectLeaves(node, acc \= \[\]) {  
  if (node && typeof node \=== "object") {  
    for (const key of Object.keys(node)) collectLeaves(node\[key\], acc);  
  } else {  
    acc.push(node);  
  }  
  return acc;  
}  
   
module.exports \= { factorial, deepSum, collectLeaves };

**Test / Demo & Expected Output**

// \--- run: node test.js \---  
const { factorial, deepSum, collectLeaves } \= require("./solution");  
   
console.log(factorial(5));                 // 120  
console.log(deepSum(\[1, \[2, \[3, 4\]\], 5\])); // 15  
console.log(collectLeaves({ a: 1, b: { c: 2, d: { e: 3 } } })); // \[1,2,3\]  
   
console.assert(factorial(5) \=== 120, "5\! \= 120");  
console.assert(deepSum(\[1, \[2, \[3, 4\]\], 5\]) \=== 15, "deep sum \= 15");  
console.assert(JSON.stringify(collectLeaves({ a: 1, b: { c: 2, d: { e: 3 } } })) \=== "\[1,2,3\]", "leaves collected");  
console.log("recursion assertions passed.");  
   
/\* EXPECTED OUTPUT:  
120  
15  
\[ 1, 2, 3 \]  
recursion assertions passed.  
\*/

**Common Follow-up Questions**

**Q: What two parts must every recursive function have?**

**A:** A base case that stops the recursion, and a recursive case that calls the function with a smaller/simpler input moving toward the base case.

**Q: What's the main risk of recursion and how do you mitigate it?**

**A:** Stack overflow from too-deep recursion. Mitigate by converting to iteration, using an explicit stack/queue, or restructuring to a tail-recursive form (where the engine supports it).

## **28\. Currying Basics**

**Simple Explanation (English)**

Currying transforms a function that takes multiple arguments into a sequence of functions that each take one argument. Instead of \`add(a, b, c)\` you call \`add(a)(b)(c)\`. Each call returns a new function waiting for the next argument until all are supplied.

Currying relies on closures (each returned function remembers the earlier arguments). It enables partial application — fixing some arguments now and supplying the rest later — which is handy for creating specialised functions and for function composition.

**Hinglish Explanation**

Currying ek multi-argument function ko aise functions ki series me badal deta hai jinme har ek sirf ek argument leta hai. \`add(a, b, c)\` ki jagah aap \`add(a)(b)(c)\` call karte ho. Har call ek naya function return karta hai jo agle argument ka intezaar karta hai jab tak sab na mil jaayein.  
Currying closures par chalta hai (har returned function pichle arguments yaad rakhta hai). Ye partial application enable karta hai — kuch arguments abhi fix karo, baaki baad me do — jo specialised functions banane aur function composition ke liye useful hai.

**Key Interview Points**

* Converts \`f(a, b, c)\` into \`f(a)(b)(c)\` — one argument at a time.

* Powered by closures: each stage remembers prior arguments.

* Enables partial application (pre-fill some args, supply the rest later).

* Useful for building specialised functions and for composition pipelines.

* A generic \`curry()\` helper can curry any fixed-arity function.

**Real-World Example**

A logger: \`const logError \= log('ERROR')\` pre-fixes the level once, then you call \`logError('disk full')\` everywhere. Currying lets you bake in the common argument and reuse the specialised function.

**Code — Full & Runnable**

// Manual currying \+ a generic curry helper.  
   
// Manual curry  
function addCurried(a) {  
  return (b) \=\> (c) \=\> a \+ b \+ c;  
}  
   
// Generic curry for any fixed-arity function  
function curry(fn) {  
  return function curried(...args) {  
    if (args.length \>= fn.length) return fn.apply(this, args);  
    return (...more) \=\> curried.apply(this, args.concat(more));  
  };  
}  
   
function volume(l, w, h) { return l \* w \* h; }  
   
module.exports \= { addCurried, curry, volume };

**Test / Demo & Expected Output**

// \--- run: node test.js \---  
const { addCurried, curry, volume } \= require("./solution");  
   
console.log(addCurried(1)(2)(3)); // 6  
   
const curriedVolume \= curry(volume);  
console.log(curriedVolume(2)(3)(4));   // 24 (one at a time)  
console.log(curriedVolume(2, 3)(4));   // 24 (mixed)  
console.log(curriedVolume(2, 3, 4));   // 24 (all at once)  
   
console.assert(addCurried(1)(2)(3) \=== 6, "manual curry");  
console.assert(curriedVolume(2)(3)(4) \=== 24, "generic curry one-by-one");  
console.assert(curriedVolume(2, 3, 4\) \=== 24, "generic curry all at once");  
console.log("currying assertions passed.");  
   
/\* EXPECTED OUTPUT:  
6  
24  
24  
24  
currying assertions passed.  
\*/

**Common Follow-up Questions**

**Q: How is currying different from partial application?**

**A:** Currying always breaks a function into a chain of single-argument functions. Partial application fixes some (possibly several) arguments and returns a function for the rest. Currying makes partial application trivial.

**Q: What language feature makes currying possible?**

**A:** Closures — each returned function retains access to the arguments captured in the previous calls until the full set is collected.

## **29\. Arrow vs Regular Functions (this binding)**

**Simple Explanation (English)**

The biggest difference is \`this\`. A regular function gets its own \`this\`, determined by how it is called (the call site). An arrow function has no own \`this\` — it lexically inherits \`this\` from the surrounding scope where it was defined.

Other differences: arrow functions have no \`arguments\` object (use rest params instead), cannot be used as constructors (no \`new\`), and have no \`prototype\`. Arrows are ideal for callbacks where you want to keep the outer \`this\`; regular functions are needed for methods and constructors.

**Hinglish Explanation**

Sabse bada farak \`this\` ka hai. Regular function ka apna \`this\` hota hai, jo is baat par depend karta hai ki use kaise call kiya gaya (call site). Arrow function ka apna \`this\` nahi hota — woh lexically surrounding scope se \`this\` inherit karta hai jahan define hua tha.  
Aur differences: arrow functions me \`arguments\` object nahi hota (rest params use karo), constructor ki tarah \`new\` se use nahi ho sakte, aur \`prototype\` nahi hota. Arrows un callbacks ke liye best hain jahan outer \`this\` chahiye; regular functions methods aur constructors ke liye zaruri hain.

**Key Interview Points**

* Regular: own \`this\` set by call site. Arrow: inherits \`this\` lexically (no own \`this\`).

* Arrow has no \`arguments\` object — use rest parameters \`(...args)\`.

* Arrow cannot be a constructor (\`new\` throws) and has no \`prototype\`.

* Arrows are great for callbacks that must keep the enclosing \`this\`.

* Use regular functions for object methods and constructors.

**Real-World Example**

Inside a class method that sets a timer, \`setTimeout(() \=\> this.tick(), 1000)\` works because the arrow keeps the class instance's \`this\`. A regular \`function(){ this.tick() }\` would lose \`this\` (it'd be undefined/global).

**Code — Full & Runnable**

// Demonstrates this-binding differences.  
   
const obj \= {  
  value: 42,  
  regular() { return this.value; },        // 'this' \= obj  
  arrow: () \=\> (typeof this),               // 'this' \= module scope, not obj  
  delayed() {  
    // arrow keeps 'this' \= obj; regular fn would lose it  
    return new Promise((resolve) \=\> {  
      setTimeout(() \=\> resolve(this.value), 0); // arrow \-\> this.value \= 42  
    });  
  },  
};  
   
function regularHasArguments() { return arguments.length; }  
const arrowUsesRest \= (...args) \=\> args.length;  
   
module.exports \= { obj, regularHasArguments, arrowUsesRest };

**Test / Demo & Expected Output**

// \--- run: node test.js \---  
const { obj, regularHasArguments, arrowUsesRest } \= require("./solution");  
   
console.log(obj.regular());          // 42  
console.log(regularHasArguments(1,2,3)); // 3  
console.log(arrowUsesRest(1,2,3,4)); // 4  
   
obj.delayed().then((v) \=\> {  
  console.log("delayed this.value:", v); // 42  
  console.assert(v \=== 42, "arrow keeps outer this");  
  console.log("arrow vs regular assertions passed.");  
});  
   
console.assert(obj.regular() \=== 42, "regular method this \= obj");  
console.assert(regularHasArguments(1,2,3) \=== 3, "regular has arguments");  
console.assert(arrowUsesRest(1,2,3,4) \=== 4, "arrow uses rest params");  
   
/\* EXPECTED OUTPUT:  
42  
3  
4  
delayed this.value: 42  
arrow vs regular assertions passed.  
\*/

**Common Follow-up Questions**

**Q: How does \`this\` differ between arrow and regular functions?**

**A:** A regular function's \`this\` is determined dynamically by the call site; an arrow function has no own \`this\` and lexically inherits it from where it was defined.

**Q: Can an arrow function be used as a constructor?**

**A:** No. Arrow functions have no \`\[\[Construct\]\]\` and no \`prototype\`, so calling them with \`new\` throws a TypeError. Use a regular function or a class instead.

## **30\. The \`this\` Keyword**

**Simple Explanation (English)**

\`this\` is a special keyword whose value depends on how a function is called, not where it's defined (except for arrow functions). There are four main binding rules in order of precedence: \`new\` binding, explicit binding (\`call\`/\`apply\`/\`bind\`), implicit binding (called as a method), and default binding (standalone call).

Default binding gives the global object in sloppy mode or \`undefined\` in strict mode. The classic bug is extracting a method into a variable and losing its \`this\`. Arrow functions sidestep all of this by inheriting \`this\` lexically.

**Hinglish Explanation**

\`this\` ek special keyword hai jiski value is baat par depend karti hai ki function kaise call hua, kahan define hua isse nahi (arrow functions ke alawa). Char main binding rules hain precedence ke order me: \`new\` binding, explicit binding (\`call\`/\`apply\`/\`bind\`), implicit binding (method ki tarah call), aur default binding (standalone call).  
Default binding sloppy mode me global object deta hai ya strict mode me \`undefined\`. Classic bug: method ko variable me nikaalna aur uska \`this\` kho dena. Arrow functions ye sab bypass kar dete hain kyunki woh \`this\` lexically inherit karte hain.

**Key Interview Points**

* \`this\` is determined by the call site (dynamic), except in arrow functions (lexical).

* Precedence: new \> explicit (call/apply/bind) \> implicit (method) \> default (standalone).

* Default binding: global object (sloppy) or \`undefined\` (strict).

* Extracting a method loses its implicit \`this\` — a very common bug.

* Arrow functions inherit \`this\` from the enclosing scope.

**Real-World Example**

Passing \`element.addEventListener('click', this.handleClick)\` from a class often breaks because \`this\` inside \`handleClick\` becomes the element. Fixing it with \`bind\` or an arrow class field (\`handleClick \= () \=\> {}\`) preserves the instance.

**Code — Full & Runnable**

// The four binding rules.  
   
function whoAmI() { return this && this.tag ? this.tag : "default"; }  
   
const objImplicit \= { tag: "implicit", whoAmI };  
   
function Person(name) { this.name \= name; } // 'new' binding  
   
module.exports \= {  
  whoAmI,  
  objImplicit,  
  // explicit binding via call  
  explicit: () \=\> whoAmI.call({ tag: "explicit" }),  
  // new binding  
  makePerson: (n) \=\> new Person(n),  
  // losing this: extracted method falls back to default  
  extracted: () \=\> { const f \= objImplicit.whoAmI; return f(); },  
};

**Test / Demo & Expected Output**

// \--- run: node test.js \---  
const m \= require("./solution");  
   
console.log("implicit:", m.objImplicit.whoAmI()); // implicit  
console.log("explicit:", m.explicit());           // explicit  
console.log("new:", m.makePerson("Asha").name);   // Asha  
console.log("extracted:", m.extracted());         // default (lost this)  
   
console.assert(m.objImplicit.whoAmI() \=== "implicit", "implicit binding");  
console.assert(m.explicit() \=== "explicit", "explicit binding via call");  
console.assert(m.makePerson("Asha").name \=== "Asha", "new binding");  
console.assert(m.extracted() \=== "default", "extracted method loses this");  
console.log("this keyword assertions passed.");  
   
/\* EXPECTED OUTPUT:  
implicit: implicit  
explicit: explicit  
new: Asha  
extracted: default  
this keyword assertions passed.  
\*/

**Common Follow-up Questions**

**Q: What are the four \`this\` binding rules in precedence order?**

**A:** new binding, then explicit binding (call/apply/bind), then implicit binding (method call), then default binding (standalone call → global or undefined in strict mode).

**Q: Why does a method lose \`this\` when assigned to a variable?**

**A:** Because \`this\` is set by the call site. Calling the extracted variable as a plain function uses default binding, not implicit binding, so it no longer points to the original object.

## **31\. bind / call / apply**

**Simple Explanation (English)**

These three methods let you explicitly control what \`this\` is inside a function. \`call\` invokes the function immediately with a given \`this\` and arguments listed individually. \`apply\` is the same but takes arguments as an array. \`bind\` does not invoke — it returns a new function permanently bound to the given \`this\`.

Mnemonic: call \= Comma-separated args, apply \= Array of args, bind \= Bound copy for later. They're essential for borrowing methods, fixing \`this\` in callbacks, and partial application via \`bind\`.

**Hinglish Explanation**

Ye teen methods aapko explicitly control dete hain ki function ke andar \`this\` kya hoga. \`call\` function ko turant call karta hai given \`this\` aur arguments alag-alag deke. \`apply\` same hai par arguments array me leta hai. \`bind\` call nahi karta — woh ek naya function return karta hai jo permanently given \`this\` se bound hota hai.  
Yaad rakhne ka tarika: call \= Comma-separated args, apply \= Array of args, bind \= Bound copy baad ke liye. Ye method borrowing, callbacks me \`this\` fix karne, aur \`bind\` se partial application ke liye zaruri hain.

**Key Interview Points**

* \`call(thisArg, a, b)\` — invoke now, args listed individually.

* \`apply(thisArg, \[a, b\])\` — invoke now, args as an array.

* \`bind(thisArg, ...presetArgs)\` — returns a new bound function (does NOT invoke).

* All three set \`this\` explicitly (explicit binding).

* Uses: method borrowing, fixing callback \`this\`, partial application with bind.

**Real-World Example**

Borrowing array methods on an array-like object: \`Array.prototype.slice.call(arguments)\` converts the old \`arguments\` object into a real array. Or \`bind\` to make an event handler that always has the right \`this\`.

**Code — Full & Runnable**

// call / apply / bind in action.  
   
function introduce(greeting, punctuation) {  
  return greeting \+ ", I'm " \+ this.name \+ punctuation;  
}  
   
const person \= { name: "Asha" };  
   
function demo() {  
  const viaCall \= introduce.call(person, "Hi", "\!");        // immediate, comma args  
  const viaApply \= introduce.apply(person, \["Hello", "."\]); // immediate, array args  
  const bound \= introduce.bind(person, "Hey");              // returns new fn  
  const viaBind \= bound("?");                               // supply rest later  
  return { viaCall, viaApply, viaBind };  
}  
   
// Method borrowing: max of an array-like using apply  
function maxOf(arrayLike) {  
  return Math.max.apply(null, Array.prototype.slice.call(arrayLike));  
}  
   
module.exports \= { demo, maxOf };

**Test / Demo & Expected Output**

// \--- run: node test.js \---  
const { demo, maxOf } \= require("./solution");  
   
console.log(demo());  
console.log("max:", maxOf({ 0: 3, 1: 9, 2: 5, length: 3 })); // 9  
   
const d \= demo();  
console.assert(d.viaCall \=== "Hi, I'm Asha\!", "call works");  
console.assert(d.viaApply \=== "Hello, I'm Asha.", "apply works");  
console.assert(d.viaBind \=== "Hey, I'm Asha?", "bind \+ later arg works");  
console.assert(maxOf({ 0: 3, 1: 9, 2: 5, length: 3 }) \=== 9, "method borrowing via apply");  
console.log("bind/call/apply assertions passed.");  
   
/\* EXPECTED OUTPUT:  
{ viaCall: "Hi, I'm Asha\!", viaApply: "Hello, I'm Asha.", viaBind: "Hey, I'm Asha?" }  
max: 9  
bind/call/apply assertions passed.  
\*/

**Common Follow-up Questions**

**Q: What's the difference between call and apply?**

**A:** Both invoke immediately with an explicit \`this\`; \`call\` takes arguments individually (comma-separated), while \`apply\` takes them as a single array.

**Q: How is bind different from call/apply?**

**A:** \`bind\` does not call the function — it returns a new function permanently bound to the given \`this\` (and optionally preset arguments), to be invoked later.

## **32\. Constructor Functions**

**Simple Explanation (English)**

Before ES6 classes, constructor functions were the way to create many similar objects. A constructor is a normal function called with the \`new\` keyword and conventionally named with a capital letter. \`new\` creates a fresh object, sets its prototype, binds \`this\` to it, runs the body, and returns the object.

Methods shared by all instances are placed on the constructor's \`prototype\` (not inside the constructor body) so they aren't duplicated per instance. ES6 \`class\` syntax is essentially syntactic sugar over this exact mechanism.

**Hinglish Explanation**

ES6 classes se pehle, constructor functions kai similar objects banane ka tarika the. Constructor ek normal function hai jo \`new\` keyword se call hota hai aur convention se capital letter se naam hota hai. \`new\` ek naya object banata hai, uska prototype set karta hai, \`this\` ko us object se bind karta hai, body chalata hai, aur object return karta hai.  
Sab instances me shared methods constructor ke \`prototype\` par rakhe jaate hain (constructor body ke andar nahi) taki har instance me duplicate na ho. ES6 \`class\` syntax basically isi mechanism ke upar syntactic sugar hai.

**Key Interview Points**

* A constructor is a function invoked with \`new\`; capitalised by convention.

* \`new\` does 4 things: creates an object, links its prototype, binds \`this\`, returns it.

* Per-instance data goes on \`this\`; shared methods go on \`Constructor.prototype\`.

* Putting methods on the prototype avoids duplicating them on every instance.

* ES6 classes are syntactic sugar over constructor functions \+ prototypes.

**Real-World Example**

A \`User(name, email)\` constructor used to spin up many user objects from API data, each with its own name/email but sharing one \`getProfile\` method on the prototype — memory-efficient when you have thousands of users.

**Code — Full & Runnable**

// Constructor function with shared prototype methods.  
   
function User(name, email) {  
  // per-instance properties  
  this.name \= name;  
  this.email \= email;  
}  
   
// shared by ALL instances (one copy)  
User.prototype.getProfile \= function () {  
  return this.name \+ " \<" \+ this.email \+ "\>";  
};  
   
module.exports \= { User };

**Test / Demo & Expected Output**

// \--- run: node test.js \---  
const { User } \= require("./solution");  
   
const a \= new User("Asha", "asha@x.com");  
const b \= new User("Ravi", "ravi@x.com");  
   
console.log(a.getProfile()); // Asha \<asha@x.com\>  
console.log(b.getProfile()); // Ravi \<ravi@x.com\>  
   
console.assert(a.getProfile() \=== "Asha \<asha@x.com\>", "instance a profile");  
console.assert(a instanceof User, "a is a User");  
// method is shared, not duplicated:  
console.assert(a.getProfile \=== b.getProfile, "method shared via prototype");  
console.assert(Object.getPrototypeOf(a) \=== User.prototype, "prototype linked");  
console.log("constructor function assertions passed.");  
   
/\* EXPECTED OUTPUT:  
Asha \<asha@x.com\>  
Ravi \<ravi@x.com\>  
constructor function assertions passed.  
\*/

**Common Follow-up Questions**

**Q: What does the \`new\` keyword do?**

**A:** It creates a new empty object, links its internal prototype to the constructor's \`prototype\`, binds \`this\` to the new object, executes the constructor body, and returns the object (unless the body returns its own object).

**Q: Why put methods on the prototype instead of inside the constructor?**

**A:** So all instances share a single copy of each method rather than each instance getting its own duplicate, which saves memory and allows runtime method changes to affect all instances.

## **33\. Prototype**

**Simple Explanation (English)**

Every JavaScript object has an internal link to another object called its prototype. When you access a property that doesn't exist on the object itself, the engine looks it up on the prototype. This is how objects inherit shared behaviour.

Functions have a \`.prototype\` property — the object that becomes the prototype of instances created with \`new\`. An object's actual prototype is accessed via \`Object.getPrototypeOf(obj)\` (or the legacy \`\_\_proto\_\_\`). Don't confuse \`Constructor.prototype\` (a property on the function) with an instance's \`\[\[Prototype\]\]\` link.

**Hinglish Explanation**

Har JavaScript object ka ek internal link hota hai doosre object se jise uska prototype kehte hain. Jab aap koi property access karte ho jo object par khud nahi hai, engine use prototype par dhoondhta hai. Aise objects shared behaviour inherit karte hain.  
Functions ke paas \`.prototype\` property hoti hai — woh object jo \`new\` se bane instances ka prototype banta hai. Object ka asli prototype \`Object.getPrototypeOf(obj)\` (ya purana \`\_\_proto\_\_\`) se milta hai. \`Constructor.prototype\` (function par property) aur instance ke \`\[\[Prototype\]\]\` link ko confuse mat karo.

**Key Interview Points**

* Every object has a hidden link to a prototype object.

* Missing properties are looked up on the prototype (delegation).

* \`Constructor.prototype\` is the object assigned as the prototype of \`new\` instances.

* Access an instance's prototype via \`Object.getPrototypeOf(obj)\` (legacy: \`\_\_proto\_\_\`).

* \`hasOwnProperty\` checks own vs inherited properties.

**Real-World Example**

All arrays share methods like \`push\`, \`map\`, and \`slice\` because they live on \`Array.prototype\`. Your array doesn't carry its own copy of \`map\` — it delegates up to the shared prototype.

**Code — Full & Runnable**

// Demonstrating prototype delegation and own vs inherited.  
   
function Animal(name) { this.name \= name; }  
Animal.prototype.speak \= function () { return this.name \+ " makes a sound"; };  
   
function inspect() {  
  const dog \= new Animal("Rex");  
  return {  
    speak: dog.speak(),                                  // inherited method  
    ownName: dog.hasOwnProperty("name"),                 // true (own)  
    ownSpeak: dog.hasOwnProperty("speak"),               // false (inherited)  
    protoIsAnimal: Object.getPrototypeOf(dog) \=== Animal.prototype,  
  };  
}  
   
module.exports \= { Animal, inspect };

**Test / Demo & Expected Output**

// \--- run: node test.js \---  
const { inspect } \= require("./solution");  
   
console.log(inspect());  
   
const r \= inspect();  
console.assert(r.speak \=== "Rex makes a sound", "inherited method works");  
console.assert(r.ownName \=== true, "name is own property");  
console.assert(r.ownSpeak \=== false, "speak is inherited, not own");  
console.assert(r.protoIsAnimal \=== true, "prototype links to Animal.prototype");  
console.log("prototype assertions passed.");  
   
/\* EXPECTED OUTPUT:  
{ speak: 'Rex makes a sound', ownName: true, ownSpeak: false, protoIsAnimal: true }  
prototype assertions passed.  
\*/

**Common Follow-up Questions**

**Q: Difference between \`Constructor.prototype\` and an instance's \`\[\[Prototype\]\]\`?**

**A:** \`Constructor.prototype\` is a property on the function object — the object that will be used as the prototype. An instance's \`\[\[Prototype\]\]\` (read via \`Object.getPrototypeOf\`) is the actual link pointing to that prototype object.

**Q: How do you check if a property is own vs inherited?**

**A:** Use \`obj.hasOwnProperty('key')\` (or \`Object.hasOwn(obj, 'key')\`), which returns true only for properties defined directly on the object, not inherited ones.

## **34\. Prototype Chain**

**Simple Explanation (English)**

The prototype chain is the series of linked prototype objects the engine walks when looking up a property. If a property isn't found on the object, it checks the object's prototype, then that prototype's prototype, and so on until it reaches \`Object.prototype\`, whose prototype is \`null\` (the end of the chain).

If the property is found, its value is returned; if the chain ends without finding it, the result is \`undefined\` (or a ReferenceError for variables). This single mechanism implements all inheritance in JavaScript.

**Hinglish Explanation**

Prototype chain woh linked prototype objects ki series hai jise engine property dhoondhte samay chalता hai. Agar property object par na mile, woh object ke prototype par dekhta hai, phir us prototype ke prototype par, aise hi \`Object.prototype\` tak jiska prototype \`null\` hota hai (chain ka end).  
Property mil gayi to value return; chain khatam ho gayi bina mile to result \`undefined\`. Yahi ek mechanism JavaScript ki saari inheritance implement karta hai.

**Key Interview Points**

* Lookup walks: object → its prototype → ... → Object.prototype → null.

* First match wins; if nothing matches, property access yields \`undefined\`.

* \`Object.prototype\` is the top; its prototype is \`null\` (chain end).

* Deeper chains mean slightly slower lookups for missing properties.

* This chain is how inheritance and method sharing actually work.

**Real-World Example**

Calling \`myArray.toString()\` walks the chain: not on the array → found on \`Array.prototype\`? no → found on \`Object.prototype\`\! That's why every object has \`toString\`, even if you never defined one.

**Code — Full & Runnable**

// Building a small chain and observing lookups.  
   
const base \= { kind: "base", describe() { return "I am " \+ this.kind; } };  
const mid \= Object.create(base);   // mid.\_\_proto\_\_ \= base  
mid.kind \= "mid";  
const leaf \= Object.create(mid);   // leaf.\_\_proto\_\_ \= mid  
   
function walk() {  
  return {  
    leafDescribe: leaf.describe(),                 // inherited from base  
    leafKind: leaf.kind,                           // mid (own of mid, inherited by leaf)  
    chainEndsAtNull: Object.getPrototypeOf(Object.prototype) \=== null,  
    arrToStringInherited: \[\].toString() \=== "",    // from Object/Array prototype  
  };  
}  
   
module.exports \= { walk };

**Test / Demo & Expected Output**

// \--- run: node test.js \---  
const { walk } \= require("./solution");  
   
console.log(walk());  
   
const r \= walk();  
console.assert(r.leafDescribe \=== "I am mid", "describe found up the chain, this.kind=mid");  
console.assert(r.leafKind \=== "mid", "kind inherited from mid");  
console.assert(r.chainEndsAtNull \=== true, "Object.prototype's prototype is null");  
console.assert(r.arrToStringInherited \=== true, "toString inherited via chain");  
console.log("prototype chain assertions passed.");  
   
/\* EXPECTED OUTPUT:  
{ leafDescribe: 'I am mid', leafKind: 'mid', chainEndsAtNull: true, arrToStringInherited: true }  
prototype chain assertions passed.  
\*/

**Common Follow-up Questions**

**Q: What is at the top of the prototype chain?**

**A:** \`Object.prototype\`. Its own prototype is \`null\`, which marks the end of the chain. If a property isn't found by then, the lookup returns \`undefined\`.

**Q: What's the performance implication of a long prototype chain?**

**A:** Property misses are slower because the engine must walk every link before concluding the property doesn't exist; keeping chains shallow helps lookup performance.

## **35\. Inheritance**

**Simple Explanation (English)**

Inheritance lets one object or class reuse properties and methods of another. In JavaScript this is achieved through the prototype chain: a child's prototype is linked to a parent's prototype, so children get the parent's shared methods automatically.

With constructor functions you set this up manually (\`Child.prototype \= Object.create(Parent.prototype)\` and call \`Parent.call(this, ...)\`). With ES6 classes you use \`extends\` and \`super\`, which does the same wiring under the hood far more cleanly.

**Hinglish Explanation**

Inheritance ek object ya class ko doosre ki properties aur methods reuse karne deta hai. JavaScript me ye prototype chain se hota hai: child ka prototype parent ke prototype se link hota hai, isliye children ko parent ke shared methods automatically mil jaate hain.  
Constructor functions me ye manually set karte ho (\`Child.prototype \= Object.create(Parent.prototype)\` aur \`Parent.call(this, ...)\`). ES6 classes me \`extends\` aur \`super\` use hota hai, jo andar se yahi wiring bohot saaf tarike se karta hai.

**Key Interview Points**

* Inheritance reuses a parent's properties/methods in a child.

* Implemented via the prototype chain (child's prototype → parent's prototype).

* Constructor style: \`Object.create(Parent.prototype)\` \+ \`Parent.call(this, ...)\`.

* Class style: \`class Child extends Parent\` \+ \`super(...)\`.

* Children can override parent methods; \`super.method()\` calls the parent version.

**Real-World Example**

A \`Manager\` extends \`Employee\`: it inherits \`getSalary()\` and adds \`approveLeave()\`. You reuse all the common employee behaviour and only write what's special about managers.

**Code — Full & Runnable**

// Inheritance with ES6 classes (extends \+ super) and method override.  
   
class Employee {  
  constructor(name, salary) { this.name \= name; this.salary \= salary; }  
  describe() { return this.name \+ " earns " \+ this.salary; }  
}  
   
class Manager extends Employee {  
  constructor(name, salary, team) {  
    super(name, salary);   // call parent constructor  
    this.team \= team;  
  }  
  // override \+ extend parent behaviour  
  describe() { return super.describe() \+ ", leads " \+ this.team; }  
  approve() { return this.name \+ " approved the request"; }  
}  
   
module.exports \= { Employee, Manager };

**Test / Demo & Expected Output**

// \--- run: node test.js \---  
const { Employee, Manager } \= require("./solution");  
   
const e \= new Employee("Asha", 5000);  
const m \= new Manager("Ravi", 9000, "Platform");  
   
console.log(e.describe());  // Asha earns 5000  
console.log(m.describe());  // Ravi earns 9000, leads Platform  
console.log(m.approve());   // Ravi approved the request  
   
console.assert(e.describe() \=== "Asha earns 5000", "parent method");  
console.assert(m.describe() \=== "Ravi earns 9000, leads Platform", "override \+ super");  
console.assert(m instanceof Employee, "Manager is also an Employee");  
console.assert(typeof m.approve \=== "function", "child-only method");  
console.log("inheritance assertions passed.");  
   
/\* EXPECTED OUTPUT:  
Asha earns 5000  
Ravi earns 9000, leads Platform  
Ravi approved the request  
inheritance assertions passed.  
\*/

**Common Follow-up Questions**

**Q: What does \`super\` do?**

**A:** In a constructor, \`super(...)\` calls the parent constructor (required before using \`this\`). In a method, \`super.method()\` calls the parent's version of an overridden method.

**Q: How is class inheritance related to prototypes?**

**A:** \`extends\` sets up the same prototype chain you'd build manually with constructor functions — the child's prototype is linked to the parent's prototype — so it's prototype-based inheritance with cleaner syntax.

## **36\. Classes**

**Simple Explanation (English)**

ES6 classes provide a clean, familiar syntax for creating objects and handling inheritance. A class has a \`constructor\` for initialisation, instance methods (placed on the prototype), static methods (called on the class itself), and can use \`extends\`/\`super\` for inheritance.

Classes are syntactic sugar over prototypes — not a new object model. They also bring features like private fields (\`\#field\`), getters/setters, and static blocks. Class bodies always run in strict mode and class declarations are not hoisted for use before definition (TDZ-like).

**Hinglish Explanation**

ES6 classes objects banane aur inheritance handle karne ka ek saaf, jaana-pehchana syntax dete hain. Class me initialisation ke liye \`constructor\`, instance methods (prototype par), static methods (class par hi call), aur inheritance ke liye \`extends\`/\`super\` hote hain.  
Classes prototypes ke upar syntactic sugar hain — koi naya object model nahi. Inme private fields (\`\#field\`), getters/setters, aur static blocks jaise features bhi hain. Class body hamesha strict mode me chalti hai aur class declarations definition se pehle use ke liye hoist nahi hote (TDZ-jaisa).

**Key Interview Points**

* \`constructor\` initialises instances; methods go on the prototype automatically.

* \`static\` members belong to the class, not instances.

* Private fields use \`\#name\` and are inaccessible outside the class.

* Classes are sugar over prototypes; class body is strict mode by default.

* Class declarations are in a TDZ — not usable before their definition line.

**Real-World Example**

A \`BankAccount\` class with a private \`\#balance\` field exposes \`deposit\`/\`withdraw\` methods and a \`static fromJSON()\` factory — encapsulating data and behaviour the way most modern codebases structure domain models.

**Code — Full & Runnable**

// A class with private field, getter, static method, and instance methods.  
   
class BankAccount {  
  \#balance;                       // private field  
  constructor(initial \= 0\) { this.\#balance \= initial; }  
   
  deposit(amt) { this.\#balance \+= amt; return this; } // chainable  
  withdraw(amt) {  
    if (amt \> this.\#balance) throw new Error("Insufficient");  
    this.\#balance \-= amt; return this;  
  }  
  get balance() { return this.\#balance; }            // getter  
   
  static fromJSON(json) { return new BankAccount(JSON.parse(json).balance); }  
}  
   
module.exports \= { BankAccount };

**Test / Demo & Expected Output**

// \--- run: node test.js \---  
const { BankAccount } \= require("./solution");  
   
const acc \= new BankAccount(100);  
acc.deposit(50).withdraw(30);     // chaining  
console.log("balance:", acc.balance); // 120  
   
const restored \= BankAccount.fromJSON('{"balance": 999}');  
console.log("restored:", restored.balance); // 999  
   
console.assert(acc.balance \=== 120, "deposit/withdraw chain");  
console.assert(restored.balance \=== 999, "static factory works");  
console.assert(acc\["\#balance"\] \=== undefined, "private field not accessible by string");  
let threw \= false; try { acc.withdraw(99999); } catch { threw \= true; }  
console.assert(threw, "overdraw throws");  
console.log("classes assertions passed.");  
   
/\* EXPECTED OUTPUT:  
balance: 120  
restored: 999  
classes assertions passed.  
\*/

**Common Follow-up Questions**

**Q: Are JavaScript classes a different model from prototypes?**

**A:** No. Classes are syntactic sugar over prototype-based inheritance. Methods still live on the prototype; \`extends\` still builds a prototype chain.

**Q: How do you make a class member truly private?**

**A:** Use a private field with the \`\#\` prefix (e.g. \`\#balance\`). It's only accessible inside the class body and cannot be read or written from outside.

## **37\. Getters & Setters**

**Simple Explanation (English)**

Getters and setters are special methods that let you access and assign a property using normal property syntax while actually running code behind the scenes. A getter (\`get x()\`) runs when you read \`obj.x\`; a setter (\`set x(value)\`) runs when you assign \`obj.x \= value\`.

They're useful for computed properties, validation on assignment, and keeping a clean API while hiding internal representation. The caller writes \`obj.fullName\` instead of \`obj.getFullName()\`, but you still control the logic.

**Hinglish Explanation**

Getters aur setters special methods hain jo aapko normal property syntax se property access/assign karne dete hain jabki andar code chalta hai. Getter (\`get x()\`) tab chalta hai jab aap \`obj.x\` padhte ho; setter (\`set x(value)\`) tab jab \`obj.x \= value\` assign karte ho.  
Ye computed properties, assignment par validation, aur internal representation chhupa kar saaf API rakhne ke liye useful hain. Caller \`obj.getFullName()\` ki jagah \`obj.fullName\` likhta hai, par logic aapke control me rehta hai.

**Key Interview Points**

* \`get prop()\` runs on read; \`set prop(v)\` runs on assignment.

* Accessed with normal property syntax (no parentheses).

* Great for computed/derived values and validation on set.

* Often paired with a backing private field (\`\#value\`).

* A getter without a setter makes a read-only property.

**Real-World Example**

A \`temperature\` object exposing \`.celsius\` and \`.fahrenheit\` as getters/setters: setting one automatically keeps the other consistent, so the rest of the app reads either unit without conversion code scattered everywhere.

**Code — Full & Runnable**

// Getter/setter with validation and a computed property.  
   
class Temperature {  
  \#c \= 0;  
  get celsius() { return this.\#c; }  
  set celsius(value) {  
    if (typeof value \!== "number") throw new Error("number required");  
    this.\#c \= value;  
  }  
  get fahrenheit() { return this.\#c \* 9 / 5 \+ 32; }   // computed  
  set fahrenheit(f) { this.\#c \= (f \- 32\) \* 5 / 9; }  
}  
   
module.exports \= { Temperature };

**Test / Demo & Expected Output**

// \--- run: node test.js \---  
const { Temperature } \= require("./solution");  
   
const t \= new Temperature();  
t.celsius \= 25;  
console.log("F:", t.fahrenheit); // 77  
t.fahrenheit \= 212;  
console.log("C:", t.celsius);    // 100  
   
console.assert(t.celsius \=== 100, "fahrenheit setter updates celsius");  
console.assert(new Temperature().fahrenheit \=== 32, "0C \= 32F via getter");  
let threw \= false; try { t.celsius \= "hot"; } catch { threw \= true; }  
console.assert(threw, "setter validates type");  
console.log("getter/setter assertions passed.");  
   
/\* EXPECTED OUTPUT:  
F: 77  
C: 100  
getter/setter assertions passed.  
\*/

**Common Follow-up Questions**

**Q: How do you call a getter?**

**A:** With normal property-access syntax and no parentheses: \`obj.fullName\`. The getter function runs automatically and returns the value.

**Q: How do you create a read-only property?**

**A:** Define a getter without a corresponding setter. Reads work; assignments are ignored in sloppy mode or throw in strict mode.

## **38\. Object.keys / values / entries**

**Simple Explanation (English)**

These three static methods extract data from an object's own enumerable string-keyed properties. \`Object.keys(obj)\` returns an array of keys, \`Object.values(obj)\` returns an array of values, and \`Object.entries(obj)\` returns an array of \`\[key, value\]\` pairs.

They're the standard way to iterate over an object (objects aren't directly iterable with \`for...of\`). \`Object.entries\` pairs beautifully with destructuring and with \`Object.fromEntries\` to transform objects functionally.

**Hinglish Explanation**

Ye teen static methods object ki own enumerable string-keyed properties se data nikaalte hain. \`Object.keys(obj)\` keys ka array deta hai, \`Object.values(obj)\` values ka array, aur \`Object.entries(obj)\` \`\[key, value\]\` pairs ka array.  
Object par iterate karne ka standard tarika yahi hai (objects seedhe \`for...of\` se iterable nahi). \`Object.entries\` destructuring aur \`Object.fromEntries\` ke saath bahut achha chalta hai objects ko functionally transform karne ke liye.

**Key Interview Points**

* \`Object.keys\` → array of own enumerable keys.

* \`Object.values\` → array of corresponding values.

* \`Object.entries\` → array of \`\[key, value\]\` pairs.

* Only own, enumerable, string keys (not inherited, not symbols).

* Combine with \`Object.fromEntries\` to map/filter objects functionally.

**Real-World Example**

Turning a settings object into query parameters, or summing values in a totals map: \`Object.values(scores).reduce((a,b)=\>a+b,0)\` totals every score without writing a manual loop.

**Code — Full & Runnable**

// Iterating and transforming objects.  
   
function summarise(scores) {  
  const keys \= Object.keys(scores);  
  const total \= Object.values(scores).reduce((a, b) \=\> a \+ b, 0);  
  const labelled \= Object.entries(scores).map((\[k, v\]) \=\> k \+ "=" \+ v);  
  return { keys, total, labelled };  
}  
   
// Transform an object: double every value via entries \+ fromEntries  
function doubleValues(obj) {  
  return Object.fromEntries(  
    Object.entries(obj).map((\[k, v\]) \=\> \[k, v \* 2\])  
  );  
}  
   
module.exports \= { summarise, doubleValues };

**Test / Demo & Expected Output**

// \--- run: node test.js \---  
const { summarise, doubleValues } \= require("./solution");  
   
const scores \= { math: 90, science: 80, art: 70 };  
console.log(summarise(scores));  
console.log(doubleValues({ a: 1, b: 2 }));  
   
const s \= summarise(scores);  
console.assert(JSON.stringify(s.keys) \=== '\["math","science","art"\]', "keys");  
console.assert(s.total \=== 240, "values sum");  
console.assert(JSON.stringify(s.labelled) \=== '\["math=90","science=80","art=70"\]', "entries");  
console.assert(JSON.stringify(doubleValues({ a: 1, b: 2 })) \=== '{"a":2,"b":4}', "fromEntries transform");  
console.log("Object.keys/values/entries assertions passed.");  
   
/\* EXPECTED OUTPUT:  
{ keys: \[ 'math', 'science', 'art' \], total: 240, labelled: \[ 'math=90', 'science=80', 'art=70' \] }  
{ a: 2, b: 4 }  
Object.keys/values/entries assertions passed.  
\*/

**Common Follow-up Questions**

**Q: Do these methods include inherited properties?**

**A:** No. They only return an object's own enumerable string-keyed properties — not inherited ones and not symbol keys.

**Q: How do you rebuild an object after transforming entries?**

**A:** Use \`Object.fromEntries(arrayOfPairs)\`, the inverse of \`Object.entries\`, to convert \`\[key, value\]\` pairs back into an object.

## **39\. Object.assign()**

**Simple Explanation (English)**

\`Object.assign(target, ...sources)\` copies the own enumerable properties from one or more source objects into a target object, and returns the target. Later sources overwrite earlier ones for matching keys. It's commonly used to merge objects or to clone a shallow copy.

Important: the copy is shallow — nested objects are copied by reference, not deeply. The modern spread syntax \`{ ...a, ...b }\` does the same merge in most cases and is often preferred for readability.

**Hinglish Explanation**

\`Object.assign(target, ...sources)\` ek ya zyada source objects ki own enumerable properties target object me copy karta hai aur target return karta hai. Same keys ke liye baad wale sources pehle wale ko overwrite kar dete hain. Iska use objects merge karne ya shallow clone banane me hota hai.  
Important: copy shallow hoti hai — nested objects reference se copy hote hain, deeply nahi. Modern spread syntax \`{ ...a, ...b }\` zyadatar cases me yahi merge karta hai aur readability ke liye aksar preferred hai.

**Key Interview Points**

* \`Object.assign(target, ...sources)\` merges sources into target and returns target.

* Later sources overwrite earlier ones on key conflicts.

* Performs a SHALLOW copy — nested objects are shared by reference.

* Mutates the target; pass \`{}\` as target to avoid mutating originals.

* Spread \`{ ...a, ...b }\` is an equivalent, often clearer, alternative.

**Real-World Example**

Applying default options: \`const opts \= Object.assign({}, defaults, userOptions)\` produces a merged config where the user's values win, without mutating either the defaults or the user's object.

**Code — Full & Runnable**

// Merging with defaults and showing shallow-copy behaviour.  
   
function withDefaults(defaults, userOptions) {  
  return Object.assign({}, defaults, userOptions); // user wins, originals safe  
}  
   
function shallowCopyCaveat() {  
  const source \= { nested: { x: 1 } };  
  const copy \= Object.assign({}, source);  
  copy.nested.x \= 99;             // mutates shared nested object\!  
  return { sourceX: source.nested.x, sharedRef: source.nested \=== copy.nested };  
}  
   
module.exports \= { withDefaults, shallowCopyCaveat };

**Test / Demo & Expected Output**

// \--- run: node test.js \---  
const { withDefaults, shallowCopyCaveat } \= require("./solution");  
   
console.log(withDefaults({ color: "red", size: "M" }, { size: "L" }));  
console.log(shallowCopyCaveat());  
   
const merged \= withDefaults({ color: "red", size: "M" }, { size: "L" });  
console.assert(merged.color \=== "red" && merged.size \=== "L", "user options win");  
const s \= shallowCopyCaveat();  
console.assert(s.sourceX \=== 99, "nested mutated (shallow copy)");  
console.assert(s.sharedRef \=== true, "nested objects shared by reference");  
console.log("Object.assign assertions passed.");  
   
/\* EXPECTED OUTPUT:  
{ color: 'red', size: 'L' }  
{ sourceX: 99, sharedRef: true }  
Object.assign assertions passed.  
\*/

**Common Follow-up Questions**

**Q: Is Object.assign a deep or shallow copy?**

**A:** Shallow. Top-level properties are copied, but nested objects/arrays are copied by reference, so mutating a nested value affects both the source and the copy.

**Q: How does spread \`{...a, ...b}\` compare to Object.assign?**

**A:** For merging plain objects they're largely equivalent (both shallow). Spread creates a new object literal (doesn't mutate a target) and is often more readable; Object.assign can mutate an existing target and invokes setters on the target.

## **40\. Object.freeze / seal**

**Simple Explanation (English)**

\`Object.freeze(obj)\` makes an object fully immutable at the top level: you cannot add, delete, or change its properties. \`Object.seal(obj)\` is less strict: you cannot add or delete properties, but you can still modify existing ones.

Both are shallow — nested objects remain mutable unless you freeze them too (a 'deep freeze' requires recursion). Use \`Object.isFrozen\` / \`Object.isSealed\` to check. In strict mode, illegal writes throw; in sloppy mode they fail silently.

**Hinglish Explanation**

\`Object.freeze(obj)\` object ko top level par poori tarah immutable bana deta hai: na property add, na delete, na change. \`Object.seal(obj)\` kam strict hai: add/delete nahi kar sakte, par existing properties modify kar sakte ho.  
Dono shallow hain — nested objects mutable rehte hain jab tak unhe bhi freeze na karo ('deep freeze' ke liye recursion chahiye). Check karne ke liye \`Object.isFrozen\` / \`Object.isSealed\` use karo. Strict mode me illegal writes error dete hain; sloppy mode me silently fail.

**Key Interview Points**

* \`freeze\`: no add, no delete, no modify (fully locked at top level).

* \`seal\`: no add, no delete, but existing values CAN be changed.

* Both are shallow — nested objects stay mutable.

* Check with \`Object.isFrozen\` / \`Object.isSealed\`.

* Strict mode throws on violations; sloppy mode fails silently.

**Real-World Example**

Freezing a configuration or a constants object so no part of the codebase can accidentally mutate shared settings at runtime — turning a whole category of subtle bugs into immediate errors.

**Code — Full & Runnable**

"use strict";  
// freeze vs seal behaviour.  
   
function freezeDemo() {  
  const cfg \= Object.freeze({ apiUrl: "/api", retries: 3 });  
  let changed \= false;  
  try { cfg.retries \= 5; } catch { /\* throws in strict \*/ }  
  changed \= cfg.retries; // still 3  
  return { value: changed, isFrozen: Object.isFrozen(cfg) };  
}  
   
function sealDemo() {  
  const o \= Object.seal({ a: 1 });  
  o.a \= 2;          // allowed: modify existing  
  let added \= false;  
  try { o.b \= 9; } catch { added \= false; }  
  return { a: o.a, hasB: "b" in o, isSealed: Object.isSealed(o) };  
}  
   
module.exports \= { freezeDemo, sealDemo };

**Test / Demo & Expected Output**

// \--- run: node test.js \---  
const { freezeDemo, sealDemo } \= require("./solution");  
   
console.log(freezeDemo());  
console.log(sealDemo());  
   
const f \= freezeDemo();  
console.assert(f.value \=== 3, "frozen value unchanged");  
console.assert(f.isFrozen \=== true, "object is frozen");  
const s \= sealDemo();  
console.assert(s.a \=== 2, "sealed object allows modifying existing");  
console.assert(s.hasB \=== false, "sealed object disallows new properties");  
console.assert(s.isSealed \=== true, "object is sealed");  
console.log("freeze/seal assertions passed.");  
   
/\* EXPECTED OUTPUT:  
{ value: 3, isFrozen: true }  
{ a: 2, hasB: false, isSealed: true }  
freeze/seal assertions passed.  
\*/

**Common Follow-up Questions**

**Q: Difference between freeze and seal?**

**A:** Both prevent adding/removing properties. \`freeze\` also prevents modifying existing values (fully immutable top level); \`seal\` still allows modifying existing values.

**Q: Does Object.freeze deeply freeze nested objects?**

**A:** No, it's shallow. Nested objects remain mutable. For deep immutability you must recursively freeze every nested object (a 'deep freeze').

## **41\. Array.map()**

**Simple Explanation (English)**

\`map\` creates a new array by applying a transformation function to every element of the original array. It does not mutate the original — it returns a same-length array of transformed values. The callback receives the element, index, and the whole array.

Use \`map\` when you want to transform each item into something else (e.g. objects → names, numbers → squares). If you don't need the returned array, use \`forEach\` instead; if you want to keep only some items, use \`filter\`.

**Hinglish Explanation**

\`map\` har element par ek transformation function laga kar ek naya array banata hai. Ye original ko mutate nahi karta — same-length transformed values ka array return karta hai. Callback ko element, index, aur poora array milta hai.  
\`map\` tab use karo jab har item ko kisi aur cheez me transform karna ho (jaise objects → names, numbers → squares). Agar returned array nahi chahiye to \`forEach\` use karo; agar sirf kuch items rakhne hain to \`filter\`.

**Key Interview Points**

* Returns a NEW array of the same length with each item transformed.

* Does not mutate the original array.

* Callback signature: \`(element, index, array)\`.

* Use for one-to-one transformations; chain with filter/reduce.

* Always return a value from the callback (forgetting to is a common bug → undefined items).

**Real-World Example**

Rendering a list in React: \`users.map(u \=\> \<li key={u.id}\>{u.name}\</li\>)\` transforms each data object into a UI element — \`map\` is the workhorse of list rendering.

**Code — Full & Runnable**

// map transformations (non-mutating).  
   
function squares(nums) {  
  return nums.map((n) \=\> n \* n);  
}  
   
function userNames(users) {  
  return users.map((u) \=\> u.name);  
}  
   
function withIndex(items) {  
  return items.map((item, i) \=\> i \+ ": " \+ item);  
}  
   
module.exports \= { squares, userNames, withIndex };

**Test / Demo & Expected Output**

// \--- run: node test.js \---  
const { squares, userNames, withIndex } \= require("./solution");  
   
const original \= \[1, 2, 3\];  
console.log(squares(original));   // \[1,4,9\]  
console.log("original:", original); // unchanged  
console.log(userNames(\[{ name: "Asha" }, { name: "Ravi" }\])); // \['Asha','Ravi'\]  
console.log(withIndex(\["a", "b"\])); // \['0: a','1: b'\]  
   
console.assert(JSON.stringify(squares(\[1,2,3\])) \=== "\[1,4,9\]", "squares");  
console.assert(JSON.stringify(original) \=== "\[1,2,3\]", "map does not mutate");  
console.assert(JSON.stringify(userNames(\[{name:"Asha"}\])) \=== '\["Asha"\]', "extract names");  
console.log("map assertions passed.");  
   
/\* EXPECTED OUTPUT:  
\[ 1, 4, 9 \]  
original: \[ 1, 2, 3 \]  
\[ 'Asha', 'Ravi' \]  
\[ '0: a', '1: b' \]  
map assertions passed.  
\*/

**Common Follow-up Questions**

**Q: How is map different from forEach?**

**A:** \`map\` returns a new transformed array and is for producing data; \`forEach\` returns undefined and is for side effects (it can't be chained).

**Q: Does map change the original array?**

**A:** No. \`map\` is non-mutating — it returns a new array. The original is left intact unless your callback itself mutates objects by reference.

## **42\. Array.filter()**

**Simple Explanation (English)**

\`filter\` creates a new array containing only the elements for which the callback returns a truthy value. It's used to keep a subset of items that match a condition, leaving the original array unchanged.

The callback is a predicate (returns true/false) and receives \`(element, index, array)\`. The result length is between 0 and the original length. Combine \`filter\` with \`map\` and \`reduce\` to build expressive data pipelines.

**Hinglish Explanation**

\`filter\` ek naya array banata hai jisme sirf woh elements hote hain jinke liye callback truthy value return karta hai. Ye condition se match karne wale items ka subset rakhne ke liye use hota hai, original array bina change kiye.  
Callback ek predicate hota hai (true/false return karta hai) aur use \`(element, index, array)\` milta hai. Result length 0 se original length ke beech hoti hai. \`filter\` ko \`map\` aur \`reduce\` ke saath mila kar expressive data pipelines banao.

**Key Interview Points**

* Returns a NEW array of items where the predicate returns truthy.

* Non-mutating; result length ranges from 0 to original length.

* Predicate signature: \`(element, index, array)\`.

* Use to keep matching items; pairs naturally with map/reduce.

* Returning a non-boolean works via truthiness, but a clear boolean is best.

**Real-World Example**

A product search showing only in-stock items under a price cap: \`products.filter(p \=\> p.inStock && p.price \<= max)\` produces exactly the list to display.

**Code — Full & Runnable**

// filter to subset data.  
   
function evens(nums) {  
  return nums.filter((n) \=\> n % 2 \=== 0);  
}  
   
function inStockUnder(products, max) {  
  return products.filter((p) \=\> p.inStock && p.price \<= max);  
}  
   
function removeFalsy(arr) {  
  return arr.filter(Boolean); // drops 0, '', null, undefined, NaN, false  
}  
   
module.exports \= { evens, inStockUnder, removeFalsy };

**Test / Demo & Expected Output**

// \--- run: node test.js \---  
const { evens, inStockUnder, removeFalsy } \= require("./solution");  
   
console.log(evens(\[1, 2, 3, 4, 5, 6\])); // \[2,4,6\]  
const products \= \[  
  { name: "A", price: 10, inStock: true },  
  { name: "B", price: 50, inStock: true },  
  { name: "C", price: 10, inStock: false },  
\];  
console.log(inStockUnder(products, 20).map((p) \=\> p.name)); // \['A'\]  
console.log(removeFalsy(\[0, "x", "", 3, null, NaN, "y"\])); // \['x',3,'y'\]  
   
console.assert(JSON.stringify(evens(\[1,2,3,4\])) \=== "\[2,4\]", "evens");  
console.assert(inStockUnder(products, 20).length \=== 1, "one product matches");  
console.assert(JSON.stringify(removeFalsy(\[0,"x","",3\])) \=== '\["x",3\]', "falsy removed");  
console.log("filter assertions passed.");  
   
/\* EXPECTED OUTPUT:  
\[ 2, 4, 6 \]  
\[ 'A' \]  
\[ 'x', 3, 'y' \]  
filter assertions passed.  
\*/

**Common Follow-up Questions**

**Q: What determines whether an element is kept by filter?**

**A:** Whether the callback returns a truthy value for it. Truthy → kept; falsy → discarded. The original array is not modified.

**Q: How would you get both matching and non-matching groups?**

**A:** Either call filter twice with opposite conditions, or use \`reduce\` to partition into two arrays in a single pass for efficiency.

## **43\. Array.reduce()**

**Simple Explanation (English)**

\`reduce\` boils an array down to a single value by repeatedly applying a reducer function that accumulates a result. The reducer receives an accumulator and the current element: \`(acc, cur) \=\> newAcc\`. You supply an initial value for the accumulator as the second argument.

It's the most powerful and general array method — sums, products, grouping, counting, flattening, and even re-implementing map/filter can all be done with reduce. Always provide the initial value to avoid surprises on empty arrays.

**Hinglish Explanation**

\`reduce\` ek array ko baar-baar ek reducer function laga kar ek single value me samet deta hai jo result accumulate karta hai. Reducer ko accumulator aur current element milta hai: \`(acc, cur) \=\> newAcc\`. Accumulator ki initial value second argument me deni hoti hai.  
Ye sabse powerful aur general array method hai — sums, products, grouping, counting, flattening, yahan tak ki map/filter dobara banana bhi reduce se ho sakta hai. Empty arrays par surprises se bachne ke liye hamesha initial value do.

**Key Interview Points**

* Reduces an array to one value via \`(accumulator, current) \=\> newAccumulator\`.

* Second argument is the initial accumulator value — always provide it.

* Use for sums, products, counts, grouping, flattening, building objects.

* Can re-implement map and filter; it's the general-purpose iterator.

* Without an initial value, reduce uses the first element and can throw on empty arrays.

**Real-World Example**

Computing a shopping-cart total, or grouping orders by status into an object — \`orders.reduce((acc, o) \=\> { (acc\[o.status\] ??= \[\]).push(o); return acc; }, {})\` builds a grouped report in one pass.

**Code — Full & Runnable**

// reduce: sum, group-by, and count.  
   
function sum(nums) {  
  return nums.reduce((acc, n) \=\> acc \+ n, 0);  
}  
   
function groupByStatus(orders) {  
  return orders.reduce((acc, o) \=\> {  
    (acc\[o.status\] \= acc\[o.status\] || \[\]).push(o.id);  
    return acc;  
  }, {});  
}  
   
function countWords(words) {  
  return words.reduce((acc, w) \=\> {  
    acc\[w\] \= (acc\[w\] || 0\) \+ 1;  
    return acc;  
  }, {});  
}  
   
module.exports \= { sum, groupByStatus, countWords };

**Test / Demo & Expected Output**

// \--- run: node test.js \---  
const { sum, groupByStatus, countWords } \= require("./solution");  
   
console.log(sum(\[10, 20, 30\])); // 60  
console.log(groupByStatus(\[  
  { id: 1, status: "paid" }, { id: 2, status: "pending" }, { id: 3, status: "paid" },  
\]));  
console.log(countWords(\["a", "b", "a", "a", "b"\]));  
   
console.assert(sum(\[10,20,30\]) \=== 60, "sum");  
const g \= groupByStatus(\[{id:1,status:"paid"},{id:2,status:"pending"},{id:3,status:"paid"}\]);  
console.assert(JSON.stringify(g.paid) \=== "\[1,3\]", "group paid ids");  
console.assert(countWords(\["a","b","a"\]).a \=== 2, "count a=2");  
console.log("reduce assertions passed.");  
   
/\* EXPECTED OUTPUT:  
60  
{ paid: \[ 1, 3 \], pending: \[ 2 \] }  
{ a: 3, b: 2 }  
reduce assertions passed.  
\*/

**Common Follow-up Questions**

**Q: Why should you always pass an initial value to reduce?**

**A:** It defines the accumulator's starting type/value and prevents errors on empty arrays. Without it, reduce uses the first element as the seed, which can produce wrong types or throw on an empty array.

**Q: Can reduce replace map and filter?**

**A:** Yes — reduce is general enough to implement both (and more), since you fully control how the accumulator is built. map/filter are just clearer for their specific jobs.

## **44\. Array.forEach()**

**Simple Explanation (English)**

\`forEach\` runs a callback once for each element of an array, in order. It's used purely for side effects (logging, updating external state, DOM operations) — it always returns \`undefined\` and produces no new array.

Unlike \`map\`/\`filter\`, it cannot be chained. You also cannot \`break\` or \`return\` out of a \`forEach\` early; if you need that, use a \`for...of\` loop or array methods like \`some\`/\`every\`/\`find\`.

**Hinglish Explanation**

\`forEach\` array ke har element ke liye ek callback ek baar order me chalata hai. Ye sirf side effects ke liye use hota hai (logging, external state update, DOM operations) — hamesha \`undefined\` return karta hai aur koi naya array nahi banata.  
\`map\`/\`filter\` ke विपरीत ise chain nahi kar sakte. \`forEach\` se early \`break\`/\`return\` bhi nahi kar sakte; agar woh chahiye to \`for...of\` loop ya \`some\`/\`every\`/\`find\` jaise methods use karo.

**Key Interview Points**

* Runs a callback for each element; returns \`undefined\`.

* For side effects only — not for producing a new array.

* Cannot be chained (returns undefined).

* Cannot break/return early — use for...of or some/every/find for that.

* Skips empty slots in sparse arrays.

**Real-World Example**

Iterating over form fields to attach event listeners, or logging each item in a batch job — anywhere you act on each element but don't need a transformed result back.

**Code — Full & Runnable**

// forEach for side effects (accumulating into external state).  
   
function collectLog(items) {  
  const log \= \[\];  
  items.forEach((item, i) \=\> {  
    log.push("\[" \+ i \+ "\] " \+ item);  
  });  
  return log; // forEach itself returns undefined; we built 'log' externally  
}  
   
function forEachReturnsUndefined(arr) {  
  return arr.forEach((x) \=\> x); // undefined  
}  
   
module.exports \= { collectLog, forEachReturnsUndefined };

**Test / Demo & Expected Output**

// \--- run: node test.js \---  
const { collectLog, forEachReturnsUndefined } \= require("./solution");  
   
console.log(collectLog(\["save", "send"\]));            // \['\[0\] save','\[1\] send'\]  
console.log("returns:", forEachReturnsUndefined(\[1\])); // undefined  
   
console.assert(JSON.stringify(collectLog(\["a","b"\])) \=== '\["\[0\] a","\[1\] b"\]', "forEach side effect");  
console.assert(forEachReturnsUndefined(\[1,2,3\]) \=== undefined, "forEach returns undefined");  
console.log("forEach assertions passed.");  
   
/\* EXPECTED OUTPUT:  
\[ '\[0\] save', '\[1\] send' \]  
returns: undefined  
forEach assertions passed.  
\*/

**Common Follow-up Questions**

**Q: Can you break out of a forEach?**

**A:** No. \`forEach\` always iterates the entire array; \`break\`/\`continue\` don't apply and \`return\` only exits the current callback. Use \`for...of\` or \`some\`/\`every\`/\`find\` when you need early exit.

**Q: When should you choose forEach over map?**

**A:** When you only need side effects and don't want a returned array. If you need a transformed array (or want to chain), use map.

## **45\. Array.find() / findIndex()**

**Simple Explanation (English)**

\`find\` returns the first element for which the callback returns truthy, or \`undefined\` if none match. \`findIndex\` returns the index of that first match, or \`-1\` if none match. Both stop iterating as soon as a match is found (short-circuit).

Use \`find\` when you want the matching item itself, and \`findIndex\` when you need its position (e.g. to update or remove it). They differ from \`filter\` (which returns all matches as an array) and from \`indexOf\` (which matches by value, not a predicate).

**Hinglish Explanation**

\`find\` pehla element return karta hai jiske liye callback truthy ho, ya koi na mile to \`undefined\`. \`findIndex\` us pehle match ka index return karta hai, ya na mile to \`-1\`. Dono match milte hi iterate karna rok dete hain (short-circuit).  
\`find\` tab use karo jab matching item chahiye, aur \`findIndex\` jab uski position chahiye (jaise update ya remove karne ke liye). Ye \`filter\` (jo saare matches array me deta hai) aur \`indexOf\` (jo value se match karta hai, predicate se nahi) se alag hain.

**Key Interview Points**

* \`find\` → first matching element, or \`undefined\`.

* \`findIndex\` → index of first match, or \`-1\`.

* Both short-circuit on the first match.

* Predicate signature: \`(element, index, array)\`.

* Use find/findIndex for predicate matching; indexOf for value matching.

**Real-World Example**

Looking up a user by id in an array from an API: \`users.find(u \=\> u.id \=== targetId)\` returns the user object, or \`findIndex\` to locate the slot you need to splice/update.

**Code — Full & Runnable**

// find vs findIndex.  
   
function findUser(users, id) {  
  return users.find((u) \=\> u.id \=== id);    // object or undefined  
}  
   
function indexOfUser(users, id) {  
  return users.findIndex((u) \=\> u.id \=== id); // index or \-1  
}  
   
function updateName(users, id, name) {  
  const i \= users.findIndex((u) \=\> u.id \=== id);  
  if (i \=== \-1) return users;  
  const copy \= users.slice();  
  copy\[i\] \= { ...copy\[i\], name };  
  return copy;  
}  
   
module.exports \= { findUser, indexOfUser, updateName };

**Test / Demo & Expected Output**

// \--- run: node test.js \---  
const { findUser, indexOfUser, updateName } \= require("./solution");  
   
const users \= \[{ id: 1, name: "Asha" }, { id: 2, name: "Ravi" }\];  
console.log(findUser(users, 2));     // { id: 2, name: 'Ravi' }  
console.log(findUser(users, 9));     // undefined  
console.log(indexOfUser(users, 2));  // 1  
console.log(indexOfUser(users, 9));  // \-1  
console.log(updateName(users, 1, "Asha K"));  
   
console.assert(findUser(users, 2).name \=== "Ravi", "find by id");  
console.assert(findUser(users, 9\) \=== undefined, "no match \-\> undefined");  
console.assert(indexOfUser(users, 2\) \=== 1, "findIndex match");  
console.assert(indexOfUser(users, 9\) \=== \-1, "findIndex no match \-\> \-1");  
console.assert(updateName(users, 1, "Asha K")\[0\].name \=== "Asha K", "immutable update");  
console.assert(users\[0\].name \=== "Asha", "original unchanged");  
console.log("find/findIndex assertions passed.");  
   
/\* EXPECTED OUTPUT:  
{ id: 2, name: 'Ravi' }  
undefined  
1  
\-1  
\[ { id: 1, name: 'Asha K' }, { id: 2, name: 'Ravi' } \]  
find/findIndex assertions passed.  
\*/

**Common Follow-up Questions**

**Q: What does find return when nothing matches?**

**A:** \`undefined\`. (\`findIndex\` returns \`-1\` in the same situation.) Always handle the not-found case to avoid reading properties of undefined.

**Q: Difference between find and filter?**

**A:** \`find\` returns only the first matching element (or undefined) and short-circuits; \`filter\` returns a new array of all matching elements and always scans the whole array.

## **46\. Array.some() / every()**

**Simple Explanation (English)**

\`some\` returns \`true\` if at least one element satisfies the callback (and short-circuits on the first true). \`every\` returns \`true\` only if all elements satisfy the callback (and short-circuits on the first false). Both return a boolean.

Think of them as logical OR (\`some\`) and logical AND (\`every\`) across an array. On an empty array, \`some\` returns false and \`every\` returns true (vacuously). They're perfect for validation and existence checks.

**Hinglish Explanation**

\`some\` \`true\` deta hai agar kam se kam ek element callback ko satisfy kare (aur pehle true par short-circuit). \`every\` \`true\` tabhi deta hai jab saare elements satisfy karein (aur pehle false par short-circuit). Dono boolean return karte hain.  
Inhe array par logical OR (\`some\`) aur logical AND (\`every\`) samjho. Empty array par \`some\` false aur \`every\` true (vacuously) deta hai. Ye validation aur existence checks ke liye perfect hain.

**Key Interview Points**

* \`some\` → true if ANY element passes (logical OR); short-circuits on first true.

* \`every\` → true only if ALL elements pass (logical AND); short-circuits on first false.

* Both return a boolean.

* Empty array: \`some\` → false, \`every\` → true (vacuous truth).

* Great for validation, permission checks, and existence tests.

**Real-World Example**

Form validation: \`fields.every(f \=\> f.valid)\` enables the submit button only when all fields pass, while \`cart.some(item \=\> item.outOfStock)\` shows a warning if any item can't be purchased.

**Code — Full & Runnable**

// some / every for checks and validation.  
   
function hasNegative(nums) {  
  return nums.some((n) \=\> n \< 0);  
}  
   
function allPositive(nums) {  
  return nums.every((n) \=\> n \> 0);  
}  
   
function formValid(fields) {  
  return fields.every((f) \=\> f.valid);  
}  
   
module.exports \= { hasNegative, allPositive, formValid };

**Test / Demo & Expected Output**

// \--- run: node test.js \---  
const { hasNegative, allPositive, formValid } \= require("./solution");  
   
console.log(hasNegative(\[1, 2, \-3\])); // true  
console.log(allPositive(\[1, 2, 3\]));  // true  
console.log(allPositive(\[1, \-2, 3\])); // false  
console.log(\[\].every((x) \=\> x \> 0));  // true (vacuous)  
   
console.assert(hasNegative(\[1, \-1\]) \=== true, "some finds negative");  
console.assert(hasNegative(\[1, 2\]) \=== false, "some none negative");  
console.assert(allPositive(\[1, 2, 3\]) \=== true, "every positive");  
console.assert(formValid(\[{ valid: true }, { valid: false }\]) \=== false, "one invalid fails every");  
console.log("some/every assertions passed.");  
   
/\* EXPECTED OUTPUT:  
true  
true  
false  
true  
some/every assertions passed.  
\*/

**Common Follow-up Questions**

**Q: What do some and every return on an empty array?**

**A:** \`some\` returns false (no element satisfies the condition) and \`every\` returns true (vacuously — there's no element that fails).

**Q: How do some/every relate to logical operators?**

**A:** \`some\` is like OR across the array (true if any element passes); \`every\` is like AND (true only if all pass). Both short-circuit just like \`||\` and \`&&\`.

## **47\. Array.flat() / flatMap()**

**Simple Explanation (English)**

\`flat(depth)\` creates a new array with sub-array elements concatenated up to the specified depth (default 1). \`arr.flat(Infinity)\` fully flattens any level of nesting. It's the clean modern replacement for manual recursion or \`concat\`-based flattening.

\`flatMap(fn)\` is \`map\` followed by a single-level \`flat\` — it maps each element and then flattens one level, in one efficient pass. It's handy when each item can expand into zero, one, or many results.

**Hinglish Explanation**

\`flat(depth)\` ek naya array banata hai jisme sub-array elements specified depth tak concatenate ho jaate hain (default 1). \`arr.flat(Infinity)\` kisi bhi level ki nesting poori flatten kar deta hai. Ye manual recursion ya \`concat\` flattening ka saaf modern replacement hai.  
\`flatMap(fn)\` matlab \`map\` ke baad ek single-level \`flat\` — har element ko map karta hai phir ek level flatten, ek efficient pass me. Tab useful jab har item zero, ek, ya kai results me expand ho sakta hai.

**Key Interview Points**

* \`flat(depth=1)\` flattens nested arrays up to \`depth\`; \`flat(Infinity)\` flattens fully.

* Returns a new array; original unchanged.

* \`flatMap(fn)\` \= map then flatten ONE level, in a single pass.

* flatMap is great when a mapper returns arrays (expand items).

* \`flat\` also removes empty slots in sparse arrays.

**Real-World Example**

Splitting sentences into words: \`sentences.flatMap(s \=\> s.split(' '))\` turns an array of strings into a single flat array of words — no nested arrays to clean up afterward.

**Code — Full & Runnable**

// flat and flatMap.  
   
function flattenAll(nested) {  
  return nested.flat(Infinity);  
}  
   
function wordsOf(sentences) {  
  return sentences.flatMap((s) \=\> s.split(" "));  
}  
   
function expandPairs(nums) {  
  // each number expands into \[n, n\*10\]  
  return nums.flatMap((n) \=\> \[n, n \* 10\]);  
}  
   
module.exports \= { flattenAll, wordsOf, expandPairs };

**Test / Demo & Expected Output**

// \--- run: node test.js \---  
const { flattenAll, wordsOf, expandPairs } \= require("./solution");  
   
console.log(flattenAll(\[1, \[2, \[3, \[4\]\]\]\]));        // \[1,2,3,4\]  
console.log(wordsOf(\["hello world", "foo bar"\]));    // \['hello','world','foo','bar'\]  
console.log(expandPairs(\[1, 2\]));                    // \[1,10,2,20\]  
   
console.assert(JSON.stringify(flattenAll(\[1,\[2,\[3,\[4\]\]\]\])) \=== "\[1,2,3,4\]", "deep flat");  
console.assert(JSON.stringify(wordsOf(\["a b","c"\])) \=== '\["a","b","c"\]', "flatMap split");  
console.assert(JSON.stringify(expandPairs(\[1,2\])) \=== "\[1,10,2,20\]", "flatMap expand");  
console.log("flat/flatMap assertions passed.");  
   
/\* EXPECTED OUTPUT:  
\[ 1, 2, 3, 4 \]  
\[ 'hello', 'world', 'foo', 'bar' \]  
\[ 1, 10, 2, 20 \]  
flat/flatMap assertions passed.  
\*/

**Common Follow-up Questions**

**Q: How do you fully flatten a deeply nested array?**

**A:** Use \`arr.flat(Infinity)\`, which flattens every level of nesting regardless of depth.

**Q: What is flatMap equivalent to?**

**A:** \`arr.map(fn).flat(1)\` — it maps then flattens one level, but in a single, more efficient pass. It only flattens one level, not deeply.

## **48\. Spread Operator**

**Simple Explanation (English)**

The spread operator \`...\` expands an iterable (array, string) or an object's properties into individual elements. It's used to copy arrays/objects, merge them, pass array elements as function arguments, and insert elements inline.

For arrays/objects it creates a shallow copy (nested values are shared by reference). Spread is one of the most-used modern features for writing immutable updates — building a new array/object instead of mutating the original.

**Hinglish Explanation**

Spread operator \`...\` ek iterable (array, string) ya object ki properties ko individual elements me expand kar deta hai. Iska use arrays/objects copy karne, merge karne, array elements ko function arguments ke roop me pass karne, aur inline elements daalne me hota hai.  
Arrays/objects ke liye ye shallow copy banata hai (nested values reference se shared). Immutable updates likhne ke liye spread sabse zyada use hone wale modern features me se hai — original mutate karne ke bajaye naya array/object banao.

**Key Interview Points**

* Expands iterables/object properties into individual elements.

* Copy: \`\[...arr\]\`, \`{...obj}\` (shallow).

* Merge: \`\[...a, ...b\]\`, \`{...a, ...b}\` (later wins on key conflicts).

* Pass array as args: \`fn(...arr)\`; combine with literals inline.

* Core tool for immutable updates in React/Redux-style code.

**Real-World Example**

Adding an item to state immutably in React: \`setItems(\[...items, newItem\])\` — you never mutate the original array, you create a new one, which is what React needs to detect changes.

**Code — Full & Runnable**

// Spread for copy, merge, and function calls.  
   
function addItem(arr, item) { return \[...arr, item\]; }          // immutable add  
function mergeObjects(a, b) { return { ...a, ...b }; }            // b wins  
function maxOf(nums) { return Math.max(...nums); }                // spread as args  
function cloneShallow(obj) { return { ...obj }; }  
   
module.exports \= { addItem, mergeObjects, maxOf, cloneShallow };

**Test / Demo & Expected Output**

// \--- run: node test.js \---  
const { addItem, mergeObjects, maxOf, cloneShallow } \= require("./solution");  
   
const arr \= \[1, 2\];  
console.log(addItem(arr, 3));                 // \[1,2,3\]  
console.log("original:", arr);                // \[1,2\]  
console.log(mergeObjects({ a: 1, b: 1 }, { b: 9 })); // { a:1, b:9 }  
console.log(maxOf(\[4, 9, 2\]));                // 9  
   
console.assert(JSON.stringify(addItem(arr, 3)) \=== "\[1,2,3\]", "immutable add");  
console.assert(JSON.stringify(arr) \=== "\[1,2\]", "original untouched");  
console.assert(mergeObjects({ b: 1 }, { b: 9 }).b \=== 9, "later object wins");  
console.assert(maxOf(\[4, 9, 2\]) \=== 9, "spread as arguments");  
console.log("spread assertions passed.");  
   
/\* EXPECTED OUTPUT:  
\[ 1, 2, 3 \]  
original: \[ 1, 2 \]  
{ a: 1, b: 9 }  
9  
spread assertions passed.  
\*/

**Common Follow-up Questions**

**Q: Is a spread copy deep or shallow?**

**A:** Shallow. \`\[...arr\]\` and \`{...obj}\` copy the top level only; nested objects/arrays are still shared by reference.

**Q: What's the difference between spread and rest?**

**A:** They use the same \`...\` syntax but opposite directions: spread expands a collection into elements (in calls/literals), while rest collects multiple elements into one array/object (in parameters/destructuring).

## **49\. Rest Operator**

**Simple Explanation (English)**

The rest operator \`...\` collects multiple elements into a single array or object. As a function parameter (\`function f(...args)\`), it gathers all remaining arguments into a real array. In destructuring, it captures the 'rest' of the items not explicitly named.

It's the modern replacement for the old \`arguments\` object — and unlike \`arguments\`, it produces a genuine array (so you can use map/filter directly) and works in arrow functions. Rest parameters must come last.

**Hinglish Explanation**

Rest operator \`...\` kai elements ko ek single array ya object me collect karta hai. Function parameter ki tarah (\`function f(...args)\`), ye baaki saare arguments ko ek real array me ikattha karta hai. Destructuring me ye un items ka 'rest' capture karta hai jinhe explicitly name nahi kiya.  
Ye purane \`arguments\` object ka modern replacement hai — aur \`arguments\` ke विपरीत ye ek asli array deta hai (isliye map/filter seedhe use kar sakte ho) aur arrow functions me bhi chalta hai. Rest parameter hamesha last me hona chahiye.

**Key Interview Points**

* Collects remaining elements into a real array/object.

* As a parameter: \`function f(a, ...rest)\` — \`rest\` is a true array.

* In destructuring: \`const \[first, ...others\] \= arr\` / \`const {a, ...others} \= obj\`.

* Modern, array-returning replacement for the \`arguments\` object (works in arrows).

* Must be the LAST parameter / destructuring target.

**Real-World Example**

A \`sum(...nums)\` utility that accepts any number of arguments, or pulling the first row off a dataset: \`const \[header, ...rows\] \= csvLines\` cleanly separates the header from the data.

**Code — Full & Runnable**

// Rest in parameters and destructuring.  
   
function sum(...nums) {                 // gathers all args into an array  
  return nums.reduce((a, b) \=\> a \+ b, 0);  
}  
   
function splitFirst(arr) {  
  const \[first, ...rest\] \= arr;          // rest \= everything after first  
  return { first, rest };  
}  
   
function omitId(obj) {  
  const { id, ...withoutId } \= obj;      // collect remaining own props  
  return withoutId;  
}  
   
module.exports \= { sum, splitFirst, omitId };

**Test / Demo & Expected Output**

// \--- run: node test.js \---  
const { sum, splitFirst, omitId } \= require("./solution");  
   
console.log(sum(1, 2, 3, 4));            // 10  
console.log(splitFirst(\[10, 20, 30\]));   // { first: 10, rest: \[20,30\] }  
console.log(omitId({ id: 1, name: "Asha", age: 30 })); // { name:'Asha', age:30 }  
   
console.assert(sum(1, 2, 3, 4\) \=== 10, "rest params sum");  
const s \= splitFirst(\[10, 20, 30\]);  
console.assert(s.first \=== 10 && JSON.stringify(s.rest) \=== "\[20,30\]", "rest in array destructuring");  
console.assert(JSON.stringify(omitId({ id: 1, name: "Asha" })) \=== '{"name":"Asha"}', "rest in object destructuring");  
console.log("rest assertions passed.");  
   
/\* EXPECTED OUTPUT:  
10  
{ first: 10, rest: \[ 20, 30 \] }  
{ name: 'Asha', age: 30 }  
rest assertions passed.  
\*/

**Common Follow-up Questions**

**Q: How is the rest parameter better than \`arguments\`?**

**A:** It's a real array (so array methods work directly), it only captures the parameters you intend, it works in arrow functions, and it reads more clearly.

**Q: Where must a rest element appear?**

**A:** Always last — \`function f(a, ...rest)\` and \`const \[x, ...rest\] \= arr\`. You can't have parameters or destructuring targets after a rest element.

## **50\. Destructuring**

**Simple Explanation (English)**

Destructuring is a concise syntax for unpacking values from arrays or properties from objects into distinct variables. Array destructuring is position-based (\`const \[a, b\] \= arr\`); object destructuring is name-based (\`const {x, y} \= obj\`).

It supports default values (\`const {timeout \= 1000} \= opts\`), renaming (\`const {x: posX} \= obj\`), nested patterns, and combining with the rest operator. It makes function parameters, swapping variables, and working with API responses far cleaner.

**Hinglish Explanation**

Destructuring arrays se values ya objects se properties ko alag variables me unpack karne ka concise syntax hai. Array destructuring position-based hai (\`const \[a, b\] \= arr\`); object destructuring name-based (\`const {x, y} \= obj\`).  
Ye default values (\`const {timeout \= 1000} \= opts\`), renaming (\`const {x: posX} \= obj\`), nested patterns, aur rest operator ke saath combine support karta hai. Ye function parameters, variables swap karna, aur API responses ke saath kaam karna kaafi saaf bana deta hai.

**Key Interview Points**

* Array destructuring is positional; object destructuring is by property name.

* Defaults: \`const {n \= 0} \= obj\` fills in when the value is undefined.

* Renaming: \`const {x: newName} \= obj\`.

* Supports nesting and combining with rest (\`const \[a, ...rest\] \= arr\`).

* Great for function parameters, variable swaps, and unpacking API data.

**Real-World Example**

React hooks return arrays you destructure (\`const \[count, setCount\] \= useState(0)\`), and function options are commonly destructured with defaults: \`function connect({ host \= 'localhost', port \= 5432 } \= {}) {}\`.

**Code — Full & Runnable**

// Destructuring: defaults, renaming, nesting, swap.  
   
function configure({ host \= "localhost", port \= 5432, secure \= false } \= {}) {  
  return host \+ ":" \+ port \+ (secure ? " (TLS)" : "");  
}  
   
function swap(a, b) {  
  \[a, b\] \= \[b, a\]; // swap without a temp variable  
  return \[a, b\];  
}  
   
function unpackNested(data) {  
  const { user: { name, address: { city } } } \= data;  
  return name \+ " from " \+ city;  
}  
   
module.exports \= { configure, swap, unpackNested };

**Test / Demo & Expected Output**

// \--- run: node test.js \---  
const { configure, swap, unpackNested } \= require("./solution");  
   
console.log(configure());                          // localhost:5432  
console.log(configure({ port: 8080, secure: true })); // localhost:8080 (TLS)  
console.log(swap(1, 2));                            // \[2,1\]  
console.log(unpackNested({ user: { name: "Asha", address: { city: "Pune" } } }));  
   
console.assert(configure() \=== "localhost:5432", "defaults applied");  
console.assert(configure({ port: 8080, secure: true }) \=== "localhost:8080 (TLS)", "partial override");  
console.assert(JSON.stringify(swap(1, 2)) \=== "\[2,1\]", "swap works");  
console.assert(unpackNested({ user: { name: "Asha", address: { city: "Pune" } } }) \=== "Asha from Pune", "nested destructuring");  
console.log("destructuring assertions passed.");  
   
/\* EXPECTED OUTPUT:  
localhost:5432  
localhost:8080 (TLS)  
\[ 2, 1 \]  
Asha from Pune  
destructuring assertions passed.  
\*/

**Common Follow-up Questions**

**Q: How do you provide default values in destructuring?**

**A:** Add \`= value\` after the variable: \`const { timeout \= 1000 } \= opts\`. The default applies only when the unpacked value is \`undefined\`.

**Q: How do you rename a variable while destructuring an object?**

**A:** Use a colon: \`const { originalKey: newName } \= obj\`. \`newName\` becomes the variable holding \`obj.originalKey\`.