
import React from 'react';
import { Instagram, Mail, Facebook, Twitter } from 'lucide-react';

const Footer: React.FC = () => {
  return (
    <footer className="py-32 bg-black px-8 md:px-24 border-t border-white/5 relative overflow-hidden">
      <div className="max-w-7xl mx-auto flex flex-col md:flex-row justify-between items-start md:items-end gap-16 relative z-10">
        <div className="flex flex-col items-start gap-8">
          <div className="font-logo text-3xl md:text-4xl tracking-[0.4em] font-black text-white">
            BISÃO INK
          </div>
          <p className="text-gray-500 text-[10px] md:text-xs tracking-[0.5em] uppercase font-bold max-w-sm leading-loose">
            Tattoo Tradicional • Única & Exclusiva • Nada de Cópias
          </p>
        </div>

        <div className="flex flex-col md:flex-row gap-12 md:gap-32 w-full md:w-auto">
          <div className="space-y-6">
            <span className="text-red-700 text-[9px] tracking-[0.4em] uppercase font-black block">Conectar</span>
            <div className="flex gap-8">
              <a href="#" className="text-white hover:text-red-700 transition-colors duration-500" aria-label="Instagram"><Instagram size={24} /></a>
              <a href="#" className="text-white hover:text-red-700 transition-colors duration-500" aria-label="E-mail"><Mail size={24} /></a>
            </div>
          </div>

          <div className="space-y-6">
            <span className="text-red-700 text-[9px] tracking-[0.4em] uppercase font-black block">Legal</span>
            <div className="flex flex-col gap-4 text-[10px] text-gray-400 tracking-[0.2em] uppercase font-bold">
              <a href="#" className="hover:text-white transition-colors duration-500">Privacidade</a>
              <a href="#" className="hover:text-white transition-colors duration-500">Termos</a>
            </div>
          </div>
        </div>
      </div>

      <div className="mt-32 pt-16 border-t border-white/5 flex flex-col md:flex-row justify-between items-center gap-8 relative z-10">
        <p className="text-gray-700 text-[9px] tracking-[0.4em] uppercase font-black">© 2026 BISÃO INK ARTISTRY — FEITO COM SANGUE E TINTA</p>
        <span className="text-gray-800 text-[9px] tracking-[0.4em] uppercase font-black">BRASIL • MUNDO</span>
      </div>

      {/* Massive Brutalist Background Text */}
      <div className="absolute -bottom-24 left-0 w-full flex flex-col items-start opacity-[0.02] pointer-events-none select-none z-0">
        <span className="font-logo text-[40vw] leading-[0.7] font-black tracking-[-0.05em] translate-x-[-10%]">BISÃO</span>
        <span className="font-logo text-[40vw] leading-[0.7] font-black tracking-[-0.05em] translate-x-[20%] text-red-900">INK</span>
      </div>
    </footer>
  );
};

export default Footer;
