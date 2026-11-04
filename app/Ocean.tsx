"use client";

import { useEffect, useRef } from "react";
import { createWater, type Water } from "./water";
import { drawFish, drawRay, drawWhale as paintWhale, drawSquid, makeSquid, updateSquid, type Squid } from "./creatures";

/*
  The whole page is a dive. Scroll progress = depth.
  Water (light, rays, caustics, the surface) is a WebGL shader; the sea life is drawn on a 2D canvas on top.
  The terminal can send events: window.dispatchEvent(new CustomEvent("ocean", { detail: "whale" | "bubbles" | "glow" | "jelly" }))
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
  const depthRef = useRef<HTMLSpanElement>(null);
  const zoneRef = useRef<HTMLSpanElement>(null);
  const markRef = useRef<HTMLSpanElement>(null);

  useEffect(() => {
    const wcan = waterRef.current!, canvas = lifeRef.current!;
    const ctx = canvas.getContext("2d")!;
    const reduce = window.matchMedia("(prefers-reduced-motion: reduce)").matches;
    const water: Water | null = createWater(wcan);
    if (!water) wcan.style.display = "none";
    let W = 0, H = 0, dpr = 1, small = false;
    let raf = 0, t = 0, last = performance.now();
    let D = 0, Ds = 0, scrollV = 0, lastScroll = window.scrollY;
    const mouse = { x: -9999, y: -9999, on: false };
    const R = Math.random;
    const hasFilter = "filter" in ctx;

    type Snow = { x: number; y: number; z: number; s: number };
    type Bubble = { x: number; y: number; r: number; v: number; ph: number; life: number };
    type Fish = { ox: number; oy: number; ph: number; sp: number; px: number; py: number; ax: number; ay: number; sz: number; h: number };
    type Jelly = { x: number; d: number; r: number; ph: number; hue: number; sway: number; z: number };
    type Plank = { x: number; y: number; z: number; ph: number; glow: number };
    let snow: Snow[] = [], bubbles: Bubble[] = [], fish: Fish[] = [], jellies: Jelly[] = [], plank: Plank[] = [];
    let bokeh: Snow[] = [];
    let whaleD = 0.58, mantaD = 0.2;
    let summon = -100, glowFlash = 0, jellyBoost = 0, squidBoost = 0;

    function populate() {
      const k = small ? 0.5 : 1;
      snow = Array.from({ length: Math.round(220 * k) }, () => ({ x: R() * W, y: R() * H, z: 0.3 + R() * 0.9, s: R() }));
      bokeh = Array.from({ length: Math.round(14 * k) }, () => ({ x: R() * W, y: R() * H, z: 1 + R() * 1.5, s: R() }));
      bubbles = Array.from({ length: Math.round(30 * k) }, () => ({ x: R() * W, y: R() * H, r: 1.5 + R() * 4.5, v: 22 + R() * 40, ph: R() * 6, life: -1 }));
      fish = Array.from({ length: Math.round(130 * k) }, () => {
        const a = R() * Math.PI * 2, rr = Math.sqrt(R());
        return { ox: Math.cos(a) * rr * 190, oy: Math.sin(a) * rr * 75, ph: R() * 6, sp: 0.8 + R() * 0.4, px: 0, py: 0, ax: 0, ay: 0, sz: 0.75 + R() * 0.5, h: 0 };
      });
      const hues = [24, 345, 34, 195, 12, 320, 42];
      const n = small ? 4 : 7;
      jellies = Array.from({ length: n }, (_, i) => ({
        x: (0.1 + (i / (n - 1)) * 0.8) * W + (R() - 0.5) * 60,
        d: 0.5 + R() * 0.32, r: (small ? 20 : 26) + R() * 26, ph: R() * 6, hue: hues[i % hues.length], sway: R() * 6, z: 0.6 + R() * 0.6,
      }));
      plank = Array.from({ length: Math.round(300 * k) }, () => ({ x: R() * W, y: R() * H, z: 0.4 + R() * 0.8, ph: R() * 6, glow: 0 }));
    }

    function anchor() {
      const max = Math.max(1, document.documentElement.scrollHeight - window.innerHeight);
      const at = (id: string, fb: number) => {
        const el = document.getElementById(id);
        if (!el) return fb;
        const r = el.getBoundingClientRect();
        return clamp((r.top + window.scrollY + r.height / 2 - window.innerHeight / 2) / max);
      };
      whaleD = at("whale-spot", whaleD);
      mantaD = at("terminal", mantaD);
    }

    function resize() {
      dpr = Math.min(window.devicePixelRatio || 1, 1.75);
      W = window.innerWidth; H = window.innerHeight; small = W < 700;
      canvas.width = Math.round(W * dpr); canvas.height = Math.round(H * dpr);
      canvas.style.width = W + "px"; canvas.style.height = H + "px";
      ctx.setTransform(dpr, 0, 0, dpr, 0, 0);
      const ws = small ? 0.5 : 0.6;
      water?.resize(Math.round(W * ws), Math.round(H * ws));
      populate();
      anchor();
    }

    const yAt = (d: number, span = 3.2) => H * 0.5 + (d - Ds) * H * span;
    const blur = (px: number) => { if (hasFilter) ctx.filter = px > 0.3 ? `blur(${px.toFixed(1)}px)` : "none"; };

    function flatWater() {
      const [top, bot] = bgAt(Ds);
      const g = ctx.createLinearGradient(0, 0, 0, H);
      g.addColorStop(0, `rgb(${top.join(",")})`); g.addColorStop(1, `rgb(${bot.join(",")})`);
      ctx.fillStyle = g; ctx.fillRect(0, 0, W, H);
    }

    function marineSnow(dt: number) {
      const a = 0.22 + 0.5 * smooth(0.1, 0.6, Ds);
      ctx.fillStyle = `rgba(215,232,245,${a})`;
      for (const p of snow) {
        p.y += (5 + p.z * 8) * dt - scrollV * 0.25 * p.z;
        p.x += Math.sin(t * 0.3 + p.s * 10) * 0.12;
        if (p.y > H + 5) { p.y = -5; p.x = R() * W; }
        if (p.y < -5) { p.y = H + 5; p.x = R() * W; }
        ctx.globalAlpha = 0.3 + p.s * 0.5;
        ctx.beginPath(); ctx.arc(p.x, p.y, p.z * 0.9, 0, Math.PI * 2); ctx.fill();
      }
      ctx.globalAlpha = 1;
      for (const b of bokeh) {
        b.y += 4 * dt - scrollV * 0.9 * b.z;
        b.x += Math.sin(t * 0.2 + b.s * 8) * 0.2;
        if (b.y > H + 40) { b.y = -40; b.x = R() * W; }
        if (b.y < -40) { b.y = H + 40; b.x = R() * W; }
        const r = 8 + b.z * 10;
        const g = ctx.createRadialGradient(b.x, b.y, 0, b.x, b.y, r);
        g.addColorStop(0, `rgba(220,240,255,${0.10 * a})`); g.addColorStop(0.7, `rgba(220,240,255,${0.05 * a})`); g.addColorStop(1, "rgba(220,240,255,0)");
        ctx.fillStyle = g; ctx.beginPath(); ctx.arc(b.x, b.y, r, 0, Math.PI * 2); ctx.fill();
      }
    }

    function bubbleLayer(dt: number) {
      const a = 1 - smooth(0.3, 0.7, Ds);
      for (let i = bubbles.length - 1; i >= 0; i--) {
        const b = bubbles[i];
        b.y -= b.v * dt + scrollV * 0.15;
        b.ph += dt * 2.2;
        if (b.life >= 0) { b.life -= dt; if (b.life <= 0 || b.y < -20) { bubbles.splice(i, 1); continue; } }
        else {
          if (b.y < -10) { b.y = H + 10; b.x = R() * W; }
          if (b.y > H + 10) b.y = -10;
        }
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

    function burst() {
      for (let i = 0; i < 70; i++)
        bubbles.push({ x: W * 0.5 + (R() - 0.5) * 160, y: H * 0.75 + R() * 120, r: 1.5 + R() * 7, v: 60 + R() * 140, ph: R() * 6, life: 6 });
    }

    function school(dt: number) {
      const a = band(Ds, 0.04, 0.14, 0.38, 0.5);
      if (a <= 0.01) return;
      const cy = yAt(0.27, 2.6);
      const lx = W * 0.5 + Math.sin(t * 0.15) * W * 0.33;
      const ly = cy + Math.sin(t * 0.3) * H * 0.12;
      const ang = Math.atan2(Math.cos(t * 0.3) * 0.3 * H * 0.12, Math.cos(t * 0.15) * 0.15 * W * 0.33);
      const base = small ? 8 : 12;
      ctx.globalAlpha = 1;
      for (const f of fish) {
        const wob = Math.sin(t * 1.3 * f.sp + f.ph);
        let tx = lx + f.ox * Math.cos(ang) - f.oy * Math.sin(ang) + wob * 10;
        let ty = ly + f.ox * Math.sin(ang) + f.oy * Math.cos(ang) + Math.cos(t * f.sp + f.ph) * 8;
        if (mouse.on) {
          const dx = tx - mouse.x, dy = ty - mouse.y, d2 = dx * dx + dy * dy;
          if (d2 < 170 * 170) { const d = Math.sqrt(d2) || 1; const k = (1 - d / 170) * 90; f.ax += (dx / d) * k * dt * 8; f.ay += (dy / d) * k * dt * 8; }
        }
        f.ax *= 0.93; f.ay *= 0.93;
        tx += f.ax; ty += f.ay;
        if (f.px === 0) { f.px = tx; f.py = ty; }
        const vx = tx - f.px, vy = ty - f.py;
        f.px = lerp(f.px, tx, clamp(dt * 3)); f.py = lerp(f.py, ty, clamp(dt * 3));
        const want = Math.abs(vx) + Math.abs(vy) > 0.3 ? Math.atan2(vy, vx) : ang;
        let dh = want - f.h; while (dh > Math.PI) dh -= Math.PI * 2; while (dh < -Math.PI) dh += Math.PI * 2;
        f.h += dh * clamp(dt * 5);
        const fa = f.h;
        const sunlit = 1 - smooth(0.05, 0.4, Ds);
        drawFish(ctx, { x: f.px, y: f.py, vx: 0, vy: 0, ox: 0, oy: 0, ph: f.ph, sz: f.sz, freq: 9 * f.sp, ax: 0, ay: 0 }, fa, t, base * 1.6 * f.sz, a, sunlit);
      }
      ctx.globalAlpha = 1;
    }

    function manta() {
      const a = band(Ds, mantaD - 0.16, mantaD - 0.08, mantaD + 0.08, mantaD + 0.16);
      if (a <= 0.01) return;
      const s = small ? 0.5 : Math.min(0.95, W / 1450);
      const prog = clamp((Ds - (mantaD - 0.16)) / 0.32);
      const x = lerp(W + 360 * s, -360 * s, prog) + Math.sin(t * 0.25) * 30;
      const y = H * 0.28 + Math.sin(t * 0.35) * 22 + (prog - 0.5) * H * 0.2;
      drawRay(ctx, x, y, s, t, a * 0.95);
    }

    const drawWhale = (x: number, y: number, s: number, a: number) => paintWhale(ctx, x, y, s, t, a, 0.8 / s);

    // a squid that jets across the midnight zone
    let squid: Squid | null = null;
    function squids(dt: number) {
      const a = band(Ds, 0.62, 0.7, 0.84, 0.9) + squidBoost;
      squidBoost = Math.max(0, squidBoost - dt * 0.06);
      if (a <= 0.01) { squid = null; return; }
      const s = small ? 0.6 : Math.min(1.25, W / 1150);
      if (!squid || squid.x < -400 * s) squid = makeSquid(W + 120 * s, H * (0.3 + R() * 0.35));
      const pulse = updateSquid(squid, dt, t, s);
      drawSquid(ctx, squid, t, s, Math.min(1, a), pulse);
    }

    const whaleBand = () => band(Ds, whaleD - 0.13, whaleD - 0.07, whaleD + 0.07, whaleD + 0.13);
    function whales() {
      const s = small ? 0.5 : Math.min(1.15, W / 1250);
      const a = whaleBand();
      if (a > 0.01) {
        const prog = clamp((Ds - (whaleD - 0.13)) / 0.26);
        drawWhale(lerp(-500 * s, W + 500 * s, prog) + Math.sin(t * 0.3) * 20, H * 0.5 + Math.sin(t * 0.4) * 14 + (0.5 - prog) * H * 0.25, s, a);
      }
      const age = t - summon;
      if (age >= 0 && age < 14) {
        const p = age / 14;
        const fade = smooth(0, 0.08, p) * (1 - smooth(0.92, 1, p));
        const wx = lerp(-520 * s, W + 520 * s, p);
        drawWhale(wx, H * 0.58 + Math.sin(age * 0.6) * 18, s * 0.9, fade);
        if (R() < 0.3) bubbles.push({ x: wx + 250 * s, y: H * 0.58 - 70 * s, r: 1.5 + R() * 4, v: 50 + R() * 60, ph: R() * 6, life: 4 });
      }
    }

    function jellyfish(dt: number) {
      jellyBoost = Math.max(0, jellyBoost - dt * 0.08);
      const natural = band(Ds, 0.42, 0.55, 0.82, 0.92) * (1 - 0.75 * whaleBand());
      const a = Math.max(natural, jellyBoost);
      if (a <= 0.01) return;
      const summoned = jellyBoost > natural;
      ctx.save();
      for (const j of jellies) {
        j.ph += dt * 1.3;
        const pulse = Math.sin(j.ph);
        const r = j.r * (1 + pulse * 0.09);
        const x = j.x + Math.sin(t * 0.22 + j.sway) * 34;
        const y = (summoned ? H * (0.25 + (j.sway / 6) * 0.5) : yAt(j.d, 2.4)) - ((t * 6 + j.sway * 40) % 120) + Math.cos(j.ph) * 4;
        const hue = j.hue;
        blur((1.2 - j.z) * 2.5);
        ctx.globalAlpha = a * (0.55 + j.z * 0.4);
        ctx.globalCompositeOperation = "lighter";
        const g = ctx.createRadialGradient(x, y, 0, x, y, r * 3.4);
        g.addColorStop(0, `hsla(${hue},95%,70%,0.30)`); g.addColorStop(1, `hsla(${hue},95%,70%,0)`);
        ctx.fillStyle = g; ctx.beginPath(); ctx.arc(x, y, r * 3.4, 0, Math.PI * 2); ctx.fill();
        ctx.lineWidth = 0.8;
        for (let k = 0; k < 12; k++) {
          const tx = x - r * 0.95 + (k / 11) * r * 1.9;
          ctx.strokeStyle = `hsla(${hue},90%,78%,0.28)`;
          ctx.beginPath(); ctx.moveTo(tx, y + r * 0.22);
          const L = r * (3.2 + ((k * 7) % 5) * 0.5);
          for (let s = 1; s <= 14; s++) {
            const yy = y + r * 0.22 + (L * s) / 14;
            ctx.lineTo(tx + Math.sin(t * 1.8 + k * 0.7 + s * 0.45 + j.ph * 0.4) * (s * 1.3), yy);
          }
          ctx.stroke();
        }
        ctx.lineWidth = r * 0.08;
        ctx.lineCap = "round";
        for (let k = 0; k < 4; k++) {
          ctx.strokeStyle = `hsla(${hue},85%,72%,0.32)`;
          const ox = x - r * 0.3 + k * r * 0.2;
          ctx.beginPath(); ctx.moveTo(ox, y + r * 0.1);
          for (let s = 1; s <= 10; s++) ctx.lineTo(ox + Math.sin(t * 1.2 + k * 1.7 + s * 0.8) * (3 + s * 0.8), y + r * 0.1 + s * r * 0.18);
          ctx.stroke();
        }
        const bell = ctx.createRadialGradient(x, y - r * 0.35, r * 0.05, x, y, r * 1.05);
        bell.addColorStop(0, "rgba(255,245,235,0.55)");
        bell.addColorStop(0.45, `hsla(${hue},90%,75%,0.32)`);
        bell.addColorStop(0.85, `hsla(${hue},90%,70%,0.12)`);
        bell.addColorStop(1, `hsla(${hue},90%,80%,0.35)`);
        ctx.fillStyle = bell;
        const top = y - r * (0.95 - pulse * 0.08), rim = y + r * 0.25;
        ctx.beginPath();
        ctx.moveTo(x - r, rim);
        ctx.bezierCurveTo(x - r * 1.06, top, x + r * 1.06, top, x + r, rim);
        for (let s = 0; s < 8; s++) { const x0 = x + r - (s * 2 * r) / 8; ctx.quadraticCurveTo(x0 - r / 8, rim + r * 0.07, x0 - (2 * r) / 8, rim); }
        ctx.fill();
        for (let k = 0; k < 4; k++) {
          const ang = (k / 4) * Math.PI * 2 + 0.6;
          const gx = x + Math.cos(ang) * r * 0.26, gy = y - r * 0.32 + Math.sin(ang) * r * 0.12;
          const gg = ctx.createRadialGradient(gx, gy, 0, gx, gy, r * 0.2);
          gg.addColorStop(0, `hsla(${hue + 15},95%,82%,0.45)`); gg.addColorStop(1, `hsla(${hue + 15},95%,82%,0)`);
          ctx.fillStyle = gg; ctx.beginPath(); ctx.arc(gx, gy, r * 0.2, 0, Math.PI * 2); ctx.fill();
        }
        ctx.strokeStyle = "rgba(255,240,230,0.35)"; ctx.lineWidth = 1;
        ctx.beginPath(); ctx.moveTo(x - r * 0.9, rim - r * 0.25); ctx.bezierCurveTo(x - r * 0.9, top + r * 0.1, x + r * 0.5, top + r * 0.02, x + r * 0.75, top + r * 0.25); ctx.stroke();
      }
      ctx.restore();
      if (hasFilter) ctx.filter = "none";
    }

    function plankton(dt: number) {
      glowFlash = Math.max(0, glowFlash - dt * 0.35);
      const a = Math.max(smooth(0.6, 0.75, Ds), glowFlash);
      if (a <= 0.01) return;
      ctx.save();
      ctx.globalCompositeOperation = "lighter";
      const stir = Math.max(clamp(Math.abs(scrollV) / 30), glowFlash);
      for (const p of plank) {
        p.y -= scrollV * 0.5 * p.z;
        p.x += Math.sin(t * 0.4 + p.ph) * 0.15;
        if (p.y < -10) { p.y = H + 10; p.x = R() * W; }
        if (p.y > H + 10) { p.y = -10; p.x = R() * W; }
        let target = stir * 0.75;
        if (mouse.on) {
          const dx = p.x - mouse.x, dy = p.y - mouse.y, d = Math.sqrt(dx * dx + dy * dy);
          if (d < 160) target = Math.max(target, 1 - d / 160);
        }
        p.glow = target > p.glow ? lerp(p.glow, target, clamp(dt * 10)) : lerp(p.glow, target, clamp(dt * 0.7));
        const tw = 0.25 + 0.25 * Math.sin(t * 1.5 + p.ph * 4);
        const base = (tw * 0.5 + p.glow) * a;
        const rC = lerp(80, 255, p.glow), gC = lerp(205, 196, p.glow), bC = lerp(255, 120, p.glow);
        const rad = p.z * (1.1 + p.glow * 3.2);
        if (p.glow > 0.08) {
          const g = ctx.createRadialGradient(p.x, p.y, 0, p.x, p.y, rad * 5);
          g.addColorStop(0, `rgba(${rC},${gC},${bC},${0.35 * base})`); g.addColorStop(1, "rgba(0,0,0,0)");
          ctx.fillStyle = g; ctx.beginPath(); ctx.arc(p.x, p.y, rad * 5, 0, Math.PI * 2); ctx.fill();
        }
        ctx.fillStyle = `rgba(${rC},${gC},${bC},${Math.min(1, base + 0.1)})`;
        ctx.beginPath(); ctx.arc(p.x, p.y, rad, 0, Math.PI * 2); ctx.fill();
      }
      ctx.restore();
    }

    function angler() {
      const a = smooth(0.86, 0.97, Ds);
      if (a <= 0.01) return;
      const x = W * (small ? 0.6 : 0.74) + Math.sin(t * 0.3) * 30;
      const y = H * 0.38 + Math.cos(t * 0.5) * 16;
      const lx = x + 92 + Math.sin(t * 1.1) * 8, ly = y - 92 + Math.cos(t * 1.3) * 6;
      const flick = 0.82 + 0.18 * Math.sin(t * 7) * Math.sin(t * 2.3);
      ctx.save();
      ctx.globalAlpha = a;
      const body = ctx.createRadialGradient(lx, ly, 10, lx, ly, 220);
      body.addColorStop(0, "#3a2a22"); body.addColorStop(0.5, "#16151c"); body.addColorStop(1, "#07090f");
      ctx.fillStyle = body;
      ctx.beginPath();
      ctx.moveTo(x + 78, y - 8);
      ctx.bezierCurveTo(x + 70, y - 70, x - 20, y - 78, x - 70, y - 34);
      ctx.lineTo(x - 128, y - 54); ctx.quadraticCurveTo(x - 112, y, x - 128, y + 46);
      ctx.lineTo(x - 70, y + 30);
      ctx.bezierCurveTo(x - 20, y + 70, x + 70, y + 60, x + 82, y + 18);
      ctx.lineTo(x + 40, y + 10);
      ctx.closePath(); ctx.fill();
      ctx.strokeStyle = `rgba(255,185,110,${0.35 * flick})`; ctx.lineWidth = 1.4;
      ctx.beginPath(); ctx.moveTo(x - 60, y - 38); ctx.bezierCurveTo(x - 10, y - 74, x + 66, y - 66, x + 78, y - 8); ctx.stroke();
      ctx.fillStyle = `rgba(255,232,205,${0.6 * flick})`;
      for (let i = 0; i < 7; i++) {
        ctx.beginPath(); ctx.moveTo(x + 76 - i * 6, y - 6); ctx.lineTo(x + 74 - i * 6, y + 8 + (i % 2) * 4); ctx.lineTo(x + 71 - i * 6, y - 6); ctx.fill();
        ctx.beginPath(); ctx.moveTo(x + 78 - i * 6, y + 16); ctx.lineTo(x + 75 - i * 6, y + 4 - (i % 2) * 3); ctx.lineTo(x + 72 - i * 6, y + 16); ctx.fill();
      }
      ctx.fillStyle = `rgba(255,220,170,${0.7 * flick})`;
      ctx.beginPath(); ctx.arc(x + 36, y - 30, 3, 0, Math.PI * 2); ctx.fill();
      ctx.strokeStyle = `rgba(255,200,140,${0.45 * flick})`; ctx.lineWidth = 1.6;
      ctx.beginPath(); ctx.moveTo(x + 22, y - 62); ctx.quadraticCurveTo(x + 60, y - 136, lx, ly); ctx.stroke();
      ctx.globalCompositeOperation = "lighter";
      const g = ctx.createRadialGradient(lx, ly, 0, lx, ly, 190);
      g.addColorStop(0, `rgba(255,228,165,${0.95 * flick})`);
      g.addColorStop(0.06, `rgba(255,190,110,${0.55 * flick})`);
      g.addColorStop(0.3, `rgba(255,150,70,${0.12 * flick})`);
      g.addColorStop(1, "rgba(255,140,60,0)");
      ctx.fillStyle = g; ctx.beginPath(); ctx.arc(lx, ly, 190, 0, Math.PI * 2); ctx.fill();
      ctx.restore();
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
      const sy = window.scrollY;
      scrollV = lerp(scrollV, sy - lastScroll, 0.35);
      lastScroll = sy;
      Ds = lerp(Ds, D, reduce ? 1 : clamp(dt * 6));

      const [top, bot] = bgAt(Ds);
      if (water) water.render({ time: t, depth: Ds, top, bot, mouse: [mouse.x / W, mouse.y / H] });

      ctx.clearRect(0, 0, W, H);
      if (!water) flatWater();
      marineSnow(dt);
      manta();
      whales();
      school(dt);
      bubbleLayer(dt);
      jellyfish(dt);
      plankton(dt);
      squids(dt);
      angler();
      hud();
      raf = requestAnimationFrame(frame);
    }

    const onMove = (e: PointerEvent) => { mouse.x = e.clientX; mouse.y = e.clientY; mouse.on = true; };
    const onLeave = () => { mouse.on = false; };
    const onVis = () => { cancelAnimationFrame(raf); if (!document.hidden) { last = performance.now(); raf = requestAnimationFrame(frame); } };
    const onOcean = (e: Event) => {
      const k = (e as CustomEvent<string>).detail;
      if (k === "whale") summon = t;
      if (k === "bubbles") burst();
      if (k === "glow") glowFlash = 1;
      if (k === "jelly") jellyBoost = 1;
      if (k === "squid") squidBoost = 1;
    };

    resize();
    Ds = D = clamp(window.scrollY / Math.max(1, document.documentElement.scrollHeight - window.innerHeight));
    const anchorTimer = setInterval(anchor, 1500);
    window.addEventListener("resize", resize);
    window.addEventListener("pointermove", onMove, { passive: true });
    window.addEventListener("pointerdown", onMove, { passive: true });
    window.addEventListener("ocean", onOcean);
    document.addEventListener("pointerleave", onLeave);
    document.addEventListener("visibilitychange", onVis);
    raf = requestAnimationFrame(frame);
    return () => {
      cancelAnimationFrame(raf);
      clearInterval(anchorTimer);
      water?.destroy();
      window.removeEventListener("resize", resize);
      window.removeEventListener("pointermove", onMove);
      window.removeEventListener("pointerdown", onMove);
      window.removeEventListener("ocean", onOcean);
      document.removeEventListener("pointerleave", onLeave);
      document.removeEventListener("visibilitychange", onVis);
    };
  }, []);

  return (
    <>
      <canvas ref={waterRef} className="ocean water" aria-hidden />
      <canvas ref={lifeRef} className="ocean" aria-hidden />
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
