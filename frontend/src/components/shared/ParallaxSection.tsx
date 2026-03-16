import { useEffect, useRef } from 'react';

interface ParallaxSectionProps {
  bgImage?: string;
  bgColor?: string;
  speed?: number;          // 0.5 = slower, 1 = normal, 2 = faster
  scale?: [number, number]; // [startScale, endScale] e.g., [1, 1.2] zooms in as you scroll
  opacity?: [number, number]; // [startOpacity, endOpacity] e.g., [0.8, 1] fades in
  children: React.ReactNode;
  className?: string;
}

const ParallaxSection: React.FC<ParallaxSectionProps> = ({
  bgImage,
  bgColor,
  speed = 0.5,
  scale = [1, 1.1],        // subtle zoom in
  opacity = [0.9, 1],      // slight fade in
  children,
  className = '',
}) => {
  const sectionRef = useRef<HTMLElement>(null);
  const bgRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    const handleScroll = () => {
      if (!sectionRef.current || !bgRef.current) return;

      const sectionTop = sectionRef.current.offsetTop;
      const sectionHeight = sectionRef.current.offsetHeight;
      const scrollY = window.scrollY;
      const windowHeight = window.innerHeight;

      // Calculate how far the section is in view
      const sectionVisibleStart = sectionTop - windowHeight;
      const sectionVisibleEnd = sectionTop + sectionHeight;
      const scrollPosition = scrollY;

      if (scrollPosition >= sectionVisibleStart && scrollPosition <= sectionVisibleEnd) {
        // Progress from 0 (just entering) to 1 (just leaving)
        let progress = (scrollPosition - sectionVisibleStart) / (sectionVisibleEnd - sectionVisibleStart);
        progress = Math.max(0, Math.min(1, progress)); // clamp 0-1

        // Parallax movement
        const moveY = (scrollPosition - sectionTop) * speed;
        
        // Scale effect: interpolate between scale[0] and scale[1]
        const currentScale = scale[0] + (scale[1] - scale[0]) * progress;
        
        // Opacity effect: interpolate between opacity[0] and opacity[1]
        const currentOpacity = opacity[0] + (opacity[1] - opacity[0]) * progress;

        bgRef.current.style.transform = `translateY(${moveY}px) scale(${currentScale})`;
        bgRef.current.style.opacity = currentOpacity.toString();
      }
    };

    window.addEventListener('scroll', handleScroll);
    handleScroll(); // initial call

    return () => window.removeEventListener('scroll', handleScroll);
  }, [speed, scale, opacity]);

  return (
    <section
      ref={sectionRef}
      className={`relative overflow-hidden ${className}`}
      style={{ minHeight: '100vh' }}
    >
      <div
        ref={bgRef}
        className="absolute inset-0 w-full h-full will-change-transform"
        style={{
          backgroundImage: bgImage ? `url(${bgImage})` : 'none',
          backgroundColor: bgColor || 'transparent',
          backgroundSize: 'cover',
          backgroundPosition: 'center',
          zIndex: 0,
          transition: 'opacity 0.1s linear', // subtle smoothing for opacity changes
        }}
      />
      <div className="relative z-10 flex items-center justify-center min-h-screen">
        {children}
      </div>
    </section>
  );
};

export default ParallaxSection;
