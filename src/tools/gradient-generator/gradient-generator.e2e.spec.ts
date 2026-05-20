import { expect, test } from '@playwright/test';

test.describe('Tool - Gradient generator', () => {
  test.beforeEach(async ({ page }) => {
    await page.goto('/gradient-generator');
  });

  test('Has correct title', async ({ page }) => {
    await expect(page).toHaveTitle('Gradient generator - IT Tools');
  });

  test('', async ({ page }) => {

  });
});
