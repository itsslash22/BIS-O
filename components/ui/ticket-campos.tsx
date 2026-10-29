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
 * As posições não são estimadas: varri a arte procurando as corridas de
 * pixel vermelho e os traços de preencher saíram em 72,5%, 80,3% e 88,1% da
 * altura, de 59,7% a 86,8% da largura.
 *
 * Ancorados por `bottom`, nunca por `top` + translateY. O framer anima `y`
 * nestes mesmos elementos e escreve o próprio `transform` — um translateY
 * escrito à mão aqui é descartado em silêncio, e era isso que fazia cada
 * valor cair meia linha abaixo do traço em vez de pousar sobre ele.
 */
const LINHAS = { de: 72.5, para: 80.3, validade: 88.1 };

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
            bottom: `${100 - LINHAS[chave]}%`,
            width: '26.5%',
            fontSize: 'clamp(8px, 2.5cqw, 26px)',
            lineHeight: 1.05,
          }}
        >
          {texto}
        </motion.span>
      ))}
    </div>
  );
};
