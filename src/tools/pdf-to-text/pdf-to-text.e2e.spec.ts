import { expect, test } from '@playwright/test';

test.describe('Tool - Pdf to text', () => {
  test.beforeEach(async ({ page }) => {
    await page.goto('/pdf-to-text');
  });

  test('Has correct title', async ({ page }) => {
    await expect(page).toHaveTitle('Pdf to text - IT Tools');
  });

  test('', async ({ page }) => {

  });
});
