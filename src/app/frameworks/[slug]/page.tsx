import type { Metadata } from "next";
import Link from "next/link";
import { notFound } from "next/navigation";
import { caseStudiesUsingFramework, frameworks, getFramework, getTrack } from "@/content";

type Params = Promise<{ slug: string }>;

export function generateStaticParams() {
  return frameworks.map((f) => ({ slug: f.slug }));
}

export async function generateMetadata({ params }: { params: Params }): Promise<Metadata> {
  const fw = getFramework((await params).slug);
  if (!fw) return {};
  return { title: fw.name, description: fw.oneLiner };
}

export default async function FrameworkPage({ params }: { params: Params }) {
  const fw = getFramework((await params).slug);
  if (!fw) notFound();
  const used = caseStudiesUsingFramework(fw.slug);

  return (
    <article className="container-narrow section">
      <Link href="/frameworks" className="back">
        ← All frameworks
      </Link>
      <div className="case-tags">
        {fw.tracks.map((t) => (
          <span key={t} className={`tag track-${t}`}>
            {getTrack(t).name}
          </span>
        ))}
      </div>
      <h1>{fw.name}</h1>
      <p className="lead">{fw.oneLiner}</p>

      <div className="fw-section">
        <h2>When to use it</h2>
        <p>{fw.whenToUse}</p>
      </div>

      <div className="fw-section">
        <h2>Steps</h2>
        <ol className="fw-steps">
          {fw.steps.map((s) => (
            <li key={s.name}>
              <strong>{s.name}</strong>
              <span>{s.detail}</span>
            </li>
          ))}
        </ol>
      </div>

      <div className="fw-section example">
        <h2>Example</h2>
        <p>{fw.example}</p>
      </div>

      <div className="fw-section">
        <h2>Common mistakes</h2>
        <ul className="pitfalls">
          {fw.pitfalls.map((p) => (
            <li key={p}>{p}</li>
          ))}
        </ul>
      </div>

      {used.length > 0 && (
        <div className="fw-section">
          <h2>Practice it</h2>
          <div className="fw-row">
            {used.map((c) => (
              <Link key={c.slug} href={`/case-studies/${c.slug}`} className="fw-mini">
                <strong>{c.title}</strong>
                <span>
                  {c.difficulty} · {c.readMinutes} min
                </span>
              </Link>
            ))}
          </div>
        </div>
      )}
    </article>
  );
}
