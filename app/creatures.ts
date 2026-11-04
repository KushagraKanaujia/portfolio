// Sea life with real swimming motion. Every body is built around a spine that bends
// with a traveling wave (fish and whales), a wing that ripples (the ray), or a pulsing
// mantle with trailing arms (the squid), then shaded with countershading and rim light.

type C = CanvasRenderingContext2D;
type P = { x: number; y: number };
const TAU = Math.PI * 2;

/** Outline a body from spine points and per-point half widths (top and bottom). */
function outline(ctx: C, sp: P[], top: number[], bot: number[]) {
  const n = sp.length;
  const nx: number[] = [], ny: number[] = [];
  for (let i = 0; i < n; i++) {
    const a = sp[Math.max(0, i - 1)], b = sp[Math.min(n - 1, i + 1)];
    const dx = b.x - a.x, dy = b.y - a.y, l = Math.hypot(dx, dy) || 1;
    nx.push(dy / l); ny.push(-dx / l); // +normal points down for a body facing +x
  }
  ctx.beginPath();
  ctx.moveTo(sp[0].x, sp[0].y);
  for (let i = 1; i < n; i++) ctx.lineTo(sp[i].x - nx[i] * top[i], sp[i].y - ny[i] * top[i]);
  for (let i = n - 1; i >= 1; i--) ctx.lineTo(sp[i].x + nx[i] * bot[i], sp[i].y + ny[i] * bot[i]);
  ctx.closePath();
  return { nx, ny };
}

/* ------------------------------------------------------------------ fish */

export type Fish = { x: number; y: number; vx: number; vy: number; ox: number; oy: number; ph: number; sz: number; freq: number; ax: number; ay: number };

/** One small fish, side-on with a little perspective, swimming toward +x in local space. */
export function drawFish(ctx: C, f: Fish, heading: number, t: number, L: number, alpha: number, sunlit: number) {
  const N = 9;
  const beat = t * f.freq + f.ph;
  const sp: P[] = [], top: number[] = [], bot: number[] = [];
  for (let i = 0; i < N; i++) {
    const s = i / (N - 1);                         // 0 head … 1 tail
    const lat = Math.pow(s, 2) * Math.sin(beat - s * 4.2) * L * 0.22; // carangiform: tail does the work
    sp.push({ x: L * (0.5 - s), y: lat * 0.33 });   // lateral motion seen at an angle
    const w = L * 0.17 * Math.pow(Math.sin(Math.PI * Math.min(1, s * 0.88 + 0.1)), 0.85) + L * 0.015;
    top.push(w); bot.push(w * 0.92);
  }
  ctx.save();
  ctx.translate(f.x, f.y);
  ctx.rotate(heading);
  if (Math.abs(heading) > Math.PI / 2) ctx.scale(1, -1); // keep the back on top
  ctx.globalAlpha = alpha;

  // caudal fin, foreshortened as it swings toward and away from us
  const tail = sp[N - 1];
  const swing = Math.cos(beat - 4.2);
  const fh = L * 0.3 * (0.45 + 0.55 * Math.abs(swing));
  ctx.fillStyle = "#3b5f7c";
  ctx.beginPath();
  ctx.moveTo(tail.x + L * 0.04, tail.y);
  ctx.quadraticCurveTo(tail.x - L * 0.12, tail.y - fh * 0.5, tail.x - L * 0.22, tail.y - fh);
  ctx.quadraticCurveTo(tail.x - L * 0.12, tail.y, tail.x - L * 0.22, tail.y + fh);
  ctx.quadraticCurveTo(tail.x - L * 0.12, tail.y + fh * 0.5, tail.x + L * 0.04, tail.y);
  ctx.fill();

  // body: dark blue back, silver belly
  const g = ctx.createLinearGradient(0, -L * 0.2, 0, L * 0.18);
  g.addColorStop(0, "#1d3d58");
  g.addColorStop(0.45, "#4b7493");
  g.addColorStop(0.6, "#b9cfdc");
  g.addColorStop(1, "#e4eef4");
  ctx.fillStyle = g;
  outline(ctx, sp, top, bot);
  ctx.fill();

  // dorsal fin
  ctx.fillStyle = "#2a4b66";
  const d = sp[3];
  ctx.beginPath();
  ctx.moveTo(d.x + L * 0.08, d.y - top[3] * 0.9);
  ctx.lineTo(d.x - L * 0.02, d.y - top[3] - L * 0.12);
  ctx.lineTo(d.x - L * 0.12, d.y - top[3] * 0.85);
  ctx.fill();

  // silver flash when the side catches the sun
  const flash = Math.pow(Math.max(0, Math.sin(beat * 0.5 + f.ph * 2)), 10) * sunlit;
  if (flash > 0.02) {
    ctx.globalCompositeOperation = "lighter";
    ctx.fillStyle = `rgba(230,245,255,${0.7 * flash})`;
    ctx.beginPath(); ctx.ellipse(sp[3].x, sp[3].y + L * 0.02, L * 0.3, L * 0.06, 0, 0, TAU); ctx.fill();
    ctx.globalCompositeOperation = "source-over";
  }
  // lateral line and eye
  ctx.strokeStyle = "rgba(220,235,245,0.35)"; ctx.lineWidth = Math.max(0.5, L * 0.02);
  ctx.beginPath(); ctx.moveTo(sp[1].x, sp[1].y - L * 0.02); for (let i = 2; i < N - 1; i++) ctx.lineTo(sp[i].x, sp[i].y - L * 0.01); ctx.stroke();
  ctx.fillStyle = "#0b1620";
  ctx.beginPath(); ctx.arc(sp[0].x - L * 0.08, sp[0].y - L * 0.03, Math.max(0.8, L * 0.035), 0, TAU); ctx.fill();
  ctx.restore();
}

/* ----------------------------------------------------------------- whale */

/** Humpback, side-on, swimming toward +x. Whales swim by bending up and down. */
export function drawWhale(ctx: C, x: number, y: number, s: number, t: number, alpha: number, blurPx: number) {
  const N = 22;
  const L = 700;
  const beat = t * 0.9;
  const sp: P[] = [], top: number[] = [], bot: number[] = [];
  for (let i = 0; i < N; i++) {
    const u = i / (N - 1);
    const heave = Math.pow(u, 2.3) * Math.sin(beat - u * 2.4) * 46; // body wave grows toward the flukes
    sp.push({ x: L * (0.45 - u), y: heave + Math.sin(beat + 1.2) * 6 });
    const th = 78 * Math.pow(Math.sin(Math.PI * Math.min(1, u * 0.92 + 0.06)), 0.62) * (1 - 0.82 * Math.pow(u, 2.6)) + 6;
    top.push(th * (u < 0.15 ? 0.85 + u : 1));
    bot.push(th * (1.08 - 0.25 * u));
  }
  ctx.save();
  ctx.translate(x, y);
  ctx.scale(s, s);
  ctx.globalAlpha = alpha;
  if ("filter" in ctx) ctx.filter = blurPx > 0.3 ? `blur(${blurPx.toFixed(1)}px)` : "none";

  // flukes: wide tail blades, seen edge-on they flatten and spread as they sweep
  const tl = sp[N - 1], pre = sp[N - 3];
  const ang = Math.atan2(tl.y - pre.y, tl.x - pre.x);
  const spread = 0.55 + 0.45 * Math.abs(Math.cos(beat - 2.4));
  ctx.save();
  ctx.translate(tl.x, tl.y); ctx.rotate(ang);
  ctx.fillStyle = "#0b1c2b";
  ctx.beginPath();
  ctx.moveTo(-6, 0);
  ctx.bezierCurveTo(30, -30 * spread, 70, -70 * spread, 96, -88 * spread);
  ctx.bezierCurveTo(80, -40 * spread, 70, -10, 60, 0);
  ctx.bezierCurveTo(70, 10, 80, 40 * spread, 96, 88 * spread);
  ctx.bezierCurveTo(70, 70 * spread, 30, 30 * spread, -6, 0);
  ctx.fill();
  ctx.restore();

  // far pectoral fin (behind the body, darker)
  const pf = sp[6];
  const fa = Math.sin(beat * 0.8) * 0.18;
  const fin = (sx: number, shade: string, len: number) => {
    ctx.save();
    ctx.translate(pf.x + sx, pf.y + bot[6] * 0.75); ctx.rotate(0.95 + fa);
    const fg = ctx.createLinearGradient(0, 0, -len * 0.4, len);
    fg.addColorStop(0, shade); fg.addColorStop(1, "#8aa6b8");
    ctx.fillStyle = fg;
    ctx.beginPath();
    ctx.moveTo(0, -10);
    ctx.bezierCurveTo(-30, len * 0.35, -40, len * 0.8, -26, len);
    for (let k = 0; k < 6; k++) ctx.quadraticCurveTo(-14 + k * 3, len - 18 - k * 34, -6 + k * 4, len - 34 - k * 34); // scalloped edge
    ctx.bezierCurveTo(12, len * 0.3, 14, 10, 18, -6);
    ctx.fill();
    ctx.restore();
  };
  fin(46, "#08131d", 105);

  // body with countershading
  const body = ctx.createLinearGradient(0, -90, 0, 95);
  body.addColorStop(0, "#06121e"); body.addColorStop(0.5, "#0e2436"); body.addColorStop(0.75, "#2b4558"); body.addColorStop(1, "#5d7a8c");
  ctx.fillStyle = body;
  const { nx, ny } = outline(ctx, sp, top, bot);
  ctx.fill();

  // ventral pleats following the belly
  if ("filter" in ctx) ctx.filter = "none";
  ctx.lineWidth = 1.5;
  for (let k = 0; k < 8; k++) {
    ctx.strokeStyle = `rgba(170,200,215,${0.16 - k * 0.012})`;
    ctx.beginPath();
    for (let i = 0; i <= 9; i++) {
      const p = sp[i], o = bot[i] * (0.92 - k * 0.07);
      const px = p.x + nx[i] * o, py = p.y + ny[i] * o;
      i ? ctx.lineTo(px, py) : ctx.moveTo(px, py);
    }
    ctx.stroke();
  }
  // tubercles on the head, barnacles on the chin
  ctx.fillStyle = "rgba(160,190,205,0.25)";
  for (let i = 1; i < 5; i++) for (let k = 0; k < 3; k++) {
    const p = sp[i]; const o = top[i] * (0.7 - k * 0.22);
    ctx.beginPath(); ctx.arc(p.x - nx[i] * o + k * 6, p.y - ny[i] * o, 2.8, 0, TAU); ctx.fill();
  }
  ctx.fillStyle = "rgba(200,215,220,0.35)";
  for (let k = 0; k < 6; k++) { const p = sp[1 + (k % 2)]; ctx.beginPath(); ctx.arc(p.x - 10 - k * 7, p.y + bot[1] * 0.75 + (k % 3) * 3, 2 + (k % 2), 0, TAU); ctx.fill(); }
  // eye
  const e = sp[3];
  ctx.fillStyle = "rgba(225,235,240,0.5)";
  ctx.beginPath(); ctx.ellipse(e.x, e.y + 14, 4.5, 3, 0, 0, TAU); ctx.fill();

  // near pectoral fin (in front)
  fin(10, "#132c40", 170);

  // sunlight along the back
  ctx.globalCompositeOperation = "lighter";
  if ("filter" in ctx) ctx.filter = "blur(3px)";
  ctx.strokeStyle = "rgba(150,205,235,0.22)"; ctx.lineWidth = 5;
  ctx.beginPath();
  for (let i = 1; i < N - 2; i++) { const p = sp[i]; const px = p.x - nx[i] * top[i] * 0.9, py = p.y - ny[i] * top[i] * 0.9; i > 1 ? ctx.lineTo(px, py) : ctx.moveTo(px, py); }
  ctx.stroke();
  ctx.restore();
  if ("filter" in ctx) ctx.filter = "none";
}

/* ------------------------------------------------------------ eagle ray */

/** Spotted eagle ray seen from above, flying toward -x. Wings flap with a wave running front to back. */
export function drawRay(ctx: C, x: number, y: number, s: number, t: number, alpha: number) {
  const beat = t * 1.25;
  ctx.save();
  ctx.translate(x, y); ctx.scale(s, s);
  ctx.globalAlpha = alpha;
  if ("filter" in ctx) ctx.filter = "blur(0.6px)";

  // long whip tail, trailing with a lag
  ctx.strokeStyle = "#0d1f2c"; ctx.lineWidth = 3; ctx.lineCap = "round";
  ctx.beginPath(); ctx.moveTo(70, 0);
  for (let i = 1; i <= 16; i++) ctx.lineTo(70 + i * 22, Math.sin(beat - i * 0.35) * i * 1.4);
  ctx.stroke();

  const wing = (side: 1 | -1) => {
    // the wing angle moves light across its surface: brighter when it tilts to the sun
    const phase = beat + (side > 0 ? 0 : 0.15);
    const lift = Math.sin(phase);
    const span = 200 * (0.78 + 0.22 * Math.cos(phase));   // foreshortening from above
    const lag = Math.sin(phase - 0.9) * 26;                 // the tip trails the root
    const shade = 0.5 + 0.5 * lift * side * 0.6;
    const g = ctx.createLinearGradient(0, 0, 0, side * span);
    g.addColorStop(0, `rgb(${18 + 20 * shade},${36 + 30 * shade},${52 + 38 * shade})`);
    g.addColorStop(1, `rgb(${10 + 12 * shade},${22 + 18 * shade},${34 + 24 * shade})`);
    ctx.fillStyle = g;
    ctx.beginPath();
    // falcate wing: rounded leading edge, swept tip, concave trailing edge
    ctx.moveTo(-62, side * 12);
    ctx.bezierCurveTo(-82, side * span * 0.5, -30 + lag * 0.3, side * span * 0.98, 62 + lag, side * span);
    ctx.bezierCurveTo(28 + lag * 0.7, side * span * 0.78, 74, side * span * 0.42, 64, side * 14);
    ctx.closePath(); ctx.fill();
    // white spots, the eagle ray's pattern
    ctx.fillStyle = `rgba(225,235,240,${0.5 + 0.25 * shade})`;
    for (let k = 0; k < 14; k++) {
      const u = ((k * 37) % 100) / 100, v = ((k * 61) % 100) / 100;
      const px = -44 + u * 70 + v * (30 + lag * 0.6), py = side * (22 + v * span * 0.62);
      ctx.beginPath(); ctx.arc(px, py, 1.6 + (k % 3) * 0.7, 0, TAU); ctx.fill();
    }
  };
  wing(-1); wing(1);
  // body and head
  const bg = ctx.createLinearGradient(-110, 0, 80, 0);
  bg.addColorStop(0, "#1c3346"); bg.addColorStop(1, "#0f2232");
  ctx.fillStyle = bg;
  ctx.beginPath(); ctx.ellipse(0, 0, 66, 24, 0, 0, TAU); ctx.fill();
  ctx.beginPath(); ctx.ellipse(-74, 0, 22, 14, 0, 0, TAU); ctx.fill();   // duck-bill snout
  ctx.fillStyle = "rgba(225,235,240,0.55)";
  for (let k = 0; k < 6; k++) { ctx.beginPath(); ctx.arc(-40 + k * 18, (k % 2 ? 1 : -1) * 8, 2.2, 0, TAU); ctx.fill(); }
  ctx.restore();
  if ("filter" in ctx) ctx.filter = "none";
}

/* ----------------------------------------------------------------- squid */

export type Squid = { x: number; y: number; v: number; arms: P[][]; ph: number };

export function makeSquid(x: number, y: number): Squid {
  const arms: P[][] = Array.from({ length: 10 }, () => Array.from({ length: 14 }, (_, i) => ({ x: x + 60 + i * 9, y })));
  return { x, y, v: 0, arms, ph: 0 };
}

/** A squid jetting mantle-first toward -x: the mantle squeezes, it shoots forward, arms stream behind. */
export function updateSquid(sq: Squid, dt: number, t: number, s: number) {
  const pulse = Math.pow(Math.max(0, Math.sin(t * 1.6)), 3);       // jet stroke
  sq.v = sq.v * Math.pow(0.35, dt) + pulse * 560 * dt;            // drag, then thrust (px/s)
  sq.x -= (sq.v + 18) * s * dt;
  sq.y += Math.sin(t * 0.5) * 8 * dt;
  // arms: a chain from the head that is dragged along
  const baseX = sq.x + 150 * s, baseY = sq.y;
  sq.arms.forEach((arm, a) => {
    const spreadY = (a - 4.5) * 3.2 * s;
    const seg = (a >= 8 ? 21 : 11) * s;                          // two long feeding tentacles
    arm[0] = { x: baseX, y: baseY + spreadY * 0.4 };
    for (let i = 1; i < arm.length; i++) {
      const p = arm[i], q = arm[i - 1];
      // drift outward a little and wave, then hold segment length
      p.y += (spreadY * 0.06 + Math.sin(t * 2 + a + i * 0.5) * 0.35 * s);
      const dx = p.x - q.x, dy = p.y - q.y, l = Math.hypot(dx, dy) || 1;
      p.x = q.x + (dx / l) * seg; p.y = q.y + (dy / l) * seg;
    }
  });
  return pulse;
}

export function drawSquid(ctx: C, sq: Squid, t: number, s: number, alpha: number, pulse: number) {
  ctx.save();
  ctx.globalAlpha = alpha;
  // arms first, behind the body
  sq.arms.forEach((arm, a) => {
    const long = a >= 8;
    ctx.strokeStyle = long ? "rgba(200,95,80,0.75)" : "rgba(185,80,70,0.85)";
    ctx.lineCap = "round";
    for (let i = 1; i < arm.length; i++) {
      ctx.lineWidth = Math.max(0.8, (long ? 3.5 : 8) * s * (1 - i / arm.length) + (long && i > arm.length - 3 ? 4 * s : 0));
      ctx.beginPath(); ctx.moveTo(arm[i - 1].x, arm[i - 1].y); ctx.lineTo(arm[i].x, arm[i].y); ctx.stroke();
    }
  });
  const squeeze = 1 - 0.14 * pulse;
  ctx.translate(sq.x, sq.y); ctx.scale(s, s);
  // fins at the tip, rippling
  const fr = Math.sin(t * 4) * 8;
  ctx.fillStyle = "rgba(170,70,64,0.85)";
  ctx.beginPath(); ctx.moveTo(-12, 0); ctx.quadraticCurveTo(8, -52 - fr, 58, -12); ctx.lineTo(58, 12); ctx.quadraticCurveTo(8, 52 + fr, -12, 0); ctx.fill();
  // mantle: a long tapered tube that squeezes on each jet
  const m = ctx.createLinearGradient(0, -24, 0, 24);
  m.addColorStop(0, "#7d2a2c"); m.addColorStop(0.5, "#c4685b"); m.addColorStop(1, "#e7a48e");
  ctx.fillStyle = m;
  ctx.beginPath();
  ctx.moveTo(-14, 0);
  ctx.bezierCurveTo(10, -20 * squeeze, 80, -32 * squeeze, 128, -29 * squeeze);
  ctx.lineTo(132, 29 * squeeze);
  ctx.bezierCurveTo(80, 32 * squeeze, 10, 20 * squeeze, -14, 0);
  ctx.fill();
  // chromatophores
  ctx.fillStyle = "rgba(90,20,24,0.45)";
  for (let k = 0; k < 22; k++) { ctx.beginPath(); ctx.arc(8 + ((k * 53) % 118), ((k * 29) % 30 - 15) * squeeze, 1.6 + (k % 3) * 0.7, 0, TAU); ctx.fill(); }
  // head and big eye
  ctx.fillStyle = "#b65a50";
  ctx.beginPath(); ctx.ellipse(148, 0, 24, 22, 0, 0, TAU); ctx.fill();
  ctx.fillStyle = "#0c0f16"; ctx.beginPath(); ctx.arc(150, -3, 10, 0, TAU); ctx.fill();
  ctx.fillStyle = "rgba(220,240,255,0.8)"; ctx.beginPath(); ctx.arc(145, -5, 2.2, 0, TAU); ctx.fill();
  // blue photophores, glowing in the dark
  ctx.globalCompositeOperation = "lighter";
  for (let k = 0; k < 9; k++) {
    const px = 20 + k * 13, py = 12 * squeeze * (k % 2 ? 1 : -0.4);
    const tw = 0.6 + 0.4 * Math.sin(t * 3 + k);
    const g = ctx.createRadialGradient(px, py, 0, px, py, 8);
    g.addColorStop(0, `rgba(120,210,255,${0.8 * tw})`); g.addColorStop(1, "rgba(120,210,255,0)");
    ctx.fillStyle = g; ctx.beginPath(); ctx.arc(px, py, 8, 0, TAU); ctx.fill();
  }
  // jet of water from the funnel on each stroke
  if (pulse > 0.05) {
    ctx.fillStyle = `rgba(200,230,255,${0.12 * pulse})`;
    ctx.beginPath(); ctx.ellipse(175, 10, 30 * pulse, 6, 0.1, 0, TAU); ctx.fill();
  }
  ctx.restore();
}
