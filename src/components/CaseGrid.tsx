"use client";

import Link from "next/link";
import { useEffect, useState } from "react";
import type { CaseStudy, Track, TrackId } from "@/content/types";
import { loadAttempt } from "./storage";

type Status = "new" | "started" | "done";

export function CaseGrid({ cases, tracks }: { cases: CaseStudy[]; tracks: Track[] }) {
  const [filter, setFilter] = useState<TrackId | "all">("all");
  const [status, setStatus] = useState<Record<string, Status>>({});

  useEffect(() => {
    const next: Record<string, Status> = {};
    for (const c of cases) {
      const a = loadAttempt(c.slug);
      next[c.slug] = !a ? "new" : a.revealed ? "done" : "started";
    }
    setStatus(next);
  }, [cases]);

  const available = new Set(cases.map((c) => c.track));
  const shown = filter === "all" ? cases : cases.filter((c) => c.track === filter);
  const trackName = (id: TrackId) => tracks.find((t) => t.id === id)?.name ?? id;
  const doneCount = Object.values(status).filter((s) => s === "done").length;

  return (
    <div>
      <div className="filters" role="group" aria-label="Filter by interview track">
        <button type="button" className={`chip ${filter === "all" ? "is-active" : ""}`} onClick={() => setFilter("all")}>
          All
        </button>
        {tracks.map((t) => (
          <button
            key={t.id}
            type="button"
            className={`chip ${filter === t.id ? "is-active" : ""}`}
            onClick={() => setFilter(t.id)}
            disabled={!available.has(t.id)}
            title={available.has(t.id) ? undefined : "Coming soon"}
          >
            {t.name}
          </button>
        ))}
      </div>

      {doneCount > 0 && (
        <p className="progress-line">
          You&apos;ve practiced <strong>{doneCount}</strong> of {cases.length} case studies.
        </p>
      )}

      <div className="grid">
        {shown.map((c) => (
          <Link key={c.slug} href={`/case-studies/${c.slug}`} className={`card track-${c.track}`}>
            <div className="card-top">
              <span className="tag">{trackName(c.track)}</span>
              {status[c.slug] === "done" && <span className="badge badge-done">Practiced</span>}
              {status[c.slug] === "started" && <span className="badge">In progress</span>}
            </div>
            <h3>{c.title}</h3>
            <p>{c.summary}</p>
            <div className="card-meta">
              <span>{c.company}</span>
              <span>
                {c.difficulty} · {c.readMinutes} min
              </span>
            </div>
          </Link>
        ))}
      </div>
    </div>
  );
}
