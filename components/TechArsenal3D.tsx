"use client";

import { motion } from "framer-motion";
import { Code2, Database, Cloud, Brain, Workflow, Terminal, Sparkles } from "lucide-react";
import { useState, Suspense } from "react";
import dynamic from "next/dynamic";

const SkillsGalaxy3D = dynamic(() => import("./SkillsGalaxy3D"), {
  ssr: false,
  loading: () => (
    <div className="w-full h-[600px] flex items-center justify-center bg-card rounded-lg">
      <div className="text-accent animate-pulse">Loading Skills Galaxy...</div>
    </div>
  ),
});

interface TechCategoryProps {
  icon: React.ReactNode;
  title: string;
  techs: string[];
  delay?: number;
}

const TechCategory = ({ icon, title, techs, delay = 0 }: TechCategoryProps) => {
  return (
    <motion.div
      initial={{ opacity: 0, scale: 0.9 }}
      whileInView={{ opacity: 1, scale: 1 }}
      transition={{ duration: 0.5, delay }}
      viewport={{ once: true }}
      className="glow-card bg-card border border-card-border rounded-lg p-6 hover:border-accent/50 transition-all duration-300"
    >
      <div className="flex items-center gap-3 mb-4">
        <div className="text-accent">{icon}</div>
        <h3 className="text-xl font-bold text-gray-200">{title}</h3>
      </div>
      <div className="flex flex-wrap gap-2">
        {techs.map((tech) => (
          <motion.span
            key={tech}
            whileHover={{ scale: 1.05, y: -2 }}
            className="px-3 py-1.5 bg-background border border-card-border rounded-md text-sm text-gray-300 hover:border-accent/50 hover:text-accent transition-all cursor-default"
          >
            {tech}
          </motion.span>
        ))}
      </div>
    </motion.div>
  );
};

const TechArsenal3D = () => {
  const [view3D, setView3D] = useState(false);

  const techCategories = [
    {
      icon: <Brain size={24} />,
      title: "Machine Learning",
      techs: ["PyTorch", "TensorFlow", "Scikit-learn", "Pandas", "NumPy", "OpenCV"],
    },
    {
      icon: <Code2 size={24} />,
      title: "Frontend",
      techs: ["React", "Next.js", "TypeScript", "Tailwind", "Framer Motion"],
    },
    {
      icon: <Terminal size={24} />,
      title: "Backend",
      techs: ["Node.js", "Python", "Go", "FastAPI", "Express", "GraphQL"],
    },
    {
      icon: <Database size={24} />,
      title: "Databases",
      techs: ["PostgreSQL", "MongoDB", "Redis", "Pinecone", "Supabase"],
    },
    {
      icon: <Cloud size={24} />,
      title: "Cloud & DevOps",
      techs: ["AWS", "Docker", "Kubernetes", "CI/CD", "Vercel", "Nginx"],
    },
    {
      icon: <Workflow size={24} />,
      title: "Tools & Systems",
      techs: ["Git", "Linux", "C++", "Rust", "WebSocket", "gRPC"],
    },
  ];

  return (
    <section className="py-20 px-4 relative">
      {/* Decorative background */}
      <div className="absolute top-0 left-1/2 transform -translate-x-1/2 w-96 h-96 bg-accent/5 rounded-full blur-3xl"></div>

      <div className="max-w-6xl mx-auto relative z-10">
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6 }}
          viewport={{ once: true }}
          className="text-center mb-8"
        >
          <h2 className="text-4xl md:text-5xl font-bold mb-4">
            <span className="gradient-text">Tech Arsenal</span>
          </h2>
          <p className="text-gray-400 text-lg mb-6">
            Full-stack mastery across the modern technology landscape
          </p>

          {/* Toggle view button */}
          <motion.button
            onClick={() => setView3D(!view3D)}
            whileHover={{ scale: 1.05 }}
            whileTap={{ scale: 0.95 }}
            className="inline-flex items-center gap-2 px-6 py-3 bg-accent/10 border border-accent text-accent rounded-lg hover:bg-accent/20 transition-colors font-semibold mb-8"
          >
            <Sparkles size={20} />
            {view3D ? "Grid View" : "3D Galaxy View"}
          </motion.button>
        </motion.div>

        {view3D ? (
          <motion.div
            initial={{ opacity: 0, scale: 0.9 }}
            animate={{ opacity: 1, scale: 1 }}
            transition={{ duration: 0.6 }}
            className="mb-12"
          >
            <Suspense
              fallback={
                <div className="w-full h-[600px] flex items-center justify-center bg-card rounded-lg">
                  <div className="text-accent animate-pulse">Initializing Skills Galaxy...</div>
                </div>
              }
            >
              <SkillsGalaxy3D />
            </Suspense>
            <p className="text-center text-gray-400 mt-4">
              <span className="text-accent">Drag</span> to rotate • <span className="text-accent">Scroll</span> to zoom • <span className="text-accent">Hover</span> nodes to explore connections
            </p>
          </motion.div>
        ) : (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6 mb-12">
            {techCategories.map((category, index) => (
              <TechCategory
                key={category.title}
                {...category}
                delay={0.1 * index}
              />
            ))}
          </div>
        )}

        {/* Command Palette Style Section */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6, delay: 0.6 }}
          viewport={{ once: true }}
          className="terminal"
        >
          <div className="flex items-center gap-2 mb-4">
            <div className="w-3 h-3 rounded-full bg-red-500"></div>
            <div className="w-3 h-3 rounded-full bg-yellow-500"></div>
            <div className="w-3 h-3 rounded-full bg-green-500"></div>
            <span className="ml-2 text-gray-400 text-sm">~/skills</span>
          </div>
          <div className="space-y-2 font-mono text-sm">
            <p className="text-accent">
              <span className="text-gray-500">$</span> cat expertise.txt
            </p>
            <p className="text-gray-300 pl-4">
              ▸ Architecting scalable ML systems with PyTorch & TensorFlow
            </p>
            <p className="text-gray-300 pl-4">
              ▸ Building high-performance full-stack apps with Next.js & Node.js
            </p>
            <p className="text-gray-300 pl-4">
              ▸ Designing distributed systems handling millions of requests
            </p>
            <p className="text-gray-300 pl-4">
              ▸ Implementing DBMS internals & low-level systems in C++
            </p>
            <p className="text-accent mt-4">
              <span className="text-gray-500">$</span> uptime
              <span className="animate-pulse ml-2">|</span>
            </p>
          </div>
        </motion.div>
      </div>
    </section>
  );
};

export default TechArsenal3D;
