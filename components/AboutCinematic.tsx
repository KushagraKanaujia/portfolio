"use client";

import { motion } from "framer-motion";
import { Code, Zap, Award, TrendingUp } from "lucide-react";
import FloatingShapes from "./FloatingShapes";
import RevealText from "./RevealText";
import NeuralBackground from "./NeuralBackground";
import FloatingTechIcons from "./FloatingTechIcons";

const highlights = [
  {
    icon: Code,
    label: "Full-Stack + ML",
    value: "3+ Years",
    color: "from-cyan-400 to-blue-500",
  },
  {
    icon: Zap,
    label: "Production Systems",
    value: "10+ Apps",
    color: "from-purple-400 to-pink-500",
  },
  {
    icon: Award,
    label: "Open Source",
    value: "5+ Projects",
    color: "from-orange-400 to-red-500",
  },
  {
    icon: TrendingUp,
    label: "Problem Solver",
    value: "100%",
    color: "from-green-400 to-emerald-500",
  },
];

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

      <div className="w-full max-w-7xl mx-auto px-4 relative z-10">
        {/* Section Title */}
        <motion.div
          initial={{ opacity: 0, y: 30 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ duration: 0.4 }}
          className="text-center mb-20"
        >
          <motion.p
            initial={{ opacity: 0 }}
            whileInView={{ opacity: 1 }}
            viewport={{ once: true }}
            transition={{ delay: 0.1 }}
            className="text-accent text-sm md:text-base font-medium mb-4 tracking-wider uppercase"
          >
            About Me
          </motion.p>
          <RevealText
            text="Building the Future, One Line at a Time"
            className="text-4xl md:text-6xl font-bold gradient-text-apple justify-center"
            delay={0.2}
          />
        </motion.div>

        {/* Content Grid */}
        <div className="grid lg:grid-cols-2 gap-12 items-center">
          {/* Left: Story */}
          <motion.div
            initial={{ opacity: 0, x: -50 }}
            whileInView={{ opacity: 1, x: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 0.4 }}
            className="space-y-6"
          >
            <motion.p
              initial={{ opacity: 0, y: 20 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ delay: 0.2, duration: 0.3 }}
              className="text-lg md:text-xl text-gray-300 leading-relaxed"
            >
              I'm a <span className="text-accent font-semibold">Machine Learning Engineer</span> and{" "}
              <span className="text-accent font-semibold">Full-Stack Developer</span> passionate
              about building intelligent systems that solve real-world problems.
            </motion.p>

            <motion.p
              initial={{ opacity: 0, y: 20 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ delay: 0.3, duration: 0.3 }}
              className="text-base md:text-lg text-gray-400 leading-relaxed"
            >
              Currently studying Computer Science at <span className="text-white font-semibold">UC Santa Barbara</span>,
              I've shipped production-grade applications handling millions of requests, optimized ML
              pipelines for enterprise-scale systems, and built tools that improve developer
              productivity.
            </motion.p>

            <motion.p
              initial={{ opacity: 0, y: 20 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ delay: 0.4, duration: 0.3 }}
              className="text-base md:text-lg text-gray-400 leading-relaxed"
            >
              From training neural networks to architecting scalable backends, I love the entire
              stack. I believe great software is built at the intersection of clean code, smart
              algorithms, and thoughtful design.
            </motion.p>

            {/* CTA */}
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ delay: 0.5, duration: 0.3 }}
              className="pt-4"
            >
              <a
                href="#contact"
                className="inline-flex items-center gap-2 px-6 py-3 bg-gradient-to-r from-accent to-accent-blue rounded-full font-semibold text-black hover:scale-105 hover:shadow-lg hover:shadow-accent/50 transition-all duration-300"
              >
                Let's Build Together
                <TrendingUp className="w-5 h-5" />
              </a>
            </motion.div>
          </motion.div>

          {/* Right: Highlights */}
          <motion.div
            initial={{ opacity: 0, x: 50 }}
            whileInView={{ opacity: 1, x: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 0.4 }}
            className="grid grid-cols-2 gap-6"
          >
            {highlights.map((item, index) => {
              const Icon = item.icon;
              return (
                <motion.div
                  key={index}
                  initial={{ opacity: 0, scale: 0.8 }}
                  whileInView={{ opacity: 1, scale: 1 }}
                  viewport={{ once: true }}
                  transition={{
                    delay: 0.2 + index * 0.1,
                    duration: 0.3,
                    type: "spring",
                    stiffness: 400,
                  }}
                  whileHover={{
                    scale: 1.05,
                    y: -8,
                    transition: { duration: 0.2 },
                  }}
                  className="glass-card p-6 rounded-2xl text-center cursor-pointer group"
                >
                  {/* Icon */}
                  <motion.div
                    whileHover={{ rotate: 360, scale: 1.2 }}
                    transition={{ duration: 0.6 }}
                    className={`w-16 h-16 mx-auto mb-4 rounded-2xl bg-gradient-to-br ${item.color} flex items-center justify-center`}
                  >
                    <Icon className="w-8 h-8 text-white" />
                  </motion.div>

                  {/* Value */}
                  <div className={`text-3xl font-bold bg-gradient-to-r ${item.color} bg-clip-text text-transparent mb-2`}>
                    {item.value}
                  </div>

                  {/* Label */}
                  <div className="text-sm text-gray-400 group-hover:text-gray-300 transition-colors">
                    {item.label}
                  </div>
                </motion.div>
              );
            })}
          </motion.div>
        </div>

        {/* Bottom: What I Do */}
        <motion.div
          initial={{ opacity: 0, y: 30 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ delay: 0.6, duration: 0.4 }}
          className="mt-20 text-center"
        >
          <h3 className="text-2xl md:text-3xl font-bold text-white mb-8">What I Do Best</h3>
          <div className="grid md:grid-cols-3 gap-6">
            {[
              {
                title: "Machine Learning",
                description: "Training models, optimizing pipelines, deploying at scale",
                icon: "🧠",
              },
              {
                title: "Full-Stack Development",
                description: "React, Next.js, Node.js, Python, PostgreSQL, Redis",
                icon: "⚡",
              },
              {
                title: "System Architecture",
                description: "Scalable backends, microservices, cloud infrastructure",
                icon: "🏗️",
              },
            ].map((skill, index) => (
              <motion.div
                key={index}
                initial={{ opacity: 0, y: 20 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true }}
                transition={{ delay: 0.7 + index * 0.1, duration: 0.3 }}
                whileHover={{ y: -4, transition: { duration: 0.2 } }}
                className="glass-card p-6 rounded-xl"
              >
                <div className="text-4xl mb-4">{skill.icon}</div>
                <h4 className="text-lg font-semibold text-white mb-2">{skill.title}</h4>
                <p className="text-sm text-gray-400">{skill.description}</p>
              </motion.div>
            ))}
          </div>
        </motion.div>
      </div>
    </section>
  );
}
