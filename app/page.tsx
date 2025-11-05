"use client";

import dynamic from "next/dynamic";
import ImpactCarousel from "../components/ImpactCarousel";

const Hero3D = dynamic(() => import("../components/Hero3D"), { ssr: false });
const NeuralNetwork3D = dynamic(() => import("../components/NeuralNetwork3D"), { ssr: false });

export default function Home() {
  return (
    <>
      {/* HERO (minimal) */}
      <section className="grid place-items-center">
        <div className="text-center space-y-3">
          <h1 className="text-4xl md:text-6xl font-semibold tracking-tight">Kushagra Kanaujia</h1>
          <p className="text-lg md:text-xl opacity-80">Building reliable systems & ML that move metrics</p>
          <div className="mt-8 animate-bounce text-sm opacity-70">↓ Scroll</div>
        </div>
      </section>

      {/* METRICS */}
      <section>
        <ImpactCarousel />
      </section>

      {/* 3D SECTIONS */}
      <section>
        <Hero3D />
      </section>

      <section>
        <NeuralNetwork3D />
      </section>
    </>
  );
}
