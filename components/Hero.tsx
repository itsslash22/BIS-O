
import React from 'react';
import { motion, useScroll, useTransform, useSpring } from 'framer-motion';

const Hero: React.FC = () => {
  const { scrollY } = useScroll();

  // Smoother parallax with spring
  const springY = useSpring(scrollY, { stiffness: 100, damping: 30 });

  const isMobile = typeof window !== 'undefined' ? window.innerWidth < 768 : false;
  const parallaxFactor = isMobile ? 0.4 : 1;

  const yText1 = useTransform(springY, [0, 500], [0, -100 * parallaxFactor]);
  const yText2 = useTransform(springY, [0, 500], [0, 100 * parallaxFactor]);
  const yBg = useTransform(springY, [0, 500], [0, 150 * parallaxFactor]);
  const opacity = useTransform(springY, [0, 400], [1, 0]);
  const scale = useTransform(springY, [0, 500], [1, isMobile ? 1.05 : 1.2]);

  return (
    <section className="relative h-screen w-full flex items-center overflow-hidden bg-black select-none">
      {/* Immersive Artist Background */}
      <motion.div
        style={{ y: yBg, opacity, scale }}
        className="absolute inset-0 z-0"
      >
        {/* Mobile Video Background */}
        <video
          autoPlay
          muted
          loop
          playsInline
          className="absolute inset-0 w-full h-full object-cover grayscale brightness-[0.45] contrast-150 md:hidden z-10"
        >
          <source src="/assets/hero_mobile.mp4" type="video/mp4" />
        </video>

        {/* Fallback & Desktop Image */}
        <img
          src="/assets/artist_pro.jpg"
          alt="BISÃO INK em ação"
          width={2000}
          height={1333}
          style={({ fetchPriority: 'high', objectPosition: '85% center' } as any)}
          className="w-full h-full object-cover grayscale brightness-[0.45] contrast-150"
        />
        {/* Artistic Overlays */}
        <div className="absolute inset-0 bg-gradient-to-b from-black via-transparent to-black" />
        <div className="absolute inset-0 bg-black/40 mix-blend-multiply hidden md:block" />
        <div className="absolute inset-0 opacity-[0.03] pointer-events-none bg-[url('https://www.transparenttextures.com/patterns/60-lines.png')] hidden md:block" />
      </motion.div>

      {/* Massive Brutalist Typography - Asymmetric */}
      <div className="relative z-20 w-full px-8 md:px-24 flex flex-col items-start justify-center h-full">
        <motion.div
          initial={{ opacity: 0, x: -100 }}
          animate={{ opacity: 1, x: 0 }}
          transition={{ duration: 1.2, ease: [0.22, 1, 0.36, 1] }}
          className="mb-8 relative z-30 hidden md:block"
        >
          <span className="text-red-600 text-[10px] md:text-xs uppercase font-bold tracking-[1.5em] block mb-4 mix-blend-difference">
            Mãos que desenham destinos
          </span>
          <div className="w-24 h-[1px] bg-red-700/50 mix-blend-difference" />
        </motion.div>

        <div className="relative">
          <motion.h1
            style={{ y: yText1, willChange: 'transform' } as any}
            initial={{ opacity: 0, y: 100, rotate: -2 }}
            animate={{ opacity: 1, y: 0, rotate: 0 }}
            transition={{ duration: 1.2, delay: 0.2, ease: [0.22, 1, 0.36, 1] }}
            className="font-logo text-[18vw] md:text-[14vw] leading-[0.7] font-black tracking-[-0.05em] text-white uppercase mix-blend-difference hidden md:block"
          >
            BISÃO
          </motion.h1>

          <motion.h1
            style={{ y: yText2, willChange: 'transform' } as any}
            initial={{ opacity: 0, x: 200 }}
            animate={{ opacity: 1, x: 0 }}
            transition={{ duration: 1.5, delay: 0.4, ease: [0.22, 1, 0.36, 1] }}
            className="font-logo text-[18vw] md:text-[14vw] leading-[0.7] font-black tracking-[-0.05em] text-red-700 uppercase md:ml-[10vw] -mt-[2vw] opacity-80 hidden md:block"
          >
            INK
          </motion.h1>
        </div>

        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ duration: 1, delay: 1.8 }}
          className="mt-16 max-w-lg hidden md:block"
        >
          <p className="text-sm md:text-base tracking-[0.2em] uppercase font-light text-gray-400 leading-relaxed text-wrap-balance">
            Únicas e exclusivas. <span className="text-white font-medium">Nada de cópias.</span> A arte que nasce aqui, morre com você.
          </p>
        </motion.div>
      </div>

      {/* Luxury Detail Elements */}
      <div className="absolute top-0 left-0 w-full h-full border-0 md:border-[30px] border-black pointer-events-none z-20" />

      {/* Scroll Indicator - Minimalist */}
      <motion.div
        initial={{ opacity: 0, y: -20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ delay: 2.5, duration: 1, repeat: Infinity, repeatType: "reverse" }}
        className="absolute bottom-16 right-16 flex flex-col items-center gap-6 z-30 hidden md:flex"
      >
        <span className="text-[9px] tracking-[0.6em] uppercase opacity-40 font-bold vertical-text">Scroll</span>
        <div className="w-[1px] h-20 bg-gradient-to-b from-red-700 to-transparent" />
      </motion.div>
    </section>
  );
};

export default Hero;
