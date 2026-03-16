import { motion } from 'framer-motion';
import { useInView } from 'react-intersection-observer';

const projects = [
  {
    title: 'Web Development',
    description: 'Full-stack, frontend, backend, and everything in between.',
    image: 'https://picsum.photos/600/400?random=20',
    tags: ['React', 'Node.js', 'TypeScript'],
  },
  {
    title: 'Data Science',
    description: 'Machine learning, data analysis, and visualization.',
    image: 'https://picsum.photos/600/400?random=21',
    tags: ['Python', 'SQL', 'TensorFlow'],
  },
  {
    title: 'Cloud Computing',
    description: 'AWS, Azure, GCP, and DevOps practices.',
    image: 'https://picsum.photos/600/400?random=22',
    tags: ['AWS', 'Docker', 'Kubernetes'],
  },
];

const Projects = () => {
  const [ref, inView] = useInView({ triggerOnce: true, threshold: 0.2 });

  const containerVariants = {
    hidden: { opacity: 0 },
    visible: {
      opacity: 1,
      transition: { staggerChildren: 0.2 },
    },
  };

  const itemVariants = {
    hidden: { opacity: 0, y: 50 },
    visible: { opacity: 1, y: 0, transition: { duration: 0.8 } },
  };

  return (
    <section className="py-32 bg-surface dark:bg-gray-800">
      <div className="container mx-auto px-4">
        <motion.h2
          initial={{ opacity: 0, y: 30 }}
          whileInView={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6 }}
          className="text-4xl md:text-5xl font-bold text-center mb-16"
        >
          Explore Career Paths
        </motion.h2>
        <motion.div
          ref={ref}
          variants={containerVariants}
          initial="hidden"
          animate={inView ? 'visible' : 'hidden'}
          className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8"
        >
          {projects.map((project, index) => (
            <motion.div
              key={index}
              variants={itemVariants}
              whileHover={{ rotateX: 5, rotateY: 5, scale: 1.05 }}
              transition={{ type: 'spring', stiffness: 200 }}
              className="group relative bg-white dark:bg-gray-800 rounded-2xl shadow-xl overflow-hidden cursor-pointer"
              style={{ transformStyle: 'preserve-3d', perspective: '1200px' }}
            >
              <div className="relative h-48 overflow-hidden">
                <img
                  src={project.image}
                  alt={project.title}
                  className="w-full h-full object-cover group-hover:scale-110 transition-transform duration-500"
                />
                <div className="absolute inset-0 bg-gradient-to-t from-black/60 to-transparent" />
              </div>
              <div className="p-6">
                <h3 className="text-2xl font-bold mb-2">{project.title}</h3>
                <p className="text-text-light mb-4">{project.description}</p>
                <div className="flex flex-wrap gap-2">
                  {project.tags.map((tag) => (
                    <span key={tag} className="px-3 py-1 bg-primary/10 text-primary rounded-full text-sm">
                      {tag}
                    </span>
                  ))}
                </div>
              </div>
            </motion.div>
          ))}
        </motion.div>
      </div>
    </section>
  );
};

export default Projects;
