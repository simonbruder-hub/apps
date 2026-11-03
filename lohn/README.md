# Lohnrechner

Monatslohn in Stundenlohn umrechnen und zurück, mit 13. Monatslohn, Ferien- und Feiertagszuschlag. Dazu der
Nettolohn und der Lohn für die gearbeiteten Stunden eines Monats. Vorlage war die Excel-Tabelle
«Berechnung ML auf Std.», der Rechner kommt auf dieselben Beträge.

Adresse: `https://simonbruder-hub.github.io/apps/lohn/app/`

## So rechnet er

| Schritt | Formel |
|---|---|
| Jahreslohn | Monatslohn × 13, ohne 13. Monatslohn × 12 |
| Arbeitsstunden im Jahr | Wochenstunden bei 100 % × Pensum × 52 |
| Stundenlohn mit 13. Monatslohn | Jahreslohn / Arbeitsstunden im Jahr |
| Ferienzuschlag | Ferientage / (260 - Ferientage), z. B. 25 Tage = 10.64 % |
| Feiertagszuschlag | Feiertage / (260 - Feiertage), z. B. 9 Tage = 3.59 % |
| Brutto pro Stunde | Stundenlohn mit 13. Monatslohn × (1 + Ferienzuschlag + Feiertagszuschlag) |

260 sind die Arbeitstage eines Jahres (52 Wochen zu 5 Tagen). Die Zuschläge sind auf 0.01 % gerundet wie in
Verträgen. Die Beträge rechnet er ungerundet und rundet erst für die Anzeige auf Rappen, genau wie die Excel-Tabelle.
Darum kann eine Summe um einen Rappen von ihren Zeilen abweichen.

- **Rückwärts:** Stundenlohn mit allen Zuschlägen geteilt durch (1 + Ferienzuschlag + Feiertagszuschlag), von dort
  auf den Monatslohn. Bei einem Teilpensum zeigt er auch den Monatslohn bei 100 %.
- **Verdienst aus Stunden:** Stunden × Brutto-Stundenlohn (auf Rappen, wie angezeigt), aufgeteilt in Grundlohn,
  13. Monatslohn, Ferien- und Feiertagszuschlag. Die Anteile ergeben zusammen genau den Bruttolohn.

## Nettolohn

Bruttolohn minus die Abzüge der Arbeitnehmerin oder des Arbeitnehmers, vor den Steuern (die zahlt man in der
Schweiz selbst). Startwerte sind die Sätze 2026, alle lassen sich ändern:

| Abzug | Startwert | Hinweis |
|---|---|---|
| AHV/IV/EO | 5.3 % | gesetzlich, 2026 unverändert |
| ALV | 1.1 % | nur bis 148'200 Fr. Jahreslohn, darüber nichts |
| Nichtberufsunfall | 1 % | Satz aus der Lohnabrechnung; unter 8 Stunden pro Woche beim gleichen Arbeitgeber 0 |
| Krankentaggeld | 0 % | nur wenn der Arbeitgeber eine Versicherung hat |
| Pensionskasse | 0 Fr. | Betrag pro Monat aus der Lohnabrechnung, keine Schätzung |

- Jeder Abzug wird wie auf einer Lohnabrechnung auf Rappen gerundet, der Nettolohn ist der Rest.
- Den Nichtberufsunfall rechnet er wie die ALV nur bis 148'200 Fr. im Jahr.
- **Pro Monat:** Monatslohn minus alle Abzüge. Der 13. Monatslohn hat keinen Abzug für die Pensionskasse,
  netto pro Jahr ist darum 12 × netto pro Monat + 13. Monatslohn netto.
- **Pro Stunde:** Brutto-Stundenlohn minus die Prozente, die Pensionskasse auf die Arbeitsstunden des Jahres verteilt.
- **Verdienst aus Stunden:** derselbe Weg für den Lohn der gearbeiteten Stunden, mit der Pensionskasse pro Monat.

## Die Zahlen bleiben privat

Die App ist öffentlich, die Eingaben nicht. Sie bleiben im Speicher des Browsers (`localStorage`, Schlüssel
`lohn.formular.v1`). Die Startwerte (5000 Fr., 42 Stunden, 25 Ferientage, 9 Feiertage) sind nur ein Beispiel.
Eingaben dürfen Tausendertrennzeichen und ein Komma enthalten (`5'000`, `37,5`).

## Technik

Vite, Preact, TypeScript, PWA (offline), sonst keine Bibliotheken. Aufbau wie das Kochbuch.

- `src/logic/`: Zahlen lesen und schreiben (`zahlen.ts`), Umrechnen und Verdienst (`lohn.ts`), Nettolohn (`netto.ts`), Formular und Prüfung (`formular.ts`)
- `src/App.tsx`: die Seite, `src/speicher.ts`: Speicher im Browser

```bash
npm ci
npm run dev        # http://localhost:5176
npm test           # Zahlen, Umrechnen, Nettolohn, Formular
npm run typecheck
npm run build      # dist/app
npm run test:e2e   # Playwright gegen dist/app (vorher bauen)
npm run icons      # PNG-Icons aus web/public/icon.svg
```

Mit einem vorinstallierten Chromium anderer Version: `PW_CHROMIUM=/pfad/zu/chrome npm run test:e2e`.
