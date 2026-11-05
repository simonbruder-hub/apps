/** Prüft das Grundgerüst: Rechnung, Fehlermeldung, Speicher, Weg zu allen Apps, schmale Bildschirme */
import { expect, test } from '@playwright/test';

test('rechnet das Beispiel', async ({ page }) => {
  await page.goto('./');
  await expect(page.getByRole('heading', { level: 1 })).toHaveText('Vorlage');
  const ergebnis = page.getByTestId('ergebnis');
  await expect(ergebnis.locator('.betrag')).toHaveText('2');
  await page.getByLabel('Widerstand R').fill("1'000");
  await page.getByLabel('Strom I').fill('0,005');
  await expect(ergebnis.locator('.betrag')).toHaveText('5');
  await expect(ergebnis).toContainText('0.025 W');
});

test('meldet ungültige Eingaben', async ({ page }) => {
  await page.goto('./');
  await page.getByLabel('Strom I').fill('viel');
  await expect(page.getByText('Zahl ab 0 eingeben')).toBeVisible();
  await expect(page.getByTestId('ergebnis')).toContainText('Bitte die Eingaben prüfen.');
});

test('merkt sich die Eingaben nach dem Neuladen', async ({ page }) => {
  await page.goto('./');
  await page.getByLabel('Widerstand R').fill('47');
  await page.reload();
  await expect(page.getByLabel('Widerstand R')).toHaveValue('47');
});

test('führt zurück zu allen Apps', async ({ page }) => {
  await page.goto('./');
  await expect(page.getByRole('link', { name: 'Alle Apps' })).toHaveAttribute('href', '../../');
});

test('passt auf schmale Bildschirme', async ({ page }) => {
  await page.setViewportSize({ width: 320, height: 640 });
  await page.goto('./');
  expect(await page.evaluate(() => document.documentElement.scrollWidth)).toBeLessThanOrEqual(320);
});
