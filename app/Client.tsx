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
      { rootMargin: "0px 0px -8% 0px" }
    );
    els.forEach((el) => io.observe(el));
    return () => io.disconnect();
  }, []);
  return null;
}

/** Live California time, ticking. */
export function Clock() {
  const [t, setT] = useState("");
  useEffect(() => {
    const f = new Intl.DateTimeFormat("en-US", {
      hour: "2-digit", minute: "2-digit", second: "2-digit", hour12: false, timeZone: "America/Los_Angeles",
    });
    const tick = () => setT(f.format(new Date()));
    tick();
    const id = setInterval(tick, 1000);
    return () => clearInterval(id);
  }, []);
  return <span suppressHydrationWarning>{t || "--:--:--"} PT</span>;
}
