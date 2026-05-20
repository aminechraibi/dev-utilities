import { expect, test } from '@playwright/test';

test.describe('Tool - Html cleaner', () => {
  test.beforeEach(async ({ page }) => {
    await page.goto('/html-cleaner');
  });

  test('Has correct title', async ({ page }) => {
    await expect(page).toHaveTitle('Html cleaner - IT Tools');
  });

  test('', async ({ page }) => {

  });
});
