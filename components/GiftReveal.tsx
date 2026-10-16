import React from 'react';
import { AnimatePresence, motion, useReducedMotion } from 'framer-motion';
import { GiftCard } from './ui/gift-card';
import { InkBurst, type InkBurstHandle } from './ui/ink-burst';
import { emReais, paraReais, VALIDADE_MESES, type Presente, type Tamanho } from '../lib/gift';
import { buscarVale, type ValePublico } from '../lib/vales';
import { supabaseConfigurado } from '../lib/supabase';
import { INSTAGRAM_LINK, WHATSAPP_NUMBER } from '../constants';

const TOQUES_PARA_ABRIR = 3;

const Aviso: React.FC<{ titulo: string; texto: string }> = ({ titulo, texto }) => (
  <main className="flex min-h-[100svh] flex-col items-center justify-center gap-4 bg-black px-8 text-center text-white">
    <p className="font-mono text-[10px] uppercase tracking-[0.4em] text-red-500">Vale presente</p>
    <h1 className="font-display text-3xl italic">{titulo}</h1>
    <p className="max-w-sm text-sm leading-relaxed text-white/50">{texto}</p>
    <a
      href={location.pathname}
      className="mt-6 font-mono text-[10px] uppercase tracking-[0.3em] text-white/40 transition-colors hover:text-white"
    >
      Ir para o site
    </a>
  </main>
);

/**
 * A revelação. Três toques, não "vários": repetição demais vira tarefa. O que
 * segura a pessoa é cada toque mudar algo visível — a caixa treme, racha com
 * luz saindo, depois abre.
 *
 * O vale vem do banco, pelo código na URL. A URL não afirma mais nada: antes
 * ela carregava o presente inteiro embutido, e bastava trocar o valor na barra
 * de endereço para forjar um vale.
 */
const GiftReveal: React.FC<{ codigo: string }> = ({ codigo }) => {
  const reduzido = useReducedMotion();
  const [toques, setToques] = React.useState(0);
  const [vale, setVale] = React.useState<ValePublico | null>(null);
  const [erro, setErro] = React.useState<string | null>(null);
  const [carregando, setCarregando] = React.useState(true);
  const aberto = toques >= TOQUES_PARA_ABRIR;
  const tinta = React.useRef<InkBurstHandle>(null);

  React.useEffect(() => {
    let cancelado = false;
    setCarregando(true);
    buscarVale(codigo)
      .then((v) => {
        if (cancelado) return;
        setVale(v);
        setErro(v ? null : 'nao-encontrado');
      })
      .catch(() => !cancelado && setErro('falhou'))
      .finally(() => !cancelado && setCarregando(false));
    return () => {
      cancelado = true;
    };
  }, [codigo]);

  /**
   * A contagem vive também num ref porque precisa de duas coisas ao mesmo
   * tempo, e cada uma sozinha quebra de um jeito:
   *
   * - O respingo não pode morar dentro do atualizador de `setToques`: o React
   *   chama o atualizador duas vezes em desenvolvimento e a tinta saía dobrada.
   * - Mas ler `toques` do render perde toques: três batidas rápidas entram no
   *   mesmo lote, leem o mesmo valor e avançam um passo só — e batida rápida é
   *   justamente o que se faz com uma caixa de presente.
   */
  const toquesRef = React.useRef(0);

  const abrir = () => {
    if (toquesRef.current >= TOQUES_PARA_ABRIR) return;
    const proximo = toquesRef.current + 1;
    toquesRef.current = proximo;
    setToques(proximo);
    if (!reduzido) tinta.current?.respingar(proximo === TOQUES_PARA_ABRIR ? 1 : proximo * 0.22);
  };

  if (!supabaseConfigurado) {
    return <Aviso titulo="Vales ainda não ativados" texto="O estúdio está terminando de configurar esta parte. Chame no WhatsApp que a gente resolve na hora." />;
  }
  if (carregando) {
    return (
      <main className="flex min-h-[100svh] items-center justify-center bg-black">
        <p className="font-mono text-[10px] uppercase tracking-[0.4em] text-white/40">Abrindo…</p>
      </main>
    );
  }
  if (erro === 'nao-encontrado' || !vale) {
    return <Aviso titulo="Vale não encontrado" texto="Confira se o link veio completo. Se veio de alguém, peça para reenviar — cada vale tem um código único emitido pelo estúdio." />;
  }
  if (erro === 'falhou') {
    return <Aviso titulo="Não consegui conferir agora" texto="Pode ser a conexão. Tente de novo em instantes, ou fale com o estúdio pelo WhatsApp." />;
  }
  if (vale.status !== 'ativo') {
    const motivo =
      vale.status === 'usado'
        ? 'Este vale já foi utilizado.'
        : vale.status === 'expirado'
          ? 'Este vale passou da validade.'
          : 'Este vale foi cancelado.';
    return <Aviso titulo="Vale indisponível" texto={`${motivo} Se achar que houve engano, fale com o estúdio.`} />;
  }

  const presente: Presente = {
    para: vale.para,
    de: vale.de ?? '',
    valor: paraReais(vale.valor_centavos),
    recado: vale.recado ?? undefined,
    regiao: vale.regiao ?? undefined,
    tamanho: (vale.tamanho as Tamanho) ?? undefined,
  };

  const whatsapp = `https://wa.me/${WHATSAPP_NUMBER}?text=${encodeURIComponent(
    `Olá! Tenho o vale presente ${vale.codigo}, de ${emReais(presente.valor)}, e gostaria de agendar.`
  )}`;

  const tremida = reduzido ? [0] : [0, -2 - toques * 2, 2 + toques * 2, -1 - toques, 0];
  const brilho = toques / TOQUES_PARA_ABRIR;

  return (
    <main className="relative flex min-h-[100svh] flex-col items-center justify-center overflow-hidden bg-black px-6 py-16 text-white">
      <div
        aria-hidden
        className="pointer-events-none absolute left-1/2 top-1/2 h-[70vmin] w-[70vmin] -translate-x-1/2 -translate-y-1/2 rounded-full bg-red-700/20 blur-[100px] transition-opacity duration-700"
        style={{ opacity: 0.25 + brilho * 0.75 }}
      />

      {/* A tinta voa por cima do fundo e por baixo do conteúdo, para o cartão
          não ser encoberto no momento em que a pessoa quer lê-lo. */}
      <InkBurst ref={tinta} className="absolute inset-0 z-[5] h-full w-full" />

      <AnimatePresence mode="wait">
        {!aberto ? (
          <motion.div
            key="caixa"
            exit={{ opacity: 0, scale: 0.9, transition: { duration: 0.3 } }}
            className="relative z-10 flex flex-col items-center"
          >
            <p className="mb-2 font-mono text-[10px] uppercase tracking-[0.4em] text-white/50">
              {presente.de ? `${presente.de} deixou algo para você` : 'Alguém deixou algo para você'}
            </p>
            <p className="mb-10 font-display text-3xl italic text-white sm:text-4xl">{presente.para}</p>

            <motion.button
              type="button"
              onClick={abrir}
              aria-label={`Abrir o presente. Toque ${toques} de ${TOQUES_PARA_ABRIR}`}
              animate={{ rotate: tremida }}
              transition={{ duration: 0.4 }}
              key={`tremida-${toques}`}
              className="relative outline-none focus-visible:ring-2 focus-visible:ring-red-600 focus-visible:ring-offset-4 focus-visible:ring-offset-black"
            >
              <svg width="200" height="190" viewBox="0 0 200 190" className="drop-shadow-[0_20px_60px_rgba(185,28,28,0.3)]">
                <motion.rect
                  x="30" y="58" width="140" height="14" rx="3"
                  className="fill-red-500"
                  animate={{ opacity: brilho }}
                  transition={{ duration: 0.3 }}
                />
                <rect x="34" y="66" width="132" height="104" rx="6" className="fill-neutral-900 stroke-white/20" strokeWidth="2" />
                <rect x="92" y="66" width="16" height="104" className="fill-red-700/80" />
                <motion.g
                  animate={{ y: reduzido ? 0 : -toques * 7, rotate: reduzido ? 0 : toques * -3 }}
                  style={{ originX: '0.5', originY: '1' }}
                  transition={{ type: 'spring', stiffness: 220, damping: 14 }}
                >
                  <rect x="26" y="40" width="148" height="26" rx="5" className="fill-neutral-800 stroke-white/25" strokeWidth="2" />
                  <rect x="92" y="40" width="16" height="26" className="fill-red-700" />
                  <path d="M100 40 c-16-14-34-6-30 6 M100 40 c16-14 34-6 30 6" className="fill-none stroke-red-600" strokeWidth="5" strokeLinecap="round" />
                </motion.g>
              </svg>
            </motion.button>

            <div className="mt-10 flex items-center gap-2" aria-hidden>
              {Array.from({ length: TOQUES_PARA_ABRIR }).map((_, i) => (
                <span
                  key={i}
                  className={`h-1.5 w-8 rounded-full transition-colors duration-300 ${
                    i < toques ? 'bg-red-600' : 'bg-white/15'
                  }`}
                />
              ))}
            </div>
            <p className="mt-4 font-mono text-[10px] uppercase tracking-[0.3em] text-white/40">
              {toques === 0 ? 'Toque para abrir' : toques < TOQUES_PARA_ABRIR ? 'Continue…' : ''}
            </p>
          </motion.div>
        ) : (
          <motion.div
            key="revelado"
            initial={{ opacity: 0, y: 40, scale: 0.95 }}
            animate={{ opacity: 1, y: 0, scale: 1 }}
            transition={reduzido ? { duration: 0 } : { duration: 0.7, ease: [0.22, 1, 0.36, 1] }}
            className="relative z-10 flex w-full max-w-md flex-col items-center"
          >
            <p className="mb-6 text-center font-mono text-[10px] uppercase tracking-[0.4em] text-red-500">
              Seu presente
            </p>

            <GiftCard presente={presente} codigo={vale.codigo} />

            {presente.recado ? (
              <p className="mt-8 max-w-sm text-center font-display text-lg italic leading-relaxed text-white/80">
                “{presente.recado}”
              </p>
            ) : null}

            <a
              href={whatsapp}
              target="_blank"
              rel="noopener noreferrer"
              className="mt-10 w-full rounded-full bg-red-700 px-8 py-4 text-center text-[10px] font-black uppercase tracking-[0.3em] text-white transition-colors hover:bg-white hover:text-black"
            >
              Agendar minha sessão
            </a>

            <p className="mt-6 max-w-xs text-center font-mono text-[9px] uppercase leading-relaxed tracking-[0.15em] text-white/35">
              Código {vale.codigo} · válido até{' '}
              {new Date(vale.expira_em).toLocaleDateString('pt-BR')} · {VALIDADE_MESES} meses
            </p>

            <div className="mt-10 flex items-center gap-5">
              <a
                href={location.pathname}
                className="font-mono text-[10px] uppercase tracking-[0.3em] text-white/40 transition-colors hover:text-white"
              >
                Ver o trabalho do Bisão
              </a>
              <span aria-hidden className="h-3 w-px bg-white/15" />
              <a
                href={INSTAGRAM_LINK}
                target="_blank"
                rel="noopener noreferrer"
                className="font-mono text-[10px] uppercase tracking-[0.3em] text-white/40 transition-colors hover:text-white"
              >
                @bisaoink
              </a>
            </div>
          </motion.div>
        )}
      </AnimatePresence>
    </main>
  );
};

export default GiftReveal;
