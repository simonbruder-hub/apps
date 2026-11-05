/** Zahlen aus Eingabefeldern lesen und für die Anzeige schreiben */

/** Liest eine Zahl wie «5'000», «37,5» oder «0.02». Leer oder ungültig: null. */
export function zahl(text: string): number | null {
  const t = text.trim().replace(/[\s'’]/g, '').replace(',', '.');
  if (!/^-?(\d+\.?\d*|\.\d+)$/.test(t)) return null;
  return Number(t);
}

/** Höchstens drei Nachkommastellen, ohne Nullen am Ende, Tausender mit ’ (wie in der Schweiz) */
export function anzeige(x: number): string {
  const [ganz = '0', rest] = (Math.round(x * 1000) / 1000).toFixed(3).replace(/\.?0+$/, '').split('.');
  const tausender = ganz.replace(/\B(?=(\d{3})+(?!\d))/g, '’');
  return rest ? `${tausender}.${rest}` : tausender;
}
