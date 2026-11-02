"use client";

import { useCallback, useEffect, useRef, useState } from "react";

/**
 * Drives the comic like growth.design's walkthroughs, without the case study
 * page knowing about it. It works on elements marked in the server-rendered page:
 *   [data-story]   the article
 *   [data-unit]    one step of the story: "panel", "gate" (the Your turn box) or "block"
 *   [data-chapter] a section that is hidden in step mode until one of its units shows
 *
 * Scroll mode: each panel animates in as it scrolls into view.
 * Step mode:   one unit at a time with Next/Back, arrow keys, or autoplay.
 */

type Mode = "scroll" | "step";
const MODE_KEY = "pmpanels:mode";

function units(root: HTMLElement): HTMLElement[] {
  return Array.from(root.querySelectorAll<HTMLElement>("[data-unit]"));
}

function readingTime(el: HTMLElement): number {
  const chars = el.textContent?.length ?? 0;
  return Math.min(7000, 1500 + chars * 25);
}

function prefersReducedMotion() {
  return window.matchMedia("(prefers-reduced-motion: reduce)").matches;
}

export function StoryPlayer() {
  const [mode, setMode] = useState<Mode>("scroll");
  const [index, setIndex] = useState(0);
  const [total, setTotal] = useState(0);
  const [playing, setPlaying] = useState(false);
  const [blockedAtGate, setBlockedAtGate] = useState(false);
  const rootRef = useRef<HTMLElement | null>(null);

  // Remember the reader's preferred mode.
  useEffect(() => {
    try {
      if (window.localStorage.getItem(MODE_KEY) === "step") setMode("step");
    } catch {
      // Default to scroll.
    }
  }, []);

  // Find the article and turn on the animated styles (no-JS readers see everything).
  useEffect(() => {
    const root = document.querySelector<HTMLElement>("[data-story]");
    if (!root) return;
    rootRef.current = root;
    if (!prefersReducedMotion()) root.classList.add("story-ready");
    setTotal(units(root).length);

    // Units appear later (the breakdown after "Lock in & reveal"), so keep counting.
    const mo = new MutationObserver(() => setTotal(units(root).length));
    mo.observe(root, { childList: true, subtree: true });
    return () => mo.disconnect();
  }, []);

  // Scroll mode: reveal panels as they enter the viewport.
  useEffect(() => {
    const root = rootRef.current;
    if (!root || mode !== "scroll") return;
    root.classList.remove("stepping");
    units(root).forEach((u) => u.classList.remove("is-hidden", "is-current"));

    const io = new IntersectionObserver(
      (entries) => {
        for (const e of entries) {
          if (e.isIntersecting) {
            e.target.classList.add("is-visible");
            io.unobserve(e.target);
          }
        }
      },
      { threshold: 0.25, rootMargin: "0px 0px -8% 0px" },
    );
    units(root).forEach((u) => {
      if (!u.classList.contains("is-visible")) io.observe(u);
    });
    return () => io.disconnect();
  }, [mode, total]);

  // Step mode: show units up to the current one.
  useEffect(() => {
    const root = rootRef.current;
    if (!root || mode !== "step") return;
    root.classList.add("stepping");
    const list = units(root);
    const current = Math.min(index, list.length - 1);
    list.forEach((u, i) => {
      u.classList.toggle("is-hidden", i > current);
      u.classList.toggle("is-current", i === current);
      if (i <= current) u.classList.add("is-visible");
    });
    const el = list[current];
    if (el) el.scrollIntoView({ behavior: prefersReducedMotion() ? "auto" : "smooth", block: "center" });
    // The Your turn box is a gate: the story continues once the breakdown is revealed.
    setBlockedAtGate(el?.dataset.unit === "gate" && current === list.length - 1);
  }, [mode, index, total]);

  // When the reader locks in their answer, carry on into the breakdown.
  const gateRef = useRef({ blocked: false, total: 0 });
  useEffect(() => {
    const prev = gateRef.current;
    if (mode === "step" && prev.blocked && total > prev.total) setIndex((i) => i + 1);
    gateRef.current = { blocked: blockedAtGate, total };
  }, [blockedAtGate, total, mode]);

  const next = useCallback(() => {
    setIndex((i) => Math.min(i + 1, Math.max(total - 1, 0)));
  }, [total]);
  const back = useCallback(() => setIndex((i) => Math.max(i - 1, 0)), []);

  // Autoplay: advance after a reading pause, and stop at the Your turn box or the end.
  useEffect(() => {
    const root = rootRef.current;
    if (!root || mode !== "step" || !playing) return;
    const list = units(root);
    const el = list[index];
    if (!el || index >= list.length - 1 || el.dataset.unit !== "panel") {
      setPlaying(false);
      return;
    }
    const t = window.setTimeout(next, readingTime(el));
    return () => window.clearTimeout(t);
  }, [mode, playing, index, total, next]);

  // Keyboard: ← → and space, unless the reader is typing.
  useEffect(() => {
    if (mode !== "step") return;
    function onKey(e: KeyboardEvent) {
      const target = e.target as HTMLElement;
      if (target.closest("textarea, input, select, [contenteditable]")) return;
      // Space on a focused button or link should still click it.
      if (e.key === " " && target.closest("button, a")) return;
      if (e.key === "ArrowRight" || e.key === " ") {
        e.preventDefault();
        setPlaying(false);
        next();
      } else if (e.key === "ArrowLeft") {
        e.preventDefault();
        setPlaying(false);
        back();
      }
    }
    window.addEventListener("keydown", onKey);
    return () => window.removeEventListener("keydown", onKey);
  }, [mode, next, back]);

  function choose(m: Mode) {
    setMode(m);
    setPlaying(false);
    if (m === "step") setIndex(0);
    try {
      window.localStorage.setItem(MODE_KEY, m);
    } catch {
      // Preference just won't persist.
    }
  }

  const atEnd = index >= total - 1;

  return (
    <>
      <div className="mode-switch" role="group" aria-label="How to read this case study">
        <span className="muted small">Read it:</span>
        <button type="button" className={`chip ${mode === "scroll" ? "is-active" : ""}`} onClick={() => choose("scroll")}>
          Scroll
        </button>
        <button type="button" className={`chip ${mode === "step" ? "is-active" : ""}`} onClick={() => choose("step")}>
          Step by step
        </button>
        {mode === "scroll" && (
          <button
            type="button"
            className="btn btn-link small"
            onClick={() => {
              choose("step");
              setPlaying(true);
            }}
          >
            ▶ Play it for me
          </button>
        )}
      </div>

      {mode === "step" && total > 0 && (
        <div className="player" role="region" aria-label="Story controls">
          <div className="player-progress" aria-hidden="true">
            <span style={{ width: `${((index + 1) / total) * 100}%` }} />
          </div>
          <div className="player-row">
            <button type="button" className="btn btn-ghost" onClick={back} disabled={index === 0} aria-label="Previous panel">
              ←
            </button>
            <button
              type="button"
              className="btn btn-ghost"
              onClick={() => setPlaying((p) => !p)}
              disabled={atEnd || blockedAtGate}
              aria-label={playing ? "Pause" : "Play"}
            >
              {playing ? "❚❚" : "▶"}
            </button>
            <span className="player-count small" aria-live="polite">
              {blockedAtGate ? "Your turn: answer to continue" : `${Math.min(index + 1, total)} / ${total}`}
            </span>
            <button
              type="button"
              className="btn btn-primary"
              onClick={() => {
                setPlaying(false);
                next();
              }}
              disabled={atEnd}
            >
              Next →
            </button>
          </div>
        </div>
      )}
    </>
  );
}
