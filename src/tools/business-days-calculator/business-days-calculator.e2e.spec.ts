import { expect, test } from '@playwright/test';

test.describe('Tool - Business days calculator', () => {
  test.beforeEach(async ({ page }) => {
    await page.goto('/business-days-calculator');
  });

  test('Has correct title', async ({ page }) => {
    await expect(page).toHaveTitle('Business days calculator - IT Tools');
  });

  test('', async ({ page }) => {

  });
});
