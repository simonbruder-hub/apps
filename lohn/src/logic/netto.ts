/**
 * Nettolohn: Bruttolohn minus die Sozialabzüge der Arbeitnehmerin oder des Arbeitnehmers, ohne Steuern.
 * Startwerte sind die Sätze 2026: AHV/IV/EO 5.3 %, ALV 1.1 % bis 148'200 Fr. im Jahr. Nichtberufsunfall und
 * Krankentaggeld hängen von der Versicherung ab, die Pensionskasse kommt als Betrag pro Monat aus der Lohnabrechnung.
 * Jeder Abzug wird wie auf einer Lohnabrechnung auf Rappen gerundet, der Nettolohn ist der Rest.
 */
import type { Ergebnis } from './lohn';
import { rappen } from './zahlen';

/** Höchster versicherter Jahreslohn für ALV und Unfallversicherung (2026) */
export const HOECHSTLOHN = 148_200;

export interface Abzuege {
  /** Sätze als Anteil: 0.053 = 5.3 % */
  ahv: number;
  alv: number;
  nbu: number;
  ktg: number;
  /** Pensionskasse in Franken pro Monat */
  pk: number;
}

/** Eine Lohnzahlung und ihre Abzüge in Franken, auf Rappen */
export interface Netto {
  brutto: number;
  ahv: number;
  alv: number;
  nbu: number;
  ktg: number;
  pk: number;
  total: number;
  netto: number;
  /** ALV und Nichtberufsunfall nur auf einem Teil des Lohns, weil der Jahreslohn über dem Höchstlohn liegt */
  begrenzt: boolean;
}

/** Anteil des Lohns, auf dem ALV und Nichtberufsunfall erhoben werden */
const versichert = (jahreslohn: number) => (jahreslohn > HOECHSTLOHN ? HOECHSTLOHN / jahreslohn : 1);

/** Abzüge von einer Lohnzahlung. Der Jahreslohn entscheidet über den Höchstlohn; ohne Pensionskasse beim 13. Monatslohn. */
export function abziehen(brutto: number, jahreslohn: number, a: Abzuege, mitPk = true): Netto {
  const b = rappen(brutto);
  const anteil = versichert(jahreslohn);
  const ahv = rappen(b * a.ahv);
  const alv = rappen(b * anteil * a.alv);
  const nbu = rappen(b * anteil * a.nbu);
  const ktg = rappen(b * a.ktg);
  const pk = mitPk ? rappen(a.pk) : 0;
  const total = rappen(ahv + alv + nbu + ktg + pk);
  return { brutto: b, ahv, alv, nbu, ktg, pk, total, netto: rappen(b - total), begrenzt: anteil < 1 };
}

/**
 * Netto pro Monat, für den 13. Monatslohn (ohne Pensionskasse), pro Stunde und pro Jahr.
 * Pro Stunde ist ungerundet: die Pensionskasse ist auf die Arbeitsstunden des Jahres verteilt.
 */
export function nettolohn(r: Ergebnis, a: Abzuege) {
  const monat = abziehen(r.monatslohn, r.jahreslohn, a);
  const dreizehnter = r.monatsloehne === 13 ? abziehen(r.monatslohn, r.jahreslohn, a, false) : null;
  const satz = a.ahv + versichert(r.jahreslohn) * (a.alv + a.nbu) + a.ktg;
  const stunde = r.stunde.brutto * (1 - satz) - (a.pk * 12) / r.jahresstunden;
  const jahr = rappen(monat.netto * 12 + (dreizehnter?.netto ?? 0));
  return { monat, dreizehnter, stunde, jahr };
}
