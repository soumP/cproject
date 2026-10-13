import type { CaseStudy } from "../types";

export const dauDrop: CaseStudy = {
  slug: "language-app-dau-drop",
  title: "Daily users fell 8% overnight. What do you do?",
  company: "Parlo (fictional language app)",
  track: "root-cause",
  difficulty: "APM",
  readMinutes: 7,
  summary:
    "The most common root-cause question in PM interviews. Practice checking the data, splitting internal vs external causes, and narrowing by segment before guessing.",
  fictional: true,
  publishedAt: "2026-10-13",
  setup: [
    {
      speaker: "narrator",
      text: "Monday, 9:04 am. Parlo is a language-learning app with daily streaks. You are the PM for the Learning team.",
    },
    {
      speaker: "analyst",
      text: "Heads up. DAU fell 8% week over week. Leadership is asking what happened.",
      visual: {
        kind: "metric",
        label: "Daily active users",
        value: "4.6M",
        delta: "−8% WoW",
        trend: "down",
      },
    },
    {
      speaker: "interviewer",
      text: "That's the scenario. You have about 15 minutes. Walk me through how you'd investigate.",
    },
  ],
  prompt: {
    question: "Parlo's DAU dropped 8% week over week. How would you find the cause, and what would you do next?",
    hints: [
      "Before looking for causes, how would you check the drop is real?",
      "Which causes come from outside the company, and which from inside?",
      "Which ways could you split the users to find where the drop is concentrated?",
    ],
  },
  breakdown: [
    {
      title: "1. Clarify before you hypothesize",
      framework: "root-cause-tree",
      panels: [
        {
          speaker: "pm",
          text: "First, a few questions. How do we define an active user: opened the app, or finished a lesson? Was the drop sudden or gradual?",
          callout: { label: "Clarify the metric", framework: "root-cause-tree" },
        },
        {
          speaker: "interviewer",
          text: "Opened the app. It was sudden: flat all month, then it fell from Thursday.",
          visual: {
            kind: "chart",
            label: "DAU, last 21 days",
            points: [100, 101, 100, 102, 101, 100, 101, 102, 100, 101, 102, 101, 100, 101, 93, 92, 92, 91, 92, 92, 92],
            markAt: 14,
            markLabel: "Thursday",
          },
        },
        {
          speaker: "pm",
          text: "A sudden step down usually means a specific event, such as a release, an outage or a tracking change, not a slow trend like competition.",
          callout: { label: "Sudden vs gradual narrows the search" },
        },
      ],
    },
    {
      title: "2. Check the data is real",
      panels: [
        {
          speaker: "pm",
          text: "Before anything else: did anything change in how we log or count sessions? Do other metrics like lesson completions and revenue show the same drop?",
        },
        {
          speaker: "analyst",
          text: "Logging is unchanged. Lessons completed dropped too, by about 9%. It's real.",
          callout: { label: "Two independent metrics agree → probably not a tracking bug" },
        },
      ],
    },
    {
      title: "3. External vs internal causes",
      framework: "root-cause-tree",
      panels: [
        {
          speaker: "pm",
          text: "Let me lay out the possible causes so we can rule them out one by one.",
          visual: {
            kind: "tree",
            root: "DAU −8%",
            branches: [
              { label: "External", leaves: ["Holiday or seasonality", "Competitor launch", "OS update / app store issue", "News or PR event"] },
              { label: "Internal", leaves: ["New app release", "Experiment rollout", "Notification changes", "Outage or slow load"] },
            ],
          },
        },
        {
          speaker: "interviewer",
          text: "No holidays, no big competitor news, and no outages. We did ship Android version 5.2 on Wednesday night.",
        },
      ],
    },
    {
      title: "4. Segment to find where it's concentrated",
      panels: [
        {
          speaker: "pm",
          text: "Then I'd split DAU by platform, app version, country and new vs returning users.",
          visual: {
            kind: "table",
            columns: ["Segment", "Change WoW"],
            rows: [
              ["iOS", "−0.5%"],
              ["Android, v5.1", "−0.8%"],
              ["Android, v5.2", "−21%"],
              ["New users (all)", "−1%"],
              ["Returning users (all)", "−9%"],
            ],
            highlightRow: 2,
          },
          callout: { label: "Segmenting turns a vague drop into a specific one" },
        },
        {
          speaker: "pm",
          text: "The drop is almost entirely returning Android users on 5.2. What changed in that release that affects returning users?",
        },
        {
          speaker: "engineer",
          text: "5.2 moved the notification permission prompt to after the first lesson, because of a new Android requirement.",
        },
      ],
    },
    {
      title: "5. Confirm, act, prevent",
      framework: "five-whys",
      panels: [
        {
          speaker: "analyst",
          text: "Confirmed: on 5.2, users with streak reminders turned on fell 60%. Those reminders drive most daily opens.",
          visual: { kind: "metric", label: "Reminder opt-in, Android 5.2", value: "31%", delta: "−60%", trend: "down" },
        },
        {
          speaker: "pm",
          text: "Short term: hotfix to re-ask existing users for permission with a clear 'protect your streak' explanation. Long term: alerts on opt-in rate for every release.",
          visual: {
            kind: "list",
            title: "Plan",
            items: [
              "Today: pause the 5.2 rollout",
              "This week: hotfix with a better permission screen",
              "Tell leadership: cause, size, fix and expected recovery date",
              "Prevent: add an alert on notification opt-in rate",
            ],
          },
          callout: { label: "End with action and prevention, not just the cause" },
        },
      ],
    },
  ],
  outcome: {
    heading: "How this scenario resolves",
    panels: [
      {
        speaker: "narrator",
        text: "In this practice scenario, the hotfix shipped Friday and DAU recovered within about two weeks as users updated. The bigger win was the new release alert, which catches the next drop before leadership does.",
      },
      {
        speaker: "interviewer",
        text: "In real interviews there is usually one planted cause. The interviewer is grading your process: checking data, structuring causes, segmenting and closing with a plan.",
      },
    ],
  },
  takeaway: {
    strong: [
      "Clarifies the metric definition and the shape of the drop first.",
      "Checks for tracking problems before investigating causes.",
      "Uses a clear structure (external vs internal) and rules things out.",
      "Segments to find where the drop is concentrated.",
      "Ends with a fix, communication to stakeholders and prevention.",
    ],
    weak: [
      "Jumps straight to 'maybe a competitor launched something'.",
      "Lists 15 possible causes with no way to narrow them down.",
      "Finds the cause but gives no plan.",
    ],
    followUps: [
      "What if the drop were on all platforms, not just Android?",
      "What if the drop were only new users?",
      "How would you decide between a rollback and a hotfix?",
    ],
  },
  rubric: [
    { id: "clarify", label: "Clarified the metric and timeline", detail: "Asked how DAU is defined and whether the drop was sudden or gradual." },
    { id: "data", label: "Checked data accuracy", detail: "Ruled out logging or dashboard changes and cross-checked another metric." },
    { id: "structure", label: "Structured the causes", detail: "Split into internal vs external (or similar) rather than a random list." },
    { id: "segment", label: "Segmented users", detail: "Platform, version, geography, new vs returning." },
    { id: "plan", label: "Gave an action plan", detail: "Fix, communicate, and prevent it happening again." },
  ],
  frameworks: ["root-cause-tree", "five-whys", "aarrr"],
};
