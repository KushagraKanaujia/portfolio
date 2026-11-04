"use client";

import { useEffect, useRef, useState } from "react";

/** Options as bubbles: they bob and drift, push away from your cursor and each other,
 *  wobble on hover, and pop when you click (then float back up from below). */

export type BubbleItem = { label: string; sub?: string; href: string; size?: number };

type B = { x: number; y: number; vx: number; vy: number; r: number; hx: number; hy: number; ph: number; popped: number };

export default function Bubbles({ items }: { items: BubbleItem[] }) {
  const box = useRef<HTMLDivElement>(null);
  const els = useRef<(HTMLAnchorElement | null)[]>([]);
  const state = useRef<B[]>([]);
  const [popped, setPopped] = useState<Record<number, boolean>>({});

  useEffect(() => {
    const el = box.current!;
    const reduce = matchMedia("(prefers-reduced-motion: reduce)").matches;
    let W = 0, H = 0, raf = 0, t = 0, last = performance.now();
    const mouse = { x: -999, y: -999 };

    const layout = () => {
      const r = el.getBoundingClientRect();
      W = r.width; H = r.height;
      const small = W < 520;
      const cols = small ? 3 : 4;
      state.current = items.map((it, i) => {
        const base = (it.size ?? 1) * (small ? 38 : 50);
        const col = i % cols, row = Math.floor(i / cols);
        const hx = ((col + 0.5 + (row % 2) * 0.35) / (cols + 0.35)) * W;
        const hy = (0.28 + row * 0.42) * H + (col % 2) * 18;
        const prev = state.current[i];
        return prev && W ? { ...prev, r: base, hx, hy } : { x: hx, y: H + base + i * 30, vx: 0, vy: -1, r: base, hx, hy, ph: Math.random() * 6, popped: 0 };
      });
    };

    const frame = (now: number) => {
      const dt = Math.min(0.05, (now - last) / 1000); last = now;
      if (!reduce) t += dt;
      const bs = state.current;
      for (let i = 0; i < bs.length; i++) {
        const b = bs[i];
        // spring to a home spot that slowly wanders, like something buoyant
        const hx = b.hx + Math.sin(t * 0.35 + b.ph) * 22, hy = b.hy + Math.sin(t * 0.6 + b.ph * 2) * 14;
        b.vx += (hx - b.x) * 0.9 * dt; b.vy += (hy - b.y) * 0.9 * dt;
        // the cursor pushes water away
        const dx = b.x - mouse.x, dy = b.y - mouse.y, d = Math.hypot(dx, dy);
        if (d < b.r + 90 && d > 0.1) { const f = (1 - d / (b.r + 90)) * 260 * dt; b.vx += (dx / d) * f; b.vy += (dy / d) * f; }
        // bubbles don't overlap
        for (let j = i + 1; j < bs.length; j++) {
          const o = bs[j], ox = o.x - b.x, oy = o.y - b.y, od = Math.hypot(ox, oy) || 1, min = b.r + o.r + 8;
          if (od < min) { const p = ((min - od) / od) * 0.5; b.x -= ox * p * 0.5; b.y -= oy * p * 0.5; o.x += ox * p * 0.5; o.y += oy * p * 0.5; }
        }
        b.vx *= Math.pow(0.18, dt); b.vy *= Math.pow(0.18, dt);
        b.x += b.vx * dt * 60; b.y += b.vy * dt * 60;
        const node = els.current[i];
        if (node) {
          const squish = 1 + Math.sin(t * 2.2 + b.ph) * 0.025;
          node.style.transform = `translate(${(b.x - b.r).toFixed(1)}px, ${(b.y - b.r).toFixed(1)}px) scale(${squish.toFixed(3)}, ${(2 - squish).toFixed(3)})`;
          node.style.width = node.style.height = `${b.r * 2}px`;
        }
      }
      raf = requestAnimationFrame(frame);
    };

    const onMove = (e: PointerEvent) => { const r = el.getBoundingClientRect(); mouse.x = e.clientX - r.left; mouse.y = e.clientY - r.top; };
    const onLeave = () => { mouse.x = mouse.y = -999; };
    layout();
    const ro = new ResizeObserver(layout); ro.observe(el);
    el.addEventListener("pointermove", onMove); el.addEventListener("pointerleave", onLeave);
    raf = requestAnimationFrame(frame);
    return () => { cancelAnimationFrame(raf); ro.disconnect(); el.removeEventListener("pointermove", onMove); el.removeEventListener("pointerleave", onLeave); };
  // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [items.length]);

  const pop = (i: number, e: React.MouseEvent<HTMLAnchorElement>) => {
    const it = items[i];
    const r = e.currentTarget.getBoundingClientRect();
    window.dispatchEvent(new CustomEvent("sonar", { detail: { x: r.left + r.width / 2, y: r.top + r.height / 2 } }));
    window.dispatchEvent(new CustomEvent("burst", { detail: { x: r.left + r.width / 2, y: r.top + r.height / 2 } }));
    setPopped((p) => ({ ...p, [i]: true }));
    const internal = it.href.startsWith("#");
    if (internal) {
      e.preventDefault();
      setTimeout(() => document.getElementById(it.href.slice(1))?.scrollIntoView({ behavior: "smooth", block: "start" }), 250);
    } else if (it.href.startsWith("mailto")) {
      e.preventDefault();
      setTimeout(() => { window.location.href = it.href; }, 300);
    }
    // respawn from below after the pop
    setTimeout(() => {
      const b = state.current[i];
      if (b) { b.y = (box.current?.getBoundingClientRect().height ?? 400) + b.r * 2; b.vy = -2; }
      setPopped((p) => ({ ...p, [i]: false }));
    }, 900);
  };

  return (
    <div className="bubbles" ref={box}>
      {items.map((it, i) => (
        <a
          key={it.label}
          ref={(n) => { els.current[i] = n; }}
          href={it.href}
          target={it.href.startsWith("http") ? "_blank" : undefined}
          rel="noreferrer"
          className={`bubble${popped[i] ? " popped" : ""}`}
          onClick={(e) => pop(i, e)}
        >
          <span className="bubble-in">
            <b>{it.label}</b>
            {it.sub && <small>{it.sub}</small>}
          </span>
        </a>
      ))}
    </div>
  );
}
