import Hero from '@/components/home/Hero';
import Navbar from '@/components/layout/Navbar';
import AboutMe from '@/components/home/AboutMe';
import Projects from '@/components/projects/Projects';
import AnimatedSkills from '@/components/home/AnimatedSkills';
import ContactForm from '@/components/home/ContactForm';
// import Contact from '@/components/';
import Footer from '@/components/layout/Footer';

export default function Home() {
  return (
    <main className="min-h-screen bg-background">
      <Navbar />
      <Hero />
      <AboutMe />
      <Projects />
      <AnimatedSkills />
      <ContactForm />
      {/* <Contact /> */}
      <Footer />
    </main>
  );
}