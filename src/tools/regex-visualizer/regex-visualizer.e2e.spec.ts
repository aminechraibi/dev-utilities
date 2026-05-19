import { test, expect } from '@playwright/test';

test.describe('Tool - Regex visualizer', () => {
  test.beforeEach(async ({ page }) => {
    await page.goto('/regex-visualizer');
  });

  test('Has correct title', async ({ page }) => {
    await expect(page).toHaveTitle('Regex visualizer - IT Tools');
  });

  test('', async ({ page }) => {

  });
});