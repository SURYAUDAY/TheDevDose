  
**React \+ Frontend Architecture**

Interview Study Guide

Phase 2  ·  Topics 51–72 of 72

Full-Stack \+ GenAI Roadmap

Code language: JavaScript (JSX)

**How to run the code samples**

React components (.jsx): run inside a React app (e.g. Vite / Next.js).

Node logic demos: save as filename.js, then run  node filename.js

**Table of Contents**

# **React \+ Frontend Architecture**

This guide covers topics 51–72, the final batch of Phase 2, focused on rendering and build tooling (SSG, React Server Components, Vite, Webpack, bundle optimization and analysis), performance and the browser (Service Workers/PWA, Chrome DevTools, Lighthouse, Web Vitals, caching and cookies), the testing stack (Jest, React Testing Library, Storybook, end-to-end testing), and four capstone mini-projects (a Redux Toolkit CRUD app, a React Query product listing, a drag-and-drop Kanban board, and a dashboard UI).

Each topic follows the same structure: a plain-English explanation, the same idea in spoken Hinglish, key interview points, a real-world example, full React component code, a Node-runnable logic demo with verified expected output, and common follow-up questions.

## **51\. SSG (Static Site Generation)**

**Simple Explanation**

Static Site Generation pre-renders pages into HTML at build time, before any user requests them. The result is a set of static files that can be served from a CDN, giving extremely fast loads, great SEO, and low server cost because no rendering happens per request.

SSG is ideal for content that doesn't change per user or per request — marketing pages, blogs, docs. When content updates periodically, Incremental Static Regeneration (ISR) re-builds pages on a schedule or on demand so they stay reasonably fresh without a full rebuild.

**Hinglish Explanation**

Static Site Generation pages ko build time par hi HTML mein pre-render kar deta hai, user ke request karne se pehle. Result ek set of static files hai jo CDN se serve hoti hain — bahut fast load, achhi SEO, aur low server cost kyunki har request par rendering nahi hoti.

SSG un cheezon ke liye best hai jo per user ya per request nahi badalti — marketing pages, blogs, docs. Jab content kabhi-kabhi update ho to ISR pages ko schedule par ya on-demand dobara build kar deta hai taaki fresh rahein.

**Key Interview Points**

* Pages are pre-rendered to HTML at build time, not per request.

* Served as static files from a CDN — very fast, cheap, and SEO-friendly.

* Best for content that's the same for everyone (blogs, docs, marketing).

* Next.js: generateStaticParams \+ a server component fetches data at build.

* ISR re-generates pages periodically/on-demand to avoid stale content.

**Real-World Example**

A documentation site builds every page once at deploy time. Visitors worldwide get instant, CDN-cached HTML, and Google indexes complete content. When docs change, a new build (or ISR) regenerates only what's needed.

**Code — Full & Runnable**

*Next.js code that runs at BUILD time (and on the server). The Node-runnable demo below illustrates the build-time pre-rendering step.*

// SSG: generate pages at BUILD time with Next.js generateStaticParams.  
// app/blog/\[slug\]/page.jsx  
   
// Runs at build time: tells Next which slugs to pre-render.  
export async function generateStaticParams() {  
  const posts \= await fetch("https://api.site.com/posts").then((r) \=\> r.json());  
  return posts.map((p) \=\> ({ slug: p.slug })); // one static page per slug  
}  
   
export default async function BlogPost({ params }) {  
  const post \= await fetch(\`https://api.site.com/posts/${params.slug}\`).then((r) \=\> r.json());  
  // This HTML is produced once at build and served as a static file (CDN-cacheable).  
  return (  
    \<article\>  
      \<h1\>{post.title}\</h1\>  
      \<p\>{post.body}\</p\>  
    \</article\>  
  );  
}

**Test / Demo & Expected Output (Node-runnable)**

// SSG — pre-render each route to a static HTML file at BUILD time  
function buildStaticSite(routes, getData, template){  
  const pages \= {};  
  for (const route of routes){  
    const data \= getData(route);            // fetched once, at build time  
    pages\[route\] \= template(route, data);   // produced as static HTML  
  }  
  return pages;  
}  
const routes \= \["/", "/about", "/blog/hello"\];  
const getData \= (r) \=\> ({ title: r \=== "/" ? "Home" : r.split("/").pop() });  
const template \= (route, data) \=\> \`\<html\>\<h1\>${data.title}\</h1\>\<\!-- ${route} \--\>\</html\>\`;  
   
const site \= buildStaticSite(routes, getData, template);  
Object.keys(site).forEach(r \=\> console.log(\`${r}  \-\>  ${site\[r\].length} bytes of pre-rendered HTML\`));  
console.log("Sample /about:", site\["/about"\]);  
console.assert(Object.keys(site).length \=== 3, "all routes pre-rendered");  
console.assert(site\["/"\].includes("Home"), "home rendered at build time");  
console.log("All assertions passed.");  
   
/\* \===== EXPECTED OUTPUT \=====  
/  \-\>  36 bytes of pre-rendered HTML  
/about  \-\>  42 bytes of pre-rendered HTML  
/blog/hello  \-\>  47 bytes of pre-rendered HTML  
Sample /about: \<html\>\<h1\>about\</h1\>\<\!-- /about \--\>\</html\>  
All assertions passed.  
\===== END EXPECTED OUTPUT \===== \*/

**Common Follow-up Questions**

**Q: SSG vs SSR — when choose SSG?**

A: Choose SSG when content is the same for all users and doesn't need per-request data; it's faster and cheaper. Use SSR when pages depend on the request (user, time, query).

**Q: What is ISR?**

A: Incremental Static Regeneration: SSG that re-generates individual pages after a set interval or on demand, so you get static speed with periodically fresh content — no full rebuild.

**Q: Can SSG pages still be interactive?**

A: Yes — the static HTML loads first, then JavaScript hydrates it (or client components run) to add interactivity, just like other React rendering modes.

## **52\. React Server Components**

**Simple Explanation**

React Server Components (RSC) render exclusively on the server and send a serialized result to the client — they ship zero JavaScript for themselves. They can fetch data directly (even hit a database) and keep heavy dependencies on the server, shrinking the client bundle.

Client Components (marked with 'use client') handle interactivity — state, effects, event handlers — and do ship JS. The pattern is to keep most of the tree as server components and push interactivity to small client components at the leaves.

**Hinglish Explanation**

React Server Components (RSC) sirf server par render hote hain aur client ko ek serialized result bhejte hain — apne liye zero JavaScript ship karte hain. Ye data directly fetch kar sakte hain (database tak) aur heavy dependencies server par rakhte hain, isse client bundle chhota hota hai.

Client Components ('use client' se marked) interactivity handle karte hain — state, effects, event handlers — aur JS ship karte hain. Pattern ye hai ki zyada tree server components ho aur interactivity chhote client components mein leaves par push ho.

**Key Interview Points**

* Server Components render on the server and ship no JS for themselves.

* They can fetch data directly and keep heavy deps off the client bundle.

* Client Components ('use client') add interactivity and do ship JS.

* Default in Next.js App Router; opt into client components only where needed.

* Server components can't use state/effects or browser APIs — those are client-only.

**Real-World Example**

A product page renders title, description, and reviews as server components (fetched directly, no client JS), while the 'Add to cart' button is a small client component. The page loads fast with minimal JavaScript, and only the interactive bit hydrates.

**Code — Full & Runnable**

*A Next.js Server Component (runs only on the server). The Node-runnable demo below shows the server/client split and its effect on shipped JS.*

// React Server Components: server component fetches data, ships no client JS;  
// only the interactive child is a client component.  
// app/product/\[id\]/page.jsx  (Server Component by default)  
   
import AddToCart from "./AddToCart"; // client component  
   
export default async function ProductPage({ params }) {  
  // Runs on the server only — can fetch directly, sends HTML, no JS for this part.  
  const product \= await fetch(\`https://api.shop.com/products/${params.id}\`).then((r) \=\> r.json());  
   
  return (  
    \<div\>  
      \<h1\>{product.name} — ${product.price}\</h1\>  
      \<p\>{product.description}\</p\>  
      \<AddToCart productId={product.id} /\> {/\* interactivity lives here \*/}  
    \</div\>  
  );  
}  
   
// AddToCart.jsx  
// "use client";  \<-- marks this as a Client Component (ships JS, can use hooks)

**Test / Demo & Expected Output (Node-runnable)**

// React Server Components — server renders to a payload; client ships less JS  
let clientBytes \= 0;  
function ServerComponent(name, fn){ return { kind: "server", name, render: fn }; }  
function ClientComponent(name, jsSize, fn){ clientBytes \+= jsSize; return { kind: "client", name, render: fn }; }  
   
// Server component: runs on server, sends HTML/payload, NO JS to client  
const ProductInfo \= ServerComponent("ProductInfo", (p) \=\> \`\<h1\>${p.name} \- $${p.price}\</h1\>\`);  
// Client component: needs interactivity, ships JS  
const AddToCart \= ClientComponent("AddToCart", 15, () \=\> \`\<button\>Add to cart\</button\>\`);  
   
console.log("Server render:", ProductInfo.render({ name: "Phone", price: 699 }));  
console.log("Client render:", AddToCart.render());  
console.log("JS shipped to client (KB):", clientBytes, "(only the interactive part)");  
console.assert(clientBytes \=== 15, "only client component adds JS");  
console.log("All assertions passed.");  
   
/\* \===== EXPECTED OUTPUT \=====  
Server render: \<h1\>Phone \- $699\</h1\>  
Client render: \<button\>Add to cart\</button\>  
JS shipped to client (KB): 15 (only the interactive part)  
All assertions passed.  
\===== END EXPECTED OUTPUT \===== \*/

**Common Follow-up Questions**

**Q: What's the main benefit of Server Components?**

A: Less JavaScript shipped to the client (smaller bundles, faster loads) plus direct server-side data access, while still composing seamlessly with interactive client components.

**Q: What can't a Server Component do?**

A: Use state, effects, event handlers, or browser-only APIs. Anything interactive must live in a Client Component marked with 'use client'.

**Q: How do server and client components compose?**

A: Server components can render client components (and pass serializable props to them), but client components can't import server components directly — server components are passed in as children.

## **53\. Vite**

**Simple Explanation**

Vite is a modern build tool and dev server. In development it serves your source as native ES modules on demand — no upfront bundling — so the dev server starts almost instantly and updates are near-instant via Hot Module Replacement, even in large projects.

For production it bundles with Rollup, applying optimizations like minification, tree-shaking, and code splitting. Vite has largely become the default choice for new React apps, replacing the slower bundle-everything-first approach of older tooling.

**Hinglish Explanation**

Vite ek modern build tool aur dev server hai. Development mein ye aapka source native ES modules ke roop mein on demand serve karta hai — pehle se bundling nahi — isliye dev server lagbhag instantly start hota hai aur HMR se updates bhi turant aate hain, bade projects mein bhi.

Production ke liye ye Rollup se bundle karta hai — minification, tree-shaking, code splitting. Naye React apps ke liye Vite ab default choice ban gaya hai, purane 'pehle sab bundle karo' approach ki jagah.

**Key Interview Points**

* Dev: serves native ES modules on demand — instant server start, fast HMR.

* Prod: bundles with Rollup (minify, tree-shake, code-split).

* No full bundling step in dev means speed stays constant as the app grows.

* Simple config (vite.config.js) with plugins (e.g., @vitejs/plugin-react).

* Now the de facto default for new React projects (over Create React App/Webpack).

**Real-World Example**

A team migrating a large app from Create React App to Vite sees dev server startup drop from \~30 seconds to under a second, and hot reloads become instant — because Vite stops pre-bundling everything and serves modules as the browser requests them.

**Code — Full & Runnable**

*A Vite build-tool configuration file. The Node-runnable demo below illustrates how Vite serves modules on demand in dev.*

// Vite: minimal config. Dev uses native ESM (instant start); build uses Rollup.  
// vite.config.js  
import { defineConfig } from "vite";  
import react from "@vitejs/plugin-react";  
   
export default defineConfig({  
  plugins: \[react()\],  
  server: { port: 3000, open: true },  
  build: {  
    outDir: "dist",  
    sourcemap: true,  
    rollupOptions: {  
      output: {  
        // Split big vendor libs into their own cacheable chunk.  
        manualChunks: { vendor: \["react", "react-dom"\] },  
      },  
    },  
  },  
});  
   
// package.json scripts: "dev": "vite", "build": "vite build", "preview": "vite preview"

**Test / Demo & Expected Output (Node-runnable)**

// Vite — dev serves native ES modules on demand (no bundling in dev)  
const moduleGraph \= {  
  "main.js": \["App.js", "utils.js"\],  
  "App.js": \["Button.js"\],  
  "Button.js": \[\],  
  "utils.js": \[\],  
};  
let requests \= 0;  
function devServe(entry, served \= new Set()){  
  if (served.has(entry)) return served;  
  requests++; served.add(entry);            // browser requests each module as needed  
  for (const dep of moduleGraph\[entry\]) devServe(dep, served);  
  return served;  
}  
const served \= devServe("main.js");  
console.log("Modules served on demand:", \[...served\].join(", "));  
console.log("Module requests (no bundling step):", requests);  
console.assert(requests \=== 4, "each module served individually in dev");  
console.log("All assertions passed.");  
   
/\* \===== EXPECTED OUTPUT \=====  
Modules served on demand: main.js, App.js, Button.js, utils.js  
Module requests (no bundling step): 4  
All assertions passed.  
\===== END EXPECTED OUTPUT \===== \*/

**Common Follow-up Questions**

**Q: Why is Vite's dev server so fast?**

A: It serves source files as native ES modules on demand instead of bundling the whole app first, so startup is near-instant and HMR updates only the changed module.

**Q: Does Vite bundle for production?**

A: Yes — it uses Rollup to produce an optimized, code-split, minified bundle. The no-bundle approach is a development-only optimization.

**Q: Vite vs Webpack?**

A: Vite is faster in dev (native ESM \+ esbuild pre-bundling) with simpler config; Webpack is more mature with a huge plugin ecosystem. New projects increasingly default to Vite.

## **54\. Webpack basics**

**Simple Explanation**

Webpack is a module bundler: it starts from an entry file, builds a dependency graph by following imports, and outputs one or more bundles the browser can load. Loaders transform non-JS files (JSX via Babel, CSS, images) into modules, and plugins hook into the build for tasks like generating HTML or extracting CSS.

Key concepts are entry, output, loaders, plugins, and optimization (splitChunks for vendor/code splitting). Webpack is highly configurable and powers many production setups, though newer tools like Vite are often faster for development.

**Hinglish Explanation**

Webpack ek module bundler hai: ek entry file se shuru hoke imports follow karke dependency graph banata hai, aur ek ya zyada bundles output karta hai jo browser load kar sake. Loaders non-JS files (JSX via Babel, CSS, images) ko modules mein badalte hain, aur plugins build mein hook karte hain.

Key concepts hain entry, output, loaders, plugins, aur optimization (splitChunks). Webpack bahut configurable hai aur kai production setups chalata hai, halaanki dev ke liye Vite jaise naye tools aksar fast hote hain.

**Key Interview Points**

* Bundles modules: entry \-\> dependency graph \-\> output bundle(s).

* Loaders transform files (babel-loader for JSX, css-loader, etc.).

* Plugins extend the build (HtmlWebpackPlugin, MiniCssExtractPlugin).

* optimization.splitChunks separates vendor code for better caching.

* Powerful and configurable; newer tools (Vite/esbuild) win on dev speed.

**Real-World Example**

A large enterprise app uses Webpack with custom loaders for SVGs and a splitChunks config that isolates React and other vendors into a long-cached chunk — so app code changes don't force users to re-download the framework.

**Code — Full & Runnable**

*A Webpack configuration file. The Node-runnable demo below illustrates how a dependency graph is ordered into a bundle.*

// Webpack basics: entry, output, loaders, and plugins.  
// webpack.config.js  
const path \= require("path");  
const HtmlWebpackPlugin \= require("html-webpack-plugin");  
   
module.exports \= {  
  entry: "./src/index.js",                       // dependency graph starts here  
  output: { path: path.resolve(\_\_dirname, "dist"), filename: "\[name\].\[contenthash\].js" },  
  module: {  
    rules: \[  
      { test: /\\.jsx?$/, exclude: /node\_modules/, use: "babel-loader" }, // transform JS/JSX  
      { test: /\\.css$/, use: \["style-loader", "css-loader"\] },           // import CSS  
    \],  
  },  
  plugins: \[new HtmlWebpackPlugin({ template: "./src/index.html" })\],  
  optimization: { splitChunks: { chunks: "all" } }, // separate vendor chunk  
};

**Test / Demo & Expected Output (Node-runnable)**

// Webpack basics — build a dependency graph and bundle into one output  
const modules \= {  
  "index.js": { deps: \["math.js"\], code: "import {add} from './math'; add(2,3)" },  
  "math.js":  { deps: \[\], code: "export const add \= (a,b) \=\> a+b" },  
};  
function bundle(entry){  
  const order \= \[\], visited \= new Set();  
  (function visit(id){  
    if (visited.has(id)) return; visited.add(id);  
    modules\[id\].deps.forEach(visit);   // dependencies first  
    order.push(id);  
  })(entry);  
  return order;  
}  
const order \= bundle("index.js");  
console.log("Bundle order (deps first):", order.join(" \-\> "));  
console.log("Single output file contains:", order.length, "modules");  
console.assert(order\[0\] \=== "math.js", "dependency bundled before dependent");  
console.log("All assertions passed.");  
   
/\* \===== EXPECTED OUTPUT \=====  
Bundle order (deps first): math.js \-\> index.js  
Single output file contains: 2 modules  
All assertions passed.  
\===== END EXPECTED OUTPUT \===== \*/

**Common Follow-up Questions**

**Q: What's the difference between a loader and a plugin?**

A: Loaders transform individual files into modules (e.g., compile JSX, parse CSS). Plugins act on the whole build process (e.g., generate the HTML file, optimize chunks).

**Q: What does splitChunks do?**

A: It extracts shared/vendor code into separate chunks so they can be cached independently — users re-download only what actually changed.

**Q: Why might you choose Vite over Webpack?**

A: Faster dev startup and HMR with simpler config. Webpack may still win when you need its mature plugin ecosystem or very custom builds.

## **55\. Bundle optimization**

**Simple Explanation**

Bundle optimization reduces the JavaScript users download, improving load time. Core techniques include tree-shaking (dropping unused exports), code splitting (loading code on demand), minification, and choosing lighter dependencies (e.g., date-fns over moment).

Writing tree-shakeable code matters: use named ES module exports, import only what you need, and avoid side-effectful modules. Combine this with lazy loading heavy or rarely-used features so the initial bundle stays small.

**Hinglish Explanation**

Bundle optimization wo JavaScript kam karta hai jo users download karte hain, jisse load time better hota hai. Core techniques: tree-shaking (unused exports hatana), code splitting (on-demand load), minification, aur halki dependencies choose karna (date-fns vs moment).

Tree-shakeable code likhna zaroori hai: named ES module exports use karo, sirf jo chahiye wahi import karo, aur side-effect waale modules avoid karo. Iske saath heavy features lazy-load karo taaki initial bundle chhota rahe.

**Key Interview Points**

* Tree-shaking removes unused exports — enabled by named ESM imports.

* Code splitting \+ lazy loading keep the initial bundle small.

* Minification strips whitespace, comments, and shortens names.

* Pick lighter dependencies; audit before adding heavy libraries.

* Avoid side-effectful modules and default-importing whole libraries.

**Real-World Example**

An app importing all of lodash ships \~70KB even when it uses one function. Switching to per-function imports (or lodash-es with tree-shaking) plus lazy-loading the charting library cuts the initial bundle substantially, speeding up first load on mobile.

**Code — Full & Runnable**

*Tree-shakeable module code (named ESM exports). The Node-runnable demo below shows how unused exports are dropped.*

// Bundle optimization: write tree-shakeable code (named ESM exports).  
// utils.js — each export can be removed if unused.  
export const formatCurrency \= (n) \=\> \`$${n.toFixed(2)}\`;  
export const formatDate \= (d) \=\> new Date(d).toLocaleDateString();  
export const slugify \= (s) \=\> s.toLowerCase().replace(/\\s+/g, "-");  
   
// App.jsx — import ONLY what you use, so the bundler drops the rest.  
import { formatCurrency } from "./utils"; // formatDate & slugify are tree-shaken away  
   
export default function Price({ amount }) {  
  return \<span\>{formatCurrency(amount)}\</span\>;  
}  
// Tip: prefer \`import { x } from 'lib'\` over \`import lib from 'lib'\`  
// and avoid side-effectful modules so tree-shaking can work.

**Test / Demo & Expected Output (Node-runnable)**

// Bundle optimization — tree-shaking removes unused exports  
const library \= {  
  add:    { used: false, size: 5 },  
  sub:    { used: false, size: 5 },  
  format: { used: true,  size: 20 },   // only this is imported  
  parse:  { used: false, size: 18 },  
};  
function treeShake(lib){  
  const kept \= {}; let removed \= 0, before \= 0, after \= 0;  
  for (const name in lib){  
    before \+= lib\[name\].size;  
    if (lib\[name\].used){ kept\[name\] \= lib\[name\]; after \+= lib\[name\].size; }  
    else removed++;  
  }  
  return { kept: Object.keys(kept), before, after, removed };  
}  
const r \= treeShake(library);  
console.log("Kept exports:", r.kept.join(", "));  
console.log(\`Size before: ${r.before}KB \-\> after: ${r.after}KB (removed ${r.removed} unused)\`);  
console.assert(r.after \< r.before, "tree-shaking reduced size");  
console.assert(\!r.kept.includes("parse"), "unused export dropped");  
console.log("All assertions passed.");  
   
/\* \===== EXPECTED OUTPUT \=====  
Kept exports: format  
Size before: 48KB \-\> after: 20KB (removed 3 unused)  
All assertions passed.  
\===== END EXPECTED OUTPUT \===== \*/

**Common Follow-up Questions**

**Q: What makes code tree-shakeable?**

A: Named ES module exports, importing only what you use, and modules free of side effects. CommonJS and side-effectful modules are harder to shake.

**Q: How do you find what to optimize?**

A: Run a bundle analyzer to see which modules dominate size, then tree-shake, replace heavy deps, or lazy-load them.

**Q: Is a smaller bundle always the goal?**

A: Smaller initial load matters most. Splitting code into well-cached chunks can beat one tiny bundle, since unchanged vendor chunks don't need re-downloading.

## **56\. Bundle analysis (bundle analyzer)**

**Simple Explanation**

A bundle analyzer visualizes exactly what's inside your production build — every module and its size — usually as an interactive treemap. This turns bundle optimization from guesswork into data: you can see which dependencies are bloating the bundle and decide what to trim, replace, or lazy-load.

Tools like rollup-plugin-visualizer (Vite) and webpack-bundle-analyzer generate these reports. The typical workflow is: analyze, spot the biggest contributors, apply a fix (tree-shake, swap a library, split a chunk), then re-analyze to confirm the win.

**Hinglish Explanation**

Bundle analyzer aapke production build ke andar exactly kya hai — har module aur uska size — ek interactive treemap mein dikhata hai. Isse optimization guesswork se data-driven ban jaata hai: aap dekh sakte ho kaun si dependency bundle ko bhaari kar rahi hai.

Tools jaise rollup-plugin-visualizer (Vite) aur webpack-bundle-analyzer ye reports banate hain. Workflow: analyze karo, sabse bade contributors dhoondo, fix lagao (tree-shake, library badlo, chunk split karo), phir dobara analyze karke win confirm karo.

**Key Interview Points**

* Visualizes every module and its size, usually as a treemap.

* Makes optimization data-driven — see the real culprits, don't guess.

* Vite: rollup-plugin-visualizer; Webpack: webpack-bundle-analyzer.

* Reveals duplicate deps, oversized libraries, and accidentally bundled code.

* Workflow: analyze \-\> fix (tree-shake/replace/split) \-\> re-analyze.

**Real-World Example**

A team's bundle is mysteriously large. The analyzer treemap shows moment.js and its locales taking a huge slice. They replace it with date-fns and drop unused locales — the next report confirms the bundle shrank by a third.

**Code — Full & Runnable**

*Build-tool plugin configuration for analysis. The Node-runnable demo below illustrates how the size report is produced.*

// Bundle analysis: visualize what's in your bundle to find bloat.  
// vite.config.js  
import { defineConfig } from "vite";  
import { visualizer } from "rollup-plugin-visualizer";  
   
export default defineConfig({  
  plugins: \[  
    visualizer({ filename: "stats.html", open: true, gzipSize: true }),  
  \],  
});  
   
// Webpack equivalent:  
// const { BundleAnalyzerPlugin } \= require("webpack-bundle-analyzer");  
// plugins: \[new BundleAnalyzerPlugin()\]  
//  
// The generated report shows each module's size so you can spot heavy  
// dependencies (e.g., swap moment.js for date-fns, lazy-load big libs).

**Test / Demo & Expected Output (Node-runnable)**

// Bundle analysis — report the biggest modules in a bundle  
const bundleStats \= \[  
  { name: "lodash", size: 72 },  
  { name: "moment", size: 65 },  
  { name: "app-code", size: 40 },  
  { name: "react-dom", size: 38 },  
\];  
function analyze(stats){  
  const total \= stats.reduce((s, m) \=\> s \+ m.size, 0);  
  const ranked \= \[...stats\].sort((a, b) \=\> b.size \- a.size);  
  return ranked.map(m \=\> ({ ...m, pct: Math.round((m.size / total) \* 100\) }));  
}  
const report \= analyze(bundleStats);  
report.forEach(m \=\> console.log(\`${m.name.padEnd(12)} ${m.size}KB  (${m.pct}%)\`));  
console.log("Biggest offender:", report\[0\].name);  
console.assert(report\[0\].name \=== "lodash", "largest module identified");  
console.log("All assertions passed.");  
   
/\* \===== EXPECTED OUTPUT \=====  
lodash       72KB  (33%)  
moment       65KB  (30%)  
app-code     40KB  (19%)  
react-dom    38KB  (18%)  
Biggest offender: lodash  
All assertions passed.  
\===== END EXPECTED OUTPUT \===== \*/

**Common Follow-up Questions**

**Q: What does a bundle analyzer help you find?**

A: The largest modules, duplicate dependencies, oversized libraries, and code that shouldn't be in the bundle — so you know exactly where to optimize.

**Q: How do you use it in practice?**

A: Generate the report, identify the biggest contributors, apply a targeted fix (tree-shake, swap a lighter library, lazy-load), then re-run to verify the reduction.

**Q: Which tools generate these reports?**

A: rollup-plugin-visualizer for Vite/Rollup and webpack-bundle-analyzer for Webpack are the common ones.

## **57\. Service Workers & PWA basics**

**Simple Explanation**

A Service Worker is a script the browser runs in the background, separate from the page. It can intercept network requests, cache responses, and serve them — enabling offline support, faster repeat loads, and background sync. It's the backbone of Progressive Web Apps (PWAs).

A PWA combines a service worker (for caching/offline) with a web app manifest (icons, name, theme) so the app can be installed to the home screen and behave like a native app. Common caching strategies include cache-first, network-first, and stale-while-revalidate.

**Hinglish Explanation**

Service Worker ek script hai jo browser background mein chalata hai, page se alag. Ye network requests intercept kar sakta hai, responses cache karke serve kar sakta hai — isse offline support, fast repeat loads aur background sync milte hain. Ye PWAs ki reedh ki haddi hai.

PWA ek service worker (caching/offline) aur web app manifest (icons, name, theme) ko combine karta hai taaki app home screen par install ho aur native jaisa lage. Common caching strategies: cache-first, network-first, stale-while-revalidate.

**Key Interview Points**

* A background script that intercepts requests and manages a cache.

* Enables offline support, faster repeat visits, and background sync.

* Core of PWAs, paired with a web app manifest for installability.

* Strategies: cache-first, network-first, stale-while-revalidate.

* Requires HTTPS and a registration step; versioned caches for updates.

**Real-World Example**

A news PWA precaches the app shell and recent articles. On the subway with no signal, the user still opens the app and reads cached stories; when connectivity returns, the service worker fetches fresh content in the background.

**Code — Full & Runnable**

*Service worker \+ registration code (runs in the browser). The Node-runnable demo below simulates the cache-first fetch handler.*

// Service Worker / PWA: register a SW and cache assets for offline use.  
// main.jsx — register the service worker  
if ("serviceWorker" in navigator) {  
  window.addEventListener("load", () \=\> {  
    navigator.serviceWorker.register("/sw.js");  
  });  
}  
   
// sw.js — cache-first strategy  
const CACHE \= "app-v1";  
const ASSETS \= \["/", "/index.html", "/app.js", "/styles.css"\];  
   
self.addEventListener("install", (e) \=\> {  
  e.waitUntil(caches.open(CACHE).then((c) \=\> c.addAll(ASSETS)));  
});  
   
self.addEventListener("fetch", (e) \=\> {  
  e.respondWith(  
    caches.match(e.request).then((cached) \=\> cached || fetch(e.request)) // cache first  
  );  
});

**Test / Demo & Expected Output (Node-runnable)**

// Service Worker / PWA — cache-first fetch handler enables offline  
const cacheStore \= new Map();  
function precache(assets){ assets.forEach(a \=\> cacheStore.set(a.url, a.body)); }  
async function handleFetch(url, network){  
  if (cacheStore.has(url)){ return { from: "cache", body: cacheStore.get(url) }; }   // cache-first  
  try { const body \= await network(url); cacheStore.set(url, body); return { from: "network", body }; }  
  catch { return { from: "offline-fallback", body: "Offline page" }; }  
}  
(async () \=\> {  
  precache(\[{ url: "/app.js", body: "console.log('app')" }\]);  
  console.log(await handleFetch("/app.js", null));                          // cache hit  
  console.log(await handleFetch("/api/data", async () \=\> "fresh data"));    // network \+ cache  
  console.log(await handleFetch("/missing", async () \=\> { throw new Error("no net"); })); // offline  
  const cached \= await handleFetch("/api/data", () \=\> { throw new Error("should not call"); });  
  console.log("Second /api/data:", cached.from);  
  console.assert(cached.from \=== "cache", "served from cache offline");  
  console.log("All assertions passed.");  
})();  
   
/\* \===== EXPECTED OUTPUT \=====  
{ from: 'cache', body: "console.log('app')" }  
{ from: 'network', body: 'fresh data' }  
{ from: 'offline-fallback', body: 'Offline page' }  
Second /api/data: cache  
All assertions passed.  
\===== END EXPECTED OUTPUT \===== \*/

**Common Follow-up Questions**

**Q: What can a service worker do that regular JS can't?**

A: Run in the background independent of the page, intercept network requests, and serve cached responses — enabling offline use, push notifications, and background sync.

**Q: What's the difference between cache-first and network-first?**

A: Cache-first serves cached data immediately (great for static assets); network-first tries the network and falls back to cache (better for frequently changing data).

**Q: What makes a web app a PWA?**

A: A service worker for caching/offline plus a web app manifest (name, icons, theme) served over HTTPS, which together allow installation and app-like behavior.

## **58\. Chrome DevTools — Elements & Console**

**Simple Explanation**

The Elements panel shows the live DOM and CSS. You can inspect and edit nodes, toggle classes and styles, read the computed box model, and see which CSS rules apply — invaluable for debugging layout and styling without changing source code.

The Console is for logging and running JavaScript against the page. Beyond console.log, useful tools include console.table, console.group, log levels (warn/error), and the special $0 reference to the currently selected element. Together these are the everyday debugging duo.

**Hinglish Explanation**

Elements panel live DOM aur CSS dikhata hai. Aap nodes inspect aur edit kar sakte ho, classes/styles toggle kar sakte ho, computed box model dekh sakte ho, aur kaun se CSS rules apply ho rahe hain — layout aur styling debug karne ke liye bahut useful, bina source badle.

Console logging aur page par JavaScript chalane ke liye hai. console.log ke alawa console.table, console.group, log levels (warn/error), aur $0 (currently selected element) useful hain. Ye dono rozana ki debugging jodi hain.

**Key Interview Points**

* Elements: inspect/edit live DOM and CSS, toggle classes, read computed styles.

* See applied vs overridden CSS rules and the box model visually.

* Console: log values and run JS against the live page.

* Beyond log: console.table, console.group, warn/error levels, console.dir.

* $0 references the selected element; $$('sel') is shorthand for querySelectorAll.

**Real-World Example**

A button looks misaligned only on one page. In the Elements panel a developer toggles styles live, spots an unexpected margin from an inherited rule, and confirms the fix instantly — then makes the change in source, all without a single rebuild.

**Code — Full & Runnable**

*DevTools debugging techniques (used in the browser, not shipped app code). The Node-runnable demo below simulates element inspection and console filtering.*

// Chrome DevTools — Elements & Console (used in development, not app code).  
// Open with F12 (or Cmd+Option+I). These are debugging techniques:  
   
export default function DebugExample() {  
  const user \= { id: 1, name: "Asha" };  
   
  // Console techniques you'd use while inspecting in DevTools:  
  console.log("user:", user);            // basic log  
  console.table(\[user\]);                 // tabular view of arrays/objects  
  console.group("render");               // collapsible group  
  console.log("props ready");  
  console.groupEnd();  
  // console.dir(domNode)  \-\> inspect a DOM node's properties  
  // In the Elements panel you can edit the DOM live, toggle classes,  
  // and read computed styles; $0 in Console references the selected node.  
   
  return \<div className="card"\>Inspect me in the Elements panel\</div\>;  
}

**Test / Demo & Expected Output (Node-runnable)**

// Chrome DevTools (Elements & Console) — inspect DOM \+ filter console by level  
const dom \= {  
  tag: "div", id: "app", children: \[  
    { tag: "h1", id: "title", text: "Hello" },  
    { tag: "button", id: "cta", text: "Click" },  
  \],  
};  
function querySelector(node, id){  
  if (node.id \=== id) return node;  
  for (const c of node.children || \[\]) { const f \= querySelector(c, id); if (f) return f; }  
  return null;  
}  
console.log("Inspect \#cta \-\>", JSON.stringify(querySelector(dom, "cta")));  
   
const consoleLog \= \[  
  { level: "log",   msg: "render ok" },  
  { level: "warn",  msg: "deprecated API" },  
  { level: "error", msg: "fetch failed" },  
\];  
const errorsOnly \= consoleLog.filter(e \=\> e.level \=== "error");  
console.log("Filter level=error \-\>", JSON.stringify(errorsOnly));  
console.assert(querySelector(dom, "cta").text \=== "Click", "element found by id");  
console.assert(errorsOnly.length \=== 1, "console filter works");  
console.log("All assertions passed.");  
   
/\* \===== EXPECTED OUTPUT \=====  
Inspect \#cta \-\> {"tag":"button","id":"cta","text":"Click"}  
Filter level=error \-\> \[{"level":"error","msg":"fetch failed"}\]  
All assertions passed.  
\===== END EXPECTED OUTPUT \===== \*/

**Common Follow-up Questions**

**Q: How do you debug why a CSS rule isn't applying?**

A: Select the element in the Elements panel and read the Styles pane — it shows applied rules, strikes through overridden ones, and reveals specificity conflicts and inherited values.

**Q: What's a quick way to inspect an object in the Console?**

A: console.table for arrays/objects of similar shape, console.dir to expand a DOM node's properties, and grouping with console.group for readable logs.

**Q: What does $0 do in the Console?**

A: It references the element currently selected in the Elements panel, so you can run JS against it (e.g., $0.classList.toggle('active')).

## **59\. Chrome DevTools — Network tab**

**Simple Explanation**

The Network tab records every request the page makes — documents, scripts, styles, images, and API calls — with status code, size, timing, and headers. It's the first place to look when something fails to load, an API returns an error, or the page feels slow on the wire.

Each request's timing breakdown (queuing, waiting/TTFB, content download) helps you tell a slow server from a slow download. Handy controls include filtering by type (Fetch/XHR), 'Disable cache', and network throttling to simulate slow connections.

**Hinglish Explanation**

Network tab page ki har request record karta hai — documents, scripts, styles, images, API calls — status code, size, timing aur headers ke saath. Jab kuch load na ho, API error de, ya page slow lage, sabse pehle yahin dekho.

Har request ka timing breakdown (queuing, waiting/TTFB, content download) batata hai slow server hai ya slow download. Useful controls: type filter (Fetch/XHR), 'Disable cache', aur throttling se slow connection simulate karna.

**Key Interview Points**

* Logs all requests with method, status, size, timing, and headers.

* First stop for failed loads, API errors, and on-the-wire slowness.

* Timing breakdown separates slow server (TTFB) from slow download.

* Filter by Fetch/XHR to focus on API calls; inspect payloads and responses.

* Use 'Disable cache' and throttling (Slow 3G) to test cold/slow loads.

**Real-World Example**

An API call intermittently fails in production. Using the Network tab, a developer sees it returns 401 only after a token expires, with the request headers confirming a stale token — pinpointing the refresh-logic bug without touching the code first.

**Code — Full & Runnable**

*DevTools debugging techniques (used in the browser, not shipped app code). The Node-runnable demo below simulates capturing requests, sizes, timing, and status.*

// Chrome DevTools — Network tab (debugging technique, not app code).  
// Use it to inspect requests, timing, sizes, status codes, and headers.  
   
export default function DataLoader() {  
  async function load() {  
    // In the Network tab you'd watch this request: method, status, size,  
    // timing (waiting/TTFB, content download), and response payload.  
    const res \= await fetch("/api/users", {  
      headers: { Authorization: "Bearer token" }, // visible under Request Headers  
    });  
    const data \= await res.json();  
    return data;  
  }  
   
  // Network tab tips:  
  // \- Filter by XHR/Fetch to see API calls  
  // \- "Disable cache" while DevTools is open to test cold loads  
  // \- Throttle to "Slow 3G" to simulate poor connections  
  // \- Check the Timing tab of a request to find slow TTFB vs download  
  return \<button onClick={load}\>Load users\</button\>;  
}

**Test / Demo & Expected Output (Node-runnable)**

// Chrome DevTools (Network tab) — capture requests, sizes, timing, status  
const requests \= \[  
  { url: "/index.html", status: 200, size: 4,   ms: 30 },  
  { url: "/app.js",     status: 200, size: 240, ms: 180 },  
  { url: "/api/user",   status: 500, size: 1,   ms: 90 },  
  { url: "/logo.png",   status: 200, size: 18,  ms: 40 },  
\];  
const totalSize \= requests.reduce((s, r) \=\> s \+ r.size, 0);  
const totalTime \= Math.max(...requests.map(r \=\> r.ms)); // parallel \-\> slowest defines wall time  
const failed \= requests.filter(r \=\> r.status \>= 400);  
const slowest \= \[...requests\].sort((a, b) \=\> b.ms \- a.ms)\[0\];  
console.log("Requests:", requests.length, "| Transferred:", totalSize \+ "KB");  
console.log("Slowest:", slowest.url, slowest.ms \+ "ms");  
console.log("Failed:", failed.map(r \=\> \`${r.url}(${r.status})\`).join(", "));  
console.assert(failed.length \=== 1 && failed\[0\].status \=== 500, "failed request detected");  
console.log("All assertions passed.");  
   
/\* \===== EXPECTED OUTPUT \=====  
Requests: 4 | Transferred: 263KB  
Slowest: /app.js 180ms  
Failed: /api/user(500)  
All assertions passed.  
\===== END EXPECTED OUTPUT \===== \*/

**Common Follow-up Questions**

**Q: How do you tell if a slow request is the server's fault?**

A: Open the request's Timing tab: a long 'Waiting (TTFB)' points to slow server processing, while a long 'Content Download' points to a large response or slow connection.

**Q: How do you test how the app behaves on a slow network?**

A: Use the throttling dropdown (e.g., Slow 3G) and 'Disable cache' to simulate cold, slow loads and catch issues real users on poor connections would hit.

**Q: How do you focus on just API calls?**

A: Filter the Network tab by Fetch/XHR to hide assets and see only data requests, then inspect each one's payload, response, and status.

## **60\. Chrome DevTools — Performance tab**

**Simple Explanation**

The Performance tab records a timeline of everything the browser does — scripting, rendering, layout, and painting — so you can find what makes the page slow or janky. You record a session while interacting, then read the flame chart to see exactly which functions ran and how long they took.

Key things to hunt for are long tasks (blocks over 50ms that freeze the main thread), layout thrashing (repeated forced reflows), and heavy scripting. Fixing these — by breaking up work, memoizing, or avoiding sync layout reads — improves responsiveness and Web Vitals like INP.

**Hinglish Explanation**

Performance tab browser jo kuch karta hai — scripting, rendering, layout, painting — uska timeline record karta hai taaki page slow ya janky kyun hai pata chale. Aap interact karte hue session record karte ho, phir flame chart se dekhte ho kaun se functions chale aur kitna time liya.

Dhoondhne layak: long tasks (50ms se zyada blocks jo main thread freeze karte hain), layout thrashing (baar-baar forced reflow), aur heavy scripting. Inhe fix karna — kaam todna, memoize karna, sync layout reads avoid karna — responsiveness aur INP behtar karta hai.

**Key Interview Points**

* Records a timeline of scripting, rendering, layout, and painting.

* Flame chart shows which functions ran and how long they took.

* Hunt for long tasks (\>50ms) that block the main thread and hurt INP.

* Spot layout thrashing (forced synchronous reflows) and heavy scripting.

* Profile a production build; dev-mode overhead skews the numbers.

**Real-World Example**

Scrolling a long list feels janky. A Performance recording shows a long task: each item forces a synchronous layout read inside a loop. Batching reads/writes (or virtualizing the list) removes the long task and scrolling becomes smooth.

**Code — Full & Runnable**

*DevTools profiling techniques (used in the browser, not shipped app code). The Node-runnable demo below simulates finding long tasks in a trace.*

// Chrome DevTools — Performance tab (profiling technique, not app code).  
// Record a session to find long tasks, layout thrashing, and slow renders.  
   
export default function HeavyComponent({ items }) {  
  // A common performance pitfall this panel reveals: forcing layout in a loop.  
  function badMeasure() {  
    items.forEach((el) \=\> {  
      // Reading offsetHeight after a style write forces synchronous layout  
      // ("layout thrashing") — the Performance tab shows purple layout spikes.  
      el.style.height \= "auto";  
      const h \= el.offsetHeight; // forced reflow each iteration  
      console.log(h);  
    });  
  }  
   
  // How to use the panel:  
  // 1\) Open Performance, click Record, interact, then Stop.  
  // 2\) Look for long yellow "Scripting" blocks and red "long task" markers.  
  // 3\) Use the flame chart to find the slow function call stack.  
  return \<button onClick={badMeasure}\>Measure\</button\>;  
}

**Test / Demo & Expected Output (Node-runnable)**

// Chrome DevTools (Performance tab) — find long tasks in a trace  
const tasks \= \[  
  { name: "parse HTML", ms: 12 },  
  { name: "evaluate script", ms: 220 },   // long task (\> 50ms blocks main thread)  
  { name: "layout", ms: 18 },  
  { name: "render list", ms: 95 },         // long task  
  { name: "paint", ms: 8 },  
\];  
const LONG\_TASK \= 50;  
const longTasks \= tasks.filter(t \=\> t.ms \> LONG\_TASK);  
const totalBlocking \= longTasks.reduce((s, t) \=\> s \+ (t.ms \- LONG\_TASK), 0); // TBT-style  
console.log("Total main-thread time:", tasks.reduce((s, t) \=\> s \+ t.ms, 0\) \+ "ms");  
longTasks.forEach(t \=\> console.log(\`LONG TASK: ${t.name} (${t.ms}ms)\`));  
console.log("Total Blocking Time:", totalBlocking \+ "ms");  
console.assert(longTasks.length \=== 2, "two long tasks flagged");  
console.log("All assertions passed.");  
   
/\* \===== EXPECTED OUTPUT \=====  
Total main-thread time: 353ms  
LONG TASK: evaluate script (220ms)  
LONG TASK: render list (95ms)  
Total Blocking Time: 215ms  
All assertions passed.  
\===== END EXPECTED OUTPUT \===== \*/

**Common Follow-up Questions**

**Q: What is a 'long task' and why does it matter?**

A: A main-thread task over \~50ms. It blocks input and rendering, causing jank and poor INP. Breaking work into smaller chunks keeps the page responsive.

**Q: What is layout thrashing?**

A: Repeatedly writing styles then reading layout (e.g., offsetHeight) in a loop, forcing synchronous reflows each time. Batch reads then writes to avoid it.

**Q: Why profile a production build?**

A: Development React includes extra checks and warnings that inflate timings; a production build reflects what users actually experience.

## **61\. Lighthouse audits**

**Simple Explanation**

Lighthouse is an automated auditing tool (built into Chrome DevTools and available via CLI/CI) that scores a page across categories: Performance, Accessibility, Best Practices, SEO, and PWA. Each category is a weighted average of individual audits, scored 0–100 with green/orange/red ratings.

Beyond the score, Lighthouse gives actionable suggestions — unused JavaScript, missing image dimensions, contrast issues, and so on. Running it in CI with score budgets prevents regressions by failing builds that drop below a threshold.

**Hinglish Explanation**

Lighthouse ek automated auditing tool hai (Chrome DevTools mein built-in, aur CLI/CI se bhi) jo page ko categories par score karta hai: Performance, Accessibility, Best Practices, SEO, PWA. Har category individual audits ka weighted average hai, 0–100 score aur green/orange/red rating ke saath.

Score ke alawa Lighthouse actionable suggestions deta hai — unused JavaScript, missing image dimensions, contrast issues. CI mein score budgets ke saath chalana regressions rokta hai — threshold se neeche jaane par build fail ho jaati hai.

**Key Interview Points**

* Audits a page across Performance, Accessibility, Best Practices, SEO, PWA.

* Each category score is a weighted average of individual audits (0–100).

* Ratings: green (good), orange (needs improvement), red (poor).

* Gives concrete fix suggestions, not just numbers.

* Run in CI with budgets to fail builds that regress below a threshold.

**Real-World Example**

Before launch, a team runs Lighthouse and scores 70 on performance. The report flags render-blocking scripts and unsized images. After deferring scripts and adding image dimensions, the score jumps to 92 — and a CI budget keeps it there on future PRs.

**Code — Full & Runnable**

*Lighthouse tooling / CI configuration. The Node-runnable demo below illustrates how a weighted category score is computed.*

// Lighthouse audits — run via CLI/CI to score performance, a11y, SEO, etc.  
// (Tooling, not app code.)  
   
// package.json  
// "scripts": { "audit": "lighthouse https://myapp.com \--output=json \--output-path=./report.json" }  
   
// CI example: lighthouse-ci to enforce score budgets on every PR.  
// lighthouserc.js  
module.exports \= {  
  ci: {  
    collect: { url: \["http://localhost:3000/"\], numberOfRuns: 3 },  
    assert: {  
      assertions: {  
        "categories:performance": \["error", { minScore: 0.9 }\],  
        "categories:accessibility": \["error", { minScore: 0.9 }\],  
        "categories:seo": \["warn", { minScore: 0.9 }\],  
      },  
    },  
  },  
};  
// A build fails if performance drops below 0.9 — preventing regressions.

**Test / Demo & Expected Output (Node-runnable)**

// Lighthouse audits — weighted category score from individual audits  
function lighthouseScore(audits){  
  // each audit: { score: 0..1, weight }  
  const total \= audits.reduce((s, a) \=\> s \+ a.weight, 0);  
  const earned \= audits.reduce((s, a) \=\> s \+ a.score \* a.weight, 0);  
  return Math.round((earned / total) \* 100);  
}  
const performanceAudits \= \[  
  { name: "LCP", score: 0.9, weight: 25 },  
  { name: "TBT", score: 0.7, weight: 30 },  
  { name: "CLS", score: 1.0, weight: 15 },  
  { name: "FCP", score: 0.8, weight: 10 },  
  { name: "SI",  score: 0.6, weight: 10 },  
\];  
const score \= lighthouseScore(performanceAudits);  
const rating \= score \>= 90 ? "Good (green)" : score \>= 50 ? "Needs improvement (orange)" : "Poor (red)";  
console.log("Performance score:", score, "/ 100 \-\>", rating);  
console.assert(score \>= 0 && score \<= 100, "score in range");  
console.log("All assertions passed.");  
   
/\* \===== EXPECTED OUTPUT \=====  
Performance score: 81 / 100 \-\> Needs improvement (orange)  
All assertions passed.  
\===== END EXPECTED OUTPUT \===== \*/

**Common Follow-up Questions**

**Q: How is a Lighthouse category score calculated?**

A: As a weighted average of its individual audits. Heavier-weighted metrics (like certain performance metrics) influence the final 0–100 score more than lighter ones.

**Q: How do you prevent performance regressions over time?**

A: Run Lighthouse (or Lighthouse CI) in your pipeline with score/metric budgets so a PR that drops below the threshold fails the build.

**Q: Is the lab score the same as real-user performance?**

A: Not exactly. Lighthouse is a lab (simulated) measurement; real-user (field) data from Web Vitals can differ due to varied devices and networks.

## **62\. Web Vitals (LCP, INP, CLS)**

**Simple Explanation**

Core Web Vitals are Google's user-centric metrics for real-world experience. LCP (Largest Contentful Paint) measures loading — when the main content appears (good ≤ 2.5s). INP (Interaction to Next Paint) measures responsiveness to user input (good ≤ 200ms). CLS (Cumulative Layout Shift) measures visual stability — unexpected layout jumps (good ≤ 0.1).

Each metric has good / needs-improvement / poor thresholds. You measure them in the field with the web-vitals library and send results to analytics, since real-user data reflects actual devices and networks better than lab scores alone.

**Hinglish Explanation**

Core Web Vitals Google ke user-centric metrics hain. LCP (Largest Contentful Paint) loading measure karta hai — main content kab dikhta hai (good ≤ 2.5s). INP (Interaction to Next Paint) input ki responsiveness (good ≤ 200ms). CLS (Cumulative Layout Shift) visual stability — unexpected layout jumps (good ≤ 0.1).

Har metric ke good / needs-improvement / poor thresholds hain. Inhe field mein web-vitals library se measure karke analytics bhejte hain, kyunki real-user data lab scores se behtar actual devices/networks dikhata hai.

**Key Interview Points**

* LCP — loading: when main content renders (good ≤ 2.5s).

* INP — responsiveness: delay from interaction to next paint (good ≤ 200ms).

* CLS — visual stability: unexpected layout shift score (good ≤ 0.1).

* Each has good / needs-improvement / poor thresholds.

* Measure in the field with the web-vitals library; INP replaced FID in 2024\.

**Real-World Example**

A store finds its CLS is poor because images and ads load without reserved space, shoving content down as users tap. Adding width/height (and reserving ad slots) stabilizes the layout, fixes accidental mis-taps, and improves the CLS score.

**Code — Full & Runnable**

*Real browser instrumentation code using the web-vitals library. The Node-runnable demo below shows how each metric is rated against thresholds.*

// Web Vitals — measure LCP, INP, CLS from real users with the web-vitals lib.  
import { onLCP, onINP, onCLS } from "web-vitals";  
   
function sendToAnalytics(metric) {  
  // metric: { name, value, rating: 'good' | 'needs-improvement' | 'poor' }  
  navigator.sendBeacon("/analytics", JSON.stringify(metric));  
}  
   
export function reportWebVitals() {  
  onLCP(sendToAnalytics); // Largest Contentful Paint  (loading)   good \<= 2.5s  
  onINP(sendToAnalytics); // Interaction to Next Paint (interactivity) good \<= 200ms  
  onCLS(sendToAnalytics); // Cumulative Layout Shift   (visual stability) good \<= 0.1  
}  
   
// Call once at app startup (e.g., in main.jsx) to collect field data.

**Test / Demo & Expected Output (Node-runnable)**

// Web Vitals — rate LCP, INP, CLS against Google's thresholds  
function rate(metric, value){  
  const t \= { LCP: \[2500, 4000\], INP: \[200, 500\], CLS: \[0.1, 0.25\] }\[metric\];  
  if (value \<= t\[0\]) return "good";  
  if (value \<= t\[1\]) return "needs-improvement";  
  return "poor";  
}  
const sample \= { LCP: 2200, INP: 350, CLS: 0.3 };  // ms, ms, unitless  
for (const m in sample) console.log(\`${m}: ${sample\[m\]} \-\> ${rate(m, sample\[m\])}\`);  
console.assert(rate("LCP", 2200\) \=== "good", "LCP under 2.5s is good");  
console.assert(rate("CLS", 0.3) \=== "poor", "CLS over 0.25 is poor");  
console.log("All assertions passed.");  
   
/\* \===== EXPECTED OUTPUT \=====  
LCP: 2200 \-\> good  
INP: 350 \-\> needs-improvement  
CLS: 0.3 \-\> poor  
All assertions passed.  
\===== END EXPECTED OUTPUT \===== \*/

**Common Follow-up Questions**

**Q: What do LCP, INP, and CLS each measure?**

A: LCP \= loading (main content paint), INP \= responsiveness (interaction to next paint), CLS \= visual stability (unexpected layout shifts). Together they capture core UX quality.

**Q: How do you improve CLS?**

A: Reserve space for images, ads, and embeds (set width/height or aspect-ratio), avoid inserting content above existing content, and use font-display strategies to prevent layout jumps.

**Q: Lab vs field data — what's the difference?**

A: Lab data (e.g., Lighthouse) is simulated in a controlled environment; field data (web-vitals/CrUX) comes from real users and reflects actual device and network variety.

## **63\. Browser caching & Cache-Control**

**Simple Explanation**

Browser caching stores responses locally so repeat visits avoid re-downloading unchanged resources. The server controls this with the Cache-Control header: max-age sets how long a response is fresh, no-cache means cache but revalidate before using, and no-store means never cache.

A common strategy is to cache hashed, immutable build assets aggressively (max-age=1 year, immutable) while keeping HTML revalidated (no-cache) so users always get the latest app version. Validation with ETags/Last-Modified lets the browser confirm freshness cheaply with a 304 response.

**Hinglish Explanation**

Browser caching responses ko locally store karta hai taaki repeat visits par unchanged resources dobara download na ho. Server ise Cache-Control header se control karta hai: max-age batata hai response kitni der fresh hai, no-cache matlab cache karo par use se pehle revalidate karo, no-store matlab kabhi cache mat karo.

Common strategy: hashed immutable build assets ko aggressively cache karo (max-age=1 saal, immutable) jabki HTML ko revalidate rakho (no-cache) taaki users latest version paayein. ETags/Last-Modified se browser sasta freshness check (304) kar leta hai.

**Key Interview Points**

* Cache-Control header (server-set) governs how the browser caches a response.

* max-age \= fresh duration; no-cache \= cache but revalidate; no-store \= never cache.

* Hashed immutable assets: cache hard (max-age=31536000, immutable).

* HTML: use no-cache so users get the newest build after deploys.

* ETag/Last-Modified enable cheap revalidation via 304 Not Modified.

**Real-World Example**

After each deploy, filenames include a content hash (app.4f3a.js). The server caches these for a year as immutable, so returning users skip re-downloading the framework, while the no-cache HTML always points to the newest hashed files.

**Code — Full & Runnable**

*Server-side code (Node/Express) that sets caching headers. The Node-runnable demo below simulates how the browser interprets Cache-Control.*

// Browser caching & Cache-Control — set on the server response, read by browser.  
// Express example (Node) controlling how the browser caches each asset type.  
import express from "express";  
const app \= express();  
   
// Hashed, immutable build assets: cache hard for a year.  
app.use("/assets", express.static("dist/assets", {  
  setHeaders: (res) \=\> res.setHeader("Cache-Control", "public, max-age=31536000, immutable"),  
}));  
   
// HTML should always be revalidated so users get the latest build.  
app.get("/", (req, res) \=\> {  
  res.setHeader("Cache-Control", "no-cache"); // store but revalidate before use  
  res.send("\<html\>…\</html\>");  
});  
   
// API data we never want cached:  
app.get("/api/me", (req, res) \=\> {  
  res.setHeader("Cache-Control", "no-store");  
  res.json({ user: "Asha" });  
});

**Test / Demo & Expected Output (Node-runnable)**

// Browser caching & Cache-Control — decide cache behavior from headers  
function cacheDecision(header){  
  if (/no-store/.test(header)) return "never cache (always fetch)";  
  if (/no-cache/.test(header)) return "cache but revalidate before use";  
  const m \= header.match(/max-age=(\\d+)/);  
  if (m) return \`cache fresh for ${m\[1\]}s\`;  
  return "no caching directive";  
}  
console.log("max-age=3600     \-\>", cacheDecision("max-age=3600"));  
console.log("no-cache         \-\>", cacheDecision("no-cache"));  
console.log("no-store         \-\>", cacheDecision("no-store"));  
console.log("public, max-age=60 \-\>", cacheDecision("public, max-age=60"));  
console.assert(cacheDecision("max-age=3600").includes("3600"), "max-age parsed");  
console.assert(cacheDecision("no-store").startsWith("never"), "no-store respected");  
console.log("All assertions passed.");  
   
/\* \===== EXPECTED OUTPUT \=====  
max-age=3600     \-\> cache fresh for 3600s  
no-cache         \-\> cache but revalidate before use  
no-store         \-\> never cache (always fetch)  
public, max-age=60 \-\> cache fresh for 60s  
All assertions passed.  
\===== END EXPECTED OUTPUT \===== \*/

**Common Follow-up Questions**

**Q: Difference between no-cache and no-store?**

A: no-cache lets the browser store the response but it must revalidate with the server before reusing it. no-store forbids storing at all — every use is a fresh fetch.

**Q: Why is 'immutable' safe for build assets?**

A: Because the filename includes a content hash; if the content changes, the filename changes too. So the old URL never needs to change — it can be cached forever.

**Q: What's the role of ETags?**

A: They let the browser ask 'has this changed?' cheaply; if not, the server returns 304 Not Modified with no body, saving bandwidth while confirming freshness.

## **64\. Cookie storage & caching strategy**

**Simple Explanation**

Cookies are small key-value pairs the browser stores and automatically sends with every request to the matching domain — which makes them the natural home for session/auth tokens. Important attributes include Max-Age/Expires, Secure (HTTPS only), HttpOnly (not readable by JS, protecting against XSS theft), and SameSite (CSRF protection).

For client-only data, localStorage (persists across sessions) and sessionStorage (cleared when the tab closes) are simpler and larger, but never sent to the server. A good strategy: HttpOnly cookies for auth, localStorage for UI preferences, sessionStorage for temporary per-tab state.

**Hinglish Explanation**

Cookies chhote key-value pairs hain jo browser store karke har matching-domain request ke saath automatically bhejta hai — isliye session/auth tokens ka natural ghar. Important attributes: Max-Age/Expires, Secure (sirf HTTPS), HttpOnly (JS se nahi padhi ja sakti, XSS se bachav), aur SameSite (CSRF protection).

Client-only data ke liye localStorage (sessions ke beech persist) aur sessionStorage (tab band hote hi clear) simpler aur bade hain, par server ko kabhi nahi jaate. Achhi strategy: auth ke liye HttpOnly cookies, UI prefs ke liye localStorage, temporary per-tab state ke liye sessionStorage.

**Key Interview Points**

* Cookies are auto-sent to the server with each request — ideal for auth/session.

* Key flags: Secure (HTTPS), HttpOnly (XSS-safe), SameSite (CSRF defense), Max-Age.

* localStorage: persistent, client-only, \~5MB — good for UI preferences.

* sessionStorage: cleared on tab close — good for temporary per-tab state.

* Strategy: HttpOnly cookie for auth, localStorage for prefs, sessionStorage for temp.

**Real-World Example**

An app stores its session token in an HttpOnly, Secure, SameSite=Strict cookie so it travels with API requests automatically and can't be stolen by injected scripts. The user's theme choice goes in localStorage, and an in-progress form draft goes in sessionStorage.

**Code — Full & Runnable**

*Browser/client storage code. The Node-runnable demo below simulates cookie serialization and parsing.*

// Cookie storage & caching strategy — cookies vs localStorage vs sessionStorage.  
export function setAuthCookie(token) {  
  // Cookies are sent automatically with every request to the server.  
  // HttpOnly cookies (set by the server) can't be read by JS — safer for auth.  
  document.cookie \=  
    \`session=${token}; Max-Age=3600; Secure; SameSite=Strict; Path=/\`;  
}  
   
export function saveThemePreference(theme) {  
  // localStorage: persists across sessions, client-only, \~5MB. Good for UI prefs.  
  localStorage.setItem("theme", theme);  
}  
   
export function saveDraft(draft) {  
  // sessionStorage: cleared when the tab closes. Good for temporary state.  
  sessionStorage.setItem("draft", JSON.stringify(draft));  
}  
   
// Rule of thumb:  
//   auth/session  \-\> HttpOnly cookie (server-set, auto-sent, XSS-safe)  
//   UI prefs      \-\> localStorage  
//   temp per-tab  \-\> sessionStorage

**Test / Demo & Expected Output (Node-runnable)**

// Cookie storage & caching strategy — parse/serialize cookies; compare stores  
function serializeCookie(name, value, opts \= {}){  
  let str \= \`${name}=${encodeURIComponent(value)}\`;  
  if (opts.maxAge) str \+= \`; Max-Age=${opts.maxAge}\`;  
  if (opts.httpOnly) str \+= "; HttpOnly";  
  if (opts.secure) str \+= "; Secure";  
  if (opts.sameSite) str \+= \`; SameSite=${opts.sameSite}\`;  
  return str;  
}  
function parseCookies(header){  
  return Object.fromEntries(header.split("; ").map(p \=\> {  
    const \[k, v\] \= p.split("="); return \[k, decodeURIComponent(v)\];  
  }));  
}  
const setCookie \= serializeCookie("session", "abc123", { maxAge: 3600, httpOnly: true, secure: true, sameSite: "Strict" });  
console.log("Set-Cookie:", setCookie);  
console.log("Parsed:", JSON.stringify(parseCookies("session=abc123; theme=dark")));  
// strategy note: cookies auto-sent to server (auth); localStorage is client-only (UI prefs)  
console.assert(setCookie.includes("HttpOnly"), "httpOnly flag set");  
console.assert(parseCookies("a=1; b=2").b \=== "2", "cookies parsed");  
console.log("All assertions passed.");  
   
/\* \===== EXPECTED OUTPUT \=====  
Set-Cookie: session=abc123; Max-Age=3600; HttpOnly; Secure; SameSite=Strict  
Parsed: {"session":"abc123","theme":"dark"}  
All assertions passed.  
\===== END EXPECTED OUTPUT \===== \*/

**Common Follow-up Questions**

**Q: Why store auth tokens in HttpOnly cookies instead of localStorage?**

A: HttpOnly cookies can't be read by JavaScript, so an XSS attack can't steal the token. localStorage is fully accessible to any script on the page.

**Q: When use localStorage vs sessionStorage?**

A: localStorage persists across sessions (use for long-lived prefs); sessionStorage is cleared when the tab closes (use for temporary, per-tab data).

**Q: What does SameSite do?**

A: It controls whether cookies are sent on cross-site requests, mitigating CSRF. Strict/Lax restrict cross-site sending; None requires Secure.

## **65\. Jest basics**

**Simple Explanation**

Jest is a popular JavaScript testing framework. You group tests with describe, define individual cases with test/it, and make assertions with expect and matchers like toBe, toEqual, and toThrow. Jest runs tests in isolation, reports pass/fail clearly, and supports mocking and code coverage.

It's the standard choice for unit-testing pure functions, modules, and (with React Testing Library) components. Features like beforeEach/afterEach for setup/teardown and jest.fn()/jest.mock() for mocking make it suitable for everything from tiny utilities to complex integrations.

**Hinglish Explanation**

Jest ek popular JavaScript testing framework hai. Aap tests ko describe se group karte ho, individual cases test/it se define karte ho, aur assertions expect aur matchers (toBe, toEqual, toThrow) se karte ho. Jest tests isolation mein chalata hai, pass/fail clearly batata hai, aur mocking/coverage support karta hai.

Pure functions, modules aur (React Testing Library ke saath) components unit-test karne ke liye standard choice hai. beforeEach/afterEach (setup/teardown) aur jest.fn()/jest.mock() (mocking) ise chhoti utilities se lekar complex integrations tak suitable banate hain.

**Key Interview Points**

* Structure: describe (group), test/it (case), expect \+ matchers (assert).

* Common matchers: toBe, toEqual, toThrow, toContain, toHaveBeenCalled.

* Runs tests in isolation with clear pass/fail output and coverage reports.

* Setup/teardown via beforeEach/afterEach; mocking via jest.fn()/jest.mock().

* The default unit/integration test runner for most React projects.

**Real-World Example**

A pricing utility that applies discounts and taxes is covered by Jest tests for normal cases, edge cases (zero, negative), and rounding. When a teammate refactors it later, the tests catch a regression instantly — before it reaches production.

**Code — Full & Runnable**

*Jest test code (run with the Jest test runner). The Node-runnable demo below is a tiny stand-in runner so the output is verifiable here.*

// Jest basics — unit-test pure functions and modules.  
// sum.js  
export const sum \= (a, b) \=\> a \+ b;  
export const formatPrice \= (n) \=\> \`$${n.toFixed(2)}\`;  
   
// sum.test.js  
import { sum, formatPrice } from "./sum";  
   
describe("sum", () \=\> {  
  test("adds two numbers", () \=\> {  
    expect(sum(2, 3)).toBe(5);  
  });  
   
  test("handles negatives", () \=\> {  
    expect(sum(-1, \-2)).toBe(-3);  
  });  
});  
   
describe("formatPrice", () \=\> {  
  test("formats with two decimals", () \=\> {  
    expect(formatPrice(9.5)).toBe("$9.50");  
  });  
});  
   
// Run with: npx jest  (or "test": "jest" in package.json)

**Test / Demo & Expected Output (Node-runnable)**

// Jest basics — a minimal describe/it/expect runner (mirrors Jest's API)  
let passed \= 0, failed \= 0;  
function describe(name, fn){ console.log("describe:", name); fn(); }  
function it(name, fn){ try { fn(); passed++; console.log("  \\u2713", name); }  
                       catch (e){ failed++; console.log("  \\u2717", name, "-", e.message); } }  
function expect(actual){  
  return {  
    toBe(exp){ if (actual \!== exp) throw new Error(\`expected ${exp}, got ${actual}\`); },  
    toEqual(exp){ if (JSON.stringify(actual) \!== JSON.stringify(exp)) throw new Error("not equal"); },  
  };  
}  
const sum \= (a, b) \=\> a \+ b;  
describe("sum()", () \=\> {  
  it("adds two numbers", () \=\> expect(sum(2, 3)).toBe(5));  
  it("handles negatives", () \=\> expect(sum(-1, \-2)).toBe(-3));  
  it("works with arrays via map", () \=\> expect(\[1, 2\].map(n \=\> sum(n, 10))).toEqual(\[11, 12\]));  
});  
console.log(\`Results: ${passed} passed, ${failed} failed\`);  
console.assert(failed \=== 0, "all tests should pass");  
console.log("All assertions passed.");  
   
/\* \===== EXPECTED OUTPUT \=====  
describe: sum()  
  ✓ adds two numbers  
  ✓ handles negatives  
  ✓ works with arrays via map  
Results: 3 passed, 0 failed  
All assertions passed.  
\===== END EXPECTED OUTPUT \===== \*/

**Common Follow-up Questions**

**Q: What's the difference between toBe and toEqual?**

A: toBe checks strict identity (===), good for primitives. toEqual does a deep structural comparison, used for objects and arrays.

**Q: How do you mock a function or module in Jest?**

A: Use jest.fn() to create a mock function and jest.mock('module') to replace a module, then assert calls with matchers like toHaveBeenCalledWith.

**Q: How do you share setup across tests?**

A: Use beforeEach/afterEach (and beforeAll/afterAll) to run setup and cleanup code, keeping each test isolated and DRY.

## **66\. React Testing Library basics**

**Simple Explanation**

React Testing Library (RTL) tests components the way a user experiences them — by what's rendered and how you interact with it, not internal implementation details. You render a component, query elements by accessible roles/text (getByRole, getByText), and simulate interactions with userEvent.

This 'test behavior, not implementation' philosophy makes tests resilient to refactors: as long as the user-visible behavior is unchanged, the tests pass. Queries are also accessibility-oriented, nudging you toward more accessible markup.

**Hinglish Explanation**

React Testing Library (RTL) components ko waise test karta hai jaise user experience karta hai — jo render hota hai aur jaise interact karte ho, internal details se nahi. Aap component render karte ho, elements ko accessible roles/text se query karte ho (getByRole, getByText), aur interactions userEvent se simulate karte ho.

'Behavior test karo, implementation nahi' philosophy tests ko refactors ke against resilient banati hai: jab tak user-visible behavior same hai, tests pass rehte hain. Queries accessibility-oriented bhi hain, jo better markup ki taraf push karti hain.

**Key Interview Points**

* Test components by user-visible behavior, not internal implementation.

* Render, then query by role/text (getByRole, getByText, findBy\* for async).

* Simulate interactions with userEvent (click, type) — closer to real users.

* Resilient to refactors: unchanged behavior keeps tests passing.

* Accessibility-first queries encourage more accessible markup.

**Real-World Example**

A Counter component is tested by rendering it, asserting it shows 'Count: 0', clicking the Increment button via userEvent, and asserting it shows 'Count: 1'. The test never references state internals, so refactoring useState to useReducer doesn't break it.

**Code — Full & Runnable**

*React Testing Library test code (run with Jest/Vitest). The Node-runnable demo below simulates its query API so the output is verifiable here.*

// React Testing Library — test components the way users interact with them.  
// Counter.jsx  
import React, { useState } from "react";  
export function Counter() {  
  const \[count, setCount\] \= useState(0);  
  return (  
    \<div\>  
      \<p\>Count: {count}\</p\>  
      \<button onClick={() \=\> setCount((c) \=\> c \+ 1)}\>Increment\</button\>  
    \</div\>  
  );  
}  
   
// Counter.test.jsx  
import { render, screen } from "@testing-library/react";  
import userEvent from "@testing-library/user-event";  
import { Counter } from "./Counter";  
   
test("increments when the button is clicked", async () \=\> {  
  render(\<Counter /\>);  
  expect(screen.getByText("Count: 0")).toBeInTheDocument();  
   
  await userEvent.click(screen.getByRole("button", { name: /increment/i }));  
   
  expect(screen.getByText("Count: 1")).toBeInTheDocument();  
});

**Test / Demo & Expected Output (Node-runnable)**

// React Testing Library basics — query a (fake) rendered tree by role/text  
function render(tree){  
  return {  
    getByText: (txt) \=\> { const n \= find(tree, n \=\> n.text \=== txt); if (\!n) throw new Error("not found: " \+ txt); return n; },  
    getByRole: (role) \=\> { const n \= find(tree, n \=\> n.role \=== role); if (\!n) throw new Error("no role: " \+ role); return n; },  
    queryByText: (txt) \=\> find(tree, n \=\> n.text \=== txt) || null,  
  };  
}  
function find(node, pred){  
  if (pred(node)) return node;  
  for (const c of node.children || \[\]){ const f \= find(c, pred); if (f) return f; }  
  return null;  
}  
const ui \= { role: "main", children: \[  
  { role: "heading", text: "Welcome" },  
  { role: "button", text: "Submit", onClick: () \=\> "clicked" },  
\]};  
const screen \= render(ui);  
console.log("getByText('Welcome'):", screen.getByText("Welcome").role);  
console.log("button click \-\>", screen.getByRole("button").onClick());  
console.log("queryByText('Missing'):", screen.queryByText("Missing"));  
console.assert(screen.queryByText("Missing") \=== null, "absent text returns null");  
console.log("All assertions passed.");  
   
/\* \===== EXPECTED OUTPUT \=====  
getByText('Welcome'): heading  
button click \-\> clicked  
queryByText('Missing'): null  
All assertions passed.  
\===== END EXPECTED OUTPUT \===== \*/

**Common Follow-up Questions**

**Q: Why query by role/text instead of test IDs or classes?**

A: Because it mirrors how users (and assistive tech) find elements, making tests realistic and refactor-resistant. Test IDs are a fallback when no accessible query fits.

**Q: getBy vs queryBy vs findBy — when to use each?**

A: getBy throws if not found (assert presence); queryBy returns null (assert absence); findBy returns a promise (wait for async elements to appear).

**Q: What's the core philosophy of RTL?**

A: Test behavior, not implementation — interact with the component as a user would so tests stay valid through internal refactors.

## **67\. Storybook**

**Simple Explanation**

Storybook is a tool for building and documenting UI components in isolation, outside your app. Each component gets 'stories' — named examples of its different states and variants — that render in an interactive explorer where you can tweak props (args) live and see every edge case.

It doubles as living documentation and a development sandbox, helps teams share a consistent component library, and supports add-ons for accessibility checks, interaction tests, and visual regression testing. Designers and developers can review components without running the whole app.

**Hinglish Explanation**

Storybook UI components ko app ke bahar, isolation mein build aur document karne ka tool hai. Har component ki 'stories' hoti hain — uske different states/variants ke named examples — jo ek interactive explorer mein render hote hain jahan aap props (args) live badal kar har edge case dekh sakte ho.

Ye living documentation aur development sandbox dono hai, teams ko consistent component library share karne mein madad karta hai, aur accessibility, interaction tests, visual regression ke add-ons support karta hai. Designers/developers poori app chalaye bina components review kar sakte hain.

**Key Interview Points**

* Develop and document components in isolation, outside the full app.

* Stories are named examples of a component's states/variants.

* Live-edit props (args) in an interactive explorer to cover edge cases.

* Acts as living documentation and a shared component catalog.

* Add-ons enable a11y checks, interaction tests, and visual regression.

**Real-World Example**

A design system ships a Button with stories for primary, danger, disabled, and loading states. Designers review them in Storybook, QA runs visual regression on each story, and developers grab the exact variant they need — all without booting the main app.

**Code — Full & Runnable**

*Storybook story code (run with the Storybook dev server). The Node-runnable demo below simulates a story registry so the output is verifiable here.*

// Storybook — document and develop components in isolation with stories.  
// Button.stories.jsx  
import { Button } from "./Button";  
   
export default {  
  title: "Components/Button",  
  component: Button,  
  args: { children: "Click me" },                 // default args  
  argTypes: { variant: { control: "select", options: \["primary", "secondary", "danger"\] } },  
};  
   
// Each named export is a "story" \= one state/variant of the component.  
export const Primary \= { args: { variant: "primary" } };  
export const Danger \= { args: { variant: "danger" } };  
export const Disabled \= { args: { disabled: true } };  
   
// Run with: npx storybook dev \-p 6006  
// Stories double as visual docs and as targets for interaction/visual tests.

**Test / Demo & Expected Output (Node-runnable)**

// Storybook — a story registry catalogs component states/variants  
function createStorybook(){  
  const stories \= \[\];  
  return {  
    add(component, name, args){ stories.push({ component, name, args }); },  
    render(){ return stories.map(s \=\> \`${s.component}/${s.name}: ${JSON.stringify(s.args)}\`); },  
    count: () \=\> stories.length,  
  };  
}  
const sb \= createStorybook();  
sb.add("Button", "Primary",   { variant: "primary", label: "Save" });  
sb.add("Button", "Danger",    { variant: "danger",  label: "Delete" });  
sb.add("Button", "Disabled",  { disabled: true,     label: "Save" });  
sb.render().forEach(s \=\> console.log(s));  
console.log("Total stories:", sb.count());  
console.assert(sb.count() \=== 3, "three Button stories registered");  
console.log("All assertions passed.");  
   
/\* \===== EXPECTED OUTPUT \=====  
Button/Primary: {"variant":"primary","label":"Save"}  
Button/Danger: {"variant":"danger","label":"Delete"}  
Button/Disabled: {"disabled":true,"label":"Save"}  
Total stories: 3  
All assertions passed.  
\===== END EXPECTED OUTPUT \===== \*/

**Common Follow-up Questions**

**Q: What is a 'story'?**

A: A single rendered example of a component in a specific state/variant, defined by its args. A component typically has several stories covering its key states.

**Q: How does Storybook help teams?**

A: It provides isolated development, living documentation, and a shared catalog of components, so design, dev, and QA align on the same source of truth.

**Q: Can Storybook be used for testing?**

A: Yes — stories serve as targets for interaction tests, accessibility audits, and visual regression testing via add-ons.

## **68\. E2E testing (Cypress / Playwright)**

**Simple Explanation**

End-to-end (E2E) testing drives the real application in a real browser, simulating complete user journeys — visiting pages, filling forms, clicking buttons, and asserting outcomes. Unlike unit tests, E2E tests verify that all the pieces (frontend, routing, APIs) work together from the user's perspective.

Cypress and Playwright are the leading tools. They provide commands to navigate, interact, and assert, with automatic waiting for elements, screenshots/videos on failure, and the ability to run across browsers (Playwright especially). E2E tests are slower and more brittle than unit tests, so cover critical flows rather than everything.

**Hinglish Explanation**

End-to-end (E2E) testing real application ko real browser mein chalata hai, complete user journeys simulate karke — pages visit karna, forms bharna, buttons click karna, aur outcomes assert karna. Unit tests ke ulat, E2E verify karta hai ki saare pieces (frontend, routing, APIs) user ke perspective se saath kaam karte hain.

Cypress aur Playwright leading tools hain. Ye navigate/interact/assert ke commands dete hain, elements ka automatic wait, failure par screenshots/videos, aur multiple browsers (khaaskar Playwright). E2E tests slow aur thode brittle hote hain, isliye critical flows cover karo, sab kuch nahi.

**Key Interview Points**

* Drives the real app in a real browser to test full user journeys.

* Verifies frontend \+ routing \+ APIs work together end to end.

* Cypress / Playwright: navigate, interact, assert, with auto-waiting.

* Captures screenshots/videos on failure; Playwright runs cross-browser.

* Slower and more brittle — cover critical flows, not every detail.

**Real-World Example**

A checkout flow is protected by an E2E test: log in, add an item, go to checkout, pay, and assert 'Order confirmed'. If a deploy breaks any step — a broken route, a failing API — the test fails in CI before customers ever hit it.

**Code — Full & Runnable**

*Cypress E2E test code (run with the Cypress runner). The Node-runnable demo below simulates the command/assertion flow so the output is verifiable here.*

// E2E testing — drive the real app in a browser (Cypress example).  
// cypress/e2e/checkout.cy.js  
   
describe("checkout flow", () \=\> {  
  it("lets a user log in and buy an item", () \=\> {  
    cy.visit("/login");  
    cy.get('input\[name="email"\]').type("asha@example.com");  
    cy.get('input\[name="password"\]').type("secret123");  
    cy.contains("button", "Log in").click();  
   
    cy.url().should("include", "/shop");          // assertion on navigation  
    cy.contains(".product", "Phone").find("button").click(); // add to cart  
    cy.get('\[data-testid="cart-count"\]').should("have.text", "1");  
   
    cy.contains("button", "Checkout").click();  
    cy.contains("Order confirmed").should("be.visible");  
  });  
});  
   
// Playwright equivalent uses: await page.goto(), page.click(), expect(page)...

**Test / Demo & Expected Output (Node-runnable)**

// E2E testing (Cypress/Playwright) — drive a fake app with commands \+ assertions  
function createApp(){  
  return { url: "/", loggedIn: false, cart: 0 };  
}  
function createTestRunner(app){  
  const steps \= \[\];  
  const api \= {  
    visit(url){ app.url \= url; steps.push(\`visit ${url}\`); return api; },  
    click(action){  
      if (action \=== "login") app.loggedIn \= true;  
      if (action \=== "add-to-cart") app.cart++;  
      steps.push(\`click ${action}\`); return api;  
    },  
    expectUrl(url){ if (app.url \!== url) throw new Error(\`url ${app.url} \!= ${url}\`); steps.push(\`expect url ${url}\`); return api; },  
    expectCart(n){ if (app.cart \!== n) throw new Error(\`cart ${app.cart} \!= ${n}\`); steps.push(\`expect cart ${n}\`); return api; },  
  };  
  return api;  
}  
const app \= createApp();  
const cy \= createTestRunner(app);  
cy.visit("/login").click("login").visit("/shop")  
  .click("add-to-cart").click("add-to-cart")  
  .expectUrl("/shop").expectCart(2);  
console.log("E2E flow passed. Logged in:", app.loggedIn, "| Cart:", app.cart);  
console.assert(app.loggedIn && app.cart \=== 2, "user logged in with 2 items");  
console.log("All assertions passed.");  
   
/\* \===== EXPECTED OUTPUT \=====  
E2E flow passed. Logged in: true | Cart: 2  
All assertions passed.  
\===== END EXPECTED OUTPUT \===== \*/

**Common Follow-up Questions**

**Q: How do E2E tests differ from unit tests?**

A: Unit tests check small pieces in isolation; E2E tests run the whole app in a browser to verify complete user flows across frontend, routing, and backend together.

**Q: Why not E2E-test everything?**

A: E2E tests are slower and more brittle than unit/integration tests. Use them for critical user journeys and rely on faster tests for the bulk of coverage (the testing pyramid).

**Q: Cypress vs Playwright — a quick distinction?**

A: Both are excellent; Playwright offers strong multi-browser support and parallelism out of the box, while Cypress has a very developer-friendly interactive runner. Choice often comes down to team preference.

## **69\. CRUD App using Redux Toolkit**

**Simple Explanation**

A CRUD app exercises the four basic operations — Create, Read, Update, Delete — over a collection. With Redux Toolkit you model this as a slice: the state holds the list, and reducers handle adding, editing, toggling, and removing items, with action creators generated automatically.

This is a classic interview project because it ties together global state, immutable updates (via Immer), and a clean action-driven data flow. Components read with useSelector and write by dispatching the slice's actions.

**Hinglish Explanation**

CRUD app chaar basic operations — Create, Read, Update, Delete — ek collection par karta hai. Redux Toolkit se ise ek slice ki tarah model karte hain: state list rakhti hai, aur reducers add, edit, toggle, remove handle karte hain, action creators automatically ban jaate hain.

Ye classic interview project hai kyunki ye global state, immutable updates (Immer se), aur clean action-driven data flow ko jodta hai. Components useSelector se read karte hain aur slice ke actions dispatch karke write karte hain.

**Key Interview Points**

* Models a collection with the four operations: create, read, update, delete.

* RTK slice: state holds the list; reducers handle each operation.

* Immer enables 'mutating' reducer code that produces immutable updates.

* Action creators are auto-generated; use prepare for derived payloads (ids).

* Components read via useSelector, write by dispatching slice actions.

**Real-World Example**

A todo app keeps tasks in a Redux todos slice: addTodo creates, the list view reads via useSelector, toggleTodo/editTodo update, and removeTodo deletes. All state transitions live in one slice file, making the data flow predictable and easy to test.

**Code — Full & Runnable**

*A real Redux Toolkit slice (.jsx). The Node-runnable demo below verifies the full create/read/update/delete logic.*

// CRUD App using Redux Toolkit — a complete todos slice with all 4 operations.  
import { createSlice, nanoid } from "@reduxjs/toolkit";  
   
const todosSlice \= createSlice({  
  name: "todos",  
  initialState: { items: \[\] },  
  reducers: {  
    // CREATE  
    addTodo: {  
      reducer: (state, action) \=\> { state.items.push(action.payload); },  
      prepare: (title) \=\> ({ payload: { id: nanoid(), title, done: false } }),  
    },  
    // UPDATE  
    toggleTodo: (state, action) \=\> {  
      const t \= state.items.find((i) \=\> i.id \=== action.payload);  
      if (t) t.done \= \!t.done;  
    },  
    editTodo: (state, action) \=\> {  
      const t \= state.items.find((i) \=\> i.id \=== action.payload.id);  
      if (t) t.title \= action.payload.title;  
    },  
    // DELETE  
    removeTodo: (state, action) \=\> {  
      state.items \= state.items.filter((i) \=\> i.id \!== action.payload);  
    },  
  },  
});  
   
export const { addTodo, toggleTodo, editTodo, removeTodo } \= todosSlice.actions;  
export default todosSlice.reducer;  
   
// READ happens in components via useSelector((s) \=\> s.todos.items)

**Test / Demo & Expected Output (Node-runnable)**

// CRUD App using Redux Toolkit — full create/read/update/delete reducer  
function crudReducer(state, action){  
  switch (action.type){  
    case "create": return { items: \[...state.items, action.payload\], nextId: state.nextId \+ 1 };  
    case "update": return { ...state, items: state.items.map(i \=\> i.id \=== action.payload.id ? { ...i, ...action.payload } : i) };  
    case "delete": return { ...state, items: state.items.filter(i \=\> i.id \!== action.payload) };  
    default: return state;  
  }  
}  
let state \= { items: \[\], nextId: 1 };  
const dispatch \= (a) \=\> { state \= crudReducer(state, a); };  
   
dispatch({ type: "create", payload: { id: 1, title: "Learn React" } });  
dispatch({ type: "create", payload: { id: 2, title: "Learn Redux" } });  
console.log("After create:", JSON.stringify(state.items));  
dispatch({ type: "update", payload: { id: 1, title: "Master React" } });  
console.log("After update:", JSON.stringify(state.items.find(i \=\> i.id \=== 1)));  
dispatch({ type: "delete", payload: 2 });  
console.log("After delete:", JSON.stringify(state.items));  
console.assert(state.items.length \=== 1, "one item left");  
console.assert(state.items\[0\].title \=== "Master React", "update applied");  
console.log("All assertions passed.");  
   
/\* \===== EXPECTED OUTPUT \=====  
After create: \[{"id":1,"title":"Learn React"},{"id":2,"title":"Learn Redux"}\]  
After update: {"id":1,"title":"Master React"}  
After delete: \[{"id":1,"title":"Master React"}\]  
All assertions passed.  
\===== END EXPECTED OUTPUT \===== \*/

**Common Follow-up Questions**

**Q: What does the prepare callback do in a reducer?**

A: It customizes the action payload before it reaches the reducer — e.g., generating an id with nanoid — so components can call addTodo(title) without building the full object.

**Q: How is Read handled in a Redux CRUD app?**

A: Components select the data from the store with useSelector. The 'read' isn't an action — it's reading current state; loading from an API would use a thunk.

**Q: Why is this a common interview exercise?**

A: It demonstrates global state design, immutable updates, action-driven flow, and connecting components — a compact test of practical Redux knowledge.

## **70\. Product Listing App using React Query**

**Simple Explanation**

A product listing app fetches a catalog from an API and lets users filter and sort it. React Query is a natural fit: useQuery handles fetching, caching, loading and error states, and background refetching, so the component focuses on presentation and the filter/sort logic.

Because the data is cached by query key, navigating away and back is instant, and multiple components needing the same products share one request. Filtering and sorting are derived from the cached data on the client (or pushed to the server via query params for large datasets).

**Hinglish Explanation**

Product listing app ek catalog API se fetch karta hai aur users ko filter/sort karne deta hai. React Query yahan perfect hai: useQuery fetching, caching, loading/error states, aur background refetch handle karta hai, isliye component presentation aur filter/sort logic par focus karta hai.

Data query key se cached hota hai, isliye navigate karke wapas aana instant hai, aur same products chahne wale kai components ek hi request share karte hain. Filtering/sorting cached data se client par derive hoti hai (ya bade datasets ke liye server params se).

**Key Interview Points**

* useQuery fetches the catalog with caching, loading/error states, and refetch.

* Cached by query key — revisits are instant and requests are deduped.

* Filter/sort derived from cached data on the client for small sets.

* For large datasets, push filtering/sorting/pagination to the server via params.

* Keeps components focused on UI while React Query owns server state.

**Real-World Example**

A shop page loads products once via React Query and caches them. Users switch category filters and price sorting instantly because it all works off the cached list — no refetch — and returning from a product detail page shows the list immediately from cache.

**Code — Full & Runnable**

*A real React component (.jsx) using TanStack Query. The Node-runnable demo below verifies the fetch/cache/filter/sort logic.*

// Product Listing App using React Query — fetch, cache, filter, and sort.  
import React, { useState } from "react";  
import { useQuery } from "@tanstack/react-query";  
   
function useProducts() {  
  return useQuery({  
    queryKey: \["products"\],  
    queryFn: () \=\> fetch("/api/products").then((r) \=\> r.json()),  
    staleTime: 60\_000, // cached & fresh for a minute  
  });  
}  
   
export default function ProductList() {  
  const { data \= \[\], isLoading, isError } \= useProducts();  
  const \[category, setCategory\] \= useState("all");  
   
  if (isLoading) return \<p\>Loading…\</p\>;  
  if (isError) return \<p\>Failed to load products.\</p\>;  
   
  const visible \= data  
    .filter((p) \=\> category \=== "all" || p.category \=== category)  
    .sort((a, b) \=\> a.price \- b.price);  
   
  return (  
    \<div\>  
      \<select value={category} onChange={(e) \=\> setCategory(e.target.value)}\>  
        \<option value="all"\>All\</option\>  
        \<option value="tech"\>Tech\</option\>  
        \<option value="wear"\>Wear\</option\>  
      \</select\>  
      \<ul\>  
        {visible.map((p) \=\> (  
          \<li key={p.id}\>{p.name} — ${p.price}\</li\>  
        ))}  
      \</ul\>  
    \</div\>  
  );  
}

**Test / Demo & Expected Output (Node-runnable)**

// Product Listing App using React Query — fetch \+ cache \+ filter \+ sort  
function createProductStore(){  
  const cache \= new Map(); let fetches \= 0;  
  const db \= \[  
    { id: 1, name: "Phone",  price: 699, category: "tech" },  
    { id: 2, name: "Shirt",  price: 25,  category: "wear" },  
    { id: 3, name: "Laptop", price: 1299, category: "tech" },  
  \];  
  async function fetchProducts(){  
    if (cache.has("products")) return cache.get("products");  
    fetches++; cache.set("products", db); return db;  
  }  
  return { fetchProducts, fetchCount: () \=\> fetches };  
}  
(async () \=\> {  
  const store \= createProductStore();  
  await store.fetchProducts();  
  const products \= await store.fetchProducts();   // cached, no 2nd fetch  
  const tech \= products.filter(p \=\> p.category \=== "tech").sort((a, b) \=\> a.price \- b.price);  
  console.log("Tech products (cheapest first):", tech.map(p \=\> \`${p.name} $${p.price}\`).join(", "));  
  console.log("Network fetches:", store.fetchCount());  
  console.assert(store.fetchCount() \=== 1, "second call served from cache");  
  console.assert(tech\[0\].name \=== "Phone", "sorted by price");  
  console.log("All assertions passed.");  
})();  
   
/\* \===== EXPECTED OUTPUT \=====  
Tech products (cheapest first): Phone $699, Laptop $1299  
Network fetches: 1  
All assertions passed.  
\===== END EXPECTED OUTPUT \===== \*/

**Common Follow-up Questions**

**Q: Why use React Query for a product list?**

A: It removes manual fetch/loading/error/caching boilerplate, dedupes requests, caches by key for instant revisits, and refetches stale data in the background.

**Q: Should filtering happen on the client or server?**

A: For small datasets, client-side off the cached list is simplest and instant. For large catalogs, send filter/sort/pagination as query params so the server returns only what's needed.

**Q: How do revisits become instant?**

A: React Query caches responses by query key; navigating back finds fresh cached data and renders immediately while optionally refetching in the background.

## **71\. Drag & Drop Kanban Board**

**Simple Explanation**

A Kanban board (like Trello) has columns (To Do, Doing, Done) holding draggable cards. The core logic is moving a card from a source column to a target column at a specific position — remove it from where it was and insert it where it's dropped — while keeping state immutable.

In React you typically use a drag-and-drop library (dnd-kit or react-beautiful-dnd) to handle pointer/keyboard interactions and accessibility, and you implement the onDragEnd handler that updates your board state. The data model is usually a map of columns to ordered card arrays.

**Hinglish Explanation**

Kanban board (Trello jaisa) mein columns (To Do, Doing, Done) hote hain jo draggable cards rakhte hain. Core logic hai card ko source column se target column mein ek specific position par move karna — jahan tha wahan se hatao aur jahan drop hua wahan insert karo — state immutable rakhte hue.

React mein aksar drag-and-drop library (dnd-kit ya react-beautiful-dnd) use karte hain jo pointer/keyboard interactions aur accessibility handle karti hai, aur aap onDragEnd handler likhte ho jo board state update kare. Data model aksar columns \-\> ordered card arrays ka map hota hai.

**Key Interview Points**

* Model: columns mapped to ordered arrays of cards.

* Core move logic: remove from source, insert into target at the drop index.

* Keep state immutable when reordering (new arrays, not mutation).

* Use a DnD library (dnd-kit) for pointer/keyboard interaction \+ a11y.

* Implement onDragEnd to compute and commit the new board state.

**Real-World Example**

A team board lets users drag a 'Build' card from Doing to Done. The onDragEnd handler removes it from the Doing array and appends it to Done, React re-renders both columns, and (in a real app) the change is persisted to the backend.

**Code — Full & Runnable**

*A real React component (.jsx) using dnd-kit. The Node-runnable demo below verifies the card-move/reorder logic.*

// Drag & Drop Kanban Board — move cards between columns (dnd-kit style handler).  
import React, { useState } from "react";  
import { DndContext } from "@dnd-kit/core";  
   
const initial \= {  
  todo: \[{ id: "a", text: "Design" }, { id: "b", text: "Spec" }\],  
  doing: \[{ id: "c", text: "Build" }\],  
  done: \[\],  
};  
   
export default function Kanban() {  
  const \[board, setBoard\] \= useState(initial);  
   
  function handleDragEnd({ active, over }) {  
    if (\!over) return;  
    const from \= Object.keys(board).find((col) \=\> board\[col\].some((c) \=\> c.id \=== active.id));  
    const to \= over.id; // droppable column id  
    if (from \=== to) return;  
   
    setBoard((prev) \=\> {  
      const card \= prev\[from\].find((c) \=\> c.id \=== active.id);  
      return {  
        ...prev,  
        \[from\]: prev\[from\].filter((c) \=\> c.id \!== active.id), // remove from source  
        \[to\]: \[...prev\[to\], card\],                            // append to target  
      };  
    });  
  }  
   
  return (  
    \<DndContext onDragEnd={handleDragEnd}\>  
      \<div className="board"\>  
        {Object.entries(board).map((\[col, cards\]) \=\> (  
          \<Column key={col} id={col} cards={cards} /\>  
        ))}  
      \</div\>  
    \</DndContext\>  
  );  
}  
   
function Column({ id, cards }) {  
  return (  
    \<div className="column" data-col={id}\>  
      \<h3\>{id}\</h3\>  
      {cards.map((c) \=\> \<div key={c.id} className="card"\>{c.text}\</div\>)}  
    \</div\>  
  );  
}

**Test / Demo & Expected Output (Node-runnable)**

// Drag & Drop Kanban Board — move a card between columns at an index  
function moveCard(board, cardId, toColumn, toIndex){  
  const next \= structuredClone(board);  
  let card;  
  for (const col in next){  
    const i \= next\[col\].findIndex(c \=\> c.id \=== cardId);  
    if (i \!== \-1){ \[card\] \= next\[col\].splice(i, 1); break; }   // remove from source  
  }  
  next\[toColumn\].splice(toIndex, 0, card);                      // insert at target  
  return next;  
}  
let board \= {  
  todo: \[{ id: "a", text: "Design" }, { id: "b", text: "Spec" }\],  
  doing: \[{ id: "c", text: "Build" }\],  
  done: \[\],  
};  
board \= moveCard(board, "a", "doing", 1);   // drag "Design" into doing  
board \= moveCard(board, "c", "done", 0);    // drag "Build" into done  
console.log("todo: ", board.todo.map(c \=\> c.text).join(", "));  
console.log("doing:", board.doing.map(c \=\> c.text).join(", "));  
console.log("done: ", board.done.map(c \=\> c.text).join(", "));  
console.assert(board.done\[0\].text \=== "Build", "card moved to done");  
console.assert(board.doing.length \=== 1 && board.doing\[0\].text \=== "Design", "card reordered into doing");  
console.log("All assertions passed.");  
   
/\* \===== EXPECTED OUTPUT \=====  
todo:  Spec  
doing: Design  
done:  Build  
All assertions passed.  
\===== END EXPECTED OUTPUT \===== \*/

**Common Follow-up Questions**

**Q: Why use a DnD library instead of the native HTML5 drag API?**

A: Libraries like dnd-kit handle pointer and keyboard interactions, accessibility (screen-reader announcements), auto-scrolling, and edge cases the raw API makes painful.

**Q: What's the core state update on drop?**

A: Identify the source and target columns, remove the card from the source array, and insert it into the target array at the drop index — immutably, so React re-renders correctly.

**Q: How would you persist the changes?**

A: On drag end, update local state optimistically and send the move to the server (often with an order/position field), rolling back if the request fails.

## **72\. Dashboard UI**

**Simple Explanation**

A dashboard UI presents key metrics and visualizations at a glance — KPI cards (revenue, orders, average order value) plus charts (bars, lines, pie). The hard part is usually not the rendering but the data: aggregating raw records into the summary numbers and series the widgets display.

In React you compute these aggregations (often memoized with useMemo so they don't recompute on every render), feed them to a charting library like Recharts or Chart.js, and lay everything out responsively. Good dashboards also handle loading, empty, and error states gracefully.

**Hinglish Explanation**

Dashboard UI key metrics aur visualizations ek nazar mein dikhata hai — KPI cards (revenue, orders, average order value) aur charts (bars, lines, pie). Mushkil hissa aksar rendering nahi balki data hota hai: raw records ko summary numbers aur series mein aggregate karna jo widgets dikhate hain.

React mein ye aggregations compute karte ho (aksar useMemo se memoized taaki har render par dobara na ho), Recharts ya Chart.js jaisi library ko dete ho, aur sab responsively layout karte ho. Achhe dashboards loading, empty aur error states bhi handle karte hain.

**Key Interview Points**

* Surfaces KPIs \+ charts so users grasp the state at a glance.

* The real work is data aggregation: raw records \-\> summary metrics/series.

* Memoize aggregations (useMemo) so they don't recompute every render.

* Use a charting lib (Recharts, Chart.js) and a responsive layout.

* Handle loading, empty, and error states for a polished result.

**Real-World Example**

An analytics dashboard turns a list of orders into KPI cards (total revenue, order count, AOV) and a bar chart of orders per day. The aggregation runs in a memoized function, so resizing the window or toggling a filter re-renders the layout without recomputing the stats unnecessarily.

**Code — Full & Runnable**

*A real React component (.jsx) using Recharts. The Node-runnable demo below verifies the data-aggregation/KPI logic.*

// Dashboard UI — KPI cards \+ a chart built from aggregated data.  
import React, { useMemo } from "react";  
import { BarChart, Bar, XAxis, YAxis, Tooltip, ResponsiveContainer } from "recharts";  
   
export default function Dashboard({ orders }) {  
  const stats \= useMemo(() \=\> {  
    const paid \= orders.filter((o) \=\> o.status \=== "paid");  
    const revenue \= paid.reduce((s, o) \=\> s \+ o.amount, 0);  
    const byDay \= Object.values(  
      orders.reduce((acc, o) \=\> {  
        acc\[o.date\] \= acc\[o.date\] || { date: o.date, count: 0 };  
        acc\[o.date\].count++;  
        return acc;  
      }, {})  
    );  
    return { revenue, paid: paid.length, total: orders.length, aov: Math.round(revenue / paid.length), byDay };  
  }, \[orders\]);  
   
  return (  
    \<div className="dashboard"\>  
      \<div className="kpis"\>  
        \<KPI label="Revenue" value={\`$${stats.revenue}\`} /\>  
        \<KPI label="Orders" value={stats.total} /\>  
        \<KPI label="Avg Order" value={\`$${stats.aov}\`} /\>  
      \</div\>  
      \<ResponsiveContainer width="100%" height={240}\>  
        \<BarChart data={stats.byDay}\>  
          \<XAxis dataKey="date" /\>\<YAxis /\>\<Tooltip /\>  
          \<Bar dataKey="count" fill="\#2E75B6" /\>  
        \</BarChart\>  
      \</ResponsiveContainer\>  
    \</div\>  
  );  
}  
   
function KPI({ label, value }) {  
  return \<div className="kpi"\>\<span\>{label}\</span\>\<strong\>{value}\</strong\>\</div\>;  
}

**Test / Demo & Expected Output (Node-runnable)**

// Dashboard UI — aggregate raw data into KPI widget metrics  
const orders \= \[  
  { id: 1, amount: 120, status: "paid",    date: "2026-05-01" },  
  { id: 2, amount: 80,  status: "paid",    date: "2026-05-01" },  
  { id: 3, amount: 200, status: "refunded",date: "2026-05-02" },  
  { id: 4, amount: 50,  status: "paid",    date: "2026-05-02" },  
\];  
function buildDashboard(orders){  
  const paid \= orders.filter(o \=\> o.status \=== "paid");  
  const revenue \= paid.reduce((s, o) \=\> s \+ o.amount, 0);  
  const aov \= Math.round(revenue / paid.length);  
  const byDay \= orders.reduce((acc, o) \=\> { acc\[o.date\] \= (acc\[o.date\] || 0\) \+ 1; return acc; }, {});  
  return { totalOrders: orders.length, paidOrders: paid.length, revenue, aov, byDay };  
}  
const d \= buildDashboard(orders);  
console.log("Total orders:", d.totalOrders);  
console.log("Revenue (paid):", "$" \+ d.revenue);  
console.log("Avg order value:", "$" \+ d.aov);  
console.log("Orders by day:", JSON.stringify(d.byDay));  
console.assert(d.revenue \=== 250, "120 \+ 80 \+ 50 \= 250");  
console.assert(d.aov \=== 83, "avg of 3 paid orders");  
console.log("All assertions passed.");  
   
/\* \===== EXPECTED OUTPUT \=====  
Total orders: 4  
Revenue (paid): $250  
Avg order value: $83  
Orders by day: {"2026-05-01":2,"2026-05-02":2}  
All assertions passed.  
\===== END EXPECTED OUTPUT \===== \*/

**Common Follow-up Questions**

**Q: What's usually the hardest part of a dashboard?**

A: The data layer — aggregating and shaping raw records into the metrics and series the widgets need — not the chart rendering itself.

**Q: Why memoize the aggregations?**

A: Aggregating large datasets is expensive; useMemo recomputes only when the underlying data changes, avoiding wasted work on unrelated re-renders (resize, hover, filter UI).

**Q: What states should a robust dashboard handle?**

A: Loading (skeletons), empty (no data yet), and error (failed fetch) — plus the normal data state — so it never shows a broken or blank screen.