**JavaScript Foundations**

Interview Preparation — Study Guide

Phase 1A  •  Topics 1–25

*Each topic includes: plain-English \+ Hinglish explanation, key interview points,*

*a real-world example, complete runnable code, tests with expected output, and follow-up Q\&A.*

Run any code sample with:  node filename.js  
**Contents**

# **Phase 1A — JavaScript Foundations (Topics 1–25)**

This batch covers the JavaScript execution model, memory, scope, closures, type behaviour, and higher-order functions — the most frequently asked fundamentals in front-end and full-stack interviews.

## **1\. Execution Context**

**Simple Explanation (English)**

An Execution Context is the environment in which a piece of JavaScript code is evaluated and run. Whenever code executes, the JS engine wraps it in a context that knows three things: what variables/functions are available, what \`this\` refers to, and a reference to the outer (parent) environment.

There are two main types: the Global Execution Context (created once when the script starts) and a Function Execution Context (created every time a function is called). Each context is built in two phases — a Memory Creation phase and an Execution phase.

**Hinglish Explanation**

Execution Context ka matlab hai woh 'environment' jisme aapka JavaScript code chalta hai. Jab bhi code run hota hai, engine ek dabba (context) banata hai jisme decide hota hai ki kaunse variables aur functions available hain, \`this\` kis cheez ko point kar raha hai, aur parent scope kaun hai.  
Do type hote hain: Global Context (poora script start hote hi ek baar banta hai) aur Function Context (har function call par naya banta hai). Har context do phase me banta hai — pehle memory allocate hoti hai, phir code line-by-line execute hota hai.

**Key Interview Points**

* Two types: Global Execution Context (one per program) and Function Execution Context (one per function call).

* Every context is built in two phases: Memory Creation (allocation) then Execution (running code).

* A context stores three things: the Variable Environment, the value of \`this\`, and a reference to the outer environment (scope chain).

* Contexts are managed on the Call Stack — the currently running one sits on top.

* Understanding contexts explains hoisting, scope, closures, and the \`this\` keyword.

**Real-World Example**

Think of a restaurant kitchen: the whole kitchen is the Global Context (shared equipment, always there). Each individual order ticket is a Function Context — it gets its own little prep space, runs, then is cleared away when the dish is done.

**Code — Full & Runnable**

// Demonstrating that each function call gets its OWN execution context.  
// Each call has its own copy of local variables and its own 'this' binding.  
   
function makeCounter(label) {  
  // 'count' lives in THIS function's execution context only  
  let count \= 0;  
  function increment() {  
    count \+= 1;  
    return label \+ ": " \+ count;  
  }  
  return increment;  
}  
   
const a \= makeCounter("A");  
const b \= makeCounter("B");  
   
// 'a' and 'b' were created by two separate execution contexts,  
// so they each have an independent 'count'.  
module.exports \= { makeCounter, a, b };

**Test / Demo & Expected Output**

// \--- run: node test.js \---  
const { a, b } \= require("./solution");  
   
console.log(a()); // A: 1  
console.log(a()); // A: 2  
console.log(b()); // B: 1  (independent context\!)  
console.log(a()); // A: 3  
   
console.assert(a() \=== "A: 4", "context A should keep its own count");  
console.assert(b() \=== "B: 2", "context B should be independent");  
console.log("All execution-context assertions passed.");  
   
/\* EXPECTED OUTPUT:  
A: 1  
A: 2  
B: 1  
A: 3  
All execution-context assertions passed.  
\*/

**Common Follow-up Questions**

**Q: What three things does an execution context contain?**

**A:** The variable environment (variables \+ functions), the value of \`this\`, and a reference to the outer (lexical) environment used to build the scope chain.

**Q: When is a new execution context created?**

**A:** The Global context is created once when the script loads; a new Function execution context is created on every function invocation (not on declaration).

## **2\. Global Execution Context (GEC)**

**Simple Explanation (English)**

The Global Execution Context is the base context created automatically when your JavaScript program starts — before any of your code runs. There is exactly one per program and it sits at the bottom of the call stack.

It does two special things during creation: it creates the global object (\`window\` in browsers, \`globalThis\`/\`global\` in Node) and sets \`this\` to point at that global object (in non-module, non-strict code). Top-level \`var\` declarations and function declarations become properties of the global object.

**Hinglish Explanation**

Global Execution Context woh sabse pehla context hai jo program start hote hi automatically ban jaata hai — aapka koi bhi code chalne se pehle. Poore program me ye sirf ek hi hota hai aur call stack ke bilkul neeche rehta hai.  
Ye creation ke time do kaam karta hai: global object banata hai (browser me \`window\`, Node me \`globalThis\`/\`global\`) aur \`this\` ko us global object par set kar deta hai. Top-level \`var\` aur function declarations global object ki properties ban jaate hain.

**Key Interview Points**

* Created once, automatically, before any code runs; lives at the bottom of the call stack.

* Creates the global object: \`window\` in browsers, \`global\`/\`globalThis\` in Node.

* In non-strict, non-module top-level code, \`this\` \=== the global object.

* Top-level \`var\` and function declarations attach to the global object; \`let\`/\`const\` do NOT.

* In Node.js, each file is wrapped in a module, so top-level \`this\` is \`module.exports\` (an empty object), not \`global\`.

**Real-World Example**

It's like the lobby of an office building. It exists before anyone arrives, everyone shares it, and it provides the common facilities (reception, elevators) that every individual office (function) can access.

**Code — Full & Runnable**

// Demonstrating the global execution context and the global object.  
// NOTE: In Node, each file is a module, so top-level 'this' is module.exports.  
   
var legacyVar \= "I attach to global in browsers";  
let modernLet \= "I do NOT attach to the global object";  
   
function showGlobalBehaviour() {  
  // globalThis works in both Node and browsers (ES2020)  
  return {  
    hasGlobalThis: typeof globalThis \=== "object",  
    // In Node a top-level 'var' does NOT attach to global (module scope),  
    // but 'let'/'const' never attach to the global object anywhere.  
    letOnGlobal: typeof globalThis.modernLet, // "undefined"  
  };  
}  
   
module.exports \= { showGlobalBehaviour };

**Test / Demo & Expected Output**

// \--- run: node test.js \---  
const { showGlobalBehaviour } \= require("./solution");  
   
const r \= showGlobalBehaviour();  
console.log(r);  
   
console.assert(r.hasGlobalThis \=== true, "globalThis must exist");  
console.assert(r.letOnGlobal \=== "undefined", "let never attaches to global");  
console.log("Global execution context assertions passed.");  
   
/\* EXPECTED OUTPUT:  
{ hasGlobalThis: true, letOnGlobal: 'undefined' }  
Global execution context assertions passed.  
\*/

**Common Follow-up Questions**

**Q: What is \`this\` in the global context?**

**A:** In a browser script it is the \`window\` object. In a Node.js module, top-level \`this\` is \`module.exports\` (an empty object), because each file is wrapped as a module — not the \`global\` object.

**Q: Do \`let\` and \`const\` create global object properties?**

**A:** No. Only \`var\` and function declarations do (in true global scope). \`let\`/\`const\` live in a separate declarative environment, which is why \`window.myLet\` is undefined.

## **3\. Function Execution Context (FEC)**

**Simple Explanation (English)**

A Function Execution Context is created every single time a function is invoked (called), not when it is defined. It gives the function its own private space for arguments, local variables, and its own \`this\`.

Like the global context, it is built in two phases — memory creation (parameters and locals are allocated, function declarations hoisted) and execution (code runs line by line). When the function returns, its context is popped off the call stack and (unless captured by a closure) its locals are eligible for garbage collection.

**Hinglish Explanation**

Function Execution Context har baar tab banta hai jab function call hota hai — define karte time nahi. Ye function ko apni private jagah deta hai jisme arguments, local variables aur apna \`this\` hota hai.  
Global context ki tarah ye bhi do phase me banta hai — pehle memory (parameters, locals allocate, function declarations hoist), phir code execute. Jaise hi function return karta hai, uska context call stack se hat jaata hai aur (agar closure ne pakda na ho to) uske locals garbage collect ho sakte hain.

**Key Interview Points**

* Created on every invocation — calling a function 3 times creates 3 contexts.

* Contains the \`arguments\` object, the parameters, local variables, \`this\`, and the outer reference.

* Built in the same two phases (memory creation, then execution).

* Pushed onto the call stack when called, popped when it returns.

* Its locals are independent across calls — that independence powers closures and recursion.

**Real-World Example**

Imagine a photocopier that prints a fresh worksheet each time you press 'copy'. Each worksheet (context) can be filled in independently; finishing one doesn't affect the others — even though they came from the same master template (the function).

**Code — Full & Runnable**

// Each call to greet() builds a fresh function execution context.  
// 'arguments' and locals are private to each invocation.  
   
function greet(name) {  
  const prefix \= "Hello, ";          // local to this context  
  const argCount \= arguments.length; // arguments object per context  
  return prefix \+ name \+ " (" \+ argCount \+ " arg)";  
}  
   
// Recursion proves each call has its own context with its own 'n'.  
function factorial(n) {  
  if (n \<= 1\) return 1;       // base case  
  return n \* factorial(n \- 1); // each call \= new context with its own n  
}  
   
module.exports \= { greet, factorial };

**Test / Demo & Expected Output**

// \--- run: node test.js \---  
const { greet, factorial } \= require("./solution");  
   
console.log(greet("Asha"));   // Hello, Asha (1 arg)  
console.log(factorial(5));    // 120  
   
console.assert(greet("Ravi") \=== "Hello, Ravi (1 arg)", "greet basic");  
console.assert(factorial(0) \=== 1, "0\! \= 1");  
console.assert(factorial(5) \=== 120, "5\! \= 120");  
console.assert(factorial(6) \=== 720, "6\! \= 720");  
console.log("Function execution context assertions passed.");  
   
/\* EXPECTED OUTPUT:  
Hello, Asha (1 arg)  
120  
Function execution context assertions passed.  
\*/

**Common Follow-up Questions**

**Q: Is a function context created at definition or at call time?**

**A:** At call time. Defining a function only creates the function object; the execution context is built each time the function is invoked.

**Q: Why can recursion work without variables clashing?**

**A:** Each recursive call gets its own execution context with its own copy of parameters and locals, stacked on the call stack, so the \`n\` in one frame never overwrites the \`n\` in another.

## **4\. Call Stack**

**Simple Explanation (English)**

The Call Stack is the data structure the JS engine uses to keep track of which function is currently running and what should run after it finishes. It works as a LIFO (Last-In, First-Out) stack: when a function is called its context is pushed on top; when it returns it is popped off.

JavaScript is single-threaded, so there is exactly one call stack — only one thing runs at a time. If the stack grows too deep (e.g. infinite recursion), you get a 'Maximum call stack size exceeded' error (stack overflow).

**Hinglish Explanation**

Call Stack ek data structure hai jisse engine track karta hai ki abhi kaunsa function chal raha hai aur uske baad kya chalega. Ye LIFO (Last-In, First-Out) tarah kaam karta hai: function call hote hi uska context upar push hota hai, return hote hi pop ho jaata hai.  
JavaScript single-threaded hai, isliye sirf ek hi call stack hota hai — ek time par ek hi cheez chalti hai. Agar stack bahut gehra ho jaaye (jaise infinite recursion) to 'Maximum call stack size exceeded' error aata hai (stack overflow).

**Key Interview Points**

* LIFO structure: the last function pushed is the first to be popped.

* Tracks execution order — where to return after a function finishes.

* JS is single-threaded → exactly one call stack → one task at a time.

* The Global Execution Context sits at the bottom of the stack.

* Infinite/too-deep recursion causes a stack overflow ('Maximum call stack size exceeded').

**Real-World Example**

It's like a stack of plates in a cafeteria. You add (push) a new plate on top and you always take (pop) the top one first. You can't grab the bottom plate without removing the ones above it.

**Code — Full & Runnable**

// We simulate the call stack to show push/pop ordering.  
   
function buildCallStackTrace() {  
  const stack \= \[\];  
  const trace \= \[\];  
   
  function call(fn) { stack.push(fn); trace.push("push " \+ fn \+ " \-\> \[" \+ stack.join(",") \+ "\]"); }  
  function ret()     { const f \= stack.pop(); trace.push("pop  " \+ f \+ "  \-\> \[" \+ stack.join(",") \+ "\]"); }  
   
  call("global");  
  call("first");  
  call("second");  
  ret();   // second returns  
  ret();   // first returns  
  ret();   // global ends  
  return trace;  
}  
   
// A real (controlled) recursion that respects stack limits.  
function sumTo(n, acc \= 0\) {  
  if (n \=== 0\) return acc;  
  return sumTo(n \- 1, acc \+ n);  
}  
   
module.exports \= { buildCallStackTrace, sumTo };

**Test / Demo & Expected Output**

// \--- run: node test.js \---  
const { buildCallStackTrace, sumTo } \= require("./solution");  
   
buildCallStackTrace().forEach(line \=\> console.log(line));  
console.log("sumTo(100) \=", sumTo(100));  
   
console.assert(sumTo(100) \=== 5050, "1..100 should sum to 5050");  
   
// Demonstrate a stack overflow safely:  
let overflowed \= false;  
function boom(n){ return boom(n \+ 1); }  
try { boom(1); } catch (e) { overflowed \= e instanceof RangeError; }  
console.assert(overflowed, "infinite recursion must throw RangeError");  
console.log("Call stack assertions passed.");  
   
/\* EXPECTED OUTPUT (trace order is the key part):  
push global \-\> \[global\]  
push first \-\> \[global,first\]  
push second \-\> \[global,first,second\]  
pop  second  \-\> \[global,first\]  
pop  first  \-\> \[global\]  
pop  global  \-\> \[\]  
sumTo(100) \= 5050  
Call stack assertions passed.  
\*/

**Common Follow-up Questions**

**Q: Why is JavaScript called single-threaded?**

**A:** Because it has one call stack and executes one statement at a time. Concurrency (timers, I/O, fetch) is handled by the runtime's event loop and queues, not by extra threads on the main stack.

**Q: What causes 'Maximum call stack size exceeded'?**

**A:** Pushing more frames than the stack can hold — usually infinite or unbounded recursion without a reachable base case.

## **5\. Memory Creation Phase**

**Simple Explanation (English)**

Before any line of a context actually runs, the engine performs the Memory Creation phase (also called the creation or allocation phase). It scans the code and reserves memory for every variable and function it finds in that scope.

During this phase, \`var\` variables are allocated and initialised to \`undefined\`; \`let\` and \`const\` are allocated but left uninitialised (in the Temporal Dead Zone); and function declarations are stored entirely (their full body). This phase is what makes hoisting possible.

**Hinglish Explanation**

Context ki koi bhi line chalne se pehle, engine Memory Creation phase chalata hai. Ye code ko scan karke us scope ke har variable aur function ke liye memory reserve karta hai.  
Is phase me \`var\` variables ko memory milti hai aur woh \`undefined\` set ho jaate hain; \`let\`/\`const\` ko memory milti hai par initialise nahi hote (Temporal Dead Zone me rehte hain); aur function declarations poori body ke saath store ho jaate hain. Yahi phase hoisting ko possible banata hai.

**Key Interview Points**

* Runs first, before execution; scans the scope and allocates memory.

* \`var\` → allocated and set to \`undefined\`.

* \`let\`/\`const\` → allocated but uninitialised (Temporal Dead Zone).

* Function declarations → fully stored (body included), so they're callable before their line.

* Function expressions/arrow functions assigned to \`var\` follow the variable rules (only the name is hoisted as \`undefined\`).

**Real-World Example**

Think of setting a dinner table before guests eat. You lay out all the empty plates and labelled name cards first (allocation). The food (values) is served later, during the meal (execution phase).

**Code — Full & Runnable**

// This file is meant to be REQUIRED so we can observe creation-phase effects.  
   
// Function declaration is fully available even though it's used "early".  
function describeCreationPhase() {  
  // 'callableEarly' was usable above its definition because function  
  // declarations are stored whole during the memory creation phase.  
  return {  
    varBefore: readVarBeforeAssign(),     // undefined (allocated, not yet assigned)  
    funcWorks: callableEarly(),           // works due to full hoisting  
  };  
}  
   
function readVarBeforeAssign() {  
  // 'x' is allocated and set to undefined during creation phase  
  var snapshot \= x; // undefined here  
  var x \= 10;       // assigned during execution phase  
  return snapshot;  
}  
   
function callableEarly() { return "function body was stored at creation"; }  
   
module.exports \= { describeCreationPhase };

**Test / Demo & Expected Output**

// \--- run: node test.js \---  
const { describeCreationPhase } \= require("./solution");  
   
const r \= describeCreationPhase();  
console.log(r);  
   
console.assert(r.varBefore \=== undefined, "var is undefined before assignment");  
console.assert(r.funcWorks \=== "function body was stored at creation", "function fully hoisted");  
console.log("Memory creation phase assertions passed.");  
   
/\* EXPECTED OUTPUT:  
{ varBefore: undefined, funcWorks: 'function body was stored at creation' }  
Memory creation phase assertions passed.  
\*/

**Common Follow-up Questions**

**Q: What value does a \`var\` hold during the memory creation phase?**

**A:** \`undefined\`. It is allocated immediately, but its actual value is assigned later during the execution phase.

**Q: Why can you call a function-declaration before its line but not a function-expression?**

**A:** Function declarations are stored in full during creation; a function expression only hoists its variable name (as \`undefined\`), so calling it early throws a TypeError.

## **6\. Execution Phase**

**Simple Explanation (English)**

The Execution phase is the second phase of an execution context. After memory has been allocated, the engine runs the code line by line, assigning real values to variables, evaluating expressions, and invoking functions.

It is during this phase that \`var x \= 10\` actually sets \`x\` to \`10\`, that function expressions get assigned, and that nested function calls push new contexts onto the call stack. The creation phase prepares the stage; the execution phase performs the play.

**Hinglish Explanation**

Execution phase context ka dusra phase hai. Memory allocate hone ke baad, engine code ko line-by-line chalata hai — variables me actual values daalta hai, expressions evaluate karta hai, aur functions ko call karta hai.  
Isi phase me \`var x \= 10\` actually \`x\` ko \`10\` set karta hai, function expressions assign hote hain, aur nested function calls naye contexts ko call stack par push karte hain. Creation phase stage taiyaar karta hai; execution phase me actual khel hota hai.

**Key Interview Points**

* Second phase — runs after the memory creation phase.

* Executes statements top-to-bottom, assigning real values.

* Function invocations here create and push new function execution contexts.

* Explains why a \`var\` is \`undefined\` above its assignment but correct below it.

* Asynchronous callbacks are NOT run here — they are scheduled and run later via the event loop.

**Real-World Example**

If the creation phase is the chef doing mise en place (prepping and laying out ingredients), the execution phase is the actual cooking — combining ingredients in order to produce the dish.

**Code — Full & Runnable**

// Shows the difference between creation-phase value and execution-phase value.  
   
function phaseTimeline() {  
  const log \= \[\];  
  log.push("before: " \+ value); // undefined (creation phase set it)  
  var value \= "assigned now";   // execution phase assignment  
  log.push("after: " \+ value);  // "assigned now"  
  return log;  
}  
   
// Order of execution across nested calls (push/pop happens here).  
function outer() { return "outer(" \+ inner() \+ ")"; }  
function inner() { return "inner"; }  
   
module.exports \= { phaseTimeline, outer };

**Test / Demo & Expected Output**

// \--- run: node test.js \---  
const { phaseTimeline, outer } \= require("./solution");  
   
console.log(phaseTimeline());  
console.log(outer());  
   
console.assert(phaseTimeline()\[0\] \=== "before: undefined", "creation-phase undefined");  
console.assert(phaseTimeline()\[1\] \=== "after: assigned now", "execution-phase value");  
console.assert(outer() \=== "outer(inner)", "nested execution order");  
console.log("Execution phase assertions passed.");  
   
/\* EXPECTED OUTPUT:  
\[ 'before: undefined', 'after: assigned now' \]  
outer(inner)  
Execution phase assertions passed.  
\*/

**Common Follow-up Questions**

**Q: When does \`var x \= 5\` actually assign 5?**

**A:** During the execution phase, at the line where the assignment appears. The creation phase only allocated \`x\` and set it to \`undefined\`.

**Q: Are setTimeout callbacks run during the execution phase?**

**A:** No. They are registered during execution but run later, after the call stack empties, via the event loop and the macrotask queue.

## **7\. Hoisting**

**Simple Explanation (English)**

Hoisting is JavaScript's behaviour of making certain declarations available before the line where they're written. It happens because of the memory creation phase: declarations are processed before execution, so they 'appear' to be moved to the top of their scope.

Crucially, only declarations are hoisted, not initialisations. Function declarations are hoisted entirely (callable early). \`var\` is hoisted as \`undefined\`. \`let\`/\`const\` are hoisted but kept uninitialised in the Temporal Dead Zone, so accessing them early throws a ReferenceError.

**Hinglish Explanation**

Hoisting JavaScript ka woh behaviour hai jisme kuch declarations apni likhi hui line se pehle hi available ho jaate hain. Ye memory creation phase ki wajah se hota hai: declarations execution se pehle process ho jaate hain, isliye lagta hai ki woh scope ke top par chale gaye.  
Important baat: sirf declarations hoist hote hain, initialisations nahi. Function declarations poore hoist hote hain (pehle call ho sakte hain). \`var\` \`undefined\` ke saath hoist hota hai. \`let\`/\`const\` hoist to hote hain par TDZ me uninitialised rehte hain, isliye pehle access karne par ReferenceError aata hai.

**Key Interview Points**

* Declarations are processed before code runs; only declarations hoist, not assignments.

* Function declarations hoist fully — callable before their definition line.

* \`var\` hoists as \`undefined\`.

* \`let\`/\`const\` hoist into the Temporal Dead Zone — accessing early throws ReferenceError.

* Function expressions/arrow functions are NOT callable before assignment (the variable is hoisted, not the function body).

**Real-World Example**

Imagine a meeting agenda printed before the meeting. The topic titles (declarations) are listed in advance so everyone knows they're coming, but the actual discussion (values) only happens when you reach each item.

**Code — Full & Runnable**

// Demonstrates the three hoisting behaviours in one place.  
   
function hoistingDemo() {  
  const results \= {};  
   
  // 1\) var: hoisted as undefined  
  results.varBefore \= typeof v; // "undefined" name exists, value not set  
  var v \= 5;  
  results.varAfter \= v;  
   
  // 2\) function declaration: fully hoisted  
  results.fn \= early(); // works  
  function early() { return "called before definition"; }  
   
  // 3\) let/const: TDZ \-\> ReferenceError if accessed early  
  try {  
    // eslint-disable-next-line no-use-before-define  
    return { ...results, letEarly: l };  
  } catch (e) {  
    results.letEarly \= e.name; // "ReferenceError"  
  }  
  let l \= 10;  
  return results;  
}  
   
module.exports \= { hoistingDemo };

**Test / Demo & Expected Output**

// \--- run: node test.js \---  
const { hoistingDemo } \= require("./solution");  
   
const r \= hoistingDemo();  
console.log(r);  
   
console.assert(r.varBefore \=== "undefined", "var hoisted as undefined");  
console.assert(r.varAfter \=== 5, "var assigned later");  
console.assert(r.fn \=== "called before definition", "function fully hoisted");  
console.assert(r.letEarly \=== "ReferenceError", "let in TDZ throws ReferenceError");  
console.log("Hoisting assertions passed.");  
   
/\* EXPECTED OUTPUT:  
{  
  varBefore: 'undefined',  
  varAfter: 5,  
  fn: 'called before definition',  
  letEarly: 'ReferenceError'  
}  
Hoisting assertions passed.  
\*/

**Common Follow-up Questions**

**Q: Are \`let\` and \`const\` hoisted?**

**A:** Yes, they are hoisted, but unlike \`var\` they are not initialised — they sit in the Temporal Dead Zone until their declaration line, so reading them earlier throws a ReferenceError.

**Q: Is only the function name or the whole function hoisted?**

**A:** For a function declaration, the entire function (name \+ body) is hoisted, so it is callable earlier. For a function expression, only the variable is hoisted (as \`undefined\`).

## **8\. Temporal Dead Zone (TDZ)**

**Simple Explanation (English)**

The Temporal Dead Zone is the time between when a \`let\` or \`const\` variable is hoisted (start of its block) and when it is actually declared/initialised on its line. During this window the variable exists but cannot be accessed — doing so throws a ReferenceError.

The TDZ is a deliberate safety feature: it catches bugs where you use a variable before giving it a value. \`var\` has no TDZ (it's simply \`undefined\` early), which is exactly the silent-bug behaviour \`let\`/\`const\` were designed to prevent.

**Hinglish Explanation**

Temporal Dead Zone woh samay hai jab \`let\`/\`const\` variable hoist to ho chuka hai (block ke start se) par abhi tak apni line par declare/initialise nahi hua. Is window me variable exist karta hai par access nahi kar sakte — karoge to ReferenceError aayega.  
TDZ ek jaan-bujhkar banaya gaya safety feature hai: ye us bug ko pakadta hai jisme aap value dene se pehle variable use kar lete ho. \`var\` me TDZ nahi hota (jaldi access karo to bas \`undefined\`), aur yahi silent-bug behaviour rokne ke liye \`let\`/\`const\` banaye gaye.

**Key Interview Points**

* The window from the start of a block until the \`let\`/\`const\` declaration line.

* Accessing the variable in this window throws ReferenceError (not \`undefined\`).

* Applies to \`let\`, \`const\`, and \`class\`; \`var\` has no TDZ.

* It's a feature: it turns 'use-before-declare' from a silent bug into a loud error.

* \`typeof\` does NOT save you here — \`typeof x\` on a TDZ variable still throws.

**Real-World Example**

It's like a hotel room you've booked (reserved) but check-in time hasn't arrived. The room is assigned to you, but if you try to enter before check-in, security stops you — the room exists but is off-limits for now.

**Code — Full & Runnable**

// Shows the TDZ: accessing 'price' before its line throws ReferenceError.  
   
function tdzDemo() {  
  const events \= \[\];  
  try {  
    // 'price' is hoisted but in the TDZ here  
    events.push("read=" \+ price);  
  } catch (e) {  
    events.push("error=" \+ e.name); // ReferenceError  
  }  
  let price \= 100; // TDZ ends here  
  events.push("afterDeclare=" \+ price);  
  return events;  
}  
   
// var has NO TDZ for comparison  
function varNoTdz() {  
  const before \= qty; // undefined, no error  
  var qty \= 7;  
  return { before, after: qty };  
}  
   
module.exports \= { tdzDemo, varNoTdz };

**Test / Demo & Expected Output**

// \--- run: node test.js \---  
const { tdzDemo, varNoTdz } \= require("./solution");  
   
console.log(tdzDemo());  
console.log(varNoTdz());  
   
console.assert(tdzDemo()\[0\] \=== "error=ReferenceError", "let access in TDZ throws");  
console.assert(tdzDemo()\[1\] \=== "afterDeclare=100", "value available after line");  
console.assert(varNoTdz().before \=== undefined, "var has no TDZ");  
console.log("TDZ assertions passed.");  
   
/\* EXPECTED OUTPUT:  
\[ 'error=ReferenceError', 'afterDeclare=100' \]  
{ before: undefined, after: 7 }  
TDZ assertions passed.  
\*/

**Common Follow-up Questions**

**Q: Difference between TDZ ReferenceError and \`var\`'s undefined?**

**A:** \`var\` is silently \`undefined\` before assignment, hiding bugs. \`let\`/\`const\` throw a ReferenceError in the TDZ, surfacing the mistake immediately.

**Q: Does \`typeof\` avoid the TDZ error?**

**A:** No. \`typeof undeclaredName\` returns 'undefined', but \`typeof aLetInTDZ\` still throws a ReferenceError because the binding exists but is uninitialised.

## **9\. var vs let vs const**

**Simple Explanation (English)**

These three keywords declare variables but behave differently in three ways: scope, hoisting/TDZ, and re-assignment. \`var\` is function-scoped, hoisted as \`undefined\`, and can be redeclared. \`let\` and \`const\` are block-scoped and live in the TDZ until declared.

\`let\` allows re-assignment; \`const\` does not (the binding is fixed). Note that \`const\` makes the \*binding\* constant, not the value — a \`const\` object can still have its properties mutated. The modern best practice is: use \`const\` by default, \`let\` when you must reassign, and avoid \`var\`.

**Hinglish Explanation**

Teeno keywords variable declare karte hain par teen tarike se alag behave karte hain: scope, hoisting/TDZ, aur re-assignment. \`var\` function-scoped hota hai, \`undefined\` ke saath hoist hota hai, aur redeclare ho sakta hai. \`let\`/\`const\` block-scoped hote hain aur declare hone tak TDZ me rehte hain.  
\`let\` ko reassign kar sakte ho; \`const\` ko nahi (binding fixed hai). Dhyaan do — \`const\` binding ko constant banata hai, value ko nahi: ek \`const\` object ki properties abhi bhi change ho sakti hain. Best practice: default me \`const\` use karo, reassign chahiye to \`let\`, aur \`var\` se bacho.

**Key Interview Points**

* Scope: \`var\` is function-scoped; \`let\`/\`const\` are block-scoped ({ } blocks count).

* Hoisting: \`var\` → undefined; \`let\`/\`const\` → TDZ (ReferenceError if accessed early).

* Re-declaration: \`var\` allows it; \`let\`/\`const\` throw a SyntaxError on re-declare in the same scope.

* Re-assignment: \`var\` and \`let\` allow it; \`const\` does not (but objects/arrays remain mutable).

* Best practice: prefer \`const\`, use \`let\` when reassignment is needed, avoid \`var\`.

**Real-World Example**

The classic interview trap: a \`for\` loop creating 3 timers. With \`var\`, all callbacks share one variable and print the final value; with \`let\`, each iteration gets a fresh block-scoped binding and they print 0, 1, 2 correctly.

**Code — Full & Runnable**

// The famous loop-closure difference between var and let.  
   
function loopWithVar() {  
  const out \= \[\];  
  for (var i \= 0; i \< 3; i++) {  
    out.push(() \=\> i); // all closures share the SAME i  
  }  
  return out.map(fn \=\> fn()); // \[3,3,3\]  
}  
   
function loopWithLet() {  
  const out \= \[\];  
  for (let i \= 0; i \< 3; i++) {  
    out.push(() \=\> i); // each iteration: a fresh block-scoped i  
  }  
  return out.map(fn \=\> fn()); // \[0,1,2\]  
}  
   
// const fixes the binding, not the object contents.  
function constMutation() {  
  const user \= { name: "Asha" };  
  user.name \= "Ravi";       // allowed: mutating the object  
  let threw \= false;  
  try { /\* user \= {} \*/ eval("user \= {}"); } catch (e) { threw \= true; }  
  return { name: user.name, reassignThrew: threw };  
}  
   
module.exports \= { loopWithVar, loopWithLet, constMutation };

**Test / Demo & Expected Output**

// \--- run: node test.js \---  
const { loopWithVar, loopWithLet, constMutation } \= require("./solution");  
   
console.log("var loop:", loopWithVar());  
console.log("let loop:", loopWithLet());  
console.log("const:", constMutation());  
   
console.assert(JSON.stringify(loopWithVar()) \=== "\[3,3,3\]", "var shares one binding");  
console.assert(JSON.stringify(loopWithLet()) \=== "\[0,1,2\]", "let gives fresh bindings");  
console.assert(constMutation().name \=== "Ravi", "const object is mutable");  
console.assert(constMutation().reassignThrew \=== true, "const reassignment throws");  
console.log("var/let/const assertions passed.");  
   
/\* EXPECTED OUTPUT:  
var loop: \[ 3, 3, 3 \]  
let loop: \[ 0, 1, 2 \]  
const: { name: 'Ravi', reassignThrew: true }  
var/let/const assertions passed.  
\*/

**Common Follow-up Questions**

**Q: Does \`const\` make an object immutable?**

**A:** No. \`const\` only prevents re-assigning the variable. The object's properties can still change. Use \`Object.freeze()\` for shallow immutability of the contents.

**Q: Why does the \`var\` loop print the final value in all callbacks?**

**A:** Because \`var\` is function-scoped — there is a single \`i\` shared by all callbacks, and by the time they run the loop has finished, so \`i\` is its final value.

## **10\. 'use strict' Mode**

**Simple Explanation (English)**

Strict mode is an opt-in stricter variant of JavaScript, enabled by writing the string \`'use strict';\` at the top of a script or function. It changes some silent errors into thrown errors and disallows certain unsafe or confusing syntax.

Key effects: assigning to undeclared variables throws (instead of creating a global), duplicate parameter names are illegal, \`this\` inside a plain function call is \`undefined\` (not the global object), and writing to read-only properties throws. ES modules and class bodies are strict by default.

**Hinglish Explanation**

Strict mode JavaScript ka ek stricter version hai jo \`'use strict';\` likhkar enable hota hai (script ya function ke top par). Ye kuch silent errors ko actual errors bana deta hai aur kuch unsafe/confusing syntax ko band kar deta hai.  
Main effects: undeclared variable ko assign karne par error (global nahi banta), duplicate parameter names illegal, plain function call me \`this\` \`undefined\` ho jaata hai (global nahi), aur read-only property par likhne par error. ES modules aur class bodies by default strict hote hain.

**Key Interview Points**

* Enabled via \`'use strict';\` at the top of a file or function (must be the first statement).

* Assigning to an undeclared variable throws ReferenceError instead of creating a global.

* \`this\` in a plain function call is \`undefined\`, not the global object.

* Disallows duplicate parameter names and silent failed writes to read-only properties.

* ES modules and \`class\` bodies are always in strict mode automatically.

**Real-World Example**

It's like a code linter built into the language. A junior dev accidentally typing \`total \= 5\` (forgetting \`let\`) would silently create a global in sloppy mode; strict mode turns that typo into an immediate, debuggable error.

**Code — Full & Runnable**

"use strict";  
// In strict mode, assigning to an undeclared variable throws.  
   
function strictAssignThrows() {  
  try {  
    // 'undeclared' was never declared  
    eval('"use strict"; undeclaredXYZ \= 10;');  
    return "no error";  
  } catch (e) {  
    return e.name; // ReferenceError  
  }  
}  
   
function strictThis() {  
  // plain call \-\> 'this' is undefined in strict mode  
  return this; // undefined  
}  
   
module.exports \= { strictAssignThrows, strictThis };

**Test / Demo & Expected Output**

// \--- run: node test.js \---  
const { strictAssignThrows, strictThis } \= require("./solution");  
   
console.log("assign:", strictAssignThrows());  
console.log("this:", strictThis());  
   
console.assert(strictAssignThrows() \=== "ReferenceError", "undeclared assign throws");  
console.assert(strictThis() \=== undefined, "this is undefined in strict plain call");  
console.log("strict mode assertions passed.");  
   
/\* EXPECTED OUTPUT:  
assign: ReferenceError  
this: undefined  
strict mode assertions passed.  
\*/

**Common Follow-up Questions**

**Q: Do you need to write 'use strict' in ES modules?**

**A:** No. ES modules (and class bodies) are strict by default, so the directive is redundant there. It's mainly relevant in classic scripts and non-module functions.

**Q: Name two things strict mode changes.**

**A:** Assigning to an undeclared variable throws (instead of creating a global), and \`this\` in a plain function call is \`undefined\` instead of the global object.

## **11\. Stack vs Heap Memory**

**Simple Explanation (English)**

JavaScript stores data in two regions. The Stack holds primitive values (number, string, boolean, null, undefined, symbol, bigint) and references — it's small, fast, and organised in LIFO order. The Heap holds objects, arrays, and functions — larger, unordered, dynamically sized memory.

When you assign a primitive, the value is copied on the stack. When you assign an object, the stack stores a reference (a pointer) to the object that lives in the heap. This single distinction explains why primitives are copied by value and objects are 'copied' by reference.

**Hinglish Explanation**

JavaScript data ko do jagah store karta hai. Stack me primitive values (number, string, boolean, null, undefined, symbol, bigint) aur references rehte hain — chhota, fast, LIFO order me. Heap me objects, arrays, functions rehte hain — bada, unordered, dynamically sized.  
Jab aap primitive assign karte ho, value stack par copy hoti hai. Jab object assign karte ho, stack me ek reference (pointer) store hota hai jo heap me pade object ko point karta hai. Yahi ek baat samjhati hai ki primitives value se copy hote hain aur objects reference se.

**Key Interview Points**

* Stack: primitives \+ references; small, fast, LIFO, fixed-size slots.

* Heap: objects, arrays, functions; large, dynamic, unordered.

* Primitives are copied by value; objects are referenced (the reference is what's copied).

* Two variables can point to the SAME heap object → changing one affects the other.

* This underlies shallow vs deep copy, equality of objects, and mutation bugs.

**Real-World Example**

The stack is like a sticky note with a value written directly on it. The heap object is like a house, and the stack holds its address. Copying the sticky note address gives two notes pointing at the same house — repaint it and both 'see' the change.

**Code — Full & Runnable**

// Demonstrates value-copy (stack) vs reference-copy (heap).  
   
function primitiveCopy() {  
  let a \= 10;  
  let b \= a;   // value copied  
  b \= 20;      // changing b does NOT affect a  
  return { a, b };  
}  
   
function referenceCopy() {  
  const obj1 \= { count: 1 };  
  const obj2 \= obj1;     // reference copied (same heap object)  
  obj2.count \= 99;       // mutates the shared object  
  return { sameRef: obj1 \=== obj2, obj1count: obj1.count };  
}  
   
module.exports \= { primitiveCopy, referenceCopy };

**Test / Demo & Expected Output**

// \--- run: node test.js \---  
const { primitiveCopy, referenceCopy } \= require("./solution");  
   
console.log("primitive:", primitiveCopy());  
console.log("reference:", referenceCopy());  
   
console.assert(primitiveCopy().a \=== 10 && primitiveCopy().b \=== 20, "primitives copy by value");  
console.assert(referenceCopy().sameRef \=== true, "objects share reference");  
console.assert(referenceCopy().obj1count \=== 99, "mutation visible via both refs");  
console.log("stack/heap assertions passed.");  
   
/\* EXPECTED OUTPUT:  
primitive: { a: 10, b: 20 }  
reference: { sameRef: true, obj1count: 99 }  
stack/heap assertions passed.  
\*/

**Common Follow-up Questions**

**Q: Where are objects stored, and what is on the stack for them?**

**A:** The object itself lives on the heap; the stack holds only a reference (pointer) to that heap location.

**Q: Why does changing one variable change another?**

**A:** If both variables hold references to the same heap object, mutating the object through one reference is visible through the other — they point at the same memory.

## **12\. Primitive vs Reference Types**

**Simple Explanation (English)**

Primitive types (string, number, boolean, null, undefined, symbol, bigint) are immutable and compared by value. Reference types (objects, arrays, functions) are mutable and compared by reference (identity), not by their contents.

This means \`1 \=== 1\` is true and \`'a' \=== 'a'\` is true, but \`{} \=== {}\` is false because they are two different objects in memory even if they look identical. Function arguments follow the same rule: primitives are passed by value, objects effectively by a copied reference.

**Hinglish Explanation**

Primitive types (string, number, boolean, null, undefined, symbol, bigint) immutable hote hain aur value se compare hote hain. Reference types (objects, arrays, functions) mutable hote hain aur reference (identity) se compare hote hain, content se nahi.  
Iska matlab \`1 \=== 1\` true hai aur \`'a' \=== 'a'\` true hai, par \`{} \=== {}\` false hai kyunki memory me woh do alag objects hain bhale dikhne me same ho. Function arguments bhi same rule follow karte hain: primitives value se pass, objects ek copied reference se.

**Key Interview Points**

* 7 primitives: string, number, boolean, null, undefined, symbol, bigint.

* Primitives are immutable and compared by value.

* Objects/arrays/functions are reference types — compared by identity, not contents.

* \`{} \=== {}\` is false; the same object reference compared to itself is true.

* Passing to a function: primitives by value, objects by a copied reference (so mutations leak out).

**Real-World Example**

Two people with the same name aren't the same person — that's reference equality. Comparing objects with \`===\` checks 'are these the exact same person?', not 'do they look alike?'. To compare contents you need a deep-equality check.

**Code — Full & Runnable**

// Value equality (primitives) vs reference equality (objects).  
   
function compareTypes() {  
  const primEqual \= (1 \=== 1\) && ("a" \=== "a");  
  const objEqual  \= ({}) \=== ({});          // false: different objects  
  const obj \= { x: 1 };  
  const sameRef \= obj \=== obj;              // true: same reference  
  return { primEqual, objEqual, sameRef };  
}  
   
// Passing objects to functions lets mutations escape.  
function mutateArg(o) { o.touched \= true; }  
function passByReference() {  
  const data \= {};  
  mutateArg(data);  
  return data.touched; // true  
}  
   
module.exports \= { compareTypes, passByReference };

**Test / Demo & Expected Output**

// \--- run: node test.js \---  
const { compareTypes, passByReference } \= require("./solution");  
   
console.log(compareTypes());  
console.log("mutated:", passByReference());  
   
console.assert(compareTypes().primEqual \=== true, "primitives equal by value");  
console.assert(compareTypes().objEqual \=== false, "different objects not equal");  
console.assert(compareTypes().sameRef \=== true, "same reference equal");  
console.assert(passByReference() \=== true, "object arg mutated by callee");  
console.log("primitive/reference assertions passed.");  
   
/\* EXPECTED OUTPUT:  
{ primEqual: true, objEqual: false, sameRef: true }  
mutated: true  
primitive/reference assertions passed.  
\*/

**Common Follow-up Questions**

**Q: Is JavaScript pass-by-value or pass-by-reference?**

**A:** Technically always pass-by-value — but for objects the value passed is a copy of the reference, so the callee can mutate the shared object (though it cannot reassign the caller's variable).

**Q: How do you compare two objects by content?**

**A:** Use a deep-equality check — e.g. recursively compare keys/values, or \`JSON.stringify\` for simple JSON-safe objects (with caveats), or a utility like Lodash's \`isEqual\`.

## **13\. Garbage Collection Basics**

**Simple Explanation (English)**

Garbage Collection (GC) is the automatic process by which the JS engine frees memory that is no longer reachable. You don't manually free memory in JavaScript — the engine periodically reclaims objects that can no longer be accessed from the 'roots' (global object, the current call stack, etc.).

Modern engines (like V8) primarily use a mark-and-sweep algorithm: starting from the roots, they mark everything reachable, then sweep away everything unmarked. The practical takeaway is that 'memory leaks' in JS usually mean you accidentally kept references alive, preventing collection.

**Hinglish Explanation**

Garbage Collection (GC) woh automatic process hai jisse engine un memory ko free karta hai jo ab reachable nahi hai. JavaScript me aap manually memory free nahi karte — engine time-time par un objects ko reclaim karta hai jinhe 'roots' (global object, current call stack, etc.) se access nahi kiya ja sakta.  
Modern engines (jaise V8) mainly mark-and-sweep algorithm use karte hain: roots se shuru karke reachable sab kuch mark karte hain, phir unmarked sab sweep kar dete hain. Practical baat: JS me 'memory leak' aksar matlab aapne galti se koi reference zinda rakha jo collection rok raha hai.

**Key Interview Points**

* Memory is freed automatically — no manual free/delete in JavaScript.

* Core idea: reachability. Anything reachable from the roots is kept; the rest is collected.

* V8 uses mark-and-sweep (with generational, incremental optimisations).

* Setting a reference to \`null\` can make an object unreachable and collectible.

* Leaks come from unintended retained references (globals, closures, timers, detached DOM, caches).

**Real-World Example**

GC is like an office cleaning crew that throws out only the papers nobody can reach anymore. If you leave a sticky note ('keep this\!') on a pile, the crew won't bin it — that's how accidental references cause leaks.

**Code — Full & Runnable**

// We can't directly observe GC, but we can show reachability and weak refs.  
   
function reachability() {  
  let big \= { data: new Array(1000).fill("x") };  
  const weak \= new WeakRef(big);  
  const beforeNull \= weak.deref() \!== undefined; // reachable \-\> defined  
  big \= null; // now only the WeakRef points to it \-\> eligible for GC  
  return { beforeNull };  
}  
   
// FinalizationRegistry lets us learn when something was collected (best-effort).  
function makeRegistry(onClean) {  
  return new FinalizationRegistry(onClean);  
}  
   
module.exports \= { reachability, makeRegistry };

**Test / Demo & Expected Output**

// \--- run: node test.js \---  
const { reachability } \= require("./solution");  
   
const r \= reachability();  
console.log(r);  
   
console.assert(r.beforeNull \=== true, "object reachable before nulling");  
console.log("garbage collection assertions passed.");  
console.log("Note: actual reclamation timing is non-deterministic; GC runs when the engine decides.");  
   
/\* EXPECTED OUTPUT:  
{ beforeNull: true }  
garbage collection assertions passed.  
Note: actual reclamation timing is non-deterministic; GC runs when the engine decides.  
\*/

**Common Follow-up Questions**

**Q: What algorithm do modern JS engines use for GC?**

**A:** Primarily mark-and-sweep: mark everything reachable from the roots, then sweep (free) everything not marked. V8 layers on generational and incremental optimisations.

**Q: Does setting a variable to null guarantee immediate freeing?**

**A:** No. It removes one reference, making the object eligible for collection if nothing else references it, but the engine decides when to actually run GC.

## **14\. Memory Leaks Basics**

**Simple Explanation (English)**

A memory leak happens when memory that is no longer needed is never released because something still references it. In a garbage-collected language this means you've unintentionally kept an object reachable, so GC can't reclaim it.

Common causes: forgotten global variables, timers/intervals that are never cleared, event listeners not removed, closures that capture large objects, and growing caches with no eviction. Over time these inflate memory usage and can crash long-running apps (servers, single-page apps).

**Hinglish Explanation**

Memory leak tab hota hai jab zarurat khatam hone ke baad bhi memory release nahi hoti kyunki koi cheez abhi bhi use reference kar rahi hai. GC wali language me iska matlab aapne anjaane me koi object reachable rakh diya, isliye GC use free nahi kar paata.  
Common causes: bhoole hue global variables, timers/intervals jo clear nahi kiye, event listeners jo remove nahi kiye, closures jo bade objects pakad lete hain, aur badhte caches bina eviction ke. Dheere-dheere ye memory badha dete hain aur long-running apps (servers, SPAs) crash kara sakte hain.

**Key Interview Points**

* A leak \= unneeded memory kept alive by a lingering reference.

* Top causes: stray globals, uncleared timers, un-removed event listeners, retaining closures, unbounded caches.

* Detached DOM nodes still referenced in JS are a classic browser leak.

* Fixes: clear intervals, remove listeners, null out big references, bound your caches (or use WeakMap).

* Diagnose with heap snapshots / memory profilers in DevTools or Node's \--inspect.

**Real-World Example**

A single-page dashboard that opens a chart, sets a \`setInterval\` to refresh it, but never calls \`clearInterval\` when you navigate away. Each visit stacks another timer holding the old chart in memory — after an hour the tab is sluggish and bloated.

**Code — Full & Runnable**

// A leaky pattern vs a fixed one.  
   
function makeLeakyTimer(store) {  
  // BUG: interval keeps 'payload' alive forever, never cleared  
  const payload \= new Array(1000).fill("data");  
  const id \= setInterval(() \=\> { store.push(payload.length); }, 1000);  
  return id; // caller has no easy handle to stop it cleanly  
}  
   
function makeSafeTimer(store) {  
  const payload \= new Array(1000).fill("data");  
  const id \= setInterval(() \=\> { store.push(payload.length); }, 1000);  
  // return a disposer that clears the timer (prevents the leak)  
  return function dispose() { clearInterval(id); };  
}  
   
module.exports \= { makeSafeTimer };

**Test / Demo & Expected Output**

// \--- run: node test.js \---  
const { makeSafeTimer } \= require("./solution");  
   
const store \= \[\];  
const dispose \= makeSafeTimer(store);  
console.log("disposer is a function:", typeof dispose \=== "function");  
dispose(); // clean up immediately to avoid leaking in this test  
   
console.assert(typeof dispose \=== "function", "must return a disposer");  
console.log("memory-leak assertions passed.");  
process.exit(0); // ensure the test process ends  
   
/\* EXPECTED OUTPUT:  
disposer is a function: true  
memory-leak assertions passed.  
\*/

**Common Follow-up Questions**

**Q: Name three common sources of memory leaks in JS.**

**A:** Uncleared timers/intervals, event listeners that are never removed, and references retained in closures, globals, or unbounded caches (including detached DOM nodes in browsers).

**Q: How can WeakMap help prevent leaks?**

**A:** WeakMap holds keys weakly — if the only reference to a key object is the WeakMap entry, it can be garbage-collected, so caches keyed by objects don't keep them alive indefinitely.

## **15\. Scope Chain**

**Simple Explanation (English)**

Scope determines where a variable is accessible. The Scope Chain is the ordered list of environments JavaScript searches when resolving a variable: it looks in the current scope first, then the enclosing (outer) scope, and so on up to the global scope.

If the variable isn't found anywhere in the chain, you get a ReferenceError. The chain is built based on where functions are written in the source (lexical scope), not where they are called from. This is the mechanism that makes closures possible.

**Hinglish Explanation**

Scope decide karta hai ki variable kahan accessible hai. Scope Chain woh ordered list hai jisme JavaScript variable dhoondhta hai: pehle current scope, phir bahar wala (outer) scope, aise hi upar global scope tak.  
Agar variable poori chain me kahin na mile to ReferenceError aata hai. Ye chain is hisaab se banti hai ki function source me kahan likha gaya (lexical scope), kahan se call hua isse nahi. Yahi mechanism closures ko possible banata hai.

**Key Interview Points**

* Variable lookup goes inner → outer → ... → global, then throws if not found.

* Each function's outer reference links to where it was DEFINED (lexical), not called.

* Inner scopes can read outer variables; outer scopes cannot read inner ones.

* Shadowing: an inner variable with the same name hides the outer one.

* The scope chain is fixed at definition time — this is the basis of closures.

**Real-World Example**

Looking for a stapler: you check your own desk (local), then the team cabinet (outer), then the office supply room (global). You stop at the first place you find one. If nowhere has it, you 'throw' your hands up (ReferenceError).

**Code — Full & Runnable**

// Demonstrates scope-chain lookup and shadowing.  
   
const globalVal \= "global";  
   
function outer() {  
  const outerVal \= "outer";  
  function inner() {  
    const innerVal \= "inner";  
    // inner can reach all three via the scope chain  
    return \[innerVal, outerVal, globalVal\].join(" \> ");  
  }  
  return inner();  
}  
   
function shadowing() {  
  const name \= "outer-name";  
  function deep() {  
    const name \= "inner-name"; // shadows the outer 'name'  
    return name;  
  }  
  return { inner: deep(), outer: name };  
}  
   
module.exports \= { outer, shadowing };

**Test / Demo & Expected Output**

// \--- run: node test.js \---  
const { outer, shadowing } \= require("./solution");  
   
console.log(outer());  
console.log(shadowing());  
   
console.assert(outer() \=== "inner \> outer \> global", "scope chain resolves all levels");  
console.assert(shadowing().inner \=== "inner-name", "inner shadows outer");  
console.assert(shadowing().outer \=== "outer-name", "outer unaffected by shadowing");  
console.log("scope chain assertions passed.");  
   
/\* EXPECTED OUTPUT:  
inner \> outer \> global  
{ inner: 'inner-name', outer: 'outer-name' }  
scope chain assertions passed.  
\*/

**Common Follow-up Questions**

**Q: Is the scope chain based on where a function is called or defined?**

**A:** Where it is defined (lexical scoping). The outer reference is fixed at definition time, regardless of where or how the function is later called.

**Q: What happens if a variable isn't found in the entire scope chain?**

**A:** JavaScript throws a ReferenceError (in strict mode and for reads). In sloppy mode, an assignment to an undeclared name would instead create a global.

## **16\. Lexical Scope**

**Simple Explanation (English)**

Lexical (or static) scope means a variable's accessibility is determined by its physical location in the source code — by where blocks and functions are written, nesting-wise. The engine can determine the scope just by reading the code, before it ever runs.

Because scope is fixed by structure, an inner function always has access to the variables of the functions it is written inside, no matter where it is later called. JavaScript uses lexical scope (not dynamic scope), and this is precisely why closures behave so predictably.

**Hinglish Explanation**

Lexical (ya static) scope ka matlab hai variable ki accessibility uske source code me physical location se decide hoti hai — kaun se blocks/functions ke andar likha gaya hai. Engine sirf code padhkar hi scope decide kar sakta hai, run hone se pehle.  
Kyunki scope structure se fix hota hai, ek inner function ko hamesha un functions ke variables milte hain jinke andar woh likha gaya hai, chahe baad me kahin se bhi call ho. JavaScript lexical scope use karta hai (dynamic nahi), aur isiliye closures itne predictable hote hain.

**Key Interview Points**

* Scope is decided by code structure (where things are written), not by runtime call path.

* Also called static scope — determinable by reading the source.

* Inner functions can always access outer (enclosing) variables.

* JavaScript uses lexical scope, NOT dynamic scope.

* This is the theoretical foundation that makes closures work.

**Real-World Example**

Think of nested Russian dolls labelled in advance. A smaller doll knows exactly which larger dolls surround it because that was set when they were arranged — not based on who picks them up later.

**Code — Full & Runnable**

// Lexical scope: the inner function captures 'multiplier' from WHERE it's written.  
   
function makeMultiplier(multiplier) {  
  // 'multiply' is defined here, so it lexically sees 'multiplier'  
  return function multiply(n) {  
    return n \* multiplier;  
  };  
}  
   
// Even if we pass it around and call it elsewhere, it remembers 'multiplier'.  
function runElsewhere(fn, value) {  
  return fn(value); // call site has no 'multiplier' — proves lexical, not dynamic  
}  
   
module.exports \= { makeMultiplier, runElsewhere };

**Test / Demo & Expected Output**

// \--- run: node test.js \---  
const { makeMultiplier, runElsewhere } \= require("./solution");  
   
const triple \= makeMultiplier(3);  
console.log(triple(10));                 // 30  
console.log(runElsewhere(triple, 4));    // 12 (still uses multiplier=3)  
   
console.assert(triple(10) \=== 30, "captures multiplier=3");  
console.assert(runElsewhere(triple, 4\) \=== 12, "lexical scope, not dynamic");  
console.log("lexical scope assertions passed.");  
   
/\* EXPECTED OUTPUT:  
30  
12  
lexical scope assertions passed.  
\*/

**Common Follow-up Questions**

**Q: Difference between lexical and dynamic scope?**

**A:** Lexical scope resolves variables by where code is written (structure); dynamic scope would resolve by the runtime call stack. JavaScript uses lexical scope.

**Q: How does lexical scope enable closures?**

**A:** Because an inner function's access to outer variables is fixed by where it was defined, it keeps that access even after the outer function returns — which is exactly a closure.

## **17\. Closures**

**Simple Explanation (English)**

A closure is a function bundled together with references to the variables from its surrounding (lexical) scope. Even after the outer function has finished and its execution context is gone, the inner function still 'remembers' and can use those variables.

Closures are created every time a function is defined inside another function and that inner function is exposed (returned or passed out). They power data privacy, function factories, memoisation, currying, and event handlers — they are one of the most-asked interview topics.

**Hinglish Explanation**

Closure ek function hota hai jo apne surrounding (lexical) scope ke variables ke references ke saath bundle hota hai. Outer function khatam hone aur uska context chale jaane ke baad bhi, inner function un variables ko 'yaad' rakhta hai aur use kar sakta hai.  
Closure tab banta hai jab ek function dusre function ke andar define hota hai aur woh inner function bahar expose hota hai (return ya pass). Closures data privacy, function factories, memoisation, currying, aur event handlers ko power dete hain — interview ka favourite topic hai.

**Key Interview Points**

* A closure \= function \+ its retained lexical environment.

* Inner function keeps access to outer variables even after the outer function returns.

* Created whenever a nested function is exposed outward.

* Enables private state, factories, memoisation, currying, and stable callbacks.

* Each call to the outer function creates a fresh, independent closure.

**Real-World Example**

A bank account: the balance variable is hidden inside a function, and only the returned \`deposit\`/\`withdraw\` methods can touch it. Outside code can change the balance only through those methods — true private state via a closure.

**Code — Full & Runnable**

// Closure used for private state (a counter and a mini bank account).  
   
function createCounter(start \= 0\) {  
  let count \= start; // private; only the returned fns can access it  
  return {  
    inc: () \=\> \++count,  
    dec: () \=\> \--count,  
    value: () \=\> count,  
  };  
}  
   
function createAccount(initial) {  
  let balance \= initial; // truly private  
  return {  
    deposit(amt) { balance \+= amt; return balance; },  
    withdraw(amt) {  
      if (amt \> balance) throw new Error("Insufficient funds");  
      balance \-= amt; return balance;  
    },  
    getBalance: () \=\> balance,  
  };  
}  
   
module.exports \= { createCounter, createAccount };

**Test / Demo & Expected Output**

// \--- run: node test.js \---  
const { createCounter, createAccount } \= require("./solution");  
   
const c \= createCounter(10);  
console.log(c.inc(), c.inc(), c.dec(), c.value()); // 11 12 11 11  
   
const acc \= createAccount(100);  
console.log(acc.deposit(50)); // 150  
console.log(acc.withdraw(70)); // 80  
   
console.assert(c.value() \=== 11, "counter keeps private state");  
console.assert(acc.getBalance() \=== 80, "account balance correct");  
console.assert(typeof acc.balance \=== "undefined", "balance is private (not exposed)");  
let threw \= false; try { acc.withdraw(9999); } catch { threw \= true; }  
console.assert(threw, "overdraw should throw");  
console.log("closure assertions passed.");  
   
/\* EXPECTED OUTPUT:  
11 12 11 11  
150  
80  
closure assertions passed.  
\*/

**Common Follow-up Questions**

**Q: What exactly is captured by a closure — the value or the variable?**

**A:** The variable (the binding), not a snapshot of its value. That's why a closure sees later changes to the captured variable, and why the \`var\`-in-loop bug happens.

**Q: Name two practical uses of closures.**

**A:** Data privacy (private state via returned methods) and function factories/memoisation (a returned function that remembers configuration or cached results).

## **18\. Practical Closure Examples**

**Simple Explanation (English)**

Beyond the theory, closures solve real, everyday problems. The most common patterns are: function factories (build customised functions), memoisation (cache expensive results), the module pattern (private state with a public API), and once-only functions (run something a single time).

All of these rely on the same mechanic — an inner function retaining access to outer variables after the outer function has returned. Being able to write these from memory in an interview demonstrates real fluency, not just a textbook definition.

**Hinglish Explanation**

Theory ke alawa, closures real, rozmarra problems solve karte hain. Sabse common patterns hain: function factories (customised functions banao), memoisation (mehnga result cache karo), module pattern (private state \+ public API), aur once-only functions (kuch ek hi baar chalao).  
Ye sab same mechanic par chalte hain — inner function outer variables ka access outer function return hone ke baad bhi rakhta hai. Interview me inhe yaad se likhna asli fluency dikhata hai, sirf definition ratna nahi.

**Key Interview Points**

* Function factory: a function that returns customised functions (e.g. \`makeAdder(5)\`).

* Memoisation: cache results in a closed-over object/Map to skip repeat work.

* Module pattern: expose a public API while keeping helpers/state private.

* Once: wrap a function so it runs only the first time.

* All use the same idea: retained access to outer scope after return.

**Real-World Example**

Memoising an expensive API/price calculation: the first call computes and caches; repeated calls with the same input return instantly from the cache held in the closure — a real performance win in dashboards and search-as-you-type.

**Code — Full & Runnable**

// Three classic closure utilities.  
   
// 1\) Function factory  
function makeAdder(x) {  
  return (y) \=\> x \+ y;  
}  
   
// 2\) Memoise a single-argument pure function  
function memoize(fn) {  
  const cache \= new Map(); // private cache via closure  
  return function (arg) {  
    if (cache.has(arg)) return { value: cache.get(arg), cached: true };  
    const value \= fn(arg);  
    cache.set(arg, value);  
    return { value, cached: false };  
  };  
}  
   
// 3\) once(): run a function only the first time  
function once(fn) {  
  let called \= false, result;  
  return function (...args) {  
    if (\!called) { called \= true; result \= fn(...args); }  
    return result;  
  };  
}  
   
module.exports \= { makeAdder, memoize, once };

**Test / Demo & Expected Output**

// \--- run: node test.js \---  
const { makeAdder, memoize, once } \= require("./solution");  
   
const add10 \= makeAdder(10);  
console.log(add10(5)); // 15  
   
let calls \= 0;  
const square \= memoize((n) \=\> { calls++; return n \* n; });  
console.log(square(4)); // { value: 16, cached: false }  
console.log(square(4)); // { value: 16, cached: true }  
   
const init \= once(() \=\> \++calls);  
init(); init(); init();  
   
console.assert(add10(5) \=== 15, "factory works");  
console.assert(square(4).cached \=== true, "memo returns cached on repeat");  
console.assert(calls \=== 2, "square called once \+ once-init called once");  
console.log("practical closure assertions passed.");  
   
/\* EXPECTED OUTPUT:  
15  
{ value: 16, cached: false }  
{ value: 16, cached: true }  
practical closure assertions passed.  
\*/

**Common Follow-up Questions**

**Q: How does memoisation use closures?**

**A:** The cache (an object/Map) is declared in the outer function and captured by the returned inner function, so it persists across calls and stays private to that memoised function.

**Q: Why might too many closures be a concern?**

**A:** Each retains its captured variables in memory; capturing large objects unnecessarily can keep them alive and contribute to memory leaks if the closures themselves are long-lived.

## **19\. IIFE (Immediately Invoked Function Expression)**

**Simple Explanation (English)**

An IIFE is a function that is defined and called at the same time. You wrap a function in parentheses to turn it into an expression, then immediately invoke it with another pair of parentheses: \`(function(){ ... })();\`.

Historically, IIFEs were the main way to create a private scope and avoid polluting the global namespace (before \`let\`/\`const\` block scoping and ES modules existed). They're still useful for one-off initialisation and for creating isolated scopes inline.

**Hinglish Explanation**

IIFE ek function hota hai jo define hote hi turant call ho jaata hai. Function ko parentheses me wrap karke expression banate ho, phir doosre parentheses se turant invoke: \`(function(){ ... })();\`.  
Pehle IIFE private scope banane aur global namespace ganda hone se bachane ka main tareeka tha (jab \`let\`/\`const\` block scope aur ES modules nahi the). Aaj bhi one-off initialisation aur inline isolated scope ke liye useful hain.

**Key Interview Points**

* Syntax: \`(function(){ ... })();\` or \`(() \=\> { ... })();\`.

* Runs immediately upon definition — once.

* Creates a private scope; variables inside don't leak to the global scope.

* Historically used for module-like encapsulation before ES modules.

* Can return a value and can take arguments: \`((x) \=\> x\*2)(5)\`.

**Real-World Example**

Library bootstrapping: older libraries wrapped their entire code in one IIFE so their internal variables never clashed with the host page's globals — a self-contained capsule that runs and exposes only what it chooses.

**Code — Full & Runnable**

// IIFE creating a private, self-contained module result.  
   
const config \= (function () {  
  // these are private; not visible outside the IIFE  
  const secret \= "abc123";  
  const version \= 2;  
  return {  
    getVersion: () \=\> version,  
    masked: () \=\> "\*".repeat(secret.length),  
  };  
})();  
   
// IIFE that takes arguments and returns a value  
const computed \= ((a, b) \=\> a \* b \+ 1)(6, 7); // 43  
   
module.exports \= { config, computed };

**Test / Demo & Expected Output**

// \--- run: node test.js \---  
const { config, computed } \= require("./solution");  
   
console.log(config.getVersion()); // 2  
console.log(config.masked());     // \*\*\*\*\*\*  
console.log(computed);            // 43  
   
console.assert(config.getVersion() \=== 2, "IIFE exposes version");  
console.assert(config.masked() \=== "\*\*\*\*\*\*", "secret stays private, length 6");  
console.assert(typeof config.secret \=== "undefined", "secret not leaked");  
console.assert(computed \=== 43, "arg-taking IIFE returns value");  
console.log("IIFE assertions passed.");  
   
/\* EXPECTED OUTPUT:  
2  
\*\*\*\*\*\*  
43  
IIFE assertions passed.  
\*/

**Common Follow-up Questions**

**Q: Why wrap the function in parentheses?**

**A:** To force it to be parsed as an expression rather than a declaration, which then lets you invoke it immediately with the trailing \`()\`.

**Q: Are IIFEs still necessary today?**

**A:** Less so — \`let\`/\`const\` block scoping and ES modules now provide isolation. IIFEs remain handy for quick inline scoping, one-time setup, and \`async\` IIFEs to use \`await\` at top level in non-module scripts.

## **20\. Type Coercion**

**Simple Explanation (English)**

Type coercion is JavaScript automatically converting a value from one type to another. It happens implicitly (e.g. \`'5' \+ 1\` becomes \`'51'\`) or explicitly when you call \`Number()\`, \`String()\`, \`Boolean()\` yourself.

The trickiest rules involve the \`+\` operator (string concatenation wins if either side is a string) versus other arithmetic operators (which convert to numbers). Understanding coercion prevents a whole class of subtle bugs and is a very common interview gotcha.

**Hinglish Explanation**

Type coercion ka matlab JavaScript ka apne aap ek value ko ek type se doosre type me badalna. Ye implicitly hota hai (jaise \`'5' \+ 1\` ban jaata hai \`'51'\`) ya explicitly jab aap khud \`Number()\`, \`String()\`, \`Boolean()\` call karte ho.  
Sabse tricky rules \`+\` operator ke hain (agar ek side string ho to concatenation jeet jaata hai) vs baaki arithmetic operators (jo numbers me convert karte hain). Coercion samajhna bohot saare subtle bugs rok deta hai aur interview ka common gotcha hai.

**Key Interview Points**

* Implicit (automatic) vs explicit (\`Number()\`, \`String()\`, \`Boolean()\`) coercion.

* \`+\` with any string operand → string concatenation; \`-\`, \`\*\`, \`/\` → numeric coercion.

* \`'5' \+ 1\` → '51', but \`'5' \- 1\` → 4\.

* Booleans coerce in conditionals via truthy/falsy rules.

* Prefer explicit conversion and \`===\` to avoid surprises.

**Real-World Example**

A form field returns the string '10'. Doing \`total \= '10' \+ 5\` gives '105' (a display bug), while \`Number('10') \+ 5\` gives 15\. Knowing coercion is the difference between a working calculator and a broken one.

**Code — Full & Runnable**

// Demonstrates the \+/-/\* coercion rules and explicit conversion.  
   
function coercionExamples() {  
  return {  
    plusString: "5" \+ 1,     // "51"  (string concat)  
    minusNumber: "5" \- 1,    // 4     (numeric)  
    multiply: "6" \* "2",     // 12    (both to number)  
    boolAdd: true \+ 1,       // 2     (true \-\> 1\)  
    nullPlus: null \+ 1,      // 1     (null \-\> 0\)  
  };  
}  
   
function explicitConvert(input) {  
  return {  
    toNumber: Number(input),  
    toString: String(input),  
    toBoolean: Boolean(input),  
  };  
}  
   
module.exports \= { coercionExamples, explicitConvert };

**Test / Demo & Expected Output**

// \--- run: node test.js \---  
const { coercionExamples, explicitConvert } \= require("./solution");  
   
console.log(coercionExamples());  
console.log(explicitConvert("42"));  
   
const c \= coercionExamples();  
console.assert(c.plusString \=== "51", "+ with string concatenates");  
console.assert(c.minusNumber \=== 4, "- coerces to number");  
console.assert(c.multiply \=== 12, "\* coerces both to number");  
console.assert(c.boolAdd \=== 2, "true coerces to 1");  
console.assert(c.nullPlus \=== 1, "null coerces to 0");  
console.assert(explicitConvert("42").toNumber \=== 42, "Number('42')===42");  
console.log("type coercion assertions passed.");  
   
/\* EXPECTED OUTPUT:  
{ plusString: '51', minusNumber: 4, multiply: 12, boolAdd: 2, nullPlus: 1 }  
{ toNumber: 42, toString: '42', toBoolean: true }  
type coercion assertions passed.  
\*/

**Common Follow-up Questions**

**Q: Why does \`'5' \+ 1\` differ from \`'5' \- 1\`?**

**A:** \`+\` is overloaded for string concatenation, so a string operand makes the whole thing a string ('51'). \`-\` has no string meaning, so both operands coerce to numbers (4).

**Q: How do you avoid coercion bugs?**

**A:** Convert inputs explicitly with \`Number()\`/\`String()\`/\`Boolean()\` and compare with \`===\` instead of \`==\`, which performs implicit coercion.

## **21\. Equality (== vs \===) & Truthy/Falsy**

**Simple Explanation (English)**

\`==\` is loose equality: it coerces the operands to a common type before comparing, which leads to surprising results (\`0 \== ''\` is true). \`===\` is strict equality: it compares both type and value with no coercion, and is the recommended default.

Separately, every value is either truthy or falsy in a boolean context. The falsy values are exactly: \`false\`, \`0\`, \`-0\`, \`0n\`, \`''\`, \`null\`, \`undefined\`, and \`NaN\`. Everything else (including \`'0'\`, \`\[\]\`, and \`{}\`) is truthy.

**Hinglish Explanation**

\`==\` loose equality hai: compare karne se pehle operands ko ek common type me coerce karta hai, jisse ajeeb results aate hain (\`0 \== ''\` true hota hai). \`===\` strict equality hai: type aur value dono ko bina coercion compare karta hai, aur yahi recommended default hai.  
Alag se, har value boolean context me ya truthy hoti hai ya falsy. Falsy values bilkul ye hain: \`false\`, \`0\`, \`-0\`, \`0n\`, \`''\`, \`null\`, \`undefined\`, aur \`NaN\`. Baaki sab (including \`'0'\`, \`\[\]\`, \`{}\`) truthy hain.

**Key Interview Points**

* \`==\` coerces types before comparing; \`===\` does not (compares type \+ value).

* Always prefer \`===\` unless you specifically need loose comparison.

* The 8 falsy values: false, 0, \-0, 0n, '' , null, undefined, NaN.

* Everything else is truthy — including '0', 'false', \[\], and {}.

* \`null \== undefined\` is true, but \`null \=== undefined\` is false.

**Real-World Example**

Validating user input: \`if (input)\` treats an empty string as falsy, so a blank field is caught. But beware \`if (count)\` where \`count\` could legitimately be \`0\` — that would wrongly treat zero as 'no value'.

**Code — Full & Runnable**

// Equality comparisons and a falsy detector.  
   
function equalityChecks() {  
  return {  
    looseZeroEmpty: (0 \== ""),        // true (coercion)  
    strictZeroEmpty: (0 \=== ""),      // false  
    looseNullUndef: (null \== undefined),  // true  
    strictNullUndef: (null \=== undefined), // false  
  };  
}  
   
const FALSY \= \[false, 0, \-0, 0n, "", null, undefined, NaN\];  
function isFalsy(v) {  
  // Boolean(v) is false exactly for the falsy values  
  return \!v;  
}  
   
module.exports \= { equalityChecks, isFalsy, FALSY };

**Test / Demo & Expected Output**

// \--- run: node test.js \---  
const { equalityChecks, isFalsy, FALSY } \= require("./solution");  
   
console.log(equalityChecks());  
   
const e \= equalityChecks();  
console.assert(e.looseZeroEmpty \=== true, "0 \== '' is true");  
console.assert(e.strictZeroEmpty \=== false, "0 \=== '' is false");  
console.assert(e.looseNullUndef \=== true, "null \== undefined");  
console.assert(e.strictNullUndef \=== false, "null \!== undefined strictly");  
   
// every documented falsy value is falsy:  
console.assert(FALSY.every(isFalsy), "all listed values are falsy");  
// truthy counter-examples:  
console.assert(\["0", \[\], {}, "false"\].every(v \=\> \!isFalsy(v)), "these are truthy");  
console.log("equality & truthy/falsy assertions passed.");  
   
/\* EXPECTED OUTPUT:  
{  
  looseZeroEmpty: true,  
  strictZeroEmpty: false,  
  looseNullUndef: true,  
  strictNullUndef: false  
}  
equality & truthy/falsy assertions passed.  
\*/

**Common Follow-up Questions**

**Q: List the falsy values in JavaScript.**

**A:** false, 0, \-0, 0n (BigInt zero), '' (empty string), null, undefined, and NaN. Everything else is truthy.

**Q: Is \`\[\] \== false\` true? Why?**

**A:** Yes. \`\[\]\` coerces to '' then to 0, and \`false\` coerces to 0, so loosely they're equal. With \`===\` it would be false. This is why \`==\` is discouraged.

## **22\. NaN & Floating-Point Precision**

**Simple Explanation (English)**

\`NaN\` ('Not a Number') is a special numeric value representing an invalid or undefined numeric result, like \`0/0\` or \`Number('abc')\`. Its defining quirk: \`NaN\` is not equal to anything, including itself — so \`NaN \=== NaN\` is false. Use \`Number.isNaN()\` to test for it.

Separately, JavaScript numbers are 64-bit IEEE-754 floats, so some decimals can't be represented exactly. The classic example is \`0.1 \+ 0.2 \=== 0.3\` being false (it's 0.30000000000000004). For money and precise comparisons, round or use integer cents / a decimal library.

**Hinglish Explanation**

\`NaN\` ('Not a Number') ek special numeric value hai jo invalid ya undefined numeric result darshaata hai, jaise \`0/0\` ya \`Number('abc')\`. Iska sabse bada quirk: \`NaN\` kisi ke barabar nahi, khud ke bhi nahi — isliye \`NaN \=== NaN\` false hai. Test karne ke liye \`Number.isNaN()\` use karo.  
Alag se, JavaScript numbers 64-bit IEEE-754 floats hain, isliye kuch decimals exactly represent nahi ho paate. Classic example: \`0.1 \+ 0.2 \=== 0.3\` false hota hai (woh 0.30000000000000004 hai). Paise aur precise comparisons ke liye round karo ya integer cents / decimal library use karo.

**Key Interview Points**

* \`NaN\` represents an invalid numeric result (0/0, Number('abc')).

* \`NaN \=== NaN\` is false — NaN is not equal to anything, even itself.

* Test with \`Number.isNaN(x)\` (safer than the global \`isNaN\`, which coerces).

* Numbers are IEEE-754 doubles → some decimals are inexact (0.1 \+ 0.2 \!== 0.3).

* For comparisons, use an epsilon (\`Number.EPSILON\`); for money, use integer cents or a decimal lib.

**Real-World Example**

An e-commerce cart that checks \`if (total \=== 0.3)\` after adding 0.1 \+ 0.2 worth of items would silently fail. Rounding to 2 decimals (or storing prices as integer paise/cents) prevents the customer seeing a wrong total.

**Code — Full & Runnable**

// NaN detection and safe float comparison.  
   
function nanFacts(x) {  
  return {  
    isSelfEqual: x \=== x,            // false when x is NaN  
    builtin: Number.isNaN(x),        // true only for actual NaN  
  };  
}  
   
function floatProblem() {  
  return {  
    naive: (0.1 \+ 0.2) \=== 0.3,      // false  
    actual: 0.1 \+ 0.2,               // 0.30000000000000004  
  };  
}  
   
function nearlyEqual(a, b, eps \= Number.EPSILON) {  
  return Math.abs(a \- b) \< eps \* 10;  
}  
   
module.exports \= { nanFacts, floatProblem, nearlyEqual };

**Test / Demo & Expected Output**

// \--- run: node test.js \---  
const { nanFacts, floatProblem, nearlyEqual } \= require("./solution");  
   
console.log(nanFacts(NaN));  
console.log(floatProblem());  
console.log("safe compare:", nearlyEqual(0.1 \+ 0.2, 0.3));  
   
console.assert(nanFacts(NaN).isSelfEqual \=== false, "NaN \!== NaN");  
console.assert(nanFacts(NaN).builtin \=== true, "Number.isNaN detects NaN");  
console.assert(nanFacts(123).builtin \=== false, "123 is not NaN");  
console.assert(floatProblem().naive \=== false, "0.1+0.2 \!== 0.3");  
console.assert(nearlyEqual(0.1 \+ 0.2, 0.3) \=== true, "epsilon compare works");  
console.log("NaN & float assertions passed.");  
   
/\* EXPECTED OUTPUT:  
{ isSelfEqual: false, builtin: true }  
{ naive: false, actual: 0.30000000000000004 }  
safe compare: true  
NaN & float assertions passed.  
\*/

**Common Follow-up Questions**

**Q: How do you reliably check if a value is NaN?**

**A:** Use \`Number.isNaN(x)\`. Avoid the global \`isNaN()\`, which coerces its argument (so \`isNaN('abc')\` is true). You can also exploit \`x \!== x\`, which is true only for NaN.

**Q: Why is \`0.1 \+ 0.2 \!== 0.3\`?**

**A:** Numbers use binary IEEE-754 floating point, and 0.1/0.2/0.3 have no exact binary representation, so rounding errors accumulate. Compare with an epsilon tolerance or use integer/decimal techniques.

## **23\. BigInt**

**Simple Explanation (English)**

\`BigInt\` is a primitive type for integers of arbitrary size, beyond the safe integer limit of regular numbers (\`Number.MAX\_SAFE\_INTEGER\`, about 9 quadrillion). You create one by appending \`n\` to an integer literal (\`123n\`) or calling \`BigInt(123)\`.

BigInts support normal arithmetic among themselves but cannot be mixed directly with regular numbers (\`1n \+ 1\` throws a TypeError) — you must convert explicitly. They're used for very large IDs, high-precision counters, cryptography, and timestamps in nanoseconds.

**Hinglish Explanation**

\`BigInt\` ek primitive type hai bilkul bade integers ke liye, jo normal number ki safe limit (\`Number.MAX\_SAFE\_INTEGER\`, lagbhag 9 quadrillion) se aage jaate hain. Banane ke liye integer ke aage \`n\` lagao (\`123n\`) ya \`BigInt(123)\` call karo.  
BigInts aapas me normal arithmetic karte hain par seedhe regular numbers ke saath mix nahi ho sakte (\`1n \+ 1\` TypeError deta hai) — explicitly convert karna padta hai. Inka use bohot bade IDs, high-precision counters, cryptography, aur nanosecond timestamps me hota hai.

**Key Interview Points**

* A primitive for arbitrarily large integers; \`typeof 1n\` is 'bigint'.

* Create via literal \`10n\` or \`BigInt(10)\`.

* Cannot mix BigInt and Number in arithmetic without explicit conversion (TypeError otherwise).

* No decimals — BigInt is integers only.

* Use cases: large IDs, precise counters, crypto, beyond MAX\_SAFE\_INTEGER values.

**Real-World Example**

Twitter/X snowflake IDs and many database 64-bit IDs exceed JS's safe integer range; reading them as a regular Number silently corrupts the last digits. Storing them as BigInt (or string) keeps the exact value.

**Code — Full & Runnable**

// BigInt for values beyond MAX\_SAFE\_INTEGER.  
   
function safeLimitDemo() {  
  const max \= Number.MAX\_SAFE\_INTEGER;     // 9007199254740991  
  const numberWrong \= max \+ 2;             // loses precision  
  const bigRight \= BigInt(max) \+ 2n;       // exact  
  return {  
    typeofBig: typeof 10n,                 // "bigint"  
    bigRight: bigRight.toString(),         // exact string  
    precisionLost: (numberWrong \=== max \+ 1\) // true: \+ 2 collapsed  
  };  
}  
   
function safeAdd(numA, numB) {  
  // explicit conversion to mix safely  
  return BigInt(numA) \+ BigInt(numB);  
}  
   
module.exports \= { safeLimitDemo, safeAdd };

**Test / Demo & Expected Output**

// \--- run: node test.js \---  
const { safeLimitDemo, safeAdd } \= require("./solution");  
   
console.log(safeLimitDemo());  
console.log(safeAdd(5, 7).toString()); // 12  
   
const d \= safeLimitDemo();  
console.assert(d.typeofBig \=== "bigint", "typeof 10n is bigint");  
console.assert(d.bigRight \=== "9007199254740993", "BigInt keeps precision");  
console.assert(safeAdd(5, 7\) \=== 12n, "BigInt addition");  
   
let threw \= false;  
try { /\* mixing throws \*/ const x \= 1n \+ 1; } catch { threw \= true; }  
console.assert(threw, "mixing BigInt and Number throws TypeError");  
console.log("BigInt assertions passed.");  
   
/\* EXPECTED OUTPUT:  
{ typeofBig: 'bigint', bigRight: '9007199254740993', precisionLost: true }  
12  
BigInt assertions passed.  
\*/

**Common Follow-up Questions**

**Q: Can you add a BigInt and a Number directly?**

**A:** No — \`1n \+ 1\` throws a TypeError. You must convert explicitly, e.g. \`1n \+ BigInt(1)\` or \`Number(1n) \+ 1\`, being mindful of precision loss when converting down to Number.

**Q: When would you reach for BigInt?**

**A:** When you need exact integers larger than \`Number.MAX\_SAFE\_INTEGER\` — large database/snowflake IDs, cryptography, high-resolution counters, or precise nanosecond timestamps.

## **24\. Symbol**

**Simple Explanation (English)**

\`Symbol\` is a primitive type that produces a guaranteed-unique value every time you call \`Symbol()\`. Two symbols are never equal, even with the same description (\`Symbol('id') \!== Symbol('id')\`). This makes them ideal as collision-proof object keys.

Symbols are used to add 'hidden' properties that won't clash with normal string keys and aren't returned by \`Object.keys()\` or \`for...in\`. JavaScript also has well-known symbols (like \`Symbol.iterator\`) that let you hook into built-in language behaviour.

**Hinglish Explanation**

\`Symbol\` ek primitive type hai jo har baar \`Symbol()\` call karne par ek guaranteed-unique value deta hai. Do symbols kabhi equal nahi hote, same description ke saath bhi (\`Symbol('id') \!== Symbol('id')\`). Isliye ye collision-proof object keys ke liye perfect hain.  
Symbols se aise 'hidden' properties add hoti hain jo normal string keys se clash nahi karti aur \`Object.keys()\` ya \`for...in\` me nahi aati. JavaScript me well-known symbols bhi hain (jaise \`Symbol.iterator\`) jinse aap built-in language behaviour me hook kar sakte ho.

**Key Interview Points**

* Every \`Symbol()\` call returns a unique value; \`typeof sym\` is 'symbol'.

* Same description does NOT make symbols equal.

* Great as unique, non-colliding object property keys.

* Symbol-keyed properties are skipped by \`Object.keys\` and \`for...in\` (use \`Object.getOwnPropertySymbols\`).

* Well-known symbols (e.g. \`Symbol.iterator\`) customise built-in behaviour.

**Real-World Example**

A library wants to tag objects with metadata without risking a clash with the user's own properties. Using a Symbol key guarantees the tag can't collide with any string key the user adds, even one literally named 'id'.

**Code — Full & Runnable**

// Symbols as unique, non-enumerable-by-default keys.  
   
function symbolUniqueness() {  
  const a \= Symbol("id");  
  const b \= Symbol("id");  
  return { equal: a \=== b, type: typeof a }; // { equal:false, type:'symbol' }  
}  
   
function hiddenKey() {  
  const ID \= Symbol("id");  
  const user \= { name: "Asha", \[ID\]: 42 };  
  return {  
    stringKeys: Object.keys(user),                  // \['name'\] only  
    symbolValue: user\[ID\],                          // 42  
    symbolKeysCount: Object.getOwnPropertySymbols(user).length, // 1  
  };  
}  
   
module.exports \= { symbolUniqueness, hiddenKey };

**Test / Demo & Expected Output**

// \--- run: node test.js \---  
const { symbolUniqueness, hiddenKey } \= require("./solution");  
   
console.log(symbolUniqueness());  
console.log(hiddenKey());  
   
console.assert(symbolUniqueness().equal \=== false, "symbols always unique");  
console.assert(symbolUniqueness().type \=== "symbol", "typeof symbol");  
const h \= hiddenKey();  
console.assert(JSON.stringify(h.stringKeys) \=== '\["name"\]', "symbol key hidden from keys()");  
console.assert(h.symbolValue \=== 42, "symbol value accessible directly");  
console.assert(h.symbolKeysCount \=== 1, "one symbol key present");  
console.log("Symbol assertions passed.");  
   
/\* EXPECTED OUTPUT:  
{ equal: false, type: 'symbol' }  
{ stringKeys: \[ 'name' \], symbolValue: 42, symbolKeysCount: 1 }  
Symbol assertions passed.  
\*/

**Common Follow-up Questions**

**Q: Are two symbols with the same description equal?**

**A:** No. Each \`Symbol()\` call is unique. (The exception is \`Symbol.for('x')\`, which uses a global registry and returns the same symbol for the same key.)

**Q: Why use a Symbol as an object key?**

**A:** To create a property that is guaranteed not to collide with any string key and that is hidden from \`Object.keys\`/\`for...in\`/\`JSON.stringify\`, which is useful for library metadata or private-ish fields.

## **25\. Higher-Order Functions**

**Simple Explanation (English)**

A Higher-Order Function (HOF) is a function that does at least one of two things: takes another function as an argument, or returns a function. They are the backbone of functional programming in JavaScript.

You use HOFs constantly: \`map\`, \`filter\`, \`reduce\`, \`forEach\`, and \`sort\` all accept callback functions, and function factories (like \`makeMultiplier\`) return functions. HOFs enable reusable, composable, declarative code instead of repetitive loops.

**Hinglish Explanation**

Higher-Order Function (HOF) woh function hai jo do me se kam se kam ek kaam karta hai: ya to doosre function ko argument me leta hai, ya ek function return karta hai. Ye JavaScript me functional programming ki reedh ki haddi hain.  
Aap HOFs roz use karte ho: \`map\`, \`filter\`, \`reduce\`, \`forEach\`, \`sort\` sab callback functions lete hain, aur function factories (jaise \`makeMultiplier\`) functions return karte hain. HOFs reusable, composable, declarative code dete hain — baar-baar loops likhne ke bajaye.

**Key Interview Points**

* An HOF either takes a function as an argument or returns a function (or both).

* Built-in HOFs: map, filter, reduce, forEach, sort, some, every, find.

* Function factories that return customised functions are HOFs.

* They enable composition, reuse, and declarative style over manual loops.

* Callbacks passed to HOFs are 'first-class functions' — values you can pass around.

**Real-World Example**

Processing a list of orders: \`orders.filter(o \=\> o.paid).map(o \=\> o.total).reduce((a,b) \=\> a+b, 0)\` reads like a sentence — 'take paid orders, get their totals, sum them' — replacing a verbose manual loop with clear, chainable steps.

**Code — Full & Runnable**

// HOFs: taking functions, returning functions, and composing them.  
   
// 1\) Takes a function as argument  
function applyTwice(fn, value) {  
  return fn(fn(value));  
}  
   
// 2\) Returns a function  
function multiplier(factor) {  
  return (n) \=\> n \* factor;  
}  
   
// 3\) compose: build a pipeline from several functions  
function compose(...fns) {  
  return (input) \=\> fns.reduceRight((acc, fn) \=\> fn(acc), input);  
}  
   
// 4\) Real data pipeline using built-in HOFs  
function totalPaid(orders) {  
  return orders  
    .filter((o) \=\> o.paid)  
    .map((o) \=\> o.total)  
    .reduce((sum, t) \=\> sum \+ t, 0);  
}  
   
module.exports \= { applyTwice, multiplier, compose, totalPaid };

**Test / Demo & Expected Output**

// \--- run: node test.js \---  
const { applyTwice, multiplier, compose, totalPaid } \= require("./solution");  
   
const double \= multiplier(2);  
console.log(applyTwice(double, 5));          // 20  
const addThenDouble \= compose(double, (x) \=\> x \+ 1);  
console.log(addThenDouble(4));               // double(4+1)=10  
   
const orders \= \[  
  { total: 100, paid: true },  
  { total: 50, paid: false },  
  { total: 30, paid: true },  
\];  
console.log("paid total:", totalPaid(orders)); // 130  
   
console.assert(applyTwice(double, 5\) \=== 20, "applyTwice doubles twice");  
console.assert(addThenDouble(4) \=== 10, "compose applies right-to-left");  
console.assert(totalPaid(orders) \=== 130, "filter+map+reduce pipeline");  
console.log("higher-order function assertions passed.");  
   
/\* EXPECTED OUTPUT:  
20  
10  
paid total: 130  
higher-order function assertions passed.  
\*/

**Common Follow-up Questions**

**Q: What makes a function 'higher-order'?**

**A:** It takes one or more functions as arguments and/or returns a function. Examples include \`map\`/\`filter\`/\`reduce\` (take callbacks) and factories like \`multiplier\` (return a function).

**Q: What are 'first-class functions' and how do they relate to HOFs?**

**A:** First-class functions means functions are values — they can be stored, passed, and returned. That language feature is exactly what makes higher-order functions possible.