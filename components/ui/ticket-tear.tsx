import React from 'react';
import { motion, useMotionValue, useReducedMotion, useTransform } from 'framer-motion';

export interface TicketTearProps {
  /** Dispara quando o canhoto se solta. */
  onRasgar?: () => void;
  /** Conteúdo escrito sobre o corpo do ingresso (valor, nomes, código). */
  children?: React.ReactNode;
  className?: string;
}

/**
 * Proporções medidas na arte original (2480x3508 do PDF), para o corpo e o
 * canhoto se encaixarem exatamente como foram desenhados. Se a arte for
 * refeita, é aqui que os números mudam — e só aqui.
 */
const CORPO = 1939;
const CANHOTO = 478;
const VAO = 26; // o picote
const TOTAL = CORPO + VAO + CANHOTO;
const ALTURA = 1158;

const pct = (n: number) => `${(n / TOTAL) * 100}%`;

/** Quanto o canhoto precisa andar, em fração da própria largura, para soltar. */
const LIMIAR = 0.45;
const VELOCIDADE = 400;

/**
 * Ingresso com canhoto destacável.
 *
 * A arte já vem com o picote desenhado, então o rasgo não é efeito inventado
 * em cima de um retângulo: as duas peças foram recortadas na linha pontilhada
 * do próprio desenho, e o que a pessoa arrasta é o canhoto de verdade.
 *
 * Arrastar é o gesto certo no celular, mas não é o único caminho: há um botão
 * com o mesmo efeito, porque arrastar não existe para quem navega por teclado
 * ou usa leitor de tela.
 */
export const TicketTear: React.FC<TicketTearProps> = ({ onRasgar, children, className }) => {
  const reduzido = useReducedMotion();
  const [rasgado, setRasgado] = React.useState(false);
  const refCaixa = React.useRef<HTMLDivElement>(null);
  const x = useMotionValue(0);

  // O corpo "cede" um pouco junto, como papel sendo puxado antes de ceder.
  const puxada = useTransform(x, [0, 120], [0, 6]);
  const inclinacao = useTransform(x, [0, 120], [0, -0.6]);

  const soltar = React.useCallback(() => {
    if (rasgado) return;
    setRasgado(true);
    onRasgar?.();
  }, [rasgado, onRasgar]);

  const larguraCanhoto = () => {
    const caixa = refCaixa.current?.getBoundingClientRect();
    return caixa ? (caixa.width * CANHOTO) / TOTAL : 80;
  };

  return (
    <div className={`w-full ${className ?? ''}`}>
      <div
        ref={refCaixa}
        className="relative w-full select-none"
        style={{ aspectRatio: `${TOTAL} / ${ALTURA}` }}
      >
        {/* Corpo */}
        {/* `containerType` faz este bloco virar unidade de medida: o texto
            escrito por cima usa cqw e passa a escalar com o ingresso, não com
            a janela. Sem isso, cqw não resolve e a fonte trava no mínimo. */}
        <motion.div
          className="absolute inset-y-0 left-0"
          style={{
            width: pct(CORPO),
            containerType: 'inline-size',
            x: reduzido ? 0 : puxada,
            rotate: reduzido ? 0 : inclinacao,
          }}
        >
          <img
            src="/assets/vale/ticket-corpo.jpg"
            alt="Vale presente do Bisão Ink"
            draggable={false}
            className="h-full w-full rounded-l-[3px] object-fill shadow-[0_20px_60px_rgba(0,0,0,0.5)]"
          />
          {children}
        </motion.div>

        {/* Canhoto */}
        <motion.div
          className="absolute inset-y-0 right-0 cursor-grab active:cursor-grabbing"
          style={{ width: pct(CANHOTO), x }}
          drag={rasgado || reduzido ? false : 'x'}
          dragConstraints={{ left: 0, right: 0 }}
          dragElastic={{ left: 0, right: 0.9 }}
          dragMomentum={false}
          onDragEnd={(_, info) => {
            if (info.offset.x > larguraCanhoto() * LIMIAR || info.velocity.x > VELOCIDADE) soltar();
          }}
          animate={
            rasgado
              ? reduzido
                ? { opacity: 0 }
                : { x: 260, y: 90, rotate: 22, opacity: 0 }
              : {}
          }
          transition={
            rasgado && !reduzido
              ? { duration: 0.75, ease: [0.3, 0, 0.2, 1] }
              : { type: 'spring', stiffness: 420, damping: 32 }
          }
        >
          <img
            src="/assets/vale/ticket-canhoto.jpg"
            alt=""
            draggable={false}
            className="h-full w-full rounded-r-[3px] object-fill shadow-[0_20px_60px_rgba(0,0,0,0.5)]"
          />
        </motion.div>
      </div>

      {!rasgado ? (
        <div className="mt-8 flex flex-col items-center gap-4">
          <p className="font-mono text-[10px] uppercase tracking-[0.3em] text-white/45">
            Arraste o canhoto para o lado
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
