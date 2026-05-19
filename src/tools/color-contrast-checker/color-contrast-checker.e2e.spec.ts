import { test, expect } from '@playwright/test';

test.describe('Tool - Color contrast checker', () => {
  test.beforeEach(async ({ page }) => {
    await page.goto('/color-contrast-checker');
  });

  test('Has correct title', async ({ page }) => {
    await expect(page).toHaveTitle('Color contrast checker - IT Tools');
  });

  test('', async ({ page }) => {

  });
});