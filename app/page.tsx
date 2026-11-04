import Ocean from "./Ocean";
import Terminal, { LINKS as L } from "./Terminal";
import { HeroFx, Reveal, ScrollWords } from "./Client";
import { getRepos } from "./github";

export const revalidate = 3600;

const likes = [
  { e: "🌅", h: "IV sunsets", p: "Walking Del Playa at golden hour. Best free show in California." },
  { e: "📱", h: "Making little apps", p: "iOS apps for things I want to exist, like a comic reader for foldable iPhones." },
  { e: "🎬", h: "Making videos", p: "Short videos about AI and tech. I write, cut and post them myself." },
  { e: "🧩", h: "Hard bugs", p: "Digging through huge codebases until the weird bug finally makes sense." },
  { e: "✨", h: "Things that feel nice", p: "Good design, smooth animations, details nobody notices. Probably too much." },
  { e: "🚀", h: "Startups", p: "Building one. Always happy to talk to anyone else building one." },
];

const path = [
  { y: "2022 — 26", w: "UC Santa Barbara", r: "B.S. Computer Science", x: "Dean's Honors List. Four years by the ocean." },
  { y: "2025 — 26", w: "Visual Layer", r: "capstone engineer", x: "Taught models to spot mislabeled images in a 1.2M+ image set." },
  { y: "2025", w: "Dawdle", r: "software intern", x: "Shipped an AI chatbot used by 1,000+ people a day." },
  { y: "2024", w: "Smartshore", r: "software intern", x: "Backend work in New York for 100,000+ users." },
];

const LANG: Record<string, string> = {
  Python: "#5aa3e0", TypeScript: "#4f8ff0", JavaScript: "#f1dd5a", Go: "#38c6d9", Java: "#e7894a",
  "C++": "#f06d9a", "C#": "#7fd36b", Swift: "#ff8a5c", Rust: "#dea584", HTML: "#e96b4c", Solidity: "#9aa4ff", Jupyter: "#f3a24a",
};

const SOCIALS = [
  { k: "GitHub", h: "@KushagraKanaujia", href: L.github, d: "Code, projects and open source." },
  { k: "YouTube", h: "@ai_reveal_tech", href: L.youtube, d: "Short videos about AI and tech." },
  { k: "X", h: "@kush_1309", href: L.x, d: "Thoughts, builds, the odd sunset." },
  { k: "LinkedIn", h: "kushagra-kanaujia", href: L.linkedin, d: "The professional version of me." },
];

export default async function Page() {
  const repos = await getRepos();
  const top = repos.slice(0, 6);

  return (
    <>
      <Ocean />
      <Reveal />
      <HeroFx />

      <nav className="bar">
        <a href="#top" className="me">Kushagra</a>
        <a href="#about">about</a>
        <a href="#terminal" className="hide-xs">terminal</a>
        <a href="#made">work</a>
        <a href="#hi">say hi</a>
      </nav>

      <main id="top">
        <header className="hero">
          <div className="hero-inner wrap">
            <h1 className="rv">
              <span className="first">Kushagra</span>
              <span className="last">Kanaujia<span className="dotc">.</span></span>
            </h1>
            <p className="intro rv">
              Hey, I&apos;m Kush. Software engineer, ocean person, and someone who keeps tweaking a thing until
              it feels just right.
            </p>
            <div className="hero-links rv">
              <a href={L.github} target="_blank" rel="noreferrer">GitHub</a>
              <a href={L.youtube} target="_blank" rel="noreferrer">YouTube</a>
              <a href={L.x} target="_blank" rel="noreferrer">X</a>
              <a href={L.linkedin} target="_blank" rel="noreferrer">LinkedIn</a>
            </div>
          </div>
          <a href="#dive" className="dive-hint"><span>scroll to dive</span><i /></a>
        </header>

        <section id="dive" className="statement">
          <div className="wrap">
            <ScrollWords
              warm={["UCSB", "apps", "videos", "Pacific"]}
              text="I just finished computer science at UCSB. Now I spend my days building apps, making videos and chasing hard bugs, and my evenings watching the sun sink into the Pacific."
            />
          </div>
        </section>

        <div className="wrap stack">
          <section id="about">
            <div className="card rv">
              <span className="kicker">about me</span>
              <h2>I like making things <em>people enjoy.</em></h2>
              <p className="lead">
                I&apos;m a software engineer who cares a lot about how things feel, not just whether they work.
                Most days you&apos;ll find me coding, walking the bluffs, or deep in a side project that started as
                &ldquo;just a quick idea.&rdquo;
              </p>
              <div className="likes">
                {likes.map((l, i) => (
                  <div key={l.h} className="like rv" style={{ transitionDelay: `${i * 70}ms` }}>
                    <div className="e">{l.e}</div>
                    <h3>{l.h}</h3>
                    <p>{l.p}</p>
                  </div>
                ))}
              </div>
            </div>
          </section>

          <section id="terminal" className="term-sec">
            <div className="term-head rv">
              <span className="kicker">the terminal</span>
              <h2>Ask me <em>anything.</em></h2>
              <p className="lead">Well, anything this terminal knows. Type <code>help</code>, or try <code>neofetch</code>, <code>repos</code> or <code>whale</code>.</p>
            </div>
            <div className="rv"><Terminal repos={repos} /></div>
          </section>

          <section>
            <div className="grid2">
              <div className="card now rv">
                <span className="now-pill"><i /> right now</span>
                <h3>Building <em>Throttle</em></h3>
                <p>My startup. It helps companies stop overpaying for AI. It&apos;s just me for now, and I&apos;m loving it.</p>
                <a className="link" href={L.throttle} target="_blank" rel="noreferrer">throttle-pro.com →</a>
              </div>
              <div className="card rv">
                <span className="kicker">how I got here</span>
                <ul className="path">
                  {path.map((p) => (
                    <li key={p.w}>
                      <span className="y">{p.y}</span>
                      <div>
                        <div className="w">{p.w} <span>· {p.r}</span></div>
                        <div className="x">{p.x}</div>
                      </div>
                    </li>
                  ))}
                </ul>
              </div>
            </div>
          </section>

          <section className="gap" id="whale-spot">
            <p className="big rv">There&apos;s a whale<br />somewhere around here.<br /><span>Keep going.</span></p>
          </section>

          <section id="made">
            <div className="card rv">
              <span className="kicker">live from GitHub</span>
              <h2>Things I&apos;ve <em>made.</em></h2>
              <div className="repos">
                {top.map((r) => (
                  <a key={r.name} href={r.url} target="_blank" rel="noreferrer" className="repo">
                    <div className="repo-top">
                      <span className="repo-name">{r.name}</span>
                      <span className="repo-go">↗</span>
                    </div>
                    <p>{r.description}</p>
                    <div className="repo-meta">
                      {r.language && <span><i style={{ background: LANG[r.language] ?? "#9fb6c8" }} />{r.language}</span>}
                      {r.stars > 0 && <span>★ {r.stars}</span>}
                      <span>updated {new Date(r.updated + "T12:00:00Z").toLocaleDateString("en-US", { month: "short", year: "numeric" })}</span>
                    </div>
                  </a>
                ))}
                <a href="https://github.com/livekit/livekit/pull/4876" target="_blank" rel="noreferrer" className="repo oss">
                  <div className="repo-top"><span className="repo-name">livekit/livekit #4876</span><span className="repo-go">↗</span></div>
                  <p>Open source fix: tracked down why some ESP32 devices couldn&apos;t connect, across LiveKit, Pion WebRTC and two RFCs.</p>
                  <div className="repo-meta"><span><i style={{ background: LANG.Go }} />Go</span><span>pull request</span></div>
                </a>
              </div>
              <a className="link" href={L.github} target="_blank" rel="noreferrer">all {repos.length}+ repos on GitHub →</a>
            </div>
          </section>

          <section>
            <div className="socials">
              {SOCIALS.map((s) => (
                <a key={s.k} href={s.href} target="_blank" rel="noreferrer" className={`social rv s-${s.k.toLowerCase()}`}>
                  <span className="s-k">{s.k}</span>
                  <span className="s-h">{s.h}</span>
                  <span className="s-d">{s.d}</span>
                  <span className="s-go">↗</span>
                </a>
              ))}
            </div>
          </section>

          <section className="gap">
            <p className="big rv">It gets dark down here.<br /><span>Move your mouse. Things glow.</span></p>
          </section>

          <section id="hi">
            <div className="card hi rv">
              <span className="kicker">say hi</span>
              <h2>Come say <em>hi.</em></h2>
              <p>Want to work together, talk startups, or just say hey? My inbox is open.</p>
              <div className="btns">
                <a className="btn warm" href={L.email}>email me</a>
                <a className="btn" href={L.linkedin} target="_blank" rel="noreferrer">LinkedIn</a>
                <a className="btn" href={L.github} target="_blank" rel="noreferrer">GitHub</a>
                <a className="btn" href={L.youtube} target="_blank" rel="noreferrer">YouTube</a>
                <a className="btn" href={L.x} target="_blank" rel="noreferrer">X</a>
              </div>
            </div>
          </section>

          <footer>
            <span>You made it to 4,000 m. Thanks for diving.</span>
            <span>© 2026 Kushagra Kanaujia</span>
          </footer>
        </div>
      </main>
    </>
  );
}
