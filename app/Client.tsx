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
