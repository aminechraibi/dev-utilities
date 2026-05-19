import { test, expect } from '@playwright/test';

test.describe('Tool - Number to words', () => {
  test.beforeEach(async ({ page }) => {
    await page.goto('/number-to-words');
  });

  test('Has correct title', async ({ page }) => {
    await expect(page).toHaveTitle('Number to words - IT Tools');
  });

  test('', async ({ page }) => {

  });
});