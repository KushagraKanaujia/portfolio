"use client";

import { useEffect, useState } from "react";
import { motion, AnimatePresence } from "framer-motion";

const SECTIONS = [
  { id: "home", label: "Home", icon: "🏠" },
  { id: "about", label: "About", icon: "👤" },
  { id: "experience", label: "Experience", icon: "💼" },
  { id: "skills", label: "Skills", icon: "⚡" },
  { id: "contact", label: "Contact", icon: "📧" },
];

export default function SectionNav() {
  const [activeSection, setActiveSection] = useState("home");
  const [isVisible, setIsVisible] = useState(false);

  useEffect(() => {
    // Show navigation after page loads
    setIsVisible(true);

    // Intersection Observer for active section detection
    const observer = new IntersectionObserver(
      (entries) => {
        entries.forEach((entry) => {
          if (entry.isIntersecting) {
            setActiveSection(entry.target.id);
          }
        });
      },
      {
        rootMargin: "-40% 0px -55% 0px",
        threshold: 0.01,
      }
    );

    SECTIONS.forEach(({ id }) => {
      const element = document.getElementById(id);
      if (element) observer.observe(element);
    });

    return () => observer.disconnect();
  }, []);

  const scrollToSection = (id: string) => {
    const element = document.getElementById(id);
    if (element) {
      element.scrollIntoView({ behavior: "smooth", block: "start" });
    }
  };

  return (
    <AnimatePresence>
      {isVisible && (
        <motion.div
          initial={{ opacity: 0, x: 50 }}
          animate={{ opacity: 1, x: 0 }}
          exit={{ opacity: 0, x: 50 }}
          transition={{ duration: 0.5, delay: 0.3 }}
          className="fixed right-6 top-1/2 -translate-y-1/2 z-40 hidden xl:block"
        >
          <div className="glass-card rounded-2xl p-4 space-y-2 border border-white/10">
            {SECTIONS.map(({ id, label, icon }, index) => (
              <motion.button
                key={id}
                onClick={() => scrollToSection(id)}
                initial={{ opacity: 0, x: 20 }}
                animate={{ opacity: 1, x: 0 }}
                transition={{ delay: 0.4 + index * 0.1 }}
                className={`group relative flex items-center gap-3 w-full px-4 py-2.5 rounded-xl transition-all duration-300 ${
                  activeSection === id
                    ? "bg-gradient-to-r from-purple-500/20 to-pink-500/20 text-white"
                    : "text-gray-400 hover:text-white hover:bg-white/5"
                }`}
              >
                {/* Icon */}
                <span className="text-xl">{icon}</span>

                {/* Label - shows on hover */}
                <motion.span
                  initial={{ width: 0, opacity: 0 }}
                  animate={{
                    width: activeSection === id ? "auto" : 0,
                    opacity: activeSection === id ? 1 : 0,
                  }}
                  className="text-sm font-medium overflow-hidden whitespace-nowrap"
                >
                  {label}
                </motion.span>

                {/* Hover label tooltip */}
                <div className="absolute right-full mr-3 px-3 py-1.5 bg-black/90 backdrop-blur-sm rounded-lg text-sm font-medium whitespace-nowrap opacity-0 group-hover:opacity-100 pointer-events-none transition-opacity">
                  {label}
                  <div className="absolute right-0 top-1/2 -translate-y-1/2 translate-x-1/2 rotate-45 w-2 h-2 bg-black/90" />
                </div>

                {/* Active indicator */}
                {activeSection === id && (
                  <motion.div
                    layoutId="activeIndicator"
                    className="absolute left-0 top-1/2 -translate-y-1/2 w-1 h-8 bg-gradient-to-b from-purple-500 to-pink-500 rounded-full"
                    transition={{ type: "spring", stiffness: 380, damping: 30 }}
                  />
                )}
              </motion.button>
            ))}

            {/* Progress indicator */}
            <div className="pt-2 mt-2 border-t border-white/10">
              <div className="flex justify-center items-center gap-1">
                {SECTIONS.map(({ id }) => (
                  <motion.div
                    key={id}
                    className={`h-1 rounded-full transition-all duration-300 ${
                      activeSection === id ? "w-6 bg-accent" : "w-1 bg-gray-600"
                    }`}
                  />
                ))}
              </div>
            </div>
          </div>
        </motion.div>
      )}
    </AnimatePresence>
  );
}
