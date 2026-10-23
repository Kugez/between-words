import { test, expect } from '@playwright/test';
import { PAGES, LETTER } from '../src/data/river.js';
import { PAGES as MOUNTAIN_PAGES, BRIDGE_ROUNDS } from '../src/data/mountain.js';

// Plays the whole game the way a player would, with animations shortened so
// the test runs quickly.
test.use({ reducedMotion: 'reduce' });

test.beforeEach(async ({ page }) => {
  page.on('pageerror', (error) => {
    throw error;
  });
});

const meaning = (glyph) => glyph.replace(/^m_/, '');

async function enterVillage(page) {
  await page.goto('/');
  await page.locator('[data-action="new-game"]').click();
  await page.locator('[data-action="enter-village"]').click();
  await expect(page.locator('[data-scene="village"]')).toBeVisible();
}

async function finishConversation(page) {
  const next = page.locator('.scene:not(.scene--leaving) [data-action="advance"]');
  while (await next.isVisible()) await next.click();
}

async function talkTo(page, who) {
  await page.locator(`[data-hotspot="${who}"]`).click();
  await expect(page.locator('.scene:not(.scene--leaving) [data-action="advance"]')).toBeVisible();
  await finishConversation(page);
}

async function choose(page, glyph, word) {
  await page.locator(`[data-guess="${glyph}"]`).selectOption(word);
}

async function confirmPages(page, pages) {
  await page.locator('[data-action="notebook"]').click();
  for (const p of pages) {
    await page.locator(`[data-page="${p.id}"]`).click();
    for (const glyph of p.glyphs) await choose(page, glyph, meaning(glyph));
    await expect(page.locator('.notebook__status')).toHaveAttribute('data-status', 'confirmed');
  }
  await page.locator('.overlay [data-action="close"]').click();
}

async function write(page, glyphs) {
  const pad = page.locator('.overlay--writer');
  for (const g of glyphs) await pad.locator(`[data-key="${g}"]`).click();
  await pad.locator('[data-action="send"]').click();
}

// Clicks Continue until the writing pad opens or the given scene appears.
async function continueUntil(page, done) {
  const next = page.locator('.scene:not(.scene--leaving) [data-action="advance"]');
  for (let i = 0; i < 200; i++) {
    if (await done.isVisible()) return;
    if (await next.isVisible() && await next.isEnabled()) await next.click().catch(() => {});
    else await page.waitForTimeout(50);
  }
  throw new Error('Timed out waiting for the next step');
}

test('the whole game can be played from start to finish', async ({ page }) => {
  // Chapter 1: the river village.
  await enterVillage(page);
  for (const who of ['fisher', 'child', 'baker', 'elder']) await talkTo(page, who);

  // Tapping a glyph in a speech bubble opens the notebook on its page.
  await page.locator('[data-hotspot="fisher"]').click();
  await page.locator('.bubble [data-glyph="mina"]').first().click();
  await expect(page.locator('.overlay--notebook [data-card="mina"]')).toBeVisible();
  await page.locator('.overlay [data-action="close"]').click();
  await finishConversation(page);

  // A wrong set of guesses is rejected without saying which one is wrong.
  await page.locator('[data-action="notebook"]').click();
  const status = page.locator('.notebook__status');
  await page.locator('[data-page="IV"]').click();
  await choose(page, 'ei', 'kylla');
  await choose(page, 'monta', 'monta');
  await choose(page, 'silta', 'silta');
  await expect(status).toHaveAttribute('data-status', 'wrong');
  await choose(page, 'ei', 'ei');
  await expect(status).toHaveAttribute('data-status', 'confirmed');
  await expect(page.locator('[data-guess="ei"]')).toBeDisabled();
  await page.locator('.overlay [data-action="close"]').click();
  await confirmPages(page, PAGES.filter((p) => p.id !== 'IV'));

  // Confirmed glyphs are translated in speech bubbles.
  await page.locator('[data-hotspot="elder"]').click();
  await expect(page.locator('.bubble .bubble__caption').first()).toBeVisible();
  await finishConversation(page);

  // The child's letter: wrong tries bring hints, the right one ends the chapter.
  await talkTo(page, 'child');
  const pad = page.locator('.overlay--writer');
  await expect(pad).toBeVisible();
  await write(page, ['kala']);
  await expect(pad.locator('[data-feedback="wrong"]')).toBeVisible();
  await pad.locator('[data-action="erase"]').click();
  await write(page, ['kala']);
  await expect(pad.locator('.writer__hints li')).toHaveCount(1);
  await pad.locator('[data-action="erase"]').click();
  await write(page, LETTER);
  await expect(page.locator('[data-scene="ending"]')).toBeVisible();

  // Chapter 2: the mountain camp.
  await page.locator('[data-action="continue-journey"]').click();
  await page.locator('[data-action="enter-camp"]').click();
  await expect(page.locator('[data-scene="camp"]')).toBeVisible();
  for (const who of ['mason', 'smith', 'friend', 'chief']) await talkTo(page, who);
  await confirmPages(page, MOUNTAIN_PAGES);

  // The chief leads the way to the bridge.
  await page.locator('[data-hotspot="chief"]').click();
  await finishConversation(page);
  await expect(page.locator('[data-scene="bridge"]')).toBeVisible();

  // Chapter 3: translate every message across the gap.
  const finale = page.locator('[data-scene="finale"]');
  for (const [i, round] of BRIDGE_ROUNDS.entries()) {
    await continueUntil(page, pad);
    if (i === 0) {
      // A word-for-word copy keeps the river word order and is not understood.
      await write(page, round.say.map((g) => `m_${g}`));
      await expect(pad.locator('[data-feedback="wrong"]')).toBeVisible();
      await pad.locator('[data-action="erase"]').click();
      await pad.locator('[data-action="erase"]').click();
      await pad.locator('[data-action="erase"]').click();
    }
    await write(page, round.answer);
  }
  await continueUntil(page, finale);
  await expect(finale).toBeVisible();

  // Finishing is remembered.
  await page.reload();
  await page.locator('[data-action="continue"]').click();
  await expect(finale).toBeVisible();
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

test('mountain pages stay hidden until the river is crossed', async ({ page }) => {
  await enterVillage(page);
  await page.locator('[data-action="notebook"]').click();
  await expect(page.locator('[data-page="I"]')).toBeVisible();
  await expect(page.locator('[data-page="V"]')).toHaveCount(0);
});
