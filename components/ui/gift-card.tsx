import React from 'react';
import { emReais, regiaoPorId, VALIDADE_MESES, type Presente } from '../../lib/gift';

interface GiftCardProps {
  presente: Presente;
  /** Código emitido pelo estúdio. Sem ele o cartão mostra o lugar vazio. */
  codigo?: string;
  className?: string;
}

/**
 * O cartão. É o mesmo componente na prévia de quem compra e na revelação de
 * quem recebe — se ele divergisse nos dois lugares, a pessoa montaria uma
 * coisa e entregaria outra.
 */
export const GiftCard: React.FC<GiftCardProps> = ({ presente, codigo, className }) => {
  const regiao = presente.regiao ? regiaoPorId(presente.regiao) : null;

  return (
    <div
      className={`relative aspect-[1.586/1] w-full overflow-hidden rounded-2xl border border-white/15 bg-neutral-950 ${className ?? ''}`}
    >
      {/* Brilho e marca d'água, no espírito do resto do site */}
      <div className="pointer-events-none absolute -right-16 -top-16 h-56 w-56 rounded-full bg-red-700/25 blur-[70px]" />
      <span
        aria-hidden
        className="pointer-events-none absolute -bottom-8 -left-4 select-none font-logo text-[7rem] font-black leading-none tracking-tighter text-white/[0.04]"
      >
        BI
      </span>

      <div className="relative flex h-full flex-col justify-between p-5 sm:p-7">
        <div className="flex items-start justify-between gap-4">
          <span className="font-logo text-xs tracking-[0.3em] text-white sm:text-sm">
            BISÃO <span className="text-red-600">INK</span>
          </span>
          <span className="text-right font-mono text-[9px] uppercase tracking-[0.25em] text-white/50">
            Vale presente
          </span>
        </div>

        <div>
          <p className="font-mono text-[9px] uppercase tracking-[0.3em] text-white/50">Para</p>
          <p className="truncate font-display text-2xl italic leading-tight text-white sm:text-3xl">
            {presente.para || '—'}
          </p>
          <p className="mt-3 font-logo text-2xl font-black tracking-tight text-red-600 sm:text-3xl">
            {emReais(presente.valor)}
          </p>
        </div>

        <div className="flex items-end justify-between gap-4">
          <div className="min-w-0">
            {presente.de ? (
              <p className="truncate font-mono text-[9px] uppercase tracking-[0.25em] text-white/50">
                De {presente.de}
              </p>
            ) : null}
            {regiao ? (
              <p className="truncate font-mono text-[9px] uppercase tracking-[0.25em] text-white/35">
                Pensado para {regiao.nome.toLowerCase()}
              </p>
            ) : null}
          </div>
          <div className="shrink-0 text-right">
            <p className="font-mono text-[10px] tracking-[0.2em] text-white/70">
              {codigo ?? '— — — —'}
            </p>
            <p className="font-mono text-[8px] uppercase tracking-[0.2em] text-white/35">
              Válido por {VALIDADE_MESES} meses
            </p>
          </div>
        </div>
      </div>
    </div>
  );
};
