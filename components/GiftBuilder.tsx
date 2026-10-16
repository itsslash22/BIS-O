import React from 'react';
import { MessageCircle } from 'lucide-react';
import { RegionPicker } from './ui/region-picker';
import { GiftCard } from './ui/gift-card';
import {
  emReais,
  faixaEstimada,
  LIMITE_RECADO,
  regiaoPorId,
  TAMANHOS,
  VALIDADE_MESES,
  type Lado,
  type Presente,
  type Tamanho,
} from '../lib/gift';
import { WHATSAPP_NUMBER } from '../constants';

const Campo: React.FC<{ rotulo: string; children: React.ReactNode }> = ({ rotulo, children }) => (
  <label className="block">
    <span className="mb-2 block font-mono text-[10px] uppercase tracking-[0.3em] text-white/50">{rotulo}</span>
    {children}
  </label>
);

const entrada =
  'w-full rounded-xl border border-white/15 bg-white/5 px-4 py-3 text-white placeholder:text-white/25 outline-none transition-colors focus:border-red-700';

const GiftBuilder: React.FC = () => {
  const [lado, setLado] = React.useState<Lado>('frente');
  const [regiao, setRegiao] = React.useState<string | null>(null);
  const [tamanho, setTamanho] = React.useState<Tamanho>('media');
  const [valor, setValor] = React.useState(600);
  const [para, setPara] = React.useState('');
  const [de, setDe] = React.useState('');
  const [recado, setRecado] = React.useState('');

  const faixa = regiao ? faixaEstimada(regiao, tamanho) : null;
  const r = regiao ? regiaoPorId(regiao) : null;

  // A faixa só sugere: assim que a pessoa escolhe região e tamanho, o valor
  // acompanha, mas o campo continua livre. Tatuagem se cobra por tempo de
  // agulha, não por região — a faixa é âncora, nunca orçamento.
  React.useEffect(() => {
    if (faixa) setValor(faixa[0]);
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [regiao, tamanho]);

  const presente: Presente = {
    para: para.trim(),
    de: de.trim(),
    valor,
    recado: recado.trim() || undefined,
    regiao: regiao ?? undefined,
    tamanho,
  };

  const pronto = presente.para.length > 0 && valor > 0;


  const pedido = `https://wa.me/${WHATSAPP_NUMBER}?text=${encodeURIComponent(
    `Olá! Quero comprar um vale presente de ${emReais(valor)} para ${presente.para || '(nome)'}.` +
      (r ? ` A ideia é uma peça ${tamanho} em ${r.nome.toLowerCase()}.` : '')
  )}`;

  return (
    <section id="presente" className="scroll-mt-28 bg-black px-6 py-24 md:px-24 md:py-32">
      <div className="mx-auto max-w-6xl">
        <span className="font-mono text-[10px] uppercase tracking-[0.5em] text-red-500">Vale presente</span>
        <h2 className="mt-4 font-display text-5xl italic leading-[0.9] tracking-tighter text-white md:text-7xl">
          Dê uma peça, <br />
          <span className="text-red-600">não um objeto</span>
        </h2>

        <div className="mt-16 grid gap-16 lg:grid-cols-[1.15fr_1fr]">
          {/* Escolhas */}
          <div className="space-y-10">
            {/* Tamanho vem antes da região: agora cada região mostra o próprio
                "a partir de", e esse número depende do tamanho. Na ordem
                anterior a pessoa escolhia vendo preço de peça média e via tudo
                mudar no passo seguinte. */}
            <div>
              <p className="mb-4 font-mono text-[10px] uppercase tracking-[0.3em] text-white/50">1. Tamanho</p>
              <div className="grid grid-cols-1 gap-3 sm:grid-cols-3">
                {TAMANHOS.map((t) => (
                  <button
                    key={t.id}
                    type="button"
                    onClick={() => setTamanho(t.id)}
                    aria-pressed={tamanho === t.id}
                    className={`rounded-xl border px-4 py-3 text-left transition-colors ${
                      tamanho === t.id
                        ? 'border-red-700/60 bg-red-700/15 text-white'
                        : 'border-white/10 text-white/70 hover:border-white/25'
                    }`}
                  >
                    <span className="block text-[11px] font-bold uppercase tracking-[0.2em]">{t.nome}</span>
                    <span className="mt-1 block text-[10px] text-white/40">{t.descricao}</span>
                  </button>
                ))}
              </div>
            </div>

            <div>
              <p className="mb-5 font-mono text-[10px] uppercase tracking-[0.3em] text-white/50">
                2. Onde seria a tatuagem
              </p>
              <RegionPicker lado={lado} onLadoChange={setLado} selecionada={regiao} onSelecionar={setRegiao} tamanho={tamanho} />
            </div>

            {faixa && r ? (
              <div className="rounded-2xl border border-white/10 bg-white/[0.03] p-6">
                <p className="font-mono text-[10px] uppercase tracking-[0.25em] text-white/50">
                  Estimativa para {r.nome.toLowerCase()}
                </p>
                <p className="mt-2 font-logo text-xl font-black tracking-tight text-white">
                  a partir de {emReais(faixa[0])}
                </p>
                <p className="mt-1 text-sm text-white/50">
                  Costuma ficar entre {emReais(faixa[0])} e {emReais(faixa[1])}, em {r.sessoes}.
                </p>
                <p className="mt-4 text-[11px] leading-relaxed text-white/40">
                  É uma referência, não um orçamento. O preço final sai da conversa com o Bisão —
                  tamanho, densidade de traço e cor mudam tudo. O vale vale como crédito em qualquer
                  trabalho.
                </p>
              </div>
            ) : null}

            <div className="space-y-5">
              <p className="font-mono text-[10px] uppercase tracking-[0.3em] text-white/50">3. O presente</p>

              <Campo rotulo="Valor do vale">
                <div className="flex items-center gap-3">
                  <span className="font-logo text-lg text-white/50">R$</span>
                  <input
                    type="number"
                    min={50}
                    step={50}
                    value={valor}
                    onChange={(e) => setValor(Math.max(0, Number(e.target.value)))}
                    className={entrada}
                  />
                </div>
              </Campo>

              <div className="grid gap-5 sm:grid-cols-2">
                <Campo rotulo="Para quem é">
                  <input value={para} onChange={(e) => setPara(e.target.value)} maxLength={60} placeholder="Nome de quem recebe" className={entrada} />
                </Campo>
                <Campo rotulo="De quem">
                  <input value={de} onChange={(e) => setDe(e.target.value)} maxLength={60} placeholder="Seu nome" className={entrada} />
                </Campo>
              </div>

              <Campo rotulo={`Recado (${recado.length}/${LIMITE_RECADO})`}>
                <textarea
                  value={recado}
                  onChange={(e) => setRecado(e.target.value.slice(0, LIMITE_RECADO))}
                  rows={2}
                  placeholder="Opcional"
                  className={`${entrada} resize-none`}
                />
              </Campo>
            </div>
          </div>

          {/* Prévia e entrega */}
          <div className="lg:sticky lg:top-28 lg:self-start">
            <p className="mb-4 font-mono text-[10px] uppercase tracking-[0.3em] text-white/50">Prévia</p>
            <GiftCard presente={presente} />

            <div className="mt-8 space-y-3">
              <a
                href={pedido}
                target="_blank"
                rel="noopener noreferrer"
                aria-disabled={!pronto}
                onClick={(e) => {
                  if (!pronto) e.preventDefault();
                }}
                className={`flex w-full items-center justify-center gap-3 rounded-full px-8 py-4 text-[10px] font-black uppercase tracking-[0.3em] transition-colors ${
                  pronto
                    ? 'bg-red-700 text-white hover:bg-white hover:text-black'
                    : 'pointer-events-none bg-white/10 text-white/30'
                }`}
              >
                <MessageCircle size={14} />
                Pedir pelo WhatsApp
              </a>

            </div>

            {!pronto ? (
              <p className="mt-6 font-mono text-[10px] uppercase tracking-[0.2em] text-white/35">
                Preencha o nome de quem recebe para continuar
              </p>
            ) : null}

            {/*
              Aqui havia um botão que gerava o link do presente. Saiu de
              propósito: aquele link carregava os dados dentro da URL, então
              qualquer pessoa montava um na tela, mandava para alguém e dizia
              que tinha dado um vale. Agora só o estúdio emite, depois de
              receber — e o que sai de lá é um código único, registrado.
            */}
            <ol className="mt-8 space-y-3 border-l border-white/10 pl-5 text-[11px] leading-relaxed text-white/45">
              <li>Você manda o pedido pelo WhatsApp e combina o pagamento.</li>
              <li>O estúdio emite o vale e devolve o link com o código.</li>
              <li>Você entrega o link; quem recebe abre a caixa.</li>
            </ol>

            <p className="mt-6 text-[11px] leading-relaxed text-white/40">
              O vale é crédito em qualquer trabalho, vale por {VALIDADE_MESES} meses a partir da
              emissão e pode ser conferido pelo código a qualquer momento.
            </p>
          </div>
        </div>
      </div>
    </section>
  );
};

export default GiftBuilder;
