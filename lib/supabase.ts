import { createClient, type SupabaseClient } from '@supabase/supabase-js';

/**
 * Cliente do Supabase.
 *
 * As duas variáveis são públicas por natureza: `VITE_` entra no JavaScript que
 * o navegador baixa, e a chave `anon` foi feita para isso. Quem protege os
 * dados são as políticas de RLS em supabase/migrations — nunca o segredo da
 * chave. A chave `service_role` não pode aparecer em lugar nenhum deste
 * projeto.
 */
const url = import.meta.env.VITE_SUPABASE_URL as string | undefined;
const chave = import.meta.env.VITE_SUPABASE_ANON_KEY as string | undefined;

export const supabaseConfigurado = Boolean(url && chave);

/**
 * Nulo quando falta configuração, em vez de explodir na importação: o site
 * inteiro é um módulo só, e um throw aqui derrubaria a home por causa de uma
 * variável de ambiente que só o painel precisa.
 */
export const supabase: SupabaseClient | null = supabaseConfigurado
  ? createClient(url!, chave!, { auth: { persistSession: true, autoRefreshToken: true } })
  : null;

export const AVISO_SEM_CONFIG =
  'Supabase não configurado. Defina VITE_SUPABASE_URL e VITE_SUPABASE_ANON_KEY no .env.local.';

/**
 * Erro do Supabase legível.
 *
 * O cliente rejeita com PostgrestError, que é objeto simples e não `Error` —
 * então um `e instanceof Error ? e.message : 'falhou'` descarta exatamente o
 * detalhe que resolve o problema. Aqui o código e a dica do Postgres chegam à
 * tela, que é onde servem.
 */
export function mensagemDeErro(e: unknown): string {
  if (!e) return 'Erro desconhecido.';
  if (typeof e === 'string') return e;
  const o = e as { message?: string; code?: string; hint?: string; details?: string };
  const partes = [o.message, o.details, o.hint].filter(Boolean);
  const texto = partes.join(' — ') || 'Erro desconhecido.';
  return o.code ? `[${o.code}] ${texto}` : texto;
}
