import { test, expect } from '@playwright/test';

test.describe('Tool - Html to markdown', () => {
  test.beforeEach(async ({ page }) => {
    await page.goto('/html-to-markdown');
  });

  test('Has correct title', async ({ page }) => {
    await expect(page).toHaveTitle('Html to markdown - IT Tools');
  });

  test('', async ({ page }) => {

  });
});