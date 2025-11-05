"use client";

import { motion } from "framer-motion";
import { Briefcase, GraduationCap, Code } from "lucide-react";

interface ExperienceItemProps {
  icon: React.ReactNode;
  title: string;
  company: string;
  period: string;
  description: string[];
  tech: string[];
  index: number;
}

const ExperienceItem = ({
  icon,
  title,
  company,
  period,
  description,
  tech,
  index,
}: ExperienceItemProps) => {
  const isEven = index % 2 === 0;

  return (
    <motion.div
      initial={{ opacity: 0, x: isEven ? -50 : 50 }}
      whileInView={{ opacity: 1, x: 0 }}
      transition={{ duration: 0.6, delay: 0.1 * index }}
      viewport={{ once: true }}
      className="relative"
    >
      {/* Timeline dot */}
      <div className="absolute left-1/2 transform -translate-x-1/2 w-4 h-4 bg-accent rounded-full border-4 border-background z-10"></div>

      {/* Content */}
      <div
        className={`flex ${
          isEven ? "md:flex-row" : "md:flex-row-reverse"
        } flex-col gap-8 items-center`}
      >
        {/* Left/Right space */}
        <div className="md:w-1/2"></div>

        {/* Card */}
        <div className="md:w-1/2 w-full">
          <motion.div
            whileHover={{ scale: 1.02 }}
            className="glow-card bg-card border border-card-border rounded-lg p-6"
          >
            <div className="flex items-start gap-3 mb-3">
              <div className="text-accent mt-1">{icon}</div>
              <div>
                <h3 className="text-xl font-bold text-gray-200">{title}</h3>
                <p className="text-accent font-semibold">{company}</p>
                <p className="text-sm text-gray-400">{period}</p>
              </div>
            </div>

            <ul className="space-y-2 mb-4">
              {description.map((item, idx) => (
                <li key={idx} className="text-gray-300 text-sm flex items-start">
                  <span className="text-accent mr-2 mt-1">▸</span>
                  <span>{item}</span>
                </li>
              ))}
            </ul>

            <div className="flex flex-wrap gap-2">
              {tech.map((t) => (
                <span
                  key={t}
                  className="px-2 py-1 bg-background border border-card-border rounded text-xs text-gray-400"
                >
                  {t}
                </span>
              ))}
            </div>
          </motion.div>
        </div>
      </div>
    </motion.div>
  );
};

const Experience = () => {
  const experiences = [
    {
      icon: <Briefcase size={24} />,
      title: "ML Research Intern",
      company: "Visual Layer",
      period: "June 2024 - Present",
      description: [
        "Building ML observability tools for production model monitoring",
        "Developed data drift detection algorithms reducing false alerts by 40%",
        "Implemented automated feature engineering pipeline processing 1M+ samples/day",
      ],
      tech: ["Python", "PyTorch", "FastAPI", "PostgreSQL", "Docker"],
    },
    {
      icon: <Code size={24} />,
      title: "Full-Stack Engineer",
      company: "ApexTrade (Side Project)",
      period: "Jan 2024 - Present",
      description: [
        "Architected trading platform serving 2M+ API requests monthly at 99.9% uptime",
        "Built real-time WebSocket system for live market data with <150ms latency",
        "Implemented ML recommendation engine improving trade accuracy by 25%",
      ],
      tech: ["Next.js", "Node.js", "PostgreSQL", "Redis", "AWS", "TensorFlow"],
    },
    {
      icon: <Code size={24} />,
      title: "iOS Developer",
      company: "Dawdle",
      period: "Sep 2023 - May 2024",
      description: [
        "Built real-time matching algorithm connecting 500+ active users",
        "Integrated Firebase & Google Maps API for location-based features",
        "Achieved 95% user satisfaction through iterative UX improvements",
      ],
      tech: ["Swift", "Firebase", "Node.js", "WebSocket", "Google Maps API"],
    },
    {
      icon: <GraduationCap size={24} />,
      title: "B.S. Computer Science",
      company: "UC Santa Barbara",
      period: "2022 - 2026",
      description: [
        "Relevant Coursework: Machine Learning, Computer Vision, Databases, Operating Systems",
        "Teaching Assistant for CS16: Problem Solving with Computers",
        "Active in CS clubs and hackathons",
      ],
      tech: ["C++", "Python", "Java", "Algorithms", "Systems"],
    },
  ];

  return (
    <section className="py-20 px-4 bg-background">
      <div className="max-w-6xl mx-auto">
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6 }}
          viewport={{ once: true }}
          className="text-center mb-16"
        >
          <h2 className="text-4xl md:text-5xl font-bold mb-4">
            <span className="gradient-text">Experience</span>
          </h2>
          <p className="text-gray-400 text-lg">
            My journey in tech and continuous learning
          </p>
        </motion.div>

        {/* Timeline line */}
        <div className="relative">
          <div className="hidden md:block absolute left-1/2 transform -translate-x-1/2 w-0.5 h-full bg-card-border"></div>

          <div className="space-y-12">
            {experiences.map((exp, index) => (
              <ExperienceItem key={exp.title} {...exp} index={index} />
            ))}
          </div>
        </div>
      </div>
    </section>
  );
};

export default Experience;
