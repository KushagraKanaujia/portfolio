"use client";

import { useEffect, useState } from "react";

/** Adds .in to every .rv element as it scrolls into view. */
export function Reveal() {
  useEffect(() => {
    const els = document.querySelectorAll<HTMLElement>(".rv");
    const io = new IntersectionObserver(
      (entries) => entries.forEach((e) => {
        if (e.isIntersecting) { e.target.classList.add("in"); io.unobserve(e.target); }
      }),
      { rootMargin: "0px 0px -6% 0px" }
    );
    els.forEach((el) => io.observe(el));
    return () => io.disconnect();
  }, []);
  return null;
}

// Isla Vista, CA
const LAT = 34.4133;
const LON = -119.861;
const TZ = "America/Los_Angeles";

/** Today's sunset in Isla Vista (NOAA solar equations, good to about a minute). */
function sunsetToday(now: Date): Date {
  const rad = Math.PI / 180;
  const start = Date.UTC(now.getUTCFullYear(), 0, 0);
  const day = Math.floor((now.getTime() - start) / 864e5);
  const g = (2 * Math.PI / 365) * (day - 1 + 0.5);
  const eqt = 229.18 * (0.000075 + 0.001868 * Math.cos(g) - 0.032077 * Math.sin(g)
    - 0.014615 * Math.cos(2 * g) - 0.040849 * Math.sin(2 * g));
  const decl = 0.006918 - 0.399912 * Math.cos(g) + 0.070257 * Math.sin(g)
    - 0.006758 * Math.cos(2 * g) + 0.000907 * Math.sin(2 * g)
    - 0.002697 * Math.cos(3 * g) + 0.00148 * Math.sin(3 * g);
  const ha = Math.acos(Math.cos(90.833 * rad) / (Math.cos(LAT * rad) * Math.cos(decl)) - Math.tan(LAT * rad) * Math.tan(decl));
  const minutesUtc = 720 - 4 * (LON - ha / rad) - eqt;
  // the local calendar date in IV
  const [y, m, d] = new Intl.DateTimeFormat("en-CA", { timeZone: TZ, year: "numeric", month: "2-digit", day: "2-digit" })
    .format(now).split("-").map(Number);
  return new Date(Date.UTC(y, m - 1, d) + minutesUtc * 60000);
}

/** "6:42 pm in Isla Vista · sunset 4:59 pm" */
export function IVTime() {
  const [s, setS] = useState<{ now: string; sunset: string; mins: number } | null>(null);
  useEffect(() => {
    const fmt = new Intl.DateTimeFormat("en-US", { hour: "numeric", minute: "2-digit", timeZone: TZ });
    const tick = () => {
      const now = new Date();
      const ss = sunsetToday(now);
      setS({
        now: fmt.format(now).toLowerCase(),
        sunset: fmt.format(ss).toLowerCase(),
        mins: Math.round((ss.getTime() - now.getTime()) / 60000),
      });
    };
    tick();
    const id = setInterval(tick, 15000);
    return () => clearInterval(id);
  }, []);
  if (!s) return <span>Isla Vista, California</span>;
  const until =
    s.mins > 0 && s.mins <= 90 ? ` · sunset in ${s.mins} min` :
    s.mins > 90 ? ` · sunset at ${s.sunset}` :
    s.mins > -40 ? " · afterglow over the water" :
    ` · sun went down at ${s.sunset}`;
  return <span>{s.now} in Isla Vista{until}</span>;
}

/** Apple-style statement: words light up one by one as you scroll through it. */
export function ScrollWords({ text, warm = [] }: { text: string; warm?: string[] }) {
  const words = text.split(" ");
  useEffect(() => {
    const box = document.querySelector<HTMLElement>(".words");
    if (!box) return;
    const spans = Array.from(box.querySelectorAll<HTMLElement>("span.w"));
    let raf = 0;
    const update = () => {
      const r = box.getBoundingClientRect();
      const vh = window.innerHeight;
      const p = Math.max(0, Math.min(1, (vh * 0.85 - r.top) / (r.height * 0.9 + vh * 0.1)));
      const n = p * spans.length;
      spans.forEach((s, i) => s.style.setProperty("--o", String(Math.max(0, Math.min(1, n - i)))));
      raf = 0;
    };
    const onScroll = () => { if (!raf) raf = requestAnimationFrame(update); };
    update();
    window.addEventListener("scroll", onScroll, { passive: true });
    window.addEventListener("resize", onScroll);
    return () => { window.removeEventListener("scroll", onScroll); window.removeEventListener("resize", onScroll); };
  }, []);
  return (
    <p className="words">
      {words.map((w, i) => (
        <span key={i} className={`w${warm.includes(w.replace(/[.,]/g, "")) ? " warm" : ""}`}>{w} </span>
      ))}
    </p>
  );
}

/** Hero drifts up, shrinks and fades as you start the dive. */
export function HeroFx() {
  useEffect(() => {
    const el = document.querySelector<HTMLElement>(".hero-inner");
    if (!el || window.matchMedia("(prefers-reduced-motion: reduce)").matches) return;
    let raf = 0;
    const update = () => {
      const p = Math.min(1, window.scrollY / (window.innerHeight * 0.8));
      el.style.opacity = String(1 - p);
      el.style.transform = `translateY(${-p * 60}px) scale(${1 - p * 0.06})`;
      el.style.filter = `blur(${p * 6}px)`;
      raf = 0;
    };
    const onScroll = () => { if (!raf) raf = requestAnimationFrame(update); };
    update();
    window.addEventListener("scroll", onScroll, { passive: true });
    return () => window.removeEventListener("scroll", onScroll);
  }, []);
  return null;
}
