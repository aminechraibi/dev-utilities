import { test, expect } from '@playwright/test';

test.describe('Tool - Color palette generator', () => {
  test.beforeEach(async ({ page }) => {
    await page.goto('/color-palette-generator');
  });

  test('Has correct title', async ({ page }) => {
    await expect(page).toHaveTitle('Color palette generator - IT Tools');
  });

  test('', async ({ page }) => {

  });
});