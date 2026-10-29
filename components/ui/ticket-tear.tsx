import React from 'react';
import { motion, useMotionValue, useReducedMotion, useTransform } from 'framer-motion';

export interface TicketTearProps {
  /** Dispara quando o canhoto se solta. */
  onRasgar?: () => void;
  className?: string;
}

/**
 * Proporções medidas na arte original (2480x3508 do PDF), para o corpo e o
 * canhoto se encaixarem exatamente como foram desenhados. Se a arte mudar, é
 * aqui que os números mudam — e só aqui.
 */
const CORPO = 1934;
const PICOTE = 10;
const CANHOTO = 528;
const TOTAL = CORPO + PICOTE + CANHOTO;
const LARGURA = 1160;

const pct = (n: number) => `${(n / TOTAL) * 100}%`;

/** Quanto o canhoto precisa descer, em fração da própria altura, para soltar. */
const LIMIAR = 0.42;
const VELOCIDADE = 380;

/**
 * Ingresso com canhoto destacável.
 *
 * Usa a face do koi, não a do verso: o verso tem "R$300,00" pintado no
 * desenho, e o estúdio emite vale de qualquer valor. Tentei cobrir o valor
 * impresso com uma tarja e o resultado foi pior — o preto do valor está
 * desenhado por cima do vermelho do "Vale tattoo", então todo retângulo que
 * esconde um come o outro. A frente não tem valor nenhum: é arte limpa, e o
 * que precisa ser dito aparece embaixo, na tipografia do site.
 *
 * Em retrato o ingresso ocupa a tela do celular inteira, em vez dos 178px de
 * altura que sobravam da versão deitada.
 *
 * Arrastar é o gesto certo no toque, mas não é o único caminho: há um botão
 * com o mesmo efeito, porque arrastar não existe para quem navega por teclado
 * ou usa leitor de tela.
 */
export const TicketTear: React.FC<TicketTearProps> = ({ onRasgar, className }) => {
  const reduzido = useReducedMotion();
  const [rasgado, setRasgado] = React.useState(false);
  const refCaixa = React.useRef<HTMLDivElement>(null);
  const y = useMotionValue(0);

  // O corpo cede um pouco junto, como papel sendo puxado antes de ceder.
  const puxada = useTransform(y, [0, 120], [0, -5]);
  const inclinacao = useTransform(y, [0, 120], [0, 0.5]);

  const soltar = React.useCallback(() => {
    if (rasgado) return;
    setRasgado(true);
    onRasgar?.();
  }, [rasgado, onRasgar]);

  const alturaCanhoto = () => {
    const caixa = refCaixa.current?.getBoundingClientRect();
    return caixa ? (caixa.height * CANHOTO) / TOTAL : 80;
  };

  return (
    <div className={`w-full ${className ?? ''}`}>
      <div
        ref={refCaixa}
        className="relative mx-auto w-full max-w-[380px] select-none"
        style={{ aspectRatio: `${LARGURA} / ${TOTAL}` }}
      >
        <motion.div
          className="absolute inset-x-0 top-0"
          style={{ height: pct(CORPO), y: reduzido ? 0 : puxada, rotate: reduzido ? 0 : inclinacao }}
        >
          <img
            src="/assets/vale/frente-corpo.jpg"
            alt="Vale presente do Bisão Ink"
            draggable={false}
            className="h-full w-full rounded-t-[3px] object-fill shadow-[0_24px_70px_rgba(0,0,0,0.55)]"
          />
        </motion.div>

        <motion.div
          className="absolute inset-x-0 bottom-0 cursor-grab touch-pan-x active:cursor-grabbing"
          style={{ height: pct(CANHOTO), y }}
          drag={rasgado || reduzido ? false : 'y'}
          dragConstraints={{ top: 0, bottom: 0 }}
          dragElastic={{ top: 0, bottom: 0.9 }}
          dragMomentum={false}
          onDragEnd={(_, info) => {
            if (info.offset.y > alturaCanhoto() * LIMIAR || info.velocity.y > VELOCIDADE) soltar();
          }}
          animate={
            rasgado
              ? reduzido
                ? { opacity: 0 }
                : { y: 220, x: 70, rotate: 14, opacity: 0 }
              : {}
          }
          transition={
            rasgado && !reduzido
              ? { duration: 0.8, ease: [0.3, 0, 0.2, 1] }
              : { type: 'spring', stiffness: 420, damping: 32 }
          }
        >
          <img
            src="/assets/vale/frente-canhoto.jpg"
            alt=""
            draggable={false}
            className="h-full w-full rounded-b-[3px] object-fill shadow-[0_24px_70px_rgba(0,0,0,0.55)]"
          />
        </motion.div>
      </div>

      {!rasgado ? (
        <div className="mt-8 flex flex-col items-center gap-4">
          <p className="font-mono text-[10px] uppercase tracking-[0.3em] text-white/45">
            Puxe o canhoto para baixo
          </p>
          {/* Arrastar não existe para quem usa teclado ou leitor de tela. */}
          <button
            type="button"
            onClick={soltar}
            className="rounded-full border border-white/20 px-7 py-3 text-[10px] font-black uppercase tracking-[0.3em] text-white/70 transition-colors hover:border-white/50 hover:text-white"
          >
            Ou toque para rasgar
          </button>
        </div>
      ) : null}
    </div>
  );
};
