"use client";

import { motion } from "framer-motion";
import { TrendingUp } from "lucide-react";
import FloatingShapes from "./FloatingShapes";
import NeuralBackground from "./NeuralBackground";
import FloatingTechIcons from "./FloatingTechIcons";

export default function AboutCinematic() {
  return (
    <section
      id="about"
      className="min-h-screen flex items-center bg-gradient-to-b from-black via-neutral-950 to-black py-20 relative overflow-hidden"
    >
      {/* Animated Backgrounds */}
      <NeuralBackground />
      <FloatingShapes />
      <FloatingTechIcons />

      {/* Radial gradient overlay for depth */}
      <div className="absolute inset-0 bg-radial-gradient from-transparent via-black/40 to-black pointer-events-none" />

      <div className="w-full px-4 relative z-10 flex justify-center">
        <div className="max-w-5xl">
          {/* Section Title - Center Aligned */}
          <motion.div
            initial={{ opacity: 0, y: 30 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 0.4 }}
            className="mb-16 text-center"
          >
            <motion.p
              initial={{ opacity: 0 }}
              whileInView={{ opacity: 1 }}
              viewport={{ once: true }}
              transition={{ delay: 0.1 }}
              className="text-accent text-base md:text-lg font-medium mb-6 tracking-wider uppercase"
            >
              About Me
            </motion.p>
            <h2 className="text-6xl md:text-8xl lg:text-9xl font-bold text-white">
              Who I Am
            </h2>
          </motion.div>

          {/* Content - Center Aligned */}
          <div className="text-center">
            {/* Story */}
            <motion.div
              initial={{ opacity: 0, y: 30 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ duration: 0.5 }}
              className="space-y-10"
            >
              <motion.h3
                initial={{ opacity: 0, y: 20 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true }}
                transition={{ delay: 0.2, duration: 0.4 }}
                className="text-6xl md:text-7xl lg:text-8xl font-bold text-white leading-tight"
              >
                Backend Engineer.
                <br />
                <span className="text-accent">System Architect.</span>
              </motion.h3>

              <motion.p
                initial={{ opacity: 0, y: 20 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true }}
                transition={{ delay: 0.3, duration: 0.4 }}
                className="text-2xl md:text-3xl lg:text-4xl text-gray-300 leading-relaxed"
              >
                Building scalable infrastructure at production startups.
                Specializing in high-performance APIs and distributed systems.
              </motion.p>

              <motion.p
                initial={{ opacity: 0, y: 20 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true }}
                transition={{ delay: 0.4, duration: 0.4 }}
                className="text-xl md:text-2xl lg:text-3xl text-gray-400 leading-relaxed"
              >
                Senior at UC Santa Barbara, graduating December 2026.
                <br />
                3 SWE internships. 2M+ monthly API requests. 99.9% uptime.
              </motion.p>

              {/* CTA */}
              <motion.div
                initial={{ opacity: 0, y: 20 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true }}
                transition={{ delay: 0.5, duration: 0.4 }}
                className="pt-8 flex justify-center"
              >
                <a
                  href="#contact"
                  className="inline-flex items-center gap-4 px-10 py-5 bg-gradient-to-r from-accent to-accent-blue rounded-full text-xl md:text-2xl font-bold text-black hover:scale-105 hover:shadow-2xl hover:shadow-accent/60 transition-all duration-300"
                >
                  Let's Build Together
                  <TrendingUp className="w-7 h-7 md:w-8 md:h-8" />
                </a>
              </motion.div>
            </motion.div>
          </div>
        </div>
      </div>
    </section>
  );
}
