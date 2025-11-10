"use client";

import FullScreenNeuralHero from "@/components/FullScreenNeuralHero";
import NavigationBar from "@/components/NavigationBar";
import QuickNav from "@/components/QuickNav";
import MetricsCarousel from "@/components/MetricsCarousel";
import CurrentRole from "@/components/CurrentRole";
import AboutCinematic from "@/components/AboutCinematic";
import SkillsWithLogos from "@/components/SkillsWithLogos";
import ProjectShowcaseCinematic from "@/components/ProjectShowcaseCinematic";
import CTACinematic from "@/components/CTACinematic";
import CustomCursor from "@/components/CustomCursor";
import EasterEggs from "@/components/EasterEggs";
import PerformanceMonitor from "@/components/PerformanceMonitor";
import ScrollProgress from "@/components/ScrollProgress";
import AnimatedDivider from "@/components/AnimatedDivider";
import SectionNav from "@/components/SectionNav";
import FadeInView from "@/components/FadeInView";

export default function Home() {
  return (
    <main className="relative bg-black text-white overflow-x-hidden">
      {/* Unique Features - Show off technical prowess */}
      <ScrollProgress />
      <NavigationBar />
      <QuickNav />
      <SectionNav />
      <CustomCursor />
      <EasterEggs />
      <PerformanceMonitor />

      {/* Section 1: FULL-SCREEN Neural Network Hero with Scattering Dots */}
      <FullScreenNeuralHero />

      {/* Section 2: Impact Metrics - Huge Animated Numbers */}
      <FadeInView>
        <MetricsCarousel />
      </FadeInView>

      <AnimatedDivider />

      {/* Section 3: Current Role - Floating 3D Card */}
      <FadeInView direction="left" delay={0.2}>
        <CurrentRole />
      </FadeInView>

      {/* Section 4: About - Who I Am & What I Do */}
      <FadeInView direction="right" delay={0.1}>
        <AboutCinematic />
      </FadeInView>

      <AnimatedDivider />

      {/* Section 5: Skills - With Tech Logos & Animations */}
      <FadeInView>
        <SkillsWithLogos />
      </FadeInView>

      <AnimatedDivider />

      {/* Section 6-9: Featured Projects - Immersive Showcases */}
      <section id="projects" className="scroll-mt-20">
        <ProjectShowcaseCinematic
        title="Dawdle"
        subtitle="Production Mobile Platform • Backend SWE"
        description="Architected full-stack mobile platform serving 1,000+ users. Built scalable microservices backend with Node.js/Express, Redis caching, and PostgreSQL optimization. Shipped 12+ A/B tested features driving 18% DAU increase and 25% retention boost. Reduced deployment time 60% through CI/CD automation."
        metrics={[
          { label: "Active Users", value: "1K+" },
          { label: "DAU Increase", value: "+18%" },
          { label: "Retention", value: "+25%" },
        ]}
        tech={["React Native", "Node.js", "Express", "PostgreSQL", "Redis", "Firebase", "Docker"]}
        image="/dawdle.jpg"
        github="https://github.com/KushagraKanaujia"
        gradient="from-cyan-400 to-blue-500"
      />

      <ProjectShowcaseCinematic
        title="Smartshore Backend"
        subtitle="High-Scale API Infrastructure • Backend SWE"
        description="Backend engineer scaling RESTful APIs to 2M+ monthly requests at 99.9% uptime. Performance engineering: reduced P95 latency 40% through PostgreSQL query optimization and Redis caching architecture. Built comprehensive Grafana observability dashboards for production monitoring."
        metrics={[
          { label: "Requests/mo", value: "2M+" },
          { label: "Latency ↓", value: "40%" },
          { label: "Uptime", value: "99.9%" },
        ]}
        tech={["Node.js", "Express", "PostgreSQL", "Redis", "Grafana", "Docker"]}
        image="/nsight.jpg"
        github="https://github.com/KushagraKanaujia"
        gradient="from-orange-400 to-red-500"
        reverse={true}
      />

      <ProjectShowcaseCinematic
        title="Visual Layer"
        subtitle="ML Infrastructure Platform • Platform SWE"
        description="Engineered ML infrastructure platform automating distributed training on AWS/Azure multi-GPU clusters. Built scalable data pipelines processing 10M+ images from ImageNet/COCO. Automated cloud resource orchestration reducing idle compute costs 40%. Docker containerization with full CI/CD."
        metrics={[
          { label: "Images", value: "10M+" },
          { label: "Scaling", value: "+30%" },
          { label: "Cost ↓", value: "40%" },
        ]}
        tech={["Python", "PyTorch", "Docker", "AWS", "Azure", "fastdup", "PostgreSQL"]}
        image="/visual-layer.jpg"
        github="https://github.com/KushagraKanaujia"
        gradient="from-purple-400 to-pink-500"
      />

      <ProjectShowcaseCinematic
        title="Kindness Kart"
        subtitle="Full-Stack Platform • iOS/Android/Web"
        description="Engineered a platform for 7 hotels and 2 NGOs. Developed native iOS/Android apps and a website with a backend on MongoDB, cutting logistics time by over 50%."
        metrics={[
          { label: "Hotels", value: "7" },
          { label: "NGOs", value: "2" },
          { label: "Time ↓", value: "50%" },
        ]}
        tech={["iOS", "Android", "MongoDB", "Node.js", "Express", "React"]}
        image="/hero.jpg"
        github="https://github.com/KushagraKanaujia"
        gradient="from-green-400 to-emerald-500"
        reverse={true}
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

