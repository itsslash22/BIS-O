import React from 'react';
import { Check, Copy, LogOut, RefreshCw } from 'lucide-react';
import { supabase, supabaseConfigurado, AVISO_SEM_CONFIG, mensagemDeErro } from '../lib/supabase';
import {
  cancelarVale,
  darBaixa,
  emitirVale,
  listarVales,
  reativarVale,
  type Vale,
} from '../lib/vales';
import { emReais, linkDoVale, paraCentavos, paraReais, REGIOES, TAMANHOS, type Tamanho } from '../lib/gift';

const entrada =
  'w-full rounded-xl border border-white/15 bg-white/5 px-4 py-3 text-white placeholder:text-white/25 outline-none transition-colors focus:border-red-700';

/**
 * O <select> nativo desenha a lista com o tema do sistema — no Windows ela abre
 * branca e azul, atravessada no meio do painel preto. Pintar o <option> é o
 * reforço do color-scheme: dark declarado no index.css, que já manda o
 * navegador desenhar os controles nativos no tema escuro. Sem appearance-none:
 * ele apagaria a setinha e o campo viraria um texto comum.
 */
const selecao = entrada + ' [&>option]:bg-neutral-900 [&>option]:text-white';

const CORES_STATUS: Record<string, string> = {
  ativo: 'text-emerald-400 border-emerald-400/30 bg-emerald-400/10',
  usado: 'text-white/50 border-white/15 bg-white/5',
  cancelado: 'text-red-400 border-red-400/30 bg-red-400/10',
  expirado: 'text-amber-400 border-amber-400/30 bg-amber-400/10',
};

/** Vencido é estado derivado da data; a coluna `status` não sabe disso. */
const statusVisivel = (v: Vale) =>
  v.status === 'ativo' && new Date(v.expira_em) < new Date() ? 'expirado' : v.status;

const Entrar: React.FC<{ onEntrou: () => void }> = ({ onEntrou }) => {
  const [email, setEmail] = React.useState('');
  const [senha, setSenha] = React.useState('');
  const [erro, setErro] = React.useState<string | null>(null);
  const [indo, setIndo] = React.useState(false);

  const enviar = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!supabase) return;
    setIndo(true);
    setErro(null);
    const { error } = await supabase.auth.signInWithPassword({ email, password: senha });
    setIndo(false);
    if (error) setErro('E-mail ou senha incorretos.');
    else onEntrou();
  };

  return (
    <form onSubmit={enviar} className="mx-auto w-full max-w-sm space-y-4">
      <h1 className="mb-8 text-center font-logo text-sm tracking-[0.3em] text-white">
        BISÃO <span className="text-red-600">INK</span>
        <span className="mt-2 block font-mono text-[10px] tracking-[0.3em] text-white/40">Painel de vales</span>
      </h1>
      <input type="email" required autoComplete="username" value={email} onChange={(e) => setEmail(e.target.value)} placeholder="E-mail" className={entrada} />
      <input type="password" required autoComplete="current-password" value={senha} onChange={(e) => setSenha(e.target.value)} placeholder="Senha" className={entrada} />
      {erro ? <p className="text-center text-sm text-red-400">{erro}</p> : null}
      <button
        type="submit"
        disabled={indo}
        className="w-full rounded-full bg-red-700 px-8 py-4 text-[10px] font-black uppercase tracking-[0.3em] text-white transition-colors hover:bg-white hover:text-black disabled:opacity-40"
      >
        {indo ? 'Entrando…' : 'Entrar'}
      </button>
    </form>
  );
};

/**
 * Painel de vales.
 *
 * Fica numa rota por hash e não aparece em nenhum menu, mas a proteção não é a
 * obscuridade: sem sessão o Supabase recusa tudo pelas políticas de RLS, e o
 * e-mail ainda precisa estar na tabela `admins`. Esconder a rota só evita que
 * um visitante curioso tope com uma tela de login.
 */
const Admin: React.FC = () => {
  const [autenticado, setAutenticado] = React.useState(false);
  const [pronto, setPronto] = React.useState(false);
  const [vales, setVales] = React.useState<Vale[]>([]);
  const [erro, setErro] = React.useState<string | null>(null);
  const [carregando, setCarregando] = React.useState(false);
  const [copiado, setCopiado] = React.useState<string | null>(null);

  // formulário de emissão
  const [para, setPara] = React.useState('');
  const [de, setDe] = React.useState('');
  const [valor, setValor] = React.useState(600);
  const [recado, setRecado] = React.useState('');
  const [regiao, setRegiao] = React.useState('');
  const [tamanho, setTamanho] = React.useState<Tamanho>('media');
  const [observacao, setObservacao] = React.useState('');
  const [emitindo, setEmitindo] = React.useState(false);
  const [recemEmitido, setRecemEmitido] = React.useState<Vale | null>(null);

  React.useEffect(() => {
    if (!supabase) {
      setPronto(true);
      return;
    }
    supabase.auth.getSession().then(({ data }) => {
      setAutenticado(Boolean(data.session));
      setPronto(true);
    });
    const { data: sub } = supabase.auth.onAuthStateChange((_e, sessao) => setAutenticado(Boolean(sessao)));
    return () => sub.subscription.unsubscribe();
  }, []);

  const recarregar = React.useCallback(async () => {
    setCarregando(true);
    setErro(null);
    try {
      setVales(await listarVales());
    } catch (e) {
      // Erro de política aparece aqui: entrou, mas o e-mail não está em `admins`.
      setErro(mensagemDeErro(e));
    } finally {
      setCarregando(false);
    }
  }, []);

  React.useEffect(() => {
    if (autenticado) void recarregar();
  }, [autenticado, recarregar]);

  const copiar = async (codigo: string) => {
    try {
      await navigator.clipboard.writeText(linkDoVale(codigo));
      setCopiado(codigo);
      window.setTimeout(() => setCopiado(null), 2000);
    } catch {
      setCopiado(null);
    }
  };

  const emitir = async (e: React.FormEvent) => {
    e.preventDefault();
    setEmitindo(true);
    setErro(null);
    try {
      const novo = await emitirVale({
        para: para.trim(),
        de: de.trim() || undefined,
        recado: recado.trim() || undefined,
        valor_centavos: paraCentavos(valor),
        regiao: regiao || undefined,
        tamanho,
        observacao: observacao.trim() || undefined,
      });
      setRecemEmitido(novo);
      setPara('');
      setDe('');
      setRecado('');
      setObservacao('');
      await recarregar();
    } catch (err) {
      setErro(mensagemDeErro(err));
    } finally {
      setEmitindo(false);
    }
  };

  const agir = async (fn: () => Promise<Vale>) => {
    setErro(null);
    try {
      await fn();
      await recarregar();
    } catch (err) {
      setErro(mensagemDeErro(err));
    }
  };

  if (!supabaseConfigurado) {
    return (
      <main className="flex min-h-[100svh] items-center justify-center bg-black px-8 text-center">
        <p className="max-w-md font-mono text-xs leading-relaxed text-white/60">{AVISO_SEM_CONFIG}</p>
      </main>
    );
  }
  if (!pronto) {
    return <main className="flex min-h-[100svh] items-center justify-center bg-black" />;
  }
  if (!autenticado) {
    return (
      <main className="flex min-h-[100svh] items-center justify-center bg-black px-6 py-16">
        <Entrar onEntrou={() => setAutenticado(true)} />
      </main>
    );
  }

  return (
    <main className="min-h-[100svh] bg-black px-6 py-12 text-white md:px-12">
      <div className="mx-auto max-w-6xl">
        <header className="mb-10 flex flex-wrap items-center justify-between gap-4">
          <h1 className="font-logo text-sm tracking-[0.3em]">
            BISÃO <span className="text-red-600">INK</span>
            <span className="ml-4 font-mono text-[10px] tracking-[0.3em] text-white/40">Vales</span>
          </h1>
          <div className="flex items-center gap-3">
            <button
              onClick={() => void recarregar()}
              className="flex min-h-[40px] items-center gap-2 rounded-full border border-white/15 px-5 text-[10px] font-black uppercase tracking-[0.2em] text-white/70 hover:text-white"
            >
              <RefreshCw size={13} className={carregando ? 'animate-spin' : ''} />
              Atualizar
            </button>
            <button
              onClick={() => supabase?.auth.signOut()}
              className="flex min-h-[40px] items-center gap-2 rounded-full border border-white/15 px-5 text-[10px] font-black uppercase tracking-[0.2em] text-white/70 hover:text-white"
            >
              <LogOut size={13} />
              Sair
            </button>
          </div>
        </header>

        {erro ? (
          <p className="mb-8 rounded-xl border border-red-500/30 bg-red-500/10 p-4 text-sm text-red-300">{erro}</p>
        ) : null}

        <div className="grid gap-12 lg:grid-cols-[1fr_1.3fr]">
          {/* Emitir */}
          <section>
            <h2 className="mb-5 font-mono text-[10px] uppercase tracking-[0.3em] text-white/50">
              Emitir vale (depois do pagamento)
            </h2>
            <form onSubmit={emitir} className="space-y-4">
              <input required value={para} onChange={(e) => setPara(e.target.value)} maxLength={60} placeholder="Para quem é" className={entrada} />
              <input value={de} onChange={(e) => setDe(e.target.value)} maxLength={60} placeholder="De quem (opcional)" className={entrada} />
              <div className="flex items-center gap-3">
                <span className="font-logo text-white/50">R$</span>
                {/*
                  step={1}, não 10. Com min={1} e step={10} o navegador monta a
                  grade 1, 11, 21… e recusa 700 — "os dois valores válidos mais
                  próximos são 691 e 701". Valor de vale é número livre: o
                  estúdio cobra 700, 150 ou 75 conforme a peça.
                */}
                <input type="number" min={1} step={1} required value={valor} onChange={(e) => setValor(Number(e.target.value))} className={entrada} />
              </div>
              <div className="grid grid-cols-2 gap-3">
                <select value={regiao} onChange={(e) => setRegiao(e.target.value)} className={selecao}>
                  <option value="">Região (opcional)</option>
                  {REGIOES.map((r) => (
                    <option key={r.id} value={r.id}>{r.nome}</option>
                  ))}
                </select>
                <select value={tamanho} onChange={(e) => setTamanho(e.target.value as Tamanho)} className={selecao}>
                  {TAMANHOS.map((t) => (
                    <option key={t.id} value={t.id}>{t.nome}</option>
                  ))}
                </select>
              </div>
              <textarea value={recado} onChange={(e) => setRecado(e.target.value.slice(0, 140))} rows={2} placeholder="Recado de quem deu (opcional)" className={`${entrada} resize-none`} />
              <input value={observacao} onChange={(e) => setObservacao(e.target.value)} placeholder="Nota interna: como pagou, telefone… (só você vê)" className={entrada} />
              <button
                type="submit"
                disabled={emitindo}
                className="w-full rounded-full bg-red-700 px-8 py-4 text-[10px] font-black uppercase tracking-[0.3em] text-white transition-colors hover:bg-white hover:text-black disabled:opacity-40"
              >
                {emitindo ? 'Emitindo…' : 'Emitir e gerar link'}
              </button>
            </form>

            {recemEmitido ? (
              <div className="mt-6 rounded-2xl border border-emerald-400/30 bg-emerald-400/5 p-5">
                <p className="font-mono text-[10px] uppercase tracking-[0.25em] text-emerald-400">Vale emitido</p>
                <p className="mt-2 font-logo text-2xl tracking-tight text-white">{recemEmitido.codigo}</p>
                <input readOnly value={linkDoVale(recemEmitido.codigo)} onFocus={(e) => e.currentTarget.select()} className={`${entrada} mt-4 font-mono text-[11px]`} />
                <button
                  onClick={() => void copiar(recemEmitido.codigo)}
                  className="mt-3 flex items-center gap-2 font-mono text-[10px] uppercase tracking-[0.25em] text-white/70 hover:text-white"
                >
                  {copiado === recemEmitido.codigo ? <Check size={13} /> : <Copy size={13} />}
                  {copiado === recemEmitido.codigo ? 'Link copiado' : 'Copiar link'}
                </button>
              </div>
            ) : null}
          </section>

          {/* Lista */}
          <section>
            <h2 className="mb-5 font-mono text-[10px] uppercase tracking-[0.3em] text-white/50">
              Emitidos ({vales.length})
            </h2>
            <div className="space-y-3">
              {vales.length === 0 && !carregando ? (
                <p className="text-sm text-white/40">Nenhum vale emitido ainda.</p>
              ) : null}
              {vales.map((v) => {
                const st = statusVisivel(v);
                return (
                  <div key={v.id} className="rounded-2xl border border-white/10 p-4">
                    <div className="flex flex-wrap items-center justify-between gap-3">
                      <div className="min-w-0">
                        <p className="font-logo text-sm tracking-tight text-white">{v.codigo}</p>
                        <p className="truncate text-xs text-white/50">
                          {v.para}
                          {v.de ? ` · de ${v.de}` : ''}
                        </p>
                      </div>
                      <div className="flex items-center gap-3">
                        <span className="font-logo text-sm text-red-500">{emReais(paraReais(v.valor_centavos))}</span>
                        <span className={`rounded-full border px-3 py-1 font-mono text-[9px] uppercase tracking-[0.2em] ${CORES_STATUS[st]}`}>
                          {st}
                        </span>
                      </div>
                    </div>

                    {v.observacao ? (
                      <p className="mt-2 font-mono text-[10px] text-white/35">{v.observacao}</p>
                    ) : null}

                    <div className="mt-3 flex flex-wrap items-center gap-4">
                      <button onClick={() => void copiar(v.codigo)} className="flex items-center gap-2 font-mono text-[10px] uppercase tracking-[0.2em] text-white/50 hover:text-white">
                        {copiado === v.codigo ? <Check size={12} /> : <Copy size={12} />}
                        {copiado === v.codigo ? 'Copiado' : 'Link'}
                      </button>
                      {st === 'ativo' ? (
                        <>
                          <button onClick={() => void agir(() => darBaixa(v.id))} className="font-mono text-[10px] uppercase tracking-[0.2em] text-emerald-400/80 hover:text-emerald-300">
                            Dar baixa
                          </button>
                          <button onClick={() => void agir(() => cancelarVale(v.id))} className="font-mono text-[10px] uppercase tracking-[0.2em] text-red-400/70 hover:text-red-300">
                            Cancelar
                          </button>
                        </>
                      ) : (
                        <button onClick={() => void agir(() => reativarVale(v.id))} className="font-mono text-[10px] uppercase tracking-[0.2em] text-white/50 hover:text-white">
                          Reativar
                        </button>
                      )}
                    </div>
                  </div>
                );
              })}
            </div>
          </section>
        </div>
      </div>
    </main>
  );
};

export default Admin;
