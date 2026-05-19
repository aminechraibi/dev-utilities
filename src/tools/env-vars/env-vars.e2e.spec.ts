import { test, expect } from '@playwright/test';

test.describe('Tool - Env vars', () => {
  test.beforeEach(async ({ page }) => {
    await page.goto('/env-vars');
  });

  test('Has correct title', async ({ page }) => {
    await expect(page).toHaveTitle('Env vars - IT Tools');
  });

  test('', async ({ page }) => {

  });
});