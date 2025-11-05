"use client";

import { motion } from "framer-motion";
import { ChevronDown } from "lucide-react";
import { useEffect, useState } from "react";

const Hero = () => {
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
    <section className="min-h-screen flex flex-col justify-center items-center relative px-4">
      {/* Particle background effect */}
      <div className="absolute inset-0 overflow-hidden pointer-events-none">
        <div className="absolute inset-0 bg-gradient-to-b from-transparent via-accent/5 to-transparent"></div>
      </div>

      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.8 }}
        className="z-10 text-center max-w-4xl"
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
          Hi, I'm{" "}
          <span className="gradient-text glow">Kushagra</span> 👋
        </h1>

        {/* Description */}
        <p className="text-xl md:text-2xl text-gray-300 mb-8 leading-relaxed">
          I build scalable ML systems and full-stack applications that serve
          millions. From training CNNs on distributed clusters to architecting
          microservices handling{" "}
          <span className="text-accent font-semibold">2M+ requests monthly</span> at{" "}
          <span className="text-accent font-semibold">99.9% uptime</span>.
        </p>

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
            View Projects
          </motion.a>
          <motion.a
            href="#contact"
            whileHover={{ scale: 1.05 }}
            whileTap={{ scale: 0.95 }}
            className="px-8 py-3 border-2 border-accent text-accent font-semibold rounded-lg hover:bg-accent/10 transition-colors cursor-pointer"
          >
            Let's Talk
          </motion.a>
        </div>
      </motion.div>

      {/* Scroll indicator */}
      <motion.div
        className="absolute bottom-10 left-1/2 transform -translate-x-1/2 cursor-pointer"
        animate={{ y: [0, 10, 0] }}
        transition={{ repeat: Infinity, duration: 2 }}
      >
        <ChevronDown size={32} className="text-accent" />
      </motion.div>
    </section>
  );
};

export default Hero;
