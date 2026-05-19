import { test, expect } from '@playwright/test';

test.describe('Tool - Image color picker', () => {
  test.beforeEach(async ({ page }) => {
    await page.goto('/image-color-picker');
  });

  test('Has correct title', async ({ page }) => {
    await expect(page).toHaveTitle('Image color picker - IT Tools');
  });

  test('', async ({ page }) => {

  });
});