"use client";
import { useState } from "react";

const slides = [
  { value: "2M+", label: "API requests monthly" },
  { value: "99.9%", label: "Uptime SLA" },
  { value: "150 ms", label: "Median response" },
];

export default function ImpactCarousel() {
  const [i, setI] = useState(0);
  return (
    <section className="grid place-items-center">
      <div className="text-center space-y-3">
        <div className="text-6xl md:text-7xl font-semibold tracking-tight">{slides[i].value}</div>
        <p className="text-lg opacity-80">{slides[i].label}</p>
        <div className="mt-6 flex items-center justify-center gap-2">
          {slides.map((_, idx) => (
            <button
              key={idx}
              aria-label={`Go to slide ${idx + 1}`}
              onClick={() => setI(idx)}
              className={`h-2.5 w-2.5 rounded-full ${idx === i ? "bg-white" : "bg-white/30"}`}
            />
          ))}
        </div>
      </div>
    </section>
  );
}
