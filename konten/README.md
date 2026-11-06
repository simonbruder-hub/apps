# Gemeinsames Konto für die Apps

Ein Supabase-Projekt für Taktwerk, Haushalt und später das Kochbuch: das bisherige Projekt von Taktwerk
(`xlbddpaxwjgseqxaicuf`). Wer sich in einer App anmeldet, ist im selben Browser auch in den anderen angemeldet, weil
alle Apps auf `simonbruder-hub.github.io` liegen.

- **Warum eins:** Der Free-Plan von Supabase erlaubt 2 aktive Projekte. Das bisherige Haushalt-Projekt wird frei, der
  Study Hub bekommt es für seine Ablage (mit Konten anderer Studierender, darum getrennt von euren Finanzen).
- **Wer hinein darf:** nur die Adressen auf einer Liste im Projekt (Simon und Partnerin). Die Adressen stehen nur dort,
  nie im Repo, denn das Repo ist öffentlich.
- **Wer was sieht:** Taktwerk-Daten nur das eigene Konto, Haushalt-Daten nur die Mitglieder des Haushalts
  (Row Level Security). Der öffentliche Schlüssel in den Apps ändert daran nichts.

Die Schritte machst du im Supabase-Dashboard (supabase.com, Projekt von Taktwerk). Rechne mit etwa 20 Minuten.

## 1. Vorher sichern

In der Haushalt-App auf dem Handy: **Mehr, Einstellungen, Daten, Sicherung herunterladen**. Die Datei bleibt auf dem
Handy. Bei Taktwerk ist nichts zu tun, es bleibt beim gleichen Projekt.

## 2. Anmeldung mit Code

**Authentication, Sign In / Providers, Email:**

- **Enable Email provider** an, **Confirm email** an
- **Email OTP Length** `6`, **Email OTP Expiration** `3600`
- **Allow new users to sign up** an lassen: Wer hinein darf, regelt die Liste aus Schritt 4

**Authentication, Emails, Templates:** beide Vorlagen **Confirm signup** und **Magic Link** auf einen Code umstellen.
Entscheidend ist `{{ .Token }}`, sonst schickt Supabase nur einen Link (der bisher auf einer Seite mit Fehler 404
landete).

*Subject:* `Dein Anmeldecode`

```html
<h2>Dein Anmeldecode</h2>
<p>Gib diesen Code in der App ein (Taktwerk, Haushalt):</p>
<p style="font-size:32px;font-weight:bold;letter-spacing:6px;font-family:monospace">{{ .Token }}</p>
<p>Der Code ist eine Stunde gültig und funktioniert einmal. Falls du dich nicht anmelden wolltest, ignoriere diese Mail.</p>
```

## 3. Adressen der Website

**Authentication, URL Configuration:**

- **Site URL:** `https://simonbruder-hub.github.io/apps/`
- **Redirect URLs** (je mit «Add URL»):
  - `https://simonbruder-hub.github.io/apps/**`
  - `https://simonbruder-hub.github.io/haushaltskasse-app/**`
  - für die Entwicklung `http://localhost:5173/**` und `http://localhost:4173/**`

Mit Codes braucht es diese Adressen kaum, Supabase lehnt aber Anfragen mit fremden Rücksprungadressen ab.

## 4. Nur eure Adressen

1. **SQL Editor, New query**, den ganzen Inhalt von [`zugang.sql`](zugang.sql) einfügen, **Run**. Erwartet:
   *Success. No rows returned.* Das Skript darf später wieder laufen, die Liste bleibt.
2. Neue Abfrage mit euren Adressen, klein geschrieben, **Run**:

   ```sql
   insert into app_private.allowed_logins (email, note) values
     ('deine.adresse@example.ch', 'Simon'),
     ('ihre.adresse@example.ch', 'Partnerin');
   ```

3. **Authentication, Hooks, Add hook, Before User Created:** Typ *Postgres*, Schema `public`, Funktion
   `hook_before_user_created`, speichern. Ab jetzt legt Supabase für fremde Adressen kein Konto mehr an.
4. **Authentication, Users** ansehen: Dort sollten nur eure Konten stehen. Unbekannte Testkonten löschen.

Später eine Adresse dazu: dieselbe `insert`-Zeile mit der neuen Adresse. Bestehende Konten betrifft die Liste nicht.

## 5. Tabellen der Haushalt-App

Im **SQL Editor** die fünf Dateien aus dem Repo `haushaltskasse-app` nacheinander ausführen, je **New query**, ganzen
Inhalt einfügen, **Run** (eine Warnung zu «destructive operations» bestätigen):

1. [`20261014000000_m1_fundament.sql`](https://github.com/simonbruder-hub/haushaltskasse-app/blob/main/v2/supabase/migrations/20261014000000_m1_fundament.sql)
2. [`20261015000000_m2_belege.sql`](https://github.com/simonbruder-hub/haushaltskasse-app/blob/main/v2/supabase/migrations/20261015000000_m2_belege.sql)
3. [`20261016000000_m3_scanner.sql`](https://github.com/simonbruder-hub/haushaltskasse-app/blob/main/v2/supabase/migrations/20261016000000_m3_scanner.sql)
4. [`20261017000000_m4_produkte.sql`](https://github.com/simonbruder-hub/haushaltskasse-app/blob/main/v2/supabase/migrations/20261017000000_m4_produkte.sql)
5. [`20261018000000_m5_budget.sql`](https://github.com/simonbruder-hub/haushaltskasse-app/blob/main/v2/supabase/migrations/20261018000000_m5_budget.sql)

Die Tabellen von Taktwerk und Haushalt heissen alle verschieden; zusammen in einer Testdatenbank laufen beide ohne
Fehler, und alle Prüfungen von Taktwerk bestehen weiter. Kommt später eine neue Haushalt-Datei dazu, nennt die
Haushalt-App die fehlende Datei.

## 6. Haushalt-App verbinden

Erst wenn die neue Version der Haushalt-App veröffentlicht ist (verbindet sich auf der Website von selbst mit diesem
Projekt):

1. **Dein Handy:** Haushalt-App öffnen, einmal neu laden. **Einstellungen, Abgleich zwischen euren Handys** zeigt
   «Anmelden, verbunden mit xlbddpaxwjgseqxaicuf.supabase.co». Mail-Adresse eingeben, Code aus der Mail eintippen.
   Der Haushalt wird hochgeladen; die Zahl der gesammelten Änderungen sinkt auf 0, dann steht «Verbunden».
   - Bist du im selben Browser schon in Taktwerk angemeldet, ist die Haushalt-App es auch und gleicht gleich ab.
   - Steht dort eine andere Adresse (ein früher eingetragenes Projekt): **Verbindung ändern, Zurück zum gemeinsamen
     Konto**.
2. **Partnerin einladen:** **Partner einladen** zeigt einen Code (7 Tage gültig). Auf ihrem Handy die Haushalt-App
   öffnen, bei der Einrichtung **Einem Haushalt beitreten** wählen, Code eingeben, mit ihrer Adresse anmelden.
   - Kommt bei ihr kein Code an: Der eingebaute Mail-Versand von Supabase schickt je nach Stand nur an Mitglieder des
     eigenen Supabase-Teams. Dann sie unter **Organization, Team** mit der Rolle *Read-only* einladen (sie sieht damit
     auch das Dashboard) oder einen eigenen Versand einrichten (Anleitung im Repo `study-hub`,
     `supabase/README.md`, Abschnitt 6).

## 7. Altes Haushalt-Projekt löschen

Wenn der Haushalt im gemeinsamen Projekt liegt (**Table Editor**, Tabelle `household` hat eine Zeile,
`transaction_header` eure Belege): im alten Haushalt-Projekt **Project Settings, General, Delete project**. Damit ist
der Platz frei für den Study Hub.

## Was gleich bleibt

- Taktwerk im Browser und die Desktop-App nutzen dasselbe Projekt wie bisher, es braucht kein neues Release.
- Abmelden in einer App meldet im selben Browser auch die andere ab. Die Desktop-App hat ihre eigene Anmeldung.
- Projekt-Adresse und öffentlicher Schlüssel stehen in `.github/workflows/pages.yml` (alle Apps dieses Repos) und in
  der Haushalt-App (`v2/src/lib/supabase.ts`). Beim Kochbuch kommt die Anmeldung dazu, sobald es Rezepte abgleicht.

## Fehlerbehebung

| Meldung oder Zeichen | Lösung |
|---|---|
| «Diese Mail-Adresse ist für die Apps nicht freigeschaltet» | Adresse fehlt oder ist vertippt: Schritt 4.2 mit der richtigen Adresse |
| Mail enthält einen Link statt eines Codes | Vorlagen aus Schritt 2 |
| Haushalt meldet fehlende Dateien | Schritt 5, die genannten Dateien ausführen |
| «Dieser Login gehört schon zu einem anderen Haushalt» | Die Partnerin hat sich vor dem Beitritt angemeldet: auf ihrem Handy neu beginnen und **Einem Haushalt beitreten** wählen |
