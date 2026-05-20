import { expect, test } from '@playwright/test';

test.describe('Tool - Csv to json', () => {
  test.beforeEach(async ({ page }) => {
    await page.goto('/csv-to-json');
  });

  test('Has correct title', async ({ page }) => {
    await expect(page).toHaveTitle('Csv to json - IT Tools');
  });

  test('', async ({ page }) => {

  });
});
