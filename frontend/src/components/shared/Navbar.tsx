import { useState, useEffect } from 'react';
import Link from 'next/link';
import Modal from './Modal';
import LoginForm from '../../pages/login';
import RegisterForm from '../../pages/register';
import { motion } from 'framer-motion';

const Navbar = () => {
  const [isLoginOpen, setLoginOpen] = useState(false);
  const [isRegisterOpen, setRegisterOpen] = useState(false);
  const [darkMode, setDarkMode] = useState(false);
  const [scrolled, setScrolled] = useState(false);

  useEffect(() => {
    const isDark = localStorage.getItem('darkMode') === 'true';
    setDarkMode(isDark);
    if (isDark) {
      document.documentElement.classList.add('dark');
    } else {
      document.documentElement.classList.remove('dark');
    }

    const handleScroll = () => {
      setScrolled(window.scrollY > 50);
    };
    window.addEventListener('scroll', handleScroll);
    return () => window.removeEventListener('scroll', handleScroll);
  }, []);

  const toggleDarkMode = () => {
    const newDark = !darkMode;
    setDarkMode(newDark);
    if (newDark) {
      document.documentElement.classList.add('dark');
    } else {
      document.documentElement.classList.remove('dark');
    }
    localStorage.setItem('darkMode', String(newDark));
  };

  return (
    <>
      <motion.nav
        initial={{ y: -100 }}
        animate={{ y: 0 }}
        transition={{ duration: 0.5 }}
        className={`fixed top-0 w-full z-50 transition-all duration-300 ${
          scrolled
            ? 'bg-white/80 dark:bg-gray-900/80 backdrop-blur-xl shadow-lg'
            : 'bg-transparent'
        }`}
      >
        <div className="container mx-auto px-4 py-4 flex justify-between items-center">
          <Link href="/" className="text-2xl font-bold text-primary dark:text-primary">
            SkillPath
          </Link>
          <div className="flex items-center space-x-6">
            <button
              onClick={toggleDarkMode}
              className="p-2 rounded-full bg-gray-200 dark:bg-gray-700 text-gray-700 dark:text-gray-200 hover:scale-110 transition"
            >
              {darkMode ? '☀️' : '🌙'}
            </button>
            <button
              onClick={() => setLoginOpen(true)}
              className="text-text dark:text-text-light hover:text-primary dark:hover:text-primary transition"
            >
              Login
            </button>
            <button
              onClick={() => setRegisterOpen(true)}
              className="px-4 py-2 bg-primary text-white rounded-full hover:bg-primary-dark transition transform hover:scale-105"
            >
              Register
            </button>
          </div>
        </div>
      </motion.nav>

      <Modal isOpen={isLoginOpen} onClose={() => setLoginOpen(false)}>
        <LoginForm embedded onSuccess={() => setLoginOpen(false)} />
      </Modal>

      <Modal isOpen={isRegisterOpen} onClose={() => setRegisterOpen(false)}>
        <RegisterForm embedded onSuccess={() => setRegisterOpen(false)} />
      </Modal>
    </>
  );
};

export default Navbar;
