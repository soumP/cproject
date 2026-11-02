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

## Walkthrough modes

- **Scroll:** each panel animates in as it scrolls into view. The speech bubble appears first, then the chart or table, then the margin note. Charts draw themselves and highlighted table rows light up.
- **Step by step:** one panel at a time, with Next/Back buttons, the ← → keys, or **▶ Play it for me** (autoplay, paced by how much text is in each panel). It stops at the "Your turn" box and carries on once the reader locks in an answer.

`StoryPlayer` drives this from `data-unit` / `data-chapter` attributes on the server-rendered page. Readers without JavaScript, or with reduced motion turned on, see everything without animation.

## AI feedback

After revealing the breakdown, the reader can click **Grade my answer**. `POST /api/feedback` sends their answer, along with the case study's rubric and reference breakdown (looked up on the server, so the browser can't change them), to Claude. Claude returns a structured result: a verdict and explanation for each rubric item, a score out of 10, strengths, improvements, and an outline of a stronger answer.

- Set `ANTHROPIC_API_KEY` to turn it on (see `.env.example`). Without it, the site works normally and the feedback box says it isn't set up.
- Model: `claude-opus-5-5` with structured outputs (`zod` schema in `src/lib/feedback.ts`), with server-side refusal fallback enabled.
- Answers are limited to 6,000 characters, and each IP gets 20 gradings per hour. The limit is kept in memory, so use a shared store such as Redis if you run more than one instance.

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
- Company prep packs, daily question, peer mock interviews
