import React from 'react';
import { motion } from 'framer-motion';
import { Calendar, ArrowRight, MapPin } from 'lucide-react';
import { LocationMap } from './ui/expand-map';
import { MAPS_LINK, STUDIO, WHATSAPP_LINK } from '../constants';

const Schedule: React.FC = () => {
  return (
    <section
      id="schedule"
      className="scroll-mt-28 py-24 md:py-48 bg-black px-6 md:px-24 border-t border-white/5 relative overflow-hidden"
    >
      <div className="absolute top-0 right-0 w-1/2 h-full bg-red-900/5 blur-[120px] pointer-events-none" />

      <div className="max-w-7xl mx-auto relative z-10">
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-16 lg:gap-24 items-start">

          {/* Agendamento */}
          <div className="lg:col-span-7 flex flex-col justify-center">
            <div className="mb-10">
              <span className="text-red-500 text-[10px] tracking-[0.5em] uppercase mb-4 block font-bold">Exclusividade</span>
              <h2 className="font-display text-5xl md:text-8xl text-white italic leading-[0.9] md:leading-[0.85] tracking-tighter text-balance">
                Inicie seu <br /> <span className="text-red-600">Ritual Privado</span>
              </h2>
            </div>

            <p className="text-gray-300 text-base md:text-xl leading-relaxed max-w-md mb-12 tracking-tight">
              Cada obra é única. Entre em contato para uma consultoria exclusiva e reserve seu lugar na agenda.
            </p>

            <motion.a
              href={WHATSAPP_LINK}
              target="_blank"
              rel="noopener noreferrer"
              whileHover={{ scale: 1.03 }}
              whileTap={{ scale: 0.97 }}
              className="relative group flex items-center justify-between gap-6 bg-red-700 hover:bg-white text-white hover:text-black px-8 md:px-10 py-5 md:py-6 rounded-full text-[10px] md:text-[11px] tracking-[0.35em] md:tracking-[0.5em] uppercase font-black transition-colors duration-500 w-full sm:w-fit"
            >
              <span className="relative z-10 flex items-center gap-4">
                Solicitar Orçamento <Calendar size={18} />
              </span>
              <div className="w-10 h-10 rounded-full bg-black/20 group-hover:bg-red-700 flex items-center justify-center transition-colors duration-500 shrink-0">
                <ArrowRight size={16} className="text-white" />
              </div>
            </motion.a>
          </div>

          {/* Endereço + mapa */}
          <div className="lg:col-span-5 flex flex-col items-start lg:items-end gap-8 lg:pt-24 w-full">
            {/*
              Este bloco era `hidden lg:block`: quem abria no celular nunca via
              a rua, o número nem o CEP do estúdio. Agora aparece em toda tela
              e o endereço inteiro é um link para o Google Maps.
            */}
            <a
              href={MAPS_LINK}
              target="_blank"
              rel="noopener noreferrer"
              className="group text-left lg:text-right w-full lg:w-auto"
            >
              <span className="text-red-500 text-[10px] tracking-[0.5em] uppercase mb-4 block font-bold">O Santuário</span>
              <address className="not-italic">
                <p className="text-white font-logo text-xs md:text-sm tracking-[0.25em] md:tracking-[0.3em] uppercase leading-relaxed group-hover:text-red-500 transition-colors duration-500">
                  {STUDIO.street} <br />
                  {STUDIO.district}, {STUDIO.city} - {STUDIO.state}
                </p>
                <p className="text-gray-400 text-[10px] tracking-[0.2em] mt-3 uppercase">CEP {STUDIO.postalCode}</p>
              </address>
            </a>

            {/*
              O card do mapa é dono das ações (ver mapa, traçar rota, Waze).
              O "Como chegar" que ficava aqui repetia o botão de rota logo abaixo.
            */}
            <div className="w-full flex justify-center lg:justify-end">
              <LocationMap location={STUDIO.name} coordinates={STUDIO.coordinates} />
            </div>

            <div className="flex flex-col items-start lg:items-end gap-3">
              <div className="flex items-center gap-3 text-red-500">
                <MapPin size={14} />
                <span className="text-[10px] tracking-[0.4em] uppercase font-bold">Localização Privilegiada</span>
              </div>
              <p className="text-gray-400 text-[10px] tracking-[0.2em] uppercase text-left lg:text-right max-w-xs leading-loose">
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
