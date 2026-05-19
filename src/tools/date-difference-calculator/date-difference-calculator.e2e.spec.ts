import { test, expect } from '@playwright/test';

test.describe('Tool - Date difference calculator', () => {
  test.beforeEach(async ({ page }) => {
    await page.goto('/date-difference-calculator');
  });

  test('Has correct title', async ({ page }) => {
    await expect(page).toHaveTitle('Date difference calculator - IT Tools');
  });

  test('', async ({ page }) => {

  });
});