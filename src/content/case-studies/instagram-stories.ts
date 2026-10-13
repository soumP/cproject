import type { CaseStudy } from "../types";

export const instagramStories: CaseStudy = {
  slug: "instagram-copies-stories",
  title: "Snapchat is winning with teens. Should Instagram copy Stories?",
  company: "Instagram",
  track: "strategy",
  difficulty: "PM",
  readMinutes: 8,
  summary:
    "A real strategy decision. Practice sizing a competitive threat, finding your right to win, and deciding whether copying is a smart move or a weak one.",
  fictional: false,
  publishedAt: "2026-10-13",
  setup: [
    {
      speaker: "narrator",
      text: "2016. Snapchat Stories, a feed of photos and videos that vanish after 24 hours, is popular with younger users.",
    },
    {
      speaker: "user",
      text: "I post the real stuff on Snapchat. Instagram is for the perfect photos. It feels like a lot of pressure to post there.",
      callout: { label: "The user insight: posting on Instagram felt high-stakes" },
    },
    {
      speaker: "interviewer",
      text: "You're a PM at Instagram. Leadership asks: should we build our own version of Stories?",
    },
  ],
  prompt: {
    question: "Should Instagram launch a Stories feature that closely copies Snapchat's? Make a recommendation and defend it.",
    hints: [
      "What job is Snapchat Stories doing for users that Instagram isn't?",
      "What does Instagram have that Snapchat doesn't?",
      "What could go wrong, and how would you know within a few months whether it's working?",
    ],
  },
  breakdown: [
    {
      title: "1. Understand the job users are hiring Stories for",
      framework: "jtbd",
      panels: [
        {
          speaker: "pm",
          text: "When I'm doing something fun, I want to share it casually, so friends see it without it becoming a permanent part of my profile.",
          callout: { label: "Jobs to be Done", framework: "jtbd" },
        },
        {
          speaker: "pm",
          text: "Instagram's feed does a different job: a polished, permanent highlight reel. So users post less on Instagram, and casual sharing moves elsewhere.",
        },
      ],
    },
    {
      title: "2. Size the threat",
      framework: "competitive-response",
      panels: [
        {
          speaker: "pm",
          text: "If casual daily sharing happens on Snapchat, Snapchat gets the daily habit. Over time that can pull attention and posting away from Instagram.",
          visual: {
            kind: "list",
            title: "Risk if we do nothing",
            items: [
              "Fewer posts per user as posting feels 'too serious'",
              "Younger users build their daily habit elsewhere",
              "Less fresh content means less reason to open Instagram",
            ],
          },
        },
      ],
    },
    {
      title: "3. Find our right to win",
      panels: [
        {
          speaker: "pm",
          text: "Copying only works if we have an advantage. Ours is distribution: a much larger network of people who already follow each other.",
          callout: { label: "Copying without an edge just makes you second best" },
          visual: {
            kind: "table",
            columns: ["", "Snapchat", "Instagram"],
            rows: [
              ["Format", "Invented Stories", "Would be a copy"],
              ["Network", "Close friends", "Much larger follower graph"],
              ["Creators & brands", "Few", "Many already present"],
            ],
          },
        },
      ],
    },
    {
      title: "4. Decide, name the risks, define success",
      panels: [
        {
          speaker: "pm",
          text: "Recommendation: yes. Launch Stories at the top of the main feed, so every user sees it without having to learn a new app.",
        },
        {
          speaker: "pm",
          text: "Risks: press saying we copied, and Stories taking posts away from the feed. I'd accept that if total sharing goes up.",
          visual: {
            kind: "list",
            title: "Success metrics",
            items: [
              "North Star: daily users who post or view a Story",
              "Input: share of users who post their first Story within 7 days",
              "Guardrail: feed posts and time in feed don't collapse",
            ],
          },
          callout: { label: "North Star + guardrails", framework: "north-star" },
        },
      ],
    },
  ],
  outcome: {
    heading: "What actually happened",
    panels: [
      {
        speaker: "narrator",
        text: "Instagram launched Stories in August 2016. Its co-founder publicly acknowledged that Snapchat deserved credit for the format.",
      },
      {
        speaker: "narrator",
        text: "Instagram Stories passed 100 million daily users within months. By 2017, it reported more daily Stories users than Snapchat had daily users overall.",
        visual: { kind: "metric", label: "Instagram Stories daily users, mid-2017", value: "250M+", trend: "up" },
      },
      {
        speaker: "interviewer",
        text: "The lesson: copying a feature can work when you have a distribution advantage that the original company cannot match.",
      },
    ],
    sources: [
      "Instagram product announcement, August 2016",
      "Widely reported company milestones (e.g. TechCrunch, The Verge), 2016–2017",
    ],
  },
  takeaway: {
    strong: [
      "Starts from the user job, not from the competitor's feature.",
      "Explains the specific advantage that makes copying work.",
      "Gives a clear yes/no recommendation.",
      "Names cannibalization and brand risk, and how to measure them.",
    ],
    weak: [
      "\"Yes, because Snapchat is popular.\"",
      "Refuses to decide (\"it depends\") without picking a side.",
      "Ignores the effect on the existing feed.",
    ],
    followUps: [
      "Snapchat responds by improving its camera and filters. What now?",
      "How would you decide where in the app Stories should appear?",
      "When would copying a competitor be the wrong move?",
    ],
  },
  rubric: [
    { id: "user", label: "Identified the user need", detail: "Explained why casual, temporary sharing matters to users." },
    { id: "threat", label: "Sized the threat", detail: "Explained what Instagram loses if it does nothing." },
    { id: "edge", label: "Named the right to win", detail: "Distribution / network size as the advantage." },
    { id: "decision", label: "Made a clear decision", detail: "A yes or no, with reasoning." },
    { id: "metrics", label: "Defined success and risks", detail: "A North Star metric plus a guardrail for the feed." },
  ],
  frameworks: ["competitive-response", "jtbd", "north-star"],
};
