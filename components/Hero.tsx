import React from 'react';
import { motion, useScroll, useTransform, useSpring } from 'framer-motion';
import { MessageCircle } from 'lucide-react';
import { WHATSAPP_LINK } from '../constants';
import { useIsMobile } from '../hooks/useIsMobile';

const Hero: React.FC = () => {
  const { scrollY } = useScroll();
  const isMobile = useIsMobile();

  const springY = useSpring(scrollY, { stiffness: 100, damping: 30 });
  const parallaxFactor = isMobile ? 0.4 : 1;

  const yText1 = useTransform(springY, [0, 500], [0, -100 * parallaxFactor]);
  const yText2 = useTransform(springY, [0, 500], [0, 100 * parallaxFactor]);
  const yBg = useTransform(springY, [0, 500], [0, 150 * parallaxFactor]);
  const opacity = useTransform(springY, [0, 400], [1, 0]);
  const scale = useTransform(springY, [0, 500], [1, isMobile ? 1.05 : 1.2]);

  return (
    <section className="relative min-h-[100svh] w-full flex items-center overflow-hidden bg-black select-none">
      {/* Fundo imersivo */}
      <motion.div style={{ y: yBg, opacity, scale }} className="absolute inset-0 z-0">
        {/*
          O vídeo só entra no DOM no mobile. Antes ele era `md:hidden`, ou seja,
          invisível no desktop mas baixado assim mesmo — 5 MB à toa em toda visita.
        */}
        {isMobile && (
          <video
            autoPlay
            muted
            loop
            playsInline
            preload="metadata"
            poster="/assets/artist_pro.jpg"
            aria-hidden="true"
            className="absolute inset-0 w-full h-full object-cover grayscale brightness-[0.55] contrast-125 z-10"
          >
            <source src="/assets/hero_mobile.mp4" type="video/mp4" />
          </video>
        )}

        <img
          src="/assets/artist_pro.jpg"
          alt="Bisão tatuando no estúdio"
          width={2000}
          height={1333}
          style={({ fetchPriority: 'high', objectPosition: '85% center' } as any)}
          className="w-full h-full object-cover grayscale brightness-[0.55] contrast-125"
        />

        {/*
          O gradiente antigo (from-black via-transparent to-black) apagava o topo
          e a base por completo. Agora ele só escurece o suficiente para o texto
          ficar legível, sem engolir a foto.
        */}
        <div className="absolute inset-0 z-20 bg-gradient-to-b from-black/85 via-black/25 to-black/95" />
        <div className="absolute inset-0 z-20 bg-black/30 mix-blend-multiply hidden md:block" />
        <div className="absolute inset-0 z-20 opacity-[0.03] pointer-events-none bg-[url('https://www.transparenttextures.com/patterns/60-lines.png')] hidden md:block" />
      </motion.div>

      {/* Conteúdo */}
      <div className="relative z-30 w-full px-6 md:px-24 flex flex-col items-start justify-center min-h-[100svh] py-28 md:py-0 gap-6 md:gap-0">
        <motion.div
          initial={{ opacity: 0, x: -60 }}
          animate={{ opacity: 1, x: 0 }}
          transition={{ duration: 1.2, ease: [0.22, 1, 0.36, 1] }}
          className="md:mb-8"
        >
          {/* tracking-[1.5em] quebrava esta linha em três e virava enfeite ilegível. */}
          <span className="text-red-500 text-[10px] md:text-xs uppercase font-bold tracking-[0.35em] md:tracking-[0.8em] block mb-4">
            Mãos que desenham destinos
          </span>
          <div className="w-24 h-[1px] bg-red-700/50" />
        </motion.div>

        {/*
          Um único h1, visível também no celular. Antes eram dois h1 com
          `hidden md:block` — a versão mobile da página ficava sem título
          nenhum, para o visitante e para o Google.
        */}
        <h1 className="relative m-0">
          <motion.span
            style={{ y: yText1, willChange: 'transform' } as any}
            initial={{ opacity: 0, y: 80, rotate: -2 }}
            animate={{ opacity: 1, y: 0, rotate: 0 }}
            transition={{ duration: 1.2, delay: 0.2, ease: [0.22, 1, 0.36, 1] }}
            className="font-logo text-[19vw] md:text-[14vw] leading-[0.75] font-black tracking-[-0.05em] text-white uppercase block"
          >
            Bisão
          </motion.span>

          <motion.span
            style={{ y: yText2, willChange: 'transform' } as any}
            initial={{ opacity: 0, x: 120 }}
            animate={{ opacity: 1, x: 0 }}
            transition={{ duration: 1.5, delay: 0.4, ease: [0.22, 1, 0.36, 1] }}
            className="font-logo text-[19vw] md:text-[14vw] leading-[0.75] font-black tracking-[-0.05em] text-red-700 uppercase block ml-[8vw] md:ml-[10vw] -mt-[1vw] md:-mt-[2vw]"
          >
            Ink
          </motion.span>
        </h1>

        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ duration: 1, delay: 0.9 }}
          className="max-w-lg md:mt-16 flex flex-col items-start gap-8"
        >
          <p className="text-sm md:text-base tracking-[0.15em] md:tracking-[0.2em] uppercase font-light text-gray-300 leading-relaxed text-balance">
            Únicas e exclusivas. <span className="text-white font-medium">Nada de cópias.</span> A arte que nasce aqui, morre com você.
          </p>

          {/*
            O herói não tinha nenhuma chamada para ação — quem entrava pelo
            celular precisava rolar a página inteira para achar o WhatsApp.
          */}
          <a
            href={WHATSAPP_LINK}
            target="_blank"
            rel="noopener noreferrer"
            className="group inline-flex items-center gap-4 bg-red-700 hover:bg-white text-white hover:text-black px-8 py-4 rounded-full text-[10px] md:text-[11px] tracking-[0.35em] uppercase font-black transition-colors duration-500"
          >
            Fazer um orçamento
            <MessageCircle size={16} className="transition-transform duration-500 group-hover:translate-x-1" />
          </a>
        </motion.div>
      </div>

      {/* Moldura */}
      <div className="absolute top-0 left-0 w-full h-full border-0 md:border-[30px] border-black pointer-events-none z-20" />

      {/* Indicador de scroll */}
      <motion.div
        initial={{ opacity: 0, y: -20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ delay: 1.6, duration: 1, repeat: Infinity, repeatType: 'reverse' }}
        className="absolute bottom-16 right-16 flex-col items-center gap-6 z-30 hidden md:flex"
      >
        <span className="text-[9px] tracking-[0.6em] uppercase opacity-40 font-bold vertical-text">Scroll</span>
        <div className="w-[1px] h-20 bg-gradient-to-b from-red-700 to-transparent" />
      </motion.div>
    </section>
  );
};

export default Hero;
