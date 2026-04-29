import React, { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { Menu, X, ArrowRight, MessageSquare, ExternalLink } from 'lucide-react';

const Header: React.FC = () => {
  const [isOpen, setIsOpen] = useState(false);
  const [scrolled, setScrolled] = useState(false);
  const [isModalOpen, setIsModalOpen] = useState(false);

  const WHATSAPP_LINK = "https://l.instagram.com/?u=https%3A%2F%2Fapi.whatsapp.com%2Fsend%3Fphone%3D5591993171598%26text%3DOl%25C3%25A1%2Btudo%2Bbem%253F%2521%2BGostaria%2Bde%2Bfazer%2Bum%2Bor%25C3%25A7amento%2B%26utm_source%3Dig%26utm_medium%3Dsocial%26utm_content%3Dlink_in_bio%26fbclid%3DPAZXh0bgNhZW0CMTEAc3J0YwZhcHBfaWQMMjU2MjgxMDQwNTU4AAGnupCyT1K3v5hT2Fh_WB97saQqXgXJV_O3sfjVgHlwSJxutaihFmiI-GIVBc0_aem_ztZ5im5rcZzf8DY3Cb96bQ&e=AT7h8KJTNVVKsJoHtQWWkkkGJNbQO3FVYzOAHwWfsBCUBku594X5KOBS5H4_gHuXPACqvfAVNLfhTWmKGGfq7OaQt63s2miDc184LRh_NA";

  useEffect(() => {
    const handleScroll = () => {
      setScrolled(window.scrollY > 20);
    };
    window.addEventListener('scroll', handleScroll);
    return () => window.removeEventListener('scroll', handleScroll);
  }, []);

  const smoothScrollTo = (targetId: string) => {
    const element = document.querySelector(targetId);
    if (!element) return;
    
    const targetPosition = element.getBoundingClientRect().top + window.pageYOffset;
    const startPosition = window.pageYOffset;
    const distance = targetPosition - startPosition - 100;
    const duration = 1500;
    let start: number | null = null;

    const animation = (currentTime: number) => {
      if (start === null) start = currentTime;
      const timeElapsed = currentTime - start;
      const run = easeInOutCubic(timeElapsed, startPosition, distance, duration);
      window.scrollTo(0, run);
      if (timeElapsed < duration) requestAnimationFrame(animation);
    };

    const easeInOutCubic = (t: number, b: number, c: number, d: number) => {
      t /= d / 2;
      if (t < 1) return c / 2 * t * t * t + b;
      t -= 2;
      return c / 2 * (t * t * t + 2) + b;
    };

    requestAnimationFrame(animation);
  };

  const scrollToSection = (e: React.MouseEvent<HTMLAnchorElement>, href: string) => {
    e.preventDefault();
    setIsOpen(false);
    smoothScrollTo(href);
  };

  const navLinks = [
    { name: 'Galeria', href: '#gallery' },
    { name: 'Filosofia', href: '#craft' },
    { name: 'O Ritual', href: '#ritual' },
    { name: 'Agenda', href: '#schedule' },
  ];

  return (
    <>
      <motion.header
        initial={{ y: -100 }}
        animate={{ y: 0 }}
        transition={{ duration: 1, ease: [0.22, 1, 0.36, 1] }}
        className={`fixed top-0 left-0 right-0 z-50 transition-all duration-700 ${
          scrolled ? 'py-4 px-4 md:px-12' : 'py-8 px-8 md:px-24'
        }`}
      >
        <div 
          className={`max-w-[1600px] mx-auto flex justify-between items-center transition-all duration-700 ${
            scrolled 
            ? 'bg-black/40 backdrop-blur-xl border border-white/10 rounded-full px-8 py-3 shadow-[0_20px_50px_rgba(0,0,0,0.5)]' 
            : 'bg-transparent border-transparent px-0 py-0'
          }`}
        >
          {/* Logo */}
          <a href="#" className="flex items-center gap-2 group">
            <span className={`font-logo transition-all duration-500 tracking-[0.3em] text-white ${scrolled ? 'text-lg md:text-xl' : 'text-xl md:text-2xl'}`}>
              BISÃO <span className="text-red-700 font-bold group-hover:text-white transition-colors">INK</span>
            </span>
          </a>

          {/* Desktop Nav */}
          <nav className="hidden md:flex items-center gap-12">
            {navLinks.map((link) => (
              <a
                key={link.name}
                href={link.href}
                onClick={(e) => scrollToSection(e, link.href)}
                className="text-[10px] tracking-[0.4em] uppercase font-bold text-white/50 hover:text-red-700 transition-all duration-300"
              >
                {link.name}
              </a>
            ))}
            
            <button
              onClick={() => setIsModalOpen(true)}
              className="bg-red-700/10 text-red-700 hover:bg-red-700 hover:text-white px-6 py-2 rounded-full border border-red-700/50 transition-all duration-500 font-black ml-4 text-[10px] tracking-[0.2em]"
            >
              AGENDAR
            </button>
          </nav>

          {/* Mobile Menu Button */}
          <button
            className="md:hidden text-white p-2"
            onClick={() => setIsOpen(!isOpen)}
          >
            {isOpen ? <X size={24} /> : <Menu size={24} />}
          </button>
        </div>
      </motion.header>

      {/* WhatsApp Redirect Modal */}
      <AnimatePresence>
        {isModalOpen && (
          <div className="fixed inset-0 z-[100] flex items-center justify-center p-6">
            <motion.div
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
              onClick={() => setIsModalOpen(false)}
              className="absolute inset-0 bg-black/90 backdrop-blur-md"
            />
            
            <motion.div
              initial={{ opacity: 0, scale: 0.9, y: 20 }}
              animate={{ opacity: 1, scale: 1, y: 0 }}
              exit={{ opacity: 0, scale: 0.9, y: 20 }}
              className="relative w-full max-w-lg bg-neutral-900 border border-white/10 rounded-[32px] p-12 overflow-hidden shadow-[0_0_100px_rgba(185,28,28,0.1)]"
            >
              {/* Decorative Glow */}
              <div className="absolute -top-24 -right-24 w-48 h-48 bg-red-700/20 blur-[80px]" />
              
              <div className="relative z-10 flex flex-col items-center text-center">
                <div className="w-20 h-20 rounded-full bg-red-700/10 flex items-center justify-center mb-8 border border-red-700/20">
                  <MessageSquare className="text-red-700" size={32} />
                </div>
                
                <span className="text-red-700 text-[10px] tracking-[0.5em] uppercase font-bold mb-4">Atendimento Exclusivo</span>
                <h3 className="font-display text-4xl text-white italic tracking-tighter mb-6 leading-tight">
                  Você será redirecionado para o <span className="text-red-700">WhatsApp</span>
                </h3>
                
                <p className="text-gray-500 text-sm leading-relaxed mb-12 max-w-sm tracking-tight">
                  Para garantir a exclusividade do seu projeto, todos os agendamentos são realizados via consultoria direta.
                </p>
                
                <div className="flex flex-col sm:flex-row gap-4 w-full">
                  <a
                    href={WHATSAPP_LINK}
                    target="_blank"
                    rel="noopener noreferrer"
                    onClick={() => setIsModalOpen(false)}
                    className="flex-1 bg-red-700 hover:bg-red-800 text-white py-5 rounded-full text-[10px] tracking-[0.4em] font-black uppercase transition-all flex items-center justify-center gap-3"
                  >
                    Continuar <ExternalLink size={14} />
                  </a>
                  <button
                    onClick={() => setIsModalOpen(false)}
                    className="flex-1 bg-white/5 hover:bg-white/10 text-white/50 hover:text-white py-5 rounded-full text-[10px] tracking-[0.4em] font-black uppercase transition-all border border-white/5"
                  >
                    Voltar
                  </button>
                </div>
              </div>
            </motion.div>
          </div>
        )}
      </AnimatePresence>

      {/* Mobile Menu */}
      <AnimatePresence>
        {isOpen && (
          <motion.div
            initial={{ opacity: 0, x: '100%' }}
            animate={{ opacity: 1, x: 0 }}
            exit={{ opacity: 0, x: '100%' }}
            transition={{ type: 'spring', damping: 25, stiffness: 200 }}
            className="fixed inset-0 z-[60] bg-black/40 backdrop-blur-xl md:hidden p-12 flex flex-col justify-center"
          >
            <button
              className="absolute top-8 right-8 text-white p-4"
              onClick={() => setIsOpen(false)}
              aria-label="Fechar Menu"
            >
              <X size={40} />
            </button>
            <div className="flex flex-col gap-12 text-6xl md:text-8xl font-display italic relative z-10">
              {navLinks.map((link, idx) => (
                <motion.a
                  key={link.name}
                  href={link.href}
                  onClick={(e) => scrollToSection(e, link.href)}
                  initial={{ opacity: 0, x: 50 }}
                  animate={{ opacity: 1, x: 0 }}
                  transition={{ delay: idx * 0.1 + 0.3 }}
                  whileHover={{ x: 30, color: '#b91c1c' }}
                  className="text-white transition-all duration-500 w-fit"
                >
                  {link.name}
                </motion.a>
              ))}
              <motion.button
                onClick={() => {
                  setIsOpen(false);
                  setIsModalOpen(true);
                }}
                initial={{ opacity: 0, scale: 0.9 }}
                animate={{ opacity: 1, scale: 1 }}
                transition={{ delay: 0.8 }}
                className="text-red-700 font-logo text-2xl tracking-[0.5em] mt-12 uppercase text-left hover:text-white transition-colors"
              >
                AGENDAR AGORA
              </motion.button>
            </div>
          </motion.div>
        )}
      </AnimatePresence>
    </>
  );
};

export default Header;
