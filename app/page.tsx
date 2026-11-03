import Router from "./Router";
import { Clock, Reveal } from "./Client";

const LINKS = {
  email: "mailto:kushagrakanaujia@ucsb.edu",
  linkedin: "https://www.linkedin.com/in/kushagra-kanaujia",
  github: "https://github.com/KushagraKanaujia",
  x: "https://x.com/KushagraKanauji",
  throttle: "https://throttle-pro.com",
  throttleGh: "https://github.com/KushagraKanaujia/throttle",
};

const steps = [
  { n: "01", h: "Plug in", p: "Point your API base URL at Throttle and add the GitHub Action. It sees every call your app makes to OpenAI or Anthropic." },
  { n: "02", h: "Watch", p: "When your team adds or changes an AI feature, Throttle picks it up in the pull request. No ticket, no project." },
  { n: "03", h: "Test, then move", p: "Other models answer the same requests in the background. If one does the job as well for less, you approve and it moves." },
  { n: "04", h: "Fall back", p: "If your model errors or gives a broken answer, that request goes straight back to the API. Every miss is kept as a lesson." },
];

const work = [
  {
    when: "2026 — now",
    t: "Throttle", r: "Founder",
    d: "Solo founder. Designed, built and shipped the product, the site and the research runs on rented AMD MI300X GPUs.",
    href: LINKS.throttle,
  },
  {
    when: "Sep 2025 — Mar 2026",
    t: "Visual Layer", r: "Full Stack Engineer · UCSB Capstone",
    d: "Trained Vision Transformer and ResNet models on 1.2M+ images to find mislabeled data. Custom C++ pool allocators cut processing latency 50%.",
  },
  {
    when: "Jun — Aug 2025",
    t: "Dawdle", r: "Software Engineering Intern",
    d: "React, TypeScript and Go on AWS. Shipped an LLM chatbot on the Anthropic API for 1,000+ daily users. Fixed a 40% latency regression; retention rose 18%.",
  },
  {
    when: "Jun — Aug 2024",
    t: "Smartshore", r: "Software Engineering Intern",
    d: "Java and Python backend for 100,000+ concurrent users in financial services. Found a connection pool leak; response time improved 22%.",
  },
];

const projects = [
  { t: "LiveKit", tag: "Open source · Go", d: "Traced dropped SCTP INIT packets from older ESP32 clients across LiveKit, Pion WebRTC and two RFCs. PR #4876 with three regression tests.", href: "https://github.com/livekit/livekit/pull/4876" },
  { t: "claude-cost-proxy", tag: "Dev tools", d: "HTTP proxy for Claude Code with cost tracking, request logging and semantic caching.", href: "https://github.com/KushagraKanaujia/claude-cost-proxy" },
  { t: "codemind", tag: "Search", d: "Semantic code search powered by Claude. Finds, explains and ranks implementations.", href: "https://github.com/KushagraKanaujia/codemind" },
  { t: "streamfinder", tag: "Full stack", d: "Content discovery app with a hybrid recommendation algorithm.", href: "https://streamfinder-app.vercel.app" },
  { t: "quasar-eeg-viewer", tag: "Signals", d: "Interactive EEG and ECG viewer for brain waves and body signals.", href: "https://github.com/KushagraKanaujia/quasar-eeg-viewer" },
  { t: "mev-sandwich-bot", tag: "Blockchain", d: "MEV sandwich bot simulator with optimal front-run sizing. CS190 course project.", href: "https://github.com/KushagraKanaujia/mev-sandwich-bot" },
];

const Arrow = () => <span className="arr">→</span>;

export default function Page() {
  return (
    <>
      <Reveal />
      <div className="frame">
        <header className="bar">
          <a href="#top" className="brand"><span className="dot" /> Kushagra Kanaujia</a>
          <nav>
            <a href="#throttle">Throttle</a>
            <a href="#work" className="hide-sm">Work</a>
            <a href="#projects" className="hide-sm">Projects</a>
            <a href="#contact">Contact</a>
          </nav>
        </header>

        <main id="top">
          {/* HERO */}
          <section className="hero">
            <p className="label rv">Founder, Throttle · Software engineer</p>
            <h1 className="rv" style={{ marginTop: 22 }}>
              Kushagra<br />Kanaujia<span className="soft">.</span>
            </h1>
            <p className="lede rv">
              I&apos;m building <strong>Throttle</strong>, so companies can <strong>stop renting their AI</strong>.
              It moves AI work off paid APIs onto models they own, and only when the answers stay right.
            </p>
            <div className="cta rv">
              <a className="btn primary" href={LINKS.throttle} target="_blank" rel="noreferrer">See Throttle <Arrow /></a>
              <a className="btn" href={LINKS.email}>Get in touch</a>
            </div>
            <div className="hero-meta rv">
              <span>base <b>California</b></span>
              <span>local <b><Clock /></b></span>
              <span>school <b>UC Santa Barbara, B.S. CS &apos;26</b></span>
            </div>
          </section>

          <Router />

          {/* THROTTLE */}
          <section id="throttle" className="row" style={{ borderTop: "1px solid var(--line)" }}>
            <div className="pad sec-head" style={{ paddingTop: 72, paddingBottom: 48 }}>
              <span className="label rv">01 — Now</span>
              <div>
                <h2 className="rv">Stop renting<br /><span className="soft">your AI.</span></h2>
                <p className="body rv">
                  Most AI apps send every request to OpenAI or Anthropic and pay rent on every token.
                  A lot of that work could run on a model you own, for less. <strong>Throttle finds which work, proves it, and moves it.</strong> If
                  nothing passes, nothing moves.
                </p>
              </div>
            </div>
            <div className="cells c4">
              {steps.map((s) => (
                <div key={s.n} className="step rv">
                  <span className="label">{s.n}</span>
                  <h3>{s.h}</h3>
                  <p>{s.p}</p>
                </div>
              ))}
            </div>
          </section>

          {/* PROOF */}
          <section className="row">
            <div className="pad sec-head" style={{ paddingTop: 64, paddingBottom: 40 }}>
              <span className="label rv">02 — Proof</span>
              <div>
                <h2 className="rv">Cheaper only counts<br /><span className="soft">if it still works.</span></h2>
                <p className="body rv">
                  Real runs on rented AMD MI300X GPUs, Qwen2.5 on vLLM. Raw data is public on GitHub.
                </p>
              </div>
            </div>
            <div className="cells c3">
              <div className="stat rv">
                <span className="tag ok">Cheaper · verified</span>
                <div className="num mono">$1.67<span className="arrow">→</span>$1.13</div>
                <p>Per million tokens on Qwen2.5-72B, using a properly quantized FP8 checkpoint. Answers still right.</p>
              </div>
              <div className="stat rv">
                <span className="tag no">Looked cheaper · rejected</span>
                <div className="num mono">−47%</div>
                <p>On-the-fly FP8 looked 47% cheaper. The answers broke: the 32B model replied “!!!!”. Throttle said no.</p>
              </div>
              <div className="stat rv">
                <span className="tag mid">Noise</span>
                <div className="num mono">27%</div>
                <p>How far one untouched server swung across four checks. A win has to beat that before it counts.</p>
              </div>
            </div>
            <div className="pad split" style={{ borderTop: "1px solid var(--line)", paddingTop: 40, paddingBottom: 48 }}>
              <div className="rv">
                <span className="label">What it says back</span>
                <p className="body" style={{ marginTop: 12 }}>
                  Plain verdicts, not dashboards. A change is <strong>CHEAPER</strong> only if it beats the noise and the answers didn&apos;t change.
                  Open source under MIT, so you can read every line.
                </p>
                <div className="links">
                  <a className="btn" href={LINKS.throttle} target="_blank" rel="noreferrer">throttle-pro.com <Arrow /></a>
                  <a className="btn" href={LINKS.throttleGh} target="_blank" rel="noreferrer">GitHub <Arrow /></a>
                </div>
              </div>
              <div className="term rv" aria-label="Example Throttle verdicts">
{<><span className="p">$ </span><span className="c">throttle eval</span>{"\n"}
<span className="p">  fp8 checkpoint   </span><span className="ok">CHEAPER</span>{"         $1.67 → $1.13 /M\n"}
<span className="p">  on-the-fly fp8   </span><span className="no">OUTPUT CHANGED</span>{"  answers hit the cap\n"}
<span className="p">  2 GPUs vs 1      </span><span className="no">MORE EXPENSIVE</span>{"  +28% per token\n"}
<span className="p">  same server x4   </span>{"NO WINNER       inside the noise"}</>}
              </div>
            </div>
          </section>

          {/* WORK */}
          <section id="work" className="row">
            <div className="pad sec-head" style={{ paddingTop: 64, paddingBottom: 32 }}>
              <span className="label rv">03 — Work</span>
              <h2 className="rv">Where I&apos;ve<br /><span className="soft">built things.</span></h2>
            </div>
            <div className="list">
              {work.map((w) => {
                const inner = (
                  <>
                    <span className="label when">{w.when}</span>
                    <div>
                      <div className="t">{w.t} <span>· {w.r}</span></div>
                      <div className="d">{w.d}</div>
                    </div>
                    <span className="go">{w.href ? "↗" : ""}</span>
                  </>
                );
                return w.href ? (
                  <a key={w.t} className="rv" href={w.href} target="_blank" rel="noreferrer">{inner}</a>
                ) : (
                  <div key={w.t} className="item rv">{inner}</div>
                );
              })}
            </div>
          </section>

          {/* PROJECTS */}
          <section id="projects" className="row">
            <div className="pad sec-head" style={{ paddingTop: 64, paddingBottom: 32 }}>
              <span className="label rv">04 — Projects</span>
              <h2 className="rv">Open source<br /><span className="soft">and side builds.</span></h2>
            </div>
            <div className="list">
              {projects.map((p) => (
                <a key={p.t} className="rv" href={p.href} target="_blank" rel="noreferrer">
                  <span className="label when">{p.tag}</span>
                  <div>
                    <div className="t mono" style={{ fontSize: 15.5 }}>{p.t}</div>
                    <div className="d">{p.d}</div>
                  </div>
                  <span className="go">↗</span>
                </a>
              ))}
            </div>
          </section>

          {/* CONTACT */}
          <section id="contact" className="row contact">
            <div className="pad" style={{ paddingTop: 88, paddingBottom: 88 }}>
              <span className="label rv">05 — Contact</span>
              <h2 className="rv" style={{ marginTop: 20 }}>
                Spending a lot<br />on AI APIs?<br />
                <a className="mail soft" href={LINKS.email}>Let&apos;s talk.</a>
              </h2>
              <div className="links rv">
                <a className="btn primary" href={LINKS.email}>kushagrakanaujia@ucsb.edu</a>
                <a className="btn" href={LINKS.linkedin} target="_blank" rel="noreferrer">LinkedIn <Arrow /></a>
                <a className="btn" href={LINKS.github} target="_blank" rel="noreferrer">GitHub <Arrow /></a>
                <a className="btn" href={LINKS.x} target="_blank" rel="noreferrer">X <Arrow /></a>
              </div>
            </div>
          </section>

          <footer className="pad label">
            <span>© 2026 Kushagra Kanaujia</span>
            <span>Next.js · Geist · No trackers</span>
          </footer>
        </main>
      </div>
    </>
  );
}
