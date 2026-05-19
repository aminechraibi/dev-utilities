import { test, expect } from '@playwright/test';

test.describe('Tool - Ssl certificate decoder', () => {
  test.beforeEach(async ({ page }) => {
    await page.goto('/ssl-certificate-decoder');
  });

  test('Has correct title', async ({ page }) => {
    await expect(page).toHaveTitle('Ssl certificate decoder - IT Tools');
  });

  test('', async ({ page }) => {

  });
});