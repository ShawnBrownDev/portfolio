import Hero from '@/components/Hero';
import Navbar from '@/components/Navbar';
import About from '@/components/AboutMe';
import Projects from '@/components/Projects';
import AnimatedSkills from '@/components/AnimatedSkills';
// import Contact from '@/components/';
import Footer from '@/components/Footer';

export default function Home() {
  return (
    <main className="min-h-screen bg-background">
      <Navbar />
      <Hero />
      <About />
      <Projects />
      <AnimatedSkills />
      {/* <Contact /> */}
      <Footer />
    </main>
  );
}