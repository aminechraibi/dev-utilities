import { expect, test } from '@playwright/test';

test.describe('Tool - Base32 encoder', () => {
  test.beforeEach(async ({ page }) => {
    await page.goto('/base32-encoder');
  });

  test('Has correct title', async ({ page }) => {
    await expect(page).toHaveTitle('Base32 encoder - IT Tools');
  });

  test('', async ({ page: _page }) => {

  });
});
