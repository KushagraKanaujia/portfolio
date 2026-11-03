"use client";

import { useEffect, useRef, useState } from "react";

/*
  A small simulation of what Throttle does: requests leave your app,
  most go to a rented API at first, and over time more of them are routed
  to a model you own. A few fail a check on the way and fall back to the API.
*/

type P = {
  t: number;          // 0..1 along current path
  speed: number;
  dest: "api" | "own";
  phase: "go" | "fallback";
  jitter: number;
};

const CYCLE = 36; // seconds for one full "move home" cycle

export default function Router() {
  const ref = useRef<HTMLCanvasElement>(null);
  const [share, setShare] = useState(12);
  const [fallbacks, setFallbacks] = useState(0);

  useEffect(() => {
    const canvas = ref.current!;
    const ctx = canvas.getContext("2d")!;
    const reduce = window.matchMedia("(prefers-reduced-motion: reduce)").matches;
    let w = 0, h = 0, dpr = 1;
    let colors = readColors();
    const ps: P[] = [];
    let last = performance.now();
    let spawnAcc = 0;
    let start = performance.now();
    let visible = true;
    let raf = 0;
    let fb = 0;
    let lastUi = 0;

    function readColors() {
      const s = getComputedStyle(document.documentElement);
      const g = (n: string) => s.getPropertyValue(n).trim();
      return {
        fg: g("--fg"), muted: g("--muted"), faint: g("--faint"), line: g("--line"),
        line2: g("--line-2"), accent: g("--accent"), rented: g("--rented"), bad: g("--bad"),
        bg: g("--bg"), mono: getComputedStyle(document.body).getPropertyValue("--font-mono") || "monospace",
      };
    }

    function resize() {
      dpr = Math.min(window.devicePixelRatio || 1, 2);
      const r = canvas.getBoundingClientRect();
      w = r.width; h = r.height;
      canvas.width = Math.round(w * dpr);
      canvas.height = Math.round(h * dpr);
      ctx.setTransform(dpr, 0, 0, dpr, 0, 0);
    }

    // geometry
    const geo = () => {
      const small = w < 640;
      const sx = small ? 52 : Math.max(90, w * 0.12);
      const ex = small ? w - 72 : w - Math.max(140, w * 0.2);
      return {
        src: { x: sx, y: h * 0.46 },
        api: { x: ex, y: h * 0.2 },
        own: { x: ex, y: h * 0.68 },
        small,
      };
    };

    const bez = (a: {x:number;y:number}, b: {x:number;y:number}, t: number, bend = 0) => {
      const c1x = a.x + (b.x - a.x) * 0.45, c1y = a.y + bend;
      const c2x = a.x + (b.x - a.x) * 0.55, c2y = b.y - bend;
      const u = 1 - t;
      return {
        x: u*u*u*a.x + 3*u*u*t*c1x + 3*u*t*t*c2x + t*t*t*b.x,
        y: u*u*u*a.y + 3*u*u*t*c1y + 3*u*t*t*c2y + t*t*t*b.y,
      };
    };

    const homeShare = (now: number) => {
      const s = ((now - start) / 1000) % CYCLE / CYCLE; // 0..1
      // ease from 12% to 78%, hold, then reset
      const e = Math.min(1, s / 0.8);
      const eased = 1 - Math.pow(1 - e, 2.2);
      return 0.12 + eased * 0.66;
    };

    function drawPath(a: {x:number;y:number}, b: {x:number;y:number}, color: string, dash = false) {
      ctx.beginPath();
      ctx.moveTo(a.x, a.y);
      ctx.bezierCurveTo(a.x + (b.x - a.x) * 0.45, a.y, a.x + (b.x - a.x) * 0.55, b.y, b.x, b.y);
      ctx.strokeStyle = color;
      ctx.lineWidth = 1;
      ctx.setLineDash(dash ? [3, 5] : []);
      ctx.stroke();
      ctx.setLineDash([]);
    }

    function node(p: {x:number;y:number}, label: string, sub: string, color: string, align: "left" | "right", small: boolean) {
      ctx.beginPath();
      ctx.arc(p.x, p.y, 4.5, 0, Math.PI * 2);
      ctx.fillStyle = color;
      ctx.fill();
      ctx.beginPath();
      ctx.arc(p.x, p.y, 11, 0, Math.PI * 2);
      ctx.strokeStyle = colors.line2;
      ctx.stroke();
      ctx.font = `500 ${small ? 10 : 11}px ${colors.mono}`;
      ctx.textBaseline = "middle";
      ctx.fillStyle = colors.fg;
      const lx = align === "left" ? p.x - 20 : p.x + 20;
      ctx.textAlign = align === "left" ? "right" : "left";
      if (small) {
        ctx.textAlign = "center";
        ctx.fillText(label, p.x, p.y - 24);
        ctx.fillStyle = colors.muted;
        ctx.fillText(sub, p.x, p.y + 25);
        return;
      }
      ctx.fillText(label, lx, p.y - 7);
      ctx.fillStyle = colors.muted;
      ctx.fillText(sub, lx, p.y + 9);
    }

    function frame(now: number) {
      const dt = Math.min(0.05, (now - last) / 1000);
      last = now;
      const g = geo();
      const share = reduce ? 0.62 : homeShare(now);

      ctx.clearRect(0, 0, w, h);

      // faint dot grid
      ctx.fillStyle = colors.line;
      for (let x = 16; x < w; x += 24) for (let y = 12; y < h; y += 24) ctx.fillRect(x, y, 1, 1);

      drawPath(g.src, g.api, colors.line2);
      drawPath(g.src, g.own, colors.line2);
      // fallback lane
      ctx.beginPath();
      ctx.moveTo(g.own.x, g.own.y - 14);
      ctx.lineTo(g.api.x, g.api.y + 14);
      ctx.strokeStyle = colors.line2;
      ctx.setLineDash([2, 4]);
      ctx.stroke();
      ctx.setLineDash([]);

      // spawn
      if (!reduce) {
        spawnAcc += dt;
        const every = g.small ? 0.11 : 0.065;
        while (spawnAcc > every) {
          spawnAcc -= every;
          ps.push({
            t: 0,
            speed: 0.42 + Math.random() * 0.25,
            dest: Math.random() < share ? "own" : "api",
            phase: "go",
            jitter: (Math.random() - 0.5) * 5,
          });
        }
      } else if (ps.length === 0) {
        for (let i = 0; i < 40; i++)
          ps.push({ t: Math.random(), speed: 0, dest: Math.random() < share ? "own" : "api", phase: "go", jitter: (Math.random() - 0.5) * 5 });
      }

      for (let i = ps.length - 1; i >= 0; i--) {
        const p = ps[i];
        p.t += p.speed * dt;
        let pos: { x: number; y: number };
        let color: string;
        if (p.phase === "go") {
          const b = p.dest === "api" ? g.api : g.own;
          pos = bez(g.src, b, Math.min(1, p.t));
          pos.y += p.jitter * Math.sin(Math.PI * Math.min(1, p.t));
          color = p.dest === "api" ? colors.rented : colors.accent;
          if (p.t >= 1) {
            if (p.dest === "own" && Math.random() < 0.05) {
              p.phase = "fallback"; p.t = 0; p.speed = 1.3;
              fb++;
            } else { ps.splice(i, 1); continue; }
          }
        } else {
          const a = { x: g.own.x, y: g.own.y - 14 }, b = { x: g.api.x, y: g.api.y + 14 };
          pos = { x: a.x + (b.x - a.x) * p.t, y: a.y + (b.y - a.y) * p.t };
          color = colors.bad;
          if (p.t >= 1) { ps.splice(i, 1); continue; }
        }
        ctx.beginPath();
        ctx.arc(pos.x, pos.y, p.phase === "fallback" ? 2.4 : 1.8, 0, Math.PI * 2);
        ctx.fillStyle = color;
        ctx.globalAlpha = p.phase === "fallback" ? 1 : 0.9;
        ctx.fill();
        ctx.globalAlpha = 1;
      }

      node(g.src, "your app", "every AI call", colors.fg, "left", g.small);
      node(g.api, "openai / anthropic", "rented, per token", colors.rented, "right", g.small);
      node(g.own, "your own model", "owned, your cloud", colors.accent, "right", g.small);

      if (now - lastUi > 250) {
        lastUi = now;
        setShare(Math.round(share * 100));
        setFallbacks(fb);
      }
      if (visible && !reduce) raf = requestAnimationFrame(frame);
    }

    resize();
    const ro = new ResizeObserver(() => { resize(); if (reduce) frame(performance.now()); });
    ro.observe(canvas);
    const io = new IntersectionObserver(([e]) => {
      const was = visible;
      visible = e.isIntersecting;
      if (visible && !was && !reduce) { last = performance.now(); raf = requestAnimationFrame(frame); }
    });
    io.observe(canvas);
    const mq = window.matchMedia("(prefers-color-scheme: dark)");
    const onScheme = () => { colors = readColors(); if (reduce) frame(performance.now()); };
    mq.addEventListener("change", onScheme);
    raf = requestAnimationFrame(frame);
    start = performance.now();

    return () => {
      cancelAnimationFrame(raf);
      ro.disconnect();
      io.disconnect();
      mq.removeEventListener("change", onScheme);
    };
  }, []);

  return (
    <div className="instrument" aria-label="Animation: AI requests moving from a rented API to a model you own, with failed checks falling back to the API.">
      <canvas ref={ref} />
      <div className="readout">
        <span className="label">
          <span className="legend"><i style={{ background: "var(--rented)" }} />rented</span>
          <span className="legend"><i style={{ background: "var(--accent)" }} />owned</span>
          <span className="legend"><i style={{ background: "var(--bad)" }} />fell back</span>
        </span>
        <span className="label">
          on own model <b className="mono">{String(share).padStart(2, "0")}%</b> · fallbacks <b className="mono">{fallbacks}</b> · simulation
        </span>
      </div>
    </div>
  );
}
