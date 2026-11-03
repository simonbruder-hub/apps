/**
 * Das Formular des Lohnrechners: Werte so, wie sie getippt sind, und ihre Prüfung.
 * Die Startwerte sind ein neutrales Beispiel, kein echter Lohn; die Abzüge sind die Sätze 2026.
 */
import type { Eingaben, Richtung } from './lohn';
import type { Abzuege } from './netto';
import { zahl } from './zahlen';

export interface Formular {
  richtung: Richtung;
  monatslohn: string;
  stundenlohn: string;
  dreizehnter: boolean;
  pensum: string;
  wochenstunden: string;
  ferientage: string;
  feiertage: string;
  /** Gearbeitete Stunden für den Verdienst */
  stunden: string;
  /** Abzüge für den Nettolohn: Prozent, die Pensionskasse in Franken pro Monat */
  ahv: string;
  alv: string;
  nbu: string;
  ktg: string;
  pk: string;
}

export const START: Formular = {
  richtung: 'monat',
  monatslohn: '5000',
  stundenlohn: '35',
  dreizehnter: true,
  pensum: '100',
  wochenstunden: '42',
  ferientage: '25',
  feiertage: '9',
  stunden: '40',
  ahv: '5.3',
  alv: '1.1',
  nbu: '1',
  ktg: '0',
  pk: '0',
};

export type Feld = Exclude<keyof Formular, 'richtung' | 'dreizehnter'>;

/** Erlaubter Bereich je Feld und die Meldung, wenn der Wert nicht passt */
const GRENZEN: Record<Feld, [min: number, max: number, meldung: string]> = {
  monatslohn: [0.01, 1_000_000, 'Betrag über 0 eingeben'],
  stundenlohn: [0.01, 10_000, 'Betrag über 0 eingeben'],
  pensum: [1, 100, '1 bis 100 %'],
  wochenstunden: [1, 80, '1 bis 80 Stunden'],
  ferientage: [0, 100, '0 bis 100 Tage'],
  feiertage: [0, 50, '0 bis 50 Tage'],
  stunden: [0, 744, '0 bis 744 Stunden'],
  ahv: [0, 20, '0 bis 20 %'],
  alv: [0, 10, '0 bis 10 %'],
  nbu: [0, 10, '0 bis 10 %'],
  ktg: [0, 10, '0 bis 10 %'],
  pk: [0, 100_000, 'Betrag ab 0 eingeben'],
};

/** Liest ein Feld: Zahl im erlaubten Bereich oder Meldung */
export function feld(name: Feld, text: string): { wert: number } | { fehler: string } {
  const x = zahl(text);
  const [min, max, meldung] = GRENZEN[name];
  return x === null || x < min || x > max ? { fehler: meldung } : { wert: x };
}

/** Liest Felder eines Formulars und sammelt dabei die Meldungen */
function pruefer(f: Formular) {
  const fehler: Partial<Record<Feld, string>> = {};
  const wert = (name: Feld) => {
    const r = feld(name, f[name]);
    if ('fehler' in r) {
      fehler[name] = r.fehler;
      return 0;
    }
    return r.wert;
  };
  return { fehler, wert };
}

/** Prüft das Formular. Es zählt nur der Lohn der gewählten Richtung, Stunden und Abzüge werden einzeln geprüft. */
export function lesen(f: Formular): { eingaben: Eingaben | null; fehler: Partial<Record<Feld, string>> } {
  const { fehler, wert } = pruefer(f);
  const eingaben: Eingaben = {
    richtung: f.richtung,
    monatslohn: f.richtung === 'monat' ? wert('monatslohn') : 0,
    stundenlohn: f.richtung === 'stunde' ? wert('stundenlohn') : 0,
    dreizehnter: f.dreizehnter,
    pensum: wert('pensum'),
    wochenstunden: wert('wochenstunden'),
    ferientage: wert('ferientage'),
    feiertage: wert('feiertage'),
  };
  return { eingaben: Object.keys(fehler).length ? null : eingaben, fehler };
}

/** Prüft die Abzüge für den Nettolohn; aus Prozent werden Anteile (5.3 → 0.053) */
export function abzuege(f: Formular): { abzuege: Abzuege | null; fehler: Partial<Record<Feld, string>> } {
  const { fehler, wert } = pruefer(f);
  const a: Abzuege = {
    ahv: wert('ahv') / 100,
    alv: wert('alv') / 100,
    nbu: wert('nbu') / 100,
    ktg: wert('ktg') / 100,
    pk: wert('pk'),
  };
  return { abzuege: Object.keys(fehler).length ? null : a, fehler };
}

/** Gespeichertes Formular lesen; Unbekanntes oder Fehlendes kommt aus den Startwerten */
export function ausSpeicher(roh: unknown): Formular {
  const f: Formular = { ...START };
  if (!roh || typeof roh !== 'object') return f;
  const o = roh as Record<string, unknown>;
  if (o.richtung === 'monat' || o.richtung === 'stunde') f.richtung = o.richtung;
  if (typeof o.dreizehnter === 'boolean') f.dreizehnter = o.dreizehnter;
  for (const k of Object.keys(GRENZEN) as Feld[]) {
    const v = o[k];
    if (typeof v === 'string' && v.length <= 20) f[k] = v;
  }
  return f;
}
