import type { CaseStudy } from "../types";

export const spotifyWrapped: CaseStudy = {
  slug: "measure-spotify-wrapped",
  title: "How would you measure the success of Spotify Wrapped?",
  company: "Spotify",
  track: "metrics",
  difficulty: "PM",
  readMinutes: 7,
  summary:
    "A classic metrics question about a feature everyone knows. Practice tying metrics to the goal, choosing one North Star, and protecting it with guardrails.",
  fictional: false,
  publishedAt: "2026-10-13",
  setup: [
    {
      speaker: "narrator",
      text: "Every December, Spotify gives each listener a personalised recap of their year: top songs, artists and genres, presented as tap-through story cards.",
      visual: {
        kind: "screen",
        title: "Your year in music",
        lines: ["Top artist: ▇▇▇▇▇", "Minutes listened: 41,203", "Top genre: Indie pop", "[ Share to Stories ]"],
      },
    },
    {
      speaker: "user",
      text: "I look forward to it every year. I screenshot every card and post them.",
    },
    {
      speaker: "interviewer",
      text: "You're the PM for Wrapped. How would you measure whether it's successful?",
    },
  ],
  prompt: {
    question: "Define the success metrics for Spotify Wrapped. Pick one North Star metric and explain why.",
    hints: [
      "Why does Spotify build Wrapped at all? What's the business goal?",
      "Is it for existing users, new users, or both?",
      "What could look like success but actually be bad?",
    ],
  },
  breakdown: [
    {
      title: "1. Start with the goal, not the metric",
      panels: [
        {
          speaker: "pm",
          text: "Before picking metrics: why does Wrapped exist? I'd say there are three goals.",
          visual: {
            kind: "list",
            title: "Goals",
            items: [
              "Delight existing users → retention",
              "Free marketing through sharing → acquisition",
              "Remind people how much Spotify knows their taste → loyalty and Premium",
            ],
          },
          callout: { label: "Metrics follow goals" },
        },
        {
          speaker: "interviewer",
          text: "Good. If you had to choose one goal, which?",
        },
        {
          speaker: "pm",
          text: "Sharing. It's what makes Wrapped different from a normal feature. Each share is a free ad seen by people who might not use Spotify.",
        },
      ],
    },
    {
      title: "2. Map the user journey",
      framework: "aarrr",
      panels: [
        {
          speaker: "pm",
          text: "A user's path through Wrapped has clear steps I can measure.",
          visual: {
            kind: "table",
            columns: ["Step", "Metric"],
            rows: [
              ["Opens Wrapped", "% of monthly users who open it"],
              ["Completes it", "% who reach the last card"],
              ["Shares it", "Shares per viewer"],
              ["Friend sees share", "Clicks from shared cards"],
              ["Friend signs up", "Sign-ups attributed to Wrapped"],
            ],
            highlightRow: 2,
          },
        },
      ],
    },
    {
      title: "3. Pick the North Star",
      framework: "north-star",
      panels: [
        {
          speaker: "pm",
          text: "North Star: number of users who share at least one Wrapped card. It captures both delight (you only share what you like) and reach.",
          visual: { kind: "metric", label: "North Star", value: "Unique sharers", trend: "up" },
          callout: { label: "One metric that captures user value + business value", framework: "north-star" },
        },
        {
          speaker: "pm",
          text: "Input metrics: open rate, completion rate, and shares per sharer. These tell the team which lever to improve.",
        },
      ],
    },
    {
      title: "4. Add guardrails",
      panels: [
        {
          speaker: "pm",
          text: "Guardrails stop the team from winning in the wrong way.",
          visual: {
            kind: "list",
            title: "Guardrails",
            items: [
              "App performance in launch week (crashes, load time)",
              "Complaints about accuracy or privacy",
              "January listening: did engagement fall back below normal?",
            ],
          },
          callout: { label: "Guardrails: things that must not get worse" },
        },
        {
          speaker: "interviewer",
          text: "Why January listening?",
        },
        {
          speaker: "pm",
          text: "A one-week spike is easy. The real goal is that people feel closer to Spotify afterwards. If January is normal or better, Wrapped helped loyalty.",
        },
      ],
    },
  ],
  outcome: {
    heading: "What actually happened",
    panels: [
      {
        speaker: "narrator",
        text: "Wrapped became one of the most shared product moments online each December, with the story-card format designed for posting on social media.",
      },
      {
        speaker: "narrator",
        text: "Other products launched their own yearly recaps, including Apple Music Replay and YouTube Music Recap. When competitors copy a feature, that is usually a sign it is working.",
      },
    ],
    sources: ["Spotify's yearly Wrapped announcements", "Public coverage of competing recap features"],
  },
  takeaway: {
    strong: [
      "States the goal before naming any metric.",
      "Chooses one North Star and explains the trade-off.",
      "Separates input metrics from the North Star.",
      "Thinks about long-term effects (January), not just the launch spike.",
    ],
    weak: [
      "Lists 12 metrics without choosing one.",
      "Picks 'number of views', which says nothing about value.",
      "Forgets guardrails such as performance or privacy.",
    ],
    followUps: [
      "Shares are flat this year but opens are up 20%. Good or bad?",
      "How would you measure Wrapped's effect on Premium sign-ups?",
      "How would you A/B test a change to Wrapped when it launches once a year?",
    ],
  },
  rubric: [
    { id: "goal", label: "Stated the goal first", detail: "Explained why Wrapped exists before picking metrics." },
    { id: "funnel", label: "Mapped the journey", detail: "Open → complete → share → new user." },
    { id: "northstar", label: "Chose one North Star", detail: "A single metric with a reason for it." },
    { id: "guardrail", label: "Added guardrails", detail: "Performance, privacy/trust or long-term engagement." },
    { id: "tradeoff", label: "Discussed trade-offs", detail: "Why this metric over the alternatives." },
  ],
  frameworks: ["north-star", "aarrr", "heart"],
};
