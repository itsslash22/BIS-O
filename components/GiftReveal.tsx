import React from 'react';
import { AnimatePresence, motion, useReducedMotion } from 'framer-motion';
import { TicketTear } from './ui/ticket-tear';
import { InkBurst, type InkBurstHandle } from './ui/ink-burst';
import { emReais, paraReais, VALIDADE_MESES, type Presente, type Tamanho } from '../lib/gift';
import { buscarVale, type ValePublico } from '../lib/vales';
import { supabaseConfigurado } from '../lib/supabase';
import { INSTAGRAM_LINK, WHATSAPP_NUMBER } from '../constants';


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
 * A revelação.
 *
 * Aqui havia uma caixa de presente que abria em três toques. Saiu em favor do
 * ingresso que o próprio Bisão desenhou: rasgar o canhoto é o gesto que se faz
 * com um vale, e abrir caixa serve para qualquer coisa. A arte também já vinha
 * com o picote, então o rasgo acontece na linha que ele traçou, não numa borda
 * inventada por cima de um retângulo.
 *
 * O vale vem do banco, pelo código na URL. A URL não afirma mais nada: antes
 * ela carregava o presente inteiro embutido, e bastava trocar o valor na barra
 * de endereço para forjar um vale.
 */
const GiftReveal: React.FC<{ codigo: string }> = ({ codigo }) => {
  const reduzido = useReducedMotion();
  const [rasgado, setRasgado] = React.useState(false);
  const [vale, setVale] = React.useState<ValePublico | null>(null);
  const [erro, setErro] = React.useState<string | null>(null);
  const [carregando, setCarregando] = React.useState(true);
  const tinta = React.useRef<InkBurstHandle>(null);

  React.useEffect(() => {
    let cancelado = false;
    setCarregando(true);

    /**
     * Atalho de desenvolvimento: #/presente?c=DEMO monta um vale falso para
     * revisar o rasgo sem precisar emitir um de verdade no banco.
     *
     * Protegido por import.meta.env.DEV, que o Vite substitui por `false` no
     * build — o bloco inteiro é removido na publicação. Sem essa trava, seria
     * exatamente o furo que o banco veio fechar: um vale que existe sem ter
     * sido emitido.
     */
    if (import.meta.env.DEV && codigo === 'DEMO') {
      setVale({
        codigo: 'DEMONSTRACAO',
        para: 'Ana Beatriz',
        de: 'João',
        recado: 'Pra você fechar aquele braço, irmã. Feliz aniversário!',
        valor_centavos: 75000,
        regiao: 'antebraco',
        tamanho: 'media',
        status: 'ativo',
        expira_em: new Date(Date.now() + 365 * 864e5).toISOString(),
      });
      setErro(null);
      setCarregando(false);
      return;
    }

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

  const validade = new Date(vale.expira_em).toLocaleDateString('pt-BR');

  return (
    <main className="relative flex min-h-[100svh] flex-col items-center justify-center overflow-hidden bg-black px-5 py-14 text-white">
      <div
        aria-hidden
        className="pointer-events-none absolute left-1/2 top-1/2 h-[70vmin] w-[70vmin] -translate-x-1/2 -translate-y-1/2 rounded-full bg-red-700/20 blur-[100px] transition-opacity duration-700"
        style={{ opacity: rasgado ? 1 : 0.3 }}
      />

      {/* A tinta voa por cima do fundo e por baixo do conteúdo, para o texto
          não ser encoberto no momento em que a pessoa quer lê-lo. */}
      <InkBurst ref={tinta} className="absolute inset-0 z-[5] h-full w-full" />

      <div className="relative z-10 flex w-full max-w-3xl flex-col items-center">
        <p className="mb-2 text-center font-mono text-[10px] uppercase tracking-[0.4em] text-white/50">
          {presente.de ? `${presente.de} deixou algo para você` : 'Alguém deixou algo para você'}
        </p>
        <p className="mb-10 text-center font-display text-3xl italic text-white sm:text-4xl">
          {presente.para}
        </p>

        <TicketTear
          onRasgar={() => {
            setRasgado(true);
            if (!reduzido) tinta.current?.respingar(1);
          }}
        />

        {/*
          O ingresso é o ritual; o texto abaixo é a informação. Num celular o
          vale ocupa 375px de largura e a letra da arte fica pequena demais
          para ser lida — então o que importa aparece aqui, na tipografia do
          site, em tamanho de gente.
        */}
        <AnimatePresence>
          {rasgado ? (
            <motion.div
              initial={{ opacity: 0, y: 24 }}
              animate={{ opacity: 1, y: 0 }}
              transition={reduzido ? { duration: 0 } : { duration: 0.6, delay: 0.5 }}
              className="mt-12 flex w-full max-w-md flex-col items-center"
            >
              <p className="font-logo text-4xl font-black tracking-tight text-red-600">
                {emReais(presente.valor)}
              </p>
              <p className="mt-2 font-mono text-[10px] uppercase tracking-[0.3em] text-white/50">
                Código {vale.codigo} · válido até {validade}
              </p>

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
          ) : null}
        </AnimatePresence>
      </div>
    </main>
  );
};

export default GiftReveal;
