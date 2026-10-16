/**
 * Vale presente — dados, preços e o link compartilhável.
 *
 * O site não tem backend, então tudo que o presente precisa viaja dentro do
 * próprio link. Isso tem uma consequência que a interface precisa assumir em
 * voz alta: quem recebe consegue editar o valor na barra de endereço. O link é
 * o embrulho, não o comprovante — quem vale é o código que o estúdio emite no
 * WhatsApp depois do pagamento.
 */

export type Lado = 'frente' | 'costas';
export type Tamanho = 'pequena' | 'media' | 'fechamento';

export interface Regiao {
  id: string;
  nome: string;
  lado: Lado;
  /** 1 a 5. É a informação que mais se procura sobre tatuagem. */
  dor: number;
  /** Faixa em reais para o tamanho "media". Multiplicada pelo tamanho. */
  base: [number, number];
  sessoes: string;
}

/**
 * TODO: NÚMEROS PROVISÓRIOS. Nada aqui veio do Bisão — são marcadores para a
 * tela existir. Antes de publicar, ele precisa revisar faixa por faixa.
 *
 * Importante: a faixa é âncora, nunca orçamento. A interface sempre mostra
 * "a partir de" e deixa o campo de valor livre, porque tatuagem se cobra por
 * tempo de agulha (tamanho, densidade, cor, sessões) e não por região.
 */
export const REGIOES: Regiao[] = [
  { id: 'pescoco', nome: 'Pescoço', lado: 'frente', dor: 5, base: [600, 1200], sessoes: '1 sessão' },
  { id: 'peito', nome: 'Peito', lado: 'frente', dor: 4, base: [900, 2200], sessoes: '1 a 3 sessões' },
  { id: 'costela', nome: 'Costela', lado: 'frente', dor: 5, base: [1000, 2400], sessoes: '2 a 3 sessões' },
  { id: 'abdomen', nome: 'Abdômen', lado: 'frente', dor: 4, base: [800, 2000], sessoes: '1 a 3 sessões' },
  { id: 'braco', nome: 'Braço', lado: 'frente', dor: 2, base: [700, 1800], sessoes: '1 a 2 sessões' },
  { id: 'antebraco', nome: 'Antebraço', lado: 'frente', dor: 3, base: [600, 1500], sessoes: '1 a 2 sessões' },
  { id: 'mao', nome: 'Mão', lado: 'frente', dor: 5, base: [500, 1000], sessoes: '1 sessão' },
  { id: 'coxa', nome: 'Coxa', lado: 'frente', dor: 2, base: [800, 2200], sessoes: '1 a 3 sessões' },
  { id: 'panturrilha', nome: 'Panturrilha', lado: 'frente', dor: 3, base: [700, 1600], sessoes: '1 a 2 sessões' },
  { id: 'nuca', nome: 'Nuca', lado: 'costas', dor: 4, base: [500, 1100], sessoes: '1 sessão' },
  { id: 'costas', nome: 'Costas', lado: 'costas', dor: 3, base: [1500, 4000], sessoes: '3 a 6 sessões' },
  { id: 'lombar', nome: 'Lombar', lado: 'costas', dor: 4, base: [700, 1800], sessoes: '1 a 2 sessões' },
  { id: 'ombro', nome: 'Ombro', lado: 'costas', dor: 2, base: [700, 1700], sessoes: '1 a 2 sessões' },
  { id: 'posterior', nome: 'Posterior da perna', lado: 'costas', dor: 3, base: [700, 1800], sessoes: '1 a 2 sessões' },
];

export const TAMANHOS: { id: Tamanho; nome: string; fator: number; descricao: string }[] = [
  { id: 'pequena', nome: 'Pequena', fator: 0.5, descricao: 'Até a palma da mão' },
  { id: 'media', nome: 'Média', fator: 1, descricao: 'Ocupa boa parte da região' },
  { id: 'fechamento', nome: 'Fechamento', fator: 2.2, descricao: 'Toma a região inteira' },
];

export const regiaoPorId = (id: string) => REGIOES.find((r) => r.id === id);

/** Arredonda para a dezena de reais mais próxima — faixa não precisa de centavo. */
const arredonda = (n: number) => Math.round(n / 10) * 10;

export function faixaEstimada(regiaoId: string, tamanho: Tamanho): [number, number] | null {
  const r = regiaoPorId(regiaoId);
  const t = TAMANHOS.find((x) => x.id === tamanho);
  if (!r || !t) return null;
  return [arredonda(r.base[0] * t.fator), arredonda(r.base[1] * t.fator)];
}

export const emReais = (n: number) =>
  n.toLocaleString('pt-BR', { style: 'currency', currency: 'BRL', maximumFractionDigits: 0 });

/** Quanto tempo o vale vale. Está no CDC: o prazo tem que estar escrito. */
export const VALIDADE_MESES = 12;

export interface Presente {
  /** Quem recebe. */
  para: string;
  /** Quem dá. */
  de: string;
  /** Valor em reais. */
  valor: number;
  /** Recado curto. Limitado para o link não virar um parágrafo. */
  recado?: string;
  /** Região e tamanho que inspiraram o valor. Só enfeite no cartão. */
  regiao?: string;
  tamanho?: Tamanho;
}

export const LIMITE_RECADO = 140;

/* -- O link -------------------------------------------------------------- */

/**
 * O link carrega só o código. Antes ele carregava o presente inteiro embutido,
 * e por isso qualquer pessoa trocava o valor na barra de endereço e dizia que
 * tinha dado um vale. Agora a URL não afirma nada: ela aponta para um registro
 * no banco, e editar o código só leva a "vale não encontrado".
 */
export const ROTA_PRESENTE = '#/presente';
export const ROTA_ADMIN = '#/admin';

export const linkDoVale = (codigo: string) =>
  `${location.origin}${location.pathname}${ROTA_PRESENTE}?c=${encodeURIComponent(codigo)}`;

export function lerCodigoDaUrl(): string | null {
  const h = location.hash;
  if (!h.startsWith(ROTA_PRESENTE)) return null;
  const q = h.indexOf('?');
  if (q < 0) return null;
  const c = new URLSearchParams(h.slice(q + 1)).get('c');
  return c ? c.trim().toUpperCase() : null;
}

export const estaNoAdmin = () => location.hash.startsWith(ROTA_ADMIN);

/* -- Dinheiro ------------------------------------------------------------ */

/** O banco guarda centavos; a interface fala em reais. */
export const paraCentavos = (reais: number) => Math.round(reais * 100);
export const paraReais = (centavos: number) => centavos / 100;
