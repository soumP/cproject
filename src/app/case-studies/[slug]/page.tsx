import type { Metadata } from "next";
import Link from "next/link";
import { notFound } from "next/navigation";
import { caseStudies, getCaseStudy, getFramework, getTrack } from "@/content";
import { PanelStrip } from "@/components/Panel";
import { PracticeFlow } from "@/components/PracticeFlow";
import { NewsletterForm } from "@/components/NewsletterForm";

type Params = Promise<{ slug: string }>;

export function generateStaticParams() {
  return caseStudies.map((c) => ({ slug: c.slug }));
}

export async function generateMetadata({ params }: { params: Params }): Promise<Metadata> {
  const cs = getCaseStudy((await params).slug);
  if (!cs) return {};
  return { title: cs.title, description: cs.summary };
}

export default async function CaseStudyPage({ params }: { params: Params }) {
  const cs = getCaseStudy((await params).slug);
  if (!cs) notFound();

  const track = getTrack(cs.track);
  const idx = caseStudies.indexOf(cs);
  const next = caseStudies[(idx + 1) % caseStudies.length];

  return (
    <article className="case container-narrow">
      <header className="case-head">
        <Link href="/#case-studies" className="back">
          ← All case studies
        </Link>
        <div className="case-tags">
          <span className={`tag track-${cs.track}`}>{track.name}</span>
          <span className="tag tag-plain">{cs.difficulty}</span>
          <span className="tag tag-plain">{cs.readMinutes} min</span>
          {cs.fictional && (
            <span className="tag tag-fictional" title="Company and numbers are invented for practice">
              Fictional scenario
            </span>
          )}
        </div>
        <h1>{cs.title}</h1>
        <p className="lead">{cs.summary}</p>
        <p className="muted small">{cs.company}</p>
      </header>

      <section aria-label="The setup">
        <h2 className="chapter">The setup</h2>
        <PanelStrip panels={cs.setup} />
      </section>

      <PracticeFlow slug={cs.slug} question={cs.prompt.question} hints={cs.prompt.hints} rubric={cs.rubric}>
        <section aria-label="The breakdown">
          <h2 className="chapter">The breakdown</h2>
          {cs.breakdown.map((step) => {
            const fw = step.framework ? getFramework(step.framework) : undefined;
            return (
              <div key={step.title} className="step-block">
                <h3>
                  {step.title}
                  {fw && (
                    <Link href={`/frameworks/${fw.slug}`} className="fw-chip">
                      {fw.name}
                    </Link>
                  )}
                </h3>
                <PanelStrip panels={step.panels} />
              </div>
            );
          })}
        </section>

        <section aria-label={cs.outcome.heading}>
          <h2 className="chapter">{cs.outcome.heading}</h2>
          <PanelStrip panels={cs.outcome.panels} />
          {cs.outcome.sources && (
            <p className="sources small muted">Sources: {cs.outcome.sources.join("; ")}.</p>
          )}
        </section>

        <section className="takeaway" aria-labelledby="takeaway-title">
          <h2 id="takeaway-title" className="chapter">
            Interview takeaway
          </h2>
          <div className="takeaway-grid">
            <div className="takeaway-col good">
              <h3>Strong answers</h3>
              <ul>
                {cs.takeaway.strong.map((s) => (
                  <li key={s}>{s}</li>
                ))}
              </ul>
            </div>
            <div className="takeaway-col bad">
              <h3>Weak answers</h3>
              <ul>
                {cs.takeaway.weak.map((s) => (
                  <li key={s}>{s}</li>
                ))}
              </ul>
            </div>
          </div>
          <div className="followups">
            <h3>Follow-up questions to practice</h3>
            <ol>
              {cs.takeaway.followUps.map((q) => (
                <li key={q}>{q}</li>
              ))}
            </ol>
          </div>
        </section>
      </PracticeFlow>

      <section className="case-foot">
        <div>
          <h2 className="small-heading">Frameworks used</h2>
          <div className="fw-chips">
            {cs.frameworks.map((slug) => {
              const fw = getFramework(slug);
              return fw ? (
                <Link key={slug} href={`/frameworks/${slug}`} className="fw-chip">
                  {fw.name}
                </Link>
              ) : null;
            })}
          </div>
        </div>
        {next.slug !== cs.slug && (
          <Link href={`/case-studies/${next.slug}`} className="next-card">
            <span className="muted small">Next case study</span>
            <strong>{next.title}</strong>
          </Link>
        )}
        <NewsletterForm compact />
      </section>
    </article>
  );
}
