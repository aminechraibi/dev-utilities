import { test, expect } from '@playwright/test';

test.describe('Tool - Css formatter', () => {
  test.beforeEach(async ({ page }) => {
    await page.goto('/css-formatter');
  });

  test('Has correct title', async ({ page }) => {
    await expect(page).toHaveTitle('Css formatter - IT Tools');
  });

  test('', async ({ page }) => {

  });
});