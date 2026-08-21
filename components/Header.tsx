import React, { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { Menu, X, MessageSquare, ExternalLink } from 'lucide-react';
import { WHATSAPP_LINK } from '../constants';

const Header: React.FC = () => {
  const [isOpen, setIsOpen] = useState(false);
  const [scrolled, setScrolled] = useState(false);
  const [isModalOpen, setIsModalOpen] = useState(false);

  useEffect(() => {
    const handleScroll = () => {
      setScrolled(window.scrollY > 20);
    };
    window.addEventListener('scroll', handleScroll, { passive: true });
    return () => window.removeEventListener('scroll', handleScroll);
  }, []);

  // Fecha menu e modal no Esc, e trava o scroll do fundo enquanto estiverem abertos.
  useEffect(() => {
    if (!isOpen && !isModalOpen) return;

    const onKey = (e: KeyboardEvent) => {
      if (e.key === 'Escape') {
        setIsOpen(false);
        setIsModalOpen(false);
      }
    };
    document.addEventListener('keydown', onKey);
    const previous = document.body.style.overflow;
    document.body.style.overflow = 'hidden';

    return () => {
      document.removeEventListener('keydown', onKey);
      document.body.style.overflow = previous;
    };
  }, [isOpen, isModalOpen]);

  const smoothScrollTo = (targetId: string) => {
    const element = document.querySelector(targetId);
    if (!element) return;

    const targetPosition = element.getBoundingClientRect().top + window.pageYOffset;
    const startPosition = window.pageYOffset;
    const distance = targetPosition - startPosition - 100;
    const duration = 1000;
    let start: number | null = null;

    const easeInOutCubic = (t: number, b: number, c: number, d: number) => {
      t /= d / 2;
      if (t < 1) return (c / 2) * t * t * t + b;
      t -= 2;
      return (c / 2) * (t * t * t + 2) + b;
    };

    const animation = (currentTime: number) => {
      if (start === null) start = currentTime;
      const timeElapsed = currentTime - start;
      const run = easeInOutCubic(timeElapsed, startPosition, distance, duration);
      window.scrollTo(0, run);
      if (timeElapsed < duration) requestAnimationFrame(animation);
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
    { name: 'Estúdio', href: '#schedule' },
  ];

  return (
    <>
      <motion.header
        initial={{ y: -100 }}
        animate={{ y: 0 }}
        transition={{ duration: 1, ease: [0.22, 1, 0.36, 1] }}
        className={`fixed top-0 left-0 right-0 z-50 transition-all duration-700 ${
          scrolled ? 'py-4 px-4 md:px-12' : 'py-6 md:py-8 px-6 md:px-24'
        }`}
      >
        <div
          className={`max-w-[1600px] mx-auto flex justify-between items-center transition-all duration-700 ${
            scrolled
              ? 'bg-black/60 backdrop-blur-xl border border-white/10 rounded-full px-6 md:px-8 py-3 shadow-[0_20px_50px_rgba(0,0,0,0.5)]'
              : 'bg-transparent border-transparent px-0 py-0'
          }`}
        >
          {/* O logo apontava para href="#", que não fazia nada. Agora volta ao topo. */}
          <a
            href="#top"
            onClick={(e) => {
              e.preventDefault();
              setIsOpen(false);
              window.scrollTo({ top: 0, behavior: 'smooth' });
            }}
            className="flex items-center gap-2 group"
            aria-label="Bisão Ink, voltar ao topo"
          >
            <span
              className={`font-logo transition-all duration-500 tracking-[0.25em] md:tracking-[0.3em] text-white ${
                scrolled ? 'text-base md:text-xl' : 'text-lg md:text-2xl'
              }`}
            >
              BISÃO <span className="text-red-600 font-bold group-hover:text-white transition-colors">INK</span>
            </span>
          </a>

          <nav className="hidden md:flex items-center gap-10">
            {navLinks.map((link) => (
              <a
                key={link.name}
                href={link.href}
                onClick={(e) => scrollToSection(e, link.href)}
                className="whitespace-nowrap text-[10px] tracking-[0.4em] uppercase font-bold text-white/70 hover:text-red-500 transition-all duration-300"
              >
                {link.name}
              </a>
            ))}

            <button
              onClick={() => setIsModalOpen(true)}
              className="bg-red-700 text-white hover:bg-white hover:text-black px-6 py-2.5 rounded-full transition-all duration-500 font-black ml-2 text-[10px] tracking-[0.2em]"
            >
              AGENDAR
            </button>
          </nav>

          <button
            className="md:hidden text-white p-2"
            onClick={() => setIsOpen(!isOpen)}
            aria-label={isOpen ? 'Fechar menu' : 'Abrir menu'}
            aria-expanded={isOpen}
          >
            {isOpen ? <X size={24} /> : <Menu size={24} />}
          </button>
        </div>
      </motion.header>

      {/* Aviso de redirecionamento para o WhatsApp */}
      <AnimatePresence>
        {isModalOpen && (
          <div
            className="fixed inset-0 z-[100] flex items-center justify-center p-6"
            role="dialog"
            aria-modal="true"
            aria-label="Agendamento via WhatsApp"
          >
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
              className="relative w-full max-w-lg bg-neutral-900 border border-white/10 rounded-[32px] p-8 md:p-12 overflow-hidden shadow-[0_0_100px_rgba(185,28,28,0.1)]"
            >
              <div className="absolute -top-24 -right-24 w-48 h-48 bg-red-700/20 blur-[80px]" />

              <div className="relative z-10 flex flex-col items-center text-center">
                <div className="w-20 h-20 rounded-full bg-red-700/10 flex items-center justify-center mb-8 border border-red-700/20">
                  <MessageSquare className="text-red-500" size={32} />
                </div>

                <span className="text-red-500 text-[10px] tracking-[0.5em] uppercase font-bold mb-4">Atendimento Exclusivo</span>
                <h3 className="font-display text-3xl md:text-4xl text-white italic tracking-tighter mb-6 leading-tight">
                  Você será redirecionado para o <span className="text-red-600">WhatsApp</span>
                </h3>

                <p className="text-gray-400 text-sm leading-relaxed mb-10 max-w-sm tracking-tight">
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
                    className="flex-1 bg-white/5 hover:bg-white/10 text-white/70 hover:text-white py-5 rounded-full text-[10px] tracking-[0.4em] font-black uppercase transition-all border border-white/10"
                  >
                    Voltar
                  </button>
                </div>
              </div>
            </motion.div>
          </div>
        )}
      </AnimatePresence>

      {/* Menu mobile */}
      <AnimatePresence>
        {isOpen && (
          <motion.div
            initial={{ opacity: 0, x: '100%' }}
            animate={{ opacity: 1, x: 0 }}
            exit={{ opacity: 0, x: '100%' }}
            transition={{ type: 'spring', damping: 25, stiffness: 200 }}
            className="fixed inset-0 z-[60] bg-black/80 backdrop-blur-xl md:hidden px-8 py-24 flex flex-col justify-center overflow-y-auto"
          >
            <button
              className="absolute top-6 right-6 text-white p-4"
              onClick={() => setIsOpen(false)}
              aria-label="Fechar Menu"
            >
              <X size={32} />
            </button>
            <div className="flex flex-col gap-8 text-5xl font-display italic relative z-10">
              {navLinks.map((link, idx) => (
                <motion.a
                  key={link.name}
                  href={link.href}
                  onClick={(e) => scrollToSection(e, link.href)}
                  initial={{ opacity: 0, x: 50 }}
                  animate={{ opacity: 1, x: 0 }}
                  transition={{ delay: idx * 0.08 + 0.2 }}
                  className="text-white hover:text-red-600 transition-all duration-500 w-fit"
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
                transition={{ delay: 0.6 }}
                className="bg-red-700 text-white font-logo text-sm tracking-[0.3em] mt-8 uppercase py-5 px-8 rounded-full w-fit hover:bg-white hover:text-black transition-colors"
              >
                Agendar agora
              </motion.button>
            </div>
          </motion.div>
        )}
      </AnimatePresence>
    </>
  );
};

export default Header;
