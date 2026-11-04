import { Wordmark } from "../../Logo";
import type { Metadata } from "next";
import Link from "next/link";
import { notFound } from "next/navigation";
import Ocean from "../../Ocean";
import { Jiggle, Reveal } from "../../Client";
import { LINKS as L } from "../../links";
import { STORIES, bySlug } from "../data";

export function generateStaticParams() {
  return STORIES.map((s) => ({ slug: s.slug }));
}

export async function generateMetadata({ params }: { params: Promise<{ slug: string }> }): Promise<Metadata> {
  const s = bySlug((await params).slug);
  if (!s) return {};
  return { title: `${s.title} · Kushagra Kanaujia`, description: `${s.oneLiner} ${s.summary}` };
}

export default async function StoryPage({ params }: { params: Promise<{ slug: string }> }) {
  const s = bySlug((await params).slug);
  if (!s) notFound();
  const i = STORIES.indexOf(s);
  const next = STORIES[(i + 1) % STORIES.length];

  return (
    <>
      <Ocean />
      <Reveal />
      <Jiggle />
      <nav className="bar">
        <Link href="/" className="me" aria-label="Kushagra Kanaujia, home"><Wordmark /></Link>
        <Link href="/#network">network</Link>
        <Link href="/#made">projects</Link>
        <a href={L.email}>contact</a>
      </nav>

      <main className="wrap story">
        <Link href="/#network" className="story-back rv">← back to the reef</Link>

        <header className="story-head">
          <span className={`story-kind rv k-${s.kind === "work" ? "work" : s.kind === "startup" ? "project" : "project"}`}>{s.kind} · {s.year}</span>
          <h1 className="rv">{s.title}<span className="dotc">.</span></h1>
          <p className="story-one rv">{s.oneLiner}</p>
          <dl className="story-meta rv">
            <div><dt>role</dt><dd>{s.role}</dd></div>
            <div><dt>status</dt><dd>{s.status}</dd></div>
            <div><dt>stack</dt><dd>{s.stack.join(" · ")}</dd></div>
          </dl>
          {s.links.length > 0 && (
            <div className="story-links rv">
              {s.links.map((l, k) => (
                <a key={l.href} className={`btn${k === 0 ? " warm" : ""}`} href={l.href} target="_blank" rel="noreferrer">{l.label} ↗</a>
              ))}
            </div>
          )}
        </header>

        <section className="story-sec rv">
          <span className="kicker">summary</span>
          <p className="story-p">{s.summary}</p>
        </section>

        <section className="story-sec rv">
          <span className="kicker">purpose · why I built it</span>
          <p className="story-p">{s.purpose}</p>
        </section>

        <section className="story-sec rv">
          <span className="kicker">how it works · steps</span>
          <ol className="story-steps">
            {s.steps.map((st, k) => (
              <li key={st.h} className="rv" style={{ transitionDelay: `${k * 70}ms` }}>
                <span className="story-n">{String(k + 1).padStart(2, "0")}</span>
                <div><h3>{st.h}</h3><p>{st.p}</p></div>
              </li>
            ))}
          </ol>
        </section>

        <section className="story-sec rv">
          <span className="kicker">results · where it stands</span>
          <ul className="story-results">
            {s.results.map((r) => <li key={r}>{r}</li>)}
          </ul>
        </section>

        <Link href={`/projects/${next.slug}`} className="story-next rv">
          <span className="kicker">next</span>
          <span className="story-next-t">{next.title} →</span>
          <span className="story-next-s">{next.oneLiner}</span>
        </Link>
      </main>
    </>
  );
}
