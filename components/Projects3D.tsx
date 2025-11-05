"use client";

import { motion, AnimatePresence } from "framer-motion";
import { ExternalLink, Github, X } from "lucide-react";
import { useState, Suspense } from "react";
import dynamic from "next/dynamic";

const iPhone3D = dynamic(() => import("./iPhone3D"), {
  ssr: false,
  loading: () => (
    <div className="w-full h-[500px] flex items-center justify-center bg-card">
      <div className="text-accent animate-pulse">Loading 3D Model...</div>
    </div>
  ),
});

interface ProjectProps {
  id: string;
  title: string;
  description: string;
  tech: string[];
  metrics: string[];
  github?: string;
  live?: string;
  delay?: number;
  has3D?: boolean;
}

const ProjectCard = ({
  id,
  title,
  description,
  tech,
  metrics,
  github,
  live,
  delay = 0,
  has3D = false,
}: ProjectProps) => {
  const [showModal, setShowModal] = useState(false);

  return (
    <>
      <motion.div
        initial={{ opacity: 0, y: 30 }}
        whileInView={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.6, delay }}
        viewport={{ once: true }}
        className="glow-card bg-card border border-card-border rounded-lg p-6 hover:border-accent/50 transition-all duration-300 relative overflow-hidden group"
      >
        {/* Animated background gradient on hover */}
        <div className="absolute inset-0 bg-gradient-to-br from-accent/0 via-accent/0 to-accent/10 opacity-0 group-hover:opacity-100 transition-opacity duration-500"></div>

        <div className="relative z-10">
          <div className="flex justify-between items-start mb-4">
            <h3 className="text-2xl font-bold gradient-text">{title}</h3>
            <div className="flex gap-3">
              {github && (
                <motion.a
                  href={github}
                  target="_blank"
                  rel="noopener noreferrer"
                  whileHover={{ scale: 1.1 }}
                  whileTap={{ scale: 0.95 }}
                  className="text-gray-400 hover:text-accent transition-colors cursor-pointer"
                >
                  <Github size={20} />
                </motion.a>
              )}
              {live && (
                <motion.a
                  href={live}
                  target="_blank"
                  rel="noopener noreferrer"
                  whileHover={{ scale: 1.1 }}
                  whileTap={{ scale: 0.95 }}
                  className="text-gray-400 hover:text-accent transition-colors cursor-pointer"
                >
                  <ExternalLink size={20} />
                </motion.a>
              )}
            </div>
          </div>

          <p className="text-gray-300 mb-4 leading-relaxed">{description}</p>

          <div className="mb-4">
            <h4 className="text-sm font-semibold text-accent mb-2">Key Metrics:</h4>
            <ul className="space-y-1">
              {metrics.map((metric, idx) => (
                <li key={idx} className="text-sm text-gray-400 flex items-start">
                  <span className="text-accent mr-2">▸</span>
                  {metric}
                </li>
              ))}
            </ul>
          </div>

          <div className="flex flex-wrap gap-2 mb-4">
            {tech.map((t) => (
              <span
                key={t}
                className="px-3 py-1 bg-background border border-card-border rounded-full text-xs text-accent"
              >
                {t}
              </span>
            ))}
          </div>

          {has3D && (
            <motion.button
              onClick={() => setShowModal(true)}
              whileHover={{ scale: 1.05 }}
              whileTap={{ scale: 0.95 }}
              className="w-full px-4 py-2 bg-accent/10 border border-accent text-accent rounded-lg hover:bg-accent/20 transition-colors font-semibold"
            >
              View 3D Demo ✨
            </motion.button>
          )}
        </div>
      </motion.div>

      {/* 3D Modal */}
      <AnimatePresence>
        {showModal && has3D && (
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            className="fixed inset-0 bg-black/90 z-50 flex items-center justify-center p-4"
            onClick={() => setShowModal(false)}
          >
            <motion.div
              initial={{ scale: 0.9, opacity: 0 }}
              animate={{ scale: 1, opacity: 1 }}
              exit={{ scale: 0.9, opacity: 0 }}
              onClick={(e) => e.stopPropagation()}
              className="bg-card border border-accent rounded-lg p-6 max-w-4xl w-full relative"
            >
              <button
                onClick={() => setShowModal(false)}
                className="absolute top-4 right-4 text-gray-400 hover:text-accent transition-colors"
              >
                <X size={24} />
              </button>

              <h2 className="text-3xl font-bold gradient-text mb-4">{title}</h2>
              <p className="text-gray-300 mb-6">{description}</p>

              <Suspense
                fallback={
                  <div className="w-full h-[500px] flex items-center justify-center bg-background rounded-lg">
                    <div className="text-accent animate-pulse">Loading 3D Experience...</div>
                  </div>
                }
              >
                <iPhone3D />
              </Suspense>

              <div className="mt-6 grid grid-cols-2 md:grid-cols-3 gap-4">
                {metrics.map((metric, idx) => (
                  <div key={idx} className="text-center p-3 bg-background rounded-lg border border-card-border">
                    <p className="text-accent text-sm">{metric}</p>
                  </div>
                ))}
              </div>
            </motion.div>
          </motion.div>
        )}
      </AnimatePresence>
    </>
  );
};

const Projects3D = () => {
  const projects = [
    {
      id: "dawdle",
      title: "Dawdle",
      description:
        "iOS app connecting students for spontaneous hangouts with real-time matching algorithm. Built scalable backend handling concurrent connections with WebSocket integration.",
      tech: ["Swift", "Firebase", "Node.js", "WebSocket", "Google Maps API"],
      metrics: [
        "500+ active users in beta",
        "Real-time matching < 2s latency",
        "95% user satisfaction rate",
      ],
      github: "#",
      live: "#",
      has3D: true,
    },
    {
      id: "apextrade",
      title: "ApexTrade",
      description:
        "Full-stack trading platform with real-time market data, portfolio analytics, and ML-powered trade recommendations. Handles 2M+ API requests monthly with 99.9% uptime.",
      tech: ["Next.js", "PostgreSQL", "Redis", "Python", "TensorFlow", "AWS"],
      metrics: [
        "2M+ monthly API requests",
        "99.9% uptime SLA",
        "150ms avg response time",
      ],
      github: "#",
      live: "#",
      has3D: false,
    },
    {
      id: "bustub",
      title: "BusTub Database",
      description:
        "Implemented core DBMS components including buffer pool manager, B+Tree indexing, query execution engine, and concurrency control with MVCC.",
      tech: ["C++", "CMU 15-445", "B+Tree", "MVCC", "Query Optimization"],
      metrics: [
        "All test cases passed",
        "Optimized B+Tree for 10K+ ops/sec",
        "Lock-free data structures",
      ],
      github: "#",
      has3D: false,
    },
  ];

  return (
    <section id="projects" className="py-20 px-4 bg-background relative">
      {/* Decorative gradient orbs */}
      <div className="absolute top-20 left-10 w-64 h-64 bg-accent/10 rounded-full blur-3xl"></div>
      <div className="absolute bottom-20 right-10 w-64 h-64 bg-accent-blue/10 rounded-full blur-3xl"></div>

      <div className="max-w-6xl mx-auto relative z-10">
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6 }}
          viewport={{ once: true }}
          className="text-center mb-12"
        >
          <h2 className="text-4xl md:text-5xl font-bold mb-4">
            <span className="gradient-text">Featured Projects</span>
          </h2>
          <p className="text-gray-400 text-lg">
            Building scalable systems from mobile apps to distributed databases
          </p>
        </motion.div>

        <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
          {projects.map((project, index) => (
            <ProjectCard key={project.id} {...project} delay={0.1 * index} />
          ))}
        </div>

        <motion.div
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6, delay: 0.4 }}
          viewport={{ once: true }}
          className="text-center mt-12"
        >
          <motion.a
            href="#"
            whileHover={{ scale: 1.05 }}
            whileTap={{ scale: 0.95 }}
            className="inline-flex items-center gap-2 px-6 py-3 border-2 border-accent text-accent font-semibold rounded-lg hover:bg-accent/10 transition-colors cursor-pointer"
          >
            View All Projects <ExternalLink size={18} />
          </motion.a>
        </motion.div>
      </div>
    </section>
  );
};

export default Projects3D;
