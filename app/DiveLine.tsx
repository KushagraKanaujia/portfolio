"use client";

import { useEffect, useRef, useState } from "react";

/** The dive line: a rail down the left that fills as you descend. Each station is a section;
 *  it lights up when you reach it, and clicking it takes you there. */

export const STATIONS = [
  { id: "top", label: "surface" },
  { id: "dive", label: "who" },
  { id: "terminal", label: "terminal" },
  { id: "network", label: "the network" },
  { id: "made", label: "discoveries" },
  { id: "log", label: "dive log" },
  { id: "hi", label: "signal" },
];

const MAX = 4000;

export default function DiveLine() {
  const [pos, setPos] = useState<number[]>(STATIONS.map((_, i) => i / (STATIONS.length - 1)));
  const [active, setActive] = useState(0);
  const fillRef = useRef<HTMLDivElement>(null);
  const posRef = useRef(pos);
  const numRef = useRef<HTMLSpanElement>(null);

  useEffect(() => {
    let raf = 0;
    const measure = () => {
      const max = Math.max(1, document.documentElement.scrollHeight - innerHeight);
      const next = STATIONS.map((s) => {
        const el = document.getElementById(s.id);
        if (!el) return 0;
        if (s.id === "top") return 0;
        const r = el.getBoundingClientRect();
        return Math.min(1, Math.max(0, (r.top + scrollY - innerHeight * 0.35) / max));
      });
      posRef.current = next;
      setPos(next);
    };
    const update = () => {
      const max = Math.max(1, document.documentElement.scrollHeight - innerHeight);
      const p = Math.min(1, Math.max(0, scrollY / max));
      if (fillRef.current) fillRef.current.style.transform = `scaleY(${p})`;
      if (numRef.current) numRef.current.textContent = Math.round(p * MAX).toLocaleString("en-US");
      let a = 0; posRef.current.forEach((v, i) => { if (p >= v - 0.005) a = i; }); if (p > 0.995) a = STATIONS.length - 1; setActive(a);
      raf = 0;
    };
    const onScroll = () => { if (!raf) raf = requestAnimationFrame(update); };
    measure(); update();
    const t = setInterval(measure, 1500);
    addEventListener("scroll", onScroll, { passive: true });
    addEventListener("resize", () => { measure(); onScroll(); });
    return () => { clearInterval(t); removeEventListener("scroll", onScroll); };
  }, []);

  const go = (id: string) => {
    if (id === "top") scrollTo({ top: 0, behavior: "smooth" });
    else document.getElementById(id)?.scrollIntoView({ behavior: "smooth", block: "start" });
  };

  return (
    <aside className="dive" aria-label="Sections">
      <div className="dive-track">
        <div className="dive-fill" ref={fillRef} />
        {STATIONS.map((s, i) => (
          <button
            key={s.id}
            className={`dive-st${i <= active ? " on" : ""}${i === active ? " now" : ""}`}
            style={{ top: `${pos[i] * 100}%` }}
            onClick={() => go(s.id)}
            aria-label={`Go to ${s.label}`}
          >
            <i />
            <span className="dive-lbl">
              <b>{Math.round(pos[i] * MAX).toLocaleString("en-US")} m</b> {s.label}
            </span>
          </button>
        ))}
      </div>
      <div className="dive-read"><span ref={numRef}>0</span> m</div>
    </aside>
  );
}
