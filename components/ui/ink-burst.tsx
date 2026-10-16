import React from 'react';

export interface InkBurstHandle {
  /** Joga tinta a partir do centro. `forca` de 0 a 1. */
  respingar: (forca: number) => void;
}

interface Gota {
  x: number;
  y: number;
  vx: number;
  vy: number;
  r: number;
  vida: number;
  vidaTotal: number;
  cor: string;
  /** Gotas alongadas viram risco; redondas viram pingo. */
  risco: number;
}

const GRAVIDADE = 480; // px/s²
const ARRASTE = 0.86; // por segundo
const CORES = ['#b91c1c', '#dc2626', '#7f1d1d', '#f5f5f5', '#991b1b'];

/**
 * Respingo de tinta em canvas.
 *
 * Transform com mola move um objeto; isto joga matéria. Num estúdio de
 * tatuagem a tinta é o material, então o estouro da caixa respinga em vez de
 * soltar confete.
 *
 * O laço de animação só roda enquanto existe gota viva — uma tela parada não
 * fica consumindo quadro, o que importa num celular com a tela ligada.
 */
export const InkBurst = React.forwardRef<InkBurstHandle, { className?: string }>(
  ({ className }, ref) => {
    const canvasRef = React.useRef<HTMLCanvasElement>(null);
    const gotas = React.useRef<Gota[]>([]);
    const rafRef = React.useRef<number | null>(null);
    const ultimoRef = React.useRef(0);

    // Tamanho real do canvas acompanha o CSS e a densidade da tela, senão a
    // tinta sai borrada em telas retina.
    React.useEffect(() => {
      const canvas = canvasRef.current;
      if (!canvas) return;
      const medir = () => {
        const dpr = Math.min(window.devicePixelRatio || 1, 2);
        const { width, height } = canvas.getBoundingClientRect();
        canvas.width = Math.round(width * dpr);
        canvas.height = Math.round(height * dpr);
        const ctx = canvas.getContext('2d');
        if (ctx) ctx.setTransform(dpr, 0, 0, dpr, 0, 0);
      };
      medir();
      const ro = new ResizeObserver(medir);
      ro.observe(canvas);
      return () => ro.disconnect();
    }, []);

    const desenhar = React.useCallback((agora: number) => {
      const canvas = canvasRef.current;
      const ctx = canvas?.getContext('2d');
      if (!canvas || !ctx) return;

      const dt = Math.min((agora - ultimoRef.current) / 1000, 0.05);
      ultimoRef.current = agora;

      const dpr = Math.min(window.devicePixelRatio || 1, 2);
      ctx.clearRect(0, 0, canvas.width / dpr, canvas.height / dpr);

      const arraste = Math.pow(ARRASTE, dt);
      const vivas: Gota[] = [];

      for (const g of gotas.current) {
        g.vida -= dt;
        if (g.vida <= 0) continue;

        g.vx *= arraste;
        g.vy = g.vy * arraste + GRAVIDADE * dt;
        g.x += g.vx * dt;
        g.y += g.vy * dt;

        const restante = g.vida / g.vidaTotal;
        ctx.globalAlpha = Math.min(1, restante * 1.6);
        ctx.fillStyle = g.cor;

        if (g.risco > 1.2) {
          // Alongada na direção do movimento: lê como tinta jogada, não bola.
          const ang = Math.atan2(g.vy, g.vx);
          ctx.save();
          ctx.translate(g.x, g.y);
          ctx.rotate(ang);
          ctx.beginPath();
          ctx.ellipse(0, 0, g.r * g.risco, g.r, 0, 0, Math.PI * 2);
          ctx.fill();
          ctx.restore();
        } else {
          ctx.beginPath();
          ctx.arc(g.x, g.y, g.r, 0, Math.PI * 2);
          ctx.fill();
        }

        vivas.push(g);
      }

      ctx.globalAlpha = 1;
      gotas.current = vivas;

      if (vivas.length) {
        rafRef.current = requestAnimationFrame(desenhar);
      } else {
        rafRef.current = null;
      }
    }, []);

    const respingar = React.useCallback(
      (forca: number) => {
        const canvas = canvasRef.current;
        if (!canvas) return;
        const { width, height } = canvas.getBoundingClientRect();
        const cx = width / 2;
        const cy = height / 2;

        const quantidade = Math.round(18 + forca * 90);
        for (let i = 0; i < quantidade; i++) {
          const ang = Math.random() * Math.PI * 2;
          // Impulso ao quadrado concentra a maioria em velocidade média e
          // deixa poucas gotas irem longe — é o que faz parecer espirro.
          const impulso = (90 + Math.random() * 420) * (0.45 + forca);
          // vidaTotal nasce junto com vida: é só a referência para o
          // desvanecer. Calcular depois, num laço sobre o array inteiro,
          // mexia também nas gotas antigas e embaralhava o fade delas.
          const vida = 0.7 + Math.random() * (0.8 + forca);
          gotas.current.push({
            x: cx + (Math.random() - 0.5) * 24,
            y: cy + (Math.random() - 0.5) * 24,
            vx: Math.cos(ang) * impulso,
            vy: Math.sin(ang) * impulso - 120 * forca,
            r: 1.4 + Math.random() * (2 + forca * 4),
            vida,
            vidaTotal: vida,
            cor: CORES[(Math.random() * CORES.length) | 0],
            risco: 1 + Math.random() * 2.2,
          });
        }

        if (rafRef.current === null) {
          ultimoRef.current = performance.now();
          rafRef.current = requestAnimationFrame(desenhar);
        }
      },
      [desenhar]
    );

    React.useImperativeHandle(ref, () => ({ respingar }), [respingar]);

    React.useEffect(
      () => () => {
        if (rafRef.current !== null) cancelAnimationFrame(rafRef.current);
      },
      []
    );

    return <canvas ref={canvasRef} aria-hidden className={`pointer-events-none ${className ?? ''}`} />;
  }
);

InkBurst.displayName = 'InkBurst';
