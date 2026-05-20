import { expect, test } from '@playwright/test';

test.describe('Tool - Markdown html converter', () => {
  test.beforeEach(async ({ page }) => {
    await page.goto('/markdown-html-converter');
  });

  test('Has correct title', async ({ page }) => {
    await expect(page).toHaveTitle('Markdown html converter - IT Tools');
  });

  test('', async ({ page }) => {

  });
});
