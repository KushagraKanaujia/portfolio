"use client";

import { motion } from "framer-motion";
import { ChevronDown } from "lucide-react";
import { useEffect, useState, Suspense } from "react";
import dynamic from "next/dynamic";

// Dynamically import the 3D component to avoid SSR issues
const NeuralNetwork3D = dynamic(() => import("./NeuralNetwork3D"), {
  ssr: false,
  loading: () => (
    <div className="w-full h-[600px] md:h-[700px] flex items-center justify-center">
      <div className="text-accent text-xl animate-pulse">Loading Neural Network...</div>
    </div>
  ),
});

const Hero3D = () => {
  const [text, setText] = useState("");
  const [titleIndex, setTitleIndex] = useState(0);

  const titles = [
    "> Kushagra Kanaujia",
    "> ML Engineer",
    "> Building scalable systems @ 99.9% uptime"
  ];

  useEffect(() => {
    const fullText = titles[titleIndex];
    let currentIndex = 0;

    const interval = setInterval(() => {
      if (currentIndex <= fullText.length) {
        setText(fullText.slice(0, currentIndex));
        currentIndex++;
      } else {
        setTimeout(() => {
          setTitleIndex((prev) => (prev + 1) % titles.length);
        }, 2000);
        clearInterval(interval);
      }
    }, 100);

    return () => clearInterval(interval);
  }, [titleIndex]);

  return (
    <section className="min-h-screen flex flex-col justify-center items-center relative px-4 overflow-hidden">
      {/* Animated grid background */}
      <div className="absolute inset-0 overflow-hidden pointer-events-none">
        <div className="absolute inset-0 bg-gradient-to-b from-transparent via-accent/5 to-transparent"></div>
        {/* Tron-style grid */}
        <div className="absolute inset-0 opacity-20">
          <div className="h-full w-full" style={{
            backgroundImage: `
              linear-gradient(to right, #00d9ff 1px, transparent 1px),
              linear-gradient(to bottom, #00d9ff 1px, transparent 1px)
            `,
            backgroundSize: '50px 50px',
            transform: 'perspective(500px) rotateX(60deg)',
            transformOrigin: 'center center',
          }}></div>
        </div>
      </div>

      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.8 }}
        className="z-10 text-center max-w-6xl w-full"
      >
        {/* Terminal-style title */}
        <div className="terminal mb-8 text-left max-w-2xl mx-auto">
          <div className="flex items-center gap-2 mb-2">
            <div className="w-3 h-3 rounded-full bg-red-500"></div>
            <div className="w-3 h-3 rounded-full bg-yellow-500"></div>
            <div className="w-3 h-3 rounded-full bg-green-500"></div>
          </div>
          <p className="text-accent font-mono text-xl">
            {text}
            <span className="animate-pulse">|</span>
          </p>
        </div>

        {/* Main heading */}
        <h1 className="text-5xl md:text-7xl font-bold mb-6">
          <span className="gradient-text glow">Neural Codex</span>
        </h1>

        {/* Description */}
        <p className="text-xl md:text-2xl text-gray-300 mb-8 leading-relaxed">
          Architecting ML systems and distributed infrastructure at{" "}
          <span className="text-accent font-semibold">FAANG scale</span>
        </p>

        {/* 3D Neural Network Visualization */}
        <motion.div
          initial={{ opacity: 0, scale: 0.9 }}
          animate={{ opacity: 1, scale: 1 }}
          transition={{ duration: 1, delay: 0.5 }}
          className="mb-8 rounded-lg overflow-hidden glow-card border border-card-border"
        >
          <Suspense fallback={
            <div className="w-full h-[600px] md:h-[700px] flex items-center justify-center bg-card">
              <div className="text-accent text-xl animate-pulse">Initializing Neural Network...</div>
            </div>
          }>
            <NeuralNetwork3D />
          </Suspense>
        </motion.div>

        {/* Interactive hint */}
        <motion.p
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ delay: 1.5 }}
          className="text-gray-400 mb-8"
        >
          <span className="text-accent">Drag</span> to rotate • <span className="text-accent">Hover</span> nodes to explore
        </motion.p>

        {/* Current status */}
        <div className="flex flex-wrap justify-center gap-4 mb-12 text-gray-400">
          <div className="flex items-center gap-2">
            <span className="w-2 h-2 bg-green-500 rounded-full animate-pulse"></span>
            <span>Currently: ML Research @ Visual Layer</span>
          </div>
          <div className="hidden md:block">•</div>
          <span>UC Santa Barbara '26</span>
          <div className="hidden md:block">•</div>
          <span>📍 Santa Barbara, CA</span>
        </div>

        {/* CTA Buttons */}
        <div className="flex flex-wrap justify-center gap-4">
          <motion.a
            href="#projects"
            whileHover={{ scale: 1.05 }}
            whileTap={{ scale: 0.95 }}
            className="px-8 py-3 bg-accent text-black font-semibold rounded-lg hover:bg-accent-blue transition-colors cursor-pointer"
          >
            Explore Projects
          </motion.a>
          <motion.a
            href="#contact"
            whileHover={{ scale: 1.05 }}
            whileTap={{ scale: 0.95 }}
            className="px-8 py-3 border-2 border-accent text-accent font-semibold rounded-lg hover:bg-accent/10 transition-colors cursor-pointer"
          >
            Let's Connect
          </motion.a>
        </div>
      </motion.div>

      {/* Scroll indicator */}
      <motion.div
        className="absolute bottom-10 left-1/2 transform -translate-x-1/2 cursor-pointer z-10"
        animate={{ y: [0, 10, 0] }}
        transition={{ repeat: Infinity, duration: 2 }}
      >
        <ChevronDown size={32} className="text-accent" />
      </motion.div>
    </section>
  );
};

export default Hero3D;

// --- Add inside your <Canvas> in this component ---
// <ambientLight intensity={0.25} />
// <spotLight position={[10,10,10]} angle={0.3} penumbra={1} intensity={1.2} castShadow />
// <Environment preset="city" />
// <ContactShadows position={[0,-1.2,0]} opacity={0.4} scale={20} blur={2.5} />
// <EffectComposer><Bloom intensity={1.3} luminanceThreshold={0.25} luminanceSmoothing={0.95} /></EffectComposer>
//
// Also use <Text ... outlineWidth={0.02} outlineColor="#000" /> for readable labels.
