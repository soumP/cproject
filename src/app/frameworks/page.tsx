import type { Metadata } from "next";
import Link from "next/link";
import { frameworks, getTrack } from "@/content";

export const metadata: Metadata = {
  title: "Frameworks",
  description: "The PM frameworks interviewers expect, with when to use them, examples and common mistakes.",
};

export default function FrameworksPage() {
  return (
    <div className="container section">
      <h1>Frameworks</h1>
      <p className="lead">
        Frameworks are scaffolding, not scripts. Each card says when to use it, shows an example, and lists the
        mistakes interviewers notice.
      </p>
      <div className="grid">
        {frameworks.map((f) => (
          <Link key={f.slug} href={`/frameworks/${f.slug}`} className="card">
            <div className="card-top">
              {f.tracks.map((t) => (
                <span key={t} className={`tag track-${t}`}>
                  {getTrack(t).name}
                </span>
              ))}
            </div>
            <h3>{f.name}</h3>
            <p>{f.oneLiner}</p>
          </Link>
        ))}
      </div>
    </div>
  );
}
