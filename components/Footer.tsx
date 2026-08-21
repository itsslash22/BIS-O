import React from 'react';
import { Instagram, MessageCircle, MapPin } from 'lucide-react';
import { INSTAGRAM_LINK, MAPS_LINK, STUDIO, WHATSAPP_LINK } from '../constants';

const Footer: React.FC = () => {
  return (
    <footer className="py-20 md:py-32 bg-black px-6 md:px-24 border-t border-white/5 relative overflow-hidden">
      <div className="max-w-7xl mx-auto flex flex-col md:flex-row justify-between items-start md:items-end gap-12 md:gap-16 relative z-10">
        <div className="flex flex-col items-start gap-6 md:gap-8">
          <div className="font-logo text-2xl md:text-4xl tracking-[0.3em] md:tracking-[0.4em] font-black text-white">
            BISÃO INK
          </div>
          <p className="text-gray-400 text-[10px] md:text-xs tracking-[0.35em] md:tracking-[0.5em] uppercase font-bold max-w-sm leading-loose">
            Tattoo Tradicional • Única &amp; Exclusiva • Nada de Cópias
          </p>
        </div>

        <div className="flex flex-col sm:flex-row gap-10 md:gap-24 w-full md:w-auto">
          <div className="space-y-5">
            <span className="text-red-500 text-[9px] tracking-[0.4em] uppercase font-black block">Conectar</span>
            {/* O ícone de e-mail era href="#" e não levava a lugar nenhum. */}
            <div className="flex gap-6">
              <a
                href={INSTAGRAM_LINK}
                target="_blank"
                rel="noopener noreferrer"
                className="text-white hover:text-red-500 transition-colors duration-500"
                aria-label="Instagram do Bisão Ink"
              >
                <Instagram size={24} />
              </a>
              <a
                href={WHATSAPP_LINK}
                target="_blank"
                rel="noopener noreferrer"
                className="text-white hover:text-red-500 transition-colors duration-500"
                aria-label="Falar no WhatsApp"
              >
                <MessageCircle size={24} />
              </a>
            </div>
          </div>

          {/*
            Aqui ficavam "Privacidade" e "Termos", ambos href="#" e sem página
            do outro lado. O espaço vale mais com o endereço: repetir o
            endereço no rodapé é o que os buscadores esperam de negócio local.
          */}
          <div className="space-y-5">
            <span className="text-red-500 text-[9px] tracking-[0.4em] uppercase font-black block">Estúdio</span>
            <a
              href={MAPS_LINK}
              target="_blank"
              rel="noopener noreferrer"
              className="group flex items-start gap-3 text-gray-300 hover:text-white transition-colors duration-500"
            >
              <MapPin size={14} className="text-red-500 mt-1 shrink-0" />
              <address className="not-italic text-[10px] tracking-[0.2em] uppercase font-bold leading-loose">
                {STUDIO.street}
                <br />
                {STUDIO.district}, {STUDIO.city} - {STUDIO.state}
                <br />
                CEP {STUDIO.postalCode}
              </address>
            </a>
          </div>
        </div>
      </div>

      <div className="mt-16 md:mt-32 pt-10 md:pt-16 border-t border-white/5 flex flex-col md:flex-row justify-between items-center gap-6 relative z-10">
        {/* text-gray-700/800 sobre preto era praticamente invisível. */}
        <p className="text-gray-500 text-[9px] tracking-[0.35em] uppercase font-black text-center md:text-left">
          © {new Date().getFullYear()} Bisão Ink Artistry — Feito com sangue e tinta
        </p>
        <span className="text-gray-500 text-[9px] tracking-[0.35em] uppercase font-black">Belém • Pará • Brasil</span>
      </div>

      <div className="absolute -bottom-16 md:-bottom-24 left-0 w-full flex flex-col items-start opacity-[0.02] pointer-events-none select-none z-0">
        <span className="font-logo text-[40vw] leading-[0.7] font-black tracking-[-0.05em] translate-x-[-10%]">BISÃO</span>
        <span className="font-logo text-[40vw] leading-[0.7] font-black tracking-[-0.05em] translate-x-[20%] text-red-900">INK</span>
      </div>
    </footer>
  );
};

export default Footer;
