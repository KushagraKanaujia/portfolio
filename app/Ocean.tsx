"use client";

import { useEffect, useRef } from "react";

/*
  The whole page is a dive. Scroll progress = depth.
  0.00  sunlight zone : light rays, caustics, warm sun
  0.15  fish school    : a silver school that swims around (and away from your cursor)
  0.40  whale          : a humpback slowly crossing
  0.55  jellyfish      : warm glowing jellies drifting
  0.75  midnight zone  : bioluminescent plankton that light up near your cursor or when you scroll fast
  0.92  the abyss      : an anglerfish lure in the dark
*/

const MAX_DEPTH = 4000; // meters, for the depth gauge
const ZONES: [number, string][] = [
  [0, "Sunlight zone"],
  [0.25, "Twilight zone"],
  [0.62, "Midnight zone"],
  [0.88, "The abyss"],
];

type RGB = [number, number, number];
const BG: [number, RGB, RGB][] = [
  [0.0, [52, 150, 190], [10, 70, 110]],
  [0.25, [12, 74, 116], [5, 40, 72]],
  [0.55, [5, 34, 62], [3, 18, 38]],
  [0.8, [3, 16, 34], [2, 9, 22]],
  [1.0, [2, 8, 18], [1, 4, 10]],
];

const clamp = (v: number, a = 0, b = 1) => Math.max(a, Math.min(b, v));
const lerp = (a: number, b: number, t: number) => a + (b - a) * t;
const smooth = (e0: number, e1: number, x: number) => { const t = clamp((x - e0) / (e1 - e0)); return t * t * (3 - 2 * t); };
/** 0 outside [a,d], ramps up a→b, holds b→c, ramps down c→d */
const band = (x: number, a: number, b: number, c: number, d: number) => smooth(a, b, x) * (1 - smooth(c, d, x));
const rgb = (c: RGB, a = 1) => `rgba(${c[0] | 0},${c[1] | 0},${c[2] | 0},${a})`;

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
  const ref = useRef<HTMLCanvasElement>(null);
  const depthRef = useRef<HTMLSpanElement>(null);
  const zoneRef = useRef<HTMLSpanElement>(null);
  const markRef = useRef<HTMLSpanElement>(null);

  useEffect(() => {
    const canvas = ref.current!;
    const ctx = canvas.getContext("2d", { alpha: false })!;
    const reduce = window.matchMedia("(prefers-reduced-motion: reduce)").matches;
    let W = 0, H = 0, dpr = 1, small = false;
    let raf = 0, t = 0, last = performance.now();
    let D = 0, Dsmooth = 0, scrollV = 0, lastScroll = window.scrollY;
    const mouse = { x: -9999, y: -9999, on: false };
    const R = Math.random;

    // ---------- populations ----------
    type Snow = { x: number; y: number; z: number; s: number };
    type Bubble = { x: number; y: number; r: number; v: number; ph: number };
    type Fish = { ox: number; oy: number; ph: number; sp: number; px: number; py: number; ax: number; ay: number };
    type Jelly = { x: number; d: number; r: number; ph: number; hue: number; sway: number };
    type Plank = { x: number; y: number; z: number; ph: number; glow: number };
    let snow: Snow[] = [], bubbles: Bubble[] = [], fish: Fish[] = [], jellies: Jelly[] = [], plank: Plank[] = [];

    function populate() {
      const k = small ? 0.5 : 1;
      snow = Array.from({ length: Math.round(170 * k) }, () => ({ x: R() * W, y: R() * H, z: 0.3 + R() * 0.9, s: R() }));
      bubbles = Array.from({ length: Math.round(28 * k) }, () => ({ x: R() * W, y: R() * H, r: 1.5 + R() * 4, v: 20 + R() * 40, ph: R() * 6 }));
      fish = Array.from({ length: Math.round(110 * k) }, () => {
        const a = R() * Math.PI * 2, rr = Math.sqrt(R());
        return { ox: Math.cos(a) * rr * 170, oy: Math.sin(a) * rr * 70, ph: R() * 6, sp: 0.8 + R() * 0.4, px: 0, py: 0, ax: 0, ay: 0 };
      });
      const hues = [24, 345, 32, 200, 12, 330, 40];
      jellies = Array.from({ length: small ? 4 : 7 }, (_, i) => ({
        x: (0.12 + (i / (small ? 3 : 6)) * 0.76) * W + (R() - 0.5) * 60,
        d: 0.5 + R() * 0.32, r: (small ? 22 : 30) + R() * 26, ph: R() * 6, hue: hues[i % hues.length], sway: R() * 6,
      }));
      plank = Array.from({ length: Math.round(260 * k) }, () => ({ x: R() * W, y: R() * H, z: 0.4 + R() * 0.8, ph: R() * 6, glow: 0 }));
    }

    function resize() {
      dpr = Math.min(window.devicePixelRatio || 1, 1.75);
      W = window.innerWidth; H = window.innerHeight; small = W < 700;
      canvas.width = Math.round(W * dpr); canvas.height = Math.round(H * dpr);
      canvas.style.width = W + "px"; canvas.style.height = H + "px";
      ctx.setTransform(dpr, 0, 0, dpr, 0, 0);
      populate();
      anchor();
    }

    // screen y of something living at depth d (it passes through the viewport as you scroll by it)
    const yAt = (d: number, span = 3.2) => H * 0.5 + (d - Dsmooth) * H * span;

    // ---------- drawing ----------
    function background() {
      const [top, bot] = bgAt(Dsmooth);
      const g = ctx.createLinearGradient(0, 0, 0, H);
      g.addColorStop(0, rgb(top)); g.addColorStop(1, rgb(bot));
      ctx.fillStyle = g; ctx.fillRect(0, 0, W, H);
    }

    function sunlight() {
      const a = 1 - smooth(0, 0.32, Dsmooth);
      if (a <= 0) return;
      ctx.save();
      ctx.globalCompositeOperation = "lighter";
      // warm sun bloom at the surface
      const sy = -H * 0.15 - Dsmooth * H * 2.4; // the surface, just above the top of the screen
      const sg = ctx.createRadialGradient(W * 0.62, sy, 0, W * 0.62, sy, Math.max(W, H) * 0.7);
      sg.addColorStop(0, `rgba(255,214,160,${0.5 * a})`);
      sg.addColorStop(0.35, `rgba(255,170,120,${0.14 * a})`);
      sg.addColorStop(1, "rgba(0,0,0,0)");
      ctx.fillStyle = sg; ctx.fillRect(0, 0, W, H);
      // god rays
      for (let i = 0; i < 9; i++) {
        const base = W * (i / 8) + Math.sin(t * 0.18 + i * 1.7) * 60;
        const wTop = 30 + (i % 3) * 26, wBot = wTop * 5;
        const len = H * (0.9 + (i % 4) * 0.25);
        const skew = 160 + Math.sin(t * 0.1 + i) * 40;
        const g = ctx.createLinearGradient(0, sy, 0, sy + len);
        const op = (0.07 + 0.05 * Math.sin(t * 0.6 + i * 2.3)) * a;
        g.addColorStop(0, `rgba(255,236,200,${op})`);
        g.addColorStop(1, "rgba(160,220,255,0)");
        ctx.fillStyle = g;
        ctx.beginPath();
        ctx.moveTo(base - wTop, sy); ctx.lineTo(base + wTop, sy);
        ctx.lineTo(base + skew + wBot, sy + len); ctx.lineTo(base + skew - wBot, sy + len);
        ctx.closePath(); ctx.fill();
      }
      // dappled light near the surface: soft drifting blobs, no outlines
      for (let i = 0; i < 26; i++) {
        const x = ((i * 157.3) % (W + 200)) - 100 + Math.sin(t * 0.35 + i) * 40;
        const y = sy + 40 + ((i * 61.7) % (H * 0.55)) + Math.cos(t * 0.3 + i * 1.3) * 20;
        const r = 40 + (i % 5) * 18;
        const op = (0.035 + 0.03 * Math.sin(t * 0.9 + i * 2.1)) * a;
        const cg = ctx.createRadialGradient(x, y, 0, x, y, r);
        cg.addColorStop(0, `rgba(255,240,215,${op})`); cg.addColorStop(1, "rgba(255,240,215,0)");
        ctx.fillStyle = cg; ctx.beginPath(); ctx.ellipse(x, y, r * 1.8, r * 0.6, 0, 0, Math.PI * 2); ctx.fill();
      }
      ctx.restore();
    }

    function marineSnow(dt: number) {
      const a = 0.25 + 0.55 * smooth(0.1, 0.6, Dsmooth);
      ctx.fillStyle = `rgba(210,230,245,${a})`;
      for (const p of snow) {
        p.y += (6 + p.z * 8) * dt - scrollV * 0.25 * p.z;
        p.x += Math.sin(t * 0.3 + p.s * 10) * 0.1;
        if (p.y > H + 5) { p.y = -5; p.x = R() * W; }
        if (p.y < -5) { p.y = H + 5; p.x = R() * W; }
        ctx.globalAlpha = 0.35 + p.s * 0.5;
        ctx.fillRect(p.x, p.y, p.z * 1.6, p.z * 1.6);
      }
      ctx.globalAlpha = 1;
    }

    function bubbleLayer(dt: number) {
      const a = 1 - smooth(0.3, 0.7, Dsmooth);
      if (a <= 0) return;
      ctx.lineWidth = 1;
      for (const b of bubbles) {
        b.y -= b.v * dt + scrollV * 0.15;
        b.ph += dt * 2;
        if (b.y < -10) { b.y = H + 10; b.x = R() * W; }
        if (b.y > H + 10) { b.y = -10; }
        const x = b.x + Math.sin(b.ph) * 6;
        ctx.strokeStyle = `rgba(220,245,255,${0.35 * a})`;
        ctx.beginPath(); ctx.arc(x, b.y, b.r, 0, Math.PI * 2); ctx.stroke();
        ctx.fillStyle = `rgba(255,255,255,${0.35 * a})`;
        ctx.beginPath(); ctx.arc(x - b.r * 0.35, b.y - b.r * 0.35, b.r * 0.25, 0, Math.PI * 2); ctx.fill();
      }
    }

    function school(dt: number) {
      const a = band(Dsmooth, 0.04, 0.14, 0.38, 0.5);
      if (a <= 0.01) return;
      const cy = yAt(0.26, 2.6);
      // the leader swims a slow figure eight
      const lx = W * 0.5 + Math.sin(t * 0.16) * W * 0.32;
      const ly = cy + Math.sin(t * 0.32) * H * 0.12;
      const dirX = Math.cos(t * 0.16) * 0.16 * W * 0.32;
      const dirY = Math.cos(t * 0.32) * 0.32 * H * 0.12;
      const ang = Math.atan2(dirY, dirX);
      const len = small ? 7 : 9;
      for (const f of fish) {
        const wob = Math.sin(t * 1.3 * f.sp + f.ph);
        let tx = lx + f.ox * Math.cos(ang) - f.oy * Math.sin(ang) + wob * 10;
        let ty = ly + f.ox * Math.sin(ang) + f.oy * Math.cos(ang) + Math.cos(t * f.sp + f.ph) * 8;
        // scatter from the cursor
        if (mouse.on) {
          const dx = tx - mouse.x, dy = ty - mouse.y, d2 = dx * dx + dy * dy;
          if (d2 < 160 * 160) { const k = (1 - Math.sqrt(d2) / 160) * 90; const d = Math.sqrt(d2) || 1; f.ax += (dx / d) * k * dt * 8; f.ay += (dy / d) * k * dt * 8; }
        }
        f.ax *= 0.93; f.ay *= 0.93;
        tx += f.ax; ty += f.ay;
        if (f.px === 0) { f.px = tx; f.py = ty; }
        const vx = tx - f.px, vy = ty - f.py;
        f.px = lerp(f.px, tx, clamp(dt * 3)); f.py = lerp(f.py, ty, clamp(dt * 3));
        const fa = Math.abs(vx) + Math.abs(vy) > 0.3 ? Math.atan2(vy, vx) : ang;
        ctx.save();
        ctx.translate(f.px, f.py); ctx.rotate(fa);
        const glint = 0.5 + 0.5 * Math.sin(t * 3 + f.ph * 3);
        ctx.fillStyle = `rgba(${lerp(150, 235, glint)},${lerp(190, 240, glint)},${lerp(215, 250, glint)},${0.75 * a})`;
        ctx.beginPath();
        ctx.ellipse(0, 0, len, len * 0.32, 0, 0, Math.PI * 2);
        ctx.moveTo(-len * 0.8, 0);
        const tail = Math.sin(t * 9 * f.sp + f.ph) * len * 0.25;
        ctx.lineTo(-len * 1.5, -len * 0.38 + tail); ctx.lineTo(-len * 1.5, len * 0.38 + tail);
        ctx.closePath(); ctx.fill();
        ctx.restore();
      }
    }

    let whaleD = 0.58;
    function anchor() {
      const el = document.getElementById("whale-spot");
      const max = Math.max(1, document.documentElement.scrollHeight - window.innerHeight);
      if (el) { const r = el.getBoundingClientRect(); whaleD = clamp((r.top + window.scrollY + r.height / 2 - window.innerHeight / 2) / max); }
    }
    const whaleBand = () => band(Dsmooth, whaleD - 0.13, whaleD - 0.07, whaleD + 0.07, whaleD + 0.13);

    function whale() {
      const a = whaleBand();
      if (a <= 0.01) return;
      const s = small ? 0.5 : Math.min(1.15, W / 1250);
      // swims left to right as you scroll past it, with a little drift of its own
      const prog = clamp((Dsmooth - (whaleD - 0.13)) / 0.26);
      const x = lerp(-480 * s, W + 480 * s, prog) + Math.sin(t * 0.3) * 20;
      const y = H * 0.5 + Math.sin(t * 0.4) * 14 + (0.5 - prog) * H * 0.25;
      const sw = Math.sin(t * 0.9);
      ctx.save();
      ctx.translate(x, y); ctx.scale(s, s); ctx.rotate(Math.sin(t * 0.4) * 0.03);
      const [top] = bgAt(Dsmooth);
      const body = ctx.createLinearGradient(0, -80, 0, 80);
      body.addColorStop(0, `rgba(${top[0] * 0.45},${top[1] * 0.55},${top[2] * 0.7},${0.95 * a})`);
      body.addColorStop(1, `rgba(${top[0] * 0.25},${top[1] * 0.3},${top[2] * 0.45},${0.95 * a})`);
      ctx.fillStyle = body;
      ctx.beginPath();
      // head at +x, tail at -x
      ctx.moveTo(300, 0);
      ctx.bezierCurveTo(300, -60, 180, -82, 40, -78);
      ctx.bezierCurveTo(-120, -72, -250, -40, -350, -8 + sw * 6);
      ctx.lineTo(-420, -48 + sw * 22);
      ctx.bezierCurveTo(-440, -20 + sw * 18, -430, 0 + sw * 14, -420, 6 + sw * 14);
      ctx.bezierCurveTo(-430, 14 + sw * 14, -440, 34 + sw * 14, -424, 60 + sw * 10);
      ctx.lineTo(-350, 12 + sw * 6);
      ctx.bezierCurveTo(-240, 50, -100, 78, 40, 72);
      ctx.bezierCurveTo(180, 66, 300, 50, 300, 0);
      ctx.fill();
      // long pectoral fin, humpback style
      ctx.beginPath();
      ctx.moveTo(110, 40);
      ctx.bezierCurveTo(70, 120 + sw * 10, 20, 170 + sw * 14, -30, 180 + sw * 14);
      ctx.bezierCurveTo(10, 140, 50, 90, 60, 50);
      ctx.fill();
      // belly grooves and rim light from above
      ctx.globalCompositeOperation = "lighter";
      ctx.strokeStyle = `rgba(180,225,255,${0.12 * a})`;
      ctx.lineWidth = 2;
      ctx.beginPath(); ctx.moveTo(280, -30); ctx.bezierCurveTo(180, -80, -120, -74, -340, -10); ctx.stroke();
      ctx.strokeStyle = `rgba(180,225,255,${0.06 * a})`;
      for (let i = 0; i < 5; i++) { ctx.beginPath(); ctx.moveTo(270 - i * 8, 18 + i * 7); ctx.bezierCurveTo(200, 40 + i * 7, 120, 50 + i * 6, 40, 50 + i * 5); ctx.stroke(); }
      ctx.fillStyle = `rgba(200,235,255,${0.25 * a})`;
      ctx.beginPath(); ctx.arc(220, 6, 3.5, 0, Math.PI * 2); ctx.fill();
      ctx.restore();
    }

    function jellyfish(dt: number) {
      const a = band(Dsmooth, 0.42, 0.55, 0.82, 0.92) * (1 - 0.75 * whaleBand());
      if (a <= 0.01) return;
      ctx.save();
      ctx.globalCompositeOperation = "lighter";
      for (const j of jellies) {
        j.ph += dt * 1.4;
        const pulse = Math.sin(j.ph);
        const r = j.r * (1 + pulse * 0.08);
        const x = j.x + Math.sin(t * 0.25 + j.sway) * 30;
        const y = yAt(j.d, 2.4) - ((t * 6 + j.sway * 40) % 120) + Math.cos(j.ph) * 4;
        const warm = `hsla(${j.hue},95%,72%,`;
        // glow
        const g = ctx.createRadialGradient(x, y, 0, x, y, r * 3.2);
        g.addColorStop(0, `${warm}${0.35 * a})`); g.addColorStop(1, `${warm}0)`);
        ctx.fillStyle = g; ctx.beginPath(); ctx.arc(x, y, r * 3.2, 0, Math.PI * 2); ctx.fill();
        // tentacles
        ctx.lineWidth = 1.2;
        for (let k = 0; k < 7; k++) {
          const tx = x - r * 0.8 + (k / 6) * r * 1.6;
          ctx.strokeStyle = `${warm}${0.35 * a})`;
          ctx.beginPath(); ctx.moveTo(tx, y + r * 0.2);
          const L = r * (2.6 + (k % 3) * 0.6);
          for (let s = 1; s <= 10; s++) {
            const yy = y + r * 0.2 + (L * s) / 10;
            ctx.lineTo(tx + Math.sin(t * 2 + k + s * 0.5 + j.ph * 0.5) * (s * 1.4), yy);
          }
          ctx.stroke();
        }
        // bell
        const bg = ctx.createRadialGradient(x, y - r * 0.3, r * 0.1, x, y, r);
        bg.addColorStop(0, `rgba(255,240,225,${0.55 * a})`);
        bg.addColorStop(0.6, `${warm}${0.35 * a})`);
        bg.addColorStop(1, `${warm}${0.08 * a})`);
        ctx.fillStyle = bg;
        ctx.beginPath();
        ctx.moveTo(x - r, y + r * 0.25);
        ctx.bezierCurveTo(x - r * 1.05, y - r * (0.95 - pulse * 0.08), x + r * 1.05, y - r * (0.95 - pulse * 0.08), x + r, y + r * 0.25);
        ctx.quadraticCurveTo(x, y + r * (0.05 + pulse * 0.1), x - r, y + r * 0.25);
        ctx.fill();
      }
      ctx.restore();
    }

    function plankton(dt: number) {
      const a = smooth(0.6, 0.75, Dsmooth);
      if (a <= 0.01) return;
      ctx.save();
      ctx.globalCompositeOperation = "lighter";
      const stir = clamp(Math.abs(scrollV) / 30);
      for (const p of plank) {
        p.y -= scrollV * 0.5 * p.z;
        p.x += Math.sin(t * 0.4 + p.ph) * 0.15;
        if (p.y < -10) { p.y = H + 10; p.x = R() * W; }
        if (p.y > H + 10) { p.y = -10; p.x = R() * W; }
        let target = stir * 0.7;
        if (mouse.on) {
          const dx = p.x - mouse.x, dy = p.y - mouse.y, d = Math.sqrt(dx * dx + dy * dy);
          if (d < 150) target = Math.max(target, 1 - d / 150);
        }
        p.glow = target > p.glow ? lerp(p.glow, target, clamp(dt * 10)) : lerp(p.glow, target, clamp(dt * 0.8));
        const tw = 0.25 + 0.25 * Math.sin(t * 1.5 + p.ph * 4);
        const base = (tw * 0.5 + p.glow) * a;
        // cool blue at rest, warm gold when disturbed
        const rC = lerp(90, 255, p.glow), gC = lerp(200, 196, p.glow), bC = lerp(255, 120, p.glow);
        const rad = p.z * (1.2 + p.glow * 3.5);
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
      const a = smooth(0.86, 0.97, Dsmooth);
      if (a <= 0.01) return;
      const x = W * (small ? 0.62 : 0.74) + Math.sin(t * 0.3) * 30;
      const y = H * 0.42 + Math.cos(t * 0.5) * 16;
      const lx = x + 70 + Math.sin(t * 1.1) * 8, ly = y - 78 + Math.cos(t * 1.3) * 6;
      const flick = 0.85 + 0.15 * Math.sin(t * 7) * Math.sin(t * 2.3);
      ctx.save();
      // faint body lit by its own lure
      ctx.fillStyle = `rgba(14,22,36,${0.95 * a})`;
      ctx.strokeStyle = `rgba(255,190,120,${0.18 * a})`;
      ctx.lineWidth = 1.5;
      ctx.beginPath();
      ctx.moveTo(x + 60, y);
      ctx.bezierCurveTo(x + 60, y - 50, x - 10, y - 62, x - 60, y - 30);
      ctx.lineTo(x - 110, y - 46); ctx.lineTo(x - 98, y); ctx.lineTo(x - 110, y + 40);
      ctx.lineTo(x - 60, y + 26);
      ctx.bezierCurveTo(x - 10, y + 56, x + 60, y + 44, x + 60, y + 10);
      ctx.closePath(); ctx.fill(); ctx.stroke();
      // teeth
      ctx.fillStyle = `rgba(255,230,200,${0.4 * a})`;
      for (let i = 0; i < 5; i++) { ctx.beginPath(); ctx.moveTo(x + 58 - i * 7, y + 2); ctx.lineTo(x + 55 - i * 7, y + 12); ctx.lineTo(x + 52 - i * 7, y + 2); ctx.fill(); }
      // stalk
      ctx.strokeStyle = `rgba(255,200,140,${0.35 * a})`;
      ctx.beginPath(); ctx.moveTo(x + 10, y - 50); ctx.quadraticCurveTo(x + 40, y - 110, lx, ly); ctx.stroke();
      // lure
      ctx.globalCompositeOperation = "lighter";
      const g = ctx.createRadialGradient(lx, ly, 0, lx, ly, 160);
      g.addColorStop(0, `rgba(255,220,150,${0.9 * a * flick})`);
      g.addColorStop(0.08, `rgba(255,180,100,${0.5 * a * flick})`);
      g.addColorStop(1, "rgba(255,140,60,0)");
      ctx.fillStyle = g; ctx.beginPath(); ctx.arc(lx, ly, 160, 0, Math.PI * 2); ctx.fill();
      ctx.restore();
    }

    function vignette() {
      const g = ctx.createRadialGradient(W / 2, H / 2, Math.min(W, H) * 0.35, W / 2, H / 2, Math.max(W, H) * 0.75);
      g.addColorStop(0, "rgba(0,0,0,0)");
      g.addColorStop(1, `rgba(0,4,12,${0.35 + 0.35 * Dsmooth})`);
      ctx.fillStyle = g; ctx.fillRect(0, 0, W, H);
    }

    function hud() {
      const m = Math.round(Dsmooth * MAX_DEPTH);
      if (depthRef.current) depthRef.current.textContent = m.toLocaleString("en-US");
      let z = ZONES[0][1];
      for (const [d, n] of ZONES) if (Dsmooth >= d) z = n;
      if (zoneRef.current && zoneRef.current.textContent !== z) zoneRef.current.textContent = z;
      if (markRef.current) markRef.current.style.top = `${Dsmooth * 100}%`;
    }

    function readScroll() {
      const max = Math.max(1, document.documentElement.scrollHeight - window.innerHeight);
      D = clamp(window.scrollY / max);
    }

    function frame(now: number) {
      const dt = Math.min(0.05, (now - last) / 1000);
      last = now;
      if (!reduce) t += dt;
      readScroll();
      const sy = window.scrollY;
      scrollV = lerp(scrollV, sy - lastScroll, 0.35);
      lastScroll = sy;
      Dsmooth = lerp(Dsmooth, D, reduce ? 1 : clamp(dt * 6));

      background();
      sunlight();
      marineSnow(dt);
      bubbleLayer(dt);
      whale();
      school(dt);
      jellyfish(dt);
      plankton(dt);
      angler();
      vignette();
      hud();
      raf = requestAnimationFrame(frame);
    }

    const onMove = (e: PointerEvent) => { mouse.x = e.clientX; mouse.y = e.clientY; mouse.on = true; };
    const onLeave = () => { mouse.on = false; };
    const onVis = () => { if (document.hidden) cancelAnimationFrame(raf); else { last = performance.now(); raf = requestAnimationFrame(frame); } };

    resize();
    readScroll(); Dsmooth = D;
    const anchorTimer = setInterval(anchor, 1500);
    window.addEventListener("resize", resize);
    window.addEventListener("pointermove", onMove, { passive: true });
    window.addEventListener("pointerdown", onMove, { passive: true });
    document.addEventListener("pointerleave", onLeave);
    document.addEventListener("visibilitychange", onVis);
    raf = requestAnimationFrame(frame);
    return () => {
      cancelAnimationFrame(raf);
      clearInterval(anchorTimer);
      window.removeEventListener("resize", resize);
      window.removeEventListener("pointermove", onMove);
      window.removeEventListener("pointerdown", onMove);
      document.removeEventListener("pointerleave", onLeave);
      document.removeEventListener("visibilitychange", onVis);
    };
  }, []);

  return (
    <>
      <canvas ref={ref} className="ocean" aria-hidden />
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
