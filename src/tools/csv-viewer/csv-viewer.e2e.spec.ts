import { test, expect } from '@playwright/test';

test.describe('Tool - Csv viewer', () => {
  test.beforeEach(async ({ page }) => {
    await page.goto('/csv-viewer');
  });

  test('Has correct title', async ({ page }) => {
    await expect(page).toHaveTitle('Csv viewer - IT Tools');
  });

  test('', async ({ page }) => {

  });
});