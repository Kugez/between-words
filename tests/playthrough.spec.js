import { test, expect } from '@playwright/test';
import { PAGES, LETTER } from '../src/data/river.js';

// Plays the whole first chapter the way a player would, with animations
// shortened so the test runs quickly.
test.use({ reducedMotion: 'reduce' });

test.beforeEach(async ({ page }) => {
  page.on('pageerror', (error) => {
    throw error;
  });
});

async function enterVillage(page) {
  await page.goto('/');
  await page.locator('[data-action="new-game"]').click();
  await page.locator('[data-action="enter-village"]').click();
  await expect(page.locator('[data-scene="village"]')).toBeVisible();
}

async function talkTo(page, who) {
  await page.locator(`[data-hotspot="${who}"]`).click();
  const next = page.locator('[data-action="advance"]');
  await expect(next).toBeVisible();
  while (await next.isVisible()) {
    await next.click();
  }
}

async function choose(page, glyph, word) {
  await page.locator(`[data-guess="${glyph}"]`).selectOption(word);
}

test('the first chapter can be played from start to finish', async ({ page }) => {
  await enterVillage(page);

  for (const who of ['fisher', 'child', 'baker', 'elder']) {
    await talkTo(page, who);
  }

  // Tapping a glyph in a speech bubble opens the notebook on its page.
  await page.locator('[data-hotspot="fisher"]').click();
  await page.locator('.bubble [data-glyph="mina"]').first().click();
  await expect(page.locator('.overlay--notebook [data-card="mina"]')).toBeVisible();
  await page.locator('.overlay [data-action="close"]').click();
  const next = page.locator('[data-action="advance"]');
  while (await next.isVisible()) await next.click();

  await page.locator('[data-action="notebook"]').click();
  const status = page.locator('.notebook__status');

  // A wrong set of guesses is rejected without saying which one is wrong.
  await page.locator('[data-page="IV"]').click();
  await choose(page, 'ei', 'kylla');
  await choose(page, 'monta', 'monta');
  await expect(status).toHaveAttribute('data-status', 'wrong');
  await choose(page, 'ei', 'ei');
  await expect(status).toHaveAttribute('data-status', 'confirmed');
  await expect(page.locator('[data-guess="ei"]')).toBeDisabled();

  for (const p of PAGES.filter((p) => p.id !== 'IV')) {
    await page.locator(`[data-page="${p.id}"]`).click();
    for (const glyph of p.glyphs) await choose(page, glyph, glyph);
    await expect(status).toHaveAttribute('data-status', 'confirmed');
  }
  await page.locator('.overlay [data-action="close"]').click();

  // Confirmed glyphs are translated in speech bubbles.
  await page.locator('[data-hotspot="elder"]').click();
  await expect(page.locator('.bubble .bubble__caption').first()).toBeVisible();
  while (await next.isVisible()) await next.click();

  // The child now asks for help with a letter.
  await talkTo(page, 'child');
  const letter = page.locator('.overlay--letter');
  await expect(letter).toBeVisible();

  await letter.locator('[data-key="kala"]').click();
  await letter.locator('[data-action="send"]').click();
  await expect(letter.locator('[data-feedback="wrong"]')).toBeVisible();
  await letter.locator('[data-action="erase"]').click();

  for (const glyph of LETTER) await letter.locator(`[data-key="${glyph}"]`).click();
  await letter.locator('[data-action="send"]').click();
  await expect(page.locator('[data-scene="ending"]')).toBeVisible();

  // Finishing is remembered.
  await page.reload();
  await page.locator('[data-action="continue"]').click();
  await expect(page.locator('[data-scene="ending"]')).toBeVisible();
});

test('progress in the notebook survives a reload', async ({ page }) => {
  await enterVillage(page);
  await talkTo(page, 'fisher');
  await page.locator('[data-action="notebook"]').click();
  await page.locator('[data-page="I"]').click();
  await choose(page, 'mina', 'mina');
  await expect(page.locator('[data-card="lapsi"] [data-guess="lapsi"]')).toBeVisible();

  await page.reload();
  await page.locator('[data-action="continue"]').click();
  await page.locator('[data-action="notebook"]').click();
  await page.locator('[data-page="I"]').click();
  await expect(page.locator('[data-guess="mina"]')).toHaveValue('mina');
});
