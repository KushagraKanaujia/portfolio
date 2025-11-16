"use client";

import { useEffect, useState } from "react";
import { motion } from "framer-motion";

const SECTIONS = ["home", "about", "experience", "skills", "projects", "contact"];

export default function NavigationBar() {
  const [active, setActive] = useState("home");
  const [scrolled, setScrolled] = useState(false);

  useEffect(() => {
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
      transition={{ duration: 0.4, delay: 0.2 }}
      role="navigation"
      aria-label="Main navigation"
      className={`fixed top-0 left-0 right-0 transition-all duration-300 ${
        scrolled
          ? "bg-black/90 backdrop-blur-2xl border-b border-white/20 shadow-lg shadow-black/50"
          : "bg-black/40 backdrop-blur-md"
      }`}
      style={{
        zIndex: 100,
        display: 'flex',
        justifyContent: 'flex-end',
        alignItems: 'center',
        padding: '0 32px'
      }}
    >
      <div
        style={{
          display: 'flex',
          gap: '40px',
          alignItems: 'center',
          height: '80px'
        }}
      >
        {["About", "Experience", "Skills", "Projects"].map((section) => (
          <button
            key={section}
            onClick={() => scrollToSection(section.toLowerCase())}
            aria-label={`Navigate to ${section} section`}
            aria-current={active === section.toLowerCase() ? "page" : undefined}
            style={{
              fontSize: '24px',
              fontWeight: 'bold',
              color: active === section.toLowerCase() ? '#00d9ff' : 'white',
              background: 'none',
              border: 'none',
              cursor: 'pointer',
              transition: 'all 0.2s',
              position: 'relative'
            }}
            onMouseEnter={(e) => {
              if (active !== section.toLowerCase()) {
                e.currentTarget.style.color = '#00d9ff';
                e.currentTarget.style.transform = 'scale(1.05)';
              }
            }}
            onMouseLeave={(e) => {
              if (active !== section.toLowerCase()) {
                e.currentTarget.style.color = 'white';
                e.currentTarget.style.transform = 'scale(1)';
              }
            }}
          >
            {section}
            {active === section.toLowerCase() && (
              <motion.div
                layoutId="activeSection"
                style={{
                  position: 'absolute',
                  bottom: '-4px',
                  left: 0,
                  right: 0,
                  height: '2px',
                  background: '#00d9ff',
                  borderRadius: '9999px'
                }}
                transition={{ type: "spring", stiffness: 380, damping: 30 }}
              />
            )}
          </button>
        ))}
      </div>
    </motion.nav>
  );
}
