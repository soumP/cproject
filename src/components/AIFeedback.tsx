"use client";

import { useEffect, useState } from "react";
import type { RubricItem } from "@/content/types";
import type { Feedback } from "@/lib/feedback";

const VERDICT_LABEL = { met: "Covered", partly: "Partly", missed: "Missed" } as const;

function storageKey(slug: string) {
  return `pmpanels:feedback:${slug}`;
}

interface Saved {
  answer: string;
  feedback: Feedback;
}

export function AIFeedback({ slug, answer, rubric }: { slug: string; answer: string; rubric: RubricItem[] }) {
  const [enabled, setEnabled] = useState<boolean | null>(null);
  const [feedback, setFeedback] = useState<Feedback | null>(null);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    fetch("/api/feedback")
      .then((r) => r.json())
      .then((d: { enabled: boolean }) => setEnabled(d.enabled))
      .catch(() => setEnabled(false));
    try {
      const raw = window.localStorage.getItem(storageKey(slug));
      const saved = raw ? (JSON.parse(raw) as Saved) : null;
      if (saved && saved.answer === answer) setFeedback(saved.feedback);
    } catch {
      // No saved feedback.
    }
  }, [slug, answer]);

  async function requestFeedback() {
    setLoading(true);
    setError(null);
    try {
      const res = await fetch("/api/feedback", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ slug, answer }),
      });
      const data = await res.json();
      if (!res.ok) throw new Error(data.error ?? "Something went wrong.");
      setFeedback(data as Feedback);
      try {
        window.localStorage.setItem(storageKey(slug), JSON.stringify({ answer, feedback: data } satisfies Saved));
      } catch {
        // Feedback just won't persist.
      }
    } catch (e) {
      setError(e instanceof Error ? e.message : "Something went wrong.");
    } finally {
      setLoading(false);
    }
  }

  if (!answer.trim()) return null;
  if (enabled === false) {
    return (
      <div className="ai-box ai-off">
        <strong>AI feedback</strong>
        <p className="muted small">
          Not set up on this site yet. The site owner can turn it on by adding an Anthropic API key.
        </p>
      </div>
    );
  }

  const label = (id: string) => rubric.find((r) => r.id === id)?.label ?? id;

  return (
    <div className="ai-box" aria-live="polite">
      <div className="ai-head">
        <div>
          <span className="stamp stamp-ai">AI interviewer</span>
          <h3>Get feedback on your answer</h3>
          {!feedback && (
            <p className="muted small">
              An AI interviewer reads your answer, checks it against the rubric, and explains what to improve.
            </p>
          )}
        </div>
        {!feedback && (
          <button type="button" className="btn btn-primary" onClick={requestFeedback} disabled={loading || enabled === null}>
            {loading ? "Reading your answer…" : "Grade my answer"}
          </button>
        )}
      </div>

      {loading && (
        <div className="ai-loading" aria-hidden="true">
          <span />
          <span />
          <span />
        </div>
      )}
      {error && <p className="ai-error">{error}</p>}

      {feedback && (
        <div className="ai-result">
          <div className="ai-score">
            <span className="ai-score-num">
              {feedback.score}
              <small>/10</small>
            </span>
            <p className="ai-headline">&ldquo;{feedback.headline}&rdquo;</p>
          </div>

          <ul className="ai-criteria">
            {feedback.criteria.map((c) => (
              <li key={c.id}>
                <span className={`verdict verdict-${c.verdict}`}>{VERDICT_LABEL[c.verdict]}</span>
                <div>
                  <strong>{label(c.id)}</strong>
                  <p>{c.explanation}</p>
                </div>
              </li>
            ))}
          </ul>

          <div className="ai-cols">
            {feedback.strengths.length > 0 && (
              <div>
                <h4>What worked</h4>
                <ul>
                  {feedback.strengths.map((s) => (
                    <li key={s}>{s}</li>
                  ))}
                </ul>
              </div>
            )}
            {feedback.improvements.length > 0 && (
              <div>
                <h4>Fix next time</h4>
                <ol>
                  {feedback.improvements.map((s) => (
                    <li key={s}>{s}</li>
                  ))}
                </ol>
              </div>
            )}
          </div>

          {feedback.improvedOutline.length > 0 && (
            <div className="ai-outline">
              <h4>A stronger version of your answer</h4>
              <ol>
                {feedback.improvedOutline.map((s) => (
                  <li key={s}>{s}</li>
                ))}
              </ol>
            </div>
          )}
          <p className="muted small">
            AI feedback can be wrong. Use it as a second opinion, not a final grade.
          </p>
        </div>
      )}
    </div>
  );
}
