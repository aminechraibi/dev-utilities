import { expect, test } from '@playwright/test';

test.describe('Tool - Duration calculator', () => {
  test.beforeEach(async ({ page }) => {
    await page.goto('/duration-calculator');
  });

  test('Has correct title', async ({ page }) => {
    await expect(page).toHaveTitle('Duration calculator - IT Tools');
  });

  test('', async ({ page }) => {

  });
});
