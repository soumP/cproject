# Project facts

Every agent reads this file before working. The PM can edit it any time.

- **What this is:** PM Panels: illustrated, interactive comic case studies for PM interview prep.
- **Stack:** Next.js 15 (App Router), React 19, TypeScript. AI feedback via the Anthropic SDK + zod.
- **Where the code lives:** `src/app` (routes), `src/components`, `src/content` (typed case studies,
  frameworks, tracks; see `src/content/types.ts`), `src/lib`.
- **Conventions:** see `README.md` (adding case studies, visuals, speakers, `fictional: true`, sourced facts only).

## Commands
- **Install:** `npm install`
- **Checks (must pass before review and before ship):** `npm run typecheck && npm run build`
  (there is no test suite yet)
- **Build:** `npm run build`

## Dev environment (where QA tests)
- **Start:** `npm run start -- -p 3001` (after Build; run in the background)
- **Stop:** `pkill -f "next start -p 3001" || true`
- **URL / how to reach it:** http://localhost:3001
- **How QA tests it:** Playwright against the URL. AI feedback needs `ANTHROPIC_API_KEY`; without it,
  the "not set up" state is expected. With it, call it at most once per QA run.

## Shipping
- **Ship = :** commit and `git push -u origin <branch the Lead names>` (the PM merges to main on GitHub)
- **Never ship to:** `main` directly; never force push.
