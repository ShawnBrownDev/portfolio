import Hero from '@/components/Hero';
import Navbar from '@/components/Navbar';
import AboutMe from '@/components/AboutMe';
import Projects from '@/components/Projects';
import AnimatedSkills from '@/components/AnimatedSkills';
import ContactForm from '@/components/ContactForm';
// import Contact from '@/components/';
import Footer from '@/components/Footer';

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