import { IVTime, Reveal } from "./Client";

const L = {
  email: "mailto:kushagrakanaujia@ucsb.edu",
  linkedin: "https://www.linkedin.com/in/kushagra-kanaujia",
  github: "https://github.com/KushagraKanaujia",
  x: "https://x.com/KushagraKanauji",
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

function Beach() {
  // painted Isla Vista sunset; a real photo at /beach.jpg sits on top when present
  return (
    <div className="scene" aria-hidden>
      <svg viewBox="0 0 1600 1000" preserveAspectRatio="xMidYMid slice">
        <defs>
          <linearGradient id="sky" x1="0" y1="0" x2="0" y2="1">
            <stop offset="0" stopColor="#3b2a4f" />
            <stop offset="0.28" stopColor="#7a4a6a" />
            <stop offset="0.48" stopColor="#d9786c" />
            <stop offset="0.6" stopColor="#ffb071" />
            <stop offset="0.66" stopColor="#ffd59a" />
          </linearGradient>
          <linearGradient id="sea" x1="0" y1="0" x2="0" y2="1">
            <stop offset="0" stopColor="#c9776e" />
            <stop offset="0.25" stopColor="#7d4a5c" />
            <stop offset="1" stopColor="#2b1a2a" />
          </linearGradient>
          <filter id="soft"><feGaussianBlur stdDeviation="3" /></filter>
          <radialGradient id="glow" cx="0.5" cy="0.5" r="0.5">
            <stop offset="0" stopColor="#fff1c9" stopOpacity="0.95" />
            <stop offset="0.35" stopColor="#ffc27a" stopOpacity="0.55" />
            <stop offset="1" stopColor="#ff9a76" stopOpacity="0" />
          </radialGradient>
          <linearGradient id="path" x1="0" y1="0" x2="0" y2="1">
            <stop offset="0" stopColor="#ffe2a8" stopOpacity="0.9" />
            <stop offset="1" stopColor="#ffb071" stopOpacity="0" />
          </linearGradient>
        </defs>
        <rect width="1600" height="1000" fill="url(#sky)" />
        {/* soft clouds */}
        <g className="drift" fill="#ffd2b0" opacity="0.28">
          <ellipse cx="420" cy="300" rx="260" ry="16" />
          <ellipse cx="560" cy="330" rx="180" ry="10" />
          <ellipse cx="1180" cy="250" rx="300" ry="14" />
          <ellipse cx="1300" cy="282" rx="160" ry="9" />
        </g>
        {/* sun setting over the horizon */}
        <circle cx="980" cy="640" r="260" fill="url(#glow)" />
        <circle cx="980" cy="640" r="62" fill="#fff0c8" />
        {/* ocean */}
        <rect y="640" width="1600" height="360" fill="url(#sea)" />
        {/* Channel Islands on the horizon */}
        <path d="M0 640 C 120 628, 220 622, 330 632 C 400 626, 470 630, 540 640 Z" fill="#8a5468" opacity="0.7" />
        <path d="M1260 640 C 1330 630, 1420 626, 1500 634 C 1550 630, 1580 634, 1600 638 L1600 640 Z" fill="#8a5468" opacity="0.6" />
        {/* sun path on water */}
        <g className="shimmer" filter="url(#soft)">
          <path d="M940 642 L1020 642 L1110 1000 L850 1000 Z" fill="url(#path)" opacity="0.32" />
          {[660, 690, 724, 764, 812, 870, 940].map((y, i) => (
            <rect key={y} x={980 - (30 + i * 22)} y={y} width={60 + i * 44} height={2 + i * 0.6} rx="2" fill="#fff0c8" opacity={0.32 - i * 0.035} />
          ))}
        </g>
        {/* bluff with palms, Del Playa style */}
        <path d="M0 700 C 90 690, 180 700, 260 720 C 330 740, 360 790, 380 1000 L0 1000 Z" fill="#26141e" />
        <g fill="none" stroke="#26141e" strokeLinecap="round">
          <path d="M150 705 C 150 600, 160 500, 182 420" strokeWidth="9" />
          <path d="M230 722 C 228 640, 236 570, 252 510" strokeWidth="7" />
        </g>
        <g fill="#26141e">
          {[
            [182, 420, 1], [252, 510, 0.75],
          ].map(([x, y, s]) => (
            <g key={x} transform={`translate(${x} ${y}) scale(${s})`}>
              <path d="M0 0 C -40 -20, -90 -10, -120 25 C -80 0, -40 0, 0 4 Z" />
              <path d="M0 0 C 40 -24, 95 -16, 125 18 C 85 -4, 40 -2, 0 4 Z" />
              <path d="M0 0 C -20 -40, -60 -70, -100 -70 C -60 -50, -30 -30, 0 4 Z" />
              <path d="M0 0 C 25 -45, 65 -70, 105 -64 C 65 -46, 32 -26, 0 4 Z" />
              <path d="M0 0 C -55 10, -85 40, -95 80 C -70 45, -40 22, 0 6 Z" />
              <path d="M0 0 C 55 8, 88 36, 100 74 C 74 42, 42 20, 0 6 Z" />
            </g>
          ))}
        </g>
      </svg>
    </div>
  );
}

export default function Page() {
  return (
    <>
      <Reveal />
      <Beach />
      <div className="photo" />
      <div className="wash" />
      <div className="grain" />

      <nav className="bar">
        <a href="#top" className="me">kush</a>
        <a href="#about">about</a>
        <a href="#made" className="hide-xs">things I made</a>
        <a href="#hi">say hi</a>
      </nav>

      <main id="top" className="wrap">
        <header className="hero">
          <span className="where rv"><span className="sun-dot" /><IVTime /></span>
          <h1 className="rv">hey, I&apos;m <em>Kush.</em></h1>
          <p className="intro rv">
            I live in <b>Isla Vista</b>, a few steps from the ocean. I just finished CS at <b>UCSB</b>,
            and now I spend my days building things and my evenings watching the sun go down.
          </p>
          <span className="scroll-hint rv"><i /> scroll down</span>
        </header>

        <section id="about">
          <div className="card rv">
            <span className="kicker">about me</span>
            <h2>I like making things <em>people enjoy.</em></h2>
            <p className="lead">
              Full name is <b>Kushagra Kanaujia</b>, but everyone calls me Kush. I&apos;m a software engineer who
              cares a lot about how things feel, not just whether they work.
            </p>
            <p className="lead">
              Most days you&apos;ll find me coding at home in IV, on a walk along the bluffs, or deep in some
              side project that started as &ldquo;just a quick idea.&rdquo;
            </p>
            <div className="likes">
              {likes.map((l) => (
                <div key={l.h} className="like">
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
              <h3>Building Throttle</h3>
              <p>
                My startup. It helps companies stop overpaying for AI. It&apos;s just me for now, and I&apos;m
                loving it.
              </p>
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

        <section id="hi">
          <div className="card hi rv">
            <span className="kicker">say hi</span>
            <h2>Come say <em>hi.</em></h2>
            <p>Want to work together, talk startups, or just get a sunset rec in IV? My inbox is open.</p>
            <div className="btns">
              <a className="btn warm" href={L.email}>email me</a>
              <a className="btn" href={L.linkedin} target="_blank" rel="noreferrer">LinkedIn</a>
              <a className="btn" href={L.github} target="_blank" rel="noreferrer">GitHub</a>
              <a className="btn" href={L.x} target="_blank" rel="noreferrer">X</a>
            </div>
          </div>
        </section>

        <footer>made with love in Isla Vista ☀︎</footer>
      </main>
    </>
  );
}
