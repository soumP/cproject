"use client";

/**
 * Practice progress lives in the browser until accounts exist.
 * Every access is wrapped because storage can be unavailable
 * (private windows, blocked site data).
 */
const PREFIX = "pmpanels:";

export interface Attempt {
  answer: string;
  revealed: boolean;
  checked: string[];
  updatedAt: string;
}

export function loadAttempt(slug: string): Attempt | null {
  try {
    const raw = window.localStorage.getItem(`${PREFIX}attempt:${slug}`);
    return raw ? (JSON.parse(raw) as Attempt) : null;
  } catch {
    return null;
  }
}

export function saveAttempt(slug: string, attempt: Omit<Attempt, "updatedAt">): void {
  try {
    window.localStorage.setItem(
      `${PREFIX}attempt:${slug}`,
      JSON.stringify({ ...attempt, updatedAt: new Date().toISOString() }),
    );
  } catch {
    // Progress just won't persist.
  }
}

export function clearAttempt(slug: string): void {
  try {
    window.localStorage.removeItem(`${PREFIX}attempt:${slug}`);
  } catch {
    // Nothing to clear.
  }
}
