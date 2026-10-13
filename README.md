# PM Panels

Illustrated, interactive case studies for product managers and people preparing for PM interviews, in the spirit of growth.design's comic case studies.

Each case study follows the same loop:

1. **The setup**: a real (or clearly labelled fictional) product moment, told as comic panels.
2. **Your turn**: the reader writes their own answer before anything else is shown.
3. **The breakdown**: a PM character works through it step by step, naming the framework at each step.
4. **What happened**: the real outcome, with sources.
5. **Interview takeaway**: strong vs weak answers and follow-up questions.
6. **Score yourself**: the reader's answer next to a rubric they tick off.

Practice progress is kept in the browser (`localStorage`) until accounts exist.

## Run it

```bash
npm install
npm run dev        # http://localhost:3000
npm run build      # static production build
npm run typecheck
```

## Adding a case study

1. Copy a file in `src/content/case-studies/` and edit it. The shape is typed by `CaseStudy` in `src/content/types.ts`.
2. Register it in `src/content/index.ts`.

Panels support these visuals: `metric`, `chart`, `screen`, `list`, `table` and `tree`. Speakers are `pm`, `interviewer`, `engineer`, `analyst`, `user` and `narrator`. Set `fictional: true` for invented companies or numbers. Only use public, sourced facts in the outcome of a real-company case study.

## Frameworks

Framework cards live in `src/content/frameworks.ts`. Case studies link to them by slug, through `frameworks: [...]`, through `callout.framework` on a panel, or through `framework` on a breakdown step.

## Newsletter

Set `NEXT_PUBLIC_NEWSLETTER_ENDPOINT` to your provider's form endpoint (Buttondown, ConvertKit, Beehiiv…). Without it, the form runs in demo mode and sends nothing.

## Structure

```
src/
  app/                    routes (home, case-studies/[slug], frameworks, frameworks/[slug])
  components/             Panel, Persona (SVG avatars), Visual, PracticeFlow, CaseGrid, NewsletterForm
  content/                typed content: case studies, frameworks, tracks
```

## Roadmap

- More case studies for product sense, execution and behavioral tracks
- Accounts so progress syncs across devices
- AI feedback on written answers, scored against each case study's rubric
- Company prep packs, daily question, peer mock interviews
