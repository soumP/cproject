export type TrackId =
  | "product-sense"
  | "metrics"
  | "root-cause"
  | "prioritization"
  | "strategy"
  | "execution"
  | "behavioral";

export type Difficulty = "APM" | "PM" | "Senior PM";

/** Who is speaking in a panel. Each maps to an illustrated persona. */
export type Speaker = "pm" | "interviewer" | "engineer" | "user" | "analyst" | "narrator";

/** Optional illustration rendered inside a panel. */
export type Visual =
  | { kind: "metric"; label: string; value: string; delta?: string; trend?: "up" | "down" | "flat" }
  | { kind: "chart"; label: string; points: number[]; markAt?: number; markLabel?: string }
  | { kind: "screen"; title: string; lines: string[] }
  | { kind: "list"; title?: string; items: string[] }
  | {
      kind: "table";
      columns: string[];
      rows: string[][];
      highlightRow?: number;
    }
  | { kind: "tree"; root: string; branches: { label: string; leaves: string[] }[] };

export interface Panel {
  speaker: Speaker;
  text: string;
  visual?: Visual;
  /** A margin note that names the skill or framework being used. */
  callout?: { label: string; framework?: string };
}

export interface BreakdownStep {
  title: string;
  framework?: string;
  panels: Panel[];
}

export interface RubricItem {
  id: string;
  label: string;
  /** What a strong answer looks like for this criterion. */
  detail: string;
}

export interface CaseStudy {
  slug: string;
  title: string;
  company: string;
  track: TrackId;
  difficulty: Difficulty;
  readMinutes: number;
  summary: string;
  /** True when the company/numbers are invented for practice. */
  fictional: boolean;
  publishedAt: string;
  setup: Panel[];
  prompt: { question: string; hints: string[] };
  breakdown: BreakdownStep[];
  outcome: { heading: string; panels: Panel[]; sources?: string[] };
  takeaway: {
    strong: string[];
    weak: string[];
    followUps: string[];
  };
  rubric: RubricItem[];
  frameworks: string[];
}

export interface Framework {
  slug: string;
  name: string;
  oneLiner: string;
  tracks: TrackId[];
  whenToUse: string;
  steps: { name: string; detail: string }[];
  example: string;
  pitfalls: string[];
}

export interface Track {
  id: TrackId;
  name: string;
  blurb: string;
  sampleQuestion: string;
}
