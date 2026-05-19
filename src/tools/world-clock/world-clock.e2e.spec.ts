import { test, expect } from '@playwright/test';

test.describe('Tool - World clock', () => {
  test.beforeEach(async ({ page }) => {
    await page.goto('/world-clock');
  });

  test('Has correct title', async ({ page }) => {
    await expect(page).toHaveTitle('World clock - IT Tools');
  });

  test('', async ({ page }) => {

  });
});