#!/usr/bin/env node
/**
 * Liest apps.json (Liste aller Apps) für CI und GitHub Pages und prüft, ob alles zusammenpasst.
 *   node scripts/apps.mjs pruefen   Ordner, Skripte, Weiterleitung und Karten auf der Startseite prüfen
 *   node scripts/apps.mjs ci        JSON-Liste der Ordner für den gemeinsamen CI-Job (ohne ci: "eigen")
 *   node scripts/apps.mjs website   Ordner, die auf die Website kommen, eine Zeile pro App
 * Ohne Abhängigkeiten, läuft mit jedem Node ab Version 18.
 */
import { existsSync, readdirSync, readFileSync } from 'node:fs';
import { dirname, join } from 'node:path';
import { fileURLToPath } from 'node:url';

const ROOT = join(dirname(fileURLToPath(import.meta.url)), '..');
const SKRIPTE = ['typecheck', 'test', 'build', 'test:e2e'];

export function ladeApps(root = ROOT) {
  const { apps } = JSON.parse(readFileSync(join(root, 'apps.json'), 'utf8'));
  if (!Array.isArray(apps)) throw new Error('apps.json: Feld "apps" fehlt');
  return apps;
}

/** Liefert die Fehler als Liste von Sätzen; leer heisst alles in Ordnung */
export function pruefe(root = ROOT) {
  const fehler = [];
  const apps = ladeApps(root);
  const startseite = readFileSync(join(root, 'index.html'), 'utf8');
  const verlinkt = (href) => startseite.includes(`href="${href}"`);
  const ordnerInListe = new Set();

  for (const app of apps) {
    const name = app.name ?? '(ohne Name)';
    if (!app.name) fehler.push('Eine App in apps.json hat keinen Namen.');
    if (app.ordner) {
      ordnerInListe.add(app.ordner);
      const pfad = join(root, app.ordner);
      const pkgPfad = join(pfad, 'package.json');
      if (!existsSync(pkgPfad)) {
        fehler.push(`${name}: Ordner ${app.ordner}/ mit package.json fehlt.`);
        continue;
      }
      const skripte = JSON.parse(readFileSync(pkgPfad, 'utf8')).scripts ?? {};
      for (const s of SKRIPTE) if (!skripte[s]) fehler.push(`${name}: package.json braucht das Skript "${s}".`);
      if (!existsSync(join(pfad, 'package-lock.json'))) fehler.push(`${name}: package-lock.json fehlt (npm install).`);
      if (app.website) {
        if (!existsSync(join(pfad, 'site', 'index.html'))) fehler.push(`${name}: ${app.ordner}/site/index.html (Weiterleitung auf app/) fehlt.`);
        if (!verlinkt(`${app.ordner}/app/`)) fehler.push(`${name}: die Startseite verlinkt die App nicht (index.html, Karte mit href="${app.ordner}/app/").`);
      } else if (verlinkt(`${app.ordner}/app/`)) {
        fehler.push(`${name}: ist auf der Startseite verlinkt, aber nicht veröffentlicht (website: false).`);
      }
    } else if (app.adresse) {
      if (!verlinkt(app.adresse)) fehler.push(`${name}: die Startseite verlinkt die App nicht (index.html, Karte mit href="${app.adresse}").`);
    } else {
      fehler.push(`${name}: braucht "ordner" (App in diesem Repo) oder "adresse" (App aus einem anderen Repo).`);
    }
  }

  // Jeder Ordner mit package.json ist eine App und gehört in die Liste
  for (const eintrag of readdirSync(root, { withFileTypes: true })) {
    if (!eintrag.isDirectory() || eintrag.name.startsWith('.') || eintrag.name === 'node_modules') continue;
    if (existsSync(join(root, eintrag.name, 'package.json')) && !ordnerInListe.has(eintrag.name)) {
      fehler.push(`Ordner ${eintrag.name}/ hat ein package.json, steht aber nicht in apps.json.`);
    }
  }
  return fehler;
}

function main(befehl) {
  const apps = ladeApps();
  if (befehl === 'ci') {
    console.log(JSON.stringify(apps.filter((a) => a.ordner && a.ci !== 'eigen').map((a) => a.ordner)));
  } else if (befehl === 'website') {
    console.log(apps.filter((a) => a.ordner && a.website).map((a) => a.ordner).join('\n'));
  } else if (befehl === 'pruefen') {
    const fehler = pruefe();
    if (fehler.length) {
      for (const f of fehler) console.error(`✗ ${f}`);
      process.exit(1);
    }
    console.log(`✓ apps.json passt: ${apps.length} Apps, Startseite und Ordner stimmen überein.`);
  } else {
    console.error('Aufruf: node scripts/apps.mjs pruefen | ci | website');
    process.exit(2);
  }
}

if (process.argv[1] && fileURLToPath(import.meta.url) === process.argv[1]) main(process.argv[2]);
