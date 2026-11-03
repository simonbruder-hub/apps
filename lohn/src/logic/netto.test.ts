import { type Eingaben, rechne } from './lohn';
import { type Abzuege, abziehen, nettolohn } from './netto';
import { franken } from './zahlen';

/** Sätze 2026 und 1 % Nichtberufsunfall, ohne Krankentaggeld und Pensionskasse */
const SAETZE: Abzuege = { ahv: 0.053, alv: 0.011, nbu: 0.01, ktg: 0, pk: 0 };

describe('Abzüge von einer Lohnzahlung', () => {
  it('zieht AHV/IV/EO, ALV und Nichtberufsunfall ab', () => {
    expect(abziehen(5000, 65_000, SAETZE)).toEqual({
      brutto: 5000, ahv: 265, alv: 55, nbu: 50, ktg: 0, pk: 0, total: 370, netto: 4630, begrenzt: false,
    });
  });

  it('zieht die Pensionskasse als Betrag ab, beim 13. Monatslohn nicht', () => {
    const a = { ...SAETZE, pk: 250 };
    expect(abziehen(5000, 65_000, a)).toMatchObject({ pk: 250, total: 620, netto: 4380 });
    expect(abziehen(5000, 65_000, a, false)).toMatchObject({ pk: 0, total: 370, netto: 4630 });
  });

  it('rundet jeden Abzug auf Rappen, der Nettolohn ist der Rest', () => {
    const n = abziehen(1360, 16_320, { ...SAETZE, ktg: 0.005 });
    expect(n).toMatchObject({ ahv: 72.08, alv: 14.96, nbu: 13.6, ktg: 6.8, total: 107.44, netto: 1252.56 });
    expect(n.brutto - n.ahv - n.alv - n.nbu - n.ktg - n.pk).toBeCloseTo(n.netto, 8);
  });

  it('erhebt ALV und Nichtberufsunfall nur bis zum Höchstlohn', () => {
    // 195'000 Fr. im Jahr: ALV und Unfall nur auf 148'200 / 195'000 = 76 % jeder Zahlung
    expect(abziehen(15_000, 195_000, SAETZE)).toMatchObject({ ahv: 795, alv: 125.4, nbu: 114, netto: 13_965.6, begrenzt: true });
  });
});

describe('Nettolohn zum Ergebnis', () => {
  const BEISPIEL: Eingaben = {
    richtung: 'monat', monatslohn: 5200, stundenlohn: 0, dreizehnter: true,
    pensum: 100, wochenstunden: 42, ferientage: 25, feiertage: 9,
  };

  it('rechnet netto pro Monat, für den 13. Monatslohn, pro Stunde und pro Jahr', () => {
    const n = nettolohn(rechne(BEISPIEL), { ...SAETZE, pk: 250 });
    expect(n.monat).toMatchObject({ brutto: 5200, total: 634.8, netto: 4565.2 });
    expect(n.dreizehnter).toMatchObject({ pk: 0, netto: 4815.2 });
    expect(n.jahr).toBeCloseTo(59_597.6, 8);
    // 35.36 Fr. brutto pro Stunde minus 7.4 %, minus 250 × 12 / 2184 Stunden Pensionskasse
    expect(franken(n.stunde)).toBe('31.37');
  });

  it('ohne 13. Monatslohn gibt es zwölf Zahlungen', () => {
    const n = nettolohn(rechne({ ...BEISPIEL, dreizehnter: false }), SAETZE);
    expect(n.dreizehnter).toBeNull();
    expect(n.jahr).toBeCloseTo(n.monat.netto * 12, 8);
  });
});
