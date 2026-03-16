import Navbar from '../components/shared/Navbar';
import Footer from '../components/shared/Footer';
import Hero from '../components/Hero';
import About from '../components/About';
import Features from '../components/Features';
import Projects from '../components/Projects';
import CTA from '../components/CTA';

export default function Home() {
  return (
    <>
      <Navbar />
      <main>
        <Hero />
        <About />
        <Features />
        <Projects />
        <CTA />
      </main>
      <Footer />
    </>
  );
}
