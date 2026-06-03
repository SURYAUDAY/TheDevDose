# TheDevDose

An animated, playground-driven interview-prep platform. **448 topics** across 6
sequential phases — **JavaScript → TypeScript → React → Backend → GenAI → System
Design** — each with a plain-English + Hinglish explanation, key interview points,
a real-world metaphor, a **runnable in-browser code playground** (auto-graded
against verified expected output), and follow-up Q&A.

## Quick start

```bash
npm install
npm run content:build   # parse content-src/ -> content/*.json, validate 423/423
npm run dev             # http://localhost:3000
```

The app runs fully without a database (content + code playground + browsing).
Accounts, progress tracking, and sequential unlocking activate once you connect
Postgres (below).

## How it's built

- **Content pipeline** (`scripts/`): a strict parser converts the 17 source
  `.docx`-derived files in `content-src/` into one validated JSON per topic under
  `content/`. `npm run content:build` regenerates + validates (gate: 423/423,
  exactly 7 sections each, 100% expected-output coverage). **Never hand-edit
  `content/`** — edit `content-src/` and re-run.
- **App** (`src/`): Next.js 15 (App Router) + Tailwind v4. Content pages are
  statically generated from `content/`; `src/lib/content.ts` reads it server-side.
- **Playground** (`public/workers/`, `src/components/playground/`): Monaco editor +
  client-side Web Workers — JavaScript/TypeScript (CommonJS module system, TS via
  the TS compiler from CDN) and Python (Pyodide). Output is compared to the
  topic's verified expected output. `npm run content:check` runs a corpus
  self-test (96% of JS demos reproduce their expected output).
- **Accounts & progress** (`prisma/`, `src/lib/{auth,progress,db}.ts`): Prisma +
  Postgres + Auth.js. Phase unlock is **derived** from completed topics + the
  content manifest, enforced server-side.

## Connecting Postgres (Neon) + auth

1. Create a project at <https://neon.tech> and copy the **pooled** connection
   string.
2. `cp .env.example .env` and fill in:
   - `DATABASE_URL` — the Neon string (ends with `?sslmode=require`).
   - `AUTH_SECRET` — generate with `npx auth secret` (or `openssl rand -base64 32`).
3. Create the tables:
   ```bash
   npx prisma migrate dev --name init
   ```
4. `npm run dev`, click **Sign in** (dev email login), and your progress, XP,
   streak, and sequential unlocking are now live.

GitHub/Google OAuth can be added later in `src/lib/auth.ts` (the `Account`/
`Session` tables already exist) without a schema change.

## Scripts

| Script | What it does |
|---|---|
| `npm run dev` / `build` / `start` | Next.js dev / production build / serve |
| `npm run content:build` | Parse + validate content (423/423 gate) |
| `npm run content:check` | Execute JS demos vs expected output (playground self-test) |
| `npm run db:migrate` | `prisma migrate dev` |
| `npm run db:generate` | Regenerate the Prisma client |

## Features

Content pipeline · study UI · runnable code playground · accounts, progress &
sequential unlocking · animated mascot + metaphor scenes · quizzes + SM-2 spaced
repetition (`/review`) · learner readiness + admin analytics dashboards
(`/dashboard`, `/admin`). All 448 topics live; JS 1–103 contiguous.
