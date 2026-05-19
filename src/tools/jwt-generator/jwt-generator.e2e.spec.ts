import { test, expect } from '@playwright/test';

test.describe('Tool - Jwt generator', () => {
  test.beforeEach(async ({ page }) => {
    await page.goto('/jwt-generator');
  });

  test('Has correct title', async ({ page }) => {
    await expect(page).toHaveTitle('Jwt generator - IT Tools');
  });

  test('', async ({ page }) => {

  });
});