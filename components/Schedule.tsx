
import React from 'react';
import { motion } from 'framer-motion';
import { SCHEDULE_DATA } from '../constants';
import { Calendar, ArrowRight, MapPin } from 'lucide-react';
import { LocationMap } from './ui/expand-map';

const Schedule: React.FC = () => {
  return (
    <section id="schedule" className="py-48 bg-black px-8 md:px-24 border-t border-white/5 relative overflow-hidden">
      {/* Background Graphic */}
      <div className="absolute top-0 right-0 w-1/2 h-full bg-red-900/5 blur-[120px] pointer-events-none" />

      <div className="max-w-7xl mx-auto relative z-10">
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-24 items-start">
          
          {/* Left Side: Agenda & Booking */}
          <div className="lg:col-span-7 flex flex-col justify-center min-h-[400px]">
            <div className="mb-12">
              <span className="text-red-700 text-[10px] tracking-[0.5em] uppercase mb-4 block font-bold">Exclusividade</span>
              <h2 className="font-display text-7xl md:text-8xl text-white italic leading-[0.85] tracking-tighter text-balance">
                Inicie seu <br /> <span className="text-red-700">Ritual Privado</span>
              </h2>
            </div>

            <p className="text-gray-400 text-lg md:text-xl leading-relaxed max-w-md mb-16 tracking-tight">
              Cada obra é única. Entre em contato para uma consultoria exclusiva e reserve seu lugar na nossa agenda de 2026.
            </p>

            <motion.a 
              href="https://l.instagram.com/?u=https%3A%2F%2Fapi.whatsapp.com%2Fsend%3Fphone%3D5591993171598%26text%3DOl%25C3%25A1%2Btudo%2Bbem%253F%2521%2BGostaria%2Bde%2Bfazer%2Bum%2Bor%25C3%25A7amento%2B%26utm_source%3Dig%26utm_medium%3Dsocial%26utm_content%3Dlink_in_bio%26fbclid%3DPAZXh0bgNhZW0CMTEAc3J0YwZhcHBfaWQMMjU2MjgxMDQwNTU4AAGnupCyT1K3v5hT2Fh_WB97saQqXgXJV_O3sfjVgHlwSJxutaihFmiI-GIVBc0_aem_ztZ5im5rcZzf8DY3Cb96bQ&e=AT7h8KJTNVVKsJoHtQWWkkkGJNbQO3FVYzOAHwWfsBCUBku594X5KOBS5H4_gHuXPACqvfAVNLfhTWmKGGfq7OaQt63s2miDc184LRh_NA"
              target="_blank"
              rel="noopener noreferrer"
              whileHover={{ scale: 1.05, backgroundColor: "rgba(185, 28, 28, 0.2)" }}
              whileTap={{ scale: 0.95 }}
              className="relative group flex items-center justify-between gap-8 bg-white/5 backdrop-blur-xl border border-white/10 text-white px-10 py-6 rounded-full text-[11px] tracking-[0.5em] uppercase font-black transition-all shadow-[0_20px_50px_rgba(0,0,0,0.3)] w-fit"
            >
              <span className="relative z-10 flex items-center gap-6">
                Solicitar Orçamento <Calendar size={18} className="text-red-700" />
              </span>
              <div className="w-10 h-10 rounded-full bg-red-700 flex items-center justify-center group-hover:bg-white transition-colors duration-500">
                <ArrowRight size={16} className="text-white group-hover:text-red-700" />
              </div>
            </motion.a>
          </div>

          {/* Right Side: Location & Map */}
          <div className="lg:col-span-5 flex flex-col items-center lg:items-end gap-12 lg:pt-32">
            <div className="text-right hidden lg:block">
              <span className="text-red-700 text-[10px] tracking-[0.5em] uppercase mb-4 block font-bold italic">O Santuário</span>
              <p className="text-white font-logo text-sm tracking-[0.3em] uppercase leading-relaxed">
                R. 28 de Setembro, 600 <br /> 
                Reduto, Belém - PA
              </p>
              <p className="text-gray-500 text-[10px] tracking-[0.2em] mt-4 uppercase">
                CEP 66053-355
              </p>
            </div>

            <div className="relative group">
              {/* Decorative border behind map */}
              <div className="absolute -inset-4 border border-red-900/20 rounded-3xl group-hover:border-red-700/40 transition-colors duration-700 -z-10" />
              
              <LocationMap 
                location="Cromia Tattoo Studio" 
                coordinates="1.4507° S, 48.4902° W" 
              />
            </div>

            <div className="flex flex-col items-center lg:items-end gap-4">
              <div className="flex items-center gap-3 text-red-700">
                <MapPin size={14} />
                <span className="text-[10px] tracking-[0.4em] uppercase font-bold">Localização Privilegiada</span>
              </div>
              <p className="text-gray-500 text-[10px] tracking-[0.2em] uppercase text-center lg:text-right max-w-xs leading-loose">
                Atendimento exclusivo com hora marcada em ambiente privativo no coração do Reduto.
              </p>
            </div>
          </div>

        </div>
      </div>
    </section>
  );
};

export default Schedule;
