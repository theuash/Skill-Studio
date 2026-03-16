import { motion } from 'framer-motion';
import { useInView } from 'react-intersection-observer';

const About = () => {
  const [ref, inView] = useInView({ triggerOnce: true, threshold: 0.2 });

  const variants = {
    hidden: { opacity: 0, y: 50 },
    visible: { opacity: 1, y: 0, transition: { duration: 0.8, ease: 'easeOut' } },
  };

  return (
    <section className="py-32 bg-surface dark:bg-gray-800">
      <div className="container mx-auto px-4">
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-12 items-center">
          <motion.div
            ref={ref}
            initial="hidden"
            animate={inView ? 'visible' : 'hidden'}
            variants={variants}
          >
            <h2 className="text-4xl md:text-5xl font-bold mb-6">
              Why SkillPath?
            </h2>
            <p className="text-lg text-text-light mb-8 leading-relaxed">
              We analyze millions of job postings in real time to create personalized learning paths.
              Our platform connects your current skills with the exact requirements of top companies,
              ensuring you're always ahead of the curve.
            </p>
            <div className="flex space-x-4">
              <div className="text-center">
                <div className="text-3xl font-bold text-primary">10K+</div>
                <div className="text-sm text-text-light">Active Users</div>
              </div>
              <div className="text-center">
                <div className="text-3xl font-bold text-primary">50+</div>
                <div className="text-sm text-text-light">Industries</div>
              </div>
              <div className="text-center">
                <div className="text-3xl font-bold text-primary">200+</div>
                <div className="text-sm text-text-light">Companies</div>
              </div>
            </div>
          </motion.div>
          <motion.div
            initial={{ opacity: 0, scale: 0.8 }}
            animate={inView ? { opacity: 1, scale: 1 } : {}}
            transition={{ duration: 0.8, delay: 0.2 }}
            className="relative"
          >
            <div className="aspect-square rounded-2xl overflow-hidden shadow-2xl">
              <img src="https://picsum.photos/600/600?random=10" alt="About" className="w-full h-full object-cover" />
            </div>
            <div className="absolute -top-4 -right-4 w-32 h-32 bg-primary/20 rounded-full blur-2xl animate-pulse" />
            <div className="absolute -bottom-4 -left-4 w-40 h-40 bg-secondary/20 rounded-full blur-2xl animate-pulse" style={{ animationDelay: '1s' }} />
          </motion.div>
        </div>
      </div>
    </section>
  );
};

export default About;
