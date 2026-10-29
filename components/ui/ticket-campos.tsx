import React from 'react';
import { motion, useReducedMotion } from 'framer-motion';
import { emReais } from '../../lib/gift';

interface TicketCamposProps {
  valor: number;
  para: string;
  de?: string;
  validade: string;
  visivel: boolean;
}

/**
 * Os dados do vale, escritos por cima do corpo do ingresso.
 *
 * Tudo em porcentagem porque a arte é uma imagem de proporção fixa: assim o
 * texto acompanha o ingresso em qualquer largura, do celular ao desktop, sem
 * uma única media query.
 *
 * As posições foram medidas na arte original — a linha de "Um presente de:"
 * começa em 60% da largura, e as três linhas ficam a 72%, 80% e 87% da altura.
 */
const LINHAS = { de: 71.5, para: 79, validade: 86.5 };

export const TicketCampos: React.FC<TicketCamposProps> = ({ valor, para, de, validade, visivel }) => {
  const reduzido = useReducedMotion();

  const entrada = (atraso: number) => ({
    initial: reduzido ? { opacity: 0 } : { opacity: 0, y: 6 },
    animate: visivel ? { opacity: 1, y: 0 } : { opacity: 0, y: 6 },
    transition: reduzido ? { duration: 0 } : { duration: 0.45, delay: visivel ? atraso : 0 },
  });

  return (
    <div className="pointer-events-none absolute inset-0" aria-hidden>
      {/*
        TODO: REMENDO. O "R$300,00" faz parte do desenho, e o estúdio emite
        vale de qualquer valor. Esta tarja cobre o valor impresso para o real
        ser escrito por cima — mas é um retângulo liso sobre papel texturizado,
        e aparece de perto. O conserto de verdade é o Bisão mandar a arte sem o
        valor; aí a tarja sai e sobra só o texto.
      */}
      <div
        className="absolute"
        style={{ left: '45%', top: '36.5%', width: '38%', height: '13.5%', background: '#e9e2d2' }}
      />

      <motion.span
        {...entrada(0.15)}
        className="absolute flex items-center justify-center font-display italic text-neutral-900"
        style={{
          left: '45%',
          top: '36.5%',
          width: '38%',
          height: '13.5%',
          fontSize: 'clamp(14px, 5.4cqw, 60px)',
          lineHeight: 1,
        }}
      >
        {emReais(valor)}
      </motion.span>

      {([
        ['de', de || '—', 0.3],
        ['para', para, 0.42],
        ['validade', validade, 0.54],
      ] as const).map(([chave, texto, atraso]) => (
        <motion.span
          key={chave}
          {...entrada(atraso)}
          className="absolute truncate font-display italic text-neutral-800"
          style={{
            left: '60.5%',
            top: `${LINHAS[chave]}%`,
            width: '27%',
            fontSize: 'clamp(8px, 2.5cqw, 26px)',
            transform: 'translateY(-100%)',
          }}
        >
          {texto}
        </motion.span>
      ))}
    </div>
  );
};
