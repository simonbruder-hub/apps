/** Geladene Datei, neue Version laden, vom Gerät entfernen */
import { useState } from 'preact/hooks';
import { anzahl } from '../logic/text';
import { bestand, entferne, speicherFehlt } from '../state';
import { toast } from '../ui/toast';
import { Import, UnlesbarHinweis, WoherDatei } from './Import';

const datum = (iso: string) => new Date(iso).toLocaleString('de-CH', { dateStyle: 'medium', timeStyle: 'short' });

export function Daten() {
  const b = bestand.value;
  const [fehler, setFehler] = useState<string | null>(null);

  async function entfernen() {
    if (!confirm('Alle Rezepte und den Einkaufszettel von diesem Gerät entfernen?')) return;
    setFehler(null);
    try {
      await entferne();
      toast('Rezepte entfernt');
    } catch (e) {
      console.error('Entfernen', e);
      setFehler('Die Rezepte liessen sich nicht entfernen. Lade die Seite neu und versuche es nochmals.');
    }
  }

  return (
    <div class="page daten">
      <h1>Daten</h1>
      {speicherFehlt.value && <p class="panel-note is-bad">Dieser Browser erlaubt hier keinen Speicher (z. B. privates Fenster). Die Rezepte gehen beim Schliessen verloren.</p>}
      <section class="card">
        {b ? (
          <>
            <h2>{b.kochbuch.titel}</h2>
            <p>{anzahl(b.kochbuch.rezepte.length, 'Rezept', 'Rezepte')} aus «{b.datei}», geladen am {datum(b.geladen)}.</p>
            <p class="muted small">Nach Änderungen im Kochbuch die neue Datei laden. Sie ersetzt die bisherige.</p>
            <Import erneut />
            <p>
              <button type="button" class="btn btn-danger" onClick={() => void entfernen()}>Rezepte von diesem Gerät entfernen</button>
            </p>
            {fehler && <p class="panel-note is-bad" role="alert">{fehler}</p>}
          </>
        ) : (
          <>
            <h2>Noch keine Rezepte auf diesem Gerät</h2>
            <UnlesbarHinweis />
            <Import />
          </>
        )}
      </section>
      <section class="card">
        <h2>Woher kommt die Datei?</h2>
        <WoherDatei />
      </section>
      <section class="card">
        <h2>Privat</h2>
        <p>Die Rezepte stehen nicht auf der Website. Sie liegen nur in diesem Browser und werden nirgends hochgeladen. Jedes Gerät lädt die Datei einmal selbst.</p>
        <p class="muted small">Der Einkaufszettel bleibt ebenfalls auf dem Gerät. «An Kasse unterwegs senden» schreibt nur in die Haushaltsapp im selben Browser.</p>
      </section>
    </div>
  );
}
