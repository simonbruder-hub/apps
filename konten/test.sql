-- =============================================================================
-- Tests für konten/zugang.sql (ausgeführt von taktwerk/supabase/test/run.sh nach
-- schema.sql, im gleichen Wegwerf-Cluster). Jede Prüfung meldet "ok …"; die erste
-- fehlgeschlagene bricht den Lauf ab. Nur erfundene Adressen.
-- =============================================================================

\set ON_ERROR_STOP 1

insert into app_private.allowed_logins (email, note) values ('anna@beispiel.ch', 'Test')
  on conflict (email) do nothing;

-- Freigeschaltete Adresse: leeres Ergebnis heisst «Konto anlegen erlaubt», auch mit Grossbuchstaben
set role supabase_auth_admin;
do $$
declare r jsonb;
begin
  r := public.hook_before_user_created('{"user": {"email": " Anna@Beispiel.CH "}}');
  if r <> '{}'::jsonb then raise exception 'freigeschaltete Adresse abgelehnt: %', r; end if;
  raise notice 'ok Hook lässt eine freigeschaltete Adresse zu';

  r := public.hook_before_user_created('{"user": {"email": "fremd@beispiel.ch"}}');
  if (r -> 'error' ->> 'http_code') is distinct from '403' then raise exception 'fremde Adresse nicht abgelehnt: %', r; end if;
  raise notice 'ok Hook lehnt eine fremde Adresse ab (403)';

  r := public.hook_before_user_created('{"user": {"phone": "+41790000000"}}');
  if (r -> 'error' ->> 'http_code') is distinct from '403' then raise exception 'Konto ohne Mail nicht abgelehnt: %', r; end if;
  raise notice 'ok Hook lehnt ein Konto ohne Mail-Adresse ab';
end
$$;
reset role;

-- Die Apps (anon, authenticated) sehen die Liste nicht und können den Hook nicht aufrufen
set role authenticated;
do $$
begin
  begin
    perform 1 from app_private.allowed_logins;
    raise exception 'authenticated kann die Liste lesen';
  exception when insufficient_privilege then
    raise notice 'ok authenticated sieht die Liste nicht';
  end;
  begin
    perform public.hook_before_user_created('{}'::jsonb);
    raise exception 'authenticated kann den Hook aufrufen';
  exception when insufficient_privilege then
    raise notice 'ok authenticated kann den Hook nicht aufrufen';
  end;
end
$$;
reset role;

set role anon;
do $$
begin
  begin
    perform 1 from app_private.allowed_logins;
    raise exception 'anon kann die Liste lesen';
  exception when insufficient_privilege then
    raise notice 'ok anon sieht die Liste nicht';
  end;
end
$$;
reset role;

-- Ungültige Einträge weist die Tabelle zurück
do $$
begin
  begin
    insert into app_private.allowed_logins (email) values ('Gross@Beispiel.ch');
    raise exception 'Adresse mit Grossbuchstaben angenommen';
  exception when check_violation then
    raise notice 'ok Adressen nur klein geschrieben';
  end;
end
$$;

delete from app_private.allowed_logins where note = 'Test';
