import React from 'react';
import { motion } from 'framer-motion';
import { RITUAL_STEPS } from '../constants';

const Ritual: React.FC = () => {
  return (
    <section id="ritual" className="scroll-mt-28 py-24 md:py-64 bg-black relative overflow-hidden px-6 md:px-24">
      <div className="max-w-[1400px] mx-auto">
        <div className="mb-20 md:mb-48 text-left">
          <motion.h2
            initial={{ opacity: 0, y: 30 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            className="font-display text-5xl md:text-[8vw] text-white italic tracking-tighter leading-none mb-8 md:mb-12"
          >
            O Ritual <span className="text-red-600 block">Sagrado</span>
          </motion.h2>
          <div className="w-32 md:w-48 h-[1px] bg-red-900" />
        </div>

        <div className="space-y-24 md:space-y-64 relative">
          <div className="absolute left-8 md:left-24 top-0 bottom-0 w-[1px] bg-gradient-to-b from-red-900 via-white/5 to-transparent z-0" />

          {RITUAL_STEPS.map((step, idx) => (
            <motion.div
              key={step.number}
              initial={{ opacity: 0, x: -30 }}
              whileInView={{ opacity: 1, x: 0 }}
              viewport={{ once: true, margin: '-100px' }}
              transition={{ duration: 1.2, ease: [0.22, 1, 0.36, 1] }}
              className={`relative z-10 flex flex-col md:flex-row gap-8 md:gap-32 items-start ${
                idx % 2 !== 0 ? 'md:pl-64' : ''
              }`}
            >
              <span className="absolute -left-8 md:-left-24 -top-20 md:-top-48 font-logo text-[28vw] md:text-[20vw] text-white/[0.03] pointer-events-none select-none z-0">
                {step.number}
              </span>

              <div className="w-14 h-14 md:w-16 md:h-16 rounded-full bg-black border border-red-700 flex items-center justify-center shrink-0 relative z-10 shadow-[0_0_20px_rgba(185,28,28,0.3)]">
                <span className="text-red-500 font-bold font-logo text-sm">{step.number}</span>
              </div>

              <div className="max-w-xl">
                <h3 className="font-display text-3xl md:text-6xl text-white mb-4 md:mb-8 italic tracking-tight">
                  {step.title}
                </h3>
                <p className="text-gray-300 text-base md:text-xl leading-relaxed text-balance">{step.description}</p>
              </div>
            </motion.div>
          ))}
        </div>
      </div>
    </section>
  );
};

export default Ritual;
