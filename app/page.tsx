"use client";

import dynamic from "next/dynamic";
import NavigationBar from "@/components/NavigationBar";
import ScrollProgress from "@/components/ScrollProgress";
import FadeInView from "@/components/FadeInView";

// Lazy load heavy components for better performance
const FullScreenNeuralHero = dynamic(() => import("@/components/FullScreenNeuralHero"), {
  ssr: false,
  loading: () => <div className="min-h-screen bg-black" />,
});

const CustomCursor = dynamic(() => import("@/components/CustomCursor"), {
  ssr: false,
});

const EasterEggs = dynamic(() => import("@/components/EasterEggs"), {
  ssr: false,
});

const PerformanceMonitor = dynamic(() => import("@/components/PerformanceMonitor"), {
  ssr: false,
});

const CurrentRole = dynamic(() => import("@/components/CurrentRole"));
const AboutCinematic = dynamic(() => import("@/components/AboutCinematic"));
const WorkExperience = dynamic(() => import("@/components/WorkExperience"));
const SkillsWithLogos = dynamic(() => import("@/components/SkillsWithLogos"));
const Projects = dynamic(() => import("@/components/Projects"));
const CTACinematic = dynamic(() => import("@/components/CTACinematic"));
const AnimatedDivider = dynamic(() => import("@/components/AnimatedDivider"));
const StaticNeuralBackground = dynamic(() => import("@/components/StaticNeuralBackground"), {
  ssr: false,
});

export default function Home() {
  return (
    <main className="relative bg-black text-white overflow-x-hidden">
      {/* Static Neural Network Background - Throughout entire site */}
      <StaticNeuralBackground />

      {/* Unique Features */}
      <ScrollProgress />
      <NavigationBar />
      <CustomCursor />

      {/* Section 1: FULL-SCREEN Neural Network Hero with Scattering Dots - ANIMATED */}
      <div className="relative z-10">
        <FullScreenNeuralHero />
      </div>

      {/* Section 2: About Me - Photo Left, Text Right */}
      <div className="relative" style={{ zIndex: 20 }}>
        <FadeInView>
          <AboutCinematic />
        </FadeInView>
      </div>

      <div className="relative" style={{ zIndex: 20 }}>
        <AnimatedDivider />
      </div>

      {/* Section 3: Work Experience - Timeline */}
      <div className="relative" style={{ zIndex: 20 }}>
        <FadeInView>
          <WorkExperience />
        </FadeInView>
      </div>

      <div className="relative" style={{ zIndex: 20 }}>
        <AnimatedDivider />
      </div>

      {/* Section 4: Current Role - Floating 3D Card */}
      <div className="relative" style={{ zIndex: 20 }}>
        <FadeInView direction="left" delay={0.2}>
          <CurrentRole />
        </FadeInView>
      </div>

      <div className="relative" style={{ zIndex: 20 }}>
        <AnimatedDivider />
      </div>

      {/* Section 5: Skills - With Tech Logos & Animations */}
      <div className="relative" style={{ zIndex: 20 }}>
        <FadeInView>
          <SkillsWithLogos />
        </FadeInView>
      </div>

      <div className="relative" style={{ zIndex: 20 }}>
        <AnimatedDivider />
      </div>

      {/* Section 6: Projects - Featured GitHub Projects */}
      <div className="relative" style={{ zIndex: 20 }}>
        <FadeInView>
          <Projects />
        </FadeInView>
      </div>

      <div className="relative" style={{ zIndex: 20 }}>
        <AnimatedDivider />
      </div>

      {/* Section 7: Call to Action - Minimal & Powerful */}
      <section id="contact" className="relative" style={{ zIndex: 20 }}>
        <CTACinematic />
      </section>

      {/* Footer */}
      <footer className="relative py-12 text-center text-pink-500 text-sm border-t border-pink-800" style={{ zIndex: 20 }}>
        <p>© 2025 Kushagra Kanaujia</p>
      </footer>
    </main>
  );
}

