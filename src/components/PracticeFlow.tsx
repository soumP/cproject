"use client";

import { useEffect, useState, type ReactNode } from "react";
import type { RubricItem } from "@/content/types";
import { clearAttempt, loadAttempt, saveAttempt } from "./storage";

const MIN_WORDS = 30;

interface Props {
  slug: string;
  question: string;
  hints: string[];
  rubric: RubricItem[];
  /** The breakdown, outcome and takeaways — hidden until the reader commits. */
  children: ReactNode;
}

export function PracticeFlow({ slug, question, hints, rubric, children }: Props) {
  const [answer, setAnswer] = useState("");
  const [revealed, setRevealed] = useState(false);
  const [checked, setChecked] = useState<string[]>([]);
  const [hintsShown, setHintsShown] = useState(0);
  const [loaded, setLoaded] = useState(false);

  useEffect(() => {
    const saved = loadAttempt(slug);
    if (saved) {
      setAnswer(saved.answer);
      setRevealed(saved.revealed);
      setChecked(saved.checked);
    }
    setLoaded(true);
  }, [slug]);

  useEffect(() => {
    if (loaded) saveAttempt(slug, { answer, revealed, checked });
  }, [slug, answer, revealed, checked, loaded]);

  const words = answer.trim() ? answer.trim().split(/\s+/).length : 0;

  function reveal() {
    setRevealed(true);
    requestAnimationFrame(() => document.getElementById("breakdown")?.scrollIntoView({ behavior: "smooth" }));
  }

  function toggle(id: string) {
    setChecked((prev) => (prev.includes(id) ? prev.filter((x) => x !== id) : [...prev, id]));
  }

  function restart() {
    clearAttempt(slug);
    setAnswer("");
    setRevealed(false);
    setChecked([]);
    setHintsShown(0);
  }

  const score = checked.length;

  return (
    <>
      <section className="your-turn" aria-labelledby="your-turn-title">
        <div className="your-turn-head">
          <span className="stamp">Your turn</span>
          <h2 id="your-turn-title">{question}</h2>
          <p className="muted">
            Answer the way you would out loud in an interview. Committing to an answer before you read the
            breakdown is where the learning happens.
          </p>
        </div>

        <label htmlFor="answer" className="sr-only">
          Your answer
        </label>
        <textarea
          id="answer"
          value={answer}
          onChange={(e) => setAnswer(e.target.value)}
          placeholder="Start with a clarifying question, then lay out your structure…"
          rows={9}
          readOnly={revealed}
        />

        <div className="your-turn-bar">
          <span className="muted">{words} words</span>
          {!revealed && hintsShown < hints.length && (
            <button type="button" className="btn btn-ghost" onClick={() => setHintsShown((n) => n + 1)}>
              {hintsShown === 0 ? "Need a nudge?" : "Another hint"}
            </button>
          )}
          {!revealed ? (
            <>
              <button type="button" className="btn btn-primary" disabled={words < MIN_WORDS} onClick={reveal}>
                Lock in &amp; reveal
              </button>
              {words < MIN_WORDS && (
                <button type="button" className="btn btn-link" onClick={reveal}>
                  Skip, just show me
                </button>
              )}
            </>
          ) : (
            <button type="button" className="btn btn-ghost" onClick={restart}>
              Try again from scratch
            </button>
          )}
        </div>

        {!revealed && hintsShown > 0 && (
          <ol className="hints">
            {hints.slice(0, hintsShown).map((h) => (
              <li key={h}>{h}</li>
            ))}
          </ol>
        )}
        {!revealed && words > 0 && words < MIN_WORDS && (
          <p className="muted small">Write at least {MIN_WORDS} words to lock in your answer.</p>
        )}
      </section>

      {revealed && (
        <>
          <div id="breakdown">{children}</div>

          <section className="score-card" aria-labelledby="score-title">
            <h2 id="score-title">Score yourself</h2>
            <p className="muted">
              Re-read your answer and tick what you covered. Be strict: interviewers will be.
            </p>
            <div className="score-grid">
              <div className="score-answer">
                <h3>Your answer</h3>
                {answer.trim() ? <p>{answer}</p> : <p className="muted">You skipped writing an answer this time.</p>}
              </div>
              <div>
                <ul className="rubric">
                  {rubric.map((r) => (
                    <li key={r.id}>
                      <label>
                        <input type="checkbox" checked={checked.includes(r.id)} onChange={() => toggle(r.id)} />
                        <span>
                          <strong>{r.label}</strong>
                          <small>{r.detail}</small>
                        </span>
                      </label>
                    </li>
                  ))}
                </ul>
                <p className="score-total">
                  <strong>
                    {score}/{rubric.length}
                  </strong>{" "}
                  {score === rubric.length
                    ? "Interview-ready on this one."
                    : score >= rubric.length - 1
                      ? "Strong. Tighten the one you missed."
                      : score >= Math.ceil(rubric.length / 2)
                        ? "Good base. Re-answer tomorrow without looking."
                        : "Keep going. Try the follow-up questions next."}
                </p>
              </div>
            </div>
          </section>
        </>
      )}
    </>
  );
}
