import { test, expect } from '@playwright/test';

test.describe('Tool - Barcode generator', () => {
  test.beforeEach(async ({ page }) => {
    await page.goto('/barcode-generator');
  });

  test('Has correct title', async ({ page }) => {
    await expect(page).toHaveTitle('Barcode generator - IT Tools');
  });

  test('', async ({ page }) => {

  });
});