import type { CaseStudy } from "../types";

export const prioritizeRoadmap: CaseStudy = {
  slug: "food-delivery-prioritization",
  title: "Five features, room for two. What do you ship?",
  company: "Dabba (fictional food delivery app)",
  track: "prioritization",
  difficulty: "APM",
  readMinutes: 6,
  summary:
    "Your team can build two of five ideas this quarter. Practice tying choices to a goal, scoring them honestly, and explaining what you're saying no to.",
  fictional: true,
  publishedAt: "2026-10-13",
  setup: [
    {
      speaker: "narrator",
      text: "Dabba is a food delivery app. The company goal this quarter: increase repeat orders (customers who order again within 30 days).",
    },
    {
      speaker: "engineer",
      text: "We have about 10 engineer-weeks this quarter. Here are the five ideas people have asked for.",
      visual: {
        kind: "list",
        title: "Candidate features",
        items: [
          "A. One-tap reorder of a past meal",
          "B. Live chat with the delivery rider",
          "C. Loyalty points on every order",
          "D. Dark mode",
          "E. Group ordering for offices",
        ],
      },
    },
    {
      speaker: "interviewer",
      text: "Which two would you build, and why?",
    },
  ],
  prompt: {
    question: "Pick two of the five features for this quarter. Explain how you decided and what you'd tell the people whose ideas you didn't pick.",
    hints: [
      "Which features actually affect the quarter's goal: repeat orders?",
      "How many users does each affect, and how much effort is it?",
      "How confident are you in each estimate?",
    ],
  },
  breakdown: [
    {
      title: "1. Anchor on the goal",
      panels: [
        {
          speaker: "pm",
          text: "The goal is repeat orders. Any feature has to make it easier or more appealing to order again. That removes a few ideas quickly.",
          callout: { label: "Filter by the goal before scoring" },
        },
        {
          speaker: "pm",
          text: "Dark mode is nice but won't change ordering. Rider chat helps during an order, not with coming back. Both drop down the list.",
        },
      ],
    },
    {
      title: "2. Score what's left",
      framework: "rice",
      panels: [
        {
          speaker: "pm",
          text: "I'll estimate RICE using rough numbers. Reach is monthly users affected; effort is engineer-weeks.",
          visual: {
            kind: "table",
            columns: ["Feature", "Reach", "Impact", "Conf.", "Effort", "Score"],
            rows: [
              ["A. One-tap reorder", "400k", "2", "80%", "3", "213k"],
              ["C. Loyalty points", "500k", "1", "50%", "6", "42k"],
              ["E. Group ordering", "40k", "2", "50%", "5", "8k"],
              ["B. Rider chat", "300k", "0.5", "80%", "4", "30k"],
              ["D. Dark mode", "200k", "0.25", "100%", "2", "25k"],
            ],
            highlightRow: 0,
          },
          callout: { label: "RICE = Reach × Impact × Confidence ÷ Effort", framework: "rice" },
        },
      ],
    },
    {
      title: "3. Sanity-check the scores",
      panels: [
        {
          speaker: "pm",
          text: "Reorder is the clear first pick: high reach, cheap, and directly about ordering again.",
        },
        {
          speaker: "pm",
          text: "Loyalty points score second, but my confidence is low and it costs money per order. I'd run a small test with a 6-week budget rather than a full build.",
          callout: { label: "The score is an input, not the decision" },
        },
        {
          speaker: "interviewer",
          text: "That's 9 weeks. What about the last week?",
        },
        {
          speaker: "pm",
          text: "Keep it as a buffer for bugs. Teams that plan for 100% of their time usually miss deadlines.",
        },
      ],
    },
    {
      title: "4. Say no clearly",
      panels: [
        {
          speaker: "pm",
          text: "For the features I didn't pick, I'd explain the reason and what would change my mind.",
          visual: {
            kind: "list",
            title: "Communicating the no",
            items: [
              "Group ordering: promising for B2B, revisit if office orders grow",
              "Rider chat: support team's top request; track complaints about late orders",
              "Dark mode: a good small task for a new engineer later",
            ],
          },
          callout: { label: "A good 'no' includes what would change your mind" },
        },
      ],
    },
  ],
  outcome: {
    heading: "How this scenario resolves",
    panels: [
      {
        speaker: "narrator",
        text: "In this scenario there is no single right answer. Interviewers want to see that your choices follow from the goal, your estimates are honest, and you can explain the trade-offs.",
      },
      {
        speaker: "interviewer",
        text: "Candidates who pick group ordering can still do well if they argue convincingly that office customers order again more often. The reasoning matters most.",
      },
    ],
  },
  takeaway: {
    strong: [
      "Restates the goal and filters ideas against it first.",
      "Uses a scoring method but questions the result.",
      "Turns an uncertain idea into a small experiment.",
      "Explains what's not being built and why.",
    ],
    weak: [
      "Picks the features they personally like.",
      "Treats the RICE score as the final answer.",
      "Ignores effort or the team's capacity.",
    ],
    followUps: [
      "The CEO really wants loyalty points. How do you respond?",
      "Reorder ships and repeat orders don't move. What next?",
      "How would you estimate reach without data?",
    ],
  },
  rubric: [
    { id: "goal", label: "Anchored on the goal", detail: "Used 'repeat orders' to filter the list." },
    { id: "method", label: "Used a clear method", detail: "RICE, impact/effort or similar, applied consistently." },
    { id: "judgment", label: "Applied judgment beyond the score", detail: "Questioned confidence, cost or strategy." },
    { id: "capacity", label: "Respected capacity", detail: "Fit choices into the 10 engineer-weeks." },
    { id: "comms", label: "Explained the no", detail: "Said how they'd communicate the features that weren't chosen." },
  ],
  frameworks: ["rice", "north-star"],
};
