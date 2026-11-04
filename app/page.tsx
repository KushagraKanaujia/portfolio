import Ocean from "./Ocean";
import { HeroFx, IVTime, Reveal, ScrollWords } from "./Client";

const L = {
  email: "mailto:kushagrakanaujia@ucsb.edu",
  linkedin: "https://www.linkedin.com/in/kushagra-kanaujia",
  github: "https://github.com/KushagraKanaujia",
  x: "https://x.com/kush_1309",
  throttle: "https://throttle-pro.com",
};

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

const made = [
  { n: "Throttle", t: "startup", p: "Helps companies stop overpaying for AI.", href: L.throttle },
  { n: "LiveKit fix", t: "open source", p: "Tracked down why some ESP32 devices couldn't connect.", href: "https://github.com/livekit/livekit/pull/4876" },
  { n: "claude-cost-proxy", t: "tool", p: "See what every Claude Code request costs you.", href: "https://github.com/KushagraKanaujia/claude-cost-proxy" },
  { n: "streamfinder", t: "web app", p: "Find something good to watch tonight.", href: "https://streamfinder-app.vercel.app" },
];

export default function Page() {
  return (
    <>
      <Ocean />
      <Reveal />
      <HeroFx />

      <nav className="bar">
        <a href="#top" className="me">Kushagra</a>
        <a href="#about">about</a>
        <a href="#made" className="hide-xs">things I made</a>
        <a href="#hi">say hi</a>
      </nav>

      <main id="top">
        <header className="hero">
          <div className="hero-inner wrap">
            <span className="where rv"><span className="sun-dot" /><IVTime /></span>
            <h1 className="rv">
              <span className="first">Kushagra</span>
              <span className="last">Kanaujia<span className="dotc">.</span></span>
            </h1>
            <p className="intro rv">
              Hey, I&apos;m Kush. I live in <b>Isla Vista</b>, right by the Pacific, and I build things
              that feel good to use.
            </p>
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
                Most days you&apos;ll find me coding at home in IV, walking the bluffs, or deep in a side project
                that started as &ldquo;just a quick idea.&rdquo;
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
              <span className="kicker">things I made</span>
              <h2>A few <em>favorites.</em></h2>
              <div className="made">
                {made.map((m) => (
                  <a key={m.n} href={m.href} target="_blank" rel="noreferrer">
                    <div className="n">{m.n} <span>{m.t} ↗</span></div>
                    <p>{m.p}</p>
                  </a>
                ))}
              </div>
              <a className="link" href={L.github} target="_blank" rel="noreferrer">more on GitHub →</a>
            </div>
          </section>

          <section className="gap">
            <p className="big rv">It gets dark down here.<br /><span>Move your mouse. Things glow.</span></p>
          </section>

          <section id="hi">
            <div className="card hi rv">
              <span className="kicker">say hi</span>
              <h2>Come say <em>hi.</em></h2>
              <p>Want to work together, talk startups, or just get a sunset rec in IV? My inbox is open.</p>
              <div className="btns">
                <a className="btn warm" href={L.email}>email me</a>
                <a className="btn" href={L.linkedin} target="_blank" rel="noreferrer">LinkedIn</a>
                <a className="btn" href={L.github} target="_blank" rel="noreferrer">GitHub</a>
                <a className="btn" href={L.x} target="_blank" rel="noreferrer">X · @kush_1309</a>
              </div>
            </div>
          </section>

          <footer>
            <span>You made it to 4,000 m. Thanks for diving.</span>
            <span>© 2026 Kushagra Kanaujia · Isla Vista, CA</span>
          </footer>
        </div>
      </main>
    </>
  );
}
