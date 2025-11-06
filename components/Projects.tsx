"use client";

import { motion } from "framer-motion";
import { ExternalLink, Github, Code2 } from "lucide-react";
import Image from "next/image";

interface ProjectProps {
  title: string;
  description: string;
  tech: string[];
  metrics: string[];
  github?: string;
  live?: string;
  delay?: number;
  image?: string;
}

const ProjectCard = ({
  title,
  description,
  tech,
  metrics,
  github,
  live,
  delay = 0,
  image,
}: ProjectProps) => {
  return (
    <motion.div
      initial={{ opacity: 0, y: 30 }}
      whileInView={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.6, delay }}
      viewport={{ once: true }}
      className="glow-card bg-card border border-accent/20 rounded-xl overflow-hidden hover:border-accent/50 transition-all duration-300 group"
    >
      {/* Project Image */}
      <div className="relative h-48 w-full overflow-hidden bg-gradient-to-br from-accent/10 via-accent-blue/10 to-purple-500/10">
        {image ? (
          <Image
            src={image}
            alt={title}
            fill
            className="object-cover group-hover:scale-110 transition-transform duration-500"
          />
        ) : (
          <div className="w-full h-full flex items-center justify-center">
            <Code2 className="w-16 h-16 text-accent/30" />
          </div>
        )}
        {/* Overlay gradient */}
        <div className="absolute inset-0 bg-gradient-to-t from-card via-card/50 to-transparent opacity-60"></div>
      </div>

      <div className="p-6">
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
              className="px-3 py-1 bg-background/50 border border-accent/20 rounded-full text-xs text-accent font-medium"
            >
              {t}
            </span>
          ))}
        </div>
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
      image: "/dawdle.jpg",
    },
    {
      title: "Visual Layer ML Platform",
      description:
        "ML data quality platform with computer vision pipelines for dataset validation and model training optimization. Processing millions of images with automated quality checks.",
      tech: ["Python", "PyTorch", "FastAPI", "React", "PostgreSQL", "AWS"],
      metrics: [
        "10M+ images processed",
        "98% accuracy in quality detection",
        "50% faster training cycles",
      ],
      github: "#",
      live: "#",
      image: "/visual-layer.jpg",
    },
    {
      title: "NSight Analytics",
      description:
        "Real-time analytics dashboard with data visualization, predictive modeling, and automated insights. Handling massive datasets with sub-second query response times.",
      tech: ["Next.js", "PostgreSQL", "Redis", "Python", "TensorFlow", "AWS"],
      metrics: [
        "2M+ monthly API requests",
        "99.9% uptime SLA",
        "150ms avg response time",
      ],
      github: "#",
      live: "#",
      image: "/nsight.jpg",
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
