import React from 'react';
import { motion } from 'framer-motion';
import { REGIOES, type Lado, type Regiao } from '../../lib/gift';

interface BodyMapProps {
  lado: Lado;
  onLadoChange: (lado: Lado) => void;
  selecionada: string | null;
  onSelecionar: (id: string) => void;
}

/**
 * Silhueta estilizada — um boneco articulado, não um diagrama médico.
 *
 * Duas decisões que valem explicação:
 *
 * 1. O corpo É feito das regiões. Cada parte clicável também desenha o boneco,
 *    então não existe desalinho possível entre o que se vê e o que se clica.
 *    A primeira versão desenhava um contorno e colava as áreas por cima; um
 *    `d` errado fazia o braço sumir e a seleção cair no vazio.
 *
 * 2. As formas são caixas com coordenadas, não `d` escrito à mão. Ajustar a
 *    proporção de um braço vira mudar um número, em vez de recalcular curvas
 *    de Bézier no olho.
 */
type Caixa = [x: number, y: number, largura: number, altura: number, raio: number];

const caixaParaPath = ([x, y, w, h, r]: Caixa) =>
  `M${x + r} ${y} h${w - r * 2} a${r} ${r} 0 0 1 ${r} ${r} v${h - r * 2} a${r} ${r} 0 0 1 ${-r} ${r} ` +
  `h${-(w - r * 2)} a${r} ${r} 0 0 1 ${-r} ${-r} v${-(h - r * 2)} a${r} ${r} 0 0 1 ${r} ${-r} z`;

const paths = (...caixas: Caixa[]) => caixas.map(caixaParaPath).join(' ');

/** Partes espelhadas viram um `d` só: braço esquerdo e direito são uma escolha. */
const FORMAS: Record<string, string> = {
  // --- frente ---
  pescoco: paths([93, 42, 14, 10, 3]),
  peito: paths([68, 54, 64, 34, 8]),
  costela: paths([68, 90, 18, 28, 5], [114, 90, 18, 28, 5]),
  abdomen: paths([86, 90, 28, 40, 5]),
  braco: paths([48, 56, 18, 46, 8], [134, 56, 18, 46, 8]),
  antebraco: paths([46, 104, 16, 44, 7], [138, 104, 16, 44, 7]),
  mao: paths([44, 150, 16, 22, 7], [140, 150, 16, 22, 7]),
  coxa: paths([74, 132, 22, 58, 8], [104, 132, 22, 58, 8]),
  panturrilha: paths([76, 192, 18, 56, 8], [106, 192, 18, 56, 8]),
  // --- costas ---
  nuca: paths([93, 42, 14, 10, 3]),
  ombro: paths([64, 54, 30, 20, 8], [106, 54, 30, 20, 8]),
  costas: paths([68, 76, 64, 48, 6]),
  lombar: paths([76, 126, 48, 24, 5]),
  posterior: paths([74, 152, 22, 96, 8], [104, 152, 22, 96, 8]),
};

const CABECA = 'M100 13 a15 15 0 1 1-0.1 0 z';

/** Compõem o boneco mas não são escolha — ninguém tatua "a cabeça inteira". */
const DECORATIVAS: Record<Lado, string[]> = {
  frente: [CABECA],
  costas: [
    CABECA,
    paths([48, 56, 18, 92, 8], [134, 56, 18, 92, 8]),
    paths([44, 150, 16, 22, 7], [140, 150, 16, 22, 7]),
  ],
};

const Agulhas: React.FC<{ nivel: number }> = ({ nivel }) => (
  <span className="inline-flex shrink-0 gap-1" aria-hidden>
    {[1, 2, 3, 4, 5].map((n) => (
      <span key={n} className={`h-3 w-[2px] rounded-full ${n <= nivel ? 'bg-red-600' : 'bg-white/20'}`} />
    ))}
  </span>
);

export const BodyMap: React.FC<BodyMapProps> = ({ lado, onLadoChange, selecionada, onSelecionar }) => {
  const regioes = REGIOES.filter((r) => r.lado === lado);

  return (
    <div className="w-full">
      <div className="mb-6 inline-flex rounded-full border border-white/15 p-1">
        {(['frente', 'costas'] as Lado[]).map((l) => (
          <button
            key={l}
            type="button"
            onClick={() => onLadoChange(l)}
            aria-pressed={lado === l}
            className={`min-h-[40px] rounded-full px-5 text-[10px] font-black uppercase tracking-[0.25em] transition-colors ${
              lado === l ? 'bg-red-700 text-white' : 'text-white/60 hover:text-white'
            }`}
          >
            {l}
          </button>
        ))}
      </div>

      <div className="flex flex-col gap-8 sm:flex-row sm:items-start">
        <svg viewBox="0 0 200 262" className="h-[360px] w-auto shrink-0 self-center sm:self-start" aria-hidden>
          {DECORATIVAS[lado].map((d, i) => (
            <path key={i} d={d} className="fill-white/[0.07] stroke-white/20" strokeWidth="1.5" />
          ))}

          {regioes.map((r) => {
            const ativa = selecionada === r.id;
            return (
              <motion.path
                key={r.id}
                d={FORMAS[r.id]}
                onClick={() => onSelecionar(r.id)}
                initial={false}
                animate={{ fill: ativa ? 'rgb(185 28 28)' : 'rgba(255,255,255,0.07)' }}
                whileHover={{ fill: ativa ? 'rgb(185 28 28)' : 'rgba(185,28,28,0.45)' }}
                transition={{ duration: 0.2 }}
                className="cursor-pointer stroke-white/20"
                strokeWidth="1.5"
              />
            );
          })}
        </svg>

        {/*
          A lista não é redundância: é como se escolhe no celular sem mirar numa
          forma de 20px, e é o que um leitor de tela percorre. O SVG fica como
          aria-hidden justamente porque esta lista já diz tudo o que ele diria.
        */}
        <div className="flex min-w-0 flex-1 flex-wrap gap-2 sm:flex-col">
          {regioes.map((r: Regiao) => {
            const ativa = selecionada === r.id;
            return (
              <button
                key={r.id}
                type="button"
                onClick={() => onSelecionar(r.id)}
                aria-pressed={ativa}
                aria-label={`${r.nome}, dor ${r.dor} de 5`}
                className={`flex min-h-[44px] w-full items-center justify-between gap-4 rounded-xl border px-4 py-2.5 text-left transition-colors ${
                  ativa
                    ? 'border-red-700/60 bg-red-700/15 text-white'
                    : 'border-white/10 text-white/70 hover:border-white/25 hover:text-white'
                }`}
              >
                <span className="text-[11px] font-bold uppercase tracking-[0.2em]">{r.nome}</span>
                <Agulhas nivel={r.dor} />
              </button>
            );
          })}
        </div>
      </div>
    </div>
  );
};
