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
    type Bubble = { x: number; y: number; r: number; v: number; ph: number; life: number };
    type Ring = { x: number; y: number; t0: number };
    let snow: Dot[] = [], plank: Dot[] = [], bubbles: Bubble[] = [];
    const rings: Ring[] = [];
    let streams: { x: number; acc: number }[] = [];
    const burst = (x: number, y: number, n = 26) => { for (let i = 0; i < n; i++) bubbles.push({ x: x + (R() - 0.5) * 40, y: y + R() * 30, r: 1 + Math.pow(R(), 1.5) * 6, v: 60 + R() * 160, ph: R() * 6, life: 3 + R() * 2 }); };

    function populate() {
      const k = small ? 0.5 : 1;
      snow = Array.from({ length: Math.round(150 * k) }, () => ({ x: R() * W, y: R() * H, z: 0.3 + R() * 0.9, s: R(), glow: 0 }));
      plank = Array.from({ length: Math.round(240 * k) }, () => ({ x: R() * W, y: R() * H, z: 0.4 + R() * 0.8, s: R() * 6, glow: 0 }));
      bubbles = Array.from({ length: Math.round(46 * k) }, () => ({ x: R() * W, y: R() * H, r: 1.2 + Math.pow(R(), 2) * 7, v: 18 + R() * 46, ph: R() * 6, life: -1 }));
      streams = Array.from({ length: small ? 2 : 4 }, () => ({ x: (0.1 + R() * 0.8) * W, acc: 0 }));
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
      // bubbles: ambient ones near the surface, little streams rising, and bursts you make
      const ba = 1 - smooth(0.14, 0.34, Ds);
      if (ba > 0.01) for (const st of streams) {
        st.acc += dt;
        if (st.acc > 0.35) { st.acc = 0; bubbles.push({ x: st.x + (R() - 0.5) * 10, y: H + 10, r: 1 + R() * 3, v: 70 + R() * 50, ph: R() * 6, life: 12 }); }
        st.x += Math.sin(t * 0.2 + st.acc) * 0.05;
      }
      for (let i = bubbles.length - 1; i >= 0; i--) {
        const b = bubbles[i];
        b.y -= b.v * dt; b.ph += dt * (2 + 4 / (b.r + 1));
        if (b.life >= 0) { b.life -= dt; if (b.life <= 0 || b.y < -20) { bubbles.splice(i, 1); continue; } }
        else if (b.y < -10) { b.y = H + 10; b.x = R() * W; }
        const al = b.life >= 0 ? Math.min(1, b.life) * Math.max(ba, 0.6) : ba;
        if (al <= 0.01) continue;
        const x = b.x + Math.sin(b.ph) * (1.5 + b.r * 0.6);
        const g = ctx.createRadialGradient(x - b.r * 0.3, b.y - b.r * 0.3, b.r * 0.1, x, b.y, b.r);
        g.addColorStop(0, `rgba(255,255,255,${0.10 * al})`); g.addColorStop(0.75, `rgba(190,235,255,${0.10 * al})`); g.addColorStop(1, `rgba(235,250,255,${0.6 * al})`);
        ctx.fillStyle = g; ctx.beginPath(); ctx.arc(x, b.y, b.r, 0, Math.PI * 2); ctx.fill();
        ctx.fillStyle = `rgba(255,255,255,${0.8 * al})`;
        ctx.beginPath(); ctx.ellipse(x - b.r * 0.36, b.y - b.r * 0.4, b.r * 0.26, b.r * 0.16, -0.6, 0, Math.PI * 2); ctx.fill();
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


    // ---------- the abyss: an empty seafloor with a few glowing things ----------
    const glowLine = (color: string, blur: number, width = 1.2) => { ctx.strokeStyle = color; ctx.shadowColor = color; ctx.shadowBlur = blur; ctx.lineWidth = width; };
    function abyss() {
      const a = smooth(0.7, 0.86, Ds);
      if (a <= 0.01) return;
      const rise = smooth(0.84, 1, Ds);
      const floor = H * (1.08 - rise * 0.3);           // the seafloor rises into view at the very end
      ctx.save();
      ctx.globalAlpha = a;
      ctx.globalCompositeOperation = "lighter";

      // a siphonophore: a long chain of glowing beads, drifting on its own
      const sx = W * 0.12 + Math.sin(t * 0.07) * W * 0.05, sy = H * 0.18 + Math.sin(t * 0.11) * 30;
      for (let i = 0; i < 34; i++) {
        const u = i / 33;
        const x = sx + u * W * 0.32 + Math.sin(t * 0.8 - u * 6) * 18;
        const y = sy + u * H * 0.2 + Math.cos(t * 0.6 - u * 5) * 14;
        const tw = 0.5 + 0.5 * Math.sin(t * 3 - i * 0.5);
        const rr = 1.4 + (i % 4 === 0 ? 1.4 : 0) + tw;
        const g = ctx.createRadialGradient(x, y, 0, x, y, rr * 6);
        g.addColorStop(0, `rgba(150,220,255,${0.35 * tw})`); g.addColorStop(1, "rgba(150,220,255,0)");
        ctx.fillStyle = g; ctx.beginPath(); ctx.arc(x, y, rr * 6, 0, Math.PI * 2); ctx.fill();
        ctx.fillStyle = `rgba(200,240,255,${0.5 + 0.5 * tw})`; ctx.beginPath(); ctx.arc(x, y, rr * 0.6, 0, Math.PI * 2); ctx.fill();
      }

      // line-art jellies drifting up on their own
      for (let k = 0; k < 3; k++) {
        const jx = W * (0.68 + k * 0.1) + Math.sin(t * 0.13 + k * 2) * 40;
        const jy = H * (0.75 - ((t * 0.012 + k * 0.33) % 1) * 0.7);
        const r = 16 + k * 7, pulse = Math.sin(t * 1.6 + k * 2);
        const hue = [24, 330, 190][k];
        glowLine(`hsla(${hue},95%,72%,0.65)`, 14);
        ctx.beginPath();
        ctx.moveTo(jx - r, jy);
        ctx.bezierCurveTo(jx - r * 1.05, jy - r * (1.05 - pulse * 0.1), jx + r * 1.05, jy - r * (1.05 - pulse * 0.1), jx + r, jy);
        ctx.quadraticCurveTo(jx, jy - r * 0.15 + pulse * 2, jx - r, jy);
        ctx.stroke();
        ctx.lineWidth = 0.7;
        for (let i = 0; i < 6; i++) {
          const tx = jx - r * 0.75 + (i / 5) * r * 1.5;
          ctx.beginPath(); ctx.moveTo(tx, jy);
          for (let s2 = 1; s2 <= 8; s2++) ctx.lineTo(tx + Math.sin(t * 1.5 + i + s2 * 0.6) * s2 * 0.9, jy + s2 * r * 0.32);
          ctx.stroke();
        }
      }

      // an anglerfish lure hanging in the dark (you only ever see the light)
      const lx = W * 0.58 + Math.sin(t * 0.3) * 24, ly = Math.min(floor - 140, H * 0.5) + Math.cos(t * 0.45) * 14;
      const flick = 0.75 + 0.25 * Math.sin(t * 6) * Math.sin(t * 1.7);
      const lg = ctx.createRadialGradient(lx, ly, 0, lx, ly, 120);
      lg.addColorStop(0, `rgba(255,225,165,${0.9 * flick})`); lg.addColorStop(0.07, `rgba(255,185,110,${0.45 * flick})`); lg.addColorStop(1, "rgba(255,150,70,0)");
      ctx.fillStyle = lg; ctx.beginPath(); ctx.arc(lx, ly, 120, 0, Math.PI * 2); ctx.fill();
      glowLine(`rgba(255,190,120,${0.25 * flick})`, 6, 1);
      ctx.beginPath(); ctx.moveTo(lx, ly + 4); ctx.quadraticCurveTo(lx - 30, ly + 30, lx - 70, ly + 44); ctx.stroke();

      ctx.restore();
      if (rise <= 0.01) return;

      // ---- the seafloor ----
      ctx.save();
      ctx.globalAlpha = a * rise;
      // dunes
      const dune = (yOff: number, amp: number, fill: string) => {
        ctx.beginPath(); ctx.moveTo(0, H);
        for (let x = 0; x <= W + 20; x += 20) ctx.lineTo(x, floor + yOff + Math.sin(x * 0.004 + yOff) * amp + Math.sin(x * 0.011) * amp * 0.4);
        ctx.lineTo(W, H); ctx.closePath(); ctx.fillStyle = fill; ctx.fill();
      };
      dune(-24, 18, "rgba(4,12,22,0.9)");
      dune(0, 12, "rgba(2,7,14,1)");
      ctx.globalCompositeOperation = "lighter";
      glowLine("rgba(120,190,230,0.18)", 8, 1);
      ctx.beginPath();
      for (let x = 0; x <= W + 20; x += 20) { const y = floor + Math.sin(x * 0.004) * 12 + Math.sin(x * 0.011) * 4.8; x ? ctx.lineTo(x, y) : ctx.moveTo(x, y); }
      ctx.stroke();

      // shipwreck, half sunk, its portholes still glowing
      const wx = W * 0.16, wy = floor - 6;
      ctx.save(); ctx.translate(wx, wy); ctx.rotate(-0.12);
      glowLine("rgba(140,205,235,0.4)", 10, 1.3);
      ctx.beginPath();
      ctx.moveTo(-150, -10); ctx.lineTo(-120, -62); ctx.lineTo(120, -62); ctx.quadraticCurveTo(170, -60, 190, -20); ctx.lineTo(160, 10);
      ctx.moveTo(-40, -62); ctx.lineTo(-40, -150); ctx.moveTo(-40, -130); ctx.lineTo(10, -112);   // broken mast
      ctx.moveTo(30, -62); ctx.lineTo(30, -96); ctx.lineTo(80, -96); ctx.lineTo(80, -62);         // cabin
      ctx.stroke();
      for (let i = 0; i < 5; i++) {
        const px = -80 + i * 38, py = -38, on = 0.5 + 0.5 * Math.sin(t * 0.7 + i * 1.9);
        const g = ctx.createRadialGradient(px, py, 0, px, py, 14);
        g.addColorStop(0, `rgba(255,200,130,${0.55 * on})`); g.addColorStop(1, "rgba(255,200,130,0)");
        ctx.fillStyle = g; ctx.beginPath(); ctx.arc(px, py, 14, 0, Math.PI * 2); ctx.fill();
        ctx.strokeStyle = `rgba(255,210,150,${0.4 + 0.4 * on})`; ctx.shadowBlur = 6; ctx.beginPath(); ctx.arc(px, py, 4.5, 0, Math.PI * 2); ctx.stroke();
      }
      ctx.restore();

      // a sunken server rack, LEDs still blinking (some things never go down)
      const rx = W * 0.42, ry = floor - 2;
      ctx.save(); ctx.translate(rx, ry); ctx.rotate(0.08);
      glowLine("rgba(140,205,235,0.35)", 8, 1.2);
      ctx.strokeRect(-34, -118, 68, 118);
      for (let u = 0; u < 7; u++) {
        ctx.strokeStyle = "rgba(140,205,235,0.18)"; ctx.shadowBlur = 0;
        ctx.strokeRect(-28, -110 + u * 16, 56, 12);
        for (let l = 0; l < 3; l++) {
          const blink = Math.sin(t * (2 + l + u * 0.7) + u * 3 + l) > 0.2;
          const col = l === 2 ? "255,190,110" : "110,240,170";
          ctx.fillStyle = `rgba(${col},${blink ? 0.95 : 0.15})`; ctx.shadowColor = `rgba(${col},1)`; ctx.shadowBlur = blink ? 8 : 0;
          ctx.fillRect(16 + l * 4, -106 + u * 16, 2.2, 2.2);
        }
      }
      ctx.restore();

      // hydrothermal vent: chimneys with warm shimmering water rising
      const vx = W * 0.66, vy = floor + 4;
      glowLine("rgba(255,150,90,0.35)", 12, 1.3);
      ctx.beginPath(); ctx.moveTo(vx - 30, vy); ctx.lineTo(vx - 14, vy - 70); ctx.lineTo(vx - 4, vy - 70); ctx.lineTo(vx + 10, vy); ctx.stroke();
      ctx.beginPath(); ctx.moveTo(vx + 10, vy); ctx.lineTo(vx + 22, vy - 44); ctx.lineTo(vx + 30, vy - 44); ctx.lineTo(vx + 42, vy); ctx.stroke();
      for (let i = 0; i < 26; i++) {
        const u = ((t * 0.25 + i / 26) % 1);
        const px = vx - 9 + Math.sin(t * 2 + i) * (4 + u * 26), py = vy - 74 - u * 170;
        ctx.fillStyle = `rgba(255,${170 + u * 60},${120 + u * 80},${0.35 * (1 - u)})`; ctx.shadowBlur = 0;
        ctx.beginPath(); ctx.arc(px, py, 2 + u * 7, 0, Math.PI * 2); ctx.fill();
      }
      const vg = ctx.createRadialGradient(vx - 9, vy - 70, 0, vx - 9, vy - 70, 60);
      vg.addColorStop(0, "rgba(255,150,80,0.45)"); vg.addColorStop(1, "rgba(255,150,80,0)");
      ctx.fillStyle = vg; ctx.beginPath(); ctx.arc(vx - 9, vy - 70, 60, 0, Math.PI * 2); ctx.fill();

      // tube worms swaying by the vent, red tips glowing
      for (let i = 0; i < 9; i++) {
        const bx = vx + 60 + i * 9, h = 24 + (i * 13) % 26, sway = Math.sin(t * 1.2 + i) * 5;
        glowLine("rgba(230,240,245,0.25)", 0, 2);
        ctx.beginPath(); ctx.moveTo(bx, vy); ctx.quadraticCurveTo(bx + sway * 0.5, vy - h * 0.6, bx + sway, vy - h); ctx.stroke();
        ctx.fillStyle = "rgba(255,90,90,0.85)"; ctx.shadowColor = "rgba(255,80,80,1)"; ctx.shadowBlur = 10;
        ctx.beginPath(); ctx.arc(bx + sway, vy - h, 2.6, 0, Math.PI * 2); ctx.fill();
      }

      // anchor, half buried, chain trailing up into the dark
      const ax = W * 0.86, ay = floor + 2;
      ctx.save(); ctx.translate(ax, ay); ctx.rotate(0.3);
      glowLine("rgba(140,205,235,0.4)", 10, 2);
      ctx.beginPath(); ctx.moveTo(0, -10); ctx.lineTo(0, -96);
      ctx.moveTo(-22, -80); ctx.lineTo(22, -80);
      ctx.moveTo(-36, -28); ctx.quadraticCurveTo(0, 6, 36, -28);
      ctx.stroke();
      ctx.beginPath(); ctx.arc(0, -104, 8, 0, Math.PI * 2); ctx.stroke();
      ctx.lineWidth = 1.2;
      for (let i = 0; i < 14; i++) {
        ctx.beginPath(); ctx.ellipse(Math.sin(t * 0.4 + i * 0.3) * i * 1.5, -118 - i * 13, 3.5, 6.5, i % 2 ? 0 : Math.PI / 2, 0, Math.PI * 2);
        ctx.strokeStyle = `rgba(140,205,235,${0.35 * (1 - i / 14)})`; ctx.stroke();
      }
      ctx.restore();
      ctx.restore();
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
      abyss();
      particles(dt);
      drawRings();
      raf = requestAnimationFrame(frame);
    }

    const onMove = (e: PointerEvent) => { mouse.x = e.clientX; mouse.y = e.clientY; mouse.on = e.pointerType === "mouse"; };
    const onLeave = () => { mouse.on = false; };
    const onDown = (e: PointerEvent) => {
      const el = e.target as HTMLElement;
      if (el.closest("a, button, input, textarea, .term, .net, .repo, .card, .log li")) return; // don't ping when using the UI
      rings.push({ x: e.clientX, y: e.clientY, t0: t });
      if (Ds < 0.35) burst(e.clientX, e.clientY, 18);
    };
    const onBurst = (e: Event) => { const d = (e as CustomEvent<{ x: number; y: number; n?: number }>).detail; burst(d.x, d.y, d.n ?? 30); };
    const onSonar = (e: Event) => { const d = (e as CustomEvent<{ x: number; y: number }>).detail; rings.push({ x: d.x, y: d.y, t0: t }); };
    const onVis = () => { cancelAnimationFrame(raf); if (!document.hidden) { last = performance.now(); raf = requestAnimationFrame(frame); } };

    resize();
    Ds = D = clamp(window.scrollY / Math.max(1, document.documentElement.scrollHeight - window.innerHeight));
    window.addEventListener("resize", resize);
    window.addEventListener("pointermove", onMove, { passive: true });
    window.addEventListener("pointerdown", onDown, { passive: true });
    window.addEventListener("sonar", onSonar);
    window.addEventListener("burst", onBurst);
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
      window.removeEventListener("burst", onBurst);
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
