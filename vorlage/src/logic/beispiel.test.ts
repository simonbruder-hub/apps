import { ausSpeicher, lesen, ohm, START } from './beispiel';
import { anzeige, zahl } from './zahlen';

describe('ohm', () => {
  it('rechnet Spannung und Leistung', () => {
    const e = ohm(100, 0.02);
    expect(e.spannung).toBeCloseTo(2);
    expect(e.leistung).toBeCloseTo(0.04);
  });
});

describe('lesen', () => {
  it('nimmt Komma und Tausendertrennzeichen', () => {
    expect(lesen({ widerstand: "1'000", strom: '0,5' }).werte).toEqual({ widerstand: 1000, strom: 0.5 });
  });

  it('meldet leere und negative Werte pro Feld', () => {
    const { werte, fehler } = lesen({ widerstand: '', strom: '-1' });
    expect(werte).toBeNull();
    expect(fehler).toEqual({ widerstand: 'Zahl ab 0 eingeben', strom: 'Zahl ab 0 eingeben' });
  });
});

describe('ausSpeicher', () => {
  it('ergänzt fehlende Felder und ignoriert Unsinn', () => {
    expect(ausSpeicher({ widerstand: '47', strom: 3 })).toEqual({ ...START, widerstand: '47' });
    expect(ausSpeicher(null)).toEqual(START);
  });
});

describe('zahlen', () => {
  it('liest Zahlen aus Text', () => {
    expect(zahl(' 37,5 ')).toBe(37.5);
    expect(zahl('5’000')).toBe(5000);
    expect(zahl('.5')).toBe(0.5);
    expect(zahl('abc')).toBeNull();
    expect(zahl('')).toBeNull();
  });

  it('zeigt höchstens drei Nachkommastellen', () => {
    expect(anzeige(2)).toBe('2');
    expect(anzeige(0.04)).toBe('0.04');
    expect(anzeige(1 / 3)).toBe('0.333');
    expect(anzeige(12345.6789)).toBe('12’345.679');
  });
});
