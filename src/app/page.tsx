import Link from "next/link";
import { caseStudies, frameworks, tracks } from "@/content";
import { Avatar } from "@/components/Persona";
import { CaseGrid } from "@/components/CaseGrid";
import { NewsletterForm } from "@/components/NewsletterForm";

export default function Home() {
  return (
    <>
      <section className="hero">
        <div className="container hero-inner">
          <div>
            <p className="eyebrow">For PMs and people preparing for PM interviews</p>
            <h1>
              Think like a PM.
              <br />
              <span className="highlight">One comic at a time.</span>
            </h1>
            <p className="lead">
              Short illustrated case studies about real product decisions. You answer first, the way you would in an
              interview. Then see how a strong PM works through it, and what actually happened.
            </p>
            <div className="hero-cta">
              <Link href={`/case-studies/${caseStudies[0].slug}`} className="btn btn-primary btn-lg">
                Try a case study
              </Link>
              <Link href="/frameworks" className="btn btn-ghost btn-lg">
                Browse frameworks
              </Link>
            </div>
          </div>
          <div className="hero-art" aria-hidden="true">
            <div className="hero-panel">
              <Avatar speaker="interviewer" size={64} />
              <p className="bubble">DAU dropped 8% last week. What do you do?</p>
            </div>
            <div className="hero-panel hero-panel-right">
              <p className="bubble">First: did anything change in how we count users?</p>
              <Avatar speaker="pm" size={64} />
            </div>
          </div>
        </div>
      </section>

      <section className="how container" aria-labelledby="how-title">
        <h2 id="how-title" className="sr-only">
          How it works
        </h2>
        <ol className="steps">
          <li>
            <span className="step-num">1</span>
            <strong>Read the setup</strong>
            <p>A real product moment, told in panels.</p>
          </li>
          <li>
            <span className="step-num">2</span>
            <strong>Answer it yourself</strong>
            <p>Write your answer before you see anything else.</p>
          </li>
          <li>
            <span className="step-num">3</span>
            <strong>See the breakdown</strong>
            <p>Step by step, with the framework named at each step.</p>
          </li>
          <li>
            <span className="step-num">4</span>
            <strong>Score yourself</strong>
            <p>Against the rubric interviewers actually use.</p>
          </li>
        </ol>
      </section>

      <section id="case-studies" className="container section" aria-labelledby="cs-title">
        <h2 id="cs-title">Case studies</h2>
        <CaseGrid cases={caseStudies} tracks={tracks} />
      </section>

      <section className="container section" aria-labelledby="tracks-title">
        <h2 id="tracks-title">Every PM interview track</h2>
        <div className="track-list">
          {tracks.map((t) => {
            const count = caseStudies.filter((c) => c.track === t.id).length;
            return (
              <div key={t.id} className={`track-item track-${t.id}`}>
                <strong>{t.name}</strong>
                <p>{t.blurb}</p>
                <p className="muted small">&ldquo;{t.sampleQuestion}&rdquo;</p>
                <span className="small">{count > 0 ? `${count} case ${count === 1 ? "study" : "studies"}` : "Coming soon"}</span>
              </div>
            );
          })}
        </div>
      </section>

      <section className="container section" aria-labelledby="fw-title">
        <div className="section-head">
          <h2 id="fw-title">Frameworks, explained with examples</h2>
          <Link href="/frameworks">See all {frameworks.length} →</Link>
        </div>
        <div className="fw-row">
          {frameworks.slice(0, 4).map((f) => (
            <Link key={f.slug} href={`/frameworks/${f.slug}`} className="fw-mini">
              <strong>{f.name}</strong>
              <span>{f.oneLiner}</span>
            </Link>
          ))}
        </div>
      </section>

      <section id="newsletter" className="container section">
        <NewsletterForm />
      </section>
    </>
  );
}
