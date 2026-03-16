import Link from 'next/link';
import { motion } from 'framer-motion';

const Footer = () => {
  return (
    <footer className="bg-gray-900 text-white py-16">
      <div className="container mx-auto px-4">
        <div className="grid grid-cols-1 md:grid-cols-4 gap-8">
          <div>
            <h3 className="text-2xl font-bold mb-4 text-primary">SkillPath</h3>
            <p className="text-gray-400">Bridging the gap between education and industry.</p>
          </div>
          <div>
            <h4 className="text-lg font-semibold mb-4">Quick Links</h4>
            <ul className="space-y-2 text-gray-400">
              <li><Link href="/about" className="hover:text-primary transition">About</Link></li>
              <li><Link href="/contact" className="hover:text-primary transition">Contact</Link></li>
              <li><Link href="/privacy" className="hover:text-primary transition">Privacy</Link></li>
            </ul>
          </div>
          <div>
            <h4 className="text-lg font-semibold mb-4">Sectors</h4>
            <ul className="space-y-2 text-gray-400">
              <li><Link href="/sector/webdev" className="hover:text-primary transition">Web Development</Link></li>
              <li><Link href="/sector/data-science" className="hover:text-primary transition">Data Science</Link></li>
              <li><Link href="/sector/cloud" className="hover:text-primary transition">Cloud Computing</Link></li>
            </ul>
          </div>
          <div>
            <h4 className="text-lg font-semibold mb-4">Follow Us</h4>
            <div className="flex space-x-4">
              <motion.a
                whileHover={{ scale: 1.2, rotate: 5 }}
                href="#"
                className="w-10 h-10 bg-gray-800 rounded-full flex items-center justify-center text-xl hover:bg-primary transition"
              >
                𝕏
              </motion.a>
              <motion.a
                whileHover={{ scale: 1.2, rotate: -5 }}
                href="#"
                className="w-10 h-10 bg-gray-800 rounded-full flex items-center justify-center text-xl hover:bg-primary transition"
              >
                in
              </motion.a>
              <motion.a
                whileHover={{ scale: 1.2, rotate: 5 }}
                href="#"
                className="w-10 h-10 bg-gray-800 rounded-full flex items-center justify-center text-xl hover:bg-primary transition"
              >
                🐙
              </motion.a>
            </div>
          </div>
        </div>
        <div className="border-t border-gray-800 mt-12 pt-8 text-center text-gray-500">
          © {new Date().getFullYear()} SkillPath. All rights reserved.
        </div>
      </div>
    </footer>
  );
};

export default Footer;
