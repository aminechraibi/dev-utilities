import { expect, test } from '@playwright/test';

test.describe('Tool - Http header analyzer', () => {
  test.beforeEach(async ({ page }) => {
    await page.goto('/http-header-analyzer');
  });

  test('Has correct title', async ({ page }) => {
    await expect(page).toHaveTitle('Http header analyzer - IT Tools');
  });

  test('', async ({ page }) => {

  });
});
