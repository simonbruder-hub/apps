/** Das Formular bleibt nur in diesem Browser (localStorage), nichts geht ins Netz. Schlüssel pro App ändern. */
import { ausSpeicher, type Formular, START } from './logic/beispiel';

const KEY = 'vorlage.formular.v1';

export function laden(): Formular {
  try {
    return ausSpeicher(JSON.parse(localStorage.getItem(KEY) ?? 'null'));
  } catch {
    return { ...START };
  }
}

export function speichern(f: Formular) {
  try {
    localStorage.setItem(KEY, JSON.stringify(f));
  } catch { /* ohne Speicher, z. B. im privaten Fenster */ }
}
