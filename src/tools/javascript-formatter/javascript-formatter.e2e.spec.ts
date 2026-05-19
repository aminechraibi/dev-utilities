import { test, expect } from '@playwright/test';

test.describe('Tool - Javascript formatter', () => {
  test.beforeEach(async ({ page }) => {
    await page.goto('/javascript-formatter');
  });

  test('Has correct title', async ({ page }) => {
    await expect(page).toHaveTitle('Javascript formatter - IT Tools');
  });

  test('', async ({ page }) => {

  });
});