import { Wordmark } from "./Logo";
import Ocean from "./Ocean";
import DiveLine from "./DiveLine";
import Network from "./Network";
import Terminal from "./Terminal";
import { LINKS as L } from "./links";
import { HeroFx, Jiggle, PingButton, Reveal, ScrollWords } from "./Client";
import { getRepos } from "./github";
import { getChannel } from "./youtube";
import Link from "next/link";
import { bySlug, byRepo } from "./projects/data";

export const revalidate = 3600;

const LANG: Record<string, string> = {
  Python: "#5aa3e0", TypeScript: "#4f8ff0", JavaScript: "#f1dd5a", Go: "#38c6d9", Java: "#e7894a",
  "C++": "#f06d9a", "C#": "#7fd36b", Swift: "#ff8a5c", Rust: "#dea584", HTML: "#e96b4c", Solidity: "#9aa4ff", Jupyter: "#f3a24a",
};

const FEATURED = ["throttle", "shorts-autopilot", "spreadreader", "livekit-fix", "claude-cost-proxy", "codemind"];

const LOG = [
  { slug: "throttle", d: "2026 —", w: "Throttle", r: "founder", x: "Building my startup. It helps companies stop overpaying for AI.", tags: ["Python", "LLMs", "AWS"] },
  { slug: "visual-layer", d: "2025 — 26", w: "Visual Layer", r: "capstone engineer", x: "Trained ViT and ResNet models on 1.2M+ images to find mislabeled data. Custom C++ pool allocators cut latency 50%.", tags: ["PyTorch", "C++"] },
  { slug: "dawdle", d: "2025", w: "Dawdle", r: "software engineering intern", x: "Shipped an LLM chatbot to 1,000+ daily users. Traced a 40% latency regression and fixed it; retention rose 18%.", tags: ["React", "Go", "AWS"] },
  { slug: "smartshore", d: "2024", w: "Smartshore", r: "software engineering intern", x: "Java and Python backend for 100,000+ concurrent users. Found a connection pool leak; responses 22% faster.", tags: ["Java", "Python"] },
  { slug: "", d: "2022 — 26", w: "UC Santa Barbara", r: "B.S. Computer Science", x: "Dean's Honors List.", tags: [] },
];

export default async function Page() {
  const [repos, channel] = await Promise.all([getRepos(), getChannel()]);
  const top = repos.slice(0, 6);

  return (
    <>
      <Ocean />
      <DiveLine />
      <Reveal />
      <HeroFx />
      <Jiggle />

      <nav className="bar">
        <a href="#top" className="me" aria-label="Kushagra Kanaujia, home"><Wordmark /></a>
        <a href="#terminal" className="hide-xs">terminal</a>
        <a href="#network">network</a>
        <a href="#made">projects</a>
        <a href="#hi">contact</a>
      </nav>

      <main id="top">
        <header className="hero">
          <div className="hero-inner wrap">
            <div className="hero-text">
            <span className="eyebrow rv"><span className="sun-dot" />founder · Throttle</span>
            <h1 className="rv">
              <span className="first">Kushagra</span>
              <span className="last">Kanaujia<span className="dotc">.</span></span>
            </h1>
            <p className="intro rv">
              Hey, I&apos;m Kushagra. I&apos;m building <b>Throttle</b>, so companies can stop renting their AI.
              Software engineer in San Francisco, CS grad from UCSB.
            </p>
            <div className="cta rv">
              <Link className="btn warm" href="/projects/throttle">Read the Throttle story →</Link>
              <a className="btn" href={L.email}>Talk to me</a>
            </div>
            <div className="hero-links rv">
              <a href={L.github} target="_blank" rel="noreferrer">GitHub</a>
              <a href={L.youtube} target="_blank" rel="noreferrer">YouTube</a>
              <a href={L.x} target="_blank" rel="noreferrer">X</a>
              <a href={L.linkedin} target="_blank" rel="noreferrer">LinkedIn</a>
            </div>
            <p className="hint rv">tip: everything here is a little squishy. click the water to send a sonar ping.</p>
            </div>
          </div>
          <a href="#dive" className="dive-hint"><span>scroll to dive</span><i /></a>
        </header>

        <section id="dive" className="statement">
          <div className="wrap">
            <span className="kicker rv">who I am</span>
            <ScrollWords
              warm={["Throttle", "backend", "ML", "iOS", "fast", "reliable"]}
              text="I'm a software engineer in San Francisco and the founder of Throttle. I build across the stack, from backend and ML systems to iOS apps, and I care most about software that's fast, reliable and genuinely good to use."
            />
          </div>
        </section>

        <section className="about wrap">
          <div className="about-grid">
            <div className="about-text rv">
              <span className="kicker">about</span>
              <h2>Engineer first, <em>founder now.</em></h2>
              <p>
                I graduated from <b>UC Santa Barbara</b> in 2026 with a B.S. in Computer Science, on the Dean&apos;s Honors List.
                Along the way I interned at <b>Smartshore</b> in New York, working on a financial-services backend that served
                100,000+ concurrent users, and at <b>Dawdle</b>, where I shipped an LLM chatbot to 1,000+ daily users. For my
                capstone with <b>Visual Layer</b>, I trained vision models on 1.2M+ images to catch mislabeled data.
              </p>
              <p>
                Today I&apos;m building <b>Throttle</b>. It helps companies stop overpaying for AI by testing which of their AI
                work can move to cheaper models they own, and moving it only when the answers hold up.
              </p>
              <p>
                I like hard problems with clear answers: a latency regression, a silent network failure, a model that looks
                cheaper but isn&apos;t. On the side I build things to learn, like an iOS reader for foldable phones and a
                pipeline that makes my YouTube Shorts.
              </p>
            </div>
            <dl className="facts rv">
              <div><dt>based in</dt><dd>San Francisco, CA</dd></div>
              <div><dt>education</dt><dd>B.S. Computer Science, UC Santa Barbara &apos;26</dd></div>
              <div><dt>building</dt><dd>Throttle, founder</dd></div>
              <div><dt>focus</dt><dd>AI infrastructure, backend systems, iOS</dd></div>
              <div><dt>languages</dt><dd>Python, TypeScript, Go, Swift, C++, Java</dd></div>
              <div><dt>open source</dt><dd>LiveKit (Go, WebRTC)</dd></div>
            </dl>
          </div>
          <div className="principles">
            {[
              { n: "01", h: "Measure, then believe", p: "A speedup or a saving only counts once it beats the noise. I'd rather know than hope." },
              { n: "02", h: "Own it end to end", p: "Design, backend, frontend, deploy. I like seeing an idea all the way to something people use." },
              { n: "03", h: "Sweat the details", p: "Small things, like a fast response or a smooth animation, are what make software feel good." },
            ].map((x, i) => (
              <div key={x.n} className="principle rv" style={{ transitionDelay: `${i * 80}ms` }}>
                <span className="principle-n">{x.n}</span>
                <h3>{x.h}</h3>
                <p>{x.p}</p>
              </div>
            ))}
          </div>
        </section>

        <div className="wrap stack">
          <section id="terminal" className="term-sec">
            <div className="sec-top rv">
              <span className="kicker">the terminal</span>
              <h2>Ask me <em>anything.</em></h2>
              <p className="lead">Well, anything this terminal knows. Type <code>help</code>, or try <code>projects</code>, <code>youtube</code> or <code>neofetch</code>.</p>
            </div>
            <div className="rv"><Terminal repos={repos} channel={channel} /></div>
          </section>

          <section id="network" className="net-sec">
            <div className="sec-top rv">
              <span className="kicker">the network</span>
              <h2>Connecting <em>the dots.</em></h2>
              <p className="lead">Everything I&apos;ve built, linked to the skills behind it. Hover a dot to light up its threads, drag things around, click any dot for the story, or filter by what you care about.</p>
            </div>
            <div className="rv"><Network /></div>
          </section>

          <section id="made" className="sec">
            <div className="sec-top rv">
              <span className="kicker">discoveries · tap one for the full story</span>
              <h2>Things I&apos;ve <em>made.</em></h2>
            </div>
            <div className="repos">
              {FEATURED.map((slug, i) => {
                const st = bySlug(slug)!;
                const r = repos.find((x) => x.name === st.repo);
                return (
                  <Link key={slug} href={`/projects/${slug}`} className={`repo scan rv${slug === "shorts-autopilot" ? " yt" : ""}`} style={{ transitionDelay: `${i * 60}ms` }}>
                    <div className="repo-top">
                      <span className="repo-id">#{String(i + 1).padStart(2, "0")} · {st.kind}</span>
                      <span className="repo-go">read →</span>
                    </div>
                    <span className="repo-name">{st.title}</span>
                    <p>{st.oneLiner} {st.summary.split(". ")[0]}.</p>
                    <div className="repo-meta">
                      {st.stack.slice(0, 3).map((t) => <span key={t}>{t}</span>)}
                      {r && r.stars > 0 && <span>★ {r.stars}</span>}
                      {slug === "shorts-autopilot" && <span>{channel.subscribers} subs · {channel.views} views</span>}
                    </div>
                  </Link>
                );
              })}
            </div>
            <a className="link rv" href={L.github} target="_blank" rel="noreferrer">{repos.length} original repos on GitHub →</a>
          </section>

          <section id="log" className="sec">
            <div className="sec-top rv">
              <span className="kicker">dive log</span>
              <h2>Where I&apos;ve <em>been.</em></h2>
            </div>
            <ol className="log">
              {LOG.map((e) => (
                <li key={e.w} className="rv">
                  <span className="log-dot" />
                  <span className="log-d">{e.d}</span>
                  <div className="log-body">
                    <div className="log-w">{e.slug ? <Link href={`/projects/${e.slug}`}>{e.w} <i className="log-go">→</i></Link> : e.w} <span>· {e.r}</span></div>
                    <p>{e.x}</p>
                    {e.tags.length > 0 && <div className="log-tags">{e.tags.map((t) => <span key={t}>{t}</span>)}</div>}
                  </div>
                </li>
              ))}
            </ol>
          </section>

          <section id="hi" className="sec">
            <div className="card hi rv">
              <span className="kicker">signal</span>
              <h2>Send a <em>ping.</em></h2>
              <p>Want to work together, talk startups, or just say hey? I read everything.</p>
              <div className="btns">
                <PingButton href={L.email} />
                <a className="btn" href={L.linkedin} target="_blank" rel="noreferrer">LinkedIn</a>
                <a className="btn" href={L.github} target="_blank" rel="noreferrer">GitHub</a>
                <a className="btn" href={L.youtube} target="_blank" rel="noreferrer">YouTube</a>
                <a className="btn" href={L.x} target="_blank" rel="noreferrer">X</a>
              </div>
            </div>
          </section>

          <footer>
            <span>You reached 4,000 m. Thanks for diving.</span>
            <span>© 2026 Kushagra Kanaujia · built with Next.js, WebGL and too much attention to detail</span>
          </footer>
        </div>
      </main>
    </>
  );
}
