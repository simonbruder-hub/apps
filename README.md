# apps
Eigene Apps für Studium und Alltag, alle auf einer gemeinsamen Website. Das Repo hiess bis Oktober 2026 `application_study`.

| App | Beschreibung |
|---|---|
| [Taktwerk](taktwerk/) | Pomodoro-Timer mit Aufgaben, Projekt-Tracking, Auswertung von Lern- und Arbeitszeit, 17 Stilen und Pausenspielen (zwei in 3D). Läuft auf Laptop und Android, installierbar und offline. |
| [Lernlabor](lernlabor/) | Elektrotechnik lernen: Schaltungen aufbauen, Strom und Spannung im Oszilloskop, Zeiger, Frequenzgang, Theorie und Aufgaben in Stufen. Installierbar und offline. |
| [Kochbuch](kochbuch/) | Rezepte aus dem privaten Kochbuch-Repo nach Art, Ernährung, Jahreszeit und Magen-Ampel filtern, Portionen umrechnen, Einkaufszettel mit Übergabe an Kasse unterwegs. Die Rezepte bleiben auf dem Gerät. Installierbar und offline. |
| [Lohnrechner](lohn/) | Monatslohn in Stundenlohn umrechnen und zurück, mit 13. Monatslohn, Ferien- und Feiertagszuschlag; Pensum, Wochenstunden, Ferien und Feiertage frei wählbar. Dazu der Nettolohn nach AHV, ALV, Unfall und Pensionskasse und der Lohn für gearbeitete Stunden. Die Eingaben bleiben im Browser. Installierbar und offline. |
| [Haushalt](https://github.com/simonbruder-hub/haushaltskasse-app) | Einkäufe, Konten, Budget und Ausgleich für zwei, mit Beleg-Scanner und Preisvergleich. Liegt im eigenen Repo `haushaltskasse-app` und ist hier nur auf der Startseite verlinkt. Die Einkaufsliste ist vorerst in der älteren App «Kasse unterwegs» im selben Repo. |

Website: <https://simonbruder-hub.github.io/apps/> (gemeinsame Startseite, `index.html`), Taktwerk unter `/taktwerk/app/`, Lernlabor unter `/lernlabor/app/`, Kochbuch unter `/kochbuch/app/`, Lohnrechner unter `/lohn/app/`.
Haushalt läuft unter `/haushaltskasse-app/neu/`, Kasse unterwegs unter `/haushaltskasse-app/`. Vorschaubilder der Startseite für
Apps aus anderen Repos liegen in `img/`.

## Aufbau

| Ordner oder Datei | Inhalt |
|---|---|
| `apps.json` | Liste aller Apps. CI und GitHub Pages bauen daraus, `node scripts/apps.mjs pruefen` prüft Ordner und Karten der Startseite |
| [`gemeinsam/`](gemeinsam/) | Gemeinsames Aussehen: Schriften, Farben hell und dunkel, Knöpfe, Felder, Karten; jede App setzt nur ihre Akzentfarbe |
| [`vorlage/`](vorlage/) | Leere App mit Beispiel und Tests; Anleitung für eine neue App im README dort |
| [`konten/`](konten/) | Gemeinsames Supabase-Konto für Taktwerk, Haushalt und später Kochbuch: Anleitung und SQL für den Zugang |
| `index.html` | Startseite mit einer Karte pro App |
| `docs/AUFGABEN.md` | Aufgaben und Entscheide |
