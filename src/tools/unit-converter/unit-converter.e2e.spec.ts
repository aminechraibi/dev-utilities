import { expect, test } from '@playwright/test';

test.describe('Tool - Unit converter', () => {
  test.beforeEach(async ({ page }) => {
    await page.goto('/unit-converter');
  });

  test('Has correct title', async ({ page }) => {
    await expect(page).toHaveTitle('Unit converter - IT Tools');
  });

  test('', async ({ page }) => {

  });
});
