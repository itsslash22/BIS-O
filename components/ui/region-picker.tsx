import React from 'react';
import { emReais, faixaEstimada, REGIOES, type Lado, type Tamanho } from '../../lib/gift';

interface RegionPickerProps {
  lado: Lado;
  onLadoChange: (lado: Lado) => void;
  selecionada: string | null;
  onSelecionar: (id: string) => void;
  /** Usado só para o "a partir de" de cada cartão acompanhar o tamanho. */
  tamanho: Tamanho;
}

/**
 * Escolha da região.
 *
 * Aqui havia uma silhueta em SVG — um boneco de blocos que o corpo inteiro
 * desenhava. Era feio e, pior, não ajudava: ninguém precisa de um desenho para
 * saber onde fica o próprio antebraço, e a forma de 20px era difícil de
 * acertar no celular. A lista sempre foi a parte útil, então virou a interface
 * inteira — e agora cada região já mostra de quanto se está falando.
 */

const Agulhas: React.FC<{ nivel: number }> = ({ nivel }) => (
  <span className="inline-flex shrink-0 gap-[3px]" aria-hidden>
    {[1, 2, 3, 4, 5].map((n) => (
      <span key={n} className={`h-3 w-[2px] rounded-full ${n <= nivel ? 'bg-red-600' : 'bg-white/15'}`} />
    ))}
  </span>
);

export const RegionPicker: React.FC<RegionPickerProps> = ({
  lado,
  onLadoChange,
  selecionada,
  onSelecionar,
  tamanho,
}) => {
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
            className={`min-h-[40px] rounded-full px-6 text-[10px] font-black uppercase tracking-[0.25em] transition-colors ${
              lado === l ? 'bg-red-700 text-white' : 'text-white/60 hover:text-white'
            }`}
          >
            {l}
          </button>
        ))}
      </div>

      <div className="grid grid-cols-1 gap-3 sm:grid-cols-2">
        {regioes.map((r) => {
          const ativa = selecionada === r.id;
          const faixa = faixaEstimada(r.id, tamanho);
          return (
            <button
              key={r.id}
              type="button"
              onClick={() => onSelecionar(r.id)}
              aria-pressed={ativa}
              aria-label={`${r.nome}. Dor ${r.dor} de 5.${faixa ? ` A partir de ${emReais(faixa[0])}.` : ''}`}
              className={`flex min-h-[72px] flex-col justify-between gap-2 rounded-xl border p-4 text-left transition-colors ${
                ativa
                  ? 'border-red-700/60 bg-red-700/15'
                  : 'border-white/10 hover:border-white/25 hover:bg-white/[0.03]'
              }`}
            >
              <span className="flex items-center justify-between gap-3">
                <span
                  className={`text-[11px] font-bold uppercase tracking-[0.2em] ${
                    ativa ? 'text-white' : 'text-white/80'
                  }`}
                >
                  {r.nome}
                </span>
                <Agulhas nivel={r.dor} />
              </span>
              <span className="flex items-baseline justify-between gap-3">
                {/* Sem font-logo aqui: o Syncopate tem caixa-alta decorativa e
                    "a partir de" saía como "a Partir de". */}
                <span className="text-xs text-white/55">
                  {faixa ? `a partir de ${emReais(faixa[0])}` : ''}
                </span>
                <span className="font-mono text-[9px] uppercase tracking-[0.15em] text-white/30">
                  {r.sessoes}
                </span>
              </span>
            </button>
          );
        })}
      </div>

      <p className="mt-4 font-mono text-[9px] uppercase tracking-[0.2em] text-white/30">
        As agulhas indicam o nível de dor relatado na região
      </p>
    </div>
  );
};
