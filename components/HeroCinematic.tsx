"use client";

import { motion } from "framer-motion";
import { ChevronDown } from "lucide-react";
import { TypeAnimation } from "react-type-animation";
import dynamic from "next/dynamic";

// Dynamic import for 3D component
const NeuralNetworkHero = dynamic(() => import("./NeuralNetworkHero"), {
  ssr: false,
  loading: () => (
    <div className="absolute inset-0 bg-black flex items-center justify-center">
      <div className="text-accent text-xl">Loading...</div>
    </div>
  ),
});

const HeroCinematic = () => {
  return (
    <section className="relative w-full h-screen overflow-hidden bg-black">
      {/* 3D Neural Network Background */}
      <div className="absolute inset-0 z-0">
        <NeuralNetworkHero />
      </div>

      {/* Gradient Overlays */}
      <div className="absolute inset-0 bg-gradient-to-b from-black/80 via-black/40 to-black/80 z-10" />
      <div className="absolute inset-0 bg-[radial-gradient(circle_at_center,transparent_0%,black_100%)] z-10" />

      {/* Content */}
      <div className="relative z-20 h-full flex flex-col items-center justify-center px-4">
        {/* Name - Cinematic Reveal */}
        <motion.h1
          initial={{ opacity: 0, y: 50 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 1.2, delay: 0.5, ease: [0.16, 1, 0.3, 1] }}
          className="text-6xl md:text-8xl lg:text-9xl font-bold mb-6 text-center tracking-tight"
        >
          <span className="gradient-text-apple">KUSHAGRA</span>
          <br />
          <span className="gradient-cyan">KANAUJIA</span>
        </motion.h1>

        {/* Typing Subtitle */}
        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ duration: 0.8, delay: 1.5 }}
          className="text-xl md:text-3xl lg:text-4xl text-center text-gray-400 font-light mb-12 max-w-4xl"
        >
          <TypeAnimation
            sequence={[
              "Building systems that serve millions",
              2000,
              "Training CNNs on distributed clusters",
              2000,
              "Architecting microservices at 99.9% uptime",
              2000,
              "Creating intelligent solutions at scale",
              2000,
            ]}
            wrapper="span"
            speed={50}
            repeat={Infinity}
            cursor={true}
            style={{ display: "inline-block" }}
          />
        </motion.div>

        {/* Floating Stats */}
        <motion.div
          initial={{ opacity: 0, y: 30 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.8, delay: 2 }}
          className="flex flex-wrap justify-center gap-8 md:gap-12 mb-16"
        >
          <div className="text-center">
            <div className="text-3xl md:text-5xl font-bold gradient-cyan mb-1">2M+</div>
            <div className="text-sm md:text-base text-gray-500">Monthly Requests</div>
          </div>
          <div className="text-center">
            <div className="text-3xl md:text-5xl font-bold gradient-cyan mb-1">99.9%</div>
            <div className="text-sm md:text-base text-gray-500">Uptime</div>
          </div>
          <div className="text-center">
            <div className="text-3xl md:text-5xl font-bold gradient-cyan mb-1">10+</div>
            <div className="text-sm md:text-base text-gray-500">Production Apps</div>
          </div>
        </motion.div>
      </div>

      {/* Scroll Indicator */}
      <motion.div
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        transition={{ duration: 0.8, delay: 3 }}
        className="scroll-indicator z-30"
      >
        <div className="flex flex-col items-center gap-2">
          <span className="text-sm text-gray-500 font-medium">Explore</span>
          <ChevronDown className="w-6 h-6 text-accent" />
        </div>
      </motion.div>

      {/* Particle Overlay for Depth */}
      <div className="absolute inset-0 pointer-events-none z-15">
        <div className="absolute top-1/4 left-1/4 w-2 h-2 bg-accent rounded-full animate-pulse opacity-40" />
        <div className="absolute top-1/3 right-1/3 w-1 h-1 bg-accent-blue rounded-full animate-pulse opacity-30" style={{ animationDelay: "1s" }} />
        <div className="absolute bottom-1/4 right-1/4 w-2 h-2 bg-accent rounded-full animate-pulse opacity-40" style={{ animationDelay: "2s" }} />
        <div className="absolute bottom-1/3 left-1/3 w-1 h-1 bg-accent-blue rounded-full animate-pulse opacity-30" style={{ animationDelay: "1.5s" }} />
      </div>
    </section>
  );
};

export default HeroCinematic;
