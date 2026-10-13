"use client";

import { useState, type FormEvent } from "react";

/**
 * Set NEXT_PUBLIC_NEWSLETTER_ENDPOINT to your provider's form endpoint
 * (Buttondown, ConvertKit, Beehiiv…). Without it the form runs in demo mode
 * and does not send the address anywhere.
 */
const ENDPOINT = process.env.NEXT_PUBLIC_NEWSLETTER_ENDPOINT;

export function NewsletterForm({ compact = false }: { compact?: boolean }) {
  const [email, setEmail] = useState("");
  const [state, setState] = useState<"idle" | "sending" | "done" | "error">("idle");

  async function onSubmit(e: FormEvent) {
    e.preventDefault();
    if (!ENDPOINT) {
      setState("done");
      return;
    }
    setState("sending");
    try {
      const body = new FormData();
      body.append("email", email);
      await fetch(ENDPOINT, { method: "POST", body, mode: "no-cors" });
      setState("done");
    } catch {
      setState("error");
    }
  }

  return (
    <div className={`newsletter ${compact ? "newsletter-compact" : ""}`}>
      {!compact && (
        <>
          <h2>One case study a week. One practice question a day.</h2>
          <p className="muted">For PMs and people preparing for PM interviews. Free.</p>
        </>
      )}
      {state === "done" ? (
        <p className="newsletter-done">
          {ENDPOINT ? "You're in. Check your inbox to confirm." : "Thanks! (Demo mode: no email was sent.)"}
        </p>
      ) : (
        <form onSubmit={onSubmit}>
          <label htmlFor={compact ? "nl-email-c" : "nl-email"} className="sr-only">
            Email address
          </label>
          <input
            id={compact ? "nl-email-c" : "nl-email"}
            type="email"
            required
            placeholder="you@example.com"
            value={email}
            onChange={(e) => setEmail(e.target.value)}
          />
          <button type="submit" className="btn btn-primary" disabled={state === "sending"}>
            {state === "sending" ? "Joining…" : "Get the next one"}
          </button>
        </form>
      )}
      {state === "error" && <p className="muted small">Something went wrong. Please try again.</p>}
    </div>
  );
}
