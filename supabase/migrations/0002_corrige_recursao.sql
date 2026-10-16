-- Corrige recursão infinita nas políticas.
--
-- A política de `vales` perguntava "este e-mail está em admins?" com um
-- subselect em `admins`. Só que `admins` também tem RLS, e a política DELA
-- fazia a mesma pergunta — em `admins`. O Postgres detecta o laço e aborta
-- com 42P17, então nem o painel nem a listagem funcionavam.
--
-- A saída é tirar a consulta de dentro do RLS: uma função `security definer`
-- roda com os poderes do dono e não dispara política nenhuma. Ela também vira
-- o único lugar que define "quem é admin", em vez de repetir o subselect.

create or replace function public.e_admin()
returns boolean
language sql
security definer
stable
set search_path = public
as $$
  select exists (
    select 1 from public.admins a
    where a.email = auth.jwt() ->> 'email'
  );
$$;

revoke all on function public.e_admin() from public;
grant execute on function public.e_admin() to authenticated;

drop policy if exists "admin faz tudo com vales" on public.vales;
create policy "admin faz tudo com vales" on public.vales
  for all
  to authenticated
  using (public.e_admin())
  with check (public.e_admin());

drop policy if exists "admin le admins" on public.admins;
create policy "admin le admins" on public.admins
  for select
  to authenticated
  using (public.e_admin());

-- Confirmação: logado como o Bisão isto devolve true.
-- No SQL Editor devolve false, porque ali não existe JWT de usuário.
select public.e_admin() as sou_admin_neste_contexto;
