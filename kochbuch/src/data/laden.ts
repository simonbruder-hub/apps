/** Liest rezepte.json oder das ZIP aus GitHub Actions und prüft den Inhalt. */
import { DatenFehler, pruefeKochbuch } from './pruefen';
import type { Kochbuch } from './types';
import { entpacke, istZip, leseZip } from './zip';

export async function ladeDaten(buf: ArrayBuffer): Promise<Kochbuch> {
  const bytes = new Uint8Array(buf);
  let roh: Uint8Array = bytes;
  if (istZip(bytes)) {
    const jsons = leseZip(buf).filter(e => /\.json$/i.test(e.name) && !e.name.startsWith('__MACOSX/'));
    const eintrag = jsons.find(e => /(^|\/)rezepte\.json$/i.test(e.name)) ?? jsons[0];
    if (!eintrag) throw new DatenFehler('Im ZIP liegt keine JSON-Datei.');
    roh = await entpacke(eintrag);
  }
  let daten: unknown;
  try {
    daten = JSON.parse(new TextDecoder().decode(roh).replace(/^﻿/, ''));
  } catch {
    throw new DatenFehler('Die Datei ist weder rezepte.json noch das ZIP mit rezepte.json.');
  }
  return pruefeKochbuch(daten);
}

/** Eine rezepte.json hat einige hundert Kilobyte. Eine viel grössere Datei ist sicher die falsche. */
export const MAX_BYTES = 20 * 1024 * 1024;

export async function ladeDatei(datei: Blob): Promise<Kochbuch> {
  // Vor dem Einlesen prüfen: Eine grosse, falsch gewählte Datei käme sonst ganz in den Speicher
  if (datei.size > MAX_BYTES) throw new DatenFehler('Die Datei ist zu gross für eine Rezeptdatei (höchstens 20 MB).');
  return ladeDaten(await datei.arrayBuffer());
}
