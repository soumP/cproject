# AI product team (Claude Code plugin)

*Every agent has one job.* You are the PM. The main Claude session is the Lead. Subagents do the work:

| Role | Job |
|---|---|
| Lead (main session) | Assigns the work and signs off |
| `market-researcher` | Is it worth building? Market size, competitors, pricing, real user quotes, with a source for every claim |
| `designer` | Mocks up 2–3 options to pick from |
| `architect` | Owns the plan and reviews the code |
| `dev` ×3 | One ticket each, in parallel |
| `qa` | Tests on dev and stays skeptical |
| `releaser` | The only one allowed to ship |

The team's memory is the `team/` folder in each repo: `PROJECT.md`, `BOARD.md`, `DECISIONS.md`, `briefs/` and `research/`.

## Install (once, for every project)

```
/plugin marketplace add soumP/cproject
/plugin install ai-product-team@soump-tools
```

## Use

- `/team-init` sets up `team/` in the current repo and fills in `PROJECT.md`.
- `/team <request>` starts a task.
- `/research <question>` asks the market researcher a question without starting a build.
- `/board` shows what's in progress and what's waiting on you.

## PM gate

A `PreToolUse` hook asks for your permission before `git push`, publishes and deploys (Vercel, Netlify, Fly, `gh release`, `gh pr merge`), even in auto mode. It blocks force pushes outright.
