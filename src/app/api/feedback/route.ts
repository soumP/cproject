import Anthropic from "@anthropic-ai/sdk";
import { betaZodOutputFormat } from "@anthropic-ai/sdk/helpers/beta/zod";
import { NextResponse } from "next/server";
import { getCaseStudy } from "@/content";
import { FeedbackSchema, MAX_ANSWER_CHARS, SYSTEM_PROMPT, buildReference } from "@/lib/feedback";

const MODEL = "claude-opus-5-5";

// Simple per-IP limit so a public deployment can't be used to run up the API bill.
// In-memory, so it resets on redeploy and is per-instance; swap for Redis/KV at scale.
const WINDOW_MS = 60 * 60 * 1000;
const MAX_PER_WINDOW = 20;
const hits = new Map<string, number[]>();

function rateLimited(ip: string): boolean {
  const now = Date.now();
  const recent = (hits.get(ip) ?? []).filter((t) => now - t < WINDOW_MS);
  recent.push(now);
  hits.set(ip, recent);
  return recent.length > MAX_PER_WINDOW;
}

export async function GET() {
  return NextResponse.json({ enabled: Boolean(process.env.ANTHROPIC_API_KEY) });
}

export async function POST(req: Request) {
  if (!process.env.ANTHROPIC_API_KEY) {
    return NextResponse.json({ error: "AI feedback isn't set up on this site yet." }, { status: 503 });
  }

  let body: { slug?: unknown; answer?: unknown };
  try {
    body = await req.json();
  } catch {
    return NextResponse.json({ error: "Invalid request." }, { status: 400 });
  }

  const cs = typeof body.slug === "string" ? getCaseStudy(body.slug) : undefined;
  const answer = typeof body.answer === "string" ? body.answer.trim() : "";
  if (!cs) return NextResponse.json({ error: "Unknown case study." }, { status: 404 });
  if (answer.split(/\s+/).length < 20) {
    return NextResponse.json({ error: "Write at least 20 words to get feedback." }, { status: 400 });
  }
  if (answer.length > MAX_ANSWER_CHARS) {
    return NextResponse.json({ error: `Keep your answer under ${MAX_ANSWER_CHARS} characters.` }, { status: 400 });
  }

  const ip = req.headers.get("x-forwarded-for")?.split(",")[0]?.trim() || "local";
  if (rateLimited(ip)) {
    return NextResponse.json({ error: "You've hit the hourly feedback limit. Try again later." }, { status: 429 });
  }

  const client = new Anthropic();

  try {
    const response = await client.beta.messages.parse({
      model: MODEL,
      max_tokens: 16000,
      betas: ["server-side-fallback-2026-07-01"],
      fallbacks: "default",
      output_config: { effort: "medium", format: betaZodOutputFormat(FeedbackSchema) },
      system: SYSTEM_PROMPT,
      messages: [
        {
          role: "user",
          content: `${buildReference(cs)}

<candidate_answer>
${answer}
</candidate_answer>

Grade the candidate's answer. Return one entry in "criteria" for every rubric id, in rubric order.`,
        },
      ],
    });

    if (response.stop_reason === "refusal") {
      return NextResponse.json({ error: "Couldn't grade this answer. Try rephrasing it." }, { status: 422 });
    }
    if (!response.parsed_output) {
      return NextResponse.json({ error: "Feedback came back incomplete. Please try again." }, { status: 502 });
    }

    // Keep only known rubric ids, in rubric order.
    const byId = new Map(response.parsed_output.criteria.map((c) => [c.id, c]));
    const criteria = cs.rubric.map(
      (r) => byId.get(r.id) ?? { id: r.id, verdict: "missed" as const, explanation: "Not assessed." },
    );
    const score = Math.min(10, Math.max(1, Math.round(response.parsed_output.score)));

    return NextResponse.json({ ...response.parsed_output, criteria, score });
  } catch (error) {
    if (error instanceof Anthropic.RateLimitError) {
      return NextResponse.json({ error: "The AI is busy right now. Try again in a minute." }, { status: 429 });
    }
    if (error instanceof Anthropic.APIError) {
      console.error(`Feedback API error ${error.status}:`, error.message);
      return NextResponse.json({ error: "Feedback is unavailable right now." }, { status: 502 });
    }
    console.error("Feedback error:", error);
    return NextResponse.json({ error: "Something went wrong." }, { status: 500 });
  }
}
