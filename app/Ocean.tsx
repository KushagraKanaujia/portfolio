"use client";

import { useEffect, useRef } from "react";
import { createWater, type Water } from "./water";

/*
  Background: the page is a dive (scroll = depth).
  - WebGL water: sun, god rays, caustics near the surface, then darkness.
  - Particles: marine snow everywhere, bioluminescent plankton deeper down.
  - Interactive: your cursor is a soft light in the dark; click / tap anywhere to send a sonar ping
    that ripples out and lights up every particle it passes.
*/

type RGB = [number, number, number];
const BG: [number, RGB, RGB][] = [
  [0.0, [38, 132, 172], [8, 62, 100]],
  [0.22, [10, 64, 104], [4, 34, 64]],
  [0.5, [4, 28, 54], [2, 15, 33]],
  [0.78, [2, 13, 29], [1, 7, 18]],
  [1.0, [1, 6, 14], [0, 3, 8]],
];

const clamp = (v: number, a = 0, b = 1) => Math.max(a, Math.min(b, v));
const lerp = (a: number, b: number, t: number) => a + (b - a) * t;
const smooth = (e0: number, e1: number, x: number) => { const t = clamp((x - e0) / (e1 - e0)); return t * t * (3 - 2 * t); };

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

export function ping(x: number, y: number) {
  window.dispatchEvent(new CustomEvent("sonar", { detail: { x, y } }));
}

export default function Ocean() {
  const waterRef = useRef<HTMLCanvasElement>(null);
  const lifeRef = useRef<HTMLCanvasElement>(null);

  useEffect(() => {
    const wcan = waterRef.current!, canvas = lifeRef.current!;
    const ctx = canvas.getContext("2d")!;
    const reduce = window.matchMedia("(prefers-reduced-motion: reduce)").matches;
    const water: Water | null = createWater(wcan);
    if (!water) wcan.style.display = "none";
    let W = 0, H = 0, small = false;
    let raf = 0, t = 0, last = performance.now();
    let D = 0, Ds = 0;
    const mouse = { x: -9999, y: -9999, on: false };
    const R = Math.random;

    type Dot = { x: number; y: number; z: number; s: number; glow: number };
    type Bubble = { x: number; y: number; r: number; v: number; ph: number };
    type Ring = { x: number; y: number; t0: number };
    let snow: Dot[] = [], plank: Dot[] = [], bubbles: Bubble[] = [];
    const rings: Ring[] = [];

    function populate() {
      const k = small ? 0.5 : 1;
      snow = Array.from({ length: Math.round(150 * k) }, () => ({ x: R() * W, y: R() * H, z: 0.3 + R() * 0.9, s: R(), glow: 0 }));
      plank = Array.from({ length: Math.round(240 * k) }, () => ({ x: R() * W, y: R() * H, z: 0.4 + R() * 0.8, s: R() * 6, glow: 0 }));
      bubbles = Array.from({ length: Math.round(22 * k) }, () => ({ x: R() * W, y: R() * H, r: 1.5 + R() * 4, v: 22 + R() * 40, ph: R() * 6 }));
    }

    function resize() {
      const dpr = Math.min(window.devicePixelRatio || 1, 1.75);
      W = window.innerWidth; H = window.innerHeight; small = W < 700;
      canvas.width = Math.round(W * dpr); canvas.height = Math.round(H * dpr);
      canvas.style.width = W + "px"; canvas.style.height = H + "px";
      ctx.setTransform(dpr, 0, 0, dpr, 0, 0);
      water?.resize(Math.round(W * (small ? 0.5 : 0.6)), Math.round(H * (small ? 0.5 : 0.6)));
      populate();
    }

    function flatWater() {
      const [top, bot] = bgAt(Ds);
      const g = ctx.createLinearGradient(0, 0, 0, H);
      g.addColorStop(0, `rgb(${top.join(",")})`); g.addColorStop(1, `rgb(${bot.join(",")})`);
      ctx.fillStyle = g; ctx.fillRect(0, 0, W, H);
    }

    // how strongly a sonar ring is passing over a point right now
    function sonarAt(x: number, y: number) {
      let v = 0;
      for (const r of rings) {
        const age = t - r.t0, rad = age * 520, d = Math.hypot(x - r.x, y - r.y);
        const band = Math.exp(-Math.pow((d - rad) / 40, 2)) * Math.max(0, 1 - age / 2.2);
        v = Math.max(v, band);
      }
      return v;
    }

    function cursorAt(x: number, y: number) {
      if (!mouse.on) return 0;
      const d = Math.hypot(x - mouse.x, y - mouse.y);
      return d < 170 ? 1 - d / 170 : 0;
    }

    function drawRings() {
      for (let i = rings.length - 1; i >= 0; i--) {
        const r = rings[i], age = t - r.t0;
        if (age > 2.2) { rings.splice(i, 1); continue; }
        const rad = age * 520, a = Math.max(0, 1 - age / 2.2);
        for (let k = 0; k < 3; k++) {
          const rr = rad - k * 26;
          if (rr <= 0) continue;
          ctx.strokeStyle = `rgba(143,227,255,${(0.42 - k * 0.12) * a})`;
          ctx.lineWidth = 1.4 - k * 0.3;
          ctx.beginPath(); ctx.arc(r.x, r.y, rr, 0, Math.PI * 2); ctx.stroke();
        }
        ctx.fillStyle = `rgba(255,201,143,${0.9 * a})`;
        ctx.beginPath(); ctx.arc(r.x, r.y, 3 + (1 - a) * 3, 0, Math.PI * 2); ctx.fill();
      }
    }

    function particles(dt: number) {
      // marine snow
      const sa = 0.2 + 0.35 * smooth(0.1, 0.6, Ds);
      for (const p of snow) {
        p.y += (5 + p.z * 8) * dt;
        p.x += Math.sin(t * 0.3 + p.s * 10) * 0.12;
        if (p.y > H + 5) { p.y = -5; p.x = R() * W; }
        const lit = Math.max(sonarAt(p.x, p.y), cursorAt(p.x, p.y) * 0.6);
        p.glow = lit > p.glow ? lit : lerp(p.glow, lit, clamp(dt * 1.5));
        ctx.fillStyle = p.glow > 0.05 ? `rgba(255,${lerp(232, 206, p.glow)},${lerp(245, 150, p.glow)},${Math.min(1, sa + p.glow)})` : `rgba(215,232,245,${sa * (0.4 + p.s * 0.6)})`;
        ctx.beginPath(); ctx.arc(p.x, p.y, p.z * (0.9 + p.glow * 1.6), 0, Math.PI * 2); ctx.fill();
      }
      // bubbles near the surface
      const ba = 1 - smooth(0.12, 0.3, Ds);
      if (ba > 0.01) for (const b of bubbles) {
        b.y -= b.v * dt; b.ph += dt * 2.2;
        if (b.y < -10) { b.y = H + 10; b.x = R() * W; }
        const x = b.x + Math.sin(b.ph) * (2 + b.r);
        ctx.strokeStyle = `rgba(225,245,255,${0.45 * ba})`; ctx.lineWidth = 1;
        ctx.beginPath(); ctx.arc(x, b.y, b.r, 0, Math.PI * 2); ctx.stroke();
        ctx.fillStyle = `rgba(255,255,255,${0.6 * ba})`;
        ctx.beginPath(); ctx.arc(x - b.r * 0.35, b.y - b.r * 0.35, b.r * 0.25, 0, Math.PI * 2); ctx.fill();
      }
      // bioluminescent plankton in the deep
      const pa = smooth(0.4, 0.7, Ds);
      if (pa > 0.01) {
        ctx.save();
        ctx.globalCompositeOperation = "lighter";
        for (const p of plank) {
          p.y -= 3 * p.z * dt;
          p.x += Math.sin(t * 0.4 + p.s) * 0.15;
          if (p.y < -10) { p.y = H + 10; p.x = R() * W; }
          const lit = Math.max(sonarAt(p.x, p.y), cursorAt(p.x, p.y));
          p.glow = lit > p.glow ? lerp(p.glow, lit, clamp(dt * 12)) : lerp(p.glow, lit, clamp(dt * 0.8));
          const tw = Math.pow(0.5 + 0.5 * Math.sin(t * (0.6 + p.z) + p.s * 4), 3);
          const g = p.glow;
          const rC = lerp(90, 255, g), gC = lerp(205, 200, g), bC = lerp(255, 130, g);
          const rad = p.z * (1 + tw * 1.2 + g * 3);
          if (tw + g > 0.15) {
            const grd = ctx.createRadialGradient(p.x, p.y, 0, p.x, p.y, rad * 5);
            grd.addColorStop(0, `rgba(${rC},${gC},${bC},${0.3 * pa * (tw * 0.6 + g)})`); grd.addColorStop(1, "rgba(0,0,0,0)");
            ctx.fillStyle = grd; ctx.beginPath(); ctx.arc(p.x, p.y, rad * 5, 0, Math.PI * 2); ctx.fill();
          }
          ctx.fillStyle = `rgba(${rC},${gC},${bC},${Math.min(1, pa * (0.2 + tw * 0.6 + g))})`;
          ctx.beginPath(); ctx.arc(p.x, p.y, rad * 0.7, 0, Math.PI * 2); ctx.fill();
        }
        ctx.restore();
      }
    }

    function frame(now: number) {
      const dt = Math.min(0.05, (now - last) / 1000);
      last = now;
      if (!reduce) t += dt;
      const max = Math.max(1, document.documentElement.scrollHeight - window.innerHeight);
      D = clamp(window.scrollY / max);
      Ds = lerp(Ds, D, reduce ? 1 : clamp(dt * 6));
      const [top, bot] = bgAt(Ds);
      if (water) water.render({ time: t, depth: Ds, top, bot, mouse: mouse.on ? [mouse.x / W, mouse.y / H] : [-1, -1] });
      ctx.clearRect(0, 0, W, H);
      if (!water) flatWater();
      particles(dt);
      drawRings();
      raf = requestAnimationFrame(frame);
    }

    const onMove = (e: PointerEvent) => { mouse.x = e.clientX; mouse.y = e.clientY; mouse.on = e.pointerType === "mouse"; };
    const onLeave = () => { mouse.on = false; };
    const onDown = (e: PointerEvent) => {
      const el = e.target as HTMLElement;
      if (el.closest("a, button, input, textarea, .term, .net")) return; // don't ping when using the UI
      rings.push({ x: e.clientX, y: e.clientY, t0: t });
    };
    const onSonar = (e: Event) => { const d = (e as CustomEvent<{ x: number; y: number }>).detail; rings.push({ x: d.x, y: d.y, t0: t }); };
    const onVis = () => { cancelAnimationFrame(raf); if (!document.hidden) { last = performance.now(); raf = requestAnimationFrame(frame); } };

    resize();
    Ds = D = clamp(window.scrollY / Math.max(1, document.documentElement.scrollHeight - window.innerHeight));
    window.addEventListener("resize", resize);
    window.addEventListener("pointermove", onMove, { passive: true });
    window.addEventListener("pointerdown", onDown, { passive: true });
    window.addEventListener("sonar", onSonar);
    document.addEventListener("pointerleave", onLeave);
    document.addEventListener("visibilitychange", onVis);
    raf = requestAnimationFrame(frame);
    return () => {
      cancelAnimationFrame(raf);
      water?.destroy();
      window.removeEventListener("resize", resize);
      window.removeEventListener("pointermove", onMove);
      window.removeEventListener("pointerdown", onDown);
      window.removeEventListener("sonar", onSonar);
      document.removeEventListener("pointerleave", onLeave);
      document.removeEventListener("visibilitychange", onVis);
    };
  }, []);

  return (
    <>
      <canvas ref={waterRef} className="ocean water" aria-hidden />
      <canvas ref={lifeRef} className="ocean life" aria-hidden />
    </>
  );
}
