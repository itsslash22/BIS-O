import React from 'react';
import { HeroCarousel } from './ui/hero-carousel';
import { FLASH_PIECES } from '../constants';

/**
 * Seção de quadros, montada em cima do HeroCarousel — que foi desenhado como
 * herói de tela cheia. As adaptações para ele viver no meio da página:
 *
 * - `wheelNavigation={false}`: o componente captura a roda do mouse e chama
 *   preventDefault. Num herói que ocupa a tela inteira isso funciona; no meio
 *   da página vira armadilha de scroll — a pessoa teria que passar pelos 14
 *   quadros antes da página voltar a rolar. Aqui se navega por arrasto,
 *   clique e setas do teclado.
 * - `fit="contain"`: a tela aparece inteira, moldura e tudo. O corte 3:4 do
 *   original decapitava a águia e as carpas, que são bem mais largas que altas.
 * - `grade={false}`: o componente recolore o fundo com o tom de cada imagem.
 *   Em foto abstrata isso é o efeito; em obra de tatuador é reescrever a cor
 *   que o artista escolheu. O accent fica só como um brilho no fundo escuro.
 * - `titleAs="h3"`: o h2 da seção é o "Quadros" do eyebrow, então o título de
 *   cada peça desce um nível e a ordem dos cabeçalhos da página se mantém.
 */
const Quadros: React.FC = () => {
  return (
    <section
      id="quadros"
      aria-labelledby="quadros-titulo"
      className="scroll-mt-28 relative h-[88svh] min-h-[34rem] w-full bg-black border-t border-white/5"
    >
      <HeroCarousel
        items={FLASH_PIECES}
        defaultIndex={0}
        fit="contain"
        // 12 das 14 telas são retrato em torno de 0,80 (1122x1402). Casando o
        // card com essa proporção elas preenchem de borda a borda; a águia e as
        // carpas, que são deitadas, sobram nas laterais — e sobre o card escuro
        // essa sobra lê como passe-partout. Nos 3:4 originais era o contrário:
        // as 12 sobravam também.
        cardAspect={0.8}
        // 0.264 dava um card de 183px de altura — pequeno demais para ler o
        // traço. A fita começa na metade da seção, então acima de ~0.45 ela
        // passa da borda de baixo; 0.36 aproveita o espaço e deixa o trilho
        // de posição respirar.
        cardHeight={0.36}
        lightbox
        grade={false}
        wheelNavigation={false}
        titleAs="h3"
        autoplay
        autoplayDelay={5000}
        ariaLabel="Quadros do Bisão Ink"
        // As variantes arbitrárias trocam a tipografia do componente pela do
        // site sem precisar mexer por dentro dele.
        className="[&_h3]:font-display [&_h3]:italic [&_h3]:tracking-tighter"
        eyebrow={
          <h2 id="quadros-titulo">Quadros — pintados à mão no estúdio</h2>
        }
      />
    </section>
  );
};

export default Quadros;
