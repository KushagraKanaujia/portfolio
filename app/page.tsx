import Ocean from "./Ocean";
import DiveLine from "./DiveLine";
import Network from "./Network";
import Terminal from "./Terminal";
import { LINKS as L } from "./links";
import { HeroFx, Jiggle, PingButton, Reveal, ScrollWords } from "./Client";
import { getRepos } from "./github";
import { getChannel } from "./youtube";

export const revalidate = 3600;

const LANG: Record<string, string> = {
  Python: "#5aa3e0", TypeScript: "#4f8ff0", JavaScript: "#f1dd5a", Go: "#38c6d9", Java: "#e7894a",
  "C++": "#f06d9a", "C#": "#7fd36b", Swift: "#ff8a5c", Rust: "#dea584", HTML: "#e96b4c", Solidity: "#9aa4ff", Jupyter: "#f3a24a",
};

const LOG = [
  { d: "2026 —", w: "Throttle", r: "founder", x: "Building my startup. It helps companies stop overpaying for AI.", tags: ["Python", "LLMs", "AWS"] },
  { d: "2025 — 26", w: "Visual Layer", r: "capstone engineer", x: "Trained ViT and ResNet models on 1.2M+ images to find mislabeled data. Custom C++ pool allocators cut latency 50%.", tags: ["PyTorch", "C++"] },
  { d: "2025", w: "Dawdle", r: "software engineering intern", x: "Shipped an LLM chatbot to 1,000+ daily users. Traced a 40% latency regression and fixed it; retention rose 18%.", tags: ["React", "Go", "AWS"] },
  { d: "2024", w: "Smartshore", r: "software engineering intern", x: "Java and Python backend for 100,000+ concurrent users. Found a connection pool leak; responses 22% faster.", tags: ["Java", "Python"] },
  { d: "2022 — 26", w: "UC Santa Barbara", r: "B.S. Computer Science", x: "Dean's Honors List.", tags: [] },
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
        <a href="#top" className="me">Kushagra</a>
        <a href="#terminal" className="hide-xs">terminal</a>
        <a href="#network">network</a>
        <a href="#made">projects</a>
        <a href="#hi">contact</a>
      </nav>

      <main id="top">
        <header className="hero">
          <div className="hero-inner wrap">
            <div className="hero-text">
            <span className="eyebrow rv"><span className="sun-dot" />0 m · surface</span>
            <h1 className="rv">
              <span className="first">Kushagra</span>
              <span className="last">Kanaujia<span className="dotc">.</span></span>
            </h1>
            <p className="intro rv">
              Hey, I&apos;m Kush. Computer science grad from UCSB. I build software end to end: backends, ML,
              and apps that feel good to use.
            </p>
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
            <span className="kicker rv">who</span>
            <ScrollWords
              warm={["UCSB", "servers", "models", "apps", "details"]}
              text="I just finished computer science at UCSB. I like the whole stack: servers, models, apps, and the small details that make software feel good to use. The deeper you go, the more you'll find."
            />
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
              <p className="lead">Everything I&apos;ve built, linked to the skills behind it. Hover a dot to light up its connections, drag them around, click a project to open it.</p>
            </div>
            <div className="rv"><Network /></div>
          </section>

          <section id="made" className="sec">
            <div className="sec-top rv">
              <span className="kicker">discoveries · live from GitHub</span>
              <h2>Things I&apos;ve <em>made.</em></h2>
            </div>
            <div className="repos">
              {top.map((r, i) => (
                <a key={r.name} href={r.url} target="_blank" rel="noreferrer" className="repo scan rv" style={{ transitionDelay: `${i * 60}ms` }}>
                  <div className="repo-top">
                    <span className="repo-id">#{String(i + 1).padStart(2, "0")}</span>
                    <span className="repo-go">↗</span>
                  </div>
                  <span className="repo-name">{r.name}</span>
                  <p>{r.description}</p>
                  <div className="repo-meta">
                    {r.language && <span><i style={{ background: LANG[r.language] ?? "#9fb6c8" }} />{r.language}</span>}
                    {r.stars > 0 && <span>★ {r.stars}</span>}
                    <span>{new Date(r.updated + "T12:00:00Z").toLocaleDateString("en-US", { month: "short", year: "numeric" })}</span>
                  </div>
                </a>
              ))}
              <a href={L.youtube} target="_blank" rel="noreferrer" className="repo scan yt rv">
                <div className="repo-top"><span className="repo-id">#{String(top.length + 1).padStart(2, "0")}</span><span className="repo-go">↗</span></div>
                <span className="repo-name">▶ {channel.handle}</span>
                <p>My YouTube channel: short videos about AI and tech, made with my own Shorts pipeline.</p>
                <div className="repo-meta"><span>{channel.subscribers} subscribers</span><span>{channel.views} views</span><span>{channel.videos} videos</span></div>
              </a>
              <a href="https://github.com/livekit/livekit/pull/4876" target="_blank" rel="noreferrer" className="repo scan rv">
                <div className="repo-top"><span className="repo-id">#{String(top.length + 2).padStart(2, "0")}</span><span className="repo-go">↗</span></div>
                <span className="repo-name">livekit/livekit #4876</span>
                <p>Open source fix: tracked down why older ESP32 devices couldn&apos;t connect, across LiveKit, Pion WebRTC and two RFCs.</p>
                <div className="repo-meta"><span><i style={{ background: LANG.Go }} />Go</span><span>pull request</span></div>
              </a>
            </div>
            <a className="link rv" href={L.github} target="_blank" rel="noreferrer">all {repos.length} public repos on GitHub →</a>
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
                    <div className="log-w">{e.w} <span>· {e.r}</span></div>
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
