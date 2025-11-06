"use client";

import { motion } from "framer-motion";
import Image from "next/image";
import { Code2, Cpu, Database, Globe, Sparkles, Terminal } from "lucide-react";

const About = () => {
  const highlights = [
    {
      icon: <Cpu className="w-6 h-6" />,
      title: "ML Engineering",
      desc: "Training CNNs on distributed clusters, optimizing models for production"
    },
    {
      icon: <Code2 className="w-6 h-6" />,
      title: "Full-Stack Development",
      desc: "Building scalable applications with React, Next.js, Node.js, and Python"
    },
    {
      icon: <Database className="w-6 h-6" />,
      title: "System Architecture",
      desc: "Designing microservices handling 2M+ requests monthly at 99.9% uptime"
    },
    {
      icon: <Globe className="w-6 h-6" />,
      title: "Cloud & DevOps",
      desc: "AWS, Docker, Kubernetes orchestration for production deployments"
    }
  ];

  const stats = [
    { value: "99.9%", label: "System Uptime" },
    { value: "2M+", label: "Monthly Requests" },
    { value: "10+", label: "Production Apps" },
    { value: "50K+", label: "Lines of Code" }
  ];

  return (
    <section id="about" className="min-h-screen py-20 px-4 relative">
      <div className="max-w-7xl mx-auto">
        {/* Section Header */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ duration: 0.6 }}
          className="text-center mb-16"
        >
          <h2 className="text-5xl md:text-6xl font-bold mb-4">
            <span className="gradient-text">About Me</span>
          </h2>
          <p className="text-gray-400 text-lg">
            Building intelligent systems that make a difference
          </p>
        </motion.div>

        <div className="grid md:grid-cols-2 gap-12 items-center mb-20">
          {/* Profile Image */}
          <motion.div
            initial={{ opacity: 0, x: -50 }}
            whileInView={{ opacity: 1, x: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 0.6 }}
            className="relative"
          >
            <div className="relative w-full max-w-md mx-auto aspect-square rounded-2xl overflow-hidden border-2 border-accent/20 shadow-2xl shadow-accent/10">
              {/* Placeholder headshot - Replace with actual image later */}
              <div className="w-full h-full bg-gradient-to-br from-accent/20 via-accent-blue/20 to-purple-500/20 flex items-center justify-center">
                <div className="text-center">
                  <Sparkles className="w-20 h-20 text-accent mx-auto mb-4" />
                  <p className="text-gray-400 text-sm">Professional Headshot</p>
                  <p className="text-gray-500 text-xs mt-2">(Placeholder - Add your photo)</p>
                </div>
              </div>

              {/* Decorative elements */}
              <div className="absolute -top-4 -right-4 w-24 h-24 bg-accent/20 rounded-full blur-3xl"></div>
              <div className="absolute -bottom-4 -left-4 w-32 h-32 bg-accent-blue/20 rounded-full blur-3xl"></div>
            </div>
          </motion.div>

          {/* Bio */}
          <motion.div
            initial={{ opacity: 0, x: 50 }}
            whileInView={{ opacity: 1, x: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 0.6 }}
            className="space-y-6"
          >
            <div className="terminal p-6">
              <div className="flex items-center gap-2 mb-4">
                <Terminal className="w-5 h-5 text-accent" />
                <span className="text-accent font-mono">$ whoami</span>
              </div>
              <div className="text-gray-300 space-y-4 leading-relaxed">
                <p>
                  I'm a <span className="text-accent font-semibold">Computer Science student at UC Santa Barbara</span>,
                  passionate about building intelligent systems that scale. Currently working as an
                  <span className="text-accent font-semibold"> ML Research Intern at Visual Layer</span>,
                  where I optimize ML pipelines and build production-ready AI solutions.
                </p>
                <p>
                  My expertise spans <span className="text-accent-blue font-semibold">full-stack development</span>,
                  <span className="text-accent-blue font-semibold"> machine learning</span>, and
                  <span className="text-accent-blue font-semibold"> cloud architecture</span>.
                  I've built applications serving millions of users with 99.9% uptime,
                  trained CNNs on distributed clusters, and architected microservices handling 2M+ monthly requests.
                </p>
                <p>
                  When I'm not coding, you'll find me exploring new technologies, contributing to open-source,
                  or optimizing systems for peak performance. I believe in writing clean, maintainable code
                  that solves real-world problems.
                </p>
              </div>
            </div>

            {/* Quick Stats */}
            <div className="grid grid-cols-2 gap-4">
              {stats.map((stat, index) => (
                <motion.div
                  key={index}
                  initial={{ opacity: 0, scale: 0.8 }}
                  whileInView={{ opacity: 1, scale: 1 }}
                  viewport={{ once: true }}
                  transition={{ duration: 0.4, delay: index * 0.1 }}
                  className="glow-card p-4 text-center border border-accent/20 rounded-lg"
                >
                  <div className="text-2xl md:text-3xl font-bold text-accent mb-1">
                    {stat.value}
                  </div>
                  <div className="text-sm text-gray-400">{stat.label}</div>
                </motion.div>
              ))}
            </div>
          </motion.div>
        </div>

        {/* Highlights Grid */}
        <motion.div
          initial={{ opacity: 0, y: 30 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ duration: 0.6 }}
          className="grid md:grid-cols-2 lg:grid-cols-4 gap-6"
        >
          {highlights.map((item, index) => (
            <motion.div
              key={index}
              initial={{ opacity: 0, y: 20 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ duration: 0.4, delay: index * 0.1 }}
              whileHover={{ y: -5, transition: { duration: 0.2 } }}
              className="glow-card p-6 border border-accent/20 rounded-xl"
            >
              <div className="text-accent mb-4">{item.icon}</div>
              <h3 className="text-lg font-semibold mb-2">{item.title}</h3>
              <p className="text-sm text-gray-400 leading-relaxed">{item.desc}</p>
            </motion.div>
          ))}
        </motion.div>
      </div>
    </section>
  );
};

export default About;
