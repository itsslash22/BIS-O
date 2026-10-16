import { supabase, AVISO_SEM_CONFIG } from './supabase';
import type { Tamanho } from './gift';

export type StatusVale = 'ativo' | 'usado' | 'cancelado' | 'expirado';

/** O que o público enxerga, via a função buscar_vale. */
export interface ValePublico {
  codigo: string;
  para: string;
  de: string | null;
  recado: string | null;
  valor_centavos: number;
  regiao: string | null;
  tamanho: Tamanho | null;
  status: StatusVale;
  expira_em: string;
}

/** O que o painel enxerga: a linha inteira. */
export interface Vale extends ValePublico {
  id: string;
  observacao: string | null;
  criado_em: string;
  usado_em: string | null;
}

export interface NovoVale {
  para: string;
  de?: string;
  recado?: string;
  valor_centavos: number;
  regiao?: string;
  tamanho?: Tamanho;
  observacao?: string;
}

const exigirCliente = () => {
  if (!supabase) throw new Error(AVISO_SEM_CONFIG);
  return supabase;
};

/**
 * Consulta pública por código. Passa pela função `buscar_vale`, não pela
 * tabela: o anônimo não tem permissão de leitura direta, justamente para que
 * ninguém baixe a lista inteira com a chave que vem no JavaScript.
 */
export async function buscarVale(codigo: string): Promise<ValePublico | null> {
  const cliente = exigirCliente();
  const { data, error } = await cliente.rpc('buscar_vale', { p_codigo: codigo });
  if (error) throw error;
  const linha = Array.isArray(data) ? data[0] : data;
  return (linha as ValePublico) ?? null;
}

export async function listarVales(): Promise<Vale[]> {
  const cliente = exigirCliente();
  const { data, error } = await cliente
    .from('vales')
    .select('*')
    .order('criado_em', { ascending: false })
    .limit(200);
  if (error) throw error;
  return (data ?? []) as Vale[];
}

export async function emitirVale(novo: NovoVale): Promise<Vale> {
  const cliente = exigirCliente();
  // `codigo` não vai no insert: quem gera é o banco, para ninguém escolher o
  // próprio código e a unicidade ficar na mesma transação.
  const { data, error } = await cliente.from('vales').insert(novo).select().single();
  if (error) throw error;
  return data as Vale;
}

export async function darBaixa(id: string): Promise<Vale> {
  const cliente = exigirCliente();
  const { data, error } = await cliente
    .from('vales')
    .update({ status: 'usado', usado_em: new Date().toISOString() })
    .eq('id', id)
    // Só dá baixa no que está ativo: duas pessoas no balcão ao mesmo tempo não
    // conseguem usar o mesmo vale duas vezes, porque a segunda não casa.
    .eq('status', 'ativo')
    .select()
    .single();
  if (error) throw error;
  return data as Vale;
}

export async function cancelarVale(id: string): Promise<Vale> {
  const cliente = exigirCliente();
  const { data, error } = await cliente
    .from('vales')
    .update({ status: 'cancelado' })
    .eq('id', id)
    .select()
    .single();
  if (error) throw error;
  return data as Vale;
}

export async function reativarVale(id: string): Promise<Vale> {
  const cliente = exigirCliente();
  const { data, error } = await cliente
    .from('vales')
    .update({ status: 'ativo', usado_em: null })
    .eq('id', id)
    .select()
    .single();
  if (error) throw error;
  return data as Vale;
}
