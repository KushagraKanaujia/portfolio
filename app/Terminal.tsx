"use client";

import { useEffect, useRef, useState, type ReactNode } from "react";
import type { Repo } from "./github";

export const LINKS = {
  github: "https://github.com/KushagraKanaujia",
  linkedin: "https://www.linkedin.com/in/kushagra-kanaujia",
  x: "https://x.com/kush_1309",
  youtube: "https://www.youtube.com/@ai_reveal_tech",
  throttle: "https://throttle-pro.com",
  email: "mailto:kushagrakanaujia@ucsb.edu",
};

type Line = { kind: "in" | "out"; node: ReactNode };

const FILES: Record<string, string> = {
  "about.txt": "Kushagra Kanaujia, Kush for short.\nSoftware engineer. UCSB computer science, class of 2026.\nI live a few steps from the Pacific.\nI like making things that feel good to use.",
  "throttle.txt": "Throttle is my startup.\nIt helps companies stop overpaying for AI.\nIt's just me for now.  →  throttle-pro.com",
  "likes.txt": "- sunsets on the IV bluffs\n- making little iOS apps\n- making short videos about AI and tech\n- hard bugs in huge codebases\n- good design and smooth animations\n- startups",
  "contact.txt": "email     kushagrakanaujia@ucsb.edu\nlinkedin  linkedin.com/in/kushagra-kanaujia\ngithub    github.com/KushagraKanaujia\nx         @kush_1309\nyoutube   @ai_reveal_tech",
  "secret.txt": "you found it. there's a whale in here somewhere.\ntry: whale",
};

const COMMANDS: [string, string][] = [
  ["whoami", "who I am, short version"],
  ["neofetch", "me, as a system info screen"],
  ["ls", "list files"],
  ["cat <file>", "read a file, e.g. cat about.txt"],
  ["repos", "my GitHub repos, live"],
  ["experience", "where I've worked"],
  ["skills", "languages and tools"],
  ["socials", "everywhere you can find me"],
  ["open <name>", "github · linkedin · x · youtube · throttle"],
  ["email", "write me an email"],
  ["dive / surface", "jump to the bottom or top"],
  ["whale · squid · jelly · bubbles · glow", "things happen in the ocean"],
  ["clear", "clear the screen"],
];

const ALL = ["help", "whoami", "neofetch", "ls", "cat", "repos", "experience", "skills", "socials", "open", "email", "dive", "surface", "whale", "bubbles", "glow", "jelly", "squid", "clear", "history", "date", "echo", "sudo", "hire", "github", "linkedin", "x", "youtube", "throttle", "pwd", "cd", "exit", "coffee"];

const A = ({ href, children }: { href: string; children: ReactNode }) => (
  <a className="t-link" href={href} target={href.startsWith("mailto") ? undefined : "_blank"} rel="noreferrer">{children}</a>
);

const ocean = (k: string) => window.dispatchEvent(new CustomEvent("ocean", { detail: k }));

const WAVE = String.raw`
      .-~~~-.
  .- ~ ~-(       )_ _
 /                    ~ -.
|   ~  ~   ~  ~  ~       \
 \  ~  ~  ~   ~  ~   ~  .'
   ~- ._ ,..,.,.,., ,.-~
~~~~~~~~~~~~~~~~~~~~~~~~~~~`;

export default function Terminal({ repos }: { repos: Repo[] }) {
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
        print(<span>Kushagra Kanaujia (Kush). Software engineer, UCSB CS &apos;26, building <A href={LINKS.throttle}>Throttle</A>. I make apps, videos and things that feel nice.</span>);
        break;
      case "neofetch":
        print(
          <div className="t-neo">
            <pre className="t-wave">{WAVE}</pre>
            <div>
              <div><span className="t-warm">kush</span>@<span className="t-warm">pacific</span></div>
              <div className="t-dim">-----------------</div>
              <div><span className="t-key">Name</span>Kushagra Kanaujia</div>
              <div><span className="t-key">Role</span>Software engineer, founder</div>
              <div><span className="t-key">School</span>UC Santa Barbara, B.S. CS &apos;26</div>
              <div><span className="t-key">Building</span>Throttle</div>
              <div><span className="t-key">Languages</span>Python, TypeScript, Go, Java, C++</div>
              <div><span className="t-key">Repos</span>{repos.length} public on GitHub</div>
              <div><span className="t-key">Videos</span>YouTube @ai_reveal_tech</div>
              <div><span className="t-key">Home</span>by the Pacific</div>
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
      case "github": case "linkedin": case "x": case "youtube": case "throttle": {
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
      case "whale": print(<span>🐋 calling a humpback… look behind the page.</span>); ocean("whale"); break;
      case "bubbles": print(<span>🫧 blub blub.</span>); ocean("bubbles"); break;
      case "glow": print(<span>✨ waking up the plankton.</span>); ocean("glow"); break;
      case "jelly": print(<span>🪼 here come the jellies.</span>); ocean("jelly"); break;
      case "squid": print(<span>🦑 a squid is jetting in from the deep.</span>); ocean("squid"); break;
      case "clear": setLines([]); break;
      case "history": print(<pre className="t-pre">{hist.map((h, i) => `${String(i + 1).padStart(3)}  ${h}`).join("\n") || "nothing yet"}</pre>); break;
      case "date": print(<span>{new Date().toString()}</span>); break;
      case "echo": print(<span>{arg}</span>); break;
      case "pwd": print(<span>/home/kush/the-pacific</span>); break;
      case "cd": print(<span className="t-dim">you&apos;re already where you need to be.</span>); break;
      case "sudo": print(<span className="t-err">nice try. kush is not in the sudoers file. this incident will be reported to the whale.</span>); break;
      case "rm": print(<span className="t-err">absolutely not.</span>); break;
      case "coffee": print(<span>☕ brewing… best enjoyed on the bluffs at sunset.</span>); break;
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

  const chips = ["help", "neofetch", "repos", "socials", "whale", "glow"];

  return (
    <div className="term" ref={boxRef} onClick={() => inputRef.current?.focus({ preventScroll: true })}>
      <div className="term-bar">
        <span className="tl r" /><span className="tl y" /><span className="tl g" />
        <span className="term-title">kush@pacific — zsh</span>
      </div>
      <div className="term-body" ref={bodyRef}>
        <div className="t-dim">Last login: from the Pacific. Welcome aboard.</div>
        {lines.map((l, i) =>
          l.kind === "in" ? (
            <div key={i} className="t-line"><span className="t-prompt">kush@iv</span><span className="t-path"> ~ </span><span className="t-arrow">❯</span> {l.node}</div>
          ) : (
            <div key={i} className="t-out">{l.node}</div>
          )
        )}
        <div className="t-line t-input">
          <span className="t-prompt">kush@iv</span><span className="t-path"> ~ </span><span className="t-arrow">❯</span>
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
