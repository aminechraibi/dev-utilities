import { expect, test } from '@playwright/test';

test.describe('Tool - Dotenv parser', () => {
  test.beforeEach(async ({ page }) => {
    await page.goto('/dotenv-parser');
  });

  test('Has correct title', async ({ page }) => {
    await expect(page).toHaveTitle('Dotenv parser - IT Tools');
  });

  test('', async ({ page }) => {

  });
});
