"use client";

import { useEffect } from "react";

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
