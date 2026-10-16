-- Vales presente do Bisão Ink.
--
-- Rode este arquivo uma vez no SQL Editor do Supabase.
--
-- O ponto de partida: a chave `anon` do Supabase é pública, ela vai dentro do
-- JavaScript que qualquer pessoa baixa. Então a segurança não pode depender de
-- esconder a chave — tem que estar nas políticas. Aqui o anônimo não enxerga a
-- tabela de jeito nenhum; ele só consegue chamar uma função que devolve UM vale
-- pelo código. Sem isso, uma política de leitura liberada deixaria qualquer um
-- baixar a lista inteira, com nome e valor de todo mundo.

-- ---------------------------------------------------------------- tabelas --

create table if not exists public.admins (
  email text primary key,
  criado_em timestamptz not null default now()
);

comment on table public.admins is
  'Quem pode emitir e dar baixa em vale. Cadastre aqui o e-mail do Bisão.';

/**
 * Alfabeto sem 0/O/1/I/5/S: o código vai ser lido em voz alta e digitado à mão
 * no balcão, e esses pares são os que todo mundo confunde.
 */
create or replace function public.gerar_codigo()
returns text
language plpgsql
as $$
declare
  alfabeto text := 'ABCDEFGHJKLMNPQRTUVWXYZ2346789';
  tentativa text;
begin
  loop
    tentativa := '';
    for _ in 1..10 loop
      tentativa := tentativa || substr(alfabeto, floor(random() * length(alfabeto) + 1)::int, 1);
    end loop;
    exit when not exists (select 1 from public.vales where codigo = tentativa);
  end loop;
  return tentativa;
end;
$$;

create table if not exists public.vales (
  id uuid primary key default gen_random_uuid(),
  codigo text unique not null,
  para text not null,
  de text,
  recado text,
  -- Dinheiro em centavos, inteiro. Float em dinheiro acumula erro de
  -- arredondamento, e vale presente é saldo: tem que fechar na conta.
  valor_centavos integer not null check (valor_centavos > 0),
  regiao text,
  tamanho text,
  status text not null default 'ativo' check (status in ('ativo', 'usado', 'cancelado')),
  observacao text,
  criado_em timestamptz not null default now(),
  expira_em timestamptz not null default (now() + interval '12 months'),
  usado_em timestamptz
);

-- O código é gerado no banco, não no cliente: assim ninguém escolhe o próprio
-- código e a unicidade é garantida pela mesma transação que insere.
alter table public.vales alter column codigo set default public.gerar_codigo();

create index if not exists vales_codigo_idx on public.vales (codigo);
create index if not exists vales_criado_em_idx on public.vales (criado_em desc);

-- --------------------------------------------------------------- políticas --

alter table public.vales enable row level security;
alter table public.admins enable row level security;

-- Sem política para `anon` = anônimo não lê nem escreve nada direto na tabela.
drop policy if exists "admin faz tudo com vales" on public.vales;
create policy "admin faz tudo com vales" on public.vales
  for all
  to authenticated
  using (exists (select 1 from public.admins a where a.email = auth.jwt() ->> 'email'))
  with check (exists (select 1 from public.admins a where a.email = auth.jwt() ->> 'email'));

drop policy if exists "admin le admins" on public.admins;
create policy "admin le admins" on public.admins
  for select
  to authenticated
  using (exists (select 1 from public.admins a where a.email = auth.jwt() ->> 'email'));

-- ---------------------------------------------------------------- consulta --

/**
 * Única porta do público para o banco. `security definer` faz a função rodar
 * com os poderes do dono, contornando o RLS — por isso ela devolve só a linha
 * do código pedido, e nunca aceita um filtro vindo de fora.
 *
 * `expira_em` vencido aparece como status 'expirado' sem precisar de rotina
 * de manutenção varrendo a tabela.
 */
create or replace function public.buscar_vale(p_codigo text)
returns table (
  codigo text,
  para text,
  de text,
  recado text,
  valor_centavos integer,
  regiao text,
  tamanho text,
  status text,
  expira_em timestamptz
)
language sql
security definer
set search_path = public
as $$
  select
    v.codigo,
    v.para,
    v.de,
    v.recado,
    v.valor_centavos,
    v.regiao,
    v.tamanho,
    case when v.status = 'ativo' and v.expira_em < now() then 'expirado' else v.status end,
    v.expira_em
  from public.vales v
  where v.codigo = upper(btrim(p_codigo))
  limit 1;
$$;

revoke all on function public.buscar_vale(text) from public;
grant execute on function public.buscar_vale(text) to anon, authenticated;

-- ------------------------------------------------------------------ início --
-- Troque pelo e-mail que o Bisão vai usar para entrar no painel, e crie esse
-- usuário em Authentication > Users. Deixe o cadastro público desativado.
-- insert into public.admins (email) values ('bisao@exemplo.com')
--   on conflict do nothing;
