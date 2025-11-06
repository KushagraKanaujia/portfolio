"use client";

import { motion } from "framer-motion";
import { Brain, Code, Database, Cloud } from "lucide-react";

const SkillCardsCinematic = () => {
  const skills = [
    {
      icon: Brain,
      title: "ML Engineering",
      proficiency: 95,
      gradient: "from-cyan-400 to-blue-500",
      skills: ["PyTorch", "TensorFlow", "CNNs", "Distributed Training"],
    },
    {
      icon: Code,
      title: "Full-Stack",
      proficiency: 90,
      gradient: "from-purple-400 to-pink-500",
      skills: ["React", "Next.js", "Node.js", "TypeScript"],
    },
    {
      icon: Database,
      title: "System Architecture",
      proficiency: 88,
      gradient: "from-orange-400 to-red-500",
      skills: ["Microservices", "B+ Trees", "MVCC", "Query Optimization"],
    },
    {
      icon: Cloud,
      title: "Cloud & DevOps",
      proficiency: 85,
      gradient: "from-green-400 to-emerald-500",
      skills: ["AWS", "Docker", "Kubernetes", "CI/CD"],
    },
  ];

  return (
    <section className="section-100vh bg-gradient-to-b from-black via-neutral-950 to-black">
      <div className="w-full max-w-7xl mx-auto px-4">
        {/* Section Title */}
        <motion.div
          initial={{ opacity: 0, y: 30 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ duration: 0.8 }}
          className="text-center mb-20"
        >
          <h2 className="text-4xl md:text-6xl font-bold gradient-text-apple mb-4">
            Core Competencies
          </h2>
          <p className="text-lg md:text-xl text-gray-400">
            Building at the intersection of AI, systems, and scale
          </p>
        </motion.div>

        {/* Skills Grid */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
          {skills.map((skill, index) => (
            <motion.div
              key={index}
              initial={{ opacity: 0, y: 50 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{
                duration: 0.6,
                delay: index * 0.1,
                ease: [0.16, 1, 0.3, 1],
              }}
              whileHover={{
                y: -10,
                transition: { duration: 0.2 },
              }}
              className="relative group"
            >
              {/* Glow Effect */}
              <div
                className={`absolute inset-0 bg-gradient-to-r ${skill.gradient} opacity-0 group-hover:opacity-30 blur-2xl transition-opacity duration-300 rounded-3xl`}
              />

              {/* Card */}
              <div className="relative glass-card p-8 h-full flex flex-col">
                {/* Icon */}
                <div
                  className={`w-16 h-16 mb-6 rounded-2xl bg-gradient-to-br ${skill.gradient} flex items-center justify-center mx-auto`}
                >
                  <skill.icon className="w-8 h-8 text-white" />
                </div>

                {/* Title */}
                <h3 className="text-xl font-bold text-white mb-4 text-center">
                  {skill.title}
                </h3>

                {/* Proficiency Bar */}
                <div className="mb-6">
                  <div className="flex justify-between items-center mb-2">
                    <span className="text-sm text-gray-400">Proficiency</span>
                    <span className={`text-sm font-bold bg-gradient-to-r ${skill.gradient} bg-clip-text text-transparent`}>
                      {skill.proficiency}%
                    </span>
                  </div>
                  <div className="h-2 bg-gray-800 rounded-full overflow-hidden">
                    <motion.div
                      initial={{ width: 0 }}
                      whileInView={{ width: `${skill.proficiency}%` }}
                      viewport={{ once: true }}
                      transition={{ duration: 1, delay: index * 0.1 + 0.5 }}
                      className={`h-full bg-gradient-to-r ${skill.gradient} rounded-full`}
                    />
                  </div>
                </div>

                {/* Skills List */}
                <div className="space-y-2 flex-grow">
                  {skill.skills.map((item, i) => (
                    <motion.div
                      key={i}
                      initial={{ opacity: 0, x: -20 }}
                      whileInView={{ opacity: 1, x: 0 }}
                      viewport={{ once: true }}
                      transition={{ delay: index * 0.1 + i * 0.05 + 0.6 }}
                      className="text-sm text-gray-400 flex items-center gap-2"
                    >
                      <span className="w-1.5 h-1.5 rounded-full bg-accent" />
                      {item}
                    </motion.div>
                  ))}
                </div>
              </div>
            </motion.div>
          ))}
        </div>
      </div>
    </section>
  );
};

export default SkillCardsCinematic;
