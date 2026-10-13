import type { Track, TrackId } from "./types";

export const tracks: Track[] = [
  {
    id: "product-sense",
    name: "Product sense",
    blurb: "Pick a user, find the pain, design something worth building.",
    sampleQuestion: "Design a product to help people find a roommate.",
  },
  {
    id: "metrics",
    name: "Metrics",
    blurb: "Define success, pick a north star, protect it with guardrails.",
    sampleQuestion: "How would you measure the success of Spotify Wrapped?",
  },
  {
    id: "root-cause",
    name: "Root cause",
    blurb: "A number moved. Find out why before anyone panics.",
    sampleQuestion: "Daily active users dropped 8% last week. What do you do?",
  },
  {
    id: "prioritization",
    name: "Prioritization",
    blurb: "Too many good ideas, not enough engineers. Choose and defend it.",
    sampleQuestion: "You can ship two of these five features. Which ones?",
  },
  {
    id: "strategy",
    name: "Strategy",
    blurb: "Competitors, markets and bets. Where to play and how to win.",
    sampleQuestion: "Should Instagram copy Snapchat Stories?",
  },
  {
    id: "execution",
    name: "Execution",
    blurb: "Launches, experiments and trade-offs under real deadlines.",
    sampleQuestion: "Your A/B test is positive but support tickets doubled. Ship?",
  },
  {
    id: "behavioral",
    name: "Behavioral",
    blurb: "Conflict, failure and influence, told as stories that land.",
    sampleQuestion: "Tell me about a time you disagreed with engineering.",
  },
];

export function getTrack(id: TrackId): Track {
  const track = tracks.find((t) => t.id === id);
  if (!track) throw new Error(`Unknown track: ${id}`);
  return track;
}
