"use client";

import { useEffect, useRef, useState } from "react";

/** "Connecting the dots", drawn as a bioluminescent reef.
 *  Orbs are what I've built (warm), where I've worked (coral) and skills (cyan), all tied back to me.
 *  Links are threads of light that sway like seaweed; hover a dot and its threads pull taut and glow.
 *  Click a dot for a detail card; filter chips light up one part of the reef. */

type Kind = "me" | "project" | "work" | "skill";
type Item = { id: string; label: string; kind: Kind; desc: string; href?: string; links: string[] };
type N = Item & { x: number; y: number; vx: number; vy: number; r: number; ph: number; lit: number };

const SKILLS = ["Python", "TypeScript", "Go", "Swift", "C++", "Java", "PyTorch", "React", "AWS", "LLMs", "WebRTC", "Video"];
const ITEMS: Item[] = [
  { id: "throttle", label: "Throttle", kind: "project", desc: "My startup. It helps companies stop overpaying for AI.", href: "https://throttle-pro.com", links: ["Python", "LLMs", "AWS"] },
  { id: "spread", label: "SpreadReader", kind: "project", desc: "Comic and PDF reader for foldable iPhones: page-curl turning, fold-aware two-page spreads, paper sounds and eye-tracked haptics. Private for now.", links: ["Swift"] },
  { id: "jobpilot", label: "JobPilot", kind: "project", desc: "Checks AI and startup job boards every day and surfaces only brand-new postings. Private for now.", links: ["Python", "LLMs"] },
  { id: "shorts", label: "Shorts autopilot", kind: "project", desc: "Trending topic in, finished YouTube Short out: script, voice, b-roll, render, publish. It runs @ai_reveal_tech.", href: "https://www.youtube.com/@ai_reveal_tech", links: ["Python", "Video", "LLMs"] },
  { id: "proxy", label: "claude-cost-proxy", kind: "project", desc: "HTTP proxy for Claude Code with cost tracking, request logs and semantic caching.", href: "https://github.com/KushagraKanaujia/claude-cost-proxy", links: ["Python", "LLMs"] },
  { id: "codemind", label: "codemind", kind: "project", desc: "Semantic code search powered by Claude. Finds, explains and ranks implementations.", href: "https://github.com/KushagraKanaujia/codemind", links: ["Python", "LLMs"] },
  { id: "livekit", label: "LiveKit fix", kind: "project", desc: "Open source: tracked down why older ESP32 devices couldn't connect, across LiveKit, Pion WebRTC and two RFCs. PR #4876.", href: "https://github.com/livekit/livekit/pull/4876", links: ["Go", "WebRTC"] },
  { id: "companion", label: "mini-companion", kind: "project", desc: "AI companion app with persistent memory, natural conversation and voice calls.", href: "https://github.com/KushagraKanaujia/mini-companion", links: ["TypeScript", "React", "LLMs"] },
  { id: "vl", label: "Visual Layer", kind: "work", desc: "Capstone engineer. Trained ViT and ResNet models on 1.2M+ images to find mislabeled data; custom C++ pool allocators cut latency 50%.", links: ["PyTorch", "C++", "Python"] },
  { id: "dawdle", label: "Dawdle", kind: "work", desc: "Software engineering intern. Shipped an LLM chatbot to 1,000+ daily users and fixed a 40% latency regression.", links: ["React", "TypeScript", "Go", "AWS", "LLMs"] },
  { id: "smartshore", label: "Smartshore", kind: "work", desc: "Software engineering intern. Backend for 100,000+ concurrent users; found a connection pool leak, 22% faster responses.", links: ["Java", "Python"] },
];

const FILTERS: { k: string; label: string; match: (n: N) => boolean }[] = [
  { k: "all", label: "everything", match: () => true },
  { k: "ai", label: "AI", match: (n) => ["LLMs", "PyTorch"].includes(n.id) || n.links.some((l) => ["LLMs", "PyTorch"].includes(l)) },
  { k: "python", label: "Python", match: (n) => n.id === "Python" || n.links.includes("Python") },
  { k: "web", label: "web", match: (n) => ["TypeScript", "React"].includes(n.id) || n.links.some((l) => ["TypeScript", "React"].includes(l)) },
  { k: "ios", label: "iOS", match: (n) => n.id === "Swift" || n.links.includes("Swift") },
  { k: "systems", label: "systems", match: (n) => ["Go", "C++", "Java", "WebRTC", "AWS"].includes(n.id) || n.links.some((l) => ["Go", "C++", "Java", "WebRTC", "AWS"].includes(l)) },
  { k: "work", label: "work", match: (n) => n.kind === "work" },
];

const COLORS: Record<Kind, [number, number, number]> = {
  me: [240, 250, 255], project: [255, 201, 143], work: [255, 150, 125], skill: [120, 225, 255],
};
const rgba = (c: [number, number, number], a: number) => `rgba(${c[0]},${c[1]},${c[2]},${a})`;

export default function Network() {
  const wrap = useRef<HTMLDivElement>(null);
  const cv = useRef<HTMLCanvasElement>(null);
  const [card, setCard] = useState<N | null>(null);
  const [filter, setFilter] = useState("all");
  const filterRef = useRef("all");
  const selRef = useRef<N | null>(null);
  const api = useRef<{ select: (id: string) => void } | null>(null);

  useEffect(() => { filterRef.current = filter; }, [filter]);

  useEffect(() => {
    const box = wrap.current!, canvas = cv.current!;
    const ctx = canvas.getContext("2d")!;
    const reduce = matchMedia("(prefers-reduced-motion: reduce)").matches;
    let W = 0, H = 0, raf = 0, t = 0, last = performance.now();
    let shown = -1;
    let hover: N | null = null, drag: N | null = null, downAt = { x: 0, y: 0 }, moved = false;
    const R = Math.random;

    const nodes: N[] = [];
    const make = (it: Item, r: number): N => ({ ...it, x: 0, y: 0, vx: 0, vy: 0, r, ph: R() * 6, lit: 0 });
    nodes.push(make({ id: "me", label: "Kush", kind: "me", desc: "Software engineer, UCSB CS '26. Everything here connects back to me.", links: [] }, 11));
    ITEMS.forEach((it) => nodes.push(make(it, it.kind === "work" ? 7 : 8)));
    SKILLS.forEach((s) => nodes.push(make({ id: s, label: s, kind: "skill", desc: "", links: [] }, 4.2)));
    const byId = new Map(nodes.map((n) => [n.id, n]));
    type E = { a: N; b: N; len: number; order: number; ph: number; taut: number };
    const edges: E[] = [];
    let order = 0;
    ITEMS.forEach((it) => {
      edges.push({ a: byId.get("me")!, b: byId.get(it.id)!, len: 160, order: order++, ph: R() * 6, taut: 0 });
      it.links.forEach((s) => edges.push({ a: byId.get(it.id)!, b: byId.get(s)!, len: 100, order: order++, ph: R() * 6, taut: 0 }));
    });
    const neighbors = (n: N) => new Set(edges.filter((e) => e.a === n || e.b === n).flatMap((e) => [e.a, e.b]));

    function resize() {
      const dpr = Math.min(devicePixelRatio || 1, 2);
      const r = box.getBoundingClientRect();
      const first = W === 0;
      W = r.width; H = r.height;
      canvas.width = Math.round(W * dpr); canvas.height = Math.round(H * dpr);
      ctx.setTransform(dpr, 0, 0, dpr, 0, 0);
      if (first) nodes.forEach((n, i) => {
        const a = (i / nodes.length) * Math.PI * 2;
        const rr = n.kind === "me" ? 0 : n.kind === "skill" ? 0.4 : 0.24;
        n.x = W / 2 + Math.cos(a) * W * rr; n.y = H / 2 + Math.sin(a) * H * rr;
      });
    }

    function step(dt: number) {
      const k = Math.min(1, dt * 60);
      const scale = Math.min(1, W / 900);
      for (let i = 0; i < nodes.length; i++) for (let j = i + 1; j < nodes.length; j++) {
        const a = nodes[i], b = nodes[j];
        let dx = b.x - a.x, dy = b.y - a.y; const d2 = dx * dx + dy * dy + 0.01, d = Math.sqrt(d2);
        const f = (2800 * scale) / d2; dx /= d; dy /= d;
        a.vx -= dx * f; a.vy -= dy * f; b.vx += dx * f; b.vy += dy * f;
      }
      for (const e of edges) {
        const dx = e.b.x - e.a.x, dy = e.b.y - e.a.y, d = Math.hypot(dx, dy) || 1;
        const f = (d - e.len * scale) * 0.011;
        e.a.vx += (dx / d) * f; e.a.vy += (dy / d) * f; e.b.vx -= (dx / d) * f; e.b.vy -= (dy / d) * f;
      }
      for (const n of nodes) {
        n.vx += (W / 2 - n.x) * 0.0016; n.vy += (H / 2 - n.y) * 0.0024;
        n.vx += Math.sin(t * 0.45 + n.ph) * 0.025; n.vy += Math.cos(t * 0.38 + n.ph) * 0.025; // a slow current
        if (n === drag) { n.vx = 0; n.vy = 0; continue; }
        n.vx *= 0.86; n.vy *= 0.86;
        n.x += n.vx * k; n.y += n.vy * k;
        n.x = Math.max(34, Math.min(W - 34, n.x)); n.y = Math.max(30, Math.min(H - 60, n.y));
      }
    }

    function draw(dt: number) {
      ctx.clearRect(0, 0, W, H);
      const age = shown < 0 ? 0 : t - shown;
      const sel = selRef.current;
      const focusNode = hover ?? sel;
      const focus = focusNode ? neighbors(focusNode) : null;
      const f = FILTERS.find((x) => x.k === filterRef.current)!;
      const filtered = filterRef.current !== "all";
      const passes = (n: N) => n.kind === "me" || f.match(n);

      // how lit each orb should be, eased so changes feel liquid
      for (const n of nodes) {
        let target = n.kind === "skill" ? 0.5 : 0.75;
        if (filtered) target = passes(n) ? 1 : 0.1;
        if (focus) target = n === focusNode ? 1.2 : focus.has(n) ? 1 : 0.12;
        n.lit += (target - n.lit) * Math.min(1, dt * 6);
      }

      // threads of light, swaying like seaweed; taut and warm when focused
      ctx.save();
      ctx.lineCap = "round";
      for (const e of edges) {
        const p = reduce ? 1 : Math.max(0, Math.min(1, (age - e.order * 0.045) / 0.6));
        if (p <= 0) continue;
        const on = !!(focus && (e.a === focusNode || e.b === focusNode));
        e.taut += ((on ? 1 : 0) - e.taut) * Math.min(1, dt * 5);
        const show = filtered && !focus ? (passes(e.a) && passes(e.b) ? 1 : 0.15) : 1;
        const al = Math.min(e.a.lit, e.b.lit) * show;
        const dx = e.b.x - e.a.x, dy = e.b.y - e.a.y, d = Math.hypot(dx, dy) || 1;
        const sway = (Math.sin(t * 0.9 + e.ph) * 0.22 + Math.sin(t * 0.37 + e.ph * 2) * 0.1) * d * (1 - e.taut);
        const cx = (e.a.x + e.b.x) / 2 + (-dy / d) * sway, cy = (e.a.y + e.b.y) / 2 + (dx / d) * sway;
        // draw only the revealed part of the curve
        const N = 22, upto = Math.round(N * p);
        ctx.beginPath();
        for (let i = 0; i <= upto; i++) {
          const u = i / N, iu = 1 - u;
          const x = iu * iu * e.a.x + 2 * iu * u * cx + u * u * e.b.x;
          const y = iu * iu * e.a.y + 2 * iu * u * cy + u * u * e.b.y;
          i ? ctx.lineTo(x, y) : ctx.moveTo(x, y);
        }
        const ca = COLORS[e.a.kind], cb = COLORS[e.b.kind];
        const g = ctx.createLinearGradient(e.a.x, e.a.y, e.b.x, e.b.y);
        const warm: [number, number, number] = [255, 214, 165];
        g.addColorStop(0, rgba(on ? warm : ca, (0.1 + 0.75 * e.taut) * al + 0.06 * al));
        g.addColorStop(1, rgba(on ? warm : cb, (0.1 + 0.75 * e.taut) * al + 0.06 * al));
        ctx.strokeStyle = g;
        ctx.shadowColor = on ? "rgba(255,200,140,0.9)" : "rgba(140,220,255,0.5)";
        ctx.shadowBlur = on ? 10 : 4;
        ctx.lineWidth = 0.8 + e.taut * 0.9;
        ctx.stroke();
        // light travelling along taut threads
        if (e.taut > 0.6 && p >= 1) for (let k = 0; k < 3; k++) {
          const u = (t * 0.45 + k / 3 + e.ph) % 1, iu = 1 - u;
          const x = iu * iu * e.a.x + 2 * iu * u * cx + u * u * e.b.x, y = iu * iu * e.a.y + 2 * iu * u * cy + u * u * e.b.y;
          ctx.fillStyle = "rgba(255,236,205,0.95)"; ctx.shadowBlur = 12;
          ctx.beginPath(); ctx.arc(x, y, 1.7, 0, Math.PI * 2); ctx.fill();
        }
      }
      ctx.restore();

      // orbs
      ctx.save();
      ctx.globalCompositeOperation = "lighter";
      nodes.forEach((n, i) => {
        const appear = reduce ? 1 : Math.max(0, Math.min(1, (age - (n.kind === "me" ? 0 : 0.1 + i * 0.03)) / 0.5));
        if (appear <= 0) return;
        const c = COLORS[n.kind];
        const breathe = 0.9 + 0.1 * Math.sin(t * 1.6 + n.ph);
        const big = n === focusNode ? 1.35 : 1;
        const r = n.r * breathe * big;
        const L = n.lit * appear;
        // halo
        const g = ctx.createRadialGradient(n.x, n.y, 0, n.x, n.y, r * 6);
        g.addColorStop(0, rgba(c, 0.35 * L)); g.addColorStop(0.4, rgba(c, 0.1 * L)); g.addColorStop(1, rgba(c, 0));
        ctx.fillStyle = g; ctx.beginPath(); ctx.arc(n.x, n.y, r * 6, 0, Math.PI * 2); ctx.fill();
        // translucent body with a bright core, like a tiny jelly
        const b = ctx.createRadialGradient(n.x - r * 0.3, n.y - r * 0.35, r * 0.1, n.x, n.y, r);
        b.addColorStop(0, rgba([255, 255, 255], 0.9 * L)); b.addColorStop(0.35, rgba(c, 0.75 * L)); b.addColorStop(1, rgba(c, 0.25 * L));
        ctx.fillStyle = b; ctx.beginPath(); ctx.arc(n.x, n.y, r, 0, Math.PI * 2); ctx.fill();
        // a slow pulse ring that expands and fades (only on the bigger orbs)
        if (n.kind !== "skill") {
          const u = ((t * 0.35 + n.ph / 6) % 1);
          ctx.strokeStyle = rgba(c, 0.35 * (1 - u) * L); ctx.lineWidth = 1;
          ctx.beginPath(); ctx.arc(n.x, n.y, r * (1.3 + u * 2.4), 0, Math.PI * 2); ctx.stroke();
        }
      });
      ctx.restore();

      // labels
      nodes.forEach((n, i) => {
        const appear = reduce ? 1 : Math.max(0, Math.min(1, (age - 0.3 - i * 0.03) / 0.5));
        if (appear <= 0) return;
        const L = Math.min(1, n.lit) * appear;
        const isF = n === focusNode;
        ctx.font = `${n.kind === "me" || isF ? 600 : n.kind === "skill" ? 400 : 500} ${n.kind === "me" ? 14 : n.kind === "skill" ? 11 : 12.5}px ui-monospace, "SF Mono", Menlo, monospace`;
        ctx.textAlign = "center"; ctx.textBaseline = "top";
        ctx.fillStyle = `rgba(232,242,250,${(n.kind === "skill" ? 0.75 : 0.95) * L})`;
        ctx.shadowColor = "rgba(0,0,0,0.6)"; ctx.shadowBlur = 6;
        ctx.fillText(n.label, n.x, n.y + n.r * (isF ? 1.35 : 1) + 9);
        ctx.shadowBlur = 0;
      });
    }

    function frame(now: number) {
      const dt = Math.min(0.05, (now - last) / 1000); last = now;
      if (!reduce) t += dt;
      step(dt); draw(dt);
      raf = requestAnimationFrame(frame);
    }

    const at = (e: PointerEvent) => {
      const r = canvas.getBoundingClientRect();
      const x = e.clientX - r.left, y = e.clientY - r.top;
      let best: N | null = null, bd = 28;
      for (const n of nodes) { const d = Math.hypot(n.x - x, n.y - y); if (d < bd) { bd = d; best = n; } }
      return { x, y, n: best };
    };
    const onMove = (e: PointerEvent) => {
      const p = at(e);
      if (drag) { drag.x = p.x; drag.y = p.y; if (Math.hypot(p.x - downAt.x, p.y - downAt.y) > 5) moved = true; return; }
      hover = p.n;
      canvas.style.cursor = p.n ? "pointer" : "default";
    };
    const onDown = (e: PointerEvent) => {
      const p = at(e);
      if (!p.n) { selRef.current = null; setCard(null); return; }
      drag = p.n; downAt = { x: p.x, y: p.y }; moved = false;
      canvas.setPointerCapture(e.pointerId);
    };
    const onUp = () => {
      if (drag && !moved) { selRef.current = drag; setCard({ ...drag }); }
      drag = null;
    };
    const onLeave = () => { if (!drag) hover = null; };

    api.current = { select: (id) => { const n = byId.get(id); if (n) { selRef.current = n; setCard({ ...n }); } } };

    const io = new IntersectionObserver(([en]) => { if (en.isIntersecting && shown < 0) shown = t; }, { threshold: 0.3 });
    io.observe(box);
    const ro = new ResizeObserver(resize);
    ro.observe(box);
    resize();
    canvas.addEventListener("pointermove", onMove);
    canvas.addEventListener("pointerdown", onDown);
    canvas.addEventListener("pointerup", onUp);
    canvas.addEventListener("pointerleave", onLeave);
    raf = requestAnimationFrame(frame);
    return () => {
      cancelAnimationFrame(raf); io.disconnect(); ro.disconnect();
      canvas.removeEventListener("pointermove", onMove);
      canvas.removeEventListener("pointerdown", onDown);
      canvas.removeEventListener("pointerup", onUp);
      canvas.removeEventListener("pointerleave", onLeave);
    };
  }, []);

  const close = () => { selRef.current = null; setCard(null); };
  const usedIn = card?.kind === "skill" ? ITEMS.filter((i) => i.links.includes(card.id)) : [];

  return (
    <div className="reef">
      <div className="reef-chips" role="group" aria-label="Filter the network">
        {FILTERS.map((f) => (
          <button key={f.k} className={filter === f.k ? "on" : ""} onClick={() => { setFilter(f.k); close(); }}>{f.label}</button>
        ))}
      </div>
      <div className="net" ref={wrap}>
        <canvas ref={cv} />
        <div className="net-legend">
          <span><i style={{ background: "#f0faff" }} />me</span>
          <span><i style={{ background: "#ffc98f" }} />projects</span>
          <span><i style={{ background: "#ff967d" }} />work</span>
          <span><i style={{ background: "#78e1ff" }} />skills</span>
          <span className="net-hint">hover · drag · click a dot</span>
        </div>
        {card && (
          <div className="reef-card" key={card.id}>
            <button className="reef-x" onClick={close} aria-label="Close">×</button>
            <span className={`reef-kind k-${card.kind}`}>{card.kind === "me" ? "hello" : card.kind}</span>
            <h3>{card.label}</h3>
            {card.desc && <p>{card.desc}</p>}
            {card.kind === "skill" ? (
              <>
                <span className="reef-sub">used in</span>
                <div className="reef-tags">{usedIn.map((i) => <button key={i.id} onClick={() => api.current?.select(i.id)}>{i.label}</button>)}</div>
              </>
            ) : card.links.length > 0 ? (
              <>
                <span className="reef-sub">built with</span>
                <div className="reef-tags">{card.links.map((l) => <button key={l} onClick={() => api.current?.select(l)}>{l}</button>)}</div>
              </>
            ) : null}
            {card.href && <a className="reef-open" href={card.href} target="_blank" rel="noreferrer">open ↗</a>}
          </div>
        )}
      </div>
    </div>
  );
}
