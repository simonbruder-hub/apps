/**
 * Beispiel der Vorlage: ohmsches Gesetz. Spannung U = R · I, Leistung P = U · I.
 * Für eine neue App durch die eigene Rechnung ersetzen; der Aufbau bleibt: Formular (Texte aus den Feldern),
 * lesen() prüft und wandelt in Zahlen, die Rechnung selbst kennt nur Zahlen.
 */
import { zahl } from './zahlen';

/** Inhalt der Eingabefelder, so wie er im Browser gespeichert wird */
export interface Formular { widerstand: string; strom: string }

export const START: Formular = { widerstand: '100', strom: '0.02' };

export interface Ergebnis { spannung: number; leistung: number }

export function ohm(widerstand: number, strom: number): Ergebnis {
  const spannung = widerstand * strom;
  return { spannung, leistung: spannung * strom };
}

export type Fehler = Partial<Record<keyof Formular, string>>;

/** Prüft das Formular: Zahlen ab 0, sonst eine Meldung pro Feld */
export function lesen(f: Formular): { werte: { widerstand: number; strom: number } | null; fehler: Fehler } {
  const fehler: Fehler = {};
  const r = zahl(f.widerstand);
  const i = zahl(f.strom);
  if (r === null || r < 0) fehler.widerstand = 'Zahl ab 0 eingeben';
  if (i === null || i < 0) fehler.strom = 'Zahl ab 0 eingeben';
  return { werte: r !== null && i !== null && r >= 0 && i >= 0 ? { widerstand: r, strom: i } : null, fehler };
}

/** Gespeicherte Werte übernehmen, fehlende Felder mit dem Start ergänzen */
export function ausSpeicher(roh: unknown): Formular {
  const f = { ...START };
  if (roh && typeof roh === 'object') {
    for (const k of Object.keys(START) as (keyof Formular)[]) {
      const v = (roh as Record<string, unknown>)[k];
      if (typeof v === 'string') f[k] = v;
    }
  }
  return f;
}
