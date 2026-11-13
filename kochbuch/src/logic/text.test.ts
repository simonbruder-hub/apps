import { anzahl } from './text';

describe('Texte', () => {
  it('setzt Einzahl und Mehrzahl', () => {
    expect(anzahl(1, 'Rezept', 'Rezepte')).toBe('1 Rezept');
    expect(anzahl(0, 'Rezept', 'Rezepte')).toBe('0 Rezepte');
    expect(anzahl(4, 'Zutat', 'Zutaten')).toBe('4 Zutaten');
  });
});
