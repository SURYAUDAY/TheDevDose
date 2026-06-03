  
**React \+ Frontend Architecture**

Interview Study Guide

Phase 2  ·  Topics 26–50 of 72

Full-Stack \+ GenAI Roadmap

Code language: JavaScript (JSX)

**How to run the code samples**

React components (.jsx): run inside a React app (e.g. Vite / Next.js).

Node logic demos: save as filename.js, then run  node filename.js

**Table of Contents**

# **React \+ Frontend Architecture**

This guide covers topics 26–50 of Phase 2, focused on the architecture and ecosystem around React apps: code splitting and routing (including nested, dynamic, and protected routes), state management with Context and Redux Toolkit, server-state with React Query (caching, optimistic updates, pagination, infinite queries), forms and validation, styling and accessibility, project structure and reusable components, and the rendering frameworks Next.js and SSR.

Each topic follows the same structure: a plain-English explanation, the same idea in spoken Hinglish, key interview points, a real-world example, full React component code, a Node-runnable logic demo with verified expected output, and common follow-up questions.

## **26\. Code splitting**

**Simple Explanation**

Code splitting breaks your JavaScript bundle into smaller chunks that load on demand instead of shipping everything up front. The browser downloads only the code needed for the current view, which shrinks the initial bundle and speeds up first load.

In React this is done with dynamic import() plus React.lazy and Suspense, most commonly at the route level so each page is its own chunk. Bundlers like Webpack, Vite, and Rollup turn each dynamic import into a separate file automatically.

**Hinglish Explanation**

Code splitting aapke JavaScript bundle ko chhote chunks mein tod deta hai jo zaroorat par load hote hain, sab kuch ek saath nahi bhejte. Browser sirf current view ka code download karta hai, isliye initial bundle chhota aur first load fast hota hai.

React mein ye dynamic import() ke saath React.lazy aur Suspense se hota hai, aksar route level par taaki har page apna chunk ho. Webpack/Vite/Rollup har dynamic import ko alag file bana dete hain.

**Key Interview Points**

* Splits one big bundle into smaller chunks loaded on demand, reducing initial load.

* Achieved via dynamic import(); React.lazy \+ Suspense wire it into components.

* Route-based splitting is the highest-impact pattern — one chunk per page.

* Bundlers create the separate chunk files automatically at each import() boundary.

* Trade-off: too many tiny chunks add request overhead; split at meaningful boundaries.

**Real-World Example**

A SaaS app keeps its marketing landing page tiny by splitting the heavy dashboard, charts, and admin panel into separate chunks. A first-time visitor downloads only the landing chunk; the dashboard code arrives only after they log in.

**Code — Full & Runnable (React / JSX)**

*This is real React component code (runs in the browser / a React app). A Node-runnable logic demo that verifies the same idea follows below.*

// Code splitting: split heavy routes into separate chunks via dynamic import.  
import React, { Suspense, lazy } from "react";  
import { Routes, Route } from "react-router-dom";  
   
// Each lazy() call creates its own JS chunk, loaded only when needed.  
const Home \= lazy(() \=\> import("./Home"));  
const Admin \= lazy(() \=\> import("./Admin"));     // separate chunk  
const Charts \= lazy(() \=\> import("./Charts"));   // separate chunk  
   
export default function App() {  
  return (  
    \<Suspense fallback={\<p\>Loading…\</p\>}\>  
      \<Routes\>  
        \<Route path="/" element={\<Home /\>} /\>  
        \<Route path="/admin" element={\<Admin /\>} /\>  
        \<Route path="/charts" element={\<Charts /\>} /\>  
      \</Routes\>  
    \</Suspense\>  
  );  
}

**Test / Demo & Expected Output (Node-runnable)**

// Code splitting — initial bundle stays small; chunks load on demand  
const chunks \= {  
  main:   { size: 40, modules: \["App", "Home"\] },  
  admin:  { size: 80, modules: \["AdminDashboard"\] },  
  charts: { size: 120, modules: \["HeavyChart"\] },  
};  
let loaded \= new Set(\["main"\]);  
const loadedSize \= () \=\> \[...loaded\].reduce((s, c) \=\> s \+ chunks\[c\].size, 0);  
   
console.log("Initial download (KB):", loadedSize());   // only main  
function navigateTo(chunk){ loaded.add(chunk); console.log(\`Loaded chunk "${chunk}" \-\> total ${loadedSize()}KB\`); }  
   
navigateTo("charts");   // user opens a page that needs the charts chunk  
console.assert(loadedSize() \=== 160, "main+charts loaded");  
console.assert(\!loaded.has("admin"), "admin never loaded for this user");  
console.log("admin chunk loaded?", loaded.has("admin"));  
console.log("All assertions passed.");  
   
/\* \===== EXPECTED OUTPUT \=====  
Initial download (KB): 40  
Loaded chunk "charts" \-\> total 160KB  
admin chunk loaded? false  
All assertions passed.  
\===== END EXPECTED OUTPUT \===== \*/

**Common Follow-up Questions**

**Q: What's the difference between code splitting and lazy loading?**

A: Code splitting is creating separate chunks at build time; lazy loading is fetching a chunk at runtime only when needed. React.lazy does both — it marks a split point and loads it on first render.

**Q: Where should you split?**

A: At natural boundaries like routes and large, rarely-used features (modals, editors, admin). Over-splitting into many tiny chunks adds network overhead.

**Q: Is Suspense required for code splitting?**

A: When using React.lazy, yes — you need a Suspense boundary to show a fallback while the chunk loads.

## **27\. React Router (routing)**

**Simple Explanation**

React Router is the standard library for client-side routing in React single-page apps. It maps URL paths to components and updates the view without a full page reload, using the browser's History API to keep the URL in sync with what's rendered.

You declare routes with \<Routes\> and \<Route\>, navigate with \<Link\> or the useNavigate hook, and read URL data with hooks like useParams and useSearchParams. A catch-all route (path="\*") handles unknown URLs as a 404\.

**Hinglish Explanation**

React Router single-page apps mein client-side routing ke liye standard library hai. Ye URL paths ko components se map karta hai aur bina full reload ke view update karta hai, History API use karke.

Aap \<Routes\> aur \<Route\> se routes declare karte ho, \<Link\> ya useNavigate se navigate karte ho, aur useParams/useSearchParams se URL data padhte ho. path="\*" wala route 404 handle karta hai.

**Key Interview Points**

* Client-side routing: maps URLs to components without full page reloads.

* Core pieces: \<BrowserRouter\>, \<Routes\>, \<Route path element\>.

* Navigate with \<Link\> (declarative) or useNavigate (programmatic).

* Read URL data with useParams (path), useSearchParams (query), useLocation.

* Use path="\*" as a catch-all for 404 pages.

**Real-World Example**

An e-commerce SPA shows the product list at /products, a single product at /products/:id, and the cart at /cart — all without reloading. Clicking a product updates the URL and swaps in the detail component instantly, and the back button still works.

**Code — Full & Runnable (React / JSX)**

*This is real React component code (runs in the browser / a React app). A Node-runnable logic demo that verifies the same idea follows below.*

// React Router: declare routes and navigate between pages.  
import React from "react";  
import { BrowserRouter, Routes, Route, Link } from "react-router-dom";  
   
function Home() { return \<h2\>Home\</h2\>; }  
function About() { return \<h2\>About\</h2\>; }  
function NotFound() { return \<h2\>404 — Not Found\</h2\>; }  
   
export default function App() {  
  return (  
    \<BrowserRouter\>  
      \<nav\>  
        \<Link to="/"\>Home\</Link\> | \<Link to="/about"\>About\</Link\>  
      \</nav\>  
      \<Routes\>  
        \<Route path="/" element={\<Home /\>} /\>  
        \<Route path="/about" element={\<About /\>} /\>  
        \<Route path="\*" element={\<NotFound /\>} /\> {/\* fallback \*/}  
      \</Routes\>  
    \</BrowserRouter\>  
  );  
}

**Test / Demo & Expected Output (Node-runnable)**

// React Router — match a pathname to a route component  
const routes \= \[  
  { path: "/",        component: "Home" },  
  { path: "/about",   component: "About" },  
  { path: "/contact", component: "Contact" },  
\];  
function matchRoute(pathname){  
  const r \= routes.find(r \=\> r.path \=== pathname);  
  return r ? r.component : "NotFound";  
}  
console.log("/        \-\>", matchRoute("/"));  
console.log("/about   \-\>", matchRoute("/about"));  
console.log("/missing \-\>", matchRoute("/missing"));  
console.assert(matchRoute("/about") \=== "About", "about route");  
console.assert(matchRoute("/missing") \=== "NotFound", "fallback 404");  
console.log("All assertions passed.");  
   
/\* \===== EXPECTED OUTPUT \=====  
/        \-\> Home  
/about   \-\> About  
/missing \-\> NotFound  
All assertions passed.  
\===== END EXPECTED OUTPUT \===== \*/

**Common Follow-up Questions**

**Q: How is client-side routing different from server routing?**

A: Server routing returns a new HTML document per URL; client-side routing swaps components in the same loaded page using the History API, so navigation is instant and stateful.

**Q: How do you navigate after an action (e.g., login)?**

A: Use the useNavigate hook: const navigate \= useNavigate(); then navigate('/dashboard'). \<Link\> is for user-clickable navigation.

**Q: How do you handle unknown URLs?**

A: Add a route with path="\*" at the end; it matches anything not matched earlier and can render a 404 page.

## **28\. Nested & dynamic routes**

**Simple Explanation**

Nested routes let a parent route render shared layout (like a sidebar or tab bar) while child routes render inside it through an \<Outlet\>. This mirrors UI nesting in your route config and avoids repeating layout across pages.

Dynamic routes use URL parameters such as /users/:id. The :id segment is a placeholder you read with useParams, so one route definition serves many resources. You can combine both: nested layouts with dynamic child segments.

**Hinglish Explanation**

Nested routes mein parent route shared layout (sidebar, tabs) render karta hai aur child routes uske andar \<Outlet\> ke through aate hain. Isse layout har page par repeat nahi karna padta.

Dynamic routes URL parameters use karte hain jaise /users/:id. :id ek placeholder hai jise useParams se padhte ho, to ek hi route definition kai resources serve karti hai. Dono ko combine bhi kar sakte ho.

**Key Interview Points**

* Nested routes render child routes inside a parent layout via \<Outlet\>.

* Dynamic segments (e.g., :id) capture URL parameters read with useParams.

* One dynamic route definition serves many records (/users/1, /users/2, ...).

* Index routes render at the parent's path when no child segment is present.

* Combine nesting \+ dynamic segments for layouts with detail views.

**Real-World Example**

A dashboard has a persistent sidebar (parent route) and swaps the main panel for /dashboard/overview, /dashboard/reports/:reportId, etc. The sidebar renders once; only the \<Outlet\> content changes as you move between sections and specific reports.

**Code — Full & Runnable (React / JSX)**

*This is real React component code (runs in the browser / a React app). A Node-runnable logic demo that verifies the same idea follows below.*

// Nested & dynamic routes: layout with \<Outlet\> and a :id param.  
import React from "react";  
import { Routes, Route, Outlet, useParams, Link } from "react-router-dom";  
   
function UsersLayout() {  
  return (  
    \<div\>  
      \<h2\>Users\</h2\>  
      \<Link to="/users/42"\>User 42\</Link\>  
      \<Outlet /\> {/\* nested route renders here \*/}  
    \</div\>  
  );  
}  
   
function UserDetail() {  
  const { id } \= useParams();        // read the :id segment  
  return \<p\>Showing user {id}\</p\>;  
}  
   
export default function App() {  
  return (  
    \<Routes\>  
      \<Route path="/users" element={\<UsersLayout /\>}\>  
        \<Route path=":id" element={\<UserDetail /\>} /\> {/\* /users/:id \*/}  
      \</Route\>  
    \</Routes\>  
  );  
}

**Test / Demo & Expected Output (Node-runnable)**

// Nested & dynamic routes — match /users/:id and extract params  
function matchDynamic(pattern, pathname){  
  const pp \= pattern.split("/").filter(Boolean);  
  const ap \= pathname.split("/").filter(Boolean);  
  if (pp.length \!== ap.length) return null;  
  const params \= {};  
  for (let i \= 0; i \< pp.length; i++){  
    if (pp\[i\].startsWith(":")) params\[pp\[i\].slice(1)\] \= ap\[i\];  
    else if (pp\[i\] \!== ap\[i\]) return null;  
  }  
  return params;  
}  
console.log("/users/42       \-\>", matchDynamic("/users/:id", "/users/42"));  
console.log("/users/42/posts/7 \-\>", matchDynamic("/users/:id/posts/:postId", "/users/42/posts/7"));  
console.log("/teams/9        \-\>", matchDynamic("/users/:id", "/teams/9"));  
console.assert(matchDynamic("/users/:id", "/users/42").id \=== "42", "id extracted");  
console.assert(matchDynamic("/users/:id", "/teams/9") \=== null, "no match for different prefix");  
console.log("All assertions passed.");  
   
/\* \===== EXPECTED OUTPUT \=====  
/users/42       \-\> { id: '42' }  
/users/42/posts/7 \-\> { id: '42', postId: '7' }  
/teams/9        \-\> null  
All assertions passed.  
\===== END EXPECTED OUTPUT \===== \*/

**Common Follow-up Questions**

**Q: What does \<Outlet\> do?**

A: It's a placeholder in a parent route's element where the matched child route renders, enabling shared layouts around changing content.

**Q: How do you read a dynamic segment like :id?**

A: Use the useParams hook: const { id } \= useParams(); it returns the URL parameters as strings.

**Q: What's an index route?**

A: A child route with the index prop (no path) that renders at the parent's exact URL — useful for a default view inside a layout.

## **29\. Protected routes**

**Simple Explanation**

A protected route restricts access to authenticated (or authorized) users. Instead of rendering the page, a guard component checks auth state and redirects unauthenticated users to a login page, usually remembering where they were headed so they can return after signing in.

In React Router this is typically a wrapper route that renders an \<Outlet\> when allowed or a \<Navigate to="/login"\> when not. Remember that client-side guards are for UX only — the server must still enforce real authorization on every request.

**Hinglish Explanation**

Protected route sirf authenticated ya authorized users ko access deta hai. Page render karne ke bajaye ek guard component auth state check karta hai aur unauthenticated user ko login page par bhej deta hai, aksar yaad rakhte hue ki wo kahan jaana chahta tha.

React Router mein ye ek wrapper route hota hai jo allowed hone par \<Outlet\> render karta hai, warna \<Navigate to="/login"\>. Yaad rakho: client-side guard sirf UX ke liye hai — real authorization server par hi enforce hoti hai.

**Key Interview Points**

* Guard checks auth/role state and either renders the page or redirects to login.

* Implemented as a wrapper route rendering \<Outlet\> (allowed) or \<Navigate\> (denied).

* Preserve the intended destination (via location state) to redirect back after login.

* Use replace on the redirect so the protected URL doesn't pollute browser history.

* Client guards are UX only — the API must enforce authorization server-side too.

**Real-World Example**

An online banking app wraps every account page in a ProtectedRoute. If a session expires, the user is bounced to /login; after re-authenticating, they land back on the exact page they were viewing thanks to the saved location state.

**Code — Full & Runnable (React / JSX)**

*This is real React component code (runs in the browser / a React app). A Node-runnable logic demo that verifies the same idea follows below.*

// Protected routes: redirect unauthenticated users to /login.  
import React from "react";  
import { Navigate, Outlet, useLocation } from "react-router-dom";  
   
function useAuth() {  
  return { user: null }; // return { user: {...} } when logged in  
}  
   
function ProtectedRoute() {  
  const { user } \= useAuth();  
  const location \= useLocation();  
  if (\!user) {  
    // remember where they were headed so we can return after login  
    return \<Navigate to="/login" replace state={{ from: location }} /\>;  
  }  
  return \<Outlet /\>; // render the protected child routes  
}  
   
export default ProtectedRoute;  
// Usage:  
// \<Route element={\<ProtectedRoute /\>}\>  
//   \<Route path="/dashboard" element={\<Dashboard /\>} /\>  
// \</Route\>

**Test / Demo & Expected Output (Node-runnable)**

// Protected routes — redirect to /login when not authenticated  
function ProtectedRoute({ isAuthed, target }){  
  if (\!isAuthed) return { redirect: "/login", from: target };  
  return { render: target };  
}  
const guest \= ProtectedRoute({ isAuthed: false, target: "/dashboard" });  
const user  \= ProtectedRoute({ isAuthed: true,  target: "/dashboard" });  
console.log("Guest \-\>", JSON.stringify(guest));  
console.log("User  \-\>", JSON.stringify(user));  
console.assert(guest.redirect \=== "/login", "guest redirected");  
console.assert(user.render \=== "/dashboard", "user sees page");  
console.log("All assertions passed.");  
   
/\* \===== EXPECTED OUTPUT \=====  
Guest \-\> {"redirect":"/login","from":"/dashboard"}  
User  \-\> {"render":"/dashboard"}  
All assertions passed.  
\===== END EXPECTED OUTPUT \===== \*/

**Common Follow-up Questions**

**Q: Why aren't client-side route guards enough for security?**

A: Because the client code and data can be inspected and bypassed. Guards improve UX, but the server must independently verify auth on every protected request.

**Q: How do you return users to where they were after login?**

A: Pass the current location in the redirect's state, then after login read it and navigate back: navigate(from || '/').

**Q: Why use replace when redirecting?**

A: So the protected URL doesn't stay in history; otherwise the back button could send the user back to a page they can't access.

## **30\. Role-based UI**

**Simple Explanation**

Role-based UI shows or hides features based on the user's role or permissions — an admin sees delete buttons, a viewer doesn't. This is usually driven by a permissions map and small helper components or hooks like \<Can\> or usePermission.

Like route guards, hiding UI is a usability layer, not a security boundary. The backend must still reject unauthorized actions, because a determined user can re-enable hidden controls in the browser.

**Hinglish Explanation**

Role-based UI user ke role ya permissions ke hisaab se features dikhata ya chhupata hai — admin ko delete button dikhega, viewer ko nahi. Ye aksar ek permissions map aur chhote helper components/hooks (jaise \<Can\>) se hota hai.

Route guards ki tarah, UI chhupana usability ke liye hai, security ke liye nahi. Backend ko phir bhi unauthorized actions reject karne hote hain, kyunki user browser mein chhupe controls wapas enable kar sakta hai.

**Key Interview Points**

* Render features conditionally based on the user's role/permissions.

* Centralize rules in a permissions map; expose via a \<Can\> component or usePermission hook.

* Keeps components clean: \<Can action="delete"\> ... \</Can\> instead of scattered if-checks.

* UI gating is UX only — the server must authorize every sensitive action.

* Combine with route guards: hide the link AND protect the route/endpoint.

**Real-World Example**

In a project-management tool, owners see 'Delete project' and 'Manage billing', members see only 'Leave project'. A single permissions map decides what each role renders, so adding a new role means updating one place, not every component.

**Code — Full & Runnable (React / JSX)**

*This is real React component code (runs in the browser / a React app). A Node-runnable logic demo that verifies the same idea follows below.*

// Role-based UI: show actions according to the user's permissions.  
import React from "react";  
   
const permissions \= {  
  admin: \["view", "edit", "delete"\],  
  editor: \["view", "edit"\],  
  viewer: \["view"\],  
};  
   
function Can({ role, action, children }) {  
  const allowed \= permissions\[role\]?.includes(action);  
  return allowed ? children : null; // render only if permitted  
}  
   
export default function Toolbar({ role }) {  
  return (  
    \<div\>  
      \<Can role={role} action="view"\>\<button\>View\</button\>\</Can\>  
      \<Can role={role} action="edit"\>\<button\>Edit\</button\>\</Can\>  
      \<Can role={role} action="delete"\>\<button\>Delete\</button\>\</Can\>  
    \</div\>  
  );  
}

**Test / Demo & Expected Output (Node-runnable)**

// Role-based UI — show actions based on the user's role/permissions  
const permissions \= {  
  admin:  \["view", "edit", "delete"\],  
  editor: \["view", "edit"\],  
  viewer: \["view"\],  
};  
function can(role, action){ return permissions\[role\]?.includes(action) ?? false; }  
function visibleActions(role){ return \["view", "edit", "delete"\].filter(a \=\> can(role, a)); }  
   
console.log("admin  can:", visibleActions("admin").join(", "));  
console.log("editor can:", visibleActions("editor").join(", "));  
console.log("viewer can:", visibleActions("viewer").join(", "));  
console.assert(\!can("viewer", "delete"), "viewer cannot delete");  
console.assert(can("admin", "delete"), "admin can delete");  
console.log("All assertions passed.");  
   
/\* \===== EXPECTED OUTPUT \=====  
admin  can: view, edit, delete  
editor can: view, edit  
viewer can: view  
All assertions passed.  
\===== END EXPECTED OUTPUT \===== \*/

**Common Follow-up Questions**

**Q: Is hiding a button enough to secure an action?**

A: No. It only prevents accidental use. The API must verify the user's role on the server, since hidden UI can be re-enabled or the endpoint called directly.

**Q: How do you keep role logic maintainable?**

A: Centralize it in a permissions map or policy module and access it via a helper (hook or component) so rules aren't duplicated across the codebase.

**Q: Difference between authentication and authorization here?**

A: Authentication is who you are (logged in); authorization is what you may do (your role/permissions). Role-based UI is about authorization.

## **31\. Context API**

**Simple Explanation**

The Context API lets you share values across the component tree without passing props through every level (avoiding 'prop drilling'). You create a context, wrap part of the tree in its Provider with a value, and any descendant reads it with useContext.

Context is ideal for low-frequency global data like theme, current user, or locale. It's not a full state manager — every consumer re-renders when the value changes, so for frequently updating or large state, pair it with useReducer, split contexts, or reach for a dedicated store.

**Hinglish Explanation**

Context API se aap values poore tree mein share kar sakte ho bina har level par props bheje (prop drilling se bachte ho). Aap context banate ho, tree ka hissa Provider mein wrap karte ho, aur koi bhi descendant useContext se padh leta hai.

Context theme, current user, locale jaise kam-badalne wale global data ke liye best hai. Ye poora state manager nahi hai — value change hone par har consumer re-render hota hai, isliye bade ya bar-bar badalne wale state ke liye context split karo ya dedicated store use karo.

**Key Interview Points**

* Shares data across the tree without prop drilling: createContext \+ Provider \+ useContext.

* Best for stable, global-ish values: theme, auth user, locale, feature flags.

* Every consumer re-renders when the provider's value changes — keep values stable.

* Memoize the provider value (useMemo) to avoid needless re-renders.

* Not a replacement for Redux/Zustand for large or frequently updated state.

**Real-World Example**

A theme toggle stores 'light' or 'dark' in a ThemeContext provider near the app root. Buttons, cards, and headers deep in the tree read the theme directly with useContext — no theme prop is threaded through dozens of intermediate components.

**Code — Full & Runnable (React / JSX)**

*This is real React component code (runs in the browser / a React app). A Node-runnable logic demo that verifies the same idea follows below.*

// Context API: provide a theme once, consume it anywhere without prop drilling.  
import React, { createContext, useContext, useState } from "react";  
   
const ThemeContext \= createContext("light");  
   
function ThemedButton() {  
  const theme \= useContext(ThemeContext); // reads value from nearest Provider  
  return \<button className={\`btn-${theme}\`}\>I am {theme}\</button\>;  
}  
   
function Toolbar() {  
  return \<ThemedButton /\>; // no theme prop passed through here  
}  
   
export default function App() {  
  const \[theme, setTheme\] \= useState("dark");  
  return (  
    \<ThemeContext.Provider value={theme}\>  
      \<button onClick={() \=\> setTheme((t) \=\> (t \=== "dark" ? "light" : "dark"))}\>  
        Toggle theme  
      \</button\>  
      \<Toolbar /\>  
    \</ThemeContext.Provider\>  
  );  
}

**Test / Demo & Expected Output (Node-runnable)**

// Context API — provide a value once, consume it deep without prop drilling  
function createContext(defaultValue){  
  let current \= defaultValue;  
  return {  
    Provider(value){ current \= value; },     // sets the value for consumers  
    useContext(){ return current; },          // any depth reads it directly  
  };  
}  
const ThemeContext \= createContext("light");  
ThemeContext.Provider("dark");                // \<ThemeContext.Provider value="dark"\>  
   
// Deeply nested components just read context, no props passed through:  
function DeepButton(){ return \`Button themed: ${ThemeContext.useContext()}\`; }  
console.log(DeepButton());  
console.assert(ThemeContext.useContext() \=== "dark", "context value provided");  
console.log("All assertions passed.");  
   
/\* \===== EXPECTED OUTPUT \=====  
Button themed: dark  
All assertions passed.  
\===== END EXPECTED OUTPUT \===== \*/

**Common Follow-up Questions**

**Q: When is Context the wrong tool?**

A: For large or rapidly changing state shared widely — because every consumer re-renders on change. Use a dedicated store (Redux/Zustand) or split into smaller contexts.

**Q: How do you prevent unnecessary re-renders from context?**

A: Memoize the provider value with useMemo, split contexts by concern, and keep fast-changing values out of broadly consumed contexts.

**Q: Does Context replace Redux?**

A: For simple global values, often yes. For complex state with middleware, devtools, and many updates, Redux Toolkit is usually a better fit.

## **32\. Redux Toolkit**

**Simple Explanation**

Redux Toolkit (RTK) is the official, recommended way to write Redux. It removes the old boilerplate: configureStore sets up the store with good defaults (thunk middleware, devtools), and createSlice generates actions and reducers together. Immer lets you write 'mutating' reducer code that's actually immutable under the hood.

You connect components with the react-redux Provider and the useSelector/useDispatch hooks. RTK is the standard choice when you need predictable global state with time-travel debugging, middleware, and a single source of truth across many components.

**Hinglish Explanation**

Redux Toolkit (RTK) Redux likhne ka official recommended tarika hai. Ye purana boilerplate hata deta hai: configureStore store ko achhe defaults ke saath set karta hai, aur createSlice actions aur reducers ek saath bana deta hai. Immer ki wajah se aap 'mutating' code likh sakte ho jo andar se immutable hota hai.

Components ko react-redux ke Provider aur useSelector/useDispatch hooks se connect karte ho. Jab predictable global state, devtools aur middleware chahiye to RTK standard choice hai.

**Key Interview Points**

* RTK is the official, batteries-included way to use Redux — far less boilerplate.

* configureStore: store \+ thunk middleware \+ Redux DevTools by default.

* createSlice: define state \+ reducers, get action creators auto-generated.

* Immer lets reducers 'mutate' a draft while producing immutable updates.

* Connect via \<Provider store\>, then useSelector (read) and useDispatch (write).

**Real-World Example**

A multi-step checkout shares cart, shipping, and payment state across many components. RTK holds it in one store: any component reads totals with useSelector and dispatches actions like addItem, and DevTools lets you replay the exact sequence when debugging an order issue.

**Code — Full & Runnable (React / JSX)**

*This is real React component code (runs in the browser / a React app). A Node-runnable logic demo that verifies the same idea follows below.*

// Redux Toolkit: configure a store and connect it with the Provider \+ hooks.  
import React from "react";  
import { configureStore, createSlice } from "@reduxjs/toolkit";  
import { Provider, useSelector, useDispatch } from "react-redux";  
   
const counterSlice \= createSlice({  
  name: "counter",  
  initialState: { value: 0 },  
  reducers: {  
    increment: (state) \=\> { state.value \+= 1; },      // Immer makes this safe  
    incrementBy: (state, action) \=\> { state.value \+= action.payload; },  
  },  
});  
   
const store \= configureStore({ reducer: { counter: counterSlice.reducer } });  
   
function Counter() {  
  const value \= useSelector((s) \=\> s.counter.value);  
  const dispatch \= useDispatch();  
  return (  
    \<div\>  
      \<h2\>{value}\</h2\>  
      \<button onClick={() \=\> dispatch(counterSlice.actions.increment())}\>+1\</button\>  
      \<button onClick={() \=\> dispatch(counterSlice.actions.incrementBy(5))}\>+5\</button\>  
    \</div\>  
  );  
}  
   
export default function App() {  
  return \<Provider store={store}\>\<Counter /\>\</Provider\>;  
}

**Test / Demo & Expected Output (Node-runnable)**

// Redux Toolkit — minimal store: reducer \+ dispatch \+ getState \+ subscribe  
function configureStore(reducer, preloaded){  
  let state \= preloaded;  
  const listeners \= \[\];  
  return {  
    getState: () \=\> state,  
    dispatch: (action) \=\> { state \= reducer(state, action); listeners.forEach(l \=\> l()); },  
    subscribe: (l) \=\> listeners.push(l),  
  };  
}  
function counterReducer(state \= { value: 0 }, action){  
  switch(action.type){  
    case "counter/increment": return { value: state.value \+ 1 };  
    case "counter/incrementBy": return { value: state.value \+ action.payload };  
    default: return state;  
  }  
}  
const store \= configureStore(counterReducer, { value: 0 });  
let renders \= 0;  
store.subscribe(() \=\> renders++);  
store.dispatch({ type: "counter/increment" });  
store.dispatch({ type: "counter/incrementBy", payload: 5 });  
console.log("State:", JSON.stringify(store.getState()));  
console.log("Subscriber notified times:", renders);  
console.assert(store.getState().value \=== 6, "0 \+1 \+5 \= 6");  
console.log("All assertions passed.");  
   
/\* \===== EXPECTED OUTPUT \=====  
State: {"value":6}  
Subscriber notified times: 2  
All assertions passed.  
\===== END EXPECTED OUTPUT \===== \*/

**Common Follow-up Questions**

**Q: Why use Redux Toolkit instead of plain Redux?**

A: It eliminates boilerplate (action types, switch reducers, immutable spreads), bakes in good defaults (thunk, devtools), and uses Immer so reducers are simpler and less error-prone.

**Q: How does Immer help in reducers?**

A: It lets you write code that looks like mutation (state.value \+= 1\) while producing a new immutable state behind the scenes, preventing accidental direct mutation bugs.

**Q: When do you actually need Redux?**

A: When state is global, complex, updated from many places, or benefits from middleware and devtools. For simple local or low-frequency global state, useState/Context may suffice.

## **33\. createSlice**

**Simple Explanation**

createSlice is the heart of Redux Toolkit. You give it a name, an initial state, and a set of reducer functions; it returns a reducer plus automatically generated action creators named after each reducer. This keeps all logic for one feature in a single, cohesive place.

Inside reducers you can write Immer-powered 'mutations' that RTK converts to immutable updates. For async or cross-slice cases, extraReducers handles actions defined elsewhere (like createAsyncThunk results).

**Hinglish Explanation**

createSlice Redux Toolkit ka dil hai. Aap use ek name, initial state aur reducer functions dete ho; ye ek reducer aur har reducer ke naam ke action creators automatically bana deta hai. Ek feature ki saari logic ek jagah rehti hai.

Reducers ke andar aap Immer ki madad se 'mutation' likh sakte ho jise RTK immutable update bana deta hai. Async ya doosre slice ke actions ke liye extraReducers use hota hai.

**Key Interview Points**

* createSlice({ name, initialState, reducers }) returns { reducer, actions }.

* Action creators are generated automatically from the reducer keys.

* Reducer logic uses Immer, so you can write direct 'mutations' on the draft.

* extraReducers responds to actions defined elsewhere (e.g., async thunks).

* Co-locates a feature's state, reducers, and actions in one file.

**Real-World Example**

A todosSlice defines add, remove, and toggle reducers. RTK auto-generates todosSlice.actions.add(...), etc. Components dispatch those creators, and all todo state transitions live in one readable file instead of spread across action and reducer files.

**Code — Full & Runnable (React / JSX)**

*This is real React component code (runs in the browser / a React app). A Node-runnable logic demo that verifies the same idea follows below.*

// createSlice: define state, reducers, and auto-generated actions in one place.  
import { createSlice } from "@reduxjs/toolkit";  
   
const todosSlice \= createSlice({  
  name: "todos",  
  initialState: { items: \[\] },  
  reducers: {  
    // Immer lets us "mutate" the draft; RTK produces immutable updates.  
    add: (state, action) \=\> { state.items.push(action.payload); },  
    remove: (state, action) \=\> {  
      state.items \= state.items.filter((t) \=\> t.id \!== action.payload);  
    },  
    clear: (state) \=\> { state.items \= \[\]; },  
  },  
});  
   
// Action creators are generated automatically from the reducer keys:  
export const { add, remove, clear } \= todosSlice.actions;  
export default todosSlice.reducer;

**Test / Demo & Expected Output (Node-runnable)**

// createSlice — auto-generate action creators \+ a reducer from one config  
function createSlice({ name, initialState, reducers }){  
  const actions \= {};  
  Object.keys(reducers).forEach(key \=\> {  
    actions\[key\] \= (payload) \=\> ({ type: \`${name}/${key}\`, payload });  
  });  
  const reducer \= (state \= initialState, action) \=\> {  
    const key \= action.type.split("/")\[1\];  
    if (action.type.startsWith(name \+ "/") && reducers\[key\]){  
      const draft \= structuredClone(state);  
      reducers\[key\](draft, action);   // mutate the draft (Immer-style)  
      return draft;  
    }  
    return state;  
  };  
  return { actions, reducer };  
}  
const todos \= createSlice({  
  name: "todos",  
  initialState: { items: \[\] },  
  reducers: {  
    add(state, action){ state.items.push(action.payload); },  
    clear(state){ state.items \= \[\]; },  
  },  
});  
console.log("add action:", JSON.stringify(todos.actions.add("Buy milk")));  
let s \= todos.reducer(undefined, todos.actions.add("Buy milk"));  
s \= todos.reducer(s, todos.actions.add("Walk dog"));  
console.log("State after 2 adds:", JSON.stringify(s));  
s \= todos.reducer(s, todos.actions.clear());  
console.log("State after clear:", JSON.stringify(s));  
console.assert(s.items.length \=== 0, "cleared");  
console.log("All assertions passed.");  
   
/\* \===== EXPECTED OUTPUT \=====  
add action: {"type":"todos/add","payload":"Buy milk"}  
State after 2 adds: {"items":\["Buy milk","Walk dog"\]}  
State after clear: {"items":\[\]}  
All assertions passed.  
\===== END EXPECTED OUTPUT \===== \*/

**Common Follow-up Questions**

**Q: Where do the action creators come from?**

A: createSlice generates them from your reducer names — a reducer key 'add' yields slice.actions.add, with the type 'sliceName/add'.

**Q: What is extraReducers for?**

A: Handling actions not defined in this slice's reducers — commonly the pending/fulfilled/rejected actions from createAsyncThunk, or actions shared across slices.

**Q: Can you really mutate state in createSlice reducers?**

A: You mutate an Immer draft, not the real state. RTK uses Immer to turn those mutations into a correct immutable update.

## **34\. Async thunk**

**Simple Explanation**

createAsyncThunk handles asynchronous logic (like API calls) in Redux Toolkit. You give it a type prefix and an async function; it dispatches three lifecycle actions automatically — pending when it starts, fulfilled with the result on success, and rejected with the error on failure.

You handle those actions in a slice's extraReducers to update loading, data, and error state. This standardizes async flows so every request follows the same predictable pattern.

**Hinglish Explanation**

createAsyncThunk Redux Toolkit mein async logic (jaise API calls) handle karta hai. Aap ek type prefix aur async function dete ho; ye teen lifecycle actions automatically dispatch karta hai — start par pending, success par fulfilled (result ke saath), failure par rejected (error ke saath).

In actions ko slice ke extraReducers mein handle karke loading, data aur error state update karte ho. Isse har request ek hi predictable pattern follow karti hai.

**Key Interview Points**

* createAsyncThunk(typePrefix, asyncFn) wraps async logic into a dispatchable thunk.

* Auto-dispatches three actions: pending, fulfilled (payload), rejected (error).

* Handle them in extraReducers to set status/data/error consistently.

* The async function's return value becomes the fulfilled action's payload.

* Throwing (or rejectWithValue) drives the rejected case with error info.

**Real-World Example**

A user profile page dispatches fetchUser(id). The slice flips status to 'loading' on pending, stores the profile on fulfilled, and captures the message on rejected — so the component can show a spinner, the data, or an error with the same three-state pattern every feature uses.

**Code — Full & Runnable (React / JSX)**

*This is real React component code (runs in the browser / a React app). A Node-runnable logic demo that verifies the same idea follows below.*

// Async thunk: createAsyncThunk handles pending/fulfilled/rejected for you.  
import { createAsyncThunk, createSlice } from "@reduxjs/toolkit";  
   
export const fetchUser \= createAsyncThunk("user/fetch", async (id) \=\> {  
  const res \= await fetch(\`/api/users/${id}\`);  
  if (\!res.ok) throw new Error("Failed to load user");  
  return res.json(); // becomes action.payload on fulfilled  
});  
   
const userSlice \= createSlice({  
  name: "user",  
  initialState: { data: null, status: "idle", error: null },  
  reducers: {},  
  extraReducers: (builder) \=\> {  
    builder  
      .addCase(fetchUser.pending, (s) \=\> { s.status \= "loading"; })  
      .addCase(fetchUser.fulfilled, (s, a) \=\> { s.status \= "done"; s.data \= a.payload; })  
      .addCase(fetchUser.rejected, (s, a) \=\> { s.status \= "error"; s.error \= a.error.message; });  
  },  
});  
   
export default userSlice.reducer;

**Test / Demo & Expected Output (Node-runnable)**

// Async thunk — dispatch pending \-\> fulfilled / rejected lifecycle  
function createAsyncThunk(type, payloadCreator){  
  return (arg) \=\> async (dispatch) \=\> {  
    dispatch({ type: \`${type}/pending\` });  
    try {  
      const data \= await payloadCreator(arg);  
      dispatch({ type: \`${type}/fulfilled\`, payload: data });  
    } catch (err) {  
      dispatch({ type: \`${type}/rejected\`, error: err.message });  
    }  
  };  
}  
const fetchUser \= createAsyncThunk("user/fetch", async (id) \=\> {  
  if (id \< 0\) throw new Error("invalid id");  
  return { id, name: "Asha" };  
});  
const dispatched \= \[\];  
const dispatch \= (a) \=\> dispatched.push(a.type);  
   
(async () \=\> {  
  await fetchUser(1)(dispatch);     // success path  
  await fetchUser(-1)(dispatch);    // error path  
  dispatched.forEach(t \=\> console.log(t));  
  console.assert(dispatched.includes("user/fetch/fulfilled"), "success dispatched");  
  console.assert(dispatched.includes("user/fetch/rejected"), "error dispatched");  
  console.log("All assertions passed.");  
})();  
   
/\* \===== EXPECTED OUTPUT \=====  
user/fetch/pending  
user/fetch/fulfilled  
user/fetch/pending  
user/fetch/rejected  
All assertions passed.  
\===== END EXPECTED OUTPUT \===== \*/

**Common Follow-up Questions**

**Q: What three actions does createAsyncThunk dispatch?**

A: pending (started), fulfilled (succeeded, with the returned value as payload), and rejected (failed, with the error).

**Q: How do you handle these in a slice?**

A: In extraReducers, add cases for thunk.pending/fulfilled/rejected to update loading, data, and error fields.

**Q: How do you return a custom error payload?**

A: Use the rejectWithValue helper inside the thunk: return rejectWithValue(serverError), which becomes action.payload on the rejected case.

## **35\. Middleware basics**

**Simple Explanation**

Redux middleware sits between dispatching an action and the moment it reaches the reducer. It's a function with the signature store \=\> next \=\> action \=\> result, letting you intercept, log, transform, delay, or stop actions — this is how thunks, logging, and analytics are implemented.

Middleware runs in a chain: each one calls next(action) to pass control to the next, and finally to the reducer. Redux Toolkit includes thunk and helpful dev checks by default, and you can append your own.

**Hinglish Explanation**

Redux middleware action dispatch hone aur reducer tak pahunchne ke beech baithta hai. Iska signature store \=\> next \=\> action \=\> result hota hai, jisse aap actions ko intercept, log, transform ya delay kar sakte ho — thunks aur logging isi se bante hain.

Middleware ek chain mein chalte hain: har ek next(action) call karke control aage bhejta hai, aakhir mein reducer tak. Redux Toolkit thunk aur dev checks by default deta hai, aur aap apna middleware add kar sakte ho.

**Key Interview Points**

* Middleware intercepts actions between dispatch and the reducer.

* Signature: store \=\> next \=\> action \=\> result (a curried chain).

* Call next(action) to continue the chain; omit it to stop the action.

* Powers thunks (async), logging, analytics, crash reporting, and more.

* RTK adds thunk \+ dev-only checks by default; append yours via the middleware option.

**Real-World Example**

A logging middleware records every dispatched action and the resulting state, which is invaluable for debugging. An analytics middleware can watch for specific actions (like 'order/placed') and fire a tracking event — all without touching reducers or components.

**Code — Full & Runnable (React / JSX)**

*This is real React component code (runs in the browser / a React app). A Node-runnable logic demo that verifies the same idea follows below.*

// Middleware basics: a custom logger middleware sits between dispatch and reducer.  
import { configureStore } from "@reduxjs/toolkit";  
import counterReducer from "./counterSlice";  
   
// Middleware signature: store \=\> next \=\> action \=\> result  
const logger \= (store) \=\> (next) \=\> (action) \=\> {  
  console.log("dispatching:", action.type, "| prev:", store.getState());  
  const result \= next(action);  // pass action to the next middleware/reducer  
  console.log("next state:", store.getState());  
  return result;  
};  
   
export const store \= configureStore({  
  reducer: { counter: counterReducer },  
  // RTK includes thunk \+ dev checks by default; we append our logger.  
  middleware: (getDefault) \=\> getDefault().concat(logger),  
});

**Test / Demo & Expected Output (Node-runnable)**

// Middleware basics — a logger middleware wraps dispatch  
function applyMiddleware(store, ...middlewares){  
  let dispatch \= store.dispatch;  
  const api \= { getState: store.getState, dispatch: (a) \=\> dispatch(a) };  
  middlewares.reverse().forEach(mw \=\> { dispatch \= mw(api)(dispatch); });  
  return { ...store, dispatch };  
}  
const logs \= \[\];  
const logger \= (api) \=\> (next) \=\> (action) \=\> {  
  logs.push(\`before: ${action.type} (state=${api.getState().n})\`);  
  const result \= next(action);  
  logs.push(\`after:  ${action.type} (state=${api.getState().n})\`);  
  return result;  
};  
let state \= { n: 0 };  
const baseStore \= {  
  getState: () \=\> state,  
  dispatch: (a) \=\> { if (a.type \=== "inc") state \= { n: state.n \+ 1 }; return a; },  
};  
const store \= applyMiddleware(baseStore, logger);  
store.dispatch({ type: "inc" });  
logs.forEach(l \=\> console.log(l));  
console.assert(state.n \=== 1, "reducer ran through middleware");  
console.log("All assertions passed.");  
   
/\* \===== EXPECTED OUTPUT \=====  
before: inc (state=0)  
after:  inc (state=1)  
All assertions passed.  
\===== END EXPECTED OUTPUT \===== \*/

**Common Follow-up Questions**

**Q: What does calling next(action) do?**

A: It passes the action to the next middleware in the chain, and eventually to the reducer. If you don't call it, the action is swallowed and never reaches the reducer.

**Q: How are async thunks related to middleware?**

A: The thunk middleware lets you dispatch functions (not just plain objects); it calls them with dispatch and getState, enabling async flows.

**Q: How do you add custom middleware in RTK?**

A: Use configureStore's middleware option: (getDefault) \=\> getDefault().concat(myMiddleware), preserving the built-in defaults.

## **36\. React Query / TanStack Query**

**Simple Explanation**

React Query (TanStack Query) manages server state — data that lives on a backend — separately from UI state. With useQuery you provide a query key and a fetch function, and the library handles caching, deduplication, background refetching, loading and error states, and stale-while-revalidate out of the box.

It dramatically reduces boilerplate compared to manual useEffect \+ useState fetching, and keeps data fresh automatically. The query key uniquely identifies cached data, so the same key shared across components reuses one cached result.

**Hinglish Explanation**

React Query (TanStack Query) server state — backend par rehne wala data — ko UI state se alag manage karta hai. useQuery mein aap ek query key aur fetch function dete ho, aur library caching, deduplication, background refetch, loading/error states sab khud handle karti hai.

Manual useEffect \+ useState fetching ke comparison mein ye bahut kam boilerplate leta hai aur data automatically fresh rakhta hai. Query key cached data ko uniquely identify karti hai, isliye same key wale components ek hi result reuse karte hain.

**Key Interview Points**

* Purpose-built for server state: caching, refetching, dedup, loading/error handling.

* useQuery({ queryKey, queryFn }) returns data, isLoading, isError, and more.

* queryKey identifies cached data; same key \= shared cache, automatic dedup.

* Stale-while-revalidate: show cached data instantly, refetch in the background.

* Replaces hand-rolled useEffect fetching and its many edge cases.

**Real-World Example**

A product page and a mini-cart both need the same product data. With React Query keyed by \['product', id\], they share one cached fetch — no duplicate request — and both update together when the data refetches in the background.

**Code — Full & Runnable (React / JSX)**

*This is real React component code (runs in the browser / a React app). A Node-runnable logic demo that verifies the same idea follows below.*

// React Query: fetch, cache, and auto-refetch server state with useQuery.  
import React from "react";  
import { useQuery } from "@tanstack/react-query";  
   
async function fetchUser(id) {  
  const res \= await fetch(\`/api/users/${id}\`);  
  if (\!res.ok) throw new Error("Network error");  
  return res.json();  
}  
   
export default function Profile({ id }) {  
  const { data, isLoading, isError, error } \= useQuery({  
    queryKey: \["user", id\],        // cache key (dedupes \+ caches by id)  
    queryFn: () \=\> fetchUser(id),  
    staleTime: 5000,               // treat data as fresh for 5s (no refetch)  
  });  
   
  if (isLoading) return \<p\>Loading…\</p\>;  
  if (isError) return \<p\>Error: {error.message}\</p\>;  
  return \<h2\>{data.name}\</h2\>;  
}

**Test / Demo & Expected Output (Node-runnable)**

// React Query / TanStack Query — cache \+ dedupe \+ staleTime  
function createQueryClient(){  
  const cache \= new Map();  
  let fetches \= 0;  
  async function fetchQuery(key, fn, { staleTime \= 0 } \= {}){  
    const entry \= cache.get(key);  
    const fresh \= entry && (Date.now() \- entry.time) \< staleTime;  
    if (fresh) return entry.data;            // serve from cache, no fetch  
    fetches++;  
    const data \= await fn();  
    cache.set(key, { data, time: Date.now() });  
    return data;  
  }  
  return { fetchQuery, fetchCount: () \=\> fetches };  
}  
(async () \=\> {  
  const qc \= createQueryClient();  
  const getUser \= () \=\> Promise.resolve({ name: "Asha" });  
  await qc.fetchQuery("user", getUser, { staleTime: 5000 });  // network  
  await qc.fetchQuery("user", getUser, { staleTime: 5000 });  // cached (fresh)  
  console.log("Fetches made:", qc.fetchCount());  
  console.assert(qc.fetchCount() \=== 1, "second call served from cache");  
  console.log("All assertions passed.");  
})();  
   
/\* \===== EXPECTED OUTPUT \=====  
Fetches made: 1  
All assertions passed.  
\===== END EXPECTED OUTPUT \===== \*/

**Common Follow-up Questions**

**Q: What problem does React Query solve over useEffect fetching?**

A: It handles caching, deduplication, background refetch, retries, and loading/error states automatically — eliminating the boilerplate and bugs of manual data fetching.

**Q: What is the query key for?**

A: It uniquely identifies a piece of server data in the cache. The same key dedupes requests and shares cached results across components.

**Q: What is stale-while-revalidate?**

A: React Query shows cached (possibly stale) data immediately for a snappy UI, then refetches in the background and updates when fresh data arrives.

## **37\. API caching**

**Simple Explanation**

API caching stores responses so repeated requests for the same data are served instantly instead of hitting the network again. React Query handles this with two key timings: staleTime controls how long data is considered fresh (no refetch), and gcTime (cache time) controls how long unused data stays in the cache before being garbage-collected.

Good caching balances freshness and performance: too-aggressive caching shows stale data; too-little wastes bandwidth and re-renders. The queryKey is the cache identity, so designing keys well (including parameters) is essential.

**Hinglish Explanation**

API caching responses ko store karta hai taaki same data ke liye dobara network call na ho, instantly mil jaye. React Query do timings se ise handle karta hai: staleTime batata hai data kitni der fresh maana jaye, aur gcTime batata hai unused data kitni der cache mein rahe.

Achha caching freshness aur performance balance karta hai: zyada aggressive caching stale data dikhata hai; bahut kam bandwidth waste karta hai. queryKey cache ki identity hai, isliye keys (parameters ke saath) sahi design karna zaroori hai.

**Key Interview Points**

* Cache responses to serve repeated requests instantly and cut network calls.

* staleTime: how long data stays 'fresh' before a refetch is considered.

* gcTime (cacheTime): how long unused cached data is kept before cleanup.

* queryKey defines cache identity — include all params that change the result.

* Tune per data type: rarely-changing data \= long staleTime; live data \= short.

**Real-World Example**

A list of countries rarely changes, so caching it with a long staleTime means it loads once and reuses the cache for the whole session. A live order status, by contrast, gets a short staleTime so it refetches often and stays accurate.

**Code — Full & Runnable (React / JSX)**

*This is real React component code (runs in the browser / a React app). A Node-runnable logic demo that verifies the same idea follows below.*

// API caching: queryKey \+ staleTime control how React Query reuses data.  
import React from "react";  
import { useQuery } from "@tanstack/react-query";  
   
export default function ProductList() {  
  const { data \= \[\] } \= useQuery({  
    queryKey: \["products"\],  
    queryFn: () \=\> fetch("/api/products").then((r) \=\> r.json()),  
    staleTime: 60\_000,      // fresh for 1 min: navigating back shows cached data instantly  
    gcTime: 5 \* 60\_000,     // keep unused cache for 5 min before garbage collection  
  });  
   
  // Components mounting with the same queryKey share this cached result —  
  // no duplicate network request while the data is fresh.  
  return \<ul\>{data.map((p) \=\> \<li key={p.id}\>{p.name}\</li\>)}\</ul\>;  
}

**Test / Demo & Expected Output (Node-runnable)**

// API caching — TTL cache with hit/miss accounting  
function ttlCache(ttlMs){  
  const store \= new Map();  
  let hits \= 0, misses \= 0;  
  return {  
    async get(key, loader){  
      const e \= store.get(key);  
      if (e && (Date.now() \- e.t) \< ttlMs){ hits++; return e.v; }  
      misses++; const v \= await loader(); store.set(key, { v, t: Date.now() }); return v;  
    },  
    stats: () \=\> ({ hits, misses }),  
  };  
}  
(async () \=\> {  
  const cache \= ttlCache(1000);  
  const load \= (id) \=\> Promise.resolve(\`product-${id}\`);  
  console.log(await cache.get("p1", () \=\> load(1)));   // miss  
  console.log(await cache.get("p1", () \=\> load(1)));   // hit  
  console.log(await cache.get("p2", () \=\> load(2)));   // miss  
  console.log("Stats:", JSON.stringify(cache.stats()));  
  console.assert(cache.stats().hits \=== 1, "one cache hit");  
  console.log("All assertions passed.");  
})();  
   
/\* \===== EXPECTED OUTPUT \=====  
product-1  
product-1  
product-2  
Stats: {"hits":1,"misses":2}  
All assertions passed.  
\===== END EXPECTED OUTPUT \===== \*/

**Common Follow-up Questions**

**Q: Difference between staleTime and gcTime?**

A: staleTime is how long data is treated as fresh (no refetch). gcTime is how long unused/inactive cached data lingers before being removed from memory.

**Q: Why must query keys include parameters?**

A: Because the key is the cache identity. \['user', id\] caches per user; omitting id would collide different users into one cache entry.

**Q: How do you force fresh data after a mutation?**

A: Invalidate the relevant query keys (queryClient.invalidateQueries) so React Query refetches them.

## **38\. Optimistic updates**

**Simple Explanation**

An optimistic update applies a change to the UI immediately — before the server confirms it — assuming the request will succeed. This makes the app feel instant. If the request fails, you roll back to the previous state so the UI stays consistent with reality.

In React Query you implement this in a mutation's lifecycle: onMutate snapshots the current cache and applies the optimistic change, onError restores the snapshot, and onSettled refetches to sync with the server's true state.

**Hinglish Explanation**

Optimistic update UI mein change turant laga deta hai — server confirm karne se pehle — ye maan kar ki request safal hogi. Isse app instant lagta hai. Agar request fail ho jaye to purani state par rollback kar dete ho.

React Query mein ye mutation ke lifecycle se hota hai: onMutate current cache snapshot le kar optimistic change lagata hai, onError snapshot wapas laata hai, aur onSettled refetch karke server ki sahi state se sync karta hai.

**Key Interview Points**

* Apply the change in the UI immediately; assume success for a snappy feel.

* On failure, roll back to the pre-update snapshot to stay consistent.

* React Query: onMutate (snapshot \+ apply), onError (rollback), onSettled (refetch).

* Cancel in-flight queries in onMutate so they don't overwrite your optimistic data.

* Best for high-confidence, low-risk actions (likes, toggles, reordering).

**Real-World Example**

Liking a post updates the heart icon and count the instant you tap, without waiting for the server. If the network call fails, the like silently reverts — the user gets immediate feedback in the common case and correctness in the rare failure.

**Code — Full & Runnable (React / JSX)**

*This is real React component code (runs in the browser / a React app). A Node-runnable logic demo that verifies the same idea follows below.*

// Optimistic updates: update the UI immediately, roll back if the request fails.  
import { useMutation, useQueryClient } from "@tanstack/react-query";  
   
export function useAddTodo() {  
  const qc \= useQueryClient();  
  return useMutation({  
    mutationFn: (todo) \=\> fetch("/api/todos", { method: "POST", body: JSON.stringify(todo) }),  
    onMutate: async (newTodo) \=\> {  
      await qc.cancelQueries({ queryKey: \["todos"\] });  
      const previous \= qc.getQueryData(\["todos"\]);          // snapshot  
      qc.setQueryData(\["todos"\], (old \= \[\]) \=\> \[...old, newTodo\]); // optimistic  
      return { previous };  
    },  
    onError: (\_err, \_newTodo, context) \=\> {  
      qc.setQueryData(\["todos"\], context.previous);          // rollback  
    },  
    onSettled: () \=\> qc.invalidateQueries({ queryKey: \["todos"\] }), // resync  
  });  
}

**Test / Demo & Expected Output (Node-runnable)**

// Optimistic updates — apply immediately, roll back if the request fails  
async function optimisticUpdate(list, item, save){  
  const snapshot \= \[...list\];          // remember previous state  
  list.push(item);                     // optimistic: show it now  
  try { await save(item); return { list, status: "confirmed" }; }  
  catch (e) { return { list: snapshot, status: "rolled back: " \+ e.message }; }  
}  
(async () \=\> {  
  let todos \= \["A", "B"\];  
  let r1 \= await optimisticUpdate(todos, "C", () \=\> Promise.resolve());  
  console.log("After success:", r1.list.join(","), "-", r1.status);  
   
  todos \= \["A", "B"\];  
  let r2 \= await optimisticUpdate(todos, "C", () \=\> Promise.reject(new Error("network")));  
  console.log("After failure:", r2.list.join(","), "-", r2.status);  
  console.assert(r2.list.length \=== 2, "rolled back to previous state");  
  console.log("All assertions passed.");  
})();  
   
/\* \===== EXPECTED OUTPUT \=====  
After success: A,B,C \- confirmed  
After failure: A,B \- rolled back: network  
All assertions passed.  
\===== END EXPECTED OUTPUT \===== \*/

**Common Follow-up Questions**

**Q: Why snapshot the previous state in onMutate?**

A: So you can roll back to it in onError if the request fails, keeping the UI consistent with the server.

**Q: When should you avoid optimistic updates?**

A: For high-stakes or likely-to-fail actions (payments, irreversible changes) where showing unconfirmed success could mislead the user.

**Q: What does onSettled do?**

A: Runs after success or failure; it typically invalidates/refetches the query to reconcile the UI with the server's actual state.

## **39\. Pagination**

**Simple Explanation**

Pagination splits a large dataset into pages so you fetch and render a manageable slice at a time. The client tracks the current page (and page size), requests just that page, and shows controls to move between pages — keeping payloads small and the UI responsive.

With React Query, each page is its own cached query (keyed by page number). Using keepPreviousData/placeholderData keeps the current page visible while the next one loads, avoiding a jarring empty flash between pages.

**Hinglish Explanation**

Pagination bade dataset ko pages mein tod deta hai taaki ek baar mein manageable slice fetch aur render ho. Client current page aur page size track karta hai, sirf wahi page maangta hai, aur pages ke beech move karne ke controls dikhata hai.

React Query mein har page apni cached query hoti hai (page number se keyed). keepPreviousData/placeholderData se current page dikhta rehta hai jab tak agla load ho, beech mein khaali flash nahi aata.

**Key Interview Points**

* Fetch and render one page (offset/limit or cursor) at a time, not the whole set.

* Track current page \+ page size; request only that slice.

* React Query keys each page separately, caching them independently.

* keepPreviousData avoids an empty flash while the next page loads.

* Two styles: offset-based (page numbers) and cursor-based (next-token).

**Real-World Example**

An admin user table with 50,000 rows loads 25 at a time. The page number is part of the query key, so revisiting page 3 is instant from cache, and the table stays on screen while the next page fetches in the background.

**Code — Full & Runnable (React / JSX)**

*This is real React component code (runs in the browser / a React app). A Node-runnable logic demo that verifies the same idea follows below.*

// Pagination: keep page state and request one page at a time.  
import React, { useState } from "react";  
import { useQuery, keepPreviousData } from "@tanstack/react-query";  
   
export default function Products() {  
  const \[page, setPage\] \= useState(1);  
  const { data } \= useQuery({  
    queryKey: \["products", page\],  
    queryFn: () \=\> fetch(\`/api/products?page=${page}\`).then((r) \=\> r.json()),  
    placeholderData: keepPreviousData, // keep old page visible while next loads  
  });  
   
  return (  
    \<div\>  
      \<ul\>{data?.items.map((p) \=\> \<li key={p.id}\>{p.name}\</li\>)}\</ul\>  
      \<button disabled={page \=== 1} onClick={() \=\> setPage((p) \=\> p \- 1)}\>Prev\</button\>  
      \<span\> Page {page} of {data?.totalPages} \</span\>  
      \<button disabled={page \=== data?.totalPages} onClick={() \=\> setPage((p) \=\> p \+ 1)}\>Next\</button\>  
    \</div\>  
  );  
}

**Test / Demo & Expected Output (Node-runnable)**

// Pagination — slice a dataset into pages  
function paginate(items, page, pageSize){  
  const total \= items.length;  
  const totalPages \= Math.ceil(total / pageSize);  
  const start \= (page \- 1\) \* pageSize;  
  return { page, totalPages, data: items.slice(start, start \+ pageSize) };  
}  
const items \= Array.from({ length: 23 }, (\_, i) \=\> i \+ 1);  
const p1 \= paginate(items, 1, 10);  
const p3 \= paginate(items, 3, 10);  
console.log("Page 1:", p1.data.join(","), "| totalPages:", p1.totalPages);  
console.log("Page 3:", p3.data.join(","));  
console.assert(p1.data.length \=== 10 && p3.data.length \=== 3, "page sizes correct");  
console.assert(p1.totalPages \=== 3, "23 items / 10 \= 3 pages");  
console.log("All assertions passed.");  
   
/\* \===== EXPECTED OUTPUT \=====  
Page 1: 1,2,3,4,5,6,7,8,9,10 | totalPages: 3  
Page 3: 21,22,23  
All assertions passed.  
\===== END EXPECTED OUTPUT \===== \*/

**Common Follow-up Questions**

**Q: Offset vs cursor pagination — what's the difference?**

A: Offset uses page numbers/limit-offset (simple, but can skip/duplicate rows if data changes). Cursor uses a pointer to the last item (stable for live data, slightly more complex).

**Q: How do you avoid a blank screen between pages?**

A: Use keepPreviousData (placeholderData) in React Query so the current page stays visible until the next page's data arrives.

**Q: Why cache each page separately?**

A: So navigating back to a previously viewed page is instant from cache instead of refetching.

## **40\. Infinite queries**

**Simple Explanation**

Infinite queries power 'load more' and infinite-scroll experiences by fetching pages sequentially and accumulating them into one growing list. Instead of replacing data per page, each fetch appends the next page, using a cursor or next-page parameter returned by the previous response.

React Query's useInfiniteQuery manages the accumulated pages, exposes fetchNextPage and hasNextPage, and computes the next cursor via getNextPageParam. It's the natural fit for feeds, chat history, and search results.

**Hinglish Explanation**

Infinite queries 'load more' aur infinite-scroll ke liye hain — pages ek-ek karke fetch karke ek badhti hui list mein jodte jaate hain. Har fetch agla page append karta hai, pichhle response se mile cursor/next-page parameter ka use karke.

React Query ka useInfiniteQuery accumulated pages manage karta hai, fetchNextPage aur hasNextPage deta hai, aur getNextPageParam se next cursor nikalta hai. Feeds, chat history, search results ke liye perfect hai.

**Key Interview Points**

* Append pages into one growing list (vs. replacing per page in pagination).

* useInfiniteQuery accumulates pages and exposes fetchNextPage/hasNextPage.

* getNextPageParam reads the next cursor/token from the last page.

* Flatten data.pages to render the combined list.

* Ideal for infinite scroll and 'load more' feeds, chat, and search.

**Real-World Example**

A social feed loads 10 posts, then fetches the next 10 each time the user nears the bottom (or clicks 'Load more'). Posts accumulate seamlessly, and React Query stops requesting once getNextPageParam returns null — the end of the feed.

**Code — Full & Runnable (React / JSX)**

*This is real React component code (runs in the browser / a React app). A Node-runnable logic demo that verifies the same idea follows below.*

// Infinite queries: load more pages with a cursor and a "Load more" button.  
import React from "react";  
import { useInfiniteQuery } from "@tanstack/react-query";  
   
export default function Feed() {  
  const { data, fetchNextPage, hasNextPage, isFetchingNextPage } \= useInfiniteQuery({  
    queryKey: \["feed"\],  
    queryFn: ({ pageParam \= 0 }) \=\>  
      fetch(\`/api/feed?cursor=${pageParam}\`).then((r) \=\> r.json()),  
    initialPageParam: 0,  
    getNextPageParam: (lastPage) \=\> lastPage.nextCursor, // null \= no more pages  
  });  
   
  const items \= data?.pages.flatMap((p) \=\> p.items) ?? \[\];  
  return (  
    \<div\>  
      \<ul\>{items.map((it) \=\> \<li key={it.id}\>{it.text}\</li\>)}\</ul\>  
      {hasNextPage && (  
        \<button onClick={() \=\> fetchNextPage()} disabled={isFetchingNextPage}\>  
          {isFetchingNextPage ? "Loading…" : "Load more"}  
        \</button\>  
      )}  
    \</div\>  
  );  
}

**Test / Demo & Expected Output (Node-runnable)**

// Infinite queries — fetch pages by cursor and accumulate results  
async function fetchPage(cursor){  
  const pageSize \= 3, all \= Array.from({ length: 8 }, (\_, i) \=\> \`item${i \+ 1}\`);  
  const start \= cursor ?? 0;  
  const data \= all.slice(start, start \+ pageSize);  
  const nextCursor \= start \+ pageSize \< all.length ? start \+ pageSize : null;  
  return { data, nextCursor };  
}  
(async () \=\> {  
  let cursor \= 0, accumulated \= \[\], pages \= 0;  
  do {  
    const page \= await fetchPage(cursor);  
    accumulated.push(...page.data);  
    cursor \= page.nextCursor; pages++;  
    console.log(\`Loaded page ${pages}: \[${page.data.join(", ")}\] nextCursor=${cursor}\`);  
  } while (cursor \!== null);  
  console.log("Total items:", accumulated.length);  
  console.assert(accumulated.length \=== 8, "all items loaded across pages");  
  console.log("All assertions passed.");  
})();  
   
/\* \===== EXPECTED OUTPUT \=====  
Loaded page 1: \[item1, item2, item3\] nextCursor=3  
Loaded page 2: \[item4, item5, item6\] nextCursor=6  
Loaded page 3: \[item7, item8\] nextCursor=null  
Total items: 8  
All assertions passed.  
\===== END EXPECTED OUTPUT \===== \*/

**Common Follow-up Questions**

**Q: How do infinite queries differ from pagination?**

A: Pagination shows one page at a time and replaces data; infinite queries accumulate pages into a single ever-growing list for scroll/'load more' UIs.

**Q: How does React Query know if more pages exist?**

A: Via getNextPageParam: it derives the next cursor from the last page; returning undefined/null signals there are no more pages (hasNextPage becomes false).

**Q: How do you render all loaded items?**

A: Flatten the pages: data.pages.flatMap(p \=\> p.items), then map over the combined array.

## **41\. API layer setup**

**Simple Explanation**

An API layer centralizes how your app talks to the backend: one configured HTTP client (often an axios instance) with a base URL, default headers, timeouts, and interceptors. Feature code calls small typed functions like getUsers() instead of scattering fetch calls and URLs everywhere.

Interceptors are the key benefit: a request interceptor can attach the auth token to every call, and a response interceptor can unwrap data or handle 401s globally. This keeps cross-cutting concerns in one place and makes the app easier to maintain.

**Hinglish Explanation**

API layer centralize karta hai ki app backend se kaise baat kare: ek configured HTTP client (aksar axios instance) jisme base URL, default headers, timeouts aur interceptors hote hain. Feature code getUsers() jaise chhote functions call karta hai, har jagah fetch aur URLs nahi bikherta.

Interceptors ka main fayda: request interceptor har call par auth token laga sakta hai, aur response interceptor data unwrap ya 401 globally handle kar sakta hai. Isse cross-cutting concerns ek jagah rehte hain.

**Key Interview Points**

* Centralize backend communication in one configured client (e.g., an axios instance).

* Set base URL, default headers, and timeouts once, reused everywhere.

* Request interceptors attach auth tokens; response interceptors unwrap/normalize and handle errors.

* Expose small functions (getUsers, createOrder) so features don't touch raw URLs.

* Easier to change base URLs, add logging, or handle 401s in a single place.

**Real-World Example**

Across a large app, every authenticated request needs a Bearer token and should redirect to login on 401\. A single axios instance with interceptors handles both, so no component ever manually sets the auth header or checks for 401 again.

**Code — Full & Runnable (React / JSX)**

*This is real React component code (runs in the browser / a React app). A Node-runnable logic demo that verifies the same idea follows below.*

// API layer setup: one configured axios instance \+ interceptors, reused app-wide.  
import axios from "axios";  
   
export const api \= axios.create({  
  baseURL: import.meta.env.VITE\_API\_URL, // single source for the base URL  
  timeout: 10000,  
});  
   
// Request interceptor: attach the auth token to every request.  
api.interceptors.request.use((config) \=\> {  
  const token \= localStorage.getItem("token");  
  if (token) config.headers.Authorization \= \`Bearer ${token}\`;  
  return config;  
});  
   
// Response interceptor: unwrap data and handle 401 centrally.  
api.interceptors.response.use(  
  (res) \=\> res.data,  
  (error) \=\> {  
    if (error.response?.status \=== 401\) window.location.href \= "/login";  
    return Promise.reject(error);  
  }  
);  
   
// Feature code just imports \`api\` and calls endpoints:  
export const getUsers \= () \=\> api.get("/users");

**Test / Demo & Expected Output (Node-runnable)**

// API layer setup — a tiny client with baseURL \+ interceptors  
function createClient({ baseURL, headers \= {} }){  
  const reqInterceptors \= \[\], resInterceptors \= \[\];  
  async function request(path, options \= {}){  
    let cfg \= { url: baseURL \+ path, headers: { ...headers, ...options.headers }, ...options };  
    for (const i of reqInterceptors) cfg \= i(cfg);          // e.g. attach auth token  
    let res \= { ok: true, data: { path: cfg.url, auth: cfg.headers.Authorization } };  
    for (const i of resInterceptors) res \= i(res);          // e.g. unwrap/normalize  
    return res;  
  }  
  return {  
    request,  
    useRequestInterceptor: (fn) \=\> reqInterceptors.push(fn),  
    useResponseInterceptor: (fn) \=\> resInterceptors.push(fn),  
  };  
}  
(async () \=\> {  
  const api \= createClient({ baseURL: "https://api.app.com" });  
  api.useRequestInterceptor(cfg \=\> { cfg.headers.Authorization \= "Bearer TOKEN"; return cfg; });  
  api.useResponseInterceptor(res \=\> ({ ...res, data: { ...res.data, normalized: true } }));  
  const res \= await api.request("/users");  
  console.log("URL:", res.data.path);  
  console.log("Auth header injected:", res.data.auth);  
  console.log("Response normalized:", res.data.normalized);  
  console.assert(res.data.auth \=== "Bearer TOKEN", "interceptor attached token");  
  console.log("All assertions passed.");  
})();  
   
/\* \===== EXPECTED OUTPUT \=====  
URL: https://api.app.com/users  
Auth header injected: Bearer TOKEN  
Response normalized: true  
All assertions passed.  
\===== END EXPECTED OUTPUT \===== \*/

**Common Follow-up Questions**

**Q: Why centralize API calls instead of using fetch inline?**

A: To avoid duplicating base URLs, headers, and error handling. A central client makes auth, logging, and error policies consistent and easy to change.

**Q: What do interceptors do?**

A: Request interceptors modify outgoing requests (e.g., add tokens); response interceptors transform responses or handle errors (e.g., refresh tokens, redirect on 401\) globally.

**Q: How does this fit with React Query?**

A: React Query handles caching/state; the API layer provides the queryFn functions it calls. They complement each other — transport layer vs. server-state layer.

## **42\. Form validation**

**Simple Explanation**

Form validation checks user input against rules — required fields, formats (email), length, ranges — and surfaces clear errors. You can validate on change, on blur, or on submit; live validation gives instant feedback, while submit validation avoids nagging users mid-typing.

Validation can be hand-written per field or driven by a schema (e.g., Zod or Yup) that describes the whole form declaratively. Schemas are reusable, can be shared with the backend, and keep rules in one tidy place.

**Hinglish Explanation**

Form validation user input ko rules ke against check karta hai — required fields, format (email), length, range — aur clear errors dikhata hai. Aap change, blur ya submit par validate kar sakte ho; live validation instant feedback deta hai, submit validation typing ke beech tang nahi karta.

Validation har field ke liye haath se likhi ja sakti hai ya schema (Zod/Yup) se driven ho sakti hai jo poore form ko declaratively describe karti hai. Schemas reusable hote hain aur rules ek jagah rakhte hain.

**Key Interview Points**

* Check input against rules (required, format, length, range) and show clear errors.

* Timing options: on-change (live), on-blur, or on-submit — choose for good UX.

* Schema validation (Zod/Yup) describes the whole form declaratively and reusably.

* Disable submit until valid, and show one helpful message per field.

* Always re-validate on the server — client validation is for UX, not security.

**Real-World Example**

A signup form validates email format and password length as the user types, showing inline hints, and keeps the submit button disabled until everything passes. The same Zod schema runs on the server to reject malformed requests defensively.

**Code — Full & Runnable (React / JSX)**

*This is real React component code (runs in the browser / a React app). A Node-runnable logic demo that verifies the same idea follows below.*

// Form validation: validate on change and show per-field errors.  
import React, { useState } from "react";  
   
const validators \= {  
  email: (v) \=\> (/^\[^@\]+@\[^@\]+\\.\[^@\]+$/.test(v) ? "" : "Invalid email"),  
  password: (v) \=\> (v.length \>= 8 ? "" : "Min 8 characters"),  
};  
   
export default function SignupForm() {  
  const \[values, setValues\] \= useState({ email: "", password: "" });  
  const \[errors, setErrors\] \= useState({});  
   
  const handleChange \= (e) \=\> {  
    const { name, value } \= e.target;  
    setValues((v) \=\> ({ ...v, \[name\]: value }));  
    setErrors((err) \=\> ({ ...err, \[name\]: validators\[name\](value) }));  
  };  
   
  const isValid \= Object.values(errors).every((e) \=\> \!e) && values.email && values.password;  
   
  return (  
    \<form\>  
      \<input name="email" value={values.email} onChange={handleChange} /\>  
      {errors.email && \<span\>{errors.email}\</span\>}  
      \<input name="password" type="password" value={values.password} onChange={handleChange} /\>  
      {errors.password && \<span\>{errors.password}\</span\>}  
      \<button disabled={\!isValid}\>Sign up\</button\>  
    \</form\>  
  );  
}

**Test / Demo & Expected Output (Node-runnable)**

// Form validation — a schema-style validator returning field errors  
function validate(values, rules){  
  const errors \= {};  
  for (const field in rules){  
    for (const rule of rules\[field\]){  
      const msg \= rule(values\[field\], values);  
      if (msg){ errors\[field\] \= msg; break; }   // first error per field  
    }  
  }  
  return { valid: Object.keys(errors).length \=== 0, errors };  
}  
const required \= (v) \=\> (v ? null : "Required");  
const email    \= (v) \=\> (/^\[^@\]+@\[^@\]+\\.\[^@\]+$/.test(v) ? null : "Invalid email");  
const min \= (n) \=\> (v) \=\> (v && v.length \>= n ? null : \`Min ${n} chars\`);  
   
const rules \= { email: \[required, email\], password: \[required, min(8)\] };  
console.log(JSON.stringify(validate({ email: "bad", password: "123" }, rules)));  
console.log(JSON.stringify(validate({ email: "a@b.com", password: "longenough" }, rules)));  
const bad \= validate({ email: "bad", password: "123" }, rules);  
console.assert(\!bad.valid && bad.errors.email \=== "Invalid email", "email error reported");  
console.log("All assertions passed.");  
   
/\* \===== EXPECTED OUTPUT \=====  
{"valid":false,"errors":{"email":"Invalid email","password":"Min 8 chars"}}  
{"valid":true,"errors":{}}  
All assertions passed.  
\===== END EXPECTED OUTPUT \===== \*/

**Common Follow-up Questions**

**Q: When should validation run — on change or on submit?**

A: A common pattern is on-blur or on-change after first interaction for instant feedback, plus a final check on submit. Validating every keystroke from the start can feel naggy.

**Q: Why use a schema library like Zod?**

A: It centralizes rules declaratively, is reusable across client and server, infers types, and reduces ad-hoc per-field validation code.

**Q: Is client-side validation enough?**

A: No. It improves UX but can be bypassed. The server must validate every request independently.

## **43\. React Hook Form**

**Simple Explanation**

React Hook Form (RHF) is a popular form library that minimizes re-renders by using uncontrolled inputs and refs under the hood. You register inputs with the register function, handle submission with handleSubmit, and read errors from formState — with very little boilerplate.

Because inputs are uncontrolled, typing doesn't re-render the whole form on every keystroke, which keeps large forms fast. RHF integrates with schema validators (Zod/Yup) via resolvers for declarative validation.

**Hinglish Explanation**

React Hook Form (RHF) ek popular form library hai jo uncontrolled inputs aur refs use karke re-renders kam karti hai. Aap inputs ko register se register karte ho, submission handleSubmit se handle karte ho, aur errors formState se padhte ho — bahut kam boilerplate ke saath.

Inputs uncontrolled hone ki wajah se har keystroke par poora form re-render nahi hota, isliye bade forms fast rehte hain. RHF schema validators (Zod/Yup) ke saath resolvers ke through integrate hoti hai.

**Key Interview Points**

* Minimizes re-renders by using uncontrolled inputs \+ refs internally.

* Core API: register (wire inputs), handleSubmit (validate \+ submit), formState.errors.

* Built-in rules (required, minLength, pattern) plus messages.

* Integrates with Zod/Yup via resolvers for schema validation.

* Great for large/complex forms where controlled inputs would re-render too much.

**Real-World Example**

A multi-field onboarding form (name, email, password, address) stays fast with RHF because keystrokes don't re-render the entire form. register wires each field, handleSubmit validates everything at once, and errors render inline only where needed.

**Code — Full & Runnable (React / JSX)**

*This is real React component code (runs in the browser / a React app). A Node-runnable logic demo that verifies the same idea follows below.*

// React Hook Form: register fields and validate with minimal re-renders.  
import React from "react";  
import { useForm } from "react-hook-form";  
   
export default function LoginForm() {  
  const { register, handleSubmit, formState: { errors } } \= useForm();  
   
  const onSubmit \= (data) \=\> console.log("Submitted:", data);  
   
  return (  
    \<form onSubmit={handleSubmit(onSubmit)}\>  
      \<input {...register("email", { required: "Email is required" })} /\>  
      {errors.email && \<span\>{errors.email.message}\</span\>}  
   
      \<input  
        type="password"  
        {...register("password", { required: true, minLength: { value: 8, message: "Too short" } })}  
      /\>  
      {errors.password && \<span\>{errors.password.message}\</span\>}  
   
      \<button type="submit"\>Log in\</button\>  
    \</form\>  
  );  
}

**Test / Demo & Expected Output (Node-runnable)**

// React Hook Form — register \+ handleSubmit logic (uncontrolled \+ validate)  
function useForm(){  
  const fields \= {};                       // refs by name (uncontrolled)  
  const rules \= {};  
  function register(name, opts \= {}){ fields\[name\] \= { value: "" }; rules\[name\] \= opts; return name; }  
  function setValue(name, value){ fields\[name\].value \= value; }   // simulates user typing  
  function handleSubmit(onValid, onInvalid){  
    return () \=\> {  
      const errors \= {};  
      for (const name in rules){  
        const v \= fields\[name\].value;  
        if (rules\[name\].required && \!v) errors\[name\] \= "required";  
        if (rules\[name\].minLength && v.length \< rules\[name\].minLength) errors\[name\] \= "too short";  
      }  
      const values \= Object.fromEntries(Object.entries(fields).map((\[k, f\]) \=\> \[k, f.value\]));  
      return Object.keys(errors).length ? onInvalid(errors) : onValid(values);  
    };  
  }  
  return { register, setValue, handleSubmit };  
}  
const form \= useForm();  
form.register("name", { required: true });  
form.register("pw", { required: true, minLength: 6 });  
form.setValue("name", "Asha");  
form.setValue("pw", "12345");                          // too short  
const submit \= form.handleSubmit(  
  (vals) \=\> console.log("VALID:", JSON.stringify(vals)),  
  (errs) \=\> console.log("INVALID:", JSON.stringify(errs))  
);  
submit();  
form.setValue("pw", "secret1");  
submit();  
console.log("All assertions passed.");  
   
/\* \===== EXPECTED OUTPUT \=====  
INVALID: {"pw":"too short"}  
VALID: {"name":"Asha","pw":"secret1"}  
All assertions passed.  
\===== END EXPECTED OUTPUT \===== \*/

**Common Follow-up Questions**

**Q: How does React Hook Form reduce re-renders?**

A: It uses uncontrolled inputs and refs, so the form doesn't re-render on every keystroke the way controlled state-based forms do — only affected parts update.

**Q: What does register do?**

A: It wires an input into the form: it returns props (name, ref, onChange, onBlur) that you spread onto the input so RHF can track and validate it.

**Q: How do you add schema validation?**

A: Pass a resolver (e.g., zodResolver(schema)) to useForm, letting a Zod/Yup schema define the validation rules declaratively.

## **44\. Styling (Tailwind / CSS Modules / styled-components)**

**Simple Explanation**

React supports several styling approaches. Tailwind CSS uses utility classes directly in markup for fast, consistent styling. CSS Modules scope class names to a file (auto-hashed) to avoid global collisions. styled-components (CSS-in-JS) lets you write component-scoped CSS in JavaScript with dynamic props.

Each has trade-offs: Tailwind is fast and consistent but verbose in markup; CSS Modules keep familiar CSS with scoping; CSS-in-JS gives dynamic, co-located styles with some runtime cost. A clsx-style helper is commonly used to compose conditional classes cleanly.

**Hinglish Explanation**

React mein styling ke kai tarike hain. Tailwind CSS utility classes seedha markup mein use karta hai — fast aur consistent. CSS Modules class names ko file ke scope mein rakhta hai (auto-hashed) taaki global collision na ho. styled-components (CSS-in-JS) JavaScript mein component-scoped CSS likhne deta hai dynamic props ke saath.

Har ek ke trade-offs hain: Tailwind fast par markup verbose; CSS Modules familiar CSS with scoping; CSS-in-JS dynamic co-located styles par thoda runtime cost. Conditional classes compose karne ke liye clsx jaisa helper aam hai.

**Key Interview Points**

* Tailwind: utility classes in markup — fast, consistent, no naming; markup gets verbose.

* CSS Modules: file-scoped, auto-hashed class names; familiar CSS, no collisions.

* styled-components / CSS-in-JS: component-scoped, dynamic styles via props; runtime cost.

* Use a clsx/classnames helper to compose conditional classes cleanly.

* Choice depends on team preference, performance needs, and design-system style.

**Real-World Example**

A startup picks Tailwind for speed and a consistent spacing/color scale across the team. A component library that ships to many apps might prefer CSS Modules or CSS-in-JS for stronger encapsulation so its styles never leak into or clash with host apps.

**Code — Full & Runnable (React / JSX)**

*This is real React component code (runs in the browser / a React app). A Node-runnable logic demo that verifies the same idea follows below.*

// Styling: Tailwind utility classes \+ a clsx helper for conditional classes.  
import React from "react";  
import clsx from "clsx";  
// CSS Modules alternative: import styles from "./Button.module.css";  
   
export default function Button({ variant \= "primary", disabled, children }) {  
  return (  
    \<button  
      disabled={disabled}  
      className={clsx(  
        "px-4 py-2 rounded font-medium",        // base Tailwind utilities  
        variant \=== "primary" && "bg-blue-600 text-white",  
        variant \=== "danger" && "bg-red-600 text-white",  
        disabled && "opacity-50 cursor-not-allowed"  
      )}  
    \>  
      {children}  
    \</button\>  
  );  
}

**Test / Demo & Expected Output (Node-runnable)**

// Styling — className composition (like clsx) used by Tailwind/CSS Modules  
function clsx(...args){  
  const out \= \[\];  
  for (const a of args){  
    if (\!a) continue;  
    if (typeof a \=== "string") out.push(a);  
    else if (typeof a \=== "object") for (const k in a) if (a\[k\]) out.push(k);  
  }  
  return out.join(" ");  
}  
const isActive \= true, isDisabled \= false;  
const cls \= clsx("btn", "px-4", { "btn-active": isActive, "btn-disabled": isDisabled });  
console.log("Computed className:", cls);  
console.assert(cls \=== "btn px-4 btn-active", "active applied, disabled skipped");  
   
// CSS Modules: imported class names are hashed to avoid global collisions  
const styles \= { button: "Button\_button\_\_a1b2c", primary: "Button\_primary\_\_d3e4f" };  
console.log("Module class:", clsx(styles.button, styles.primary));  
console.log("All assertions passed.");  
   
/\* \===== EXPECTED OUTPUT \=====  
Computed className: btn px-4 btn-active  
Module class: Button\_button\_\_a1b2c Button\_primary\_\_d3e4f  
All assertions passed.  
\===== END EXPECTED OUTPUT \===== \*/

**Common Follow-up Questions**

**Q: What problem do CSS Modules solve?**

A: Global CSS scope collisions. They auto-generate unique, hashed class names per file so styles don't accidentally affect other components.

**Q: What's a downside of CSS-in-JS?**

A: Runtime overhead from generating styles in the browser (varies by library), and larger JS bundles. Zero-runtime CSS-in-JS tools aim to reduce this.

**Q: Why use a clsx helper?**

A: To compose conditional class names readably: clsx('btn', isActive && 'active') instead of fragile string concatenation.

## **45\. Accessibility (a11y)**

**Simple Explanation**

Accessibility (a11y) means building UIs everyone can use, including people relying on screen readers, keyboard navigation, or other assistive tech. The foundation is semantic HTML — real buttons, headings, labels, and lists — because it conveys meaning and behavior to assistive tools for free.

When semantics aren't enough, ARIA attributes add roles, states, and accessible names (e.g., aria-label for icon-only buttons, aria-modal for dialogs). Key practices include keyboard operability, visible focus, sufficient color contrast, and correct label-to-input associations.

**Hinglish Explanation**

Accessibility (a11y) ka matlab hai aisi UI banana jo sab use kar saken, including screen reader, keyboard navigation ya assistive tech wale log. Iski neenv semantic HTML hai — real buttons, headings, labels — kyunki ye meaning aur behavior assistive tools tak free mein pahunchata hai.

Jab semantics kaafi na ho, ARIA attributes roles, states aur accessible names add karte hain (jaise icon-only button ke liye aria-label, dialog ke liye aria-modal). Important: keyboard operability, visible focus, achha color contrast, aur label-input ka sahi connection.

**Key Interview Points**

* Start with semantic HTML (button, nav, label, h1–h6) — it carries meaning for free.

* ARIA adds roles/states/names only when semantics fall short (don't overuse it).

* Icon-only controls need an accessible name (aria-label) so they're announced.

* Ensure full keyboard operability and a visible focus indicator.

* Mind color contrast and associate every input with a label (htmlFor/id).

**Real-World Example**

A modal dialog uses role="dialog" and aria-modal="true", moves focus to the first control on open, traps focus inside, and returns focus to the trigger on close. Its close button uses aria-label="Close" since it only shows an × icon — so screen-reader users hear a meaningful label.

**Code — Full & Runnable (React / JSX)**

*This is real React component code (runs in the browser / a React app). A Node-runnable logic demo that verifies the same idea follows below.*

// Accessibility (a11y): semantic HTML \+ ARIA for an icon-only button and a modal.  
import React, { useRef, useEffect } from "react";  
   
export default function IconButton({ onClose }) {  
  const closeRef \= useRef(null);  
  useEffect(() \=\> { closeRef.current.focus(); }, \[\]); // move focus into the dialog  
   
  return (  
    \<div role="dialog" aria-modal="true" aria-labelledby="dialog-title"\>  
      \<h2 id="dialog-title"\>Settings\</h2\>  
   
      {/\* Icon-only button MUST have an accessible name via aria-label \*/}  
      \<button ref={closeRef} aria-label="Close settings" onClick={onClose}\>  
        \<span aria-hidden="true"\>×\</span\>  
      \</button\>  
    \</div\>  
  );  
}

**Test / Demo & Expected Output (Node-runnable)**

// Accessibility (a11y) — compute the accessible name of an element  
function accessibleName(el){  
  // priority: aria-labelledby \> aria-label \> associated \<label\> \> text content  
  if (el\["aria-labelledby"\]) return el.labelledbyText;  
  if (el\["aria-label"\]) return el\["aria-label"\];  
  if (el.labelText) return el.labelText;  
  return el.textContent || "";  
}  
console.log(accessibleName({ "aria-label": "Close dialog" }));  
console.log(accessibleName({ labelText: "Email address" }));  
console.log(accessibleName({ textContent: "Submit" }));  
const iconButton \= { "aria-label": "Search" };       // icon-only button needs a name  
console.assert(accessibleName(iconButton) \=== "Search", "icon button is named");  
console.assert(accessibleName({ textContent: "" }) \=== "", "unnamed element flagged empty");  
console.log("All assertions passed.");  
   
/\* \===== EXPECTED OUTPUT \=====  
Close dialog  
Email address  
Submit  
All assertions passed.  
\===== END EXPECTED OUTPUT \===== \*/

**Common Follow-up Questions**

**Q: Why prefer semantic HTML over ARIA?**

A: Native elements come with built-in behavior, focus, and semantics that assistive tech understands. ARIA only describes — it doesn't add behavior — so 'no ARIA is better than bad ARIA'.

**Q: How do you make an icon-only button accessible?**

A: Give it an accessible name with aria-label (e.g., aria-label="Close") and mark the decorative icon aria-hidden so it isn't announced separately.

**Q: What are the basics of keyboard accessibility?**

A: Every interactive element must be reachable and operable via keyboard (Tab/Enter/Space), with a visible focus indicator and a logical focus order.

## **46\. Folder structure**

**Simple Explanation**

A good folder structure makes a React codebase easy to navigate and scale. A common approach is feature-based (or 'feature-sliced') organization: group everything for a feature — components, state, hooks, tests — in one folder, rather than splitting by file type across the app.

Shared, feature-agnostic UI lives in a separate 'shared' or 'components' folder. Barrel files (index.js) expose a clean public API per feature so consumers import from the feature, not deep internal paths. The goal is high cohesion within features and low coupling between them.

**Hinglish Explanation**

Achhi folder structure React codebase ko navigate aur scale karna easy banati hai. Common approach feature-based organization hai: ek feature ki saari cheezein — components, state, hooks, tests — ek folder mein, file type ke hisaab se app bhar mein bikhrana nahi.

Shared, feature-agnostic UI alag 'shared'/'components' folder mein rehti hai. Barrel files (index.js) har feature ka clean public API dete hain taaki consumer feature se import kare, deep internal path se nahi. Goal: feature ke andar high cohesion, features ke beech low coupling.

**Key Interview Points**

* Feature-based organization keeps a feature's parts together (component, state, hooks, tests).

* Avoid pure type-based folders (all components / all reducers) once the app grows.

* Put feature-agnostic, reusable UI in a shared/ folder.

* Barrel files (index.js) expose a feature's public API; hide internals.

* Aim for high cohesion within features and low coupling between them.

**Real-World Example**

In a large app, the 'auth' feature folder holds LoginForm, authSlice, useAuth, and tests together, exposing only what's needed via index.js. A new developer working on auth touches one folder instead of hunting through separate components/, store/, and hooks/ trees.

**Code — Full & Runnable (React / JSX)**

*This is real React component code (runs in the browser / a React app). A Node-runnable logic demo that verifies the same idea follows below.*

// Folder structure: feature-based layout with a barrel (index.js) export.  
//  
// src/  
// ├── features/  
// │   ├── auth/  
// │   │   ├── LoginForm.jsx  
// │   │   ├── authSlice.js  
// │   │   └── index.js        \<- barrel: re-exports the feature's public API  
// │   └── cart/  
// │       ├── CartList.jsx  
// │       └── index.js  
// ├── shared/                 \<- reusable, feature-agnostic UI  
// │   └── Button.jsx  
// └── app/  
//     └── store.js  
   
// features/auth/index.js  (the barrel)  
export { default as LoginForm } from "./LoginForm";  
export { default as authReducer } from "./authSlice";  
   
// Consumers import from the feature, not deep paths:  
// import { LoginForm } from "@/features/auth";

**Test / Demo & Expected Output (Node-runnable)**

// Folder structure — feature-based organization \+ barrel exports resolution  
const project \= {  
  "features/auth/LoginForm.jsx": "component",  
  "features/auth/authSlice.js": "state",  
  "features/auth/index.js": "barrel",  
  "features/cart/CartList.jsx": "component",  
  "features/cart/index.js": "barrel",  
  "shared/Button.jsx": "component",  
};  
function featureFiles(feature){  
  return Object.keys(project).filter(p \=\> p.startsWith(\`features/${feature}/\`));  
}  
function resolveBarrel(feature){  
  // import { LoginForm } from "features/auth" \-\> resolves via index.js  
  return featureFiles(feature).find(p \=\> p.endsWith("index.js"));  
}  
console.log("auth files:", featureFiles("auth").length);  
console.log("auth barrel:", resolveBarrel("auth"));  
console.log("cart files:", featureFiles("cart").map(f \=\> f.split("/").pop()).join(", "));  
console.assert(resolveBarrel("auth") \=== "features/auth/index.js", "barrel resolves");  
console.assert(featureFiles("auth").length \=== 3, "auth feature is self-contained");  
console.log("All assertions passed.");  
   
/\* \===== EXPECTED OUTPUT \=====  
auth files: 3  
auth barrel: features/auth/index.js  
cart files: CartList.jsx, index.js  
All assertions passed.  
\===== END EXPECTED OUTPUT \===== \*/

**Common Follow-up Questions**

**Q: Why prefer feature-based over type-based folders?**

A: Feature folders keep related code together, so changes to a feature are localized and easier to find. Type-based grouping scatters a feature across many directories as the app grows.

**Q: What's a barrel file?**

A: An index.js that re-exports a module's public items, so consumers import from the folder (features/auth) instead of deep paths, hiding internal structure.

**Q: Where does shared code go?**

A: In a shared/ (or common/) directory for feature-agnostic UI and utilities used across multiple features.

## **47\. Reusable components**

**Simple Explanation**

Reusable components are flexible, well-designed building blocks used across an app — buttons, inputs, modals, cards. The key is a clear prop API: sensible defaults, a small set of variants/sizes, and spreading the rest of the props (like onClick, disabled, aria-\*) so the component stays adaptable.

Good reusable components are composable rather than over-configured: prefer composition (children, slots) over a giant list of boolean flags. Consistent variant naming and accessibility baked in make a component library predictable and pleasant to use.

**Hinglish Explanation**

Reusable components flexible, achhe-design wale building blocks hain jo app bhar mein use hote hain — buttons, inputs, modals, cards. Key hai clear prop API: sensible defaults, kuch variants/sizes, aur baaki props (onClick, disabled, aria-\*) spread karna taaki component adaptable rahe.

Achhe reusable components over-configure ke bajaye composable hote hain: bahut saare boolean flags ke bajaye composition (children, slots) prefer karo. Consistent variant naming aur built-in accessibility component library ko predictable banate hain.

**Key Interview Points**

* Design a clear prop API: sensible defaults \+ a small set of variants/sizes.

* Spread remaining props (...rest) so consumers can pass onClick, disabled, aria-\*.

* Prefer composition (children/slots) over a flood of boolean configuration flags.

* Bake in accessibility and consistent styling so usage is predictable.

* Keep components focused — one responsibility, easy to test and document.

**Real-World Example**

A design-system \<Button variant size\> covers primary/secondary/danger and sm/md/lg with one component. Forwarding ...rest means teams can add onClick, type="submit", or aria-label without the library anticipating every prop — the same button serves dozens of screens.

**Code — Full & Runnable (React / JSX)**

*This is real React component code (runs in the browser / a React app). A Node-runnable logic demo that verifies the same idea follows below.*

// Reusable components: a variant-driven Button with sensible defaults.  
import React from "react";  
import clsx from "clsx";  
   
const VARIANTS \= {  
  primary: "bg-blue-600 text-white",  
  secondary: "bg-gray-200 text-gray-900",  
  danger: "bg-red-600 text-white",  
};  
const SIZES \= { sm: "text-sm px-2 py-1", md: "text-base px-4 py-2", lg: "text-lg px-6 py-3" };  
   
export default function Button({ variant \= "primary", size \= "md", className, ...rest }) {  
  return (  
    \<button  
      className={clsx("rounded font-medium", VARIANTS\[variant\], SIZES\[size\], className)}  
      {...rest} // spread the rest (onClick, disabled, aria-\*) so it stays flexible  
    /\>  
  );  
}  
// \<Button\>Save\</Button\>  \<Button variant="danger" size="lg"\>Delete\</Button\>

**Test / Demo & Expected Output (Node-runnable)**

// Reusable components — a variant-driven API (like a Button design system)  
function buttonClasses({ variant \= "primary", size \= "md", disabled \= false } \= {}){  
  const base \= "btn";  
  const variants \= { primary: "btn-blue", secondary: "btn-gray", danger: "btn-red" };  
  const sizes \= { sm: "text-sm", md: "text-base", lg: "text-lg" };  
  return \[base, variants\[variant\], sizes\[size\], disabled && "btn-disabled"\]  
    .filter(Boolean).join(" ");  
}  
console.log("default:  ", buttonClasses());  
console.log("danger lg:", buttonClasses({ variant: "danger", size: "lg" }));  
console.log("disabled: ", buttonClasses({ disabled: true }));  
console.assert(buttonClasses({ variant: "danger" }).includes("btn-red"), "variant maps to class");  
console.assert(buttonClasses({ disabled: true }).includes("btn-disabled"), "disabled applied");  
console.log("All assertions passed.");  
   
/\* \===== EXPECTED OUTPUT \=====  
default:   btn btn-blue text-base  
danger lg: btn btn-red text-lg  
disabled:  btn btn-blue text-base btn-disabled  
All assertions passed.  
\===== END EXPECTED OUTPUT \===== \*/

**Common Follow-up Questions**

**Q: Why spread ...rest onto a reusable component?**

A: So consumers can pass any extra props (event handlers, ARIA attributes, data-\*) without the component needing to declare each one — keeping it flexible.

**Q: Composition vs configuration — which is better?**

A: Favor composition (children, sub-components) over piling on boolean props. It scales better and avoids 'prop explosion' where a component has dozens of flags.

**Q: What makes a component truly reusable?**

A: Clear defaults, a small variant API, accessibility built in, no hard-coded business logic, and flexibility via props/composition.

## **48\. Error handling**

**Simple Explanation**

Robust error handling spans several layers in React. Error boundaries catch render-time crashes and show a fallback. Async errors (failed fetches) are handled with try/catch or by data libraries like React Query, which expose error state and can retry automatically.

Good practice is to normalize errors into a consistent shape (network vs. API vs. client), show user-friendly messages with a recovery path (retry), and log technical details to a monitoring service. The aim is graceful degradation — one failure shouldn't blank the whole app.

**Hinglish Explanation**

Robust error handling React mein kai layers mein hota hai. Error boundaries render-time crashes pakad kar fallback dikhate hain. Async errors (failed fetch) ko try/catch ya React Query jaisi libraries se handle karte hain jo error state deti hain aur auto-retry kar sakti hain.

Achhi practice: errors ko consistent shape mein normalize karna (network/API/client), user-friendly message with retry dikhana, aur technical details monitoring service mein log karna. Goal hai graceful degradation — ek failure poori app blank na kare.

**Key Interview Points**

* Error boundaries catch render errors; try/catch \+ data libraries handle async errors.

* Normalize errors into a consistent shape (network / API / client) for clean handling.

* Show friendly messages with a recovery path (retry), not raw stack traces.

* Retry transient failures (React Query retries automatically) with sensible limits.

* Log technical details to a monitoring service (Sentry, etc.) for diagnosis.

**Real-World Example**

A data table fetches users; if the request fails, React Query retries a couple of times, then the UI shows 'Network error — please try again' with a Try again button. The raw error is sent to Sentry, so the team sees the real cause while the user gets a clear, actionable message.

**Code — Full & Runnable (React / JSX)**

*This is real React component code (runs in the browser / a React app). A Node-runnable logic demo that verifies the same idea follows below.*

// Error handling: an Error Boundary \+ normalized async errors with retry.  
import React from "react";  
import { useQuery } from "@tanstack/react-query";  
   
function normalize(error) {  
  if (error.response) return \`API ${error.response.status}: ${error.response.statusText}\`;  
  if (error.request) return "Network error — please check your connection";  
  return error.message;  
}  
   
export default function Users() {  
  const { data, error, isError, refetch, isFetching } \= useQuery({  
    queryKey: \["users"\],  
    queryFn: () \=\> fetch("/api/users").then((r) \=\> {  
      if (\!r.ok) throw { response: r };  
      return r.json();  
    }),  
    retry: 2, // React Query retries failed requests automatically  
  });  
   
  if (isError) {  
    return (  
      \<div role="alert"\>  
        \<p\>{normalize(error)}\</p\>  
        \<button onClick={() \=\> refetch()} disabled={isFetching}\>Try again\</button\>  
      \</div\>  
    );  
  }  
  return \<ul\>{data?.map((u) \=\> \<li key={u.id}\>{u.name}\</li\>)}\</ul\>;  
}

**Test / Demo & Expected Output (Node-runnable)**

// Error handling — normalize errors \+ retry with backoff  
function normalizeError(err){  
  if (err.response) return { type: "api", status: err.response.status, message: err.response.message };  
  if (err.request) return { type: "network", message: "No response" };  
  return { type: "client", message: err.message };  
}  
async function withRetry(fn, retries \= 3){  
  let lastErr;  
  for (let attempt \= 1; attempt \<= retries; attempt++){  
    try { return await fn(attempt); }  
    catch (e) { lastErr \= e; console.log(\`attempt ${attempt} failed: ${e.message}\`); }  
  }  
  throw lastErr;  
}  
(async () \=\> {  
  console.log("normalized:", JSON.stringify(normalizeError({ response: { status: 404, message: "Not found" } })));  
  let calls \= 0;  
  const result \= await withRetry(async (attempt) \=\> {  
    calls++;  
    if (attempt \< 3\) throw new Error("temporary");  
    return "success on attempt " \+ attempt;  
  });  
  console.log(result);  
  console.assert(calls \=== 3, "retried until success");  
  console.log("All assertions passed.");  
})();  
   
/\* \===== EXPECTED OUTPUT \=====  
normalized: {"type":"api","status":404,"message":"Not found"}  
attempt 1 failed: temporary  
attempt 2 failed: temporary  
success on attempt 3  
All assertions passed.  
\===== END EXPECTED OUTPUT \===== \*/

**Common Follow-up Questions**

**Q: What kinds of errors do error boundaries NOT catch?**

A: Errors in event handlers, async code, and the boundary's own render. Those need try/catch or data-layer handling (e.g., React Query's error state).

**Q: Why normalize errors?**

A: So the UI can handle them consistently regardless of source — distinguishing a network outage from a 404 or a validation error lets you show the right message and recovery action.

**Q: How should transient failures be handled?**

A: Retry a limited number of times (with backoff) for things like flaky networks; React Query does this by default. Don't retry on clear client errors like 400/401.

## **49\. Next.js basics**

**Simple Explanation**

Next.js is a React framework that adds file-based routing, multiple rendering strategies (SSR, SSG, ISR, and React Server Components), API routes, image optimization, and more — turning React from a library into a full-stack framework. Files in the routing directory automatically become routes.

Its modern App Router uses Server Components by default (rendered on the server, less JS shipped) and supports per-request and per-page data fetching with caching/revalidation built in. This makes Next.js a strong choice for SEO-friendly, fast, content-rich apps.

**Hinglish Explanation**

Next.js ek React framework hai jo file-based routing, kai rendering strategies (SSR, SSG, ISR, Server Components), API routes, image optimization waghairah add karta hai — React ko library se full-stack framework bana deta hai. Routing directory ki files automatically routes ban jaati hain.

Iska modern App Router by default Server Components use karta hai (server par render, kam JS) aur built-in caching/revalidation ke saath data fetching support karta hai. Isliye SEO-friendly, fast, content-rich apps ke liye Next.js strong choice hai.

**Key Interview Points**

* File-based routing: files/folders in the routing dir become URLs automatically.

* Multiple rendering modes: SSR, SSG, ISR, and React Server Components.

* App Router uses Server Components by default — less JavaScript shipped to the client.

* Built-in API routes, image optimization, and data caching/revalidation.

* Great for SEO, performance, and full-stack React apps.

**Real-World Example**

A content site uses Next.js: marketing pages are statically generated for speed and SEO, blog posts use ISR to re-generate every few minutes, and the dashboard uses dynamic server rendering. One framework covers all three rendering needs with file-based routes.

**Code — Full & Runnable (React / JSX)**

*This is real React component code (runs in the browser / a React app). A Node-runnable logic demo that verifies the same idea follows below.*

// Next.js basics: file-based routing \+ data fetching (App Router server component).  
//  
// app/  
// ├── page.jsx            \-\> "/"  
// ├── about/page.jsx      \-\> "/about"  
// └── blog/\[slug\]/page.jsx \-\> "/blog/:slug"  
   
// app/blog/\[slug\]/page.jsx — a Server Component that fetches on the server.  
export default async function BlogPost({ params }) {  
  const { slug } \= params;                       // dynamic segment from the URL  
  const res \= await fetch(\`https://api.site.com/posts/${slug}\`, {  
    next: { revalidate: 60 },                    // ISR: re-generate at most every 60s  
  });  
  const post \= await res.json();  
   
  return (  
    \<article\>  
      \<h1\>{post.title}\</h1\>  
      \<p\>{post.body}\</p\>  
    \</article\>  
  );  
}

**Test / Demo & Expected Output (Node-runnable)**

// Next.js basics — file-based routing maps the pages/ folder to URLs  
const pages \= \[  
  "pages/index.js",  
  "pages/about.js",  
  "pages/blog/index.js",  
  "pages/blog/\[slug\].js",  
  "pages/api/users.js",  
\];  
function fileToRoute(file){  
  let r \= file.replace(/^pages/, "").replace(/\\.js$/, "");  
  r \= r.replace(/\\/index$/, "") || "/";  
  r \= r.replace(/\\\[(\\w+)\\\]/g, ":$1");      // \[slug\] \-\> :slug (dynamic)  
  return r;  
}  
pages.forEach(p \=\> console.log(\`${p}  \-\>  ${fileToRoute(p)}\`));  
console.assert(fileToRoute("pages/index.js") \=== "/", "index \-\> /");  
console.assert(fileToRoute("pages/blog/\[slug\].js") \=== "/blog/:slug", "dynamic route");  
console.log("All assertions passed.");  
   
/\* \===== EXPECTED OUTPUT \=====  
pages/index.js  \-\>  /  
pages/about.js  \-\>  /about  
pages/blog/index.js  \-\>  /blog  
pages/blog/\[slug\].js  \-\>  /blog/:slug  
pages/api/users.js  \-\>  /api/users  
All assertions passed.  
\===== END EXPECTED OUTPUT \===== \*/

**Common Follow-up Questions**

**Q: What does file-based routing mean?**

A: Routes are defined by the file/folder structure in the routing directory — app/about/page.jsx becomes /about — instead of a manual route config.

**Q: What are React Server Components in Next.js?**

A: Components that render on the server and send HTML (plus minimal data) rather than JS, reducing client bundle size. They can fetch data directly and can't use browser-only hooks.

**Q: SSR vs SSG vs ISR — quick distinction?**

A: SSR renders per request, SSG renders once at build time, and ISR is SSG that re-generates pages periodically/on-demand to stay fresh.

## **50\. SSR (Server-Side Rendering)**

**Simple Explanation**

Server-Side Rendering generates a page's HTML on the server for each request and sends it fully formed to the browser. The user sees content faster (no waiting for JS to build the page) and search engines get real HTML, which helps SEO. React then 'hydrates' that HTML on the client, attaching event listeners to make it interactive.

The catch: the server-rendered markup and the client's first render must match, or you get hydration mismatches. SSR adds server cost and complexity compared to a static client-only app, so it's chosen when fast first paint, SEO, or per-request data matter.

**Hinglish Explanation**

Server-Side Rendering har request par page ka HTML server par banata hai aur poora-poora browser ko bhejta hai. User ko content jaldi dikhta hai (JS se page banne ka wait nahi), aur search engines ko real HTML milta hai jo SEO mein madad karta hai. Phir React client par us HTML ko 'hydrate' karta hai — event listeners laga kar interactive banata hai.

Catch: server-rendered markup aur client ka pehla render match hone chahiye, warna hydration mismatch ho jaata hai. SSR server cost aur complexity badhata hai, isliye tab choose karo jab fast first paint, SEO ya per-request data zaroori ho.

**Key Interview Points**

* Server generates full HTML per request; the browser shows content faster.

* Better SEO — crawlers receive real, complete HTML instead of an empty shell.

* Hydration: the client attaches React to the server HTML to make it interactive.

* Server and client first render must match, or hydration mismatches occur.

* Adds server cost/complexity — use when first paint, SEO, or fresh data matter.

**Real-World Example**

A news site server-renders each article so readers (and Google) get the full text immediately, even on slow devices. The page is interactive once React hydrates, but the content is readable before any JavaScript runs — crucial for SEO and perceived speed.

**Code — Full & Runnable (React / JSX)**

*This is real React component code (runs in the browser / a React app). A Node-runnable logic demo that verifies the same idea follows below.*

// SSR: render to HTML on the server, then hydrate on the client.  
//  
// server.js (Express \+ React 18 streaming SSR)  
import { renderToPipeableStream } from "react-dom/server";  
import App from "./App";  
   
export function handleRequest(req, res) {  
  const stream \= renderToPipeableStream(\<App url={req.url} /\>, {  
    bootstrapScripts: \["/client.js"\], // script that hydrates on the client  
    onShellReady() {  
      res.setHeader("Content-Type", "text/html");  
      stream.pipe(res); // send HTML as it renders  
    },  
  });  
}  
   
// client.js — hydrate the server-rendered markup (must match exactly).  
// import { hydrateRoot } from "react-dom/client";  
// hydrateRoot(document.getElementById("root"), \<App url={location.pathname} /\>);

**Test / Demo & Expected Output (Node-runnable)**

// SSR — render a component to an HTML string on the server, then hydrate  
function renderToString(component, props){  
  return component(props);   // pure render \-\> HTML string (no DOM needed)  
}  
function App({ user }){ return \`\<div id="root"\>\<h1\>Hello, ${user}\</h1\>\</div\>\`; }  
   
const serverHTML \= renderToString(App, { user: "Asha" });   // sent to the browser  
console.log("Server HTML:", serverHTML);  
   
// Hydration: the same component runs on the client and must match the markup  
const clientHTML \= renderToString(App, { user: "Asha" });  
const hydrationMatches \= serverHTML \=== clientHTML;  
console.log("Hydration markup matches:", hydrationMatches);  
console.assert(hydrationMatches, "server and client output must match to hydrate cleanly");  
console.log("All assertions passed.");  
   
/\* \===== EXPECTED OUTPUT \=====  
Server HTML: \<div id="root"\>\<h1\>Hello, Asha\</h1\>\</div\>  
Hydration markup matches: true  
All assertions passed.  
\===== END EXPECTED OUTPUT \===== \*/

**Common Follow-up Questions**

**Q: What is hydration?**

A: The process where React, running on the client, attaches to the server-rendered HTML and wires up event handlers and state, turning static markup into an interactive app.

**Q: What causes hydration mismatches?**

A: When the client's first render differs from the server's HTML — e.g., using Date.now(), random values, or browser-only data during render. Keep the initial render deterministic.

**Q: SSR vs CSR — when choose SSR?**

A: Choose SSR for SEO-critical pages, fast first contentful paint, or content that depends on per-request data. Pure client-side rendering is fine for app-like, behind-login dashboards.