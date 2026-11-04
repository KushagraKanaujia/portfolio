"use client";

import { useEffect, useRef } from "react";
import { createWater, type Water } from "./water";

/*
  The page is a dive. Scroll position = depth.
  - Surface: a WebGL water shader (sun, god rays, caustics, the surface from below).
  - Below that: real underwater footage that plays on its own and crossfades by depth:
    a humpback whale, then moon jellyfish, then crystal jellyfish glowing in the dark.
  - On top: drifting marine snow and, in the deep, softly twinkling plankton.
*/

const MAX_DEPTH = 4000;
const ZONES: [number, string][] = [
  [0, "Sunlight zone"], [0.25, "Twilight zone"], [0.62, "Midnight zone"], [0.88, "The abyss"],
];

type RGB = [number, number, number];
const BG: [number, RGB, RGB][] = [
  [0.0, [38, 132, 172], [8, 62, 100]],
  [0.25, [10, 64, 104], [4, 34, 64]],
  [0.55, [4, 28, 54], [2, 15, 33]],
  [0.8, [2, 13, 29], [1, 7, 18]],
  [1.0, [1, 6, 14], [0, 3, 8]],
];

export const CLIPS = [
  { id: "whale", src: "/ocean/whale.mp4", poster: "/ocean/whale.jpg" },
  { id: "moon", src: "/ocean/moon-jellies.mp4", poster: "/ocean/moon-jellies.jpg" },
  { id: "crystal", src: "/ocean/crystal-jellies.mp4", poster: "/ocean/crystal-jellies.jpg" },
] as const;

const clamp = (v: number, a = 0, b = 1) => Math.max(a, Math.min(b, v));
const lerp = (a: number, b: number, t: number) => a + (b - a) * t;
const smooth = (e0: number, e1: number, x: number) => { const t = clamp((x - e0) / (e1 - e0)); return t * t * (3 - 2 * t); };
const band = (x: number, a: number, b: number, c: number, d: number) => smooth(a, b, x) * (1 - smooth(c, d, x));

function bgAt(D: number): [RGB, RGB] {
  for (let i = 0; i < BG.length - 1; i++) {
    const [d0, t0, b0] = BG[i], [d1, t1, b1] = BG[i + 1];
    if (D <= d1) {
      const t = (D - d0) / (d1 - d0);
      return [t0.map((v, k) => lerp(v, t1[k], t)) as RGB, b0.map((v, k) => lerp(v, b1[k], t)) as RGB];
    }
  }
  return [BG[BG.length - 1][1], BG[BG.length - 1][2]];
}

export default function Ocean() {
  const waterRef = useRef<HTMLCanvasElement>(null);
  const lifeRef = useRef<HTMLCanvasElement>(null);
  const vids = useRef<(HTMLVideoElement | null)[]>([]);
  const depthRef = useRef<HTMLSpanElement>(null);
  const zoneRef = useRef<HTMLSpanElement>(null);
  const markRef = useRef<HTMLSpanElement>(null);

  useEffect(() => {
    const wcan = waterRef.current!, canvas = lifeRef.current!;
    const ctx = canvas.getContext("2d")!;
    const reduce = window.matchMedia("(prefers-reduced-motion: reduce)").matches;
    const water: Water | null = createWater(wcan);
    if (!water) wcan.style.display = "none";
    let W = 0, H = 0, small = false;
    let raf = 0, t = 0, last = performance.now();
    let D = 0, Ds = 0;
    let glowFlash = 0;
    const R = Math.random;

    type Snow = { x: number; y: number; z: number; s: number };
    type Bubble = { x: number; y: number; r: number; v: number; ph: number; life: number };
    let snow: Snow[] = [], bokeh: Snow[] = [], bubbles: Bubble[] = [], plank: Snow[] = [];

    // where each clip lives, tied to the page's sections
    let whaleEnd = 0.6, moonEnd = 0.8;
    function anchor() {
      const max = Math.max(1, document.documentElement.scrollHeight - window.innerHeight);
      const at = (id: string, fb: number) => {
        const el = document.getElementById(id);
        if (!el) return fb;
        const r = el.getBoundingClientRect();
        return clamp((r.top + window.scrollY + r.height / 2 - window.innerHeight / 2) / max);
      };
      whaleEnd = at("whale-spot", whaleEnd) + 0.05;
      moonEnd = at("made", moonEnd) + 0.06;
    }

    function populate() {
      const k = small ? 0.5 : 1;
      snow = Array.from({ length: Math.round(170 * k) }, () => ({ x: R() * W, y: R() * H, z: 0.3 + R() * 0.9, s: R() }));
      bokeh = Array.from({ length: Math.round(10 * k) }, () => ({ x: R() * W, y: R() * H, z: 1 + R() * 1.5, s: R() }));
      bubbles = Array.from({ length: Math.round(26 * k) }, () => ({ x: R() * W, y: R() * H, r: 1.5 + R() * 4.5, v: 22 + R() * 40, ph: R() * 6, life: -1 }));
      plank = Array.from({ length: Math.round(160 * k) }, () => ({ x: R() * W, y: R() * H, z: 0.4 + R() * 0.8, s: R() * 6 }));
    }

    function resize() {
      const dpr = Math.min(window.devicePixelRatio || 1, 1.75);
      W = window.innerWidth; H = window.innerHeight; small = W < 700;
      canvas.width = Math.round(W * dpr); canvas.height = Math.round(H * dpr);
      canvas.style.width = W + "px"; canvas.style.height = H + "px";
      ctx.setTransform(dpr, 0, 0, dpr, 0, 0);
      water?.resize(Math.round(W * (small ? 0.5 : 0.6)), Math.round(H * (small ? 0.5 : 0.6)));
      populate();
      anchor();
    }

    function flatWater() {
      const [top, bot] = bgAt(Ds);
      const g = ctx.createLinearGradient(0, 0, 0, H);
      g.addColorStop(0, `rgb(${top.join(",")})`); g.addColorStop(1, `rgb(${bot.join(",")})`);
      ctx.fillStyle = g; ctx.fillRect(0, 0, W, H);
    }

    // particles drift on their own; they do not react to scrolling or the mouse
    function marineSnow(dt: number) {
      const a = 0.18 + 0.4 * smooth(0.1, 0.6, Ds);
      ctx.fillStyle = `rgba(215,232,245,${a})`;
      for (const p of snow) {
        p.y += (5 + p.z * 8) * dt;
        p.x += Math.sin(t * 0.3 + p.s * 10) * 0.12;
        if (p.y > H + 5) { p.y = -5; p.x = R() * W; }
        ctx.globalAlpha = 0.3 + p.s * 0.5;
        ctx.beginPath(); ctx.arc(p.x, p.y, p.z * 0.9, 0, Math.PI * 2); ctx.fill();
      }
      ctx.globalAlpha = 1;
      for (const b of bokeh) {
        b.y += 4 * dt;
        b.x += Math.sin(t * 0.2 + b.s * 8) * 0.2;
        if (b.y > H + 40) { b.y = -40; b.x = R() * W; }
        const r = 8 + b.z * 10;
        const g = ctx.createRadialGradient(b.x, b.y, 0, b.x, b.y, r);
        g.addColorStop(0, `rgba(220,240,255,${0.08 * a})`); g.addColorStop(1, "rgba(220,240,255,0)");
        ctx.fillStyle = g; ctx.beginPath(); ctx.arc(b.x, b.y, r, 0, Math.PI * 2); ctx.fill();
      }
    }

    function bubbleLayer(dt: number) {
      const a = 1 - smooth(0.15, 0.35, Ds);
      for (let i = bubbles.length - 1; i >= 0; i--) {
        const b = bubbles[i];
        b.y -= b.v * dt; b.ph += dt * 2.2;
        if (b.life >= 0) { b.life -= dt; if (b.life <= 0 || b.y < -20) { bubbles.splice(i, 1); continue; } }
        else if (b.y < -10) { b.y = H + 10; b.x = R() * W; }
        const alpha = b.life >= 0 ? 0.9 : a;
        if (alpha <= 0.01) continue;
        const x = b.x + Math.sin(b.ph) * (2 + b.r);
        const g = ctx.createRadialGradient(x, b.y, b.r * 0.2, x, b.y, b.r);
        g.addColorStop(0, `rgba(200,235,255,${0.04 * alpha})`);
        g.addColorStop(0.8, `rgba(200,235,255,${0.12 * alpha})`);
        g.addColorStop(1, `rgba(235,250,255,${0.5 * alpha})`);
        ctx.fillStyle = g; ctx.beginPath(); ctx.arc(x, b.y, b.r, 0, Math.PI * 2); ctx.fill();
        ctx.fillStyle = `rgba(255,255,255,${0.7 * alpha})`;
        ctx.beginPath(); ctx.ellipse(x - b.r * 0.38, b.y - b.r * 0.4, b.r * 0.28, b.r * 0.18, -0.6, 0, Math.PI * 2); ctx.fill();
      }
    }

    function plankton(dt: number) {
      glowFlash = Math.max(0, glowFlash - dt * 0.3);
      const a = Math.max(smooth(0.82, 0.92, Ds) * 0.7, glowFlash);
      if (a <= 0.01) return;
      ctx.save();
      ctx.globalCompositeOperation = "lighter";
      for (const p of plank) {
        p.y -= 3 * p.z * dt;
        p.x += Math.sin(t * 0.4 + p.s) * 0.15;
        if (p.y < -10) { p.y = H + 10; p.x = R() * W; }
        const tw = Math.pow(0.5 + 0.5 * Math.sin(t * (0.6 + p.z) + p.s * 4), 3);
        const g = glowFlash;
        const rC = lerp(90, 255, g), gC = lerp(205, 196, g), bC = lerp(255, 120, g);
        const rad = p.z * (1 + tw * 1.4 + g * 2.5);
        const grd = ctx.createRadialGradient(p.x, p.y, 0, p.x, p.y, rad * 5);
        grd.addColorStop(0, `rgba(${rC},${gC},${bC},${0.3 * a * (tw + g)})`); grd.addColorStop(1, "rgba(0,0,0,0)");
        ctx.fillStyle = grd; ctx.beginPath(); ctx.arc(p.x, p.y, rad * 5, 0, Math.PI * 2); ctx.fill();
        ctx.fillStyle = `rgba(${rC},${gC},${bC},${Math.min(1, a * (0.25 + tw))})`;
        ctx.beginPath(); ctx.arc(p.x, p.y, rad * 0.7, 0, Math.PI * 2); ctx.fill();
      }
      ctx.restore();
    }

    function footage() {
      const ops = [
        band(Ds, 0.12, 0.22, whaleEnd - 0.03, whaleEnd + 0.04),
        band(Ds, whaleEnd - 0.03, whaleEnd + 0.04, moonEnd - 0.03, moonEnd + 0.04),
        smooth(moonEnd - 0.03, moonEnd + 0.04, Ds),
      ];
      vids.current.forEach((v, i) => {
        if (!v) return;
        const o = ops[i];
        v.style.opacity = o.toFixed(3);
        // a gentle push-in as you pass, like a slow camera move
        v.style.transform = `scale(${(1.04 + o * 0.03).toFixed(4)})`;
        if (o > 0.01 && v.paused && !reduce) v.play().catch(() => {});
        if (o <= 0.01 && !v.paused) v.pause();
        if (o > 0 && v.preload !== "auto") v.preload = "auto";
      });
    }

    function hud() {
      const m = Math.round(Ds * MAX_DEPTH);
      if (depthRef.current) depthRef.current.textContent = m.toLocaleString("en-US");
      let z = ZONES[0][1];
      for (const [d, n] of ZONES) if (Ds >= d) z = n;
      if (zoneRef.current && zoneRef.current.textContent !== z) zoneRef.current.textContent = z;
      if (markRef.current) markRef.current.style.top = `${Ds * 100}%`;
    }

    function frame(now: number) {
      const dt = Math.min(0.05, (now - last) / 1000);
      last = now;
      if (!reduce) t += dt;
      const max = Math.max(1, document.documentElement.scrollHeight - window.innerHeight);
      D = clamp(window.scrollY / max);
      Ds = lerp(Ds, D, reduce ? 1 : clamp(dt * 6));
      const [top, bot] = bgAt(Ds);
      if (water) water.render({ time: t, depth: Ds, top, bot, mouse: [-1, -1] });
      ctx.clearRect(0, 0, W, H);
      if (!water) flatWater();
      footage();
      marineSnow(dt);
      bubbleLayer(dt);
      plankton(dt);
      hud();
      raf = requestAnimationFrame(frame);
    }

    const onVis = () => {
      cancelAnimationFrame(raf);
      if (document.hidden) vids.current.forEach((v) => v?.pause());
      else { last = performance.now(); raf = requestAnimationFrame(frame); }
    };
    const scrollToSection = (id: string) => document.getElementById(id)?.scrollIntoView({ behavior: "smooth", block: "center" });
    const onOcean = (e: Event) => {
      const k = (e as CustomEvent<string>).detail;
      if (k === "bubbles") for (let i = 0; i < 70; i++) bubbles.push({ x: W * 0.5 + (R() - 0.5) * 160, y: H * 0.75 + R() * 120, r: 1.5 + R() * 7, v: 60 + R() * 140, ph: R() * 6, life: 6 });
      if (k === "glow") glowFlash = 1;
      if (k === "whale") scrollToSection("whale-spot");
      if (k === "jelly") scrollToSection("made");
      if (k === "deep") window.scrollTo({ top: document.documentElement.scrollHeight, behavior: "smooth" });
    };

    resize();
    Ds = D = clamp(window.scrollY / Math.max(1, document.documentElement.scrollHeight - window.innerHeight));
    const anchorTimer = setInterval(anchor, 1500);
    window.addEventListener("resize", resize);
    window.addEventListener("ocean", onOcean);
    document.addEventListener("visibilitychange", onVis);
    raf = requestAnimationFrame(frame);
    return () => {
      cancelAnimationFrame(raf);
      clearInterval(anchorTimer);
      water?.destroy();
      window.removeEventListener("resize", resize);
      window.removeEventListener("ocean", onOcean);
      document.removeEventListener("visibilitychange", onVis);
    };
  }, []);

  return (
    <>
      <canvas ref={waterRef} className="ocean water" aria-hidden />
      {CLIPS.map((c, i) => (
        <video
          key={c.id}
          ref={(el) => { vids.current[i] = el; }}
          className={`footage f-${c.id}`}
          src={c.src}
          poster={c.poster}
          muted
          loop
          playsInline
          preload={i === 0 ? "auto" : "metadata"}
          aria-hidden
          tabIndex={-1}
        />
      ))}
      <div className="footage-grade" aria-hidden />
      <canvas ref={lifeRef} className="ocean life" aria-hidden />
      <div className="gauge" aria-hidden>
        <div className="gauge-track"><span ref={markRef} className="gauge-mark" /></div>
        <div className="gauge-read">
          <span className="gauge-num"><span ref={depthRef}>0</span> m</span>
          <span ref={zoneRef} className="gauge-zone">Sunlight zone</span>
        </div>
      </div>
    </>
  );
}
