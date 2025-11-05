"use client";

import { motion } from "framer-motion";
import { ExternalLink, Github } from "lucide-react";

interface ProjectProps {
  title: string;
  description: string;
  tech: string[];
  metrics: string[];
  github?: string;
  live?: string;
  delay?: number;
}

const ProjectCard = ({
  title,
  description,
  tech,
  metrics,
  github,
  live,
  delay = 0,
}: ProjectProps) => {
  return (
    <motion.div
      initial={{ opacity: 0, y: 30 }}
      whileInView={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.6, delay }}
      viewport={{ once: true }}
      className="glow-card bg-card border border-card-border rounded-lg p-6 hover:border-accent/50 transition-all duration-300"
    >
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

      <div className="flex flex-wrap gap-2">
        {tech.map((t) => (
          <span
            key={t}
            className="px-3 py-1 bg-background border border-card-border rounded-full text-xs text-accent"
          >
            {t}
          </span>
        ))}
      </div>
    </motion.div>
  );
};

const Projects = () => {
  const projects = [
    {
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
    },
    {
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
    },
    {
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
    },
  ];

  return (
    <section id="projects" className="py-20 px-4 bg-background">
      <div className="max-w-6xl mx-auto">
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
            <ProjectCard key={project.title} {...project} delay={0.1 * index} />
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

export default Projects;
