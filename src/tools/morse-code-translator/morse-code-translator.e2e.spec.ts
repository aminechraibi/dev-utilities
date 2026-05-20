import { expect, test } from '@playwright/test';

test.describe('Tool - Morse code translator', () => {
  test.beforeEach(async ({ page }) => {
    await page.goto('/morse-code-translator');
  });

  test('Has correct title', async ({ page }) => {
    await expect(page).toHaveTitle('Morse code translator - IT Tools');
  });

  test('', async ({ page }) => {

  });
});
