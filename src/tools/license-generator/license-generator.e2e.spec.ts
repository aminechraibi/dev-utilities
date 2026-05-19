import { test, expect } from '@playwright/test';

test.describe('Tool - License generator', () => {
  test.beforeEach(async ({ page }) => {
    await page.goto('/license-generator');
  });

  test('Has correct title', async ({ page }) => {
    await expect(page).toHaveTitle('License generator - IT Tools');
  });

  test('', async ({ page }) => {

  });
});