**JavaScript Foundations**

Interview Preparation — Study Guide

Phase 1A  •  Topics 76–103

*Each topic includes: plain-English \+ Hinglish explanation, key interview points,*

*a real-world example, complete runnable code, tests with expected output, and follow-up Q\&A.*

Run any code sample with:  node filename.js  
**Contents**

# **Phase 1A — JavaScript Foundations (Topics 76–103)**

This batch covers the advanced promises (race/allSettled/any), async/await and error handling, the event loop (micro/macrotask queues), timers and rAF, DOM and browser rendering, event propagation and delegation, debouncing/throttling, fetch and AbortController, regex, web storage, cookies, CORS, polyfills, and from-scratch implementations of map/filter/reduce, debounce, and throttle. Browser-only APIs show real browser code plus a runnable Node logic demo.

## **76\. Promise.race**

**Simple Explanation (English)**

\`Promise.race(\[...\])\` returns a promise that settles as soon as the FIRST input promise settles — whether it fulfils or rejects. It adopts that first settled promise's value or reason and ignores the rest (which keep running but are discarded).

The classic use is timeouts: race a real operation against a promise that rejects after N milliseconds, so whichever happens first wins. Be aware it settles on the first to FINISH, success or failure alike — unlike \`Promise.any\`, which waits for the first SUCCESS.

**Hinglish Explanation**

\`Promise.race(\[...\])\` ek promise return karta hai jo tab settle hota hai jab PEHLA input promise settle ho — chahe woh fulfil ho ya reject. Woh us pehle settled promise ki value/reason le leta hai aur baaki ignore kar deta hai (jo chalte rehte hain par discard).  
Classic use timeouts hai: ek real operation ko ek aise promise se race karwao jo N milliseconds baad reject ho, taaki jo pehle ho woh jeete. Dhyaan rakho ye pehle FINISH hone wale par settle hota hai, success ya failure dono — \`Promise.any\` ke विपरीत, jo pehle SUCCESS ka wait karta hai.

**Key Interview Points**

* Settles with the first promise to settle (fulfil OR reject).

* Other promises keep running but their outcomes are ignored.

* Primary use: timeouts (race an op against a timer rejection).

* Differs from \`any\` (first success) and \`all\` (all successes).

* An empty array → the promise never settles.

**Real-World Example**

Adding a timeout to a slow network request: \`Promise.race(\[fetch(url), timeout(5000)\])\` rejects after 5s if the fetch hasn't completed, letting you show a 'taking too long' message.

**Code — Full & Runnable**

// Promise.race for a timeout wrapper.  
   
const after \= (value, ms) \=\> new Promise((r) \=\> setTimeout(() \=\> r(value), ms));  
const timeout \= (ms) \=\> new Promise((\_, rej) \=\>  
  setTimeout(() \=\> rej(new Error("timeout")), ms));  
   
function withTimeout(promise, ms) {  
  return Promise.race(\[promise, timeout(ms)\]);  
}  
   
module.exports \= { after, withTimeout };

**Test / Demo & Expected Output**

// \--- run: node test.js \---  
const { after, withTimeout } \= require("./solution");  
   
// fast op beats the timeout  
withTimeout(after("done", 5), 50).then((v) \=\> {  
  console.log("won:", v); // done  
  console.assert(v \=== "done", "fast op wins the race");  
   
  // slow op loses to the timeout  
  withTimeout(after("slow", 50), 5).catch((err) \=\> {  
    console.log("lost:", err.message); // timeout  
    console.assert(err.message \=== "timeout", "timeout wins when op is slow");  
    console.log("Promise.race assertions passed.");  
  });  
});  
   
/\* EXPECTED OUTPUT:  
won: done  
lost: timeout  
Promise.race assertions passed.  
\*/

**Common Follow-up Questions**

**Q: Does Promise.race wait for a successful result?**

**A:** No. It settles with the first promise to settle, whether that's a fulfilment or a rejection. If you need the first success specifically, use \`Promise.any\`.

**Q: What's a common real-world use of Promise.race?**

**A:** Implementing timeouts — racing an operation against a timer that rejects, so the slower one is abandoned and you can fail fast or show a fallback.

## **77\. Promise.allSettled**

**Simple Explanation (English)**

\`Promise.allSettled(\[...\])\` waits for ALL input promises to settle (whether fulfilled or rejected) and never short-circuits. It fulfils with an array of result objects, each describing one promise's outcome.

Each result is \`{ status: 'fulfilled', value }\` or \`{ status: 'rejected', reason }\`. This is the right choice when you want every result regardless of individual failures — unlike \`Promise.all\`, which rejects the moment any one fails.

**Hinglish Explanation**

\`Promise.allSettled(\[...\])\` SAARE input promises ke settle hone ka wait karta hai (chahe fulfil ho ya reject) aur kabhi short-circuit nahi karta. Ye result objects ke array ke saath fulfil hota hai, har ek kisi ek promise ka outcome batata hai.  
Har result ya \`{ status: 'fulfilled', value }\` hota hai ya \`{ status: 'rejected', reason }\`. Ye tab sahi choice hai jab aapko individual failures ke bawajood har result chahiye — \`Promise.all\` ke विपरीत, jo koi ek fail hote hi reject ho jaata hai.

**Key Interview Points**

* Waits for ALL promises to settle; never rejects/short-circuits.

* Fulfils with an array of \`{status, value}\` or \`{status, reason}\` objects.

* Use when you want every outcome, including failures.

* Contrast with \`Promise.all\` (fail-fast on first rejection).

* Great for batch operations where partial success is acceptable.

**Real-World Example**

Uploading several files at once and reporting which succeeded and which failed: \`allSettled\` gives you the full per-file outcome so you can show '3 uploaded, 1 failed' instead of aborting the whole batch on the first error.

**Code — Full & Runnable**

// Promise.allSettled collects every outcome.  
   
const ok \= (v) \=\> Promise.resolve(v);  
const fail \= (m) \=\> Promise.reject(new Error(m));  
   
function batch() {  
  return Promise.allSettled(\[ok("a"), fail("bad"), ok("c")\])  
    .then((results) \=\> results.map((r) \=\>  
      r.status \=== "fulfilled" ? "ok:" \+ r.value : "err:" \+ r.reason.message  
    ));  
}  
   
module.exports \= { batch };

**Test / Demo & Expected Output**

// \--- run: node test.js \---  
const { batch } \= require("./solution");  
   
batch().then((summary) \=\> {  
  console.log(summary); // \['ok:a','err:bad','ok:c'\]  
  console.assert(JSON.stringify(summary) \=== '\["ok:a","err:bad","ok:c"\]', "all outcomes collected");  
  console.assert(summary.length \=== 3, "no short-circuit; every promise reported");  
  console.log("Promise.allSettled assertions passed.");  
});  
   
/\* EXPECTED OUTPUT:  
\[ 'ok:a', 'err:bad', 'ok:c' \]  
Promise.allSettled assertions passed.  
\*/

**Common Follow-up Questions**

**Q: How does allSettled differ from all?**

**A:** \`all\` rejects as soon as any promise rejects (fail-fast). \`allSettled\` always waits for every promise and reports each outcome as fulfilled or rejected — it never rejects itself.

**Q: What shape are allSettled's results?**

**A:** An array of objects: \`{ status: 'fulfilled', value }\` for successes and \`{ status: 'rejected', reason }\` for failures, in input order.

## **78\. Promise.any**

**Simple Explanation (English)**

\`Promise.any(\[...\])\` fulfils with the value of the FIRST promise to FULFIL (succeed), ignoring rejections along the way. It's effectively 'give me the first success'.

It only rejects if EVERY promise rejects, in which case it rejects with an \`AggregateError\` containing all the individual reasons. Contrast with \`Promise.race\` (first to settle, success or failure) and \`Promise.all\` (all must succeed).

**Hinglish Explanation**

\`Promise.any(\[...\])\` PEHLE FULFIL (succeed) hone wale promise ki value ke saath fulfil hota hai, beech ke rejections ignore karte hue. Ye basically 'mujhe pehla success do' hai.  
Ye tabhi reject hota hai jab HAR promise reject ho, us case me ek \`AggregateError\` ke saath jisme saare individual reasons hote hain. \`Promise.race\` (pehle settle, success ya failure) aur \`Promise.all\` (sabko succeed karna hai) se compare karo.

**Key Interview Points**

* Fulfils with the first promise to FULFIL; ignores rejections.

* Rejects only if ALL reject — with an \`AggregateError\` of reasons.

* Differs from \`race\` (first to settle) and \`all\` (all must succeed).

* Use for redundancy: first responsive source wins.

* AggregateError's \`.errors\` array holds every rejection reason.

**Real-World Example**

Fetching the same resource from several mirrors/CDNs and using whichever responds successfully first: \`Promise.any(\[cdn1, cdn2, cdn3\])\` returns the first good response and only fails if every mirror is down.

**Code — Full & Runnable**

// Promise.any returns the first SUCCESS.  
   
const okAfter \= (v, ms) \=\> new Promise((r) \=\> setTimeout(() \=\> r(v), ms));  
const failAfter \= (m, ms) \=\> new Promise((\_, rej) \=\>  
  setTimeout(() \=\> rej(new Error(m)), ms));  
   
function firstSuccess() {  
  return Promise.any(\[  
    failAfter("down1", 5),  
    okAfter("mirror2", 10),  
    failAfter("down3", 1),  
  \]); // resolves to "mirror2" (first to FULFIL)  
}  
   
function allFail() {  
  return Promise.any(\[failAfter("a", 1), failAfter("b", 2)\])  
    .catch((err) \=\> err.constructor.name); // "AggregateError"  
}  
   
module.exports \= { firstSuccess, allFail };

**Test / Demo & Expected Output**

// \--- run: node test.js \---  
const { firstSuccess, allFail } \= require("./solution");  
   
firstSuccess().then((v) \=\> {  
  console.log("first success:", v); // mirror2  
  console.assert(v \=== "mirror2", "ignores rejections, takes first success");  
   
  allFail().then((name) \=\> {  
    console.log("when all fail:", name); // AggregateError  
    console.assert(name \=== "AggregateError", "rejects with AggregateError if all fail");  
    console.log("Promise.any assertions passed.");  
  });  
});  
   
/\* EXPECTED OUTPUT:  
first success: mirror2  
when all fail: AggregateError  
Promise.any assertions passed.  
\*/

**Common Follow-up Questions**

**Q: When does Promise.any reject?**

**A:** Only when every promise rejects. It then rejects with an \`AggregateError\` whose \`.errors\` array contains all the individual rejection reasons.

**Q: Difference between any and race?**

**A:** \`any\` resolves with the first fulfilment and ignores rejections; \`race\` settles with the first promise to settle, even if that's a rejection.

## **79\. async / await**

**Simple Explanation (English)**

\`async\`/\`await\` is syntactic sugar over promises that lets you write asynchronous code that reads like synchronous, top-to-bottom code. An \`async\` function always returns a promise, and \`await\` pauses the function until the awaited promise settles, then resumes with its value.

It eliminates \`.then\` chains and callback nesting, making async logic clearer. \`await\` only works inside \`async\` functions (or at the top level of an ES module). Under the hood it's still promises — \`await\` just suspends and resumes the function.

**Hinglish Explanation**

\`async\`/\`await\` promises ke upar syntactic sugar hai jo aapko asynchronous code synchronous, upar-se-neeche code ki tarah likhne deta hai. Ek \`async\` function hamesha ek promise return karta hai, aur \`await\` function ko tab tak pause karta hai jab tak awaited promise settle na ho, phir uski value ke saath resume hota hai.  
Ye \`.then\` chains aur callback nesting hata deta hai, jisse async logic clear ho jaata hai. \`await\` sirf \`async\` functions ke andar (ya ES module ke top level par) chalta hai. Andar se ye abhi bhi promises hi hai — \`await\` bas function ko suspend aur resume karta hai.

**Key Interview Points**

* \`async\` functions always return a promise.

* \`await\` pauses until the promise settles, then yields its value.

* Reads like synchronous code; removes \`.then\` nesting.

* \`await\` is only valid inside \`async\` (or ESM top level).

* Still promises underneath — \`await\` suspends/resumes the function.

**Real-World Example**

Loading a user then their orders sequentially: \`const user \= await getUser(id); const orders \= await getOrders(user.id);\` — two clean lines instead of a nested \`.then\` chain.

**Code — Full & Runnable**

// async/await over promises, sequential and parallel.  
   
const get \= (v, ms \= 0\) \=\> new Promise((r) \=\> setTimeout(() \=\> r(v), ms));  
   
async function sequential() {  
  const a \= await get("a", 5);  
  const b \= await get(a \+ "b", 5);  
  return b; // "ab"  
}  
   
async function parallel() {  
  // start both, then await together (faster than sequential awaits)  
  const \[x, y\] \= await Promise.all(\[get("x", 5), get("y", 5)\]);  
  return x \+ y; // "xy"  
}  
   
async function returnsPromise() { return 42; } // wraps in a promise  
   
module.exports \= { sequential, parallel, returnsPromise };

**Test / Demo & Expected Output**

// \--- run: node test.js \---  
const { sequential, parallel, returnsPromise } \= require("./solution");  
   
(async () \=\> {  
  console.log(await sequential()); // ab  
  console.log(await parallel());   // xy  
  const p \= returnsPromise();  
  console.log(p instanceof Promise, await p); // true 42  
   
  console.assert(await sequential() \=== "ab", "sequential awaits");  
  console.assert(await parallel() \=== "xy", "parallel with Promise.all");  
  console.assert(returnsPromise() instanceof Promise, "async returns a promise");  
  console.log("async/await assertions passed.");  
})();  
   
/\* EXPECTED OUTPUT:  
ab  
xy  
true 42  
async/await assertions passed.  
\*/

**Common Follow-up Questions**

**Q: What does an async function return?**

**A:** Always a promise. A returned value becomes the resolved value; a thrown error becomes a rejection. Even \`return 42\` resolves to a promise of 42\.

**Q: How do you run independent awaits in parallel?**

**A:** Start them first (or wrap in \`Promise.all\`) rather than awaiting one before starting the next. \`await Promise.all(\[a(), b()\])\` runs them concurrently instead of sequentially.

## **80\. Error Handling in async/await**

**Simple Explanation (English)**

With async/await you handle errors using ordinary \`try...catch\`. An \`await\`ed promise that rejects throws inside the async function, so the rejection is caught by the surrounding \`catch\` block — making async error handling look just like synchronous error handling.

Patterns: wrap awaits in try/catch; remember that a rejected promise you don't await (or catch) becomes an unhandled rejection; and for parallel work, decide between \`Promise.all\` (fail-fast) and \`allSettled\` (collect all). You can also \`.catch()\` on the call site of an async function.

**Hinglish Explanation**

async/await ke saath aap errors ko aam \`try...catch\` se handle karte ho. Ek \`await\` kiya hua promise jo reject hota hai, async function ke andar throw karta hai, isliye rejection surrounding \`catch\` block pakad leta hai — jisse async error handling bilkul synchronous jaisa dikhta hai.  
Patterns: awaits ko try/catch me wrap karo; yaad rakho jise await/catch nahi karte woh rejected promise unhandled rejection ban jaata hai; aur parallel work ke liye \`Promise.all\` (fail-fast) ya \`allSettled\` (sab collect) choose karo. Async function ke call site par \`.catch()\` bhi laga sakte ho.

**Key Interview Points**

* Use \`try...catch\` around \`await\`ed calls — rejections throw locally.

* A rejected awaited promise behaves like a thrown error.

* Unawaited/uncaught rejections become unhandled rejections.

* \`finally\` works too — for cleanup after success or failure.

* Choose Promise.all vs allSettled for parallel error semantics.

**Real-World Example**

An API handler that awaits a DB call inside try/catch: on failure it logs the error and returns a 500 response instead of crashing the server — the same shape as synchronous error handling.

**Code — Full & Runnable**

// try/catch with await, plus a safe wrapper utility.  
   
const get \= (v, ms \= 0, fail \= false) \=\> new Promise((res, rej) \=\>  
  setTimeout(() \=\> (fail ? rej(new Error(v)) : res(v)), ms));  
   
async function load(fail) {  
  try {  
    const data \= await get("data", 0, fail);  
    return { ok: true, data };  
  } catch (err) {  
    return { ok: false, error: err.message };  
  } finally {  
    // cleanup always runs (omitted side effect here)  
  }  
}  
   
// "errors-as-values" helper: never throws, returns \[error, result\]  
async function to(promise) {  
  try { return \[null, await promise\]; }  
  catch (err) { return \[err, null\]; }  
}  
   
module.exports \= { get, load, to };

**Test / Demo & Expected Output**

// \--- run: node test.js \---  
const { get, load, to } \= require("./solution");  
   
(async () \=\> {  
  console.log(await load(false)); // { ok:true, data:'data' }  
  console.log(await load(true));  // { ok:false, error:'data' }  
   
  const \[err, val\] \= await to(get("v", 0));  
  console.log(err, val); // null v  
  const \[err2\] \= await to(get("boom", 0, true));  
  console.log(err2.message); // boom  
   
  console.assert((await load(false)).ok \=== true, "success path");  
  console.assert((await load(true)).ok \=== false, "catch handles rejection");  
  console.assert((await to(get("v", 0)))\[1\] \=== "v", "to() returns value");  
  console.log("async error handling assertions passed.");  
})();  
   
/\* EXPECTED OUTPUT:  
{ ok: true, data: 'data' }  
{ ok: false, error: 'data' }  
null v  
boom  
async error handling assertions passed.  
\*/

**Common Follow-up Questions**

**Q: How do you catch errors from an awaited promise?**

**A:** Wrap the \`await\` in a \`try...catch\`. A rejected awaited promise throws inside the async function, so the \`catch\` block handles it like any synchronous error.

**Q: What is an unhandled promise rejection?**

**A:** A rejected promise that's never awaited or \`.catch()\`-ed. It triggers an 'unhandledRejection' warning/event and, in modern Node, can crash the process if unaddressed.

## **81\. Event Loop**

**Simple Explanation (English)**

The event loop is the mechanism that lets single-threaded JavaScript handle asynchronous work without blocking. When the call stack is empty, the event loop pulls queued callbacks and runs them, one at a time.

The key rule of ordering: after each synchronous task (and after the current stack empties), ALL microtasks (promise callbacks) are drained before the next macrotask (like a \`setTimeout\` callback) runs. This is why promise \`.then\` callbacks fire before \`setTimeout(...,0)\` callbacks.

**Hinglish Explanation**

Event loop woh mechanism hai jo single-threaded JavaScript ko asynchronous work bina block kiye handle karne deta hai. Jab call stack khaali hota hai, event loop queued callbacks utha kar ek-ek karke chalata hai.  
Ordering ka key rule: har synchronous task ke baad (aur current stack khaali hone ke baad), SAARE microtasks (promise callbacks) drain hote hain agle macrotask (jaise \`setTimeout\` callback) se pehle. Isiliye promise \`.then\` callbacks \`setTimeout(...,0)\` callbacks se pehle chalti hain.

**Key Interview Points**

* Coordinates async callbacks on JS's single thread.

* Runs queued callbacks only when the call stack is empty.

* After each task, ALL microtasks drain before the next macrotask.

* Microtasks: promise callbacks, queueMicrotask, MutationObserver.

* Macrotasks: setTimeout/setInterval, I/O, UI events.

**Real-World Example**

A subtle bug where a promise-based state update appears to happen 'before' a setTimeout-based one, regardless of delays — understanding the microtask-before-macrotask rule explains the ordering and prevents incorrect timing assumptions.

**Code — Full & Runnable**

// Demonstrating event-loop ordering deterministically.  
   
function ordering() {  
  return new Promise((resolve) \=\> {  
    const order \= \[\];  
    order.push("sync-1");  
    setTimeout(() \=\> order.push("macro-timeout"), 0);   // macrotask  
    Promise.resolve().then(() \=\> order.push("micro-promise")); // microtask  
    queueMicrotask(() \=\> order.push("micro-queue"));     // microtask  
    order.push("sync-2");  
    // allow the loop to drain micro then macro:  
    setTimeout(() \=\> resolve(order), 5);  
  });  
}  
   
module.exports \= { ordering };

**Test / Demo & Expected Output**

// \--- run: node test.js \---  
const { ordering } \= require("./solution");  
   
ordering().then((order) \=\> {  
  console.log(order);  
  // sync first, then microtasks, then the macrotask  
  console.assert(order\[0\] \=== "sync-1" && order\[1\] \=== "sync-2", "sync runs first");  
  const microP \= order.indexOf("micro-promise");  
  const microQ \= order.indexOf("micro-queue");  
  const macro \= order.indexOf("macro-timeout");  
  console.assert(microP \< macro && microQ \< macro, "microtasks before macrotask");  
  console.log("event loop assertions passed.");  
});  
   
/\* EXPECTED OUTPUT:  
\[ 'sync-1', 'sync-2', 'micro-promise', 'micro-queue', 'macro-timeout' \]  
event loop assertions passed.  
\*/

**Common Follow-up Questions**

**Q: Why does a promise callback run before setTimeout(fn, 0)?**

**A:** Promise callbacks are microtasks, and the event loop drains the entire microtask queue after the current task before running the next macrotask (the setTimeout callback). Microtasks always have priority.

**Q: When does the event loop run queued callbacks?**

**A:** When the call stack is empty. It then processes microtasks fully, then one macrotask, then microtasks again, repeating this cycle.

## **82\. Microtask Queue**

**Simple Explanation (English)**

The microtask queue holds callbacks that should run as soon as possible after the current synchronous code finishes, but before any macrotask or rendering. Promise reactions (\`.then\`/\`.catch\`/\`.finally\`), \`await\` continuations, \`queueMicrotask\`, and MutationObserver callbacks are microtasks.

Critically, the engine drains the ENTIRE microtask queue (including microtasks scheduled by other microtasks) before moving on. This gives promises their high-priority, predictable timing — but an endlessly self-scheduling microtask can starve macrotasks and freeze the app.

**Hinglish Explanation**

Microtask queue un callbacks ko rakhti hai jo current synchronous code khatam hote hi jitni jaldi ho sake chalein, par kisi macrotask ya rendering se pehle. Promise reactions (\`.then\`/\`.catch\`/\`.finally\`), \`await\` continuations, \`queueMicrotask\`, aur MutationObserver callbacks microtasks hain.  
Important: engine POORI microtask queue drain karta hai (un microtasks sahit jo doosre microtasks ne schedule kiye) aage badhne se pehle. Isse promises ko high-priority, predictable timing milti hai — par endlessly khud ko schedule karne wala microtask macrotasks ko starve karke app freeze kar sakta hai.

**Key Interview Points**

* Holds promise reactions, await continuations, queueMicrotask, MutationObserver.

* Runs after current sync code, before any macrotask or rendering.

* The WHOLE queue is drained each cycle, including newly added microtasks.

* Gives promises their high-priority, deterministic ordering.

* Infinite microtask loops can starve macrotasks (UI freeze).

**Real-World Example**

Batching DOM reads/writes or state updates to apply right after current code but before the browser paints uses the microtask timing — frameworks rely on this to coalesce updates efficiently.

**Code — Full & Runnable**

// Microtasks drain fully before macrotasks; nested microtasks still run first.  
   
function drainOrder() {  
  return new Promise((resolve) \=\> {  
    const order \= \[\];  
    setTimeout(() \=\> order.push("macro"), 0);  
    Promise.resolve().then(() \=\> {  
      order.push("micro-1");  
      Promise.resolve().then(() \=\> order.push("micro-2-nested")); // added during drain  
    });  
    setTimeout(() \=\> resolve(order), 5);  
  });  
}  
   
module.exports \= { drainOrder };

**Test / Demo & Expected Output**

// \--- run: node test.js \---  
const { drainOrder } \= require("./solution");  
   
drainOrder().then((order) \=\> {  
  console.log(order); // \['micro-1','micro-2-nested','macro'\]  
  console.assert(order\[0\] \=== "micro-1", "first microtask runs");  
  console.assert(order\[1\] \=== "micro-2-nested", "nested microtask drains before macrotask");  
  console.assert(order\[2\] \=== "macro", "macrotask runs after all microtasks");  
  console.log("microtask queue assertions passed.");  
});  
   
/\* EXPECTED OUTPUT:  
\[ 'micro-1', 'micro-2-nested', 'macro' \]  
microtask queue assertions passed.  
\*/

**Common Follow-up Questions**

**Q: What kinds of callbacks are microtasks?**

**A:** Promise reactions (\`.then\`/\`.catch\`/\`.finally\`), \`await\` continuations, \`queueMicrotask\` callbacks, and MutationObserver callbacks.

**Q: Can microtasks starve macrotasks?**

**A:** Yes. Because the entire microtask queue (including microtasks added during draining) runs before the next macrotask, an endlessly self-scheduling microtask can block timers, I/O, and rendering.

## **83\. Macrotask Queue**

**Simple Explanation (English)**

The macrotask queue (also called the task queue or callback queue) holds callbacks scheduled by things like \`setTimeout\`, \`setInterval\`, I/O completion, and UI events. The event loop runs ONE macrotask per cycle, then drains all microtasks, then (in browsers) may render, before taking the next macrotask.

This is why even \`setTimeout(fn, 0)\` doesn't run immediately: it's queued as a macrotask and must wait for the current task and all pending microtasks. The '0ms' is a minimum, not a guarantee — the browser also enforces a minimum clamp for nested timers.

**Hinglish Explanation**

Macrotask queue (task queue ya callback queue bhi kehte hain) un callbacks ko rakhti hai jo \`setTimeout\`, \`setInterval\`, I/O completion, aur UI events jaise cheezein schedule karti hain. Event loop per cycle EK macrotask chalata hai, phir saare microtasks drain karta hai, phir (browsers me) render kar sakta hai, agla macrotask lene se pehle.  
Isiliye \`setTimeout(fn, 0)\` bhi turant nahi chalta: ye macrotask ki tarah queue hota hai aur current task \+ saare pending microtasks ka wait karta hai. '0ms' ek minimum hai, guarantee nahi — browser nested timers ke liye minimum clamp bhi lagaata hai.

**Key Interview Points**

* Holds setTimeout/setInterval, I/O, and UI event callbacks.

* One macrotask runs per event-loop cycle.

* After each macrotask, all microtasks drain (then possibly a render).

* \`setTimeout(fn,0)\` is deferred — minimum delay, not immediate.

* Browsers clamp nested timers to a minimum (\~4ms).

**Real-World Example**

Breaking up a heavy computation with \`setTimeout(chunk, 0)\` between chunks lets the browser process UI events and repaint between macrotasks, keeping the page responsive during long work.

**Code — Full & Runnable**

// Macrotasks run one per cycle; microtasks interleave between them.  
   
function interleave() {  
  return new Promise((resolve) \=\> {  
    const order \= \[\];  
    setTimeout(() \=\> {  
      order.push("macro-1");  
      Promise.resolve().then(() \=\> order.push("micro-after-macro-1"));  
    }, 0);  
    setTimeout(() \=\> {  
      order.push("macro-2");  
      resolve(order);  
    }, 5);  
  });  
}  
   
module.exports \= { interleave };

**Test / Demo & Expected Output**

// \--- run: node test.js \---  
const { interleave } \= require("./solution");  
   
interleave().then((order) \=\> {  
  console.log(order); // \['macro-1','micro-after-macro-1','macro-2'\]  
  console.assert(order\[0\] \=== "macro-1", "first macrotask");  
  console.assert(order\[1\] \=== "micro-after-macro-1", "microtask drains before next macrotask");  
  console.assert(order\[2\] \=== "macro-2", "second macrotask after microtasks");  
  console.log("macrotask queue assertions passed.");  
});  
   
/\* EXPECTED OUTPUT:  
\[ 'macro-1', 'micro-after-macro-1', 'macro-2' \]  
macrotask queue assertions passed.  
\*/

**Common Follow-up Questions**

**Q: Why doesn't setTimeout(fn, 0\) run immediately?**

**A:** It schedules a macrotask, which must wait for the current task to finish and all pending microtasks to drain. The 0ms is a minimum delay, not an instruction to run synchronously.

**Q: How many macrotasks run per event-loop cycle?**

**A:** One. After running a single macrotask, the loop drains the entire microtask queue (and may render in browsers) before picking the next macrotask.

## **84\. setTimeout / setInterval**

**Simple Explanation (English)**

\`setTimeout(fn, delay)\` schedules a function to run once after at least \`delay\` milliseconds. \`setInterval(fn, delay)\` runs a function repeatedly every \`delay\` milliseconds until cleared. Both return an id used to cancel them with \`clearTimeout\`/\`clearInterval\`.

The delay is a minimum, not exact — the callback only runs once the call stack is clear and it's the function's turn in the macrotask queue. Always clear intervals you no longer need to avoid leaks, and remember any extra arguments after the delay are passed to the callback.

**Hinglish Explanation**

\`setTimeout(fn, delay)\` ek function ko kam se kam \`delay\` milliseconds baad ek baar chalane ke liye schedule karta hai. \`setInterval(fn, delay)\` ek function ko har \`delay\` milliseconds par baar-baar chalata hai jab tak clear na ho. Dono ek id return karte hain jise \`clearTimeout\`/\`clearInterval\` se cancel karte ho.  
Delay minimum hai, exact nahi — callback tabhi chalta hai jab call stack clear ho aur macrotask queue me uski baari aaye. Jo intervals zarurat nahi unhe hamesha clear karo (leak se bachne), aur yaad rakho delay ke baad ke extra arguments callback ko pass hote hain.

**Key Interview Points**

* \`setTimeout\` runs once after a minimum delay; \`setInterval\` repeats.

* Both return ids; cancel with \`clearTimeout\`/\`clearInterval\`.

* Delay is a minimum (macrotask), not a precise schedule.

* Always clear intervals you no longer need (prevent leaks).

* Extra args after the delay are forwarded to the callback.

**Real-World Example**

A 'session expiring soon' banner shown after N minutes uses setTimeout; a live clock that ticks every second uses setInterval (and is cleared when the component unmounts to avoid leaks).

**Code — Full & Runnable**

// Promise-based delay built on setTimeout \+ a self-clearing interval.  
   
function delay(ms) {  
  return new Promise((resolve) \=\> setTimeout(resolve, ms));  
}  
   
// Run a callback N times every interval, then stop automatically.  
function repeat(times, intervalMs, onTick) {  
  return new Promise((resolve) \=\> {  
    let count \= 0;  
    const id \= setInterval(() \=\> {  
      count++;  
      onTick(count);  
      if (count \>= times) { clearInterval(id); resolve(count); }  
    }, intervalMs);  
  });  
}  
   
module.exports \= { delay, repeat };

**Test / Demo & Expected Output**

// \--- run: node test.js \---  
const { delay, repeat } \= require("./solution");  
   
(async () \=\> {  
  const start \= Date.now();  
  await delay(20);  
  console.log("waited at least 20ms:", Date.now() \- start \>= 18);  
   
  const ticks \= \[\];  
  const total \= await repeat(3, 5, (n) \=\> ticks.push(n));  
  console.log("ticks:", ticks, "total:", total); // \[1,2,3\] 3  
   
  console.assert(Date.now() \- start \>= 18, "delay waited");  
  console.assert(JSON.stringify(ticks) \=== "\[1,2,3\]", "interval ran 3 times");  
  console.assert(total \=== 3, "interval auto-cleared after 3");  
  console.log("setTimeout/setInterval assertions passed.");  
})();  
   
/\* EXPECTED OUTPUT:  
waited at least 20ms: true  
ticks: \[ 1, 2, 3 \] total: 3  
setTimeout/setInterval assertions passed.  
\*/

**Common Follow-up Questions**

**Q: Is the setTimeout delay exact?**

**A:** No, it's a minimum. The callback is queued as a macrotask and only runs after the stack clears and earlier tasks/microtasks finish, so actual delay can be longer.

**Q: Why must you clear intervals?**

**A:** An uncleared \`setInterval\` keeps firing forever and keeps its closure (and any captured data) alive, causing memory leaks and wasted work — especially in SPAs when components unmount.

## **85\. requestAnimationFrame**

**Simple Explanation (English)**

\`requestAnimationFrame(callback)\` (rAF) schedules a callback to run right before the browser's next repaint — typically about 60 times per second, matching the display's refresh rate. It's the correct tool for smooth animations, instead of \`setInterval\`.

rAF gives your callback a high-resolution timestamp and automatically pauses in background tabs (saving battery and CPU). For continuous animation you call \`requestAnimationFrame\` again inside the callback, creating a render loop synced to the display.

**Hinglish Explanation**

\`requestAnimationFrame(callback)\` (rAF) ek callback ko browser ke agle repaint se thik pehle chalane ke liye schedule karta hai — aam taur par lagbhag 60 baar per second, display ke refresh rate se match karte hue. Smooth animations ke liye ye sahi tool hai, \`setInterval\` ke bajaye.  
rAF aapke callback ko ek high-resolution timestamp deta hai aur background tabs me automatically pause ho jaata hai (battery aur CPU bachata hai). Continuous animation ke liye callback ke andar dobara \`requestAnimationFrame\` call karte ho, jisse display se synced ek render loop banta hai.

**Key Interview Points**

* Runs the callback just before the next repaint (\~60fps, display-synced).

* Preferred over setInterval for animations (smoother, no tearing).

* Callback receives a high-resolution timestamp (DOMHighResTimeStamp).

* Auto-pauses in inactive/background tabs (saves resources).

* Loop by calling rAF again inside the callback; cancel with cancelAnimationFrame.

**Real-World Example**

Animating a progress bar or a canvas game loop: rAF keeps motion smooth and synced to the screen, and pauses when the tab is hidden — far better than a fixed setInterval that can stutter or waste cycles.

**Code — Full & Runnable**

// Browser code (runs in a browser):  
//  
//   let x \= 0;  
//   function step(timestamp) {  
//     x \+= 2;  
//     box.style.transform \= "translateX(" \+ x \+ "px)";  
//     if (x \< 300\) requestAnimationFrame(step); // loop until done  
//   }  
//   requestAnimationFrame(step);  
//  
// Node has no rAF, so we provide a tiny polyfill to DEMONSTRATE the loop logic.  
   
const raf \= (typeof requestAnimationFrame \=== "function")  
  ? requestAnimationFrame  
  : (cb) \=\> setTimeout(() \=\> cb(Date.now()), 16); // \~60fps fallback  
   
function animateTo(target, stepSize \= 2\) {  
  return new Promise((resolve) \=\> {  
    let x \= 0;  
    const frames \= \[\];  
    function step() {  
      x \+= stepSize;  
      frames.push(x);  
      if (x \< target) raf(step);  
      else resolve(frames);  
    }  
    raf(step);  
  });  
}  
   
module.exports \= { animateTo };

**Test / Demo & Expected Output**

// \--- run: node test.js (uses a setTimeout-based rAF fallback) \---  
const { animateTo } \= require("./solution");  
   
animateTo(10, 2).then((frames) \=\> {  
  console.log("frames:", frames); // \[2,4,6,8,10\]  
  console.assert(frames\[frames.length \- 1\] \>= 10, "animation reaches target");  
  console.assert(frames.length \=== 5, "5 frames of size 2 to reach 10");  
  console.log("requestAnimationFrame assertions passed.");  
  console.log("Note: in a real browser rAF syncs to the display refresh (\~60fps).");  
});  
   
/\* EXPECTED OUTPUT:  
frames: \[ 2, 4, 6, 8, 10 \]  
requestAnimationFrame assertions passed.  
Note: in a real browser rAF syncs to the display refresh (\~60fps).  
\*/

**Common Follow-up Questions**

**Q: Why use requestAnimationFrame instead of setInterval for animation?**

**A:** rAF syncs to the display's refresh rate for smooth, tear-free motion, gives a precise timestamp, and pauses in background tabs — whereas setInterval can stutter, drift, and waste CPU when hidden.

**Q: How do you create a continuous animation loop with rAF?**

**A:** Call \`requestAnimationFrame(step)\` again from inside the \`step\` callback until the animation is done, and use \`cancelAnimationFrame(id)\` to stop it.

## **86\. DOM Manipulation**

**Simple Explanation (English)**

The DOM (Document Object Model) is the browser's in-memory tree representation of the HTML page. DOM manipulation means selecting elements and changing their content, attributes, styles, or structure with JavaScript so the page updates dynamically.

Core APIs: select with \`querySelector\`/\`querySelectorAll\`/\`getElementById\`; read/write with \`textContent\`, \`innerHTML\`, \`setAttribute\`, \`classList\`, and \`style\`; and modify structure with \`createElement\`, \`append\`, \`remove\`. Minimise reflows by batching changes (e.g. using a DocumentFragment).

**Hinglish Explanation**

DOM (Document Object Model) HTML page ka browser ki memory me tree representation hai. DOM manipulation ka matlab JavaScript se elements select karke unka content, attributes, styles, ya structure change karna taaki page dynamically update ho.  
Core APIs: select ke liye \`querySelector\`/\`querySelectorAll\`/\`getElementById\`; read/write ke liye \`textContent\`, \`innerHTML\`, \`setAttribute\`, \`classList\`, \`style\`; aur structure modify ke liye \`createElement\`, \`append\`, \`remove\`. Reflows kam karne ke liye changes batch karo (jaise DocumentFragment use karke).

**Key Interview Points**

* DOM is the live tree of the page; manipulating it updates the UI.

* Select: \`querySelector\`/\`All\`, \`getElementById\`.

* Update: \`textContent\` (safe), \`innerHTML\` (parses HTML — XSS risk), \`classList\`, \`style\`.

* Structure: \`createElement\`, \`append\`, \`prepend\`, \`remove\`.

* Batch DOM writes (DocumentFragment) to reduce layout thrashing.

**Real-World Example**

Rendering a to-do list: create an \`\<li\>\` per item, set its text, attach a delete button, and append all of them via a DocumentFragment so the browser reflows once instead of per item.

**Code — Full & Runnable**

// Browser code (runs in a browser):  
//  
//   const ul \= document.querySelector("\#list");  
//   const frag \= document.createDocumentFragment();  
//   items.forEach(text \=\> {  
//     const li \= document.createElement("li");  
//     li.textContent \= text;            // safe (no HTML injection)  
//     li.classList.add("item");  
//     frag.append(li);  
//   });  
//   ul.append(frag);                    // single reflow  
//  
// Node has no DOM, so we model the same logic with a minimal fake element  
// to prove the build-up is correct.  
   
function buildList(items) {  
  const fragment \= { children: \[\] };  
  items.forEach((text) \=\> {  
    const li \= { tag: "li", textContent: text, classes: \["item"\] };  
    fragment.children.push(li);  
  });  
  return fragment; // would be appended to the real \<ul\> in a browser  
}  
   
module.exports \= { buildList };

**Test / Demo & Expected Output**

// \--- run: node test.js (logic demo; real version uses the browser DOM) \---  
const { buildList } \= require("./solution");  
   
const frag \= buildList(\["Buy milk", "Call Asha"\]);  
console.log(frag.children.map((c) \=\> c.textContent)); // \['Buy milk','Call Asha'\]  
console.log(frag.children\[0\]); // { tag:'li', textContent:'Buy milk', classes:\['item'\] }  
   
console.assert(frag.children.length \=== 2, "two list items built");  
console.assert(frag.children\[0\].textContent \=== "Buy milk", "text set correctly");  
console.assert(frag.children\[0\].classes.includes("item"), "class added");  
console.log("DOM manipulation (logic) assertions passed.");  
   
/\* EXPECTED OUTPUT:  
\[ 'Buy milk', 'Call Asha' \]  
{ tag: 'li', textContent: 'Buy milk', classes: \[ 'item' \] }  
DOM manipulation (logic) assertions passed.  
\*/

**Common Follow-up Questions**

**Q: Difference between textContent and innerHTML?**

**A:** \`textContent\` sets plain text safely; \`innerHTML\` parses the string as HTML, which is powerful but risks XSS if you insert untrusted content. Prefer \`textContent\` unless you specifically need HTML.

**Q: How do you reduce layout thrashing when adding many nodes?**

**A:** Batch DOM writes — build nodes in a DocumentFragment (or set innerHTML once) and append in a single operation, so the browser reflows once instead of on every insertion.

## **87\. Browser Rendering Basics**

**Simple Explanation (English)**

When a browser loads a page it runs a rendering pipeline: parse HTML into the DOM, parse CSS into the CSSOM, combine them into the Render Tree (only visible nodes), compute Layout (positions and sizes), Paint pixels, and finally Composite layers onto the screen.

Changing the DOM or styles can trigger a reflow (layout recalculation — expensive) and/or a repaint (re-drawing pixels). Some properties (like \`transform\` and \`opacity\`) can be composited without layout/paint, which is why they animate smoothly. Minimising reflows is key to performance.

**Hinglish Explanation**

Jab browser page load karta hai to ek rendering pipeline chalata hai: HTML ko DOM me parse, CSS ko CSSOM me parse, dono ko Render Tree me combine (sirf visible nodes), Layout compute (positions aur sizes), Paint pixels, aur aakhir me layers ko screen par Composite.  
DOM ya styles change karne se reflow (layout recalculation — mehnga) aur/ya repaint (pixels dobara draw) trigger ho sakta hai. Kuch properties (jaise \`transform\` aur \`opacity\`) bina layout/paint composite ho sakti hain, isliye woh smoothly animate hoti hain. Reflows kam karna performance ki kunji hai.

**Key Interview Points**

* Pipeline: DOM \+ CSSOM → Render Tree → Layout → Paint → Composite.

* Reflow (layout) is triggered by geometry/structure changes — expensive.

* Repaint redraws pixels (e.g. color change) without re-layout.

* \`transform\`/\`opacity\` can be composited on the GPU — cheap to animate.

* Batch DOM reads/writes and prefer compositor-friendly properties.

**Real-World Example**

Animating position with \`top\`/\`left\` causes reflow each frame and can stutter; switching to \`transform: translate(...)\` lets the compositor handle it on the GPU, producing buttery 60fps motion.

**Code — Full & Runnable**

// Conceptual model of the rendering pipeline (runnable representation).  
   
function renderingPipeline() {  
  return \["DOM", "CSSOM", "RenderTree", "Layout", "Paint", "Composite"\];  
}  
   
// Classify what a given change triggers.  
function costOf(change) {  
  const layoutProps \= \["width", "height", "top", "left", "margin", "font-size"\];  
  const paintProps \= \["color", "background-color", "box-shadow"\];  
  const compositeProps \= \["transform", "opacity"\];  
  if (layoutProps.includes(change)) return "reflow+repaint";  
  if (paintProps.includes(change)) return "repaint";  
  if (compositeProps.includes(change)) return "composite-only";  
  return "unknown";  
}  
   
module.exports \= { renderingPipeline, costOf };

**Test / Demo & Expected Output**

// \--- run: node test.js \---  
const { renderingPipeline, costOf } \= require("./solution");  
   
console.log(renderingPipeline());  
console.log(costOf("width"));     // reflow+repaint  
console.log(costOf("color"));     // repaint  
console.log(costOf("transform")); // composite-only  
   
console.assert(renderingPipeline()\[0\] \=== "DOM", "pipeline starts at DOM");  
console.assert(renderingPipeline()\[5\] \=== "Composite", "pipeline ends at Composite");  
console.assert(costOf("width") \=== "reflow+repaint", "geometry change \= reflow");  
console.assert(costOf("transform") \=== "composite-only", "transform \= composite only");  
console.log("browser rendering assertions passed.");  
   
/\* EXPECTED OUTPUT:  
\[ 'DOM', 'CSSOM', 'RenderTree', 'Layout', 'Paint', 'Composite' \]  
reflow+repaint  
repaint  
composite-only  
browser rendering assertions passed.  
\*/

**Common Follow-up Questions**

**Q: What's the difference between reflow and repaint?**

**A:** Reflow (layout) recalculates element geometry and positions — expensive and can cascade. Repaint just redraws pixels (e.g. a color change) without changing layout. Reflow usually implies a repaint too.

**Q: Why do transform and opacity animate so smoothly?**

**A:** They can be handled by the compositor (often on the GPU) without triggering layout or paint, so each frame is cheap — unlike animating \`top\`/\`left\`, which forces reflow.

## **88\. Event Bubbling**

**Simple Explanation (English)**

Event bubbling is the phase where an event, after firing on the target element, propagates upward through its ancestors (target → parent → ... → document). Handlers on ancestor elements run after the target's, in bottom-up order, unless propagation is stopped.

Bubbling is the default for most events and is what enables event delegation. You can stop it with \`event.stopPropagation()\`, and read which element actually triggered the event via \`event.target\` (versus \`event.currentTarget\`, the element whose handler is running).

**Hinglish Explanation**

Event bubbling woh phase hai jisme event, target element par fire hone ke baad, apne ancestors me upar ki taraf propagate karta hai (target → parent → ... → document). Ancestor elements ke handlers target ke baad chalte hain, neeche-se-upar order me, jab tak propagation rok na di jaaye.  
Bubbling zyadatar events ke liye default hai aur yahi event delegation enable karta hai. Ise \`event.stopPropagation()\` se rok sakte ho, aur jo element actually event trigger kiya woh \`event.target\` se padho (jabki \`event.currentTarget\` woh element hai jiska handler chal raha hai).

**Key Interview Points**

* Event travels target → ancestors → document (bottom-up) after firing.

* Ancestor handlers run after the target's, in bubbling order.

* Default phase for most events; foundation of event delegation.

* \`event.target\` \= actual element; \`event.currentTarget\` \= handler's element.

* \`stopPropagation()\` halts further bubbling.

**Real-World Example**

Clicking a button inside a card: the click fires on the button, then bubbles to the card, then to the list, then to document. A single listener on the list can react to clicks on any button inside it (delegation).

**Code — Full & Runnable**

// Simulate bubbling order with a synthetic tree (no browser needed).  
   
function simulateBubble(targetPathTopToBottom, stopAt \= null) {  
  // path is ancestors top-\>bottom; bubbling goes bottom-\>top  
  const order \= \[\];  
  const bottomUp \= \[...targetPathTopToBottom\].reverse();  
  for (const node of bottomUp) {  
    order.push(node);  
    if (node \=== stopAt) break; // stopPropagation()  
  }  
  return order;  
}  
   
module.exports \= { simulateBubble };

**Test / Demo & Expected Output**

// \--- run: node test.js (simulation; browser uses real addEventListener) \---  
const { simulateBubble } \= require("./solution");  
   
// DOM nesting top-\>bottom: document \> ul \> li \> button  
const path \= \["document", "ul", "li", "button"\];  
console.log(simulateBubble(path));            // \['button','li','ul','document'\]  
console.log(simulateBubble(path, "ul"));      // \['button','li','ul'\] (stopped)  
   
console.assert(JSON.stringify(simulateBubble(path)) \=== '\["button","li","ul","document"\]', "bubbles bottom-up");  
console.assert(JSON.stringify(simulateBubble(path, "ul")) \=== '\["button","li","ul"\]', "stopPropagation halts bubbling");  
console.log("event bubbling assertions passed.");  
   
/\* EXPECTED OUTPUT:  
\[ 'button', 'li', 'ul', 'document' \]  
\[ 'button', 'li', 'ul' \]  
event bubbling assertions passed.  
\*/

**Common Follow-up Questions**

**Q: Difference between event.target and event.currentTarget?**

**A:** \`event.target\` is the element that actually triggered the event (where it originated); \`event.currentTarget\` is the element whose handler is currently running (where the listener is attached).

**Q: How do you stop an event from bubbling?**

**A:** Call \`event.stopPropagation()\` in the handler. To also prevent other listeners on the same element, use \`event.stopImmediatePropagation()\`.

## **89\. Event Capturing**

**Simple Explanation (English)**

Capturing (or 'trickling') is the phase that happens BEFORE bubbling: the event travels from the top (document) DOWN to the target (document → ... → parent → target). By default listeners run in the bubbling phase, but you can opt into capturing.

You enable it by passing \`true\` (or \`{ capture: true }\`) as the third argument to \`addEventListener\`. The full event flow is: capturing phase (top→target), then the target, then bubbling phase (target→top). Capturing is useful when an ancestor needs to intercept an event first.

**Hinglish Explanation**

Capturing (ya 'trickling') woh phase hai jo bubbling se PEHLE hota hai: event top (document) se DOWN target tak jaata hai (document → ... → parent → target). Default me listeners bubbling phase me chalte hain, par aap capturing me opt-in kar sakte ho.  
Ise \`addEventListener\` ke teesre argument me \`true\` (ya \`{ capture: true }\`) deke enable karte ho. Poora event flow: capturing phase (top→target), phir target, phir bubbling phase (target→top). Capturing tab useful hai jab kisi ancestor ko event pehle intercept karna ho.

**Key Interview Points**

* Capturing runs top→target, BEFORE the bubbling phase.

* Enable with \`addEventListener(type, fn, true)\` or \`{capture:true}\`.

* Full flow: capture (down) → target → bubble (up).

* Default listeners are in the bubbling phase.

* Use capturing to intercept events at an ancestor before the target sees them.

**Real-World Example**

A global overlay that must intercept and possibly block clicks before any inner button handles them can register a capturing listener on a container, catching the event on the way down.

**Code — Full & Runnable**

// Simulate full capture \-\> target \-\> bubble flow.  
   
function simulateFlow(pathTopToBottom) {  
  // capturing: top-\>target ; bubbling: target-\>top (target listed once at the turn)  
  const capture \= pathTopToBottom.map((n) \=\> "capture:" \+ n);  
  const bubble \= \[...pathTopToBottom\].reverse().map((n) \=\> "bubble:" \+ n);  
  return \[...capture, ...bubble\];  
}  
   
module.exports \= { simulateFlow };

**Test / Demo & Expected Output**

// \--- run: node test.js (simulation; browser uses {capture:true}) \---  
const { simulateFlow } \= require("./solution");  
   
const path \= \["document", "ul", "button"\]; // top \-\> target  
console.log(simulateFlow(path));  
   
const flow \= simulateFlow(path);  
console.assert(flow\[0\] \=== "capture:document", "capture starts at top");  
console.assert(flow\[2\] \=== "capture:button", "capture reaches target");  
console.assert(flow\[3\] \=== "bubble:button", "bubble starts at target");  
console.assert(flow\[flow.length \- 1\] \=== "bubble:document", "bubble ends at top");  
console.log("event capturing assertions passed.");  
   
/\* EXPECTED OUTPUT:  
\[  
  'capture:document', 'capture:ul', 'capture:button',  
  'bubble:button', 'bubble:ul', 'bubble:document'  
\]  
event capturing assertions passed.  
\*/

**Common Follow-up Questions**

**Q: How do you make a listener run in the capturing phase?**

**A:** Pass \`true\` or \`{ capture: true }\` as the third argument to \`addEventListener\`. By default (false) the listener runs in the bubbling phase.

**Q: What is the full order of event propagation?**

**A:** Capturing phase from the document down to the target, then the target itself, then the bubbling phase from the target back up to the document.

## **90\. Event Delegation**

**Simple Explanation (English)**

Event delegation is a pattern where, instead of attaching a listener to many child elements, you attach ONE listener to a common ancestor and use event bubbling to handle events from any descendant. You inspect \`event.target\` to decide what was clicked.

Benefits: fewer listeners (better performance and memory), and it automatically works for elements added to the DOM later (dynamic content). It's a staple for lists, tables, and menus. Use \`target.closest(selector)\` to robustly find the relevant element.

**Hinglish Explanation**

Event delegation ek pattern hai jisme kai child elements par listener lagane ke bajaye, aap EK listener ek common ancestor par lagate ho aur event bubbling se kisi bhi descendant ke events handle karte ho. \`event.target\` inspect karke decide karte ho kya click hua.  
Faayde: kam listeners (better performance aur memory), aur ye un elements ke liye bhi automatically chalta hai jo DOM me baad me add hote hain (dynamic content). Lists, tables, menus ke liye ye staple hai. Relevant element robustly dhoondhne ke liye \`target.closest(selector)\` use karo.

**Key Interview Points**

* One listener on a parent handles events from all descendants (via bubbling).

* Inspect \`event.target\` (or \`target.closest(sel)\`) to identify the source.

* Fewer listeners → better performance and lower memory.

* Works for dynamically added elements automatically.

* Ideal for lists, tables, toolbars, and menus.

**Real-World Example**

A to-do list where each item has a delete button: instead of a listener per button, one listener on the \`\<ul\>\` catches all clicks and checks \`event.target.closest('.delete')\` — and still works for items added after page load.

**Code — Full & Runnable**

// Browser code (runs in a browser):  
//  
//   list.addEventListener("click", (e) \=\> {  
//     const btn \= e.target.closest(".delete");  
//     if (btn) removeItem(btn.dataset.id);  
//   });  
//  
// Node demo: simulate delegation by matching against a target descriptor.  
   
function delegate(handlers) {  
  // returns a single handler that dispatches based on target.matches  
  return function (event) {  
    for (const { selector, run } of handlers) {  
      if (event.target.matches && event.target.matches(selector)) {  
        return run(event);  
      }  
    }  
    return null;  
  };  
}  
   
module.exports \= { delegate };

**Test / Demo & Expected Output**

// \--- run: node test.js (simulated target with a matches() method) \---  
const { delegate } \= require("./solution");  
   
const results \= \[\];  
const onClick \= delegate(\[  
  { selector: ".delete", run: (e) \=\> results.push("delete:" \+ e.target.id) },  
  { selector: ".edit", run: (e) \=\> results.push("edit:" \+ e.target.id) },  
\]);  
   
// fake events with target.matches()  
const makeTarget \= (cls, id) \=\> ({ target: { id, matches: (s) \=\> s \=== "." \+ cls } });  
onClick(makeTarget("delete", "1"));  
onClick(makeTarget("edit", "2"));  
onClick(makeTarget("other", "3")); // no handler  
   
console.log(results); // \['delete:1','edit:2'\]  
   
console.assert(JSON.stringify(results) \=== '\["delete:1","edit:2"\]', "delegates by selector");  
console.assert(onClick(makeTarget("other", "3")) \=== null, "unmatched target ignored");  
console.log("event delegation assertions passed.");  
   
/\* EXPECTED OUTPUT:  
\[ 'delete:1', 'edit:2' \]  
event delegation assertions passed.  
\*/

**Common Follow-up Questions**

**Q: Why is event delegation more efficient?**

**A:** It uses one listener on a parent instead of many on children, reducing memory and setup cost, and it automatically handles elements added to the DOM later — no need to re-bind.

**Q: How do you reliably identify the clicked element in delegation?**

**A:** Use \`event.target.closest(selector)\`, which walks up from the actual target to the nearest matching ancestor, handling clicks on nested inner elements correctly.

## **91\. Debouncing**

**Simple Explanation (English)**

Debouncing delays running a function until a certain amount of time has passed WITHOUT it being called again. Every new call resets the timer, so the function only runs once the activity 'settles'. It answers: 'wait until the user stops, then act.'

It's perfect for events that fire rapidly — typing in a search box, resizing a window, validating input — where you only care about the final state. Without debouncing you might fire dozens of expensive operations (like API calls) per second.

**Hinglish Explanation**

Debouncing ek function ko tab tak chalne se rokta hai jab tak ek certain time bina dobara call hue na guzar jaaye. Har naya call timer reset kar deta hai, isliye function tabhi chalta hai jab activity 'settle' ho jaaye. Ye kehta hai: 'user ke rukne tak wait karo, phir act karo.'  
Ye un events ke liye perfect hai jo tezi se fire hote hain — search box me typing, window resize, input validation — jahan aapko sirf final state chahiye. Debouncing ke bina aap per second dozens mehnge operations (jaise API calls) fire kar sakte ho.

**Key Interview Points**

* Runs the function only after calls STOP for \`wait\` ms.

* Each new call resets the timer (cancels the pending run).

* Use for search-as-you-type, resize, autosave, validation.

* Reduces expensive work (API calls, layout) dramatically.

* Distinct from throttle, which runs at a steady max rate.

**Real-World Example**

A search box that calls the API only after the user pauses typing for 300ms — instead of one request per keystroke, you send a single request for the final query.

**Code — Full & Runnable**

// A clean debounce: only the last call within 'wait' actually runs.  
   
function debounce(fn, wait) {  
  let timer \= null;  
  return function (...args) {  
    clearTimeout(timer);  
    timer \= setTimeout(() \=\> fn.apply(this, args), wait);  
  };  
}  
   
module.exports \= { debounce };

**Test / Demo & Expected Output**

// \--- run: node test.js \---  
const { debounce } \= require("./solution");  
   
(async () \=\> {  
  let calls \= 0;  
  let lastArg \= null;  
  const search \= debounce((q) \=\> { calls++; lastArg \= q; }, 30);  
   
  // rapid-fire calls; only the last should execute  
  search("a"); search("ab"); search("abc");  
  console.log("immediately after rapid calls:", calls); // 0 (still waiting)  
   
  await new Promise((r) \=\> setTimeout(r, 50));  
  console.log("after wait:", calls, "lastArg:", lastArg); // 1 'abc'  
   
  console.assert(calls \=== 1, "debounced to a single call");  
  console.assert(lastArg \=== "abc", "uses the latest arguments");  
  console.log("debouncing assertions passed.");  
})();  
   
/\* EXPECTED OUTPUT:  
immediately after rapid calls: 0  
after wait: 1 lastArg: abc  
debouncing assertions passed.  
\*/

**Common Follow-up Questions**

**Q: What's the core idea of debouncing?**

**A:** Postpone execution until calls stop for a given period; every new call resets the timer, so only the final, settled call runs after the quiet interval.

**Q: Debounce vs throttle?**

**A:** Debounce waits for activity to stop and then runs once; throttle runs at most once per interval during continuous activity. Debounce for 'after the user stops', throttle for 'at a steady rate'.

## **92\. Throttling**

**Simple Explanation (English)**

Throttling limits a function to run at most once per specified interval, no matter how many times it's called. Unlike debouncing (which waits for a pause), throttling guarantees a steady, regular execution rate during continuous activity.

It's ideal for events that fire continuously and where you want periodic updates — scroll position tracking, mouse-move handlers, drag events, or rate-limiting button clicks. Throttling keeps the handler responsive while capping how often the expensive work happens.

**Hinglish Explanation**

Throttling ek function ko ek specified interval me zyada se zyada ek baar chalne deta hai, chahe kitni baar bhi call ho. Debouncing (jo pause ka wait karta hai) ke विपरीत, throttling continuous activity ke dauraan ek steady, regular execution rate guarantee karta hai.  
Ye un events ke liye ideal hai jo continuously fire hote hain aur jahan aapko periodic updates chahiye — scroll position tracking, mouse-move handlers, drag events, ya button clicks rate-limit karna. Throttling handler ko responsive rakhta hai jabki mehnga kaam kitni baar ho ye cap karta hai.

**Key Interview Points**

* Runs at most once per \`interval\`, regardless of call frequency.

* Guarantees a steady execution rate during continuous activity.

* Use for scroll, mousemove, drag, resize, and click rate-limiting.

* Debounce \= run after it stops; throttle \= run regularly while active.

* Variants control leading/trailing edge execution.

**Real-World Example**

An infinite-scroll page that checks 'are we near the bottom?' at most every 200ms while the user scrolls — frequent enough to feel instant, but not running on every single scroll event.

**Code — Full & Runnable**

// A leading-edge throttle: runs immediately, then ignores calls within interval.  
   
function throttle(fn, interval) {  
  let lastTime \= 0;  
  return function (...args) {  
    const now \= Date.now();  
    if (now \- lastTime \>= interval) {  
      lastTime \= now;  
      return fn.apply(this, args);  
    }  
  };  
}  
   
module.exports \= { throttle };

**Test / Demo & Expected Output**

// \--- run: node test.js \---  
const { throttle } \= require("./solution");  
   
(async () \=\> {  
  let calls \= 0;  
  const onScroll \= throttle(() \=\> calls++, 30);  
   
  // burst of calls \-\> only first runs (leading edge)  
  onScroll(); onScroll(); onScroll();  
  console.log("after burst:", calls); // 1  
   
  await new Promise((r) \=\> setTimeout(r, 40));  
  onScroll(); // interval passed \-\> runs again  
  console.log("after interval:", calls); // 2  
   
  console.assert(calls \=== 2, "throttle allows one call per interval");  
  console.log("throttling assertions passed.");  
})();  
   
/\* EXPECTED OUTPUT:  
after burst: 1  
after interval: 2  
throttling assertions passed.  
\*/

**Common Follow-up Questions**

**Q: When would you choose throttle over debounce?**

**A:** When you need regular updates during continuous activity — like tracking scroll or mouse position — rather than a single action after the activity stops.

**Q: What's the difference between leading and trailing throttle?**

**A:** Leading-edge fires immediately on the first call of each interval; trailing-edge fires at the end of the interval with the latest args. Many implementations support both.

## **93\. fetch API**

**Simple Explanation (English)**

\`fetch(url, options)\` is the modern, promise-based browser (and Node 18+) API for making HTTP requests. It returns a promise that resolves to a \`Response\` object; you then call \`response.json()\` (or \`.text()\`) — itself a promise — to read the body.

Important gotcha: fetch only rejects on network failures, NOT on HTTP error statuses. A 404 or 500 still resolves, so you must check \`response.ok\` (or \`response.status\`) yourself. You configure method, headers, and body via the options object.

**Hinglish Explanation**

\`fetch(url, options)\` HTTP requests banane ka modern, promise-based browser (aur Node 18+) API hai. Ye ek promise return karta hai jo ek \`Response\` object me resolve hota hai; phir aap \`response.json()\` (ya \`.text()\`) call karte ho — jo khud ek promise hai — body padhne ke liye.  
Important gotcha: fetch sirf network failures par reject karta hai, HTTP error statuses par NAHI. 404 ya 500 bhi resolve ho jaata hai, isliye aapko khud \`response.ok\` (ya \`response.status\`) check karna padta hai. Method, headers, aur body options object se configure karte ho.

**Key Interview Points**

* Promise-based HTTP API; returns a \`Response\` object.

* Read the body with \`response.json()\` / \`.text()\` (also promises).

* Does NOT reject on 404/500 — check \`response.ok\` / \`response.status\`.

* Configure method/headers/body via the options object.

* Pairs with async/await and AbortController for cancellation.

**Real-World Example**

Loading data into a dashboard: \`const res \= await fetch('/api/users'); if (\!res.ok) throw new Error(res.status); const users \= await res.json();\` — the explicit \`res.ok\` check catches server errors fetch would otherwise pass through.

**Code — Full & Runnable**

// A robust fetch wrapper that treats HTTP errors as failures.  
// (Test uses a mocked global.fetch so it runs in Node.)  
   
async function getJSON(url) {  
  const res \= await fetch(url);  
  if (\!res.ok) throw new Error("HTTP " \+ res.status);  
  return res.json();  
}  
   
module.exports \= { getJSON };

**Test / Demo & Expected Output**

// \--- run: node test.js (global.fetch is mocked for a deterministic demo) \---  
const { getJSON } \= require("./solution");  
   
// Mock fetch: returns ok for /good, a 404 for /missing  
global.fetch \= (url) \=\> Promise.resolve(  
  url \=== "/good"  
    ? { ok: true, status: 200, json: () \=\> Promise.resolve({ id: 1, name: "Asha" }) }  
    : { ok: false, status: 404, json: () \=\> Promise.resolve(null) }  
);  
   
(async () \=\> {  
  const user \= await getJSON("/good");  
  console.log("user:", user); // { id:1, name:'Asha' }  
   
  let errMsg \= null;  
  try { await getJSON("/missing"); } catch (e) { errMsg \= e.message; }  
  console.log("error:", errMsg); // HTTP 404  
   
  console.assert(user.name \=== "Asha", "parses json on success");  
  console.assert(errMsg \=== "HTTP 404", "throws on non-ok status");  
  console.log("fetch API assertions passed.");  
})();  
   
/\* EXPECTED OUTPUT:  
user: { id: 1, name: 'Asha' }  
error: HTTP 404  
fetch API assertions passed.  
\*/

**Common Follow-up Questions**

**Q: Does fetch reject on a 404 or 500?**

**A:** No. fetch only rejects on network-level failures. HTTP error statuses still resolve, so you must check \`response.ok\` (or \`response.status\`) and handle errors yourself.

**Q: How do you read JSON from a fetch response?**

**A:** Call \`await response.json()\`, which returns a promise for the parsed body. Use \`.text()\` for plain text or \`.blob()\`/\`.arrayBuffer()\` for binary.

## **94\. AbortController (cancel requests)**

**Simple Explanation (English)**

\`AbortController\` lets you cancel asynchronous operations like fetch requests. You create a controller, pass its \`signal\` to \`fetch(url, { signal })\`, and call \`controller.abort()\` to cancel — which causes the fetch promise to reject with an \`AbortError\`.

It's essential for cancelling stale requests (e.g. a new search supersedes the previous one), implementing timeouts, and cleaning up when a component unmounts. The same signal can be passed to multiple operations to cancel them together; \`AbortSignal.timeout(ms)\` creates an auto-aborting signal.

**Hinglish Explanation**

\`AbortController\` aapko fetch requests jaise asynchronous operations cancel karne deta hai. Aap ek controller banate ho, uska \`signal\` \`fetch(url, { signal })\` ko dete ho, aur cancel karne ke liye \`controller.abort()\` call karte ho — jisse fetch promise \`AbortError\` ke saath reject ho jaata hai.  
Ye stale requests cancel karne (jaise nayi search purani ko supersede kare), timeouts implement karne, aur component unmount par cleanup ke liye zaruri hai. Same signal kai operations ko de kar unhe saath cancel kar sakte ho; \`AbortSignal.timeout(ms)\` ek auto-aborting signal banata hai.

**Key Interview Points**

* Create a controller; pass \`controller.signal\` to the async op.

* Call \`controller.abort()\` to cancel → operation rejects with \`AbortError\`.

* Use for stale-request cancellation, timeouts, and unmount cleanup.

* One signal can cancel multiple operations together.

* \`AbortSignal.timeout(ms)\` auto-aborts after a delay.

**Real-World Example**

A search-as-you-type box: each new keystroke aborts the previous in-flight request so results never arrive out of order, and a slow request that's been superseded is cancelled instead of wasting bandwidth.

**Code — Full & Runnable**

// Demonstrating AbortController with an abortable async operation.  
// (AbortController is built into Node 16+ and browsers.)  
   
function abortableTask(signal, ms \= 50\) {  
  return new Promise((resolve, reject) \=\> {  
    if (signal.aborted) return reject(new Error("AbortError"));  
    const id \= setTimeout(() \=\> resolve("completed"), ms);  
    signal.addEventListener("abort", () \=\> {  
      clearTimeout(id);  
      reject(new Error("AbortError"));  
    });  
  });  
}  
   
module.exports \= { abortableTask };

**Test / Demo & Expected Output**

// \--- run: node test.js \---  
const { abortableTask } \= require("./solution");  
   
(async () \=\> {  
  // 1\) completes normally  
  const c1 \= new AbortController();  
  console.log(await abortableTask(c1.signal, 10)); // completed  
   
  // 2\) aborted before completion  
  const c2 \= new AbortController();  
  const p \= abortableTask(c2.signal, 50);  
  c2.abort(); // cancel immediately  
  let msg \= null;  
  try { await p; } catch (e) { msg \= e.message; }  
  console.log("aborted:", msg); // AbortError  
   
  console.assert(await abortableTask(new AbortController().signal, 5\) \=== "completed", "completes when not aborted");  
  console.assert(msg \=== "AbortError", "abort() rejects the task");  
  console.log("AbortController assertions passed.");  
})();  
   
/\* EXPECTED OUTPUT:  
completed  
aborted: AbortError  
AbortController assertions passed.  
\*/

**Common Follow-up Questions**

**Q: How do you cancel a fetch request?**

**A:** Create an \`AbortController\`, pass \`controller.signal\` in the fetch options, and call \`controller.abort()\`. The fetch promise then rejects with an \`AbortError\`.

**Q: Give a common use case for AbortController.**

**A:** Cancelling stale requests in search-as-you-type (abort the previous request on each keystroke), enforcing timeouts, and cleaning up pending requests when a component unmounts.

## **95\. Regular Expressions (regex)**

**Simple Explanation (English)**

A regular expression is a pattern used to match, search, and replace text. In JavaScript you write them between slashes (\`/pattern/flags\`) or with \`new RegExp()\`. Common flags: \`g\` (global, all matches), \`i\` (case-insensitive), \`m\` (multiline).

Key methods: \`test()\` returns a boolean, \`match()\`/\`matchAll()\` extract matches, and \`String.replace()\` substitutes. Building blocks include character classes (\`\\d\`, \`\\w\`, \`\\s\`), quantifiers (\`\*\`, \`+\`, \`?\`, \`{n,m}\`), anchors (\`^\`, \`$\`), groups (\`( )\`), and alternation (\`|\`).

**Hinglish Explanation**

Regular expression ek pattern hai jo text ko match, search, aur replace karne ke liye use hota hai. JavaScript me inhe slashes ke beech likhte ho (\`/pattern/flags\`) ya \`new RegExp()\` se. Common flags: \`g\` (global, saare matches), \`i\` (case-insensitive), \`m\` (multiline).  
Key methods: \`test()\` boolean deta hai, \`match()\`/\`matchAll()\` matches nikaalte hain, aur \`String.replace()\` substitute karta hai. Building blocks: character classes (\`\\d\`, \`\\w\`, \`\\s\`), quantifiers (\`\*\`, \`+\`, \`?\`, \`{n,m}\`), anchors (\`^\`, \`$\`), groups (\`( )\`), aur alternation (\`|\`).

**Key Interview Points**

* Write as \`/pattern/flags\` or \`new RegExp(...)\`.

* Flags: \`g\` (all), \`i\` (ignore case), \`m\` (multiline), \`s\`, \`u\`.

* Methods: \`regex.test(str)\` (boolean), \`str.match\`/\`matchAll\`, \`str.replace\`.

* Classes \`\\d \\w \\s\`, quantifiers \`\* \+ ? {n,m}\`, anchors \`^ $\`, groups \`( )\`.

* Use capture groups to extract parts; named groups \`(?\<name\>...)\` improve clarity.

**Real-World Example**

Validating an email or phone field, extracting all hashtags from a post, or formatting input as the user types — regex handles all of these concisely where manual string parsing would be verbose and error-prone.

**Code — Full & Runnable**

// Validation, extraction, and replacement with regex.  
   
function isValidEmail(str) {  
  return /^\[^\\s@\]+@\[^\\s@\]+\\.\[^\\s@\]+$/.test(str);  
}  
   
function extractHashtags(text) {  
  return \[...text.matchAll(/\#(\\w+)/g)\].map((m) \=\> m\[1\]); // capture group  
}  
   
function maskDigits(str) {  
  return str.replace(/\\d/g, "\*"); // replace all digits  
}  
   
module.exports \= { isValidEmail, extractHashtags, maskDigits };

**Test / Demo & Expected Output**

// \--- run: node test.js \---  
const { isValidEmail, extractHashtags, maskDigits } \= require("./solution");  
   
console.log(isValidEmail("asha@example.com")); // true  
console.log(isValidEmail("not-an-email"));     // false  
console.log(extractHashtags("Loving \#js and \#regex here")); // \['js','regex'\]  
console.log(maskDigits("Call 98765"));         // Call \*\*\*\*\*  
   
console.assert(isValidEmail("asha@example.com") \=== true, "valid email");  
console.assert(isValidEmail("bad@") \=== false, "invalid email");  
console.assert(JSON.stringify(extractHashtags("\#a \#b")) \=== '\["a","b"\]', "extract hashtags");  
console.assert(maskDigits("a1b2") \=== "a\*b\*", "mask digits");  
console.log("regex assertions passed.");  
   
/\* EXPECTED OUTPUT:  
true  
false  
\[ 'js', 'regex' \]  
Call \*\*\*\*\*  
regex assertions passed.  
\*/

**Common Follow-up Questions**

**Q: What does the \`g\` flag do?**

**A:** It makes the regex global, so methods find ALL matches in the string (e.g. \`matchAll\`, or \`replace\` substituting every occurrence) rather than just the first.

**Q: How do you extract part of a match?**

**A:** Use capture groups \`( )\` and read them from the match result (e.g. \`match\[1\]\`), or use named groups \`(?\<name\>...)\` and read \`match.groups.name\`.

## **96\. LocalStorage**

**Simple Explanation (English)**

\`localStorage\` is a browser API for storing key-value string data that PERSISTS across page reloads and browser restarts (until explicitly cleared). It's synchronous, scoped per origin, and typically limited to about 5–10 MB.

API: \`setItem(key, value)\`, \`getItem(key)\`, \`removeItem(key)\`, \`clear()\`. Values must be strings, so objects are stored with \`JSON.stringify\` and read back with \`JSON.parse\`. Don't store sensitive data (it's accessible to any JS on the page) and avoid large/blocking writes since it's synchronous.

**Hinglish Explanation**

\`localStorage\` ek browser API hai jo key-value string data store karta hai jo page reloads aur browser restarts ke baad bhi PERSIST karta hai (jab tak explicitly clear na ho). Ye synchronous hai, per origin scoped, aur aam taur par lagbhag 5–10 MB tak limited.  
API: \`setItem(key, value)\`, \`getItem(key)\`, \`removeItem(key)\`, \`clear()\`. Values strings honi chahiye, isliye objects ko \`JSON.stringify\` se store aur \`JSON.parse\` se wapas read karte ho. Sensitive data store mat karo (page ki kisi bhi JS ko accessible) aur bade/blocking writes se bacho kyunki ye synchronous hai.

**Key Interview Points**

* Persistent key-value string storage, scoped per origin (\~5–10 MB).

* API: \`setItem\`, \`getItem\`, \`removeItem\`, \`clear\`.

* Stores strings only → use \`JSON.stringify\`/\`JSON.parse\` for objects.

* Synchronous and persistent until cleared (survives restarts).

* Not for sensitive data; accessible to all JS on the page.

**Real-World Example**

Remembering a user's theme preference (light/dark) or a draft form so it survives a page refresh — small, non-sensitive data that should persist between visits.

**Code — Full & Runnable**

// Browser code (runs in a browser):  
//  
//   localStorage.setItem("theme", "dark");  
//   const theme \= localStorage.getItem("theme");   // "dark"  
//   localStorage.setItem("user", JSON.stringify({ id: 1 }));  
//   const user \= JSON.parse(localStorage.getItem("user"));  
//  
// Node has no localStorage, so we model the same API to demo the logic.  
   
function createStorage() {  
  const map \= new Map();  
  return {  
    setItem: (k, v) \=\> map.set(k, String(v)),  
    getItem: (k) \=\> (map.has(k) ? map.get(k) : null),  
    removeItem: (k) \=\> map.delete(k),  
    clear: () \=\> map.clear(),  
  };  
}  
   
// JSON helpers mirroring real usage  
function saveObject(storage, key, obj) { storage.setItem(key, JSON.stringify(obj)); }  
function loadObject(storage, key) {  
  const raw \= storage.getItem(key);  
  return raw \=== null ? null : JSON.parse(raw);  
}  
   
module.exports \= { createStorage, saveObject, loadObject };

**Test / Demo & Expected Output**

// \--- run: node test.js (storage is simulated; browser uses window.localStorage) \---  
const { createStorage, saveObject, loadObject } \= require("./solution");  
   
const storage \= createStorage();  
storage.setItem("theme", "dark");  
console.log(storage.getItem("theme"));    // dark  
console.log(storage.getItem("missing"));  // null  
   
saveObject(storage, "user", { id: 1, name: "Asha" });  
console.log(loadObject(storage, "user")); // { id:1, name:'Asha' }  
   
storage.removeItem("theme");  
console.log(storage.getItem("theme"));    // null  
   
console.assert(loadObject(storage, "user").name \=== "Asha", "object round-trips via JSON");  
console.assert(storage.getItem("theme") \=== null, "removeItem works");  
console.assert(storage.getItem("missing") \=== null, "missing key returns null");  
console.log("localStorage assertions passed.");  
   
/\* EXPECTED OUTPUT:  
dark  
null  
{ id: 1, name: 'Asha' }  
null  
localStorage assertions passed.  
\*/

**Common Follow-up Questions**

**Q: How do you store an object in localStorage?**

**A:** Serialize it with \`JSON.stringify\` on save and parse it with \`JSON.parse\` on read, since localStorage only stores strings.

**Q: Should you store auth tokens in localStorage?**

**A:** Generally no — it's readable by any JavaScript on the page, making it vulnerable to XSS. Sensitive tokens are better kept in secure, HttpOnly cookies.

## **97\. SessionStorage**

**Simple Explanation (English)**

\`sessionStorage\` is a browser storage API with the same interface as \`localStorage\` (\`setItem\`, \`getItem\`, \`removeItem\`, \`clear\`), but its data lives only for the duration of the page session. It is cleared when the tab is closed.

Each tab has its own separate sessionStorage (it isn't shared between tabs, even on the same origin), whereas localStorage IS shared across all tabs of an origin and persists. Use sessionStorage for per-tab, temporary data like a multi-step form's progress within one visit.

**Hinglish Explanation**

\`sessionStorage\` ek browser storage API hai jiska interface \`localStorage\` jaisa hi hai (\`setItem\`, \`getItem\`, \`removeItem\`, \`clear\`), par iska data sirf page session ke dauraan rehta hai. Tab band hote hi ye clear ho jaata hai.  
Har tab ka apna alag sessionStorage hota hai (same origin par bhi tabs me share nahi hota), jabki localStorage ek origin ke saare tabs me SHARED hota hai aur persist karta hai. Per-tab, temporary data ke liye sessionStorage use karo, jaise ek hi visit me multi-step form ki progress.

**Key Interview Points**

* Same API as localStorage, but data is per-tab and temporary.

* Cleared when the tab/window is closed.

* NOT shared between tabs (localStorage is shared and persistent).

* Stores strings → use JSON for objects.

* Use for per-session, per-tab state (e.g. wizard progress).

**Real-World Example**

A multi-step checkout where each tab should track its own progress and reset if the tab closes — sessionStorage keeps the steps isolated per tab and auto-clears, unlike localStorage which would persist and leak between sessions.

**Code — Full & Runnable**

// Browser: window.sessionStorage has the same methods as localStorage,  
// but is per-tab and cleared on tab close.  
//  
//   sessionStorage.setItem("step", "2");  
//   sessionStorage.getItem("step"); // "2" (only in this tab, this session)  
//  
// Node demo: same simulated API; we just illustrate the contract.  
   
function createSessionStorage() {  
  const map \= new Map();  
  return {  
    setItem: (k, v) \=\> map.set(k, String(v)),  
    getItem: (k) \=\> (map.has(k) ? map.get(k) : null),  
    removeItem: (k) \=\> map.delete(k),  
    clear: () \=\> map.clear(),  
    // emulate "tab closed" \-\> everything gone  
    \_closeTab: () \=\> map.clear(),  
  };  
}  
   
module.exports \= { createSessionStorage };

**Test / Demo & Expected Output**

// \--- run: node test.js (simulation; browser uses window.sessionStorage) \---  
const { createSessionStorage } \= require("./solution");  
   
const s \= createSessionStorage();  
s.setItem("step", "2");  
console.log(s.getItem("step")); // 2  
   
s.\_closeTab(); // simulate closing the tab  
console.log(s.getItem("step")); // null (session ended)  
   
console.assert(s.getItem("step") \=== null, "session cleared on tab close");  
console.log("sessionStorage assertions passed.");  
   
/\* EXPECTED OUTPUT:  
2  
null  
sessionStorage assertions passed.  
\*/

**Common Follow-up Questions**

**Q: Key difference between sessionStorage and localStorage?**

**A:** sessionStorage is per-tab and cleared when the tab closes; localStorage is shared across all tabs of the same origin and persists until explicitly cleared.

**Q: Is sessionStorage shared between tabs?**

**A:** No. Each tab (and window) gets its own isolated sessionStorage, even for the same origin. localStorage, by contrast, is shared across tabs.

## **98\. Cookies**

**Simple Explanation (English)**

Cookies are small pieces of data (max \~4 KB) stored by the browser and automatically sent to the server with every matching HTTP request. They're the traditional mechanism for sessions, authentication, and preferences — and crucially, the server can read them, unlike localStorage.

Important attributes: \`Expires\`/\`Max-Age\` (lifetime), \`Secure\` (HTTPS only), \`HttpOnly\` (inaccessible to JavaScript — protects against XSS theft), and \`SameSite\` (controls cross-site sending — protects against CSRF). In JS you read/write non-HttpOnly cookies via \`document.cookie\`.

**Hinglish Explanation**

Cookies chhote data ke tukde hain (max \~4 KB) jo browser store karta hai aur har matching HTTP request ke saath automatically server ko bhejta hai. Ye sessions, authentication, aur preferences ke liye traditional mechanism hain — aur important baat, server inhe padh sakta hai, localStorage ke विपरीत.  
Important attributes: \`Expires\`/\`Max-Age\` (lifetime), \`Secure\` (sirf HTTPS), \`HttpOnly\` (JavaScript ko inaccessible — XSS theft se bachata hai), aur \`SameSite\` (cross-site sending control — CSRF se bachata hai). JS me non-HttpOnly cookies ko \`document.cookie\` se read/write karte ho.

**Key Interview Points**

* Small (\~4 KB) data sent automatically to the server on each request.

* Used for sessions, auth, and preferences; the server can read them.

* \`HttpOnly\` cookies are hidden from JavaScript (XSS protection).

* \`Secure\` (HTTPS only) and \`SameSite\` (CSRF protection) matter for safety.

* Read/write non-HttpOnly cookies in JS via \`document.cookie\`.

**Real-World Example**

A login session: the server sets an \`HttpOnly; Secure; SameSite=Lax\` session cookie that the browser sends on every request, keeping the user authenticated while protecting the token from JavaScript-based theft.

**Code — Full & Runnable**

// Browser: document.cookie is a single string of "k=v; k2=v2".  
//   document.cookie \= "theme=dark; Max-Age=3600; SameSite=Lax";  
//  
// Node demo: parse and serialize cookies (the logic browsers/servers use).  
   
function parseCookies(cookieString) {  
  return cookieString  
    .split(";")  
    .map((p) \=\> p.trim())  
    .filter(Boolean)  
    .reduce((acc, pair) \=\> {  
      const i \= pair.indexOf("=");  
      acc\[pair.slice(0, i)\] \= decodeURIComponent(pair.slice(i \+ 1));  
      return acc;  
    }, {});  
}  
   
function serializeCookie(name, value, opts \= {}) {  
  let str \= name \+ "=" \+ encodeURIComponent(value);  
  if (opts.maxAge \!= null) str \+= "; Max-Age=" \+ opts.maxAge;  
  if (opts.secure) str \+= "; Secure";  
  if (opts.httpOnly) str \+= "; HttpOnly";  
  if (opts.sameSite) str \+= "; SameSite=" \+ opts.sameSite;  
  return str;  
}  
   
module.exports \= { parseCookies, serializeCookie };

**Test / Demo & Expected Output**

// \--- run: node test.js \---  
const { parseCookies, serializeCookie } \= require("./solution");  
   
console.log(parseCookies("theme=dark; sid=abc123"));  
console.log(serializeCookie("sid", "abc123", { httpOnly: true, secure: true, sameSite: "Lax", maxAge: 3600 }));  
   
const parsed \= parseCookies("theme=dark; sid=abc123");  
console.assert(parsed.theme \=== "dark" && parsed.sid \=== "abc123", "parses cookies");  
const s \= serializeCookie("sid", "abc", { httpOnly: true, secure: true, sameSite: "Lax" });  
console.assert(s.includes("HttpOnly") && s.includes("Secure") && s.includes("SameSite=Lax"), "serializes attributes");  
console.log("cookies assertions passed.");  
   
/\* EXPECTED OUTPUT:  
{ theme: 'dark', sid: 'abc123' }  
sid=abc123; Max-Age=3600; Secure; HttpOnly; SameSite=Lax  
cookies assertions passed.  
\*/

**Common Follow-up Questions**

**Q: Why use an HttpOnly cookie for auth tokens?**

**A:** HttpOnly cookies can't be read by JavaScript, so even if the page has an XSS vulnerability, the token can't be stolen via \`document.cookie\`. The browser still sends it automatically on requests.

**Q: How do cookies differ from localStorage?**

**A:** Cookies are small, sent to the server automatically on each request, and can be HttpOnly; localStorage is larger, stays on the client only, and is always JS-accessible.

## **99\. CORS Basics**

**Simple Explanation (English)**

CORS (Cross-Origin Resource Sharing) is a browser security mechanism that controls whether a web page from one origin may make requests to a different origin. By default the Same-Origin Policy blocks cross-origin reads; CORS lets a server explicitly opt in by sending the right response headers.

The key header is \`Access-Control-Allow-Origin\` (which origins are allowed). For certain requests the browser first sends a 'preflight' \`OPTIONS\` request to check \`Access-Control-Allow-Methods\`/\`-Headers\`. Crucially, CORS is enforced by the browser, not the server — and not by tools like curl.

**Hinglish Explanation**

CORS (Cross-Origin Resource Sharing) ek browser security mechanism hai jo control karta hai ki ek origin ka web page doosre origin ko request kar sakta hai ya nahi. Default me Same-Origin Policy cross-origin reads block karti hai; CORS server ko sahi response headers bhej kar explicitly opt-in karne deta hai.  
Key header \`Access-Control-Allow-Origin\` hai (kaunse origins allowed hain). Kuch requests ke liye browser pehle ek 'preflight' \`OPTIONS\` request bhejta hai \`Access-Control-Allow-Methods\`/\`-Headers\` check karne. Important: CORS browser enforce karta hai, server nahi — aur curl jaise tools se nahi.

**Key Interview Points**

* Browser policy controlling cross-origin requests (default: same-origin only).

* Server opts in via \`Access-Control-Allow-Origin\` (and related headers).

* Preflight \`OPTIONS\` checks allowed methods/headers for some requests.

* Enforced by the BROWSER — curl/Postman aren't subject to CORS.

* Credentialed requests need \`Allow-Credentials\` and a specific origin (not \`\*\`).

**Real-World Example**

A React app at \`app.example.com\` calling an API at \`api.example.com\` gets a CORS error until the API responds with \`Access-Control-Allow-Origin: https://app.example.com\` — a daily reality for front-end developers.

**Code — Full & Runnable**

// Model the browser's CORS decision (educational, runnable).  
   
function isAllowed(requestOrigin, allowOriginHeader) {  
  if (\!allowOriginHeader) return false;       // no CORS header \-\> blocked  
  if (allowOriginHeader \=== "\*") return true; // wildcard allows all (non-credentialed)  
  return allowOriginHeader \=== requestOrigin;  // exact match required  
}  
   
function needsPreflight(method, headers \= \[\]) {  
  const simpleMethods \= \["GET", "POST", "HEAD"\];  
  const hasCustomHeaders \= headers.some((h) \=\> h.toLowerCase() \=== "authorization" || h.toLowerCase() \=== "x-custom");  
  return \!simpleMethods.includes(method) || hasCustomHeaders;  
}  
   
module.exports \= { isAllowed, needsPreflight };

**Test / Demo & Expected Output**

// \--- run: node test.js (models browser CORS logic) \---  
const { isAllowed, needsPreflight } \= require("./solution");  
   
console.log(isAllowed("https://app.example.com", "https://app.example.com")); // true  
console.log(isAllowed("https://evil.com", "https://app.example.com"));        // false  
console.log(isAllowed("https://any.com", "\*"));                               // true  
console.log(needsPreflight("GET"));                                           // false  
console.log(needsPreflight("DELETE"));                                        // true  
console.log(needsPreflight("POST", \["Authorization"\]));                       // true  
   
console.assert(isAllowed("https://a.com", "https://a.com") \=== true, "matching origin allowed");  
console.assert(isAllowed("https://a.com", "https://b.com") \=== false, "mismatched origin blocked");  
console.assert(needsPreflight("DELETE") \=== true, "non-simple method needs preflight");  
console.assert(needsPreflight("GET") \=== false, "simple GET needs no preflight");  
console.log("CORS assertions passed.");  
   
/\* EXPECTED OUTPUT:  
true  
false  
true  
false  
true  
true  
CORS assertions passed.  
\*/

**Common Follow-up Questions**

**Q: Who enforces CORS — the browser or the server?**

**A:** The browser. The server only declares what's allowed via headers; the browser blocks the response if the rules aren't met. Non-browser clients like curl/Postman ignore CORS entirely.

**Q: What is a CORS preflight request?**

**A:** An automatic \`OPTIONS\` request the browser sends before certain cross-origin requests to check the server's \`Access-Control-Allow-Methods\`/\`-Headers\`, confirming the actual request is permitted.

## **100\. Polyfills Basics**

**Simple Explanation (English)**

A polyfill is code that implements a modern feature in older environments that lack it, so the same code runs everywhere. You typically check whether the feature exists and, only if it doesn't, define your own implementation with the same behaviour.

Polyfills target APIs/methods (e.g. \`Array.prototype.includes\`, \`Promise\`, \`fetch\`), whereas transpilers like Babel convert new SYNTAX (e.g. arrow functions) to older syntax. The common pattern is feature detection: \`if (\!Something.method) { Something.method \= function(){...} }\`.

**Hinglish Explanation**

Polyfill woh code hai jo kisi modern feature ko un purane environments me implement karta hai jisme woh nahi hai, taaki same code har jagah chale. Aam taur par aap check karte ho ki feature exist karta hai ya nahi, aur sirf na hone par apni implementation define karte ho same behaviour ke saath.  
Polyfills APIs/methods ko target karte hain (jaise \`Array.prototype.includes\`, \`Promise\`, \`fetch\`), jabki Babel jaise transpilers nayi SYNTAX (jaise arrow functions) ko purani syntax me convert karte hain. Common pattern feature detection hai: \`if (\!Something.method) { Something.method \= function(){...} }\`.

**Key Interview Points**

* Polyfill \= implement a missing feature so old environments support it.

* Pattern: feature-detect first, then define only if absent.

* Polyfills add APIs/methods; transpilers (Babel) convert new syntax.

* Add methods on the prototype with the correct name and behaviour.

* Avoid overwriting native implementations that already exist.

**Real-World Example**

Supporting \`Array.prototype.includes\` on an old browser: a small polyfill defines it only if missing, so your app code can use \`arr.includes(x)\` everywhere without worrying about browser support.

**Code — Full & Runnable**

// Polyfill pattern: define a method only if it doesn't already exist.  
   
function installArrayLastPolyfill() {  
  if (\!Array.prototype.myLast) {  
    Array.prototype.myLast \= function () {  
      return this\[this.length \- 1\];  
    };  
  }  
}  
   
// A polyfill for String.prototype.padStart (simplified)  
function installPadStartPolyfill() {  
  if (\!String.prototype.myPadStart) {  
    String.prototype.myPadStart \= function (targetLen, padStr \= " ") {  
      let str \= String(this);  
      while (str.length \< targetLen) str \= (padStr \+ str).slice(-Math.max(targetLen, str.length \+ padStr.length));  
      return str.length \> targetLen ? str.slice(str.length \- targetLen) : str;  
    };  
  }  
}  
   
module.exports \= { installArrayLastPolyfill, installPadStartPolyfill };

**Test / Demo & Expected Output**

// \--- run: node test.js \---  
const { installArrayLastPolyfill, installPadStartPolyfill } \= require("./solution");  
   
installArrayLastPolyfill();  
installPadStartPolyfill();  
   
console.log(\[1, 2, 3\].myLast());        // 3  
console.log("5".myPadStart(3, "0"));    // 005  
   
console.assert(\[1, 2, 3\].myLast() \=== 3, "array last polyfill");  
console.assert("5".myPadStart(3, "0") \=== "005", "padStart polyfill");  
console.assert(typeof \[\].myLast \=== "function", "method installed on prototype");  
console.log("polyfill assertions passed.");  
   
/\* EXPECTED OUTPUT:  
3  
005  
polyfill assertions passed.  
\*/

**Common Follow-up Questions**

**Q: Difference between a polyfill and a transpiler?**

**A:** A polyfill provides a missing runtime API/method (e.g. \`Promise\`, \`includes\`); a transpiler (like Babel) rewrites new syntax (e.g. arrow functions, optional chaining) into older equivalent syntax.

**Q: Why feature-detect before defining a polyfill?**

**A:** To avoid overwriting the (usually faster and spec-correct) native implementation when it already exists, and to only patch environments that actually need it.

## **101\. Implement custom map / filter / reduce**

**Simple Explanation (English)**

Re-implementing the core array methods from scratch is a classic interview exercise that proves you understand higher-order functions, callbacks, and how these iterators actually work. The goal is to mimic the native behaviour, including the \`(element, index, array)\` callback signature.

\`map\` builds a new array of transformed values; \`filter\` keeps elements where the predicate is truthy; \`reduce\` folds the array into a single value using an accumulator and an optional initial value. None of them should mutate the original array.

**Hinglish Explanation**

Core array methods ko scratch se dobara banana ek classic interview exercise hai jo prove karta hai ki aap higher-order functions, callbacks, aur ye iterators actually kaise kaam karte hain ye samajhte ho. Goal native behaviour ki nakal karna hai, including \`(element, index, array)\` callback signature.  
\`map\` transformed values ka naya array banata hai; \`filter\` woh elements rakhta hai jahan predicate truthy ho; \`reduce\` array ko ek accumulator aur optional initial value se ek single value me fold karta hai. Inme se koi bhi original array ko mutate nahi karna chahiye.

**Key Interview Points**

* Implement on \`Array.prototype\` with the \`(element, index, array)\` signature.

* \`map\`: push \`callback(...)\` of each element into a new array.

* \`filter\`: push only elements where the predicate is truthy.

* \`reduce\`: thread an accumulator; handle the missing-initial-value case.

* Never mutate the original array.

**Real-World Example**

A whiteboard/interview favourite: being asked to implement \`Array.prototype.map\` shows you grasp callbacks and iteration, the same understanding you use daily when chaining real map/filter/reduce.

**Code — Full & Runnable**

// Custom implementations matching native behaviour.  
   
function myMap(arr, callback) {  
  const result \= \[\];  
  for (let i \= 0; i \< arr.length; i++) result.push(callback(arr\[i\], i, arr));  
  return result;  
}  
   
function myFilter(arr, predicate) {  
  const result \= \[\];  
  for (let i \= 0; i \< arr.length; i++) {  
    if (predicate(arr\[i\], i, arr)) result.push(arr\[i\]);  
  }  
  return result;  
}  
   
function myReduce(arr, reducer, initial) {  
  let acc, start;  
  if (arguments.length \>= 3\) { acc \= initial; start \= 0; }  
  else { acc \= arr\[0\]; start \= 1; } // no initial \-\> use first element  
  for (let i \= start; i \< arr.length; i++) acc \= reducer(acc, arr\[i\], i, arr);  
  return acc;  
}  
   
module.exports \= { myMap, myFilter, myReduce };

**Test / Demo & Expected Output**

// \--- run: node test.js \---  
const { myMap, myFilter, myReduce } \= require("./solution");  
   
const nums \= \[1, 2, 3, 4\];  
console.log(myMap(nums, (n) \=\> n \* 2));          // \[2,4,6,8\]  
console.log(myFilter(nums, (n) \=\> n % 2 \=== 0)); // \[2,4\]  
console.log(myReduce(nums, (a, b) \=\> a \+ b, 0)); // 10  
console.log(myReduce(nums, (a, b) \=\> a \+ b));    // 10 (no initial)  
console.log("original unchanged:", nums);        // \[1,2,3,4\]  
   
console.assert(JSON.stringify(myMap(nums, (n) \=\> n \* 2)) \=== "\[2,4,6,8\]", "map");  
console.assert(JSON.stringify(myFilter(nums, (n) \=\> n \> 2)) \=== "\[3,4\]", "filter");  
console.assert(myReduce(nums, (a, b) \=\> a \+ b, 0\) \=== 10, "reduce with initial");  
console.assert(myReduce(nums, (a, b) \=\> a \+ b) \=== 10, "reduce without initial");  
console.assert(JSON.stringify(nums) \=== "\[1,2,3,4\]", "no mutation");  
console.log("custom map/filter/reduce assertions passed.");  
   
/\* EXPECTED OUTPUT:  
\[ 2, 4, 6, 8 \]  
\[ 2, 4 \]  
10  
10  
original unchanged: \[ 1, 2, 3, 4 \]  
custom map/filter/reduce assertions passed.  
\*/

**Common Follow-up Questions**

**Q: How does reduce behave without an initial value?**

**A:** It uses the first element as the initial accumulator and starts iterating from the second element. On an empty array with no initial value, native reduce throws a TypeError.

**Q: What callback arguments should your custom map pass?**

**A:** The element, its index, and the whole array — \`(element, index, array)\` — to match the native signature so callbacks relying on index/array work correctly.

## **102\. Implement debounce (from scratch)**

**Simple Explanation (English)**

Implementing debounce yourself is a top interview question. The core uses a closure to hold a timer id: each call clears the previous timer and sets a new one, so the wrapped function only runs after calls stop for \`wait\` ms. Preserve \`this\` and arguments with \`apply\`.

A robust version adds options: an \`immediate\`/leading flag (run on the first call instead of the last), and a \`cancel\` method to clear a pending invocation. These edge cases (leading vs trailing, cancellation, correct \`this\`) are what interviewers probe for.

**Hinglish Explanation**

Debounce khud implement karna ek top interview question hai. Core ek closure use karta hai timer id rakhne ke liye: har call pichla timer clear karke naya set karta hai, taaki wrapped function tabhi chale jab calls \`wait\` ms ke liye ruk jaayein. \`this\` aur arguments ko \`apply\` se preserve karo.  
Robust version options add karta hai: ek \`immediate\`/leading flag (pehle call par chalao, last par nahi), aur ek \`cancel\` method pending invocation clear karne ko. Ye edge cases (leading vs trailing, cancellation, sahi \`this\`) hi interviewers test karte hain.

**Key Interview Points**

* Closure holds the timer id across calls.

* Each call clears the old timer and sets a new one (trailing edge).

* Use \`fn.apply(this, args)\` to preserve context and arguments.

* Add \`immediate\` (leading) and a \`cancel()\` method for completeness.

* Trailing \= run after it stops; leading \= run on the first call.

**Real-World Example**

Building your own debounce for a search input when you can't add a dependency: it cuts API calls to one per typing pause, and a \`cancel()\` lets you abort the pending call on unmount.

**Code — Full & Runnable**

// Debounce with leading option and cancel().  
   
function debounce(fn, wait, immediate \= false) {  
  let timer \= null;  
  function debounced(...args) {  
    const callNow \= immediate && timer \=== null;  
    clearTimeout(timer);  
    timer \= setTimeout(() \=\> {  
      timer \= null;  
      if (\!immediate) fn.apply(this, args); // trailing call  
    }, wait);  
    if (callNow) fn.apply(this, args);       // leading call  
  }  
  debounced.cancel \= () \=\> { clearTimeout(timer); timer \= null; };  
  return debounced;  
}  
   
module.exports \= { debounce };

**Test / Demo & Expected Output**

// \--- run: node test.js \---  
const { debounce } \= require("./solution");  
   
(async () \=\> {  
  // trailing (default)  
  let trailing \= 0;  
  const t \= debounce(() \=\> trailing++, 30);  
  t(); t(); t();  
  await new Promise((r) \=\> setTimeout(r, 50));  
  console.log("trailing calls:", trailing); // 1  
   
  // leading (immediate)  
  let leading \= 0;  
  const l \= debounce(() \=\> leading++, 30, true);  
  l(); l(); l(); // only first runs immediately  
  console.log("leading calls (immediate):", leading); // 1  
  await new Promise((r) \=\> setTimeout(r, 50));  
  console.log("leading calls (after wait):", leading); // still 1  
   
  // cancel  
  let cancelled \= 0;  
  const c \= debounce(() \=\> cancelled++, 30);  
  c(); c.cancel();  
  await new Promise((r) \=\> setTimeout(r, 50));  
  console.log("cancelled calls:", cancelled); // 0  
   
  console.assert(trailing \=== 1, "trailing fires once");  
  console.assert(leading \=== 1, "leading fires once on first call");  
  console.assert(cancelled \=== 0, "cancel prevents the pending call");  
  console.log("debounce implementation assertions passed.");  
})();  
   
/\* EXPECTED OUTPUT:  
trailing calls: 1  
leading calls (immediate): 1  
leading calls (after wait): 1  
cancelled calls: 0  
debounce implementation assertions passed.  
\*/

**Common Follow-up Questions**

**Q: How do you preserve \`this\` and arguments in a debounce?**

**A:** Capture them in the wrapper and invoke with \`fn.apply(this, args)\` (or use an arrow capturing the outer \`this\`), so the debounced call behaves like a direct call.

**Q: What's the difference between leading and trailing debounce?**

**A:** Trailing (default) runs the function after calls stop for the wait period; leading runs it on the first call and ignores the rest until the quiet period passes.

## **103\. Implement throttle (from scratch)**

**Simple Explanation (English)**

Implementing throttle tests the same skills as debounce but with different timing semantics: the wrapped function should run at most once per \`interval\`, even under continuous calls. A common approach tracks the last execution time and only runs again once enough time has elapsed (leading edge).

A more complete version also schedules a trailing call so the final event isn't lost, and exposes a \`cancel\`. Interviewers look for correct timing, preserved \`this\`/arguments, and awareness of the leading/trailing trade-off versus debounce.

**Hinglish Explanation**

Throttle implement karna debounce jaisi hi skills test karta hai par alag timing semantics ke saath: wrapped function ko per \`interval\` zyada se zyada ek baar chalna chahiye, continuous calls me bhi. Common approach last execution time track karta hai aur tabhi dobara chalata hai jab kaafi time guzar jaaye (leading edge).  
Zyada complete version ek trailing call bhi schedule karta hai taaki aakhri event na chhoote, aur ek \`cancel\` expose karta hai. Interviewers correct timing, preserved \`this\`/arguments, aur debounce ke mukable leading/trailing trade-off ki samajh dekhte hain.

**Key Interview Points**

* Runs at most once per \`interval\` under continuous calls.

* Leading edge: track \`lastTime\`; run when \`now \- lastTime \>= interval\`.

* Optionally schedule a trailing call so the last event still fires.

* Preserve \`this\`/arguments with \`apply\`.

* Contrast with debounce (which waits for calls to stop).

**Real-World Example**

Hand-rolling a throttle for a scroll handler that updates a progress indicator at most every 100ms — smooth and responsive without running heavy work on every scroll event.

**Code — Full & Runnable**

// Throttle with leading \+ trailing execution.  
   
function throttle(fn, interval) {  
  let lastTime \= 0;  
  let trailingTimer \= null;  
  let lastArgs \= null;  
   
  function throttled(...args) {  
    const now \= Date.now();  
    const remaining \= interval \- (now \- lastTime);  
    lastArgs \= args;  
    if (remaining \<= 0\) {  
      lastTime \= now;  
      fn.apply(this, args); // leading edge  
    } else if (trailingTimer \=== null) {  
      // schedule a trailing call for the final invocation  
      trailingTimer \= setTimeout(() \=\> {  
        lastTime \= Date.now();  
        trailingTimer \= null;  
        fn.apply(this, lastArgs);  
      }, remaining);  
    }  
  }  
  throttled.cancel \= () \=\> { clearTimeout(trailingTimer); trailingTimer \= null; lastTime \= 0; };  
  return throttled;  
}  
   
module.exports \= { throttle };

**Test / Demo & Expected Output**

// \--- run: node test.js \---  
const { throttle } \= require("./solution");  
   
(async () \=\> {  
  let calls \= 0;  
  const fn \= throttle(() \=\> calls++, 30);  
   
  // burst: 1 leading call now \+ 1 trailing call scheduled  
  fn(); fn(); fn();  
  console.log("after burst (leading):", calls); // 1  
   
  await new Promise((r) \=\> setTimeout(r, 50));  
  console.log("after wait (trailing fired):", calls); // 2  
   
  console.assert(calls \=== 2, "leading \+ trailing \= 2 calls for a burst");  
  console.log("throttle implementation assertions passed.");  
})();  
   
/\* EXPECTED OUTPUT:  
after burst (leading): 1  
after wait (trailing fired): 2  
throttle implementation assertions passed.  
\*/

**Common Follow-up Questions**

**Q: How does a leading-edge throttle decide whether to run?**

**A:** It records the last execution time and runs again only when \`Date.now() \- lastTime \>= interval\`; calls arriving sooner are ignored (or deferred to a trailing call).

**Q: Why add a trailing call to a throttle?**

**A:** Without it, the very last event in a burst (after the leading call) can be dropped. A scheduled trailing call ensures the final state/args are still processed once the interval elapses.