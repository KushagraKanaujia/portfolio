import Navbar from "@/components/Navbar";
import Hero3D from "@/components/Hero3D";
import ImpactDashboard from "@/components/ImpactDashboard";
import Projects3D from "@/components/Projects3D";
import TechArsenal3D from "@/components/TechArsenal3D";
import Experience from "@/components/Experience";
import Contact from "@/components/Contact";
import Footer from "@/components/Footer";
import ParticleField from "@/components/ParticleField";

export default function Home() {
  return (
    <main className="min-h-screen bg-background relative">
      <ParticleField />
      <div className="relative z-10">
        <Navbar />
        <Hero3D />
        <ImpactDashboard />
        <Projects3D />
        <TechArsenal3D />
        <Experience />
        <Contact />
        <Footer />
      </div>
    </main>
  );
}
