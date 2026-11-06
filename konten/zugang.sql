-- =============================================================================
-- Gemeinsames Supabase-Projekt der Apps (Taktwerk, Haushalt, später Kochbuch):
-- nur freigeschaltete Mail-Adressen dürfen ein Konto anlegen.
--
-- Ausführen: Supabase-Dashboard, SQL Editor, ganzes Skript einfügen, Run.
-- Darf jederzeit wieder laufen; die Liste der Adressen bleibt erhalten.
--
-- Danach, nur im SQL Editor (nie ins Repo, das Repo ist öffentlich):
--   insert into app_private.allowed_logins (email, note) values ('name@example.ch', 'Simon');
-- und den Hook einschalten: Authentication, Hooks, «Before User Created»,
-- Postgres, Schema public, Funktion hook_before_user_created.
-- Anleitung: konten/README.md, Tests: konten/test.sql (laufen mit npm run db:test in taktwerk/)
-- =============================================================================

-- Gibt es von Taktwerk schon; von aussen nicht erreichbar
create schema if not exists app_private;
revoke all on schema app_private from public, anon, authenticated;

-- Freigeschaltete Adressen, klein geschrieben. Über die Schnittstelle der Apps nicht lesbar.
create table if not exists app_private.allowed_logins (
  email      text        not null primary key,
  note       text        not null default '',
  created_at timestamptz not null default now(),
  constraint allowed_logins_email_check
    check (email = lower(email) and email ~ '^[^@[:space:]]+@[^@[:space:]]+\.[^@[:space:]]+$'),
  constraint allowed_logins_note_check check (length(note) <= 200)
);
revoke all on table app_private.allowed_logins from public, anon, authenticated;

-- Auth Hook «Before User Created»: Supabase fragt ihn vor jedem neuen Konto.
-- Bestehende Konten sind nicht betroffen, die Anmeldung mit Code bleibt für sie gleich.
create or replace function public.hook_before_user_created(event jsonb)
returns jsonb
language plpgsql
stable
security definer
set search_path = ''
as $$
begin
  if exists (
    select 1
      from app_private.allowed_logins l
     where l.email = lower(trim(coalesce(event -> 'user' ->> 'email', '')))
  ) then
    return '{}'::jsonb;
  end if;
  return jsonb_build_object('error', jsonb_build_object(
    'http_code', 403,
    'message', 'Diese Mail-Adresse ist für die Apps nicht freigeschaltet.'));
end
$$;

-- Nur der Anmeldedienst von Supabase darf den Hook aufrufen, die Apps nicht
grant usage on schema public to supabase_auth_admin;
revoke all on function public.hook_before_user_created(jsonb) from public, anon, authenticated;
grant execute on function public.hook_before_user_created(jsonb) to supabase_auth_admin;
