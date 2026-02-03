
import React, { useRef } from 'react';
import { motion, useScroll, useTransform, useSpring } from 'framer-motion';

const Craft: React.FC = () => {
  const containerRef = useRef<HTMLElement>(null);

  const { scrollYProgress } = useScroll({
    target: containerRef,
    offset: ["start end", "end start"]
  });

  const smoothProgress = useSpring(scrollYProgress, {
    stiffness: 100,
    damping: 30,
    restDelta: 0.001
  });

  const isMobile = typeof window !== 'undefined' ? window.innerWidth < 768 : false;
  const parallaxFactor = isMobile ? 0.4 : 1;

  const yGraphic = useTransform(smoothProgress, [0, 1], [-150 * parallaxFactor, 250 * parallaxFactor]);
  const rotateGraphic = useTransform(smoothProgress, [0, 1], [-25, 45]);
  const scaleGraphic = useTransform(smoothProgress, [0, 0.5, 1], [0.8, 1.2, 0.9]);
  const opacityGraphic = useTransform(smoothProgress, [0, 0.2, 0.8, 1], [0, 0.08, 0.08, 0]);

  const containerVariants = {
    hidden: { opacity: 0 },
    visible: {
      opacity: 1,
      transition: {
        staggerChildren: 0.3,
        delayChildren: 0.2,
      },
    },
  };

  const itemVariants = {
    hidden: {
      opacity: 0,
      y: 40,
      scale: 0.98,
      filter: "blur(8px)"
    },
    visible: {
      opacity: 1,
      y: 0,
      scale: 1,
      filter: "blur(0px)",
      transition: {
        duration: 1.4,
        type: "spring",
        stiffness: 50,
      }
    },
  };

  return (
    <section
      id="craft"
      ref={containerRef}
      className="py-48 px-8 md:px-24 bg-black relative overflow-hidden"
    >
      {/* Grain Texture Overlay */}
      <div className="absolute inset-0 opacity-[0.02] pointer-events-none z-50 bg-[url('https://www.transparenttextures.com/patterns/asfalt-dark.png')] hidden md:block" />

      {/* Floating Abstract Element */}
      {!isMobile && (
        <motion.div
          style={{
            y: yGraphic,
            rotate: rotateGraphic,
            scale: scaleGraphic,
            opacity: opacityGraphic
          }}
          className="absolute top-0 right-[-5%] w-[80%] h-full pointer-events-none z-0 overflow-hidden"
        >
          <svg viewBox="0 0 200 200" className="w-full h-full fill-red-900/10 blur-3xl">
            <path d="M40,-50.7C52.7,-46.3,64.3,-36.8,70.9,-24.5C77.4,-12.3,78.8,2.7,75.4,17.4C72,32,63.7,46.3,51.8,55.5C39.8,64.7,24.1,68.8,9.1,68.9C-5.9,68.9,-20.2,64.8,-32.8,57C-45.3,49.2,-56.1,37.6,-61.8,24C-67.6,10.4,-68.2,-5.1,-63.9,-18.8C-59.6,-32.5,-50.3,-44.5,-38.7,-49.4C-27.1,-54.3,-13.5,-52.1,0.5,-52.8C14.6,-53.6,27.2,-55.1,40,-50.7Z" transform="translate(100 100)" />
          </svg>
        </motion.div>
      )}

      <div className="max-w-[1400px] mx-auto relative z-10">
        <div className="grid md:grid-cols-12 gap-12 items-center">
          {/* Text Content - Brutalist Positioning */}
          <motion.div
            style={({ y: useTransform(smoothProgress, [0, 1], [50 * parallaxFactor, -50 * parallaxFactor]), willChange: 'transform' } as any)}
            variants={containerVariants}
            initial="hidden"
            whileInView="visible"
            viewport={{ once: true, margin: "-100px" }}
            className="md:col-span-8 lg:col-span-7 flex flex-col pt-12 z-20"
          >
            <motion.span variants={itemVariants} className="text-red-700 text-[10px] tracking-[0.5em] uppercase mb-6 block font-bold font-logo italic">
              Manifesto • 01
            </motion.span>

            <motion.h2 variants={itemVariants} className="font-display text-6xl md:text-[7vw] mb-12 italic leading-[0.85] text-white mix-blend-difference tracking-tighter text-balance">
              Puras & <br /> <span className="text-red-700 ml-[10%]">Inimitáveis</span>
            </motion.h2>

            <div className="space-y-8 pl-8 md:pl-24 border-l border-white/10 mt-12">
              <motion.p variants={itemVariants} className="text-gray-400 text-xl leading-relaxed max-w-sm text-balance">
                Trabalho focado no Tradicional visceral. Aqui, o processo é sagrado e o resultado é individual.
              </motion.p>

              <motion.p variants={itemVariants} className="text-white font-bold text-lg leading-relaxed max-w-sm uppercase tracking-tighter font-logo text-balance">
                Nada de cópias. O que nasce no Bisão Ink morre com você.
              </motion.p>

              <motion.p variants={itemVariants} className="text-gray-600 text-sm leading-relaxed max-w-xs italic font-display">
                “Sua pele não é um catálogo. É uma declaração de existência única.”
              </motion.p>
            </div>
          </motion.div>

          {/* Visual Content - Overlapping & Fragmented */}
          <motion.div
            style={({
              opacity: useTransform(smoothProgress, [0, 0.4, 0.7], [0, 1, 1]),
              scale: useTransform(smoothProgress, [0, 0.4, 0.7], [0.8, 1.05, 1]),
              y: useTransform(smoothProgress, [0, 1], [100 * parallaxFactor, -100 * parallaxFactor]),
              willChange: 'transform'
            } as any)}
            className="md:col-span-4 lg:col-span-5 relative"
          >
            <div className="w-full md:w-[85%] aspect-[3/4] md:aspect-[4/5] overflow-hidden group shadow-[0_0_100px_rgba(0,0,0,0.8)] border border-white/5 relative z-10 ml-auto">
              <img
                src="/assets/monkey_king.jpg"
                alt="Wukong Tattoo Masterpiece"
                width={1400}
                height={1750}
                loading="lazy"
                className="w-full h-full object-cover grayscale contrast-[1.2] transition-transform duration-[2000ms] group-hover:scale-110"
              />
              <div className="absolute inset-0 bg-gradient-to-tr from-black/80 via-transparent to-transparent opacity-60" />

              {/* Highlight Overlay on Scroll */}
              <motion.div
                style={({ opacity: useTransform(smoothProgress, [0.3, 0.5, 0.7], [0, 0.3, 0]) } as any)}
                className="absolute inset-0 bg-white mix-blend-overlay pointer-events-none"
              />
            </div>

            {/* Floating Decal */}
            <motion.div
              style={({ y: useTransform(smoothProgress, [0, 1], [50 * parallaxFactor, -50 * parallaxFactor]) } as any)}
              className="absolute -bottom-6 -right-6 md:-right-12 bg-red-700 text-white p-8 md:p-12 z-30 hidden md:block"
            >
              <div className="w-8 h-[1px] bg-white mb-4" />
              <p className="font-logo text-[8px] tracking-[0.4em] uppercase leading-loose">
                Tradicional <br /> Visceral
              </p>
            </motion.div>
          </motion.div>
        </div>
      </div>
    </section>
  );
};

export default Craft;
