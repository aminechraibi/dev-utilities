import { test, expect } from '@playwright/test';

test.describe('Tool - Statistics calculator', () => {
  test.beforeEach(async ({ page }) => {
    await page.goto('/statistics-calculator');
  });

  test('Has correct title', async ({ page }) => {
    await expect(page).toHaveTitle('Statistics calculator - IT Tools');
  });

  test('', async ({ page }) => {

  });
});