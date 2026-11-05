# Gemeinsame Basis

Aussehen, das alle Apps teilen: Schriften, Grundfarben für hell und dunkel, Kopfzeile mit «Alle Apps», Knöpfe,
Felder, Karten. Genutzt von der Startseite, Kochbuch, Lohnrechner und der Vorlage. Taktwerk behält seine 17 Stile;
die Grundfarben hier sind die seines Standardstils.

| Datei | Inhalt |
|---|---|
| `basis.css` | Schriften, Farben (`--bg`, `--surface`, `--ink`, `--muted`, `--line`, `--accent` …), Bausteine |
| `schriften/` | Atkinson Hyperlegible (Text), Bricolage Grotesque (Titel), Martian Mono (Zahlen); Lizenz `OFL.txt` |
| `apps.svg` | Logo der Startseite |

Die Schriften liegen im Repo statt bei Google: kein Aufruf an fremde Server, und eine installierte App hat sie
schon beim ersten Start offline (Vite packt sie in den Build, der Service Worker speichert sie).

## Einbinden

In einer App, oben in `src/styles/app.css`, danach nur die eigene Farbe:

```css
@import "../../../gemeinsam/basis.css";

:root {
  --app-accent: #6a46c9;        /* Akzent hell */
  --app-accent-dark: #a98cff;   /* Akzent im Dunkeln, heller */
  --app-on-accent-dark: #1b1030; /* Schrift auf dem dunklen Akzent */
}
```

In `vite.config.ts` den Ordner für den Entwicklungsserver freigeben:
`server: { fs: { allow: [<App-Ordner>, <../gemeinsam>] } }` (siehe `vorlage/vite.config.ts`).
Die Startseite bindet die Datei mit `<link rel="stylesheet" href="gemeinsam/basis.css">` ein; Pages kopiert dafür
den Ordner nach `/apps/gemeinsam/`.

## Bausteine

| Klasse | Wofür |
|---|---|
| `.top`, `.brand`, `.brand-logo`, `.bl-bg` | Kopfzeile mit Logo links |
| `.alle-apps` | Link zur Startseite: `<a class="alle-apps" href="../../" title="Alle Apps"><span>Alle Apps</span></a>`, auf dem Handy nur das Symbol |
| `main`, `.page`, `.hero`, `.lead`, `.eyebrow` | Seitenaufbau |
| `.card`, `.panel-note` (`.is-bad`, `.is-good`), `.aktionen` | Karten und Hinweise |
| `.btn`, `.btn-primary`, `.btn-icon`, `.link`, `.chip`, `.badge` | Knöpfe und Chips |
| `.feld`, `.eingabe`, `.einheit`, `.feld-info`, `.felder`, `.seg`, `.schalter` | Formulare, Zahlen mit Einheit |
| `.gross .betrag`, `.eckdaten` | Ergebnis als grosse Zahl, Eckdaten darunter |
| `.toast`, `.sr-only`, `.mono`, `.muted`, `.small` | Meldung unten und Hilfsklassen |

Hell und dunkel folgen dem Gerät; `data-theme="light"` oder `"dark"` auf `<html>` legt eines fest (wie im
Kochbuch). Ändert sich hier etwas, betrifft es alle Apps: danach Startseite, Kochbuch, Lohnrechner und Vorlage
ansehen und ihre Tests laufen lassen.
