"use client";

import { useState } from "react";
import FullScreenNeuralHero from "@/components/FullScreenNeuralHero";
import NavigationBar from "@/components/NavigationBar";
import QuickNav from "@/components/QuickNav";
import MetricsCarousel from "@/components/MetricsCarousel";
import CurrentRole from "@/components/CurrentRole";
import AboutCinematic from "@/components/AboutCinematic";
import SkillsWithLogos from "@/components/SkillsWithLogos";
import ProjectShowcaseCinematic from "@/components/ProjectShowcaseCinematic";
import CTACinematic from "@/components/CTACinematic";
import CommandPalette from "@/components/CommandPalette";
import CustomCursor from "@/components/CustomCursor";
import EasterEggs from "@/components/EasterEggs";
import PerformanceMonitor from "@/components/PerformanceMonitor";
import ScrollProgress from "@/components/ScrollProgress";
import AnimatedDivider from "@/components/AnimatedDivider";

export default function Home() {
  const [commandOpen, setCommandOpen] = useState(false);

  return (
    <main className="relative bg-black text-white overflow-x-hidden">
      {/* Unique Features - Show off technical prowess */}
      <ScrollProgress />
      <NavigationBar onOpenCommand={() => setCommandOpen(true)} />
      <QuickNav />
      <CommandPalette open={commandOpen} setOpen={setCommandOpen} />
      <CustomCursor />
      <EasterEggs />
      <PerformanceMonitor />

      {/* Section 1: FULL-SCREEN Neural Network Hero with Scattering Dots */}
      <FullScreenNeuralHero />

      {/* Section 2: Impact Metrics - Huge Animated Numbers */}
      <MetricsCarousel />

      <AnimatedDivider />

      {/* Section 3: Current Role - Floating 3D Card */}
      <CurrentRole />

      {/* Section 4: About - Who I Am & What I Do */}
      <AboutCinematic />

      <AnimatedDivider />

      {/* Section 5: Skills - With Tech Logos & Animations */}
      <SkillsWithLogos />

      <AnimatedDivider />

      {/* Section 6-8: Featured Projects - Immersive Showcases */}
      <section id="projects" className="scroll-mt-20">
        <ProjectShowcaseCinematic
        title="Dawdle"
        subtitle="iOS Social App"
        description="iOS app connecting students for spontaneous hangouts with real-time matching algorithm. Built scalable backend handling concurrent connections with WebSocket integration."
        metrics={[
          { label: "Active Users", value: "1K+" },
          { label: "Latency", value: "<2s" },
          { label: "Satisfaction", value: "95%" },
        ]}
        tech={["Swift", "Firebase", "Node.js", "WebSocket", "Google Maps"]}
        image="/dawdle.jpg"
        github="#"
        live="#"
        gradient="from-cyan-400 to-blue-500"
      />

      <ProjectShowcaseCinematic
        title="Visual Layer"
        subtitle="ML Data Quality Platform"
        description="ML data quality platform with computer vision pipelines for dataset validation and model training optimization. Processing millions of images with automated quality checks."
        metrics={[
          { label: "Images", value: "10M+" },
          { label: "Accuracy", value: "98%" },
          { label: "Speed Up", value: "50%" },
        ]}
        tech={["Python", "PyTorch", "FastAPI", "React", "PostgreSQL", "AWS"]}
        image="/visual-layer.jpg"
        github="#"
        live="#"
        gradient="from-purple-400 to-pink-500"
        reverse={true}
      />

      <ProjectShowcaseCinematic
        title="NSight Analytics"
        subtitle="Real-time Analytics Dashboard"
        description="Real-time analytics dashboard with data visualization, predictive modeling, and automated insights. Handling massive datasets with sub-second query response times."
        metrics={[
          { label: "Requests", value: "2M+" },
          { label: "Uptime", value: "99.9%" },
          { label: "Response", value: "150ms" },
        ]}
        tech={["Next.js", "PostgreSQL", "Redis", "Python", "TensorFlow"]}
        image="/nsight.jpg"
        github="#"
        live="#"
        gradient="from-orange-400 to-red-500"
      />
      </section>

      {/* Section 9: Call to Action - Minimal & Powerful */}
      <section id="contact">
        <CTACinematic />
      </section>

      {/* Footer */}
      <footer className="py-12 text-center text-gray-600 text-sm border-t border-gray-900">
        <p>© 2025 Kushagra Kanaujia. Built with Next.js, React Three Fiber & Framer Motion.</p>
      </footer>
    </main>
  );
}

