"use client";

import { useEffect, useRef, useState } from "react";

/** "Connecting the dots": everything I've built, linked to the skills behind it.
 *  A small force-directed graph drawn like bioluminescent plankton.
 *  Links draw in as you arrive; hover a dot to light its connections, drag to rearrange, click a project to open it. */

type Kind = "me" | "project" | "work" | "skill";
type N = { id: string; label: string; kind: Kind; desc?: string; href?: string; links?: string[];
  x: number; y: number; vx: number; vy: number; fixed?: boolean; r: number };

const SKILLS = ["Python", "TypeScript", "Go", "Swift", "C++", "Java", "PyTorch", "React", "AWS", "LLMs", "WebRTC", "Video"];
const ITEMS: Omit<N, "x" | "y" | "vx" | "vy" | "r">[] = [
  { id: "throttle", label: "Throttle", kind: "project", desc: "My startup. Helps companies stop overpaying for AI.", href: "https://throttle-pro.com", links: ["Python", "LLMs", "AWS"] },
  { id: "spread", label: "SpreadReader", kind: "project", desc: "Comic + PDF reader for foldable iPhones. Page curls, fold-aware spreads, paper sounds.", links: ["Swift"] },
  { id: "jobpilot", label: "JobPilot", kind: "project", desc: "Checks AI and startup job boards daily and surfaces only brand-new postings.", links: ["Python", "LLMs"] },
  { id: "shorts", label: "Shorts autopilot", kind: "project", desc: "Trending topic in, finished YouTube Short out. Runs @ai_reveal_tech.", href: "https://www.youtube.com/@ai_reveal_tech", links: ["Python", "Video", "LLMs"] },
  { id: "proxy", label: "claude-cost-proxy", kind: "project", desc: "Proxy for Claude Code with cost tracking, logs and semantic caching.", href: "https://github.com/KushagraKanaujia/claude-cost-proxy", links: ["Python", "LLMs"] },
  { id: "codemind", label: "codemind", kind: "project", desc: "Semantic code search powered by Claude.", href: "https://github.com/KushagraKanaujia/codemind", links: ["Python", "LLMs"] },
  { id: "livekit", label: "LiveKit fix", kind: "project", desc: "Open source: why older ESP32 devices couldn't connect. PR #4876.", href: "https://github.com/livekit/livekit/pull/4876", links: ["Go", "WebRTC"] },
  { id: "companion", label: "mini-companion", kind: "project", desc: "AI companion with memory and voice calls.", href: "https://github.com/KushagraKanaujia/mini-companion", links: ["TypeScript", "React", "LLMs"] },
  { id: "vl", label: "Visual Layer", kind: "work", desc: "Capstone: found mislabeled images in a 1.2M+ image set. C++ allocators cut latency 50%.", links: ["PyTorch", "C++", "Python"] },
  { id: "dawdle", label: "Dawdle", kind: "work", desc: "Intern: AI chatbot for 1,000+ daily users. Fixed a 40% latency regression.", links: ["React", "TypeScript", "Go", "AWS", "LLMs"] },
  { id: "smartshore", label: "Smartshore", kind: "work", desc: "Intern: backend for 100,000+ users. Found a connection pool leak, 22% faster.", links: ["Java", "Python"] },
];

const COLORS: Record<Kind, [number, number, number]> = {
  me: [255, 255, 255], project: [255, 201, 143], work: [255, 159, 122], skill: [143, 227, 255],
};

export default function Network() {
  const wrap = useRef<HTMLDivElement>(null);
  const cv = useRef<HTMLCanvasElement>(null);
  const [tip, setTip] = useState<{ n: N; x: number; y: number } | null>(null);

  useEffect(() => {
    const box = wrap.current!, canvas = cv.current!;
    const ctx = canvas.getContext("2d")!;
    const reduce = matchMedia("(prefers-reduced-motion: reduce)").matches;
    let W = 0, H = 0, raf = 0, t = 0, last = performance.now();
    let shown = -1; // time the graph came into view
    let hover: N | null = null, drag: N | null = null, downAt = { x: 0, y: 0 }, moved = false;

    const nodes: N[] = [];
    const R = Math.random;
    nodes.push({ id: "me", label: "Kush", kind: "me", x: 0, y: 0, vx: 0, vy: 0, r: 9, desc: "Software engineer, UCSB CS '26. Everything here connects back to me." });
    ITEMS.forEach((it) => nodes.push({ ...it, x: 0, y: 0, vx: 0, vy: 0, r: it.kind === "work" ? 6 : 6.5 }));
    SKILLS.forEach((s) => nodes.push({ id: s, label: s, kind: "skill", x: 0, y: 0, vx: 0, vy: 0, r: 4 }));
    const byId = new Map(nodes.map((n) => [n.id, n]));
    type E = { a: N; b: N; len: number; order: number };
    const edges: E[] = [];
    let order = 0;
    ITEMS.forEach((it) => {
      edges.push({ a: byId.get("me")!, b: byId.get(it.id)!, len: 150, order: order++ });
      it.links!.forEach((s) => edges.push({ a: byId.get(it.id)!, b: byId.get(s)!, len: 95, order: order++ }));
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
        const rr = n.kind === "me" ? 0 : n.kind === "skill" ? 0.42 : 0.26;
        n.x = W / 2 + Math.cos(a) * W * rr + (R() - 0.5) * 20;
        n.y = H / 2 + Math.sin(a) * H * rr + (R() - 0.5) * 20;
      });
    }

    function step(dt: number) {
      const k = Math.min(1, dt * 60);
      const scale = Math.min(1, W / 900);
      for (let i = 0; i < nodes.length; i++) for (let j = i + 1; j < nodes.length; j++) {
        const a = nodes[i], b = nodes[j];
        let dx = b.x - a.x, dy = b.y - a.y; const d2 = dx * dx + dy * dy + 0.01, d = Math.sqrt(d2);
        const f = (2600 * scale) / d2; dx /= d; dy /= d;
        a.vx -= dx * f; a.vy -= dy * f; b.vx += dx * f; b.vy += dy * f;
      }
      for (const e of edges) {
        const dx = e.b.x - e.a.x, dy = e.b.y - e.a.y, d = Math.hypot(dx, dy) || 1;
        const f = (d - e.len * scale) * 0.012;
        e.a.vx += (dx / d) * f; e.a.vy += (dy / d) * f; e.b.vx -= (dx / d) * f; e.b.vy -= (dy / d) * f;
      }
      for (const n of nodes) {
        n.vx += (W / 2 - n.x) * 0.0016; n.vy += (H / 2 - n.y) * 0.0022;
        n.vx += Math.sin(t * 0.5 + n.x * 0.01) * 0.02; n.vy += Math.cos(t * 0.4 + n.y * 0.01) * 0.02; // drift like plankton
        if (n === drag || n.fixed) { n.vx = 0; n.vy = 0; continue; }
        n.vx *= 0.86; n.vy *= 0.86;
        n.x += n.vx * k; n.y += n.vy * k;
        n.x = Math.max(30, Math.min(W - 30, n.x)); n.y = Math.max(24, Math.min(H - 24, n.y));
      }
    }

    function draw() {
      ctx.clearRect(0, 0, W, H);
      const age = shown < 0 ? 0 : t - shown;
      const focus = hover ? neighbors(hover) : null;
      // links, drawn in one by one ("connecting the dots")
      for (const e of edges) {
        const p = reduce ? 1 : Math.max(0, Math.min(1, (age - e.order * 0.045) / 0.5));
        if (p <= 0) continue;
        const on = !!(focus && (e.a === hover || e.b === hover));
        const dim = focus && !on;
        const ex = e.a.x + (e.b.x - e.a.x) * p, ey = e.a.y + (e.b.y - e.a.y) * p;
        const g = ctx.createLinearGradient(e.a.x, e.a.y, ex, ey);
        const ca = COLORS[e.a.kind], cb = COLORS[e.b.kind];
        const al = dim ? 0.06 : on ? 0.85 : 0.22;
        g.addColorStop(0, `rgba(${ca},${al})`); g.addColorStop(1, `rgba(${cb},${al})`);
        ctx.strokeStyle = g; ctx.lineWidth = on ? 1.6 : 1;
        ctx.beginPath(); ctx.moveTo(e.a.x, e.a.y); ctx.lineTo(ex, ey); ctx.stroke();
        // signal pulses travel along lit links
        if (on && p >= 1) {
          for (let k = 0; k < 2; k++) {
            const u = ((t * 0.7 + k * 0.5) % 1);
            const px = e.a.x + (e.b.x - e.a.x) * u, py = e.a.y + (e.b.y - e.a.y) * u;
            ctx.fillStyle = "rgba(255,230,190,0.95)";
            ctx.beginPath(); ctx.arc(px, py, 1.8, 0, Math.PI * 2); ctx.fill();
          }
        }
      }
      // dots
      ctx.save();
      ctx.globalCompositeOperation = "lighter";
      nodes.forEach((n, i) => {
        const appear = reduce ? 1 : Math.max(0, Math.min(1, (age - (n.kind === "me" ? 0 : 0.15 + i * 0.03)) / 0.4));
        if (appear <= 0) return;
        const c = COLORS[n.kind];
        const lit = n === hover ? 1 : focus?.has(n) ? 0.75 : focus ? 0.15 : 0.5;
        const pulse = 0.85 + 0.15 * Math.sin(t * 2 + i);
        const r = n.r * (n === hover ? 1.5 : 1) * pulse;
        const g = ctx.createRadialGradient(n.x, n.y, 0, n.x, n.y, r * 5);
        g.addColorStop(0, `rgba(${c},${0.5 * lit * appear})`); g.addColorStop(1, `rgba(${c},0)`);
        ctx.fillStyle = g; ctx.beginPath(); ctx.arc(n.x, n.y, r * 5, 0, Math.PI * 2); ctx.fill();
        ctx.fillStyle = `rgba(${c},${Math.min(1, (0.5 + lit) * appear)})`;
        ctx.beginPath(); ctx.arc(n.x, n.y, r, 0, Math.PI * 2); ctx.fill();
      });
      ctx.restore();
      // labels
      nodes.forEach((n, i) => {
        const appear = reduce ? 1 : Math.max(0, Math.min(1, (age - 0.3 - i * 0.03) / 0.4));
        if (appear <= 0) return;
        const lit = n === hover ? 1 : focus?.has(n) ? 0.9 : focus ? 0.2 : n.kind === "skill" ? 0.55 : 0.8;
        ctx.font = `${n.kind === "me" ? 600 : n.kind === "skill" ? 400 : 500} ${n.kind === "me" ? 14 : n.kind === "skill" ? 11 : 12.5}px ui-monospace, "SF Mono", Menlo, monospace`;
        ctx.textAlign = "center"; ctx.textBaseline = "top";
        ctx.fillStyle = `rgba(232,242,250,${lit * appear})`;
        ctx.fillText(n.label, n.x, n.y + n.r + 8);
      });
    }

    function frame(now: number) {
      const dt = Math.min(0.05, (now - last) / 1000); last = now;
      if (!reduce) t += dt;
      step(dt); draw();
      if (hover) {
        setTip((p) => (p && p.n === hover && Math.abs(p.x - hover!.x) < 1 && Math.abs(p.y - hover!.y) < 1 ? p : { n: hover!, x: hover!.x, y: hover!.y }));
      }
      raf = requestAnimationFrame(frame);
    }

    const at = (e: PointerEvent) => {
      const r = canvas.getBoundingClientRect();
      const x = e.clientX - r.left, y = e.clientY - r.top;
      let best: N | null = null, bd = 26;
      for (const n of nodes) { const d = Math.hypot(n.x - x, n.y - y); if (d < bd) { bd = d; best = n; } }
      return { x, y, n: best };
    };
    const onMove = (e: PointerEvent) => {
      const p = at(e);
      if (drag) { drag.x = p.x; drag.y = p.y; if (Math.hypot(p.x - downAt.x, p.y - downAt.y) > 4) moved = true; return; }
      if (p.n !== hover) { hover = p.n; if (!hover) setTip(null); }
      canvas.style.cursor = p.n ? (p.n.href ? "pointer" : "grab") : "default";
    };
    const onDown = (e: PointerEvent) => {
      const p = at(e);
      if (!p.n) { hover = null; setTip(null); return; }
      drag = p.n; hover = p.n; downAt = { x: p.x, y: p.y }; moved = false;
      canvas.setPointerCapture(e.pointerId);
      canvas.style.cursor = "grabbing";
    };
    const onUp = (e: PointerEvent) => {
      if (drag && !moved && drag.href && e.pointerType === "mouse") window.open(drag.href, "_blank", "noopener");
      drag = null;
    };
    const onLeave = () => { if (!drag) { hover = null; setTip(null); } };

    const io = new IntersectionObserver(([en]) => { if (en.isIntersecting && shown < 0) shown = t; }, { threshold: 0.35 });
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

  return (
    <div className="net" ref={wrap}>
      <canvas ref={cv} />
      <div className="net-legend">
        <span><i style={{ background: "#fff" }} />me</span>
        <span><i style={{ background: "#ffc98f" }} />projects</span>
        <span><i style={{ background: "#ff9f7a" }} />work</span>
        <span><i style={{ background: "#8fe3ff" }} />skills</span>
        <span className="net-hint">hover · drag · click</span>
      </div>
      {tip && (
        <div className="net-tip" style={{ left: tip.x, top: tip.y }}>
          <b>{tip.n.label}</b>
          <span className="net-kind">{tip.n.kind === "skill" ? "skill" : tip.n.kind === "work" ? "work" : tip.n.kind === "me" ? "hi" : "project"}</span>
          {tip.n.desc && <p>{tip.n.desc}</p>}
          {tip.n.kind === "skill" && <p>Used in {ITEMS.filter((i) => i.links?.includes(tip.n.id)).map((i) => i.label).join(", ")}.</p>}
          {tip.n.href && <a href={tip.n.href} target="_blank" rel="noreferrer">open ↗</a>}
        </div>
      )}
    </div>
  );
}
