import { test, expect } from '@playwright/test';

test.describe('Tool - Exif viewer', () => {
  test.beforeEach(async ({ page }) => {
    await page.goto('/exif-viewer');
  });

  test('Has correct title', async ({ page }) => {
    await expect(page).toHaveTitle('Exif viewer - IT Tools');
  });

  test('', async ({ page }) => {

  });
});