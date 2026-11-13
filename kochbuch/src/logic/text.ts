/** Zahl mit dem passenden Wort: «1 Rezept», «3 Rezepte» */
export const anzahl = (n: number, eins: string, mehrere: string): string => `${n} ${n === 1 ? eins : mehrere}`;
