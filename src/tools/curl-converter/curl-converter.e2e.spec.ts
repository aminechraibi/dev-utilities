import { test, expect } from '@playwright/test';

test.describe('Tool - Curl converter', () => {
  test.beforeEach(async ({ page }) => {
    await page.goto('/curl-converter');
  });

  test('Has correct title', async ({ page }) => {
    await expect(page).toHaveTitle('Curl converter - IT Tools');
  });

  test('', async ({ page }) => {

  });
});