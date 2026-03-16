import { useEffect, useRef } from 'react';

const FloatingShapes = () => {
  const shapesRef = useRef<HTMLDivElement>(null);
  const requestRef = useRef<number>();
  const mouseX = useRef(0);
  const mouseY = useRef(0);

  useEffect(() => {
    const handleMouseMove = (e: MouseEvent) => {
      mouseX.current = (e.clientX / window.innerWidth - 0.5) * 40;
      mouseY.current = (e.clientY / window.innerHeight - 0.5) * 40;
    };

    const animate = () => {
      if (shapesRef.current) {
        shapesRef.current.style.transform = `translate(${mouseX.current}px, ${mouseY.current}px)`;
      }
      requestRef.current = requestAnimationFrame(animate);
    };

    window.addEventListener('mousemove', handleMouseMove);
    requestRef.current = requestAnimationFrame(animate);

    return () => {
      window.removeEventListener('mousemove', handleMouseMove);
      if (requestRef.current) cancelAnimationFrame(requestRef.current);
    };
  }, []);

  return (
    <div ref={shapesRef} className="absolute inset-0 pointer-events-none z-0">
      <div className="absolute top-20 left-10 w-72 h-72 bg-primary/10 rounded-full blur-3xl animate-float" />
      <div className="absolute bottom-20 right-10 w-96 h-96 bg-secondary/10 rounded-full blur-3xl animate-float-delayed" />
      <div className="absolute top-1/3 left-1/3 w-48 h-48 bg-accent/10 rounded-full blur-2xl animate-float-slow" />
      <div className="absolute bottom-1/4 left-1/4 w-56 h-56 bg-primary/5 rounded-full blur-3xl animate-float" style={{ animationDelay: '-2s' }} />
      <div className="absolute top-2/3 right-1/4 w-64 h-64 bg-secondary/5 rounded-full blur-3xl animate-float-delayed" style={{ animationDelay: '-4s' }} />
    </div>
  );
};

export default FloatingShapes;
