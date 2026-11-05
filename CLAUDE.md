# apps: Hinweise für Claude

Diese Datei lädt in jedem Chat automatisch. Kurz halten, nur Orientierung.

**Repo:** Simons eigene Apps für Studium und Alltag, eine gemeinsame Website auf GitHub Pages
(https://simonbruder-hub.github.io/apps/, Startseite `index.html`). Jede App hat ihren eigenen Ordner mit eigenem
`package.json`; Befehle immer im Ordner der App.

| Ordner | App | Stand und Doku |
|---|---|---|
| `taktwerk/` | Pomodoro-Timer und Stechuhr, Sync über Supabase, Desktop-App (Tauri) | `taktwerk/docs/STATUS.md` |
| `kochbuch/` | Rezepte filtern, Portionen, Einkauf; die Rezepte kommen aus dem privaten Repo `Kochbuch_Altstetten` | `kochbuch/README.md` |
| `lohn/` | Lohnrechner: Monatslohn und Stundenlohn umrechnen, nach der Excel-Vorlage «Berechnung ML auf Std.» | `lohn/README.md` |
| `lernlabor/` | Elektrotechnik-Lernapp; vorerst stillgelegt, soll in den Study Hub (Repo `study-hub`) umziehen | `lernlabor/README.md` |
| `vorlage/` | Leere App mit Beispiel und Tests, Ausgangspunkt für neue Apps (nicht veröffentlicht) | `vorlage/README.md` |
| `gemeinsam/` | Gemeinsames Aussehen: `basis.css` mit Schriften, Farben, Bausteinen; jede App setzt nur ihre Akzentfarbe | `gemeinsam/README.md` |
| `konten/` | Gemeinsames Supabase-Konto (Projekt von Taktwerk, auch Haushalt): Anleitung fürs Dashboard, SQL für den Zugang | `konten/README.md` |

Die Haushalt-App ist nur auf der Startseite verlinkt, sie liegt im eigenen Repo `haushaltskasse-app`.
`apps.json` listet alle Apps; CI und Pages bauen daraus. Neue App: `vorlage/README.md`.

**Neuer Chat:** «Mach Aufgabe N aus docs/AUFGABEN.md.» Dort stehen Entscheide, Aufgaben und technische Hinweise.
`taktwerk/docs/STATUS.md` nur für Aufgaben zu Taktwerk lesen.

## Arbeitsweise

- Deutsch, kein scharfes S, keine Gedankenstriche. Kurz erklären: Simon studiert Elektrotechnik, kennt Python und
  LaTeX, wenig Webentwicklung.
- Erst gezielte Fragen zu Unklarem, dann ein kurzer Plan, dann umsetzen. Eigener Branch und PR, CI grün machen,
  mergen erst nach Simons OK (erst dann baut GitHub Pages neu).
- Tokens sparen: nur lesen, was die Aufgabe braucht; lokal nur die betroffenen Tests, die volle Prüfung macht die CI.
- Am Ende: in `docs/AUFGABEN.md` die erledigte Aufgabe auf eine Zeile mit PR kürzen, bei Taktwerk
  `taktwerk/docs/STATUS.md` nachführen; diese Datei, wenn sich Befehle oder Stolpersteine ändern.
- Private Inhalte (Rezepte, Daten aus Taktwerk) kommen nicht auf die öffentliche Website.

## Befehle (im Ordner der App)

```bash
npm ci
npm run typecheck && npm test
npm run build
PW_CHROMIUM=/opt/pw-browsers/chromium npm run test:e2e
npm run db:test        # nur taktwerk, braucht PostgreSQL 16; prüft auch konten/zugang.sql
npm run build:single   # nur taktwerk
node scripts/apps.mjs pruefen   # im Repo-Ordner: apps.json, Ordner und Karten der Startseite
```

## Stolpersteine in der Cloud

- PR erstellen: `gh api repos/simonbruder-hub/apps/pulls -f title=... -f head=... -f base=main -F body=@datei`
  (`gh pr create` geht nicht). CI-Logs sind gesperrt; Fehler stehen in den Annotations:
  `gh api repos/simonbruder-hub/apps/check-runs/<id>/annotations`.
- Neuer Branch: zusätzlich `git config --add remote.origin.fetch +refs/heads/<branch>:refs/remotes/origin/<branch>`,
  sonst meldet der Stop-Hook ihn als nicht gepusht.
- `pkill` nur in einem eigenen Aufruf und mit Klammer im Muster: `pkill -f "vite previe[w]"`.
- Taktwerk-E2E: die Config kennt `PW_CHROMIUM` nicht; lokal eine `playwright.local.config.ts` mit
  `launchOptions.executablePath` anlegen (nicht committen) und `npx playwright test -c playwright.local.config.ts`.
- `npm run build:single` in Taktwerk überschreibt `download/taktwerk.html`; nicht mitcommitten, ausser gewollt.
- Unicode-Escapes (Backslash, u, vier Hexziffern) nicht mit dem Write-Werkzeug schreiben, es macht echte Zeichen
  daraus; solche Stellen per Skript schreiben.
- Weitere Hinweise (Desktop-App, Kochbuch-Repo, 3D-Spiele, bekannte wacklige Tests): `docs/AUFGABEN.md`, Abschnitt
  «Technische Hinweise».
