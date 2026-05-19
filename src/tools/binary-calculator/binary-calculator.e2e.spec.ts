import { test, expect } from '@playwright/test';

test.describe('Tool - Binary calculator', () => {
  test.beforeEach(async ({ page }) => {
    await page.goto('/binary-calculator');
  });

  test('Has correct title', async ({ page }) => {
    await expect(page).toHaveTitle('Binary calculator - IT Tools');
  });

  test('', async ({ page: _page }) => {

  });
});