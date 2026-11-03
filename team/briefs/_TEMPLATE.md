# NNN · <task title>

> One brief per task. Each section belongs to one role; only that role edits it.
> Copy this file to `team/briefs/NNN-short-slug.md`.

## Ask (Lead, from the PM)
What the PM wants, in their words. Why it matters. What "done" looks like.

## Market research (Market Researcher)
_For bets (new features, products, pricing, segments)._ Full report: `team/research/NNN-slug.md`
- Recommendation: build / build smaller / don't build / need more evidence
- Strongest reasons (sourced):
- What we can do that competitors don't:
- Target segment · suggested success metric:
- Confidence:

## Design options (Designer)
_Only for UI work._ 2–3 options, each with a mockup link (`team/designs/NNN/option-a.html`),
one-line idea, pros and cons, and a recommendation.

## PM pick (Lead)
Which option the PM picked, plus any changes they asked for.

## Plan (Architect)
- Approach:
- Files touched:
- Risks / open questions:
- Buildable? yes / no / with changes:

### Tickets
| Ticket | Scope | Files it owns | Done when |
|--------|-------|---------------|-----------|
| NNN-1  |       |               |           |

Lead: `plan OK` / changes requested:

## Dev notes (Devs, one subsection per ticket)
### NNN-1
- What changed:
- How I checked it (checks from PROJECT.md, with output):
- Anything the reviewer should look at:

## Code review (Architect)
Verdict: approved / changes requested
- Findings per ticket:

## QA findings (QA)
Tested on: <dev URL from PROJECT.md> @ commit <sha>
| # | Severity | Steps to reproduce | Expected | Actual |
|---|----------|--------------------|----------|--------|

Verdict: pass / fail

## Lead sign-off (Lead)
Signed off: yes / no. Summary for the PM:

## Release (Releaser)
- Put on dev: <date, sha>
- PM yes logged in DECISIONS.md: <date>
- Shipped: <date, sha, branch>
