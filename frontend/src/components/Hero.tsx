import { useEffect, useRef } from 'react';
import { gsap } from 'gsap';
import { ScrollTrigger } from 'gsap/ScrollTrigger';
import FloatingShapes from './FloatingShapes';

gsap.registerPlugin(ScrollTrigger);

const Hero = () => {
  const heroRef = useRef<HTMLElement>(null);
  const textRef = useRef<HTMLDivElement>(null);
  const bgRef = useRef<HTMLDivElement>(null);
  const midRef = useRef<HTMLDivElement>(null);
  const frontRef = useRef<HTMLDivElement>(null);
  const shapesRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    const ctx = gsap.context(() => {
      // Parallax layers
      gsap.to(bgRef.current, {
        yPercent: 50,
        scale: 1.2,
        ease: 'none',
        scrollTrigger: {
          trigger: heroRef.current,
          start: 'top top',
          end: 'bottom top',
          scrub: 1,
        },
      });
      gsap.to(midRef.current, {
        yPercent: 30,
        scale: 1.1,
        ease: 'none',
        scrollTrigger: {
          trigger: heroRef.current,
          start: 'top top',
          end: 'bottom top',
          scrub: 1,
        },
      });
      gsap.to(frontRef.current, {
        yPercent: 15,
        scale: 1.05,
        ease: 'none',
        scrollTrigger: {
          trigger: heroRef.current,
          start: 'top top',
          end: 'bottom top',
          scrub: 1,
        },
      });
      // Text animation
      gsap.from(textRef.current.children, {
        opacity: 0,
        y: 100,
        stagger: 0.2,
        duration: 1.5,
        ease: 'power4.out',
      });
    }, heroRef);

    return () => ctx.revert();
  }, []);

  return (
    <section ref={heroRef} className="relative h-screen overflow-hidden bg-bg">
      <FloatingShapes />
      {/* Parallax layers */}
      <div ref={bgRef} className="absolute inset-0 bg-gradient-to-br from-primary/30 via-secondary/20 to-accent/30" />
      <div ref={midRef} className="absolute inset-0 flex items-center justify-center">
        <div className="w-[800px] h-[800px] bg-primary/20 rounded-full blur-3xl animate-pulse" />
      </div>
      <div ref={frontRef} className="absolute inset-0 flex items-center justify-center">
        <div className="w-[500px] h-[500px] bg-secondary/20 rounded-full blur-2xl animate-pulse" style={{ animationDelay: '1s' }} />
      </div>

      <div ref={textRef} className="relative z-10 flex flex-col items-center justify-center h-full text-center text-text px-4">
        <h1 className="text-6xl md:text-8xl font-bold mb-6 leading-tight">
          Bridge the <span className="text-primary">Skill Gap</span>
        </h1>
        <p className="text-xl md:text-2xl max-w-2xl mb-8 text-text-light">
          Discover personalized career pathways aligned with real-time industry demands.
        </p>
        <button className="group px-8 py-4 bg-primary text-white rounded-full text-lg font-semibold hover:bg-primary-dark transition-all transform hover:scale-105 hover:shadow-2xl">
          Get Started
          <span className="inline-block ml-2 group-hover:translate-x-1 transition-transform">→</span>
        </button>
      </div>

      {/* Scroll indicator */}
      <div className="absolute bottom-8 left-1/2 transform -translate-x-1/2">
        <div className="w-6 h-10 border-2 border-text rounded-full flex justify-center">
          <div className="w-1 h-3 bg-text rounded-full mt-2 animate-bounce" />
        </div>
      </div>
    </section>
  );
};

export default Hero;
