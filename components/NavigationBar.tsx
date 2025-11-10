"use client";

import { useEffect, useState } from "react";
import { motion } from "framer-motion";

const SECTIONS = ["home", "about", "experience", "skills", "projects", "contact"];

export default function NavigationBar() {
  const [active, setActive] = useState("home");
  const [scrolled, setScrolled] = useState(false);

  useEffect(() => {
    // Scrollspy
    const observer = new IntersectionObserver(
      (entries) => {
        entries.forEach((entry) => {
          if (entry.isIntersecting) {
            setActive(entry.target.id);
          }
        });
      },
      {
        rootMargin: "-40% 0px -55% 0px",
        threshold: 0.01,
      }
    );

    SECTIONS.forEach((id) => {
      const element = document.getElementById(id);
      if (element) observer.observe(element);
    });

    // Scroll detection
    const handleScroll = () => {
      setScrolled(window.scrollY > 50);
    };

    window.addEventListener("scroll", handleScroll);

    return () => {
      observer.disconnect();
      window.removeEventListener("scroll", handleScroll);
    };
  }, []);

  const scrollToSection = (id: string) => {
    const element = document.getElementById(id);
    if (element) {
      element.scrollIntoView({ behavior: "smooth", block: "start" });
    }
  };

  return (
    <motion.nav
      initial={{ y: -100 }}
      animate={{ y: 0 }}
      transition={{ duration: 0.3 }}
      className={`fixed top-0 left-0 right-0 z-50 transition-all duration-300 ${
        scrolled
          ? "bg-black/80 backdrop-blur-xl border-b border-white/10"
          : "bg-transparent"
      }`}
    >
      <div className="max-w-7xl mx-auto px-6 sm:px-8">
        <div className="flex h-20 items-center justify-end gap-4">
          {/* Section Navigation Links */}
          <div className="flex items-center gap-6 sm:gap-8">
            {["About", "Experience", "Skills", "Projects"].map((section) => (
              <button
                key={section}
                onClick={() => scrollToSection(section.toLowerCase())}
                className={`text-base sm:text-lg font-medium transition-all ${
                  active === section.toLowerCase()
                    ? "text-accent"
                    : "text-white/80 hover:text-white"
                }`}
              >
                {section}
              </button>
            ))}
          </div>
        </div>
      </div>
    </motion.nav>
  );
}
