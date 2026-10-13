import type { Framework } from "./types";

export const frameworks: Framework[] = [
  {
    slug: "circles",
    name: "CIRCLES",
    oneLiner: "A checklist for product design questions so you don't jump to solutions.",
    tracks: ["product-sense"],
    whenToUse:
      "\"Design X for Y\" or \"Improve product Z\" questions. Use it as a skeleton, not a script; interviewers notice when you recite it.",
    steps: [
      { name: "Comprehend the situation", detail: "Ask clarifying questions: goal, platform, constraints, timeline." },
      { name: "Identify the customer", detail: "List user segments, then pick one and say why." },
      { name: "Report customer needs", detail: "Write user stories or pain points for that segment." },
      { name: "Cut through prioritization", detail: "Rank the needs by frequency and severity. Pick one or two." },
      { name: "List solutions", detail: "Generate 3+ ideas, including one bold one." },
      { name: "Evaluate trade-offs", detail: "Compare impact, effort and risk for each idea." },
      { name: "Summarize", detail: "Restate the user, the need, the solution and how you'd measure it." },
    ],
    example:
      "Design a fridge for kids → Clarify (home use, ages 5–10) → Segment (kids, parents) → Pick parents of picky eaters → Need: kids grab healthy snacks on their own → Solutions: low snack drawer, lock on treats, a sticker reward screen → Choose the low drawer (cheap, high impact) → Measure: healthy snack picks per week.",
    pitfalls: [
      "Spending 10 minutes on clarifying questions.",
      "Choosing a segment without explaining why.",
      "Listing features without tying them to a need.",
    ],
  },
  {
    slug: "north-star",
    name: "North Star + guardrails",
    oneLiner: "One metric that captures the value users get, plus metrics that stop you gaming it.",
    tracks: ["metrics", "strategy"],
    whenToUse: "\"How would you measure success?\" or \"What's the goal for this team?\"",
    steps: [
      { name: "State the product's goal", detail: "Why does this product or feature exist, for users and for the business?" },
      { name: "Map the user journey", detail: "Awareness → activation → engagement → retention → monetization." },
      { name: "Pick the North Star", detail: "A metric that rises only when users get real value. It should lead revenue, not lag it." },
      { name: "Add input metrics", detail: "2–4 levers the team can move that drive the North Star." },
      { name: "Add guardrails", detail: "Metrics that must not get worse: quality, trust, cost, other teams' metrics." },
    ],
    example:
      "Airbnb → North Star: nights booked. Inputs: search-to-book conversion, new listings, repeat guests. Guardrails: cancellation rate, support tickets per booking.",
    pitfalls: [
      "Choosing a vanity metric (downloads, page views).",
      "Choosing revenue, which lags and hides user pain.",
      "Skipping guardrails, so a team can win by hurting users.",
    ],
  },
  {
    slug: "aarrr",
    name: "AARRR (pirate metrics)",
    oneLiner: "Split the funnel into five stages to find where users drop off.",
    tracks: ["metrics", "root-cause"],
    whenToUse: "Growth questions, funnel diagnosis, and finding which stage to invest in.",
    steps: [
      { name: "Acquisition", detail: "How users find you: channels, cost per install, sign-up rate." },
      { name: "Activation", detail: "The first 'aha' moment: e.g. finishing a first lesson or sending a first message." },
      { name: "Retention", detail: "Do they come back? D1/D7/D30 curves, cohort tables." },
      { name: "Referral", detail: "Do they bring others? Invites sent, viral coefficient." },
      { name: "Revenue", detail: "Conversion to paid, ARPU, lifetime value." },
    ],
    example:
      "A meditation app has strong installs but weak D7 retention → the problem is activation or retention, not acquisition. Spending more on ads would waste money.",
    pitfalls: [
      "Treating every stage as equally important.",
      "Not defining the activation event precisely.",
    ],
  },
  {
    slug: "heart",
    name: "HEART",
    oneLiner: "Google's framework for measuring user experience quality.",
    tracks: ["metrics"],
    whenToUse: "Measuring a UX change or a feature where 'engagement' alone is too vague.",
    steps: [
      { name: "Happiness", detail: "Satisfaction, NPS, ratings." },
      { name: "Engagement", detail: "Frequency and depth of use." },
      { name: "Adoption", detail: "New users of the feature in a period." },
      { name: "Retention", detail: "Users who keep using it over time." },
      { name: "Task success", detail: "Completion rate, time on task, error rate." },
    ],
    example:
      "New checkout flow → Task success: checkout completion rate. Happiness: post-purchase rating. Guardrail: refund requests.",
    pitfalls: ["Measuring all five when only two matter for the goal."],
  },
  {
    slug: "rice",
    name: "RICE",
    oneLiner: "Score ideas by Reach × Impact × Confidence ÷ Effort.",
    tracks: ["prioritization"],
    whenToUse: "Comparing several initiatives competing for the same team's time.",
    steps: [
      { name: "Reach", detail: "How many users it affects in a period." },
      { name: "Impact", detail: "How much it moves the goal per user (e.g. 3 = massive, 0.25 = minimal)." },
      { name: "Confidence", detail: "How sure you are of the estimates (100%, 80%, 50%)." },
      { name: "Effort", detail: "Person-weeks or person-months." },
      { name: "Sanity check", detail: "Look at the ranking and ask what the score misses: strategy, dependencies, risk." },
    ],
    example:
      "Feature A: 10k users × 2 × 80% ÷ 2 = 8,000. Feature B: 50k × 0.5 × 100% ÷ 4 = 6,250. A wins, unless B unblocks a strategic partnership.",
    pitfalls: [
      "Treating the score as the decision rather than an input to it.",
      "Inflating confidence for your own favourite idea.",
    ],
  },
  {
    slug: "root-cause-tree",
    name: "Root-cause tree",
    oneLiner: "Split a metric drop into internal vs external causes, then narrow down by segment.",
    tracks: ["root-cause"],
    whenToUse: "\"Metric X dropped by Y%. What happened?\"",
    steps: [
      { name: "Clarify the metric", detail: "How is it defined? Over what time window? Was the drop sudden or gradual?" },
      { name: "Check the data is real", detail: "Logging changes, tracking bugs, dashboard definition changes." },
      { name: "External causes", detail: "Seasonality, holidays, competitor launches, news, OS updates, outages at partners." },
      { name: "Internal causes", detail: "Releases, experiments, pricing changes, marketing spend, infrastructure incidents." },
      { name: "Segment", detail: "Platform, app version, country, new vs returning users, acquisition channel." },
      { name: "Confirm and act", detail: "Form a hypothesis, test it with data, then fix, roll back or communicate." },
    ],
    example:
      "DAU −8% → data is fine → no holiday → drop only on Android, version 5.2 → that release changed the notification permission prompt → reminder notifications fell 60% → roll back the prompt change.",
    pitfalls: [
      "Jumping to a cause before checking the data is accurate.",
      "Listing 20 causes without a way to narrow them down.",
    ],
  },
  {
    slug: "five-whys",
    name: "5 Whys",
    oneLiner: "Keep asking why until you reach a cause you can actually fix.",
    tracks: ["root-cause", "execution"],
    whenToUse: "Post-mortems, and the end of a root-cause answer once you've found the segment.",
    steps: [
      { name: "State the problem", detail: "Be specific: what, where, how much." },
      { name: "Ask why, repeatedly", detail: "Each answer becomes the next question. Usually 3–5 levels." },
      { name: "Stop at a process cause", detail: "You're done when the answer is something the team can change." },
    ],
    example:
      "Reminders fell → why? Permission prompt changed → why? New OS requirement → why was it not caught? No notification-rate alert → fix: add an alert on notification opt-in rate.",
    pitfalls: ["Stopping at a person ('Alex made a mistake') instead of a process."],
  },
  {
    slug: "jtbd",
    name: "Jobs to be Done",
    oneLiner: "Users 'hire' products to make progress in a situation. Find the job.",
    tracks: ["product-sense", "strategy"],
    whenToUse: "Understanding why users choose you or a competitor, and finding gaps in a market.",
    steps: [
      { name: "Situation", detail: "When I'm… (the context that triggers the need)." },
      { name: "Motivation", detail: "I want to… (the progress they're trying to make)." },
      { name: "Outcome", detail: "So I can… (the result that counts as success)." },
      { name: "Competing solutions", detail: "What else could do the job, including doing nothing." },
    ],
    example:
      "When I'm bored on my commute, I want quick content from friends, so I can feel connected without effort. Competing: Snapchat, TikTok, texting, podcasts.",
    pitfalls: ["Describing a feature instead of the user's progress."],
  },
  {
    slug: "competitive-response",
    name: "Competitive response",
    oneLiner: "Decide whether to copy, differentiate or ignore a competitor's move.",
    tracks: ["strategy"],
    whenToUse: "\"Competitor X launched Y. What should we do?\"",
    steps: [
      { name: "Size the threat", detail: "Which of our users and use cases does it attract? Is it growing?" },
      { name: "Assess our right to win", detail: "Distribution, network, data, brand: what do we have that they don't?" },
      { name: "Choose a response", detail: "Copy and out-distribute, differentiate, partner or acquire, or ignore." },
      { name: "Name the risks", detail: "Cannibalization, brand damage, distraction from the core product." },
      { name: "Define success", detail: "The metric that tells you within a quarter whether the response worked." },
    ],
    example:
      "Instagram vs Snapchat Stories: Instagram's follower graph was much larger, so copying the format and offering it to that existing network was the edge.",
    pitfalls: ["Copying without a distribution advantage; you just become the second-best version."],
  },
];

export function getFramework(slug: string): Framework | undefined {
  return frameworks.find((f) => f.slug === slug);
}
