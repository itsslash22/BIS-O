
import React from 'react';
import { motion } from 'framer-motion';
import { SCHEDULE_DATA } from '../constants';
import { Calendar, ArrowRight } from 'lucide-react';

const Schedule: React.FC = () => {
  return (
    <section id="schedule" className="py-48 bg-black px-8 md:px-24 border-t border-white/5 relative overflow-hidden">
      {/* Background Graphic */}
      <div className="absolute top-0 right-0 w-1/2 h-full bg-red-900/5 blur-[120px] pointer-events-none" />

      <div className="max-w-6xl mx-auto relative z-10">
        <div className="flex flex-col md:flex-row justify-between items-start md:items-end mb-32 gap-8">
          <div>
            <span className="text-red-700 text-[10px] tracking-[0.5em] uppercase mb-4 block font-bold">Disponibilidade</span>
            <h2 className="font-display text-7xl md:text-9xl text-white italic leading-none tracking-tighter">Agenda</h2>
          </div>
          <div className="text-right text-gray-600 text-[10px] tracking-[0.4em] flex items-center gap-6 font-bold">
            <div className="w-12 h-[1px] bg-red-900" />
            <span>SESSÕES 2026</span>
          </div>
        </div>

        <div className="space-y-0 divide-y divide-white/5">
          {SCHEDULE_DATA.map((event, idx) => (
            <motion.div
              key={idx}
              initial={{ opacity: 0, x: -50 }}
              whileInView={{ opacity: 1, x: 0 }}
              viewport={{ once: true }}
              transition={{ delay: idx * 0.15, duration: 1.2, ease: [0.22, 1, 0.36, 1] }}
              className="py-16 md:py-20 flex flex-col md:flex-row justify-between items-center group cursor-pointer hover:bg-white/[0.01] transition-all duration-700 px-8"
            >
              <div className="flex flex-col md:flex-row gap-12 md:gap-24 items-center w-full md:w-auto">
                <div className="text-red-700 font-logo text-xs tracking-widest border border-red-900/30 px-4 py-2">
                  {event.time}
                </div>
                <div className="text-center md:text-left">
                  <h3 className="text-4xl md:text-5xl font-display italic text-white group-hover:text-red-700 transition-colors duration-500 tracking-tight">
                    {event.title}
                  </h3>
                  <p className="text-gray-500 text-[10px] tracking-[0.3em] mt-3 uppercase font-bold">
                    {event.description}
                  </p>
                </div>
              </div>

              <div className="flex items-center gap-16 mt-12 md:mt-0">
                <span className="text-xs font-bold tracking-[0.4em] text-gray-400 font-logo">{event.date}</span>
                <motion.div
                  whileHover={{ x: 10, backgroundColor: '#b91c1c' }}
                  className="w-14 h-14 border border-white/10 flex items-center justify-center rounded-full transition-all duration-500"
                >
                  <ArrowRight size={20} className="text-white" />
                </motion.div>
              </div>
            </motion.div>
          ))}
        </div>

        <div className="mt-32 flex justify-center">
          <button className="relative group overflow-hidden bg-red-700 text-white px-16 py-8 text-[10px] tracking-[0.6em] uppercase font-black transition-all shadow-[0_0_50px_rgba(185,28,28,0.2)]">
            <span className="relative z-10 flex items-center gap-6">
              Agendar Consultoria <Calendar size={18} />
            </span>
            <div className="absolute inset-0 bg-white translate-y-full group-hover:translate-y-0 transition-transform duration-500 mix-blend-difference" />
          </button>
        </div>
      </div>
    </section>
  );
};

export default Schedule;
