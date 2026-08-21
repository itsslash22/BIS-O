import React from 'react';
import { MessageCircle } from 'lucide-react';
import { HeroCarousel } from './ui/hero-carousel';
import { FLASH_PIECES, WHATSAPP_LINK } from '../constants';

/**
 * Herói montado em cima do HeroCarousel, adaptado para obra emoldurada em vez
 * da fotografia editorial para a qual o componente foi desenhado:
 *
 * - `fit="contain"`: a tela aparece inteira, moldura e tudo. O corte 3:4 do
 *   original decapitava a águia e as carpas, que são bem mais largas que altas.
 * - `grade={false}`: o componente recolore o fundo com o tom de cada imagem.
 *   Em foto abstrata isso é o efeito; em obra de tatuador é reescrever a cor
 *   que o artista escolheu. O accent fica só como um brilho no fundo escuro.
 * - Sem `brand`/`onBack`/`onMenu`: o site já tem Header próprio, e a barra
 *   interna do componente duplicaria a navegação.
 * - `eyebrow` carrega o <h1> da página. O título de cada peça é <h2> e troca a
 *   cada slide — nenhum h1 deveria mudar quando a pessoa arrasta um carrossel.
 */
const HeroFlash: React.FC = () => {
  return (
    <section className="relative h-[100svh] w-full bg-black">
      <HeroCarousel
        items={FLASH_PIECES}
        defaultIndex={4}
        fit="contain"
        grade={false}
        autoplay
        autoplayDelay={5000}
        ariaLabel="Telas do Bisão Ink"
        // As variantes arbitrárias trocam a tipografia do componente pela do
        // site sem precisar mexer por dentro dele.
        className="[&_h2]:font-display [&_h2]:italic [&_h2]:tracking-tighter"
        // O preflight do Tailwind já zera margem, tamanho e peso do h1, então
        // ele herda a tipografia do slot sem precisar de classe.
        eyebrow={<h1>Bisão Ink — Tatuagem autoral em Belém</h1>}
        cta={
          <a
            href={WHATSAPP_LINK}
            target="_blank"
            rel="noopener noreferrer"
            className="group inline-flex items-center gap-3 rounded-full bg-red-700 px-6 py-3.5 text-[10px] font-black uppercase tracking-[0.3em] text-white transition-colors duration-500 hover:bg-white hover:text-black"
          >
            Fazer um orçamento
            <MessageCircle size={14} className="transition-transform duration-500 group-hover:translate-x-1" />
          </a>
        }
      />
    </section>
  );
};

export default HeroFlash;
