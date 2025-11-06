"use client";

import { motion } from "framer-motion";
import { ChevronDown } from "lucide-react";
import { TypeAnimation } from "react-type-animation";
import dynamic from "next/dynamic";

// Dynamic import for 3D component
const NeuralNetworkHero = dynamic(() => import("./NeuralNetworkHero"), {
  ssr: false,
  loading: () => (
    <div className="absolute top-20 left-1/2 -translate-x-1/2 w-24 h-24 rounded-full bg-white/5 animate-pulse" />
  ),
});

export default function ImprovedHero() {
  return (
    <section
      id="home"
      className="relative flex min-h-screen items-center justify-center overflow-hidden"
    >
      {/* Background Gradient */}
      <div className="pointer-events-none absolute inset-0 bg-[radial-gradient(ellipse_at_top,rgba(0,217,255,0.15),transparent_50%)]" />

      {/* 3D Neural Network - Centered Above Name */}
      <div className="absolute top-24 left-1/2 -translate-x-1/2 w-32 h-32 z-0">
        <NeuralNetworkHero />
      </div>

      {/* Content */}
      <div className="wrap relative z-10 text-center px-6">
        {/* Name with Stagger Animation */}
        <motion.h1
          initial={{ opacity: 0, y: 30 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.8, delay: 0.3 }}
          className="text-5xl sm:text-7xl md:text-8xl font-bold tracking-tight mb-6"
        >
          KUSHAGRA{" "}
          <span className="gradient-cyan text-glow">KANAUJIA</span>
        </motion.h1>

        {/* Role One-Liner */}
        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ duration: 0.8, delay: 0.6 }}
          className="text-xl sm:text-2xl md:text-3xl text-white/80 mb-8 font-light"
        >
          <TypeAnimation
            sequence={[
              "ML and Systems Engineer",
              2000,
              "Building intelligent systems at scale",
              2000,
              "Turning math into performance",
              2000,
            ]}
            wrapper="span"
            speed={50}
            repeat={Infinity}
            cursor={true}
          />
        </motion.div>

        {/* Quick Metrics */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.8, delay: 0.9 }}
          className="grid grid-cols-3 gap-6 sm:gap-12 max-w-2xl mx-auto mb-10"
        >
          <MetricCard number="2M+" label="Monthly requests" />
          <MetricCard number="99.9%" label="Uptime" />
          <MetricCard number="10+" label="Production apps" />
        </motion.div>

        {/* CTA Button */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.8, delay: 1.2 }}
          className="flex flex-col sm:flex-row items-center justify-center gap-4"
        >
          <a
            href="#projects"
            className="group relative inline-flex items-center justify-center rounded-full bg-gradient-to-r from-accent to-accent-blue px-8 py-4 text-base font-semibold text-black hover:shadow-lg hover:shadow-accent/50 focus:outline-none focus-visible:ring-2 focus-visible:ring-accent transition-all duration-300 hover:scale-105"
          >
            Explore Projects
            <ChevronDown className="ml-2 h-5 w-5 group-hover:translate-y-1 transition-transform" />
          </a>

          <a
            href="#contact"
            className="inline-flex items-center justify-center rounded-full border-2 border-white/20 px-8 py-4 text-base font-semibold text-white hover:border-accent hover:bg-white/5 focus:outline-none focus-visible:ring-2 focus-visible:ring-accent transition-all duration-300"
          >
            Get in Touch
          </a>
        </motion.div>

        {/* Intent Line */}
        <motion.p
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ duration: 0.8, delay: 1.5 }}
          className="mt-8 text-sm sm:text-base text-white/60 max-w-2xl mx-auto"
        >
          Currently seeking ML and Platform Engineering roles for Summer 2026
        </motion.p>

        {/* Social Proof */}
        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ duration: 0.8, delay: 1.8 }}
          className="mt-8 flex items-center justify-center gap-8 opacity-50"
        >
          <div className="text-sm text-gray-600">UC Santa Barbara '26</div>
          <div className="h-1 w-1 rounded-full bg-gray-600" />
          <div className="text-sm text-gray-600">Visual Layer</div>
        </motion.div>
      </div>

      {/* Scroll Indicator */}
      <motion.div
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        transition={{ delay: 2, duration: 0.8 }}
        className="absolute bottom-10 left-1/2 -translate-x-1/2 animate-bounce"
      >
        <ChevronDown className="w-6 h-6 text-accent/70" />
      </motion.div>
    </section>
  );
}

function MetricCard({ number, label }: { number: string; label: string }) {
  return (
    <div className="text-center">
      <div className="text-3xl sm:text-4xl md:text-5xl font-bold gradient-cyan mb-1">
        {number}
      </div>
      <div className="text-xs sm:text-sm text-white/60">{label}</div>
    </div>
  );
}
