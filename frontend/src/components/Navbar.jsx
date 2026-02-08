import { motion } from 'framer-motion';
import logo from '../assets/logo.PNG';

const Navbar = () => {
  return (
    <motion.nav
      initial={{ y: -100, opacity: 0 }}
      animate={{ y: 0, opacity: 1 }}
      transition={{ duration: 0.8, ease: "easeOut" }}
      className="fixed top-0 left-0 right-0 z-50 flex items-center justify-between px-6 py-6 md:px-12 max-w-7xl mx-auto w-full bg-background/80 backdrop-blur-md"
    >
      {/* Logo */}
      <div className="flex items-center gap-3">
        <img src={logo} alt="Vishnu.Dev Logo" className="h-10 w-auto object-contain" />
        <h1 className="font-display font-bold text-2xl tracking-wider uppercase">
          <span className="text-white">VISHNU</span> <span className="text-primary neon-text">PRASAD</span>
        </h1>
      </div>

      {/* Navigation Links */}
      <div className="hidden md:flex items-center gap-8 bg-surface/50 px-6 py-2 rounded-full border border-white/5">
        <a href="/" className="text-sm font-medium text-text-secondary hover:text-white transition-colors">Home</a>
        <a href="#projects" className="text-sm font-medium text-text-secondary hover:text-white transition-colors">Work</a>
        <a href="#experience" className="text-sm font-medium text-text-secondary hover:text-white transition-colors">Experience</a>
      </div>

      {/* CTA Button */}
      <motion.button
        whileHover={{ scale: 1.05 }}
        whileTap={{ scale: 0.95 }}
        onClick={() => window.location.href = '/contact'}
        className="px-5 py-2 rounded-full border border-white/10 bg-white/5 hover:bg-white/10 text-sm font-medium transition-colors backdrop-blur-sm"
      >
        Let's Talk
      </motion.button>
    </motion.nav>
  );
};

export default Navbar;
