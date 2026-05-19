import { test, expect } from '@playwright/test';

test.describe('Tool - Html minifier', () => {
  test.beforeEach(async ({ page }) => {
    await page.goto('/html-minifier');
  });

  test('Has correct title', async ({ page }) => {
    await expect(page).toHaveTitle('Html minifier - IT Tools');
  });

  test('', async ({ page }) => {

  });
});