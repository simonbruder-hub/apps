# Vorlage für neue Apps

Leere, lauffähige App als Ausgangspunkt: Vite, Preact, TypeScript, installierbar und offline (PWA), Aussehen aus der
gemeinsamen Basis (`../gemeinsam/basis.css`), Unit-Tests mit Vitest und Browser-Tests mit Playwright. Das Beispiel
rechnet mit dem ohmschen Gesetz (U = R · I) und merkt sich die Eingaben im Browser. Die Vorlage wird in der CI
geprüft, aber nicht veröffentlicht (`"website": false` in `apps.json`).

## Neue App anlegen

1. **Kopieren** (Ordnername klein, ohne Leerzeichen, wird Teil der Adresse `/apps/<ordner>/app/`):
   `cp -r vorlage meine-app && rm -rf meine-app/node_modules meine-app/dist`
2. **Namen eintragen**
   - `package.json`: `name` und `description`; dann `npm install`, das passt `package-lock.json` an
   - `vite.config.ts`: `APP` (Name, Kurzname, Beschreibung) und den Port (freie Nummer, z. B. 5180)
   - `playwright.config.ts`: Port (z. B. 4180, dreimal), `web/index.html` und `site/index.html`: Titel und Text
   - `src/styles/app.css`: eigene Akzentfarbe; `web/public/icon.svg` und `web/icon-maskable.svg`, dann `npm run icons`
   - `src/App.tsx`: Name und Logo in der Kopfzeile; `src/speicher.ts`: Schlüssel `<ordner>.formular.v1`
3. **Beispiel ersetzen**: eigene Rechnung in `src/logic/` mit Tests daneben (`*.test.ts`), Oberfläche in
   `src/App.tsx`, Browser-Tests in `tests/e2e/`
4. **In `apps.json` eintragen**: `{ "name": "Meine App", "ordner": "meine-app", "website": true }`. Ab dann baut und
   testet die CI sie, und Pages veröffentlicht sie unter `/apps/meine-app/app/`.
5. **Karte auf der Startseite** (`index.html`): Abschnitt wählen, Farbe als `--xy` bei den anderen Akzenten, Karte
   mit Link `meine-app/app/`, Vorschaubild unter `site/img/` (nur erfundene Daten), Link in der Kopfzeile
6. **Prüfen und dokumentieren**: `node scripts/apps.mjs pruefen` im Repo-Ordner, eigenes `README.md`, Zeile in
   `README.md` und `CLAUDE.md`, Aufgabe in `docs/AUFGABEN.md`

Eine App aus einem anderen Repo (z. B. später zur Bachelorarbeit) bekommt nur einen Eintrag mit `repo` und
`adresse` in `apps.json` und eine Karte auf der Startseite, wie der Haushalt.

## Befehle

```bash
npm ci
npm run dev        # http://localhost:5179
npm test           # Rechnung und Zahlen
npm run typecheck
npm run build      # dist/app
npm run test:e2e   # Playwright gegen dist/app (vorher bauen)
npm run icons      # PNG-Icons aus web/public/icon.svg
```

Mit einem vorinstallierten Chromium anderer Version: `PW_CHROMIUM=/pfad/zu/chrome npm run test:e2e`.
