/**
 * Link zur gemeinsamen Startseite mit allen Apps (Kochbuch, Lohnrechner, Haushalt …). Auf GitHub Pages relativ
 * (von /apps/taktwerk/app/ nach /apps/), sonst die veröffentlichte Adresse. Nur in der Web-App: Desktop-App und
 * Einzeldatei laufen für sich, dort würde der Link aus der App herausführen.
 */
import { isOldDesktop } from './desktop';

declare const __PP_BUILD__: 'web' | 'standalone' | 'desktop';

export const alleAppsUrl = (): string =>
  location.hostname.endsWith('github.io') ? '../../' : 'https://simonbruder-hub.github.io/apps/';

export const zeigeAlleApps = (): boolean =>
  (typeof __PP_BUILD__ === 'undefined' || __PP_BUILD__ === 'web') && !isOldDesktop();
