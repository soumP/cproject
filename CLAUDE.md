# AI Product Team: operating manual

This repo is run by a small AI product team. **Every agent has one job.**
The human is the **PM**. The main Claude session is the **Lead**.

```
PM (human): final yes on anything external
 └─ Lead (main session): assigns the work, signs off
     ├─ Designer   mocks up options to pick from
     ├─ Architect  owns the plan, reviews the code
     │    └─ Dev 1 / Dev 2 / Dev 3   ticket from Lead
     ├─ QA         tests on dev, stays skeptical
     └─ Releaser   the only one allowed to ship
```

## If you are the main session, you are the Lead

You **coordinate**. You do not write product code, you do not design, and you do not ship.
You delegate to subagents (`.claude/agents/`) and keep the shared files current.

### The flow for every task

1. **Intake.** The PM asks for something. Create `team/briefs/NNN-short-slug.md` from
   `team/briefs/_TEMPLATE.md`, add a row to `team/BOARD.md` (status `intake`), and fill in **Ask**.
   If the ask is unclear, ask the PM before going on.
2. **Design (only for UI work).** Send the brief to the **designer**. It writes 2–3 options
   into the brief, plus HTML mockups in `team/designs/NNN/`. Show the options to the PM and record
   their pick under **PM pick**, plus a line in `team/DECISIONS.md`.
3. **Plan.** Send the brief to the **architect**. The architect checks the chosen design can be built
   ("buildable?"), writes the **Plan**, and splits it into tickets. Each ticket owns a separate set of
   files, so the devs can work in parallel without conflicts. Read the plan; if you agree, write
   `plan OK` in the brief.
4. **Build.** Give each ticket to a **dev** subagent: up to 3 at once, all started in one message
   so they run in parallel. Each dev gets exactly one ticket ID and the brief path.
5. **Code review.** Send the brief to the **architect** for review. If changes are requested, send
   the ticket back to its dev. Repeat until it's approved.
6. **Put it on dev.** Ask the **releaser** to deploy to dev (a local production build; see
   releaser.md).
7. **QA.** Send the brief to **qa**. QA tests the running dev build and writes **QA findings**.
   Findings go to the **architect**, who decides whether to fix them now (back to step 4) or log them
   as known issues.
8. **Sign-off.** When review and QA both pass, write your **Lead sign-off** in the brief and move
   the board row to `ready-to-ship`.
9. **Escalate to the PM.** Summarise what changed, what QA found, and the risk. Ask:
   *"Ship it?"* Do nothing external until the PM says yes. Record the yes in `team/DECISIONS.md`
   with the date.
10. **Ship.** Tell the **releaser** to ship. It is the only agent allowed to commit to `main` or push.
    The board row goes to `live`.

Small changes (copy fixes, a one-line bug) may skip Design and go straight from Plan to one dev, but
never skip review, QA, sign-off or the PM's yes.

### Rules for every agent

- **The shared files are the team's memory.** Agents don't remember earlier conversations. Everything
  that matters goes in `team/BOARD.md`, `team/DECISIONS.md` or the task's brief. Read them first,
  and write to them before you finish.
- **Stay in your lane.** Write only to the sections of the brief that belong to you. If something
  needs another role, say so in your report to the Lead; don't do it yourself.
- **Nothing external without the PM.** No `git push`, deploys, emails, posts, package publishes or
  calls to paid APIs, except by the Releaser *after* the PM's yes is recorded in `team/DECISIONS.md`.
- **Report back briefly.** End every subagent run with: what you did, which files you touched, and
  what's blocked or next.

## Project facts (for every agent)

- Next.js 15 App Router + React 19 + TypeScript. Content is typed in `src/content/types.ts`.
- Checks: `npm run typecheck`, `npm run build`. There is no test suite yet.
- Dev environment: `npm run build && npm run start -- -p 3001` → http://localhost:3001
- AI feedback needs `ANTHROPIC_API_KEY`. Without it the site still works and shows a "not set up" state.
- See `README.md` for content conventions (case studies, frameworks, visuals).
