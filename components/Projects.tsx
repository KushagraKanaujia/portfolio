"use client";

import { motion } from "framer-motion";
import { Github } from "lucide-react";

interface Project {
  title: string;
  description: string;
  tags: string[];
  github: string;
}

const projects: Project[] = [
  {
    title: "QUASAR EEG/ECG Visualization Tool",
    description: "Developed advanced medical data visualization application for analyzing EEG and ECG signals. Built interactive real-time waveform displays with signal processing capabilities including filtering, baseline correction, and artifact detection. Implemented multi-channel data streaming, time-series analysis, and annotation features. Engineered efficient rendering algorithms for handling high-frequency biosignal data with minimal latency.",
    tags: ["Python", "Signal Processing", "Data Visualization", "Medical Tech", "Real-time Systems"],
    github: "https://github.com/KushagraKanaujia/quasar-eeg-viewer",
  },
  {
    title: "Automated Trading Bot",
    description: "Created Python-based algorithmic trading system with machine learning models for market prediction and automated execution. Integrated real-time financial APIs, implemented risk management algorithms, and backtesting framework. Utilized pandas, NumPy for data analysis, scikit-learn for predictive modeling. Achieved consistent returns through technical indicators and sentiment analysis integration.",
    tags: ["Python", "Machine Learning", "APIs", "pandas", "scikit-learn"],
    github: "https://github.com/KushagraKanaujia/trading-bot",
  },
  {
    title: "Movie Recommendation Engine",
    description: "Built intelligent movie recommendation system using collaborative filtering and content-based algorithms. Processed large datasets with pandas, implemented cosine similarity matrices for personalized suggestions. Developed RESTful API endpoints, integrated with movie databases, and created responsive web interface. Applied natural language processing for genre classification and user preference analysis.",
    tags: ["Python", "ML/AI", "Data Science", "NLP", "RESTful API"],
    github: "https://github.com/KushagraKanaujia/Movie-Recommender-System",
  },
];

export default function Projects() {
  return (
    <section
      id="projects"
      className="min-h-screen flex items-center bg-black py-20 relative overflow-hidden scroll-mt-20"
    >
      {/* Content background for visibility */}
      <div className="absolute inset-0 flex items-center justify-center pointer-events-none">
        <div className="w-full max-w-5xl min-h-[80vh] bg-black/60 backdrop-blur-sm rounded-3xl border border-white/5" />
      </div>

      <div className="w-full max-w-5xl mx-auto px-4 relative z-10">
        {/* Section Title */}
        <motion.h2
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ duration: 0.6 }}
          className="font-bold text-center mb-16"
          style={{
            fontSize: '2.5rem',
            color: '#FFFFFF',
            textShadow: '0 0 25px rgba(255,255,255,0.8), 0 0 15px rgba(255,255,255,0.5)',
            filter: 'brightness(1.2)'
          }}
        >
          Featured Projects
        </motion.h2>

        {/* Timeline Container */}
        <div className="relative">
          {/* Vertical Line */}
          <div className="absolute left-0 md:left-1/2 top-0 bottom-0 w-0.5 bg-gradient-to-b from-cyan-400 via-blue-500 to-cyan-400 transform md:-translate-x-1/2" />

          {/* Project Items */}
          <div className="space-y-12">
            {projects.map((project, index) => (
              <motion.div
                key={index}
                initial={{ opacity: 0, y: 30 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true }}
                transition={{ duration: 0.6, delay: index * 0.2 }}
                className="relative"
              >
                {/* Timeline Dot */}
                <div className="absolute left-0 md:left-1/2 w-4 h-4 bg-cyan-400 rounded-full border-4 border-black transform md:-translate-x-1/2 shadow-lg shadow-cyan-400/50" />

                {/* Content Card */}
                <div className={`ml-8 md:ml-0 ${index % 2 === 0 ? 'md:mr-auto md:pr-12' : 'md:ml-auto md:pl-12'} md:w-1/2`}>
                  {/* Project Title */}
                  <motion.h3
                    initial={{ opacity: 0, x: index % 2 === 0 ? -20 : 20 }}
                    whileInView={{ opacity: 1, x: 0 }}
                    viewport={{ once: true }}
                    transition={{ duration: 0.5, delay: index * 0.2 + 0.3 }}
                    className="font-bold mb-3"
                    style={{
                      fontSize: '1.3rem',
                      color: '#FFFFFF',
                      textShadow: '0 0 25px rgba(255,255,255,0.8), 0 0 15px rgba(255,255,255,0.5)',
                      filter: 'brightness(1.2)'
                    }}
                  >
                    {project.title}
                  </motion.h3>

                  {/* Description */}
                  <motion.p
                    initial={{ opacity: 0, x: index % 2 === 0 ? -20 : 20 }}
                    whileInView={{ opacity: 1, x: 0 }}
                    viewport={{ once: true }}
                    transition={{ duration: 0.5, delay: index * 0.2 + 0.4 }}
                    className="font-medium mb-4"
                    style={{
                      fontSize: '1rem',
                      lineHeight: '1.7',
                      color: '#FFFFFF',
                      textShadow: '0 0 25px rgba(255,255,255,0.8), 0 0 15px rgba(255,255,255,0.5)',
                      filter: 'brightness(1.2)'
                    }}
                  >
                    {project.description}
                  </motion.p>

                  {/* Tags */}
                  <motion.div
                    initial={{ opacity: 0, x: index % 2 === 0 ? -20 : 20 }}
                    whileInView={{ opacity: 1, x: 0 }}
                    viewport={{ once: true }}
                    transition={{ duration: 0.5, delay: index * 0.2 + 0.5 }}
                    className="flex flex-wrap gap-2 mb-3"
                  >
                    {project.tags.map((tag, tagIndex) => (
                      <span
                        key={tagIndex}
                        className="px-3 py-1 text-xs font-semibold rounded-full bg-orange-400/20 text-orange-300"
                      >
                        {tag}
                      </span>
                    ))}
                  </motion.div>

                  {/* GitHub Link */}
                  <motion.a
                    initial={{ opacity: 0, x: index % 2 === 0 ? -20 : 20 }}
                    whileInView={{ opacity: 1, x: 0 }}
                    viewport={{ once: true }}
                    transition={{ duration: 0.5, delay: index * 0.2 + 0.6 }}
                    href={project.github}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="inline-flex items-center gap-2 font-semibold hover:scale-110 transition-transform"
                    style={{
                      fontSize: '0.9rem',
                      color: '#fb923c',
                      textShadow: '0 0 15px rgba(251,146,60,0.6)',
                    }}
                  >
                    <Github className="w-5 h-5" />
                    View on GitHub →
                  </motion.a>
                </div>
              </motion.div>
            ))}
          </div>
        </div>
      </div>
    </section>
  );
}
