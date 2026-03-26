
import React, { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { Menu, X } from 'lucide-react';

const Header: React.FC = () => {
  const [isMenuOpen, setIsMenuOpen] = useState(false);

  const navLinks = [
    { name: 'Galeria', href: '#gallery' },
    { name: 'Filosofia', href: '#craft' },
    { name: 'O Ritual', href: '#ritual' },
    { name: 'Agenda', href: '#schedule' },
  ];

  return (
    <>
      <nav className="fixed top-0 left-0 w-full z-50 flex justify-between items-center p-8 mix-blend-difference">
        <motion.div
          initial={{ opacity: 0, x: -20 }}
          animate={{ opacity: 1, x: 0 }}
          className="font-logo text-xl md:text-2xl tracking-[0.4em] font-bold"
        >
          <span className="text-white">BISÃO</span> <span className="text-red-700">INK</span>
        </motion.div>

        <div className="hidden md:flex gap-12 text-[10px] tracking-[0.5em] uppercase font-bold text-white/70">
          {navLinks.map((link) => (
            <a
              key={link.name}
              href={link.href}
              className="hover:text-red-700 transition-all duration-500 hover:tracking-[0.8em]"
            >
              {link.name}
            </a>
          ))}
          <a
            href="#schedule"
            className="text-red-700 hover:text-white transition-all duration-500 font-black border-b border-red-700 pb-1"
          >
            AGENDAR
          </a>
        </div>

        <button
          className="md:hidden text-white p-2"
          onClick={() => setIsMenuOpen(true)}
          aria-label="Abrir Menu"
        >
          <Menu size={24} />
        </button>
      </nav>

      <AnimatePresence>
        {isMenuOpen && (
          <motion.div
            initial={{ opacity: 0, x: '100%' }}
            animate={{ opacity: 1, x: 0 }}
            exit={{ opacity: 0, x: '100%' }}
            transition={{ type: 'spring', damping: 30, stiffness: 200 }}
            className="fixed inset-0 z-[60] bg-black/40 backdrop-blur-xl p-12 flex flex-col justify-center"
          >
            {/* Grain Texture in Menu */}
            <div className="absolute inset-0 opacity-[0.05] pointer-events-none bg-[url('https://www.transparenttextures.com/patterns/micro-carbon.png')]" />

            <button
              className="absolute top-8 right-8 text-white p-4"
              onClick={() => setIsMenuOpen(false)}
              aria-label="Fechar Menu"
            >
              <X size={40} />
            </button>
            <div className="flex flex-col gap-12 text-6xl md:text-8xl font-display italic relative z-10">
              {navLinks.map((link, idx) => (
                <motion.a
                  key={link.name}
                  href={link.href}
                  onClick={() => setIsMenuOpen(false)}
                  initial={{ opacity: 0, x: 50 }}
                  animate={{ opacity: 1, x: 0 }}
                  transition={{ delay: idx * 0.1 + 0.3 }}
                  whileHover={{ x: 30, color: '#b91c1c' }}
                  className="text-white transition-all duration-500 w-fit"
                >
                  {link.name}
                </motion.a>
              ))}
              <motion.a
                href="#schedule"
                onClick={() => setIsMenuOpen(false)}
                initial={{ opacity: 0, scale: 0.9 }}
                animate={{ opacity: 1, scale: 1 }}
                transition={{ delay: 0.8 }}
                className="text-red-700 font-logo text-2xl tracking-[0.5em] mt-12 uppercase"
              >
                AGENDAR AGORA
              </motion.a>
            </div>
          </motion.div>
        )}
      </AnimatePresence>
    </>
  );
};

export default Header;
