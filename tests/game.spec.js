import { test, expect } from '@playwright/test';

test.beforeEach(async ({ page }) => {
  page.on('pageerror', (error) => {
    throw error;
  });
});

test('title screen loads without errors', async ({ page }) => {
  const consoleErrors = [];
  page.on('console', (msg) => msg.type() === 'error' && consoleErrors.push(msg.text()));
  await page.goto('/');
  await expect(page.locator('[data-scene="title"] h1')).toBeVisible();
  await expect(page.locator('[data-action="new-game"]')).toBeVisible();
  expect(consoleErrors).toEqual([]);
});

test('language can be switched both ways', async ({ page }) => {
  await page.goto('/');
  const before = await page.locator('h1').textContent();
  await page.locator('[data-action="language"]').click();
  await expect(page.locator('[data-scene="title"]:not(.scene--leaving) h1')).not.toHaveText(before);
  await page.locator('[data-scene="title"]:not(.scene--leaving) [data-action="language"]').click();
  await expect(page.locator('[data-scene="title"]:not(.scene--leaving) h1')).toHaveText(before);
});

test('starting a game reaches the valley and progress survives a reload', async ({ page }) => {
  await page.goto('/');
  await expect(page.locator('[data-action="continue"]')).toHaveCount(0);
  await page.locator('[data-action="new-game"]').click();
  await expect(page.locator('[data-scene="arrival"] .text')).toBeVisible();

  await page.reload();
  await page.locator('[data-action="continue"]').click();
  await expect(page.locator('[data-scene="arrival"] .text')).toBeVisible();
});
