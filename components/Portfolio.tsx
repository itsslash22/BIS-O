
import React from 'react';
import { motion } from 'framer-motion';
import { PORTFOLIO_DATA } from '../constants';

const Portfolio: React.FC = () => {
  return (
    <section id="gallery" className="py-48 bg-black px-4 md:px-12 relative overflow-hidden">
      {/* Dynamic Background Noise */}
      <div className="absolute inset-0 opacity-[0.03] pointer-events-none bg-[url('https://www.transparenttextures.com/patterns/micro-carbon.png')]" />

      <div className="flex flex-col md:flex-row justify-between items-start md:items-end mb-32 px-4 md:px-12 gap-12">
        <div className="max-w-2xl relative">
          <motion.h2
            initial={{ opacity: 0, x: -50 }}
            whileInView={{ opacity: 1, x: 0 }}
            viewport={{ once: true }}
            className="font-display text-7xl md:text-[10vw] text-white leading-[0.8] mb-8 italic tracking-tighter text-balance"
          >
            A Galeria <br /> <span className="text-red-700 ml-[10vw]">das Sombras</span>
          </motion.h2>
          <p className="text-gray-500 uppercase tracking-[0.5em] text-[10px] md:text-xs font-bold pl-2 border-l border-red-700">
            Obras Curadas de Blackwork & Irezumi
          </p>
        </div>

        <motion.div
          whileHover={{ x: 10 }}
          className="hidden md:block group cursor-pointer"
        >
          <span className="text-[10px] tracking-[0.5em] uppercase text-gray-500 group-hover:text-red-700 transition-colors duration-500">
            Explorar Arquivos →
          </span>
          <div className="h-[1px] w-full bg-gray-900 group-hover:bg-red-700 mt-2 transition-colors duration-500" />
        </motion.div>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-12 gap-6 md:gap-12 px-4 md:px-12">
        {PORTFOLIO_DATA.map((item, idx) => (
          <motion.div
            key={item.id}
            initial={{ opacity: 0, scale: 0.9, y: 50 }}
            whileInView={{ opacity: 1, scale: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{
              delay: idx * 0.15,
              duration: 1.2,
              type: "spring",
              stiffness: 40
            }}
            className={`relative group overflow-hidden ${idx % 3 === 0 ? 'md:col-span-8 md:row-span-2' :
              idx % 5 === 0 ? 'md:col-span-6' : 'md:col-span-4'
              }`}
          >
            <div className="aspect-[4/5] md:aspect-auto w-full h-full min-h-[500px] overflow-hidden">
              <img
                src={item.image}
                alt={item.title}
                width={1200}
                height={1500}
                loading="lazy"
                className="w-full h-full object-cover grayscale brightness-75 group-hover:grayscale-0 group-hover:scale-110 group-hover:brightness-100 transition-all duration-[1200ms] ease-[0.22, 1, 0.36, 1]"
              />
            </div>

            {/* Minimalist Brutalist Info Reveal */}
            <div className="absolute inset-0 bg-gradient-to-t from-black via-transparent to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-700 p-12 flex flex-col justify-end">
              <motion.div
                initial={{ y: 20, opacity: 0 }}
                whileHover={{ y: 0, opacity: 1 }}
                className="space-y-4"
              >
                <span className="bg-red-700 text-white text-[9px] tracking-[0.3em] uppercase px-4 py-2 inline-block font-bold">
                  {item.category}
                </span>
                <h3 className="font-display text-4xl italic text-white leading-none">
                  {item.title}
                </h3>
              </motion.div>
            </div>

            {/* Sharp Geometric Border Overlay */}
            <div className="absolute inset-0 border border-white/0 group-hover:border-white/10 transition-colors duration-700 pointer-events-none" />
          </motion.div>
        ))}
      </div>
    </section>
  );
};

export default Portfolio;
