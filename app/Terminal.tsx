"use client";

import { useEffect, useRef, useState, type ReactNode } from "react";
import type { Repo } from "./github";
import type { Channel } from "./youtube";

import { LINKS } from "./links";
export { LINKS };

type Line = { kind: "in" | "out"; node: ReactNode };

const FILES: Record<string, string> = {
  "about.txt": "Kushagra Kanaujia, Kush for short.\nSoftware engineer. UCSB computer science, class of 2026.\nBased in San Francisco.\nI like making things that feel good to use.",
  "throttle.txt": "Throttle is my startup.\nIt helps companies stop overpaying for AI.\nIt's just me for now.  →  throttle-pro.com",
  "likes.txt": "- making little iOS apps\n- making short videos about AI and tech\n- hard bugs in huge codebases\n- good design and smooth animations\n- startups",
  "contact.txt": "email     kushagrakanaujia@ucsb.edu\nlinkedin  linkedin.com/in/kushagra-kanaujia\ngithub    github.com/KushagraKanaujia\nx         @kush_1309\nyoutube   @ai_reveal_tech",
  "projects.txt": "Throttle          my startup. helps companies stop overpaying for AI\nSpreadReader      comic + PDF reader for foldable iPhones (iOS)\nJobPilot          daily tracker for new AI and startup job postings\nShorts autopilot  topic in, finished YouTube Short out\nclaude-cost-proxy see what every Claude Code request costs\nLiveKit fix       open source: ESP32 devices that couldn't connect\n\nmore: type projects, or repos for everything on GitHub",
  "secret.txt": "you found it. there's a whale in here somewhere.\ntry: whale",
};

const COMMANDS: [string, string][] = [
  ["whoami", "who I am, short version"],
  ["neofetch", "me, as a system info screen"],
  ["ls", "list files"],
  ["cat <file>", "read a file, e.g. cat about.txt"],
  ["projects", "everything I've built, with details"],
  ["youtube", "my YouTube channel, live stats"],
  ["repos", "my GitHub repos, live"],
  ["experience", "where I've worked"],
  ["skills", "languages and tools"],
  ["socials", "everywhere you can find me"],
  ["open <name>", "github · linkedin · x · youtube · throttle"],
  ["email", "write me an email"],
  ["dive / surface", "jump to the bottom or top"],
  ["ping", "send a sonar ping"],
  ["network", "jump to the network of everything I've built"],
  ["clear", "clear the screen"],
];

const ALL = ["help", "whoami", "neofetch", "ls", "cat", "repos", "experience", "skills", "socials", "open", "email", "dive", "surface", "whale", "bubbles", "ping", "network", "projects", "spreadreader", "jobpilot", "shorts", "clear", "history", "date", "echo", "sudo", "hire", "github", "linkedin", "x", "youtube", "throttle", "pwd", "cd", "exit", "coffee"];

const A = ({ href, children }: { href: string; children: ReactNode }) => (
  <a className="t-link" href={href} target={href.startsWith("mailto") ? undefined : "_blank"} rel="noreferrer">{children}</a>
);


const WAVE = String.raw`
      .-~~~-.
  .- ~ ~-(       )_ _
 /                    ~ -.
|   ~  ~   ~  ~  ~       \
 \  ~  ~  ~   ~  ~   ~  .'
   ~- ._ ,..,.,.,., ,.-~
~~~~~~~~~~~~~~~~~~~~~~~~~~~`;

export default function Terminal({ repos, channel }: { repos: Repo[]; channel: Channel }) {
  const [lines, setLines] = useState<Line[]>([]);
  const [value, setValue] = useState("");
  const [hist, setHist] = useState<string[]>([]);
  const [hi, setHi] = useState(-1);
  const [booted, setBooted] = useState(false);
  const inputRef = useRef<HTMLInputElement>(null);
  const bodyRef = useRef<HTMLDivElement>(null);
  const boxRef = useRef<HTMLDivElement>(null);

  const print = (node: ReactNode) => setLines((l) => [...l, { kind: "out", node }]);

  function run(raw: string) {
    const cmd = raw.trim();
    setLines((l) => [...l, { kind: "in", node: cmd }]);
    if (!cmd) return;
    setHist((h) => [...h, cmd]);
    setHi(-1);
    const [name, ...rest] = cmd.split(/\s+/);
    const arg = rest.join(" ");
    const n = name.toLowerCase();

    switch (n) {
      case "help":
        print(
          <div className="t-grid">
            {COMMANDS.map(([c, d]) => (<div key={c}><span className="t-cmd">{c}</span><span className="t-dim">{d}</span></div>))}
            <div className="t-dim" style={{ gridColumn: "1 / -1", marginTop: 6 }}>tip: tab completes, ↑ ↓ for history. there are a few hidden ones.</div>
          </div>
        );
        break;
      case "whoami":
        print(
          <div>
            <div><b>Kushagra Kanaujia</b> <span className="t-dim">(Kush)</span></div>
            <div>Software engineer · UCSB CS &apos;26 · founder of <A href={LINKS.throttle}>Throttle</A></div>
            <div className="t-dim">I build apps and tools, make YouTube videos about AI and tech ({channel.subscribers} subscribers, {channel.views} views), and contribute to open source.</div>
          </div>
        );
        break;
      case "neofetch":
        print(
          <div className="t-neo">
            <pre className="t-wave">{WAVE}</pre>
            <div>
              <div><span className="t-warm">kush</span>@<span className="t-warm">sf</span></div>
              <div className="t-dim">-----------------</div>
              <div><span className="t-key">Name</span>Kushagra Kanaujia</div>
              <div><span className="t-key">Role</span>Software engineer, founder</div>
              <div><span className="t-key">School</span>UC Santa Barbara, B.S. CS &apos;26</div>
              <div><span className="t-key">Building</span>Throttle</div>
              <div><span className="t-key">Languages</span>Python, TypeScript, Go, Java, C++</div>
              <div><span className="t-key">Repos</span>{repos.length} public on GitHub</div>
              <div><span className="t-key">YouTube</span>{channel.handle} · {channel.subscribers} subs · {channel.views} views</div>
              <div><span className="t-key">Projects</span>Throttle, SpreadReader, JobPilot, Shorts autopilot</div>
              <div><span className="t-key">Location</span>San Francisco, CA</div>
              <div className="t-swatch">{["#0b3a5c", "#1d6f99", "#8fe3ff", "#ffc98f", "#ff9f7a", "#f4f8fb"].map((c) => <i key={c} style={{ background: c }} />)}</div>
            </div>
          </div>
        );
        break;
      case "ls":
        print(<div className="t-ls">{Object.keys(FILES).filter((f) => f !== "secret.txt").map((f) => <span key={f}>{f}</span>)}<span className="t-dir">repos/</span></div>);
        break;
      case "cat": {
        if (!arg) { print(<span className="t-dim">usage: cat &lt;file&gt;. try: ls</span>); break; }
        const f = FILES[arg] ?? FILES[arg + ".txt"];
        print(f ? <pre className="t-pre">{f}</pre> : <span className="t-err">cat: {arg}: no such file</span>);
        break;
      }
      case "projects":
        print(
          <div className="t-repos">
            <div><span className="t-warm">Throttle</span> <span className="t-dim">· startup · Python</span><div className="t-dim">Helps companies stop overpaying for AI. <A href={LINKS.throttle}>throttle-pro.com</A> · <A href="https://github.com/KushagraKanaujia/throttle">code</A></div></div>
            <div><span className="t-warm">SpreadReader</span> <span className="t-dim">· iOS · Swift</span><div className="t-dim">Comic and PDF reader for foldable iPhones: page-curl turning, fold-aware two-page spreads, paper sounds, eye-tracked haptics.</div></div>
            <div><span className="t-warm">JobPilot</span> <span className="t-dim">· Python</span><div className="t-dim">Checks AI and startup job boards every day and shows only the brand-new postings, so I see them first.</div></div>
            <div><span className="t-warm">Shorts autopilot</span> <span className="t-dim">· Python · video</span><div className="t-dim">Turns a trending topic into a finished YouTube Short: script, voice, matched b-roll, vertical render, publish. Powers <A href={LINKS.youtube}>{channel.handle}</A>.</div></div>
            <div><span className="t-warm">claude-cost-proxy</span> <span className="t-dim">· Python</span><div className="t-dim">HTTP proxy for Claude Code with cost tracking, request logs and semantic caching. <A href="https://github.com/KushagraKanaujia/claude-cost-proxy">code</A></div></div>
            <div><span className="t-warm">LiveKit fix</span> <span className="t-dim">· open source · Go</span><div className="t-dim">Tracked down why older ESP32 devices couldn&apos;t connect, across LiveKit, Pion WebRTC and two RFCs. <A href="https://github.com/livekit/livekit/pull/4876">PR #4876</A></div></div>
            <div className="t-dim">SpreadReader, JobPilot and Shorts autopilot are private for now. type <span className="t-cmd">repos</span> for everything public.</div>
          </div>
        );
        break;
      case "spreadreader":
        print(<span><span className="t-warm">SpreadReader</span>: comic and PDF reader for foldable iPhones. Page-curl turning, fold-aware spreads, paper sounds and eye-tracked haptics. SwiftUI. Private for now.</span>);
        break;
      case "jobpilot":
        print(<span><span className="t-warm">JobPilot</span>: checks AI and startup job boards daily and surfaces only brand-new postings. Python. Private for now.</span>);
        break;
      case "shorts":
        print(<span><span className="t-warm">Shorts autopilot</span>: trending topic in, finished vertical Short out (script, voice, b-roll, render, publish). It runs <A href={LINKS.youtube}>{channel.handle}</A>.</span>);
        break;
      case "youtube":
      case "yt":
        print(
          <div>
            <div><span className="t-warm">▶ {channel.handle}</span> <span className="t-dim">· since {channel.since}</span></div>
            <div className="t-grid" style={{ marginTop: 4 }}>
              <div><span className="t-cmd">subscribers</span><span>{channel.subscribers}</span></div>
              <div><span className="t-cmd">total views</span><span>{channel.views}</span></div>
              <div><span className="t-cmd">videos</span><span>{channel.videos}</span></div>
              <div><span className="t-cmd">about</span><span>Short videos about AI and tech. I write, cut and post them myself.</span></div>
            </div>
            <div style={{ marginTop: 4 }}><A href={LINKS.youtube}>watch on YouTube →</A></div>
          </div>
        );
        break;
      case "repos":
        print(
          <div className="t-repos">
            {repos.slice(0, 12).map((r) => (
              <div key={r.name}>
                <A href={r.url}>{r.name}</A>
                {r.stars > 0 && <span className="t-warm"> ★{r.stars}</span>}
                {r.language && <span className="t-dim"> · {r.language}</span>}
                <div className="t-dim">{r.description}</div>
              </div>
            ))}
            <div><A href={LINKS.github}>all repos on GitHub →</A></div>
          </div>
        );
        break;
      case "experience":
      case "exp":
        print(
          <div className="t-grid">
            <div><span className="t-cmd">2026 —</span><span><b>Throttle</b> <span className="t-dim">founder</span></span></div>
            <div><span className="t-cmd">2025–26</span><span><b>Visual Layer</b> <span className="t-dim">capstone engineer, 1.2M+ image data quality system</span></span></div>
            <div><span className="t-cmd">2025</span><span><b>Dawdle</b> <span className="t-dim">software intern, AI chatbot for 1,000+ daily users</span></span></div>
            <div><span className="t-cmd">2024</span><span><b>Smartshore</b> <span className="t-dim">software intern, backend for 100,000+ users</span></span></div>
            <div><span className="t-cmd">2022–26</span><span><b>UC Santa Barbara</b> <span className="t-dim">B.S. Computer Science, Dean&apos;s Honors</span></span></div>
          </div>
        );
        break;
      case "skills":
        print(
          <div className="t-grid">
            <div><span className="t-cmd">languages</span><span>Python · TypeScript · Go · Java · C++ · Rust · SQL</span></div>
            <div><span className="t-cmd">backend</span><span>FastAPI · Spring Boot · PostgreSQL</span></div>
            <div><span className="t-cmd">frontend</span><span>React · Next.js · Swift / iOS</span></div>
            <div><span className="t-cmd">ml</span><span>PyTorch · Vision Transformers · LLM APIs</span></div>
            <div><span className="t-cmd">cloud</span><span>AWS · Docker · CI/CD</span></div>
          </div>
        );
        break;
      case "socials":
        print(
          <div className="t-grid">
            <div><span className="t-cmd">github</span><A href={LINKS.github}>github.com/KushagraKanaujia</A></div>
            <div><span className="t-cmd">linkedin</span><A href={LINKS.linkedin}>linkedin.com/in/kushagra-kanaujia</A></div>
            <div><span className="t-cmd">x</span><A href={LINKS.x}>@kush_1309</A></div>
            <div><span className="t-cmd">youtube</span><A href={LINKS.youtube}>@ai_reveal_tech</A></div>
            <div><span className="t-cmd">email</span><A href={LINKS.email}>kushagrakanaujia@ucsb.edu</A></div>
          </div>
        );
        break;
      case "open":
      case "github": case "linkedin": case "x": case "throttle": {
        const key = (n === "open" ? arg : n).toLowerCase() as keyof typeof LINKS;
        if (!LINKS[key]) { print(<span className="t-dim">usage: open github | linkedin | x | youtube | throttle</span>); break; }
        print(<span>opening <A href={LINKS[key]}>{LINKS[key].replace(/^https?:\/\/(www\.)?|^mailto:/, "")}</A> …</span>);
        window.open(LINKS[key], "_blank", "noopener");
        break;
      }
      case "email": case "hire":
        print(<span>{n === "hire" ? "great idea. " : ""}opening your mail app → <A href={LINKS.email}>kushagrakanaujia@ucsb.edu</A></span>);
        window.location.href = LINKS.email;
        break;
      case "dive":
        print(<span>diving to 4,000 m… hold your breath.</span>);
        window.scrollTo({ top: document.documentElement.scrollHeight, behavior: "smooth" });
        break;
      case "surface":
        print(<span>heading up. sunlight ahead.</span>);
        window.scrollTo({ top: 0, behavior: "smooth" });
        break;
      case "ping": {
        print(<span>📡 ping sent. watch the water.</span>);
        const b = boxRef.current?.getBoundingClientRect();
        window.dispatchEvent(new CustomEvent("sonar", { detail: { x: b ? b.left + b.width / 2 : innerWidth / 2, y: b ? b.top - 40 : innerHeight / 2 } }));
        break;
      }
      case "network":
        print(<span>connecting the dots…</span>);
        document.getElementById("network")?.scrollIntoView({ behavior: "smooth", block: "start" });
        break;
      case "whale": case "jelly": case "squid":
        print(<span className="t-dim">they swam off. try <span className="t-cmd">ping</span> instead.</span>);
        break;
      case "clear": setLines([]); break;
      case "history": print(<pre className="t-pre">{hist.map((h, i) => `${String(i + 1).padStart(3)}  ${h}`).join("\n") || "nothing yet"}</pre>); break;
      case "date": print(<span>{new Date().toString()}</span>); break;
      case "echo": print(<span>{arg}</span>); break;
      case "pwd": print(<span>/home/kush/sf</span>); break;
      case "cd": print(<span className="t-dim">you&apos;re already where you need to be.</span>); break;
      case "sudo": print(<span className="t-err">nice try. kush is not in the sudoers file. this incident will be reported to the whale.</span>); break;
      case "rm": print(<span className="t-err">absolutely not.</span>); break;
      case "coffee": print(<span>☕ brewing… pairs well with a hard bug.</span>); break;
      case "exit": print(<span className="t-dim">there&apos;s no leaving the ocean. try: surface</span>); break;
      default:
        print(<span className="t-err">command not found: {name}. type <span className="t-cmd">help</span></span>);
    }
  }

  // boot sequence: types whoami when the terminal scrolls into view
  useEffect(() => {
    const el = boxRef.current;
    if (!el) return;
    const io = new IntersectionObserver(([e]) => {
      if (!e.isIntersecting || booted) return;
      setBooted(true);
      io.disconnect();
      const text = "whoami";
      let i = 0;
      const id = setInterval(() => {
        i++;
        setValue(text.slice(0, i));
        if (i >= text.length) {
          clearInterval(id);
          setTimeout(() => {
            setValue("");
            run(text);
            setTimeout(() => print(<span className="t-dim">type <span className="t-cmd">help</span> to see what this can do.</span>), 250);
          }, 350);
        }
      }, 90);
    }, { threshold: 0.4 });
    io.observe(el);
    return () => io.disconnect();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [booted]);

  useEffect(() => { const b = bodyRef.current; if (b) b.scrollTop = b.scrollHeight; }, [lines]);

  function onKey(e: React.KeyboardEvent<HTMLInputElement>) {
    if (e.key === "Enter") { run(value); setValue(""); }
    else if (e.key === "ArrowUp") {
      e.preventDefault();
      if (!hist.length) return;
      const i = hi < 0 ? hist.length - 1 : Math.max(0, hi - 1);
      setHi(i); setValue(hist[i]);
    } else if (e.key === "ArrowDown") {
      e.preventDefault();
      if (hi < 0) return;
      const i = hi + 1;
      if (i >= hist.length) { setHi(-1); setValue(""); } else { setHi(i); setValue(hist[i]); }
    } else if (e.key === "Tab") {
      e.preventDefault();
      const parts = value.split(" ");
      if (parts.length === 1) {
        const m = ALL.filter((c) => c.startsWith(parts[0].toLowerCase()));
        if (m.length === 1) setValue(m[0] + " ");
        else if (m.length > 1) print(<span className="t-dim">{m.join("   ")}</span>);
      } else if (parts[0] === "cat" || parts[0] === "open") {
        const pool = parts[0] === "cat" ? Object.keys(FILES) : ["github", "linkedin", "x", "youtube", "throttle"];
        const m = pool.filter((f) => f.startsWith(parts[1]));
        if (m.length === 1) setValue(`${parts[0]} ${m[0]}`);
      }
    } else if (e.key === "l" && e.ctrlKey) { e.preventDefault(); setLines([]); }
  }

  const chips = ["help", "whoami", "projects", "youtube", "repos", "socials", "ping"];

  return (
    <div className="term" ref={boxRef} onClick={() => inputRef.current?.focus({ preventScroll: true })}>
      <div className="term-bar">
        <span className="tl r" /><span className="tl y" /><span className="tl g" />
        <span className="term-title">kush@sf — zsh</span>
      </div>
      <div className="term-body" ref={bodyRef}>
        <div className="t-dim">Last login: from San Francisco. Welcome aboard.</div>
        {lines.map((l, i) =>
          l.kind === "in" ? (
            <div key={i} className="t-line"><span className="t-prompt">kush@sf</span><span className="t-path"> ~ </span><span className="t-arrow">❯</span> {l.node}</div>
          ) : (
            <div key={i} className="t-out">{l.node}</div>
          )
        )}
        <div className="t-line t-input">
          <span className="t-prompt">kush@sf</span><span className="t-path"> ~ </span><span className="t-arrow">❯</span>
          <input
            ref={inputRef}
            value={value}
            onChange={(e) => setValue(e.target.value)}
            onKeyDown={onKey}
            spellCheck={false}
            autoCapitalize="off"
            autoComplete="off"
            aria-label="Terminal input. Type help."
          />
        </div>
      </div>
      <div className="term-chips">
        {chips.map((c) => (
          <button key={c} onClick={(e) => { e.stopPropagation(); run(c); }}>{c}</button>
        ))}
      </div>
    </div>
  );
}
