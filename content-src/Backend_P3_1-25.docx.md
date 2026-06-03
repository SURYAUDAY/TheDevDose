  
**Backend \+ Databases \+ DevOps**

Interview Study Guide

Phase 3  ·  Topics 1–25 of 95

Full-Stack \+ GenAI Roadmap

Code language: Node / JavaScript

**How to run the code samples**

Server/DB code: runs with Node \+ the listed packages (Express, pg, etc.) against a running server/database.

Logic demos: save as filename.js, then run  node filename.js

**Table of Contents**

# **Backend \+ Databases \+ DevOps**

This guide covers the first 25 topics of Phase 3, the foundation of backend engineering: HTTP fundamentals, the Node.js architecture and its event-driven model, building APIs with Express (middleware, REST, CRUD, validation, error handling, async), architectural patterns (MVC, repository, API versioning), API styles (GraphQL, gRPC, OpenAPI/Swagger), and relational database essentials (SQL, PostgreSQL, MySQL, schema design, normalization, relationships, keys, and JOINs).

Each topic follows the same structure: a plain-English explanation, the same idea in spoken Hinglish, key interview points, a real-world example, full Node/JS code, a Node-runnable logic demo with verified expected output, and common follow-up questions. For topics that require a running server or database, the code shows the real, idiomatic implementation and the demo verifies the underlying logic in plain Node.

## **1\. HTTP fundamentals (methods, status codes, headers)**

**Simple Explanation**

HTTP is the request/response protocol the web runs on. A client sends a request with a method (GET, POST, PUT, PATCH, DELETE), a URL, headers (metadata like Content-Type and Authorization), and an optional body; the server replies with a status code, headers, and a body.

Methods convey intent: GET reads, POST creates, PUT/PATCH update, DELETE removes. Status codes are grouped by first digit — 2xx success, 3xx redirect, 4xx client error, 5xx server error — and choosing the right one (200, 201, 204, 400, 401, 404, 500\) makes an API predictable.

**Hinglish Explanation**

HTTP wo request/response protocol hai jis par web chalta hai. Client ek request bhejta hai — method (GET, POST, PUT, PATCH, DELETE), URL, headers (Content-Type, Authorization jaisi metadata) aur optional body ke saath; server status code, headers aur body se reply karta hai.

Methods intent batate hain: GET read, POST create, PUT/PATCH update, DELETE remove. Status codes pehle digit se group hote hain — 2xx success, 3xx redirect, 4xx client error, 5xx server error — aur sahi code (200, 201, 204, 400, 401, 404, 500\) API ko predictable banata hai.

**Key Interview Points**

* Request \= method \+ URL \+ headers \+ optional body; response \= status \+ headers \+ body.

* Methods: GET (read), POST (create), PUT/PATCH (update), DELETE (remove).

* Status families: 2xx success, 3xx redirect, 4xx client error, 5xx server error.

* Common codes: 200 OK, 201 Created, 204 No Content, 400, 401, 403, 404, 500\.

* Headers carry metadata: Content-Type, Authorization, Cache-Control, Accept.

**Real-World Example**

When you submit a signup form, the browser sends POST /users with a JSON body and a Content-Type header. The server replies 201 Created with the new user, or 400 Bad Request with validation errors — the status code alone tells the frontend what happened.

**Code — Full & Runnable (Node / JS)**

*Real Node HTTP server code (runs with Node). The Node-runnable demo below verifies the status-code logic.*

// HTTP fundamentals — a raw Node HTTP server showing methods, status, headers.  
const http \= require("http");  
   
const server \= http.createServer((req, res) \=\> {  
  // req.method (GET/POST/...), req.url, req.headers are the request line \+ headers  
  if (req.method \=== "GET" && req.url \=== "/health") {  
    res.writeHead(200, { "Content-Type": "application/json" }); // status \+ headers  
    return res.end(JSON.stringify({ status: "ok" }));  
  }  
  if (req.method \=== "POST" && req.url \=== "/users") {  
    res.writeHead(201, { "Content-Type": "application/json" }); // 201 Created  
    return res.end(JSON.stringify({ id: 1 }));  
  }  
  res.writeHead(404, { "Content-Type": "application/json" });    // 404 Not Found  
  res.end(JSON.stringify({ error: "Not Found" }));  
});  
   
server.listen(3000, () \=\> console.log("Listening on http://localhost:3000"));  
// Status families: 1xx info, 2xx success, 3xx redirect, 4xx client error, 5xx server error

**Test / Demo & Expected Output (Node-runnable)**

// HTTP fundamentals — map methods+outcomes to correct status codes  
function handle(method, resourceExists, body){  
  if (method \=== "GET")    return resourceExists ? 200 : 404;  
  if (method \=== "POST")   return body ? 201 : 400;          // 201 Created  
  if (method \=== "PUT")    return resourceExists ? 200 : 404;  
  if (method \=== "DELETE") return resourceExists ? 204 : 404; // 204 No Content  
  return 405;                                                 // Method Not Allowed  
}  
const category \= (c) \=\> ({2:"Success",3:"Redirect",4:"Client Error",5:"Server Error"}\[Math.floor(c/100)\] || "Info");  
const cases \= \[  
  \["GET", true, null\], \["GET", false, null\], \["POST", false, {name:"x"}\],  
  \["POST", false, null\], \["DELETE", true, null\], \["PATCH", true, null\],  
\];  
cases.forEach((\[m,e,b\]) \=\> { const s \= handle(m,e,b); console.log(\`${m.padEnd(6)} \-\> ${s} (${category(s)})\`); });  
console.assert(handle("POST", false, {a:1}) \=== 201, "create returns 201");  
console.assert(handle("DELETE", true) \=== 204, "delete returns 204");  
console.log("All assertions passed.");  
   
/\* \===== EXPECTED OUTPUT \=====  
GET    \-\> 200 (Success)  
GET    \-\> 404 (Client Error)  
POST   \-\> 201 (Success)  
POST   \-\> 400 (Client Error)  
DELETE \-\> 204 (Success)  
PATCH  \-\> 405 (Client Error)  
All assertions passed.  
\===== END EXPECTED OUTPUT \===== \*/

**Common Follow-up Questions**

**Q: What's the difference between PUT and PATCH?**

A: PUT replaces the entire resource with the payload; PATCH applies a partial update to specific fields. PUT is idempotent by design; PATCH may or may not be.

**Q: When return 201 vs 200?**

A: 201 Created signals a new resource was created (typically after POST), often with a Location header; 200 OK is the general success for reads and updates that return a body.

**Q: What does idempotent mean for HTTP methods?**

A: Calling the method multiple times has the same effect as once. GET, PUT, and DELETE are idempotent; POST generally is not, since repeating it can create duplicates.

## **2\. Node.js architecture**

**Simple Explanation**

Node.js runs JavaScript on a single main thread using an event loop, paired with libuv, which provides a thread pool for I/O. Instead of blocking the thread while reading a file or querying a database, Node offloads that work and continues; when the I/O completes, its callback is queued back onto the event loop.

This non-blocking, event-driven model lets a single Node process handle thousands of concurrent connections efficiently — ideal for I/O-heavy workloads like APIs. The trade-off: CPU-bound work blocks the single thread, so heavy computation should be offloaded (worker threads, child processes, or external services).

**Hinglish Explanation**

Node.js JavaScript ko ek single main thread par event loop se chalata hai, aur libuv I/O ke liye thread pool deta hai. File read ya DB query ke dauraan thread block karne ke bajaye Node wo kaam offload karke aage badh jaata hai; I/O complete hone par uska callback event loop par wapas queue ho jaata hai.

Ye non-blocking, event-driven model ek hi Node process ko hazaaron concurrent connections efficiently handle karne deta hai — APIs jaise I/O-heavy kaam ke liye perfect. Trade-off: CPU-bound kaam single thread block karta hai, isliye heavy computation offload karni chahiye (worker threads, child processes).

**Key Interview Points**

* Single main thread runs your JS via the event loop; libuv handles I/O on a thread pool.

* Non-blocking I/O: work is offloaded and its callback runs later — the thread never waits.

* Event loop phases process timers, I/O callbacks, check (setImmediate), etc., in order.

* process.nextTick and Promise microtasks run before the loop continues.

* Great for I/O-bound apps; CPU-heavy tasks block the thread — offload them.

**Real-World Example**

An API receiving 5,000 simultaneous requests that each query a database stays responsive because Node doesn't block while waiting on the DB — it fires the queries, serves other requests, and handles each response as it arrives, all on one thread.

**Code — Full & Runnable (Node / JS)**

*Real Node code demonstrating non-blocking I/O (runs with Node). The Node-runnable demo below verifies event-loop phase ordering.*

// Node.js architecture — single-threaded JS \+ non-blocking I/O via the event loop.  
const fs \= require("fs");  
   
console.log("1. runs first (synchronous)");  
   
// Non-blocking I/O: the read is offloaded; JS keeps running, callback fires later.  
fs.readFile(\_\_filename, "utf8", () \=\> {  
  console.log("4. file read callback (I/O completion)");  
});  
   
// Microtask: runs after the current operation, before timers.  
Promise.resolve().then(() \=\> console.log("3. promise microtask"));  
   
console.log("2. runs second (synchronous)");  
   
// Key idea: one main thread runs your JS; libuv handles I/O on a thread pool  
// and queues callbacks back onto the event loop when work completes — so the  
// server can handle thousands of concurrent connections without blocking.

**Test / Demo & Expected Output (Node-runnable)**

// Node.js architecture — single thread \+ event loop ordering of phases  
// nextTick \> microtasks (promises) \> timers (setTimeout) \> check (setImmediate)  
const order \= \[\];  
console.log("1. sync start");  
setTimeout(() \=\> order.push("setTimeout (timers phase)"), 0);  
setImmediate(() \=\> order.push("setImmediate (check phase)"));  
Promise.resolve().then(() \=\> order.push("promise (microtask)"));  
process.nextTick(() \=\> order.push("nextTick (runs first)"));  
console.log("2. sync end");  
setTimeout(() \=\> {  
  order.forEach((o, i) \=\> console.log(\`${i \+ 3}. ${o}\`));  
  console.assert(order\[0\] \=== "nextTick (runs first)", "nextTick before microtasks");  
  console.assert(order\[1\] \=== "promise (microtask)", "microtask before timers");  
  console.log("All assertions passed.");  
}, 10);  
   
/\* \===== EXPECTED OUTPUT \=====  
1\. sync start  
2\. sync end  
3\. nextTick (runs first)  
4\. promise (microtask)  
5\. setImmediate (check phase)  
6\. setTimeout (timers phase)  
All assertions passed.  
\===== END EXPECTED OUTPUT \===== \*/

**Common Follow-up Questions**

**Q: Why is Node good for I/O-heavy apps but not CPU-heavy ones?**

A: I/O is offloaded so the single thread stays free to handle other requests. CPU-bound work runs on that same thread, blocking everything else until it finishes.

**Q: How do you handle CPU-intensive work in Node?**

A: Offload it to worker threads, child processes, a job queue, or a separate service so the main event loop stays unblocked.

**Q: What runs first: nextTick, a Promise, or setTimeout?**

A: process.nextTick runs first, then Promise microtasks, then timer callbacks (setTimeout). nextTick and microtasks drain before the loop proceeds to timers.

## **3\. Event-driven architecture**

**Simple Explanation**

Event-driven architecture decouples the part of the system that detects something happening (the emitter/producer) from the parts that react to it (listeners/consumers). Instead of one function calling many others directly, it emits an event, and any number of independent listeners respond — they don't need to know about each other.

Node has this built in via the EventEmitter class (and many core modules, like streams and HTTP servers, are emitters). It makes systems extensible and loosely coupled: you can add a new reaction to an event without modifying the code that emits it.

**Hinglish Explanation**

Event-driven architecture us hisse ko (jo kuch hone ka pata lagata hai — emitter/producer) un hisson se alag karti hai jo react karte hain (listeners/consumers). Ek function seedha kai functions call karne ke bajaye event emit karta hai, aur kitne bhi independent listeners respond karte hain — unhe ek doosre ka pata nahi hota.

Node mein ye EventEmitter class se built-in hai (streams, HTTP servers bhi emitters hain). Isse system extensible aur loosely coupled banta hai: emit karne wale code ko badle bina aap event par naya reaction add kar sakte ho.

**Key Interview Points**

* Decouples producers (emit events) from consumers (listen and react).

* Node's EventEmitter: .on() to subscribe, .emit() to publish, .once() for one-time.

* Many core modules are emitters (streams, HTTP server, process).

* Add new behavior by adding listeners — no change to the emitting code.

* Listeners run synchronously in registration order by default.

**Real-World Example**

When an order is placed, the order service emits 'order:created'. Separate listeners send a confirmation email, reserve inventory, and log analytics. Adding a new reaction (say, an SMS alert) means registering one more listener — the order logic itself never changes.

**Code — Full & Runnable (Node / JS)**

*Real Node code using EventEmitter (runs with Node). The Node-runnable demo below verifies the same event flow.*

// Event-driven architecture — decouple producers and consumers with events.  
const EventEmitter \= require("events");  
   
class OrderService extends EventEmitter {  
  placeOrder(order) {  
    // ... persist the order ...  
    this.emit("order:created", order); // notify all interested listeners  
    return order;  
  }  
}  
   
const orders \= new OrderService();  
   
// Independent listeners react to the same event without knowing about each other:  
orders.on("order:created", (o) \=\> sendConfirmationEmail(o));  
orders.on("order:created", (o) \=\> reserveInventory(o));  
orders.on("order:created", (o) \=\> trackAnalytics(o));  
   
function sendConfirmationEmail(o) { console.log(\`Email sent for order ${o.id}\`); }  
function reserveInventory(o) { console.log(\`Inventory reserved for ${o.item}\`); }  
function trackAnalytics(o) { console.log(\`Analytics: order ${o.id}\`); }  
   
orders.placeOrder({ id: 1, item: "Phone" });

**Test / Demo & Expected Output (Node-runnable)**

// Event-driven architecture — Node's built-in EventEmitter  
const EventEmitter \= require("events");  
class OrderService extends EventEmitter {}  
const orders \= new OrderService();  
const log \= \[\];  
orders.on("order:created", (o) \=\> log.push(\`email sent for order ${o.id}\`));  
orders.on("order:created", (o) \=\> log.push(\`inventory reserved for ${o.item}\`));  
orders.once("order:created", (o) \=\> log.push(\`(once) analytics logged ${o.id}\`));  
   
orders.emit("order:created", { id: 1, item: "Phone" });  
orders.emit("order:created", { id: 2, item: "Laptop" }); // 'once' won't fire again  
log.forEach(l \=\> console.log(l));  
console.log("Listeners for order:created:", orders.listenerCount("order:created"));  
console.assert(log.filter(l \=\> l.includes("once")).length \=== 1, "once fires only once");  
console.log("All assertions passed.");  
   
/\* \===== EXPECTED OUTPUT \=====  
email sent for order 1  
inventory reserved for Phone  
(once) analytics logged 1  
email sent for order 2  
inventory reserved for Laptop  
Listeners for order:created: 2  
All assertions passed.  
\===== END EXPECTED OUTPUT \===== \*/

**Common Follow-up Questions**

**Q: What's the benefit of event-driven design?**

A: Loose coupling and extensibility: the emitter doesn't know or care who listens, so you can add, remove, or change reactions independently without touching the source of the event.

**Q: Difference between .on() and .once()?**

A: .on() registers a listener that fires every time the event is emitted; .once() fires the listener only the first time, then removes it automatically.

**Q: Are EventEmitter listeners async?**

A: By default they run synchronously in the order registered. For async work, the listener can kick off a promise/async task itself, but emit() doesn't await them.

## **4\. Express.js**

**Simple Explanation**

Express is the most popular minimal web framework for Node. It provides a thin, unopinionated layer over Node's HTTP module: routing (mapping method \+ path to handlers), middleware (functions that process requests in sequence), and helpers like res.json() and req.body parsing.

Its simplicity and huge ecosystem make it the default choice for REST APIs. You define routes, plug in middleware (logging, auth, body parsing, error handling), and Express handles the request/response plumbing so you focus on application logic.

**Hinglish Explanation**

Express Node ke liye sabse popular minimal web framework hai. Ye Node ke HTTP module ke upar ek patli, unopinionated layer deta hai: routing (method \+ path ko handlers se map karna), middleware (sequence mein requests process karne wale functions), aur res.json(), req.body parsing jaise helpers.

Iski simplicity aur bada ecosystem ise REST APIs ke liye default banate hain. Aap routes define karte ho, middleware (logging, auth, body parsing, error handling) plug karte ho, aur Express request/response plumbing handle karta hai taaki aap logic par focus karo.

**Key Interview Points**

* Minimal, unopinionated web framework on top of Node's HTTP module.

* Core concepts: routing, middleware, and request/response helpers.

* express.json() parses JSON bodies; res.json()/res.status() shape responses.

* Routers (express.Router) modularize routes by feature.

* Huge middleware ecosystem (auth, CORS, helmet, rate limiting, etc.).

**Real-World Example**

A startup builds its REST API with Express: app.use(express.json()) for parsing, a logger and auth middleware, and routers for /users and /orders. In a few dozen lines they have a working API, then bolt on community middleware for CORS and security headers.

**Code — Full & Runnable (Node / JS)**

*Real Express server code (Node \+ Express). The Node-runnable demo below exercises the same routing logic without binding a port.*

// Express.js — a basic REST server with JSON handling.  
const express \= require("express");  
const app \= express();  
   
app.use(express.json()); // parse JSON request bodies into req.body  
   
const users \= \[{ id: 1, name: "Asha" }\];  
   
app.get("/users", (req, res) \=\> {  
  res.json(users);  
});  
   
app.post("/users", (req, res) \=\> {  
  const user \= { id: users.length \+ 1, name: req.body.name };  
  users.push(user);  
  res.status(201).json(user); // 201 Created  
});  
   
app.get("/users/:id", (req, res) \=\> {  
  const user \= users.find((u) \=\> u.id \=== Number(req.params.id));  
  if (\!user) return res.status(404).json({ error: "Not Found" });  
  res.json(user);  
});  
   
app.listen(3000, () \=\> console.log("API on http://localhost:3000"));

**Test / Demo & Expected Output (Node-runnable)**

// Express.js — minimal express-like router \+ dispatch  
function createApp(){  
  const routes \= \[\];  
  const app \= {  
    get:  (path, h) \=\> routes.push({ method: "GET", path, h }),  
    post: (path, h) \=\> routes.push({ method: "POST", path, h }),  
    handle(method, path){  
      const route \= routes.find(r \=\> r.method \=== method && r.path \=== path);  
      const res \= { statusCode: 200, body: null,  
        status(c){ this.statusCode \= c; return this; },  
        json(d){ this.body \= d; return this; } };  
      if (\!route){ res.status(404).json({ error: "Not Found" }); return res; }  
      route.h({ method, path }, res);  
      return res;  
    },  
  };  
  return app;  
}  
const app \= createApp();  
app.get("/users", (req, res) \=\> res.json(\[{ id: 1, name: "Asha" }\]));  
app.post("/users", (req, res) \=\> res.status(201).json({ id: 2 }));  
   
console.log("GET /users  \-\>", JSON.stringify(app.handle("GET", "/users")));  
console.log("POST /users \-\>", JSON.stringify(app.handle("POST", "/users")));  
console.log("GET /nope   \-\>", JSON.stringify(app.handle("GET", "/nope")));  
console.assert(app.handle("POST", "/users").statusCode \=== 201, "post creates");  
console.assert(app.handle("GET", "/nope").statusCode \=== 404, "unknown route 404");  
console.log("All assertions passed.");  
   
/\* \===== EXPECTED OUTPUT \=====  
GET /users  \-\> {"statusCode":200,"body":\[{"id":1,"name":"Asha"}\]}  
POST /users \-\> {"statusCode":201,"body":{"id":2}}  
GET /nope   \-\> {"statusCode":404,"body":{"error":"Not Found"}}  
All assertions passed.  
\===== END EXPECTED OUTPUT \===== \*/

**Common Follow-up Questions**

**Q: What does express.json() do?**

A: It's built-in middleware that parses incoming JSON request bodies and populates req.body, so handlers can read the parsed object instead of a raw stream.

**Q: Why use express.Router()?**

A: To split routes into modular files by feature (e.g., userRoutes, orderRoutes) and mount them under a base path, keeping the app organized as it grows.

**Q: Is Express opinionated?**

A: No — it's intentionally minimal, leaving structure and choices to you. Frameworks like NestJS add opinions/structure on top of Node (and can use Express under the hood).

## **5\. Middleware**

**Simple Explanation**

Middleware are functions that run in sequence during the request/response cycle, each receiving (req, res, next). A middleware can inspect or modify the request and response, end the cycle by sending a response, or call next() to pass control to the next middleware in the chain.

This pipeline model is the heart of Express. Cross-cutting concerns — logging, body parsing, authentication, CORS, rate limiting, error handling — are implemented as middleware and composed in order, keeping route handlers focused on business logic.

**Hinglish Explanation**

Middleware aise functions hain jo request/response cycle ke dauraan sequence mein chalte hain, har ek (req, res, next) leta hai. Middleware request/response ko inspect/modify kar sakta hai, response bhej kar cycle end kar sakta hai, ya next() call karke control agle middleware ko de sakta hai.

Ye pipeline model Express ka dil hai. Cross-cutting concerns — logging, body parsing, authentication, CORS, rate limiting, error handling — middleware ke roop mein order mein compose hote hain, jisse route handlers business logic par focused rehte hain.

**Key Interview Points**

* Signature: (req, res, next) — inspect/modify, end the cycle, or call next().

* Runs in the order registered; next() passes control along the chain.

* Types: application-level (app.use), router-level, and error-handling (4 args).

* Used for logging, parsing, auth, CORS, rate limiting, and more.

* Forgetting next() (without sending a response) leaves the request hanging.

**Real-World Example**

A protected route uses a chain: a logger records the request, express.json() parses the body, an auth middleware verifies the token and attaches req.user, and only then does the handler run. Each concern is a small, reusable function plugged into the pipeline.

**Code — Full & Runnable (Node / JS)**

*Real Express middleware code (Node \+ Express). The Node-runnable demo below verifies the middleware chain with next().*

// Middleware — functions that run in sequence on each request via next().  
const express \= require("express");  
const app \= express();  
   
// Application-level middleware: runs for every request.  
function logger(req, res, next) {  
  console.log(\`${req.method} ${req.url}\`);  
  next(); // pass control to the next middleware  
}  
   
// Route-specific middleware: authentication guard.  
function requireAuth(req, res, next) {  
  const token \= req.headers.authorization;  
  if (\!token) return res.status(401).json({ error: "Unauthorized" });  
  req.user \= { id: 1, name: "Asha" }; // attach data for downstream handlers  
  next();  
}  
   
app.use(logger);  
   
app.get("/profile", requireAuth, (req, res) \=\> {  
  res.json({ message: \`Hello ${req.user.name}\` });  
});  
   
app.listen(3000);

**Test / Demo & Expected Output (Node-runnable)**

// Middleware — Express-style chain with next()  
function runMiddlewares(middlewares, req, res){  
  let i \= 0;  
  function next(){ const mw \= middlewares\[i++\]; if (mw) mw(req, res, next); }  
  next();  
}  
const req \= { url: "/admin", headers: { authorization: "Bearer token" }, user: null };  
const res \= { sent: null, send(d){ this.sent \= d; } };  
const log \= \[\];  
   
const logger \= (req, res, next) \=\> { log.push(\`${req.url} requested\`); next(); };  
const auth \= (req, res, next) \=\> {  
  if (\!req.headers.authorization) return res.send("401 Unauthorized");  
  req.user \= { name: "Asha" };  // attach data for later middleware  
  log.push("authenticated"); next();  
};  
const handler \= (req, res) \=\> { log.push(\`hello ${req.user.name}\`); res.send("200 OK"); };  
   
runMiddlewares(\[logger, auth, handler\], req, res);  
log.forEach(l \=\> console.log(l));  
console.log("Response:", res.sent);  
console.assert(res.sent \=== "200 OK" && req.user.name \=== "Asha", "chain ran in order");  
console.log("All assertions passed.");  
   
/\* \===== EXPECTED OUTPUT \=====  
/admin requested  
authenticated  
hello Asha  
Response: 200 OK  
All assertions passed.  
\===== END EXPECTED OUTPUT \===== \*/

**Common Follow-up Questions**

**Q: How does Express recognize error-handling middleware?**

A: By its arity — it takes four arguments (err, req, res, next). Express routes errors (thrown or passed to next(err)) to these handlers.

**Q: What happens if middleware neither sends a response nor calls next()?**

A: The request hangs — the client waits indefinitely — because control never moves forward and no response is sent.

**Q: What's the difference between app.use and a route handler?**

A: app.use mounts middleware for all (or path-prefixed) requests; a route handler is middleware bound to a specific method \+ path. Both share the (req, res, next) signature.

## **6\. REST APIs**

**Simple Explanation**

REST (Representational State Transfer) is an architectural style for APIs built around resources, identified by URLs, and manipulated with standard HTTP methods. /users is a collection, /users/1 is a specific resource; GET reads, POST creates, PUT/PATCH update, DELETE removes — a uniform, predictable interface.

RESTful APIs are typically stateless (each request carries everything needed), use proper status codes, and return representations (usually JSON). Good REST design uses nouns for resources, plural collections, and nested paths for relationships (/users/1/orders).

**Hinglish Explanation**

REST (Representational State Transfer) APIs ke liye ek architectural style hai jo resources ke aaspaas bana hai, jo URLs se identify hote hain aur standard HTTP methods se manipulate. /users ek collection hai, /users/1 ek specific resource; GET read, POST create, PUT/PATCH update, DELETE remove — ek uniform, predictable interface.

RESTful APIs aksar stateless hote hain (har request mein sab kuch hota hai), sahi status codes use karte hain, aur representations (aksar JSON) return karte hain. Achha REST design resources ke liye nouns, plural collections, aur relationships ke liye nested paths (/users/1/orders) use karta hai.

**Key Interview Points**

* Resources identified by URLs; manipulated via standard HTTP methods.

* Collections (/users) vs items (/users/1); use nouns and plurals.

* Stateless: each request is self-contained (no server-side session reliance).

* Return correct status codes and JSON representations.

* Model relationships with nested paths (/users/1/orders).

**Real-World Example**

A blog API exposes /posts (list/create), /posts/:id (read/update/delete), and /posts/:id/comments for related comments. A client can predict every operation from the URL and method without reading docs, because it follows REST conventions.

**Code — Full & Runnable (Node / JS)**

*Real Express router code (Node \+ Express). The Node-runnable demo below verifies the resource-routing logic.*

// REST APIs — resource-oriented routes using standard HTTP verbs.  
const express \= require("express");  
const router \= express.Router();  
   
let todos \= \[{ id: 1, text: "Learn REST", done: false }\];  
   
router.get("/todos", (req, res) \=\> res.json(todos));               // list  
router.get("/todos/:id", (req, res) \=\> {                           // read one  
  const todo \= todos.find((t) \=\> t.id \=== Number(req.params.id));  
  todo ? res.json(todo) : res.status(404).json({ error: "Not Found" });  
});  
router.post("/todos", (req, res) \=\> {                              // create  
  const todo \= { id: todos.length \+ 1, text: req.body.text, done: false };  
  todos.push(todo);  
  res.status(201).json(todo);  
});  
router.put("/todos/:id", (req, res) \=\> {                           // update  
  const todo \= todos.find((t) \=\> t.id \=== Number(req.params.id));  
  if (\!todo) return res.status(404).json({ error: "Not Found" });  
  Object.assign(todo, req.body);  
  res.json(todo);  
});  
router.delete("/todos/:id", (req, res) \=\> {                        // delete  
  todos \= todos.filter((t) \=\> t.id \!== Number(req.params.id));  
  res.status(204).end();  
});  
   
module.exports \= router;

**Test / Demo & Expected Output (Node-runnable)**

// REST APIs — resource-oriented routing (method \+ path \-\> action)  
const todos \= \[{ id: 1, text: "Learn Node" }\];  
function rest(method, path, body){  
  const m \= path.match(/^\\/todos(?:\\/(\\d+))?$/);  
  if (\!m) return { status: 404 };  
  const id \= m\[1\] ? Number(m\[1\]) : null;  
  if (method \=== "GET" && \!id) return { status: 200, body: todos };               // list  
  if (method \=== "GET" && id)  { const t \= todos.find(t \=\> t.id \=== id); return t ? { status: 200, body: t } : { status: 404 }; }  
  if (method \=== "POST" && \!id){ const t \= { id: todos.length \+ 1, ...body }; todos.push(t); return { status: 201, body: t }; }  
  if (method \=== "DELETE" && id){ const i \= todos.findIndex(t \=\> t.id \=== id); if (i\<0) return {status:404}; todos.splice(i,1); return { status: 204 }; }  
  return { status: 405 };  
}  
console.log("GET /todos      \-\>", JSON.stringify(rest("GET", "/todos")));  
console.log("POST /todos     \-\>", JSON.stringify(rest("POST", "/todos", { text: "Build API" })));  
console.log("GET /todos/2    \-\>", JSON.stringify(rest("GET", "/todos/2")));  
console.log("DELETE /todos/1 \-\>", JSON.stringify(rest("DELETE", "/todos/1")));  
console.assert(rest("GET", "/todos").body.length \=== 1, "one todo left after ops");  
console.log("All assertions passed.");  
   
/\* \===== EXPECTED OUTPUT \=====  
GET /todos      \-\> {"status":200,"body":\[{"id":1,"text":"Learn Node"}\]}  
POST /todos     \-\> {"status":201,"body":{"id":2,"text":"Build API"}}  
GET /todos/2    \-\> {"status":200,"body":{"id":2,"text":"Build API"}}  
DELETE /todos/1 \-\> {"status":204}  
All assertions passed.  
\===== END EXPECTED OUTPUT \===== \*/

**Common Follow-up Questions**

**Q: What does 'stateless' mean in REST?**

A: Each request contains all the information needed to process it (e.g., an auth token); the server doesn't rely on stored client session state between requests. This aids scalability.

**Q: How do you model a relationship like a user's orders?**

A: With a nested path: GET /users/:id/orders. It expresses that orders belong to a specific user while staying resource-oriented.

**Q: What makes an API 'RESTful' beyond using HTTP verbs?**

A: Resource-based URLs, statelessness, correct status codes, consistent representations, and ideally HATEOAS (links to related actions) — though many 'REST' APIs are pragmatic and skip strict HATEOAS.

## **7\. CRUD APIs**

**Simple Explanation**

CRUD covers the four basic operations on persistent data: Create, Read, Update, Delete. In a REST API these map cleanly to HTTP methods — POST to create, GET to read, PUT/PATCH to update, DELETE to remove — over a resource collection and its items.

Building a CRUD API means defining routes for each operation, connecting them to a data layer (database or ORM), validating input, and returning appropriate status codes. It's the backbone of most backend work and a staple interview exercise.

**Hinglish Explanation**

CRUD persistent data par chaar basic operations cover karta hai: Create, Read, Update, Delete. REST API mein ye HTTP methods se saaf map hote hain — POST create, GET read, PUT/PATCH update, DELETE remove — ek resource collection aur uske items par.

CRUD API banane ka matlab hai har operation ke liye routes define karna, unhe data layer (database/ORM) se jodna, input validate karna, aur sahi status codes return karna. Ye zyadatar backend kaam ki reedh hai aur common interview exercise hai.

**Key Interview Points**

* Create=POST, Read=GET, Update=PUT/PATCH, Delete=DELETE.

* Wire each route to a data layer (DB/ORM) and validate input.

* Return correct codes: 201 created, 200 read/updated, 204 deleted, 404 missing.

* PUT replaces; PATCH partially updates — pick deliberately.

* Handle not-found and validation errors consistently.

**Real-World Example**

A task manager's API: POST /tasks creates, GET /tasks lists, GET /tasks/:id reads one, PATCH /tasks/:id toggles completion, and DELETE /tasks/:id removes. The frontend's every action maps to one of these five endpoints.

**Code — Full & Runnable (Node / JS)**

*Real Express CRUD code (Node \+ Express). The Node-runnable demo below verifies create/read/update/delete against an in-memory store.*

// CRUD APIs — controller wired to a data model (here, an in-memory store).  
const express \= require("express");  
const app \= express();  
app.use(express.json());  
   
const db \= new Map();  
let seq \= 0;  
   
app.post("/products", (req, res) \=\> {                 // CREATE  
  const product \= { id: \++seq, ...req.body };  
  db.set(product.id, product);  
  res.status(201).json(product);  
});  
app.get("/products", (req, res) \=\> res.json(\[...db.values()\])); // READ all  
app.get("/products/:id", (req, res) \=\> {              // READ one  
  const p \= db.get(Number(req.params.id));  
  p ? res.json(p) : res.status(404).json({ error: "Not Found" });  
});  
app.patch("/products/:id", (req, res) \=\> {            // UPDATE  
  const id \= Number(req.params.id);  
  if (\!db.has(id)) return res.status(404).json({ error: "Not Found" });  
  const updated \= { ...db.get(id), ...req.body };  
  db.set(id, updated);  
  res.json(updated);  
});  
app.delete("/products/:id", (req, res) \=\> {           // DELETE  
  db.delete(Number(req.params.id));  
  res.status(204).end();  
});  
   
app.listen(3000);

**Test / Demo & Expected Output (Node-runnable)**

// CRUD APIs — in-memory store with create/read/update/delete  
function createResource(){  
  const store \= new Map(); let seq \= 0;  
  return {  
    create: (data) \=\> { const id \= \++seq; const rec \= { id, ...data }; store.set(id, rec); return rec; },  
    read:   (id) \=\> store.get(id) || null,  
    list:   () \=\> \[...store.values()\],  
    update: (id, patch) \=\> { if (\!store.has(id)) return null; const rec \= { ...store.get(id), ...patch }; store.set(id, rec); return rec; },  
    remove: (id) \=\> store.delete(id),  
  };  
}  
const users \= createResource();  
const a \= users.create({ name: "Asha" });  
const b \= users.create({ name: "Ravi" });  
console.log("Created:", JSON.stringify(\[a, b\]));  
console.log("Updated:", JSON.stringify(users.update(a.id, { name: "Asha K" })));  
users.remove(b.id);  
console.log("List after delete:", JSON.stringify(users.list()));  
console.assert(users.list().length \=== 1, "one user remains");  
console.assert(users.read(a.id).name \=== "Asha K", "update applied");  
console.log("All assertions passed.");  
   
/\* \===== EXPECTED OUTPUT \=====  
Created: \[{"id":1,"name":"Asha"},{"id":2,"name":"Ravi"}\]  
Updated: {"id":1,"name":"Asha K"}  
List after delete: \[{"id":1,"name":"Asha K"}\]  
All assertions passed.  
\===== END EXPECTED OUTPUT \===== \*/

**Common Follow-up Questions**

**Q: Which status code for a successful DELETE?**

A: 204 No Content when there's nothing to return, or 200 with a body if you return the deleted resource or a confirmation.

**Q: PUT vs PATCH for updates in CRUD?**

A: PUT replaces the whole resource (send all fields); PATCH updates only the provided fields. Use PATCH for partial edits, PUT for full replacement.

**Q: Where does validation fit in a CRUD endpoint?**

A: Before touching the data layer — typically as middleware that checks the request body against a schema and returns 400 with errors if invalid.

## **8\. Validation**

**Simple Explanation**

Validation ensures incoming data meets your rules before it's processed or stored — required fields, correct types, formats (email), ranges, and lengths. On the backend it's a security and integrity requirement, not just UX: never trust client input, since it can be malformed, malicious, or bypass the frontend entirely.

A clean approach is schema-based validation (Zod, Joi, Yup) applied as middleware, returning 400 with structured error messages when input is invalid. The same schema can also infer types, keeping validation and typing in sync.

**Hinglish Explanation**

Validation ensure karta hai ki incoming data process ya store hone se pehle aapke rules pura kare — required fields, sahi types, formats (email), ranges, lengths. Backend par ye security aur integrity ki zaroorat hai, sirf UX nahi: client input par kabhi bharosa mat karo, kyunki wo malformed, malicious ya frontend bypass kiya hua ho sakta hai.

Achha tarika hai schema-based validation (Zod, Joi, Yup) ko middleware ki tarah lagana, jo invalid input par 400 structured errors ke saath return kare. Wahi schema types bhi infer kar sakta hai, validation aur typing sync mein rehte hain.

**Key Interview Points**

* Validate all client input on the server — never trust the frontend.

* Check required fields, types, formats, ranges, and lengths.

* Use a schema library (Zod/Joi/Yup) as middleware for clean, reusable rules.

* Return 400 Bad Request with structured field-level error messages.

* Schema can also infer/validate types, keeping code and rules aligned.

**Real-World Example**

A signup endpoint runs the request body through a Zod schema: name (min 2), email (valid format), age (optional, \>= 18). Invalid requests get a 400 with per-field errors before any database call, protecting data integrity and giving the client clear feedback.

**Code — Full & Runnable (Node / JS)**

*Real Express \+ Zod validation code. The Node-runnable demo below verifies the validation logic.*

// Validation — validate request bodies with a schema library (Zod) middleware.  
const express \= require("express");  
const { z } \= require("zod");  
const app \= express();  
app.use(express.json());  
   
const createUserSchema \= z.object({  
  name: z.string().min(2),  
  email: z.string().email(),  
  age: z.number().int().min(18).optional(),  
});  
   
// Reusable validation middleware factory.  
const validate \= (schema) \=\> (req, res, next) \=\> {  
  const result \= schema.safeParse(req.body);  
  if (\!result.success) {  
    return res.status(400).json({ errors: result.error.flatten().fieldErrors });  
  }  
  req.body \= result.data; // parsed \+ typed  
  next();  
};  
   
app.post("/users", validate(createUserSchema), (req, res) \=\> {  
  res.status(201).json({ id: 1, ...req.body });  
});  
   
app.listen(3000);

**Test / Demo & Expected Output (Node-runnable)**

// Validation — validate a request body against a typed schema  
function validateBody(body, schema){  
  const errors \= {};  
  for (const field in schema){  
    const rule \= schema\[field\], value \= body\[field\];  
    if (rule.required && (value \=== undefined || value \=== "")) { errors\[field\] \= "required"; continue; }  
    if (value \!== undefined && rule.type && typeof value \!== rule.type) { errors\[field\] \= \`must be ${rule.type}\`; continue; }  
    if (rule.min && typeof value \=== "string" && value.length \< rule.min) errors\[field\] \= \`min ${rule.min} chars\`;  
    if (rule.min && typeof value \=== "number" && value \< rule.min) errors\[field\] \= \`min ${rule.min}\`;  
  }  
  return { valid: Object.keys(errors).length \=== 0, errors };  
}  
const schema \= { name: { required: true, type: "string", min: 2 }, age: { type: "number", min: 18 } };  
console.log(JSON.stringify(validateBody({ name: "A", age: 15 }, schema)));  
console.log(JSON.stringify(validateBody({ name: "Asha", age: 25 }, schema)));  
const bad \= validateBody({ age: 15 }, schema);  
console.assert(\!bad.valid && bad.errors.name \=== "required", "missing name flagged");  
console.log("All assertions passed.");  
   
/\* \===== EXPECTED OUTPUT \=====  
{"valid":false,"errors":{"name":"min 2 chars","age":"min 18"}}  
{"valid":true,"errors":{}}  
All assertions passed.  
\===== END EXPECTED OUTPUT \===== \*/

**Common Follow-up Questions**

**Q: Why validate on the server if the frontend already validates?**

A: Frontend validation is for UX and can be bypassed (curl, scripts, tampered clients). The server must validate to protect data integrity and security.

**Q: What status code for failed validation?**

A: 400 Bad Request, typically with a structured body listing which fields failed and why, so the client can correct the request.

**Q: Benefit of schema-based validation over manual checks?**

A: It's declarative, reusable, less error-prone, often gives type inference, and centralizes rules instead of scattering if-checks across handlers.

## **9\. Error handling**

**Simple Explanation**

Robust error handling means failures produce consistent, safe responses instead of crashes or leaked internals. In Express, a centralized error-handling middleware (with four arguments) catches errors from routes, converts them into proper status codes and JSON messages, and logs the technical details server-side.

Async handlers need care: a rejected promise won't reach the error middleware unless you forward it (try/catch with next(err), or an asyncHandler wrapper). A common pattern is a custom AppError class carrying a statusCode, so handlers throw meaningful errors that the central handler formats.

**Hinglish Explanation**

Robust error handling matlab failures consistent, safe responses dein, crash ya internal details leak na karein. Express mein ek centralized error-handling middleware (chaar arguments wala) routes se errors pakad kar unhe sahi status codes aur JSON messages mein badalta hai, aur technical details server par log karta hai.

Async handlers mein dhyaan: rejected promise error middleware tak tab tak nahi pahunchti jab tak aap use forward na karo (try/catch \+ next(err), ya asyncHandler wrapper). Common pattern: ek custom AppError class jisme statusCode ho, taaki handlers meaningful errors throw karein jo central handler format kare.

**Key Interview Points**

* Centralize handling in a 4-arg error middleware (err, req, res, next).

* Forward async errors via try/catch \+ next(err) or an asyncHandler wrapper.

* Use a custom AppError with statusCode for meaningful, throwable errors.

* Return safe messages \+ correct codes; log full details server-side only.

* Never leak stack traces or internals to clients in production.

**Real-World Example**

A handler throws new AppError('User not found', 404). The async wrapper forwards it to the central error middleware, which responds { error: 'User not found', status: 404 } and logs the stack trace to the monitoring service — clean for the client, detailed for the team.

**Code — Full & Runnable (Node / JS)**

*Real Express error-handling code. The Node-runnable demo below verifies the centralized handler logic.*

// Error handling — async wrapper \+ a centralized error-handling middleware.  
const express \= require("express");  
const app \= express();  
app.use(express.json());  
   
class AppError extends Error {  
  constructor(message, statusCode) {  
    super(message);  
    this.statusCode \= statusCode;  
  }  
}  
   
// Wrap async handlers so rejected promises reach the error middleware.  
const asyncHandler \= (fn) \=\> (req, res, next) \=\>  
  Promise.resolve(fn(req, res, next)).catch(next);  
   
app.get("/users/:id", asyncHandler(async (req, res) \=\> {  
  const user \= await findUser(req.params.id); // may throw / reject  
  if (\!user) throw new AppError("User not found", 404);  
  res.json(user);  
}));  
   
// Centralized error handler (4 args) — Express recognizes it by arity.  
app.use((err, req, res, next) \=\> {  
  const status \= err.statusCode || 500;  
  console.error(err);  
  res.status(status).json({ error: err.message, status });  
});  
   
async function findUser(id) { return id \=== "1" ? { id } : null; }  
app.listen(3000);

**Test / Demo & Expected Output (Node-runnable)**

// Error handling — async wrapper \+ centralized error middleware  
class AppError extends Error { constructor(message, status){ super(message); this.status \= status; } }  
const asyncHandler \= (fn) \=\> (req, res, next) \=\> Promise.resolve(fn(req, res, next)).catch(next);  
   
function errorHandler(err, req, res){  
  const status \= err.status || 500;  
  res.statusCode \= status;  
  res.body \= { error: err.message, status };  
}  
async function getUser(req, res){  
  if (\!req.params.id) throw new AppError("id is required", 400);  
  if (req.params.id \=== "999") throw new AppError("user not found", 404);  
  res.statusCode \= 200; res.body \= { id: req.params.id };  
}  
async function simulate(params){  
  const req \= { params }, res \= { statusCode: 0, body: null };  
  try { await asyncHandler(getUser)(req, res, (err) \=\> errorHandler(err, req, res)); }  
  catch (e) {}  
  return res;  
}  
(async () \=\> {  
  console.log("valid:  ", JSON.stringify(await simulate({ id: "1" })));  
  console.log("missing:", JSON.stringify(await simulate({})));  
  console.log("404:    ", JSON.stringify(await simulate({ id: "999" })));  
  const r \= await simulate({});  
  console.assert(r.statusCode \=== 400, "missing id \-\> 400 via central handler");  
  console.log("All assertions passed.");  
})();  
   
/\* \===== EXPECTED OUTPUT \=====  
valid:   {"statusCode":200,"body":{"id":"1"}}  
missing: {"statusCode":400,"body":{"error":"id is required","status":400}}  
404:     {"statusCode":404,"body":{"error":"user not found","status":404}}  
All assertions passed.  
\===== END EXPECTED OUTPUT \===== \*/

**Common Follow-up Questions**

**Q: Why won't a thrown error in an async handler reach the error middleware automatically?**

A: An async function returns a rejected promise rather than throwing synchronously. You must catch it and call next(err) (or use a wrapper), or Express won't see it.

**Q: What does an asyncHandler wrapper do?**

A: It wraps an async route so a rejected promise is caught and passed to next(), routing the error to the centralized handler without repeating try/catch everywhere.

**Q: What should you avoid sending to clients on error?**

A: Stack traces, internal messages, and implementation details — they aid attackers. Send a safe message and the right status code; log the rest server-side.

## **10\. Async handling**

**Simple Explanation**

Backend code is full of asynchronous I/O — database queries, API calls, file access. Modern Node uses Promises and async/await to write this clearly and sequentially, replacing nested callbacks ('callback hell'). Errors propagate naturally with try/catch around awaits.

Key techniques: await for sequential dependencies, Promise.all to run independent operations in parallel (much faster than awaiting one by one), Promise.allSettled when some may fail, and util.promisify to convert old callback-style APIs into promises.

**Hinglish Explanation**

Backend code asynchronous I/O se bhara hota hai — database queries, API calls, file access. Modern Node Promises aur async/await use karta hai ise clearly aur sequentially likhne ke liye, nested callbacks ('callback hell') ki jagah. Errors try/catch se naturally propagate hote hain.

Key techniques: sequential dependencies ke liye await, independent operations parallel chalane ke liye Promise.all (ek-ek await karne se kahin fast), kuch fail ho sakte hon to Promise.allSettled, aur purane callback APIs ko promise banane ke liye util.promisify.

**Key Interview Points**

* Use async/await for readable, sequential-looking async code (no callback hell).

* Wrap awaits in try/catch (or forward errors with next) to handle rejections.

* Promise.all runs independent async work in parallel for big speedups.

* Promise.allSettled tolerates partial failures; util.promisify converts callbacks.

* Don't await independent operations one-by-one — parallelize them.

**Real-World Example**

A dashboard endpoint needs the user and their orders — two independent queries. Using Promise.all(\[getUser(id), getOrders(id)\]) fetches both at once instead of waiting for one then the other, roughly halving the response time.

**Code — Full & Runnable (Node / JS)**

*Real Node/Express async code. The Node-runnable demo below verifies the async patterns by running them in Node.*

// Async handling — async/await with proper error propagation and parallelism.  
const express \= require("express");  
const app \= express();  
   
// Pretend these hit a database / external API.  
const getUser \= (id) \=\> Promise.resolve({ id, name: "User" \+ id });  
const getOrders \= (id) \=\> Promise.resolve(\[{ id: 1, userId: id }\]);  
   
app.get("/dashboard/:id", async (req, res, next) \=\> {  
  try {  
    const id \= req.params.id;  
    // Run independent requests in parallel instead of awaiting one by one.  
    const \[user, orders\] \= await Promise.all(\[getUser(id), getOrders(id)\]);  
    res.json({ user, orderCount: orders.length });  
  } catch (err) {  
    next(err); // forward to the error-handling middleware  
  }  
});  
   
app.listen(3000);  
// Tip: prefer async/await over nested callbacks; use Promise.all for parallel I/O.

**Test / Demo & Expected Output (Node-runnable)**

// Async handling — callback \-\> promise, async/await, parallel with Promise.all  
const { promisify } \= require("util");  
function fetchUserCb(id, cb){ setTimeout(() \=\> cb(null, { id, name: "User" \+ id }), 5); }  
const fetchUser \= promisify(fetchUserCb);   // convert callback API to promise  
   
(async () \=\> {  
  const one \= await fetchUser(1);             // sequential await  
  console.log("Awaited:", JSON.stringify(one));  
   
  const many \= await Promise.all(\[fetchUser(2), fetchUser(3), fetchUser(4)\]); // parallel  
  console.log("Parallel:", JSON.stringify(many.map(u \=\> u.name)));  
   
  const results \= await Promise.allSettled(\[fetchUser(5), Promise.reject(new Error("boom"))\]);  
  console.log("Settled statuses:", results.map(r \=\> r.status).join(", "));  
  console.assert(many.length \=== 3, "three fetched in parallel");  
  console.assert(results\[1\].status \=== "rejected", "allSettled captures rejection");  
  console.log("All assertions passed.");  
})();  
   
/\* \===== EXPECTED OUTPUT \=====  
Awaited: {"id":1,"name":"User1"}  
Parallel: \["User2","User3","User4"\]  
Settled statuses: fulfilled, rejected  
All assertions passed.  
\===== END EXPECTED OUTPUT \===== \*/

**Common Follow-up Questions**

**Q: When use Promise.all vs sequential await?**

A: Promise.all when operations are independent (run them in parallel). Sequential await when one depends on the result of a previous one.

**Q: Promise.all vs Promise.allSettled?**

A: Promise.all rejects as soon as any promise rejects (all-or-nothing). Promise.allSettled always resolves with each result's status, useful when partial failures are acceptable.

**Q: How do you use a callback-based API with async/await?**

A: Convert it to a promise — e.g., with util.promisify — then await it, or wrap it in a new Promise that resolves/rejects in the callback.

## **11\. MVC pattern**

**Simple Explanation**

MVC (Model-View-Controller) is a way to organize backend code by responsibility. The Model handles data and business rules (often via the database/ORM), the Controller receives requests, coordinates the model, and decides the response, and the View formats the output — in an API, the 'view' is usually the JSON serialization.

Separating these layers keeps code maintainable and testable: routes stay thin, business logic lives in models/services, and controllers glue them together. It's the conventional structure for Express apps and many frameworks (Rails, Laravel, NestJS).

**Hinglish Explanation**

MVC (Model-View-Controller) backend code ko responsibility ke hisaab se organize karne ka tarika hai. Model data aur business rules handle karta hai (aksar DB/ORM se), Controller requests le kar model ko coordinate karta hai aur response decide karta hai, aur View output format karta hai — API mein 'view' aksar JSON serialization hota hai.

In layers ko alag rakhna code ko maintainable aur testable banata hai: routes patle rehte hain, business logic models/services mein, aur controllers unhe jodte hain. Ye Express apps aur kai frameworks (Rails, Laravel, NestJS) ka conventional structure hai.

**Key Interview Points**

* Model: data \+ business rules (DB/ORM). Controller: request handling \+ coordination. View: output formatting (JSON in APIs).

* Keeps routes thin and business logic out of handlers.

* Improves maintainability, testability, and separation of concerns.

* Often extended with a Service layer between controller and model.

* Conventional structure across many web frameworks.

**Real-World Example**

A products feature splits into productModel (DB access), productController (handles requests, calls the model), and productRoutes (maps URLs to controller methods). A teammate fixing a pricing rule edits only the model, confident the controller and routes are unaffected.

**Code — Full & Runnable (Node / JS)**

*Real Node MVC code (Express). The Node-runnable demo below verifies the model → controller → view flow.*

// MVC pattern — separate Model (data), Controller (logic), routes (View \= JSON).  
// models/productModel.js  
const products \= \[{ id: 1, title: "Node Book", price: 30 }\];  
const ProductModel \= {  
  findAll: () \=\> products,  
  findById: (id) \=\> products.find((p) \=\> p.id \=== id),  
  create: (data) \=\> { const p \= { id: products.length \+ 1, ...data }; products.push(p); return p; },  
};  
   
// controllers/productController.js  
const ProductController \= {  
  index: (req, res) \=\> res.json(ProductModel.findAll()),  
  show: (req, res) \=\> {  
    const p \= ProductModel.findById(Number(req.params.id));  
    p ? res.json(p) : res.status(404).json({ error: "Not Found" });  
  },  
  create: (req, res) \=\> res.status(201).json(ProductModel.create(req.body)),  
};  
   
// routes/productRoutes.js  
const router \= require("express").Router();  
router.get("/products", ProductController.index);  
router.get("/products/:id", ProductController.show);  
router.post("/products", ProductController.create);  
module.exports \= router;

**Test / Demo & Expected Output (Node-runnable)**

// MVC pattern — Model (data) / Controller (logic) / View (formatting)  
const Model \= {  
  data: \[{ id: 1, title: "Node", price: 0 }\],  
  all(){ return this.data; },  
  find(id){ return this.data.find(p \=\> p.id \=== id); },  
};  
const View \= {  
  list(items){ return items.map(i \=\> \`\#${i.id} ${i.title}\`).join("\\n"); },  
  detail(item){ return item ? \`${item.title} ($${item.price})\` : "Not found"; },  
};  
const Controller \= {  
  index(){ return View.list(Model.all()); },             // controller coordinates  
  show(id){ return View.detail(Model.find(id)); },  
};  
console.log("INDEX:\\n" \+ Controller.index());  
console.log("SHOW 1:", Controller.show(1));  
console.log("SHOW 9:", Controller.show(9));  
console.assert(Controller.show(1).includes("Node"), "controller \-\> model \-\> view");  
console.log("All assertions passed.");  
   
/\* \===== EXPECTED OUTPUT \=====  
INDEX:  
\#1 Node  
SHOW 1: Node ($0)  
SHOW 9: Not found  
All assertions passed.  
\===== END EXPECTED OUTPUT \===== \*/

**Common Follow-up Questions**

**Q: What is the 'View' in a JSON API?**

A: The response representation — typically the JSON serialization of the data. There's no HTML template, so 'view' just means how the output is shaped for the client.

**Q: Where does business logic belong in MVC?**

A: In the model (or a dedicated service layer), not in controllers. Controllers should coordinate and shape responses, keeping logic reusable and testable.

**Q: Why add a service layer to MVC?**

A: To hold complex business logic and orchestrate multiple models, keeping controllers thin and models focused on data — useful as apps grow.

## **12\. Repository pattern basics**

**Simple Explanation**

The Repository pattern abstracts data access behind a consistent interface (findById, findAll, save, delete), so the rest of the app doesn't know or care whether data comes from Postgres, MongoDB, an API, or memory. Business logic depends on the repository interface, not on raw SQL or ORM calls.

This decoupling makes code easier to test (swap in an in-memory repository for unit tests), easier to change (switch databases without touching services), and cleaner (data-access details stay in one place). It pairs naturally with services in a layered architecture.

**Hinglish Explanation**

Repository pattern data access ko ek consistent interface (findById, findAll, save, delete) ke peeche abstract karta hai, taaki baaki app ko pata na ho ki data Postgres, MongoDB, API ya memory se aa raha hai. Business logic repository interface par depend karti hai, raw SQL/ORM par nahi.

Ye decoupling code ko test karna aasaan (unit tests mein in-memory repository), badalna aasaan (DB switch karo bina services chhuye), aur cleaner banata hai (data-access details ek jagah). Layered architecture mein services ke saath natural lagta hai.

**Key Interview Points**

* Abstracts data access behind a uniform interface (findById, save, delete...).

* Business logic depends on the interface, not on SQL/ORM specifics.

* Swap the data source (DB, API, in-memory) without changing callers.

* Improves testability: inject a fake/in-memory repo in unit tests.

* Centralizes query logic; pairs well with a service layer.

**Real-World Example**

A UserService calls userRepository.save() without knowing it runs a Postgres INSERT. In tests, the team injects an in-memory repository so the service logic is tested without a real database — fast and isolated. Later, migrating to a new DB only changes the repository implementation.

**Code — Full & Runnable (Node / JS)**

*Real Node code (repository \+ service). The Node-runnable demo below verifies the pattern with an in-memory source.*

// Repository pattern — isolate data access so services don't know the storage.  
// repositories/userRepository.js  
class UserRepository {  
  constructor(db) { this.db \= db; } // db could be Postgres, Mongo, etc.  
  async findById(id) { return this.db.query("SELECT \* FROM users WHERE id \= $1", \[id\]); }  
  async findAll() { return this.db.query("SELECT \* FROM users"); }  
  async save(user) { return this.db.query("INSERT INTO users(name) VALUES($1) RETURNING \*", \[user.name\]); }  
}  
   
// services/userService.js — depends on the repository abstraction, not SQL.  
class UserService {  
  constructor(userRepo) { this.userRepo \= userRepo; }  
  async register(name) {  
    const existing \= await this.userRepo.findAll();  
    if (existing.some((u) \=\> u.name \=== name)) throw new Error("name taken");  
    return this.userRepo.save({ name });  
  }  
}  
   
// Swapping the DB (or using an in-memory repo for tests) doesn't touch the service.  
module.exports \= { UserRepository, UserService };

**Test / Demo & Expected Output (Node-runnable)**

// Repository pattern — abstract data access behind an interface  
function createUserRepository(dataSource){  
  return {  
    findById: (id) \=\> dataSource.get(id),  
    findAll:  () \=\> \[...dataSource.values()\],  
    save:     (user) \=\> { dataSource.set(user.id, user); return user; },  
  };  
}  
// Swap the underlying source without changing business logic:  
const inMemory \= new Map();  
const repo \= createUserRepository(inMemory);  
   
// Service depends only on the repository interface, not the storage details  
function registerUser(repo, name){ const id \= repo.findAll().length \+ 1; return repo.save({ id, name }); }  
   
registerUser(repo, "Asha");  
registerUser(repo, "Ravi");  
console.log("All users:", JSON.stringify(repo.findAll()));  
console.log("Find \#1:", JSON.stringify(repo.findById(1)));  
console.assert(repo.findAll().length \=== 2, "repo persisted two users");  
console.log("Storage is swappable: same repo API could wrap Postgres/Mongo.");  
console.log("All assertions passed.");  
   
/\* \===== EXPECTED OUTPUT \=====  
All users: \[{"id":1,"name":"Asha"},{"id":2,"name":"Ravi"}\]  
Find \#1: {"id":1,"name":"Asha"}  
Storage is swappable: same repo API could wrap Postgres/Mongo.  
All assertions passed.  
\===== END EXPECTED OUTPUT \===== \*/

**Common Follow-up Questions**

**Q: How does the repository pattern help testing?**

A: You can inject a fake/in-memory repository implementing the same interface, so services are unit-tested without a real database — faster and more reliable tests.

**Q: Repository vs calling the ORM directly?**

A: Calling the ORM directly couples business logic to a specific data layer. A repository hides those details behind an interface, making swaps and tests easier.

**Q: Isn't an ORM already an abstraction?**

A: Yes, but a repository abstracts the ORM itself, so your services don't depend on ORM-specific APIs and you can change or mock the data layer freely.

## **13\. API versioning**

**Simple Explanation**

API versioning lets you evolve an API without breaking existing clients. When you need to change a response shape or behavior incompatibly, you expose a new version (v2) while keeping v1 working, giving clients time to migrate.

The most common approach is URL versioning (/api/v1/..., /api/v2/...) because it's explicit and easy to route. Alternatives include header versioning (via the Accept header) and query-parameter versioning. Whatever the scheme, the goal is backward compatibility and a clear deprecation path.

**Hinglish Explanation**

API versioning aapko API evolve karne deta hai bina existing clients ko toda. Jab response shape ya behavior incompatibly badalna ho, aap naya version (v2) expose karte ho jabki v1 chalta rehta hai, clients ko migrate karne ka time milta hai.

Sabse common URL versioning hai (/api/v1/..., /api/v2/...) kyunki ye explicit aur route karna aasaan hai. Alternatives: header versioning (Accept header) aur query-parameter versioning. Scheme jo bhi ho, goal hai backward compatibility aur clear deprecation path.

**Key Interview Points**

* Lets the API evolve without breaking existing clients.

* URL versioning (/api/v1, /api/v2) is the most explicit and common.

* Alternatives: header (Accept) versioning and query-param versioning.

* Keep old versions running during a clear deprecation window.

* Version when changes are breaking; additive changes often need no new version.

**Real-World Example**

An API originally returned name as one field. v2 splits it into firstName and lastName. Mobile apps still on v1 keep working unchanged, while new clients use /api/v2; the team announces a v1 sunset date months ahead.

**Code — Full & Runnable (Node / JS)**

*Real Express versioning code. The Node-runnable demo below verifies version-based routing.*

// API versioning — mount separate routers per version (URL versioning).  
const express \= require("express");  
const app \= express();  
   
const v1 \= express.Router();  
v1.get("/users/:id", (req, res) \=\>  
  res.json({ id: Number(req.params.id), name: "Asha K" })   // legacy shape  
);  
   
const v2 \= express.Router();  
v2.get("/users/:id", (req, res) \=\>  
  res.json({ id: Number(req.params.id), firstName: "Asha", lastName: "K" }) // new shape  
);  
   
app.use("/api/v1", v1);  
app.use("/api/v2", v2);  
   
// v1 clients keep working unchanged while v2 evolves the contract.  
// Alternatives: header versioning (Accept: application/vnd.app.v2+json)  
// or query param (?version=2). URL versioning is the most explicit.  
app.listen(3000);

**Test / Demo & Expected Output (Node-runnable)**

// API versioning — route by version; evolve response shape without breaking v1  
function getUser(version, id){  
  const base \= { id, firstName: "Asha", lastName: "K" };  
  if (version \=== "v1") return { id: base.id, name: \`${base.firstName} ${base.lastName}\` }; // old shape  
  if (version \=== "v2") return { id: base.id, firstName: base.firstName, lastName: base.lastName }; // new shape  
  return { error: "unsupported version" };  
}  
function route(path){  
  const m \= path.match(/^\\/api\\/(v\\d+)\\/users\\/(\\d+)$/);  
  if (\!m) return { status: 404 };  
  return { status: 200, body: getUser(m\[1\], Number(m\[2\])) };  
}  
console.log("v1:", JSON.stringify(route("/api/v1/users/1")));  
console.log("v2:", JSON.stringify(route("/api/v2/users/1")));  
console.assert(route("/api/v1/users/1").body.name \=== "Asha K", "v1 keeps old shape");  
console.assert(route("/api/v2/users/1").body.firstName \=== "Asha", "v2 new shape");  
console.log("All assertions passed.");  
   
/\* \===== EXPECTED OUTPUT \=====  
v1: {"status":200,"body":{"id":1,"name":"Asha K"}}  
v2: {"status":200,"body":{"id":1,"firstName":"Asha","lastName":"K"}}  
All assertions passed.  
\===== END EXPECTED OUTPUT \===== \*/

**Common Follow-up Questions**

**Q: When do you actually need a new API version?**

A: For breaking changes — removing/renaming fields, changing types or behavior. Additive, backward-compatible changes (new optional fields/endpoints) usually don't require a new version.

**Q: URL vs header versioning — trade-offs?**

A: URL versioning is explicit, easy to test and cache, and visible in logs. Header versioning keeps URLs clean and is considered more 'RESTful' but is less obvious and harder to test manually.

**Q: How do you retire an old version?**

A: Announce a deprecation timeline, monitor usage, warn via headers/docs, support both during migration, then sunset the old version once traffic is negligible.

## **14\. GraphQL basics**

**Simple Explanation**

GraphQL is a query language and runtime for APIs where the client specifies exactly which fields it wants, and the server returns precisely that shape — no more, no less. It exposes a single endpoint with a typed schema describing the available types, queries, and mutations.

Resolvers are functions that fetch the data for each field. Because clients select fields (and nested relations) in one request, GraphQL avoids the over-fetching and multiple round-trips common in REST. The strong schema also powers tooling, validation, and self-documentation.

**Hinglish Explanation**

GraphQL APIs ke liye ek query language aur runtime hai jahan client batata hai exactly kaun se fields chahiye, aur server bilkul wahi shape return karta hai — na zyada na kam. Ye ek single endpoint deta hai ek typed schema ke saath jo available types, queries, mutations describe karta hai.

Resolvers wo functions hain jo har field ka data fetch karte hain. Client ek hi request mein fields (aur nested relations) select karta hai, isliye GraphQL REST waali over-fetching aur multiple round-trips se bachta hai. Strong schema tooling, validation aur self-documentation bhi deta hai.

**Key Interview Points**

* Clients request exactly the fields they need; server returns that shape.

* Single endpoint \+ a typed schema (types, queries, mutations).

* Resolvers fetch data per field, including nested relations.

* Avoids over-fetching and reduces round-trips vs REST.

* Schema enables strong tooling, validation, and self-docs.

**Real-World Example**

A mobile app needs a user's name and their posts' titles. One GraphQL query fetches exactly that in a single request, while a REST equivalent might require GET /users/:id plus GET /users/:id/posts and return extra fields the app discards.

**Code — Full & Runnable (Node / JS)**

*Real Apollo Server GraphQL code (Node \+ @apollo/server). The Node-runnable demo below simulates resolver execution so the output is verifiable here.*

// GraphQL basics — a schema \+ resolvers with Apollo Server.  
const { ApolloServer } \= require("@apollo/server");  
const { startStandaloneServer } \= require("@apollo/server/standalone");  
   
const typeDefs \= \`\#graphql  
  type Post { id: ID\!, title: String\! }  
  type User { id: ID\!, name: String\!, email: String\!, posts: \[Post\!\]\! }  
  type Query { user(id: ID\!): User }  
\`;  
   
const db \= { user: { id: "1", name: "Asha", email: "a@x.com" }, posts: \[{ id: "p1", title: "Hi" }\] };  
   
const resolvers \= {  
  Query: {  
    user: (\_parent, args) \=\> ({ ...db.user, id: args.id }),  
  },  
  User: {  
    // resolved only if the client asks for \`posts\`  
    posts: () \=\> db.posts,  
  },  
};  
   
const server \= new ApolloServer({ typeDefs, resolvers });  
startStandaloneServer(server, { listen: { port: 4000 } });  
// Clients request exactly the fields they need — no over/under-fetching.

**Test / Demo & Expected Output (Node-runnable)**

// GraphQL basics — resolve only the requested fields from a query  
const db \= { user: { id: 1, name: "Asha", email: "a@x.com", posts: \[{ title: "Hi" }\] } };  
const resolvers \= {  
  user: () \=\> db.user,  
  "user.posts": () \=\> db.user.posts,  
};  
function execute(selection){  
  const user \= resolvers.user();  
  const result \= {};  
  for (const field of selection){  
    if (field \=== "posts") result.posts \= resolvers\["user.posts"\]().map(p \=\> ({ title: p.title }));  
    else result\[field\] \= user\[field\];  
  }  
  return result;  
}  
// Client asks for exactly what it needs:  
console.log("query { user { id name } }     \-\>", JSON.stringify(execute(\["id", "name"\])));  
console.log("query { user { name posts } }  \-\>", JSON.stringify(execute(\["name", "posts"\])));  
const r \= execute(\["id", "name"\]);  
console.assert(\!("email" in r), "unrequested fields are not returned");  
console.log("All assertions passed.");  
   
/\* \===== EXPECTED OUTPUT \=====  
query { user { id name } }     \-\> {"id":1,"name":"Asha"}  
query { user { name posts } }  \-\> {"name":"Asha","posts":\[{"title":"Hi"}\]}  
All assertions passed.  
\===== END EXPECTED OUTPUT \===== \*/

**Common Follow-up Questions**

**Q: What is a resolver?**

A: A function that returns the data for a particular field in the schema. GraphQL calls resolvers as it walks the query, including for nested fields and relations.

**Q: How does GraphQL avoid over-fetching?**

A: The client lists the exact fields it wants, so the server returns only those — unlike REST endpoints that return a fixed (often larger) shape.

**Q: Query vs mutation in GraphQL?**

A: Queries read data (no side effects); mutations change data (create/update/delete). Both are defined in the schema with typed inputs and outputs.

## **15\. GraphQL vs REST**

**Simple Explanation**

REST and GraphQL are two API styles with different trade-offs. REST uses multiple endpoints with fixed response shapes; it's simple, leverages HTTP caching well, and is ubiquitous — but can over-fetch (return unneeded fields) or under-fetch (require several requests). GraphQL uses one endpoint where clients select exactly the fields and relations they need in a single request.

GraphQL shines for complex, nested data and varied clients (mobile vs web) by eliminating over/under-fetching and round-trips. REST shines for simplicity, straightforward HTTP caching, and when fixed shapes are fine. Neither is universally better — the choice depends on the data and clients.

**Hinglish Explanation**

REST aur GraphQL do API styles hain alag trade-offs ke saath. REST multiple endpoints aur fixed response shapes use karta hai; simple hai, HTTP caching achhi karta hai, ubiquitous hai — par over-fetch (extra fields) ya under-fetch (kai requests) kar sakta hai. GraphQL ek endpoint deta hai jahan client ek request mein exact fields/relations select karta hai.

GraphQL complex, nested data aur alag-alag clients (mobile vs web) ke liye accha hai — over/under-fetching aur round-trips khatam karke. REST simplicity, seedhi HTTP caching aur fixed shapes theek hon to accha hai. Koi universally behtar nahi — choice data aur clients par depend karti hai.

**Key Interview Points**

* REST: many endpoints, fixed shapes, simple, great HTTP caching; can over/under-fetch.

* GraphQL: one endpoint, client-selected fields; avoids over/under-fetching.

* GraphQL reduces round-trips for nested/related data and varied clients.

* REST caching is simpler (per-URL); GraphQL caching needs more work.

* Choose by data complexity, client variety, and caching needs — not hype.

**Real-World Example**

A product detail screen needs product info plus reviews plus seller details. REST would hit three endpoints; GraphQL gets it all in one tailored query. But a simple public API serving static, fixed resources may be simpler and cache better as plain REST.

**Code — Full & Runnable (Node / JS)**

*Illustrative REST and GraphQL code side by side. The Node-runnable demo below compares payload sizes to show over-fetching.*

// GraphQL vs REST — the same data, two styles.  
   
// REST: multiple endpoints, fixed response shapes (often over-fetch).  
// GET /users/1            \-\> full user object  
// GET /users/1/posts      \-\> separate request for posts  
const express \= require("express");  
const app \= express();  
app.get("/users/:id", (req, res) \=\>  
  res.json({ id: req.params.id, name: "Asha", email: "a@x.com", bio: "...", avatar: "..." })  
);  
app.get("/users/:id/posts", (req, res) \=\> res.json(\[{ id: 1, title: "Hi" }\]));  
   
// GraphQL: ONE endpoint, the client picks fields and related data in one query:  
//   query {  
//     user(id: "1") {  
//       name  
//       posts { title }     \# fetched in the SAME round-trip  
//     }  
//   }  
// Trade-offs: REST is simpler & caches well over HTTP; GraphQL avoids  
// over/under-fetching and reduces round-trips, at the cost of more setup.  
app.listen(3000);

**Test / Demo & Expected Output (Node-runnable)**

// GraphQL vs REST — over-fetching (REST) vs precise selection (GraphQL)  
const fullUser \= { id: 1, name: "Asha", email: "a@x.com", bio: "x".repeat(200), avatar: "url", settings: { theme: "dark" } };  
function restEndpoint(){ return fullUser; }                              // returns everything  
function graphqlQuery(fields){ return Object.fromEntries(fields.map(f \=\> \[f, fullUser\[f\]\])); } // only asked fields  
   
const restPayload \= restEndpoint();  
const gqlPayload \= graphqlQuery(\["id", "name"\]);    // a list view only needs these  
const size \= (o) \=\> JSON.stringify(o).length;  
console.log("REST payload bytes:   ", size(restPayload));  
console.log("GraphQL payload bytes:", size(gqlPayload));  
console.log("Saved:", size(restPayload) \- size(gqlPayload), "bytes (no over-fetching)");  
console.assert(size(gqlPayload) \< size(restPayload), "GraphQL avoids over-fetching");  
console.log("All assertions passed.");  
   
/\* \===== EXPECTED OUTPUT \=====  
REST payload bytes:    292  
GraphQL payload bytes: 22  
Saved: 270 bytes (no over-fetching)  
All assertions passed.  
\===== END EXPECTED OUTPUT \===== \*/

**Common Follow-up Questions**

**Q: Where does REST still win over GraphQL?**

A: Simplicity, mature tooling, and straightforward HTTP caching per URL. For fixed, simple resources, REST is often easier to build, cache, and operate.

**Q: What's a downside of GraphQL?**

A: More setup and complexity, harder HTTP caching, and risks like expensive nested queries (needs depth limiting/cost analysis) and the N+1 problem (mitigated with DataLoader).

**Q: Can you use both?**

A: Yes — many systems expose REST for simple/public resources and GraphQL for complex client-driven data, even within the same product.

## **16\. gRPC basics**

**Simple Explanation**

gRPC is a high-performance RPC (Remote Procedure Call) framework. You define services and message types in a .proto file (Protocol Buffers), and gRPC generates strongly-typed client/server code. Calls feel like local function calls but run over the network using compact binary serialization on HTTP/2.

Compared to REST/JSON, gRPC is faster and smaller on the wire, strongly typed via the proto contract, and supports streaming (client, server, and bidirectional) thanks to HTTP/2. It's popular for internal service-to-service communication in microservices, less so for public browser-facing APIs.

**Hinglish Explanation**

gRPC ek high-performance RPC (Remote Procedure Call) framework hai. Aap services aur message types ek .proto file (Protocol Buffers) mein define karte ho, aur gRPC strongly-typed client/server code generate karta hai. Calls local function calls jaisi lagti hain par network par compact binary serialization se HTTP/2 par chalti hain.

REST/JSON ke comparison mein gRPC wire par fast aur chhota, proto contract se strongly typed, aur streaming (client, server, bidirectional) support karta hai HTTP/2 ki wajah se. Microservices mein internal service-to-service communication ke liye popular, public browser APIs ke liye kam.

**Key Interview Points**

* RPC framework: define services/messages in .proto (Protocol Buffers).

* Strongly typed; generates client/server stubs from the contract.

* Compact binary over HTTP/2 — faster and smaller than REST/JSON.

* Supports unary and streaming (client/server/bidirectional) calls.

* Best for internal microservice communication, not public web APIs.

**Real-World Example**

In a microservices backend, the orders service calls the inventory service via gRPC. The shared .proto guarantees both sides agree on types, and the binary HTTP/2 transport keeps latency low even at high request volumes between services.

**Code — Full & Runnable (Node / JS)**

*Real gRPC service code (Node \+ @grpc/grpc-js \+ a .proto contract). The Node-runnable demo below simulates the unary round-trip.*

// gRPC basics — define a service in protobuf, implement it in Node.  
// greeter.proto  
//   syntax \= "proto3";  
//   service Greeter { rpc SayHello (HelloRequest) returns (HelloReply); }  
//   message HelloRequest { string name \= 1; }  
//   message HelloReply   { string message \= 1; }  
   
const grpc \= require("@grpc/grpc-js");  
const protoLoader \= require("@grpc/proto-loader");  
   
const pkgDef \= protoLoader.loadSync("greeter.proto");  
const proto \= grpc.loadPackageDefinition(pkgDef);  
   
const server \= new grpc.Server();  
server.addService(proto.Greeter.service, {  
  // Unary RPC: one request \-\> one response, sent as binary protobuf over HTTP/2.  
  SayHello: (call, callback) \=\> {  
    callback(null, { message: \`Hello, ${call.request.name}\` });  
  },  
});  
   
server.bindAsync("0.0.0.0:50051", grpc.ServerCredentials.createInsecure(), () \=\>  
  console.log("gRPC server on :50051")  
);  
// gRPC: strongly-typed contracts, compact binary, HTTP/2 streaming — great for  
// service-to-service communication (vs REST/JSON for public web APIs).

**Test / Demo & Expected Output (Node-runnable)**

// gRPC basics — a typed service contract \+ unary call with (de)serialization  
const proto \= {  
  service: "Greeter",  
  methods: { SayHello: { request: \["name"\], response: \["message"\] } },  
};  
function serialize(obj, fields){ return fields.map(f \=\> \`${f}=${obj\[f\]}\`).join(";"); } // wire format (mimics protobuf)  
function deserialize(str){ return Object.fromEntries(str.split(";").map(p \=\> p.split("="))); }  
   
// Server implements the method per the contract:  
function SayHello(req){ return { message: \`Hello, ${req.name}\` }; }  
   
// Client call: serialize request \-\> server \-\> serialize response  
const wireReq \= serialize({ name: "Asha" }, proto.methods.SayHello.request);  
const req \= deserialize(wireReq);  
const wireRes \= serialize(SayHello(req), proto.methods.SayHello.response);  
console.log("Wire request: ", wireReq);  
console.log("Wire response:", wireRes);  
console.log("Decoded:", JSON.stringify(deserialize(wireRes)));  
console.assert(deserialize(wireRes).message \=== "Hello, Asha", "unary RPC round-trip");  
console.log("All assertions passed.");  
   
/\* \===== EXPECTED OUTPUT \=====  
Wire request:  name=Asha  
Wire response: message=Hello, Asha  
Decoded: {"message":"Hello, Asha"}  
All assertions passed.  
\===== END EXPECTED OUTPUT \===== \*/

**Common Follow-up Questions**

**Q: Why is gRPC faster than REST/JSON?**

A: It serializes data as compact binary Protocol Buffers (not verbose JSON) and uses HTTP/2 with multiplexing and streaming, reducing payload size and round-trip overhead.

**Q: Why isn't gRPC common for public browser APIs?**

A: Browsers can't speak raw gRPC directly (it needs gRPC-Web \+ a proxy), and binary contracts are less convenient for public consumers than JSON/REST.

**Q: What does the .proto file define?**

A: The service methods and their request/response message types. It's the strongly-typed contract from which client and server code is generated.

## **17\. API documentation (Swagger / OpenAPI)**

**Simple Explanation**

OpenAPI is a standard specification for describing REST APIs — their endpoints, methods, parameters, request/response schemas, and status codes — in a machine-readable format (YAML/JSON). Swagger is the tooling around it, most notably Swagger UI, which turns a spec into interactive, browsable documentation where developers can try endpoints live.

Good API docs reduce integration friction, serve as a contract between frontend and backend, and can drive code generation (clients, server stubs) and validation. Specs can be written by hand or generated from code annotations (e.g., swagger-jsdoc).

**Hinglish Explanation**

OpenAPI REST APIs ko describe karne ka ek standard specification hai — endpoints, methods, parameters, request/response schemas, status codes — machine-readable format (YAML/JSON) mein. Swagger uske aas-paas ki tooling hai, khaaskar Swagger UI jo spec ko interactive, browsable documentation bana deta hai jahan developers live endpoints try kar sakte hain.

Achhi API docs integration friction kam karti hain, frontend-backend ke beech contract banti hain, aur code generation (clients, server stubs) aur validation drive kar sakti hain. Specs haath se likhi ja sakti hain ya code annotations se generate (swagger-jsdoc).

**Key Interview Points**

* OpenAPI: a standard, machine-readable spec for REST APIs (YAML/JSON).

* Swagger UI renders the spec as interactive, try-it-out documentation.

* Acts as a contract between frontend and backend teams.

* Enables client/server code generation and request validation.

* Write specs by hand or generate from code annotations (swagger-jsdoc).

**Real-World Example**

A backend team publishes Swagger UI at /api-docs. Frontend developers explore every endpoint, see exact request/response shapes, and test calls in the browser — cutting back-and-forth questions and keeping both sides aligned on the API contract.

**Code — Full & Runnable (Node / JS)**

*Real Express \+ Swagger UI code. The Node-runnable demo below builds and validates an OpenAPI spec object.*

// API documentation — serve interactive Swagger UI from an OpenAPI spec.  
const express \= require("express");  
const swaggerUi \= require("swagger-ui-express");  
const app \= express();  
   
const openApiSpec \= {  
  openapi: "3.0.0",  
  info: { title: "User API", version: "1.0.0" },  
  paths: {  
    "/users": {  
      get: { summary: "List users", responses: { 200: { description: "OK" } } },  
      post: {  
        summary: "Create user",  
        responses: { 201: { description: "Created" }, 400: { description: "Bad Request" } },  
      },  
    },  
  },  
};  
   
// Interactive docs at /api-docs — try requests right in the browser.  
app.use("/api-docs", swaggerUi.serve, swaggerUi.setup(openApiSpec));  
app.listen(3000, () \=\> console.log("Docs: http://localhost:3000/api-docs"));  
// Tools like swagger-jsdoc can generate this spec from JSDoc comments on routes.

**Test / Demo & Expected Output (Node-runnable)**

// API documentation — build a minimal OpenAPI spec from route metadata  
const routes \= \[  
  { method: "get",  path: "/users",     summary: "List users",  responses: { 200: "OK" } },  
  { method: "post", path: "/users",     summary: "Create user", responses: { 201: "Created", 400: "Bad Request" } },  
  { method: "get",  path: "/users/{id}",summary: "Get user",    responses: { 200: "OK", 404: "Not Found" } },  
\];  
function buildOpenAPI(routes){  
  const spec \= { openapi: "3.0.0", info: { title: "User API", version: "1.0.0" }, paths: {} };  
  for (const r of routes){  
    spec.paths\[r.path\] \= spec.paths\[r.path\] || {};  
    spec.paths\[r.path\]\[r.method\] \= { summary: r.summary, responses: r.responses };  
  }  
  return spec;  
}  
const spec \= buildOpenAPI(routes);  
console.log("Documented paths:", Object.keys(spec.paths).join(", "));  
console.log("POST /users responses:", Object.keys(spec.paths\["/users"\].post.responses).join(", "));  
console.assert(spec.openapi \=== "3.0.0" && Object.keys(spec.paths).length \=== 2, "valid spec built");  
console.log("All assertions passed.");  
   
/\* \===== EXPECTED OUTPUT \=====  
Documented paths: /users, /users/{id}  
POST /users responses: 201, 400  
All assertions passed.  
\===== END EXPECTED OUTPUT \===== \*/

**Common Follow-up Questions**

**Q: Difference between OpenAPI and Swagger?**

A: OpenAPI is the specification standard; Swagger is the set of tools (Swagger UI, Editor, Codegen) built around it. The spec format was renamed from 'Swagger' to 'OpenAPI'.

**Q: How can docs stay in sync with code?**

A: Generate the spec from code annotations (e.g., swagger-jsdoc) or validate requests/responses against the spec in tests, so drift between docs and implementation is caught.

**Q: What else can an OpenAPI spec drive besides docs?**

A: Client SDK generation, server stub scaffolding, request/response validation, mock servers, and contract testing — it's a single source of truth for the API.

## **18\. What is SQL**

**Simple Explanation**

SQL (Structured Query Language) is the standard language for working with relational databases, which store data in tables of rows and columns with defined relationships. SQL is declarative — you describe what data you want, and the database engine figures out how to retrieve it efficiently.

It spans several sub-languages: DDL (CREATE/ALTER/DROP) defines structure, DML (SELECT/INSERT/UPDATE/DELETE) manipulates data, and DCL/TCL handle permissions and transactions. Relational databases enforce structure and integrity via schemas, types, and constraints.

**Hinglish Explanation**

SQL (Structured Query Language) relational databases ke saath kaam karne ki standard language hai, jo data ko rows aur columns ki tables mein defined relationships ke saath store karti hain. SQL declarative hai — aap batate ho kya data chahiye, aur database engine decide karta hai efficiently kaise laaye.

Iske kai sub-languages hain: DDL (CREATE/ALTER/DROP) structure define karta hai, DML (SELECT/INSERT/UPDATE/DELETE) data manipulate karta hai, aur DCL/TCL permissions aur transactions handle karte hain. Relational DBs schemas, types aur constraints se structure aur integrity enforce karti hain.

**Key Interview Points**

* Standard language for relational databases (tables of rows/columns).

* Declarative: state WHAT you want; the engine plans HOW to get it.

* DDL defines structure; DML reads/writes data; TCL manages transactions.

* Schemas, types, and constraints enforce data integrity.

* Core clauses: SELECT, FROM, WHERE, JOIN, GROUP BY, ORDER BY, LIMIT.

**Real-World Example**

To list the ten newest active users in Pune, you write one SELECT ... WHERE ... ORDER BY ... LIMIT statement. You don't tell the database how to scan or sort — it uses indexes and a query planner to do that efficiently.

**Code — Full & Runnable (Node / JS)**

*Real SQL via node-postgres (runs against PostgreSQL). The Node-runnable demo below simulates a SELECT/WHERE engine so the output is verifiable here.*

// What is SQL — declarative queries over relational tables (node-postgres).  
const { Pool } \= require("pg");  
const pool \= new Pool();  
   
async function demo() {  
  // DDL: define structure  
  await pool.query(\`  
    CREATE TABLE IF NOT EXISTS users (  
      id    SERIAL PRIMARY KEY,  
      name  TEXT NOT NULL,  
      age   INT,  
      city  TEXT  
    )  
  \`);  
   
  // DML: manipulate data  
  await pool.query("INSERT INTO users(name, age, city) VALUES($1, $2, $3)", \["Asha", 25, "Pune"\]);  
   
  // Query: declare WHAT you want; the DB engine decides HOW to get it.  
  const { rows } \= await pool.query(  
    "SELECT name, age FROM users WHERE city \= $1 ORDER BY age DESC LIMIT 10",  
    \["Pune"\]  
  );  
  console.log(rows);  
}  
   
demo();

**Test / Demo & Expected Output (Node-runnable)**

// What is SQL — a tiny SELECT ... WHERE engine over in-memory rows  
const users \= \[  
  { id: 1, name: "Asha", age: 25, city: "Pune" },  
  { id: 2, name: "Ravi", age: 30, city: "Delhi" },  
  { id: 3, name: "Mira", age: 22, city: "Pune" },  
\];  
function select(rows, { columns \= \["\*"\], where \= () \=\> true, orderBy } \= {}){  
  let result \= rows.filter(where);  
  if (orderBy) result \= \[...result\].sort((a, b) \=\> a\[orderBy\] \- b\[orderBy\]);  
  if (columns\[0\] \!== "\*") result \= result.map(r \=\> Object.fromEntries(columns.map(c \=\> \[c, r\[c\]\])));  
  return result;  
}  
// SELECT name, age FROM users WHERE city='Pune' ORDER BY age  
const q \= select(users, { columns: \["name", "age"\], where: (u) \=\> u.city \=== "Pune", orderBy: "age" });  
console.log("Result:", JSON.stringify(q));  
console.assert(q.length \=== 2 && q\[0\].name \=== "Mira", "filtered \+ ordered correctly");  
console.log("All assertions passed.");  
   
/\* \===== EXPECTED OUTPUT \=====  
Result: \[{"name":"Mira","age":22},{"name":"Asha","age":25}\]  
All assertions passed.  
\===== END EXPECTED OUTPUT \===== \*/

**Common Follow-up Questions**

**Q: What does it mean that SQL is 'declarative'?**

A: You specify the desired result, not the algorithm. The database's query planner decides the execution strategy (indexes, join order) to fetch it efficiently.

**Q: What's the difference between DDL and DML?**

A: DDL (CREATE, ALTER, DROP) defines or changes database structure; DML (SELECT, INSERT, UPDATE, DELETE) reads and modifies the data within that structure.

**Q: What makes a database 'relational'?**

A: Data is organized into tables with rows and columns, related via keys, with a schema and constraints enforcing types and integrity — and queried with SQL.

## **19\. PostgreSQL basics**

**Simple Explanation**

PostgreSQL is a powerful, open-source relational database known for standards compliance, reliability, and rich features: advanced data types (JSONB, arrays), full-text search, window functions, transactions with strong ACID guarantees, and extensibility. It's a popular default for production backends.

From Node you typically use the pg (node-postgres) library with a connection pool and parameterized queries ($1, $2). Parameterization sends values separately from the SQL text, which prevents SQL injection and lets the database cache query plans.

**Hinglish Explanation**

PostgreSQL ek powerful, open-source relational database hai jo standards compliance, reliability aur rich features ke liye jaana jaata hai: advanced data types (JSONB, arrays), full-text search, window functions, strong ACID transactions, aur extensibility. Production backends ke liye popular default hai.

Node se aap aksar pg (node-postgres) library, connection pool aur parameterized queries ($1, $2) use karte ho. Parameterization values ko SQL text se alag bhejta hai, jo SQL injection rokta hai aur DB ko query plans cache karne deta hai.

**Key Interview Points**

* Open-source, standards-compliant relational DB with rich features (JSONB, arrays, window fns).

* Strong ACID transactions and reliability — a common production default.

* Use node-postgres (pg) with a connection pool, not one connection per request.

* Parameterized queries ($1, $2) prevent SQL injection and aid plan caching.

* Supports advanced indexing (B-tree, GIN, partial) for performance.

**Real-World Example**

An app stores user profiles in Postgres, using a JSONB column for flexible preferences and parameterized queries for lookups by email. A connection pool reuses a handful of connections across thousands of requests instead of opening a new one each time.

**Code — Full & Runnable (Node / JS)**

*Real node-postgres code (runs against PostgreSQL). The Node-runnable demo below simulates parameterized queries so the output is verifiable here.*

// PostgreSQL basics — pooled connections \+ parameterized queries (node-postgres).  
const { Pool } \= require("pg");  
   
// A pool reuses a set of connections instead of opening one per request.  
const pool \= new Pool({  
  host: process.env.PGHOST,  
  database: process.env.PGDATABASE,  
  user: process.env.PGUSER,  
  password: process.env.PGPASSWORD,  
  max: 10, // max connections in the pool  
});  
   
async function getUserByEmail(email) {  
  // $1, $2 are bound parameters — values are sent separately, so this is  
  // immune to SQL injection (the input can never become SQL).  
  const { rows } \= await pool.query(  
    "SELECT id, name FROM users WHERE email \= $1 AND active \= $2",  
    \[email, true\]  
  );  
  return rows\[0\];  
}  
   
module.exports \= { getUserByEmail };

**Test / Demo & Expected Output (Node-runnable)**

// PostgreSQL basics — parameterized query ($1) prevents SQL injection  
function buildQuery(text, params){  
  // Real pg driver sends text \+ params separately; values are NEVER concatenated.  
  let preview \= text;  
  params.forEach((p, i) \=\> { preview \= preview.replace(\`$${i \+ 1}\`, typeof p \=== "string" ? \`'${p}'\` : p); });  
  return { text, params, preview };  
}  
const safe \= buildQuery("SELECT \* FROM users WHERE email \= $1 AND active \= $2", \["a@x.com", true\]);  
console.log("Parameterized text:", safe.text);  
console.log("Params:", JSON.stringify(safe.params));  
console.log("Driver-rendered:", safe.preview);  
// A malicious value stays DATA, not executable SQL:  
const attack \= buildQuery("SELECT \* FROM users WHERE name \= $1", \["x'; DROP TABLE users; \--"\]);  
console.log("Injection attempt is bound as a value, not SQL:", JSON.stringify(attack.params));  
console.assert(safe.params.length \=== 2, "values passed separately from SQL text");  
console.log("All assertions passed.");  
   
/\* \===== EXPECTED OUTPUT \=====  
Parameterized text: SELECT \* FROM users WHERE email \= $1 AND active \= $2  
Params: \["a@x.com",true\]  
Driver-rendered: SELECT \* FROM users WHERE email \= 'a@x.com' AND active \= true  
Injection attempt is bound as a value, not SQL: \["x'; DROP TABLE users; \--"\]  
All assertions passed.  
\===== END EXPECTED OUTPUT \===== \*/

**Common Follow-up Questions**

**Q: Why use parameterized queries?**

A: They send user values separately from the SQL text, so input can never be interpreted as SQL — preventing injection — and they enable the database to reuse cached query plans.

**Q: Why use a connection pool?**

A: Opening a DB connection is expensive. A pool maintains a set of reusable connections, dramatically improving throughput and avoiding exhausting the database's connection limit.

**Q: What's special about JSONB in Postgres?**

A: It stores JSON in a binary, indexable format, letting you mix flexible document-style data with relational tables and query inside the JSON efficiently.

## **20\. MySQL basics**

**Simple Explanation**

MySQL is one of the most widely used open-source relational databases, valued for speed, reliability, and a massive ecosystem (it powers much of the web, including the classic LAMP stack). It supports standard SQL, transactions (with the InnoDB engine), and replication for scaling reads.

From Node you commonly use the mysql2 driver with a connection pool and ? placeholders for parameterized queries (the driver escapes values to prevent injection). MySQL uses AUTO\_INCREMENT for surrogate primary keys and is functionally similar to Postgres for everyday CRUD.

**Hinglish Explanation**

MySQL sabse zyada use hone wale open-source relational databases mein se ek hai, jo speed, reliability aur bade ecosystem ke liye jaana jaata hai (LAMP stack samet web ka bada hissa isi par chalta hai). Ye standard SQL, transactions (InnoDB engine se), aur read scaling ke liye replication support karta hai.

Node se aam taur par mysql2 driver, connection pool aur ? placeholders (parameterized queries) use karte ho — driver values escape karta hai injection rokne ke liye. MySQL surrogate primary keys ke liye AUTO\_INCREMENT use karta hai aur rozana CRUD ke liye Postgres jaisa hi hai.

**Key Interview Points**

* Widely used open-source relational DB; fast, reliable, huge ecosystem.

* InnoDB engine provides ACID transactions and foreign keys.

* Use the mysql2 driver with a connection pool from Node.

* ? placeholders parameterize queries (driver escapes values).

* AUTO\_INCREMENT generates surrogate primary keys.

**Real-World Example**

A WordPress-style CMS stores posts in MySQL. The Node admin service uses mysql2 with pooled connections and ? placeholders to insert and fetch posts, relying on AUTO\_INCREMENT ids — a battle-tested setup for content-heavy sites.

**Code — Full & Runnable (Node / JS)**

*Real mysql2 code (runs against MySQL). The Node-runnable demo below simulates placeholder queries and AUTO\_INCREMENT so the output is verifiable here.*

// MySQL basics — mysql2 with a connection pool and ? placeholders.  
const mysql \= require("mysql2/promise");  
   
const pool \= mysql.createPool({  
  host: process.env.DB\_HOST,  
  user: process.env.DB\_USER,  
  password: process.env.DB\_PASS,  
  database: process.env.DB\_NAME,  
  connectionLimit: 10,  
});  
   
async function createProduct(name, price) {  
  // ? placeholders are escaped by the driver (prevents SQL injection).  
  const \[result\] \= await pool.execute(  
    "INSERT INTO products (name, price) VALUES (?, ?)",  
    \[name, price\]  
  );  
  return result.insertId; // AUTO\_INCREMENT id of the new row  
}  
   
async function findProduct(id) {  
  const \[rows\] \= await pool.execute("SELECT \* FROM products WHERE id \= ?", \[id\]);  
  return rows\[0\];  
}  
   
module.exports \= { createProduct, findProduct };

**Test / Demo & Expected Output (Node-runnable)**

// MySQL basics — ? placeholders \+ AUTO\_INCREMENT primary key  
function createTable(){  
  let autoIncrement \= 0; const rows \= \[\];  
  return {  
    insert(values){ const id \= \++autoIncrement; rows.push({ id, ...values }); return { insertId: id, affectedRows: 1 }; },  
    query(sql, params){ // SELECT ... WHERE col \= ?  
      const col \= sql.match(/WHERE (\\w+) \= \\?/)?.\[1\];  
      return col ? rows.filter(r \=\> r\[col\] \=== params\[0\]) : rows;  
    },  
  };  
}  
const products \= createTable();  
console.log("Insert 1:", JSON.stringify(products.insert({ name: "Phone" })));  
console.log("Insert 2:", JSON.stringify(products.insert({ name: "Laptop" })));  
console.log("Select where name=?:", JSON.stringify(products.query("SELECT \* FROM products WHERE name \= ?", \["Laptop"\])));  
console.assert(products.insert({ name: "Tablet" }).insertId \=== 3, "AUTO\_INCREMENT yields next id");  
console.log("All assertions passed.");  
   
/\* \===== EXPECTED OUTPUT \=====  
Insert 1: {"insertId":1,"affectedRows":1}  
Insert 2: {"insertId":2,"affectedRows":1}  
Select where name=?: \[{"id":2,"name":"Laptop"}\]  
All assertions passed.  
\===== END EXPECTED OUTPUT \===== \*/

**Common Follow-up Questions**

**Q: MySQL vs PostgreSQL — a quick distinction?**

A: Both are solid relational DBs. Postgres is known for standards compliance and advanced features (JSONB, window functions); MySQL for speed, simplicity, and ubiquity. For most CRUD apps either works well.

**Q: What's the role of the InnoDB engine?**

A: It's MySQL's default storage engine providing ACID transactions, row-level locking, and foreign key support — essential for reliable, concurrent writes.

**Q: How does MySQL prevent SQL injection in mysql2?**

A: By using ? placeholders with parameters; the driver safely escapes the values so they're treated as data, never executable SQL.

## **21\. Tables & schema design**

**Simple Explanation**

Schema design means defining your tables, columns, data types, keys, and constraints so the database accurately models your domain and enforces integrity. Choosing the right types (the narrowest that fits), marking columns NOT NULL/UNIQUE, adding CHECK constraints, and setting sensible defaults all prevent bad data at the source.

Good design also considers relationships (foreign keys), surrogate vs natural keys, and which columns to index for the queries you'll run. A clean schema makes queries simpler, faster, and safer; a poor one leads to anomalies and brittle application code.

**Hinglish Explanation**

Schema design matlab tables, columns, data types, keys aur constraints define karna taaki database aapke domain ko accurately model kare aur integrity enforce kare. Sahi types choose karna (jo fit ho usme sabse narrow), columns ko NOT NULL/UNIQUE karna, CHECK constraints aur sensible defaults — ye sab source par hi bad data rokte hain.

Achha design relationships (foreign keys), surrogate vs natural keys, aur kaun se columns index karne hain (queries ke hisaab se) bhi consider karta hai. Saaf schema queries ko simpler, faster, safer banata hai; kharab schema anomalies aur brittle code deta hai.

**Key Interview Points**

* Pick the narrowest correct data type for each column.

* Enforce integrity with NOT NULL, UNIQUE, CHECK, and DEFAULT.

* Use primary keys (often a surrogate SERIAL/UUID) and foreign keys for relations.

* Index columns you frequently filter, sort, or join on.

* A good schema prevents anomalies and keeps queries simple and fast.

**Real-World Example**

Designing a users table, you set email as VARCHAR NOT NULL UNIQUE, age as SMALLINT with CHECK (age \>= 0), and created\_at with a DEFAULT now(). The database now rejects duplicate emails and negative ages automatically — invalid data can't get in.

**Code — Full & Runnable (Node / JS)**

*Real SQL DDL (runs against PostgreSQL). The Node-runnable demo below validates a row against the schema so the output is verifiable here.*

// Tables & schema design — DDL with appropriate types, keys, and constraints.  
// schema.sql (run via a migration or psql)  
const schema \= \`  
  CREATE TABLE users (  
    id         SERIAL PRIMARY KEY,                 \-- surrogate primary key  
    email      VARCHAR(255) NOT NULL UNIQUE,       \-- unique constraint  
    name       VARCHAR(100) NOT NULL,  
    age        SMALLINT CHECK (age \>= 0),          \-- domain constraint  
    created\_at TIMESTAMPTZ NOT NULL DEFAULT now()  \-- sensible default  
  );  
   
  CREATE TABLE orders (  
    id          SERIAL PRIMARY KEY,  
    user\_id     INT NOT NULL REFERENCES users(id) ON DELETE CASCADE, \-- FK  
    total\_cents INT NOT NULL CHECK (total\_cents \>= 0),  
    status      VARCHAR(20) NOT NULL DEFAULT 'pending'  
  );  
   
  CREATE INDEX idx\_orders\_user\_id ON orders(user\_id); \-- speed up lookups by user  
\`;  
   
// Design tips: pick the narrowest correct type, enforce invariants with  
// constraints (NOT NULL/UNIQUE/CHECK/FK), and index columns you filter/join on.  
module.exports \= schema;

**Test / Demo & Expected Output (Node-runnable)**

// Tables & schema design — define columns/constraints, validate a row  
const schema \= {  
  table: "users",  
  columns: {  
    id:    { type: "number", primaryKey: true },  
    email: { type: "string", notNull: true, unique: true },  
    age:   { type: "number", check: (v) \=\> v \>= 0 },  
  },  
};  
function validateRow(row, schema){  
  const errors \= \[\];  
  for (const col in schema.columns){  
    const def \= schema.columns\[col\], val \= row\[col\];  
    if (def.notNull && (val \=== undefined || val \=== null)) errors.push(\`${col} cannot be NULL\`);  
    if (val \!== undefined && typeof val \!== def.type) errors.push(\`${col} must be ${def.type}\`);  
    if (def.check && val \!== undefined && \!def.check(val)) errors.push(\`${col} failed CHECK\`);  
  }  
  return errors;  
}  
console.log("Valid row:  ", JSON.stringify(validateRow({ id: 1, email: "a@x.com", age: 25 }, schema)));  
console.log("Invalid row:", JSON.stringify(validateRow({ id: 2, age: \-3 }, schema)));  
const errs \= validateRow({ id: 2, age: \-3 }, schema);  
console.assert(errs.includes("email cannot be NULL"), "NOT NULL enforced");  
console.assert(errs.includes("age failed CHECK"), "CHECK constraint enforced");  
console.log("All assertions passed.");  
   
/\* \===== EXPECTED OUTPUT \=====  
Valid row:   \[\]  
Invalid row: \["email cannot be NULL","age failed CHECK"\]  
All assertions passed.  
\===== END EXPECTED OUTPUT \===== \*/

**Common Follow-up Questions**

**Q: Surrogate vs natural primary key?**

A: A surrogate key is a system-generated id (SERIAL/UUID) with no business meaning; a natural key is real data (like email). Surrogate keys are stable and simple; natural keys can change, which complicates references.

**Q: Why enforce constraints in the database, not just the app?**

A: The database is the last line of defense and is shared by many clients/services. Constraints guarantee integrity even if application code has bugs or is bypassed.

**Q: Which columns should you index?**

A: Those frequently used in WHERE filters, JOIN conditions, and ORDER BY. Avoid over-indexing, since each index adds write overhead and storage.

## **22\. Normalization & denormalization**

**Simple Explanation**

Normalization organizes data to eliminate redundancy and update anomalies by splitting it into related tables, each storing a fact once (guided by normal forms like 1NF, 2NF, 3NF). For example, customer details live in a customers table, and orders reference them by foreign key instead of repeating the customer's name and city in every row.

Denormalization is the deliberate reintroduction of redundancy to speed up reads — fewer joins, precomputed aggregates — at the cost of having to keep duplicated data in sync on writes. Real systems balance the two: normalize for integrity, denormalize selectively for performance.

**Hinglish Explanation**

Normalization data ko aise organize karta hai ki redundancy aur update anomalies khatam ho — data ko related tables mein split karke, har fact ek baar store hota hai (1NF, 2NF, 3NF normal forms ke hisaab se). Jaise customer details customers table mein, aur orders foreign key se unhe reference karte hain, har row mein naam/city repeat nahi karte.

Denormalization jaan-bujh kar redundancy wapas laata hai reads tez karne ke liye — kam joins, precomputed aggregates — par writes par duplicated data sync rakhna padta hai. Real systems dono balance karte hain: integrity ke liye normalize, performance ke liye selectively denormalize.

**Key Interview Points**

* Normalization removes redundancy/anomalies by splitting into related tables.

* Normal forms (1NF, 2NF, 3NF) guide storing each fact exactly once.

* Foreign keys reference shared data instead of duplicating it.

* Denormalization adds redundancy to speed reads (fewer joins, cached aggregates).

* Trade-off: normalized \= integrity & cheap writes; denormalized \= fast reads, sync cost.

**Real-World Example**

An e-commerce DB normalizes customers and orders so updating a customer's city changes one row. For a heavy analytics dashboard, the team denormalizes a daily-sales summary table so reports don't re-join and aggregate millions of order rows on every load.

**Code — Full & Runnable (Node / JS)**

*Real SQL schema and join query (PostgreSQL). The Node-runnable demo below shows the normalize/re-join logic in JS.*

// Normalization & denormalization — 3NF tables vs a read-optimized view.  
// NORMALIZED (avoids duplicate customer data; update in one place):  
const normalizedSchema \= \`  
  CREATE TABLE customers (  
    id   SERIAL PRIMARY KEY,  
    name TEXT NOT NULL,  
    city TEXT NOT NULL  
  );  
  CREATE TABLE orders (  
    id          SERIAL PRIMARY KEY,  
    customer\_id INT NOT NULL REFERENCES customers(id),  
    item        TEXT NOT NULL  
  );  
\`;  
   
// Read it back with a JOIN (denormalize at query time):  
const joinQuery \= \`  
  SELECT o.id, o.item, c.name AS customer, c.city  
  FROM orders o  
  JOIN customers c ON c.id \= o.customer\_id;  
\`;  
   
// DENORMALIZATION (deliberate redundancy for read speed) — e.g. store a cached  
// total or duplicate a frequently-read field to avoid expensive joins at scale.  
// Trade-off: faster reads, but you must keep the duplicated data in sync on write.  
module.exports \= { normalizedSchema, joinQuery };

**Test / Demo & Expected Output (Node-runnable)**

// Normalization & denormalization — split repeated data, then rejoin  
const denormalized \= \[  
  { orderId: 1, customer: "Asha", customerCity: "Pune", item: "Phone" },  
  { orderId: 2, customer: "Asha", customerCity: "Pune", item: "Case" },  
  { orderId: 3, customer: "Ravi", customerCity: "Delhi", item: "Laptop" },  
\];  
// Normalize: customers stored once, orders reference them (no repetition)  
function normalize(rows){  
  const customers \= new Map(); const orders \= \[\];  
  for (const r of rows){  
    if (\!customers.has(r.customer)) customers.set(r.customer, { id: customers.size \+ 1, name: r.customer, city: r.customerCity });  
    orders.push({ orderId: r.orderId, customerId: customers.get(r.customer).id, item: r.item });  
  }  
  return { customers: \[...customers.values()\], orders };  
}  
const { customers, orders } \= normalize(denormalized);  
console.log("Customers (stored once):", JSON.stringify(customers));  
console.log("Orders (reference customer):", JSON.stringify(orders));  
// Denormalize (join back) for a read-optimized view:  
const joined \= orders.map(o \=\> ({ ...o, customer: customers.find(c \=\> c.id \=== o.customerId).name }));  
console.log("Re-joined view:", JSON.stringify(joined));  
console.assert(customers.length \=== 2, "Asha stored once, not twice");  
console.log("All assertions passed.");  
   
/\* \===== EXPECTED OUTPUT \=====  
Customers (stored once): \[{"id":1,"name":"Asha","city":"Pune"},{"id":2,"name":"Ravi","city":"Delhi"}\]  
Orders (reference customer): \[{"orderId":1,"customerId":1,"item":"Phone"},{"orderId":2,"customerId":1,"item":"Case"},{"orderId":3,"customerId":2,"item":"Laptop"}\]  
Re-joined view: \[{"orderId":1,"customerId":1,"item":"Phone","customer":"Asha"},{"orderId":2,"customerId":1,"item":"Case","customer":"Asha"},{"orderId":3,"customerId":2,"item":"Laptop","customer":"Ravi"}\]  
All assertions passed.  
\===== END EXPECTED OUTPUT \===== \*/

**Common Follow-up Questions**

**Q: What problem does normalization solve?**

A: Redundancy and the update/insert/delete anomalies it causes. Storing each fact once means an update happens in a single place, keeping data consistent.

**Q: When is denormalization worth it?**

A: When read performance is critical and joins/aggregations are expensive at scale. You accept duplicated data and the burden of keeping it in sync on writes.

**Q: What is 3NF in simple terms?**

A: Every non-key column depends only on the primary key (not on other non-key columns). It removes transitive dependencies, reducing redundancy further than 1NF/2NF.

## **23\. Relationships**

**Simple Explanation**

Relational databases model how entities relate. One-to-one links two tables where each row matches at most one row in the other. One-to-many is the most common: one parent row (an author) has many children (books), with the foreign key on the 'many' side. Many-to-many (students and courses) requires a join table holding pairs of foreign keys.

Modeling relationships correctly — with foreign keys and, for many-to-many, a join table — keeps data consistent and enables expressive queries via JOINs. The relationship type determines where the foreign key lives and how you query across tables.

**Hinglish Explanation**

Relational databases batate hain entities kaise related hain. One-to-one do tables ko jodta hai jahan har row doosre mein zyada se zyada ek row se match kare. One-to-many sabse common: ek parent row (author) ke kai children (books), foreign key 'many' side par. Many-to-many (students aur courses) ke liye join table chahiye jo foreign keys ke pairs rakhe.

Relationships sahi model karna — foreign keys se, aur many-to-many ke liye join table — data consistent rakhta hai aur JOINs se expressive queries deta hai. Relationship type decide karta hai foreign key kahan rahe aur tables ke across kaise query karein.

**Key Interview Points**

* One-to-one: each row matches at most one row in the other table.

* One-to-many: FK on the 'many' side points to the parent (author \-\> books).

* Many-to-many: a join table stores pairs of foreign keys (enrollments).

* Foreign keys enforce that references point to existing rows.

* Relationship type dictates FK placement and how you JOIN.

**Real-World Example**

A library schema: each book has one author (one-to-many: author \-\> books), and students enroll in many courses while each course has many students (many-to-many via an enrollments join table). Queries JOIN across these to answer 'which courses is this student taking?'.

**Code — Full & Runnable (Node / JS)**

*Real SQL schema (PostgreSQL). The Node-runnable demo below resolves the relationships in JS so the output is verifiable here.*

// Relationships — model one-to-many and many-to-many with foreign keys.  
const schema \= \`  
  \-- ONE-TO-MANY: one author has many books  
  CREATE TABLE authors (  
    id   SERIAL PRIMARY KEY,  
    name TEXT NOT NULL  
  );  
  CREATE TABLE books (  
    id        SERIAL PRIMARY KEY,  
    title     TEXT NOT NULL,  
    author\_id INT NOT NULL REFERENCES authors(id)   \-- the "many" side holds the FK  
  );  
   
  \-- MANY-TO-MANY: students \<-\> courses, via a join table  
  CREATE TABLE students (id SERIAL PRIMARY KEY, name TEXT);  
  CREATE TABLE courses  (id SERIAL PRIMARY KEY, title TEXT);  
  CREATE TABLE enrollments (  
    student\_id INT REFERENCES students(id),  
    course\_id  INT REFERENCES courses(id),  
    PRIMARY KEY (student\_id, course\_id)             \-- composite PK prevents dupes  
  );  
\`;  
   
// Query a student's courses through the join table:  
const studentCourses \= \`  
  SELECT c.title FROM courses c  
  JOIN enrollments e ON e.course\_id \= c.id  
  WHERE e.student\_id \= $1;  
\`;  
module.exports \= { schema, studentCourses };

**Test / Demo & Expected Output (Node-runnable)**

// Relationships — one-to-many and many-to-many resolution  
const authors \= \[{ id: 1, name: "Asha" }, { id: 2, name: "Ravi" }\];  
const books   \= \[{ id: 10, title: "Node", authorId: 1 }, { id: 11, title: "SQL", authorId: 1 }, { id: 12, title: "React", authorId: 2 }\];  
// One-to-many: author \-\> books  
function booksByAuthor(authorId){ return books.filter(b \=\> b.authorId \=== authorId); }  
   
// Many-to-many via a join table: students \<-\> courses  
const enrollments \= \[{ studentId: 1, courseId: 100 }, { studentId: 1, courseId: 101 }, { studentId: 2, courseId: 100 }\];  
function coursesForStudent(id){ return enrollments.filter(e \=\> e.studentId \=== id).map(e \=\> e.courseId); }  
   
console.log("Asha's books:", booksByAuthor(1).map(b \=\> b.title).join(", "));  
console.log("Student 1 courses:", coursesForStudent(1).join(", "));  
console.log("Course 100 students:", enrollments.filter(e \=\> e.courseId \=== 100).map(e \=\> e.studentId).join(", "));  
console.assert(booksByAuthor(1).length \=== 2, "one-to-many resolved");  
console.assert(coursesForStudent(1).length \=== 2, "many-to-many resolved");  
console.log("All assertions passed.");  
   
/\* \===== EXPECTED OUTPUT \=====  
Asha's books: Node, SQL  
Student 1 courses: 100, 101  
Course 100 students: 1, 2  
All assertions passed.  
\===== END EXPECTED OUTPUT \===== \*/

**Common Follow-up Questions**

**Q: Where does the foreign key go in a one-to-many relationship?**

A: On the 'many' side. For author \-\> books, the books table has an author\_id referencing authors(id).

**Q: How do you model many-to-many?**

A: With a join (junction) table containing foreign keys to both entities — e.g., enrollments(student\_id, course\_id) — often with a composite primary key to prevent duplicate pairs.

**Q: Why use foreign keys instead of just storing ids?**

A: Foreign keys enforce referential integrity: the database rejects references to non-existent rows and can cascade updates/deletes, preventing orphaned data.

## **24\. Primary & Foreign keys**

**Simple Explanation**

A primary key uniquely identifies each row in a table; it must be unique and non-null. Most tables use a surrogate primary key (an auto-generated SERIAL or UUID) for stability. A foreign key is a column that references a primary key in another table, establishing a relationship and enforcing referential integrity.

Together they keep data consistent: the database rejects duplicate primary keys and rejects foreign keys that point to non-existent rows. Foreign keys can also define ON DELETE/UPDATE behavior (CASCADE, SET NULL, RESTRICT) to control what happens to related rows.

**Hinglish Explanation**

Primary key har row ko uniquely identify karti hai; unique aur non-null honi chahiye. Zyadatar tables surrogate primary key (auto-generated SERIAL ya UUID) use karte hain stability ke liye. Foreign key ek column hai jo doosri table ki primary key reference karta hai, relationship banata hai aur referential integrity enforce karta hai.

Dono milkar data consistent rakhte hain: DB duplicate primary keys reject karta hai aur aise foreign keys reject karta hai jo non-existent rows ko point karein. Foreign keys ON DELETE/UPDATE behavior (CASCADE, SET NULL, RESTRICT) bhi define kar sakte hain.

**Key Interview Points**

* Primary key: unique \+ non-null identifier for each row (often surrogate SERIAL/UUID).

* Foreign key: references another table's primary key, forming a relationship.

* DB enforces PK uniqueness and FK referential integrity automatically.

* ON DELETE/UPDATE options: CASCADE, SET NULL, RESTRICT control related rows.

* Composite keys combine multiple columns when needed (e.g., join tables).

**Real-World Example**

An orders table has customer\_id as a foreign key to customers(id) with ON DELETE CASCADE. Inserting an order for a non-existent customer fails immediately, and deleting a customer automatically removes their orders — no orphaned records.

**Code — Full & Runnable (Node / JS)**

*Real SQL DDL (PostgreSQL). The Node-runnable demo below enforces PK uniqueness and FK integrity in JS so the output is verifiable here.*

// Primary & Foreign keys — identity \+ referential integrity.  
const schema \= \`  
  CREATE TABLE customers (  
    id    SERIAL PRIMARY KEY,        \-- PRIMARY KEY: unique, not null, identifies a row  
    email TEXT NOT NULL UNIQUE       \-- a natural unique key (alternate key)  
  );  
   
  CREATE TABLE orders (  
    id          SERIAL PRIMARY KEY,  
    customer\_id INT NOT NULL  
      REFERENCES customers(id)       \-- FOREIGN KEY: must match an existing customer  
      ON DELETE CASCADE              \-- delete a customer \-\> their orders go too  
      ON UPDATE CASCADE  
  );  
\`;  
   
// Effects:  
// \- Inserting an order with a non-existent customer\_id fails (FK violation).  
// \- Duplicate primary keys are rejected automatically.  
// \- ON DELETE options: CASCADE, SET NULL, or RESTRICT control referential behavior.  
module.exports \= schema;

**Test / Demo & Expected Output (Node-runnable)**

// Primary & Foreign keys — enforce uniqueness (PK) \+ referential integrity (FK)  
function createTable(pk){  
  const rows \= new Map();  
  return {  
    insert(row){  
      if (rows.has(row\[pk\])) throw new Error(\`duplicate primary key: ${row\[pk\]}\`);  
      rows.set(row\[pk\], row); return row;  
    },  
    has: (key) \=\> rows.has(key),  
    all: () \=\> \[...rows.values()\],  
  };  
}  
const customers \= createTable("id");  
customers.insert({ id: 1, name: "Asha" });  
try { customers.insert({ id: 1, name: "Dup" }); } catch (e) { console.log("PK rejected:", e.message); }  
   
const orders \= createTable("id");  
function insertOrder(order){  
  if (\!customers.has(order.customerId)) throw new Error(\`FK violation: customer ${order.customerId} does not exist\`);  
  return orders.insert(order);  
}  
console.log("Valid order:", JSON.stringify(insertOrder({ id: 100, customerId: 1 })));  
try { insertOrder({ id: 101, customerId: 999 }); } catch (e) { console.log("FK rejected:", e.message); }  
console.assert(orders.all().length \=== 1, "only valid FK order inserted");  
console.log("All assertions passed.");  
   
/\* \===== EXPECTED OUTPUT \=====  
PK rejected: duplicate primary key: 1  
Valid order: {"id":100,"customerId":1}  
FK rejected: FK violation: customer 999 does not exist  
All assertions passed.  
\===== END EXPECTED OUTPUT \===== \*/

**Common Follow-up Questions**

**Q: What guarantees does a primary key provide?**

A: Uniqueness and non-nullability — every row has a distinct, present identifier — plus an automatic index for fast lookups by that key.

**Q: What does ON DELETE CASCADE do?**

A: When a referenced row is deleted, rows that reference it via the foreign key are automatically deleted too, preventing orphaned records.

**Q: Surrogate vs natural key for the primary key?**

A: Surrogate (SERIAL/UUID) keys are stable and meaningless, avoiding issues when business data changes. Natural keys use real attributes but can change, complicating references.

## **25\. JOINs**

**Simple Explanation**

JOINs combine rows from two or more tables based on a related column — the heart of querying normalized data. An INNER JOIN returns only rows with matches in both tables. A LEFT JOIN returns all rows from the left table plus matches from the right (NULLs where there's no match); RIGHT and FULL joins are the mirror and union of those.

Choosing the right join type answers different questions: INNER for 'records that have related data', LEFT for 'all records, with related data where it exists'. JOINs are often combined with GROUP BY and aggregates (e.g., counting orders per user).

**Hinglish Explanation**

JOINs do ya zyada tables ki rows ko ek related column par combine karte hain — normalized data query karne ka dil. INNER JOIN sirf wahi rows deta hai jinka match dono tables mein ho. LEFT JOIN left table ki saari rows aur right ke matches deta hai (match na ho to NULL); RIGHT aur FULL joins inke mirror aur union hain.

Sahi join type alag sawaalon ka jawab deta hai: INNER 'jinke paas related data hai', LEFT 'sabhi records, related data jahan ho'. JOINs aksar GROUP BY aur aggregates ke saath use hote hain (jaise per user orders count).

**Key Interview Points**

* JOIN combines rows from tables on a related column (usually a key).

* INNER JOIN: only rows with matches in both tables.

* LEFT JOIN: all left rows \+ matches (NULLs where no match).

* RIGHT/FULL: mirror of LEFT / union of both sides.

* Combine with GROUP BY \+ aggregates for counts and summaries.

**Real-World Example**

To show every user with their order count — including users who've never ordered — you LEFT JOIN orders onto users and COUNT(orders.id) grouped by user. An INNER JOIN would silently drop the users with zero orders.

**Code — Full & Runnable (Node / JS)**

*Real SQL JOIN queries (PostgreSQL). The Node-runnable demo below implements INNER and LEFT joins in JS so the output is verifiable here.*

// JOINs — combine rows from related tables.  
const queries \= {  
  // INNER JOIN: only users who have at least one order.  
  inner: \`  
    SELECT u.name, o.id AS order\_id, o.total  
    FROM users u  
    INNER JOIN orders o ON o.user\_id \= u.id;  
  \`,  
   
  // LEFT JOIN: ALL users; order columns are NULL for users with no orders.  
  left: \`  
    SELECT u.name, o.id AS order\_id  
    FROM users u  
    LEFT JOIN orders o ON o.user\_id \= u.id;  
  \`,  
   
  // Aggregating across a join: order count per user.  
  countPerUser: \`  
    SELECT u.name, COUNT(o.id) AS order\_count  
    FROM users u  
    LEFT JOIN orders o ON o.user\_id \= u.id  
    GROUP BY u.id, u.name  
    ORDER BY order\_count DESC;  
  \`,  
};  
// INNER \= intersection; LEFT/RIGHT keep all rows from one side; FULL keeps both.  
module.exports \= queries;

**Test / Demo & Expected Output (Node-runnable)**

// JOINs — implement INNER and LEFT joins on two row sets  
const users  \= \[{ id: 1, name: "Asha" }, { id: 2, name: "Ravi" }, { id: 3, name: "Mira" }\];  
const orders \= \[{ id: 10, userId: 1, total: 100 }, { id: 11, userId: 1, total: 50 }, { id: 12, userId: 2, total: 80 }\];  
   
function innerJoin(left, right, lKey, rKey){  
  const out \= \[\];  
  for (const l of left) for (const r of right) if (l\[lKey\] \=== r\[rKey\]) out.push({ ...l, ...r });  
  return out;  
}  
function leftJoin(left, right, lKey, rKey){  
  return left.flatMap(l \=\> {  
    const matches \= right.filter(r \=\> r\[rKey\] \=== l\[lKey\]);  
    return matches.length ? matches.map(r \=\> ({ ...l, ...r })) : \[{ ...l, order: null }\];  
  });  
}  
const inner \= innerJoin(users, orders, "id", "userId");  
const left \= leftJoin(users, orders, "id", "userId");  
console.log("INNER JOIN rows:", inner.length, "(only users WITH orders)");  
console.log("LEFT JOIN rows: ", left.length, "(all users; Mira has no order)");  
console.log("Mira in LEFT join:", JSON.stringify(left.find(r \=\> r.name \=== "Mira")));  
console.assert(inner.length \=== 3, "3 matching order rows");  
console.assert(left.some(r \=\> r.name \=== "Mira" && r.order \=== null), "LEFT keeps unmatched user");  
console.log("All assertions passed.");  
   
/\* \===== EXPECTED OUTPUT \=====  
INNER JOIN rows: 3 (only users WITH orders)  
LEFT JOIN rows:  4 (all users; Mira has no order)  
Mira in LEFT join: {"id":3,"name":"Mira","order":null}  
All assertions passed.  
\===== END EXPECTED OUTPUT \===== \*/

**Common Follow-up Questions**

**Q: INNER JOIN vs LEFT JOIN — when does it matter?**

A: INNER returns only matched rows; LEFT keeps all left-table rows even without a match (filling NULLs). It matters whenever you need to include records that may have no related data.

**Q: Why might a LEFT JOIN with a WHERE on the right table act like an INNER JOIN?**

A: Because filtering a right-table column in WHERE removes the NULL (unmatched) rows. To keep them, put the condition in the ON clause or check IS NULL appropriately.

**Q: How do you count related rows per record?**

A: LEFT JOIN the related table, GROUP BY the main table's key, and use COUNT on the related id — LEFT JOIN ensures records with zero related rows still appear (count 0).