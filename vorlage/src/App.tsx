/**
 * Vorlage: Kopfzeile mit «Alle Apps», Eingaben, Ergebnis. Aussehen aus der gemeinsamen Basis
 * (gemeinsam/basis.css: .top, .card, .feld, .gross, .eckdaten …), hier nur die Inhalte.
 */
import { useLayoutEffect, useState } from 'preact/hooks';
import { type Fehler, type Formular, lesen, ohm } from './logic/beispiel';
import { anzeige } from './logic/zahlen';
import { laden, speichern } from './speicher';

function Logo() {
  return (
    <svg viewBox="0 0 32 32" class="brand-logo" aria-hidden="true">
      <rect x="1" y="1" width="30" height="30" rx="8" class="bl-bg" />
      <path d="M5 16h5M22 16h5" class="bl-strich" />
      <rect x="10" y="12" width="12" height="8" rx="1.5" class="bl-strich" />
    </svg>
  );
}

interface FeldProps { id: keyof Formular; label: string; einheit: string; info: string; f: Formular; fehler: Fehler; setze: (k: keyof Formular, v: string) => void }

function Feld({ id, label, einheit, info, f, fehler, setze }: FeldProps) {
  const meldung = fehler[id];
  return (
    <div class={`feld${meldung ? ' is-fehler' : ''}`}>
      <label for={id}>{label}</label>
      <div class="eingabe">
        <input id={id} inputMode="decimal" autoComplete="off" value={f[id]} aria-invalid={meldung ? 'true' : undefined}
          aria-describedby={`${id}-info`} onInput={e => setze(id, e.currentTarget.value)} />
        <span class="einheit">{einheit}</span>
      </div>
      <p class="feld-info" id={`${id}-info`}>{meldung ?? info}</p>
    </div>
  );
}

export function App() {
  const [f, setF] = useState<Formular>(laden);
  // Gleich nach dem Zeichnen speichern, nicht erst im nächsten Frame: sonst fehlt nach sofortigem Neuladen die letzte Eingabe
  useLayoutEffect(() => speichern(f), [f]);
  const setze = (k: keyof Formular, v: string) => setF(alt => ({ ...alt, [k]: v }));
  const { werte, fehler } = lesen(f);
  const e = werte ? ohm(werte.widerstand, werte.strom) : null;
  return (
    <>
      <header class="top">
        <a class="brand" href="./">
          <Logo />
          <span>Vorlage</span>
        </a>
        <a class="alle-apps" href="../../" title="Alle Apps"><span>Alle Apps</span></a>
      </header>
      <main>
        <div class="page">
          <section class="hero">
            <h1>Vorlage</h1>
            <p class="lead">Grundgerüst für neue Apps. Das Beispiel rechnet mit dem ohmschen Gesetz: <span class="formel">U = R · I</span>.</p>
          </section>
          <div class="raster">
            <section class="card" aria-labelledby="eingaben-titel">
              <h2 id="eingaben-titel">Eingaben</h2>
              <div class="felder">
                <Feld id="widerstand" label="Widerstand R" einheit="Ω" info="Zum Beispiel 100" f={f} fehler={fehler} setze={setze} />
                <Feld id="strom" label="Strom I" einheit="A" info="20 mA = 0.02 A" f={f} fehler={fehler} setze={setze} />
              </div>
            </section>
            <section class="card" data-testid="ergebnis" aria-live="polite">
              <p class="eyebrow">Spannung</p>
              {e ? (
                <>
                  <p class="gross"><span class="betrag">{anzeige(e.spannung)}</span><span class="einheit">V</span></p>
                  <dl class="eckdaten">
                    <div><dt>Leistung P = U · I</dt><dd>{anzeige(e.leistung)} W</dd></div>
                  </dl>
                </>
              ) : (
                <p class="panel-note is-bad">Bitte die Eingaben prüfen.</p>
              )}
            </section>
          </div>
          <p class="small muted">Die Eingaben bleiben in diesem Browser.</p>
        </div>
      </main>
    </>
  );
}
