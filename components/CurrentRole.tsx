"use client";

import { motion } from "framer-motion";
import MatrixRain from "./MatrixRain";

const CurrentRole = () => {
  return (
    <section id="experience" className="min-h-screen flex items-center bg-gradient-to-b from-black via-neutral-950 to-black py-20 relative overflow-hidden">
      {/* Matrix Rain Background */}
      <MatrixRain />

      {/* Radial gradient overlay for depth */}
      <div className="absolute inset-0 bg-gradient-radial from-transparent via-black/60 to-black pointer-events-none" />

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
              Current Experience
            </motion.p>
            <h2 className="text-6xl md:text-8xl lg:text-9xl font-bold text-white">
              What I'm Building
            </h2>
          </motion.div>

          {/* Content - Center Aligned */}
          <div className="text-center">
            <motion.div
              initial={{ opacity: 0, y: 30 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ duration: 0.5 }}
              className="space-y-10"
            >
              {/* Role Title */}
              <motion.h3
                initial={{ opacity: 0, y: 20 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true }}
                transition={{ delay: 0.2, duration: 0.4 }}
                className="text-6xl md:text-7xl lg:text-8xl font-bold text-white leading-tight"
              >
                Platform Engineer
                <br />
                <span className="text-accent">@ Visual Layer</span>
              </motion.h3>

              {/* Description */}
              <motion.p
                initial={{ opacity: 0, y: 20 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true }}
                transition={{ delay: 0.3, duration: 0.4 }}
                className="text-2xl md:text-3xl lg:text-4xl text-gray-300 leading-relaxed"
              >
                Engineering ML infrastructure for distributed training.
                Automating cloud orchestration across AWS and Azure.
              </motion.p>

              {/* Tech Tags */}
              <motion.div
                initial={{ opacity: 0, y: 20 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true }}
                transition={{ delay: 0.4, duration: 0.4 }}
                className="flex flex-wrap gap-3 pt-4 justify-center"
              >
                {["Python", "Docker", "AWS", "Azure", "PostgreSQL", "fastdup"].map(
                  (tech, index) => (
                    <motion.span
                      key={tech}
                      initial={{ opacity: 0, scale: 0.8 }}
                      whileInView={{ opacity: 1, scale: 1 }}
                      viewport={{ once: true }}
                      transition={{
                        delay: 0.5 + index * 0.05,
                        duration: 0.3,
                      }}
                      className="px-5 py-2.5 text-lg font-medium bg-white/5 border border-white/10 rounded-full text-accent hover:border-accent/50 transition-colors"
                    >
                      {tech}
                    </motion.span>
                  )
                )}
              </motion.div>
            </motion.div>
          </div>
        </div>
      </div>
    </section>
  );
};

export default CurrentRole;
