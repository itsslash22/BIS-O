import React from 'react';
import { motion } from 'framer-motion';
import { INSTAGRAM_LINK, PORTFOLIO_DATA } from '../constants';

const Portfolio: React.FC = () => {
  return (
    <section id="gallery" className="scroll-mt-28 py-24 md:py-48 bg-black px-4 md:px-12 relative overflow-hidden">
      <div className="absolute inset-0 opacity-[0.03] pointer-events-none bg-[url('https://www.transparenttextures.com/patterns/micro-carbon.png')]" />

      <div className="flex flex-col md:flex-row justify-between items-start md:items-end mb-16 md:mb-32 px-2 md:px-12 gap-8 md:gap-12">
        <div className="max-w-2xl relative">
          <motion.h2
            initial={{ opacity: 0, x: -50 }}
            whileInView={{ opacity: 1, x: 0 }}
            viewport={{ once: true }}
            className="font-display text-5xl md:text-[10vw] text-white leading-[0.85] md:leading-[0.8] mb-6 md:mb-8 italic tracking-tighter text-balance"
          >
            A Galeria <br /> <span className="text-red-600 ml-[8vw] md:ml-[10vw]">das Sombras</span>
          </motion.h2>
          <p className="text-gray-400 uppercase tracking-[0.35em] md:tracking-[0.5em] text-[10px] md:text-xs font-bold pl-3 border-l border-red-700">
            Obras Curadas de Blackwork &amp; Irezumi
          </p>
        </div>

        {/* Antes isto parecia um botão e não fazia nada. Agora leva ao Instagram, que é onde o acervo vive. */}
        <motion.a
          href={INSTAGRAM_LINK}
          target="_blank"
          rel="noopener noreferrer"
          whileHover={{ x: 10 }}
          className="group cursor-pointer"
        >
          <span className="text-[10px] tracking-[0.4em] md:tracking-[0.5em] uppercase text-gray-400 group-hover:text-red-500 transition-colors duration-500">
            Ver mais no Instagram →
          </span>
          <div className="h-[1px] w-full bg-gray-800 group-hover:bg-red-700 mt-2 transition-colors duration-500" />
        </motion.a>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-12 gap-4 md:gap-12 px-2 md:px-12">
        {PORTFOLIO_DATA.map((item, idx) => (
          <motion.div
            key={item.id}
            initial={{ opacity: 0, scale: 0.95, y: 40 }}
            whileInView={{ opacity: 1, scale: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ delay: idx * 0.1, duration: 1, type: 'spring', stiffness: 40 }}
            className={`relative group overflow-hidden ${
              idx % 3 === 0 ? 'md:col-span-8 md:row-span-2' : idx % 5 === 0 ? 'md:col-span-6' : 'md:col-span-4'
            }`}
          >
            <div className="aspect-[4/5] md:aspect-auto w-full h-full md:min-h-[500px] overflow-hidden">
              <img
                src={item.image}
                alt={`${item.title} — tatuagem ${item.category} por Bisão Ink`}
                width={1200}
                height={1500}
                loading="lazy"
                decoding="async"
                className="w-full h-full object-cover grayscale brightness-90 group-hover:grayscale-0 group-hover:scale-105 group-hover:brightness-100 transition-all duration-1000"
              />
            </div>

            {/* Info: no toque (mobile) não existe hover, então o rótulo fica sempre visível. */}
            <div className="absolute inset-0 bg-gradient-to-t from-black via-black/20 to-transparent md:opacity-0 md:group-hover:opacity-100 transition-opacity duration-700 p-6 md:p-12 flex flex-col justify-end">
              <div className="space-y-3">
                <span className="bg-red-700 text-white text-[9px] tracking-[0.3em] uppercase px-3 py-1.5 inline-block font-bold">
                  {item.category}
                </span>
                <h3 className="font-display text-2xl md:text-4xl italic text-white leading-none">{item.title}</h3>
              </div>
            </div>

            <div className="absolute inset-0 border border-white/0 group-hover:border-white/10 transition-colors duration-700 pointer-events-none" />
          </motion.div>
        ))}
      </div>
    </section>
  );
};

export default Portfolio;
